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
  agency: AgencyScenario;
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

  /**
   * Tithe — top-of-waterfall first claim on revenue. 10% off the top, paid
   * before cost basis or any capital allocation. Dave Ramsey discipline:
   * the tithe is what you decided, not what was left. Reframed from a
   * residual Phase 3 split share on 2026-04-27.
   */
  tithePct: number;
  titheMonthly: number;
  titheTotal: number;

  /**
   * Family-infusion recovery — front-loaded leg of Capital Recovery that
   * retires the founder's husband's $40,000 family infusion in full at
   * month 1 (with month-2 spillover at the post-tithe surplus rate). It
   * is the SAME tax/legal character as the rest of Capital Recovery:
   * tax-free return of principal to the lender (husband), NOT compensation
   * to the lead, NOT income to the founder, NOT a deductible expense to
   * the business. It is shown as its own visible leg only to make the
   * front-loading legible — the substance is identical to V3/V4's
   * undivided $112k Capital Recovery line.
   *
   * Codetry-archetype projects (Deer Lake, future boots-on-the-ground
   * engagements) where the founder personally guaranteed family capital
   * carry a non-zero value here when that capital is being retired up
   * front; Software/Sales engagements run it at $0 because they don't
   * carry a family-infusion obligation. V3/V4 also run it at $0 because
   * their $112k Capital Recovery line was kept undivided.
   *
   * IMPORTANT — relabel history. This field was briefly framed as a
   * "signing bonus" (compensation to the lead) on 2026-04-29 and reverted
   * the same day. Compensation framing would have triggered ~$18k of
   * personal income tax (Ontario top marginal ~53.5%), CRA reasonableness
   * scrutiny, and lost the balance-sheet treatment. Debt repayment is the
   * correct substance.
   */
  familyInfusionRecovery: number;
  familyInfusionRecoveryTag: SourceTag;
  /**
   * Plain-language description of what the family-infusion recovery line
   * is for and where it lands in the waterfall. Empty string when
   * familyInfusionRecovery = 0.
   */
  familyInfusionRecoveryDescription: string;

  /**
   * Team incentives line — Christmas bonus, perks of employment, etc.
   * Surfaced as a named cost-basis row even when the dollar amount is
   * still TBD (so the line is visible in the planning conversation rather
   * than invisible). `amount` may be null when the founder hasn't filled
   * the number in yet.
   */
  teamIncentivesName: string;
  teamIncentivesAmount: number | null;
  teamIncentivesTag: SourceTag;

  costBasisJunAug: number;
  costBasisSepOnward: number;
  /**
   * Monthly surplus AFTER tithe — fee minus tithe minus operating cost basis.
   * The surplus that flows into capital recovery → Brightside launch → Phase 3.
   */
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
  /** Phase 3 split is now Reserve / Innovation only — Giving is taken at the top as a tithe. */
  reservePct: number;
  innovationPct: number;
  reserveMonthly: number;
  innovationMonthly: number;
  reserveTotal: number;
  innovationTotal: number;
  phase3Tag: SourceTag;

  totals18mo: {
    revenue: number;
    /** Engagement-window tithe total — 10% of revenue, paid first. */
    tithe: number;
    payroll: number;
    overheads: number;
    /** Surplus AFTER tithe + payroll + overheads. */
    surplusDeployed: number;
    /**
     * Family-infusion recovery paid out of the engagement-window surplus
     * (Codetry-archetype only — Software/Sales engagements run this at $0,
     * V3/V4 also at $0 because their Capital Recovery line was kept
     * undivided).
     */
    familyInfusionRecovery: number;
    capitalRecovery: number;
    brightsidePrelaunch: number;
    reserve: number;
    innovation: number;
    tag: SourceTag;
  };

  practitionerSalary18mo: number;
  practitionerSalaryTag: SourceTag;

  reservePurposes: string[];
  /** Where the Tithe goes — community-development direction shared across V3 and V4. */
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
    /**
     * Tithe rate applied off the top of Brightside revenue, before the
     * cost basis is subtracted. Mirrors the agency-line tithe-first
     * discipline so Brightside doesn't have a different shape from the
     * rest of the surplus waterfall.
     */
    tithePct: number;
    /** Brightside tithe — tithePct% of revenue, paid first. */
    tithe: number;
    /** Revenue net of the tithe — what the cost basis is taken against. */
    revenueAfterTithe: number;
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

export type ScenarioId = "v3" | "v4" | "v5" | "v6" | "v7";

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
