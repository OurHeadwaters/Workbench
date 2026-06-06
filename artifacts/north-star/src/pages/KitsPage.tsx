import { useState, useEffect } from "react";

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

export function KitsPage() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [allKits, setAllKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [publishMsg, setPublishMsg] = useState<Record<string, string>>({});

  const isOwner = !!getOwnerToken();

  function ownerHeaders(): Record<string, string> {
    const token = getOwnerToken();
    if (!token) return {};
    return { "x-library-owner-token": token };
  }

  async function fetchKits() {
    setLoading(true);
    try {
      const [pubRes, draftRes] = await Promise.all([
        fetch("/api/kits/list"),
        isOwner ? fetch("/api/kits/drafts", { headers: ownerHeaders() }) : Promise.resolve(null),
      ]);

      if (!pubRes.ok) throw new Error("Failed to load published kits");
      const pubData = (await pubRes.json()) as { kits: Kit[] };
      setKits(pubData.kits ?? []);

      if (draftRes?.ok) {
        const draftData = (await draftRes.json()) as { kits: Kit[] };
        setAllKits(draftData.kits ?? []);
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

  const drafts = allKits.filter((k) => k.status === "draft");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF9] to-[#F5F0E8] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Headwaters Kits</h1>
        <p className="text-stone-500 mb-8 text-sm">
          Tools, frameworks, and field guides for community sovereignty.
        </p>

        {loading && (
          <div className="text-stone-400 text-sm">Loading kits…</div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Owner: Draft kits */}
        {isOwner && drafts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-stone-600 mb-4 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">
                Drafts
              </span>
            </h2>
            <div className="flex flex-col gap-4">
              {drafts.map((kit) => (
                <div
                  key={kit.id}
                  className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-stone-800 text-lg">{kit.title}</h3>
                      {kit.description && (
                        <p className="text-stone-500 text-sm mt-1">{kit.description}</p>
                      )}
                      <p className="text-stone-400 text-xs mt-2">
                        {formatPrice(kit.priceCents)}
                      </p>
                      {kit.codetryResult && (
                        <p className="text-xs mt-2">
                          <span className={kit.codetryResult.passed ? "text-green-600" : "text-amber-600"}>
                            {kit.codetryResult.passed ? "✓ Codetry passed" : "⚠ Codetry flags"}{" "}
                          </span>
                          <span className="text-stone-400">— {kit.codetryResult.summary}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <button
                        onClick={() => void handlePublish(kit.id)}
                        disabled={publishingId === kit.id}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl disabled:opacity-50 transition-colors"
                      >
                        {publishingId === kit.id ? "Publishing…" : "Publish →"}
                      </button>
                      {publishMsg[kit.id] && (
                        <span className="text-xs text-stone-400">{publishMsg[kit.id]}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Published kits */}
        <section>
          {kits.length > 0 && (
            <h2 className="text-lg font-semibold text-stone-600 mb-4">Published Kits</h2>
          )}
          {!loading && kits.length === 0 && (
            <div className="text-center py-16 text-stone-400 text-sm">
              <p className="text-4xl mb-4">📦</p>
              <p>No published kits yet.</p>
              {isOwner && (
                <p className="mt-2 text-stone-300">
                  Open Gord and tap "＋ Add a Kit" to create your first kit.
                </p>
              )}
            </div>
          )}
          <div className="flex flex-col gap-4">
            {kits.map((kit) => (
              <div
                key={kit.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-stone-800 text-lg">{kit.title}</h3>
                    {kit.description && (
                      <p className="text-stone-500 text-sm mt-1">{kit.description}</p>
                    )}
                    <p className="text-emerald-700 font-medium text-sm mt-2">
                      {formatPrice(kit.priceCents)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {kit.stripeCheckoutUrl ? (
                      <a
                        href={kit.stripeCheckoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
                      >
                        Get Kit →
                      </a>
                    ) : (
                      <span className="bg-stone-100 text-stone-500 text-xs px-3 py-1.5 rounded-xl">
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
        <div className="mt-12 border-t border-stone-200 pt-8 text-center">
          <p className="text-stone-400 text-sm">
            Want to run your own version of these kits in your community?{" "}
            <a
              href="/north-star/apply-practitioner"
              className="text-emerald-600 hover:text-emerald-700 underline"
            >
              Apply to become a practitioner →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
