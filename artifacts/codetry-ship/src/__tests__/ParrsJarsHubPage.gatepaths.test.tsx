/**
 * ParrsJarsHubPage.gatepaths.test.tsx
 *
 * E2E-style unit tests for the two remaining gate paths on /parrsjars/hub:
 *
 *   1. No-token redirect — when localStorage holds no token for pj-solutions-kit,
 *      RequireKitToken synchronously redirects to /parrsjars/kit?reason=access-required
 *      and the kit purchase page is shown to the visitor.
 *
 *   2. Invalid token (server 404) — when localStorage holds a fabricated token
 *      that the server does not recognise, the server returns HTTP 404,
 *      useKitAccess sets status "invalid", and ParrsJarsHubPage renders
 *      LockedWall ("Your resource hub is one purchase away.") instead of hub
 *      content.
 *
 * These tests complement the existing cross-kit and expired-token coverage in
 * ParrsJarsHubPage.crosskit.test.tsx.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Router, Route } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { RequireKitToken } from "@/components/RequireKitToken";
import { ParrsJarsHubPage } from "@/pages/ParrsJarsHubPage";
import { ParrsJarsKitPage } from "@/pages/ParrsJarsKitPage";

// ── Shared constants ──────────────────────────────────────────────────────────

const KIT_LS_KEY = "headwaters:kit-token:pj-solutions-kit";

/** A token string that looks syntactically valid but is unknown to the DB. */
const FABRICATED_TOKEN = "deadbeef".repeat(8); // 64-char hex lookalike

const FABRICATED_TOKEN_STORED = JSON.stringify({
  token: FABRICATED_TOKEN,
  expiresAt: new Date(Date.now() + 86_400_000 * 30).toISOString(),
  buyerName: "Fabricated Buyer",
});

// ── Test 1: No-token redirect via RequireKitToken ─────────────────────────────
//
// When localStorage holds no token at all for pj-solutions-kit, RequireKitToken
// issues a synchronous <Redirect to="/parrsjars/kit?reason=access-required" />.
// The router updates to the kit route, and the kit purchase page is rendered.
// The access-required banner on that page confirms the redirect carried the
// `reason` query parameter through correctly.

describe("RequireKitToken — no stored token redirects to the kit purchase page", () => {
  beforeEach(() => {
    localStorage.clear(); // no token
  });

  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("redirects to /parrsjars/kit and shows the kit purchase page when no token is stored", async () => {
    const { hook } = memoryLocation({ path: "/parrsjars/hub", record: true });

    // ParrsJarsKitPage calls useKitAccess (no localStorage → no fetch, settles
    // to "none" quickly). Stub fetch so any stray network call is safe.
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(new Response("{}", { status: 200 }))));

    render(
      <Router hook={hook}>
        <Route path="/parrsjars/hub">
          <RequireKitToken kitId="pj-solutions-kit">
            {/* Hub content — should never be reached with no token */}
            <div>Principles to Preservation — Hub Content</div>
          </RequireKitToken>
        </Route>
        <Route path="/parrsjars/kit">
          <ParrsJarsKitPage />
        </Route>
      </Router>,
    );

    // The kit page hero headline should be visible after the redirect.
    await waitFor(() => {
      expect(screen.getByText("The PJ Solutions Kit")).toBeInTheDocument();
    });
  });

  it("shows the access-required banner on the kit page after the redirect", async () => {
    const { hook } = memoryLocation({ path: "/parrsjars/hub", record: true });

    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(new Response("{}", { status: 200 }))));

    render(
      <Router hook={hook}>
        <Route path="/parrsjars/hub">
          <RequireKitToken kitId="pj-solutions-kit">
            <div>Hub Content</div>
          </RequireKitToken>
        </Route>
        <Route path="/parrsjars/kit">
          <ParrsJarsKitPage />
        </Route>
      </Router>,
    );

    // The access-required banner text lives inside ParrsJarsKitPage and is only
    // rendered when ?reason=access-required is present in the search string —
    // confirming that RequireKitToken's redirect carried the query param through.
    await waitFor(() => {
      expect(
        screen.getByText(
          /You need a kit access link to view this page/i,
        ),
      ).toBeInTheDocument();
    });
  });

  it("does not render hub content during or after the redirect", async () => {
    const { hook } = memoryLocation({ path: "/parrsjars/hub", record: true });

    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(new Response("{}", { status: 200 }))));

    render(
      <Router hook={hook}>
        <Route path="/parrsjars/hub">
          <RequireKitToken kitId="pj-solutions-kit">
            <div>Principles to Preservation — Hub Content</div>
          </RequireKitToken>
        </Route>
        <Route path="/parrsjars/kit">
          <ParrsJarsKitPage />
        </Route>
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByText("The PJ Solutions Kit")).toBeInTheDocument();
    });

    // Hub content must never have been mounted.
    expect(
      screen.queryByText("Principles to Preservation — Hub Content"),
    ).not.toBeInTheDocument();
  });
});

// ── Test 2: Invalid token (server 404) renders LockedWall ─────────────────────
//
// When a fabricated (DB-unknown) token is stored in localStorage, the server
// returns HTTP 404.  fetchKitAccess throws a KitAccessError(404), which is not
// 410, so useKitAccess resolves to status "invalid".  ParrsJarsHubPage must
// render LockedWall with the generic "Your resource hub is one purchase away."
// headline — not hub content and not a blank screen.

describe("ParrsJarsHubPage — fabricated token rejected with 404 shows LockedWall", () => {
  beforeEach(() => {
    // Inject a syntactically valid but DB-unknown token.
    localStorage.setItem(KIT_LS_KEY, FABRICATED_TOKEN_STORED);

    // Server returns 404 — token not found.
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ error: "not_found" }), {
            status: 404,
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

  it("shows the generic LockedWall when the server returns 404 for an unknown token", async () => {
    render(<ParrsJarsHubPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Your resource hub is one purchase away."),
      ).toBeInTheDocument();
    });
  });

  it("does not render any hub module content when the server returns 404", async () => {
    render(<ParrsJarsHubPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Your resource hub is one purchase away."),
      ).toBeInTheDocument();
    });

    // "Get Started" is a handout title inside the Foundation module — only
    // visible inside the unlocked hub grid.
    expect(screen.queryByText("Get Started")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Eat What You Store & Store What You Eat"),
    ).not.toBeInTheDocument();
  });

  it("does not show the expired-token headline when the server returns 404 (not 410)", async () => {
    render(<ParrsJarsHubPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Your resource hub is one purchase away."),
      ).toBeInTheDocument();
    });

    // A 404 must NOT trigger the expired-token variant of LockedWall.
    expect(
      screen.queryByText("Your access link has expired."),
    ).not.toBeInTheDocument();
  });

  it("validates the fabricated token against the server before rejecting it", async () => {
    render(<ParrsJarsHubPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Your resource hub is one purchase away."),
      ).toBeInTheDocument();
    });

    // The hook must have called the server with the fabricated token —
    // confirming rejection is server-side, not a client-side shortcut.
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      expect.stringContaining(FABRICATED_TOKEN),
    );
  });

  it("clears the fabricated token from localStorage after the 404 rejection", async () => {
    render(<ParrsJarsHubPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Your resource hub is one purchase away."),
      ).toBeInTheDocument();
    });

    // The invalid token should have been evicted so the next visit is clean.
    expect(localStorage.getItem(KIT_LS_KEY)).toBeNull();
  });
});
