/**
 * kits — Headwaters Kits: purchase loop closure + kit builder platform.
 *
 * Decision context (Kitchen Table, May 25 2026):
 *   - Decision 3: The Arc is fully sovereign. No integration.
 *     Stewards self-register. Buy-a-kit loop closes WITHOUT touching The Arc.
 *   - Decision 4: TSP sells (Stripe rails), api-server + zone apps deliver.
 *
 * Legacy purchase-webhook routes (TSP → delivery email):
 *   POST /kits/purchase-webhook
 *   GET  /kits/access/:token
 *   GET  /kits/registry
 *
 * Kit Builder routes (owner-only, DB-backed):
 *   GET  /kits/list               — public, all published kits
 *   GET  /kits/drafts             — owner-only, all owner's kits
 *   POST /kits/draft              — owner-only, create a kit draft
 *   POST /kits/:id/codetry        — owner-only, run Codetry filter (scoped to owner)
 *   POST /kits/:id/publish        — owner-only, Stripe product+price, mark published
 *   POST /kits/gord/chat          — owner-only, single-turn kit-builder GORD chat
 *   POST /kits/gord-draft         — owner-only, GORD conversation → save draft + Codetry
 *
 * Stripe Connect:
 *   POST /kits/connect-onboard    — owner-only, create Connect account + return onboarding URL
 *
 * Auth: requireKitOwnerAuth — accepts EITHER:
 *   - LIBRARY_OWNER_TOKEN (sent as x-library-owner-token or Bearer), used by North Star / GORD
 *   - Clerk bookkeeper "owner" role, used by Headwaters Books
 */

import { Router, type IRouter, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import { PgExpressRateLimitStore } from "../lib/rateLimit";
import crypto from "crypto";
import { z } from "zod";
import Stripe from "stripe";
import { logger } from "../lib/logger";
import { getKit, KITS } from "../lib/kitsRegistry";
import { sendKitDeliveryEmail, verifyResendToken } from "../lib/kitsMailer";
import { runCodetryFilter } from "../lib/codetryFilter";
import { requireKitOwnerAuth, requireFounderOnlyAuth, FOUNDER_OWNER_ID } from "../lib/kitAuth";
import { db, kitsTable, practitionerApplicationsTable, kitTokensTable, kitDeliveryFailuresTable, kitWebhookAttemptsTable } from "@workspace/db";
import { eq, and, gt, desc, isNull } from "drizzle-orm";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { clerkClient } from "@clerk/express";

const router: IRouter = Router();

// ── Shared kit draft creation helper ─────────────────────────────────────────
//
// Both POST /kits/draft and POST /kits/gord-draft use this to ensure consistent
// Stripe Connect account binding, owner scoping, and practitioner identity
// self-healing (clerkUserId) across both creation paths.

interface KitDraftData {
  title: string;
  description?: string | null;
  priceCents?: number;
  intendedAudience?: string | null;
  contentOutline?: Record<string, unknown>;
}

async function createKitDraftRecord(
  ownerId: string,
  data: KitDraftData,
): Promise<typeof kitsTable.$inferSelect> {
  let stripeAccountId: string | null = null;

  // For practitioners (non-founder Clerk users): look up their approved application
  // by email to bind the Stripe Connect account. Also self-heal clerkUserId if null.
  if (ownerId !== FOUNDER_OWNER_ID) {
    try {
      const clerkUser = await clerkClient.users.getUser(ownerId);
      const primaryEmail = clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId,
      )?.emailAddress;

      if (primaryEmail) {
        const [app] = await db
          .select({
            id: practitionerApplicationsTable.id,
            stripeAccountId: practitionerApplicationsTable.stripeAccountId,
            clerkUserId: practitionerApplicationsTable.clerkUserId,
          })
          .from(practitionerApplicationsTable)
          .where(
            and(
              eq(practitionerApplicationsTable.contactEmail, primaryEmail),
              eq(practitionerApplicationsTable.status, "approved"),
            ),
          )
          .limit(1);

        if (app) {
          stripeAccountId = app.stripeAccountId ?? null;

          // Self-heal: persist the real Clerk user ID once we know it
          if (!app.clerkUserId) {
            await db
              .update(practitionerApplicationsTable)
              .set({ clerkUserId: ownerId })
              .where(eq(practitionerApplicationsTable.id, app.id));
            logger.info({ appId: app.id, ownerId }, "kits: practitioner clerkUserId self-healed");
          }
        }
      }
    } catch (clerkErr) {
      logger.warn({ ownerId, clerkErr }, "kits: practitioner Stripe lookup failed (non-fatal)");
    }
  }

  const [kit] = await db
    .insert(kitsTable)
    .values({
      ownerId,
      title: data.title,
      description: data.description ?? null,
      priceCents: data.priceCents ?? 0,
      contentOutline: {
        ...(data.contentOutline ?? {}),
        intendedAudience: data.intendedAudience,
      },
      status: "draft",
      paymentRails: {},
      stripeAccountId,
    })
    .returning();

  if (!kit) throw new Error("Kit insert returned no rows");
  logger.info({ id: kit.id, ownerId, stripeAccountId }, "kit draft created");
  return kit;
}

// ── Stripe ────────────────────────────────────────────────────────────────────

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

// ── Token store (legacy purchase webhook, now DB-backed) ──────────────────────

const TOKEN_TTL_MS = 90 * 24 * 60 * 60 * 1000;

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function accessUrl(token: string): string {
  const base =
    process.env.API_BASE_URL ??
    (process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : "http://localhost:8081");
  return `${base}/kits/access/${token}`;
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

// ── Shared kit fulfillment helper ─────────────────────────────────────────────
//
// Used by both purchase-webhook (Stripe/TSP) and zaprite-webhook (Bitcoin).
// Generates a token, persists it to the token store, and sends the delivery
// email. Returns the token record and mail result so callers can respond.

interface FulfillKitPurchaseResult {
  token: string;
  accessUrl: string;
  expiresAt: Date;
  mailStatus: string;
}

async function fulfillKitPurchase(opts: {
  kit_id: string;
  buyer_email: string;
  buyer_name: string;
  purchase_id: string;
  logTag: string;
}): Promise<FulfillKitPurchaseResult | { error: string; status: number }> {
  const { kit_id, buyer_email, buyer_name, purchase_id, logTag } = opts;

  const kit = getKit(kit_id);
  if (!kit) return { error: `Unknown kit_id: ${kit_id}`, status: 422 };

  const token = generateToken();
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + TOKEN_TTL_MS);

  try {
    await db.insert(kitTokensTable).values({
      token,
      kitId: kit_id,
      buyerEmail: buyer_email.toLowerCase(),
      buyerName: buyer_name,
      purchaseId: purchase_id,
      createdAt,
      expiresAt,
    });
  } catch (err) {
    logger.error({ err, kit_id, purchase_id }, `${logTag} failed to persist token`);
    return { error: "Failed to record purchase. Contact support.", status: 500 };
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
    `${logTag} purchase processed`,
  );

  if (mailResult.status === "failed") {
    try {
      await db.insert(kitDeliveryFailuresTable).values({
        buyerEmail: buyer_email.toLowerCase(),
        kitId: kit_id,
        purchaseId: purchase_id,
        error: mailResult.error ?? null,
      });
    } catch (dbErr) {
      logger.error(
        { dbErr, kit_id, purchase_id },
        `${logTag} failed to persist delivery failure record`,
      );
    }
  }

  return { token, accessUrl: url, expiresAt, mailStatus: mailResult.status };
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

  const result = await fulfillKitPurchase({
    kit_id, buyer_email, buyer_name, purchase_id, logTag: "[kits]",
  });

  if ("error" in result) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  res.status(201).json({
    ok: true,
    token: result.token,
    access_url: result.accessUrl,
    expires_at: result.expiresAt.toISOString(),
    mail_status: result.mailStatus,
  });
});

// ── POST /kits/zaprite-webhook ────────────────────────────────────────────────
//
// Handles Zaprite Bitcoin payment completions for kit purchases.
//
// Zaprite sends a POST with:
//   Header  x-zaprite-signature: sha256=<hex_hmac_sha256_of_raw_body>
//   Body    { "type": "payment.completed", "data": { ... } }
//
// The kit seller should set the following in the Zaprite order metadata:
//   kit_id     — the kit registry ID (e.g. "economy-kit")
//   buyer_name — the buyer's display name
//
// buyer_email is read from data.customer.email or data.metadata.buyer_email.
//
// Environment variable required: ZAPRITE_WEBHOOK_SECRET

function validateZapriteSignature(req: Request): boolean {
  const secret = process.env.ZAPRITE_WEBHOOK_SECRET;
  if (!secret) {
    logger.warn("[kits] ZAPRITE_WEBHOOK_SECRET not set — Zaprite webhook disabled");
    return false;
  }

  const sigHeader = req.headers["x-zaprite-signature"];
  const sig = typeof sigHeader === "string" ? sigHeader : (sigHeader?.[0] ?? "");

  // Accept "sha256=<hex>" or bare "<hex>"
  const provided = sig.startsWith("sha256=") ? sig.slice(7) : sig;
  if (!provided) return false;

  const rawBody = req.rawBody;
  if (!rawBody) {
    logger.warn("[kits] rawBody missing — cannot verify Zaprite signature");
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(provided, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
}

// Extract the fields we need from Zaprite's payment.completed payload.
// Zaprite's payload shape (as of their v1 webhook API):
//   { type: "payment.completed", data: { customer: { email, name }, metadata: { kit_id, buyer_name, buyer_email } } }
interface ZapriteWebhookPayload {
  type?: string;
  event?: string;
  data?: {
    id?: string;
    orderId?: string;
    customer?: { email?: string; name?: string };
    metadata?: Record<string, string | undefined>;
  };
  // Some versions nest under "object" instead of "data"
  object?: {
    id?: string;
    customer?: { email?: string; name?: string };
    metadata?: Record<string, string | undefined>;
  };
}

function extractZapriteFields(body: ZapriteWebhookPayload): {
  eventType: string;
  purchaseId: string;
  kitId: string | null;
  buyerEmail: string | null;
  buyerName: string;
} {
  const eventType = body.type ?? body.event ?? "";
  const dataBlock = body.data ?? body.object ?? {};
  const meta = dataBlock.metadata ?? {};
  const customer = dataBlock.customer ?? {};

  const purchaseId =
    dataBlock.id ?? (body.data as { orderId?: string } | undefined)?.orderId ?? "zaprite-unknown";
  const kitId = meta["kit_id"] ?? null;
  const buyerEmail = customer.email ?? meta["buyer_email"] ?? null;
  const buyerName =
    meta["buyer_name"] ?? customer.name ?? "Valued Buyer";

  return { eventType, purchaseId, kitId, buyerEmail, buyerName };
}

// Exact allowlist of Zaprite event types that should trigger fulfillment.
const ZAPRITE_COMPLETION_EVENTS = new Set(["payment.completed", "order.paid", "invoice.paid"]);

router.post("/zaprite-webhook", async (req: Request, res: Response) => {
  if (!validateZapriteSignature(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const payload = req.body as ZapriteWebhookPayload;
  const { eventType, purchaseId, kitId, buyerEmail, buyerName } =
    extractZapriteFields(payload);

  // Only act on known payment completion events (exact allowlist)
  if (!ZAPRITE_COMPLETION_EVENTS.has(eventType)) {
    logger.info({ eventType, purchaseId }, "[kits/zaprite] ignoring non-completion event");
    res.json({ ok: true, ignored: true, eventType });
    return;
  }

  if (!kitId) {
    logger.warn({ purchaseId, payload }, "[kits/zaprite] missing kit_id in metadata");
    res.status(422).json({ error: "Missing kit_id in Zaprite order metadata" });
    return;
  }

  if (!buyerEmail) {
    logger.warn({ purchaseId, kitId }, "[kits/zaprite] missing buyer email in payload");
    res.status(422).json({ error: "Missing buyer email in Zaprite payload" });
    return;
  }

  const result = await fulfillKitPurchase({
    kit_id: kitId,
    buyer_email: buyerEmail,
    buyer_name: buyerName,
    purchase_id: purchaseId,
    logTag: "[kits/zaprite]",
  });

  if ("error" in result) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  res.status(201).json({
    ok: true,
    token: result.token,
    access_url: result.accessUrl,
    expires_at: result.expiresAt.toISOString(),
    mail_status: result.mailStatus,
  });
});

// ── GET /kits/resend — signed one-click resend link ──────────────────────────
//
// Validates a time-limited HMAC-signed link (generated by kitsMailer's
// generateResendLink and embedded in the delivery-failure alert email).
// No credentials are required — the signature IS the auth.
//
// Query params:
//   purchaseId — the original purchase ID
//   exp        — expiry as Unix ms (must still be in the future)
//   sig        — HMAC-SHA256(purchaseId + ":" + exp, KIT_WEBHOOK_SECRET) hex
//
// Returns a plain HTML page so the founder can trigger delivery by opening
// the link in any browser — no curl, no REST client, no terminal needed.

function resendHtmlPage(title: string, message: string, isError = false): string {
  const color = isError ? "#b91c1c" : "#166534";
  const bg = isError ? "#fef2f2" : "#f0fdf4";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} — Headwaters</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f5f5f4; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: #fff; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,.12); padding: 2rem 2.5rem; max-width: 480px; width: 90%; }
    h1 { font-size: 1.25rem; margin: 0 0 .75rem; color: ${color}; }
    p { margin: 0; color: #374151; line-height: 1.6; }
    .badge { display: inline-block; background: ${bg}; color: ${color}; border-radius: 4px; padding: .2rem .6rem; font-size: .85rem; font-weight: 600; margin-bottom: 1rem; }
    footer { margin-top: 1.5rem; font-size: .8rem; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Headwaters Kit Delivery</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <footer>Headwaters server — ${new Date().toUTCString()}</footer>
  </div>
</body>
</html>`;
}

router.get("/resend", async (req: Request, res: Response) => {
  const secret = process.env.KIT_WEBHOOK_SECRET;
  if (!secret) {
    res
      .status(500)
      .type("html")
      .send(
        resendHtmlPage(
          "Not Configured",
          "Resend links require KIT_WEBHOOK_SECRET to be set on the server.",
          true,
        ),
      );
    return;
  }

  const { purchaseId, exp, sig } = req.query as Record<string, string | undefined>;

  if (!purchaseId || !exp || !sig) {
    res
      .status(400)
      .type("html")
      .send(resendHtmlPage("Invalid Link", "This resend link is missing required parameters.", true));
    return;
  }

  const verification = verifyResendToken({ purchaseId, exp, sig, secret });
  if (!verification.ok) {
    const isExpired = verification.reason === "expired";
    res
      .status(isExpired ? 410 : 403)
      .type("html")
      .send(
        resendHtmlPage(
          isExpired ? "Link Expired" : "Invalid Link",
          isExpired
            ? "This resend link has expired (links are valid for 7 days). Check your email for a newer alert, or contact support."
            : "This resend link is not valid.",
          true,
        ),
      );
    return;
  }

  // Look up the most recent token record for this purchase
  const [record] = await db
    .select()
    .from(kitTokensTable)
    .where(eq(kitTokensTable.purchaseId, purchaseId))
    .orderBy(desc(kitTokensTable.createdAt))
    .limit(1);

  if (!record) {
    res
      .status(404)
      .type("html")
      .send(
        resendHtmlPage(
          "Purchase Not Found",
          `No kit purchase record found for ID: ${purchaseId}`,
          true,
        ),
      );
    return;
  }

  const kit = getKit(record.kitId);
  if (!kit) {
    res
      .status(500)
      .type("html")
      .send(
        resendHtmlPage(
          "Kit Not Found",
          `Kit "${record.kitId}" is not in the registry. Contact a developer.`,
          true,
        ),
      );
    return;
  }

  const url = accessUrl(record.token);
  const mailResult = await sendKitDeliveryEmail({
    to: record.buyerEmail,
    buyerName: record.buyerName,
    kit,
    accessUrl: url,
    expiresAt: record.expiresAt,
  });

  logger.info(
    { purchaseId, kitId: record.kitId, buyerEmail: record.buyerEmail, mailStatus: mailResult.status },
    "[kits/resend-link] kit resent via signed link",
  );

  if (mailResult.status === "failed") {
    res
      .status(500)
      .type("html")
      .send(
        resendHtmlPage(
          "Send Failed",
          `Could not send the delivery email to ${record.buyerEmail}. Error: ${mailResult.error ?? "unknown"}. Please try again or check the Gmail connector.`,
          true,
        ),
      );
    return;
  }

  res.type("html").send(
    resendHtmlPage(
      "Kit Resent",
      `Delivery email sent to <strong>${record.buyerEmail}</strong> for kit <em>${kit.name}</em>. Done.`,
    ),
  );
});

// ── POST /kits/resend ─────────────────────────────────────────────────────────
//
// Looks up any non-expired token for the given email address and re-sends the
// delivery email. Always returns 200 so we don't leak whether the email is in
// the system. The caller can use the `sent` field to show appropriate UI.
//
// Rate-limited per IP: 5 requests per 15 minutes to prevent email enumeration.

const resendRateLimitStore = new PgExpressRateLimitStore(15 * 60 * 1000, "kits:resend");

const resendRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many resend requests — please try again later." },
  store: resendRateLimitStore,
  // req.ip is resolved by Express using the trust-proxy setting (one hop),
  // which prevents X-Forwarded-For spoofing. No custom keyGenerator needed.
});

/** Reset the resend rate-limit store — for use in tests only. */
export function __clearResendRateLimiter(): void {
  void resendRateLimitStore.resetAll();
}

const ResendSchema = z.object({
  email: z.string().email(),
});

router.post("/resend", resendRateLimit, async (req: Request, res: Response) => {
  const parsed = ResendSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { email } = parsed.data;
  const now = new Date();

  const active = await db
    .select()
    .from(kitTokensTable)
    .where(
      and(
        eq(kitTokensTable.buyerEmail, email.toLowerCase()),
        gt(kitTokensTable.expiresAt, now),
      ),
    )
    .orderBy(desc(kitTokensTable.createdAt))
    .limit(1);

  if (active.length === 0) {
    res.json({ ok: true, sent: false });
    return;
  }

  const record = active[0]!;
  const kit = getKit(record.kitId);

  if (!kit) {
    res.json({ ok: true, sent: false });
    return;
  }

  const url = accessUrl(record.token);

  const mailResult = await sendKitDeliveryEmail({
    to: record.buyerEmail,
    buyerName: record.buyerName,
    kit,
    accessUrl: url,
    expiresAt: record.expiresAt,
  });

  logger.info(
    { email, kit_id: record.kitId, mailStatus: mailResult.status },
    "[kits/resend] resend requested",
  );

  res.json({ ok: true, sent: true, mailStatus: mailResult.status });
});

// ── GET /kits/tokens — owner-only, list all buyer tokens with expiry status ───
//
// Returns every row in kit_tokens, ordered most-recent first.
// Each row includes an `expired` boolean so the UI can highlight stale links
// without the caller having to compare timestamps.
//
// Auth: requireFounderOnlyAuth — founder token (North Star/GORD) or Clerk bookkeeper owner.
// Practitioners are explicitly excluded: this endpoint returns all buyer rows globally,
// not scoped to a single kit owner, so it must be restricted to the founder.

router.get("/tokens", requireFounderOnlyAuth, async (_req: Request, res: Response) => {
  const now = new Date();

  const rows = await db
    .select()
    .from(kitTokensTable)
    .orderBy(desc(kitTokensTable.createdAt));

  const tokens = rows.map((r) => ({
    token: r.token,
    kitId: r.kitId,
    buyerEmail: r.buyerEmail,
    buyerName: r.buyerName,
    purchaseId: r.purchaseId,
    createdAt: r.createdAt.toISOString(),
    expiresAt: r.expiresAt.toISOString(),
    expired: r.expiresAt < now,
  }));

  res.json({ ok: true, tokens });
});

// ── POST /kits/token/:token/extend — founder-only, extend a token's expiry ────
//
// Extends a buyer's kit access token by another TOKEN_TTL_MS (90 days) from
// the later of now or the token's current expiresAt, whichever is further out.
// Useful when a buyer returns after their link has expired or is about to expire.
//
// Auth: requireFounderOnlyAuth — practitioners excluded to prevent cross-tenant
// extension of another seller's buyer links.

router.post("/token/:token/extend", requireFounderOnlyAuth, async (req: Request, res: Response) => {
  const rawToken = req.params["token"];
  const token = Array.isArray(rawToken) ? (rawToken[0] ?? "") : (rawToken ?? "");
  if (!token || token.length > 128) {
    res.status(400).json({ error: "Invalid token" });
    return;
  }

  const [record] = await db
    .select()
    .from(kitTokensTable)
    .where(eq(kitTokensTable.token, token))
    .limit(1);

  if (!record) {
    res.status(404).json({ error: "Token not found" });
    return;
  }

  const base = record.expiresAt > new Date() ? record.expiresAt : new Date();
  const newExpiresAt = new Date(base.getTime() + TOKEN_TTL_MS);

  await db
    .update(kitTokensTable)
    .set({ expiresAt: newExpiresAt })
    .where(eq(kitTokensTable.token, token));

  logger.info(
    { token: token.slice(0, 8) + "…", kitId: record.kitId, buyerEmail: record.buyerEmail, newExpiresAt },
    "[kits/token/extend] token extended by owner",
  );

  res.json({
    ok: true,
    token,
    kitId: record.kitId,
    buyerEmail: record.buyerEmail,
    buyerName: record.buyerName,
    previousExpiresAt: record.expiresAt.toISOString(),
    newExpiresAt: newExpiresAt.toISOString(),
  });
});

// ── GET /kits/access/:token ───────────────────────────────────────────────────
//
// Rate-limited per IP: 20 requests per 15 minutes to prevent token enumeration.

const accessRateLimitStore = new PgExpressRateLimitStore(15 * 60 * 1000, "kits:access");

const accessRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many access attempts — please try again later." },
  store: accessRateLimitStore,
});

/** Reset the access rate-limit store — for use in tests only. */
export function __clearAccessRateLimiter(): void {
  void accessRateLimitStore.resetAll();
}

router.get("/access/:token", accessRateLimit, async (req: Request, res: Response) => {
  const raw = req.params["token"];
  const token = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");
  if (!token || token.length > 128) {
    res.status(400).json({ error: "Invalid token" });
    return;
  }

  const [record] = await db
    .select()
    .from(kitTokensTable)
    .where(eq(kitTokensTable.token, token))
    .limit(1);

  if (!record) {
    res.status(404).json({ error: "Token not found" });
    return;
  }
  if (new Date() > record.expiresAt) {
    res.status(410).json({ error: "Token expired", expired_at: record.expiresAt.toISOString() });
    return;
  }

  const kit = getKit(record.kitId);
  if (!kit) {
    res.status(500).json({ error: "Kit record inconsistency — contact support" });
    return;
  }

  res.json({
    ok: true,
    kit,
    buyer_name: record.buyerName,
    purchase_id: record.purchaseId,
    expires_at: record.expiresAt.toISOString(),
  });
});

// ── GET /kits/handout ─────────────────────────────────────────────────────────
//
// Token-gated handout redirect.  Validates the buyer's kit token, looks up the
// handout URL by key from the kit registry, then issues a 302 redirect so the
// actual Drive/PDF URL is never exposed in the frontend bundle.
//
// Query params:
//   token — the buyer's 64-hex kit access token
//   key   — the stable handout slug (e.g. "wb-process-diagram")
//
// Rate-limited per IP: 60 requests per 15 minutes.

const handoutRateLimitStore = new PgExpressRateLimitStore(15 * 60 * 1000, "kits:handout");

const handoutRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests — please try again later." },
  store: handoutRateLimitStore,
});

/** Reset the handout rate-limit store — for use in tests only. */
export function __clearHandoutRateLimiter(): void {
  void handoutRateLimitStore.resetAll();
}

router.get("/handout", handoutRateLimit, async (req: Request, res: Response) => {
  const token = typeof req.query["token"] === "string" ? req.query["token"] : "";
  const key   = typeof req.query["key"]   === "string" ? req.query["key"]   : "";

  if (!token || token.length > 128) {
    res.status(400).json({ error: "Missing or invalid token" });
    return;
  }
  if (!key || key.length > 200) {
    res.status(400).json({ error: "Missing or invalid key" });
    return;
  }

  const [record] = await db
    .select()
    .from(kitTokensTable)
    .where(eq(kitTokensTable.token, token))
    .limit(1);

  if (!record) {
    res.status(404).json({ error: "Token not found" });
    return;
  }
  if (new Date() > record.expiresAt) {
    res.status(410).json({ error: "Token expired" });
    return;
  }

  const kit = getKit(record.kitId);
  if (!kit) {
    res.status(500).json({ error: "Kit record inconsistency — contact support" });
    return;
  }

  const handouts = kit.handouts ?? {};
  if (!(key in handouts)) {
    res.status(404).json({ error: "Handout not found" });
    return;
  }

  const destination = handouts[key];
  if (!destination) {
    res.status(503).json({ error: "This handout link is not yet active — check back soon or contact bobbie@ourheadwaters.ca" });
    return;
  }

  res.redirect(302, destination);
});

// ── GET /kits/registry ────────────────────────────────────────────────────────

router.get("/registry", (_req: Request, res: Response) => {
  res.json({ kits: Object.values(KITS) });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Kit Builder Platform routes (DB-backed, owner-only via requireKitOwnerAuth)
// ═══════════════════════════════════════════════════════════════════════════════

// ── GET /kits/list — public, all published kits ───────────────────────────────

router.get("/list", async (_req: Request, res: Response) => {
  try {
    const kits = await db
      .select()
      .from(kitsTable)
      .where(eq(kitsTable.status, "published"));
    res.json({ kits });
  } catch (err) {
    logger.error({ err }, "kits: GET /list failed");
    res.status(500).json({ error: "Failed to fetch kits" });
  }
});

// ── GET /kits/drafts — owner-only, all kits owned by this owner ───────────────

router.get("/drafts", requireKitOwnerAuth, async (req: Request, res: Response) => {
  const ownerId = req.kitOwnerId!;
  try {
    const kits = await db
      .select()
      .from(kitsTable)
      .where(eq(kitsTable.ownerId, ownerId));
    res.json({ kits });
  } catch (err) {
    logger.error({ err }, "kits: GET /drafts failed");
    res.status(500).json({ error: "Failed to fetch kits" });
  }
});

// ── POST /kits/draft — owner-only, create a kit draft ────────────────────────

const KitDraftSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  priceCents: z.number().int().min(0).optional(),
  contentOutline: z.record(z.unknown()).optional(),
  intendedAudience: z.string().max(500).optional(),
});

router.post("/draft", requireKitOwnerAuth, async (req: Request, res: Response) => {
  const ownerId = req.kitOwnerId!;
  const parsed = KitDraftSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  try {
    const kit = await createKitDraftRecord(ownerId, {
      title: parsed.data.title,
      description: parsed.data.description,
      priceCents: parsed.data.priceCents,
      intendedAudience: parsed.data.intendedAudience,
      contentOutline: parsed.data.contentOutline,
    });
    res.status(201).json({ ok: true, kit });
  } catch (err) {
    logger.error({ err }, "kits: POST /draft failed");
    res.status(500).json({ error: "Failed to create kit draft" });
  }
});

// ── POST /kits/connect-onboard — create/retrieve Stripe Connect account + onboarding link ──

router.post("/connect-onboard", requireKitOwnerAuth, async (req: Request, res: Response) => {
  const stripe = getStripe();
  if (!stripe) {
    res.status(503).json({ error: "Stripe is not configured (STRIPE_SECRET_KEY missing)" });
    return;
  }

  const base = process.env.API_BASE_URL ??
    (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "http://localhost:8081");

  try {
    const ownerId = req.kitOwnerId!;
    // Optional: link the account to a specific draft kit after onboarding completes
    const body = (req.body ?? {}) as { accountId?: string; kitId?: string };
    let accountId: string;

    if (body.accountId) {
      accountId = body.accountId;
    } else {
      const account = await stripe.accounts.create({ type: "express" });
      accountId = account.id;
    }

    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${base}/north-star/kits`,
      return_url: `${base}/north-star/kits`,
      type: "account_onboarding",
    });

    // If a kitId was provided, persist the Connect account ID to that kit so
    // that POST /kits/:id/publish will route under the connected account.
    if (body.kitId) {
      await db
        .update(kitsTable)
        .set({ stripeAccountId: accountId, updatedAt: new Date() })
        .where(and(eq(kitsTable.id, body.kitId), eq(kitsTable.ownerId, ownerId)));
      logger.info({ kitId: body.kitId, accountId, ownerId }, "kits: Stripe Connect account linked to kit");
    }

    res.json({ ok: true, accountId, onboardingUrl: link.url });
  } catch (err) {
    logger.error({ err }, "kits: POST /connect-onboard failed");
    res.status(500).json({ error: "Failed to create Stripe Connect onboarding link" });
  }
});

// ── POST /kits/:id/codetry — owner-only, run Codetry filter (owner-scoped) ───

router.post("/:id/codetry", requireKitOwnerAuth, async (req: Request, res: Response) => {
  const rawId = req.params["id"];
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const ownerId = req.kitOwnerId!;
  if (!id) {
    res.status(400).json({ error: "id required" });
    return;
  }

  try {
    const [kit] = await db
      .select()
      .from(kitsTable)
      .where(and(eq(kitsTable.id, id), eq(kitsTable.ownerId, ownerId)))
      .limit(1);

    if (!kit) {
      res.status(404).json({ error: "Kit not found" });
      return;
    }

    const result = await runCodetryFilter({
      title: kit.title,
      description: kit.description ?? undefined,
      contentOutline: kit.contentOutline ?? undefined,
      priceCents: kit.priceCents,
    });

    await db
      .update(kitsTable)
      .set({ codetryResult: result, updatedAt: new Date() })
      .where(and(eq(kitsTable.id, id), eq(kitsTable.ownerId, ownerId)));

    res.json({ ok: true, codetryResult: result });
  } catch (err) {
    logger.error({ err }, "kits: POST /:id/codetry failed");
    res.status(500).json({ error: "Codetry filter failed" });
  }
});

// ── POST /kits/:id/publish — owner-only, Stripe product+price + set published ─
//
// Stripe Connect routing:
//   - If kit.stripeAccountId is set → create product/price under that connected account
//   - Otherwise → create on the platform account (founder publishing directly)
//   A checkout session is created either way.

router.post("/:id/publish", requireKitOwnerAuth, async (req: Request, res: Response) => {
  const rawId = req.params["id"];
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const ownerId = req.kitOwnerId!;
  if (!id) {
    res.status(400).json({ error: "id required" });
    return;
  }

  try {
    const [kit] = await db
      .select()
      .from(kitsTable)
      .where(and(eq(kitsTable.id, id), eq(kitsTable.ownerId, ownerId), eq(kitsTable.status, "draft")))
      .limit(1);

    if (!kit) {
      res.status(404).json({ error: "Kit draft not found or already published" });
      return;
    }

    const stripe = getStripe();
    let stripeProductId: string | null = null;
    let stripePriceId: string | null = null;
    let stripeCheckoutUrl: string | null = null;

    if (stripe && kit.priceCents > 0) {
      const base = process.env.API_BASE_URL ??
        (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "http://localhost:8081");

      // Determine connected account for this kit's owner
      const connectedAccountId = kit.stripeAccountId ?? null;
      const stripeOpts = connectedAccountId ? { stripeAccount: connectedAccountId } : {};

      const product = await stripe.products.create(
        {
          name: kit.title,
          description: kit.description ?? undefined,
          metadata: { kit_id: id, owner_id: kit.ownerId },
        },
        stripeOpts,
      );

      const price = await stripe.prices.create(
        {
          product: product.id,
          unit_amount: kit.priceCents,
          currency: "cad",
        },
        stripeOpts,
      );

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [{ price: price.id, quantity: 1 }],
        success_url: `${base}/north-star/kits?published=1`,
        cancel_url: `${base}/north-star/kits`,
        metadata: { kit_id: id },
      };

      // If using Connect, specify the connected account
      if (connectedAccountId) {
        sessionParams.payment_intent_data = {
          application_fee_amount: Math.round(kit.priceCents * 0.1), // 10% platform fee
        };
      }

      const session = await stripe.checkout.sessions.create(sessionParams, stripeOpts);

      stripeProductId = product.id;
      stripePriceId = price.id;
      stripeCheckoutUrl = session.url;
    }

    const [published] = await db
      .update(kitsTable)
      .set({
        status: "published",
        stripeProductId,
        stripePriceId,
        stripeCheckoutUrl,
        updatedAt: new Date(),
      })
      .where(and(eq(kitsTable.id, id), eq(kitsTable.ownerId, ownerId)))
      .returning();

    logger.info({ id, ownerId, stripeProductId, connected: !!kit.stripeAccountId }, "kit published");
    res.json({ ok: true, kit: published });
  } catch (err) {
    logger.error({ err }, "kits: POST /:id/publish failed");
    res.status(500).json({ error: "Failed to publish kit" });
  }
});

// ── Kit-builder GORD system prompt ────────────────────────────────────────────

const KIT_BUILDER_SYSTEM = `You are Gord — but today you're wearing your kit-builder hat. You help the founder turn a raw idea into a structured Headwaters Kit.

You're still Gord: dry, sharp, encouraging. But in kit-builder mode you guide a focused conversation to capture:
1. Kit title and one-sentence description
2. Intended audience (who is this for?)
3. Price point (what does it cost? 0 = free)
4. Content outline (what's actually in the kit?)
5. Why now / what prompted this idea?

After capturing enough, synthesize the kit draft as a JSON object inside triple backticks like:
\`\`\`json
{
  "title": "Kit title",
  "description": "One-line description",
  "intendedAudience": "Who it's for",
  "priceCents": 0,
  "contentOutline": {
    "sections": ["Section 1", "Section 2"]
  }
}
\`\`\`

Keep responses concise — 2-3 sentences max per turn. Be helpful, not preachy. Guide without dictating.`;

// ── POST /kits/gord/chat — single-turn kit-builder chat ──────────────────────

const GordChatSchema = z.object({
  message: z.string().min(1).max(4000),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })).optional(),
  pageContext: z.string().optional(),
});

router.post("/gord/chat", requireKitOwnerAuth, async (req: Request, res: Response) => {
  const parsed = GordChatSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { message, history = [], pageContext } = parsed.data;
  const system = pageContext
    ? `${KIT_BUILDER_SYSTEM}\n\nContext: The founder is currently viewing: ${pageContext}`
    : KIT_BUILDER_SYSTEM;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system,
      messages: [
        ...history.slice(-10),
        { role: "user", content: message },
      ],
    });

    const block = response.content[0];
    if (!block || block.type !== "text") {
      res.status(500).json({ error: "No response" });
      return;
    }

    res.json({ reply: block.text });
  } catch (err) {
    logger.error({ err }, "kits: POST /gord/chat failed");
    res.status(500).json({ error: "Gord's radio is down. Try again." });
  }
});

// ── POST /kits/gord-draft — GORD conversation → save draft + Codetry ─────────

const GordDraftSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ).min(1),
  pageContext: z.string().optional(),
});

router.post("/gord-draft", requireKitOwnerAuth, async (req: Request, res: Response) => {
  const ownerId = req.kitOwnerId!;
  const parsed = GordDraftSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { messages, pageContext } = parsed.data;
  const system = pageContext
    ? `${KIT_BUILDER_SYSTEM}\n\nContext: The founder is currently viewing: ${pageContext}`
    : KIT_BUILDER_SYSTEM;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system,
      messages,
    });

    const block = response.content[0];
    if (!block || block.type !== "text") {
      res.status(500).json({ error: "No response from Gord" });
      return;
    }

    const reply = block.text;
    const jsonMatch = reply.match(/```json\n?([\s\S]*?)```/);

    if (jsonMatch?.[1]) {
      try {
        const draft = JSON.parse(jsonMatch[1]) as {
          title?: string;
          description?: string;
          intendedAudience?: string;
          priceCents?: number;
          contentOutline?: Record<string, unknown>;
        };

        if (draft.title) {
          const kit = await createKitDraftRecord(ownerId, {
            title: draft.title,
            description: draft.description,
            priceCents: draft.priceCents ?? 0,
            intendedAudience: draft.intendedAudience,
            contentOutline: draft.contentOutline,
          });

          const codetryResult = await runCodetryFilter({
            title: draft.title,
            description: draft.description,
            intendedAudience: draft.intendedAudience,
            contentOutline: draft.contentOutline,
            priceCents: draft.priceCents ?? 0,
          });

          await db
            .update(kitsTable)
            .set({ codetryResult, updatedAt: new Date() })
            .where(and(eq(kitsTable.id, kit.id), eq(kitsTable.ownerId, ownerId)));

          logger.info({ kitId: kit.id, ownerId }, "kit draft saved from GORD conversation");
          res.json({ reply, kitId: kit.id, codetryResult, draftSaved: true });
          return;
        }
      } catch {
        // JSON parse failed — return just the reply
      }
    }

    res.json({ reply, draftSaved: false });
  } catch (err) {
    logger.error({ err }, "kits: POST /gord-draft failed");
    res.status(500).json({ error: "Gord's kit-builder mode went quiet. Try again." });
  }
});

// ── GET /kits/failures — founder-only, list unresolved delivery failures ──────
//
// Returns all kit_delivery_failures rows where resolvedAt IS NULL, ordered
// most-recent first.  Gives the founder a queryable audit trail even if the
// one-shot alert email was missed or itself failed.
//
// Auth: requireFounderOnlyAuth — practitioners excluded (global failure list).

router.get("/failures", requireFounderOnlyAuth, async (_req: Request, res: Response) => {
  const rows = await db
    .select()
    .from(kitDeliveryFailuresTable)
    .where(isNull(kitDeliveryFailuresTable.resolvedAt))
    .orderBy(desc(kitDeliveryFailuresTable.createdAt));

  const failures = rows.map((r) => ({
    id: r.id,
    buyerEmail: r.buyerEmail,
    kitId: r.kitId,
    purchaseId: r.purchaseId,
    error: r.error,
    createdAt: r.createdAt.toISOString(),
  }));

  res.json({ ok: true, failures });
});

// ── POST /kits/failures/:id/resolve — founder-only, mark a failure resolved ───
//
// Sets resolvedAt = now on the given kit_delivery_failures row so it no longer
// appears in GET /kits/failures (which filters to unresolved only).  Call this
// once the buyer has been reached manually and the delivery situation is closed.
//
// Auth: requireFounderOnlyAuth — only the founder can close failure records.

// ── GET /kits/webhook-attempts — founder-only, list uncommitted deliveries ────
//
// Returns all kit_webhook_attempts rows (Stripe webhooks that were received but
// where the token INSERT never completed — i.e. the purchase was logged by Stripe
// but no access token was ever committed to the database).  Ordered newest-first.
router.get("/webhook-attempts", requireFounderOnlyAuth, async (_req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(kitWebhookAttemptsTable)
      .orderBy(desc(kitWebhookAttemptsTable.lastAttemptAt));

    res.json({ ok: true, attempts: rows });
  } catch (err) {
    logger.error({ err }, "kits: GET /webhook-attempts failed");
    res.status(500).json({ error: "Failed to fetch webhook attempts" });
  }
});

router.post("/failures/:id/resolve", requireFounderOnlyAuth, async (req: Request, res: Response) => {
  const rawId = req.params["id"];
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id) {
    res.status(400).json({ error: "id required" });
    return;
  }

  try {
    const [updated] = await db
      .update(kitDeliveryFailuresTable)
      .set({ resolvedAt: new Date() })
      .where(eq(kitDeliveryFailuresTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Failure record not found" });
      return;
    }

    logger.info({ id }, "kits: delivery failure marked resolved");
    res.json({ ok: true, id, resolvedAt: (updated.resolvedAt as Date).toISOString() });
  } catch (err) {
    logger.error({ err, id }, "kits: POST /failures/:id/resolve failed");
    res.status(500).json({ error: "Failed to resolve failure record" });
  }
});

export default router;
