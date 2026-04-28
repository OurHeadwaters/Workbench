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
  producersTable: FakeTable;
  entrySubjectsTable: FakeTable;
  entryBucketsTable: FakeTable;
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
  tables.producersTable.__store.length = 0;
  tables.entrySubjectsTable.__store.length = 0;
  tables.entryBucketsTable.__store.length = 0;
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

describe("library route — POST /share-links/by-token/:token/uploads", () => {
  // The contributor-facing write path.  All uploads here MUST be scoped to
  // the share link's contributor and land in needs_review — owners review
  // them before they show up in the library proper.

  it("creates a needs_review entry scoped to the link's contributorId", async () => {
    const h = await startHarness();
    try {
      const contributorId = seedContributor("dora", "Dora");
      // Seed an unrelated contributor too, so a regression that pulls
      // any contributor instead of the link's would be visible.
      seedContributor("eve", "Eve");
      seedShareLink({ token: "dora-active", contributorId });

      const res = await fetch(
        `${h.base}/api/library/share-links/by-token/dora-active/uploads`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kind: "file",
            title: "Harvest plan 2026",
            originalFilename: "harvest_plan_2026.pdf",
            contentHash: "sha256:dora-1",
          }),
        },
      );
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        entry: {
          id: string;
          title: string;
          status: string;
          contributorId: string;
        };
        duplicate: boolean;
      };
      expect(body.duplicate).toBe(false);
      expect(body.entry.title).toBe("Harvest plan 2026");
      expect(body.entry.status).toBe("needs_review");
      expect(body.entry.contributorId).toBe(contributorId);

      // Source of truth: the row landed in the table.
      expect(tables.libraryEntriesTable.__store).toHaveLength(1);
      const row = tables.libraryEntriesTable.__store[0]!;
      expect(row.contributorId).toBe(contributorId);
      expect(row.status).toBe("needs_review");
    } finally {
      await h.close();
    }
  });

  it("ignores any contributorId in the body — the link's wins", async () => {
    const h = await startHarness();
    try {
      const linkContributor = seedContributor("frank", "Frank");
      const otherContributor = seedContributor("gina", "Gina");
      seedShareLink({ token: "frank-active", contributorId: linkContributor });

      const res = await fetch(
        `${h.base}/api/library/share-links/by-token/frank-active/uploads`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kind: "file",
            title: "Spoofed contributor attempt",
            // A malicious contributor could try to attribute the upload
            // to someone else.  The route must ignore this.
            contributorId: otherContributor,
            contentHash: "sha256:frank-1",
          }),
        },
      );
      expect(res.status).toBe(200);
      const row = tables.libraryEntriesTable.__store[0]!;
      expect(row.contributorId).toBe(linkContributor);
      expect(row.contributorId).not.toBe(otherContributor);
    } finally {
      await h.close();
    }
  });

  it("applies the link's presetSubjectSlugs and presetBucketSlugs as fixed scopes", async () => {
    const h = await startHarness();
    try {
      const contributorId = seedContributor("hank", "Hank");
      const subjectIds = {
        wildRice: seedSubject("wild-rice", "Wild Rice"),
        traditional: seedSubject("traditional-foods", "Traditional Foods"),
        // An unrelated subject that must NOT get attached.
        unrelated: seedSubject("unrelated", "Unrelated"),
      };
      const bucketIds = {
        deerLake: seedBucket("deer-lake-store", "Deer Lake Store"),
        // An unrelated bucket that must NOT get attached.
        unrelated: seedBucket("unrelated-bucket", "Unrelated Bucket"),
      };
      seedShareLink({
        token: "hank-presets",
        contributorId,
        presetSubjectSlugs: ["wild-rice", "traditional-foods"],
        presetBucketSlugs: ["deer-lake-store"],
      });

      const res = await fetch(
        `${h.base}/api/library/share-links/by-token/hank-presets/uploads`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kind: "file",
            title: "Manoomin notes",
            contentHash: "sha256:hank-1",
          }),
        },
      );
      expect(res.status).toBe(200);
      const row = tables.libraryEntriesTable.__store[0]!;
      const entryId = row.id as string;

      const attachedSubjectIds = tables.entrySubjectsTable.__store
        .filter((r) => r.entryId === entryId)
        .map((r) => r.subjectId);
      expect(attachedSubjectIds).toEqual(
        expect.arrayContaining([subjectIds.wildRice, subjectIds.traditional]),
      );
      expect(attachedSubjectIds).toHaveLength(2);
      expect(attachedSubjectIds).not.toContain(subjectIds.unrelated);

      const attachedBucketIds = tables.entryBucketsTable.__store
        .filter((r) => r.entryId === entryId)
        .map((r) => r.bucketId);
      expect(attachedBucketIds).toEqual([bucketIds.deerLake]);
      expect(attachedBucketIds).not.toContain(bucketIds.unrelated);
    } finally {
      await h.close();
    }
  });

  it("merges the link's preset slugs with any caller-supplied slugs", async () => {
    // The share-link UI lets contributors add their own subjects/buckets
    // on top of what the link enforces.  Both should land on the entry.
    const h = await startHarness();
    try {
      const contributorId = seedContributor("ivy", "Ivy");
      seedSubject("preset-only", "Preset");
      seedSubject("caller-only", "Caller");
      seedShareLink({
        token: "ivy-mix",
        contributorId,
        presetSubjectSlugs: ["preset-only"],
      });

      const res = await fetch(
        `${h.base}/api/library/share-links/by-token/ivy-mix/uploads`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kind: "file",
            title: "Mixed scope",
            subjectSlugs: ["caller-only"],
            contentHash: "sha256:ivy-1",
          }),
        },
      );
      expect(res.status).toBe(200);
      const entryId = tables.libraryEntriesTable.__store[0]!.id as string;
      const slugs = tables.entrySubjectsTable.__store
        .filter((r) => r.entryId === entryId)
        .map((r) =>
          tables.subjectsTable.__store.find((s) => s.id === r.subjectId)?.slug,
        )
        .sort();
      expect(slugs).toEqual(["caller-only", "preset-only"]);
    } finally {
      await h.close();
    }
  });

  it("returns 404 and writes nothing when the link has been revoked", async () => {
    const h = await startHarness();
    try {
      const contributorId = seedContributor("jack", "Jack");
      seedShareLink({
        token: "jack-revoked",
        contributorId,
        revokedAt: new Date(),
      });

      const res = await fetch(
        `${h.base}/api/library/share-links/by-token/jack-revoked/uploads`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kind: "file",
            title: "Should never land",
            contentHash: "sha256:jack-1",
          }),
        },
      );
      expect(res.status).toBe(404);
      expect(tables.libraryEntriesTable.__store).toHaveLength(0);
      expect(tables.entrySubjectsTable.__store).toHaveLength(0);
      expect(tables.entryBucketsTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });

  it("returns 410 and writes nothing when the link has expired", async () => {
    const h = await startHarness();
    try {
      const contributorId = seedContributor("kate", "Kate");
      seedShareLink({
        token: "kate-expired",
        contributorId,
        expiresAt: new Date(Date.now() - 60_000),
      });

      const res = await fetch(
        `${h.base}/api/library/share-links/by-token/kate-expired/uploads`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kind: "file",
            title: "Should never land",
            contentHash: "sha256:kate-1",
          }),
        },
      );
      expect(res.status).toBe(410);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toMatch(/expired/i);
      expect(tables.libraryEntriesTable.__store).toHaveLength(0);
      expect(tables.entrySubjectsTable.__store).toHaveLength(0);
      expect(tables.entryBucketsTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });

  it("returns 404 and writes nothing when the token does not exist", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(
        `${h.base}/api/library/share-links/by-token/no-such-token/uploads`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kind: "file",
            title: "Should never land",
            contentHash: "sha256:nothing",
          }),
        },
      );
      expect(res.status).toBe(404);
      expect(tables.libraryEntriesTable.__store).toHaveLength(0);
      expect(tables.entrySubjectsTable.__store).toHaveLength(0);
      expect(tables.entryBucketsTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });

  it("dedupes by contentHash — second upload returns existing entry, no new row", async () => {
    const h = await startHarness();
    try {
      const contributorId = seedContributor("liam", "Liam");
      seedShareLink({ token: "liam-dedup", contributorId });

      const sharedHash = "sha256:identical-bytes";
      const first = await fetch(
        `${h.base}/api/library/share-links/by-token/liam-dedup/uploads`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kind: "file",
            title: "Original upload",
            contentHash: sharedHash,
          }),
        },
      );
      expect(first.status).toBe(200);
      const firstBody = (await first.json()) as {
        entry: { id: string };
        duplicate: boolean;
      };
      expect(firstBody.duplicate).toBe(false);
      expect(tables.libraryEntriesTable.__store).toHaveLength(1);
      const firstId = firstBody.entry.id;

      const second = await fetch(
        `${h.base}/api/library/share-links/by-token/liam-dedup/uploads`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kind: "file",
            // Different title, same bytes — must be reported as a dup.
            title: "Reupload of the same bytes",
            contentHash: sharedHash,
          }),
        },
      );
      expect(second.status).toBe(200);
      const secondBody = (await second.json()) as {
        entry: { id: string; title: string };
        duplicate: boolean;
      };
      expect(secondBody.duplicate).toBe(true);
      expect(secondBody.entry.id).toBe(firstId);
      // The original title wins — the dup short-circuits before any
      // update would happen.
      expect(secondBody.entry.title).toBe("Original upload");

      // Critical: only one row, ever.
      expect(tables.libraryEntriesTable.__store).toHaveLength(1);
    } finally {
      await h.close();
    }
  });

  it("rejects an invalid body with 400 and writes nothing", async () => {
    // Defensive: makes sure the gate-bypass doesn't accidentally accept
    // payloads that wouldn't pass the owner-CRUD validator either.
    const h = await startHarness();
    try {
      const contributorId = seedContributor("mia", "Mia");
      seedShareLink({ token: "mia-active", contributorId });
      const res = await fetch(
        `${h.base}/api/library/share-links/by-token/mia-active/uploads`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            // Missing required `kind` and `title` fields.
            contentHash: "sha256:bad",
          }),
        },
      );
      expect(res.status).toBe(400);
      expect(tables.libraryEntriesTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });
});

// ----------------------- helpers -----------------------

let _seedCounter = 0;
function seedId(_label: string): string {
  // Returns a valid v4-shaped UUID (hex-only) so server-side UUID
  // validators accept these ids when they show up in request bodies.
  // The label is for human readability only — kept on the call site so
  // the test reads cleanly.
  _seedCounter += 1;
  const hex = _seedCounter.toString(16).padStart(12, "0");
  return `00000000-0000-4000-8000-${hex}`;
}

function seedContributor(slug: string, name: string): string {
  const id = seedId("c0n7");
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
  const id = seedId("5ha7e");
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

function seedSubject(slug: string, name: string): string {
  const id = seedId("5ub");
  tables.subjectsTable.__store.push({
    id,
    slug,
    name,
    description: null,
    color: null,
    createdAt: new Date(),
  });
  return id;
}

function seedBucket(slug: string, name: string): string {
  const id = seedId("buck");
  tables.projectBucketsTable.__store.push({
    id,
    slug,
    name,
    description: null,
    color: null,
    createdAt: new Date(),
  });
  return id;
}
