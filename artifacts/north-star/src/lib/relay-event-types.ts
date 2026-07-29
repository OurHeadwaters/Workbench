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

/**
 * Structured proof-of-work block attached to a briefing save event.
 * Captures what changed vs. the previous briefing so human reviewers can
 * verify the agent's work at a glance without reading the full diff.
 */
export interface ProofOfWork {
  /** Names of the fields/sections that differ from the previous briefing. */
  changed_fields: string[];
  /** One-sentence human-readable summary of what changed. */
  summary: string;
  /** Short hash of the previous briefing's markdown content, for audit trails. */
  previous_snapshot_hash?: string;
}

export interface BriefingEnvelopePayload {
  zone: "Z2";
  actor_type: "human" | "agent";
  /** Named role of the agent when actor_type is "agent". Omitted for humans. */
  agent_role?: AgentRole;
  briefing_id: string;
  generated_at: string; // ISO datetime
  triggered_by: "manual" | "scheduled" | "agent";
  safety_flags_count: number;
  /** Structured record of what changed vs. the previous briefing. */
  proof_of_work?: ProofOfWork;
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
// 1009 — IMPROVEMENT_PROPOSAL (Zone 2 — agent-authored improvement suggestion)
// ---------------------------------------------------------------------------

/**
 * Fired when an agent publishes a new improvement proposal for human review.
 *
 * PERMISSION MODEL: agents may propose; only the human operator (owner token)
 * may accept. No Z1 identity fields are permitted in this payload.
 */
export interface ImprovementProposalPayload {
  zone: "Z2";
  actor_type: "agent";
  /** Named role of the agent authoring the proposal. */
  agent_role: AgentRole;
  proposal_id: string;
  title: string;
  description: string;
  affected_surface: string;
  created_at: string; // ISO datetime
}

// ---------------------------------------------------------------------------
// 1010 — IMPROVEMENT_PROPOSAL_OUTCOME (Zone 2 — human accept/reject)
// ---------------------------------------------------------------------------

/**
 * Fired when the human operator accepts or rejects a pending proposal.
 * Only the owner token holder may trigger this event.
 */
export interface ImprovementProposalOutcomePayload {
  zone: "Z2";
  actor_type: "human";
  proposal_id: string;
  outcome: "accepted" | "rejected";
  resolved_at: string; // ISO datetime
}

// ---------------------------------------------------------------------------
// 1011 — LAB_EVENT (Zone 2 — message posted into a lab channel)
// ---------------------------------------------------------------------------

/**
 * Emitted whenever an agent or the human operator posts a message into a lab channel.
 *
 * EAVE RULE: no Z1 identity fields (name, passphrase, statement) may appear here.
 * channel_id ties the event to a specific ChannelMeta with category === "lab".
 */
export interface LabEventPayload {
  zone: "Z2";
  actor_type: "human" | "agent";
  /** Named role of the agent when actor_type is "agent". Omitted for humans. */
  agent_role?: AgentRole;
  /** ID of the lab channel this event belongs to. */
  channel_id: string;
  /** Human-readable message text posted into the lab. */
  text: string;
  /** ISO datetime when the event was posted. */
  posted_at: string;
  /**
   * Stable identity of the corresponding RelayEventSummary written into the
   * channel's event_feed.  Stored here so the rehydration reconciler can skip
   * events that are already present, using the event id as the dedup key.
   */
  event_id?: string;
}

// ---------------------------------------------------------------------------
// 1012 — CHANNEL_OPEN (Zone 2 — agent or human opens an ephemeral channel)
// ---------------------------------------------------------------------------

/**
 * Emitted when a channel is registered via addChannel (including the automatic
 * workbench channel opened at burst-session start).
 *
 * EAVE RULE: no Z1 identity fields (name, passphrase, statement) may appear here.
 */
export interface ChannelOpenPayload {
  zone: "Z2";
  actor_type: "human" | "agent";
  /** Named role of the agent when actor_type is "agent". Omitted for humans. */
  agent_role?: AgentRole;
  /** ID of the newly registered channel. */
  channel_id: string;
  /** Human-readable label for the channel. */
  label: string;
  /** Category of the channel (workbench, lab, helping-hands, etc.). */
  category: string;
  /** ISO datetime when the channel was opened. */
  opened_at: string;
  /** ISO datetime when the ephemeral channel will auto-expire, if set. */
  expires_at?: string;
}

// ---------------------------------------------------------------------------
// 1013 — CHANNEL_CLOSE (Zone 2 — agent or human closes / archives a channel)
// ---------------------------------------------------------------------------

/**
 * Emitted when a channel is explicitly expired via expireChannel.
 *
 * EAVE RULE: no Z1 identity fields (name, passphrase, statement) may appear here.
 */
export interface ChannelClosePayload {
  zone: "Z2";
  actor_type: "human" | "agent";
  /** Named role of the agent when actor_type is "agent". Omitted for humans. */
  agent_role?: AgentRole;
  /** ID of the channel being closed. */
  channel_id: string;
  /** ISO datetime when the channel was closed / archived. */
  closed_at: string;
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
  1009: ImprovementProposalPayload;
  1010: ImprovementProposalOutcomePayload;
  1011: LabEventPayload;
  1012: ChannelOpenPayload;
  1013: ChannelClosePayload;
}
