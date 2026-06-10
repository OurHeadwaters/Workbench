import { useState, useEffect } from "react";

interface Application {
  id: string;
  name: string;
  community: string;
  doctrineSummary: string;
  contactEmail: string;
  status: "pending" | "approved" | "declined";
  reviewNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

interface HhTeachingBadge {
  categoryName: string;
  categoryDomain: string;
  credentialSource: string;
}

const DOMAIN_LABELS: Record<string, string> = {
  food: "Food & Harvest",
  land: "Land & Water",
  governance: "Governance",
  care: "Care & Wellbeing",
};

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

function getApiBase(): string {
  const base =
    (window as Window & { __BASE_URL__?: string }).__BASE_URL__ ??
    (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ??
    "/";
  return base.replace(/\/$/, "") + "/api";
}

export function PractitionerReviewPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({});
  const [actionMsg, setActionMsg] = useState<Record<string, string>>({});
  const [hhBadges, setHhBadges] = useState<Record<string, HhTeachingBadge[]>>({});
  const [hhBadgesLoading, setHhBadgesLoading] = useState(false);

  const isOwner = !!getOwnerToken();

  function ownerHeaders(): Record<string, string> {
    const token = getOwnerToken();
    if (!token) return {};
    return { "x-library-owner-token": token };
  }

  async function fetchApps() {
    setLoading(true);
    try {
      const res = await fetch("/api/practitioner-applications", { headers: ownerHeaders() });
      if (res.status === 401 || res.status === 403) {
        setError("Owner access required.");
        return;
      }
      if (!res.ok) throw new Error("Failed to load applications");
      const data = (await res.json()) as { applications: Application[] };
      const fetched = data.applications ?? [];
      setApps(fetched);

      const approvedEmails = fetched
        .filter((a) => a.status === "approved")
        .map((a) => a.contactEmail)
        .filter(Boolean);

      if (approvedEmails.length > 0) {
        void fetchHhBadgesForEmails(approvedEmails);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function fetchHhBadgesForEmails(emails: string[]) {
    setHhBadgesLoading(true);
    try {
      const apiBase = getApiBase();
      const query = emails.map(encodeURIComponent).join(",");
      const res = await fetch(`${apiBase}/helping-hands/practitioner-teaching-badges?emails=${query}`, {
        headers: ownerHeaders(),
      });
      if (!res.ok) return;
      const data = (await res.json()) as Record<string, HhTeachingBadge[]>;
      setHhBadges(data);
    } catch {
    } finally {
      setHhBadgesLoading(false);
    }
  }

  useEffect(() => {
    void fetchApps();
  }, []);

  async function handleReview(id: string, status: "approved" | "declined") {
    setReviewingId(id);
    try {
      const res = await fetch(`/api/practitioner-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...ownerHeaders() },
        body: JSON.stringify({ status, reviewNote: reviewNote[id] ?? undefined }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (data.ok) {
        setActionMsg((prev) => ({
          ...prev,
          [id]: status === "approved" ? "✓ Approved" : "✗ Declined",
        }));
        void fetchApps();
      } else {
        setActionMsg((prev) => ({ ...prev, [id]: data.error ?? "Failed" }));
      }
    } catch {
      setActionMsg((prev) => ({ ...prev, [id]: "Network error" }));
    } finally {
      setReviewingId(null);
    }
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-400 text-sm">
        Owner access required.
      </div>
    );
  }

  const pending = apps.filter((a) => a.status === "pending");
  const reviewed = apps.filter((a) => a.status !== "pending");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF9] to-[#F5F0E8] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Practitioner Applications</h1>
        <p className="text-stone-500 text-sm mb-8">
          Review and approve practitioners who will run Headwaters Kits in their community.
        </p>

        {loading && <div className="text-stone-400 text-sm">Loading…</div>}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Pending */}
        {pending.length > 0 && (
          <section className="mb-10">
            <h2 className="text-base font-semibold text-stone-600 mb-4 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                {pending.length} pending
              </span>
            </h2>
            <div className="flex flex-col gap-4">
              {pending.map((app) => (
                <div
                  key={app.id}
                  className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3 justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-stone-800">{app.name}</h3>
                      <p className="text-stone-500 text-xs">{app.community}</p>
                    </div>
                    <a
                      href={`mailto:${app.contactEmail}`}
                      className="text-xs text-emerald-600 underline"
                    >
                      {app.contactEmail}
                    </a>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed border-l-2 border-stone-200 pl-3 mb-4">
                    {app.doctrineSummary}
                  </p>
                  <p className="text-stone-400 text-xs mb-3">
                    Applied {new Date(app.createdAt).toLocaleDateString("en-CA")}
                  </p>
                  <textarea
                    placeholder="Optional note (visible to you only)…"
                    value={reviewNote[app.id] ?? ""}
                    onChange={(e) =>
                      setReviewNote((prev) => ({ ...prev, [app.id]: e.target.value }))
                    }
                    rows={2}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-600 focus:outline-none focus:border-emerald-400 resize-none mb-3 bg-stone-50"
                  />
                  {actionMsg[app.id] ? (
                    <p className="text-sm font-medium text-stone-600">{actionMsg[app.id]}</p>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => void handleReview(app.id, "approved")}
                        disabled={reviewingId === app.id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl disabled:opacity-50 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => void handleReview(app.id, "declined")}
                        disabled={reviewingId === app.id}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2 rounded-xl disabled:opacity-50 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviewed */}
        {reviewed.length > 0 && (
          <section>
            <h2 className="text-base font-semibold text-stone-500 mb-4">Reviewed</h2>
            <div className="flex flex-col gap-3">
              {reviewed.map((app) => {
                const badges = hhBadges[app.contactEmail] ?? [];
                return (
                  <div
                    key={app.id}
                    className={`bg-white border rounded-2xl p-4 shadow-sm ${
                      app.status === "approved"
                        ? "border-emerald-200"
                        : "border-stone-200 opacity-70"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-medium text-stone-800 text-sm">{app.name}</span>
                        <span className="text-stone-400 text-xs ml-2">— {app.community}</span>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          app.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {app.status === "approved" ? "Approved" : "Declined"}
                      </span>
                    </div>
                    {app.reviewNote && (
                      <p className="text-stone-400 text-xs mt-1">{app.reviewNote}</p>
                    )}

                    {/* HH Teaching badges — only shown for approved practitioners */}
                    {app.status === "approved" && !hhBadgesLoading && badges.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-stone-100">
                        <p className="text-xs text-stone-400 font-medium mb-2">Helping Hands — Teaching badges</p>
                        <div className="flex flex-wrap gap-1.5">
                          {badges.map((b, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border bg-amber-50 border-amber-200 text-amber-700 font-medium"
                            >
                              {b.categoryName}
                              <span className="text-amber-500 font-normal">· {DOMAIN_LABELS[b.categoryDomain] ?? b.categoryDomain}</span>
                              {b.credentialSource === "earth_kit" && (
                                <span className="text-stone-400 font-normal">· EK</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {app.status === "approved" && hhBadgesLoading && (
                      <div className="mt-2 text-xs text-stone-400">Loading HH badges…</div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {!loading && apps.length === 0 && (
          <div className="text-center py-16 text-stone-400 text-sm">
            <p className="text-4xl mb-4">📋</p>
            <p>No applications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
