const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./db');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { sendWelcomeEmail } = require('./email');
const webpush = require('web-push');

// VAPID keys should be in .env in production
const publicVapidKey = process.env.PUBLIC_VAPID_KEY || 'BAhVx7mMQF0acNtFL5VXzWfiuBRozpjAoDkGjwvMg8XFy0TtebMj65BvO50h9wi9bUfD1DfHWlOxroKkTM3NqCk';
const privateVapidKey = process.env.PRIVATE_VAPID_KEY || 'wMMPO1Pi6Qtcsqjl1ClrSzmUEHl57-v2sW5I1bCy3Qs';

webpush.setVapidDetails(
  'mailto:support@riseandstructure.com',
  publicVapidKey,
  privateVapidKey
);

let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn('STRIPE_SECRET_KEY not set. Payment features will be disabled.');
}

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Middleware
const corsOptions = {
  origin: [
    'https://www.riseandstructure.com',
    'https://riseandstructure.com',
    /\.onrender\.com$/,
    'http://localhost:5173'
  ],
  credentials: true
};
app.use(cors(corsOptions));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
      "img-src": ["'self'", "data:", "https://*", "blob:"],
      "connect-src": ["'self'", "https://*", "http://localhost:*"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(morgan('dev'));

// Use express.json() for all routes except Stripe webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

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
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);
    
    await db.query('INSERT INTO users (id, email, password, full_name, trial_ends_at, subscription_status) VALUES ($1, $2, $3, $4, $5, $6)', [
      userId, email, hashedPassword, full_name, trialEndsAt.toISOString(), "active"
    ]);

    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '24h' });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, full_name).catch(console.error);

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
  const user = await db.get('SELECT * FROM users WHERE email = $1', [email]);

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
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  const user = await db.get('SELECT id, email, full_name, tier, subscription_status, trial_ends_at FROM users WHERE id = $1', [req.user.id]);
  res.json(user);
});

// User: Stats
app.get('/api/user/stats', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  
  // Calculate completion by pillar
  const stats = await db.all(`
    SELECT 
      pillar,
      COUNT(*) as total,
      SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) as completed
    FROM daily_content c
    LEFT JOIN user_progress p ON c.id = p.content_id AND p.user_id = $1
    GROUP BY pillar
  `, [userId]);

  // Calculate streak
  const streakResult = await db.get(`
    SELECT COUNT(DISTINCT date(completed_at)) as streak
    FROM user_progress
    WHERE user_id = $1 AND completed = true
  `, [userId]);

  res.json({
    pillars: stats,
    streak: streakResult.streak || 0
  });
});

// User: History
app.get('/api/user/history', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  
  const history = await db.all(`
    SELECT 
      date(completed_at) as date,
      COUNT(*) as count
    FROM user_progress
    WHERE user_id = $1 AND completed = true
    GROUP BY date(completed_at)
    ORDER BY date DESC
    LIMIT 30
  `, [userId]);

  res.json(history);
});

// Community: Posts
app.get('/api/community/posts', authenticateToken, async (req, res) => {
  const posts = await db.all(`
    SELECT p.*, u.full_name, u.avatar_url,
    (SELECT COUNT(*) FROM community_comments WHERE post_id = p.id) as comment_count,
    (SELECT COUNT(*) FROM community_reactions WHERE post_id = p.id) as reaction_count
    FROM community_posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `);
  res.json(posts);
});

app.post('/api/community/posts', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  const id = uuidv4();
  await db.query('INSERT INTO community_posts (id, user_id, title, content) VALUES ($1, $2, $3, $4)', [
    id, req.user.id, title, content
  ]);
  res.status(201).json({ id });
});

app.get('/api/community/posts/:id/comments', authenticateToken, async (req, res) => {
  const comments = await db.all(`
    SELECT c.*, u.full_name, u.avatar_url
    FROM community_comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC
  `, [req.params.id]);
  res.json(comments);
});

app.post('/api/community/posts/:id/comments', authenticateToken, async (req, res) => {
  const { content } = req.body;
  const id = uuidv4();
  await db.query('INSERT INTO community_comments (id, post_id, user_id, content) VALUES ($1, $2, $3, $4)', [
    id, req.params.id, req.user.id, content
  ]);
  res.status(201).json({ id });
});

app.post('/api/community/posts/:id/react', authenticateToken, async (req, res) => {
  const { type } = req.body;
  const id = uuidv4();
  try {
    await db.query('INSERT INTO community_reactions (id, post_id, user_id, type) VALUES ($1, $2, $3, $4)', [
      id, req.params.id, req.user.id, type
    ]);
    res.status(201).json({ success: true });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed') || err.message.includes('unique constraint')) {
      await db.query('DELETE FROM community_reactions WHERE post_id = $1 AND user_id = $2 AND type = $3', [
        req.params.id, req.user.id, type
      ]);
      return res.json({ success: true, removed: true });
    }
    res.status(500).json({ message: 'Error reacting' });
  }
});

// Map: Members
app.get('/api/map/members', authenticateToken, async (req, res) => {
  const members = await db.all(`
    SELECT id, full_name, avatar_url, location_name, latitude, longitude, interests, tier
    FROM users
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL
  `);
  res.json(members);
});

app.post('/api/user/location', authenticateToken, async (req, res) => {
  const { location_name, latitude, longitude, interests } = req.body;
  await db.query(`
    UPDATE users 
    SET location_name = $1, latitude = $2, longitude = $3, interests = $4
    WHERE id = $5
  `, [location_name, latitude, longitude, interests, req.user.id]);
  res.json({ success: true });
});

// Push: Subscriptions
app.post('/api/notifications/subscribe', authenticateToken, async (req, res) => {
  const subscription = req.body;
  const id = uuidv4();
  
  await db.query('DELETE FROM push_subscriptions WHERE user_id = $1', [req.user.id]);
  await db.query('INSERT INTO push_subscriptions (id, user_id, subscription_json) VALUES ($1, $2, $3)', [
    id, req.user.id, JSON.stringify(subscription)
  ]);
  
  res.status(201).json({ success: true });
});

app.post('/api/notifications/test', authenticateToken, async (req, res) => {
  const sub = await db.get('SELECT subscription_json FROM push_subscriptions WHERE user_id = $1', [req.user.id]);
  
  if (!sub) {
    return res.status(404).json({ message: 'No subscription found' });
  }

  const payload = JSON.stringify({
    title: 'Rise & Structure',
    body: 'Push notifications are active!',
    icon: '/logo.png'
  });

  webpush.sendNotification(JSON.parse(sub.subscription_json), payload)
    .then(() => res.json({ success: true }))
    .catch(err => {
      console.error('Push test failed:', err);
      res.status(500).json({ message: 'Push failed' });
    });
});

// Content: Daily Plan
app.get('/api/daily-plan', authenticateToken, async (req, res) => {
  const user = await db.get('SELECT tier FROM users WHERE id = $1', [req.user.id]);
  
  // Rotation logic: determine today's day and week
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday
  // Simple week toggle based on current date
  const weekType = (Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000)) % 2 === 0) ? 'A' : 'B';

  const content = await db.all(`
    SELECT c.*, p.completed 
    FROM daily_content c
    LEFT JOIN user_progress p ON c.id = p.content_id AND p.user_id = $1
    WHERE c.day_of_week = $2 AND c.week_type = $3 AND c.difficulty = $4
  `, [req.user.id, dayOfWeek, weekType, user.tier]);

  res.json({
    date: now.toISOString().split('T')[0],
    week: weekType,
    day: dayOfWeek,
    tasks: content
  });
});

// Content: Complete Task
app.post('/api/tasks/:taskId/complete', authenticateToken, async (req, res) => {
  const { taskId } = req.params;
  const { notes } = req.body;

  try {
    await db.query(`
      INSERT INTO user_progress (id, user_id, content_id, completed, notes)
      VALUES ($1, $2, $3, true, $4)
      ON CONFLICT(user_id, content_id) DO UPDATE SET
        completed = true,
        notes = EXCLUDED.notes,
        completed_at = CURRENT_TIMESTAMP
    `, [uuidv4(), req.user.id, taskId, notes]);
    
    res.json({ message: 'Task completed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mock Subscription: Start
app.post('/api/subscriptions/mock-activate', authenticateToken, async (req, res) => {
  await db.query('UPDATE users SET subscription_status = $1 WHERE id = $2', ["active", req.user.id]);
  res.json({ message: 'Subscription activated' });
});

// --- Community Routes (Legacy/Duplicate) ---
// Note: Keeping for compatibility if needed, but updated to async
app.get('/api/community/posts/list', authenticateToken, async (req, res) => {
  const posts = await db.all(`
    SELECT p.*, u.full_name as author_name, 
    (SELECT COUNT(*) FROM community_comments WHERE post_id = p.id) as comment_count
    FROM community_posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `);
  res.json(posts);
});

// Get post with comments
app.get('/api/community/posts/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const post = await db.get(`
    SELECT p.*, u.full_name as author_name 
    FROM community_posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = $1
  `, [id]);

  if (!post) return res.status(404).json({ message: 'Post not found' });

  const comments = await db.all(`
    SELECT c.*, u.full_name as author_name
    FROM community_comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC
  `, [id]);

  res.json({ ...post, comments });
});

// --- Course Routes ---

// List all courses (Public)
app.get('/api/courses', async (req, res) => {
  const courses = await db.all('SELECT id, slug, title, description, price_cents, difficulty FROM courses');
  
  // Optional: Check ownership if token is present
  let ownedCourses = [];
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userCourses = await db.all('SELECT course_id FROM user_courses WHERE user_id = $1', [decoded.id]);
      ownedCourses = userCourses.map(c => c.course_id);
    } catch (err) {
      // Ignore invalid token for public listing
    }
  }
  
  const coursesWithOwnership = courses.map(course => ({
    ...course,
    is_owned: ownedCourses.includes(course.id)
  }));
  
  res.json(coursesWithOwnership);
});

// Mock Course Purchase
app.post('/api/courses/:courseId/mock-purchase', authenticateToken, async (req, res) => {
  const { courseId } = req.params;
  // SQLite and PG support ON CONFLICT
  await db.query('INSERT INTO user_courses (user_id, course_id) VALUES ($1, $2) ON CONFLICT(user_id, course_id) DO NOTHING', [req.user.id, courseId]);
  res.json({ message: 'Course purchased (mock)' });
});

// --- Stripe Routes ---

app.post('/api/payments/create-course-checkout', async (req, res) => {
  const { courseId, successUrl, cancelUrl } = req.body;
  
  if (!stripe) {
    return res.status(503).json({ message: 'Payment service unavailable' });
  }

  try {
    const course = await db.get('SELECT * FROM courses WHERE id = $1 OR slug = $2', [courseId, courseId]);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (!stripe) {
      return res.status(503).json({ message: 'Payment service unavailable' });
    }

    // Optional: Get user if token present
    let userId = null;
    let customerId = null;
    let customerEmail = null;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
        const user = await db.get('SELECT email, stripe_customer_id FROM users WHERE id = $1', [userId]);
        customerEmail = user?.email;
        customerId = user?.stripe_customer_id;
      } catch (err) {}
    }

    // Map course slug to Stripe Price ID from env
    let priceId = null;
    if (course.slug === 'health-foundations') priceId = process.env.COURSE_PRICE_HEALTH;
    if (course.slug === 'side-income-starter') priceId = process.env.COURSE_PRICE_SIDE_INCOME;
    if (course.slug === 'mental-discipline') priceId = process.env.COURSE_PRICE_MENTAL;

    const sessionOptions = {
      line_items: priceId ? [{ price: priceId, quantity: 1 }] : [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: course.title,
            description: course.title + ' - Digital Course',
          },
          unit_amount: course.price_cents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: successUrl || `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&course_id=${course.id}`,
      cancel_url: cancelUrl || `${req.headers.origin}/store`,
      metadata: { 
        userId: userId, 
        courseId: course.id,
        type: 'course_purchase'
      }
    };

    if (customerId) {
      sessionOptions.customer = customerId;
    } else if (customerEmail) {
      sessionOptions.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/payments/create-checkout-session', authenticateToken, async (req, res) => {
  const { priceId: bodyPriceId, tier, courseId } = req.body;
  
  if (!stripe) {
    return res.status(503).json({ 
      message: 'Payment service is currently unavailable. Please use the mock activation for testing.',
      is_mock_available: true
    });
  }
  
  try {
    const user = await db.get('SELECT stripe_customer_id, email FROM users WHERE id = $1', [req.user.id]);
    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email });
      customerId = customer.id;
      await db.query('UPDATE users SET stripe_customer_id = $1 WHERE id = $2', [customerId, req.user.id]);
    }

    // Map tier to Price ID from env
    let finalPriceId = bodyPriceId;
    if (tier === 'starter') finalPriceId = process.env.STRIPE_PRICE_STARTER || finalPriceId;
    if (tier === 'builder') finalPriceId = process.env.STRIPE_PRICE_BUILDER || finalPriceId;
    if (tier === 'thriver') finalPriceId = process.env.STRIPE_PRICE_THRIVER || finalPriceId;

    if (!finalPriceId && !courseId) {
      return res.status(400).json({ message: 'No Price ID configured for this tier' });
    }

    const mode = (courseId || !finalPriceId) ? 'payment' : 'subscription';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: finalPriceId, quantity: 1 }],
      mode: mode,
      success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}${courseId ? '&course_id=' + courseId : ''}`,
      cancel_url: `${req.headers.origin}/dashboard/store`,
      metadata: { userId: req.user.id, tier, courseId }
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Stripe Webhook
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) {
    return res.status(503).send('Webhook service unavailable');
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    let userId = session.metadata.userId;
    const tier = session.metadata.tier;
    const courseId = session.metadata.courseId;

    if (!userId && session.customer_details?.email) {
      const email = session.customer_details.email;
      let user = await db.get('SELECT id FROM users WHERE email = $1', [email]);
      
      if (!user) {
        userId = uuidv4();
        const dummyPassword = await bcrypt.hash(uuidv4(), 10);
        await db.query('INSERT INTO users (id, email, password, full_name) VALUES ($1, $2, $3, $4)', [
          userId, email, dummyPassword, session.customer_details.name || 'Valued Member'
        ]);
        sendWelcomeEmail(email, session.customer_details.name).catch(console.error);
      } else {
        userId = user.id;
      }
    }

    if (userId) {
      if (session.customer) {
        await db.query('UPDATE users SET stripe_customer_id = $1 WHERE id = $2', [session.customer, userId]);
      }

      if (tier) {
        await db.query('UPDATE users SET tier = $1, subscription_status = $2 WHERE id = $3', [tier, 'active', userId]);
      }
      
      if (courseId) {
        await db.query('INSERT INTO user_courses (user_id, course_id) VALUES ($1, $2) ON CONFLICT(user_id, course_id) DO NOTHING', [userId, courseId]);
      }
    }
  }

  if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
    const subscription = event.data.object;
    const status = subscription.status === 'active' ? 'active' : 'inactive';
    
    await db.query('UPDATE users SET subscription_status = $1 WHERE stripe_customer_id = $2', [status, subscription.customer]);
  }

  res.json({ received: true });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
