import { describe, it, expect } from "vitest";

import { DEFAULT_STATE } from "../storage";
import type { AppState } from "../storage";
import { getLiveCostValue, resolveCost } from "../budgetMath";

function withEdit(state: AppState, id: string, value: number): AppState {
  return {
    ...state,
    costReview: {
      ...state.costReview,
      [id]: { status: "edited", editedValue: value, note: "" },
    },
  };
}

describe("Cross-reserve install — derived live values", () => {
  it("per-reserve install revenue = 30×on-site + 24×remote at default rates ($148,200)", () => {
    const live = getLiveCostValue(
      DEFAULT_STATE,
      "crossReserve.installRevenue.perReserve",
    );
    // 30 × $3,500 + 24 × $1,800 = 105,000 + 43,200 = 148,200
    expect(live).toBe(148200);
  });

  it("per-reserve install revenue recomputes when day rates are edited", () => {
    const state = withEdit(
      withEdit(DEFAULT_STATE, "crossReserve.dayRate.onsite", 4000),
      "crossReserve.dayRate.remote",
      2000,
    );
    const live = getLiveCostValue(state, "crossReserve.installRevenue.perReserve");
    // 30 × $4,000 + 24 × $2,000 = 120,000 + 48,000 = 168,000
    expect(live).toBe(168000);
  });

  it("Year 2 cross-reserve revenue = 2 installs + 2 first-year retainers ($356,400)", () => {
    const live = getLiveCostValue(DEFAULT_STATE, "crossReserve.year2.revenue");
    // 2 × $148,200 + 2 × $30,000 = 296,400 + 60,000 = 356,400
    expect(live).toBe(356400);
  });

  it("Year 3 cross-reserve revenue = 2 new installs + 4 active retainers ($416,400)", () => {
    const live = getLiveCostValue(DEFAULT_STATE, "crossReserve.year3.revenue");
    // 2 × $148,200 + 4 × $30,000 = 296,400 + 120,000 = 416,400
    expect(live).toBe(416400);
  });

  it("Year 2 / Year 3 components recompute when the retainer is edited", () => {
    const state = withEdit(DEFAULT_STATE, "crossReserve.retainer.annual", 40000);
    const y2 = getLiveCostValue(state, "crossReserve.year2.revenue");
    const y3 = getLiveCostValue(state, "crossReserve.year3.revenue");
    // y2: 2 × $148,200 + 2 × $40,000 = 296,400 + 80,000 = 376,400
    // y3: 2 × $148,200 + 4 × $40,000 = 296,400 + 160,000 = 456,400
    expect(y2).toBe(376400);
    expect(y3).toBe(456400);
  });

  it("live values match the registry defaults so the cost-review modal is consistent at no-edits state", () => {
    // If a future edit drifts the registry defaults from the derived
    // formula, this test fails — keeping the slide-side and modal-side
    // numbers from silently disagreeing.
    const liveInstall = getLiveCostValue(
      DEFAULT_STATE,
      "crossReserve.installRevenue.perReserve",
    );
    const liveY2 = getLiveCostValue(DEFAULT_STATE, "crossReserve.year2.revenue");
    const liveY3 = getLiveCostValue(DEFAULT_STATE, "crossReserve.year3.revenue");
    expect(liveInstall).toBe(148200);
    expect(liveY2).toBe(356400);
    expect(liveY3).toBe(416400);
  });
});

describe("Path to scale — Y2 / Y3 composed from Deer Lake + cross-reserve", () => {
  // V3 framing: Y2 and Y3 are NOT askReco × 12 × N (more concurrent
  // contracts). They're one Deer Lake contract that holds steady, with
  // cross-reserve install + retainer revenue stacking on top. These
  // tests lock in that composition so any future drift fails loudly.

  it("Y1 = askReco × 12 = $1,080,000 (Deer Lake only, no cross-reserve)", () => {
    const live = getLiveCostValue(DEFAULT_STATE, "pathToScale.year1");
    expect(live).toBe(1080000);
  });

  it("Y2 = $1,080,000 Deer Lake + $356,400 cross-reserve = $1,436,400", () => {
    const live = getLiveCostValue(DEFAULT_STATE, "pathToScale.year2");
    expect(live).toBe(1436400);
  });

  it("Y3 = $1,080,000 Deer Lake + $416,400 cross-reserve = $1,496,400", () => {
    const live = getLiveCostValue(DEFAULT_STATE, "pathToScale.year3");
    expect(live).toBe(1496400);
  });

  it("Y2 / Y3 recompute when ask.recommended is edited (Deer Lake leg moves)", () => {
    // Bump the Deer Lake monthly to $100k/mo. The cross-reserve leg is
    // unaffected (it depends on day rates + retainer, not on the ask).
    const state = withEdit(DEFAULT_STATE, "ask.recommended", 100000);
    const y2 = getLiveCostValue(state, "pathToScale.year2");
    const y3 = getLiveCostValue(state, "pathToScale.year3");
    // y2 = 100,000 × 12 + 356,400 = 1,200,000 + 356,400 = 1,556,400
    // y3 = 100,000 × 12 + 416,400 = 1,200,000 + 416,400 = 1,616,400
    expect(y2).toBe(1556400);
    expect(y3).toBe(1616400);
  });

  it("Y2 / Y3 recompute when the cross-reserve retainer is edited (recurring leg moves)", () => {
    // Bump the discipline-keeper retainer to $40k/yr. Deer Lake leg is
    // unaffected; the cross-reserve component grows by 2 × $10k in Y2
    // and 4 × $10k in Y3.
    const state = withEdit(DEFAULT_STATE, "crossReserve.retainer.annual", 40000);
    const y2 = getLiveCostValue(state, "pathToScale.year2");
    const y3 = getLiveCostValue(state, "pathToScale.year3");
    // y2 = 1,080,000 + (2 × 148,200 + 2 × 40,000) = 1,080,000 + 376,400 = 1,456,400
    // y3 = 1,080,000 + (2 × 148,200 + 4 × 40,000) = 1,080,000 + 456,400 = 1,536,400
    expect(y2).toBe(1456400);
    expect(y3).toBe(1536400);
  });

  it("all three travel pass-through examples (drive-in / fly-in scheduled / winter-road-charter) are defensible round numbers, reconcile with their per-component derivations, and are NOT double-counted in fee revenue", () => {
    // The pass-through is reimbursed cost the receiving reserve pays
    // directly — not fee income to the practitioner. It must stay out of
    // the per-install fee, the Y2/Y3 cross-reserve totals, and the Y2/Y3
    // headlines, otherwise we'd be selling reimbursement-of-cost as
    // revenue. The three access-type examples (drive-in, fly-in
    // scheduled, winter-road / charter-heavy) all share that rule, so
    // adding any of them to the headline would be double-counting. The
    // fly-in case must also match the existing editable per-component
    // planning estimates so the cost-review modal never surfaces two
    // conflicting pass-through numbers. This test fails loudly on either.

    const driveInLive = getLiveCostValue(
      DEFAULT_STATE,
      "crossReserve.travelPassthrough.driveIn",
    );
    const flyInLive = getLiveCostValue(
      DEFAULT_STATE,
      "crossReserve.travelPassthrough.example",
    );
    const winterRoadLive = getLiveCostValue(
      DEFAULT_STATE,
      "crossReserve.travelPassthrough.winterRoad",
    );

    // Drive-in: 12 × $400 + 30 × $150 + 30 × $60 = 4,800 + 4,500 + 1,800 = 11,100
    expect(driveInLive).toBe(11100);
    // Fly-in scheduled: 12 × $1,000 + 30 × $250 + 30 × $100 = 12,000 + 7,500 + 3,000 = 22,500
    expect(flyInLive).toBe(22500);
    // Winter-road / charter-heavy: 12 × $2,500 + 30 × $300 + 30 × $130 = 30,000 + 9,000 + 3,900 = 42,900
    expect(winterRoadLive).toBe(42900);

    // The lookup is monotonic by access difficulty: drive-in is the
    // floor, fly-in scheduled is the middle case, winter-road / charter
    // is the ceiling. Locking this ordering in keeps the modal copy
    // honest if anyone later tunes a single number in isolation.
    expect(driveInLive).toBeLessThan(flyInLive ?? 0);
    expect(flyInLive).toBeLessThan(winterRoadLive ?? 0);

    // The fly-in case stays wired to the editable per-component total.
    expect(flyInLive).toBe(
      resolveCost(DEFAULT_STATE, "crossReserve.travel.totalPerInstall"),
    );

    const installPer = getLiveCostValue(
      DEFAULT_STATE,
      "crossReserve.installRevenue.perReserve",
    );
    const crossY2 = getLiveCostValue(DEFAULT_STATE, "crossReserve.year2.revenue");
    const crossY3 = getLiveCostValue(DEFAULT_STATE, "crossReserve.year3.revenue");
    const y2 = getLiveCostValue(DEFAULT_STATE, "pathToScale.year2");
    const y3 = getLiveCostValue(DEFAULT_STATE, "pathToScale.year3");

    // Per-install fee revenue is purely day-rate; no travel of any
    // access-type variant folded in.
    expect(installPer).toBe(148200);
    // Y2 cross-reserve is exactly 2 installs + 2 retainers — no travel.
    expect(crossY2).toBe(2 * 148200 + 2 * 30000);
    // Y3 cross-reserve is exactly 2 installs + 4 retainers — no travel.
    expect(crossY3).toBe(2 * 148200 + 4 * 30000);
    // And the headlines reconcile to Deer Lake + cross-reserve only —
    // none of the three pass-through examples leaks into either year.
    expect(y2).toBe(1080000 + (crossY2 ?? 0));
    expect(y3).toBe(1080000 + (crossY3 ?? 0));
    // Belt-and-suspenders: explicitly check the headlines are not
    // accidentally inflated by any of the three pass-through lookups.
    for (const passthrough of [driveInLive, flyInLive, winterRoadLive]) {
      expect(installPer).not.toBe(148200 + (passthrough ?? 0));
      expect(crossY2).not.toBe(2 * 148200 + 2 * 30000 + 2 * (passthrough ?? 0));
      expect(crossY3).not.toBe(2 * 148200 + 4 * 30000 + 2 * (passthrough ?? 0));
    }
  });

  it("travel pass-through example tracks edits to its per-component inputs", () => {
    // Bump the flight cost to $1,200 and food per-diem to $125. The
    // example should recompute deterministically from the components,
    // proving it stays in lockstep with the per-component model.
    const state = withEdit(
      withEdit(DEFAULT_STATE, "crossReserve.travel.flightPerWeek", 1200),
      "crossReserve.travel.foodPerOnsiteDay",
      125,
    );
    const live = getLiveCostValue(state, "crossReserve.travelPassthrough.example");
    // 12 × $1,200 + 30 × $250 + 30 × $125 = 14,400 + 7,500 + 3,750 = 25,650
    expect(live).toBe(25650);
  });

  it("Y2 / Y3 reconcile as the literal sum of their named components", () => {
    // The whole point of the new composition: a CFO can read the Y2/Y3
    // headline as Deer Lake + cross-reserve, with no hand-waving. This
    // test pins down that identity.
    const askReco =
      getLiveCostValue(DEFAULT_STATE, "pathToScale.year1") ?? 0;
    const crossY2 =
      getLiveCostValue(DEFAULT_STATE, "crossReserve.year2.revenue") ?? 0;
    const crossY3 =
      getLiveCostValue(DEFAULT_STATE, "crossReserve.year3.revenue") ?? 0;
    const y2 = getLiveCostValue(DEFAULT_STATE, "pathToScale.year2");
    const y3 = getLiveCostValue(DEFAULT_STATE, "pathToScale.year3");
    expect(y2).toBe(askReco + crossY2);
    expect(y3).toBe(askReco + crossY3);
  });
});
