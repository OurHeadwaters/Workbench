import { useState } from "react";

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
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF9] to-[#F5F0E8] px-4 py-12">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          Apply to be a Practitioner
        </h1>
        <p className="text-stone-500 text-sm mb-8 leading-relaxed">
          Practitioners run Headwaters Kits in their own community under their own doctrine
          and Stripe account. This is a people-first application — tell us who you are and
          what you're building.
        </p>

        {result ? (
          <div
            className={`rounded-2xl p-6 text-sm ${
              result.ok
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {result.ok ? "✓ " : "✗ "}
            {result.message}
          </div>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Your name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Jane Smith"
                className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm text-stone-800 focus:outline-none focus:border-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Community or organization
              </label>
              <input
                type="text"
                name="community"
                value={form.community}
                onChange={handleChange}
                required
                placeholder="e.g. Moose Jaw Co-op, Deer Lake Band Council"
                className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm text-stone-800 focus:outline-none focus:border-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Doctrine summary
              </label>
              <textarea
                name="doctrineSummary"
                value={form.doctrineSummary}
                onChange={handleChange}
                required
                rows={5}
                placeholder="What's your approach? What do you believe about community, economy, and sovereignty? What would you build with practitioner access?"
                className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm text-stone-800 focus:outline-none focus:border-emerald-500 bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Contact email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm text-stone-800 focus:outline-none focus:border-emerald-500 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit application →"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-xs text-stone-400">
          Questions?{" "}
          <a href="mailto:hello@ourheadwaters.ca" className="underline hover:text-stone-600">
            hello@ourheadwaters.ca
          </a>
        </p>
      </div>
    </div>
  );
}
