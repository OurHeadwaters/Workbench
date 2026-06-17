/**
 * North Star Weekly Archive — server-side persistence
 *
 * GET  /api/north-star/archive         — return full archive JSON
 * PUT  /api/north-star/archive         — save/merge archive JSON
 * GET  /api/north-star/archive/export  — download as JSON file
 *
 * Protected by the owner token (x-library-owner-token header).
 */

import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { appSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { isOwnerRequest } from "../lib/ownerAuth";

const router: IRouter = Router();

const ARCHIVE_KEY = "north_star_this_week_archive";

function requireOwner(req: Request, res: Response): boolean {
  if (isOwnerRequest(req)) return true;
  res.status(401).json({ error: "Unauthorized" });
  return false;
}

router.get("/archive", async (req: Request, res: Response) => {
  if (!requireOwner(req, res)) return;
  try {
    const rows = await db
      .select()
      .from(appSettingsTable)
      .where(eq(appSettingsTable.key, ARCHIVE_KEY))
      .limit(1);
    const row = rows[0];
    if (!row) {
      res.json({ archive: {} });
      return;
    }
    try {
      res.json({ archive: JSON.parse(row.value) });
    } catch {
      res.json({ archive: {} });
    }
  } catch {
    res.status(500).json({ error: "Failed to read archive" });
  }
});

router.put("/archive", async (req: Request, res: Response) => {
  if (!requireOwner(req, res)) return;
  const { archive } = req.body as { archive?: unknown };
  if (!archive || typeof archive !== "object" || Array.isArray(archive)) {
    res.status(400).json({ error: "archive object required" });
    return;
  }
  try {
    const value = JSON.stringify(archive);
    await db
      .insert(appSettingsTable)
      .values({ key: ARCHIVE_KEY, value })
      .onConflictDoUpdate({
        target: appSettingsTable.key,
        set: { value, updatedAt: new Date() },
      });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to save archive" });
  }
});

router.get("/archive/export", async (req: Request, res: Response) => {
  if (!requireOwner(req, res)) return;
  try {
    const rows = await db
      .select()
      .from(appSettingsTable)
      .where(eq(appSettingsTable.key, ARCHIVE_KEY))
      .limit(1);
    const row = rows[0];
    const archive = row ? JSON.parse(row.value) : {};
    const filename = `north-star-archive-${new Date().toISOString().slice(0, 10)}.json`;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(JSON.stringify(archive, null, 2));
  } catch {
    res.status(500).json({ error: "Failed to export archive" });
  }
});

export default router;
