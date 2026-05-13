/**
 * pgv2 routes — Practitioner's Guide V2 helpers.
 *
 * POST /pgv2/rewrite             — AI rewrites a guide section.
 * GET  /pgv2/startup-expenses    — Load persisted actuals + notes.
 * PUT  /pgv2/startup-expenses    — Save actuals + notes (full replace).
 */

import { Router, type IRouter } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { logger } from "../lib/logger";
import fs from "fs";
import path from "path";

const router: IRouter = Router();

// ── Startup-expenses persistence ──────────────────────────────────────────────

const DATA_DIR = path.resolve(process.cwd(), "data");
const EXPENSES_FILE = path.join(DATA_DIR, "pgv2-startup-expenses.json");

interface ExpensesPayload {
  actuals: Record<string, string>;
  notes: Record<string, string>;
}

function readExpenses(): ExpensesPayload {
  try {
    if (!fs.existsSync(EXPENSES_FILE)) return { actuals: {}, notes: {} };
    const raw = fs.readFileSync(EXPENSES_FILE, "utf-8");
    return JSON.parse(raw) as ExpensesPayload;
  } catch {
    return { actuals: {}, notes: {} };
  }
}

function writeExpenses(data: ExpensesPayload): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(EXPENSES_FILE, JSON.stringify(data, null, 2), "utf-8");
}

router.get("/startup-expenses", (_req, res) => {
  res.json(readExpenses());
});

router.put("/startup-expenses", (req, res) => {
  const body = req.body as Partial<ExpensesPayload>;
  if (
    !body ||
    typeof body.actuals !== "object" ||
    typeof body.notes !== "object"
  ) {
    res.status(400).json({ error: "actuals and notes objects are required" });
    return;
  }

  const payload: ExpensesPayload = {
    actuals: body.actuals as Record<string, string>,
    notes: body.notes as Record<string, string>,
  };

  writeExpenses(payload);
  logger.info("pgv2 startup-expenses saved");
  res.json({ ok: true });
});

// ── AI section rewrite ────────────────────────────────────────────────────────

router.post("/rewrite", async (req, res) => {
  const { sectionId, currentText, instruction } = req.body as {
    sectionId?: string;
    currentText?: string;
    instruction?: string;
  };

  if (!currentText || !instruction) {
    res.status(400).json({ error: "currentText and instruction are required" });
    return;
  }

  try {
    const msg = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are editing a section of a practitioner's operational guide for a small Indigenous-owned consulting and co-op business in Northern Ontario. The writing style is plain, direct, and practical — no marketing fluff, no filler.

CURRENT SECTION TEXT:
${currentText}

WHAT NEEDS TO CHANGE:
${instruction}

Rewrite the section incorporating the change. Keep the same general length and plain-prose style. Return only the rewritten text — no preamble, no headings, no markdown, just the updated paragraphs.`,
        },
      ],
    });

    const rewritten =
      msg.content[0]?.type === "text" ? msg.content[0].text.trim() : "";

    logger.info({ sectionId, instruction }, "pgv2 section rewritten");
    res.json({ rewritten });
  } catch (err) {
    logger.error({ err }, "pgv2/rewrite failed");
    res.status(500).json({ error: "AI rewrite failed" });
  }
});

export default router;
