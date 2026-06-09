import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

/**
 * stomping_grounds_counter — single-row visit counter for the Stomping Grounds page.
 *
 * The table holds one row keyed by `slug` (currently only "total").
 * The count is incremented on each unique session visit via POST /api/stomping-grounds/count.
 */
export const stompingGroundsCounterTable = pgTable("stomping_grounds_counter", {
  slug: text("slug").primaryKey(),
  count: integer("count").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type StompingGroundsCounter = typeof stompingGroundsCounterTable.$inferSelect;
