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
      // Surface scope errors explicitly so the UI can show an actionable message
      // rather than silently rendering nothing. The gmail.readonly (or gmail.modify)
      // scope is required for threads.list — addon-only scopes are insufficient.
      const isScope =
        listData.error.message?.toLowerCase().includes("insufficient") ||
        (listData.error as unknown as { status?: string }).status === "PERMISSION_DENIED";
      if (isScope) {
        res.status(403).json({ error: "insufficient_scope", message: listData.error.message });
      } else {
        res.json([]);
      }
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

// ─── Archive search ────────────────────────────────────────────────────────
// GET /inbox/archive
//   Query params:
//     q          — free-text Gmail query string (appended to base query)
//     dateFrom   — ISO date string (YYYY-MM-DD) lower bound
//     dateTo     — ISO date string (YYYY-MM-DD) upper bound
//     preset     — one of: mailchimp | z1-income | z2-contract | z3-future | z4-community
//     maxResults — number of threads to return (default 30, max 50)
//   Returns: EmailThread[] (same shape as /threads)

const PRESET_QUERIES: Record<string, string> = {
  mailchimp: "from:@mailchimp.com OR from:@mandrillapp.com OR from:campaigns@",
  "z1-income": "(accountant OR CRA OR bookkeeping OR invoice OR tax OR revenue OR payroll OR HST OR GST OR \"tax return\" OR T4)",
  "z2-contract": "(contract OR proposal OR agreement OR SOW OR deliverable OR scope OR retainer OR \"letter of intent\" OR client)",
  "z3-future": "(course OR workshop OR cohort OR program OR curriculum OR training OR module OR lesson OR \"online learning\")",
  "z4-community": "(community OR \"food system\" OR corridor OR \"co-op\" OR cooperative OR Headwaters OR \"Deer Lake\" OR Brightside OR \"Northern Ontario\")",
};

router.get("/archive", async (req, res) => {
  try {
    const connectors = new ReplitConnectors();

    const qParam = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const dateFrom = typeof req.query.dateFrom === "string" ? req.query.dateFrom.trim() : "";
    const dateTo = typeof req.query.dateTo === "string" ? req.query.dateTo.trim() : "";
    const preset = typeof req.query.preset === "string" ? req.query.preset.trim() : "";
    const maxResults = Math.min(
      50,
      parseInt(typeof req.query.maxResults === "string" ? req.query.maxResults : "30", 10) || 30,
    );

    const parts: string[] = [];

    if (preset && PRESET_QUERIES[preset]) {
      parts.push(`(${PRESET_QUERIES[preset]})`);
    }

    if (qParam) {
      parts.push(`(${qParam})`);
    }

    if (dateFrom) {
      parts.push(`after:${dateFrom.replace(/-/g, "/")}`);
    }

    if (dateTo) {
      parts.push(`before:${dateTo.replace(/-/g, "/")}`);
    }

    if (parts.length === 0) {
      res.json([]);
      return;
    }

    const q = parts.join(" ");

    const listResp = await connectors.proxy(
      "google-mail",
      `/gmail/v1/users/me/threads?maxResults=${maxResults}&q=${encodeURIComponent(q)}`,
      { method: "GET" },
    );

    const listData = await listResp.json() as { threads?: GmailThread[]; error?: { message: string } };

    if (listData.error) {
      logger.warn({ err: listData.error }, "inbox/archive: Gmail API error");
      const isScope =
        listData.error.message?.toLowerCase().includes("insufficient") ||
        (listData.error as unknown as { status?: string }).status === "PERMISSION_DENIED";
      if (isScope) {
        res.status(403).json({ error: "insufficient_scope", message: listData.error.message });
      } else {
        res.json([]);
      }
      return;
    }

    const rawThreads: GmailThread[] = listData.threads ?? [];

    if (rawThreads.length === 0) {
      res.json([]);
      return;
    }

    const threads = await Promise.all(
      rawThreads.slice(0, maxResults).map(async (t) => {
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
          logger.warn({ err, threadId: t.id }, "inbox/archive: failed to fetch thread metadata");
          return null;
        }
      }),
    );

    res.json(threads.filter(Boolean));
  } catch (err) {
    logger.warn({ err }, "inbox/archive: Gmail connector unavailable, returning empty");
    res.json([]);
  }
});

export default router;
