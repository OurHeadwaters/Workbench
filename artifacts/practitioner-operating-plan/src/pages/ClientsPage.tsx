import { useLocation } from "wouter";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const T = {
  bg:     "#1f3d2e",
  paper:  "#f4ede0",
  text:   "#2a2520",
  muted:  "#7a7a6e",
  rule:   "rgba(200,191,167,0.35)",
  accent: "#b85a3e",
  teal:   "#1F5446",
  blue:   "#1A5FA8",
  gold:   "#8B6914",
  slate:  "#3D4A5C",
  purple: "#5B3E8C",
  deer:   "#1F5446",
};

type StatusKind = "active" | "outreach" | "pipeline" | "anchor";

interface Client {
  id: string;
  name: string;
  subname?: string;
  status: StatusKind;
  statusLabel: string;
  description: string;
  activeNow: string;
  path: string;
  color: string;
}

const STATUS_STYLES: Record<StatusKind, { bg: string; color: string }> = {
  active:   { bg: "rgba(31,84,70,0.15)",   color: "#1F5446" },
  anchor:   { bg: "rgba(184,90,62,0.13)",  color: "#b85a3e" },
  outreach: { bg: "rgba(139,105,20,0.14)", color: "#8B6914" },
  pipeline: { bg: "rgba(91,62,140,0.12)",  color: "#5B3E8C" },
};

const CLIENTS: Client[] = [
  {
    id: "gmph",
    name: "GMPH",
    subname: "G.M. Pepin Holdings",
    status: "active",
    statusLabel: "Active",
    description: "Stepping-back engagement — $72k pre-paid, three-phase plan. Gilles moves from operating to overseeing.",
    activeNow: "$28k Phase 1 Discovery underway. Voice-note-first workflow. Weekly written brief from Bobbie.",
    path: `${BASE}/gmph`,
    color: "#3D4A5C",
  },
  {
    id: "807",
    name: "807 Food Co-op / Wild Bites",
    subname: "Dryden, Ontario",
    status: "active",
    statusLabel: "Active — Revenue Floor",
    description: "Community-owned supply chain co-op and active branded product line. The $12k computing runway that keeps the operation funded.",
    activeNow: "Computing support active. Wild Bites: 2,000 roll labels + 200 foil pouches ordered April 2026.",
    path: `${BASE}/eight-oh-seven`,
    color: "#1A5FA8",
  },
  {
    id: "gather-round",
    name: "Gather Round × Saltbox",
    subname: "Partnership outreach",
    status: "outreach",
    statusLabel: "Outreach",
    description: "Catalog demo live. Three partnership vectors: Tech Retainer, Co-brand, and Acquisition path. First contact not yet sent.",
    activeNow: "20+ curriculum paths mapped. 7 real GR covers in demo. Conversation script ready. First DM drafted.",
    path: `${BASE}/saltbox-gather-round`,
    color: "#4B6070",
  },
  {
    id: "deer-lake",
    name: "Deer Lake First Nation",
    subname: "Anchor engagement",
    status: "anchor",
    statusLabel: "Anchor",
    description: "The anchor community engagement and the proof case for everything that follows. Store-in-a-box proposal to the Chief.",
    activeNow: "Chief Brief delivered. 8-week trial framing active. AGM board approval pending. Soft deadline: June 15.",
    path: `${BASE}/deer-lake-chief-brief`,
    color: "#1F5446",
  },
  {
    id: "nan",
    name: "NAN",
    subname: "Nishnawbe Aski Nation",
    status: "pipeline",
    statusLabel: "Pipeline",
    description: "49 First Nation communities across Treaty 9 and 5. First outreach not yet sent — waits on Deer Lake.",
    activeNow: "No outreach sent. Timing: approach after Deer Lake is contracted. Research right contact now.",
    path: `${BASE}/nan`,
    color: "#5B3E8C",
  },
];

function StatusBadge({ status, label }: { status: StatusKind; label: string }) {
  const s = STATUS_STYLES[status];
  return (
    <span style={{
      fontSize: 9, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" as const,
      padding: "3px 8px", borderRadius: 4,
      background: s.bg, color: s.color,
      flexShrink: 0, whiteSpace: "nowrap" as const,
    }}>
      {label}
    </span>
  );
}

function ClientCard({ client }: { client: Client }) {
  const [, navigate] = useLocation();

  return (
    <div
      style={{
        borderRadius: 10,
        border: `1px solid ${T.rule}`,
        overflow: "hidden",
        backgroundColor: T.paper,
      }}
    >
      {/* Color bar header */}
      <div style={{ height: 3, backgroundColor: client.color }} />

      <div style={{ padding: "16px 16px 14px" }}>
        {/* Top row: name + badge */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text, lineHeight: 1.3 }}>
              {client.name}
            </p>
            {client.subname && (
              <p style={{ margin: "2px 0 0", fontSize: 11, color: T.muted, lineHeight: 1.3 }}>
                {client.subname}
              </p>
            )}
          </div>
          <StatusBadge status={client.status} label={client.statusLabel} />
        </div>

        {/* Description */}
        <p style={{ margin: "0 0 10px", fontSize: 13, color: T.text, lineHeight: 1.6 }}>
          {client.description}
        </p>

        {/* Active now */}
        <div style={{ padding: "8px 12px", borderRadius: 6, background: "rgba(31,61,46,0.05)", border: `1px solid ${T.rule}`, marginBottom: 12 }}>
          <p style={{ margin: "0 0 3px", fontSize: 9, fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: T.muted }}>
            Active now
          </p>
          <p style={{ margin: 0, fontSize: 12, color: T.text, lineHeight: 1.55 }}>
            {client.activeNow}
          </p>
        </div>

        {/* Link */}
        <button
          onClick={() => navigate(client.path)}
          style={{
            fontSize: 11, fontWeight: 700, color: client.color,
            background: "none", border: "none", cursor: "pointer", padding: 0,
            letterSpacing: "0.04em",
          }}
        >
          Open full brief →
        </button>
      </div>
    </div>
  );
}

export default function ClientsPage() {
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
        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: T.muted, margin: "0 0 8px" }}>
          Headwaters Development Services
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, color: T.paper, fontFamily: "var(--font-display, Georgia, serif)", margin: "0 0 10px" }}>
          Client Roster
        </h1>
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
          Everyone Bobbie is working with and where each stands. Two active engagements, one outreach in motion,
          one anchor deal in progress, one pipeline relationship waiting on Deer Lake.
        </p>
      </div>

      {/* Status legend */}
      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, marginBottom: 24 }}>
        {(["active", "anchor", "outreach", "pipeline"] as StatusKind[]).map((s) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              fontSize: 9, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" as const,
              padding: "2px 7px", borderRadius: 3,
              background: STATUS_STYLES[s].bg, color: STATUS_STYLES[s].color,
            }}>
              {s === "active" ? "Active" : s === "anchor" ? "Anchor" : s === "outreach" ? "Outreach" : "Pipeline"}
            </span>
          </div>
        ))}
      </div>

      {/* Client cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {CLIENTS.map((c) => <ClientCard key={c.id} client={c} />)}
      </div>

      <div style={{ marginTop: 28, padding: "12px 16px", borderRadius: 8, background: "rgba(31,61,46,0.06)", border: `1px solid rgba(31,61,46,0.14)` }}>
        <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: T.teal }}>May 2026 snapshot.</strong>{" "}
          Two active engagements generating revenue. One anchor deal (Deer Lake) in the final proposal window.
          One outreach (Gather Round) with a demo ready. One pipeline relationship (NAN) waiting on Deer Lake proof.
        </p>
      </div>

    </div>
  );
}
