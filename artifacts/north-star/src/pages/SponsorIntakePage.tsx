import { useState } from "react";
import { ArrowLeft, MapPin, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import type { CostTier } from "@workspace/odyssey";

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
      <div className="min-h-dvh bg-[#FAFAF9] pb-24">
        <div className="px-5 py-6 max-w-lg mx-auto space-y-6">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-[#78716C] hover:text-[#1C1917] transition-colors">
            <ArrowLeft size={14} /> Back to today
          </Link>

          <div className="rounded-xl border border-[#D6CFC3] bg-[#F9F6F0] p-6 space-y-3 text-center">
            <CheckCircle size={32} className="text-[#92785A] mx-auto" />
            <h2 className="text-lg font-medium">Submission received</h2>
            <p className="text-sm text-[#78716C]">
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
    <div className="min-h-dvh bg-[#FAFAF9] pb-24">
      <div className="px-5 py-6 max-w-lg mx-auto space-y-6">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-[#78716C] hover:text-[#1C1917] transition-colors">
          <ArrowLeft size={14} /> Back to today
        </Link>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={14} className="text-[#92785A]" />
            <span className="text-[10px] uppercase tracking-widest text-[#92785A] font-medium">
              Odyssey Trail
            </span>
          </div>
          <h1 className="text-2xl">Submit a trail sign</h1>
          <p className="text-sm text-[#78716C] mt-1">
            Sponsors earn placement by proving value first. All submissions go
            through community vetting before they appear on the trail.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" name="website" value={form.website} onChange={(e) => set("website", e.target.value)} className="sr-only" tabIndex={-1} aria-hidden="true" />

          <div className="space-y-1">
            <label className="text-sm font-medium block">Tool name *</label>
            <input
              type="text"
              value={form.toolName}
              onChange={(e) => set("toolName", e.target.value)}
              placeholder="e.g. Morning Triage"
              className="w-full border border-[#E7E5E4] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium block">What problem does it solve? *</label>
            <p className="text-xs text-[#78716C]">Write it from the practitioner's perspective. "When X happens, this tool helps because…"</p>
            <textarea
              value={form.problemStatement}
              onChange={(e) => set("problemStatement", e.target.value)}
              placeholder="Without this tool, practitioners struggle to…"
              rows={3}
              className="w-full border border-[#E7E5E4] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C1917] resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">Cost tier *</label>
            <div className="grid grid-cols-4 gap-2">
              {COST_TIERS.map((tier) => (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => set("costTier", tier.value)}
                  className={cn(
                    "rounded-xl border py-2.5 text-sm font-medium transition-colors min-h-[44px]",
                    form.costTier === tier.value
                      ? "border-[#1C1917] bg-[#1C1917] text-white"
                      : "border-[#E7E5E4] bg-white text-[#44403C] hover:border-[#A8A29E]",
                  )}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium block">Action URL *</label>
            <p className="text-xs text-[#78716C]">Where does the practitioner go to take the first step?</p>
            <input
              type="url"
              value={form.actionUrl}
              onChange={(e) => set("actionUrl", e.target.value)}
              placeholder="https://…"
              className="w-full border border-[#E7E5E4] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium block">Call-to-action label</label>
            <input
              type="text"
              value={form.actionLabel}
              onChange={(e) => set("actionLabel", e.target.value)}
              placeholder="Take a look (default)"
              className="w-full border border-[#E7E5E4] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">Which zones does this serve? *</label>
            <div className="space-y-2">
              {ZONES.map((zone) => {
                const selected = form.zoneTags.includes(zone.id);
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => toggleZone(zone.id)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-colors min-h-[48px]",
                      selected
                        ? "border-[#1C1917] bg-white"
                        : "border-[#E7E5E4] bg-white hover:border-[#A8A29E]",
                    )}
                  >
                    <div className={cn("w-4 h-4 rounded border-2 shrink-0 transition-colors", selected ? "bg-[#1C1917] border-[#1C1917]" : "border-[#D6D3D1]")} />
                    <div>
                      <p className="text-sm font-medium">{zone.label}</p>
                      <p className="text-xs text-[#78716C]">{zone.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium block">Topic tags</label>
            <p className="text-xs text-[#78716C]">Comma-separated keywords (e.g. "finance, tracking, income")</p>
            <input
              type="text"
              value={form.topicTags}
              onChange={(e) => set("topicTags", e.target.value)}
              placeholder="planning, triage, client-work"
              className="w-full border border-[#E7E5E4] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium block">Community proof</label>
            <p className="text-xs text-[#78716C]">One sentence that shows real adoption. "Used by X communities to do Y."</p>
            <input
              type="text"
              value={form.communityProof}
              onChange={(e) => set("communityProof", e.target.value)}
              placeholder="Used by 5 cooperatives across the corridor"
              className="w-full border border-[#E7E5E4] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
            />
          </div>

          <div className="border-t border-[#E7E5E4] pt-5 space-y-4">
            <p className="text-xs text-[#78716C] uppercase tracking-wider font-medium">Your details</p>

            <div className="space-y-1">
              <label className="text-sm font-medium block">Your name *</label>
              <input
                type="text"
                value={form.submitterName}
                onChange={(e) => set("submitterName", e.target.value)}
                placeholder="Full name"
                className="w-full border border-[#E7E5E4] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium block">Your email *</label>
              <input
                type="email"
                value={form.submitterEmail}
                onChange={(e) => set("submitterEmail", e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-[#E7E5E4] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium block">Anything else to add?</label>
              <textarea
                value={form.submitterNote}
                onChange={(e) => set("submitterNote", e.target.value)}
                placeholder="Context that helps the review team…"
                rows={2}
                className="w-full border border-[#E7E5E4] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C1917] resize-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1C1917] text-white rounded-xl py-3 text-sm font-medium min-h-[52px] disabled:opacity-50 transition-opacity"
          >
            {submitting ? "Submitting…" : "Submit for vetting"}
          </button>

          <p className="text-xs text-[#A8A29E] text-center pb-2">
            All submissions are reviewed by Headwaters curators before appearing
            on the trail. We'll follow up at the email you provided.
          </p>
        </form>
      </div>
    </div>
  );
}
