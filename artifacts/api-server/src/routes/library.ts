import { Router, type IRouter, type Request, type Response } from "express";
import {
  ListLibraryEntriesQueryParams,
  CreateLibraryEntryBody,
  UpdateLibraryEntryBody,
  CreateEntryFromUrlBody,
  ListProducersQueryParams,
  CreateProducerBody,
  CreateContributorBody,
  CreateShareLinkBody,
  GetRecentActivityQueryParams,
} from "@workspace/api-zod";
import { db } from "@workspace/db";
import {
  libraryEntriesTable,
  producersTable,
  subjectsTable,
  projectBucketsTable,
  contributorsTable,
  entrySubjectsTable,
  entryBucketsTable,
  shareLinksTable,
} from "@workspace/db";
import { and, desc, asc, eq, ilike, or, sql, inArray } from "drizzle-orm";
import { ObjectStorageService } from "../lib/objectStorage";
import { randomBytes } from "crypto";
import {
  OWNER_TOKEN,
  isValidOwnerToken,
  isOwnerRequest,
} from "../lib/ownerAuth";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

// ----------------------- owner authentication -----------------------
//
// Everything under /api/library/* requires the library owner token EXCEPT
// the contributor-facing share-link endpoints (which authenticate via the
// share token in the URL itself).  Without this, anyone who guessed the
// /library/ paths could browse, edit, or delete every entry and read out
// every contributor's share-link URL.

const PUBLIC_LIBRARY_PREFIXES = [
  "/share-links/by-token/",
  "/owner/login",
];

router.use((req, res, next) => {
  if (PUBLIC_LIBRARY_PREFIXES.some((p) => req.path.startsWith(p))) {
    next();
    return;
  }
  if (!OWNER_TOKEN) {
    res.status(503).json({
      error:
        "Library owner authentication is not configured (LIBRARY_OWNER_TOKEN missing).",
    });
    return;
  }
  if (isOwnerRequest(req)) {
    next();
    return;
  }
  res.status(401).json({ error: "Unauthorized" });
});

// Lightweight endpoint the frontend calls on every load to verify the token
// stored in localStorage is still valid.  Returns 200 if the request reached
// us through the auth gate above, otherwise the gate already 401'd.
router.get("/owner/me", (_req, res) => {
  res.json({ ok: true });
});

// Owner login: verifies a passphrase against LIBRARY_OWNER_TOKEN.  We do not
// mint a separate session token — the passphrase itself becomes the bearer
// token the client stores and replays.  Bypasses the gate above so an
// unauthenticated browser can attempt to log in.
router.post("/owner/login", (req, res) => {
  if (!OWNER_TOKEN) {
    res.status(503).json({
      error:
        "Library owner authentication is not configured (LIBRARY_OWNER_TOKEN missing).",
    });
    return;
  }
  const body = (req.body ?? {}) as { passphrase?: unknown };
  const passphrase =
    typeof body.passphrase === "string" ? body.passphrase : "";
  if (!isValidOwnerToken(passphrase)) {
    res.status(401).json({ error: "Wrong passphrase" });
    return;
  }
  res.json({ ok: true, token: passphrase });
});

// ----------------------- helpers -----------------------

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function coarseFileType(contentType?: string | null, filename?: string | null): string {
  const ct = (contentType || "").toLowerCase();
  const ext = (filename || "").toLowerCase().split(".").pop() || "";
  if (ct.includes("pdf") || ext === "pdf") return "pdf";
  if (ct.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "heic"].includes(ext)) return "image";
  if (ct.includes("spreadsheet") || ct.includes("excel") || ["xlsx", "xls", "csv"].includes(ext)) return "sheet";
  if (ct.includes("word") || ct.includes("document") || ["docx", "doc"].includes(ext)) return "doc";
  if (ct.startsWith("text/") || ["txt", "md"].includes(ext)) return "text";
  return "other";
}

function normalizeFilenameForDedup(filename: string): string {
  // Strip directories, lowercase.
  const base = filename.split(/[\\/]/).pop() || filename;
  const lower = base.toLowerCase().trim();
  // Split into name + extension (last dot only).
  const dot = lower.lastIndexOf(".");
  const stem = dot > 0 ? lower.slice(0, dot) : lower;
  const ext = dot > 0 ? lower.slice(dot + 1) : "";
  // Drop a trailing "_<digits>" timestamp suffix added on import (e.g. "_1777037219932").
  let cleaned = stem.replace(/_+\d{8,}$/g, "");
  // Collapse runs of whitespace and punctuation into single underscores.
  cleaned = cleaned.replace(/[\s._\-()[\]{}]+/g, "_").replace(/^_+|_+$/g, "");
  if (!cleaned) return "";
  return ext ? `${cleaned}.${ext}` : cleaned;
}

function normalizeStorageRef(input?: { storageRef?: string; objectPath?: string }) {
  if (!input) return null;
  if (input.storageRef) return input.storageRef;
  if (input.objectPath) {
    const path = input.objectPath.startsWith("/") ? input.objectPath : `/${input.objectPath}`;
    return `gcs:${path}`;
  }
  return null;
}

async function getOrCreateProducerId(args: {
  producerId?: string;
  producerSlug?: string;
}): Promise<string | null> {
  if (args.producerId) return args.producerId;
  if (!args.producerSlug) return null;
  const slug = args.producerSlug;
  const existing = await db
    .select()
    .from(producersTable)
    .where(eq(producersTable.slug, slug))
    .limit(1);
  if (existing.length) return existing[0]!.id;
  const [created] = await db
    .insert(producersTable)
    .values({ slug, name: slug })
    .returning();
  return created!.id;
}

async function attachTags(entryId: string, subjectSlugs?: string[], bucketSlugs?: string[]) {
  if (subjectSlugs && subjectSlugs.length) {
    const subs = await db
      .select()
      .from(subjectsTable)
      .where(inArray(subjectsTable.slug, subjectSlugs));
    if (subs.length) {
      await db
        .insert(entrySubjectsTable)
        .values(subs.map((s) => ({ entryId, subjectId: s.id })))
        .onConflictDoNothing();
    }
  }
  if (bucketSlugs && bucketSlugs.length) {
    const buckets = await db
      .select()
      .from(projectBucketsTable)
      .where(inArray(projectBucketsTable.slug, bucketSlugs));
    if (buckets.length) {
      await db
        .insert(entryBucketsTable)
        .values(buckets.map((b) => ({ entryId, bucketId: b.id })))
        .onConflictDoNothing();
    }
  }
}

type SerializedEntry = ReturnType<typeof serializeEntryRow>;
function serializeEntryRow(row: typeof libraryEntriesTable.$inferSelect) {
  return {
    id: row.id,
    kind: row.kind as "file" | "web_source",
    title: row.title,
    summary: row.summary ?? null,
    notes: row.notes ?? null,
    status: row.status as "published" | "needs_review",
    sourceUrl: row.sourceUrl ?? null,
    screenshotUrl: row.screenshotUrl ?? null,
    screenshotObjectPath: row.screenshotObjectPath ?? null,
    storageRef: row.storageRef ?? null,
    contentHash: row.contentHash ?? null,
    fileSize: row.fileSize ?? null,
    contentType: row.contentType ?? null,
    originalFilename: row.originalFilename ?? null,
    fileType: row.fileType ?? null,
    contactInfo: (row.contactInfo as Record<string, unknown>) ?? null,
    prices: (row.prices as Record<string, unknown>) ?? null,
    dates: (row.dates as Record<string, unknown>) ?? null,
    geography: (row.geography as Record<string, unknown>) ?? null,
    statusFlag: row.statusFlag ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    producerId: row.producerId ?? null,
    contributorId: row.contributorId ?? null,
  };
}

async function loadEntries(rows: (typeof libraryEntriesTable.$inferSelect)[]) {
  if (!rows.length) return [];
  const entryIds = rows.map((r) => r.id);
  const producerIds = Array.from(
    new Set(rows.map((r) => r.producerId).filter((x): x is string => !!x)),
  );
  const contributorIds = Array.from(
    new Set(rows.map((r) => r.contributorId).filter((x): x is string => !!x)),
  );

  const [producerRows, contributorRows, esRows, ebRows] = await Promise.all([
    producerIds.length
      ? db.select().from(producersTable).where(inArray(producersTable.id, producerIds))
      : Promise.resolve([]),
    contributorIds.length
      ? db
          .select()
          .from(contributorsTable)
          .where(inArray(contributorsTable.id, contributorIds))
      : Promise.resolve([]),
    db
      .select({
        entryId: entrySubjectsTable.entryId,
        subject: subjectsTable,
      })
      .from(entrySubjectsTable)
      .innerJoin(subjectsTable, eq(entrySubjectsTable.subjectId, subjectsTable.id))
      .where(inArray(entrySubjectsTable.entryId, entryIds)),
    db
      .select({
        entryId: entryBucketsTable.entryId,
        bucket: projectBucketsTable,
      })
      .from(entryBucketsTable)
      .innerJoin(projectBucketsTable, eq(entryBucketsTable.bucketId, projectBucketsTable.id))
      .where(inArray(entryBucketsTable.entryId, entryIds)),
  ]);

  const producerMap = new Map(producerRows.map((p) => [p.id, p]));
  const contributorMap = new Map(contributorRows.map((c) => [c.id, c]));
  const subjectsByEntry = new Map<string, (typeof subjectsTable.$inferSelect)[]>();
  for (const r of esRows) {
    const arr = subjectsByEntry.get(r.entryId) || [];
    arr.push(r.subject);
    subjectsByEntry.set(r.entryId, arr);
  }
  const bucketsByEntry = new Map<string, (typeof projectBucketsTable.$inferSelect)[]>();
  for (const r of ebRows) {
    const arr = bucketsByEntry.get(r.entryId) || [];
    arr.push(r.bucket);
    bucketsByEntry.set(r.entryId, arr);
  }

  return rows.map((row) => {
    const base = serializeEntryRow(row);
    const producer = row.producerId ? producerMap.get(row.producerId) : undefined;
    const contributor = row.contributorId ? contributorMap.get(row.contributorId) : undefined;
    return {
      ...base,
      producer: producer
        ? {
            id: producer.id,
            slug: producer.slug,
            name: producer.name,
            kind: producer.kind ?? null,
            description: producer.description ?? null,
            websiteUrl: producer.websiteUrl ?? null,
            screenshotUrl: producer.screenshotUrl ?? null,
            contactEmail: producer.contactEmail ?? null,
            contactPhone: producer.contactPhone ?? null,
            location: producer.location ?? null,
            statusFlag: producer.statusFlag ?? null,
            statusNotes: producer.statusNotes ?? null,
            substituteForProducerSlug: producer.substituteForProducerSlug ?? null,
            entryCount: 0,
          }
        : null,
      contributor: contributor
        ? {
            id: contributor.id,
            name: contributor.name,
            organization: contributor.organization ?? null,
            email: contributor.email ?? null,
            notes: contributor.notes ?? null,
            entryCount: 0,
          }
        : null,
      subjects: (subjectsByEntry.get(row.id) || []).map((s) => ({
        id: s.id,
        slug: s.slug,
        name: s.name,
        description: s.description ?? null,
        color: s.color ?? null,
      })),
      buckets: (bucketsByEntry.get(row.id) || []).map((b) => ({
        id: b.id,
        slug: b.slug,
        name: b.name,
        description: b.description ?? null,
        color: b.color ?? null,
      })),
    };
  });
}

async function loadOneEntry(id: string) {
  const rows = await db
    .select()
    .from(libraryEntriesTable)
    .where(eq(libraryEntriesTable.id, id))
    .limit(1);
  if (!rows.length) return null;
  const [full] = await loadEntries(rows);
  return full ?? null;
}

// ----------------------- stats / overview -----------------------

router.get("/stats", async (_req, res) => {
  const [
    totalsRow,
    needsReviewRow,
    fileCountRow,
    webCountRow,
    producerCountRow,
    subjectCountRow,
    bucketCountRow,
    topSubjects,
    topProducers,
    bucketBreakdown,
    recentRows,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(libraryEntriesTable),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(libraryEntriesTable)
      .where(eq(libraryEntriesTable.status, "needs_review")),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(libraryEntriesTable)
      .where(eq(libraryEntriesTable.kind, "file")),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(libraryEntriesTable)
      .where(eq(libraryEntriesTable.kind, "web_source")),
    db.select({ count: sql<number>`count(*)::int` }).from(producersTable),
    db.select({ count: sql<number>`count(*)::int` }).from(subjectsTable),
    db.select({ count: sql<number>`count(*)::int` }).from(projectBucketsTable),
    db
      .select({
        slug: subjectsTable.slug,
        name: subjectsTable.name,
        color: subjectsTable.color,
        count: sql<number>`count(${entrySubjectsTable.entryId})::int`,
      })
      .from(subjectsTable)
      .leftJoin(entrySubjectsTable, eq(entrySubjectsTable.subjectId, subjectsTable.id))
      .groupBy(subjectsTable.id, subjectsTable.slug, subjectsTable.name, subjectsTable.color)
      .orderBy(desc(sql`count(${entrySubjectsTable.entryId})`))
      .limit(8),
    db
      .select({
        slug: producersTable.slug,
        name: producersTable.name,
        count: sql<number>`count(${libraryEntriesTable.id})::int`,
      })
      .from(producersTable)
      .leftJoin(libraryEntriesTable, eq(libraryEntriesTable.producerId, producersTable.id))
      .groupBy(producersTable.id, producersTable.slug, producersTable.name)
      .orderBy(desc(sql`count(${libraryEntriesTable.id})`))
      .limit(8),
    db
      .select({
        slug: projectBucketsTable.slug,
        name: projectBucketsTable.name,
        color: projectBucketsTable.color,
        count: sql<number>`count(${entryBucketsTable.entryId})::int`,
      })
      .from(projectBucketsTable)
      .leftJoin(entryBucketsTable, eq(entryBucketsTable.bucketId, projectBucketsTable.id))
      .groupBy(
        projectBucketsTable.id,
        projectBucketsTable.slug,
        projectBucketsTable.name,
        projectBucketsTable.color,
      )
      .orderBy(asc(projectBucketsTable.name)),
    db
      .select()
      .from(libraryEntriesTable)
      .orderBy(desc(libraryEntriesTable.updatedAt))
      .limit(8),
  ]);

  const recentEntries = await loadEntries(recentRows);

  res.json({
    totalEntries: totalsRow[0]?.count ?? 0,
    totalProducers: producerCountRow[0]?.count ?? 0,
    totalSubjects: subjectCountRow[0]?.count ?? 0,
    totalBuckets: bucketCountRow[0]?.count ?? 0,
    needsReviewCount: needsReviewRow[0]?.count ?? 0,
    fileCount: fileCountRow[0]?.count ?? 0,
    webSourceCount: webCountRow[0]?.count ?? 0,
    topSubjects: topSubjects.map((s) => ({
      slug: s.slug,
      name: s.name,
      color: s.color ?? null,
      count: s.count,
    })),
    topProducers: topProducers.map((p) => ({
      slug: p.slug,
      name: p.name,
      color: null,
      count: p.count,
    })),
    bucketBreakdown: bucketBreakdown.map((b) => ({
      slug: b.slug,
      name: b.name,
      color: b.color ?? null,
      count: b.count,
    })),
    recentEntries,
  });
});

router.get("/recent", async (req, res) => {
  const parsed = GetRecentActivityQueryParams.safeParse(req.query);
  const limit = parsed.success ? parsed.data.limit ?? 8 : 8;
  const rows = await db
    .select()
    .from(libraryEntriesTable)
    .orderBy(desc(libraryEntriesTable.updatedAt))
    .limit(limit);
  res.json(await loadEntries(rows));
});

// ----------------------- entries CRUD -----------------------

router.get("/entries", async (req, res) => {
  const parsed = ListLibraryEntriesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query" });
    return;
  }
  const q = parsed.data;
  const limit = q.limit ?? 50;
  const offset = q.offset ?? 0;
  const sort = q.sort ?? "recent";

  const conditions = [] as ReturnType<typeof eq>[];
  if (q.search) {
    const term = `%${q.search}%`;
    conditions.push(
      or(
        ilike(libraryEntriesTable.title, term),
        ilike(libraryEntriesTable.summary, term),
        ilike(libraryEntriesTable.notes, term),
        ilike(libraryEntriesTable.originalFilename, term),
        // Producer name match
        sql`EXISTS (
          SELECT 1 FROM ${producersTable}
          WHERE ${producersTable.id} = ${libraryEntriesTable.producerId}
            AND ${producersTable.name} ILIKE ${term}
        )`,
        // Subject name/slug match (tags)
        sql`EXISTS (
          SELECT 1 FROM ${entrySubjectsTable}
          INNER JOIN ${subjectsTable} ON ${subjectsTable.id} = ${entrySubjectsTable.subjectId}
          WHERE ${entrySubjectsTable.entryId} = ${libraryEntriesTable.id}
            AND (${subjectsTable.name} ILIKE ${term} OR ${subjectsTable.slug} ILIKE ${term})
        )`,
        // Bucket name/slug match (tags)
        sql`EXISTS (
          SELECT 1 FROM ${entryBucketsTable}
          INNER JOIN ${projectBucketsTable} ON ${projectBucketsTable.id} = ${entryBucketsTable.bucketId}
          WHERE ${entryBucketsTable.entryId} = ${libraryEntriesTable.id}
            AND (${projectBucketsTable.name} ILIKE ${term} OR ${projectBucketsTable.slug} ILIKE ${term})
        )`,
      ) as ReturnType<typeof eq>,
    );
  }
  if (q.status) conditions.push(eq(libraryEntriesTable.status, q.status));
  if (q.kind) conditions.push(eq(libraryEntriesTable.kind, q.kind));
  if (q.fileType) conditions.push(eq(libraryEntriesTable.fileType, q.fileType));
  if (q.contributorId)
    conditions.push(eq(libraryEntriesTable.contributorId, q.contributorId));

  if (q.producerSlug) {
    const producer = await db
      .select()
      .from(producersTable)
      .where(eq(producersTable.slug, q.producerSlug))
      .limit(1);
    if (producer.length) {
      conditions.push(eq(libraryEntriesTable.producerId, producer[0]!.id));
    } else {
      res.json({ entries: [], total: 0 });
      return;
    }
  }

  if (q.subjectSlug) {
    const slug = q.subjectSlug;
    conditions.push(
      sql`EXISTS (
        SELECT 1 FROM ${entrySubjectsTable}
        INNER JOIN ${subjectsTable} ON ${subjectsTable.id} = ${entrySubjectsTable.subjectId}
        WHERE ${entrySubjectsTable.entryId} = ${libraryEntriesTable.id}
          AND ${subjectsTable.slug} = ${slug}
      )` as ReturnType<typeof eq>,
    );
  }

  if (q.bucketSlug) {
    const slug = q.bucketSlug;
    conditions.push(
      sql`EXISTS (
        SELECT 1 FROM ${entryBucketsTable}
        INNER JOIN ${projectBucketsTable} ON ${projectBucketsTable.id} = ${entryBucketsTable.bucketId}
        WHERE ${entryBucketsTable.entryId} = ${libraryEntriesTable.id}
          AND ${projectBucketsTable.slug} = ${slug}
      )` as ReturnType<typeof eq>,
    );
  }

  const whereClause = conditions.length ? and(...conditions) : undefined;
  const orderClause =
    sort === "title"
      ? asc(libraryEntriesTable.title)
      : sort === "producer"
        ? asc(libraryEntriesTable.producerId)
        : desc(libraryEntriesTable.updatedAt);

  const baseQuery = db.select().from(libraryEntriesTable);
  const filteredQuery = whereClause ? baseQuery.where(whereClause) : baseQuery;
  const rows = await filteredQuery.orderBy(orderClause).limit(limit).offset(offset);
  const countBase = db
    .select({ count: sql<number>`count(*)::int` })
    .from(libraryEntriesTable);
  const totalRow = await (whereClause ? countBase.where(whereClause) : countBase);
  const entries = await loadEntries(rows);
  res.json({ entries, total: totalRow[0]?.count ?? 0 });
});

async function createEntryFromBody(body: unknown, opts?: { contributorId?: string; defaultStatus?: "published" | "needs_review"; fixedSubjectSlugs?: string[]; fixedBucketSlugs?: string[] }) {
  const parsed = CreateLibraryEntryBody.safeParse(body);
  if (!parsed.success) return { error: "Invalid input" as const };
  const data = parsed.data;

  // Dedup by content hash (exact bit-level match)
  if (data.contentHash) {
    const existing = await db
      .select()
      .from(libraryEntriesTable)
      .where(eq(libraryEntriesTable.contentHash, data.contentHash))
      .limit(1);
    if (existing.length) {
      const full = await loadOneEntry(existing[0]!.id);
      return { entry: full!, duplicate: true as const };
    }
  }

  // Near-duplicate detection by normalized original filename.
  // Normalize: lowercase, strip path, drop a trailing "_<digits>" timestamp
  // before the extension, and collapse whitespace/punctuation runs.
  if (data.originalFilename) {
    const normalized = normalizeFilenameForDedup(data.originalFilename);
    if (normalized) {
      const candidates = await db
        .select({
          id: libraryEntriesTable.id,
          originalFilename: libraryEntriesTable.originalFilename,
          fileSize: libraryEntriesTable.fileSize,
        })
        .from(libraryEntriesTable)
        .where(sql`${libraryEntriesTable.originalFilename} IS NOT NULL`);
      const sizeIn = data.fileSize ?? null;
      const match = candidates.find((row) => {
        if (!row.originalFilename) return false;
        const candNorm = normalizeFilenameForDedup(row.originalFilename);
        if (!candNorm || candNorm !== normalized) return false;
        // If both sizes known and they disagree by more than ~1%, treat as
        // distinct (allows minor metadata edits but rejects different files
        // that happen to share a name).
        if (sizeIn !== null && row.fileSize !== null && row.fileSize > 0) {
          const ratio = Math.abs(sizeIn - row.fileSize) / row.fileSize;
          if (ratio > 0.01) return false;
        }
        return true;
      });
      if (match) {
        const full = await loadOneEntry(match.id);
        if (full) return { entry: full, duplicate: true as const };
      }
    }
  }

  const producerId = await getOrCreateProducerId({
    producerId: data.producerId,
    producerSlug: data.producerSlug,
  });

  const storageRef = normalizeStorageRef({
    storageRef: data.storageRef,
    objectPath: data.objectPath,
  });

  const fileType = coarseFileType(data.contentType, data.originalFilename);

  const [created] = await db
    .insert(libraryEntriesTable)
    .values({
      kind: data.kind,
      title: data.title,
      summary: data.summary ?? null,
      notes: data.notes ?? null,
      status: data.status ?? opts?.defaultStatus ?? "published",
      sourceUrl: data.sourceUrl ?? null,
      screenshotUrl: data.screenshotUrl ?? null,
      storageRef,
      contentHash: data.contentHash ?? null,
      fileSize: data.fileSize ?? null,
      contentType: data.contentType ?? null,
      originalFilename: data.originalFilename ?? null,
      fileType: data.kind === "file" ? fileType : null,
      contactInfo: (data.contactInfo as Record<string, unknown>) ?? null,
      prices: (data.prices as Record<string, unknown>) ?? null,
      dates: (data.dates as Record<string, unknown>) ?? null,
      geography: (data.geography as Record<string, unknown>) ?? null,
      statusFlag: data.statusFlag ?? null,
      producerId,
      contributorId: opts?.contributorId ?? data.contributorId ?? null,
    })
    .returning();

  const allSubjects = [
    ...(data.subjectSlugs ?? []),
    ...(opts?.fixedSubjectSlugs ?? []),
  ];
  const allBuckets = [
    ...(data.bucketSlugs ?? []),
    ...(opts?.fixedBucketSlugs ?? []),
  ];
  await attachTags(created!.id, allSubjects, allBuckets);

  const full = await loadOneEntry(created!.id);
  return { entry: full!, duplicate: false as const };
}

router.post("/entries", async (req, res) => {
  const result = await createEntryFromBody(req.body);
  if ("error" in result) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.json({ entry: result.entry, duplicate: result.duplicate });
});

router.get("/entries/:id", async (req, res) => {
  const id = req.params.id;
  const entry = await loadOneEntry(id);
  if (!entry) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(entry);
});

router.patch("/entries/:id", async (req, res) => {
  const id = req.params.id;
  const parsed = UpdateLibraryEntryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const data = parsed.data;
  const existing = await db
    .select()
    .from(libraryEntriesTable)
    .where(eq(libraryEntriesTable.id, id))
    .limit(1);
  if (!existing.length) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  let producerId: string | null | undefined = undefined;
  if (data.producerId !== undefined) producerId = data.producerId;
  else if (data.producerSlug !== undefined) {
    if (data.producerSlug === null) producerId = null;
    else
      producerId = await getOrCreateProducerId({ producerSlug: data.producerSlug });
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (data.title !== undefined) updates.title = data.title;
  if (data.summary !== undefined) updates.summary = data.summary;
  if (data.notes !== undefined) updates.notes = data.notes;
  if (data.statusFlag !== undefined) updates.statusFlag = data.statusFlag;
  if (data.contactInfo !== undefined) updates.contactInfo = data.contactInfo;
  if (data.prices !== undefined) updates.prices = data.prices;
  if (data.dates !== undefined) updates.dates = data.dates;
  if (data.geography !== undefined) updates.geography = data.geography;
  if (data.status !== undefined) updates.status = data.status;
  if (producerId !== undefined) updates.producerId = producerId;

  await db
    .update(libraryEntriesTable)
    .set(updates)
    .where(eq(libraryEntriesTable.id, id));

  if (data.subjectSlugs) {
    await db
      .delete(entrySubjectsTable)
      .where(eq(entrySubjectsTable.entryId, id));
    await attachTags(id, data.subjectSlugs, undefined);
  }
  if (data.bucketSlugs) {
    await db.delete(entryBucketsTable).where(eq(entryBucketsTable.entryId, id));
    await attachTags(id, undefined, data.bucketSlugs);
  }

  const full = await loadOneEntry(id);
  res.json(full);
});

router.delete("/entries/:id", async (req, res) => {
  const id = req.params.id;
  await db.delete(libraryEntriesTable).where(eq(libraryEntriesTable.id, id));
  res.status(204).end();
});

// ----------------------- entry from URL -----------------------

router.post("/entries/from-url", async (req, res) => {
  const parsed = CreateEntryFromUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid URL input" });
    return;
  }
  const { url, producerSlug, subjectSlugs, bucketSlugs, notes } = parsed.data;

  let title = url;
  let summary: string | undefined = undefined;
  let screenshotUrl: string | undefined = undefined;

  // Try Microlink (free public endpoint, has rate limits but adequate for personal use)
  try {
    const ml = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=true`,
      { signal: AbortSignal.timeout(15000) },
    );
    if (ml.ok) {
      const json = (await ml.json()) as {
        status?: string;
        data?: {
          title?: string;
          description?: string;
          screenshot?: { url?: string };
        };
      };
      if (json.status === "success" && json.data) {
        title = json.data.title || title;
        summary = json.data.description || undefined;
        screenshotUrl = json.data.screenshot?.url || undefined;
      }
    }
  } catch (err) {
    req.log.warn({ err }, "Microlink fetch failed; falling back to direct fetch");
  }

  // Fallback: direct fetch + cheerio for title/description
  if (title === url) {
    try {
      const r = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
        headers: { "User-Agent": "NorthernFoodSystemsLibrary/1.0" },
      });
      if (r.ok && (r.headers.get("content-type") || "").includes("html")) {
        const html = await r.text();
        const cheerio = await import("cheerio");
        const $ = cheerio.load(html);
        title =
          $('meta[property="og:title"]').attr("content") ||
          $("title").first().text().trim() ||
          url;
        summary =
          $('meta[property="og:description"]').attr("content") ||
          $('meta[name="description"]').attr("content") ||
          undefined;
        if (!screenshotUrl) {
          screenshotUrl = $('meta[property="og:image"]').attr("content") || undefined;
        }
      }
    } catch (err) {
      req.log.warn({ err }, "Direct fetch failed; using URL as title");
    }
  }

  const producerId = producerSlug
    ? await getOrCreateProducerId({ producerSlug })
    : null;

  const [created] = await db
    .insert(libraryEntriesTable)
    .values({
      kind: "web_source",
      title,
      summary: summary ?? null,
      notes: notes ?? null,
      status: "published",
      sourceUrl: url,
      screenshotUrl: screenshotUrl ?? null,
      producerId,
    })
    .returning();

  await attachTags(created!.id, subjectSlugs, bucketSlugs);
  const full = await loadOneEntry(created!.id);
  res.json(full);
});

// ----------------------- producers -----------------------

router.get("/producers", async (req, res) => {
  const parsed = ListProducersQueryParams.safeParse(req.query);
  const search = parsed.success ? parsed.data.search : undefined;

  const baseQuery = db
    .select({
      producer: producersTable,
      entryCount: sql<number>`count(${libraryEntriesTable.id})::int`,
    })
    .from(producersTable)
    .leftJoin(libraryEntriesTable, eq(libraryEntriesTable.producerId, producersTable.id))
    .groupBy(producersTable.id);
  const filtered = search
    ? baseQuery.where(ilike(producersTable.name, `%${search}%`))
    : baseQuery;
  const rows = await filtered.orderBy(asc(producersTable.name));
  res.json(
    rows.map(({ producer, entryCount }) => ({
      id: producer.id,
      slug: producer.slug,
      name: producer.name,
      kind: producer.kind ?? null,
      description: producer.description ?? null,
      websiteUrl: producer.websiteUrl ?? null,
      screenshotUrl: producer.screenshotUrl ?? null,
      contactEmail: producer.contactEmail ?? null,
      contactPhone: producer.contactPhone ?? null,
      location: producer.location ?? null,
      statusFlag: producer.statusFlag ?? null,
      statusNotes: producer.statusNotes ?? null,
      substituteForProducerSlug: producer.substituteForProducerSlug ?? null,
      entryCount,
    })),
  );
});

router.post("/producers", async (req, res) => {
  const parsed = CreateProducerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid producer" });
    return;
  }
  const data = parsed.data;
  const slug = data.slug && data.slug.length ? slugify(data.slug) : slugify(data.name);
  const [created] = await db
    .insert(producersTable)
    .values({
      slug,
      name: data.name,
      kind: data.kind ?? null,
      description: data.description ?? null,
      websiteUrl: data.websiteUrl ?? null,
      contactEmail: data.contactEmail ?? null,
      contactPhone: data.contactPhone ?? null,
      location: data.location ?? null,
      statusFlag: data.statusFlag ?? null,
      statusNotes: data.statusNotes ?? null,
      substituteForProducerSlug: data.substituteForProducerSlug ?? null,
    })
    .returning();
  res.json({
    id: created!.id,
    slug: created!.slug,
    name: created!.name,
    kind: created!.kind ?? null,
    description: created!.description ?? null,
    websiteUrl: created!.websiteUrl ?? null,
    screenshotUrl: created!.screenshotUrl ?? null,
    contactEmail: created!.contactEmail ?? null,
    contactPhone: created!.contactPhone ?? null,
    location: created!.location ?? null,
    statusFlag: created!.statusFlag ?? null,
    statusNotes: created!.statusNotes ?? null,
    substituteForProducerSlug: created!.substituteForProducerSlug ?? null,
    entryCount: 0,
  });
});

router.get("/producers/:slug", async (req, res) => {
  const slug = req.params.slug;
  const rows = await db
    .select()
    .from(producersTable)
    .where(eq(producersTable.slug, slug))
    .limit(1);
  if (!rows.length) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const producer = rows[0]!;
  const entryRows = await db
    .select()
    .from(libraryEntriesTable)
    .where(eq(libraryEntriesTable.producerId, producer.id))
    .orderBy(desc(libraryEntriesTable.updatedAt));
  const entries = await loadEntries(entryRows);
  res.json({
    id: producer.id,
    slug: producer.slug,
    name: producer.name,
    kind: producer.kind ?? null,
    description: producer.description ?? null,
    websiteUrl: producer.websiteUrl ?? null,
    screenshotUrl: producer.screenshotUrl ?? null,
    contactEmail: producer.contactEmail ?? null,
    contactPhone: producer.contactPhone ?? null,
    location: producer.location ?? null,
    statusFlag: producer.statusFlag ?? null,
    statusNotes: producer.statusNotes ?? null,
    substituteForProducerSlug: producer.substituteForProducerSlug ?? null,
    entryCount: entries.length,
    entries,
  });
});

// ----------------------- subjects / buckets -----------------------

router.get("/subjects", async (_req, res) => {
  const rows = await db
    .select({
      subject: subjectsTable,
      entryCount: sql<number>`count(${entrySubjectsTable.entryId})::int`,
    })
    .from(subjectsTable)
    .leftJoin(entrySubjectsTable, eq(entrySubjectsTable.subjectId, subjectsTable.id))
    .groupBy(subjectsTable.id)
    .orderBy(asc(subjectsTable.name));
  res.json(
    rows.map(({ subject, entryCount }) => ({
      id: subject.id,
      slug: subject.slug,
      name: subject.name,
      description: subject.description ?? null,
      color: subject.color ?? null,
      entryCount,
    })),
  );
});

router.get("/buckets", async (_req, res) => {
  const rows = await db
    .select({
      bucket: projectBucketsTable,
      entryCount: sql<number>`count(${entryBucketsTable.entryId})::int`,
    })
    .from(projectBucketsTable)
    .leftJoin(entryBucketsTable, eq(entryBucketsTable.bucketId, projectBucketsTable.id))
    .groupBy(projectBucketsTable.id)
    .orderBy(asc(projectBucketsTable.name));
  res.json(
    rows.map(({ bucket, entryCount }) => ({
      id: bucket.id,
      slug: bucket.slug,
      name: bucket.name,
      description: bucket.description ?? null,
      color: bucket.color ?? null,
      entryCount,
    })),
  );
});

// ----------------------- contributors -----------------------

router.get("/contributors", async (_req, res) => {
  const rows = await db
    .select({
      contributor: contributorsTable,
      entryCount: sql<number>`count(${libraryEntriesTable.id})::int`,
    })
    .from(contributorsTable)
    .leftJoin(libraryEntriesTable, eq(libraryEntriesTable.contributorId, contributorsTable.id))
    .groupBy(contributorsTable.id)
    .orderBy(asc(contributorsTable.name));
  res.json(
    rows.map(({ contributor, entryCount }) => ({
      id: contributor.id,
      name: contributor.name,
      organization: contributor.organization ?? null,
      email: contributor.email ?? null,
      notes: contributor.notes ?? null,
      entryCount,
    })),
  );
});

router.post("/contributors", async (req, res) => {
  const parsed = CreateContributorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid contributor" });
    return;
  }
  const [created] = await db
    .insert(contributorsTable)
    .values({
      name: parsed.data.name,
      organization: parsed.data.organization ?? null,
      email: parsed.data.email ?? null,
      notes: parsed.data.notes ?? null,
    })
    .returning();
  res.json({
    id: created!.id,
    name: created!.name,
    organization: created!.organization ?? null,
    email: created!.email ?? null,
    notes: created!.notes ?? null,
    entryCount: 0,
  });
});

// ----------------------- share links -----------------------

async function loadShareLinkSummary(row: typeof shareLinksTable.$inferSelect, hostUrl?: string) {
  const [contributor] = await db
    .select()
    .from(contributorsTable)
    .where(eq(contributorsTable.id, row.contributorId))
    .limit(1);
  const presetSubjects = row.presetSubjectSlugs?.length
    ? await db
        .select()
        .from(subjectsTable)
        .where(inArray(subjectsTable.slug, row.presetSubjectSlugs))
    : [];
  const presetBuckets = row.presetBucketSlugs?.length
    ? await db
        .select()
        .from(projectBucketsTable)
        .where(inArray(projectBucketsTable.slug, row.presetBucketSlugs))
    : [];
  const uploadCountRow = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(libraryEntriesTable)
    .where(
      and(
        eq(libraryEntriesTable.contributorId, row.contributorId),
        eq(libraryEntriesTable.status, "needs_review"),
      ),
    );
  return {
    id: row.id,
    token: row.token,
    label: row.label ?? null,
    contributor: {
      id: contributor!.id,
      name: contributor!.name,
      organization: contributor!.organization ?? null,
      email: contributor!.email ?? null,
      notes: contributor!.notes ?? null,
      entryCount: 0,
    },
    presetSubjects: presetSubjects.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      description: s.description ?? null,
      color: s.color ?? null,
    })),
    presetBuckets: presetBuckets.map((b) => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      description: b.description ?? null,
      color: b.color ?? null,
    })),
    url: hostUrl ? `${hostUrl}/library/share/${row.token}` : `/library/share/${row.token}`,
    uploadCount: uploadCountRow[0]?.count ?? 0,
    revokedAt: row.revokedAt ? row.revokedAt.toISOString() : null,
    expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
  };
}

function publicHost(req: Request): string {
  const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol;
  const host = (req.headers["x-forwarded-host"] as string) || req.headers.host || "";
  if (!host) return "";
  return `${proto}://${host}`;
}

router.get("/share-links", async (req, res) => {
  const rows = await db
    .select()
    .from(shareLinksTable)
    .orderBy(desc(shareLinksTable.createdAt));
  const host = publicHost(req);
  const out = await Promise.all(rows.map((r) => loadShareLinkSummary(r, host)));
  res.json(out);
});

router.post("/share-links", async (req, res) => {
  const parsed = CreateShareLinkBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid share link" });
    return;
  }
  const data = parsed.data;
  const token = randomBytes(18).toString("base64url");
  const [created] = await db
    .insert(shareLinksTable)
    .values({
      token,
      label: data.label ?? null,
      contributorId: data.contributorId,
      presetSubjectSlugs: data.presetSubjectSlugs ?? [],
      presetBucketSlugs: data.presetBucketSlugs ?? [],
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    })
    .returning();
  res.json(await loadShareLinkSummary(created!, publicHost(req)));
});

router.get("/share-links/by-token/:token", async (req, res) => {
  const token = req.params.token;
  const rows = await db
    .select()
    .from(shareLinksTable)
    .where(eq(shareLinksTable.token, token))
    .limit(1);
  if (!rows.length || rows[0]!.revokedAt) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const link = rows[0]!;
  if (link.expiresAt && link.expiresAt.getTime() <= Date.now()) {
    res.status(410).json({ error: "Share link has expired" });
    return;
  }
  const [contributor] = await db
    .select()
    .from(contributorsTable)
    .where(eq(contributorsTable.id, link.contributorId))
    .limit(1);
  const presetSubjects = link.presetSubjectSlugs?.length
    ? await db
        .select()
        .from(subjectsTable)
        .where(inArray(subjectsTable.slug, link.presetSubjectSlugs))
    : [];
  const presetBuckets = link.presetBucketSlugs?.length
    ? await db
        .select()
        .from(projectBucketsTable)
        .where(inArray(projectBucketsTable.slug, link.presetBucketSlugs))
    : [];
  res.json({
    token: link.token,
    label: link.label ?? null,
    contributorName: contributor?.name ?? "Contributor",
    ownerLabel: "Northern Food Systems Research Library",
    presetSubjects: presetSubjects.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      description: s.description ?? null,
      color: s.color ?? null,
    })),
    presetBuckets: presetBuckets.map((b) => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      description: b.description ?? null,
      color: b.color ?? null,
    })),
  });
});

router.post("/share-links/by-token/:token/uploads", async (req, res) => {
  const token = req.params.token;
  const linkRows = await db
    .select()
    .from(shareLinksTable)
    .where(eq(shareLinksTable.token, token))
    .limit(1);
  if (!linkRows.length || linkRows[0]!.revokedAt) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const link = linkRows[0]!;
  if (link.expiresAt && link.expiresAt.getTime() <= Date.now()) {
    res.status(410).json({ error: "Share link has expired" });
    return;
  }
  const result = await createEntryFromBody(req.body, {
    contributorId: link.contributorId,
    defaultStatus: "needs_review",
    fixedSubjectSlugs: link.presetSubjectSlugs ?? [],
    fixedBucketSlugs: link.presetBucketSlugs ?? [],
  });
  if ("error" in result) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.json({ entry: result.entry, duplicate: result.duplicate });
});

// ----------------------- needs-review queue -----------------------

router.get("/needs-review", async (_req, res) => {
  const rows = await db
    .select()
    .from(libraryEntriesTable)
    .where(eq(libraryEntriesTable.status, "needs_review"))
    .orderBy(desc(libraryEntriesTable.createdAt));
  res.json(await loadEntries(rows));
});

// Touch objectStorageService so unused-import lint doesn't trip in some configs.
void objectStorageService;

export default router;
