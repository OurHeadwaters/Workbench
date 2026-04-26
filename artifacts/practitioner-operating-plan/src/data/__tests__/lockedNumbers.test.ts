import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { COST_REGISTRY_BY_ID } from "../costRegistry";

/**
 * Locked-number guard tests for the V3 slide deck.
 *
 * Source of truth: .local/tasks/practitioners-guide-v2.md
 * (the founder-confirmed canonical spec — same spec that
 * artifacts/practitioners-guide-v2/src/data/__tests__/lockedNumbers.test.ts
 * guards on the V2 web handbook side).
 *
 * Scope: the V3 slide deck deliberately reframes the agency engagement
 * (six lean roles instead of eight, $35k/mo Deer Lake software contract
 * instead of $115k/mo agency aspiration). It is NOT a 1:1 mirror of V2.
 *
 * What V3 still inherits verbatim from the V2 spec — and therefore must
 * not silently drift — is locked here:
 *   • Salts net cash $1,298/yr            (V2 Salts P&L)
 *   • 807 CDP grant $20,500 net           (V2 $22k bill − $1.5k Replit hosting)
 *   • Capital Recovery $112,000           (V2 Phase 1, months 1–3)
 *   • Practitioner $18,000/mo             (V2 roster row 1)
 *   • Bookkeeper   $2,500/mo              (V2 roster row 8)
 *   • 807 bill principal $22,000          (V2 contracts.cdp807 scoping)
 *
 * If any of these drift in costRegistry.ts or in the rendered slide source,
 * these tests fail before the founder ever opens the deck.
 *
 * V3-specific headline numbers (Deer Lake $420k/yr, lean roster $33k/mo,
 * Y1 revenue $446,598 vs cost $573,800 = ($127,202) gap) are also locked
 * so a V3 typo is caught for the same reason.
 */

const SLIDES_DIR = path.resolve(import.meta.dirname, "..", "..", "pages", "slides");

function readSlide(filename: string): string {
  return readFileSync(path.join(SLIDES_DIR, filename), "utf-8");
}

describe("Slide deck — V2 numbers carried into V3 (must match V2 spec)", () => {
  it("Salts net cash is $1,298/yr everywhere it appears", () => {
    // V2 spec: Salts P&L net cash = $1,298/yr.
    const yearOne = readSlide("YearOnePicture.tsx");
    const threeLayers = readSlide("ThreeRevenueLayers.tsx");
    expect(yearOne).toContain("$1,298");
    expect(threeLayers).toContain("$1,298");
  });

  it("807 CDP grant net cash is $20,500 (= $22k bill − $1,500 Replit hosting)", () => {
    // V2 spec: 807 P&L → revenue $22k − Replit hosting $1.5k = $20.5k net.
    const yearOne = readSlide("YearOnePicture.tsx");
    const threeLayers = readSlide("ThreeRevenueLayers.tsx");
    expect(yearOne).toContain("$20,500");
    expect(threeLayers).toContain("$20,500");
  });

  it("Capital Recovery is $112,000 in the Year-1 honest-cash-picture slide", () => {
    // V2 spec: Phase 1 (Jun–Aug 2026) retires $112k of pre-existing
    // obligations to lender + family. V3 has not begun to retire it yet
    // and surfaces it honestly in the Year-1 picture.
    const yearOne = readSlide("YearOnePicture.tsx");
    expect(yearOne).toContain("$112,000");
  });

  it("Practitioner stays at $18,000/mo in TheSixPeople (V2 roster row 1)", () => {
    const sixPeople = readSlide("TheSixPeople.tsx");
    expect(sixPeople).toContain("$18,000");
  });

  it("Bookkeeper stays at $2,500/mo in TheSixPeople (V2 roster row 8)", () => {
    const sixPeople = readSlide("TheSixPeople.tsx");
    expect(sixPeople).toContain("$2,500");
  });

  it("costRegistry payback.principal is $22,000 (V2 807 bill)", () => {
    // V2 spec: original scope $24k − local discount $2k = $22k bill to 807.
    expect(COST_REGISTRY_BY_ID["payback.principal"]?.defaultValue).toBe(22000);
  });

  it("costRegistry budget.b.practitioner is $18,000/mo (V2 practitioner salary basis)", () => {
    expect(COST_REGISTRY_BY_ID["budget.b.practitioner"]?.defaultValue).toBe(18000);
  });

  it("costRegistry budget.b.bookkeeper is $2,500/mo (V2 bookkeeper roster row)", () => {
    expect(COST_REGISTRY_BY_ID["budget.b.bookkeeper"]?.defaultValue).toBe(2500);
  });
});

describe("Slide deck — V3-specific headline numbers (locked for the V3 deck only)", () => {
  it("Deer Lake recurring contract is $420,000/yr ($35,000/mo)", () => {
    // V3 software-layer anchor: Layer One revenue.
    const threeLayers = readSlide("ThreeRevenueLayers.tsx");
    const yearOne = readSlide("YearOnePicture.tsx");
    expect(threeLayers).toContain("$420,000");
    expect(threeLayers).toContain("$35,000/mo");
    expect(yearOne).toContain("$420,000");
  });

  it("Tech stack managed-services Y1 revenue is $4,800 ($400/mo × 12)", () => {
    const yearOne = readSlide("YearOnePicture.tsx");
    const threeLayers = readSlide("ThreeRevenueLayers.tsx");
    expect(yearOne).toContain("$4,800");
    expect(threeLayers).toContain("$400/mo");
  });

  it("Training is $5,500 per cohort", () => {
    const sixPeople = readSlide("TheSixPeople.tsx");
    const threeLayers = readSlide("ThreeRevenueLayers.tsx");
    expect(threeLayers).toContain("$5,500");
    expect(sixPeople).toContain("$5,500/cohort");
  });

  it("Lean roster recurring people total is $33,000/mo and variable amortized is $2,625/mo", () => {
    // V3 framing — six people instead of V2's eight.
    const sixPeople = readSlide("TheSixPeople.tsx");
    const yearOne = readSlide("YearOnePicture.tsx");
    expect(sixPeople).toContain("$33,000/mo");
    expect(sixPeople).toContain("$2,625/mo");
    expect(yearOne).toContain("$33,000/mo");
    expect(yearOne).toContain("$2,625/mo");
  });

  it("Hub Operator is $8,500/mo loaded (V3 absorbs Food Handler + Ops Manager)", () => {
    const sixPeople = readSlide("TheSixPeople.tsx");
    expect(sixPeople).toContain("$8,500");
  });

  it("Year-1 honest cash: $446,598 revenue − $573,800 cost = ($127,202) gap", () => {
    const yearOne = readSlide("YearOnePicture.tsx");
    expect(yearOne).toContain("$446,598");
    expect(yearOne).toContain("$573,800");
    expect(yearOne).toContain("($127,202)");
    // Sanity: the three numbers reconcile.
    expect(573800 - 446598).toBe(127202);
  });

  it("Casual local pod envelope is $15,000/yr (V3 row 06)", () => {
    const sixPeople = readSlide("TheSixPeople.tsx");
    expect(sixPeople).toContain("$15,000");
  });
});

describe("Slide deck — V3 manifest still ships the seven slides we test against", () => {
  it("each slide file we assert on is present on disk", () => {
    // If a slide is renamed or removed, the readFileSync calls above throw
    // ENOENT. This test gives a friendlier failure that names the missing
    // file so the founder isn't staring at a stack trace.
    const required = [
      "YearOnePicture.tsx",
      "ThreeRevenueLayers.tsx",
      "TheSixPeople.tsx",
    ];
    for (const file of required) {
      expect(() => readSlide(file)).not.toThrow();
    }
  });
});
