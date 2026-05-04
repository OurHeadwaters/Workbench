import { describe, it, expect } from "vitest";
import { mergeCards } from "./store";
import type { SargeCard } from "./store";

function card(overrides: Partial<SargeCard> & { id: string; order: number }): SargeCard {
  return {
    weekId: "w1",
    priorityId: "ops",
    priorityLabel: "Ops",
    action: "Do the thing",
    context: null,
    status: "active",
    completedAt: null,
    barrierNote: null,
    ...overrides,
  };
}

describe("mergeCards", () => {
  it("returns remote cards sorted by order when there are no local overrides", () => {
    const remote = [
      card({ id: "c3", order: 2, action: "Third" }),
      card({ id: "c1", order: 0, action: "First" }),
      card({ id: "c2", order: 1, action: "Second" }),
    ];
    const result = mergeCards(remote, []);
    expect(result.map((c) => c.order)).toEqual([0, 1, 2]);
    expect(result.map((c) => c.action)).toEqual(["First", "Second", "Third"]);
  });

  it("preserves local status override while keeping remote order", () => {
    const remote = [
      card({ id: "c1", order: 0, action: "First", status: "active" }),
      card({ id: "c2", order: 1, action: "Second", status: "active" }),
    ];
    const local = [
      card({ id: "c1", order: 0, status: "done", completedAt: "2026-05-04T10:00:00.000Z" }),
      card({ id: "c2", order: 1, status: "active" }),
    ];
    const result = mergeCards(remote, local);

    // Order must still follow remote's order field
    expect(result.map((c) => c.order)).toEqual([0, 1]);
    // Local status wins for c1
    expect(result[0]!.id).toBe("c1");
    expect(result[0]!.status).toBe("done");
    expect(result[0]!.completedAt).toBe("2026-05-04T10:00:00.000Z");
    // c2 stays active
    expect(result[1]!.status).toBe("active");
  });

  it("preserves local barrierNote override while remote order is authoritative", () => {
    const remote = [
      card({ id: "c2", order: 1, action: "Second" }),
      card({ id: "c1", order: 0, action: "First" }),
    ];
    const local = [
      card({ id: "c2", order: 1, status: "stuck", barrierNote: "Waiting on PO" }),
    ];
    const result = mergeCards(remote, local);

    expect(result[0]!.id).toBe("c1");
    expect(result[1]!.id).toBe("c2");
    expect(result[1]!.status).toBe("stuck");
    expect(result[1]!.barrierNote).toBe("Waiting on PO");
  });

  it("remote action and context always win over local values", () => {
    const remote = [card({ id: "c1", order: 0, action: "New action from desktop", context: "Fresh context" })];
    const local = [card({ id: "c1", order: 0, action: "Old local action", context: "Old context", status: "done" })];
    const result = mergeCards(remote, local);

    expect(result[0]!.action).toBe("New action from desktop");
    expect(result[0]!.context).toBe("Fresh context");
    // Status still comes from local
    expect(result[0]!.status).toBe("done");
  });

  it("cards absent from local (new remote cards) are included as-is", () => {
    const remote = [
      card({ id: "c1", order: 0 }),
      card({ id: "c2", order: 1, action: "Brand new card" }),
    ];
    const local = [card({ id: "c1", order: 0, status: "done" })];
    const result = mergeCards(remote, local);

    expect(result).toHaveLength(2);
    expect(result[1]!.id).toBe("c2");
    expect(result[1]!.status).toBe("active");
  });

  it("returns an empty array when both remote and local are empty", () => {
    expect(mergeCards([], [])).toEqual([]);
  });
});
