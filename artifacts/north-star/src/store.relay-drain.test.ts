/**
 * store.relay-drain.test.ts
 *
 * Covers the reconcile-then-drain cycle for ns:relay:events.
 *
 * The onRehydrateStorage hook in store.ts:
 *   1. Reads the ns:relay:events fallback buffer from localStorage.
 *   2. Merges kind-1011 (LAB_EVENT) entries whose channel_id matches a known
 *      channel back into that channel's event_feed (dedup by event_id).
 *   3. Calls drainRelayBuffer to produce the filtered buffer, then writes it
 *      back to localStorage.
 *
 * drainRelayBuffer is exported as a pure function so every edge of the drain
 * logic can be covered without fighting the module-singleton hydration timing.
 *
 * Scenarios validated here:
 *   A — Already-present events (known channel, event_id already in feed) → drained
 *   B — New-merged events (known channel, event_id not yet in feed) → drained
 *   C — Orphaned-but-recent events (unknown channel_id, age ≤ 7 days) → kept
 *   D — Orphaned-but-stale events (unknown channel_id, age > 7 days) → pruned
 *   E — Non-LAB_EVENT entries are never touched by the drain pass → always kept
 *   F — Mixed buffer: the correct subset survives after a single drain call
 *   G — Empty buffer: no localStorage write is triggered
 *   H — All-known-channel buffer: results in an empty array
 *   I — Boundary: event exactly at the 7-day boundary is kept (≤, not <)
 *   J — Event with no posted_at falls back to the envelope timestamp for age check
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  drainRelayBuffer,
  RELAY_DRAIN_STALE_MS,
  type StoredRelayEvent,
} from "./store";
import { RELAY_EVENT_KINDS, RELAY_STORAGE_KEY } from "./lib/relay-stub";
import type { LabEventPayload } from "./lib/relay-event-types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const NOW_MS = new Date("2026-07-29T12:00:00.000Z").getTime();

/** Build a LAB_EVENT StoredRelayEvent for a given channel. */
function labEvent(
  channelId: string,
  opts: {
    eventId?: string;
    postedAt?: string;
    text?: string;
    timestamp?: string;
  } = {},
): StoredRelayEvent {
  const postedAt = opts.postedAt ?? new Date(NOW_MS - 60_000).toISOString(); // 1 min ago by default
  const payload: LabEventPayload = {
    zone: "Z2",
    actor_type: "human",
    channel_id: channelId,
    text: opts.text ?? "hello",
    posted_at: postedAt,
    ...(opts.eventId ? { event_id: opts.eventId } : {}),
  };
  return {
    kind: RELAY_EVENT_KINDS.LAB_EVENT,
    payload,
    timestamp: opts.timestamp ?? postedAt,
  };
}

/** A non-LAB_EVENT entry (e.g. MORNING_MANIFEST). */
function otherEvent(kind = RELAY_EVENT_KINDS.MORNING_MANIFEST): StoredRelayEvent {
  return {
    kind,
    payload: { date: "2026-07-29" },
    timestamp: new Date(NOW_MS - 30_000).toISOString(),
  };
}

beforeEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// A — Already-present events
// Already in the channel's event_feed AND in the relay buffer.
// The buffer entry should be drained regardless.
// ---------------------------------------------------------------------------
describe("A — already-present events (known channel_id)", () => {
  it("removes a LAB_EVENT whose channel_id is in knownChannelIds", () => {
    const ev = labEvent("ch-alpha", { eventId: "ev-1" });
    const knownIds = new Set(["ch-alpha"]);

    const result = drainRelayBuffer([ev], knownIds, NOW_MS);

    expect(result).toHaveLength(0);
  });

  it("removes multiple entries for the same known channel", () => {
    const events = [
      labEvent("ch-alpha", { eventId: "ev-1" }),
      labEvent("ch-alpha", { eventId: "ev-2" }),
      labEvent("ch-alpha", { eventId: "ev-3" }),
    ];
    const knownIds = new Set(["ch-alpha"]);

    expect(drainRelayBuffer(events, knownIds, NOW_MS)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// B — New-merged events
// Not yet in event_feed but channel_id is known → still drained, because the
// reconciler just merged them.
// ---------------------------------------------------------------------------
describe("B — new-merged events (known channel_id, no prior dedup entry)", () => {
  it("drains a fresh event for a known channel", () => {
    const ev = labEvent("ch-beta", { eventId: "ev-new-1" });
    const knownIds = new Set(["ch-beta"]);

    expect(drainRelayBuffer([ev], knownIds, NOW_MS)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// C — Orphaned-but-recent events
// channel_id is not in knownChannelIds; event is ≤ 7 days old → must survive.
// ---------------------------------------------------------------------------
describe("C — orphaned-but-recent events (unknown channel_id, age ≤ 7 days)", () => {
  it("keeps an orphaned event that is 1 hour old", () => {
    const recentTs = new Date(NOW_MS - 60 * 60 * 1000).toISOString();
    const ev = labEvent("ch-unknown", { postedAt: recentTs });
    const knownIds = new Set<string>(["ch-other"]);

    const result = drainRelayBuffer([ev], knownIds, NOW_MS);

    expect(result).toHaveLength(1);
    expect((result[0].payload as LabEventPayload).channel_id).toBe("ch-unknown");
  });

  it("keeps an orphaned event that is exactly 1 ms inside the 7-day window", () => {
    const justInsideTs = new Date(NOW_MS - RELAY_DRAIN_STALE_MS + 1).toISOString();
    const ev = labEvent("ch-orphan", { postedAt: justInsideTs });

    expect(drainRelayBuffer([ev], new Set(), NOW_MS)).toHaveLength(1);
  });

  it("keeps an orphaned event at exactly the 7-day boundary (boundary is inclusive)", () => {
    const boundaryTs = new Date(NOW_MS - RELAY_DRAIN_STALE_MS).toISOString();
    const ev = labEvent("ch-orphan", { postedAt: boundaryTs });

    expect(drainRelayBuffer([ev], new Set(), NOW_MS)).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// D — Orphaned-but-stale events
// channel_id is not in knownChannelIds; event is > 7 days old → must be pruned.
// ---------------------------------------------------------------------------
describe("D — orphaned-but-stale events (unknown channel_id, age > 7 days)", () => {
  it("prunes an orphaned event that is 8 days old", () => {
    const staleTs = new Date(NOW_MS - 8 * 24 * 60 * 60 * 1000).toISOString();
    const ev = labEvent("ch-ghost", { postedAt: staleTs });

    expect(drainRelayBuffer([ev], new Set(), NOW_MS)).toHaveLength(0);
  });

  it("prunes an orphaned event that is 1 ms beyond the 7-day boundary", () => {
    const justOverTs = new Date(NOW_MS - RELAY_DRAIN_STALE_MS - 1).toISOString();
    const ev = labEvent("ch-ghost", { postedAt: justOverTs });

    expect(drainRelayBuffer([ev], new Set(), NOW_MS)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// E — Non-LAB_EVENT entries are never touched
// ---------------------------------------------------------------------------
describe("E — non-LAB_EVENT entries are always kept", () => {
  it("keeps MORNING_MANIFEST entries regardless of knownChannelIds", () => {
    const ev = otherEvent(RELAY_EVENT_KINDS.MORNING_MANIFEST);
    expect(drainRelayBuffer([ev], new Set(["anything"]), NOW_MS)).toHaveLength(1);
  });

  it("keeps BRIEFING_ENVELOPE entries", () => {
    const ev = otherEvent(RELAY_EVENT_KINDS.BRIEFING_ENVELOPE);
    expect(drainRelayBuffer([ev], new Set(), NOW_MS)).toHaveLength(1);
  });

  it("keeps CONTRACT_MILESTONE entries", () => {
    const ev = otherEvent(RELAY_EVENT_KINDS.CONTRACT_MILESTONE);
    expect(drainRelayBuffer([ev], new Set(), NOW_MS)).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// F — Mixed buffer: the correct subset survives
// ---------------------------------------------------------------------------
describe("F — mixed buffer with all four LAB_EVENT categories", () => {
  it("drains reconciled entries and prunes stale orphans, keeps recent orphans and non-lab entries", () => {
    const knownChannelId = "ch-known";
    const orphanRecentTs = new Date(NOW_MS - 2 * 24 * 60 * 60 * 1000).toISOString(); // 2 days
    const orphanStaleTs = new Date(NOW_MS - 10 * 24 * 60 * 60 * 1000).toISOString(); // 10 days

    const alreadyPresent = labEvent(knownChannelId, { eventId: "ev-old", postedAt: orphanRecentTs });
    const newMerged = labEvent(knownChannelId, { eventId: "ev-new" });
    const orphanRecent = labEvent("ch-unknown", { postedAt: orphanRecentTs, eventId: "ev-recent" });
    const orphanStale = labEvent("ch-ghost", { postedAt: orphanStaleTs, eventId: "ev-stale" });
    const nonLab = otherEvent();

    const buffer = [alreadyPresent, newMerged, orphanRecent, orphanStale, nonLab];
    const result = drainRelayBuffer(buffer, new Set([knownChannelId]), NOW_MS);

    // Only the recent orphan and the non-lab event survive
    expect(result).toHaveLength(2);
    const payloads = result.map((e) =>
      e.kind === RELAY_EVENT_KINDS.LAB_EVENT
        ? (e.payload as LabEventPayload).event_id
        : "non-lab",
    );
    expect(payloads).toContain("ev-recent");
    expect(payloads).toContain("non-lab");
    expect(payloads).not.toContain("ev-old");
    expect(payloads).not.toContain("ev-new");
    expect(payloads).not.toContain("ev-stale");
  });

  it("does not mutate the original array", () => {
    const ev1 = labEvent("ch-known", { eventId: "ev-1" });
    const ev2 = labEvent("ch-unknown");
    const original = [ev1, ev2];

    drainRelayBuffer(original, new Set(["ch-known"]), NOW_MS);

    expect(original).toHaveLength(2); // untouched
  });
});

// ---------------------------------------------------------------------------
// G — Empty buffer: returns empty array without side-effects
// ---------------------------------------------------------------------------
describe("G — empty buffer", () => {
  it("returns an empty array when the buffer is empty", () => {
    expect(drainRelayBuffer([], new Set(["ch-a", "ch-b"]), NOW_MS)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// H — All events belong to known channels
// ---------------------------------------------------------------------------
describe("H — buffer with only known-channel events", () => {
  it("returns an empty array when every LAB_EVENT is for a known channel", () => {
    const events = [
      labEvent("ch-1", { eventId: "a" }),
      labEvent("ch-2", { eventId: "b" }),
      labEvent("ch-1", { eventId: "c" }),
    ];
    const known = new Set(["ch-1", "ch-2"]);

    expect(drainRelayBuffer(events, known, NOW_MS)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// I — Boundary: event exactly at the 7-day mark is kept (age ≤ RELAY_DRAIN_STALE_MS)
// already tested in section C; this is an explicit alias test for clarity
// ---------------------------------------------------------------------------
describe("I — 7-day boundary edge case", () => {
  it("RELAY_DRAIN_STALE_MS is exactly 7 days in milliseconds", () => {
    expect(RELAY_DRAIN_STALE_MS).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it("event aged exactly RELAY_DRAIN_STALE_MS is NOT pruned (boundary is ≤, inclusive)", () => {
    const boundaryTs = new Date(NOW_MS - RELAY_DRAIN_STALE_MS).toISOString();
    const ev = labEvent("ch-orphan", { postedAt: boundaryTs });

    const result = drainRelayBuffer([ev], new Set(), NOW_MS);

    expect(result).toHaveLength(1);
  });

  it("event aged RELAY_DRAIN_STALE_MS + 1 ms IS pruned", () => {
    const justOverTs = new Date(NOW_MS - RELAY_DRAIN_STALE_MS - 1).toISOString();
    const ev = labEvent("ch-orphan", { postedAt: justOverTs });

    expect(drainRelayBuffer([ev], new Set(), NOW_MS)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// J — Fallback to envelope timestamp when payload.posted_at is absent
// ---------------------------------------------------------------------------
describe("J — posted_at absent: falls back to envelope timestamp", () => {
  it("uses envelope timestamp for age when payload has no posted_at", () => {
    const staleTs = new Date(NOW_MS - 10 * 24 * 60 * 60 * 1000).toISOString();
    // Construct manually to omit posted_at from the payload
    const ev: StoredRelayEvent = {
      kind: RELAY_EVENT_KINDS.LAB_EVENT,
      payload: {
        zone: "Z2",
        actor_type: "human",
        channel_id: "ch-legacy",
        text: "legacy message",
        // no posted_at
      },
      timestamp: staleTs, // stale envelope timestamp
    };

    // Orphaned + stale → should be pruned
    expect(drainRelayBuffer([ev], new Set(), NOW_MS)).toHaveLength(0);
  });

  it("keeps a recent orphan that has no posted_at when envelope timestamp is fresh", () => {
    const freshTs = new Date(NOW_MS - 30_000).toISOString(); // 30 s ago
    const ev: StoredRelayEvent = {
      kind: RELAY_EVENT_KINDS.LAB_EVENT,
      payload: {
        zone: "Z2",
        actor_type: "human",
        channel_id: "ch-legacy-fresh",
        text: "recent legacy",
        // no posted_at
      },
      timestamp: freshTs,
    };

    expect(drainRelayBuffer([ev], new Set(), NOW_MS)).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// localStorage integration: drainRelayBuffer result is correctly persisted
// ---------------------------------------------------------------------------
describe("localStorage integration — drain result is written back", () => {
  it("writes the filtered buffer back to RELAY_STORAGE_KEY when the size changes", () => {
    const knownChannelId = "ch-live";
    const staleTs = new Date(NOW_MS - 9 * 24 * 60 * 60 * 1000).toISOString();
    const recentTs = new Date(NOW_MS - 60_000).toISOString();

    const seed = [
      labEvent(knownChannelId, { eventId: "ev-1" }),   // drained (known)
      labEvent("ch-gone", { postedAt: staleTs }),        // pruned (stale orphan)
      labEvent("ch-orphan", { postedAt: recentTs }),     // kept   (recent orphan)
      otherEvent(),                                       // kept   (non-lab)
    ];

    localStorage.setItem(RELAY_STORAGE_KEY, JSON.stringify(seed));

    const stored = JSON.parse(localStorage.getItem(RELAY_STORAGE_KEY)!) as StoredRelayEvent[];
    const remaining = drainRelayBuffer(stored, new Set([knownChannelId]), NOW_MS);

    // Simulate what onRehydrateStorage does after computing `remaining`:
    if (remaining.length !== stored.length) {
      localStorage.setItem(RELAY_STORAGE_KEY, JSON.stringify(remaining));
    }

    const afterDrain = JSON.parse(localStorage.getItem(RELAY_STORAGE_KEY)!) as StoredRelayEvent[];
    expect(afterDrain).toHaveLength(2); // recent orphan + non-lab
    const labInAfter = afterDrain.filter((e) => e.kind === RELAY_EVENT_KINDS.LAB_EVENT);
    expect(labInAfter).toHaveLength(1);
    expect((labInAfter[0].payload as LabEventPayload).channel_id).toBe("ch-orphan");
  });

  it("skips the localStorage write when nothing was drained", () => {
    const seed = [otherEvent(), otherEvent()]; // no lab events → nothing to drain
    localStorage.setItem(RELAY_STORAGE_KEY, JSON.stringify(seed));

    const stored = JSON.parse(localStorage.getItem(RELAY_STORAGE_KEY)!) as StoredRelayEvent[];
    const remaining = drainRelayBuffer(stored, new Set(), NOW_MS);

    // Verify that the length guard correctly identifies no change needed
    expect(remaining.length).toBe(stored.length);

    // Overwrite with a sentinel to confirm the guard prevents the write
    localStorage.setItem(RELAY_STORAGE_KEY, "SENTINEL");
    if (remaining.length !== stored.length) {
      localStorage.setItem(RELAY_STORAGE_KEY, JSON.stringify(remaining));
    }
    expect(localStorage.getItem(RELAY_STORAGE_KEY)).toBe("SENTINEL");
  });
});
