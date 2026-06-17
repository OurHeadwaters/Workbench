/**
 * Async token-bucket-ish rate limiter.  Keyed by (ip, scope).
 *
 * Store selection (auto-detected at startup):
 * ───────────────────────────────────────────
 * • Postgres (setRateLimitBackend called): atomic UPSERT; survives restarts
 *   and works correctly across multiple instances sharing the same DB.
 * • Replit KV (REPLIT_DB_URL set): HTTP KV; survives restarts and is visible
 *   to every process in the same Replit project.
 * • In-memory (fallback): resets on restart; suitable for dev and tests.
 *
 *   Postgres
 *     Enabled at server startup by calling setRateLimitBackend(pool).  State
 *     is persisted in the `rate_limits` table so restarts and deployments do
 *     not clear blocked IPs.  A single atomic UPSERT eliminates read-modify-
 *     write races.  Falls back to the shadow cache (then in-memory) if the DB
 *     query fails, so a transient DB outage does not reset rate-limit windows.
 *
 *   Shadow cache
 *     An in-process mirror of the last-known DB state per key, with a ~60 s
 *     TTL.  On a DB error the cache seeds the in-memory fallback so that
 *     already-blocked IPs stay blocked and partially-consumed windows are
 *     preserved.  Without this, an attacker who noticed a DB outage would
 *     receive a fresh window on every request.
 *
 * Failure behaviour
 * ─────────────────
 * Errors in any backend cause fail-open (allow the request) so a transient
 * outage never blocks all traffic.
 */

/**
 * Minimal structural type for the pg Pool — avoids a direct `import type`
 * from the 'pg' package so this module has no new dependency declarations.
 * Anything that satisfies { query(sql, params) => Promise<{ rows }> } works.
 */
interface QueryablePool {
  query<R extends Record<string, unknown>>(
    sql: string,
    values: unknown[],
  ): Promise<{ rows: R[] }>;
}

// ── Domain types ───────────────────────────────────────────────────────────────

interface Hit {
  count: number;
  resetAt: number;
}

export interface RateLimitOptions {
  /** Number of requests allowed per window. */
  max: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
}

// ── Store interface ────────────────────────────────────────────────────────────

export interface RateLimitStore {
  get(key: string): Promise<Hit | undefined>;
  set(key: string, hit: Hit): Promise<void>;
  /** Remove all entries.  Used only by tests. */
  clear(): Promise<void>;
}

// ── In-memory store (dev / tests) ─────────────────────────────────────────────

export class MemoryRateLimitStore implements RateLimitStore {
  private readonly map = new Map<string, Hit>();

  async get(key: string): Promise<Hit | undefined> {
    return this.map.get(key);
  }

  async set(key: string, hit: Hit): Promise<void> {
    this.map.set(key, hit);
  }

  async clear(): Promise<void> {
    this.map.clear();
  }
}

// ── Shadow cache ───────────────────────────────────────────────────────────────

/** How long a shadow-cache entry is considered valid after it was written. */
const SHADOW_TTL_MS = 60_000;

interface ShadowEntry {
  /** Last count value returned by Postgres for this key. */
  count: number;
  /** Window reset timestamp (ms) returned by Postgres. */
  resetAt: number;
  /** Wall-clock time at which this entry was written. */
  storedAt: number;
}

const shadowCache = new Map<string, ShadowEntry>();

/**
 * Record the latest DB state for a key so we can replay it during outages.
 */
function shadowWrite(key: string, count: number, resetAt: number): void {
  shadowCache.set(key, { count, resetAt, storedAt: Date.now() });
}

/**
 * If the shadow cache has a fresh, non-expired entry for this key, seed the
 * in-memory store from it so the fallback path continues from the last-known
 * DB state rather than starting a brand-new window.
 */
async function seedFromShadow(key: string): Promise<void> {
  const entry = shadowCache.get(key);
  if (!entry) return;

  const now = Date.now();

  // Drop the entry if it is older than SHADOW_TTL_MS.
  if (now - entry.storedAt > SHADOW_TTL_MS) {
    shadowCache.delete(key);
    return;
  }

  // Only seed if the DB window is still active; otherwise the in-memory
  // backend will naturally start a fresh window on its own.
  if (entry.resetAt > now) {
    // Use whichever count is higher — store may already have increments from
    // earlier in-memory fallback calls during this outage.
    const existing = await _memoryStore.get(key);
    if (!existing || existing.resetAt <= now || existing.count < entry.count) {
      await _memoryStore.set(key, { count: entry.count, resetAt: entry.resetAt });
    }
  }
}

// ── Replit KV store (Replit-hosted production) ────────────────────────────────

const KV_PREFIX = "rl:";

export class ReplitKvRateLimitStore implements RateLimitStore {
  constructor(private readonly dbUrl: string) {}

  async get(key: string): Promise<Hit | undefined> {
    const res = await fetch(
      `${this.dbUrl}/${encodeURIComponent(KV_PREFIX + key)}`,
    );
    if (res.status === 404) return undefined;
    if (!res.ok) throw new Error(`KV GET failed: ${res.status}`);
    const text = await res.text();
    if (!text) return undefined;
    try {
      return JSON.parse(text) as Hit;
    } catch {
      return undefined;
    }
  }

  async set(key: string, hit: Hit): Promise<void> {
    const body = new URLSearchParams();
    body.set(KV_PREFIX + key, JSON.stringify(hit));
    const res = await fetch(this.dbUrl, { method: "POST", body });
    if (!res.ok) throw new Error(`KV SET failed: ${res.status}`);
  }

  async clear(): Promise<void> {
    const listRes = await fetch(
      `${this.dbUrl}?prefix=${encodeURIComponent(KV_PREFIX)}&encode=true`,
    );
    if (!listRes.ok) return;
    const text = await listRes.text();
    if (!text) return;
    const keys = text
      .split("\n")
      .map((k) => k.trim())
      .filter(Boolean)
      .map((k) => decodeURIComponent(k));
    await Promise.all(
      keys.map((k) =>
        fetch(`${this.dbUrl}/${encodeURIComponent(k)}`, { method: "DELETE" }),
      ),
    );
  }
}

// ── Module-level store (KV or in-memory) ──────────────────────────────────────

const _memoryStore = new MemoryRateLimitStore();

function makeDefaultStore(): RateLimitStore {
  const dbUrl = process.env.REPLIT_DB_URL;
  if (dbUrl) return new ReplitKvRateLimitStore(dbUrl);
  return _memoryStore;
}

let _store: RateLimitStore = makeDefaultStore();

// ── Postgres backend (self-hosted / multi-instance via shared DB) ──────────────

let pgPool: QueryablePool | null = null;

/**
 * Switch to the Postgres backend.  Call once at server startup, passing the
 * shared pg Pool from @workspace/db.  Tests should never call this.
 *
 * When set, Postgres takes priority over the KV / in-memory store because it
 * uses a single atomic UPSERT that eliminates read-modify-write races across
 * concurrent instances.
 */
export function setRateLimitBackend(pool: QueryablePool): void {
  pgPool = pool;
}

async function checkPostgres(
  key: string,
  opts: RateLimitOptions,
): Promise<RateLimitResult> {
  const now = Date.now();
  const newResetAt = now + opts.windowMs;
  const capAt = opts.max + 1;

  const { rows } = await pgPool!.query<{ count: number; reset_at: string }>(
    `INSERT INTO rate_limits (key, count, reset_at)
     VALUES ($1, 1, $2)
     ON CONFLICT (key) DO UPDATE SET
       count = CASE
         WHEN rate_limits.reset_at <= $3 THEN 1
         ELSE LEAST(rate_limits.count + 1, $4)
       END,
       reset_at = CASE
         WHEN rate_limits.reset_at <= $3 THEN $2
         ELSE rate_limits.reset_at
       END
     RETURNING count, reset_at`,
    [key, newResetAt, now, capAt],
  );

  const row = rows[0]!;
  const count = Number(row.count);
  const resetAt = Number(row.reset_at);

  // Mirror the DB state into the shadow cache for use during future outages.
  shadowWrite(key, count, resetAt);

  if (count > opts.max) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((resetAt - now) / 1000)),
    };
  }

  return {
    ok: true,
    remaining: opts.max - count,
    retryAfterSec: 0,
  };
}

// ── Public API ─────────────────────────────────────────────────────────────────

export async function checkRateLimit(
  key: string,
  opts: RateLimitOptions,
): Promise<RateLimitResult> {
  // Postgres path: single atomic UPSERT — no read-modify-write races.
  if (pgPool) {
    try {
      return await checkPostgres(key, opts);
    } catch (err) {
      console.error(
        "[rateLimit] Postgres backend error — falling back to shadow cache + in-memory:",
        err,
      );
      // Seed the in-memory store from the last-known DB state so the fallback
      // does not hand out a fresh window.
      await seedFromShadow(key);
    }
  }

  // KV / in-memory path.
  const now = Date.now();
  let existing: Hit | undefined;

  try {
    existing = await _store.get(key);
  } catch {
    // Store unavailable — fail open rather than blocking legitimate traffic.
    return { ok: true, remaining: opts.max - 1, retryAfterSec: 0 };
  }

  if (!existing || existing.resetAt <= now) {
    const hit: Hit = { count: 1, resetAt: now + opts.windowMs };
    await _store.set(key, hit).catch(() => {});
    return { ok: true, remaining: opts.max - 1, retryAfterSec: 0 };
  }

  if (existing.count >= opts.max) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  await _store.set(key, existing).catch(() => {});
  return {
    ok: true,
    remaining: opts.max - existing.count,
    retryAfterSec: 0,
  };
}

/**
 * Delete all rows from the `rate_limits` table whose window has already
 * expired (i.e. reset_at < now).  These rows will never be hit again by
 * active traffic — their next access would simply overwrite them — so
 * removing them keeps the table size bounded.
 *
 * Returns the number of rows deleted, or null when the Postgres backend is
 * not configured (in-memory mode has no persistent rows to prune).
 */
export async function pruneExpiredRateLimits(): Promise<number | null> {
  if (!pgPool) return null;

  const now = Date.now();
  const result = await pgPool.query<{ count: string }>(
    `WITH deleted AS (
       DELETE FROM rate_limits WHERE reset_at < $1 RETURNING 1
     )
     SELECT COUNT(*)::text AS count FROM deleted`,
    [now],
  );

  return Number(result.rows[0]?.count ?? 0);
}

/**
 * Override the active KV/memory store.  Test-only — production code must
 * never call this.  Passing `undefined` resets to the environment-selected
 * default.
 */
export function __setRateLimitStoreForTests(
  store: RateLimitStore | undefined,
): void {
  _store = store ?? makeDefaultStore();
}

/** Test-only.  Clear all stores, reset to in-memory, and clear pgPool. */
export async function __resetRateLimitForTests(): Promise<void> {
  await _memoryStore.clear();
  shadowCache.clear();
  _store = _memoryStore;
  pgPool = null;
}
