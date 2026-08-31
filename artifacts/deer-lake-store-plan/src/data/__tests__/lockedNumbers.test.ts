// Locked headline numbers — Deer Lake Community General Store deck
//
// PURPOSE: pin every canonical dollar figure so a future edit to a
// slide source file is caught at test time rather than discovered
// during a founder review.
//
// PATTERN: readFileSync on each slide source file, then assert the
// exact string is present. This catches both:
//   - accidental number changes ("$400–700k" → "$300–600k")
//   - copy-paste drift where the slide renders a different value
//     from what the test expects
//
// SOURCE OF TRUTH: the numbers below were extracted from the built
// dist at Spring 2026 and locked here. Any intentional change must
// update both the slide source file and this test in the same commit.
//
// CROSS-DECK ALIGNMENT ($35k/mo · $420k/yr anchor):
//   The practitioner-operating-plan declares a Layer 1 software
//   contract at $35,000/mo ($420,000/yr) as the scale reference for
//   a full-community-OS deployment. These two decks must not drift
//   apart on the Deer Lake market-size signal (~$1.6M annual leakage)
//   that underpins both. The leakage assertions in this file and the
//   $35k/mo anchor in the operating plan together define the economic
//   thesis for Deer Lake.
//
// RELEVANT FILES:
//   src/slides/SlideSituation.tsx   — market-size / leakage numbers
//   src/slides/SlideFinancials.tsx  — financial sketch / capex numbers
//   src/slides/SlideStaffing.tsx    — staffing model / community numbers

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const SLIDES_DIR = join(import.meta.dirname, "..", "..", "slides");

function readSlide(filename: string): string {
  return readFileSync(join(SLIDES_DIR, filename), "utf8");
}

// ---------------------------------------------------------------------------
// Slide 01 — Situation
// ---------------------------------------------------------------------------

describe("SlideSituation.tsx — market-size and leakage numbers", () => {
  const src = readSlide("SlideSituation.tsx");

  it("locks the annual grocery leakage anchor (~$1.6M)", () => {
    // This figure is the primary Deer Lake market-size signal. It must
    // agree with the operating-plan's Deer Lake market description.
    // Do not change without updating the practitioner-operating-plan too.
    expect(src).toContain("~$1.6M");
  });

  it("locks the one-store monopoly statistic (87%)", () => {
    // 87% of Ontario fly-in towns have exactly one store. This is the
    // structural-risk framing for why a community-owned alternative matters.
    expect(src).toContain("87%");
  });

  it("locks the Northern food basket monthly cost (~$1,680 / month)", () => {
    // Family-of-four cost at Northern price points.
    expect(src).toContain("~$1,680 / month");
  });

  it("locks the southern Ontario food basket comparison (~$1,000)", () => {
    // The contrast figure that frames the price gap.
    expect(src).toContain("~$1,000");
  });

  it("locks the Nutrition North shelf pass-through fraction (58¢)", () => {
    // Only 58¢ of each federal subsidy dollar reaches the shelf.
    // The remaining 42¢ is kept by the store operator.
    expect(src).toContain("58¢");
  });

  it("locks the federal Nutrition North subsidy total ($144.8M)", () => {
    // Total annual federal subsidy. The North West Co. captures the
    // majority of this — the community-owned model is the moat.
    expect(src).toContain("$144.8M");
  });
});

// ---------------------------------------------------------------------------
// Slide 05 — Financials · Timeline · Role
// ---------------------------------------------------------------------------

describe("SlideFinancials.tsx — financial sketch numbers", () => {
  const src = readSlide("SlideFinancials.tsx");

  it("locks the community grocery spend range (~$1.6–2.0M / yr)", () => {
    // Planning-grade range that brackets the ~$1.6M leakage figure on
    // SlideSituation.tsx — both sides of the same market-size story.
    expect(src).toContain("~$1.6–2.0M / yr");
  });

  it("locks the population basis (~870 residents at Northern price points)", () => {
    // Demand-side denominator for all market-share calculations.
    expect(src).toContain("~870 residents at Northern price points");
  });

  it("locks the year-1 target market share (30–40%)", () => {
    expect(src).toContain("30–40%");
  });

  it("locks the blended gross margin target (22–28%)", () => {
    // Set below NWC intentionally — lower pass-through is the community pitch.
    expect(src).toContain("22–28%");
  });

  it("locks the opening capex band ($400–700k)", () => {
    // Fit-out, freezers, racking, opening inventory, POS, signage.
    // V3 scenario uses the low end; V4 (right-priced) uses the high end.
    expect(src).toContain("$400–700k");
  });
});

describe("FinancialsRole.tsx — Codetry engagement model", () => {
  const src = readFileSync(
    join(import.meta.dirname, "..", "..", "pages", "slides", "FinancialsRole.tsx"),
    "utf8",
  );

  it("locks both annual engagements at $20,000", () => {
    expect(src).toContain("$20,000 / year");
    expect(src).toContain("Year 1:");
    expect(src).toContain("Year 2:");
    expect(src).toContain("new annual strategic plan");
  });

  it("shows the normal $6,000 fee as $0 only during a qualifying engagement", () => {
    expect(src).toContain("Normal $6,000 operating fee → $0");
    expect(src).toContain("qualifying active annual");
    expect(src).toContain("not added to Year 2");
    expect(src).not.toContain("$36,000 / yr");
  });
});

// ---------------------------------------------------------------------------
// Slide 03 — Staffing
// ---------------------------------------------------------------------------

describe("SlideStaffing.tsx — staffing model and community numbers", () => {
  const src = readSlide("SlideStaffing.tsx");

  it("locks the Month-1 staffing ratio (80% rotational / 20% local)", () => {
    // The wind-down arc starts here. Do not flatten this to a single
    // ratio or the 12-month transition story is lost.
    expect(src).toContain("~80% rotational / 20% local");
  });

  it("locks the Month-12 staffing ratio (20% rotational / 80% local)", () => {
    // The target state at handoff. Must stay ≥ 80% local so the
    // community-owned framing holds at the end of the first season.
    expect(src).toContain("~20% rotational / 80% local");
  });

  it("locks the working-holiday economics summary ($54k banked)", () => {
    // $25/hr × 60 hr/wk × 9 rotations ≈ $54k banked, rent paid for.
    // This is the rotational-outsider pitch — the deck cites this verbatim.
    expect(src).toContain("$54k banked, rent paid for");
  });

  it("locks the Mistissini Meechum community ownership benchmark (~84¢)", () => {
    // Cree-owned store: ~84¢ of every dollar stays in the community.
    // This is the comparison model for the community-ownership argument.
    expect(src).toContain("~84¢ on the dollar");
  });

  it("locks the local job creation target (17–20 community jobs)", () => {
    expect(src).toContain("17–20 community jobs");
  });
});

// ---------------------------------------------------------------------------
// Cross-slide consistency — leakage figures must not contradict each other
// ---------------------------------------------------------------------------

describe("cross-slide consistency — leakage anchor must agree", () => {
  const situation = readSlide("SlideSituation.tsx");
  const financials = readSlide("SlideFinancials.tsx");

  it("both slides mention the ~$1.6M leakage / spend signal", () => {
    // SlideSituation names annual leakage as ~$1.6M.
    // SlideFinancials puts the community grocery spend at ~$1.6–2.0M/yr.
    // These two figures describe the same market from different angles;
    // they must stay in the same order-of-magnitude band so the deck
    // doesn't tell contradictory stories.
    expect(situation).toContain("~$1.6M");
    expect(financials).toContain("~$1.6");
  });

  it("capex band appears only on the financials slide, not on situation", () => {
    // $400–700k is a feasibility-stage number. Putting it on the
    // situation slide would pre-anchor the council on cost before the
    // market case has been made. Guard this placement.
    expect(situation).not.toContain("$400–700k");
    expect(financials).toContain("$400–700k");
  });
});

// ---------------------------------------------------------------------------
// Cross-deck alignment — operating-plan V3 Deer Lake anchor
// ---------------------------------------------------------------------------

describe("cross-deck alignment — V3 anchor numbers", () => {
  // The practitioner-operating-plan declares a Layer 1 software contract
  // at $35,000/mo ($420,000/yr). These are the V3 Deer Lake anchors for
  // the full-community-OS deployment and must not appear in the store deck
  // at a different value (which would signal the two decks have drifted).
  //
  // The store deck does not yet quote the software contract fee directly,
  // so these tests guard against accidental insertion of a contradictory
  // monthly figure. If the recurring fee IS added to a slide in the
  // future, it must match the operating-plan anchor exactly.

  const situation = readSlide("SlideSituation.tsx");
  const financials = readSlide("SlideFinancials.tsx");
  const staffing = readSlide("SlideStaffing.tsx");
  const allSlides = situation + financials + staffing;

  it("no slide quotes a contradictory monthly recurring fee", () => {
    // If a $/mo figure is ever added, it must be $35,000/mo.
    // This test will fail if someone adds, say, "$30,000/mo" or "$40,000/mo",
    // surfacing the drift before the deck goes in front of the founder.
    const contradictoryFees = [
      "$30,000/mo",
      "$30k/mo",
      "$40,000/mo",
      "$40k/mo",
      "$25,000/mo",
      "$25k/mo",
      "$45,000/mo",
      "$45k/mo",
    ];
    for (const fee of contradictoryFees) {
      expect(
        allSlides,
        `slide source must not quote ${fee} — operating-plan V3 anchor is $35,000/mo`,
      ).not.toContain(fee);
    }
  });

  it("no slide quotes a contradictory annual contract total", () => {
    // Mirror of the monthly check. The annual anchor is $420,000/yr.
    const contradictoryAnnuals = [
      "$360,000",
      "$360k",
      "$480,000",
      "$480k",
      "$300,000",
      "$300k",
    ];
    for (const annual of contradictoryAnnuals) {
      expect(
        allSlides,
        `slide source must not quote ${annual} — operating-plan V3 annual anchor is $420,000`,
      ).not.toContain(annual);
    }
  });
});
