import { confirmed, provisional } from "./tags";
import type {
  BrightsideScenario,
  OverheadRow,
  SaltsScenario,
} from "./types";

/**
 * Shared, scenario-neutral data.
 *
 * Salts (Parr's Jars), Brightside, and the agency overhead footprint are
 * identical across every scenario the guide carries — they describe the
 * world, not the engagement shape. This module is the single source of
 * truth those scenarios import from.
 *
 * Reservation purposes and the giving direction are also shared: they describe
 * how surplus is deployed, which doesn't change between scenarios.
 *
 * Historical note: these constants used to live in `v2.ts` while V2 was a
 * live scenario. V2 was retired on 2026-04-26 in favour of V3 (lean team).
 * The 807 CDP grant block was retired from the guide on 2026-04-28 to
 * keep planning surfaces focused on the live agency engagement and the
 * Northern Band roster — the 807 grant is no longer carried as a planning
 * line in the guide.
 *
 * ── Reality-check status (as of 2026-05-11) ──────────────────────────────
 * CONFIRMED ACTUALS (locked against real records):
 *   - perJarCogs: $5.50 blended — structure confirmed; actual ingredient costs
 *     tracked against purchase records.
 *   - Brightside pricing tiers, setup fee, training fee — set by founder decision.
 *   - Brightside buildModel (founder time = $0 cash, engineer cap $20k) — set.
 *   - mapleSyrup: two sizes confirmed by founder (May 2026). 96 × 1L @ $21 cost/$27
 *     sell; 96 × 500ml @ $13 cost/$18 sell. Supplier has no more — this is the ceiling.
 *     Sold at Calberry (4×/yr), Farmers Market (15 wks), and 807 local line.
 *   - operating.marketsFarmersAnnual: $25/stall confirmed (Dryden Farmers' Market,
 *     community volunteer rate). 15 weeks. $375/yr.
 *   - operating.batchCadence: 200–300 jars per run in ~4–6 hrs (founder confirmed May 2026).
 *
 * PLANNING ASSUMPTIONS (not yet observed / not yet contracted):
 *   - SHARED_SALTS.channelTotals (1,190 jars/yr) — planning target; no season
 *     of batch records confirms this throughput. Farmers market volume (45 jars)
 *     is the founder's conservative estimate, not a measured average.
 *   - SHARED_SALTS.operating (craft fair schedule) — craft fair count assumed.
 *   - SHARED_SALTS.pAndL.netCash ($1,373) — follows from channel totals above;
 *     not an observed cash figure (updated May 2026 for confirmed $25 stall rate).
 *   - SHARED_BRIGHTSIDE.revenueTarget (cumulative18mo: $120,000, ~22 facilities)
 *     — modelling scenario; no pilot site has committed. Revenue window is
 *     late Q4 2026 / early Q1 2027 at earliest.
 *   - SHARED_BRIGHTSIDE.surplusDeployment — all derived from the revenue scenario.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const SHARED_SALTS: SaltsScenario = {
  perJarCogs: {
    rawSalt: 3.5,
    jar: 1.0,
    label: 1.0,
    total: 5.5,
    tag: provisional("working estimate — ingredient costs not reconciled against purchase receipts"),
  },
  channels: [
    {
      name: "Wholesale",
      jars: 525,
      pricePerJar: 8.5,
      revenue: 4463,
      cogs: 2888,
      grossMargin: 1575,
      notes: "5 active accounts; baseline raised by 9-case (225 jar) backlog",
    },
    {
      name: "Corporate",
      jars: 500,
      pricePerJar: 8.5,
      revenue: 4250,
      cogs: 2750,
      grossMargin: 1500,
      notes: "1 order/yr × 500 jars; track record 2 of last 3 yrs",
    },
    {
      name: "Markets — craft fairs",
      jars: 120,
      pricePerJar: 12,
      revenue: 1440,
      cogs: 660,
      grossMargin: 780,
      notes: "4 events/yr × ~30 jars",
    },
    {
      name: "Markets — farmers market",
      jars: 45,
      pricePerJar: 12,
      revenue: 540,
      cogs: 248,
      grossMargin: 293,
      notes: "3 jars/wk × 15 wks (low end of range, founder's pick)",
    },
  ],
  channelTotals: {
    jars: 1190,
    revenue: 10693,
    cogs: 6545,
    grossMargin: 4148,
    tag: provisional("planning target — annual volume not yet tracked against batch records"),
  },
  operating: {
    batchCadence: "200–300 jars per run · ~4–6 hrs · cadence TBD by batch tracking",
    batchLabour: "founder + family, $0 cash",
    freight: "$0 — local buyers",
    marketsCraftAnnual: 600,
    marketsFarmersAnnual: 375,
    marketsOverheadTotal: 975,
    subscriptionsAnnual: 1800,
    subscriptionsAllocationPct: 30,
    tag: provisional("craft fair count assumed; stall rate confirmed at $25 × 15 wks"),
  },
  pAndL: {
    revenue: 10693,
    cogs: 6545,
    marketsOverhead: 975,
    subscriptions: 1800,
    netCash: 1373,
    tag: provisional("derived from channel volume estimates — not an observed cash figure"),
  },
  shadowLabour: {
    sessionJars: 250,
    sessionHours: 5,
    annualJars: 1190,
    annualHours: 24,
    benchHourly: 30,
    annualCost: 720,
    adjustedNet: 653,
    tag: provisional("200–300 jars / 4–6 hrs confirmed by founder May 2026 — using midpoints"),
  },
  mapleSyrup: {
    sizes: [
      {
        label: "1L",
        qty: 96,
        costEach: 21,
        sellEach: 27,
        marginEach: 6,
        totalMargin: 576,
      },
      {
        label: "500ml",
        qty: 96,
        costEach: 13,
        sellEach: 18,
        marginEach: 5,
        totalMargin: 480,
      },
    ],
    annualMargin: 1056,
    tag: confirmed("96 × 1L + 96 × 500ml — supplier at ceiling; sold Calberry, Farmers Market, 807 local line. Confirmed May 2026."),
  },
};


export const SHARED_BRIGHTSIDE: BrightsideScenario = {
  product: {
    description:
      "Recreation Therapy software for Long-Term Care (RT-LTC) facilities. Mobile-first SaaS.",
    customerScope: "LTC facilities only",
    homecareStatus:
      'explicitly shelved — reactivation criterion: "if RT/LTC succeeds on its own."',
    tag: confirmed(),
  },
  pricing: {
    tier1: { threshold: "≤60 residents", monthly: 199 },
    tier2: { threshold: ">60 residents", monthly: 349 },
    perResidentOverage: 3,
    setupFee: 500,
    trainingPerFacility: 1500,
    tag: confirmed(),
  },
  buildModel: {
    description:
      "Founder builds. Founder sells. No incremental Brightside headcount beyond the contract engineer.",
    founderTimeCashCost: 0,
    prelaunchEngineerCap: 20000,
    prelaunchPaymentMonth: "September 2026 (Brightside Launch Month)",
    tag: confirmed("founder time = $0 cash, already paid via the lead-draw line on the agency engagement"),
  },
  revenueTarget: {
    cumulative18mo: 120000,
    exitArr: 80000,
    customerRamp: "0 → ~22 LTC facilities over 18 months",
    mixAssumption: "~60% Tier 1 / ~40% Tier 2 + per-resident overage; ~70% training attach",
    revenueStartWindow: "late Q4 2026 / early Q1 2027 (post-launch + first sales cycle)",
    tag: provisional("modelling scenario — no pilot site has committed; pre-revenue"),
  },
  costBasis: {
    prelaunchOneTime: [
      { name: "Pre-launch software engineer contract", amount: 20000, notes: 'Hard cap; "app launch clearance only"' },
      { name: "Privacy / compliance audit (PHIPA + PIPEDA)", amount: 5000, notes: "Mid-tier consultancy formal audit" },
      { name: "Legal review (ToS + privacy policy)", amount: 3000, notes: "Specialist healthcare-tech lawyer" },
    ],
    prelaunchTotal: 28000,
    recurringMonthly: [
      { name: "Tooling / SaaS (cloud, payment, observability)", amount: 200, notes: "Lean stack" },
      { name: "Sales / CRM tooling (full stack)", amount: 300, notes: "HubSpot Sales Hub or equivalent" },
      { name: "E&O / cyber insurance", amount: 250, notes: "$3,000/yr; full coverage incl. cyber breach" },
      { name: "Conferences (2 / yr Southern Ontario)", amount: 625, notes: "$7,500/yr; provides sales pipeline" },
    ],
    recurringMonthlyTotal: 1375,
    total18mo: 46000,
    tag: confirmed("$28k one-time + ~$18k recurring across 14 post-launch months"),
  },
  surplusDeployment: {
    // Tithe-first: 10% off the top of Brightside revenue, then cost basis,
    // then a 50/50 split on what's left. Revised on 2026-04-29 to align
    // Brightside with the agency-line tithe-first discipline.
    //   $120,000 revenue
    //   − $12,000 tithe (10%)
    //   = $108,000 net of tithe
    //   − $46,000 cost basis
    //   = $62,000 surplus
    //   → $31,000 retained / $31,000 owner take (50/50)
    revenue: 120000,
    tithePct: 10,
    tithe: 12000,
    revenueAfterTithe: 108000,
    cost: 46000,
    surplus: 62000,
    retainedPct: 50,
    ownerTakePct: 50,
    retained: 31000,
    ownerTake: 31000,
    tag: provisional("derived from $120k revenue scenario — no LTC site committed"),
  },
  downsideCoverage: {
    sourceBucket: "Agency Innovation / R&D (Phase 3)",
    sourceAmount: 126155,
    maxExposure: 46000,
    coveragePct: 36,
    tag: confirmed("Brightside IS the innovation investment"),
  },
};

const SHARED_OVERHEADS_BASE: OverheadRow[] = [
  { name: "Aggregation hub (Dad's warehouse)", monthly: 3000, notes: "Rent + utilities all-in" },
  { name: "Tooling / SaaS / insurance", monthly: 2500, notes: "Agency licenses & software stack" },
  { name: "Buffer (statutory + variance)", monthly: 2400, notes: "Catches payroll-tax & insurance jumps" },
  { name: "Recurring tech ops", monthly: 2200, notes: "Cloud, phone plans, monitoring" },
  { name: "Accountant ($1,500/yr ÷ 12)", monthly: 125, notes: "Year-end only" },
  { name: "Legal ($2,000/yr ÷ 12)", monthly: 167 },
  { name: "Northern Band travel (3 days/mo)", monthly: null, notes: "TBD — practitioner visits, will be locked at follow-up" },
];

export const SHARED_OVERHEADS_JUN_AUG: OverheadRow[] = SHARED_OVERHEADS_BASE;
export const SHARED_OVERHEADS_JUN_AUG_TOTAL = 10392;

export const SHARED_OVERHEADS_SEP_ONWARD: OverheadRow[] = [
  ...SHARED_OVERHEADS_BASE.slice(0, 4),
  { name: "Life supports (cleaner + tutor + handyman)", monthly: 2100, notes: "Starts September 2026", startsSeptember: true },
  ...SHARED_OVERHEADS_BASE.slice(4),
];
export const SHARED_OVERHEADS_SEP_ONWARD_TOTAL = 12492;

export const SHARED_RESERVE_PURPOSES: string[] = [
  "Pilot #2 readiness — capital to launch a second engagement without needing a buyer's upfront cash.",
  "Bad-quarter cushion — 3–6 months of operating expenses kept liquid at all times.",
  "Buy-out option — buying back equity / control or unwinding a contract early if the founder needs to.",
  "Capital for a follow-on Brightside investment.",
];

export const SHARED_GIVING_DIRECTION =
  "NW Ontario organizations and reserves, starting with the Dryden–Northern Band corridor as the first targets.";
