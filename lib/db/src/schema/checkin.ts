import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const financialSnapshotsTable = pgTable("financial_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  year: integer("year").notNull(),
  takenAt: timestamp("taken_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  watershedArr: integer("watershed_arr").notNull(),
  ownerTakeHome: integer("owner_take_home").notNull(),
  portfolioValue: integer("portfolio_value").notNull(),
  xrpBalance: integer("xrp_balance").notNull(),
  xrpPriceUsd: numeric("xrp_price_usd", { precision: 12, scale: 4 }).notNull(),
  annualLivingExpenses: integer("annual_living_expenses").notNull(),
  notes: text("notes"),
});

export type FinancialSnapshot = typeof financialSnapshotsTable.$inferSelect;
export type InsertFinancialSnapshot =
  typeof financialSnapshotsTable.$inferInsert;
