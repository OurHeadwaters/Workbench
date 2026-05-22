import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import {
  nurseryProducersTable,
  nurserySessionsTable,
  nurseryInvitesTable,
  nurseryIdeasTable,
  nurseryCommentsTable,
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
  return randomBytes(8).toString("base64url").toUpperCase().replace(/-/g, "X").replace(/_/g, "Y").slice(0, 10);
}

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const NURSERY_SID = "nursery_sid";

function extractToken(req: Request): string | null {
  const signed = req.signedCookies as Record<string, string | false>;
  const sid = signed[NURSERY_SID];
  if (sid && typeof sid === "string") return sid;
  return null;
}

function setSessionCookie(res: Response, token: string) {
  res.cookie(NURSERY_SID, token, {
    httpOnly: true,
    signed: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MS,
  });
}

function clearSessionCookie(res: Response) {
  res.clearCookie(NURSERY_SID, { httpOnly: true, signed: true, sameSite: "lax" });
}

type ProducerRow = typeof nurseryProducersTable.$inferSelect;

async function getProducer(req: Request): Promise<ProducerRow | null> {
  const token = extractToken(req);
  if (!token) return null;
  const now = new Date();
  const rows = await db
    .select({ producer: nurseryProducersTable })
    .from(nurserySessionsTable)
    .innerJoin(nurseryProducersTable, eq(nurserySessionsTable.producerId, nurseryProducersTable.id))
    .where(and(eq(nurserySessionsTable.token, token), gt(nurserySessionsTable.expiresAt, now)))
    .limit(1);
  return rows[0]?.producer ?? null;
}

function requireProducer() {
  return async (req: Request, res: Response, next: () => void) => {
    const producer = await getProducer(req);
    if (!producer) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.locals.producer = producer;
    next();
  };
}

function requireSteward() {
  return async (req: Request, res: Response, next: () => void) => {
    const producer = res.locals.producer as ProducerRow | undefined;
    if (!producer?.isSteward) {
      res.status(403).json({ error: "Steward access required" });
      return;
    }
    next();
  };
}

function serializeProducer(p: ProducerRow) {
  return {
    id: p.id,
    name: p.name,
    isSteward: p.isSteward,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
  };
}

// ──────────────────────────────────────────────
// POST /nursery/producers — join
// First producer becomes steward (bootstrap). After that, invite required.
// isStewardInvite on the invite record elevates the new producer.
// ──────────────────────────────────────────────
const JoinSchema = z.object({
  name: z.string().min(1).max(80),
  passphrase: z.string().min(4),
  inviteCode: z.string().optional(),
});

router.post("/producers", async (req: Request, res: Response) => {
  const parsed = JoinSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { name, passphrase, inviteCode } = parsed.data;

  const countRows = await db.select({ c: sql<number>`count(*)::int` }).from(nurseryProducersTable);
  const existingCount = countRows[0]?.c ?? 0;
  const isFirst = existingCount === 0;

  if (!isFirst && !inviteCode) {
    res.status(403).json({ error: "An invite code is required to join this nursery" });
    return;
  }

  type JoinResult = { token: string; producer: ReturnType<typeof serializeProducer> };
  let result: JoinResult;

  try {
    result = await db.transaction(async (tx) => {
      let isStewardInvite = false;

      if (!isFirst && inviteCode) {
        const inviteRows = await tx
          .select()
          .from(nurseryInvitesTable)
          .where(and(eq(nurseryInvitesTable.code, inviteCode), isNull(nurseryInvitesTable.usedByProducerId)))
          .for("update")
          .limit(1);
        if (!inviteRows[0]) {
          throw Object.assign(new Error("Invite code is invalid or has already been used"), { status: 403 });
        }
        isStewardInvite = inviteRows[0].isStewardInvite;
      }

      const existing = await tx
        .select({ id: nurseryProducersTable.id })
        .from(nurseryProducersTable)
        .where(eq(nurseryProducersTable.name, name))
        .limit(1);

      if (existing[0]) {
        throw Object.assign(new Error("That name is already taken"), { status: 409 });
      }

      const hash = hashPassphrase(passphrase);
      const [producer] = await tx
        .insert(nurseryProducersTable)
        .values({ name, passphraseHash: hash, isSteward: isFirst || isStewardInvite })
        .returning();

      if (!producer) throw new Error("Failed to create producer");

      if (!isFirst && inviteCode) {
        const consumed = await tx
          .update(nurseryInvitesTable)
          .set({ usedByProducerId: producer.id, usedAt: new Date() })
          .where(and(eq(nurseryInvitesTable.code, inviteCode), isNull(nurseryInvitesTable.usedByProducerId)))
          .returning({ id: nurseryInvitesTable.id });
        if (consumed.length === 0) {
          throw Object.assign(new Error("Invite code is invalid or has already been used"), { status: 403 });
        }
      }

      const token = generateToken();
      const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
      await tx.insert(nurserySessionsTable).values({ producerId: producer.id, token, expiresAt });

      return { token, producer: serializeProducer(producer) };
    });
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    const status = e.status ?? 500;
    res.status(status).json({ error: e.message ?? "Internal error" });
    return;
  }

  setSessionCookie(res, result.token);
  res.status(201).json({ producer: result.producer });
});

// ──────────────────────────────────────────────
// POST /nursery/sessions — login
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
    .from(nurseryProducersTable)
    .where(eq(nurseryProducersTable.name, name))
    .limit(1);

  const producer = rows[0];
  if (!producer || !verifyPassphrase(passphrase, producer.passphraseHash)) {
    res.status(401).json({ error: "Incorrect name or passphrase" });
    return;
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(nurserySessionsTable).values({ producerId: producer.id, token, expiresAt });

  setSessionCookie(res, token);
  res.json({ producer: serializeProducer(producer) });
});

// ──────────────────────────────────────────────
// DELETE /nursery/sessions — logout
// ──────────────────────────────────────────────
router.delete("/sessions", requireProducer(), async (req: Request, res: Response) => {
  const token = extractToken(req);
  if (token) {
    await db.delete(nurserySessionsTable).where(eq(nurserySessionsTable.token, token));
  }
  clearSessionCookie(res);
  res.status(204).end();
});

// ──────────────────────────────────────────────
// GET /nursery/me
// ──────────────────────────────────────────────
router.get("/me", requireProducer(), async (_req: Request, res: Response) => {
  res.json(serializeProducer(res.locals.producer as ProducerRow));
});

// ──────────────────────────────────────────────
// GET /nursery/invites — steward only
// ──────────────────────────────────────────────
router.get("/invites", requireProducer(), requireSteward(), async (_req: Request, res: Response) => {
  const rows = await db
    .select({
      invite: nurseryInvitesTable,
      usedBy: { name: nurseryProducersTable.name },
    })
    .from(nurseryInvitesTable)
    .leftJoin(nurseryProducersTable, eq(nurseryInvitesTable.usedByProducerId, nurseryProducersTable.id))
    .orderBy(desc(nurseryInvitesTable.createdAt));

  res.json(rows.map(({ invite, usedBy }) => ({
    id: invite.id,
    code: invite.code,
    note: invite.note,
    isStewardInvite: invite.isStewardInvite,
    createdAt: invite.createdAt instanceof Date ? invite.createdAt.toISOString() : String(invite.createdAt),
    usedAt: invite.usedAt ? (invite.usedAt instanceof Date ? invite.usedAt.toISOString() : String(invite.usedAt)) : null,
    usedByProducerName: usedBy?.name ?? null,
  })));
});

// ──────────────────────────────────────────────
// POST /nursery/invites — steward only
// ──────────────────────────────────────────────
const CreateInviteSchema = z.object({
  note: z.string().max(100).optional().default(""),
  isStewardInvite: z.boolean().optional().default(false),
});

router.post("/invites", requireProducer(), requireSteward(), async (req: Request, res: Response) => {
  const producer = res.locals.producer as ProducerRow;
  const parsed = CreateInviteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const code = generateInviteCode();
  const [invite] = await db
    .insert(nurseryInvitesTable)
    .values({
      code,
      note: parsed.data.note,
      isStewardInvite: parsed.data.isStewardInvite,
      createdByProducerId: producer.id,
    })
    .returning();

  res.status(201).json({
    id: invite!.id,
    code: invite!.code,
    note: invite!.note,
    isStewardInvite: invite!.isStewardInvite,
    createdAt: invite!.createdAt instanceof Date ? invite!.createdAt.toISOString() : String(invite!.createdAt),
    usedAt: null,
    usedByProducerName: null,
  });
});

// ──────────────────────────────────────────────
// DELETE /nursery/invites/:id — steward only
// ──────────────────────────────────────────────
router.delete("/invites/:id", requireProducer(), requireSteward(), async (req: Request, res: Response) => {
  const inviteId = param(req.params.id);
  const rows = await db.select().from(nurseryInvitesTable).where(eq(nurseryInvitesTable.id, inviteId)).limit(1);
  if (!rows[0]) {
    res.status(404).json({ error: "Invite not found" });
    return;
  }
  if (rows[0].usedByProducerId) {
    res.status(400).json({ error: "Cannot revoke an invite that has already been used" });
    return;
  }
  await db.delete(nurseryInvitesTable).where(eq(nurseryInvitesTable.id, inviteId));
  res.status(204).end();
});

// ──────────────────────────────────────────────
// Idea helpers
// ──────────────────────────────────────────────

async function serializeIdea(idea: typeof nurseryIdeasTable.$inferSelect, producerName: string) {
  return {
    id: idea.id,
    title: idea.title,
    vernacularName: idea.vernacularName,
    massityName: idea.massityName,
    problemStatement: idea.problemStatement,
    stage: idea.stage,
    stageHistory: Array.isArray(idea.stageHistory) ? idea.stageHistory : [],
    stewardNotes: idea.stewardNotes,
    isDraft: idea.isDraft,
    graduationReason: idea.graduationReason ?? null,
    createdByProducerId: idea.createdByProducerId,
    createdByProducerName: producerName,
    updatedAt: idea.updatedAt instanceof Date ? idea.updatedAt.toISOString() : String(idea.updatedAt),
    createdAt: idea.createdAt instanceof Date ? idea.createdAt.toISOString() : String(idea.createdAt),
  };
}

// ──────────────────────────────────────────────
// GET /nursery/ideas — all producers
// ──────────────────────────────────────────────
router.get("/ideas", requireProducer(), async (_req: Request, res: Response) => {
  const producer = res.locals.producer as ProducerRow;

  const rows = await db
    .select({
      idea: nurseryIdeasTable,
      creator: { name: nurseryProducersTable.name },
    })
    .from(nurseryIdeasTable)
    .innerJoin(nurseryProducersTable, eq(nurseryIdeasTable.createdByProducerId, nurseryProducersTable.id))
    .orderBy(asc(nurseryIdeasTable.stage), desc(nurseryIdeasTable.updatedAt));

  const filtered = producer.isSteward
    ? rows
    : rows.filter(({ idea }) => !idea.isDraft || idea.createdByProducerId === producer.id);

  res.json(
    await Promise.all(
      filtered.map(({ idea, creator }) => serializeIdea(idea, creator.name))
    )
  );
});

// ──────────────────────────────────────────────
// POST /nursery/ideas
// Stewards: full creation (isDraft=false by default)
// Producers: create draft (isDraft=true enforced)
// ──────────────────────────────────────────────
const CreateIdeaSchema = z.object({
  title: z.string().min(1).max(200),
  vernacularName: z.string().max(200).optional().default(""),
  massityName: z.string().max(200).optional().default(""),
  problemStatement: z.string().max(5000).optional().default(""),
  stewardNotes: z.string().max(5000).optional().default(""),
  isDraft: z.boolean().optional(),
});

router.post("/ideas", requireProducer(), async (req: Request, res: Response) => {
  const producer = res.locals.producer as ProducerRow;
  const parsed = CreateIdeaSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const isDraft = producer.isSteward ? (parsed.data.isDraft ?? false) : true;

  const initialHistory = producer.isSteward && !isDraft
    ? JSON.stringify([{
        stage: "nursery",
        movedAt: new Date().toISOString(),
        movedBy: producer.name,
        note: "Created",
      }])
    : JSON.stringify([]);

  const [idea] = await db
    .insert(nurseryIdeasTable)
    .values({
      title: parsed.data.title,
      vernacularName: parsed.data.vernacularName,
      massityName: parsed.data.massityName,
      problemStatement: parsed.data.problemStatement,
      stewardNotes: producer.isSteward ? parsed.data.stewardNotes : "",
      isDraft,
      stage: "nursery",
      stageHistory: initialHistory,
      createdByProducerId: producer.id,
    })
    .returning();

  if (!idea) {
    res.status(500).json({ error: "Failed to create idea" });
    return;
  }

  res.status(201).json(await serializeIdea(idea, producer.name));
});

// ──────────────────────────────────────────────
// GET /nursery/ideas/:id — all producers
// ──────────────────────────────────────────────
router.get("/ideas/:id", requireProducer(), async (req: Request, res: Response) => {
  const producer = res.locals.producer as ProducerRow;
  const ideaId = param(req.params.id);

  const rows = await db
    .select({
      idea: nurseryIdeasTable,
      creator: { name: nurseryProducersTable.name },
    })
    .from(nurseryIdeasTable)
    .innerJoin(nurseryProducersTable, eq(nurseryIdeasTable.createdByProducerId, nurseryProducersTable.id))
    .where(eq(nurseryIdeasTable.id, ideaId))
    .limit(1);

  const row = rows[0];
  if (!row) {
    res.status(404).json({ error: "Idea not found" });
    return;
  }

  if (row.idea.isDraft && !producer.isSteward && row.idea.createdByProducerId !== producer.id) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  const comments = await db
    .select({
      comment: nurseryCommentsTable,
      commenter: { name: nurseryProducersTable.name },
    })
    .from(nurseryCommentsTable)
    .innerJoin(nurseryProducersTable, eq(nurseryCommentsTable.producerId, nurseryProducersTable.id))
    .where(eq(nurseryCommentsTable.ideaId, ideaId))
    .orderBy(asc(nurseryCommentsTable.createdAt));

  const base = await serializeIdea(row.idea, row.creator.name);
  res.json({
    ...base,
    comments: comments.map(({ comment, commenter }) => ({
      id: comment.id,
      ideaId: comment.ideaId,
      producerId: comment.producerId,
      producerName: commenter.name,
      body: comment.body,
      createdAt: comment.createdAt instanceof Date ? comment.createdAt.toISOString() : String(comment.createdAt),
    })),
  });
});

// ──────────────────────────────────────────────
// PATCH /nursery/ideas/:id — steward only
// ──────────────────────────────────────────────
const UpdateIdeaSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  vernacularName: z.string().max(200).optional(),
  massityName: z.string().max(200).optional(),
  problemStatement: z.string().max(5000).optional(),
  stewardNotes: z.string().max(5000).optional(),
  isDraft: z.boolean().optional(),
});

router.patch("/ideas/:id", requireProducer(), requireSteward(), async (req: Request, res: Response) => {
  const ideaId = param(req.params.id);
  const parsed = UpdateIdeaSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const rows = await db
    .select({ idea: nurseryIdeasTable, creator: { name: nurseryProducersTable.name } })
    .from(nurseryIdeasTable)
    .innerJoin(nurseryProducersTable, eq(nurseryIdeasTable.createdByProducerId, nurseryProducersTable.id))
    .where(eq(nurseryIdeasTable.id, ideaId))
    .limit(1);

  if (!rows[0]) {
    res.status(404).json({ error: "Idea not found" });
    return;
  }

  type IdeaUpdate = Partial<typeof nurseryIdeasTable.$inferInsert>;
  const updates: IdeaUpdate = { updatedAt: new Date() };
  if (parsed.data.title !== undefined) updates.title = parsed.data.title;
  if (parsed.data.vernacularName !== undefined) updates.vernacularName = parsed.data.vernacularName;
  if (parsed.data.massityName !== undefined) updates.massityName = parsed.data.massityName;
  if (parsed.data.problemStatement !== undefined) updates.problemStatement = parsed.data.problemStatement;
  if (parsed.data.stewardNotes !== undefined) updates.stewardNotes = parsed.data.stewardNotes;
  if (parsed.data.isDraft !== undefined) updates.isDraft = parsed.data.isDraft;

  const [updated] = await db.update(nurseryIdeasTable).set(updates).where(eq(nurseryIdeasTable.id, ideaId)).returning();

  if (!updated) {
    res.status(500).json({ error: "Failed to update" });
    return;
  }

  res.json(await serializeIdea(updated, rows[0].creator.name));
});

// ──────────────────────────────────────────────
// POST /nursery/ideas/:id/stage — steward only
// Appends to stageHistory, updates stage.
// Graduating requires a graduation reason.
// ──────────────────────────────────────────────
const StageMoveSchema = z.object({
  stage: z.enum(["nursery", "fodder", "fallow", "graduated"]),
  note: z.string().max(500).optional().default(""),
  graduationReason: z.string().max(2000).optional(),
});

router.post("/ideas/:id/stage", requireProducer(), requireSteward(), async (req: Request, res: Response) => {
  const producer = res.locals.producer as ProducerRow;
  const ideaId = param(req.params.id);
  const parsed = StageMoveSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { stage, note, graduationReason } = parsed.data;

  if (stage === "graduated" && !graduationReason?.trim()) {
    res.status(400).json({ error: "A graduation reason is required" });
    return;
  }

  const rows = await db
    .select({ idea: nurseryIdeasTable, creator: { name: nurseryProducersTable.name } })
    .from(nurseryIdeasTable)
    .innerJoin(nurseryProducersTable, eq(nurseryIdeasTable.createdByProducerId, nurseryProducersTable.id))
    .where(eq(nurseryIdeasTable.id, ideaId))
    .limit(1);

  if (!rows[0]) {
    res.status(404).json({ error: "Idea not found" });
    return;
  }

  if (rows[0].idea.stage === "graduated") {
    res.status(400).json({ error: "This idea has already graduated" });
    return;
  }

  const currentHistory = Array.isArray(rows[0].idea.stageHistory) ? rows[0].idea.stageHistory : [];
  const newEntry = {
    stage,
    movedAt: new Date().toISOString(),
    movedBy: producer.name,
    note: note || "",
  };

  const updatedHistory = JSON.stringify([...currentHistory, newEntry]);

  type IdeaUpdate = Partial<typeof nurseryIdeasTable.$inferInsert>;
  const updateData: IdeaUpdate = {
    stage,
    stageHistory: updatedHistory,
    isDraft: false,
    updatedAt: new Date(),
  };
  if (stage === "graduated" && graduationReason) {
    updateData.graduationReason = graduationReason;
  }

  const [updated] = await db.update(nurseryIdeasTable).set(updateData).where(eq(nurseryIdeasTable.id, ideaId)).returning();

  if (!updated) {
    res.status(500).json({ error: "Failed to move stage" });
    return;
  }

  res.json(await serializeIdea(updated, rows[0].creator.name));
});

// ──────────────────────────────────────────────
// DELETE /nursery/ideas/:id — steward only
// ──────────────────────────────────────────────
router.delete("/ideas/:id", requireProducer(), requireSteward(), async (req: Request, res: Response) => {
  const ideaId = param(req.params.id);
  const rows = await db.select().from(nurseryIdeasTable).where(eq(nurseryIdeasTable.id, ideaId)).limit(1);
  if (!rows[0]) {
    res.status(404).json({ error: "Idea not found" });
    return;
  }
  await db.delete(nurseryIdeasTable).where(eq(nurseryIdeasTable.id, ideaId));
  res.status(204).end();
});

// ──────────────────────────────────────────────
// GET /nursery/ideas/:id/comments — all producers
// ──────────────────────────────────────────────
router.get("/ideas/:id/comments", requireProducer(), async (req: Request, res: Response) => {
  const producer = res.locals.producer as ProducerRow;
  const ideaId = param(req.params.id);

  const ideaRows = await db.select().from(nurseryIdeasTable).where(eq(nurseryIdeasTable.id, ideaId)).limit(1);
  if (!ideaRows[0]) {
    res.status(404).json({ error: "Idea not found" });
    return;
  }
  if (ideaRows[0].isDraft && !producer.isSteward && ideaRows[0].createdByProducerId !== producer.id) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  const comments = await db
    .select({
      comment: nurseryCommentsTable,
      commenter: { name: nurseryProducersTable.name },
    })
    .from(nurseryCommentsTable)
    .innerJoin(nurseryProducersTable, eq(nurseryCommentsTable.producerId, nurseryProducersTable.id))
    .where(eq(nurseryCommentsTable.ideaId, ideaId))
    .orderBy(asc(nurseryCommentsTable.createdAt));

  res.json(comments.map(({ comment, commenter }) => ({
    id: comment.id,
    ideaId: comment.ideaId,
    producerId: comment.producerId,
    producerName: commenter.name,
    body: comment.body,
    createdAt: comment.createdAt instanceof Date ? comment.createdAt.toISOString() : String(comment.createdAt),
  })));
});

// ──────────────────────────────────────────────
// POST /nursery/ideas/:id/comments — all producers
// ──────────────────────────────────────────────
const CreateCommentSchema = z.object({
  body: z.string().min(1).max(2000),
});

router.post("/ideas/:id/comments", requireProducer(), async (req: Request, res: Response) => {
  const producer = res.locals.producer as ProducerRow;
  const ideaId = param(req.params.id);

  const parsed = CreateCommentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Comment body is required" });
    return;
  }

  const ideaRows = await db.select().from(nurseryIdeasTable).where(eq(nurseryIdeasTable.id, ideaId)).limit(1);
  if (!ideaRows[0]) {
    res.status(404).json({ error: "Idea not found" });
    return;
  }
  if (ideaRows[0].isDraft && !producer.isSteward && ideaRows[0].createdByProducerId !== producer.id) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  const [comment] = await db
    .insert(nurseryCommentsTable)
    .values({ ideaId, producerId: producer.id, body: parsed.data.body })
    .returning();

  if (!comment) {
    res.status(500).json({ error: "Failed to create comment" });
    return;
  }

  res.status(201).json({
    id: comment.id,
    ideaId: comment.ideaId,
    producerId: comment.producerId,
    producerName: producer.name,
    body: comment.body,
    createdAt: comment.createdAt instanceof Date ? comment.createdAt.toISOString() : String(comment.createdAt),
  });
});

export default router;
