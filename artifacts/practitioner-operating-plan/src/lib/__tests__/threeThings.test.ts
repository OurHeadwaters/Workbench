import { describe, it, expect } from "vitest";

import { DEFAULT_STATE, migrate, STORAGE_VERSION } from "../storage";
import type { AppState, ThreeThingTriple } from "../storage";
import {
  currentWeekKey,
  emptyTriple,
  getNextUndone,
  isMobileViewport,
  MOBILE_BREAKPOINT_PX,
  readWeekThree,
} from "../threeThings";

function triple(
  a: { text?: string; done?: boolean } = {},
  b: { text?: string; done?: boolean } = {},
  c: { text?: string; done?: boolean } = {},
): ThreeThingTriple {
  return [
    { text: a.text ?? "", done: a.done ?? false },
    { text: b.text ?? "", done: b.done ?? false },
    { text: c.text ?? "", done: c.done ?? false },
  ];
}

describe("getNextUndone — Day → Week → Phase priority", () => {
  it("returns the first undone day slot when day items exist", () => {
    const next = getNextUndone(
      triple({ text: "draft email" }, { text: "lunch" }, { text: "ship it" }),
      triple({ text: "weekly thing" }),
      triple({ text: "phase thing" }),
    );
    expect(next).not.toBeNull();
    expect(next?.kind).toBe("day");
    expect(next?.idx).toBe(0);
    expect(next?.item.text).toBe("draft email");
  });

  it("skips past finished day items but stays in the day queue", () => {
    const next = getNextUndone(
      triple(
        { text: "first", done: true },
        { text: "second" },
        { text: "third" },
      ),
      triple({ text: "weekly" }),
      triple({ text: "phase" }),
    );
    expect(next?.kind).toBe("day");
    expect(next?.idx).toBe(1);
    expect(next?.item.text).toBe("second");
  });

  it("falls through to the week queue once every day slot is filled and done", () => {
    const next = getNextUndone(
      triple(
        { text: "a", done: true },
        { text: "b", done: true },
        { text: "c", done: true },
      ),
      triple({ text: "ship newsletter" }, { text: "wk2" }),
      triple({ text: "phase thing" }),
    );
    expect(next?.kind).toBe("week");
    expect(next?.idx).toBe(0);
    expect(next?.item.text).toBe("ship newsletter");
  });

  it("falls through to the phase queue once day and week are both fully done", () => {
    const next = getNextUndone(
      triple(
        { text: "d1", done: true },
        { text: "d2", done: true },
        { text: "d3", done: true },
      ),
      triple(
        { text: "w1", done: true },
        { text: "w2", done: true },
        { text: "w3", done: true },
      ),
      triple({ text: "land contract" }, { text: "p2" }, { text: "p3" }),
    );
    expect(next?.kind).toBe("phase");
    expect(next?.idx).toBe(0);
    expect(next?.item.text).toBe("land contract");
  });

  it("returns an empty (untyped) day slot before falling through to a filled week slot", () => {
    // The "next thing" surface is also the "next prompt" surface — an
    // empty day row outranks a filled week row, because the practitioner
    // hasn't even decided today's first thing yet.
    const next = getNextUndone(
      triple({}, {}, {}),
      triple({ text: "ship newsletter" }),
      triple({ text: "phase" }),
    );
    expect(next?.kind).toBe("day");
    expect(next?.idx).toBe(0);
    expect(next?.item.text).toBe("");
  });

  it("returns null only when all 9 slots are filled and done", () => {
    const all = triple(
      { text: "a", done: true },
      { text: "b", done: true },
      { text: "c", done: true },
    );
    expect(getNextUndone(all, all, all)).toBeNull();
  });

  it("does NOT count a row as done if it's checked but the text is empty", () => {
    // Defensive: an item that is checked but has no text is treated as
    // open so the focal card prompts for input rather than vanishing.
    const weirdDone = triple(
      { text: "", done: true },
      { text: "", done: true },
      { text: "", done: true },
    );
    const next = getNextUndone(weirdDone, emptyTriple(), emptyTriple());
    expect(next?.kind).toBe("day");
    expect(next?.idx).toBe(0);
  });
});

describe("weeklyThree storage helpers", () => {
  it("readWeekThree returns an empty triple for a week with no entry", () => {
    const items = readWeekThree(DEFAULT_STATE, "17");
    expect(items).toEqual(emptyTriple());
  });

  it("readWeekThree returns the stored triple for a known week key", () => {
    const state: AppState = {
      ...DEFAULT_STATE,
      weeklyThree: {
        "17": triple({ text: "ship batch" }, { text: "call client" }),
      },
    };
    const items = readWeekThree(state, "17");
    expect(items[0].text).toBe("ship batch");
    expect(items[1].text).toBe("call client");
    expect(items[2].text).toBe("");
  });

  it("rolls over automatically — a different week key reads as empty even if another week has data", () => {
    const state: AppState = {
      ...DEFAULT_STATE,
      weeklyThree: {
        "16": triple(
          { text: "old", done: true },
          { text: "old", done: true },
          { text: "old", done: true },
        ),
      },
    };
    expect(readWeekThree(state, "17")).toEqual(emptyTriple());
    // Old week's data is preserved in place.
    expect(readWeekThree(state, "16")[0].text).toBe("old");
  });

  it("currentWeekKey returns a stable string keyed off getCurrentWeekNumber", () => {
    // Mid-2026 — should map to a non-trivial week number.
    const key = currentWeekKey(new Date("2026-04-15T12:00:00Z"));
    expect(key).toBe("15");
  });

  it("migrate() from v5 adds an empty weeklyThree without dropping daily/phase data", () => {
    const v5Payload = {
      version: 5,
      doneSteps: { foo: { doneAt: "2026-01-01T00:00:00Z" } },
      weekNotes: { "1": "kept" },
      weekCloseOuts: {},
      completedWeeks: {},
      shiftedWeeks: {},
      snapshots: [],
      currentPhase: "pitch" as const,
      milestones: { pitch_sent: true },
      dismissedPhaseSuggestion: null,
      dailyThree: {
        "2026-01-05": triple({ text: "kept day" }),
      },
      phaseThree: {
        phase: "pitch" as const,
        items: triple({ text: "kept phase" }),
      },
      benchOverrides: {},
      costReview: {},
    };

    const migrated = migrate(v5Payload);
    expect(migrated.version).toBe(STORAGE_VERSION);
    // The new slot is initialized empty.
    expect(migrated.weeklyThree).toEqual({});
    // Existing daily, phase, and unrelated state survives intact.
    expect(migrated.dailyThree["2026-01-05"][0].text).toBe("kept day");
    expect(migrated.phaseThree?.items[0].text).toBe("kept phase");
    expect(migrated.weekNotes["1"]).toBe("kept");
    expect(migrated.doneSteps.foo).toBeDefined();
    expect(migrated.currentPhase).toBe("pitch");
    expect(migrated.milestones.pitch_sent).toBe(true);
  });
});

describe("isMobileViewport — desktop/mobile breakpoint", () => {
  it("treats sub-768px widths as mobile", () => {
    expect(isMobileViewport(0)).toBe(true);
    expect(isMobileViewport(320)).toBe(true);
    expect(isMobileViewport(767)).toBe(true);
  });

  it("treats 768px and above as desktop", () => {
    expect(isMobileViewport(MOBILE_BREAKPOINT_PX)).toBe(false);
    expect(isMobileViewport(1024)).toBe(false);
    expect(isMobileViewport(1920)).toBe(false);
  });
});
