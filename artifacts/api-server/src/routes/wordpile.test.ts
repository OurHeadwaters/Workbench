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

const { state, fakeDrizzle, fakeDb, wordpilePilesTable, wordpileWordsTable } =
  vi.hoisted(() => {
    type Row = Record<string, unknown>;
    type Col = { __c: string };
    type Pred =
      | { kind: "eq"; col: Col; val: unknown }
      | { kind: "and"; args: Pred[] }
      | { kind: "inArray"; col: Col; vals: unknown[] };
    type Order = { kind: "asc"; col: Col };

    const PILES: Row[] = [];
    const WORDS: Row[] = [];

    const wordpilePilesTable = {
      __store: PILES,
      __name: "piles" as const,
      id: { __c: "id" } as Col,
      clerkUserId: { __c: "clerkUserId" } as Col,
      name: { __c: "name" } as Col,
      createdAt: { __c: "createdAt" } as Col,
      updatedAt: { __c: "updatedAt" } as Col,
    };
    const wordpileWordsTable = {
      __store: WORDS,
      __name: "words" as const,
      id: { __c: "id" } as Col,
      pileId: { __c: "pileId" } as Col,
      word: { __c: "word" } as Col,
      note: { __c: "note" } as Col,
      bucket: { __c: "bucket" } as Col,
      saferAlternative: { __c: "saferAlternative" } as Col,
      createdAt: { __c: "createdAt" } as Col,
      updatedAt: { __c: "updatedAt" } as Col,
    };

    const eq = (col: Col, val: unknown): Pred => ({ kind: "eq", col, val });
    const and = (...args: Pred[]): Pred => ({ kind: "and", args });
    const inArray = (col: Col, vals: unknown[]): Pred => ({
      kind: "inArray",
      col,
      vals,
    });
    const asc = (col: Col): Order => ({ kind: "asc", col });

    function rowMatches(row: Row, pred: Pred | null): boolean {
      if (!pred) return true;
      switch (pred.kind) {
        case "eq":
          return row[pred.col.__c] === pred.val;
        case "and":
          return pred.args.every((p) => rowMatches(row, p));
        case "inArray":
          return pred.vals.includes(row[pred.col.__c]);
      }
    }

    type Table = typeof wordpilePilesTable | typeof wordpileWordsTable;

    function makeSelect(table: Table) {
      let where: Pred | null = null;
      let order: Order | null = null;
      let limit: number | null = null;
      const evalRows = (): Row[] => {
        let rows = table.__store.filter((r) => rowMatches(r, where));
        if (order) {
          const c = order.col.__c;
          rows = [...rows].sort((a, b) => {
            const av = a[c];
            const bv = b[c];
            if (av instanceof Date && bv instanceof Date) {
              return av.getTime() - bv.getTime();
            }
            if ((av as number) < (bv as number)) return -1;
            if ((av as number) > (bv as number)) return 1;
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
                // Enforce the real schema's primary-key uniqueness on
                // `id`. Postgres would raise a unique violation here; we
                // raise a synchronous Error with the same shape so the
                // route's error path is exercised correctly and so a
                // future test cannot accidentally rely on the fake being
                // looser than production.
                if (
                  typeof row.id === "string" &&
                  table.__store.some((r) => r.id === row.id)
                ) {
                  throw new Error(
                    `duplicate key value violates unique constraint "${table.__name}_pkey" (id=${row.id})`,
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

    const fakeDb = {
      select: () => ({ from: (t: Table) => makeSelect(t) }),
      insert: (t: Table) => makeInsert(t),
      update: (t: Table) => makeUpdate(t),
      delete: (t: Table) => makeDelete(t),
    };

    return {
      state: { authUserId: null as string | null },
      wordpilePilesTable,
      wordpileWordsTable,
      fakeDrizzle: { eq, and, asc, inArray },
      fakeDb,
    };
  });

vi.mock("@workspace/db", () => ({
  db: fakeDb,
  wordpilePilesTable,
  wordpileWordsTable,
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
import wordpileRouter from "./wordpile";

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
