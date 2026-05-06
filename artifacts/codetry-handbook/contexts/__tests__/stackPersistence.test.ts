import { describe, expect, it } from "vitest";

import { hydrateStackState } from "@/contexts/StackContext";

// ---------------------------------------------------------------------------
// Tests for Stack session-persistence hydration.
//
// hydrateStackState() is the pure function that reconstructs card order and
// card states from the four AsyncStorage strings written on every change.
// These tests prove that done/answered/flagged cards do NOT resurface in the
// wrong state across sessions and that the stored state is faithfully restored
// on boot.
// ---------------------------------------------------------------------------

const ALL_IDS = ["rename-test", "load-bearing", "practitioner", "fork"];

describe("hydrateStackState — fresh session (no stored data)", () => {
  it("returns all cards active when nothing is stored", () => {
    const { cardStates } = hydrateStackState(null, null, null, null, ALL_IDS);
    for (const id of ALL_IDS) {
      expect(cardStates[id]?.status).toBe("active");
    }
  });

  it("returns ids in their default order when no order is stored", () => {
    const { order } = hydrateStackState(null, null, null, null, ALL_IDS);
    expect(order).toEqual(ALL_IDS);
  });

  it("returns empty stepAnswers for every card", () => {
    const { cardStates } = hydrateStackState(null, null, null, null, ALL_IDS);
    for (const id of ALL_IDS) {
      expect(cardStates[id]?.stepAnswers).toEqual({});
    }
  });
});

describe("hydrateStackState — session persistence: done cards stay done", () => {
  it("a completed card is restored as done after a session restart", () => {
    const rawDone = JSON.stringify(["rename-test"]);
    const { cardStates } = hydrateStackState(null, null, rawDone, null, ALL_IDS);
    expect(cardStates["rename-test"]?.status).toBe("done");
  });

  it("a completed card does NOT appear in the active set after restart", () => {
    const rawDone = JSON.stringify(["rename-test"]);
    const { order, cardStates } = hydrateStackState(null, null, rawDone, null, ALL_IDS);
    const activeIds = order.filter((id) => cardStates[id]?.status !== "done");
    expect(activeIds).not.toContain("rename-test");
  });

  it("multiple completed cards all survive a session restart", () => {
    const rawDone = JSON.stringify(["rename-test", "fork"]);
    const { cardStates } = hydrateStackState(null, null, rawDone, null, ALL_IDS);
    expect(cardStates["rename-test"]?.status).toBe("done");
    expect(cardStates["fork"]?.status).toBe("done");
    expect(cardStates["load-bearing"]?.status).toBe("active");
    expect(cardStates["practitioner"]?.status).toBe("active");
  });

  it("completing all cards leaves no active cards after restart", () => {
    const rawDone = JSON.stringify(ALL_IDS);
    const { order, cardStates } = hydrateStackState(null, null, rawDone, null, ALL_IDS);
    const activeIds = order.filter((id) => cardStates[id]?.status !== "done");
    expect(activeIds).toHaveLength(0);
  });
});

describe("hydrateStackState — session persistence: flagged cards stay flagged", () => {
  it("a flagged card is restored as flagged after a session restart", () => {
    const rawFlagged = JSON.stringify(["load-bearing"]);
    const { cardStates } = hydrateStackState(null, null, null, rawFlagged, ALL_IDS);
    expect(cardStates["load-bearing"]?.status).toBe("flagged");
  });

  it("a flagged card still appears in the active set (not done) after restart", () => {
    const rawFlagged = JSON.stringify(["load-bearing"]);
    const { order, cardStates } = hydrateStackState(null, null, null, rawFlagged, ALL_IDS);
    const activeIds = order.filter((id) => cardStates[id]?.status !== "done");
    expect(activeIds).toContain("load-bearing");
  });

  it("multiple flagged cards all survive a session restart", () => {
    const rawFlagged = JSON.stringify(["load-bearing", "fork"]);
    const { cardStates } = hydrateStackState(null, null, null, rawFlagged, ALL_IDS);
    expect(cardStates["load-bearing"]?.status).toBe("flagged");
    expect(cardStates["fork"]?.status).toBe("flagged");
    expect(cardStates["rename-test"]?.status).toBe("active");
    expect(cardStates["practitioner"]?.status).toBe("active");
  });

  it("done takes precedence over flagged when both are stored for the same card", () => {
    const rawDone = JSON.stringify(["rename-test"]);
    const rawFlagged = JSON.stringify(["rename-test"]);
    const { cardStates } = hydrateStackState(null, null, rawDone, rawFlagged, ALL_IDS);
    expect(cardStates["rename-test"]?.status).toBe("done");
  });

  it("handles corrupt rawFlagged gracefully (falls back to no flagged cards)", () => {
    const { cardStates } = hydrateStackState(null, null, null, "NOT_JSON", ALL_IDS);
    for (const id of ALL_IDS) {
      expect(cardStates[id]?.status).toBe("active");
    }
  });
});

describe("hydrateStackState — step answers survive a session restart", () => {
  it("written answers are restored for a card", () => {
    const answers = { "rename-test": { "rename-test-1": "It checks whether a name resists replacement." } };
    const rawAnswers = JSON.stringify(answers);
    const { cardStates } = hydrateStackState(null, rawAnswers, null, null, ALL_IDS);
    expect(cardStates["rename-test"]?.stepAnswers["rename-test-1"]).toBe(
      "It checks whether a name resists replacement.",
    );
  });

  it("answers for one card do not bleed into another card", () => {
    const answers = { "rename-test": { "rename-test-1": "My answer" } };
    const rawAnswers = JSON.stringify(answers);
    const { cardStates } = hydrateStackState(null, rawAnswers, null, null, ALL_IDS);
    expect(cardStates["load-bearing"]?.stepAnswers).toEqual({});
  });

  it("a card that is done also has its answers restored", () => {
    const answers = { "rename-test": { "rename-test-2": "Load-bearing." } };
    const rawDone = JSON.stringify(["rename-test"]);
    const { cardStates } = hydrateStackState(null, JSON.stringify(answers), rawDone, null, ALL_IDS);
    expect(cardStates["rename-test"]?.status).toBe("done");
    expect(cardStates["rename-test"]?.stepAnswers["rename-test-2"]).toBe("Load-bearing.");
  });
});

describe("hydrateStackState — skip order survives a session restart", () => {
  it("a skipped card (moved to back) is restored in its skipped position", () => {
    const skippedOrder = ["load-bearing", "practitioner", "fork", "rename-test"];
    const rawOrder = JSON.stringify(skippedOrder);
    const { order } = hydrateStackState(rawOrder, null, null, null, ALL_IDS);
    expect(order).toEqual(skippedOrder);
  });

  it("cards absent from stored order (new content) are appended at the end", () => {
    const storedOrder = ["rename-test", "load-bearing"];
    const rawOrder = JSON.stringify(storedOrder);
    const { order } = hydrateStackState(rawOrder, null, null, null, ALL_IDS);
    expect(order.slice(0, 2)).toEqual(["rename-test", "load-bearing"]);
    expect(order).toContain("practitioner");
    expect(order).toContain("fork");
    expect(order).toHaveLength(ALL_IDS.length);
  });

  it("IDs in stored order that no longer exist in the card set are dropped", () => {
    const rawOrder = JSON.stringify(["rename-test", "obsolete-old-id", "fork"]);
    const { order } = hydrateStackState(rawOrder, null, null, null, ALL_IDS);
    expect(order).not.toContain("obsolete-old-id");
    expect(order).toContain("rename-test");
    expect(order).toContain("fork");
  });
});

describe("hydrateStackState — corrupt / malformed stored data is safe", () => {
  it("handles corrupt rawDone gracefully (falls back to all active)", () => {
    const { cardStates } = hydrateStackState(null, null, "NOT_JSON", null, ALL_IDS);
    for (const id of ALL_IDS) {
      expect(cardStates[id]?.status).toBe("active");
    }
  });

  it("handles corrupt rawOrder gracefully (falls back to default order)", () => {
    const { order } = hydrateStackState("{bad json}", null, null, null, ALL_IDS);
    expect(order).toEqual(ALL_IDS);
  });

  it("handles corrupt rawAnswers gracefully (falls back to empty answers)", () => {
    const { cardStates } = hydrateStackState(null, "][", null, null, ALL_IDS);
    for (const id of ALL_IDS) {
      expect(cardStates[id]?.stepAnswers).toEqual({});
    }
  });

  it("handles an empty card set without throwing", () => {
    const { order, cardStates } = hydrateStackState(null, null, null, null, []);
    expect(order).toEqual([]);
    expect(cardStates).toEqual({});
  });
});
