// Local save-status snapshot for the chrome's SyncStatusPill. Mirrors the
// shape of `artifacts/wordpile/src/lib/cloudSync.ts` so the UI reads the
// same way and a future cloud-sync wrapper can replace this module
// without UI churn.
import NetInfo from "@react-native-community/netinfo";

export type SyncStatus = "idle" | "saving" | "error" | "offline";

export interface SyncSnapshot {
  status: SyncStatus;
  pendingCount: number;
  unsyncedFailures: number;
  lastSyncedAt: number | null;
  lastErrorAt: number | null;
}

let inFlight = 0;
let lastSyncedAt: number | null = null;
let lastErrorAt: number | null = null;
let unsyncedFailures = 0;
let online = true;

const listeners = new Set<() => void>();
let cached: SyncSnapshot = compute();

function compute(): SyncSnapshot {
  let status: SyncStatus = "idle";
  if (inFlight > 0) {
    // Match the web pill: "offline" only when there is unsynced work
    // we couldn't push, otherwise stay idle even when the device is
    // disconnected.
    status = !online ? "offline" : "saving";
  } else if (unsyncedFailures > 0) {
    status = !online ? "offline" : "error";
  }
  return Object.freeze({
    status,
    pendingCount: inFlight,
    unsyncedFailures,
    lastSyncedAt,
    lastErrorAt,
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
