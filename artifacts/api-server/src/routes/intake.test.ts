import { describe, it, expect, beforeEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ── mocks ─────────────────────────────────────────────────────────────────────
//
// Mock the DB and email so the route can be exercised in isolation.
// The rate-limit check fires before either is reached, so both can be
// no-ops that return the minimum shape the route expects.

vi.mock("@workspace/db", async () => {
  const { makeTable, makeFakeDb } = await import("../test/fakeDb");
  const communityIntakeTable = makeTable({
    name: "community_intake",
    pk: ["id"],
    columns: [
      "id",
      "name",
      "email",
      "community",
      "role",
      "whatTheyNeed",
      "status",
      "notificationStatus",
      "notificationError",
      "sourceIp",
      "userAgent",
      "createdAt",
    ],
    defaults: {
      status: "new",
      notificationStatus: null,
      notificationError: null,
    },
  });
  return { db: makeFakeDb(), communityIntakeTable };
});

vi.mock("drizzle-orm", async () => {
  const { fakeDrizzle } = await import("../test/fakeDb");
  return fakeDrizzle;
});

vi.mock("../lib/resend", () => ({
  sendCommunityIntakeNotification: vi.fn().mockResolvedValue({ status: "skipped" }),
}));

import express from "express";
import intakeRouter from "./intake";
import { __resetRateLimitForTests } from "../lib/rateLimit";

// ── harness ───────────────────────────────────────────────────────────────────

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/", intakeRouter);
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

function postIntake(base: string, ip: string): Promise<Response> {
  return fetch(`${base}/intake`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify({
      name: "Test User",
      email: "test@example.com",
      community: "Test Community",
      whatTheyNeed: "Rate limit testing tooling",
    }),
  });
}

beforeEach(() => {
  __resetRateLimitForTests();
});

// ── tests ─────────────────────────────────────────────────────────────────────

describe("POST /intake — rate limiter", () => {
  it("allows the first 5 requests from the same IP", async () => {
    const h = await startHarness();
    try {
      const statuses: number[] = [];
      for (let i = 0; i < 5; i++) {
        const r = await postIntake(h.base, "10.3.0.1");
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
        await postIntake(h.base, "10.3.0.1");
      }
      const r = await postIntake(h.base, "10.3.0.1");
      expect(r.status).toBe(429);
    } finally {
      await h.close();
    }
  });

  it("includes the expected error message in the 429 body", async () => {
    const h = await startHarness();
    try {
      for (let i = 0; i < 5; i++) {
        await postIntake(h.base, "10.3.0.1");
      }
      const r = await postIntake(h.base, "10.3.0.1");
      const body = (await r.json()) as { error?: string };
      expect(body.error).toBe(
        "Too many requests. Please wait before submitting again.",
      );
    } finally {
      await h.close();
    }
  });

  it("does not rate-limit a separate IP when another IP has exhausted its quota", async () => {
    const h = await startHarness();
    try {
      for (let i = 0; i < 6; i++) {
        await postIntake(h.base, "10.3.0.1");
      }
      const ipAStatus = (await postIntake(h.base, "10.3.0.1")).status;
      expect(ipAStatus).toBe(429);

      const ipBStatus = (await postIntake(h.base, "10.3.0.2")).status;
      expect(ipBStatus).not.toBe(429);
    } finally {
      await h.close();
    }
  });
});
