/**
 * portfolio.ts — The full revenue map.
 *
 * Eight lines across three tiers. Authored from the founder's description
 * of the actual business portfolio, May 2026.
 *
 * Tier framing:
 *   "now"  — cash is available or imminent; pursue now regardless of other priorities
 *   "next" — methodology or product exists; needs packaging and a first paying client
 *   "later"— real runway required; do not let these consume focus before Tier 1 is solid
 *
 * Capacity rule: one practitioner. Sequence ruthlessly.
 */

export type Tier = "now" | "next" | "later";

export type LineStatus =
  | "active"        // producing cash or confirmed work on the books
  | "building"      // product/methodology exists; no paying client yet
  | "warm-lead"     // specific buyer identified; not yet converted
  | "not-started"   // real opportunity; zero progress yet
  | "speculative";  // depends on external factors outside founder's control

export type LineCategory =
  | "Consulting"
  | "Physical"
  | "Hardware"
  | "SaaS"
  | "Fintech"
  | "Product";

export interface PortfolioAlert {
  kind: "bundle" | "risk" | "forcing-function" | "insight";
  text: string;
}

export interface RevenueStep {
  action: string;
  detail: string;
}

export interface RevenueLine {
  id: string;
  name: string;
  tagline: string;
  category: LineCategory;
  tier: Tier;
  status: LineStatus;
  who: string;
  whyThisTier: string;
  nextAction: string;
  steps: RevenueStep[];
  existingPage: string | null;
  alert?: PortfolioAlert;
  accent: string;
  accentSoft: string;
  accentInk: string;
}

export const REVENUE_LINES: RevenueLine[] = [
  // ── TIER 1 — CASH NOW ─────────────────────────────────────────────────────

  {
    id: "consulting",
    name: "Community Contracts",
    tagline: "Hourly engagements. 807, GMPH, band offices.",
    category: "Consulting",
    tier: "now",
    status: "active",
    who: "807 Food Co-op, GMPH (Grand Medicine / health organizations), band offices, regional orgs in the 807 area code.",
    whyThisTier:
      "Active relationships, clear scope, money in motion. This is the bridge that funds time to build everything else. Do not let Tier 2 or Tier 3 thinking crowd out the next billable hour.",
    nextAction:
      "Book the next 807 or GMPH call. Write the scope in one paragraph before you walk in.",
    steps: [
      {
        action: "Confirm the Northern Band trial scope and get a council date",
        detail:
          "The $12k portal fee is confirmed. The trial window is open. A specific council date with a written agenda converts this from a warm lead to a contract.",
      },
      {
        action: "Name the next 807 / GMPH engagement",
        detail:
          "What is the scope of the next hourly project? Name it, quote it, and send it. Do not leave active relationships idle.",
      },
      {
        action: "Keep the rate sheet current",
        detail:
          "$175/hr lead · $70/hr support · trial-first model. Every new client gets the same sheet — no bespoke pricing on the first call.",
      },
    ],
    existingPage: "/contracts",
    accent: "#1A5FA8",
    accentSoft: "#EBF3FB",
    accentInk: "#0F3460",
  },

  {
    id: "salts-syrup",
    name: "Salts + Syrup",
    tagline: "Parr's Jars physical products. Four channels.",
    category: "Physical",
    tier: "now",
    status: "active",
    who: "Farmers market shoppers, wholesale accounts (restaurants, grocers), online buyers, local retail.",
    whyThisTier:
      "Only cash-positive stream with no debt load. The June farmers market is a forcing function — production must be confirmed before the first stall date, not after.",
    nextAction:
      "Confirm production volume for the first market day. Know the jar count before you book the stall.",
    steps: [
      {
        action: "Confirm supply for the June farmers market",
        detail:
          "End of June is close. How many jars of salt and cases of syrup can you bring to the first stall? Lock the number now so you're not scrambling the week before.",
      },
      {
        action: "Track the next three batches against real yield",
        detail:
          "The 1,190 jars/yr planning target is a model assumption. Three batches of real data replaces the guess with a number you can stand on.",
      },
      {
        action: "Decide on the 8 → 12 case syrup run",
        detail:
          "Sells out early, extra cases are viable. Decide yes or no — the indecision costs more than the wrong answer.",
      },
      {
        action: "Use the market stall to pitch services",
        detail:
          "The market is not just a product channel. It is the highest-density local audience you'll have all season. Have a one-liner ready for what you do beyond jars.",
      },
    ],
    existingPage: "/salts",
    alert: {
      kind: "forcing-function",
      text: "Farmers market opens end of June. That is a hard production deadline — confirm supply before booking the stall.",
    },
    accent: "#3A6B35",
    accentSoft: "#EAF3E9",
    accentInk: "#1F4A1A",
  },

  {
    id: "start9",
    name: "Start9 / Privacy Servers",
    tagline: "Hardware + setup. Relationship acquisition disguised as hardware sales.",
    category: "Hardware",
    tier: "now",
    status: "not-started",
    who: "Privacy-conscious locals, small businesses, co-ops, and anyone in the 807 who wants a self-hosted stack. The buyer of a Start9 server today is the tech client of tomorrow.",
    whyThisTier:
      "Low friction to start, no compliance path required, cash on delivery. Treat it as a client acquisition strategy — every setup job becomes a trusted tech relationship.",
    nextAction:
      "Define the offering: hardware only, or hardware + setup + annual support? Set the price. Post it somewhere.",
    steps: [
      {
        action: "Define the SKU and price",
        detail:
          "Hardware only (cost + margin) vs. hardware + setup (flat fee) vs. hardware + setup + annual support (recurring). Start simple — one package, one price.",
      },
      {
        action: "Identify five people in your local network who would buy today",
        detail:
          "Don't build a funnel. Name five people who have expressed interest in privacy tools, self-hosting, or local tech. Message them this week.",
      },
      {
        action: "Frame it as a service, not a product",
        detail:
          "You're not selling a box — you're selling the peace of mind of someone local who will pick up the phone. That's worth more than the hardware.",
      },
    ],
    existingPage: null,
    alert: {
      kind: "insight",
      text: "Every Start9 buyer is a warm consulting lead. Treat setup calls as discovery sessions, not transactions.",
    },
    accent: "#525252",
    accentSoft: "#F5F5F5",
    accentInk: "#262626",
  },

  // ── TIER 2 — PACKAGE AND SHIP ─────────────────────────────────────────────

  {
    id: "store-plan",
    name: "Northern Store Plan",
    tagline: "White-label the Northern Band methodology to any 807 store.",
    category: "Product",
    tier: "next",
    status: "building",
    who: "Community stores, band council-run retail, co-op operators anywhere in the 807 area code. The Northern Band engagement is Pilot #1 — every other store is a repeatable sale.",
    whyThisTier:
      "The methodology exists and is proven. The only thing missing is a one-page scope document and a rate sheet that makes it easy for a second client to say yes. This is the fastest path from 'one contract' to 'a business.'",
    nextAction:
      "Write a one-page scope document for the white-label store plan. What does a client get? What does it cost? How long does it take?",
    steps: [
      {
        action: "Package the methodology into a deliverables list",
        detail:
          "What did Northern Band get? List the exact outputs: store plan document, financial model, governance template, implementation guide. This list is your product.",
      },
      {
        action: "Set the white-label price",
        detail:
          "Trial-first: bounded 6-week engagement at hourly rates. Then a retainer or deliverable-based package. Do not invent a new pricing model — adapt the one you already use.",
      },
      {
        action: "Name two target stores for Pilot #2 outreach",
        detail:
          "The Pilot #2 targeting scorecard already exists in the guide. Use it. Name the top two candidates and assign a contact date.",
      },
    ],
    existingPage: "/pilot-two",
    alert: {
      kind: "bundle",
      text: "Bundle insight: Northern Store Plan and 807 Benefits go to the same buyer — band councils and co-op operators. One meeting can sell both. Build the pitch together.",
    },
    accent: "#92400E",
    accentSoft: "#FEF3C7",
    accentInk: "#451A03",
  },

  {
    id: "807-benefits",
    name: "807 Benefits Platform",
    tagline: "White-label co-op and community membership platform.",
    category: "SaaS",
    tier: "next",
    status: "building",
    who: "Community co-operatives, band member benefit programs, regional membership organizations. The 807 Food Co-op is the reference client — every other co-op in the region is a potential licensee.",
    whyThisTier:
      "The platform exists and has a live reference client. The white-label question is a packaging and pricing question, not a build question. This should not require significant new development to sell to the next client.",
    nextAction:
      "Identify the first white-label client beyond 807 Food Co-op. Name the org and the contact. Book a discovery call.",
    steps: [
      {
        action: "Define what 'white-label' means in concrete terms",
        detail:
          "Does the buyer get their own domain, their own branding, their own data? Or is it a shared instance with custom styling? Define the offer before you pitch it.",
      },
      {
        action: "Set the white-label price",
        detail:
          "Setup fee + monthly license. What does a community org of 200 members pay vs. one of 2,000? Simple two-tier pricing is enough to start.",
      },
      {
        action: "Use existing co-op relationships as the first door",
        detail:
          "You already have credibility in the 807 co-op network. A warm introduction from 807 Food Co-op to a neighbouring co-op is faster than any cold outreach.",
      },
      {
        action: "Draft the grant facilitation pitch",
        detail:
          "Co-ops and band organizations can often access FedNor CEDP, LFIF, or Nutrition North funding for technology investments. You can facilitate the grant and charge for that as a service — separate from the platform license.",
      },
    ],
    existingPage: null,
    alert: {
      kind: "bundle",
      text: "Bundle with Northern Store Plan — same buyer, same meeting. Present both together as the community operations stack.",
    },
    accent: "#065F46",
    accentSoft: "#D1FAE5",
    accentInk: "#022C22",
  },

  {
    id: "personal-tools",
    name: "Personal Tools",
    tagline: "Internal tools packaged and sold to your local business network.",
    category: "Product",
    tier: "next",
    status: "not-started",
    who: "Dryden and 807-area small businesses — bookkeeping, operations tracking, scheduling, receipts. The Headwaters Books app is the obvious candidate. Local businesses who know you personally are the easiest first sale.",
    whyThisTier:
      "You have built tools that solve real problems you faced. The packaging step is small — a price, a demo, and an onboarding flow. But this requires clarity on which tools and who the first buyer is.",
    nextAction:
      "Name the one tool you would sell first and the three people in your local network who would pay for it today.",
    steps: [
      {
        action: "Define which tools are sellable right now",
        detail:
          "Not everything you've built is a product. Pick the one that solves a problem someone else has, is already running, and requires the least customization to hand over.",
      },
      {
        action: "Set a price and a demo flow",
        detail:
          "Even a rough price is better than no price. A 20-minute screen share demo is the entire sales process for a local business. Prepare it once and reuse it.",
      },
      {
        action: "Sell to the three warmest people first",
        detail:
          "Your first local tool sales are relationship sales. The price matters less than getting the first paying user — they become the reference story for everyone else.",
      },
    ],
    existingPage: null,
    accent: "#4338CA",
    accentSoft: "#EEF2FF",
    accentInk: "#1E1B4B",
  },

  // ── TIER 3 — LONG RUNWAY REQUIRED ─────────────────────────────────────────

  {
    id: "brightside",
    name: "Brightside — Recreation Therapy",
    tagline: "RT SaaS for long-term care. Warm LTC lead to convert.",
    category: "SaaS",
    tier: "later",
    status: "warm-lead",
    who: "Long-term care facility administrators. One specific warm lead already identified. Pricing and cost basis are fully modelled — the only missing piece is a pilot conversation.",
    whyThisTier:
      "Real upside and a warm lead — but LTC procurement moves slowly and PHIPA compliance adds runway. Do not let this distract from Tier 1 cash. The best time to book the first LTC conversation is when the Northern Band contract is signed and you have 20% of your week free.",
    nextAction:
      "Name the warm LTC contact and book a 20-minute call. Do not sell on the first call — ask about their therapy documentation workflow.",
    steps: [
      {
        action: "Book the first conversation with the warm LTC lead",
        detail:
          "Not a sales call — a discovery call. What documentation burden does their therapy team carry? What does a 90-day pilot need to look like for them to say yes?",
      },
      {
        action: "Draft the one-paragraph pilot pitch",
        detail:
          "Tier 1 facility, $195/mo + $500 setup, 90 days, letter of intent not a full contract. Write it before the call so you're not improvising.",
      },
      {
        action: "Map the PHIPA compliance path",
        detail:
          "LTC administrators will ask. The $5k audit is in the cost basis. Know who does it, how long it takes, and what the output looks like before the question comes up.",
      },
    ],
    existingPage: "/brightside",
    alert: {
      kind: "risk",
      text: "LTC procurement is slow. Do not count on Brightside revenue in 2026 unless a pilot letter of intent is signed by August.",
    },
    accent: "#4A2080",
    accentSoft: "#F0EAFA",
    accentInk: "#2A0F5A",
  },

  {
    id: "xrpl",
    name: "XRPL Personal Finance App",
    tagline: "Stablecoin rails for three distinct market segments.",
    category: "Fintech",
    tier: "later",
    status: "speculative",
    who: "Three segments: (1) Crypto enthusiasts on XRPL rails with Xaman wallet. (2) Credit union members using debit rails. (3) Investors Group clients who want self-custody crypto. Each is a different product, buyer, and compliance path.",
    whyThisTier:
      "Highest potential upside but most complex to execute. Credit union integration requires financial services compliance work. Investors Group is enterprise sales with a multi-month cycle. Crypto enthusiasts in the 807 are a small market. This should not receive meaningful attention until Tier 1 cash is stable and Tier 2 has at least one paying client.",
    nextAction:
      "Do nothing on this until the Northern Band contract is signed. Then decide: which of the three segments pulls first? That decision determines the entire build path.",
    steps: [
      {
        action: "Decide which of the three segments leads",
        detail:
          "Crypto enthusiast (B2C, small market, fast to ship) vs. credit union (B2B2C, compliance required, larger market) vs. Investors Group (enterprise, longest cycle, highest ticket). Pick one. They are not the same product.",
      },
      {
        action: "Map the compliance path for the chosen segment",
        detail:
          "Credit union integration touches financial services regulation. Investors Group requires advisor compliance sign-off. Enthusiast-only avoids most of this. Know what you're taking on before you build.",
      },
      {
        action: "Define the Xaman integration scope",
        detail:
          "Xaman (formerly XUMM) has a developer API. What specifically does your app do that Xaman alone does not? The differentiation needs to be clear before a line of code is written.",
      },
    ],
    existingPage: null,
    alert: {
      kind: "risk",
      text: "Do not start this until Tier 1 is stable. The compliance and partnership work alone could consume a full quarter — that quarter needs to be funded by something else first.",
    },
    accent: "#B45309",
    accentSoft: "#FEF3C7",
    accentInk: "#431407",
  },
];

export const TIER_META = {
  now: {
    label: "Now",
    description: "Cash available or imminent. Pursue regardless of other priorities.",
    color: "#15803D",
    bg: "#F0FDF4",
    border: "#86EFAC",
  },
  next: {
    label: "Next — package and ship",
    description: "Methodology or product exists. Package it and find the first paying client.",
    color: "#B45309",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
  later: {
    label: "Later — real runway required",
    description:
      "Do not let these consume focus before Tier 1 is solid and Tier 2 has at least one client.",
    color: "#6B21A8",
    bg: "#FAF5FF",
    border: "#D8B4FE",
  },
} as const;
