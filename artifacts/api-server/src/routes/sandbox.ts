import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import {
  sandboxHouseholdsTable,
  sandboxSessionsTable,
  sandboxBucketsTable,
  sandboxPostsTable,
  sandboxCommunityRolesTable,
  sandboxStandbyEventsTable,
  sandboxCheckinsTable,
  sandboxInvitesTable,
} from "@workspace/db";
import { and, desc, eq, gt, isNull, sql, asc } from "drizzle-orm";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

const router: IRouter = Router();

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function param(raw: string | string[]): string {
  return Array.isArray(raw) ? raw[0] ?? "" : raw;
}

function hashPassphrase(passphrase: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(passphrase, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassphrase(passphrase: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 2) return false;
  const [salt, hash] = parts as [string, string];
  const hashBuf = Buffer.from(hash, "hex");
  let testBuf: Buffer;
  try {
    testBuf = scryptSync(passphrase, salt, 64) as Buffer;
  } catch {
    return false;
  }
  if (hashBuf.length !== testBuf.length) return false;
  return timingSafeEqual(hashBuf, testBuf);
}

function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

function generateInviteCode(): string {
  // 8 random bytes → 12 char base64url — short enough to share but hard to guess
  return randomBytes(8).toString("base64url").toUpperCase().replace(/-/g, "X").replace(/_/g, "Y").slice(0, 10);
}

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function extractToken(req: Request): string | null {
  const auth = req.header("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return null;
}

type HouseholdRow = typeof sandboxHouseholdsTable.$inferSelect;

async function getHousehold(req: Request): Promise<HouseholdRow | null> {
  const token = extractToken(req);
  if (!token) return null;
  const now = new Date();
  const rows = await db
    .select({ household: sandboxHouseholdsTable })
    .from(sandboxSessionsTable)
    .innerJoin(sandboxHouseholdsTable, eq(sandboxSessionsTable.householdId, sandboxHouseholdsTable.id))
    .where(and(eq(sandboxSessionsTable.token, token), gt(sandboxSessionsTable.expiresAt, now)))
    .limit(1);
  return rows[0]?.household ?? null;
}

function requireHousehold() {
  return async (req: Request, res: Response, next: () => void) => {
    const household = await getHousehold(req);
    if (!household) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.locals.household = household;
    next();
  };
}

function requireOrganizer() {
  return async (req: Request, res: Response, next: () => void) => {
    const household = res.locals.household as HouseholdRow | undefined;
    if (!household?.isOrganizer) {
      res.status(403).json({ error: "Organizer access required" });
      return;
    }
    next();
  };
}

function serializeHousehold(h: HouseholdRow) {
  return {
    id: h.id,
    name: h.name,
    isOrganizer: h.isOrganizer,
    gatherRoundParticipated: h.gatherRoundParticipated ?? null,
    createdAt: h.createdAt instanceof Date ? h.createdAt.toISOString() : String(h.createdAt),
  };
}

function serializeBucket(b: typeof sandboxBucketsTable.$inferSelect) {
  return {
    id: b.id,
    slug: b.slug,
    label: b.label,
    isBuiltIn: b.isBuiltIn,
    isHeadsUp: b.isHeadsUp,
    isGatherRound: b.isGatherRound,
    sortOrder: b.sortOrder,
    promptText: b.promptText ?? null,
    createdAt: b.createdAt instanceof Date ? b.createdAt.toISOString() : String(b.createdAt),
  };
}

// ──────────────────────────────────────────────
// Ensure built-in buckets exist
// ──────────────────────────────────────────────
async function ensureBuiltInBuckets() {
  const existing = await db.select().from(sandboxBucketsTable);
  if (existing.length > 0) return;

  const builtIn = [
    { slug: "general", label: "General", isBuiltIn: true, isHeadsUp: false, isGatherRound: false, sortOrder: "10" },
    { slug: "resources", label: "Resources", isBuiltIn: true, isHeadsUp: false, isGatherRound: false, sortOrder: "20" },
    { slug: "questions", label: "Questions", isBuiltIn: true, isHeadsUp: false, isGatherRound: false, sortOrder: "30" },
    { slug: "heads_up", label: "Heads Up", isBuiltIn: true, isHeadsUp: true, isGatherRound: false, sortOrder: "40" },
    { slug: "gather_round", label: "Gather Round", isBuiltIn: true, isHeadsUp: false, isGatherRound: true, sortOrder: "50" },
  ];

  await db.insert(sandboxBucketsTable).values(builtIn);
}

// ──────────────────────────────────────────────
// POST /sandbox/households — create household
// Invite-only: requires a valid invite code UNLESS this is the bootstrap
// household (no households exist yet — first one becomes organizer).
// ──────────────────────────────────────────────
const CreateHouseholdSchema = z.object({
  name: z.string().min(1).max(80),
  passphrase: z.string().min(4),
  inviteCode: z.string().optional(),
});

router.post("/households", async (req: Request, res: Response) => {
  const parsed = CreateHouseholdSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { name, passphrase, inviteCode } = parsed.data;

  // Count existing households to determine if this is the bootstrap
  const countRows = await db.select({ c: sql<number>`count(*)::int` }).from(sandboxHouseholdsTable);
  const existingCount = countRows[0]?.c ?? 0;
  const isFirst = existingCount === 0;

  // After bootstrap, require a valid unused invite code
  if (!isFirst) {
    if (!inviteCode) {
      res.status(403).json({ error: "An invite code is required to join this board" });
      return;
    }
    const invite = await db
      .select()
      .from(sandboxInvitesTable)
      .where(and(eq(sandboxInvitesTable.code, inviteCode), isNull(sandboxInvitesTable.usedByHouseholdId)))
      .limit(1);
    if (!invite[0]) {
      res.status(403).json({ error: "Invite code is invalid or has already been used" });
      return;
    }
  }

  // Check name not taken
  const existing = await db
    .select({ id: sandboxHouseholdsTable.id })
    .from(sandboxHouseholdsTable)
    .where(eq(sandboxHouseholdsTable.name, name))
    .limit(1);

  if (existing[0]) {
    res.status(409).json({ error: "That household name is already taken" });
    return;
  }

  const hash = hashPassphrase(passphrase);
  const [household] = await db
    .insert(sandboxHouseholdsTable)
    .values({ name, passphraseHash: hash, isOrganizer: isFirst })
    .returning();

  if (!household) {
    res.status(500).json({ error: "Failed to create household" });
    return;
  }

  // Mark invite used
  if (!isFirst && inviteCode) {
    await db
      .update(sandboxInvitesTable)
      .set({ usedByHouseholdId: household.id, usedAt: new Date() })
      .where(eq(sandboxInvitesTable.code, inviteCode));
  }

  await ensureBuiltInBuckets();

  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(sandboxSessionsTable).values({ householdId: household.id, token, expiresAt });

  res.status(201).json({ token, household: serializeHousehold(household) });
});

// ──────────────────────────────────────────────
// POST /sandbox/sessions — login
// ──────────────────────────────────────────────
const LoginSchema = z.object({
  name: z.string().min(1),
  passphrase: z.string().min(1),
});

router.post("/sessions", async (req: Request, res: Response) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Name and passphrase are required" });
    return;
  }

  const { name, passphrase } = parsed.data;
  const rows = await db
    .select()
    .from(sandboxHouseholdsTable)
    .where(eq(sandboxHouseholdsTable.name, name))
    .limit(1);

  const household = rows[0];
  if (!household || !verifyPassphrase(passphrase, household.passphraseHash)) {
    res.status(401).json({ error: "Incorrect name or passphrase" });
    return;
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(sandboxSessionsTable).values({ householdId: household.id, token, expiresAt });

  res.json({ token, household: serializeHousehold(household) });
});

// ──────────────────────────────────────────────
// GET /sandbox/me — current household
// ──────────────────────────────────────────────
router.get("/me", requireHousehold(), async (_req: Request, res: Response) => {
  const household = res.locals.household as HouseholdRow;
  res.json(serializeHousehold(household));
});

// ──────────────────────────────────────────────
// GET /sandbox/households — list (organizer only)
// ──────────────────────────────────────────────
router.get("/households", requireHousehold(), requireOrganizer(), async (_req: Request, res: Response) => {
  const rows = await db.select().from(sandboxHouseholdsTable).orderBy(asc(sandboxHouseholdsTable.createdAt));
  res.json(rows.map(serializeHousehold));
});

// ──────────────────────────────────────────────
// GET /sandbox/invites — list (organizer only)
// ──────────────────────────────────────────────
router.get("/invites", requireHousehold(), requireOrganizer(), async (_req: Request, res: Response) => {
  const rows = await db
    .select({
      invite: sandboxInvitesTable,
      usedBy: { name: sandboxHouseholdsTable.name },
    })
    .from(sandboxInvitesTable)
    .leftJoin(sandboxHouseholdsTable, eq(sandboxInvitesTable.usedByHouseholdId, sandboxHouseholdsTable.id))
    .orderBy(desc(sandboxInvitesTable.createdAt));

  res.json(rows.map(({ invite, usedBy }) => ({
    id: invite.id,
    code: invite.code,
    note: invite.note,
    createdAt: invite.createdAt instanceof Date ? invite.createdAt.toISOString() : String(invite.createdAt),
    usedAt: invite.usedAt ? (invite.usedAt instanceof Date ? invite.usedAt.toISOString() : String(invite.usedAt)) : null,
    usedByHouseholdName: usedBy?.name ?? null,
  })));
});

// ──────────────────────────────────────────────
// POST /sandbox/invites — create invite (organizer only)
// ──────────────────────────────────────────────
const CreateInviteSchema = z.object({
  note: z.string().max(100).optional().default(""),
});

router.post("/invites", requireHousehold(), requireOrganizer(), async (req: Request, res: Response) => {
  const household = res.locals.household as HouseholdRow;
  const parsed = CreateInviteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const code = generateInviteCode();
  const [invite] = await db
    .insert(sandboxInvitesTable)
    .values({ code, note: parsed.data.note, createdByHouseholdId: household.id })
    .returning();

  res.status(201).json({
    id: invite!.id,
    code: invite!.code,
    note: invite!.note,
    createdAt: invite!.createdAt instanceof Date ? invite!.createdAt.toISOString() : String(invite!.createdAt),
    usedAt: null,
    usedByHouseholdName: null,
  });
});

// ──────────────────────────────────────────────
// DELETE /sandbox/invites/:id — revoke (organizer only, unused only)
// ──────────────────────────────────────────────
router.delete("/invites/:id", requireHousehold(), requireOrganizer(), async (req: Request, res: Response) => {
  const inviteId = param(req.params.id);
  const rows = await db
    .select()
    .from(sandboxInvitesTable)
    .where(eq(sandboxInvitesTable.id, inviteId))
    .limit(1);

  if (!rows[0]) {
    res.status(404).json({ error: "Invite not found" });
    return;
  }

  if (rows[0].usedByHouseholdId) {
    res.status(400).json({ error: "Cannot revoke an invite that has already been used" });
    return;
  }

  await db.delete(sandboxInvitesTable).where(eq(sandboxInvitesTable.id, inviteId));
  res.status(204).end();
});

// ──────────────────────────────────────────────
// GET /sandbox/buckets
// ──────────────────────────────────────────────
router.get("/buckets", requireHousehold(), async (_req: Request, res: Response) => {
  await ensureBuiltInBuckets();
  const buckets = await db.select().from(sandboxBucketsTable).orderBy(asc(sandboxBucketsTable.sortOrder));
  res.json(buckets.map(serializeBucket));
});

// ──────────────────────────────────────────────
// POST /sandbox/buckets — create (organizer only)
// ──────────────────────────────────────────────
const CreateBucketSchema = z.object({
  label: z.string().min(1).max(50),
});

router.post("/buckets", requireHousehold(), requireOrganizer(), async (req: Request, res: Response) => {
  const parsed = CreateBucketSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Label is required" });
    return;
  }

  const slug = parsed.data.label.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 40);
  const [bucket] = await db
    .insert(sandboxBucketsTable)
    .values({ slug: `${slug}_${Date.now()}`, label: parsed.data.label, sortOrder: String(Date.now()) })
    .returning();

  res.status(201).json(serializeBucket(bucket!));
});

// ──────────────────────────────────────────────
// PATCH /sandbox/buckets/:id — update (organizer only)
// Supports label rename and promptText (Gather Round monthly prompt).
// ──────────────────────────────────────────────
const UpdateBucketSchema = z.object({
  label: z.string().min(1).max(50).optional(),
  promptText: z.string().max(1000).nullable().optional(),
});

router.patch("/buckets/:id", requireHousehold(), requireOrganizer(), async (req: Request, res: Response) => {
  const bucketId = param(req.params.id);
  const parsed = UpdateBucketSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const updates: Partial<typeof sandboxBucketsTable.$inferInsert> = {};
  if (parsed.data.label !== undefined) updates.label = parsed.data.label;
  if (parsed.data.promptText !== undefined) updates.promptText = parsed.data.promptText;

  const [updated] = await db
    .update(sandboxBucketsTable)
    .set(updates)
    .where(eq(sandboxBucketsTable.id, bucketId))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Bucket not found" });
    return;
  }

  res.json(serializeBucket(updated));
});

// ──────────────────────────────────────────────
// GET /sandbox/posts
// ──────────────────────────────────────────────
router.get("/posts", requireHousehold(), async (req: Request, res: Response) => {
  const bucketId = typeof req.query.bucketId === "string" ? req.query.bucketId : undefined;
  const now = new Date();

  // Purge expired heads-up posts on read
  await db
    .delete(sandboxPostsTable)
    .where(and(
      sql`${sandboxPostsTable.expiresAt} IS NOT NULL`,
      sql`${sandboxPostsTable.expiresAt} < ${now}`,
    ));

  const conditions = bucketId ? [eq(sandboxPostsTable.bucketId, bucketId)] : [];

  const rows = await db
    .select({
      post: sandboxPostsTable,
      household: { id: sandboxHouseholdsTable.id, name: sandboxHouseholdsTable.name },
      bucket: { slug: sandboxBucketsTable.slug },
    })
    .from(sandboxPostsTable)
    .innerJoin(sandboxHouseholdsTable, eq(sandboxPostsTable.householdId, sandboxHouseholdsTable.id))
    .innerJoin(sandboxBucketsTable, eq(sandboxPostsTable.bucketId, sandboxBucketsTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(sandboxPostsTable.createdAt))
    .limit(100);

  res.json(
    rows.map(({ post, household, bucket }) => ({
      id: post.id,
      householdId: post.householdId,
      householdName: household.name,
      bucketId: post.bucketId,
      bucketSlug: bucket.slug,
      body: post.body,
      expiresAt: post.expiresAt ? (post.expiresAt instanceof Date ? post.expiresAt.toISOString() : String(post.expiresAt)) : null,
      createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : String(post.createdAt),
    })),
  );
});

// ──────────────────────────────────────────────
// POST /sandbox/posts
// ──────────────────────────────────────────────
const HEADS_UP_TTL_MS = 72 * 60 * 60 * 1000;

const CreatePostSchema = z.object({
  bucketId: z.string().uuid(),
  body: z.string().min(1).max(2000),
});

router.post("/posts", requireHousehold(), async (req: Request, res: Response) => {
  const household = res.locals.household as HouseholdRow;
  const parsed = CreatePostSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const bucket = await db
    .select()
    .from(sandboxBucketsTable)
    .where(eq(sandboxBucketsTable.id, parsed.data.bucketId))
    .limit(1);

  if (!bucket[0]) {
    res.status(404).json({ error: "Bucket not found" });
    return;
  }

  const expiresAt = bucket[0].isHeadsUp ? new Date(Date.now() + HEADS_UP_TTL_MS) : null;

  const [post] = await db
    .insert(sandboxPostsTable)
    .values({
      householdId: household.id,
      bucketId: parsed.data.bucketId,
      body: parsed.data.body,
      expiresAt,
    })
    .returning();

  // Award Gather Round participation if posting to that bucket
  if (bucket[0].isGatherRound) {
    await db
      .update(sandboxHouseholdsTable)
      .set({ gatherRoundParticipated: bucket[0].id, updatedAt: new Date() })
      .where(eq(sandboxHouseholdsTable.id, household.id));
  }

  const rows = await db
    .select({
      post: sandboxPostsTable,
      household: { id: sandboxHouseholdsTable.id, name: sandboxHouseholdsTable.name },
      bucket: { slug: sandboxBucketsTable.slug },
    })
    .from(sandboxPostsTable)
    .innerJoin(sandboxHouseholdsTable, eq(sandboxPostsTable.householdId, sandboxHouseholdsTable.id))
    .innerJoin(sandboxBucketsTable, eq(sandboxPostsTable.bucketId, sandboxBucketsTable.id))
    .where(eq(sandboxPostsTable.id, post!.id))
    .limit(1);

  const row = rows[0];
  if (!row) {
    res.status(500).json({ error: "Failed to retrieve post" });
    return;
  }

  res.status(201).json({
    id: row.post.id,
    householdId: row.post.householdId,
    householdName: row.household.name,
    bucketId: row.post.bucketId,
    bucketSlug: row.bucket.slug,
    body: row.post.body,
    expiresAt: row.post.expiresAt ? (row.post.expiresAt instanceof Date ? row.post.expiresAt.toISOString() : String(row.post.expiresAt)) : null,
    createdAt: row.post.createdAt instanceof Date ? row.post.createdAt.toISOString() : String(row.post.createdAt),
  });
});

// ──────────────────────────────────────────────
// DELETE /sandbox/posts/:id
// ──────────────────────────────────────────────
router.delete("/posts/:id", requireHousehold(), async (req: Request, res: Response) => {
  const household = res.locals.household as HouseholdRow;
  const postId = param(req.params.id);

  const rows = await db.select().from(sandboxPostsTable).where(eq(sandboxPostsTable.id, postId)).limit(1);
  const post = rows[0];
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  if (post.householdId !== household.id && !household.isOrganizer) {
    res.status(403).json({ error: "Cannot delete another household's post" });
    return;
  }

  await db.delete(sandboxPostsTable).where(eq(sandboxPostsTable.id, postId));
  res.status(204).end();
});

// ──────────────────────────────────────────────
// GET /sandbox/roles
// Organizers see all roles with full household identity.
// Regular households see:
//   - Public roles (isPublic: true) with full household identity (for "who has what" standby card)
//   - Roles assigned to them (even private ones) with their own identity
//   - Private roles assigned to other households are hidden entirely
// ──────────────────────────────────────────────
router.get("/roles", requireHousehold(), async (_req: Request, res: Response) => {
  const household = res.locals.household as HouseholdRow;
  const rows = await db
    .select({
      role: sandboxCommunityRolesTable,
      hh: { id: sandboxHouseholdsTable.id, name: sandboxHouseholdsTable.name },
    })
    .from(sandboxCommunityRolesTable)
    .leftJoin(sandboxHouseholdsTable, eq(sandboxCommunityRolesTable.householdId, sandboxHouseholdsTable.id))
    .orderBy(asc(sandboxCommunityRolesTable.createdAt));

  const filtered = rows.filter(({ role }) => {
    if (household.isOrganizer) return true;
    // Public roles are visible to everyone (standby reference card)
    if (role.isPublic) return true;
    // Private roles only visible to the assigned household
    return role.householdId === household.id;
  });

  res.json(filtered.map(({ role, hh }) => ({
    id: role.id,
    roleName: role.roleName,
    description: role.description,
    // Public roles surface household identity to all (standby card).
    // Private roles only surface identity to organizer or the assigned household.
    householdId: role.isPublic || household.isOrganizer || role.householdId === household.id
      ? (role.householdId ?? null) : null,
    householdName: role.isPublic || household.isOrganizer || role.householdId === household.id
      ? (hh?.name ?? null) : null,
    isPublic: role.isPublic,
    assignedByOrganizer: role.assignedByOrganizer,
  })));
});

// ──────────────────────────────────────────────
// POST /sandbox/roles — organizer only
// ──────────────────────────────────────────────
const CreateRoleSchema = z.object({
  roleName: z.string().min(1).max(100),
  description: z.string().max(500).optional().default(""),
});

router.post("/roles", requireHousehold(), requireOrganizer(), async (req: Request, res: Response) => {
  const parsed = CreateRoleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const [role] = await db
    .insert(sandboxCommunityRolesTable)
    .values({ roleName: parsed.data.roleName, description: parsed.data.description })
    .returning();

  res.status(201).json({
    id: role!.id,
    roleName: role!.roleName,
    description: role!.description,
    householdId: null,
    householdName: null,
    isPublic: role!.isPublic,
    assignedByOrganizer: role!.assignedByOrganizer,
  });
});

// ──────────────────────────────────────────────
// PATCH /sandbox/roles/:id
// ──────────────────────────────────────────────
const UpdateRoleSchema = z.object({
  roleName: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  householdId: z.string().uuid().nullable().optional(),
  isPublic: z.boolean().optional(),
});

router.patch("/roles/:id", requireHousehold(), requireOrganizer(), async (req: Request, res: Response) => {
  const roleId = param(req.params.id);

  const parsed = UpdateRoleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const updates: Partial<typeof sandboxCommunityRolesTable.$inferInsert> = {
    ...parsed.data,
    updatedAt: new Date(),
  };

  const [updated] = await db
    .update(sandboxCommunityRolesTable)
    .set(updates)
    .where(eq(sandboxCommunityRolesTable.id, roleId))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Role not found" });
    return;
  }

  let householdName: string | null = null;
  if (updated.householdId) {
    const h = await db.select({ name: sandboxHouseholdsTable.name }).from(sandboxHouseholdsTable).where(eq(sandboxHouseholdsTable.id, updated.householdId)).limit(1);
    householdName = h[0]?.name ?? null;
  }

  res.json({
    id: updated.id,
    roleName: updated.roleName,
    description: updated.description,
    householdId: updated.householdId ?? null,
    householdName,
    isPublic: updated.isPublic,
    assignedByOrganizer: updated.assignedByOrganizer,
  });
});

// ──────────────────────────────────────────────
// DELETE /sandbox/roles/:id — organizer only
// ──────────────────────────────────────────────
router.delete("/roles/:id", requireHousehold(), requireOrganizer(), async (req: Request, res: Response) => {
  const roleId = param(req.params.id);
  const rows = await db.select({ id: sandboxCommunityRolesTable.id }).from(sandboxCommunityRolesTable).where(eq(sandboxCommunityRolesTable.id, roleId)).limit(1);
  if (!rows[0]) {
    res.status(404).json({ error: "Role not found" });
    return;
  }
  await db.delete(sandboxCommunityRolesTable).where(eq(sandboxCommunityRolesTable.id, roleId));
  res.status(204).end();
});

// ──────────────────────────────────────────────
// GET /sandbox/standby/active
// ──────────────────────────────────────────────
router.get("/standby/active", requireHousehold(), async (_req: Request, res: Response) => {
  const rows = await db
    .select({
      event: sandboxStandbyEventsTable,
      household: { name: sandboxHouseholdsTable.name },
    })
    .from(sandboxStandbyEventsTable)
    .innerJoin(sandboxHouseholdsTable, eq(sandboxStandbyEventsTable.declaredByHouseholdId, sandboxHouseholdsTable.id))
    .where(eq(sandboxStandbyEventsTable.isActive, true))
    .limit(1);

  if (!rows[0]) {
    res.json(null);
    return;
  }

  const { event, household } = rows[0];
  res.json({
    id: event.id,
    name: event.name,
    declaredByHouseholdId: event.declaredByHouseholdId,
    declaredByName: household.name,
    isActive: event.isActive,
    declaredAt: event.declaredAt instanceof Date ? event.declaredAt.toISOString() : String(event.declaredAt),
    endedAt: event.endedAt ? (event.endedAt instanceof Date ? event.endedAt.toISOString() : String(event.endedAt)) : null,
  });
});

// ──────────────────────────────────────────────
// POST /sandbox/standby — declare event (organizer)
// ──────────────────────────────────────────────
const DeclareStandbySchema = z.object({
  name: z.string().min(1).max(200),
});

router.post("/standby", requireHousehold(), requireOrganizer(), async (req: Request, res: Response) => {
  const household = res.locals.household as HouseholdRow;
  const parsed = DeclareStandbySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Event name is required" });
    return;
  }

  // End any existing active event
  await db
    .update(sandboxStandbyEventsTable)
    .set({ isActive: false, endedAt: new Date() })
    .where(eq(sandboxStandbyEventsTable.isActive, true));

  const [event] = await db
    .insert(sandboxStandbyEventsTable)
    .values({ name: parsed.data.name, declaredByHouseholdId: household.id })
    .returning();

  res.status(201).json({
    id: event!.id,
    name: event!.name,
    declaredByHouseholdId: event!.declaredByHouseholdId,
    declaredByName: household.name,
    isActive: event!.isActive,
    declaredAt: event!.declaredAt instanceof Date ? event!.declaredAt.toISOString() : String(event!.declaredAt),
    endedAt: null,
  });
});

// ──────────────────────────────────────────────
// POST /sandbox/standby/:id/end — organizer
// ──────────────────────────────────────────────
router.post("/standby/:id/end", requireHousehold(), requireOrganizer(), async (req: Request, res: Response) => {
  const eventId = param(req.params.id);
  const [updated] = await db
    .update(sandboxStandbyEventsTable)
    .set({ isActive: false, endedAt: new Date() })
    .where(eq(sandboxStandbyEventsTable.id, eventId))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Event not found" });
    return;
  }

  res.json({ id: updated.id, isActive: false });
});

// ──────────────────────────────────────────────
// GET /sandbox/checkins — summary for active event
// Counts + who checked in: visible to all authenticated households.
// "remaining" (not-yet-checked-in) list: organizer-only (just IDs).
// ──────────────────────────────────────────────
router.get("/checkins", requireHousehold(), async (_req: Request, res: Response) => {
  const household = res.locals.household as HouseholdRow;

  const activeRows = await db
    .select()
    .from(sandboxStandbyEventsTable)
    .where(eq(sandboxStandbyEventsTable.isActive, true))
    .limit(1);

  const event = activeRows[0];
  if (!event) {
    res.json(null);
    return;
  }

  const [allHouseholds, checkins] = await Promise.all([
    db.select({ id: sandboxHouseholdsTable.id, name: sandboxHouseholdsTable.name }).from(sandboxHouseholdsTable),
    db
      .select({
        checkin: sandboxCheckinsTable,
        hh: { id: sandboxHouseholdsTable.id, name: sandboxHouseholdsTable.name },
      })
      .from(sandboxCheckinsTable)
      .innerJoin(sandboxHouseholdsTable, eq(sandboxCheckinsTable.householdId, sandboxHouseholdsTable.id))
      .where(eq(sandboxCheckinsTable.eventId, event.id)),
  ]);

  const checkedInIds = new Set(checkins.map((c) => c.hh.id));

  const remaining = household.isOrganizer
    ? allHouseholds.filter((h) => !checkedInIds.has(h.id))
    : [];

  res.json({
    eventId: event.id,
    total: allHouseholds.length,
    checkedIn: checkins.length,
    myCheckedIn: checkedInIds.has(household.id),
    remaining,
    checkins: checkins.map(({ checkin, hh }) => ({
      householdId: hh.id,
      householdName: hh.name,
      checkedInAt: checkin.checkedInAt instanceof Date ? checkin.checkedInAt.toISOString() : String(checkin.checkedInAt),
    })),
  });
});

// ──────────────────────────────────────────────
// POST /sandbox/checkins — mark household ok
// ──────────────────────────────────────────────
router.post("/checkins", requireHousehold(), async (_req: Request, res: Response) => {
  const household = res.locals.household as HouseholdRow;

  const activeRows = await db
    .select()
    .from(sandboxStandbyEventsTable)
    .where(eq(sandboxStandbyEventsTable.isActive, true))
    .limit(1);

  const event = activeRows[0];
  if (!event) {
    res.status(400).json({ error: "No active standby event" });
    return;
  }

  const existing = await db
    .select()
    .from(sandboxCheckinsTable)
    .where(and(eq(sandboxCheckinsTable.eventId, event.id), eq(sandboxCheckinsTable.householdId, household.id)))
    .limit(1);

  if (!existing[0]) {
    await db.insert(sandboxCheckinsTable).values({ eventId: event.id, householdId: household.id });
  }

  res.json({ ok: true });
});

export default router;
