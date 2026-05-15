import { Router, type IRouter, type Request, type Response } from "express";
import { promises as dnsPromises } from "dns";
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
import { and, desc, asc, eq, ilike, or, sql, inArray, ne } from "drizzle-orm";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";
import { randomBytes } from "crypto";
import {
  OWNER_TOKEN,
  isValidOwnerToken,
  isOwnerRequest,
  isAllowedCuratorEmail,
  createMagicLinkToken,
  consumeMagicLinkToken,
} from "../lib/ownerAuth";
import {
  sendConfidentialIntakeNotification,
  sendMagicLinkEmail,
} from "../lib/resend";

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
  "/owner/request-link",
  "/owner/verify-link",
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

// Magic-link step 1: accept an email address, check it's in LIBRARY_OWNER_EMAILS,
// create a short-lived one-time token, and send the link by email.
// Always returns 200 with { ok: true } even if the email isn't on the allow-list —
// this prevents enumerating valid curator addresses.
router.post("/owner/request-link", async (req, res) => {
  if (!OWNER_TOKEN) {
    res.status(503).json({
      error:
        "Library owner authentication is not configured (LIBRARY_OWNER_TOKEN missing).",
    });
    return;
  }
  const body = (req.body ?? {}) as { email?: unknown };
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email) {
    res.status(400).json({ error: "email is required" });
    return;
  }

  if (isAllowedCuratorEmail(email)) {
    try {
      const token = await createMagicLinkToken(email);
      const baseUrl =
        process.env.LIBRARY_BASE_URL ??
        `https://${process.env.REPLIT_DEV_DOMAIN ?? "localhost"}/library`;
      const magicLinkUrl = `${baseUrl.replace(/\/$/, "")}/login?token=${token}`;
      const sendResult = await sendMagicLinkEmail({ email, magicLinkUrl });
      if (sendResult.status !== "sent") {
        console.warn(
          "[magic-link] email delivery issue — status=%s error=%s",
          sendResult.status,
          sendResult.error ?? "(none)",
        );
      }
    } catch (err) {
      console.error("[magic-link] failed to issue token or send email:", err);
    }
  }

  res.json({ ok: true });
});

// Magic-link step 2: verify the one-time token from the email link.
// On success, returns { ok: true, token } where token is the LIBRARY_OWNER_TOKEN
// the client can store and replay, same as the passphrase flow.
router.get("/owner/verify-link", async (req, res) => {
  if (!OWNER_TOKEN) {
    res.status(503).json({
      error:
        "Library owner authentication is not configured (LIBRARY_OWNER_TOKEN missing).",
    });
    return;
  }
  const raw = req.query["token"];
  const token = typeof raw === "string" ? raw.trim() : "";
  if (!token) {
    res.status(400).json({ error: "token is required" });
    return;
  }
  const email = await consumeMagicLinkToken(token);
  if (!email) {
    res.status(401).json({ error: "This sign-in link is invalid or has expired." });
    return;
  }
  res.json({ ok: true, token: OWNER_TOKEN });
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
  // All stats queries exclude confidential_queue so quarantined files never
  // surface in library totals or recent-additions lists.
  const notConfidential = ne(libraryEntriesTable.status, "confidential_queue");

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
    db.select({ count: sql<number>`count(*)::int` }).from(libraryEntriesTable).where(notConfidential),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(libraryEntriesTable)
      .where(and(eq(libraryEntriesTable.status, "needs_review"), notConfidential)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(libraryEntriesTable)
      .where(and(eq(libraryEntriesTable.kind, "file"), notConfidential)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(libraryEntriesTable)
      .where(and(eq(libraryEntriesTable.kind, "web_source"), notConfidential)),
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
      .leftJoin(
        entrySubjectsTable,
        and(
          eq(entrySubjectsTable.subjectId, subjectsTable.id),
          ne(
            sql<string>`(SELECT status FROM library_entries WHERE id = ${entrySubjectsTable.entryId})`,
            "confidential_queue",
          ),
        ),
      )
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
      .leftJoin(
        libraryEntriesTable,
        and(
          eq(libraryEntriesTable.producerId, producersTable.id),
          notConfidential,
        ),
      )
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
      .where(notConfidential)
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
    .where(ne(libraryEntriesTable.status, "confidential_queue"))
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

  const conditions = [
    ne(libraryEntriesTable.status, "confidential_queue"),
  ] as ReturnType<typeof eq>[];
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

  // Dedup by content hash (exact bit-level match).
  // Confidential-queue entries are excluded so that a quarantined file is
  // never returned as a "duplicate" to a share-link or public upload path.
  if (data.contentHash) {
    const existing = await db
      .select()
      .from(libraryEntriesTable)
      .where(
        and(
          eq(libraryEntriesTable.contentHash, data.contentHash),
          ne(libraryEntriesTable.status, "confidential_queue"),
        ),
      )
      .limit(1);
    if (existing.length) {
      const full = await loadOneEntry(existing[0]!.id);
      return { entry: full!, duplicate: true as const };
    }
  }

  // Near-duplicate detection by normalized original filename.
  // Normalize: lowercase, strip path, drop a trailing "_<digits>" timestamp
  // before the extension, and collapse whitespace/punctuation runs.
  // Confidential-queue entries are excluded for the same isolation reason.
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
        .where(
          and(
            sql`${libraryEntriesTable.originalFilename} IS NOT NULL`,
            ne(libraryEntriesTable.status, "confidential_queue"),
          ),
        );
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

// ---------------------------------------------------------------------------
// Screenshot capture helpers
// ---------------------------------------------------------------------------

const SCREENSHOT_MAX_BYTES = 8 * 1024 * 1024; // 8 MB cap

/**
 * Download a screenshot/og:image URL and store it in object storage.
 * Returns the /objects/… path on success, null on any failure.
 * Silently swallows errors so callers never break on a bad image URL.
 */
async function captureScreenshotToStorage(
  screenshotUrl: string,
  logger?: { warn: (obj: unknown, msg: string) => void },
): Promise<string | null> {
  const safety = await isSafeUrl(screenshotUrl);
  if (!safety.safe) return null;

  try {
    const resp = await fetch(screenshotUrl, {
      signal: AbortSignal.timeout(20_000),
      headers: { "User-Agent": "NorthernFoodSystemsLibrary/1.0" },
    });
    if (!resp.ok) return null;

    const contentType = (resp.headers.get("content-type") || "image/jpeg").split(";")[0]!.trim();
    if (!contentType.startsWith("image/")) return null;

    // Stream-to-buffer with size cap to avoid OOM on huge images.
    const reader = resp.body?.getReader();
    if (!reader) return null;
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        total += value.byteLength;
        if (total > SCREENSHOT_MAX_BYTES) {
          reader.cancel();
          return null;
        }
        chunks.push(value);
      }
    }
    const buffer = Buffer.concat(chunks);
    return await objectStorageService.uploadBuffer(buffer, contentType, "screenshots");
  } catch (err) {
    logger?.warn({ err }, "Screenshot capture to storage failed");
    return null;
  }
}

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

  // Download the screenshot into our own object storage so the card image
  // never goes dead when Microlink rotates its URLs or source sites remove images.
  // On success, point screenshotUrl at our own serving path so every consumer
  // sees our URL even without knowing about screenshotObjectPath.
  let screenshotObjectPath: string | null = null;
  if (screenshotUrl) {
    screenshotObjectPath = await captureScreenshotToStorage(screenshotUrl, req.log);
    if (screenshotObjectPath) {
      screenshotUrl = `/api/storage${screenshotObjectPath}`;
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
      screenshotObjectPath: screenshotObjectPath ?? null,
      producerId,
    })
    .returning();

  await attachTags(created!.id, subjectSlugs, bucketSlugs);
  const full = await loadOneEntry(created!.id);
  res.json(full);
});

// ----------------------- screenshot backfill -----------------------
//
// POST /api/library/screenshots/backfill
//
// Re-captures screenshots for all published web_source entries that have an
// external screenshotUrl but no screenshotObjectPath yet.  Idempotent: entries
// that already have a local path are skipped.  Returns counts so the caller
// can see progress.

router.post("/screenshots/backfill", async (req, res) => {
  const rows = await db
    .select({
      id: libraryEntriesTable.id,
      screenshotUrl: libraryEntriesTable.screenshotUrl,
    })
    .from(libraryEntriesTable)
    .where(
      and(
        eq(libraryEntriesTable.kind, "web_source"),
        sql`${libraryEntriesTable.screenshotUrl} IS NOT NULL`,
        sql`${libraryEntriesTable.screenshotObjectPath} IS NULL`,
        ne(libraryEntriesTable.status, "confidential_queue"),
      ),
    );

  if (!rows.length) {
    res.json({ total: 0, captured: 0, failed: 0 });
    return;
  }

  const CONCURRENCY = 4;
  let captured = 0;
  let failed = 0;

  for (let i = 0; i < rows.length; i += CONCURRENCY) {
    const batch = rows.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (row) => {
        const objectPath = await captureScreenshotToStorage(row.screenshotUrl!, req.log);
        if (objectPath) {
          await db
            .update(libraryEntriesTable)
            .set({
              screenshotObjectPath: objectPath,
              screenshotUrl: `/api/storage${objectPath}`,
              updatedAt: new Date(),
            })
            .where(eq(libraryEntriesTable.id, row.id));
          captured++;
        } else {
          failed++;
        }
      }),
    );
  }

  res.json({ total: rows.length, captured, failed });
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

// ----------------------- link checker -----------------------
//
// POST /api/library/link-check
// Fetches every published web_source entry that has a sourceUrl and issues a
// HEAD request against each one.  Entries that come back with a 4xx/5xx
// status code, or whose request times out, are moved to needs_review so they
// surface in the review queue.  Returns a summary so the caller knows exactly
// how many links passed, failed, or timed out.

const LINK_CHECK_TIMEOUT_MS = 10_000;

// ---------------------------------------------------------------------------
// SSRF guard
// ---------------------------------------------------------------------------
// sourceUrl values can originate from contributors (via share-link uploads).
// Before issuing any server-side network request we validate the target URL
// to prevent contributors from using the link checker as an SSRF probe.
//
// Rules enforced:
//   1. Only http: and https: schemes are allowed.
//   2. The hostname must not be a known-internal name (localhost, .local, …).
//   3. We resolve the hostname via DNS and reject any address that falls in
//      a private / loopback / link-local / reserved range.

/** Returns true when the dotted-decimal IPv4 address is in a private/reserved range. */
function isPrivateIpv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) return true;
  const [a, b] = parts as [number, number, number, number];
  // 127.0.0.0/8 — loopback
  if (a === 127) return true;
  // 10.0.0.0/8 — private
  if (a === 10) return true;
  // 172.16.0.0/12 — private
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.168.0.0/16 — private
  if (a === 192 && b === 168) return true;
  // 169.254.0.0/16 — link-local / AWS metadata
  if (a === 169 && b === 254) return true;
  // 0.0.0.0/8 — "this" network
  if (a === 0) return true;
  // 100.64.0.0/10 — carrier-grade NAT
  if (a === 100 && b >= 64 && b <= 127) return true;
  // 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 — TEST-NET
  if (a === 192 && b === 0 && parts[2] === 2) return true;
  if (a === 198 && b === 51 && parts[2] === 100) return true;
  if (a === 203 && b === 0 && parts[2] === 113) return true;
  // 240.0.0.0/4 — reserved
  if (a >= 240) return true;
  return false;
}

/** Returns true when the full-length IPv6 address is in a private/reserved range. */
function isPrivateIpv6(ip: string): boolean {
  const lower = ip.toLowerCase().replace(/^\[|\]$/g, "");
  // ::1 — loopback
  if (lower === "::1") return true;
  // :: — unspecified
  if (lower === "::") return true;
  // fc00::/7 — unique local
  const firstWord = parseInt(lower.split(":")[0] || "0", 16);
  if ((firstWord & 0xfe00) === 0xfc00) return true;
  // fe80::/10 — link-local
  if ((firstWord & 0xffc0) === 0xfe80) return true;
  // IPv4-mapped ::ffff:x.x.x.x
  if (lower.startsWith("::ffff:")) {
    const v4part = lower.slice(7);
    // could be dotted-decimal or hex-colon; only handle dotted-decimal here
    if (v4part.includes(".")) return isPrivateIpv4(v4part);
  }
  return false;
}

const BLOCKED_HOSTNAME_PATTERNS = [
  /^localhost$/i,
  /\.local$/i,
  /\.internal$/i,
  /\.corp$/i,
  /\.home$/i,
  /^metadata\.google\.internal$/i,
  /^169\.254\./,            // link-local by hostname string (belt-and-suspenders)
];

async function isSafeUrl(rawUrl: string): Promise<{ safe: boolean; reason?: string }> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { safe: false, reason: "invalid URL" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { safe: false, reason: "non-http scheme" };
  }

  const hostname = parsed.hostname;

  for (const pattern of BLOCKED_HOSTNAME_PATTERNS) {
    if (pattern.test(hostname)) return { safe: false, reason: "blocked hostname" };
  }

  // Resolve DNS and check the resulting addresses.
  let addresses: string[] = [];
  try {
    // lookup returns the first result; resolve4/resolve6 give all.
    // We use both to cover dual-stack hosts.
    const [v4, v6] = await Promise.allSettled([
      dnsPromises.resolve4(hostname),
      dnsPromises.resolve6(hostname),
    ]);
    if (v4.status === "fulfilled") addresses = addresses.concat(v4.value);
    if (v6.status === "fulfilled") addresses = addresses.concat(v6.value);
    if (!addresses.length) {
      // Fallback to lookup (handles /etc/hosts, numeric IPs, etc.)
      const entry = await dnsPromises.lookup(hostname, { all: true });
      addresses = entry.map((e) => e.address);
    }
  } catch {
    // DNS failure — treat as unreachable (fetch will fail naturally);
    // don't block here to avoid false positives for valid but slow DNS.
    return { safe: true };
  }

  for (const addr of addresses) {
    if (addr.includes(":")) {
      if (isPrivateIpv6(addr)) return { safe: false, reason: "private IP" };
    } else {
      if (isPrivateIpv4(addr)) return { safe: false, reason: "private IP" };
    }
  }

  return { safe: true };
}

type CheckReason = "ok" | "error_status" | "timeout" | "fetch_error" | "blocked";

async function checkUrl(url: string): Promise<{ ok: boolean; status: number | null; reason: CheckReason }> {
  // SSRF guard — must pass before any network I/O.
  const safety = await isSafeUrl(url);
  if (!safety.safe) {
    return { ok: false, status: null, reason: "blocked" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LINK_CHECK_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Headwaters-LinkChecker/1.0" },
    });
    clearTimeout(timer);
    if (res.ok) return { ok: true, status: res.status, reason: "ok" };
    return { ok: false, status: res.status, reason: "error_status" };
  } catch (err: unknown) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      return { ok: false, status: null, reason: "timeout" };
    }
    return { ok: false, status: null, reason: "fetch_error" };
  }
}

router.post("/link-check", async (_req, res) => {
  // Collect all published web_source entries that have a sourceUrl.
  // We also include entries already in needs_review so the checker is
  // idempotent — running it again won't miss a URL that was previously flagged
  // and then re-published, and won't double-flag entries already in review.
  const rows = await db
    .select({
      id: libraryEntriesTable.id,
      title: libraryEntriesTable.title,
      sourceUrl: libraryEntriesTable.sourceUrl,
      status: libraryEntriesTable.status,
    })
    .from(libraryEntriesTable)
    .where(
      and(
        eq(libraryEntriesTable.kind, "web_source"),
        sql`${libraryEntriesTable.sourceUrl} IS NOT NULL`,
        ne(libraryEntriesTable.status, "confidential_queue"),
      ),
    );

  if (!rows.length) {
    res.json({ total: 0, passed: 0, failed: 0, timedOut: 0, fetchErrors: 0, flagged: [] });
    return;
  }

  // Check all URLs concurrently (capped at 10 in-flight at once to be polite).
  const CONCURRENCY = 10;
  const flagged: { id: string; title: string; url: string; reason: string; httpStatus: number | null }[] = [];
  let passed = 0;
  let failed = 0;
  let timedOut = 0;
  let fetchErrors = 0;
  let blocked = 0;

  for (let i = 0; i < rows.length; i += CONCURRENCY) {
    const batch = rows.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (row) => {
        const url = row.sourceUrl!;
        const result = await checkUrl(url);
        if (result.ok) {
          passed++;
          return;
        }

        if (result.reason === "blocked") {
          // Blocked URLs (private/reserved targets) are counted but are NOT
          // moved to needs_review and are NOT included in the flagged list —
          // they represent data-quality issues, not dead public links.
          blocked++;
          return;
        }

        if (result.reason === "timeout") timedOut++;
        else if (result.reason === "error_status") failed++;
        else fetchErrors++;

        flagged.push({
          id: row.id,
          title: row.title,
          url,
          reason: result.reason,
          httpStatus: result.status,
        });

        // Only move published entries to needs_review — entries already
        // sitting in needs_review stay where they are.
        if (row.status === "published") {
          const note =
            result.reason === "timeout"
              ? "Link check: URL timed out."
              : result.reason === "error_status"
              ? `Link check: HTTP ${result.status}.`
              : "Link check: URL could not be reached.";
          await db
            .update(libraryEntriesTable)
            .set({
              status: "needs_review",
              notes: sql`COALESCE(${libraryEntriesTable.notes} || E'\n', '') || ${note}`,
              updatedAt: new Date(),
            })
            .where(eq(libraryEntriesTable.id, row.id));
        }
      }),
    );
  }

  res.json({
    total: rows.length,
    passed,
    failed,
    timedOut,
    fetchErrors,
    blocked,
    flagged,
  });
});

// ----------------------- confidential queue -----------------------
//
// Files dropped via the confidential intake path land here with
// status="confidential_queue". They are invisible to all public queries,
// share links, and storage URLs until the founder explicitly clears them.
// The statusFlag column carries the Gate severity tier:
//   draft | under-review | refused | routed
// When cleared the entry moves to status="published" with statusFlag="confidential".

router.get("/confidential/count", async (_req, res) => {
  const row = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(libraryEntriesTable)
    .where(
      and(
        eq(libraryEntriesTable.status, "confidential_queue"),
        or(
          eq(libraryEntriesTable.statusFlag, "draft"),
          eq(libraryEntriesTable.statusFlag, "under-review"),
          sql`${libraryEntriesTable.statusFlag} IS NULL`,
        ),
      ),
    );
  res.json({ count: row[0]?.count ?? 0 });
});

router.get("/confidential/queue", async (_req, res) => {
  const rows = await db
    .select()
    .from(libraryEntriesTable)
    .where(eq(libraryEntriesTable.status, "confidential_queue"))
    .orderBy(desc(libraryEntriesTable.createdAt));
  res.json(
    rows.map((r) => ({
      id: r.id,
      title: r.title,
      originalFilename: r.originalFilename ?? null,
      contentType: r.contentType ?? null,
      fileType: r.fileType ?? null,
      kind: r.kind,
      status: r.status,
      statusFlag: r.statusFlag ?? null,
      notes: r.notes ?? null,
      fileSize: r.fileSize ?? null,
      storageRef: r.storageRef ?? null,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
  );
});

router.post("/confidential/intake", async (req, res) => {
  // Confidential intake bypasses the global dedup logic entirely so that we
  // never mutate an existing published entry into quarantine state.
  // We always create a fresh row. contentHash is set to null to avoid the
  // unique-index constraint (two confidential drops of the same file are fine).
  const parsed = CreateLibraryEntryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const data = parsed.data;

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
      status: "confidential_queue",
      statusFlag: "draft",
      storageRef,
      contentHash: null, // intentionally omitted to avoid unique-index collision
      fileSize: data.fileSize ?? null,
      contentType: data.contentType ?? null,
      originalFilename: data.originalFilename ?? null,
      fileType,
    })
    .returning();

  if (!created) {
    res.status(500).json({ error: "Insert failed" });
    return;
  }

  // Fire-and-forget notification — never block the response on email delivery.
  // Build the most absolute URL we can so the link is clickable in email clients.
  // Priority: LIBRARY_BASE_URL (explicit override) → Replit domain env vars → relative fallback.
  const libraryBase = process.env.LIBRARY_BASE_URL?.replace(/\/$/, "")
    ?? (() => {
      const domain = process.env.REPLIT_DEV_DOMAIN ?? process.env.REPLIT_DOMAINS?.split(",")[0];
      return domain ? `https://${domain}/library` : null;
    })();
  const queueUrl = libraryBase
    ? `${libraryBase}/confidential/queue`
    : "/library/confidential/queue";
  sendConfidentialIntakeNotification({
    filename: created.originalFilename ?? created.title ?? null,
    fileSize: created.fileSize ?? null,
    queueUrl,
  }).catch(() => {
    // intentionally swallowed — email failure must never break the intake response
  });

  res.json({ entry: created, duplicate: false });
});

router.get("/confidential/:id/preview-url", async (req, res) => {
  const { id } = req.params;

  const rows = await db
    .select()
    .from(libraryEntriesTable)
    .where(
      and(
        eq(libraryEntriesTable.id, id),
        eq(libraryEntriesTable.status, "confidential_queue"),
      ),
    )
    .limit(1);

  if (!rows.length) {
    res.status(404).json({ error: "Not found in confidential queue" });
    return;
  }

  const entry = rows[0]!;
  const storageRef = entry.storageRef;

  if (!storageRef) {
    res.status(422).json({ error: "This entry has no file attached." });
    return;
  }

  // Normalize storageRef → objectPath (must start with /objects/)
  let objectPath: string;
  if (storageRef.startsWith("gcs:")) {
    objectPath = storageRef.slice(4);
  } else if (storageRef.startsWith("/objects/")) {
    objectPath = storageRef;
  } else {
    res.status(422).json({ error: "Unsupported storage reference format." });
    return;
  }

  try {
    const TTL_SEC = 300;
    const url = await objectStorageService.getSignedDownloadUrl(objectPath, TTL_SEC);
    res.json({
      url,
      expiresInSeconds: TTL_SEC,
      fileType: entry.fileType ?? null,
      contentType: entry.contentType ?? null,
      originalFilename: entry.originalFilename ?? null,
    });
  } catch (err) {
    if (err instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "File not found in storage." });
      return;
    }
    req.log.error({ err }, "Failed to generate preview URL");
    res.status(500).json({ error: "Failed to generate preview URL" });
  }
});

router.patch("/confidential/:id", async (req, res) => {
  const { id } = req.params;
  const body = (req.body ?? {}) as {
    action?: string;
    reason?: string;
    tier?: string;
  };

  const existing = await db
    .select()
    .from(libraryEntriesTable)
    .where(
      and(
        eq(libraryEntriesTable.id, id),
        eq(libraryEntriesTable.status, "confidential_queue"),
      ),
    )
    .limit(1);

  if (!existing.length) {
    res.status(404).json({ error: "Not found in confidential queue" });
    return;
  }

  // Once routed the entry is locked — no further tier or action changes.
  if (existing[0]!.statusFlag === "routed") {
    res.status(409).json({ error: "Entry is routed and locked from further changes." });
    return;
  }

  if (body.action === "clear") {
    await db
      .update(libraryEntriesTable)
      .set({ status: "published", statusFlag: "confidential", updatedAt: new Date() })
      .where(eq(libraryEntriesTable.id, id));
    res.json({ ok: true, action: "cleared" });
    return;
  }

  if (body.action === "refuse") {
    await db
      .update(libraryEntriesTable)
      .set({
        statusFlag: "refused",
        notes: body.reason?.trim() || null,
        updatedAt: new Date(),
      })
      .where(eq(libraryEntriesTable.id, id));
    res.json({ ok: true, action: "refused" });
    return;
  }

  if (body.action === "route") {
    await db
      .update(libraryEntriesTable)
      .set({ statusFlag: "routed", updatedAt: new Date() })
      .where(eq(libraryEntriesTable.id, id));
    res.json({ ok: true, action: "routed" });
    return;
  }

  if (body.tier) {
    const validTiers = ["draft", "under-review"];
    if (!validTiers.includes(body.tier)) {
      res.status(400).json({ error: "Invalid tier" });
      return;
    }
    await db
      .update(libraryEntriesTable)
      .set({ statusFlag: body.tier, updatedAt: new Date() })
      .where(eq(libraryEntriesTable.id, id));
    res.json({ ok: true, tier: body.tier });
    return;
  }

  res.status(400).json({ error: "Provide action (clear|refuse|route) or tier (draft|under-review)" });
});

// Touch objectStorageService so unused-import lint doesn't trip in some configs.
void objectStorageService;

export default router;
