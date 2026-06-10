import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import {
  hhBandsTable,
  hhMembersTable,
  hhTasksTable,
  hhEarningsTable,
  hhBonusesTable,
  hhMerchantsTable,
  hhEnvelopesTable,
  hhEnvelopeTransactionsTable,
  hhTipsTable,
  hhReferralsTable,
  hhBadgeCategoriesTable,
  hhMemberBadgesTable,
  practitionerApplicationsTable,
} from "@workspace/db";
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { requireAuth, loadBookkeeperUser } from "../lib/bookkeeperAuth";
import { requireFounderOnlyAuth } from "../lib/kitAuth";
import {
  bandUsesXrplEscrow,
  escrowWalletAddress,
  submitEscrowCreate,
  submitEscrowFinish,
  submitEscrowCancel,
  getWalletBalance,
} from "../lib/xrplEscrow";
import { logger } from "../lib/logger";

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
    noShowCount: row.noShowCount ?? 0,
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

  // ── Primary lookup: by clerkUserId (fast path for returning users) ──
  const byClerk = await db
    .select()
    .from(hhMembersTable)
    .where(
      and(
        eq(hhMembersTable.clerkUserId, bkUser.clerkUserId),
        eq(hhMembersTable.bandId, band.id),
      ),
    )
    .limit(1);

  if (byClerk[0]) return { member: byClerk[0], band, bkUser };

  // ── Identity reconciliation: referral-created members have no clerkUserId ──
  // When a user signed up via a referral link (/economy/join/:code) we created
  // an hh_members row with only their email. The first time they authenticate
  // with Clerk we land here. We match on normalised email + band and backfill
  // clerkUserId so their referral bonus and member state aren't orphaned.
  const normalizedEmail = bkUser.email.toLowerCase();
  const byEmail = await db
    .select()
    .from(hhMembersTable)
    .where(
      and(
        eq(hhMembersTable.email, normalizedEmail),
        eq(hhMembersTable.bandId, band.id),
        sql`${hhMembersTable.clerkUserId} IS NULL`,
      ),
    )
    .limit(1);

  if (byEmail[0]) {
    // Backfill clerkUserId and sync name fields from the authoritative Clerk record
    const [updated] = await db
      .update(hhMembersTable)
      .set({
        clerkUserId: bkUser.clerkUserId,
        firstName: bkUser.firstName ?? byEmail[0].firstName,
        lastName: bkUser.lastName ?? byEmail[0].lastName,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(hhMembersTable.id, byEmail[0].id),
          sql`${hhMembersTable.clerkUserId} IS NULL`,
        ),
      )
      .returning();

    const resolvedMember = updated ?? byEmail[0];

    // ── Deferred referral bonus award ──────────────────────────────────────
    // If this member was created via a referral link (referredByMemberId set)
    // and no hh_referrals record exists yet, award the bonus now — the first
    // authenticated sign-in is the verifiable completion event. This prevents
    // bonus farming via unauthenticated form submissions.
    if (resolvedMember?.referredByMemberId) {
      const [existingReferral] = await db
        .select({ id: hhReferralsTable.id })
        .from(hhReferralsTable)
        .where(eq(hhReferralsTable.referredMemberId, resolvedMember.id))
        .limit(1);

      if (!existingReferral) {
        const REFERRAL_BONUS = "5";
        try {
          await db.insert(hhReferralsTable).values({
            bandId: resolvedMember.bandId,
            referrerId: resolvedMember.referredByMemberId,
            referredMemberId: resolvedMember.id,
            referrerBonusAmount: REFERRAL_BONUS,
            referredBonusAmount: REFERRAL_BONUS,
            currency: "token",
          });
          // Reveal both wallets — for the referrer this may be their first
          // real value event too.
          await Promise.all([
            maybeRevealWallet(resolvedMember.id),
            maybeRevealWallet(resolvedMember.referredByMemberId),
          ]);
        } catch (err) {
          // unique_violation (23505) means a concurrent session awarded it —
          // swallow it. Any other error propagates.
          const pgCode = (err as { code?: string })?.code;
          if (pgCode !== "23505") throw err;
        }
      }
    }

    if (updated) return { member: updated, band, bkUser };
    // Tiny race: another request won the update — reload by clerkUserId
    const raceWinner = await db
      .select()
      .from(hhMembersTable)
      .where(
        and(
          eq(hhMembersTable.clerkUserId, bkUser.clerkUserId),
          eq(hhMembersTable.bandId, band.id),
        ),
      )
      .limit(1);
    if (raceWinner[0]) return { member: raceWinner[0], band, bkUser };
  }

  // ── No prior record — create a fresh member ──
  const inserted = await db
    .insert(hhMembersTable)
    .values({
      bandId: band.id,
      clerkUserId: bkUser.clerkUserId,
      email: normalizedEmail,
      firstName: bkUser.firstName ?? normalizedEmail.split("@")[0],
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
    xrplEscrowEnabled: band.xrplEscrowEnabled,
  });
});

// ──────────────────────────────────────────────
// GET /helping-hands/band/escrow-wallet
// Returns the escrow hot-wallet address, live XRP balance, a low-balance
// flag, and a QR-code data URL so the admin can fund it via Xaman or any
// XRPL wallet.  Only available when xrplEscrowEnabled=true on the band.
// ──────────────────────────────────────────────
router.get("/band/escrow-wallet", requireAuth(), async (req: Request, res: Response) => {
  const bkUser = req.bookkeeperUser!;
  if (!["owner", "ops_manager"].includes(bkUser.role)) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  const band = await getOrCreateDefaultBand();

  if (!bandUsesXrplEscrow(band)) {
    res.status(404).json({ error: "XRPL escrow is not enabled for this band" });
    return;
  }

  try {
    const info = await getWalletBalance();
    res.json(info);
  } catch (err) {
    logger.error({ err }, "helpingHands/band/escrow-wallet: getWalletBalance failed");
    res.status(502).json({ error: "Could not fetch wallet balance from XRPL network" });
  }
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

  // escrowSequence and escrowTxHash are set at claim time (when the worker is
  // known), not at post time. XRPL escrow Destination must be the recipient
  // (the eventual claimer), which is unknown here.

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
  const claimed = await db
    .update(hhTasksTable)
    .set({ status: "claimed", claimedByMemberId: ctx.member.id, claimedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(hhTasksTable.id, taskId), eq(hhTasksTable.status, "available")))
    .returning();

  if (!claimed[0]) {
    res.status(409).json({ error: "Task was claimed by someone else — refresh and try again" });
    return;
  }

  const claimedTask = claimed[0];

  // ── XRPL EscrowCreate (testnet) ───────────────────────────────────────────
  // Now that we know the worker (this member), create the on-chain escrow with
  // the worker's XRPL address as the Destination so EscrowFinish at confirm
  // releases funds directly to them.
  //
  // Conditions for real escrow:
  //   • band.xrplEscrowEnabled = true AND XRPL_ESCROW_SEED is set
  //   • payCurrency = "xrp" (XRPL native escrow supports XRP only)
  //   • worker has an xrplAddress (required as Destination)
  //
  // On failure: log, mark the task row escrow_simulated=true so admins can
  // filter it, and surface xrplWarning in the response so callers are never
  // silently left thinking they have on-chain escrow when they do not.
  let xrplWarning: string | null = null;

  if (
    bandUsesXrplEscrow(ctx.band) &&
    claimedTask.payCurrency === "xrp" &&
    ctx.member.xrplAddress
  ) {
    try {
      const escrowResult = await submitEscrowCreate({
        destinationAddress: ctx.member.xrplAddress,
        payAmountXrp: claimedTask.payAmount,
        taskAvailableDate: claimedTask.availableDate,
      });
      // Backfill escrow metadata onto the task row
      await db
        .update(hhTasksTable)
        .set({
          escrowSequence: escrowResult.sequence,
          escrowTxHash: escrowResult.txHash,
          updatedAt: new Date(),
        })
        .where(eq(hhTasksTable.id, taskId));
      logger.info(
        { taskId, escrowSequence: escrowResult.sequence, escrowTxHash: escrowResult.txHash, bandId: ctx.band.id },
        "helpingHands/claim: EscrowCreate succeeded",
      );
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      xrplWarning =
        `EscrowCreate failed (${errMsg}). This task has fallen back to DB simulation — ` +
        `the escrow wallet may need to be topped up with XRP. Payment will still be recorded ` +
        `in the database but will not be settled on-chain until the escrow wallet is funded ` +
        `and the task is re-escrowed.`;
      logger.error(
        { err, taskId, bandId: ctx.band.id },
        "helpingHands/claim: EscrowCreate failed — task marked escrow_simulated=true, confirm will simulate",
      );
      // Mark the task row so admins can filter tasks that are simulated despite
      // the band being in escrow mode (e.g. for dashboard alerts or re-escrow tooling).
      await db
        .update(hhTasksTable)
        .set({ escrowSimulated: true, updatedAt: new Date() })
        .where(eq(hhTasksTable.id, taskId));
    }
  }

  // Re-fetch so the response always reflects the latest escrow fields
  const final = await db.select().from(hhTasksTable).where(eq(hhTasksTable.id, taskId)).limit(1);
  const serialized = await enrichTasksWithNames(final);
  const responseBody = xrplWarning
    ? { ...serialized[0], xrplWarning }
    : serialized[0];
  res.json(responseBody);
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

  // ── XRPL EscrowFinish or DB simulation ───────────────────────────────────
  // Submit EscrowFinish on-chain when:
  //   • band has xrplEscrowEnabled + XRPL_ESCROW_SEED set
  //   • task was created with a real escrow (escrowTxHash is not a SIM_ prefix)
  //   • payCurrency is "xrp"
  // Falls back to mock hash for token tasks or simulation-mode tasks.
  const taskForEscrow = existing[0];
  const isRealEscrow =
    bandUsesXrplEscrow(band) &&
    taskForEscrow.payCurrency === "xrp" &&
    !!taskForEscrow.escrowSequence &&
    !!taskForEscrow.escrowTxHash &&
    !taskForEscrow.escrowTxHash.startsWith("SIM_");

  let settleTxHash: string;
  if (isRealEscrow) {
    try {
      const ownerAddr = escrowWalletAddress();
      const finishResult = await submitEscrowFinish({
        ownerAddress: ownerAddr,
        escrowSequence: taskForEscrow.escrowSequence!,
      });
      settleTxHash = finishResult.txHash;
      logger.info(
        { txHash: settleTxHash, taskId, bandId: band.id },
        "helpingHands/confirm: EscrowFinish succeeded",
      );
    } catch (err) {
      logger.error({ err, taskId }, "helpingHands/confirm: EscrowFinish failed — using simulation hash");
      settleTxHash = `SIM_ERR_${Date.now().toString(16).toUpperCase()}`;
    }
  } else {
    settleTxHash = `SIM_${Date.now().toString(16).toUpperCase()}`;
  }

  // Atomic conditional transition: only update if current status is "completed".
  // This prevents duplicate earnings from concurrent confirm requests — only one
  // request can win the status transition from completed → confirmed.
  // NOTE: escrowTxHash is intentionally NOT updated here — it holds the
  // EscrowCreate hash written at claim time and must not be overwritten.
  // The EscrowFinish hash is written only to hh_earnings.xrpl_tx_hash below.
  const updated = await db
    .update(hhTasksTable)
    .set({ status: "confirmed", confirmedAt: new Date(), updatedAt: new Date() })
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
    xrplTxHash: settleTxHash,
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

  // ── XRPL EscrowCancel (best-effort) ─────────────────────────────────────
  // Cancel the on-chain escrow if this band uses real XRPL and the task had
  // a real escrow sequence. EscrowCancel can only succeed after CancelAfter
  // has passed on the ledger. If it's too early, we log a warning and skip —
  // the cancel can be retried manually once CancelAfter passes.
  if (
    bandUsesXrplEscrow(band) &&
    task.payCurrency === "xrp" &&
    task.escrowSequence &&
    task.escrowTxHash &&
    !task.escrowTxHash.startsWith("SIM_")
  ) {
    try {
      const ownerAddr = escrowWalletAddress();
      await submitEscrowCancel({ ownerAddress: ownerAddr, escrowSequence: task.escrowSequence });
      logger.info({ taskId, escrowSequence: task.escrowSequence }, "helpingHands/expire: EscrowCancel succeeded");
    } catch (err) {
      logger.warn(
        { err, taskId, escrowSequence: task.escrowSequence },
        "helpingHands/expire: EscrowCancel skipped (CancelAfter may not have passed yet)",
      );
    }
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
// POST /helping-hands/tasks/:id/release
// Admin: release a claimed task back to "available" without requiring the
// date to have passed.  Increments the claimer's noShowCount (reliability
// hit) but does NOT flag them for demotion — no-show is distinct from a
// full missed shift.
// ──────────────────────────────────────────────
router.post("/tasks/:id/release", requireAuth(), async (req: Request, res: Response) => {
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
    res.status(409).json({ error: `Task is '${task.status}', not 'claimed' — nothing to release` });
    return;
  }

  // Atomically return task to available, clearing claim fields
  const updated = await db
    .update(hhTasksTable)
    .set({
      status: "available",
      claimedByMemberId: null,
      claimedAt: null,
      updatedAt: new Date(),
    })
    .where(and(eq(hhTasksTable.id, taskId), eq(hhTasksTable.status, "claimed")))
    .returning();

  if (!updated[0]) {
    res.status(409).json({ error: "Task state changed concurrently — retry" });
    return;
  }

  // ── XRPL EscrowCancel (best-effort) ─────────────────────────────────────
  // For early release (same-day no-show), CancelAfter likely hasn't passed on
  // the ledger so EscrowCancel may fail — we log the warning and continue.
  if (
    bandUsesXrplEscrow(band) &&
    task.payCurrency === "xrp" &&
    task.escrowSequence &&
    task.escrowTxHash &&
    !task.escrowTxHash.startsWith("SIM_")
  ) {
    try {
      const ownerAddr = escrowWalletAddress();
      await submitEscrowCancel({ ownerAddress: ownerAddr, escrowSequence: task.escrowSequence });
      logger.info({ taskId, escrowSequence: task.escrowSequence }, "helpingHands/release: EscrowCancel succeeded");
    } catch (err) {
      logger.warn(
        { err, taskId, escrowSequence: task.escrowSequence },
        "helpingHands/release: EscrowCancel skipped (CancelAfter may not have passed yet — retry after expiry window)",
      );
    }
  }

  // Increment no-show count on the former claimer (all tiers, not just full_time)
  if (task.claimedByMemberId) {
    await db
      .update(hhMembersTable)
      .set({
        noShowCount: sql`${hhMembersTable.noShowCount} + 1`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(hhMembersTable.id, task.claimedByMemberId),
          eq(hhMembersTable.bandId, band.id),
        ),
      );
  }

  const serialized = await enrichTasksWithNames(updated);
  res.json(serialized[0]);
});

// ──────────────────────────────────────────────
// POST /helping-hands/tasks/:id/repost
// Admin: reopen a "missed" task back to "available" so it can be claimed
// again.  Clears the claim fields; the original task record is reused
// (no duplicate created).
// ──────────────────────────────────────────────
router.post("/tasks/:id/repost", requireAuth(), async (req: Request, res: Response) => {
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

  if (existing[0].status !== "missed") {
    res.status(409).json({ error: `Task is '${existing[0].status}', not 'missed' — cannot repost` });
    return;
  }

  const updated = await db
    .update(hhTasksTable)
    .set({
      status: "available",
      claimedByMemberId: null,
      claimedAt: null,
      completedAt: null,
      updatedAt: new Date(),
    })
    .where(and(eq(hhTasksTable.id, taskId), eq(hhTasksTable.status, "missed")))
    .returning();

  if (!updated[0]) {
    res.status(409).json({ error: "Task state changed concurrently — retry" });
    return;
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

  // ── XRPL EscrowCancel (best-effort, batch) ───────────────────────────────
  // For each transitioned task that has a real on-chain escrow, attempt
  // EscrowCancel. Errors are logged as warnings and do not abort the loop —
  // CancelAfter may not have passed yet for recently expired tasks; those
  // can be retried after the window opens.
  if (bandUsesXrplEscrow(band)) {
    const ownerAddr = escrowWalletAddress();
    for (const task of transitioned) {
      if (
        task.payCurrency === "xrp" &&
        task.escrowSequence &&
        task.escrowTxHash &&
        !task.escrowTxHash.startsWith("SIM_")
      ) {
        try {
          await submitEscrowCancel({ ownerAddress: ownerAddr, escrowSequence: task.escrowSequence });
          logger.info(
            { taskId: task.id, escrowSequence: task.escrowSequence },
            "runExpireOverdue: EscrowCancel succeeded",
          );
        } catch (err) {
          logger.warn(
            { err, taskId: task.id, escrowSequence: task.escrowSequence },
            "runExpireOverdue: EscrowCancel skipped (CancelAfter may not have passed yet)",
          );
        }
      }
    }
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

  // Fetch escrow wallet balance concurrently with DB queries when enabled.
  // Errors are caught and suppressed so a network hiccup doesn't break the
  // whole dashboard — the warning simply won't appear.
  const escrowBalancePromise = bandUsesXrplEscrow(band)
    ? getWalletBalance().catch((err) => {
        logger.warn({ err }, "helpingHands/dashboard: escrow balance check failed");
        return null;
      })
    : Promise.resolve(null);

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

  const [recentSerialized, escrowWallet] = await Promise.all([
    enrichTasksWithNames(recent),
    escrowBalancePromise,
  ]);

  // Build the escrow alert object only when xrplEscrowEnabled and balance data
  // is available.  null means either the feature is off or the check failed.
  const escrowAlert =
    escrowWallet && escrowWallet.isLowBalance
      ? {
          address: escrowWallet.address,
          balanceXrp: escrowWallet.balanceXrp,
          lowBalanceThresholdXrp: escrowWallet.lowBalanceThresholdXrp,
          message: `Escrow wallet balance (${escrowWallet.balanceXrp} XRP) is below the ${escrowWallet.lowBalanceThresholdXrp} XRP threshold. Top up the wallet to continue issuing on-chain escrows.`,
        }
      : null;

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
    escrowWallet: escrowWallet
      ? {
          address: escrowWallet.address,
          balanceXrp: escrowWallet.balanceXrp,
          lowBalanceThresholdXrp: escrowWallet.lowBalanceThresholdXrp,
          isLowBalance: escrowWallet.isLowBalance,
        }
      : null,
    escrowAlert,
  });
});

// ══════════════════════════════════════════════════════════════
// MERCHANTS
// ══════════════════════════════════════════════════════════════

function serializeMerchant(row: typeof hhMerchantsTable.$inferSelect) {
  return {
    id: row.id,
    bandId: row.bandId,
    name: row.name,
    description: row.description,
    category: row.category,
    merchantWallet: row.merchantWallet,
    isActive: row.isActive,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
  };
}

// ──────────────────────────────────────────────
// GET /helping-hands/merchants
// ?includeInactive=true — admin only; returns all merchants including inactive
// Default (no flag) returns active merchants only — suitable for member spend flows
// ──────────────────────────────────────────────
router.get("/merchants", requireAuth(), async (req: Request, res: Response) => {
  const band = await getOrCreateDefaultBand();
  const includeInactive = req.query.includeInactive === "true";
  const bkUser = req.bookkeeperUser!;
  const isAdmin = ["owner", "ops_manager"].includes(bkUser.role);

  // Only admins can request inactive merchants
  const showAll = includeInactive && isAdmin;

  const conditions = showAll
    ? [eq(hhMerchantsTable.bandId, band.id)]
    : [eq(hhMerchantsTable.bandId, band.id), eq(hhMerchantsTable.isActive, true)];

  const rows = await db
    .select()
    .from(hhMerchantsTable)
    .where(and(...conditions))
    .orderBy(hhMerchantsTable.name);
  res.json(rows.map(serializeMerchant));
});

// ──────────────────────────────────────────────
// POST /helping-hands/merchants  (admin)
// ──────────────────────────────────────────────
const CreateMerchantSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(""),
  category: z.enum(["grocery", "fuel", "pharmacy", "school", "general"]).optional().default("general"),
  merchantWallet: z.string().min(1),
});

router.post("/merchants", requireAuth(), async (req: Request, res: Response) => {
  const bkUser = req.bookkeeperUser!;
  if (!["owner", "ops_manager"].includes(bkUser.role)) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  const parsed = CreateMerchantSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const band = await getOrCreateDefaultBand();
  const inserted = await db
    .insert(hhMerchantsTable)
    .values({ bandId: band.id, ...parsed.data })
    .returning();
  res.status(201).json(serializeMerchant(inserted[0]));
});

// ──────────────────────────────────────────────
// PATCH /helping-hands/merchants/:id  (admin)
// ──────────────────────────────────────────────
const UpdateMerchantSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.enum(["grocery", "fuel", "pharmacy", "school", "general"]).optional(),
  merchantWallet: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

router.patch("/merchants/:id", requireAuth(), async (req: Request, res: Response) => {
  const bkUser = req.bookkeeperUser!;
  if (!["owner", "ops_manager"].includes(bkUser.role)) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  const parsed = UpdateMerchantSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid" });
    return;
  }

  const merchantId = param(req.params.id);
  const band = await getOrCreateDefaultBand();
  const updated = await db
    .update(hhMerchantsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(and(eq(hhMerchantsTable.id, merchantId), eq(hhMerchantsTable.bandId, band.id)))
    .returning();

  if (!updated[0]) {
    res.status(404).json({ error: "Merchant not found" });
    return;
  }
  res.json(serializeMerchant(updated[0]));
});

// ══════════════════════════════════════════════════════════════
// ENVELOPES
// ══════════════════════════════════════════════════════════════

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function serializeEnvelope(row: typeof hhEnvelopesTable.$inferSelect) {
  return {
    id: row.id,
    memberId: row.memberId,
    bandId: row.bandId,
    label: row.label,
    icon: row.icon,
    currency: row.currency,
    monthlyBudget: row.monthlyBudget ?? "0",
    spentThisMonth: row.spentMonth === currentMonth() ? (row.spentThisMonth ?? "0") : "0",
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
  };
}

// ──────────────────────────────────────────────
// GET /helping-hands/my/envelopes
// ──────────────────────────────────────────────
router.get("/my/envelopes", requireAuth(), async (req: Request, res: Response) => {
  const ctx = await loadHhMember(req);
  if (!ctx) { res.status(401).json({ error: "Unauthorized" }); return; }

  const rows = await db
    .select()
    .from(hhEnvelopesTable)
    .where(and(eq(hhEnvelopesTable.memberId, ctx.member.id), eq(hhEnvelopesTable.bandId, ctx.band.id)))
    .orderBy(hhEnvelopesTable.label);

  res.json(rows.map(serializeEnvelope));
});

// ──────────────────────────────────────────────
// POST /helping-hands/my/envelopes
// ──────────────────────────────────────────────
const decimalString = z
  .string()
  .min(1)
  .refine((v) => /^\d+(\.\d+)?$/.test(v.trim()) && parseFloat(v) >= 0, {
    message: "Must be a non-negative number",
  });

const positiveDecimalString = decimalString.refine((v) => parseFloat(v) > 0, {
  message: "Must be a positive number greater than zero",
});

const CreateEnvelopeSchema = z.object({
  label: z.string().min(1),
  icon: z.string().optional().default("wallet"),
  currency: z.enum(["token", "xrp"]).optional().default("token"),
  monthlyBudget: decimalString,
});

router.post("/my/envelopes", requireAuth(), async (req: Request, res: Response) => {
  const ctx = await loadHhMember(req);
  if (!ctx) { res.status(401).json({ error: "Unauthorized" }); return; }

  const parsed = CreateEnvelopeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid" });
    return;
  }

  const inserted = await db
    .insert(hhEnvelopesTable)
    .values({
      memberId: ctx.member.id,
      bandId: ctx.band.id,
      label: parsed.data.label,
      icon: parsed.data.icon,
      currency: parsed.data.currency,
      monthlyBudget: parsed.data.monthlyBudget,
      spentMonth: currentMonth(),
    })
    .returning();

  res.status(201).json(serializeEnvelope(inserted[0]));
});

// ──────────────────────────────────────────────
// PATCH /helping-hands/my/envelopes/:id
// ──────────────────────────────────────────────
const UpdateEnvelopeSchema = z.object({
  label: z.string().min(1).optional(),
  icon: z.string().optional(),
  monthlyBudget: z.string().optional(),
});

router.patch("/my/envelopes/:id", requireAuth(), async (req: Request, res: Response) => {
  const ctx = await loadHhMember(req);
  if (!ctx) { res.status(401).json({ error: "Unauthorized" }); return; }

  const parsed = UpdateEnvelopeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid" });
    return;
  }

  const envelopeId = param(req.params.id);
  const updated = await db
    .update(hhEnvelopesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(
      and(
        eq(hhEnvelopesTable.id, envelopeId),
        eq(hhEnvelopesTable.memberId, ctx.member.id),
      ),
    )
    .returning();

  if (!updated[0]) { res.status(404).json({ error: "Envelope not found" }); return; }
  res.json(serializeEnvelope(updated[0]));
});

// ──────────────────────────────────────────────
// DELETE /helping-hands/my/envelopes/:id
// ──────────────────────────────────────────────
router.delete("/my/envelopes/:id", requireAuth(), async (req: Request, res: Response) => {
  const ctx = await loadHhMember(req);
  if (!ctx) { res.status(401).json({ error: "Unauthorized" }); return; }

  const envelopeId = param(req.params.id);
  const deleted = await db
    .delete(hhEnvelopesTable)
    .where(
      and(
        eq(hhEnvelopesTable.id, envelopeId),
        eq(hhEnvelopesTable.memberId, ctx.member.id),
      ),
    )
    .returning();

  if (!deleted[0]) { res.status(404).json({ error: "Envelope not found" }); return; }
  res.json({ ok: true });
});

// ──────────────────────────────────────────────
// POST /helping-hands/my/envelopes/:id/spend
// Simulates an XRPL payment from the member's wallet to a merchant wallet.
// ──────────────────────────────────────────────
const SpendSchema = z.object({
  merchantId: z.string().uuid(),
  amount: positiveDecimalString,
  note: z.string().optional().default(""),
});

router.post("/my/envelopes/:id/spend", requireAuth(), async (req: Request, res: Response) => {
  const ctx = await loadHhMember(req);
  if (!ctx) { res.status(401).json({ error: "Unauthorized" }); return; }

  const parsed = SpendSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid" });
    return;
  }

  const envelopeId = param(req.params.id);
  const spendAmt = parseFloat(parsed.data.amount);

  // Verify merchant exists and is active before entering the transaction
  const [merchant] = await db
    .select()
    .from(hhMerchantsTable)
    .where(
      and(
        eq(hhMerchantsTable.id, parsed.data.merchantId),
        eq(hhMerchantsTable.bandId, ctx.band.id),
        eq(hhMerchantsTable.isActive, true),
      ),
    )
    .limit(1);

  if (!merchant) { res.status(404).json({ error: "Merchant not found" }); return; }

  // ── Atomic spend block ──
  // Re-fetch the envelope with FOR UPDATE inside a transaction to prevent
  // concurrent overdrafts. All checks and writes happen within the same tx.
  type SpendResult =
    | { ok: true; txn: typeof hhEnvelopeTransactionsTable.$inferSelect }
    | { ok: false; status: number; error: string };

  const result = await db.transaction(async (tx): Promise<SpendResult> => {
    const [envelope] = await tx
      .select()
      .from(hhEnvelopesTable)
      .where(
        and(
          eq(hhEnvelopesTable.id, envelopeId),
          eq(hhEnvelopesTable.memberId, ctx.member.id),
        ),
      )
      .for("update")
      .limit(1);

    if (!envelope) return { ok: false, status: 404, error: "Envelope not found" };

    const month = currentMonth();
    const prevSpent = envelope.spentMonth === month ? parseFloat(envelope.spentThisMonth ?? "0") : 0;

    // ── Earned-balance check ──
    const currency = envelope.currency;
    const totalEarned =
      currency === "xrp"
        ? parseFloat(ctx.member.totalEarnedXrp ?? "0")
        : parseFloat(ctx.member.totalEarnedToken ?? "0");

    const [spentAggregate] = await tx
      .select({ total: sql<string>`coalesce(sum(${hhEnvelopeTransactionsTable.amount}), '0')` })
      .from(hhEnvelopeTransactionsTable)
      .where(
        and(
          eq(hhEnvelopeTransactionsTable.memberId, ctx.member.id),
          eq(hhEnvelopeTransactionsTable.currency, currency),
        ),
      );

    const totalAlreadySpent = parseFloat(spentAggregate?.total ?? "0");
    const available = totalEarned - totalAlreadySpent;

    if (spendAmt > available) {
      return {
        ok: false,
        status: 409,
        error: `Insufficient balance. You have ${available.toFixed(currency === "xrp" ? 6 : 2)} ${currency === "xrp" ? "XRP" : "tokens"} available to spend.`,
      };
    }

    const budget = parseFloat(envelope.monthlyBudget ?? "0");
    if (budget > 0 && prevSpent + spendAmt > budget * 1.2) {
      return { ok: false, status: 409, error: "Spend would exceed 120 % of this envelope's monthly budget" };
    }

    await tx
      .update(hhEnvelopesTable)
      .set({
        spentThisMonth: String((prevSpent + spendAmt).toFixed(6)),
        spentMonth: month,
        updatedAt: new Date(),
      })
      .where(eq(hhEnvelopesTable.id, envelopeId));

    // V1: XRPL payment is simulated
    const mockTxHash = `SIM_SPEND_${Date.now().toString(16).toUpperCase()}`;

    const [txnRow] = await tx
      .insert(hhEnvelopeTransactionsTable)
      .values({
        envelopeId: envelope.id,
        memberId: ctx.member.id,
        merchantId: merchant.id,
        bandId: ctx.band.id,
        amount: parsed.data.amount,
        currency,
        note: parsed.data.note,
        xrplTxHash: mockTxHash,
      })
      .returning();

    return { ok: true, txn: txnRow };
  });

  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  const { txn } = result;
  res.status(201).json({
    id: txn.id,
    envelopeId: txn.envelopeId,
    merchantId: txn.merchantId,
    merchantName: merchant.name,
    merchantWallet: merchant.merchantWallet,
    amount: txn.amount,
    currency: txn.currency,
    note: txn.note,
    xrplTxHash: txn.xrplTxHash,
    spentAt: txn.spentAt instanceof Date ? txn.spentAt.toISOString() : String(txn.spentAt),
  });
});

// ──────────────────────────────────────────────
// GET /helping-hands/my/envelopes/:id/transactions
// ──────────────────────────────────────────────
router.get("/my/envelopes/:id/transactions", requireAuth(), async (req: Request, res: Response) => {
  const ctx = await loadHhMember(req);
  if (!ctx) { res.status(401).json({ error: "Unauthorized" }); return; }

  const envelopeId = param(req.params.id);

  const [envelope] = await db
    .select()
    .from(hhEnvelopesTable)
    .where(
      and(
        eq(hhEnvelopesTable.id, envelopeId),
        eq(hhEnvelopesTable.memberId, ctx.member.id),
      ),
    )
    .limit(1);

  if (!envelope) { res.status(404).json({ error: "Envelope not found" }); return; }

  const rows = await db
    .select({
      txn: hhEnvelopeTransactionsTable,
      merchantName: hhMerchantsTable.name,
    })
    .from(hhEnvelopeTransactionsTable)
    .leftJoin(hhMerchantsTable, eq(hhEnvelopeTransactionsTable.merchantId, hhMerchantsTable.id))
    .where(eq(hhEnvelopeTransactionsTable.envelopeId, envelopeId))
    .orderBy(desc(hhEnvelopeTransactionsTable.spentAt))
    .limit(50);

  res.json(
    rows.map((r) => ({
      id: r.txn.id,
      envelopeId: r.txn.envelopeId,
      merchantId: r.txn.merchantId,
      merchantName: r.merchantName ?? "Unknown",
      amount: r.txn.amount ?? "0",
      currency: r.txn.currency,
      note: r.txn.note,
      xrplTxHash: r.txn.xrplTxHash ?? null,
      spentAt: r.txn.spentAt instanceof Date ? r.txn.spentAt.toISOString() : String(r.txn.spentAt),
    })),
  );
});

// ──────────────────────────────────────────────
// GET /helping-hands/my/health
// Returns a simple financial health score (0–100) based on savings rate
// and envelope discipline. No jargon — just three plain signals.
// ──────────────────────────────────────────────
router.get("/my/health", requireAuth(), async (req: Request, res: Response) => {
  const ctx = await loadHhMember(req);
  if (!ctx) { res.status(401).json({ error: "Unauthorized" }); return; }

  const month = currentMonth();

  const envelopes = await db
    .select()
    .from(hhEnvelopesTable)
    .where(
      and(
        eq(hhEnvelopesTable.memberId, ctx.member.id),
        eq(hhEnvelopesTable.bandId, ctx.band.id),
      ),
    );

  const totalBudget = envelopes.reduce((s, e) => s + parseFloat(e.monthlyBudget ?? "0"), 0);
  const totalSpent = envelopes.reduce(
    (s, e) => s + (e.spentMonth === month ? parseFloat(e.spentThisMonth ?? "0") : 0),
    0,
  );

  const savingsEnv = envelopes.find((e) => e.label.toLowerCase().includes("saving"));
  const savingsBudget = savingsEnv ? parseFloat(savingsEnv.monthlyBudget ?? "0") : 0;
  const savingsRate = totalBudget > 0 ? savingsBudget / totalBudget : 0;

  // Envelope discipline: what fraction of envelopes are on or under budget
  const month_envelopes = envelopes.filter((e) => e.spentMonth === month && parseFloat(e.monthlyBudget ?? "0") > 0);
  const onBudget = month_envelopes.filter(
    (e) => parseFloat(e.spentThisMonth ?? "0") <= parseFloat(e.monthlyBudget ?? "0"),
  ).length;
  const discipline = month_envelopes.length > 0 ? onBudget / month_envelopes.length : 1;

  // Has at least one savings envelope
  const hasSavings = envelopes.some((e) => e.label.toLowerCase().includes("saving"));

  // Score: savings rate (40 pts max, target 10%) + discipline (40 pts) + has savings envelope (20 pts)
  const savingsScore = Math.min(savingsRate / 0.1, 1) * 40;
  const disciplineScore = discipline * 40;
  const savingsBonus = hasSavings ? 20 : 0;
  const score = Math.round(savingsScore + disciplineScore + savingsBonus);

  let tier: string;
  let message: string;
  if (score >= 80) { tier = "strong"; message = "Your household budget is looking healthy. Keep it up."; }
  else if (score >= 55) { tier = "steady"; message = "You're on a good track. A small savings envelope could push things further."; }
  else if (score >= 30) { tier = "building"; message = "A few envelopes are running over — try trimming one category to free up room."; }
  else { tier = "early"; message = "Set a monthly budget in each envelope and you'll see this score climb fast."; }

  res.json({
    score,
    tier,
    message,
    envelopeCount: envelopes.length,
    totalBudget: totalBudget.toFixed(2),
    totalSpent: totalSpent.toFixed(2),
    savingsRate: (savingsRate * 100).toFixed(1),
    discipline: (discipline * 100).toFixed(0),
  });
});

// ══════════════════════════════════════════════════════════════
// P2P COMMUNITY ECONOMY ENGINE
// ══════════════════════════════════════════════════════════════

// ── Shared helpers ─────────────────────────────────────────────────────────

/**
 * Generate a short, human-friendly referral code from a member's UUID and
 * an optional salt (used for collision-retry).
 * Output looks like: "hw-3e7a-f2c1-4b8d"
 */
function generateReferralCode(memberId: string, salt = 0): string {
  // Deterministic from UUID but unique per member; salt shifts the window on
  // retry so a collision on the base code produces a different candidate code.
  const hex = memberId.replace(/-/g, "");
  const offset = (salt * 4) % (hex.length - 12);
  const seg = hex.slice(offset, offset + 12);
  const parts = seg.match(/.{1,4}/g) ?? [seg];
  return `hw-${parts.slice(0, 3).join("-")}`;
}

/**
 * Ensure a member has a referral code — assign one if missing.
 * Retries with a different candidate code on unique-constraint collision
 * instead of silently falling back to a non-persisted value.
 */
async function ensureReferralCode(
  memberId: string,
  bandId: string,
): Promise<string> {
  const existing = await db
    .select({ referralCode: hhMembersTable.referralCode })
    .from(hhMembersTable)
    .where(eq(hhMembersTable.id, memberId))
    .limit(1);

  if (existing[0]?.referralCode) return existing[0].referralCode;

  const MAX_RETRIES = 5;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const code = generateReferralCode(memberId, attempt);
    try {
      await db
        .update(hhMembersTable)
        .set({ referralCode: code, updatedAt: new Date() })
        .where(
          and(
            eq(hhMembersTable.id, memberId),
            eq(hhMembersTable.bandId, bandId),
            sql`${hhMembersTable.referralCode} IS NULL`,
          ),
        );
      // If no rows were updated, either someone else set the code concurrently
      // or the member record is missing — the refreshed read below covers both.
      break;
    } catch (err) {
      const pgCode = (err as { code?: string })?.code;
      if (pgCode !== "23505") throw err;
      // unique_violation on referral_code — try the next salt value
      if (attempt === MAX_RETRIES - 1) {
        // All candidates exhausted — fall through to the refreshed read.
        // This is astronomically unlikely but must not cause a hang.
      }
    }
  }

  const refreshed = await db
    .select({ referralCode: hhMembersTable.referralCode })
    .from(hhMembersTable)
    .where(eq(hhMembersTable.id, memberId))
    .limit(1);

  const persistedCode = refreshed[0]?.referralCode;
  if (!persistedCode) {
    // Edge case: all salts collided with existing codes belonging to other
    // members. Fall back to a timestamp-suffixed code that is guaranteed novel.
    const fallback = `hw-${memberId.slice(0, 4)}-${Date.now().toString(36).slice(-6)}`;
    await db
      .update(hhMembersTable)
      .set({ referralCode: fallback, updatedAt: new Date() })
      .where(
        and(
          eq(hhMembersTable.id, memberId),
          sql`${hhMembersTable.referralCode} IS NULL`,
        ),
      );
    return fallback;
  }
  return persistedCode;
}

/** Mark wallet as revealed if not already. */
async function maybeRevealWallet(memberId: string): Promise<void> {
  await db
    .update(hhMembersTable)
    .set({ walletRevealedAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(hhMembersTable.id, memberId),
        sql`${hhMembersTable.walletRevealedAt} IS NULL`,
      ),
    );
}

// ──────────────────────────────────────────────
// GET /helping-hands/my/wallet
// Returns the member's balance, wallet state, and referral link details.
// Creates the referral code on first call.
// ──────────────────────────────────────────────
router.get("/my/wallet", requireAuth(), async (req: Request, res: Response) => {
  const ctx = await loadHhMember(req);
  if (!ctx) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { member, band } = ctx;

  const referralCode = await ensureReferralCode(member.id, band.id);

  // Count how many people joined via this member's referral
  const [referralRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(hhReferralsTable)
    .where(
      and(
        eq(hhReferralsTable.referrerId, member.id),
        eq(hhReferralsTable.bandId, band.id),
      ),
    );

  // Compute actual spendable balance:
  // earned (tasks + bonuses + referral bonuses + tips received)
  // minus spent (envelope transactions + tips sent)

  const [tipReceivedAgg] = await db
    .select({ total: sql<string>`coalesce(sum(${hhTipsTable.amount}), '0')` })
    .from(hhTipsTable)
    .where(
      and(
        eq(hhTipsTable.toMemberId, member.id),
        eq(hhTipsTable.bandId, band.id),
        eq(hhTipsTable.currency, "token"),
      ),
    );

  const [tipSentAgg] = await db
    .select({ total: sql<string>`coalesce(sum(${hhTipsTable.amount}), '0')` })
    .from(hhTipsTable)
    .where(
      and(
        eq(hhTipsTable.fromMemberId, member.id),
        eq(hhTipsTable.bandId, band.id),
        eq(hhTipsTable.currency, "token"),
      ),
    );

  const [spentAgg] = await db
    .select({ total: sql<string>`coalesce(sum(${hhEnvelopeTransactionsTable.amount}), '0')` })
    .from(hhEnvelopeTransactionsTable)
    .where(
      and(
        eq(hhEnvelopeTransactionsTable.memberId, member.id),
        eq(hhEnvelopeTransactionsTable.bandId, band.id),
        eq(hhEnvelopeTransactionsTable.currency, "token"),
      ),
    );

  const [referralBonusAgg] = await db
    .select({ total: sql<string>`coalesce(sum(${hhReferralsTable.referredBonusAmount}), '0')` })
    .from(hhReferralsTable)
    .where(
      and(
        eq(hhReferralsTable.referredMemberId, member.id),
        eq(hhReferralsTable.bandId, band.id),
        eq(hhReferralsTable.currency, "token"),
      ),
    );

  const [referralGivenAgg] = await db
    .select({ total: sql<string>`coalesce(sum(${hhReferralsTable.referrerBonusAmount}), '0')` })
    .from(hhReferralsTable)
    .where(
      and(
        eq(hhReferralsTable.referrerId, member.id),
        eq(hhReferralsTable.bandId, band.id),
        eq(hhReferralsTable.currency, "token"),
      ),
    );

  const tokenEarned =
    parseFloat(member.totalEarnedToken ?? "0") +
    parseFloat(tipReceivedAgg?.total ?? "0") +
    parseFloat(referralBonusAgg?.total ?? "0") +
    parseFloat(referralGivenAgg?.total ?? "0");

  const tokenSpent =
    parseFloat(spentAgg?.total ?? "0") +
    parseFloat(tipSentAgg?.total ?? "0");

  const tokenBalance = Math.max(0, tokenEarned - tokenSpent).toFixed(2);

  // ── Progressive reveal: auto-reveal on positive balance ───────────────────
  // If the wallet hasn't been explicitly revealed yet but the member now has
  // a positive balance (from a tip received, earned task credit, or referral
  // bonus), reveal it now so the wallet page can show the "first look" panel.
  // This covers all first-value paths: tip receive, task earn, referral credit —
  // not just tip send (which triggers reveal inline).
  const alreadyRevealed =
    (member as { walletRevealedAt?: Date | null }).walletRevealedAt !== null &&
    (member as { walletRevealedAt?: Date | null }).walletRevealedAt !== undefined;

  if (!alreadyRevealed && parseFloat(tokenBalance) > 0) {
    await maybeRevealWallet(member.id);
  }

  const walletRevealed =
    alreadyRevealed ||
    (!alreadyRevealed && parseFloat(tokenBalance) > 0);

  // walletRevealSeenAt: has the member already dismissed the reveal ceremony?
  const alreadyRevealSeen =
    (member as { walletRevealSeenAt?: Date | null }).walletRevealSeenAt !== null &&
    (member as { walletRevealSeenAt?: Date | null }).walletRevealSeenAt !== undefined;

  // walletRevealPending: wallet has first value BUT member hasn't seen the ceremony yet
  const walletRevealPending = walletRevealed && !alreadyRevealSeen;

  // ── First-value event metadata for the reveal overlay ─────────────────────
  // Determine the earliest value event so the overlay can say exactly what
  // landed and who sent it — task payment, tip received, or referral bonus.
  let firstValueAmount: string | null = null;
  let firstValueCurrency: string | null = null;
  let firstValueSourceType: "task" | "tip" | "referral" | null = null;
  let firstValueSourceName: string | null = null;

  if (walletRevealPending) {
    // Query candidates in parallel
    const [firstEarning, firstTipRow, firstReferralRow] = await Promise.all([
      db
        .select({
          amount: hhEarningsTable.amount,
          currency: hhEarningsTable.currency,
          earnedAt: hhEarningsTable.earnedAt,
          taskId: hhEarningsTable.taskId,
        })
        .from(hhEarningsTable)
        .where(
          and(eq(hhEarningsTable.memberId, member.id), eq(hhEarningsTable.bandId, band.id)),
        )
        .orderBy(hhEarningsTable.earnedAt)
        .limit(1),

      db
        .select({
          amount: hhTipsTable.amount,
          currency: hhTipsTable.currency,
          sentAt: hhTipsTable.sentAt,
          fromMemberId: hhTipsTable.fromMemberId,
        })
        .from(hhTipsTable)
        .where(
          and(eq(hhTipsTable.toMemberId, member.id), eq(hhTipsTable.bandId, band.id)),
        )
        .orderBy(hhTipsTable.sentAt)
        .limit(1),

      db
        .select({
          amount: hhReferralsTable.referredBonusAmount,
          currency: hhReferralsTable.currency,
          awardedAt: hhReferralsTable.awardedAt,
          referrerId: hhReferralsTable.referrerId,
        })
        .from(hhReferralsTable)
        .where(
          and(eq(hhReferralsTable.referredMemberId, member.id), eq(hhReferralsTable.bandId, band.id)),
        )
        .orderBy(hhReferralsTable.awardedAt)
        .limit(1),
    ]);

    // Find the earliest event among the candidates
    const candidates: Array<{
      at: Date;
      amount: string;
      currency: string;
      type: "task" | "tip" | "referral";
      sourceId?: string;
    }> = [];

    if (firstEarning[0]) {
      candidates.push({
        at: firstEarning[0].earnedAt instanceof Date ? firstEarning[0].earnedAt : new Date(firstEarning[0].earnedAt as string),
        amount: firstEarning[0].amount,
        currency: firstEarning[0].currency,
        type: "task",
      });
    }
    if (firstTipRow[0]) {
      candidates.push({
        at: firstTipRow[0].sentAt instanceof Date ? firstTipRow[0].sentAt : new Date(firstTipRow[0].sentAt as string),
        amount: firstTipRow[0].amount,
        currency: firstTipRow[0].currency,
        type: "tip",
        sourceId: firstTipRow[0].fromMemberId,
      });
    }
    if (firstReferralRow[0]) {
      candidates.push({
        at: firstReferralRow[0].awardedAt instanceof Date ? firstReferralRow[0].awardedAt : new Date(firstReferralRow[0].awardedAt as string),
        amount: firstReferralRow[0].amount,
        currency: firstReferralRow[0].currency,
        type: "referral",
        sourceId: firstReferralRow[0].referrerId,
      });
    }

    if (candidates.length > 0) {
      candidates.sort((a, b) => a.at.getTime() - b.at.getTime());
      const earliest = candidates[0];
      firstValueAmount = parseFloat(earliest.amount).toFixed(2);
      firstValueCurrency = earliest.currency;
      firstValueSourceType = earliest.type;

      if (earliest.type === "task") {
        firstValueSourceName = null; // task payment — from the band
      } else if (earliest.type === "referral") {
        // Referral: look up who referred them
        if (earliest.sourceId) {
          const [referrer] = await db
            .select({ firstName: hhMembersTable.firstName, lastName: hhMembersTable.lastName })
            .from(hhMembersTable)
            .where(eq(hhMembersTable.id, earliest.sourceId))
            .limit(1);
          firstValueSourceName = referrer
            ? `${referrer.firstName} ${referrer.lastName}`.trim()
            : null;
        }
      } else if (earliest.type === "tip") {
        // Tip: look up sender name
        if (earliest.sourceId) {
          const [sender] = await db
            .select({ firstName: hhMembersTable.firstName, lastName: hhMembersTable.lastName })
            .from(hhMembersTable)
            .where(eq(hhMembersTable.id, earliest.sourceId))
            .limit(1);
          firstValueSourceName = sender
            ? `${sender.firstName} ${sender.lastName}`.trim()
            : null;
        }
      }
    } else {
      // Positive balance without a traceable event (e.g. direct DB credit) — show balance
      firstValueAmount = tokenBalance;
      firstValueCurrency = "token";
      firstValueSourceType = "referral"; // closest fallback for "welcome bonus" copy
    }
  }

  res.json({
    memberId: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    tokenBalance,
    xrpBalance: member.totalEarnedXrp ?? "0",
    tokenCode: band.communityTokenCode,
    walletType: (member as { walletType?: string }).walletType ?? "custodial",
    walletRevealed,
    walletRevealPending,
    firstValueAmount,
    firstValueCurrency,
    firstValueSourceType,
    firstValueSourceName,
    referralCode,
    referralBonusAmount: "5",
    referralCount: referralRow?.count ?? 0,
  });
});

// ──────────────────────────────────────────────
// POST /helping-hands/my/wallet/reveal-seen
// Called by the frontend when the member dismisses the wallet reveal overlay.
// Sets walletRevealSeenAt so the ceremony never re-fires on any device.
// ──────────────────────────────────────────────
router.post("/my/wallet/reveal-seen", requireAuth(), async (req: Request, res: Response) => {
  const ctx = await loadHhMember(req);
  if (!ctx) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { member } = ctx;

  // Idempotent — if already seen, no-op
  const alreadySeen =
    (member as { walletRevealSeenAt?: Date | null }).walletRevealSeenAt !== null &&
    (member as { walletRevealSeenAt?: Date | null }).walletRevealSeenAt !== undefined;

  if (!alreadySeen) {
    await db
      .update(hhMembersTable)
      .set({ walletRevealSeenAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(hhMembersTable.id, member.id),
          sql`${hhMembersTable.walletRevealSeenAt} IS NULL`,
        ),
      );
  }

  res.json({ ok: true });
});

// ──────────────────────────────────────────────
// GET /helping-hands/members/search?q=
// Returns matching active members for the tip-send recipient picker.
// Excludes the calling member from results.
// ──────────────────────────────────────────────
router.get("/members/search", requireAuth(), async (req: Request, res: Response) => {
  const ctx = await loadHhMember(req);
  if (!ctx) { res.status(401).json({ error: "Unauthorized" }); return; }

  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (q.length < 2) {
    res.json([]);
    return;
  }

  const pattern = `%${q}%`;

  const members = await db
    .select({
      id: hhMembersTable.id,
      firstName: hhMembersTable.firstName,
      lastName: hhMembersTable.lastName,
      email: hhMembersTable.email,
    })
    .from(hhMembersTable)
    .where(
      and(
        eq(hhMembersTable.bandId, ctx.band.id),
        eq(hhMembersTable.isActive, true),
        sql`${hhMembersTable.id} != ${ctx.member.id}`,
        or(
          ilike(hhMembersTable.firstName, pattern),
          ilike(hhMembersTable.lastName, pattern),
          ilike(sql`${hhMembersTable.firstName} || ' ' || ${hhMembersTable.lastName}`, pattern),
        ),
      ),
    )
    .limit(10);

  res.json(members);
});

// ──────────────────────────────────────────────
// POST /helping-hands/tips
// Send a P2P credit tip to another community member for knowledge/help shared.
// The tip function is always-on and first-class — this is the primary P2P
// value exchange vector. Credits land immediately.
// ──────────────────────────────────────────────
const SendTipSchema = z.object({
  toMemberId: z.string().uuid(),
  amount: z
    .string()
    .min(1)
    .refine((v) => /^\d+(\.\d+)?$/.test(v.trim()) && parseFloat(v) > 0, {
      message: "Amount must be a positive number",
    }),
  currency: z.enum(["token", "xrp"]).optional().default("token"),
  note: z.string().max(120).optional().default(""),
});

router.post("/tips", requireAuth(), async (req: Request, res: Response) => {
  const ctx = await loadHhMember(req);
  if (!ctx) { res.status(401).json({ error: "Unauthorized" }); return; }

  const parsed = SendTipSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { toMemberId, amount, currency, note } = parsed.data;

  if (toMemberId === ctx.member.id) {
    res.status(400).json({ error: "You cannot tip yourself." });
    return;
  }

  const sendAmt = parseFloat(amount);

  // Verify recipient exists in the same band
  const [recipient] = await db
    .select({ id: hhMembersTable.id, firstName: hhMembersTable.firstName, lastName: hhMembersTable.lastName })
    .from(hhMembersTable)
    .where(
      and(
        eq(hhMembersTable.id, toMemberId),
        eq(hhMembersTable.bandId, ctx.band.id),
        eq(hhMembersTable.isActive, true),
      ),
    )
    .limit(1);

  if (!recipient) {
    res.status(404).json({ error: "Recipient not found in this community." });
    return;
  }

  // Check sender's balance (earned tokens minus already sent tips and spent envelopes)
  const [tipSentAgg] = await db
    .select({ total: sql<string>`coalesce(sum(${hhTipsTable.amount}), '0')` })
    .from(hhTipsTable)
    .where(
      and(
        eq(hhTipsTable.fromMemberId, ctx.member.id),
        eq(hhTipsTable.bandId, ctx.band.id),
        eq(hhTipsTable.currency, currency),
      ),
    );

  const [tipReceivedAgg] = await db
    .select({ total: sql<string>`coalesce(sum(${hhTipsTable.amount}), '0')` })
    .from(hhTipsTable)
    .where(
      and(
        eq(hhTipsTable.toMemberId, ctx.member.id),
        eq(hhTipsTable.bandId, ctx.band.id),
        eq(hhTipsTable.currency, currency),
      ),
    );

  const [spentAgg] = await db
    .select({ total: sql<string>`coalesce(sum(${hhEnvelopeTransactionsTable.amount}), '0')` })
    .from(hhEnvelopeTransactionsTable)
    .where(
      and(
        eq(hhEnvelopeTransactionsTable.memberId, ctx.member.id),
        eq(hhEnvelopeTransactionsTable.currency, currency),
      ),
    );

  const [referralBonusAgg] = await db
    .select({ total: sql<string>`coalesce(sum(${hhReferralsTable.referredBonusAmount}), '0')` })
    .from(hhReferralsTable)
    .where(eq(hhReferralsTable.referredMemberId, ctx.member.id));

  const [referralGivenAgg] = await db
    .select({ total: sql<string>`coalesce(sum(${hhReferralsTable.referrerBonusAmount}), '0')` })
    .from(hhReferralsTable)
    .where(eq(hhReferralsTable.referrerId, ctx.member.id));

  const totalEarned =
    currency === "token"
      ? parseFloat(ctx.member.totalEarnedToken ?? "0") +
        parseFloat(tipReceivedAgg?.total ?? "0") +
        parseFloat(referralBonusAgg?.total ?? "0") +
        parseFloat(referralGivenAgg?.total ?? "0")
      : parseFloat(ctx.member.totalEarnedXrp ?? "0");

  const totalSpent =
    parseFloat(spentAgg?.total ?? "0") +
    parseFloat(tipSentAgg?.total ?? "0");

  const available = totalEarned - totalSpent;

  if (sendAmt > available) {
    const sym = currency === "xrp" ? "XRP" : ctx.band.communityTokenCode;
    res.status(409).json({
      error: `Insufficient balance. You have ${Math.max(0, available).toFixed(2)} ${sym} available.`,
    });
    return;
  }

  // V1: XRPL payment simulated
  const mockTxHash = `SIM_TIP_${Date.now().toString(16).toUpperCase()}`;

  const [tip] = await db
    .insert(hhTipsTable)
    .values({
      bandId: ctx.band.id,
      fromMemberId: ctx.member.id,
      toMemberId,
      amount,
      currency,
      note: note ?? "",
      xrplTxHash: mockTxHash,
    })
    .returning();

  // Reveal wallet for both sender AND recipient — for the recipient this may be
  // the first time real value has moved to their account (the progressive reveal
  // moment). Run both in parallel; they're idempotent.
  await Promise.all([
    maybeRevealWallet(ctx.member.id),
    maybeRevealWallet(toMemberId),
  ]);

  res.status(201).json({
    id: tip.id,
    recipientName: `${recipient.firstName} ${recipient.lastName}`,
    amount: tip.amount,
    currency: tip.currency,
    tokenCode: ctx.band.communityTokenCode,
    note: tip.note,
    sentAt: tip.sentAt instanceof Date ? tip.sentAt.toISOString() : String(tip.sentAt),
  });
});

// ──────────────────────────────────────────────
// GET /helping-hands/my/tips
// Returns tips sent and received by the authenticated member.
// ──────────────────────────────────────────────
router.get("/my/tips", requireAuth(), async (req: Request, res: Response) => {
  const ctx = await loadHhMember(req);
  if (!ctx) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { member, band } = ctx;

  const [sent, received] = await Promise.all([
    db
      .select({
        tip: hhTipsTable,
        otherFirst: hhMembersTable.firstName,
        otherLast: hhMembersTable.lastName,
      })
      .from(hhTipsTable)
      .innerJoin(hhMembersTable, eq(hhTipsTable.toMemberId, hhMembersTable.id))
      .where(
        and(
          eq(hhTipsTable.fromMemberId, member.id),
          eq(hhTipsTable.bandId, band.id),
        ),
      )
      .orderBy(desc(hhTipsTable.sentAt))
      .limit(50),
    db
      .select({
        tip: hhTipsTable,
        otherFirst: hhMembersTable.firstName,
        otherLast: hhMembersTable.lastName,
      })
      .from(hhTipsTable)
      .innerJoin(hhMembersTable, eq(hhTipsTable.fromMemberId, hhMembersTable.id))
      .where(
        and(
          eq(hhTipsTable.toMemberId, member.id),
          eq(hhTipsTable.bandId, band.id),
        ),
      )
      .orderBy(desc(hhTipsTable.sentAt))
      .limit(50),
  ]);

  const tips = [
    ...sent.map((r) => ({
      id: r.tip.id,
      direction: "sent" as const,
      otherName: `${r.otherFirst} ${r.otherLast}`,
      amount: r.tip.amount ?? "0",
      currency: r.tip.currency,
      tokenCode: band.communityTokenCode,
      note: r.tip.note ?? "",
      sentAt: r.tip.sentAt instanceof Date ? r.tip.sentAt.toISOString() : String(r.tip.sentAt),
    })),
    ...received.map((r) => ({
      id: r.tip.id,
      direction: "received" as const,
      otherName: `${r.otherFirst} ${r.otherLast}`,
      amount: r.tip.amount ?? "0",
      currency: r.tip.currency,
      tokenCode: band.communityTokenCode,
      note: r.tip.note ?? "",
      sentAt: r.tip.sentAt instanceof Date ? r.tip.sentAt.toISOString() : String(r.tip.sentAt),
    })),
  ].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

  res.json({ tips });
});

// ──────────────────────────────────────────────
// POST /helping-hands/join/:referralCode
// New member joins via a referral link. Awards bonus credits to both the
// new member and the referrer. This is the zone 2/3 adoption lever:
// visible reward before any effort is asked.
// ──────────────────────────────────────────────
const JoinViaReferralSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
});

router.post("/join/:referralCode", async (req: Request, res: Response) => {
  const referralCode = param(req.params.referralCode);

  const parsed = JoinViaReferralSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  // Find the referrer — load their full record so we can derive band membership
  const [referrer] = await db
    .select()
    .from(hhMembersTable)
    .where(eq(hhMembersTable.referralCode, referralCode))
    .limit(1);

  if (!referrer) {
    res.status(404).json({ error: "Referral code not found." });
    return;
  }

  // Derive band from the referrer's own bandId — this is the only correct
  // approach. Using getOrCreateDefaultBand() here could produce a different
  // band in a multi-band deployment, creating cross-band referral links and
  // incorrect ledger state.
  const [band] = await db
    .select()
    .from(hhBandsTable)
    .where(eq(hhBandsTable.id, referrer.bandId))
    .limit(1);

  if (!band) {
    res.status(500).json({ error: "Referrer's band not found." });
    return;
  }

  // Check if email already exists
  const [existing] = await db
    .select({ id: hhMembersTable.id })
    .from(hhMembersTable)
    .where(
      and(
        eq(hhMembersTable.email, parsed.data.email.toLowerCase()),
        eq(hhMembersTable.bandId, band.id),
      ),
    )
    .limit(1);

  if (existing) {
    res.status(409).json({ error: "An account with this email already exists." });
    return;
  }

  // Create the new member
  const [newMember] = await db
    .insert(hhMembersTable)
    .values({
      bandId: band.id,
      email: parsed.data.email.toLowerCase(),
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      tier: "task_based",
      referredByMemberId: referrer.id,
    })
    .returning();

  // Give new member a referral code now so they can share it immediately
  const newCode = generateReferralCode(newMember.id);
  await db
    .update(hhMembersTable)
    .set({ referralCode: newCode, updatedAt: new Date() })
    .where(
      and(
        eq(hhMembersTable.id, newMember.id),
        sql`${hhMembersTable.referralCode} IS NULL`,
      ),
    );

  // ── Referral bonus is NOT awarded here ──
  // The bonus is deferred to the member's first authenticated session.
  // `loadHhMember` checks for a referredByMemberId with no hh_referrals
  // record and awards the bonus at that point (after Clerk email verification).
  // This prevents bonus farming via unauthenticated form submissions.
  const REFERRAL_BONUS = "5";

  res.status(201).json({
    memberId: newMember.id,
    firstName: newMember.firstName,
    bonusAmount: REFERRAL_BONUS,
    tokenCode: band.communityTokenCode,
    referralCode: newCode,
  });
});

// ──────────────────────────────────────────────
// GET /helping-hands/partnership-portal
// Stub: aggregate anonymised savings/reliability data for lender review.
// Returns member count and aggregate metrics only — no PII.
// Access requires admin or a future "partner" role.
// ──────────────────────────────────────────────
router.get("/partnership-portal", requireAuth(), async (req: Request, res: Response) => {
  const bkUser = req.bookkeeperUser!;
  if (!["owner", "ops_manager"].includes(bkUser.role)) {
    res.status(403).json({ error: "Admin or partner access required" });
    return;
  }

  const band = await getOrCreateDefaultBand();
  const month = currentMonth();

  const members = await db
    .select()
    .from(hhMembersTable)
    .where(and(eq(hhMembersTable.bandId, band.id), eq(hhMembersTable.isActive, true)));

  const envelopes = await db
    .select()
    .from(hhEnvelopesTable)
    .where(eq(hhEnvelopesTable.bandId, band.id));

  const savingsEnvelopes = envelopes.filter((e) => e.label.toLowerCase().includes("saving"));
  const avgSavingsBudget =
    savingsEnvelopes.length > 0
      ? (savingsEnvelopes.reduce((s, e) => s + parseFloat(e.monthlyBudget ?? "0"), 0) / savingsEnvelopes.length).toFixed(2)
      : "0";

  const onBudgetThisMonth = envelopes.filter(
    (e) =>
      e.spentMonth === month &&
      parseFloat(e.monthlyBudget ?? "0") > 0 &&
      parseFloat(e.spentThisMonth ?? "0") <= parseFloat(e.monthlyBudget ?? "0"),
  ).length;
  const totalWithBudget = envelopes.filter((e) => parseFloat(e.monthlyBudget ?? "0") > 0).length;
  const envelopeDisciplinePct =
    totalWithBudget > 0 ? Math.round((onBudgetThisMonth / totalWithBudget) * 100) : 0;

  const membersWithSavings = new Set(savingsEnvelopes.map((e) => e.memberId)).size;

  res.json({
    bandName: band.name,
    month,
    activeMembers: members.length,
    membersWithSavingsEnvelope: membersWithSavings,
    savingsAdoptionPct: members.length > 0 ? Math.round((membersWithSavings / members.length) * 100) : 0,
    avgMonthlyTokenSavingsBudget: avgSavingsBudget,
    envelopeDisciplinePct,
    note: "V1 stub — data is aggregate only; no individual PII is exposed. Full consent-gated member profiles planned for V2.",
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// BADGE / CREDENTIAL SYSTEM
// Four-stage knowledge identity: Watching → Learning → Practicing → Teaching
// ══════════════════════════════════════════════════════════════════════════════

const BADGE_STAGES = ["watching", "learning", "practicing", "teaching"] as const;
type BadgeStage = (typeof BADGE_STAGES)[number];

function stageIndex(s: string): number {
  return BADGE_STAGES.indexOf(s as BadgeStage);
}

// ── GET /helping-hands/badges/categories ──────────────────────────────────────
// Returns all badge categories for the band. Defaults to status=active.
// Pass ?status=proposed to see the idea pool; ?status=all for everything.
router.get(
  "/helping-hands/badges/categories",
  requireAuth,
  loadBookkeeperUser,
  async (req: Request, res: Response) => {
    const user = (req as Request & { bookkeeperUser: { bandId: string } }).bookkeeperUser;
    const band = await db.query.hhBandsTable.findFirst({ where: eq(hhBandsTable.id, user.bandId) });
    if (!band) { res.status(404).json({ error: "Band not found" }); return; }

    const statusFilter = req.query.status as string | undefined;
    const rows = await db
      .select()
      .from(hhBadgeCategoriesTable)
      .where(
        statusFilter === "all"
          ? eq(hhBadgeCategoriesTable.bandId, band.id)
          : and(
              eq(hhBadgeCategoriesTable.bandId, band.id),
              eq(hhBadgeCategoriesTable.status, statusFilter ?? "active"),
            ),
      )
      .orderBy(hhBadgeCategoriesTable.domain, hhBadgeCategoriesTable.name);

    res.json(rows);
  },
);

// ── POST /helping-hands/badges/categories ─────────────────────────────────────
// Any member can propose a category (status=proposed).
// Admin can set status=active directly to bypass the proposal pool.
const createBadgeCategorySchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().default(""),
  domain: z.enum(["food", "land", "care", "craft", "governance", "knowledge"]).default("knowledge"),
  stageModel: z.enum(["binary", "three_stage", "four_stage"]).default("four_stage"),
  rateModifierEnabled: z.boolean().default(false),
  status: z.enum(["proposed", "active"]).optional(),
});

router.post(
  "/helping-hands/badges/categories",
  requireAuth,
  loadBookkeeperUser,
  async (req: Request, res: Response) => {
    const user = (req as Request & { bookkeeperUser: { bandId: string; id: string; role: string } }).bookkeeperUser;
    const band = await db.query.hhBandsTable.findFirst({ where: eq(hhBandsTable.id, user.bandId) });
    if (!band) { res.status(404).json({ error: "Band not found" }); return; }

    const member = await db.query.hhMembersTable.findFirst({
      where: and(eq(hhMembersTable.bandId, band.id), eq(hhMembersTable.clerkUserId, user.id)),
    });
    if (!member) { res.status(404).json({ error: "Member not found" }); return; }

    const isAdmin = user.role === "owner" || user.role === "ops_manager";
    const parsed = createBadgeCategorySchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

    const { name, description, domain, stageModel, rateModifierEnabled, status } = parsed.data;
    const finalStatus = isAdmin && status === "active" ? "active" : "proposed";

    const [row] = await db
      .insert(hhBadgeCategoriesTable)
      .values({
        bandId: band.id,
        name,
        description,
        domain,
        stageModel,
        rateModifierEnabled: isAdmin ? rateModifierEnabled : false,
        proposedByMemberId: member.id,
        status: finalStatus,
        updatedAt: new Date(),
      })
      .returning();

    res.status(201).json(row);
  },
);

// ── PATCH /helping-hands/badges/categories/:id ────────────────────────────────
// Admin only. Activate/archive a category, toggle rate modifier.
const updateBadgeCategorySchema = z.object({
  status: z.enum(["proposed", "active", "archived"]).optional(),
  rateModifierEnabled: z.boolean().optional(),
  description: z.string().optional(),
});

router.patch(
  "/helping-hands/badges/categories/:id",
  requireAuth,
  loadBookkeeperUser,
  async (req: Request, res: Response) => {
    const user = (req as Request & { bookkeeperUser: { bandId: string; role: string } }).bookkeeperUser;
    if (user.role !== "owner" && user.role !== "ops_manager") {
      res.status(403).json({ error: "Admin only" }); return;
    }
    const band = await db.query.hhBandsTable.findFirst({ where: eq(hhBandsTable.id, user.bandId) });
    if (!band) { res.status(404).json({ error: "Band not found" }); return; }

    const parsed = updateBadgeCategorySchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

    const id = param(req.params.id);
    const existing = await db.query.hhBadgeCategoriesTable.findFirst({
      where: and(eq(hhBadgeCategoriesTable.id, id), eq(hhBadgeCategoriesTable.bandId, band.id)),
    });
    if (!existing) { res.status(404).json({ error: "Category not found" }); return; }

    const [updated] = await db
      .update(hhBadgeCategoriesTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(hhBadgeCategoriesTable.id, id))
      .returning();

    res.json(updated);
  },
);

// ── POST /helping-hands/badges/watch/:categoryId ──────────────────────────────
// Self-service. Any member presses "I'm watching this." Creates a watching-stage
// badge record. No-ops if they already have any badge for this category.
router.post(
  "/helping-hands/badges/watch/:categoryId",
  requireAuth,
  loadBookkeeperUser,
  async (req: Request, res: Response) => {
    const user = (req as Request & { bookkeeperUser: { bandId: string; id: string } }).bookkeeperUser;
    const band = await db.query.hhBandsTable.findFirst({ where: eq(hhBandsTable.id, user.bandId) });
    if (!band) { res.status(404).json({ error: "Band not found" }); return; }

    const member = await db.query.hhMembersTable.findFirst({
      where: and(eq(hhMembersTable.bandId, band.id), eq(hhMembersTable.clerkUserId, user.id)),
    });
    if (!member) { res.status(404).json({ error: "Member not found" }); return; }

    const categoryId = param(req.params.categoryId);
    const category = await db.query.hhBadgeCategoriesTable.findFirst({
      where: and(eq(hhBadgeCategoriesTable.id, categoryId), eq(hhBadgeCategoriesTable.bandId, band.id)),
    });
    if (!category) { res.status(404).json({ error: "Badge category not found" }); return; }
    if (category.status === "archived") { res.status(400).json({ error: "This skill area is archived" }); return; }

    const existing = await db.query.hhMemberBadgesTable.findFirst({
      where: and(eq(hhMemberBadgesTable.memberId, member.id), eq(hhMemberBadgesTable.categoryId, categoryId)),
    });
    if (existing) { res.json(existing); return; }

    const [row] = await db
      .insert(hhMemberBadgesTable)
      .values({
        bandId: band.id,
        memberId: member.id,
        categoryId,
        stage: "watching",
        updatedAt: new Date(),
      })
      .returning();

    res.status(201).json(row);
  },
);

// ── GET /helping-hands/my/badges ──────────────────────────────────────────────
// Returns the calling member's badges with category details joined.
router.get(
  "/helping-hands/my/badges",
  requireAuth,
  loadBookkeeperUser,
  async (req: Request, res: Response) => {
    const user = (req as Request & { bookkeeperUser: { bandId: string; id: string } }).bookkeeperUser;
    const band = await db.query.hhBandsTable.findFirst({ where: eq(hhBandsTable.id, user.bandId) });
    if (!band) { res.status(404).json({ error: "Band not found" }); return; }

    const member = await db.query.hhMembersTable.findFirst({
      where: and(eq(hhMembersTable.bandId, band.id), eq(hhMembersTable.clerkUserId, user.id)),
    });
    if (!member) { res.status(404).json({ error: "Member not found" }); return; }

    const rows = await db
      .select({
        id: hhMemberBadgesTable.id,
        memberId: hhMemberBadgesTable.memberId,
        categoryId: hhMemberBadgesTable.categoryId,
        stage: hhMemberBadgesTable.stage,
        notes: hhMemberBadgesTable.notes,
        credentialSource: hhMemberBadgesTable.credentialSource,
        createdAt: hhMemberBadgesTable.createdAt,
        updatedAt: hhMemberBadgesTable.updatedAt,
        categoryName: hhBadgeCategoriesTable.name,
        categoryDescription: hhBadgeCategoriesTable.description,
        categoryDomain: hhBadgeCategoriesTable.domain,
        categoryStageModel: hhBadgeCategoriesTable.stageModel,
        categoryRateModifierEnabled: hhBadgeCategoriesTable.rateModifierEnabled,
      })
      .from(hhMemberBadgesTable)
      .innerJoin(hhBadgeCategoriesTable, eq(hhMemberBadgesTable.categoryId, hhBadgeCategoriesTable.id))
      .where(eq(hhMemberBadgesTable.memberId, member.id))
      .orderBy(hhBadgeCategoriesTable.domain, hhBadgeCategoriesTable.name);

    res.json(rows);
  },
);

// ── GET /helping-hands/members/:memberId/badges ───────────────────────────────
// Returns a specific member's badges with category details. Admin or self.
router.get(
  "/helping-hands/members/:memberId/badges",
  requireAuth,
  loadBookkeeperUser,
  async (req: Request, res: Response) => {
    const user = (req as Request & { bookkeeperUser: { bandId: string; id: string; role: string } }).bookkeeperUser;
    const band = await db.query.hhBandsTable.findFirst({ where: eq(hhBandsTable.id, user.bandId) });
    if (!band) { res.status(404).json({ error: "Band not found" }); return; }

    const memberId = param(req.params.memberId);
    const target = await db.query.hhMembersTable.findFirst({
      where: and(eq(hhMembersTable.id, memberId), eq(hhMembersTable.bandId, band.id)),
    });
    if (!target) { res.status(404).json({ error: "Member not found" }); return; }

    const rows = await db
      .select({
        id: hhMemberBadgesTable.id,
        memberId: hhMemberBadgesTable.memberId,
        categoryId: hhMemberBadgesTable.categoryId,
        stage: hhMemberBadgesTable.stage,
        notes: hhMemberBadgesTable.notes,
        credentialSource: hhMemberBadgesTable.credentialSource,
        createdAt: hhMemberBadgesTable.createdAt,
        updatedAt: hhMemberBadgesTable.updatedAt,
        categoryName: hhBadgeCategoriesTable.name,
        categoryDescription: hhBadgeCategoriesTable.description,
        categoryDomain: hhBadgeCategoriesTable.domain,
        categoryStageModel: hhBadgeCategoriesTable.stageModel,
        categoryRateModifierEnabled: hhBadgeCategoriesTable.rateModifierEnabled,
      })
      .from(hhMemberBadgesTable)
      .innerJoin(hhBadgeCategoriesTable, eq(hhMemberBadgesTable.categoryId, hhBadgeCategoriesTable.id))
      .where(eq(hhMemberBadgesTable.memberId, memberId))
      .orderBy(hhBadgeCategoriesTable.domain, hhBadgeCategoriesTable.name);

    res.json(rows);
  },
);

// ── POST /helping-hands/members/:memberId/badges/:categoryId ──────────────────
// Admin/Knowledge Keeper issues or advances a badge. The stage can only move
// forward (watching → learning → practicing → teaching). Teaching can only be
// assigned to someone already at practicing.
const issueBadgeSchema = z.object({
  stage: z.enum(["watching", "learning", "practicing", "teaching"]),
  notes: z.string().default(""),
  credentialSource: z.enum(["hh_task_history", "peer_validation", "earth_kit"]).default("peer_validation"),
});

router.post(
  "/helping-hands/members/:memberId/badges/:categoryId",
  requireAuth,
  loadBookkeeperUser,
  async (req: Request, res: Response) => {
    const user = (req as Request & { bookkeeperUser: { bandId: string; id: string; role: string } }).bookkeeperUser;
    if (user.role !== "owner" && user.role !== "ops_manager") {
      res.status(403).json({ error: "Admin only" }); return;
    }
    const band = await db.query.hhBandsTable.findFirst({ where: eq(hhBandsTable.id, user.bandId) });
    if (!band) { res.status(404).json({ error: "Band not found" }); return; }

    const issuer = await db.query.hhMembersTable.findFirst({
      where: and(eq(hhMembersTable.bandId, band.id), eq(hhMembersTable.clerkUserId, user.id)),
    });
    if (!issuer) { res.status(404).json({ error: "Issuer member record not found" }); return; }

    const memberId = param(req.params.memberId);
    const categoryId = param(req.params.categoryId);

    const [target, category] = await Promise.all([
      db.query.hhMembersTable.findFirst({
        where: and(eq(hhMembersTable.id, memberId), eq(hhMembersTable.bandId, band.id)),
      }),
      db.query.hhBadgeCategoriesTable.findFirst({
        where: and(eq(hhBadgeCategoriesTable.id, categoryId), eq(hhBadgeCategoriesTable.bandId, band.id)),
      }),
    ]);
    if (!target) { res.status(404).json({ error: "Member not found" }); return; }
    if (!category) { res.status(404).json({ error: "Badge category not found" }); return; }

    const parsed = issueBadgeSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

    const { stage, notes, credentialSource } = parsed.data;

    const existing = await db.query.hhMemberBadgesTable.findFirst({
      where: and(eq(hhMemberBadgesTable.memberId, memberId), eq(hhMemberBadgesTable.categoryId, categoryId)),
    });

    if (existing) {
      if (stageIndex(stage) <= stageIndex(existing.stage)) {
        res.status(400).json({ error: `Cannot move badge backwards. Current stage: ${existing.stage}` }); return;
      }
      const [updated] = await db
        .update(hhMemberBadgesTable)
        .set({ stage, notes, credentialSource, issuedByMemberId: issuer.id, updatedAt: new Date() })
        .where(eq(hhMemberBadgesTable.id, existing.id))
        .returning();
      res.json(updated); return;
    }

    const [row] = await db
      .insert(hhMemberBadgesTable)
      .values({
        bandId: band.id,
        memberId,
        categoryId,
        stage,
        credentialSource,
        issuedByMemberId: issuer.id,
        notes,
        updatedAt: new Date(),
      })
      .returning();

    res.status(201).json(row);
  },
);

// ── GET /helping-hands/my/earth-kit-status ────────────────────────────────────
// Returns whether the calling member holds an approved Earth Kit practitioner
// credential (matched by email against practitioner_applications). Used by the
// HHMyBadges UI to surface the "Practitioner Verified" indicator and the
// HH → Earth Kit upgrade pathway call-to-action.
router.get(
  "/helping-hands/my/earth-kit-status",
  requireAuth,
  loadBookkeeperUser,
  async (req: Request, res: Response) => {
    const user = (req as Request & { bookkeeperUser: { bandId: string; id: string; email: string } }).bookkeeperUser;
    const band = await db.query.hhBandsTable.findFirst({ where: eq(hhBandsTable.id, user.bandId) });
    if (!band) { res.status(404).json({ error: "Band not found" }); return; }

    const member = await db.query.hhMembersTable.findFirst({
      where: and(eq(hhMembersTable.bandId, band.id), eq(hhMembersTable.clerkUserId, user.id)),
    });
    if (!member) { res.json({ isPractitioner: false }); return; }

    const [app] = await db
      .select({ id: practitionerApplicationsTable.id, status: practitionerApplicationsTable.status })
      .from(practitionerApplicationsTable)
      .where(
        and(
          eq(practitionerApplicationsTable.contactEmail, member.email),
          eq(practitionerApplicationsTable.status, "approved"),
        ),
      )
      .limit(1);

    res.json({ isPractitioner: !!app });
  },
);

// ── GET /helping-hands/members/:memberId/teaching-badges ──────────────────────
// Returns only the Teaching-stage badges for a given member, filtered to the
// Earth Kit bridgeable domains (food, land, governance, care). Used by the
// Goodbye Kit practitioner directory to enrich a practitioner's profile.
// Admin only.
router.get(
  "/helping-hands/members/:memberId/teaching-badges",
  requireAuth,
  loadBookkeeperUser,
  async (req: Request, res: Response) => {
    const user = (req as Request & { bookkeeperUser: { bandId: string; role: string } }).bookkeeperUser;
    if (user.role !== "owner" && user.role !== "ops_manager") {
      res.status(403).json({ error: "Admin only" }); return;
    }
    const band = await db.query.hhBandsTable.findFirst({ where: eq(hhBandsTable.id, user.bandId) });
    if (!band) { res.status(404).json({ error: "Band not found" }); return; }

    const memberId = param(req.params.memberId);

    const rows = await db
      .select({
        id: hhMemberBadgesTable.id,
        stage: hhMemberBadgesTable.stage,
        credentialSource: hhMemberBadgesTable.credentialSource,
        categoryName: hhBadgeCategoriesTable.name,
        categoryDomain: hhBadgeCategoriesTable.domain,
      })
      .from(hhMemberBadgesTable)
      .innerJoin(hhBadgeCategoriesTable, eq(hhMemberBadgesTable.categoryId, hhBadgeCategoriesTable.id))
      .where(
        and(
          eq(hhMemberBadgesTable.memberId, memberId),
          eq(hhMemberBadgesTable.bandId, band.id),
          eq(hhMemberBadgesTable.stage, "teaching"),
          inArray(hhBadgeCategoriesTable.domain, ["food", "land", "governance", "care"]),
        ),
      )
      .orderBy(hhBadgeCategoriesTable.domain, hhBadgeCategoriesTable.name);

    res.json(rows);
  },
);

// ── GET /helping-hands/practitioner-teaching-badges ──────────────────────────
// Bulk endpoint: given a list of emails (comma-separated ?emails=), returns a
// map of email → Teaching badges for the Goodbye Kit practitioner directory.
// Requires founder-level access (library owner token or Clerk bookkeeper owner).
router.get(
  "/helping-hands/practitioner-teaching-badges",
  requireFounderOnlyAuth,
  async (req: Request, res: Response) => {
    const band = await getOrCreateDefaultBand();
    if (!band) { res.status(404).json({ error: "Band not found" }); return; }

    const emailParam = typeof req.query.emails === "string" ? req.query.emails : "";
    const emails = emailParam.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
    if (emails.length === 0) { res.json({}); return; }

    const members = await db
      .select({ id: hhMembersTable.id, email: hhMembersTable.email })
      .from(hhMembersTable)
      .where(and(eq(hhMembersTable.bandId, band.id), inArray(hhMembersTable.email, emails)));

    if (members.length === 0) { res.json({}); return; }

    const memberIds = members.map((m) => m.id);
    const emailById = new Map(members.map((m) => [m.id, m.email]));

    const rows = await db
      .select({
        memberId: hhMemberBadgesTable.memberId,
        stage: hhMemberBadgesTable.stage,
        credentialSource: hhMemberBadgesTable.credentialSource,
        categoryName: hhBadgeCategoriesTable.name,
        categoryDomain: hhBadgeCategoriesTable.domain,
      })
      .from(hhMemberBadgesTable)
      .innerJoin(hhBadgeCategoriesTable, eq(hhMemberBadgesTable.categoryId, hhBadgeCategoriesTable.id))
      .where(
        and(
          inArray(hhMemberBadgesTable.memberId, memberIds),
          eq(hhMemberBadgesTable.bandId, band.id),
          eq(hhMemberBadgesTable.stage, "teaching"),
          inArray(hhBadgeCategoriesTable.domain, ["food", "land", "governance", "care"]),
        ),
      );

    const result: Record<string, { categoryName: string; categoryDomain: string; credentialSource: string }[]> = {};
    for (const row of rows) {
      const email = emailById.get(row.memberId);
      if (!email) continue;
      if (!result[email]) result[email] = [];
      result[email].push({
        categoryName: row.categoryName,
        categoryDomain: row.categoryDomain,
        credentialSource: row.credentialSource,
      });
    }

    res.json(result);
  },
);

// ── GET /helping-hands/badges/watchers/:categoryId ────────────────────────────
// Admin sees who is watching a given skill — the "invitation" view.
router.get(
  "/helping-hands/badges/watchers/:categoryId",
  requireAuth,
  loadBookkeeperUser,
  async (req: Request, res: Response) => {
    const user = (req as Request & { bookkeeperUser: { bandId: string; role: string } }).bookkeeperUser;
    if (user.role !== "owner" && user.role !== "ops_manager") {
      res.status(403).json({ error: "Admin only" }); return;
    }
    const band = await db.query.hhBandsTable.findFirst({ where: eq(hhBandsTable.id, user.bandId) });
    if (!band) { res.status(404).json({ error: "Band not found" }); return; }

    const categoryId = param(req.params.categoryId);
    const rows = await db
      .select({
        badgeId: hhMemberBadgesTable.id,
        stage: hhMemberBadgesTable.stage,
        createdAt: hhMemberBadgesTable.createdAt,
        memberId: hhMembersTable.id,
        firstName: hhMembersTable.firstName,
        lastName: hhMembersTable.lastName,
        email: hhMembersTable.email,
      })
      .from(hhMemberBadgesTable)
      .innerJoin(hhMembersTable, eq(hhMemberBadgesTable.memberId, hhMembersTable.id))
      .where(
        and(
          eq(hhMemberBadgesTable.categoryId, categoryId),
          eq(hhMemberBadgesTable.bandId, band.id),
          eq(hhMemberBadgesTable.stage, "watching"),
        ),
      )
      .orderBy(hhMemberBadgesTable.createdAt);

    res.json(rows);
  },
);

export default router;
