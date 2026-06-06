/**
 * kitAuth — authentication middleware for Kit Builder routes.
 *
 * Accepts any of three authentication methods:
 *
 *   1. Library owner token (LIBRARY_OWNER_TOKEN env var), sent as:
 *        x-library-owner-token: <token>
 *        OR Authorization: Bearer <token>
 *      Used by North Star and the GORD widget.
 *      On success → req.kitOwnerId = "founder"
 *
 *   2. Clerk bookkeeper "owner" role (used by Headwaters Books).
 *      On success → req.kitOwnerId = bookkeeperUser.id
 *
 *   3. Clerk session with publicMetadata.role === "practitioner"
 *      Used by approved practitioners accessing the kit builder.
 *      On success → req.kitOwnerId = clerkUserId
 *
 * All paths set req.kitOwnerId so downstream route handlers can scope
 * kit operations by owner without caring which auth method was used.
 *
 * Note: practitioner read/write routes are fully scoped by ownerId —
 * a practitioner can only see and edit kits where kits.ownerId = req.kitOwnerId.
 */

import type { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { isOwnerRequest } from "./ownerAuth";
import { loadBookkeeperUser } from "./bookkeeperAuth";
import { logger } from "./logger";

export const FOUNDER_OWNER_ID = "founder";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      kitOwnerId?: string;
    }
  }
}

/**
 * requireFounderOnlyAuth — strict guard for routes that ONLY the founder may access.
 * Used for practitioner application review (GET/PATCH).
 * Practitioners (Clerk role=practitioner) are explicitly NOT allowed here.
 */
export function requireFounderOnlyAuth(req: Request, res: Response, next: NextFunction): void {
  // Library owner token (North Star / GORD widget)
  if (isOwnerRequest(req)) {
    req.kitOwnerId = FOUNDER_OWNER_ID;
    next();
    return;
  }

  // Clerk bookkeeper "owner" role only
  loadBookkeeperUser(req)
    .then((user) => {
      if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      if (user.role !== "owner") {
        res.status(403).json({ error: "Forbidden — founder access only" });
        return;
      }
      req.kitOwnerId = user.id;
      req.bookkeeperUser = user;
      next();
    })
    .catch(() => {
      res.status(401).json({ error: "Unauthorized" });
    });
}

/**
 * requireKitOwnerAuth — allows founders AND approved practitioners.
 * Used for kit builder routes (create, codetry, publish, GORD chat).
 */
export function requireKitOwnerAuth(req: Request, res: Response, next: NextFunction): void {
  // Path 1: Library owner token (North Star / GORD widget)
  if (isOwnerRequest(req)) {
    req.kitOwnerId = FOUNDER_OWNER_ID;
    next();
    return;
  }

  // Path 2 & 3: Clerk-based auth (bookkeeper owner OR practitioner)
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized — provide owner token or Clerk session" });
    return;
  }

  // Check both bookkeeper DB role and Clerk publicMetadata role
  const bookkeeperCheck = loadBookkeeperUser(req);
  const clerkCheck = clerkClient.users.getUser(userId).catch(() => null);

  Promise.all([bookkeeperCheck, clerkCheck])
    .then(([bkUser, clerkUser]) => {
      // Bookkeeper owner
      if (bkUser?.role === "owner") {
        req.kitOwnerId = bkUser.id;
        req.bookkeeperUser = bkUser;
        next();
        return;
      }

      // Clerk practitioner (approved via invitation with publicMetadata.role = "practitioner")
      const clerkRole = (clerkUser?.publicMetadata as Record<string, unknown> | undefined)?.role;
      if (clerkRole === "practitioner") {
        req.kitOwnerId = userId;
        next();
        return;
      }

      // Clerk owner (set via publicMetadata by the founder's Clerk account, if present)
      if (clerkRole === "owner") {
        req.kitOwnerId = userId;
        next();
        return;
      }

      logger.warn({ userId, bkRole: bkUser?.role, clerkRole }, "[kitAuth] Clerk user lacks required role");
      res.status(403).json({ error: "Forbidden — owner or practitioner role required" });
    })
    .catch((err) => {
      logger.error({ err }, "[kitAuth] auth check failed");
      res.status(401).json({ error: "Unauthorized" });
    });
}
