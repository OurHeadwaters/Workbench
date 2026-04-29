/**
 * Headwaters Step 0 paid-trial offer — single source of truth.
 *
 * The "$40,000 flat / eight weeks / solo practitioner / money back if we
 * don't deliver" offer is stated identically in four places:
 *   - Deer Lake walkthrough Ask section          (Step 0 call-out)
 *   - Deer Lake walkthrough WhatHeadwatersDelivers (in/out-of-trial framing)
 *   - Deer Lake Store deck RisksAsk slide        (Step 0 card)
 *   - Practitioner Operating Plan one-pager      (bordered call-out)
 *   - Practitioner Operating Plan payback memo §7 (refund clause)
 *
 * Every surface above imports the exported strings/arrays below and
 * renders them verbatim — wrapping markup may differ (slide, sheet,
 * legal memo) but the actual fee, payment schedule, acceptance
 * criteria, refund mechanic, and framing language must read identically
 * on every printed copy. A drift between two surfaces is exactly the
 * failure mode the lockedTrialOffer guard test (in
 * `artifacts/practitioner-operating-plan/src/data/__tests__/`) is built
 * to catch — this module exists so a single edit here flows through to
 * every consumer with no manual sync.
 *
 * Numeric constants are exported alongside the prose so guard tests can
 * reconcile the strings against the numbers ($40,000 ≡ TRIAL_FEE_USD,
 * "fourteen (14) calendar days" ≡ TRIAL_REFUND_INVOCATION_DAYS, etc.).
 */

export const TRIAL_FEE_USD = 40_000;
export const TRIAL_INSTALLMENT_USD = 20_000;
export const TRIAL_DURATION_WEEKS = 8;
export const TRIAL_REFUND_INVOCATION_DAYS = 14;
export const TRIAL_REFUND_PAYMENT_DAYS = 30;
export const TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA = 2;

/**
 * One-line pitch headline used as the first line of the call-out on
 * every surface (Ask.tsx, RisksAsk.tsx, OnePager.tsx, PaybackMemo §7
 * Verbatim block).
 */
export const TRIAL_HEADLINE =
  "$40,000 flat. Eight weeks. Solo practitioner. Money back if we don't deliver.";

/**
 * Section eyebrow used on the Step 0 call-out across all surfaces.
 * Capitalisation/style varies by surface (mono-uppercase on the
 * walkthrough, mono-uppercase on the slide, mono-uppercase on the
 * one-pager) but the literal text reads the same.
 */
export const TRIAL_EYEBROW = "Step 0 · Try us for eight weeks";

/**
 * Fee + installment description. Quoted verbatim under the "How much"
 * label on every surface.
 */
export const TRIAL_FEE_LINE =
  "$40,000 flat for eight weeks, paid $20,000 on signing and $20,000 at the start of week four.";

/**
 * What the contractor and band do not have to commit during the trial.
 * Quoted verbatim alongside the fee line on every surface.
 */
export const TRIAL_NO_TEAM_LINE =
  "No team hired. No day-one bridge required.";

/**
 * Description of the duration + the week-eight review meeting that
 * gates conversion to Step 1. Quoted under the "How long" label.
 */
export const TRIAL_HOW_LONG_LINE =
  "Eight weeks from signing. The week-eight review meeting is where the contractor judges the four acceptance criteria below and decides whether to convert into Step 1, invoke the refund, or convert to a service credit.";

/**
 * The four acceptance criteria the practitioner delivers solo in the
 * eight-week window. Each entry is exactly one sentence and is quoted
 * verbatim — every surface (call-out card, printable sheet, legal
 * §7) renders the same four strings in the same order.
 *
 * Drift was the original failure mode here (Ask.tsx had a paraphrase,
 * PaybackMemo §7 added contractual qualifiers like "council motion"
 * and "lane plan, ninety-day pilot duration") so the canonical version
 * below merges the marketing-readable headline and the contractually-
 * specific qualifiers into one sentence per criterion. Long enough to
 * be enforceable, short enough to print on a slide.
 */
export const TRIAL_ACCEPTANCE_CRITERIA: readonly string[] = [
  "Steering committee seated and charter signed — three council members, two community members named, terms of reference adopted by council motion.",
  "Six-month co-design plan adopted by the steering committee — store layout, opening hours, and pricing principles documented and accepted in committee minutes.",
  "Cold-chain pilot scope agreed in writing with the existing store — lane plan, ninety-day pilot duration, and operational hand-offs signed by both parties, ready to launch.",
  "Year-one budget and cash plan handed to council in writing — Step 1 cost basis, $90,000-a-month bill, ~$181,000 day-one bridge ask, and the 35% reinvestment line.",
] as const;

/**
 * The refund mechanic, written as a single quoted paragraph. Every
 * surface that names the refund quotes this exact string. The numbers
 * embedded in the prose ($40,000, thirty (30), fourteen (14)) reconcile
 * to the numeric constants above.
 */
export const TRIAL_REFUND_MECHANIC =
  "At the week-eight review meeting the contractor judges the four criteria above. If two or more are not met, Headwaters refunds the full $40,000 within thirty (30) calendar days. The contractor invokes the refund in writing within fourteen (14) calendar days of the review; an invocation made later than that is out of time and the trial is deemed accepted. Contractor's option: convert the $40,000 to a service credit of equal value applied against the first invoice of Step 1 instead.";

/**
 * The "Step 0 is the on-ramp" framing line that closes every Step 0
 * call-out. Reframes the trial against Step 1 (the $90,000-a-month
 * full-stack engagement) and the worst-case / best-case outcomes for
 * the band.
 */
export const TRIAL_FRAMING_LINE =
  "Step 0 is the on-ramp to Step 1, not a replacement. The team hiring, the cold-chain pilot itself, the software build, the staff training, and the day-one CAPEX all sit inside Step 1 ($90,000-a-month full-stack agency engagement), not the trial. Worst case for the band: eight weeks of paid solo work, four written deliverables in hand, full refund issued. Best case: at week eight Step 1 converts on the same paper.";

/**
 * "What survives a refund" paragraph used in the legal §7 of the
 * payback memo and (in shortened form) referenced from the framing
 * line above. The band keeps everything produced during the eight
 * weeks even if the cash is returned.
 */
export const TRIAL_WHAT_SURVIVES_REFUND =
  "Whatever has been delivered to the band during the eight weeks (steering committee minutes, co-design plan, cold-chain pilot scope, year-one budget) stays with the band at no further charge. The refund is not contingent on returning, redacting, or unlearning any of those deliverables — the band keeps what was produced with the cash that was returned.";

/**
 * "Conversion to Step 1" paragraph used in the legal §7. Names the
 * Step 1 engagement explicitly so the trial-to-engagement hand-off is
 * unambiguous.
 */
export const TRIAL_CONVERSION_TO_STEP_1 =
  "If the contractor accepts the trial deliverables at the week-eight review and elects to proceed, the trial closes and Step 1 of the Deer Lake engagement opens on the same paper — the $90,000-a-month full-stack agency engagement described in the Practitioner Operating Plan and the Deer Lake Walkthrough. The $40,000 trial fee is not credited against the Step 1 monthly fee; the trial bought planning and preparation, Step 1 buys the build.";

/**
 * Convenience: the four labelled "How much / How long / What you get /
 * How to get your money back" blocks the one-pager renders as a 2x2
 * grid. Exported as a structure so the one-pager can map over it
 * instead of hand-wiring four cells.
 */
export interface TrialOfferQuadrant {
  id: "howMuch" | "howLong" | "whatYouGet" | "howToGetMoneyBack";
  label: string;
  body: string;
}

export const TRIAL_OFFER_QUADRANTS: readonly TrialOfferQuadrant[] = [
  {
    id: "howMuch",
    label: "How much",
    body: `${TRIAL_FEE_LINE} ${TRIAL_NO_TEAM_LINE}`,
  },
  {
    id: "howLong",
    label: "How long",
    body: TRIAL_HOW_LONG_LINE,
  },
  {
    id: "whatYouGet",
    label: "What you get (solo, by the practitioner)",
    body: TRIAL_ACCEPTANCE_CRITERIA.map(
      (criterion, i) => `${i + 1}) ${criterion}`,
    ).join(" "),
  },
  {
    id: "howToGetMoneyBack",
    label: "How to get your money back",
    body: TRIAL_REFUND_MECHANIC,
  },
] as const;
