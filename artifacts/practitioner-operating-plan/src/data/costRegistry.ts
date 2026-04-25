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
};

export type CostCategory =
  | "Headline ask"
  | "Headline totals"
  | "Recommended-scenario roles"
  | "Recommended-scenario overheads"
  | "Floor scenario (A · $60k)"
  | "Scale scenario (C · $125k)"
  | "Day-one bridge & CAPEX"
  | "Reinvestment math"
  | "Headwaters payback"
  | "Hourly rates"
  | "Role monthly profiles"
  | "Salt economics"
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

const slide = (position: number, label: string): CostSlide => ({
  href: `/slide${position}`,
  label,
});

// Slide positions match src/data/slides-manifest.json.
const SLIDE_BUDGET = slide(23, "Budget");
const SLIDE_CASHFLOW = slide(24, "Cash flow");
const SLIDE_PAYBACK_PITCH = slide(25, "Payback pitch");
const SLIDE_REINVEST = slide(26, "Reinvestment");
const SLIDE_RATE = slide(34, "Case for rate");
const SLIDE_TEAM = slide(35, "Case for team");
const SLIDE_CLOSING = slide(37, "Closing — naming the deal");
const SLIDE_PATH = slide(42, "Path to scale");
const SLIDE_SALT_BENCH = slide(49, "Salt bench");
const SLIDE_SALT_PL = slide(50, "Salt P&L");
const SLIDE_ROLE_OPS_MANAGER = slide(9, "Role — Ops Manager");
const SLIDE_ROLE_BOOKKEEPER = slide(10, "Role — Bookkeeper");
const SLIDE_ROLE_FOOD_HANDLER = slide(11, "Role — Food Handler");
const SLIDE_ROLE_HOUSECLEANER = slide(12, "Role — Housecleaner");
const SLIDE_ROLE_TUTOR = slide(13, "Role — Tutor");
const SLIDE_ROLE_HANDYMAN = slide(14, "Role — Handyman");
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
    defaultValue: 8500,
    unit: "$/mo",
    context:
      "Dryden, on-site. ~40 hrs/wk @ $40/hr loaded. The phone-holder.",
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
    defaultValue: 181000,
    unit: "$ one-time",
    context:
      "Two months of cost basis + day-one tech CAPEX. Computed live as costBasisB × 2 + capexB. Edit the underlying role lines or capex.b to move this number.",
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
    slides: [slide(25, "Platform bill — payback")],
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
    slides: [slide(16, "Hiring — OM"), SLIDE_ROLE_OPS_MANAGER],
  },
  {
    id: "rate.bookkeeper",
    category: "Hourly rates",
    label: "Bookkeeper hourly",
    defaultValue: 40,
    unit: "$/hr",
    context: "Paid against fixed scope cap.",
    slides: [slide(17, "Hiring — Bookkeeper"), SLIDE_ROLE_BOOKKEEPER],
  },
  {
    id: "rate.itTechDayLow",
    category: "Hourly rates",
    label: "IT/Tech day rate (low end)",
    defaultValue: 600,
    unit: "$/day",
    context: "Trial day rate floor for the IT/Tech hire.",
    slides: [slide(18, "Hiring — IT/Tech")],
  },
  {
    id: "rate.itTechDayHigh",
    category: "Hourly rates",
    label: "IT/Tech day rate (high end)",
    defaultValue: 900,
    unit: "$/day",
    context: "Trial day rate ceiling for senior IT/Tech.",
    slides: [slide(18, "Hiring — IT/Tech")],
  },
  {
    id: "rate.tutor",
    category: "Hourly rates",
    label: "Tutor hourly",
    defaultValue: 35,
    unit: "$/hr",
    context: "Trial sessions paid regardless. Vulnerable Sector Check reimbursed on hire.",
    slides: [slide(21, "Hiring — Tutor"), SLIDE_ROLE_TUTOR],
  },
  {
    id: "rate.housecleaner",
    category: "Hourly rates",
    label: "Housecleaner hourly",
    defaultValue: 30,
    unit: "$/hr",
    context: "Trial visits paid. No 'free first clean'.",
    slides: [slide(20, "Hiring — Housecleaner"), SLIDE_ROLE_HOUSECLEANER],
  },
  {
    id: "rate.handyman",
    category: "Hourly rates",
    label: "Handyman hourly",
    defaultValue: 30,
    unit: "$/hr",
    context: "Trial weeks paid regardless of outcome.",
    slides: [slide(22, "Hiring — Handyman"), SLIDE_ROLE_HANDYMAN],
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

  // -------- Path to scale (derived from ask.recommended × 12 × N) ---
  {
    id: "pathToScale.year1",
    category: "Path to scale",
    label: "Year 1 — Deer Lake pilot annualised",
    defaultValue: 1080000,
    unit: "$/yr",
    context:
      "1 contract @ recommended monthly × 12. Edit ask.recommended to move this.",
    slides: [SLIDE_PATH],
    derived: true,
  },
  {
    id: "pathToScale.year2",
    category: "Path to scale",
    label: "Year 2 — two concurrent contracts annualised",
    defaultValue: 2160000,
    unit: "$/yr",
    context:
      "Recommended monthly × 12 × 2. Marginal cost of pilot #2 is mostly the practitioner's time.",
    slides: [SLIDE_PATH],
    derived: true,
  },
  {
    id: "pathToScale.year3",
    category: "Path to scale",
    label: "Year 3 — up to 5 concurrent contracts annualised",
    defaultValue: 5400000,
    unit: "$/yr",
    context: "Recommended monthly × 12 × 5. The agency is the deliverable.",
    slides: [SLIDE_PATH],
    derived: true,
  },

  // -------- Floor scenario (A) --------------------------------------
  {
    id: "budget.a.practitioner",
    category: "Floor scenario (A · $60k)",
    label: "A · Practitioner / Lead",
    defaultValue: 14000,
    unit: "$/mo",
    context: "Floor scenario take.",
    slides: [SLIDE_BUDGET],
  },
  {
    id: "budget.a.opsManager",
    category: "Floor scenario (A · $60k)",
    label: "A · Operations Manager",
    defaultValue: 8500,
    unit: "$/mo",
    context: "Same OM at the floor.",
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
    defaultValue: 9000,
    unit: "$/mo",
    context: "OM bumps slightly at scale.",
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
