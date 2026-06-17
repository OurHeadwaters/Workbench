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
  const body = [
    "A kit purchase was completed but the delivery email could not be sent.",
    "",
    `  Buyer email : ${buyerEmail}`,
    `  Kit ID      : ${kitId}`,
    `  Purchase ID : ${purchaseId}`,
    deliveryError ? `  Error       : ${deliveryError}` : "",
    "",
    "Resend the kit manually:",
    "",
    `  POST /api/kits/resend`,
    `  Body: { "purchaseId": "${purchaseId}" }`,
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
