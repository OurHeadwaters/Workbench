import { describe, it, expect, beforeEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ----------------------- mocks -----------------------
//
// Mirror the pattern used by `checkin.test.ts` / `wordpile.test.ts`:
// hoist the env var so `lib/ownerAuth.ts` reads it on import; mock
// `@workspace/db` and `drizzle-orm` against the in-memory fakeDb so we
// can assert what got written without touching Postgres.

const OWNER_TOKEN = "test-ship-manifest-owner-token-9001";

vi.hoisted(() => {
  process.env.LIBRARY_OWNER_TOKEN = "test-ship-manifest-owner-token-9001";
  delete process.env.RESEND_API_KEY;
});

vi.mock("@workspace/db", async () => {
  const { makeTable, makeFakeDb } = await import("../test/fakeDb");
  const shipManifestTable = makeTable({
    name: "ship_manifest",
    pk: ["id"],
    columns: [
      "id",
      "email",
      "name",
      "org",
      "role",
      "wouldBring",
      "wouldWant",
      "createdAt",
      "updatedAt",
      "notificationStatus",
      "replyStatus",
      "notificationError",
      "replyError",
      "sourceIp",
      "userAgent",
    ],
    defaults: {
      createdAt: new Date(0),
      updatedAt: new Date(0),
      notificationStatus: null,
      replyStatus: null,
      notificationError: null,
      replyError: null,
    },
  });
  return { db: makeFakeDb(), shipManifestTable };
});

vi.mock("drizzle-orm", async () => {
  const { fakeDrizzle } = await import("../test/fakeDb");
  return fakeDrizzle;
});

import express from "express";
import shipManifestRouter from "./shipManifest";
import * as dbModule from "@workspace/db";
import type { FakeTable } from "../test/fakeDb";
import { __resetRateLimitForTests } from "../lib/rateLimit";

const shipManifestTable = (
  dbModule as unknown as { shipManifestTable: FakeTable }
).shipManifestTable;

// ----------------------- harness -----------------------

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/api/ship-manifest", shipManifestRouter);
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

function ownerHeaders(): Record<string, string> {
  return { "x-library-owner-token": OWNER_TOKEN };
}

beforeEach(async () => {
  shipManifestTable.__store.length = 0;
  await __resetRateLimitForTests();
});

// ----------------------- tests -----------------------

describe("ship-manifest · public POST", () => {
  it("saves a valid sign-on and confirms in-place", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/ship-manifest/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Bobbie Parr",
          email: "bobbie@example.com",
          org: "Headwaters",
          role: "Practitioner",
          wouldBring: "the deer-lake know-how",
          wouldWant: "a second anchor community",
        }),
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { ok: boolean; confirmed: boolean };
      expect(body.ok).toBe(true);
      expect(body.confirmed).toBe(true);
      expect(shipManifestTable.__store.length).toBe(1);
      const row = shipManifestTable.__store[0]!;
      expect(row.email).toBe("bobbie@example.com");
      expect(row.notificationStatus).toBe("skipped");
      expect(row.replyStatus).toBe("skipped");
    } finally {
      await h.close();
    }
  });

  it("upserts by email — second sign-on overwrites the first", async () => {
    const h = await startHarness();
    try {
      await fetch(`${h.base}/api/ship-manifest/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Bobbie",
          email: "bobbie@example.com",
          wouldBring: "v1",
        }),
      });
      const res = await fetch(`${h.base}/api/ship-manifest/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Bobbie Parr",
          email: "bobbie@example.com",
          wouldBring: "v2",
        }),
      });
      expect(res.status).toBe(200);
      expect(shipManifestTable.__store.length).toBe(1);
      const row = shipManifestTable.__store[0]!;
      expect(row.name).toBe("Bobbie Parr");
      expect(row.wouldBring).toBe("v2");
    } finally {
      await h.close();
    }
  });

  it("normalises the email to lowercase before upserting", async () => {
    const h = await startHarness();
    try {
      await fetch(`${h.base}/api/ship-manifest/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "B", email: "MIXED@Case.COM" }),
      });
      await fetch(`${h.base}/api/ship-manifest/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "B", email: "mixed@case.com" }),
      });
      expect(shipManifestTable.__store.length).toBe(1);
      expect(shipManifestTable.__store[0]!.email).toBe("mixed@case.com");
    } finally {
      await h.close();
    }
  });

  it("rejects missing name", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/ship-manifest/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "x@y.com" }),
      });
      expect(res.status).toBe(400);
    } finally {
      await h.close();
    }
  });

  it("rejects an obviously bad email", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/ship-manifest/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "X", email: "not-an-email" }),
      });
      expect(res.status).toBe(400);
    } finally {
      await h.close();
    }
  });

  it("silently drops a honeypot submission with 204", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/ship-manifest/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Bot",
          email: "bot@example.com",
          website: "https://buy-stuff.example",
        }),
      });
      expect(res.status).toBe(204);
      expect(shipManifestTable.__store.length).toBe(0);
    } finally {
      await h.close();
    }
  });

  it("rate-limits a single IP after 5 requests in a minute", async () => {
    const h = await startHarness();
    try {
      // Five different emails so per-email cap doesn't kick in first.
      for (let i = 0; i < 5; i++) {
        const res = await fetch(`${h.base}/api/ship-manifest/`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: `Visitor ${i}`,
            email: `visitor${i}@example.com`,
          }),
        });
        expect(res.status).toBe(200);
      }
      const blocked = await fetch(`${h.base}/api/ship-manifest/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Visitor 6",
          email: "visitor6@example.com",
        }),
      });
      expect(blocked.status).toBe(429);
    } finally {
      await h.close();
    }
  });
});

describe("ship-manifest · owner-gated reads", () => {
  it("rejects unauthenticated GET / with 401", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/ship-manifest/`);
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });

  it("returns rows newest-first to an authenticated owner", async () => {
    const h = await startHarness();
    try {
      // Seed two rows with distinct createdAt so the order test is real.
      shipManifestTable.__store.push(
        {
          id: "older-id",
          email: "older@example.com",
          name: "Older",
          org: null,
          role: null,
          wouldBring: null,
          wouldWant: null,
          createdAt: new Date("2026-04-01T00:00:00Z"),
          updatedAt: new Date("2026-04-01T00:00:00Z"),
          notificationStatus: "sent",
          replyStatus: "sent",
          notificationError: null,
          replyError: null,
          sourceIp: null,
          userAgent: null,
        },
        {
          id: "newer-id",
          email: "newer@example.com",
          name: "Newer",
          org: "Lab",
          role: "Crew",
          wouldBring: null,
          wouldWant: null,
          createdAt: new Date("2026-04-29T00:00:00Z"),
          updatedAt: new Date("2026-04-29T00:00:00Z"),
          notificationStatus: "sent",
          replyStatus: "sent",
          notificationError: null,
          replyError: null,
          sourceIp: null,
          userAgent: null,
        },
      );
      const res = await fetch(`${h.base}/api/ship-manifest/`, {
        headers: ownerHeaders(),
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        count: number;
        entries: { name: string }[];
      };
      expect(body.count).toBe(2);
      expect(body.entries.map((e) => e.name)).toEqual(["Newer", "Older"]);
    } finally {
      await h.close();
    }
  });

  it("rejects unauthenticated CSV export with 401", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/ship-manifest/export.csv`);
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });

  it("returns CSV with a header to an authenticated owner", async () => {
    const h = await startHarness();
    try {
      shipManifestTable.__store.push({
        id: "csv-id",
        email: "csv@example.com",
        name: "Comma, Person",
        org: null,
        role: null,
        wouldBring: 'has "quotes" in it',
        wouldWant: null,
        createdAt: new Date("2026-04-29T00:00:00Z"),
        updatedAt: new Date("2026-04-29T00:00:00Z"),
        notificationStatus: "sent",
        replyStatus: "sent",
        notificationError: null,
        replyError: null,
        sourceIp: null,
        userAgent: null,
      });
      const res = await fetch(`${h.base}/api/ship-manifest/export.csv`, {
        headers: ownerHeaders(),
      });
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toMatch(/text\/csv/);
      const text = await res.text();
      const [header, row] = text.trim().split("\n");
      expect(header).toContain("name");
      expect(header).toContain("email");
      expect(row).toContain('"Comma, Person"');
      expect(row).toContain('"has ""quotes"" in it"');
    } finally {
      await h.close();
    }
  });
});
