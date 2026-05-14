import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import {
  bookkeeperUsersTable,
  bookkeeperCostCentresTable,
  bookkeeperAccountsTable,
  bookkeeperTransactionsTable,
  bookkeeperTransactionLinesTable,
  bookkeeperSubmissionsTable,
  bookkeeperReceiptAttachmentsTable,
  bookkeeperInventoryReceiptsTable,
  bookkeeperAuditLogTable,
} from "@workspace/db";
import {
  and,
  asc,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  isNull,
  lte,
  or,
  sql,
} from "drizzle-orm";
import {
  requireAuth,
  requireRole,
  loadBookkeeperUser,
  writeAudit,
  isValidRole,
  type BookkeeperRole,
  type BookkeeperUser,
} from "../lib/bookkeeperAuth";

const router: IRouter = Router();

// ----------------------- helpers -----------------------

function num(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function dateStr(value: Date | string): string {
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

function isoTimestamp(value: Date | string): string {
  if (typeof value === "string") return value;
  return value.toISOString();
}

function asOptionalDate(value: Date | string | null): string | null {
  if (!value) return null;
  return isoTimestamp(value);
}

function actorBy(user: BookkeeperUser) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

// Build API-shape Transaction from a DB row + its lines (joined separately).
type TransactionRow = typeof bookkeeperTransactionsTable.$inferSelect;
type TransactionLineRow = typeof bookkeeperTransactionLinesTable.$inferSelect;
type AccountRow = typeof bookkeeperAccountsTable.$inferSelect;

function serializeTransaction(
  txn: TransactionRow,
  lines: TransactionLineRow[],
  accountsByCode: Map<string, AccountRow>,
) {
  let totalDebit = 0;
  let totalCredit = 0;
  const out = lines
    .sort((a, b) => a.lineOrder - b.lineOrder)
    .map((l) => {
      const debit = num(l.debit);
      const credit = num(l.credit);
      totalDebit += debit;
      totalCredit += credit;
      return {
        id: l.id,
        accountCode: l.accountCode,
        accountName: accountsByCode.get(l.accountCode)?.name ?? l.accountCode,
        costCentreCode: l.costCentreCode,
        memo: l.memo,
        debit,
        credit,
      };
    });
  return {
    id: txn.id,
    postedDate: dateStr(txn.postedDate),
    description: txn.description,
    reference: txn.reference,
    status: txn.status,
    voidedReason: txn.voidedReason,
    voidedAt: asOptionalDate(txn.voidedAt),
    reversesTransactionId: txn.reversesTransactionId,
    sourceSubmissionId: txn.sourceSubmissionId,
    totalDebit: Math.round(totalDebit * 100) / 100,
    totalCredit: Math.round(totalCredit * 100) / 100,
    lines: out,
    createdAt: isoTimestamp(txn.createdAt),
    createdByEmail: txn.createdByEmail,
  };
}

type SubmissionRow = typeof bookkeeperSubmissionsTable.$inferSelect;
type AttachmentRow = typeof bookkeeperReceiptAttachmentsTable.$inferSelect;

function serializeSubmission(
  s: SubmissionRow,
  attachments: AttachmentRow[],
) {
  return {
    id: s.id,
    kind: s.kind,
    status: s.status,
    costCentreCode: s.costCentreCode,
    suggestedAccountCode: s.suggestedAccountCode,
    occurredOn: dateStr(s.occurredOn),
    vendor: s.vendor,
    amount: num(s.amount),
    description: s.description,
    notes: s.notes,
    itemSku: s.itemSku,
    itemName: s.itemName,
    quantity: s.quantity === null ? null : num(s.quantity),
    unit: s.unit,
    rejectedReason: s.rejectedReason,
    approvedTransactionId: s.approvedTransactionId,
    decidedAt: asOptionalDate(s.decidedAt),
    decidedByEmail: s.decidedByEmail,
    createdAt: isoTimestamp(s.createdAt),
    submittedByEmail: s.submittedByEmail,
    submittedByName: s.submittedByName,
    attachments: attachments.map((a) => ({
      id: a.id,
      originalFilename: a.originalFilename,
      contentType: a.contentType,
      fileSize: a.fileSize,
      storageRef: a.storageRef,
      uploadedAt: isoTimestamp(a.uploadedAt),
    })),
  };
}

// ----------------------- /me -----------------------

router.get("/me", async (req: Request, res: Response) => {
  const user = await loadBookkeeperUser(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json({
    id: user.id,
    clerkUserId: user.clerkUserId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isAuthenticated: true,
    isOwner: user.role === "owner",
  });
});

// ----------------------- /users (owner) -----------------------

router.get("/users", requireRole("owner"), async (_req, res) => {
  const rows = await db
    .select()
    .from(bookkeeperUsersTable)
    .orderBy(asc(bookkeeperUsersTable.email));
  res.json(
    rows.map((r) => ({
      id: r.id,
      clerkUserId: r.clerkUserId,
      email: r.email,
      firstName: r.firstName,
      lastName: r.lastName,
      role: r.role,
      createdAt: isoTimestamp(r.createdAt),
      lastSeenAt: asOptionalDate(r.lastSeenAt),
    })),
  );
});

const updateUserSchema = z.object({
  role: z.enum(["owner", "ops_manager", "bookkeeper", "food_handler"]),
});

router.patch("/users/:id", requireRole("owner"), async (req, res) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid role" });
    return;
  }
  const target = await db
    .select()
    .from(bookkeeperUsersTable)
    .where(eq(bookkeeperUsersTable.id, String(req.params.id)))
    .limit(1);
  if (target.length === 0) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const previous = target[0];
  await db
    .update(bookkeeperUsersTable)
    .set({ role: parsed.data.role })
    .where(eq(bookkeeperUsersTable.id, previous.id));
  await writeAudit({
    action: "user.role_change",
    entityType: "user",
    entityId: previous.id,
    actor: req.bookkeeperUser!,
    details: {
      email: previous.email,
      from: previous.role,
      to: parsed.data.role,
    },
  });
  const updated = { ...previous, role: parsed.data.role };
  res.json({
    id: updated.id,
    clerkUserId: updated.clerkUserId,
    email: updated.email,
    firstName: updated.firstName,
    lastName: updated.lastName,
    role: updated.role,
    createdAt: isoTimestamp(updated.createdAt),
    lastSeenAt: asOptionalDate(updated.lastSeenAt),
  });
});

// ----------------------- /cost-centres -----------------------

router.get("/cost-centres", requireAuth(), async (_req, res) => {
  const rows = await db
    .select()
    .from(bookkeeperCostCentresTable)
    .orderBy(asc(bookkeeperCostCentresTable.code));
  res.json(
    rows.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      parentEntity: r.parentEntity,
      owner: r.owner,
      description: r.description,
      color: r.color,
      isActive: r.isActive,
      createdAt: isoTimestamp(r.createdAt),
    })),
  );
});

const createCostCentreSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  parentEntity: z.string().min(1),
  owner: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
});

router.post("/cost-centres", requireRole("owner"), async (req, res) => {
  const parsed = createCostCentreSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid" });
    return;
  }
  const dup = await db
    .select({ id: bookkeeperCostCentresTable.id })
    .from(bookkeeperCostCentresTable)
    .where(eq(bookkeeperCostCentresTable.code, parsed.data.code))
    .limit(1);
  if (dup.length > 0) {
    res
      .status(400)
      .json({ error: `Cost centre code ${parsed.data.code} already exists` });
    return;
  }
  const inserted = await db
    .insert(bookkeeperCostCentresTable)
    .values({
      code: parsed.data.code,
      name: parsed.data.name,
      parentEntity: parsed.data.parentEntity,
      owner: parsed.data.owner ?? null,
      description: parsed.data.description ?? null,
      color: parsed.data.color ?? null,
      isActive: true,
    })
    .returning();
  const row = inserted[0];
  await writeAudit({
    action: "cost_centre.create",
    entityType: "cost_centre",
    entityId: row.id,
    actor: req.bookkeeperUser!,
    details: { code: row.code, name: row.name },
  });
  res.json({
    id: row.id,
    code: row.code,
    name: row.name,
    parentEntity: row.parentEntity,
    owner: row.owner,
    description: row.description,
    color: row.color,
    isActive: row.isActive,
    createdAt: isoTimestamp(row.createdAt),
  });
});

const updateCostCentreSchema = z.object({
  name: z.string().optional(),
  parentEntity: z.string().optional(),
  owner: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
});

router.patch("/cost-centres/:id", requireRole("owner"), async (req, res) => {
  const parsed = updateCostCentreSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid update" });
    return;
  }
  const updates: Partial<typeof bookkeeperCostCentresTable.$inferInsert> = {};
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.parentEntity !== undefined)
    updates.parentEntity = parsed.data.parentEntity;
  if (parsed.data.owner !== undefined) updates.owner = parsed.data.owner;
  if (parsed.data.description !== undefined)
    updates.description = parsed.data.description;
  if (parsed.data.color !== undefined) updates.color = parsed.data.color;
  if (parsed.data.isActive !== undefined)
    updates.isActive = parsed.data.isActive;
  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }
  const updated = await db
    .update(bookkeeperCostCentresTable)
    .set(updates)
    .where(eq(bookkeeperCostCentresTable.id, String(req.params.id)))
    .returning();
  if (updated.length === 0) {
    res.status(404).json({ error: "Cost centre not found" });
    return;
  }
  const row = updated[0];
  await writeAudit({
    action: "cost_centre.update",
    entityType: "cost_centre",
    entityId: row.id,
    actor: req.bookkeeperUser!,
    details: { changes: updates },
  });
  res.json({
    id: row.id,
    code: row.code,
    name: row.name,
    parentEntity: row.parentEntity,
    owner: row.owner,
    description: row.description,
    color: row.color,
    isActive: row.isActive,
    createdAt: isoTimestamp(row.createdAt),
  });
});

// ----------------------- /accounts -----------------------

const accountTypeEnum = z.enum([
  "revenue",
  "cost_of_sales",
  "expense",
  "asset",
  "liability",
  "equity",
  "contra",
]);
const normalSideEnum = z.enum(["debit", "credit"]);

router.get("/accounts", requireAuth(), async (req, res) => {
  const costCentreCode =
    typeof req.query.costCentreCode === "string"
      ? req.query.costCentreCode
      : undefined;
  const where = costCentreCode
    ? eq(bookkeeperAccountsTable.costCentreCode, costCentreCode)
    : undefined;
  const rows = await db
    .select()
    .from(bookkeeperAccountsTable)
    .where(where)
    .orderBy(asc(bookkeeperAccountsTable.code));
  res.json(
    rows.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      type: r.type,
      normalSide: r.normalSide,
      costCentreCode: r.costCentreCode,
      mirrorAccountCode: r.mirrorAccountCode,
      notes: r.notes,
      isActive: r.isActive,
      createdAt: isoTimestamp(r.createdAt),
    })),
  );
});

const createAccountSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  type: accountTypeEnum,
  normalSide: normalSideEnum,
  costCentreCode: z.string().optional(),
  mirrorAccountCode: z.string().optional(),
  notes: z.string().optional(),
});

router.post("/accounts", requireRole("owner"), async (req, res) => {
  const parsed = createAccountSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid" });
    return;
  }
  const dup = await db
    .select({ id: bookkeeperAccountsTable.id })
    .from(bookkeeperAccountsTable)
    .where(eq(bookkeeperAccountsTable.code, parsed.data.code))
    .limit(1);
  if (dup.length > 0) {
    res
      .status(400)
      .json({ error: `Account code ${parsed.data.code} already exists` });
    return;
  }
  const inserted = await db
    .insert(bookkeeperAccountsTable)
    .values({
      code: parsed.data.code,
      name: parsed.data.name,
      type: parsed.data.type,
      normalSide: parsed.data.normalSide,
      costCentreCode: parsed.data.costCentreCode ?? null,
      mirrorAccountCode: parsed.data.mirrorAccountCode ?? null,
      notes: parsed.data.notes ?? null,
      isActive: true,
    })
    .returning();
  const row = inserted[0];
  await writeAudit({
    action: "account.create",
    entityType: "account",
    entityId: row.id,
    actor: req.bookkeeperUser!,
    details: { code: row.code, name: row.name, type: row.type },
  });
  res.json({
    id: row.id,
    code: row.code,
    name: row.name,
    type: row.type,
    normalSide: row.normalSide,
    costCentreCode: row.costCentreCode,
    mirrorAccountCode: row.mirrorAccountCode,
    notes: row.notes,
    isActive: row.isActive,
    createdAt: isoTimestamp(row.createdAt),
  });
});

const updateAccountSchema = z.object({
  name: z.string().optional(),
  type: accountTypeEnum.optional(),
  normalSide: normalSideEnum.optional(),
  costCentreCode: z.string().nullable().optional(),
  mirrorAccountCode: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

router.patch("/accounts/:id", requireRole("owner"), async (req, res) => {
  const parsed = updateAccountSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid update" });
    return;
  }
  const updates: Partial<typeof bookkeeperAccountsTable.$inferInsert> = {};
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.type !== undefined) updates.type = parsed.data.type;
  if (parsed.data.normalSide !== undefined)
    updates.normalSide = parsed.data.normalSide;
  if (parsed.data.costCentreCode !== undefined)
    updates.costCentreCode = parsed.data.costCentreCode;
  if (parsed.data.mirrorAccountCode !== undefined)
    updates.mirrorAccountCode = parsed.data.mirrorAccountCode;
  if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;
  if (parsed.data.isActive !== undefined) updates.isActive = parsed.data.isActive;
  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }
  const updated = await db
    .update(bookkeeperAccountsTable)
    .set(updates)
    .where(eq(bookkeeperAccountsTable.id, String(req.params.id)))
    .returning();
  if (updated.length === 0) {
    res.status(404).json({ error: "Account not found" });
    return;
  }
  const row = updated[0];
  await writeAudit({
    action: "account.update",
    entityType: "account",
    entityId: row.id,
    actor: req.bookkeeperUser!,
    details: { code: row.code, changes: updates },
  });
  res.json({
    id: row.id,
    code: row.code,
    name: row.name,
    type: row.type,
    normalSide: row.normalSide,
    costCentreCode: row.costCentreCode,
    mirrorAccountCode: row.mirrorAccountCode,
    notes: row.notes,
    isActive: row.isActive,
    createdAt: isoTimestamp(row.createdAt),
  });
});

// ----------------------- /transactions -----------------------

router.get(
  "/transactions",
  requireRole("owner", "ops_manager", "bookkeeper"),
  async (req, res) => {
  const limit = Math.min(
    Math.max(Number(req.query.limit ?? 50), 1),
    200,
  );
  const offset = Math.max(Number(req.query.offset ?? 0), 0);
  const status =
    typeof req.query.status === "string" ? req.query.status : undefined;
  const from =
    typeof req.query.from === "string" ? req.query.from : undefined;
  const to = typeof req.query.to === "string" ? req.query.to : undefined;
  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : "";
  const costCentreCode =
    typeof req.query.costCentreCode === "string"
      ? req.query.costCentreCode
      : undefined;
  const accountCode =
    typeof req.query.accountCode === "string" ? req.query.accountCode : undefined;

  const filters: ReturnType<typeof eq>[] = [];
  if (status === "posted" || status === "voided") {
    filters.push(eq(bookkeeperTransactionsTable.status, status));
  }
  if (from) filters.push(gte(bookkeeperTransactionsTable.postedDate, from));
  if (to) filters.push(lte(bookkeeperTransactionsTable.postedDate, to));
  if (search) {
    const like = `%${search}%`;
    filters.push(
      or(
        ilike(bookkeeperTransactionsTable.description, like),
        ilike(bookkeeperTransactionsTable.reference, like),
      )!,
    );
  }

  // For costCentre / account filters we need to subquery into lines.
  if (costCentreCode || accountCode) {
    const innerFilters: ReturnType<typeof eq>[] = [];
    if (costCentreCode)
      innerFilters.push(
        eq(bookkeeperTransactionLinesTable.costCentreCode, costCentreCode),
      );
    if (accountCode)
      innerFilters.push(
        eq(bookkeeperTransactionLinesTable.accountCode, accountCode),
      );
    const txnIds = await db
      .selectDistinct({ id: bookkeeperTransactionLinesTable.transactionId })
      .from(bookkeeperTransactionLinesTable)
      .where(and(...innerFilters));
    const ids = txnIds.map((r) => r.id);
    if (ids.length === 0) {
      res.json({ items: [], total: 0 });
      return;
    }
    filters.push(inArray(bookkeeperTransactionsTable.id, ids));
  }

  const whereExpr = filters.length > 0 ? and(...filters) : undefined;

  const totalRow = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(bookkeeperTransactionsTable)
    .where(whereExpr);
  const total = totalRow[0]?.count ?? 0;

  const txns = await db
    .select()
    .from(bookkeeperTransactionsTable)
    .where(whereExpr)
    .orderBy(
      desc(bookkeeperTransactionsTable.postedDate),
      desc(bookkeeperTransactionsTable.createdAt),
    )
    .limit(limit)
    .offset(offset);

  if (txns.length === 0) {
    res.json({ items: [], total });
    return;
  }

  const txnIds = txns.map((t) => t.id);
  const lines = await db
    .select()
    .from(bookkeeperTransactionLinesTable)
    .where(inArray(bookkeeperTransactionLinesTable.transactionId, txnIds));
  const accountCodes = Array.from(new Set(lines.map((l) => l.accountCode)));
  const accounts =
    accountCodes.length > 0
      ? await db
          .select()
          .from(bookkeeperAccountsTable)
          .where(inArray(bookkeeperAccountsTable.code, accountCodes))
      : [];
  const accountsByCode = new Map(accounts.map((a) => [a.code, a]));
  const linesByTxn = new Map<string, TransactionLineRow[]>();
  for (const l of lines) {
    const arr = linesByTxn.get(l.transactionId) ?? [];
    arr.push(l);
    linesByTxn.set(l.transactionId, arr);
  }

  res.json({
    items: txns.map((t) =>
      serializeTransaction(t, linesByTxn.get(t.id) ?? [], accountsByCode),
    ),
    total,
  });
  },
);

router.get(
  "/transactions/:id",
  requireRole("owner", "ops_manager", "bookkeeper"),
  async (req, res) => {
  const txn = await db
    .select()
    .from(bookkeeperTransactionsTable)
    .where(eq(bookkeeperTransactionsTable.id, String(req.params.id)))
    .limit(1);
  if (txn.length === 0) {
    res.status(404).json({ error: "Transaction not found" });
    return;
  }
  const lines = await db
    .select()
    .from(bookkeeperTransactionLinesTable)
    .where(eq(bookkeeperTransactionLinesTable.transactionId, txn[0].id));
  const accountCodes = Array.from(new Set(lines.map((l) => l.accountCode)));
  const accounts =
    accountCodes.length > 0
      ? await db
          .select()
          .from(bookkeeperAccountsTable)
          .where(inArray(bookkeeperAccountsTable.code, accountCodes))
      : [];
  res.json(
    serializeTransaction(
      txn[0],
      lines,
      new Map(accounts.map((a) => [a.code, a])),
    ),
  );
  },
);

const createTransactionSchema = z.object({
  postedDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "postedDate must be YYYY-MM-DD"),
  description: z.string().min(1),
  reference: z.string().optional(),
  lines: z
    .array(
      z.object({
        accountCode: z.string().min(1),
        costCentreCode: z.string().optional(),
        memo: z.string().optional(),
        debit: z.number().min(0),
        credit: z.number().min(0),
      }),
    )
    .min(2),
});

// Validate the line set: each line is either a debit XOR a credit (not both,
// not neither), and total debits === total credits to the cent.
function validateLines(
  lines: z.infer<typeof createTransactionSchema>["lines"],
): { ok: true } | { ok: false; error: string } {
  let totalDebit = 0;
  let totalCredit = 0;
  for (const [i, l] of lines.entries()) {
    const d = l.debit;
    const c = l.credit;
    if (d > 0 && c > 0) {
      return {
        ok: false,
        error: `Line ${i + 1} has both a debit and a credit. Each line must be one side only.`,
      };
    }
    if (d === 0 && c === 0) {
      return {
        ok: false,
        error: `Line ${i + 1} has no amount. Enter a debit or a credit.`,
      };
    }
    totalDebit += d;
    totalCredit += c;
  }
  // Compare in cents to avoid floating point drift.
  if (Math.round(totalDebit * 100) !== Math.round(totalCredit * 100)) {
    return {
      ok: false,
      error: `Debits ($${totalDebit.toFixed(2)}) do not equal credits ($${totalCredit.toFixed(2)}). Transactions must balance.`,
    };
  }
  return { ok: true };
}

async function postTransaction(opts: {
  postedDate: string;
  description: string;
  reference?: string | null;
  lines: z.infer<typeof createTransactionSchema>["lines"];
  actor: BookkeeperUser;
  reversesTransactionId?: string | null;
  sourceSubmissionId?: string | null;
}): Promise<TransactionRow> {
  // Validate every account code exists and is active.
  const codes = Array.from(new Set(opts.lines.map((l) => l.accountCode)));
  const found = await db
    .select()
    .from(bookkeeperAccountsTable)
    .where(inArray(bookkeeperAccountsTable.code, codes));
  const foundCodes = new Set(found.map((a) => a.code));
  for (const code of codes) {
    if (!foundCodes.has(code)) {
      throw new Error(`Account code ${code} does not exist.`);
    }
  }

  const inserted = await db
    .insert(bookkeeperTransactionsTable)
    .values({
      postedDate: opts.postedDate,
      description: opts.description,
      reference: opts.reference ?? null,
      status: "posted",
      reversesTransactionId: opts.reversesTransactionId ?? null,
      sourceSubmissionId: opts.sourceSubmissionId ?? null,
      createdById: opts.actor.id,
      createdByEmail: opts.actor.email,
    })
    .returning();
  const txn = inserted[0];

  await db.insert(bookkeeperTransactionLinesTable).values(
    opts.lines.map((l, idx) => ({
      transactionId: txn.id,
      accountCode: l.accountCode,
      costCentreCode: l.costCentreCode ?? null,
      memo: l.memo ?? null,
      debit: l.debit.toFixed(2),
      credit: l.credit.toFixed(2),
      lineOrder: idx,
    })),
  );

  return txn;
}

router.post(
  "/transactions",
  requireRole("owner", "ops_manager", "bookkeeper"),
  async (req, res) => {
    const parsed = createTransactionSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: parsed.error.issues[0]?.message ?? "Invalid request" });
      return;
    }
    const validation = validateLines(parsed.data.lines);
    if (!validation.ok) {
      res.status(400).json({ error: validation.error });
      return;
    }
    try {
      const txn = await postTransaction({
        postedDate: parsed.data.postedDate,
        description: parsed.data.description,
        reference: parsed.data.reference,
        lines: parsed.data.lines,
        actor: req.bookkeeperUser!,
      });
      const lines = await db
        .select()
        .from(bookkeeperTransactionLinesTable)
        .where(eq(bookkeeperTransactionLinesTable.transactionId, txn.id));
      const accountCodes = Array.from(new Set(lines.map((l) => l.accountCode)));
      const accounts = await db
        .select()
        .from(bookkeeperAccountsTable)
        .where(inArray(bookkeeperAccountsTable.code, accountCodes));
      await writeAudit({
        action: "transaction.create",
        entityType: "transaction",
        entityId: txn.id,
        actor: req.bookkeeperUser!,
        details: {
          description: txn.description,
          postedDate: dateStr(txn.postedDate),
          totalDebit: lines.reduce((s, l) => s + num(l.debit), 0),
        },
      });
      res.json(
        serializeTransaction(
          txn,
          lines,
          new Map(accounts.map((a) => [a.code, a])),
        ),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to post";
      res.status(400).json({ error: message });
    }
  },
);

const voidSchema = z.object({ reason: z.string().min(3) });

router.post(
  "/transactions/:id/void",
  requireRole("owner", "ops_manager", "bookkeeper"),
  async (req, res) => {
    const parsed = voidSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Reason must be at least 3 characters" });
      return;
    }
    const original = await db
      .select()
      .from(bookkeeperTransactionsTable)
      .where(eq(bookkeeperTransactionsTable.id, String(req.params.id)))
      .limit(1);
    if (original.length === 0) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }
    if (original[0].status !== "posted") {
      res
        .status(400)
        .json({ error: "Only posted transactions can be voided." });
      return;
    }
    const lines = await db
      .select()
      .from(bookkeeperTransactionLinesTable)
      .where(eq(bookkeeperTransactionLinesTable.transactionId, original[0].id));
    if (lines.length === 0) {
      res.status(400).json({ error: "Transaction has no lines to reverse." });
      return;
    }
    const reversingLines = lines.map((l) => ({
      accountCode: l.accountCode,
      costCentreCode: l.costCentreCode ?? undefined,
      memo: `VOID: ${l.memo ?? ""}`.trim(),
      debit: num(l.credit),
      credit: num(l.debit),
    }));
    const reversal = await postTransaction({
      postedDate: dateStr(original[0].postedDate),
      description: `VOID — ${original[0].description}`,
      reference: original[0].reference,
      lines: reversingLines,
      actor: req.bookkeeperUser!,
      reversesTransactionId: original[0].id,
    });
    await db
      .update(bookkeeperTransactionsTable)
      .set({
        status: "voided",
        voidedReason: parsed.data.reason,
        voidedAt: new Date(),
      })
      .where(eq(bookkeeperTransactionsTable.id, original[0].id));
    await writeAudit({
      action: "transaction.void",
      entityType: "transaction",
      entityId: original[0].id,
      actor: req.bookkeeperUser!,
      details: {
        reason: parsed.data.reason,
        reversingTransactionId: reversal.id,
      },
    });
    const reversalLines = await db
      .select()
      .from(bookkeeperTransactionLinesTable)
      .where(eq(bookkeeperTransactionLinesTable.transactionId, reversal.id));
    const accountCodes = Array.from(
      new Set(reversalLines.map((l) => l.accountCode)),
    );
    const accounts = await db
      .select()
      .from(bookkeeperAccountsTable)
      .where(inArray(bookkeeperAccountsTable.code, accountCodes));
    res.json(
      serializeTransaction(
        reversal,
        reversalLines,
        new Map(accounts.map((a) => [a.code, a])),
      ),
    );
  },
);

// ----------------------- /submissions -----------------------

router.get("/submissions", requireAuth(), async (req, res) => {
  const status =
    typeof req.query.status === "string" ? req.query.status : undefined;
  const mine = req.query.mine === "true" || req.query.mine === "1";
  const me = req.bookkeeperUser!;

  const filters: ReturnType<typeof eq>[] = [];
  if (status === "pending" || status === "approved" || status === "rejected") {
    filters.push(eq(bookkeeperSubmissionsTable.status, status));
  }
  // Food handlers can only see their own. Staff can pass `mine=true` to
  // restrict to theirs; otherwise they see the whole queue.
  if (me.role === "food_handler" || mine) {
    filters.push(eq(bookkeeperSubmissionsTable.submittedById, me.id));
  }
  const whereExpr = filters.length > 0 ? and(...filters) : undefined;
  const rows = await db
    .select()
    .from(bookkeeperSubmissionsTable)
    .where(whereExpr)
    .orderBy(desc(bookkeeperSubmissionsTable.createdAt))
    .limit(200);
  if (rows.length === 0) {
    res.json([]);
    return;
  }
  const ids = rows.map((r) => r.id);
  const attachments = await db
    .select()
    .from(bookkeeperReceiptAttachmentsTable)
    .where(inArray(bookkeeperReceiptAttachmentsTable.submissionId, ids));
  const attByS = new Map<string, AttachmentRow[]>();
  for (const a of attachments) {
    const arr = attByS.get(a.submissionId) ?? [];
    arr.push(a);
    attByS.set(a.submissionId, arr);
  }
  res.json(rows.map((r) => serializeSubmission(r, attByS.get(r.id) ?? [])));
});

const createSubmissionSchema = z.object({
  kind: z.enum(["expense", "inventory_receipt"]),
  costCentreCode: z.string().min(1),
  suggestedAccountCode: z.string().optional(),
  occurredOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  vendor: z.string().min(1),
  amount: z.number().min(0),
  description: z.string().min(1),
  notes: z.string().optional(),
  itemSku: z.string().optional(),
  itemName: z.string().optional(),
  quantity: z.number().optional(),
  unit: z.string().optional(),
  attachments: z
    .array(
      z.object({
        storageRef: z.string(),
        originalFilename: z.string(),
        contentType: z.string(),
        fileSize: z.number().optional(),
      }),
    )
    .optional(),
});

router.post("/submissions", requireAuth(), async (req, res) => {
  const parsed = createSubmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: parsed.error.issues[0]?.message ?? "Invalid submission" });
    return;
  }
  const me = req.bookkeeperUser!;
  // Confirm cost-centre exists.
  const cc = await db
    .select({ id: bookkeeperCostCentresTable.id })
    .from(bookkeeperCostCentresTable)
    .where(eq(bookkeeperCostCentresTable.code, parsed.data.costCentreCode))
    .limit(1);
  if (cc.length === 0) {
    res.status(400).json({
      error: `Cost centre ${parsed.data.costCentreCode} does not exist.`,
    });
    return;
  }
  const inserted = await db
    .insert(bookkeeperSubmissionsTable)
    .values({
      kind: parsed.data.kind,
      status: "pending",
      costCentreCode: parsed.data.costCentreCode,
      suggestedAccountCode: parsed.data.suggestedAccountCode ?? null,
      occurredOn: parsed.data.occurredOn,
      vendor: parsed.data.vendor,
      amount: parsed.data.amount.toFixed(2),
      description: parsed.data.description,
      notes: parsed.data.notes ?? null,
      itemSku: parsed.data.itemSku ?? null,
      itemName: parsed.data.itemName ?? null,
      quantity:
        parsed.data.quantity !== undefined
          ? parsed.data.quantity.toFixed(4)
          : null,
      unit: parsed.data.unit ?? null,
      submittedById: me.id,
      submittedByEmail: me.email,
      submittedByName:
        [me.firstName, me.lastName].filter(Boolean).join(" ") || null,
    })
    .returning();
  const row = inserted[0];
  let attachmentRows: AttachmentRow[] = [];
  if (parsed.data.attachments && parsed.data.attachments.length > 0) {
    attachmentRows = await db
      .insert(bookkeeperReceiptAttachmentsTable)
      .values(
        parsed.data.attachments.map((a) => ({
          submissionId: row.id,
          originalFilename: a.originalFilename,
          contentType: a.contentType,
          fileSize: a.fileSize ?? null,
          storageRef: a.storageRef,
        })),
      )
      .returning();
  }
  await writeAudit({
    action: "submission.create",
    entityType: "submission",
    entityId: row.id,
    actor: me,
    details: {
      kind: row.kind,
      vendor: row.vendor,
      amount: num(row.amount),
      costCentreCode: row.costCentreCode,
    },
  });
  res.json(serializeSubmission(row, attachmentRows));
});

const approveSubmissionSchema = z.object({
  postedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().optional(),
  reference: z.string().optional(),
  lines: z
    .array(
      z.object({
        accountCode: z.string().min(1),
        costCentreCode: z.string().optional(),
        memo: z.string().optional(),
        debit: z.number().min(0),
        credit: z.number().min(0),
      }),
    )
    .min(2),
});

router.post(
  "/submissions/:id/approve",
  requireRole("owner", "ops_manager", "bookkeeper"),
  async (req, res) => {
    const parsed = approveSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: parsed.error.issues[0]?.message ?? "Invalid request" });
      return;
    }
    const submission = await db
      .select()
      .from(bookkeeperSubmissionsTable)
      .where(eq(bookkeeperSubmissionsTable.id, String(req.params.id)))
      .limit(1);
    if (submission.length === 0) {
      res.status(404).json({ error: "Submission not found" });
      return;
    }
    if (submission[0].status !== "pending") {
      res.status(400).json({
        error: `Submission is already ${submission[0].status}.`,
      });
      return;
    }
    // Inventory receipts must carry a real, positive quantity at approval
    // time — otherwise the mirror row would record 0 units received and
    // the receipt would silently disappear from stock-on-hand reports.
    // Quantity is allowed to be blank on the pending submission (curators
    // sometimes draft a receipt and fill the count in later), but it must
    // be present and > 0 before the receipt is posted.
    if (submission[0].kind === "inventory_receipt") {
      const q =
        submission[0].quantity !== null ? num(submission[0].quantity) : null;
      if (q === null || q <= 0) {
        res.status(400).json({
          error:
            "Inventory receipt cannot be approved without a positive quantity.",
        });
        return;
      }
    }
    const validation = validateLines(parsed.data.lines);
    if (!validation.ok) {
      res.status(400).json({ error: validation.error });
      return;
    }
    const me = req.bookkeeperUser!;
    let txn: TransactionRow;
    try {
      txn = await postTransaction({
        postedDate: parsed.data.postedDate,
        description:
          parsed.data.description ??
          `${submission[0].vendor} — ${submission[0].description}`,
        reference: parsed.data.reference ?? null,
        lines: parsed.data.lines,
        actor: me,
        sourceSubmissionId: submission[0].id,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to post";
      res.status(400).json({ error: message });
      return;
    }
    await db
      .update(bookkeeperSubmissionsTable)
      .set({
        status: "approved",
        approvedTransactionId: txn.id,
        decidedAt: new Date(),
        decidedById: me.id,
        decidedByEmail: me.email,
      })
      .where(eq(bookkeeperSubmissionsTable.id, submission[0].id));

    // For inventory receipts, mirror the detail row.
    if (submission[0].kind === "inventory_receipt") {
      await db.insert(bookkeeperInventoryReceiptsTable).values({
        submissionId: submission[0].id,
        transactionId: txn.id,
        costCentreCode: submission[0].costCentreCode,
        itemSku: submission[0].itemSku,
        itemName: submission[0].itemName ?? submission[0].description,
        quantity:
          submission[0].quantity !== null ? submission[0].quantity : "0",
        unit: submission[0].unit,
        occurredOn: submission[0].occurredOn,
        vendor: submission[0].vendor,
        notes: submission[0].notes,
      });
    }

    await writeAudit({
      action: "submission.approve",
      entityType: "submission",
      entityId: submission[0].id,
      actor: me,
      details: {
        transactionId: txn.id,
        amount: num(submission[0].amount),
      },
    });

    const refreshed = await db
      .select()
      .from(bookkeeperSubmissionsTable)
      .where(eq(bookkeeperSubmissionsTable.id, submission[0].id))
      .limit(1);
    const attachments = await db
      .select()
      .from(bookkeeperReceiptAttachmentsTable)
      .where(
        eq(bookkeeperReceiptAttachmentsTable.submissionId, submission[0].id),
      );
    res.json(serializeSubmission(refreshed[0], attachments));
  },
);

const rejectSubmissionSchema = z.object({ reason: z.string().min(3) });

router.post(
  "/submissions/:id/reject",
  requireRole("owner", "ops_manager", "bookkeeper"),
  async (req, res) => {
    const parsed = rejectSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Reason must be at least 3 characters" });
      return;
    }
    const submission = await db
      .select()
      .from(bookkeeperSubmissionsTable)
      .where(eq(bookkeeperSubmissionsTable.id, String(req.params.id)))
      .limit(1);
    if (submission.length === 0) {
      res.status(404).json({ error: "Submission not found" });
      return;
    }
    if (submission[0].status !== "pending") {
      res.status(400).json({
        error: `Submission is already ${submission[0].status}.`,
      });
      return;
    }
    const me = req.bookkeeperUser!;
    await db
      .update(bookkeeperSubmissionsTable)
      .set({
        status: "rejected",
        rejectedReason: parsed.data.reason,
        decidedAt: new Date(),
        decidedById: me.id,
        decidedByEmail: me.email,
      })
      .where(eq(bookkeeperSubmissionsTable.id, submission[0].id));
    await writeAudit({
      action: "submission.reject",
      entityType: "submission",
      entityId: submission[0].id,
      actor: me,
      details: { reason: parsed.data.reason },
    });
    const refreshed = await db
      .select()
      .from(bookkeeperSubmissionsTable)
      .where(eq(bookkeeperSubmissionsTable.id, submission[0].id))
      .limit(1);
    const attachments = await db
      .select()
      .from(bookkeeperReceiptAttachmentsTable)
      .where(
        eq(bookkeeperReceiptAttachmentsTable.submissionId, submission[0].id),
      );
    res.json(serializeSubmission(refreshed[0], attachments));
  },
);

// ----------------------- /handlers -----------------------

router.get(
  "/handlers/activity",
  requireRole("owner", "ops_manager", "bookkeeper"),
  async (_req, res) => {
    const handlers = await db
      .select()
      .from(bookkeeperUsersTable)
      .where(eq(bookkeeperUsersTable.role, "food_handler"));
    if (handlers.length === 0) {
      res.json([]);
      return;
    }
    const ids = handlers.map((h) => h.id);
    const stats = await db
      .select({
        submittedById: bookkeeperSubmissionsTable.submittedById,
        total: sql<number>`count(*)::int`,
        pending: sql<number>`count(*) filter (where ${bookkeeperSubmissionsTable.status} = 'pending')::int`,
        lastSubmission: sql<Date | null>`max(${bookkeeperSubmissionsTable.createdAt})`,
      })
      .from(bookkeeperSubmissionsTable)
      .where(inArray(bookkeeperSubmissionsTable.submittedById, ids))
      .groupBy(bookkeeperSubmissionsTable.submittedById);
    const byUser = new Map(stats.map((s) => [s.submittedById, s]));
    const now = Date.now();
    res.json(
      handlers.map((h) => {
        const s = byUser.get(h.id);
        const lastAt = s?.lastSubmission ?? null;
        const days =
          lastAt instanceof Date
            ? Math.floor((now - lastAt.getTime()) / 86_400_000)
            : null;
        return {
          userId: h.id,
          clerkUserId: h.clerkUserId,
          email: h.email,
          firstName: h.firstName,
          lastName: h.lastName,
          totalSubmissions: s?.total ?? 0,
          pendingSubmissions: s?.pending ?? 0,
          lastSubmissionAt: lastAt ? isoTimestamp(lastAt) : null,
          daysSinceLastSubmission: days,
          lastNudgedAt: asOptionalDate(h.lastNudgedAt),
        };
      }),
    );
  },
);

const nudgeSchema = z.object({ message: z.string().optional() });

router.post(
  "/handlers/:id/nudge",
  requireRole("owner", "ops_manager", "bookkeeper"),
  async (req, res) => {
    const parsed = nudgeSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid nudge payload" });
      return;
    }
    const handler = await db
      .select()
      .from(bookkeeperUsersTable)
      .where(eq(bookkeeperUsersTable.id, String(req.params.id)))
      .limit(1);
    if (handler.length === 0) {
      res.status(404).json({ error: "Handler not found" });
      return;
    }
    if (handler[0].role !== "food_handler") {
      res
        .status(400)
        .json({ error: "Nudges are only sent to food handlers." });
      return;
    }
    const now = new Date();
    await db
      .update(bookkeeperUsersTable)
      .set({ lastNudgedAt: now })
      .where(eq(bookkeeperUsersTable.id, handler[0].id));
    await writeAudit({
      action: "handler.nudge",
      entityType: "user",
      entityId: handler[0].id,
      actor: req.bookkeeperUser!,
      details: {
        email: handler[0].email,
        message: parsed.data.message ?? null,
      },
    });
    // Reuse the activity row shape for the response.
    const stats = await db
      .select({
        total: sql<number>`count(*)::int`,
        pending: sql<number>`count(*) filter (where ${bookkeeperSubmissionsTable.status} = 'pending')::int`,
        lastSubmission: sql<Date | null>`max(${bookkeeperSubmissionsTable.createdAt})`,
      })
      .from(bookkeeperSubmissionsTable)
      .where(eq(bookkeeperSubmissionsTable.submittedById, handler[0].id));
    const s = stats[0];
    const lastAt = s?.lastSubmission ?? null;
    const days =
      lastAt instanceof Date
        ? Math.floor((Date.now() - lastAt.getTime()) / 86_400_000)
        : null;
    res.json({
      userId: handler[0].id,
      clerkUserId: handler[0].clerkUserId,
      email: handler[0].email,
      firstName: handler[0].firstName,
      lastName: handler[0].lastName,
      totalSubmissions: s?.total ?? 0,
      pendingSubmissions: s?.pending ?? 0,
      lastSubmissionAt: lastAt ? isoTimestamp(lastAt) : null,
      daysSinceLastSubmission: days,
      lastNudgedAt: now.toISOString(),
    });
  },
);

// ----------------------- /dashboard + /dashboard/pnl -----------------------

router.get(
  "/dashboard",
  requireRole("owner", "ops_manager", "bookkeeper"),
  async (_req, res) => {
    const [transactionsCount] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(bookkeeperTransactionsTable);
    const [costCentresCount] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(bookkeeperCostCentresTable);
    const [accountsCount] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(bookkeeperAccountsTable);
    const [pendingCount] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(bookkeeperSubmissionsTable)
      .where(eq(bookkeeperSubmissionsTable.status, "pending"));

    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);
    const monthStartIso = monthStart.toISOString().slice(0, 10);
    const [postedThisMonth] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(bookkeeperTransactionsTable)
      .where(
        and(
          eq(bookkeeperTransactionsTable.status, "posted"),
          gte(bookkeeperTransactionsTable.postedDate, monthStartIso),
        ),
      );

    // by cost-centre rollup (lifetime)
    const accountTypeMap = new Map(
      (
        await db
          .select({
            code: bookkeeperAccountsTable.code,
            type: bookkeeperAccountsTable.type,
            normalSide: bookkeeperAccountsTable.normalSide,
          })
          .from(bookkeeperAccountsTable)
      ).map((a) => [a.code, a]),
    );

    const lineRows = await db
      .select({
        costCentreCode: bookkeeperTransactionLinesTable.costCentreCode,
        accountCode: bookkeeperTransactionLinesTable.accountCode,
        debit: bookkeeperTransactionLinesTable.debit,
        credit: bookkeeperTransactionLinesTable.credit,
        postedDate: bookkeeperTransactionsTable.postedDate,
        status: bookkeeperTransactionsTable.status,
      })
      .from(bookkeeperTransactionLinesTable)
      .innerJoin(
        bookkeeperTransactionsTable,
        eq(
          bookkeeperTransactionLinesTable.transactionId,
          bookkeeperTransactionsTable.id,
        ),
      )
      .where(eq(bookkeeperTransactionsTable.status, "posted"));

    const costCentres = await db
      .select()
      .from(bookkeeperCostCentresTable)
      .orderBy(asc(bookkeeperCostCentresTable.code));

    type Bucket = {
      revenue: number;
      costs: number;
      transactionIds: Set<string>;
    };
    const byCC = new Map<string, Bucket>();
    for (const cc of costCentres) {
      byCC.set(cc.code, { revenue: 0, costs: 0, transactionIds: new Set() });
    }
    const byMonth = new Map<string, { revenue: number; costs: number }>();
    for (const l of lineRows) {
      const acct = accountTypeMap.get(l.accountCode);
      if (!acct) continue;
      const debit = num(l.debit);
      const credit = num(l.credit);
      const monthKey = dateStr(l.postedDate).slice(0, 7);
      let monthBucket = byMonth.get(monthKey);
      if (!monthBucket) {
        monthBucket = { revenue: 0, costs: 0 };
        byMonth.set(monthKey, monthBucket);
      }
      const ccKey = l.costCentreCode ?? null;
      const ccBucket = ccKey ? byCC.get(ccKey) : undefined;
      if (acct.type === "revenue") {
        const v = credit - debit;
        monthBucket.revenue += v;
        if (ccBucket) ccBucket.revenue += v;
      } else if (
        acct.type === "cost_of_sales" ||
        acct.type === "expense" ||
        acct.type === "contra"
      ) {
        const v = debit - credit;
        monthBucket.costs += v;
        if (ccBucket) ccBucket.costs += v;
      }
    }

    // recent transactions
    const recentTxns = await db
      .select()
      .from(bookkeeperTransactionsTable)
      .orderBy(
        desc(bookkeeperTransactionsTable.createdAt),
      )
      .limit(8);
    const recentLines =
      recentTxns.length > 0
        ? await db
            .select()
            .from(bookkeeperTransactionLinesTable)
            .where(
              inArray(
                bookkeeperTransactionLinesTable.transactionId,
                recentTxns.map((t) => t.id),
              ),
            )
        : [];
    const recentLineCodes = Array.from(
      new Set(recentLines.map((l) => l.accountCode)),
    );
    const recentAccounts =
      recentLineCodes.length > 0
        ? await db
            .select()
            .from(bookkeeperAccountsTable)
            .where(inArray(bookkeeperAccountsTable.code, recentLineCodes))
        : [];
    const recentAcctMap = new Map(recentAccounts.map((a) => [a.code, a]));
    const linesByTxn = new Map<string, TransactionLineRow[]>();
    for (const l of recentLines) {
      const arr = linesByTxn.get(l.transactionId) ?? [];
      arr.push(l);
      linesByTxn.set(l.transactionId, arr);
    }

    // pending submissions (top 8)
    const pending = await db
      .select()
      .from(bookkeeperSubmissionsTable)
      .where(eq(bookkeeperSubmissionsTable.status, "pending"))
      .orderBy(desc(bookkeeperSubmissionsTable.createdAt))
      .limit(8);
    const pendingAttachments =
      pending.length > 0
        ? await db
            .select()
            .from(bookkeeperReceiptAttachmentsTable)
            .where(
              inArray(
                bookkeeperReceiptAttachmentsTable.submissionId,
                pending.map((s) => s.id),
              ),
            )
        : [];
    const attBySub = new Map<string, AttachmentRow[]>();
    for (const a of pendingAttachments) {
      const arr = attBySub.get(a.submissionId) ?? [];
      arr.push(a);
      attBySub.set(a.submissionId, arr);
    }

    // stale handlers (>= 14 days, food_handler role only)
    const handlerRows = await db
      .select()
      .from(bookkeeperUsersTable)
      .where(eq(bookkeeperUsersTable.role, "food_handler"));
    const handlerStats = await db
      .select({
        submittedById: bookkeeperSubmissionsTable.submittedById,
        lastSubmission: sql<Date | null>`max(${bookkeeperSubmissionsTable.createdAt})`,
        total: sql<number>`count(*)::int`,
        pending: sql<number>`count(*) filter (where ${bookkeeperSubmissionsTable.status} = 'pending')::int`,
      })
      .from(bookkeeperSubmissionsTable)
      .groupBy(bookkeeperSubmissionsTable.submittedById);
    const handlerStatMap = new Map(
      handlerStats.map((s) => [s.submittedById, s]),
    );
    const now = Date.now();
    const staleHandlers = handlerRows
      .map((h) => {
        const s = handlerStatMap.get(h.id);
        const lastAt = s?.lastSubmission ?? null;
        const days =
          lastAt instanceof Date
            ? Math.floor((now - lastAt.getTime()) / 86_400_000)
            : null;
        return {
          userId: h.id,
          clerkUserId: h.clerkUserId,
          email: h.email,
          firstName: h.firstName,
          lastName: h.lastName,
          totalSubmissions: s?.total ?? 0,
          pendingSubmissions: s?.pending ?? 0,
          lastSubmissionAt: lastAt ? isoTimestamp(lastAt) : null,
          daysSinceLastSubmission: days,
          lastNudgedAt: asOptionalDate(h.lastNudgedAt),
        };
      })
      .filter((h) => h.daysSinceLastSubmission === null || h.daysSinceLastSubmission >= 14);

    // CC transaction counts
    const ccTxnCounts = await db
      .select({
        costCentreCode: bookkeeperTransactionLinesTable.costCentreCode,
        n: sql<number>`count(distinct ${bookkeeperTransactionLinesTable.transactionId})::int`,
      })
      .from(bookkeeperTransactionLinesTable)
      .innerJoin(
        bookkeeperTransactionsTable,
        eq(
          bookkeeperTransactionLinesTable.transactionId,
          bookkeeperTransactionsTable.id,
        ),
      )
      .where(eq(bookkeeperTransactionsTable.status, "posted"))
      .groupBy(bookkeeperTransactionLinesTable.costCentreCode);
    const txnCountByCc = new Map<string | null, number>();
    for (const r of ccTxnCounts)
      txnCountByCc.set(r.costCentreCode, r.n ?? 0);

    res.json({
      totals: {
        transactions: transactionsCount?.n ?? 0,
        postedThisMonth: postedThisMonth?.n ?? 0,
        pendingSubmissionsCount: pendingCount?.n ?? 0,
        costCentres: costCentresCount?.n ?? 0,
        accounts: accountsCount?.n ?? 0,
      },
      byCostCentre: costCentres.map((cc) => {
        const b = byCC.get(cc.code) ?? { revenue: 0, costs: 0 };
        return {
          code: cc.code,
          name: cc.name,
          revenue: Math.round(b.revenue * 100) / 100,
          costs: Math.round(b.costs * 100) / 100,
          net: Math.round((b.revenue - b.costs) * 100) / 100,
          transactionCount: txnCountByCc.get(cc.code) ?? 0,
        };
      }),
      byMonth: Array.from(byMonth.entries())
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .slice(-12)
        .map(([month, v]) => ({
          month,
          revenue: Math.round(v.revenue * 100) / 100,
          costs: Math.round(v.costs * 100) / 100,
          net: Math.round((v.revenue - v.costs) * 100) / 100,
        })),
      recentTransactions: recentTxns.map((t) =>
        serializeTransaction(t, linesByTxn.get(t.id) ?? [], recentAcctMap),
      ),
      pendingSubmissions: pending.map((s) =>
        serializeSubmission(s, attBySub.get(s.id) ?? []),
      ),
      staleHandlers,
    });
  },
);

router.get(
  "/dashboard/pnl",
  requireRole("owner", "bookkeeper"),
  async (req, res) => {
    const from = typeof req.query.from === "string" ? req.query.from : null;
    const to = typeof req.query.to === "string" ? req.query.to : null;

    const filters: ReturnType<typeof eq>[] = [
      eq(bookkeeperTransactionsTable.status, "posted"),
    ];
    if (from) filters.push(gte(bookkeeperTransactionsTable.postedDate, from));
    if (to) filters.push(lte(bookkeeperTransactionsTable.postedDate, to));

    const lines = await db
      .select({
        costCentreCode: bookkeeperTransactionLinesTable.costCentreCode,
        accountCode: bookkeeperTransactionLinesTable.accountCode,
        debit: bookkeeperTransactionLinesTable.debit,
        credit: bookkeeperTransactionLinesTable.credit,
      })
      .from(bookkeeperTransactionLinesTable)
      .innerJoin(
        bookkeeperTransactionsTable,
        eq(
          bookkeeperTransactionLinesTable.transactionId,
          bookkeeperTransactionsTable.id,
        ),
      )
      .where(and(...filters));

    const accounts = await db.select().from(bookkeeperAccountsTable);
    const acctMap = new Map(accounts.map((a) => [a.code, a]));
    const costCentres = await db
      .select()
      .from(bookkeeperCostCentresTable)
      .orderBy(asc(bookkeeperCostCentresTable.code));

    type LineAgg = { total: number; account: AccountRow };
    type CCBucket = {
      revenue: Map<string, LineAgg>;
      costs: Map<string, LineAgg>;
    };
    const byCC = new Map<string, CCBucket>();
    for (const cc of costCentres)
      byCC.set(cc.code, { revenue: new Map(), costs: new Map() });
    let agencyRevenue = 0;
    let agencyCosts = 0;

    for (const l of lines) {
      const acct = acctMap.get(l.accountCode);
      if (!acct) continue;
      const debit = num(l.debit);
      const credit = num(l.credit);
      const cc = l.costCentreCode;
      if (acct.type === "revenue") {
        const v = credit - debit;
        agencyRevenue += v;
        if (cc) {
          const bucket = byCC.get(cc);
          if (bucket) {
            const cur = bucket.revenue.get(acct.code) ?? {
              total: 0,
              account: acct,
            };
            cur.total += v;
            bucket.revenue.set(acct.code, cur);
          }
        }
      } else if (
        acct.type === "cost_of_sales" ||
        acct.type === "expense" ||
        acct.type === "contra"
      ) {
        const v = debit - credit;
        agencyCosts += v;
        if (cc) {
          const bucket = byCC.get(cc);
          if (bucket) {
            const cur = bucket.costs.get(acct.code) ?? {
              total: 0,
              account: acct,
            };
            cur.total += v;
            bucket.costs.set(acct.code, cur);
          }
        }
      }
    }

    res.json({
      from,
      to,
      agencyTotals: {
        revenue: Math.round(agencyRevenue * 100) / 100,
        costs: Math.round(agencyCosts * 100) / 100,
        net: Math.round((agencyRevenue - agencyCosts) * 100) / 100,
      },
      costCentres: costCentres.map((cc) => {
        const bucket = byCC.get(cc.code) ?? {
          revenue: new Map(),
          costs: new Map(),
        };
        const revenueLines = Array.from(bucket.revenue.values()).map((r) => ({
          accountCode: r.account.code,
          accountName: r.account.name,
          normalSide: r.account.normalSide,
          total: Math.round(r.total * 100) / 100,
        }));
        const costLines = Array.from(bucket.costs.values()).map((r) => ({
          accountCode: r.account.code,
          accountName: r.account.name,
          normalSide: r.account.normalSide,
          total: Math.round(r.total * 100) / 100,
        }));
        const revenue = revenueLines.reduce((s, l) => s + l.total, 0);
        const costs = costLines.reduce((s, l) => s + l.total, 0);
        return {
          code: cc.code,
          name: cc.name,
          parentEntity: cc.parentEntity,
          revenue: Math.round(revenue * 100) / 100,
          costs: Math.round(costs * 100) / 100,
          net: Math.round((revenue - costs) * 100) / 100,
          revenueLines,
          costLines,
        };
      }),
    });
  },
);

// ----------------------- /audit (owner) -----------------------

router.get("/audit", requireRole("owner"), async (req, res) => {
  const limit = Math.min(
    Math.max(Number(req.query.limit ?? 50), 1),
    200,
  );
  const rows = await db
    .select()
    .from(bookkeeperAuditLogTable)
    .orderBy(desc(bookkeeperAuditLogTable.createdAt))
    .limit(limit);
  res.json(
    rows.map((r) => ({
      id: r.id,
      action: r.action,
      entityType: r.entityType,
      entityId: r.entityId,
      actorEmail: r.actorEmail,
      actorRole: isValidRole(r.actorRole)
        ? (r.actorRole as BookkeeperRole)
        : "food_handler",
      details: (r.details as Record<string, unknown> | null) ?? null,
      createdAt: isoTimestamp(r.createdAt),
    })),
  );
});

// Suppress unused-import warnings from helpers we keep available for future
// route additions.
void asc;
void isNull;

export default router;
