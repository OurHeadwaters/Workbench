import { describe, expect, it } from "vitest";

import { PARTS } from "@/data/handbook";

/**
 * Structural guard for the Prologue, Part I, Part II, Part III, the Coda,
 * and the four back-matter parts.
 *
 * History: §FL.1 (Test 001) showed that a chapter's vocabulary can
 * silently drift during a merge. The same risk applies to chapter
 * count and ordering — a dropped or reordered chapter in any part
 * would not surface at runtime. These assertions make any such change
 * a visible CI failure.
 *
 * Prologue (roman "P") holds exactly two chapters: P.1 and P.2.
 *
 * Part I (roman "I") holds eight chapters: 1.0–1.7.
 *
 * Part II (roman "II") holds eleven chapters: 2.0 (intro), 2.1–2.7
 * (seven zone chapters built from allZones = zones + preZone),
 * 2.8–2.9 (two constellation-wide primitive chapters), and 2.10
 * (closing reflection). Note: if the constellation.json zone or
 * primitive count changes, this test will fail by design.
 *
 * Part III (roman "III") holds the practitioner-in-the-field chapters
 * currently authored: 3.1–3.7 (the six moves). Chapters 3.8–3.21 are
 * planned future content; this list must be extended as they are written.
 *
 * The Conclusion (roman "CODA") holds exactly two chapters in order:
 * "From scared to prepared" (id "coda-1") then "The Source" (id "5-6").
 *
 * Back-matter parts covered here:
 *   Open Questions  (roman "V")  — §5.1–§5.8
 *   Deep Dives      (roman "DD") — §DD.1–§DD.5
 *   Field Ledger    (roman "FL") — §FL.1–§FL.11
 */

const PART_PROLOGUE_EXPECTED_NUMBERS = ["P.1", "P.2"];

const PART_I_EXPECTED_NUMBERS = [
  "1.0",
  "1.1",
  "1.2",
  "1.3",
  "1.4",
  "1.5",
  "1.6",
  "1.7",
];

const PART_II_EXPECTED_NUMBERS = [
  "2.0",
  "2.1",
  "2.2",
  "2.3",
  "2.4",
  "2.5",
  "2.6",
  "2.7",
  "2.8",
  "2.9",
  "2.10",
];

// Extended 2026-05-07: Part III chapters 3.8–3.11 added (practitioner in the
// field: practice, the host, numbers, the feast). Follow-up #746 for 3.12+.
const PART_III_EXPECTED_NUMBERS = [
  "3.1",
  "3.2",
  "3.3",
  "3.4",
  "3.5",
  "3.6",
  "3.7",
  "3.8",
  "3.9",
  "3.10",
  "3.11",
];

describe("handbook structure guard — Prologue, Parts I and II", () => {
  const partP = PARTS.find((p) => p.roman === "P");
  const partI = PARTS.find((p) => p.roman === "I");
  const partII = PARTS.find((p) => p.roman === "II");

  describe("Prologue (roman P) chapter count and ordering", () => {
    it("exists in PARTS", () => {
      expect(
        partP,
        'PARTS does not contain a part with roman "P" — the Prologue may have been dropped or its roman key changed',
      ).toBeDefined();
    });

    it("contains exactly the expected chapter numbers in order", () => {
      const actual = (partP?.chapters ?? []).map((ch) => ch.number);
      expect(
        actual,
        `Prologue chapter numbers do not match. Expected:\n  ${PART_PROLOGUE_EXPECTED_NUMBERS.join(", ")}\nGot:\n  ${actual.join(", ")}`,
      ).toEqual(PART_PROLOGUE_EXPECTED_NUMBERS);
    });
  });

  describe("Part I (roman I) chapter count and ordering", () => {
    it("exists in PARTS", () => {
      expect(
        partI,
        'PARTS does not contain a part with roman "I" — the part may have been dropped or its roman key changed',
      ).toBeDefined();
    });

    it("contains exactly the expected chapter numbers in order", () => {
      const actual = (partI?.chapters ?? []).map((ch) => ch.number);
      expect(
        actual,
        `Part I chapter numbers do not match. Expected:\n  ${PART_I_EXPECTED_NUMBERS.join(", ")}\nGot:\n  ${actual.join(", ")}`,
      ).toEqual(PART_I_EXPECTED_NUMBERS);
    });
  });

  describe("Part II (roman II) chapter count and ordering", () => {
    it("exists in PARTS", () => {
      expect(
        partII,
        'PARTS does not contain a part with roman "II" — the part may have been dropped or its roman key changed',
      ).toBeDefined();
    });

    it("contains exactly the expected chapter numbers in order", () => {
      const actual = (partII?.chapters ?? []).map((ch) => ch.number);
      expect(
        actual,
        `Part II chapter numbers do not match. Expected:\n  ${PART_II_EXPECTED_NUMBERS.join(", ")}\nGot:\n  ${actual.join(", ")}`,
      ).toEqual(PART_II_EXPECTED_NUMBERS);
    });
  });
});

describe("handbook structure guard — Part III and Conclusion", () => {
  const partIII = PARTS.find((p) => p.roman === "III");
  const partConclusion = PARTS.find((p) => p.roman === "CODA");

  describe("Part III (roman III) chapter count and ordering", () => {
    it("exists in PARTS", () => {
      expect(
        partIII,
        'PARTS does not contain a part with roman "III" — the part may have been dropped or its roman key changed',
      ).toBeDefined();
    });

    it("contains exactly the expected chapter numbers in order", () => {
      const actual = (partIII?.chapters ?? []).map((ch) => ch.number);
      expect(
        actual,
        `Part III chapter numbers do not match. Expected:\n  ${PART_III_EXPECTED_NUMBERS.join(", ")}\nGot:\n  ${actual.join(", ")}`,
      ).toEqual(PART_III_EXPECTED_NUMBERS);
    });
  });

  describe("Conclusion (roman CODA) chapter count and ids", () => {
    it("exists in PARTS", () => {
      expect(
        partConclusion,
        'PARTS does not contain a part with roman "CODA" — the Conclusion may have been dropped or its roman key changed',
      ).toBeDefined();
    });

    it("contains exactly two chapters", () => {
      const count = partConclusion?.chapters.length ?? 0;
      expect(
        count,
        `Conclusion must have exactly 2 chapters but found ${count}`,
      ).toBe(2);
    });

    it('the first Conclusion chapter has id "coda-1"', () => {
      const id = partConclusion?.chapters[0]?.id;
      expect(
        id,
        `First Conclusion chapter id must be "coda-1" but found "${id}"`,
      ).toBe("coda-1");
    });

    it('the second Conclusion chapter has id "5-6"', () => {
      const id = partConclusion?.chapters[1]?.id;
      expect(
        id,
        `Second Conclusion chapter id must be "5-6" but found "${id}"`,
      ).toBe("5-6");
    });
  });
});

// ─── Back-matter structural guards ───────────────────────────────────────────

const OPEN_QUESTIONS_EXPECTED_NUMBERS = [
  "5.1",
  "5.2",
  "5.3",
  "5.4",
  "5.5",
  "5.6",
  "5.7",
  "5.8",
  "5.9",
];

const DEEP_DIVES_EXPECTED_NUMBERS = [
  "DD.1",
  "DD.2",
  "DD.3",
  "DD.4",
  "DD.5",
  "DD.6",
  "DD.7",
  // Appendix: six passages held from the main chapters
  "DD.A",
  "DD.I",
  "DD.II",
  "DD.III",
  "DD.IV",
  "DD.V",
  "DD.VI",
];

const FIELD_LEDGER_EXPECTED_NUMBERS = [
  "FL.1",
  "FL.2",
  "FL.3",
  "FL.4",
  "FL.5",
  "FL.6",
  "FL.7",
  "FL.8",
  "FL.9",
  "FL.10",
  "FL.11",
];

const GOVERNANCE_APPENDIX_EXPECTED_NUMBERS = [
  "APP.0",
  "APP.1",
  "APP.2",
  "APP.3",
  "APP.4",
  "APP.5",
  "APP.6",
  "APP.7",
];

describe("handbook structure guard — back-matter parts", () => {
  const partOpenQuestions = PARTS.find((p) => p.roman === "V");
  const partDeepDives = PARTS.find((p) => p.roman === "DD");
  const partFieldLedger = PARTS.find((p) => p.roman === "FL");
  const partGovernanceAppendix = PARTS.find((p) => p.roman === "APP");

  describe("Open Questions (roman V) chapter count and ordering", () => {
    it("exists in PARTS", () => {
      expect(
        partOpenQuestions,
        'PARTS does not contain a part with roman "V" — Open Questions may have been dropped or its roman key changed',
      ).toBeDefined();
    });

    it("contains exactly the expected chapter numbers in order", () => {
      const actual = (partOpenQuestions?.chapters ?? []).map((ch) => ch.number);
      expect(
        actual,
        `Open Questions chapter numbers do not match. Expected:\n  ${OPEN_QUESTIONS_EXPECTED_NUMBERS.join(", ")}\nGot:\n  ${actual.join(", ")}`,
      ).toEqual(OPEN_QUESTIONS_EXPECTED_NUMBERS);
    });
  });

  describe("Deep Dives (roman DD) chapter count and ordering", () => {
    it("exists in PARTS", () => {
      expect(
        partDeepDives,
        'PARTS does not contain a part with roman "DD" — Deep Dives may have been dropped or its roman key changed',
      ).toBeDefined();
    });

    it("contains exactly the expected chapter numbers in order", () => {
      const actual = (partDeepDives?.chapters ?? []).map((ch) => ch.number);
      expect(
        actual,
        `Deep Dives chapter numbers do not match. Expected:\n  ${DEEP_DIVES_EXPECTED_NUMBERS.join(", ")}\nGot:\n  ${actual.join(", ")}`,
      ).toEqual(DEEP_DIVES_EXPECTED_NUMBERS);
    });
  });

  describe("Field Ledger (roman FL) chapter count and ordering", () => {
    it("exists in PARTS", () => {
      expect(
        partFieldLedger,
        'PARTS does not contain a part with roman "FL" — Field Ledger may have been dropped or its roman key changed',
      ).toBeDefined();
    });

    it("contains exactly the expected chapter numbers in order", () => {
      const actual = (partFieldLedger?.chapters ?? []).map((ch) => ch.number);
      expect(
        actual,
        `Field Ledger chapter numbers do not match. Expected:\n  ${FIELD_LEDGER_EXPECTED_NUMBERS.join(", ")}\nGot:\n  ${actual.join(", ")}`,
      ).toEqual(FIELD_LEDGER_EXPECTED_NUMBERS);
    });
  });

  describe("Governance Appendix (roman APP) chapter count and ordering", () => {
    it("exists in PARTS", () => {
      expect(
        partGovernanceAppendix,
        'PARTS does not contain a part with roman "APP" — Governance Appendix may have been dropped or its roman key changed',
      ).toBeDefined();
    });

    it("contains exactly the expected chapter numbers in order", () => {
      const actual = (partGovernanceAppendix?.chapters ?? []).map(
        (ch) => ch.number,
      );
      expect(
        actual,
        `Governance Appendix chapter numbers do not match. Expected:\n  ${GOVERNANCE_APPENDIX_EXPECTED_NUMBERS.join(", ")}\nGot:\n  ${actual.join(", ")}`,
      ).toEqual(GOVERNANCE_APPENDIX_EXPECTED_NUMBERS);
    });

    it("has kind backMatter", () => {
      expect(partGovernanceAppendix?.kind).toBe("backMatter");
    });
  });

});
