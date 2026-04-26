import { CROSS_RESERVE_DEFAULTS } from "@workspace/cross-reserve-defaults";

import { COST_REGISTRY_BY_ID } from "../data/costRegistry";
import { useAppState } from "./storage";
import type { AppState } from "./storage";

const A_ROLE_IDS = [
  "budget.a.practitioner",
  "budget.a.opsManager",
  "budget.a.itTech",
  "budget.a.bookkeeper",
  "budget.a.foodHandler",
  "budget.a.lifeSupports",
  "budget.a.aggregationHub",
  "budget.a.tooling",
  "budget.a.recurringTech",
] as const;

const B_ROLE_IDS = [
  "budget.b.practitioner",
  "budget.b.opsManager",
  "budget.b.itTech",
  "budget.b.bookkeeper",
  "budget.b.foodHandler",
  "budget.b.cdAssociate",
  "budget.b.juniorAnalyst",
  "budget.b.lifeSupports",
  "budget.b.aggregationHub",
  "budget.b.tooling",
  "budget.b.recurringTech",
  "budget.b.buffer",
] as const;

const C_ROLE_IDS = [
  "budget.c.practitioner",
  "budget.c.opsManager",
  "budget.c.itTech",
  "budget.c.bookkeeper",
  "budget.c.foodHandler",
  "budget.c.cdAssociate",
  "budget.c.juniorAnalyst",
  "budget.c.seniorEngineer",
  "budget.c.regionalOutreach",
  "budget.c.trainer",
  "budget.c.lifeSupports",
  "budget.c.aggregationHub",
  "budget.c.tooling",
  "budget.c.recurringTech",
] as const;

export const PEOPLE_BUCKET_KEYS = [
  "costOfLiving",
  "resilience",
  "retention",
  "appreciation",
  "growth",
] as const;
export type PeopleBucketKey = (typeof PEOPLE_BUCKET_KEYS)[number];

const A_PEOPLE_BUCKET_IDS = PEOPLE_BUCKET_KEYS.map(
  (k) => `people.a.${k}`,
) as readonly string[];
const B_PEOPLE_BUCKET_IDS = PEOPLE_BUCKET_KEYS.map(
  (k) => `people.b.${k}`,
) as readonly string[];
const C_PEOPLE_BUCKET_IDS = PEOPLE_BUCKET_KEYS.map(
  (k) => `people.c.${k}`,
) as readonly string[];

// "Base payroll" = the loaded salary lines that the People & Retention
// buckets sit on top of. Mirrors PeopleSizing's PAYROLL_IDS — kept here
// so the Budget slide's "% of base payroll" reads against the same
// denominator the PeopleSizing slide reports against.
const A_BASE_PAYROLL_IDS = [
  "budget.a.practitioner",
  "budget.a.opsManager",
  "budget.a.itTech",
  "budget.a.bookkeeper",
  "budget.a.foodHandler",
] as const;

const B_BASE_PAYROLL_IDS = [
  "budget.b.practitioner",
  "budget.b.opsManager",
  "budget.b.itTech",
  "budget.b.bookkeeper",
  "budget.b.foodHandler",
  "budget.b.cdAssociate",
  "budget.b.juniorAnalyst",
] as const;

const C_BASE_PAYROLL_IDS = [
  "budget.c.practitioner",
  "budget.c.opsManager",
  "budget.c.itTech",
  "budget.c.bookkeeper",
  "budget.c.foodHandler",
  "budget.c.cdAssociate",
  "budget.c.juniorAnalyst",
  "budget.c.seniorEngineer",
  "budget.c.regionalOutreach",
  "budget.c.trainer",
] as const;

const SALT_BENCH_IDS = [
  "salt.bench.directPicking",
  "salt.bench.overflow",
  "salt.bench.standby",
  "salt.bench.training",
  "salt.bench.replacement",
  "salt.bench.mileage",
] as const;

export function resolveCost(state: AppState, id: string): number {
  const review = state.costReview?.[id];
  if (review?.status === "edited" && typeof review.editedValue === "number") {
    return review.editedValue;
  }
  return COST_REGISTRY_BY_ID[id]?.defaultValue ?? 0;
}

function sumIds(state: AppState, ids: readonly string[]): number {
  return ids.reduce((acc, id) => acc + resolveCost(state, id), 0);
}

export type BudgetTotals = {
  askFloor: number;
  askReco: number;
  askScale: number;
  costBasisA: number;
  costBasisB: number;
  costBasisC: number;
  capexB: number;
  capexC: number;
  /**
   * Gross "markup" line for Scenario B = ask − role-line cost basis.
   * This is what shows up on the Budget slide as "Reinvestment vs.
   * cost basis" and what CFO-facing math has historically reported.
   * It *overstates* what's free for tech CAPEX / training / pilot
   * reserve, because the People & Retention buckets (~$8.8k/mo) come
   * out of this same pool — see `loadedReinvestB` for the truly-free
   * number the Closing and Reinvestment slides quote.
   */
  reinvestB: number;
  reinvestBPct: number;
  /**
   * Net free cash for reinvestment in Scenario B = ask − loaded cost
   * (role lines + People & Retention buckets). This is what's actually
   * left to fund the Four Destinations on the Reinvestment slide
   * (tech CAPEX, tooling, training, pilot reserve) once loaded payroll
   * is honoured. The Closing and Reinvestment slides quote this so
   * they reconcile with the Cash Flow projection, which already pays
   * the buckets out of monthly outflow.
   */
  loadedReinvestB: number;
  loadedReinvestBPct: number;
  /**
   * Day-one bridge for Scenario B = two months of *cost basis* + day-one
   * CAPEX. Kept for any view that wants the unloaded (role-line-only)
   * trough; the runway math the contractor's CFO reads now uses
   * `loadedBridgeB`, which folds in the People & Retention buckets the
   * org actually pays out each month.
   */
  bridgeB: number;
  /**
   * Day-one bridge for Scenario B at *loaded* cost = two months of
   * (role lines + People & Retention buckets) + day-one CAPEX. This is
   * the number the Cash Flow projection plots and the Closing slide
   * surfaces, so the bridge ask reconciles with what actually leaves
   * the bank account in months 1–2.
   */
  loadedBridgeB: number;
  saltBenchAnnual: number;
  peopleBucketsA: number;
  peopleBucketsB: number;
  peopleBucketsC: number;
  loadedCostA: number;
  loadedCostB: number;
  loadedCostC: number;
  basePayrollA: number;
  basePayrollB: number;
  basePayrollC: number;
};

export function computeBudgetTotals(state: AppState): BudgetTotals {
  const askFloor = resolveCost(state, "ask.floor");
  const askReco = resolveCost(state, "ask.recommended");
  const askScale = resolveCost(state, "ask.scale");
  const costBasisA = sumIds(state, A_ROLE_IDS);
  const costBasisB = sumIds(state, B_ROLE_IDS);
  const costBasisC = sumIds(state, C_ROLE_IDS);
  const capexB = resolveCost(state, "capex.b");
  const capexC = resolveCost(state, "capex.c");
  const reinvestB = Math.max(0, askReco - costBasisB);
  const reinvestBPct = costBasisB > 0 ? (reinvestB / costBasisB) * 100 : 0;
  const bridgeB = costBasisB * 2 + capexB;
  const saltBenchAnnual = sumIds(state, SALT_BENCH_IDS);
  const peopleBucketsA = sumIds(state, A_PEOPLE_BUCKET_IDS);
  const peopleBucketsB = sumIds(state, B_PEOPLE_BUCKET_IDS);
  const peopleBucketsC = sumIds(state, C_PEOPLE_BUCKET_IDS);
  const loadedCostA = costBasisA + peopleBucketsA;
  const loadedCostB = costBasisB + peopleBucketsB;
  const loadedCostC = costBasisC + peopleBucketsC;
  // Net free cash for reinvestment after the People & Retention
  // buckets are paid (the buckets sit on the same outflow stream that
  // funds the Four Destinations on the Reinvestment slide). This is
  // the figure the Closing slide and Reinvestment slide quote so they
  // reconcile with the Cash Flow projection.
  const loadedReinvestB = Math.max(0, askReco - loadedCostB);
  const loadedReinvestBPct =
    loadedCostB > 0 ? (loadedReinvestB / loadedCostB) * 100 : 0;
  // Bridge ask the contractor's CFO actually has to underwrite — two
  // months of *loaded* outflow (role lines + People & Retention buckets)
  // plus day-one CAPEX. Using costBasisB here would silently exclude
  // the ~$8.8k/mo of bucket spend the practitioner has committed to.
  const loadedBridgeB = loadedCostB * 2 + capexB;
  const basePayrollA = sumIds(state, A_BASE_PAYROLL_IDS);
  const basePayrollB = sumIds(state, B_BASE_PAYROLL_IDS);
  const basePayrollC = sumIds(state, C_BASE_PAYROLL_IDS);
  return {
    askFloor,
    askReco,
    askScale,
    costBasisA,
    costBasisB,
    costBasisC,
    capexB,
    capexC,
    reinvestB,
    reinvestBPct,
    loadedReinvestB,
    loadedReinvestBPct,
    bridgeB,
    loadedBridgeB,
    saltBenchAnnual,
    peopleBucketsA,
    peopleBucketsB,
    peopleBucketsC,
    loadedCostA,
    loadedCostB,
    loadedCostC,
    basePayrollA,
    basePayrollB,
    basePayrollC,
  };
}

export function useBudgetTotals(): BudgetTotals {
  const state = useAppState();
  return computeBudgetTotals(state);
}

/**
 * Looks up the live computed value for derived registry entries
 * (the "Headline totals" checkpoints). Returns null if the id is not
 * a known derived total — the modal then falls back to the entry's
 * static defaultValue.
 */
export function getLiveCostValue(state: AppState, id: string): number | null {
  const t = computeBudgetTotals(state);
  switch (id) {
    case "contract.layer1.software.annual":
      // Layer-1 software-only contract annualised: monthly × 12. Edits
      // to `contract.layer1.software.monthly` in the cost-review modal
      // flow through to every $420k/yr surface (Three Revenue Layers,
      // Year One Picture, Path to Scale narration, OnePager) without
      // the slides ever needing to hardcode the annualised number.
      return resolveCost(state, "contract.layer1.software.monthly") * 12;
    case "summary.costBasis.a":
      return t.costBasisA;
    case "summary.costBasis.b":
      return t.costBasisB;
    case "summary.costBasis.c":
      return t.costBasisC;
    case "bridge.b.headline":
      // Surface the *loaded* bridge — the number the Cash Flow slide
      // and the Closing slide both quote — so the cost-review modal
      // and the slide UI reconcile.
      return t.loadedBridgeB;
    case "pathToScale.year1":
      // Y1 = one Deer Lake contract, no cross-reserve revenue yet.
      return t.askReco * 12;
    case "pathToScale.year2": {
      // Y2 = Deer Lake contract + cross-reserve install revenue
      // (2 installs × per-reserve install + 2 first-year retainers).
      // Composed from real components instead of askReco × 12 × N so
      // the headline reconciles with the cross-reserve story the deck
      // tells. Falls back through getLiveCostValue, so any edits to
      // ask.recommended, the day rates, or the retainer flow through.
      const crossY2 = getLiveCostValue(state, "crossReserve.year2.revenue") ?? 0;
      return t.askReco * 12 + crossY2;
    }
    case "pathToScale.year3": {
      // Y3 = Deer Lake contract + cross-reserve install revenue
      // (2 new installs + 4 active retainers — retainers compound as
      // more reserves go live). Same composition logic as Y2.
      const crossY3 = getLiveCostValue(state, "crossReserve.year3.revenue") ?? 0;
      return t.askReco * 12 + crossY3;
    }
    case "crossReserve.installRevenue.perReserve": {
      // Derived: 30 on-site days × on-site rate + 24 remote days × remote rate.
      // Edits to either day rate flow through here so the per-reserve install
      // headline ($148,200 at default rates) recomputes for the cost-review
      // modal and any future on-slide live binding.
      const onsite = resolveCost(state, "crossReserve.dayRate.onsite");
      const remote = resolveCost(state, "crossReserve.dayRate.remote");
      return CROSS_RESERVE_ONSITE_DAYS * onsite + CROSS_RESERVE_REMOTE_DAYS * remote;
    }
    case "crossReserve.year2.revenue": {
      // Derived: 2 new installs + 2 first-year retainers (the two reserves
      // installed in Y2). Stacks on top of the Deer Lake contract to make
      // pathToScale.year2.
      const onsite = resolveCost(state, "crossReserve.dayRate.onsite");
      const remote = resolveCost(state, "crossReserve.dayRate.remote");
      const retainer = resolveCost(state, "crossReserve.retainer.annual");
      const installPer = CROSS_RESERVE_ONSITE_DAYS * onsite + CROSS_RESERVE_REMOTE_DAYS * remote;
      return 2 * installPer + 2 * retainer;
    }
    case "crossReserve.year3.revenue": {
      // Derived: 2 new installs + 4 active retainers (2 from Y2 + 2 new).
      // Retainer income compounds as more reserves go live. Stacks on top
      // of the Deer Lake contract to make pathToScale.year3.
      const onsite = resolveCost(state, "crossReserve.dayRate.onsite");
      const remote = resolveCost(state, "crossReserve.dayRate.remote");
      const retainer = resolveCost(state, "crossReserve.retainer.annual");
      const installPer = CROSS_RESERVE_ONSITE_DAYS * onsite + CROSS_RESERVE_REMOTE_DAYS * remote;
      return 2 * installPer + 4 * retainer;
    }
    case "crossReserve.travel.totalPerInstall":
    case "crossReserve.travelPassthrough.example": {
      // Worked rolled-up example of the receiving-reserve pass-through
      // for the fly-in scheduled (Wasaya/Bearskin) corridor. Stays in
      // lockstep with the existing per-component planning entries so the
      // cost-review modal never surfaces two conflicting pass-through
      // totals: 12 weekly flights + 30 lodging nights + 30 food
      // per-diem days. Pass-through is reimbursed cost — never folded
      // into the practitioner's fee or any Y2/Y3 revenue line.
      //
      // `crossReserve.travel.totalPerInstall` is the same rolled-up
      // headline surfaced as a standalone registry entry — it falls
      // through to the same derivation so the two cannot disagree in
      // the cost-review modal even after the user edits a component
      // input or the shared install shape changes.
      const flightPerWeek = resolveCost(state, "crossReserve.travel.flightPerWeek");
      const lodgingPerNight = resolveCost(state, "crossReserve.travel.lodgingPerNight");
      const foodPerDay = resolveCost(state, "crossReserve.travel.foodPerOnsiteDay");
      return (
        CROSS_RESERVE_INSTALL_WEEKS * flightPerWeek +
        CROSS_RESERVE_ONSITE_DAYS * lodgingPerNight +
        CROSS_RESERVE_ONSITE_DAYS * foodPerDay
      );
    }
    case "crossReserve.travelPassthrough.driveIn": {
      // Drive-in / all-weather-road variant of the pass-through example.
      // Same 12-week / 30-on-site-day install shape as the fly-in case
      // but with vehicle-allowance transport (no scheduled-airline
      // ticket) and southern-rate lodging / food. Inline constants
      // mirror what the context string spells out so the cost-review
      // modal stays self-explanatory; same no-double-counting rule —
      // never added to any fee or Y2/Y3 revenue line.
      const drivePerWeek = 400; // ≈600 km RT × $0.67/km vehicle allowance
      const lodgingPerNight = 150; // regional motel / contractor Airbnb
      const foodPerDay = 60; // regional grocery, NOT Northern Store
      return (
        CROSS_RESERVE_INSTALL_WEEKS * drivePerWeek +
        CROSS_RESERVE_ONSITE_DAYS * lodgingPerNight +
        CROSS_RESERVE_ONSITE_DAYS * foodPerDay
      );
    }
    case "crossReserve.travelPassthrough.winterRoad": {
      // Winter-road-only / charter-heavy variant. Same 12-week /
      // 30-on-site-day install shape but with charter-dominated
      // transport (no scheduled service) and deeper-north lodging /
      // food pricing. Same no-double-counting rule.
      const transportPerWeek = 2500; // charter rotations + winter-road truck mix
      const lodgingPerNight = 300; // premium contractor camp / band-house
      const foodPerDay = 130; // deeper-north Northern Store mark-up
      return (
        CROSS_RESERVE_INSTALL_WEEKS * transportPerWeek +
        CROSS_RESERVE_ONSITE_DAYS * lodgingPerNight +
        CROSS_RESERVE_ONSITE_DAYS * foodPerDay
      );
    }
    case "crossReserve.year1.stickerPrice": {
      // Receiving-reserve Y1 all-in sticker = per-reserve install fee
      // (live, derived from the day rates) + the fly-in scheduled
      // travel pass-through example (live, derived from the per-component
      // travel inputs) + the first-year discipline-keeper retainer (live).
      // Composing it from the same components every other cross-reserve
      // headline reads from means edits in the cost-review modal
      // (day rates, per-component travel, retainer) flow into this
      // headline without any second source of truth — and the slide-side
      // "~$201k all-in" line on Three Revenue Layers and First Reserve
      // Then The Next moves with them automatically.
      const installPer =
        getLiveCostValue(state, "crossReserve.installRevenue.perReserve") ?? 0;
      const travelExample =
        getLiveCostValue(state, "crossReserve.travelPassthrough.example") ?? 0;
      const retainer = resolveCost(state, "crossReserve.retainer.annual");
      return installPer + travelExample + retainer;
    }
    default:
      return null;
  }
}

// Cross-reserve install day-count constants (typical 12-week install
// shape). Sourced from `@workspace/cross-reserve-defaults`
// (`install.{weeks,onsiteDays,remoteDays}`) — the same package the
// Deer Lake "First reserve, then the next" slide reads its calculator
// defaults and body copy from. A single edit there flows through to
// the install-revenue / Y2 / Y3 / travel-pass-through derivations
// below and to that slide on the next build, so the two surfaces
// cannot drift apart. The re-exports preserve the prior public API
// (anything that previously imported these constants from
// `budgetMath` keeps working).
export const CROSS_RESERVE_ONSITE_DAYS = CROSS_RESERVE_DEFAULTS.install.onsiteDays;
export const CROSS_RESERVE_REMOTE_DAYS = CROSS_RESERVE_DEFAULTS.install.remoteDays;
// Used by the travel pass-through worked example (one round-trip flight
// per install week). Matches the assumption baked into
// `crossReserve.travel.flightPerWeek`.
export const CROSS_RESERVE_INSTALL_WEEKS = CROSS_RESERVE_DEFAULTS.install.weeks;

// ----------------------------------------------------------------------
// Second-anchor / Y1 gap-closing math
// ----------------------------------------------------------------------
// The "Year One Picture" slide surfaces a $127,202 Y1 cash gap (Deer
// Lake $35k/mo against the V3 cost basis of $47,817/mo) plus $112k of
// standing V2 capital recovery. These are the V3-spec-locked headline
// numbers (also pinned in costRegistry.ts copy + lockedNumbers.test.ts);
// exporting them here lets the second-anchor slide reconcile against
// the same gap figure rather than re-typing it. If the Y1 picture
// changes, both slides move together.
export const Y1_HONEST_REVENUE = 446598;
export const Y1_HONEST_COST_BASIS = 573800;
export const Y1_HONEST_GAP = Y1_HONEST_COST_BASIS - Y1_HONEST_REVENUE;

// A typical cross-reserve install is 12 weeks ≈ 3 months. Used by the
// second-anchor timing strip to figure out (a) whether an install
// landing in month M completes inside Y1, and (b) how many months of
// retainer the receiving reserve pays in Y1 once install completes.
export const SECOND_ANCHOR_INSTALL_DURATION_MONTHS = 3;

// Tier-2 managed-services illustrative ARPU range — the same $300–800/mo
// range the V3 deck quotes for SMB / band-office subscriptions.
// Centralised here so the slide and any tests/audits read the same band.
export const TIER2_ARPU_LOW = 300;
export const TIER2_ARPU_MID = 500;
export const TIER2_ARPU_HIGH = 800;
// "Realistic" near-term portfolio shape — what the practitioner can
// land in Y1 alongside Deer Lake without a second touring engagement.
export const TIER2_REALISTIC_SUBS_LOW = 4;
export const TIER2_REALISTIC_SUBS_HIGH = 6;

export type SecondAnchorTiming = {
  /** Calendar month of Y1 the second anchor's install kicks off (1–12). */
  landMonth: number;
  /** True when install completes on or before month 12. */
  installCompletedInY1: boolean;
  /** Install revenue recognised inside Y1 (full price if completed; pro-rated otherwise). */
  installInflow: number;
  /** How many months of retainer the receiving reserve pays inside Y1 (after install completes). */
  retainerMonthsActive: number;
  /** Retainer revenue recognised inside Y1 = (retainer / 12) × retainerMonthsActive. */
  retainerInflow: number;
  /** Sum of installInflow + retainerInflow. */
  totalInflow: number;
  /** gap − totalInflow. Negative means Y1 closes with a surplus. */
  remainingGap: number;
  /** True when totalInflow ≥ Y1_HONEST_GAP (the second anchor closes the gap). */
  closesGap: boolean;
};

export type SecondAnchorScenarios = {
  gap: number;
  installPerReserve: number;
  retainerAnnual: number;
  installDurationMonths: number;
  /**
   * Shape #1: a single 12-week install lands late enough in Y1 that
   * no retainer is recognised in Y1 (or the receiving reserve simply
   * defers the retainer). The install fee on its own carries the gap.
   * Y2 carry-in from this anchor is $0 unless a retainer is signed.
   */
  scenarioInstallOnly: {
    inflow: number;
    surplus: number;
    y2Carry: number;
  };
  /**
   * Shape #2: install lands at M6 (mid-year baseline). Install completes
   * by M9, retainer pro-rates for the remaining 3 months of Y1. Closes
   * the gap and seeds a Y2 retainer floor of one full annual retainer.
   */
  scenarioInstallPlusRetainer: {
    landMonth: number;
    installInflow: number;
    retainerMonthsActive: number;
    retainerInflow: number;
    totalInflow: number;
    surplus: number;
    y2Carry: number;
  };
  /**
   * Shape #3: replace the cross-reserve install with a Tier-2 portfolio
   * of SMB/band-office managed-services subscriptions. The slide shows
   * what a "realistic" 4–6-sub portfolio actually contributes, and what
   * subscription count would actually be needed at mid-/high-ARPU to
   * fully close the same Y1 gap.
   */
  scenarioTier2Stack: {
    arpuLow: number;
    arpuMid: number;
    arpuHigh: number;
    realisticSubsLow: number;
    realisticSubsHigh: number;
    /** 4 subs × $300/mo × 12 — the bottom of the realistic portfolio. */
    realisticInflowLow: number;
    /** 6 subs × $800/mo × 12 — the top of the realistic portfolio. */
    realisticInflowHigh: number;
    /** Subs needed at $500/mo to fully cover the gap inside Y1. */
    subsNeededAtMid: number;
    /** Subs needed at $800/mo to fully cover the gap inside Y1. */
    subsNeededAtHigh: number;
    /** Y2 carry — annualised subscription run-rate (low end of realistic portfolio). */
    y2CarryLow: number;
    /** Y2 carry — annualised subscription run-rate (high end of realistic portfolio). */
    y2CarryHigh: number;
  };
  /** Timing sensitivity: install + retainer landing at M3, M6, or M9. */
  timing: SecondAnchorTiming[];
};

function timingFor(
  landMonth: number,
  installPerReserve: number,
  retainer: number,
  durationMonths: number,
  gap: number,
): SecondAnchorTiming {
  const installEndMonth = landMonth + durationMonths;
  const installCompletedInY1 = installEndMonth <= 12;
  // If the install runs past month 12, recognise only the fraction of
  // install days that landed inside Y1 (linear pro-rate over the
  // 12-week shape).
  const monthsOfInstallInY1 = Math.max(
    0,
    Math.min(durationMonths, 12 - landMonth),
  );
  const installFraction = installCompletedInY1
    ? 1
    : monthsOfInstallInY1 / durationMonths;
  const installInflow = installPerReserve * installFraction;
  const retainerMonthsActive = installCompletedInY1
    ? Math.max(0, 12 - installEndMonth)
    : 0;
  const retainerInflow = (retainer / 12) * retainerMonthsActive;
  const totalInflow = installInflow + retainerInflow;
  return {
    landMonth,
    installCompletedInY1,
    installInflow,
    retainerMonthsActive,
    retainerInflow,
    totalInflow,
    remainingGap: gap - totalInflow,
    closesGap: totalInflow >= gap,
  };
}

export function computeSecondAnchorScenarios(
  state: AppState,
): SecondAnchorScenarios {
  const onsite = resolveCost(state, "crossReserve.dayRate.onsite");
  const remote = resolveCost(state, "crossReserve.dayRate.remote");
  const retainer = resolveCost(state, "crossReserve.retainer.annual");
  const installPerReserve =
    CROSS_RESERVE_ONSITE_DAYS * onsite + CROSS_RESERVE_REMOTE_DAYS * remote;
  const durationMonths = SECOND_ANCHOR_INSTALL_DURATION_MONTHS;
  const gap = Y1_HONEST_GAP;

  const m6 = timingFor(6, installPerReserve, retainer, durationMonths, gap);

  const scenarioInstallOnly = {
    inflow: installPerReserve,
    surplus: installPerReserve - gap,
    y2Carry: 0,
  };

  const scenarioInstallPlusRetainer = {
    landMonth: 6,
    installInflow: m6.installInflow,
    retainerMonthsActive: m6.retainerMonthsActive,
    retainerInflow: m6.retainerInflow,
    totalInflow: m6.totalInflow,
    surplus: m6.totalInflow - gap,
    y2Carry: retainer,
  };

  const realisticInflowLow =
    TIER2_REALISTIC_SUBS_LOW * TIER2_ARPU_LOW * 12;
  const realisticInflowHigh =
    TIER2_REALISTIC_SUBS_HIGH * TIER2_ARPU_HIGH * 12;
  const scenarioTier2Stack = {
    arpuLow: TIER2_ARPU_LOW,
    arpuMid: TIER2_ARPU_MID,
    arpuHigh: TIER2_ARPU_HIGH,
    realisticSubsLow: TIER2_REALISTIC_SUBS_LOW,
    realisticSubsHigh: TIER2_REALISTIC_SUBS_HIGH,
    realisticInflowLow,
    realisticInflowHigh,
    subsNeededAtMid: Math.ceil(gap / (TIER2_ARPU_MID * 12)),
    subsNeededAtHigh: Math.ceil(gap / (TIER2_ARPU_HIGH * 12)),
    y2CarryLow: realisticInflowLow,
    y2CarryHigh: realisticInflowHigh,
  };

  return {
    gap,
    installPerReserve,
    retainerAnnual: retainer,
    installDurationMonths: durationMonths,
    scenarioInstallOnly,
    scenarioInstallPlusRetainer,
    scenarioTier2Stack,
    timing: [
      timingFor(3, installPerReserve, retainer, durationMonths, gap),
      timingFor(6, installPerReserve, retainer, durationMonths, gap),
      timingFor(9, installPerReserve, retainer, durationMonths, gap),
    ],
  };
}

export function useSecondAnchorScenarios(): SecondAnchorScenarios {
  const state = useAppState();
  return computeSecondAnchorScenarios(state);
}

export function useLiveCostValue(id: string): number | null {
  const state = useAppState();
  return getLiveCostValue(state, id);
}

export const ROLE_IDS = {
  A: A_ROLE_IDS,
  B: B_ROLE_IDS,
  C: C_ROLE_IDS,
};

// Shared with PeopleSizing.tsx — the loaded salary lines that the
// People & Retention buckets sit on top of, used for the "% of base
// payroll" denominator in both places.
export const BASE_PAYROLL_IDS = {
  A: A_BASE_PAYROLL_IDS,
  B: B_BASE_PAYROLL_IDS,
  C: C_BASE_PAYROLL_IDS,
};

// Shared with PeopleSizing.tsx — the per-scenario People & Retention
// bucket registry ids (cost-of-living, resilience, retention,
// appreciation, growth).
export const PEOPLE_BUCKET_IDS = {
  A: A_PEOPLE_BUCKET_IDS,
  B: B_PEOPLE_BUCKET_IDS,
  C: C_PEOPLE_BUCKET_IDS,
};

export { SALT_BENCH_IDS };
