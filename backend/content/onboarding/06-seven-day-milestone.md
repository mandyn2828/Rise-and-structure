# Stage 6: 7-Day Milestone

**Trigger:** After completing 7 days of content

---

## In-App Celebration

### 🎉 Week 1 Complete!

**You did it, {{first_name}}. One full week.**

Here's what you've accomplished:

- ✅ **X wellness routines completed**
- ✅ **X mindset sessions reflected on**
- ✅ **X finance lessons learned**

**Badge unlocked: 🔥 Foundation Streak**

> *"The first week is the hardest. You just proved you can show up. That's 90% of the battle."*

---

### Your Week 1 Insights

Based on your check-ins and tracking:

**Your highest-energy day was:** {{best_day}}
**Your most consistent habit was:** {{best_habit}}

**One thing to carry into Week 2:**
{{personalized_tip}}

---

### Looking Ahead to Week 2

Next week, the content rotates:
- **Wellness:** {{next_wellness_theme}} — {{next_wellness_desc}}
- **Mindset:** {{next_mindset_theme}}
- **Finance:** {{next_finance_topic}}

👉 [Start Week 2]

---

### Share Your Win (optional)

> "I just completed my first week with Rise & Structure. One week of showing up for my health, my mindset, and my future. Week 2 starts now. 🔥"

[Share to: Twitter | LinkedIn | Copy Link]

---

## Push Notification (morning of Day 8)
> "Week 1 ✅ New routines unlocked for Week 2. You've built momentum — let's keep it going."

---

## Email Version

**Subject:** 🎉 You completed Week 1 with Rise & Structure
**Preheader:** Here's what you achieved and what's coming next.

[Body mirrors in-app content above with personalization]

---

## Data to Store
- `week_1_completed` (boolean)
- `week_1_badge_awarded` (boolean)
- `milestones` (JSON array of milestone objects with `{type, week, date_awarded}`)