/**
 * Unit tests for rateLimit.ts
 *
 * Covers:
 *   1. MemoryRateLimitStore — all CRUD paths
 *   2. ReplitKvRateLimitStore — get/set/clear via mocked fetch
 *   3. checkRateLimit — core logic (window, counting, exhaustion)
 *   4. KV-error fail-open behaviour
 *   5. Store injection via __setRateLimitStoreForTests
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  MemoryRateLimitStore,
  ReplitKvRateLimitStore,
  checkRateLimit,
  __resetRateLimitForTests,
  __setRateLimitStoreForTests,
} from "./rateLimit";

// ── helpers ───────────────────────────────────────────────────────────────────

function makeKvResponse(body: string, status = 200): Response {
  return new Response(body, { status });
}

// ── MemoryRateLimitStore ──────────────────────────────────────────────────────

describe("MemoryRateLimitStore", () => {
  it("returns undefined for an unknown key", async () => {
    const store = new MemoryRateLimitStore();
    expect(await store.get("missing")).toBeUndefined();
  });

  it("stores and retrieves a hit", async () => {
    const store = new MemoryRateLimitStore();
    const hit = { count: 2, resetAt: Date.now() + 60_000 };
    await store.set("key1", hit);
    expect(await store.get("key1")).toEqual(hit);
  });

  it("overwrites an existing hit", async () => {
    const store = new MemoryRateLimitStore();
    await store.set("key1", { count: 1, resetAt: 1000 });
    await store.set("key1", { count: 5, resetAt: 9999 });
    expect(await store.get("key1")).toEqual({ count: 5, resetAt: 9999 });
  });

  it("clear() removes all entries", async () => {
    const store = new MemoryRateLimitStore();
    await store.set("a", { count: 1, resetAt: 1000 });
    await store.set("b", { count: 2, resetAt: 2000 });
    await store.clear();
    expect(await store.get("a")).toBeUndefined();
    expect(await store.get("b")).toBeUndefined();
  });
});

// ── ReplitKvRateLimitStore ────────────────────────────────────────────────────

describe("ReplitKvRateLimitStore", () => {
  const DB_URL = "https://kv.replit.example";

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("get() returns undefined when KV responds 404", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeKvResponse("", 404)),
    );
    const store = new ReplitKvRateLimitStore(DB_URL);
    expect(await store.get("mykey")).toBeUndefined();
  });

  it("get() parses a JSON Hit from the KV response body", async () => {
    const hit = { count: 3, resetAt: 99999 };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeKvResponse(JSON.stringify(hit))),
    );
    const store = new ReplitKvRateLimitStore(DB_URL);
    expect(await store.get("mykey")).toEqual(hit);
  });

  it("get() throws when KV returns a non-404 error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeKvResponse("", 500)),
    );
    const store = new ReplitKvRateLimitStore(DB_URL);
    await expect(store.get("mykey")).rejects.toThrow("KV GET failed: 500");
  });

  it("get() returns undefined for an empty body (key deleted race)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeKvResponse("")),
    );
    const store = new ReplitKvRateLimitStore(DB_URL);
    expect(await store.get("mykey")).toBeUndefined();
  });

  it("set() POSTs the hit JSON under the rl: prefix", async () => {
    const mockFetch = vi.fn().mockResolvedValue(makeKvResponse("", 200));
    vi.stubGlobal("fetch", mockFetch);
    const store = new ReplitKvRateLimitStore(DB_URL);
    const hit = { count: 1, resetAt: 12345 };
    await store.set("testkey", hit);

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(DB_URL);
    expect(init.method).toBe("POST");
    const params = new URLSearchParams(init.body as string);
    expect(params.get("rl:testkey")).toBe(JSON.stringify(hit));
  });

  it("set() throws when KV returns an error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeKvResponse("", 503)),
    );
    const store = new ReplitKvRateLimitStore(DB_URL);
    await expect(store.get("k")).rejects.toThrow();
  });

  it("clear() deletes all keys with the rl: prefix", async () => {
    const key1 = "rl:foo";
    const key2 = "rl:bar";
    const encodedList = [key1, key2]
      .map(encodeURIComponent)
      .join("\n");

    const mockFetch = vi
      .fn()
      // First call: list
      .mockResolvedValueOnce(makeKvResponse(encodedList))
      // Subsequent calls: deletes
      .mockResolvedValue(makeKvResponse("", 200));

    vi.stubGlobal("fetch", mockFetch);
    const store = new ReplitKvRateLimitStore(DB_URL);
    await store.clear();

    const calls = mockFetch.mock.calls as Array<[string, RequestInit?]>;
    // First call is the list
    expect(calls[0][0]).toContain("?prefix=");
    // Remaining calls are DELETE requests for each key
    const deleteCalls = calls.slice(1);
    expect(deleteCalls).toHaveLength(2);
    for (const [url, init] of deleteCalls) {
      expect(init?.method).toBe("DELETE");
      expect(url).toContain(DB_URL);
    }
  });
});

// ── checkRateLimit (core logic) ───────────────────────────────────────────────

describe("checkRateLimit — core logic via injected MemoryStore", () => {
  beforeEach(async () => {
    await __resetRateLimitForTests();
  });

  it("allows the first request and returns max-1 remaining", async () => {
    const result = await checkRateLimit("test:ip:1.2.3.4", {
      max: 5,
      windowMs: 60_000,
    });
    expect(result.ok).toBe(true);
    expect(result.remaining).toBe(4);
    expect(result.retryAfterSec).toBe(0);
  });

  it("counts up correctly until the limit is reached", async () => {
    const opts = { max: 3, windowMs: 60_000 };
    for (let i = 0; i < 2; i++) {
      const r = await checkRateLimit("test:ip:2.2.2.2", opts);
      expect(r.ok).toBe(true);
    }
    const r3 = await checkRateLimit("test:ip:2.2.2.2", opts);
    expect(r3.ok).toBe(true);
    const r4 = await checkRateLimit("test:ip:2.2.2.2", opts);
    expect(r4.ok).toBe(false);
    expect(r4.remaining).toBe(0);
    expect(r4.retryAfterSec).toBeGreaterThanOrEqual(1);
  });

  it("resets the window when resetAt is in the past", async () => {
    const dateSpy = vi.spyOn(Date, "now");
    const t = 1_000_000_000_000;
    dateSpy.mockReturnValue(t);

    const opts = { max: 2, windowMs: 60_000 };
    // exhaust the window
    await checkRateLimit("test:win:3.3.3.3", opts);
    await checkRateLimit("test:win:3.3.3.3", opts);
    const blocked = await checkRateLimit("test:win:3.3.3.3", opts);
    expect(blocked.ok).toBe(false);

    // advance past the window
    dateSpy.mockReturnValue(t + 61_000);
    const fresh = await checkRateLimit("test:win:3.3.3.3", opts);
    expect(fresh.ok).toBe(true);
    expect(fresh.remaining).toBe(1);

    dateSpy.mockRestore();
  });

  it("keeps separate counters per key", async () => {
    const opts = { max: 1, windowMs: 60_000 };
    const r1 = await checkRateLimit("test:ip:4.4.4.4", opts);
    expect(r1.ok).toBe(true);
    const r1b = await checkRateLimit("test:ip:4.4.4.4", opts);
    expect(r1b.ok).toBe(false);

    // Different key — should be unaffected
    const r2 = await checkRateLimit("test:ip:5.5.5.5", opts);
    expect(r2.ok).toBe(true);
  });
});

// ── KV-error fail-open ────────────────────────────────────────────────────────

describe("checkRateLimit — fail-open when KV throws", () => {
  afterEach(async () => {
    await __resetRateLimitForTests();
    vi.restoreAllMocks();
  });

  it("returns ok:true when the store's get() throws", async () => {
    const faultyStore = {
      get: vi.fn().mockRejectedValue(new Error("KV unavailable")),
      set: vi.fn().mockResolvedValue(undefined),
      clear: vi.fn().mockResolvedValue(undefined),
    };
    __setRateLimitStoreForTests(faultyStore);

    const result = await checkRateLimit("test:faulty", { max: 3, windowMs: 60_000 });
    expect(result.ok).toBe(true);
  });
});
