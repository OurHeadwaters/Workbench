/**
 * Capture routes
 *
 * GET  /api/capture/nonce  — issue a short-lived HMAC-signed nonce (no auth required,
 *                            rate-limited). The client fetches this before every POST.
 * POST /api/capture        — append a thought to CAPTURE.md. Requires a valid nonce
 *                            issued by GET /nonce (max 5 minutes old). The HMAC key
 *                            (CAPTURE_HMAC_KEY) is server-only and never sent to clients.
 *
 * Key loading order:
 *   1. CAPTURE_HMAC_KEY env var (set as a Replit Secret in production — NOT in .replit)
 *   2. .local/capture-hmac-key.txt  (auto-generated on first run; .local/ is gitignored)
 *   3. If neither exists the /nonce endpoint returns 503 and POST returns 403.
 *
 * This design requires no static credential in the client bundle: the nonce is
 * server-issued, short-lived, and validated server-side via HMAC.
 */
import { Router, type IRouter } from "express";
import fs from "fs";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createHmac, timingSafeEqual, randomBytes } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── CAPTURE_PATH ─────────────────────────────────────────────────────────────
// Resolved per-request so that process.env.CAPTURE_PATH overrides work even
// when it is set after module load (e.g., in tests using beforeEach).
const _srcPath = join(__dirname, "../../../../CAPTURE.md");
const _distPath = join(__dirname, "../../../CAPTURE.md");

function getCapturePath(): string {
  if (process.env.CAPTURE_PATH) return process.env.CAPTURE_PATH;
  return existsSync(_srcPath) ? _srcPath : _distPath;
}

// ── HMAC key ──────────────────────────────────────────────────────────────────
// Never stored in .replit. Loaded from a Replit Secret (CAPTURE_HMAC_KEY) or
// auto-generated into .local/capture-hmac-key.txt (gitignored).
function loadOrCreateHmacKey(): string {
  if (process.env.CAPTURE_HMAC_KEY) return process.env.CAPTURE_HMAC_KEY;
  // Locate .local/ relative to the monorepo root (4 dirs above src/routes/,
  // same logic as CAPTURE_PATH so it works from both src/ and dist/).
  const rootGuess = join(__dirname, "../../../../");
  const keyDir = join(rootGuess, ".local");
  const keyFile = join(keyDir, "capture-hmac-key.txt");
  if (existsSync(keyFile)) {
    return readFileSync(keyFile, "utf-8").trim();
  }
  const generated = randomBytes(32).toString("hex");
  try {
    mkdirSync(keyDir, { recursive: true });
    writeFileSync(keyFile, generated, { mode: 0o600 });
  } catch {
    // If we can't write the key file, return it transiently (will regenerate
    // on next restart, invalidating any outstanding nonces — acceptable).
  }
  return generated;
}

const HMAC_KEY: string = loadOrCreateHmacKey();
const NONCE_TTL_MS = 5 * 60 * 1000;

const router: IRouter = Router();
const ENTRIES_MARKER = "_(Paste new entries below this line.)_";

const VALID_URGENCY = new Set(["now", "next", "later"]);
const MAX_THOUGHT_LENGTH = 2000;
const MAX_CONSTELLATION_LENGTH = 100;

// ── Rate limiter ──────────────────────────────────────────────────────────────
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 15;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

/** Clear all rate-limit buckets — for use in tests only. */
export function __clearRateLimiter(): void {
  rateBuckets.clear();
}

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

// ── Nonce helpers ─────────────────────────────────────────────────────────────

function signNonce(ts: number, rand: string): string {
  const msg = `${ts}.${rand}`;
  return createHmac("sha256", HMAC_KEY).update(msg).digest("hex");
}

function verifyNonce(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [tsStr, rand, sig] = parts as [string, string, string];
  const ts = parseInt(tsStr, 10);
  if (!Number.isFinite(ts)) return false;
  if (Date.now() - ts > NONCE_TTL_MS) return false;
  const expectedSig = signNonce(ts, rand);
  if (sig.length !== expectedSig.length) return false;
  return timingSafeEqual(Buffer.from(sig, "utf8"), Buffer.from(expectedSig, "utf8"));
}

// ── GET /nonce ────────────────────────────────────────────────────────────────

router.get("/nonce", (req, res) => {
  const ip = req.ip ?? "unknown";
  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: "Too many requests" });
    return;
  }
  const ts = Date.now();
  const rand = randomBytes(12).toString("hex");
  const sig = signNonce(ts, rand);
  const token = `${ts}.${rand}.${sig}`;
  res.json({ token, expiresAt: ts + NONCE_TTL_MS });
});

// ── POST / ────────────────────────────────────────────────────────────────────

router.post("/", (req, res) => {
  const ip = req.ip ?? "unknown";
  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: "Too many requests — slow down" });
    return;
  }

  const { thought, constellation, urgency, nonce } = req.body as {
    thought?: unknown;
    constellation?: unknown;
    urgency?: unknown;
    nonce?: unknown;
  };

  if (typeof nonce !== "string" || !verifyNonce(nonce)) {
    res.status(403).json({ error: "Invalid or expired capture token — refresh and try again" });
    return;
  }

  if (typeof thought !== "string" || thought.trim().length === 0) {
    res.status(400).json({ error: "thought is required" });
    return;
  }
  if (thought.trim().length > MAX_THOUGHT_LENGTH) {
    res.status(400).json({ error: `thought must be ${MAX_THOUGHT_LENGTH} characters or fewer` });
    return;
  }
  if (typeof urgency !== "string" || !VALID_URGENCY.has(urgency)) {
    res.status(400).json({ error: "urgency must be one of: now, next, later" });
    return;
  }
  const rawConstellation =
    typeof constellation === "string" ? constellation.trim() : "";
  if (rawConstellation.length > MAX_CONSTELLATION_LENGTH) {
    res.status(400).json({
      error: `constellation must be ${MAX_CONSTELLATION_LENGTH} characters or fewer`,
    });
    return;
  }
  const constellationValue = rawConstellation.length > 0 ? rawConstellation : "Unsure";

  const now = new Date();
  const timestamp = now.toISOString().replace("T", " ").slice(0, 16);
  const words = thought.trim().split(/\s+/);
  const shortName = words.slice(0, 7).join(" ") + (words.length > 7 ? "…" : "");

  const entry = [
    "",
    "---",
    `## ${shortName}`,
    "",
    `**Raw thought:** ${thought.trim()}`,
    "",
    `**Constellation:** ${constellationValue}`,
    "",
    `**Connects to:** `,
    "",
    `**Urgency:** ${urgency}`,
    "",
    `**Notes:** _Captured via handbook app — ${timestamp}_`,
    "---",
    "",
  ].join("\n");

  try {
    const capturePath = getCapturePath();
    let content = fs.readFileSync(capturePath, "utf-8");
    const markerIdx = content.indexOf(ENTRIES_MARKER);
    if (markerIdx !== -1) {
      const insertAt = markerIdx + ENTRIES_MARKER.length;
      content = content.slice(0, insertAt) + entry + content.slice(insertAt);
    } else {
      content += entry;
    }
    fs.writeFileSync(capturePath, content, "utf-8");
    res.json({ ok: true });
  } catch (err) {
    console.error("[capture] POST / error:", err);
    res.status(500).json({ error: "Failed to write to CAPTURE.md" });
  }
});

export default router;
