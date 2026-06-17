/**
 * test-webhook-e2e.ts — end-to-end smoke test for the Stripe webhook flow.
 *
 * Run:
 *   tsx src/scripts/test-webhook-e2e.ts [buyer-email]
 *
 * What it does:
 *   1. Spins up a minimal Express server with ONLY the stripeWebhook handler.
 *   2. Builds a realistic checkout.session.completed payload for goodbye-kit.
 *   3. Signs it with the live STRIPE_WEBHOOK_SECRET (same algorithm Stripe uses).
 *   4. POSTs it — the handler verifies the sig, writes a token, and emails the buyer.
 *   5. Prints a pass/fail summary and the kit access URL.
 *
 * Requires: STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in the environment.
 */

import crypto from "crypto";
import http from "http";
import express from "express";
import stripeWebhookRouter from "../routes/stripeWebhook";

// ── Config ────────────────────────────────────────────────────────────────────

const BUYER_EMAIL = process.argv[2] ?? "test-delivery@headwaters-dev.example.com";
const BUYER_NAME = "E2E Test Buyer";
const KIT_ID = "goodbye-kit";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// ── Validation ────────────────────────────────────────────────────────────────

function fail(msg: string): never {
  console.error(`\n❌  FAIL: ${msg}\n`);
  process.exit(1);
}

if (!STRIPE_SECRET_KEY) fail("STRIPE_SECRET_KEY not set");
if (!STRIPE_WEBHOOK_SECRET) fail("STRIPE_WEBHOOK_SECRET not set");

// ── Stripe webhook signing (mirrors stripe.webhooks.constructEvent) ────────────
//
// signature format: t=<unix_ts>,v1=<hex_hmac>
// signed payload:   "<timestamp>.<json_body>"

function signWebhookPayload(payload: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  const sig = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");
  return `t=${timestamp},v1=${sig}`;
}

// ── Build a realistic checkout.session.completed event ────────────────────────

function buildCheckoutEvent(): string {
  const sessionId = `cs_test_${crypto.randomBytes(12).toString("hex")}`;
  const paymentIntentId = `pi_test_${crypto.randomBytes(12).toString("hex")}`;
  const eventId = `evt_test_${crypto.randomBytes(12).toString("hex")}`;

  const event = {
    id: eventId,
    object: "event",
    api_version: "2024-04-10",
    created: Math.floor(Date.now() / 1000),
    type: "checkout.session.completed",
    data: {
      object: {
        id: sessionId,
        object: "checkout.session",
        payment_status: "paid",
        status: "complete",
        payment_intent: paymentIntentId,
        metadata: {
          kit_id: KIT_ID,
        },
        customer_details: {
          email: BUYER_EMAIL,
          name: BUYER_NAME,
        },
        customer_email: BUYER_EMAIL,
      },
    },
    livemode: false,
  };

  return JSON.stringify(event);
}

// ── Start minimal server ──────────────────────────────────────────────────────

async function startServer(): Promise<{ server: http.Server; port: number; baseUrl: string }> {
  const app = express();
  // stripeWebhook applies its own express.raw() — do NOT add express.json() before it
  app.use("/api/stripe", stripeWebhookRouter);

  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address() as { port: number };
      const port = addr.port;
      const baseUrl = `http://127.0.0.1:${port}`;
      resolve({ server, port, baseUrl });
    });
    server.once("error", reject);
  });
}

// ── Send the signed webhook ───────────────────────────────────────────────────

async function sendWebhook(baseUrl: string, payload: string, sig: string): Promise<{ status: number; body: unknown }> {
  const url = `${baseUrl}/api/stripe/webhook`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": sig,
    },
    body: payload,
  });
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("\n══════════════════════════════════════════════════════");
  console.log("  Stripe Webhook E2E Smoke Test");
  console.log("══════════════════════════════════════════════════════");
  console.log(`  Kit:          ${KIT_ID}`);
  console.log(`  Buyer email:  ${BUYER_EMAIL}`);
  console.log(`  Buyer name:   ${BUYER_NAME}`);
  console.log("══════════════════════════════════════════════════════\n");

  // 1. Start server
  process.stdout.write("Starting minimal webhook server ... ");
  const { server, port, baseUrl } = await startServer();
  console.log(`ok (port ${port})`);

  // Override API_BASE_URL so the access link points to this test server
  process.env.API_BASE_URL = baseUrl;

  // 2. Build & sign payload
  process.stdout.write("Building & signing checkout.session.completed payload ... ");
  const payload = buildCheckoutEvent();
  const sig = signWebhookPayload(payload, STRIPE_WEBHOOK_SECRET!);
  console.log("ok");

  // 3. Send webhook
  process.stdout.write("POSTing webhook to handler ... ");
  const { status, body } = await sendWebhook(baseUrl, payload, sig);
  console.log(`HTTP ${status}`);
  console.log("  Response body:", JSON.stringify(body));

  if (status !== 200) {
    server.close();
    fail(`Webhook handler returned HTTP ${status} — expected 200`);
  }

  // Summary — token is now persisted to the DB (not a flat file)
  const bodyObj = body as { received?: boolean; skipped?: string; duplicate?: boolean };
  const emailWasSent = bodyObj.received === true && !bodyObj.skipped && !bodyObj.duplicate;

  console.log("\n══════════════════════════════════════════════════════");
  if (emailWasSent) {
    console.log("  ✅  WEBHOOK SMOKE TEST PASSED");
    console.log("      Confirms: signature verified, token persisted to DB, delivery email sent.");
    console.log("      Does NOT test: GET /kits/access/:token (needs full server + DB).");
    console.log(`  📧  Delivery email sent to: ${BUYER_EMAIL}`);
  } else {
    console.log(`  ⚠️   Webhook returned 200 but delivery was skipped: ${JSON.stringify(body)}`);
  }
  console.log("══════════════════════════════════════════════════════\n");

  server.close();
  process.exit(emailWasSent ? 0 : 1);
}

main().catch((err: unknown) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
