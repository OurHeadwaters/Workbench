/**
 * useKitAccess — validates a stored kit token against the server and fetches
 * the buyer's server-side progress so it can be restored on any device.
 *
 * localStorage is treated as a transport cache only, NOT as proof of
 * entitlement. Every gated page calls this hook; it re-validates the
 * token via /api/kits/access/:token on every mount so that a manually
 * injected or expired token is rejected server-side.
 *
 * After a successful validation the hook also calls
 * /api/kits/access/:token/progress to restore any visited-module and
 * visited-handout state that the buyer built up on another device or
 * browser.  The page can then merge this with its own localStorage copy
 * to form the authoritative initial state.
 */

import { useState, useEffect } from "react";
import {
  getKitToken,
  clearKitToken,
  fetchKitAccess,
  fetchKitProgress,
  type KitAccessResult,
  type KitProgressResult,
  type StoredKitToken,
} from "@/lib/kitTokens";

export type KitAccessStatus = "loading" | "valid" | "expired" | "invalid" | "none";

export interface UseKitAccessResult {
  status: KitAccessStatus;
  /** Full server-validated kit data; only set when status === "valid". */
  data: KitAccessResult | null;
  /** The stored token used to validate; only set when status === "valid". */
  storedToken: StoredKitToken | null;
  buyerName: string | null;
  /**
   * Server-side progress fetched immediately after token validation.
   * Use this to initialise visited state on a fresh device / browser.
   * null while loading or when status !== "valid".
   */
  serverProgress: KitProgressResult | null;
}

export function useKitAccess(kitId: string): UseKitAccessResult {
  const [status, setStatus] = useState<KitAccessStatus>("loading");
  const [data, setData] = useState<KitAccessResult | null>(null);
  const [storedToken, setStoredToken] = useState<StoredKitToken | null>(null);
  const [serverProgress, setServerProgress] = useState<KitProgressResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function validate() {
      const stored = getKitToken(kitId);
      if (!stored) {
        if (!cancelled) setStatus("none");
        return;
      }

      try {
        const result = await fetchKitAccess(stored.token);
        if (cancelled) return;
        // Reject tokens that belong to a different kit — prevents cross-kit
        // privilege escalation by a manually-injected localStorage entry.
        if (result.kit.id !== kitId) {
          clearKitToken(kitId);
          setStatus("invalid");
          return;
        }
        setData(result);
        setStoredToken(stored);
        setStatus("valid");

        // Fetch server-side progress after validation so it's ready for the page.
        // This is best-effort: failure falls back to localStorage-only state.
        const progress = await fetchKitProgress(stored.token);
        if (!cancelled) setServerProgress(progress);
      } catch (err: unknown) {
        if (cancelled) return;
        const httpStatus =
          err instanceof Error && "status" in err
            ? (err as { status: number }).status
            : 0;
        clearKitToken(kitId);
        setStatus(httpStatus === 410 ? "expired" : "invalid");
      }
    }

    void validate();
    return () => { cancelled = true; };
  }, [kitId]);

  return {
    status,
    data,
    storedToken,
    buyerName: data?.buyer_name ?? null,
    serverProgress,
  };
}
