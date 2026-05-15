import type { Request, RequestHandler } from "express";
import { randomBytes } from "crypto";
import { db } from "@workspace/db";
import { libraryMagicLinksTable } from "@workspace/db";
import { eq, and, gt, isNull } from "drizzle-orm";

export const OWNER_TOKEN: string | undefined = process.env.LIBRARY_OWNER_TOKEN;

/** Comma-separated list of emails allowed to request a magic link. */
const RAW_OWNER_EMAILS = process.env.LIBRARY_OWNER_EMAILS ?? "";
export const OWNER_EMAILS: Set<string> = new Set(
  RAW_OWNER_EMAILS.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

/** How long a magic-link token is valid (15 minutes). */
const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;

function timingSafeEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  let mismatch = 0;
  for (let i = 0; i < ab.length; i++) mismatch |= ab[i]! ^ bb[i]!;
  return mismatch === 0;
}

export function extractOwnerToken(req: Request): string | null {
  const header = req.header("x-library-owner-token");
  if (header) return header.trim();
  const auth = req.header("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  return null;
}

export function isValidOwnerToken(token: string | null | undefined): boolean {
  if (!OWNER_TOKEN) return false;
  if (!token) return false;
  return timingSafeEq(token, OWNER_TOKEN);
}

export function isOwnerRequest(req: Request): boolean {
  return isValidOwnerToken(extractOwnerToken(req));
}

export const requireOwnerAuth: RequestHandler = (req, res, next) => {
  if (!OWNER_TOKEN) {
    res.status(503).json({
      error:
        "Library owner authentication is not configured (LIBRARY_OWNER_TOKEN missing).",
    });
    return;
  }
  if (isOwnerRequest(req)) {
    next();
    return;
  }
  res.status(401).json({ error: "Unauthorized" });
};

export function isAllowedCuratorEmail(email: string): boolean {
  return OWNER_EMAILS.has(email.trim().toLowerCase());
}

export async function createMagicLinkToken(email: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + MAGIC_LINK_TTL_MS);
  await db.insert(libraryMagicLinksTable).values({ token, email, expiresAt });
  return token;
}

/**
 * Verify a magic-link token atomically.  Issues a single UPDATE … RETURNING
 * that only matches rows where the token is correct, not yet expired, and not
 * yet used.  Because the WHERE predicate includes `used_at IS NULL`, two
 * concurrent requests can never both succeed — the second update finds zero
 * matching rows and returns null.
 */
export async function consumeMagicLinkToken(
  token: string,
): Promise<string | null> {
  const now = new Date();
  const updated = await db
    .update(libraryMagicLinksTable)
    .set({ usedAt: now })
    .where(
      and(
        eq(libraryMagicLinksTable.token, token),
        gt(libraryMagicLinksTable.expiresAt, now),
        isNull(libraryMagicLinksTable.usedAt),
      ),
    )
    .returning({ email: libraryMagicLinksTable.email });
  return updated.length ? updated[0]!.email : null;
}
