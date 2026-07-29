/**
 * ScheduleWatcher.debounce.test.tsx
 *
 * Asserts that the 50-minute debounce holds when a browser tab reopens
 * mid-minute after a trigger already fired. When the interval restarts on
 * remount, `check()` runs immediately; it must read the persisted `last_fired`
 * from the Zustand store and skip re-firing.
 *
 * Three cases are covered:
 *  1. Fire on first mount → unmount → remount (tab reopen) → no second fire.
 *  2. `last_fired` already recent on first mount → no fire at all.
 *  3. `last_fired` older than 50 min → debounce expired → fire is allowed.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";

// ── Relay stub mock ───────────────────────────────────────────────────────────
// Must be declared before any module that imports relay-stub (store.ts) loads.
// vi.mock is hoisted to the top of the file by Vitest's transform.
vi.mock("../lib/relay-stub", async (importOriginal) => {
  const original = await importOriginal<typeof import("../lib/relay-stub")>();
  return {
    ...original,
    publishToRelay: vi.fn().mockResolvedValue(undefined),
  };
});

import * as relayStub from "../lib/relay-stub";
const publishSpy = relayStub.publishToRelay as ReturnType<typeof vi.fn>;

// Import the store *after* the mock so fireTrigger's publishToRelay call
// hits the spy, not the real network function.
const { useStore } = await import("../store");

import { ScheduleWatcher } from "./ScheduleWatcher";

// ── Constants ─────────────────────────────────────────────────────────────────

const SCHEDULE = "06:00"; // trigger's scheduled HH:MM
// A fake "now" that is exactly at the scheduled time (diff = 0, within ±5 min).
const FAKE_NOW = new Date("2026-07-29T06:00:00");

/** Flush microtasks so fireTrigger's async body (await publishToRelay → set) completes. */
async function flushMicrotasks() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

// ── Seed helper ───────────────────────────────────────────────────────────────

function seedTrigger(last_fired?: string) {
  useStore.setState({
    triggers: [
      {
        id: "test-schedule-trigger",
        name: "Test Scheduled Trigger",
        kind: 1000, // MORNING_MANIFEST
        schedule: SCHEDULE,
        enabled: true,
        ...(last_fired !== undefined ? { last_fired } : {}),
      },
    ],
  });
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe("ScheduleWatcher — debounce survives tab reopen within the same window", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FAKE_NOW);
    publishSpy.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Case 1: core scenario ─────────────────────────────────────────────────

  it("fires exactly once even when the tab reopens mid-minute after last_fired was persisted", async () => {
    // Trigger has never fired — last_fired is absent.
    seedTrigger();

    // ── First mount: tab opens ────────────────────────────────────────────────
    // check() runs immediately → debounce passes → fireTrigger called →
    // publishToRelay resolves → store sets last_fired.
    const { unmount } = render(<ScheduleWatcher />);
    await flushMicrotasks();

    expect(publishSpy).toHaveBeenCalledTimes(1);

    // ── Simulate tab reopen: unmount then remount ─────────────────────────────
    // Time has NOT advanced — still 06:00, still within the ±5 min window.
    // last_fired IS now persisted in Zustand from the first fire.
    // When the component remounts, the interval resets and check() runs
    // immediately. It must read last_fired and skip.
    unmount();
    render(<ScheduleWatcher />);
    await flushMicrotasks();

    // Debounce must have blocked the re-fire: still exactly 1 relay call.
    expect(publishSpy).toHaveBeenCalledTimes(1);
  });

  // ── Case 2: already debounced on initial mount ────────────────────────────

  it("does not fire at all when last_fired is already recent on first mount", async () => {
    // Simulate a device whose store already has last_fired 2 minutes ago
    // (e.g. a different tab in the same window had already fired it).
    const twoMinutesAgo = new Date(FAKE_NOW.getTime() - 2 * 60 * 1000).toISOString();
    seedTrigger(twoMinutesAgo);

    render(<ScheduleWatcher />);
    await flushMicrotasks();

    // 2 min < 50 min debounce → must not fire.
    expect(publishSpy).not.toHaveBeenCalled();
  });

  it("does not fire when last_fired is 49 minutes ago (still inside the 50-min window)", async () => {
    const fortyNineMinutesAgo = new Date(FAKE_NOW.getTime() - 49 * 60 * 1000).toISOString();
    seedTrigger(fortyNineMinutesAgo);

    render(<ScheduleWatcher />);
    await flushMicrotasks();

    // 49 min < 50 min → still within debounce window → must not fire.
    expect(publishSpy).not.toHaveBeenCalled();
  });

  // ── Case 3: debounce window expired ──────────────────────────────────────

  it("fires again once the 50-minute debounce window has expired", async () => {
    // last_fired is 51 minutes ago — outside the debounce window.
    const fiftyOneMinutesAgo = new Date(FAKE_NOW.getTime() - 51 * 60 * 1000).toISOString();
    seedTrigger(fiftyOneMinutesAgo);

    render(<ScheduleWatcher />);
    await flushMicrotasks();

    // 51 min > 50 min → debounce has expired → trigger should fire.
    expect(publishSpy).toHaveBeenCalledTimes(1);
  });

  // ── Boundary: disabled trigger is never fired ─────────────────────────────

  it("never fires a disabled trigger regardless of schedule or last_fired", async () => {
    useStore.setState({
      triggers: [
        {
          id: "test-disabled-trigger",
          name: "Disabled Trigger",
          kind: 1000,
          schedule: SCHEDULE,
          enabled: false, // disabled
        },
      ],
    });

    render(<ScheduleWatcher />);
    await flushMicrotasks();

    expect(publishSpy).not.toHaveBeenCalled();
  });

  // ── Boundary: trigger outside the ±5 min window is not fired ────────────

  it("does not fire when the current time is outside the ±5 min window", async () => {
    // Advance fake time to 10 minutes after the schedule (diff = 10 min > 5 min).
    vi.setSystemTime(new Date("2026-07-29T06:10:00"));
    seedTrigger();

    render(<ScheduleWatcher />);
    await flushMicrotasks();

    expect(publishSpy).not.toHaveBeenCalled();
  });
});
