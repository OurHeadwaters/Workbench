/**
 * ParrsJarsHubPage.crosskit.test.tsx
 *
 * Integration test — cross-kit privilege escalation is blocked at the page level.
 *
 * Scenario:
 *   A buyer manually injects a valid token for `economy-kit` into localStorage
 *   under the `pj-solutions-kit` key, then navigates to /parrsjars/hub.
 *   The server legitimately returns kit.id = "economy-kit" for that token,
 *   so the cross-kit guard in useKitAccess (line 50) must catch the mismatch
 *   and ParrsJarsHubPage must render <LockedWall /> — not the hub content.
 *
 * This test exercises the full page component (not just the hook), confirming:
 *   - The LockedWall headline is visible
 *   - Hub module content (handout cards) is absent
 *
 * Unlike the hook-level unit tests in useKitAccess.test.ts, this test uses
 * real localStorage and a global fetch stub, rendering the actual page tree.
 *
 * The final describe block ("loading window") uses a deferred fetch to freeze
 * the in-flight state and verify hub content is never mounted before the server
 * guard resolves — guarding against future fast-path changes that widen the
 * loading condition.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ParrsJarsHubPage } from "@/pages/ParrsJarsHubPage";

// ── Test data ─────────────────────────────────────────────────────────────────

const ECONOMY_KIT_TOKEN = "economytoken" + "0".repeat(52); // 64-char token

/** localStorage value keyed under pj-solutions-kit, but token belongs to economy-kit */
const CROSS_KIT_STORED = JSON.stringify({
  token: ECONOMY_KIT_TOKEN,
  expiresAt: new Date(Date.now() + 86_400_000 * 30).toISOString(),
  buyerName: "Cross Kit Test Buyer",
});

/** Server response: token is valid but kit.id is the wrong kit */
const CROSS_KIT_SERVER_RESPONSE = {
  ok: true,
  kit: {
    id: "economy-kit",
    name: "Economy Kit",
    tagline: "Different kit",
    arcNote: null,
    contentNote: "",
  },
  buyer_name: "Cross Kit Test Buyer",
  purchase_id: "purchase-cross-001",
  expires_at: new Date(Date.now() + 86_400_000 * 30).toISOString(),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("ParrsJarsHubPage — cross-kit token swap is blocked", () => {
  beforeEach(() => {
    // Place a token for economy-kit in localStorage under the pj-solutions-kit key.
    // This simulates a buyer who has manually injected a foreign token.
    localStorage.setItem("headwaters:kit-token:pj-solutions-kit", CROSS_KIT_STORED);

    // The server truthfully reports kit.id = "economy-kit" for this token.
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify(CROSS_KIT_SERVER_RESPONSE), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      ),
    );
  });

  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("shows the LockedWall headline when a cross-kit token is detected", async () => {
    render(<ParrsJarsHubPage />);

    // The hook starts in "loading", then resolves to "invalid" after the fetch.
    await waitFor(() => {
      expect(
        screen.getByText("Your resource hub is one purchase away."),
      ).toBeInTheDocument();
    });
  });

  it("does not render any hub module content with a cross-kit token", async () => {
    render(<ParrsJarsHubPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Your resource hub is one purchase away."),
      ).toBeInTheDocument();
    });

    // "Get Started" is a handout card title in the Foundation module — it only
    // appears in the unlocked hub grid, not on the LockedWall or any other page.
    expect(screen.queryByText("Get Started")).not.toBeInTheDocument();

    // "Eat What You Store & Store What You Eat" is another Foundation handout.
    expect(
      screen.queryByText("Eat What You Store & Store What You Eat"),
    ).not.toBeInTheDocument();
  });

  it("does not show the module navigation when a cross-kit token is detected", async () => {
    render(<ParrsJarsHubPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Your resource hub is one purchase away."),
      ).toBeInTheDocument();
    });

    // Module nav labels — only visible in the unlocked hub sidebar.
    expect(screen.queryByText("Foundation")).not.toBeInTheDocument();
    expect(screen.queryByText("Module 1")).not.toBeInTheDocument();
  });

  it("calls the server to validate the token that was found in localStorage", async () => {
    render(<ParrsJarsHubPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Your resource hub is one purchase away."),
      ).toBeInTheDocument();
    });

    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      expect.stringContaining(ECONOMY_KIT_TOKEN),
    );
  });

  it("clears the cross-kit token from localStorage after rejection", async () => {
    render(<ParrsJarsHubPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Your resource hub is one purchase away."),
      ).toBeInTheDocument();
    });

    expect(
      localStorage.getItem("headwaters:kit-token:pj-solutions-kit"),
    ).toBeNull();
  });
});

// ── Loading-window guard ───────────────────────────────────────────────────────

/**
 * These tests hold the server fetch in-flight via a deferred promise so we can
 * inspect the render tree while status === "loading".  Hub content must never
 * be mounted in that window — not the module nav, not any handout card, not the
 * LockedWall CTA (which only appears after the guard resolves to "invalid").
 *
 * If a future fast-path (e.g. a local-cache optimistic render) is added, these
 * tests will catch any accidental exposure of gated content before the server
 * confirms the token.
 */
describe("ParrsJarsHubPage — hub content is never mounted during the loading window", () => {
  /** Resolves a deferred promise from outside — lets us freeze fetch in-flight. */
  type Deferred<T> = { promise: Promise<T>; resolve: (v: T) => void };
  function deferred<T>(): Deferred<T> {
    let resolve!: (v: T) => void;
    const promise = new Promise<T>((res) => { resolve = res; });
    return { promise, resolve };
  }

  beforeEach(() => {
    // Place the cross-kit token in localStorage so the hook starts a fetch.
    localStorage.setItem("headwaters:kit-token:pj-solutions-kit", CROSS_KIT_STORED);
  });

  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("shows only the loading screen (not hub content) while the fetch is in-flight", async () => {
    const d = deferred<Response>();

    vi.stubGlobal(
      "fetch",
      vi.fn(() => d.promise),
    );

    render(<ParrsJarsHubPage />);

    // The loading spinner should be present immediately.
    expect(screen.getByText("Checking access…")).toBeInTheDocument();

    // Hub module content must NOT be present while the fetch is pending.
    expect(screen.queryByText("Get Started")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Eat What You Store & Store What You Eat"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Foundation")).not.toBeInTheDocument();
    expect(screen.queryByText("Module 1")).not.toBeInTheDocument();

    // The LockedWall CTA is also absent — it only appears after guard resolution.
    expect(
      screen.queryByText("Your resource hub is one purchase away."),
    ).not.toBeInTheDocument();

    // Resolve the deferred fetch so the component can settle.
    d.resolve(
      new Response(JSON.stringify(CROSS_KIT_SERVER_RESPONSE), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    // After resolution the guard fires and LockedWall takes over.
    await waitFor(() => {
      expect(
        screen.getByText("Your resource hub is one purchase away."),
      ).toBeInTheDocument();
    });
  });

  it("never mounts hub content at any point from navigation through guard resolution", async () => {
    const d = deferred<Response>();

    vi.stubGlobal(
      "fetch",
      vi.fn(() => d.promise),
    );

    const { container } = render(<ParrsJarsHubPage />);

    // Capture the DOM while the fetch is still pending and assert hub content absent.
    const loadingSnapshot = container.textContent ?? "";
    expect(loadingSnapshot).not.toContain("Get Started");
    expect(loadingSnapshot).not.toContain("Eat What You Store");
    expect(loadingSnapshot).not.toContain("Foundation");

    // Now resolve with a cross-kit response.
    d.resolve(
      new Response(JSON.stringify(CROSS_KIT_SERVER_RESPONSE), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Your resource hub is one purchase away."),
      ).toBeInTheDocument();
    });

    // Hub content still absent after the guard has resolved to "invalid".
    expect(screen.queryByText("Get Started")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Eat What You Store & Store What You Eat"),
    ).not.toBeInTheDocument();
  });
});
