/**
 * relay-stub.ts — Tier 1 Step 3
 *
 * Writes Nostr-shaped events to localStorage under "ns:relay:events".
 * When a real system npub is established, replace this stub with a live
 * relay connection without touching any caller — the signature is stable.
 *
 * EAVE RULE: payloads must never carry Z1 identity fields (name, passphrase,
 * statement). The generic constraint below makes violations a compile-time
 * error rather than a runtime check.
 */

export interface NostrEvent {
  kind: number;
  payload: unknown;
  z2npub: string;
  timestamp: string;
  signature: "stub";
}

type ForbiddenZ1Keys = "name" | "passphrase" | "statement";

/**
 * NoZ1Fields<T> resolves to T when the payload object has none of the
 * forbidden Z1 keys, and resolves to never otherwise — turning any
 * attempt to pass Z1 data into a TypeScript compile error.
 */
type NoZ1Fields<T> = keyof T & ForbiddenZ1Keys extends never ? T : never;

const RELAY_STORAGE_KEY = "ns:relay:events";
const MAX_STORED_EVENTS = 500;

export async function publishToRelay<P extends Record<string, unknown>>(
  event: Omit<NostrEvent, "payload"> & { payload: NoZ1Fields<P> },
): Promise<void> {
  if (typeof window === "undefined") return;

  let stored: NostrEvent[] = [];
  try {
    stored = JSON.parse(localStorage.getItem(RELAY_STORAGE_KEY) ?? "[]") as NostrEvent[];
  } catch {
    stored = [];
  }

  stored.push(event as NostrEvent);

  if (stored.length > MAX_STORED_EVENTS) {
    stored = stored.slice(stored.length - MAX_STORED_EVENTS);
  }

  localStorage.setItem(RELAY_STORAGE_KEY, JSON.stringify(stored));
}

export const RELAY_EVENT_KINDS = {
  MORNING_MANIFEST: 1000,
  BRIEFING_ENVELOPE: 1001,
  GATE_CROSSING: 1002,
} as const;
