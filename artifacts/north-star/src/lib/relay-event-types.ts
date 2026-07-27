/**
 * relay-event-types.ts — Typed payload interfaces for every relay event kind.
 *
 * Each interface carries three universal fields required by Buzz alignment Rec 5:
 *   zone       — the Zone this event originates from (never Z1; see EAVE RULE in types.ts)
 *   actor_type — whether the event was triggered by a human or an agent
 *   kind-specific fields — machine-readable body an agent can act on without guessing
 *
 * No Z1 identity fields (name, passphrase, statement) may appear in any payload.
 * The NoZ1Fields<T> guard in relay-stub.ts enforces this at compile time.
 */

import type { AgentRole, ZoneId } from "../types";

// ---------------------------------------------------------------------------
// 1000 — MORNING_MANIFEST (Zone 2 — Workbench daily pick)
// ---------------------------------------------------------------------------
export interface MorningManifestPayload {
  zone: "Z2";
  actor_type: "human" | "agent";
  /** Named role of the agent when actor_type is "agent". Omitted for humans. */
  agent_role?: AgentRole;
  date: string; // ISO date, e.g. "2026-07-27"
  constellation_ids: string[];
  acknowledged_guardrails: string[];
  zone_ranking: ZoneId[];
  burst_windows: { phase: string; windows: string } | null;
}

// ---------------------------------------------------------------------------
// 1001 — BRIEFING_ENVELOPE (Zone 2 — RiverSmith AI briefing)
// ---------------------------------------------------------------------------
export interface BriefingEnvelopePayload {
  zone: "Z2";
  actor_type: "human" | "agent";
  /** Named role of the agent when actor_type is "agent". Omitted for humans. */
  agent_role?: AgentRole;
  briefing_id: string;
  generated_at: string; // ISO datetime
  triggered_by: "manual" | "scheduled" | "agent";
  safety_flags_count: number;
}

// ---------------------------------------------------------------------------
// 1002 — GATE_CROSSING (Z2↔Z3 boundary audit event)
// ---------------------------------------------------------------------------
export interface GateCrossingPayload {
  zone: "Z2" | "Z3";
  actor_type: "human" | "agent";
  /** Named role of the agent when actor_type is "agent". Omitted for humans. */
  agent_role?: AgentRole;
  crossing_direction: "Z1_to_Z2" | "Z2_to_Z1" | "Z2_to_Z3" | "Z3_to_Z2";
  context_ref: string; // opaque reference; must not be a Z1-derived identifier
  crossed_at: string; // ISO datetime
}

// ---------------------------------------------------------------------------
// 1003 — WORKBENCH_PLAN_BURST (Zone 2 — focused execution burst window opened)
// ---------------------------------------------------------------------------
export interface WorkbenchPlanBurstPayload {
  zone: "Z2";
  actor_type: "human" | "agent";
  /** Named role of the agent when actor_type is "agent". Omitted for humans. */
  agent_role?: AgentRole;
  phase: string;
  burst_minutes: number | null;
  windows: string; // human-readable window description
  started_at: string; // ISO datetime
}

// ---------------------------------------------------------------------------
// 1004–1007 — HELPING_HANDS lifecycle (Zone 3 — community task board)
// ---------------------------------------------------------------------------

export interface HelpingHandsCreatePayload {
  zone: "Z3";
  actor_type: "human" | "agent";
  /** Named role of the agent when actor_type is "agent". Omitted for humans. */
  agent_role?: AgentRole;
  task_id: string;
  title: string;
  posted_at: string; // ISO datetime
}

export interface HelpingHandsClaimPayload {
  zone: "Z3";
  actor_type: "human" | "agent";
  /** Named role of the agent when actor_type is "agent". Omitted for humans. */
  agent_role?: AgentRole;
  task_id: string;
  claimed_at: string; // ISO datetime
}

export interface HelpingHandsCompletePayload {
  zone: "Z3";
  actor_type: "human" | "agent";
  /** Named role of the agent when actor_type is "agent". Omitted for humans. */
  agent_role?: AgentRole;
  task_id: string;
  completed_at: string; // ISO datetime
}

export interface HelpingHandsConfirmPayload {
  zone: "Z3";
  actor_type: "human" | "agent";
  /** Named role of the agent when actor_type is "agent". Omitted for humans. */
  agent_role?: AgentRole;
  task_id: string;
  confirmed_at: string; // ISO datetime
}

// ---------------------------------------------------------------------------
// 1008 — CONTRACT_MILESTONE (Zone 4 — contract attestation)
// ---------------------------------------------------------------------------
export interface ContractMilestonePayload {
  zone: "Z4";
  actor_type: "human" | "agent";
  /** Named role of the agent when actor_type is "agent". Omitted for humans. */
  agent_role?: AgentRole;
  contract_id: string;
  milestone_id: string;
  /** z3npub of the signing party attesting the milestone. */
  attested_by: string;
  attested_at: string; // ISO datetime
  description: string;
}

// ---------------------------------------------------------------------------
// Convenience map: relay kind number → payload interface
// ---------------------------------------------------------------------------
export interface RelayPayloadMap {
  1000: MorningManifestPayload;
  1001: BriefingEnvelopePayload;
  1002: GateCrossingPayload;
  1003: WorkbenchPlanBurstPayload;
  1004: HelpingHandsCreatePayload;
  1005: HelpingHandsClaimPayload;
  1006: HelpingHandsCompletePayload;
  1007: HelpingHandsConfirmPayload;
  1008: ContractMilestonePayload;
}
