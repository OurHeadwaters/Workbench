// Cost registry — every dollar figure the founder must approve.
// Ordered by importance for the walkthrough.

// Cross-reserve install + travel-corridor planning defaults are owned
// by `@workspace/cross-reserve-defaults` so the Deer Lake "First reserve,
// then the next" slide and the registry entries below cannot drift
// apart. A single edit in that package flows through to both surfaces
// on the next build — see lib/cross-reserve-defaults/src/index.ts.
import { CROSS_RESERVE_DEFAULTS } from "@workspace/cross-reserve-defaults";

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

// with a 9-slide V3 deck (Prologue, Cover, SlabVsGrassland, TheSixPeople,
// ThreeRevenueLayers, YearOnePicture, SecondAnchorScenarios, PathToScale,
// Closing). The cost-review modal's "Where this appears" links route
// through these constants; every one points at a real V3 slide so the
// modal never strands a click.
//
// manifestFile is set on every constant so scripts/check-slide-refs.ts
// (`checkCostRegistrySlideRefs`) fails the build if any slide moves
// position in the manifest without these constants being updated to
// match.
//
// V3 home assignments:
//   • TheSixPeople (pos 4) — lean roster, locked role monthly numbers
//     → all role/team/budget/people-sizing references
//   • ThreeRevenueLayers (pos 5) — software/hardware/training mix,
//     salts P&L, 807 grant net cash, reinvestment math
//     → reinvestment + salt references
//   • YearOnePicture (pos 6) — honest Y1 revenue/cost picture, the
//     gap that justifies the rate, payback context
//     → cash flow / rate / payback-pitch references
//   • PathToScale (pos 8) — Y1/Y2/Y3 CFO-readable composition
//     → path-to-scale references
//   • Closing (pos 9) — the asking moment
//     → closing references
const SLIDE_BUDGET = slide(4, "Six-people roster", "src/pages/slides/TheSixPeople.tsx");
const SLIDE_CASHFLOW = slide(6, "Year One — cash picture", "src/pages/slides/YearOnePicture.tsx");
const SLIDE_PAYBACK_PITCH = slide(6, "Year One — cash picture", "src/pages/slides/YearOnePicture.tsx");
const SLIDE_REINVEST = slide(5, "Three revenue layers", "src/pages/slides/ThreeRevenueLayers.tsx");
const SLIDE_RATE = slide(6, "Year One — cash picture", "src/pages/slides/YearOnePicture.tsx");
const SLIDE_TEAM = slide(4, "Six-people roster", "src/pages/slides/TheSixPeople.tsx");
const SLIDE_CLOSING = slide(9, "Closing", "src/pages/slides/Closing.tsx");
const SLIDE_PATH = slide(8, "Path to scale", "src/pages/slides/PathToScale.tsx");
const SLIDE_SALT_BENCH = slide(5, "Three revenue layers", "src/pages/slides/ThreeRevenueLayers.tsx");
const SLIDE_SALT_PL = slide(5, "Three revenue layers", "src/pages/slides/ThreeRevenueLayers.tsx");
const SLIDE_ROLE_OPS_MANAGER = slide(4, "Six-people roster", "src/pages/slides/TheSixPeople.tsx");
const SLIDE_ROLE_BOOKKEEPER = slide(4, "Six-people roster", "src/pages/slides/TheSixPeople.tsx");
const SLIDE_ROLE_FOOD_HANDLER = slide(4, "Six-people roster", "src/pages/slides/TheSixPeople.tsx");
const SLIDE_ROLE_HOUSECLEANER = slide(4, "Six-people roster", "src/pages/slides/TheSixPeople.tsx");
const SLIDE_ROLE_TUTOR = slide(4, "Six-people roster", "src/pages/slides/TheSixPeople.tsx");
const SLIDE_ROLE_HANDYMAN = slide(4, "Six-people roster", "src/pages/slides/TheSixPeople.tsx");
const SLIDE_ROLE_IT_TECH = slide(4, "Six-people roster", "src/pages/slides/TheSixPeople.tsx");
const SLIDE_PEOPLE_SIZING = slide(4, "Six-people roster", "src/pages/slides/TheSixPeople.tsx");
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
    slides: [SLIDE_PAYBACK_PITCH],
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
    slides: [SLIDE_ROLE_OPS_MANAGER],
  },
  {
    id: "rate.bookkeeper",
    category: "Hourly rates",
    label: "Bookkeeper hourly",
    defaultValue: 40,
    unit: "$/hr",
    context: "Paid against fixed scope cap.",
    slides: [SLIDE_ROLE_BOOKKEEPER],
  },
  {
    id: "rate.itTechDayLow",
    category: "Hourly rates",
    label: "IT/Tech day rate (low end)",
    defaultValue: 600,
    unit: "$/day",
    context: "Trial day rate floor for the IT/Tech hire.",
    slides: [SLIDE_ROLE_IT_TECH],
  },
  {
    id: "rate.itTechDayHigh",
    category: "Hourly rates",
    label: "IT/Tech day rate (high end)",
    defaultValue: 900,
    unit: "$/day",
    context: "Trial day rate ceiling for senior IT/Tech.",
    slides: [SLIDE_ROLE_IT_TECH],
  },
  {
    id: "rate.tutor",
    category: "Hourly rates",
    label: "Tutor hourly",
    defaultValue: 35,
    unit: "$/hr",
    context: "Trial sessions paid regardless. Vulnerable Sector Check reimbursed on hire.",
    slides: [SLIDE_ROLE_TUTOR],
  },
  {
    id: "rate.housecleaner",
    category: "Hourly rates",
    label: "Housecleaner hourly",
    defaultValue: 30,
    unit: "$/hr",
    context: "Trial visits paid. No 'free first clean'.",
    slides: [SLIDE_ROLE_HOUSECLEANER],
  },
  {
    id: "rate.handyman",
    category: "Hourly rates",
    label: "Handyman hourly",
    defaultValue: 30,
    unit: "$/hr",
    context: "Trial weeks paid regardless of outcome.",
    slides: [SLIDE_ROLE_HANDYMAN],
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
  // cost and are deliberately NOT modelled in the fee revenue lines —
  // see the three `crossReserve.travelPassthrough.*` rolled-up examples
  // below (drive-in ≈ $11k, fly-in scheduled ≈ $22.5k, winter-road /
  // charter-heavy ≈ $43k for a typical 12-week install — pick the one
  // that matches the receiving reserve's access pattern) and the
  // `crossReserve.travel.*` entries further down for the per-component
  // assumptions behind the fly-in case a receiving band council can
  // budget against.
  {
    id: "crossReserve.dayRate.onsite",
    category: "Cross-reserve install",
    label: "On-site install day rate",
    defaultValue: CROSS_RESERVE_DEFAULTS.dayRate.onsite,
    unit: "$/day",
    context:
      "Premium-but-defensible vs. senior management consultant rates. Charged for every day the practitioner is on the receiving reserve installing the discipline. Travel/lodging/food are pass-through (pick the matching `crossReserve.travelPassthrough.*` example — ≈$11k drive-in, ≈$22.5k fly-in scheduled, ≈$43k winter-road / charter-heavy for a typical 12-week install), not in this rate.",
    slides: [SLIDE_PATH],
  },
  {
    id: "crossReserve.dayRate.remote",
    category: "Cross-reserve install",
    label: "Remote prep + follow-up day rate",
    defaultValue: CROSS_RESERVE_DEFAULTS.dayRate.remote,
    unit: "$/day",
    context:
      "Pre-install scoping, curriculum adaptation, post-install discipline check-ins done from home. Lower than the on-site rate because the practitioner isn't away from Deer Lake.",
    slides: [SLIDE_PATH],
  },
  {
    id: "crossReserve.retainer.annual",
    category: "Cross-reserve install",
    label: "Discipline-keeper retainer per active reserve",
    defaultValue: CROSS_RESERVE_DEFAULTS.retainerAnnual,
    unit: "$/yr",
    context:
      "Recurring while the practitioner remains the discipline owner at that reserve (post-install). Covers monthly check-ins, escalations, and the discipline audit. Drops off when the receiving reserve takes ownership.",
    slides: [SLIDE_PATH],
  },
  {
    id: "crossReserve.installRevenue.perReserve",
    category: "Cross-reserve install",
    label: "Typical 12-week install revenue per reserve",
    defaultValue: CROSS_RESERVE_DEFAULTS.installRevenuePerReserve,
    unit: "$/yr",
    context: `Derived: ${CROSS_RESERVE_DEFAULTS.typicalInstall.onsiteDays} on-site days × $${CROSS_RESERVE_DEFAULTS.dayRate.onsite.toLocaleString("en-CA")} + ${CROSS_RESERVE_DEFAULTS.typicalInstall.remoteDays} remote days × $${CROSS_RESERVE_DEFAULTS.dayRate.remote.toLocaleString("en-CA")} = $${CROSS_RESERVE_DEFAULTS.installRevenuePerReserve.toLocaleString("en-CA")}. Slide rounds to ~$148.5k as a planning number. Plus travel pass-through billed at cost on top of this fee — pick the example that matches the receiving reserve's access pattern (≈$11k drive-in via \`crossReserve.travelPassthrough.driveIn\`, ≈$22.5k fly-in scheduled via \`crossReserve.travelPassthrough.example\`, ≈$43k winter-road / charter-heavy via \`crossReserve.travelPassthrough.winterRoad\`) — and the $${(CROSS_RESERVE_DEFAULTS.retainerAnnual / 1000).toLocaleString("en-CA")}k/yr retainer kicking in afterwards. Edit the on-site / remote / retainer day rates above (sourced from \`@workspace/cross-reserve-defaults\`) to move this.`,
    slides: [SLIDE_PATH],
    derived: true,
  },
  {
    id: "crossReserve.travelPassthrough.driveIn",
    category: "Cross-reserve install",
    label: "Travel pass-through · drive-in / all-weather-road reserve (12-week install)",
    defaultValue: 11100,
    unit: "$ one-time",
    context:
      "Planning number for a receiving reserve on the all-weather road network (e.g. Eagle Lake, Wabigoon, Couchiching — the practitioner drives themselves from the southern hub). Derived: 12 weekly round-trip drives × $400 (≈600 km RT × CRA-style $0.67/km vehicle allowance) = $4,800 + 30 on-site nights × $150 (regional motel / contractor Airbnb, NOT northern guesthouse rates) = $4,500 + 30 on-site days × $60 (regional grocery, NOT Northern Store mark-up) = $1,800, totalling $11,100. Materially lower than the fly-in case because there's no scheduled-airline ticket and southern food / lodging supply is competitive. Pick this when the receiving reserve sits on the all-weather road. Billed at cost to the receiving reserve on top of the day-rate fee — explicitly NOT included in `crossReserve.installRevenue.perReserve`, `crossReserve.year2.revenue`, or `crossReserve.year3.revenue`, so there is no double-counting in the headline.",
    slides: [SLIDE_PATH],
    derived: true,
  },
  {
    id: "crossReserve.travelPassthrough.example",
    category: "Cross-reserve install",
    label: "Travel pass-through · fly-in scheduled (Wasaya/Bearskin) reserve (12-week install)",
    defaultValue: 22500,
    unit: "$ one-time",
    context:
      "Planning number for a receiving reserve served by scheduled NAN-territory airlines (Wasaya / Bearskin from Dryden / Sioux Lookout / Thunder Bay) with a band-run guesthouse and northern per-diem food. The middle-of-the-road case and the one wired to the editable per-component lines below so a receiving band council can replace the planning estimates with their own corridor's actual numbers. Derived from those components: 12 weekly round-trip flights × $1,000 (`crossReserve.travel.flightPerWeek`) = $12,000 + 30 on-site nights × $250 (`crossReserve.travel.lodgingPerNight` — northern guesthouse / band-house) = $7,500 + 30 on-site days × $100 (`crossReserve.travel.foodPerOnsiteDay` — Northern Store food costs) = $3,000, totalling $22,500. Reconciles with `crossReserve.travel.totalPerInstall` and the pass-through line in `crossReserve.year1.stickerPrice`. Billed at cost to the receiving reserve on top of the day-rate fee — explicitly NOT included in `crossReserve.installRevenue.perReserve`, `crossReserve.year2.revenue`, or `crossReserve.year3.revenue`, so there is no double-counting in the headline.",
    slides: [SLIDE_PATH],
    derived: true,
  },
  {
    id: "crossReserve.travelPassthrough.winterRoad",
    category: "Cross-reserve install",
    label: "Travel pass-through · winter-road / charter-heavy reserve (12-week install)",
    defaultValue: 42900,
    unit: "$ one-time",
    context:
      "Planning number for a receiving reserve with no year-round scheduled air service — accessible only by winter road (Jan–Mar) plus charter the rest of the year (e.g. Pikangikum, Webequie, Wapekeka outside winter-road season). Derived: 12 install weeks × $2,500 average transport (mix of ~6 charter rotations at ~$4,500/leg + winter-road truck weeks at ~$300 fuel/wear) = $30,000 + 30 on-site nights × $300 (premium contractor camp / band-house at deeper-north pricing) = $9,000 + 30 on-site days × $130 (deeper-north Northern Store mark-up) = $3,900, totalling $42,900. Materially higher than the scheduled fly-in case because charter capacity, not ticket price, sets the corridor cost. Pick this when the receiving reserve has no scheduled air service. Billed at cost to the receiving reserve on top of the day-rate fee — explicitly NOT included in `crossReserve.installRevenue.perReserve`, `crossReserve.year2.revenue`, or `crossReserve.year3.revenue`, so there is no double-counting in the headline.",
    slides: [SLIDE_PATH],
    derived: true,
  },

  // -------- Cross-reserve travel pass-through (receiving-reserve view) ----
  // Pass-through, billed at cost — NOT part of the practitioner's fee.
  // These are Deer-Lake-corridor planning estimates a chief at a candidate
  // reserve #2 reading the deck cold can replace with their own corridor's
  // numbers. They feed the receiving-reserve Y1 sticker-price panel on the
  // "First reserve, then the next" slide.
  {
    id: "crossReserve.travel.flightPerWeek",
    category: "Cross-reserve install",
    label: "Travel pass-through · round-trip flight (per install week)",
    defaultValue: CROSS_RESERVE_DEFAULTS.travel.flightPerWeek,
    unit: "$ one-time",
    context:
      "Bearskin / Wasaya round-trip from a southern hub (Dryden / Sioux Lookout) to a fly-in reserve. Planning estimate — receiving reserve replaces with their own corridor's actual cost. Assumed one return flight per install week (12 weeks).",
    slides: [SLIDE_PATH],
  },
  {
    id: "crossReserve.travel.lodgingPerNight",
    category: "Cross-reserve install",
    label: "Travel pass-through · lodging per on-site night",
    defaultValue: CROSS_RESERVE_DEFAULTS.travel.lodgingPerNight,
    unit: "$/day",
    context:
      "Northern guesthouse / band-house / contractor-camp nightly rate, planning estimate. Charged per on-site night (~30 nights for a 12-week install).",
    slides: [SLIDE_PATH],
  },
  {
    id: "crossReserve.travel.foodPerOnsiteDay",
    category: "Cross-reserve install",
    label: "Travel pass-through · food per on-site day",
    defaultValue: CROSS_RESERVE_DEFAULTS.travel.foodPerOnsiteDay,
    unit: "$/day",
    context:
      "Northern food costs per on-site day. Planning estimate — receiving reserve replaces with their own actuals (Northern Store / band-store pricing varies).",
    slides: [SLIDE_PATH],
  },
  {
    id: "crossReserve.travel.totalPerInstall",
    category: "Cross-reserve install",
    label: "Travel pass-through · total per 12-week install",
    defaultValue: 22500,
    unit: "$ one-time",
    context:
      "Derived: 12 weekly flights × $1,000 + 30 on-site nights × $250 + 30 on-site days × $100 = $22,500. Pass-through to the receiving reserve at cost; NOT in the practitioner's fee. Planning estimate — replace with the receiving reserve's corridor numbers.",
    slides: [SLIDE_PATH],
    derived: true,
  },
  {
    id: "crossReserve.year1.stickerPrice",
    category: "Cross-reserve install",
    label: "Receiving reserve · Y1 all-in sticker price (planning estimate)",
    defaultValue: 201000,
    unit: "$/yr",
    context:
      "Derived: install fee (~$148,500) + travel pass-through (~$22,500) + first-year retainer ($30,000) ≈ $201,000. The headline number a chief at reserve #2 sees when reading the deck cold — the symmetry to Deer Lake's $420k/yr. Planning estimate; pass-through replaced by the receiving reserve's own corridor costs.",
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
      "Derived: 2 new reserve installs × $148,200 + 2 first-year retainers × $30,000 = $356,400. Stacks on top of the $1.08M Deer Lake contract to make the $1,436,400 Year-2 headline. Travel pass-through (≈$11k drive-in / ≈$22.5k fly-in scheduled / ≈$43k winter-road or charter-heavy per install — see the three `crossReserve.travelPassthrough.*` examples) is reimbursed at cost by each receiving reserve and is deliberately NOT in this number — folding any of the three lookups in would be double-counting fee income. Edit the cross-reserve day rates or the retainer to move this.",
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
      "Derived: 2 new reserve installs × $148,200 + 4 active retainers × $30,000 = $416,400. Retainer income compounds as more reserves go live. Stacks on top of the $1.08M Deer Lake contract to make the $1,496,400 Year-3 headline. Travel pass-through (≈$11k drive-in / ≈$22.5k fly-in scheduled / ≈$43k winter-road or charter-heavy per new install — see the three `crossReserve.travelPassthrough.*` examples) is reimbursed at cost by each receiving reserve and is deliberately NOT in this number; only the 2 new installs incur it in Y3 (the 2 prior reserves are in retainer mode).",
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
