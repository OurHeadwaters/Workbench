import { describe, it, expect, beforeEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ── mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@workspace/db", async () => {
  const { makeTable, makeFakeDb } = await import("../test/fakeDb");
  const odysseyTrailSignsTable = makeTable({
    name: "odyssey_trail_signs",
    pk: ["id"],
    columns: [
      "id",
      "toolName",
      "problemStatement",
      "costTier",
      "actionUrl",
      "actionLabel",
      "communityProof",
      "zoneTags",
      "topicTags",
      "status",
      "approvedAt",
      "approvedBy",
      "rejectionReason",
      "submitterName",
      "submitterEmail",
      "submitterNote",
      "submittedAt",
      "updatedAt",
    ],
    defaults: {
      status: "pending",
      costTier: "free",
      actionLabel: "Take a look",
      zoneTags: "any",
      topicTags: "",
      communityProof: null,
      approvedAt: null,
      approvedBy: null,
      rejectionReason: null,
      submitterNote: null,
    },
  });
  return { db: makeFakeDb(), odysseyTrailSignsTable };
});

vi.mock("drizzle-orm", async () => {
  const { fakeDrizzle } = await import("../test/fakeDb");
  return fakeDrizzle;
});

vi.mock("@clerk/express", () => ({
  getAuth: vi.fn().mockReturnValue({ userId: null }),
  clerkMiddleware: vi.fn(() => (_req: unknown, _res: unknown, next: () => void) => next()),
}));

vi.mock("@workspace/odyssey", () => ({
  parseZoneTags: vi.fn().mockReturnValue(["any"]),
  parseTopicTags: vi.fn().mockReturnValue([]),
}));

import express from "express";
import odysseyRouter from "./odyssey";
import { __resetRateLimitForTests } from "../lib/rateLimit";

// ── harness ───────────────────────────────────────────────────────────────────

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/", odysseyRouter);
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

// A valid sponsor-intake payload that satisfies the IntakeSchema Zod schema.
const VALID_INTAKE = {
  toolName: "Budget Tracker",
  problemStatement: "Communities need a simple way to track shared budgets.",
  costTier: "free",
  actionUrl: "https://example.com/budget-tracker",
  actionLabel: "Try it",
  zoneTags: "Z1",
  topicTags: "finance",
  submitterName: "Jane Sponsor",
  submitterEmail: "jane@example.com",
};

function postSponsorIntake(base: string, ip: string): Promise<Response> {
  return fetch(`${base}/sponsor-intake`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(VALID_INTAKE),
  });
}

beforeEach(() => {
  __resetRateLimitForTests();
});

// ── tests ─────────────────────────────────────────────────────────────────────

describe("POST /sponsor-intake — rate limiter", () => {
  it("allows the first 5 requests from the same IP", async () => {
    const h = await startHarness();
    try {
      const statuses: number[] = [];
      for (let i = 0; i < 5; i++) {
        const r = await postSponsorIntake(h.base, "10.5.0.1");
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
        await postSponsorIntake(h.base, "10.5.0.1");
      }
      const r = await postSponsorIntake(h.base, "10.5.0.1");
      expect(r.status).toBe(429);
    } finally {
      await h.close();
    }
  });

  it("includes the expected error message in the 429 body", async () => {
    const h = await startHarness();
    try {
      for (let i = 0; i < 5; i++) {
        await postSponsorIntake(h.base, "10.5.0.1");
      }
      const r = await postSponsorIntake(h.base, "10.5.0.1");
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
        await postSponsorIntake(h.base, "10.5.0.1");
      }
      const ipAStatus = (await postSponsorIntake(h.base, "10.5.0.1")).status;
      expect(ipAStatus).toBe(429);

      const ipBStatus = (await postSponsorIntake(h.base, "10.5.0.2")).status;
      expect(ipBStatus).not.toBe(429);
    } finally {
      await h.close();
    }
  });
});
