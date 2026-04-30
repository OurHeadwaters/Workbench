/**
 * Tiny in-memory token-bucket-ish rate limiter.  Keyed by (ip, scope)
 * so a single visitor can't spam the public POST endpoint and so the
 * email-keyed upsert can't be blasted past the same email by a script.
 *
 * Single-process; resets on restart.  This is the right shape for a
 * single small artifact — for a multi-instance deployment we would
 * need Redis, but the codetry-ship traffic profile is "a few signers
 * a day" so an in-memory map is honest.
 */

interface Hit {
  count: number;
  resetAt: number;
}

const store = new Map<string, Hit>();

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

export function checkRateLimit(
  key: string,
  opts: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + opts.windowMs });
    return {
      ok: true,
      remaining: opts.max - 1,
      retryAfterSec: 0,
    };
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

/** Test-only.  Production code should never call this. */
export function __resetRateLimitForTests(): void {
  store.clear();
}
