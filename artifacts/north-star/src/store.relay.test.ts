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

// Import the REAL publishToRelay (bypasses the vi.mock above) for fallback tests.
const {
  publishToRelay: realPublishToRelay,
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
  it("fires WORKBENCH_PLAN_BURST when burst_minutes is a non-null number", () => {
    useStore.getState().setWorkbenchPlan({
      phase: "Phase 1",
      burstMinutes: 45,
      windows: "9–10 am",
      windowNotes: "",
      notes: "",
    });

    expect(spy).toHaveBeenCalledOnce();

    const call = spy.mock.calls[0][0] as Record<string, unknown>;
    expect(call.kind).toBe(RELAY_EVENT_KINDS.WORKBENCH_PLAN_BURST);

    const payload = call.payload as Record<string, unknown>;
    expect(payload.zone).toBe("Z2");
    expect(payload.actor_type).toBe("human");
    expect(payload.phase).toBe("Phase 1");
    expect(payload.burst_minutes).toBe(45);
    expect(payload.windows).toBe("9–10 am");
    expect(typeof payload.started_at).toBe("string");
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

  it("carries the correct envelope fields (z2npub, signature, timestamp)", () => {
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
