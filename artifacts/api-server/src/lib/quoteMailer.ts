import { ReplitConnectors } from "@replit/connectors-sdk";
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

export function buildResendEmailPayload(opts: {
  to: string;
  subject: string;
  body: string;
  bodyHtml?: string;
  replyTo?: string;
}) {
  assertSafeHeader(opts.to, "To");
  assertSafeHeader(opts.subject, "Subject");
  if (opts.replyTo) assertSafeHeader(opts.replyTo, "Reply-To");

  return {
    from: HEADWATERS_FROM_HEADER,
    to: [opts.to],
    subject: opts.subject,
    text: opts.body,
    ...(opts.bodyHtml ? { html: opts.bodyHtml } : {}),
    reply_to: opts.replyTo ?? HEADWATERS_FROM_EMAIL,
  };
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
    const response = await connectors.proxy(
      "resend",
      "/emails",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildResendEmailPayload(opts)),
      },
    );

    if (!response.ok) {
      const message = await response.text().catch(() => "upstream error");
      logger.warn(
        { to: opts.to, status: response.status, error: message.slice(0, 300) },
        "[quote-mailer] Resend send failed",
      );
      return {
        status: "failed",
        error: `resend ${response.status}: ${message.slice(0, 300)}`,
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