// ── Model Page — financial scenarios, benefit-first ──────────────────────────
// Surfaces V7 math in ADHD-friendly format: one number per scenario,
// benefit framing ("this scenario = X/mo draw").
// Internal tool — Z2 layer.

import {
  PHASE1_FEE,
  PHASE1_WEEKS_MIN,
  PHASE1_WEEKS_MAX,
  PHASE1_TITHE,
  PHASE1_POST_TITHE,
  PHASE1_BOBBIE_RATE,
  PHASE1_HRS_PER_WEEK,
  PHASE2_TOTAL_BILLED_MONTHLY,
  PHASE2_BOBBIE_DRAW_MONTHLY,
  PHASE2_TYLER_MONTHLY,
  PHASE2_OVERHEADS_MONTHLY,
  PHASE2_SURPLUS_MONTHLY,
  PHASE2_SURPLUS_ANNUAL,
  PHASE2_TERM_MONTHS,
  TOTAL_PROJECT_REVENUE,
  STARTUP_BUDGET,
  COMPUTING_RUNWAY_807,
  KIT_PRICE,
} from "@/data/northStarNumbers";
import { useState } from "react";

function fmt(n: number) {
  return "$" + n.toLocaleString("en-CA", { maximumFractionDigits: 0 });
}

type Tab = "phase1" | "phase2" | "kits" | "runway";

const PHASE1_COST_AT_MIN = PHASE1_HRS_PER_WEEK * PHASE1_WEEKS_MIN * PHASE1_BOBBIE_RATE; // 25,200
const PHASE1_COST_AT_MAX = PHASE1_HRS_PER_WEEK * PHASE1_WEEKS_MAX * PHASE1_BOBBIE_RATE; // 33,600
const PHASE1_GAP_AT_MIN  = PHASE1_POST_TITHE - PHASE1_COST_AT_MIN; //  0
const PHASE1_GAP_AT_MAX  = PHASE1_POST_TITHE - PHASE1_COST_AT_MAX; // -8,400

export function ModelPage() {
  const [tab, setTab] = useState<Tab>("phase1");

  const tabs: { id: Tab; label: string }[] = [
    { id: "phase1", label: "Phase 1" },
    { id: "phase2", label: "Phase 2" },
    { id: "kits",   label: "Kits" },
    { id: "runway", label: "Runway" },
  ];

  return (
    <div className="min-h-dvh pb-28 bg-gradient-to-b from-[#FAFAF9] to-[#F5F0E8]">
      <div className="px-5 pt-7 pb-4 max-w-lg mx-auto">
        <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C] mb-1">Financial Model · V7</p>
        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-2xl font-bold text-[#1C1917] leading-tight">
          The numbers, plainly
        </h1>
        <p className="text-sm text-[#78716C] mt-1">
          Benefit first, then the math. V7 is locked — the working model.
        </p>
      </div>

      {/* Tab bar */}
      <div className="px-5 max-w-lg mx-auto">
        <div className="flex gap-1 bg-white rounded-xl border border-[#E7E5E4] p-1">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: tab === id ? "#1F3D2E" : "transparent",
                color: tab === id ? "#fff" : "#78716C",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-4 max-w-lg mx-auto space-y-3 pb-10">

        {/* ── Phase 1 ── */}
        {tab === "phase1" && (
          <>
            <BenefitCard
              label="The benefit"
              value="4 written deliverables in the community's hands before they decide anything"
              sub="Deer Lake gets the model before they commit to the full engagement"
              color="#1F3D2E"
            />

            <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5 space-y-3">
              <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C]">Phase 1 — Trial offer</p>
              <Row label="Fee (flat)" value={fmt(PHASE1_FEE)} />
              <Row label="Tithe (10%)" value={fmt(PHASE1_TITHE)} muted />
              <Row label="Post-tithe" value={fmt(PHASE1_POST_TITHE)} bold />
              <div className="border-t border-[#E7E5E4] pt-3 space-y-2">
                <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C]">Bobbie's cost by duration</p>
                <Row label={`At ${PHASE1_WEEKS_MIN} wks (minimum)`} value={fmt(PHASE1_COST_AT_MIN)} />
                <Row label={`At ${PHASE1_WEEKS_MAX} wks (maximum)`} value={fmt(PHASE1_COST_AT_MAX)} />
              </div>
              <div className="border-t border-[#E7E5E4] pt-3 space-y-2">
                <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C]">Gap (post-tithe minus cost)</p>
                <Row label={`At ${PHASE1_WEEKS_MIN} wks`} value={PHASE1_GAP_AT_MIN === 0 ? "Break-even" : fmt(PHASE1_GAP_AT_MIN)} accent={PHASE1_GAP_AT_MIN === 0 ? "#1F3D2E" : undefined} />
                <Row label={`At ${PHASE1_WEEKS_MAX} wks`} value={fmt(PHASE1_GAP_AT_MAX)} muted />
              </div>
              <div className="bg-[#F5F0E8] rounded-xl p-3">
                <p className="text-xs text-[#6B5744] leading-relaxed">
                  The intentional gap is the upfront cost of proving the Watershed Compact holds. At minimum duration the trial is break-even. At maximum, the {fmt(Math.abs(PHASE1_GAP_AT_MAX))} gap is the price of entry into a {fmt(PHASE2_SURPLUS_ANNUAL)}/yr relationship. Own the story of sovereignty over any dependency-shaped revenue.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5 space-y-2">
              <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C]">Payment schedule</p>
              <Row label="On signing" value="$14,000" />
              <Row label="Week 4" value="$14,000" />
              <p className="text-xs text-[#78716C] pt-1">Full refund or service credit if acceptance criteria aren't met at the review meeting.</p>
            </div>
          </>
        )}

        {/* ── Phase 2 ── */}
        {tab === "phase2" && (
          <>
            <BenefitCard
              label="The benefit"
              value={`${fmt(PHASE2_BOBBIE_DRAW_MONTHLY)}/month draw — the machine funds the life`}
              sub={`${fmt(PHASE2_SURPLUS_MONTHLY)}/mo business surplus on top · ${fmt(PHASE2_SURPLUS_ANNUAL)} annual`}
              color="#1A5FA8"
            />

            <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5 space-y-3">
              <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C]">Phase 2 — Monthly ({PHASE2_TERM_MONTHS} months)</p>
              <Row label="Total billed to community" value={fmt(PHASE2_TOTAL_BILLED_MONTHLY)} bold />
              <div className="border-t border-[#E7E5E4] pt-3 space-y-2">
                <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C]">How it splits</p>
                <Row label="Bobbie draw (160 hrs × $105)" value={fmt(PHASE2_BOBBIE_DRAW_MONTHLY)} />
                <Row label="Tyler subcontract (160 hrs × $70)" value={fmt(PHASE2_TYLER_MONTHLY)} />
                <Row label="Lean overheads" value={fmt(PHASE2_OVERHEADS_MONTHLY)} muted />
                <Row label="Business surplus" value={fmt(PHASE2_SURPLUS_MONTHLY)} accent="#1F3D2E" bold />
              </div>
              <div className="bg-[#F5F0E8] rounded-xl p-3">
                <p className="text-xs text-[#6B5744] leading-relaxed">
                  Tithe ({fmt(Math.round(PHASE2_BOBBIE_DRAW_MONTHLY * 0.10))}/mo) is first claim on the practitioner draw — personal, not a business deduction. Business surplus waterfall (Reserve / Innovation / capital recovery) is TBD at month-6 review.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5 space-y-3">
              <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C]">Full project</p>
              <Row label="Phase 1 fee" value={fmt(PHASE1_FEE)} />
              <Row label="Phase 2 × 12 months" value={fmt(PHASE2_TOTAL_BILLED_MONTHLY * PHASE2_TERM_MONTHS)} />
              <Row label="Total project revenue" value={fmt(TOTAL_PROJECT_REVENUE)} bold />
            </div>
          </>
        )}

        {/* ── Kits ── */}
        {tab === "kits" && (
          <>
            <BenefitCard
              label="The benefit"
              value="The methodology without the engagement fee — self-serve entry point"
              sub="Every kit sold is a practitioner seed in a new community"
              color="#6B5744"
            />
            <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5 space-y-3">
              <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C]">Economy Kit</p>
              <Row label="Price" value={fmt(KIT_PRICE)} bold />
              <p className="text-sm text-[#78716C] leading-relaxed">
                Complete self-study framework: templates, financial models, governance structures, and the practitioner methodology — for a community leader or entrepreneur ready to build their own economic infrastructure.
              </p>
              <div className="bg-[#F5F0E8] rounded-xl p-3">
                <p className="text-xs text-[#6B5744] leading-relaxed">
                  At {fmt(PHASE2_SURPLUS_MONTHLY)}/mo Phase 2 surplus, it takes roughly{" "}
                  {Math.ceil(PHASE2_SURPLUS_MONTHLY / KIT_PRICE)} kit sales to match one month of business surplus.
                  Kits are a volume play, not a margin play. Their job is reach.
                </p>
              </div>
            </div>
          </>
        )}

        {/* ── Runway ── */}
        {tab === "runway" && (
          <>
            <BenefitCard
              label="The benefit"
              value="You know exactly how long you can operate before Deer Lake must contract"
              sub="No surprises. No runway anxiety."
              color="#b85a3e"
            />
            <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5 space-y-3">
              <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C]">Current runway</p>
              <Row label="Startup budget" value={fmt(STARTUP_BUDGET)} />
              <Row label="807 computing runway" value={fmt(COMPUTING_RUNWAY_807)} />
              <Row label="Deer Lake soft deadline" value="June 15 2026" />
              <Row label="Operating contract hard deadline" value="July 31 2026" />
              <div className="bg-[#FEF9EE] border border-[#C8923A]/40 rounded-xl p-3">
                <p className="text-xs text-[#78400A] leading-relaxed">
                  The startup budget equals the Phase 1 trial fee exactly — a deliberate structural alignment. Proving the model at Deer Lake is the same financial event as deploying the startup capital.
                </p>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

function BenefitCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-2xl p-5 space-y-1" style={{ backgroundColor: color }}>
      <p className="text-[10px] font-black tracking-widest uppercase text-white/60">{label}</p>
      <p className="text-lg font-bold text-white leading-snug" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
        {value}
      </p>
      <p className="text-sm text-white/70">{sub}</p>
    </div>
  );
}

function Row({ label, value, muted, bold, accent }: { label: string; value: string; muted?: boolean; bold?: boolean; accent?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-sm text-[#78716C] shrink-0">{label}</span>
      <span
        className="text-sm tabular-nums"
        style={{
          color: accent ?? (muted ? "#B5AFA9" : "#1C1917"),
          fontWeight: bold ? 700 : 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}
