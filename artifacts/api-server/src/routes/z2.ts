/**
 * Z2 identity routes — read-only access to the system Z2 npub.
 *
 * GET /api/z2/npub  — returns the cached Z2 npub (owner-gated, Z2-scoped only)
 *
 * Access rules:
 *   - Owner token required (same gate as River Smith and other system routes).
 *   - The response intentionally contains only the npub — no Z1 fields, no
 *     seed material, no household identity.
 */

import { Router, type IRouter, type Request, type Response } from "express";
import { isOwnerRequest, OWNER_TOKEN } from "../lib/ownerAuth";
import { getZ2Npub } from "../lib/z2Identity";

const router: IRouter = Router();

function requireOwner(req: Request): boolean {
  return !!OWNER_TOKEN && isOwnerRequest(req);
}

/**
 * GET /api/z2/npub
 *
 * Returns the system Z2 npub for the current Workbench instance.
 * Exposed only to owner-authenticated requests (Z2-scoped agent contexts).
 * Never returns seed material or any Z1 field.
 */
router.get("/npub", (req: Request, res: Response) => {
  if (!requireOwner(req)) {
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
