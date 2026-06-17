import { describe, it, expect, beforeEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ── Hoisted mocks ─────────────────────────────────────────────────────────────
//
// `settings.ts` calls `requireOwnerOrOwnerCurator` on every endpoint.  That
// guard is defined inside the route module and calls four things from
// `../lib/ownerAuth`:
//
//   OWNER_TOKEN      — string | undefined, read as an exported constant
//   isOwnerRequest   — sync check against the raw owner token header
//   extractOwnerToken — pulls a token string from the request headers
//   getCuratorFromToken — async DB look-up that validates session tokens
//
// We hoist an `authState` object so individual tests can choose which of
// the three scenarios they want to exercise:
//
//   "owner-token"    — raw owner token matches → access granted
//   "owner-curator"  — session token belongs to an isOwner curator → access granted
//   "non-owner"      — session token exists but curator.isOwner is false → 401
//   "expired"        — session token exists but DB returns null (expired/revoked) → 401
//   "no-token"       — no token on the request at all → 401

const { authState, mockGetCuratorFromToken, dbState } = vi.hoisted(() => ({
  authState: { mode: "owner-token" as
    | "owner-token"
    | "owner-curator"
    | "non-owner"
    | "expired"
    | "no-token"
  },
  mockGetCuratorFromToken: vi.fn<(token: string | null | undefined) => Promise<{ isOwner: boolean } | null>>(),
  dbState: { shouldFail: false },
}));

vi.mock("../lib/ownerAuth", () => ({
  get OWNER_TOKEN() {
    return authState.mode === "owner-token" ? "secret-owner-tok" : undefined;
  },
  isOwnerRequest(_req: import("express").Request) {
    return authState.mode === "owner-token";
  },
  extractOwnerToken(_req: import("express").Request) {
    if (authState.mode === "no-token") return null;
    return "some-session-token";
  },
  getCuratorFromToken: mockGetCuratorFromToken,
}));

vi.mock("@workspace/db", async () => {
  const { makeTable, makeFakeDb } = await import("../test/fakeDb");

  const appSettingsTable = makeTable({
    name: "app_settings",
    pk: ["key"],
    columns: ["key", "value", "updatedAt"],
    defaults: { updatedAt: null },
  });

  const fakeDb = makeFakeDb();

  // A builder whose every chainable method returns itself and whose
  // thenable always rejects — used when dbState.shouldFail is true.
  function makeFailingBuilder(): Record<string, unknown> {
    const err = new Error("DB connection failure");
    const b: Record<string, unknown> = {};
    for (const m of [
      "from", "where", "limit", "offset", "orderBy",
      "groupBy", "for", "innerJoin", "leftJoin",
      "values", "onConflictDoUpdate", "onConflictDoNothing",
      "returning", "set",
    ]) {
      b[m] = () => b;
    }
    b.then = (
      _resolve: unknown,
      reject?: (e: unknown) => unknown,
    ) =>
      reject
        ? Promise.resolve(reject(err))
        : Promise.reject(err);
    return b;
  }

  const guardedDb = {
    select: (...args: Parameters<typeof fakeDb.select>) =>
      dbState.shouldFail ? makeFailingBuilder() : fakeDb.select(...args),
    selectDistinct: (...args: Parameters<typeof fakeDb.selectDistinct>) =>
      dbState.shouldFail ? makeFailingBuilder() : fakeDb.selectDistinct(...args),
    insert: (...args: Parameters<typeof fakeDb.insert>) =>
      dbState.shouldFail ? makeFailingBuilder() : fakeDb.insert(...args),
    update: (...args: Parameters<typeof fakeDb.update>) =>
      dbState.shouldFail ? makeFailingBuilder() : fakeDb.update(...args),
    delete: (...args: Parameters<typeof fakeDb.delete>) =>
      dbState.shouldFail ? makeFailingBuilder() : fakeDb.delete(...args),
    transaction: (...args: Parameters<typeof fakeDb.transaction>) =>
      dbState.shouldFail
        ? Promise.reject(new Error("DB connection failure"))
        : fakeDb.transaction(...args),
  };

  return {
    db: guardedDb,
    appSettingsTable,
  };
});

vi.mock("drizzle-orm", async () => {
  const { fakeDrizzle } = await import("../test/fakeDb");
  return fakeDrizzle;
});

// ── Import after mocks ────────────────────────────────────────────────────────

import express from "express";
import settingsRouter from "./settings";

// ── Harness ───────────────────────────────────────────────────────────────────

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/api/settings", settingsRouter);
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function get(base: string, path: string, headers?: Record<string, string>): Promise<Response> {
  return fetch(`${base}/api/settings${path}`, { headers });
}

function put(base: string, path: string, body: unknown, headers?: Record<string, string>): Promise<Response> {
  return fetch(`${base}/api/settings${path}`, {
    method: "PUT",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(async () => {
  authState.mode = "owner-token";
  mockGetCuratorFromToken.mockReset();
  dbState.shouldFail = false;

  // Clear the in-memory store between tests by splicing the shared __store.
  // We reach into the mock module to get the table reference.
  const mod = await import("@workspace/db");
  const tbl = (mod as unknown as { appSettingsTable: { __store: unknown[] } }).appSettingsTable;
  tbl.__store.splice(0);
});

// ── Auth scenarios: GET /api/settings/notify-email ───────────────────────────

describe("GET /api/settings/notify-email — auth", () => {
  it("returns 200 when raw owner token is present", async () => {
    authState.mode = "owner-token";
    const h = await startHarness();
    try {
      const res = await get(h.base, "/notify-email");
      expect(res.status).toBe(200);
    } finally {
      await h.close();
    }
  });

  it("returns 200 when a valid owner-curator session token is used", async () => {
    authState.mode = "owner-curator";
    mockGetCuratorFromToken.mockResolvedValue({ isOwner: true });
    const h = await startHarness();
    try {
      const res = await get(h.base, "/notify-email");
      expect(res.status).toBe(200);
    } finally {
      await h.close();
    }
  });

  it("returns 401 when session token belongs to a non-owner curator", async () => {
    authState.mode = "non-owner";
    mockGetCuratorFromToken.mockResolvedValue({ isOwner: false });
    const h = await startHarness();
    try {
      const res = await get(h.base, "/notify-email");
      expect(res.status).toBe(401);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("Unauthorized");
    } finally {
      await h.close();
    }
  });

  it("returns 401 when session token is expired or revoked (getCuratorFromToken returns null)", async () => {
    authState.mode = "expired";
    mockGetCuratorFromToken.mockResolvedValue(null);
    const h = await startHarness();
    try {
      const res = await get(h.base, "/notify-email");
      expect(res.status).toBe(401);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("Unauthorized");
    } finally {
      await h.close();
    }
  });

  it("returns 401 when no token is present at all", async () => {
    authState.mode = "no-token";
    const h = await startHarness();
    try {
      const res = await get(h.base, "/notify-email");
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });
});

// ── Auth scenarios: PUT /api/settings/notify-email ───────────────────────────

describe("PUT /api/settings/notify-email — auth", () => {
  it("returns 200 when raw owner token is present", async () => {
    authState.mode = "owner-token";
    const h = await startHarness();
    try {
      const res = await put(h.base, "/notify-email", { email: "river@example.com" });
      expect(res.status).toBe(200);
    } finally {
      await h.close();
    }
  });

  it("returns 200 when a valid owner-curator session token is used", async () => {
    authState.mode = "owner-curator";
    mockGetCuratorFromToken.mockResolvedValue({ isOwner: true });
    const h = await startHarness();
    try {
      const res = await put(h.base, "/notify-email", { email: "river@example.com" });
      expect(res.status).toBe(200);
    } finally {
      await h.close();
    }
  });

  it("returns 401 when session token belongs to a non-owner curator", async () => {
    authState.mode = "non-owner";
    mockGetCuratorFromToken.mockResolvedValue({ isOwner: false });
    const h = await startHarness();
    try {
      const res = await put(h.base, "/notify-email", { email: "river@example.com" });
      expect(res.status).toBe(401);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("Unauthorized");
    } finally {
      await h.close();
    }
  });

  it("returns 401 when session token is expired or revoked", async () => {
    authState.mode = "expired";
    mockGetCuratorFromToken.mockResolvedValue(null);
    const h = await startHarness();
    try {
      const res = await put(h.base, "/notify-email", { email: "river@example.com" });
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });

  it("returns 401 when no token is present at all", async () => {
    authState.mode = "no-token";
    const h = await startHarness();
    try {
      const res = await put(h.base, "/notify-email", { email: "river@example.com" });
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });
});

// ── Auth scenarios: GET /api/settings/seat-config ────────────────────────────

describe("GET /api/settings/seat-config — auth", () => {
  it("returns 200 when raw owner token is present", async () => {
    authState.mode = "owner-token";
    const h = await startHarness();
    try {
      const res = await get(h.base, "/seat-config");
      expect(res.status).toBe(200);
    } finally {
      await h.close();
    }
  });

  it("returns 200 when a valid owner-curator session token is used", async () => {
    authState.mode = "owner-curator";
    mockGetCuratorFromToken.mockResolvedValue({ isOwner: true });
    const h = await startHarness();
    try {
      const res = await get(h.base, "/seat-config");
      expect(res.status).toBe(200);
    } finally {
      await h.close();
    }
  });

  it("returns 401 when session token belongs to a non-owner curator", async () => {
    authState.mode = "non-owner";
    mockGetCuratorFromToken.mockResolvedValue({ isOwner: false });
    const h = await startHarness();
    try {
      const res = await get(h.base, "/seat-config");
      expect(res.status).toBe(401);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("Unauthorized");
    } finally {
      await h.close();
    }
  });

  it("returns 401 when session token is expired or revoked", async () => {
    authState.mode = "expired";
    mockGetCuratorFromToken.mockResolvedValue(null);
    const h = await startHarness();
    try {
      const res = await get(h.base, "/seat-config");
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });

  it("returns 401 when no token is present at all", async () => {
    authState.mode = "no-token";
    const h = await startHarness();
    try {
      const res = await get(h.base, "/seat-config");
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });
});

// ── Auth scenarios: PUT /api/settings/seat-config ────────────────────────────

describe("PUT /api/settings/seat-config — auth", () => {
  const seatPayload = { seats: { total: 8, reserved: 2 } };

  it("returns 200 when raw owner token is present", async () => {
    authState.mode = "owner-token";
    const h = await startHarness();
    try {
      const res = await put(h.base, "/seat-config", seatPayload);
      expect(res.status).toBe(200);
    } finally {
      await h.close();
    }
  });

  it("returns 200 when a valid owner-curator session token is used", async () => {
    authState.mode = "owner-curator";
    mockGetCuratorFromToken.mockResolvedValue({ isOwner: true });
    const h = await startHarness();
    try {
      const res = await put(h.base, "/seat-config", seatPayload);
      expect(res.status).toBe(200);
    } finally {
      await h.close();
    }
  });

  it("returns 401 when session token belongs to a non-owner curator", async () => {
    authState.mode = "non-owner";
    mockGetCuratorFromToken.mockResolvedValue({ isOwner: false });
    const h = await startHarness();
    try {
      const res = await put(h.base, "/seat-config", seatPayload);
      expect(res.status).toBe(401);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("Unauthorized");
    } finally {
      await h.close();
    }
  });

  it("returns 401 when session token is expired or revoked", async () => {
    authState.mode = "expired";
    mockGetCuratorFromToken.mockResolvedValue(null);
    const h = await startHarness();
    try {
      const res = await put(h.base, "/seat-config", seatPayload);
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });

  it("returns 401 when no token is present at all", async () => {
    authState.mode = "no-token";
    const h = await startHarness();
    try {
      const res = await put(h.base, "/seat-config", seatPayload);
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });
});

// ── Functional: notify-email round-trip ──────────────────────────────────────

describe("notify-email — read/write behaviour (owner-token auth)", () => {
  it("returns { email: null, source: 'unset' } when no setting is stored and no env var", async () => {
    const savedEnv = process.env.RIVER_SMITH_NOTIFY_EMAIL;
    delete process.env.RIVER_SMITH_NOTIFY_EMAIL;
    const h = await startHarness();
    try {
      const res = await get(h.base, "/notify-email");
      expect(res.status).toBe(200);
      const body = (await res.json()) as { email: unknown; source: string };
      expect(body.email).toBeNull();
      expect(body.source).toBe("unset");
    } finally {
      await h.close();
      if (savedEnv !== undefined) process.env.RIVER_SMITH_NOTIFY_EMAIL = savedEnv;
    }
  });

  it("stores and retrieves a valid email", async () => {
    const h = await startHarness();
    try {
      const put1 = await put(h.base, "/notify-email", { email: "notify@example.com" });
      expect(put1.status).toBe(200);

      const get1 = await get(h.base, "/notify-email");
      const body = (await get1.json()) as { email: string; source: string };
      expect(body.email).toBe("notify@example.com");
      expect(body.source).toBe("db");
    } finally {
      await h.close();
    }
  });

  it("clears the stored email when an empty string is PUT", async () => {
    const h = await startHarness();
    try {
      await put(h.base, "/notify-email", { email: "notify@example.com" });
      const clear = await put(h.base, "/notify-email", { email: "" });
      expect(clear.status).toBe(200);
      const body = (await clear.json()) as { email: unknown };
      expect(body.email).toBeNull();
    } finally {
      await h.close();
    }
  });

  it("returns 400 for a syntactically invalid email address", async () => {
    const h = await startHarness();
    try {
      const res = await put(h.base, "/notify-email", { email: "not-an-email" });
      expect(res.status).toBe(400);
    } finally {
      await h.close();
    }
  });
});

// ── Functional: seat-config round-trip ───────────────────────────────────────

describe("seat-config — read/write behaviour (owner-token auth)", () => {
  it("returns { seats: null } when no config is stored", async () => {
    const h = await startHarness();
    try {
      const res = await get(h.base, "/seat-config");
      expect(res.status).toBe(200);
      const body = (await res.json()) as { seats: unknown };
      expect(body.seats).toBeNull();
    } finally {
      await h.close();
    }
  });

  it("stores and retrieves a seats object", async () => {
    const config = { total: 12, reserved: 3, label: "Kitchen Table" };
    const h = await startHarness();
    try {
      const put1 = await put(h.base, "/seat-config", { seats: config });
      expect(put1.status).toBe(200);
      const body1 = (await put1.json()) as { ok: boolean };
      expect(body1.ok).toBe(true);

      const get1 = await get(h.base, "/seat-config");
      const body2 = (await get1.json()) as { seats: typeof config };
      expect(body2.seats).toEqual(config);
    } finally {
      await h.close();
    }
  });

  it("returns 400 when seats is missing from the request body", async () => {
    const h = await startHarness();
    try {
      const res = await put(h.base, "/seat-config", {});
      expect(res.status).toBe(400);
    } finally {
      await h.close();
    }
  });
});

// ── DB failure scenarios ──────────────────────────────────────────────────────

describe("GET /api/settings/notify-email — DB throws", () => {
  it("returns 500 with a safe error message and no stack trace", async () => {
    dbState.shouldFail = true;
    const h = await startHarness();
    try {
      const res = await get(h.base, "/notify-email");
      expect(res.status).toBe(500);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("Failed to read setting");
      expect(Object.keys(body)).toEqual(["error"]);
    } finally {
      await h.close();
    }
  });
});

describe("PUT /api/settings/notify-email — DB throws", () => {
  it("returns 500 with a safe error message and no stack trace when storing an email", async () => {
    dbState.shouldFail = true;
    const h = await startHarness();
    try {
      const res = await put(h.base, "/notify-email", { email: "river@example.com" });
      expect(res.status).toBe(500);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("Failed to save setting");
      expect(Object.keys(body)).toEqual(["error"]);
    } finally {
      await h.close();
    }
  });

  it("returns 500 with a safe error message and no stack trace when clearing the email", async () => {
    dbState.shouldFail = true;
    const h = await startHarness();
    try {
      const res = await put(h.base, "/notify-email", { email: "" });
      expect(res.status).toBe(500);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("Failed to save setting");
      expect(Object.keys(body)).toEqual(["error"]);
    } finally {
      await h.close();
    }
  });
});

describe("GET /api/settings/seat-config — DB throws", () => {
  it("returns 500 with a safe error message and no stack trace", async () => {
    dbState.shouldFail = true;
    const h = await startHarness();
    try {
      const res = await get(h.base, "/seat-config");
      expect(res.status).toBe(500);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("Failed to read seat config");
      expect(Object.keys(body)).toEqual(["error"]);
    } finally {
      await h.close();
    }
  });
});

describe("PUT /api/settings/seat-config — DB throws", () => {
  it("returns 500 with a safe error message and no stack trace", async () => {
    dbState.shouldFail = true;
    const h = await startHarness();
    try {
      const res = await put(h.base, "/seat-config", { seats: { total: 8, reserved: 2 } });
      expect(res.status).toBe(500);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("Failed to save seat config");
      expect(Object.keys(body)).toEqual(["error"]);
    } finally {
      await h.close();
    }
  });
});
