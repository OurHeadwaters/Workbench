/**
 * practitionerMailer — emails for the practitioner application pipeline.
 *
 * Uses the same google-mail connector pattern as kitsMailer.ts.
 */

import { ReplitConnectors } from "@replit/connectors-sdk";
import { logger } from "./logger";

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

async function sendMail(to: string, subject: string, body: string): Promise<void> {
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
      logger.warn({ to, status: response.status, err: errText.slice(0, 200) }, "[practitioner-mailer] send failed");
    } else {
      logger.info({ to }, "[practitioner-mailer] sent");
    }
  } catch (err) {
    logger.error({ to, err }, "[practitioner-mailer] unexpected error");
  }
}

export async function notifyFounderOfApplication(opts: {
  applicantName: string;
  community: string;
  doctrineSummary: string;
  contactEmail: string;
  reviewUrl: string;
}): Promise<void> {
  const founderEmail = process.env.HEADWATERS_OWNER_EMAIL?.split(",")[0]?.trim();
  if (!founderEmail) {
    logger.warn("[practitioner-mailer] HEADWATERS_OWNER_EMAIL not set — founder notification skipped");
    return;
  }

  const subject = `New practitioner application: ${opts.applicantName} (${opts.community})`;
  const body = [
    `New practitioner application received.`,
    ``,
    `Name: ${opts.applicantName}`,
    `Community: ${opts.community}`,
    `Email: ${opts.contactEmail}`,
    ``,
    `Doctrine summary:`,
    opts.doctrineSummary,
    ``,
    `Review at: ${opts.reviewUrl}`,
    ``,
    `—Headwaters Kit Builder`,
  ].join("\n");

  await sendMail(founderEmail, subject, body);
}

export async function notifyApplicantApproved(opts: {
  to: string;
  name: string;
  connectOnboardingUrl?: string;
}): Promise<void> {
  const subject = "Your Headwaters practitioner application — approved";
  const lines = [
    `Hi ${opts.name},`,
    ``,
    `Your application to become a Headwaters practitioner has been approved.`,
    ``,
    `You can now build and publish your own kits, running your community's version`,
    `of the Headwaters framework under your own doctrine.`,
    ``,
  ];

  if (opts.connectOnboardingUrl) {
    lines.push(
      `── Set up your Stripe account ───────────────────────────`,
      ``,
      `To receive payments from your kits, complete your Stripe setup:`,
      opts.connectOnboardingUrl,
      ``,
      `This link expires in 24 hours. If you need a new one, reply to this email.`,
      ``,
    );
  }

  lines.push(
    `── Next steps ───────────────────────────────────────────`,
    ``,
    `Once your Stripe account is set up, open the GORD widget and tap`,
    `"＋ Add a Kit" to start building.`,
    ``,
    `Questions? Reply to this email.`,
    ``,
    `—Headwaters`,
  );

  await sendMail(opts.to, subject, lines.join("\n"));
}

export async function notifyApplicantDeclined(opts: {
  to: string;
  name: string;
  note?: string;
}): Promise<void> {
  const subject = "Your Headwaters practitioner application";
  const body = [
    `Hi ${opts.name},`,
    ``,
    `Thank you for applying to be a Headwaters practitioner.`,
    ``,
    `After review, we're not moving forward with your application at this time.`,
    opts.note ? `\nNote from the team: ${opts.note}\n` : ``,
    `If you'd like to reapply in the future or have questions, reply to this email.`,
    ``,
    `—Headwaters`,
  ].join("\n");

  await sendMail(opts.to, subject, body);
}
