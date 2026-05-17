import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import {
  hhBandsTable,
  hhMembersTable,
  hhTasksTable,
  hhEarningsTable,
  hhBonusesTable,
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
    completedShiftCount: row.completedShiftCount ?? 0,
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
    reliabilityBonusThreshold: band.reliabilityBonusThreshold,
    reliabilityBonusAmount: band.reliabilityBonusAmount,
    reliabilityBonusCurrency: band.reliabilityBonusCurrency,
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
      res.json({ task: serialized[0], bonusAwarded: null });
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

  // Atomically increment completedShiftCount and update the correct total.
  // RETURNING gives us the post-increment count without an extra SELECT.
  const memberUpdated = await db
    .update(hhMembersTable)
    .set(
      task.payCurrency === "xrp"
        ? {
            completedShiftCount: sql`${hhMembersTable.completedShiftCount} + 1`,
            totalEarnedXrp: sql`${hhMembersTable.totalEarnedXrp} + ${task.payAmount}::numeric`,
            updatedAt: new Date(),
          }
        : {
            completedShiftCount: sql`${hhMembersTable.completedShiftCount} + 1`,
            totalEarnedToken: sql`${hhMembersTable.totalEarnedToken} + ${task.payAmount}::numeric`,
            updatedAt: new Date(),
          },
    )
    .where(and(eq(hhMembersTable.id, memberId), eq(hhMembersTable.bandId, band.id)))
    .returning({
      completedShiftCount: hhMembersTable.completedShiftCount,
      firstName: hhMembersTable.firstName,
      lastName: hhMembersTable.lastName,
    });

  // ── Reliability bonus ──────────────────────────────────────────────────────
  // Award a bonus every time completedShiftCount hits a multiple of the band's
  // reliability threshold. Insert into hh_bonuses and credit the member total.
  let bonusAwarded: {
    id: string;
    memberId: string;
    firstName: string;
    lastName: string;
    amount: string;
    currency: string;
    reason: string;
    milestone: number;
    awardedAt: string;
  } | null = null;

  const newCount = memberUpdated[0]?.completedShiftCount ?? 0;
  const threshold = band.reliabilityBonusThreshold;
  const bonusAmount = band.reliabilityBonusAmount;
  const bonusCurrency = band.reliabilityBonusCurrency;

  if (newCount > 0 && threshold > 0 && newCount % threshold === 0) {
    const reason = `Reliability bonus — ${newCount} confirmed shifts`;
    const bonusMockTxHash = `BONUS_SIM_${Date.now().toString(16).toUpperCase()}`;

    const inserted = await db
      .insert(hhBonusesTable)
      .values({
        bandId: band.id,
        memberId,
        amount: bonusAmount,
        currency: bonusCurrency,
        reason,
        milestone: newCount,
      })
      .returning();

    // Credit the bonus earnings to the member total
    if (bonusCurrency === "xrp") {
      await db
        .update(hhMembersTable)
        .set({
          totalEarnedXrp: sql`${hhMembersTable.totalEarnedXrp} + ${bonusAmount}::numeric`,
          updatedAt: new Date(),
        })
        .where(and(eq(hhMembersTable.id, memberId), eq(hhMembersTable.bandId, band.id)));
    } else {
      await db
        .update(hhMembersTable)
        .set({
          totalEarnedToken: sql`${hhMembersTable.totalEarnedToken} + ${bonusAmount}::numeric`,
          updatedAt: new Date(),
        })
        .where(and(eq(hhMembersTable.id, memberId), eq(hhMembersTable.bandId, band.id)));
    }

    void bonusMockTxHash; // reserved for future XRPL escrow integration
    const bonus = inserted[0]!;
    bonusAwarded = {
      id: bonus.id,
      memberId,
      firstName: memberUpdated[0]?.firstName ?? "",
      lastName: memberUpdated[0]?.lastName ?? "",
      amount: bonus.amount,
      currency: bonus.currency,
      reason: bonus.reason,
      milestone: bonus.milestone,
      awardedAt: bonus.awardedAt instanceof Date ? bonus.awardedAt.toISOString() : String(bonus.awardedAt),
    };
  }

  const confirmed = await db
    .select()
    .from(hhTasksTable)
    .where(eq(hhTasksTable.id, taskId))
    .limit(1);
  const serialized = await enrichTasksWithNames(confirmed);
  res.json({ task: serialized[0], bonusAwarded });
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
// POST /helping-hands/tasks/:id/expire
// Admin-callable: expire a single overdue claimed task and
// increment the claimer's missed-shift count if they are full_time.
// ──────────────────────────────────────────────
router.post("/tasks/:id/expire", requireAuth(), async (req: Request, res: Response) => {
  const bkUser = req.bookkeeperUser!;
  if (!["owner", "ops_manager"].includes(bkUser.role)) {
    res.status(403).json({ error: "Admins only" });
    return;
  }

  const band = await getOrCreateDefaultBand();
  const taskId = param(req.params.id);

  const existing = await db
    .select()
    .from(hhTasksTable)
    .where(and(eq(hhTasksTable.id, taskId), eq(hhTasksTable.bandId, band.id)))
    .limit(1);

  if (!existing[0]) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  const task = existing[0];

  if (task.status !== "claimed") {
    res.status(409).json({ error: `Task is '${task.status}', not 'claimed' — nothing to expire` });
    return;
  }

  if (task.availableDate >= today()) {
    res.status(409).json({ error: "Task date has not passed yet" });
    return;
  }

  // Transition task to missed
  const updated = await db
    .update(hhTasksTable)
    .set({ status: "missed", updatedAt: new Date() })
    .where(and(eq(hhTasksTable.id, taskId), eq(hhTasksTable.status, "claimed")))
    .returning();

  if (!updated[0]) {
    res.status(409).json({ error: "Task state changed concurrently — retry" });
    return;
  }

  // Only penalise full_time members — use atomic SQL increment to
  // avoid read-then-write races with the daily scheduler.
  if (task.claimedByMemberId) {
    await db
      .update(hhMembersTable)
      .set({
        missedShiftCount: sql`${hhMembersTable.missedShiftCount} + 1`,
        flaggedForDemotion: sql`
          CASE
            WHEN ${hhMembersTable.missedShiftCount} + 1 >= ${band.missedShiftThreshold}
            THEN true
            ELSE ${hhMembersTable.flaggedForDemotion}
          END
        `,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(hhMembersTable.id, task.claimedByMemberId),
          eq(hhMembersTable.bandId, band.id),
          eq(hhMembersTable.tier, "full_time"),
        ),
      );
  }

  const serialized = await enrichTasksWithNames(updated);
  res.json(serialized[0]);
});

// ──────────────────────────────────────────────
// runExpireOverdue — shared core logic
// Exported so the scheduler in index.ts can call it without HTTP.
// Returns { expired, flagged } — the number of tasks transitioned to
// "missed" and the number of Full-Time members newly flagged.
// ──────────────────────────────────────────────
export async function runExpireOverdue(): Promise<{ expired: number; flagged: number; message: string }> {
  const band = await getOrCreateDefaultBand();
  const todayStr = today();

  // Atomically transition all overdue claimed tasks to "missed" and
  // return only the rows that were actually updated — this avoids the
  // race-condition overcounting that would occur if we computed
  // penalties from a prior SELECT that may include tasks updated
  // concurrently by another process.
  const transitioned = await db
    .update(hhTasksTable)
    .set({ status: "missed", updatedAt: new Date() })
    .where(
      and(
        eq(hhTasksTable.bandId, band.id),
        eq(hhTasksTable.status, "claimed"),
        sql`${hhTasksTable.availableDate} < ${todayStr}`,
      ),
    )
    .returning();

  if (transitioned.length === 0) {
    return { expired: 0, flagged: 0, message: "No overdue tasks found" };
  }

  // Aggregate missed shifts per member using only actually-transitioned rows
  const countByMember = new Map<string, number>();
  for (const task of transitioned) {
    if (task.claimedByMemberId) {
      countByMember.set(task.claimedByMemberId, (countByMember.get(task.claimedByMemberId) ?? 0) + 1);
    }
  }

  let newlyFlagged = 0;

  for (const [memberId, missedCount] of countByMember) {
    // Atomically increment the count and set the flag in a single UPDATE,
    // using RETURNING to read the post-increment values without a prior
    // SELECT — this prevents lost updates under concurrent expire runs.
    const updated = await db
      .update(hhMembersTable)
      .set({
        missedShiftCount: sql`${hhMembersTable.missedShiftCount} + ${missedCount}`,
        flaggedForDemotion: sql`
          CASE
            WHEN ${hhMembersTable.missedShiftCount} + ${missedCount} >= ${band.missedShiftThreshold}
            THEN true
            ELSE ${hhMembersTable.flaggedForDemotion}
          END
        `,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(hhMembersTable.id, memberId),
          eq(hhMembersTable.bandId, band.id),
          eq(hhMembersTable.tier, "full_time"),
        ),
      )
      .returning({
        flaggedForDemotion: hhMembersTable.flaggedForDemotion,
        missedShiftCount: hhMembersTable.missedShiftCount,
      });

    // Row not updated means the member is not full_time — skip
    if (!updated[0]) continue;

    // Newly flagged = flag is now true AND count just crossed the threshold
    const isNowFlagged = updated[0].flaggedForDemotion;
    const justCrossed = updated[0].missedShiftCount >= band.missedShiftThreshold
      && updated[0].missedShiftCount - missedCount < band.missedShiftThreshold;
    if (isNowFlagged && justCrossed) newlyFlagged++;
  }

  return {
    expired: transitioned.length,
    flagged: newlyFlagged,
    message: `${transitioned.length} task${transitioned.length !== 1 ? "s" : ""} expired; ${newlyFlagged} member${newlyFlagged !== 1 ? "s" : ""} newly flagged`,
  };
}

// ──────────────────────────────────────────────
// POST /helping-hands/expire-overdue
// Admin-callable HTTP trigger for the same logic (also runs on a
// daily schedule via the startup scheduler in index.ts).
// ──────────────────────────────────────────────
router.post("/expire-overdue", requireAuth(), async (req: Request, res: Response) => {
  const bkUser = req.bookkeeperUser!;
  if (!["owner", "ops_manager"].includes(bkUser.role)) {
    res.status(403).json({ error: "Admins only" });
    return;
  }

  const result = await runExpireOverdue();
  res.json(result);
});

// ──────────────────────────────────────────────
// GET /helping-hands/bonuses
// Admin — list all reliability bonus payments
// ──────────────────────────────────────────────
router.get("/bonuses", requireAuth(), async (req: Request, res: Response) => {
  const bkUser = req.bookkeeperUser!;
  if (!["owner", "ops_manager"].includes(bkUser.role)) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  const band = await getOrCreateDefaultBand();

  const rows = await db
    .select({
      id: hhBonusesTable.id,
      memberId: hhBonusesTable.memberId,
      firstName: hhMembersTable.firstName,
      lastName: hhMembersTable.lastName,
      amount: hhBonusesTable.amount,
      currency: hhBonusesTable.currency,
      reason: hhBonusesTable.reason,
      milestone: hhBonusesTable.milestone,
      awardedAt: hhBonusesTable.awardedAt,
    })
    .from(hhBonusesTable)
    .innerJoin(hhMembersTable, eq(hhBonusesTable.memberId, hhMembersTable.id))
    .where(eq(hhBonusesTable.bandId, band.id))
    .orderBy(desc(hhBonusesTable.awardedAt));

  res.json(
    rows.map((r) => ({
      ...r,
      awardedAt: r.awardedAt instanceof Date ? r.awardedAt.toISOString() : String(r.awardedAt),
    })),
  );
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

  const [available, claimed, pendingConf, flagged, totalMembers, recent, topContributors] = await Promise.all([
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
    // Top 5 most active members, sorted by confirmed shifts desc
    db
      .select({
        id: hhMembersTable.id,
        firstName: hhMembersTable.firstName,
        lastName: hhMembersTable.lastName,
        tier: hhMembersTable.tier,
        completedShiftCount: hhMembersTable.completedShiftCount,
        totalEarnedToken: hhMembersTable.totalEarnedToken,
        totalEarnedXrp: hhMembersTable.totalEarnedXrp,
      })
      .from(hhMembersTable)
      .where(and(eq(hhMembersTable.bandId, band.id), eq(hhMembersTable.isActive, true)))
      .orderBy(desc(hhMembersTable.completedShiftCount))
      .limit(5),
  ]);

  const recentSerialized = await enrichTasksWithNames(recent);

  res.json({
    todayAvailable: available[0]?.count ?? 0,
    todayClaimed: claimed[0]?.count ?? 0,
    pendingConfirmation: pendingConf[0]?.count ?? 0,
    flaggedMembers: flagged[0]?.count ?? 0,
    totalMembers: totalMembers[0]?.count ?? 0,
    recentTasks: recentSerialized,
    topContributors: topContributors.map((m) => ({
      id: m.id,
      firstName: m.firstName,
      lastName: m.lastName,
      tier: m.tier,
      completedShiftCount: m.completedShiftCount ?? 0,
      totalEarnedToken: m.totalEarnedToken ?? "0",
      totalEarnedXrp: m.totalEarnedXrp ?? "0",
    })),
  });
});

export default router;
