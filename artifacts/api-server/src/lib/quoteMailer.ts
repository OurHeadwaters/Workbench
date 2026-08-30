import { ReplitConnectors } from "@replit/connectors-sdk";
import { logger } from "./logger";

export type QuoteMailResult = {
  status: "sent" | "failed";
  error?: string;
  messageId?: string;
};

function encodeRfc2822(
  to: string,
  subject: string,
  body: string,
  replyTo?: string,
): string {
  const raw = [
    `To: ${to}`,
    ...(replyTo ? [`Reply-To: ${replyTo}`] : []),
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

export async function sendQuoteEmail(opts: {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
}): Promise<QuoteMailResult> {
  try {
    const connectors = new ReplitConnectors();
    const response = await connectors.proxy(
      "google-mail",
      "/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw: encodeRfc2822(opts.to, opts.subject, opts.body, opts.replyTo),
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