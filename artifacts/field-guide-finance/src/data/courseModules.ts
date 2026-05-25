export interface Lesson {
  id: string;
  title: string;
  videoUrl?: string;
  body: string;
}

export interface Module {
  id: string;
  title: string;
  slug: string;
  description: string;
  lessons: Lesson[];
}

export const courseModules: Module[] = [
  {
    id: "m1",
    title: "Your Story Is the Business Case",
    slug: "your-story",
    description: "Local food entrepreneurs in NWO are already building something real. This module uses Bobbie Parr's journey with Parrs Jars as the anchor story — because the business case isn't a spreadsheet. It starts with why.",
    lessons: [
      {
        id: "m1-l1",
        title: "807 Grows: Bobbie Parr & Parrs Jars",
        videoUrl: "https://www.youtube.com/watch?v=XWsaayAuH-Q",
        body: `## Watch: 807 Grows

The Shaw Community Link video below features Bobbie Parr of Parrs Jars — a small-batch preserves producer based in Northwestern Ontario. Bobbie's story is the anchor for this entire course.

Watch the full video, then read on.

---

## Why Bobbie's Story Matters

Bobbie didn't start Parrs Jars with a business plan. She started with jars of preserves that people wanted to buy. That's the normal starting point for most food entrepreneurs in NWO — a product that works, a community that wants it, and then the question: *how do I make this sustainable?*

This course is built to answer that question in plain language, using examples from producers like Bobbie who are working in the same geography, climate, and market reality you are.

## What You'll Learn in This Module

- Why your origin story is your most powerful financial argument
- How funders and buyers in NWO actually evaluate food businesses
- The difference between a pitch and a proof — and which one you actually need first

> "The story is not decoration. In a small market, the story is the distribution channel." — Headwaters field notes
`,
      },
      {
        id: "m1-l2",
        title: "Proof Before Pitch",
        body: `## Proof Before Pitch

Most financial guides tell you to write a business plan first. In NWO's food economy, that's backwards.

The co-op model that underlies 807 Benefits is built on a different logic: **demonstrate the demand first, then formalize the structure**. Bobbie Parr didn't pitch investors. She sold out at the farmers market. That's proof.

## The Three Forms of Proof

1. **Product proof** — people pay for it repeatedly, not just once
2. **Demand proof** — you have more orders than you can fill
3. **Community proof** — neighbours refer you without being asked

When you walk into a conversation with a funder, a co-op board, or a wholesale buyer in NWO, having all three is worth more than a 20-page business plan.

## Exercise: Map Your Proof

Write down one example of each form of proof from your own operation. If you're missing one, that's the gap to fill before seeking investment.

| Form | Your Example |
|------|-------------|
| Product proof | |
| Demand proof | |
| Community proof | |

Keep this. You'll come back to it in Module 4.
`,
      },
    ],
  },
  {
    id: "m2",
    title: "Pricing Your Product",
    slug: "pricing",
    description: "Most NWO food producers underprice. This module walks through a real cost-build for a small-batch food product and shows you how to set a price that actually sustains the work.",
    lessons: [
      {
        id: "m2-l1",
        title: "Why NWO Producers Underprice",
        body: `## Why NWO Producers Underprice

It happens for three reasons, and all three are understandable.

**Reason 1: Comparison to southern prices.** You check what a jar of jam costs at Walmart or a southern grocery chain, and you try to compete. You can't — and you shouldn't. Your cost structure is entirely different.

**Reason 2: Not counting your own time.** If you made 48 jars on Saturday and didn't pay yourself, those jars aren't cheap to produce. They're subsidized by your own unpaid labour.

**Reason 3: Fear of the "too expensive" reaction.** In a small community, pricing feels personal. Charging what your product is worth can feel like an accusation.

None of these are good reasons to lose money on every jar.

## The Real Cost of a $7 Jar

Here's a worked example for a 250ml jar of preserves, NWO conditions:

| Cost Item | Amount |
|-----------|--------|
| Ingredients (per jar) | $1.80 |
| Jar + lid + label | $1.20 |
| Propane / energy (pro-rated) | $0.35 |
| Your time (2h batch, 48 jars @ $20/h) | $0.83 |
| Market table fee (pro-rated) | $0.25 |
| **Total direct cost** | **$4.43** |

At $7, your margin is $2.57 — but that's before you count vehicle, kitchen certification, insurance, or any reinvestment into equipment.

A sustainable price is closer to **$9–$11** depending on your channel.
`,
      },
      {
        id: "m2-l2",
        title: "Building Your Own Cost Sheet",
        body: `## Building Your Own Cost Sheet

Download or copy the table below. Fill it in for your highest-volume product. Do this for real numbers — not estimates you're comfortable with.

**Direct Costs (per unit)**

| Item | Your Cost |
|------|-----------|
| Ingredients | |
| Packaging (jar, bag, box, label) | |
| Energy (pro-rated per batch) | |
| Your labour (hours × your hourly rate) | |
| Certifications pro-rated | |

**Overhead (monthly, divided by units sold)**

| Item | Monthly | Per Unit (÷ volume) |
|------|---------|---------------------|
| Insurance | | |
| Market / booth fees | | |
| Vehicle (to market, to suppliers) | | |
| Equipment depreciation | | |

**Margin Target**

Once you have your true cost per unit, add your target margin. For small-batch NWO producers, a 35–45% gross margin is the minimum needed to stay viable through a full seasonal cycle.

> **Price = Direct Cost + Overhead Per Unit + Target Margin**

If your current price is below this number, this module has already paid for itself.
`,
      },
    ],
  },
  {
    id: "m3",
    title: "Managing Seasonal Cash Flow",
    slug: "seasonal-cash",
    description: "Food businesses in Northwestern Ontario are seasonal by nature. Revenue concentrates in 4–5 months. This module teaches you how to plan for the off-season without borrowing your way through it.",
    lessons: [
      {
        id: "m3-l1",
        title: "The NWO Seasonal Reality",
        body: `## The NWO Seasonal Reality

If you sell at farmers markets, your revenue season is roughly May through October — six months of activity, with July and August carrying the heaviest load.

That means you have six months of strong revenue and six months of thin revenue. Most food businesses in NWO don't plan for this explicitly. They run strong in summer and scrape through winter. That scraping erodes the business year after year.

## The Seasonal Cash Map

A seasonal cash map is a simple 12-month view of when your money comes in and when it goes out. It doesn't need to be a spreadsheet — it can be a piece of paper on the wall.

**Example: Parrs Jars (simplified)**

| Month | Revenue Estimate | Fixed Costs | Net |
|-------|-----------------|-------------|-----|
| Jan | $200 | $600 | -$400 |
| Feb | $200 | $600 | -$400 |
| Mar | $400 | $600 | -$200 |
| Apr | $800 | $600 | +$200 |
| May | $1,800 | $700 | +$1,100 |
| Jun | $2,400 | $700 | +$1,700 |
| Jul | $3,200 | $800 | +$2,400 |
| Aug | $3,000 | $800 | +$2,200 |
| Sep | $2,000 | $700 | +$1,300 |
| Oct | $1,200 | $650 | +$550 |
| Nov | $600 | $600 | $0 |
| Dec | $800 | $600 | +$200 |

**Annual surplus: ~$8,650**

But if you don't set that surplus aside during peak months, you'll borrow in January. The plan has to include a winter reserve line.
`,
      },
      {
        id: "m3-l2",
        title: "The Winter Reserve Rule",
        body: `## The Winter Reserve Rule

Every NWO food producer needs a winter reserve — money set aside during peak months to cover fixed costs during the off-season without touching a line of credit.

**How to calculate yours:**

1. Add up your fixed monthly costs (rent, insurance, certifications, phone, vehicle minimum)
2. Multiply by the number of months you expect thin or zero revenue (typically 3–4 for NWO)
3. That's your minimum winter reserve target

**Example:** If your fixed costs are $650/month and you have 3 thin months, your reserve target is **$1,950**.

## The Reserve Account Rule

Keep your winter reserve in a separate account — not the same account you operate from. This is not about distrust. It's about visibility. When the money is in a separate account labelled "Winter Reserve," it doesn't accidentally get spent on a supply run in September.

## The 15% Rule

During peak season (May–October), set aside 15% of every market deposit into the reserve account. If you sell $3,000 in July, $450 goes to the reserve before anything else. This is a first-out transfer, not a leftover if things go well.

> "Pay your future self before you pay your suppliers. Your suppliers have payment terms. Your January heat bill does not." — 807 Benefits field notes
`,
      },
    ],
  },
  {
    id: "m4",
    title: "Co-op Membership Costs & ROI",
    slug: "coop-roi",
    description: "What does it actually cost to be a member of 807 Benefits, and what do you get back? This module breaks down the real math of co-op membership so you can make an informed decision.",
    lessons: [
      {
        id: "m4-l1",
        title: "What Membership Actually Costs",
        body: `## What Membership Actually Costs

Co-op membership has two kinds of costs: the obvious ones and the ones people forget to count.

**Obvious costs:**
- Annual membership dues
- Share capital (one-time, refundable when you leave)
- Any required volunteer hours or in-kind contributions

**Easy-to-forget costs:**
- Time spent at member meetings
- Time spent understanding collective decisions that affect your business
- Possible restrictions on where you can sell or how you price (depends on co-op)

Neither list is a reason to avoid membership — they're a reason to go in with clear eyes.

## The ROI Side of the Ledger

The return on a co-op membership for a food producer in NWO typically shows up in four places:

1. **Group purchasing power** — bulk ingredient or packaging orders that you couldn't negotiate alone
2. **Shared infrastructure** — certified kitchen space, cold storage, delivery coordination
3. **Market access** — collective presence at events, institutional buyers, wholesale accounts
4. **Knowledge transfer** — what other members have already learned, so you don't have to learn it the hard way

## The Proof Test

Go back to the proof table from Module 1. For each form of proof, ask: does membership make this easier to demonstrate, or harder? If the answer is consistently "easier," the membership math is probably in your favour.
`,
      },
      {
        id: "m4-l2",
        title: "Running the Numbers: A Worked Example",
        body: `## Running the Numbers: A Worked Example

Here's a simplified ROI calculation for a small-batch preserves producer joining a food co-op in NWO.

**Costs (Year 1)**

| Item | Amount |
|------|--------|
| Membership dues | $300 |
| Share capital | $500 (refundable) |
| Estimated time cost (10h @ $20/h) | $200 |
| **Total Year 1 Cost** | **$1,000** |

**Benefits (Year 1)**

| Item | Estimated Value |
|------|----------------|
| Bulk packaging savings vs. retail | $420 |
| Certified kitchen access (vs. renting separately) | $600 |
| One wholesale account opened through co-op network | $800 |
| **Total Estimated Benefit** | **$1,820** |

**Year 1 ROI: $820 net positive**

Year 2 improves significantly because the share capital is already paid and the wholesale relationship compounds.

## What This Doesn't Capture

This model doesn't capture the value of information — knowing about the new institutional buyer before your competitors do, or finding out that a particular packaging supplier has a 6-week lead time before you need them urgently. These are real and hard to quantify, but they're real.

Track your actual costs and benefits for your first year. The numbers will be more honest than any estimate.
`,
      },
    ],
  },
  {
    id: "m5",
    title: "Grants & Supports for NWO Food Producers",
    slug: "grants-supports",
    description: "What's actually available for food entrepreneurs in Northwestern Ontario — and how to apply without wasting your time on programs you're unlikely to qualify for.",
    lessons: [
      {
        id: "m5-l1",
        title: "The NWO Funding Landscape",
        body: `## The NWO Funding Landscape

Funding for NWO food producers comes from three overlapping layers, and understanding which layer you're in determines which programs make sense to apply for.

**Layer 1: Federal programs (national eligibility)**
- AAFC (Agriculture and Agri-Food Canada) programs
- BDC small business financing
- Women Entrepreneurship Strategy (if applicable)

**Layer 2: Provincial programs (Ontario eligibility)**
- Ontario Agri-Food Innovation Alliance
- OMAFRA business development grants
- FedNor (Federal Economic Development Initiative for Northern Ontario)

**Layer 3: Regional and community programs (NWO-specific)**
- Northwestern Ontario Development Fund
- Community Futures Development Corporations (CFDCs)
- Indigenous-specific programs through Anishinabek Nation economic development if applicable

## Which Layer to Start In

Most small food producers in NWO start with Layer 3 and work up. The reason is simple: Layer 3 programs are designed for your scale, your geography, and your context. A CFDC advisor in Dryden or Kenora knows what a viable small food business looks like in NWO. An AAFC program manager in Ottawa may not.

Start local. Work up when you've got traction.
`,
      },
      {
        id: "m5-l2",
        title: "Applying Without Wasting Time",
        body: `## Applying Without Wasting Time

Grant applications are expensive. Not in application fees — most are free — but in the time they take away from actually running your business.

**Before you apply, answer these three questions:**

1. **Do I meet the hard eligibility criteria?** (revenue range, geography, sector, legal structure)
2. **Is the program accepting applications now?** (many programs have intake windows, not rolling applications)
3. **What does the program actually fund?** (equipment? wages? marketing? not all three)

If you can't answer all three confidently, a 10-minute call with a CFDC advisor is worth more than 10 hours on the application.

## The Most Common Mistakes

**Applying for operating costs with a capital grant.** Most capital grants fund equipment and infrastructure — not wages, inventory, or rent. Read the eligible expenses list carefully before starting.

**Undersizing the ask.** If a program funds up to $25,000, don't apply for $5,000 unless $5,000 is genuinely all you need. Programs are designed to move meaningful amounts of money.

**No follow-through on reporting.** If you get a grant and don't file the required reports, you may need to repay it and you'll be ineligible for future programs. Build reporting into your calendar on day one.

## A Starting Point

For most food producers at the early stage, the first call should be to your local **Community Futures Development Corporation**. They have advisors, they know the local landscape, and their services are free to access.

Find your CFDC: [Northwestern Ontario CFDCs](https://www.communityfuturesontario.ca/find-a-cfdc/)

> The best grant is the one you actually get. Apply for the programs you qualify for, not the ones with the biggest headline number.
`,
      },
    ],
  },
  {
    id: "m6",
    title: "Your Money, Plumbed: XRPL Wallets & the Headwaters Bucket System",
    slug: "xrpl-wallets",
    description: "Most of us were handed a bank account and told to figure it out. This module teaches a different model — buckets, not balances; flow, not fog. Using the XRP Ledger and Bobbie Parr's three financial systems as the worked example.",
    lessons: [
      {
        id: "m6-l1",
        title: "Why Plumbing, Not Banking",
        body: `## Why Plumbing, Not Banking

A bank account is a pool. Money goes in, money comes out, and somewhere in between you lose track of where it went. The pool has a balance, but the balance doesn't tell you anything about purpose. That $4,200 — is it for rent? Groceries? The equipment you need to replace before spring? The pool doesn't know.

The Headwaters Bucket System starts from a different premise: **every dollar needs a destination before it moves.**

## The Watershed Frame

Think of your money as water moving through a landscape:

- **Rain** is income — it falls on payday, or when an invoice clears
- **Buckets** are named vessels — each holds water with a purpose
- **The Payday Planner** is the routing step — you decide where the rain goes before it runs off
- **Gate crossings** are valves — they slow your hand before a protected move
- **The Drip Harvester** is the water wheel — savings working while they sit
- **The Aquifer** is the substrate — the deep reserve that feeds everything above

This isn't metaphor for decoration. It's a model for making decisions. When you name the buckets before the money arrives, you're not budgeting after the fact — you're plumbing the system in advance.

## What Changes When You Name the Buckets

| Without buckets | With buckets |
|---|---|
| "I have $4,200" | "Rent: $1,100. Groceries: $400. GST Reserve: $220. Equipment: $300. Owner Draw: $800. Left to assign: $1,380." |
| Spend first, track later | Route first, spend from named source |
| Month-end regret | Week-by-week clarity |
| One pool, no categories | Multiple vessels, clear purposes |

The bucket system isn't a budget spreadsheet. The money actually sits in named on-chain balances — real RLUSD, on the XRP Ledger, in named positions. It's plumbing, not accounting.

## The Three Systems We'll Build

Bobbie Parr of Parrs Jars runs three financial systems that need to stay separate:

1. **Household (Salt Box)** — personal spending and savings with her partner and kids
2. **Sole Proprietorship (Bench)** — Parrs Jars income, ingredient costs, GST, and owner draw
3. **Business Entity (Community Hall)** — the consulting practice with payroll, tax reserve, and a locked tithe

Each system gets its own Xaman wallet and its own bucket set. They share the same app — but they don't share water.

> "The rain falls. You decide where it goes." — Headwaters field notes
`,
      },
      {
        id: "m6-l2",
        title: "Installing the Pipe: Your Xaman Wallet",
        body: `## Installing the Pipe: Your Xaman Wallet

Before there are buckets, there has to be plumbing. The XRP Ledger is the infrastructure — a public, fast, low-cost financial network that has been running since 2012. Xaman (formerly XUMM) is the tap handle — the app where your keys live and where you approve transactions.

Headwaters Buckets doesn't hold your money. It connects to your Xaman wallet and gives you the bucket interface on top. Your keys stay with you.

## What You Need

- An iPhone or Android phone
- About 30 minutes the first time
- ~$10–15 CAD to cover the ledger reserve and your first test deposit
- A piece of paper and a pen

## Step-by-Step: Phase 1

**Step 1 — Download Xaman**

Available on the App Store and Google Play. Search "Xaman wallet." It's the one with the blue icon, formerly called XUMM.

**Step 2 — Create your wallet**

Xaman will show you a 24-word seed phrase. Write it down on paper. Not in Notes. Not in a photo. Paper only — and store it somewhere dry and private. This phrase is the only way to recover your wallet if your phone is lost or stolen. Headwaters cannot recover it for you.

**Step 3 — Activate the wallet**

Every XRP Ledger address requires a 10 XRP reserve to become active. Think of it as a deposit to open the pipe — the ledger keeps it as a reserve, but it's still yours. At current prices, roughly $7–10 CAD. Send 10 XRP to your new address from any exchange (Coinbase, Newton, Shakepay) or ask someone to send it to you.

> The 10 XRP reserve is locked — it can't leave the wallet while the address is active. It's not spent. It's the pipe fitting that holds everything together.

**Step 4 — Connect to Headwaters**

Open the Headwaters Buckets app and tap "Connect Wallet." It shows a QR code. Open Xaman, scan it, and approve the connection. You're now connected — Headwaters can read your balances and propose transactions, but you approve every move in Xaman.

**Step 5 — Fund with RLUSD**

RLUSD is Ripple's US dollar stablecoin on the XRP Ledger. 1 RLUSD = 1 USD, held constant. You fund your buckets with RLUSD — not XRP, not CAD directly.

In the app, tap "Top Up" → enter amount → pay by card, Apple Pay, or Google Pay. The conversion happens automatically. No exchange account required.

> The standard tap handles up to $250 CAD per transaction. For larger amounts — payroll runs, quarterly tax payments — use the **Abundance Bridge**, which routes through Interac e-Transfer in two steps.

**Step 6 — Choose your zone template**

When you first open the bucket setup, you'll be asked: Household, Sole Proprietorship, or Business? Your answer pre-loads the right bucket set with sensible defaults. You can rename, add, or remove buckets at any time.

## One Wallet Per System

This is the rule that makes the system work:

| System | Zone | Why separate |
|---|---|---|
| Household (Salt Box) | Zone 0 | Personal money stays personal |
| Sole Proprietorship (Bench) | Zone 2 | Business income needs its own track |
| Business Entity (Community Hall) | Zone 4 | Payroll, tax, and tithe in their own vessel |

You manage all three from the same Headwaters app — but each has its own Xaman address, its own bucket set, and its own gate-crossing rules. The water doesn't mix.
`,
      },
      {
        id: "m6-l3",
        title: "Bobbie's Three Systems",
        body: `## Bobbie's Three Systems

Bobbie Parr of Parrs Jars doesn't have one financial life — she has three. They overlap in time and in her attention, but they need to stay separate in the ledger. This lesson walks through each system, its zone, its default bucket set, and which buckets get gate-crossing protection.

---

## System 1 — Household (Salt Box / Zone 0)

The Salt Box is the hearth system. It covers everything that keeps the household running — food, shelter, transport, kids, and the reserves that smooth out the seasons.

**Default bucket set:**

| Bucket | Purpose | Gate-crossed? |
|---|---|---|
| Groceries | Weekly food spend | No |
| Rent / Mortgage | Housing — first priority | Yes |
| Gas & Vehicle | Fuel, insurance, maintenance | No |
| Kids | School supplies, activities, allowance source | No |
| Gifts | Birthdays, holidays | No |
| Vet | Animal care reserve | No |
| Winter Reserve | Off-season household buffer | No — savings bucket |

**Household Mode:** Bobbie generates an invite code. Her partner joins on their device. Both see the same bucket balances in real time. The Payday Planner runs together on payday.

**Helper role:** The kids have a Xaman address. Weekly allowance is pulled from the Kids bucket with a gate-crossing confirmation each time. They receive it to their own wallet — real money, real ledger, real practice.

---

## System 2 — Sole Proprietorship / Parrs Jars (Bench / Zone 2)

The Bench is the workshop system. Parrs Jars income comes in when Bobbie sells at market, fulfills a wholesale order, or invoices a buyer. Payday here isn't a calendar date — it's when the payment clears.

**Default bucket set:**

| Bucket | Purpose | Gate-crossed? |
|---|---|---|
| Ingredients Supply | Raw materials, jars, lids, labels | No |
| Market Fees | Booth fees, farmer's market dues | No |
| GST Reserve | 5% of every taxable sale, held for remittance | Yes |
| Equipment Fund | Savings toward replacement equipment | No — savings bucket |
| Owner Draw | What Bobbie pays herself from the business | Yes |

**Gate crossings on GST Reserve and Owner Draw** exist because both represent money with a prior claim. The GST Reserve belongs to the CRA at remittance time. The Owner Draw crossing means Bobbie explicitly decides to take money out of the business — not something that should happen by accident.

When an RLUSD deposit arrives in the Bench wallet, run the Payday Planner that day. Don't let the rain sit unrouted.

---

## System 3 — Business Entity / Headwaters (Community Hall / Zone 4)

The Community Hall is the most gate-crossed vessel. It handles client engagements, payroll, taxes, and a 10% allocation locked for community purposes.

**Default bucket set:**

| Bucket | Purpose | Gate-crossed? |
|---|---|---|
| Payroll Reserve | Funds earmarked for payroll runs | Yes |
| Tax Reserve | Corporate tax remittance savings | Yes |
| Operations | Day-to-day business expenses | No |
| Client Trust | Retainer or milestone funds held until earned | No |
| Owner Draw | Principal's draw from the business | Yes |
| Tithe (10%) | Locked allocation for community or charitable giving | Yes — one channel only |

**The Tithe bucket** is the strictest. Money that goes in can only go out through the Giving Well or a pre-approved payee. It embodies the co-op principle: a portion of what the business earns returns to the community that sustains it.

**Abundance Bridge for payroll:** Payroll runs typically exceed the $250 CAD tap ceiling. These route through the Abundance Bridge — Interac e-Transfer in, RLUSD conversion, then bucket allocation.

---

## The Zone Map at a Glance

| Zone | Name | System | First bucket to gate-cross |
|---|---|---|---|
| Zone 0 | Salt Box | Household | Rent |
| Zone 2 | Bench | Sole Prop — Parrs Jars | GST Reserve |
| Zone 4 | Community Hall | Business Entity | Payroll Reserve |

> The zones don't describe where you live — they describe the territory the water moves through. Zone 0 is the hearth. Zone 2 is the workshop. Zone 4 is the hall where the community's water is managed on behalf of others.
`,
      },
      {
        id: "m6-l4",
        title: "Payday and the Gate",
        body: `## Payday and the Gate

Payday is when the rain falls. The Payday Planner is the act of routing it before it runs off.

Most people receive income and let it sit in a general account. Over the following weeks, it disperses — some to bills, some to groceries, some to things they don't fully remember. At month end, the balance is what's left, not what was planned.

The bucket system reverses this. **Before you spend a dollar, you name where it goes.**

## Running the Payday Planner

When you open the Payday Planner, it asks one question: **How much came in?**

Enter the deposit amount. The planner walks you through each bucket in order:

**1. Committed expenses first** — gate-crossed buckets (Rent, GST Reserve, Payroll Reserve). These fill first. Their amounts are usually fixed. You confirm the allocation.

**2. Variable expenses next** — Groceries, Gas, Kids, Market Fees, Operations. Set these based on what the month looks like.

**3. Savings buckets** — Winter Reserve, Equipment Fund, Tithe. What's left after committed and variable expenses flows into savings. If nothing's left, that's the signal: the income isn't covering the plan.

**4. Owner Draw** (gate-crossed) — only after everything else is allocated. The draw is what the system can support, not what you'd like it to be.

At the end, the planner shows a summary: total income, total allocated, any unassigned remainder. You confirm. The allocations happen on-chain.

## The Gate Crossing

Not every bucket has a gate. Most spending buckets — Groceries, Gas, Market Fees — you draw from freely. The gate is reserved for buckets where the money has a prior claim or where an accidental move would cause real harm.

**A gate-crossed bucket requires one extra tap before money can leave it.**

Not a password. Not a second approval. Just a deliberate confirmation: *Yes, I am intentionally moving this money, and I know where it's going.*

The gate crossing introduces a pause. It's the valve slowing the hand before you turn it.

**Which buckets get gates:**

| Zone | Gate-crossed buckets | Why |
|---|---|---|
| Salt Box | Rent | Committed housing expense |
| Bench | GST Reserve, Owner Draw | One belongs to the CRA; one should be intentional |
| Community Hall | Payroll Reserve, Tax Reserve, Owner Draw, Tithe | Every disbursement has a named purpose |

## Setting Up Gate Crossings

In the bucket settings screen, toggle "Gate Crossing" on for any bucket you want to protect. The rule of thumb: if accidentally spending from this bucket would cost you more than money — a missed tax remittance, a bounced rent payment — it gets a gate.

## A Note on Sole Proprietor Payday

Bobbie's income doesn't arrive on the 15th and 30th. It arrives when a market day is good, when a wholesale order ships, when an invoice clears. Run the Payday Planner when money lands, not on a fixed schedule. Don't let the rain sit unrouted — it will find its own path, and that path is usually not the one you intended.

> "The gate isn't a lock. It's a breath. One moment between the impulse and the move." — Headwaters field notes
`,
      },
      {
        id: "m6-l5",
        title: "The Water Wheel: Drip Harvester",
        body: `## The Water Wheel: Drip Harvester

When water sits in a bucket, it's just sitting. When it sits at the top of a mill race, it's potential energy waiting to turn a wheel.

The Drip Harvester puts your savings to work while they accumulate. It's not a savings account. It's not interest. It's a position in an XRPL liquidity pool — an Automated Market Maker (AMM) — that earns trading fees proportional to your share of the pool.

## How It Actually Works

When you enrol a savings bucket, a sweep rule triggers when your balance crosses a threshold. Your RLUSD deposits into an AMM pool — for example, RLUSD/XRP. In return, you receive LP tokens representing your share of the pool.

The pool earns 0.3% on every swap that passes through it. Those fees accumulate proportional to your share. When your harvest rule triggers, your LP tokens are redeemed: RLUSD returns to your savings bucket, minus a **5% protocol fee on yield only**. Your principal is returned in full.

If you put in $500 and the position earns $25 over three months, the protocol fee is $1.25. Your $500 comes back.

## Setting Up the Wheel

You need a savings bucket with at least $200–500 CAD RLUSD before the wheel is worth running. Below that, XRP network fees can erode your yield.

1. Open the Earn tab → Drip Harvester
2. Select a savings bucket — Equipment Fund, Winter Reserve, or similar
3. Set a sweep rule: "When balance exceeds $X, sweep $Y into pool"
4. Approve the AMM deposit transaction in Xaman
5. The wheel turns

Set a harvest cadence — monthly is common. More frequent harvests mean more transactions and more network fees; less frequent means more compounding.

## Rough Yield Estimates

These are estimates — not guarantees. Pool performance varies with trading volume and XRP price movement.

| Position | Estimated APR | Monthly yield | Protocol fee/month |
|---|---|---|---|
| $500 RLUSD | ~10% | ~$4 | ~$0.20 |
| $1,000 RLUSD | ~12% | ~$10 | ~$0.50 |
| $2,000 RLUSD | ~15% | ~$25 | ~$1.25 |

For Bobbie's Equipment Fund: a $600 RLUSD position at 10% yields roughly $5/month — earned while the money was waiting to be spent anyway. Over a year, that's $60 toward new canning equipment.

## Impermanent Loss: The Plain-Language Version

When you deposit into an RLUSD/XRP pool, you hold a position in both assets. If XRP's price moves significantly while your position is open, the pool rebalances automatically. When you withdraw, your RLUSD equivalent may be less than if you'd simply held.

**Lower risk:** stable price period, short position duration (weeks not years), small position size.

**Higher risk:** high XRP volatility, long duration, large share of a thin pool.

**The practical rule:** Use the Drip Harvester for savings buckets accumulating toward a goal 3–12 months out. Don't enrol your Rent bucket or your GST Reserve — those are protected vessels. They don't go in the pool.

## At 6 Weeks: Treat as Experimental

The Drip Harvester is live — real XRPL AMM positions, real yield, real fees. But it's early. Start with one savings bucket, a modest amount, and watch one full cycle before scaling up.

> The wheel doesn't hurry. It turns with the current it's given. Start small. Let it prove itself.
`,
      },
      {
        id: "m6-l6",
        title: "The Giving Well & What's Next",
        body: `## The Giving Well

Every watershed has a place where the water returns to the commons. In the Headwaters system, that's the Giving Well.

When XRP appreciates past a threshold you set, the Giving Well diverts those unrealized gains on-chain — to a charity wallet, a community address, or a patronage account you've designated. You're donating the appreciation before it flows back into your system, not converting to cash first.

Appreciated crypto assets donated on-chain may have different CRA treatment than selling and donating cash. Talk to your accountant on the specifics — we're not one.

The Tithe bucket in the Community Hall system feeds the Giving Well: 10% of business earnings allocated to community, leaving through one approved channel. It's a design principle as much as a feature — a portion of what the system earns returns to the watershed that sustains it.

**Setting it up:** In Giving Well settings, enter a destination Xaman address — a registered charity, a community organization, or a trusted patronage address. Set an appreciation threshold. Approve in Xaman when triggered.

---

## The Aquifer: Coming Next

Right now, Bobbie runs three separate app sessions — one for each wallet. The Aquifer will change this.

The Aquifer is the substrate — underground, always full, feeding everything above without being seen. The all-systems dashboard: total reserves across all three wallets, aggregate savings goal progress, cross-system Owner Draw tracking, and the full watershed health in one view.

It's on the roadmap. Not live yet. When it arrives, the three-system setup will feel like one coherent whole instead of three separate tools.

---

## What's Live Now vs. What's Coming

**Live at this release:**

| Feature | Notes |
|---|---|
| Xaman wallet connection | QR scan — you hold the keys |
| RLUSD spending and savings buckets | On-chain balances |
| Payday Planner | Step-by-step allocation |
| Household Mode — 2 adults | Real-time sync |
| Stripe card top-up | Up to $250 CAD |
| Abundance Bridge | Interac e-Transfer for larger flows |
| Gate crossings | Zone 1 and Zone 2 protection |
| Helper role and allowances | To child's own Xaman address |
| Privacy toggle | Hides all balances |
| Drip Harvester / Earn | Live but experimental |
| Giving Well | On-chain appreciated gains |

**On the roadmap:**

| Feature | What it solves |
|---|---|
| Aquifer dashboard | All-systems substrate view |
| Multi-wallet switcher | One session, all three wallets |
| Invoice-triggered Payday | Sole prop payday from deposit, not calendar |
| Zone setup wizard | Pre-loaded bucket templates at onboarding |
| Yield projection calculator | See the wheel's output before you start it |
| Tax-aware bucket warnings | Remittance dates and running estimates |
| Locked Tithe bucket | One-channel-only disbursement primitive |

---

## Your Next Steps

1. **Pick one system to begin.** Household is the easiest first install.
2. **Download Xaman. Write down your seed phrase on paper. Activate the wallet.**
3. **Fund with a small RLUSD amount** — $50–100 CAD to start. Run one Payday Planner cycle.
4. **Let it sit for two weeks.** See how the buckets feel. Adjust the amounts.
5. **Add your second system** once the first feels natural.
6. **Start the wheel only when a savings bucket has $300+ RLUSD.**

The system is patient. The rain falls when it falls. The planner routes it. The buckets hold it. The wheel turns when there's enough current.

> "Channel every drop." — Headwaters
`,
      },
    ],
  },
];