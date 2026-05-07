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

export interface FocusStep {
  action: string;
  detail: string;
}

export interface FocusArea {
  id: "contracts" | "salts" | "brightside";
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
      },
      {
        action: "Get a council date on the calendar",
        detail:
          "A meeting request with a specific agenda is not pressure — it's professionalism. Aim for a date before 2026-06-01 so you have runway before the 2026-06-15 soft deadline.",
      },
      {
        action: "Prepare the trial brief (one page, plain language)",
        detail:
          "Scope, deliverables, bounded timeline, what a 'yes' looks like at the end of it. The Ship Manifest has the structure — adapt it to the specific scope the council needs to see.",
      },
      {
        action: "Set the Plan B trigger date in writing",
        detail:
          "Write the date (2026-06-15 or your revised equivalent) somewhere visible. Plan B is not a fallback — it's a parallel track that activates on a specific signal.",
      },
      {
        action: "Facilitate 807 grants application for benefits plan build-out",
        detail:
          "This is an open action item you own. Identify the grant (LFIF, FedNor CEDP, or equivalent), confirm 807 Co-op board as proponent, and move it from 'not yet identified' to 'submitted.'",
      },
    ],
  },
  {
    id: "salts",
    title: "Grow Salts revenue",
    subtitle: "Parr's Jars — build the actuals",
    whyNow:
      "Salts is the only cash-positive stream running right now with zero debt load. Solidifying real batch records and market numbers takes the model off assumptions and onto a foundation you can stand on.",
    effortPayoff: "fast-low-risk",
    effortLabel: "Fast / Low risk",
    payoffLabel: "Locks real numbers into the model — stops the guessing",
    accent: "#3A6B35",
    accentSoft: "#EAF3E9",
    accentInk: "#1F4A1A",
    steps: [
      {
        action: "Track the next three batches against real yield",
        detail:
          "The 1,190 jars/yr planning target assumes a batch size that hasn't been measured. After the next three batches, you'll know actual yield per batch — this single number changes the whole model.",
      },
      {
        action: "Confirm the Dryden Farmers' Market stall rate",
        detail:
          "The model uses $30/stall. Verify the actual rate, setup cost, and travel time. Run the break-even math: what does a market day need to gross to be worth the Saturday?",
      },
      {
        action: "Follow up on the 9-case wholesale backlog",
        detail:
          "This is the closest thing to a real number in the Salts model — existing accounts with a backlog of orders. Following up on these converts a planning assumption into confirmed revenue.",
      },
      {
        action: "Log actual vs. model at month-end",
        detail:
          "One simple habit: after each month, write down what the model predicted vs. what came in (jars sold, market revenue, COGS). Three months of this gives you a real per-jar cost and channel mix.",
      },
      {
        action: "Decide on the maple syrup case pivot (8 → 12 cases)",
        detail:
          "The model notes it sells out early and a 12-case run is doable with staff. This is a low-effort, fast-payoff decision — decide yes or no and log it so the model reflects what's actually happening.",
      },
    ],
  },
  {
    id: "brightside",
    title: "Advance Brightside",
    subtitle: "RT-LTC SaaS — first pilot conversation",
    whyNow:
      "Pre-revenue, but the pricing and cost basis are fully modelled. The only thing standing between 'scenario' and 'plan' is a first pilot conversation with an LTC administrator. That conversation costs nothing to start.",
    effortPayoff: "slow-burn-high-upside",
    effortLabel: "Slow burn",
    payoffLabel: "High upside — founder's only profit-share line in the model",
    accent: "#4A2080",
    accentSoft: "#F0EAFA",
    accentInk: "#2A0F5A",
    steps: [
      {
        action: "Name one target LTC administrator and make contact",
        detail:
          "Not a list — one name, one outreach. A warm introduction through the health-authority network is the fastest path. The goal is not a sale; it's a 20-minute conversation to test the framing.",
      },
      {
        action: "Draft the one-paragraph pilot pitch",
        detail:
          "What does a Tier 1 facility get? Why does it cost what it costs? What does the pilot ask them to commit to? Write this before the call so you're not improvising the value proposition.",
      },
      {
        action: "Clarify what a signed pilot agreement looks like",
        detail:
          "Not a full contract — a one-page letter of intent: facility commits to 90-day pilot at the Tier 1 rate ($" +
          "195/mo + $500 setup), Brightside commits to onboarding and support. This is the first revenue event. Define it clearly.",
      },
      {
        action: "Map the PHIPA compliance path",
        detail:
          "LTC administrators will ask. The $5k audit is already in the cost basis. Know who does it, how long it takes, and what the output looks like — this removes the biggest perceived risk for the buyer.",
      },
      {
        action: "Set a milestone date for the first revenue window",
        detail:
          "The model says 'Oct 2026 onward.' Make that real: what has to be true by what date for first revenue to be possible? Name the milestone, date it, and put it somewhere you'll see it.",
      },
    ],
  },
];

