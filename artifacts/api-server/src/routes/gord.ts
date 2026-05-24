/**
 * Gord routes — the cheeky northern bird guide chat widget backend.
 *
 * POST /api/gord/chat              — send a message to Gord, get a witty AI reply
 * GET  /api/gord/bottles?fp=<id>  — fetch all bottles for a fingerprint
 * POST /api/gord/bottles           — save a bottle { fp, message, date }
 *
 * Bottles are persisted to .local/gord-bottles.json so they survive server
 * restarts. Each browser generates a stable random UUID fingerprint stored in
 * localStorage; the same fingerprint can be shared across devices to pool bottles.
 */

import { Router, type IRouter } from "express";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const GORD_SYSTEM = `You are Gord — a cheeky, wise-cracking northern bird guide. You gently roast people who lean too hard on "the system" instead of taking personal responsibility. Humor is dry, sarcastic, but helpful. You encourage self-reliance, action, and common sense. Always end with encouragement toward self-reliance. Signature: "Gord's on board." Tone: playful but sharp, never preachy. Keep responses concise — 2-4 sentences max. Never be preachy or lecture. One sharp observation, one push toward action.`;

// ── Bottle persistence ────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getBottlesPath(): string {
  const rootGuess = join(__dirname, "../../../../");
  const localDir = join(rootGuess, ".local");
  if (!existsSync(localDir)) mkdirSync(localDir, { recursive: true });
  return join(localDir, "gord-bottles.json");
}

interface Bottle {
  date: string;
  message: string;
}

type BottleStore = Record<string, Bottle[]>;

function readBottleStore(): BottleStore {
  try {
    const p = getBottlesPath();
    if (!existsSync(p)) return {};
    return JSON.parse(readFileSync(p, "utf-8")) as BottleStore;
  } catch {
    return {};
  }
}

function writeBottleStore(store: BottleStore): void {
  try {
    writeFileSync(getBottlesPath(), JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    logger.error({ err }, "gord: failed to write bottle store");
  }
}

function isValidFingerprint(fp: unknown): fp is string {
  return typeof fp === "string" && fp.length >= 8 && fp.length <= 128;
}

// ── Chat ──────────────────────────────────────────────────────────────────────

router.post("/chat", async (req, res) => {
  const body = (req.body ?? {}) as {
    message?: unknown;
    history?: unknown;
  };

  const message =
    typeof body.message === "string" ? body.message.trim() : "";

  if (!message) {
    res.status(400).json({ error: "message is required" });
    return;
  }

  const rawHistory = Array.isArray(body.history) ? body.history : [];
  const history = rawHistory
    .filter(
      (h): h is { role: string; content: string } =>
        typeof h === "object" &&
        h !== null &&
        typeof (h as Record<string, unknown>).role === "string" &&
        typeof (h as Record<string, unknown>).content === "string",
    )
    .slice(-10)
    .map((h) => ({
      role: h.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: h.content,
    }));

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: GORD_SYSTEM,
      messages: [
        ...history,
        { role: "user", content: message },
      ],
    });

    const block = response.content[0];
    if (!block || block.type !== "text") {
      res.status(500).json({ error: "No response from Gord" });
      return;
    }

    res.json({ reply: block.text });
  } catch (err) {
    logger.error({ err }, "gord: POST /chat failed");
    res.status(500).json({ error: "Gord's radio is down. Try again." });
  }
});

// ── GET /bottles?fp=<fingerprint> ─────────────────────────────────────────────

router.get("/bottles", (req, res) => {
  const fp = req.query.fp;
  if (!isValidFingerprint(fp)) {
    res.status(400).json({ error: "fp query param is required" });
    return;
  }
  const store = readBottleStore();
  res.json({ bottles: store[fp] ?? [] });
});

// ── POST /bottles ─────────────────────────────────────────────────────────────

router.post("/bottles", (req, res) => {
  const body = (req.body ?? {}) as {
    fp?: unknown;
    message?: unknown;
    date?: unknown;
  };

  if (!isValidFingerprint(body.fp)) {
    res.status(400).json({ error: "fp is required" });
    return;
  }

  const message =
    typeof body.message === "string" ? body.message.trim().slice(0, 2000) : "";
  if (!message) {
    res.status(400).json({ error: "message is required" });
    return;
  }

  const date =
    typeof body.date === "string" ? body.date.slice(0, 100) : new Date().toLocaleString();

  const store = readBottleStore();
  const fp = body.fp;
  const existing = store[fp] ?? [];

  if (existing.some((b) => b.message === message)) {
    res.json({ ok: true, duplicate: true });
    return;
  }

  store[fp] = [{ date, message }, ...existing].slice(0, 200);
  writeBottleStore(store);
  res.json({ ok: true });
});

export default router;
