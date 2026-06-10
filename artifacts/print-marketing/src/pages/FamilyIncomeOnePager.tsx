import type { CSSProperties } from "react";
import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const GOLD = "#c9930a";
const INK = "#1a1a1a";
const MUTED = "#6b7665";
const PALE = "#f9f6f0";

const base = import.meta.env.BASE_URL;

function buildPlainText(): string {
  return [
    "HEADWATERS — FAMILY INCOME PICTURE",
    "What 18 months of this work actually looks like at home",
    "June 2026 · For kitchen-table use",
    "",
    "─────────────────────────────────────────────",
    "",
    "WHAT WE'RE BUILDING TOWARD",
    "",
    "Not a salary. Not a grant that runs out. A repeating income",
    "from work we own — work that grows with us.",
    "",
    "The goal isn't 'making more money.' It's knowing what's coming",
    "in before it arrives, and having enough left over to breathe.",
    "",
    "─────────────────────────────────────────────",
    "",
    "TAKE-HOME EVERY TWO WEEKS — AT 18 MONTHS",
    "",
    "Cautious (things take longer than expected)",
    "  $2,800 every two weeks — $72,800/year",
    "  One community engagement active. Guide sales steady.",
    "  Enough to cover the house and stop the scramble.",
    "",
    "Realistic (things go more or less as planned)",
    "  $4,000 every two weeks — $104,000/year",
    "  Two communities active. Co-op deal generating recurring income.",
    "  Guide sales covering a real second stream.",
    "  We can finally breathe.",
    "",
    "Things go well (one break goes our way)",
    "  $5,600 every two weeks — $145,600/year",
    "  CDP grant active. Third community engaged.",
    "  Platform licensing adding passive income on top.",
    "  We stop trading time for every dollar.",
    "",
    "─────────────────────────────────────────────",
    "",
    "WHERE IT COMES FROM",
    "",
    "Co-op Association deal",
    "  Platform licensing to OCA and member co-ops — recurring, not per-project.",
    "  One deal covers two months of the realistic scenario.",
    "",
    "Guide sales (Codetry practitioner guides, handbooks, kits)",
    "  Sold once, downloaded forever. Every sale after the first is profit.",
    "  No inventory. No shipping. No client approval needed.",
    "",
    "Direct community engagements",
    "  Band council projects, store feasibility, food system design.",
    "  $28,000–$65,000 per engagement. Each one funds the next.",
    "",
    "Possible grant (CDP, FNDI, NAN fund)",
    "  Not counted in the cautious or realistic scenarios.",
    "  If it lands, it accelerates everything by 6–8 months.",
    "",
    "─────────────────────────────────────────────",
    "",
    "THE ROAD THERE — MONTH BY MONTH",
    "",
    "Month 6",
    "  First engagement closed and invoiced.",
    "  Guide revenue starting — small but real.",
    "  Grant application submitted (CDP or FNDI).",
    "",
    "Month 12",
    "  Second community engaged. First one handed off.",
    "  OCA conversation active — co-op deal in negotiation.",
    "  Monthly income starting to feel predictable.",
    "",
    "Month 18",
    "  Two or three income streams running at the same time.",
    "  At least one stream doesn't need a new client to keep paying.",
    "  We know what next month looks like before it starts.",
    "",
    "─────────────────────────────────────────────",
    "",
    "Headwaters Development Services · Wabigoon, Ontario",
    "Treaty 3 Territory · ourheadwaters.ca · bobbie@ourheadwaters.ca",
  ].join("\n");
}

const PAGE: CSSProperties = {
  width: "8.5in",
  minHeight: "11in",
  background: PALE,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  fontFamily: "Inter, system-ui, sans-serif",
  color: INK,
};

const scenarios = [
  {
    label: "Cautious",
    sublabel: "if things take longer than expected",
    biweekly: "$2,800",
    annual: "$72,800/year",
    color: MUTED,
    bullets: [
      "One community engagement active, one guide stream running",
      "Enough to cover the house and stop the month-to-month scramble",
      "Not comfortable yet — but not behind",
    ],
  },
  {
    label: "Realistic",
    sublabel: "if things go more or less as planned",
    biweekly: "$4,000",
    annual: "$104,000/year",
    color: EVERGREEN,
    bullets: [
      "Two communities engaged, co-op deal generating recurring income",
      "Guide sales covering a real second stream alongside client work",
      "We can finally breathe — and start choosing the right work",
    ],
  },
  {
    label: "Things go well",
    sublabel: "if one break goes our way",
    biweekly: "$5,600",
    annual: "$145,600/year",
    color: GOLD,
    bullets: [
      "CDP grant active, platform licensing adding passive income on top",
      "Three communities engaged — each one referencing the last",
      "We stop trading every hour for every dollar",
    ],
  },
];

const sources = [
  {
    name: "Co-op Association deal",
    detail:
      "Platform licensing to OCA and member co-ops — recurring, not tied to a single project. One deal covers two months of the realistic scenario.",
  },
  {
    name: "Guide sales",
    detail:
      "Practitioner guides, handbooks, workshop kits — sold once, downloaded forever. No inventory, no shipping, no client approval required.",
  },
  {
    name: "Direct community engagements",
    detail:
      "Band council projects, store feasibility, food system design. $28,000–$65,000 per engagement. Each one funds the next.",
  },
  {
    name: "Possible grant",
    detail:
      "CDP, FNDI, or NAN fund. Not counted in cautious or realistic — but if it lands, it accelerates everything by 6–8 months.",
  },
];

const milestones = [
  {
    month: "Month 6",
    points: [
      "First engagement closed and invoiced",
      "Guide revenue starting — small but real",
      "Grant application submitted (CDP or FNDI)",
    ],
    income: "$2,200–$3,200 / biweekly",
  },
  {
    month: "Month 12",
    points: [
      "Second community engaged; first one handed off cleanly",
      "OCA co-op deal in active negotiation",
      "Monthly income starting to feel predictable",
    ],
    income: "$3,200–$4,400 / biweekly",
  },
  {
    month: "Month 18",
    points: [
      "Two or three income streams running at the same time",
      "At least one stream pays without a new client",
      "We know what next month looks like before it starts",
    ],
    income: "$3,800–$5,600 / biweekly",
  },
];

export function FamilyIncomeOnePagerPage() {
  return (
    <div className="page-letter" style={PAGE}>

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div style={{
        background: EVERGREEN,
        padding: "0.34in 0.55in 0.3in",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.12in", marginBottom: "0.12in" }}>
            <img
              src={`${base}eagle-mark.svg`}
              alt="Headwaters"
              style={{ width: "0.42in", height: "0.34in", objectFit: "contain", opacity: 0.88, flexShrink: 0 }}
            />
            <div>
              <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.8rem", fontWeight: 700, color: CREAM, margin: 0, lineHeight: 1.15 }}>Headwaters</p>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.42rem", color: "rgba(244,237,224,0.5)", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>Development Services</p>
            </div>
          </div>
          <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: CREAM, margin: 0, lineHeight: 1.12, letterSpacing: "-0.01em" }}>
            Family Income Picture
          </h1>
          <p style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: "0.78rem", color: "rgba(244,237,224,0.62)", margin: "0.06in 0 0", lineHeight: 1.4 }}>
            What 18 months of this work actually looks like at home
          </p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "0.3in" }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.5rem", color: "rgba(244,237,224,0.38)", margin: 0, letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1.9 }}>
            June 2026<br />
            Kitchen-table use
          </p>
        </div>
      </div>

      {/* ── RUST RULE ─────────────────────────────────────────────── */}
      <div style={{ height: "0.05in", background: RUST, flexShrink: 0 }} />

      {/* ── BODY ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: "0.3in 0.55in 0.22in", display: "flex", flexDirection: "column", gap: "0.22in" }}>

        {/* ── Intent statement ──────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.2in", alignItems: "start" }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.72rem", lineHeight: 1.65, color: INK, margin: 0 }}>
            This isn't a business projection. It's a kitchen-table document — something to set in front of the people who need to know what this work is actually building toward. Three scenarios. Plain numbers. The road to get there.
          </p>
          <div style={{ borderLeft: `3px solid ${RUST}`, paddingLeft: "0.16in" }}>
            <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.9rem", fontStyle: "italic", color: EVERGREEN, lineHeight: 1.5, margin: 0 }}>
              "The goal isn't more money. It's knowing what's coming in before it arrives — and having enough left over to breathe."
            </p>
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(31,61,46,0.1)" }} />

        {/* ── Scenarios ─────────────────────────────────────────── */}
        <section>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.52rem", letterSpacing: "0.16em", textTransform: "uppercase", color: RUST, margin: "0 0 0.12in" }}>
            Take-home every two weeks — at 18 months
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.14in" }}>
            {scenarios.map((s) => (
              <div
                key={s.label}
                style={{
                  background: "white",
                  border: `1px solid rgba(31,61,46,0.1)`,
                  borderTop: `3px solid ${s.color}`,
                  borderRadius: "0 0 4px 4px",
                  padding: "0.16in 0.18in",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.08in",
                }}
              >
                <div>
                  <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.82rem", fontWeight: 700, color: s.color, margin: "0 0 0.02in", lineHeight: 1.2 }}>
                    {s.label}
                  </p>
                  <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.58rem", color: MUTED, margin: "0 0 0.1in", fontStyle: "italic" }}>
                    {s.sublabel}
                  </p>
                </div>
                <div style={{ borderTop: `1px solid rgba(31,61,46,0.08)`, paddingTop: "0.09in", marginBottom: "0.06in" }}>
                  <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.2rem", fontWeight: 700, color: s.color, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                    {s.biweekly}
                  </p>
                  <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.56rem", color: MUTED, margin: "0.02in 0 0", letterSpacing: "0.04em" }}>
                    every two weeks &nbsp;·&nbsp; {s.annual}
                  </p>
                </div>
                <ul style={{ margin: 0, padding: "0 0 0 0.14in", display: "flex", flexDirection: "column", gap: "0.04in" }}>
                  {s.bullets.map((b) => (
                    <li key={b} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.62rem", color: MUTED, lineHeight: 1.5 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: 1, background: "rgba(31,61,46,0.1)" }} />

        {/* ── Sources + Milestones ───────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "0.22in", alignItems: "start" }}>

          {/* Where it comes from */}
          <section>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.52rem", letterSpacing: "0.16em", textTransform: "uppercase", color: RUST, margin: "0 0 0.1in" }}>
              Where it comes from
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.09in" }}>
              {sources.map((src, i) => (
                <div
                  key={src.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "0.12in 1fr",
                    gap: "0.1in",
                    paddingBottom: i < sources.length - 1 ? "0.09in" : 0,
                    borderBottom: i < sources.length - 1 ? "1px solid rgba(31,61,46,0.07)" : "none",
                  }}
                >
                  <div style={{ width: "0.12in", height: "0.12in", borderRadius: "50%", background: GOLD, marginTop: "0.05in", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.74rem", fontWeight: 700, color: EVERGREEN, margin: "0 0 0.025in" }}>
                      {src.name}
                    </p>
                    <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.64rem", color: MUTED, margin: 0, lineHeight: 1.55 }}>
                      {src.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Milestones */}
          <section>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.52rem", letterSpacing: "0.16em", textTransform: "uppercase", color: RUST, margin: "0 0 0.1in" }}>
              The road there
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.1in" }}>
              {milestones.map((m, i) => (
                <div
                  key={m.month}
                  style={{
                    background: i === 2 ? "rgba(31,61,46,0.04)" : "white",
                    border: "1px solid rgba(31,61,46,0.1)",
                    borderLeft: `3px solid ${i === 2 ? EVERGREEN : "rgba(31,61,46,0.2)"}`,
                    borderRadius: "0 4px 4px 0",
                    padding: "0.1in 0.14in",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.05in" }}>
                    <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.78rem", fontWeight: 700, color: EVERGREEN, margin: 0 }}>
                      {m.month}
                    </p>
                    <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.54rem", color: GOLD, margin: 0, fontWeight: 600 }}>
                      {m.income}
                    </p>
                  </div>
                  <ul style={{ margin: 0, padding: "0 0 0 0.12in", display: "flex", flexDirection: "column", gap: "0.02in" }}>
                    {m.points.map((pt) => (
                      <li key={pt} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.61rem", color: MUTED, lineHeight: 1.5 }}>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div style={{ flex: 1 }} />

      </div>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <div style={{
        background: EVERGREEN,
        padding: "0.16in 0.55in",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
      }}>
        <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.68rem", fontWeight: 600, color: CREAM, margin: 0 }}>
          Headwaters Development Services · Wabigoon, Ontario · Treaty 3 Territory
        </p>
        <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.58rem", color: "rgba(244,237,224,0.55)", margin: 0, letterSpacing: "0.04em" }}>
          ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654
        </p>
      </div>

    </div>
  );
}

export default function FamilyIncomeOnePager() {
  return (
    <>
      <PrintNav
        targetId="family-income-one-pager"
        filename="headwaters-family-income-picture.pdf"
        format="letter"
        orientation="portrait"
        onCopyPlainText={buildPlainText}
      />
      <div
        style={{
          background: "#d0c9bc",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0.4in 0 0.6in",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div id="family-income-one-pager">
          <FamilyIncomeOnePagerPage />
        </div>
      </div>
    </>
  );
}
