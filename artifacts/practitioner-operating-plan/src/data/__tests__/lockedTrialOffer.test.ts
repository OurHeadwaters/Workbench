import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

import {
  TRIAL_ACCEPTANCE_CRITERIA,
  TRIAL_CONVERSION_TO_STEP_1,
  TRIAL_FEE_LINE,
  TRIAL_FRAMING_LINE,
  TRIAL_HEADLINE,
  TRIAL_HOW_LONG_LINE,
  TRIAL_NO_TEAM_LINE,
  TRIAL_OFFER_QUADRANTS,
  TRIAL_REFUND_INVOCATION_DAYS,
  TRIAL_REFUND_MECHANIC,
  TRIAL_REFUND_PAYMENT_DAYS,
  TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA,
  TRIAL_TIMELINE,
  TRIAL_WEEK_8_REVIEW_DAY,
  TRIAL_WHAT_SURVIVES_REFUND,
  TRIAL_DURATION_WEEKS,
  TRIAL_FEE_USD,
  TRIAL_INSTALLMENT_USD,
} from "@workspace/headwaters-pricing";

/**
 * Cross-surface guard: the Step 0 eight-week paid-trial offer must be
 * stated in identical words on every customer-facing surface that
 * names it. The surfaces are:
 *
 *   1. artifacts/deer-lake-walkthrough/src/sections/Ask.tsx
 *      (the Step 0 call-out above the three steps on the walkthrough deck)
 *   2. artifacts/deer-lake-walkthrough/src/sections/WhatHeadwatersDelivers.tsx
 *      (the "what's inside the trial / what's deferred to Step 1" framing block)
 *   3. artifacts/deer-lake-store-plan/src/pages/slides/RisksAsk.tsx
 *      (the highlighted Step 0 card on the Naming the Deal panel)
 *   4. artifacts/practitioner-operating-plan/src/pages/OnePager.tsx
 *      (the bordered Step 0 call-out at the top of the printable one-pager)
 *   5. artifacts/practitioner-operating-plan/src/pages/PaybackMemo.tsx §7
 *      (the formal refund clause)
 *
 * All five files render the offer from a single source of truth in
 * `lib/headwaters-pricing/src/trialOffer.ts`. Each file `import`s the
 * canonical strings and inserts them into JSX as `{TRIAL_*}` interp-
 * olations, so the import statements (asserted below) prove the
 * source-of-truth is in use without us having to render the React
 * tree, jsdom-mount the slide deck, or trip over CSS-in-JSX edge
 * cases.
 *
 * The test catches the failure mode that a prior diff introduced:
 * paraphrasing the criteria in one surface (e.g. "store layout,
 * opening hours, pricing principles") while the legal §7 added
 * different qualifiers ("terms of reference adopted by council
 * motion"), which is exactly the contractual-risk vector the founder
 * flagged when commissioning task #536.
 */

const REPO_ROOT = path.resolve(import.meta.dirname, "..", "..", "..", "..", "..");

const SURFACES = [
  "artifacts/deer-lake-walkthrough/src/sections/Ask.tsx",
  "artifacts/deer-lake-walkthrough/src/sections/WhatHeadwatersDelivers.tsx",
  "artifacts/deer-lake-store-plan/src/pages/slides/RisksAsk.tsx",
  "artifacts/practitioner-operating-plan/src/pages/OnePager.tsx",
  "artifacts/practitioner-operating-plan/src/pages/PaybackMemo.tsx",
] as const;

const readSurface = (relPath: string): string =>
  readFileSync(path.join(REPO_ROOT, relPath), "utf8");

describe("Step 0 paid-trial offer · single source of truth", () => {
  describe("canonical strings reconcile to the numeric constants", () => {
    it("trial fee constant matches the dollar amount embedded in the headline", () => {
      expect(TRIAL_FEE_USD).toBe(40_000);
      expect(TRIAL_HEADLINE).toContain("$40,000");
      expect(TRIAL_FEE_LINE).toContain("$40,000");
      expect(TRIAL_REFUND_MECHANIC).toContain("$40,000");
    });

    it("installment constant matches the $20,000 figure quoted in the fee line", () => {
      expect(TRIAL_INSTALLMENT_USD).toBe(20_000);
      expect(TRIAL_FEE_LINE).toContain("$20,000 on signing");
      expect(TRIAL_FEE_LINE).toContain("$20,000 at the start of week four");
      expect(TRIAL_FEE_USD).toBe(TRIAL_INSTALLMENT_USD * 2);
    });

    it("duration constant matches 'eight weeks' in every prose string", () => {
      expect(TRIAL_DURATION_WEEKS).toBe(8);
      expect(TRIAL_HEADLINE).toContain("Eight weeks");
      expect(TRIAL_FEE_LINE).toContain("eight weeks");
      expect(TRIAL_HOW_LONG_LINE).toContain("Eight weeks");
      expect(TRIAL_REFUND_MECHANIC).toContain("week-eight review");
    });

    it("refund payment window constant matches 'thirty (30) calendar days'", () => {
      expect(TRIAL_REFUND_PAYMENT_DAYS).toBe(30);
      expect(TRIAL_REFUND_MECHANIC).toContain("thirty (30) calendar days");
    });

    it("refund invocation window constant matches 'fourteen (14) calendar days'", () => {
      expect(TRIAL_REFUND_INVOCATION_DAYS).toBe(14);
      expect(TRIAL_REFUND_MECHANIC).toContain("fourteen (14) calendar days");
    });

    it("refund threshold constant matches the 'two or more' phrasing in the mechanic", () => {
      expect(TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA).toBe(2);
      expect(TRIAL_REFUND_MECHANIC).toContain("two or more");
    });

    it("acceptance criteria array is exactly four items, each a single sentence", () => {
      expect(TRIAL_ACCEPTANCE_CRITERIA).toHaveLength(4);
      for (const criterion of TRIAL_ACCEPTANCE_CRITERIA) {
        expect(criterion.endsWith(".")).toBe(true);
        expect(criterion.length).toBeGreaterThan(40);
        expect(criterion.length).toBeLessThan(280);
      }
    });

    it("acceptance criteria preserve the contractual qualifiers the legal review demanded", () => {
      const joined = TRIAL_ACCEPTANCE_CRITERIA.join(" || ");
      expect(joined).toContain("council motion");
      expect(joined).toContain("committee minutes");
      expect(joined).toContain("ninety-day pilot");
      expect(joined).toContain("$90,000-a-month bill");
      expect(joined).toContain("~$181,000 day-one bridge");
    });

    it("offer-quadrant grid lines up with the four canonical quadrant ids", () => {
      const ids = TRIAL_OFFER_QUADRANTS.map((q) => q.id);
      expect(ids).toEqual([
        "howMuch",
        "howLong",
        "whatYouGet",
        "howToGetMoneyBack",
      ]);
      const howMuch = TRIAL_OFFER_QUADRANTS.find((q) => q.id === "howMuch");
      expect(howMuch?.body).toContain(TRIAL_FEE_LINE);
      expect(howMuch?.body).toContain(TRIAL_NO_TEAM_LINE);
      const howToGetMoneyBack = TRIAL_OFFER_QUADRANTS.find(
        (q) => q.id === "howToGetMoneyBack",
      );
      expect(howToGetMoneyBack?.body).toBe(TRIAL_REFUND_MECHANIC);
    });
  });

  describe("every consumer surface imports from the single source of truth", () => {
    it.each(SURFACES)(
      "%s imports trial-offer constants from @workspace/headwaters-pricing",
      (relPath) => {
        const source = readSurface(relPath);
        expect(source).toContain('from "@workspace/headwaters-pricing"');
      },
    );

    it("no surface still hardcodes the Step 0 headline as a string literal", () => {
      const literalHeadline = TRIAL_HEADLINE;
      for (const relPath of SURFACES) {
        const source = readSurface(relPath);
        // The headline literal should appear nowhere outside of comments
        // — strip JSDoc-style /** ... */ blocks before searching.
        const stripped = source.replace(/\/\*[\s\S]*?\*\//g, "");
        expect(
          stripped.includes(literalHeadline),
          `${relPath} still hardcodes the Step 0 headline as a string literal — quote {TRIAL_HEADLINE} from @workspace/headwaters-pricing instead.`,
        ).toBe(false);
      }
    });

    it("no surface still hardcodes the refund-mechanic prose as a string literal", () => {
      const refundFingerprint = "thirty (30) calendar days";
      for (const relPath of SURFACES) {
        const source = readSurface(relPath);
        const stripped = source.replace(/\/\*[\s\S]*?\*\//g, "");
        expect(
          stripped.includes(refundFingerprint),
          `${relPath} still hardcodes the refund mechanic — quote {TRIAL_REFUND_MECHANIC} from @workspace/headwaters-pricing instead.`,
        ).toBe(false);
      }
    });

    it.each(SURFACES)(
      "%s references at least one trial-offer constant by name",
      (relPath) => {
        const source = readSurface(relPath);
        const referencesAtLeastOneConstant =
          /\bTRIAL_(?:HEADLINE|FEE_LINE|NO_TEAM_LINE|HOW_LONG_LINE|ACCEPTANCE_CRITERIA|REFUND_MECHANIC|FRAMING_LINE|EYEBROW|OFFER_QUADRANTS|WHAT_SURVIVES_REFUND|CONVERSION_TO_STEP_1)\b/.test(
            source,
          );
        expect(
          referencesAtLeastOneConstant,
          `${relPath} declares the @workspace/headwaters-pricing import but does not reference any TRIAL_* constant — the import is dead code.`,
        ).toBe(true);
      },
    );
  });

  describe("§7 of the payback memo (the legal anchor) quotes the canonical clauses", () => {
    const memoSource = readSurface(
      "artifacts/practitioner-operating-plan/src/pages/PaybackMemo.tsx",
    );

    it("imports the contractually-significant trial constants", () => {
      expect(memoSource).toContain("TRIAL_HEADLINE");
      expect(memoSource).toContain("TRIAL_ACCEPTANCE_CRITERIA");
      expect(memoSource).toContain("TRIAL_REFUND_MECHANIC");
      expect(memoSource).toContain("TRIAL_WHAT_SURVIVES_REFUND");
      expect(memoSource).toContain("TRIAL_CONVERSION_TO_STEP_1");
    });

    it("declares §7 with its canonical title", () => {
      expect(memoSource).toContain(
        'title="Deer Lake eight-week paid trial — refund clause"',
      );
    });

    it("the canonical 'what survives' clause references the deliverable bundle", () => {
      expect(TRIAL_WHAT_SURVIVES_REFUND).toContain("steering committee minutes");
      expect(TRIAL_WHAT_SURVIVES_REFUND).toContain("co-design plan");
      expect(TRIAL_WHAT_SURVIVES_REFUND).toContain("cold-chain pilot scope");
      expect(TRIAL_WHAT_SURVIVES_REFUND).toContain("year-one budget");
    });

    it("the canonical 'conversion to Step 1' clause names the $90,000-a-month engagement and clarifies the trial fee is not credited", () => {
      expect(TRIAL_CONVERSION_TO_STEP_1).toContain("$90,000-a-month");
      expect(TRIAL_CONVERSION_TO_STEP_1).toContain(
        "is not credited",
      );
    });
  });

  describe("eight-week trial schedule sequences the §7 acceptance criteria", () => {
    it("week-8 review day is 56 (8 weeks × 7) so calendar math reconciles", () => {
      expect(TRIAL_WEEK_8_REVIEW_DAY).toBe(56);
      expect(TRIAL_WEEK_8_REVIEW_DAY).toBe(TRIAL_DURATION_WEEKS * 7);
    });

    it("timeline is exactly TRIAL_DURATION_WEEKS rows, week numbers 1..N in order", () => {
      expect(TRIAL_TIMELINE).toHaveLength(TRIAL_DURATION_WEEKS);
      TRIAL_TIMELINE.forEach((entry, i) => {
        expect(entry.week).toBe(i + 1);
      });
    });

    it("every week has a focus, deliverables, and meetings string", () => {
      for (const entry of TRIAL_TIMELINE) {
        expect(entry.focus.length).toBeGreaterThan(0);
        expect(entry.deliverables.length).toBeGreaterThan(20);
        expect(entry.meetings.length).toBeGreaterThan(20);
      }
    });

    it("each §7 acceptance criterion is delivered in exactly one week and all four are covered", () => {
      const deliveredIndices = TRIAL_TIMELINE.map(
        (w) => w.acceptanceCriterionDelivered,
      ).filter((i): i is 0 | 1 | 2 | 3 => i !== null);
      expect(deliveredIndices).toHaveLength(TRIAL_ACCEPTANCE_CRITERIA.length);
      expect([...deliveredIndices].sort()).toEqual([0, 1, 2, 3]);
    });

    it("the steering-committee charter (criterion #1) is delivered before the cold-chain MOU (criterion #3)", () => {
      const weekFor = (idx: 0 | 1 | 2 | 3): number => {
        const entry = TRIAL_TIMELINE.find(
          (w) => w.acceptanceCriterionDelivered === idx,
        );
        if (!entry) {
          throw new Error(`No timeline week delivers criterion #${idx + 1}`);
        }
        return entry.week;
      };
      expect(weekFor(0)).toBeLessThan(weekFor(1));
      expect(weekFor(1)).toBeLessThan(weekFor(2));
      expect(weekFor(2)).toBeLessThan(weekFor(3));
    });

    it("week-8 entry names the review meeting and quotes the day-56 figure", () => {
      const week8 = TRIAL_TIMELINE.find((w) => w.week === 8);
      expect(week8).toBeDefined();
      expect(week8!.meetings).toContain("week-eight review meeting");
      expect(week8!.meetings).toContain("fifty-six (56) calendar days from signing day");
      expect(week8!.acceptanceCriterionDelivered).toBe(3);
    });

    it("week-2 names the council motion as the trial's first gating decision", () => {
      const week2 = TRIAL_TIMELINE.find((w) => w.week === 2);
      expect(week2).toBeDefined();
      expect(week2!.gatingDecision).not.toBeNull();
      expect(week2!.gatingDecision!.toLowerCase()).toContain("council");
      expect(week2!.gatingDecision!.toLowerCase()).toContain("motion");
    });

    it("walkthrough Ask and one-pager render the timeline by importing TRIAL_TIMELINE", () => {
      const ask = readSurface(
        "artifacts/deer-lake-walkthrough/src/sections/Ask.tsx",
      );
      const onepager = readSurface(
        "artifacts/practitioner-operating-plan/src/pages/OnePager.tsx",
      );
      expect(ask).toContain("TRIAL_TIMELINE");
      expect(onepager).toContain("TRIAL_TIMELINE");
    });
  });

  describe("framing line ties Step 0 to Step 1 without inventing new dollar figures", () => {
    it("names Step 1 explicitly as the $90,000-a-month engagement", () => {
      expect(TRIAL_FRAMING_LINE).toContain("$90,000-a-month");
      expect(TRIAL_FRAMING_LINE).toContain("Step 1");
    });

    it("describes both the worst-case refund and the best-case conversion", () => {
      expect(TRIAL_FRAMING_LINE).toContain("Worst case");
      expect(TRIAL_FRAMING_LINE).toContain("full refund issued");
      expect(TRIAL_FRAMING_LINE).toContain("Best case");
      expect(TRIAL_FRAMING_LINE).toContain("converts on the same paper");
    });
  });
});
