/**
 * kits — Headwaters Kits buy-a-kit loop closure.
 *
 * Decision context (Kitchen Table, May 25 2026):
 *   - Decision 3: The Arc is fully sovereign. No integration.
 *     Stewards self-register. Buy-a-kit loop closes WITHOUT touching The Arc.
 *   - Decision 4: TSP sells (Stripe rails), api-server + zone apps deliver.
 *
 * Routes:
 *
 *   POST /kits/purchase-webhook
 *     Called by TSP (xrpl-design-hub.replit.app) after a confirmed kit purchase.
 *     Authenticated by X-Webhook-Secret header (must match KIT_WEBHOOK_SECRET env var).
 *     Generates a 30-day signed access token, persists it, sends the delivery email.
 *     Body: { kit_id, buyer_email, buyer_name, purchase_id }
 *
 *   GET /kits/access/:token
 *     Verifies the token and returns the kit access payload (JSON).
 *     TSP or a simple landing page can call this to gate kit content.
 *     Returns 404 if unknown, 410 if expired.
 *
 *   GET /kits/registry
 *     Returns the full kit list (public — no auth). Useful for TSP and zone apps.
 *
 * Token storage: JSON file at {cwd}/data/kit-tokens.json
 *   Plain file — same pattern as pgv2-startup-expenses.json.
 *   No shared DB schema change required. Survives server restart.
 */

import { Router, type IRouter, type Request, type Response } from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { logger } from "../lib/logger";
import { getKit, KITS } from "../lib/kitsRegistry";
import { sendKitDeliveryEmail } from "../lib/kitsMailer";

const router: IRouter = Router();

// ── Token store ───────────────────────────────────────────────────────────────

const DATA_DIR = path.resolve(process.cwd(), "data");
const TOKENS_FILE = path.join(DATA_DIR, "kit-tokens.json");
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface TokenRecord {
  token: string;
  kit_id: string;
  buyer_email: string;
  buyer_name: string;
  purchase_id: string;
  created_at: string;
  expires_at: string;
}

type TokenStore = Record<string, TokenRecord>;

function readTokenStore(): TokenStore {
  try {
    if (!fs.existsSync(TOKENS_FILE)) return {};
    return JSON.parse(fs.readFileSync(TOKENS_FILE, "utf-8")) as TokenStore;
  } catch {
    return {};
  }
}

function writeTokenStore(store: TokenStore): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(store, null, 2), "utf-8");
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function accessUrl(token: string): string {
  const base =
    process.env.API_BASE_URL ??
    (process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : "http://localhost:8081");
  return `${base}/api/kits/access/${token}`;
}

// ── Webhook secret guard ──────────────────────────────────────────────────────

function webhookSecretOk(req: Request): boolean {
  const secret = process.env.KIT_WEBHOOK_SECRET;
  if (!secret) {
    logger.warn("[kits] KIT_WEBHOOK_SECRET not set — webhook endpoint disabled");
    return false;
  }
  const provided = req.headers["x-webhook-secret"];
  if (typeof provided !== "string") return false;
  return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(secret));
}

// ── POST /kits/purchase-webhook ───────────────────────────────────────────────

const PurchaseWebhookSchema = z.object({
  kit_id: z.string().min(1).max(100),
  buyer_email: z.string().email(),
  buyer_name: z.string().min(1).max(200),
  purchase_id: z.string().min(1).max(200),
});

router.post("/purchase-webhook", async (req: Request, res: Response) => {
  if (!webhookSecretOk(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = PurchaseWebhookSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { kit_id, buyer_email, buyer_name, purchase_id } = parsed.data;

  const kit = getKit(kit_id);
  if (!kit) {
    res.status(422).json({ error: `Unknown kit_id: ${kit_id}` });
    return;
  }

  const token = generateToken();
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + TOKEN_TTL_MS);

  const record: TokenRecord = {
    token,
    kit_id,
    buyer_email,
    buyer_name,
    purchase_id,
    created_at: createdAt.toISOString(),
    expires_at: expiresAt.toISOString(),
  };

  try {
    const store = readTokenStore();
    store[token] = record;
    writeTokenStore(store);
  } catch (err) {
    logger.error({ err, kit_id, purchase_id }, "[kits] failed to persist token");
    res.status(500).json({ error: "Failed to record purchase. Contact support." });
    return;
  }

  const url = accessUrl(token);

  const mailResult = await sendKitDeliveryEmail({
    to: buyer_email,
    buyerName: buyer_name,
    kit,
    accessUrl: url,
    expiresAt,
  });

  logger.info(
    { kit_id, purchase_id, buyer_email, mailStatus: mailResult.status },
    "[kits] purchase processed",
  );

  res.status(201).json({
    ok: true,
    token,
    access_url: url,
    expires_at: expiresAt.toISOString(),
    mail_status: mailResult.status,
  });
});

// ── GET /kits/access/:token ───────────────────────────────────────────────────

router.get("/access/:token", (req: Request, res: Response) => {
  const { token } = req.params;
  if (!token || token.length > 128) {
    res.status(400).json({ error: "Invalid token" });
    return;
  }

  const store = readTokenStore();
  const record = store[token];

  if (!record) {
    res.status(404).json({ error: "Token not found" });
    return;
  }

  if (new Date() > new Date(record.expires_at)) {
    res.status(410).json({ error: "Token expired", expired_at: record.expires_at });
    return;
  }

  const kit = getKit(record.kit_id);
  if (!kit) {
    res.status(500).json({ error: "Kit record inconsistency — contact support" });
    return;
  }

  res.json({
    ok: true,
    kit,
    buyer_name: record.buyer_name,
    purchase_id: record.purchase_id,
    expires_at: record.expires_at,
  });
});

// ── GET /kits/registry ────────────────────────────────────────────────────────

router.get("/registry", (_req: Request, res: Response) => {
  res.json({ kits: Object.values(KITS) });
});

export default router;
