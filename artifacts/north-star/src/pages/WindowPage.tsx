// ── Headwaters Window — the controlled Eave Flow leak ────────────────────────
// Z3-only public transparency portal.
// Rule: no Z1 household data crosses this component. Only methodology,
// financial model outcomes, the public offer, and the kit.

import {
  PHASE1_FEE,
  PHASE1_WEEKS_MIN,
  PHASE1_WEEKS_MAX,
  PHASE1_INSTALLMENT,
  PHASE2_TOTAL_BILLED_MONTHLY,
  PHASE2_BOBBIE_DRAW_MONTHLY,
  PHASE2_SURPLUS_MONTHLY,
  KIT_PRICE,
} from "@/data/northStarNumbers";

function fmt(n: number) {
  return n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
}

const DELIVERABLES = [
  "Cold-chain feasibility report with cost model",
  "Community store financial model (3 scenarios)",
  "Draft governance structure and band council resolution template",
  "Phase 2 engagement agreement ready to sign",
];

const PHASE2_WHAT = [
  "Cold-chain pilot — 90 days of live distribution data",
  "Community store buildout — design, permits, fit-out management",
  "Staff training (store manager + 4 community roles)",
  "Bookkeeping system and monthly reporting live",
  "NNC/ISC funding application submitted",
];

const CARD = {
  bg: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(237,232,213,0.10)",
  radius: "1rem",
} as const;

const CARD_DARK = {
  bg: "rgba(16,185,129,0.08)",
  border: "1px solid rgba(16,185,129,0.20)",
  radius: "1rem",
} as const;

const LABEL = { fontSize: 10, fontWeight: 900, letterSpacing: "0.20em", textTransform: "uppercase" as const, color: "rgba(237,232,213,0.40)" };
const MUTED = { color: "rgba(237,232,213,0.50)" };
const BODY  = { color: "rgba(237,232,213,0.80)" };
const BRIGHT = { color: "#ede8d5" };

export function WindowPage() {
  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="min-h-dvh pb-28" style={{ backgroundColor: "#090503" }}>

      {/* Hero — ships image */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <img
          src={`${BASE}/ships-hero.png`}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: 0.55 }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(9,5,3,0.25) 0%, rgba(9,5,3,0.85) 100%)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 max-w-lg mx-auto">
          <p style={{ ...LABEL, fontSize: 9 }}>Headwaters Development Services</p>
          <h1
            className="text-3xl leading-tight mt-1"
            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 800, color: "#ede8d5" }}
          >
            How a community can own its store
          </h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 pt-4 pb-4">
        <p className="text-base leading-relaxed" style={BODY}>
          We don't build dependency. We build the capacity for a community to run its own economy — and then we step back.
        </p>
        <div
          className="mt-3 inline-flex items-center gap-1.5 text-xs rounded-full px-3 py-1"
          style={{ color: "rgba(237,232,213,0.45)", border: "1px solid rgba(237,232,213,0.14)", backgroundColor: "rgba(237,232,213,0.04)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#10b981" }} />
          Wabigoon ON · Treaty 3 · Serving northern Ontario First Nations
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 space-y-4 pb-10">

        {/* The three tests */}
        <div style={{ ...CARD, padding: "1.25rem" }}>
          <p style={LABEL} className="mb-3">Three tests every engagement must pass</p>
          {[
            { label: "Ownership or dependency?", desc: "When we leave, can you run this without us? If not, we haven't done our job." },
            { label: "Watershed or leak?", desc: "Does the money stay inside the community? Margin that flies south is margin the next generation doesn't have." },
            { label: "Seven-generation scrutiny?", desc: "Would the elders of seven generations from now approve this decision?" },
          ].map(({ label, desc }) => (
            <div key={label} className="flex gap-3 mb-3 last:mb-0">
              <span
                className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-black"
                style={{ backgroundColor: "#10b981", color: "#090503" }}
              >✓</span>
              <div>
                <p className="text-sm font-semibold" style={BRIGHT}>{label}</p>
                <p className="text-sm leading-relaxed" style={MUTED}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Step 0 — Trial */}
        <div style={{ ...CARD_DARK, padding: "1.25rem" }}>
          <p style={{ ...LABEL, color: "rgba(16,185,129,0.65)" }} className="mb-1">
            Step 0 · Try us for {PHASE1_WEEKS_MIN}–{PHASE1_WEEKS_MAX} weeks
          </p>
          <p
            className="text-3xl font-bold"
            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 800, color: "hsl(38 85% 52%)" }}
          >
            {fmt(PHASE1_FEE)} flat
          </p>
          <p className="text-sm mt-1" style={{ color: "rgba(16,185,129,0.70)" }}>
            {PHASE1_WEEKS_MIN}–{PHASE1_WEEKS_MAX} weeks · Practitioner solo · Money back if we don't deliver
          </p>

          <div className="mt-4 space-y-1.5">
            <p style={{ ...LABEL, color: "rgba(16,185,129,0.60)" }}>Four deliverables in hand before you decide</p>
            {DELIVERABLES.map((d) => (
              <div key={d} className="flex gap-2 items-start">
                <span className="text-sm shrink-0 mt-0.5" style={{ color: "rgba(16,185,129,0.60)" }}>—</span>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(237,232,213,0.80)" }}>{d}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 space-y-1.5" style={{ borderTop: "1px solid rgba(16,185,129,0.15)" }}>
            <p style={{ ...LABEL, color: "rgba(16,185,129,0.60)" }}>Payment</p>
            <p className="text-sm" style={{ color: "rgba(237,232,213,0.75)" }}>
              {fmt(PHASE1_INSTALLMENT)} on signing · {fmt(PHASE1_INSTALLMENT)} at week 4
            </p>
            <p className="text-sm" style={{ color: "rgba(237,232,213,0.45)" }}>
              Full refund or service credit if acceptance criteria aren't met at the review meeting
            </p>
          </div>
        </div>

        {/* Step 1 — Full engagement */}
        <div style={{ ...CARD, padding: "1.25rem" }}>
          <p style={LABEL} className="mb-1">Step 1 · Full engagement · 12 months</p>
          <p
            className="text-3xl font-bold"
            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 800, color: "#ede8d5" }}
          >
            {fmt(PHASE2_TOTAL_BILLED_MONTHLY)}<span className="text-base font-normal" style={MUTED}>/month</span>
          </p>
          <p className="text-sm mt-1" style={MUTED}>Practitioner + distribution partner · 160 hrs/month each</p>

          <div className="mt-4 space-y-1.5">
            <p style={LABEL} className="mb-2">What happens in 12 months</p>
            {PHASE2_WHAT.map((w) => (
              <div key={w} className="flex gap-2 items-start">
                <span className="text-sm shrink-0 mt-0.5" style={{ color: "#5E8F72" }}>→</span>
                <p className="text-sm leading-relaxed" style={BODY}>{w}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl p-4 space-y-2" style={{ backgroundColor: "rgba(237,232,213,0.04)", border: "1px solid rgba(237,232,213,0.08)" }}>
            <p style={LABEL} className="mb-2">The honest numbers</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              <span style={MUTED}>Billed to community</span>
              <span className="font-semibold" style={BRIGHT}>{fmt(PHASE2_TOTAL_BILLED_MONTHLY)}/mo</span>
              <span style={MUTED}>Practitioner draw</span>
              <span className="font-semibold" style={{ color: "hsl(38 85% 52%)" }}>{fmt(PHASE2_BOBBIE_DRAW_MONTHLY)}/mo</span>
              <span style={MUTED}>Business surplus</span>
              <span className="font-semibold" style={{ color: "#5E8F72" }}>{fmt(PHASE2_SURPLUS_MONTHLY)}/mo</span>
            </div>
            <p className="text-xs leading-relaxed mt-2" style={MUTED}>
              The surplus funds the next community's trial. That's what a constellation model means — each engagement makes the next one possible.
            </p>
          </div>
        </div>

        {/* Economy Kit */}
        <div style={{ ...CARD, padding: "1.25rem" }}>
          <p style={LABEL} className="mb-1">Headwaters Economy Kit</p>
          <p
            className="text-2xl font-bold"
            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 800, color: "hsl(38 85% 52%)" }}
          >
            {fmt(KIT_PRICE)}
          </p>
          <p className="text-sm mt-2 leading-relaxed" style={BODY}>
            The complete self-study framework for a community practitioner or entrepreneur ready to build their own economic infrastructure. Templates, models, and the methodology — without the engagement fee.
          </p>
        </div>

        {/* What we are not */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: "rgba(194,65,12,0.06)", border: "1px solid rgba(194,65,12,0.18)" }}>
          <p style={{ ...LABEL, color: "rgba(194,65,12,0.70)" }} className="mb-3">What this is not</p>
          {[
            "A government program requiring band politics to access",
            "A consulting firm that writes reports and disappears",
            "A dependency-shaped revenue model for us",
            "A one-size-fits-all solution — every community model is rebuilt from scratch",
          ].map((item) => (
            <div key={item} className="flex gap-2 items-start mb-2 last:mb-0">
              <span className="font-bold text-sm shrink-0" style={{ color: "#c2410c" }}>✕</span>
              <p className="text-sm leading-relaxed" style={BODY}>{item}</p>
            </div>
          ))}
        </div>

        {/* Proof */}
        <div style={{ ...CARD, padding: "1.25rem" }}>
          <p style={LABEL} className="mb-2">Proof case</p>
          <p className="text-sm leading-relaxed" style={BODY}>
            807 Food Co-op — community-owned supply chain co-op in the Dryden/Kenora corridor. Active. Wild Bites branded product line live. The same practitioner, the same model, applied at a different scale.
          </p>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs" style={MUTED}>Headwaters Development Services · Wabigoon ON</p>
          <p
            className="text-[10px] mt-2 font-black tracking-widest uppercase"
            style={{ color: "rgba(237,232,213,0.20)" }}
          >
            Different caps · Same eternal river
          </p>
        </div>
      </div>
    </div>
  );
}
