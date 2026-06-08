# Stage 2: Tier Selection Screen

**Trigger:** Immediately after welcome message, first screen in-app

---

## Screen Title
> Choose your path

## Subtitle
> Pick the level that matches where you are right now. You can change anytime.

---

## Tier Cards

### 🌱 Starter
**Best if:** You're new to wellness and finance habits. You want structure but need it super simple.

- Daily routines: 5-10 minutes
- Focus on: foundational habits, one small win at a time
- Momentum: low pressure, build consistency first
- *"I just need to start."*

### 🏃 Builder
**Best if:** You have some healthy habits but need more structure and higher-level challenges.

- Daily routines: 10-20 minutes
- Focus on: building on what works, leveling up
- Momentum: guided progress, measurable growth
- *"I'm ready to level up."*

### 🚀 Thriver
**Best if:** You're consistent but want depth, optimization, and advanced practices.

- Daily routines: 15-30 minutes
- Focus on: optimization, mental discipline, income acceleration
- Momentum: high standards, compound growth
- *"I want to optimize everything."*

---

## Secondary Prompt (after tier selection)

**What's your primary focus?** (Choose all that apply)

- 🏋️ Rebuild my health (energy, sleep, fitness)
- 💰 Grow my income (side hustle, career, money skills)
- 🧭 Find direction (mindset, purpose, discipline)

---

## UI Notes for Platform Engineer
- Display 3 cards side-by-side on desktop, stacked on mobile
- Each card should have: emoji, tier name, short description, audience line, quote
- Selected state: highlighted border + checkmark
- Progress indicator: "Step 1 of 3" at top
- "Skip for now" link at bottom (defaults to Starter + all 3 focuses)
- On submit: store `{tier, focuses[]}` in user profile, trigger day 1 content unlock