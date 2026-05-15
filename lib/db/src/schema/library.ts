import {
  pgTable,
  text,
  uuid,
  timestamp,
  integer,
  jsonb,
  primaryKey,
  index,
  uniqueIndex,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const curatorsTable = pgTable("curators", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash"),
  isOwner: boolean("is_owner").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
});

export const curatorSessionsTable = pgTable(
  "curator_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    curatorId: uuid("curator_id")
      .notNull()
      .references(() => curatorsTable.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => ({
    tokenIdx: uniqueIndex("curator_sessions_token_idx").on(t.token),
    curatorIdx: index("curator_sessions_curator_idx").on(t.curatorId),
  }),
);

export const subjectsTable = pgTable("subjects", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const projectBucketsTable = pgTable("project_buckets", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const producersTable = pgTable("producers", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  kind: text("kind"),
  description: text("description"),
  websiteUrl: text("website_url"),
  screenshotUrl: text("screenshot_url"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  location: text("location"),
  statusFlag: text("status_flag"),
  statusNotes: text("status_notes"),
  substituteForProducerSlug: text("substitute_for_producer_slug"),
  createdByCuratorId: uuid("created_by_curator_id").references(
    () => curatorsTable.id,
    { onDelete: "set null" },
  ),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const contributorsTable = pgTable("contributors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  organization: text("organization"),
  email: text("email"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const libraryEntriesTable = pgTable(
  "library_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: text("kind").notNull(),
    title: text("title").notNull(),
    summary: text("summary"),
    notes: text("notes"),
    status: text("status").notNull().default("published"),
    sourceUrl: text("source_url"),
    screenshotUrl: text("screenshot_url"),
    screenshotObjectPath: text("screenshot_object_path"),
    storageRef: text("storage_ref"),
    contentHash: text("content_hash"),
    fileSize: integer("file_size"),
    contentType: text("content_type"),
    originalFilename: text("original_filename"),
    fileType: text("file_type"),
    contactInfo: jsonb("contact_info"),
    prices: jsonb("prices"),
    dates: jsonb("dates"),
    geography: jsonb("geography"),
    statusFlag: text("status_flag"),
    producerId: uuid("producer_id").references(() => producersTable.id, {
      onDelete: "set null",
    }),
    contributorId: uuid("contributor_id").references(
      () => contributorsTable.id,
      { onDelete: "set null" },
    ),
    createdByCuratorId: uuid("created_by_curator_id").references(
      () => curatorsTable.id,
      { onDelete: "set null" },
    ),
    updatedByCuratorId: uuid("updated_by_curator_id").references(
      () => curatorsTable.id,
      { onDelete: "set null" },
    ),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    contentHashIdx: uniqueIndex("library_entries_content_hash_idx")
      .on(t.contentHash)
      .where(sql`${t.contentHash} IS NOT NULL`),
    statusIdx: index("library_entries_status_idx").on(t.status),
    kindIdx: index("library_entries_kind_idx").on(t.kind),
    createdAtIdx: index("library_entries_created_at_idx").on(t.createdAt),
  }),
);

export const entrySubjectsTable = pgTable(
  "entry_subjects",
  {
    entryId: uuid("entry_id")
      .notNull()
      .references(() => libraryEntriesTable.id, { onDelete: "cascade" }),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjectsTable.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.entryId, t.subjectId] }),
    subjectIdx: index("entry_subjects_subject_idx").on(t.subjectId),
  }),
);

export const entryBucketsTable = pgTable(
  "entry_buckets",
  {
    entryId: uuid("entry_id")
      .notNull()
      .references(() => libraryEntriesTable.id, { onDelete: "cascade" }),
    bucketId: uuid("bucket_id")
      .notNull()
      .references(() => projectBucketsTable.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.entryId, t.bucketId] }),
    bucketIdx: index("entry_buckets_bucket_idx").on(t.bucketId),
  }),
);

export const shareLinksTable = pgTable("share_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  token: text("token").notNull().unique(),
  label: text("label"),
  contributorId: uuid("contributor_id")
    .notNull()
    .references(() => contributorsTable.id, { onDelete: "cascade" }),
  presetSubjectSlugs: jsonb("preset_subject_slugs")
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  presetBucketSlugs: jsonb("preset_bucket_slugs")
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdByCuratorId: uuid("created_by_curator_id").references(
    () => curatorsTable.id,
    { onDelete: "set null" },
  ),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type LibraryEntryRow = typeof libraryEntriesTable.$inferSelect;
export type ProducerRow = typeof producersTable.$inferSelect;
export type SubjectRow = typeof subjectsTable.$inferSelect;
export type ProjectBucketRow = typeof projectBucketsTable.$inferSelect;
export type ContributorRow = typeof contributorsTable.$inferSelect;
export type ShareLinkRow = typeof shareLinksTable.$inferSelect;
export type CuratorRow = typeof curatorsTable.$inferSelect;
export type CuratorSessionRow = typeof curatorSessionsTable.$inferSelect;
