/**
 * OnePager.tsx — print-format one-pager for the contractor's CFO
 *
 * Phase-based pricing model. All dollar figures from @/data/budgetScenarios.
 */

import { useState, useEffect } from "react";
import { PHASES, PHASE_COSTS, PRACTITIONER_RATE, ENGAGEMENT_TOTAL, fmt, fmtK } from "@/data/budgetScenarios";
import { TEAM } from "@/data/contractBaselines";
import { loadEdits } from "@/lib/costReview";

const CREAM     = "#f4ede0";
const DARK      = "#1f3d2e";
const AMBER     = "#b85a3e";
const MUTED     = "#6b7665";
const RULE      = "#c8bfa7";
const TEXT      = "#2a2520";
const INK       = "#2a2520";
const GREEN     = "#2a6b3e";

function cell(content: string | number | null, right = false, bold = false, small = false) {
  return (
    <td
      style={{
        padding: "3pt 4pt",
        textAlign: right ? "right" : "left",
        fontWeight: bold ? 600 : 400,
        fontSize: small ? "7.5pt" : "9pt",
        color: content === null ? MUTED : INK,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {content === null ? "—" : typeof content === "number" ? fmt(content) : content}
    </td>
  );
}

export default function OnePager() {
  const [hasOverrides, setHasOverrides] = useState(false);

  useEffect(() => {
    const edits = loadEdits();
    setHasOverrides(edits.some((e) => !e.skipped && e.delta !== 0));
  }, []);

  const totalDays = PHASES.reduce((s, p) => s + p.practDays, 0);
  const totalMin  = PHASES.reduce((s, p) => s + (p.feeFlat ?? p.feeMin ?? 0), 0);
  const totalMax  = PHASES.reduce((s, p) => s + (p.feeFlat ?? p.feeMax ?? 0), 0);

  return (
    <div style={{ background: "#d8d2c8", minHeight: "100vh" }}>
      <div
        id="pdf-target"
        style={{
          width: "8.5in",
          margin: "0 auto",
          background: CREAM,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "9pt",
          color: TEXT,
        }}
      >
        {/* ── PAGE 1 ─────────────────────────────────────────────── */}
        <div
          className="page-letter"
          style={{ width: "8.5in", minHeight: "11in", padding: "0.55in 0.65in", position: "relative" }}
        >
          {/* Amber rule */}
          <div style={{ height: "3pt", background: AMBER, margin: "0 0 14pt" }} />

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14pt" }}>
            <div>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "3pt" }}>
                Practitioner Operating Plan
              </div>
              <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "22pt", fontWeight: 700, color: DARK, lineHeight: 1.1, marginBottom: "4pt" }}>
                Engagement Pricing — Phase Model
              </div>
              <div style={{ fontSize: "9pt", color: MUTED, lineHeight: 1.5 }}>
                Phase-based fixed fees. ${PRACTITIONER_RATE}/hr practitioner baseline.
                Each phase is a standalone deliverable — the community can stop at any point.
                {hasOverrides && " ★ cost-review notes applied."}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>Confidential</div>
              <div style={{ fontSize: "8pt", color: MUTED, marginTop: "2pt" }}>Headwaters Development Services</div>
            </div>
          </div>

          {/* Introduction */}
          <p style={{ fontSize: "9.5pt", lineHeight: 1.5, color: TEXT, marginBottom: "12pt" }}>
            This engagement is structured in four phases. Phase 1 is priced as a flat fee ({fmt(28_000)}); Phases 2–4 are
            ranges confirmed with the client at the start of each phase. The practitioner carries all roles in Phase 1.
            A Community Coordinator — hired through the 807 Food Co-operative or Deer Lake band council — is the priority
            staffing gap for Phase 2 onward. IT subcontracting is engaged per phase for QA review.
          </p>

          {/* ── Section 1: Phase pricing table ───────────────────── */}
          <div style={{ marginBottom: "12pt" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "5pt" }}>
              Phase pricing — stop-at-any-point structure
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", tableLayout: "fixed" }}>
              <thead>
                <tr style={{ borderBottom: `1.5pt solid ${RULE}`, color: MUTED, fontWeight: 600 }}>
                  <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "8%"  }}>Ph.</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "14%" }}>Label</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "30%" }}>Deliverables</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "right", width: "11%" }}>Days</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "right", width: "11%" }}>Travel</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "right", width: "13%" }}>Cost</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "right", width: "13%" }}>Client fee</th>
                </tr>
              </thead>
              <tbody>
                {PHASE_COSTS.map((pc, i) => (
                  <tr key={pc.phase.id} style={{ borderBottom: `0.5pt solid ${RULE}`, background: i % 2 === 0 ? "transparent" : "rgba(200,191,167,0.08)" }}>
                    {cell(pc.phase.num)}
                    {cell(pc.phase.label, false, true)}
                    {cell(pc.phase.headline + " · " + pc.phase.duration)}
                    {cell(pc.phase.practDays, true)}
                    {cell(pc.phase.travelVisits === 0 ? "—" : `${pc.phase.travelVisits}× ${fmt(pc.travelCost)}`)}
                    {cell(pc.totalCost, true)}
                    <td style={{ padding: "3pt 4pt", textAlign: "right", fontWeight: 700, fontSize: "9pt", color: AMBER }}>
                      {pc.feeDisplay}
                    </td>
                  </tr>
                ))}
                <tr style={{ borderTop: `1.5pt solid ${RULE}`, background: "rgba(31,61,46,0.04)" }}>
                  <td colSpan={3} style={{ padding: "5pt 4pt", fontWeight: 700, fontSize: "9.5pt", color: DARK }}>Full engagement total</td>
                  <td style={{ padding: "5pt 4pt", textAlign: "right", fontWeight: 700, fontSize: "9.5pt", color: DARK }}>{totalDays}</td>
                  <td></td>
                  <td></td>
                  <td style={{ padding: "5pt 4pt", textAlign: "right", fontWeight: 700, fontSize: "9.5pt", color: AMBER }}>
                    {fmt(totalMin)}{totalMin !== totalMax ? `–${fmt(totalMax)}` : ""}
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ fontSize: "7.5pt", color: MUTED, marginTop: "3pt", lineHeight: 1.35 }}>
              Phase 1 is a flat fee. Phases 2–4 are ranges — confirmed with the client at the start of each phase.
              Cost column shows practitioner labour + travel + subcontract costs. Fee is what the client is invoiced.
            </div>
          </div>

          {/* ── Section 2: Engagement team ───────────────────────── */}
          <div style={{ marginBottom: "12pt" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "5pt" }}>
              Engagement team — current model
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", tableLayout: "fixed" }}>
              <thead>
                <tr style={{ borderBottom: `1.5pt solid ${RULE}`, color: MUTED, fontWeight: 600 }}>
                  <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "30%" }}>Role</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "right", width: "14%" }}>Rate / hr</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "12%" }}>Type</th>
                  <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "44%" }}>Note</th>
                </tr>
              </thead>
              <tbody>
                {TEAM.map((m, i) => (
                  <tr key={m.roleId} style={{ borderBottom: `0.5pt solid ${RULE}`, background: i % 2 === 0 ? "transparent" : "rgba(200,191,167,0.08)" }}>
                    {cell(m.label, false, true)}
                    <td style={{ padding: "3pt 4pt", textAlign: "right", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", color: m.rate > 0 ? INK : MUTED }}>
                      {m.rate > 0 ? `$${m.rate}` : "—"}
                    </td>
                    <td style={{ padding: "3pt 4pt", fontSize: "8pt",
                      color: m.type === "practitioner" ? GREEN : m.type === "pending" ? "#7a5c00" : MUTED }}>
                      {m.type === "pending" ? "pending" : m.type}
                    </td>
                    {cell(m.note ?? null, false, false, true)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Section 3: Key commitments ───────────────────────── */}
          <div style={{ background: DARK, borderRadius: "4pt", padding: "12pt 16pt", marginBottom: "12pt" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,237,224,0.5)", marginBottom: "6pt" }}>
              Key commitments
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10pt" }}>
              {[
                { label: "Phase 1 flat fee", value: fmt(28_000), note: "Discovery, audit, operations guide, hiring plan, grant roadmap" },
                { label: "Practitioner rate", value: `$${PRACTITIONER_RATE}/hr`, note: "Billing baseline — phase fees are priced on outcomes, not hours" },
                { label: "807 distribution", value: "2027", note: "807 Food Co-operative supply line activates — changes bulk economics" },
                { label: "Community Coordinator", value: "Priority hire", note: "807 or Deer Lake band council. Dryden-based, food handler certified." },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,237,224,0.5)", marginBottom: "2pt" }}>{item.label}</div>
                  <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "13pt", fontWeight: 700, color: CREAM, marginBottom: "2pt" }}>{item.value}</div>
                  <div style={{ fontSize: "8pt", color: "rgba(244,237,224,0.7)", lineHeight: 1.4 }}>{item.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Footer ────────────────────────────────────────────── */}
          <div style={{ marginTop: "auto", paddingTop: "10pt", borderTop: `1pt solid ${RULE}`, display: "flex", justifyContent: "space-between", fontSize: "7.5pt", color: MUTED }}>
            <div>Headwaters Development Services · Wabigoon, Ontario · Treaty 3 Territory</div>
            <div>bobbie@ourheadwaters.ca · 807 220 3654 · ourheadwaters.ca</div>
          </div>
        </div>
      </div>
    </div>
  );
}
