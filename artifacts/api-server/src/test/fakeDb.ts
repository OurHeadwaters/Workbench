// Generalized in-memory fake of the slice of `@workspace/db` (drizzle-orm)
// that our route tests reach into.  Built from the same primitives as
// `wordpile.test.ts` so the moving parts stay consistent across suites:
//
//   - `makeTable`        — declares a schema-shaped object with column
//                          handles (`{ __c: "name" }`), a backing __store,
//                          and a primary-key list used to enforce
//                          uniqueness on insert.
//   - `makeFakeDb`       — returns an object that looks enough like
//                          drizzle's `db` for the routes to call
//                          select/selectDistinct/insert/update/delete on
//                          it.  Builders are thenable so route code's
//                          `await db.select()...` flow works unchanged.
//   - `fakeDrizzle`      — replaces `drizzle-orm`'s comparator/sql exports
//                          (eq/and/or/desc/sql/...) with the plain
//                          predicate objects the in-memory engine
//                          understands.
//
// The fake is deliberately strict — anything the engine doesn't recognise
// throws so a future refactor that reaches into a new drizzle feature
// fails loudly instead of silently returning the wrong rows.

type Row = Record<string, unknown>;
export type Col = { __c: string; __t: string };

export interface TableSpec {
  name: string;
  pk: readonly string[];
  columns: readonly string[];
  defaults?: Record<string, unknown>;
}

export type FakeTable = {
  __name: string;
  __store: Row[];
  __pk: readonly string[];
  __defaults: Record<string, unknown>;
} & Record<string, Col>;

export function makeTable(spec: TableSpec): FakeTable {
  const t = {
    __name: spec.name,
    __store: [] as Row[],
    __pk: spec.pk,
    __defaults: spec.defaults ?? {},
  } as Record<string, unknown>;
  for (const c of spec.columns) {
    t[c] = { __c: c, __t: spec.name } as Col;
  }
  return t as FakeTable;
}

function isFakeTable(v: unknown): v is FakeTable {
  return !!v && typeof v === "object" && "__name" in (v as object) && "__store" in (v as object);
}

function isCol(v: unknown): v is Col {
  return !!v && typeof v === "object" && "__c" in (v as object);
}

// ---------- predicate / order types ----------

type Pred =
  | { kind: "eq"; col: Col; val: unknown }
  | { kind: "ne"; col: Col; val: unknown }
  | { kind: "and"; args: Pred[] }
  | { kind: "or"; args: Pred[] }
  | { kind: "inArray"; col: Col; vals: unknown[] }
  | { kind: "isNull"; col: Col }
  | { kind: "gte"; col: Col; val: unknown }
  | { kind: "gt"; col: Col; val: unknown }
  | { kind: "lte"; col: Col; val: unknown }
  | { kind: "ilike"; col: Col; pattern: string }
  | { kind: "raw" };

type Order = { kind: "asc" | "desc"; col: Col };

const eq = (col: Col, val: unknown): Pred => ({ kind: "eq", col, val });
const ne = (col: Col, val: unknown): Pred => ({ kind: "ne", col, val });
const and = (...args: (Pred | undefined)[]): Pred => ({
  kind: "and",
  args: args.filter((x): x is Pred => !!x),
});
const or = (...args: (Pred | undefined)[]): Pred => ({
  kind: "or",
  args: args.filter((x): x is Pred => !!x),
});
const inArray = (col: Col, vals: unknown[]): Pred => ({
  kind: "inArray",
  col,
  vals,
});
const isNull = (col: Col): Pred => ({ kind: "isNull", col });
const gte = (col: Col, val: unknown): Pred => ({ kind: "gte", col, val });
const gt = (col: Col, val: unknown): Pred => ({ kind: "gt", col, val });
const lte = (col: Col, val: unknown): Pred => ({ kind: "lte", col, val });
const ilike = (col: Col, pattern: string): Pred => ({
  kind: "ilike",
  col,
  pattern,
});
const asc = (col: Col): Order => ({ kind: "asc", col });
const desc = (col: Col): Order => ({ kind: "desc", col });

// `sql` template — treated as an opaque marker.  None of the predicates
// our auth tests rely on use raw SQL; if a route reaches for one it will
// just match every row, and the test will fail loudly on the assertion.
function sqlTpl(_strings?: TemplateStringsArray, ..._vals: unknown[]) {
  return { kind: "raw" } as const;
}

export const fakeDrizzle = {
  eq,
  ne,
  and,
  or,
  inArray,
  isNull,
  asc,
  desc,
  gte,
  gt,
  lte,
  ilike,
  sql: sqlTpl,
};

// ---------- evaluation ----------

// In a non-joined select the row is `Record<column, value>`; in a joined
// select the row is `Record<tableName, Record<column, value>>` so columns
// from different tables don't collide.  `getColValue` papers over the
// difference so the rest of the engine doesn't have to branch.
function getColValue(row: Row, col: Col, joined: boolean): unknown {
  if (joined) {
    const tableRow = row[col.__t] as Row | null | undefined;
    return tableRow ? tableRow[col.__c] : undefined;
  }
  return row[col.__c];
}

function resolveVal(val: unknown, row: Row, joined: boolean): unknown {
  // When the right-hand side of a predicate is itself a Col reference
  // (as in join conditions: eq(t1.col, t2.col)), resolve it against the
  // current row rather than comparing against the Col object literal.
  if (isCol(val)) return getColValue(row, val, joined);
  return val;
}

function rowMatches(
  row: Row,
  pred: Pred | null | undefined,
  joined = false,
): boolean {
  if (!pred) return true;
  switch (pred.kind) {
    case "eq": {
      const right = resolveVal(pred.val, row, joined);
      return getColValue(row, pred.col, joined) === right;
    }
    case "ne": {
      const right = resolveVal(pred.val, row, joined);
      return getColValue(row, pred.col, joined) !== right;
    }
    case "and":
      return pred.args.every((p) => rowMatches(row, p, joined));
    case "or":
      return pred.args.some((p) => rowMatches(row, p, joined));
    case "inArray":
      return pred.vals.includes(getColValue(row, pred.col, joined));
    case "isNull": {
      const v = getColValue(row, pred.col, joined);
      return v === null || v === undefined;
    }
    case "gte":
      return cmp(getColValue(row, pred.col, joined), resolveVal(pred.val, row, joined)) >= 0;
    case "gt":
      return cmp(getColValue(row, pred.col, joined), resolveVal(pred.val, row, joined)) > 0;
    case "lte":
      return cmp(getColValue(row, pred.col, joined), resolveVal(pred.val, row, joined)) <= 0;
    case "ilike": {
      const haystack = String(
        getColValue(row, pred.col, joined) ?? "",
      ).toLowerCase();
      const needle = pred.pattern.toLowerCase().replace(/%/g, "");
      return haystack.includes(needle);
    }
    case "raw":
      return true;
  }
}

function cmp(av: unknown, bv: unknown): number {
  if (av instanceof Date && bv instanceof Date) {
    return av.getTime() - bv.getTime();
  }
  if (av === bv) return 0;
  if (av === null || av === undefined) return -1;
  if (bv === null || bv === undefined) return 1;
  if (typeof av === "number" && typeof bv === "number") return av - bv;
  return String(av) < String(bv) ? -1 : 1;
}

// Drizzle allows passing a raw column to orderBy() (implies ascending).
// We accept both wrapped Order objects and bare Col references.
type OrderArg = Order | Col;

function resolveOrderArg(o: OrderArg): { col: Col; kind: "asc" | "desc" } {
  if ("kind" in o && (o.kind === "asc" || o.kind === "desc")) {
    return o as Order;
  }
  // Bare Col — treat as ascending (drizzle default)
  return { col: o as Col, kind: "asc" };
}

function applyOrders(rows: Row[], orders: OrderArg[], joined = false): Row[] {
  if (orders.length === 0) return rows;
  return [...rows].sort((a, b) => {
    for (const raw of orders) {
      const o = resolveOrderArg(raw);
      const c = cmp(getColValue(a, o.col, joined), getColValue(b, o.col, joined));
      if (c !== 0) return o.kind === "asc" ? c : -c;
    }
    return 0;
  });
}

// ---------- select ----------

type Join = { table: FakeTable; pred: Pred; kind: "inner" | "left" };

function makeSelect(
  table: FakeTable,
  projection?: Record<string, Col | FakeTable | Record<string, Col> | { kind: "raw" }>,
) {
  let where: Pred | null = null;
  let orders: OrderArg[] = [];
  let limit: number | null = null;
  let offset: number | null = null;
  const joins: Join[] = [];

  const evalRows = (): Row[] => {
    const joined = joins.length > 0;
    // Seed working set from the primary table.  In joined mode the row is
    // namespaced by table name so columns from other tables can be
    // attached without collision.
    let working: Row[] = joined
      ? table.__store.map((r) => ({ [table.__name]: r }))
      : table.__store.map((r) => ({ ...r }));

    for (const j of joins) {
      const next: Row[] = [];
      for (const left of working) {
        let matched = false;
        for (const right of j.table.__store) {
          const candidate: Row = { ...left, [j.table.__name]: right };
          if (rowMatches(candidate, j.pred, true)) {
            next.push(candidate);
            matched = true;
          }
        }
        if (!matched && j.kind === "left") {
          next.push({ ...left, [j.table.__name]: null });
        }
      }
      working = next;
    }

    let rows = working.filter((r) => rowMatches(r, where, joined));
    // Capture pre-limit count for COUNT(*) projections (sql`` tags).
    const filteredCount = rows.length;
    rows = applyOrders(rows, orders, joined);
    if (offset !== null) rows = rows.slice(offset);
    if (limit !== null) rows = rows.slice(0, limit);

    if (projection) {
      // When the projection is entirely sql-tag aggregates there are no
      // real column values to map per-row.  Drizzle returns a single
      // synthetic row; we replicate that by returning one result row.
      const onlySqlTags = Object.values(projection).every(
        (v) =>
          v &&
          typeof v === "object" &&
          !isFakeTable(v) &&
          !isCol(v) &&
          (v as { kind?: unknown }).kind === "raw",
      );
      const sourceRows = onlySqlTags ? [{}] : rows;

      return sourceRows.map((r) => {
        const out: Row = {};
        for (const [k, v] of Object.entries(projection)) {
          if (isFakeTable(v)) {
            // Whole-table projection — drizzle returns the joined row's
            // record under this key.  Without a join, this would be
            // meaningless, so default to null.
            out[k] = joined ? (r[v.__name] as Row | null) ?? null : null;
          } else if (isCol(v)) {
            out[k] = getColValue(r, v, joined);
          } else if (
            v &&
            typeof v === "object" &&
            (v as { kind?: unknown }).kind === "raw"
          ) {
            // sql`` aggregate expression — approximate COUNT(*) as the
            // number of rows that matched the WHERE clause.
            out[k] = filteredCount;
          } else if (v && typeof v === "object") {
            // Nested projection like `{ name: nurseryProducersTable.name }`.
            // Recursively resolve each Col inside the nested object.
            const nested: Row = {};
            for (const [nk, nv] of Object.entries(v as Record<string, unknown>)) {
              if (isCol(nv)) {
                nested[nk] = getColValue(r, nv, joined);
              }
            }
            out[k] = nested;
          } else {
            out[k] = undefined;
          }
        }
        return out;
      });
    }

    if (joined) {
      // Without a projection, surface only the primary-table columns so
      // existing call sites that expect flat rows keep working.
      return rows.map((r) => ({ ...((r[table.__name] as Row | null) ?? {}) }));
    }
    return rows.map((r) => ({ ...r }));
  };

  const builder = {
    where(p: Pred) {
      where = p;
      return builder;
    },
    orderBy(...os: OrderArg[]) {
      orders = os;
      return builder;
    },
    limit(n: number) {
      limit = n;
      return builder;
    },
    offset(n: number) {
      offset = n;
      return builder;
    },
    innerJoin(other: FakeTable, pred: Pred) {
      joins.push({ table: other, pred, kind: "inner" });
      return builder;
    },
    leftJoin(other: FakeTable, pred: Pred) {
      joins.push({ table: other, pred, kind: "left" });
      return builder;
    },
    groupBy(..._cols: Col[]) {
      // The fake doesn't materialise aggregates — group-by is accepted
      // and ignored so call sites keep type-checking.  Tests that depend
      // on aggregate semantics should query the fake's __store directly.
      return builder;
    },
    for(_mode: string) {
      // Row-level locking is a no-op in the in-memory fake.
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

// ---------- JSONB auto-parse ----------
//
// Real Postgres JSONB columns always return parsed values (arrays/objects),
// never the raw JSON string.  The fake stores whatever value the caller
// passes, so a route that stores `JSON.stringify([...])` would read it back
// as a string rather than an array.  This helper parses any string value
// that looks like a JSON array or object before the row is written to the
// store, matching the Postgres behaviour.

function parseJsonbInRow(row: Row): Row {
  const out: Row = {};
  for (const [k, v] of Object.entries(row)) {
    if (typeof v === "string" && v.length >= 2 && (v[0] === "[" || v[0] === "{")) {
      try {
        out[k] = JSON.parse(v) as unknown;
        continue;
      } catch {
        // Not valid JSON — keep original value.
      }
    }
    out[k] = v;
  }
  return out;
}

// ---------- insert ----------

let _idCounter = 0;
export function nextId(): string {
  _idCounter += 1;
  const hex = _idCounter.toString(16).padStart(32, "0");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    "4" + hex.slice(13, 16),
    "8" + hex.slice(17, 20),
    hex.slice(20, 32),
  ].join("-");
}

function isColRef(t: FakeTable, name: string): boolean {
  const v = (t as Record<string, unknown>)[name];
  return !!v && typeof v === "object" && "__c" in (v as object);
}

function makeInsert(table: FakeTable) {
  return {
    values(data: Row | Row[]) {
      const arr = Array.isArray(data) ? data : [data];
      const inserter = {
        returning() {
          const out: Row[] = [];
          for (const v of arr) {
            let row: Row = { ...table.__defaults, ...v };
            // Auto-fill an id if the table has one and the caller didn't
            // supply one (Postgres' defaultRandom() in production).
            if (isColRef(table, "id") && !("id" in row)) {
              row.id = nextId();
            }
            // Auto-fill timestamp columns with `now` so reads return the
            // same shape as a Postgres-managed row.
            if (isColRef(table, "createdAt") && row.createdAt === undefined) {
              row.createdAt = new Date();
            }
            if (isColRef(table, "updatedAt") && row.updatedAt === undefined) {
              row.updatedAt = new Date();
            }
            // Parse JSON strings (JSONB columns) so reads return the same
            // shape as real Postgres which always returns parsed values.
            row = parseJsonbInRow(row);
            // Enforce primary-key uniqueness like the real schema would.
            const conflict = table.__store.some((r) =>
              table.__pk.every((c) => r[c] === row[c]),
            );
            if (conflict) {
              const pkVals = table.__pk
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
        // Upsert by `target` column with the supplied set patch.  Mirrors
        // drizzle's `.onConflictDoUpdate({ target, set })` shape.  `target`
        // is a single column ref or an array of column refs that together
        // form the unique key.  Sql-tag values in `set` (e.g. `sql`now()``)
        // are treated as "use current Date".
        onConflictDoUpdate(opts: {
          target: Col | Col[];
          set: Row;
        }) {
          const targets = Array.isArray(opts.target) ? opts.target : [opts.target];
          const out: Row[] = [];
          for (const v of arr) {
            const row: Row = { ...table.__defaults, ...v };
            if (isColRef(table, "id") && !("id" in row)) {
              row.id = nextId();
            }
            if (isColRef(table, "createdAt") && row.createdAt === undefined) {
              row.createdAt = new Date();
            }
            if (isColRef(table, "updatedAt") && row.updatedAt === undefined) {
              row.updatedAt = new Date();
            }
            const existing = table.__store.find((r) =>
              targets.every((c) => r[c.__c] === row[c.__c]),
            );
            if (existing) {
              const patch: Row = {};
              for (const [k, val] of Object.entries(opts.set)) {
                // `sql\`...\`` values become a fakeDrizzle sql tag object —
                // approximate "current timestamp" here so updated_at flows
                // through tests like in production.
                if (
                  val &&
                  typeof val === "object" &&
                  (val as { kind?: unknown }).kind === "raw"
                ) {
                  patch[k] = new Date();
                } else {
                  patch[k] = val;
                }
              }
              Object.assign(existing, patch);
              out.push({ ...existing });
              continue;
            }
            const conflict = table.__store.some((r) =>
              table.__pk.every((c) => r[c] === row[c]),
            );
            if (conflict) {
              throw new Error(
                `duplicate key value violates unique constraint on ${table.__name} pk`,
              );
            }
            table.__store.push(row);
            out.push({ ...row });
          }
          return {
            returning() {
              return Promise.resolve(out);
            },
            then(
              resolve: (v: Row[]) => unknown,
              reject?: (e: unknown) => unknown,
            ) {
              return Promise.resolve(out)
                .then(resolve)
                .catch((e) => (reject ? reject(e) : Promise.reject(e)));
            },
          };
        },
        // Ignore conflicts — used by library tag attachers.
        onConflictDoNothing() {
          const out: Row[] = [];
          for (const v of arr) {
            const row: Row = { ...table.__defaults, ...v };
            if (isColRef(table, "id") && !("id" in row)) {
              row.id = nextId();
            }
            if (isColRef(table, "createdAt") && row.createdAt === undefined) {
              row.createdAt = new Date();
            }
            const conflict = table.__store.some((r) =>
              table.__pk.every((c) => r[c] === row[c]),
            );
            if (conflict) continue;
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
            .catch((e) => (reject ? reject(e) : Promise.reject(e)));
        },
      };
      return inserter;
    },
  };
}

// ---------- update ----------

function makeUpdate(table: FakeTable) {
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
          // Parse JSON strings in the patch before writing so JSONB columns
          // are stored as parsed values (mirroring Postgres behaviour).
          Object.assign(r, parseJsonbInRow(updates));
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
        .catch((e) => (reject ? reject(e) : Promise.reject(e)));
    },
  };
  return builder;
}

// ---------- delete ----------

function makeDelete(table: FakeTable) {
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
        for (const r of table.__store) {
          if (!rowMatches(r, where)) remain.push(r);
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

// ---------- top-level db ----------

export interface FakeDb {
  select: (proj?: Record<string, Col>) => {
    from: (t: FakeTable) => ReturnType<typeof makeSelect>;
  };
  selectDistinct: (proj?: Record<string, Col>) => {
    from: (t: FakeTable) => ReturnType<typeof makeSelect>;
  };
  insert: (t: FakeTable) => ReturnType<typeof makeInsert>;
  update: (t: FakeTable) => ReturnType<typeof makeUpdate>;
  delete: (t: FakeTable) => ReturnType<typeof makeDelete>;
  transaction: <T>(fn: (tx: FakeDb) => Promise<T>) => Promise<T>;
}

export function makeFakeDb(): FakeDb {
  const db: FakeDb = {
    select: (proj) => ({
      from: (t: FakeTable) => makeSelect(t, proj),
    }),
    selectDistinct: (proj) => ({
      from: (t: FakeTable) => makeSelect(t, proj),
    }),
    insert: (t: FakeTable) => makeInsert(t),
    update: (t: FakeTable) => makeUpdate(t),
    delete: (t: FakeTable) => makeDelete(t),
    transaction: async <T,>(fn: (tx: FakeDb) => Promise<T>): Promise<T> =>
      fn(db),
  };
  return db;
}

export function clearStores(...tables: FakeTable[]): void {
  for (const t of tables) t.__store.length = 0;
}
