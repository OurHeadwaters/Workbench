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

/**
 * AGENT_ROLE_REGISTRY — canonical list of named agent personas.
 *
 * Each entry documents the role's responsibility, a short description for
 * display in the UI, and a suggested model note so future Helping Hands
 * agents can pick an appropriate LLM without hard-coding it in-app.
 *
 * Roles map to the AgentRole type in types.ts. Add new roles there first,
 * then document them here.
 */
export const AGENT_ROLE_REGISTRY = [
  {
    role: "river-smith" as const,
    name: "River Smith",
    description: "Nightly strategic review across the seven dimensions (Physical, Biological, Psychological, Quantum, Soul, Collective, Future). The river runs at 11:45 PM; the briefing waits at dawn.",
    suggestedModelNote: "Needs strong long-context reasoning; optimise for depth over speed.",
  },
  {
    role: "critical-challenger" as const,
    name: "Critical Challenger",
    description: "Surfaces counter-arguments, blind spots, and risk flags on any proposed plan or decision. Asks the hard questions the human might avoid.",
    suggestedModelNote: "Adversarial reasoning; benefits from a model with strong argumentation capability.",
  },
  {
    role: "r-and-d" as const,
    name: "R&D Lead",
    description: "Research, discovery, and prototype proposals. Brings external information in and synthesises it against the current constellation context.",
    suggestedModelNote: "Benefits from web-search access and strong synthesis ability.",
  },
  {
    role: "ops" as const,
    name: "Stability & Operations",
    description: "Maintains scheduling signals, monitors burst windows, flags stalled work, and keeps the operational layer running smoothly.",
    suggestedModelNote: "Needs reliable structured output; optimise for consistency over creativity.",
  },
] as const;

export type AgentRoleEntry = (typeof AGENT_ROLE_REGISTRY)[number];

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
