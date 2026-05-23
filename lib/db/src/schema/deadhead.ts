import {
  pgTable,
  text,
  uuid,
  timestamp,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * project_tasks — lightweight task store used by the congestion monitor.
 *
 * Tasks are created via POST /api/tasks.  When the PROPOSED count
 * exceeds the threshold (30) the oldest overflow items are flushed to
 * the Deadhead intake automatically.
 *
 * status values (enforced at app layer):
 *   proposed  — newly created, in the working backlog
 *   accepted  — confirmed and being worked
 *   smashed   — discarded after vetting
 *   done      — completed
 */
export const projectTasksTable = pgTable(
  "project_tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    status: text("status").notNull().default("proposed"),
    /**
     * Source artifact id (e.g. `artifacts/north-star`) the task was dropped
     * from. Optional on this table — only items dropped via the
     * "put it on the kitchen table" helper carry it. Existing rows are
     * NULL and surface as "unknown" in admin views.
     */
    source: text("source"),
    sourceRef: text("source_ref"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    statusIdx: index("project_tasks_status_idx").on(t.status),
    createdAtIdx: index("project_tasks_created_at_idx").on(t.createdAt),
    sourceIdx: index("project_tasks_source_idx").on(t.source),
  }),
);

/**
 * deadhead_items — tasks that were automatically flushed out of the
 * working backlog when the PROPOSED count exceeded the threshold.
 *
 * `original_task_id` has a unique index so that concurrent flush
 * operations cannot insert duplicate rows for the same source task.
 * The insert uses ON CONFLICT DO NOTHING for safe idempotency.
 *
 * status values: new | reviewed | smashed
 */
export const deadheadItemsTable = pgTable(
  "deadhead_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    originalTaskId: text("original_task_id").notNull(),
    title: text("title").notNull(),
    originalCreatedAt: timestamp("original_created_at", {
      withTimezone: true,
    }).notNull(),
    status: text("status").notNull().default("new"),
    /**
     * Source artifact id (e.g. `artifacts/north-star`) the item came from.
     * Backfilled to 'unknown' for rows that pre-date the kitchen-table
     * protocol. Always non-null going forward.
     */
    source: text("source").notNull().default("unknown"),
    sourceRef: text("source_ref"),
    flushedAt: timestamp("flushed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    flushBatchId: uuid("flush_batch_id").notNull(),
  },
  (t) => ({
    originalTaskIdUniqueIdx: uniqueIndex("deadhead_items_original_task_id_unique").on(
      t.originalTaskId,
    ),
    statusIdx: index("deadhead_items_status_idx").on(t.status),
    flushedAtIdx: index("deadhead_items_flushed_at_idx").on(t.flushedAt),
    batchIdx: index("deadhead_items_batch_idx").on(t.flushBatchId),
    sourceIdx: index("deadhead_items_source_idx").on(t.source),
  }),
);

/**
 * deadhead_flush_log — one row per flush event so operators can see
 * when the desk self-regulated and how many tasks were sent.
 */
export const deadheadFlushLogTable = pgTable(
  "deadhead_flush_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    flushedAt: timestamp("flushed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    count: integer("count").notNull(),
    proposedCountBefore: integer("proposed_count_before").notNull(),
    flushBatchId: uuid("flush_batch_id").notNull(),
  },
  (t) => ({
    flushedAtIdx: index("deadhead_flush_log_flushed_at_idx").on(t.flushedAt),
  }),
);

export type ProjectTask = typeof projectTasksTable.$inferSelect;
export type InsertProjectTask = typeof projectTasksTable.$inferInsert;
export type DeadheadItem = typeof deadheadItemsTable.$inferSelect;
export type InsertDeadheadItem = typeof deadheadItemsTable.$inferInsert;
export type DeadheadFlushLog = typeof deadheadFlushLogTable.$inferSelect;
