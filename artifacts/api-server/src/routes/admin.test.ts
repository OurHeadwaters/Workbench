import { describe, it, expect, beforeEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ── Hoisted mocks ─────────────────────────────────────────────────────────────
// vi.mock factories are hoisted before variable declarations, so any values
// they close over must also be hoisted via vi.hoisted().

const { mockPruneExpiredRateLimits, authState, mockDb, mockGetKit, mockSendKitDeliveryEmail } =
  vi.hoisted(() => ({
    mockPruneExpiredRateLimits: vi.fn<() => Promise<number | null>>(),
    authState: { pass: true },
    mockDb: {
      select: vi.fn(),
      update: vi.fn(),
    },
    mockGetKit: vi.fn(),
    mockSendKitDeliveryEmail: vi.fn(),
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

vi.mock("../lib/kitsRegistry", () => ({
  getKit: mockGetKit,
}));

vi.mock("../lib/kitsMailer", () => ({
  sendKitDeliveryEmail: mockSendKitDeliveryEmail,
}));

// Mock @workspace/db — drizzle query builder chain
const makeSelectChain = (rows: unknown[]) => {
  // The chain must be awaitable at any step (drizzle resolves when you await
  // the builder directly) AND support further chaining (for .limit() calls).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: Record<string, any> = {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue(rows),
    // Make the chain itself awaitable (drizzle builder can be awaited at any step)
    then: (resolve: (value: unknown[]) => unknown, reject: (reason: unknown) => unknown) =>
      Promise.resolve(rows).then(resolve, reject),
  };
  return chain;
};

const makeUpdateChain = () => {
  const chain = {
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue(undefined),
  };
  return chain;
};

vi.mock("@workspace/db", () => {
  return {
    db: mockDb,
    kitDeliveryFailuresTable: {
      id: "id",
      buyerEmail: "buyer_email",
      kitId: "kit_id",
      purchaseId: "purchase_id",
      error: "error",
      resolvedAt: "resolved_at",
      createdAt: "created_at",
    },
    kitTokensTable: {
      purchaseId: "purchase_id",
      token: "token",
      buyerName: "buyer_name",
      expiresAt: "expires_at",
    },
    isNull: vi.fn((col) => ({ type: "isNull", col })),
    eq: vi.fn((col, val) => ({ type: "eq", col, val })),
    gt: vi.fn((col, val) => ({ type: "gt", col, val })),
    desc: vi.fn((col) => ({ type: "desc", col })),
  };
});

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

function listFailures(base: string): Promise<Response> {
  return fetch(`${base}/api/admin/kit-failures`);
}

function patchFailure(base: string, id: string, body: Record<string, unknown>): Promise<Response> {
  return fetch(`${base}/api/admin/kit-failures/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const SAMPLE_FAILURE = {
  id: "failure-uuid-1",
  buyerEmail: "buyer@example.com",
  kitId: "community-money-machine",
  purchaseId: "pi_abc123",
  error: "gmail 500: upstream error",
  resolvedAt: null,
  createdAt: new Date("2026-06-01T00:00:00Z"),
};

const SAMPLE_TOKEN = {
  token: "tok_abc",
  kitId: "community-money-machine",
  buyerEmail: "buyer@example.com",
  buyerName: "Alice",
  purchaseId: "pi_abc123",
  createdAt: new Date("2026-06-01T00:00:00Z"),
  expiresAt: new Date("2026-07-01T00:00:00Z"),
};

const SAMPLE_KIT = {
  id: "community-money-machine",
  name: "Community Money Machine",
  contentNote: "Your files are attached.",
  arcNote: null,
};

// ── Tests: rate-limits/prune ──────────────────────────────────────────────────

beforeEach(() => {
  authState.pass = true;
  mockPruneExpiredRateLimits.mockReset();
  mockDb.select.mockReset();
  mockDb.update.mockReset();
  mockGetKit.mockReset();
  mockSendKitDeliveryEmail.mockReset();
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

// ── Tests: GET /api/admin/kit-failures ───────────────────────────────────────

describe("GET /api/admin/kit-failures — auth", () => {
  it("returns 401 when auth fails", async () => {
    authState.pass = false;
    const h = await startHarness();
    try {
      const res = await listFailures(h.base);
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });
});

describe("GET /api/admin/kit-failures — response", () => {
  it("returns empty array when no failures exist", async () => {
    mockDb.select.mockReturnValue(makeSelectChain([]));
    const h = await startHarness();
    try {
      const res = await listFailures(h.base);
      expect(res.status).toBe(200);
      const body = (await res.json()) as { failures: unknown[] };
      expect(body.failures).toEqual([]);
    } finally {
      await h.close();
    }
  });

  it("returns unresolved failure rows", async () => {
    mockDb.select.mockReturnValue(makeSelectChain([SAMPLE_FAILURE]));
    const h = await startHarness();
    try {
      const res = await listFailures(h.base);
      expect(res.status).toBe(200);
      const body = (await res.json()) as { failures: typeof SAMPLE_FAILURE[] };
      expect(body.failures).toHaveLength(1);
      expect(body.failures[0].purchaseId).toBe("pi_abc123");
    } finally {
      await h.close();
    }
  });

  it("returns 500 when DB throws", async () => {
    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockRejectedValue(new Error("DB error")),
    });
    const h = await startHarness();
    try {
      const res = await listFailures(h.base);
      expect(res.status).toBe(500);
      const body = (await res.json()) as { error: string };
      expect(typeof body.error).toBe("string");
    } finally {
      await h.close();
    }
  });
});

// ── Tests: PATCH /api/admin/kit-failures/:id ─────────────────────────────────

describe("PATCH /api/admin/kit-failures/:id — auth", () => {
  it("returns 401 when auth fails", async () => {
    authState.pass = false;
    const h = await startHarness();
    try {
      const res = await patchFailure(h.base, "some-id", { resolve: true });
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });
});

describe("PATCH /api/admin/kit-failures/:id — validation", () => {
  it("returns 400 when body has neither resolve nor retrigger", async () => {
    const h = await startHarness();
    try {
      const res = await patchFailure(h.base, "some-id", {});
      expect(res.status).toBe(400);
    } finally {
      await h.close();
    }
  });

  it("returns 400 when body has resolve: false and retrigger: false", async () => {
    const h = await startHarness();
    try {
      const res = await patchFailure(h.base, "some-id", { resolve: false, retrigger: false });
      expect(res.status).toBe(400);
    } finally {
      await h.close();
    }
  });

  it("returns 400 for invalid body schema", async () => {
    const h = await startHarness();
    try {
      const res = await patchFailure(h.base, "some-id", { resolve: "yes" });
      expect(res.status).toBe(400);
    } finally {
      await h.close();
    }
  });
});

describe("PATCH /api/admin/kit-failures/:id — not found", () => {
  it("returns 404 when row does not exist", async () => {
    mockDb.select.mockReturnValue(makeSelectChain([]));
    const h = await startHarness();
    try {
      const res = await patchFailure(h.base, "nonexistent", { resolve: true });
      expect(res.status).toBe(404);
    } finally {
      await h.close();
    }
  });
});

describe("PATCH /api/admin/kit-failures/:id — resolve only", () => {
  it("marks the row resolved and returns updated row", async () => {
    const resolvedRow = { ...SAMPLE_FAILURE, resolvedAt: new Date() };

    // First select: fetch the row; second select: re-fetch after update
    mockDb.select
      .mockReturnValueOnce(makeSelectChain([SAMPLE_FAILURE]))
      .mockReturnValueOnce(makeSelectChain([resolvedRow]));
    mockDb.update.mockReturnValue(makeUpdateChain());

    const h = await startHarness();
    try {
      const res = await patchFailure(h.base, SAMPLE_FAILURE.id, { resolve: true });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { failure: typeof SAMPLE_FAILURE; redelivery?: unknown };
      expect(body.failure.resolvedAt).not.toBeNull();
      expect(body.redelivery).toBeUndefined();
      expect(mockDb.update).toHaveBeenCalledTimes(1);
    } finally {
      await h.close();
    }
  });

  it("returns 500 when DB update throws", async () => {
    mockDb.select.mockReturnValue(makeSelectChain([SAMPLE_FAILURE]));
    mockDb.update.mockReturnValue({
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockRejectedValue(new Error("update failed")),
    });

    const h = await startHarness();
    try {
      const res = await patchFailure(h.base, SAMPLE_FAILURE.id, { resolve: true });
      expect(res.status).toBe(500);
    } finally {
      await h.close();
    }
  });
});

describe("PATCH /api/admin/kit-failures/:id — retrigger", () => {
  it("returns failed redelivery when kit not in registry", async () => {
    mockDb.select.mockReturnValue(makeSelectChain([SAMPLE_FAILURE]));
    mockGetKit.mockReturnValue(undefined);

    const h = await startHarness();
    try {
      const res = await patchFailure(h.base, SAMPLE_FAILURE.id, { retrigger: true });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { redelivery: { status: string; error?: string } };
      expect(body.redelivery.status).toBe("failed");
      expect(body.redelivery.error).toMatch(/not found in registry/i);
    } finally {
      await h.close();
    }
  });

  it("returns failed redelivery when no token found for purchase", async () => {
    // First: fetch failure row; second: fetch token (empty); third: re-fetch row after (no update)
    mockDb.select
      .mockReturnValueOnce(makeSelectChain([SAMPLE_FAILURE]))
      .mockReturnValueOnce(makeSelectChain([]))
      .mockReturnValueOnce(makeSelectChain([SAMPLE_FAILURE]));
    mockGetKit.mockReturnValue(SAMPLE_KIT);

    const h = await startHarness();
    try {
      const res = await patchFailure(h.base, SAMPLE_FAILURE.id, { retrigger: true });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { redelivery: { status: string; error?: string } };
      expect(body.redelivery.status).toBe("failed");
      expect(body.redelivery.error).toMatch(/no access token/i);
    } finally {
      await h.close();
    }
  });

  it("sends mail, marks resolved, and returns sent status on success", async () => {
    const resolvedRow = { ...SAMPLE_FAILURE, resolvedAt: new Date() };

    mockDb.select
      .mockReturnValueOnce(makeSelectChain([SAMPLE_FAILURE]))   // fetch failure
      .mockReturnValueOnce(makeSelectChain([SAMPLE_TOKEN]))      // fetch token
      .mockReturnValueOnce(makeSelectChain([resolvedRow]));      // re-fetch after update
    mockDb.update.mockReturnValue(makeUpdateChain());
    mockGetKit.mockReturnValue(SAMPLE_KIT);
    mockSendKitDeliveryEmail.mockResolvedValue({ status: "sent", messageId: "msg_123" });

    const h = await startHarness();
    try {
      const res = await patchFailure(h.base, SAMPLE_FAILURE.id, { retrigger: true });
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        failure: typeof SAMPLE_FAILURE;
        redelivery: { status: string };
      };
      expect(body.redelivery.status).toBe("sent");
      expect(body.failure.resolvedAt).not.toBeNull();
      expect(mockSendKitDeliveryEmail).toHaveBeenCalledTimes(1);
      expect(mockDb.update).toHaveBeenCalledTimes(1);
    } finally {
      await h.close();
    }
  });

  it("does NOT mark resolved when mail send fails", async () => {
    const unresolvedRow = { ...SAMPLE_FAILURE };

    mockDb.select
      .mockReturnValueOnce(makeSelectChain([SAMPLE_FAILURE]))
      .mockReturnValueOnce(makeSelectChain([SAMPLE_TOKEN]))
      .mockReturnValueOnce(makeSelectChain([unresolvedRow]));
    mockGetKit.mockReturnValue(SAMPLE_KIT);
    mockSendKitDeliveryEmail.mockResolvedValue({ status: "failed", error: "gmail 500" });

    const h = await startHarness();
    try {
      const res = await patchFailure(h.base, SAMPLE_FAILURE.id, { retrigger: true });
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        failure: typeof SAMPLE_FAILURE;
        redelivery: { status: string };
      };
      expect(body.redelivery.status).toBe("failed");
      expect(mockDb.update).not.toHaveBeenCalled();
    } finally {
      await h.close();
    }
  });

  it("can resolve AND retrigger in one request", async () => {
    const resolvedRow = { ...SAMPLE_FAILURE, resolvedAt: new Date() };

    mockDb.select
      .mockReturnValueOnce(makeSelectChain([SAMPLE_FAILURE]))
      .mockReturnValueOnce(makeSelectChain([SAMPLE_TOKEN]))
      .mockReturnValueOnce(makeSelectChain([resolvedRow]));
    mockDb.update.mockReturnValue(makeUpdateChain());
    mockGetKit.mockReturnValue(SAMPLE_KIT);
    mockSendKitDeliveryEmail.mockResolvedValue({ status: "sent", messageId: "msg_xyz" });

    const h = await startHarness();
    try {
      const res = await patchFailure(h.base, SAMPLE_FAILURE.id, {
        resolve: true,
        retrigger: true,
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        redelivery: { status: string };
        failure: typeof SAMPLE_FAILURE;
      };
      expect(body.redelivery.status).toBe("sent");
      expect(body.failure.resolvedAt).not.toBeNull();
    } finally {
      await h.close();
    }
  });
});
