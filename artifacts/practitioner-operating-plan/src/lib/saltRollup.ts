/**
 * saltRollup.ts
 *
 * Pure helpers for the prior-quarter rollup and auto-trigger logic used by
 * Rule 02 (wholesale reprice / drop trigger).
 *
 * Rule 02 fires when the PREVIOUS complete calendar quarter's net was below
 * the monthly floor × 3. These functions derive that signal automatically from
 * the filed SaltCloseRecord history — no manual checkbox required.
 *
 * Design constraints (all enforced here and covered by unit tests):
 *   - computePriorChain is strictly bounded to the prior calendar quarter's
 *     three month slots — current-quarter closes never bleed into it.
 *   - The chain stops at the first missing slot (gap = incomplete quarter).
 *   - autoPrevQuarterUnder returns false unless all three prior-quarter slots
 *     are present (incomplete quarter → cannot determine → not triggered).
 */

import type { SaltCloseRecord } from "./saltClose";

// ── Quarter utilities ─────────────────────────────────────────────────────────

/**
 * Returns the three YYYY-MM month strings that belong to a quarter ID.
 * e.g. "2026-Q1" → ["2026-01","2026-02","2026-03"]
 *      "2025-Q4" → ["2025-10","2025-11","2025-12"]
 */
export function quarterMonths(quarterId: string): string[] {
  const m = quarterId.match(/^(\d{4})-Q([1-4])$/);
  if (!m) return [];
  const year = parseInt(m[1], 10);
  const q = parseInt(m[2], 10);
  const firstMonth = (q - 1) * 3 + 1;
  return [0, 1, 2].map((offset) => {
    const month = firstMonth + offset;
    return `${year}-${String(month).padStart(2, "0")}`;
  });
}

/**
 * Returns the quarter ID immediately before the given one.
 * e.g. "2026-Q2" → "2026-Q1"
 *      "2026-Q1" → "2025-Q4"
 */
export function priorQuarterId(quarterId: string): string {
  const m = quarterId.match(/^(\d{4})-Q([1-4])$/);
  if (!m) return "";
  const year = parseInt(m[1], 10);
  const q = parseInt(m[2], 10);
  if (q > 1) return `${year}-Q${q - 1}`;
  return `${year - 1}-Q4`;
}

// ── Chain builder ─────────────────────────────────────────────────────────────

/**
 * Builds the contiguous run of filed close records that form the prior
 * calendar quarter relative to `currentQuarterId`.
 *
 * Rules enforced:
 *   1. Only months belonging to the prior calendar quarter are considered —
 *      current-quarter month-3 (or any current-quarter close) is excluded.
 *   2. Months are iterated in calendar order (slot 1 → 2 → 3).
 *   3. The chain stops at the first slot that has no filed close (gap).
 *
 * Returns an empty array when no prior-quarter closes exist, and a partial
 * array when the prior quarter is incomplete.
 */
export function computePriorChain(
  closes: SaltCloseRecord[],
  currentQuarterId: string,
): SaltCloseRecord[] {
  const priorQId = priorQuarterId(currentQuarterId);
  if (!priorQId) return [];

  const slots = quarterMonths(priorQId);
  const closeMap = new Map(closes.map((c) => [c.month, c]));

  const chain: SaltCloseRecord[] = [];
  for (const slot of slots) {
    const rec = closeMap.get(slot);
    if (!rec) break;
    chain.push(rec);
  }
  return chain;
}

// ── Aggregate metrics ─────────────────────────────────────────────────────────

export interface QTDMetrics {
  totalRevenue: number;
  totalExpenses: number;
  totalNet: number;
  /** Contribution margin as a ratio (net / revenue). null when revenue is 0. */
  cmPercent: number | null;
}

/**
 * Aggregates a set of close records into quarter-to-date (QTD) metrics.
 * Works for any slice of records — caller is responsible for scoping to the
 * relevant quarter window.
 */
export function channelMonthMetrics(closes: SaltCloseRecord[]): QTDMetrics {
  const totalRevenue = closes.reduce((s, r) => s + r.revenue, 0);
  const totalExpenses = closes.reduce((s, r) => s + r.expenses, 0);
  const totalNet = closes.reduce((s, r) => s + r.net, 0);
  return {
    totalRevenue,
    totalExpenses,
    totalNet,
    cmPercent: totalRevenue > 0 ? totalNet / totalRevenue : null,
  };
}

// ── Auto-trigger derivation ───────────────────────────────────────────────────

/**
 * Automatically derives whether the prior complete quarter was under the
 * monthly floor (the "prev quarter under floor?" signal for Rule 02).
 *
 * Returns true  when all three prior-quarter slots are filed AND their
 *               combined net is below `monthlyFloor × 3`.
 * Returns false when the prior quarter is incomplete (fewer than 3 months
 *               filed) — an incomplete quarter cannot trigger the rule.
 */
export function autoPrevQuarterUnder(
  closes: SaltCloseRecord[],
  currentQuarterId: string,
  monthlyFloor: number,
): boolean {
  const chain = computePriorChain(closes, currentQuarterId);
  if (chain.length < 3) return false;
  const { totalNet } = channelMonthMetrics(chain);
  return totalNet < monthlyFloor * 3;
}
