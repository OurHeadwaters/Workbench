/**
 * One-time backlog flush script
 *
 * Sends overflow PROPOSED tasks through the same `ingestToDeadhead()` service
 * used by the live congestion monitor.  The behaviour and logging are
 * identical to a live flush — only the trigger is different (manual vs. automatic).
 *
 * Run once manually:
 *   pnpm --filter @workspace/scripts tsx src/flushDeadheadBacklog.ts
 *
 * Behaviour:
 * - Counts only UNFLUSHED proposed tasks when applying the threshold.
 * - Flushes the oldest (threshold + 1 .. N) unflushed proposed tasks.
 * - Already-flushed tasks are excluded, so running the script twice is safe.
 * - Pass --all to flush every unflushed PROPOSED task without keeping any.
 *
 * Env required: DATABASE_URL (same as the API server uses)
 */

import { db } from "@workspace/db";
import { projectTasksTable, deadheadItemsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { ingestToDeadhead } from "@workspace/db/deadheadService";

const CONGESTION_THRESHOLD = 30;
const FLUSH_ALL = process.argv.includes("--all");

async function main() {
  // Total proposed count (for the log entry).
  const [totalRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(projectTasksTable)
    .where(eq(projectTasksTable.status, "proposed"));
  const total = totalRow?.count ?? 0;
  console.log(`Found ${total} PROPOSED task(s) in total.`);

  // Unflushed proposed count (threshold applies here).
  const [unflushedRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(projectTasksTable)
    .where(
      sql`${projectTasksTable.status} = 'proposed' AND ${projectTasksTable.id}::text NOT IN (SELECT original_task_id FROM deadhead_items)`,
    );
  const unflushed = unflushedRow?.count ?? 0;
  console.log(`${unflushed} are unflushed (${total - unflushed} already in deadhead_items).`);

  const flushCount = FLUSH_ALL
    ? unflushed
    : Math.max(0, unflushed - CONGESTION_THRESHOLD);

  if (flushCount <= 0) {
    console.log(
      FLUSH_ALL
        ? "Nothing to flush — all proposed tasks are already in the intake."
        : `Nothing to flush — unflushed count (${unflushed}) is within the threshold of ${CONGESTION_THRESHOLD}.`,
    );
    process.exit(0);
  }

  console.log(
    FLUSH_ALL
      ? `Flushing all ${flushCount} unflushed task(s)…`
      : `Flushing ${flushCount} oldest unflushed task(s) beyond threshold…`,
  );

  const overflow = await db
    .select()
    .from(projectTasksTable)
    .where(
      sql`${projectTasksTable.status} = 'proposed' AND ${projectTasksTable.id}::text NOT IN (SELECT original_task_id FROM deadhead_items)`,
    )
    .orderBy(sql`${projectTasksTable.createdAt} ASC`)
    .limit(flushCount);

  if (overflow.length === 0) {
    console.log("No eligible tasks returned — nothing flushed.");
    process.exit(0);
  }

  const result = await ingestToDeadhead(
    overflow.map((t) => ({ id: t.id, title: t.title, createdAt: t.createdAt })),
    total,
  );

  console.log(
    `Done. Flushed ${result.count} task(s) to deadhead_items (batch ${result.flushBatchId}).`,
  );
  console.log(
    "Log entry written to deadhead_flush_log. View items at /deadhead/intake.",
  );

  process.exit(0);
}

main().catch((err) => {
  console.error("Flush failed:", err);
  process.exit(1);
});
