import { useLocation } from "wouter";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const T = {
  bg:         "#1f3d2e",
  paper:      "#f4ede0",
  text:       "#2a2520",
  muted:      "#7a7a6e",
  rule:       "rgba(200,191,167,0.35)",
  accent:     "#b85a3e",
  teal:       "#0f766e",
  evergreen:  "#1f3d2e",
};

type StatusKind = "proven" | "in-progress" | "needs-proof" | "open";

function StatusChip({ kind }: { kind: StatusKind }) {
  const map: Record<StatusKind, { label: string; bg: string; color: string }> = {
    proven:         { label: "Proven",       bg: T.evergreen,                    color: T.paper },
    "in-progress":  { label: "In progress",  bg: "rgba(15,118,110,0.14)",        color: T.teal  },
    "needs-proof":  { label: "Needs proof",  bg: "rgba(184,90,62,0.13)",         color: T.accent },
    open:           { label: "Open",         bg: "rgba(107,118,101,0.15)",        color: T.muted  },
  };
  const s = map[kind];
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: 9, fontWeight: 700,
      letterSpacing: "0.09em", textTransform: "uppercase" as const,
      padding: "2px 7px", borderRadius: 3,
      flexShrink: 0, whiteSpace: "nowrap" as const,
    }}>
      {s.label}
    </span>
  );
}

const zoneRows: { zone: string; label: string; projects: string; shield: string; status: StatusKind }[] = [
  {
    zone: "Zone 0",
    label: "Household",
    projects: "Saltbox · North Star · Family Buckets · xbuckets · Eave · Bright Side",
    shield: "Local-first, no backend (Saltbox) · Non-custodial (xbuckets) · PHI-free (Bright Side)",
    status: "in-progress",
  },
  {
    zone: "Zone 1",
    label: "Local community",
    projects: "Sandbox — 60 Dryden homeschool families",
    shield: "Pull-only · No algorithm · Scrypt passphrase identity",
    status: "proven",
  },
  {
    zone: "Zone 3",
    label: "Organizational",
    projects: "807 Co-op · Deadhead · Market Mosaic · Grants Finder · 807 Garden · Rootstock",
    shield: "Eave: 4-layer enforcement (Clerk + RBAC + Object ACL + AES-256 at rest) · Tenant seam",
    status: "needs-proof",
  },
  {
    zone: "Zone 4",
    label: "Community Hall",
    projects: "NWO Regional Abattoir ops (CCM)",
    shield: "Single-animal traceability scope bound · No carcass splitting",
    status: "in-progress",
  },
  {
    zone: "Zone 5",
    label: "The Wild",
    projects: "Dam Days · The Shallows",
    shield: "No algorithm · No self-promotion · Flag-to-hide moderation only",
    status: "open",
  },
];

const lockedDecisions = [
  "Zone 4 renamed Arc → Community Hall. Arc was a single-producer transition frame; Community Hall is the correct voluntary formation layer. Abattoir pilot remains valid as one Zone 4 expression.",
  "Lodge confirmed as the Zone 1 identity layer name. Rename test run against Membership, Profile, and Household ID — all three cracked on Zone 1 constraints. §5.9 closed.",
  "Watershed disambiguation resolved. Watershed concept (diversified income streams, flow not restriction) belongs exclusively to Zone 1. Zone 5's watershed.replit.app URL is infrastructure legacy with no conceptual weight.",
  "Z5→Z1 direct feed documented as a named structural path. Massive Zone 5 public attention can feed the household watershed directly, bypassing Z2-3-4. Ideal standby posture: both the Z2-3-4 engine and Z5 direct feed running simultaneously.",
  "Mama Support Hub Phase 1 shipped. Task-tracker language replaced across every member-facing surface: Tasks→Needs, Slots→Moments, Claim→I've got it, Impact section removed entirely.",
  "Sandbox circle pulse shipped. calendarToken bridge confirmed as the correct layer (not liveShare). Count-only pulse (no names, no content), deliberate opt-in each time, one ping per household per week.",
  "Mama Support Hub Phase 2 dissolution model spec approved. Archived vs dissolved distinction confirmed. First name retained in circle record, surname + all PII cleared. Memories: export-then-delete before dissolution.",
];

const architecturalCards = [
  { project: "xbuckets",    shield: "Custody-free",  hold: "User funds",                   enables: "Procurable by any FI without becoming an MSB" },
  { project: "Bright Side", shield: "PHI-free",       hold: "Medical identifiers",           enables: "Procurable by any care home without a BAA" },
  { project: "Headwaters",  shield: "Split-view",     hold: "Nothing hidden or leaked",      enables: "Full operating reality + public window from one source" },
  { project: "Saltbox",     shield: "Local-first",    hold: "Zero personal data server-side", enables: "Procurable without a privacy officer or data custodian" },
];

const openDecisions = [
  { text: "Mama Support Hub Phase 3 (direct ask flow) — ready to build. Supported person or any circle member surfaces an urgent need without organizer scaffolding. One step, no project, no slots.", urgency: "Send prompt when ready" },
  { text: "Eave governance document — what it means, who consented, how crossing is permitted. Needed before Rootstock goes to external pilots.", urgency: "Before Rootstock pilots" },
];

const may19Shipped = [
  {
    label: "Device-to-device QR handoff",
    detail: "Full offline curriculum transfer. Settings → \"Transfer to another device\" bundles all children, curriculum files, and schedules into a compressed archive, uploads to the API server (15-min TTL), and displays a QR code. Scanning on a second device imports everything in one tap. One-time use; auto-deletes on claim.",
  },
  {
    label: "XRPL Legacy Pass NFT verification",
    detail: "Settings → \"Gather Round Legacy Pass\" — families enter their XRPL wallet address. Saltbox calls account_nfts on the public XRP Ledger mainnet directly (no Saltbox server, no API key), checks issuer + taxon, and grants Founding Family status stored in IndexedDB. Simulation mode available (VITE_LEGACY_PASS_SIM=true) before real NFTs exist.",
  },
  {
    label: "Legacy Pass Evidence Package (Brief gallery)",
    detail: "Printable one-pager for the Gather Round tester pilot. Left column: 5-step demo flow + technical proof summary. Right column: live demo QR code + three localStorage-backed family story boxes for capturing tester friction-reduction accounts after pilot sessions.",
  },
  {
    label: "Gather Round First-Contact Pitch (Brief gallery)",
    detail: "Pitch document for the first conversation with Rebecca Spooner. Covers the customer problem (purchase is permanent, access is fragile), what Saltbox does, the credential architecture in plain English, the ask (20-minute call), and one revenue option. Sender fields editable and saved to localStorage — personalise and print without any export step.",
  },
];

const gatherRound = {
  who: "Rebecca Spooner — Founder & CEO of Gather Round. Homeschool mom of 5. Founded in 2019 from a notebook sketch. 100,000+ families, 70+ countries. Small remote team.",
  channel: "Instagram: @homeschoolon — DM is the right first channel. No public business inquiry email.",
  legacyPass: "One-time purchase; gives the family lifetime access to every GR digital resource (all current and future units, Seatwork books, MP3s, planners) plus 25% off print upgrades for life (capped at $2,000/year).",
  pitch: "\"Your Legacy Pass holders paid for everything you've made. What they don't have is a reliable way to access it without a fast internet connection and a working Shopify session. Saltbox is free for all Legacy Pass holders in year one. Your only action is configuring one XRPL wallet address. Saltbox handles the rest.\"",
  blockers: [
    "GR side: Create an XRPL issuer wallet (Xaman, ~10 XRP reserve), decide on existing holder onboarding, mint test NFTs to 3–5 tester families.",
    "Saltbox side: Deploy to a stable URL (one-click, already ready), set VITE_GATHER_ROUND_NFT_ISSUER, confirm NFT taxon with GR.",
    "Realistic timeline from \"she says yes\" to 5 families with it working: 3–4 weeks, gated on GR's wallet and minting pace.",
  ],
};

const CARD: React.CSSProperties = {
  background: "rgba(244,237,224,0.06)",
  border: `1px solid ${T.rule}`,
  borderRadius: 8,
  padding: "14px 16px",
};

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 900,
  letterSpacing: "0.22em",
  textTransform: "uppercase" as const,
  color: T.muted,
  margin: "0 0 10px",
};

export default function ConstellationSession() {
  const [, navigate] = useLocation();

  return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: "28px 16px 64px", fontFamily: "var(--font-body, Inter, sans-serif)" }}>

      <button
        onClick={() => navigate(`${BASE}/`)}
        style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: T.muted, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 20 }}
      >
        ← Lobby
      </button>

      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.28em", textTransform: "uppercase", color: "#2C4A35", margin: "0 0 8px" }}>
          Constellation · Strategic Reference
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, color: T.paper, fontFamily: "var(--font-display, Georgia, serif)", margin: "0 0 10px" }}>
          Constellation Session
        </h1>
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
          Zone-model clarity, locked decisions, and architectural patterns from the May 16 session.
          Seven decisions locked. Two open decisions yours to answer.
        </p>
      </div>

      {/* ── Zone Map ── */}
      <section style={{ marginBottom: 28 }}>
        <p style={SECTION_LABEL}>Zone map — projects, privacy shield, and proof status</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {zoneRows.map((r) => (
            <div key={r.zone} style={{ ...CARD, display: "grid", gridTemplateColumns: "60px 100px 1fr auto", gap: 12, alignItems: "start" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.paper, fontFamily: "var(--font-display, Georgia, serif)", margin: 0, lineHeight: 1.35 }}>{r.zone}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.accent, margin: 0, lineHeight: 1.4 }}>{r.label}</p>
              <div>
                <p style={{ fontSize: 12, color: T.paper, margin: "0 0 4px", lineHeight: 1.45 }}>{r.projects}</p>
                <p style={{ fontSize: 11, color: T.muted, margin: 0, lineHeight: 1.5 }}>{r.shield}</p>
              </div>
              <StatusChip kind={r.status} />
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10, color: T.muted, margin: "8px 0 0", fontStyle: "italic" }}>
          Codetry model zones (Zone 0=Household → Zone 1=Local → Zone 3=Org → Zone 4=Community Hall → Zone 5=The Wild) are the design framework, not the Replit project map.
        </p>
      </section>

      {/* ── Locked Decisions ── */}
      <section style={{ marginBottom: 28 }}>
        <p style={SECTION_LABEL}>Locked decisions — May 16, 2026</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {lockedDecisions.map((d, i) => (
            <div key={i} style={{ ...CARD, display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ fontSize: 11, color: T.teal, fontWeight: 700, flexShrink: 0, marginTop: 1, lineHeight: 1.5 }}>✓</span>
              <p style={{ fontSize: 12, color: T.paper, margin: 0, lineHeight: 1.6 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Architectural Pattern ── */}
      <section style={{ marginBottom: 28 }}>
        <p style={SECTION_LABEL}>Architectural pattern — the regulated weight stays with the institution</p>
        <div style={{ ...CARD, marginBottom: 10 }}>
          <p style={{ fontSize: 13, fontStyle: "italic", color: T.paper, fontFamily: "var(--font-display, Georgia, serif)", margin: "0 0 14px", lineHeight: 1.55 }}>
            "The regulated weight stays with the institution. The meaningful work — the envelope, the spark-of-joy log, the engagement ledger — belongs to the person."
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {architecturalCards.map((a) => (
              <div key={a.project} style={{ background: "rgba(244,237,224,0.06)", border: `1px solid ${T.rule}`, borderRadius: 6, padding: "12px 14px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: T.paper, fontFamily: "var(--font-display, Georgia, serif)", margin: "0 0 3px" }}>{a.project}</p>
                <p style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.05em", margin: "0 0 6px" }}>{a.shield}</p>
                <p style={{ fontSize: 11, color: T.muted, margin: 0, lineHeight: 1.5 }}>Doesn't hold: {a.hold}</p>
                <p style={{ fontSize: 11, color: T.muted, margin: "4px 0 0", lineHeight: 1.5 }}>Enables: {a.enables}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Still Open ── */}
      <section style={{ marginBottom: 28 }}>
        <p style={SECTION_LABEL}>Still open — yours to answer</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {openDecisions.map((d, i) => (
            <div key={i} style={{ background: "rgba(184,90,62,0.06)", border: `1px solid rgba(184,90,62,0.2)`, borderRadius: 8, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ fontSize: 11, color: T.accent, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>○</span>
              <div>
                <p style={{ fontSize: 12, color: T.paper, margin: "0 0 5px", lineHeight: 1.6 }}>{d.text}</p>
                <p style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.05em", textTransform: "uppercase" as const, margin: 0 }}>{d.urgency}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(44,74,53,0.18)", border: `1px solid rgba(44,74,53,0.35)` }}>
        <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.6, margin: 0 }}>
          Source: Constellation session, May 16, 2026. Seven decisions locked. Zone 4 is now Community Hall (formerly Arc). Rootstock needs a second co-op to prove the tenant seam.
        </p>
      </div>

      {/* ════════════════════════════════════════════════
          MAY 19 SESSION
      ════════════════════════════════════════════════ */}
      <div style={{ borderTop: `1px solid ${T.rule}`, margin: "36px 0 28px" }} />

      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.28em", textTransform: "uppercase", color: "#2C4A35", margin: "0 0 8px" }}>
          Constellation · Session Debrief
        </p>
        <h2 style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.2, color: T.paper, fontFamily: "var(--font-display, Georgia, serif)", margin: "0 0 10px" }}>
          May 19, 2026
        </h2>
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
          Four items shipped. Gather Round opportunity framing locked and ready for first contact.
        </p>
      </div>

      {/* ── What shipped ── */}
      <section style={{ marginBottom: 28 }}>
        <p style={SECTION_LABEL}>Shipped — locked and proven</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {may19Shipped.map((item, i) => (
            <div key={i} style={{ ...CARD, display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ fontSize: 11, color: T.teal, fontWeight: 700, flexShrink: 0, marginTop: 1, lineHeight: 1.5 }}>✓</span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: T.paper, margin: "0 0 4px", lineHeight: 1.4 }}>{item.label}</p>
                <p style={{ fontSize: 11, color: T.muted, margin: 0, lineHeight: 1.6 }}>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gather Round opportunity ── */}
      <section style={{ marginBottom: 28 }}>
        <p style={SECTION_LABEL}>Gather Round — opportunity reference</p>
        <div style={{ ...CARD, display: "flex", flexDirection: "column", gap: 14 }}>

          <div>
            <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: T.muted, margin: "0 0 5px" }}>Who</p>
            <p style={{ fontSize: 12, color: T.paper, margin: 0, lineHeight: 1.6 }}>{gatherRound.who}</p>
          </div>

          <div>
            <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: T.muted, margin: "0 0 5px" }}>First channel</p>
            <p style={{ fontSize: 12, color: T.paper, margin: 0, lineHeight: 1.6 }}>{gatherRound.channel}</p>
          </div>

          <div>
            <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: T.muted, margin: "0 0 5px" }}>Legacy Pass</p>
            <p style={{ fontSize: 12, color: T.paper, margin: 0, lineHeight: 1.6 }}>{gatherRound.legacyPass}</p>
          </div>

          <div style={{ background: "rgba(15,118,110,0.1)", border: `1px solid rgba(15,118,110,0.25)`, borderRadius: 6, padding: "12px 14px" }}>
            <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: T.teal, margin: "0 0 7px" }}>The pitch</p>
            <p style={{ fontSize: 12, color: T.paper, margin: 0, lineHeight: 1.65, fontStyle: "italic", fontFamily: "var(--font-display, Georgia, serif)" }}>{gatherRound.pitch}</p>
          </div>

          <div>
            <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: T.muted, margin: "0 0 5px" }}>What needs to happen next</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {gatherRound.blockers.map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ fontSize: 11, color: T.muted, flexShrink: 0, marginTop: 1 }}>·</span>
                  <p style={{ fontSize: 11, color: T.muted, margin: 0, lineHeight: 1.6 }}>{b}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(44,74,53,0.18)", border: `1px solid rgba(44,74,53,0.35)` }}>
        <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.6, margin: 0 }}>
          Source: Constellation session, May 19, 2026. Four items shipped across Saltbox and Brief. Gather Round opportunity framing locked. All typechecks clean across gather, api-server, brief, and shared libs.
        </p>
      </div>

      <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 8, background: "rgba(15,118,110,0.08)", border: `1px solid rgba(15,118,110,0.22)` }}>
        <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.6, margin: "0 0 6px" }}>
          <strong style={{ color: T.teal }}>Related brief</strong>
        </p>
        <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.6, margin: 0 }}>
          The{" "}
          <button
            onClick={() => navigate(`${BASE}/saltbox-gather-round`)}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 11, color: T.teal, textDecoration: "underline" }}
          >
            Saltbox × Gather Round brief
          </button>
          {" "}covers the full revenue model, tech stack intelligence, and first-contact language for the Gather Round partnership — the commercial path for Saltbox (Zone 0) entering a proven homeschool market.
        </p>
      </div>

    </div>
  );
}
