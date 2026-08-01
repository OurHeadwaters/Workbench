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
 * EAVE RULE: payloads must never carry Z1 identity fields (name, passphrase,
 * statement). The NoZ1Fields<T> guard makes violations a compile-time error.
 * Every payload must also satisfy the typed interface for its kind, exported
 * from relay-event-types.ts (Buzz alignment Rec 5).
 */

import type { RelayPayloadMap } from "./relay-event-types";
export { AGENT_ROLE_REGISTRY, type AgentRoleEntry } from "@workspace/north-star-agent-roles";

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

/**
 * RelayEventEnvelope — discriminated union of all valid event shapes.
 *
 * Each member binds a specific kind number to its typed payload interface
 * (from RelayPayloadMap). Passing an unrecognised kind or a payload that
 * doesn't match the kind's interface is a compile-time error.
 *
 * The NoZ1Fields<P> wrapper is retained as a belt-and-suspenders guard:
 * even if a payload interface were ever accidentally given a Z1 field, the
 * call site would still fail to compile.
 */
type RelayEnvelopeBase = {
  z2npub: string;
  timestamp: string;
  signature: "stub";
};

type RelayEventEnvelope = {
  [K in keyof RelayPayloadMap]: RelayEnvelopeBase & {
    kind: K;
    payload: NoZ1Fields<RelayPayloadMap[K]>;
  };
}[keyof RelayPayloadMap];

export const RELAY_STORAGE_KEY = "ns:relay:events";

/**
 * getZ2Npub — returns the system Z2 npub for relay attribution.
 *
 * Reads VITE_Z2_NPUB from the Vite environment (set once the system npub is
 * registered on the relay). Falls back to "z2:local" so existing behaviour is
 * preserved when the variable is absent.
 */
export function getZ2Npub(): string {
  return (import.meta.env.VITE_Z2_NPUB as string | undefined) || "z2:local";
}
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

async function sendViaApi(
  event: NostrEvent,
  publishUrl: string = RELAY_PUBLISH_URL ?? "",
): Promise<boolean> {
  if (!publishUrl) return false;

  const token = getOwnerToken();
  if (!token) return false;

  try {
    const res = await fetch(publishUrl, {
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

export async function publishToRelay(
  event: RelayEventEnvelope,
): Promise<void> {
  if (typeof window === "undefined") return;

  const ev = event as NostrEvent;

  const delivered = await sendViaApi(ev);
  if (!delivered) {
    storeLocally(ev);
  }
}

const NON_LAB_EVENT_DRAIN_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/** Module-level handle so startRelayBufferDrainTimer is idempotent. */
let _drainTimerId: ReturnType<typeof setInterval> | null = null;

/**
 * Single-flight guard: prevents overlapping flush runs.
 *
 * sendViaApi calls are async (network round-trips), so a flush initiated by the
 * 5-minute timer could still be in progress when the next tick fires. Allowing
 * two runs to overlap would create a write-after-write race: both reads the
 * same initial buffer snapshot and both writes a "remaining" subset, with the
 * later write overwriting any successful removals from the earlier one.
 */
let _flushInProgress = false;

/**
 * flushNonLabEvents — attempts to deliver all non-LAB_EVENT entries in the
 * relay fallback buffer to the API. Successfully delivered entries are removed
 * from the buffer; entries that fail delivery are left for the next cycle.
 *
 * This complements the LAB_EVENT drain in onRehydrateStorage (store.ts): those
 * events are reconciled into channel state on page load, while non-LAB_EVENT
 * entries (MORNING_MANIFEST, WORKBENCH_PLAN_BURST, CHANNEL_OPEN, etc.) only
 * need to reach the relay endpoint once and can then be discarded.
 *
 * Race safety: the function is single-flight (concurrent calls are dropped) and
 * re-reads localStorage after all deliveries complete before writing back, so
 * events appended to the buffer while deliveries were in flight are never lost.
 *
 * Called by the background timer installed by startRelayBufferDrainTimer, and
 * exported for deterministic unit tests.
 */
export async function flushNonLabEvents(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!RELAY_PUBLISH_URL) return;
  const token = getOwnerToken();
  if (!token) return;

  // Drop concurrent invocations instead of running them in parallel.
  if (_flushInProgress) return;
  _flushInProgress = true;

  try {
    let snapshot: NostrEvent[] = [];
    try {
      snapshot = JSON.parse(
        localStorage.getItem(RELAY_STORAGE_KEY) ?? "[]",
      ) as NostrEvent[];
    } catch {
      return;
    }

    // LAB_EVENT kind is 1011 — defined later in this file as RELAY_EVENT_KINDS.LAB_EVENT.
    // Using the literal here to avoid a forward-reference issue at module-init time.
    const LAB_EVENT_KIND = 1011;

    const nonLab = snapshot.filter((e) => (e.kind as number) !== LAB_EVENT_KIND);
    if (nonLab.length === 0) return;

    // Attempt delivery sequentially to avoid hammering the API.
    // Track successfully delivered events by their JSON fingerprint — stable
    // because these objects are never mutated after being read from storage.
    const deliveredKeys = new Set<string>();
    for (const ev of nonLab) {
      const ok = await sendViaApi(ev);
      if (ok) deliveredKeys.add(JSON.stringify(ev));
    }

    if (deliveredKeys.size === 0) return;

    // Re-read the buffer now that deliveries are complete. New events may have
    // been appended by publishToRelay → storeLocally while we were awaiting
    // network responses above. Writing a stale "remaining" derived only from
    // the original snapshot would silently drop those new entries.
    let current: NostrEvent[] = [];
    try {
      current = JSON.parse(
        localStorage.getItem(RELAY_STORAGE_KEY) ?? "[]",
      ) as NostrEvent[];
    } catch {
      // Fall back to the snapshot if the re-read fails; we still remove
      // successfully delivered events rather than keeping them indefinitely.
      current = snapshot;
    }

    // Remove only the events we confirmed delivered, matched by fingerprint.
    // Events appended after our snapshot was taken will not match any key in
    // deliveredKeys and will be preserved.
    const remaining = current.filter((e) => !deliveredKeys.has(JSON.stringify(e)));

    if (remaining.length !== current.length) {
      localStorage.setItem(RELAY_STORAGE_KEY, JSON.stringify(remaining));
    }
  } finally {
    _flushInProgress = false;
  }
}

/**
 * drainRelayQueue — attempts to deliver every event in the ns:relay:events
 * fallback buffer to the API, removing entries that are successfully delivered.
 *
 * Unlike flushNonLabEvents (which handles only non-LAB_EVENT entries on a
 * periodic timer), this processes the entire queue and is designed to be
 * called when connectivity is restored (window 'online' event) or on
 * app load.
 *
 * Race safety: re-reads localStorage after all deliveries complete before
 * writing back, so events appended by publishToRelay during the async loop
 * are never silently dropped.
 *
 * No-ops when:
 *   - VITE_RELAY_PUBLISH_URL is not configured
 *   - no owner token is present in localStorage
 *   - the queue is empty
 */
/**
 * @param _publishUrl  Override the API endpoint URL. Defaults to
 *   VITE_RELAY_PUBLISH_URL. Exposed so unit tests can inject a value without
 *   needing a module reset (VITE_* env vars are inlined at transform time and
 *   cannot be changed by vi.stubEnv after the module is loaded).
 */
export async function drainRelayQueue(
  _publishUrl: string | undefined = RELAY_PUBLISH_URL,
): Promise<void> {
  if (typeof window === "undefined") return;
  if (!_publishUrl) return;
  const token = getOwnerToken();
  if (!token) return;

  let snapshot: NostrEvent[] = [];
  try {
    snapshot = JSON.parse(
      localStorage.getItem(RELAY_STORAGE_KEY) ?? "[]",
    ) as NostrEvent[];
  } catch {
    return;
  }

  if (snapshot.length === 0) return;

  // Attempt delivery sequentially; collect fingerprints of delivered events.
  const deliveredKeys = new Set<string>();
  for (const ev of snapshot) {
    const ok = await sendViaApi(ev, _publishUrl);
    if (ok) deliveredKeys.add(JSON.stringify(ev));
  }

  if (deliveredKeys.size === 0) return;

  // Re-read the buffer now that deliveries are complete so that events
  // appended during the async loop are not silently dropped.
  let current: NostrEvent[] = [];
  try {
    current = JSON.parse(
      localStorage.getItem(RELAY_STORAGE_KEY) ?? "[]",
    ) as NostrEvent[];
  } catch {
    current = snapshot;
  }

  const remaining = current.filter(
    (e) => !deliveredKeys.has(JSON.stringify(e)),
  );
  if (remaining.length !== current.length) {
    localStorage.setItem(RELAY_STORAGE_KEY, JSON.stringify(remaining));
  }
}

/** Module-level guard so registerRelayOnlineDrain is idempotent. */
let _onlineDrainRegistered = false;

/**
 * registerRelayOnlineDrain — registers drainRelayQueue to run whenever
 * the browser fires the window 'online' event (connectivity restored), and
 * fires it once immediately as an app-load drain.
 *
 * Safe to call more than once — duplicate calls while a listener is already
 * registered are no-ops. Only active when VITE_RELAY_PUBLISH_URL is set.
 *
 * Returns a cleanup function that removes the listener and resets the guard
 * (useful in tests and component teardown).
 */
export function registerRelayOnlineDrain(): () => void {
  if (typeof window === "undefined") return () => {};
  if (!RELAY_PUBLISH_URL) return () => {};
  if (_onlineDrainRegistered) {
    return () => {};
  }

  _onlineDrainRegistered = true;

  const handler = () => {
    void drainRelayQueue(RELAY_PUBLISH_URL);
  };
  window.addEventListener("online", handler);

  // App-load drain: attempt delivery of anything queued while offline.
  void drainRelayQueue(RELAY_PUBLISH_URL);

  return () => {
    window.removeEventListener("online", handler);
    _onlineDrainRegistered = false;
  };
}

/**
 * startRelayBufferDrainTimer — installs a periodic background timer that
 * calls flushNonLabEvents every `intervalMs` milliseconds (default 5 min).
 *
 * Safe to call more than once — subsequent calls while a timer is already
 * running are no-ops. Returns a cleanup function that clears the interval.
 */
export function startRelayBufferDrainTimer(
  intervalMs: number = NON_LAB_EVENT_DRAIN_INTERVAL_MS,
): () => void {
  if (typeof window === "undefined") return () => {};
  if (_drainTimerId !== null) {
    return () => {
      if (_drainTimerId !== null) {
        clearInterval(_drainTimerId);
        _drainTimerId = null;
      }
    };
  }

  _drainTimerId = setInterval(() => {
    void flushNonLabEvents();
  }, intervalMs);

  return () => {
    if (_drainTimerId !== null) {
      clearInterval(_drainTimerId);
      _drainTimerId = null;
    }
  };
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
  /** Zone 2 — emitted when an agent publishes a new improvement proposal for human review */
  IMPROVEMENT_PROPOSAL: 1009,
  /** Zone 2 — emitted when the human operator accepts or rejects a pending improvement proposal */
  IMPROVEMENT_PROPOSAL_OUTCOME: 1010,
  /** Zone 2 — emitted when an agent or human posts a message into a lab channel */
  LAB_EVENT: 1011,
  /** Zone 2 — emitted when a channel is opened (addChannel), including auto-opened burst channels */
  CHANNEL_OPEN: 1012,
  /** Zone 2 — emitted when a channel is explicitly archived via expireChannel */
  CHANNEL_CLOSE: 1013,
} as const;
