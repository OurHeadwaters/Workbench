export interface CockpitPromise {
  id: "band" | "contractor" | "handover";
  audience: string;
  headline: string;
  italicHeadline: string;
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
