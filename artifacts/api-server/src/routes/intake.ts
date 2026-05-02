import { Router, type IRouter, type Request } from "express";
import { db, communityIntakeTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { checkRateLimit } from "../lib/rateLimit";
import { sendCommunityIntakeNotification } from "../lib/resend";

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

router.post("/intake", async (req, res) => {
  const ip = clientIp(req);

  const limitResult = checkRateLimit(`intake:${ip}`, {
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
  const role = readStr(body, "role", 200);
  const whatTheyNeed = readStr(body, "whatTheyNeed", 2000);

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
  if (!whatTheyNeed) {
    res.status(422).json({ error: "Please describe what you are trying to build." });
    return;
  }

  const [row] = await db
    .insert(communityIntakeTable)
    .values({
      name,
      email,
      community,
      role,
      whatTheyNeed,
      sourceIp: ip,
      userAgent: req.header("user-agent")?.slice(0, 500) ?? null,
    })
    .returning();

  const notif = await sendCommunityIntakeNotification({
    name,
    email,
    community,
    role,
    whatTheyNeed,
  });

  await db
    .update(communityIntakeTable)
    .set({
      notificationStatus: notif.status,
      notificationError: notif.error ?? null,
    })
    .where(eq(communityIntakeTable.id, row!.id));

  res.status(201).json({
    ok: true,
    id: row!.id,
    name: row!.name,
  });
});

export default router;
