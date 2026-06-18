import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";

interface BuyerToken {
  token: string;
  kitId: string;
  buyerEmail: string;
  buyerName: string;
  purchaseId: string;
  createdAt: string;
  expiresAt: string;
  expired: boolean;
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
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function accessUrl(token: string): string {
  const base = window.location.origin;
  return `${base}/sandbox/kits/access/${token}`;
}

export function KitPurchasesPage() {
  const [tokens, setTokens] = useState<BuyerToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [extendingToken, setExtendingToken] = useState<string | null>(null);
  const [extendMsg, setExtendMsg] = useState<Record<string, string>>({});
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const isOwner = !!getOwnerToken();

  const fetchTokens = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/kits/tokens", { headers: ownerHeaders() });
      if (res.status === 401 || res.status === 403) {
        setError("Access denied — founder token required.");
        return;
      }
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = (await res.json()) as { tokens: BuyerToken[] };
      setTokens(data.tokens ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load purchases");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTokens();
  }, [fetchTokens]);

  async function handleExtend(token: string) {
    setExtendingToken(token);
    try {
      const res = await fetch(`/api/kits/token/${token}/extend`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...ownerHeaders() },
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        newExpiresAt?: string;
      };
      if (data.ok && data.newExpiresAt) {
        const newExpiry = formatDate(data.newExpiresAt);
        setExtendMsg((prev) => ({ ...prev, [token]: `Extended to ${newExpiry}` }));
        setTokens((prev) =>
          prev.map((t) =>
            t.token === token
              ? { ...t, expiresAt: data.newExpiresAt!, expired: false }
              : t,
          ),
        );
      } else {
        setExtendMsg((prev) => ({
          ...prev,
          [token]: data.error ?? "Failed to extend",
        }));
      }
    } catch {
      setExtendMsg((prev) => ({ ...prev, [token]: "Network error" }));
    } finally {
      setExtendingToken(null);
    }
  }

  async function handleCopyLink(token: string) {
    try {
      await navigator.clipboard.writeText(accessUrl(token));
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch {
      // fallback: select text
    }
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAFAF9] to-[#F5F0E8] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <p className="text-4xl mb-4">🔒</p>
          <h1 className="text-xl font-semibold text-stone-800 mb-2">Founder access required</h1>
          <p className="text-stone-500 text-sm mb-6">
            Set your owner token in Settings to view kit purchases.
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

  const activeTokens = tokens.filter((t) => !t.expired);
  const expiredTokens = tokens.filter((t) => t.expired);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF9] to-[#F5F0E8] px-4 py-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-800 mb-1">Kit Purchases</h1>
            <p className="text-stone-500 text-sm">
              All buyer access links — copy, extend, or spot failed deliveries.
            </p>
          </div>
          <button
            onClick={() => void fetchTokens()}
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
        {!loading && !error && tokens.length === 0 && (
          <div className="text-center py-20 text-stone-400 text-sm">
            <p className="text-4xl mb-4">🧾</p>
            <p className="font-medium text-stone-500">No purchases yet</p>
            <p className="mt-1 text-stone-400">
              Tokens will appear here as buyers complete checkout.
            </p>
          </div>
        )}

        {/* Summary badges */}
        {!loading && tokens.length > 0 && (
          <div className="flex gap-3 mb-6 text-xs font-medium">
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
              {activeTokens.length} active
            </span>
            {expiredTokens.length > 0 && (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                {expiredTokens.length} expired
              </span>
            )}
          </div>
        )}

        {/* Expired section — shown first so they're easy to act on */}
        {expiredTokens.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-3">
              Expired — needs action
            </h2>
            <div className="flex flex-col gap-3">
              {expiredTokens.map((t) => (
                <PurchaseRow
                  key={t.token}
                  t={t}
                  extendingToken={extendingToken}
                  extendMsg={extendMsg}
                  copiedToken={copiedToken}
                  onExtend={handleExtend}
                  onCopyLink={handleCopyLink}
                />
              ))}
            </div>
          </section>
        )}

        {/* Active section */}
        {activeTokens.length > 0 && (
          <section>
            {expiredTokens.length > 0 && (
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">
                Active
              </h2>
            )}
            <div className="flex flex-col gap-3">
              {activeTokens.map((t) => (
                <PurchaseRow
                  key={t.token}
                  t={t}
                  extendingToken={extendingToken}
                  extendMsg={extendMsg}
                  copiedToken={copiedToken}
                  onExtend={handleExtend}
                  onCopyLink={handleCopyLink}
                />
              ))}
            </div>
          </section>
        )}

        {/* Back link + failures link */}
        <div className="mt-12 pt-8 border-t border-stone-200 flex items-center justify-between">
          <Link href="/kits" className="text-stone-400 hover:text-stone-600 text-sm transition-colors">
            ← Back to Kits
          </Link>
          <Link
            href="/kits/failures"
            className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            View failed deliveries →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── PurchaseRow ───────────────────────────────────────────────────────────────

interface PurchaseRowProps {
  t: BuyerToken;
  extendingToken: string | null;
  extendMsg: Record<string, string>;
  copiedToken: string | null;
  onExtend: (token: string) => void;
  onCopyLink: (token: string) => void;
}

function PurchaseRow({
  t,
  extendingToken,
  extendMsg,
  copiedToken,
  onExtend,
  onCopyLink,
}: PurchaseRowProps) {
  const isExtending = extendingToken === t.token;
  const isCopied = copiedToken === t.token;
  const msg = extendMsg[t.token];

  return (
    <div
      className={`bg-white border rounded-2xl p-4 shadow-sm ${
        t.expired ? "border-red-200" : "border-stone-200"
      }`}
    >
      {/* Top row: name + status badge */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-stone-800 truncate">{t.buyerName}</p>
          <p className="text-xs text-stone-400 truncate">{t.buyerEmail}</p>
        </div>
        <span
          className={`shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            t.expired
              ? "bg-red-100 text-red-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {t.expired ? "Expired" : "Active"}
        </span>
      </div>

      {/* Meta row: kit, purchased, expiry */}
      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-stone-400 mb-3">
        <span>
          Kit: <span className="text-stone-600 font-medium">{t.kitId}</span>
        </span>
        <span>Purchased {formatDate(t.createdAt)}</span>
        <span className={t.expired ? "text-red-500 font-medium" : ""}>
          {t.expired ? "Expired" : "Expires"} {formatDate(t.expiresAt)}
        </span>
      </div>

      {/* Action row: copy link + extend */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => void onCopyLink(t.token)}
          className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          {isCopied ? (
            <>
              <span>✓</span>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <span>🔗</span>
              <span>Copy access link</span>
            </>
          )}
        </button>

        <button
          onClick={() => void onExtend(t.token)}
          disabled={isExtending}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
            t.expired
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-stone-800 hover:bg-stone-700 text-white"
          }`}
        >
          {isExtending ? "Extending…" : "Extend 90 days"}
        </button>

        {msg && (
          <span className="text-xs text-stone-400">{msg}</span>
        )}
      </div>
    </div>
  );
}
