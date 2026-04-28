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

function rowMatches(
  row: Row,
  pred: Pred | null | undefined,
  joined = false,
): boolean {
  if (!pred) return true;
  switch (pred.kind) {
    case "eq":
      return getColValue(row, pred.col, joined) === pred.val;
    case "ne":
      return getColValue(row, pred.col, joined) !== pred.val;
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
      return cmp(getColValue(row, pred.col, joined), pred.val) >= 0;
    case "lte":
      return cmp(getColValue(row, pred.col, joined), pred.val) <= 0;
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

function applyOrders(rows: Row[], orders: Order[], joined = false): Row[] {
  if (orders.length === 0) return rows;
  return [...rows].sort((a, b) => {
    for (const o of orders) {
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
  projection?: Record<string, Col | FakeTable>,
) {
  let where: Pred | null = null;
  let orders: Order[] = [];
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
    rows = applyOrders(rows, orders, joined);
    if (offset !== null) rows = rows.slice(offset);
    if (limit !== null) rows = rows.slice(0, limit);

    if (projection) {
      return rows.map((r) => {
        const out: Row = {};
        for (const [k, v] of Object.entries(projection)) {
          if (isFakeTable(v)) {
            // Whole-table projection — drizzle returns the joined row's
            // record under this key.  Without a join, this would be
            // meaningless, so default to null.
            out[k] = joined ? (r[v.__name] as Row | null) ?? null : null;
          } else if (isCol(v)) {
            out[k] = getColValue(r, v, joined);
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
    orderBy(...os: Order[]) {
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
            const row: Row = { ...table.__defaults, ...v };
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
          Object.assign(r, updates);
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
