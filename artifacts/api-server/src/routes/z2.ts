/**
 * Z2 identity routes — read-only access to the system Z2 npub.
 *
 * GET /api/z2/npub  — returns the cached Z2 npub (owner-gated, Z2-scoped only)
 *
 * Access rules:
 *   - Owner token required (same gate as River Smith and other system routes).
 *   - When LIBRARY_OWNER_TOKEN is not set, returns 412 so the client can
 *     distinguish "token not configured yet" from "wrong token" (401).
 *   - The response intentionally contains only the npub — no Z1 fields, no
 *     seed material, no household identity.
 */

import { Router, type IRouter, type Request, type Response } from "express";
import { isOwnerRequest, OWNER_TOKEN } from "../lib/ownerAuth";
import { getZ2Npub } from "../lib/z2Identity";

const router: IRouter = Router();

/**
 * GET /api/z2/npub
 *
 * Returns the system Z2 npub for the current Workbench instance.
 * Exposed only to owner-authenticated requests (Z2-scoped agent contexts).
 * Never returns seed material or any Z1 field.
 *
 * Response status meanings:
 *   200 — authenticated, npub returned
 *   412 — LIBRARY_OWNER_TOKEN is not set on the server (token not configured)
 *   401 — token is configured but the request did not supply it correctly
 *   503 — Z2_HOUSEHOLD_SEED is not set (npub cannot be derived)
 */
router.get("/npub", (req: Request, res: Response) => {
  // Distinguish "no token configured" from "wrong token supplied"
  if (!OWNER_TOKEN) {
    res.status(412).json({
      error:
        "Owner token not configured — set LIBRARY_OWNER_TOKEN on the API server to enable authenticated access to the Z2 npub.",
      code: "TOKEN_NOT_CONFIGURED",
    });
    return;
  }

  if (!isOwnerRequest(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const npub = getZ2Npub();

  if (!npub) {
    res.status(503).json({
      error:
        "Z2 npub is not available — Z2_HOUSEHOLD_SEED is not configured on this instance.",
    });
    return;
  }

  res.json({ npub });
});

export default router;
