/**
 * useKitAccess.test.ts
 *
 * Unit tests for the cross-kit token rejection guard in useKitAccess.
 *
 * Scenario covered:
 *   Cross-kit swap — a valid token for `economy-kit` is injected into
 *   localStorage under the `pj-solutions-kit` key.  The server legitimately
 *   returns kit.id = "economy-kit" for that token, so useKitAccess must
 *   detect the mismatch (line 50 of useKitAccess.ts) and set status to
 *   "invalid" — preventing privilege escalation to a different kit's hub.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

// Mock the kitTokens module so we can control token storage and the server
// fetch without touching localStorage or making real network calls.
vi.mock("@/lib/kitTokens", () => ({
  getKitToken: vi.fn(),
  clearKitToken: vi.fn(),
  fetchKitAccess: vi.fn(),
}));

import {
  getKitToken,
  clearKitToken,
  fetchKitAccess,
  type StoredKitToken,
  type KitAccessResult,
} from "@/lib/kitTokens";
import { useKitAccess } from "@/lib/useKitAccess";

// ── Shared test data ──────────────────────────────────────────────────────────

/** A token string that belongs to economy-kit in the DB. */
const CROSS_KIT_TOKEN = "aabbccdd".repeat(8); // 64-hex lookalike

/** What localStorage holds for the pj-solutions-kit key. */
const storedToken: StoredKitToken = {
  token: CROSS_KIT_TOKEN,
  expiresAt: new Date(Date.now() + 86_400_000).toISOString(), // 24 h from now
  buyerName: "Test Buyer",
};

/** What the server returns: the token is valid but belongs to economy-kit. */
const serverResponse: KitAccessResult = {
  ok: true,
  kit: {
    id: "economy-kit",         // ← different kit than the one being accessed
    name: "Economy Kit",
    tagline: "Another kit",
    arcNote: null,
    contentNote: "",
  },
  buyer_name: "Test Buyer",
  purchase_id: "purchase-xyz",
  expires_at: storedToken.expiresAt,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("useKitAccess — cross-kit token rejection", () => {
  beforeEach(() => {
    vi.mocked(getKitToken).mockReturnValue(storedToken);
    vi.mocked(fetchKitAccess).mockResolvedValue(serverResponse);
    vi.mocked(clearKitToken).mockImplementation(() => {});
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("returns status 'invalid' when the server kit.id does not match the requested kitId", async () => {
    const { result } = renderHook(() => useKitAccess("pj-solutions-kit"));

    // Starts loading while the async validation runs.
    expect(result.current.status).toBe("loading");

    await waitFor(() => {
      expect(result.current.status).toBe("invalid");
    });
  });

  it("clears the locally stored token when a cross-kit mismatch is detected", async () => {
    renderHook(() => useKitAccess("pj-solutions-kit"));

    await waitFor(() => {
      expect(vi.mocked(clearKitToken)).toHaveBeenCalledWith("pj-solutions-kit");
    });
  });

  it("does not expose any kit data when the cross-kit guard fires", async () => {
    const { result } = renderHook(() => useKitAccess("pj-solutions-kit"));

    await waitFor(() => {
      expect(result.current.status).toBe("invalid");
    });

    expect(result.current.data).toBeNull();
    expect(result.current.storedToken).toBeNull();
    expect(result.current.buyerName).toBeNull();
  });

  it("validates against the token stored for the requested kitId, not any other", async () => {
    renderHook(() => useKitAccess("pj-solutions-kit"));

    await waitFor(() => {
      expect(vi.mocked(getKitToken)).toHaveBeenCalledWith("pj-solutions-kit");
    });

    expect(vi.mocked(fetchKitAccess)).toHaveBeenCalledWith(CROSS_KIT_TOKEN);
  });

  it("returns status 'valid' when the server kit.id matches the requested kitId", async () => {
    // Override: server now returns the correct kit.
    vi.mocked(fetchKitAccess).mockResolvedValueOnce({
      ...serverResponse,
      kit: { ...serverResponse.kit, id: "pj-solutions-kit" },
    });

    const { result } = renderHook(() => useKitAccess("pj-solutions-kit"));

    await waitFor(() => {
      expect(result.current.status).toBe("valid");
    });

    expect(result.current.data).not.toBeNull();
    expect(result.current.data?.kit.id).toBe("pj-solutions-kit");
  });
});

// ── Expired cross-kit token edge case ─────────────────────────────────────────
//
// When a token is both expired (server 410) AND stored under the wrong kitId,
// the server error is thrown before the cross-kit guard runs, so the catch
// branch (lines 58–65 of useKitAccess.ts) takes over.  The intended behaviour
// is status "expired" — not "invalid" — because the server's authoritative
// rejection (410 Gone) is the primary signal.  These tests pin that behaviour
// so a future refactor of error-handling order cannot accidentally let such a
// token slip through under a different status.

describe("useKitAccess — expired cross-kit token (410 from server)", () => {
  /** An error shaped like the internal KitAccessError (status 410). */
  const expiredCrossKitError = Object.assign(
    new Error("Access check failed (410)"),
    { status: 410 },
  );

  /** Stored token is keyed to pj-solutions-kit but was issued for economy-kit. */
  const crossKitStored: StoredKitToken = {
    token: CROSS_KIT_TOKEN,
    expiresAt: new Date(Date.now() - 1000).toISOString(), // already past
    buyerName: "Test Buyer",
  };

  beforeEach(() => {
    vi.mocked(getKitToken).mockReturnValue(crossKitStored);
    vi.mocked(fetchKitAccess).mockRejectedValue(expiredCrossKitError);
    vi.mocked(clearKitToken).mockImplementation(() => {});
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("resolves to status 'expired' when the server returns 410 for a cross-kit token", async () => {
    const { result } = renderHook(() => useKitAccess("pj-solutions-kit"));

    await waitFor(() => {
      expect(result.current.status).toBe("expired");
    });

    expect(result.current.data).toBeNull();
  });

  it("still calls clearKitToken when the 410 path is taken for a cross-kit token", async () => {
    renderHook(() => useKitAccess("pj-solutions-kit"));

    await waitFor(() => {
      expect(vi.mocked(clearKitToken)).toHaveBeenCalledWith("pj-solutions-kit");
    });
  });
});
