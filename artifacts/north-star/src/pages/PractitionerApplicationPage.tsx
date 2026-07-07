import { useState } from "react";
import { BG, SURFACE, SURFACE_2, BORDER, BORDER_STRONG, TEXT, TEXT_2, TEXT_3, AMBER, AMBER_WASH, GREEN } from "@/lib/theme";

export function PractitionerApplicationPage() {
  const [form, setForm] = useState({
    name: "",
    community: "",
    doctrineSummary: "",
    contactEmail: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/practitioner-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (data.ok) {
        setResult({
          ok: true,
          message:
            "Application received. The founder will review it and reach out by email.",
        });
      } else {
        setResult({ ok: false, message: data.error ?? "Submission failed. Try again." });
      }
    } catch {
      setResult({ ok: false, message: "Network error. Try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-12" style={{ backgroundColor: BG }}>
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: TEXT }}>
          Apply to be a Practitioner
        </h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: TEXT_2 }}>
          Practitioners run Headwaters Kits in their own community under their own doctrine
          and Stripe account. This is a people-first application — tell us who you are and
          what you're building.
        </p>

        {/* HH → Earth Kit pathway note */}
        <div
          className="rounded-xl px-4 py-3 mb-8 text-sm"
          style={{ backgroundColor: AMBER_WASH, border: `1px solid rgba(200,146,58,0.25)`, color: AMBER }}
        >
          <p className="font-medium mb-1">Already active in Helping Hands?</p>
          <p className="text-xs leading-relaxed" style={{ color: TEXT_2 }}>
            If you hold <span className="font-medium" style={{ color: AMBER }}>Teaching-level</span> badges in Food &amp; Harvest, Land &amp; Water, Governance, or Care in the Helping Hands credential system, mention those in your doctrine summary — they are recognised as supporting evidence for Earth Kit Licensed standing and will be reflected in your practitioner profile once approved.
          </p>
        </div>

        {result ? (
          <div
            className="rounded-2xl p-6 text-sm"
            style={
              result.ok
                ? { backgroundColor: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: GREEN }
                : { backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#F87171" }
            }
          >
            {result.ok ? "✓ " : "✗ "}
            {result.message}
          </div>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: TEXT }}>
                Your name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Jane Smith"
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: TEXT }}>
                Community or organization
              </label>
              <input
                type="text"
                name="community"
                value={form.community}
                onChange={handleChange}
                required
                placeholder="e.g. Moose Jaw Co-op, Deer Lake Band Council"
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: TEXT }}>
                Doctrine summary
              </label>
              <textarea
                name="doctrineSummary"
                value={form.doctrineSummary}
                onChange={handleChange}
                required
                rows={5}
                placeholder="What's your approach? What do you believe about community, economy, and sovereignty? What would you build with practitioner access?"
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none"
                style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: TEXT }}>
                Contact email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
              style={{ backgroundColor: AMBER, color: BG }}
            >
              {submitting ? "Submitting…" : "Submit application →"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-xs" style={{ color: TEXT_3 }}>
          Questions?{" "}
          <a href="mailto:hello@ourheadwaters.ca" className="underline" style={{ color: TEXT_2 }}>
            hello@ourheadwaters.ca
          </a>
        </p>
      </div>
    </div>
  );
}
