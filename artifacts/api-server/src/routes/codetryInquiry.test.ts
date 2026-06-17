import { describe, it, expect, beforeEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ── mocks ─────────────────────────────────────────────────────────────────────
//
// Mock `fs` so the route never touches the real filesystem, and mock
// `../lib/resend` so no outbound email is attempted.  The rate-limit check
// fires before either of these is reached, so both can be no-ops.

vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn().mockReturnValue(true),
    mkdirSync: vi.fn(),
    appendFileSync: vi.fn(),
  },
  existsSync: vi.fn().mockReturnValue(true),
  mkdirSync: vi.fn(),
  appendFileSync: vi.fn(),
}));

vi.mock("../lib/resend", () => ({
  sendCodetryInquiryNotification: vi.fn().mockResolvedValue({ status: "skipped" }),
}));

import express from "express";
import codetryInquiryRouter from "./codetryInquiry";
import { __resetRateLimitForTests } from "../lib/rateLimit";

// ── harness ───────────────────────────────────────────────────────────────────

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/", codetryInquiryRouter);
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

function postInquiry(base: string, ip: string): Promise<Response> {
  return fetch(`${base}/inquiry`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify({
      name: "Test User",
      email: "test@example.com",
      community: "Test Community",
      whatTheyWorkingOn: "Testing rate limits",
      stage: 1,
    }),
  });
}

beforeEach(async () => {
  await __resetRateLimitForTests();
});

// ── tests ─────────────────────────────────────────────────────────────────────

describe("POST /inquiry — rate limiter", () => {
  it("allows the first 5 requests from the same IP", async () => {
    const h = await startHarness();
    try {
      const statuses: number[] = [];
      for (let i = 0; i < 5; i++) {
        const r = await postInquiry(h.base, "10.2.0.1");
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
        await postInquiry(h.base, "10.2.0.1");
      }
      const r = await postInquiry(h.base, "10.2.0.1");
      expect(r.status).toBe(429);
    } finally {
      await h.close();
    }
  });

  it("includes the expected error message in the 429 body", async () => {
    const h = await startHarness();
    try {
      for (let i = 0; i < 5; i++) {
        await postInquiry(h.base, "10.2.0.1");
      }
      const r = await postInquiry(h.base, "10.2.0.1");
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
        await postInquiry(h.base, "10.2.0.1");
      }
      const ipAStatus = (await postInquiry(h.base, "10.2.0.1")).status;
      expect(ipAStatus).toBe(429);

      const ipBStatus = (await postInquiry(h.base, "10.2.0.2")).status;
      expect(ipBStatus).not.toBe(429);
    } finally {
      await h.close();
    }
  });
});
