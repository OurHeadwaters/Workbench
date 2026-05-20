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
];
