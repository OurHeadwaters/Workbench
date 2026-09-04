import { ReplitConnectors } from "@replit/connectors-sdk";
import crypto from "crypto";
import { logger } from "./logger";

export type QuoteMailResult = {
  status: "sent" | "failed";
  error?: string;
  messageId?: string;
};

const HEADWATERS_FROM_EMAIL = "bobbie@ourheadwaters.ca";
const HEADWATERS_FROM_HEADER = `Headwaters <${HEADWATERS_FROM_EMAIL}>`;

function assertSafeHeader(value: string, headerName: string): void {
  if (/[\r\n]/.test(value)) {
    throw new Error(`${headerName} contains an invalid line break`);
  }
}

function encodeMimeHeader(value: string, headerName: string): string {
  assertSafeHeader(value, headerName);
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function wrapBase64(value: string, width = 76): string {
  const encoded = Buffer.from(value, "utf8").toString("base64");
  return encoded.match(new RegExp(`.{1,${width}}`, "g"))?.join("\r\n") ?? "";
}

export function encodeRfc2822(
  to: string,
  subject: string,
  body: string,
  replyTo?: string,
  bodyHtml?: string,
  from?: string,
): string {
  assertSafeHeader(to, "To");
  if (replyTo) assertSafeHeader(replyTo, "Reply-To");
  if (from) assertSafeHeader(from, "From");

  let raw: string;

  if (bodyHtml) {
    const boundary = `----=_NextPart_${crypto.randomBytes(16).toString("hex")}`;
    raw = [
      ...(from ? [`From: ${from}`] : []),
      `To: ${to}`,
      ...(replyTo ? [`Reply-To: ${replyTo}`] : []),
      `Subject: ${encodeMimeHeader(subject, "Subject")}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      wrapBase64(body),
      "",
      `--${boundary}`,
      "Content-Type: text/html; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      wrapBase64(bodyHtml),
      "",
      `--${boundary}--`,
    ].join("\r\n");
  } else {
    raw = [
      ...(from ? [`From: ${from}`] : []),
      `To: ${to}`,
      ...(replyTo ? [`Reply-To: ${replyTo}`] : []),
      `Subject: ${encodeMimeHeader(subject, "Subject")}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      wrapBase64(body),
    ].join("\r\n");
  }

  return Buffer.from(raw)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function sendQuoteEmail(opts: {
  to: string;
  subject: string;
  body: string;
  bodyHtml?: string;
  replyTo?: string;
}): Promise<QuoteMailResult> {
  try {
    const connectors = new ReplitConnectors();
    const sendAsResponse = await connectors.proxy(
      "google-mail",
      "/gmail/v1/users/me/settings/sendAs",
      { method: "GET" },
    );

    if (!sendAsResponse.ok) {
      const message = await sendAsResponse.text().catch(() => "upstream error");
      logger.warn(
        { status: sendAsResponse.status, error: message.slice(0, 300) },
        "[quote-mailer] Gmail sender verification failed",
      );
      return {
        status: "failed",
        error: `gmail sender verification ${sendAsResponse.status}: ${message.slice(0, 300)}`,
      };
    }

    const sendAsData = (await sendAsResponse.json().catch(() => ({}))) as {
      sendAs?: Array<{
        sendAsEmail?: string;
        verificationStatus?: string;
      }>;
    };
    const senderAuthorized = sendAsData.sendAs?.some(
      (entry) =>
        entry.sendAsEmail?.toLowerCase() === HEADWATERS_FROM_EMAIL &&
        entry.verificationStatus === "accepted",
    );

    if (!senderAuthorized) {
      logger.error(
        { requiredSender: HEADWATERS_FROM_EMAIL },
        "[quote-mailer] required Headwaters Gmail sender is not authorized",
      );
      return {
        status: "failed",
        error: `gmail sender ${HEADWATERS_FROM_EMAIL} is not authorized`,
      };
    }

    const response = await connectors.proxy(
      "google-mail",
      "/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw: encodeRfc2822(
            opts.to,
            opts.subject,
            opts.body,
            opts.replyTo,
            opts.bodyHtml,
            HEADWATERS_FROM_HEADER,
          ),
        }),
      },
    );

    if (!response.ok) {
      const message = await response.text().catch(() => "upstream error");
      logger.warn(
        { to: opts.to, status: response.status, error: message.slice(0, 300) },
        "[quote-mailer] Gmail send failed",
      );
      return {
        status: "failed",
        error: `gmail ${response.status}: ${message.slice(0, 300)}`,
      };
    }

    const data = (await response.json().catch(() => ({}))) as { id?: string };
    return { status: "sent", messageId: data.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error({ to: opts.to, error: message }, "[quote-mailer] send failed");
    return { status: "failed", error: message };
  }
}