# Rise & Structure — Content Architecture

## Overview
This document maps the complete content ecosystem for the Rise & Structure automated guidance platform. All content targets ambitious, burnt-out adults aged 35–55 who want to rebuild health, income, and direction.

## Content Pillars

| Pillar | Delivery Format | Frequency | File Location |
|--------|----------------|-----------|---------------|
| Wellness Routines | Daily structured habits + weekly deep-dives | Daily (7-day rotation) | `content/wellness/` |
| Mindset Coaching | Daily prompts + weekly reflections | Daily (7-day rotation) | `content/mindset/` |
| Finance Micro-Lessons | Bite-sized actionable lessons | 3x/week | `content/finance/` |
| Digital Courses | Structured multi-module courses | One-time purchase | `content/courses/` |

## Database / Data Model (for Engineers)

### Tables Required

#### `daily_content`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| date | DATE | Calendar date |
| pillar | ENUM('wellness','mindset','finance') | Content pillar |
| day_of_week | INT(0-6) | Day for rotation logic |
| title | TEXT | Content headline |
| body | JSON | Structured content body |
| tags | TEXT[] | Topic tags |
| difficulty | ENUM('starter','builder','thriver') | User tier |

#### `courses`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| slug | TEXT | URL-safe identifier |
| title | TEXT | Course name |
| description | TEXT | Course summary |
| modules | JSON | Array of module objects |
| price_cents | INT | Price in cents |
| difficulty | ENUM('starter','builder','thriver') | User tier |

#### `user_progress`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References users |
| date | DATE | Content date |
| pillar | ENUM('wellness','mindset','finance') | Pillar completed |
| completed | BOOLEAN | Whether done |
| notes | TEXT | User's reflection |

### Content Rotation Logic
- **Week 1 = Focus Week A** (e.g., "Foundation Week")
- **Week 2 = Focus Week B** (e.g., "Build Week")
- Content rotates on a 2-week cycle so users don't get bored
- Weekend days are lighter (review/reflect)

## File Naming Convention
- `{pillar}/{day_number}-{week_slug}-{topic-slug}.md`
- Day numbers: 1=Monday through 7=Sunday
- Week A = odd weeks, Week B = even weeks

## Content Tiers / Difficulty Levels
- **Starter** — New to the practice; 5-10 min commitment
- **Builder** — Some experience; 10-20 min commitment
- **Thriver** — Advanced; 20-30 min commitment