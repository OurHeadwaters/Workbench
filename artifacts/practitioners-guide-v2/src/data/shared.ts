import { confirmed } from "./tags";
import type {
  BrightsideScenario,
  Cdp807,
  OverheadRow,
  SaltsScenario,
} from "./types";

/**
 * Shared, scenario-neutral data.
 *
 * Salts (Parr's Jars), the 807 CDP grant, Brightside, and the agency overhead
 * footprint are identical across every scenario the guide carries — they
 * describe the world, not the engagement shape. This module is the single
 * source of truth those scenarios import from.
 *
 * Reservation purposes and the giving direction are also shared: they describe
 * how surplus is deployed, which doesn't change between scenarios.
 *
 * Historical note: these constants used to live in `v2.ts` while V2 was a
 * live scenario. V2 was retired on 2026-04-26 in favour of V3 (lean team).
 * The data was lifted out so V3 and V4 stop importing from a retired
 * scenario. See ComparePage's "How we got here" milestone note for the
 * narrative version.
 */

export const SHARED_SALTS: SaltsScenario = {
  perJarCogs: {
    rawSalt: 3.5,
    jar: 1.0,
    label: 1.0,
    total: 5.5,
    tag: confirmed("blended average across four blends"),
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
    tag: confirmed(),
  },
  operating: {
    batchCadence: "every ~6 weeks (~8–9 batches/yr)",
    batchLabour: "founder + family, $0 cash",
    freight: "$0 — local buyers",
    marketsCraftAnnual: 600,
    marketsFarmersAnnual: 450,
    marketsOverheadTotal: 1050,
    subscriptionsAnnual: 1800,
    subscriptionsAllocationPct: 30,
    tag: confirmed(),
  },
  pAndL: {
    revenue: 10693,
    cogs: 6545,
    marketsOverhead: 1050,
    subscriptions: 1800,
    netCash: 1298,
    tag: confirmed(),
  },
  shadowLabour: {
    sessionJars: 500,
    sessionHours: 12,
    annualJars: 1190,
    annualHours: 29,
    benchHourly: 30,
    annualCost: 858,
    adjustedNet: 440,
    tag: confirmed(),
  },
  mapleSyrup: {
    cases: 12,
    bottlesPerCase: 12,
    marginPerBottle: 4,
    annualMargin: 576,
    tag: confirmed("separate line, not counted in salt revenue"),
  },
};

export const SHARED_CDP807: Cdp807 = {
  scoping: {
    originalScope: 24000,
    localDiscount: -2000,
    billTo807: 22000,
    confirmedGrant: 12000,
    boardVoted: 10000,
    cashReceivedToDate: 0,
    invoiceTiming: "lands at completion (end of year)",
    tag: confirmed(),
  },
  costToDeliver: {
    replitHosting: 1500,
    other: 0,
    tag: confirmed(),
  },
  pAndL: {
    revenue: 22000,
    replitHosting: 1500,
    netCash: 20500,
    tag: confirmed(),
  },
  structuredOption: {
    upfront807: 1500,
    revenueShareSources: [
      "Benefits plan revenue once live (mechanism TBD — % and base TBD)",
      "Dog-treat piece-work production by Parr's Jars in salt-batch whitespace",
    ],
    cap: 22000,
    status: "working concept — not yet a deal",
    dogTreatUnitCostLow: 1,
    dogTreatUnitCostHigh: 2,
    tag: confirmed(),
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
    tag: confirmed("founder time = $0 cash, already paid via $18k/mo agency salary"),
  },
  revenueTarget: {
    cumulative18mo: 120000,
    exitArr: 80000,
    customerRamp: "0 → ~22 LTC facilities over 18 months",
    mixAssumption: "~60% Tier 1 / ~40% Tier 2 + per-resident overage; ~70% training attach",
    revenueStartWindow: "late Q4 2026 / early Q1 2027 (post-launch + first sales cycle)",
    tag: confirmed(),
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
    revenue: 120000,
    cost: 46000,
    surplus: 74000,
    retainedPct: 50,
    ownerTakePct: 50,
    retained: 37000,
    ownerTake: 37000,
    tag: confirmed("default split"),
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
  { name: "Deer Lake travel (3 days/mo)", monthly: null, notes: "TBD — practitioner visits, will be locked at follow-up" },
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
  "Buy-out option — early termination of the 807 contract or buying back equity / control if needed.",
  "Capital for a follow-on Brightside investment.",
];

export const SHARED_GIVING_DIRECTION =
  "NW Ontario organizations and reserves, starting with the Dryden–Deer Lake corridor as the first targets.";
