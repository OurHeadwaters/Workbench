import { describe, it, expect, beforeEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ----------------------- mocks -----------------------
//
// `library.ts` has a single global owner-token gate plus a small set of
// "share-link by-token" endpoints that bypass it (those authenticate via
// the path token instead).  We test the gate end of the contract here —
// upload-flow tests live with the createEntry helper they exercise.
//
// `process.env.LIBRARY_OWNER_TOKEN` MUST be set before `lib/ownerAuth.ts`
// loads, because that module captures it once at import time.

const OWNER_TOKEN = "test-library-owner-token-abcdef";

vi.hoisted(() => {
  process.env.LIBRARY_OWNER_TOKEN = "test-library-owner-token-abcdef";
});

vi.mock("@workspace/db", async () => {
  const { makeTable, makeFakeDb } = await import("../test/fakeDb");
  // Only the tables actually touched by the gate-related endpoints under
  // test.  The other library tables (libraryEntriesTable etc.) are
  // declared so route imports don't crash, but their __store stays empty.
  const shareLinksTable = makeTable({
    name: "share_links",
    pk: ["id"],
    columns: [
      "id",
      "token",
      "label",
      "contributorId",
      "presetSubjectSlugs",
      "presetBucketSlugs",
      "expiresAt",
      "revokedAt",
      "createdAt",
    ],
    defaults: { presetSubjectSlugs: [], presetBucketSlugs: [] },
  });
  const contributorsTable = makeTable({
    name: "contributors",
    pk: ["id"],
    columns: ["id", "name", "organization", "email", "notes", "createdAt"],
  });
  const subjectsTable = makeTable({
    name: "subjects",
    pk: ["id"],
    columns: ["id", "slug", "name", "description", "color", "createdAt"],
  });
  const projectBucketsTable = makeTable({
    name: "project_buckets",
    pk: ["id"],
    columns: ["id", "slug", "name", "description", "color", "createdAt"],
  });
  const libraryEntriesTable = makeTable({
    name: "library_entries",
    pk: ["id"],
    columns: [
      "id",
      "kind",
      "title",
      "summary",
      "notes",
      "status",
      "sourceUrl",
      "screenshotUrl",
      "screenshotObjectPath",
      "storageRef",
      "contentHash",
      "fileSize",
      "contentType",
      "originalFilename",
      "fileType",
      "contactInfo",
      "prices",
      "dates",
      "geography",
      "statusFlag",
      "producerId",
      "contributorId",
      "createdAt",
      "updatedAt",
    ],
  });
  const producersTable = makeTable({
    name: "producers",
    pk: ["id"],
    columns: [
      "id",
      "slug",
      "name",
      "kind",
      "description",
      "websiteUrl",
      "screenshotUrl",
      "contactEmail",
      "contactPhone",
      "location",
      "statusFlag",
      "statusNotes",
      "substituteForProducerSlug",
      "createdAt",
    ],
  });
  const entrySubjectsTable = makeTable({
    name: "entry_subjects",
    pk: ["entryId", "subjectId"],
    columns: ["entryId", "subjectId"],
  });
  const entryBucketsTable = makeTable({
    name: "entry_buckets",
    pk: ["entryId", "bucketId"],
    columns: ["entryId", "bucketId"],
  });
  return {
    db: makeFakeDb(),
    shareLinksTable,
    contributorsTable,
    subjectsTable,
    projectBucketsTable,
    libraryEntriesTable,
    producersTable,
    entrySubjectsTable,
    entryBucketsTable,
  };
});

vi.mock("drizzle-orm", async () => {
  const { fakeDrizzle } = await import("../test/fakeDb");
  return fakeDrizzle;
});

// `library.ts` instantiates `new ObjectStorageService()` at module load and
// the constructor reaches into `@google-cloud/storage`, which is happy to
// initialise without credentials but registers no real bucket.  No
// gate-related test path actually calls into storage, so the default
// constructor is fine.

import express from "express";
import libraryRouter from "./library";
import * as dbModule from "@workspace/db";
import type { FakeTable } from "../test/fakeDb";

const tables = dbModule as unknown as {
  shareLinksTable: FakeTable;
  contributorsTable: FakeTable;
  subjectsTable: FakeTable;
  projectBucketsTable: FakeTable;
  libraryEntriesTable: FakeTable;
};

// ----------------------- harness -----------------------

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/api/library", libraryRouter);
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
  tables.shareLinksTable.__store.length = 0;
  tables.contributorsTable.__store.length = 0;
  tables.subjectsTable.__store.length = 0;
  tables.projectBucketsTable.__store.length = 0;
  tables.libraryEntriesTable.__store.length = 0;
});

// ----------------------- tests -----------------------

describe("library route — owner token gate", () => {
  it("rejects an unauthenticated GET /owner/me with 401", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/library/owner/me`);
      expect(res.status).toBe(401);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("Unauthorized");
    } finally {
      await h.close();
    }
  });

  it("rejects a request with the wrong owner token", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/library/owner/me`, {
        headers: { "x-library-owner-token": "not-the-real-token" },
      });
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });

  it("accepts the right owner token via x-library-owner-token", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/library/owner/me`, {
        headers: authHeaders(),
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { ok?: boolean };
      expect(body.ok).toBe(true);
    } finally {
      await h.close();
    }
  });

  it("accepts the right owner token via Bearer authorization header", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/library/owner/me`, {
        headers: { authorization: `Bearer ${OWNER_TOKEN}` },
      });
      expect(res.status).toBe(200);
    } finally {
      await h.close();
    }
  });

  it("rejects unauth'd requests to non-public paths before reaching the handler", async () => {
    // Picks an arbitrary owner-only path: if the gate ever forgets to
    // 401 a path, this test will fail loudly with whatever the handler
    // would have returned.
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/library/needs-review`);
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });
});

describe("library route — owner login bypasses the gate", () => {
  it("rejects POST /owner/login with the wrong passphrase", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/library/owner/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ passphrase: "nope" }),
      });
      expect(res.status).toBe(401);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toBe("Wrong passphrase");
    } finally {
      await h.close();
    }
  });

  it("returns the token verbatim on POST /owner/login with the right passphrase", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/library/owner/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ passphrase: OWNER_TOKEN }),
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { ok?: boolean; token?: string };
      expect(body.ok).toBe(true);
      expect(body.token).toBe(OWNER_TOKEN);
    } finally {
      await h.close();
    }
  });
});

describe("library route — share-link by-token bypasses the gate", () => {
  it("returns 404 when the token does not exist (no auth required)", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(
        `${h.base}/api/library/share-links/by-token/no-such-token`,
      );
      expect(res.status).toBe(404);
    } finally {
      await h.close();
    }
  });

  it("returns 404 when the share link has been revoked", async () => {
    const h = await startHarness();
    try {
      const contributorId = seedContributor("alice", "Alice");
      seedShareLink({
        token: "alice-revoked",
        contributorId,
        revokedAt: new Date(),
      });
      const res = await fetch(
        `${h.base}/api/library/share-links/by-token/alice-revoked`,
      );
      // Revoked links return 404 (not 410) — the route deliberately
      // hides whether a token ever existed.
      expect(res.status).toBe(404);
    } finally {
      await h.close();
    }
  });

  it("returns 410 when the share link has expired", async () => {
    const h = await startHarness();
    try {
      const contributorId = seedContributor("bob", "Bob");
      seedShareLink({
        token: "bob-expired",
        contributorId,
        expiresAt: new Date(Date.now() - 60_000),
      });
      const res = await fetch(
        `${h.base}/api/library/share-links/by-token/bob-expired`,
      );
      expect(res.status).toBe(410);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toMatch(/expired/i);
    } finally {
      await h.close();
    }
  });

  it("returns the contributor scope for an active share link", async () => {
    const h = await startHarness();
    try {
      const contributorId = seedContributor("carol", "Carol");
      seedShareLink({
        token: "carol-active",
        contributorId,
        label: "Carol's link",
      });
      const res = await fetch(
        `${h.base}/api/library/share-links/by-token/carol-active`,
      );
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        token: string;
        label: string | null;
        contributorName: string;
      };
      expect(body.token).toBe("carol-active");
      expect(body.label).toBe("Carol's link");
      // Contributor lookup must scope to the link's contributorId — if
      // the route ever pulled a different contributor we'd see "Alice"
      // or similar leak through.
      expect(body.contributorName).toBe("Carol");
    } finally {
      await h.close();
    }
  });

  it("does not leak across contributors when two share links exist", async () => {
    const h = await startHarness();
    try {
      const aliceId = seedContributor("alice", "Alice");
      const bobId = seedContributor("bob", "Bob");
      seedShareLink({ token: "alice-link", contributorId: aliceId });
      seedShareLink({ token: "bob-link", contributorId: bobId });

      const aliceRes = await fetch(
        `${h.base}/api/library/share-links/by-token/alice-link`,
      );
      const bobRes = await fetch(
        `${h.base}/api/library/share-links/by-token/bob-link`,
      );
      const aliceBody = (await aliceRes.json()) as { contributorName: string };
      const bobBody = (await bobRes.json()) as { contributorName: string };
      expect(aliceBody.contributorName).toBe("Alice");
      expect(bobBody.contributorName).toBe("Bob");
    } finally {
      await h.close();
    }
  });
});

// ----------------------- helpers -----------------------

function seedContributor(slug: string, name: string): string {
  const id = `00000000-0000-0000-0000-${slug.padEnd(12, "0").slice(0, 12)}`;
  tables.contributorsTable.__store.push({
    id,
    name,
    organization: null,
    email: null,
    notes: null,
    createdAt: new Date(),
  });
  return id;
}

function seedShareLink(opts: {
  token: string;
  contributorId: string;
  label?: string | null;
  expiresAt?: Date | null;
  revokedAt?: Date | null;
  presetSubjectSlugs?: string[];
  presetBucketSlugs?: string[];
}): string {
  const id = `11111111-0000-0000-0000-${opts.token.padEnd(12, "0").slice(0, 12).replace(/[^a-z0-9]/gi, "0")}`;
  tables.shareLinksTable.__store.push({
    id,
    token: opts.token,
    label: opts.label ?? null,
    contributorId: opts.contributorId,
    presetSubjectSlugs: opts.presetSubjectSlugs ?? [],
    presetBucketSlugs: opts.presetBucketSlugs ?? [],
    expiresAt: opts.expiresAt ?? null,
    revokedAt: opts.revokedAt ?? null,
    createdAt: new Date(),
  });
  return id;
}
