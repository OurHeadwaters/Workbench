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
      "Send the Gilles pitch. Activate the pre-paid services agreement. The $72k is already there — this is delivery, not a new sale.",
    steps: [
      {
        action: "Send the Gilles pitch document and book one call",
        detail:
          "The one-pager is ready. One message: 'I've been building toward this — I think it's the right moment.' The call isn't to sell. It's to confirm what the first two weeks focus on.",
      },
      {
        action: "Agree on the drawdown structure",
        detail:
          "Two weeks of tooling (voice ops, knowledge capture, legacy architecture) draws against the $72k pre-paid balance. Remaining balance clears through hourly work on objectives they define at $175/hr. Write it down. No invoice ceremony.",
      },
      {
        action: "Confirm the Northern Band trial scope and get a council date",
        detail:
          "The $12k portal fee is confirmed. The trial window is open. A specific council date with a written agenda converts this from a warm lead to a contract. Run Gilles and Deer Lake in parallel — June/July is the target pickup for Deer Lake.",
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
    id: "sme-contracts",
    name: "SME Contracts",
    tagline: "Voice ops, legacy architecture, knowledge capture. Gilles is Pilot #1.",
    category: "Consulting",
    tier: "now",
    status: "warm-lead",
    who: "Small and medium operators who are currently the whole system — hotel operators, contractors, family businesses, owner-operators in the 807. High trust, high value. They don't need a platform; they need a person who builds around how they think and makes the operation run without them being everywhere at once.",
    whyThisTier:
      "The Gilles engagement activates a $72k pre-paid balance with no new invoice — that makes this Tier 1. Cash already exists, just needs delivery. The pattern (voice ops + knowledge capture + passive exit documentation) repeats for every SME operator who has built something real but never documented it. Gilles is Pilot #1. The second engagement pays full rate from the start.",
    nextAction:
      "Send the Gilles pitch. Activate the pre-paid agreement. While that's in motion, name one other operator in your network with the same problem — someone who is the whole system, who hasn't slowed down yet but will.",
    steps: [
      {
        action: "Send the Gilles pitch and book the reactivation call",
        detail:
          "The pitch is ready at /gilles-pitch. One message: 'I've been building toward this — I think it's the right moment.' The call confirms what the first two weeks focus on and agrees the drawdown structure.",
      },
      {
        action: "Document what you build as a reusable methodology",
        detail:
          "Every decision made, every pattern that works, every tool configured — write it in plain language as you go. Not for Gilles. For Pilot #2. The methodology document is the thing you sell the second time.",
      },
      {
        action: "Name the next operator",
        detail:
          "Who else in your network is the whole system for their business? A contractor, a farm operator, a trades person with three crews and no documentation? Name one. You don't need to pitch them yet — just name them.",
      },
      {
        action: "Quote the pattern, not the hours",
        detail:
          "The second SME engagement shouldn't be quoted hourly from scratch. Define a package: 2-week discovery + voice tool setup + knowledge capture framework + exit layer. One price. Quote it once and refine from there.",
      },
    ],
    existingPage: null,
    alert: {
      kind: "insight",
      text: "Every SME operator who built something real is a potential client. The common thread: the business runs because they're there. The pitch writes itself.",
    },
    accent: "#1f3d2e",
    accentSoft: "#edf2ee",
    accentInk: "#0f1e17",
  },

  {
    id: "brightside",
    name: "Institutional Contracts",
    tagline: "LTC and regulated orgs. Implementation partner, not SaaS vendor.",
    category: "Consulting",
    tier: "next",
    status: "warm-lead",
    who: "Long-term care facilities, regulated orgs, institutional buyers. One warm LTC lead already identified. The revenue is the engagement — scoping, deployment, training, annual support — not a software license.",
    whyThisTier:
      "LTC facilities don't buy SaaS. They sign contracts with implementation partners. Reframing Brightside this way removes the compliance overhead of running a platform and replaces it with something you already know how to do: scope the problem, build the tool, hold the relationship. The engagement fee + annual support contract is a better revenue model than a monthly subscription for one practitioner.",
    nextAction:
      "Name the warm LTC contact and book a 20-minute scoping conversation — not a sales call. What does their therapy documentation burden actually look like? What would a 90-day implementation engagement need to produce for them to renew?",
    steps: [
      {
        action: "Reframe the pitch: implementation partner, not software vendor",
        detail:
          "Before the call, rewrite the one-paragraph pitch: you come in, you scope their workflow, you configure and deploy a documentation tool, you train the team. Annual support contract, not a monthly login. That's a familiar procurement model for institutions.",
      },
      {
        action: "Book the discovery call with the warm LTC lead",
        detail:
          "Ask about the documentation burden, not the software. What does a therapist's day look like? Where does time go? What's the compliance requirement they're trying to satisfy? The tool emerges from the answers — you're not demoing a product.",
      },
      {
        action: "Define what a 90-day pilot engagement looks like",
        detail:
          "Scope, deliverables, what they get at the end of it. Not a trial — a paid engagement with a defined output. Letter of intent, not a full contract. The pilot is Pilot #1 of an institutional practice.",
      },
      {
        action: "Map PHIPA as a delivery item, not a compliance burden",
        detail:
          "The $5k audit is in the cost basis. Position it as something you manage for them — they don't have to figure out what PHIPA means for their workflow, you handle it as part of the engagement. That's the value of an implementation partner over a SaaS login.",
      },
    ],
    existingPage: "/brightside",
    alert: {
      kind: "insight",
      text: "The tool is the delivery mechanism. The contract is the revenue. Run this the same way you run Northern Band — scoped, boundaried, relationship-first.",
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
