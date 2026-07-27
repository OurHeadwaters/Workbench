import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ── mocks must be hoisted before kits.ts is imported ─────────────────────────

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
  const kitsTable = makeTable({
    name: "kits",
    pk: ["id"],
    columns: [
      "id",
      "ownerId",
      "title",
      "description",
      "priceCents",
      "contentOutline",
      "status",
      "paymentRails",
      "stripeAccountId",
    ],
  });
  const practitionerApplicationsTable = makeTable({
    name: "practitioner_applications",
    pk: ["id"],
    columns: ["id", "contactEmail", "status", "stripeAccountId", "clerkUserId"],
  });
  const kitDeliveryFailuresTable = makeTable({
    name: "kit_delivery_failures",
    pk: ["id"],
    columns: ["id", "buyerEmail", "kitId", "purchaseId", "error", "createdAt", "resolvedAt"],
  });
  return { db: makeFakeDb(), kitTokensTable, kitsTable, practitionerApplicationsTable, kitDeliveryFailuresTable };
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

vi.mock("../lib/kitsMailer", async () => {
  // Keep verifyResendToken real so we exercise the actual HMAC logic in tests.
  const actual = await vi.importActual<typeof import("../lib/kitsMailer")>(
    "../lib/kitsMailer",
  );
  return {
    ...actual,
    sendKitDeliveryEmail: vi.fn().mockResolvedValue({ status: "ok" }),
    sendKitDeliveryFailureAlert: vi.fn().mockResolvedValue(undefined),
  };
});

vi.mock("../lib/codetryFilter", () => ({
  runCodetryFilter: vi.fn().mockResolvedValue([]),
}));

vi.mock("../lib/kitAuth", () => ({
  requireKitOwnerAuth: vi.fn(
    (_req: unknown, _res: unknown, next: () => void) => next(),
  ),
  requireFounderOnlyAuth: vi.fn(
    (_req: unknown, _res: unknown, next: () => void) => next(),
  ),
  FOUNDER_OWNER_ID: "founder",
}));

vi.mock("@workspace/integrations-anthropic-ai", () => ({
  anthropic: { messages: { create: vi.fn() } },
}));

vi.mock("@clerk/express", () => ({
  clerkClient: { users: { getUser: vi.fn() } },
}));

vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(() => ({
    accounts: { create: vi.fn(), retrieve: vi.fn() },
    accountLinks: { create: vi.fn() },
    products: { create: vi.fn() },
    prices: { create: vi.fn() },
  })),
}));

import express from "express";
import kitsRouter, { __clearAccessRateLimiter, __clearResendRateLimiter } from "./kits";
import * as dbModule from "@workspace/db";
import type { FakeTable } from "../test/fakeDb";
import * as kitsRegistryModule from "../lib/kitsRegistry";
import * as kitsMailerModule from "../lib/kitsMailer";

const tables = dbModule as unknown as { kitTokensTable: FakeTable; kitDeliveryFailuresTable: FakeTable };
const getKitMock = kitsRegistryModule.getKit as ReturnType<typeof vi.fn>;
const sendKitDeliveryEmailMock = kitsMailerModule.sendKitDeliveryEmail as ReturnType<typeof vi.fn>;
const sendKitDeliveryFailureAlertMock = kitsMailerModule.sendKitDeliveryFailureAlert as ReturnType<typeof vi.fn>;

// ── harness ───────────────────────────────────────────────────────────────────
//
// trust proxy: 1 lets the test control req.ip via the X-Forwarded-For header,
// which is how the rate limiter distinguishes between different callers.

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(opts: { rawBody?: boolean } = {}): Promise<Harness> {
  const app = express();
  app.set("trust proxy", 1);
  if (opts.rawBody) {
    // Mirror app.ts: attach rawBody buffer so Zaprite HMAC verification works.
    app.use(
      express.json({
        verify: (_req, _res, buf) => {
          (_req as express.Request & { rawBody?: Buffer }).rawBody = buf;
        },
      }),
    );
  } else {
    app.use(express.json());
  }
  app.use("/kits", kitsRouter);
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

function getAccess(base: string, ip: string): Promise<Response> {
  return fetch(`${base}/kits/access/sometoken`, {
    headers: { "x-forwarded-for": ip },
  });
}

beforeEach(() => {
  __clearAccessRateLimiter();
  __clearResendRateLimiter();
  tables.kitTokensTable.__store.length = 0;
  tables.kitDeliveryFailuresTable.__store.length = 0;
  getKitMock.mockReturnValue(null);
  sendKitDeliveryFailureAlertMock.mockReset();
  sendKitDeliveryFailureAlertMock.mockResolvedValue(undefined);
});

// ── tests ─────────────────────────────────────────────────────────────────────

describe("GET /kits/access/:token — rate limiter", () => {
  it("allows the first 20 requests from the same IP", async () => {
    const h = await startHarness();
    try {
      const statuses: number[] = [];
      for (let i = 0; i < 20; i++) {
        const r = await getAccess(h.base, "10.0.0.1");
        statuses.push(r.status);
      }
      expect(statuses.every((s) => s !== 429)).toBe(true);
    } finally {
      await h.close();
    }
  });

  it("returns 429 on the 21st request from the same IP", async () => {
    const h = await startHarness();
    try {
      for (let i = 0; i < 20; i++) {
        await getAccess(h.base, "10.0.0.1");
      }
      const r = await getAccess(h.base, "10.0.0.1");
      expect(r.status).toBe(429);
    } finally {
      await h.close();
    }
  });

  it("includes the expected error message in the 429 body", async () => {
    const h = await startHarness();
    try {
      for (let i = 0; i < 20; i++) {
        await getAccess(h.base, "10.0.0.1");
      }
      const r = await getAccess(h.base, "10.0.0.1");
      const body = (await r.json()) as { error?: string };
      expect(body.error).toBe(
        "Too many access attempts — please try again later.",
      );
    } finally {
      await h.close();
    }
  });

  it("does not rate-limit a separate IP when another IP has exhausted its quota", async () => {
    const h = await startHarness();
    try {
      for (let i = 0; i < 21; i++) {
        await getAccess(h.base, "10.0.0.1");
      }
      const ipAStatus = (await getAccess(h.base, "10.0.0.1")).status;
      expect(ipAStatus).toBe(429);

      const ipBStatus = (await getAccess(h.base, "10.0.0.2")).status;
      expect(ipBStatus).not.toBe(429);
    } finally {
      await h.close();
    }
  });
});

// ── POST /kits/resend — rate limiter ──────────────────────────────────────────

function postResend(base: string, ip: string): Promise<Response> {
  return fetch(`${base}/kits/resend`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify({ email: "test@example.com" }),
  });
}

describe("POST /kits/resend — rate limiter", () => {
  it("allows the first 5 requests from the same IP", async () => {
    const h = await startHarness();
    try {
      const statuses: number[] = [];
      for (let i = 0; i < 5; i++) {
        const r = await postResend(h.base, "10.0.1.1");
        statuses.push(r.status);
      }
      expect(statuses.every((s) => s !== 429)).toBe(true);
    } finally {
      await h.close();
    }
  });

  it("returns 429 on the 6th request from the same IP", async () => {
    const h = await startHarness();
    try {
      for (let i = 0; i < 5; i++) {
        await postResend(h.base, "10.0.1.1");
      }
      const r = await postResend(h.base, "10.0.1.1");
      expect(r.status).toBe(429);
    } finally {
      await h.close();
    }
  });

  it("includes the expected error message in the 429 body", async () => {
    const h = await startHarness();
    try {
      for (let i = 0; i < 5; i++) {
        await postResend(h.base, "10.0.1.1");
      }
      const r = await postResend(h.base, "10.0.1.1");
      const body = (await r.json()) as { error?: string };
      expect(body.error).toBe(
        "Too many resend requests — please try again later.",
      );
    } finally {
      await h.close();
    }
  });

  it("does not rate-limit a separate IP when another IP has exhausted its quota", async () => {
    const h = await startHarness();
    try {
      for (let i = 0; i < 6; i++) {
        await postResend(h.base, "10.0.1.1");
      }
      const ipAStatus = (await postResend(h.base, "10.0.1.1")).status;
      expect(ipAStatus).toBe(429);

      const ipBStatus = (await postResend(h.base, "10.0.1.2")).status;
      expect(ipBStatus).not.toBe(429);
    } finally {
      await h.close();
    }
  });
});

// ── GET /kits/access/:token — token validation ────────────────────────────────

const FAKE_KIT = {
  id: "economy-kit",
  title: "Economy Kit",
  description: "A test kit",
  handouts: {},
};

const VALID_TOKEN = "a".repeat(64);
const EXPIRED_TOKEN = "b".repeat(64);
const UNKNOWN_TOKEN = "c".repeat(64);

function accessToken(base: string, token: string): Promise<Response> {
  return fetch(`${base}/kits/access/${token}`, {
    headers: { "x-forwarded-for": "10.1.0.1" },
  });
}

describe("GET /kits/access/:token — token validation", () => {
  it("returns 200 with kit data for a valid, unexpired token", async () => {
    const now = new Date();
    const future = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    tables.kitTokensTable.__store.push({
      token: VALID_TOKEN,
      kitId: FAKE_KIT.id,
      buyerEmail: "buyer@example.com",
      buyerName: "Test Buyer",
      purchaseId: "purchase-001",
      createdAt: now,
      expiresAt: future,
    });
    getKitMock.mockReturnValue(FAKE_KIT);

    const h = await startHarness();
    try {
      const r = await accessToken(h.base, VALID_TOKEN);
      expect(r.status).toBe(200);
      const body = (await r.json()) as {
        ok?: boolean;
        kit?: { id: string };
        buyer_name?: string;
        purchase_id?: string;
        expires_at?: string;
      };
      expect(body.ok).toBe(true);
      expect(body.kit).toMatchObject({ id: FAKE_KIT.id });
      expect(body.buyer_name).toBe("Test Buyer");
      expect(body.purchase_id).toBe("purchase-001");
      expect(typeof body.expires_at).toBe("string");
    } finally {
      await h.close();
    }
  });

  it("returns 410 for a token whose expires_at is in the past", async () => {
    const past = new Date(Date.now() - 1000);
    tables.kitTokensTable.__store.push({
      token: EXPIRED_TOKEN,
      kitId: FAKE_KIT.id,
      buyerEmail: "buyer@example.com",
      buyerName: "Test Buyer",
      purchaseId: "purchase-002",
      createdAt: new Date(Date.now() - 60_000),
      expiresAt: past,
    });

    const h = await startHarness();
    try {
      const r = await accessToken(h.base, EXPIRED_TOKEN);
      expect(r.status).toBe(410);
      const body = (await r.json()) as { error?: string; expired_at?: string };
      expect(body.error).toBe("Token expired");
      expect(typeof body.expired_at).toBe("string");
    } finally {
      await h.close();
    }
  });

  it("returns 404 for a token that does not exist in the store", async () => {
    const h = await startHarness();
    try {
      const r = await accessToken(h.base, UNKNOWN_TOKEN);
      expect(r.status).toBe(404);
      const body = (await r.json()) as { error?: string };
      expect(body.error).toBe("Token not found");
    } finally {
      await h.close();
    }
  });
});

// ── GET /kits/resend — signed one-click resend link ───────────────────────────

const TEST_SECRET = "test-webhook-secret-for-resend-tests";
const TEST_PURCHASE_ID = "purchase-resend-001";

function makeResendUrl(
  base: string,
  opts: { purchaseId?: string; exp?: number; sig?: string } = {},
): string {
  const purchaseId = opts.purchaseId ?? TEST_PURCHASE_ID;
  const exp = opts.exp ?? Date.now() + 7 * 24 * 60 * 60 * 1000;
  const { generateResendLink, verifyResendToken: _v } = kitsMailerModule;
  // Use the real generateResendLink to produce a valid token, then substitute
  // the base URL with the test server's address.
  const full = generateResendLink({ purchaseId, secret: TEST_SECRET });
  const url = new URL(full);
  if (opts.sig !== undefined) url.searchParams.set("sig", opts.sig);
  if (opts.exp !== undefined) url.searchParams.set("exp", String(opts.exp));
  return `${base}/kits/resend?${url.searchParams.toString()}`;
}

describe("GET /kits/resend — signed one-click resend link", () => {
  const originalSecret = process.env.KIT_WEBHOOK_SECRET;

  beforeEach(() => {
    process.env.KIT_WEBHOOK_SECRET = TEST_SECRET;
    sendKitDeliveryEmailMock.mockResolvedValue({ status: "sent" });
  });

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.KIT_WEBHOOK_SECRET;
    } else {
      process.env.KIT_WEBHOOK_SECRET = originalSecret;
    }
  });

  it("returns 500 HTML when KIT_WEBHOOK_SECRET is not set", async () => {
    delete process.env.KIT_WEBHOOK_SECRET;
    const h = await startHarness();
    try {
      const r = await fetch(`${h.base}/kits/resend?purchaseId=x&exp=1&sig=abc`);
      expect(r.status).toBe(500);
      expect(r.headers.get("content-type")).toMatch(/html/);
      const text = await r.text();
      expect(text).toMatch(/Not Configured/);
    } finally {
      await h.close();
    }
  });

  it("returns 400 HTML when required query params are missing", async () => {
    const h = await startHarness();
    try {
      const r = await fetch(`${h.base}/kits/resend?purchaseId=only`);
      expect(r.status).toBe(400);
      expect(r.headers.get("content-type")).toMatch(/html/);
      const text = await r.text();
      expect(text).toMatch(/Invalid Link/);
    } finally {
      await h.close();
    }
  });

  it("returns 403 HTML when the signature is wrong", async () => {
    const h = await startHarness();
    try {
      const r = await fetch(makeResendUrl(h.base, { sig: "a".repeat(64) }));
      expect(r.status).toBe(403);
      const text = await r.text();
      expect(text).toMatch(/Invalid Link/);
    } finally {
      await h.close();
    }
  });

  it("returns 410 HTML when the link has expired", async () => {
    const h = await startHarness();
    try {
      // Compute a real sig for an already-expired exp
      const crypto = await import("node:crypto");
      const expiredExp = Date.now() - 1000;
      const payload = `${TEST_PURCHASE_ID}:${expiredExp}`;
      const sig = crypto
        .createHmac("sha256", TEST_SECRET)
        .update(payload)
        .digest("hex");
      const r = await fetch(
        makeResendUrl(h.base, { exp: expiredExp, sig }),
      );
      expect(r.status).toBe(410);
      const text = await r.text();
      expect(text).toMatch(/Link Expired/);
    } finally {
      await h.close();
    }
  });

  it("returns 404 HTML when the purchase ID is not in the token store", async () => {
    const h = await startHarness();
    try {
      const r = await fetch(makeResendUrl(h.base));
      expect(r.status).toBe(404);
      const text = await r.text();
      expect(text).toMatch(/Purchase Not Found/);
    } finally {
      await h.close();
    }
  });

  it("returns 500 HTML when the kit is not in the registry", async () => {
    tables.kitTokensTable.__store.push({
      token: "d".repeat(64),
      kitId: "unknown-kit",
      buyerEmail: "buyer@example.com",
      buyerName: "Test Buyer",
      purchaseId: TEST_PURCHASE_ID,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    getKitMock.mockReturnValue(null);

    const h = await startHarness();
    try {
      const r = await fetch(makeResendUrl(h.base));
      expect(r.status).toBe(500);
      const text = await r.text();
      expect(text).toMatch(/Kit Not Found/);
    } finally {
      await h.close();
    }
  });

  it("returns 500 HTML when the delivery email fails", async () => {
    tables.kitTokensTable.__store.push({
      token: "e".repeat(64),
      kitId: FAKE_KIT.id,
      buyerEmail: "buyer@example.com",
      buyerName: "Test Buyer",
      purchaseId: TEST_PURCHASE_ID,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    getKitMock.mockReturnValue(FAKE_KIT);
    sendKitDeliveryEmailMock.mockResolvedValue({ status: "failed", error: "smtp timeout" });

    const h = await startHarness();
    try {
      const r = await fetch(makeResendUrl(h.base));
      expect(r.status).toBe(500);
      const text = await r.text();
      expect(text).toMatch(/Send Failed/);
      expect(text).toMatch(/smtp timeout/);
    } finally {
      await h.close();
    }
  });

  it("returns 200 HTML confirming delivery when the email sends successfully", async () => {
    tables.kitTokensTable.__store.push({
      token: "f".repeat(64),
      kitId: FAKE_KIT.id,
      buyerEmail: "buyer@example.com",
      buyerName: "Test Buyer",
      purchaseId: TEST_PURCHASE_ID,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    getKitMock.mockReturnValue(FAKE_KIT);
    sendKitDeliveryEmailMock.mockResolvedValue({ status: "sent", messageId: "msg-001" });

    const h = await startHarness();
    try {
      const r = await fetch(makeResendUrl(h.base));
      expect(r.status).toBe(200);
      expect(r.headers.get("content-type")).toMatch(/html/);
      const text = await r.text();
      expect(text).toMatch(/Kit Resent/);
      expect(text).toMatch(/buyer@example\.com/);
    } finally {
      await h.close();
    }
  });
});

// ── fulfillKitPurchase — delivery failure persistence ─────────────────────────
//
// Both the legacy purchase-webhook and the Zaprite webhook call fulfillKitPurchase.
// When the delivery email fails, a row must be written to kitDeliveryFailuresTable
// so Bitcoin purchasers who don't receive their kit appear in the audit trail.

const WEBHOOK_SECRET = "test-webhook-secret";
const ZAPRITE_SECRET = "test-zaprite-secret";

function postPurchaseWebhook(
  base: string,
  body: Record<string, string>,
  secret = WEBHOOK_SECRET,
): Promise<Response> {
  return fetch(`${base}/kits/purchase-webhook`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-webhook-secret": secret,
    },
    body: JSON.stringify(body),
  });
}

async function postZapriteWebhook(
  base: string,
  body: Record<string, unknown>,
  secret = ZAPRITE_SECRET,
): Promise<Response> {
  const { createHmac } = await import("node:crypto");
  const raw = JSON.stringify(body);
  const sig = createHmac("sha256", secret).update(raw).digest("hex");
  return fetch(`${base}/kits/zaprite-webhook`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-zaprite-signature": `sha256=${sig}`,
    },
    body: raw,
  });
}

// ── POST /kits/zaprite-webhook — signature verification ───────────────────────

describe("POST /kits/zaprite-webhook — signature verification", () => {
  const originalZapriteSecret = process.env.ZAPRITE_WEBHOOK_SECRET;

  beforeEach(() => {
    process.env.ZAPRITE_WEBHOOK_SECRET = ZAPRITE_SECRET;
    getKitMock.mockReturnValue(FAKE_KIT);
    sendKitDeliveryEmailMock.mockResolvedValue({ status: "sent", messageId: "msg-zaprite-ok" });
  });

  afterEach(() => {
    if (originalZapriteSecret === undefined) {
      delete process.env.ZAPRITE_WEBHOOK_SECRET;
    } else {
      process.env.ZAPRITE_WEBHOOK_SECRET = originalZapriteSecret;
    }
  });

  it("returns 201 with ok:true when given a correctly-signed payment.completed payload with valid kit_id", async () => {
    const h = await startHarness({ rawBody: true });
    try {
      const r = await postZapriteWebhook(h.base, {
        type: "payment.completed",
        data: {
          id: "zaprite-sig-test-001",
          customer: { email: "buyer@example.com", name: "Sig Test Buyer" },
          metadata: { kit_id: FAKE_KIT.id },
        },
      });
      expect(r.status).toBe(201);
      const body = (await r.json()) as { ok?: boolean; token?: string };
      expect(body.ok).toBe(true);
      expect(typeof body.token).toBe("string");
    } finally {
      await h.close();
    }
  });

  it("returns 401 when the x-zaprite-signature header contains a wrong signature", async () => {
    const h = await startHarness({ rawBody: true });
    try {
      const raw = JSON.stringify({
        type: "payment.completed",
        data: {
          id: "zaprite-sig-test-002",
          customer: { email: "buyer@example.com", name: "Bad Sig Buyer" },
          metadata: { kit_id: FAKE_KIT.id },
        },
      });
      const r = await fetch(`${h.base}/kits/zaprite-webhook`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-zaprite-signature": "sha256=" + "0".repeat(64),
        },
        body: raw,
      });
      expect(r.status).toBe(401);
      const body = (await r.json()) as { error?: string };
      expect(body.error).toBe("Unauthorized");
    } finally {
      await h.close();
    }
  });

  it("returns 401 when the x-zaprite-signature header is missing entirely", async () => {
    const h = await startHarness({ rawBody: true });
    try {
      const raw = JSON.stringify({
        type: "payment.completed",
        data: {
          id: "zaprite-sig-test-003",
          customer: { email: "buyer@example.com", name: "No Sig Buyer" },
          metadata: { kit_id: FAKE_KIT.id },
        },
      });
      const r = await fetch(`${h.base}/kits/zaprite-webhook`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: raw,
      });
      expect(r.status).toBe(401);
      const body = (await r.json()) as { error?: string };
      expect(body.error).toBe("Unauthorized");
    } finally {
      await h.close();
    }
  });
});

describe("fulfillKitPurchase — delivery failure written to kitDeliveryFailuresTable", () => {
  const originalKitSecret = process.env.KIT_WEBHOOK_SECRET;
  const originalZapriteSecret = process.env.ZAPRITE_WEBHOOK_SECRET;

  beforeEach(() => {
    process.env.KIT_WEBHOOK_SECRET = WEBHOOK_SECRET;
    process.env.ZAPRITE_WEBHOOK_SECRET = ZAPRITE_SECRET;
    getKitMock.mockReturnValue(FAKE_KIT);
    sendKitDeliveryEmailMock.mockResolvedValue({ status: "failed", error: "smtp timeout" });
  });

  afterEach(() => {
    if (originalKitSecret === undefined) {
      delete process.env.KIT_WEBHOOK_SECRET;
    } else {
      process.env.KIT_WEBHOOK_SECRET = originalKitSecret;
    }
    if (originalZapriteSecret === undefined) {
      delete process.env.ZAPRITE_WEBHOOK_SECRET;
    } else {
      process.env.ZAPRITE_WEBHOOK_SECRET = originalZapriteSecret;
    }
  });

  it("writes a failure row via the legacy purchase-webhook path", async () => {
    const h = await startHarness();
    try {
      const r = await postPurchaseWebhook(h.base, {
        kit_id: FAKE_KIT.id,
        buyer_email: "Bitcoin@Example.com",
        buyer_name: "Bitcoin Buyer",
        purchase_id: "tsp-purchase-001",
      });
      expect(r.status).toBe(201);
      expect(tables.kitDeliveryFailuresTable.__store).toHaveLength(1);
      const row = tables.kitDeliveryFailuresTable.__store[0] as Record<string, unknown>;
      expect(row.buyerEmail).toBe("bitcoin@example.com");
      expect(row.kitId).toBe(FAKE_KIT.id);
      expect(row.purchaseId).toBe("tsp-purchase-001");
      expect(row.error).toBe("smtp timeout");
    } finally {
      await h.close();
    }
  });

  it("does NOT write a failure row via the legacy purchase-webhook when email succeeds", async () => {
    sendKitDeliveryEmailMock.mockResolvedValue({ status: "sent", messageId: "msg-ok" });
    const h = await startHarness();
    try {
      await postPurchaseWebhook(h.base, {
        kit_id: FAKE_KIT.id,
        buyer_email: "buyer@example.com",
        buyer_name: "Happy Buyer",
        purchase_id: "tsp-purchase-002",
      });
      expect(tables.kitDeliveryFailuresTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });

  it("writes a failure row via the Zaprite webhook path", async () => {
    const h = await startHarness({ rawBody: true });
    try {
      const r = await postZapriteWebhook(h.base, {
        type: "payment.completed",
        data: {
          id: "zaprite-order-001",
          customer: { email: "Sats@Example.com", name: "Sats Buyer" },
          metadata: { kit_id: FAKE_KIT.id },
        },
      });
      expect(r.status).toBe(201);
      expect(tables.kitDeliveryFailuresTable.__store).toHaveLength(1);
      const row = tables.kitDeliveryFailuresTable.__store[0] as Record<string, unknown>;
      expect(row.buyerEmail).toBe("sats@example.com");
      expect(row.kitId).toBe(FAKE_KIT.id);
      expect(row.purchaseId).toBe("zaprite-order-001");
      expect(row.error).toBe("smtp timeout");
    } finally {
      await h.close();
    }
  });

  it("does NOT write a failure row via the Zaprite webhook when email succeeds", async () => {
    sendKitDeliveryEmailMock.mockResolvedValue({ status: "sent", messageId: "msg-ok" });
    const h = await startHarness({ rawBody: true });
    try {
      await postZapriteWebhook(h.base, {
        type: "payment.completed",
        data: {
          id: "zaprite-order-002",
          customer: { email: "buyer@example.com", name: "Happy Buyer" },
          metadata: { kit_id: FAKE_KIT.id },
        },
      });
      expect(tables.kitDeliveryFailuresTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });
});

// ── fulfillKitPurchase — founder alert on delivery failure ────────────────────
//
// When the kit delivery email fails, sendKitDeliveryFailureAlert must be called
// so the founder is notified that a Bitcoin buyer is waiting. When email succeeds,
// the alert must NOT be called.

describe("fulfillKitPurchase — founder alert on delivery failure", () => {
  const originalKitSecret = process.env.KIT_WEBHOOK_SECRET;
  const originalZapriteSecret = process.env.ZAPRITE_WEBHOOK_SECRET;

  beforeEach(() => {
    process.env.KIT_WEBHOOK_SECRET = WEBHOOK_SECRET;
    process.env.ZAPRITE_WEBHOOK_SECRET = ZAPRITE_SECRET;
    getKitMock.mockReturnValue(FAKE_KIT);
    sendKitDeliveryEmailMock.mockResolvedValue({ status: "failed", error: "smtp timeout" });
  });

  afterEach(() => {
    if (originalKitSecret === undefined) {
      delete process.env.KIT_WEBHOOK_SECRET;
    } else {
      process.env.KIT_WEBHOOK_SECRET = originalKitSecret;
    }
    if (originalZapriteSecret === undefined) {
      delete process.env.ZAPRITE_WEBHOOK_SECRET;
    } else {
      process.env.ZAPRITE_WEBHOOK_SECRET = originalZapriteSecret;
    }
  });

  it("calls sendKitDeliveryFailureAlert with the correct fields via the Zaprite path", async () => {
    const h = await startHarness({ rawBody: true });
    try {
      const r = await postZapriteWebhook(h.base, {
        type: "payment.completed",
        data: {
          id: "zaprite-alert-001",
          customer: { email: "sats@example.com", name: "Sats Buyer" },
          metadata: { kit_id: FAKE_KIT.id },
        },
      });
      expect(r.status).toBe(201);

      // Allow the fire-and-forget alert to settle
      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(sendKitDeliveryFailureAlertMock).toHaveBeenCalledOnce();
      const call = sendKitDeliveryFailureAlertMock.mock.calls[0]?.[0] as Record<string, unknown>;
      expect(call.buyerEmail).toBe("sats@example.com");
      expect(call.kitId).toBe(FAKE_KIT.id);
      expect(call.purchaseId).toBe("zaprite-alert-001");
      expect(call.deliveryError).toBe("smtp timeout");
    } finally {
      await h.close();
    }
  });

  it("calls sendKitDeliveryFailureAlert via the legacy purchase-webhook path too", async () => {
    const h = await startHarness();
    try {
      const r = await postPurchaseWebhook(h.base, {
        kit_id: FAKE_KIT.id,
        buyer_email: "buyer@example.com",
        buyer_name: "Legacy Buyer",
        purchase_id: "tsp-alert-001",
      });
      expect(r.status).toBe(201);

      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(sendKitDeliveryFailureAlertMock).toHaveBeenCalledOnce();
      const call = sendKitDeliveryFailureAlertMock.mock.calls[0]?.[0] as Record<string, unknown>;
      expect(call.purchaseId).toBe("tsp-alert-001");
      expect(call.kitId).toBe(FAKE_KIT.id);
    } finally {
      await h.close();
    }
  });

  it("does NOT call sendKitDeliveryFailureAlert when the delivery email succeeds via Zaprite", async () => {
    sendKitDeliveryEmailMock.mockResolvedValue({ status: "sent", messageId: "msg-ok" });
    const h = await startHarness({ rawBody: true });
    try {
      const r = await postZapriteWebhook(h.base, {
        type: "payment.completed",
        data: {
          id: "zaprite-alert-002",
          customer: { email: "happy@example.com", name: "Happy Buyer" },
          metadata: { kit_id: FAKE_KIT.id },
        },
      });
      expect(r.status).toBe(201);

      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(sendKitDeliveryFailureAlertMock).not.toHaveBeenCalled();
    } finally {
      await h.close();
    }
  });
});

// ── POST /kits/failures/:id/resolve ──────────────────────────────────────────

function postResolve(base: string, id: string): Promise<Response> {
  return fetch(`${base}/kits/failures/${id}/resolve`, { method: "POST" });
}

describe("POST /kits/failures/:id/resolve", () => {
  it("returns 200 and sets resolvedAt on an existing unresolved failure", async () => {
    const failureId = "aaaaaaaa-0000-4000-8000-000000000001";
    tables.kitDeliveryFailuresTable.__store.push({
      id: failureId,
      buyerEmail: "buyer@example.com",
      kitId: "economy-kit",
      purchaseId: "purchase-fail-001",
      error: "smtp timeout",
      resolvedAt: null,
      createdAt: new Date(),
    });

    const h = await startHarness();
    try {
      const r = await postResolve(h.base, failureId);
      expect(r.status).toBe(200);
      const body = (await r.json()) as { ok?: boolean; id?: string; resolvedAt?: string };
      expect(body.ok).toBe(true);
      expect(body.id).toBe(failureId);
      expect(typeof body.resolvedAt).toBe("string");

      const stored = tables.kitDeliveryFailuresTable.__store.find((row) => row["id"] === failureId);
      expect(stored?.["resolvedAt"]).toBeInstanceOf(Date);
    } finally {
      await h.close();
    }
  });

  it("returns 404 when the failure record does not exist", async () => {
    const h = await startHarness();
    try {
      const r = await postResolve(h.base, "nonexistent-id");
      expect(r.status).toBe(404);
      const body = (await r.json()) as { error?: string };
      expect(body.error).toBe("Failure record not found");
    } finally {
      await h.close();
    }
  });

  it("resolved record no longer appears in GET /kits/failures", async () => {
    const resolvedId = "aaaaaaaa-0000-4000-8000-000000000002";
    const unresolvedId = "aaaaaaaa-0000-4000-8000-000000000003";
    const now = new Date();

    tables.kitDeliveryFailuresTable.__store.push(
      {
        id: resolvedId,
        buyerEmail: "resolved@example.com",
        kitId: "economy-kit",
        purchaseId: "purchase-resolved",
        error: "timeout",
        resolvedAt: null,
        createdAt: now,
      },
      {
        id: unresolvedId,
        buyerEmail: "unresolved@example.com",
        kitId: "economy-kit",
        purchaseId: "purchase-unresolved",
        error: "smtp error",
        resolvedAt: null,
        createdAt: now,
      },
    );

    const h = await startHarness();
    try {
      const resolveRes = await postResolve(h.base, resolvedId);
      expect(resolveRes.status).toBe(200);

      const listRes = await fetch(`${h.base}/kits/failures`);
      expect(listRes.status).toBe(200);
      const body = (await listRes.json()) as { ok?: boolean; failures?: Array<{ id: string }> };
      expect(body.ok).toBe(true);
      const ids = (body.failures ?? []).map((f) => f.id);
      expect(ids).not.toContain(resolvedId);
      expect(ids).toContain(unresolvedId);
    } finally {
      await h.close();
    }
  });
});
