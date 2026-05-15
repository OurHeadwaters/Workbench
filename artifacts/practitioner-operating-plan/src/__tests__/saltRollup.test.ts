/**
 * saltRollup.test.ts
 *
 * Unit tests for the prior-quarter rollup and auto-trigger helpers.
 * Guards against regressions in the Rule 02 (wholesale reprice / drop trigger)
 * signal derivation.
 *
 * Scenarios covered:
 *   - quarterMonths / priorQuarterId: boundary math
 *   - computePriorChain: contiguous chain, gapped chain, cross-quarter isolation
 *   - channelMonthMetrics: aggregation and CM% calculation
 *   - autoPrevQuarterUnder: under-floor true/false, incomplete quarter, exact floor boundary
 */

import { describe, it, expect } from "vitest";
import type { SaltCloseRecord } from "@/lib/saltClose";
import {
  quarterMonths,
  priorQuarterId,
  computePriorChain,
  channelMonthMetrics,
  autoPrevQuarterUnder,
} from "@/lib/saltRollup";

// ── Test-data factory ─────────────────────────────────────────────────────────

function makeClose(
  month: string,
  revenue: number,
  expenses: number,
): SaltCloseRecord {
  return {
    month,
    revenue,
    expenses,
    net: revenue - expenses,
    filedAt: new Date().toISOString(),
  };
}

const FLOOR = 1_800; // matches SALT_BASELINE_NET

// ── quarterMonths ─────────────────────────────────────────────────────────────

describe("quarterMonths", () => {
  it("returns the three months for Q1", () => {
    expect(quarterMonths("2026-Q1")).toEqual(["2026-01", "2026-02", "2026-03"]);
  });

  it("returns the three months for Q2", () => {
    expect(quarterMonths("2026-Q2")).toEqual(["2026-04", "2026-05", "2026-06"]);
  });

  it("returns the three months for Q3", () => {
    expect(quarterMonths("2026-Q3")).toEqual(["2026-07", "2026-08", "2026-09"]);
  });

  it("returns the three months for Q4", () => {
    expect(quarterMonths("2026-Q4")).toEqual(["2026-10", "2026-11", "2026-12"]);
  });

  it("returns empty array for malformed id", () => {
    expect(quarterMonths("bad")).toEqual([]);
  });
});

// ── priorQuarterId ────────────────────────────────────────────────────────────

describe("priorQuarterId", () => {
  it("steps back within the same year", () => {
    expect(priorQuarterId("2026-Q2")).toBe("2026-Q1");
    expect(priorQuarterId("2026-Q3")).toBe("2026-Q2");
    expect(priorQuarterId("2026-Q4")).toBe("2026-Q3");
  });

  it("wraps Q1 back to Q4 of the prior year", () => {
    expect(priorQuarterId("2026-Q1")).toBe("2025-Q4");
    expect(priorQuarterId("2027-Q1")).toBe("2026-Q4");
  });

  it("returns empty string for malformed id", () => {
    expect(priorQuarterId("bad")).toBe("");
  });
});

// ── computePriorChain ─────────────────────────────────────────────────────────

describe("computePriorChain", () => {
  it("returns all three records when the prior quarter is fully filed (contiguous chain)", () => {
    const closes = [
      makeClose("2026-01", 3_000, 1_000),
      makeClose("2026-02", 3_200, 1_100),
      makeClose("2026-03", 2_900, 1_050),
    ];
    const chain = computePriorChain(closes, "2026-Q2");
    expect(chain.map((r) => r.month)).toEqual(["2026-01", "2026-02", "2026-03"]);
  });

  it("stops at the first missing slot (gapped chain)", () => {
    // month-2 is missing
    const closes = [
      makeClose("2026-01", 3_000, 1_000),
      // 2026-02 intentionally absent
      makeClose("2026-03", 2_900, 1_050),
    ];
    const chain = computePriorChain(closes, "2026-Q2");
    expect(chain.map((r) => r.month)).toEqual(["2026-01"]);
  });

  it("returns only month-1 when only month-1 is filed", () => {
    const closes = [makeClose("2026-01", 3_000, 1_000)];
    const chain = computePriorChain(closes, "2026-Q2");
    expect(chain).toHaveLength(1);
    expect(chain[0].month).toBe("2026-01");
  });

  it("returns empty array when no prior-quarter months are filed", () => {
    const closes = [
      makeClose("2026-04", 3_000, 1_000), // current quarter only
    ];
    const chain = computePriorChain(closes, "2026-Q2");
    expect(chain).toHaveLength(0);
  });

  it("excludes current-quarter month-3 — only prior-quarter months are included", () => {
    // All three Q1 months are filed AND Q2-month-3 (June) has been pre-filed.
    // The chain for Q2 must contain exactly the Q1 months; June must not appear.
    const closes = [
      makeClose("2026-01", 3_000, 1_000), // Q1-M1 ✓
      makeClose("2026-02", 3_200, 1_100), // Q1-M2 ✓
      makeClose("2026-03", 2_900, 1_050), // Q1-M3 ✓ (prior quarter month-3)
      makeClose("2026-06", 4_000, 1_500), // Q2-M3 — must NOT appear in chain
    ];
    const chain = computePriorChain(closes, "2026-Q2");
    const months = chain.map((r) => r.month);
    expect(months).toEqual(["2026-01", "2026-02", "2026-03"]);
    expect(months).not.toContain("2026-06");
  });

  it("works correctly across a year boundary (Q1 prior = Q4 of previous year)", () => {
    const closes = [
      makeClose("2025-10", 3_000, 1_000),
      makeClose("2025-11", 3_100, 1_050),
      makeClose("2025-12", 2_800, 1_000),
    ];
    const chain = computePriorChain(closes, "2026-Q1");
    expect(chain.map((r) => r.month)).toEqual([
      "2025-10",
      "2025-11",
      "2025-12",
    ]);
  });

  it("ignores extra closes from other quarters that are not the prior quarter", () => {
    const closes = [
      makeClose("2025-07", 3_000, 1_000), // Q3 2025 — two quarters back, ignored
      makeClose("2025-10", 2_000, 1_200), // Q4 2025 — prior quarter
      makeClose("2025-11", 1_900, 1_100), // Q4 2025
      makeClose("2026-01", 3_500, 1_000), // Q1 2026 — current quarter
    ];
    const chain = computePriorChain(closes, "2026-Q1");
    expect(chain.map((r) => r.month)).toEqual(["2025-10", "2025-11"]);
  });
});

// ── channelMonthMetrics ───────────────────────────────────────────────────────

describe("channelMonthMetrics", () => {
  it("sums revenue, expenses, and net across all records", () => {
    const closes = [
      makeClose("2026-01", 3_000, 1_000), // net 2000
      makeClose("2026-02", 3_200, 1_400), // net 1800
      makeClose("2026-03", 2_600, 1_200), // net 1400
    ];
    const m = channelMonthMetrics(closes);
    expect(m.totalRevenue).toBe(8_800);
    expect(m.totalExpenses).toBe(3_600);
    expect(m.totalNet).toBe(5_200);
  });

  it("computes cmPercent as net / revenue", () => {
    const closes = [makeClose("2026-01", 4_000, 1_000)]; // net 3000, CM% 0.75
    const m = channelMonthMetrics(closes);
    expect(m.cmPercent).toBeCloseTo(0.75, 5);
  });

  it("returns null cmPercent when total revenue is zero", () => {
    const closes = [makeClose("2026-01", 0, 0)];
    const m = channelMonthMetrics(closes);
    expect(m.cmPercent).toBeNull();
  });

  it("returns zero totals and null cmPercent for an empty array", () => {
    const m = channelMonthMetrics([]);
    expect(m.totalRevenue).toBe(0);
    expect(m.totalNet).toBe(0);
    expect(m.cmPercent).toBeNull();
  });

  it("handles negative net (expenses exceed revenue)", () => {
    const closes = [makeClose("2026-01", 1_000, 1_500)]; // net −500
    const m = channelMonthMetrics(closes);
    expect(m.totalNet).toBe(-500);
    expect(m.cmPercent).toBeCloseTo(-0.5, 5);
  });
});

// ── autoPrevQuarterUnder ──────────────────────────────────────────────────────

describe("autoPrevQuarterUnder", () => {
  it("returns true when prior quarter net is below floor × 3", () => {
    // Floor = 1800, quarterly floor = 5400. Net: 1500 + 1400 + 1000 = 3900 < 5400 → true.
    const closes = [
      makeClose("2026-01", 2_500, 1_000), // net 1500
      makeClose("2026-02", 2_400, 1_000), // net 1400
      makeClose("2026-03", 2_300, 1_300), // net 1000
    ];
    expect(autoPrevQuarterUnder(closes, "2026-Q2", FLOOR)).toBe(true);
  });

  it("returns false when prior quarter net meets or exceeds floor × 3", () => {
    // Floor = 1800, quarter floor = 5400. Total net = 5400 → at floor, not under.
    const closes = [
      makeClose("2026-01", 3_000, 1_200), // net 1800
      makeClose("2026-02", 3_000, 1_200), // net 1800
      makeClose("2026-03", 3_000, 1_200), // net 1800  → total 5400 = 5400 → false
    ];
    expect(autoPrevQuarterUnder(closes, "2026-Q2", FLOOR)).toBe(false);
  });

  it("returns false (cannot trigger) when the prior quarter has fewer than 3 months filed", () => {
    const closes = [
      makeClose("2026-01", 1_000, 800), // net 200 — badly under, but only 1 month
    ];
    expect(autoPrevQuarterUnder(closes, "2026-Q2", FLOOR)).toBe(false);
  });

  it("returns false when only 2 of 3 prior-quarter months are filed", () => {
    const closes = [
      makeClose("2026-01", 1_500, 1_400), // net 100
      makeClose("2026-02", 1_500, 1_400), // net 100  — both under, but incomplete
    ];
    expect(autoPrevQuarterUnder(closes, "2026-Q2", FLOOR)).toBe(false);
  });

  it("returns false when no prior-quarter closes exist", () => {
    const closes: SaltCloseRecord[] = [];
    expect(autoPrevQuarterUnder(closes, "2026-Q2", FLOOR)).toBe(false);
  });

  it("triggers correctly across the year boundary (Q1 prior = Q4 prev year)", () => {
    // Q4 2025: all 3 months under floor
    const closes = [
      makeClose("2025-10", 2_000, 1_200), // net 800
      makeClose("2025-11", 2_100, 1_300), // net 800
      makeClose("2025-12", 2_200, 1_400), // net 800  → total 2400 < 5400 → true
    ];
    expect(autoPrevQuarterUnder(closes, "2026-Q1", FLOOR)).toBe(true);
  });

  it("is not triggered by the exact floor boundary (net == floor × 3 is not under)", () => {
    const closes = [
      makeClose("2026-01", 3_600, 1_800), // net 1800
      makeClose("2026-02", 3_600, 1_800), // net 1800
      makeClose("2026-03", 3_600, 1_800), // net 1800  → total exactly 5400
    ];
    expect(autoPrevQuarterUnder(closes, "2026-Q2", FLOOR)).toBe(false);
  });

  it("is triggered when net is 1 cent below the quarterly floor", () => {
    const closes = [
      makeClose("2026-01", 3_600, 1_800),       // net 1800
      makeClose("2026-02", 3_600, 1_800),       // net 1800
      makeClose("2026-03", 3_600.00, 1_800.01), // net 1799.99 → total 5399.99 < 5400
    ];
    expect(autoPrevQuarterUnder(closes, "2026-Q2", FLOOR)).toBe(true);
  });
});
