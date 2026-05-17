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
export const hhBandsTable = pgTable("hh_bands", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  communityTokenCode: text("community_token_code").notNull().default("HWBAND"),
  communityTokenIssuer: text("community_token_issuer"),
  defaultPayCurrency: text("default_pay_currency").notNull().default("token"),
  missedShiftThreshold: integer("missed_shift_threshold").notNull().default(3),
  // Reliability bonus — awarded when a member hits a completedShiftCount milestone
  reliabilityBonusThreshold: integer("reliability_bonus_threshold").notNull().default(10),
  reliabilityBonusAmount: numeric("reliability_bonus_amount", { precision: 18, scale: 6 }).notNull().default("5"),
  reliabilityBonusCurrency: text("reliability_bonus_currency").notNull().default("token"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- hh_members ----------
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
    completedShiftCount: integer("completed_shift_count").notNull().default(0),
    missedShiftCount: integer("missed_shift_count").notNull().default(0),
    noShowCount: integer("no_show_count").notNull().default(0),
    flaggedForDemotion: boolean("flagged_for_demotion").notNull().default(false),
    totalEarnedXrp: numeric("total_earned_xrp", { precision: 18, scale: 6 }).notNull().default("0"),
    totalEarnedToken: numeric("total_earned_token", { precision: 18, scale: 6 }).notNull().default("0"),
    // ── Wallet architecture ──────────────────────────────────────────────────
    // walletType: custodial (platform holds keys, lower friction, Zone 2/3) or
    // self_custody (member holds keys, full sovereignty, Zone 4/5).
    // Both paths are supported in the data model from day one; V1 UI exposes
    // custodial only — migration to self_custody is a user-initiated action.
    walletType: text("wallet_type").notNull().default("custodial"),
    // walletRevealedAt: null until the user has their first real transaction
    // (tip sent/received, or first earn confirmed). Progressive reveal —
    // the wallet exists silently from signup but users only "meet" it when
    // motivation is highest: at the moment of first real value exchange.
    walletRevealedAt: timestamp("wallet_revealed_at", { withTimezone: true }),
    // referralCode: unique short code the member can share.
    // Auto-generated on member creation.
    referralCode: text("referral_code").unique(),
    // referredByMemberId: set when member joined via a referral link
    referredByMemberId: uuid("referred_by_member_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    bandIdx: index("hh_members_band_id_idx").on(t.bandId),
    clerkIdx: index("hh_members_clerk_user_id_idx").on(t.clerkUserId),
    referralCodeIdx: index("hh_members_referral_code_idx").on(t.referralCode),
  }),
);

// ---------- hh_tasks ----------
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
export const hhEarningsTable = pgTable(
  "hh_earnings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bandId: uuid("band_id").notNull().references(() => hhBandsTable.id),
    memberId: uuid("member_id").notNull().references(() => hhMembersTable.id),
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

// ---------- hh_bonuses ----------
// Reliability bonus payments awarded when a member hits a completedShiftCount
// milestone (every reliabilityBonusThreshold confirmed tasks). Separate from
// task earnings so the immutable earnings log stays task-scoped.
export const hhBonusesTable = pgTable(
  "hh_bonuses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bandId: uuid("band_id").notNull().references(() => hhBandsTable.id),
    memberId: uuid("member_id").notNull().references(() => hhMembersTable.id),
    amount: numeric("amount", { precision: 18, scale: 6 }).notNull(),
    currency: text("currency").notNull(),
    reason: text("reason").notNull(),
    milestone: integer("milestone").notNull(),
    awardedAt: timestamp("awarded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    memberIdx: index("hh_bonuses_member_id_idx").on(t.memberId),
    bandIdx: index("hh_bonuses_band_id_idx").on(t.bandId),
  }),
);

// ---------- hh_merchants ----------
// Reserve stores and service providers that accept community tokens at POS.
// Registered by a band admin; merchantWallet is the XRPL address payments flow to.
export const hhMerchantsTable = pgTable(
  "hh_merchants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bandId: uuid("band_id").notNull().references(() => hhBandsTable.id),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    // category: grocery | fuel | pharmacy | school | general
    category: text("category").notNull().default("general"),
    merchantWallet: text("merchant_wallet").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    bandIdx: index("hh_merchants_band_id_idx").on(t.bandId),
  }),
);

// ---------- hh_envelopes ----------
// Named budget buckets a member creates from their token/XRP balance.
// Each envelope has a monthly budget and a running spent-this-month counter.
export const hhEnvelopesTable = pgTable(
  "hh_envelopes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    memberId: uuid("member_id").notNull().references(() => hhMembersTable.id),
    bandId: uuid("band_id").notNull().references(() => hhBandsTable.id),
    // label: free-form name (e.g. "Groceries", "Fuel", "School supplies")
    label: text("label").notNull(),
    // icon hint stored as a text key (e.g. "shopping-cart", "fuel", "book")
    icon: text("icon").notNull().default("wallet"),
    currency: text("currency").notNull().default("token"),
    // monthly budget target set by the member
    monthlyBudget: numeric("monthly_budget", { precision: 18, scale: 6 }).notNull().default("0"),
    // running total spent in the current calendar month — reset on the 1st
    spentThisMonth: numeric("spent_this_month", { precision: 18, scale: 6 }).notNull().default("0"),
    // month this spent counter belongs to, e.g. "2026-05"
    spentMonth: text("spent_month").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    memberIdx: index("hh_envelopes_member_id_idx").on(t.memberId),
    bandIdx: index("hh_envelopes_band_id_idx").on(t.bandId),
  }),
);

// ---------- hh_envelope_transactions ----------
// Immutable spend log — one row per checkout event.
// V1: XRPL payment is simulated (same pattern as task escrow).
export const hhEnvelopeTransactionsTable = pgTable(
  "hh_envelope_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    envelopeId: uuid("envelope_id").notNull().references(() => hhEnvelopesTable.id),
    memberId: uuid("member_id").notNull().references(() => hhMembersTable.id),
    merchantId: uuid("merchant_id").notNull().references(() => hhMerchantsTable.id),
    bandId: uuid("band_id").notNull().references(() => hhBandsTable.id),
    amount: numeric("amount", { precision: 18, scale: 6 }).notNull(),
    currency: text("currency").notNull(),
    note: text("note").notNull().default(""),
    xrplTxHash: text("xrpl_tx_hash"),
    spentAt: timestamp("spent_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    envelopeIdx: index("hh_env_txn_envelope_id_idx").on(t.envelopeId),
    memberIdx: index("hh_env_txn_member_id_idx").on(t.memberId),
    bandIdx: index("hh_env_txn_band_id_idx").on(t.bandId),
  }),
);

// ---------- hh_tips ----------
// P2P tip transactions — community members tipping each other for
// information, knowledge, and practical help shared. This is the primary
// P2P value exchange vector and the moment the wallet "becomes real" for
// most users. V1: XRPL payment simulated; schema ready for on-chain.
export const hhTipsTable = pgTable(
  "hh_tips",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bandId: uuid("band_id").notNull().references(() => hhBandsTable.id),
    fromMemberId: uuid("from_member_id").notNull().references(() => hhMembersTable.id),
    toMemberId: uuid("to_member_id").notNull().references(() => hhMembersTable.id),
    amount: numeric("amount", { precision: 18, scale: 6 }).notNull(),
    // token = community credit; xrp = on-chain
    currency: text("currency").notNull().default("token"),
    // Plain-language context: "for the bannock recipe", "for freight advice"
    note: text("note").notNull().default(""),
    xrplTxHash: text("xrpl_tx_hash"),
    sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    fromIdx: index("hh_tips_from_member_id_idx").on(t.fromMemberId),
    toIdx: index("hh_tips_to_member_id_idx").on(t.toMemberId),
    bandIdx: index("hh_tips_band_id_idx").on(t.bandId),
  }),
);

// ---------- hh_referrals ----------
// Zone-based referral tracking. When a new member joins via a referral link
// both the referrer and the new member receive a bonus credit. This is the
// zone 2/3 adoption lever — visible reward before any effort is asked.
export const hhReferralsTable = pgTable(
  "hh_referrals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bandId: uuid("band_id").notNull().references(() => hhBandsTable.id),
    referrerId: uuid("referrer_id").notNull().references(() => hhMembersTable.id),
    referredMemberId: uuid("referred_member_id").notNull().unique().references(() => hhMembersTable.id),
    referrerBonusAmount: numeric("referrer_bonus_amount", { precision: 18, scale: 6 }).notNull().default("5"),
    referredBonusAmount: numeric("referred_bonus_amount", { precision: 18, scale: 6 }).notNull().default("5"),
    currency: text("currency").notNull().default("token"),
    awardedAt: timestamp("awarded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    referrerIdx: index("hh_referrals_referrer_id_idx").on(t.referrerId),
    bandIdx: index("hh_referrals_band_id_idx").on(t.bandId),
  }),
);
