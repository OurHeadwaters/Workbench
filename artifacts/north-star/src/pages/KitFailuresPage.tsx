import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";

interface DeliveryFailure {
  id: string;
  buyerEmail: string;
  kitId: string;
  purchaseId: string;
  error: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

interface WebhookAttempt {
  eventId: string;
  kitId: string;
  buyerEmail: string;
  purchaseId: string;
  attemptCount: number;
  lastAttemptAt: string;
  resolvedAt: string | null;
}

function getOwnerToken(): string | null {
  try {
    return (
      window.localStorage.getItem("library.ownerToken") ||
      window.localStorage.getItem("ownerToken") ||
      null
    );
  } catch {
    return null;
  }
}

function ownerHeaders(): Record<string, string> {
  const token = getOwnerToken();
  if (!token) return {};
  return { "x-library-owner-token": token };
}

function jsonHeaders(): Record<string, string> {
  return { ...ownerHeaders(), "Content-Type": "application/json" };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function KitFailuresPage() {
  const [failures, setFailures] = useState<DeliveryFailure[]>([]);
  const [attempts, setAttempts] = useState<WebhookAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actioningId, setActioningId] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<Record<string, string>>({});

  const isOwner = !!getOwnerToken();

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [failRes, attRes] = await Promise.all([
        fetch("/api/admin/kit-failures", { headers: ownerHeaders() }),
        fetch("/api/admin/webhook-attempts", { headers: ownerHeaders() }),
      ]);

      if (failRes.status === 401 || failRes.status === 403) {
        setError("Access denied — founder token required.");
        return;
      }
      if (!failRes.ok) throw new Error(`Server error ${failRes.status} on failures`);
      if (!attRes.ok) throw new Error(`Server error ${attRes.status} on webhook attempts`);

      const failData = (await failRes.json()) as { failures: DeliveryFailure[] };
      const attData = (await attRes.json()) as { attempts: WebhookAttempt[] };

      setFailures(failData.failures ?? []);
      setAttempts(attData.attempts ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  async function handleRetrigger(f: DeliveryFailure) {
    setActioningId(f.id);
    try {
      const res = await fetch(`/api/admin/kit-failures/${f.id}`, {
        method: "PATCH",
        headers: jsonHeaders(),
        body: JSON.stringify({ retrigger: true }),
      });
      const data = (await res.json()) as {
        failure?: DeliveryFailure;
        redelivery?: { status: string; error?: string };
        error?: string;
      };
      if (!res.ok) {
        setActionMsg((prev) => ({ ...prev, [f.id]: data.error ?? `Error ${res.status}` }));
        return;
      }
      const status = data.redelivery?.status;
      if (status === "sent") {
        setActionMsg((prev) => ({ ...prev, [f.id]: "Resent ✓ — marked resolved" }));
        setFailures((prev) => prev.filter((x) => x.id !== f.id));
      } else if (status === "failed") {
        setActionMsg((prev) => ({ ...prev, [f.id]: `Send failed: ${data.redelivery?.error ?? "unknown"}` }));
      } else {
        setActionMsg((prev) => ({ ...prev, [f.id]: "Retrigger skipped — check registry" }));
      }
    } catch {
      setActionMsg((prev) => ({ ...prev, [f.id]: "Network error" }));
    } finally {
      setActioningId(null);
    }
  }

  async function handleResolve(f: DeliveryFailure) {
    setActioningId(f.id);
    try {
      const res = await fetch(`/api/admin/kit-failures/${f.id}`, {
        method: "PATCH",
        headers: jsonHeaders(),
        body: JSON.stringify({ resolve: true }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setActionMsg((prev) => ({ ...prev, [f.id]: data.error ?? `Error ${res.status}` }));
        return;
      }
      setFailures((prev) => prev.filter((x) => x.id !== f.id));
    } catch {
      setActionMsg((prev) => ({ ...prev, [f.id]: "Network error" }));
    } finally {
      setActioningId(null);
    }
  }

  async function handleResolveAttempt(a: WebhookAttempt) {
    setActioningId(a.eventId);
    try {
      const res = await fetch(`/api/admin/webhook-attempts/${encodeURIComponent(a.eventId)}`, {
        method: "PATCH",
        headers: jsonHeaders(),
        body: JSON.stringify({ resolve: true }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setActionMsg((prev) => ({ ...prev, [a.eventId]: data.error ?? `Error ${res.status}` }));
        return;
      }
      setAttempts((prev) => prev.filter((x) => x.eventId !== a.eventId));
    } catch {
      setActionMsg((prev) => ({ ...prev, [a.eventId]: "Network error" }));
    } finally {
      setActioningId(null);
    }
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAFAF9] to-[#F5F0E8] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <p className="text-4xl mb-4">🔒</p>
          <h1 className="text-xl font-semibold text-stone-800 mb-2">Founder access required</h1>
          <p className="text-stone-500 text-sm mb-6">
            Set your owner token in Settings to view delivery failures.
          </p>
          <Link
            href="/settings"
            className="inline-block bg-stone-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-stone-700 transition-colors"
          >
            Go to Settings →
          </Link>
        </div>
      </div>
    );
  }

  const totalOpen = failures.length + attempts.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF9] to-[#F5F0E8] px-4 py-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-800 mb-1">Delivery Failures</h1>
            <p className="text-stone-500 text-sm">
              Resend a kit or mark a buyer sorted — no terminal needed.
            </p>
          </div>
          <button
            onClick={() => void fetchAll()}
            disabled={loading}
            className="shrink-0 bg-white border border-stone-200 text-stone-600 text-xs font-medium px-3 py-2 rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-50"
          >
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm mb-6">
            {error}
          </div>
        )}

        {/* All-clear */}
        {!loading && !error && totalOpen === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">✅</p>
            <p className="font-medium text-stone-500">No open issues</p>
            <p className="mt-1 text-stone-400 text-sm">
              All kit deliveries and webhook retries are accounted for.
            </p>
          </div>
        )}

        {/* Count badges */}
        {!loading && (failures.length > 0 || attempts.length > 0) && (
          <div className="flex flex-wrap gap-3 mb-6 text-xs font-medium">
            {failures.length > 0 && (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                {failures.length} unresolved {failures.length === 1 ? "failure" : "failures"}
              </span>
            )}
            {attempts.length > 0 && (
              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                {attempts.length} uncommitted {attempts.length === 1 ? "delivery" : "deliveries"}
              </span>
            )}
          </div>
        )}

        {/* ── Section 1: Delivery failures ──────────────────────────────────── */}
        {failures.length > 0 && (
          <div className="flex flex-col gap-3 mb-10">
            {failures.map((f) => (
              <FailureRow
                key={f.id}
                f={f}
                actioningId={actioningId}
                actionMsg={actionMsg}
                onRetrigger={handleRetrigger}
                onResolve={handleResolve}
              />
            ))}
          </div>
        )}

        {/* ── Section 2: Uncommitted Deliveries ────────────────────────────────────── */}
        {attempts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-1">
              Uncommitted Deliveries
            </h2>
            <p className="text-xs text-stone-400 mb-4">
              Stripe sent a webhook for these purchases but the access token was never committed — the buyer paid but has no access link. Once you&apos;ve confirmed the buyer has been sorted, mark them cleared here.
            </p>

            <div className="flex flex-col gap-3">
              {attempts.map((a) => (
                <AttemptRow
                  key={a.eventId}
                  a={a}
                  actioningId={actioningId}
                  actionMsg={actionMsg}
                  onResolve={handleResolveAttempt}
                />
              ))}
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <Link href="/kits/purchases" className="text-stone-400 hover:text-stone-600 text-sm transition-colors">
            ← Back to Purchases
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── FailureRow ────────────────────────────────────────────────────────────────

interface FailureRowProps {
  f: DeliveryFailure;
  actioningId: string | null;
  actionMsg: Record<string, string>;
  onRetrigger: (f: DeliveryFailure) => void;
  onResolve: (f: DeliveryFailure) => void;
}

function FailureRow({ f, actioningId, actionMsg, onRetrigger, onResolve }: FailureRowProps) {
  const isActioning = actioningId === f.id;
  const msg = actionMsg[f.id];
  const succeeded = msg?.includes("✓");

  return (
    <div className="bg-white border border-red-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-stone-800 truncate">{f.buyerEmail}</p>
          <p className="text-xs text-stone-400 mt-0.5">
            Kit: <span className="text-stone-600 font-medium">{f.kitId}</span>
            {" · "}
            <span className="text-stone-400">{formatDate(f.createdAt)}</span>
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">
          Failed
        </span>
      </div>

      {f.error && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
          <p className="text-xs text-red-700 font-mono break-all line-clamp-3">{f.error}</p>
        </div>
      )}

      <p className="text-xs text-stone-400 mb-3">
        Purchase ID: <span className="font-mono text-stone-500">{f.purchaseId}</span>
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => void onRetrigger(f)}
          disabled={isActioning}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {isActioning ? "Working…" : "Resend delivery email"}
        </button>
        <button
          onClick={() => void onResolve(f)}
          disabled={isActioning}
          className="bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          Mark resolved
        </button>
        {msg && (
          <span className={`text-xs font-medium ${succeeded ? "text-emerald-600" : "text-stone-400"}`}>
            {msg}
          </span>
        )}
      </div>
    </div>
  );
}

// ── AttemptRow ────────────────────────────────────────────────────────────────

interface AttemptRowProps {
  a: WebhookAttempt;
  actioningId: string | null;
  actionMsg: Record<string, string>;
  onResolve: (a: WebhookAttempt) => void;
}

function AttemptRow({ a, actioningId, actionMsg, onResolve }: AttemptRowProps) {
  const isActioning = actioningId === a.eventId;
  const msg = actionMsg[a.eventId];

  return (
    <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-stone-800 truncate">{a.buyerEmail}</p>
          <p className="text-xs text-stone-400 mt-0.5">
            Kit: <span className="text-stone-600 font-medium">{a.kitId}</span>
            {" · "}
            Last attempt: <span className="text-stone-500">{formatDate(a.lastAttemptAt)}</span>
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
          {a.attemptCount} {a.attemptCount === 1 ? "attempt" : "attempts"}
        </span>
      </div>

      <p className="text-xs text-stone-400 mb-3">
        Event: <span className="font-mono text-stone-500 break-all">{a.eventId}</span>
        {" · "}
        Purchase: <span className="font-mono text-stone-500">{a.purchaseId}</span>
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => void onResolve(a)}
          disabled={isActioning}
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {isActioning ? "Working…" : "Mark buyer sorted"}
        </button>
        {msg && (
          <span className="text-xs font-medium text-stone-400">{msg}</span>
        )}
      </div>
    </div>
  );
}
