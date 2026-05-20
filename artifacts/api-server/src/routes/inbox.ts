/**
 * Inbox routes — Gmail thread triage for North Star's Morning Triage card.
 *
 * GET /api/inbox/threads
 *   Query params:
 *     keywords  — comma-separated list (default: accountant,CRA,bookkeeping,invoice,tax)
 *     senders   — comma-separated list of email addresses to always surface
 *     labels    — comma-separated Gmail label names to always surface
 *   Returns: EmailThread[] (id, subject, from, snippet, date)
 *   On OAuth not configured: 200 with empty array (silent fail by design)
 */

import { Router, type IRouter } from "express";
import { ReplitConnectors } from "@replit/connectors-sdk";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const DEFAULT_KEYWORDS = ["accountant", "CRA", "bookkeeping", "invoice", "tax"];

interface GmailThread {
  id: string;
  snippet: string;
}

interface GmailMessage {
  id: string;
  threadId: string;
  payload?: {
    headers?: { name: string; value: string }[];
  };
  snippet?: string;
  internalDate?: string;
}

function pickHeader(
  headers: { name: string; value: string }[] | undefined,
  name: string,
): string {
  return headers?.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

// GET /inbox/threads
router.get("/threads", async (req, res) => {
  try {
    const connectors = new ReplitConnectors();

    const keywordsParam = typeof req.query.keywords === "string" ? req.query.keywords : "";
    const sendersParam = typeof req.query.senders === "string" ? req.query.senders : "";
    const labelsParam = typeof req.query.labels === "string" ? req.query.labels : "";

    const keywords = keywordsParam
      ? keywordsParam.split(",").map((k) => k.trim()).filter(Boolean)
      : DEFAULT_KEYWORDS;
    const senders = sendersParam
      ? sendersParam.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const labels = labelsParam
      ? labelsParam.split(",").map((l) => l.trim()).filter(Boolean)
      : [];

    // Escape a Gmail query token: wrap in quotes if it contains spaces or
    // special operator characters, so user-supplied strings don't break syntax.
    function escapeToken(token: string): string {
      return /[\s"'(){}[\]|\\^~*?:!]/.test(token) ? `"${token.replace(/"/g, "")}"` : token;
    }

    // Build a Gmail search query that matches any keyword OR any sender OR any label
    const parts: string[] = [];

    if (keywords.length > 0) {
      parts.push(`(${keywords.map(escapeToken).join(" OR ")})`);
    }

    if (senders.length > 0) {
      parts.push(`(${senders.map((s) => `from:${escapeToken(s)}`).join(" OR ")})`);
    }

    if (labels.length > 0) {
      parts.push(`(${labels.map((l) => `label:${escapeToken(l)}`).join(" OR ")})`);
    }

    // Always scope to inbox, unread, last 7 days
    const q = `in:inbox is:unread newer_than:7d${parts.length > 0 ? " " + parts.join(" OR ") : ""}`;

    const listResp = await connectors.proxy(
      "google-mail",
      `/gmail/v1/users/me/threads?maxResults=20&q=${encodeURIComponent(q)}`,
      { method: "GET" },
    );

    const listData = await listResp.json() as { threads?: GmailThread[]; error?: { message: string } };

    if (listData.error) {
      logger.warn({ err: listData.error }, "inbox: Gmail API error");
      res.json([]);
      return;
    }

    const rawThreads: GmailThread[] = listData.threads ?? [];

    if (rawThreads.length === 0) {
      res.json([]);
      return;
    }

    // Fetch metadata for each thread (first message only)
    const threads = await Promise.all(
      rawThreads.slice(0, 15).map(async (t) => {
        try {
          const msgResp = await connectors.proxy(
            "google-mail",
            `/gmail/v1/users/me/threads/${t.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
            { method: "GET" },
          );

          const msgData = await msgResp.json() as {
            id: string;
            messages?: GmailMessage[];
            snippet?: string;
          };

          // Use the last message for headers so Subject/From/Date reflect the
          // most recent reply in the thread, not the original message.
          const messages = msgData.messages ?? [];
          const latestMsg = messages[messages.length - 1];
          const headers = latestMsg?.payload?.headers;

          return {
            id: t.id,
            subject: pickHeader(headers, "Subject") || "(no subject)",
            from: pickHeader(headers, "From") || "Unknown",
            snippet: msgData.snippet ?? t.snippet ?? "",
            date: pickHeader(headers, "Date") || new Date().toISOString(),
          };
        } catch (err) {
          logger.warn({ err, threadId: t.id }, "inbox: failed to fetch thread metadata");
          return null;
        }
      }),
    );

    const result = threads.filter(Boolean);
    res.json(result);
  } catch (err) {
    // OAuth not configured or connector unavailable — silent fail
    logger.warn({ err }, "inbox: Gmail connector unavailable, returning empty");
    res.json([]);
  }
});

export default router;
