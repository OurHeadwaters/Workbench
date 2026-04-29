import { describe, it, expect } from "vitest";
import {
  addSubstitution,
  applyRung,
  buildEntry,
  emptyGateState,
  parseGateState,
  removeSubstitution,
  STORAGE_KEY,
  type SubstitutionInput,
} from "./gateStore";

const sampleInput: SubstitutionInput = {
  direction: "bright-to-massity",
  rung: "draft",
  brightSide: "  neighbour  ",
  massity: "  resident  ",
  category: "  Pragmatism  ",
  document: "  Bylaw 12.3  ",
  note: "  reads cleaner in the lease  ",
  loggedBy: "  steward  ",
};

describe("gateStore — schema and storage key are stable", () => {
  it("storage key is the documented z3.gate.v1 (other primitives must not collide)", () => {
    expect(STORAGE_KEY).toBe("z3.gate.v1");
  });

  it("empty state carries the schema tag so old blobs are recognized as empty", () => {
    expect(emptyGateState).toEqual({ schema: "z3.gate.v1", substitutions: [] });
  });
});

describe("gateStore — parseGateState (hydration guard)", () => {
  it("returns empty state when nothing is stored", () => {
    expect(parseGateState(null)).toEqual(emptyGateState);
    expect(parseGateState("")).toEqual(emptyGateState);
    expect(parseGateState(undefined)).toEqual(emptyGateState);
  });

  it("returns empty state when JSON is malformed (does not throw)", () => {
    expect(parseGateState("{not-json")).toEqual(emptyGateState);
  });

  it("returns empty state when the schema tag is missing or wrong", () => {
    expect(parseGateState(JSON.stringify({ substitutions: [] }))).toEqual(emptyGateState);
    expect(
      parseGateState(JSON.stringify({ schema: "z3.gate.v0", substitutions: [] })),
    ).toEqual(emptyGateState);
  });

  it("returns empty state when substitutions is not an array", () => {
    expect(
      parseGateState(JSON.stringify({ schema: "z3.gate.v1", substitutions: "oops" })),
    ).toEqual(emptyGateState);
  });

  it("rehydrates a well-formed blob verbatim (this is what 'survives reload' relies on)", () => {
    const state = {
      schema: "z3.gate.v1" as const,
      substitutions: [
        {
          id: "abc",
          direction: "bright-to-massity" as const,
          rung: "cleared" as const,
          brightSide: "neighbour",
          massity: "resident",
          category: "Pragmatism",
          loggedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    };
    expect(parseGateState(JSON.stringify(state))).toEqual(state);
  });
});

describe("gateStore — buildEntry trims free-text and drops empty optionals", () => {
  it("trims required fields and preserves direction/rung/category", () => {
    const e = buildEntry(sampleInput, "id-1", "2026-04-29T00:00:00.000Z");
    expect(e.id).toBe("id-1");
    expect(e.loggedAt).toBe("2026-04-29T00:00:00.000Z");
    expect(e.direction).toBe("bright-to-massity");
    expect(e.rung).toBe("draft");
    expect(e.brightSide).toBe("neighbour");
    expect(e.massity).toBe("resident");
    expect(e.category).toBe("Pragmatism");
    expect(e.document).toBe("Bylaw 12.3");
    expect(e.note).toBe("reads cleaner in the lease");
    expect(e.loggedBy).toBe("steward");
  });

  it("drops optional fields when they are empty/whitespace (so blank rows don't pollute the ledger)", () => {
    const e = buildEntry(
      { ...sampleInput, document: "   ", note: "", loggedBy: undefined },
      "id-2",
      "2026-04-29T00:00:00.000Z",
    );
    expect(e.document).toBeUndefined();
    expect(e.note).toBeUndefined();
    expect(e.loggedBy).toBeUndefined();
  });
});

describe("gateStore — ledger operations (the central acceptance criterion)", () => {
  const e1 = buildEntry(sampleInput, "id-1", "2026-04-29T00:00:00.000Z");
  const e2 = buildEntry(
    { ...sampleInput, brightSide: "send", massity: "remit", category: "Banking" },
    "id-2",
    "2026-04-29T00:00:01.000Z",
  );

  it("addSubstitution prepends new entries (newest-first ordering)", () => {
    const s1 = addSubstitution(emptyGateState, e1);
    const s2 = addSubstitution(s1, e2);
    expect(s2.substitutions.map((s) => s.id)).toEqual(["id-2", "id-1"]);
  });

  it("applyRung moves a single entry across rungs without touching siblings", () => {
    const seeded = addSubstitution(addSubstitution(emptyGateState, e1), e2);
    const cleared = applyRung(seeded, "id-1", "cleared");
    expect(cleared.substitutions.find((s) => s.id === "id-1")?.rung).toBe("cleared");
    expect(cleared.substitutions.find((s) => s.id === "id-2")?.rung).toBe("draft");
  });

  it("applyRung is a no-op for an unknown id", () => {
    const seeded = addSubstitution(emptyGateState, e1);
    expect(applyRung(seeded, "nope", "refused")).toEqual(seeded);
  });

  it("removeSubstitution removes only the requested entry", () => {
    const seeded = addSubstitution(addSubstitution(emptyGateState, e1), e2);
    const after = removeSubstitution(seeded, "id-1");
    expect(after.substitutions.map((s) => s.id)).toEqual(["id-2"]);
  });

  it("the four ledger rungs the manifest names are the four rungs the store accepts", () => {
    const seeded = addSubstitution(emptyGateState, e1);
    for (const rung of ["draft", "under-review", "cleared", "refused"] as const) {
      const next = applyRung(seeded, "id-1", rung);
      expect(next.substitutions[0].rung).toBe(rung);
    }
  });
});
