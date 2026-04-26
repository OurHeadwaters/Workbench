import { confirmed, tbd } from "./tags";
import type { Scenario } from "./types";

const v2Salts = {
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

const v2Cdp807 = {
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

const v2Roster = [
  { role: "Practitioner / Lead", monthlyLoaded: 18000, notes: "Engagement owner; visits Deer Lake ~3 days/mo" },
  { role: "IT / Tech", monthlyLoaded: 9500 },
  { role: "Operations Manager (Dryden)", monthlyLoaded: 9500, notes: "Equalized w/ Tech (V1 had $8,500 — bumped)" },
  { role: "Transparency Stack Engineer", monthlyLoaded: 8500, notes: "NEW — builds dashboard, data pipelines, public reports" },
  { role: "Community Development Associate", monthlyLoaded: 7500 },
  { role: "Junior Analyst / Field", monthlyLoaded: 6500 },
  { role: "Food Handler (Dryden depot)", monthlyLoaded: 5000, notes: "Salt batches, dog-treat piecework, distribution prep" },
  { role: "Bookkeeper / Admin", monthlyLoaded: 2500, notes: "Day-to-day (CRA, invoicing, monthly close)" },
];

const v2OverheadsBase = [
  { name: "Aggregation hub (Dad's warehouse)", monthly: 3000, notes: "Rent + utilities all-in" },
  { name: "Tooling / SaaS / insurance", monthly: 2500, notes: "Agency licenses & software stack" },
  { name: "Buffer (statutory + variance)", monthly: 2400, notes: "Catches payroll-tax & insurance jumps" },
  { name: "Recurring tech ops", monthly: 2200, notes: "Cloud, phone plans, monitoring" },
  { name: "Accountant ($1,500/yr ÷ 12)", monthly: 125, notes: "Year-end only" },
  { name: "Legal ($2,000/yr ÷ 12)", monthly: 167 },
  { name: "Deer Lake travel (3 days/mo)", monthly: null, notes: "TBD — practitioner visits, will be locked at follow-up" },
];

const v2OverheadsJunAug = v2OverheadsBase;
const v2OverheadsSepOnward = [
  ...v2OverheadsBase.slice(0, 4),
  { name: "Life supports (cleaner + tutor + handyman)", monthly: 2100, notes: "Starts September 2026", startsSeptember: true },
  ...v2OverheadsBase.slice(4),
];

const v2Agency = {
  fee: 115000,
  termMonths: 18,
  renegotiateMonth: 12,
  startDate: "June 1, 2026",
  buyerStatus: "TBD (father vs 807 — affects political weight, not the math)",
  feeTag: confirmed("founder-recommended, founder-accepted — replaces V1's markup framing"),

  roster: v2Roster,
  payrollTotal: 67000,
  rosterTag: confirmed(),

  overheadsJunAug: v2OverheadsJunAug,
  overheadsJunAugTotal: 10392,
  overheadsSepOnward: v2OverheadsSepOnward,
  overheadsSepOnwardTotal: 12492,
  overheadsTag: confirmed("Deer Lake travel TBD adds to overheads once locked"),

  costBasisJunAug: 77392,
  costBasisSepOnward: 79492,
  monthlySurplusJunAug: 37608,
  monthlySurplusSepOnward: 35508,
  costBasisTag: confirmed(),

  capitalRecoveryAmount: 112000,
  capitalRecoveryDescription:
    "$72k outstanding business loan first, then $40k personal infusion from founder's husband, in that order.",
  capitalRecoveryMonths: 3,
  capitalRecoveryStartLabel: "Jun 2026",
  capitalRecoveryEndLabel: "End of Aug 2026",
  capitalRecoveryTag: confirmed("~$824 trickle to splits in late August, immaterial"),

  brightsideLaunchMonthLabel: "September 2026",
  brightsidePrelaunchSpend: 28000,
  brightsideLaunchSurplus: 35508,
  brightsideLaunchRemainder: 7508,
  brightsideLaunchTag: confirmed("$20k engineer + $5k audit + $3k legal"),

  phase3Months: 14,
  phase3MonthlySurplus: 35508,
  reservePct: 50,
  innovationPct: 25,
  givingPct: 25,
  reserveMonthly: 17754,
  innovationMonthly: 8877,
  givingMonthly: 8877,
  reserveTotal: 252310,
  innovationTotal: 126155,
  givingTotal: 126155,
  phase3Tag: confirmed("includes Sept partial trickle"),

  totals18mo: {
    revenue: 2070000,
    payroll: 1206000,
    overheads: 218556,
    surplusDeployed: 645444,
    capitalRecovery: 112000,
    brightsidePrelaunch: 28000,
    reserve: 252310,
    innovation: 126155,
    giving: 126155,
    tag: confirmed(),
  },

  practitionerSalary18mo: 324000,
  practitionerSalaryTag: confirmed("$18k/mo × 18 mo"),

  reservePurposes: [
    "Pilot #2 readiness — capital to launch a second engagement without needing a buyer's upfront cash.",
    "Bad-quarter cushion — 3–6 months of operating expenses kept liquid at all times.",
    "Buy-out option — early termination of the 807 contract or buying back equity / control if needed.",
    "Capital for a follow-on Brightside investment.",
  ],
  givingDirection:
    "NW Ontario organizations and reserves, starting with the Dryden–Deer Lake corridor as the first targets.",
};

const v2Brightside = {
  product: {
    description:
      "Recreation Therapy software for Long-Term Care (RT-LTC) facilities. Mobile-first SaaS.",
    customerScope: "LTC facilities only",
    homecareStatus:
      "explicitly shelved — reactivation criterion: \"if RT/LTC succeeds on its own.\"",
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
      { name: "Pre-launch software engineer contract", amount: 20000, notes: "Hard cap; \"app launch clearance only\"" },
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

const v2Personal = {
  agencySalary18mo: 324000,
  brightsideOwnerTake: 37000,
  total18mo: 361000,
  perYear: 240667,
  capitalRecovery: 112000,
  tag: confirmed("Capital Recovery is debt repayment to lender + family — NOT income"),
};

export const SCENARIO_V2: Scenario = {
  id: "v2",
  name: "V2 — Full team",
  short: "V2",
  tagline: "$115k/mo agency · 8-role team",
  description:
    "The founder-recommended baseline. Full transparency stack engineer, dedicated junior analyst, $115k/mo fee. Locked line-by-line in this planning conversation.",
  accent: "#1F5446",
  accentSoft: "#E0EAE6",
  accentInk: "#0F2C25",
  status: "locked",
  salts: v2Salts,
  contracts: { cdp807: v2Cdp807, agency: v2Agency },
  brightside: v2Brightside,
  personal: v2Personal,
};

export const V2_DEER_LAKE_TRAVEL = tbd(
  "Practitioner visits ~3 days/mo. Locking requires founder to estimate flight + lodging + per diem.",
);
