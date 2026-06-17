/**
 * Tests for the shadow-cache behaviour during Postgres DB outages.
 *
 * Covers:
 *   1. Partially-consumed window is preserved — no fresh window on DB error
 *   2. An IP already at the limit stays blocked during a DB outage
 *   3. Shadow-cache entries older than 60 s are ignored — fresh window allowed
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  checkRateLimit,
  setRateLimitBackend,
  __resetRateLimitForTests,
} from "./rateLimit";

// ── Fake Postgres pool helpers ────────────────────────────────────────────────

type Row = { key: string; count: number; reset_at: number };

/**
 * Build a fake pool backed by a simple Map.  Implements only the UPSERT path
 * used by checkRateLimit — same semantics as the real SQL.
 */
function makeFakePool(table: Map<string, Row>) {
  return {
    async query<R extends Record<string, unknown>>(
      sql: string,
      params: unknown[],
    ): Promise<{ rows: R[] }> {
      const s = sql.replace(/\s+/g, " ").trim();

      if (/^INSERT INTO rate_limits/.test(s)) {
        const [key, newResetAt, now, capAt] = params as [
          string,
          number,
          number,
          number,
        ];
        const existing = table.get(key);
        let count: number;
        let reset_at: number;

        if (!existing || existing.reset_at <= now) {
          count = 1;
          reset_at = newResetAt;
        } else {
          count = Math.min(existing.count + 1, capAt);
          reset_at = existing.reset_at;
        }

        table.set(key, { key, count, reset_at });
        return {
          rows: [{ count, reset_at: String(reset_at) } as unknown as R],
        };
      }

      throw new Error(`Unhandled SQL in fake pool: ${s}`);
    },
  };
}

/**
 * A pool whose query() always rejects — simulates a total DB outage.
 */
function makeFailingPool() {
  return {
    async query(): Promise<never> {
      throw new Error("DB connection refused");
    },
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("shadow cache during DB outages", () => {
  const KEY = "shadow-test:1.2.3.4";
  const OPTS = { max: 5, windowMs: 60_000 };
  let table: Map<string, Row>;

  beforeEach(async () => {
    await __resetRateLimitForTests();
    table = new Map();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("seeds the in-memory store from the shadow cache on a DB error — no fresh window", async () => {
    // ── Phase 1: make 4 successful requests through Postgres ──────────────────
    // After each success the shadow cache is updated with the latest count.
    const goodPool = makeFakePool(table);
    setRateLimitBackend(goodPool);

    for (let i = 0; i < 4; i++) {
      const r = await checkRateLimit(KEY, OPTS);
      expect(r.ok).toBe(true);
    }

    // ── Phase 2: DB goes down ──────────────────────────────────────────────────
    // The next call should fall back to the shadow cache (count=4) rather than
    // handing out a fresh window (count=1).
    setRateLimitBackend(makeFailingPool());

    const r5 = await checkRateLimit(KEY, OPTS);

    // The shadow cache seeded the in-memory store with count=4, so this 5th
    // request consumes the last slot (count becomes 5, remaining=0) rather than
    // resetting to count=1 (remaining=4).
    expect(r5.ok).toBe(true);
    expect(r5.remaining).toBe(0);
  });

  it("keeps a fully-blocked IP blocked when the DB goes down", async () => {
    // ── Phase 1: exhaust the limit via Postgres ────────────────────────────────
    const goodPool = makeFakePool(table);
    setRateLimitBackend(goodPool);

    for (let i = 0; i < OPTS.max; i++) {
      await checkRateLimit(KEY, OPTS);
    }
    // One over the limit to confirm blockage in DB state
    const blocked = await checkRateLimit(KEY, OPTS);
    expect(blocked.ok).toBe(false);

    // ── Phase 2: DB goes down ──────────────────────────────────────────────────
    setRateLimitBackend(makeFailingPool());

    const r = await checkRateLimit(KEY, OPTS);

    // Shadow cache has count > max, so the IP must remain blocked.
    expect(r.ok).toBe(false);
    expect(r.remaining).toBe(0);
    expect(r.retryAfterSec).toBeGreaterThanOrEqual(1);
  });

  it("ignores shadow-cache entries older than 60 s and allows a fresh window", async () => {
    const dateSpy = vi.spyOn(Date, "now");
    const t0 = 1_700_000_000_000;
    dateSpy.mockReturnValue(t0);

    // ── Phase 1: make requests at t0 so the shadow cache is populated ─────────
    const goodPool = makeFakePool(table);
    setRateLimitBackend(goodPool);

    for (let i = 0; i < 4; i++) {
      await checkRateLimit(KEY, OPTS);
    }

    // ── Phase 2: advance time past the shadow-cache TTL (60 s) ───────────────
    // Also advance past the rate-limit window so the DB row's reset_at is in
    // the past too — this ensures we're truly starting over, not extending it.
    dateSpy.mockReturnValue(t0 + 61_000);

    // ── Phase 3: DB goes down ──────────────────────────────────────────────────
    setRateLimitBackend(makeFailingPool());

    const r = await checkRateLimit(KEY, OPTS);

    // The shadow-cache entry is >60 s old so it must be discarded.
    // The in-memory fallback should start a brand-new window.
    expect(r.ok).toBe(true);
    expect(r.remaining).toBe(OPTS.max - 1);
  });
});
