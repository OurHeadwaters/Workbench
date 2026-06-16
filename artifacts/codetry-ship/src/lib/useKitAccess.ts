/**
 * useKitAccess — validates a stored kit token against the server.
 *
 * localStorage is treated as a transport cache only, NOT as proof of
 * entitlement. Every gated page calls this hook; it re-validates the
 * token via /api/kits/access/:token on every mount so that a manually
 * injected or expired token is rejected server-side.
 */

import { useState, useEffect } from "react";
import {
  getKitToken,
  clearKitToken,
  fetchKitAccess,
  type KitAccessResult,
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
}

export function useKitAccess(kitId: string): UseKitAccessResult {
  const [status, setStatus] = useState<KitAccessStatus>("loading");
  const [data, setData] = useState<KitAccessResult | null>(null);
  const [storedToken, setStoredToken] = useState<StoredKitToken | null>(null);

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
  };
}
