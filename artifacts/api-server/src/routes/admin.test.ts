import { describe, it, expect, beforeEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ── Hoisted mocks ─────────────────────────────────────────────────────────────
// vi.mock factories are hoisted before variable declarations, so any values
// they close over must also be hoisted via vi.hoisted().

const { mockPruneExpiredRateLimits, authState } = vi.hoisted(() => ({
  mockPruneExpiredRateLimits: vi.fn<() => Promise<number | null>>(),
  authState: { pass: true },
}));

vi.mock("../lib/rateLimit", () => ({
  pruneExpiredRateLimits: mockPruneExpiredRateLimits,
}));

vi.mock("../lib/kitAuth", () => ({
  requireFounderOnlyAuth: (
    _req: import("express").Request,
    res: import("express").Response,
    next: import("express").NextFunction,
  ) => {
    if (authState.pass) {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  },
}));

// ── Import after mocks ────────────────────────────────────────────────────────
import express from "express";
import adminRouter from "./admin";

// ── Harness ───────────────────────────────────────────────────────────────────

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/api/admin", adminRouter);
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

function prune(base: string): Promise<Response> {
  return fetch(`${base}/api/admin/rate-limits/prune`, {
    method: "POST",
    headers: { "content-type": "application/json" },
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  authState.pass = true;
  mockPruneExpiredRateLimits.mockReset();
});

describe("POST /api/admin/rate-limits/prune — auth", () => {
  it("returns 401 when auth fails", async () => {
    authState.pass = false;
    const h = await startHarness();
    try {
      const res = await prune(h.base);
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });

  it("returns 200 when auth passes", async () => {
    mockPruneExpiredRateLimits.mockResolvedValue(0);
    const h = await startHarness();
    try {
      const res = await prune(h.base);
      expect(res.status).toBe(200);
    } finally {
      await h.close();
    }
  });
});

describe("POST /api/admin/rate-limits/prune — response body", () => {
  it("returns { deleted: N } when Postgres prune runs", async () => {
    mockPruneExpiredRateLimits.mockResolvedValue(42);
    const h = await startHarness();
    try {
      const res = await prune(h.base);
      expect(res.status).toBe(200);
      const body = (await res.json()) as { deleted?: number };
      expect(body.deleted).toBe(42);
    } finally {
      await h.close();
    }
  });

  it("returns { deleted: 0, note } when Postgres is not configured (null)", async () => {
    mockPruneExpiredRateLimits.mockResolvedValue(null);
    const h = await startHarness();
    try {
      const res = await prune(h.base);
      expect(res.status).toBe(200);
      const body = (await res.json()) as { deleted?: number; note?: string };
      expect(body.deleted).toBe(0);
      expect(typeof body.note).toBe("string");
    } finally {
      await h.close();
    }
  });

  it("returns { deleted: 0 } when no expired rows exist", async () => {
    mockPruneExpiredRateLimits.mockResolvedValue(0);
    const h = await startHarness();
    try {
      const res = await prune(h.base);
      expect(res.status).toBe(200);
      const body = (await res.json()) as { deleted?: number };
      expect(body.deleted).toBe(0);
    } finally {
      await h.close();
    }
  });

  it("returns 500 when pruneExpiredRateLimits throws", async () => {
    mockPruneExpiredRateLimits.mockRejectedValue(new Error("DB gone"));
    const h = await startHarness();
    try {
      const res = await prune(h.base);
      expect(res.status).toBe(500);
      const body = (await res.json()) as { error?: string };
      expect(typeof body.error).toBe("string");
    } finally {
      await h.close();
    }
  });

  it("calls pruneExpiredRateLimits exactly once per request", async () => {
    mockPruneExpiredRateLimits.mockResolvedValue(5);
    const h = await startHarness();
    try {
      await prune(h.base);
      expect(mockPruneExpiredRateLimits).toHaveBeenCalledTimes(1);
    } finally {
      await h.close();
    }
  });
});
