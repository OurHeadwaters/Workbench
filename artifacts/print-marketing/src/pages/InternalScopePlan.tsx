import type { CSSProperties } from "react";
import { PrintNav } from "../components/PrintNav";

// ─── ASSUMPTIONS — edit these to update all calculations ─────────────────────
//
// All dollar figures are CAD. Change any number here and the tables below
// recalculate automatically. Nothing else needs to be touched.

const CONFIG = {
  // Bobbie's billable rate (internal cost basis, not what's on the invoice)
  hourlyRate: 175,

  // Working hours per day used for cost-to-deliver estimates
  hoursPerDay: 7,

  // Phase 2 — Full build / store launch
  phase2: {
    remoteMonths: 4,
    remoteDaysPerMonth: 18,        // ~4.5 days/week, allowing for community rhythm
    siteVisits: 4,
    daysPerVisit: 3,
    travelCostPerVisit: 900,       // flights + accommodation + meals (CAD)
    proposedFeeMin: 52_000,
    proposedFeeMax: 60_000,
  },

  // Phase 3 — Winter payoff / lighter presence
  phase3: {
    remoteMonths: 3,
    remoteDaysPerMonth: 10,        // roughly 2–2.5 days/week
    siteVisits: 2,
    daysPerVisit: 3,
    travelCostPerVisit: 900,
    proposedFeeMin: 24_000,
    proposedFeeMax: 30_000,
  },

  // Phase 4 — 50% capacity, handoff, Pilot #2 bridge
  phase4: {
    remoteMonths: 6,
    remoteDaysPerMonth: 9,         // ~50% of a standard working month
    siteVisits: 2,
    daysPerVisit: 2,               // shorter visits — celebration + handoff focused
    travelCostPerVisit: 900,
    proposedFeeMin: 18_000,
    proposedFeeMax: 22_000,
  },

  // IT / Bookkeeping hire
  staffing: {
    estimatedHoursPerMonth: 12,    // part-time / fractional contractor
    contractorHourlyRate: 65,      // CAD, bookkeeper/IT generalist market rate
    monthsCoveredInPhase2: 4,      // absorbed into Phase 2 pricing
  },

};

// ─── Derived calculations ────────────────────────────────────────────────────

function phaseCalc(phase: {
  remoteMonths: number;
  remoteDaysPerMonth: number;
  siteVisits: number;
  daysPerVisit: number;
  travelCostPerVisit: number;
  proposedFeeMin: number;
  proposedFeeMax: number;
}) {
  const remoteDays = phase.remoteMonths * phase.remoteDaysPerMonth;
  const onsiteDays = phase.siteVisits * phase.daysPerVisit;
  const totalDays = remoteDays + onsiteDays;
  const laborCost = totalDays * CONFIG.hoursPerDay * CONFIG.hourlyRate;
  const travelCost = phase.siteVisits * phase.travelCostPerVisit;
  const totalCost = laborCost + travelCost;
  const midFee = (phase.proposedFeeMin + phase.proposedFeeMax) / 2;
  const marginAtMin = ((phase.proposedFeeMin - totalCost) / phase.proposedFeeMin) * 100;
  const marginAtMax = ((phase.proposedFeeMax - totalCost) / phase.proposedFeeMax) * 100;
  return { remoteDays, onsiteDays, totalDays, laborCost, travelCost, totalCost, midFee, marginAtMin, marginAtMax };
}

const p2 = phaseCalc(CONFIG.phase2);
const p3 = phaseCalc(CONFIG.phase3);
const p4 = phaseCalc(CONFIG.phase4);

const staffMonthlyCost =
  CONFIG.staffing.estimatedHoursPerMonth * CONFIG.staffing.contractorHourlyRate;
const staffPhase2Total =
  staffMonthlyCost * CONFIG.staffing.monthsCoveredInPhase2;

// Phase 2 margins computed after staffing absorption — this is the real margin
// Bobbie should negotiate from, since staffing is a true delivery cost.
const p2FullCost = p2.totalCost + staffPhase2Total;
const p2MarginAtMin = ((CONFIG.phase2.proposedFeeMin - p2FullCost) / CONFIG.phase2.proposedFeeMin) * 100;
const p2MarginAtMax = ((CONFIG.phase2.proposedFeeMax - p2FullCost) / CONFIG.phase2.proposedFeeMax) * 100;

function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-CA");
}

function pct(n: number): string {
  return n.toFixed(0) + "%";
}

function buildPlainText(): string {
  return [
    "HEADWATERS DEVELOPMENT SERVICES",
    "INTERNAL — CONFIDENTIAL",
    "Scope & Staffing Plan: Phases 2, 3, and 4",
    "Deer Lake First Nation · May 2026",
    "",
    "This document is for Bobbie's internal use only. It shows the real cost of delivery,",
    "staffing needs, and the pricing rationale that justifies what goes on the invoice.",
    "Not for distribution.",
    "",
    "═══════════════════════════════════",
    "PHASE 2 — THE BUILD",
    "═══════════════════════════════════",
    `Duration: ${CONFIG.phase2.remoteMonths} months remote + ${CONFIG.phase2.siteVisits} site visits × ${CONFIG.phase2.daysPerVisit} days`,
    "",
    "Time commitment:",
    `  Remote: ${p2.remoteDays} days (${CONFIG.phase2.remoteDaysPerMonth} days/month × ${CONFIG.phase2.remoteMonths} months)`,
    `  On-site: ${p2.onsiteDays} days (${CONFIG.phase2.siteVisits} visits × ${CONFIG.phase2.daysPerVisit} days)`,
    `  Total: ${p2.totalDays} days`,
    "",
    "Cost to deliver:",
    `  Labour: ${fmt(p2.laborCost)} (${p2.totalDays} days × ${CONFIG.hoursPerDay} hrs × ${fmt(CONFIG.hourlyRate)}/hr)`,
    `  Travel: ${fmt(p2.travelCost)} (${CONFIG.phase2.siteVisits} visits × ${fmt(CONFIG.phase2.travelCostPerVisit)})`,
    `  IT/Bookkeeping hire (${CONFIG.staffing.monthsCoveredInPhase2} months): ${fmt(staffPhase2Total)}`,
    `  TOTAL COST: ${fmt(p2.totalCost + staffPhase2Total)}`,
    "",
    `Proposed fee: ${fmt(CONFIG.phase2.proposedFeeMin)} – ${fmt(CONFIG.phase2.proposedFeeMax)}`,
    `Margin range: ${pct(p2MarginAtMin)} – ${pct(p2MarginAtMax)} (incl. hire absorption)`,
    "",
    "Note: IT/bookkeeping hire cost is absorbed into Phase 2 pricing.",
    "",
    "═══════════════════════════════════",
    "PHASE 3 — WINTER PAYOFF",
    "═══════════════════════════════════",
    `Duration: ${CONFIG.phase3.remoteMonths} months remote + ${CONFIG.phase3.siteVisits} site visits × ${CONFIG.phase3.daysPerVisit} days`,
    "",
    "Time commitment:",
    `  Remote: ${p3.remoteDays} days`,
    `  On-site: ${p3.onsiteDays} days`,
    `  Total: ${p3.totalDays} days`,
    "",
    "Cost to deliver:",
    `  Labour: ${fmt(p3.laborCost)}`,
    `  Travel: ${fmt(p3.travelCost)}`,
    `  TOTAL COST: ${fmt(p3.totalCost)}`,
    "",
    `Proposed fee: ${fmt(CONFIG.phase3.proposedFeeMin)} – ${fmt(CONFIG.phase3.proposedFeeMax)}`,
    `Margin range: ${pct(p3.marginAtMin)} – ${pct(p3.marginAtMax)}`,
    "",
    "═══════════════════════════════════",
    "PHASE 4 — HANDOFF & PILOT #2 BRIDGE",
    "═══════════════════════════════════",
    `Duration: ${CONFIG.phase4.remoteMonths} months at ~50% capacity + ${CONFIG.phase4.siteVisits} site visits × ${CONFIG.phase4.daysPerVisit} days`,
    "",
    "Time commitment:",
    `  Remote: ${p4.remoteDays} days`,
    `  On-site: ${p4.onsiteDays} days`,
    `  Total: ${p4.totalDays} days`,
    "",
    "Cost to deliver:",
    `  Labour: ${fmt(p4.laborCost)}`,
    `  Travel: ${fmt(p4.travelCost)}`,
    `  TOTAL COST: ${fmt(p4.totalCost)}`,
    "",
    `Proposed fee: ${fmt(CONFIG.phase4.proposedFeeMin)} – ${fmt(CONFIG.phase4.proposedFeeMax)}`,
    `Margin range: ${pct(p4.marginAtMin)} – ${pct(p4.marginAtMax)}`,
    "",
    "═══════════════════════════════════",
    "STAFFING — IT / BOOKKEEPING HIRE",
    "═══════════════════════════════════",
    "Role: Part-time IT/bookkeeping contractor",
    `Estimated hours/month: ${CONFIG.staffing.estimatedHoursPerMonth} hrs`,
    `Rate: ${fmt(CONFIG.staffing.contractorHourlyRate)}/hr`,
    `Monthly cost: ${fmt(staffMonthlyCost)}`,
    `Phase 2 total (${CONFIG.staffing.monthsCoveredInPhase2} months): ${fmt(staffPhase2Total)}`,
    "",
    "What this protects against:",
    "  · Domains & passwords — credentials owned by the community, not a departing consultant",
    "  · Comms — email accounts, distribution lists, and shared inboxes stay operational",
    "  · HST & government reporting — remittances filed correctly and on time from day one",
    "",
    "How it's priced: absorbed into Phase 2 fee. Not a separate line item on the invoice.",
  ].join("\n");
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const PAGE: CSSProperties = {
  width: "8.5in",
  minHeight: "11in",
  background: "#faf8f4",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  pageBreakAfter: "always",
  breakAfter: "page",
};

const LABEL: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.58rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  color: "rgba(31,61,46,0.45)",
  marginBottom: "0.1rem",
};

const SECTION_HEAD: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "1.5rem",
  fontWeight: 900,
  color: "var(--evergreen)",
  lineHeight: 1.05,
  letterSpacing: "-0.01em",
  marginBottom: "0.04in",
};

const BODY: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.78rem",
  color: "var(--ink)",
  lineHeight: 1.6,
};

const MUTED: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.72rem",
  color: "var(--muted)",
  lineHeight: 1.55,
};

function DataRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      borderBottom: "1px solid rgba(31,61,46,0.08)",
      paddingBottom: "0.055in",
      marginBottom: "0.055in",
      gap: "0.5in",
    }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.74rem", color: "var(--muted)" }}>{label}</span>
      <span style={{
        fontFamily: "var(--font-serif)",
        fontSize: accent ? "0.88rem" : "0.78rem",
        fontWeight: accent ? 700 : 500,
        color: accent ? "var(--evergreen)" : "var(--ink)",
        whiteSpace: "nowrap",
      }}>{value}</span>
    </div>
  );
}

function FeeBlock({ min, max, marginMin, marginMax, marginNote }: { min: number; max: number; marginMin: number; marginMax: number; marginNote?: string }) {
  return (
    <div style={{
      background: "var(--evergreen)",
      borderRadius: 6,
      padding: "0.18in 0.24in",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "0.3in",
    }}>
      <div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,237,224,0.55)", marginBottom: "0.04rem" }}>
          Proposed fee to client
        </p>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1 }}>
          {fmt(min)} – {fmt(max)}
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "rgba(244,237,224,0.55)", marginTop: "0.03rem" }}>CAD · excl. HST</p>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,237,224,0.55)", marginBottom: "0.04rem" }}>
          Gross margin
        </p>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1 }}>
          {pct(marginMin)} – {pct(marginMax)}
        </p>
        {marginNote && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "rgba(244,237,224,0.55)", marginTop: "0.03rem" }}>{marginNote}</p>
        )}
      </div>
    </div>
  );
}

function PhaseSection({
  phaseLabel,
  subtitle,
  description,
  remoteDays,
  remoteMonths,
  remoteDaysPerMonth,
  onsiteDays,
  siteVisits,
  daysPerVisit,
  travelCostPerVisit,
  totalDays,
  laborCost,
  travelCost,
  extraCostLabel,
  extraCostValue,
  totalCost,
  feeMin,
  feeMax,
  marginMin,
  marginMax,
  marginNote,
  notes,
  pageNum,
}: {
  phaseLabel: string;
  subtitle: string;
  description: string;
  remoteDays: number;
  remoteMonths: number;
  remoteDaysPerMonth: number;
  onsiteDays: number;
  siteVisits: number;
  daysPerVisit: number;
  travelCostPerVisit: number;
  totalDays: number;
  laborCost: number;
  travelCost: number;
  extraCostLabel?: string;
  extraCostValue?: number;
  totalCost: number;
  feeMin: number;
  feeMax: number;
  marginMin: number;
  marginMax: number;
  marginNote?: string;
  notes?: string[];
  pageNum: string;
}) {
  return (
    <div style={PAGE}>
      {/* Confidential header band */}
      <div style={{ background: "#2c1810", padding: "0.1in 0.7in", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.54rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,180,130,0.75)" }}>
          Internal · Confidential · Not for distribution
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.54rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,180,130,0.5)" }}>
          Headwaters Development Services
        </p>
      </div>

      {/* Phase header */}
      <div style={{ background: "var(--evergreen)", padding: "0.38in 0.7in 0.32in", flexShrink: 0 }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,237,224,0.5)", marginBottom: "0.1rem" }}>
          {phaseLabel}
        </p>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "0.1rem" }}>
          {subtitle}
        </h2>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "rgba(244,237,224,0.7)", lineHeight: 1.55, maxWidth: "5.6in" }}>
          {description}
        </p>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: "0.36in 0.7in 0.3in", display: "flex", flexDirection: "column", gap: "0.28in" }}>

        {/* Time commitment + Cost to deliver side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3in" }}>

          {/* Time commitment */}
          <div>
            <p style={{ ...LABEL, marginBottom: "0.12in" }}>Time commitment</p>
            <DataRow
              label={`Remote (${remoteMonths} mo × ${remoteDaysPerMonth} days/mo)`}
              value={`${remoteDays} days`}
            />
            <DataRow
              label={`On-site (${siteVisits} visits × ${daysPerVisit} days)`}
              value={`${onsiteDays} days`}
            />
            <DataRow
              label="Total Headwaters days"
              value={`${totalDays} days`}
              accent
            />
            <p style={{ ...MUTED, marginTop: "0.1in" }}>
              {`${totalDays} days × ${CONFIG.hoursPerDay} hrs = ${(totalDays * CONFIG.hoursPerDay).toLocaleString()} billable hours`}
            </p>
          </div>

          {/* Cost to deliver */}
          <div>
            <p style={{ ...LABEL, marginBottom: "0.12in" }}>Cost to deliver</p>
            <DataRow
              label={`Labour (${totalDays} days × ${CONFIG.hoursPerDay} hrs × ${fmt(CONFIG.hourlyRate)}/hr)`}
              value={fmt(laborCost)}
            />
            <DataRow
              label={`Travel (${siteVisits} visits × ${fmt(travelCostPerVisit)})`}
              value={fmt(travelCost)}
            />
            {extraCostLabel && extraCostValue !== undefined && (
              <DataRow label={extraCostLabel} value={fmt(extraCostValue)} />
            )}
            <DataRow label="Total cost to deliver" value={fmt(totalCost)} accent />
          </div>
        </div>

        {/* Fee block */}
        <FeeBlock min={feeMin} max={feeMax} marginMin={marginMin} marginMax={marginMax} marginNote={marginNote} />

        {/* Notes */}
        {notes && notes.length > 0 && (
          <div style={{ background: "rgba(184,90,62,0.06)", borderLeft: "3px solid rgba(184,90,62,0.35)", padding: "0.14in 0.2in", borderRadius: "0 4px 4px 0" }}>
            <p style={{ ...LABEL, marginBottom: "0.08in" }}>Notes</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.07in" }}>
              {notes.map((note, i) => (
                <p key={i} style={MUTED}>{note}</p>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(31,61,46,0.1)", paddingTop: "0.15in" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "rgba(31,61,46,0.25)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Internal — not for distribution
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "rgba(31,61,46,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{pageNum}</p>
        </div>

      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function InternalScopePlan() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-internal-scope-plan.pdf"
        onCopyPlainText={buildPlainText}
      />

      <div id="pdf-target" style={{ background: "#ccc9c0" }}>

        {/* ── COVER ── */}
        <div style={{ ...PAGE, background: "var(--evergreen)" }}>
          <div style={{ background: "#2c1810", padding: "0.12in 0.7in", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.54rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,180,130,0.85)", fontWeight: 700 }}>
              ⚑ Internal · Confidential · Not for distribution
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.54rem", color: "rgba(244,180,130,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              May 2026
            </p>
          </div>

          <div style={{ flex: 1, padding: "0.9in 0.7in 0.6in", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.18in", marginBottom: "0.5in" }}>
                <div style={{ width: "0.55in", height: 3, background: "var(--rust)" }} />
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,237,224,0.45)" }}>
                  Headwaters Development Services
                </p>
              </div>

              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "3.8rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.0, letterSpacing: "-0.025em", marginBottom: "0.28in", fontVariationSettings: '"WONK" 0' }}>
                Internal Scope<br />&amp; Staffing Plan
              </h1>

              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.88rem", color: "rgba(244,237,224,0.65)", lineHeight: 1.65, maxWidth: "4.8in", marginBottom: "0.22in" }}>
                The back-of-house numbers for Phases 2, 3, and 4 of the Deer Lake First Nation community store engagement. This is the document Bobbie negotiates from — not the client-facing pitch.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.18in", maxWidth: "5.5in", marginTop: "0.5in" }}>
                {[
                  { label: "Phase 2 fee range", value: `${fmt(CONFIG.phase2.proposedFeeMin)}–${fmt(CONFIG.phase2.proposedFeeMax)}` },
                  { label: "Phase 3 fee range", value: `${fmt(CONFIG.phase3.proposedFeeMin)}–${fmt(CONFIG.phase3.proposedFeeMax)}` },
                  { label: "Phase 4 fee range", value: `${fmt(CONFIG.phase4.proposedFeeMin)}–${fmt(CONFIG.phase4.proposedFeeMax)}` },
                ].map((item) => (
                  <div key={item.label} style={{ borderTop: "2px solid var(--rust)", paddingTop: "0.14in" }}>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,237,224,0.45)", marginBottom: "0.06rem" }}>
                      {item.label}
                    </p>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1.1 }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ borderTop: "1px solid rgba(244,237,224,0.12)", paddingTop: "0.2in", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "rgba(244,237,224,0.45)", marginBottom: "0.04rem" }}>bobbie@ourheadwaters.ca</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "rgba(244,237,224,0.35)" }}>ourheadwaters.ca</p>
                </div>
                <div style={{ background: "rgba(244,237,224,0.08)", border: "1px solid rgba(244,237,224,0.15)", borderRadius: 4, padding: "0.1in 0.18in" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,237,224,0.4)", marginBottom: "0.03rem" }}>
                    Hourly rate used
                  </p>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.92rem", fontWeight: 700, color: "rgba(244,237,224,0.7)" }}>
                    {fmt(CONFIG.hourlyRate)}/hr
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ width: "100%", height: "0.12in", flexShrink: 0, background: "var(--rust)" }} />
        </div>

        {/* ── PHASE 2 ── */}
        <PhaseSection
          phaseLabel="Phase 2 · The Build · 4 months"
          subtitle="The store opens. We make sure it works."
          description={`Full-time remote presence (${CONFIG.phase2.remoteMonths} months) plus ${CONFIG.phase2.siteVisits} site visits of ${CONFIG.phase2.daysPerVisit} days each. Operator couple is hired and in place. Supply chain is live. Headwaters is on the ground once a month catching problems early. IT/bookkeeping hire is stood up and absorbed into this phase's fee.`}
          remoteDays={p2.remoteDays}
          remoteMonths={CONFIG.phase2.remoteMonths}
          remoteDaysPerMonth={CONFIG.phase2.remoteDaysPerMonth}
          onsiteDays={p2.onsiteDays}
          siteVisits={CONFIG.phase2.siteVisits}
          daysPerVisit={CONFIG.phase2.daysPerVisit}
          travelCostPerVisit={CONFIG.phase2.travelCostPerVisit}
          totalDays={p2.totalDays}
          laborCost={p2.laborCost}
          travelCost={p2.travelCost}
          extraCostLabel={`IT/bookkeeping hire (${CONFIG.staffing.monthsCoveredInPhase2} months × ${fmt(staffMonthlyCost)}/mo)`}
          extraCostValue={staffPhase2Total}
          totalCost={p2FullCost}
          feeMin={CONFIG.phase2.proposedFeeMin}
          feeMax={CONFIG.phase2.proposedFeeMax}
          marginMin={p2MarginAtMin}
          marginMax={p2MarginAtMax}
          marginNote="incl. hire absorption"
          notes={[
            "Summer freight runs by air — margins will be tight and that's planned for. The store is proving it can operate, not proving it can profit. Numbers improve when winter roads open.",
            "IT/bookkeeping hire is not a separate line on the client invoice. It's baked into the Phase 2 fee. This protects Bobbie's time and keeps the client from nickel-and-diming the admin function.",
            "Phase 2 fee is confirmed at the end of Phase 1 once actual scope and staffing needs are clear. The range above is the negotiating window.",
          ]}
          pageNum="2 of 5"
        />

        {/* ── PHASE 3 ── */}
        <PhaseSection
          phaseLabel="Phase 3 · Winter Payoff · 3 months"
          subtitle="Winter roads open. The economics flip."
          description={`Lighter presence — ${CONFIG.phase3.remoteMonths} months remote at roughly ${CONFIG.phase3.remoteDaysPerMonth} days/month, plus ${CONFIG.phase3.siteVisits} site visits of ${CONFIG.phase3.daysPerVisit} days each. Bulk truck delivery replaces air freight. Cost per item drops. The goal is to lock in the lower-cost supply chain and produce a clean financial record the band can use with funders.`}
          remoteDays={p3.remoteDays}
          remoteMonths={CONFIG.phase3.remoteMonths}
          remoteDaysPerMonth={CONFIG.phase3.remoteDaysPerMonth}
          onsiteDays={p3.onsiteDays}
          siteVisits={CONFIG.phase3.siteVisits}
          daysPerVisit={CONFIG.phase3.daysPerVisit}
          travelCostPerVisit={CONFIG.phase3.travelCostPerVisit}
          totalDays={p3.totalDays}
          laborCost={p3.laborCost}
          travelCost={p3.travelCost}
          totalCost={p3.totalCost}
          feeMin={CONFIG.phase3.proposedFeeMin}
          feeMax={CONFIG.phase3.proposedFeeMax}
          marginMin={p3.marginAtMin}
          marginMax={p3.marginAtMax}
          notes={[
            "Phase 3 scope is discussed after Phase 2 — the operating rhythm of the store determines what level of support is actually needed.",
            "Deliverable: a clean financial record showing what the store earns in its first winter. This is the document that makes future grant applications credible.",
            "IT/bookkeeping hire is already in place from Phase 2 — no additional absorption needed here. The contractor continues independently.",
          ]}
          pageNum="3 of 5"
        />

        {/* ── PHASE 4 ── */}
        <PhaseSection
          phaseLabel="Phase 4 · Handoff & Pilot #2 Bridge · 6 months"
          subtitle="50% capacity. Community owns it. Pilot #2 is named."
          description={`${CONFIG.phase4.remoteMonths} months at roughly ${CONFIG.phase4.remoteDaysPerMonth} days/month — 50% of a standard working month. Community engagement, Codetry handoff, feast/celebration, and documentation of everything needed to run Pilot #2 without starting from scratch. ${CONFIG.phase4.siteVisits} site visits of ${CONFIG.phase4.daysPerVisit} days (shorter, handoff-focused).`}
          remoteDays={p4.remoteDays}
          remoteMonths={CONFIG.phase4.remoteMonths}
          remoteDaysPerMonth={CONFIG.phase4.remoteDaysPerMonth}
          onsiteDays={p4.onsiteDays}
          siteVisits={CONFIG.phase4.siteVisits}
          daysPerVisit={CONFIG.phase4.daysPerVisit}
          travelCostPerVisit={CONFIG.phase4.travelCostPerVisit}
          totalDays={p4.totalDays}
          laborCost={p4.laborCost}
          travelCost={p4.travelCost}
          totalCost={p4.totalCost}
          feeMin={CONFIG.phase4.proposedFeeMin}
          feeMax={CONFIG.phase4.proposedFeeMax}
          marginMin={p4.marginAtMin}
          marginMax={p4.marginAtMax}
          notes={[
            "The feast/celebration visit is one of the two on-site trips. It's not fluff — it's the community recognition moment that closes the loop and makes the next pilot possible.",
            "Codetry handoff includes everything in a format the community owns outright. No ongoing login, no subscription, no dependency on Headwaters to keep it running.",
            "By end of Phase 4, Pilot #2 should have a named candidate community, not just a waitlist. The scoring sheet from the reserve list drives this.",
          ]}
          pageNum="4 of 5"
        />

        {/* ── STAFFING ── */}
        <div style={PAGE}>
          <div style={{ background: "#2c1810", padding: "0.1in 0.7in", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.54rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,180,130,0.75)" }}>
              Internal · Confidential · Not for distribution
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.54rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,180,130,0.5)" }}>
              Headwaters Development Services
            </p>
          </div>

          <div style={{ background: "var(--rust)", padding: "0.38in 0.7in 0.32in", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "0.1rem" }}>
              Staffing — IT / Bookkeeping Hire
            </p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", fontWeight: 900, color: "white", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "0.1rem", fontVariationSettings: '"WONK" 0' }}>
              The hire that protects<br />everything else.
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.55, maxWidth: "5.6in" }}>
              A part-time IT/bookkeeping contractor — not a full-time employee, not a big-firm accountant. Someone reliable who knows government reporting and can keep the digital infrastructure out of Bobbie's hands.
            </p>
          </div>

          <div style={{ flex: 1, padding: "0.36in 0.7in 0.3in", display: "flex", flexDirection: "column", gap: "0.28in" }}>

            {/* Role + Cost side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3in" }}>

              {/* Role description */}
              <div>
                <p style={{ ...LABEL, marginBottom: "0.14in" }}>What the role covers</p>
                {[
                  {
                    head: "Domains & passwords",
                    body: "Digital credentials are owned by the community from day one — not Bobbie's personal accounts. If someone leaves, nothing breaks.",
                  },
                  {
                    head: "Comms infrastructure",
                    body: "Email accounts, distribution lists, shared inboxes. The store's communication stack stays operational and community-controlled.",
                  },
                  {
                    head: "HST & government reporting",
                    body: "Remittances filed correctly and on time from the moment the store opens. No scrambling at year-end. No penalties for a late filing.",
                  },
                ].map((item) => (
                  <div key={item.head} style={{ borderTop: "1px solid rgba(31,61,46,0.1)", paddingTop: "0.12in", marginBottom: "0.14in" }}>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.04rem" }}>{item.head}</p>
                    <p style={MUTED}>{item.body}</p>
                  </div>
                ))}
              </div>

              {/* Cost breakdown */}
              <div>
                <p style={{ ...LABEL, marginBottom: "0.14in" }}>Cost breakdown</p>
                <DataRow label="Hours per month" value={`${CONFIG.staffing.estimatedHoursPerMonth} hrs`} />
                <DataRow label="Contractor rate" value={`${fmt(CONFIG.staffing.contractorHourlyRate)}/hr`} />
                <DataRow label="Monthly cost" value={fmt(staffMonthlyCost)} />
                <DataRow label={`Phase 2 total (${CONFIG.staffing.monthsCoveredInPhase2} months)`} value={fmt(staffPhase2Total)} accent />

                <div style={{ background: "rgba(184,90,62,0.08)", borderLeft: "3px solid var(--rust)", padding: "0.13in 0.16in", borderRadius: "0 4px 4px 0", marginTop: "0.18in" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.08rem" }}>
                    How it's priced
                  </p>
                  <p style={MUTED}>
                    Absorbed into the Phase 2 fee. It does not appear as a separate line item on the client invoice. The client is paying for the whole Phase 2 engagement — the hire is Headwaters' cost of delivery.
                  </p>
                </div>
              </div>
            </div>

            {/* What this protects Bobbie from */}
            <div style={{ background: "rgba(31,61,46,0.05)", border: "1px solid rgba(31,61,46,0.12)", borderRadius: 6, padding: "0.18in 0.24in" }}>
              <p style={{ ...LABEL, marginBottom: "0.12in" }}>What this protects Bobbie from</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.4in" }}>
                {[
                  "Being the de-facto IT person for a remote store while also running the engagement",
                  "Credentials and passwords living in her personal accounts when the engagement ends",
                  "A late HST filing that creates legal exposure for the band in year one",
                  "Year-end scramble when the bookkeeper has never seen a remote community store before",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.12in", alignItems: "flex-start", marginBottom: "0.1in" }}>
                    <span style={{ color: "var(--evergreen)", fontWeight: 700, fontSize: "0.8rem", flexShrink: 0, lineHeight: 1.5 }}>→</span>
                    <p style={MUTED}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(31,61,46,0.1)", paddingTop: "0.15in" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "rgba(31,61,46,0.25)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Internal — not for distribution
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "rgba(31,61,46,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>5 of 5</p>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
