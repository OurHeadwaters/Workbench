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
 *                  checkout.session.async_payment_failed
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
import { db, kitTokensTable, stripeProcessedEventsTable, kitDeliveryFailuresTable, kitWebhookAttemptsTable } from "@workspace/db";

const router: IRouter = Router();

// ── Stripe retry exhaustion ───────────────────────────────────────────────────
//
// Stripe retries a webhook endpoint up to ~8 times over ~3 days when it
// receives a non-2xx response.  Each time the transaction fails (and the
// claim row is automatically rolled back), we increment a counter in
// kit_webhook_attempts.  Once the count reaches STRIPE_MAX_RETRIES the
// delivery cannot succeed through normal retries; we send an alert so the
// founder can intervene manually.

const STRIPE_MAX_RETRIES = 8;

async function trackAndCheckRetryExhaustion(opts: {
  eventId: string;
  kitId: string;
  buyerEmail: string;
  purchaseId: string;
}): Promise<{ exhausted: boolean; attemptCount: number }> {
  const { eventId, kitId, buyerEmail, purchaseId } = opts;

  // Read the current count first so we can increment it in application code.
  // Stripe retries are spaced hours apart, so the SELECT→upsert window is
  // safe in practice.
  const existing = await db
    .select({ attemptCount: kitWebhookAttemptsTable.attemptCount })
    .from(kitWebhookAttemptsTable)
    .where(eq(kitWebhookAttemptsTable.eventId, eventId));

  const newCount = existing.length > 0 ? (existing[0].attemptCount as number) + 1 : 1;

  await db
    .insert(kitWebhookAttemptsTable)
    .values({ eventId, kitId, buyerEmail, purchaseId, attemptCount: newCount, lastAttemptAt: new Date() })
    .onConflictDoUpdate({
      target: kitWebhookAttemptsTable.eventId,
      set: { attemptCount: newCount, lastAttemptAt: new Date() },
    });

  return { exhausted: newCount >= STRIPE_MAX_RETRIES, attemptCount: newCount };
}

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
// Atomicity: both the claim INSERT and the token INSERT are wrapped in a single
// db.transaction() call. If the token INSERT fails (DB error, constraint
// violation, crash between the two calls, etc.) Postgres automatically rolls
// back the claim row — no manual unclaimEvent() needed. The next Stripe retry
// finds no claim row and re-enters the full delivery flow.

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

      const token = generateToken();
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + TOKEN_TTL_MS);

      // Atomic idempotency gate + token creation: both INSERTs run inside a
      // single transaction. The claim INSERT uses ON CONFLICT DO NOTHING so
      // duplicate events are detected without throwing. If the token INSERT
      // fails (or the process crashes after the claim INSERT), Postgres rolls
      // back the claim row automatically — no manual unclaimEvent() needed —
      // and the next Stripe retry re-enters the full delivery flow cleanly.
      let claimed: boolean;
      try {
        claimed = await db.transaction(async (tx) => {
          const inserted = await tx
            .insert(stripeProcessedEventsTable)
            .values({ eventId: event.id, purchaseId })
            .onConflictDoNothing()
            .returning({ eventId: stripeProcessedEventsTable.eventId });

          if (inserted.length === 0) return false;

          await tx.insert(kitTokensTable).values({
            token,
            kitId,
            buyerEmail: buyerEmail.toLowerCase(),
            buyerName: buyerName ?? "there",
            purchaseId,
            createdAt,
            expiresAt,
          });

          return true;
        });
      } catch (err) {
        // The transaction was rolled back automatically by Postgres — the
        // claim row is gone, so the next Stripe retry re-enters cleanly.
        logger.error(
          { err, kitId, sessionId: session.id, eventId: event.id },
          "[stripe-webhook] failed to persist token — transaction rolled back, delivery WILL be retried by Stripe",
        );

        // Track how many times this event has failed. Once the count
        // reaches STRIPE_MAX_RETRIES the retries are exhausted and the
        // buyer will never receive their kit without manual intervention.
        try {
          const { exhausted, attemptCount } = await trackAndCheckRetryExhaustion({
            eventId: event.id,
            kitId,
            buyerEmail: buyerEmail.toLowerCase(),
            purchaseId,
          });
          if (exhausted) {
            logger.error(
              { kitId, purchaseId, buyerEmail, attemptCount },
              "[stripe-webhook] Stripe retries exhausted — alerting founder",
            );
            await sendKitDeliveryFailureAlert({
              buyerEmail,
              kitId,
              purchaseId,
              deliveryError: `Token INSERT failed after ${attemptCount} Stripe delivery attempts — retries exhausted`,
            });
          }
        } catch (trackErr) {
          logger.error(
            { trackErr, kitId, purchaseId },
            "[stripe-webhook] failed to track retry exhaustion",
          );
        }

        res.status(500).json({ error: "Failed to record purchase" });
        return;
      }

      if (!claimed) {
        logger.info({ eventId: event.id, type: event.type }, "[stripe-webhook] duplicate event — skipping");
        res.json({ received: true, duplicate: true });
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
    } else if (event.type === "checkout.session.async_payment_failed") {
      // Fired by Stripe when an async payment method (e.g. ACH / BACS) is
      // ultimately declined after the checkout session was created.  The
      // buyer will not be charged and their kit will not be delivered.
      // Alert the founder so they can follow up manually.
      const session = event.data.object as Stripe.Checkout.Session;

      const kitId = session.metadata?.kit_id ?? "(unknown)";
      const buyerEmail =
        session.customer_details?.email ?? session.customer_email ?? "(unknown)";
      const purchaseId = session.payment_intent
        ? String(session.payment_intent)
        : session.id;

      logger.warn(
        { sessionId: session.id, kitId, buyerEmail, purchaseId },
        "[stripe-webhook] checkout.session.async_payment_failed — alerting founder",
      );

      await sendKitDeliveryFailureAlert({
        buyerEmail,
        kitId,
        purchaseId,
        deliveryError: "Stripe async payment failed — buyer was not charged and kit was not delivered",
      });
    }

    res.json({ received: true });
  },
);

export default router;
