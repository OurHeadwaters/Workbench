import {
  pgTable,
  text,
  uuid,
  timestamp,
  integer,
  numeric,
  boolean,
  jsonb,
  date,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ---------- app_users (Clerk role mirror) ----------
//
// Source of truth for the four bookkeeper roles. We mirror Clerk's user
// identity here so role lookups don't require a Clerk round-trip on every
// request, and so we can join roles into transactions/submissions as a
// stable foreign key.
//
// Role is intentionally a text column with an enum-like check at the
// application layer — keeps Drizzle migrations cheap if we ever add a
// fifth role.
export const bookkeeperUsersTable = pgTable(
  "bk_app_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").notNull(),
    email: text("email").notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    role: text("role").notNull().default("food_handler"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
    lastNudgedAt: timestamp("last_nudged_at", { withTimezone: true }),
  },
  (t) => ({
    clerkIdx: uniqueIndex("bk_app_users_clerk_user_id_idx").on(t.clerkUserId),
    emailIdx: index("bk_app_users_email_idx").on(t.email),
  }),
);

// ---------- cost_centres ----------
export const bookkeeperCostCentresTable = pgTable(
  "bk_cost_centres",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    parentEntity: text("parent_entity").notNull(),
    owner: text("owner"),
    description: text("description"),
    color: text("color"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    codeIdx: uniqueIndex("bk_cost_centres_code_idx").on(t.code),
  }),
);

// ---------- accounts (chart of accounts) ----------
export const bookkeeperAccountsTable = pgTable(
  "bk_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    type: text("type").notNull(), // revenue | cost_of_sales | expense | asset | liability | equity | contra
    normalSide: text("normal_side").notNull(), // debit | credit
    costCentreCode: text("cost_centre_code"),
    mirrorAccountCode: text("mirror_account_code"),
    notes: text("notes"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    codeIdx: uniqueIndex("bk_accounts_code_idx").on(t.code),
    costCentreIdx: index("bk_accounts_cost_centre_idx").on(t.costCentreCode),
  }),
);

// ---------- transactions ----------
//
// Posted transactions are immutable. To "fix" one, the bookkeeper voids it,
// which writes a reversing transaction (negated lines, status=posted) AND
// flips the original to status=voided + sets reversesTransactionId on the
// reversal. Both rows stay in the ledger; nothing is ever deleted.
export const bookkeeperTransactionsTable = pgTable(
  "bk_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postedDate: date("posted_date").notNull(),
    description: text("description").notNull(),
    reference: text("reference"),
    status: text("status").notNull().default("posted"), // posted | voided
    voidedReason: text("voided_reason"),
    voidedAt: timestamp("voided_at", { withTimezone: true }),
    reversesTransactionId: uuid("reverses_transaction_id"),
    sourceSubmissionId: uuid("source_submission_id"),
    createdById: uuid("created_by_id"),
    createdByEmail: text("created_by_email").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    postedDateIdx: index("bk_transactions_posted_date_idx").on(t.postedDate),
    statusIdx: index("bk_transactions_status_idx").on(t.status),
    reversesIdx: index("bk_transactions_reverses_idx").on(
      t.reversesTransactionId,
    ),
  }),
);

// ---------- transaction_lines ----------
//
// One row per debit or credit. Always paired into a balanced set
// (sum(debit) = sum(credit) per transaction_id). Numeric(14,2) for cash.
export const bookkeeperTransactionLinesTable = pgTable(
  "bk_transaction_lines",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    transactionId: uuid("transaction_id").notNull(),
    accountCode: text("account_code").notNull(),
    costCentreCode: text("cost_centre_code"),
    memo: text("memo"),
    debit: numeric("debit", { precision: 14, scale: 2 })
      .notNull()
      .default(sql`0`),
    credit: numeric("credit", { precision: 14, scale: 2 })
      .notNull()
      .default(sql`0`),
    lineOrder: integer("line_order").notNull().default(0),
  },
  (t) => ({
    transactionIdx: index("bk_transaction_lines_transaction_idx").on(
      t.transactionId,
    ),
    accountIdx: index("bk_transaction_lines_account_idx").on(t.accountCode),
    costCentreIdx: index("bk_transaction_lines_cost_centre_idx").on(
      t.costCentreCode,
    ),
  }),
);

// ---------- submissions (food-handler queue) ----------
//
// A submission is a request to the bookkeeper to post something. status flows
// pending -> approved (links to created transaction) | rejected (with reason).
// Food handlers see only their own; bookkeeper/ops/owner see the queue.
export const bookkeeperSubmissionsTable = pgTable(
  "bk_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: text("kind").notNull(), // expense | inventory_receipt
    status: text("status").notNull().default("pending"), // pending | approved | rejected
    costCentreCode: text("cost_centre_code").notNull(),
    suggestedAccountCode: text("suggested_account_code"),
    occurredOn: date("occurred_on").notNull(),
    vendor: text("vendor").notNull(),
    amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
    description: text("description").notNull(),
    notes: text("notes"),
    // inventory-only
    itemSku: text("item_sku"),
    itemName: text("item_name"),
    quantity: numeric("quantity", { precision: 14, scale: 4 }),
    unit: text("unit"),
    // workflow
    rejectedReason: text("rejected_reason"),
    approvedTransactionId: uuid("approved_transaction_id"),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
    decidedById: uuid("decided_by_id"),
    decidedByEmail: text("decided_by_email"),
    submittedById: uuid("submitted_by_id"),
    submittedByEmail: text("submitted_by_email").notNull(),
    submittedByName: text("submitted_by_name"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    statusIdx: index("bk_submissions_status_idx").on(t.status),
    submittedByIdx: index("bk_submissions_submitted_by_idx").on(
      t.submittedById,
    ),
    costCentreIdx: index("bk_submissions_cost_centre_idx").on(t.costCentreCode),
  }),
);

// ---------- receipt_attachments ----------
export const bookkeeperReceiptAttachmentsTable = pgTable(
  "bk_receipt_attachments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    submissionId: uuid("submission_id").notNull(),
    originalFilename: text("original_filename").notNull(),
    contentType: text("content_type").notNull(),
    fileSize: integer("file_size"),
    storageRef: text("storage_ref").notNull(),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    submissionIdx: index("bk_receipt_attachments_submission_idx").on(
      t.submissionId,
    ),
  }),
);

// ---------- inventory_receipts (1:1 detail row when kind=inventory_receipt) ----------
export const bookkeeperInventoryReceiptsTable = pgTable(
  "bk_inventory_receipts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    submissionId: uuid("submission_id"),
    transactionId: uuid("transaction_id"),
    costCentreCode: text("cost_centre_code").notNull(),
    itemSku: text("item_sku"),
    itemName: text("item_name").notNull(),
    quantity: numeric("quantity", { precision: 14, scale: 4 }).notNull(),
    unit: text("unit"),
    occurredOn: date("occurred_on").notNull(),
    vendor: text("vendor"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    submissionIdx: index("bk_inventory_receipts_submission_idx").on(
      t.submissionId,
    ),
    transactionIdx: index("bk_inventory_receipts_transaction_idx").on(
      t.transactionId,
    ),
  }),
);

// ---------- audit_log ----------
//
// Owner-only feed. Every state-changing bookkeeper action writes one row:
// transaction.create, transaction.void, submission.approve, submission.reject,
// account.create, account.update, cost_centre.create, cost_centre.update,
// user.role_change, handler.nudge.
export const bookkeeperAuditLogTable = pgTable(
  "bk_audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    actorId: uuid("actor_id"),
    actorEmail: text("actor_email").notNull(),
    actorRole: text("actor_role").notNull(),
    details: jsonb("details"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    createdAtIdx: index("bk_audit_log_created_at_idx").on(t.createdAt),
    entityIdx: index("bk_audit_log_entity_idx").on(t.entityType, t.entityId),
  }),
);
