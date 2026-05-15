/**
 * threeThings.test.ts
 *
 * Unit tests for the weekly "three things" helpers.
 * All tests target pure functions that require no localStorage mock.
 *
 * Scenarios covered:
 *   isoWeekOf          — known dates, year boundary, week-1 edge cases
 *   lastISOWeekOfYear  — 52-week and 53-week years
 *   formatWeekKey      — zero-padding, single/double digit weeks
 *   prevWeekKey        — mid-year, start of year (→ prior year), malformed
 *   checkRolloverPure  — already dismissed, no prev entry, all done, partial
 *   mergeCarryover     — capped at 3, carried items reset to undone
 */

import { describe, expect, it } from "vitest";
import {
  checkRolloverPure,
  formatWeekKey,
  isoWeekOf,
  lastISOWeekOfYear,
  mergeCarryover,
  prevWeekKey,
  type WeeklyItem,
  type WeeklyThree,
} from "@/lib/threeThings";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeItem(
  id: string,
  text: string,
  done = false,
): WeeklyItem {
  return { id, text, done };
}

function makeEntry(
  weekKey: string,
  items: WeeklyItem[],
  rolloverDismissed?: boolean,
): WeeklyThree {
  return {
    weekKey,
    items,
    createdAt: 1_000_000,
    updatedAt: 1_000_000,
    rolloverDismissed,
  };
}

// ── isoWeekOf ─────────────────────────────────────────────────────────────────

describe("isoWeekOf", () => {
  it("returns week 1 for Jan 1 2025 (Wednesday)", () => {
    // ISO week 1 of 2025 runs Mon Dec 30 2024 – Sun Jan 5 2025
    expect(isoWeekOf(new Date(2025, 0, 1))).toEqual({ year: 2025, week: 1 });
  });

  it("returns week 2 for Jan 6 2025 (Monday)", () => {
    // Jan 6 is the first day of week 2 of 2025
    expect(isoWeekOf(new Date(2025, 0, 6))).toEqual({ year: 2025, week: 2 });
  });

  it("returns week 20 for May 15 2026 (a Thursday)", () => {
    expect(isoWeekOf(new Date(2026, 4, 15))).toEqual({ year: 2026, week: 20 });
  });

  it("returns week 52 for Dec 28 2020", () => {
    expect(isoWeekOf(new Date(2020, 11, 28))).toEqual({ year: 2020, week: 53 });
  });

  it("returns week 53 year 2020 for Dec 31 2020 (Thursday)", () => {
    // 2020 has 53 ISO weeks
    expect(isoWeekOf(new Date(2020, 11, 31))).toEqual({ year: 2020, week: 53 });
  });

  it("Jan 1 2021 (Friday) belongs to week 53 of 2020", () => {
    // ISO: Jan 1 2021 is in week 53 of 2020
    expect(isoWeekOf(new Date(2021, 0, 1))).toEqual({ year: 2020, week: 53 });
  });

  it("Jan 4 2021 (Monday) is week 1 of 2021", () => {
    expect(isoWeekOf(new Date(2021, 0, 4))).toEqual({ year: 2021, week: 1 });
  });

  it("Dec 31 2023 (Sunday) is week 52 of 2023", () => {
    expect(isoWeekOf(new Date(2023, 11, 31))).toEqual({ year: 2023, week: 52 });
  });

  it("Jan 1 2024 (Monday) is week 1 of 2024", () => {
    expect(isoWeekOf(new Date(2024, 0, 1))).toEqual({ year: 2024, week: 1 });
  });
});

// ── lastISOWeekOfYear ─────────────────────────────────────────────────────────

describe("lastISOWeekOfYear", () => {
  it("2020 has 53 ISO weeks", () => {
    expect(lastISOWeekOfYear(2020)).toBe(53);
  });

  it("2021 has 52 ISO weeks", () => {
    expect(lastISOWeekOfYear(2021)).toBe(52);
  });

  it("2026 has 53 ISO weeks", () => {
    expect(lastISOWeekOfYear(2026)).toBe(53);
  });

  it("2025 has 52 ISO weeks", () => {
    expect(lastISOWeekOfYear(2025)).toBe(52);
  });
});

// ── formatWeekKey ─────────────────────────────────────────────────────────────

describe("formatWeekKey", () => {
  it("zero-pads single-digit weeks", () => {
    expect(formatWeekKey(2026, 1)).toBe("2026-W01");
    expect(formatWeekKey(2026, 9)).toBe("2026-W09");
  });

  it("does not pad double-digit weeks", () => {
    expect(formatWeekKey(2026, 20)).toBe("2026-W20");
    expect(formatWeekKey(2026, 53)).toBe("2026-W53");
  });
});

// ── prevWeekKey ───────────────────────────────────────────────────────────────

describe("prevWeekKey", () => {
  it("decrements a mid-year week", () => {
    expect(prevWeekKey("2026-W20")).toBe("2026-W19");
  });

  it("handles week 2 → week 1", () => {
    expect(prevWeekKey("2026-W02")).toBe("2026-W01");
  });

  it("rolls back from week 1 to the last week of the previous year (52-week year)", () => {
    // 2025 has 52 ISO weeks
    expect(prevWeekKey("2026-W01")).toBe("2025-W52");
  });

  it("rolls back from week 1 to the last week of the previous year (53-week year)", () => {
    // 2020 has 53 ISO weeks; 2021-W01 → 2020-W53
    expect(prevWeekKey("2021-W01")).toBe("2020-W53");
  });

  it("returns empty string for a malformed key", () => {
    expect(prevWeekKey("bad")).toBe("");
    expect(prevWeekKey("2026-20")).toBe("");
    expect(prevWeekKey("")).toBe("");
  });
});

// ── checkRolloverPure ─────────────────────────────────────────────────────────

describe("checkRolloverPure", () => {
  it("returns hasUnfinished:false when current entry has rolloverDismissed:true", () => {
    const current = makeEntry("2026-W20", [], true);
    const prev = makeEntry("2026-W19", [makeItem("a", "Unfinished", false)]);
    const result = checkRolloverPure(current, prev, "2026-W19");
    expect(result.hasUnfinished).toBe(false);
    expect(result.unfinished).toHaveLength(0);
    expect(result.fromKey).toBe("");
  });

  it("returns hasUnfinished:false when prevEntry is null", () => {
    const result = checkRolloverPure(null, null, "2026-W19");
    expect(result.hasUnfinished).toBe(false);
  });

  it("returns hasUnfinished:false when all prior items are done", () => {
    const prev = makeEntry("2026-W19", [
      makeItem("a", "Task A", true),
      makeItem("b", "Task B", true),
    ]);
    const result = checkRolloverPure(null, prev, "2026-W19");
    expect(result.hasUnfinished).toBe(false);
    expect(result.unfinished).toHaveLength(0);
  });

  it("returns hasUnfinished:false when all prior items are empty strings", () => {
    const prev = makeEntry("2026-W19", [
      makeItem("a", "   ", false),
      makeItem("b", "", false),
    ]);
    const result = checkRolloverPure(null, prev, "2026-W19");
    expect(result.hasUnfinished).toBe(false);
  });

  it("returns hasUnfinished:true and the undone items when some are unchecked", () => {
    const prev = makeEntry("2026-W19", [
      makeItem("a", "Done task", true),
      makeItem("b", "Pending task", false),
      makeItem("c", "Another pending", false),
    ]);
    const result = checkRolloverPure(null, prev, "2026-W19");
    expect(result.hasUnfinished).toBe(true);
    expect(result.unfinished).toHaveLength(2);
    expect(result.unfinished.map((i) => i.text)).toEqual([
      "Pending task",
      "Another pending",
    ]);
    expect(result.fromKey).toBe("2026-W19");
  });

  it("treats a null currentEntry as no dismissal (banner should show)", () => {
    const prev = makeEntry("2026-W19", [makeItem("a", "Not done", false)]);
    const result = checkRolloverPure(null, prev, "2026-W19");
    expect(result.hasUnfinished).toBe(true);
  });

  it("treats a currentEntry with rolloverDismissed:false as no dismissal", () => {
    const current = makeEntry("2026-W20", [], false);
    const prev = makeEntry("2026-W19", [makeItem("a", "Not done", false)]);
    const result = checkRolloverPure(current, prev, "2026-W19");
    expect(result.hasUnfinished).toBe(true);
  });
});

// ── mergeCarryover ────────────────────────────────────────────────────────────

describe("mergeCarryover", () => {
  it("prepends carried items before existing items", () => {
    const current = [makeItem("c1", "Current task", false)];
    const carried = [makeItem("p1", "Carried task", true)];
    const result = mergeCarryover(current, carried);
    expect(result[0].text).toBe("Carried task");
    expect(result[1].text).toBe("Current task");
  });

  it("resets carried items to done:false", () => {
    const carried = [makeItem("p1", "Was checked", true)];
    const result = mergeCarryover([], carried);
    expect(result[0].done).toBe(false);
  });

  it("caps the merged list at 3 items", () => {
    const current = [
      makeItem("c1", "C1"),
      makeItem("c2", "C2"),
    ];
    const carried = [
      makeItem("p1", "P1"),
      makeItem("p2", "P2"),
    ];
    const result = mergeCarryover(current, carried);
    expect(result).toHaveLength(3);
    expect(result.map((i) => i.text)).toEqual(["P1", "P2", "C1"]);
  });

  it("skips empty-text items from currentItems when merging", () => {
    const current = [
      makeItem("e1", "  ", false),
      makeItem("c1", "Real task", false),
    ];
    const carried = [makeItem("p1", "Carried", false)];
    const result = mergeCarryover(current, carried);
    expect(result.map((i) => i.text)).not.toContain("  ");
    expect(result.some((i) => i.text === "Real task")).toBe(true);
  });

  it("returns only carried items when current is empty", () => {
    const carried = [makeItem("p1", "P1"), makeItem("p2", "P2")];
    const result = mergeCarryover([], carried);
    expect(result).toHaveLength(2);
  });

  it("returns empty array when both inputs are empty", () => {
    expect(mergeCarryover([], [])).toHaveLength(0);
  });
});
