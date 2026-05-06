import { describe, expect, it } from "vitest";

import { PARTS } from "@/data/handbook";

/**
 * Structural guard for Part III and the Coda.
 *
 * History: §FL.1 (Test 001) showed that a chapter's vocabulary can
 * silently drift during a merge. The same risk applies to chapter
 * count and ordering — a dropped or reordered chapter in Part III or
 * the Coda would not surface at runtime. These assertions make any
 * such change a visible CI failure.
 *
 * Part III (roman "III") holds the practitioner-in-the-field chapters:
 * 3.1–3.7 (six moves), 3.8–3.15 (Zone 0 applied), and 3.17–3.21
 * (Zone 1–5 applied). Note that 3.16 is intentionally absent.
 *
 * The Coda (roman "CODA") holds exactly one capstone chapter:
 * "From scared to prepared" (id "coda-1").
 */

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
  "3.12",
  "3.13",
  "3.14",
  "3.15",
  "3.17",
  "3.18",
  "3.19",
  "3.20",
  "3.21",
];

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
