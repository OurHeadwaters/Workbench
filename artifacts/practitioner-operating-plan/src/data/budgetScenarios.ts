/**
 * budgetScenarios.ts
 *
 * Single source of truth for all engagement pricing and cost data.
 *
 * Model: phase-based fixed fees, $175/hr practitioner baseline.
 * Distribution ops through 807 Food Co-operative from 2027.
 * Practitioner does most work; subcontractors engaged as needed.
 *
 * Edit here. Nowhere else.
 */

// ── Practitioner rate ─────────────────────────────────────────────────────────

export const PRACTITIONER_RATE = 175;  // $/hr — current billing baseline

// ── Phase definitions ─────────────────────────────────────────────────────────
//
// Each phase has:
//   - A fixed client fee (or a min/max range for later phases)
//   - Estimated practitioner days and hours
//   - Travel costs where applicable
//   - Notes on what drives the cost
//
// Phase 1 is priced as a flat fee.
// Phases 2–4 are priced as ranges — confirmed with client at start of each phase.
//

export interface Phase {
  id:           string;
  num:          string;    // "01" | "02" | "03" | "04"
  label:        string;    // "The Plan" etc.
  duration:     string;    // human label, e.g. "6 weeks"
  headline:     string;    // one-sentence description
  feeFlat?:     number;    // fixed fee (Phase 1)
  feeMin?:      number;    // min of range (Phases 2–4)
  feeMax?:      number;    // max of range (Phases 2–4)
  practDays:    number;    // estimated practitioner working days
  hoursPerDay:  number;    // typically 7
  travelVisits: number;    // number of site visits
  travelCostPerVisit: number;  // $/visit (flights + accommodation)
  subcontractorCost?: number;  // estimated subcontractor support cost
  note?:        string;
}

export const PHASES: Phase[] = [
  {
    id:          "phase-1",
    num:         "01",
    label:       "The Plan",
    duration:    "6 weeks",
    headline:    "Discovery, audit, operations guide, hiring plan, grant roadmap.",
    feeFlat:     28_000,
    practDays:   20,
    hoursPerDay: 7,
    travelVisits: 1,
    travelCostPerVisit: 900,
    note: "Flat fee. Client can stop here — everything built stays with the community.",
  },
  {
    id:          "phase-2",
    num:         "02",
    label:       "The Build",
    duration:    "4–6 months",
    headline:    "Real operations begin. Demand data collected. Grants written.",
    feeMin:      52_000,
    feeMax:      60_000,
    practDays:   72,   // 4 mo × 18 remote days
    hoursPerDay: 7,
    travelVisits: 4,
    travelCostPerVisit: 900,
    subcontractorCost: 3_120,  // ~12 hrs/mo × $65/hr × 4 mo — QA and review
    note: "Community Coordinator hired through 807 or band. Grant applications in motion by end of phase.",
  },
  {
    id:          "phase-3",
    num:         "03",
    label:       "The Payoff",
    duration:    "First full operating season",
    headline:    "807 supply line activated. Economics flip. Store proves it can pay for itself.",
    feeMin:      24_000,
    feeMax:      30_000,
    practDays:   30,   // 3 mo × 10 remote days
    hoursPerDay: 7,
    travelVisits: 2,
    travelCostPerVisit: 900,
    note: "807 Food Co-operative supply line targeting 2027 activation.",
  },
  {
    id:          "phase-4",
    num:         "04",
    label:       "The Handoff",
    duration:    "Community ownership year",
    headline:    "Headwaters steps back. Community steps forward.",
    feeMin:      18_000,
    feeMax:      22_000,
    practDays:   54,   // 6 mo × 9 remote days
    hoursPerDay: 7,
    travelVisits: 2,
    travelCostPerVisit: 900,
    note: "Local person trained in Codetry tools. Formal handoff documented for funders and Pilot #2.",
  },
];

// ── Derived cost to deliver ───────────────────────────────────────────────────

export interface PhaseCost {
  phase:        Phase;
  laborCost:    number;
  travelCost:   number;
  subCost:      number;
  totalCost:    number;
  feeDisplay:   string;   // "$28,000" or "$52,000–$60,000"
  marginAtFee?: number;   // margin % at flat fee
  marginAtMin?: number;   // margin % at min of range
  marginAtMax?: number;   // margin % at max of range
}

export function calcPhaseCost(phase: Phase): PhaseCost {
  const laborCost  = phase.practDays * phase.hoursPerDay * PRACTITIONER_RATE;
  const travelCost = phase.travelVisits * phase.travelCostPerVisit;
  const subCost    = phase.subcontractorCost ?? 0;
  const totalCost  = laborCost + travelCost + subCost;

  let feeDisplay: string;
  let marginAtFee: number | undefined;
  let marginAtMin: number | undefined;
  let marginAtMax: number | undefined;

  if (phase.feeFlat !== undefined) {
    feeDisplay  = fmt(phase.feeFlat);
    marginAtFee = ((phase.feeFlat - totalCost) / phase.feeFlat) * 100;
  } else {
    feeDisplay  = `${fmt(phase.feeMin!)}–${fmt(phase.feeMax!)}`;
    marginAtMin = ((phase.feeMin! - totalCost) / phase.feeMin!) * 100;
    marginAtMax = ((phase.feeMax! - totalCost) / phase.feeMax!) * 100;
  }

  return { phase, laborCost, travelCost, subCost, totalCost, feeDisplay, marginAtFee, marginAtMin, marginAtMax };
}

export const PHASE_COSTS: PhaseCost[] = PHASES.map(calcPhaseCost);

// ── Engagement totals ─────────────────────────────────────────────────────────

export const ENGAGEMENT_TOTAL = {
  feeMin: PHASES.reduce((s, p) => s + (p.feeFlat ?? p.feeMin ?? 0), 0),  // ~$122,000
  feeMax: PHASES.reduce((s, p) => s + (p.feeFlat ?? p.feeMax ?? 0), 0),  // ~$140,000
  practDays: PHASES.reduce((s, p) => s + p.practDays, 0),
} as const;

// ── Formatting helpers ────────────────────────────────────────────────────────

/** "$28,000" */
export function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-CA");
}

/** "~$28k" */
export function fmtK(n: number): string {
  return "~$" + Math.round(n / 1_000) + "k";
}

/** "29%" */
export function fmtPct(n: number): string {
  return Math.round(n) + "%";
}
