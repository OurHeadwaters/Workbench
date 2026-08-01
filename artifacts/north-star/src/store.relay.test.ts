/**
 * store.relay.test.ts
 *
 * Verifies that the store actions emit the correct relay events via
 * publishToRelay. Each test spies on publishToRelay and asserts the
 * kind number and typed payload fields match the spec in relay-event-types.ts.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as relayStub from "./lib/relay-stub";
import { RELAY_EVENT_KINDS } from "./lib/relay-stub";

// Spy on publishToRelay before any module under test imports it.
// vi.mock hoists to the top of the file, so this runs before store.ts loads.
vi.mock("./lib/relay-stub", async (importOriginal) => {
  const original = await importOriginal<typeof relayStub>();
  return {
    ...original,
    publishToRelay: vi.fn().mockResolvedValue(undefined),
  };
});

// Import the store after mocking so its publishToRelay reference is the spy.
// Use a dynamic import to ensure module resolution order is respected.
const { useStore } = await import("./store");

// Import the REAL implementations (bypasses the vi.mock above) for fallback and drain tests.
const {
  publishToRelay: realPublishToRelay,
  drainRelayQueue: realDrainRelayQueue,
  RELAY_STORAGE_KEY,
  RELAY_EVENT_KINDS: ACTUAL_KINDS,
} = await vi.importActual<typeof relayStub>("./lib/relay-stub");

const spy = relayStub.publishToRelay as ReturnType<typeof vi.fn>;

// Stub fetch globally so acceptProposal/rejectProposal's server gate
// resolves immediately with 200 in all relay tests. Individual tests that
// need a different response can override this with vi.stubGlobal.
vi.stubGlobal(
  "fetch",
  vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ ok: true }),
  }),
);

beforeEach(() => {
  spy.mockClear();
  // Reset the store's workbenchPlan and helpingHandsTasks between tests
  // so prior state cannot bleed into later assertions.
  useStore.setState({ workbenchPlan: undefined, helpingHandsTasks: [] });
});

// ---------------------------------------------------------------------------
// setWorkbenchPlan — burst event
// ---------------------------------------------------------------------------

describe("setWorkbenchPlan — burst relay event", () => {
  it("fires WORKBENCH_PLAN_BURST then CHANNEL_OPEN when burst_minutes is a non-null number", () => {
    useStore.getState().setWorkbenchPlan({
      phase: "Phase 1",
      burstMinutes: 45,
      windows: "9–10 am",
      windowNotes: "",
      notes: "",
    });

    // Two events: WORKBENCH_PLAN_BURST (human-initiated) + CHANNEL_OPEN (agent auto-open)
    expect(spy).toHaveBeenCalledTimes(2);

    const burstCall = spy.mock.calls[0][0] as Record<string, unknown>;
    expect(burstCall.kind).toBe(RELAY_EVENT_KINDS.WORKBENCH_PLAN_BURST);

    const burstPayload = burstCall.payload as Record<string, unknown>;
    expect(burstPayload.zone).toBe("Z2");
    expect(burstPayload.actor_type).toBe("human");
    expect(burstPayload.phase).toBe("Phase 1");
    expect(burstPayload.burst_minutes).toBe(45);
    expect(burstPayload.windows).toBe("9–10 am");
    expect(typeof burstPayload.started_at).toBe("string");

    const openCall = spy.mock.calls[1][0] as Record<string, unknown>;
    expect(openCall.kind).toBe(RELAY_EVENT_KINDS.CHANNEL_OPEN);

    const openPayload = openCall.payload as Record<string, unknown>;
    expect(openPayload.zone).toBe("Z2");
    expect(openPayload.actor_type).toBe("agent");
    expect(openPayload.label).toBe("Burst — Phase 1");
    expect(openPayload.category).toBe("workbench");
    expect(typeof openPayload.channel_id).toBe("string");
    expect(typeof openPayload.opened_at).toBe("string");
    expect(typeof openPayload.expires_at).toBe("string");
  });

  it("does NOT fire when burst_minutes is null", () => {
    useStore.getState().setWorkbenchPlan({
      phase: "Phase 1",
      burstMinutes: null,
      windows: "9–10 am",
      windowNotes: "",
      notes: "",
    });

    expect(spy).not.toHaveBeenCalled();
  });

  it("does NOT fire when burst_minutes is undefined", () => {
    useStore.getState().setWorkbenchPlan({
      phase: "Phase 1",
      burstMinutes: undefined,
      windows: "9–10 am",
      windowNotes: "",
      notes: "",
    });

    expect(spy).not.toHaveBeenCalled();
  });

  it("WORKBENCH_PLAN_BURST carries the correct envelope fields (z2npub, signature, timestamp)", () => {
    useStore.getState().setWorkbenchPlan({
      phase: "Phase 2",
      burstMinutes: 30,
      windows: "2–3 pm",
      windowNotes: "",
      notes: "",
    });

    const call = spy.mock.calls[0][0] as Record<string, unknown>;
    expect(call.z2npub).toBe("z2:local");
    expect(call.signature).toBe("stub");
    expect(typeof call.timestamp).toBe("string");
  });
});

// ---------------------------------------------------------------------------
// addChannel — CHANNEL_OPEN
// ---------------------------------------------------------------------------

describe("addChannel — CHANNEL_OPEN relay event", () => {
  beforeEach(() => {
    useStore.setState({ channels: [] });
  });

  it("fires CHANNEL_OPEN with the correct kind", () => {
    useStore.getState().addChannel({
      label: "Morning Burst",
      category: "workbench",
      expiresAt: new Date(Date.now() + 60 * 60_000).toISOString(),
      createdBy: "agent",
    });

    expect(spy).toHaveBeenCalledOnce();
    const call = spy.mock.calls[0][0] as Record<string, unknown>;
    expect(call.kind).toBe(RELAY_EVENT_KINDS.CHANNEL_OPEN);
  });

  it("payload carries zone Z2, actor_type, label, category, channel_id, opened_at", () => {
    const expiresAt = new Date(Date.now() + 60 * 60_000).toISOString();
    useStore.getState().addChannel({
      label: "Community Lab",
      category: "lab",
      expiresAt,
      createdBy: "human",
    });

    const payload = (spy.mock.calls[0][0] as Record<string, unknown>)
      .payload as Record<string, unknown>;

    expect(payload.zone).toBe("Z2");
    expect(payload.actor_type).toBe("human");
    expect(payload.label).toBe("Community Lab");
    expect(payload.category).toBe("lab");
    expect(typeof payload.channel_id).toBe("string");
    expect((payload.channel_id as string).length).toBeGreaterThan(0);
    expect(typeof payload.opened_at).toBe("string");
    expect(payload.expires_at).toBe(expiresAt);
  });

  it("channel_id in payload matches the id stored in channels", () => {
    useStore.getState().addChannel({
      label: "Ops Check",
      category: "workbench",
      createdBy: "agent",
    });

    const payload = (spy.mock.calls[0][0] as Record<string, unknown>)
      .payload as Record<string, unknown>;

    const channels = useStore.getState().channels;
    expect(channels).toHaveLength(1);
    expect(channels[0].id).toBe(payload.channel_id);
  });

  it("omits expires_at from the payload when none is supplied", () => {
    useStore.getState().addChannel({
      label: "Permanent Channel",
      category: "main",
      createdBy: "human",
    });

    const payload = (spy.mock.calls[0][0] as Record<string, unknown>)
      .payload as Record<string, unknown>;

    expect(payload.expires_at).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// expireChannel — CHANNEL_CLOSE
// ---------------------------------------------------------------------------

describe("expireChannel — CHANNEL_CLOSE relay event", () => {
  beforeEach(() => {
    useStore.setState({
      channels: [
        {
          id: "ch-close-test",
          label: "Test Channel",
          category: "workbench",
          createdAt: new Date().toISOString(),
          createdBy: "agent",
        },
      ],
    });
  });

  it("fires CHANNEL_CLOSE with the correct kind", () => {
    useStore.getState().expireChannel("ch-close-test");

    expect(spy).toHaveBeenCalledOnce();
    const call = spy.mock.calls[0][0] as Record<string, unknown>;
    expect(call.kind).toBe(RELAY_EVENT_KINDS.CHANNEL_CLOSE);
  });

  it("payload carries zone Z2, channel_id, closed_at", () => {
    useStore.getState().expireChannel("ch-close-test");

    const payload = (spy.mock.calls[0][0] as Record<string, unknown>)
      .payload as Record<string, unknown>;

    expect(payload.zone).toBe("Z2");
    expect(payload.channel_id).toBe("ch-close-test");
    expect(typeof payload.closed_at).toBe("string");
  });

  it("sets archivedAt on the channel in the store", () => {
    useStore.getState().expireChannel("ch-close-test");

    const channel = useStore.getState().channels.find((c) => c.id === "ch-close-test");
    expect(typeof channel?.archivedAt).toBe("string");
  });
});

// ---------------------------------------------------------------------------
// addHelpingHandsTask — HELPING_HANDS_CREATE
// ---------------------------------------------------------------------------

describe("addHelpingHandsTask — HELPING_HANDS_CREATE relay event", () => {
  it("fires HELPING_HANDS_CREATE with correct kind", () => {
    useStore.getState().addHelpingHandsTask({ title: "Deliver flyers to the hall" });

    expect(spy).toHaveBeenCalledOnce();
    const call = spy.mock.calls[0][0] as Record<string, unknown>;
    expect(call.kind).toBe(RELAY_EVENT_KINDS.HELPING_HANDS_CREATE);
  });

  it("payload carries zone Z3, actor_type human, task_id, title, posted_at", () => {
    useStore.getState().addHelpingHandsTask({ title: "Stack firewood" });

    const payload = (spy.mock.calls[0][0] as Record<string, unknown>)
      .payload as Record<string, unknown>;

    expect(payload.zone).toBe("Z3");
    expect(payload.actor_type).toBe("human");
    expect(typeof payload.task_id).toBe("string");
    expect((payload.task_id as string).length).toBeGreaterThan(0);
    expect(payload.title).toBe("Stack firewood");
    expect(typeof payload.posted_at).toBe("string");
  });

  it("task_id in payload matches the id stored in helpingHandsTasks", () => {
    useStore.getState().addHelpingHandsTask({ title: "Shovel the path" });

    const payload = (spy.mock.calls[0][0] as Record<string, unknown>)
      .payload as Record<string, unknown>;

    const tasks = useStore.getState().helpingHandsTasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe(payload.task_id);
  });
});

// ---------------------------------------------------------------------------
// claimHelpingHandsTask — HELPING_HANDS_CLAIM
// ---------------------------------------------------------------------------

describe("claimHelpingHandsTask — HELPING_HANDS_CLAIM relay event", () => {
  it("fires HELPING_HANDS_CLAIM with correct kind", () => {
    useStore.getState().claimHelpingHandsTask("task-abc");

    expect(spy).toHaveBeenCalledOnce();
    const call = spy.mock.calls[0][0] as Record<string, unknown>;
    expect(call.kind).toBe(RELAY_EVENT_KINDS.HELPING_HANDS_CLAIM);
  });

  it("payload carries zone Z3, actor_type human, task_id, claimed_at", () => {
    useStore.getState().claimHelpingHandsTask("task-xyz");

    const payload = (spy.mock.calls[0][0] as Record<string, unknown>)
      .payload as Record<string, unknown>;

    expect(payload.zone).toBe("Z3");
    expect(payload.actor_type).toBe("human");
    expect(payload.task_id).toBe("task-xyz");
    expect(typeof payload.claimed_at).toBe("string");
  });
});

// ---------------------------------------------------------------------------
// completeHelpingHandsTask — HELPING_HANDS_COMPLETE
// ---------------------------------------------------------------------------

describe("completeHelpingHandsTask — HELPING_HANDS_COMPLETE relay event", () => {
  it("fires HELPING_HANDS_COMPLETE with correct kind", () => {
    useStore.getState().completeHelpingHandsTask("task-abc");

    expect(spy).toHaveBeenCalledOnce();
    const call = spy.mock.calls[0][0] as Record<string, unknown>;
    expect(call.kind).toBe(RELAY_EVENT_KINDS.HELPING_HANDS_COMPLETE);
  });

  it("payload carries zone Z3, actor_type human, task_id, completed_at", () => {
    useStore.getState().completeHelpingHandsTask("task-done");

    const payload = (spy.mock.calls[0][0] as Record<string, unknown>)
      .payload as Record<string, unknown>;

    expect(payload.zone).toBe("Z3");
    expect(payload.actor_type).toBe("human");
    expect(payload.task_id).toBe("task-done");
    expect(typeof payload.completed_at).toBe("string");
  });
});

// ---------------------------------------------------------------------------
// confirmHelpingHandsTask — HELPING_HANDS_CONFIRM
// ---------------------------------------------------------------------------

describe("confirmHelpingHandsTask — HELPING_HANDS_CONFIRM relay event", () => {
  it("fires HELPING_HANDS_CONFIRM with correct kind", () => {
    useStore.getState().confirmHelpingHandsTask("task-abc");

    expect(spy).toHaveBeenCalledOnce();
    const call = spy.mock.calls[0][0] as Record<string, unknown>;
    expect(call.kind).toBe(RELAY_EVENT_KINDS.HELPING_HANDS_CONFIRM);
  });

  it("payload carries zone Z3, actor_type human, task_id, confirmed_at", () => {
    useStore.getState().confirmHelpingHandsTask("task-confirm");

    const payload = (spy.mock.calls[0][0] as Record<string, unknown>)
      .payload as Record<string, unknown>;

    expect(payload.zone).toBe("Z3");
    expect(payload.actor_type).toBe("human");
    expect(payload.task_id).toBe("task-confirm");
    expect(typeof payload.confirmed_at).toBe("string");
  });
});

// ---------------------------------------------------------------------------
// acceptProposal — IMPROVEMENT_PROPOSAL_OUTCOME (accepted)
// ---------------------------------------------------------------------------

describe("acceptProposal — IMPROVEMENT_PROPOSAL_OUTCOME relay event", () => {
  beforeEach(() => {
    // Seed one proposal so the action has something to resolve
    useStore.setState({
      improvementProposals: [
        {
          id: "prop-accept-1",
          agent_role: "river-smith",
          title: "Test proposal",
          description: "A proposal for testing",
          affected_surface: "Dashboard",
          status: "proposed",
          created_at: new Date().toISOString(),
        },
      ],
    });
  });

  it("fires IMPROVEMENT_PROPOSAL_OUTCOME with correct kind", async () => {
    await useStore.getState().acceptProposal("prop-accept-1");

    expect(spy).toHaveBeenCalledOnce();
    const call = spy.mock.calls[0][0] as Record<string, unknown>;
    expect(call.kind).toBe(RELAY_EVENT_KINDS.IMPROVEMENT_PROPOSAL_OUTCOME);
  });

  it("payload carries actor_type 'human', outcome 'accepted', and matching proposal_id", async () => {
    await useStore.getState().acceptProposal("prop-accept-1");

    const payload = (spy.mock.calls[0][0] as Record<string, unknown>)
      .payload as Record<string, unknown>;

    expect(payload.zone).toBe("Z2");
    expect(payload.actor_type).toBe("human");
    expect(payload.outcome).toBe("accepted");
    expect(payload.proposal_id).toBe("prop-accept-1");
    expect(typeof payload.resolved_at).toBe("string");
  });

  it("carries correct envelope fields (z2npub, signature, timestamp)", async () => {
    await useStore.getState().acceptProposal("prop-accept-1");

    const call = spy.mock.calls[0][0] as Record<string, unknown>;
    expect(call.z2npub).toBe("z2:local");
    expect(call.signature).toBe("stub");
    expect(typeof call.timestamp).toBe("string");
  });

  it("updates the proposal status to 'accepted' in the store", async () => {
    await useStore.getState().acceptProposal("prop-accept-1");

    const proposals = useStore.getState().improvementProposals;
    expect(proposals[0].status).toBe("accepted");
    expect(typeof proposals[0].resolved_at).toBe("string");
  });
});

// ---------------------------------------------------------------------------
// rejectProposal — IMPROVEMENT_PROPOSAL_OUTCOME (rejected)
// ---------------------------------------------------------------------------

describe("rejectProposal — IMPROVEMENT_PROPOSAL_OUTCOME relay event", () => {
  beforeEach(() => {
    useStore.setState({
      improvementProposals: [
        {
          id: "prop-reject-1",
          agent_role: "critical-challenger",
          title: "Test rejection proposal",
          description: "A proposal to be rejected",
          affected_surface: "Settings",
          status: "proposed",
          created_at: new Date().toISOString(),
        },
      ],
    });
  });

  it("fires IMPROVEMENT_PROPOSAL_OUTCOME with correct kind", async () => {
    await useStore.getState().rejectProposal("prop-reject-1");

    expect(spy).toHaveBeenCalledOnce();
    const call = spy.mock.calls[0][0] as Record<string, unknown>;
    expect(call.kind).toBe(RELAY_EVENT_KINDS.IMPROVEMENT_PROPOSAL_OUTCOME);
  });

  it("payload carries actor_type 'human', outcome 'rejected', and matching proposal_id", async () => {
    await useStore.getState().rejectProposal("prop-reject-1");

    const payload = (spy.mock.calls[0][0] as Record<string, unknown>)
      .payload as Record<string, unknown>;

    expect(payload.zone).toBe("Z2");
    expect(payload.actor_type).toBe("human");
    expect(payload.outcome).toBe("rejected");
    expect(payload.proposal_id).toBe("prop-reject-1");
    expect(typeof payload.resolved_at).toBe("string");
  });

  it("updates the proposal status to 'rejected' in the store", async () => {
    await useStore.getState().rejectProposal("prop-reject-1");

    const proposals = useStore.getState().improvementProposals;
    expect(proposals[0].status).toBe("rejected");
    expect(typeof proposals[0].resolved_at).toBe("string");
  });
});

// ---------------------------------------------------------------------------
// Full lifecycle — one task passes through all four stages
// ---------------------------------------------------------------------------

describe("HH full lifecycle — four distinct events emitted in order", () => {
  it("emits CREATE → CLAIM → COMPLETE → CONFIRM in sequence with matching task_id", () => {
    useStore.getState().addHelpingHandsTask({ title: "Set up tables" });
    const tasks = useStore.getState().helpingHandsTasks;
    const id = tasks[0].id;

    useStore.getState().claimHelpingHandsTask(id);
    useStore.getState().completeHelpingHandsTask(id);
    useStore.getState().confirmHelpingHandsTask(id);

    expect(spy).toHaveBeenCalledTimes(4);

    const kinds = spy.mock.calls.map(
      (c) => (c[0] as Record<string, unknown>).kind
    );
    expect(kinds).toEqual([
      RELAY_EVENT_KINDS.HELPING_HANDS_CREATE,
      RELAY_EVENT_KINDS.HELPING_HANDS_CLAIM,
      RELAY_EVENT_KINDS.HELPING_HANDS_COMPLETE,
      RELAY_EVENT_KINDS.HELPING_HANDS_CONFIRM,
    ]);

    // Every event carries the same task_id
    for (const call of spy.mock.calls) {
      const payload = (call[0] as Record<string, unknown>)
        .payload as Record<string, unknown>;
      expect(payload.task_id).toBe(id);
    }
  });
});

// ---------------------------------------------------------------------------
// publishToRelay fallback — API unreachable (sendViaApi returns false)
//
// When VITE_RELAY_PUBLISH_URL is not set (the default in the test environment),
// sendViaApi returns false immediately without making a network request.
// publishToRelay must fall back to localStorage so no event is silently lost.
// ---------------------------------------------------------------------------

describe("publishToRelay fallback — stores events in localStorage when API is unreachable", () => {
  // realPublishToRelay, RELAY_STORAGE_KEY, and ACTUAL_KINDS are imported at the
  // top of the file via vi.importActual so the real implementation is used here,
  // not the vi.fn() mock that the store tests above rely on.
  const KINDS = ACTUAL_KINDS;

  beforeEach(() => {
    localStorage.clear();
  });

  it("writes a burst (WORKBENCH_PLAN_BURST) event to localStorage when the API is unreachable", async () => {
    await realPublishToRelay({
      kind: KINDS.WORKBENCH_PLAN_BURST,
      payload: {
        zone: "Z2",
        actor_type: "human",
        phase: "Phase 1",
        burst_minutes: 45,
        windows: "9\u201310 am",
        started_at: new Date().toISOString(),
      },
      z2npub: "z2:local",
      timestamp: new Date().toISOString(),
      signature: "stub",
    });

    const stored = JSON.parse(
      localStorage.getItem(RELAY_STORAGE_KEY) ?? "[]"
    ) as Array<Record<string, unknown>>;

    expect(stored).toHaveLength(1);
    expect(stored[0].kind).toBe(KINDS.WORKBENCH_PLAN_BURST);
    const payload = stored[0].payload as Record<string, unknown>;
    expect(payload.zone).toBe("Z2");
    expect(payload.burst_minutes).toBe(45);
  });

  it("writes a HELPING_HANDS_CREATE event to localStorage when the API is unreachable", async () => {
    const taskId = "hh-fallback-001";

    await realPublishToRelay({
      kind: KINDS.HELPING_HANDS_CREATE,
      payload: {
        zone: "Z3",
        actor_type: "human",
        task_id: taskId,
        title: "Carry water from the well",
        posted_at: new Date().toISOString(),
      },
      z2npub: "z2:local",
      timestamp: new Date().toISOString(),
      signature: "stub",
    });

    const stored = JSON.parse(
      localStorage.getItem(RELAY_STORAGE_KEY) ?? "[]"
    ) as Array<Record<string, unknown>>;

    expect(stored).toHaveLength(1);
    expect(stored[0].kind).toBe(KINDS.HELPING_HANDS_CREATE);
    const payload = stored[0].payload as Record<string, unknown>;
    expect(payload.task_id).toBe(taskId);
    expect(payload.zone).toBe("Z3");
  });

  it("accumulates multiple fallback events in order", async () => {
    const now = new Date().toISOString();

    await realPublishToRelay({
      kind: KINDS.HELPING_HANDS_CREATE,
      payload: {
        zone: "Z3",
        actor_type: "human",
        task_id: "hh-multi-1",
        title: "First task",
        posted_at: now,
      },
      z2npub: "z2:local",
      timestamp: now,
      signature: "stub",
    });

    await realPublishToRelay({
      kind: KINDS.HELPING_HANDS_CLAIM,
      payload: {
        zone: "Z3",
        actor_type: "human",
        task_id: "hh-multi-1",
        claimed_at: now,
      },
      z2npub: "z2:local",
      timestamp: now,
      signature: "stub",
    });

    const stored = JSON.parse(
      localStorage.getItem(RELAY_STORAGE_KEY) ?? "[]"
    ) as Array<Record<string, unknown>>;

    expect(stored).toHaveLength(2);
    expect(stored[0].kind).toBe(KINDS.HELPING_HANDS_CREATE);
    expect(stored[1].kind).toBe(KINDS.HELPING_HANDS_CLAIM);
  });
});

// ---------------------------------------------------------------------------
// publishToRelay — API succeeds, localStorage is NOT written
//
// When sendViaApi returns true (fetch returns 200 OK), storeLocally must NOT
// be called.  We achieve this by:
//   1. Resetting the module registry so relay-stub re-evaluates its top-level
//      RELAY_PUBLISH_URL constant with the stubbed env value.
//   2. Stubbing global fetch to return { ok: true }.
//   3. Planting an owner token so sendViaApi doesn't bail out early.
// ---------------------------------------------------------------------------

describe("publishToRelay — does NOT write to localStorage when API call succeeds", () => {
  beforeEach(() => {
    localStorage.clear();
    // Plant a fake owner token so sendViaApi's token guard passes.
    localStorage.setItem("ownerToken", "test-owner-token");
    // Stub fetch globally so the POST returns 200.
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true } as Response)
    );
    // Ensure the env var is visible to newly-imported modules.
    vi.stubEnv(
      "VITE_RELAY_PUBLISH_URL",
      "http://localhost/api/north-star/relay/publish"
    );
    // Reset the module registry so relay-stub's top-level RELAY_PUBLISH_URL
    // constant is re-evaluated with the stubbed value.
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("does not write a burst event to localStorage when the API responds 200", async () => {
    // Fresh import picks up the stubbed VITE_RELAY_PUBLISH_URL.
    const freshRelay = await import("./lib/relay-stub");

    await freshRelay.publishToRelay({
      kind: freshRelay.RELAY_EVENT_KINDS.WORKBENCH_PLAN_BURST,
      payload: {
        zone: "Z2",
        actor_type: "human",
        phase: "Phase 2",
        burst_minutes: 60,
        windows: "2\u20133 pm",
        started_at: new Date().toISOString(),
      },
      z2npub: "z2:local",
      timestamp: new Date().toISOString(),
      signature: "stub",
    });

    const stored = localStorage.getItem(freshRelay.RELAY_STORAGE_KEY);
    // Nothing should have been written — the API delivered the event.
    expect(stored).toBeNull();
  });

  it("does not write a HELPING_HANDS_CREATE event to localStorage when the API responds 200", async () => {
    const freshRelay = await import("./lib/relay-stub");

    await freshRelay.publishToRelay({
      kind: freshRelay.RELAY_EVENT_KINDS.HELPING_HANDS_CREATE,
      payload: {
        zone: "Z3",
        actor_type: "human",
        task_id: "hh-success-001",
        title: "Stack the community logs",
        posted_at: new Date().toISOString(),
      },
      z2npub: "z2:local",
      timestamp: new Date().toISOString(),
      signature: "stub",
    });

    const stored = localStorage.getItem(freshRelay.RELAY_STORAGE_KEY);
    expect(stored).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// drainRelayQueue — re-sends queued events when connectivity is restored
//
// drainRelayQueue reads VITE_RELAY_PUBLISH_URL at call time (not at module
// init), so vi.stubEnv is sufficient — no module reset required.
// realDrainRelayQueue is the actual implementation imported via importActual
// at the top of this file.
// ---------------------------------------------------------------------------

// The test URL is passed directly as the optional first argument to
// drainRelayQueue, bypassing the VITE_* env var that is inlined at transform
// time and cannot be overridden by vi.stubEnv after module load.
const TEST_PUBLISH_URL = "http://localhost/api/north-star/relay/publish";

describe("drainRelayQueue — empties the queue on API success", () => {
  const NOW = new Date().toISOString();

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("ownerToken", "test-owner-token");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true } as Response),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("removes all queued events when every API call succeeds", async () => {
    const seed = [
      {
        kind: ACTUAL_KINDS.MORNING_MANIFEST,
        payload: { date: "2026-07-31" },
        z2npub: "z2:local",
        timestamp: NOW,
        signature: "stub",
      },
      {
        kind: ACTUAL_KINDS.HELPING_HANDS_CREATE,
        payload: {
          zone: "Z3",
          actor_type: "human",
          task_id: "hh-drain-1",
          title: "Drain test task",
          posted_at: NOW,
        },
        z2npub: "z2:local",
        timestamp: NOW,
        signature: "stub",
      },
    ];
    localStorage.setItem(RELAY_STORAGE_KEY, JSON.stringify(seed));

    await realDrainRelayQueue(TEST_PUBLISH_URL);

    const remaining = JSON.parse(
      localStorage.getItem(RELAY_STORAGE_KEY) ?? "[]",
    ) as unknown[];
    expect(remaining).toHaveLength(0);
  });

  it("calls the API once per queued event", async () => {
    const seed = [
      {
        kind: ACTUAL_KINDS.GATE_CROSSING,
        payload: { crossing: "Z1→Z2", crossed_at: NOW },
        z2npub: "z2:local",
        timestamp: NOW,
        signature: "stub",
      },
      {
        kind: ACTUAL_KINDS.CHANNEL_OPEN,
        payload: {
          zone: "Z2",
          actor_type: "agent",
          channel_id: "ch-drain-test",
          label: "Drain channel",
          category: "workbench",
          opened_at: NOW,
        },
        z2npub: "z2:local",
        timestamp: NOW,
        signature: "stub",
      },
    ];
    localStorage.setItem(RELAY_STORAGE_KEY, JSON.stringify(seed));

    await realDrainRelayQueue(TEST_PUBLISH_URL);

    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
  });
});

describe("drainRelayQueue — leaves queue intact on API failure", () => {
  const NOW = new Date().toISOString();

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("ownerToken", "test-owner-token");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps all queued events when every API call fails (503)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 503 } as Response),
    );

    const seed = [
      {
        kind: ACTUAL_KINDS.MORNING_MANIFEST,
        payload: { date: "2026-07-31" },
        z2npub: "z2:local",
        timestamp: NOW,
        signature: "stub",
      },
      {
        kind: ACTUAL_KINDS.WORKBENCH_PLAN_BURST,
        payload: {
          zone: "Z2",
          actor_type: "human",
          phase: "Phase 1",
          burst_minutes: 30,
          windows: "9–10 am",
          started_at: NOW,
        },
        z2npub: "z2:local",
        timestamp: NOW,
        signature: "stub",
      },
    ];
    localStorage.setItem(RELAY_STORAGE_KEY, JSON.stringify(seed));

    await realDrainRelayQueue(TEST_PUBLISH_URL);

    const remaining = JSON.parse(
      localStorage.getItem(RELAY_STORAGE_KEY) ?? "[]",
    ) as unknown[];
    expect(remaining).toHaveLength(2);
  });

  it("keeps queued events when fetch throws a network error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network offline")),
    );

    const seed = [
      {
        kind: ACTUAL_KINDS.HELPING_HANDS_CLAIM,
        payload: {
          zone: "Z3",
          actor_type: "human",
          task_id: "hh-net-err",
          claimed_at: NOW,
        },
        z2npub: "z2:local",
        timestamp: NOW,
        signature: "stub",
      },
    ];
    localStorage.setItem(RELAY_STORAGE_KEY, JSON.stringify(seed));

    await realDrainRelayQueue(TEST_PUBLISH_URL);

    const remaining = JSON.parse(
      localStorage.getItem(RELAY_STORAGE_KEY) ?? "[]",
    ) as unknown[];
    expect(remaining).toHaveLength(1);
  });
});

describe("drainRelayQueue — no-op when no publish URL is provided", () => {
  const NOW = new Date().toISOString();

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("ownerToken", "test-owner-token");
  });

  it("leaves the queue untouched when called with no URL (undefined)", async () => {
    const seed = [
      {
        kind: ACTUAL_KINDS.MORNING_MANIFEST,
        payload: { date: "2026-07-31" },
        z2npub: "z2:local",
        timestamp: NOW,
        signature: "stub",
      },
    ];
    localStorage.setItem(RELAY_STORAGE_KEY, JSON.stringify(seed));

    // Call with explicit undefined to simulate the no-URL-configured path.
    await realDrainRelayQueue(undefined);

    const remaining = JSON.parse(
      localStorage.getItem(RELAY_STORAGE_KEY) ?? "[]",
    ) as unknown[];
    expect(remaining).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// storeLocally — localStorage.setItem throws QuotaExceededError
//
// If localStorage is full or blocked, setItem throws. storeLocally must catch
// the error, log a console.warn, and NOT re-throw so the caller is unaffected.
// ---------------------------------------------------------------------------

describe("storeLocally — survives QuotaExceededError on localStorage.setItem", () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    localStorage.clear();
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it("does not throw when localStorage.setItem raises QuotaExceededError", async () => {
    // Simulate a full storage by making setItem always throw.
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError", "QuotaExceededError");
    });

    // realPublishToRelay goes straight to storeLocally (no VITE_RELAY_PUBLISH_URL set).
    await expect(
      realPublishToRelay({
        kind: ACTUAL_KINDS.HELPING_HANDS_CREATE,
        payload: {
          zone: "Z3",
          actor_type: "human",
          task_id: "quota-test-1",
          title: "Test task",
          posted_at: new Date().toISOString(),
        },
        z2npub: "z2:local",
        timestamp: new Date().toISOString(),
        signature: "stub",
      })
    ).resolves.toBeUndefined();
  });

  it("logs a console.warn when localStorage.setItem raises QuotaExceededError", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError", "QuotaExceededError");
    });

    await realPublishToRelay({
      kind: ACTUAL_KINDS.CHANNEL_OPEN,
      payload: {
        zone: "Z2",
        actor_type: "agent",
        label: "Quota warning test",
        category: "workbench",
        channel_id: "ch-quota-1",
        opened_at: new Date().toISOString(),
      },
      z2npub: "z2:local",
      timestamp: new Date().toISOString(),
      signature: "stub",
    });

    expect(warnSpy).toHaveBeenCalledOnce();
    const [msg] = warnSpy.mock.calls[0] as [string, ...unknown[]];
    expect(msg).toMatch(/storeLocally/);
    expect(msg).toMatch(/localStorage/);
  });
});
