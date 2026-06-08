# Stage 5: 3-Day Check-In

**Trigger:** 72 hours after Day 1 completion (send if less than 3 routines done)

---

## Push Notification (if user hasn't returned)
> "Hey {{first_name}} — we noticed you haven't been back. Your Day 2 is waiting. It takes 5 minutes."

---

## In-App Message (when user returns)

### How's it going, {{first_name}}?

You're X days into your Rise & Structure journey. Let's check in.

**Quick pulse check (1 tap each):**

How are you feeling about your wellness routine so far?
- 😊 Loving it | 😐 It's okay | 😬 Struggling

How's your mindset practice?
- 😊 Helpful | 😐 Neutral | 😬 Not clicking

Have you noticed any changes — even small ones?
- ✅ Yes | ❌ Not yet | ❓ Too early

---

### Based on your input:

**[If struggling]:**
> It's normal to feel awkward at first. Your brain and body are building new pathways. Just focus on showing up — the rest will follow.
> 
> **Tip:** Try doing your routine right after your morning coffee (or whatever your anchor habit is). Stack it on something you already do.

**[If good/great]:**
> That's great to hear. Consistency is the secret. The people who win are the ones who keep showing up when it's not exciting. You're building something real.

**[If they've missed 2+ days]:**
> You haven't failed. You've just had a tough few days. Tomorrow is Day 1 all over again. No guilt. Just restart.

---

## Email Version (for opted-in users)

**Subject:** 3 days in — how's it going, {{first_name}}?

**Body:** [Mirrors in-app check-in with personalization]

---

## Re-engagement Sequence (if user inactive)

**Day 4 of inactivity — Push:**
> "Your daily routines are piling up. One 5-minute practice is all it takes to restart your streak."

**Day 7 of inactivity — Email:**
> Subject: We saved your spot, {{first_name}}
> 
> "Hey — we noticed you haven't been back in a week. No judgment. Life gets in the way — especially when you're rebuilding at 40+.
> 
> Your content is saved. Your tier is ready. Whenever you're ready to pick up where you left off, it's all here.
> 
> One routine. Five minutes. See you when you're ready."

**Day 14 of inactivity — Final message:**
> Subject: Holding the door open
> 
> "Hi {{first_name}}. It's been 2 weeks. We'll pause your account so you don't get charged for content you're not using. Your data is saved. Come back anytime.
> 
> When you're ready, we're here."

---

## Data to Store
- `days_completed` (int)
- `current_streak` (int)
- `last_active_at` (timestamp)
- `inactive_notification_stage` (enum: none | day4 | day7 | day14)