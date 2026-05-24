import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * app_settings — simple key/value store for owner-managed configuration.
 *
 * Rows are upserted by key; the value column is plain text.
 *
 * Known keys:
 *   river_smith_notify_email  — delivery address for nightly River Smith briefings
 */
export const appSettingsTable = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type AppSetting = typeof appSettingsTable.$inferSelect;
