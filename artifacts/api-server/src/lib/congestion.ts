/**
 * Congestion monitor for the project task backlog.
 *
 * When the number of unflushed PROPOSED tasks exceeds CONGESTION_THRESHOLD
 * (30), the oldest overflow tasks are automatically flushed to the Deadhead
 * intake via `ingestToDeadhead()`.  The flush runs as a fire-and-forget
 * side-effect on every task creation so the desk self-regulates in real time.
 *
 * Overflow calculation uses ONLY unflushed proposed tasks — tasks already in
 * deadhead_items are excluded from both the count and the selection.  This
 * means:
 *   - The "keep 30" guarantee applies to the unflushed working backlog.
 *   - No task is ever re-sent (idempotent by construction).
 *   - The unique index on deadhead_items.original_task_id is a secondary guard
 *     against concurrent flush races.
 */

import { db } from "@workspace/db";
import { projectTasksTable, deadheadItemsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { logger } from "./logger";
import { ingestToDeadhead } from "@workspace/db/deadheadService";

export const CONGESTION_THRESHOLD = 30;

export async function checkAndFlushCongestion(): Promise<void> {
  try {
    // Count the total proposed tasks (for logging/proposedCountBefore).
    const [totalRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(projectTasksTable)
      .where(eq(projectTasksTable.status, "proposed"));

    const proposedCount = totalRow?.count ?? 0;

    // Count UNFLUSHED proposed tasks: those not yet present in deadhead_items.
    // This is the backlog the threshold applies to.
    const [unflushedRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(projectTasksTable)
      .where(
        sql`${projectTasksTable.status} = 'proposed' AND ${projectTasksTable.id}::text NOT IN (SELECT original_task_id FROM deadhead_items)`,
      );

    const unflushedCount = unflushedRow?.count ?? 0;

    if (unflushedCount <= CONGESTION_THRESHOLD) {
      return;
    }

    const overflowCount = unflushedCount - CONGESTION_THRESHOLD;

    // Select the oldest unflushed proposed tasks to flush.
    const overflow = await db
      .select()
      .from(projectTasksTable)
      .where(
        sql`${projectTasksTable.status} = 'proposed' AND ${projectTasksTable.id}::text NOT IN (SELECT original_task_id FROM deadhead_items)`,
      )
      .orderBy(sql`${projectTasksTable.createdAt} ASC`)
      .limit(overflowCount);

    if (overflow.length === 0) return;

    await ingestToDeadhead(
      overflow.map((t) => ({
        id: t.id,
        title: t.title,
        createdAt: t.createdAt,
        source: t.source,
        sourceRef: t.sourceRef,
      })),
      proposedCount,
    );

    logger.info(
      {
        flushed: overflow.length,
        unflushedCountBefore: unflushedCount,
        proposedCountBefore: proposedCount,
        threshold: CONGESTION_THRESHOLD,
      },
      `Deadhead flush: sent ${overflow.length} task(s) to intake (${unflushedCount} unflushed, ${proposedCount} total proposed)`,
    );
  } catch (err) {
    logger.error({ err }, "checkAndFlushCongestion failed");
  }
}
