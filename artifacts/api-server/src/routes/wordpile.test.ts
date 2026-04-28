import { describe, it, expect, beforeEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ----------------------- mocks -----------------------
//
// The route under test reaches out to three modules that are awkward to
// touch from a unit test:
//
//   - `@workspace/db`    : opens a real Postgres pool at module load
//   - `drizzle-orm`      : provides the column comparators (eq/and/...)
//   - `@clerk/express`   : reads cookies/headers to resolve the user
//
// We replace all three with hoisted in-memory fakes so the suite runs with
// zero infrastructure. The fakes implement only the surface area the route
// actually uses — anything beyond that throws so a future refactor that
// reaches further into Drizzle fails loudly instead of silently passing.

const {
  state,
  fakeDrizzle,
  fakeDb,
  wordpilePilesTable,
  wordpileWordsTable,
  wordpileDeletionsTable,
  wordpileShortLinksTable,
} = vi.hoisted(() => {
    type Row = Record<string, unknown>;
    type Col = { __c: string };
    type Pred =
      | { kind: "eq"; col: Col; val: unknown }
      | { kind: "and"; args: Pred[] }
      | { kind: "inArray"; col: Col; vals: unknown[] }
      | { kind: "lt"; col: Col; val: unknown };
    type Order = { kind: "asc" | "desc"; col: Col };

    const PILES: Row[] = [];
    const WORDS: Row[] = [];
    const DELETIONS: Row[] = [];
    const SHORT_LINKS: Row[] = [];

    const wordpilePilesTable = {
      __store: PILES,
      __name: "piles" as const,
      // PK columns enforced by the in-memory insert below. Real Postgres
      // would raise a unique-constraint violation; the fake mirrors that
      // so route code can't accidentally rely on a looser invariant than
      // production.
      __pk: ["id"] as readonly string[],
      id: { __c: "id" } as Col,
      clerkUserId: { __c: "clerkUserId" } as Col,
      name: { __c: "name" } as Col,
      createdAt: { __c: "createdAt" } as Col,
      updatedAt: { __c: "updatedAt" } as Col,
    };
    const wordpileWordsTable = {
      __store: WORDS,
      __name: "words" as const,
      __pk: ["id"] as readonly string[],
      id: { __c: "id" } as Col,
      pileId: { __c: "pileId" } as Col,
      word: { __c: "word" } as Col,
      note: { __c: "note" } as Col,
      bucket: { __c: "bucket" } as Col,
      saferAlternative: { __c: "saferAlternative" } as Col,
      createdAt: { __c: "createdAt" } as Col,
      updatedAt: { __c: "updatedAt" } as Col,
    };
    // Tombstones — composite PK (clerkUserId, kind, id). The route's
    // recordDeletion helper deletes-then-inserts so we never actually
    // collide on this PK in practice, but enforcing it keeps the fake
    // honest if someone changes that helper later.
    const wordpileDeletionsTable = {
      __store: DELETIONS,
      __name: "deletions" as const,
      __pk: ["clerkUserId", "kind", "id"] as readonly string[],
      clerkUserId: { __c: "clerkUserId" } as Col,
      kind: { __c: "kind" } as Col,
      id: { __c: "id" } as Col,
      deletedAt: { __c: "deletedAt" } as Col,
    };
    // Server-stored short links. Single-column PK on `slug`. The slug is
    // generated server-side, but we still enforce uniqueness here so a
    // future change that reuses a slug surfaces immediately instead of
    // silently overwriting an existing row.
    const wordpileShortLinksTable = {
      __store: SHORT_LINKS,
      __name: "short_links" as const,
      __pk: ["slug"] as readonly string[],
      slug: { __c: "slug" } as Col,
      clerkUserId: { __c: "clerkUserId" } as Col,
      pileId: { __c: "pileId" } as Col,
      pileName: { __c: "pileName" } as Col,
      payload: { __c: "payload" } as Col,
      createdAt: { __c: "createdAt" } as Col,
    };

    const eq = (col: Col, val: unknown): Pred => ({ kind: "eq", col, val });
    const and = (...args: Pred[]): Pred => ({ kind: "and", args });
    const inArray = (col: Col, vals: unknown[]): Pred => ({
      kind: "inArray",
      col,
      vals,
    });
    const lt = (col: Col, val: unknown): Pred => ({ kind: "lt", col, val });
    const asc = (col: Col): Order => ({ kind: "asc", col });
    const desc = (col: Col): Order => ({ kind: "desc", col });

    function rowMatches(row: Row, pred: Pred | null): boolean {
      if (!pred) return true;
      switch (pred.kind) {
        case "eq":
          return row[pred.col.__c] === pred.val;
        case "and":
          return pred.args.every((p) => rowMatches(row, p));
        case "inArray":
          return pred.vals.includes(row[pred.col.__c]);
        case "lt": {
          // Date-vs-Date is the only comparison the route actually uses
          // (deletedAt < cutoff in the tombstone GC). We special-case
          // it so a millisecond-precise comparison runs even though
          // `<` on Date objects coerces via valueOf.
          const v = row[pred.col.__c];
          if (v instanceof Date && pred.val instanceof Date) {
            return v.getTime() < pred.val.getTime();
          }
          return (v as number) < (pred.val as number);
        }
      }
    }

    type Table =
      | typeof wordpilePilesTable
      | typeof wordpileWordsTable
      | typeof wordpileDeletionsTable
      | typeof wordpileShortLinksTable;

    function makeSelect(table: Table) {
      let where: Pred | null = null;
      let order: Order | null = null;
      let limit: number | null = null;
      const evalRows = (): Row[] => {
        let rows = table.__store.filter((r) => rowMatches(r, where));
        if (order) {
          const c = order.col.__c;
          const dir = order.kind === "desc" ? -1 : 1;
          rows = [...rows].sort((a, b) => {
            const av = a[c];
            const bv = b[c];
            if (av instanceof Date && bv instanceof Date) {
              return dir * (av.getTime() - bv.getTime());
            }
            if ((av as number) < (bv as number)) return -1 * dir;
            if ((av as number) > (bv as number)) return 1 * dir;
            return 0;
          });
        }
        if (limit !== null) rows = rows.slice(0, limit);
        return rows.map((r) => ({ ...r }));
      };
      const builder = {
        where(p: Pred) {
          where = p;
          return builder;
        },
        orderBy(o: Order) {
          order = o;
          return builder;
        },
        limit(n: number) {
          limit = n;
          return builder;
        },
        then<T = Row[]>(
          resolve: (v: Row[]) => T,
          reject?: (e: unknown) => unknown,
        ) {
          try {
            return Promise.resolve(resolve(evalRows()));
          } catch (e) {
            return reject ? Promise.resolve(reject(e)) : Promise.reject(e);
          }
        },
      };
      return builder;
    }

    function coerceDate(v: unknown): Date {
      if (v instanceof Date) return v;
      if (typeof v === "string" || typeof v === "number") return new Date(v);
      return new Date();
    }

    function makeInsert(table: Table) {
      return {
        values(data: Row | Row[]) {
          const arr = Array.isArray(data) ? data : [data];
          const inserter = {
            returning() {
              const out: Row[] = [];
              for (const v of arr) {
                const row: Row = { ...v };
                if (table === wordpileWordsTable) {
                  if (row.note === undefined) row.note = "";
                  if (row.bucket === undefined) row.bucket = "unsorted";
                  if (row.saferAlternative === undefined) {
                    row.saferAlternative = "";
                  }
                }
                row.createdAt = coerceDate(row.createdAt);
                row.updatedAt = coerceDate(row.updatedAt);
                // Enforce the real schema's primary-key uniqueness.
                // Postgres would raise a unique violation here; we raise
                // a synchronous Error with the same shape so the route's
                // error path is exercised correctly and so a future test
                // cannot accidentally rely on the fake being looser than
                // production. `__pk` is a list of column names — single
                // for the row tables, composite for `deletions`.
                const pkCols = table.__pk;
                const pkConflict = table.__store.some((r) =>
                  pkCols.every((col) => r[col] === row[col]),
                );
                if (pkConflict) {
                  const pkVals = pkCols
                    .map((c) => `${c}=${String(row[c])}`)
                    .join(",");
                  throw new Error(
                    `duplicate key value violates unique constraint "${table.__name}_pkey" (${pkVals})`,
                  );
                }
                table.__store.push(row);
                out.push({ ...row });
              }
              return Promise.resolve(out);
            },
            then(
              resolve: (v: undefined) => unknown,
              reject?: (e: unknown) => unknown,
            ) {
              return this.returning()
                .then(() => resolve(undefined))
                .catch((e) =>
                  reject ? reject(e) : Promise.reject(e),
                );
            },
          };
          return inserter;
        },
      };
    }

    function makeUpdate(table: Table) {
      let where: Pred | null = null;
      let updates: Row = {};
      const builder = {
        set(u: Row) {
          updates = u;
          return builder;
        },
        where(p: Pred) {
          where = p;
          return builder;
        },
        returning() {
          const out: Row[] = [];
          for (const r of table.__store) {
            if (rowMatches(r, where)) {
              const u: Row = { ...updates };
              if ("createdAt" in u) u.createdAt = coerceDate(u.createdAt);
              if ("updatedAt" in u) u.updatedAt = coerceDate(u.updatedAt);
              Object.assign(r, u);
              out.push({ ...r });
            }
          }
          return Promise.resolve(out);
        },
        then(
          resolve: (v: undefined) => unknown,
          reject?: (e: unknown) => unknown,
        ) {
          return this.returning()
            .then(() => resolve(undefined))
            .catch((e) =>
              reject ? reject(e) : Promise.reject(e),
            );
        },
      };
      return builder;
    }

    function makeDelete(table: Table) {
      let where: Pred | null = null;
      const builder = {
        where(p: Pred) {
          where = p;
          return builder;
        },
        then(
          resolve: (v: undefined) => unknown,
          reject?: (e: unknown) => unknown,
        ) {
          try {
            const remain: Row[] = [];
            const deleted: Row[] = [];
            for (const r of table.__store) {
              if (rowMatches(r, where)) deleted.push(r);
              else remain.push(r);
            }
            // Mirror the FK cascade: deleting a pile takes its words with it.
            if (table === wordpilePilesTable) {
              const ws = wordpileWordsTable.__store;
              for (const d of deleted) {
                for (let i = ws.length - 1; i >= 0; i--) {
                  if (ws[i]!.pileId === d.id) ws.splice(i, 1);
                }
              }
            }
            table.__store.length = 0;
            table.__store.push(...remain);
            return Promise.resolve(resolve(undefined));
          } catch (e) {
            return reject ? Promise.resolve(reject(e)) : Promise.reject(e);
          }
        },
      };
      return builder;
    }

    type FakeDb = {
      select: () => { from: (t: Table) => ReturnType<typeof makeSelect> };
      insert: (t: Table) => ReturnType<typeof makeInsert>;
      update: (t: Table) => ReturnType<typeof makeUpdate>;
      delete: (t: Table) => ReturnType<typeof makeDelete>;
      transaction: <T>(fn: (tx: FakeDb) => Promise<T>) => Promise<T>;
    };

    const fakeDb: FakeDb = {
      select: () => ({ from: (t: Table) => makeSelect(t) }),
      insert: (t: Table) => makeInsert(t),
      update: (t: Table) => makeUpdate(t),
      delete: (t: Table) => makeDelete(t),
      // Tests don't exercise rollback semantics — the production
      // contract we care about (delete + tombstone are atomic) is
      // enforced by the real Postgres driver. Here we just pass the
      // same db handle through so the route's `tx.delete(...)` calls
      // hit the same in-memory stores. If the callback throws, the
      // error propagates out exactly like the real driver, so any
      // future test that *does* want to assert "no partial writes
      // were observed externally" can do so.
      transaction: async <T,>(fn: (tx: FakeDb) => Promise<T>): Promise<T> =>
        fn(fakeDb),
    };

    return {
      state: { authUserId: null as string | null },
      wordpilePilesTable,
      wordpileWordsTable,
      wordpileDeletionsTable,
      wordpileShortLinksTable,
      fakeDrizzle: { eq, and, asc, desc, inArray, lt },
      fakeDb,
    };
  });

vi.mock("@workspace/db", () => ({
  db: fakeDb,
  wordpilePilesTable,
  wordpileWordsTable,
  wordpileDeletionsTable,
  wordpileShortLinksTable,
}));

vi.mock("drizzle-orm", () => fakeDrizzle);

vi.mock("@clerk/express", () => ({
  getAuth: () => ({ userId: state.authUserId }),
  clerkMiddleware: () => (_req: unknown, _res: unknown, next: () => void) =>
    next(),
  clerkClient: {
    users: {
      getUser: async () => ({
        primaryEmailAddress: { emailAddress: "test@example.com" },
        emailAddresses: [{ emailAddress: "test@example.com" }],
      }),
    },
  },
}));

// ----------------------- test harness -----------------------
//
// Mount the wordpile router on a bare Express app — we deliberately skip
// `app.ts` so we don't drag in unrelated routes (bookkeeper, library, ...)
// whose schema tables we'd otherwise also need to fake.

import express from "express";
import wordpileRouter, {
  __resetShortLinkRateLimitForTesting,
} from "./wordpile";

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/api/wordpile", wordpileRouter);
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

function setUser(userId: string | null) {
  state.authUserId = userId;
}

function uuid(seed: string): string {
  // Pad / truncate the seed so it always lines up with a v4-shaped UUID.
  // The route's regex check rejects malformed ids, so cheap counters like
  // "p1" would otherwise fail validation on POST /piles.
  const hex = seed.replace(/[^0-9a-f]/gi, "0").padEnd(32, "0").slice(0, 32);
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    "4" + hex.slice(13, 16),
    "8" + hex.slice(17, 20),
    hex.slice(20, 32),
  ].join("-");
}

const PILE_A = uuid("aaaaaaaa");
const PILE_B = uuid("bbbbbbbb");
const PILE_C = uuid("cccccccc");
const WORD_A1 = uuid("11111111");
const WORD_A2 = uuid("22222222");
const WORD_B1 = uuid("33333333");

let harness: Harness;

beforeEach(async () => {
  wordpilePilesTable.__store.length = 0;
  wordpileWordsTable.__store.length = 0;
  wordpileDeletionsTable.__store.length = 0;
  wordpileShortLinksTable.__store.length = 0;
  // Vitest reuses the imported route module across tests in this file,
  // so the in-process token bucket would otherwise carry state between
  // them. Reset it so each test starts with a full bucket — exactly
  // the same starting state every fresh user sees in production.
  __resetShortLinkRateLimitForTesting();
  setUser(null);
  if (!harness) harness = await startHarness();
});

async function req(
  method: string,
  path: string,
  body?: unknown,
): Promise<{ status: number; body: unknown }> {
  const res = await fetch(`${harness.base}${path}`, {
    method,
    headers:
      body !== undefined ? { "content-type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let parsed: unknown = text;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    /* leave as text */
  }
  return { status: res.status, body: parsed };
}

// ----------------------- auth gating -----------------------

describe("auth gating", () => {
  it("/me returns isAuthenticated:false when signed out (no 401)", async () => {
    const { status, body } = await req("GET", "/api/wordpile/me");
    expect(status).toBe(200);
    expect(body).toEqual({
      isAuthenticated: false,
      userId: null,
      email: null,
    });
  });

  it("/me returns the resolved user when signed in", async () => {
    setUser("user_alpha");
    const { status, body } = await req("GET", "/api/wordpile/me");
    expect(status).toBe(200);
    expect(body).toMatchObject({
      isAuthenticated: true,
      userId: "user_alpha",
      email: "test@example.com",
    });
  });

  it.each([
    ["GET", "/api/wordpile/piles", undefined],
    ["POST", "/api/wordpile/piles", { id: PILE_A, name: "x" }],
    ["POST", "/api/wordpile/sync", { piles: [] }],
    ["PATCH", `/api/wordpile/piles/${PILE_A}`, { name: "x" }],
    ["DELETE", `/api/wordpile/piles/${PILE_A}`, undefined],
    [
      "POST",
      `/api/wordpile/piles/${PILE_A}/words`,
      { id: WORD_A1, word: "x" },
    ],
    [
      "PATCH",
      `/api/wordpile/piles/${PILE_A}/words/${WORD_A1}`,
      { word: "x" },
    ],
    ["DELETE", `/api/wordpile/piles/${PILE_A}/words/${WORD_A1}`, undefined],
  ])("%s %s returns 401 when signed out", async (method, path, body) => {
    const { status, body: respBody } = await req(method, path, body);
    expect(status).toBe(401);
    expect(respBody).toEqual({ error: "Unauthorized" });
  });
});

// ----------------------- ownership scoping -----------------------

describe("ownership scoping", () => {
  beforeEach(async () => {
    setUser("user_a");
    await req("POST", "/api/wordpile/piles", {
      id: PILE_A,
      name: "A's pile",
    });
    await req("POST", `/api/wordpile/piles/${PILE_A}/words`, {
      id: WORD_A1,
      word: "alpha",
    });
  });

  it("user B cannot see user A's piles", async () => {
    setUser("user_b");
    const { status, body } = await req("GET", "/api/wordpile/piles");
    expect(status).toBe(200);
    expect(body).toEqual({ piles: [] });
  });

  it("user B cannot PATCH user A's pile", async () => {
    setUser("user_b");
    const { status, body } = await req(
      "PATCH",
      `/api/wordpile/piles/${PILE_A}`,
      { name: "hijacked" },
    );
    expect(status).toBe(404);
    expect(body).toEqual({ error: "Pile not found" });

    // And user A's pile name is unchanged.
    setUser("user_a");
    const after = await req("GET", "/api/wordpile/piles");
    const piles = (after.body as { piles: Array<{ name: string }> }).piles;
    expect(piles[0]?.name).toBe("A's pile");
  });

  it("user B cannot DELETE user A's pile", async () => {
    setUser("user_b");
    const { status } = await req(
      "DELETE",
      `/api/wordpile/piles/${PILE_A}`,
    );
    expect(status).toBe(404);

    setUser("user_a");
    const after = await req("GET", "/api/wordpile/piles");
    expect(
      (after.body as { piles: unknown[] }).piles,
    ).toHaveLength(1);
  });

  it("user B cannot add words to user A's pile", async () => {
    setUser("user_b");
    const { status } = await req(
      "POST",
      `/api/wordpile/piles/${PILE_A}/words`,
      { id: WORD_B1, word: "intruder" },
    );
    expect(status).toBe(404);

    setUser("user_a");
    const after = await req("GET", "/api/wordpile/piles");
    const piles = (after.body as { piles: Array<{ words: unknown[] }> }).piles;
    expect(piles[0]?.words).toHaveLength(1);
  });

  it("user B cannot PATCH or DELETE words inside user A's pile", async () => {
    setUser("user_b");
    const patch = await req(
      "PATCH",
      `/api/wordpile/piles/${PILE_A}/words/${WORD_A1}`,
      { word: "hacked" },
    );
    expect(patch.status).toBe(404);

    const del = await req(
      "DELETE",
      `/api/wordpile/piles/${PILE_A}/words/${WORD_A1}`,
    );
    expect(del.status).toBe(404);

    setUser("user_a");
    const after = await req("GET", "/api/wordpile/piles");
    const word = (
      after.body as { piles: Array<{ words: Array<{ word: string }> }> }
    ).piles[0]?.words[0];
    expect(word?.word).toBe("alpha");
  });

  it("user B's own piles do not appear in user A's snapshot", async () => {
    setUser("user_b");
    await req("POST", "/api/wordpile/piles", {
      id: PILE_B,
      name: "B's pile",
    });
    const bSees = await req("GET", "/api/wordpile/piles");
    expect(
      (bSees.body as { piles: Array<{ id: string }> }).piles.map((p) => p.id),
    ).toEqual([PILE_B]);

    setUser("user_a");
    const aSees = await req("GET", "/api/wordpile/piles");
    expect(
      (aSees.body as { piles: Array<{ id: string }> }).piles.map((p) => p.id),
    ).toEqual([PILE_A]);
  });
});

// ----------------------- /sync merge logic -----------------------

describe("POST /sync merge", () => {
  const T_OLD = "2026-01-01T00:00:00.000Z";
  const T_MID = "2026-01-02T00:00:00.000Z";
  const T_NEW = "2026-01-03T00:00:00.000Z";

  beforeEach(async () => {
    setUser("user_a");
    // Seed: one pile (PILE_A) at T_MID with a word (WORD_A1) at T_MID, plus
    // a second pile (PILE_C) that will not appear in the sync payload.
    await req("POST", "/api/wordpile/piles", {
      id: PILE_A,
      name: "server name",
      createdAt: T_MID,
      updatedAt: T_MID,
    });
    await req("POST", `/api/wordpile/piles/${PILE_A}/words`, {
      id: WORD_A1,
      word: "server-word",
      bucket: "load",
      createdAt: T_MID,
      updatedAt: T_MID,
    });
    await req("POST", "/api/wordpile/piles", {
      id: PILE_C,
      name: "untouched",
      createdAt: T_MID,
      updatedAt: T_MID,
    });
    // POST /piles/:id/words touches the pile's updatedAt — reset it so the
    // T_OLD test below doesn't have to fight that side-effect.
    for (const p of wordpilePilesTable.__store) {
      p.updatedAt = new Date(T_MID);
    }
  });

  it("incoming newer updatedAt wins on existing pile and word", async () => {
    const { status, body } = await req("POST", "/api/wordpile/sync", {
      piles: [
        {
          id: PILE_A,
          name: "client name",
          createdAt: T_MID,
          updatedAt: T_NEW,
          words: [
            {
              id: WORD_A1,
              word: "client-word",
              bucket: "avoid",
              createdAt: T_MID,
              updatedAt: T_NEW,
            },
          ],
        },
      ],
    });
    expect(status).toBe(200);
    const piles = (
      body as {
        piles: Array<{
          id: string;
          name: string;
          words: Array<{ id: string; word: string; bucket: string }>;
        }>;
      }
    ).piles;
    const a = piles.find((p) => p.id === PILE_A);
    expect(a?.name).toBe("client name");
    const w = a?.words.find((x) => x.id === WORD_A1);
    expect(w?.word).toBe("client-word");
    expect(w?.bucket).toBe("avoid");
  });

  it("older incoming updatedAt is ignored (server wins)", async () => {
    const { status, body } = await req("POST", "/api/wordpile/sync", {
      piles: [
        {
          id: PILE_A,
          name: "older client name",
          createdAt: T_OLD,
          updatedAt: T_OLD,
          words: [
            {
              id: WORD_A1,
              word: "older-client-word",
              bucket: "avoid",
              createdAt: T_OLD,
              updatedAt: T_OLD,
            },
          ],
        },
      ],
    });
    expect(status).toBe(200);
    const piles = (
      body as {
        piles: Array<{
          id: string;
          name: string;
          words: Array<{ id: string; word: string; bucket: string }>;
        }>;
      }
    ).piles;
    const a = piles.find((p) => p.id === PILE_A);
    expect(a?.name).toBe("server name");
    const w = a?.words.find((x) => x.id === WORD_A1);
    expect(w?.word).toBe("server-word");
    expect(w?.bucket).toBe("load");
  });

  it("server rows missing from the payload are preserved (never delete)", async () => {
    // Payload only mentions PILE_A. PILE_C must still exist after.
    const { status, body } = await req("POST", "/api/wordpile/sync", {
      piles: [
        {
          id: PILE_A,
          name: "client name",
          createdAt: T_MID,
          updatedAt: T_NEW,
          words: [],
        },
      ],
    });
    expect(status).toBe(200);
    const piles = (body as { piles: Array<{ id: string }> }).piles;
    expect(piles.map((p) => p.id).sort()).toEqual([PILE_A, PILE_C].sort());

    // The pre-existing word on PILE_A is also untouched (payload had no
    // words[] entry for it, and "never delete" applies to words too).
    const a = (
      body as {
        piles: Array<{ id: string; words: Array<{ id: string }> }>;
      }
    ).piles.find((p) => p.id === PILE_A);
    expect(a?.words.map((w) => w.id)).toContain(WORD_A1);
  });

  it("inserts brand-new piles and words from the payload", async () => {
    const { status, body } = await req("POST", "/api/wordpile/sync", {
      piles: [
        {
          id: PILE_B,
          name: "fresh local pile",
          createdAt: T_MID,
          updatedAt: T_MID,
          words: [
            {
              id: WORD_A2,
              word: "fresh-local-word",
              bucket: "interior",
              createdAt: T_MID,
              updatedAt: T_MID,
            },
          ],
        },
      ],
    });
    expect(status).toBe(200);
    const piles = (
      body as {
        piles: Array<{
          id: string;
          name: string;
          words: Array<{ id: string; word: string }>;
        }>;
      }
    ).piles;
    const b = piles.find((p) => p.id === PILE_B);
    expect(b?.name).toBe("fresh local pile");
    expect(b?.words[0]?.word).toBe("fresh-local-word");
    // PILE_A and PILE_C still there too.
    expect(piles.map((p) => p.id).sort()).toEqual(
      [PILE_A, PILE_B, PILE_C].sort(),
    );
  });

  it("scopes /sync to the calling user", async () => {
    // user_b syncs their own pile (different id — pile.id is a global PK
    // in the real schema, so two users cannot share an id). user_a's
    // snapshot must still contain only user_a's piles, and user_b's
    // snapshot must contain only user_b's pile. This is what guards
    // against /sync ever leaking another user's data into the response.
    setUser("user_b");
    const { status, body } = await req("POST", "/api/wordpile/sync", {
      piles: [
        {
          id: PILE_B,
          name: "B's local pile",
          createdAt: T_MID,
          updatedAt: T_NEW,
          words: [],
        },
      ],
    });
    expect(status).toBe(200);
    const bPiles = (
      body as { piles: Array<{ id: string; name: string }> }
    ).piles;
    expect(bPiles.map((p) => p.id)).toEqual([PILE_B]);
    expect(bPiles[0]?.name).toBe("B's local pile");

    setUser("user_a");
    const after = await req("GET", "/api/wordpile/piles");
    const aPiles = (
      after.body as { piles: Array<{ id: string; name: string }> }
    ).piles;
    // user_a still sees the original two piles, neither touched by B.
    expect(aPiles.map((p) => p.id).sort()).toEqual([PILE_A, PILE_C].sort());
    expect(aPiles.find((p) => p.id === PILE_A)?.name).toBe("server name");
  });
});

// ----------------------- tombstones (delete-wins on stale /sync) -----------
//
// Regression coverage for the bug where deleting a pile (or a single word)
// on Device A could be undone by Device B uploading its old local snapshot
// through /sync. The fix records a tombstone on every cloud delete and
// /sync refuses to re-insert anything whose id has a tombstone newer than
// (or equal to) the incoming row's updatedAt.

describe("POST /sync tombstones (deletes outlast a stale device)", () => {
  // T_OLD < T_DELETE so the stale upload's updatedAt is older than the
  // deletion that happened after Device B last touched its local copy.
  const T_OLD = "2026-01-01T00:00:00.000Z";
  // Anything newer than T_OLD as long as we use the same value for the
  // "client knows about a change after the delete" test below.
  const T_NEW = "2026-01-03T00:00:00.000Z";

  beforeEach(() => {
    setUser("user_a");
  });

  it("a deleted pile is not resurrected by a stale device's /sync", async () => {
    // Device A creates pile X with one word, then deletes pile X.
    await req("POST", "/api/wordpile/piles", {
      id: PILE_A,
      name: "A's pile",
      createdAt: T_OLD,
      updatedAt: T_OLD,
    });
    await req("POST", `/api/wordpile/piles/${PILE_A}/words`, {
      id: WORD_A1,
      word: "alpha",
      createdAt: T_OLD,
      updatedAt: T_OLD,
    });
    const del = await req("DELETE", `/api/wordpile/piles/${PILE_A}`);
    expect(del.status).toBe(200);

    // Pile is gone from the server.
    const afterDelete = await req("GET", "/api/wordpile/piles");
    expect((afterDelete.body as { piles: unknown[] }).piles).toEqual([]);

    // Device B (still has the old local copy with the old updatedAt)
    // sends its snapshot through /sync.
    const sync = await req("POST", "/api/wordpile/sync", {
      piles: [
        {
          id: PILE_A,
          name: "A's pile",
          createdAt: T_OLD,
          updatedAt: T_OLD,
          words: [
            {
              id: WORD_A1,
              word: "alpha",
              bucket: "unsorted",
              createdAt: T_OLD,
              updatedAt: T_OLD,
            },
          ],
        },
      ],
    });
    expect(sync.status).toBe(200);
    // The merged snapshot returned to B does NOT contain the deleted
    // pile — so when the client replaces its local state with this
    // response, the pile vanishes locally too. That's the user-visible
    // proof that the delete stuck.
    expect((sync.body as { piles: unknown[] }).piles).toEqual([]);

    // And a follow-up GET (e.g. another device or a refresh) confirms
    // the server didn't get a sneaky resurrection.
    const after = await req("GET", "/api/wordpile/piles");
    expect((after.body as { piles: unknown[] }).piles).toEqual([]);
  });

  it("a brand-new device with no local data still receives existing piles", async () => {
    // Regression guard for the obvious overreach: tombstones must not
    // make /sync return less when there's nothing to skip. This is the
    // baseline "Device B signs in for the first time, has nothing
    // locally, and should still see what Device A created" flow.
    await req("POST", "/api/wordpile/piles", {
      id: PILE_A,
      name: "A's pile",
      createdAt: T_OLD,
      updatedAt: T_OLD,
    });
    await req("POST", `/api/wordpile/piles/${PILE_A}/words`, {
      id: WORD_A1,
      word: "alpha",
      createdAt: T_OLD,
      updatedAt: T_OLD,
    });

    // Device B uploads an empty snapshot.
    const sync = await req("POST", "/api/wordpile/sync", { piles: [] });
    expect(sync.status).toBe(200);
    const piles = (
      sync.body as {
        piles: Array<{ id: string; words: Array<{ id: string }> }>;
      }
    ).piles;
    expect(piles.map((p) => p.id)).toEqual([PILE_A]);
    expect(piles[0]?.words.map((w) => w.id)).toEqual([WORD_A1]);
  });

  it("a deleted pile created by a brand-new device is not skipped (different id)", async () => {
    // The tombstone is on PILE_A; the new device sends PILE_B (an id
    // the user has never deleted). PILE_B must come through fine.
    await req("POST", "/api/wordpile/piles", {
      id: PILE_A,
      name: "A's pile",
      createdAt: T_OLD,
      updatedAt: T_OLD,
    });
    await req("DELETE", `/api/wordpile/piles/${PILE_A}`);

    const sync = await req("POST", "/api/wordpile/sync", {
      piles: [
        {
          id: PILE_B,
          name: "B's fresh pile",
          createdAt: T_NEW,
          updatedAt: T_NEW,
          words: [],
        },
      ],
    });
    expect(sync.status).toBe(200);
    const piles = (
      sync.body as { piles: Array<{ id: string; name: string }> }
    ).piles;
    expect(piles.map((p) => p.id)).toEqual([PILE_B]);
    expect(piles[0]?.name).toBe("B's fresh pile");
  });

  it("a deleted single word is not resurrected by a stale device's /sync", async () => {
    // Pile stays alive; only one word inside it gets deleted. The
    // pile-level skip wouldn't catch this — the per-word tombstone is
    // what does.
    await req("POST", "/api/wordpile/piles", {
      id: PILE_A,
      name: "A's pile",
      createdAt: T_OLD,
      updatedAt: T_OLD,
    });
    await req("POST", `/api/wordpile/piles/${PILE_A}/words`, {
      id: WORD_A1,
      word: "deleted-word",
      createdAt: T_OLD,
      updatedAt: T_OLD,
    });
    await req("POST", `/api/wordpile/piles/${PILE_A}/words`, {
      id: WORD_A2,
      word: "kept-word",
      createdAt: T_OLD,
      updatedAt: T_OLD,
    });

    const del = await req(
      "DELETE",
      `/api/wordpile/piles/${PILE_A}/words/${WORD_A1}`,
    );
    expect(del.status).toBe(200);

    // Stale device re-uploads both words.
    const sync = await req("POST", "/api/wordpile/sync", {
      piles: [
        {
          id: PILE_A,
          name: "A's pile",
          createdAt: T_OLD,
          updatedAt: T_OLD,
          words: [
            {
              id: WORD_A1,
              word: "deleted-word",
              bucket: "unsorted",
              createdAt: T_OLD,
              updatedAt: T_OLD,
            },
            {
              id: WORD_A2,
              word: "kept-word",
              bucket: "unsorted",
              createdAt: T_OLD,
              updatedAt: T_OLD,
            },
          ],
        },
      ],
    });
    expect(sync.status).toBe(200);
    const a = (
      sync.body as {
        piles: Array<{ id: string; words: Array<{ id: string }> }>;
      }
    ).piles.find((p) => p.id === PILE_A);
    // Only the kept word survives — the deleted word stays deleted.
    expect(a?.words.map((w) => w.id)).toEqual([WORD_A2]);
  });

  it("an incoming row with updatedAt newer than the tombstone wins", async () => {
    // Genuine concurrent edit: another device modified the pile after
    // the deletion (per the client's clock). The "tombstone newer than
    // updatedAt" rule lets the newer update through. We simulate this
    // by making the incoming updatedAt strictly greater than the
    // tombstone's deletedAt.
    await req("POST", "/api/wordpile/piles", {
      id: PILE_A,
      name: "A's pile",
      createdAt: T_OLD,
      updatedAt: T_OLD,
    });
    await req("DELETE", `/api/wordpile/piles/${PILE_A}`);

    // Force the tombstone to a known older instant so we can compare
    // deterministically. The route stamps deletedAt=Date.now() on the
    // delete, which is "now" in real time — by rewriting the row to
    // T_OLD we make the incoming T_NEW unambiguously newer.
    for (const t of wordpileDeletionsTable.__store) {
      t.deletedAt = new Date(T_OLD);
    }

    const sync = await req("POST", "/api/wordpile/sync", {
      piles: [
        {
          id: PILE_A,
          name: "renamed after delete",
          createdAt: T_OLD,
          updatedAt: T_NEW,
          words: [],
        },
      ],
    });
    expect(sync.status).toBe(200);
    const piles = (
      sync.body as { piles: Array<{ id: string; name: string }> }
    ).piles;
    expect(piles).toHaveLength(1);
    expect(piles[0]?.id).toBe(PILE_A);
    expect(piles[0]?.name).toBe("renamed after delete");
  });

  it("/sync sweeps tombstones older than the 90-day retention window", async () => {
    // Set up two tombstones for user_a: one fresh (within retention,
    // must survive) and one ancient (must be swept). We also park a
    // tombstone on user_b at the same ancient time to verify the
    // sweep is scoped to the calling user — a noisy user_a should
    // never delete tombstones that belong to user_b.
    setUser("user_a");
    await req("POST", "/api/wordpile/piles", {
      id: PILE_A,
      name: "fresh delete",
      createdAt: T_OLD,
      updatedAt: T_OLD,
    });
    await req("DELETE", `/api/wordpile/piles/${PILE_A}`);

    await req("POST", "/api/wordpile/piles", {
      id: PILE_B,
      name: "ancient delete",
      createdAt: T_OLD,
      updatedAt: T_OLD,
    });
    await req("DELETE", `/api/wordpile/piles/${PILE_B}`);

    setUser("user_b");
    await req("POST", "/api/wordpile/piles", {
      id: PILE_C,
      name: "B's ancient delete",
      createdAt: T_OLD,
      updatedAt: T_OLD,
    });
    await req("DELETE", `/api/wordpile/piles/${PILE_C}`);

    // Rewrite the deletedAt timestamps directly: PILE_B and PILE_C are
    // pushed to ~120 days ago (beyond the 90-day window); PILE_A's
    // tombstone stays at "now" (well within the window).
    const ANCIENT = new Date(Date.now() - 120 * 24 * 60 * 60 * 1000);
    for (const t of wordpileDeletionsTable.__store) {
      if (t.id === PILE_B || t.id === PILE_C) t.deletedAt = ANCIENT;
    }
    expect(wordpileDeletionsTable.__store).toHaveLength(3);

    // user_a's /sync triggers the lazy sweep for user_a only.
    setUser("user_a");
    const sync = await req("POST", "/api/wordpile/sync", { piles: [] });
    expect(sync.status).toBe(200);

    // PILE_B's ancient tombstone is gone; PILE_A's fresh one survives;
    // user_b's ancient tombstone is untouched (the sweep is per-user).
    const remaining = wordpileDeletionsTable.__store.map((t) => ({
      user: t.clerkUserId,
      id: t.id,
    }));
    expect(remaining).toEqual(
      expect.arrayContaining([
        { user: "user_a", id: PILE_A },
        { user: "user_b", id: PILE_C },
      ]),
    );
    expect(remaining).toHaveLength(2);
  });

  it("a swept tombstone no longer blocks resurrection (the GC actually frees the id)", async () => {
    // End-to-end proof that the sweep does the thing it promises:
    // once the retention window has elapsed, the next /sync from a
    // device that still remembers the deleted pile *will* resurrect
    // it. This is the documented graceful-failure mode for the
    // "device left in a drawer for months" edge case.
    await req("POST", "/api/wordpile/piles", {
      id: PILE_A,
      name: "A's pile",
      createdAt: T_OLD,
      updatedAt: T_OLD,
    });
    await req("DELETE", `/api/wordpile/piles/${PILE_A}`);

    // Age the tombstone past the retention window.
    const ANCIENT = new Date(Date.now() - 120 * 24 * 60 * 60 * 1000);
    for (const t of wordpileDeletionsTable.__store) {
      t.deletedAt = ANCIENT;
    }

    const sync = await req("POST", "/api/wordpile/sync", {
      piles: [
        {
          id: PILE_A,
          name: "A's pile",
          createdAt: T_OLD,
          updatedAt: T_OLD,
          words: [],
        },
      ],
    });
    expect(sync.status).toBe(200);
    const piles = (
      sync.body as { piles: Array<{ id: string; name: string }> }
    ).piles;
    expect(piles.map((p) => p.id)).toEqual([PILE_A]);
    // And the tombstone itself is gone from the table.
    expect(wordpileDeletionsTable.__store).toHaveLength(0);
  });

  it("a fresh tombstone (within retention) still blocks resurrection after a sync sweep runs", async () => {
    // Companion to the GC test: confirm the sweep doesn't accidentally
    // take out tombstones that are still doing useful work. Even
    // though /sync runs the sweep on every call, a stale device's
    // upload of a pile we deleted yesterday must still be refused.
    await req("POST", "/api/wordpile/piles", {
      id: PILE_A,
      name: "A's pile",
      createdAt: T_OLD,
      updatedAt: T_OLD,
    });
    await req("DELETE", `/api/wordpile/piles/${PILE_A}`);

    // Backdate the tombstone to ~1 day ago — well inside the 90-day
    // window — so the sweep has every chance to misfire if its
    // boundary check is wrong.
    const YESTERDAY = new Date(Date.now() - 24 * 60 * 60 * 1000);
    for (const t of wordpileDeletionsTable.__store) {
      t.deletedAt = YESTERDAY;
    }

    const sync = await req("POST", "/api/wordpile/sync", {
      piles: [
        {
          id: PILE_A,
          name: "A's pile",
          createdAt: T_OLD,
          updatedAt: T_OLD,
          words: [],
        },
      ],
    });
    expect(sync.status).toBe(200);
    expect((sync.body as { piles: unknown[] }).piles).toEqual([]);
    // The tombstone is still present, ready to refuse the next stale
    // upload too.
    expect(wordpileDeletionsTable.__store).toHaveLength(1);
  });

  it("tombstones are scoped per user — A's delete doesn't block B's identical id", async () => {
    // user_a deletes PILE_A and tombstones it. In a parallel universe
    // where two users somehow share an id (the schema PK prevents it
    // for piles, but the tombstone table's PK is per-user, so the
    // contract is still meaningful), user_b should not be affected.
    // We exercise this with PILE_B for clarity.
    await req("POST", "/api/wordpile/piles", {
      id: PILE_A,
      name: "A's pile",
      createdAt: T_OLD,
      updatedAt: T_OLD,
    });
    await req("DELETE", `/api/wordpile/piles/${PILE_A}`);

    setUser("user_b");
    const sync = await req("POST", "/api/wordpile/sync", {
      piles: [
        {
          id: PILE_B,
          name: "B's pile",
          createdAt: T_OLD,
          updatedAt: T_OLD,
          words: [],
        },
      ],
    });
    expect(sync.status).toBe(200);
    const piles = (
      sync.body as { piles: Array<{ id: string; name: string }> }
    ).piles;
    expect(piles.map((p) => p.id)).toEqual([PILE_B]);
  });
});

// ----------------------- short-link routes -----------------------
//
// These cover the four endpoints documented in the route comment:
//   POST   /short-links        (auth)   create
//   GET    /short-links        (auth)   list mine
//   GET    /short-links/:slug  (public) resolve — owner identity hidden
//   DELETE /short-links/:slug  (auth)   revoke (owner-only, 404 otherwise)
// The fixed-size in-memory store is reset in the global beforeEach.

describe("short links", () => {
  // A tiny but base64url-shaped payload — the route doesn't actually
  // decode it (server treats it opaquely), so anything in the alphabet
  // works for these tests. Real payloads are gzip+base64url but we
  // don't need to round-trip them here.
  const PAYLOAD = "H4sIAAAAAAAACvNIzcnJVyjPL8pJUQQApi3CbAwAAAA";
  const BIG_PAYLOAD = "A".repeat(33 * 1024);

  describe("auth gating", () => {
    it("POST /short-links requires auth", async () => {
      const { status, body } = await req("POST", "/api/wordpile/short-links", {
        payload: PAYLOAD,
        pileName: "x",
      });
      expect(status).toBe(401);
      expect(body).toEqual({ error: "Unauthorized" });
    });

    it("GET /short-links requires auth", async () => {
      const { status } = await req("GET", "/api/wordpile/short-links");
      expect(status).toBe(401);
    });

    it("DELETE /short-links/:slug requires auth", async () => {
      const { status } = await req(
        "DELETE",
        "/api/wordpile/short-links/abcdefgh",
      );
      expect(status).toBe(401);
    });

    it("GET /short-links/:slug does NOT require auth (public resolve)", async () => {
      // No setUser(...) — fully signed-out.
      const { status, body } = await req(
        "GET",
        "/api/wordpile/short-links/doesnotexist",
      );
      // Public, but missing slug — so 404 (not 401).
      expect(status).toBe(404);
      expect(body).toEqual({ error: "Short link not found" });
    });
  });

  describe("POST /short-links", () => {
    it("creates a short link and returns a slug + summary fields", async () => {
      setUser("user_a");
      const { status, body } = await req("POST", "/api/wordpile/short-links", {
        payload: PAYLOAD,
        pileId: PILE_A,
        pileName: "A's pile",
      });
      expect(status).toBe(201);
      const summary = body as {
        slug: string;
        pileId: string | null;
        pileName: string;
        payloadLength: number;
        createdAt: string;
      };
      expect(summary.pileId).toBe(PILE_A);
      expect(summary.pileName).toBe("A's pile");
      expect(summary.payloadLength).toBe(PAYLOAD.length);
      // base64url alphabet, 8..32 chars — what the route's regex expects.
      expect(summary.slug).toMatch(/^[A-Za-z0-9_-]{8,32}$/);
      expect(typeof summary.createdAt).toBe("string");
      // The row is actually stored owner-scoped, not silently anonymous.
      const stored = wordpileShortLinksTable.__store.find(
        (r) => r.slug === summary.slug,
      );
      expect(stored?.clerkUserId).toBe("user_a");
      expect(stored?.payload).toBe(PAYLOAD);
    });

    it("rejects empty payload (400)", async () => {
      setUser("user_a");
      const { status } = await req("POST", "/api/wordpile/short-links", {
        payload: "",
        pileName: "x",
      });
      expect(status).toBe(400);
    });

    it("rejects payload over 32KB (413)", async () => {
      setUser("user_a");
      const { status, body } = await req("POST", "/api/wordpile/short-links", {
        payload: BIG_PAYLOAD,
        pileName: "x",
      });
      expect(status).toBe(413);
      expect((body as { error: string }).error).toBe("payload too large");
    });

    it("rejects non-base64url payload (400)", async () => {
      setUser("user_a");
      const { status } = await req("POST", "/api/wordpile/short-links", {
        // `+` and `/` are base64 standard but not base64url. `=` likewise.
        payload: "abc+def/ghi=",
        pileName: "x",
      });
      expect(status).toBe(400);
    });

    it("treats a non-uuid pileId as anonymous (null pileId on row)", async () => {
      // The editor passes this when the pile hasn't been cloud-synced
      // yet. Forcing a 400 in that case would block exactly the kind
      // of user we most want to support (anonymous practitioner with
      // a freshly imported pile).
      setUser("user_a");
      const { status, body } = await req("POST", "/api/wordpile/short-links", {
        payload: PAYLOAD,
        pileId: "not-a-uuid",
        pileName: "x",
      });
      expect(status).toBe(201);
      expect((body as { pileId: string | null }).pileId).toBeNull();
    });
  });

  describe("GET /short-links (list mine)", () => {
    it("returns only the caller's links, newest first", async () => {
      setUser("user_a");
      const a1 = (await req("POST", "/api/wordpile/short-links", {
        payload: PAYLOAD,
        pileId: PILE_A,
        pileName: "A1",
      })).body as { slug: string };
      // Force createdAt ordering deterministically — without this the
      // two rows can share a millisecond on fast machines and the
      // "newest first" assertion becomes a flake.
      const a2 = (await req("POST", "/api/wordpile/short-links", {
        payload: PAYLOAD,
        pileId: PILE_A,
        pileName: "A2",
      })).body as { slug: string };
      const rowsA = wordpileShortLinksTable.__store.filter(
        (r) => r.clerkUserId === "user_a",
      );
      rowsA.find((r) => r.slug === a1.slug)!.createdAt = new Date(
        "2026-01-01T00:00:00Z",
      );
      rowsA.find((r) => r.slug === a2.slug)!.createdAt = new Date(
        "2026-01-02T00:00:00Z",
      );

      setUser("user_b");
      await req("POST", "/api/wordpile/short-links", {
        payload: PAYLOAD,
        pileId: PILE_B,
        pileName: "B1",
      });

      setUser("user_a");
      const { status, body } = await req("GET", "/api/wordpile/short-links");
      expect(status).toBe(200);
      const links = (body as { links: Array<{ slug: string; pileName: string }> })
        .links;
      expect(links.map((l) => l.slug)).toEqual([a2.slug, a1.slug]);
      // Sanity: nothing from user_b leaked in.
      expect(links.every((l) => l.pileName !== "B1")).toBe(true);
    });

    it("returns an empty list when the caller has no short links", async () => {
      setUser("user_b");
      const { status, body } = await req("GET", "/api/wordpile/short-links");
      expect(status).toBe(200);
      expect(body).toEqual({ links: [] });
    });
  });

  describe("GET /short-links/:slug (public resolve)", () => {
    it("returns payload + pileName but NEVER the owner's identity", async () => {
      setUser("user_a");
      const created = (await req("POST", "/api/wordpile/short-links", {
        payload: PAYLOAD,
        pileId: PILE_A,
        pileName: "A's pile",
      })).body as { slug: string };

      // Sign out — the resolve endpoint must work with no session at all.
      setUser(null);
      const { status, body } = await req(
        "GET",
        `/api/wordpile/short-links/${created.slug}`,
      );
      expect(status).toBe(200);
      const resolved = body as Record<string, unknown>;
      expect(resolved.slug).toBe(created.slug);
      expect(resolved.payload).toBe(PAYLOAD);
      expect(resolved.pileName).toBe("A's pile");
      // Privacy contract: don't disclose owner identity to recipients.
      expect(resolved.clerkUserId).toBeUndefined();
      expect(resolved.pileId).toBeUndefined();
    });

    it("404s for a malformed slug", async () => {
      const { status } = await req(
        "GET",
        "/api/wordpile/short-links/not%20a%20slug",
      );
      expect(status).toBe(404);
    });

    it("404s for a well-formed but unknown slug", async () => {
      const { status } = await req(
        "GET",
        "/api/wordpile/short-links/abcdefgh",
      );
      expect(status).toBe(404);
    });
  });

  describe("DELETE /short-links/:slug (revoke)", () => {
    it("owner can revoke; the slug then 404s on resolve", async () => {
      setUser("user_a");
      const created = (await req("POST", "/api/wordpile/short-links", {
        payload: PAYLOAD,
        pileId: PILE_A,
        pileName: "A's pile",
      })).body as { slug: string };

      const del = await req(
        "DELETE",
        `/api/wordpile/short-links/${created.slug}`,
      );
      expect(del.status).toBe(200);
      expect(del.body).toEqual({ ok: true });

      // The row is actually gone, not just hidden.
      expect(
        wordpileShortLinksTable.__store.find((r) => r.slug === created.slug),
      ).toBeUndefined();

      // Public resolve now 404s — recipients of the link see "revoked".
      setUser(null);
      const resolve = await req(
        "GET",
        `/api/wordpile/short-links/${created.slug}`,
      );
      expect(resolve.status).toBe(404);
    });

    it("non-owner gets 404 (not 403) and the row is untouched", async () => {
      setUser("user_a");
      const created = (await req("POST", "/api/wordpile/short-links", {
        payload: PAYLOAD,
        pileId: PILE_A,
        pileName: "A's pile",
      })).body as { slug: string };

      setUser("user_b");
      const { status, body } = await req(
        "DELETE",
        `/api/wordpile/short-links/${created.slug}`,
      );
      // 404 — never disclose "this exists, you just can't touch it".
      expect(status).toBe(404);
      expect(body).toEqual({ error: "Short link not found" });

      // Row is still there.
      expect(
        wordpileShortLinksTable.__store.find((r) => r.slug === created.slug),
      ).toBeDefined();
    });

    it("404s on unknown slug for the owner too", async () => {
      setUser("user_a");
      const { status } = await req(
        "DELETE",
        "/api/wordpile/short-links/abcdefgh",
      );
      expect(status).toBe(404);
    });
  });

  // ---- runaway-script guardrails ----
  //
  // The route ships with a per-user token-bucket rate limit (30 creates
  // /minute) and a per-user active-row cap (200). Both protect the table
  // from a buggy or malicious client that holds a valid session.
  describe("runaway-script guardrails", () => {
    it("returns 429 with a Retry-After header once the per-user rate limit is exhausted", async () => {
      setUser("user_a");
      // Drain the bucket. The capacity is 30, so the first 30 creates
      // succeed (well under the 200-row cap, so neither limit is in
      // play yet). The 31st must hit the rate limit. We use direct
      // fetch on the failing request so we can assert the response
      // header — `req()` swallows headers.
      for (let i = 0; i < 30; i++) {
        const { status } = await req("POST", "/api/wordpile/short-links", {
          payload: PAYLOAD,
          pileName: "x",
        });
        expect(status).toBe(201);
      }
      const limited = await fetch(`${harness.base}/api/wordpile/short-links`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ payload: PAYLOAD, pileName: "x" }),
      });
      expect(limited.status).toBe(429);
      const retryAfter = limited.headers.get("retry-after");
      expect(retryAfter).not.toBeNull();
      // Retry-After is delta-seconds (RFC 7231) — must be a positive
      // whole number, not "0" (which would invite an immediate retry
      // that's still rate-limited).
      const retryNum = Number(retryAfter);
      expect(Number.isFinite(retryNum)).toBe(true);
      expect(retryNum).toBeGreaterThanOrEqual(1);
    });

    it("rate limit is per-user — user_b is unaffected by user_a's burst", async () => {
      setUser("user_a");
      for (let i = 0; i < 30; i++) {
        const { status } = await req("POST", "/api/wordpile/short-links", {
          payload: PAYLOAD,
          pileName: "x",
        });
        expect(status).toBe(201);
      }
      // user_a is now rate-limited.
      const aBlocked = await req("POST", "/api/wordpile/short-links", {
        payload: PAYLOAD,
        pileName: "x",
      });
      expect(aBlocked.status).toBe(429);

      // user_b's bucket is untouched.
      setUser("user_b");
      const bOk = await req("POST", "/api/wordpile/short-links", {
        payload: PAYLOAD,
        pileName: "x",
      });
      expect(bOk.status).toBe(201);
    });

    it("returns 409 once the user has reached the active short-link cap", async () => {
      setUser("user_a");
      // Seed the store directly so we can test the 200-row cap without
      // first having to defeat the 30/min rate limit. The slugs only
      // need to be unique within this test; their shape doesn't matter
      // because we never read them via the resolve endpoint here.
      for (let i = 0; i < 200; i++) {
        wordpileShortLinksTable.__store.push({
          slug: `seed${String(i).padStart(5, "0")}`,
          clerkUserId: "user_a",
          pileId: null,
          pileName: "seed",
          payload: PAYLOAD,
          createdAt: new Date(2026, 0, 1, 0, 0, i),
        });
      }
      const { status, body } = await req("POST", "/api/wordpile/short-links", {
        payload: PAYLOAD,
        pileName: "x",
      });
      expect(status).toBe(409);
      const err = body as { error: string; maxActiveLinks: number };
      // The error message must explain the way out — revoke old ones —
      // so a frustrated user isn't stuck guessing.
      expect(err.error.toLowerCase()).toMatch(/revoke/);
      expect(err.maxActiveLinks).toBe(200);

      // The seeded rows are untouched (the rejected create didn't
      // partially insert).
      expect(
        wordpileShortLinksTable.__store.filter(
          (r) => r.clerkUserId === "user_a",
        ),
      ).toHaveLength(200);
    });

    it("the 409 cap is per-user — user_b can still create when user_a is at the cap", async () => {
      // Seed user_a to the cap; user_b should be unaffected.
      for (let i = 0; i < 200; i++) {
        wordpileShortLinksTable.__store.push({
          slug: `seed${String(i).padStart(5, "0")}`,
          clerkUserId: "user_a",
          pileId: null,
          pileName: "seed",
          payload: PAYLOAD,
          createdAt: new Date(2026, 0, 1, 0, 0, i),
        });
      }
      setUser("user_b");
      const { status } = await req("POST", "/api/wordpile/short-links", {
        payload: PAYLOAD,
        pileName: "x",
      });
      expect(status).toBe(201);
    });

    it("revoking a link frees a slot under the cap", async () => {
      // Seed user_a to exactly the cap minus one, so the next create
      // succeeds, the one after fails, and after a revoke a fresh
      // create succeeds again. This is the "tell the user to revoke
      // old links" workflow end-to-end.
      setUser("user_a");
      for (let i = 0; i < 199; i++) {
        wordpileShortLinksTable.__store.push({
          slug: `seed${String(i).padStart(5, "0")}`,
          clerkUserId: "user_a",
          pileId: null,
          pileName: "seed",
          payload: PAYLOAD,
          createdAt: new Date(2026, 0, 1, 0, 0, i),
        });
      }
      const created = await req("POST", "/api/wordpile/short-links", {
        payload: PAYLOAD,
        pileName: "fresh",
      });
      expect(created.status).toBe(201);
      const slug = (created.body as { slug: string }).slug;

      const blocked = await req("POST", "/api/wordpile/short-links", {
        payload: PAYLOAD,
        pileName: "next",
      });
      expect(blocked.status).toBe(409);

      const revoked = await req(
        "DELETE",
        `/api/wordpile/short-links/${slug}`,
      );
      expect(revoked.status).toBe(200);

      const retry = await req("POST", "/api/wordpile/short-links", {
        payload: PAYLOAD,
        pileName: "after-revoke",
      });
      expect(retry.status).toBe(201);
    });
  });
});
