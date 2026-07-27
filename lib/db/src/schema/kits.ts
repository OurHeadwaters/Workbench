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
    // Stamped when the delivery email is successfully sent.  NULL means the
    // token was committed but the email has not been confirmed sent — the
    // startup recovery sweep uses this to re-send without creating a
    // duplicate token.
    emailSentAt: timestamp("email_sent_at", { withTimezone: true }),
  },
  (t) => ({
    buyerEmailIdx: index("kit_tokens_buyer_email_idx").on(t.buyerEmail),
    expiresAtIdx: index("kit_tokens_expires_at_idx").on(t.expiresAt),
    kitIdIdx: index("kit_tokens_kit_id_idx").on(t.kitId),
  }),
);

export const stripeProcessedEventsTable = pgTable("stripe_processed_events", {
  eventId: text("event_id").primaryKey(),
  processedAt: timestamp("processed_at", { withTimezone: true }).notNull().defaultNow(),
  purchaseId: text("purchase_id").notNull(),
});

// Audit trail of every failed kit delivery email.  A row is written whenever
// sendKitDeliveryEmail returns status:"failed", in addition to the one-shot
// alert email.  resolvedAt is set (manually or via a future retry queue) once
// the buyer has been reached.
export const kitDeliveryFailuresTable = pgTable(
  "kit_delivery_failures",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    buyerEmail: text("buyer_email").notNull(),
    kitId: text("kit_id").notNull(),
    purchaseId: text("purchase_id").notNull(),
    error: text("error"),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    purchaseIdIdx: index("kit_delivery_failures_purchase_id_idx").on(t.purchaseId),
    resolvedAtIdx: index("kit_delivery_failures_resolved_at_idx").on(t.resolvedAt),
    buyerEmailIdx: index("kit_delivery_failures_buyer_email_idx").on(t.buyerEmail),
  }),
);

// Tracks how many times a checkout.session.completed webhook has been
// attempted but failed (token INSERT error → unclaim → Stripe retry).
// Used to detect when Stripe has exhausted all retries so the founder
// can be alerted before the event is silently abandoned.
export const kitWebhookAttemptsTable = pgTable("kit_webhook_attempts", {
  eventId: text("event_id").primaryKey(),
  kitId: text("kit_id").notNull(),
  buyerEmail: text("buyer_email").notNull(),
  purchaseId: text("purchase_id").notNull(),
  attemptCount: integer("attempt_count").notNull().default(1),
  lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
},
(t) => ({
  resolvedAtIdx: index("kit_webhook_attempts_resolved_at_idx").on(t.resolvedAt),
}));

export type KitRow = typeof kitsTable.$inferSelect;
export type KitInsert = typeof kitsTable.$inferInsert;
export type PractitionerApplicationRow = typeof practitionerApplicationsTable.$inferSelect;
export type PractitionerApplicationInsert = typeof practitionerApplicationsTable.$inferInsert;
export type KitTokenRow = typeof kitTokensTable.$inferSelect;
export type KitTokenInsert = typeof kitTokensTable.$inferInsert;
export type StripeProcessedEventRow = typeof stripeProcessedEventsTable.$inferSelect;
export type StripeProcessedEventInsert = typeof stripeProcessedEventsTable.$inferInsert;
export type KitDeliveryFailureRow = typeof kitDeliveryFailuresTable.$inferSelect;
export type KitDeliveryFailureInsert = typeof kitDeliveryFailuresTable.$inferInsert;
export type KitWebhookAttemptRow = typeof kitWebhookAttemptsTable.$inferSelect;
export type KitWebhookAttemptInsert = typeof kitWebhookAttemptsTable.$inferInsert;

// Server-side progress for kit buyers.  Keyed by purchase_id so progress
// survives token re-issues (same buyer, new access link → same record).
export const kitProgressTable = pgTable(
  "kit_progress",
  {
    purchaseId: text("purchase_id").primaryKey(),
    visitedModules: text("visited_modules").array().notNull().default([]),
    visitedHandouts: text("visited_handouts").array().notNull().default([]),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
);

export type KitProgressRow = typeof kitProgressTable.$inferSelect;
export type KitProgressInsert = typeof kitProgressTable.$inferInsert;
