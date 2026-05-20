/**
 * Triage routes — email capture for Morning Triage public landing page.
 *
 * POST /api/triage/subscribe
 *   Body: { email: string, source: string }
 *   Appends the entry to data/triage-subscribers.jsonl
 *   Returns: { ok: true }
 */

import { Router, type IRouter } from "express";
import fs from "fs";
import path from "path";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const DATA_DIR = path.resolve(process.cwd(), "data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "triage-subscribers.jsonl");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

router.post("/subscribe", (req, res) => {
  try {
    const { email, source } = req.body as { email?: string; source?: string };

    if (!email || typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ error: "Valid email required" });
      return;
    }

    ensureDataDir();

    const entry = JSON.stringify({
      email: email.trim().toLowerCase(),
      source: source ?? "unknown",
      subscribedAt: new Date().toISOString(),
    });

    fs.appendFileSync(SUBSCRIBERS_FILE, entry + "\n", "utf8");

    logger.info({ source }, "triage: new subscriber captured");

    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "triage: subscribe write failed");
    res.status(500).json({ error: "Could not save your email — please try again." });
  }
});

export default router;
