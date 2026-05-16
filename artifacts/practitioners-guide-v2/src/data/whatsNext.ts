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
  id: "contracts" | "gmph";
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
    subtitle: "Northern Band trial window",
    whyNow:
      "The $12k portal fee is confirmed and the trial window is open — but the 2026-06-15 soft deadline is approaching fast. Every week without a council date is runway draining.",
    effortPayoff: "medium-high-payoff",
    effortLabel: "Medium effort",
    payoffLabel: "High payoff — unlocks the full agency waterfall",
    accent: "#1A5FA8",
    accentSoft: "#EBF3FB",
    accentInk: "#0F3460",
    steps: [
      {
        action: "Define what 'yes' actually looks like for the council",
        detail:
          "Before you book the meeting, write one paragraph: what scope does the council need to see in the trial to commit to an ongoing engagement? What's the minimum that proves the model? Answer this first — it shapes everything else.",
        timeEstimate: "1 hr",
      },
      {
        action: "Get a council date on the calendar",
        detail:
          "A meeting request with a specific agenda is not pressure — it's professionalism. Aim for a date before 2026-06-01 so you have runway before the 2026-06-15 soft deadline.",
        timeEstimate: "15 min",
      },
      {
        action: "Prepare the trial brief (one page, plain language)",
        detail:
          "Scope, deliverables, bounded timeline, what a 'yes' looks like at the end of it. The Ship Manifest has the structure — adapt it to the specific scope the council needs to see.",
        timeEstimate: "half day",
      },
      {
        action: "Set the Plan B trigger date in writing",
        detail:
          "Write the date (2026-06-15 or your revised equivalent) somewhere visible. Plan B is not a fallback — it's a parallel track that activates on a specific signal.",
        timeEstimate: "15 min",
      },
      {
        action: "Facilitate 807 grants application for benefits plan build-out",
        detail:
          "This is an open action item you own. Identify the grant (LFIF, FedNor CEDP, or equivalent), confirm 807 Co-op board as proponent, and move it from 'not yet identified' to 'submitted.'",
        timeEstimate: "1 hr",
      },
    ],
  },
  {
    id: "gmph",
    title: "Activate the Gilles engagement",
    subtitle: "Pitch sent · $28k of $72k used · Phase 2 starts on his reply",
    whyNow:
      "Phase 1 is complete — six weeks, $28,000, the one-pager is built and sent. The message went with it. $44,000 remains. The ball is in his court. When he replies, the next two weeks draw against that balance and the engagement is live.",
    effortPayoff: "medium-high-payoff",
    effortLabel: "Medium effort",
    payoffLabel: "$44k remaining pre-paid credit — delivery, not a new sale",
    accent: "#1f3d2e",
    accentSoft: "#edf2ee",
    accentInk: "#0f1e17",
    steps: [
      {
        action: "Book one call — not to sell, to confirm scope",
        detail:
          "The question isn't whether he wants this. It's what the first two weeks focus on. Voice tool first? Knowledge capture? Asset tracking? Let him direct it — that's how he operates best.",
        timeEstimate: "15 min",
      },
      {
        action: "Draft the two-week scope in one paragraph",
        detail:
          "Before the call: write one paragraph describing what two weeks produces and what the first draw against the balance covers. Concrete deliverables, not service descriptions. What does he hold in his hand at the end of it?",
        timeEstimate: "1 hr",
      },
      {
        action: "Confirm the drawdown structure in writing",
        detail:
          "Two weeks of tooling draws against the remaining $44,000 pre-paid balance. Any remaining balance after that clears through hourly work on objectives they define at $175/hr. Write it down and confirm on the call. No invoice ceremony — just delivery of what was always agreed.",
        timeEstimate: "15 min",
      },
    ],
  },
];
