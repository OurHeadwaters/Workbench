import { pgTable, text, integer, bigint } from "drizzle-orm/pg-core";

/**
 * Persistent rate-limit store.
 *
 * Each row is keyed by an arbitrary string (e.g. "codetry-inquiry:10.2.0.1")
 * and tracks the hit count plus the timestamp (ms since epoch) at which the
 * current window expires.  A single atomic UPSERT is used so there are no
 * read-modify-write races, and the table survives server restarts.
 */
export const rateLimitsTable = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(1),
  resetAt: bigint("reset_at", { mode: "number" }).notNull(),
});
