/**
 * relay-stub.ts — Nostr relay publisher
 *
 * Sends North Star events to the server-side signing endpoint
 * (POST /api/north-star/relay/publish), which holds the system private key,
 * constructs a properly signed Nostr event, and publishes it to the relay via
 * WebSocket. No private key or relay secret ever touches the browser bundle.
 *
 * Config (Vite env var — public, non-sensitive):
 *   VITE_RELAY_PUBLISH_URL  — full URL of the signing endpoint, e.g.
 *                             /api/north-star/relay/publish
 *                             When absent, the localStorage fallback is used.
 *
 * Auth: the request carries the owner token from localStorage so the server
 *       can verify the caller is the system owner before signing.
 *
 * Fallback: if VITE_RELAY_PUBLISH_URL is not set, or the API call fails
 *           (network error, server 4xx/5xx, 501 not configured), events are
 *           written to localStorage under "ns:relay:events" so no data is lost.
 *
 * The public API (publishToRelay, RELAY_EVENT_KINDS, NostrEvent) is unchanged
 * — no callers need to be updated.
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

const RELAY_PUBLISH_URL: string | undefined =
  import.meta.env.VITE_RELAY_PUBLISH_URL as string | undefined;

function getOwnerToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem("library.ownerToken") ||
    window.localStorage.getItem("ownerToken") ||
    null
  );
}

async function sendViaApi(event: NostrEvent): Promise<boolean> {
  if (!RELAY_PUBLISH_URL) return false;

  const token = getOwnerToken();
  if (!token) return false;

  try {
    const res = await fetch(RELAY_PUBLISH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-library-owner-token": token,
      },
      body: JSON.stringify({
        kind: event.kind,
        payload: event.payload,
        z2npub: event.z2npub,
        timestamp: event.timestamp,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function storeLocally(event: NostrEvent): void {
  if (typeof window === "undefined") return;

  let stored: NostrEvent[] = [];
  try {
    stored = JSON.parse(localStorage.getItem(RELAY_STORAGE_KEY) ?? "[]") as NostrEvent[];
  } catch {
    stored = [];
  }

  stored.push(event);

  if (stored.length > MAX_STORED_EVENTS) {
    stored = stored.slice(stored.length - MAX_STORED_EVENTS);
  }

  localStorage.setItem(RELAY_STORAGE_KEY, JSON.stringify(stored));
}

export async function publishToRelay<P extends Record<string, unknown>>(
  event: Omit<NostrEvent, "payload"> & { payload: NoZ1Fields<P> },
): Promise<void> {
  if (typeof window === "undefined") return;

  const ev = event as NostrEvent;

  const delivered = await sendViaApi(ev);
  if (!delivered) {
    storeLocally(ev);
  }
}

export const RELAY_EVENT_KINDS = {
  MORNING_MANIFEST: 1000,
  BRIEFING_ENVELOPE: 1001,
  GATE_CROSSING: 1002,
  /** Zone 2 — emitted when a Workbench Plan opens a burst window for focused execution */
  WORKBENCH_PLAN_BURST: 1003,
  /** Zone 3 — emitted when a new Helping Hands task is posted and available for claiming */
  HELPING_HANDS_CREATE: 1004,
  /** Zone 3 — emitted when a member claims an open Helping Hands task */
  HELPING_HANDS_CLAIM: 1005,
  /** Zone 3 — emitted when the assignee marks a Helping Hands task done */
  HELPING_HANDS_COMPLETE: 1006,
  /** Zone 3 — emitted when the requester confirms satisfactory completion of a Helping Hands task */
  HELPING_HANDS_CONFIRM: 1007,
  /** Zone 4 — emitted when a contract milestone is attested as reached by a signing party */
  CONTRACT_MILESTONE: 1008,
} as const;
