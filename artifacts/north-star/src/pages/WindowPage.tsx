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

export function WindowPage() {
  return (
    <div className="min-h-dvh pb-28 bg-[#FAFAF9]">
      <div className="max-w-lg mx-auto px-5 pt-8 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black tracking-widest uppercase text-[#4B6070]">Headwaters Development Services</span>
        </div>
        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl font-bold text-[#1F3D2E] leading-tight">
          How a community can own its store
        </h1>
        <p className="text-base text-[#6B5744] mt-2 leading-relaxed">
          We don't build dependency. We build the capacity for a community to run its own economy — and then we step back.
        </p>

        <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#4B6070] border border-[#4B6070]/30 rounded-full px-3 py-1 bg-[#4B6070]/5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4B6070]" />
          Wabigoon ON · Treaty 3 · Serving northern Ontario First Nations
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 space-y-5 pb-10">

        {/* The three tests */}
        <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5 space-y-3">
          <p className="text-xs font-black tracking-widest uppercase text-[#78716C]">Three tests every engagement must pass</p>
          {[
            { label: "Ownership or dependency?", desc: "When we leave, can you run this without us? If not, we haven't done our job." },
            { label: "Watershed or leak?", desc: "Does the money stay inside the community? Margin that flies south is margin the next generation doesn't have." },
            { label: "Seven-generation scrutiny?", desc: "Would the elders of seven generations from now approve this decision?" },
          ].map(({ label, desc }) => (
            <div key={label} className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#1F3D2E] text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <div>
                <p className="text-sm font-semibold text-[#1C1917]">{label}</p>
                <p className="text-sm text-[#78716C] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Step 0 — Trial */}
        <div className="bg-[#1F3D2E] rounded-2xl p-5 space-y-4">
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase text-[#a3c4a8] mb-1">Step 0 · Try us for {PHASE1_WEEKS_MIN}–{PHASE1_WEEKS_MAX} weeks</p>
            <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              {fmt(PHASE1_FEE)} flat
            </p>
            <p className="text-sm text-[#a3c4a8] mt-1">
              {PHASE1_WEEKS_MIN}–{PHASE1_WEEKS_MAX} weeks · Practitioner solo · Money back if we don't deliver
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-black tracking-widest uppercase text-[#a3c4a8]">Four deliverables in hand before you decide</p>
            {DELIVERABLES.map((d) => (
              <div key={d} className="flex gap-2 items-start">
                <span className="text-[#a3c4a8] text-sm shrink-0 mt-0.5">—</span>
                <p className="text-sm text-white/90 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 space-y-1.5">
            <p className="text-[10px] font-black tracking-widest uppercase text-[#a3c4a8]">Payment</p>
            <p className="text-sm text-white/80">{fmt(PHASE1_INSTALLMENT)} on signing · {fmt(PHASE1_INSTALLMENT)} at week 4</p>
            <p className="text-sm text-white/60">Full refund or service credit if acceptance criteria aren't met at the review meeting</p>
          </div>
        </div>

        {/* Step 1 — Full engagement */}
        <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5 space-y-4">
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C] mb-1">Step 1 · Full engagement · 12 months</p>
            <p className="text-2xl font-bold text-[#1C1917]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              {fmt(PHASE2_TOTAL_BILLED_MONTHLY)}<span className="text-base font-normal text-[#78716C]">/month</span>
            </p>
            <p className="text-sm text-[#78716C] mt-1">Practitioner + distribution partner · 160 hrs/month each</p>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C]">What happens in 12 months</p>
            {PHASE2_WHAT.map((w) => (
              <div key={w} className="flex gap-2 items-start">
                <span className="text-[#1F3D2E] text-sm shrink-0 mt-0.5">→</span>
                <p className="text-sm text-[#44403C] leading-relaxed">{w}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#F5F0E8] rounded-xl p-4 space-y-1">
            <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C]">The honest numbers</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-[#78716C]">Billed to community</span>
              <span className="font-semibold text-[#1C1917]">{fmt(PHASE2_TOTAL_BILLED_MONTHLY)}/mo</span>
              <span className="text-[#78716C]">Practitioner draw</span>
              <span className="font-semibold text-[#1C1917]">{fmt(PHASE2_BOBBIE_DRAW_MONTHLY)}/mo</span>
              <span className="text-[#78716C]">Business surplus</span>
              <span className="font-semibold text-[#1F3D2E]">{fmt(PHASE2_SURPLUS_MONTHLY)}/mo</span>
            </div>
            <p className="text-xs text-[#78716C] mt-2 leading-relaxed">
              The surplus funds the next community's trial. That's what a constellation model means — each engagement makes the next one possible.
            </p>
          </div>
        </div>

        {/* Economy Kit */}
        <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C] mb-1">Headwaters Economy Kit</p>
              <p className="text-xl font-bold text-[#1C1917]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                {fmt(KIT_PRICE)}
              </p>
              <p className="text-sm text-[#78716C] mt-1 leading-relaxed">
                The complete self-study framework for a community practitioner or entrepreneur ready to build their own economic infrastructure. Templates, models, and the methodology — without the engagement fee.
              </p>
            </div>
          </div>
        </div>

        {/* What we are not */}
        <div className="rounded-2xl border border-[#E7E5E4] bg-[#F5F0E8] p-5">
          <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C] mb-3">What this is not</p>
          {[
            "A government program requiring band politics to access",
            "A consulting firm that writes reports and disappears",
            "A dependency-shaped revenue model for us",
            "A one-size-fits-all solution — every community model is rebuilt from scratch",
          ].map((item) => (
            <div key={item} className="flex gap-2 items-start mb-2">
              <span className="text-[#b85a3e] font-bold text-sm shrink-0">✕</span>
              <p className="text-sm text-[#44403C] leading-relaxed">{item}</p>
            </div>
          ))}
        </div>

        {/* Proof */}
        <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5 space-y-2">
          <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C]">Proof case</p>
          <p className="text-sm text-[#44403C] leading-relaxed">
            807 Food Co-op — community-owned supply chain co-op in the Dryden/Kenora corridor. Active. Wild Bites branded product line live. The same practitioner, the same model, applied at a different scale.
          </p>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-[#78716C]">Headwaters Development Services · Wabigoon ON</p>
          <p className="text-xs text-[#B5AFA9] mt-1">ourheadwaters.ca</p>
        </div>
      </div>
    </div>
  );
}
