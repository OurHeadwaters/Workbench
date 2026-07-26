/**
 * relay-stub.type-test.ts
 *
 * Compile-time gate tests for the NoZ1Fields<T> constraint.
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

// ✅ Payload with no Z1 fields — must compile without error.
void publishToRelay({
  kind: RELAY_EVENT_KINDS.MORNING_MANIFEST,
  payload: { date: "2026-07-26", safe_field: true },
  z2npub: "z2:local",
  timestamp: "2026-07-26T08:00:00.000Z",
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
