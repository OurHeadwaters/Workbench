import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// cloudSync.ts short-circuits whenever it can't see a `window` (its way of
// staying safe under SSR / unit tests). For these tests we want it to
// behave like the browser, so we stub `window`, `navigator`, and `fetch`
// before importing the module — `vi.resetModules()` makes sure we get a
// fresh instance each test with the new globals already in place.
function stubBrowser() {
  vi.stubGlobal("window", {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
  vi.stubGlobal("navigator", { onLine: true });
}

async function freshCloudSync() {
  vi.resetModules();
  const mod = await import("./cloudSync");
  return mod;
}

beforeEach(() => {
  stubBrowser();
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// Wait for the queue to fully drain. Because each push is awaited inside
// flushQueue (microtask-driven), a couple of microtask flushes is enough
// for the tests below.
async function flushMicrotasks(times = 5) {
  for (let i = 0; i < times; i += 1) {
    await Promise.resolve();
  }
}

describe("cloudSync — sync snapshot", () => {
  it("starts idle when nothing has been pushed", async () => {
    const cs = await freshCloudSync();
    expect(cs.getSyncSnapshot().status).toBe("idle");
    expect(cs.getSyncSnapshot().pendingCount).toBe(0);
    expect(cs.getSyncSnapshot().unsyncedFailures).toBe(0);
  });

  it("never reports 'synced' after a 4xx-dropped mutation", async () => {
    const cs = await freshCloudSync();
    // The mutation needs a signed-in user or it's a no-op.
    cs.setCloudUser("user-1");
    // Server permanently rejects the request — 409 conflict, the kind we
    // intentionally drop instead of looping forever.
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("conflict", { status: 409 }));
    vi.stubGlobal("fetch", fetchMock);

    cs.pushCreatePile({
      id: "00000000-0000-4000-8000-000000000001",
      name: "Deer Lake",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      words: [],
    });
    await flushMicrotasks();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const snap = cs.getSyncSnapshot();
    // The op was dropped from the queue — pendingCount returns to 0 — but
    // unsyncedFailures must be set so the pill stays in `error`. Reporting
    // `idle` here would be a lie: that change never reached the server.
    expect(snap.pendingCount).toBe(0);
    expect(snap.unsyncedFailures).toBe(1);
    expect(snap.status).toBe("error");
  });

  it("clears the sticky failure when bootstrapSync succeeds", async () => {
    const cs = await freshCloudSync();
    cs.setCloudUser("user-1");
    // First, force a sticky failure so we have something to recover from.
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("conflict", { status: 409 })),
    );
    cs.pushCreatePile({
      id: "00000000-0000-4000-8000-000000000002",
      name: "Bearskin Lake",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      words: [],
    });
    await flushMicrotasks();
    expect(cs.getSyncSnapshot().status).toBe("error");

    // Now a successful bootstrap should reconcile and clear the warning.
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ piles: [] }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        ),
    );
    const merged = await cs.bootstrapSync({
      version: 1,
      piles: {},
      pileOrder: [],
      selectedPileId: null,
    });
    expect(merged).not.toBeNull();
    const snap = cs.getSyncSnapshot();
    expect(snap.unsyncedFailures).toBe(0);
    expect(snap.status).toBe("idle");
  });

  it("drops user A's queued ops when switching directly to user B", async () => {
    const cs = await freshCloudSync();
    cs.setCloudUser("user-A");

    // User A makes a change while the network is broken — the op is
    // stuck at the head of the queue waiting to retry.
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("network down")),
    );
    cs.pushCreatePile({
      id: "00000000-0000-4000-8000-0000000000aa",
      name: "Pile A",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      words: [],
    });
    await flushMicrotasks();
    expect(cs.getSyncSnapshot().pendingCount).toBe(1);

    // Direct account switch (no sign-out in between). User A's queued
    // mutation must NOT be flushed against user B's account on the next
    // push or `online` event — that would be a tenant isolation
    // violation.
    const fetchAfterSwitch = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchAfterSwitch);
    cs.setCloudUser("user-B");

    // Snapshot resets immediately — no leftover pending count for B to
    // wonder about.
    let snap = cs.getSyncSnapshot();
    expect(snap.pendingCount).toBe(0);
    expect(snap.unsyncedFailures).toBe(0);
    expect(snap.status).toBe("idle");

    // User B makes a fresh change — only B's change should be sent. The
    // single fetch call confirms A's create-pile was never replayed.
    cs.pushCreatePile({
      id: "00000000-0000-4000-8000-0000000000bb",
      name: "Pile B",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      words: [],
    });
    await flushMicrotasks();

    expect(fetchAfterSwitch).toHaveBeenCalledTimes(1);
    const [url, init] = fetchAfterSwitch.mock.calls[0];
    expect(url).toBe("/api/wordpile/piles");
    const body = JSON.parse(init.body as string) as { id: string };
    expect(body.id).toBe("00000000-0000-4000-8000-0000000000bb");
  });

  it("does not corrupt user B's queue when identity changes mid-flight", async () => {
    const cs = await freshCloudSync();
    cs.setCloudUser("user-A");

    // We need to control exactly when user A's request resolves so we can
    // interleave a setCloudUser("B") + new push *during* the await. Hand
    // out a pending promise we can resolve manually.
    let resolveA!: (res: Response) => void;
    const aResponse = new Promise<Response>((resolve) => {
      resolveA = resolve;
    });
    const fetchA = vi.fn().mockReturnValueOnce(aResponse);
    vi.stubGlobal("fetch", fetchA);

    cs.pushCreatePile({
      id: "00000000-0000-4000-8000-0000000000a1",
      name: "A pile",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      words: [],
    });
    // Let the flush loop start its `await attempt(opA)`. fetchA was
    // called but its promise hasn't resolved yet.
    await flushMicrotasks();
    expect(fetchA).toHaveBeenCalledTimes(1);
    expect(cs.getSyncSnapshot().status).toBe("saving");

    // Mid-flight identity switch + a new push for user B. The next fetch
    // call should be for B's op, not for any leftover A op, and B's op
    // must NOT be removed by the in-flight A loop's eventual `shift()`.
    const fetchB = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchB);
    cs.setCloudUser("user-B");
    cs.pushCreatePile({
      id: "00000000-0000-4000-8000-0000000000b1",
      name: "B pile",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      words: [],
    });

    // Now resolve user A's old request — the loop must see that
    // syncGeneration changed and bail without touching pendingQueue,
    // then re-kick a flush that drains B's op.
    resolveA(new Response(null, { status: 204 }));
    await flushMicrotasks(40);

    expect(fetchB).toHaveBeenCalledTimes(1);
    const [, init] = fetchB.mock.calls[0];
    const body = JSON.parse(init.body as string) as { id: string };
    expect(body.id).toBe("00000000-0000-4000-8000-0000000000b1");

    const snap = cs.getSyncSnapshot();
    expect(snap.pendingCount).toBe(0);
    expect(snap.unsyncedFailures).toBe(0);
    expect(snap.status).toBe("idle");
  });

  it("clears all queue/failure state on sign-out", async () => {
    const cs = await freshCloudSync();
    cs.setCloudUser("user-1");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("conflict", { status: 409 })),
    );
    cs.pushCreatePile({
      id: "00000000-0000-4000-8000-000000000003",
      name: "Sandy Lake",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      words: [],
    });
    await flushMicrotasks();
    expect(cs.getSyncSnapshot().status).toBe("error");

    cs.setCloudUser(null);
    const snap = cs.getSyncSnapshot();
    expect(snap.status).toBe("idle");
    expect(snap.pendingCount).toBe(0);
    expect(snap.unsyncedFailures).toBe(0);
  });

  it("retryNow() flushes the queue even when navigator.onLine is false", async () => {
    // Scenario: user made a change, the network actually came back, but
    // navigator.onLine is still falsely reporting offline (captive
    // portals do this all the time). Without a forced retry the queue
    // sits indefinitely.
    vi.stubGlobal("navigator", { onLine: false });
    const cs = await freshCloudSync();
    cs.setCloudUser("user-1");

    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    cs.pushCreatePile({
      id: "00000000-0000-4000-8000-000000000010",
      name: "Forced retry pile",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      words: [],
    });
    await flushMicrotasks();

    // Background flush stayed away because the browser thinks we're
    // offline — exactly the situation the pill button is meant to cure.
    expect(fetchMock).not.toHaveBeenCalled();
    let snap = cs.getSyncSnapshot();
    expect(snap.status).toBe("offline");
    expect(snap.pendingCount).toBe(1);

    // User clicks the pill. retryNow forces past the offline guard and
    // drains the queue against the (actually fine) network.
    await cs.retryNow();
    await flushMicrotasks();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    snap = cs.getSyncSnapshot();
    expect(snap.pendingCount).toBe(0);
    expect(snap.status).toBe("idle");
  });

  it("retryNow() is a no-op when the queue is empty or already in flight", async () => {
    const cs = await freshCloudSync();
    cs.setCloudUser("user-1");

    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    // Empty queue: no fetch should be made and we stay idle.
    await cs.retryNow();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(cs.getSyncSnapshot().status).toBe("idle");

    // In-flight guard: hold a fetch open, kick a mutation so the loop
    // is mid-await, then call retryNow — it must NOT fire a second
    // overlapping fetch.
    let resolve!: (res: Response) => void;
    const pending = new Promise<Response>((r) => {
      resolve = r;
    });
    fetchMock.mockReturnValueOnce(pending);

    cs.pushCreatePile({
      id: "00000000-0000-4000-8000-000000000011",
      name: "Pile in flight",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      words: [],
    });
    await flushMicrotasks();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(cs.getSyncSnapshot().status).toBe("saving");

    await cs.retryNow();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Let the in-flight request finish so the test exits cleanly.
    resolve(new Response(null, { status: 204 }));
    await flushMicrotasks();
    expect(cs.getSyncSnapshot().status).toBe("idle");
  });

  it("retries on next mutation after a transient 5xx failure", async () => {
    const cs = await freshCloudSync();
    cs.setCloudUser("user-1");
    // First call: server is down. Second: it works.
    const fetchMock = vi
      .fn()
      // initial pushCreatePile — fails
      .mockResolvedValueOnce(new Response("nope", { status: 503 }))
      // first retry on next mutation: createPile succeeds
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      // then the second mutation itself
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    cs.pushCreatePile({
      id: "00000000-0000-4000-8000-000000000004",
      name: "Pile A",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      words: [],
    });
    await flushMicrotasks();
    // Transient failure: queue still has the op, status is `error`.
    let snap = cs.getSyncSnapshot();
    expect(snap.pendingCount).toBe(1);
    expect(snap.status).toBe("error");

    // Triggering another mutation kicks flushQueue again, which retries
    // the head op (now succeeding) and then sends the new op.
    cs.pushRenamePile("00000000-0000-4000-8000-000000000004", "Pile A renamed");
    await flushMicrotasks(20);

    snap = cs.getSyncSnapshot();
    expect(snap.pendingCount).toBe(0);
    expect(snap.unsyncedFailures).toBe(0);
    expect(snap.status).toBe("idle");
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
