import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { BG, SURFACE, SURFACE_2, BORDER, BORDER_STRONG, TEXT, TEXT_2, TEXT_3, AMBER, AMBER_LIGHT, AMBER_WASH, GREEN, RED, FONT_DISPLAY } from "@/lib/theme";

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
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: BG }}>
        <div className="max-w-sm w-full text-center">
          <p className="text-4xl mb-4">🔒</p>
          <h1 className="text-xl font-semibold mb-2" style={{ color: TEXT }}>Founder access required</h1>
          <p className="text-sm mb-6" style={{ color: TEXT_2 }}>
            Set your owner token in Settings to view delivery failures.
          </p>
          <Link
            href="/settings"
            className="inline-block text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            style={{ backgroundColor: AMBER }}
          >
            Go to Settings →
          </Link>
        </div>
      </div>
    );
  }

  const totalOpen = failures.length + attempts.length;

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: BG }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: TEXT, fontFamily: FONT_DISPLAY }}>Delivery Failures</h1>
            <p className="text-sm" style={{ color: TEXT_2 }}>
              Resend a kit or mark a buyer sorted — no terminal needed.
            </p>
          </div>
          <button
            onClick={() => void fetchAll()}
            disabled={loading}
            className="shrink-0 border text-xs font-medium px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
            style={{ backgroundColor: SURFACE_2, borderColor: BORDER, color: TEXT_2 }}
          >
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="border rounded-xl p-4 text-sm mb-6" style={{ backgroundColor: RED, color: "#FFF", borderColor: BORDER_STRONG }}>
            {error}
          </div>
        )}

        {/* All-clear */}
        {!loading && !error && totalOpen === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">✅</p>
            <p className="font-medium" style={{ color: TEXT_2 }}>No open issues</p>
            <p className="mt-1 text-sm" style={{ color: TEXT_3 }}>
              All kit deliveries and webhook retries are accounted for.
            </p>
          </div>
        )}

        {/* Count badges */}
        {!loading && (failures.length > 0 || attempts.length > 0) && (
          <div className="flex flex-wrap gap-3 mb-6 text-xs font-medium">
            {failures.length > 0 && (
              <span className="px-3 py-1 rounded-full" style={{ backgroundColor: RED, color: "#FFF" }}>
                {failures.length} unresolved {failures.length === 1 ? "failure" : "failures"}
              </span>
            )}
            {attempts.length > 0 && (
              <span className="px-3 py-1 rounded-full" style={{ backgroundColor: AMBER_WASH, color: AMBER }}>
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
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-1" style={{ color: AMBER }}>
              Uncommitted Deliveries
            </h2>
            <p className="text-xs mb-4" style={{ color: TEXT_3 }}>
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
        <div className="mt-12 pt-8 border-t" style={{ borderColor: BORDER }}>
          <Link href="/kits/purchases" className="text-sm transition-colors" style={{ color: TEXT_3 }}>
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
    <div className="border rounded-2xl p-4 shadow-sm" style={{ backgroundColor: SURFACE, borderColor: RED }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: TEXT }}>{f.buyerEmail}</p>
          <p className="text-xs mt-0.5" style={{ color: TEXT_3 }}>
            Kit: <span className="font-medium" style={{ color: TEXT_2 }}>{f.kitId}</span>
            {" · "}
            <span style={{ color: TEXT_3 }}>{formatDate(f.createdAt)}</span>
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: RED, color: "#FFF" }}>
          Failed
        </span>
      </div>

      {f.error && (
        <div className="border rounded-lg px-3 py-2 mb-3" style={{ backgroundColor: SURFACE_2, borderColor: BORDER }}>
          <p className="text-xs font-mono break-all line-clamp-3" style={{ color: RED }}>{f.error}</p>
        </div>
      )}

      <p className="text-xs mb-3" style={{ color: TEXT_3 }}>
        Purchase ID: <span className="font-mono" style={{ color: TEXT_2 }}>{f.purchaseId}</span>
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => void onRetrigger(f)}
          disabled={isActioning}
          className="text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          style={{ backgroundColor: RED }}
        >
          {isActioning ? "Working…" : "Resend delivery email"}
        </button>
        <button
          onClick={() => void onResolve(f)}
          disabled={isActioning}
          className="text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          style={{ backgroundColor: SURFACE_2, color: TEXT_2 }}
        >
          Mark resolved
        </button>
        {msg && (
          <span className={`text-xs font-medium ${succeeded ? "text-emerald-400" : "text-stone-400"}`}>
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
    <div className="border rounded-2xl p-4 shadow-sm" style={{ backgroundColor: SURFACE, borderColor: AMBER }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: TEXT }}>{a.buyerEmail}</p>
          <p className="text-xs mt-0.5" style={{ color: TEXT_3 }}>
            Kit: <span className="font-medium" style={{ color: TEXT_2 }}>{a.kitId}</span>
            {" · "}
            Last attempt: <span style={{ color: TEXT_3 }}>{formatDate(a.lastAttemptAt)}</span>
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: AMBER_WASH, color: AMBER }}>
          {a.attemptCount} {a.attemptCount === 1 ? "attempt" : "attempts"}
        </span>
      </div>

      <p className="text-xs mb-3" style={{ color: TEXT_3 }}>
        Event: <span className="font-mono break-all" style={{ color: TEXT_2 }}>{a.eventId}</span>
        {" · "}
        Purchase: <span className="font-mono" style={{ color: TEXT_2 }}>{a.purchaseId}</span>
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => void onResolve(a)}
          disabled={isActioning}
          className="text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          style={{ backgroundColor: AMBER }}
        >
          {isActioning ? "Working…" : "Mark buyer sorted"}
        </button>
        {msg && (
          <span className="text-xs font-medium" style={{ color: TEXT_3 }}>{msg}</span>
        )}
      </div>
    </div>
  );
}
