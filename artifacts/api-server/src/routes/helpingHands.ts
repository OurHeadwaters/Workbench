import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import {
  hhBandsTable,
  hhMembersTable,
  hhTasksTable,
  hhEarningsTable,
} from "@workspace/db";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { requireAuth, loadBookkeeperUser } from "../lib/bookkeeperAuth";

const router: IRouter = Router();

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Express 5 types req.params values as string | string[]. Always extract a plain string. */
function param(raw: string | string[]): string {
  return Array.isArray(raw) ? raw[0] ?? "" : raw;
}

function serializeMember(row: typeof hhMembersTable.$inferSelect) {
  return {
    id: row.id,
    bandId: row.bandId,
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    xrplAddress: row.xrplAddress ?? null,
    didRef: row.didRef ?? null,
    tier: row.tier,
    isActive: row.isActive,
    missedShiftCount: row.missedShiftCount,
    flaggedForDemotion: row.flaggedForDemotion,
    totalEarnedXrp: row.totalEarnedXrp ?? "0",
    totalEarnedToken: row.totalEarnedToken ?? "0",
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
  };
}

function serializeTask(
  row: typeof hhTasksTable.$inferSelect,
  opts?: { postedByName?: string; claimedByName?: string },
) {
  return {
    id: row.id,
    bandId: row.bandId,
    postedByMemberId: row.postedByMemberId,
    postedByName: opts?.postedByName ?? null,
    claimedByMemberId: row.claimedByMemberId ?? null,
    claimedByName: opts?.claimedByName ?? null,
    title: row.title,
    description: row.description,
    estimatedMinutes: row.estimatedMinutes,
    payAmount: row.payAmount ?? "0",
    payCurrency: row.payCurrency,
    status: row.status,
    escrowSequence: row.escrowSequence ?? null,
    escrowTxHash: row.escrowTxHash ?? null,
    claimedAt: row.claimedAt ? (row.claimedAt instanceof Date ? row.claimedAt.toISOString() : String(row.claimedAt)) : null,
    completedAt: row.completedAt ? (row.completedAt instanceof Date ? row.completedAt.toISOString() : String(row.completedAt)) : null,
    confirmedAt: row.confirmedAt ? (row.confirmedAt instanceof Date ? row.confirmedAt.toISOString() : String(row.confirmedAt)) : null,
    availableDate: row.availableDate,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
  };
}

async function enrichTasksWithNames(tasks: (typeof hhTasksTable.$inferSelect)[]) {
  if (tasks.length === 0) return tasks.map((t) => serializeTask(t));

  const memberIds = new Set<string>();
  for (const t of tasks) {
    memberIds.add(t.postedByMemberId);
    if (t.claimedByMemberId) memberIds.add(t.claimedByMemberId);
  }

  const idList = Array.from(memberIds);
  const members = await db
    .select({ id: hhMembersTable.id, firstName: hhMembersTable.firstName, lastName: hhMembersTable.lastName })
    .from(hhMembersTable)
    .where(inArray(hhMembersTable.id, idList));

  const nameMap = new Map(members.map((m) => [m.id, `${m.firstName} ${m.lastName}`]));

  return tasks.map((t) =>
    serializeTask(t, {
      postedByName: nameMap.get(t.postedByMemberId) ?? undefined,
      claimedByName: t.claimedByMemberId ? nameMap.get(t.claimedByMemberId) : undefined,
    }),
  );
}

async function getOrCreateDefaultBand() {
  const rows = await db.select().from(hhBandsTable).limit(1);
  if (rows[0]) return rows[0];

  const inserted = await db
    .insert(hhBandsTable)
    .values({
      name: process.env.HH_BAND_NAME ?? "Northern Band",
      communityTokenCode: process.env.HH_TOKEN_CODE ?? "HWBAND",
      defaultPayCurrency: "token",
    })
    .returning();
  return inserted[0];
}

async function loadHhMember(req: Request) {
  const bkUser = await loadBookkeeperUser(req);
  if (!bkUser) return null;

  const band = await getOrCreateDefaultBand();

  const existing = await db
    .select()
    .from(hhMembersTable)
    .where(
      and(
        eq(hhMembersTable.clerkUserId, bkUser.clerkUserId),
        eq(hhMembersTable.bandId, band.id),
      ),
    )
    .limit(1);

  if (existing[0]) return { member: existing[0], band, bkUser };

  const inserted = await db
    .insert(hhMembersTable)
    .values({
      bandId: band.id,
      clerkUserId: bkUser.clerkUserId,
      email: bkUser.email,
      firstName: bkUser.firstName ?? bkUser.email.split("@")[0],
      lastName: bkUser.lastName ?? "",
      tier: "task_based",
    })
    .returning();

  return { member: inserted[0], band, bkUser };
}

// ──────────────────────────────────────────────
// GET /helping-hands/band
// ──────────────────────────────────────────────
router.get("/band", requireAuth(), async (_req: Request, res: Response) => {
  const band = await getOrCreateDefaultBand();
  res.json({
    id: band.id,
    name: band.name,
    communityTokenCode: band.communityTokenCode,
    communityTokenIssuer: band.communityTokenIssuer ?? null,
    defaultPayCurrency: band.defaultPayCurrency,
    missedShiftThreshold: band.missedShiftThreshold,
  });
});

// ──────────────────────────────────────────────
// GET /helping-hands/members
// ──────────────────────────────────────────────
router.get("/members", requireAuth(), async (req: Request, res: Response) => {
  const bkUser = req.bookkeeperUser!;
  if (!["owner", "ops_manager"].includes(bkUser.role)) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  const band = await getOrCreateDefaultBand();
  const members = await db
    .select()
    .from(hhMembersTable)
    .where(eq(hhMembersTable.bandId, band.id))
    .orderBy(hhMembersTable.lastName);
  res.json(members.map(serializeMember));
});

// ──────────────────────────────────────────────
// POST /helping-hands/members
// ──────────────────────────────────────────────
const CreateMemberSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  xrplAddress: z.string().optional(),
  tier: z.enum(["full_time", "casual", "task_based"]).optional().default("task_based"),
});

router.post("/members", requireAuth(), async (req: Request, res: Response) => {
  const bkUser = req.bookkeeperUser!;
  if (!["owner", "ops_manager"].includes(bkUser.role)) {
    res.status(403).json({ error: "Only admins can add members" });
    return;
  }

  const parsed = CreateMemberSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const band = await getOrCreateDefaultBand();
  const inserted = await db
    .insert(hhMembersTable)
    .values({
      bandId: band.id,
      email: parsed.data.email,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      xrplAddress: parsed.data.xrplAddress,
      tier: parsed.data.tier,
    })
    .returning();

  res.status(201).json(serializeMember(inserted[0]));
});

// ──────────────────────────────────────────────
// PATCH /helping-hands/members/:id
// ──────────────────────────────────────────────
const UpdateMemberSchema = z.object({
  tier: z.enum(["full_time", "casual", "task_based"]).optional(),
  xrplAddress: z.string().optional(),
  isActive: z.boolean().optional(),
  flaggedForDemotion: z.boolean().optional(),
  missedShiftCount: z.number().int().min(0).optional(),
});

router.patch("/members/:id", requireAuth(), async (req: Request, res: Response) => {
  const bkUser = req.bookkeeperUser!;
  if (!["owner", "ops_manager"].includes(bkUser.role)) {
    res.status(403).json({ error: "Admins only" });
    return;
  }

  const parsed = UpdateMemberSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid" });
    return;
  }

  const memberId = param(req.params.id);
  const band = await getOrCreateDefaultBand();

  const updates: Partial<typeof hhMembersTable.$inferInsert> = {
    ...parsed.data,
    updatedAt: new Date(),
  };

  // Scope update to band to prevent cross-tenant mutations
  const updated = await db
    .update(hhMembersTable)
    .set(updates)
    .where(and(eq(hhMembersTable.id, memberId), eq(hhMembersTable.bandId, band.id)))
    .returning();

  if (!updated[0]) {
    res.status(404).json({ error: "Member not found" });
    return;
  }

  res.json(serializeMember(updated[0]));
});

// ──────────────────────────────────────────────
// GET /helping-hands/tasks
// ──────────────────────────────────────────────
router.get("/tasks", requireAuth(), async (req: Request, res: Response) => {
  const band = await getOrCreateDefaultBand();
  const dateFilter = typeof req.query.date === "string" ? req.query.date : today();
  const statusFilter = typeof req.query.status === "string" ? req.query.status : "all";

  const conditions = [eq(hhTasksTable.bandId, band.id)];
  if (statusFilter !== "all") conditions.push(eq(hhTasksTable.status, statusFilter));
  if (dateFilter !== "all") conditions.push(eq(hhTasksTable.availableDate, dateFilter));

  const tasks = await db
    .select()
    .from(hhTasksTable)
    .where(and(...conditions))
    .orderBy(desc(hhTasksTable.createdAt));

  const serialized = await enrichTasksWithNames(tasks);
  res.json(serialized);
});

// ──────────────────────────────────────────────
// POST /helping-hands/tasks
// ──────────────────────────────────────────────
const CreateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  estimatedMinutes: z.number().int().min(5).optional().default(60),
  payAmount: z.string().min(1),
  payCurrency: z.enum(["token", "xrp"]),
  availableDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

router.post("/tasks", requireAuth(), async (req: Request, res: Response) => {
  const bkUser = req.bookkeeperUser!;
  if (!["owner", "ops_manager"].includes(bkUser.role)) {
    res.status(403).json({ error: "Only admins can post tasks" });
    return;
  }

  const parsed = CreateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid" });
    return;
  }

  const ctx = await loadHhMember(req);
  if (!ctx) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // V1: XRPL escrow is simulated. A real implementation would submit
  // EscrowCreate via xrpl.js and store the ledger sequence + tx hash.
  const simulatedSequence = Math.floor(Date.now() / 1000);

  const inserted = await db
    .insert(hhTasksTable)
    .values({
      bandId: ctx.band.id,
      postedByMemberId: ctx.member.id,
      title: parsed.data.title,
      description: parsed.data.description,
      estimatedMinutes: parsed.data.estimatedMinutes,
      payAmount: parsed.data.payAmount,
      payCurrency: parsed.data.payCurrency,
      status: "available",
      escrowSequence: simulatedSequence,
      availableDate: parsed.data.availableDate,
    })
    .returning();

  const serialized = await enrichTasksWithNames(inserted);
  res.status(201).json(serialized[0]);
});

// ──────────────────────────────────────────────
// POST /helping-hands/tasks/:id/claim
// ──────────────────────────────────────────────
router.post("/tasks/:id/claim", requireAuth(), async (req: Request, res: Response) => {
  const ctx = await loadHhMember(req);
  if (!ctx) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const taskId = param(req.params.id);

  const existing = await db
    .select()
    .from(hhTasksTable)
    .where(and(eq(hhTasksTable.id, taskId), eq(hhTasksTable.bandId, ctx.band.id)))
    .limit(1);

  if (!existing[0]) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  if (existing[0].status !== "available") {
    res.status(409).json({ error: "This task has already been claimed" });
    return;
  }

  // Atomic claim — only succeeds if still "available"
  const updated = await db
    .update(hhTasksTable)
    .set({ status: "claimed", claimedByMemberId: ctx.member.id, claimedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(hhTasksTable.id, taskId), eq(hhTasksTable.status, "available")))
    .returning();

  if (!updated[0]) {
    res.status(409).json({ error: "Task was claimed by someone else — refresh and try again" });
    return;
  }

  const serialized = await enrichTasksWithNames(updated);
  res.json(serialized[0]);
});

// ──────────────────────────────────────────────
// POST /helping-hands/tasks/:id/complete
// ──────────────────────────────────────────────
router.post("/tasks/:id/complete", requireAuth(), async (req: Request, res: Response) => {
  const ctx = await loadHhMember(req);
  if (!ctx) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const taskId = param(req.params.id);

  const existing = await db
    .select()
    .from(hhTasksTable)
    .where(and(eq(hhTasksTable.id, taskId), eq(hhTasksTable.bandId, ctx.band.id)))
    .limit(1);

  if (!existing[0]) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  if (existing[0].status !== "claimed") {
    res.status(409).json({ error: "Task must be claimed before it can be marked done" });
    return;
  }
  if (existing[0].claimedByMemberId !== ctx.member.id) {
    res.status(403).json({ error: "You can only complete your own tasks" });
    return;
  }

  const updated = await db
    .update(hhTasksTable)
    .set({ status: "completed", completedAt: new Date(), updatedAt: new Date() })
    .where(eq(hhTasksTable.id, taskId))
    .returning();

  const serialized = await enrichTasksWithNames(updated);
  res.json(serialized[0]);
});

// ──────────────────────────────────────────────
// POST /helping-hands/tasks/:id/confirm
// ──────────────────────────────────────────────
router.post("/tasks/:id/confirm", requireAuth(), async (req: Request, res: Response) => {
  const bkUser = req.bookkeeperUser!;
  if (!["owner", "ops_manager"].includes(bkUser.role)) {
    res.status(403).json({ error: "Only admins can confirm task completion" });
    return;
  }

  const band = await getOrCreateDefaultBand();
  const taskId = param(req.params.id);

  // Verify the task exists in this band first (for a clean 404 vs 409 distinction)
  const existing = await db
    .select()
    .from(hhTasksTable)
    .where(and(eq(hhTasksTable.id, taskId), eq(hhTasksTable.bandId, band.id)))
    .limit(1);

  if (!existing[0]) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  // V1: XRPL escrow finish is simulated. A real implementation would submit
  // EscrowFinish via xrpl.js, wait for ledger validation, then write earnings.
  const mockTxHash = `SIM_${Date.now().toString(16).toUpperCase()}`;

  // Atomic conditional transition: only update if current status is "completed".
  // This prevents duplicate earnings from concurrent confirm requests — only one
  // request can win the status transition from completed → confirmed.
  const updated = await db
    .update(hhTasksTable)
    .set({ status: "confirmed", confirmedAt: new Date(), escrowTxHash: mockTxHash, updatedAt: new Date() })
    .where(
      and(
        eq(hhTasksTable.id, taskId),
        eq(hhTasksTable.bandId, band.id),
        sql`${hhTasksTable.status} = 'completed'`,
      ),
    )
    .returning();

  if (!updated[0]) {
    // Task exists but wasn't in "completed" state — either already confirmed or wrong state
    const current = existing[0].status;
    if (current === "confirmed") {
      // Idempotent: return the already-confirmed task
      const already = await db.select().from(hhTasksTable).where(eq(hhTasksTable.id, taskId)).limit(1);
      const serialized = await enrichTasksWithNames(already);
      res.json(serialized[0]);
      return;
    }
    res.status(409).json({ error: `Task must be in 'completed' state before it can be confirmed (current: ${current})` });
    return;
  }

  const task = updated[0];
  const memberId = task.claimedByMemberId!;

  // Insert earnings — use ON CONFLICT DO NOTHING as a safety net so that
  // even if a DB-level retry fires, we never create duplicate earning rows.
  await db.insert(hhEarningsTable).values({
    bandId: band.id,
    memberId,
    taskId: task.id,
    amount: task.payAmount,
    currency: task.payCurrency,
    xrplTxHash: mockTxHash,
  }).onConflictDoNothing();

  // Increment the correct member total
  if (task.payCurrency === "xrp") {
    await db
      .update(hhMembersTable)
      .set({
        totalEarnedXrp: sql`${hhMembersTable.totalEarnedXrp} + ${task.payAmount}::numeric`,
        updatedAt: new Date(),
      })
      .where(and(eq(hhMembersTable.id, memberId), eq(hhMembersTable.bandId, band.id)));
  } else {
    await db
      .update(hhMembersTable)
      .set({
        totalEarnedToken: sql`${hhMembersTable.totalEarnedToken} + ${task.payAmount}::numeric`,
        updatedAt: new Date(),
      })
      .where(and(eq(hhMembersTable.id, memberId), eq(hhMembersTable.bandId, band.id)));
  }

  const confirmed = await db
    .select()
    .from(hhTasksTable)
    .where(eq(hhTasksTable.id, taskId))
    .limit(1);
  const serialized = await enrichTasksWithNames(confirmed);
  res.json(serialized[0]);
});

// ──────────────────────────────────────────────
// GET /helping-hands/my/tasks
// ──────────────────────────────────────────────
router.get("/my/tasks", requireAuth(), async (req: Request, res: Response) => {
  const ctx = await loadHhMember(req);
  if (!ctx) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const tasks = await db
    .select()
    .from(hhTasksTable)
    .where(
      and(
        eq(hhTasksTable.claimedByMemberId, ctx.member.id),
        eq(hhTasksTable.bandId, ctx.band.id),
      ),
    )
    .orderBy(desc(hhTasksTable.createdAt));

  const serialized = await enrichTasksWithNames(tasks);
  res.json(serialized);
});

// ──────────────────────────────────────────────
// GET /helping-hands/my/earnings
// ──────────────────────────────────────────────
router.get("/my/earnings", requireAuth(), async (req: Request, res: Response) => {
  const ctx = await loadHhMember(req);
  if (!ctx) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const rows = await db
    .select({
      earning: hhEarningsTable,
      taskTitle: hhTasksTable.title,
    })
    .from(hhEarningsTable)
    .leftJoin(hhTasksTable, eq(hhEarningsTable.taskId, hhTasksTable.id))
    .where(
      and(
        eq(hhEarningsTable.memberId, ctx.member.id),
        eq(hhEarningsTable.bandId, ctx.band.id),
      ),
    )
    .orderBy(desc(hhEarningsTable.earnedAt));

  const earnings = rows.map((r) => ({
    id: r.earning.id,
    taskId: r.earning.taskId,
    taskTitle: r.taskTitle ?? "Unknown task",
    amount: r.earning.amount ?? "0",
    currency: r.earning.currency,
    xrplTxHash: r.earning.xrplTxHash ?? null,
    earnedAt: r.earning.earnedAt instanceof Date ? r.earning.earnedAt.toISOString() : String(r.earning.earnedAt),
  }));

  const totalXrp = earnings
    .filter((e) => e.currency === "xrp")
    .reduce((sum, e) => sum + parseFloat(e.amount), 0)
    .toFixed(6);
  const totalToken = earnings
    .filter((e) => e.currency === "token")
    .reduce((sum, e) => sum + parseFloat(e.amount), 0)
    .toFixed(2);

  res.json({ earnings, totalXrp, totalToken });
});

// ──────────────────────────────────────────────
// GET /helping-hands/dashboard
// ──────────────────────────────────────────────
router.get("/dashboard", requireAuth(), async (req: Request, res: Response) => {
  const bkUser = req.bookkeeperUser!;
  if (!["owner", "ops_manager"].includes(bkUser.role)) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  const band = await getOrCreateDefaultBand();
  const todayStr = today();

  const [available, claimed, pendingConf, flagged, totalMembers, recent] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(hhTasksTable)
      .where(
        and(
          eq(hhTasksTable.bandId, band.id),
          eq(hhTasksTable.availableDate, todayStr),
          eq(hhTasksTable.status, "available"),
        ),
      ),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(hhTasksTable)
      .where(
        and(
          eq(hhTasksTable.bandId, band.id),
          eq(hhTasksTable.availableDate, todayStr),
          eq(hhTasksTable.status, "claimed"),
        ),
      ),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(hhTasksTable)
      .where(and(eq(hhTasksTable.bandId, band.id), eq(hhTasksTable.status, "completed"))),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(hhMembersTable)
      .where(
        and(
          eq(hhMembersTable.bandId, band.id),
          eq(hhMembersTable.flaggedForDemotion, true),
        ),
      ),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(hhMembersTable)
      .where(and(eq(hhMembersTable.bandId, band.id), eq(hhMembersTable.isActive, true))),
    db
      .select()
      .from(hhTasksTable)
      .where(eq(hhTasksTable.bandId, band.id))
      .orderBy(desc(hhTasksTable.updatedAt))
      .limit(8),
  ]);

  const recentSerialized = await enrichTasksWithNames(recent);

  res.json({
    todayAvailable: available[0]?.count ?? 0,
    todayClaimed: claimed[0]?.count ?? 0,
    pendingConfirmation: pendingConf[0]?.count ?? 0,
    flaggedMembers: flagged[0]?.count ?? 0,
    totalMembers: totalMembers[0]?.count ?? 0,
    recentTasks: recentSerialized,
  });
});

export default router;
