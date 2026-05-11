/**
 * pgv2 routes — Practitioner's Guide V2 AI helpers.
 *
 * POST /pgv2/rewrite — AI rewrites a guide section based on a plain-English instruction.
 */

import { Router, type IRouter } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { logger } from "../lib/logger";

const router: IRouter = Router();

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
