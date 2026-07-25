import { useState, useEffect } from "react";
import { Link } from "wouter";
import { BG, SURFACE, SURFACE_2, BORDER, BORDER_STRONG, TEXT, TEXT_2, TEXT_3, AMBER, AMBER_LIGHT, AMBER_WASH, GREEN, RED, FONT_DISPLAY } from "@/lib/theme";

interface Kit {
  id: string;
  title: string;
  description: string | null;
  priceCents: number;
  status: string;
  stripeCheckoutUrl: string | null;
  codetryResult: {
    passed: boolean;
    flags: Array<{ category: string; flag: string; reason: string }>;
    summary: string;
  } | null;
  createdAt: string;
}

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

function formatPrice(cents: number): string {
  if (cents === 0) return "Free";
  return `$${(cents / 100).toFixed(2)} CAD`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function KitsPage() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [allKits, setAllKits] = useState<Kit[]>([]);
  const [tokens, setTokens] = useState<BuyerToken[]>([]);
  const [failureCount, setFailureCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [publishMsg, setPublishMsg] = useState<Record<string, string>>({});
  const [extendingToken, setExtendingToken] = useState<string | null>(null);
  const [extendMsg, setExtendMsg] = useState<Record<string, string>>({});

  const isOwner = !!getOwnerToken();

  function ownerHeaders(): Record<string, string> {
    const token = getOwnerToken();
    if (!token) return {};
    return { "x-library-owner-token": token };
  }

  async function fetchKits() {
    setLoading(true);
    setAuthError(false);
    try {
      const [pubRes, draftRes, tokensRes, failuresRes] = await Promise.all([
        fetch("/api/kits/list"),
        isOwner ? fetch("/api/kits/drafts", { headers: ownerHeaders() }) : Promise.resolve(null),
        isOwner ? fetch("/api/kits/tokens", { headers: ownerHeaders() }) : Promise.resolve(null),
        isOwner ? fetch("/api/kits/failures", { headers: ownerHeaders() }) : Promise.resolve(null),
      ]);

      if (!pubRes.ok) throw new Error("Failed to load published kits");
      const pubData = (await pubRes.json()) as { kits: Kit[] };
      setKits(pubData.kits ?? []);

      const ownerRes = [draftRes, tokensRes, failuresRes].find((r) => r?.status === 401);
      if (ownerRes) {
        setAuthError(true);
        return;
      }

      if (draftRes?.ok) {
        const draftData = (await draftRes.json()) as { kits: Kit[] };
        setAllKits(draftData.kits ?? []);
      }

      if (tokensRes?.ok) {
        const tokensData = (await tokensRes.json()) as { tokens: BuyerToken[] };
        setTokens(tokensData.tokens ?? []);
      }

      if (failuresRes?.ok) {
        const failuresData = (await failuresRes.json()) as { failures: unknown[] };
        setFailureCount(failuresData.failures?.length ?? 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load kits");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchKits();
  }, []);

  async function handlePublish(id: string) {
    setPublishingId(id);
    try {
      const res = await fetch(`/api/kits/${id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...ownerHeaders() },
      });
      if (res.status === 401) {
        setPublishMsg((prev) => ({ ...prev, [id]: "Not authorised — owner token required" }));
        return;
      }
      const data = (await res.json()) as { ok?: boolean; error?: string; kit?: Kit };
      if (data.ok) {
        setPublishMsg((prev) => ({ ...prev, [id]: "Published!" }));
        void fetchKits();
      } else {
        setPublishMsg((prev) => ({ ...prev, [id]: data.error ?? "Failed to publish" }));
      }
    } catch {
      setPublishMsg((prev) => ({ ...prev, [id]: "Network error" }));
    } finally {
      setPublishingId(null);
    }
  }

  async function handleExtend(token: string) {
    setExtendingToken(token);
    try {
      const res = await fetch(`/api/kits/token/${token}/extend`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...ownerHeaders() },
      });
      if (res.status === 401) {
        setExtendMsg((prev) => ({ ...prev, [token]: "Not authorised — owner token required" }));
        return;
      }
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
        setExtendMsg((prev) => ({ ...prev, [token]: data.error ?? "Failed to extend" }));
      }
    } catch {
      setExtendMsg((prev) => ({ ...prev, [token]: "Network error" }));
    } finally {
      setExtendingToken(null);
    }
  }

  const drafts = allKits.filter((k) => k.status === "draft");
  const expiredTokens = tokens.filter((t) => t.expired);
  const activeTokens = tokens.filter((t) => !t.expired);

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: BG }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: TEXT, fontFamily: FONT_DISPLAY }}>Headwaters Kits</h1>
        <p className="mb-8 text-sm" style={{ color: TEXT_2 }}>
          Tools, frameworks, and field guides for community sovereignty.
        </p>

        {loading && (
          <div className="text-sm" style={{ color: TEXT_3 }}>Loading kits…</div>
        )}
        {authError && (
          <div className="border rounded-xl p-4 text-sm mb-6" style={{ backgroundColor: "rgba(220,38,38,0.08)", borderColor: BORDER_STRONG, color: TEXT }}>
            <span className="font-medium">Not authorised</span> — the owner token was rejected. Verify the token stored under <code>ownerToken</code> in your browser and reload.
          </div>
        )}
        {error && (
          <div className="border rounded-xl p-4 text-sm mb-6" style={{ backgroundColor: RED, color: "#FFF", borderColor: BORDER_STRONG }}>
            {error}
          </div>
        )}

        {/* Owner: Draft kits */}
        {isOwner && drafts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: TEXT_2 }}>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: AMBER_WASH, color: AMBER }}>
                Drafts
              </span>
            </h2>
            <div className="flex flex-col gap-4">
              {drafts.map((kit) => (
                <div
                  key={kit.id}
                  className="border rounded-2xl p-5 shadow-sm"
                  style={{ backgroundColor: SURFACE, borderColor: AMBER }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg" style={{ color: TEXT }}>{kit.title}</h3>
                      {kit.description && (
                        <p className="text-sm mt-1" style={{ color: TEXT_2 }}>{kit.description}</p>
                      )}
                      <p className="text-xs mt-2" style={{ color: TEXT_3 }}>
                        {formatPrice(kit.priceCents)}
                      </p>
                      {kit.codetryResult && (
                        <p className="text-xs mt-2">
                          <span style={{ color: kit.codetryResult.passed ? GREEN : AMBER }}>
                            {kit.codetryResult.passed ? "✓ Codetry passed" : "⚠ Codetry flags"}{" "}
                          </span>
                          <span style={{ color: TEXT_3 }}>— {kit.codetryResult.summary}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <button
                        onClick={() => void handlePublish(kit.id)}
                        disabled={publishingId === kit.id}
                        className="text-white text-xs font-semibold px-4 py-2 rounded-xl disabled:opacity-50 transition-colors"
                        style={{ backgroundColor: AMBER }}
                      >
                        {publishingId === kit.id ? "Publishing…" : "Publish →"}
                      </button>
                      {publishMsg[kit.id] && (
                        <span className="text-xs" style={{ color: TEXT_3 }}>{publishMsg[kit.id]}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Owner: link to dedicated purchases page + failures badge */}
        {isOwner && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Link
              href="/kits/purchases"
              className="inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              style={{ backgroundColor: SURFACE_2, border: `1px solid ${BORDER}` }}
            >
              🧾 View all purchases &amp; access links →
            </Link>
            <Link
              href="/kits/failures"
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              style={{ 
                backgroundColor: failureCount > 0 ? RED : SURFACE_2,
                color: failureCount > 0 ? "#FFF" : TEXT_2,
                border: `1px solid ${failureCount > 0 ? RED : BORDER}`
              }}
            >
              ⚠ Failed deliveries
              {failureCount > 0 && (
                <span className="bg-white text-red-600 text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {failureCount}
                </span>
              )}
            </Link>
          </div>
        )}

        {/* Owner: Buyer tokens */}
        {isOwner && tokens.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: TEXT_2 }}>
              Buyer Access Links
              {expiredTokens.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: RED, color: "#FFF" }}>
                  {expiredTokens.length} expired
                </span>
              )}
            </h2>

            {/* Expired tokens — shown first so they're easy to act on */}
            {expiredTokens.length > 0 && (
              <div className="flex flex-col gap-3 mb-4">
                {expiredTokens.map((t) => (
                  <TokenRow
                    key={t.token}
                    t={t}
                    extendingToken={extendingToken}
                    extendMsg={extendMsg}
                    onExtend={handleExtend}
                  />
                ))}
              </div>
            )}

            {/* Active tokens */}
            {activeTokens.length > 0 && (
              <div className="flex flex-col gap-3">
                {expiredTokens.length > 0 && (
                  <p className="text-xs font-medium uppercase tracking-wide mt-2 mb-1" style={{ color: TEXT_3 }}>
                    Active
                  </p>
                )}
                {activeTokens.map((t) => (
                  <TokenRow
                    key={t.token}
                    t={t}
                    extendingToken={extendingToken}
                    extendMsg={extendMsg}
                    onExtend={handleExtend}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Published kits */}
        <section>
          {kits.length > 0 && (
            <h2 className="text-lg font-semibold mb-4" style={{ color: TEXT_2 }}>Published Kits</h2>
          )}
          {!loading && kits.length === 0 && (
            <div className="text-center py-16 text-sm" style={{ color: TEXT_3 }}>
              <p className="text-4xl mb-4">📦</p>
              <p>No published kits yet.</p>
              {isOwner && (
                <p className="mt-2">
                  Open Gord and tap "＋ Add a Kit" to create your first kit.
                </p>
              )}
            </div>
          )}
          <div className="flex flex-col gap-4">
            {kits.map((kit) => (
              <div
                key={kit.id}
                className="border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                style={{ backgroundColor: SURFACE, borderColor: BORDER }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg" style={{ color: TEXT }}>{kit.title}</h3>
                    {kit.description && (
                      <p className="text-sm mt-1" style={{ color: TEXT_2 }}>{kit.description}</p>
                    )}
                    <p className="font-medium text-sm mt-2" style={{ color: GREEN }}>
                      {formatPrice(kit.priceCents)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {kit.stripeCheckoutUrl ? (
                      <a
                        href={kit.stripeCheckoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
                        style={{ backgroundColor: AMBER }}
                      >
                        Get Kit →
                      </a>
                    ) : (
                      <span className="text-xs px-3 py-1.5 rounded-xl" style={{ backgroundColor: SURFACE_2, color: TEXT_2 }}>
                        Contact to access
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Practitioner link */}
        <div className="mt-12 border-t pt-8 text-center" style={{ borderColor: BORDER }}>
          <p className="text-sm" style={{ color: TEXT_3 }}>
            Want to run your own version of these kits in your community?{" "}
            <a
              href="/north-star/apply-practitioner"
              className="underline"
              style={{ color: GREEN }}
            >
              Apply to become a practitioner →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── TokenRow ──────────────────────────────────────────────────────────────────

interface TokenRowProps {
  t: BuyerToken;
  extendingToken: string | null;
  extendMsg: Record<string, string>;
  onExtend: (token: string) => void;
}

function TokenRow({ t, extendingToken, extendMsg, onExtend }: TokenRowProps) {
  const isExtending = extendingToken === t.token;
  const msg = extendMsg[t.token];

  return (
    <div
      className="border rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm"
      style={{ 
        backgroundColor: SURFACE, 
        borderColor: t.expired ? RED : BORDER 
      }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: TEXT }}>{t.buyerName}</p>
        <p className="text-xs truncate" style={{ color: TEXT_3 }}>{t.buyerEmail}</p>
        <p className="text-xs mt-0.5" style={{ color: TEXT_3 }}>
          Kit: <span style={{ color: TEXT_2 }}>{t.kitId}</span>
          {" · "}
          {t.expired ? (
            <span className="font-medium" style={{ color: RED }}>Expired {formatDate(t.expiresAt)}</span>
          ) : (
            <span style={{ color: GREEN }}>Expires {formatDate(t.expiresAt)}</span>
          )}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <button
          onClick={() => onExtend(t.token)}
          disabled={isExtending}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          style={{ 
            backgroundColor: t.expired ? RED : SURFACE_2, 
            color: t.expired ? "#FFF" : TEXT 
          }}
        >
          {isExtending ? "Extending…" : "Extend 90d"}
        </button>
        {msg && (
          <span className="text-xs" style={{ color: TEXT_3 }}>{msg}</span>
        )}
      </div>
    </div>
  );
}
