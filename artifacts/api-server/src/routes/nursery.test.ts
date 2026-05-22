import { describe, it, expect, beforeEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ──────────────────────────────────────────────────────────────────────────────
// Mocks
//
// The nursery router reaches into:
//   - `@workspace/db`  (real Postgres pool at module load)
//   - `drizzle-orm`    (column comparators)
//
// The shared `test/fakeDb` helper provides the in-memory replacement.
// ──────────────────────────────────────────────────────────────────────────────

vi.mock("@workspace/db", async () => {
  const { makeTable, makeFakeDb } = await import("../test/fakeDb");

  const nurseryProducersTable = makeTable({
    name: "nursery_producers",
    pk: ["id"],
    columns: ["id", "name", "passphraseHash", "isSteward", "createdAt", "updatedAt"],
    defaults: { isSteward: false },
  });

  const nurserySessionsTable = makeTable({
    name: "nursery_sessions",
    pk: ["id"],
    columns: ["id", "producerId", "token", "expiresAt", "createdAt"],
  });

  const nurseryInvitesTable = makeTable({
    name: "nursery_invites",
    pk: ["id"],
    columns: [
      "id",
      "code",
      "note",
      "isStewardInvite",
      "createdByProducerId",
      "usedByProducerId",
      "usedAt",
      "createdAt",
    ],
    defaults: { note: "", isStewardInvite: false, usedByProducerId: null, usedAt: null },
  });

  const nurseryIdeasTable = makeTable({
    name: "nursery_ideas",
    pk: ["id"],
    columns: [
      "id",
      "title",
      "vernacularName",
      "massityName",
      "problemStatement",
      "stage",
      "stageHistory",
      "stewardNotes",
      "isDraft",
      "graduationReason",
      "createdByProducerId",
      "createdAt",
      "updatedAt",
    ],
    defaults: {
      vernacularName: "",
      massityName: "",
      problemStatement: "",
      stage: "nursery",
      stageHistory: "[]",
      stewardNotes: "",
      isDraft: false,
      graduationReason: null,
    },
  });

  const nurseryCommentsTable = makeTable({
    name: "nursery_comments",
    pk: ["id"],
    columns: ["id", "ideaId", "producerId", "body", "createdAt"],
  });

  return {
    db: makeFakeDb(),
    nurseryProducersTable,
    nurserySessionsTable,
    nurseryInvitesTable,
    nurseryIdeasTable,
    nurseryCommentsTable,
  };
});

vi.mock("drizzle-orm", async () => {
  const { fakeDrizzle } = await import("../test/fakeDb");
  return fakeDrizzle;
});

import express from "express";
import cookieParser from "cookie-parser";
import nurseryRouter from "./nursery";
import * as dbModule from "@workspace/db";
import type { FakeTable } from "../test/fakeDb";

const m = dbModule as unknown as {
  nurseryProducersTable: FakeTable;
  nurserySessionsTable: FakeTable;
  nurseryInvitesTable: FakeTable;
  nurseryIdeasTable: FakeTable;
  nurseryCommentsTable: FakeTable;
};

const COOKIE_SECRET = "test-nursery-secret";

// ──────────────────────────────────────────────────────────────────────────────
// Harness
// ──────────────────────────────────────────────────────────────────────────────

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(cookieParser(COOKIE_SECRET));
  app.use(express.json());
  app.use("/api/nursery", nurseryRouter);
  const srv: Server = createServer(app);
  await new Promise<void>((r) => srv.listen(0, "127.0.0.1", r));
  const addr = srv.address() as AddressInfo;
  return {
    base: `http://127.0.0.1:${addr.port}`,
    close: () =>
      new Promise<void>((resolve, reject) =>
        srv.close((err) => (err ? reject(err) : resolve())),
      ),
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Cookie jar — tracks Set-Cookie headers across requests so the tests can
// simulate a real browser session without an actual cookie store.
// ──────────────────────────────────────────────────────────────────────────────

class CookieJar {
  private store: Map<string, string> = new Map();

  absorb(res: Response): void {
    const raw = res.headers.get("set-cookie");
    if (!raw) return;
    // Set-Cookie headers may be comma-concatenated (Node's http module
    // joins multiple Set-Cookie values with ", ").  Split on the pattern
    // that separates cookie entries: comma followed by a name=value token.
    const parts = raw.split(/,(?=[^,]+=)/);
    for (const part of parts) {
      const kv = part.split(";")[0]?.trim();
      if (!kv) continue;
      const idx = kv.indexOf("=");
      if (idx === -1) continue;
      const name = kv.slice(0, idx).trim();
      const value = kv.slice(idx + 1).trim();
      if (value) {
        this.store.set(name, value);
      } else {
        this.store.delete(name);
      }
    }
  }

  header(): string {
    return [...this.store.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// High-level helpers
// ──────────────────────────────────────────────────────────────────────────────

async function join(
  base: string,
  jar: CookieJar,
  body: Record<string, unknown>,
): Promise<Response> {
  const res = await fetch(`${base}/api/nursery/producers`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: jar.header() },
    body: JSON.stringify(body),
  });
  jar.absorb(res);
  return res;
}

async function login(
  base: string,
  jar: CookieJar,
  name: string,
  passphrase: string,
): Promise<Response> {
  const res = await fetch(`${base}/api/nursery/sessions`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: jar.header() },
    body: JSON.stringify({ name, passphrase }),
  });
  jar.absorb(res);
  return res;
}

async function authedFetch(
  base: string,
  jar: CookieJar,
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("cookie", jar.header());
  if (init.body) headers.set("content-type", "application/json");
  const res = await fetch(`${base}/api/nursery${path}`, {
    ...init,
    headers,
  });
  jar.absorb(res);
  return res;
}

// ──────────────────────────────────────────────────────────────────────────────
// Reset stores between tests
// ──────────────────────────────────────────────────────────────────────────────

beforeEach(() => {
  m.nurseryProducersTable.__store.length = 0;
  m.nurserySessionsTable.__store.length = 0;
  m.nurseryInvitesTable.__store.length = 0;
  m.nurseryIdeasTable.__store.length = 0;
  m.nurseryCommentsTable.__store.length = 0;
});

// ──────────────────────────────────────────────────────────────────────────────
// Auth — bootstrap join
// ──────────────────────────────────────────────────────────────────────────────

describe("nursery auth — bootstrap join", () => {
  it("creates the first producer as steward with no invite code", async () => {
    const h = await startHarness();
    try {
      const jar = new CookieJar();
      const res = await join(h.base, jar, { name: "Alice", passphrase: "pass1234" });
      expect(res.status).toBe(201);
      const body = (await res.json()) as { producer?: { name: string; isSteward: boolean } };
      expect(body.producer?.name).toBe("Alice");
      expect(body.producer?.isSteward).toBe(true);
      expect(m.nurseryProducersTable.__store).toHaveLength(1);
      expect(m.nurserySessionsTable.__store).toHaveLength(1);
    } finally {
      await h.close();
    }
  });

  it("sets the session cookie on bootstrap join", async () => {
    const h = await startHarness();
    try {
      const jar = new CookieJar();
      await join(h.base, jar, { name: "Alice", passphrase: "pass1234" });
      const meRes = await authedFetch(h.base, jar, "/me");
      expect(meRes.status).toBe(200);
      const body = (await meRes.json()) as { name?: string };
      expect(body.name).toBe("Alice");
    } finally {
      await h.close();
    }
  });

  it("rejects a second join without an invite code", async () => {
    const h = await startHarness();
    try {
      const jar1 = new CookieJar();
      await join(h.base, jar1, { name: "Alice", passphrase: "pass1234" });

      const jar2 = new CookieJar();
      const res = await join(h.base, jar2, { name: "Bob", passphrase: "pass5678" });
      expect(res.status).toBe(403);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toMatch(/invite/i);
    } finally {
      await h.close();
    }
  });

  it("rejects join with passphrase shorter than 4 characters", async () => {
    const h = await startHarness();
    try {
      const jar = new CookieJar();
      const res = await join(h.base, jar, { name: "Alice", passphrase: "abc" });
      expect(res.status).toBe(400);
    } finally {
      await h.close();
    }
  });

  it("rejects duplicate name on second join (with a valid invite code)", async () => {
    const h = await startHarness();
    try {
      const jar1 = new CookieJar();
      await join(h.base, jar1, { name: "Alice", passphrase: "pass1234" });

      const invite = await createInvite(h.base, jar1);

      const jar2 = new CookieJar();
      const res = await join(h.base, jar2, { name: "Alice", passphrase: "pass5678", inviteCode: invite.code });
      expect(res.status).toBe(409);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toMatch(/taken/i);
    } finally {
      await h.close();
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Auth — login / logout
// ──────────────────────────────────────────────────────────────────────────────

describe("nursery auth — login / logout", () => {
  it("returns the producer on correct login", async () => {
    const h = await startHarness();
    try {
      const jar = new CookieJar();
      await join(h.base, jar, { name: "Alice", passphrase: "pass1234" });

      const jar2 = new CookieJar();
      const res = await login(h.base, jar2, "Alice", "pass1234");
      expect(res.status).toBe(200);
      const body = (await res.json()) as { producer?: { name: string } };
      expect(body.producer?.name).toBe("Alice");
    } finally {
      await h.close();
    }
  });

  it("rejects login with the wrong passphrase", async () => {
    const h = await startHarness();
    try {
      const jar = new CookieJar();
      await join(h.base, jar, { name: "Alice", passphrase: "pass1234" });

      const jar2 = new CookieJar();
      const res = await login(h.base, jar2, "Alice", "wrongpass");
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });

  it("rejects login for an unknown name", async () => {
    const h = await startHarness();
    try {
      const jar = new CookieJar();
      const res = await login(h.base, jar, "nobody", "pass1234");
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });

  it("logout clears session and subsequent /me returns 401", async () => {
    const h = await startHarness();
    try {
      const jar = new CookieJar();
      await join(h.base, jar, { name: "Alice", passphrase: "pass1234" });

      const logoutRes = await authedFetch(h.base, jar, "/sessions", { method: "DELETE" });
      expect(logoutRes.status).toBe(204);
      expect(m.nurserySessionsTable.__store).toHaveLength(0);

      const meRes = await authedFetch(h.base, jar, "/me");
      expect(meRes.status).toBe(401);
    } finally {
      await h.close();
    }
  });

  it("GET /me returns 401 without a session cookie", async () => {
    const h = await startHarness();
    try {
      const jar = new CookieJar();
      await join(h.base, jar, { name: "Alice", passphrase: "pass1234" });

      const res = await fetch(`${h.base}/api/nursery/me`);
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Invite — create / revoke / use
// ──────────────────────────────────────────────────────────────────────────────

describe("nursery invites — steward creates and revokes", () => {
  it("steward can create an invite and receive a code", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });

      const res = await authedFetch(h.base, stewardJar, "/invites", {
        method: "POST",
        body: JSON.stringify({ note: "for Bob" }),
      });
      expect(res.status).toBe(201);
      const body = (await res.json()) as { code?: string; note?: string };
      expect(typeof body.code).toBe("string");
      expect(body.note).toBe("for Bob");
      expect(m.nurseryInvitesTable.__store).toHaveLength(1);
    } finally {
      await h.close();
    }
  });

  it("non-steward cannot create an invite", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });

      const invite = await createInvite(h.base, stewardJar);
      const producerJar = new CookieJar();
      await join(h.base, producerJar, { name: "Bob", passphrase: "pass5678", inviteCode: invite.code });

      const res = await authedFetch(h.base, producerJar, "/invites", {
        method: "POST",
        body: JSON.stringify({ note: "sneaky" }),
      });
      expect(res.status).toBe(403);
    } finally {
      await h.close();
    }
  });

  it("steward can revoke an unused invite", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });

      const invite = await createInvite(h.base, stewardJar);
      const delRes = await authedFetch(h.base, stewardJar, `/invites/${invite.id}`, {
        method: "DELETE",
      });
      expect(delRes.status).toBe(204);
      expect(m.nurseryInvitesTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });

  it("cannot revoke an already-used invite", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });

      const invite = await createInvite(h.base, stewardJar);
      const bobJar = new CookieJar();
      await join(h.base, bobJar, { name: "Bob", passphrase: "pass5678", inviteCode: invite.code });

      const delRes = await authedFetch(h.base, stewardJar, `/invites/${invite.id}`, {
        method: "DELETE",
      });
      expect(delRes.status).toBe(400);
      const body = (await delRes.json()) as { error?: string };
      expect(body.error).toMatch(/used/i);
    } finally {
      await h.close();
    }
  });

  it("invite code is single-use — second join attempt with same code is rejected", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });

      const invite = await createInvite(h.base, stewardJar);

      const bobJar = new CookieJar();
      const r1 = await join(h.base, bobJar, { name: "Bob", passphrase: "pass5678", inviteCode: invite.code });
      expect(r1.status).toBe(201);

      const charlieJar = new CookieJar();
      const r2 = await join(h.base, charlieJar, { name: "Charlie", passphrase: "pass9999", inviteCode: invite.code });
      expect(r2.status).toBe(403);
    } finally {
      await h.close();
    }
  });

  it("steward invite elevates the new producer to steward", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });

      const invite = await createInvite(h.base, stewardJar, { isStewardInvite: true });

      const bobJar = new CookieJar();
      const res = await join(h.base, bobJar, { name: "Bob", passphrase: "pass5678", inviteCode: invite.code });
      expect(res.status).toBe(201);
      const body = (await res.json()) as { producer?: { isSteward: boolean } };
      expect(body.producer?.isSteward).toBe(true);
    } finally {
      await h.close();
    }
  });

  it("regular invite does not elevate to steward", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });

      const invite = await createInvite(h.base, stewardJar, { isStewardInvite: false });
      const bobJar = new CookieJar();
      const res = await join(h.base, bobJar, { name: "Bob", passphrase: "pass5678", inviteCode: invite.code });
      expect(res.status).toBe(201);
      const body = (await res.json()) as { producer?: { isSteward: boolean } };
      expect(body.producer?.isSteward).toBe(false);
    } finally {
      await h.close();
    }
  });

  it("GET /invites is steward-only", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });

      const invite = await createInvite(h.base, stewardJar);
      const bobJar = new CookieJar();
      await join(h.base, bobJar, { name: "Bob", passphrase: "pass5678", inviteCode: invite.code });

      const res = await authedFetch(h.base, bobJar, "/invites");
      expect(res.status).toBe(403);
    } finally {
      await h.close();
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Ideas — CRUD with permission checks
// ──────────────────────────────────────────────────────────────────────────────

describe("nursery ideas — create", () => {
  it("steward creates a published idea (isDraft=false)", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });

      const res = await authedFetch(h.base, stewardJar, "/ideas", {
        method: "POST",
        body: JSON.stringify({ title: "Watercress nursery", isDraft: false }),
      });
      expect(res.status).toBe(201);
      const body = (await res.json()) as { isDraft?: boolean; stage?: string };
      expect(body.isDraft).toBe(false);
      expect(body.stage).toBe("nursery");
    } finally {
      await h.close();
    }
  });

  it("producer always creates a draft regardless of isDraft flag", async () => {
    const h = await startHarness();
    try {
      const { stewardJar, producerJar } = await bootstrapTwoUsers(h.base);
      void stewardJar;

      const res = await authedFetch(h.base, producerJar, "/ideas", {
        method: "POST",
        body: JSON.stringify({ title: "My wild idea", isDraft: false }),
      });
      expect(res.status).toBe(201);
      const body = (await res.json()) as { isDraft?: boolean };
      expect(body.isDraft).toBe(true);
    } finally {
      await h.close();
    }
  });

  it("rejects idea creation without authentication", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/nursery/ideas`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "Ghost idea" }),
      });
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });
});

describe("nursery ideas — visibility", () => {
  it("steward sees all ideas including other producers' drafts", async () => {
    const h = await startHarness();
    try {
      const { stewardJar, producerJar } = await bootstrapTwoUsers(h.base);

      await authedFetch(h.base, producerJar, "/ideas", {
        method: "POST",
        body: JSON.stringify({ title: "Bob draft" }),
      });

      const res = await authedFetch(h.base, stewardJar, "/ideas");
      expect(res.status).toBe(200);
      const ideas = (await res.json()) as { title: string }[];
      expect(ideas.some((i) => i.title === "Bob draft")).toBe(true);
    } finally {
      await h.close();
    }
  });

  it("producer cannot see another producer's draft in the list", async () => {
    const h = await startHarness();
    try {
      const { stewardJar, producerJar } = await bootstrapTwoUsers(h.base);

      const invite2 = await createInvite(h.base, stewardJar);
      const charlieJar = new CookieJar();
      await join(h.base, charlieJar, { name: "Charlie", passphrase: "charliepw", inviteCode: invite2.code });

      await authedFetch(h.base, charlieJar, "/ideas", {
        method: "POST",
        body: JSON.stringify({ title: "Charlie secret draft" }),
      });

      const res = await authedFetch(h.base, producerJar, "/ideas");
      const ideas = (await res.json()) as { title: string }[];
      expect(ideas.some((i) => i.title === "Charlie secret draft")).toBe(false);
    } finally {
      await h.close();
    }
  });

  it("producer can see their own draft", async () => {
    const h = await startHarness();
    try {
      const { producerJar } = await bootstrapTwoUsers(h.base);

      await authedFetch(h.base, producerJar, "/ideas", {
        method: "POST",
        body: JSON.stringify({ title: "My draft" }),
      });

      const res = await authedFetch(h.base, producerJar, "/ideas");
      const ideas = (await res.json()) as { title: string }[];
      expect(ideas.some((i) => i.title === "My draft")).toBe(true);
    } finally {
      await h.close();
    }
  });
});

describe("nursery ideas — steward update", () => {
  it("steward can update title, notes, and isDraft", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });

      const created = await authedFetch(h.base, stewardJar, "/ideas", {
        method: "POST",
        body: JSON.stringify({ title: "Old title", isDraft: true }),
      });
      const idea = (await created.json()) as { id: string };

      const updated = await authedFetch(h.base, stewardJar, `/ideas/${idea.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: "New title", stewardNotes: "Some notes", isDraft: false }),
      });
      expect(updated.status).toBe(200);
      const body = (await updated.json()) as { title: string; stewardNotes: string; isDraft: boolean };
      expect(body.title).toBe("New title");
      expect(body.stewardNotes).toBe("Some notes");
      expect(body.isDraft).toBe(false);
    } finally {
      await h.close();
    }
  });

  it("producer cannot PATCH an idea", async () => {
    const h = await startHarness();
    try {
      const { stewardJar, producerJar } = await bootstrapTwoUsers(h.base);

      const created = await authedFetch(h.base, stewardJar, "/ideas", {
        method: "POST",
        body: JSON.stringify({ title: "Idea" }),
      });
      const idea = (await created.json()) as { id: string };

      const res = await authedFetch(h.base, producerJar, `/ideas/${idea.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: "Hacked" }),
      });
      expect(res.status).toBe(403);
    } finally {
      await h.close();
    }
  });

  it("steward can delete an idea", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });

      const created = await authedFetch(h.base, stewardJar, "/ideas", {
        method: "POST",
        body: JSON.stringify({ title: "To delete" }),
      });
      const idea = (await created.json()) as { id: string };

      const del = await authedFetch(h.base, stewardJar, `/ideas/${idea.id}`, { method: "DELETE" });
      expect(del.status).toBe(204);
      expect(m.nurseryIdeasTable.__store).toHaveLength(0);
    } finally {
      await h.close();
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Stage moves
// ──────────────────────────────────────────────────────────────────────────────

describe("nursery stage moves", () => {
  it("steward can move idea from nursery to fodder", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });

      const idea = await createIdea(h.base, stewardJar, "Green onions");
      const res = await authedFetch(h.base, stewardJar, `/ideas/${idea.id}/stage`, {
        method: "POST",
        body: JSON.stringify({ stage: "fodder", note: "Ready to try" }),
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { stage: string };
      expect(body.stage).toBe("fodder");
      // Verify history in the store (fakeDb now auto-parses JSONB so the
      // value is already an array, mirroring real Postgres).
      const row = m.nurseryIdeasTable.__store.find((r) => r.id === idea.id);
      const rawHistory = row?.stageHistory;
      const history: { stage: string }[] = Array.isArray(rawHistory)
        ? (rawHistory as { stage: string }[])
        : (JSON.parse(String(rawHistory ?? "[]")) as { stage: string }[]);
      expect(history.some((e) => e.stage === "fodder")).toBe(true);
    } finally {
      await h.close();
    }
  });

  it("steward can move idea from fodder to fallow", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });

      const idea = await createIdea(h.base, stewardJar, "Fallow test");
      await moveStage(h.base, stewardJar, idea.id, "fodder");
      const res = await moveStage(h.base, stewardJar, idea.id, "fallow");
      expect(res.status).toBe(200);
      const body = (await res.json()) as { stage: string };
      expect(body.stage).toBe("fallow");
    } finally {
      await h.close();
    }
  });

  it("graduation requires a reason", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });

      const idea = await createIdea(h.base, stewardJar, "Grad idea");
      const res = await authedFetch(h.base, stewardJar, `/ideas/${idea.id}/stage`, {
        method: "POST",
        body: JSON.stringify({ stage: "graduated" }),
      });
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toMatch(/graduation reason/i);
    } finally {
      await h.close();
    }
  });

  it("graduation with a reason succeeds and stores the reason", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });

      const idea = await createIdea(h.base, stewardJar, "Grad idea");
      const res = await authedFetch(h.base, stewardJar, `/ideas/${idea.id}/stage`, {
        method: "POST",
        body: JSON.stringify({ stage: "graduated", graduationReason: "Proved viable in trial" }),
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { stage: string; graduationReason: string };
      expect(body.stage).toBe("graduated");
      expect(body.graduationReason).toBe("Proved viable in trial");
    } finally {
      await h.close();
    }
  });

  it("cannot move a graduated idea to another stage", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });

      const idea = await createIdea(h.base, stewardJar, "Done idea");
      await authedFetch(h.base, stewardJar, `/ideas/${idea.id}/stage`, {
        method: "POST",
        body: JSON.stringify({ stage: "graduated", graduationReason: "Proved it" }),
      });

      const res = await authedFetch(h.base, stewardJar, `/ideas/${idea.id}/stage`, {
        method: "POST",
        body: JSON.stringify({ stage: "nursery" }),
      });
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toMatch(/graduated/i);
    } finally {
      await h.close();
    }
  });

  it("producer cannot move a stage", async () => {
    const h = await startHarness();
    try {
      const { stewardJar, producerJar } = await bootstrapTwoUsers(h.base);

      const idea = await createIdea(h.base, stewardJar, "Locked idea");
      const res = await authedFetch(h.base, producerJar, `/ideas/${idea.id}/stage`, {
        method: "POST",
        body: JSON.stringify({ stage: "fodder" }),
      });
      expect(res.status).toBe(403);
    } finally {
      await h.close();
    }
  });

  it("stage move with an invalid stage value returns 400", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });

      const idea = await createIdea(h.base, stewardJar, "Invalid stage idea");
      const res = await authedFetch(h.base, stewardJar, `/ideas/${idea.id}/stage`, {
        method: "POST",
        body: JSON.stringify({ stage: "limbo" }),
      });
      expect(res.status).toBe(400);
    } finally {
      await h.close();
    }
  });

  it("stageHistory accumulates an entry for each move", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });

      const idea = await createIdea(h.base, stewardJar, "History test");
      await moveStage(h.base, stewardJar, idea.id, "fodder", "Moving to fodder");
      const res = await moveStage(h.base, stewardJar, idea.id, "fallow", "Into fallow");

      expect(res.status).toBe(200);
      // fakeDb now auto-parses JSONB strings, so stageHistory is an array
      // in the store (matching real Postgres behaviour).
      const row = m.nurseryIdeasTable.__store.find((r) => r.id === idea.id);
      const rawHistory = row?.stageHistory;
      const history: { stage: string; note: string }[] = Array.isArray(rawHistory)
        ? (rawHistory as { stage: string; note: string }[])
        : (JSON.parse(String(rawHistory ?? "[]")) as { stage: string; note: string }[]);
      expect(history.length).toBeGreaterThanOrEqual(2);
      const stages = history.map((e) => e.stage);
      expect(stages).toContain("fodder");
      expect(stages).toContain("fallow");
    } finally {
      await h.close();
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Comments
// ──────────────────────────────────────────────────────────────────────────────

describe("nursery comments", () => {
  it("any authenticated producer can comment on a published idea", async () => {
    const h = await startHarness();
    try {
      const { stewardJar, producerJar } = await bootstrapTwoUsers(h.base);
      const idea = await createIdea(h.base, stewardJar, "Open idea");

      const res = await authedFetch(h.base, producerJar, `/ideas/${idea.id}/comments`, {
        method: "POST",
        body: JSON.stringify({ body: "Looks interesting!" }),
      });
      expect(res.status).toBe(201);
      const body = (await res.json()) as { body: string; producerName: string };
      expect(body.body).toBe("Looks interesting!");
      expect(body.producerName).toBe("Bob");
    } finally {
      await h.close();
    }
  });

  it("comments appear in the idea detail response", async () => {
    const h = await startHarness();
    try {
      const { stewardJar, producerJar } = await bootstrapTwoUsers(h.base);
      const idea = await createIdea(h.base, stewardJar, "Commented idea");

      await authedFetch(h.base, producerJar, `/ideas/${idea.id}/comments`, {
        method: "POST",
        body: JSON.stringify({ body: "First comment" }),
      });

      const detailRes = await authedFetch(h.base, stewardJar, `/ideas/${idea.id}`);
      const detail = (await detailRes.json()) as { comments: { body: string }[] };
      expect(detail.comments).toHaveLength(1);
      expect(detail.comments[0]?.body).toBe("First comment");
    } finally {
      await h.close();
    }
  });

  it("producer cannot comment on another producer's draft", async () => {
    const h = await startHarness();
    try {
      const { stewardJar, producerJar } = await bootstrapTwoUsers(h.base);

      const invite2 = await createInvite(h.base, stewardJar);
      const charlieJar = new CookieJar();
      await join(h.base, charlieJar, { name: "Charlie", passphrase: "charliepw", inviteCode: invite2.code });

      const draft = await authedFetch(h.base, charlieJar, "/ideas", {
        method: "POST",
        body: JSON.stringify({ title: "Charlie secret" }),
      });
      const draftIdea = (await draft.json()) as { id: string };

      const res = await authedFetch(h.base, producerJar, `/ideas/${draftIdea.id}/comments`, {
        method: "POST",
        body: JSON.stringify({ body: "Sneaky comment" }),
      });
      expect(res.status).toBe(403);
    } finally {
      await h.close();
    }
  });

  it("empty comment body is rejected", async () => {
    const h = await startHarness();
    try {
      const { stewardJar } = await bootstrapTwoUsers(h.base);
      const idea = await createIdea(h.base, stewardJar, "Idea");

      const res = await authedFetch(h.base, stewardJar, `/ideas/${idea.id}/comments`, {
        method: "POST",
        body: JSON.stringify({ body: "" }),
      });
      expect(res.status).toBe(400);
    } finally {
      await h.close();
    }
  });

  it("unauthenticated comment request returns 401", async () => {
    const h = await startHarness();
    try {
      const stewardJar = new CookieJar();
      await join(h.base, stewardJar, { name: "Alice", passphrase: "pass1234" });
      const idea = await createIdea(h.base, stewardJar, "Idea");

      const res = await fetch(`${h.base}/api/nursery/ideas/${idea.id}/comments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body: "Ghost comment" }),
      });
      expect(res.status).toBe(401);
    } finally {
      await h.close();
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Test helpers
// ──────────────────────────────────────────────────────────────────────────────

async function createInvite(
  base: string,
  stewardJar: CookieJar,
  opts: { isStewardInvite?: boolean } = {},
): Promise<{ id: string; code: string }> {
  const res = await authedFetch(base, stewardJar, "/invites", {
    method: "POST",
    body: JSON.stringify({ isStewardInvite: opts.isStewardInvite ?? false }),
  });
  if (res.status !== 201) {
    throw new Error(`createInvite failed: ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<{ id: string; code: string }>;
}

async function bootstrapTwoUsers(
  base: string,
): Promise<{ stewardJar: CookieJar; producerJar: CookieJar }> {
  const stewardJar = new CookieJar();
  await join(base, stewardJar, { name: "Alice", passphrase: "pass1234" });

  const invite = await createInvite(base, stewardJar);
  const producerJar = new CookieJar();
  await join(base, producerJar, { name: "Bob", passphrase: "pass5678", inviteCode: invite.code });

  return { stewardJar, producerJar };
}

async function createIdea(
  base: string,
  stewardJar: CookieJar,
  title: string,
): Promise<{ id: string }> {
  const res = await authedFetch(base, stewardJar, "/ideas", {
    method: "POST",
    body: JSON.stringify({ title, isDraft: false }),
  });
  if (res.status !== 201) {
    throw new Error(`createIdea failed: ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<{ id: string }>;
}

async function moveStage(
  base: string,
  stewardJar: CookieJar,
  ideaId: string,
  stage: string,
  note = "",
): Promise<Response> {
  return authedFetch(base, stewardJar, `/ideas/${ideaId}/stage`, {
    method: "POST",
    body: JSON.stringify({ stage, note }),
  });
}
