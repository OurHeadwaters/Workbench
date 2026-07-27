/**
 * relay-stub.type-test.ts
 *
 * Compile-time gate tests for the NoZ1Fields<T> constraint and the typed
 * payload interfaces introduced per relay event kind (Buzz alignment Rec 5).
 *
 * This file is intentionally NOT named *.test.ts so that tsconfig.json
 * includes it in type-checking (tsconfig excludes **\/*.test.ts but not
 * **\/*.type-test.ts). These assertions are enforced by `tsc --noEmit`
 * and will fail the build if the constraint is ever weakened.
 *
 * @ts-expect-error is placed on the line immediately before the property
 * that TypeScript flags (the `payload:` line), matching where tsc reports
 * TS2322 when NoZ1Fields<T> resolves to never.
 *
 * If the NoZ1Fields constraint is ever removed and the forbidden calls
 * compile cleanly, TypeScript will report an "Unused '@ts-expect-error'
 * directive" error — the gate cannot silently disappear.
 */

import { publishToRelay, RELAY_EVENT_KINDS } from "./relay-stub";

// ─────────────────────────────────────────────────────────────────────────────
// MORNING_MANIFEST (kind 1000)
// ─────────────────────────────────────────────────────────────────────────────

// ✅ Valid MORNING_MANIFEST payload — must compile without error.
void publishToRelay({
  kind: RELAY_EVENT_KINDS.MORNING_MANIFEST,
  payload: {
    zone: "Z2",
    actor_type: "human",
    date: "2026-07-27",
    constellation_ids: ["c1", "c2"],
    acknowledged_guardrails: [],
    zone_ranking: ["Z2", "Z3"],
    burst_windows: null,
  },
  z2npub: "z2:local",
  timestamp: "2026-07-27T08:00:00.000Z",
  signature: "stub",
});

// ❌ 'name' is a Z1 identity field — must NOT compile.
void publishToRelay({
  kind: RELAY_EVENT_KINDS.MORNING_MANIFEST,
  // @ts-expect-error NoZ1Fields<{name:string}> resolves to never; 'name' is a Z1 key
  payload: { name: "Alice" },
  z2npub: "z2:local",
  timestamp: "2026-07-26T08:00:00.000Z",
  signature: "stub",
});

// ❌ 'passphrase' is a Z1 identity field — must NOT compile.
void publishToRelay({
  kind: RELAY_EVENT_KINDS.MORNING_MANIFEST,
  // @ts-expect-error NoZ1Fields<{passphrase:string}> resolves to never; 'passphrase' is a Z1 key
  payload: { passphrase: "hunter2" },
  z2npub: "z2:local",
  timestamp: "2026-07-26T08:00:00.000Z",
  signature: "stub",
});

// ❌ 'statement' is a Z1 identity field — must NOT compile.
void publishToRelay({
  kind: RELAY_EVENT_KINDS.MORNING_MANIFEST,
  // @ts-expect-error NoZ1Fields<{statement:string}> resolves to never; 'statement' is a Z1 key
  payload: { statement: "I am the founder" },
  z2npub: "z2:local",
  timestamp: "2026-07-26T08:00:00.000Z",
  signature: "stub",
});

// ─────────────────────────────────────────────────────────────────────────────
// BRIEFING_ENVELOPE (kind 1001)
// ─────────────────────────────────────────────────────────────────────────────

// ✅ Valid BRIEFING_ENVELOPE payload — must compile without error.
void publishToRelay({
  kind: RELAY_EVENT_KINDS.BRIEFING_ENVELOPE,
  payload: {
    zone: "Z2",
    actor_type: "human",
    briefing_id: "brfg-001",
    generated_at: "2026-07-27T08:05:00.000Z",
    triggered_by: "manual",
    safety_flags_count: 0,
  },
  z2npub: "z2:local",
  timestamp: "2026-07-27T08:05:00.000Z",
  signature: "stub",
});

// ❌ 'passphrase' is a Z1 identity field — must NOT compile on BRIEFING_ENVELOPE too.
void publishToRelay({
  kind: RELAY_EVENT_KINDS.BRIEFING_ENVELOPE,
  // @ts-expect-error NoZ1Fields<{passphrase:string}> resolves to never; 'passphrase' is a Z1 key
  payload: { passphrase: "secret" },
  z2npub: "z2:local",
  timestamp: "2026-07-27T08:05:00.000Z",
  signature: "stub",
});

// ─────────────────────────────────────────────────────────────────────────────
// GATE_CROSSING (kind 1002)
// ─────────────────────────────────────────────────────────────────────────────

// ✅ Valid GATE_CROSSING payload — must compile without error.
void publishToRelay({
  kind: RELAY_EVENT_KINDS.GATE_CROSSING,
  payload: {
    zone: "Z2",
    actor_type: "human",
    crossing_direction: "Z2_to_Z3",
    context_ref: "contract-abc123",
    crossed_at: "2026-07-27T09:00:00.000Z",
  },
  z2npub: "z2:local",
  timestamp: "2026-07-27T09:00:00.000Z",
  signature: "stub",
});

// ❌ 'name' is a Z1 identity field — must NOT compile on GATE_CROSSING.
void publishToRelay({
  kind: RELAY_EVENT_KINDS.GATE_CROSSING,
  // @ts-expect-error NoZ1Fields<{name:string}> resolves to never; 'name' is a Z1 key
  payload: { name: "crossing actor" },
  z2npub: "z2:local",
  timestamp: "2026-07-27T09:00:00.000Z",
  signature: "stub",
});

// ─────────────────────────────────────────────────────────────────────────────
// CONTRACT_MILESTONE (kind 1008)
// ─────────────────────────────────────────────────────────────────────────────

// ✅ Valid CONTRACT_MILESTONE payload — must compile without error.
void publishToRelay({
  kind: RELAY_EVENT_KINDS.CONTRACT_MILESTONE,
  payload: {
    zone: "Z4",
    actor_type: "human",
    contract_id: "ctr-007",
    milestone_id: "m1",
    attested_by: "z3:npub1abc",
    attested_at: "2026-07-27T12:00:00.000Z",
    description: "Phase 1 delivery confirmed",
  },
  z2npub: "z2:local",
  timestamp: "2026-07-27T12:00:00.000Z",
  signature: "stub",
});

// ❌ 'statement' is a Z1 identity field — must NOT compile on CONTRACT_MILESTONE.
void publishToRelay({
  kind: RELAY_EVENT_KINDS.CONTRACT_MILESTONE,
  // @ts-expect-error NoZ1Fields<{statement:string}> resolves to never; 'statement' is a Z1 key
  payload: { statement: "I am the contractor" },
  z2npub: "z2:local",
  timestamp: "2026-07-27T12:00:00.000Z",
  signature: "stub",
});
