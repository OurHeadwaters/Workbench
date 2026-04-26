import { describe, it, expect } from "vitest";

import { DEFAULT_STATE } from "../storage";
import type { AppState } from "../storage";
import {
  computeSecondAnchorScenarios,
  Y1_HONEST_GAP,
  Y1_HONEST_REVENUE,
  Y1_HONEST_COST_BASIS,
} from "../budgetMath";

function withEdit(state: AppState, id: string, value: number): AppState {
  return {
    ...state,
    costReview: {
      ...state.costReview,
      [id]: { status: "edited", editedValue: value, note: "" },
    },
  };
}

describe("Second-anchor scenarios — locked Y1 gap inputs", () => {
  it("Y1 gap is the published $127,202 figure (cost basis − revenue)", () => {
    expect(Y1_HONEST_REVENUE).toBe(446598);
    expect(Y1_HONEST_COST_BASIS).toBe(573800);
    expect(Y1_HONEST_GAP).toBe(127202);
    expect(Y1_HONEST_COST_BASIS - Y1_HONEST_REVENUE).toBe(Y1_HONEST_GAP);
  });

  it("install-per-reserve and retainer flow from the cross-reserve registry inputs", () => {
    // Defaults: 30 × $3,500 + 24 × $1,800 = $148,200; retainer = $30,000/yr.
    const s = computeSecondAnchorScenarios(DEFAULT_STATE);
    expect(s.installPerReserve).toBe(148200);
    expect(s.retainerAnnual).toBe(30000);
    expect(s.gap).toBe(Y1_HONEST_GAP);
  });
});

describe("Second-anchor scenarios — Shape A (single install, no retainer)", () => {
  it("$148,200 install carries the gap on its own with a $20,998 surplus", () => {
    const s = computeSecondAnchorScenarios(DEFAULT_STATE);
    expect(s.scenarioInstallOnly.inflow).toBe(148200);
    expect(s.scenarioInstallOnly.surplus).toBe(148200 - Y1_HONEST_GAP);
    expect(s.scenarioInstallOnly.surplus).toBe(20998);
    expect(s.scenarioInstallOnly.y2Carry).toBe(0);
  });
});

describe("Second-anchor scenarios — Shape B (install + retainer at M6)", () => {
  it("M6 install completes M9; retainer pro-rates for 3 months in Y1 ($7,500)", () => {
    const s = computeSecondAnchorScenarios(DEFAULT_STATE);
    expect(s.scenarioInstallPlusRetainer.landMonth).toBe(6);
    expect(s.scenarioInstallPlusRetainer.installInflow).toBe(148200);
    expect(s.scenarioInstallPlusRetainer.retainerMonthsActive).toBe(3);
    expect(s.scenarioInstallPlusRetainer.retainerInflow).toBe(7500);
    expect(s.scenarioInstallPlusRetainer.totalInflow).toBe(155700);
    // 155,700 − 127,202 = 28,498 surplus. Y2 carry = full $30k/yr retainer.
    expect(s.scenarioInstallPlusRetainer.surplus).toBe(28498);
    expect(s.scenarioInstallPlusRetainer.y2Carry).toBe(30000);
  });
});

describe("Second-anchor scenarios — Shape C (Tier-2 stack)", () => {
  it("realistic 4–6 sub portfolio at $300–800/mo brackets the inflow honestly", () => {
    const s = computeSecondAnchorScenarios(DEFAULT_STATE);
    // 4 × $300 × 12 = $14,400  ;  6 × $800 × 12 = $57,600
    expect(s.scenarioTier2Stack.realisticInflowLow).toBe(14400);
    expect(s.scenarioTier2Stack.realisticInflowHigh).toBe(57600);
    // Even at the high end, 6×$800 doesn't fully replace the install:
    // it covers <50% of the $127,202 Y1 gap on its own.
    expect(s.scenarioTier2Stack.realisticInflowHigh).toBeLessThan(Y1_HONEST_GAP);
  });

  it("subs needed at $500/mo and $800/mo round up to fully cover the gap", () => {
    const s = computeSecondAnchorScenarios(DEFAULT_STATE);
    // 127,202 / (500 × 12) = 21.2 → 22 ; 127,202 / (800 × 12) = 13.25 → 14
    expect(s.scenarioTier2Stack.subsNeededAtMid).toBe(22);
    expect(s.scenarioTier2Stack.subsNeededAtHigh).toBe(14);
  });
});

describe("Second-anchor scenarios — timing strip (M3 / M6 / M9 land)", () => {
  it("M3 land closes the gap with the largest surplus (6 mo retainer)", () => {
    const s = computeSecondAnchorScenarios(DEFAULT_STATE);
    const m3 = s.timing.find((t) => t.landMonth === 3);
    expect(m3).toBeDefined();
    expect(m3!.installCompletedInY1).toBe(true);
    expect(m3!.installInflow).toBe(148200);
    expect(m3!.retainerMonthsActive).toBe(6);
    expect(m3!.retainerInflow).toBe(15000);
    expect(m3!.totalInflow).toBe(163200);
    expect(m3!.closesGap).toBe(true);
    expect(m3!.remainingGap).toBe(Y1_HONEST_GAP - 163200);
  });

  it("M9 land is the latest month the install still completes inside Y1", () => {
    const s = computeSecondAnchorScenarios(DEFAULT_STATE);
    const m9 = s.timing.find((t) => t.landMonth === 9);
    expect(m9).toBeDefined();
    expect(m9!.installCompletedInY1).toBe(true);
    expect(m9!.installInflow).toBe(148200);
    expect(m9!.retainerMonthsActive).toBe(0);
    expect(m9!.totalInflow).toBe(148200);
    expect(m9!.closesGap).toBe(true);
  });

  it("an M10 land would spill the install into Y2 and leave the gap open", () => {
    // Direct math check on the same shape the timing helper computes:
    // 12-week install starting M10 ⇒ 2/3 of $148,200 in Y1 = $98,800;
    // no retainer in Y1. That doesn't close the $127,202 gap.
    const s = computeSecondAnchorScenarios(DEFAULT_STATE);
    const partialInstall = (2 / 3) * s.installPerReserve;
    expect(partialInstall).toBeLessThan(Y1_HONEST_GAP);
  });

  it("each timing variant matches Shape B's M6 baseline at the M6 column", () => {
    // The Shape B card and the M6 column read the same number — this
    // pins down that the slide doesn't accidentally double-count.
    const s = computeSecondAnchorScenarios(DEFAULT_STATE);
    const m6 = s.timing.find((t) => t.landMonth === 6);
    expect(m6!.totalInflow).toBe(s.scenarioInstallPlusRetainer.totalInflow);
    expect(m6!.installInflow).toBe(s.scenarioInstallPlusRetainer.installInflow);
    expect(m6!.retainerInflow).toBe(s.scenarioInstallPlusRetainer.retainerInflow);
  });
});

describe("Second-anchor scenarios — recompute when upstream constants are edited", () => {
  it("edits to the on-site / remote day rates flow into install-per-reserve and Shape A", () => {
    // 30 × $4,000 + 24 × $2,000 = $168,000 install
    const state = withEdit(
      withEdit(DEFAULT_STATE, "crossReserve.dayRate.onsite", 4000),
      "crossReserve.dayRate.remote",
      2000,
    );
    const s = computeSecondAnchorScenarios(state);
    expect(s.installPerReserve).toBe(168000);
    expect(s.scenarioInstallOnly.inflow).toBe(168000);
    expect(s.scenarioInstallOnly.surplus).toBe(168000 - Y1_HONEST_GAP);
  });

  it("edits to the retainer flow into Shape B and the timing strip", () => {
    // Retainer bumped to $48k/yr ⇒ $4k/mo ⇒ M6 land gives 3 × 4 = $12k.
    const state = withEdit(DEFAULT_STATE, "crossReserve.retainer.annual", 48000);
    const s = computeSecondAnchorScenarios(state);
    expect(s.retainerAnnual).toBe(48000);
    expect(s.scenarioInstallPlusRetainer.retainerInflow).toBe(12000);
    expect(s.scenarioInstallPlusRetainer.totalInflow).toBe(160200);
    expect(s.scenarioInstallPlusRetainer.y2Carry).toBe(48000);
    const m3 = s.timing.find((t) => t.landMonth === 3)!;
    // 6 × $4k = $24k retainer in Y1 at M3 land.
    expect(m3.retainerInflow).toBe(24000);
  });
});
