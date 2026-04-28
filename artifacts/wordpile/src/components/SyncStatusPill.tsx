import { useSyncExternalStore } from "react";
import { Cloud, CloudOff, Loader2, AlertTriangle } from "lucide-react";
import {
  getSyncSnapshot,
  retryNow,
  subscribeSyncStatus,
  type SyncSnapshot,
} from "@/lib/cloudSync";

// Subscribes to the cloudSync sync-status snapshot. The third argument
// (server snapshot) matches the client snapshot — there's no SSR for this
// app, but useSyncExternalStore still wants a stable function to call.
function useSyncSnapshot(): SyncSnapshot {
  return useSyncExternalStore(
    subscribeSyncStatus,
    getSyncSnapshot,
    getSyncSnapshot,
  );
}

interface PillView {
  label: string;
  title: string;
  Icon: typeof Cloud;
  spin: boolean;
}

function describe(snap: SyncSnapshot): PillView {
  const { status, pendingCount, unsyncedFailures, lastSyncedAt } = snap;
  if (status === "saving") {
    return {
      label: "Saving…",
      title: "Sending your latest changes to your account.",
      Icon: Loader2,
      spin: true,
    };
  }
  if (status === "offline") {
    const noun = pendingCount === 1 ? "change" : "changes";
    return {
      label: "Offline — saved on this device",
      title: `${pendingCount} ${noun} will sync to your account when you're back online.`,
      Icon: CloudOff,
      spin: false,
    };
  }
  if (status === "error") {
    // Two distinct error subkinds. If the queue still has work, it's a
    // transient error and we'll retry on the next mutation / online event.
    // If the queue has drained and we still have failures, those changes
    // are NOT going to retry — they need a refresh / re-sync to recover.
    if (pendingCount > 0) {
      const noun = pendingCount === 1 ? "change" : "changes";
      return {
        label: "Sync paused — will retry",
        title: `${pendingCount} ${noun} couldn't reach the server. We'll retry on your next change or when the network recovers.`,
        Icon: AlertTriangle,
        spin: false,
      };
    }
    const noun = unsyncedFailures === 1 ? "change" : "changes";
    return {
      label: "Some changes didn't save",
      title: `${unsyncedFailures} ${noun} were rejected by the server and won't retry on their own. Refresh the page or sign out and back in to reconcile.`,
      Icon: AlertTriangle,
      spin: false,
    };
  }
  return {
    label: "Synced",
    title: lastSyncedAt
      ? `All changes are saved to your account. Last sync ${formatRelative(lastSyncedAt)}.`
      : "Your changes are saved to your account.",
    Icon: Cloud,
    spin: false,
  };
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 5_000) return "just now";
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function SyncStatusPill() {
  const snap = useSyncSnapshot();
  const view = describe(snap);
  const Icon = view.Icon;
  // Errored / offline states get a warmer, more prominent ink colour so the
  // user actually notices. The default "Synced" / "Saving…" states stay in
  // the muted stone tone the rest of the bar uses.
  const tone =
    snap.status === "offline" || snap.status === "error"
      ? "var(--color-ink)"
      : "var(--color-stone)";

  // The pill becomes a "Retry now" button only when retrying could
  // actually accomplish something: the queue has work and we're either
  // offline or in a transient error. The sticky-error subcase
  // (pendingCount === 0, unsyncedFailures > 0) deliberately stays
  // non-interactive because flushQueue can't recover those — its own
  // copy is `Refresh the page or sign out and back in to reconcile`.
  const canRetry =
    snap.pendingCount > 0 &&
    (snap.status === "offline" || snap.status === "error");

  if (canRetry) {
    return (
      <button
        type="button"
        onClick={() => {
          void retryNow();
        }}
        className="inline-flex items-center gap-2 text-sm rounded px-1 -mx-1 cursor-pointer hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{ color: tone }}
        data-testid="button-sync-retry"
        data-sync-status={snap.status}
        title={`${view.title} Click to retry now.`}
      >
        <Icon
          size={14}
          strokeWidth={1.6}
          className={view.spin ? "animate-spin" : undefined}
          aria-hidden
        />
        <span className="hidden sm:inline">{view.label} · Retry now</span>
        <span className="sr-only sm:hidden">{view.label}, retry now</span>
      </button>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-2 text-sm"
      style={{ color: tone }}
      data-testid="text-sync-status"
      data-sync-status={snap.status}
      title={view.title}
    >
      <Icon
        size={14}
        strokeWidth={1.6}
        className={view.spin ? "animate-spin" : undefined}
        aria-hidden
      />
      <span className="hidden sm:inline">{view.label}</span>
    </span>
  );
}
