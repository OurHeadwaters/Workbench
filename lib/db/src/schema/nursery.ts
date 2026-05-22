import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  index,
  jsonb,
} from "drizzle-orm/pg-core";

// ---------- nursery_producers ----------
// Zone 4 producer accounts. Name + passphrase (scrypt). No email.
// isSteward is set by invite flag at join time; first producer becomes steward (bootstrap).
export const nurseryProducersTable = pgTable(
  "nursery_producers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    passphraseHash: text("passphrase_hash").notNull(),
    isSteward: boolean("is_steward").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    nameIdx: index("nursery_producers_name_idx").on(t.name),
  }),
);

// ---------- nursery_sessions ----------
// DB-backed 30-day Bearer tokens for producer auth.
export const nurserySessionsTable = pgTable(
  "nursery_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    producerId: uuid("producer_id")
      .notNull()
      .references(() => nurseryProducersTable.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    tokenIdx: index("nursery_sessions_token_idx").on(t.token),
    producerIdx: index("nursery_sessions_producer_id_idx").on(t.producerId),
  }),
);

// ---------- nursery_invites ----------
// Single-use invite codes that gate new producer creation.
// isStewardInvite=true makes the joining producer a steward.
// First producer (bootstrap) does not need a code.
export const nurseryInvitesTable = pgTable(
  "nursery_invites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull().unique(),
    note: text("note").notNull().default(""),
    isStewardInvite: boolean("is_steward_invite").notNull().default(false),
    createdByProducerId: uuid("created_by_producer_id")
      .notNull()
      .references(() => nurseryProducersTable.id),
    usedByProducerId: uuid("used_by_producer_id").references(() => nurseryProducersTable.id),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    codeIdx: index("nursery_invites_code_idx").on(t.code),
    createdByIdx: index("nursery_invites_created_by_idx").on(t.createdByProducerId),
  }),
);

// ---------- nursery_ideas ----------
// The core entity. Stage lifecycle: nursery → fodder ↔ fallow → graduated.
// stageHistory is a JSONB array of { stage, movedAt, movedBy, note }.
// isDraft=true = producer-submitted problem statement awaiting steward review.
export const nurseryIdeasTable = pgTable(
  "nursery_ideas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    vernacularName: text("vernacular_name").notNull().default(""),
    massityName: text("massity_name").notNull().default(""),
    problemStatement: text("problem_statement").notNull().default(""),
    stage: text("stage").notNull().default("nursery"),
    stageHistory: jsonb("stage_history").notNull().default("[]"),
    stewardNotes: text("steward_notes").notNull().default(""),
    isDraft: boolean("is_draft").notNull().default(false),
    graduationReason: text("graduation_reason"),
    createdByProducerId: uuid("created_by_producer_id")
      .notNull()
      .references(() => nurseryProducersTable.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    stageIdx: index("nursery_ideas_stage_idx").on(t.stage),
    createdByIdx: index("nursery_ideas_created_by_idx").on(t.createdByProducerId),
    createdAtIdx: index("nursery_ideas_created_at_idx").on(t.createdAt),
  }),
);

// ---------- nursery_comments ----------
// Thread on an idea. Any authenticated producer can comment.
export const nurseryCommentsTable = pgTable(
  "nursery_comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ideaId: uuid("idea_id")
      .notNull()
      .references(() => nurseryIdeasTable.id, { onDelete: "cascade" }),
    producerId: uuid("producer_id")
      .notNull()
      .references(() => nurseryProducersTable.id),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    ideaIdx: index("nursery_comments_idea_id_idx").on(t.ideaId),
    producerIdx: index("nursery_comments_producer_id_idx").on(t.producerId),
  }),
);
