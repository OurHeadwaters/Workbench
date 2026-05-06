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
 * The Coda (roman "CODA") holds exactly one capstone chapter:
 * "From scared to prepared" (id "coda-1").
 *
 * Back-matter parts covered here:
 *   Open Questions  (roman "V")  — §5.1–§5.8
 *   Deep Dives      (roman "DD") — §DD.1–§DD.5
 *   Field Ledger    (roman "FL") — §FL.1–§FL.11
 *   Colophon        (roman "C")  — single chapter "C"
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

// NOTE: Chapters 3.8–3.21 (Zone 0 applied and Zone 1–5 applied) are not yet
// authored in the data. Follow-up #746 tracks adding them. This list is the
// current authoritative state; extend it as chapters are added.
const PART_III_EXPECTED_NUMBERS = [
  "3.1",
  "3.2",
  "3.3",
  "3.4",
  "3.5",
  "3.6",
  "3.7",
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

describe("handbook structure guard — Part III and Coda", () => {
  const partIII = PARTS.find((p) => p.roman === "III");
  const partCoda = PARTS.find((p) => p.roman === "CODA");

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

  describe("Coda (roman CODA) chapter count and id", () => {
    it("exists in PARTS", () => {
      expect(
        partCoda,
        'PARTS does not contain a part with roman "CODA" — the Coda may have been dropped or its roman key changed',
      ).toBeDefined();
    });

    it("contains exactly one chapter", () => {
      const count = partCoda?.chapters.length ?? 0;
      expect(
        count,
        `Coda must have exactly 1 chapter but found ${count}`,
      ).toBe(1);
    });

    it('the single Coda chapter has id "coda-1"', () => {
      const id = partCoda?.chapters[0]?.id;
      expect(
        id,
        `Coda chapter id must be "coda-1" but found "${id}"`,
      ).toBe("coda-1");
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
];

const DEEP_DIVES_EXPECTED_NUMBERS = [
  "DD.1",
  "DD.2",
  "DD.3",
  "DD.4",
  "DD.5",
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

describe("handbook structure guard — back-matter parts", () => {
  const partOpenQuestions = PARTS.find((p) => p.roman === "V");
  const partDeepDives = PARTS.find((p) => p.roman === "DD");
  const partFieldLedger = PARTS.find((p) => p.roman === "FL");
  const partColophon = PARTS.find((p) => p.roman === "C");

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

  describe("Colophon (roman C) chapter count and number", () => {
    it("exists in PARTS", () => {
      expect(
        partColophon,
        'PARTS does not contain a part with roman "C" — the Colophon may have been dropped or its roman key changed',
      ).toBeDefined();
    });

    it("contains exactly one chapter", () => {
      const count = partColophon?.chapters.length ?? 0;
      expect(
        count,
        `Colophon must have exactly 1 chapter but found ${count}`,
      ).toBe(1);
    });

    it('the single Colophon chapter has number "C"', () => {
      const num = partColophon?.chapters[0]?.number;
      expect(
        num,
        `Colophon chapter number must be "C" but found "${num}"`,
      ).toBe("C");
    });
  });
});
