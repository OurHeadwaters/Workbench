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

const spy = relayStub.publishToRelay as ReturnType<typeof vi.fn>;

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
