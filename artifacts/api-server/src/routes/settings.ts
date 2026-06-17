/**
 * App Settings — owner-gated key/value configuration endpoints
 *
 * GET  /api/settings/notify-email  — return current River Smith notify email
 * PUT  /api/settings/notify-email  — set/update River Smith notify email
 *
 * GET  /api/settings/seat-config   — return saved Kitchen Table open-seat config
 * PUT  /api/settings/seat-config   — save Kitchen Table open-seat config
 */

import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { appSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  isOwnerRequest,
  OWNER_TOKEN,
  extractOwnerToken,
  getCuratorFromToken,
} from "../lib/ownerAuth";

const router: IRouter = Router();

const NOTIFY_EMAIL_KEY = "river_smith_notify_email";

async function requireOwnerOrOwnerCurator(
  req: Request,
  res: Response,
): Promise<boolean> {
  if (OWNER_TOKEN && isOwnerRequest(req)) return true;
  const token = extractOwnerToken(req);
  if (token) {
    const curator = await getCuratorFromToken(token);
    if (curator?.isOwner) return true;
  }
  res.status(401).json({ error: "Unauthorized" });
  return false;
}

router.get("/notify-email", async (req: Request, res: Response) => {
  if (!(await requireOwnerOrOwnerCurator(req, res))) return;
  try {
    const rows = await db
      .select()
      .from(appSettingsTable)
      .where(eq(appSettingsTable.key, NOTIFY_EMAIL_KEY))
      .limit(1);
    const row = rows[0];
    const email = row?.value ?? process.env.RIVER_SMITH_NOTIFY_EMAIL ?? null;
    res.json({ email, source: row ? "db" : email ? "env" : "unset" });
  } catch (err) {
    res.status(500).json({ error: "Failed to read setting" });
  }
});

router.put("/notify-email", async (req: Request, res: Response) => {
  if (!(await requireOwnerOrOwnerCurator(req, res))) return;
  const { email } = req.body as { email?: string };
  const trimmed = (email ?? "").trim();
  if (trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    res.status(400).json({ error: "Invalid email address" });
    return;
  }
  try {
    if (trimmed) {
      await db
        .insert(appSettingsTable)
        .values({ key: NOTIFY_EMAIL_KEY, value: trimmed })
        .onConflictDoUpdate({
          target: appSettingsTable.key,
          set: { value: trimmed, updatedAt: new Date() },
        });
      res.json({ email: trimmed });
    } else {
      await db.delete(appSettingsTable).where(eq(appSettingsTable.key, NOTIFY_EMAIL_KEY));
      res.json({ email: null });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to save setting" });
  }
});

const SEAT_CONFIG_KEY = "kitchen_table_seat_config";

router.get("/seat-config", async (req: Request, res: Response) => {
  if (!(await requireOwnerOrOwnerCurator(req, res))) return;
  try {
    const rows = await db
      .select()
      .from(appSettingsTable)
      .where(eq(appSettingsTable.key, SEAT_CONFIG_KEY))
      .limit(1);
    const row = rows[0];
    if (!row) {
      res.json({ seats: null });
      return;
    }
    try {
      res.json({ seats: JSON.parse(row.value) });
    } catch {
      res.json({ seats: null });
    }
  } catch {
    res.status(500).json({ error: "Failed to read seat config" });
  }
});

router.put("/seat-config", async (req: Request, res: Response) => {
  if (!(await requireOwnerOrOwnerCurator(req, res))) return;
  const { seats } = req.body as { seats?: unknown };
  if (!seats || typeof seats !== "object") {
    res.status(400).json({ error: "seats object required" });
    return;
  }
  try {
    const value = JSON.stringify(seats);
    await db
      .insert(appSettingsTable)
      .values({ key: SEAT_CONFIG_KEY, value })
      .onConflictDoUpdate({
        target: appSettingsTable.key,
        set: { value, updatedAt: new Date() },
      });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to save seat config" });
  }
});

export default router;
