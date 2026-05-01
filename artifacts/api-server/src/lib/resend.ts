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
