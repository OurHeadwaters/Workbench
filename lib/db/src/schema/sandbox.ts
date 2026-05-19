import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";

// ---------- sandbox_households ----------
// Invite-only village board accounts. No email required.
// Passphrase is scrypt-hashed (salt:hash format, same as ownerAuth pattern).
export const sandboxHouseholdsTable = pgTable(
  "sandbox_households",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    passphraseHash: text("passphrase_hash").notNull(),
    isOrganizer: boolean("is_organizer").notNull().default(false),
    // gatherRoundParticipated: set to current prompt id when household responds
    gatherRoundParticipated: text("gather_round_participated"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    nameIdx: index("sandbox_households_name_idx").on(t.name),
  }),
);

// ---------- sandbox_sessions ----------
// DB-backed session tokens for household auth.
export const sandboxSessionsTable = pgTable(
  "sandbox_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    householdId: uuid("household_id").notNull().references(() => sandboxHouseholdsTable.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    tokenIdx: index("sandbox_sessions_token_idx").on(t.token),
    householdIdx: index("sandbox_sessions_household_id_idx").on(t.householdId),
  }),
);

// ---------- sandbox_invites ----------
// Organizer-issued one-time invite codes that gate new household creation.
// The first household (bootstrapping) does NOT need an invite code.
export const sandboxInvitesTable = pgTable(
  "sandbox_invites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull().unique(),
    note: text("note").notNull().default(""),
    createdByHouseholdId: uuid("created_by_household_id")
      .notNull()
      .references(() => sandboxHouseholdsTable.id),
    usedByHouseholdId: uuid("used_by_household_id")
      .references(() => sandboxHouseholdsTable.id),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    codeIdx: index("sandbox_invites_code_idx").on(t.code),
    createdByIdx: index("sandbox_invites_created_by_idx").on(t.createdByHouseholdId),
  }),
);

// ---------- sandbox_buckets ----------
// Named post categories. Organizer can create/rename.
// Built-in slugs: general, resources, questions, heads_up, gather_round
export const sandboxBucketsTable = pgTable(
  "sandbox_buckets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    label: text("label").notNull(),
    isBuiltIn: boolean("is_built_in").notNull().default(false),
    // heads_up and gather_round are special buckets with extra behaviour
    isHeadsUp: boolean("is_heads_up").notNull().default(false),
    isGatherRound: boolean("is_gather_round").notNull().default(false),
    sortOrder: text("sort_order").notNull().default("0"),
    // promptText: organizer-managed monthly prompt (used by gather_round bucket)
    promptText: text("prompt_text"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
);

// ---------- sandbox_posts ----------
// General board posts. Also used for Heads Up and Gather Round posts (bucketId links them).
export const sandboxPostsTable = pgTable(
  "sandbox_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    householdId: uuid("household_id").notNull().references(() => sandboxHouseholdsTable.id),
    bucketId: uuid("bucket_id").notNull().references(() => sandboxBucketsTable.id),
    body: text("body").notNull(),
    // expiresAt: set for Heads Up posts (72h), null for regular posts
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    householdIdx: index("sandbox_posts_household_id_idx").on(t.householdId),
    bucketIdx: index("sandbox_posts_bucket_id_idx").on(t.bucketId),
    createdAtIdx: index("sandbox_posts_created_at_idx").on(t.createdAt),
  }),
);

// ---------- sandbox_community_roles ----------
// Neighbourhood standby roles: who has the first-aid kit, working vehicle, shelter, etc.
// Assigned by organizer; household consent gates public visibility.
export const sandboxCommunityRolesTable = pgTable(
  "sandbox_community_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roleName: text("role_name").notNull(),
    description: text("description").notNull().default(""),
    householdId: uuid("household_id").references(() => sandboxHouseholdsTable.id),
    // isPublic: household has consented to showing this in the reference card
    isPublic: boolean("is_public").notNull().default(false),
    assignedByOrganizer: boolean("assigned_by_organizer").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    householdIdx: index("sandbox_community_roles_household_id_idx").on(t.householdId),
  }),
);

// ---------- sandbox_standby_events ----------
// Organizer-declared standby events. One active event at a time.
export const sandboxStandbyEventsTable = pgTable(
  "sandbox_standby_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    declaredByHouseholdId: uuid("declared_by_household_id").notNull().references(() => sandboxHouseholdsTable.id),
    // isActive: true while event is in progress; organizer ends it
    isActive: boolean("is_active").notNull().default(true),
    declaredAt: timestamp("declared_at", { withTimezone: true }).notNull().defaultNow(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
  },
  (t) => ({
    activeIdx: index("sandbox_standby_events_active_idx").on(t.isActive),
  }),
);

// ---------- sandbox_checkins ----------
// Household check-in during an active standby event.
export const sandboxCheckinsTable = pgTable(
  "sandbox_checkins",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id").notNull().references(() => sandboxStandbyEventsTable.id),
    householdId: uuid("household_id").notNull().references(() => sandboxHouseholdsTable.id),
    checkedInAt: timestamp("checked_in_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    eventHouseholdIdx: index("sandbox_checkins_event_household_idx").on(t.eventId, t.householdId),
  }),
);
