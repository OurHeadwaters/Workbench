import {
  pgTable,
  text,
  uuid,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

/**
 * river_briefings — one row per generated River Smith nightly briefing.
 *
 * status values:
 *   draft      — generated but not yet published (future use)
 *   published  — live, visible on the Kitchen Table
 *
 * triggered_by values:
 *   scheduled  — nightly cron ran automatically
 *   manual     — Bobbie pressed "Generate Now"
 *
 * email_status values:
 *   sent       — email delivered successfully via Gmail
 *   failed     — mailer attempted but Gmail returned an error
 *   skipped    — RIVER_SMITH_NOTIFY_EMAIL not set; email not attempted
 *   null       — email not yet attempted (row was just inserted)
 */
export const riverBriefingsTable = pgTable(
  "river_briefings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    generatedAt: timestamp("generated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    rawMarkdown: text("raw_markdown").notNull(),
    structuredJson: jsonb("structured_json"),
    proofOfWork: jsonb("proof_of_work"),
    status: text("status").notNull().default("published"),
    triggeredBy: text("triggered_by").notNull().default("scheduled"),
    emailStatus: text("email_status"),
  },
  (t) => ({
    generatedAtIdx: index("river_briefings_generated_at_idx").on(t.generatedAt),
    statusIdx: index("river_briefings_status_idx").on(t.status),
  }),
);

export type RiverBriefing = typeof riverBriefingsTable.$inferSelect;
export type InsertRiverBriefing = typeof riverBriefingsTable.$inferInsert;
