/**
 * kitsMailer — sends the kit delivery email to a buyer.
 *
 * Uses the google-mail connector (ReplitConnectors proxy) — same pattern
 * as riverSmithMailer.ts. Tokens are refreshed automatically; never cache
 * the ReplitConnectors instance across requests.
 *
 * The delivery email is plain text, intentionally minimal:
 *   - What the buyer purchased
 *   - The access URL (token-gated, expires 30 days)
 *   - Arc self-registration note (if applicable — sovereign, no auto-link)
 *   - One contact line
 *
 * Email is sent from the connected Gmail account (the Replit google-mail connector).
 */

import crypto from "crypto";
import { ReplitConnectors } from "@replit/connectors-sdk";
import { logger } from "./logger";
import type { Kit } from "./kitsRegistry";

export type KitMailStatus = "sent" | "failed" | "skipped";

export interface KitMailResult {
  status: KitMailStatus;
  error?: string;
  messageId?: string;
}

function encodeRfc2822(to: string, subject: string, body: string): string {
  const raw = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=UTF-8",
    "",
    body,
  ].join("\r\n");
  return Buffer.from(raw)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function buildBody(opts: {
  buyerName: string;
  kit: Kit;
  accessUrl: string;
  expiresAt: Date;
}): string {
  const { buyerName, kit, accessUrl, expiresAt } = opts;
  const expiryStr = expiresAt.toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lines = [
    `Hi ${buyerName},`,
    "",
    `Your ${kit.name} is ready.`,
    "",
    kit.contentNote,
    "",
    "── Access your kit ─────────────────────────────────────",
    "",
    accessUrl,
    "",
    `This link is active until ${expiryStr}. If you need it reissued, reply to this email.`,
    "",
  ];

  if (kit.arcNote) {
    lines.push(
      "── Community Money Machine steward registration ────────",
      "",
      kit.arcNote,
      "",
    );
  }

  lines.push(
    "── Questions ────────────────────────────────────────────",
    "",
    "Reply to this email or reach Bobbie at ourheadwaters.ca.",
    "",
    "—Headwaters",
  );

  return lines.join("\n");
}

// ── Signed resend link ────────────────────────────────────────────────────────
//
// Generates a one-click URL the founder can open in a browser to re-send a
// failed kit delivery without needing a REST client or terminal access.
//
// Token structure:  ?purchaseId=<id>&exp=<unix_ms>&sig=<hmac_sha256_hex>
// Signing key: KIT_WEBHOOK_SECRET (already required for the purchase webhook).
// TTL: 7 days — long enough to not expire before the founder notices the alert.

const RESEND_LINK_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function resolveBaseUrl(): string {
  return (
    process.env.API_BASE_URL ??
    (process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : "http://localhost:8081")
  );
}

export function generateResendLink(opts: {
  purchaseId: string;
  secret: string;
}): string {
  const { purchaseId, secret } = opts;
  const exp = Date.now() + RESEND_LINK_TTL_MS;
  const payload = `${purchaseId}:${exp}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const params = new URLSearchParams({ purchaseId, exp: String(exp), sig });
  return `${resolveBaseUrl()}/kits/resend?${params.toString()}`;
}

export function verifyResendToken(opts: {
  purchaseId: string;
  exp: string;
  sig: string;
  secret: string;
}): { ok: true } | { ok: false; reason: string } {
  const { purchaseId, exp, sig, secret } = opts;

  const expMs = parseInt(exp, 10);
  if (isNaN(expMs)) return { ok: false, reason: "invalid exp" };
  if (Date.now() > expMs) return { ok: false, reason: "expired" };

  const payload = `${purchaseId}:${exp}`;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  try {
    const sigBuf = Buffer.from(sig, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length) return { ok: false, reason: "invalid sig" };
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return { ok: false, reason: "invalid sig" };
  } catch {
    return { ok: false, reason: "invalid sig" };
  }

  return { ok: true };
}

async function resolveAlertRecipient(): Promise<string | null> {
  if (process.env.KIT_DELIVERY_ALERT_EMAIL) {
    return process.env.KIT_DELIVERY_ALERT_EMAIL;
  }
  try {
    const connectors = new ReplitConnectors();
    const resp = await connectors.proxy(
      "google-mail",
      "/gmail/v1/users/me/profile",
      { method: "GET" },
    );
    if (resp.ok) {
      const data = (await resp.json().catch(() => ({}))) as { emailAddress?: string };
      return data.emailAddress ?? null;
    }
  } catch {
    // fall through
  }
  return null;
}

export async function sendKitDeliveryFailureAlert(opts: {
  buyerEmail: string;
  kitId: string;
  purchaseId: string;
  deliveryError?: string;
}): Promise<void> {
  const { buyerEmail, kitId, purchaseId, deliveryError } = opts;

  const alertTo = await resolveAlertRecipient();
  if (!alertTo) {
    logger.error(
      { kitId, purchaseId },
      "[kits-mailer] delivery failed and no alert recipient configured — set KIT_DELIVERY_ALERT_EMAIL",
    );
    return;
  }

  const subject = `[ACTION REQUIRED] Kit delivery failed — ${kitId}`;

  const secret = process.env.KIT_WEBHOOK_SECRET;
  const resendLink = secret
    ? generateResendLink({ purchaseId, secret })
    : null;

  const body = [
    "A kit purchase was completed but the delivery email could not be sent.",
    "",
    `  Buyer email : ${buyerEmail}`,
    `  Kit ID      : ${kitId}`,
    `  Purchase ID : ${purchaseId}`,
    deliveryError ? `  Error       : ${deliveryError}` : "",
    "",
    resendLink
      ? [
          "One-click resend (open in any browser, valid for 7 days):",
          "",
          `  ${resendLink}`,
        ].join("\n")
      : [
          "Resend manually (KIT_WEBHOOK_SECRET not set — link unavailable):",
          "",
          `  POST /api/kits/resend`,
          `  Body: { "purchaseId": "${purchaseId}" }`,
        ].join("\n"),
    "",
    "— Headwaters server alert",
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  try {
    const connectors = new ReplitConnectors();
    const encoded = encodeRfc2822(alertTo, subject, body);

    const response = await connectors.proxy(
      "google-mail",
      "/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw: encoded }),
      },
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => "upstream error");
      logger.error(
        { alertTo, kitId, purchaseId, status: response.status, err: errText.slice(0, 300) },
        "[kits-mailer] failed to send delivery-failure alert",
      );
    } else {
      logger.info({ alertTo, kitId, purchaseId }, "[kits-mailer] delivery-failure alert sent");
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error({ alertTo, kitId, purchaseId, err: msg }, "[kits-mailer] unexpected error sending delivery-failure alert");
  }
}

export async function sendKitDeliveryEmail(opts: {
  to: string;
  buyerName: string;
  kit: Kit;
  accessUrl: string;
  expiresAt: Date;
}): Promise<KitMailResult> {
  const { to, buyerName, kit, accessUrl, expiresAt } = opts;

  const subject = `Your ${kit.name} — Headwaters`;
  const body = buildBody({ buyerName, kit, accessUrl, expiresAt });

  try {
    const connectors = new ReplitConnectors();
    const encoded = encodeRfc2822(to, subject, body);

    const response = await connectors.proxy(
      "google-mail",
      "/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw: encoded }),
      },
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => "upstream error");
      logger.warn(
        { to, kit: kit.id, status: response.status, err: errText.slice(0, 300) },
        "[kits-mailer] delivery email failed",
      );
      return {
        status: "failed",
        error: `gmail ${response.status}: ${errText.slice(0, 300)}`,
      };
    }

    const data = (await response.json().catch(() => ({}))) as { id?: string };
    logger.info({ to, kit: kit.id, messageId: data.id }, "[kits-mailer] delivery email sent");
    return { status: "sent", messageId: data.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error({ to, kit: kit.id, err: msg }, "[kits-mailer] unexpected error");
    return { status: "failed", error: msg };
  }
}
