# Step 4: Finance / Income Goals

**Screen: "Let's talk about money."**

---

## Headline
> Let's look at your financial picture.

## Subheadline
> No judgment. No shame. Just data so we can help you build a plan.

---

## Question 1: How would you describe your current financial situation?

*Pick the closest description.*

| Rating | Description |
|--------|-------------|
| 😬 **Surviving** — Debt is heavy, no savings, living paycheck to paycheck |
| 😐 **Getting by** — Bills are covered but little to spare |
| 🙂 **Comfortable** — Have savings, but feel stuck income-wise |
| 🔥 **Ready to grow** — Stable finances, ready to build wealth |

---

## Question 2: Which of these resonates most?

*What's your biggest financial frustration?*

| Option | Description |
|--------|-------------|
| 💼 **Not earning enough** — My salary isn't keeping up with my needs or worth |
| 🚀 **Want a side income** — I need a second income stream but don't know where to start |
| 📉 **Money management** — I'm not good with budgeting, saving, or investing |
| 🧗 **Career stuck** — I've plateaued and don't know how to advance |
| 🏠 **Financial security** — I worry about retirement, emergencies, the future |

---

## Question 3: If you could add extra income each month, how much would make a difference?

- 💰 **$200-500/month** — "Would take the edge off"
- 💰 **$500-1,000/month** — "Would change my quality of life"
- 💰 **$1,000-3,000/month** — "Would be life-changing"
- 💰 **$3,000+/month** — "Would let me quit my job or work less"

---

## Question 4: What's your experience with side income or investing?

- 🟢 **Active** — I already have a side income or investments
- 🟡 **Curious** — I've looked into it but haven't started
- 🔴 **New** — I've never done anything beyond my day job

---

## Question 5: What's your biggest financial goal for the next year?

*Free text (max 140 characters)*

Placeholder: *"e.g., Pay off $5k of credit card debt. Save $10k for a house. Start earning $500/month from a side hustle."*

---

## On Completion

Store: `{financial_situation, financial_frustration, income_target, side_income_experience, financial_goal}`

👉 [Continue to Step 5: Your Personalized Plan]

---

## Platform Engineer Notes
- Question 5 is free text with a 140-char limit and placeholder text
- After completion, briefly affirm: *"This gives us what we need. Now let's build your plan."*
- The `income_target` and `financial_goal` will be used to track progress milestones
- The `financial_situation` + `side_income_experience` determine which finance content tier to deliver