import { describe, it, expect } from "vitest";
import {
  PLAN_CURVE,
  TARGET_PORTFOLIO_USD,
  TARGET_RETIRE_DATE,
  TARGET_RETIRE_YEAR,
  TARGET_RETIRE_AGE,
  ASSUMED_REAL_RETURN,
  paceFromRatio,
} from "../planCurve";

/**
 * Locked-number guard tests for the Annual Plan Check-in dashboard.
 *
 * Source of truth: src/lib/planCurve.ts header comment — the founder's
 * 11-year retire-by-50 plan, anchored on age 39 (2026) → age 50 (2037).
 *
 * NOTE on scope vs. task #149's V2 spec:
 *   Task #149 locked the Practitioner's Guide V2 numbers (Salts P&L,
 *   $22k 807 bill, $115k/mo agency fee, $645,444 18-month surplus,
 *   $74k Brightside surplus, $361k personal cash). The Annual Plan
 *   Check-in is a *different* tracker — it is the founder's age 39 → 50
 *   retirement curve (Watershed ARR, owner take-home, portfolio, age-50
 *   target). The V2 numbers are not currently rendered here.
 *
 *   What this dashboard *does* render are its own canonical anchors —
 *   the PLAN_CURVE table, the $5M / age-50 / 2037 targets, and the
 *   green/yellow/red pace thresholds. A typo in any of those misleads
 *   the founder just as surely as a typo in the V2 deck would, so we
 *   guard them here with the same rigour.
 *
 *   If the V2 numbers ever land in this dashboard (e.g. as a 2026
 *   ARR floor of $115k/mo × buyer ramp), add a parallel describe()
 *   block below and assert against the canonical V2 figures.
 */

describe("Annual Plan Check-in — top-level retirement targets", () => {
  it("portfolio target at age 50 is $5,000,000", () => {
    expect(TARGET_PORTFOLIO_USD).toBe(5_000_000);
  });

  it("retire-by date is April 2037 at age 50", () => {
    expect(TARGET_RETIRE_DATE).toBe("April 2037");
    expect(TARGET_RETIRE_YEAR).toBe(2037);
    expect(TARGET_RETIRE_AGE).toBe(50);
  });

  it("long-run real-return assumption is 7%", () => {
    expect(ASSUMED_REAL_RETURN).toBe(0.07);
  });
});

describe("PLAN_CURVE — 11-year glidepath, age 39 → 50", () => {
  it("covers exactly 12 years (2026 through 2037 inclusive)", () => {
    expect(PLAN_CURVE).toHaveLength(12);
    expect(PLAN_CURVE[0].year).toBe(2026);
    expect(PLAN_CURVE[PLAN_CURVE.length - 1].year).toBe(2037);
  });

  it("ages run 39 → 50 in lockstep with the years", () => {
    expect(PLAN_CURVE[0].age).toBe(39);
    expect(PLAN_CURVE[PLAN_CURVE.length - 1].age).toBe(50);
    for (const row of PLAN_CURVE) {
      expect(row.age).toBe(row.year - 1987);
    }
  });

  it("starts in 2026 with $200k ARR / $120k take-home / $200k portfolio / $80k living", () => {
    const start = PLAN_CURVE[0];
    expect(start.year).toBe(2026);
    expect(start.arrTarget).toBe(200_000);
    expect(start.takeHomeTarget).toBe(120_000);
    expect(start.portfolioTarget).toBe(200_000);
    expect(start.livingExpensesAssumed).toBe(80_000);
  });

  it("ends in 2037 with $2M ARR / $900k take-home / $5M portfolio / $109k living", () => {
    const end = PLAN_CURVE[PLAN_CURVE.length - 1];
    expect(end.year).toBe(2037);
    expect(end.arrTarget).toBe(2_000_000);
    expect(end.takeHomeTarget).toBe(900_000);
    expect(end.portfolioTarget).toBe(5_000_000);
    expect(end.livingExpensesAssumed).toBe(109_000);
  });

  it("final-year portfolio target equals TARGET_PORTFOLIO_USD (the two anchors agree)", () => {
    const end = PLAN_CURVE[PLAN_CURVE.length - 1];
    expect(end.portfolioTarget).toBe(TARGET_PORTFOLIO_USD);
  });

  it("ARR climbs monotonically year over year (no accidental dips)", () => {
    for (let i = 1; i < PLAN_CURVE.length; i++) {
      expect(PLAN_CURVE[i].arrTarget).toBeGreaterThan(PLAN_CURVE[i - 1].arrTarget);
    }
  });

  it("portfolio climbs monotonically year over year (no accidental dips)", () => {
    for (let i = 1; i < PLAN_CURVE.length; i++) {
      expect(PLAN_CURVE[i].portfolioTarget).toBeGreaterThan(
        PLAN_CURVE[i - 1].portfolioTarget,
      );
    }
  });

  it("targetAnnualInvestingRate ≈ (takeHome − living) / takeHome for every row", () => {
    for (const row of PLAN_CURVE) {
      const expected = (row.takeHomeTarget - row.livingExpensesAssumed) / row.takeHomeTarget;
      expect(row.targetAnnualInvestingRate).toBeCloseTo(expected, 2);
    }
  });
});

describe("Pace bucket thresholds — green / yellow / red", () => {
  // These thresholds are the heart of the dashboard. Per the
  // planCurve.ts header: green only at or above the year's target
  // line; yellow 80–99%; red below 80%.
  it("green only fires at or above the target line (≥ 1.0)", () => {
    expect(paceFromRatio(1.0)).toBe("green");
    expect(paceFromRatio(1.01)).toBe("green");
    expect(paceFromRatio(0.999)).not.toBe("green");
  });

  it("yellow covers 0.80 ≤ ratio < 1.0", () => {
    expect(paceFromRatio(0.8)).toBe("yellow");
    expect(paceFromRatio(0.99)).toBe("yellow");
    expect(paceFromRatio(0.799)).not.toBe("yellow");
  });

  it("red covers ratio < 0.80", () => {
    expect(paceFromRatio(0.799)).toBe("red");
    expect(paceFromRatio(0)).toBe("red");
    expect(paceFromRatio(-0.5)).toBe("red");
  });
});
