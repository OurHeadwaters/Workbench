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

const PHASE1_COST_AT_MIN = PHASE1_HRS_PER_WEEK * PHASE1_WEEKS_MIN * PHASE1_BOBBIE_RATE;
const PHASE1_COST_AT_MAX = PHASE1_HRS_PER_WEEK * PHASE1_WEEKS_MAX * PHASE1_BOBBIE_RATE;
const PHASE1_GAP_AT_MIN  = PHASE1_POST_TITHE - PHASE1_COST_AT_MIN;
const PHASE1_GAP_AT_MAX  = PHASE1_POST_TITHE - PHASE1_COST_AT_MAX;

const CARD_STYLE = {
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(237,232,213,0.10)",
  borderRadius: "1rem",
  padding: "1.25rem",
} as const;

const LABEL_STYLE = {
  fontSize: 10,
  fontWeight: 900 as const,
  letterSpacing: "0.20em",
  textTransform: "uppercase" as const,
  color: "rgba(237,232,213,0.40)",
};

const MUTED = "rgba(237,232,213,0.45)";
const BODY  = "rgba(237,232,213,0.80)";
const CREAM = "#ede8d5";
const AMBER = "hsl(38 85% 52%)";
const GREEN = "#5E8F72";

function BenefitCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div
      className="rounded-2xl p-5 space-y-1"
      style={{ backgroundColor: `${color}18`, border: `1px solid ${color}35` }}
    >
      <p style={{ ...LABEL_STYLE, color: `${color}80` }}>{label}</p>
      <p className="text-base font-semibold leading-snug" style={{ color: CREAM }}>{value}</p>
      <p className="text-xs" style={{ color: MUTED }}>{sub}</p>
    </div>
  );
}

function Row({ label, value, muted, bold, accent }: { label: string; value: string; muted?: boolean; bold?: boolean; accent?: string }) {
  return (
    <div className="flex justify-between items-baseline gap-2">
      <span className="text-sm" style={{ color: muted ? MUTED : BODY }}>{label}</span>
      <span
        className="text-sm tabular-nums shrink-0"
        style={{
          color: accent ?? (bold ? CREAM : MUTED),
          fontWeight: bold ? 700 : 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function ModelPage() {
  const [tab, setTab] = useState<Tab>("phase1");

  const tabs: { id: Tab; label: string }[] = [
    { id: "phase1", label: "Phase 1" },
    { id: "phase2", label: "Phase 2" },
    { id: "kits",   label: "Kits" },
    { id: "runway", label: "Runway" },
  ];

  return (
    <div className="min-h-dvh pb-28" style={{ backgroundColor: "#090503" }}>
      <div className="px-5 pt-7 pb-4 max-w-lg mx-auto">
        <p style={LABEL_STYLE} className="mb-1">Financial Model · V7</p>
        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 800, color: CREAM }} className="text-2xl leading-tight">
          The numbers, plainly
        </h1>
        <p className="text-sm mt-1" style={{ color: MUTED }}>
          Benefit first, then the math. V7 is locked — the working model.
        </p>
      </div>

      {/* Tab bar */}
      <div className="px-5 max-w-lg mx-auto">
        <div
          className="flex gap-1 rounded-xl p-1"
          style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(237,232,213,0.08)" }}
        >
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                backgroundColor: tab === id ? GREEN : "transparent",
                color: tab === id ? "#090503" : MUTED,
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
              color={GREEN}
            />

            <div style={CARD_STYLE} className="space-y-3">
              <p style={LABEL_STYLE}>Phase 1 — Trial offer</p>
              <Row label="Fee (flat)" value={fmt(PHASE1_FEE)} bold accent={AMBER} />
              <Row label="Tithe (10%)" value={fmt(PHASE1_TITHE)} muted />
              <Row label="Post-tithe" value={fmt(PHASE1_POST_TITHE)} bold />
              <div className="pt-3 space-y-2" style={{ borderTop: "1px solid rgba(237,232,213,0.08)" }}>
                <p style={LABEL_STYLE}>Bobbie's cost by duration</p>
                <Row label={`At ${PHASE1_WEEKS_MIN} wks (minimum)`} value={fmt(PHASE1_COST_AT_MIN)} />
                <Row label={`At ${PHASE1_WEEKS_MAX} wks (maximum)`} value={fmt(PHASE1_COST_AT_MAX)} />
              </div>
              <div className="pt-3 space-y-2" style={{ borderTop: "1px solid rgba(237,232,213,0.08)" }}>
                <p style={LABEL_STYLE}>Gap (post-tithe minus cost)</p>
                <Row label={`At ${PHASE1_WEEKS_MIN} wks`} value={PHASE1_GAP_AT_MIN === 0 ? "Break-even" : fmt(PHASE1_GAP_AT_MIN)} accent={PHASE1_GAP_AT_MIN === 0 ? GREEN : undefined} />
                <Row label={`At ${PHASE1_WEEKS_MAX} wks`} value={fmt(PHASE1_GAP_AT_MAX)} muted />
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(237,232,213,0.04)" }}>
                <p className="text-xs leading-relaxed" style={{ color: MUTED }}>
                  The intentional gap is the upfront cost of proving the Watershed Compact holds. At minimum duration the trial is break-even. At maximum, the {fmt(Math.abs(PHASE1_GAP_AT_MAX))} gap is the price of entry into a {fmt(PHASE2_SURPLUS_ANNUAL)}/yr relationship. Own the story of sovereignty over any dependency-shaped revenue.
                </p>
              </div>
            </div>

            <div style={CARD_STYLE} className="space-y-2">
              <p style={LABEL_STYLE}>Payment schedule</p>
              <Row label="On signing" value="$14,000" />
              <Row label="Week 4" value="$14,000" />
              <p className="text-xs pt-1" style={{ color: MUTED }}>Full refund or service credit if acceptance criteria aren't met at the review meeting.</p>
            </div>
          </>
        )}

        {/* ── Phase 2 ── */}
        {tab === "phase2" && (
          <>
            <BenefitCard
              label="The benefit"
              value={`${fmt(PHASE2_BOBBIE_DRAW_MONTHLY)}/mo draw · ${fmt(PHASE2_SURPLUS_ANNUAL)}/yr surplus`}
              sub={`${PHASE2_TERM_MONTHS} months · Practitioner + distribution partner`}
              color={AMBER}
            />

            <div style={CARD_STYLE} className="space-y-3">
              <p style={LABEL_STYLE}>Phase 2 — Full engagement</p>
              <Row label="Total billed (monthly)" value={fmt(PHASE2_TOTAL_BILLED_MONTHLY)} bold />
              <div className="pt-3 space-y-2" style={{ borderTop: "1px solid rgba(237,232,213,0.08)" }}>
                <p style={LABEL_STYLE}>Cost stack</p>
                <Row label="Bobbie draw" value={fmt(PHASE2_BOBBIE_DRAW_MONTHLY)} />
                <Row label="Tyler (distribution partner)" value={fmt(PHASE2_TYLER_MONTHLY)} />
                <Row label="Overheads" value={fmt(PHASE2_OVERHEADS_MONTHLY)} />
              </div>
              <div className="pt-3 space-y-2" style={{ borderTop: "1px solid rgba(237,232,213,0.08)" }}>
                <p style={LABEL_STYLE}>Surplus</p>
                <Row label="Monthly" value={fmt(PHASE2_SURPLUS_MONTHLY)} bold accent={GREEN} />
                <Row label="Annual (12 months)" value={fmt(PHASE2_SURPLUS_ANNUAL)} bold accent={GREEN} />
              </div>
            </div>

            <div style={CARD_STYLE} className="space-y-2">
              <p style={LABEL_STYLE}>Total project</p>
              <Row label="Full engagement revenue" value={fmt(TOTAL_PROJECT_REVENUE)} bold />
            </div>
          </>
        )}

        {/* ── Kits ── */}
        {tab === "kits" && (
          <>
            <BenefitCard
              label="The benefit"
              value={`${fmt(KIT_PRICE)} — the complete self-study framework`}
              sub="Templates, models, and the methodology — without the engagement fee"
              color="#A07BC0"
            />

            <div style={CARD_STYLE} className="space-y-2">
              <p style={LABEL_STYLE}>Headwaters Economy Kit</p>
              <Row label="Price" value={fmt(KIT_PRICE)} bold accent={AMBER} />
              <p className="text-xs pt-1 leading-relaxed" style={{ color: MUTED }}>
                For a community practitioner or entrepreneur ready to build their own economic infrastructure. Every community model is rebuilt from scratch — this gives you the tools to do that without hiring us.
              </p>
            </div>
          </>
        )}

        {/* ── Runway ── */}
        {tab === "runway" && (
          <>
            <BenefitCard
              label="The benefit"
              value={`${fmt(COMPUTING_RUNWAY_807)} computing runway from 807`}
              sub="Non-food platform share — covers tools and infrastructure"
              color="#5B8FD0"
            />

            <div style={CARD_STYLE} className="space-y-2">
              <p style={LABEL_STYLE}>Startup budget</p>
              <Row label="Total startup" value={fmt(STARTUP_BUDGET)} bold />
              <p className="text-xs pt-1 leading-relaxed" style={{ color: MUTED }}>
                Phase 1 at minimum duration is break-even. The startup budget covers the gap period before Phase 2 revenue flows.
              </p>
            </div>

            <div style={CARD_STYLE} className="space-y-2">
              <p style={LABEL_STYLE}>807 computing runway</p>
              <Row label="Non-food platform share" value={fmt(COMPUTING_RUNWAY_807)} bold accent="#5B8FD0" />
              <p className="text-xs pt-1 leading-relaxed" style={{ color: MUTED }}>
                807 Benefits 20% share of non-food platform revenue covers Replit, hosting, and tool costs through the Deer Lake pursuit phase.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
