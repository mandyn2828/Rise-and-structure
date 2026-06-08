# Step 3: Mindset Check-In

**Screen: "How's your headspace?"**

---

## Headline
> Let's check in on your mental state.

## Subheadline
> This helps us recommend the right mindset practices for where you are.

---

## Question 1: Overall Mental State (last 2 weeks)

*On a scale of 1-5, where have you been?*

| Rating | Description |
|--------|-------------|
| 1 | Struggling — anxious, down, or overwhelm most days |
| 2 | Heavy — carrying stress, feeling stretched thin |
| 3 | Okay — ups and downs, managing day-to-day |
| 4 | Good — generally positive, clear-headed |
| 5 | Great — focused, calm, and optimistic |

---

## Question 2: What's the most present emotional challenge for you?

*Pick the one that hits closest.*

| Challenge | Example |
|-----------|---------|
| 🧩 **Identity / purpose** | "Who am I now? What's my next chapter?" |
| 🗣️ **Inner critic** | "I'm too hard on myself. I feel like I'm failing." |
| 🎯 **Focus / motivation** | "I can't stick with anything. I start and stop." |
| 😰 **Anxiety / overwhelm** | "I'm stretched thin and can't relax." |
| 💔 **Grief / loss / transition** | "Going through a major life change." |
| 🤝 **Connection / loneliness** | "I feel isolated or disconnected." |

---

## Question 3: What's your relationship with self-reflection?

*How comfortable are you with journaling, thinking, or sitting with your thoughts?*

- 🟢 **Comfortable** — I've journaled before, open to it
- 🟡 **Willing** — I'll try it but I'm skeptical
- 🔴 **Avoidant** — Sitting with my thoughts feels uncomfortable

---

## Question 4: What would you most like to feel more of?

*Pick one.*

- 🕊️ **Peace** — less stress, more calm
- 🔥 **Drive** — more motivation and energy for my goals
- 😊 **Contentment** — feeling satisfied with where I am
- 🧭 **Clarity** — knowing what I want and where I'm going
- 💪 **Confidence** — believing in myself again

---

## On Completion

Store: `{mental_state_score, emotional_challenge, reflection_comfort, desired_feeling}`

👉 [Continue to Step 4: Finance Goals]

---

## Platform Engineer Notes
- Question 2 is a single-select card grid with emoji headers
- Question 3 uses color-coded buttons (green/yellow/red) for visual clarity
- Show a brief message after completion: *"Thank you for being honest. This is where real growth starts."*
- The `emotional_challenge` and `desired_feeling` fields will be used to select which mindset content to prioritize