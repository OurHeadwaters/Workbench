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
 *   3. We generate a 30-day access token, persist it to kit-tokens.json,
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
import { sendKitDeliveryEmail } from "../lib/kitsMailer";
import { db, kitTokensTable, stripeProcessedEventsTable } from "@workspace/db";

const router: IRouter = Router();

// ── Token helpers ─────────────────────────────────────────────────────────────

const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

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

async function isEventAlreadyProcessed(eventId: string): Promise<boolean> {
  const rows = await db
    .select({ eventId: stripeProcessedEventsTable.eventId })
    .from(stripeProcessedEventsTable)
    .where(eq(stripeProcessedEventsTable.eventId, eventId))
    .limit(1);
  return rows.length > 0;
}

async function markEventProcessed(eventId: string, purchaseId: string): Promise<void> {
  await db
    .insert(stripeProcessedEventsTable)
    .values({ eventId, purchaseId })
    .onConflictDoNothing();
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

    // Idempotency check — Stripe retries on 5xx; skip already-processed events.
    if (await isEventAlreadyProcessed(event.id)) {
      logger.info({ eventId: event.id, type: event.type }, "[stripe-webhook] duplicate event — skipping");
      res.json({ received: true, duplicate: true });
      return;
    }

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
        logger.error({ err, kitId, sessionId: session.id }, "[stripe-webhook] failed to persist token");
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

      // Mark processed only after successful token persistence + email attempt,
      // so a hard crash before this point will let Stripe retry and re-deliver.
      await markEventProcessed(event.id, purchaseId);
    }

    res.json({ received: true });
  },
);

export default router;
