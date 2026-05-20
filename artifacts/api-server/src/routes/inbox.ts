/**
 * Inbox routes — Gmail thread triage for North Star's Morning Triage card.
 *
 * Server-side account registry: the mapping of accountId → Replit connectionId
 * lives here, server-side only. Clients send accountIds; the server resolves
 * which connection to use. Clients cannot supply or override connectionIds.
 *
 * GET /api/inbox/threads
 *   Query params:
 *     keywords  — comma-separated list (default: accountant,CRA,bookkeeping,invoice,tax)
 *     senders   — comma-separated list of email addresses to always surface
 *     labels    — comma-separated Gmail label names to always surface
 *   Returns: EmailThread[]
 *
 * GET /api/inbox/threads/all
 *   Query params: keywords, senders, labels (same as above)
 *                 accountIds — comma-separated accountIds from the registry
 *   Each enabled account is resolved server-side. Accounts without a registered
 *   connection are immediately marked "no-connection" and skipped — no Gmail call
 *   is attempted.
 *   Returns: { threads: EnrichedEmailThread[], accountStatuses }
 *
 * GET /api/inbox/accounts/status
 *   Query params: accountIds — comma-separated
 *   Probes each account's connection with a minimal Gmail API call.
 *   Returns: Record<accountId, "ok" | "scope" | "unavailable" | "no-connection">
 */

import { Router, type IRouter } from "express";
import { ReplitConnectors } from "@replit/connectors-sdk";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const DEFAULT_KEYWORDS = ["accountant", "CRA", "bookkeeping", "invoice", "tax"];

// ─── Server-side account registry ──────────────────────────────────────────
// This is the ONLY place connectionIds are stored. Clients send accountIds;
// the server looks up the connection here. Clients cannot supply connectionIds.
//
// Each account maps to a Replit google-mail OAuth connection.
// To add an account: create a new Gmail connection in the Replit Integrations
// panel, then set the corresponding environment variable listed below.
// The account will immediately start loading in the unified feed on next restart.
//
// Environment variables → account IDs:
//   GMAIL_CONN_ACC_BOBBIE_PERSONAL → acc-bobbie-personal  (bobbiepepin@gmail.com)
//   GMAIL_CONN_ACC_PJ_MAIN         → acc-pj-main          (parrsjars@gmail.com)
//   GMAIL_CONN_ACC_PJ_ORDERS       → acc-pj-orders        (parrsjars.orders@gmail.com)
//   GMAIL_CONN_ACC_PJ_INFO         → acc-pj-info          (parrsjars.info@gmail.com)
//   GMAIL_CONN_ACC_XBUCKETS        → acc-xbuckets         (xbucketsapp@gmail.com)
//   GMAIL_CONN_ACC_807FOODCOOP     → acc-807foodcoop      (807foodcoop@gmail.com)
//   GMAIL_CONN_ACC_THE807FOODCOOP  → acc-the807foodcoop   (the807foodcoop@gmail.com)
//   GMAIL_CONN_ACC_807FOODHUB      → acc-807foodhub       (807foodhub@gmail.com)
// (bobbie@ourheadwaters.ca is an alias — fetched via acc-pj-main, not directly)
//
// GMAIL_CONN_ACC_PJ_MAIN has a hardcoded default (the initial connection) so the
// feed works immediately without setting the env var.

const ACCOUNT_ENV_VAR_NAMES: Record<string, string> = {
  "acc-bobbie-personal": "GMAIL_CONN_ACC_BOBBIE_PERSONAL",
  "acc-pj-main":         "GMAIL_CONN_ACC_PJ_MAIN",
  "acc-pj-orders":       "GMAIL_CONN_ACC_PJ_ORDERS",
  "acc-pj-info":         "GMAIL_CONN_ACC_PJ_INFO",
  "acc-xbuckets":        "GMAIL_CONN_ACC_XBUCKETS",
  "acc-807foodcoop":     "GMAIL_CONN_ACC_807FOODCOOP",
  "acc-the807foodcoop":  "GMAIL_CONN_ACC_THE807FOODCOOP",
  "acc-807foodhub":      "GMAIL_CONN_ACC_807FOODHUB",
};

// Initial known connection ID for acc-pj-main — used as fallback if the env
// var is not set, so the feed works immediately after deployment.
const PJ_MAIN_DEFAULT_CONN = "conn_google-mail_01KPKQ3QXGG61BYN5M5G6W83AP";

function resolveConnection(accountId: string): string | null {
  const envVar = ACCOUNT_ENV_VAR_NAMES[accountId];
  if (!envVar) return null;

  const fromEnv = process.env[envVar];
  if (fromEnv) return fromEnv;

  // Fallback for acc-pj-main so it works without the env var being set
  if (accountId === "acc-pj-main") return PJ_MAIN_DEFAULT_CONN;

  return null;
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface GmailThread {
  id: string;
  snippet: string;
}

interface GmailMessagePart {
  mimeType?: string;
  body?: { data?: string; size?: number };
  parts?: GmailMessagePart[];
}

interface GmailMessage {
  id: string;
  threadId: string;
  payload?: {
    headers?: { name: string; value: string }[];
    mimeType?: string;
    body?: { data?: string; size?: number };
    parts?: GmailMessagePart[];
  };
  snippet?: string;
  internalDate?: string;
}

interface EmailThread {
  id: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
}

interface EnrichedEmailThread extends EmailThread {
  accountId: string;
  accountLabel: string;
}

type AccountStatus = "ok" | "scope" | "unavailable" | "no-connection";

// ─── Helpers ────────────────────────────────────────────────────────────────

function extractPlainText(payload: GmailMessage["payload"], maxChars = 1000): string {
  if (!payload) return "";

  function findPlain(part: GmailMessagePart): string | null {
    if (part.mimeType === "text/plain" && part.body?.data) {
      const raw = part.body.data.replace(/-/g, "+").replace(/_/g, "/");
      try {
        return Buffer.from(raw, "base64").toString("utf-8");
      } catch {
        return null;
      }
    }
    if (part.parts) {
      for (const child of part.parts) {
        const result = findPlain(child);
        if (result !== null) return result;
      }
    }
    return null;
  }

  const text = findPlain(payload as GmailMessagePart) ?? "";
  return text.slice(0, maxChars);
}

function pickHeader(
  headers: { name: string; value: string }[] | undefined,
  name: string,
): string {
  return headers?.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

function buildQuery(keywords: string[], senders: string[], labels: string[]): string {
  function escapeToken(token: string): string {
    return /[\s"'(){}[\]|\\^~*?:!]/.test(token) ? `"${token.replace(/"/g, "")}"` : token;
  }

  const parts: string[] = [];
  if (keywords.length > 0) parts.push(`(${keywords.map(escapeToken).join(" OR ")})`);
  if (senders.length > 0) parts.push(`(${senders.map((s) => `from:${escapeToken(s)}`).join(" OR ")})`);
  if (labels.length > 0) parts.push(`(${labels.map((l) => `label:${escapeToken(l)}`).join(" OR ")})`);
  return `in:inbox is:unread newer_than:7d${parts.length > 0 ? " " + parts.join(" OR ") : ""}`;
}

/**
 * Fetch threads using a specific Replit connection ID.
 * Never falls back to the default connection — if connectionId is null/undefined,
 * returns { threads: [], error: "no-connection" } immediately.
 */
async function fetchThreadsForConnection(
  connectionId: string,
  q: string,
): Promise<{ threads: EmailThread[]; error: "scope" | "unavailable" | null }> {
  try {
    const connectors = new ReplitConnectors();

    const proxyOpts = { method: "GET", connectionId } as Parameters<typeof connectors.proxy>[2] & { connectionId: string };

    const listResp = await connectors.proxy(
      "google-mail",
      `/gmail/v1/users/me/threads?maxResults=20&q=${encodeURIComponent(q)}`,
      proxyOpts,
    );

    const listData = await listResp.json() as {
      threads?: GmailThread[];
      error?: { message: string; status?: string };
    };

    if (listData.error) {
      logger.warn({ err: listData.error, connectionId }, "inbox: Gmail API error");
      const isScope =
        listData.error.message?.toLowerCase().includes("insufficient") ||
        listData.error.status === "PERMISSION_DENIED";
      return { threads: [], error: isScope ? "scope" : "unavailable" };
    }

    const rawThreads: GmailThread[] = listData.threads ?? [];
    if (rawThreads.length === 0) return { threads: [], error: null };

    const threads = await Promise.all(
      rawThreads.slice(0, 15).map(async (t) => {
        try {
          const msgResp = await connectors.proxy(
            "google-mail",
            `/gmail/v1/users/me/threads/${t.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
            proxyOpts,
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
          logger.warn({ err, threadId: t.id }, "inbox: failed to fetch thread metadata");
          return null;
        }
      }),
    );

    return { threads: threads.filter(Boolean) as EmailThread[], error: null };
  } catch (err) {
    logger.warn({ err, connectionId }, "inbox: Gmail connector unavailable");
    return { threads: [], error: "unavailable" };
  }
}

/**
 * Lightweight connection probe — fetches at most 1 thread with a narrow query.
 * Used by /accounts/status to report live status per account.
 */
async function probeConnection(connectionId: string): Promise<AccountStatus> {
  try {
    const connectors = new ReplitConnectors();
    const proxyOpts = { method: "GET", connectionId } as Parameters<typeof connectors.proxy>[2] & { connectionId: string };

    const resp = await connectors.proxy(
      "google-mail",
      `/gmail/v1/users/me/threads?maxResults=1&q=in:inbox`,
      proxyOpts,
    );

    const data = await resp.json() as {
      threads?: GmailThread[];
      error?: { message: string; status?: string };
    };

    if (data.error) {
      const isScope =
        data.error.message?.toLowerCase().includes("insufficient") ||
        data.error.status === "PERMISSION_DENIED";
      return isScope ? "scope" : "unavailable";
    }

    return "ok";
  } catch {
    return "unavailable";
  }
}

// ─── GET /inbox/threads ──────────────────────────────────────────────────────
// Single-account backward-compatible endpoint.
// Resolves the account from the server-side registry via optional ?accountId param.
// Falls back to the primary account (acc-pj-main) if none specified.
router.get("/threads", async (req, res) => {
  const keywordsParam = typeof req.query.keywords === "string" ? req.query.keywords : "";
  const sendersParam = typeof req.query.senders === "string" ? req.query.senders : "";
  const labelsParam = typeof req.query.labels === "string" ? req.query.labels : "";
  const accountIdParam = typeof req.query.accountId === "string" ? req.query.accountId : "acc-pj-main";

  const keywords = keywordsParam ? keywordsParam.split(",").map((k) => k.trim()).filter(Boolean) : DEFAULT_KEYWORDS;
  const senders = sendersParam ? sendersParam.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const labels = labelsParam ? labelsParam.split(",").map((l) => l.trim()).filter(Boolean) : [];

  const connectionId = resolveConnection(accountIdParam);
  if (!connectionId) {
    res.json([]);
    return;
  }

  const q = buildQuery(keywords, senders, labels);
  const { threads, error } = await fetchThreadsForConnection(connectionId, q);

  if (error === "scope") {
    res.status(403).json({ error: "insufficient_scope" });
    return;
  }
  res.json(threads);
});

// ─── GET /inbox/threads/all ──────────────────────────────────────────────────
// Multi-account fan-out.
// Client sends: ?accountIds=acc-pj-main,acc-807foodcoop,...
// Server resolves connections from the trusted registry.
// Accounts not in the registry or with no connectionId → immediately "no-connection", skipped.
router.get("/threads/all", async (req, res) => {
  const keywordsParam = typeof req.query.keywords === "string" ? req.query.keywords : "";
  const sendersParam = typeof req.query.senders === "string" ? req.query.senders : "";
  const labelsParam = typeof req.query.labels === "string" ? req.query.labels : "";
  const accountIdsParam = typeof req.query.accountIds === "string" ? req.query.accountIds : "";
  const accountLabelsParam = typeof req.query.accountLabels === "string" ? req.query.accountLabels : "";

  const keywords = keywordsParam ? keywordsParam.split(",").map((k) => k.trim()).filter(Boolean) : DEFAULT_KEYWORDS;
  const senders = sendersParam ? sendersParam.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const labels = labelsParam ? labelsParam.split(",").map((l) => l.trim()).filter(Boolean) : [];

  const accountIds = accountIdsParam ? accountIdsParam.split(",").map((s) => s.trim()).filter(Boolean) : Object.keys(ACCOUNT_ENV_VAR_NAMES);
  const labelMap: Record<string, string> = {};
  if (accountLabelsParam) {
    accountLabelsParam.split(",").forEach((pair) => {
      const [id, ...rest] = pair.split(":");
      if (id) labelMap[id.trim()] = rest.join(":").trim();
    });
  }

  const q = buildQuery(keywords, senders, labels);
  const accountStatuses: Record<string, AccountStatus> = {};
  const enriched: EnrichedEmailThread[] = [];
  const seenIds = new Set<string>();

  await Promise.all(
    accountIds.map(async (accountId) => {
      const connectionId = resolveConnection(accountId);

      if (!connectionId) {
        accountStatuses[accountId] = "no-connection";
        return;
      }

      const { threads, error } = await fetchThreadsForConnection(connectionId, q);
      accountStatuses[accountId] = error ?? "ok";

      const accountLabel = labelMap[accountId] ?? accountId;

      for (const t of threads) {
        const key = `${accountId}:${t.id}`;
        if (!seenIds.has(key)) {
          seenIds.add(key);
          enriched.push({ ...t, accountId, accountLabel });
        }
      }
    }),
  );

  enriched.sort((a, b) => {
    const da = new Date(a.date).getTime() || 0;
    const db = new Date(b.date).getTime() || 0;
    return db - da;
  });

  res.json({ threads: enriched, accountStatuses });
});

// ─── GET /inbox/accounts/status ─────────────────────────────────────────────
// Probes each requested accountId and returns live connection status + metadata.
// Used by InboxSetupPage to show per-account status without fetching full threads.
// Query params: accountIds — comma-separated list of accountIds
//
// Returns: Record<accountId, { status, envVar }>
//   status:  "ok" | "scope" | "unavailable" | "no-connection"
//   envVar:  the environment variable name to set to wire this account
router.get("/accounts/status", async (req, res) => {
  const accountIdsParam = typeof req.query.accountIds === "string" ? req.query.accountIds : "";
  const accountIds = accountIdsParam
    ? accountIdsParam.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  if (accountIds.length === 0) {
    res.json({});
    return;
  }

  const result: Record<string, { status: AccountStatus; envVar: string }> = {};

  await Promise.all(
    accountIds.map(async (accountId) => {
      const envVar = ACCOUNT_ENV_VAR_NAMES[accountId] ?? "";
      const connectionId = resolveConnection(accountId);
      if (!connectionId) {
        result[accountId] = { status: "no-connection", envVar };
        return;
      }
      const status = await probeConnection(connectionId);
      result[accountId] = { status, envVar };
    }),
  );

  res.json(result);
});

// ─── Archive search ────────────────────────────────────────────────────────
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
    const primaryConnectionId = resolveConnection("acc-pj-main");

    const qParam = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const dateFrom = typeof req.query.dateFrom === "string" ? req.query.dateFrom.trim() : "";
    const dateTo = typeof req.query.dateTo === "string" ? req.query.dateTo.trim() : "";
    const preset = typeof req.query.preset === "string" ? req.query.preset.trim() : "";
    const includeBody = req.query.includeBody === "true";
    const maxResults = Math.min(
      50,
      parseInt(typeof req.query.maxResults === "string" ? req.query.maxResults : "30", 10) || 30,
    );

    const parts: string[] = [];
    if (preset && PRESET_QUERIES[preset]) parts.push(`(${PRESET_QUERIES[preset]})`);
    if (qParam) parts.push(`(${qParam})`);
    if (dateFrom) parts.push(`after:${dateFrom.replace(/-/g, "/")}`);
    if (dateTo) parts.push(`before:${dateTo.replace(/-/g, "/")}`);

    if (parts.length === 0) {
      res.json([]);
      return;
    }

    const q = parts.join(" ");

    const proxyOpts: Parameters<typeof connectors.proxy>[2] & { connectionId?: string } = { method: "GET" };
    if (primaryConnectionId) (proxyOpts as Record<string, unknown>).connectionId = primaryConnectionId;

    const listResp = await connectors.proxy(
      "google-mail",
      `/gmail/v1/users/me/threads?maxResults=${maxResults}&q=${encodeURIComponent(q)}`,
      proxyOpts,
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
          const format = includeBody ? "full" : "metadata";
          const metaHeaders = includeBody ? "" : "&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date";

          const msgResp = await connectors.proxy(
            "google-mail",
            `/gmail/v1/users/me/threads/${t.id}?format=${format}${metaHeaders}`,
            proxyOpts,
          );

          const msgData = await msgResp.json() as {
            id: string;
            messages?: GmailMessage[];
            snippet?: string;
          };

          const messages = msgData.messages ?? [];
          const firstMsg = messages[0];
          const latestMsg = messages[messages.length - 1];
          const headers = latestMsg?.payload?.headers;

          const result: Record<string, unknown> = {
            id: t.id,
            subject: pickHeader(headers, "Subject") || "(no subject)",
            from: pickHeader(headers, "From") || "Unknown",
            snippet: msgData.snippet ?? t.snippet ?? "",
            date: pickHeader(headers, "Date") || new Date().toISOString(),
          };

          if (includeBody) {
            result.body = extractPlainText(firstMsg?.payload);
          }

          return result;
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

// ─── Single thread body (on-demand) ────────────────────────────────────────
router.get("/thread/:id/body", async (req, res) => {
  try {
    const connectors = new ReplitConnectors();
    const threadId = req.params.id;
    const primaryConnectionId = resolveConnection("acc-pj-main");

    const proxyOpts: Parameters<typeof connectors.proxy>[2] & { connectionId?: string } = { method: "GET" };
    if (primaryConnectionId) (proxyOpts as Record<string, unknown>).connectionId = primaryConnectionId;

    const msgResp = await connectors.proxy(
      "google-mail",
      `/gmail/v1/users/me/threads/${threadId}?format=full`,
      proxyOpts,
    );

    const msgData = await msgResp.json() as {
      id: string;
      messages?: GmailMessage[];
      error?: { message: string };
    };

    if (msgData.error) {
      logger.warn({ err: msgData.error, threadId }, "inbox/thread/body: Gmail API error");
      const isScope =
        msgData.error.message?.toLowerCase().includes("insufficient") ||
        (msgData.error as unknown as { status?: string }).status === "PERMISSION_DENIED";
      if (isScope) {
        res.status(403).json({ error: "insufficient_scope", message: msgData.error.message });
      } else {
        res.status(502).json({ error: "gmail_error", message: msgData.error.message });
      }
      return;
    }

    const firstMsg = (msgData.messages ?? [])[0];
    const body = extractPlainText(firstMsg?.payload, 1000);

    res.json({ body });
  } catch (err) {
    logger.warn({ err }, "inbox/thread/body: Gmail connector unavailable");
    res.status(502).json({ error: "unavailable" });
  }
});

export default router;
