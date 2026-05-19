import { Link } from "wouter";

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
};

interface Point {
  label: string;
  body: string;
}

interface Block {
  title: string;
  badge: string;
  color: string;
  points: Point[];
}

const BLOCKS: Block[] = [
  {
    title: "Acknowledge the ask warmly",
    badge: "STEP 1 — ACKNOWLEDGE",
    color: T.teal,
    points: [
      {
        label: "Name the instinct correctly",
        body: "The council is asking for exclusivity because they want to protect something real: the advantage of being first, the risk they're taking, and the trust they're extending. That instinct is right. Honour it out loud before you explain anything else.",
      },
      {
        label: "What to say",
        body: "\"That makes complete sense, and I want you to know I hear what's underneath it — you're taking a real risk here, you're moving first, and you want to make sure that counts for something. It absolutely does. Let me show you exactly how.\"",
      },
      {
        label: "Don't rush past this",
        body: "If the council feels unheard, no amount of logic will land. Spend real time here. Let there be silence after you say it.",
      },
    ],
  },
  {
    title: "What to offer instead",
    badge: "STEP 2 — OFFER",
    color: T.accent,
    points: [
      {
        label: "Anchor community status",
        body: "Deer Lake is named in all public documentation as the community that started the model. Every future community will know who built the foundation. That's not just courtesy — it's structural. The story of the Headwaters model begins here.",
      },
      {
        label: "Right of first refusal on any new tools",
        body: "Before any new capability, software feature, or supply-chain relationship is offered to another community, Deer Lake gets the first conversation. Written into the operating agreement.",
      },
      {
        label: "Flagship recognition",
        body: "The Phase 1 documentation, the operations guide, and the model specs are written from Deer Lake's experience. Future communities will train on what Deer Lake's council and staff built. That's a different kind of status than exclusivity — it's authorship.",
      },
      {
        label: "Documented advantage window",
        body: "Phase 2 with a second community doesn't start until Deer Lake's Phase 1 is complete and the council signs off. There's a built-in lead time of at least 12 months — likely longer.",
      },
    ],
  },
  {
    title: "Why exclusivity works against Deer Lake's interests",
    badge: "STEP 3 — HOLD THE LINE",
    color: "#5B3E8C",
    points: [
      {
        label: "Exclusivity weakens proof",
        body: "The model's credibility — with funders, with government, with the 807 co-op supply chain — depends on it working in more than one place. One community is a pilot. Two is a pattern. Three is a movement. Deer Lake's investment in Phase 1 becomes more valuable, not less, when a second community replicates it successfully.",
      },
      {
        label: "Exclusivity breaks resilience",
        body: "If the operating system only runs in one community, there's no backup when something goes wrong — and something will go wrong. A network of communities sharing tools, pricing, and documentation creates redundancy that protects everyone, including Deer Lake.",
      },
      {
        label: "Exclusivity limits leverage",
        body: "The grant landscape, the co-op buying power, and the policy influence all scale with network size. A single-community arrangement stays small. A regional constellation becomes something funders compete to support and governments want to partner with.",
      },
      {
        label: "The honest framing",
        body: "\"Exclusivity would feel like protection, but it would actually limit what this becomes — and what Deer Lake gets credit for building. What you actually want is to be first, to be recognized as first, and to have that mean something tangible. We can give you all of that.\"",
      },
    ],
  },
  {
    title: "The one-liner to say out loud",
    badge: "CLOSING LINE",
    color: T.teal,
    points: [
      {
        label: "Say this when the room goes quiet",
        body: "\"Deer Lake isn't one of many communities. Deer Lake is the community that made all of this possible. That's written into the model itself — and no one can take that away.\"",
      },
    ],
  },
];

function PrintButton() {
  return (
    <button
      className="no-print"
      onClick={() => window.print()}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 14px",
        borderRadius: 7,
        border: `1px solid ${T.rule}`,
        backgroundColor: "rgba(255,255,255,0.06)",
        color: T.muted,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.07em",
        cursor: "pointer",
        fontFamily: "var(--font-body)",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"/>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
        <rect x="6" y="14" width="12" height="8"/>
      </svg>
      Print / Save as PDF
    </button>
  );
}

function Block({ b }: { b: Block }) {
  return (
    <div className="print-card" style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${T.rule}`, marginBottom: 14 }}>
      <div style={{ padding: "10px 16px", backgroundColor: b.color, display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#fff" }}>
          {b.badge}
        </span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
          {b.title}
        </span>
      </div>
      <div style={{ backgroundColor: T.paper }}>
        {b.points.map((p, i) => (
          <div
            key={p.label}
            style={{
              padding: "14px 16px",
              borderBottom: i < b.points.length - 1 ? `1px solid ${T.rule}` : "none",
              display: "flex",
              gap: 12,
            }}
          >
            <div style={{ width: 3, flexShrink: 0, borderRadius: 2, backgroundColor: b.color, alignSelf: "stretch", minHeight: 16 }} />
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase" as const, color: b.color }}>
                {p.label}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: T.text, lineHeight: 1.65 }}>
                {p.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DeerLakeTalkingPoints() {
  return (
    <div className="print-root" style={{ maxWidth: 680, margin: "0 auto", padding: "28px 16px 64px" }}>

      <div className="no-print" style={{ marginBottom: 20 }}>
        <a
          href={BASE + "/"}
          style={{ fontSize: 11, fontWeight: 700, color: T.muted, textDecoration: "none", letterSpacing: "0.08em" }}
        >
          ← Back to Operating Plan
        </a>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12, flexWrap: "wrap" as const }}>
          <div>
            <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: T.muted, margin: "0 0 8px" }}>
              Deer Lake — Internal Coaching Doc
            </p>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: 30,
              fontWeight: 600,
              lineHeight: 1.2,
              color: T.paper,
              margin: "0 0 10px",
            }}>
              Responding to the Exclusivity Ask
            </h1>
          </div>
          <PrintButton />
        </div>
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, maxWidth: 560 }}>
          A step-by-step guide for the founder. Use this as a pre-read before the conversation, or refer to the one-liners live. The goal: honour the ask, give something real, and protect the model's ability to grow.
        </p>
      </div>

      {BLOCKS.map((b) => <Block key={b.badge} b={b} />)}

      <div className="no-print" style={{
        marginTop: 28,
        padding: "16px 20px",
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.04)",
        border: `1px solid ${T.rule}`,
      }}>
        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: T.muted, margin: "0 0 6px" }}>
          See Also
        </p>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 10 }}>
          <Link href={`${BASE}/deer-lake-roadmap`} style={{ fontSize: 12, fontWeight: 700, color: T.accent, textDecoration: "none" }}>
            How the Model Spreads →
          </Link>
          <span style={{ color: T.rule, fontSize: 12 }}>|</span>
          <Link href={`${BASE}/rate-breakdown`} style={{ fontSize: 12, fontWeight: 700, color: T.accent, textDecoration: "none" }}>
            Rate Breakdown →
          </Link>
          <span style={{ color: T.rule, fontSize: 12 }}>|</span>
          <Link href={`${BASE}/contract-terms`} style={{ fontSize: 12, fontWeight: 700, color: T.accent, textDecoration: "none" }}>
            Contract Terms →
          </Link>
          <span style={{ color: T.rule, fontSize: 12 }}>|</span>
          <Link href={`${BASE}/constellation-session`} style={{ fontSize: 12, fontWeight: 700, color: T.accent, textDecoration: "none" }}>
            Constellation Session →
          </Link>
        </div>
      </div>

    </div>
  );
}
