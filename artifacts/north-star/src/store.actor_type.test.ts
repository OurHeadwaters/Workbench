import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * Unit tests for DailyPick.actor_type defaulting and propagation in the
 * zustand store (getTodayPick / setTodayPick).
 *
 * Each test resets the module registry and clears localStorage so the
 * zustand persist store always starts from a clean default state.
 */

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
});

describe("getTodayPick — actor_type default", () => {
  it("returns actor_type 'human' when no pick exists yet for today", async () => {
    const { useStore } = await import("@/store");
    const pick = useStore.getState().getTodayPick();
    expect(pick.actor_type).toBe("human");
  });
});

describe("setTodayPick — actor_type propagation", () => {
  it("stamps actor_type 'human' on a newly created pick when not explicitly set", async () => {
    const { useStore } = await import("@/store");
    useStore.getState().setTodayPick({ constellationIds: ["c1"] });
    const key = Object.keys(useStore.getState().dailyPicks)[0];
    expect(useStore.getState().dailyPicks[key].actor_type).toBe("human");
  });

  it("stores actor_type 'agent' when explicitly set by an agent caller", async () => {
    const { useStore } = await import("@/store");
    useStore.getState().setTodayPick({ actor_type: "agent", constellationIds: ["c2"] });
    const key = Object.keys(useStore.getState().dailyPicks)[0];
    expect(useStore.getState().dailyPicks[key].actor_type).toBe("agent");
  });

  it("does not reset an agent pick back to human on a subsequent patch that omits actor_type", async () => {
    const { useStore } = await import("@/store");
    useStore.getState().setTodayPick({ actor_type: "agent" });
    useStore.getState().setTodayPick({ reflection: "updated" });
    const key = Object.keys(useStore.getState().dailyPicks)[0];
    expect(useStore.getState().dailyPicks[key].actor_type).toBe("agent");
  });

  it("allows overriding an agent pick back to human when the caller explicitly passes actor_type: 'human'", async () => {
    const { useStore } = await import("@/store");
    useStore.getState().setTodayPick({ actor_type: "agent" });
    useStore.getState().setTodayPick({ actor_type: "human" });
    const key = Object.keys(useStore.getState().dailyPicks)[0];
    expect(useStore.getState().dailyPicks[key].actor_type).toBe("human");
  });
});
