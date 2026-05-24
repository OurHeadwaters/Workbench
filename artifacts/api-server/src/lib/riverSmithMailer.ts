/**
 * riverSmithMailer — sends the River Smith briefing (or a failure notice)
 * to the configured notify email via the Gmail connector.
 *
 * Delivery address is resolved in priority order:
 *   1. app_settings row with key "river_smith_notify_email" (owner-editable via Kitchen Table)
 *   2. RIVER_SMITH_NOTIFY_EMAIL environment variable (legacy fallback)
 *
 * Uses the @replit/connectors-sdk proxy pattern — tokens are refreshed
 * automatically; never cache the ReplitConnectors instance across requests.
 *
 * Email is entirely optional: if no address is configured by either source,
 * every call is a no-op that returns { status: "skipped" }.
 */

import { ReplitConnectors } from "@replit/connectors-sdk";
import { db } from "@workspace/db";
import { appSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

export type MailStatus = "sent" | "failed" | "skipped";

export interface MailResult {
  status: MailStatus;
  error?: string;
  messageId?: string;
}

async function resolveNotifyEmail(): Promise<string | null> {
  try {
    const rows = await db
      .select()
      .from(appSettingsTable)
      .where(eq(appSettingsTable.key, "river_smith_notify_email"))
      .limit(1);
    const dbValue = rows[0]?.value;
    if (dbValue) return dbValue;
  } catch {
    // DB unavailable — fall through to env var
  }
  return process.env.RIVER_SMITH_NOTIFY_EMAIL ?? null;
}

function formatSubject(date: Date): string {
  const label = date.toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `River Smith — ${label}`;
}

function encodeRfc2822(
  to: string,
  subject: string,
  body: string,
): string {
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

async function sendViaGmail(
  to: string,
  subject: string,
  body: string,
): Promise<MailResult> {
  try {
    const connectors = new ReplitConnectors();
    const raw = encodeRfc2822(to, subject, body);

    const response = await connectors.proxy(
      "google-mail",
      "/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw }),
      },
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => "upstream error");
      return {
        status: "failed",
        error: `gmail ${response.status}: ${errText.slice(0, 300)}`,
      };
    }

    const data = (await response.json().catch(() => ({}))) as {
      id?: string;
    };
    return { status: "sent", messageId: data.id };
  } catch (err) {
    return {
      status: "failed",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function sendRiverSmithBriefingEmail(
  rawMarkdown: string,
): Promise<MailResult> {
  const to = await resolveNotifyEmail();
  if (!to) return { status: "skipped" };

  const subject = formatSubject(new Date());
  const result = await sendViaGmail(to, subject, rawMarkdown);

  if (result.status === "sent") {
    logger.info({ to, messageId: result.messageId }, "river-smith: briefing email sent");
  } else {
    logger.warn({ to, error: result.error }, "river-smith: briefing email failed");
  }

  return result;
}

export async function sendRiverSmithFailureEmail(
  errorMessage: string,
): Promise<MailResult> {
  const to = await resolveNotifyEmail();
  if (!to) return { status: "skipped" };

  const subject = formatSubject(new Date());
  const body = [
    `River Smith — nightly briefing could not be generated.`,
    "",
    `Error: ${errorMessage}`,
    "",
    "The briefing will run again tomorrow night at 23:45.",
    "",
    "—River Smith",
  ].join("\n");

  const result = await sendViaGmail(to, subject, body);

  if (result.status === "sent") {
    logger.info({ to, messageId: result.messageId }, "river-smith: failure notice email sent");
  } else {
    logger.warn({ to, error: result.error }, "river-smith: failure notice email failed");
  }

  return result;
}
