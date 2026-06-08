# Stage 4: Day 1 Content Delivery

**Trigger:** First scheduled delivery time after onboarding

---

## Push Notification (at delivery time)
> "Your Day 1 is ready: {{routine_title}} — 5 minutes. You've got this."

---

## In-App Day 1 Screen

### Good morning/afternoon/evening, {{first_name}} 🌅

**Welcome to your first day.**

Here's what's waiting for you today:

### 🏋️ Today's Wellness
**{{wellness_title}}**
{{wellness_short_description}} ({{wellness_duration}} min)
👉 [Start Wellness]

### 🧠 Today's Mindset
**{{mindset_title}}**
{{mindset_short_description}} ({{mindset_duration}} min)
👉 [Open Mindset Prompt]

{% if day_of_week in [1, 3, 5] %}
### 💰 Finance Micro-Lesson
**{{finance_title}}**
{{finance_short_description}} ({{finance_duration}} min)
👉 [Open Finance Lesson]
{% endif %}

---

### Your 30-Day Goal
*{{primary_goal}}*

**Day 1 of 30.** Every day is a brick. Keep laying them.

---

## Email Version (for users who opted in)

**Subject:** Your Day 1 with Rise & Structure
**Preheader:** 5 minutes. Two practices. Let's begin.

[Body reflects same content as in-app version above]

---

## Completion State
When user marks all daily content as done:
> ✅ Nice work, {{first_name}}. Day 1 is in the books.
> Come back tomorrow for Day 2.
> 
> **Your streak: 1 day 🔥**