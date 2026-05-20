/**
 * LegacyAssetManagerPage — Public product landing page for the Legacy Asset Manager suite.
 *
 * This page is intentionally PUBLIC (no passphrase gate).
 * GMPH and partners can share this URL directly with care homes,
 * families, and recreation staff to start the subscriber funnel.
 *
 * Route: /legacy-asset-manager   (rendered outside PassphraseGate in App.tsx)
 */

import { useState } from "react";
import {
  Home,
  Brain,
  Users,
  Bell,
  Sun,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";

// ── Tool data ─────────────────────────────────────────────────────────────────

const TOOLS = [
  {
    id: "homebase-ops",
    icon: Home,
    name: "Homebase Ops",
    tagline: "Operations dashboard for care home directors",
    audience: "Directors, administrators, facility managers",
    problem:
      "Running a care home means tracking dozens of moving parts every day — staffing, rooms, schedules, daily barriers. Most of that coordination still happens in email and paper.",
    solution:
      "Homebase Ops gives the person in charge a single, calm screen: who's here today, what needs to clear before end of shift, and what's upcoming. No charts, no noise — just the things that actually need attention.",
    pricing: "$79",
    pricingPeriod: "/ facility / month",
    pricingNote: "One flat rate per facility. No per-user fees.",
    accent: "#1F5B3F",
    accentSoft: "#d1fae5",
    included: true,
  },
  {
    id: "memory-lane",
    icon: Brain,
    name: "Memory Lane",
    tagline: "Resident life history — without a medical chart",
    audience: "Families, care aides, recreation staff",
    problem:
      "Every resident has a story. Most of it lives in a family member's head and never makes it to care staff. When it does, it ends up in a clinical chart that recreation staff can't easily access.",
    solution:
      "Memory Lane lets families contribute favourite moments, lifelong interests, and meaningful memories in plain language — no forms, no medical vocabulary. Staff see what matters to a resident before they walk in the room.",
    pricing: "$29",
    pricingPeriod: "/ facility / month",
    pricingNote: "Add-on to Homebase Ops or standalone.",
    accent: "#6d28d9",
    accentSoft: "#ede9fe",
    included: true,
  },
  {
    id: "wander-together",
    icon: Users,
    name: "Wander Together",
    tagline: "Shared tablet mode for resident check-ins",
    audience: "Care aides, visiting volunteers, recreation staff",
    problem:
      "Shared facility tablets are a headache: no one logs out, resident data gets mixed, and hygiene on shared screens is an afterthought.",
    solution:
      "Wander Together is a kiosk-style mode that auto-clears between residents after a set timer, keeps context clean, and makes it easy for any staff member to pull up the right person quickly.",
    pricing: "Included",
    pricingPeriod: " with Homebase Ops",
    pricingNote: "No additional charge.",
    accent: "#1A5FA8",
    accentSoft: "#dbeafe",
    included: true,
  },
  {
    id: "hallway-notice",
    icon: Bell,
    name: "Hallway Notice",
    tagline: "Shift-to-shift handoff feed for care teams",
    audience: "Nurses, PSWs, team leads",
    problem:
      "Critical information between shifts gets communicated verbally, in notebooks, or in a chat app that nobody has the same access to. Things get missed. Staff spend the first 20 minutes of every shift playing catch-up.",
    solution:
      "Hallway Notice is a chronological shift feed — staff post updates, tag what needs following up, and tap 'I've got this' to acknowledge alerts. Nothing clinical, nothing that belongs in a chart. Just the communication layer that care teams already need.",
    pricing: "$19",
    pricingPeriod: "/ facility / month",
    pricingNote: "Add-on or standalone.",
    accent: "#b45309",
    accentSoft: "#fef3c7",
    included: false,
  },
  {
    id: "bright-side",
    icon: Sun,
    name: "Bright Side",
    tagline: "Recreation therapy coordination for LTC",
    audience: "Recreation therapists, activity coordinators, RT managers",
    problem:
      "Recreation therapy staff in long-term care track resident participation, document outcomes, and report to care teams — in spreadsheets, paper forms, or software built for clinical billing, not for RT workflow.",
    solution:
      "Bright Side is purpose-built for recreation therapy in LTC. Staff log joy moments, track engagement, and produce the documentation they need without adapting clinical software to a non-clinical job.",
    pricing: "$149",
    pricingPeriod: "/ facility / month",
    pricingNote: "Includes director dashboard and staff app.",
    accent: "#c2410c",
    accentSoft: "#fee2e2",
    included: false,
  },
];

const BUNDLE_PRICE = 199;

// ── Sub-components ─────────────────────────────────────────────────────────────

function ToolCard({ tool }: { tool: (typeof TOOLS)[0] }) {
  const [open, setOpen] = useState(false);
  const Icon = tool.icon;

  return (
    <div className="rounded-2xl border overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="h-1.5" style={{ backgroundColor: tool.accent }} />
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div
            className="h-11 w-11 rounded-xl grid place-items-center flex-shrink-0 shadow-sm"
            style={{ backgroundColor: tool.accentSoft, color: tool.accent }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{tool.tagline}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold leading-tight" style={{ color: tool.accent }}>
                  {tool.pricing}
                  <span className="text-sm font-normal text-gray-500">{tool.pricingPeriod}</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{tool.pricingNote}</p>
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              <span className="font-medium text-gray-700">Who it's for: </span>
              {tool.audience}
            </p>

            <button
              type="button"
              onClick={() => setOpen((p) => !p)}
              className="mt-3 flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: tool.accent }}
            >
              {open ? (
                <>
                  <ChevronUp className="h-4 w-4" /> Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" /> What it does
                </>
              )}
            </button>

            {open && (
              <div className="mt-4 space-y-3">
                <div className="rounded-xl p-4" style={{ background: tool.accentSoft + "80" }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: tool.accent }}>
                    The problem it solves
                  </p>
                  <p className="text-sm leading-relaxed text-gray-600">{tool.problem}</p>
                </div>
                <div className="rounded-xl p-4 bg-gray-50">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-gray-700">
                    How it helps
                  </p>
                  <p className="text-sm leading-relaxed text-gray-600">{tool.solution}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Waitlist form ─────────────────────────────────────────────────────────────

type FormState = "idle" | "submitting" | "success" | "error";

function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function toggleTool(id: string) {
    setSelectedTools((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setState("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          org: org.trim(),
          role: role.trim(),
          tools: selectedTools,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Something went wrong");
      }
      setState("success");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="h-14 w-14 rounded-full bg-emerald-600 grid place-items-center mx-auto mb-4">
          <CheckCircle2 className="h-7 w-7 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-emerald-900">You're on the list.</h3>
        <p className="mt-2 text-sm text-emerald-700 max-w-sm mx-auto leading-relaxed">
          We'll be in touch as soon as your facility can be onboarded. Thank you for your interest in the Legacy Asset Manager suite.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-white shadow-sm p-6 md:p-8 space-y-5"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="lam-name">
            Your name <span className="text-red-500">*</span>
          </label>
          <input
            id="lam-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Smith"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="lam-email">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            id="lam-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@facilityname.ca"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="lam-org">
            Facility / organization name
          </label>
          <input
            id="lam-org"
            type="text"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            placeholder="Sunset Gardens LTC"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="lam-role">
            Your role
          </label>
          <input
            id="lam-role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Director of Care, RT Manager, …"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Which tools are you most interested in? <span className="text-gray-400 font-normal">(optional)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {TOOLS.map((tool) => {
            const selected = selectedTools.includes(tool.id);
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => toggleTool(tool.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                style={
                  selected
                    ? { background: tool.accent, color: "#fff", borderColor: tool.accent }
                    : { background: "#fff", color: "#6b7280", borderColor: "#e5e7eb" }
                }
              >
                {tool.name}
              </button>
            );
          })}
        </div>
      </div>

      {state === "error" && (
        <p className="text-sm text-red-600 rounded-xl bg-red-50 border border-red-200 p-3">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting" || !name.trim() || !email.trim()}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
        style={{ backgroundColor: "#1F5B3F" }}
      >
        {state === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
          </>
        ) : (
          <>
            Request access <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
      <p className="text-xs text-gray-400">
        No commitment required. We'll reach out within 2 business days.
      </p>
    </form>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function LegacyAssetManagerPage() {
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* ── Nav bar ── */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="h-8 w-8 rounded-lg grid place-items-center"
              style={{ backgroundColor: "#1F5B3F" }}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">Legacy Asset Manager</p>
              <p className="text-[10px] text-gray-400 leading-tight">by Headwaters</p>
            </div>
          </div>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1F5B3F" }}
          >
            Request access <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-20">
        {/* ── Hero ── */}
        <section className="text-center space-y-6 pt-4">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{ color: "#1F5B3F", borderColor: "#bbf7d0", background: "#f0fdf4" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Now accepting early access requests
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight max-w-2xl mx-auto">
            Software built for<br />
            <span style={{ color: "#1F5B3F" }}>long-term care teams.</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Five purpose-built tools for care homes, families, and recreation staff.
            No clinical complexity. No per-user seat fees. One suite that fits how care actually works.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
              style={{ backgroundColor: "#1F5B3F" }}
            >
              Request access — it's free <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 bg-white transition-colors hover:bg-gray-50"
            >
              See the tools <ChevronDown className="h-4 w-4" />
            </a>
          </div>
        </section>

        {/* ── Social proof strip ── */}
        <section className="grid grid-cols-3 gap-4 text-center">
          {[
            { stat: "5 tools", label: "in one suite" },
            { stat: "$199/mo", label: "full bundle per facility" },
            { stat: "0 per-user", label: "seat fees" },
          ].map(({ stat, label }) => (
            <div key={label} className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{stat}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </section>

        {/* ── Tools ── */}
        <section id="tools" className="space-y-4">
          <div className="mb-6">
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
              The suite · five tools
            </p>
            <h2 className="text-2xl font-bold text-gray-900">
              Everything a care facility needs — nothing it doesn't.
            </h2>
            <p className="mt-2 text-gray-500 max-w-xl">
              Each tool solves a specific, concrete problem in care home operations. Use them together or à la carte.
            </p>
          </div>
          <div className="space-y-4">
            {TOOLS.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* ── Pricing summary ── */}
        <section id="pricing" className="space-y-4">
          <div className="mb-6">
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
              Pricing · transparent & flat
            </p>
            <h2 className="text-2xl font-bold text-gray-900">Simple pricing per facility.</h2>
            <p className="mt-2 text-gray-500">
              One flat monthly rate covers your entire team. No seat fees, no surprise charges.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.filter((t) => t.pricing !== "Included").map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className="rounded-2xl border bg-white p-5 shadow-sm"
                >
                  <div
                    className="h-10 w-10 rounded-xl grid place-items-center mb-3"
                    style={{ backgroundColor: tool.accentSoft, color: tool.accent }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-gray-900">{tool.name}</p>
                  <p className="text-sm text-gray-500 mt-0.5 mb-3">{tool.tagline}</p>
                  <p className="text-xl font-bold" style={{ color: tool.accent }}>
                    {tool.pricing}
                    <span className="text-sm font-normal text-gray-400">{tool.pricingPeriod}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{tool.pricingNote}</p>
                </div>
              );
            })}

            {/* Bundle card */}
            <div className="rounded-2xl border-2 p-5 shadow-sm sm:col-span-2 lg:col-span-1" style={{ borderColor: "#1F5B3F", background: "#f0fdf4" }}>
              <div
                className="h-10 w-10 rounded-xl grid place-items-center mb-3"
                style={{ backgroundColor: "#1F5B3F", color: "#fff" }}
              >
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="font-semibold text-gray-900">Full Suite Bundle</p>
              <p className="text-sm text-gray-500 mt-0.5 mb-3">All five tools · one facility</p>
              <p className="text-xl font-bold" style={{ color: "#1F5B3F" }}>
                ${BUNDLE_PRICE}
                <span className="text-sm font-normal text-gray-500"> / facility / month</span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Save vs. à la carte. Everything included.</p>
              <a
                href="#waitlist"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
                style={{ color: "#1F5B3F" }}
              >
                Get started <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* ── Why it works ── */}
        <section className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8 grid sm:grid-cols-2 gap-6">
          {[
            {
              heading: "No clinical vocabulary required",
              body: "These tools are built for the people who run a care home and care for residents — not for billing software that care teams have to adapt to their work.",
              color: "#1F5B3F",
            },
            {
              heading: "Flat facility pricing",
              body: "One monthly rate covers your whole team. Onboard a new PSW or care aide and the price doesn't move.",
              color: "#1A5FA8",
            },
            {
              heading: "Purpose-built for LTC and retirement care",
              body: "Not a generic SaaS tool bolted onto care. Every screen is designed around the actual workflow of a care home, not a corporate office.",
              color: "#6d28d9",
            },
            {
              heading: "No long-term lock-in",
              body: "Month-to-month subscriptions. Cancel anytime. We'd rather earn your renewal than lock you in.",
              color: "#b45309",
            },
          ].map(({ heading, body, color }) => (
            <div key={heading} className="flex gap-4">
              <div
                className="h-8 w-8 rounded-lg grid place-items-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: color + "18", color }}
              >
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{heading}</p>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── Waitlist form ── */}
        <section id="waitlist" className="space-y-6 scroll-mt-20">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
              Early access
            </p>
            <h2 className="text-2xl font-bold text-gray-900">
              Ready to bring this to your facility?
            </h2>
            <p className="mt-2 text-gray-500 max-w-xl">
              We're onboarding facilities now. Leave your details and we'll reach out within 2 business days to walk you through a demo and discuss fit.
            </p>
          </div>
          <WaitlistForm />
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-gray-100 pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div
              className="h-6 w-6 rounded-md grid place-items-center"
              style={{ backgroundColor: "#1F5B3F" }}
            >
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span>Legacy Asset Manager · by Headwaters</span>
          </div>
          <p>Designed for Canadian long-term care · {new Date().getFullYear()}</p>
        </footer>
      </main>
    </div>
  );
}
