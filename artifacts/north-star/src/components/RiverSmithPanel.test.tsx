/**
 * RiverSmithPanel.test.tsx
 *
 * Guards the proof card's durability:
 *   1. A successful generate always renders the proof card.
 *   2. A relay publish failure does NOT suppress the proof card — it was set
 *      before the fire-and-forget relay call, so a throw there must not matter.
 *   3. When safety_flags_count differs from the previous briefing, the card's
 *      changed_fields array contains "safety_flags_count".
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// ── Relay stub mock ───────────────────────────────────────────────────────────
// We mock the whole module so we can control whether publishToRelay resolves
// or rejects in each test without touching the real localStorage relay.

vi.mock("@/lib/relay-stub", () => ({
  publishToRelay: vi.fn().mockResolvedValue(undefined),
  getZ2Npub: () => "z2:local",
  RELAY_EVENT_KINDS: {
    MORNING_MANIFEST: 1000,
    BRIEFING_ENVELOPE: 1001,
    GATE_CROSSING: 1002,
    WORKBENCH_PLAN_BURST: 1003,
    HELPING_HANDS_CREATE: 1004,
    HELPING_HANDS_CLAIM: 1005,
    HELPING_HANDS_COMPLETE: 1006,
    HELPING_HANDS_CONFIRM: 1007,
    CONTRACT_MILESTONE: 1008,
  },
}));

import { RiverSmithPanel } from "./RiverSmithPanel";
import { publishToRelay } from "@/lib/relay-stub";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

/** Stub global fetch so callers can supply a handler keyed by URL pattern. */
function stubFetch(handler: (url: string, init?: RequestInit) => Response) {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string, init?: RequestInit) =>
      Promise.resolve(handler(url, init)),
    ),
  );
}

/** Minimal generate response body. */
function generateBody(
  overrides: Partial<{ id: string; rawMarkdown: string; safetyFlagsCount: number }> = {},
) {
  return {
    id: overrides.id ?? "br-test-001",
    rawMarkdown:
      overrides.rawMarkdown ??
      "## Morning update\n\nAll clear on the river today.",
    safetyFlagsCount: overrides.safetyFlagsCount ?? 0,
  };
}

// ── Setup / teardown ──────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  // Default: relay publish succeeds silently
  vi.mocked(publishToRelay).mockResolvedValue(undefined);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ── Test suite ────────────────────────────────────────────────────────────────

describe("RiverSmithPanel — proof card durability", () => {
  it("renders the proof card after a successful generate", async () => {
    localStorage.setItem("ownerToken", "test-owner-token");

    stubFetch((url) => {
      // Initial fetchLatest — no briefing yet
      if (url.includes("/briefing/latest")) {
        return makeResponse(404, { error: "not found" });
      }
      // Generate call
      if (url.includes("/generate")) {
        return makeResponse(200, generateBody());
      }
      return makeResponse(404, {});
    });

    render(<RiverSmithPanel embedded />);

    // Wait for the initial fetch to settle (the controls-row button is always present)
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Generate now/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Generate now/i }));

    await waitFor(() => {
      expect(screen.getByText("What was sent")).toBeInTheDocument();
    });
  });

  it("proof card remains visible even when publishToRelay throws", async () => {
    localStorage.setItem("ownerToken", "test-owner-token");

    // Make relay publish reject after a short delay
    vi.mocked(publishToRelay).mockRejectedValue(
      new Error("relay: connection refused"),
    );

    stubFetch((url) => {
      if (url.includes("/briefing/latest")) {
        return makeResponse(404, { error: "not found" });
      }
      if (url.includes("/generate")) {
        return makeResponse(200, generateBody());
      }
      return makeResponse(404, {});
    });

    render(<RiverSmithPanel embedded />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Generate now/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Generate now/i }));

    // The proof card must appear regardless of the relay failure
    await waitFor(() => {
      expect(screen.getByText("What was sent")).toBeInTheDocument();
    });

    // No error message from the relay failure should surface to the operator
    expect(screen.queryByText(/relay/i)).not.toBeInTheDocument();
  });

  it("double-clicking Generate while the request is in-flight sends only one POST and shows exactly one proof card", async () => {
    localStorage.setItem("ownerToken", "test-owner-token");

    // Track how many POST calls reach /generate
    let generatePostCount = 0;

    // The generate response is intentionally delayed so the second click
    // arrives while the first fetch is still pending.
    let resolveGenerate!: () => void;
    const generatePending = new Promise<void>((res) => {
      resolveGenerate = res;
    });

    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) => {
        if ((url as string).includes("/briefing/latest")) {
          return makeResponse(404, { error: "not found" });
        }
        if ((url as string).includes("/generate")) {
          if (init?.method === "POST") generatePostCount++;
          // Block until the test releases the response
          await generatePending;
          return makeResponse(200, generateBody());
        }
        return makeResponse(404, {});
      }),
    );

    render(<RiverSmithPanel embedded />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Generate now/i })).toBeInTheDocument();
    });

    const generateBtn = screen.getByRole("button", { name: /Generate now/i });

    // First click — request is now in-flight
    fireEvent.click(generateBtn);

    // Second click — the `generating` guard must swallow this
    fireEvent.click(generateBtn);

    // Only one POST should have been dispatched
    expect(generatePostCount).toBe(1);

    // Release the slow server response
    resolveGenerate();

    // Exactly one proof card should appear
    await waitFor(() => {
      expect(screen.getAllByText("What was sent")).toHaveLength(1);
    });

    // Still only one POST after the response resolved
    expect(generatePostCount).toBe(1);
  });

  it("proof card changed_fields includes safety_flags_count when count differs from previous briefing", async () => {
    localStorage.setItem("ownerToken", "test-owner-token");

    // First generate: flags = 0 (establishes the "previous" briefing in state)
    // Second generate: flags = 3 → diff should surface safety_flags_count
    let generateCallCount = 0;

    stubFetch((url) => {
      if (url.includes("/briefing/latest")) {
        return makeResponse(404, { error: "not found" });
      }
      if (url.includes("/generate")) {
        generateCallCount++;
        if (generateCallCount === 1) {
          return makeResponse(
            200,
            generateBody({ id: "br-prev", safetyFlagsCount: 0 }),
          );
        }
        // Second call: more flags than the first
        return makeResponse(
          200,
          generateBody({ id: "br-next", safetyFlagsCount: 3 }),
        );
      }
      return makeResponse(404, {});
    });

    render(<RiverSmithPanel embedded />);

    // First generate — establishes prev briefing in component state
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Generate now/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /Generate now/i }));
    await waitFor(() => {
      expect(screen.getByText("What was sent")).toBeInTheDocument();
    });

    // Second generate — should detect the flag count change
    fireEvent.click(screen.getByRole("button", { name: /Generate now/i }));
    await waitFor(() => {
      // The badge should show at least 1 change (safety_flags_count)
      expect(screen.getByText(/change/i)).toBeInTheDocument();
    });

    // Expand the proof card to see changed_fields chips
    fireEvent.click(screen.getByText("What was sent"));

    await waitFor(() => {
      expect(screen.getByText("safety_flags_count")).toBeInTheDocument();
    });
  });
});
