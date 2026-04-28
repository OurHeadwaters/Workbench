// Local save-status snapshot for the chrome's SyncStatusPill. Mirrors the
// shape of `artifacts/wordpile/src/lib/cloudSync.ts` so the UI reads the
// same way and a future cloud-sync wrapper can replace this module
// without UI churn.
import NetInfo from "@react-native-community/netinfo";

export type SyncStatus = "idle" | "saving" | "error" | "offline";

// A named failed write the UI can name and offer a one-tap retry for.
// Re-using the same id replaces the prior entry.
export interface FailedOp {
  id: string;
  label: string;
  retry: () => Promise<void>;
  failedAt: number;
}

// A sustained-failure notice for writes that fire too often to deserve a
// per-action retry banner (e.g. last-read scroll position). Surfaced only
// after the streak crosses a threshold and stays put until either a
// successful write resets it or the user dismisses it.
export interface AmbientNotice {
  id: string;
  message: string;
  surfacedAt: number;
}

export interface SyncSnapshot {
  status: SyncStatus;
  pendingCount: number;
  unsyncedFailures: number;
  lastSyncedAt: number | null;
  lastErrorAt: number | null;
  failedOps: readonly FailedOp[];
  ambientNotices: readonly AmbientNotice[];
}

let inFlight = 0;
let lastSyncedAt: number | null = null;
let lastErrorAt: number | null = null;
let unsyncedFailures = 0;
let online = true;
const failedOps = new Map<string, FailedOp>();

// Per-id consecutive-failure counters for ambient writes. A counter is
// reset whenever the same id reports a success.
const ambientStreaks = new Map<string, number>();
// Notices currently surfaced to the UI.
const ambientNotices = new Map<string, AmbientNotice>();
// Ids the user has explicitly dismissed; we suppress re-surfacing for the
// same id until either a success resets the streak or the streak counter
// is cleared, so we don't keep nagging on every subsequent failure.
const ambientDismissed = new Set<string>();

const listeners = new Set<() => void>();
let cached: SyncSnapshot = compute();

function compute(): SyncSnapshot {
  const failures = Math.max(unsyncedFailures, failedOps.size);
  let status: SyncStatus = "idle";
  if (inFlight > 0) {
    // Match the web pill: "offline" only when there is unsynced work
    // we couldn't push, otherwise stay idle even when the device is
    // disconnected.
    status = !online ? "offline" : "saving";
  } else if (failures > 0) {
    status = !online ? "offline" : "error";
  }
  return Object.freeze({
    status,
    pendingCount: inFlight,
    unsyncedFailures: failures,
    lastSyncedAt,
    lastErrorAt,
    failedOps: Object.freeze(Array.from(failedOps.values())),
    ambientNotices: Object.freeze(Array.from(ambientNotices.values())),
  });
}

function refresh() {
  cached = compute();
  for (const l of listeners) l();
}

export function getSyncSnapshot(): SyncSnapshot {
  return cached;
}

export function subscribeSyncStatus(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Wraps a persistence promise so the snapshot reflects its progress.
// Re-throws so callers can still handle the failure inline.
export async function trackSave<T>(p: Promise<T>): Promise<T> {
  inFlight += 1;
  refresh();
  try {
    const v = await p;
    lastSyncedAt = Date.now();
    if (unsyncedFailures > 0) unsyncedFailures = 0;
    return v;
  } catch (err) {
    unsyncedFailures += 1;
    lastErrorAt = Date.now();
    throw err;
  } finally {
    inFlight -= 1;
    refresh();
  }
}

// Records (or replaces) a named failed op. Delete-then-set keeps Map
// insertion order aligned with recency so consumers can pick the latest
// failure off the end.
export function recordFailure(op: Omit<FailedOp, "failedAt">): void {
  failedOps.delete(op.id);
  failedOps.set(op.id, { ...op, failedAt: Date.now() });
  lastErrorAt = Date.now();
  refresh();
}

export function clearFailure(id: string): boolean {
  const removed = failedOps.delete(id);
  if (removed) refresh();
  return removed;
}

const DEFAULT_AMBIENT_THRESHOLD = 3;

// Bumps the consecutive-failure streak for an ambient write. Once the
// streak crosses `threshold` (default 3) and the user hasn't already
// dismissed the notice for this id, surfaces a single calm notice. Does
// not surface anything before the threshold or while dismissed.
export function recordAmbientFailure(opts: {
  id: string;
  message: string;
  threshold?: number;
}): void {
  const threshold = opts.threshold ?? DEFAULT_AMBIENT_THRESHOLD;
  const next = (ambientStreaks.get(opts.id) ?? 0) + 1;
  ambientStreaks.set(opts.id, next);
  if (
    next >= threshold &&
    !ambientDismissed.has(opts.id) &&
    !ambientNotices.has(opts.id)
  ) {
    ambientNotices.set(opts.id, {
      id: opts.id,
      message: opts.message,
      surfacedAt: Date.now(),
    });
    refresh();
  }
}

// Resets the streak and clears any surfaced notice for this id, including
// the dismissal flag so the notice can re-appear if a fresh streak builds.
// Call from the success path of an ambient write.
export function clearAmbientFailure(id: string): void {
  let changed = false;
  if (ambientStreaks.delete(id)) changed = true;
  if (ambientNotices.delete(id)) changed = true;
  if (ambientDismissed.delete(id)) changed = true;
  if (changed) refresh();
}

// Hides the surfaced notice without touching the streak counter, so we
// don't immediately re-surface on the next failure. A successful write
// (via clearAmbientFailure) is what brings the notice back into play.
export function dismissAmbientNotice(id: string): void {
  let changed = false;
  if (ambientNotices.delete(id)) changed = true;
  if (!ambientDismissed.has(id)) {
    ambientDismissed.add(id);
    changed = true;
  }
  if (changed) refresh();
}

let networkUnsub: (() => void) | null = null;

// Idempotent NetInfo subscription. On web, NetInfo uses navigator.onLine
// plus the window online/offline events.
export function initNetworkWatcher(): () => void {
  if (networkUnsub) return networkUnsub;
  const unsubscribe = NetInfo.addEventListener((state) => {
    const next = state.isConnected !== false;
    if (next !== online) {
      online = next;
      refresh();
    }
  });
  void NetInfo.fetch().then((state) => {
    const next = state.isConnected !== false;
    if (next !== online) {
      online = next;
      refresh();
    }
  });
  networkUnsub = () => {
    networkUnsub = null;
    unsubscribe();
  };
  return networkUnsub;
}
