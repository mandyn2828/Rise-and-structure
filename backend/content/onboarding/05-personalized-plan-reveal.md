# Step 5: Personalized Plan Reveal

**Screen: "Your Rise & Structure Plan"**

---

## Headline
> {{first_name}}, your personalized plan is ready.

## Subheadline
> Based on your responses, here's what your journey looks like.

---

## Your Profile Summary

| Factor | Your Starting Point | Level |
|--------|-------------------|-------|
| Wellness Score | {{wellness_score}}/5 | {{wellness_level}} |
| Mental State | {{mental_state_label}} | {{mental_level}} |
| Financial Situation | {{financial_label}} | {{finance_level}} |
| Time Commitment | {{time_commitment}}/day | — |
| Primary Focus | {{primary_focus_emoji}} {{primary_focus}} | — |

---

## Your Tier: {{tier_name}}

*Determined from your assessment data:*

| Scores | Tier | Default Plan |
|--------|------|-------------|
| Most scores 1-2 | 🌱 **Starter** | Foundations first — 5 min/day, build consistency |
| Most scores 2-3 | 🏃 **Builder** | Structured growth — 10-15 min/day, level up steadily |
| Most scores 3+ | 🔥 **Thriver** | Optimization — 15-20 min/day, advanced practices |

---

## Your Daily Content Mix

{{primary_focus}} is your main focus, so we'll emphasize that pillar:

{% if primary_focus == 'health' %}
### 🏋️ Wellness-First Plan
- **Daily:** Mobility or strength routine + mindset prompt
- **3x/week:** Finance micro-lessons
- **Month 1 goal:** Build the habit of daily movement

{% elif primary_focus == 'income' %}
### 💰 Income-First Plan  
- **Daily:** Mindset prompt + finance micro-lessons
- **3x/week:** Wellness routines (recovery-focused)
- **Month 1 goal:** Complete Side-Income Starter blueprint

{% elif primary_focus == 'direction' %}
### 🧠 Direction-First Plan
- **Daily:** Mindset coaching + daily wellness
- **3x/week:** Finance fundamentals
- **Month 1 goal:** Clarity on next chapter

{% else %}
### 🔄 Balanced Rebuild Plan
- **Daily:** Wellness routine + mindset prompt
- **3x/week:** Finance micro-lessons
- **Month 1 goal:** Build all three pillars simultaneously
{% endif %}

---

## Your First Week Preview

| Day | Wellness | Mindset | Finance |
|-----|----------|---------|---------|
| Day 1 | {{w1_d1_wellness}} | {{w1_d1_mindset}} | — |
| Day 2 | {{w1_d2_wellness}} | {{w1_d2_mindset}} | — |
| Day 3 | {{w1_d3_wellness}} | {{w1_d3_mindset}} | {{w1_d3_finance}} |
| Day 4 | {{w1_d4_wellness}} | {{w1_d4_mindset}} | — |
| Day 5 | {{w1_d5_wellness}} | {{w1_d5_mindset}} | {{w1_d5_finance}} |
| Weekend | Recovery Walk | Connection | — |

**First delivery:** {{delivery_day}} at {{delivery_time}}

---

## Your 30-Day Goal
*From your responses:*
> *"{{financial_goal}}"*

We'll track this and check in at Day 7, Day 14, and Day 30.

---

## CTA
> **Ready? Your Day 1 arrives {{delivery_day}} at {{delivery_time}}.**

👉 [Start Day 1 Now] *(unlocks first routine immediately)*

*A note on changing your plan: You can adjust your tier, focus, or schedule anytime in Settings. This is your journey.*

---

## Platform Engineer Notes

### Tier Determination Logic
- Average wellness score < 2.5 AND mental state < 3 → **Starter**
- Average wellness score 2.5-3.5 AND mental state 3-4 → **Builder**
- Average wellness score > 3.5 AND mental state > 3.5 → **Thriver**

### Personalization Tokens Used in This Screen
- `{wellness_score}` — average of Step 2 responses (1-5)
- `{mental_state_score}` — from Step 3 (1-5)
- `{financial_situation}` — from Step 4
- `{tier_name}` — derived from scores
- `{primary_focus}` — derived from Step 1 reason + Step 2 data
- `{w1_d1_wellness}` through `{w1_d5_finance}` — selected from content library based on tier + focus
- `{delivery_day}` — today or tomorrow based on current time
- `{delivery_time}` — from Step 1 time preference

### Display
- This is a scrollable summary page with card-based sections
- "Start Day 1 Now" button should be sticky at bottom
- Allow user to edit any field before confirming
- Store `plan_revealed_at` timestamp on confirmation