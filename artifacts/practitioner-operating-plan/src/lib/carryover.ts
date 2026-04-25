import { getWeekPlan, type Step } from "../data/plan2026";
import type { AppState } from "./storage";

export type CarriedItem = { fromWeek: number; step: Step };

let cachedAllSteps: Map<string, { step: Step; weekNumber: number }> | null =
  null;

function getAllStepsLookup(): Map<
  string,
  { step: Step; weekNumber: number }
> {
  if (cachedAllSteps) return cachedAllSteps;
  const m = new Map<string, { step: Step; weekNumber: number }>();
  for (let w = 1; w <= 52; w += 1) {
    const wk = getWeekPlan(w);
    if (!wk.days) continue;
    for (const day of wk.days) {
      for (const step of day.steps) {
        m.set(step.id, { step, weekNumber: w });
      }
    }
  }
  cachedAllSteps = m;
  return m;
}

// Single source of truth for carry-over. Returns the items that should
// appear at the start of `targetWeek` rolled forward from prior weeks.
//
// Recursive rule:
//   remaining(W) =
//     if W <= 1: []
//     else if state.weekCloseOuts[W-1] exists:
//       carriedStepIds (filtered to undone)
//     else:
//       remaining(W-1) ∪ steps_in(W-1)   (filtered to undone)
//
// Walks the full plan year (max 52 weeks) so an item keeps rolling forward
// until it is either marked done or explicitly dropped at a close-out.
export function findCarriedFromPriorWeeks(
  state: AppState,
  targetWeek: number,
): CarriedItem[] {
  const all = getAllStepsLookup();
  const seen = new Set<string>();
  const out: CarriedItem[] = [];

  // Walk forward from week 1, accumulating the "still undone" set as we
  // go. At each closed-out week, the set is replaced by the user's
  // explicit carry list. At each not-closed week, it expands to also
  // include that week's own steps.
  let pending = new Set<string>();

  for (let w = 1; w < targetWeek; w += 1) {
    const close = state.weekCloseOuts[String(w)];
    if (close) {
      pending = new Set(close.carriedStepIds);
    } else {
      const wk = getWeekPlan(w);
      if (wk.days) {
        for (const day of wk.days) {
          for (const step of day.steps) pending.add(step.id);
        }
      }
    }
    // Drop anything that has since been marked done.
    for (const id of Array.from(pending)) {
      if (state.doneSteps[id]) pending.delete(id);
    }
  }

  for (const id of pending) {
    if (seen.has(id)) continue;
    const entry = all.get(id);
    if (!entry) continue;
    seen.add(id);
    out.push({ fromWeek: entry.weekNumber, step: entry.step });
  }
  return out;
}
