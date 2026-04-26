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
      return t.askReco * 12;
    case "pathToScale.year2":
      return t.askReco * 12 * 2;
    case "pathToScale.year3":
      return t.askReco * 12 * 5;
    default:
      return null;
  }
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
