import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";

interface DeliveryFailure {
  id: string;
  buyerEmail: string;
  kitId: string;
  purchaseId: string;
  error: string;
  createdAt: string;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [resendMsg, setResendMsg] = useState<Record<string, string>>({});

  const isOwner = !!getOwnerToken();

  const fetchFailures = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/kits/failures", { headers: ownerHeaders() });
      if (res.status === 401 || res.status === 403) {
        setError("Access denied — founder token required.");
        return;
      }
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = (await res.json()) as { failures: DeliveryFailure[] };
      setFailures(data.failures ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load failures");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFailures();
  }, [fetchFailures]);

  async function handleResend(failure: DeliveryFailure) {
    setResendingId(failure.id);
    try {
      const res = await fetch("/api/kits/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: failure.buyerEmail }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        sent?: boolean;
        mailStatus?: string;
        error?: string;
      };
      if (res.status === 429) {
        setResendMsg((prev) => ({
          ...prev,
          [failure.id]: "Rate limited — try again in 15 min",
        }));
        return;
      }
      if (data.ok && data.sent) {
        setResendMsg((prev) => ({
          ...prev,
          [failure.id]: data.mailStatus === "failed" ? "Send failed — check Gmail connector" : "Resent ✓",
        }));
      } else if (data.ok && !data.sent) {
        setResendMsg((prev) => ({
          ...prev,
          [failure.id]: "No active token found for this buyer",
        }));
      } else {
        setResendMsg((prev) => ({
          ...prev,
          [failure.id]: data.error ?? "Resend failed",
        }));
      }
    } catch {
      setResendMsg((prev) => ({ ...prev, [failure.id]: "Network error" }));
    } finally {
      setResendingId(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF9] to-[#F5F0E8] px-4 py-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-800 mb-1">Failed Deliveries</h1>
            <p className="text-stone-500 text-sm">
              Unresolved kit delivery failures — resend the email to the buyer in one click.
            </p>
          </div>
          <button
            onClick={() => void fetchFailures()}
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

        {/* Empty state */}
        {!loading && !error && failures.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">✅</p>
            <p className="font-medium text-stone-500">No unresolved failures</p>
            <p className="mt-1 text-stone-400 text-sm">
              All kit deliveries are accounted for.
            </p>
          </div>
        )}

        {/* Count badge */}
        {!loading && failures.length > 0 && (
          <div className="flex gap-3 mb-6 text-xs font-medium">
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
              {failures.length} unresolved {failures.length === 1 ? "failure" : "failures"}
            </span>
          </div>
        )}

        {/* Failure rows */}
        {failures.length > 0 && (
          <div className="flex flex-col gap-3">
            {failures.map((f) => (
              <FailureRow
                key={f.id}
                f={f}
                resendingId={resendingId}
                resendMsg={resendMsg}
                onResend={handleResend}
              />
            ))}
          </div>
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
  resendingId: string | null;
  resendMsg: Record<string, string>;
  onResend: (f: DeliveryFailure) => void;
}

function FailureRow({ f, resendingId, resendMsg, onResend }: FailureRowProps) {
  const isSending = resendingId === f.id;
  const msg = resendMsg[f.id];
  const succeeded = msg?.startsWith("Resent");

  return (
    <div className="bg-white border border-red-200 rounded-2xl p-4 shadow-sm">
      {/* Top row: email + kit */}
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

      {/* Error snippet */}
      <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
        <p className="text-xs text-red-700 font-mono break-all line-clamp-3">{f.error}</p>
      </div>

      {/* Purchase ID */}
      <p className="text-xs text-stone-400 mb-3">
        Purchase ID: <span className="font-mono text-stone-500">{f.purchaseId}</span>
      </p>

      {/* Resend button */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => void onResend(f)}
          disabled={isSending}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {isSending ? "Sending…" : "Resend delivery email"}
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
