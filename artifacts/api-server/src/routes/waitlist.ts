/**
 * Waitlist route — Legacy Asset Manager suite
 *
 * POST /api/waitlist
 *   Body: { name, email, org?, role?, tools?: string[] }
 *   - Appends entry to WAITLIST.md in the monorepo root
 *   - Sends a notification email via Gmail (google-mail connector)
 *
 * No auth required — this is a public endpoint for the product landing page.
 * Security: all user-supplied strings are header-injection-safe (CR/LF stripped)
 * before any header use, and user data is kept in the email body, not the Subject.
 * Rate limited: 5 submissions per IP per 15 minutes.
 */

import { Router, type IRouter } from "express";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { ReplitConnectors } from "@replit/connectors-sdk";
import { logger } from "../lib/logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router: IRouter = Router();

// ── Header-injection guard ─────────────────────────────────────────────────────
// Strip CR, LF, and NUL from any string before it touches an email header.
// User-supplied data should go in the body only; the Subject line uses a fixed
// template so this is a defence-in-depth measure.
function sanitizeForHeader(s: string): string {
  return s.replace(/[\r\n\x00]/g, " ").trim();
}

// ── IP rate limiter ───────────────────────────────────────────────────────────
// 5 submissions per IP per 15-minute window. Public endpoint, so lightweight
// abuse protection is essential.
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 5;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_MAX) return false;
  bucket.count += 1;
  return true;
}

// ── WAITLIST_PATH ──────────────────────────────────────────────────────────────
const _srcPath = join(__dirname, "../../../../WAITLIST.md");
const _distPath = join(__dirname, "../../../WAITLIST.md");

function getWaitlistPath(): string {
  if (process.env.WAITLIST_PATH) return process.env.WAITLIST_PATH;
  if (existsSync(_srcPath)) return _srcPath;
  return _distPath;
}

function ensureWaitlistFile(filePath: string): void {
  if (!existsSync(filePath)) {
    const dir = dirname(filePath);
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      filePath,
      [
        "# Legacy Asset Manager — Waitlist",
        "",
        "Entries are appended automatically via POST /api/waitlist.",
        "",
        "_(New entries below)_",
        "",
      ].join("\n"),
      "utf-8",
    );
  }
}

// ── Gmail send helper ─────────────────────────────────────────────────────────
// Uses the google-mail connector (already added to this Repl).
// Sends to WAITLIST_NOTIFY_EMAIL if set; falls back to HEADWATERS_OWNER_EMAIL.

async function sendWaitlistNotification(entry: {
  name: string;
  email: string;
  org: string;
  role: string;
  tools: string[];
}): Promise<void> {
  const to = process.env.WAITLIST_NOTIFY_EMAIL ?? process.env.HEADWATERS_OWNER_EMAIL;
  if (!to) {
    logger.warn("[waitlist] No WAITLIST_NOTIFY_EMAIL or HEADWATERS_OWNER_EMAIL set — skipping email notification");
    return;
  }

  const toolsLine =
    entry.tools.length > 0 ? entry.tools.join(", ") : "Not specified";

  // All user-supplied content stays in the body — not in headers — to prevent
  // header injection. sanitizeForHeader is still applied to the To address
  // (which comes from a server-side env var, not user input) as defence-in-depth.
  const body = [
    `New Legacy Asset Manager waitlist sign-up`,
    ``,
    `Name:         ${entry.name}`,
    `Email:        ${entry.email}`,
    `Organization: ${entry.org || "—"}`,
    `Role:         ${entry.role || "—"}`,
    `Tools:        ${toolsLine}`,
    ``,
    `Submitted:    ${new Date().toISOString()}`,
  ].join("\n");

  // Subject is a fixed string with no user input — avoiding the injection vector entirely.
  // The sanitizeForHeader call on `to` is defence-in-depth (env var, not user input).
  const safeToAddress = sanitizeForHeader(to);

  // Gmail API requires base64url-encoded RFC 2822 message
  const raw = [
    `To: ${safeToAddress}`,
    `From: me`,
    `Subject: [LAM Waitlist] New access request`,
    `Content-Type: text/plain; charset=UTF-8`,
    ``,
    body,
  ].join("\r\n");

  const encoded = Buffer.from(raw)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const connectors = new ReplitConnectors();
  const res = await connectors.proxy("google-mail", "/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ raw: encoded }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    logger.warn({ status: res.status, body: text }, "[waitlist] Gmail notification failed");
  } else {
    logger.info({ to }, "[waitlist] Gmail notification sent");
  }
}

// ── POST /api/waitlist ────────────────────────────────────────────────────────

const MARKER = "_(New entries below)_";
const MAX_NAME = 200;
const MAX_EMAIL = 200;
const MAX_ORG = 300;
const MAX_ROLE = 200;

router.post("/", async (req, res) => {
  const ip = req.ip ?? "unknown";
  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: "Too many requests — please wait before submitting again." });
    return;
  }

  const { name, email, org, role, tools } = req.body as {
    name?: unknown;
    email?: unknown;
    org?: unknown;
    role?: unknown;
    tools?: unknown;
  };

  if (typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({ error: "name is required" });
    return;
  }
  if (typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "a valid email address is required" });
    return;
  }
  if (name.trim().length > MAX_NAME || email.trim().length > MAX_EMAIL) {
    res.status(400).json({ error: "name or email too long" });
    return;
  }

  const cleanName = name.trim().slice(0, MAX_NAME);
  const cleanEmail = email.trim().slice(0, MAX_EMAIL);
  const cleanOrg = typeof org === "string" ? org.trim().slice(0, MAX_ORG) : "";
  const cleanRole = typeof role === "string" ? role.trim().slice(0, MAX_ROLE) : "";
  const cleanTools = Array.isArray(tools)
    ? (tools as unknown[]).filter((t): t is string => typeof t === "string").slice(0, 10)
    : [];

  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 16);
  const toolsLine = cleanTools.length > 0 ? cleanTools.join(", ") : "—";

  const entry = [
    "",
    "---",
    `## ${cleanName} · ${timestamp}`,
    "",
    `**Name:** ${cleanName}`,
    `**Email:** ${cleanEmail}`,
    `**Organization:** ${cleanOrg || "—"}`,
    `**Role:** ${cleanRole || "—"}`,
    `**Tools of interest:** ${toolsLine}`,
    "",
  ].join("\n");

  try {
    const filePath = getWaitlistPath();
    ensureWaitlistFile(filePath);
    let content = readFileSync(filePath, "utf-8");
    const markerIdx = content.indexOf(MARKER);
    if (markerIdx !== -1) {
      const insertAt = markerIdx + MARKER.length;
      content = content.slice(0, insertAt) + entry + content.slice(insertAt);
    } else {
      content += entry;
    }
    writeFileSync(filePath, content, "utf-8");
    logger.info({ name: cleanName, email: cleanEmail }, "[waitlist] entry saved");
  } catch (err) {
    logger.error({ err }, "[waitlist] failed to write entry");
    res.status(500).json({ error: "Failed to record your request. Please try again." });
    return;
  }

  // Fire-and-forget email — don't fail the request if Gmail is unavailable
  sendWaitlistNotification({
    name: cleanName,
    email: cleanEmail,
    org: cleanOrg,
    role: cleanRole,
    tools: cleanTools,
  }).catch((err) => logger.warn({ err }, "[waitlist] email notification error"));

  res.json({ ok: true });
});

export default router;
