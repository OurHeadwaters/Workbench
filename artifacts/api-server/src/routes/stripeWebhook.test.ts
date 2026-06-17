/**
 * stripeWebhook.test.ts
 *
 * Tests for POST /stripe/webhook covering:
 *   1. Valid checkout.session.completed event with kit_id → token written, email sent
 *   2. Missing kit_id in metadata → skipped gracefully
 *   3. Bad / missing Stripe signature → 400
 *   4. Duplicate event (event already in stripeProcessedEventsTable) → idempotency guard fires
 *
 * Mocking strategy
 * ─────────────────
 * - @workspace/db: two fakeDb tables — kitTokensTable and stripeProcessedEventsTable
 * - drizzle-orm: fakeDrizzle (eq, etc.)
 * - stripe: class mock so `new Stripe(key)` returns an instance with a
 *   controllable webhooks.constructEvent via vi.hoisted() shared state
 * - ../lib/logger, ../lib/kitsRegistry, ../lib/kitsMailer: plain vi.fn() mocks
 * - fs is NOT mocked — the route no longer uses the filesystem for idempotency
 *   (it was migrated to DB-backed idempotency via stripeProcessedEventsTable).
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ── hoisted shared state (for constructEvent control) ─────────────────────────

const shared = vi.hoisted(() => ({
  /** Returned by stripe.webhooks.constructEvent — set per-test. */
  constructEventResult: null as unknown,
  /** When non-empty, constructEvent throws with this message. */
  constructEventError: "" as string,
}));

// ── mocks ─────────────────────────────────────────────────────────────────────

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

// Stripe class mock.  constructEvent reads shared state at call time so
// per-test control works without any vi.fn() plumbing across the hoisting
// boundary.
vi.mock("stripe", () => ({
  default: class MockStripe {
    webhooks = {
      constructEvent: (..._args: unknown[]) => {
        if (shared.constructEventError) {
          throw new Error(shared.constructEventError);
        }
        return shared.constructEventResult;
      },
    };
    accounts = { create: vi.fn(), retrieve: vi.fn() };
    accountLinks = { create: vi.fn() };
    products = { create: vi.fn() };
    prices = { create: vi.fn() };
  },
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

// ── per-test setup ────────────────────────────────────────────────────────────

beforeEach(() => {
  // Reset Stripe mock state
  shared.constructEventResult = null;
  shared.constructEventError = "";

  // Clear both DB tables
  tables.kitTokensTable.__store.length = 0;
  tables.stripeProcessedEventsTable.__store.length = 0;

  // Reset mock call histories and default return values
  getKitMock.mockReset();
  getKitMock.mockReturnValue(null);

  sendKitDeliveryEmailMock.mockReset();
  sendKitDeliveryEmailMock.mockResolvedValue({ status: "ok" });

  // Ensure env vars present
  process.env.STRIPE_SECRET_KEY = "sk_test_fake";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_fake";
});

// ── harness ───────────────────────────────────────────────────────────────────

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  // Mount BEFORE express.json() — mirrors production registration order.
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
  sig: string,
): Promise<Response> {
  return fetch(`${base}/stripe/webhook`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "stripe-signature": sig,
    },
    body,
  });
}

// ── fixtures ──────────────────────────────────────────────────────────────────

const FAKE_KIT = {
  id: "goodbye-kit",
  name: "Goodbye Kit",
  tagline: "The household transition guide.",
  arcNote: null,
  contentNote: "Your kit includes...",
};

function makeSessionEvent(opts: {
  id?: string;
  kitId?: string | null;
  email?: string | null;
}): object {
  const {
    id = "evt_test_001",
    kitId = "goodbye-kit",
    email = "buyer@example.com",
  } = opts;
  return {
    id,
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_001",
        payment_intent: "pi_test_001",
        metadata: kitId !== null ? { kit_id: kitId } : {},
        customer_details: { email, name: "Test Buyer" },
        customer_email: null,
      },
    },
  };
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe("POST /stripe/webhook — valid event with kit_id", () => {
  it("returns 200 with received: true", async () => {
    shared.constructEventResult = makeSessionEvent({});
    getKitMock.mockReturnValue(FAKE_KIT);

    const h = await startHarness();
    try {
      const r = await postWebhook(h.base, JSON.stringify({}), "t=1,v1=abc");
      expect(r.status).toBe(200);
      const body = (await r.json()) as { received?: boolean };
      expect(body.received).toBe(true);
    } finally {
      await h.close();
    }
  });

  it("writes a token row to the DB", async () => {
    shared.constructEventResult = makeSessionEvent({});
    getKitMock.mockReturnValue(FAKE_KIT);

    const h = await startHarness();
    try {
      await postWebhook(h.base, JSON.stringify({}), "t=1,v1=abc");
      expect(tables.kitTokensTable.__store).toHaveLength(1);
      const row = tables.kitTokensTable.__store[0];
      expect(row.kitId).toBe("goodbye-kit");
      expect(row.buyerEmail).toBe("buyer@example.com");
      expect(row.purchaseId).toBe("pi_test_001");
      expect(typeof row.token).toBe("string");
      expect((row.token as string).length).toBe(64);
    } finally {
      await h.close();
    }
  });

  it("calls sendKitDeliveryEmail with the buyer and kit details", async () => {
    shared.constructEventResult = makeSessionEvent({});
    getKitMock.mockReturnValue(FAKE_KIT);

    const h = await startHarness();
    try {
      await postWebhook(h.base, JSON.stringify({}), "t=1,v1=abc");
      expect(sendKitDeliveryEmailMock).toHaveBeenCalledOnce();
      const callArgs = sendKitDeliveryEmailMock.mock.calls[0][0] as {
        to: string;
        kit: { id: string };
        buyerName: string;
      };
      expect(callArgs.to).toBe("buyer@example.com");
      expect(callArgs.kit).toMatchObject({ id: "goodbye-kit" });
      expect(callArgs.buyerName).toBe("Test Buyer");
    } finally {
      await h.close();
    }
  });
});

describe("POST /stripe/webhook — missing kit_id in metadata", () => {
  it("returns 200 with skipped reason", async () => {
    shared.constructEventResult = makeSessionEvent({ kitId: null });

    const h = await startHarness();
    try {
      const r = await postWebhook(h.base, JSON.stringify({}), "t=1,v1=abc");
      expect(r.status).toBe(200);
      const body = (await r.json()) as {
        received?: boolean;
        skipped?: string;
      };
      expect(body.received).toBe(true);
      expect(body.skipped).toBe("no kit_id in metadata");
    } finally {
      await h.close();
    }
  });

  it("does not write a token row to the DB", async () => {
    shared.constructEventResult = makeSessionEvent({ kitId: null });

    const h = await startHarness();
    try {
      await postWebhook(h.base, JSON.stringify({}), "t=1,v1=abc");
      expect(tables.kitTokensTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });

  it("does not call sendKitDeliveryEmail", async () => {
    shared.constructEventResult = makeSessionEvent({ kitId: null });

    const h = await startHarness();
    try {
      await postWebhook(h.base, JSON.stringify({}), "t=1,v1=abc");
      expect(sendKitDeliveryEmailMock).not.toHaveBeenCalled();
    } finally {
      await h.close();
    }
  });
});

describe("POST /stripe/webhook — bad signature", () => {
  it("returns 400", async () => {
    shared.constructEventError =
      "No signatures found matching the expected signature for payload";

    const h = await startHarness();
    try {
      const r = await postWebhook(h.base, JSON.stringify({}), "t=bad,v1=bad");
      expect(r.status).toBe(400);
    } finally {
      await h.close();
    }
  });

  it("returns an error message in the body", async () => {
    shared.constructEventError =
      "No signatures found matching the expected signature for payload";

    const h = await startHarness();
    try {
      const r = await postWebhook(h.base, JSON.stringify({}), "t=bad,v1=bad");
      const body = (await r.json()) as { error?: string };
      expect(body.error).toMatch(/Webhook signature verification failed/);
    } finally {
      await h.close();
    }
  });

  it("does not write a token row to the DB", async () => {
    shared.constructEventError = "signature mismatch";

    const h = await startHarness();
    try {
      await postWebhook(h.base, JSON.stringify({}), "t=bad,v1=bad");
      expect(tables.kitTokensTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });

  it("returns 400 when stripe-signature header is missing", async () => {
    const h = await startHarness();
    try {
      const r = await fetch(`${h.base}/stripe/webhook`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      });
      expect(r.status).toBe(400);
      const body = (await r.json()) as { error?: string };
      expect(body.error).toBe("Missing stripe-signature header");
    } finally {
      await h.close();
    }
  });
});

describe("POST /stripe/webhook — duplicate event (idempotency guard)", () => {
  it("returns 200 with duplicate: true for a replayed event", async () => {
    const eventId = "evt_dup_guard_1";
    // Pre-seed the DB so the route treats this event as already processed.
    tables.stripeProcessedEventsTable.__store.push({
      eventId,
      processedAt: new Date(),
      purchaseId: "pi_original_1",
    });
    shared.constructEventResult = makeSessionEvent({ id: eventId });
    getKitMock.mockReturnValue(FAKE_KIT);

    const h = await startHarness();
    try {
      const r = await postWebhook(h.base, JSON.stringify({}), "t=1,v1=abc");
      expect(r.status).toBe(200);
      const body = (await r.json()) as {
        received?: boolean;
        duplicate?: boolean;
      };
      expect(body.received).toBe(true);
      expect(body.duplicate).toBe(true);
    } finally {
      await h.close();
    }
  });

  it("does not write a second token row for a replayed event", async () => {
    const eventId = "evt_dup_guard_2";
    tables.stripeProcessedEventsTable.__store.push({
      eventId,
      processedAt: new Date(),
      purchaseId: "pi_original_2",
    });
    shared.constructEventResult = makeSessionEvent({ id: eventId });
    getKitMock.mockReturnValue(FAKE_KIT);

    const h = await startHarness();
    try {
      await postWebhook(h.base, JSON.stringify({}), "t=1,v1=abc");
      expect(tables.kitTokensTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });

  it("does not call sendKitDeliveryEmail for a replayed event", async () => {
    const eventId = "evt_dup_guard_3";
    tables.stripeProcessedEventsTable.__store.push({
      eventId,
      processedAt: new Date(),
      purchaseId: "pi_original_3",
    });
    shared.constructEventResult = makeSessionEvent({ id: eventId });
    getKitMock.mockReturnValue(FAKE_KIT);

    const h = await startHarness();
    try {
      await postWebhook(h.base, JSON.stringify({}), "t=1,v1=abc");
      expect(sendKitDeliveryEmailMock).not.toHaveBeenCalled();
    } finally {
      await h.close();
    }
  });

  it("marks an event processed in the DB after the first successful delivery", async () => {
    const eventId = "evt_new_for_processing";
    shared.constructEventResult = makeSessionEvent({ id: eventId });
    getKitMock.mockReturnValue(FAKE_KIT);

    const h = await startHarness();
    try {
      await postWebhook(h.base, JSON.stringify({}), "t=1,v1=abc");
      const processed = tables.stripeProcessedEventsTable.__store.find(
        (r) => r.eventId === eventId,
      );
      expect(processed).toBeDefined();
      expect(processed?.purchaseId).toBe("pi_test_001");
    } finally {
      await h.close();
    }
  });
});
