import { Router, type IRouter, type Request } from "express";
import { createHash } from "node:crypto";
import { checkRateLimit } from "../lib/rateLimit";
import {
  sendRefundInvocationToHeadwaters,
  sendRefundInvocationCopyToContractor,
} from "../lib/resend";
import {
  TRIAL_ACCEPTANCE_CRITERIA,
  TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA,
  TRIAL_REFUND_INVOCATION_DAYS,
} from "@workspace/headwaters-pricing";

const router: IRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clientIp(req: Request): string {
  const xff = req.header("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

function readStr(
  body: Record<string, unknown>,
  key: string,
  maxLen: number,
): string | null {
  const v = body[key];
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  if (trimmed.length === 0) return null;
  return trimmed.slice(0, maxLen);
}

function isoToDate(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y!, m! - 1, d!);
  if (Number.isNaN(dt.getTime())) return null;
  // Round-trip check: reject rollover dates (e.g. 2026-02-30 → March)
  const roundTrip = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  return roundTrip === iso ? dt : null;
}

export interface RefundInvocationPayload {
  meetingIso: string;
  letterIso: string;
  contractorName: string;
  contractorEmail: string;
  contractorTitle: string | null;
  contractorOrg: string | null;
  election: "refund" | "credit";
  notMet: boolean[];
}

router.post("/", async (req, res) => {
  const ip = clientIp(req);

  const minuteLimit = checkRateLimit(`refund-inv:ip:min:${ip}`, {
    max: 3,
    windowMs: 60 * 1000,
  });
  if (!minuteLimit.ok) {
    res.status(429).json({
      error: "Too many requests from this network. Try again shortly.",
      retryAfterSec: minuteLimit.retryAfterSec,
    });
    return;
  }
  const hourLimit = checkRateLimit(`refund-inv:ip:hr:${ip}`, {
    max: 10,
    windowMs: 60 * 60 * 1000,
  });
  if (!hourLimit.ok) {
    res.status(429).json({
      error: "Hourly limit reached from this network. Try again later.",
      retryAfterSec: hourLimit.retryAfterSec,
    });
    return;
  }

  const body = (req.body ?? {}) as Record<string, unknown>;

  if (typeof body.website === "string" && body.website.trim() !== "") {
    res.status(204).send();
    return;
  }

  const meetingIso = readStr(body, "meetingIso", 10);
  const letterIso = readStr(body, "letterIso", 10);
  const contractorName = readStr(body, "contractorName", 200);
  const contractorEmailRaw = readStr(body, "contractorEmail", 320);
  const contractorTitle = readStr(body, "contractorTitle", 200);
  const contractorOrg = readStr(body, "contractorOrg", 300);
  const election = body["election"];
  const notMetRaw = body["notMet"];

  if (!meetingIso) {
    res.status(400).json({ error: "meetingIso (week-eight review date) is required." });
    return;
  }
  if (!letterIso) {
    res.status(400).json({ error: "letterIso (letter date) is required." });
    return;
  }
  if (!contractorName) {
    res.status(400).json({ error: "contractorName is required." });
    return;
  }
  if (!contractorEmailRaw) {
    res.status(400).json({ error: "contractorEmail is required." });
    return;
  }
  const contractorEmail = contractorEmailRaw.toLowerCase();
  if (!EMAIL_RE.test(contractorEmail)) {
    res.status(400).json({ error: "contractorEmail does not look valid." });
    return;
  }
  if (election !== "refund" && election !== "credit") {
    res.status(400).json({ error: "election must be 'refund' or 'credit'." });
    return;
  }
  if (
    !Array.isArray(notMetRaw) ||
    notMetRaw.length !== TRIAL_ACCEPTANCE_CRITERIA.length ||
    !notMetRaw.every((v) => typeof v === "boolean")
  ) {
    res.status(400).json({
      error: `notMet must be an array of exactly ${TRIAL_ACCEPTANCE_CRITERIA.length} booleans.`,
    });
    return;
  }
  const notMet: boolean[] = notMetRaw as boolean[];
  const notMetCount = notMet.filter(Boolean).length;

  if (notMetCount < TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA) {
    res.status(400).json({
      error: `§7 requires at least ${TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA} criteria to be not met. You have ${notMetCount}.`,
    });
    return;
  }

  const meetingDate = isoToDate(meetingIso);
  const letterDate = isoToDate(letterIso);
  if (!meetingDate || !letterDate) {
    res.status(400).json({ error: "meetingIso and letterIso must be valid YYYY-MM-DD dates." });
    return;
  }

  const deadlineDate = new Date(meetingDate);
  deadlineDate.setDate(deadlineDate.getDate() + TRIAL_REFUND_INVOCATION_DAYS);

  if (letterDate > deadlineDate) {
    res.status(400).json({
      error: `Letter date is outside the ${TRIAL_REFUND_INVOCATION_DAYS}-day invocation window. The deadline was ${deadlineDate.toISOString().slice(0, 10)}.`,
    });
    return;
  }
  if (letterDate < meetingDate) {
    res.status(400).json({
      error: "Letter date cannot be before the review meeting date.",
    });
    return;
  }

  const payload: RefundInvocationPayload = {
    meetingIso,
    letterIso,
    contractorName,
    contractorEmail,
    contractorTitle,
    contractorOrg,
    election,
    notMet,
  };

  const payloadHash = createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");

  const sentAt = new Date().toISOString();

  console.log(
    JSON.stringify({
      event: "refund_invocation_send",
      sentAt,
      payloadHash,
      contractorEmail,
      meetingIso,
      letterIso,
      election,
      notMetCount,
    }),
  );

  const [headwatersResult, contractorResult] = await Promise.all([
    sendRefundInvocationToHeadwaters(payload),
    sendRefundInvocationCopyToContractor(payload),
  ]);

  // Overall status reflects both sends:
  // - "skipped"  → RESEND_API_KEY absent; both will be skipped
  // - "sent"     → both Headwaters and contractor copy succeeded
  // - "partial"  → Headwaters sent but contractor copy failed (or vice-versa)
  // - "failed"   → Headwaters send failed (primary obligation not met)
  const overallStatus: "sent" | "failed" | "skipped" | "partial" =
    headwatersResult.status === "skipped"
      ? "skipped"
      : headwatersResult.status === "failed"
        ? "failed"
        : contractorResult.status === "failed"
          ? "partial"
          : "sent";

  res.status(200).json({
    ok: true,
    status: overallStatus,
    sentAt,
    payloadHash,
    headwaters: headwatersResult,
    contractor: contractorResult,
  });
});

export default router;
