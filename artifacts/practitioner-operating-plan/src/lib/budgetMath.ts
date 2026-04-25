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
  reinvestB: number;
  reinvestBPct: number;
  /**
   * Day-one bridge for Scenario B = two months of cost basis + day-one CAPEX.
   * Indigenous-services contracts pay net-60, so months 1–2 have no inflows;
   * the trough is at end of month 2. Same model used by `CashFlow.tsx`.
   */
  bridgeB: number;
  saltBenchAnnual: number;
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
    bridgeB,
    saltBenchAnnual,
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
      return t.bridgeB;
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

export { SALT_BENCH_IDS };
