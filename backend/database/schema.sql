-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT,
  tier TEXT DEFAULT 'starter', -- starter, builder, thriver
  subscription_status TEXT DEFAULT 'inactive', -- active, inactive, past_due
  stripe_customer_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Daily Content table
CREATE TABLE IF NOT EXISTS daily_content (
  id TEXT PRIMARY KEY,
  date DATE, -- Can be NULL for rotation-based content
  pillar TEXT NOT NULL, -- wellness, mindset, finance
  day_of_week INTEGER, -- 0-6 for rotation logic
  week_type TEXT, -- 'A' or 'B'
  title TEXT NOT NULL,
  body TEXT NOT NULL, -- JSON string or Markdown content
  tags TEXT, -- Comma-separated
  difficulty TEXT NOT NULL, -- starter, builder, thriver
  slug TEXT UNIQUE,
  UNIQUE(date, pillar, difficulty),
  UNIQUE(day_of_week, week_type, pillar, difficulty)
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  modules TEXT, -- JSON string
  price_cents INTEGER DEFAULT 0,
  difficulty TEXT NOT NULL
);

-- User Progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  content_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT 0,
  notes TEXT,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (content_id) REFERENCES daily_content(id),
  UNIQUE(user_id, content_id)
);

-- Community Posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Community Comments table
CREATE TABLE IF NOT EXISTS community_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES community_posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
