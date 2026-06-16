import { describe, it, expect, beforeEach, vi } from "vitest";
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
  return { db: makeFakeDb(), kitTokensTable, kitsTable, practitionerApplicationsTable };
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

vi.mock("../lib/codetryFilter", () => ({
  runCodetryFilter: vi.fn().mockResolvedValue([]),
}));

vi.mock("../lib/kitAuth", () => ({
  requireKitOwnerAuth: vi.fn(
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

// ── harness ───────────────────────────────────────────────────────────────────
//
// trust proxy: 1 lets the test control req.ip via the X-Forwarded-For header,
// which is how the rate limiter distinguishes between different callers.

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.set("trust proxy", 1);
  app.use(express.json());
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
