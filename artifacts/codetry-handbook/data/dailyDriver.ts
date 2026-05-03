// Daily Driver — adaptive goal-to-action planning system.
//
// A Daily Driver is a personal project container built through a
// backwards-mapping wizard: dream → done → milestones → today.
// Goal kind determines which question path the wizard takes.
// Each driver holds scenarios (alternative paths) and pivotal info
// cards (sticky context that keeps the plan on course when reality
// gets bumpy).

export type GoalKind =
  | "offer"      // building something to sell or trade
  | "target"     // hitting a financial or measurable number
  | "creative"   // making something that didn't exist before
  | "habit"      // building or breaking a personal pattern
  | "community"; // moving something forward with other people

export const GOAL_KIND_LABELS: Record<GoalKind, string> = {
  offer:     "Offer or product",
  target:    "Financial target",
  creative:  "Creative project",
  habit:     "Daily habit or pattern",
  community: "Community or team goal",
};

export const GOAL_KIND_DESCRIPTIONS: Record<GoalKind, string> = {
  offer:     "Build something to sell or trade",
  target:    "Hit a specific number or milestone",
  creative:  "Make something that didn't exist before",
  habit:     "Change how you show up day to day",
  community: "Move something forward with other people",
};

export type GoalHorizon = "done" | "3mo" | "1mo" | "2wk" | "today";

export const HORIZON_LABELS: Record<GoalHorizon, string> = {
  done:  "The finish line",
  "3mo": "Three months out",
  "1mo": "One month out",
  "2wk": "Two weeks out",
  today: "This week",
};

// A node in the backwards-mapped goal tree.
export type GoalNode = {
  horizon: GoalHorizon;
  text: string;
};

// A scenario — one path the goal might take.
export type DriverScenario = {
  id: string;
  name: string;
  hypothesis: string;
  dailyAction: string;
  status: "active" | "scratched";
  createdAt: number;
};

// A pivotal info card — context that keeps the driver on course.
export type PivotalCard = {
  id: string;
  label: string;
  value: string;
  updatedAt: number;
};

// A daily log entry.
export type DailyLog = {
  date: string;
  action: string;
  bump?: string;
};

// The main driver container.
export type DailyDriver = {
  id: string;
  name: string;
  kind: GoalKind;
  dream: string;
  doneState: string;
  goalNodes: GoalNode[];
  scenarios: DriverScenario[];
  pivotalCards: PivotalCard[];
  activeScenarioId?: string;
  todayAction: string;
  isPrimary: boolean;
  status: "active" | "paused" | "complete";
  logs: DailyLog[];
  createdAt: number;
  lastTouchedAt: number;
};

// ── Wizard ─────────────────────────────────────────────────────────────────

export type WizardStepKind = "choice" | "text-sm" | "text-lg";

export type WizardChoice = {
  value: string;
  label: string;
  description: string;
};

export type WizardStep = {
  id: string;
  eyebrow: string;
  question: string;
  hint?: string;
  kind: WizardStepKind;
  choices?: WizardChoice[];
  placeholder?: string;
  field: keyof WizardAnswers;
};

export type WizardAnswers = {
  kind: GoalKind | "";
  name: string;
  dream: string;
  doneState: string;
  threeMonths: string;
  oneMonth: string;
  twoWeeks: string;
  todayAction: string;
  specifics: string;
  edge: string;
  blocker: string;
  risk: string;
  scenarioName: string;
};

export const WIZARD_DEFAULTS: WizardAnswers = {
  kind: "",
  name: "",
  dream: "",
  doneState: "",
  threeMonths: "",
  oneMonth: "",
  twoWeeks: "",
  todayAction: "",
  specifics: "",
  edge: "",
  blocker: "",
  risk: "",
  scenarioName: "",
};

export const UNIVERSAL_STEPS_BEFORE: WizardStep[] = [
  {
    id: "kind",
    eyebrow: "WHAT KIND",
    question: "What kind of goal is this?",
    hint: "Be honest — this shapes every question that follows.",
    kind: "choice",
    field: "kind",
    choices: (Object.keys(GOAL_KIND_LABELS) as GoalKind[]).map((k) => ({
      value: k,
      label: GOAL_KIND_LABELS[k],
      description: GOAL_KIND_DESCRIPTIONS[k],
    })),
  },
  {
    id: "name",
    eyebrow: "NAME IT",
    question: "What do you call this?",
    hint: "Short is fine — a working title you'll refer back to.",
    kind: "text-sm",
    field: "name",
    placeholder: "e.g. \"The Salts line\" or \"Morning writing\"",
  },
  {
    id: "dream",
    eyebrow: "THE DREAM",
    question: "Describe the dream. What does this look like when it's real?",
    hint: "Don't filter. Write it the way you'd say it to someone you trust.",
    kind: "text-lg",
    field: "dream",
    placeholder: "When this works...",
  },
  {
    id: "doneState",
    eyebrow: "THE FINISH LINE",
    question: "What does 'done' look like — specifically?",
    hint: "Not perfect. The last concrete thing that needs to happen.",
    kind: "text-lg",
    field: "doneState",
    placeholder: "Done looks like...",
  },
];

export const UNIVERSAL_STEPS_AFTER: WizardStep[] = [
  {
    id: "blocker",
    eyebrow: "RIGHT NOW",
    question: "What's the single biggest thing blocking this today?",
    hint: "Internal or external — name it plainly.",
    kind: "text-sm",
    field: "blocker",
    placeholder: "The main thing in the way is...",
  },
  {
    id: "todayAction",
    eyebrow: "TODAY",
    question: "What could you do today that moves this forward — even a little?",
    hint: "Small is fine. One real thing.",
    kind: "text-sm",
    field: "todayAction",
    placeholder: "Today I could...",
  },
  {
    id: "risk",
    eyebrow: "PIVOTAL INFO",
    question: "What could derail this that isn't in your control?",
    hint: "This becomes your first pivotal info card — the thing the driver watches for.",
    kind: "text-sm",
    field: "risk",
    placeholder: "The thing I can't fully control is...",
  },
  {
    id: "scenarioName",
    eyebrow: "THIS PATH",
    question: "What do you call the path you just mapped?",
    hint: "This is your first scenario. You can add alternatives later.",
    kind: "text-sm",
    field: "scenarioName",
    placeholder: "e.g. \"Bootstrap it\" or \"Find a partner first\"",
  },
];

export const KIND_STEPS: Record<GoalKind, WizardStep[]> = {
  offer: [
    {
      id: "offer-who",
      eyebrow: "THE BUYER",
      question: "Who needs this? Specifically — a real person or group, not a category.",
      hint: "Name them if you can. The more specific, the sharper the offer.",
      kind: "text-sm",
      field: "specifics",
      placeholder: "The person who needs this most is...",
    },
    {
      id: "offer-edge",
      eyebrow: "THE EDGE",
      question: "What makes this different from what they're already doing?",
      hint: "One clear thing — not a list.",
      kind: "text-sm",
      field: "edge",
      placeholder: "The one thing that makes this different is...",
    },
    {
      id: "offer-3mo",
      eyebrow: "THREE MONTHS OUT",
      question: "What needs to be true in three months for this offer to be real?",
      kind: "text-sm",
      field: "threeMonths",
      placeholder: "In three months...",
    },
    {
      id: "offer-1mo",
      eyebrow: "ONE MONTH OUT",
      question: "What's the one thing that has to happen this month for that to be possible?",
      kind: "text-sm",
      field: "oneMonth",
      placeholder: "This month...",
    },
    {
      id: "offer-2wk",
      eyebrow: "TWO WEEKS",
      question: "What are you proving or building in the next two weeks?",
      kind: "text-sm",
      field: "twoWeeks",
      placeholder: "In two weeks I need to...",
    },
  ],
  target: [
    {
      id: "target-number",
      eyebrow: "THE NUMBER",
      question: "What's the target? Specific — not 'more', an actual number.",
      hint: "Revenue, savings, units, whatever 'done' measures.",
      kind: "text-sm",
      field: "specifics",
      placeholder: "The target is...",
    },
    {
      id: "target-gap",
      eyebrow: "THE GAP",
      question: "What's between you and that number right now?",
      kind: "text-sm",
      field: "edge",
      placeholder: "The gap is...",
    },
    {
      id: "target-3mo",
      eyebrow: "THREE MONTHS OUT",
      question: "Where do you need to be in three months to stay on track?",
      kind: "text-sm",
      field: "threeMonths",
      placeholder: "In three months I need to be at...",
    },
    {
      id: "target-1mo",
      eyebrow: "ONE MONTH OUT",
      question: "What does this month's milestone look like?",
      kind: "text-sm",
      field: "oneMonth",
      placeholder: "This month the goal is...",
    },
    {
      id: "target-2wk",
      eyebrow: "TWO WEEKS",
      question: "What's the one action this week that keeps the number moving?",
      kind: "text-sm",
      field: "twoWeeks",
      placeholder: "This week...",
    },
  ],
  creative: [
    {
      id: "creative-medium",
      eyebrow: "THE MEDIUM",
      question: "What is it made of? Words, sound, image, object, experience — be specific.",
      kind: "text-sm",
      field: "specifics",
      placeholder: "It's made of...",
    },
    {
      id: "creative-for",
      eyebrow: "FOR WHO",
      question: "Who is the first person you'd hand this to?",
      hint: "One person. Name them or describe them exactly.",
      kind: "text-sm",
      field: "edge",
      placeholder: "The first person I'd hand this to is...",
    },
    {
      id: "creative-3mo",
      eyebrow: "THREE MONTHS OUT",
      question: "What does 'finished enough to share' look like?",
      kind: "text-sm",
      field: "threeMonths",
      placeholder: "Finished enough looks like...",
    },
    {
      id: "creative-1mo",
      eyebrow: "ONE MONTH OUT",
      question: "What section, chapter, piece, or component do you finish this month?",
      kind: "text-sm",
      field: "oneMonth",
      placeholder: "This month I finish...",
    },
    {
      id: "creative-2wk",
      eyebrow: "TWO WEEKS",
      question: "What do you make or draft in the next two weeks — even badly?",
      kind: "text-sm",
      field: "twoWeeks",
      placeholder: "In the next two weeks I make...",
    },
  ],
  habit: [
    {
      id: "habit-behaviour",
      eyebrow: "THE BEHAVIOUR",
      question: "What behaviour are you building — or breaking?",
      kind: "text-sm",
      field: "specifics",
      placeholder: "The behaviour I'm changing is...",
    },
    {
      id: "habit-trigger",
      eyebrow: "THE TRIGGER",
      question: "What currently triggers the old pattern?",
      hint: "A time, a place, a feeling — be honest.",
      kind: "text-sm",
      field: "edge",
      placeholder: "The old pattern starts when...",
    },
    {
      id: "habit-3mo",
      eyebrow: "THREE MONTHS OUT",
      question: "What does 'locked in' look like in three months?",
      kind: "text-sm",
      field: "threeMonths",
      placeholder: "In three months this is just how I...",
    },
    {
      id: "habit-1mo",
      eyebrow: "ONE MONTH OUT",
      question: "What's the smallest version of the new behaviour you do every day this month?",
      kind: "text-sm",
      field: "oneMonth",
      placeholder: "Every day this month I...",
    },
    {
      id: "habit-2wk",
      eyebrow: "TWO WEEKS",
      question: "What's the first two-week test? What are you tracking?",
      kind: "text-sm",
      field: "twoWeeks",
      placeholder: "For the next two weeks I track...",
    },
  ],
  community: [
    {
      id: "community-who",
      eyebrow: "THE PEOPLE",
      question: "Who needs to be involved for this to work? Name them or name the roles.",
      kind: "text-sm",
      field: "specifics",
      placeholder: "The people who need to move are...",
    },
    {
      id: "community-decision",
      eyebrow: "THE FIRST DECISION",
      question: "What's the one decision that needs to happen before anything else?",
      kind: "text-sm",
      field: "edge",
      placeholder: "The first decision is...",
    },
    {
      id: "community-3mo",
      eyebrow: "THREE MONTHS OUT",
      question: "What does visible progress look like in three months?",
      kind: "text-sm",
      field: "threeMonths",
      placeholder: "In three months we can show...",
    },
    {
      id: "community-1mo",
      eyebrow: "ONE MONTH OUT",
      question: "What's the first concrete thing the group does together this month?",
      kind: "text-sm",
      field: "oneMonth",
      placeholder: "This month we...",
    },
    {
      id: "community-2wk",
      eyebrow: "TWO WEEKS",
      question: "What can YOU do in the next two weeks regardless of what others do?",
      kind: "text-sm",
      field: "twoWeeks",
      placeholder: "What only I can do is...",
    },
  ],
};

// Build the full ordered step list for a chosen kind.
export function buildWizardSteps(kind: GoalKind): WizardStep[] {
  return [
    ...UNIVERSAL_STEPS_BEFORE,
    ...KIND_STEPS[kind],
    ...UNIVERSAL_STEPS_AFTER,
  ];
}

// Build a DailyDriver from completed wizard answers.
export function buildDriverFromAnswers(answers: WizardAnswers): DailyDriver {
  const kind = answers.kind as GoalKind;
  const now = Date.now();
  const id = `driver-${now}-${Math.random().toString(36).slice(2, 8)}`;
  const scenarioId = `scenario-${now}`;

  const goalNodes: GoalNode[] = (
    [
      { horizon: "done" as GoalHorizon,  text: answers.doneState },
      { horizon: "3mo" as GoalHorizon,   text: answers.threeMonths },
      { horizon: "1mo" as GoalHorizon,   text: answers.oneMonth },
      { horizon: "2wk" as GoalHorizon,   text: answers.twoWeeks },
      { horizon: "today" as GoalHorizon, text: answers.todayAction },
    ] as GoalNode[]
  ).filter((n) => n.text.trim().length > 0);

  const hypothesis = [answers.specifics, answers.edge]
    .filter((s) => s.trim().length > 0)
    .join(" · ");

  const firstScenario: DriverScenario = {
    id: scenarioId,
    name: answers.scenarioName.trim() || "Path 1",
    hypothesis: hypothesis || answers.doneState,
    dailyAction: answers.todayAction,
    status: "active",
    createdAt: now,
  };

  const pivotalCard: PivotalCard | null = answers.risk.trim()
    ? {
        id: `pivot-${now}`,
        label: "Biggest risk",
        value: answers.risk.trim(),
        updatedAt: now,
      }
    : null;

  return {
    id,
    name: answers.name.trim() || answers.dream.slice(0, 40).trim(),
    kind,
    dream: answers.dream,
    doneState: answers.doneState,
    goalNodes,
    scenarios: [firstScenario],
    pivotalCards: pivotalCard ? [pivotalCard] : [],
    activeScenarioId: scenarioId,
    todayAction: answers.todayAction,
    isPrimary: false,
    status: "active",
    logs: [],
    createdAt: now,
    lastTouchedAt: now,
  };
}
