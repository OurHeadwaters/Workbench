import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ZoneGate } from "./ZoneGate";
import { RELAY_EVENT_KINDS } from "@/lib/relay-stub";

// ── Mock relay-stub ──────────────────────────────────────────────────────────
// vi.mock is hoisted to the top of the file by Vitest, so the factory runs
// before any const/let declarations. We use vi.hoisted() to define the spy
// in the hoisted scope so the factory can safely reference it.

const { mockPublishToRelay } = vi.hoisted(() => ({
  mockPublishToRelay: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/relay-stub", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/relay-stub")>();
  return {
    ...original,
    publishToRelay: mockPublishToRelay,
  };
});

// ── Helpers ──────────────────────────────────────────────────────────────────
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function getLastCall() {
  const calls = mockPublishToRelay.mock.calls;
  expect(calls.length).toBeGreaterThan(0);
  return calls[calls.length - 1][0] as Record<string, unknown>;
}

beforeEach(() => {
  mockPublishToRelay.mockClear();
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe("ZoneGate — Z1→Z2 crossing", () => {
  it("calls publishToRelay exactly once on mount", () => {
    render(<ZoneGate crossing="Z1→Z2" />);
    expect(mockPublishToRelay).toHaveBeenCalledTimes(1);
  });

  it("emits kind 1002 (GATE_CROSSING)", () => {
    render(<ZoneGate crossing="Z1→Z2" />);
    const call = getLastCall();
    expect(call.kind).toBe(RELAY_EVENT_KINDS.GATE_CROSSING);
    expect(call.kind).toBe(1002);
  });

  it("carries crossing_direction Z1_to_Z2", () => {
    render(<ZoneGate crossing="Z1→Z2" />);
    const { payload } = getLastCall() as { payload: Record<string, unknown> };
    expect(payload.crossing_direction).toBe("Z1_to_Z2");
  });

  it("carries a valid ISO crossed_at timestamp", () => {
    render(<ZoneGate crossing="Z1→Z2" />);
    const { payload } = getLastCall() as { payload: Record<string, unknown> };
    expect(typeof payload.crossed_at).toBe("string");
    expect(ISO_RE.test(payload.crossed_at as string)).toBe(true);
  });

  it("payload has no Z1 fields — name absent", () => {
    render(<ZoneGate crossing="Z1→Z2" />);
    const { payload } = getLastCall() as { payload: Record<string, unknown> };
    expect("name" in payload).toBe(false);
  });

  it("payload has no Z1 fields — passphrase absent", () => {
    render(<ZoneGate crossing="Z1→Z2" />);
    const { payload } = getLastCall() as { payload: Record<string, unknown> };
    expect("passphrase" in payload).toBe(false);
  });

  it("payload has no Z1 fields — statement absent", () => {
    render(<ZoneGate crossing="Z1→Z2" />);
    const { payload } = getLastCall() as { payload: Record<string, unknown> };
    expect("statement" in payload).toBe(false);
  });

  it("envelope carries z2npub, timestamp, and signature fields", () => {
    render(<ZoneGate crossing="Z1→Z2" />);
    const call = getLastCall();
    expect(typeof call.z2npub).toBe("string");
    expect(ISO_RE.test(call.timestamp as string)).toBe(true);
    expect(call.signature).toBe("stub");
  });
});

describe("ZoneGate — Z2→Z3 crossing", () => {
  it("calls publishToRelay exactly once on mount", () => {
    render(<ZoneGate crossing="Z2→Z3" />);
    expect(mockPublishToRelay).toHaveBeenCalledTimes(1);
  });

  it("emits kind 1002 (GATE_CROSSING)", () => {
    render(<ZoneGate crossing="Z2→Z3" />);
    const call = getLastCall();
    expect(call.kind).toBe(RELAY_EVENT_KINDS.GATE_CROSSING);
    expect(call.kind).toBe(1002);
  });

  it("carries crossing_direction Z2_to_Z3", () => {
    render(<ZoneGate crossing="Z2→Z3" />);
    const { payload } = getLastCall() as { payload: Record<string, unknown> };
    expect(payload.crossing_direction).toBe("Z2_to_Z3");
  });

  it("carries a valid ISO crossed_at timestamp", () => {
    render(<ZoneGate crossing="Z2→Z3" />);
    const { payload } = getLastCall() as { payload: Record<string, unknown> };
    expect(typeof payload.crossed_at).toBe("string");
    expect(ISO_RE.test(payload.crossed_at as string)).toBe(true);
  });

  it("payload has no Z1 fields — name absent", () => {
    render(<ZoneGate crossing="Z2→Z3" />);
    const { payload } = getLastCall() as { payload: Record<string, unknown> };
    expect("name" in payload).toBe(false);
  });

  it("payload has no Z1 fields — passphrase absent", () => {
    render(<ZoneGate crossing="Z2→Z3" />);
    const { payload } = getLastCall() as { payload: Record<string, unknown> };
    expect("passphrase" in payload).toBe(false);
  });

  it("payload has no Z1 fields — statement absent", () => {
    render(<ZoneGate crossing="Z2→Z3" />);
    const { payload } = getLastCall() as { payload: Record<string, unknown> };
    expect("statement" in payload).toBe(false);
  });

  it("envelope carries z2npub, timestamp, and signature fields", () => {
    render(<ZoneGate crossing="Z2→Z3" />);
    const call = getLastCall();
    expect(typeof call.z2npub).toBe("string");
    expect(ISO_RE.test(call.timestamp as string)).toBe(true);
    expect(call.signature).toBe("stub");
  });
});

describe("ZoneGate — crossing direction is distinct per prop", () => {
  it("Z1→Z2 and Z2→Z3 emit different crossing_direction values", () => {
    render(<ZoneGate crossing="Z1→Z2" />);
    const first = (mockPublishToRelay.mock.calls[0][0] as { payload: Record<string, unknown> }).payload;

    mockPublishToRelay.mockClear();

    render(<ZoneGate crossing="Z2→Z3" />);
    const second = (mockPublishToRelay.mock.calls[0][0] as { payload: Record<string, unknown> }).payload;

    expect(first.crossing_direction).toBe("Z1_to_Z2");
    expect(second.crossing_direction).toBe("Z2_to_Z3");
    expect(first.crossing_direction).not.toBe(second.crossing_direction);
  });
});
