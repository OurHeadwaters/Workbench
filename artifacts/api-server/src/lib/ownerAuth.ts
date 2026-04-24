import type { Request, RequestHandler } from "express";

export const OWNER_TOKEN: string | undefined = process.env.LIBRARY_OWNER_TOKEN;

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
