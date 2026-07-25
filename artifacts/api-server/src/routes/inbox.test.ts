import { describe, it, expect, beforeEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ── Hoisted mocks ─────────────────────────────────────────────────────────────
//
// inbox.ts uses a simple requireOwner guard that checks two things from
// ../lib/ownerAuth:
//
//   OWNER_TOKEN      — string | undefined, read as an exported constant
//   isOwnerRequest   — sync check: does the request carry the valid owner token?
//
// We hoist an `authState` so individual tests can flip between:
//
//   authorized   true  → OWNER_TOKEN is set AND isOwnerRequest returns true → allowed
//   authorized   false → OWNER_TOKEN is undefined → always 401
//
// We also hoist `connectorState` so tests can control what the mocked Gmail
// connector returns without touching real network calls.

const { authState, connectorState } = vi.hoisted(() => ({
  authState: { authorized: true as boolean },
  connectorState: {
    threads: [] as Array<{ id: string; snippet: string }>,
    gmailError: null as null | { message: string; status?: string },
    proxyFails: false as boolean,
  },
}));

vi.mock("../lib/ownerAuth", () => ({
  get OWNER_TOKEN() {
    return authState.authorized ? "secret-owner-tok" : undefined;
  },
  isOwnerRequest() {
    return authState.authorized;
  },
}));

// Mock the Replit connectors SDK so no real Gmail calls are made.
// The proxy mock branches on the URL path:
//   …/threads?…   → list call  (returns threadList or gmailError)
//   …/threads/:id → detail call (returns a minimal message object)
//   …/threads?maxResults=1 (probe) → same list mock
vi.mock("@replit/connectors-sdk", () => {
  class ReplitConnectors {
    async proxy(_service: string, path: string, _opts: unknown) {
      if (connectorState.proxyFails) throw new Error("network error");

      const isDetail = /\/threads\/[^?]+/.test(path) && !path.includes("?maxResults");
      if (isDetail) {
        const match = path.match(/\/threads\/([^?/]+)/);
        const id = match?.[1] ?? "t1";
        return {
          json: async () => ({
            id,
            snippet: "A test snippet",
            messages: [
              {
                id: "m1",
                payload: {
                  headers: [
                    { name: "Subject", value: "Test subject" },
                    { name: "From", value: "sender@example.com" },
                    { name: "Date", value: new Date().toISOString() },
                  ],
                },
              },
            ],
          }),
        };
      }

      return {
        json: async () => ({
          threads: connectorState.gmailError ? undefined : connectorState.threads,
          error: connectorState.gmailError ?? undefined,
        }),
      };
    }
  }
  return { ReplitConnectors };
});

// ── Import after mocks ────────────────────────────────────────────────────────

import express from "express";
import inboxRouter from "./inbox";

// ── Harness ───────────────────────────────────────────────────────────────────

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/api/inbox", inboxRouter);
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

function get(base: string, path: string, headers?: Record<string, string>): Promise<Response> {
  return fetch(`${base}/api/inbox${path}`, { headers });
}

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  authState.authorized = true;
  connectorState.threads = [];
  connectorState.gmailError = null;
  connectorState.proxyFails = false;
});

// ── Auth: GET /inbox/threads ──────────────────────────────────────────────────

describe("GET /api/inbox/threads — auth gate", () => {
  it("returns 200 when the owner token is present and valid", async () => {
    authState.authorized = true;
    const h = await startHarness();
    try {
      const res = await get(h.base, "/threads?accountId=acc-pj-main");
      expect(res.status).toBe(200);
    } finally {
      await h.close();
    }
  });

  it("returns 401 when no valid owner token is present", async () => {
    authState.authorized = false;
    const h = await startHarness();
    try {
      const res = await get(h.base, "/threads?accountId=acc-pj-main");
      expect(res.status).toBe(401);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("Unauthorized");
    } finally {
      await h.close();
    }
  });
});

// ── Auth: GET /inbox/threads/all ─────────────────────────────────────────────

describe("GET /api/inbox/threads/all — auth gate", () => {
  it("returns 200 when the owner token is present and valid", async () => {
    authState.authorized = true;
    const h = await startHarness();
    try {
      const res = await get(h.base, "/threads/all?accountIds=acc-pj-main");
      expect(res.status).toBe(200);
    } finally {
      await h.close();
    }
  });

  it("returns 401 when no valid owner token is present", async () => {
    authState.authorized = false;
    const h = await startHarness();
    try {
      const res = await get(h.base, "/threads/all?accountIds=acc-pj-main");
      expect(res.status).toBe(401);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("Unauthorized");
    } finally {
      await h.close();
    }
  });
});

// ── Auth: GET /inbox/accounts/status ─────────────────────────────────────────

describe("GET /api/inbox/accounts/status — auth gate", () => {
  it("returns 200 when the owner token is present and valid", async () => {
    authState.authorized = true;
    const h = await startHarness();
    try {
      const res = await get(h.base, "/accounts/status?accountIds=acc-pj-main");
      expect(res.status).toBe(200);
    } finally {
      await h.close();
    }
  });

  it("returns 401 when no valid owner token is present", async () => {
    authState.authorized = false;
    const h = await startHarness();
    try {
      const res = await get(h.base, "/accounts/status?accountIds=acc-pj-main");
      expect(res.status).toBe(401);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("Unauthorized");
    } finally {
      await h.close();
    }
  });
});

// ── Auth: GET /inbox/archive ──────────────────────────────────────────────────

describe("GET /api/inbox/archive — auth gate", () => {
  it("returns 200 when the owner token is present and valid (empty query returns empty array)", async () => {
    authState.authorized = true;
    const h = await startHarness();
    try {
      const res = await get(h.base, "/archive?q=invoice");
      expect(res.status).toBe(200);
    } finally {
      await h.close();
    }
  });

  it("returns 401 when no valid owner token is present", async () => {
    authState.authorized = false;
    const h = await startHarness();
    try {
      const res = await get(h.base, "/archive?q=invoice");
      expect(res.status).toBe(401);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("Unauthorized");
    } finally {
      await h.close();
    }
  });
});

// ── Functional: /inbox/threads/all — authorized, threads returned ─────────────

describe("GET /api/inbox/threads/all — functional (authorized)", () => {
  it("returns threads and accountStatuses when connector provides results", async () => {
    connectorState.threads = [{ id: "thread-abc", snippet: "Hello from test" }];
    const h = await startHarness();
    try {
      const res = await get(
        h.base,
        "/threads/all?accountIds=acc-pj-main&accountLabels=acc-pj-main:PJ+Main",
      );
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        threads: Array<{ id: string; accountId: string; accountLabel: string }>;
        accountStatuses: Record<string, string>;
      };
      expect(Array.isArray(body.threads)).toBe(true);
      expect(body.threads[0]?.id).toBe("thread-abc");
      expect(body.threads[0]?.accountId).toBe("acc-pj-main");
      expect(body.threads[0]?.accountLabel).toBe("PJ Main");
      expect(body.accountStatuses["acc-pj-main"]).toBe("ok");
    } finally {
      await h.close();
    }
  });

  it("marks an account as no-connection when accountId is not in the registry", async () => {
    const h = await startHarness();
    try {
      const res = await get(
        h.base,
        "/threads/all?accountIds=acc-unknown-xyz",
      );
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        threads: unknown[];
        accountStatuses: Record<string, string>;
      };
      expect(body.accountStatuses["acc-unknown-xyz"]).toBe("no-connection");
      expect(body.threads).toHaveLength(0);
    } finally {
      await h.close();
    }
  });

  it("marks an account as scope when Gmail returns an insufficient-permissions error", async () => {
    connectorState.gmailError = {
      message: "Request had insufficient authentication scopes.",
      status: "PERMISSION_DENIED",
    };
    const h = await startHarness();
    try {
      const res = await get(h.base, "/threads/all?accountIds=acc-pj-main");
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        threads: unknown[];
        accountStatuses: Record<string, string>;
      };
      expect(body.accountStatuses["acc-pj-main"]).toBe("scope");
      expect(body.threads).toHaveLength(0);
    } finally {
      await h.close();
    }
  });

  it("marks an account as unavailable when the connector throws a network error", async () => {
    connectorState.proxyFails = true;
    const h = await startHarness();
    try {
      const res = await get(h.base, "/threads/all?accountIds=acc-pj-main");
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        threads: unknown[];
        accountStatuses: Record<string, string>;
      };
      expect(body.accountStatuses["acc-pj-main"]).toBe("unavailable");
      expect(body.threads).toHaveLength(0);
    } finally {
      await h.close();
    }
  });
});

// ── Functional: /inbox/threads — authorized, scope error propagated ───────────

describe("GET /api/inbox/threads — functional (authorized)", () => {
  it("returns 403 when Gmail reports an insufficient-scope error", async () => {
    connectorState.gmailError = {
      message: "Request had insufficient authentication scopes.",
      status: "PERMISSION_DENIED",
    };
    const h = await startHarness();
    try {
      const res = await get(h.base, "/threads?accountId=acc-pj-main");
      expect(res.status).toBe(403);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("insufficient_scope");
    } finally {
      await h.close();
    }
  });

  it("returns 200 with an empty array when no threads match", async () => {
    connectorState.threads = [];
    const h = await startHarness();
    try {
      const res = await get(h.base, "/threads?accountId=acc-pj-main");
      expect(res.status).toBe(200);
      const body = (await res.json()) as unknown[];
      expect(Array.isArray(body)).toBe(true);
      expect(body).toHaveLength(0);
    } finally {
      await h.close();
    }
  });
});
