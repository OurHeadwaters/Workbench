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
