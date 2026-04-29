import { describe, expect, it } from "vitest";

import { constellation } from "@/data/constellation";
import { CHAPTERS } from "@/data/handbook";
import { FOUNDING_EXAMPLE_COMMENTARY } from "@/data/foundingExamples";

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

  it("each registered primitive has matching founding-example commentary", () => {
    const manifestIds = constellation.constellationWidePrimitives.map(
      (p) => p.id,
    );
    const commentaryIds = FOUNDING_EXAMPLE_COMMENTARY.map((c) => c.primitiveId);
    for (const id of manifestIds) {
      expect(
        commentaryIds,
        `commentary registered for primitive "${id}"`,
      ).toContain(id);
    }
    for (const c of FOUNDING_EXAMPLE_COMMENTARY) {
      expect(
        manifestIds,
        `commentary entry "${c.primitiveId}" matches a primitive in the snapshot`,
      ).toContain(c.primitiveId);
      expect(
        c.titleSuffix.length,
        `${c.primitiveId}.titleSuffix is non-empty`,
      ).toBeGreaterThan(0);
      expect(
        c.whyTwoSided.length,
        `${c.primitiveId}.whyTwoSided is non-empty`,
      ).toBeGreaterThan(0);
      expect(
        c.crossZoneReads.length,
        `${c.primitiveId}.crossZoneReads is non-empty`,
      ).toBeGreaterThan(0);
      expect(
        c.takeaway.pull.length,
        `${c.primitiveId}.takeaway.pull is non-empty`,
      ).toBeGreaterThan(0);
      expect(
        c.takeaway.closingPara.length,
        `${c.primitiveId}.takeaway.closingPara is non-empty`,
      ).toBeGreaterThan(0);
      expect(
        c.openQuestions.length,
        `${c.primitiveId}.openQuestions is non-empty`,
      ).toBeGreaterThan(0);
    }
  });

  it("Standby and Gate chapters render as separate Part III worked examples", () => {
    const standbyChapter = CHAPTERS.find(
      (ch) =>
        ch.partRoman === "III" && ch.title.startsWith("The Standby"),
    );
    const gateChapter = CHAPTERS.find(
      (ch) => ch.partRoman === "III" && ch.title.startsWith("The Gate"),
    );

    expect(standbyChapter, "Standby chapter exists in Part III").toBeDefined();
    expect(gateChapter, "Gate chapter exists in Part III").toBeDefined();

    // Title suffixes must be distinct — the bug we just fixed was both
    // chapters carrying the literal suffix "the constellation's first
    // non-zone primitive".
    expect(
      standbyChapter!.title,
      "Standby title carries the first-non-zone-primitive framing",
    ).toContain("first non-zone primitive");
    expect(
      gateChapter!.title,
      "Gate title does NOT claim to be the first non-zone primitive",
    ).not.toContain("first non-zone primitive");
    expect(standbyChapter!.title).not.toBe(gateChapter!.title);

    // The Gate's chapter content must not reference Standby in its
    // takeaway. Before the fix, the closing para was hardcoded to read
    // "The Standby is the constellation's first non-zone primitive..."
    // on every primitive's chapter, including The Gate's. Lock that out.
    const gateText = gateChapter!.blocks
      .map((b) => ("text" in b ? b.text : ""))
      .join("\n");
    expect(
      gateText,
      "Gate chapter no longer leaks Standby's hardcoded closing paragraph",
    ).not.toMatch(/The Standby is the constellation's first non-zone primitive/);
    expect(
      gateText,
      "Gate chapter's cross-zone reads do not mention standby budget envelopes",
    ).not.toMatch(/standby budget envelope/);

    // Positive marker — the Gate chapter must surface its own load-
    // bearing principle, not silently inherit Standby's. This guards
    // against a future commentary swap where the negative checks above
    // pass but the wrong primitive's prose is still being rendered.
    expect(
      gateText,
      "Gate chapter surfaces its own load-bearing principle (both-sides / contextual)",
    ).toMatch(/both-sides|contextual/);

    // Each chapter must surface an Open questions section (the
    // exploratory addition this pass installed).
    const standbyHasOpenQuestions = standbyChapter!.blocks.some(
      (b) => b.kind === "subhead" && b.text === "Open questions",
    );
    const gateHasOpenQuestions = gateChapter!.blocks.some(
      (b) => b.kind === "subhead" && b.text === "Open questions",
    );
    expect(standbyHasOpenQuestions, "Standby chapter has Open questions").toBe(
      true,
    );
    expect(gateHasOpenQuestions, "Gate chapter has Open questions").toBe(true);
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
