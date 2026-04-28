# `src/test/` — in-memory drizzle fake & shared identity stub

This folder is a small toolkit for writing route-level tests that exercise
the real Express handler against an in-memory replacement for `@workspace/db`
and `@clerk/express`. It is the pattern four route suites already use:

- [`routes/wordpile.test.ts`](../routes/wordpile.test.ts) — predates the
  shared helper and inlines its own copy of the same primitives. Useful as
  a worked example of the *full* shape (FK cascade on delete, transaction
  passthrough, composite-PK enforcement).
- [`routes/checkin.test.ts`](../routes/checkin.test.ts) — the smallest
  example. One table, owner-token gate, no Clerk.
- [`routes/library.test.ts`](../routes/library.test.ts) — multiple tables,
  owner-token gate, several tables declared only so the route imports
  don't crash.
- [`routes/bookkeeper.test.ts`](../routes/bookkeeper.test.ts) — the most
  complete example. Multi-table RBAC, full Clerk identity stub, per-user
  state, custom error handler in the harness.

The two source files:

- [`fakeDb.ts`](./fakeDb.ts) — `makeTable`, `makeFakeDb`, `fakeDrizzle`,
  `clearStores`, `nextId`, and the `FakeTable` / `Col` / `TableSpec`
  types. Implements the slice of drizzle the existing routes actually
  call.
- [`state.ts`](./state.ts) — mutable `state` object plus `setUser`,
  `setIdentity`, `resetState`. Lives in its own module so the
  hoisted `vi.mock` factory and the test body can both `await import`
  it and end up with the same reference.

---

## The five sharp edges (read before adding a new route test)

These all came up while the four existing suites were being written. None
of them are obvious from reading the helper alone — they fall out of how
Vitest's hoisting interacts with module-load-time side effects in the
production code.

### 1. `vi.hoisted` runs before any `import`, so put env-var setup there

If the route module (or anything it imports) reads `process.env.FOO` at
*module load time* (e.g. `lib/ownerAuth.ts` does `const OWNER_TOKEN =
process.env.LIBRARY_OWNER_TOKEN`), setting that env var inside `beforeEach`
is too late — by then the module has already captured `undefined`.

The fix is one line at the very top of the test file:

```ts
vi.hoisted(() => {
  process.env.LIBRARY_OWNER_TOKEN = "test-library-owner-token-abcdef";
});
```

`vi.hoisted` is itself hoisted above the `import` statements, so this
runs *before* `lib/ownerAuth.ts` evaluates. Worked examples:
[`checkin.test.ts`](../routes/checkin.test.ts),
[`library.test.ts`](../routes/library.test.ts),
[`bookkeeper.test.ts`](../routes/bookkeeper.test.ts) (which sets
`HEADWATERS_OWNER_EMAIL` the same way).

### 2. `vi.mock` factories must use `await import(...)` for the helper

The natural-looking version doesn't work:

```ts
// ❌ Doesn't work — `makeTable` is a top-level reference, but the
//    factory is hoisted above any imports, so it isn't in scope yet.
import { makeTable, makeFakeDb } from "../test/fakeDb";

vi.mock("@workspace/db", () => {
  const t = makeTable({ ... }); // ReferenceError at hoist time
  return { db: makeFakeDb(), t };
});
```

The async-factory form is the workaround:

```ts
vi.mock("@workspace/db", async () => {
  const { makeTable, makeFakeDb } = await import("../test/fakeDb");
  const fooTable = makeTable({ name: "foo", pk: ["id"], columns: [...] });
  return { db: makeFakeDb(), fooTable };
});

vi.mock("drizzle-orm", async () => {
  const { fakeDrizzle } = await import("../test/fakeDb");
  return fakeDrizzle;
});
```

The same trick is used to share `state` with the Clerk mock — see
[`bookkeeper.test.ts`](../routes/bookkeeper.test.ts) for the full Clerk
factory.

### 3. Re-importing tables: `import * as dbModule` + cast to `FakeTable`

Inside a `vi.mock` factory you can construct fake tables, but you can't
easily export typed handles to them — TypeScript has no way to see across
the mock boundary, and a plain `import { fooTable } from "@workspace/db"`
gets you the production drizzle table type, which has none of the
`__store` / `__pk` fields the test wants to poke at.

The pattern that works:

```ts
import * as dbModule from "@workspace/db";
import type { FakeTable } from "../test/fakeDb";

const tables = dbModule as unknown as {
  fooTable: FakeTable;
  barTable: FakeTable;
};

// Now `tables.fooTable.__store` is typed as Row[].
```

The `as unknown as { ... }` double cast is required because TypeScript
sees the production module type, not the mocked one. This is the only
place the cast is acceptable — keep it inside the test file.

### 4. `Object.keys(dbModule)` includes `db` — iterate an explicit list instead

The mocked `@workspace/db` exports both the fake `db` (no `__store`) and
the table objects (with `__store`). A blind `for (const k of
Object.keys(tables)) tables[k].__store.length = 0` will crash on `db`.
Always iterate an explicit list of table keys:

```ts
beforeEach(() => {
  const tableKeys: (keyof typeof tables)[] = [
    "bookkeeperUsersTable",
    "bookkeeperCostCentresTable",
    // ...
  ];
  for (const k of tableKeys) {
    tables[k].__store.length = 0;
  }
});
```

Or, equivalently, call `clearStores(tables.foo, tables.bar, ...)` from
`fakeDb.ts` with the specific tables you want zeroed.

### 5. Resetting the `__store` is mandatory between tests

The fake tables are constructed *once* inside the `vi.mock` factory and
shared by every test in the file. If you forget the per-test reset,
state leaks between tests in arbitrary order. Either:

- `tables.fooTable.__store.length = 0` per table in `beforeEach`, or
- `clearStores(tables.fooTable, tables.barTable, ...)` from `fakeDb.ts`.

For Clerk-using routes, also call `resetState()` from
[`state.ts`](./state.ts) — that clears `authUserId` and the
`identities` map so a previous test's signed-in user doesn't bleed
into the next one.

---

## What the fake supports

- `db.select()` / `db.selectDistinct()` with optional projection, then
  `.from(table).where(pred).orderBy(...).limit(n).offset(n)`.
- `db.insert(table).values({...}|[...]).returning()` and
  `.onConflictDoNothing()`. Auto-fills `id` (UUID), `createdAt`,
  `updatedAt` when those columns exist on the table. Enforces the
  table's `__pk` as a uniqueness constraint and throws a
  Postgres-shaped `duplicate key value violates unique constraint`
  error on conflict.
- `db.update(table).set({...}).where(pred).returning()`.
- `db.delete(table).where(pred)`.
- `db.transaction(async (tx) => ...)` — passes the same db handle
  through. Rollback semantics are not modelled; if your test cares
  about partial-write visibility, that contract is enforced by real
  Postgres and should be tested elsewhere.
- Predicates / order helpers re-exported via `fakeDrizzle`: `eq`, `ne`,
  `and`, `or`, `inArray`, `isNull`, `gte`, `lte`, `ilike`, `asc`,
  `desc`, and a `sql` template tag stub that matches *every row*.

## What the fake does NOT support

The fake is deliberately strict — it implements only what the four
existing routes actually use, and reaches that aren't modelled either
crash or silently match too many rows. **If you find yourself wanting
one of these, extend `fakeDb.ts` rather than working around it in your
test:**

- **`groupBy` / aggregations** — not implemented. A select builder
  call to `.groupBy(...)` will throw `builder.groupBy is not a
  function`. If a route needs this, add it to `makeSelect` in
  `fakeDb.ts` so every suite picks it up.
- **`sql` template tag with real semantics** — `fakeDrizzle.sql`
  returns a `{ kind: "raw" }` predicate that matches every row. That
  is good enough for routes that use `sql` only for a default value
  (e.g. `sql\`now()\``) but will silently pass for routes that rely on
  `sql` to filter. Prefer a typed predicate (`eq`, `gte`, etc.) in the
  route, or extend the fake to recognise the specific raw fragment.
- **Joins beyond simple `.from(table)` + predicate** — there is no
  `.innerJoin` / `.leftJoin`. Routes that need to join two tables
  generally do two selects and merge in JS, which the fake handles
  fine. If you need a real join, add it to `makeSelect`.
- **`returning()` after `.delete()`** — the delete builder resolves to
  `undefined`. Add it to `makeDelete` if a route ever needs the
  deleted rows back.
- **Cascade FK deletion** — *not* modelled by the shared helper. The
  `wordpile.test.ts` inline fake mirrors the real schema's
  `ON DELETE CASCADE` for piles → words because that route's tests
  depend on it. If you need cascade behaviour with the shared helper,
  do the cascade explicitly in your test setup, or extend `makeDelete`
  with a per-table hook.

---

## Recipe for a new route test

1. Add `vi.hoisted(() => { process.env.X = "..."; })` for any env vars
   the route reads at module load.
2. `vi.mock("@workspace/db", async () => { ... })` — async factory,
   `await import("../test/fakeDb")` inside, declare `makeTable(...)`
   for every table the route imports (even if the test doesn't write
   to it; otherwise the route's `import` will be `undefined`), return
   `{ db: makeFakeDb(), ...tables }`.
3. `vi.mock("drizzle-orm", async () => (await
   import("../test/fakeDb")).fakeDrizzle)`.
4. If the route uses Clerk: `vi.mock("@clerk/express", async () => {
   const { state } = await import("../test/state"); return { ... }; })`.
   Copy the shape from
   [`bookkeeper.test.ts`](../routes/bookkeeper.test.ts).
5. After the `vi.mock` calls, `import * as dbModule from "@workspace/db"`
   and cast to a `{ fooTable: FakeTable, ... }` shape.
6. In `beforeEach`, zero each table's `__store` (explicit list — see
   sharp edge #4) and call `resetState()` if you mocked Clerk.
7. Mount the router on a bare Express app — *don't* import `app.ts`
   unless you want to fake every other route's tables too.
