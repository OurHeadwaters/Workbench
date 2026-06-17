import { Router, type IRouter, type Request, type Response, type RequestHandler } from "express";
import { db, odysseyTrailSignsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { checkRateLimit } from "../lib/rateLimit";
import { getAuth } from "@clerk/express";
import { parseZoneTags, parseTopicTags } from "@workspace/odyssey";
import type { TrailSign } from "@workspace/odyssey";

const router: IRouter = Router();

// ── Admin authorization ──────────────────────────────────────────────────────
//
// ODYSSEY_ADMIN_USER_IDS: comma-separated list of Clerk user IDs that are
// allowed to access the moderation endpoints (approve / reject / queue).
//
// If the env var is not set, ALL admin requests are rejected (fail closed).
// Set it in the environment to at least the founder's Clerk user ID.
//
function getAdminUserIds(): Set<string> {
  const raw = process.env.ODYSSEY_ADMIN_USER_IDS ?? "";
  const ids = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return new Set(ids);
}

function isAdminUser(userId: string | null | undefined): boolean {
  if (!userId) return false;
  const allowed = getAdminUserIds();
  if (allowed.size === 0) return false;
  return allowed.has(userId);
}

const requireOdysseyAdmin: RequestHandler = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }
  if (!isAdminUser(userId)) {
    res.status(403).json({ error: "Admin access required." });
    return;
  }
  next();
};

// ── URL safety ───────────────────────────────────────────────────────────────
// Only allow https:// URLs or absolute paths starting with /
// to prevent javascript: or data: URIs from being approved onto the trail.
//
function isSafeActionUrl(url: string): boolean {
  if (url.startsWith("/")) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function clientIp(req: Request): string {
  const xff = req.header("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

// ── GET /api/odyssey/trail-signs ────────────────────────────────────────────
// Public: returns approved trail signs that match the given zone and/or tags.
// Query params:
//   zone  — "Z1" | "Z2" | "Z3" | "Z4"  (optional)
//   tags  — comma-separated topic tags  (optional)
//
router.get("/trail-signs", async (req, res) => {
  const zone = typeof req.query.zone === "string" ? req.query.zone.trim() : null;
  const rawTags = typeof req.query.tags === "string" ? req.query.tags.trim() : "";
  const requestedTags = rawTags
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const rows = await db
    .select()
    .from(odysseyTrailSignsTable)
    .where(eq(odysseyTrailSignsTable.status, "approved"));

  const signs: TrailSign[] = rows
    .map((row) => ({
      id: row.id,
      toolName: row.toolName,
      problemStatement: row.problemStatement,
      costTier: row.costTier as TrailSign["costTier"],
      actionUrl: row.actionUrl,
      actionLabel: row.actionLabel,
      communityProof: row.communityProof ?? undefined,
      zoneTags: parseZoneTags(row.zoneTags),
      topicTags: parseTopicTags(row.topicTags),
    }))
    .filter((sign) => {
      if (zone) {
        const zoneMatch =
          sign.zoneTags.includes("any") ||
          sign.zoneTags.includes(zone as TrailSign["zoneTags"][number]);
        if (!zoneMatch) return false;
      }
      if (requestedTags.length > 0) {
        const signTags = sign.topicTags.map((t) => t.toLowerCase());
        return requestedTags.some((t) => signTags.includes(t));
      }
      return true;
    });

  res.json({ signs });
});

// ── POST /api/odyssey/sponsor-intake ────────────────────────────────────────
// Public: a business submits their tool for vetting.
// Rate-limited. Submissions are "pending" until an admin approves them.
//
const IntakeSchema = z.object({
  toolName:         z.string().min(2).max(200),
  problemStatement: z.string().min(10).max(1000),
  costTier:         z.enum(["free", "$", "$$", "$$$"]),
  actionUrl:        z.string().url().max(500),
  actionLabel:      z.string().max(100).optional(),
  communityProof:   z.string().max(300).optional(),
  zoneTags:         z.string().max(100),
  topicTags:        z.string().max(300),
  submitterName:    z.string().min(2).max(200),
  submitterEmail:   z.string().email().max(200),
  submitterNote:    z.string().max(1000).optional(),
  website:          z.string().optional(),
});

router.post("/sponsor-intake", async (req, res) => {
  const ip = clientIp(req);

  const limitResult = await checkRateLimit(`odyssey-intake:${ip}`, {
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

  const parsed = IntakeSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(422).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
    return;
  }

  const data = parsed.data;

  if (data.website) {
    res.status(200).json({ ok: true });
    return;
  }

  if (!isSafeActionUrl(data.actionUrl)) {
    res.status(422).json({ error: "Action URL must be an https:// address." });
    return;
  }

  const [row] = await db
    .insert(odysseyTrailSignsTable)
    .values({
      toolName:         data.toolName,
      problemStatement: data.problemStatement,
      costTier:         data.costTier,
      actionUrl:        data.actionUrl,
      actionLabel:      data.actionLabel ?? "Take a look",
      communityProof:   data.communityProof ?? null,
      zoneTags:         data.zoneTags,
      topicTags:        data.topicTags,
      submitterName:    data.submitterName,
      submitterEmail:   data.submitterEmail,
      submitterNote:    data.submitterNote ?? null,
      status:           "pending",
    })
    .returning({ id: odysseyTrailSignsTable.id });

  res.status(201).json({ ok: true, id: row!.id });
});

// ── PATCH /api/odyssey/trail-signs/:id/approve ──────────────────────────────
// Admin only (ODYSSEY_ADMIN_USER_IDS): approve a pending trail sign.
//
router.patch("/trail-signs/:id/approve", requireOdysseyAdmin, async (req, res) => {
  const { userId } = getAuth(req);
  const id = String(req.params.id);

  const [updated] = await db
    .update(odysseyTrailSignsTable)
    .set({
      status:     "approved",
      approvedAt: new Date(),
      approvedBy: userId!,
      updatedAt:  new Date(),
    })
    .where(eq(odysseyTrailSignsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Trail sign not found." });
    return;
  }

  res.json({ ok: true, sign: updated });
});

// ── PATCH /api/odyssey/trail-signs/:id/reject ───────────────────────────────
// Admin only (ODYSSEY_ADMIN_USER_IDS): reject a pending trail sign.
//
router.patch("/trail-signs/:id/reject", requireOdysseyAdmin, async (req, res) => {
  const id = String(req.params.id);
  const reason =
    typeof req.body?.reason === "string" ? req.body.reason.slice(0, 500) : null;

  const [updated] = await db
    .update(odysseyTrailSignsTable)
    .set({
      status:          "rejected",
      rejectionReason: reason,
      updatedAt:       new Date(),
    })
    .where(eq(odysseyTrailSignsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Trail sign not found." });
    return;
  }

  res.json({ ok: true });
});

// ── GET /api/odyssey/admin/queue ─────────────────────────────────────────────
// Admin only (ODYSSEY_ADMIN_USER_IDS): list all pending trail signs for review.
//
router.get("/admin/queue", requireOdysseyAdmin, async (_req, res) => {
  const rows = await db
    .select()
    .from(odysseyTrailSignsTable)
    .where(eq(odysseyTrailSignsTable.status, "pending"))
    .orderBy(odysseyTrailSignsTable.submittedAt);

  res.json({ queue: rows });
});

export default router;
