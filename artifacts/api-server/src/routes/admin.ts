import { Router, type IRouter, type Request, type Response } from "express";
import { pruneExpiredRateLimits } from "../lib/rateLimit";
import { requireFounderOnlyAuth } from "../lib/kitAuth";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// POST /admin/rate-limits/prune
// Admin-only endpoint to immediately flush expired rows from the rate_limits
// table.  Useful after a bot attack when operators cannot wait for the next
// scheduled 24-hour run.  Mirrors the logic that runs automatically at server
// startup via scheduledPruneRateLimits() in index.ts.
router.post(
  "/rate-limits/prune",
  requireFounderOnlyAuth,
  async (_req: Request, res: Response) => {
    try {
      const deleted = await pruneExpiredRateLimits();

      if (deleted === null) {
        // Postgres backend not configured — in-memory mode has nothing to prune.
        res.json({ deleted: 0, note: "Postgres backend not active; nothing to prune." });
        return;
      }

      logger.info({ deleted }, "[admin] manual rate-limit prune complete");
      res.json({ deleted });
    } catch (err) {
      logger.error({ err }, "[admin] rate-limit prune failed");
      res.status(500).json({ error: "Rate-limit prune failed" });
    }
  },
);

export default router;
