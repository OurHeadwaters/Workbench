import { describe, it, expect, beforeEach } from "vitest";
import {
  pruneExpiredRateLimits,
  checkRateLimit,
  setRateLimitBackend,
  __resetRateLimitForTests,
} from "./rateLimit";

// ── Minimal in-process fake Postgres pool ─────────────────────────────────────
//
// We keep a simple Map<key, {count, reset_at}> that mirrors the real schema and
// implements the same UPSERT+DELETE semantics so the tests exercise the real
// pruning SQL path without touching a live database.

type Row = { key: string; count: number; reset_at: number };
const fakeTable = new Map<string, Row>();

function fakePool() {
  return {
    async query<R extends Record<string, unknown>>(
      sql: string,
      params: unknown[],
    ): Promise<{ rows: R[] }> {
      const s = sql.replace(/\s+/g, " ").trim();

      // ── prune DELETE ──────────────────────────────────────────────
      if (/^WITH deleted AS/.test(s)) {
        const cutoff = params[0] as number;
        let deleted = 0;
        for (const [k, row] of fakeTable) {
          if (row.reset_at < cutoff) {
            fakeTable.delete(k);
            deleted++;
          }
        }
        return { rows: [{ count: String(deleted) } as unknown as R] };
      }

      // ── UPSERT (checkRateLimit / checkPostgres) ───────────────────
      if (/^INSERT INTO rate_limits/.test(s)) {
        const [key, newResetAt, now, capAt] = params as [
          string,
          number,
          number,
          number,
        ];
        const existing = fakeTable.get(key);
        let count: number;
        let reset_at: number;

        if (!existing || existing.reset_at <= now) {
          count = 1;
          reset_at = newResetAt;
        } else {
          count = Math.min(existing.count + 1, capAt);
          reset_at = existing.reset_at;
        }

        fakeTable.set(key, { key, count, reset_at });
        return {
          rows: [{ count, reset_at: String(reset_at) } as unknown as R],
        };
      }

      throw new Error(`Unhandled SQL in fake pool: ${s}`);
    },
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("pruneExpiredRateLimits", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
    fakeTable.clear();
  });

  it("returns null when no Postgres backend is configured (in-memory mode)", async () => {
    const result = await pruneExpiredRateLimits();
    expect(result).toBeNull();
  });

  it("returns 0 when the table is empty", async () => {
    setRateLimitBackend(fakePool());
    const result = await pruneExpiredRateLimits();
    expect(result).toBe(0);
  });

  it("removes only rows whose reset_at is in the past", async () => {
    const pool = fakePool();
    setRateLimitBackend(pool);

    const now = Date.now();
    // Insert one already-expired row and one still-active row directly into
    // the fake table so we don't have to wait for real time to pass.
    fakeTable.set("scope:1.2.3.4", {
      key: "scope:1.2.3.4",
      count: 3,
      reset_at: now - 1000,
    });
    fakeTable.set("scope:5.6.7.8", {
      key: "scope:5.6.7.8",
      count: 1,
      reset_at: now + 60_000,
    });

    const deleted = await pruneExpiredRateLimits();

    expect(deleted).toBe(1);
    expect(fakeTable.has("scope:1.2.3.4")).toBe(false);
    expect(fakeTable.has("scope:5.6.7.8")).toBe(true);
  });

  it("removes all rows when every entry is expired", async () => {
    const pool = fakePool();
    setRateLimitBackend(pool);

    const past = Date.now() - 5000;
    fakeTable.set("a:1.1.1.1", { key: "a:1.1.1.1", count: 1, reset_at: past });
    fakeTable.set("b:2.2.2.2", { key: "b:2.2.2.2", count: 2, reset_at: past });

    const deleted = await pruneExpiredRateLimits();

    expect(deleted).toBe(2);
    expect(fakeTable.size).toBe(0);
  });

  it("does not remove rows that were just upserted (active window)", async () => {
    const pool = fakePool();
    setRateLimitBackend(pool);

    // Simulate a fresh rate-limit hit so a row exists with a future reset_at.
    await checkRateLimit("scope:9.9.9.9", { max: 10, windowMs: 60_000 });

    const deleted = await pruneExpiredRateLimits();
    expect(deleted).toBe(0);
    expect(fakeTable.size).toBe(1);
  });
});
