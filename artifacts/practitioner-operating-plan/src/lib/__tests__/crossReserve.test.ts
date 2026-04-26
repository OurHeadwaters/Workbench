import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { CROSS_RESERVE_DEFAULTS } from "@workspace/cross-reserve-defaults";

import { COST_REGISTRY } from "../../data/costRegistry";
import { DEFAULT_STATE } from "../storage";
import type { AppState } from "../storage";
import {
  CROSS_RESERVE_INSTALL_WEEKS,
  CROSS_RESERVE_ONSITE_DAYS,
  CROSS_RESERVE_REMOTE_DAYS,
  getLiveCostValue,
  resolveCost,
} from "../budgetMath";
import {
  formatPlanningK,
  formatCompactK,
  formatPlanningDollars,
} from "../formatPlanning";

function withEdit(state: AppState, id: string, value: number): AppState {
  return {
    ...state,
    costReview: {
      ...state.costReview,
      [id]: { status: "edited", editedValue: value, note: "" },
    },
  };
}

describe("Cross-reserve install shape — shared package source of truth", () => {
  // The 12-week / 30-on-site / 24-remote shape is canonical in
  // `@workspace/cross-reserve-defaults`. budgetMath re-exports it as
  // CROSS_RESERVE_INSTALL_WEEKS / ONSITE_DAYS / REMOTE_DAYS. The Deer
  // Lake "First reserve, then the next" slide reads the same package
  // for its calculator defaults and body copy. If a future edit
  // changes the shared shape, the receiving-reserve revenue, Y2 / Y3
  // composition, and travel-passthrough examples all move together —
  // these tests pin that the wiring is in place so silent drift
  // becomes a loud test failure.

  it("budgetMath constants are sourced from the shared cross-reserve-defaults package", () => {
    expect(CROSS_RESERVE_INSTALL_WEEKS).toBe(CROSS_RESERVE_DEFAULTS.install.weeks);
    expect(CROSS_RESERVE_ONSITE_DAYS).toBe(CROSS_RESERVE_DEFAULTS.install.onsiteDays);
    expect(CROSS_RESERVE_REMOTE_DAYS).toBe(CROSS_RESERVE_DEFAULTS.install.remoteDays);
  });

  it("shared install shape matches the V3-spec-locked planning numbers (12 / 30 / 24)", () => {
    // If the planning shape is intentionally retuned, update these
    // assertions and the registry context strings together.
    expect(CROSS_RESERVE_DEFAULTS.install.weeks).toBe(12);
    expect(CROSS_RESERVE_DEFAULTS.install.onsiteDays).toBe(30);
    expect(CROSS_RESERVE_DEFAULTS.install.remoteDays).toBe(24);
  });

  it("travel pass-through example uses the shared install shape (weeks × flight + onsiteDays × (lodging + food))", () => {
    // Belt-and-suspenders cross-check that the travelPassthrough.example
    // derivation reads from the same shape constants the slide-side
    // calculator defaults to, not a parallel hardcoded copy.
    const live = getLiveCostValue(
      DEFAULT_STATE,
      "crossReserve.travelPassthrough.example",
    );
    const flight = resolveCost(DEFAULT_STATE, "crossReserve.travel.flightPerWeek");
    const lodging = resolveCost(DEFAULT_STATE, "crossReserve.travel.lodgingPerNight");
    const food = resolveCost(DEFAULT_STATE, "crossReserve.travel.foodPerOnsiteDay");
    const expected =
      CROSS_RESERVE_DEFAULTS.install.weeks * flight +
      CROSS_RESERVE_DEFAULTS.install.onsiteDays * lodging +
      CROSS_RESERVE_DEFAULTS.install.onsiteDays * food;
    expect(live).toBe(expected);
  });
});

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

  it("Y1 sticker price = install fee + fly-in scheduled travel + retainer (~$200,700 at defaults)", () => {
    // Anchored derivation for the receiving-reserve "Y1 all-in" headline
    // that appears on both ThreeRevenueLayers ("~$201k all-in") and
    // FirstReserveThenTheNext (Reserve #2 calculator headline). At
    // default rates: 148,200 install + 22,500 fly-in scheduled travel +
    // 30,000 first-year retainer = 200,700. The slides round up to
    // "~$201k" via formatPlanningK so a band council never sees a
    // headline lower than the live math actually delivers.
    const live = getLiveCostValue(
      DEFAULT_STATE,
      "crossReserve.year1.stickerPrice",
    );
    expect(live).toBe(148200 + 22500 + 30000);
    expect(live).toBe(200700);
  });

  it("Y1 sticker price recomposes when the day rates / travel / retainer move", () => {
    // Bumping the on-site rate, the per-week flight cost, and the
    // retainer should cascade through every component the sticker
    // composes from. This is what makes the cost-review modal a single
    // source of truth across both decks: editing any one of these
    // entries moves the headline on Three Revenue Layers AND First
    // Reserve Then The Next without any literal in either slide.
    let state = withEdit(DEFAULT_STATE, "crossReserve.dayRate.onsite", 4000);
    state = withEdit(state, "crossReserve.travel.flightPerWeek", 1200);
    state = withEdit(state, "crossReserve.retainer.annual", 35000);
    const live = getLiveCostValue(state, "crossReserve.year1.stickerPrice");
    // install: 30 × 4,000 + 24 × 1,800 = 120,000 + 43,200 = 163,200
    // travel:  12 × 1,200 + 30 × 250 + 30 × 100 = 14,400 + 7,500 + 3,000 = 24,900
    // retainer: 35,000
    // sticker: 163,200 + 24,900 + 35,000 = 223,100
    expect(live).toBe(223100);
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

  it("travel.totalPerInstall stays equal to travelPassthrough.example at default state and recomposes together when a component is edited", () => {
    // The two registry entries surface the same rolled-up pass-through
    // headline ($22,500 at defaults). They MUST recompute from the same
    // shared install shape × per-component inputs so the cost-review
    // modal can never show the user two different "total per install"
    // numbers — and so the baked defaultValue can't go stale once a
    // user edits a flight / lodging / food component.

    // 1. At default state both equal the documented $22,500.
    const baselineTotal = getLiveCostValue(
      DEFAULT_STATE,
      "crossReserve.travel.totalPerInstall",
    );
    const baselineExample = getLiveCostValue(
      DEFAULT_STATE,
      "crossReserve.travelPassthrough.example",
    );
    expect(baselineTotal).toBe(22500);
    expect(baselineTotal).toBe(baselineExample);

    // 2. Edit a component (flight per week ⇒ $1,200, food/day ⇒ $125)
    //    and confirm both entries move together to the new value.
    const state = withEdit(
      withEdit(DEFAULT_STATE, "crossReserve.travel.flightPerWeek", 1200),
      "crossReserve.travel.foodPerOnsiteDay",
      125,
    );
    const editedTotal = getLiveCostValue(
      state,
      "crossReserve.travel.totalPerInstall",
    );
    const editedExample = getLiveCostValue(
      state,
      "crossReserve.travelPassthrough.example",
    );
    // 12 × $1,200 + 30 × $250 + 30 × $125 = 14,400 + 7,500 + 3,750 = 25,650
    expect(editedTotal).toBe(25650);
    expect(editedTotal).toBe(editedExample);
    // And — critically — the live total no longer matches the stale
    // baked $22,500 default once a component is edited.
    expect(editedTotal).not.toBe(22500);
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

describe("Cross-reserve registry copy — install-shape literals match the shared defaults", () => {
  // Several `crossReserve.*` registry entries name the install shape
  // inline in their label or context string ("12-week install",
  // "30 on-site days", "24 remote days", "12 weekly flights", etc.).
  // If the canonical 12 / 30 / 24 shape in `@workspace/cross-reserve-defaults`
  // ever changes, those embedded literals would silently disagree with
  // every other surface that reads the shared package — exactly the
  // drift the rest of this suite is designed to prevent. This test
  // scans every crossReserve.* entry's label and context for week /
  // on-site / remote literals and asserts each one matches the shared
  // shape, so the cost-review modal cannot quietly go stale.
  const WEEK_PATTERNS: readonly RegExp[] = [
    /(\d+)-week install/g, // "12-week install"
    /(\d+) install weeks/g, // "12 install weeks"
    /(\d+) weekly/g, // "12 weekly flights / drives / round-trip ..."
    /\((\d+) weeks\)/g, // "(12 weeks)"
  ];
  const ONSITE_PATTERNS: readonly RegExp[] = [
    /(\d+) on-site (?:days|nights)/g, // "30 on-site days", "30 on-site nights"
    /\(~?(\d+) nights for/g, // "(~30 nights for a 12-week install)"
  ];
  const REMOTE_PATTERNS: readonly RegExp[] = [
    /(\d+) remote days/g, // "24 remote days"
  ];

  it("every crossReserve.* entry's label and context names the canonical install shape", () => {
    const weeks = CROSS_RESERVE_DEFAULTS.install.weeks;
    const onsiteDays = CROSS_RESERVE_DEFAULTS.install.onsiteDays;
    const remoteDays = CROSS_RESERVE_DEFAULTS.install.remoteDays;

    let scanned = 0;
    for (const entry of COST_REGISTRY) {
      if (!entry.id.startsWith("crossReserve.")) continue;
      const text = `${entry.label} ${entry.context ?? ""}`;
      for (const pat of WEEK_PATTERNS) {
        for (const m of text.matchAll(pat)) {
          scanned++;
          expect(
            Number(m[1]),
            `${entry.id}: "${m[0]}" should embed install.weeks (${weeks})`,
          ).toBe(weeks);
        }
      }
      for (const pat of ONSITE_PATTERNS) {
        for (const m of text.matchAll(pat)) {
          scanned++;
          expect(
            Number(m[1]),
            `${entry.id}: "${m[0]}" should embed install.onsiteDays (${onsiteDays})`,
          ).toBe(onsiteDays);
        }
      }
      for (const pat of REMOTE_PATTERNS) {
        for (const m of text.matchAll(pat)) {
          scanned++;
          expect(
            Number(m[1]),
            `${entry.id}: "${m[0]}" should embed install.remoteDays (${remoteDays})`,
          ).toBe(remoteDays);
        }
      }
    }
    // Sanity floor: if the registry stops naming the install shape at
    // all (e.g. someone strips every example down to bare numbers), the
    // scan would silently pass with zero matches. Lock in that the
    // current crop of inline references is at least covered.
    expect(scanned).toBeGreaterThanOrEqual(15);
  });
});

describe("OnePager — cross-reserve dollar headlines flow from shared defaults", () => {
  // The printable OnePager quotes four monetary headlines in its
  // "What it costs the next reserve" panel: install fee, travel
  // pass-through, first-year retainer, and the rolled-up Y1 all-in
  // sticker. They previously lived as bare literals
  // ("~$148.5k install", "~$22.5k travel pass-through",
  // "$30k first-year retainer", "~$201k Y1 all-in") and silently
  // drifted whenever the day rate / retainer / travel inputs moved.
  // OnePager.tsx now feeds each headline through the same
  // formatPlanningK / formatCompactK / formatPlanningDollars helpers
  // ThreeRevenueLayers uses, reading the live values from
  // CROSS_RESERVE_DEFAULTS / getLiveCostValue. These tests pin the
  // formatted strings at the no-edits default so the printable sheet
  // can never disagree with the live deck.

  it("install / travel / retainer / Y1 headlines reconcile at default state", () => {
    // Live values OnePager.tsx reads.
    const installPerReserve = getLiveCostValue(
      DEFAULT_STATE,
      "crossReserve.installRevenue.perReserve",
    );
    const travelPassthrough = getLiveCostValue(
      DEFAULT_STATE,
      "crossReserve.travelPassthrough.example",
    );
    const retainer = resolveCost(DEFAULT_STATE, "crossReserve.retainer.annual");
    const y1Sticker = getLiveCostValue(
      DEFAULT_STATE,
      "crossReserve.year1.stickerPrice",
    );

    // Live numerics match the shared defaults / live derivations.
    expect(installPerReserve).toBe(CROSS_RESERVE_DEFAULTS.installRevenuePerReserve);
    expect(installPerReserve).toBe(148200);
    expect(travelPassthrough).toBe(22500);
    expect(retainer).toBe(CROSS_RESERVE_DEFAULTS.retainerAnnual);
    expect(retainer).toBe(30000);
    expect(y1Sticker).toBe(200700);

    // Formatted headlines exactly reproduce the prior literals
    // ("~$148.5k", "~$22.5k", "$30k", "~$201k", "~$201,000") so the
    // default rendered output is unchanged.
    expect(formatPlanningK(installPerReserve ?? 0)).toBe("~$148.5k");
    expect(formatPlanningK(travelPassthrough ?? 0)).toBe("~$22.5k");
    expect(formatCompactK(retainer)).toBe("$30k");
    expect(formatPlanningK(y1Sticker ?? 0)).toBe("~$201k");
    expect(formatPlanningDollars(y1Sticker ?? 0)).toBe("~$201,000");
  });

  it("OnePager headlines move when the shared day rate / retainer / travel inputs are edited", () => {
    // Bump the on-site rate, the per-week flight cost, and the retainer.
    // Every OnePager headline that derives from these inputs must
    // recompose — proving the panel reads the same live registry the
    // cost-review modal writes to, with no parallel hardcoded source.
    let state = withEdit(DEFAULT_STATE, "crossReserve.dayRate.onsite", 4000);
    state = withEdit(state, "crossReserve.travel.flightPerWeek", 1200);
    state = withEdit(state, "crossReserve.retainer.annual", 35000);

    const installPerReserve = getLiveCostValue(
      state,
      "crossReserve.installRevenue.perReserve",
    );
    const travelPassthrough = getLiveCostValue(
      state,
      "crossReserve.travelPassthrough.example",
    );
    const retainer = resolveCost(state, "crossReserve.retainer.annual");
    const y1Sticker = getLiveCostValue(state, "crossReserve.year1.stickerPrice");

    // install: 30 × 4,000 + 24 × 1,800 = 163,200
    // travel:  12 × 1,200 + 30 × 250 + 30 × 100 = 24,900
    // retainer: 35,000
    // sticker: 163,200 + 24,900 + 35,000 = 223,100
    expect(installPerReserve).toBe(163200);
    expect(travelPassthrough).toBe(24900);
    expect(retainer).toBe(35000);
    expect(y1Sticker).toBe(223100);

    // Formatted headlines move with the live values — none stay pinned
    // to the old "~$148.5k / ~$22.5k / $30k / ~$201k" literals.
    expect(formatPlanningK(installPerReserve ?? 0)).toBe("~$163.5k");
    expect(formatPlanningK(travelPassthrough ?? 0)).toBe("~$25k");
    expect(formatCompactK(retainer)).toBe("$35k");
    expect(formatPlanningK(y1Sticker ?? 0)).toBe("~$223.5k");
    expect(formatPlanningDollars(y1Sticker ?? 0)).toBe("~$223,500");
  });
});

describe("Cross-reserve surfaces — no stale dollar literals on slide / page TSX files", () => {
  // Tasks #239 and #243 closed the drift between the live cost registry
  // and two specific surfaces (the install-shape constants on OnePager,
  // then the install / travel / retainer / Y1 dollar headlines). The
  // earlier "install-shape literals" scan above only walks the registry
  // entries themselves; it does not cover the slide / page / one-pager
  // TSX files where a future hand-typed "$148,200", "~$30k retainer",
  // "$201,000", or "~$22,500 travel pass-through" could silently
  // reintroduce the same drift.
  //
  // This scan walks every `.tsx` file under both decks' `pages/`
  // directories and asserts each occurrence of a cross-reserve dollar
  // headline is either inside a comment or accompanied on the same
  // line by a registry-helper invocation (formatPlanningK /
  // formatCompactK / formatPlanningDollars / getLiveCostValue /
  // liveDerived / resolveCost / CROSS_RESERVE_DEFAULTS). A fresh bare
  // literal in a new TSX surface fails this test loudly — stopping
  // drift from sneaking back in via a future slide or marketing page.

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // From src/lib/__tests__ up to repo root: ../../../../..
  const REPO_ROOT = path.resolve(__dirname, "..", "..", "..", "..", "..");
  const SCAN_DIRS = [
    path.join(REPO_ROOT, "artifacts/practitioner-operating-plan/src/pages"),
    path.join(REPO_ROOT, "artifacts/deer-lake-store-plan/src/pages"),
  ];

  // Hand-typed dollar literals that match the four cross-reserve
  // headline shapes we've already had to chase down once. Adding a new
  // one means extending this list (and the cost registry should
  // probably grow a corresponding live entry too).
  const PATTERNS: ReadonlyArray<{ name: string; re: RegExp }> = [
    { name: "install fee (~$148,200 / $148,500)", re: /~?\$148[,.]?[25]00\b/g },
    { name: "travel pass-through (~$22,500)", re: /~?\$22[,.]?500\b/g },
    { name: "Y1 all-in sticker (~$201,000)", re: /~?\$201,?000\b/g },
    { name: "first-year retainer (~$30k)", re: /~?\$30k\b/g },
  ];

  // Allow a literal on a line that also invokes one of the registry-
  // helper APIs — this is the "documenting the live value alongside the
  // helper call" pattern the rest of the suite relies on.
  const REGISTRY_HELPER_RE =
    /\b(?:formatPlanningK|formatCompactK|formatPlanningDollars|getLiveCostValue|liveDerived|resolveCost|CROSS_RESERVE_DEFAULTS)\b/;

  function* walkTsxFiles(dir: string): Generator<string> {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      // Tests assert formatted strings on purpose; they are not
      // user-facing surfaces so we exclude them from this scan.
      if (entry.name === "__tests__" || entry.name === "node_modules") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        yield* walkTsxFiles(full);
      } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
        yield full;
      }
    }
  }

  // Build a per-character mask of `/* ... */` block-comment ranges so
  // we can cheaply ask "is offset N inside a block comment?".
  function buildBlockCommentMask(src: string): Uint8Array {
    const mask = new Uint8Array(src.length);
    let inBlock = false;
    let i = 0;
    while (i < src.length) {
      if (!inBlock && src[i] === "/" && src[i + 1] === "*") {
        mask[i] = 1;
        mask[i + 1] = 1;
        inBlock = true;
        i += 2;
        continue;
      }
      if (inBlock) {
        mask[i] = 1;
        if (src[i] === "*" && src[i + 1] === "/") {
          mask[i + 1] = 1;
          inBlock = false;
          i += 2;
          continue;
        }
      }
      i++;
    }
    return mask;
  }

  function isInLineComment(line: string, matchIdx: number): boolean {
    const idx = line.indexOf("//");
    return idx >= 0 && idx < matchIdx;
  }

  it("every cross-reserve dollar literal is in a comment or alongside a registry-helper call", () => {
    const violations: string[] = [];
    let scanned = 0;
    let scannedFiles = 0;

    for (const dir of SCAN_DIRS) {
      for (const file of walkTsxFiles(dir)) {
        scannedFiles++;
        const src = fs.readFileSync(file, "utf8");
        const blockMask = buildBlockCommentMask(src);

        for (const { re, name } of PATTERNS) {
          for (const m of src.matchAll(re)) {
            scanned++;
            const idx = m.index ?? 0;

            // Inside `/* ... */`?
            if (blockMask[idx]) continue;

            // Inside `// ...`?
            const lineStart = src.lastIndexOf("\n", idx - 1) + 1;
            const nextNl = src.indexOf("\n", idx);
            const lineEnd = nextNl === -1 ? src.length : nextNl;
            const line = src.slice(lineStart, lineEnd);
            const matchIdxOnLine = idx - lineStart;
            if (isInLineComment(line, matchIdxOnLine)) continue;

            // Same line invokes a registry helper / shared default?
            if (REGISTRY_HELPER_RE.test(line)) continue;

            const lineNo = src.slice(0, idx).split("\n").length;
            violations.push(
              `${path.relative(REPO_ROOT, file)}:${lineNo} — bare literal "${m[0]}" matches ${name}; ` +
                `derive it from the live registry (formatPlanningK/formatCompactK/formatPlanningDollars + ` +
                `getLiveCostValue/liveDerived/resolveCost/CROSS_RESERVE_DEFAULTS) or move it into a comment.`,
            );
          }
        }
      }
    }

    expect(
      violations,
      `Hardcoded cross-reserve dollar literals found:\n  ${violations.join("\n  ")}`,
    ).toEqual([]);

    // Sanity floor: if both directories disappear or the patterns rot,
    // the scan would silently pass with zero work. Lock in that we are
    // actually walking real TSX files.
    expect(scannedFiles).toBeGreaterThanOrEqual(20);
    // And lock in that the scan is finding *something* — the existing
    // `// $30k — round-nearest-1k…` comment in FirstReserveThenTheNext
    // means the patterns themselves are at minimum matching one line.
    expect(scanned).toBeGreaterThanOrEqual(1);
  });
});
