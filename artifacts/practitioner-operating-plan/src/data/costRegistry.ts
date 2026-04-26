// Cost registry — every dollar figure the founder must approve.
// Ordered by importance for the walkthrough.

export type CostUnit =
  | "$/mo"
  | "$/yr"
  | "$/hr"
  | "$/day"
  | "$ one-time"
  | "%";

export type CostSlide = {
  href: string;
  label: string;
  /**
   * Optional canonical slide source path (relative to the artifact root),
   * e.g. `"src/pages/slides/Budget.tsx"`. When present, the position
   * encoded in `href` is cross-checked against `slides-manifest.json` by
   * `scripts/check-slide-refs.ts`, which fails the build on drift.
   * Pages that aren't deck slides (e.g. `/payback-memo`) leave this unset.
   */
  manifestFile?: string;
};

export type CostCategory =
  | "Headline ask"
  | "Headline totals"
  | "Recommended-scenario roles"
  | "Recommended-scenario overheads"
  | "Floor scenario (A · $60k)"
  | "Scale scenario (C · $125k)"
  | "People & Retention — A · floor"
  | "People & Retention — B · recommended"
  | "People & Retention — C · scale"
  | "Day-one bridge & CAPEX"
  | "Reinvestment math"
  | "Headwaters payback"
  | "Hourly rates"
  | "Role monthly profiles"
  | "Salt economics"
  | "Cross-reserve install"
  | "Path to scale";

export type CostEntry = {
  id: string;
  category: CostCategory;
  label: string;
  defaultValue: number;
  unit: CostUnit;
  context: string;
  slides: CostSlide[];
  /**
   * `true` for derived totals (cost basis A/B/C, bridge, etc) that the
   * walkthrough surfaces as *checkpoints* — the founder verifies the
   * roll-up looks right but cannot edit it directly. The live value is
   * computed at render time via `budgetMath`. Edits flow through the
   * underlying line items the total sums.
   */
  derived?: boolean;
};

const slide = (
  position: number,
  label: string,
  manifestFile?: string,
): CostSlide => {
  const entry: CostSlide = {
    href: `/slide${position}`,
    label,
  };
  if (manifestFile !== undefined) {
    entry.manifestFile = manifestFile;
  }
  return entry;
};

// V3 deck rebuild (April 2026): the V2 deck of ~50 slides was replaced
// with a 6-slide V3 deck (Cover, SlabVsGrassland, TheSixPeople,
// ThreeRevenueLayers, YearOnePicture, Closing). The cost-review modal
// shortcuts below kept their `position` numbers as legacy bookmarks but
// no longer cross-reference deleted V2 slide files. Rewiring each
// shortcut to a live V3 slide (or removing the slide-jump entirely) is
// tracked as separate follow-up work; check-slide-refs only validates
// entries that still pass a manifestFile, so omitting it here is the
// supported way to mark "no live deck home for this cost".
const SLIDE_BUDGET = slide(46, "Budget");
const SLIDE_CASHFLOW = slide(47, "Cash flow");
const SLIDE_PAYBACK_PITCH = slide(48, "Payback pitch");
const SLIDE_REINVEST = slide(49, "Reinvestment");
const SLIDE_RATE = slide(52, "Case for rate");
const SLIDE_TEAM = slide(53, "Case for team");
const SLIDE_CLOSING = slide(55, "Closing — naming the deal");
const SLIDE_PATH = slide(60, "Path to scale");
const SLIDE_SALT_BENCH = slide(67, "Salt bench");
const SLIDE_SALT_PL = slide(68, "Salt P&L");
const SLIDE_ROLE_OPS_MANAGER = slide(24, "Role — Ops Manager");
const SLIDE_ROLE_BOOKKEEPER = slide(25, "Role — Bookkeeper");
const SLIDE_ROLE_FOOD_HANDLER = slide(26, "Role — Food Handler");
const SLIDE_ROLE_HOUSECLEANER = slide(27, "Role — Housecleaner");
const SLIDE_ROLE_TUTOR = slide(28, "Role — Tutor");
const SLIDE_ROLE_HANDYMAN = slide(29, "Role — Handyman");
const SLIDE_PEOPLE_SIZING = slide(44, "People — sizing per scenario");
const PAGE_PAYBACK_MEMO: CostSlide = {
  href: "/payback-memo",
  label: "Payback memorandum",
};

export const COST_REGISTRY: CostEntry[] = [
  // -------- Headline ask --------------------------------------------
  {
    id: "ask.recommended",
    category: "Headline ask",
    label: "Recommended monthly contract (Scenario B)",
    defaultValue: 90000,
    unit: "$/mo",
    context:
      "The number on the table — what you're asking Dad to fund. $1.08M/yr annualised. Everything else in the deck either rolls up to or back from this.",
    slides: [SLIDE_BUDGET, SLIDE_CASHFLOW, SLIDE_RATE, SLIDE_CLOSING],
  },
  {
    id: "markup.target",
    category: "Headline ask",
    label: "Reinvestment markup (target)",
    defaultValue: 35,
    unit: "%",
    context:
      "The dedicated reinvestment line on top of cost basis. Bill = cost × 1.35. Drives the Reinvestment slide. Actuals drift as cost basis grows.",
    slides: [SLIDE_BUDGET, SLIDE_REINVEST],
  },
  {
    id: "ask.floor",
    category: "Headline ask",
    label: "Floor monthly contract (Scenario A)",
    defaultValue: 60000,
    unit: "$/mo",
    context:
      "The walk-away floor — practitioner core only, no second engagement on the horizon.",
    slides: [SLIDE_BUDGET, SLIDE_CASHFLOW],
  },
  {
    id: "ask.scale",
    category: "Headline ask",
    label: "Scale monthly contract (Scenario C)",
    defaultValue: 125000,
    unit: "$/mo",
    context:
      "Where this lands once Pilot #2 is live and three concurrent reserves are running by year two.",
    slides: [SLIDE_BUDGET, SLIDE_CASHFLOW],
  },

  // -------- Headline totals (derived from the budget walk) ----------
  {
    id: "summary.costBasis.b",
    category: "Headline totals",
    label: "Cost basis — Scenario B (recommended)",
    defaultValue: 69700,
    unit: "$/mo",
    context:
      "Sum of every Scenario B role line + overheads. The recommended ask sits on top of this; the markup feeds the reinvestment line. Edit individual role lines to move this number.",
    slides: [SLIDE_BUDGET, SLIDE_REINVEST],
    derived: true,
  },
  {
    id: "summary.costBasis.a",
    category: "Headline totals",
    label: "Cost basis — Scenario A (floor)",
    defaultValue: 50000,
    unit: "$/mo",
    context:
      "Sum of the leaner role set on Scenario A. The case-for-team slide quotes this as 'saves ~$50k/mo on paper, costs the contract'. Edit Scenario A role lines to move this.",
    slides: [SLIDE_BUDGET, SLIDE_TEAM],
    derived: true,
  },
  {
    id: "summary.costBasis.c",
    category: "Headline totals",
    label: "Cost basis — Scenario C (scale)",
    defaultValue: 100000,
    unit: "$/mo",
    context:
      "Sum of the Scenario C role set — what it costs once Pilot #2 is live and three concurrent reserves are running. Edit Scenario C role lines to move this.",
    slides: [SLIDE_BUDGET, SLIDE_CASHFLOW],
    derived: true,
  },

  // -------- Recommended-scenario roles ------------------------------
  {
    id: "budget.b.practitioner",
    category: "Recommended-scenario roles",
    label: "Practitioner / Lead",
    defaultValue: 18000,
    unit: "$/mo",
    context:
      "Engagement owner — your loaded monthly take in the recommended scenario.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.b.itTech",
    category: "Recommended-scenario roles",
    label: "IT/Tech",
    defaultValue: 9500,
    unit: "$/mo",
    context:
      "Servers, privacy phones, transparency stack, store IT. The single role that owns the 9-server fleet.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.b.opsManager",
    category: "Recommended-scenario roles",
    label: "Operations Manager",
    defaultValue: 9500,
    unit: "$/mo",
    context:
      "Dryden, on-site. ~40 hrs/wk @ $40/hr loaded. The phone-holder. Parity-bumped to match IT/Tech ($9.5k) — both roles carry the agency's day-to-day continuity. The +$1k vs. the prior figure is absorbed by existing reinvestment margin.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.b.cdAssociate",
    category: "Recommended-scenario roles",
    label: "Community Dev. Associate",
    defaultValue: 7500,
    unit: "$/mo",
    context: "Engagement #2 readiness — the seat that makes Pilot #2 real.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.b.juniorAnalyst",
    category: "Recommended-scenario roles",
    label: "Junior Analyst / Field",
    defaultValue: 6500,
    unit: "$/mo",
    context:
      "Data, household lookups, fieldwork — the seat that keeps the senior roles out of the spreadsheet weeds.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.b.foodHandler",
    category: "Recommended-scenario roles",
    label: "Food Handler (embedded at Deer Lake)",
    defaultValue: 5000,
    unit: "$/mo",
    context:
      "Headwaters-owned, on the store floor Day 1. Salt batches, 807 piecework, kitchen + shop tidy, supplies inventory.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.b.bookkeeper",
    category: "Recommended-scenario roles",
    label: "Bookkeeper / Admin",
    defaultValue: 2500,
    unit: "$/mo",
    context:
      "Remote, ~10 hrs/wk @ $40/hr loaded. CRA, invoicing, monthly close.",
    slides: [SLIDE_BUDGET],
  },

  // -------- Recommended-scenario overheads --------------------------
  {
    id: "budget.b.aggregationHub",
    category: "Recommended-scenario overheads",
    label: "Aggregation hub (Dad-warehouse)",
    defaultValue: 3000,
    unit: "$/mo",
    context:
      "$2,200 rent + utilities, all-in. Garage and house-next-door priced as expansion options, not yet activated. See /lease-tooling.",
    slides: [SLIDE_BUDGET, SLIDE_CASHFLOW, SLIDE_RATE],
  },
  {
    id: "budget.b.tooling",
    category: "Recommended-scenario overheads",
    label: "Tooling, SaaS, insurance",
    defaultValue: 2500,
    unit: "$/mo",
    context: "Operating overhead — the agency's licenses and software stack.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.b.buffer",
    category: "Recommended-scenario overheads",
    label: "Buffer (statutory + variance)",
    defaultValue: 2400,
    unit: "$/mo",
    context:
      "The variance line that lets the cost basis hold even when payroll taxes or insurance jump.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.b.recurringTech",
    category: "Recommended-scenario overheads",
    label: "Recurring tech ops",
    defaultValue: 2200,
    unit: "$/mo",
    context: "Cloud, phone plans, monitoring — what the 9-server fleet costs to run monthly.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.b.lifeSupports",
    category: "Recommended-scenario overheads",
    label: "Life supports (cleaner · tutor · handyman)",
    defaultValue: 2100,
    unit: "$/mo",
    context:
      "Loaded household supports that make the non-negotiables hold. Cleaner $500/mo + tutor $900/mo + handyman $700/mo.",
    slides: [SLIDE_BUDGET],
  },

  // -------- Day-one bridge & CAPEX ----------------------------------
  {
    id: "capex.b",
    category: "Day-one bridge & CAPEX",
    label: "Day-one tech CAPEX (Scenario B)",
    defaultValue: 42000,
    unit: "$ one-time",
    context:
      "3 servers, 3 privacy phones, 5 computers, networking — the hardware the recommended team needs in the field on Day 1.",
    slides: [SLIDE_CASHFLOW],
  },
  {
    id: "capex.c",
    category: "Day-one bridge & CAPEX",
    label: "Day-one tech CAPEX (Scenario C)",
    defaultValue: 60000,
    unit: "$ one-time",
    context:
      "6 servers, 6 phones, 8 computers, full rack — the hardware for the scale scenario.",
    slides: [SLIDE_CASHFLOW],
  },
  {
    id: "bridge.b.headline",
    category: "Day-one bridge & CAPEX",
    label: "Day-one bridge ask (Scenario B)",
    defaultValue: 201000,
    unit: "$ one-time",
    context:
      "Two months of *loaded* monthly outflow (role lines + People & Retention buckets) + day-one tech CAPEX. Computed live as loadedCostB × 2 + capexB so the bridge ask matches what the Cash Flow projection actually plots. Edit the underlying role lines, people.b.* buckets, or capex.b to move this number.",
    slides: [SLIDE_CASHFLOW, SLIDE_CLOSING],
    derived: true,
  },

  // -------- Reinvestment math (destinations of the reinvestment pool) ----
  {
    id: "reinvest.techCapex.annual",
    category: "Reinvestment math",
    label: "Tech CAPEX (annual)",
    defaultValue: 60000,
    unit: "$/yr",
    context:
      "9 servers, 6 privacy phones, 8 work computers, networking — owned by the agency, deployed in service of Deer Lake.",
    slides: [SLIDE_REINVEST],
  },
  {
    id: "reinvest.tooling.monthly",
    category: "Reinvestment math",
    label: "Tooling subscriptions (monthly)",
    defaultValue: 2000,
    unit: "$/mo",
    context:
      "Transparency dashboard hosting, GIS, secure comms, project ops, bookkeeping, engineering licenses.",
    slides: [SLIDE_REINVEST],
  },
  {
    id: "reinvest.training.monthly",
    category: "Reinvestment math",
    label: "Training & R&D (monthly)",
    defaultValue: 3000,
    unit: "$/mo",
    context:
      "Indigenous-services certifications, conferences (CANDO, AFOA, ANTCO), documentation hours, community-member training.",
    slides: [SLIDE_REINVEST],
  },
  {
    id: "reinvest.pilotReserve.monthly",
    category: "Reinvestment math",
    label: "Pilot scale reserve (monthly accrual)",
    defaultValue: 13000,
    unit: "$/mo",
    context:
      "The biggest line. Accumulates so Pilot #2 doesn't wait for grants.",
    slides: [SLIDE_REINVEST],
  },
  {
    id: "reinvest.year1Reserve",
    category: "Reinvestment math",
    label: "Year-1 reserve (target)",
    defaultValue: 160000,
    unit: "$/yr",
    context:
      "The pilot scale reserve at end of year one — enough to seed Pilot #2 ahead of contract close.",
    slides: [SLIDE_REINVEST],
  },

  // -------- Headwaters payback --------------------------------------
  {
    id: "payback.accountantCarveOut",
    category: "Headwaters payback",
    label: "807 grant — accountant carve-out",
    defaultValue: 6000,
    unit: "$ one-time",
    context:
      "Accountant fees on the 807 grant proposal — billed to the co-op directly, NOT in this bill.",
    slides: [
      slide(48, "Platform bill — payback"),
    ],
  },

  {
    id: "payback.principal",
    category: "Headwaters payback",
    label: "Principal owed by 807 to Headwaters",
    defaultValue: 22000,
    unit: "$ one-time",
    context:
      "Both grant streams (CDP/business-dev + marketing/promotion) delivered. The principal — Replit hosting accrues separately.",
    slides: [SLIDE_PAYBACK_PITCH, PAGE_PAYBACK_MEMO],
  },
  {
    id: "payback.originalScope",
    category: "Headwaters payback",
    label: "Original grant scope (both streams)",
    defaultValue: 40000,
    unit: "$ one-time",
    context:
      "What both contractor streams were originally budgeted at. Headwaters delivered both for $22k after the marketing contractor backed out.",
    slides: [SLIDE_PAYBACK_PITCH, PAGE_PAYBACK_MEMO],
  },
  {
    id: "payback.monthlyMin",
    category: "Headwaters payback",
    label: "Trigger A monthly draw — low end",
    defaultValue: 1000,
    unit: "$/mo",
    context:
      "Bottom of the target range once Trigger A (deficit clears) fires. Sized so the line never threatens an operating month.",
    slides: [PAGE_PAYBACK_MEMO],
  },
  {
    id: "payback.monthlyMax",
    category: "Headwaters payback",
    label: "Trigger A monthly draw — high end",
    defaultValue: 1500,
    unit: "$/mo",
    context: "Top of the target range. Bookkeeper signs off quarterly.",
    slides: [PAGE_PAYBACK_MEMO],
  },
  {
    id: "payback.replitHosting",
    category: "Headwaters payback",
    label: "Replit hosting (project-to-date)",
    defaultValue: 500,
    unit: "$ one-time",
    context:
      "Actuals — own line so the receipt is visible. Continues at roughly the same rate while the platform stays live.",
    slides: [SLIDE_PAYBACK_PITCH, PAGE_PAYBACK_MEMO],
  },

  // -------- Hourly rates --------------------------------------------
  {
    id: "rate.market.lowSkill",
    category: "Hourly rates",
    label: "Dryden labour-market floor (low-skill)",
    defaultValue: 25,
    unit: "$/hr",
    context: "Local benchmark — informs OM/housecleaner rate choices in slide copy.",
    slides: [SLIDE_ROLE_OPS_MANAGER, SLIDE_ROLE_HOUSECLEANER],
  },
  {
    id: "rate.opsManager",
    category: "Hourly rates",
    label: "Operations Manager hourly",
    defaultValue: 40,
    unit: "$/hr",
    context: "Trial weeks paid at full rate. Drives the OM loaded monthly.",
    slides: [
      slide(31, "Hiring — OM"),
      SLIDE_ROLE_OPS_MANAGER,
    ],
  },
  {
    id: "rate.bookkeeper",
    category: "Hourly rates",
    label: "Bookkeeper hourly",
    defaultValue: 40,
    unit: "$/hr",
    context: "Paid against fixed scope cap.",
    slides: [
      slide(32, "Hiring — Bookkeeper"),
      SLIDE_ROLE_BOOKKEEPER,
    ],
  },
  {
    id: "rate.itTechDayLow",
    category: "Hourly rates",
    label: "IT/Tech day rate (low end)",
    defaultValue: 600,
    unit: "$/day",
    context: "Trial day rate floor for the IT/Tech hire.",
    slides: [slide(33, "Hiring — IT/Tech")],
  },
  {
    id: "rate.itTechDayHigh",
    category: "Hourly rates",
    label: "IT/Tech day rate (high end)",
    defaultValue: 900,
    unit: "$/day",
    context: "Trial day rate ceiling for senior IT/Tech.",
    slides: [slide(33, "Hiring — IT/Tech")],
  },
  {
    id: "rate.tutor",
    category: "Hourly rates",
    label: "Tutor hourly",
    defaultValue: 35,
    unit: "$/hr",
    context: "Trial sessions paid regardless. Vulnerable Sector Check reimbursed on hire.",
    slides: [
      slide(36, "Hiring — Tutor"),
      SLIDE_ROLE_TUTOR,
    ],
  },
  {
    id: "rate.housecleaner",
    category: "Hourly rates",
    label: "Housecleaner hourly",
    defaultValue: 30,
    unit: "$/hr",
    context: "Trial visits paid. No 'free first clean'.",
    slides: [
      slide(35, "Hiring — Housecleaner"),
      SLIDE_ROLE_HOUSECLEANER,
    ],
  },
  {
    id: "rate.handyman",
    category: "Hourly rates",
    label: "Handyman hourly",
    defaultValue: 30,
    unit: "$/hr",
    context: "Trial weeks paid regardless of outcome.",
    slides: [
      slide(37, "Hiring — Handyman"),
      SLIDE_ROLE_HANDYMAN,
    ],
  },
  {
    id: "rate.foodHandler",
    category: "Hourly rates",
    label: "Food Handler hourly (loaded)",
    defaultValue: 30,
    unit: "$/hr",
    context: "Sits between housecleaner and OM rates — loaded with statutory.",
    slides: [SLIDE_ROLE_FOOD_HANDLER],
  },
  // -------- Role monthly profiles (per Role-* slide) ---------------
  {
    id: "role.monthly.opsManager",
    category: "Role monthly profiles",
    label: "Operations Manager · loaded monthly",
    defaultValue: 7000,
    unit: "$/mo",
    context: "40 hrs/wk × $40/hr × 52/12 ≈ $6,933, rounded.",
    slides: [SLIDE_ROLE_OPS_MANAGER],
  },
  {
    id: "role.monthly.bookkeeper",
    category: "Role monthly profiles",
    label: "Bookkeeper · loaded monthly",
    defaultValue: 1700,
    unit: "$/mo",
    context: "10 hrs/wk × $40/hr × 52/12 ≈ $1,733, rounded.",
    slides: [SLIDE_ROLE_BOOKKEEPER],
  },
  {
    id: "role.monthly.foodHandler",
    category: "Role monthly profiles",
    label: "Food Handler · loaded monthly",
    defaultValue: 5000,
    unit: "$/mo",
    context: "Loaded full-time embedded at the Deer Lake store.",
    slides: [SLIDE_ROLE_FOOD_HANDLER],
  },
  {
    id: "role.monthly.housecleaner",
    category: "Role monthly profiles",
    label: "Housecleaner · loaded monthly",
    defaultValue: 500,
    unit: "$/mo",
    context: "4 hrs/wk × $30/hr × 52/12 ≈ $520, rounded.",
    slides: [SLIDE_ROLE_HOUSECLEANER],
  },
  {
    id: "role.monthly.tutor",
    category: "Role monthly profiles",
    label: "Tutor · loaded monthly (annualised)",
    defaultValue: 900,
    unit: "$/mo",
    context: "Winter-weighted hours, levelled to a flat monthly.",
    slides: [SLIDE_ROLE_TUTOR],
  },
  {
    id: "role.monthly.handyman",
    category: "Role monthly profiles",
    label: "Handyman · loaded monthly (if engaged)",
    defaultValue: 700,
    unit: "$/mo",
    context: "5 hrs/wk × $30/hr × 52/12 ≈ $650, rounded up.",
    slides: [SLIDE_ROLE_HANDYMAN],
  },

  {
    id: "rate.benchSeat",
    category: "Hourly rates",
    label: "Salt depot bench hourly (all seats)",
    defaultValue: 30,
    unit: "$/hr",
    context: "Base rate for the four casual / contracted T4A seats.",
    slides: [SLIDE_SALT_BENCH],
  },

  // -------- Salt economics ------------------------------------------
  {
    id: "salt.bench.directPicking",
    category: "Salt economics",
    label: "Bench · Direct picking & packing",
    defaultValue: 6360,
    unit: "$/yr",
    context: "12 batches × 16 hrs × $30 + 4% allowance.",
    slides: [SLIDE_SALT_BENCH],
  },
  {
    id: "salt.bench.overflow",
    category: "Salt economics",
    label: "Bench · Channel-allocated overflow",
    defaultValue: 4140,
    unit: "$/yr",
    context: "Q4 holiday surge + custom-label runs past 16 hrs.",
    slides: [SLIDE_SALT_BENCH],
  },
  {
    id: "salt.bench.standby",
    category: "Salt economics",
    label: "Bench · Standby + cancellation pay",
    defaultValue: 1200,
    unit: "$/yr",
    context: "1 standby shift / quarter × 4 hrs × $30.",
    slides: [SLIDE_SALT_BENCH],
  },
  {
    id: "salt.bench.training",
    category: "Salt economics",
    label: "Bench · Quarterly refresher training",
    defaultValue: 1600,
    unit: "$/yr",
    context: "SOP + food-safe + batch dry-run with OM.",
    slides: [SLIDE_SALT_BENCH],
  },
  {
    id: "salt.bench.replacement",
    category: "Salt economics",
    label: "Bench · Replacement screening",
    defaultValue: 800,
    unit: "$/yr",
    context: "~1 seat replaced / yr · paid trial + ref calls.",
    slides: [SLIDE_SALT_BENCH],
  },
  {
    id: "salt.bench.mileage",
    category: "Salt economics",
    label: "Bench · Mileage pool + WSIB premium",
    defaultValue: 900,
    unit: "$/yr",
    context: "Sioux Lookout / Eagle River drives + Rate Group 957.",
    slides: [SLIDE_SALT_BENCH],
  },
  {
    id: "salt.depotAlloc",
    category: "Salt economics",
    label: "Depot rent allocation (annual)",
    defaultValue: 3600,
    unit: "$/yr",
    context: "~10% of $3,000/mo facility line, annualised. Hits the salt P&L.",
    slides: [SLIDE_SALT_PL],
  },
  {
    id: "salt.channel.wholesale",
    category: "Salt economics",
    label: "Salt · Wholesale revenue (annual)",
    defaultValue: 72000,
    unit: "$/yr",
    context: "12 retail accounts. Anchor of the line — volume + low pick cost.",
    slides: [SLIDE_SALT_PL],
  },
  {
    id: "salt.channel.customLabel",
    category: "Salt economics",
    label: "Salt · Custom labels revenue",
    defaultValue: 20000,
    unit: "$/yr",
    context: "~6 events/yr. Premium pricing, paid up front, deposit clears before run.",
    slides: [SLIDE_SALT_PL],
  },
  {
    id: "salt.channel.dtc",
    category: "Salt economics",
    label: "Salt · DTC batch revenue",
    defaultValue: 14000,
    unit: "$/yr",
    context: "~80 orders/mo. Highest pick/pack & freight per unit.",
    slides: [SLIDE_SALT_PL],
  },
  {
    id: "salt.channel.markets",
    category: "Salt economics",
    label: "Salt · Markets revenue",
    defaultValue: 2000,
    unit: "$/yr",
    context: "PR / cost-recovery — counted as marketing spend, not contribution.",
    slides: [SLIDE_SALT_PL],
  },

  // -------- Cross-reserve install (Layer Three premium revenue) -----
  // The practitioner is the touring discipline-keeper. Receiving reserves
  // pay a premium day rate to install Codetry plus an annual retainer
  // while the practitioner remains the discipline owner there. Travel,
  // lodging, and food are passed through to the receiving reserve at
  // cost and are deliberately NOT modelled here — they are not part of
  // the fee.
  {
    id: "crossReserve.dayRate.onsite",
    category: "Cross-reserve install",
    label: "On-site install day rate",
    defaultValue: 3500,
    unit: "$/day",
    context:
      "Premium-but-defensible vs. senior management consultant rates. Charged for every day the practitioner is on the receiving reserve installing the discipline. Travel/lodging/food are pass-through, not in this rate.",
    slides: [SLIDE_PATH],
  },
  {
    id: "crossReserve.dayRate.remote",
    category: "Cross-reserve install",
    label: "Remote prep + follow-up day rate",
    defaultValue: 1800,
    unit: "$/day",
    context:
      "Pre-install scoping, curriculum adaptation, post-install discipline check-ins done from home. Lower than the on-site rate because the practitioner isn't away from Deer Lake.",
    slides: [SLIDE_PATH],
  },
  {
    id: "crossReserve.retainer.annual",
    category: "Cross-reserve install",
    label: "Discipline-keeper retainer per active reserve",
    defaultValue: 30000,
    unit: "$/yr",
    context:
      "Recurring while the practitioner remains the discipline owner at that reserve (post-install). Covers monthly check-ins, escalations, and the discipline audit. Drops off when the receiving reserve takes ownership.",
    slides: [SLIDE_PATH],
  },
  {
    id: "crossReserve.installRevenue.perReserve",
    category: "Cross-reserve install",
    label: "Typical 12-week install revenue per reserve",
    defaultValue: 148200,
    unit: "$/yr",
    context:
      "Derived: 30 on-site days × $3,500 + 24 remote days × $1,800 = $148,200. Slide rounds to ~$148.5k as a planning number. Plus travel pass-through (not counted) and the $30k/yr retainer kicking in afterwards. Edit the on-site / remote / retainer day rates above to move this.",
    slides: [SLIDE_PATH],
    derived: true,
  },

  // -------- Path to scale (derived) ---------------------------------
  // V3 framing: Year 2 / Year 3 are NOT "more Deer-Lake-shaped
  // contracts" stacked on top of each other. The shape is *one*
  // Deer Lake contract that holds steady, with cross-reserve install
  // revenue (premium day-rate installs at reserves #2/#3) and
  // recurring discipline-keeper retainers stacking on top. The
  // headline totals below are the literal sum of those components,
  // so a CFO can trace every dollar:
  //   Y1 = askReco × 12                                  ≈ $1.08M
  //   Y2 = askReco × 12 + crossReserve.year2.revenue     ≈ $1.44M
  //   Y3 = askReco × 12 + crossReserve.year3.revenue     ≈ $1.50M
  // Edit ask.recommended, the cross-reserve day rates, or the
  // discipline-keeper retainer to move these — the live derivation in
  // budgetMath.ts (`getLiveCostValue`) recomputes from those inputs.
  {
    id: "pathToScale.year1",
    category: "Path to scale",
    label: "Year 1 — Deer Lake pilot annualised",
    defaultValue: 1080000,
    unit: "$/yr",
    context:
      "1 contract @ recommended monthly × 12 = $1,080,000. No cross-reserve install revenue in Y1 — practitioner is still bedding in Deer Lake. Edit ask.recommended to move this.",
    slides: [SLIDE_PATH],
    derived: true,
  },
  {
    id: "pathToScale.year2",
    category: "Path to scale",
    label: "Year 2 — Deer Lake + 2 cross-reserve installs",
    defaultValue: 1436400,
    unit: "$/yr",
    context:
      "Composition: $1,080,000 Deer Lake (askReco × 12) + $356,400 cross-reserve (2 installs × $148,200 + 2 first-year retainers × $30,000) = $1,436,400. The practitioner is the trainer, not a Deer Lake grad. Edit ask.recommended, the cross-reserve day rates, or the retainer to move this.",
    slides: [SLIDE_PATH],
    derived: true,
  },
  {
    id: "pathToScale.year3",
    category: "Path to scale",
    label: "Year 3 — Deer Lake + compounding cross-reserve installs",
    defaultValue: 1496400,
    unit: "$/yr",
    context:
      "Composition: $1,080,000 Deer Lake (askReco × 12) + $416,400 cross-reserve (2 new installs × $148,200 + 4 active retainers × $30,000) = $1,496,400. Retainer income compounds as more reserves go live. The agency is the deliverable; the touring practitioner is the spine of it.",
    slides: [SLIDE_PATH],
    derived: true,
  },
  {
    id: "crossReserve.year2.revenue",
    category: "Path to scale",
    label: "Year 2 — cross-reserve install revenue (component of Y2)",
    defaultValue: 356400,
    unit: "$/yr",
    context:
      "Derived: 2 new reserve installs × $148,200 + 2 first-year retainers × $30,000 = $356,400. Stacks on top of the $1.08M Deer Lake contract to make the $1,436,400 Year-2 headline. Edit the cross-reserve day rates or the retainer to move this.",
    slides: [SLIDE_PATH],
    derived: true,
  },
  {
    id: "crossReserve.year3.revenue",
    category: "Path to scale",
    label: "Year 3 — cross-reserve install revenue (component of Y3)",
    defaultValue: 416400,
    unit: "$/yr",
    context:
      "Derived: 2 new reserve installs × $148,200 + 4 active retainers × $30,000 = $416,400. Retainer income compounds as more reserves go live. Stacks on top of the $1.08M Deer Lake contract to make the $1,496,400 Year-3 headline.",
    slides: [SLIDE_PATH],
    derived: true,
  },

  // -------- Floor scenario (A) --------------------------------------
  {
    id: "budget.a.practitioner",
    category: "Floor scenario (A · $60k)",
    label: "A · Practitioner / Lead",
    defaultValue: 13000,
    unit: "$/mo",
    context:
      "Floor scenario take. Drops $1k from the prior figure to fund the Ops Manager / IT-Tech parity bump (OM $8.5k → $9.5k). Cost basis at the floor is unchanged; the swap stays inside the practitioner's own line.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.a.opsManager",
    category: "Floor scenario (A · $60k)",
    label: "A · Operations Manager",
    defaultValue: 9500,
    unit: "$/mo",
    context:
      "Parity-bumped at the floor to match IT/Tech ($9.5k). Funded by the practitioner's own $1k drop in this scenario, so the Scenario A cost basis is unchanged.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.a.itTech",
    category: "Floor scenario (A · $60k)",
    label: "A · IT/Tech",
    defaultValue: 9500,
    unit: "$/mo",
    context: "Same IT/Tech at the floor.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.a.bookkeeper",
    category: "Floor scenario (A · $60k)",
    label: "A · Bookkeeper / Admin",
    defaultValue: 2500,
    unit: "$/mo",
    context: "Same bookkeeper at the floor.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.a.foodHandler",
    category: "Floor scenario (A · $60k)",
    label: "A · Food Handler",
    defaultValue: 5000,
    unit: "$/mo",
    context: "Same Food Handler embedded at the store.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.a.lifeSupports",
    category: "Floor scenario (A · $60k)",
    label: "A · Life supports",
    defaultValue: 2100,
    unit: "$/mo",
    context: "Same household supports.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.a.aggregationHub",
    category: "Floor scenario (A · $60k)",
    label: "A · Aggregation hub",
    defaultValue: 3000,
    unit: "$/mo",
    context: "Same Dad-warehouse line.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.a.tooling",
    category: "Floor scenario (A · $60k)",
    label: "A · Tooling, SaaS, insurance",
    defaultValue: 1800,
    unit: "$/mo",
    context: "Lighter SaaS stack at the floor.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.a.recurringTech",
    category: "Floor scenario (A · $60k)",
    label: "A · Recurring tech ops",
    defaultValue: 1800,
    unit: "$/mo",
    context: "Smaller cloud + phone footprint at the floor.",
    slides: [SLIDE_BUDGET],
  },

  // -------- Scale scenario (C) --------------------------------------
  {
    id: "budget.c.practitioner",
    category: "Scale scenario (C · $125k)",
    label: "C · Practitioner / Lead",
    defaultValue: 20000,
    unit: "$/mo",
    context: "Scale-scenario take with three concurrent contracts.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.c.opsManager",
    category: "Scale scenario (C · $125k)",
    label: "C · Operations Manager",
    defaultValue: 10000,
    unit: "$/mo",
    context:
      "OM at scale, parity-bumped to match IT/Tech ($10k). The +$1k vs. the prior figure is absorbed by existing reinvestment margin in this scenario.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.c.itTech",
    category: "Scale scenario (C · $125k)",
    label: "C · IT/Tech",
    defaultValue: 10000,
    unit: "$/mo",
    context: "IT/Tech bumps for the larger fleet.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.c.bookkeeper",
    category: "Scale scenario (C · $125k)",
    label: "C · Bookkeeper / Admin",
    defaultValue: 3000,
    unit: "$/mo",
    context: "More hours at scale.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.c.foodHandler",
    category: "Scale scenario (C · $125k)",
    label: "C · Food Handler",
    defaultValue: 5000,
    unit: "$/mo",
    context: "Same Food Handler at scale.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.c.cdAssociate",
    category: "Scale scenario (C · $125k)",
    label: "C · Community Dev. Associate",
    defaultValue: 8500,
    unit: "$/mo",
    context: "More CDA capacity at scale.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.c.juniorAnalyst",
    category: "Scale scenario (C · $125k)",
    label: "C · Junior Analyst / Field",
    defaultValue: 6500,
    unit: "$/mo",
    context: "Same junior analyst.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.c.seniorEngineer",
    category: "Scale scenario (C · $125k)",
    label: "C · Senior Engineer #2",
    defaultValue: 10000,
    unit: "$/mo",
    context: "Resilience for the server fleet.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.c.regionalOutreach",
    category: "Scale scenario (C · $125k)",
    label: "C · Regional Outreach Lead",
    defaultValue: 9000,
    unit: "$/mo",
    context: "Pilot #2 sourcing.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.c.trainer",
    category: "Scale scenario (C · $125k)",
    label: "C · Trainer / Adoption Lead",
    defaultValue: 7500,
    unit: "$/mo",
    context: "Council + community training at scale.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.c.lifeSupports",
    category: "Scale scenario (C · $125k)",
    label: "C · Life supports",
    defaultValue: 2100,
    unit: "$/mo",
    context: "Same household supports.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.c.aggregationHub",
    category: "Scale scenario (C · $125k)",
    label: "C · Aggregation hub",
    defaultValue: 3000,
    unit: "$/mo",
    context: "Same Dad-warehouse line at scale.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.c.tooling",
    category: "Scale scenario (C · $125k)",
    label: "C · Tooling, SaaS, insurance",
    defaultValue: 3000,
    unit: "$/mo",
    context: "Bigger SaaS stack at scale.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.c.recurringTech",
    category: "Scale scenario (C · $125k)",
    label: "C · Recurring tech ops",
    defaultValue: 2500,
    unit: "$/mo",
    context: "Larger cloud + phone footprint at scale.",
    slides: [SLIDE_BUDGET],
  },

  // -------- People & Retention buckets — A · floor ------------------
  {
    id: "people.a.costOfLiving",
    category: "People & Retention — A · floor",
    label: "A · 02 Cost-of-living offset",
    defaultValue: 2800,
    unit: "$/mo",
    context:
      "Floor-scenario monthly employer cost for crew-wide cost-of-living supports — grocery share, fuel, winter heat, phone. Sized to roll up with buckets 03–06 to ~15% of base payroll.",
    slides: [SLIDE_PEOPLE_SIZING],
  },
  {
    id: "people.a.resilience",
    category: "People & Retention — A · floor",
    label: "A · 03 Resilience",
    defaultValue: 1300,
    unit: "$/mo",
    context:
      "HSA, sick bank, family leave, mental-health stipend at the floor. The line that keeps a bad month from becoming a resignation.",
    slides: [SLIDE_PEOPLE_SIZING],
  },
  {
    id: "people.a.retention",
    category: "People & Retention — A · floor",
    label: "A · 04 Retention milestones",
    defaultValue: 900,
    unit: "$/mo",
    context:
      "RRSP step-up, anniversary cash, sabbatical, equipment transfer accruals at the floor.",
    slides: [SLIDE_PEOPLE_SIZING],
  },
  {
    id: "people.a.appreciation",
    category: "People & Retention — A · floor",
    label: "A · 05 Appreciation",
    defaultValue: 600,
    unit: "$/mo",
    context:
      "Crew meal, gear allowance, paid birthday, spot bonuses at the floor.",
    slides: [SLIDE_PEOPLE_SIZING],
  },
  {
    id: "people.a.growth",
    category: "People & Retention — A · floor",
    label: "A · 06 Growth",
    defaultValue: 300,
    unit: "$/mo",
    context:
      "Tuition / certs and paid mentorship time at the floor. Smallest of the five buckets — the one that grows fastest as the crew matures.",
    slides: [SLIDE_PEOPLE_SIZING],
  },

  // -------- People & Retention buckets — B · recommended ------------
  {
    id: "people.b.costOfLiving",
    category: "People & Retention — B · recommended",
    label: "B · 02 Cost-of-living offset",
    defaultValue: 4200,
    unit: "$/mo",
    context:
      "Recommended-scenario monthly employer cost for crew-wide cost-of-living supports — grocery share, fuel, winter heat, phone.",
    slides: [SLIDE_PEOPLE_SIZING],
  },
  {
    id: "people.b.resilience",
    category: "People & Retention — B · recommended",
    label: "B · 03 Resilience",
    defaultValue: 1900,
    unit: "$/mo",
    context:
      "HSA, sick bank, family leave, mental-health stipend at the recommended team size.",
    slides: [SLIDE_PEOPLE_SIZING],
  },
  {
    id: "people.b.retention",
    category: "People & Retention — B · recommended",
    label: "B · 04 Retention milestones",
    defaultValue: 1300,
    unit: "$/mo",
    context:
      "RRSP step-up, anniversary cash, sabbatical, equipment transfer accruals for the recommended crew.",
    slides: [SLIDE_PEOPLE_SIZING],
  },
  {
    id: "people.b.appreciation",
    category: "People & Retention — B · recommended",
    label: "B · 05 Appreciation",
    defaultValue: 900,
    unit: "$/mo",
    context:
      "Crew meal, gear allowance, paid birthday, spot bonuses across the recommended crew.",
    slides: [SLIDE_PEOPLE_SIZING],
  },
  {
    id: "people.b.growth",
    category: "People & Retention — B · recommended",
    label: "B · 06 Growth",
    defaultValue: 500,
    unit: "$/mo",
    context:
      "Tuition / certs and paid mentorship time across the recommended crew.",
    slides: [SLIDE_PEOPLE_SIZING],
  },

  // -------- People & Retention buckets — C · scale ------------------
  {
    id: "people.c.costOfLiving",
    category: "People & Retention — C · scale",
    label: "C · 02 Cost-of-living offset",
    defaultValue: 6400,
    unit: "$/mo",
    context:
      "Scale-scenario monthly employer cost for crew-wide cost-of-living supports across the larger team.",
    slides: [SLIDE_PEOPLE_SIZING],
  },
  {
    id: "people.c.resilience",
    category: "People & Retention — C · scale",
    label: "C · 03 Resilience",
    defaultValue: 2900,
    unit: "$/mo",
    context:
      "HSA, sick bank, family leave, mental-health stipend at scale.",
    slides: [SLIDE_PEOPLE_SIZING],
  },
  {
    id: "people.c.retention",
    category: "People & Retention — C · scale",
    label: "C · 04 Retention milestones",
    defaultValue: 2000,
    unit: "$/mo",
    context:
      "RRSP step-up, anniversary cash, sabbatical, equipment transfer accruals across the scale crew.",
    slides: [SLIDE_PEOPLE_SIZING],
  },
  {
    id: "people.c.appreciation",
    category: "People & Retention — C · scale",
    label: "C · 05 Appreciation",
    defaultValue: 1400,
    unit: "$/mo",
    context:
      "Crew meal, gear allowance, paid birthday, spot bonuses across the scale crew.",
    slides: [SLIDE_PEOPLE_SIZING],
  },
  {
    id: "people.c.growth",
    category: "People & Retention — C · scale",
    label: "C · 06 Growth",
    defaultValue: 700,
    unit: "$/mo",
    context:
      "Tuition / certs and paid mentorship time across the scale crew.",
    slides: [SLIDE_PEOPLE_SIZING],
  },

];

export const COST_REGISTRY_BY_ID: Record<string, CostEntry> = Object.fromEntries(
  COST_REGISTRY.map((e) => [e.id, e]),
);

export function getCostEntry(id: string): CostEntry | undefined {
  return COST_REGISTRY_BY_ID[id];
}

// Format a value with its unit for display in the modal & summary view.
export function formatCostValue(value: number, unit: CostUnit): string {
  if (unit === "%") return `${value}%`;
  const formatted = "$" + Math.round(value).toLocaleString("en-US");
  if (unit === "$ one-time") return formatted;
  return `${formatted} ${unit.replace("$", "").trim()}`.replace(/\s+/g, " ");
}
