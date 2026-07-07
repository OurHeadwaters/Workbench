import { useState } from "react";
import { ArrowLeft, MapPin, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import type { CostTier } from "@workspace/odyssey";
import { BG, SURFACE, SURFACE_2, BORDER, TEXT, TEXT_2, TEXT_3, AMBER, AMBER_WASH } from "@/lib/theme";

const BASE_API = import.meta.env.VITE_API_URL ?? "/api";

const ZONES = [
  { id: "Z1", label: "Z1 — Afloat", desc: "Keep-the-lights-on income" },
  { id: "Z2", label: "Z2 — Contract", desc: "Active client work" },
  { id: "Z3", label: "Z3 — Build", desc: "Products and creative work" },
  { id: "Z4", label: "Z4 — Passion", desc: "Long-horizon bets" },
  { id: "any", label: "All zones", desc: "Relevant everywhere" },
];

const COST_TIERS: { value: CostTier; label: string; desc: string }[] = [
  { value: "free", label: "Free", desc: "No cost to use" },
  { value: "$", label: "$", desc: "Low cost / one-time" },
  { value: "$$", label: "$$", desc: "Monthly subscription" },
  { value: "$$$", label: "$$$", desc: "Enterprise / premium" },
];

export function SponsorIntakePage() {
  const [form, setForm] = useState({
    toolName: "",
    problemStatement: "",
    costTier: "free" as CostTier,
    actionUrl: "",
    actionLabel: "",
    communityProof: "",
    zoneTags: [] as string[],
    topicTags: "",
    submitterName: "",
    submitterEmail: "",
    submitterNote: "",
    website: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function set(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  function toggleZone(zone: string) {
    setForm((prev) => ({
      ...prev,
      zoneTags: prev.zoneTags.includes(zone)
        ? prev.zoneTags.filter((z) => z !== zone)
        : [...prev.zoneTags, zone],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.toolName.trim()) { setError("Tool name is required."); return; }
    if (!form.problemStatement.trim()) { setError("Problem statement is required."); return; }
    if (!form.actionUrl.trim()) { setError("A URL is required."); return; }
    if (form.zoneTags.length === 0) { setError("Select at least one zone."); return; }
    if (!form.submitterName.trim()) { setError("Your name is required."); return; }
    if (!form.submitterEmail.trim()) { setError("Your email is required."); return; }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_API}/odyssey/sponsor-intake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          zoneTags: form.zoneTags.join(","),
          topicTags: form.topicTags,
          actionLabel: form.actionLabel || "Take a look",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Submission failed. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-dvh pb-24" style={{ backgroundColor: BG }}>
        <div className="px-5 py-6 max-w-lg mx-auto space-y-6">
          <Link href="/" className="flex items-center gap-1.5 text-sm transition-colors" style={{ color: TEXT_2 }}>
            <ArrowLeft size={14} /> Back to today
          </Link>

          <div className="rounded-xl p-6 space-y-3 text-center" style={{ backgroundColor: SURFACE_2, border: `1px solid ${BORDER}` }}>
            <CheckCircle size={32} className="mx-auto" style={{ color: AMBER }} />
            <h2 className="text-lg font-medium" style={{ color: TEXT }}>Submission received</h2>
            <p className="text-sm" style={{ color: TEXT_2 }}>
              Thanks — your tool is in the review queue. Headwaters curators
              review every submission before it appears on the trail. You'll
              hear back at the email you provided.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh pb-24" style={{ backgroundColor: BG }}>
      <div className="px-5 py-6 max-w-lg mx-auto space-y-6">
        <Link href="/" className="flex items-center gap-1.5 text-sm transition-colors" style={{ color: TEXT_2 }}>
          <ArrowLeft size={14} /> Back to today
        </Link>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={14} style={{ color: AMBER }} />
            <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: AMBER }}>
              Odyssey Trail
            </span>
          </div>
          <h1 className="text-2xl" style={{ color: TEXT }}>Submit a trail sign</h1>
          <p className="text-sm mt-1" style={{ color: TEXT_2 }}>
            Sponsors earn placement by proving value first. All submissions go
            through community vetting before they appear on the trail.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" name="website" value={form.website} onChange={(e) => set("website", e.target.value)} className="sr-only" tabIndex={-1} aria-hidden="true" />

          <div className="space-y-1">
            <label className="text-sm font-medium block" style={{ color: TEXT }}>Tool name *</label>
            <input
              type="text"
              value={form.toolName}
              onChange={(e) => set("toolName", e.target.value)}
              placeholder="e.g. Morning Triage"
              className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium block" style={{ color: TEXT }}>What problem does it solve? *</label>
            <p className="text-xs" style={{ color: TEXT_2 }}>Write it from the practitioner's perspective. "When X happens, this tool helps because…"</p>
            <textarea
              value={form.problemStatement}
              onChange={(e) => set("problemStatement", e.target.value)}
              placeholder="Without this tool, practitioners struggle to…"
              rows={3}
              className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none"
              style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block" style={{ color: TEXT }}>Cost tier *</label>
            <div className="grid grid-cols-4 gap-2">
              {COST_TIERS.map((tier) => (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => set("costTier", tier.value)}
                  className="rounded-xl py-2.5 text-sm font-medium transition-colors min-h-[44px]"
                  style={
                    form.costTier === tier.value
                      ? { backgroundColor: AMBER, color: BG, border: `1px solid ${AMBER}` }
                      : { backgroundColor: SURFACE, color: TEXT_2, border: `1px solid ${BORDER}` }
                  }
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium block" style={{ color: TEXT }}>Action URL *</label>
            <p className="text-xs" style={{ color: TEXT_2 }}>Where does the practitioner go to take the first step?</p>
            <input
              type="url"
              value={form.actionUrl}
              onChange={(e) => set("actionUrl", e.target.value)}
              placeholder="https://…"
              className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium block" style={{ color: TEXT }}>Call-to-action label</label>
            <input
              type="text"
              value={form.actionLabel}
              onChange={(e) => set("actionLabel", e.target.value)}
              placeholder="Take a look (default)"
              className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block" style={{ color: TEXT }}>Which zones does this serve? *</label>
            <div className="space-y-2">
              {ZONES.map((zone) => {
                const selected = form.zoneTags.includes(zone.id);
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => toggleZone(zone.id)}
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-colors min-h-[48px]"
                    style={{
                      backgroundColor: SURFACE,
                      border: `1px solid ${selected ? AMBER : BORDER}`,
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded shrink-0 transition-colors"
                      style={{
                        backgroundColor: selected ? AMBER : "transparent",
                        border: `2px solid ${selected ? AMBER : BORDER}`,
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium" style={{ color: TEXT }}>{zone.label}</p>
                      <p className="text-xs" style={{ color: TEXT_2 }}>{zone.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium block" style={{ color: TEXT }}>Topic tags</label>
            <p className="text-xs" style={{ color: TEXT_2 }}>Comma-separated keywords (e.g. "finance, tracking, income")</p>
            <input
              type="text"
              value={form.topicTags}
              onChange={(e) => set("topicTags", e.target.value)}
              placeholder="planning, triage, client-work"
              className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium block" style={{ color: TEXT }}>Community proof</label>
            <p className="text-xs" style={{ color: TEXT_2 }}>One sentence that shows real adoption. "Used by X communities to do Y."</p>
            <input
              type="text"
              value={form.communityProof}
              onChange={(e) => set("communityProof", e.target.value)}
              placeholder="Used by 5 cooperatives across the corridor"
              className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
            />
          </div>

          <div className="space-y-4 pt-5" style={{ borderTop: `1px solid ${BORDER}` }}>
            <p className="text-xs uppercase tracking-wider font-medium" style={{ color: TEXT_2 }}>Your details</p>

            <div className="space-y-1">
              <label className="text-sm font-medium block" style={{ color: TEXT }}>Your name *</label>
              <input
                type="text"
                value={form.submitterName}
                onChange={(e) => set("submitterName", e.target.value)}
                placeholder="Full name"
                className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium block" style={{ color: TEXT }}>Your email *</label>
              <input
                type="email"
                value={form.submitterEmail}
                onChange={(e) => set("submitterEmail", e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium block" style={{ color: TEXT }}>Anything else to add?</label>
              <textarea
                value={form.submitterNote}
                onChange={(e) => set("submitterNote", e.target.value)}
                placeholder="Context that helps the review team…"
                rows={2}
                className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none"
                style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm rounded-xl px-4 py-3" style={{ color: "#F87171", backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl py-3 text-sm font-medium min-h-[52px] disabled:opacity-50 transition-opacity"
            style={{ backgroundColor: AMBER, color: BG }}
          >
            {submitting ? "Submitting…" : "Submit for vetting"}
          </button>

          <p className="text-xs text-center pb-2" style={{ color: TEXT_3 }}>
            All submissions are reviewed by Headwaters curators before appearing
            on the trail. We'll follow up at the email you provided.
          </p>
        </form>
      </div>
    </div>
  );
}
