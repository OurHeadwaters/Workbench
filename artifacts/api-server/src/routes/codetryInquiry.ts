import { Router, type IRouter, type Request } from "express";
import fs from "fs";
import path from "path";
import { checkRateLimit } from "../lib/rateLimit";
import { sendCodetryInquiryNotification } from "../lib/resend";

const router: IRouter = Router();

const DATA_DIR = path.join(process.cwd(), "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "codetry-inquiries.jsonl");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STAGE_LABELS: Record<number, string> = {
  1: "The Doom Crowd",
  2: "The Ron Paul Pivot",
  3: "The Ramsey On-Ramp",
  4: "Crypto Corner",
  5: "The Headwaters Kitchen Table",
  6: "The Codetry Ship",
};

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

function appendInquiry(record: Record<string, unknown>): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.appendFileSync(INQUIRIES_FILE, JSON.stringify(record) + "\n", "utf8");
}

router.post("/inquiry", async (req, res) => {
  const ip = clientIp(req);

  const limitResult = await checkRateLimit(`codetry-inquiry:${ip}`, {
    windowMs: 60 * 60 * 1000,
    max: 5,
  });
  if (!limitResult.ok) {
    res.status(429).json({
      error: "Too many requests. Please wait before submitting again.",
      retryAfterSec: limitResult.retryAfterSec,
    });
    return;
  }

  const body = (req.body ?? {}) as Record<string, unknown>;

  const honeypot = readStr(body, "website", 1);
  if (honeypot) {
    res.status(200).json({ ok: true });
    return;
  }

  const name = readStr(body, "name", 200);
  const email = readStr(body, "email", 200);
  const community = readStr(body, "community", 300);
  const whatTheyWorkingOn = readStr(body, "whatTheyWorkingOn", 2000);
  const stageRaw = body["stage"];
  const stage =
    typeof stageRaw === "number"
      ? stageRaw
      : typeof stageRaw === "string"
      ? parseInt(stageRaw, 10)
      : NaN;

  if (!name) {
    res.status(422).json({ error: "Name is required." });
    return;
  }
  if (!email || !EMAIL_RE.test(email)) {
    res.status(422).json({ error: "A valid email address is required." });
    return;
  }
  if (!community) {
    res.status(422).json({ error: "Community or organisation name is required." });
    return;
  }
  if (!whatTheyWorkingOn) {
    res.status(422).json({ error: "Please describe what you are working on." });
    return;
  }
  if (isNaN(stage) || stage < 1 || stage > 6) {
    res.status(422).json({ error: "Stage must be a number between 1 and 6." });
    return;
  }

  const stageLabel = STAGE_LABELS[stage] ?? `Stage ${stage}`;

  const record = {
    id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    submittedAt: new Date().toISOString(),
    name,
    email,
    community,
    whatTheyWorkingOn,
    stage,
    stageLabel,
  };

  try {
    appendInquiry(record);
  } catch (err) {
    console.error("[codetry-inquiry] Failed to persist inquiry — aborting:", err);
    res.status(500).json({ error: "Could not save your inquiry. Please try again." });
    return;
  }

  const emailResult = await sendCodetryInquiryNotification({
    name,
    email,
    community,
    whatTheyWorkingOn,
    stage,
    stageLabel,
  });

  res.status(201).json({
    ok: true,
    id: record.id,
    emailStatus: emailResult.status,
  });
});

export default router;
