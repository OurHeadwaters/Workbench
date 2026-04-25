import { weekRange } from "../lib/dateMath";

export type StepAction = {
  kind: "ai-prompt" | "replit-task";
  label: string;
  content: string;
};

export type Step = {
  id: string;
  title: string;
  details?: string;
  doneLooksLike: string;
  source?: string;
  actions?: StepAction[];
};

export type DayPlan = {
  dayShort: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  steps: Step[];
};

export type WeekPlan = {
  weekNumber: number;
  phaseId: string;
  theme: string;
  description?: string;
  days?: DayPlan[];
};

export type Phase = {
  id: string;
  title: string;
  startWeek: number;
  endWeek: number;
  summary: string;
  weekThemes: Record<number, string>;
};

export const PHASES: Phase[] = [
  {
    id: "foundation",
    title: "Foundation",
    startWeek: 1,
    endWeek: 13,
    summary:
      "Set the rhythm and the rails. Non-negotiables, daily and weekly cadence, the case for a team, the budget, the cash flow, and the agency naming work.",
    weekThemes: {
      1: "Reset the rhythm. Non-negotiables in writing.",
      2: "Daily rhythm trial run.",
      3: "Weekly rhythm and a real Friday close-out.",
      4: "Budget v1 written down.",
      5: "Cash flow projection through Q1.",
      6: "Case for the team — costs vs. capacity.",
      7: "Agency naming — first round of options.",
      8: "Brand & IP landscape scan.",
      9: "Naming decision and action items.",
      10: "Accountability structure with Dad.",
      11: "Reinvestment plan written down.",
      12: "Q1 audit. What worked, what didn't.",
      13: "Bridge to team assembly.",
    },
  },
  {
    id: "team-assembly",
    title: "Team Assembly",
    startWeek: 14,
    endWeek: 26,
    summary:
      "Hire the five roles in order: Ops Manager, Bookkeeper, Housecleaner, Tutor, Handyman. One runbook per role, sourced and interviewed in sequence.",
    weekThemes: {
      14: "Hiring runbooks finalized for all five roles.",
      15: "Ops Manager — sourcing.",
      16: "Ops Manager — interviewing.",
      17: "Ops Manager — offer and onboarding.",
      18: "Bookkeeper — sourcing.",
      19: "Bookkeeper — interviewing and onboarding.",
      20: "Housecleaner — sourcing.",
      21: "Housecleaner — trial period.",
      22: "Tutor — sourcing.",
      23: "Tutor — first sessions and feedback.",
      24: "Handyman — sourcing.",
      25: "Handyman — first projects scoped.",
      26: "Team running. Half-year review.",
    },
  },
  {
    id: "pilot-execution",
    title: "Pilot Execution",
    startWeek: 27,
    endWeek: 48,
    summary:
      "Deer Lake store as the live pilot. Ship the operating plan, the daily rhythm, the cash flow, and the value-delivered audit on a real site.",
    weekThemes: {
      27: "Deer Lake — operating plan kickoff.",
      28: "Deer Lake — week 1 of execution.",
      29: "Deer Lake — week 2. First friction points.",
      30: "Deer Lake — week 3. Adjust the rhythm.",
      31: "Deer Lake — month-1 audit.",
      32: "Cash flow check — projection vs. actual.",
      33: "Operations Manager — first solo week.",
      34: "Bookkeeper — month-end close in production.",
      35: "Housecleaner — recurring schedule live.",
      36: "Tutor — programming feedback loop.",
      37: "Handyman — backlog burn-down.",
      38: "Mid-pilot audit. What scales, what doesn't.",
      39: "Brand & IP — apply learnings.",
      40: "Template the pilot for site #2.",
      41: "Path to scale — write the playbook.",
      42: "Reinvestment — Q3 review.",
      43: "Hiring round 2 — backfills if needed.",
      44: "Customer feedback — structured collection.",
      45: "Cash flow — Q4 projection.",
      46: "Operations review — daily and weekly rhythms.",
      47: "Pilot wrap-up plan.",
      48: "Pilot closing report.",
    },
  },
  {
    id: "year-end-audit",
    title: "Year-End Audit",
    startWeek: 49,
    endWeek: 52,
    summary:
      "Close the year cleanly. Audit value delivered, finalize the budget, document the path to scale, and set up 2027.",
    weekThemes: {
      49: "Value delivered — written audit.",
      50: "Budget reconciliation and 2027 budget v1.",
      51: "Path to scale — final document.",
      52: "Year-end close. Set 2027 anchors.",
    },
  },
];

export function getPhaseForWeek(weekNumber: number): Phase {
  for (const p of PHASES) {
    if (weekNumber >= p.startWeek && weekNumber <= p.endWeek) return p;
  }
  return PHASES[0];
}

export function getThemeForWeek(weekNumber: number): string {
  const phase = getPhaseForWeek(weekNumber);
  return phase.weekThemes[weekNumber] ?? phase.title;
}

// ---------------------------------------------------------------------------
// Detailed week plans
//
// Only the current and next two weeks are detailed step-by-step. The rest
// surface as week themes only — the user fills them in as they get closer.
// Today (April 24, 2026) lands in week 16, so weeks 16, 17, 18 are the
// detailed ones below.
// ---------------------------------------------------------------------------

const aiPrompt = (label: string, content: string): StepAction => ({
  kind: "ai-prompt",
  label,
  content,
});

const replitTask = (label: string, content: string): StepAction => ({
  kind: "replit-task",
  label,
  content,
});

const week16: WeekPlan = {
  weekNumber: 16,
  phaseId: "team-assembly",
  theme: getThemeForWeek(16),
  description:
    "Three to five Ops Manager interviews this week. Goal: a shortlist of two finalists by Friday, references in motion.",
  days: [
    {
      dayShort: "mon",
      steps: [
        {
          id: "w16-mon-1",
          title: "Open the week with the non-negotiables.",
          doneLooksLike:
            "You re-read the non-negotiables list out loud and noted any that drifted last week.",
          source: "Non-Negotiables slide",
        },
        {
          id: "w16-mon-2",
          title: "Confirm three Ops Manager interviews are scheduled.",
          details:
            "Calendar invites sent, location/link confirmed, candidates have the role one-pager.",
          doneLooksLike:
            "Three named candidates with a confirmed time on the calendar this week.",
          source: "Hiring Ops Manager runbook",
          actions: [
            aiPrompt(
              "Draft the candidate confirmation email",
              "Write a short, warm confirmation email to a candidate for an Operations Manager interview at a small family-run store in Deer Lake. Include: confirmed time, location/video link placeholder, what to expect (45 minutes, structured conversation, no take-home), who they'll be talking to, and a one-line note about the role's purpose. Tone: grounded, specific, no marketing language.",
            ),
          ],
        },
        {
          id: "w16-mon-3",
          title: "Block 90 minutes for cash flow review.",
          doneLooksLike:
            "Time blocked. Spreadsheet open. Last week's actuals reconciled against projection.",
          source: "Cash Flow slide",
        },
      ],
    },
    {
      dayShort: "tue",
      steps: [
        {
          id: "w16-tue-1",
          title: "Run the morning rhythm: 20 minutes of planning before email.",
          doneLooksLike:
            "Your three priorities for the day are written down before you open the inbox.",
          source: "Daily Rhythm slide",
        },
        {
          id: "w16-tue-2",
          title: "First Ops Manager interview.",
          details:
            "Use the structured interview guide. Same five questions for every candidate.",
          doneLooksLike:
            "Notes captured in the candidate scorecard within an hour of finishing.",
          source: "Hiring Ops Manager runbook",
          actions: [
            aiPrompt(
              "Generate the interview scorecard template",
              "Generate a one-page interview scorecard for an Operations Manager at a small family-run general store. Include: candidate name, date, five structured questions with space for notes, a 1-5 rating for each of (operational judgment, communication, ownership, learning posture, fit with a small team), a final recommendation field with three options (advance, hold, pass), and a one-line summary. Plain text, no markdown decoration.",
            ),
          ],
        },
        {
          id: "w16-tue-3",
          title: "End-of-day: log the interview into the candidate tracker.",
          doneLooksLike:
            "Tracker updated with rating, three-line summary, and next step for that candidate.",
        },
      ],
    },
    {
      dayShort: "wed",
      steps: [
        {
          id: "w16-wed-1",
          title: "Second Ops Manager interview.",
          doneLooksLike:
            "Same five questions, scorecard filled in within the hour.",
          source: "Hiring Ops Manager runbook",
        },
        {
          id: "w16-wed-2",
          title: "Mid-week budget check: are we on Q2 burn?",
          details:
            "Open the budget. Compare month-to-date spend to the planned figure. Flag anything off by more than 10%.",
          doneLooksLike:
            "One sentence written: 'On plan' or 'Off by X in category Y, action Z.'",
          source: "Budget slide",
        },
      ],
    },
    {
      dayShort: "thu",
      steps: [
        {
          id: "w16-thu-1",
          title: "Third Ops Manager interview.",
          doneLooksLike:
            "Three candidates now have full scorecards. Shortlist of two emerges by end of day.",
          source: "Hiring Ops Manager runbook",
        },
        {
          id: "w16-thu-2",
          title: "Send reference-check requests to your shortlist of two.",
          doneLooksLike:
            "Two candidates have responded with references and contact details.",
          actions: [
            aiPrompt(
              "Draft the reference request email",
              "Write a short email asking an Operations Manager finalist to send three professional references (name, role, relationship, contact info, best time to reach). Tone: respectful and direct. Mention that you'll reach out within five business days and let them know the outcome by the end of next week. Avoid marketing language and avoid hedging.",
            ),
          ],
        },
      ],
    },
    {
      dayShort: "fri",
      steps: [
        {
          id: "w16-fri-1",
          title: "Write the Friday weekly close-out.",
          details:
            "Three sections: what shipped, what slipped, what's queued for Monday.",
          doneLooksLike:
            "Close-out written and saved. Carry-overs flagged in the planner.",
          source: "Great Week slide",
        },
        {
          id: "w16-fri-2",
          title: "Call references for one shortlisted candidate.",
          doneLooksLike:
            "Two of three references reached, notes captured against the candidate scorecard.",
          source: "Hiring Ops Manager runbook",
          actions: [
            aiPrompt(
              "Generate a reference-call question set",
              "Give me a tight reference-call question set for an Operations Manager candidate at a small store. Six questions max, each one minute to answer. Cover: how you worked together, what they owned, an example of operational judgment, an example of dealing with conflict, what you'd hire them for again, and one growth area. Plain text, numbered list.",
            ),
          ],
        },
        {
          id: "w16-fri-3",
          title: "Snapshot week 16 status into the year check-in.",
          details:
            "Bookings to date, cash on hand, hours worked. Honest numbers.",
          doneLooksLike:
            "New snapshot saved with this week's date.",
          actions: [
            replitTask(
              "Add a status export to the year check-in",
              "In the Practitioner Operating Plan app, add a small 'Export latest snapshot as text' link on the Year check-in page. It should produce a short plain-text summary (date, bookings vs. plan, cash on hand, hours worked, status: on track / behind / off track) suitable for pasting into an email. No styling needed in the export. Persist nothing new — read from the existing localStorage snapshots. Keep the change to a single page and a small helper function.",
            ),
          ],
        },
      ],
    },
    {
      dayShort: "sat",
      steps: [
        {
          id: "w16-sat-1",
          title: "Light review of next week's plan.",
          doneLooksLike:
            "Twenty minutes spent reading week 17. No work, just orientation.",
        },
      ],
    },
    {
      dayShort: "sun",
      steps: [],
    },
  ],
};

const week17: WeekPlan = {
  weekNumber: 17,
  phaseId: "team-assembly",
  theme: getThemeForWeek(17),
  description:
    "Decide between the two Ops Manager finalists, make the offer, and start onboarding.",
  days: [
    {
      dayShort: "mon",
      steps: [
        {
          id: "w17-mon-1",
          title: "Final reference calls for the second shortlisted candidate.",
          doneLooksLike:
            "All references reached for both finalists. Notes captured in the tracker.",
          source: "Hiring Ops Manager runbook",
        },
        {
          id: "w17-mon-2",
          title: "Side-by-side comparison: write down the call.",
          details:
            "One paragraph each on judgment, communication, ownership, fit, and risk.",
          doneLooksLike:
            "A written recommendation, signed off by you, ready to share with Dad.",
          actions: [
            aiPrompt(
              "Structure the candidate comparison",
              "Give me a structured side-by-side comparison template for two Operations Manager finalists. Sections: brief on each candidate, head-to-head on operational judgment, communication, ownership, fit with a small family team, biggest risk for each, recommendation with reasoning. Plain text, fits on one page when printed.",
            ),
          ],
        },
      ],
    },
    {
      dayShort: "tue",
      steps: [
        {
          id: "w17-tue-1",
          title: "Review the offer letter and start date with Dad.",
          doneLooksLike:
            "Offer terms agreed: title, comp, start date, first-30-days plan.",
          source: "Accountability slide",
        },
        {
          id: "w17-tue-2",
          title: "Send the offer.",
          doneLooksLike:
            "Offer email sent with deadline to respond by end of week.",
          actions: [
            aiPrompt(
              "Draft the Ops Manager offer email",
              "Draft an offer email for an Operations Manager at a small family-run general store in Deer Lake. Include: warm one-line opening, the offer (title, start date, comp, hours), first 30 days plan in three bullets, who they'll work with, and a deadline to respond by end of week. Attach standard offer letter. Tone: direct, warm, no marketing language, no exclamation marks.",
            ),
          ],
        },
      ],
    },
    {
      dayShort: "wed",
      steps: [
        {
          id: "w17-wed-1",
          title: "Begin drafting the first-30-days onboarding plan.",
          doneLooksLike:
            "Day-by-day plan for week 1, week-by-week plan for weeks 2-4. Owners for each handoff.",
          actions: [
            replitTask(
              "Add an onboarding checklist view to the operating plan",
              "Add a small Onboarding section to the Practitioner Operating Plan app. It should let me create a checklist for a new hire (ops manager / bookkeeper / etc.), with first-30-days items grouped by week, and check items off. Persist to localStorage under the same key (pop:v1) as the rest of the app, namespaced as 'onboarding'. Keep the visual style consistent with the rest of the app. No backend.",
            ),
          ],
        },
      ],
    },
    {
      dayShort: "thu",
      steps: [
        {
          id: "w17-thu-1",
          title: "Follow up on the offer if no response yet.",
          doneLooksLike:
            "Either acceptance, decline, or a clear 'I'll respond by X.'",
        },
      ],
    },
    {
      dayShort: "fri",
      steps: [
        {
          id: "w17-fri-1",
          title: "Friday close-out for week 17.",
          doneLooksLike:
            "Written: what shipped, what slipped, what's queued for Monday.",
          source: "Great Week slide",
        },
        {
          id: "w17-fri-2",
          title: "Snapshot week 17 status into the year check-in.",
          doneLooksLike: "Snapshot saved.",
        },
      ],
    },
    { dayShort: "sat", steps: [] },
    { dayShort: "sun", steps: [] },
  ],
};

const week18: WeekPlan = {
  weekNumber: 18,
  phaseId: "team-assembly",
  theme: getThemeForWeek(18),
  description:
    "Open the bookkeeper search. Sourcing this week, interviews next week.",
  days: [
    {
      dayShort: "mon",
      steps: [
        {
          id: "w18-mon-1",
          title: "Pull up the bookkeeper role brief and refresh it.",
          doneLooksLike:
            "Role brief reflects current scope: monthly close, quarterly reporting, payroll handoff.",
          source: "Role: Bookkeeper slide",
        },
        {
          id: "w18-mon-2",
          title: "Post the bookkeeper role to two channels.",
          doneLooksLike:
            "Posting live in two places: the local accountant association and one general job board.",
          actions: [
            aiPrompt(
              "Draft the bookkeeper job posting",
              "Write a job posting for a part-time bookkeeper at a small family-run general store in Deer Lake. Cover: scope (monthly close, quarterly reports, payroll handoff, A/P + A/R), tools (QuickBooks Online), hours (~10-15/week), location (remote OK, occasional on-site), how to apply, and a one-line note about the team. Tone: grounded, direct, no exclamation marks, no marketing language. Around 250 words.",
            ),
          ],
        },
      ],
    },
    {
      dayShort: "tue",
      steps: [
        {
          id: "w18-tue-1",
          title: "Email three people in the network for bookkeeper referrals.",
          doneLooksLike:
            "Three referral asks sent. One-line response captured for each.",
        },
      ],
    },
    {
      dayShort: "wed",
      steps: [
        {
          id: "w18-wed-1",
          title: "Ops Manager — first day. Walk through the rhythm.",
          details:
            "Daily standup format, weekly close-out, where the dashboards live.",
          doneLooksLike:
            "New OM has read the daily rhythm and weekly rhythm slides and asked their first round of questions.",
          source: "Daily Rhythm + Weekly Rhythm slides",
        },
      ],
    },
    {
      dayShort: "thu",
      steps: [
        {
          id: "w18-thu-1",
          title: "Triage incoming bookkeeper applicants.",
          doneLooksLike:
            "Tracker updated with applicant name, source, one-line read, and yes/no/maybe.",
        },
      ],
    },
    {
      dayShort: "fri",
      steps: [
        {
          id: "w18-fri-1",
          title: "Friday close-out for week 18.",
          doneLooksLike:
            "Written: what shipped, what slipped, what's queued for Monday.",
        },
        {
          id: "w18-fri-2",
          title: "Snapshot week 18 status into the year check-in.",
          doneLooksLike: "Snapshot saved.",
        },
      ],
    },
    { dayShort: "sat", steps: [] },
    { dayShort: "sun", steps: [] },
  ],
};

const DETAILED_WEEKS: WeekPlan[] = [week16, week17, week18];

export function getWeekPlan(weekNumber: number): WeekPlan {
  const detailed = DETAILED_WEEKS.find((w) => w.weekNumber === weekNumber);
  if (detailed) return detailed;
  return {
    weekNumber,
    phaseId: getPhaseForWeek(weekNumber).id,
    theme: getThemeForWeek(weekNumber),
  };
}

export function getDetailedWeekNumbers(): number[] {
  return DETAILED_WEEKS.map((w) => w.weekNumber);
}

export function getWeekRange(weekNumber: number) {
  return weekRange(weekNumber);
}

export function getStepsForDay(weekNumber: number, dayShort: DayPlan["dayShort"]): Step[] {
  const wk = getWeekPlan(weekNumber);
  if (!wk.days) return [];
  return wk.days.find((d) => d.dayShort === dayShort)?.steps ?? [];
}

export function getAllStepsForWeek(weekNumber: number): Array<{ day: DayPlan["dayShort"]; step: Step }> {
  const wk = getWeekPlan(weekNumber);
  if (!wk.days) return [];
  const out: Array<{ day: DayPlan["dayShort"]; step: Step }> = [];
  for (const d of wk.days) {
    for (const s of d.steps) out.push({ day: d.dayShort, step: s });
  }
  return out;
}
