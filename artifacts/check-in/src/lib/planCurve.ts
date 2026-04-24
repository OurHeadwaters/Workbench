// The 11-year plan curve from Robin's age 39 (2026) to age 50 (April 2037).
//
// Targets are end-of-year values.  Edit the table below if your assumptions
// change — every other piece of math in the app reads from these numbers.
//
// Anchor points:
//   * Portfolio target lands at $5,000,000 by year-end 2037 (retire-by-50).
//   * Watershed ARR grows from a $200K starting line to ~$2M by 2037.
//   * Owner take-home tracks roughly half of ARR, capped to keep room for
//     reinvestment and salaries.
//   * Investing rate is owner take-home minus living expenses; the curve
//     assumes living expenses stay near today's level + modest inflation.

export type PlanYear = {
  year: number;
  age: number;
  /** End-of-year Watershed ARR target, USD. */
  arrTarget: number;
  /** End-of-year owner take-home target, USD. */
  takeHomeTarget: number;
  /** End-of-year portfolio target, USD. */
  portfolioTarget: number;
  /** Assumed annual living expenses for the year, USD. */
  livingExpensesAssumed: number;
};

export const PLAN_CURVE: readonly PlanYear[] = [
  { year: 2026, age: 39, arrTarget: 200_000,  takeHomeTarget: 120_000, portfolioTarget:   200_000, livingExpensesAssumed: 80_000 },
  { year: 2027, age: 40, arrTarget: 300_000,  takeHomeTarget: 180_000, portfolioTarget:   320_000, livingExpensesAssumed: 82_000 },
  { year: 2028, age: 41, arrTarget: 450_000,  takeHomeTarget: 250_000, portfolioTarget:   500_000, livingExpensesAssumed: 84_000 },
  { year: 2029, age: 42, arrTarget: 650_000,  takeHomeTarget: 350_000, portfolioTarget:   720_000, livingExpensesAssumed: 87_000 },
  { year: 2030, age: 43, arrTarget: 850_000,  takeHomeTarget: 450_000, portfolioTarget: 1_000_000, livingExpensesAssumed: 90_000 },
  { year: 2031, age: 44, arrTarget: 1_050_000,takeHomeTarget: 550_000, portfolioTarget: 1_350_000, livingExpensesAssumed: 92_000 },
  { year: 2032, age: 45, arrTarget: 1_250_000,takeHomeTarget: 650_000, portfolioTarget: 1_800_000, livingExpensesAssumed: 95_000 },
  { year: 2033, age: 46, arrTarget: 1_450_000,takeHomeTarget: 700_000, portfolioTarget: 2_400_000, livingExpensesAssumed: 98_000 },
  { year: 2034, age: 47, arrTarget: 1_600_000,takeHomeTarget: 750_000, portfolioTarget: 3_100_000, livingExpensesAssumed: 100_000 },
  { year: 2035, age: 48, arrTarget: 1_750_000,takeHomeTarget: 800_000, portfolioTarget: 3_900_000, livingExpensesAssumed: 103_000 },
  { year: 2036, age: 49, arrTarget: 1_900_000,takeHomeTarget: 850_000, portfolioTarget: 4_500_000, livingExpensesAssumed: 106_000 },
  { year: 2037, age: 50, arrTarget: 2_000_000,takeHomeTarget: 900_000, portfolioTarget: 5_000_000, livingExpensesAssumed: 109_000 },
];

export function getPlanForYear(year: number): PlanYear | null {
  return PLAN_CURVE.find((p) => p.year === year) ?? null;
}

export const TARGET_PORTFOLIO_USD = 5_000_000;
export const TARGET_RETIRE_DATE = "April 2037";

// Pace bucketing — read alongside getPlanForYear() to color a snapshot.
// "Green" means the snapshot is at or above the year's target line; "yellow"
// means it's within striking distance; "red" means it's materially behind.
export type PaceColor = "green" | "yellow" | "red";

export function paceFromRatio(ratio: number): PaceColor {
  if (ratio >= 0.95) return "green";
  if (ratio >= 0.8) return "yellow";
  return "red";
}

export function paceLabel(color: PaceColor): string {
  if (color === "green") return "On pace";
  if (color === "yellow") return "Slightly behind";
  return "Behind";
}
