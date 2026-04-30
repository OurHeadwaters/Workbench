import {
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";

/**
 * codetry-ship manifest sign-on table.
 *
 * Public form on `/codetry-ship/` writes one row per email (upsert by email).
 * Operator dashboard reads the table back out, grouped newest-first.
 *
 * Email is the natural key — re-signing with the same address overwrites
 * the previous payload (and bumps `updatedAt`) instead of creating
 * duplicate manifest rows.  `notificationStatus` records whether the
 * operator-notification email actually went out (best-effort; the row is
 * always saved even if Resend fails).
 */
export const shipManifestTable = pgTable(
  "ship_manifest",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    org: text("org"),
    role: text("role"),
    wouldBring: text("would_bring"),
    wouldWant: text("would_want"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    // Notification = operator email; reply = warm signer auto-reply.
    // Possible values: "sent", "failed", "skipped" (no key configured).
    notificationStatus: text("notification_status"),
    replyStatus: text("reply_status"),
    notificationError: text("notification_error"),
    replyError: text("reply_error"),
    sourceIp: text("source_ip"),
    userAgent: text("user_agent"),
  },
  (table) => ({
    createdAtIdx: index("ship_manifest_created_at_idx").on(table.createdAt),
  }),
);

export type ShipManifestEntry = typeof shipManifestTable.$inferSelect;
export type InsertShipManifestEntry = typeof shipManifestTable.$inferInsert;
