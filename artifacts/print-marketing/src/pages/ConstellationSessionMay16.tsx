import type { CSSProperties } from "react";
import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";
const INK = "#1a1a1a";
const TEAL = "#0f766e";

const PAGE: CSSProperties = {
  width: "8.5in",
  minHeight: "11in",
  background: CREAM,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  fontFamily: "Inter, system-ui, sans-serif",
  color: INK,
};

const LABEL: CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: "0.5rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  color: RUST,
  marginBottom: "0.1in",
};

const base = import.meta.env.BASE_URL;

type StatusKind = "proven" | "in-progress" | "needs-proof" | "locked" | "open";

function StatusChip({ kind }: { kind: StatusKind }) {
  const map: Record<StatusKind, { label: string; bg: string; color: string }> = {
    proven:       { label: "Proven",      bg: EVERGREEN,            color: CREAM },
    "in-progress":{ label: "In progress", bg: "rgba(15,118,110,0.12)", color: TEAL },
    "needs-proof":{ label: "Needs proof", bg: "rgba(184,90,62,0.12)", color: RUST },
    locked:       { label: "Locked",      bg: RUST,                 color: CREAM },
    open:         { label: "Open",        bg: "rgba(107,118,101,0.15)", color: MUTED },
  };
  const s = map[kind];
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: "0.44rem", fontWeight: 700,
      letterSpacing: "0.09em", textTransform: "uppercase",
      padding: "0.03in 0.1in", borderRadius: 3,
      flexShrink: 0, whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  );
}

const constellationRows = [
  {
    zone: "Zone 0",
    label: "Household",
    projects: "Saltbox · North Star · Family Buckets · xbuckets · Eave · Bright Side",
    shield: "Local-first, no backend (Saltbox) · Non-custodial (xbuckets) · PHI-free (Bright Side)",
  },
  {
    zone: "Zone 1",
    label: "Local community",
    projects: "Sandbox (60 Dryden homeschool families)",
    shield: "Pull-only · No algorithm · Scrypt passphrase identity",
  },
  {
    zone: "Zone 3",
    label: "Organizational",
    projects: "807 Co-op · Deadhead · Market Mosaic · Grants Finder · 807 Garden · Rootstock",
    shield: "Eave: 4-layer enforcement (Clerk + RBAC + Object ACL + AES-256 at rest) · Tenant seam",
  },
  {
    zone: "Zone 4",
    label: "Regen Revolution",
    projects: "NWO Regional Abattoir ops (CCM)",
    shield: "Single-animal traceability scope bound · No carcass splitting",
  },
  {
    zone: "Zone 5",
    label: "Edge",
    projects: "Dam Days · The Shallows",
    shield: "No algorithm · No self-promotion · Flag-to-hide moderation only",
  },
];

const ledgerEntries = [
  {
    name: "xbuckets — Household Finance on XRPL",
    status: "in-progress" as StatusKind,
    note: "P2P settlement works. Vendor settlement needs CU railing — credit union must sit between the wallet and the merchant rail. Architecture is the proof point; CU integration is UI only.",
  },
  {
    name: "Saltbox — Personal Disability Tool",
    status: "in-progress" as StatusKind,
    note: "In daily use. Others testing. User = developer = proof. First Zone 0 individual proof in the constellation. Proof advances when the methodology serves a second person's disability profile.",
  },
  {
    name: "NWO Regional Abattoir — Operations Tool",
    status: "in-progress" as StatusKind,
    note: "Built and working in dev. Not deployed. Notification delivery is the one unbuilt piece. Pilot timing is an open decision. Regen farming context (Zone 4 vision) is real but not yet built into features.",
  },
  {
    name: "Rootstock — Headwaters Platform Licensing",
    status: "needs-proof" as StatusKind,
    note: "Pilot-ready. Name locked today. 807 is the proof case. Tenant seam exists; second tenant does not. Proof comes when a second co-op signs on independently.",
  },
];

const decisionsToday = [
  { text: "Zone 4 renamed Arc → Clearing. Arc was a single-producer transition frame; Clearing is the correct voluntary formation layer. Abattoir pilot remains valid as one Zone 4 expression.", status: "locked" as StatusKind },
  { text: "Lodge confirmed as the Zone 1 identity layer name. Rename test run against Membership, Profile, and Household ID — all three cracked on Zone 1 constraints. §5.9 closed.", status: "locked" as StatusKind },
  { text: "Watershed disambiguation resolved. Watershed concept (diversified income streams, flow not restriction) belongs exclusively to Zone 1. Zone 5's watershed.replit.app URL is infrastructure legacy with no conceptual weight.", status: "locked" as StatusKind },
  { text: "Z5→Z1 direct feed documented as a named structural path. Massive Zone 5 public attention can feed the household watershed directly, bypassing Z2-3-4. Ideal standby posture: both the Z2-3-4 engine and Z5 direct feed running simultaneously.", status: "locked" as StatusKind },
  { text: "Mama Support Hub Phase 1 shipped. Task-tracker language replaced across every member-facing surface: Tasks→Needs, Slots→Moments, Claim→I've got it, Impact section removed entirely.", status: "locked" as StatusKind },
  { text: "Sandbox circle pulse shipped. calendarToken bridge confirmed as the correct layer (not liveShare). Count-only pulse (no names, no content), deliberate opt-in each time, one ping per household per week.", status: "locked" as StatusKind },
  { text: "Mama Support Hub Phase 2 dissolution model spec approved. Archived vs dissolved distinction confirmed. First name retained in circle record, surname + all PII cleared. Memories: export-then-delete before dissolution.", status: "locked" as StatusKind },
];

const openDecisions = [
  { text: "Mama Support Hub Phase 3 (direct ask flow) — ready to build. Supported person or any circle member surfaces an urgent need without organizer scaffolding. One step, no project, no slots.", urgency: "Send prompt when ready" },
  { text: "Eave governance document — what it means, who consented, how crossing is permitted. Needed before Rootstock goes to external pilots.", urgency: "Before Rootstock pilots" },
];

const architecturalPattern = [
  { project: "xbuckets", shield: "Custody-free", hold: "User funds", enables: "Procurable by any FI without becoming an MSB" },
  { project: "Bright Side", shield: "PHI-free", hold: "Medical identifiers", enables: "Procurable by any care home without a BAA" },
  { project: "Headwaters", shield: "Split-view", hold: "Nothing hidden or leaked", enables: "Full operating reality + public window from one source" },
  { project: "Saltbox", shield: "Local-first", hold: "Zero personal data server-side", enables: "Procurable without a privacy officer or data custodian" },
];

export function ConstellationSessionMay16Page() {
  return (
    <div style={PAGE}>

      {/* Header */}
      <div style={{ background: EVERGREEN, padding: "0.3in 0.6in 0.28in", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.12in", marginBottom: "0.1in" }}>
              <img src={`${base}eagle-mark.svg`} alt="" style={{ width: "0.38in", height: "0.31in", opacity: 0.85 }} />
              <div>
                <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.72rem", fontWeight: 700, color: CREAM, margin: 0, lineHeight: 1.1 }}>Headwaters</p>
                <p style={{ fontSize: "0.4rem", color: "rgba(244,237,224,0.5)", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>Development Services</p>
              </div>
            </div>
            <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: CREAM, margin: 0, lineHeight: 1.15 }}>
              Constellation Session<br />
              <span style={{ fontWeight: 400, fontStyle: "italic", fontSize: "1.1rem" }}>May 16, 2026 — What we mapped, decided, and left open</span>
            </h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "0.52rem", color: "rgba(244,237,224,0.5)", margin: 0 }}>Internal reference</p>
            <p style={{ fontSize: "0.52rem", color: "rgba(244,237,224,0.5)", margin: 0 }}>Not for distribution</p>
          </div>
        </div>
      </div>
      <div style={{ height: "0.045in", background: RUST, flexShrink: 0 }} />

      {/* Body */}
      <div style={{ flex: 1, padding: "0.28in 0.6in 0.22in", display: "flex", flexDirection: "column", gap: "0.22in" }}>

        {/* The unifying pattern */}
        <section>
          <p style={LABEL}>The pattern visible across every project</p>
          <div style={{ background: "rgba(31,61,46,0.05)", border: `1px solid rgba(31,61,46,0.12)`, borderRadius: 5, padding: "0.14in 0.18in" }}>
            <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.82rem", fontStyle: "italic", color: EVERGREEN, margin: "0 0 0.1in", lineHeight: 1.45 }}>
              "The regulated weight stays with the institution. The meaningful work — the envelope, the spark-of-joy log, the engagement ledger — belongs to the person."
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.1in" }}>
              {architecturalPattern.map((a) => (
                <div key={a.project} style={{ background: "white", borderRadius: 4, padding: "0.1in 0.12in", border: "1px solid rgba(31,61,46,0.08)" }}>
                  <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.68rem", fontWeight: 700, color: EVERGREEN, margin: "0 0 0.04in" }}>{a.project}</p>
                  <p style={{ fontSize: "0.55rem", fontWeight: 700, color: RUST, margin: "0 0 0.03in", letterSpacing: "0.04em" }}>{a.shield}</p>
                  <p style={{ fontSize: "0.54rem", color: MUTED, margin: 0, lineHeight: 1.5 }}>Doesn't hold: {a.hold}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={{ height: 1, background: "rgba(31,61,46,0.1)" }} />

        {/* Constellation map */}
        <section>
          <p style={LABEL}>Personal constellation — Replit project zones (not the same as Codetry model zones)</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.06in" }}>
            {constellationRows.map((r) => (
              <div key={r.zone} style={{ display: "grid", gridTemplateColumns: "0.55in 0.75in 1fr 1.6in", gap: "0.1in", alignItems: "start", background: "white", borderRadius: 4, padding: "0.09in 0.12in", border: "1px solid rgba(31,61,46,0.08)" }}>
                <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.65rem", fontWeight: 700, color: EVERGREEN, margin: 0 }}>{r.zone}</p>
                <p style={{ fontSize: "0.55rem", color: RUST, fontWeight: 600, margin: 0, letterSpacing: "0.03em" }}>{r.label}</p>
                <p style={{ fontSize: "0.58rem", color: INK, margin: 0, lineHeight: 1.5 }}>{r.projects}</p>
                <p style={{ fontSize: "0.52rem", color: MUTED, margin: 0, lineHeight: 1.5 }}>{r.shield}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.5rem", color: MUTED, marginTop: "0.07in", marginBottom: 0, fontStyle: "italic" }}>
            Codetry model zones (Zone 0=Household → Zone 1=Local → Zone 3=Org → Zone 4=Clearing → Zone 5=Edge) are the design framework being built, not the Replit project map.
          </p>
        </section>

        <div style={{ height: 1, background: "rgba(31,61,46,0.1)" }} />

        {/* Two columns: ledger additions + decisions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.25in" }}>

          {/* Ledger additions */}
          <section>
            <p style={LABEL}>Added to the strategic ledger today</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.08in" }}>
              {ledgerEntries.map((e) => (
                <div key={e.name} style={{ background: "white", borderRadius: 4, padding: "0.1in 0.12in", border: "1px solid rgba(31,61,46,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.08in", marginBottom: "0.05in" }}>
                    <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.64rem", fontWeight: 700, color: EVERGREEN, margin: 0, lineHeight: 1.3 }}>{e.name}</p>
                    <StatusChip kind={e.status} />
                  </div>
                  <p style={{ fontSize: "0.55rem", color: MUTED, margin: 0, lineHeight: 1.55 }}>{e.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Decisions + open */}
          <section style={{ display: "flex", flexDirection: "column", gap: "0.14in" }}>
            <div>
              <p style={LABEL}>Decisions made this session</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.05in" }}>
                {decisionsToday.map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.08in", background: "white", borderRadius: 4, padding: "0.08in 0.1in", border: "1px solid rgba(31,61,46,0.08)" }}>
                    <span style={{ fontSize: "0.55rem", color: TEAL, fontWeight: 700, flexShrink: 0, marginTop: "0.01in" }}>✓</span>
                    <p style={{ fontSize: "0.55rem", color: INK, margin: 0, lineHeight: 1.5 }}>{d.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p style={LABEL}>Still open — yours to answer</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.05in" }}>
                {openDecisions.map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.08in", background: "rgba(184,90,62,0.04)", borderRadius: 4, padding: "0.07in 0.1in", border: "1px solid rgba(184,90,62,0.1)" }}>
                    <span style={{ fontSize: "0.55rem", color: RUST, fontWeight: 700, flexShrink: 0, marginTop: "0.01in" }}>○</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.55rem", color: INK, margin: 0, lineHeight: 1.45 }}>{d.text}</p>
                      <p style={{ fontSize: "0.48rem", color: RUST, margin: "0.02in 0 0", fontWeight: 600, letterSpacing: "0.04em" }}>{d.urgency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

      </div>

      {/* Footer */}
      <div style={{ background: EVERGREEN, padding: "0.14in 0.6in", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.62rem", fontWeight: 600, color: CREAM, margin: 0 }}>
          Headwaters Development Services · Wabigoon, Ontario
        </p>
        <p style={{ fontSize: "0.52rem", color: "rgba(244,237,224,0.55)", margin: 0 }}>
          Internal — May 16, 2026 · ourheadwaters.ca
        </p>
      </div>

    </div>
  );
}

export default function ConstellationSessionMay16() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-constellation-session-may16-2026.pdf"
      />
      <div id="pdf-target" style={{ background: "#d8d2c8", padding: "2rem 0" }}>
        <ConstellationSessionMay16Page />
      </div>
    </>
  );
}
