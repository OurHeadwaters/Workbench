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
 *     write races.  Falls back to in-memory if the DB query fails so a
 *     transient DB outage does not block all traffic.
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
        "[rateLimit] Postgres backend error — falling back to in-memory:",
        err,
      );
    }
  }
  return checkInMemory(key, opts);
}

/** Test-only.  Production code should never call this. */
export function __resetRateLimitForTests(): void {
  store.clear();
  pgPool = null;
}
