/**
 * Shared cockpit copy. The three audience promises (band / contractor /
 * next two years) are the cockpit pitch's spine — they appear on the
 * cockpit landing (cockpit/screens/Pitch.tsx) AND in the walkthrough's
 * cockpit teaser (sections/CockpitTeaser.tsx). Sourcing them from one
 * place stops the two surfaces from drifting.
 *
 * `headline` + `italicHeadline` is what the cockpit pitch screen uses
 * for the big two-line treatment; `line` is the single-line condensation
 * the teaser uses inline. Edit both together when wording changes.
 */

export interface CockpitPromise {
  id: "band" | "contractor" | "handover";
  audience: string;
  headline: string;
  italicHeadline: string;
  /** Single-line condensation: `${headline} ${italicHeadline}` joined. */
  line: string;
  sub: string;
}

export const COCKPIT_PROMISES: readonly CockpitPromise[] = [
  {
    id: "band",
    audience: "For the band",
    headline: "A system,",
    italicHeadline: "not a person.",
    line: "A system, not a person.",
    sub: "Same screens survive every retirement. Same till. Same books. Same producer cycle.",
  },
  {
    id: "contractor",
    audience: "For you",
    headline: "A practice",
    italicHeadline: "you can sell.",
    line: "A practice you can sell.",
    sub: "Built on Square, QuickBooks, and Local Line. Tools the next contractor already knows.",
  },
  {
    id: "handover",
    audience: "For the next two years",
    headline: "A handover,",
    italicHeadline: "on purpose.",
    line: "A handover, on purpose.",
    sub: "What's only in your head right now becomes the operating manual the buyer pays for.",
  },
] as const;
