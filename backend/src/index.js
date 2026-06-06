const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Use express.json() for all routes except Stripe webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Database setup
const dbPath = process.env.DATABASE_URL || path.join(__dirname, '..', 'database', 'dev.db');
const db = new Database(dbPath);

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

// --- Routes ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Rise & Structure API is running' });
});

// Auth: Register
app.post('/api/auth/register', async (req, res) => {
  const { email, password, full_name } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    
    db.prepare('INSERT INTO users (id, email, password, full_name) VALUES (?, ?, ?, ?)').run(
      userId, email, hashedPassword, full_name
    );

    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: userId, email, full_name, tier: 'starter' } });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Auth: Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ 
    token, 
    user: { id: user.id, email: user.email, full_name: user.full_name, tier: user.tier, subscription_status: user.subscription_status } 
  });
});

// User: Me
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, email, full_name, tier, subscription_status FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

// User: Stats
app.get('/api/user/stats', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  // Calculate completion by pillar
  const stats = db.prepare(`
    SELECT 
      pillar,
      COUNT(*) as total,
      SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed
    FROM daily_content c
    LEFT JOIN user_progress p ON c.id = p.content_id AND p.user_id = ?
    GROUP BY pillar
  `).all(userId);

  // Calculate streak (very simple version: count consecutive days with at least one completion)
  // Real version would be more complex, but let's do a basic count for now
  const streakResult = db.prepare(`
    SELECT COUNT(DISTINCT date(completed_at)) as streak
    FROM user_progress
    WHERE user_id = ? AND completed = 1
  `).get(userId);

  res.json({
    pillars: stats,
    streak: streakResult.streak || 0
  });
});

// Content: Daily Plan
app.get('/api/daily-plan', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT tier FROM users WHERE id = ?').get(req.user.id);
  
  // Rotation logic: determine today's day and week
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday
  // Simple week toggle based on current date
  const weekType = (Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000)) % 2 === 0) ? 'A' : 'B';

  const content = db.prepare(`
    SELECT c.*, p.completed 
    FROM daily_content c
    LEFT JOIN user_progress p ON c.id = p.content_id AND p.user_id = ?
    WHERE c.day_of_week = ? AND c.week_type = ? AND c.difficulty = ?
  `).all(req.user.id, dayOfWeek, weekType, user.tier);

  res.json({
    date: now.toISOString().split('T')[0],
    week: weekType,
    day: dayOfWeek,
    tasks: content
  });
});

// Content: Complete Task
app.post('/api/tasks/:taskId/complete', authenticateToken, (req, res) => {
  const { taskId } = req.params;
  const { notes } = req.body;

  try {
    db.prepare(`
      INSERT INTO user_progress (id, user_id, content_id, completed, notes)
      VALUES (?, ?, ?, 1, ?)
      ON CONFLICT(user_id, content_id) DO UPDATE SET
        completed = 1,
        notes = excluded.notes,
        completed_at = CURRENT_TIMESTAMP
    `).run(uuidv4(), req.user.id, taskId, notes);
    
    res.json({ message: 'Task completed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mock Subscription: Start
app.post('/api/subscriptions/mock-activate', authenticateToken, (req, res) => {
  db.prepare('UPDATE users SET subscription_status = "active" WHERE id = ?').run(req.user.id);
  res.json({ message: 'Subscription activated' });
});

// --- Community Routes ---

// List all posts
app.get('/api/community/posts', authenticateToken, (req, res) => {
  const posts = db.prepare(`
    SELECT p.*, u.full_name as author_name, 
    (SELECT COUNT(*) FROM community_comments WHERE post_id = p.id) as comment_count
    FROM community_posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `).all();
  res.json(posts);
});

// Create a post
app.post('/api/community/posts', authenticateToken, (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Title and content required' });

  const id = uuidv4();
  db.prepare('INSERT INTO community_posts (id, user_id, title, content) VALUES (?, ?, ?, ?)').run(
    id, req.user.id, title, content
  );
  res.status(201).json({ id, title, content });
});

// Get post with comments
app.get('/api/community/posts/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const post = db.prepare(`
    SELECT p.*, u.full_name as author_name 
    FROM community_posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `).get(id);

  if (!post) return res.status(404).json({ message: 'Post not found' });

  const comments = db.prepare(`
    SELECT c.*, u.full_name as author_name
    FROM community_comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
  `).all(id);

  res.json({ ...post, comments });
});

// Reply to post
app.post('/api/community/posts/:id/comments', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Comment content required' });

  const commentId = uuidv4();
  db.prepare('INSERT INTO community_comments (id, post_id, user_id, content) VALUES (?, ?, ?, ?)').run(
    commentId, id, req.user.id, content
  );
  res.status(201).json({ id: commentId, content });
});

// --- Stripe Routes ---

app.post('/api/payments/create-checkout-session', authenticateToken, async (req, res) => {
  const { priceId, tier } = req.body;
  
  try {
    const user = db.prepare('SELECT stripe_customer_id, email FROM users WHERE id = ?').get(req.user.id);
    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email });
      customerId = customer.id;
      db.prepare('UPDATE users SET stripe_customer_id = ? WHERE id = ?').run(customerId, req.user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/#pricing`,
      metadata: { userId: req.user.id, tier }
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Stripe Webhook
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const tier = session.metadata.tier;

    db.prepare('UPDATE users SET tier = ?, subscription_status = "active" WHERE id = ?').run(tier, userId);
  }

  if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
    const subscription = event.data.object;
    const status = subscription.status === 'active' ? 'active' : 'inactive';
    
    // Find user by stripe customer id
    db.prepare('UPDATE users SET subscription_status = ? WHERE stripe_customer_id = ?').run(status, subscription.customer);
  }

  res.json({ received: true });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
