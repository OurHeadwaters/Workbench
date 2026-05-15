/**
 * Thin Resend client.  We do not pull in the official SDK — Resend's
 * REST API is a single POST and the SDK would drag in tooling we
 * don't otherwise need server-side.
 *
 * The contract: the codetry-ship route always saves the manifest row
 * first, then calls `sendOperatorNotification` and `sendSignerReply`
 * best-effort.  Each call returns a `{ status, error? }` envelope so
 * the caller can stamp the row with what actually happened.  We never
 * throw on send failure — the row stays, the operator can see the
 * `notification_status` column on the dashboard.
 *
 * `RESEND_API_KEY` is a secret.  When it is absent the helpers return
 * `{ status: "skipped" }` so the artifact still works in environments
 * where transactional email isn't wired up yet.
 */

import {
  TRIAL_ACCEPTANCE_CRITERIA,
  TRIAL_FEE_USD,
  TRIAL_REFUND_INVOCATION_DAYS,
  TRIAL_REFUND_PAYMENT_DAYS,
  TRIAL_REFUND_MECHANIC,
  TRIAL_WHAT_SURVIVES_REFUND,
} from "@workspace/headwaters-pricing";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const FROM_DEFAULT = "codetry <ship@codetry.systems>";
const OPERATOR_DEFAULT = "ship@codetry.systems";

export type SendStatus = "sent" | "failed" | "skipped";

export interface SendResult {
  status: SendStatus;
  error?: string;
  id?: string;
}

interface SendOpts {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

async function sendEmail(opts: SendOpts): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { status: "skipped" };

  const from = process.env.RESEND_FROM ?? FROM_DEFAULT;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: opts.to,
        subject: opts.subject,
        text: opts.text,
        ...(opts.html ? { html: opts.html } : {}),
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        status: "failed",
        error: `resend ${res.status}: ${body.slice(0, 200)}`,
      };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { status: "sent", id: data.id };
  } catch (err) {
    return {
      status: "failed",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export interface ManifestPayload {
  name: string;
  email: string;
  org: string | null;
  role: string | null;
  wouldBring: string | null;
  wouldWant: string | null;
}

function fmt(label: string, value: string | null): string {
  if (!value || value.trim() === "") return `${label}: —`;
  return `${label}:\n${value.trim()}`;
}

export async function sendOperatorNotification(
  payload: ManifestPayload,
): Promise<SendResult> {
  const operator = process.env.RESEND_OPERATOR_EMAIL ?? OPERATOR_DEFAULT;
  const subject = `New ship sign-on: ${payload.name}`;
  const body = [
    "A new signer just put their name on the codetry ship manifest.",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Org: ${payload.org ?? "—"}`,
    `Role: ${payload.role ?? "—"}`,
    "",
    fmt("Would bring", payload.wouldBring),
    "",
    fmt("Would want", payload.wouldWant),
    "",
    "—codetry",
  ].join("\n");

  return sendEmail({
    to: operator,
    subject,
    text: body,
    replyTo: payload.email,
  });
}

export interface ConfidentialIntakePayload {
  filename: string | null;
  fileSize: number | null;
  queueUrl: string;
}

function formatBytes(bytes: number | null): string {
  if (bytes === null || bytes === 0) return "unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function sendConfidentialIntakeNotification(
  payload: ConfidentialIntakePayload,
): Promise<SendResult> {
  const to = process.env.CONFIDENTIAL_NOTIFY_EMAIL;
  if (!to) return { status: "skipped" };

  const filename = payload.filename ?? "(unnamed file)";
  const subject = `Confidential file queued: ${filename}`;
  const body = [
    "A new file has landed in the confidential intake queue.",
    "",
    `File: ${filename}`,
    `Size: ${formatBytes(payload.fileSize)}`,
    "",
    "Review it here:",
    payload.queueUrl,
    "",
    "Nothing is shared until you clear, refuse, or route the file.",
    "",
    "—Library",
  ].join("\n");

  return sendEmail({ to, subject, text: body });
}

export async function sendSignerReply(
  payload: ManifestPayload,
): Promise<SendResult> {
  const subject = "You're on the manifest.";
  const body = [
    `${payload.name},`,
    "",
    "Your name is on the ship.  Thank you for signing on.",
    "",
    "We will be in touch when there's something concrete to share —",
    "another signer in your circle, a launch date, a place where what",
    "you said you'd bring is the thing actually needed.  Until then,",
    "carry on with the work that brought you here.",
    "",
    "If you ever want off the manifest, reply to this note with",
    `\"remove me\" and we will erase the row for ${payload.email}.`,
    "",
    "—codetry",
  ].join("\n");

  return sendEmail({
    to: payload.email,
    subject,
    text: body,
  });
}

// ─── Community development intake notification ─────────────────────────────────

export interface CommunityIntakeEmailPayload {
  name: string;
  email: string;
  community: string;
  role: string | null;
  whatTheyNeed: string;
}

export interface MagicLinkEmailPayload {
  email: string;
  magicLinkUrl: string;
}

export async function sendMagicLinkEmail(
  payload: MagicLinkEmailPayload,
): Promise<SendResult> {
  const subject = "Your sign-in link for the Research Library";

  const text = [
    "Here is your one-time sign-in link for the Northern Food Systems Research Library:",
    "",
    payload.magicLinkUrl,
    "",
    "This link expires in 15 minutes and can only be used once.",
    "",
    "If you did not request this link, you can safely ignore this email.",
    "",
    "— Library",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
  <tr><td align="center">
    <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#ffffff;border:1px solid #e4e4e7;border-radius:6px;">
      <tr><td style="background:#1c3a2b;padding:16px 32px;border-radius:6px 6px 0 0;">
        <p style="margin:0;color:#a3c9b4;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;">Northern Food Systems Research Library</p>
      </td></tr>
      <tr><td style="padding:32px;">
        <h1 style="margin:0 0 12px;font-size:20px;color:#18181b;">Your sign-in link</h1>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#52525b;">Click the button below to sign in. This link expires in <strong>15&nbsp;minutes</strong> and can only be used once.</p>
        <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr><td style="background:#1c3a2b;border-radius:4px;padding:12px 28px;">
            <a href="${payload.magicLinkUrl}" style="color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;">Sign in to the library</a>
          </td></tr>
        </table>
        <p style="margin:0 0 8px;font-size:12px;color:#a1a1aa;">If the button doesn't work, copy and paste this URL into your browser:</p>
        <p style="margin:0;font-size:12px;color:#52525b;word-break:break-all;">${payload.magicLinkUrl}</p>
      </td></tr>
      <tr><td style="padding:16px 32px;border-top:1px solid #f4f4f5;">
        <p style="margin:0;font-size:12px;color:#a1a1aa;">If you did not request this link, you can safely ignore this email.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  return sendEmail({ to: payload.email, subject, text, html });
}

export async function sendCommunityIntakeNotification(
  payload: CommunityIntakeEmailPayload,
): Promise<SendResult> {
  const operator =
    process.env.RESEND_OPERATOR_EMAIL ?? OPERATOR_DEFAULT;
  const subject = `New community inquiry: ${payload.community}`;
  const body = [
    "A new community development inquiry has come in through the Headwaters homepage.",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Community / org: ${payload.community}`,
    `Role: ${payload.role ?? "—"}`,
    "",
    "What they're trying to build:",
    payload.whatTheyNeed,
    "",
    "—Headwaters",
  ].join("\n");

  return sendEmail({
    to: operator,
    subject,
    text: body,
    replyTo: payload.email,
  });
}

// ─── Refund-invocation email helpers ──────────────────────────────────────────

/**
 * Env var for the Headwaters receiving address.  Falls back to the operator
 * address so the codetry-ship and refund-invocation paths share one secret
 * in environments that have a single catch-all inbox.
 */
const HEADWATERS_INVOCATION_DEFAULT = OPERATOR_DEFAULT;

export interface RefundInvocationEmailPayload {
  meetingIso: string;
  letterIso: string;
  contractorName: string;
  contractorEmail: string;
  contractorTitle: string | null;
  contractorOrg: string | null;
  election: "refund" | "credit";
  notMet: boolean[];
}

function fmtLongDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function addDaysIso(iso: string, days: number): string {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface InvocationContent {
  fmtMoney: Intl.NumberFormat;
  notMetCriteria: readonly string[];
  notMetCount: number;
  invocationDeadline: string;
  refundDeadline: string;
  signerLine: string;
  electionLine: string;
  introLine: string;
  meetingDateLong: string;
  letterDateLong: string;
}

function buildInvocationContent(
  payload: RefundInvocationEmailPayload,
  forCopy: boolean,
): InvocationContent {
  const fmtMoney = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const notMetCriteria = TRIAL_ACCEPTANCE_CRITERIA.filter(
    (_, i) => payload.notMet[i],
  );
  const notMetCount = notMetCriteria.length;

  const invocationDeadline = fmtLongDate(
    addDaysIso(payload.meetingIso, TRIAL_REFUND_INVOCATION_DAYS),
  );
  const refundDeadline = fmtLongDate(
    addDaysIso(payload.meetingIso, TRIAL_REFUND_PAYMENT_DAYS),
  );
  const meetingDateLong = fmtLongDate(payload.meetingIso);
  const letterDateLong = fmtLongDate(payload.letterIso);

  const signerLine = [
    payload.contractorName,
    payload.contractorTitle,
    payload.contractorOrg,
  ]
    .filter(Boolean)
    .join(", ");

  const electionLine =
    payload.election === "refund"
      ? `Cash refund of ${fmtMoney.format(TRIAL_FEE_USD)} — due no later than ${refundDeadline} (${TRIAL_REFUND_PAYMENT_DAYS} calendar days from the review meeting).`
      : `Service credit of ${fmtMoney.format(TRIAL_FEE_USD)} — applied dollar-for-dollar against the first invoice of Step 1 when Step 1 opens.`;

  const introLine = forCopy
    ? `This is a timestamped copy of the §7 refund-invocation letter you sent to Headwaters on ${letterDateLong}. Keep this email as your record that the invocation was made within the 14-day window.`
    : `${payload.contractorName}${payload.contractorOrg ? ` (${payload.contractorOrg})` : ""} has invoked the §7 refund clause of the Headwaters paid-trial agreement. The letter date is ${letterDateLong}, within the invocation deadline of ${invocationDeadline}.`;

  return {
    fmtMoney,
    notMetCriteria,
    notMetCount,
    invocationDeadline,
    refundDeadline,
    signerLine,
    electionLine,
    introLine,
    meetingDateLong,
    letterDateLong,
  };
}

function buildInvocationTextBody(
  payload: RefundInvocationEmailPayload,
  forCopy: boolean,
): string {
  const {
    notMetCriteria,
    notMetCount,
    invocationDeadline,
    signerLine,
    electionLine,
    introLine,
    meetingDateLong,
    letterDateLong,
  } = buildInvocationContent(payload, forCopy);

  const criteriaList = notMetCriteria
    .map((c, i) => `  ${i + 1}. ${c}`)
    .join("\n");

  return [
    introLine,
    "",
    "─────────────────────────────────────────────",
    "REFUND-INVOCATION LETTER",
    "Headwaters · Paid-trial agreement · §7 invocation",
    "─────────────────────────────────────────────",
    "",
    `Date: ${letterDateLong}`,
    "",
    "To: Headwaters",
    "    c/o the practitioner of record on the §0 paid-trial agreement",
    "",
    `From: ${signerLine}`,
    "",
    "Re: Invocation of the refund clause (§7) of the Headwaters eight-week paid-trial agreement.",
    "",
    `On ${meetingDateLong} we held the week-eight review meeting required by the trial agreement. At that meeting we worked through the four §7 acceptance criteria. After review, we determined that the following criteria were NOT MET by Headwaters during the eight-week window:`,
    "",
    criteriaList,
    "",
    `That is ${notMetCount} of the four criteria — at or above the §7 threshold of 2 unmet criteria. Acting within the ${TRIAL_REFUND_INVOCATION_DAYS}-calendar-day window §7 affords the contractor (the deadline being ${invocationDeadline}), the contractor hereby invokes the refund clause and elects the following remedy:`,
    "",
    `ELECTION: ${electionLine}`,
    "",
    "For the avoidance of doubt, this letter quotes §7 verbatim so the record is complete:",
    "",
    `"${TRIAL_REFUND_MECHANIC}"`,
    "",
    "WHAT SURVIVES THE REFUND:",
    TRIAL_WHAT_SURVIVES_REFUND,
    "",
    "─────────────────────────────────────────────",
    "",
    "Signed,",
    "",
    signerLine,
    `Date: ${letterDateLong}`,
  ].join("\n");
}

function buildInvocationHtmlBody(
  payload: RefundInvocationEmailPayload,
  forCopy: boolean,
): string {
  const {
    notMetCriteria,
    notMetCount,
    invocationDeadline,
    signerLine,
    electionLine,
    introLine,
    meetingDateLong,
    letterDateLong,
  } = buildInvocationContent(payload, forCopy);

  const criteriaHtml = notMetCriteria
    .map(
      (c, i) =>
        `<li style="margin-bottom:8px;"><strong>Criterion ${i + 1} (not met).</strong> ${esc(c)}</li>`,
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e4e4e7;border-radius:6px;">
      <!-- Intro banner -->
      <tr><td style="background:#1c3a2b;padding:16px 32px;border-radius:6px 6px 0 0;">
        <p style="margin:0;color:#a3c9b4;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;font-family:Arial,sans-serif;">Headwaters &middot; Paid-trial agreement &middot; §7 invocation</p>
      </td></tr>
      <!-- Intro paragraph -->
      <tr><td style="padding:24px 32px 0;">
        <p style="margin:0;font-size:14px;line-height:1.6;color:#52525b;font-family:Arial,sans-serif;">${esc(introLine)}</p>
      </td></tr>
      <!-- Letter body -->
      <tr><td style="padding:24px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4e4e7;border-radius:4px;padding:32px;" bgcolor="#ffffff">
          <tr><td style="border-bottom:1px solid #e4e4e7;padding-bottom:16px;margin-bottom:16px;">
            <h1 style="margin:0 0 4px;font-size:22px;color:#18181b;font-family:Georgia,serif;">Refund-invocation letter</h1>
          </td></tr>
          <tr><td style="padding-top:16px;">
            <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#18181b;"><strong>Date:</strong>&nbsp;${esc(letterDateLong)}</p>
            <p style="margin:0 0 4px;font-size:15px;line-height:1.7;color:#18181b;"><strong>To:</strong></p>
            <p style="margin:0 0 4px;font-size:15px;line-height:1.7;color:#18181b;">Headwaters</p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#71717a;font-style:italic;">c/o the practitioner of record on the §0 paid-trial agreement</p>
            <p style="margin:0 0 4px;font-size:15px;line-height:1.7;color:#18181b;"><strong>From:</strong></p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#18181b;">${esc(signerLine)}</p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#18181b;"><strong>Re:</strong>&nbsp;Invocation of the refund clause (§7) of the Headwaters eight-week paid-trial agreement.</p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#18181b;">On <strong>${esc(meetingDateLong)}</strong> we held the week-eight review meeting required by the trial agreement. At that meeting we worked through the four §7 acceptance criteria. After review, we determined that the following criteria <strong>were not met</strong> by Headwaters during the eight-week window:</p>
            <ol style="margin:0 0 16px;padding-left:24px;font-size:15px;line-height:1.7;color:#18181b;">
              ${criteriaHtml}
            </ol>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#18181b;">That is <strong>${notMetCount} of the four</strong> criteria — at or above the §7 threshold of 2 unmet criteria. Acting within the ${TRIAL_REFUND_INVOCATION_DAYS}-calendar-day window §7 affords the contractor (the deadline being <strong>${esc(invocationDeadline)}</strong>), the contractor hereby <strong>invokes the refund clause</strong> and elects the following remedy:</p>
            <table width="100%" cellpadding="16" cellspacing="0" style="border:1px solid #e4e4e7;border-radius:4px;margin-bottom:16px;">
              <tr><td><p style="margin:0;font-size:15px;line-height:1.7;color:#18181b;"><strong>Election:</strong>&nbsp;${esc(electionLine)}</p></td></tr>
            </table>
            <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#18181b;">For the avoidance of doubt, this letter quotes §7 verbatim so the record is complete:</p>
            <blockquote style="margin:0 0 16px;border-left:4px solid #e4e4e7;padding:8px 16px;font-style:italic;color:#52525b;font-size:15px;line-height:1.7;">${esc(TRIAL_REFUND_MECHANIC)}</blockquote>
            <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:#18181b;"><strong>What survives the refund.</strong></p>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#18181b;">${esc(TRIAL_WHAT_SURVIVES_REFUND)}</p>
            <hr style="border:none;border-top:1px solid #e4e4e7;margin:0 0 24px;">
            <p style="margin:0 0 8px;font-size:15px;color:#18181b;"><strong>Signed,</strong></p>
            <div style="height:40px;border-bottom:1px solid #18181b;width:240px;margin-bottom:8px;"></div>
            <p style="margin:0 0 4px;font-size:15px;color:#18181b;">${esc(signerLine)}</p>
            <p style="margin:0;font-size:13px;color:#71717a;">Date: ${esc(letterDateLong)}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

/**
 * Send the §7 invocation letter to Headwaters.
 * Uses HEADWATERS_INVOCATION_EMAIL env var; falls back to RESEND_OPERATOR_EMAIL.
 */
export async function sendRefundInvocationToHeadwaters(
  payload: RefundInvocationEmailPayload,
): Promise<SendResult> {
  const to =
    process.env.HEADWATERS_INVOCATION_EMAIL ??
    process.env.RESEND_OPERATOR_EMAIL ??
    HEADWATERS_INVOCATION_DEFAULT;

  const meetingDate = fmtLongDate(payload.meetingIso);
  const org = payload.contractorOrg ?? payload.contractorName;
  const subject = `§7 refund invocation — ${org} — ${meetingDate}`;

  return sendEmail({
    to,
    subject,
    text: buildInvocationTextBody(payload, false),
    html: buildInvocationHtmlBody(payload, false),
    replyTo: payload.contractorEmail,
  });
}

/**
 * Send a timestamped copy of the §7 invocation letter to the contractor
 * so they have an independent record in their own inbox.
 */
export async function sendRefundInvocationCopyToContractor(
  payload: RefundInvocationEmailPayload,
): Promise<SendResult> {
  const meetingDate = fmtLongDate(payload.meetingIso);
  const org = payload.contractorOrg ?? payload.contractorName;
  const subject = `[Your copy] §7 refund invocation — ${org} — ${meetingDate}`;

  return sendEmail({
    to: payload.contractorEmail,
    subject,
    text: buildInvocationTextBody(payload, true),
    html: buildInvocationHtmlBody(payload, true),
  });
}
