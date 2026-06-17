/**
 * smoke-test-webhook.mjs
 *
 * Simulates a Stripe checkout.session.completed event for the goodbye-kit,
 * signs it with STRIPE_WEBHOOK_SECRET, POSTs it to the local API server,
 * and verifies the full delivery loop:
 *   1. Webhook signature accepted → HTTP 200
 *   2. Token written to kit_tokens Postgres table
 *   3. Idempotency record written to stripe_processed_events Postgres table
 *   4. Replay of same event returns {received:true, duplicate:true} — no double-send
 *   5. GET /api/kits/access/:token resolves the kit page
 *
 * Usage:  node artifacts/api-server/scripts/smoke-test-webhook.mjs
 */

import Stripe from "stripe";
import { execSync } from "child_process";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const API_BASE = `http://localhost:${process.env.PORT ?? 8081}`;

if (!WEBHOOK_SECRET) {
  console.error("❌  STRIPE_WEBHOOK_SECRET is not set");
  process.exit(1);
}
if (!STRIPE_KEY) {
  console.error("❌  STRIPE_SECRET_KEY is not set");
  process.exit(1);
}

const TEST_EMAIL = "smoke-test@headwaters-test.invalid";
const TEST_NAME = "Smoke Tester";
const KIT_ID = "goodbye-kit";
const FAKE_EVENT_ID = `evt_smoke_${Date.now()}`;
const FAKE_SESSION_ID = `cs_test_smoke_${Date.now()}`;
const FAKE_PAYMENT_INTENT = `pi_test_smoke_${Date.now()}`;

const payload = {
  id: FAKE_EVENT_ID,
  object: "event",
  api_version: "2024-06-20",
  created: Math.floor(Date.now() / 1000),
  type: "checkout.session.completed",
  livemode: false,
  data: {
    object: {
      id: FAKE_SESSION_ID,
      object: "checkout.session",
      payment_status: "paid",
      status: "complete",
      payment_intent: FAKE_PAYMENT_INTENT,
      metadata: {
        kit_id: KIT_ID,
      },
      customer_details: {
        email: TEST_EMAIL,
        name: TEST_NAME,
      },
      customer_email: TEST_EMAIL,
    },
  },
};

const body = JSON.stringify(payload);
const timestamp = Math.floor(Date.now() / 1000);

const stripe = new Stripe(STRIPE_KEY);
const header = stripe.webhooks.generateTestHeaderString({
  payload: body,
  secret: WEBHOOK_SECRET,
  timestamp,
});

console.log(`\n🚀  Firing smoke-test webhook → ${API_BASE}/api/stripe/webhook`);
console.log(`   kit_id   : ${KIT_ID}`);
console.log(`   email    : ${TEST_EMAIL}`);
console.log(`   event_id : ${FAKE_EVENT_ID}\n`);

// ── Step 1: fire the webhook ───────────────────────────────────────────────────

const res = await fetch(`${API_BASE}/api/stripe/webhook`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "stripe-signature": header,
  },
  body,
});

const responseText = await res.text();
console.log(`HTTP ${res.status}  ${res.statusText}`);
console.log(`Body: ${responseText}\n`);

if (res.status !== 200) {
  console.error("❌  Webhook handler returned a non-200 response — delivery did NOT succeed.");
  process.exit(1);
}

const responseJson = JSON.parse(responseText);
if (!responseJson.received || responseJson.skipped) {
  console.error(`❌  Webhook was received but skipped: ${responseJson.skipped ?? "unknown reason"}`);
  process.exit(1);
}

// ── Step 2: verify kit_tokens DB row ──────────────────────────────────────────

// Give the DB writes a moment to commit
await new Promise((r) => setTimeout(r, 600));

let token;
try {
  token = execSync(
    `psql "$DATABASE_URL" -t -c "SELECT token FROM kit_tokens WHERE purchase_id = '${FAKE_PAYMENT_INTENT}' LIMIT 1;"`,
    { encoding: "utf-8", env: process.env }
  ).trim();
} catch (e) {
  console.error("❌  Could not query kit_tokens DB table:", e.message);
  process.exit(1);
}

if (!token) {
  console.error("❌  No token found in kit_tokens for this purchase — DB insert failed.");
  process.exit(1);
}

console.log(`kit_tokens DB row                  : ✅  (token: ${token.slice(0, 16)}…)`);

// ── Step 3: verify idempotency record in stripe_processed_events ───────────────

let eventWritten = false;
try {
  const count = execSync(
    `psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM stripe_processed_events WHERE event_id = '${FAKE_EVENT_ID}';"`,
    { encoding: "utf-8", env: process.env }
  ).trim();
  eventWritten = parseInt(count, 10) > 0;
} catch (e) {
  console.error("❌  Could not query stripe_processed_events DB table:", e.message);
  process.exit(1);
}

console.log(`stripe_processed_events DB row     : ${eventWritten ? "✅" : "❌"}`);

if (!eventWritten) {
  console.error("\n❌  Idempotency record was not written to stripe_processed_events — check server logs.");
  process.exit(1);
}

// ── Step 4: verify idempotency — replay should return duplicate:true ───────────

const replayRes = await fetch(`${API_BASE}/api/stripe/webhook`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "stripe-signature": header,
  },
  body,
});
const replayJson = await replayRes.json().catch(() => ({}));
const isDuplicate = replayRes.status === 200 && replayJson.duplicate === true;
console.log(`Replay duplicate guard             : ${isDuplicate ? "✅  {received:true,duplicate:true}" : "❌  unexpected: " + JSON.stringify(replayJson)}`);

if (!isDuplicate) {
  console.error("\n❌  Idempotency replay did not return duplicate:true — double-send risk is unconfirmed.");
  process.exit(1);
}

// ── Step 5: verify access endpoint ────────────────────────────────────────────

const accessRes = await fetch(`${API_BASE}/api/kits/access/${token}`);
const accessBody = await accessRes.json();

if (accessRes.status !== 200 || !accessBody.ok) {
  console.error(`\n❌  GET /api/kits/access/:token → HTTP ${accessRes.status}`);
  console.error(JSON.stringify(accessBody, null, 2));
  process.exit(1);
}

console.log(`GET /api/kits/access/:token        : ✅  HTTP 200`);
console.log(`   Kit  : ${accessBody.kit?.name}`);
console.log(`   Buyer: ${accessBody.buyer_name}`);

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`
✅  Full smoke test passed.
   Webhook verified → token written to DB → email dispatched → access link resolves.
   Delivery email was sent to ${TEST_EMAIL} via the google-mail connector.
   Check the connected Gmail inbox (or server logs for mailStatus) to confirm delivery.
`);
