/**
 * stripeWebhook — POST /stripe/webhook
 *
 * Verifies incoming Stripe events with stripe.webhooks.constructEvent and
 * dispatches kit delivery on checkout.session.completed.
 *
 * IMPORTANT: This router must be registered in app.ts BEFORE express.json()
 * so the raw request body (Buffer) is preserved for signature verification.
 * The route itself applies express.raw({ type: 'application/json' }).
 *
 * Required environment variables:
 *   STRIPE_SECRET_KEY       — Stripe secret key (sk_live_… or sk_test_…)
 *   STRIPE_WEBHOOK_SECRET   — Webhook signing secret from the Stripe dashboard
 *                             (whsec_…). Found at:
 *                             Stripe Dashboard → Developers → Webhooks → [endpoint] → Signing secret
 *
 * Stripe dashboard webhook configuration:
 *   Endpoint URL : https://<your-api-domain>/api/stripe/webhook
 *   Events       : checkout.session.completed
 *
 * Kit delivery flow:
 *   1. Stripe fires checkout.session.completed when a payment succeeds.
 *   2. We extract kit_id from session.metadata and customer email from
 *      session.customer_details.email (falling back to session.customer_email).
 *   3. We generate a 90-day access token, persist it to the kit_tokens DB table,
 *      and send the magic-link delivery email via Google Mail.
 *
 * Idempotency:
 *   Processed Stripe event IDs are persisted to the stripe_processed_events table.
 *   Replayed events (Stripe retries on 5xx or network failure) are detected and
 *   skipped so buyers never receive duplicate emails. The DB-backed guard is safe
 *   across multiple service instances.
 *
 * See also: artifacts/api-server/docs/secrets-checklist.md for operational setup.
 */

import { Router, type IRouter, type Request, type Response } from "express";
import express from "express";
import crypto from "crypto";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";
import { getKit } from "../lib/kitsRegistry";
import { sendKitDeliveryEmail, sendKitDeliveryFailureAlert } from "../lib/kitsMailer";
import { db, kitTokensTable, stripeProcessedEventsTable, kitDeliveryFailuresTable } from "@workspace/db";

const router: IRouter = Router();

// ── Token helpers ─────────────────────────────────────────────────────────────

const TOKEN_TTL_MS = 90 * 24 * 60 * 60 * 1000;

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function accessUrl(token: string): string {
  const base =
    process.env.API_BASE_URL ??
    (process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : "http://localhost:8081");
  return `${base}/api/kits/access/${token}`;
}

// ── Processed event ID store (idempotency) ────────────────────────────────────
//
// Stripe retries webhook delivery on 5xx responses or network timeouts.
// Persisting the event ID to the database ensures we never send duplicate emails
// and the guard is shared across all instances of the service.
//
// Race safety: we INSERT … ON CONFLICT DO NOTHING *before* token creation and
// email delivery, then check the affected-row count via .returning(). If the
// insert is a no-op (another concurrent request already claimed this event_id),
// .returning() returns an empty array and we bail immediately — without ever
// creating a token or sending an email. This closes the TOCTOU window that
// existed when the SELECT check and the INSERT were separate steps.
//
// Retry safety: claimEvent() runs before the kit-token INSERT. If the token
// INSERT then fails (DB error, constraint violation, etc.) we call
// unclaimEvent() to remove the row so the next Stripe retry can re-enter the
// delivery flow. Without this rollback, the duplicate gate would permanently
// block every subsequent retry and the buyer would never receive their kit.

async function claimEvent(
  eventId: string,
  purchaseId: string,
): Promise<boolean> {
  const inserted = await db
    .insert(stripeProcessedEventsTable)
    .values({ eventId, purchaseId })
    .onConflictDoNothing()
    .returning({ eventId: stripeProcessedEventsTable.eventId });
  // inserted.length === 1 → we own this event; 0 → another handler got there first
  return inserted.length > 0;
}

async function unclaimEvent(eventId: string): Promise<void> {
  await db
    .delete(stripeProcessedEventsTable)
    .where(eq(stripeProcessedEventsTable.eventId, eventId));
}

// ── POST /stripe/webhook ──────────────────────────────────────────────────────
//
// express.raw() is applied per-route so the raw Buffer is available for
// stripe.webhooks.constructEvent. Global express.json() must NOT have run
// before this handler (ensured by registration order in app.ts).

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      logger.warn("[stripe-webhook] STRIPE_WEBHOOK_SECRET not set — rejecting all events");
      res.status(503).json({ error: "Webhook not configured" });
      return;
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      logger.warn("[stripe-webhook] STRIPE_SECRET_KEY not set — cannot verify events");
      res.status(503).json({ error: "Stripe not configured" });
      return;
    }

    const sig = req.headers["stripe-signature"];
    if (!sig || typeof sig !== "string") {
      res.status(400).json({ error: "Missing stripe-signature header" });
      return;
    }

    let event: Stripe.Event;
    try {
      const stripe = new Stripe(stripeKey);
      event = stripe.webhooks.constructEvent(req.body as Buffer, sig, secret);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.warn({ err: msg }, "[stripe-webhook] signature verification failed");
      res.status(400).json({ error: `Webhook signature verification failed: ${msg}` });
      return;
    }

    logger.info({ type: event.type, id: event.id }, "[stripe-webhook] event received");

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const kitId = session.metadata?.kit_id;
      const buyerEmail =
        session.customer_details?.email ?? session.customer_email ?? null;
      const buyerName =
        session.customer_details?.name ??
        (buyerEmail ? buyerEmail.split("@")[0] : "there");
      const purchaseId = session.payment_intent
        ? String(session.payment_intent)
        : session.id;

      if (!kitId) {
        logger.warn({ sessionId: session.id }, "[stripe-webhook] checkout.session.completed missing kit_id in metadata — skipping delivery");
        res.json({ received: true, skipped: "no kit_id in metadata" });
        return;
      }

      if (!buyerEmail) {
        logger.warn({ sessionId: session.id, kitId }, "[stripe-webhook] checkout.session.completed missing customer email — skipping delivery");
        res.json({ received: true, skipped: "no customer email" });
        return;
      }

      const kit = getKit(kitId);
      if (!kit) {
        logger.warn({ sessionId: session.id, kitId }, "[stripe-webhook] unknown kit_id — skipping delivery");
        res.json({ received: true, skipped: `unknown kit_id: ${kitId}` });
        return;
      }

      // Atomic idempotency gate: claim the event row *before* token creation or
      // email delivery. The INSERT … ON CONFLICT DO NOTHING + RETURNING pattern
      // means only the one request that actually inserts a row proceeds — any
      // concurrent retry that loses the race gets 0 rows back and returns early.
      // This closes the TOCTOU window of the old SELECT-then-INSERT approach.
      const claimed = await claimEvent(event.id, purchaseId);
      if (!claimed) {
        logger.info({ eventId: event.id, type: event.type }, "[stripe-webhook] duplicate event — skipping");
        res.json({ received: true, duplicate: true });
        return;
      }

      const token = generateToken();
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + TOKEN_TTL_MS);

      try {
        await db.insert(kitTokensTable).values({
          token,
          kitId,
          buyerEmail: buyerEmail.toLowerCase(),
          buyerName: buyerName ?? "there",
          purchaseId,
          createdAt,
          expiresAt,
        });
      } catch (err) {
        // Remove the duplicate-delivery lock so the next Stripe retry can
        // re-enter the full delivery flow. Without this, every subsequent
        // retry would hit the duplicate gate and skip delivery permanently,
        // leaving the buyer without their kit.
        try {
          await unclaimEvent(event.id);
          logger.error(
            { err, kitId, sessionId: session.id, eventId: event.id },
            "[stripe-webhook] failed to persist token — event unclaimed, delivery WILL be retried by Stripe",
          );
        } catch (unclaimErr) {
          logger.error(
            { err, unclaimErr, kitId, sessionId: session.id, eventId: event.id },
            "[stripe-webhook] failed to persist token AND failed to unclaim event — delivery will NOT be retried, manual intervention required",
          );
        }
        res.status(500).json({ error: "Failed to record purchase" });
        return;
      }

      const url = accessUrl(token);
      const mailResult = await sendKitDeliveryEmail({
        to: buyerEmail,
        buyerName,
        kit,
        accessUrl: url,
        expiresAt,
      });

      logger.info(
        { kitId, purchaseId, buyerEmail, sessionId: session.id, mailStatus: mailResult.status },
        "[stripe-webhook] kit delivered",
      );

      if (mailResult.status === "failed") {
        // Persist the failure to the DB audit trail so it's queryable even if
        // the alert email also fails or the founder misses it.
        try {
          await db.insert(kitDeliveryFailuresTable).values({
            buyerEmail: buyerEmail.toLowerCase(),
            kitId,
            purchaseId,
            error: mailResult.error ?? null,
          });
        } catch (dbErr) {
          logger.error(
            { dbErr, kitId, purchaseId },
            "[stripe-webhook] failed to persist delivery failure record",
          );
        }

        await sendKitDeliveryFailureAlert({
          buyerEmail,
          kitId,
          purchaseId,
          deliveryError: mailResult.error,
        });
      }
    }

    res.json({ received: true });
  },
);

export default router;
