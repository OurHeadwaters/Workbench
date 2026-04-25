// The five-phase deal flow that the operating plan is re-spined around.
// Lifestyle Design Philosophy view ignores phases and uses the original
// 38-slide manifest order; the operating plan view groups by phase.

export const PHASES = [
  "idea",
  "pitch",
  "contract",
  "fulfillment",
  "impact",
] as const;
export type Phase = (typeof PHASES)[number];

export const PHASE_LABELS: Record<Phase, string> = {
  idea: "Idea",
  pitch: "Pitch",
  contract: "Contract",
  fulfillment: "Fulfillment",
  impact: "Impact",
};

export const PHASE_ORDER: Record<Phase, number> = {
  idea: 0,
  pitch: 1,
  contract: 2,
  fulfillment: 3,
  impact: 4,
};

export const PHASE_FRAMING: Record<Phase, string> = {
  idea: "Why this matters and what we're naming.",
  pitch: "Make the case. Hand the deck over.",
  contract: "Name the deal. Lock the terms.",
  fulfillment: "Run the work. Protect the calendar.",
  impact: "Prove it. Then template it.",
};

export type MilestoneId =
  | "pitch_sent"
  | "verbal_yes"
  | "contract_signed"
  | "first_invoice_paid"
  | "first_impact_moment";

export type MilestoneDef = {
  id: MilestoneId;
  label: string;
  // Phase that this milestone implies you have entered once it is checked.
  implies: Phase;
};

export const MILESTONES: MilestoneDef[] = [
  { id: "pitch_sent", label: "Pitch sent", implies: "pitch" },
  { id: "verbal_yes", label: "Verbal yes", implies: "contract" },
  { id: "contract_signed", label: "Contract signed", implies: "fulfillment" },
  { id: "first_invoice_paid", label: "First invoice paid", implies: "fulfillment" },
  { id: "first_impact_moment", label: "First impact moment", implies: "impact" },
];

export type MilestoneState = Partial<Record<MilestoneId, boolean>>;

// Highest-implied phase among checked milestones; defaults to Idea.
// This is purely the *suggestion* — it never moves the active phase on
// its own. The practitioner has to accept the soft nudge for the phase
// to actually change.
export function deriveSuggestedPhase(milestones: MilestoneState): Phase {
  let highest: Phase = "idea";
  for (const m of MILESTONES) {
    if (milestones[m.id] && PHASE_ORDER[m.implies] > PHASE_ORDER[highest]) {
      highest = m.implies;
    }
  }
  return highest;
}

// True iff the milestones imply a phase strictly ahead of where we are
// and the practitioner hasn't already said "stay where I am" to that
// exact suggestion.
export function shouldShowPhaseSuggestion(
  currentPhase: Phase,
  milestones: MilestoneState,
  dismissedPhaseSuggestion: Phase | null,
): boolean {
  const suggested = deriveSuggestedPhase(milestones);
  if (PHASE_ORDER[suggested] <= PHASE_ORDER[currentPhase]) return false;
  if (dismissedPhaseSuggestion === suggested) return false;
  return true;
}

export function nextPhase(p: Phase): Phase {
  const i = PHASE_ORDER[p];
  return PHASES[(i + 1) % PHASES.length];
}
