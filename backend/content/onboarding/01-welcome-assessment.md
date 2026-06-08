# Step 1: Welcome & Personal Assessment

**Screen: "What brings you here?"**

---

## Headline
> Hi. We're glad you're here.

## Subheadline
> Before we build your plan, help us understand where you are right now. It takes 2 minutes.

---

## Question 1: What's your primary reason for joining Rise & Structure?

*Choose the one that resonates most.*

| Option | Visual | 
|--------|--------|
| 🏋️ **I need to get my health back.** I'm tired, out of shape, and my body feels older than it should. | Body icon |
| 💰 **I need to earn more.** I'm underpaid, stuck, or ready to build something of my own. | Wallet icon |
| 🧠 **I need direction.** I feel lost, stuck in a rut, or unsure what's next. | Compass icon |
| 🔄 **All of the above.** My whole life needs a rebuild. | Full circle icon |

---

## Question 2: Where are you in your journey?

*Be honest — this helps us meet you where you are.*

- 😬 **Starting from zero.** Haven't exercised regularly in years. No savings. Feeling stuck.
- 😐 **Trying but inconsistent.** I have bursts of motivation but can't sustain it.
- 🙂 **Making progress.** I have some good habits but need more structure.
- 🔥 **Ready to optimize.** I'm doing okay but want to level up everything.

---

## Question 3: How much time can you realistically commit per day?

- ⏱️ **5 minutes** — I'm honest about my bandwidth
- ⏱️ **10-15 minutes** — I can carve out a little time
- ⏱️ **20-30 minutes** — I'm ready to invest in myself

---

## Question 4: When do you want your daily content?

- 🌅 **Morning (6-9am)** — Start my day with intention
- 🌤️ **Lunch (12-2pm)** — Midday reset
- 🌆 **Evening (7-10pm)** — Wind down and reflect

---

## On Completion
Store: `{primary_reason, journey_stage, time_commitment, preferred_time}`

👉 [Continue to Step 2: Wellness Baseline]

---

## Platform Engineer Notes
- Use emoji + text buttons (large tap targets for mobile)
- Progress indicator: "Step 1 of 5" at top
- Each question should be one screen (swipeable or tap-to-advance)
- "Skip" link at bottom of each question (default to "All of the above" + "Trying but inconsistent" + "10-15 minutes" + "Morning")
- Store responses as user profile properties