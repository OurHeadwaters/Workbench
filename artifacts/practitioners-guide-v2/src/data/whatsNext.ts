/**
 * whatsNext.ts — Coaching data for the "What's Next" view.
 *
 * Three focus areas, authored from the guide's existing narrative.
 * Content is curated and static — no AI generation.
 */

export type EffortPayoff =
  | "fast-low-risk"
  | "medium-high-payoff"
  | "slow-burn-high-upside";

export type TimeEstimate = "15 min" | "1 hr" | "half day";

export interface FocusStep {
  action: string;
  detail: string;
  timeEstimate: TimeEstimate;
}

export interface FocusArea {
  id: "contracts" | "gmph" | "odyssey";
  title: string;
  subtitle: string;
  whyNow: string;
  effortPayoff: EffortPayoff;
  effortLabel: string;
  payoffLabel: string;
  steps: FocusStep[];
  accent: string;
  accentSoft: string;
  accentInk: string;
}

export const FOCUS_AREAS: FocusArea[] = [
  {
    id: "contracts",
    title: "Land the next contract",
    subtitle: "Northern Band — W20 bridge capital push · deadline May 30",
    whyNow:
      "This is W20 (May 18–22). The bridge capital deadline is May 30 — ten days out. The Northern Band council window closes June 15. These two clocks are running in parallel and both require a concrete action this week, not next.",
    effortPayoff: "medium-high-payoff",
    effortLabel: "Medium effort",
    payoffLabel: "High payoff — unlocks the full agency waterfall",
    accent: "#1A5FA8",
    accentSoft: "#EBF3FB",
    accentInk: "#0F3460",
    steps: [
      {
        action: "Send written follow-up to bridge funder — request commitment by May 30",
        detail:
          "One clear paragraph: state the deadline, what a commitment looks like (email confirmation, wire reference, or signed term sheet), and the consequence of missing it (drop to $48k Scenario A floor, senior hires deferred). Direct, not threatening.",
        timeEstimate: "1 hr",
      },
      {
        action: "Confirm Northern Band council calendar — is there a date before June 15?",
        detail:
          "One question through your existing channel: is there a council or committee meeting between now and June 15 where the Headwaters engagement can be on the agenda? Get a yes or a no this week.",
        timeEstimate: "15 min",
      },
      {
        action: "Prepare the one-page Northern Band council brief",
        detail:
          "One page, no appendices. Header: what the trial is. Body: Phase 1 cost ($25k flat, 8 weeks, Bobbie solo), Phase 2 rates ($175/hr + Tyler at $70/hr), what the council can stop at any time, what the community keeps. Footer: contact and the ask (30-minute meeting or BCR date).",
        timeEstimate: "half day",
      },
      {
        action: "Set the Plan B trigger date in writing",
        detail:
          "Write June 15 somewhere visible. If no council date confirmed by then, Plan B activates — not as a fallback, as a parallel track. One flag is information. Two consecutive weeks flagged is the trigger.",
        timeEstimate: "15 min",
      },
      {
        action: "Friday: three-column week review",
        detail:
          "Bridge Capital (committed / pending / no response) · Northern Band (meeting confirmed / in progress / no date) · Week 21 actions. File the note. This is the weekly habit.",
        timeEstimate: "15 min",
      },
    ],
  },
  {
    id: "gmph",
    title: "Activate the Gilles engagement",
    subtitle: "Pitch sent · $28k of $72k used · Phase 2 starts on his reply",
    whyNow:
      "Phase 1 is complete — six weeks, $28,000, the one-pager is built and sent. $44,000 remains pre-paid. This week: a 15-minute Gilles check-in is on the W20 plan (Thursday). Use it to read the Northern Band council mood and confirm what the first two weeks of Phase 2 focus on.",
    effortPayoff: "medium-high-payoff",
    effortLabel: "Medium effort",
    payoffLabel: "$44k remaining pre-paid credit — delivery, not a new sale",
    accent: "#1f3d2e",
    accentSoft: "#edf2ee",
    accentInk: "#0f1e17",
    steps: [
      {
        action: "Thursday check-in call — 15 minutes",
        detail:
          "Two questions: what's his read of the council's mood, and is there any back-channel intel on the June calendar? Also: what does he want the first two weeks of Phase 2 to focus on — voice tool, knowledge capture, or asset tracking? Let him direct it.",
        timeEstimate: "15 min",
      },
      {
        action: "Draft the two-week Phase 2 scope before the call",
        detail:
          "One paragraph: what two weeks produces, what the first draw against the $44k balance covers. Concrete deliverables — not service descriptions. What does he hold in his hand at the end of week two?",
        timeEstimate: "1 hr",
      },
      {
        action: "Confirm the drawdown structure on the call",
        detail:
          "Two weeks of tooling draws against the remaining $44k pre-paid balance. Any remaining balance after that clears through hourly at $175/hr on objectives he defines. Write it down and confirm. No invoice ceremony — just delivery of what was always agreed.",
        timeEstimate: "15 min",
      },
    ],
  },
  {
    id: "odyssey",
    title: "Odyssey launch — follow through this week",
    subtitle: "Live as of May 18 · intake form live · PWA link needs confirming",
    whyNow:
      "The Odyssey section and /odyssey page went live today (May 18). The intake form is collecting responses. Three things need to happen this week to make it real: confirm the PWA Pioneer Path link, share it in the right place, and prep the first voice note script for Phase 01.",
    effortPayoff: "fast-low-risk",
    effortLabel: "Low effort this week",
    payoffLabel: "Activates the practice layer — the Odyssey becomes real when the first person completes Station 1",
    accent: "#7c4a1e",
    accentSoft: "#fdf3e8",
    accentInk: "#3d2008",
    steps: [
      {
        action: "Confirm and update the PWA Pioneer Path link",
        detail:
          "The 'Open the Pioneer Path →' button on /odyssey currently uses a placeholder URL. Get the actual published URL for the Codetry Handbook PWA and paste it in — one edit, two minutes.",
        timeEstimate: "15 min",
      },
      {
        action: "Share the Odyssey page in one targeted place",
        detail:
          "Not a broadcast — one specific person or group who is already organising locally and would benefit from this. Send the link directly with one sentence of context. Watch the intake form for their response.",
        timeEstimate: "15 min",
      },
      {
        action: "Write the Phase 01 voice note script (Station 1 — The Saltbox)",
        detail:
          "Pre-recorded guidance for Station 1. The prompt: 'Name the work that already exists. Find the substrate you're standing on.' Three minutes max. Write the script first — one page, plain spoken language, no jargon. Record when the script feels right.",
        timeEstimate: "1 hr",
      },
      {
        action: "Draft the Trail Signal group rules (one short doc)",
        detail:
          "Private group for field notes — async, low-pressure. Three rules maximum. What belongs there, what doesn't, and how often Bobbie checks in. Publish it before the first person completes Station 1.",
        timeEstimate: "1 hr",
      },
    ],
  },
];
