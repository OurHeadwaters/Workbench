import app from "./app";
import { logger } from "./lib/logger";
import { seedBookkeeper } from "./lib/bookkeeperSeed";
import { runExpireOverdue } from "./routes/helpingHands";
import { pool } from "@workspace/db";
import { setRateLimitBackend, pruneExpiredRateLimits } from "./lib/rateLimit";
import { runEngagementOutboundDeliveries } from "./lib/engagementOutbound";

setRateLimitBackend(pool);

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, "0.0.0.0", (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  if (!process.env.CONFIDENTIAL_NOTIFY_EMAIL) {
    logger.warn(
      "CONFIDENTIAL_NOTIFY_EMAIL is not set — confidential intake notifications will be skipped",
    );
  }

  if (!process.env.HEADWATERS_OWNER_EMAIL) {
    logger.warn(
      "HEADWATERS_OWNER_EMAIL is not set — no user will be auto-promoted to the owner role on first sign-in",
    );
  }

  seedBookkeeper().catch((seedErr) => {
    logger.error({ err: seedErr }, "bookkeeper seed failed");
  });

  // ── Daily missed-shift scheduler ───────────────────────────────
  // Runs once at startup (catches any tasks that went overdue while
  // the server was down), then every 24 hours thereafter.
  // This is the automatic leg of the missed-shift check; admins can
  // also trigger it manually via POST /helping-hands/expire-overdue.
  async function scheduledExpire() {
    try {
      const result = await runExpireOverdue();
      if (result.expired > 0) {
        logger.info(result, "scheduled missed-shift check complete");
      }
    } catch (schedErr) {
      logger.error({ err: schedErr }, "scheduled missed-shift check failed");
    }
  }

  // ── Daily rate-limit pruner ─────────────────────────────────────
  // Deletes rows from the rate_limits table whose window has already
  // expired.  Without this the table grows forever as bots and
  // one-time visitors accumulate rows that are never touched again.
  async function scheduledPruneRateLimits() {
    try {
      const deleted = await pruneExpiredRateLimits();
      if (deleted !== null && deleted > 0) {
        logger.info({ deleted }, "rate-limit prune complete");
      }
    } catch (pruneErr) {
      logger.error({ err: pruneErr }, "rate-limit prune failed");
    }
  }

  // Run immediately on startup, then repeat every 24 h
  scheduledExpire();
  setInterval(scheduledExpire, 24 * 60 * 60 * 1000);

  scheduledPruneRateLimits();
  setInterval(scheduledPruneRateLimits, 7 * 60 * 1000); // every 7 minutes

  let outboundRunning = false;
  async function scheduledOutboundDelivery() {
    if (outboundRunning) return;
    outboundRunning = true;
    try {
      await runEngagementOutboundDeliveries();
    } catch (outboundErr) {
      logger.error({ err: outboundErr }, "engagement outbound delivery failed");
    } finally {
      outboundRunning = false;
    }
  }
  scheduledOutboundDelivery();
  setInterval(scheduledOutboundDelivery, 60 * 1000);
});
