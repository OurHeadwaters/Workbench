/**
 * v7.ts — Northern Band V7 rate model adapter.
 *
 * Thin re-export layer. All numeric constants are sourced from the canonical
 * V7 model in @workspace/practitioners-guide-v2/src/data/v7.ts and V7_PHASE1.
 * Milestone dates are sourced from plan2026.ts.
 *
 * Do not hardcode financial figures here. Edit the canonical source instead:
 *   artifacts/practitioners-guide-v2/src/data/v7.ts
 */

import {
  v7TotalMonthlyBilled,
  v7BobbieDrawMonthly,
  v7TylerCostMonthly,
  v7OverheadsMonthly,
  v7MonthlySurplus,
  v7TermMonths,
  v7Phase2Surplus,
  v7TithePct,
  V7_PHASE1,
} from "@workspace/practitioners-guide-v2/src/data/v7";

import {
  BRIDGE_CAPITAL_DEADLINE,
  PLAN_B_HARD_DEADLINE,
  SUPPLY_CHAIN_TARGET_YEAR,
  SCENARIO_A_COST_BASIS_MONTHLY,
} from "@/data/plan2026";

// ── Re-exports with clean local names ────────────────────────────────────────

export const TOTAL_MONTHLY_BILLED  = v7TotalMonthlyBilled;   // 39,200
export const BOBBIE_DRAW_MONTHLY   = v7BobbieDrawMonthly;    // 16,800
export const TYLER_COST_MONTHLY    = v7TylerCostMonthly;     // 11,200
export const OVERHEADS_MONTHLY     = v7OverheadsMonthly;     // 1,292
export const MONTHLY_SURPLUS       = v7MonthlySurplus;       // 9,908
export const TERM_MONTHS           = v7TermMonths;           // 12
export const ANNUAL_SURPLUS        = v7Phase2Surplus;        // 118,896

export const PHASE1_FLAT_FEE          = V7_PHASE1.flatFee;        // 28,000
export const PHASE1_TITHE             = V7_PHASE1.tithe;           // 2,800
export const PHASE1_POST_TITHE        = V7_PHASE1.postTithe;       // 25,200
export const PHASE1_BOBBIE_COST_MIN   = V7_PHASE1.bobbieCostMin;   // 25,200 (6 wks — break-even)
export const PHASE1_BOBBIE_COST_MAX   = V7_PHASE1.bobbieCostMax;   // 33,600 (8 wks — max gap)
export const PHASE1_GAP_MIN           = V7_PHASE1.netVsCostMin;    // 0      (6 wks)
export const PHASE1_GAP_MAX           = V7_PHASE1.netVsCostMax;    // −8,400 (8 wks)
export const PHASE1_WEEKS_MIN         = V7_PHASE1.weeksMin;        // 6
export const PHASE1_WEEKS_MAX         = V7_PHASE1.weeksMax;        // 8
export const PHASE1_HOURS_PER_WEEK    = V7_PHASE1.hoursPerWeek;    // 40
export const PHASE1_TITHE_PCT         = v7TithePct;

// ── Milestones (sourced from plan2026.ts) ─────────────────────────────────────

export const MILESTONE_BRIDGE_DEADLINE       = BRIDGE_CAPITAL_DEADLINE;      // "2026-05-30"
export const MILESTONE_HARD_DECISION         = PLAN_B_HARD_DEADLINE;         // "2026-07-31"
export const MILESTONE_807_TARGET            = SUPPLY_CHAIN_TARGET_YEAR;     // "2027"
export const MILESTONE_SCENARIO_A_FLOOR      = SCENARIO_A_COST_BASIS_MONTHLY; // 48,000

// ── Formatting helpers ────────────────────────────────────────────────────────

/** Format a positive or negative number as "$X,XXX" or "−$X,XXX". */
export function fmtDollar(n: number): string {
  const abs = Math.abs(Math.round(n));
  const formatted = "$" + abs.toLocaleString("en-CA");
  return n < 0 ? "−" + formatted : formatted;
}

/** Format a number as "$X,XXX / mo". */
export function fmtMonthly(n: number): string {
  return fmtDollar(n) + " / mo";
}

/** Format a number as "$X,XXX / yr". */
export function fmtAnnual(n: number): string {
  return fmtDollar(n) + " / yr";
}

/**
 * Format an approximate annual figure, flooring to the nearest $1,000.
 * Preserves the original ~$237,000 presentation for Phase 3 projections.
 */
export function fmtApproxAnnual(n: number): string {
  const floored = Math.floor(n / 1_000) * 1_000;
  return "~" + fmtAnnual(floored);
}

/**
 * Format a milestone ISO date (YYYY-MM-DD) as "Month D, YYYY".
 * e.g. "2026-05-30" → "May 30, 2026"
 * e.g. "2026-07-31" → "July 31, 2026"
 */
export function fmtMilestoneDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}
