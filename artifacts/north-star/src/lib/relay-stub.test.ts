import { describe, it, expect, beforeEach } from "vitest";
import { publishToRelay, RELAY_EVENT_KINDS } from "./relay-stub";
import type { NostrEvent } from "./relay-stub";
import { useStore } from "../store";

const STORAGE_KEY = "ns:relay:events";

function readStored(): NostrEvent[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as NostrEvent[];
}

beforeEach(() => {
  localStorage.clear();
});

describe("publishToRelay — write", () => {
  it("writes a MORNING_MANIFEST event to localStorage", async () => {
    await publishToRelay({
      kind: RELAY_EVENT_KINDS.MORNING_MANIFEST,
      payload: {
        date: "2026-07-26",
        constellation_ids: ["abc", "def"],
        acknowledged_guardrails: [],
        zone_ranking: ["Z0", "Z1", "Z2"],
        burst_windows: null,
      },
      z2npub: "z2:local",
      timestamp: "2026-07-26T08:00:00.000Z",
      signature: "stub",
    });

    const stored = readStored();
    expect(stored).toHaveLength(1);
    expect(stored[0].kind).toBe(RELAY_EVENT_KINDS.MORNING_MANIFEST);
    expect((stored[0].payload as Record<string, unknown>).date).toBe("2026-07-26");
  });

  it("writes a BRIEFING_ENVELOPE event to localStorage", async () => {
    await publishToRelay({
      kind: RELAY_EVENT_KINDS.BRIEFING_ENVELOPE,
      payload: {
        briefing_id: "br-001",
        generated_at: "2026-07-26T09:00:00.000Z",
        triggered_by: "manual",
        safety_flags_count: 0,
      },
      z2npub: "z2:local",
      timestamp: "2026-07-26T09:00:00.000Z",
      signature: "stub",
    });

    const stored = readStored();
    expect(stored).toHaveLength(1);
    expect(stored[0].kind).toBe(RELAY_EVENT_KINDS.BRIEFING_ENVELOPE);
    expect((stored[0].payload as Record<string, unknown>).briefing_id).toBe("br-001");
  });

  it("appends multiple events in order", async () => {
    await publishToRelay({
      kind: RELAY_EVENT_KINDS.MORNING_MANIFEST,
      payload: { date: "2026-07-25" },
      z2npub: "z2:local",
      timestamp: "2026-07-25T08:00:00.000Z",
      signature: "stub",
    });
    await publishToRelay({
      kind: RELAY_EVENT_KINDS.BRIEFING_ENVELOPE,
      payload: { briefing_id: "br-002" },
      z2npub: "z2:local",
      timestamp: "2026-07-25T09:00:00.000Z",
      signature: "stub",
    });

    const stored = readStored();
    expect(stored).toHaveLength(2);
    expect(stored[0].kind).toBe(RELAY_EVENT_KINDS.MORNING_MANIFEST);
    expect(stored[1].kind).toBe(RELAY_EVENT_KINDS.BRIEFING_ENVELOPE);
  });

  it("round-trips all NostrEvent fields faithfully", async () => {
    const ts = "2026-07-26T10:00:00.000Z";
    await publishToRelay({
      kind: RELAY_EVENT_KINDS.GATE_CROSSING,
      payload: { crossing: "Z1\u2192Z2", crossed_at: ts },
      z2npub: "z2:npub1test",
      timestamp: ts,
      signature: "stub",
    });

    const [ev] = readStored();
    expect(ev.z2npub).toBe("z2:npub1test");
    expect(ev.timestamp).toBe(ts);
    expect(ev.signature).toBe("stub");
  });
});

describe("publishToRelay — ring buffer trim", () => {
  it("keeps at most 500 events when over the limit", async () => {
    const preload: NostrEvent[] = Array.from({ length: 500 }, (_, i) => ({
      kind: RELAY_EVENT_KINDS.MORNING_MANIFEST,
      payload: { seq: i },
      z2npub: "z2:local",
      timestamp: new Date(i * 1000).toISOString(),
      signature: "stub",
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preload));

    await publishToRelay({
      kind: RELAY_EVENT_KINDS.BRIEFING_ENVELOPE,
      payload: { briefing_id: "br-new" },
      z2npub: "z2:local",
      timestamp: "2026-07-26T12:00:00.000Z",
      signature: "stub",
    });

    const stored = readStored();
    expect(stored).toHaveLength(500);
  });

  it("keeps the newest 500 events — oldest are dropped", async () => {
    const preload: NostrEvent[] = Array.from({ length: 500 }, (_, i) => ({
      kind: RELAY_EVENT_KINDS.MORNING_MANIFEST,
      payload: { seq: i },
      z2npub: "z2:local",
      timestamp: new Date(i * 1000).toISOString(),
      signature: "stub",
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preload));

    await publishToRelay({
      kind: RELAY_EVENT_KINDS.BRIEFING_ENVELOPE,
      payload: { briefing_id: "br-newest" },
      z2npub: "z2:local",
      timestamp: "2026-07-26T12:00:00.000Z",
      signature: "stub",
    });

    const stored = readStored();
    expect(stored[0].kind).toBe(RELAY_EVENT_KINDS.MORNING_MANIFEST);
    expect((stored[0].payload as Record<string, unknown>).seq).toBe(1);
    const last = stored[stored.length - 1];
    expect(last.kind).toBe(RELAY_EVENT_KINDS.BRIEFING_ENVELOPE);
    expect((last.payload as Record<string, unknown>).briefing_id).toBe("br-newest");
  });

  it("handles corrupt localStorage gracefully and writes one event", async () => {
    localStorage.setItem(STORAGE_KEY, "not-valid-json{{");

    await publishToRelay({
      kind: RELAY_EVENT_KINDS.MORNING_MANIFEST,
      payload: { date: "2026-07-26" },
      z2npub: "z2:local",
      timestamp: "2026-07-26T08:00:00.000Z",
      signature: "stub",
    });

    const stored = readStored();
    expect(stored).toHaveLength(1);
    expect(stored[0].kind).toBe(RELAY_EVENT_KINDS.MORNING_MANIFEST);
  });
});

describe("RELAY_EVENT_KINDS — new constants", () => {
  it("exports all six new kind constants", () => {
    expect(typeof RELAY_EVENT_KINDS.WORKBENCH_PLAN_BURST).toBe("number");
    expect(typeof RELAY_EVENT_KINDS.HELPING_HANDS_CREATE).toBe("number");
    expect(typeof RELAY_EVENT_KINDS.HELPING_HANDS_CLAIM).toBe("number");
    expect(typeof RELAY_EVENT_KINDS.HELPING_HANDS_COMPLETE).toBe("number");
    expect(typeof RELAY_EVENT_KINDS.HELPING_HANDS_CONFIRM).toBe("number");
    expect(typeof RELAY_EVENT_KINDS.CONTRACT_MILESTONE).toBe("number");
  });

  it("all kind values are unique — no collisions across the full registry", () => {
    const values = Object.values(RELAY_EVENT_KINDS);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });
});

describe("publishToRelay — Z1 compile-time gate", () => {
  it("accepts a payload with no Z1 fields", async () => {
    await expect(
      publishToRelay({
        kind: RELAY_EVENT_KINDS.MORNING_MANIFEST,
        payload: { date: "2026-07-26", safe_field: true },
        z2npub: "z2:local",
        timestamp: "2026-07-26T08:00:00.000Z",
        signature: "stub",
      })
    ).resolves.toBeUndefined();
  });

  it("type-level: payload with 'name' is rejected by NoZ1Fields — @ts-expect-error confirms compile gate", () => {
    // @ts-expect-error — NoZ1Fields<{name: string}> resolves to never; this must not compile
    void publishToRelay({
      kind: RELAY_EVENT_KINDS.MORNING_MANIFEST,
      payload: { name: "Alice" },
      z2npub: "z2:local",
      timestamp: "2026-07-26T08:00:00.000Z",
      signature: "stub",
    });
  });

  it("type-level: payload with 'passphrase' is rejected by NoZ1Fields — @ts-expect-error confirms compile gate", () => {
    // @ts-expect-error — NoZ1Fields<{passphrase: string}> resolves to never; this must not compile
    void publishToRelay({
      kind: RELAY_EVENT_KINDS.MORNING_MANIFEST,
      payload: { passphrase: "hunter2" },
      z2npub: "z2:local",
      timestamp: "2026-07-26T08:00:00.000Z",
      signature: "stub",
    });
  });

  it("type-level: payload with 'statement' is rejected by NoZ1Fields — @ts-expect-error confirms compile gate", () => {
    // @ts-expect-error — NoZ1Fields<{statement: string}> resolves to never; this must not compile
    void publishToRelay({
      kind: RELAY_EVENT_KINDS.MORNING_MANIFEST,
      payload: { statement: "I am the founder" },
      z2npub: "z2:local",
      timestamp: "2026-07-26T08:00:00.000Z",
      signature: "stub",
    });
  });
});

describe("attestMilestone — validation guards", () => {
  it("throws when attestedBy is empty", () => {
    const { attestMilestone } = useStore.getState();
    expect(() =>
      attestMilestone({ contractId: "c-1", description: "Delivery confirmed", attestedBy: "" })
    ).toThrow("attestedBy");
    expect(readStored()).toHaveLength(0);
  });

  it("throws when attestedBy is blank whitespace", () => {
    const { attestMilestone } = useStore.getState();
    expect(() =>
      attestMilestone({ contractId: "c-1", description: "Delivery confirmed", attestedBy: "   " })
    ).toThrow("attestedBy");
    expect(readStored()).toHaveLength(0);
  });

  it("throws when description is empty", () => {
    const { attestMilestone } = useStore.getState();
    expect(() =>
      attestMilestone({ contractId: "c-1", description: "", attestedBy: "z3npub1abc" })
    ).toThrow("description");
    expect(readStored()).toHaveLength(0);
  });

  it("throws when description is blank whitespace", () => {
    const { attestMilestone } = useStore.getState();
    expect(() =>
      attestMilestone({ contractId: "c-1", description: "   ", attestedBy: "z3npub1abc" })
    ).toThrow("description");
    expect(readStored()).toHaveLength(0);
  });

  it("does not publish to relay when attestedBy is missing", () => {
    const { attestMilestone } = useStore.getState();
    try {
      attestMilestone({ contractId: "c-1", description: "Phase done", attestedBy: "" });
    } catch {
      // expected
    }
    expect(readStored()).toHaveLength(0);
  });

  it("does not publish to relay when description is missing", () => {
    const { attestMilestone } = useStore.getState();
    try {
      attestMilestone({ contractId: "c-1", description: "", attestedBy: "z3npub1abc" });
    } catch {
      // expected
    }
    expect(readStored()).toHaveLength(0);
  });
});

describe("attestMilestone — CONTRACT_MILESTONE relay event payload", () => {
  it("writes a CONTRACT_MILESTONE event to the relay when inputs are valid", async () => {
    const { attestMilestone } = useStore.getState();
    attestMilestone({
      contractId: "c-42",
      description: "Phase 1 complete",
      attestedBy: "z3npub1abc",
    });

    // publishToRelay is fire-and-forget; yield so the microtask queue drains
    await Promise.resolve();

    const stored = readStored();
    expect(stored).toHaveLength(1);
    expect(stored[0].kind).toBe(RELAY_EVENT_KINDS.CONTRACT_MILESTONE);
  });

  it("payload contains all required ContractMilestonePayload fields", async () => {
    const { attestMilestone } = useStore.getState();
    attestMilestone({
      contractId: "c-99",
      description: "Delivery accepted by council",
      attestedBy: "z3npub1xyz",
    });

    await Promise.resolve();

    const stored = readStored();
    const p = stored[0].payload as Record<string, unknown>;
    expect(p.zone).toBe("Z4");
    expect(p.actor_type).toBe("human");
    expect(p.contract_id).toBe("c-99");
    expect(typeof p.milestone_id).toBe("string");
    expect((p.milestone_id as string).length).toBeGreaterThan(0);
    expect(p.attested_by).toBe("z3npub1xyz");
    expect(typeof p.attested_at).toBe("string");
    expect((p.attested_at as string).length).toBeGreaterThan(0);
    expect(p.description).toBe("Delivery accepted by council");
  });

  it("attested_by in payload matches the z3npub passed in", async () => {
    const { attestMilestone } = useStore.getState();
    attestMilestone({
      contractId: "c-7",
      description: "Milestone signed off",
      attestedBy: "z3npub1signer",
    });

    await Promise.resolve();

    const stored = readStored();
    const p = stored[0].payload as Record<string, unknown>;
    expect(p.attested_by).toBe("z3npub1signer");
  });

  it("each attestation gets a unique milestone_id", async () => {
    const { attestMilestone } = useStore.getState();
    attestMilestone({
      contractId: "c-10",
      description: "First milestone",
      attestedBy: "z3npub1a",
    });
    attestMilestone({
      contractId: "c-10",
      description: "Second milestone",
      attestedBy: "z3npub1a",
    });

    await Promise.resolve();

    const stored = readStored();
    expect(stored).toHaveLength(2);
    const id1 = (stored[0].payload as Record<string, unknown>).milestone_id;
    const id2 = (stored[1].payload as Record<string, unknown>).milestone_id;
    expect(id1).not.toBe(id2);
  });
});
