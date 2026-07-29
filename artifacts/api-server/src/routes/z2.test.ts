/**
 * z2 route — server-side tests
 *
 * Covers all documented response codes for GET /api/z2/npub:
 *   200 — authenticated owner, npub returned
 *   412 — LIBRARY_OWNER_TOKEN not configured on the server
 *   401 — token configured but request did not supply it (or supplied wrong one)
 *   503 — Z2_HOUSEHOLD_SEED not set; npub unavailable
 *
 * Both `getZ2Npub` and `isOwnerRequest` / `OWNER_TOKEN` are mocked so the
 * tests run without a real seed, a real token env-var, or a running server.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ─── hoisted state ─────────────────────────────────────────────────────────────
//
// `ownerState` controls which auth scenario the ownerAuth mock presents:
//
//   "configured-valid"   — OWNER_TOKEN is set and the request carries it → 200
//   "configured-invalid" — OWNER_TOKEN is set but the request does not match → 401
//   "not-configured"     — OWNER_TOKEN is undefined → 412
//
// `z2State` controls what `getZ2Npub` returns:
//   { npub: string } → the mocked npub string
//   { npub: null }   → simulates Z2_HOUSEHOLD_SEED absent / derivation failed → 503

const { ownerState, z2State } = vi.hoisted(() => ({
  ownerState: { mode: "configured-valid" as
    | "configured-valid"
    | "configured-invalid"
    | "not-configured"
  },
  z2State: { npub: "npub1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqte6ys" as string | null },
}));

vi.mock("../lib/ownerAuth", () => ({
  get OWNER_TOKEN(): string | undefined {
    return ownerState.mode === "not-configured" ? undefined : "test-owner-token";
  },
  isOwnerRequest(_req: import("express").Request): boolean {
    return ownerState.mode === "configured-valid";
  },
}));

vi.mock("../lib/z2Identity", () => ({
  getZ2Npub(): string | null {
    return z2State.npub;
  },
}));

// ─── imports (after mocks) ────────────────────────────────────────────────────

import express from "express";
import z2Router from "./z2";

// ─── harness ──────────────────────────────────────────────────────────────────

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/api/z2", z2Router);
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

// ─── setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  ownerState.mode = "configured-valid";
  z2State.npub = "npub1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqte6ys";
});

// ─── tests ────────────────────────────────────────────────────────────────────

describe("GET /api/z2/npub — happy path (200)", () => {
  it("returns 200 with the npub when owner token is configured and request is authenticated", async () => {
    ownerState.mode = "configured-valid";
    z2State.npub = "npub1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqte6ys";

    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/z2/npub`);
      expect(res.status).toBe(200);

      const body = (await res.json()) as { npub?: string };
      expect(body.npub).toBe("npub1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqte6ys");
    } finally {
      await h.close();
    }
  });

  it("returns the exact npub string from getZ2Npub — not a stub or transformation", async () => {
    const specificNpub = "npub1abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdes";
    ownerState.mode = "configured-valid";
    z2State.npub = specificNpub;

    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/z2/npub`);
      expect(res.status).toBe(200);

      const body = (await res.json()) as { npub?: string };
      expect(body.npub).toBe(specificNpub);
    } finally {
      await h.close();
    }
  });

  it("response body contains only npub — no seed material or Z1 fields leaked", async () => {
    ownerState.mode = "configured-valid";
    z2State.npub = "npub1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqte6ys";

    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/z2/npub`);
      expect(res.status).toBe(200);

      const body = (await res.json()) as Record<string, unknown>;
      const keys = Object.keys(body);
      expect(keys).toEqual(["npub"]);
    } finally {
      await h.close();
    }
  });
});

describe("GET /api/z2/npub — token not configured (412)", () => {
  it("returns 412 when LIBRARY_OWNER_TOKEN is not set", async () => {
    ownerState.mode = "not-configured";

    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/z2/npub`);
      expect(res.status).toBe(412);

      const body = (await res.json()) as { error?: string; code?: string };
      expect(body.code).toBe("TOKEN_NOT_CONFIGURED");
      expect(body.error).toMatch(/LIBRARY_OWNER_TOKEN/);
    } finally {
      await h.close();
    }
  });

  it("412 response does not leak npub even when Z2 npub is cached", async () => {
    ownerState.mode = "not-configured";
    z2State.npub = "npub1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqte6ys";

    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/z2/npub`);
      expect(res.status).toBe(412);

      const body = (await res.json()) as Record<string, unknown>;
      expect(body).not.toHaveProperty("npub");
    } finally {
      await h.close();
    }
  });
});

describe("GET /api/z2/npub — unauthorized (401)", () => {
  it("returns 401 when OWNER_TOKEN is configured but the request is not authenticated", async () => {
    ownerState.mode = "configured-invalid";

    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/z2/npub`);
      expect(res.status).toBe(401);

      const body = (await res.json()) as { error?: string };
      expect(body.error).toBeTruthy();
    } finally {
      await h.close();
    }
  });

  it("401 response does not leak npub even when Z2 npub is cached", async () => {
    ownerState.mode = "configured-invalid";
    z2State.npub = "npub1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqte6ys";

    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/z2/npub`);
      expect(res.status).toBe(401);

      const body = (await res.json()) as Record<string, unknown>;
      expect(body).not.toHaveProperty("npub");
    } finally {
      await h.close();
    }
  });
});

describe("GET /api/z2/npub — Z2 seed not configured (503)", () => {
  it("returns 503 when getZ2Npub returns null (Z2_HOUSEHOLD_SEED not set)", async () => {
    ownerState.mode = "configured-valid";
    z2State.npub = null;

    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/z2/npub`);
      expect(res.status).toBe(503);

      const body = (await res.json()) as { error?: string };
      expect(body.error).toMatch(/Z2_HOUSEHOLD_SEED/);
    } finally {
      await h.close();
    }
  });

  it("503 body contains error message — no npub field present", async () => {
    ownerState.mode = "configured-valid";
    z2State.npub = null;

    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/z2/npub`);
      expect(res.status).toBe(503);

      const body = (await res.json()) as Record<string, unknown>;
      expect(body).not.toHaveProperty("npub");
      expect(body).toHaveProperty("error");
    } finally {
      await h.close();
    }
  });
});

describe("GET /api/z2/npub — auth gate order (401 beats 503)", () => {
  it("returns 401, not 503, when auth fails and npub is also unavailable", async () => {
    // Ensures the 401 gate runs before the npub check so auth is always enforced
    // even in degraded mode.
    ownerState.mode = "configured-invalid";
    z2State.npub = null;

    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/z2/npub`);
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });

  it("returns 412, not 503, when token is unconfigured and npub is also unavailable", async () => {
    // Ensures the 412 gate runs before the npub check.
    ownerState.mode = "not-configured";
    z2State.npub = null;

    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/z2/npub`);
      expect(res.status).toBe(412);
    } finally {
      await h.close();
    }
  });
});
