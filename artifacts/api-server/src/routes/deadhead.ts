/**
 * Deadhead routes
 *
 * POST /api/tasks            — create a project task (triggers congestion check)
 * GET  /api/tasks            — list tasks (owner-gated)
 * POST /api/deadhead/intake  — ingest an array of task objects (owner-gated)
 * GET  /api/deadhead/intake  — list deadhead intake items (owner-gated)
 * GET  /api/deadhead/log     — list flush log entries (owner-gated)
 * PATCH /api/deadhead/intake/:id — update an item's status (owner-gated)
 */

import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  projectTasksTable,
  deadheadItemsTable,
  deadheadFlushLogTable,
} from "@workspace/db";
import { desc, asc, eq, sql } from "drizzle-orm";
import { isOwnerRequest, OWNER_TOKEN } from "../lib/ownerAuth";
import { checkAndFlushCongestion } from "../lib/congestion";
import { ingestToDeadhead } from "@workspace/db/deadheadService";
import { logger } from "../lib/logger";

const router: IRouter = Router();

function requireOwner(req: Request): boolean {
  return !!OWNER_TOKEN && isOwnerRequest(req);
}

// ----------------------- task creation -----------------------

router.post("/tasks", async (req: Request, res: Response) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const title =
    typeof body.title === "string" ? body.title.trim().slice(0, 500) : "";

  if (!title) {
    res.status(400).json({ error: "title is required" });
    return;
  }

  // Kitchen-table protocol: agents drop with a `source` (artifact id) and
  // optional `sourceRef` (page path / doc id) so provenance survives the
  // congestion flush. Both fields are optional — items without them surface
  // as "unknown" in the intake admin.
  const source =
    typeof body.source === "string" && body.source.trim()
      ? body.source.trim().slice(0, 200)
      : null;
  const sourceRef =
    typeof body.sourceRef === "string" && body.sourceRef.trim()
      ? body.sourceRef.trim().slice(0, 500)
      : null;

  const [task] = await db
    .insert(projectTasksTable)
    .values({ title, status: "proposed", source, sourceRef })
    .returning();

  if (!task) {
    res.status(500).json({ error: "Failed to create task" });
    return;
  }

  res.status(201).json({
    id: task.id,
    title: task.title,
    status: task.status,
    source: task.source,
    sourceRef: task.sourceRef,
    createdAt: task.createdAt.toISOString(),
  });

  // Fire congestion check as a non-blocking side-effect after responding.
  setImmediate(() => {
    checkAndFlushCongestion().catch((err) => {
      logger.error({ err }, "post-task congestion flush error");
    });
  });
});

router.get("/tasks", async (req: Request, res: Response) => {
  if (!requireOwner(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const statusFilter =
    typeof req.query.status === "string" ? req.query.status : null;

  const rows = statusFilter
    ? await db
        .select()
        .from(projectTasksTable)
        .where(eq(projectTasksTable.status, statusFilter))
        .orderBy(asc(projectTasksTable.createdAt))
    : await db
        .select()
        .from(projectTasksTable)
        .orderBy(asc(projectTasksTable.createdAt));

  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(projectTasksTable)
    .where(eq(projectTasksTable.status, "proposed"));

  res.json({
    total: rows.length,
    proposedCount: countRow?.count ?? 0,
    threshold: 30,
    tasks: rows.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      source: t.source,
      sourceRef: t.sourceRef,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    })),
  });
});

// ----------------------- deadhead intake -----------------------
//
// POST /deadhead/intake requires owner token — same credential as
// the manifest dashboard.  This prevents arbitrary external writes
// from spamming the vetting queue.

router.post("/deadhead/intake", async (req: Request, res: Response) => {
  if (!requireOwner(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const rawItems = Array.isArray(body.items) ? (body.items as unknown[]) : [];

  if (rawItems.length === 0) {
    res.status(400).json({ error: "items array is required and must not be empty" });
    return;
  }

  const items = rawItems
    .filter(
      (i): i is {
        id: string;
        title: string;
        createdAt?: string;
        source?: string;
        sourceRef?: string;
      } =>
        typeof (i as Record<string, unknown>).id === "string" &&
        typeof (i as Record<string, unknown>).title === "string",
    )
    .map((i) => ({
      id: i.id,
      title: i.title,
      createdAt: i.createdAt ? new Date(i.createdAt) : new Date(),
      source: typeof i.source === "string" && i.source.trim() ? i.source.trim().slice(0, 200) : null,
      sourceRef: typeof i.sourceRef === "string" && i.sourceRef.trim() ? i.sourceRef.trim().slice(0, 500) : null,
    }));

  if (items.length === 0) {
    res.status(400).json({ error: "No valid items found in payload" });
    return;
  }

  // Count current proposed tasks for the log entry (best-effort; use 0 if
  // the call came from an external caller who doesn't know the count).
  const proposedCountHint =
    typeof body.proposedCountBefore === "number" ? body.proposedCountBefore : 0;

  const result = await ingestToDeadhead(items, proposedCountHint);

  res.status(201).json({
    ok: true,
    flushBatchId: result.flushBatchId,
    count: result.count,
  });
});

router.get("/deadhead/intake", async (req: Request, res: Response) => {
  if (!requireOwner(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const statusFilter =
    typeof req.query.status === "string" ? req.query.status : null;

  const rows = statusFilter
    ? await db
        .select()
        .from(deadheadItemsTable)
        .where(eq(deadheadItemsTable.status, statusFilter))
        .orderBy(desc(deadheadItemsTable.flushedAt))
    : await db
        .select()
        .from(deadheadItemsTable)
        .orderBy(desc(deadheadItemsTable.flushedAt));

  res.json({
    total: rows.length,
    items: rows.map((r) => ({
      id: r.id,
      originalTaskId: r.originalTaskId,
      title: r.title,
      originalCreatedAt: r.originalCreatedAt.toISOString(),
      status: r.status,
      source: r.source,
      sourceRef: r.sourceRef,
      flushedAt: r.flushedAt.toISOString(),
      flushBatchId: r.flushBatchId,
    })),
  });
});

router.patch("/deadhead/intake/:id", async (req: Request, res: Response) => {
  if (!requireOwner(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const id = String(req.params.id);
  const body = (req.body ?? {}) as Record<string, unknown>;
  const status = typeof body.status === "string" ? body.status : null;

  const VALID_STATUSES = ["new", "reviewed", "smashed"];
  if (!status || !VALID_STATUSES.includes(status)) {
    res.status(400).json({
      error: `status must be one of: ${VALID_STATUSES.join(", ")}`,
    });
    return;
  }

  const [updated] = await db
    .update(deadheadItemsTable)
    .set({ status })
    .where(eq(deadheadItemsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Item not found" });
    return;
  }

  res.json({ id: updated.id, status: updated.status });
});

// ----------------------- flush log -----------------------

router.get("/deadhead/log", async (req: Request, res: Response) => {
  if (!requireOwner(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const rows = await db
    .select()
    .from(deadheadFlushLogTable)
    .orderBy(desc(deadheadFlushLogTable.flushedAt))
    .limit(100);

  res.json({
    total: rows.length,
    entries: rows.map((r) => ({
      id: r.id,
      flushedAt: r.flushedAt.toISOString(),
      count: r.count,
      proposedCountBefore: r.proposedCountBefore,
      flushBatchId: r.flushBatchId,
    })),
  });
});

export default router;
