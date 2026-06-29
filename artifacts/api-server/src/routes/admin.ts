import { Router, type IRouter, type Request, type Response } from "express";
import { pruneExpiredRateLimits } from "../lib/rateLimit";
import { requireFounderOnlyAuth } from "../lib/kitAuth";
import { logger } from "../lib/logger";
import { db, kitDeliveryFailuresTable, kitTokensTable, kitWebhookAttemptsTable } from "@workspace/db";
import { isNull, eq, desc } from "drizzle-orm";
import { sendKitDeliveryEmail } from "../lib/kitsMailer";
import { getKit } from "../lib/kitsRegistry";
import { z } from "zod";

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

// GET /admin/kit-failures
// List all unresolved kit_delivery_failures rows (resolvedAt IS NULL).
// Returns newest first.
router.get(
  "/kit-failures",
  requireFounderOnlyAuth,
  async (_req: Request, res: Response) => {
    try {
      const rows = await db
        .select()
        .from(kitDeliveryFailuresTable)
        .where(isNull(kitDeliveryFailuresTable.resolvedAt))
        .orderBy(kitDeliveryFailuresTable.createdAt);

      res.json({ failures: rows });
    } catch (err) {
      logger.error({ err }, "[admin] kit-failures list failed");
      res.status(500).json({ error: "Failed to fetch kit delivery failures" });
    }
  },
);

const patchKitFailureSchema = z.object({
  resolve: z.boolean().optional(),
  retrigger: z.boolean().optional(),
});

// PATCH /admin/kit-failures/:id
// Mark a kit_delivery_failures row resolved and/or re-trigger delivery.
//
// Body (all optional):
//   resolve   — if true, stamp resolvedAt = now() on the row
//   retrigger — if true, attempt to re-send the kit delivery email;
//               automatically marks the row resolved if re-send succeeds
router.patch(
  "/kit-failures/:id",
  requireFounderOnlyAuth,
  async (req: Request, res: Response) => {
    const rawId = req.params["id"];
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    const parsed = patchKitFailureSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body", details: parsed.error.flatten() });
      return;
    }

    const { resolve = false, retrigger = false } = parsed.data;

    if (!resolve && !retrigger) {
      res.status(400).json({ error: "At least one of resolve or retrigger must be true" });
      return;
    }

    try {
      // Fetch the row
      const [row] = await db
        .select()
        .from(kitDeliveryFailuresTable)
        .where(eq(kitDeliveryFailuresTable.id, id))
        .limit(1);

      if (!row) {
        res.status(404).json({ error: "Kit delivery failure not found" });
        return;
      }

      let redeliveryStatus: "sent" | "failed" | "skipped" = "skipped";
      let redeliveryError: string | undefined;

      if (retrigger) {
        // Look up the kit from the registry to build the delivery email
        const kit = getKit(row.kitId);

        if (!kit) {
          logger.warn({ kitId: row.kitId, id }, "[admin] kit-failures retrigger — kit not found in registry");
          redeliveryStatus = "failed";
          redeliveryError = `Kit '${row.kitId}' not found in registry`;
        } else {
          // Find the most recently-expiring token for this purchase to get buyerName
          const [tokenRow] = await db
            .select()
            .from(kitTokensTable)
            .where(
              eq(kitTokensTable.purchaseId, row.purchaseId),
            )
            .orderBy(desc(kitTokensTable.expiresAt))
            .limit(1);

          if (!tokenRow) {
            logger.warn({ purchaseId: row.purchaseId, id }, "[admin] kit-failures retrigger — no token found for purchase");
            redeliveryStatus = "failed";
            redeliveryError = `No access token found for purchaseId '${row.purchaseId}'`;
          } else {
            const baseUrl =
              process.env.API_BASE_URL ??
              (process.env.REPLIT_DEV_DOMAIN
                ? `https://${process.env.REPLIT_DEV_DOMAIN}`
                : "http://localhost:8081");
            const accessUrl = `${baseUrl}/kits/access/${tokenRow.token}`;

            const mailResult = await sendKitDeliveryEmail({
              to: row.buyerEmail,
              buyerName: tokenRow.buyerName,
              kit,
              accessUrl,
              expiresAt: tokenRow.expiresAt,
            });

            redeliveryStatus = mailResult.status;
            redeliveryError = mailResult.error;

            logger.info(
              { id, purchaseId: row.purchaseId, kitId: row.kitId, status: mailResult.status },
              "[admin] kit-failures retrigger complete",
            );
          }
        }
      }

      // Mark resolved if explicitly requested, or if retrigger succeeded
      const shouldResolve = resolve || redeliveryStatus === "sent";

      if (shouldResolve) {
        await db
          .update(kitDeliveryFailuresTable)
          .set({ resolvedAt: new Date() })
          .where(eq(kitDeliveryFailuresTable.id, id));
        logger.info({ id }, "[admin] kit-failure marked resolved");
      }

      const [updated] = await db
        .select()
        .from(kitDeliveryFailuresTable)
        .where(eq(kitDeliveryFailuresTable.id, id))
        .limit(1);

      res.json({
        failure: updated,
        redelivery: retrigger
          ? { status: redeliveryStatus, error: redeliveryError }
          : undefined,
      });
    } catch (err) {
      logger.error({ err, id }, "[admin] kit-failures patch failed");
      res.status(500).json({ error: "Failed to update kit delivery failure" });
    }
  },
);

// GET /admin/webhook-attempts
// List all unresolved kit_webhook_attempts rows (resolvedAt IS NULL).
// These are Stripe checkout.session.completed events that failed to complete
// fulfillment after multiple retries. Returns newest-last-attempt first.
router.get(
  "/webhook-attempts",
  requireFounderOnlyAuth,
  async (_req: Request, res: Response) => {
    try {
      const rows = await db
        .select()
        .from(kitWebhookAttemptsTable)
        .where(isNull(kitWebhookAttemptsTable.resolvedAt))
        .orderBy(desc(kitWebhookAttemptsTable.lastAttemptAt));

      res.json({ attempts: rows });
    } catch (err) {
      logger.error({ err }, "[admin] webhook-attempts list failed");
      res.status(500).json({ error: "Failed to fetch webhook attempts" });
    }
  },
);

// PATCH /admin/webhook-attempts/:eventId
// Mark a kit_webhook_attempts row as resolved (buyer has been sorted out manually).
// Body: { resolve: true }
router.patch(
  "/webhook-attempts/:eventId",
  requireFounderOnlyAuth,
  async (req: Request, res: Response) => {
    const rawEventId = req.params["eventId"];
    const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

    const parsed = z.object({ resolve: z.boolean() }).safeParse(req.body);
    if (!parsed.success || !parsed.data.resolve) {
      res.status(400).json({ error: "Body must be { resolve: true }" });
      return;
    }

    try {
      const [row] = await db
        .select()
        .from(kitWebhookAttemptsTable)
        .where(eq(kitWebhookAttemptsTable.eventId, eventId))
        .limit(1);

      if (!row) {
        res.status(404).json({ error: "Webhook attempt not found" });
        return;
      }

      await db
        .update(kitWebhookAttemptsTable)
        .set({ resolvedAt: new Date() })
        .where(eq(kitWebhookAttemptsTable.eventId, eventId));

      logger.info({ eventId, purchaseId: row.purchaseId }, "[admin] webhook-attempt marked resolved");

      const [updated] = await db
        .select()
        .from(kitWebhookAttemptsTable)
        .where(eq(kitWebhookAttemptsTable.eventId, eventId))
        .limit(1);

      res.json({ attempt: updated });
    } catch (err) {
      logger.error({ err, eventId }, "[admin] webhook-attempts patch failed");
      res.status(500).json({ error: "Failed to update webhook attempt" });
    }
  },
);

export default router;
