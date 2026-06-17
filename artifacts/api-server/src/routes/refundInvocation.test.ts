import { describe, it, expect, beforeEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ── mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@workspace/headwaters-pricing", () => ({
  TRIAL_ACCEPTANCE_CRITERIA: ["c1", "c2", "c3", "c4"],
  TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA: 2,
  TRIAL_REFUND_INVOCATION_DAYS: 14,
  TRIAL_FEE_USD: 28_000,
  TRIAL_REFUND_PAYMENT_DAYS: 30,
  TRIAL_REFUND_MECHANIC: "wire transfer",
  TRIAL_WHAT_SURVIVES_REFUND: "nothing",
}));

vi.mock("../lib/resend", () => ({
  sendRefundInvocationToHeadwaters: vi.fn().mockResolvedValue({ status: "skipped" }),
  sendRefundInvocationCopyToContractor: vi.fn().mockResolvedValue({ status: "skipped" }),
}));

import express from "express";
import refundInvocationRouter from "./refundInvocation";
import { __resetRateLimitForTests } from "../lib/rateLimit";

// ── harness ───────────────────────────────────────────────────────────────────

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/", refundInvocationRouter);
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

// A valid payload that passes all route validation checks:
//   - 4 notMet booleans (matching our mocked TRIAL_ACCEPTANCE_CRITERIA length)
//   - at least 2 true (matching TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA)
//   - letterIso within 14 days of meetingIso and not before it
const VALID_BODY = {
  meetingIso: "2026-06-01",
  letterIso: "2026-06-05",
  contractorName: "Jane Doe",
  contractorEmail: "jane@example.com",
  election: "refund",
  notMet: [true, true, false, false],
};

function postRefund(base: string, ip: string): Promise<Response> {
  return fetch(`${base}/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(VALID_BODY),
  });
}

beforeEach(() => {
  __resetRateLimitForTests();
});

// ── per-minute limiter (max 3) ────────────────────────────────────────────────

describe("POST /refund-invocation — per-minute rate limiter", () => {
  it("allows the first 3 requests from the same IP", async () => {
    const h = await startHarness();
    try {
      const statuses: number[] = [];
      for (let i = 0; i < 3; i++) {
        const r = await postRefund(h.base, "10.4.0.1");
        statuses.push(r.status);
      }
      expect(statuses.every((s) => s !== 429)).toBe(true);
    } finally {
      await h.close();
    }
  });

  it("returns 429 on the 4th request from the same IP within a minute", async () => {
    const h = await startHarness();
    try {
      for (let i = 0; i < 3; i++) {
        await postRefund(h.base, "10.4.0.1");
      }
      const r = await postRefund(h.base, "10.4.0.1");
      expect(r.status).toBe(429);
    } finally {
      await h.close();
    }
  });

  it("includes the per-minute error message in the 429 body", async () => {
    const h = await startHarness();
    try {
      for (let i = 0; i < 3; i++) {
        await postRefund(h.base, "10.4.0.1");
      }
      const r = await postRefund(h.base, "10.4.0.1");
      const body = (await r.json()) as { error?: string };
      expect(body.error).toBe(
        "Too many requests from this network. Try again shortly.",
      );
    } finally {
      await h.close();
    }
  });

  it("does not rate-limit a separate IP when another IP has exhausted its per-minute quota", async () => {
    const h = await startHarness();
    try {
      for (let i = 0; i < 4; i++) {
        await postRefund(h.base, "10.4.0.1");
      }
      const ipAStatus = (await postRefund(h.base, "10.4.0.1")).status;
      expect(ipAStatus).toBe(429);

      const ipBStatus = (await postRefund(h.base, "10.4.0.2")).status;
      expect(ipBStatus).not.toBe(429);
    } finally {
      await h.close();
    }
  });
});

// ── per-hour limiter (max 10) ─────────────────────────────────────────────────
//
// The per-minute limiter (max 3) fires before the per-hour limiter, so a
// single IP can only make 3 requests before being blocked by the minute
// bucket.  To exhaust the hour bucket (max 10) in a unit test we mock
// `Date.now` and advance the clock past each 60 s minute window so the
// minute counter resets while the hour counter keeps accumulating.
//
// Strategy per test:
//   Window 1 (t+0 ms):        3 requests  → hour count = 3
//   Window 2 (t+61000 ms):    3 requests  → hour count = 6
//   Window 3 (t+122000 ms):   3 requests  → hour count = 9
//   Window 4 (t+183000 ms):   1 request   → hour count = 10  (still allowed)
//   Still window 4 (t+184000 ms): 1 more  → hour count > 10  → 429 with hour message

describe("POST /refund-invocation — per-hour rate limiter", () => {
  it("allows the first 10 requests from the same IP across multiple minute windows", async () => {
    const h = await startHarness();
    const dateSpy = vi.spyOn(Date, "now");
    try {
      const t = 1_700_000_000_000;
      const statuses: number[] = [];

      dateSpy.mockReturnValue(t);
      for (let i = 0; i < 3; i++) statuses.push((await postRefund(h.base, "10.4.1.1")).status);

      dateSpy.mockReturnValue(t + 61_000);
      for (let i = 0; i < 3; i++) statuses.push((await postRefund(h.base, "10.4.1.1")).status);

      dateSpy.mockReturnValue(t + 122_000);
      for (let i = 0; i < 3; i++) statuses.push((await postRefund(h.base, "10.4.1.1")).status);

      dateSpy.mockReturnValue(t + 183_000);
      statuses.push((await postRefund(h.base, "10.4.1.1")).status); // 10th

      expect(statuses.length).toBe(10);
      expect(statuses.every((s) => s !== 429)).toBe(true);
    } finally {
      dateSpy.mockRestore();
      await h.close();
    }
  });

  it("returns 429 on the 11th request from the same IP (hour bucket exhausted)", async () => {
    const h = await startHarness();
    const dateSpy = vi.spyOn(Date, "now");
    try {
      const t = 1_710_000_000_000;

      dateSpy.mockReturnValue(t);
      for (let i = 0; i < 3; i++) await postRefund(h.base, "10.4.1.1");

      dateSpy.mockReturnValue(t + 61_000);
      for (let i = 0; i < 3; i++) await postRefund(h.base, "10.4.1.1");

      dateSpy.mockReturnValue(t + 122_000);
      for (let i = 0; i < 3; i++) await postRefund(h.base, "10.4.1.1");

      dateSpy.mockReturnValue(t + 183_000);
      await postRefund(h.base, "10.4.1.1"); // 10th — still allowed

      dateSpy.mockReturnValue(t + 184_000);
      const r = await postRefund(h.base, "10.4.1.1"); // 11th — blocked
      expect(r.status).toBe(429);
    } finally {
      dateSpy.mockRestore();
      await h.close();
    }
  });

  it("includes the hourly-cap error message in the 429 body", async () => {
    const h = await startHarness();
    const dateSpy = vi.spyOn(Date, "now");
    try {
      const t = 1_720_000_000_000;

      dateSpy.mockReturnValue(t);
      for (let i = 0; i < 3; i++) await postRefund(h.base, "10.4.1.1");

      dateSpy.mockReturnValue(t + 61_000);
      for (let i = 0; i < 3; i++) await postRefund(h.base, "10.4.1.1");

      dateSpy.mockReturnValue(t + 122_000);
      for (let i = 0; i < 3; i++) await postRefund(h.base, "10.4.1.1");

      dateSpy.mockReturnValue(t + 183_000);
      await postRefund(h.base, "10.4.1.1"); // 10th

      dateSpy.mockReturnValue(t + 184_000);
      const r = await postRefund(h.base, "10.4.1.1"); // 11th
      const body = (await r.json()) as { error?: string };
      expect(body.error).toBe(
        "Hourly limit reached from this network. Try again later.",
      );
    } finally {
      dateSpy.mockRestore();
      await h.close();
    }
  });

  it("does not rate-limit a separate IP when another IP has exhausted its hourly quota", async () => {
    const h = await startHarness();
    const dateSpy = vi.spyOn(Date, "now");
    try {
      const t = 1_730_000_000_000;

      dateSpy.mockReturnValue(t);
      for (let i = 0; i < 3; i++) await postRefund(h.base, "10.4.1.1");

      dateSpy.mockReturnValue(t + 61_000);
      for (let i = 0; i < 3; i++) await postRefund(h.base, "10.4.1.1");

      dateSpy.mockReturnValue(t + 122_000);
      for (let i = 0; i < 3; i++) await postRefund(h.base, "10.4.1.1");

      dateSpy.mockReturnValue(t + 183_000);
      await postRefund(h.base, "10.4.1.1"); // 10th

      dateSpy.mockReturnValue(t + 184_000);
      const ipAStatus = (await postRefund(h.base, "10.4.1.1")).status; // 11th — blocked
      expect(ipAStatus).toBe(429);

      // IP B has no prior requests — should not be blocked
      const ipBStatus = (await postRefund(h.base, "10.4.1.2")).status;
      expect(ipBStatus).not.toBe(429);
    } finally {
      dateSpy.mockRestore();
      await h.close();
    }
  });
});
