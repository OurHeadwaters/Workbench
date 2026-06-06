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
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { z } from "zod";
import Stripe from "stripe";
import { logger } from "../lib/logger";
import { getKit, KITS } from "../lib/kitsRegistry";
import { sendKitDeliveryEmail } from "../lib/kitsMailer";
import { runCodetryFilter } from "../lib/codetryFilter";
import { requireKitOwnerAuth, FOUNDER_OWNER_ID } from "../lib/kitAuth";
import { db, kitsTable, practitionerApplicationsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
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

// ── Token store (legacy purchase webhook) ─────────────────────────────────────

const DATA_DIR = path.resolve(process.cwd(), "data");
const TOKENS_FILE = path.join(DATA_DIR, "kit-tokens.json");
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

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
  const raw = req.params["token"];
  const token = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");
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

export default router;
