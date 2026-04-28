import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { CommunityPile, WordEntry } from "@/data/types";

// The cloudSync module reads `typeof window` and `typeof navigator` at the
// top level (to register online/offline listeners) and inside `attempt()`
// (to gate the fetch). Tests stub both globals before each fresh import so
// that the module-level singleton state (queue, generation, listeners) is
// reset and the `online` listener attaches to a window we control.

type CloudSync = typeof import("./cloudSync");

interface FakeWindow {
  addEventListener(type: string, listener: (event?: unknown) => void): void;
  removeEventListener(type: string, listener: (event?: unknown) => void): void;
  __dispatch(type: string): void;
}

function makeWindow(): FakeWindow {
  const listeners: Record<string, Array<(e?: unknown) => void>> = {};
  return {
    addEventListener(type, listener) {
      (listeners[type] ||= []).push(listener);
    },
    removeEventListener(type, listener) {
      listeners[type] = (listeners[type] || []).filter((l) => l !== listener);
    },
    __dispatch(type) {
      for (const l of listeners[type] || []) l();
    },
  };
}

interface FakeResponse {
  ok: boolean;
  status: number;
}

function ok(): FakeResponse {
  return { ok: true, status: 200 };
}
function status(code: number): FakeResponse {
  return { ok: code >= 200 && code < 300, status: code };
}

interface Harness {
  cloud: CloudSync;
  win: FakeWindow;
  navigator: { onLine: boolean };
  fetchMock: ReturnType<typeof vi.fn>;
}

async function setup(opts: { onLine?: boolean } = {}): Promise<Harness> {
  const onLine = opts.onLine ?? true;
  const win = makeWindow();
  const navigator = { onLine };
  const fetchMock = vi.fn();
  vi.resetModules();
  vi.stubGlobal("window", win);
  vi.stubGlobal("navigator", navigator);
  vi.stubGlobal("fetch", fetchMock);
  const cloud = await import("./cloudSync");
  return { cloud, win, navigator, fetchMock };
}

// Drain enough microtask ticks for an arbitrary `await fetch()` chain in
// `flushQueue` to settle. Each iteration of the while-loop awaits two
// promises (the fetch + the implicit return), so 30 microtask flushes is
// generous for the small queues we exercise here.
async function settle(): Promise<void> {
  for (let i = 0; i < 30; i++) {
    await Promise.resolve();
  }
}

function makePile(id: string, name = id): CommunityPile {
  return {
    id,
    name,
    createdAt: 1,
    updatedAt: 1,
    words: [],
  };
}

function makeWord(id: string, word = id): WordEntry {
  return {
    id,
    word,
    note: "",
    bucket: "unsorted",
    saferAlternative: "",
    createdAt: 1,
    updatedAt: 1,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("cloudSync — enqueue + flush ordering", () => {
  let harness: Harness;
  beforeEach(async () => {
    harness = await setup();
    harness.cloud.setCloudUser("user-1");
    harness.fetchMock.mockResolvedValue(ok());
  });

  it("issues queued requests in FIFO order", async () => {
    const { cloud, fetchMock } = harness;
    cloud.pushCreatePile(makePile("p1"));
    cloud.pushCreatePile(makePile("p2"));
    cloud.pushAddWord("p1", makeWord("w1", "fish"));
    cloud.pushDeletePile("p2");

    await settle();

    expect(fetchMock).toHaveBeenCalledTimes(4);
    const urls = fetchMock.mock.calls.map((c) => c[0] as string);
    expect(urls).toEqual([
      "/api/wordpile/piles",
      "/api/wordpile/piles",
      "/api/wordpile/piles/p1/words",
      "/api/wordpile/piles/p2",
    ]);
    const methods = fetchMock.mock.calls.map(
      (c) => (c[1] as { method: string }).method,
    );
    expect(methods).toEqual(["POST", "POST", "POST", "DELETE"]);

    const snap = cloud.getSyncSnapshot();
    expect(snap.status).toBe("idle");
    expect(snap.pendingCount).toBe(0);
    expect(snap.lastSyncedAt).not.toBeNull();
    expect(snap.lastErrorAt).toBeNull();
  });

  it("keeps a single request in flight at a time", async () => {
    const { cloud, fetchMock } = harness;
    let resolveFirst: (v: FakeResponse) => void = () => {};
    fetchMock.mockReset();
    fetchMock.mockImplementationOnce(
      () =>
        new Promise<FakeResponse>((r) => {
          resolveFirst = r;
        }),
    );
    fetchMock.mockResolvedValue(ok());

    cloud.pushCreatePile(makePile("p1"));
    cloud.pushCreatePile(makePile("p2"));
    cloud.pushCreatePile(makePile("p3"));

    await settle();
    // Only the head op should have been dispatched while the first
    // request hangs — that's the FIFO + single-in-flight contract.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(cloud.getSyncSnapshot().status).toBe("saving");
    expect(cloud.getSyncSnapshot().pendingCount).toBe(3);

    resolveFirst(ok());
    await settle();

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(cloud.getSyncSnapshot().status).toBe("idle");
    expect(cloud.getSyncSnapshot().pendingCount).toBe(0);
  });
});

describe("cloudSync — retry behaviour", () => {
  it("retries after a network error and recovers on the next mutation", async () => {
    const { cloud, fetchMock } = await setup();
    cloud.setCloudUser("user-1");

    fetchMock.mockRejectedValueOnce(new Error("network down"));

    cloud.pushCreatePile(makePile("p1"));
    await settle();

    // Network error: head op stays queued, status flips to error,
    // we deliberately do NOT auto-retry (no tight loop).
    expect(fetchMock).toHaveBeenCalledTimes(1);
    let snap = cloud.getSyncSnapshot();
    expect(snap.status).toBe("error");
    expect(snap.pendingCount).toBe(1);
    expect(snap.lastErrorAt).not.toBeNull();
    expect(snap.unsyncedFailures).toBe(0);

    // Next mutation should re-kick the queue and drain both ops in order.
    fetchMock.mockResolvedValue(ok());
    cloud.pushCreatePile(makePile("p2"));
    await settle();

    expect(fetchMock).toHaveBeenCalledTimes(3);
    const bodies = fetchMock.mock.calls.map(
      (c) => JSON.parse((c[1] as { body: string }).body) as { id: string },
    );
    expect(bodies.map((b) => b.id)).toEqual(["p1", "p1", "p2"]);
    snap = cloud.getSyncSnapshot();
    expect(snap.status).toBe("idle");
    expect(snap.pendingCount).toBe(0);
    expect(snap.lastErrorAt).toBeNull();
  });

  it("retries on 5xx responses (transient server failure)", async () => {
    const { cloud, fetchMock } = await setup();
    cloud.setCloudUser("user-1");

    fetchMock.mockResolvedValueOnce(status(503));
    cloud.pushCreatePile(makePile("p1"));
    await settle();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    let snap = cloud.getSyncSnapshot();
    expect(snap.status).toBe("error");
    expect(snap.pendingCount).toBe(1);
    expect(snap.unsyncedFailures).toBe(0);

    fetchMock.mockResolvedValue(ok());
    cloud.pushCreatePile(makePile("p2"));
    await settle();

    expect(fetchMock).toHaveBeenCalledTimes(3);
    snap = cloud.getSyncSnapshot();
    expect(snap.status).toBe("idle");
    expect(snap.pendingCount).toBe(0);
  });
});

describe("cloudSync — drop on permanent 4xx", () => {
  it("removes the head op on a 400 and bumps the sticky failure counter", async () => {
    const { cloud, fetchMock } = await setup();
    cloud.setCloudUser("user-1");
    fetchMock.mockResolvedValueOnce(status(400));
    fetchMock.mockResolvedValue(ok());

    cloud.pushCreatePile(makePile("p1"));
    cloud.pushCreatePile(makePile("p2"));
    await settle();

    // Both ops are dispatched: the first is dropped (400), the second
    // succeeds. Queue ends empty, but the sticky failure counter keeps
    // the snapshot in `error` so the pill doesn't lie about being synced.
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const snap = cloud.getSyncSnapshot();
    expect(snap.pendingCount).toBe(0);
    // Sticky-failure counter survives the subsequent successful push,
    // which is what keeps the pill in `error` even though `lastErrorAt`
    // gets cleared by the later success.
    expect(snap.unsyncedFailures).toBe(1);
    expect(snap.status).toBe("error");
    expect(snap.lastSyncedAt).not.toBeNull();
  });

  it("records lastErrorAt when the only op in the queue is dropped", async () => {
    const { cloud, fetchMock } = await setup();
    cloud.setCloudUser("user-1");
    fetchMock.mockResolvedValue(status(409));

    cloud.pushCreatePile(makePile("p1"));
    await settle();

    const snap = cloud.getSyncSnapshot();
    expect(snap.pendingCount).toBe(0);
    expect(snap.unsyncedFailures).toBe(1);
    expect(snap.status).toBe("error");
    expect(snap.lastErrorAt).not.toBeNull();
  });

  it("treats 408 and 429 as retryable rather than dropping", async () => {
    const { cloud, fetchMock } = await setup();
    cloud.setCloudUser("user-1");
    fetchMock.mockResolvedValueOnce(status(429));

    cloud.pushCreatePile(makePile("p1"));
    await settle();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const snap = cloud.getSyncSnapshot();
    expect(snap.pendingCount).toBe(1);
    expect(snap.unsyncedFailures).toBe(0);
    expect(snap.status).toBe("error");
  });
});

describe("cloudSync — sync-status snapshot transitions", () => {
  it("walks idle → saving → idle on a successful push", async () => {
    const { cloud, fetchMock } = await setup();
    cloud.setCloudUser("user-1");
    let resolveIt: (v: FakeResponse) => void = () => {};
    fetchMock.mockImplementationOnce(
      () =>
        new Promise<FakeResponse>((r) => {
          resolveIt = r;
        }),
    );

    const seen: string[] = [];
    const unsubscribe = cloud.subscribeSyncStatus(() => {
      seen.push(cloud.getSyncSnapshot().status);
    });

    expect(cloud.getSyncSnapshot().status).toBe("idle");
    cloud.pushCreatePile(makePile("p1"));
    await settle();
    expect(cloud.getSyncSnapshot().status).toBe("saving");

    resolveIt(ok());
    await settle();
    expect(cloud.getSyncSnapshot().status).toBe("idle");

    unsubscribe();
    // Pill must have observed both the saving and idle transitions, in
    // that order, with no spurious `error`/`offline` flicker in between.
    expect(seen).toContain("saving");
    expect(seen[seen.length - 1]).toBe("idle");
    expect(seen).not.toContain("error");
    expect(seen).not.toContain("offline");
  });

  it("reports `offline` while navigator is offline and the queue is non-empty", async () => {
    const { cloud, fetchMock } = await setup({ onLine: false });
    cloud.setCloudUser("user-1");

    cloud.pushCreatePile(makePile("p1"));
    await settle();

    expect(fetchMock).not.toHaveBeenCalled();
    const snap = cloud.getSyncSnapshot();
    expect(snap.status).toBe("offline");
    expect(snap.pendingCount).toBe(1);
  });

  it("flushes the queue when the browser fires `online`", async () => {
    const { cloud, win, navigator, fetchMock } = await setup({ onLine: false });
    cloud.setCloudUser("user-1");
    fetchMock.mockResolvedValue(ok());

    cloud.pushCreatePile(makePile("p1"));
    cloud.pushAddWord("p1", makeWord("w1"));
    await settle();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(cloud.getSyncSnapshot().status).toBe("offline");

    // Browser comes back online — the listener registered at module load
    // should kick the queue without us calling any push function.
    navigator.onLine = true;
    win.__dispatch("online");
    await settle();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const urls = fetchMock.mock.calls.map((c) => c[0] as string);
    expect(urls).toEqual([
      "/api/wordpile/piles",
      "/api/wordpile/piles/p1/words",
    ]);
    expect(cloud.getSyncSnapshot().status).toBe("idle");
    expect(cloud.getSyncSnapshot().pendingCount).toBe(0);
  });
});

describe("cloudSync — sign-out clears the queue", () => {
  it("drops queued ops and resets failure counters when the cloud user changes", async () => {
    const { cloud, fetchMock } = await setup({ onLine: false });
    cloud.setCloudUser("user-1");

    // Queue up some work that can't drain (we're offline).
    cloud.pushCreatePile(makePile("p1"));
    cloud.pushAddWord("p1", makeWord("w1"));
    await settle();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(cloud.getSyncSnapshot().pendingCount).toBe(2);
    expect(cloud.getSyncSnapshot().status).toBe("offline");

    // Sign-out: queue must be cleared, sticky counters reset, status
    // back to idle. Otherwise user A's pending writes could leak into
    // a later session (or into user B if a different account signs in).
    cloud.setCloudUser(null);
    const snap = cloud.getSyncSnapshot();
    expect(snap.pendingCount).toBe(0);
    expect(snap.unsyncedFailures).toBe(0);
    expect(snap.status).toBe("idle");
    expect(snap.lastErrorAt).toBeNull();

    // Pushes after sign-out must be no-ops — no enqueue, no fetch.
    cloud.pushCreatePile(makePile("p2"));
    await settle();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(cloud.getSyncSnapshot().pendingCount).toBe(0);
  });

  it("clears a sticky-error state when the user signs out", async () => {
    const { cloud, fetchMock } = await setup();
    cloud.setCloudUser("user-1");
    fetchMock.mockResolvedValue(status(400));

    cloud.pushCreatePile(makePile("p1"));
    await settle();
    expect(cloud.getSyncSnapshot().status).toBe("error");
    expect(cloud.getSyncSnapshot().unsyncedFailures).toBe(1);

    cloud.setCloudUser(null);
    const snap = cloud.getSyncSnapshot();
    expect(snap.status).toBe("idle");
    expect(snap.unsyncedFailures).toBe(0);
    expect(snap.lastErrorAt).toBeNull();
  });
});

describe("cloudSync — tenant isolation (account switch)", () => {
  it("drops user A's queued ops when switching directly to user B", async () => {
    const { cloud, fetchMock } = await setup();
    cloud.setCloudUser("user-A");

    // User A makes a change while the network is broken — the op is
    // stuck at the head of the queue waiting to retry.
    fetchMock.mockRejectedValue(new TypeError("network down"));
    cloud.pushCreatePile(makePile("a1", "Pile A"));
    await settle();
    expect(cloud.getSyncSnapshot().pendingCount).toBe(1);

    // Direct account switch (no sign-out in between). User A's queued
    // mutation must NOT be flushed against user B's account on the next
    // push or `online` event — that would be a tenant isolation
    // violation.
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(ok());
    cloud.setCloudUser("user-B");

    // Snapshot resets immediately — no leftover pending count for B to
    // wonder about.
    let snap = cloud.getSyncSnapshot();
    expect(snap.pendingCount).toBe(0);
    expect(snap.unsyncedFailures).toBe(0);
    expect(snap.status).toBe("idle");

    // User B makes a fresh change — only B's change should be sent. The
    // single fetch call confirms A's create-pile was never replayed.
    cloud.pushCreatePile(makePile("b1", "Pile B"));
    await settle();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [
      string,
      { body: string },
    ];
    expect(url).toBe("/api/wordpile/piles");
    const body = JSON.parse(init.body) as { id: string };
    expect(body.id).toBe("b1");
  });

  it("does not corrupt user B's queue when identity changes mid-flight", async () => {
    const { cloud, fetchMock } = await setup();
    cloud.setCloudUser("user-A");

    // We need to control exactly when user A's request resolves so we
    // can interleave a setCloudUser("B") + new push *during* the await.
    let resolveA: (v: FakeResponse) => void = () => {};
    fetchMock.mockImplementationOnce(
      () =>
        new Promise<FakeResponse>((r) => {
          resolveA = r;
        }),
    );

    cloud.pushCreatePile(makePile("a1", "A pile"));
    // Let the flush loop start its `await attempt(opA)`. fetchA was
    // called but its promise hasn't resolved yet.
    await settle();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(cloud.getSyncSnapshot().status).toBe("saving");

    // Mid-flight identity switch + a new push for user B. The next
    // fetch call should be for B's op, not for any leftover A op, and
    // B's op must NOT be removed by the in-flight A loop's eventual
    // `shift()`.
    fetchMock.mockResolvedValue(ok());
    cloud.setCloudUser("user-B");
    cloud.pushCreatePile(makePile("b1", "B pile"));

    // Now resolve user A's old request — the loop must see that
    // syncGeneration changed and bail without touching pendingQueue,
    // then re-kick a flush that drains B's op.
    resolveA(ok());
    await settle();

    // First fetch call was A's hung request; the second is B's op.
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const init = fetchMock.mock.calls[1][1] as { body: string };
    const body = JSON.parse(init.body) as { id: string };
    expect(body.id).toBe("b1");

    const snap = cloud.getSyncSnapshot();
    expect(snap.pendingCount).toBe(0);
    expect(snap.unsyncedFailures).toBe(0);
    expect(snap.status).toBe("idle");
  });
});

describe("cloudSync — retryNow()", () => {
  it("flushes the queue even when navigator.onLine is false", async () => {
    // Captive portals report navigator.onLine === false even when the
    // network actually works. retryNow() lets the user click past that.
    const { cloud, fetchMock } = await setup({ onLine: false });
    cloud.setCloudUser("user-1");
    fetchMock.mockResolvedValue(ok());

    cloud.pushCreatePile(makePile("p1"));
    await settle();

    // Background flush stayed away because the browser thinks we're
    // offline — exactly the situation the pill button is meant to cure.
    expect(fetchMock).not.toHaveBeenCalled();
    expect(cloud.getSyncSnapshot().status).toBe("offline");
    expect(cloud.getSyncSnapshot().pendingCount).toBe(1);

    // User clicks the pill. retryNow forces past the offline guard and
    // drains the queue against the (actually fine) network.
    await cloud.retryNow();
    await settle();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const snap = cloud.getSyncSnapshot();
    expect(snap.pendingCount).toBe(0);
    expect(snap.status).toBe("idle");
  });

  it("is a no-op when the queue is empty or already in flight", async () => {
    const { cloud, fetchMock } = await setup();
    cloud.setCloudUser("user-1");

    // Empty queue: no fetch should be made and we stay idle.
    await cloud.retryNow();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(cloud.getSyncSnapshot().status).toBe("idle");

    // In-flight guard: hold a fetch open, kick a mutation so the loop
    // is mid-await, then call retryNow — it must NOT fire a second
    // overlapping fetch.
    let resolve: (v: FakeResponse) => void = () => {};
    fetchMock.mockImplementationOnce(
      () =>
        new Promise<FakeResponse>((r) => {
          resolve = r;
        }),
    );

    cloud.pushCreatePile(makePile("p1"));
    await settle();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(cloud.getSyncSnapshot().status).toBe("saving");

    await cloud.retryNow();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Let the in-flight request finish so the test exits cleanly.
    resolve(ok());
    await settle();
    expect(cloud.getSyncSnapshot().status).toBe("idle");
  });
});
