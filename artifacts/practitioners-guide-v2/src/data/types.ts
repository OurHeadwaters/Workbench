import type { SourceTag } from "./tags";

export interface SaltsScenario {
  perJarCogs: {
    rawSalt: number;
    jar: number;
    label: number;
    total: number;
    tag: SourceTag;
  };
  channels: ChannelRow[];
  channelTotals: {
    jars: number;
    revenue: number;
    cogs: number;
    grossMargin: number;
    tag: SourceTag;
  };
  operating: {
    batchCadence: string;
    batchLabour: string;
    freight: string;
    marketsCraftAnnual: number;
    marketsFarmersAnnual: number;
    marketsOverheadTotal: number;
    subscriptionsAnnual: number;
    subscriptionsAllocationPct: number;
    tag: SourceTag;
  };
  pAndL: {
    revenue: number;
    cogs: number;
    marketsOverhead: number;
    subscriptions: number;
    netCash: number;
    tag: SourceTag;
  };
  shadowLabour: {
    sessionJars: number;
    sessionHours: number;
    annualJars: number;
    annualHours: number;
    benchHourly: number;
    annualCost: number;
    adjustedNet: number;
    tag: SourceTag;
  };
  mapleSyrup: {
    cases: number;
    bottlesPerCase: number;
    marginPerBottle: number;
    annualMargin: number;
    tag: SourceTag;
  };
}

export interface ChannelRow {
  name: string;
  jars: number;
  pricePerJar: number;
  revenue: number;
  cogs: number;
  grossMargin: number;
  notes?: string;
}

export interface RosterRow {
  role: string;
  monthlyLoaded: number;
  notes?: string;
}

export interface OverheadRow {
  name: string;
  monthly: number | null;
  notes?: string;
  startsSeptember?: boolean;
}

export interface ContractsScenario {
  cdp807: Cdp807;
  agency: AgencyScenario;
}

export interface Cdp807 {
  scoping: {
    originalScope: number;
    localDiscount: number;
    billTo807: number;
    confirmedGrant: number;
    boardVoted: number;
    cashReceivedToDate: number;
    invoiceTiming: string;
    tag: SourceTag;
  };
  costToDeliver: {
    replitHosting: number;
    other: number;
    tag: SourceTag;
  };
  pAndL: {
    revenue: number;
    replitHosting: number;
    netCash: number;
    tag: SourceTag;
  };
  structuredOption: {
    upfront807: number;
    revenueShareSources: string[];
    cap: number;
    status: string;
    dogTreatUnitCostLow: number;
    dogTreatUnitCostHigh: number;
    tag: SourceTag;
  };
}

export interface AgencyScenario {
  fee: number;
  termMonths: number;
  renegotiateMonth: number;
  startDate: string;
  buyerStatus: string;
  feeTag: SourceTag;

  roster: RosterRow[];
  payrollTotal: number;
  rosterTag: SourceTag;

  overheadsJunAug: OverheadRow[];
  overheadsJunAugTotal: number;
  overheadsSepOnward: OverheadRow[];
  overheadsSepOnwardTotal: number;
  overheadsTag: SourceTag;

  costBasisJunAug: number;
  costBasisSepOnward: number;
  monthlySurplusJunAug: number;
  monthlySurplusSepOnward: number;
  costBasisTag: SourceTag;

  capitalRecoveryAmount: number;
  capitalRecoveryDescription: string;
  capitalRecoveryMonths: number;
  capitalRecoveryStartLabel: string;
  capitalRecoveryEndLabel: string;
  capitalRecoveryTag: SourceTag;

  brightsideLaunchMonthLabel: string;
  brightsidePrelaunchSpend: number;
  brightsideLaunchSurplus: number;
  brightsideLaunchRemainder: number;
  brightsideLaunchTag: SourceTag;

  phase3Months: number;
  phase3MonthlySurplus: number;
  reservePct: number;
  innovationPct: number;
  givingPct: number;
  reserveMonthly: number;
  innovationMonthly: number;
  givingMonthly: number;
  reserveTotal: number;
  innovationTotal: number;
  givingTotal: number;
  phase3Tag: SourceTag;

  totals18mo: {
    revenue: number;
    payroll: number;
    overheads: number;
    surplusDeployed: number;
    capitalRecovery: number;
    brightsidePrelaunch: number;
    reserve: number;
    innovation: number;
    giving: number;
    tag: SourceTag;
  };

  practitionerSalary18mo: number;
  practitionerSalaryTag: SourceTag;

  reservePurposes: string[];
  givingDirection: string;

  /**
   * Pre-baked renegotiation triggers — surfaced on the Contracts page next
   * to the renegotiation-month line. Empty list for V2/V3 (no published
   * triggers); populated for V4 to make the renegotiation step legible
   * without negotiating it from scratch later.
   */
  renegotiationTriggers: RenegotiationTrigger[];
}

export interface RenegotiationTrigger {
  /** Short label, e.g. "Month 12 renegotiation". */
  step: string;
  /** Plain-language pre-condition, e.g. "Brightside is live AND Karen's tool in daily use". */
  condition: string;
  /** Fee the contract steps to once the condition is met. */
  feeStepTo: number;
  /** Lead draw the founder steps to once the condition is met. */
  drawStepTo: number;
  /** What's required to prove the condition objectively. */
  evidenceRequired: string;
}

export interface BrightsideScenario {
  product: {
    description: string;
    customerScope: string;
    homecareStatus: string;
    tag: SourceTag;
  };
  pricing: {
    tier1: { threshold: string; monthly: number };
    tier2: { threshold: string; monthly: number };
    perResidentOverage: number;
    setupFee: number;
    trainingPerFacility: number;
    tag: SourceTag;
  };
  buildModel: {
    description: string;
    founderTimeCashCost: number;
    prelaunchEngineerCap: number;
    prelaunchPaymentMonth: string;
    tag: SourceTag;
  };
  revenueTarget: {
    cumulative18mo: number;
    exitArr: number;
    customerRamp: string;
    mixAssumption: string;
    revenueStartWindow: string;
    tag: SourceTag;
  };
  costBasis: {
    prelaunchOneTime: { name: string; amount: number; notes: string }[];
    prelaunchTotal: number;
    recurringMonthly: { name: string; amount: number; notes: string }[];
    recurringMonthlyTotal: number;
    total18mo: number;
    tag: SourceTag;
  };
  surplusDeployment: {
    revenue: number;
    cost: number;
    surplus: number;
    retainedPct: number;
    ownerTakePct: number;
    retained: number;
    ownerTake: number;
    tag: SourceTag;
  };
  downsideCoverage: {
    sourceBucket: string;
    sourceAmount: number;
    maxExposure: number;
    coveragePct: number;
    tag: SourceTag;
  };
}

export interface PersonalCash {
  agencySalary18mo: number;
  brightsideOwnerTake: number;
  total18mo: number;
  perYear: number;
  capitalRecovery: number;
  tag: SourceTag;
}

export type ScenarioId = "v2" | "v3" | "v4";

export interface Scenario {
  id: ScenarioId;
  name: string;
  short: string;
  tagline: string;
  description: string;
  accent: string;
  accentSoft: string;
  accentInk: string;
  status: "locked" | "provisional";
  statusNote?: string;
  salts: SaltsScenario;
  contracts: ContractsScenario;
  brightside: BrightsideScenario;
  personal: PersonalCash;
}
