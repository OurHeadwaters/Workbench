import { describe, it, expect, beforeEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ----------------------- mocks -----------------------
//
// `bookkeeper.ts` is a four-role RBAC router.  These tests cover the
// auth/role contract end-to-end: every role-gated endpoint, every
// "you can only see your own row" scope, and the auto-promote-on-first-
// sight rule that turns the configured owner email into role=owner.
//
// Three things must be in place BEFORE the route module loads:
//
//   1. `process.env.HEADWATERS_OWNER_EMAIL` — captured once at import
//      time inside `lib/bookkeeperAuth.ts`.
//   2. `@workspace/db` — replaced with the in-memory fake.
//   3. `@clerk/express` — replaced with a stub that reads the current
//      "signed-in user" from the shared `test/state` module.

vi.hoisted(() => {
  process.env.HEADWATERS_OWNER_EMAIL = "owner@example.com";
});

vi.mock("@workspace/db", async () => {
  const { makeTable, makeFakeDb } = await import("../test/fakeDb");

  const bookkeeperUsersTable = makeTable({
    name: "bk_app_users",
    pk: ["id"],
    columns: [
      "id",
      "clerkUserId",
      "email",
      "firstName",
      "lastName",
      "role",
      "createdAt",
      "lastSeenAt",
      "lastNudgedAt",
    ],
    defaults: { role: "food_handler", lastNudgedAt: null, lastSeenAt: null },
  });
  const bookkeeperCostCentresTable = makeTable({
    name: "bk_cost_centres",
    pk: ["id"],
    columns: [
      "id",
      "code",
      "name",
      "parentEntity",
      "owner",
      "description",
      "color",
      "isActive",
      "createdAt",
    ],
  });
  const bookkeeperAccountsTable = makeTable({
    name: "bk_accounts",
    pk: ["id"],
    columns: [
      "id",
      "code",
      "name",
      "type",
      "normalSide",
      "costCentreCode",
      "mirrorAccountCode",
      "notes",
      "taxCode",
      "isActive",
      "createdAt",
    ],
    defaults: { taxCode: "none" },
  });
  const bookkeeperTransactionsTable = makeTable({
    name: "bk_transactions",
    pk: ["id"],
    columns: [
      "id",
      "postedDate",
      "description",
      "reference",
      "status",
      "voidedReason",
      "voidedAt",
      "reversesTransactionId",
      "sourceSubmissionId",
      "cleared",
      "clearedAt",
      "clearedByUserId",
      "createdById",
      "createdByEmail",
      "createdAt",
    ],
    defaults: { cleared: false, clearedAt: null, clearedByUserId: null },
  });
  const bookkeeperTransactionLinesTable = makeTable({
    name: "bk_transaction_lines",
    pk: ["id"],
    columns: [
      "id",
      "transactionId",
      "accountCode",
      "costCentreCode",
      "memo",
      "taxCode",
      "debit",
      "credit",
      "lineOrder",
    ],
    defaults: { taxCode: null },
  });
  const bookkeeperSubmissionsTable = makeTable({
    name: "bk_submissions",
    pk: ["id"],
    columns: [
      "id",
      "kind",
      "status",
      "costCentreCode",
      "suggestedAccountCode",
      "occurredOn",
      "vendor",
      "amount",
      "description",
      "notes",
      "itemSku",
      "itemName",
      "quantity",
      "unit",
      "rejectedReason",
      "approvedTransactionId",
      "decidedAt",
      "decidedById",
      "decidedByEmail",
      "submittedById",
      "submittedByEmail",
      "submittedByName",
      "createdAt",
    ],
  });
  const bookkeeperReceiptAttachmentsTable = makeTable({
    name: "bk_receipt_attachments",
    pk: ["id"],
    columns: [
      "id",
      "submissionId",
      "originalFilename",
      "contentType",
      "fileSize",
      "storageRef",
      "uploadedAt",
    ],
    defaults: { uploadedAt: new Date() },
  });
  const bookkeeperInventoryReceiptsTable = makeTable({
    name: "bk_inventory_receipts",
    pk: ["id"],
    columns: [
      "id",
      "submissionId",
      "transactionId",
      "costCentreCode",
      "itemSku",
      "itemName",
      "quantity",
      "unit",
      "occurredOn",
      "vendor",
      "notes",
      "createdAt",
    ],
  });
  const bookkeeperAuditLogTable = makeTable({
    name: "bk_audit_log",
    pk: ["id"],
    columns: [
      "id",
      "action",
      "entityType",
      "entityId",
      "actorId",
      "actorEmail",
      "actorRole",
      "details",
      "createdAt",
    ],
  });

  return {
    db: makeFakeDb(),
    bookkeeperUsersTable,
    bookkeeperCostCentresTable,
    bookkeeperAccountsTable,
    bookkeeperTransactionsTable,
    bookkeeperTransactionLinesTable,
    bookkeeperSubmissionsTable,
    bookkeeperReceiptAttachmentsTable,
    bookkeeperInventoryReceiptsTable,
    bookkeeperAuditLogTable,
  };
});

vi.mock("drizzle-orm", async () => {
  const { fakeDrizzle } = await import("../test/fakeDb");
  return fakeDrizzle;
});

vi.mock("@clerk/express", async () => {
  const { state } = await import("../test/state");
  return {
    getAuth: () => ({ userId: state.authUserId }),
    clerkMiddleware: () => (_req: unknown, _res: unknown, next: () => void) =>
      next(),
    clerkClient: {
      users: {
        // Look up the "Clerk identity" the test pre-registered for this
        // user.  If a test forgets to register one, throw — the route's
        // catch-all will turn that into a 401, which would mask the bug.
        getUser: async (id: string) => {
          const ident = state.identities.get(id);
          if (!ident) {
            throw new Error(`No fake Clerk identity registered for ${id}`);
          }
          return {
            primaryEmailAddress: { emailAddress: ident.email },
            emailAddresses: [{ emailAddress: ident.email }],
            firstName: ident.firstName ?? null,
            lastName: ident.lastName ?? null,
          };
        },
      },
    },
  };
});

import express from "express";
import bookkeeperRouter from "./bookkeeper";
import * as dbModule from "@workspace/db";
import type { FakeTable } from "../test/fakeDb";
import { state, setUser, setIdentity, resetState } from "../test/state";

const tables = dbModule as unknown as {
  bookkeeperUsersTable: FakeTable;
  bookkeeperCostCentresTable: FakeTable;
  bookkeeperAccountsTable: FakeTable;
  bookkeeperTransactionsTable: FakeTable;
  bookkeeperTransactionLinesTable: FakeTable;
  bookkeeperSubmissionsTable: FakeTable;
  bookkeeperReceiptAttachmentsTable: FakeTable;
  bookkeeperInventoryReceiptsTable: FakeTable;
  bookkeeperAuditLogTable: FakeTable;
};

// ----------------------- harness -----------------------

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/api/bookkeeper", bookkeeperRouter);
  // Surface internal errors during tests instead of swallowing them with
  // express's default html-only 500 handler.
  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _next: express.NextFunction,
    ) => {
      // eslint-disable-next-line no-console
      console.error("test harness caught:", err);
      res.status(500).json({
        error: err instanceof Error ? err.message : String(err),
      });
    },
  );
  const srv: Server = createServer(app);
  await new Promise<void>((resolve) => srv.listen(0, "127.0.0.1", resolve));
  const addr = srv.address() as AddressInfo;
  return {
    base: `http://127.0.0.1:${addr.port}`,
    close: () =>
      new Promise<void>((resolve, reject) =>
        srv.close((err) => (err ? reject(err) : resolve())),
      ),
  };
}

interface SignInOpts {
  clerkUserId: string;
  email: string;
  // If provided, pre-seed the bk_app_users row with this role rather
  // than letting `loadBookkeeperUser` create the default `food_handler`
  // row (which is what the "first sight" tests want).
  role?: "owner" | "ops_manager" | "bookkeeper" | "food_handler";
  firstName?: string;
  lastName?: string;
}

function signIn(opts: SignInOpts): { id: string; clerkUserId: string } {
  setIdentity(opts.clerkUserId, opts.email, {
    firstName: opts.firstName ?? null,
    lastName: opts.lastName ?? null,
  });
  setUser(opts.clerkUserId);
  if (opts.role) {
    const id = `00000000-0000-0000-0000-${opts.clerkUserId.padEnd(12, "0").slice(0, 12).replace(/[^a-z0-9]/gi, "0")}`;
    tables.bookkeeperUsersTable.__store.push({
      id,
      clerkUserId: opts.clerkUserId,
      email: opts.email,
      firstName: opts.firstName ?? null,
      lastName: opts.lastName ?? null,
      role: opts.role,
      createdAt: new Date(),
      lastSeenAt: null,
      lastNudgedAt: null,
    });
    return { id, clerkUserId: opts.clerkUserId };
  }
  return { id: "", clerkUserId: opts.clerkUserId };
}

function seedCostCentre(code: string, name: string): string {
  const id = `cc000000-0000-0000-0000-${code.padEnd(12, "0").slice(0, 12).replace(/[^a-z0-9]/gi, "0")}`;
  tables.bookkeeperCostCentresTable.__store.push({
    id,
    code,
    name,
    parentEntity: "headwaters",
    owner: null,
    description: null,
    color: null,
    isActive: true,
    createdAt: new Date(),
  });
  return id;
}

beforeEach(() => {
  resetState();
  // Iterate the keys we know are FakeTables — `dbModule` also exposes
  // `db` which has no `__store`, so a blind Object.keys() crashes.
  const tableKeys: (keyof typeof tables)[] = [
    "bookkeeperUsersTable",
    "bookkeeperCostCentresTable",
    "bookkeeperAccountsTable",
    "bookkeeperTransactionsTable",
    "bookkeeperTransactionLinesTable",
    "bookkeeperSubmissionsTable",
    "bookkeeperReceiptAttachmentsTable",
    "bookkeeperInventoryReceiptsTable",
    "bookkeeperAuditLogTable",
  ];
  for (const k of tableKeys) {
    tables[k].__store.length = 0;
  }
});

// ----------------------- tests -----------------------

describe("bookkeeper route — /me and first-sight role assignment", () => {
  it("rejects an unauthenticated GET /me with 401", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/bookkeeper/me`);
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });

  it("creates a food_handler row on first sight for a non-owner email", async () => {
    const h = await startHarness();
    try {
      signIn({ clerkUserId: "user_alice", email: "alice@example.com" });
      const res = await fetch(`${h.base}/api/bookkeeper/me`);
      expect(res.status).toBe(200);
      const body = (await res.json()) as { role?: string; isOwner?: boolean };
      expect(body.role).toBe("food_handler");
      expect(body.isOwner).toBe(false);
      // Mirror row was created in the fake DB.
      expect(tables.bookkeeperUsersTable.__store).toHaveLength(1);
      expect(tables.bookkeeperUsersTable.__store[0]!.role).toBe(
        "food_handler",
      );
    } finally {
      await h.close();
    }
  });

  it("auto-promotes a first-sight user to owner if email matches HEADWATERS_OWNER_EMAIL", async () => {
    const h = await startHarness();
    try {
      signIn({ clerkUserId: "user_owner", email: "owner@example.com" });
      const res = await fetch(`${h.base}/api/bookkeeper/me`);
      expect(res.status).toBe(200);
      const body = (await res.json()) as { role?: string; isOwner?: boolean };
      expect(body.role).toBe("owner");
      expect(body.isOwner).toBe(true);
    } finally {
      await h.close();
    }
  });

  it("auto-promotes an EXISTING food_handler row when the email matches OWNER_EMAIL", async () => {
    const h = await startHarness();
    try {
      // Pre-seed the row as food_handler — simulates a user whose row
      // was created before HEADWATERS_OWNER_EMAIL was configured.
      signIn({
        clerkUserId: "user_owner",
        email: "owner@example.com",
        role: "food_handler",
      });
      const res = await fetch(`${h.base}/api/bookkeeper/me`);
      const body = (await res.json()) as { role?: string };
      expect(body.role).toBe("owner");
      // The mirror row was promoted in-place (still a single row).
      expect(tables.bookkeeperUsersTable.__store).toHaveLength(1);
      expect(tables.bookkeeperUsersTable.__store[0]!.role).toBe("owner");
    } finally {
      await h.close();
    }
  });

  it("does NOT silently promote an existing non-owner row", async () => {
    const h = await startHarness();
    try {
      signIn({
        clerkUserId: "user_bookkeeper",
        email: "bk@example.com",
        role: "bookkeeper",
      });
      const res = await fetch(`${h.base}/api/bookkeeper/me`);
      const body = (await res.json()) as { role?: string };
      expect(body.role).toBe("bookkeeper");
      // The role stays put — this guards against a regression where
      // every sign-in re-derived the role from email.
      expect(tables.bookkeeperUsersTable.__store[0]!.role).toBe("bookkeeper");
    } finally {
      await h.close();
    }
  });
});

describe("bookkeeper route — owner-only endpoints", () => {
  it("food_handler gets 403 from GET /users", async () => {
    const h = await startHarness();
    try {
      signIn({
        clerkUserId: "user_alice",
        email: "alice@example.com",
        role: "food_handler",
      });
      const res = await fetch(`${h.base}/api/bookkeeper/users`);
      expect(res.status).toBe(403);
    } finally {
      await h.close();
    }
  });

  it("owner gets 200 from GET /users with the full list", async () => {
    const h = await startHarness();
    try {
      signIn({
        clerkUserId: "user_owner",
        email: "owner@example.com",
        role: "owner",
      });
      // Add a second user so ordering matters.
      tables.bookkeeperUsersTable.__store.push({
        id: "z-id",
        clerkUserId: "user_z",
        email: "zz@example.com",
        firstName: null,
        lastName: null,
        role: "food_handler",
        createdAt: new Date(),
        lastSeenAt: null,
        lastNudgedAt: null,
      });
      const res = await fetch(`${h.base}/api/bookkeeper/users`);
      expect(res.status).toBe(200);
      const body = (await res.json()) as { email: string }[];
      // Sorted by email asc.
      expect(body.map((u) => u.email)).toEqual([
        "owner@example.com",
        "zz@example.com",
      ]);
    } finally {
      await h.close();
    }
  });

  it("food_handler cannot self-promote via PATCH /users/:id (cross-role isolation)", async () => {
    const h = await startHarness();
    try {
      const me = signIn({
        clerkUserId: "user_alice",
        email: "alice@example.com",
        role: "food_handler",
      });
      const res = await fetch(`${h.base}/api/bookkeeper/users/${me.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role: "owner" }),
      });
      expect(res.status).toBe(403);
      // Role unchanged in the store.
      expect(tables.bookkeeperUsersTable.__store[0]!.role).toBe(
        "food_handler",
      );
      // No audit row was written for the rejected attempt.
      expect(tables.bookkeeperAuditLogTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });

  it("owner can promote another user via PATCH /users/:id (writes audit row)", async () => {
    const h = await startHarness();
    try {
      signIn({
        clerkUserId: "user_owner",
        email: "owner@example.com",
        role: "owner",
      });
      // Seed a food_handler target.
      const targetId = "target-user-id";
      tables.bookkeeperUsersTable.__store.push({
        id: targetId,
        clerkUserId: "user_target",
        email: "target@example.com",
        firstName: null,
        lastName: null,
        role: "food_handler",
        createdAt: new Date(),
        lastSeenAt: null,
        lastNudgedAt: null,
      });
      const res = await fetch(`${h.base}/api/bookkeeper/users/${targetId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role: "bookkeeper" }),
      });
      expect(res.status).toBe(200);
      const target = tables.bookkeeperUsersTable.__store.find(
        (r) => r.id === targetId,
      );
      expect(target?.role).toBe("bookkeeper");
      // Audit row records the change.
      const audit = tables.bookkeeperAuditLogTable.__store.find(
        (r) => r.action === "user.role_change",
      ) as undefined | { details?: { from?: string; to?: string } };
      expect(audit?.details?.from).toBe("food_handler");
      expect(audit?.details?.to).toBe("bookkeeper");
    } finally {
      await h.close();
    }
  });

  it("food_handler gets 403 from POST /cost-centres; owner can create one", async () => {
    const h = await startHarness();
    try {
      signIn({
        clerkUserId: "user_alice",
        email: "alice@example.com",
        role: "food_handler",
      });
      const denied = await fetch(`${h.base}/api/bookkeeper/cost-centres`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          code: "CC-001",
          name: "Test",
          parentEntity: "headwaters",
        }),
      });
      expect(denied.status).toBe(403);
      expect(tables.bookkeeperCostCentresTable.__store).toHaveLength(0);

      signIn({
        clerkUserId: "user_owner",
        email: "owner@example.com",
        role: "owner",
      });
      const ok = await fetch(`${h.base}/api/bookkeeper/cost-centres`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          code: "CC-001",
          name: "Test",
          parentEntity: "headwaters",
        }),
      });
      expect(ok.status).toBe(200);
      expect(tables.bookkeeperCostCentresTable.__store).toHaveLength(1);
    } finally {
      await h.close();
    }
  });

  it("food_handler gets 403 from GET /audit; owner gets 200", async () => {
    const h = await startHarness();
    try {
      signIn({
        clerkUserId: "user_alice",
        email: "alice@example.com",
        role: "food_handler",
      });
      expect((await fetch(`${h.base}/api/bookkeeper/audit`)).status).toBe(403);

      signIn({
        clerkUserId: "user_owner",
        email: "owner@example.com",
        role: "owner",
      });
      const res = await fetch(`${h.base}/api/bookkeeper/audit`);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([]);
    } finally {
      await h.close();
    }
  });
});

describe("bookkeeper route — owner|ops|bookkeeper-only endpoints", () => {
  it("food_handler gets 403 from POST /transactions and POST /submissions/:id/approve", async () => {
    const h = await startHarness();
    try {
      signIn({
        clerkUserId: "user_alice",
        email: "alice@example.com",
        role: "food_handler",
      });
      const txn = await fetch(`${h.base}/api/bookkeeper/transactions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          postedDate: "2026-04-01",
          description: "x",
          lines: [
            { accountCode: "A", debit: 1, credit: 0 },
            { accountCode: "B", debit: 0, credit: 1 },
          ],
        }),
      });
      expect(txn.status).toBe(403);
      const approve = await fetch(
        `${h.base}/api/bookkeeper/submissions/some-id/approve`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ postedDate: "2026-04-01", lines: [] }),
        },
      );
      expect(approve.status).toBe(403);
    } finally {
      await h.close();
    }
  });

  it("food_handler gets 403 from GET /handlers/activity", async () => {
    const h = await startHarness();
    try {
      signIn({
        clerkUserId: "user_alice",
        email: "alice@example.com",
        role: "food_handler",
      });
      expect(
        (await fetch(`${h.base}/api/bookkeeper/handlers/activity`)).status,
      ).toBe(403);
    } finally {
      await h.close();
    }
  });

  it("bookkeeper gets 200 from GET /handlers/activity (empty list when no handlers)", async () => {
    const h = await startHarness();
    try {
      // ONLY a bookkeeper exists — no food_handlers in the store, so the
      // route bails before the stats query (which uses raw SQL the fake
      // can't run).  Lets us assert the role gate without needing
      // groupBy/filter() coverage in the fake.
      signIn({
        clerkUserId: "user_bk",
        email: "bk@example.com",
        role: "bookkeeper",
      });
      const res = await fetch(`${h.base}/api/bookkeeper/handlers/activity`);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([]);
    } finally {
      await h.close();
    }
  });
});

describe("bookkeeper route — submission scoping", () => {
  // POST /submissions is open to any signed-in user.  The cross-account
  // contract is: a food_handler sees ONLY their own submissions; a
  // bookkeeper/ops/owner sees the whole queue unless they pass ?mine=true.

  async function postSubmission(
    base: string,
    overrides: Record<string, unknown> = {},
  ): Promise<{ id: string }> {
    const body = {
      kind: "expense",
      costCentreCode: "CC-001",
      occurredOn: "2026-04-01",
      vendor: "Acme",
      amount: 12.5,
      description: "lunch",
      ...overrides,
    };
    const res = await fetch(`${base}/api/bookkeeper/submissions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status !== 200) {
      throw new Error(
        `postSubmission failed: ${res.status} ${await res.text()}`,
      );
    }
    return (await res.json()) as { id: string };
  }

  it("food_handler can only see their own submissions, never another handler's", async () => {
    const h = await startHarness();
    try {
      seedCostCentre("CC-001", "Operations");

      // Alice posts one submission.
      signIn({
        clerkUserId: "user_alice",
        email: "alice@example.com",
        role: "food_handler",
      });
      const aliceSub = await postSubmission(h.base, { vendor: "Alice's" });

      // Bob posts two.
      signIn({
        clerkUserId: "user_bob",
        email: "bob@example.com",
        role: "food_handler",
      });
      await postSubmission(h.base, { vendor: "Bob's" });
      await postSubmission(h.base, { vendor: "Bob's #2" });

      // Alice lists — she should only see her own row.
      signIn({
        clerkUserId: "user_alice",
        email: "alice@example.com",
        role: "food_handler",
      });
      const res = await fetch(`${h.base}/api/bookkeeper/submissions`);
      expect(res.status).toBe(200);
      const rows = (await res.json()) as { id: string; vendor: string }[];
      expect(rows).toHaveLength(1);
      expect(rows[0]!.id).toBe(aliceSub.id);
      expect(rows[0]!.vendor).toBe("Alice's");
    } finally {
      await h.close();
    }
  });

  it("bookkeeper sees the whole queue by default and only their own with ?mine=true", async () => {
    const h = await startHarness();
    try {
      seedCostCentre("CC-001", "Operations");

      // Alice (food_handler) posts.
      signIn({
        clerkUserId: "user_alice",
        email: "alice@example.com",
        role: "food_handler",
      });
      await postSubmission(h.base, { vendor: "Alice's" });

      // Bookkeeper Bea posts one as well (she can submit too).
      signIn({
        clerkUserId: "user_bea",
        email: "bea@example.com",
        role: "bookkeeper",
      });
      await postSubmission(h.base, { vendor: "Bea's" });

      // Default view: whole queue.
      const all = await fetch(`${h.base}/api/bookkeeper/submissions`);
      const allRows = (await all.json()) as { vendor: string }[];
      expect(allRows.map((r) => r.vendor).sort()).toEqual([
        "Alice's",
        "Bea's",
      ]);

      // ?mine=true scopes to Bea.
      const mine = await fetch(
        `${h.base}/api/bookkeeper/submissions?mine=true`,
      );
      const mineRows = (await mine.json()) as { vendor: string }[];
      expect(mineRows.map((r) => r.vendor)).toEqual(["Bea's"]);
    } finally {
      await h.close();
    }
  });

  it("food_handler ignores ?mine=false — they still only see their own", async () => {
    const h = await startHarness();
    try {
      seedCostCentre("CC-001", "Operations");
      signIn({
        clerkUserId: "user_alice",
        email: "alice@example.com",
        role: "food_handler",
      });
      await postSubmission(h.base, { vendor: "Alice's" });

      signIn({
        clerkUserId: "user_bob",
        email: "bob@example.com",
        role: "food_handler",
      });
      await postSubmission(h.base, { vendor: "Bob's" });

      // Alice tries to widen scope by passing mine=false.  Server
      // ignores it because role===food_handler always forces the filter.
      signIn({
        clerkUserId: "user_alice",
        email: "alice@example.com",
        role: "food_handler",
      });
      const res = await fetch(
        `${h.base}/api/bookkeeper/submissions?mine=false`,
      );
      const rows = (await res.json()) as { vendor: string }[];
      expect(rows).toHaveLength(1);
      expect(rows[0]!.vendor).toBe("Alice's");
    } finally {
      await h.close();
    }
  });

  it("POST /submissions stamps submittedById and submittedByEmail from the signed-in user", async () => {
    const h = await startHarness();
    try {
      seedCostCentre("CC-001", "Operations");
      const me = signIn({
        clerkUserId: "user_alice",
        email: "alice@example.com",
        role: "food_handler",
        firstName: "Alice",
        lastName: "Adams",
      });
      await postSubmission(h.base, {});
      const stored = tables.bookkeeperSubmissionsTable.__store[0]!;
      expect(stored.submittedById).toBe(me.id);
      expect(stored.submittedByEmail).toBe("alice@example.com");
      expect(stored.submittedByName).toBe("Alice Adams");
    } finally {
      await h.close();
    }
  });

  it("POST /submissions rejects an unknown cost-centre with 400", async () => {
    const h = await startHarness();
    try {
      // No seedCostCentre call — so CC-001 is not in the DB.
      signIn({
        clerkUserId: "user_alice",
        email: "alice@example.com",
        role: "food_handler",
      });
      const res = await fetch(`${h.base}/api/bookkeeper/submissions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "expense",
          costCentreCode: "CC-001",
          occurredOn: "2026-04-01",
          vendor: "Acme",
          amount: 1,
          description: "x",
        }),
      });
      expect(res.status).toBe(400);
      expect(tables.bookkeeperSubmissionsTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });

  it("unauthenticated POST /submissions returns 401", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/bookkeeper/submissions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "expense",
          costCentreCode: "CC-001",
          occurredOn: "2026-04-01",
          vendor: "Acme",
          amount: 1,
          description: "x",
        }),
      });
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });
});

// Tests for the most consequential write paths in the bookkeeping ledger:
// posting a balanced double-entry transaction, and approving a pending
// submission (which posts a transaction on the submitter's behalf and
// links the two records together). Bugs in either path can silently
// corrupt the books, so the assertions below check both the happy-path
// state changes (rows inserted, status flipped, audit row written) and
// the rejection paths (unbalanced, missing account, wrong role).

function seedAccount(
  code: string,
  name: string,
  normalSide: "debit" | "credit",
  taxCode?: string,
): void {
  tables.bookkeeperAccountsTable.__store.push({
    id: `acct-${code}`,
    code,
    name,
    type: normalSide === "debit" ? "expense" : "asset",
    normalSide,
    costCentreCode: null,
    mirrorAccountCode: null,
    notes: null,
    taxCode: taxCode ?? "none",
    isActive: true,
    createdAt: new Date(),
  });
}

describe("bookkeeper route — POST /transactions", () => {
  it("balanced POST inserts the parent transaction, its lines, and an audit row", async () => {
    const h = await startHarness();
    try {
      signIn({
        clerkUserId: "user_bk",
        email: "bk@example.com",
        role: "bookkeeper",
      });
      seedAccount("5100", "Office Supplies", "debit");
      seedAccount("1000", "Cash", "credit");

      const res = await fetch(`${h.base}/api/bookkeeper/transactions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          postedDate: "2026-04-15",
          description: "Pens & pencils",
          reference: "RCPT-42",
          lines: [
            { accountCode: "5100", debit: 12.5, credit: 0, memo: "supplies" },
            { accountCode: "1000", debit: 0, credit: 12.5 },
          ],
        }),
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        id: string;
        status: string;
        totalDebit: number;
        totalCredit: number;
        lines: { accountCode: string; debit: number; credit: number }[];
        createdByEmail: string;
      };
      expect(body.status).toBe("posted");
      expect(body.totalDebit).toBe(12.5);
      expect(body.totalCredit).toBe(12.5);
      expect(body.lines).toHaveLength(2);
      expect(body.createdByEmail).toBe("bk@example.com");

      // Parent row persisted with the actor stamped on it.
      expect(tables.bookkeeperTransactionsTable.__store).toHaveLength(1);
      const parent = tables.bookkeeperTransactionsTable.__store[0]!;
      expect(parent.id).toBe(body.id);
      expect(parent.description).toBe("Pens & pencils");
      expect(parent.reference).toBe("RCPT-42");
      expect(parent.status).toBe("posted");
      expect(parent.createdByEmail).toBe("bk@example.com");

      // Both lines persisted, in order, and pointing at the parent.
      const lines = tables.bookkeeperTransactionLinesTable.__store
        .filter((l) => l.transactionId === parent.id)
        .sort((a, b) => Number(a.lineOrder) - Number(b.lineOrder));
      expect(lines).toHaveLength(2);
      expect(lines[0]!.accountCode).toBe("5100");
      expect(lines[1]!.accountCode).toBe("1000");

      // Audit trail records the create event against the new txn id.
      const audit = tables.bookkeeperAuditLogTable.__store.find(
        (r) => r.action === "transaction.create",
      );
      expect(audit).toBeDefined();
      expect(audit!.entityId).toBe(parent.id);
      expect(audit!.actorEmail).toBe("bk@example.com");
    } finally {
      await h.close();
    }
  });

  it("rejects an unbalanced POST with 400 and writes nothing to the ledger", async () => {
    const h = await startHarness();
    try {
      signIn({
        clerkUserId: "user_bk",
        email: "bk@example.com",
        role: "bookkeeper",
      });
      seedAccount("5100", "Office Supplies", "debit");
      seedAccount("1000", "Cash", "credit");

      const res = await fetch(`${h.base}/api/bookkeeper/transactions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          postedDate: "2026-04-15",
          description: "Off-balance",
          lines: [
            { accountCode: "5100", debit: 10, credit: 0 },
            { accountCode: "1000", debit: 0, credit: 5 },
          ],
        }),
      });
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: string };
      expect(body.error).toMatch(/balance/i);

      // Crucially, neither the parent nor any lines were persisted.
      expect(tables.bookkeeperTransactionsTable.__store).toHaveLength(0);
      expect(tables.bookkeeperTransactionLinesTable.__store).toHaveLength(0);
      // And no audit row was written for the rejected attempt.
      expect(
        tables.bookkeeperAuditLogTable.__store.find(
          (r) => r.action === "transaction.create",
        ),
      ).toBeUndefined();
    } finally {
      await h.close();
    }
  });

  it("rejects a POST referencing a non-existent account code with 400", async () => {
    const h = await startHarness();
    try {
      signIn({
        clerkUserId: "user_bk",
        email: "bk@example.com",
        role: "bookkeeper",
      });
      // Only seed one of the two account codes referenced below.
      seedAccount("5100", "Office Supplies", "debit");

      const res = await fetch(`${h.base}/api/bookkeeper/transactions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          postedDate: "2026-04-15",
          description: "Bad account ref",
          lines: [
            { accountCode: "5100", debit: 5, credit: 0 },
            { accountCode: "1000", debit: 0, credit: 5 },
          ],
        }),
      });
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: string };
      // The error names the missing code so the user can fix it.
      expect(body.error).toMatch(/1000/);

      expect(tables.bookkeeperTransactionsTable.__store).toHaveLength(0);
      expect(tables.bookkeeperTransactionLinesTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });
});

describe("bookkeeper route — POST /submissions/:id/approve", () => {
  // Helper: have a food_handler post a pending expense submission and
  // return the new submission id. Caller is expected to re-sign-in as
  // the approver afterwards.
  async function seedPendingSubmission(
    base: string,
    overrides: Record<string, unknown> = {},
  ): Promise<string> {
    signIn({
      clerkUserId: "user_alice",
      email: "alice@example.com",
      role: "food_handler",
    });
    const body = {
      kind: "expense",
      costCentreCode: "CC-001",
      occurredOn: "2026-04-10",
      vendor: "Acme",
      amount: 25,
      description: "lunch meeting",
      ...overrides,
    };
    const res = await fetch(`${base}/api/bookkeeper/submissions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status !== 200) {
      throw new Error(
        `seedPendingSubmission failed: ${res.status} ${await res.text()}`,
      );
    }
    const json = (await res.json()) as { id: string };
    return json.id;
  }

  it("transitions status from pending → approved, posts the linked transaction, and stamps decidedBy", async () => {
    const h = await startHarness();
    try {
      seedCostCentre("CC-001", "Operations");
      seedAccount("5100", "Office Supplies", "debit");
      seedAccount("1000", "Cash", "credit");

      const submissionId = await seedPendingSubmission(h.base);

      // Sanity: the submission starts in pending with no decided-by stamp.
      const before = tables.bookkeeperSubmissionsTable.__store.find(
        (r) => r.id === submissionId,
      );
      expect(before?.status).toBe("pending");
      expect(before?.approvedTransactionId ?? null).toBeNull();
      expect(before?.decidedByEmail ?? null).toBeNull();

      // Now sign in as a bookkeeper and approve.
      signIn({
        clerkUserId: "user_bea",
        email: "bea@example.com",
        role: "bookkeeper",
      });
      const res = await fetch(
        `${h.base}/api/bookkeeper/submissions/${submissionId}/approve`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            postedDate: "2026-04-15",
            reference: "AP-001",
            lines: [
              { accountCode: "5100", debit: 25, credit: 0 },
              { accountCode: "1000", debit: 0, credit: 25 },
            ],
          }),
        },
      );
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        id: string;
        status: string;
        approvedTransactionId: string;
        decidedByEmail: string;
        decidedAt: string | null;
      };
      expect(body.id).toBe(submissionId);
      expect(body.status).toBe("approved");
      expect(body.decidedByEmail).toBe("bea@example.com");
      expect(body.decidedAt).not.toBeNull();
      expect(body.approvedTransactionId).toBeTruthy();

      // The submission row in the DB reflects the same final state.
      const after = tables.bookkeeperSubmissionsTable.__store.find(
        (r) => r.id === submissionId,
      );
      expect(after?.status).toBe("approved");
      expect(after?.decidedByEmail).toBe("bea@example.com");
      expect(after?.decidedById).toBeTruthy();
      expect(after?.decidedAt).toBeInstanceOf(Date);
      expect(after?.approvedTransactionId).toBe(body.approvedTransactionId);

      // Exactly one transaction was posted, linked back to the submission.
      expect(tables.bookkeeperTransactionsTable.__store).toHaveLength(1);
      const txn = tables.bookkeeperTransactionsTable.__store[0]!;
      expect(txn.id).toBe(body.approvedTransactionId);
      expect(txn.sourceSubmissionId).toBe(submissionId);
      expect(txn.status).toBe("posted");
      expect(txn.createdByEmail).toBe("bea@example.com");

      // Both transaction lines were persisted under that txn id.
      const lines = tables.bookkeeperTransactionLinesTable.__store.filter(
        (l) => l.transactionId === txn.id,
      );
      expect(lines).toHaveLength(2);

      // Audit trail records the approve event.
      const audit = tables.bookkeeperAuditLogTable.__store.find(
        (r) =>
          r.action === "submission.approve" && r.entityId === submissionId,
      );
      expect(audit).toBeDefined();
      expect(audit!.actorEmail).toBe("bea@example.com");
    } finally {
      await h.close();
    }
  });

  it("approving an inventory_receipt mirrors a row into bk_inventory_receipts carrying SKU, quantity, unit, vendor, and occurredOn forward", async () => {
    const h = await startHarness();
    try {
      seedCostCentre("CC-001", "Operations");
      // Inventory increases assets (debit), AP increases liabilities (credit).
      seedAccount("1400", "Inventory", "debit");
      seedAccount("2000", "Accounts Payable", "credit");

      // Seed a pending inventory_receipt with all of the SKU/quantity/unit
      // metadata that the approve handler is expected to copy forward.
      const submissionId = await seedPendingSubmission(h.base, {
        kind: "inventory_receipt",
        costCentreCode: "CC-001",
        occurredOn: "2026-04-12",
        vendor: "North Star Foods",
        amount: 144,
        description: "12 cases of flour",
        notes: "for opening week bake",
        itemSku: "FLOUR-50LB",
        itemName: "All-purpose flour, 50lb sack",
        quantity: 12,
        unit: "case",
      });

      // Sanity: nothing in the inventory-receipts mirror yet.
      expect(
        tables.bookkeeperInventoryReceiptsTable.__store,
      ).toHaveLength(0);

      signIn({
        clerkUserId: "user_bea",
        email: "bea@example.com",
        role: "bookkeeper",
      });
      const res = await fetch(
        `${h.base}/api/bookkeeper/submissions/${submissionId}/approve`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            postedDate: "2026-04-15",
            reference: "PO-7788",
            lines: [
              { accountCode: "1400", debit: 144, credit: 0 },
              { accountCode: "2000", debit: 0, credit: 144 },
            ],
          }),
        },
      );
      expect(res.status).toBe(200);
      const body = (await res.json()) as { approvedTransactionId: string };
      expect(body.approvedTransactionId).toBeTruthy();

      // Exactly one mirrored row, linked to BOTH the submission and the
      // newly-posted transaction (this is the link the inventory reports
      // join on — drop it and stock-on-hand silently goes wrong).
      expect(
        tables.bookkeeperInventoryReceiptsTable.__store,
      ).toHaveLength(1);
      const mirror = tables.bookkeeperInventoryReceiptsTable.__store[0]!;
      expect(mirror.submissionId).toBe(submissionId);
      expect(mirror.transactionId).toBe(body.approvedTransactionId);

      // And it carries the full SKU / quantity / unit / vendor / occurredOn
      // payload across from the submission, exactly as stored on the
      // submission row (quantity is persisted as a 4-decimal string).
      const submission = tables.bookkeeperSubmissionsTable.__store.find(
        (r) => r.id === submissionId,
      )!;
      expect(mirror.costCentreCode).toBe("CC-001");
      expect(mirror.itemSku).toBe("FLOUR-50LB");
      expect(mirror.itemName).toBe("All-purpose flour, 50lb sack");
      expect(mirror.quantity).toBe(submission.quantity);
      expect(mirror.quantity).toBe("12.0000");
      expect(mirror.unit).toBe("case");
      expect(mirror.vendor).toBe("North Star Foods");
      expect(mirror.occurredOn).toBe("2026-04-12");
      expect(mirror.notes).toBe("for opening week bake");
    } finally {
      await h.close();
    }
  });

  it("rejects a second approve of an inventory_receipt with 400 and does NOT add a duplicate bk_inventory_receipts row", async () => {
    const h = await startHarness();
    try {
      seedCostCentre("CC-001", "Operations");
      seedAccount("1400", "Inventory", "debit");
      seedAccount("2000", "Accounts Payable", "credit");

      const submissionId = await seedPendingSubmission(h.base, {
        kind: "inventory_receipt",
        costCentreCode: "CC-001",
        occurredOn: "2026-04-12",
        vendor: "North Star Foods",
        amount: 144,
        description: "12 cases of flour",
        itemSku: "FLOUR-50LB",
        itemName: "All-purpose flour, 50lb sack",
        quantity: 12,
        unit: "case",
      });

      signIn({
        clerkUserId: "user_bea",
        email: "bea@example.com",
        role: "bookkeeper",
      });
      const approveBody = {
        postedDate: "2026-04-15",
        reference: "PO-7788",
        lines: [
          { accountCode: "1400", debit: 144, credit: 0 },
          { accountCode: "2000", debit: 0, credit: 144 },
        ],
      };

      // First approval succeeds and writes exactly one mirror row.
      const first = await fetch(
        `${h.base}/api/bookkeeper/submissions/${submissionId}/approve`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(approveBody),
        },
      );
      expect(first.status).toBe(200);
      const firstBody = (await first.json()) as {
        approvedTransactionId: string;
      };
      expect(
        tables.bookkeeperInventoryReceiptsTable.__store.filter(
          (r) => r.submissionId === submissionId,
        ),
      ).toHaveLength(1);

      // Second approval, immediately. Same payload — the only thing
      // protecting stock-on-hand from doubling is the status guard in
      // the approve handler. If a regression ever lets this through,
      // the mirror table grows a second row and stock silently doubles.
      const second = await fetch(
        `${h.base}/api/bookkeeper/submissions/${submissionId}/approve`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(approveBody),
        },
      );
      expect(second.status).toBe(400);
      const secondBody = (await second.json()) as { error: string };
      expect(secondBody.error).toMatch(/already approved/i);

      // The mirror table still has exactly one row for this submission,
      // and it still points at the transaction created by the first
      // (and only) successful approval.
      const mirrorRows =
        tables.bookkeeperInventoryReceiptsTable.__store.filter(
          (r) => r.submissionId === submissionId,
        );
      expect(mirrorRows).toHaveLength(1);
      expect(mirrorRows[0]!.transactionId).toBe(firstBody.approvedTransactionId);

      // And no second transaction was posted as a side-effect either.
      expect(
        tables.bookkeeperTransactionsTable.__store.filter(
          (t) => t.sourceSubmissionId === submissionId,
        ),
      ).toHaveLength(1);
    } finally {
      await h.close();
    }
  });

  it("rejects an inventory_receipt approval with no quantity (400, no transaction posted, no mirror row written)", async () => {
    const h = await startHarness();
    try {
      seedCostCentre("CC-001", "Operations");
      seedAccount("1400", "Inventory", "debit");
      seedAccount("2000", "Accounts Payable", "credit");

      // Inventory receipt drafted with full vendor / SKU / amount metadata
      // but no quantity recorded. Previously the approve handler would
      // silently coerce this to "0" units received and the receipt would
      // disappear from stock-on-hand reports.
      const submissionId = await seedPendingSubmission(h.base, {
        kind: "inventory_receipt",
        costCentreCode: "CC-001",
        occurredOn: "2026-04-12",
        vendor: "North Star Foods",
        amount: 144,
        description: "12 cases of flour",
        itemSku: "FLOUR-50LB",
        itemName: "All-purpose flour, 50lb sack",
        unit: "case",
        // quantity intentionally omitted
      });

      // Sanity: submission was accepted with a null quantity.
      const seeded = tables.bookkeeperSubmissionsTable.__store.find(
        (r) => r.id === submissionId,
      );
      expect(seeded?.quantity ?? null).toBeNull();

      signIn({
        clerkUserId: "user_bea",
        email: "bea@example.com",
        role: "bookkeeper",
      });
      const res = await fetch(
        `${h.base}/api/bookkeeper/submissions/${submissionId}/approve`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            postedDate: "2026-04-15",
            reference: "PO-7788",
            lines: [
              { accountCode: "1400", debit: 144, credit: 0 },
              { accountCode: "2000", debit: 0, credit: 144 },
            ],
          }),
        },
      );
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: string };
      expect(body.error).toMatch(/quantity/i);

      // Submission stays pending — no decided-by stamp, no linked txn.
      const after = tables.bookkeeperSubmissionsTable.__store.find(
        (r) => r.id === submissionId,
      );
      expect(after?.status).toBe("pending");
      expect(after?.approvedTransactionId ?? null).toBeNull();
      expect(after?.decidedByEmail ?? null).toBeNull();

      // No transaction or transaction lines were posted.
      expect(tables.bookkeeperTransactionsTable.__store).toHaveLength(0);
      expect(tables.bookkeeperTransactionLinesTable.__store).toHaveLength(0);

      // And — the whole point of this test — no inventory-receipts mirror
      // row was written. A "0 units received" row here is exactly the bug.
      expect(
        tables.bookkeeperInventoryReceiptsTable.__store,
      ).toHaveLength(0);

      // No approve audit row either.
      expect(
        tables.bookkeeperAuditLogTable.__store.find(
          (r) =>
            r.action === "submission.approve" && r.entityId === submissionId,
        ),
      ).toBeUndefined();
    } finally {
      await h.close();
    }
  });

  it("approving a plain expense submission does NOT touch bk_inventory_receipts", async () => {
    const h = await startHarness();
    try {
      seedCostCentre("CC-001", "Operations");
      seedAccount("5100", "Office Supplies", "debit");
      seedAccount("1000", "Cash", "credit");

      const submissionId = await seedPendingSubmission(h.base);

      signIn({
        clerkUserId: "user_bea",
        email: "bea@example.com",
        role: "bookkeeper",
      });
      const res = await fetch(
        `${h.base}/api/bookkeeper/submissions/${submissionId}/approve`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            postedDate: "2026-04-15",
            lines: [
              { accountCode: "5100", debit: 25, credit: 0 },
              { accountCode: "1000", debit: 0, credit: 25 },
            ],
          }),
        },
      );
      expect(res.status).toBe(200);

      // Expenses must not write to the inventory mirror — that table is
      // strictly for inventory_receipt kind.
      expect(
        tables.bookkeeperInventoryReceiptsTable.__store,
      ).toHaveLength(0);
    } finally {
      await h.close();
    }
  });

  it("rejects approval from a food_handler with 403, leaves the submission pending, and posts no transaction", async () => {
    const h = await startHarness();
    try {
      seedCostCentre("CC-001", "Operations");
      seedAccount("5100", "Office Supplies", "debit");
      seedAccount("1000", "Cash", "credit");

      const submissionId = await seedPendingSubmission(h.base);

      // Alice (the submitter) is still a food_handler — she cannot
      // approve her own (or anyone's) submission, even with a perfectly
      // balanced line set.
      const res = await fetch(
        `${h.base}/api/bookkeeper/submissions/${submissionId}/approve`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            postedDate: "2026-04-15",
            lines: [
              { accountCode: "5100", debit: 25, credit: 0 },
              { accountCode: "1000", debit: 0, credit: 25 },
            ],
          }),
        },
      );
      expect(res.status).toBe(403);

      // Submission unchanged — still pending, no decided-by, no linked txn.
      const after = tables.bookkeeperSubmissionsTable.__store.find(
        (r) => r.id === submissionId,
      );
      expect(after?.status).toBe("pending");
      expect(after?.approvedTransactionId ?? null).toBeNull();
      expect(after?.decidedByEmail ?? null).toBeNull();

      // No transaction was posted as a side-effect of the rejected call.
      expect(tables.bookkeeperTransactionsTable.__store).toHaveLength(0);
      expect(tables.bookkeeperTransactionLinesTable.__store).toHaveLength(0);
      // No approve audit row either.
      expect(
        tables.bookkeeperAuditLogTable.__store.find(
          (r) => r.action === "submission.approve",
        ),
      ).toBeUndefined();
    } finally {
      await h.close();
    }
  });
});


// Tests for POST /submissions/:id/reject. The reject path is the
// approve path's sibling: a bookkeeper turns a pending submission down
// with a written reason, and the row must record WHO did it, WHEN, and
// WHY. If any of that goes missing the food-handler has no recourse and
// no audit trail to point at, so each contract gets its own assertion.
describe("bookkeeper route — POST /submissions/:id/reject", () => {
  // Helper: have a food_handler post a pending expense submission and
  // return the new submission id. Caller is expected to re-sign-in as
  // the rejecter afterwards. Mirrors the approve-suite helper so the
  // two test bodies read the same way.
  async function seedPendingSubmission(
    base: string,
    overrides: Record<string, unknown> = {},
  ): Promise<string> {
    signIn({
      clerkUserId: "user_alice",
      email: "alice@example.com",
      role: "food_handler",
    });
    const body = {
      kind: "expense",
      costCentreCode: "CC-001",
      occurredOn: "2026-04-10",
      vendor: "Acme",
      amount: 25,
      description: "lunch meeting",
      ...overrides,
    };
    const res = await fetch(`${base}/api/bookkeeper/submissions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status !== 200) {
      throw new Error(
        `seedPendingSubmission failed: ${res.status} ${await res.text()}`,
      );
    }
    const json = (await res.json()) as { id: string };
    return json.id;
  }

  it("transitions status from pending → rejected, stamps decidedBy + rejectedReason, and writes a submission.reject audit row", async () => {
    const h = await startHarness();
    try {
      seedCostCentre("CC-001", "Operations");

      const submissionId = await seedPendingSubmission(h.base);

      // Sanity: the submission starts pending with no decision stamped.
      const before = tables.bookkeeperSubmissionsTable.__store.find(
        (r) => r.id === submissionId,
      );
      expect(before?.status).toBe("pending");
      expect(before?.rejectedReason ?? null).toBeNull();
      expect(before?.decidedByEmail ?? null).toBeNull();
      expect(before?.decidedById ?? null).toBeNull();

      // Now sign in as a bookkeeper and reject.
      signIn({
        clerkUserId: "user_bea",
        email: "bea@example.com",
        role: "bookkeeper",
      });
      const res = await fetch(
        `${h.base}/api/bookkeeper/submissions/${submissionId}/reject`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ reason: "missing receipt photo" }),
        },
      );
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        id: string;
        status: string;
        rejectedReason: string | null;
        decidedByEmail: string | null;
        decidedAt: string | null;
      };
      expect(body.id).toBe(submissionId);
      expect(body.status).toBe("rejected");
      expect(body.rejectedReason).toBe("missing receipt photo");
      expect(body.decidedByEmail).toBe("bea@example.com");
      expect(body.decidedAt).not.toBeNull();

      // The submission row in the DB reflects the same final state,
      // including decidedById which is not in the API response shape.
      const after = tables.bookkeeperSubmissionsTable.__store.find(
        (r) => r.id === submissionId,
      );
      expect(after?.status).toBe("rejected");
      expect(after?.rejectedReason).toBe("missing receipt photo");
      expect(after?.decidedByEmail).toBe("bea@example.com");
      expect(after?.decidedById).toBeTruthy();
      expect(after?.decidedAt).toBeInstanceOf(Date);

      // No transaction was posted as a side-effect of a rejection.
      expect(tables.bookkeeperTransactionsTable.__store).toHaveLength(0);
      expect(tables.bookkeeperTransactionLinesTable.__store).toHaveLength(0);

      // Audit trail records the reject event with the actor and reason.
      const audit = tables.bookkeeperAuditLogTable.__store.find(
        (r) =>
          r.action === "submission.reject" && r.entityId === submissionId,
      ) as
        | undefined
        | { actorEmail?: string; details?: { reason?: string } };
      expect(audit).toBeDefined();
      expect(audit!.actorEmail).toBe("bea@example.com");
      expect(audit!.details?.reason).toBe("missing receipt photo");
    } finally {
      await h.close();
    }
  });

  it("rejects a too-short reason (< 3 chars) with 400 and leaves the submission pending", async () => {
    const h = await startHarness();
    try {
      seedCostCentre("CC-001", "Operations");

      const submissionId = await seedPendingSubmission(h.base);

      signIn({
        clerkUserId: "user_bea",
        email: "bea@example.com",
        role: "bookkeeper",
      });
      const res = await fetch(
        `${h.base}/api/bookkeeper/submissions/${submissionId}/reject`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ reason: "no" }),
        },
      );
      expect(res.status).toBe(400);

      // Submission is untouched: still pending, no decision stamped.
      const after = tables.bookkeeperSubmissionsTable.__store.find(
        (r) => r.id === submissionId,
      );
      expect(after?.status).toBe("pending");
      expect(after?.rejectedReason ?? null).toBeNull();
      expect(after?.decidedByEmail ?? null).toBeNull();
      expect(after?.decidedById ?? null).toBeNull();
      expect(after?.decidedAt ?? null).toBeNull();

      // No reject audit row written for the rejected attempt.
      expect(
        tables.bookkeeperAuditLogTable.__store.find(
          (r) => r.action === "submission.reject",
        ),
      ).toBeUndefined();
    } finally {
      await h.close();
    }
  });

  it("rejects a reject from a food_handler with 403 and leaves the submission pending", async () => {
    const h = await startHarness();
    try {
      seedCostCentre("CC-001", "Operations");

      const submissionId = await seedPendingSubmission(h.base);

      // Alice (the submitter) is still a food_handler — she cannot
      // reject her own (or anyone else's) submission, even with a
      // perfectly valid reason.
      const res = await fetch(
        `${h.base}/api/bookkeeper/submissions/${submissionId}/reject`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ reason: "I changed my mind" }),
        },
      );
      expect(res.status).toBe(403);

      // Submission is untouched: still pending, no decision stamped.
      const after = tables.bookkeeperSubmissionsTable.__store.find(
        (r) => r.id === submissionId,
      );
      expect(after?.status).toBe("pending");
      expect(after?.rejectedReason ?? null).toBeNull();
      expect(after?.decidedByEmail ?? null).toBeNull();
      expect(after?.decidedById ?? null).toBeNull();
      expect(after?.decidedAt ?? null).toBeNull();

      // No reject audit row either.
      expect(
        tables.bookkeeperAuditLogTable.__store.find(
          (r) => r.action === "submission.reject",
        ),
      ).toBeUndefined();
    } finally {
      await h.close();
    }
  });
});

// Voiding is the ONLY way to undo a posted transaction once it's hit
// the books — there is no edit and no delete. The handler does three
// things in sequence (post a mirrored reversal, flip the original to
// `voided`, write an audit row) and a regression in any one of them
// can leave the ledger in a half-reversed state where, e.g., the
// reversal exists but the original still shows as `posted`. These
// tests pin down all three steps and the "no double-void" guard.
describe("bookkeeper route — POST /transactions/:id/void", () => {
  // Helper: post a balanced transaction as a bookkeeper and return the
  // raw response body. Caller is expected to re-sign-in afterwards if
  // they want to act as a different user.
  async function postBalancedTransaction(
    base: string,
  ): Promise<{
    id: string;
    postedDate: string;
    description: string;
    reference: string | null;
    lines: { accountCode: string; debit: number; credit: number }[];
  }> {
    signIn({
      clerkUserId: "user_bk",
      email: "bk@example.com",
      role: "bookkeeper",
    });
    const res = await fetch(`${base}/api/bookkeeper/transactions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        postedDate: "2026-04-15",
        description: "Pens & pencils",
        reference: "RCPT-42",
        lines: [
          { accountCode: "5100", debit: 12.5, credit: 0, memo: "supplies" },
          { accountCode: "1000", debit: 0, credit: 12.5 },
        ],
      }),
    });
    if (res.status !== 200) {
      throw new Error(
        `postBalancedTransaction failed: ${res.status} ${await res.text()}`,
      );
    }
    return (await res.json()) as {
      id: string;
      postedDate: string;
      description: string;
      reference: string | null;
      lines: { accountCode: string; debit: number; credit: number }[];
    };
  }

  it("creates a balanced reversal transaction whose lines mirror the original (debits ↔ credits)", async () => {
    const h = await startHarness();
    try {
      seedAccount("5100", "Office Supplies", "debit");
      seedAccount("1000", "Cash", "credit");
      const original = await postBalancedTransaction(h.base);

      const res = await fetch(
        `${h.base}/api/bookkeeper/transactions/${original.id}/void`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ reason: "duplicate entry" }),
        },
      );
      expect(res.status).toBe(200);
      const reversal = (await res.json()) as {
        id: string;
        status: string;
        reversesTransactionId: string | null;
        totalDebit: number;
        totalCredit: number;
        lines: { accountCode: string; debit: number; credit: number }[];
      };

      // The response is the reversing transaction itself — posted,
      // balanced, and pointed back at the original via reversesTxnId.
      expect(reversal.id).not.toBe(original.id);
      expect(reversal.status).toBe("posted");
      expect(reversal.reversesTransactionId).toBe(original.id);
      expect(reversal.totalDebit).toBe(12.5);
      expect(reversal.totalCredit).toBe(12.5);
      expect(reversal.totalDebit).toBe(reversal.totalCredit);

      // Each reversing line mirrors a corresponding original line: same
      // account code, but debit and credit swapped. This is the whole
      // point of voiding — the new entry exactly cancels the old one.
      expect(reversal.lines).toHaveLength(original.lines.length);
      for (const origLine of original.lines) {
        const mirror = reversal.lines.find(
          (l) => l.accountCode === origLine.accountCode,
        );
        expect(mirror).toBeDefined();
        expect(mirror!.debit).toBe(origLine.credit);
        expect(mirror!.credit).toBe(origLine.debit);
      }

      // And the reversing rows actually landed in the DB, not just the
      // response — guards against a regression that returns a serialized
      // txn without persisting it.
      const reversalRow = tables.bookkeeperTransactionsTable.__store.find(
        (r) => r.id === reversal.id,
      );
      expect(reversalRow).toBeDefined();
      expect(reversalRow!.reversesTransactionId).toBe(original.id);
      expect(
        tables.bookkeeperTransactionLinesTable.__store.filter(
          (l) => l.transactionId === reversal.id,
        ),
      ).toHaveLength(2);
    } finally {
      await h.close();
    }
  });

  it("flips the original row's status to `voided` and stamps voidedReason and voidedAt", async () => {
    const h = await startHarness();
    try {
      seedAccount("5100", "Office Supplies", "debit");
      seedAccount("1000", "Cash", "credit");
      const original = await postBalancedTransaction(h.base);

      // Sanity: before the void, the original is plain posted and has
      // no void metadata stamped on it.
      const before = tables.bookkeeperTransactionsTable.__store.find(
        (r) => r.id === original.id,
      );
      expect(before?.status).toBe("posted");
      expect(before?.voidedReason ?? null).toBeNull();
      expect(before?.voidedAt ?? null).toBeNull();

      const res = await fetch(
        `${h.base}/api/bookkeeper/transactions/${original.id}/void`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ reason: "wrong cost centre" }),
        },
      );
      expect(res.status).toBe(200);

      // The original row is now flipped to `voided` with the reason and
      // timestamp the caller supplied / the server stamped.
      const after = tables.bookkeeperTransactionsTable.__store.find(
        (r) => r.id === original.id,
      );
      expect(after?.status).toBe("voided");
      expect(after?.voidedReason).toBe("wrong cost centre");
      expect(after?.voidedAt).toBeInstanceOf(Date);
    } finally {
      await h.close();
    }
  });

  it("writes a `transaction.void` audit row that references the original txn and the new reversing txn id", async () => {
    const h = await startHarness();
    try {
      seedAccount("5100", "Office Supplies", "debit");
      seedAccount("1000", "Cash", "credit");
      const original = await postBalancedTransaction(h.base);

      // Switch actors before voiding so we can prove the audit row
      // captured WHO did it, not just that some row was written.
      signIn({
        clerkUserId: "user_owner",
        email: "owner@example.com",
        role: "owner",
      });
      const res = await fetch(
        `${h.base}/api/bookkeeper/transactions/${original.id}/void`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ reason: "reclassification" }),
        },
      );
      expect(res.status).toBe(200);
      const reversal = (await res.json()) as { id: string };

      const audit = tables.bookkeeperAuditLogTable.__store.find(
        (r) => r.action === "transaction.void",
      ) as
        | undefined
        | {
            entityType: string;
            entityId: string;
            actorEmail: string;
            details?: { reason?: string; reversingTransactionId?: string };
          };
      expect(audit).toBeDefined();
      expect(audit!.entityType).toBe("transaction");
      // The audit row hangs off the ORIGINAL transaction (that's the
      // entity being acted on); the reversing txn id is recorded in
      // details so a reader can jump from the original to its mirror.
      expect(audit!.entityId).toBe(original.id);
      expect(audit!.actorEmail).toBe("owner@example.com");
      expect(audit!.details?.reason).toBe("reclassification");
      expect(audit!.details?.reversingTransactionId).toBe(reversal.id);
    } finally {
      await h.close();
    }
  });

  it("rejects a second void of an already-voided transaction with 400 and writes no second reversal", async () => {
    const h = await startHarness();
    try {
      seedAccount("5100", "Office Supplies", "debit");
      seedAccount("1000", "Cash", "credit");
      const original = await postBalancedTransaction(h.base);

      // First void succeeds and produces exactly two transactions in
      // the ledger: the original (now voided) and its reversal.
      const first = await fetch(
        `${h.base}/api/bookkeeper/transactions/${original.id}/void`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ reason: "first void" }),
        },
      );
      expect(first.status).toBe(200);
      expect(tables.bookkeeperTransactionsTable.__store).toHaveLength(2);

      // Second void on the same id must be rejected — otherwise the
      // ledger would gain a phantom reversal that has nothing to undo.
      const second = await fetch(
        `${h.base}/api/bookkeeper/transactions/${original.id}/void`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ reason: "second void attempt" }),
        },
      );
      expect(second.status).toBe(400);
      const body = (await second.json()) as { error: string };
      expect(body.error).toMatch(/posted/i);

      // Ledger size unchanged — no second reversal txn was posted.
      expect(tables.bookkeeperTransactionsTable.__store).toHaveLength(2);
      // Original still bears the FIRST void reason (was not overwritten).
      const originalRow = tables.bookkeeperTransactionsTable.__store.find(
        (r) => r.id === original.id,
      );
      expect(originalRow?.status).toBe("voided");
      expect(originalRow?.voidedReason).toBe("first void");
      // And only one transaction.void audit row exists, not two.
      expect(
        tables.bookkeeperAuditLogTable.__store.filter(
          (r) => r.action === "transaction.void",
        ),
      ).toHaveLength(1);
    } finally {
      await h.close();
    }
  });
});

// ── T006-A: GST/HST tax codes ─────────────────────────────────────────────────
//
// Tax codes are stored on accounts (a default) and optionally overridden
// on individual transaction lines.  These tests verify both surfaces: that
// POST /accounts persists the taxCode field, GET /accounts returns it,
// and that a per-line override round-trips through POST /transactions.

describe("bookkeeper route — GST/HST tax codes", () => {
  it("POST /accounts persists taxCode and GET /accounts returns it", async () => {
    const h = await startHarness();
    try {
      signIn({ clerkUserId: "user_owner", email: "owner@example.com", role: "owner" });

      const res = await fetch(`${h.base}/api/bookkeeper/accounts`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          code: "4100",
          name: "Sales Revenue",
          type: "revenue",
          normalSide: "credit",
          taxCode: "gst-collected",
        }),
      });
      expect(res.status).toBe(200);
      const created = (await res.json()) as { taxCode: string };
      expect(created.taxCode).toBe("gst-collected");

      // Verify persistence in the fake store
      const stored = tables.bookkeeperAccountsTable.__store.find(
        (r) => r.code === "4100",
      );
      expect(stored?.taxCode).toBe("gst-collected");
    } finally {
      await h.close();
    }
  });

  it("GET /accounts list includes taxCode for every account", async () => {
    const h = await startHarness();
    try {
      signIn({ clerkUserId: "user_bk", email: "bk@example.com", role: "bookkeeper" });
      seedAccount("5200", "Travel", "debit", "gst-paid");

      const res = await fetch(`${h.base}/api/bookkeeper/accounts`);
      expect(res.status).toBe(200);
      const body = (await res.json()) as { taxCode: string }[];
      expect(body).toHaveLength(1);
      expect(body[0]!.taxCode).toBe("gst-paid");
    } finally {
      await h.close();
    }
  });

  it("per-line taxCode override is stored on the transaction line", async () => {
    const h = await startHarness();
    try {
      signIn({ clerkUserId: "user_bk", email: "bk@example.com", role: "bookkeeper" });
      seedAccount("5100", "Office Supplies", "debit");
      seedAccount("1000", "Cash", "credit");

      const res = await fetch(`${h.base}/api/bookkeeper/transactions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          postedDate: "2026-04-15",
          description: "Supplies with GST",
          lines: [
            { accountCode: "5100", debit: 25, credit: 0, taxCode: "gst-paid" },
            { accountCode: "1000", debit: 0, credit: 25, taxCode: "none" },
          ],
        }),
      });
      expect(res.status).toBe(200);
      const txn = (await res.json()) as {
        lines: { accountCode: string; taxCode?: string | null }[];
      };
      const supplyLine = txn.lines.find((l) => l.accountCode === "5100");
      expect(supplyLine?.taxCode).toBe("gst-paid");

      // Verify raw row in fake store
      const rawLine = tables.bookkeeperTransactionLinesTable.__store.find(
        (r) => r.accountCode === "5100",
      );
      expect(rawLine?.taxCode).toBe("gst-paid");
    } finally {
      await h.close();
    }
  });
});

// ── T006-B: Cleared / reconciliation flag ────────────────────────────────────
//
// PATCH /transactions/:id/cleared is a one-click toggle visible to
// owner / ops_manager / bookkeeper.  food_handler must receive a 403.
// After a successful toggle, the raw DB row should reflect the new state
// and a clearedAt timestamp must be set when marking cleared.

describe("bookkeeper route — PATCH /transactions/:id/cleared", () => {
  async function postTxn(base: string): Promise<{ id: string }> {
    signIn({ clerkUserId: "user_bk", email: "bk@example.com", role: "bookkeeper" });
    seedAccount("5100", "Office Supplies", "debit");
    seedAccount("1000", "Cash", "credit");
    const res = await fetch(`${base}/api/bookkeeper/transactions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        postedDate: "2026-04-15",
        description: "Clearing test txn",
        lines: [
          { accountCode: "5100", debit: 50, credit: 0 },
          { accountCode: "1000", debit: 0, credit: 50 },
        ],
      }),
    });
    if (res.status !== 200) throw new Error(`postTxn failed: ${res.status}`);
    return (await res.json()) as { id: string };
  }

  it("bookkeeper can mark a posted transaction as cleared", async () => {
    const h = await startHarness();
    try {
      const txn = await postTxn(h.base);

      const res = await fetch(
        `${h.base}/api/bookkeeper/transactions/${txn.id}/cleared`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ cleared: true }),
        },
      );
      expect(res.status).toBe(200);
      const body = (await res.json()) as { cleared: boolean; clearedAt?: string };
      expect(body.cleared).toBe(true);
      expect(body.clearedAt).toBeTruthy();

      const row = tables.bookkeeperTransactionsTable.__store.find(
        (r) => r.id === txn.id,
      );
      expect(row?.cleared).toBe(true);
      expect(row?.clearedAt).toBeInstanceOf(Date);
    } finally {
      await h.close();
    }
  });

  it("can toggle cleared back to false (uncleared) and clearedAt is nulled", async () => {
    const h = await startHarness();
    try {
      const txn = await postTxn(h.base);

      // Mark cleared first
      await fetch(`${h.base}/api/bookkeeper/transactions/${txn.id}/cleared`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cleared: true }),
      });

      // Now unmark
      const res = await fetch(
        `${h.base}/api/bookkeeper/transactions/${txn.id}/cleared`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ cleared: false }),
        },
      );
      expect(res.status).toBe(200);
      const body = (await res.json()) as { cleared: boolean; clearedAt?: string | null };
      expect(body.cleared).toBe(false);
      expect(body.clearedAt).toBeFalsy();
    } finally {
      await h.close();
    }
  });

  it("food_handler receives 403 when trying to toggle cleared", async () => {
    const h = await startHarness();
    try {
      const txn = await postTxn(h.base);

      // Re-sign-in as food_handler
      signIn({ clerkUserId: "user_fh", email: "fh@example.com", role: "food_handler" });
      const res = await fetch(
        `${h.base}/api/bookkeeper/transactions/${txn.id}/cleared`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ cleared: true }),
        },
      );
      expect(res.status).toBe(403);
    } finally {
      await h.close();
    }
  });

  it("returns 404 for a non-existent transaction id", async () => {
    const h = await startHarness();
    try {
      signIn({ clerkUserId: "user_bk", email: "bk@example.com", role: "bookkeeper" });
      const res = await fetch(
        `${h.base}/api/bookkeeper/transactions/00000000-dead-beef-0000-000000000000/cleared`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ cleared: true }),
        },
      );
      expect(res.status).toBe(404);
    } finally {
      await h.close();
    }
  });
});

// ── T006-C: GET /receipts/uncleared ──────────────────────────────────────────
//
// The receipts queue returns posted transactions that are not yet
// cleared.  Voided and already-cleared transactions must be excluded.

describe("bookkeeper route — GET /receipts/uncleared", () => {
  async function postTxn(base: string, description: string): Promise<{ id: string }> {
    signIn({ clerkUserId: "user_bk", email: "bk@example.com", role: "bookkeeper" });
    const res = await fetch(`${base}/api/bookkeeper/transactions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        postedDate: "2026-04-15",
        description,
        lines: [
          { accountCode: "5100", debit: 10, credit: 0 },
          { accountCode: "1000", debit: 0, credit: 10 },
        ],
      }),
    });
    if (res.status !== 200) throw new Error(`postTxn failed: ${res.status}`);
    return (await res.json()) as { id: string };
  }

  it("returns only uncleared posted transactions", async () => {
    const h = await startHarness();
    try {
      signIn({ clerkUserId: "user_bk", email: "bk@example.com", role: "bookkeeper" });
      seedAccount("5100", "Office Supplies", "debit");
      seedAccount("1000", "Cash", "credit");

      const txn1 = await postTxn(h.base, "Uncleared A");
      const txn2 = await postTxn(h.base, "Uncleared B");
      const txn3 = await postTxn(h.base, "Will be cleared");

      // Clear txn3
      await fetch(`${h.base}/api/bookkeeper/transactions/${txn3.id}/cleared`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cleared: true }),
      });

      const res = await fetch(`${h.base}/api/bookkeeper/receipts/uncleared`);
      expect(res.status).toBe(200);
      const body = (await res.json()) as { items: { id: string }[]; total: number };
      expect(body.total).toBe(2);
      const ids = body.items.map((i) => i.id);
      expect(ids).toContain(txn1.id);
      expect(ids).toContain(txn2.id);
      expect(ids).not.toContain(txn3.id);
    } finally {
      await h.close();
    }
  });

  it("food_handler receives 403", async () => {
    const h = await startHarness();
    try {
      signIn({ clerkUserId: "user_fh", email: "fh@example.com", role: "food_handler" });
      const res = await fetch(`${h.base}/api/bookkeeper/receipts/uncleared`);
      expect(res.status).toBe(403);
    } finally {
      await h.close();
    }
  });
});

// ── T006-D: GET /reports/by-category ─────────────────────────────────────────
//
// The by-category report aggregates transaction lines per account, carrying
// the account's taxCode into the row.

describe("bookkeeper route — GET /reports/by-category", () => {
  it("returns rows grouped by account with correct totals", async () => {
    const h = await startHarness();
    try {
      signIn({ clerkUserId: "user_bk", email: "bk@example.com", role: "bookkeeper" });
      seedAccount("5100", "Office Supplies", "debit", "gst-paid");
      seedAccount("1000", "Cash", "credit", "none");

      // Post two transactions so account 5100 accumulates $50 total
      for (const amount of [20, 30]) {
        const res = await fetch(`${h.base}/api/bookkeeper/transactions`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            postedDate: "2026-04-15",
            description: `Supplies ${amount}`,
            lines: [
              { accountCode: "5100", debit: amount, credit: 0 },
              { accountCode: "1000", debit: 0, credit: amount },
            ],
          }),
        });
        expect(res.status).toBe(200);
      }

      const res = await fetch(`${h.base}/api/bookkeeper/reports/by-category`);
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        rows: { accountCode: string; taxCode: string; total: number; transactionCount: number }[];
      };
      const suppliesRow = body.rows.find((r) => r.accountCode === "5100");
      expect(suppliesRow).toBeDefined();
      expect(suppliesRow?.taxCode).toBe("gst-paid");
      expect(suppliesRow?.total).toBe(50);
      expect(suppliesRow?.transactionCount).toBe(2);
    } finally {
      await h.close();
    }
  });

  it("food_handler receives 403", async () => {
    const h = await startHarness();
    try {
      signIn({ clerkUserId: "user_fh", email: "fh@example.com", role: "food_handler" });
      const res = await fetch(`${h.base}/api/bookkeeper/reports/by-category`);
      expect(res.status).toBe(403);
    } finally {
      await h.close();
    }
  });
});
