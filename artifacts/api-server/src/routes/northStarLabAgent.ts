/**
 * North Star Lab — Agent Ask endpoint
 *
 * POST /north-star/lab/ask-agent
 *   Accepts a role, lab label, and recent feed messages, then calls the
 *   Anthropic AI with the role's persona as a system prompt and the
 *   conversation context as user content.
 *
 *   No owner-auth required — the lab is already gated by the kitchen-table
 *   password in the frontend; this endpoint is intentionally open so any
 *   lab participant can trigger an agent response.
 *
 *   Streams the response via SSE (text/event-stream).
 *   Each token arrives as:  data: {"token":"..."}\n\n
 *   Stream end is signalled: data: [DONE]\n\n
 *   Errors are signalled:    data: {"error":"..."}\n\n  followed by stream close.
 *
 *   Returns 503 when the AI integration is not configured (missing env vars)
 *   so the client can fall back to the local stub without showing an error.
 */

import { Router, type IRouter, type Request, type Response } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { isOwnerRequest } from "../lib/ownerAuth";
import { AGENT_ROLE_REGISTRY, type AgentRole } from "@workspace/north-star-agent-roles";

const router: IRouter = Router();

// ── Simple in-memory rate limiter ─────────────────────────────────────────────
// Caps AI spend: at most 20 agent-ask calls per rolling 60-second window.
// The window is per-process; a server restart resets the counter, which is
// acceptable for a low-traffic owner-only endpoint.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const rateLimitWindow = { start: Date.now(), count: 0 };

function checkRateLimit(): boolean {
  const now = Date.now();
  if (now - rateLimitWindow.start > RATE_LIMIT_WINDOW_MS) {
    rateLimitWindow.start = now;
    rateLimitWindow.count = 0;
  }
  if (rateLimitWindow.count >= RATE_LIMIT_MAX) return false;
  rateLimitWindow.count++;
  return true;
}

// ── Input bounds ──────────────────────────────────────────────────────────────
const MAX_LAB_LABEL_LEN = 200;
const MAX_RECENT_MESSAGES = 5;
const MAX_MESSAGE_LEN = 500;
interface AskAgentBody {
  role: AgentRole;
  labLabel: string;
  recentMessages: string[];
  prompt?: string;
}

router.post("/lab/ask-agent", async (req: Request, res: Response) => {
  // ── Auth ──────────────────────────────────────────────────────────────────
  if (!isOwnerRequest(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // ── Rate limit ────────────────────────────────────────────────────────────
  if (!checkRateLimit()) {
    res.status(429).json({ error: "Rate limit exceeded — try again shortly" });
    return;
  }

  const { role, labLabel, recentMessages, prompt } = req.body as Partial<AskAgentBody>;

  // ── Input validation & bounds ─────────────────────────────────────────────
  if (!role || typeof labLabel !== "string") {
    res.status(400).json({ error: "role and labLabel are required" });
    return;
  }

  const safeLabel = labLabel.slice(0, MAX_LAB_LABEL_LEN);

  const entry = AGENT_ROLE_REGISTRY.find((r) => r.role === role);
  if (!entry) {
    res.status(400).json({ error: `Unknown agent role: ${role}` });
    return;
  }

  const safeMessages: string[] = Array.isArray(recentMessages)
    ? recentMessages
        .slice(-MAX_RECENT_MESSAGES)
        .filter((m): m is string => typeof m === "string")
        .map((m) => m.slice(0, MAX_MESSAGE_LEN))
    : [];

  // Surface 503 when the AI integration isn't wired up so the client
  // knows to fall back to the local stub instead of showing an error.
  if (
    !process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL ||
    !process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY
  ) {
    res.status(503).json({ error: "AI integration not configured" });
    return;
  }

  // Build user message from lab context
  const safePrompt = typeof prompt === "string" ? prompt.slice(0, MAX_MESSAGE_LEN).trim() : "";
  const contextLines: string[] = [`Lab: "${safeLabel}"`];
  if (safeMessages.length > 0) {
    contextLines.push("Recent conversation:");
    for (const msg of safeMessages) {
      if (msg.trim()) contextLines.push(`  - ${msg.trim()}`);
    }
  }
  if (safePrompt) {
    contextLines.push(`\nOperator question: ${safePrompt}`);
  }
  const userContent = contextLines.join("\n");

  // ── SSE headers ───────────────────────────────────────────────────────────
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // disable nginx buffering if present
  res.flushHeaders();

  try {
    const stream = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 400,
      system: entry.systemPrompt,
      messages: [{ role: "user", content: userContent }],
      stream: true,
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta" &&
        event.delta.text
      ) {
        res.write(`data: ${JSON.stringify({ token: event.delta.text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("[northStarLabAgent] AI stream failed:", err);
    res.write(`data: ${JSON.stringify({ error: "AI call failed" })}\n\n`);
    res.end();
  }
});

export default router;
