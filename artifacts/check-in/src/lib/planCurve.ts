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
  /**
   * Target share of owner take-home that should be invested in a given
   * year — i.e. (takeHomeTarget − livingExpensesAssumed) / takeHomeTarget.
   * Stored explicitly so it shows up as a first-class plan dimension and
   * stays correct even if you fork the math later.
   */
  targetAnnualInvestingRate: number;
};

export const PLAN_CURVE: readonly PlanYear[] = [
  { year: 2026, age: 39, arrTarget: 200_000,  takeHomeTarget: 120_000, portfolioTarget:   200_000, livingExpensesAssumed: 80_000,  targetAnnualInvestingRate: 0.333 },
  { year: 2027, age: 40, arrTarget: 300_000,  takeHomeTarget: 180_000, portfolioTarget:   320_000, livingExpensesAssumed: 82_000,  targetAnnualInvestingRate: 0.544 },
  { year: 2028, age: 41, arrTarget: 450_000,  takeHomeTarget: 250_000, portfolioTarget:   500_000, livingExpensesAssumed: 84_000,  targetAnnualInvestingRate: 0.664 },
  { year: 2029, age: 42, arrTarget: 650_000,  takeHomeTarget: 350_000, portfolioTarget:   720_000, livingExpensesAssumed: 87_000,  targetAnnualInvestingRate: 0.751 },
  { year: 2030, age: 43, arrTarget: 850_000,  takeHomeTarget: 450_000, portfolioTarget: 1_000_000, livingExpensesAssumed: 90_000,  targetAnnualInvestingRate: 0.800 },
  { year: 2031, age: 44, arrTarget: 1_050_000,takeHomeTarget: 550_000, portfolioTarget: 1_350_000, livingExpensesAssumed: 92_000,  targetAnnualInvestingRate: 0.833 },
  { year: 2032, age: 45, arrTarget: 1_250_000,takeHomeTarget: 650_000, portfolioTarget: 1_800_000, livingExpensesAssumed: 95_000,  targetAnnualInvestingRate: 0.854 },
  { year: 2033, age: 46, arrTarget: 1_450_000,takeHomeTarget: 700_000, portfolioTarget: 2_400_000, livingExpensesAssumed: 98_000,  targetAnnualInvestingRate: 0.860 },
  { year: 2034, age: 47, arrTarget: 1_600_000,takeHomeTarget: 750_000, portfolioTarget: 3_100_000, livingExpensesAssumed: 100_000, targetAnnualInvestingRate: 0.867 },
  { year: 2035, age: 48, arrTarget: 1_750_000,takeHomeTarget: 800_000, portfolioTarget: 3_900_000, livingExpensesAssumed: 103_000, targetAnnualInvestingRate: 0.871 },
  { year: 2036, age: 49, arrTarget: 1_900_000,takeHomeTarget: 850_000, portfolioTarget: 4_500_000, livingExpensesAssumed: 106_000, targetAnnualInvestingRate: 0.875 },
  { year: 2037, age: 50, arrTarget: 2_000_000,takeHomeTarget: 900_000, portfolioTarget: 5_000_000, livingExpensesAssumed: 109_000, targetAnnualInvestingRate: 0.879 },
];

export function getPlanForYear(year: number): PlanYear | null {
  return PLAN_CURVE.find((p) => p.year === year) ?? null;
}

export const TARGET_PORTFOLIO_USD = 5_000_000;
export const TARGET_RETIRE_DATE = "April 2037";
export const TARGET_RETIRE_YEAR = 2037;
export const TARGET_RETIRE_AGE = 50;
/** Long-run real-return assumption for the "projected at 50" calc. */
export const ASSUMED_REAL_RETURN = 0.07;

// Pace bucketing — read alongside getPlanForYear() to color a snapshot.
// Per spec: green only when at or above the year's target line, yellow
// 80–99%, red below 80%.  These thresholds are the heart of the dashboard,
// so be very strict about them.
export type PaceColor = "green" | "yellow" | "red";

export function paceFromRatio(ratio: number): PaceColor {
  if (ratio >= 1.0) return "green";
  if (ratio >= 0.8) return "yellow";
  return "red";
}

export function paceLabel(color: PaceColor): string {
  if (color === "green") return "On pace";
  if (color === "yellow") return "Slightly behind";
  return "Behind";
}

/**
 * Whole years between the snapshot year and Robin's age-50 year (2037).
 * Returns 0 if the snapshot is from 2037 or later — the plan is done.
 */
export function yearsToRetirement(snapshotYear: number): number {
  return Math.max(0, TARGET_RETIRE_YEAR - snapshotYear);
}

/**
 * Project the portfolio forward to age 50 assuming Robin's *current*
 * investing rate continues unchanged and the portfolio earns
 * `realReturn` per year (default 7% real, the standard long-run U.S.
 * equity assumption after inflation).
 *
 * Annual contribution = max(0, ownerTakeHome − annualLivingExpenses).
 * Each contribution is assumed to land at year-end (ordinary annuity);
 * close enough for a once-a-year planning tool.
 *
 * Returns null if there are no years left to project.
 */
export function projectPortfolioAtFifty(args: {
  currentPortfolio: number;
  annualContribution: number;
  yearsRemaining: number;
  realReturn?: number;
}): number | null {
  const { currentPortfolio, annualContribution, yearsRemaining } = args;
  const r = args.realReturn ?? ASSUMED_REAL_RETURN;
  if (yearsRemaining <= 0) return currentPortfolio;
  const growthFactor = Math.pow(1 + r, yearsRemaining);
  const contributionFv =
    r === 0
      ? annualContribution * yearsRemaining
      : (annualContribution * (growthFactor - 1)) / r;
  return currentPortfolio * growthFactor + contributionFv;
}
