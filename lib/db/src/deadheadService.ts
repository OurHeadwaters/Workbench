/**
 * Shared ingestion service for the Deadhead intake.
 *
 * Exported from @workspace/db so it can be imported by both the API
 * server and the scripts package without creating a cross-package
 * dependency between them.
 *
 * Both the HTTP endpoint (POST /api/deadhead/intake) and the congestion
 * monitor call `ingestToDeadhead()`.  Centralising the write here means
 * the endpoint and the monitor are always behaviourally identical.
 */

import { randomUUID } from "crypto";
import { db } from "./index.js";
import { deadheadItemsTable, deadheadFlushLogTable } from "./schema/index.js";

export interface TaskRef {
  id: string;
  title: string;
  createdAt: Date;
  source?: string | null;
  sourceRef?: string | null;
}

export interface IngestResult {
  flushBatchId: string;
  count: number;
}

/**
 * Write `items` into deadhead_items (idempotent via ON CONFLICT DO NOTHING)
 * and append a flush log row.
 *
 * Returns the batch id and the number of rows actually inserted (may be
 * less than items.length if some were already present due to a race).
 */
export async function ingestToDeadhead(
  items: TaskRef[],
  proposedCountBefore: number,
): Promise<IngestResult> {
  if (items.length === 0) {
    throw new Error("ingestToDeadhead: items must not be empty");
  }

  const flushBatchId = randomUUID();
  const now = new Date();

  const rows = items.map((t) => ({
    originalTaskId: t.id,
    title: t.title,
    originalCreatedAt: t.createdAt,
    status: "new" as const,
    source: t.source ?? "unknown",
    sourceRef: t.sourceRef ?? null,
    flushedAt: now,
    flushBatchId,
  }));

  // ON CONFLICT DO NOTHING: if a concurrent flush already inserted the same
  // original_task_id, we silently skip the duplicate rather than erroring.
  const inserted = await db
    .insert(deadheadItemsTable)
    .values(rows)
    .onConflictDoNothing()
    .returning({ id: deadheadItemsTable.id });

  const insertedCount = inserted.length;

  await db.insert(deadheadFlushLogTable).values({
    flushedAt: now,
    count: insertedCount,
    proposedCountBefore,
    flushBatchId,
  });

  return { flushBatchId, count: insertedCount };
}
