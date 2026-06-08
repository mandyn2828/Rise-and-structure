# Email Nurture Sequence

**Purpose:** Convert sign-ups into engaged subscribers through timed, personalized email touchpoints.
**Trigger:** User signs up (free trial or paid)
**Sequence:** 5 emails over 30 days + ongoing monthly

---

## Email 1: Welcome (Day 1 — Sent immediately after sign-up)

**Subject:** Welcome to Rise & Structure — your Day 1 starts now

**Preheader:** Your first routine is waiting. 5 minutes.

---

Hi {{first_name}},

Welcome. 

You took the assessment. You shared where you are — your energy levels, your headspace, your financial picture. And you got your personalized plan.

Now comes the only part that matters: **Day 1.**

**Here's what's waiting for you today:**

🏋️ **Wellness Routine:** {{day_1_wellness_title}} ({{day_1_wellness_duration}} min)
🧠 **Mindset Prompt:** {{day_1_mindset_title}} (3 min)
{% if day_1_has_finance %}💰 **Finance Lesson:** {{day_1_finance_title}} (5 min){% endif %}

**Total time:** {{day_1_total_time}} minutes

**How to start:**
1. Open the app / click the link below
2. Follow today's wellness routine — just move, don't judge
3. Read your mindset prompt — sit with it for 2 minutes
4. Check the box ✅

That's it. You don't need to plan tomorrow. Tomorrow will arrive on its own.

**One thing to know:** You might feel awkward at first. That's normal. Your brain and body are building new pathways. Awkward means it's working.

👉 [Start Day 1 Now]

Let's go.

— The Rise & Structure Team

P.S. — If you ever miss a day, you haven't failed. You've just paused. Come back when you're ready. We'll be here.

---

## Email 2: Week 1 Check-In (Day 3)

**Subject:** {{first_name}}, how's your first week feeling?

**Preheader:** A quick 60-second check-in.

---

Hi {{first_name}},

You're {{days_completed}} days into Rise & Structure. That's {{days_completed}} more than you'd done before you joined. That counts.

I want to check in with you — honestly. No AI bot pretending to care. Just a real question:

**How is it going?**

- ✅ Great — I'm showing up and feeling it
- 😐 Okay — not sure if it's working yet
- 😬 Struggling — missed some days, feeling guilty

---

**[If "Great"]** — That's fantastic. The people who see real results are the ones who keep showing up when it's not exciting. You're building something real. The compound effect is already starting — you might not feel it yet, but the data says you will by Day 14.

**[If "Okay"]** — That's completely normal. Real change takes a few weeks to feel. Think of it like strength training: you don't see muscle growth after 3 days, but the foundation is being laid. Give it until Day 7, then reassess.

**[If "Struggling"]** — Good. You're honest. Here's the truth: missing days doesn't erase your progress. You're not starting over. You're just restarting. Take a breath, do one 5-minute routine today, and call it a win. The only failure is stopping completely.

---

**Quick tip based on your tier:**

{% if tier == 'Starter' %}
> **Starter tip:** Don't try to be perfect. 5 minutes is a success. If you miss a day, just do Day 1 again. No shame.
{% endif %}
{% if tier == 'Builder' %}
> **Builder tip:** Early this week, try adding one Builder extension to your routine. You're ready for more — trust the nudge.
{% endif %}
{% if tier == 'Thriver' %}
> **Thriver tip:** The next level isn't about doing more — it's about going deeper. Pay attention to how each practice feels, not just whether it's done.
{% endif %}

See you on Day 4.

— The Rise & Structure Team

---

## Email 3: First Win Celebration (Day 7)

**Subject:** 🎉 {{first_name}}, you just completed your first week

**Preheader:** Here's what you achieved and what comes next.

---

Hi {{first_name}},

One full week. Let's look at what you've done.

**Your Week 1 Stats:**
- ✅ Wellness routines completed: {{wellness_completed}} of {{wellness_total}}
- ✅ Mindset sessions reflected on: {{mindset_completed}} of {{mindset_total}}
- ✅ Finance lessons learned: {{finance_completed}}
- 🔥 Longest streak: {{longest_streak}} days
- 🏆 Badge earned: **Foundation Streak**

**How your baseline is shifting:**

| Factor | Before | End of Week 1 |
|--------|--------|---------------|
| Energy | {{onboarding_energy}} | {{current_energy}} |
| Consistency | — | {{consistency_rating}} |
| Confidence | {{onboarding_confidence}} | {{current_confidence}} |

*Even if the numbers haven't changed dramatically yet, you're laying the neurological foundation. The shift accelerates in Week 2.*

---

**What you told us you wanted 30 days from now:**
> *"{{primary_goal}}"*

You're 25% of the way there. Don't stop.

---

**What's coming in Week 2:**

The content rotates this week to keep your brain engaged:

- **Wellness:** {{next_wellness_theme}} — building on what you started
- **Mindset:** Deeper dive into {{emotional_challenge_focus}}
- **Finance:** {{next_finance_topic}}

**One thing to watch for:** Days 8-12 can feel harder than Days 1-7. The novelty wears off. This is where most people quit. Don't be most people. The dip is where the growth happens.

👉 [Start Week 2 Now]

---

**Share your win (optional but recommended):**

> *"Completed my first week with @RiseAndStructure. One week of showing up for my health, my mindset, and my future. On to Week 2."*

[Share to: Twitter | LinkedIn | Copy]

Proud of you,

— The Rise & Structure Team

---

## Email 4: Monthly Progress Digest (Day 30)

**Subject:** Your 30-Day Rise & Structure Report

**Preheader:** Here's what changed — and what's next.

---

Hi {{first_name}},

Thirty days ago, you answered some honest questions about where you were — your energy, your stress, your finances.

Let's see what's changed.

---

**📊 Your 30-Day Transformation**

| Area | Day 0 | Day 30 | Change |
|------|-------|--------|--------|
| Wellness Score | {{wellness_start}}/5 | {{wellness_current}}/5 | {{wellness_delta}} |
| Mental State | {{mental_start}}/5 | {{mental_current}}/5 | {{mental_delta}} |
| Consistency Rate | — | {{consistency_percent}}% | New baseline |
| {{goal_type}} Progress | Not started | {{goal_progress}}% | In motion |

---

**🏆 Badges Earned This Month**
{% for badge in badges %}
- {{badge.emoji}} {{badge.name}}
{% endfor %}

---

**📈 Consistency Breakdown**
- Total days active: {{total_active_days}} of 30 ({{consistency_percent}}%)
- Best week: Week {{best_week}} ({{best_week_percent}}%)
- Current streak: {{current_streak}} days 🔥

---

**Your most-engaged content:**
- Most completed pillar: {{top_pillar}} ({{top_pillar_percent}}% completion)
- Most completed routine type: {{top_routine_type}}

---

**Insight from your data:**
> *"{{personalized_insight}}"*

---

**Your goal check-in:**
> *"{{primary_goal}}"*

Where are you on this? 
- 🎯 On track — making visible progress
- 🧭 Moving — progress is slower than I'd like but I'm not stopping
- 🔄 Need to reset — my goal has changed or I've paused

---

**What changes next month:**

{% if tier == 'Starter' and consistency_percent > 70 %}
**Congrats — you're ready for Builder tier!** Your consistency is strong enough. Leveling up unlocks longer routines (10-15 min) and deeper content. Your plan auto-adjusts next week unless you opt out.
{% endif %}

{% if tier == 'Builder' and consistency_percent > 80 %}
**You're ready to go deeper.** Consider adding one monthly 1:1 coaching session, or explore our Mental Discipline course to lock in your gains.
{% endif %}

{% if tier == 'Thriver' %}
**Your focus this month:** Depth over breadth. Pick one pillar and go all-in for the next 30 days. Your coach will help you design this.
{% endif %}

---

👉 [Review Full Dashboard]

Keep going. Month 2 is where the compound effect really kicks in.

— The Rise & Structure Team

P.S. — Your monthly subscription renews in {{days_to_renewal}} days. Here's what's coming in Month 2: new content rotation, fresh finance lessons, and {{upcoming_feature}}.

---

## Email 5: Upsell Email for Courses (Sent Day 5-7 or after high engagement signal)

**Subject:** {{first_name}}, you're ready to go deeper

**Preheader:** Mini-courses built to accelerate your rebuild.

---

Hi {{first_name}},

You've been consistent with your daily content, and we can see the data — you're ready for more.

We've built three mini-courses for times when you want to go deeper than the daily routines allow. One-time purchase. You own them forever.

---

**📚 Health Foundations — $29**
For when you want a structured 14-day deep dive into morning routines, nutrition, stress management, and sleep optimization.
> *"I'd tried everything. This 14-day course finally made the habits stick."*
> — Brian, 47

👉 [Learn More — Health Foundations]

---

**📚 Side-Income Starter — $49**
For when you're ready to build real income outside your day job. 21 days. 6 modules. Blueprints for freelancing, digital products, and coaching.
> *"I made $1,200 in my first month following this blueprint. The negotiation script alone paid for itself."*
> — Danielle, 42

👉 [Learn More — Side-Income Starter]

---

**📚 Mental Discipline — $39**
For when you want to train your focus, overcome resistance, and build unshakeable consistency.
> *"This changed how I approach everything. Not just wellness — my work, my relationships, my goals."*
> — Marcus, 51

👉 [Learn More — Mental Discipline]

---

**🔥 The Bundle — $89 (Save $28)**
All three courses. One price. Your complete rebuild toolkit.

👉 [Get the Bundle]

---

You've earned the right to go deeper. These courses are built for people who are already doing the work — people like you.

Keep building,

— The Rise & Structure Team

---

## Trigger Rules for Platform Engineer

| Email | Trigger | Delay |
|-------|---------|-------|
| Day 1 Welcome | User completes onboarding (plan revealed) | Immediate |
| Week 1 Check-In | After Day 1 delivery | 48 hours (Day 3) |
| First Win Celebration | After Day 7 completion OR 7 days post sign-up | Day 7 |
| Monthly Progress Digest | 30 days post sign-up | Day 30 |
| Upsell Email | High engagement signal (7+ days consistent) OR Day 5-7 | Conditional |

**Unsubscribe:** All emails must include one-click unsubscribe. Honor immediately.
**Frequency cap:** Maximum 1 email per 48 hours during nurture sequence, 1 per week after Day 30.