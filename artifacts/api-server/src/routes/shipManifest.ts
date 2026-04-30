import { Router, type IRouter, type Request } from "express";
import { db, shipManifestTable } from "@workspace/db";
import { desc, sql } from "drizzle-orm";
import { isOwnerRequest, OWNER_TOKEN } from "../lib/ownerAuth";
import { checkRateLimit } from "../lib/rateLimit";
import {
  sendOperatorNotification,
  sendSignerReply,
  type ManifestPayload,
} from "../lib/resend";

const router: IRouter = Router();

// ----------------------- helpers -----------------------

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

function csvEscape(value: string): string {
  if (value === "") return "";
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function rowToCsv(row: typeof shipManifestTable.$inferSelect): string {
  return [
    row.id,
    row.createdAt.toISOString(),
    row.updatedAt.toISOString(),
    row.name,
    row.email,
    row.org ?? "",
    row.role ?? "",
    row.wouldBring ?? "",
    row.wouldWant ?? "",
    row.notificationStatus ?? "",
    row.replyStatus ?? "",
  ]
    .map((v) => csvEscape(String(v)))
    .join(",");
}

// ----------------------- public POST -----------------------

router.post("/", async (req, res) => {
  const ip = clientIp(req);

  // 5/min per IP, then 30/hour per IP — covers casual mash-the-button
  // mistakes without locking out a small workshop room behind one NAT.
  const minute = checkRateLimit(`ship:ip:min:${ip}`, {
    max: 5,
    windowMs: 60 * 1000,
  });
  if (!minute.ok) {
    res.status(429).json({
      error: "Too many sign-ons from this network just now. Try again shortly.",
      retryAfterSec: minute.retryAfterSec,
    });
    return;
  }
  const hour = checkRateLimit(`ship:ip:hr:${ip}`, {
    max: 30,
    windowMs: 60 * 60 * 1000,
  });
  if (!hour.ok) {
    res.status(429).json({
      error: "This network has hit the hourly cap. Try again later.",
      retryAfterSec: hour.retryAfterSec,
    });
    return;
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const name = readStr(body, "name", 200);
  const emailRaw = readStr(body, "email", 320);
  const org = readStr(body, "org", 300);
  const role = readStr(body, "role", 300);
  const wouldBring = readStr(body, "wouldBring", 4000);
  const wouldWant = readStr(body, "wouldWant", 4000);

  if (!name) {
    res.status(400).json({ error: "Name is required." });
    return;
  }
  if (!emailRaw) {
    res.status(400).json({ error: "Email is required." });
    return;
  }
  const email = emailRaw.toLowerCase();
  if (!EMAIL_RE.test(email)) {
    res.status(400).json({ error: "That email doesn't look right." });
    return;
  }

  // Honeypot — a real visitor never fills the hidden `website` field.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    res.status(204).send();
    return;
  }

  // Per-email cap: re-signing once a minute is fine; spamming the same
  // address is not.
  const perEmail = checkRateLimit(`ship:email:${email}`, {
    max: 3,
    windowMs: 60 * 60 * 1000,
  });
  if (!perEmail.ok) {
    res.status(429).json({
      error: "This email has been re-signed several times already.",
      retryAfterSec: perEmail.retryAfterSec,
    });
    return;
  }

  const userAgent = req.header("user-agent")?.slice(0, 500) ?? null;

  // Upsert by email so a re-sign overwrites the previous payload
  // instead of producing dupes.  We always save first, then send mail
  // best-effort and stamp the result columns.
  const [saved] = await db
    .insert(shipManifestTable)
    .values({
      name,
      email,
      org,
      role,
      wouldBring,
      wouldWant,
      sourceIp: ip,
      userAgent,
    })
    .onConflictDoUpdate({
      target: shipManifestTable.email,
      set: {
        name,
        org,
        role,
        wouldBring,
        wouldWant,
        sourceIp: ip,
        userAgent,
        updatedAt: sql`now()`,
      },
    })
    .returning();

  if (!saved) {
    res.status(500).json({ error: "Could not save sign-on." });
    return;
  }

  const payload: ManifestPayload = {
    name,
    email,
    org,
    role,
    wouldBring,
    wouldWant,
  };

  const [opResult, replyResult] = await Promise.all([
    sendOperatorNotification(payload),
    sendSignerReply(payload),
  ]);

  await db
    .update(shipManifestTable)
    .set({
      notificationStatus: opResult.status,
      notificationError: opResult.error ?? null,
      replyStatus: replyResult.status,
      replyError: replyResult.error ?? null,
    })
    .where(sql`${shipManifestTable.id} = ${saved.id}`);

  res.status(200).json({
    ok: true,
    id: saved.id,
    name: saved.name,
    confirmed: true,
  });
});

// ----------------------- owner-gated GET / CSV -----------------------

function requireOwner(req: Request): boolean {
  return !!OWNER_TOKEN && isOwnerRequest(req);
}

router.get("/", async (req, res) => {
  if (!requireOwner(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const rows = await db
    .select()
    .from(shipManifestTable)
    .orderBy(desc(shipManifestTable.createdAt));
  res.json({
    count: rows.length,
    entries: rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      org: r.org,
      role: r.role,
      wouldBring: r.wouldBring,
      wouldWant: r.wouldWant,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      notificationStatus: r.notificationStatus,
      replyStatus: r.replyStatus,
      notificationError: r.notificationError,
      replyError: r.replyError,
    })),
  });
});

router.get("/export.csv", async (req, res) => {
  if (!requireOwner(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const rows = await db
    .select()
    .from(shipManifestTable)
    .orderBy(desc(shipManifestTable.createdAt));

  const header = [
    "id",
    "createdAt",
    "updatedAt",
    "name",
    "email",
    "org",
    "role",
    "wouldBring",
    "wouldWant",
    "notificationStatus",
    "replyStatus",
  ].join(",");
  const body = rows.map(rowToCsv).join("\n");
  const csv = body.length > 0 ? `${header}\n${body}\n` : `${header}\n`;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="codetry-ship-manifest-${new Date()
      .toISOString()
      .slice(0, 10)}.csv"`,
  );
  res.status(200).send(csv);
});

export default router;
