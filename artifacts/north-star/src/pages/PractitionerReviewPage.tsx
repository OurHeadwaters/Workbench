import { useState, useEffect } from "react";
import { BG, SURFACE, SURFACE_2, BORDER, TEXT, TEXT_2, TEXT_3, AMBER, AMBER_WASH, GREEN } from "@/lib/theme";

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
      <div className="min-h-screen flex items-center justify-center text-sm" style={{ backgroundColor: BG, color: TEXT_2 }}>
        Owner access required.
      </div>
    );
  }

  const pending = apps.filter((a) => a.status === "pending");
  const reviewed = apps.filter((a) => a.status !== "pending");

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: BG }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: TEXT }}>Practitioner Applications</h1>
        <p className="text-sm mb-8" style={{ color: TEXT_2 }}>
          Review and approve practitioners who will run Headwaters Kits in their community.
        </p>

        {loading && <div className="text-sm" style={{ color: TEXT_2 }}>Loading…</div>}
        {error && (
          <div className="rounded-xl p-4 text-sm mb-6" style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#F87171" }}>
            {error}
          </div>
        )}

        {/* Pending */}
        {pending.length > 0 && (
          <section className="mb-10">
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: TEXT_2 }}>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: AMBER_WASH, color: AMBER }}
              >
                {pending.length} pending
              </span>
            </h2>
            <div className="flex flex-col gap-4">
              {pending.map((app) => (
                <div
                  key={app.id}
                  className="rounded-2xl p-5"
                  style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
                >
                  <div className="flex items-start gap-3 justify-between mb-3">
                    <div>
                      <h3 className="font-semibold" style={{ color: TEXT }}>{app.name}</h3>
                      <p className="text-xs" style={{ color: TEXT_2 }}>{app.community}</p>
                    </div>
                    <a
                      href={`mailto:${app.contactEmail}`}
                      className="text-xs underline"
                      style={{ color: AMBER }}
                    >
                      {app.contactEmail}
                    </a>
                  </div>
                  <p
                    className="text-sm leading-relaxed border-l-2 pl-3 mb-4"
                    style={{ color: TEXT_2, borderColor: BORDER }}
                  >
                    {app.doctrineSummary}
                  </p>
                  <p className="text-xs mb-3" style={{ color: TEXT_3 }}>
                    Applied {new Date(app.createdAt).toLocaleDateString("en-CA")}
                  </p>
                  <textarea
                    placeholder="Optional note (visible to you only)…"
                    value={reviewNote[app.id] ?? ""}
                    onChange={(e) =>
                      setReviewNote((prev) => ({ ...prev, [app.id]: e.target.value }))
                    }
                    rows={2}
                    className="w-full rounded-xl px-3 py-2 text-xs focus:outline-none resize-none mb-3"
                    style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
                  />
                  {actionMsg[app.id] ? (
                    <p className="text-sm font-medium" style={{ color: TEXT_2 }}>{actionMsg[app.id]}</p>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => void handleReview(app.id, "approved")}
                        disabled={reviewingId === app.id}
                        className="text-xs font-semibold px-4 py-2 rounded-xl disabled:opacity-50 transition-colors"
                        style={{ backgroundColor: AMBER, color: BG }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => void handleReview(app.id, "declined")}
                        disabled={reviewingId === app.id}
                        className="text-xs font-semibold px-4 py-2 rounded-xl disabled:opacity-50 transition-colors"
                        style={{ backgroundColor: SURFACE_2, color: TEXT_2, border: `1px solid ${BORDER}` }}
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
            <h2 className="text-base font-semibold mb-4" style={{ color: TEXT_2 }}>Reviewed</h2>
            <div className="flex flex-col gap-3">
              {reviewed.map((app) => {
                const badges = hhBadges[app.contactEmail] ?? [];
                return (
                  <div
                    key={app.id}
                    className="rounded-2xl p-4"
                    style={{
                      backgroundColor: SURFACE,
                      border: `1px solid ${app.status === "approved" ? "rgba(74,222,128,0.2)" : BORDER}`,
                      opacity: app.status === "declined" ? 0.7 : 1,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-medium text-sm" style={{ color: TEXT }}>{app.name}</span>
                        <span className="text-xs ml-2" style={{ color: TEXT_2 }}>— {app.community}</span>
                      </div>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={
                          app.status === "approved"
                            ? { backgroundColor: "rgba(74,222,128,0.1)", color: GREEN }
                            : { backgroundColor: SURFACE_2, color: TEXT_3 }
                        }
                      >
                        {app.status === "approved" ? "Approved" : "Declined"}
                      </span>
                    </div>
                    {app.reviewNote && (
                      <p className="text-xs mt-1" style={{ color: TEXT_3 }}>{app.reviewNote}</p>
                    )}

                    {/* HH Teaching badges — only shown for approved practitioners */}
                    {app.status === "approved" && !hhBadgesLoading && badges.length > 0 && (
                      <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${BORDER}` }}>
                        <p className="text-xs font-medium mb-2" style={{ color: TEXT_3 }}>Helping Hands — Teaching badges</p>
                        <div className="flex flex-wrap gap-1.5">
                          {badges.map((b, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium"
                              style={{ backgroundColor: AMBER_WASH, borderColor: "rgba(200,146,58,0.25)", color: AMBER }}
                            >
                              {b.categoryName}
                              <span className="font-normal" style={{ color: TEXT_2 }}>· {DOMAIN_LABELS[b.categoryDomain] ?? b.categoryDomain}</span>
                              {b.credentialSource === "earth_kit" && (
                                <span className="font-normal" style={{ color: TEXT_3 }}>· EK</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {app.status === "approved" && hhBadgesLoading && (
                      <div className="mt-2 text-xs" style={{ color: TEXT_3 }}>Loading HH badges…</div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {!loading && apps.length === 0 && (
          <div className="text-center py-16 text-sm" style={{ color: TEXT_2 }}>
            <p className="text-4xl mb-4">📋</p>
            <p>No applications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
