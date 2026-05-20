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
};

interface Point { label: string; body: string }
interface Block { title: string; badge: string; color: string; points: Point[] }

const BLOCKS: Block[] = [
  {
    title: "Who they are — the 807 Food Co-op & Hub",
    badge: "THE CLIENT",
    color: T.teal,
    points: [
      {
        label: "A community-owned supply chain",
        body: "The 807 Food Co-op & Hub is a member-owned food cooperative based in Dryden, Ontario. It was built on the premise that northern communities should own their supply chain rather than depend on distant distributors. The co-op connects independent producers, local sellers, and northern communities through shared logistics and procurement — and it doesn't put anyone out of business; it creates a platform that individual operators couldn't build alone.",
      },
      {
        label: "The revenue floor relationship",
        body: "807 is Headwaters' active revenue floor. The $12,000 computing runway from 807 is the arrangement that keeps the operation funded during the Pursuit phase while larger proposals (Deer Lake, NAN) are in motion. This is not a transactional vendor relationship — it's a co-op partner that is also funding the development of tools the whole network will use.",
      },
      {
        label: "Relationship to Headwaters services",
        body: "Headwaters provides computing infrastructure support to 807 — the back-end tooling, data systems, and operational software that the co-op needs to function at scale. 807 is also the proof-of-concept referenced in the Deer Lake Chief Brief: the community that showed what a northern food platform looks like when it's designed to include, not compete.",
      },
    ],
  },
  {
    title: "Wild Bites — active product line",
    badge: "WILD BITES",
    color: T.gold,
    points: [
      {
        label: "What Wild Bites is",
        body: "Wild Bites is an active product line operating within the 807 co-op framework — a branded food product line connected to the co-op's supply chain and distribution network. It represents the co-op's move from pure logistics into branded product development: a proof that the platform can create, not just distribute.",
      },
      {
        label: "April 2026 order — 2,000 roll labels",
        body: "In April 2026, Wild Bites placed an order for 2,000 roll labels. This is a production-scale order — not a sample run. Roll labels at this quantity indicate active retail readiness: the product is going on shelves, into markets, or into co-op distribution. This is the physical evidence that Wild Bites is a live line, not a concept.",
      },
      {
        label: "April 2026 order — 200 foil pouches",
        body: "The same April 2026 order included 200 foil pouches. Foil pouches are a premium packaging format — shelf-stable, food-grade, often used for dried goods, snacks, or specialty products. 200 units is a trial run at commercial scale: enough to test a product with real customers without over-committing on inventory.",
      },
      {
        label: "What these orders tell us",
        body: "Two SKUs, two packaging formats, April 2026 delivery. Wild Bites is not in planning — it's in production. The print marketing work (labels and pouches) is the visible layer of a supply chain that's already moving. The brand needs to hold up in a retail environment, which means the print quality, label copy, and packaging presentation all carry real stakes.",
      },
      {
        label: "Connection to the Headwaters Print Suite",
        body: "The Wild Bites label and pouch work sits inside the Headwaters print production workflow. The Headwaters Print Marketing Suite handles the design-to-print pipeline — from layout to vendor-ready file. Wild Bites is one of the active production clients in that pipeline.",
      },
    ],
  },
  {
    title: "The co-op as a model for what comes next",
    badge: "STRATEGIC ROLE",
    color: T.teal,
    points: [
      {
        label: "807 is the proof case for Deer Lake",
        body: "The Chief Brief delivered to Deer Lake uses 807 explicitly: 'In Dryden, the 807 Food Co-op began as a question: what if the community owned the supply chain instead of depending on it?' Deer Lake's proposed store would connect to the same supply network. 807 is not just a revenue floor — it's the evidence base for every future community proposal.",
      },
      {
        label: "The rising-tide model in practice",
        body: "807 didn't put existing Dryden businesses out of business. It created a platform that individual producers and sellers could plug into — and it grew because it was designed to include. This is the model Headwaters is replicating. Deer Lake's store, NAN community stores, and future constellations all follow the same structural logic: community-owned, supply-chain-connected, designed to lift everything around it.",
      },
      {
        label: "Computing support as the technical layer",
        body: "807's computing runway ($12k) funds Headwaters' technical support role: the back-end systems that let the co-op operate at scale without needing a full in-house tech team. This is Zone 3 in the Codetry model — organizational infrastructure that serves the co-op as an institution while leaving the community-facing relationships intact.",
      },
      {
        label: "What 807 needs from Headwaters going forward",
        body: "Active computing scope, consistent delivery, and no surprises. The relationship stays healthy when Headwaters delivers what it scoped, communicates ahead of any scope changes, and keeps the technical layer invisible to the co-op's operations. 807 doesn't need to think about infrastructure — that's the point.",
      },
    ],
  },
  {
    title: "How to keep this relationship healthy",
    badge: "WORKING METHOD",
    color: T.blue,
    points: [
      {
        label: "Confirm scope at the start of each month",
        body: "The $12k computing runway is the floor — but it needs to be renewed and confirmed. At the start of each month, confirm the active scope with 807: what's continuing, what's new, what's on hold. Don't let the relationship go quiet between invoice cycles.",
      },
      {
        label: "Don't let 807 become invisible",
        body: "Because 807 is the floor — the reliable thing — there's a real risk of treating it as background noise while the bigger proposals (Deer Lake, NAN) get all the attention. That's a mistake. 807 deserves consistent, visible attention. The relationship is a partnership, not a retainer.",
      },
      {
        label: "Wild Bites print work — stay ahead of deadlines",
        body: "Label and packaging orders have production lead times. The April 2026 order is placed — but the next order cycle will come. Stay ahead of the timeline: know what product quantities are planned, what labels will need updating, and whether any new SKUs are coming. Print doesn't wait.",
      },
      {
        label: "Document the co-op's role in every external document",
        body: "Every time Headwaters talks about the Deer Lake model, the constellation replication path, or the northern food network — 807 is named. That's not just courtesy; it builds 807's organizational identity within the Headwaters story and ensures the partnership has external weight as well as internal revenue.",
      },
    ],
  },
];

function Block({ b }: { b: Block }) {
  return (
    <div style={{ borderRadius: 10, border: `1px solid ${T.rule}`, overflow: "hidden", marginBottom: 14 }}>
      <div style={{ padding: "10px 16px", backgroundColor: b.color, display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#fff" }}>
          {b.badge}
        </span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 600, fontFamily: "var(--font-display, Georgia, serif)" }}>
          {b.title}
        </span>
      </div>
      <div style={{ backgroundColor: T.paper }}>
        {b.points.map((p, i) => (
          <div
            key={p.label}
            style={{ padding: "14px 16px", borderBottom: i < b.points.length - 1 ? `1px solid ${T.rule}` : "none", display: "flex", gap: 12 }}
          >
            <div style={{ width: 3, borderRadius: 2, backgroundColor: b.color, flexShrink: 0, alignSelf: "stretch", minHeight: 16 }} />
            <div>
              <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: b.color, margin: "0 0 5px" }}>
                {p.label}
              </p>
              <p style={{ fontSize: 13, color: T.text, lineHeight: 1.65, margin: 0 }}>
                {p.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EightOhSevenPage() {
  const [, navigate] = useLocation();

  return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: "28px 16px 64px", fontFamily: "var(--font-body, Inter, sans-serif)" }}>

      <button
        onClick={() => navigate(`${BASE}/clients`)}
        style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: T.muted, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 20 }}
      >
        ← Clients
      </button>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{
            fontSize: 9, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" as const,
            padding: "3px 8px", borderRadius: 4,
            background: "rgba(31,84,70,0.15)", color: T.teal,
          }}>
            Active
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
            Client · Revenue Floor
          </span>
        </div>
        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: T.blue, margin: "0 0 8px" }}>
          807 Food Co-op & Hub · Wild Bites Product Line
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, color: T.paper, fontFamily: "var(--font-display, Georgia, serif)", margin: "0 0 10px" }}>
          807 Food Co-op / Wild Bites
        </h1>
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
          The co-op is the revenue floor and the proof case. Wild Bites is the active product line with real orders in the ground.
          $12k computing runway active. 2,000 roll labels + 200 foil pouches ordered April 2026.
        </p>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Computing runway", value: "$12k", note: "Active floor — Pursuit phase" },
          { label: "Roll labels ordered", value: "2,000", note: "Wild Bites · April 2026" },
          { label: "Foil pouches ordered", value: "200", note: "Wild Bites · April 2026" },
        ].map((k) => (
          <div key={k.label} style={{ backgroundColor: "rgba(244,237,224,0.07)", border: `1px solid ${T.rule}`, borderRadius: 8, padding: "12px 14px" }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: T.paper, margin: "0 0 2px", lineHeight: 1 }}>{k.value}</p>
            <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: T.blue, margin: "0 0 3px" }}>{k.label}</p>
            <p style={{ fontSize: 10, color: T.muted, margin: 0, lineHeight: 1.4 }}>{k.note}</p>
          </div>
        ))}
      </div>

      {BLOCKS.map((b) => <Block key={b.badge} b={b} />)}

      <div style={{ marginTop: 28, padding: "14px 16px", borderRadius: 8, backgroundColor: "rgba(26,95,168,0.08)", border: `1px solid rgba(26,95,168,0.22)` }}>
        <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: T.blue }}>Active relationship — May 2026.</strong>{" "}
          $12k computing runway confirmed. Wild Bites April 2026 print order placed: 2,000 roll labels + 200 foil pouches.
          807 is named in the Deer Lake Chief Brief as the co-op precedent and supply chain connection.
        </p>
      </div>

    </div>
  );
}
