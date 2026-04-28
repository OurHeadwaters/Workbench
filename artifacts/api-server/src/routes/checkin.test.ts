import { describe, it, expect, beforeEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ----------------------- mocks -----------------------
//
// The router under test reaches into:
//   - `@workspace/db` (real Postgres pool at module load)
//   - `drizzle-orm`   (column comparators)
//   - `process.env.LIBRARY_OWNER_TOKEN` (read once at module load via
//     `lib/ownerAuth.ts`)
//
// The shared `test/fakeDb` helper provides the in-memory replacement.  The
// env var is set inside `vi.hoisted` so it is in place *before*
// `lib/ownerAuth.ts` evaluates `const OWNER_TOKEN = process.env...`.

const OWNER_TOKEN = "test-checkin-owner-token-12345";

vi.hoisted(() => {
  process.env.LIBRARY_OWNER_TOKEN = "test-checkin-owner-token-12345";
});

vi.mock("@workspace/db", async () => {
  const { makeTable, makeFakeDb } = await import("../test/fakeDb");
  const financialSnapshotsTable = makeTable({
    name: "financial_snapshots",
    pk: ["id"],
    columns: [
      "id",
      "year",
      "takenAt",
      "watershedArr",
      "ownerTakeHome",
      "portfolioValue",
      "xrpBalance",
      "xrpPriceUsd",
      "annualLivingExpenses",
      "notes",
    ],
    defaults: { takenAt: new Date(0) },
  });
  return { db: makeFakeDb(), financialSnapshotsTable };
});

vi.mock("drizzle-orm", async () => {
  const { fakeDrizzle } = await import("../test/fakeDb");
  return fakeDrizzle;
});

import express from "express";
import checkinRouter from "./checkin";
import * as dbModule from "@workspace/db";
import type { FakeTable } from "../test/fakeDb";

const financialSnapshotsTable =
  (dbModule as unknown as { financialSnapshotsTable: FakeTable })
    .financialSnapshotsTable;

// ----------------------- harness -----------------------

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/api/check-in", checkinRouter);
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

function authHeaders(): Record<string, string> {
  return { "x-library-owner-token": OWNER_TOKEN };
}

beforeEach(() => {
  financialSnapshotsTable.__store.length = 0;
});

// ----------------------- tests -----------------------

describe("check-in route — owner token gate", () => {
  it("rejects unauthenticated GET /snapshots with 401", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/check-in/snapshots`);
      expect(res.status).toBe(401);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("Unauthorized");
    } finally {
      await h.close();
    }
  });

  it("rejects requests with the wrong owner token", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/check-in/snapshots`, {
        headers: { "x-library-owner-token": "not-the-real-token" },
      });
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });

  it("accepts requests with the right owner token via Bearer auth", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/check-in/owner/me`, {
        headers: { authorization: `Bearer ${OWNER_TOKEN}` },
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { ok?: boolean };
      expect(body.ok).toBe(true);
    } finally {
      await h.close();
    }
  });

  it("rejects POST /snapshots without the owner token (gate runs before validation)", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/check-in/snapshots`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ year: 2026 }),
      });
      // The gate fires before the validator — confirm we get the auth
      // failure and not a "missing field" validation error.
      expect(res.status).toBe(401);
      expect(financialSnapshotsTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });
});

describe("check-in route — owner login bypasses the gate", () => {
  it("rejects POST /owner/login with the wrong passphrase", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/check-in/owner/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ passphrase: "wrong" }),
      });
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });

  it("returns the bearer token on POST /owner/login with the right passphrase", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/check-in/owner/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ passphrase: OWNER_TOKEN }),
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { ok?: boolean; token?: string };
      expect(body.ok).toBe(true);
      // The route returns the passphrase verbatim — that IS the bearer
      // token in this design.  If a future refactor mints a separate
      // session token, this assertion will fail loudly.
      expect(body.token).toBe(OWNER_TOKEN);
    } finally {
      await h.close();
    }
  });

  it("does not require a token to attempt POST /owner/login", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/check-in/owner/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      });
      // 401 from the route handler (wrong/empty passphrase) — NOT 401
      // from the gate.  The body's "Wrong passphrase" message is the tell.
      expect(res.status).toBe(401);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("Wrong passphrase");
    } finally {
      await h.close();
    }
  });
});

describe("check-in route — POST /snapshots validation", () => {
  it("rejects bodies missing required numeric fields", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/check-in/snapshots`, {
        method: "POST",
        headers: { ...authHeaders(), "content-type": "application/json" },
        body: JSON.stringify({ year: 2026 }),
      });
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toMatch(/numeric/i);
      expect(financialSnapshotsTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });

  it("rejects non-integer values for integer-only fields", async () => {
    const h = await startHarness();
    try {
      const valid = validBody();
      const res = await fetch(`${h.base}/api/check-in/snapshots`, {
        method: "POST",
        headers: { ...authHeaders(), "content-type": "application/json" },
        // 215499.50 is the example from the route's own comment — would be
        // silently truncated if the route did Math.floor.
        body: JSON.stringify({ ...valid, watershedArr: 215499.5 }),
      });
      expect(res.status).toBe(400);
      expect(financialSnapshotsTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });

  it("rejects negative numbers", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/check-in/snapshots`, {
        method: "POST",
        headers: { ...authHeaders(), "content-type": "application/json" },
        body: JSON.stringify({ ...validBody(), portfolioValue: -1 }),
      });
      expect(res.status).toBe(400);
    } finally {
      await h.close();
    }
  });

  it("rejects years before 2026 (the schema-enforced minimum)", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/check-in/snapshots`, {
        method: "POST",
        headers: { ...authHeaders(), "content-type": "application/json" },
        body: JSON.stringify({ ...validBody(), year: 2025 }),
      });
      expect(res.status).toBe(400);
    } finally {
      await h.close();
    }
  });

  it("accepts a valid snapshot and returns the serialized row", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/check-in/snapshots`, {
        method: "POST",
        headers: { ...authHeaders(), "content-type": "application/json" },
        body: JSON.stringify(validBody()),
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        snapshot?: { year?: number; xrpPriceUsd?: number; notes?: string };
      };
      expect(body.snapshot?.year).toBe(2026);
      // xrpPriceUsd round-trips as a number (route normalizes the
      // pg-driver string back to Number).
      expect(body.snapshot?.xrpPriceUsd).toBe(2.5);
      expect(financialSnapshotsTable.__store).toHaveLength(1);
    } finally {
      await h.close();
    }
  });
});

describe("check-in route — GET /snapshots ordering", () => {
  it("returns snapshots newest-year first, then by takenAt within a year", async () => {
    const h = await startHarness();
    try {
      // Seed three rows out-of-order so the ordering matters.  We seed
      // through the public POST endpoint so the test exercises the same
      // insert path the production code uses.
      await postSnapshot(h.base, { ...validBody(), year: 2026, notes: "a" });
      // Backfilled older year — must NOT show up first.
      await postSnapshot(h.base, { ...validBody(), year: 2027, notes: "b" });
      // Same-year follow-up — must come before "b" because takenAt is later.
      await postSnapshot(h.base, { ...validBody(), year: 2027, notes: "c" });

      const res = await fetch(`${h.base}/api/check-in/snapshots`, {
        headers: authHeaders(),
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        snapshots: { year: number; notes: string }[];
      };
      expect(body.snapshots.map((s) => `${s.year}:${s.notes}`)).toEqual([
        "2027:c",
        "2027:b",
        "2026:a",
      ]);
    } finally {
      await h.close();
    }
  });

  it("/snapshots/latest returns the top of that ordering or null", async () => {
    const h = await startHarness();
    try {
      const empty = await fetch(`${h.base}/api/check-in/snapshots/latest`, {
        headers: authHeaders(),
      });
      expect(empty.status).toBe(200);
      expect(((await empty.json()) as { snapshot: unknown }).snapshot).toBeNull();

      await postSnapshot(h.base, { ...validBody(), year: 2026, notes: "old" });
      await postSnapshot(h.base, { ...validBody(), year: 2027, notes: "new" });

      const res = await fetch(`${h.base}/api/check-in/snapshots/latest`, {
        headers: authHeaders(),
      });
      const body = (await res.json()) as { snapshot: { notes: string } };
      expect(body.snapshot.notes).toBe("new");
    } finally {
      await h.close();
    }
  });
});

// ----------------------- helpers -----------------------

function validBody(): Record<string, unknown> {
  return {
    year: 2026,
    watershedArr: 100_000,
    ownerTakeHome: 50_000,
    portfolioValue: 25_000,
    xrpBalance: 1_000,
    xrpPriceUsd: 2.5,
    annualLivingExpenses: 30_000,
  };
}

async function postSnapshot(
  base: string,
  body: Record<string, unknown>,
): Promise<void> {
  // The fake's `takenAt` defaults are static, so we stage each insert
  // with a distinguishing takenAt so the ORDER BY can break ties.
  const before = financialSnapshotsTable.__store.length;
  const res = await fetch(`${base}/api/check-in/snapshots`, {
    method: "POST",
    headers: { ...authHeaders(), "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.status !== 200) {
    throw new Error(`postSnapshot failed: ${res.status} ${await res.text()}`);
  }
  // Stamp the just-inserted row with a unique `takenAt` so order tests
  // are deterministic regardless of how fast the loop runs.
  const row = financialSnapshotsTable.__store[before];
  if (row) {
    row.takenAt = new Date(2026, 0, 1, 0, 0, before);
  }
}
