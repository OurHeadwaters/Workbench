import type { Request, Response, RequestHandler } from "express";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import { db } from "@workspace/db";
import {
  curatorsTable,
  curatorSessionsTable,
} from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";

export const OWNER_TOKEN: string | undefined = process.env.LIBRARY_OWNER_TOKEN;

const SESSION_TTL_MS = 90 * 24 * 60 * 60 * 1000;

export type CuratorRow = typeof curatorsTable.$inferSelect;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 2) return false;
  const [salt, hash] = parts as [string, string];
  const hashBuf = Buffer.from(hash, "hex");
  let testBuf: Buffer;
  try {
    testBuf = scryptSync(password, salt, 64) as Buffer;
  } catch {
    return false;
  }
  if (hashBuf.length !== testBuf.length) return false;
  return timingSafeEqual(hashBuf, testBuf);
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

function timingSafeEqStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  let mismatch = 0;
  for (let i = 0; i < ab.length; i++) mismatch |= ab[i]! ^ bb[i]!;
  return mismatch === 0;
}

export function isValidOwnerToken(token: string | null | undefined): boolean {
  if (!OWNER_TOKEN) return false;
  if (!token) return false;
  return timingSafeEqStr(token, OWNER_TOKEN);
}

export function isOwnerRequest(req: Request): boolean {
  return isValidOwnerToken(extractOwnerToken(req));
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

export async function getCuratorFromToken(
  token: string | null | undefined,
): Promise<CuratorRow | null> {
  if (!token) return null;
  const rows = await db
    .select({ curator: curatorsTable, session: curatorSessionsTable })
    .from(curatorSessionsTable)
    .innerJoin(curatorsTable, eq(curatorSessionsTable.curatorId, curatorsTable.id))
    .where(
      and(
        eq(curatorSessionsTable.token, token),
        gt(curatorSessionsTable.expiresAt, new Date()),
      ),
    )
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  if (row.curator.revokedAt) return null;
  return row.curator;
}

export async function createSessionForCurator(curatorId: string): Promise<string> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(curatorSessionsTable).values({ curatorId, token, expiresAt });
  await db
    .update(curatorsTable)
    .set({ lastSignInAt: new Date() })
    .where(eq(curatorsTable.id, curatorId));
  return token;
}

export async function findOrCreateOwnerCurator(name: string, email: string): Promise<CuratorRow> {
  const existing = await db
    .select()
    .from(curatorsTable)
    .where(eq(curatorsTable.isOwner, true))
    .limit(1);
  if (existing[0]) return existing[0];
  const [created] = await db
    .insert(curatorsTable)
    .values({ email, name, isOwner: true, passwordHash: null })
    .returning();
  return created!;
}

export const requireOwnerAuth: RequestHandler = async (req, res, next) => {
  const token = extractOwnerToken(req);
  const curator = await getCuratorFromToken(token);
  if (!curator) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.locals.curator = curator;
  next();
};

export function getRequestCurator(res: Response): CuratorRow | null {
  return (res.locals.curator as CuratorRow) ?? null;
}

export function requireIsOwner(res: Response): boolean {
  const curator = getRequestCurator(res);
  return curator?.isOwner === true;
}
