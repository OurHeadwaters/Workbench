/**
 * stripeWebhook.test.ts
 *
 * Tests for POST /stripe/webhook (stripeWebhook.ts).
 *
 * Strategy: rather than mocking stripe.webhooks.constructEvent, we generate
 * real HMAC-SHA256 Stripe signatures so the genuine SDK verification passes.
 * This exercises the actual signature-check code path and avoids vi.mock /
 * vi.hoisted propagation issues with the Stripe constructor.
 *
 * Idempotency: the implementation uses stripeProcessedEventsTable (Postgres).
 * The fakeDb mock is extended with that table so duplicate-event tests work
 * by making two real HTTP calls with the same event ID.
 *
 * Note on GET /kits/access/:token coverage:
 *   Token validation (valid → 200, expired → 410, unknown → 404) is already
 *   covered by the "GET /kits/access/:token — token validation" suite in
 *   kits.test.ts. Those tests are not duplicated here.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Server } from "http";
import { createServer } from "http";
import type { AddressInfo } from "net";
import crypto from "crypto";

// ── DB mock ───────────────────────────────────────────────────────────────────

vi.mock("@workspace/db", async () => {
  const { makeTable, makeFakeDb } = await import("../test/fakeDb");

  const kitTokensTable = makeTable({
    name: "kit_tokens",
    pk: ["token"],
    columns: [
      "token",
      "kitId",
      "buyerEmail",
      "buyerName",
      "purchaseId",
      "createdAt",
      "expiresAt",
    ],
  });

  const stripeProcessedEventsTable = makeTable({
    name: "stripe_processed_events",
    pk: ["eventId"],
    columns: ["eventId", "processedAt", "purchaseId"],
  });

  return { db: makeFakeDb(), kitTokensTable, stripeProcessedEventsTable };
});

vi.mock("drizzle-orm", async () => {
  const { fakeDrizzle } = await import("../test/fakeDb");
  return fakeDrizzle;
});

vi.mock("../lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock("../lib/kitsRegistry", () => ({
  getKit: vi.fn().mockReturnValue(null),
  KITS: {},
}));

vi.mock("../lib/kitsMailer", () => ({
  sendKitDeliveryEmail: vi.fn().mockResolvedValue({ status: "ok" }),
}));

// ── imports (after mocks) ─────────────────────────────────────────────────────

import express from "express";
import stripeWebhookRouter from "./stripeWebhook";
import * as dbModule from "@workspace/db";
import type { FakeTable } from "../test/fakeDb";
import * as kitsRegistryModule from "../lib/kitsRegistry";
import * as kitsMailerModule from "../lib/kitsMailer";

const tables = dbModule as unknown as {
  kitTokensTable: FakeTable;
  stripeProcessedEventsTable: FakeTable;
};
const getKitMock = kitsRegistryModule.getKit as ReturnType<typeof vi.fn>;
const sendKitDeliveryEmailMock =
  kitsMailerModule.sendKitDeliveryEmail as ReturnType<typeof vi.fn>;

// ── Stripe signing helpers ────────────────────────────────────────────────────
//
// Reproduces the HMAC-SHA256 signing that Stripe uses so that the real
// stripe.webhooks.constructEvent() accepts the request without being mocked.
//
//   secret format: "whsec_<base64>" — same as Stripe dashboard provides
//   signing algo  : HMAC-SHA256( "${timestamp}.${payload}", secret )
//   header format : "t=${timestamp},v1=${signature}"

const TEST_WEBHOOK_SECRET =
  "whsec_dGVzdHNlY3JldGZvcmhlYWR3YXRlcnN3ZWJob29r";

function makeStripeSignature(payload: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  const sig = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");
  return `t=${timestamp},v1=${sig}`;
}

function makeStripeSignatureWithWrongKey(payload: string): string {
  const wrongSecret = "whsec_d3Jvbmdzb2Zhcndyb25nc2VjcmV0d3Jvbmc=";
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  const sig = crypto
    .createHmac("sha256", wrongSecret)
    .update(signedPayload)
    .digest("hex");
  return `t=${timestamp},v1=${sig}`;
}

// ── lifecycle ─────────────────────────────────────────────────────────────────

let savedWebhookSecret: string | undefined;
let savedStripeKey: string | undefined;

beforeEach(() => {
  savedWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  savedStripeKey = process.env.STRIPE_SECRET_KEY;
  process.env.STRIPE_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;
  process.env.STRIPE_SECRET_KEY = "sk_test_headwaters";

  tables.kitTokensTable.__store.length = 0;
  tables.stripeProcessedEventsTable.__store.length = 0;
  getKitMock.mockClear();
  getKitMock.mockReturnValue(null);
  sendKitDeliveryEmailMock.mockClear();
  sendKitDeliveryEmailMock.mockResolvedValue({ status: "ok" });
});

afterEach(() => {
  if (savedWebhookSecret === undefined) {
    delete process.env.STRIPE_WEBHOOK_SECRET;
  } else {
    process.env.STRIPE_WEBHOOK_SECRET = savedWebhookSecret;
  }
  if (savedStripeKey === undefined) {
    delete process.env.STRIPE_SECRET_KEY;
  } else {
    process.env.STRIPE_SECRET_KEY = savedStripeKey;
  }
});

// ── test harness ──────────────────────────────────────────────────────────────

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  // Mount BEFORE express.json() so express.raw() in the route sees the Buffer
  app.use("/stripe", stripeWebhookRouter);
  app.use(express.json());
  const srv: Server = createServer(app);
  await new Promise<void>((resolve) => srv.listen(0, "127.0.0.1", resolve));
  const addr = srv.address() as AddressInfo;
  return {
    base: `http://127.0.0.1:${addr.port}`,
    close: () =>
      new Promise<void>((resolve, reject) =>
        srv.close((err) => (err ? reject(err) : resolve())),
      ),
  };
}

function postWebhook(
  base: string,
  body: string,
  sig?: string,
): Promise<Response> {
  return fetch(`${base}/stripe/webhook`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(sig !== undefined ? { "stripe-signature": sig } : {}),
    },
    body,
  });
}

// ── fixtures ──────────────────────────────────────────────────────────────────

const FAKE_KIT = {
  id: "economy-kit",
  title: "Economy Kit",
  description: "A test kit",
  handouts: {},
};

function makeCheckoutPayload(opts?: {
  id?: string;
  kitId?: string | null;
  email?: string | null;
  name?: string | null;
}): string {
  const kitId = opts?.kitId !== undefined ? opts.kitId : "economy-kit";
  const metadata: Record<string, string> = {};
  if (kitId) metadata.kit_id = kitId;

  return JSON.stringify({
    id: opts?.id ?? "evt_test_001",
    object: "event",
    api_version: "2023-10-16",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_001",
        object: "checkout.session",
        payment_intent: "pi_test_001",
        metadata,
        customer_details: {
          email:
            opts?.email !== undefined ? opts.email : "buyer@example.com",
          name: opts?.name !== undefined ? opts.name : "Test Buyer",
        },
        customer_email: null,
      },
    },
  });
}

// ── tests: configuration guards ───────────────────────────────────────────────

describe("POST /stripe/webhook — configuration guards", () => {
  it("returns 503 when STRIPE_WEBHOOK_SECRET is not set", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const payload = makeCheckoutPayload();
    const h = await startHarness();
    try {
      const r = await postWebhook(
        h.base,
        payload,
        makeStripeSignature(payload, TEST_WEBHOOK_SECRET),
      );
      expect(r.status).toBe(503);
    } finally {
      await h.close();
    }
  });

  it("returns 503 when STRIPE_SECRET_KEY is not set", async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const payload = makeCheckoutPayload();
    const h = await startHarness();
    try {
      const r = await postWebhook(
        h.base,
        payload,
        makeStripeSignature(payload, TEST_WEBHOOK_SECRET),
      );
      expect(r.status).toBe(503);
    } finally {
      await h.close();
    }
  });
});

// ── tests: signature verification ─────────────────────────────────────────────

describe("POST /stripe/webhook — signature verification", () => {
  it("returns 400 when the stripe-signature header is missing", async () => {
    const h = await startHarness();
    try {
      const r = await postWebhook(h.base, makeCheckoutPayload());
      expect(r.status).toBe(400);
      const body = (await r.json()) as { error?: string };
      expect(body.error).toContain("Missing stripe-signature");
    } finally {
      await h.close();
    }
  });

  it("returns 400 when the signature does not match (wrong key)", async () => {
    const payload = makeCheckoutPayload();
    const h = await startHarness();
    try {
      const r = await postWebhook(
        h.base,
        payload,
        makeStripeSignatureWithWrongKey(payload),
      );
      expect(r.status).toBe(400);
      const body = (await r.json()) as { error?: string };
      expect(body.error).toContain("signature verification failed");
    } finally {
      await h.close();
    }
  });

  it("returns 200 when the signature is valid", async () => {
    getKitMock.mockReturnValue(FAKE_KIT);
    const payload = makeCheckoutPayload({ id: "evt_sig_ok" });
    const h = await startHarness();
    try {
      const r = await postWebhook(
        h.base,
        payload,
        makeStripeSignature(payload, TEST_WEBHOOK_SECRET),
      );
      expect(r.status).toBe(200);
    } finally {
      await h.close();
    }
  });
});

// ── tests: checkout.session.completed dispatch ────────────────────────────────

describe("POST /stripe/webhook — checkout.session.completed", () => {
  it("writes a token row to kit_tokens for a complete, valid event", async () => {
    getKitMock.mockReturnValue(FAKE_KIT);
    const payload = makeCheckoutPayload({ id: "evt_complete_001" });
    const h = await startHarness();
    try {
      const r = await postWebhook(
        h.base,
        payload,
        makeStripeSignature(payload, TEST_WEBHOOK_SECRET),
      );
      expect(r.status).toBe(200);
      const body = (await r.json()) as Record<string, unknown>;
      expect(body, `response body was: ${JSON.stringify(body)}`).toEqual({
        received: true,
      });
      expect(sendKitDeliveryEmailMock).toHaveBeenCalledTimes(1);

      expect(tables.kitTokensTable.__store).toHaveLength(1);
      const row = tables.kitTokensTable.__store[0];
      expect(row.kitId).toBe("economy-kit");
      expect(row.buyerEmail).toBe("buyer@example.com");
      expect(row.buyerName).toBe("Test Buyer");
      expect(row.purchaseId).toBe("pi_test_001");
      expect(typeof row.token).toBe("string");
      expect((row.token as string).length).toBe(64);
      expect(row.expiresAt).toBeInstanceOf(Date);
    } finally {
      await h.close();
    }
  });

  it("skips delivery and returns skipped reason when kit_id is absent from metadata", async () => {
    const payload = makeCheckoutPayload({
      id: "evt_nokitid_001",
      kitId: null,
    });
    const h = await startHarness();
    try {
      const r = await postWebhook(
        h.base,
        payload,
        makeStripeSignature(payload, TEST_WEBHOOK_SECRET),
      );
      expect(r.status).toBe(200);
      const body = (await r.json()) as {
        received?: boolean;
        skipped?: string;
      };
      expect(body.received).toBe(true);
      expect(body.skipped).toMatch(/kit_id/);
      expect(tables.kitTokensTable.__store).toHaveLength(0);
      expect(sendKitDeliveryEmailMock).not.toHaveBeenCalled();
    } finally {
      await h.close();
    }
  });

  it("skips delivery when customer email is absent", async () => {
    getKitMock.mockReturnValue(FAKE_KIT);
    const payload = makeCheckoutPayload({
      id: "evt_noemail_001",
      email: null,
    });
    const h = await startHarness();
    try {
      const r = await postWebhook(
        h.base,
        payload,
        makeStripeSignature(payload, TEST_WEBHOOK_SECRET),
      );
      expect(r.status).toBe(200);
      const body = (await r.json()) as {
        received?: boolean;
        skipped?: string;
      };
      expect(body.received).toBe(true);
      expect(body.skipped).toMatch(/email/);
      expect(tables.kitTokensTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });

  it("skips delivery when the kit_id is not in the registry", async () => {
    const payload = makeCheckoutPayload({
      id: "evt_badkit_001",
      kitId: "kit-does-not-exist",
    });
    const h = await startHarness();
    try {
      const r = await postWebhook(
        h.base,
        payload,
        makeStripeSignature(payload, TEST_WEBHOOK_SECRET),
      );
      expect(r.status).toBe(200);
      const body = (await r.json()) as {
        received?: boolean;
        skipped?: string;
      };
      expect(body.received).toBe(true);
      expect(body.skipped).toMatch(/kit_id/);
      expect(tables.kitTokensTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });

  it("skips re-delivery and returns duplicate:true when the same event is replayed", async () => {
    getKitMock.mockReturnValue(FAKE_KIT);
    const payload = makeCheckoutPayload({ id: "evt_dup_001" });

    const h = await startHarness();
    try {
      const r1 = await postWebhook(
        h.base,
        payload,
        makeStripeSignature(payload, TEST_WEBHOOK_SECRET),
      );
      expect(r1.status).toBe(200);
      expect(tables.kitTokensTable.__store).toHaveLength(1);

      // Stripe retries use a fresh signature (new timestamp) but same event ID
      const r2 = await postWebhook(
        h.base,
        payload,
        makeStripeSignature(payload, TEST_WEBHOOK_SECRET),
      );
      expect(r2.status).toBe(200);
      const body = (await r2.json()) as {
        received?: boolean;
        duplicate?: boolean;
      };
      expect(body.duplicate).toBe(true);

      // Token written only once, email sent only once
      expect(tables.kitTokensTable.__store).toHaveLength(1);
      expect(sendKitDeliveryEmailMock).toHaveBeenCalledTimes(1);
    } finally {
      await h.close();
    }
  });
});
