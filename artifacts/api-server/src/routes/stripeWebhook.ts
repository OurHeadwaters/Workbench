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
 *   Processed Stripe event IDs are persisted to data/stripe-processed-events.json.
 *   Replayed events (Stripe retries on 5xx or network failure) are detected and
 *   skipped so buyers never receive duplicate emails.
 *
 * See also: artifacts/api-server/docs/secrets-checklist.md for operational setup.
 */

import { Router, type IRouter, type Request, type Response } from "express";
import express from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import Stripe from "stripe";
import { logger } from "../lib/logger";
import { getKit } from "../lib/kitsRegistry";
import { sendKitDeliveryEmail } from "../lib/kitsMailer";

const router: IRouter = Router();

// ── Shared data directory ─────────────────────────────────────────────────────

const DATA_DIR = path.resolve(process.cwd(), "data");

// ── Token store (shared data dir with kits.ts) ────────────────────────────────

const TOKENS_FILE = path.join(DATA_DIR, "kit-tokens.json");
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

interface TokenRecord {
  token: string;
  kit_id: string;
  buyer_email: string;
  buyer_name: string;
  purchase_id: string;
  created_at: string;
  expires_at: string;
}

type TokenStore = Record<string, TokenRecord>;

function readTokenStore(): TokenStore {
  try {
    if (!fs.existsSync(TOKENS_FILE)) return {};
    return JSON.parse(fs.readFileSync(TOKENS_FILE, "utf-8")) as TokenStore;
  } catch {
    return {};
  }
}

function writeTokenStore(store: TokenStore): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(store, null, 2), "utf-8");
}

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
// Persisting the event ID ensures we never send a buyer duplicate emails.

const PROCESSED_EVENTS_FILE = path.join(DATA_DIR, "stripe-processed-events.json");

interface ProcessedEvent {
  event_id: string;
  processed_at: string;
  purchase_id: string;
}

type ProcessedEventsStore = Record<string, ProcessedEvent>;

function readProcessedEvents(): ProcessedEventsStore {
  try {
    if (!fs.existsSync(PROCESSED_EVENTS_FILE)) return {};
    return JSON.parse(fs.readFileSync(PROCESSED_EVENTS_FILE, "utf-8")) as ProcessedEventsStore;
  } catch {
    return {};
  }
}

function markEventProcessed(eventId: string, purchaseId: string): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    const store = readProcessedEvents();
    store[eventId] = {
      event_id: eventId,
      processed_at: new Date().toISOString(),
      purchase_id: purchaseId,
    };
    fs.writeFileSync(PROCESSED_EVENTS_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    logger.warn({ err, eventId }, "[stripe-webhook] failed to persist processed event ID (non-fatal)");
  }
}

function isEventAlreadyProcessed(eventId: string): boolean {
  const store = readProcessedEvents();
  return eventId in store;
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
    if (isEventAlreadyProcessed(event.id)) {
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

      const record: TokenRecord = {
        token,
        kit_id: kitId,
        buyer_email: buyerEmail,
        buyer_name: buyerName,
        purchase_id: purchaseId,
        created_at: createdAt.toISOString(),
        expires_at: expiresAt.toISOString(),
      };

      try {
        const store = readTokenStore();
        store[token] = record;
        writeTokenStore(store);
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
      markEventProcessed(event.id, purchaseId);
    }

    res.json({ received: true });
  },
);

export default router;
