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
 * The final describe blocks use a deferred fetch to freeze the in-flight state
 * and verify hub content is never mounted before the server guard resolves —
 * guarding against future fast-path changes that widen the loading condition.
 * This covers three branches: cross-kit token, no token at all (status "none"),
 * and an expired token (status "expired" via server 410).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ParrsJarsHubPage } from "@/pages/ParrsJarsHubPage";

// ── Shared helper ──────────────────────────────────────────────────────────────

/** Resolves a deferred promise from outside — lets us freeze fetch in-flight. */
type Deferred<T> = { promise: Promise<T>; resolve: (v: T) => void };
function deferred<T>(): Deferred<T> {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((res) => { resolve = res; });
  return { promise, resolve };
}

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

/**
 * A superficially valid token stored under the correct kit key.
 * The server will respond with 410 (expired) for the expired-path tests.
 */
const EXPIRED_TOKEN = "expiredtoken" + "0".repeat(52); // 64-char token
const EXPIRED_TOKEN_STORED = JSON.stringify({
  token: EXPIRED_TOKEN,
  expiresAt: new Date(Date.now() + 86_400_000 * 30).toISOString(),
  buyerName: "Expired Buyer",
});

/** 410 body returned by fetchKitAccess when the server considers the token expired */
const EXPIRED_SERVER_BODY = {
  error: "token_expired",
  expired_at: "2026-01-01T00:00:00Z",
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

// ── Loading-window guard (cross-kit) ───────────────────────────────────────────

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

// ── No-token guard (status === "none") ────────────────────────────────────────

/**
 * When localStorage holds no token at all the hook skips the fetch entirely and
 * sets status to "none" inside its useEffect.  The initial synchronous render
 * always lands in "loading" (the hook's default state), so hub content must be
 * absent during that window just as it is during an in-flight fetch.
 *
 * These tests confirm that the "none" fast-path (no network round-trip) cannot
 * short-circuit the loading guard and leak hub content.
 */
describe("ParrsJarsHubPage — hub content is never mounted when there is no stored token", () => {
  beforeEach(() => {
    localStorage.clear(); // no token at all
  });

  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("never shows hub content before or after the hook settles to none with no stored token", async () => {
    render(<ParrsJarsHubPage />);

    // With no token the hook skips the network round-trip and resolves to
    // "none" inside its first useEffect pass.  React 18's act() batching in
    // jsdom flushes that effect synchronously, so the loading window may have
    // already closed by the time assertions run.  What matters is that hub
    // content is never mounted — not during loading, not after settlement.
    expect(screen.queryByText("Get Started")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Eat What You Store & Store What You Eat"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Foundation")).not.toBeInTheDocument();
    expect(screen.queryByText("Module 1")).not.toBeInTheDocument();

    // After the effect settles, LockedWall takes over (not hub content).
    await waitFor(() => {
      expect(
        screen.getByText("Your resource hub is one purchase away."),
      ).toBeInTheDocument();
    });

    // Hub module content still absent after settlement.
    expect(screen.queryByText("Get Started")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Eat What You Store & Store What You Eat"),
    ).not.toBeInTheDocument();
  });

  it("never mounts hub content at any point from navigation through settlement with no token", async () => {
    const { container } = render(<ParrsJarsHubPage />);

    // DOM snapshot while still in the loading window (hook not yet settled).
    const loadingSnapshot = container.textContent ?? "";
    expect(loadingSnapshot).not.toContain("Get Started");
    expect(loadingSnapshot).not.toContain("Eat What You Store");
    expect(loadingSnapshot).not.toContain("Foundation");

    // Wait for the hook to settle to "none".
    await waitFor(() => {
      expect(
        screen.getByText("Your resource hub is one purchase away."),
      ).toBeInTheDocument();
    });

    // Hub content still absent after settlement.
    expect(screen.queryByText("Get Started")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Eat What You Store & Store What You Eat"),
    ).not.toBeInTheDocument();
  });
});

// ── Expired-token guard (status === "expired", server 410) ────────────────────

/**
 * When the server returns HTTP 410 for a stored token, fetchKitAccess throws a
 * KitAccessError with status 410 and useKitAccess sets status to "expired".
 * LockedWall renders with reason="expired" (headline: "Your access link has
 * expired.").  Hub content must be absent both during the in-flight window AND
 * after the expired guard resolves.
 *
 * The deferred-promise pattern freezes the fetch mid-flight so we can assert
 * the loading screen is shown before the 410 arrives.
 */
describe("ParrsJarsHubPage — hub content is never mounted when the server returns 410 (expired)", () => {
  beforeEach(() => {
    // Place a superficially valid token; the server will say it is expired.
    localStorage.setItem("headwaters:kit-token:pj-solutions-kit", EXPIRED_TOKEN_STORED);
  });

  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("shows only the loading screen (not hub content) while the 410 fetch is in-flight", async () => {
    const d = deferred<Response>();

    vi.stubGlobal("fetch", vi.fn(() => d.promise));

    render(<ParrsJarsHubPage />);

    // Loading spinner present immediately.
    expect(screen.getByText("Checking access…")).toBeInTheDocument();

    // Hub content absent while fetch is pending.
    expect(screen.queryByText("Get Started")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Eat What You Store & Store What You Eat"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Foundation")).not.toBeInTheDocument();
    expect(screen.queryByText("Module 1")).not.toBeInTheDocument();

    // Neither the generic LockedWall CTA nor the expired headline is visible yet.
    expect(
      screen.queryByText("Your resource hub is one purchase away."),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Your access link has expired."),
    ).not.toBeInTheDocument();

    // Resolve the deferred fetch with a 410 — fetchKitAccess throws KitAccessError(410).
    d.resolve(
      new Response(JSON.stringify(EXPIRED_SERVER_BODY), {
        status: 410,
        headers: { "Content-Type": "application/json" },
      }),
    );

    // After resolution the "expired" branch renders LockedWall with reason="expired".
    await waitFor(() => {
      expect(
        screen.getByText("Your access link has expired."),
      ).toBeInTheDocument();
    });

    // Hub content still absent after expiry resolution.
    expect(screen.queryByText("Get Started")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Eat What You Store & Store What You Eat"),
    ).not.toBeInTheDocument();
  });

  it("never mounts hub content at any point from navigation through 410 guard resolution", async () => {
    const d = deferred<Response>();

    vi.stubGlobal("fetch", vi.fn(() => d.promise));

    const { container } = render(<ParrsJarsHubPage />);

    // DOM snapshot while the 410 fetch is still in-flight.
    const loadingSnapshot = container.textContent ?? "";
    expect(loadingSnapshot).not.toContain("Get Started");
    expect(loadingSnapshot).not.toContain("Eat What You Store");
    expect(loadingSnapshot).not.toContain("Foundation");

    // Resolve with 410.
    d.resolve(
      new Response(JSON.stringify(EXPIRED_SERVER_BODY), {
        status: 410,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Your access link has expired."),
      ).toBeInTheDocument();
    });

    // Hub content still absent after the guard has resolved to "expired".
    expect(screen.queryByText("Get Started")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Eat What You Store & Store What You Eat"),
    ).not.toBeInTheDocument();
  });
});
