import { type Request, type Response, type NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { db, bookkeeperUsersTable, bookkeeperAuditLogTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

export type BookkeeperRole =
  | "owner"
  | "ops_manager"
  | "bookkeeper"
  | "food_handler";

const VALID_ROLES: readonly BookkeeperRole[] = [
  "owner",
  "ops_manager",
  "bookkeeper",
  "food_handler",
];

export function isValidRole(value: unknown): value is BookkeeperRole {
  return (
    typeof value === "string" &&
    (VALID_ROLES as readonly string[]).includes(value)
  );
}

// The owner email is seeded from env at server boot. Anyone signing in with
// this email gets promoted to "owner" automatically; everyone else lands as
// "food_handler" by default until an owner promotes them.
const OWNER_EMAIL =
  (process.env.HEADWATERS_OWNER_EMAIL ?? "").trim().toLowerCase() || null;

export interface BookkeeperUser {
  id: string;
  clerkUserId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: BookkeeperRole;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      bookkeeperUser?: BookkeeperUser;
    }
  }
}

// Resolve the signed-in Clerk user into our app_users mirror row, creating
// the row on first sight. Returns null when the request is unauthenticated.
//
// Role precedence on first creation:
//   1. matches HEADWATERS_OWNER_EMAIL → "owner"
//   2. otherwise → "food_handler" (least-privilege default)
//
// On subsequent calls we never silently change a stored role — owner role
// changes flow through PATCH /bookkeeper/users/:id only.
export async function loadBookkeeperUser(
  req: Request,
): Promise<BookkeeperUser | null> {
  const auth = getAuth(req);
  const clerkUserId = auth?.userId;
  if (!clerkUserId) return null;

  // Try cache first
  const existing = await db
    .select()
    .from(bookkeeperUsersTable)
    .where(eq(bookkeeperUsersTable.clerkUserId, clerkUserId))
    .limit(1);

  let row = existing[0];

  if (!row) {
    // First sight — fetch identity from Clerk and create the mirror row.
    let email = "";
    let firstName: string | null = null;
    let lastName: string | null = null;
    try {
      const u = await clerkClient.users.getUser(clerkUserId);
      email =
        u.primaryEmailAddress?.emailAddress ??
        u.emailAddresses[0]?.emailAddress ??
        "";
      firstName = u.firstName ?? null;
      lastName = u.lastName ?? null;
    } catch {
      // Clerk lookup failed — bail rather than create a half-row.
      return null;
    }
    if (!email) return null;

    const initialRole: BookkeeperRole =
      OWNER_EMAIL && email.toLowerCase() === OWNER_EMAIL
        ? "owner"
        : "food_handler";

    const inserted = await db
      .insert(bookkeeperUsersTable)
      .values({
        clerkUserId,
        email,
        firstName,
        lastName,
        role: initialRole,
        lastSeenAt: new Date(),
      })
      .returning();
    row = inserted[0];
  } else {
    // Touch lastSeenAt at most once per request, and promote to owner if the
    // env-configured owner email matches but the stored role is still default.
    const updates: Partial<typeof bookkeeperUsersTable.$inferInsert> = {
      lastSeenAt: new Date(),
    };
    if (
      OWNER_EMAIL &&
      row.email.toLowerCase() === OWNER_EMAIL &&
      row.role !== "owner"
    ) {
      updates.role = "owner";
    }
    await db
      .update(bookkeeperUsersTable)
      .set(updates)
      .where(eq(bookkeeperUsersTable.id, row.id));
    if (updates.role) row = { ...row, role: updates.role };
  }

  const role: BookkeeperRole = isValidRole(row.role) ? row.role : "food_handler";
  return {
    id: row.id,
    clerkUserId: row.clerkUserId,
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    role,
  };
}

export function requireAuth() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await loadBookkeeperUser(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    req.bookkeeperUser = user;
    next();
  };
}

export function requireRole(...roles: BookkeeperRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.bookkeeperUser ?? (await loadBookkeeperUser(req));
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    req.bookkeeperUser = user;
    if (!roles.includes(user.role)) {
      res.status(403).json({
        error: `Forbidden — requires role: ${roles.join(", ")}`,
      });
      return;
    }
    next();
  };
}

export async function writeAudit(opts: {
  action: string;
  entityType: string;
  entityId?: string | null;
  actor: BookkeeperUser;
  details?: Record<string, unknown>;
}): Promise<void> {
  await db.insert(bookkeeperAuditLogTable).values({
    action: opts.action,
    entityType: opts.entityType,
    entityId: opts.entityId ?? null,
    actorId: opts.actor.id,
    actorEmail: opts.actor.email,
    actorRole: opts.actor.role,
    details: opts.details ?? null,
  });
}

// Suppress unused import warning in environments that strip the helper
void sql;
