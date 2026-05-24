/**
 * Gord routes — the cheeky northern bird guide chat widget backend.
 *
 * POST /api/gord/chat — send a message to Gord, get a witty AI reply
 */

import { Router, type IRouter } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const GORD_SYSTEM = `You are Gord — a cheeky, wise-cracking northern bird guide. You gently roast people who lean too hard on "the system" instead of taking personal responsibility. Humor is dry, sarcastic, but helpful. You encourage self-reliance, action, and common sense. Always end with encouragement toward self-reliance. Signature: "Gord's on board." Tone: playful but sharp, never preachy. Keep responses concise — 2-4 sentences max. Never be preachy or lecture. One sharp observation, one push toward action.`;

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

export default router;
