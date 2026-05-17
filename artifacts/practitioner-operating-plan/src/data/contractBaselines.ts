/**
 * contractBaselines.ts
 *
 * Engagement team and pillar definitions.
 *
 * Model: practitioner-led, subcontractors as needed per phase.
 * No fixed employed team. Hours tracked per engagement, not per staff role.
 */

// ── Pillars ───────────────────────────────────────────────────────────────────

export const PILLARS = [
  { id: "cfs",  label: "Community Food Systems",   color: "#2d6a4f" },
  { id: "ops",  label: "Operations & Admin",        color: "#1b4d8e" },
  { id: "gov",  label: "Governance & Reporting",    color: "#6b3fa0" },
  { id: "eng",  label: "Engagement & Development",  color: "#b85a3e" },
] as const;

export type PillarId = typeof PILLARS[number]["id"];

// ── Team ──────────────────────────────────────────────────────────────────────
//
// Practitioner-led model. Subcontractors engaged per phase as scope requires.
// Community Coordinator to be hired through 807 or band — not yet in place.
//

export interface TeamMember {
  roleId:   string;
  label:    string;
  rate:     number;     // $/hr
  type:     "practitioner" | "subcontractor" | "pending";
  note?:    string;
}

export const TEAM: TeamMember[] = [
  {
    roleId: "practitioner",
    label:  "Practitioner / Lead",
    rate:   175,
    type:   "practitioner",
    note:   "Engagement owner. Covers all pillars. Phases 1–4.",
  },
  {
    roleId: "subcontractor-it",
    label:  "IT / Tech Review (subcontract)",
    rate:   65,
    type:   "subcontractor",
    note:   "QA and review before work ships. ~12 hrs/mo during active phases.",
  },
  {
    roleId: "community-coordinator",
    label:  "Community Coordinator (807 / band hire)",
    rate:   0,
    type:   "pending",
    note:   "Hired through 807 or Deer Lake band council. Funding not yet confirmed. Priority gap for summer 2026. Dryden-based, food handler certified — 807 operations, markets, salts, local line orders.",
  },
];

// ── Contract metadata ─────────────────────────────────────────────────────────

export const CONTRACT_VERSION = "v2.0";
export const CONTRACT_DATE    = "2026-05-17";
export const CONTRACT_LABEL   = `${CONTRACT_VERSION} · updated ${CONTRACT_DATE}`;

// ── Amendment log ─────────────────────────────────────────────────────────────

export interface Amendment {
  version:   string;
  date:      string;
  amendedBy: string;
  reason:    string;
  changes:   string;
}

export const AMENDMENT_LOG: Amendment[] = [
  {
    version:   "v2.0",
    date:      "2026-05-17",
    amendedBy: "Practitioner",
    reason:    "Model updated from 6-person employed team to practitioner-led with subcontractors as needed.",
    changes:   "Removed opsManager, bookkeeper, foodHandler, cdAssociate, juniorAnalyst roles. Added subcontractor-it and community-coordinator (pending). Removed pillar hour tracking — not relevant to phase-based model.",
  },
  {
    version:   "v1.0",
    date:      "2025-05-01",
    amendedBy: "Practitioner",
    reason:    "Initial contract baselines.",
    changes:   "First version. Seven roles, pillar allocations, quarterly hours tracking.",
  },
];

// ── Lookup helpers ────────────────────────────────────────────────────────────

export function getTeamMember(roleId: string): TeamMember | undefined {
  return TEAM.find((m) => m.roleId === roleId);
}

export function getPillar(id: PillarId) {
  return PILLARS.find((p) => p.id === id)!;
}
