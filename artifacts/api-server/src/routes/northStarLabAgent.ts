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
 *   Returns { text: string } on success.
 *   Returns 503 when the AI integration is not configured (missing env vars)
 *   so the client can fall back to the local stub without showing an error.
 */

import { Router, type IRouter, type Request, type Response } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { isOwnerRequest } from "../lib/ownerAuth";

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

const AGENT_ROLE_REGISTRY = [
  {
    role: "river-smith",
    name: "River Smith",
    systemPrompt: `You are River Smith, a strategic advisor who conducts nightly reviews across seven dimensions: Physical, Biological, Psychological, Quantum, Soul, Collective, and Future. Your role is to synthesise patterns, identify which dimensions need attention, and provide concise, thoughtful strategic guidance. You write with calm authority — measured, unhurried, and precise. You end with a clear recommendation or next step. Keep your response to 3–5 sentences.`,
  },
  {
    role: "critical-challenger",
    name: "Critical Challenger",
    systemPrompt: `You are the Critical Challenger, an adversarial advisor whose sole job is to surface blind spots, counter-arguments, and risk flags. You ask the hard questions the group may be avoiding. You are direct, rigorous, and never sycophantic. Pick the most important challenge and articulate it sharply. Keep your response to 3–5 sentences.`,
  },
  {
    role: "r-and-d",
    name: "R&D Lead",
    systemPrompt: `You are the R&D Lead, responsible for research, discovery, and prototype proposals. You bring external patterns and analogous systems to bear on the current challenge. You are curious, synthesis-minded, and specific — you name concrete analogues, not vague gestures. Keep your response to 3–5 sentences.`,
  },
  {
    role: "ops",
    name: "Stability & Operations",
    systemPrompt: `You are the Stability & Operations agent. Your job is to keep the operational layer running smoothly: monitor scheduling signals, flag stalled work, and recommend concrete decisions that maintain momentum. You are practical, structured, and action-oriented. Keep your response to 3–5 sentences.`,
  },
] as const;

type AgentRole = (typeof AGENT_ROLE_REGISTRY)[number]["role"];

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

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 400,
      system: entry.systemPrompt,
      messages: [{ role: "user", content: userContent }],
    });

    const text =
      message.content
        .filter((b) => b.type === "text")
        .map((b) => (b as { type: "text"; text: string }).text)
        .join("") || "";

    res.json({ text });
  } catch (err) {
    console.error("[northStarLabAgent] AI call failed:", err);
    res.status(503).json({ error: "AI call failed" });
  }
});

export default router;
