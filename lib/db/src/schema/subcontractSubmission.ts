import {
  pgTable,
  text,
  timestamp,
  uuid,
  numeric,
  index,
} from "drizzle-orm/pg-core";

export const subcontractSubmissionTable = pgTable(
  "subcontract_submission",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    project: text("project").notNull(),
    submittedBy: text("submitted_by").notNull(),
    workDate: text("work_date").notNull(),
    scopeItem: text("scope_item").notNull(),
    description: text("description").notNull(),
    hours: numeric("hours", { precision: 6, scale: 2 }),
    ratePerHour: numeric("rate_per_hour", { precision: 8, scale: 2 }),
    expenseDescription: text("expense_description"),
    expenseAmount: numeric("expense_amount", { precision: 10, scale: 2 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    projectIdx: index("subcontract_submission_project_idx").on(table.project),
    createdAtIdx: index("subcontract_submission_created_at_idx").on(table.createdAt),
  }),
);

export type SubcontractSubmissionRow = typeof subcontractSubmissionTable.$inferSelect;
export type InsertSubcontractSubmissionRow = typeof subcontractSubmissionTable.$inferInsert;
