/**
 * Token-bucket-ish rate limiter keyed by (ip, scope).
 *
 * Two backends are supported:
 *
 *   In-memory (default)
 *     Used automatically during tests and any time the Postgres backend has
 *     not been configured.  Resets on restart.  Call __resetRateLimitForTests
 *     between test cases to clear state.
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

// ── Shared types ─────────────────────────────────────────────────────────────

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

// ── In-memory backend ─────────────────────────────────────────────────────────

interface Hit {
  count: number;
  resetAt: number;
}

const store = new Map<string, Hit>();

function checkInMemory(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + opts.windowMs });
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
  return {
    ok: true,
    remaining: opts.max - existing.count,
    retryAfterSec: 0,
  };
}

// ── Shadow cache ──────────────────────────────────────────────────────────────

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
function seedFromShadow(key: string): void {
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
    const existing = store.get(key);
    if (!existing || existing.resetAt <= now || existing.count < entry.count) {
      store.set(key, { count: entry.count, resetAt: entry.resetAt });
    }
  }
}

// ── Postgres backend ──────────────────────────────────────────────────────────

let pgPool: QueryablePool | null = null;

/**
 * Switch to the Postgres backend.  Call once at server startup, passing the
 * shared pg Pool from @workspace/db.  Tests should never call this.
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

// ── Public interface ──────────────────────────────────────────────────────────

export async function checkRateLimit(
  key: string,
  opts: RateLimitOptions,
): Promise<RateLimitResult> {
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
      seedFromShadow(key);
    }
  }
  return checkInMemory(key, opts);
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

/** Test-only.  Production code should never call this. */
export function __resetRateLimitForTests(): void {
  store.clear();
  shadowCache.clear();
  pgPool = null;
}
