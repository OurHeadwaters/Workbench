/**
 * kits.progress.test.ts
 *
 * Tests for the server-side buyer-progress persistence endpoints:
 *   GET  /kits/access/:token/progress
 *   POST /kits/access/:token/progress
 *
 * Key scenario covered:
 *   Two progress updates for the same purchase_id that arrive close together
 *   (simulated as sequential calls) must both survive — neither set of visited
 *   items may be lost.  This pins the additive-only guarantee that the atomic
 *   SQL upsert (ARRAY(SELECT DISTINCT unnest(existing || incoming))) provides.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ── Mocks (must come before any imports that touch these modules) ──────────────

vi.mock("express-rate-limit", () => ({
  default: vi.fn(() => (_req: unknown, _res: unknown, next: () => void) => next()),
}));

vi.mock("../lib/rateLimit", () => ({
  PgExpressRateLimitStore: class {
    resetAll() { return Promise.resolve(); }
  },
}));

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
      "emailSentAt",
    ],
  });

  const kitProgressTable = makeTable({
    name: "kit_progress",
    pk: ["purchaseId"],
    columns: ["purchaseId", "visitedModules", "visitedHandouts", "updatedAt"],
    defaults: { visitedModules: [], visitedHandouts: [] },
  });

  // Other tables the kits router imports — unused in these tests but needed to
  // satisfy the module contract so the import doesn't throw.
  const kitsTable = makeTable({
    name: "kits",
    pk: ["id"],
    columns: ["id", "ownerId", "title", "description", "priceCents", "status",
      "contentOutline", "codetryResult", "paymentRails", "stripeProductId",
      "stripePriceId", "stripeAccountId", "stripeCheckoutUrl", "createdAt", "updatedAt"],
  });
  const practitionerApplicationsTable = makeTable({
    name: "practitioner_applications",
    pk: ["id"],
    columns: ["id", "name", "community", "doctrineSummary", "contactEmail",
      "status", "reviewedAt", "reviewNote", "stripeAccountId", "clerkUserId", "createdAt"],
  });
  const kitDeliveryFailuresTable = makeTable({
    name: "kit_delivery_failures",
    pk: ["id"],
    columns: ["id", "buyerEmail", "kitId", "purchaseId", "error", "resolvedAt", "createdAt"],
  });
  const kitWebhookAttemptsTable = makeTable({
    name: "kit_webhook_attempts",
    pk: ["eventId"],
    columns: ["eventId", "kitId", "buyerEmail", "purchaseId", "attemptCount", "lastAttemptAt", "resolvedAt"],
  });
  const stripeProcessedEventsTable = makeTable({
    name: "stripe_processed_events",
    pk: ["eventId"],
    columns: ["eventId", "processedAt", "purchaseId"],
  });

  return {
    db: makeFakeDb(),
    kitTokensTable,
    kitProgressTable,
    kitsTable,
    practitionerApplicationsTable,
    kitDeliveryFailuresTable,
    kitWebhookAttemptsTable,
    stripeProcessedEventsTable,
  };
});

vi.mock("drizzle-orm", async () => {
  const { fakeDrizzle } = await import("../test/fakeDb");
  return fakeDrizzle;
});

vi.mock("../lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock("../lib/kitsRegistry", () => ({
  getKit: vi.fn().mockReturnValue({
    id: "pj-solutions-kit",
    name: "PJ Solutions Kit",
    tagline: "Preservation kit",
    arcNote: null,
    contentNote: "",
  }),
  KITS: [],
}));

vi.mock("../lib/kitsMailer", () => ({
  sendKitDeliveryEmail: vi.fn().mockResolvedValue({ status: "sent" }),
  sendKitDeliveryFailureAlert: vi.fn().mockResolvedValue(undefined),
  verifyResendToken: vi.fn(),
}));

vi.mock("../lib/codetryFilter", () => ({
  runCodetryFilter: vi.fn().mockResolvedValue({ passed: true, flags: [] }),
}));

vi.mock("../lib/kitAuth", () => ({
  requireKitOwnerAuth: (_req: unknown, _res: unknown, next: () => void) => next(),
  requireFounderOnlyAuth: (_req: unknown, _res: unknown, next: () => void) => next(),
  FOUNDER_OWNER_ID: "founder",
}));

vi.mock("@workspace/integrations-anthropic-ai", () => ({
  anthropic: {
    messages: { create: vi.fn().mockResolvedValue({ content: [{ type: "text", text: "{}" }] }) },
  },
}));

vi.mock("@clerk/express", () => ({
  clerkClient: {
    users: { getUser: vi.fn().mockResolvedValue({ emailAddresses: [], primaryEmailAddressId: null }) },
  },
}));

// ── Imports (after mocks) ─────────────────────────────────────────────────────

import express from "express";
import kitsRouter from "./kits";
import * as dbModule from "@workspace/db";
import type { FakeDb, FakeTable } from "../test/fakeDb";

const db = (dbModule as unknown as { db: FakeDb }).db;
const kitTokensTable = (dbModule as unknown as { kitTokensTable: FakeTable }).kitTokensTable;
const kitProgressTable = (dbModule as unknown as { kitProgressTable: FakeTable }).kitProgressTable;

// ── Test harness ──────────────────────────────────────────────────────────────

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/api/kits", kitsRouter);
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

// ── Test data ─────────────────────────────────────────────────────────────────

const VALID_TOKEN = "a".repeat(64);
const PURCHASE_ID = "purchase-test-001";
const KIT_ID = "pj-solutions-kit";

function seedToken(overrides: Partial<{
  token: string;
  expiresAt: Date;
  purchaseId: string;
}> = {}) {
  kitTokensTable.__store.push({
    token: overrides.token ?? VALID_TOKEN,
    kitId: KIT_ID,
    buyerEmail: "buyer@example.com",
    buyerName: "Test Buyer",
    purchaseId: overrides.purchaseId ?? PURCHASE_ID,
    createdAt: new Date(),
    expiresAt: overrides.expiresAt ?? new Date(Date.now() + 86_400_000 * 30),
    emailSentAt: new Date(),
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("GET /kits/access/:token/progress", () => {
  let harness: Harness;

  beforeEach(async () => {
    kitTokensTable.__store.length = 0;
    kitProgressTable.__store.length = 0;
    harness = await startHarness();
    seedToken();
  });

  afterEach(async () => {
    await harness.close();
  });

  it("returns empty arrays when no progress has been recorded yet", async () => {
    const res = await fetch(`${harness.base}/api/kits/access/${VALID_TOKEN}/progress`);
    expect(res.ok).toBe(true);
    const body = await res.json() as { ok: boolean; visitedModules: string[]; visitedHandouts: string[] };
    expect(body.ok).toBe(true);
    expect(body.visitedModules).toEqual([]);
    expect(body.visitedHandouts).toEqual([]);
  });

  it("returns persisted progress after a POST", async () => {
    await fetch(`${harness.base}/api/kits/access/${VALID_TOKEN}/progress`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ visitedModules: ["The System"], visitedHandouts: ["foundation:Get Started"] }),
    });

    const res = await fetch(`${harness.base}/api/kits/access/${VALID_TOKEN}/progress`);
    const body = await res.json() as { visitedModules: string[]; visitedHandouts: string[] };
    expect(body.visitedModules).toContain("The System");
    expect(body.visitedHandouts).toContain("foundation:Get Started");
  });

  it("returns 404 for an unknown token", async () => {
    const res = await fetch(`${harness.base}/api/kits/access/${"z".repeat(64)}/progress`);
    expect(res.status).toBe(404);
  });

  it("returns 410 for an expired token", async () => {
    const expiredToken = "e".repeat(64);
    seedToken({ token: expiredToken, expiresAt: new Date(Date.now() - 1000) });

    const res = await fetch(`${harness.base}/api/kits/access/${expiredToken}/progress`);
    expect(res.status).toBe(410);
  });
});

describe("POST /kits/access/:token/progress — additive merge", () => {
  let harness: Harness;

  beforeEach(async () => {
    kitTokensTable.__store.length = 0;
    kitProgressTable.__store.length = 0;
    harness = await startHarness();
    seedToken();
  });

  afterEach(async () => {
    await harness.close();
  });

  it("merges two sequential updates so both sets of items survive", async () => {
    // Simulate two updates arriving close together (the atomic SQL handles
    // concurrent races; here we verify the behavioral guarantee that both
    // additions are present after sequential calls).
    const firstUpdate = { visitedModules: ["The System"], visitedHandouts: ["foundation:Get Started"] };
    const secondUpdate = { visitedModules: ["Water-Bath Canning"], visitedHandouts: ["waterbath:Introduction & Safe Practices"] };

    const [r1, r2] = await Promise.all([
      fetch(`${harness.base}/api/kits/access/${VALID_TOKEN}/progress`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(firstUpdate),
      }),
      // Slight delay so the second write hits the conflict path in the fake DB
      new Promise<Response>((resolve) =>
        setTimeout(() =>
          resolve(fetch(`${harness.base}/api/kits/access/${VALID_TOKEN}/progress`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(secondUpdate),
          })), 10),
      ),
    ]);

    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);

    const getRes = await fetch(`${harness.base}/api/kits/access/${VALID_TOKEN}/progress`);
    const body = await getRes.json() as { visitedModules: string[]; visitedHandouts: string[] };

    // Both updates must survive — neither can have overwritten the other.
    expect(body.visitedModules).toContain("The System");
    expect(body.visitedModules).toContain("Water-Bath Canning");
    expect(body.visitedHandouts).toContain("foundation:Get Started");
    expect(body.visitedHandouts).toContain("waterbath:Introduction & Safe Practices");
  });

  it("deduplicates items that appear in both updates", async () => {
    const sharedModule = "The System";

    await fetch(`${harness.base}/api/kits/access/${VALID_TOKEN}/progress`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ visitedModules: [sharedModule, "Water-Bath Canning"] }),
    });
    await fetch(`${harness.base}/api/kits/access/${VALID_TOKEN}/progress`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ visitedModules: [sharedModule, "Pressure Canning"] }),
    });

    const getRes = await fetch(`${harness.base}/api/kits/access/${VALID_TOKEN}/progress`);
    const body = await getRes.json() as { visitedModules: string[] };

    // Shared module should appear exactly once.
    const count = body.visitedModules.filter((m) => m === sharedModule).length;
    expect(count).toBe(1);
    expect(body.visitedModules).toContain("Water-Bath Canning");
    expect(body.visitedModules).toContain("Pressure Canning");
  });

  it("is keyed to purchase_id so a new token for the same purchase restores all progress", async () => {
    // First token: record some progress.
    await fetch(`${harness.base}/api/kits/access/${VALID_TOKEN}/progress`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ visitedModules: ["The System", "Water-Bath Canning"] }),
    });

    // Issue a new token for the same purchase_id (simulates a re-sent access link).
    const newToken = "b".repeat(64);
    seedToken({ token: newToken, purchaseId: PURCHASE_ID });

    // Fetching progress with the new token should return the same record.
    const getRes = await fetch(`${harness.base}/api/kits/access/${newToken}/progress`);
    expect(getRes.ok).toBe(true);
    const body = await getRes.json() as { visitedModules: string[] };
    expect(body.visitedModules).toContain("The System");
    expect(body.visitedModules).toContain("Water-Bath Canning");
  });

  it("returns 410 when posting progress with an expired token", async () => {
    const expiredToken = "f".repeat(64);
    seedToken({ token: expiredToken, expiresAt: new Date(Date.now() - 1000) });

    const res = await fetch(`${harness.base}/api/kits/access/${expiredToken}/progress`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ visitedModules: ["The System"] }),
    });
    expect(res.status).toBe(410);
  });
});
