import {
  pgTable,
  text,
  uuid,
  timestamp,
  numeric,
  boolean,
  integer,
  index,
} from "drizzle-orm/pg-core";

// ---------- hh_bands ----------
// One row per reserve band. V1 is seeded with one band; new bands are
// added manually by Headwaters staff (multi-band UI is out of scope for V1).
export const hhBandsTable = pgTable("hh_bands", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  communityTokenCode: text("community_token_code").notNull().default("HWBAND"),
  communityTokenIssuer: text("community_token_issuer"),
  defaultPayCurrency: text("default_pay_currency").notNull().default("token"),
  missedShiftThreshold: integer("missed_shift_threshold").notNull().default(3),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- hh_members ----------
// Every person on the band payroll. clerkUserId links to Clerk for auth
// when the member logs in. xrplAddress is their XRPL wallet (set on first
// Xaman sign-in). didRef stores the XLS-40d DID document reference.
export const hhMembersTable = pgTable(
  "hh_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bandId: uuid("band_id").notNull().references(() => hhBandsTable.id),
    clerkUserId: text("clerk_user_id"),
    email: text("email").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    xrplAddress: text("xrpl_address"),
    didRef: text("did_ref"),
    tier: text("tier").notNull().default("task_based"),
    isActive: boolean("is_active").notNull().default(true),
    missedShiftCount: integer("missed_shift_count").notNull().default(0),
    flaggedForDemotion: boolean("flagged_for_demotion").notNull().default(false),
    totalEarnedXrp: numeric("total_earned_xrp", { precision: 18, scale: 6 }).notNull().default("0"),
    totalEarnedToken: numeric("total_earned_token", { precision: 18, scale: 6 }).notNull().default("0"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    bandIdx: index("hh_members_band_id_idx").on(t.bandId),
    clerkIdx: index("hh_members_clerk_user_id_idx").on(t.clerkUserId),
  }),
);

// ---------- hh_tasks ----------
// A task posted by a band admin. Escrow is created on XRPL at posting time
// and released when the admin confirms completion. For V1 we store the
// escrow sequence number and a status field to track the lifecycle without
// requiring a live XRPL node on every request.
export const hhTasksTable = pgTable(
  "hh_tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bandId: uuid("band_id").notNull().references(() => hhBandsTable.id),
    postedByMemberId: uuid("posted_by_member_id").notNull().references(() => hhMembersTable.id),
    claimedByMemberId: uuid("claimed_by_member_id").references(() => hhMembersTable.id),
    title: text("title").notNull(),
    description: text("description").notNull(),
    estimatedMinutes: integer("estimated_minutes").notNull().default(60),
    payAmount: numeric("pay_amount", { precision: 18, scale: 6 }).notNull(),
    payCurrency: text("pay_currency").notNull().default("token"),
    status: text("status").notNull().default("available"),
    escrowSequence: integer("escrow_sequence"),
    escrowTxHash: text("escrow_tx_hash"),
    claimedAt: timestamp("claimed_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    availableDate: text("available_date").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    bandIdx: index("hh_tasks_band_id_idx").on(t.bandId),
    statusIdx: index("hh_tasks_status_idx").on(t.status),
    dateIdx: index("hh_tasks_available_date_idx").on(t.availableDate),
  }),
);

// ---------- hh_earnings ----------
// Immutable log of each payment. Written atomically when an admin confirms a task.
// V1: XRPL tx hash is simulated. V2 will write a real EscrowFinish tx hash.
// V2: DID credential writing (member-owned portable work history) is planned
//     but not implemented in V1 — didRef stores the member's DID address only.
export const hhEarningsTable = pgTable(
  "hh_earnings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bandId: uuid("band_id").notNull().references(() => hhBandsTable.id),
    memberId: uuid("member_id").notNull().references(() => hhMembersTable.id),
    // Unique per task — enforces one earnings row per confirmed task,
    // which together with the atomic status transition prevents double-payment.
    taskId: uuid("task_id").notNull().unique().references(() => hhTasksTable.id),
    amount: numeric("amount", { precision: 18, scale: 6 }).notNull(),
    currency: text("currency").notNull(),
    xrplTxHash: text("xrpl_tx_hash"),
    earnedAt: timestamp("earned_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    memberIdx: index("hh_earnings_member_id_idx").on(t.memberId),
    bandIdx: index("hh_earnings_band_id_idx").on(t.bandId),
  }),
);
