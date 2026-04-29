import { describe, expect, it } from "vitest";

import { constellation } from "@/data/constellation";

const REQUIRED_PRIMITIVE_FIELDS = [
  "id",
  "name",
  "kind",
  "summary",
] as const;

const REQUIRED_ARRAY_FIELDS = [
  "vocabulary",
  "severityLadder",
  "subShelves",
  "rejectedAlternatives",
] as const;

describe("constellation-wide primitives — structural lock", () => {
  it("exposes both registered primitives in the bundled snapshot", () => {
    const ids = constellation.constellationWidePrimitives.map((p) => p.id);
    expect(ids).toContain("the-standby");
    expect(ids).toContain("the-gate");
  });

  it.each(["the-standby", "the-gate"])(
    "%s carries every required field",
    (id) => {
      const primitive = constellation.constellationWidePrimitives.find(
        (p) => p.id === id,
      );
      expect(primitive, `${id} present in snapshot`).toBeDefined();

      for (const field of REQUIRED_PRIMITIVE_FIELDS) {
        const value = (primitive as Record<string, unknown>)[field];
        expect(typeof value, `${id}.${field} is a string`).toBe("string");
        expect((value as string).length, `${id}.${field} is non-empty`).toBeGreaterThan(0);
      }

      expect(primitive!.kind, `${id}.kind`).toBe("constellation-wide primitive");

      for (const field of REQUIRED_ARRAY_FIELDS) {
        const value = (primitive as Record<string, unknown>)[field];
        expect(Array.isArray(value), `${id}.${field} is an array`).toBe(true);
        expect(
          (value as unknown[]).length,
          `${id}.${field} is non-empty`,
        ).toBeGreaterThan(0);
      }
    },
  );

  it("hosts both primitives in Z3 (sibling pattern)", () => {
    for (const id of ["the-standby", "the-gate"] as const) {
      const primitive = constellation.constellationWidePrimitives.find(
        (p) => p.id === id,
      );
      expect(primitive!.hostZone, `${id}.hostZone`).toBe(3);
      expect(
        typeof primitive!.hostZoneRationale,
        `${id}.hostZoneRationale is a string`,
      ).toBe("string");
    }
  });

  it("declares a load-bearing principle on each primitive", () => {
    const standby = constellation.constellationWidePrimitives.find(
      (p) => p.id === "the-standby",
    );
    const gate = constellation.constellationWidePrimitives.find(
      (p) => p.id === "the-gate",
    );
    expect(standby!.principle).toBe("both-states");
    expect(gate!.principle).toBe("both-sides");
  });

  it("ladders, vocabulary, sub-shelves, and rejected alternatives keep stable shapes", () => {
    for (const id of ["the-standby", "the-gate"] as const) {
      const primitive = constellation.constellationWidePrimitives.find(
        (p) => p.id === id,
      )!;

      for (const v of primitive.vocabulary ?? []) {
        expect(typeof v.term).toBe("string");
        expect(typeof v.role).toBe("string");
      }
      for (const r of primitive.severityLadder ?? []) {
        expect(typeof r.rung).toBe("string");
        expect(typeof r.meaning).toBe("string");
      }
      for (const s of primitive.subShelves ?? []) {
        expect(typeof s.name).toBe("string");
        expect(typeof s.role).toBe("string");
      }
      for (const r of primitive.rejectedAlternatives ?? []) {
        expect(typeof r.name).toBe("string");
        expect(typeof r.reason).toBe("string");
      }
    }
  });
});
