-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  tier VARCHAR(50) DEFAULT 'starter', -- starter, builder, thriver
  subscription_status VARCHAR(50) DEFAULT 'inactive', -- active, inactive, past_due
  trial_ends_at TIMESTAMP,
  stripe_customer_id VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  location_name VARCHAR(255),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  interests TEXT, -- Comma-separated
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily Content table
CREATE TABLE IF NOT EXISTS daily_content (
  id VARCHAR(36) PRIMARY KEY,
  date DATE, -- Can be NULL for rotation-based content
  pillar VARCHAR(50) NOT NULL, -- wellness, mindset, finance
  day_of_week INTEGER, -- 0-6 for rotation logic
  week_type VARCHAR(1), -- 'A' or 'B'
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL, -- JSON string or Markdown content
  tags TEXT, -- Comma-separated
  difficulty VARCHAR(50) NOT NULL, -- starter, builder, thriver
  slug VARCHAR(255) UNIQUE,
  UNIQUE(date, pillar, difficulty),
  UNIQUE(day_of_week, week_type, pillar, difficulty)
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(36) PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  modules TEXT, -- JSON string
  price_cents INTEGER DEFAULT 0,
  difficulty VARCHAR(50) NOT NULL
);

-- User Progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  content_id VARCHAR(36) NOT NULL,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (content_id) REFERENCES daily_content(id),
  UNIQUE(user_id, content_id)
);

-- Community Posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Community Comments table
CREATE TABLE IF NOT EXISTS community_comments (
  id VARCHAR(36) PRIMARY KEY,
  post_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES community_posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Community Reactions table
CREATE TABLE IF NOT EXISTS community_reactions (
  id VARCHAR(36) PRIMARY KEY,
  post_id VARCHAR(36),
  comment_id VARCHAR(36),
  user_id VARCHAR(36) NOT NULL,
  type VARCHAR(50) NOT NULL, -- like, celebrate, support
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES community_posts(id),
  FOREIGN KEY (comment_id) REFERENCES community_comments(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, post_id, type),
  UNIQUE(user_id, comment_id, type)
);

-- User Course Ownership
CREATE TABLE IF NOT EXISTS user_courses (
  user_id VARCHAR(36) NOT NULL,
  course_id VARCHAR(36) NOT NULL,
  purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Push Subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  subscription_json TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
