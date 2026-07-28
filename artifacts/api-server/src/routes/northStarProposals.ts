/**
 * North Star Proposals — server-side owner-token gate for proposal outcomes
 *
 * POST /api/north-star/proposals/:id/outcome
 *   Validates the owner token before acknowledging an accept/reject decision.
 *   The proposal store lives client-side (Zustand/localStorage); this endpoint
 *   exists purely as an auth checkpoint so DevTools cannot bypass the gate by
 *   calling store actions directly.
 *
 * Auth: owner token (x-library-owner-token header or Authorization: Bearer)
 *       required. Returns 401 when absent or wrong.
 */

import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { isOwnerRequest } from "../lib/ownerAuth";

const router: IRouter = Router();

const OutcomeSchema = z.object({
  outcome: z.enum(["accepted", "rejected"]),
});

// POST /proposals/:id/outcome
router.post("/proposals/:id/outcome", (req: Request, res: Response) => {
  if (!isOwnerRequest(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const id = req.params.id as string;
  if (!id || typeof id !== "string" || id.trim() === "") {
    res.status(400).json({ error: "Proposal id is required" });
    return;
  }

  const parsed = OutcomeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: parsed.error.issues[0]?.message ?? "outcome must be 'accepted' or 'rejected'",
    });
    return;
  }

  res.json({ ok: true, id, outcome: parsed.data.outcome });
});

export default router;
