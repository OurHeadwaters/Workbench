import {
  pgTable,
  text,
  uuid,
  timestamp,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const kitsTable = pgTable(
  "kits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: text("owner_id").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    priceCents: integer("price_cents").notNull().default(0),
    contentOutline: jsonb("content_outline").$type<Record<string, unknown>>(),
    codetryResult: jsonb("codetry_result").$type<{
      passed: boolean;
      flags: Array<{ category: string; flag: string; reason: string }>;
      checkedAt: string;
    }>(),
    paymentRails: jsonb("payment_rails")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    stripeProductId: text("stripe_product_id"),
    stripePriceId: text("stripe_price_id"),
    stripeAccountId: text("stripe_account_id"),
    stripeCheckoutUrl: text("stripe_checkout_url"),
    status: text("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    ownerIdx: index("kits_owner_id_idx").on(t.ownerId),
    statusIdx: index("kits_status_idx").on(t.status),
  }),
);

export const practitionerApplicationsTable = pgTable(
  "practitioner_applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    community: text("community").notNull(),
    doctrineSummary: text("doctrine_summary").notNull(),
    contactEmail: text("contact_email").notNull(),
    status: text("status").notNull().default("pending"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewNote: text("review_note"),
    stripeAccountId: text("stripe_account_id"),
    clerkUserId: text("clerk_user_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    statusIdx: index("practitioner_applications_status_idx").on(t.status),
    emailIdx: index("practitioner_applications_email_idx").on(t.contactEmail),
  }),
);

export const kitTokensTable = pgTable(
  "kit_tokens",
  {
    token: text("token").primaryKey(),
    kitId: text("kit_id").notNull(),
    buyerEmail: text("buyer_email").notNull(),
    buyerName: text("buyer_name").notNull(),
    purchaseId: text("purchase_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => ({
    buyerEmailIdx: index("kit_tokens_buyer_email_idx").on(t.buyerEmail),
    expiresAtIdx: index("kit_tokens_expires_at_idx").on(t.expiresAt),
    kitIdIdx: index("kit_tokens_kit_id_idx").on(t.kitId),
  }),
);

export type KitRow = typeof kitsTable.$inferSelect;
export type KitInsert = typeof kitsTable.$inferInsert;
export type PractitionerApplicationRow = typeof practitionerApplicationsTable.$inferSelect;
export type PractitionerApplicationInsert = typeof practitionerApplicationsTable.$inferInsert;
export type KitTokenRow = typeof kitTokensTable.$inferSelect;
export type KitTokenInsert = typeof kitTokensTable.$inferInsert;
