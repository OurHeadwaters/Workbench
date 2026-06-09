import { useState, useEffect } from "react";

const PINE    = "#2d4a1e";
const CANOPY  = "#3d6b2a";
const LICHEN  = "#6a9b4a";
const AMBER   = "#78350f";
const BARK    = "#5a3a1a";
const GOLD    = "#b8922a";
const INK     = "#1a1008";
const FAINT   = "#e8dcc8";
const PALE    = "#fdf8f0";
const DUSTY   = "#f5ede0";
const MUTED   = "#8a7060";

function useSheetScale(sheetW: number) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      setScale(Math.min(1, (vw - 16) / sheetW));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [sheetW]);
  return scale;
}

const today = new Date().toLocaleDateString("en-CA", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

// ── Zone circuit rows ───────────────────────────────────────────────
// Z4 = The Clearing (zone). Stomping Paths is a platform within The Clearing, not the zone name.
const ZONES = [
  { tag: "Z0", name: "Saltbox", terrain: "The Hearth", desc: "Household sovereignty. Zone 0 kits, crate subscriptions, the jar kitchen." },
  { tag: "Z1", name: "Kitchen Table", terrain: "The Spring", desc: "Daily tools. Course 1 — Food Preservation. Weekly rhythm and the teaching kitchen." },
  { tag: "Z2", name: "Workbench", terrain: "The Worn Path", desc: "PJ Solutions consulting. Co-op and community development — the knowledge that built Zone 0–1 becomes billable." },
  { tag: "Z3", name: "Greenhouse", terrain: "The Circle", desc: "Member circle. The Arc + 807 Benefits. Practitioner subscriptions, Earth Kit licencing, Goodbye Kit, practitioner directory." },
  { tag: "Z4", name: "The Clearing", terrain: "The Clearing · Public Gathering", desc: "Community formation and governance. The Clearing is where the community decides together — zone board votes, pilots, cooperative formation. Stomping Paths is a platform that operates here." },
  { tag: "Z5", name: "The Edge", terrain: "The Studio & Long View", desc: "Blockchain builds. XRPL Studio, Dam Days, Slim Evey. Long-range infrastructure for the next generation." },
  { tag: "—", name: "The Aquifer", terrain: "Cross-Zone Substrate", desc: "API + DB + bucket splits + Eave Flows. The water table under all zones — never numbered, always cycling." },
];

// ── Revenue streams ─────────────────────────────────────────────────
const STREAMS = [
  { zone: "Z0–Z1", name: "Crate Subscriptions",       model: "Parr's Jars — Vegetable $60/wk · Balanced $115/wk · Veg·Meat·Treat $145/wk", status: "Active" },
  { zone: "Z0",    name: "Digital Kits",               model: "Zone 0 Starter Kit $17 CAD · Northern Preparedness Pack $17 CAD · Zone 0 Bundle $27 CAD · Goodbye Kit $97 USD", status: "Active" },
  { zone: "Z1",    name: "Course 1 — Food Preservation", model: "$97 CAD founding price · Ten sessions from Bobbie's kitchen", status: "In build" },
  { zone: "Z2",    name: "PJ Solutions Consulting",    model: "$35,000/client · Y1 3 clients ($105k) · Y2 6 clients ($210k)", status: "Active" },
  { zone: "Z3",    name: "Earth Kit Practitioner Subscriptions", model: "Licensed $97 CAD/yr · Portfolio Verified $197 CAD/yr", status: "Active" },
  { zone: "Z3",    name: "Goodbye Kit Access",         model: "One-time instrument fee (pricing TBD at launch)", status: "In build" },
  { zone: "Z3",    name: "Community Money Machines",   model: "Internal — 45 / 30 / 15 / 10 bucket splits tracked in The Arc. Revenue reported via Kitchen Table Reports.", status: "Active" },
  { zone: "Z4",    name: "XRPL Codetry Token Minting", model: "Per-keepsake fee at minting · Goodbye Kit Layer 3 · TBD pending XRPL build", status: "Deferred" },
  { zone: "Z4",    name: "Practitioner Network Listing", model: "Annual artisan directory fee · vetted by object, not credential · TBD", status: "Deferred" },
];

// ── Financial projections ───────────────────────────────────────────
type Row = {
  stream: string;
  y1c: string; y1b: string;
  y2c: string; y2b: string;
  y3c: string; y3b: string;
};
const PROJ: Row[] = [
  {
    stream: "PJ Solutions Consulting",
    y1c: "$105,000", y1b: "$105,000",
    y2c: "$210,000", y2b: "$210,000",
    y3c: "$280,000", y3b: "$350,000",
  },
  {
    stream: "Crate Subscriptions",
    y1c: "$18,000",  y1b: "$36,000",
    y2c: "$36,000",  y2b: "$72,000",
    y3c: "$54,000",  y3b: "$108,000",
  },
  {
    stream: "Digital Kits",
    y1c: "$500",     y1b: "$1,500",
    y2c: "$2,000",   y2b: "$5,000",
    y3c: "$5,000",   y3b: "$12,000",
  },
  {
    stream: "Course 1 — Food Preservation",
    y1c: "$500",     y1b: "$1,500",
    y2c: "$3,000",   y2b: "$8,000",
    y3c: "$8,000",   y3b: "$20,000",
  },
  {
    stream: "Practitioner Subscriptions",
    y1c: "$300",     y1b: "$1,000",
    y2c: "$2,000",   y2b: "$5,000",
    y3c: "$5,000",   y3b: "$12,000",
  },
  {
    stream: "Goodbye Kit + Listing Fees",
    y1c: "—",        y1b: "$500",
    y2c: "$1,000",   y2b: "$3,000",
    y3c: "$3,000",   y3b: "$8,000",
  },
  {
    stream: "Token Minting (XRPL)",
    y1c: "TBD",      y1b: "TBD",
    y2c: "TBD",      y2b: "TBD",
    y3c: "TBD",      y3b: "TBD",
  },
];
const TOTALS = {
  y1c: "$124,300", y1b: "$145,500",
  y2c: "$254,000", y2b: "$303,000",
  y3c: "$355,000", y3b: "$510,000",
};

export default function WatershedVisionPage() {
  // Landscape: 11in × 8.5in at 96dpi → 1056px × 816px
  const scale = useSheetScale(1056);

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @media screen {
          body { background: #1a1008 !important; }
          .no-print { display: flex !important; }
        }
        @media print {
          @page { size: landscape; margin: 0; }
          body { margin: 0 !important; background: #fff !important; }
          .no-print { display: none !important; }
          .sheet { transform: none !important; }
        }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── Print bar ── */}
      <div
        className="no-print"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, zIndex: 100,
          padding: "10px 24px",
          background: "#1e2c14",
          borderBottom: "1px solid #2d4018",
          alignItems: "center",
          gap: 12,
          fontFamily: "DM Sans, sans-serif",
        }}
      >
        <button
          onClick={() => window.print()}
          style={{
            padding: "7px 20px",
            background: CANOPY,
            color: "#f0f9e8",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          Print · landscape
        </button>
        <a
          href="/suite/"
          style={{
            padding: "7px 16px",
            color: LICHEN,
            border: `1px solid ${LICHEN}`,
            borderRadius: 4,
            fontSize: "0.85rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          ← Paper Layer
        </a>
        <span style={{ fontSize: "0.75rem", color: "#5a7840" }}>
          Sheet 39 · Steward planning tool · internal only
        </span>
      </div>

      {/* ── Sheet wrapper ── */}
      <div style={{ paddingTop: "3rem", display: "flex", justifyContent: "center", padding: "3.5rem 8px 24px" }}>
        <div
          className="sheet"
          style={{
            width: "11in",
            height: "8.5in",
            transformOrigin: "top center",
            transform: `scale(${scale})`,
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.75rem",
            lineHeight: 1.55,
            color: INK,
            background: "#fff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ══ Header band ══ */}
          <div
            style={{
              background: PINE,
              padding: "0.22in 0.5in",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "1.1rem", fontWeight: 800, color: "#f5f0e8", letterSpacing: "0.01em" }}>
                Headwaters — Watershed Vision &amp; Financial Projections
              </div>
              <div style={{ fontSize: "0.63rem", color: "#9aba78", textTransform: "uppercase", letterSpacing: "0.14em", marginTop: 3 }}>
                Sheet 39 · Steward Planning Tool · Internal Only · {today}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "0.72rem", fontStyle: "italic", color: "#c8d8a8", lineHeight: 1.5, maxWidth: "3.8in" }}>
                "From the Hearth water rises at the Spring, runs the Worn Path, gathers in the Circle, flows out through The Clearing, and is held at The Studio on The Edge. The Aquifer keeps the entire watershed cycling."
              </div>
            </div>
          </div>

          {/* ══ Vision block ══ */}
          <div
            style={{
              padding: "0.14in 0.5in",
              background: DUSTY,
              borderBottom: `2px solid ${FAINT}`,
            }}
          >
            <div style={{ display: "flex", gap: "0.35in", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.58rem", color: CANOPY, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 4 }}>
                  The Vision
                </div>
                <div style={{ fontSize: "0.77rem", color: INK, lineHeight: 1.65 }}>
                  Headwaters is a practitioner-led watershed system built zone by zone, from the hearth outward. It does not scale by growing larger — it scales by growing deeper: more machines running cleanly, more people holding their own compass, more water moving through channels the community owns. The Arc tracks the money. The Aquifer holds the structure. The zones give each tool its terrain.
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.58rem", color: AMBER, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 4 }}>
                  The Posture
                </div>
                <div style={{ fontSize: "0.77rem", color: INK, lineHeight: 1.65 }}>
                  The practitioner is water — not lime, not hurd. It does its work and leaves. Each zone earns its own revenue; each machine runs its own bucket split. Nothing is pitched, nothing is scaled past what the paddock can hold. The projections below name what is possible if the machines are run as designed. They are not targets — they are orientation.
                </div>
              </div>
            </div>
          </div>

          {/* ══ Three-column body ══ */}
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "1.8in 3.4in 1fr",
              gap: 0,
              overflow: "hidden",
            }}
          >
            {/* ── Col 1: Zone Circuit ── */}
            <div
              style={{
                padding: "0.18in 0.2in 0.15in 0.5in",
                borderRight: `1.5px solid ${FAINT}`,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ fontSize: "0.58rem", color: PINE, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 9 }}>
                The Circuit
              </div>
              {ZONES.map((z) => (
                <div
                  key={z.tag}
                  style={{
                    marginBottom: 7,
                    paddingBottom: 7,
                    borderBottom: `1px solid ${FAINT}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 1 }}>
                    <span style={{ fontSize: "0.6rem", fontWeight: 700, color: z.tag === "—" ? MUTED : PINE, minWidth: "1.1rem" }}>{z.tag}</span>
                    <span style={{ fontFamily: "Fraunces, serif", fontSize: "0.72rem", fontWeight: 700, color: INK }}>{z.name}</span>
                  </div>
                  <div style={{ fontSize: "0.58rem", color: CANOPY, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2, paddingLeft: "1.35rem" }}>{z.terrain}</div>
                  <div style={{ fontSize: "0.63rem", color: BARK, lineHeight: 1.45, paddingLeft: "1.35rem" }}>{z.desc}</div>
                </div>
              ))}
            </div>

            {/* ── Col 2: Revenue Streams ── */}
            <div
              style={{
                padding: "0.18in 0.22in 0.15in 0.22in",
                borderRight: `1.5px solid ${FAINT}`,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ fontSize: "0.58rem", color: AMBER, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 9 }}>
                Revenue Streams
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.66rem" }}>
                <thead>
                  <tr>
                    {["Zone", "Stream", "Pricing / Model", "Status"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          fontSize: "0.54rem",
                          color: AMBER,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          fontWeight: 700,
                          paddingBottom: 5,
                          borderBottom: `1.5px solid ${GOLD}`,
                          whiteSpace: "nowrap",
                          paddingRight: h !== "Status" ? 8 : 0,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STREAMS.map((s, i) => (
                    <tr
                      key={s.name}
                      style={{ background: i % 2 === 0 ? "#fff" : PALE }}
                    >
                      <td
                        style={{
                          padding: "4px 8px 4px 0",
                          fontSize: "0.58rem",
                          fontWeight: 700,
                          color: PINE,
                          verticalAlign: "top",
                          whiteSpace: "nowrap",
                          borderBottom: `1px solid ${FAINT}`,
                        }}
                      >
                        {s.zone}
                      </td>
                      <td
                        style={{
                          padding: "4px 8px 4px 0",
                          fontFamily: "Fraunces, serif",
                          fontWeight: 700,
                          fontSize: "0.67rem",
                          color: INK,
                          verticalAlign: "top",
                          whiteSpace: "nowrap",
                          borderBottom: `1px solid ${FAINT}`,
                        }}
                      >
                        {s.name}
                      </td>
                      <td
                        style={{
                          padding: "4px 8px 4px 0",
                          color: BARK,
                          lineHeight: 1.45,
                          verticalAlign: "top",
                          borderBottom: `1px solid ${FAINT}`,
                        }}
                      >
                        {s.model}
                      </td>
                      <td
                        style={{
                          padding: "4px 0",
                          verticalAlign: "top",
                          borderBottom: `1px solid ${FAINT}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.54rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color:
                              s.status === "Active"
                                ? CANOPY
                                : s.status === "In build"
                                ? AMBER
                                : MUTED,
                          }}
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                style={{
                  marginTop: 10,
                  padding: "7px 10px",
                  background: PALE,
                  border: `1px solid ${FAINT}`,
                  borderLeft: `3px solid ${GOLD}`,
                  borderRadius: 2,
                  fontSize: "0.62rem",
                  color: BARK,
                  lineHeight: 1.55,
                }}
              >
                <strong style={{ color: AMBER }}>Four-bucket split (all machines):</strong>{" "}
                The House 45% · The People 30% · The Future 15% · The Reserve 10%.
                Eave Flows track money moving between machines. The Arc holds the record; the Kitchen Table holds the governance.
              </div>
            </div>

            {/* ── Col 3: Financial Projections ── */}
            <div
              style={{
                padding: "0.18in 0.5in 0.15in 0.22in",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ fontSize: "0.58rem", color: PINE, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 9 }}>
                Financial Projections
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.63rem" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", fontSize: "0.54rem", color: PINE, textTransform: "uppercase", letterSpacing: "0.09em", fontWeight: 700, paddingBottom: 4, borderBottom: `1.5px solid ${PINE}` }}>
                      Stream
                    </th>
                    {[
                      { label: "Y1", sub: "Con" }, { label: "Y1", sub: "Base" },
                      { label: "Y2", sub: "Con" }, { label: "Y2", sub: "Base" },
                      { label: "Y3", sub: "Con" }, { label: "Y3", sub: "Base" },
                    ].map(({ label, sub }, i) => (
                      <th
                        key={i}
                        style={{
                          textAlign: "right",
                          fontSize: "0.52rem",
                          color: sub === "Con" ? MUTED : PINE,
                          fontWeight: 700,
                          paddingBottom: 4,
                          paddingLeft: i % 2 === 0 ? 4 : 0,
                          borderBottom: `1.5px solid ${PINE}`,
                          borderLeft: i % 2 === 0 ? `1px solid ${FAINT}` : "none",
                          paddingRight: 4,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {label}
                        <br />
                        <span style={{ fontSize: "0.48rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{sub}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PROJ.map((r, i) => (
                    <tr key={r.stream} style={{ background: i % 2 === 0 ? "#fff" : PALE }}>
                      <td style={{ padding: "3px 4px 3px 0", fontSize: "0.61rem", color: INK, fontWeight: i === 0 ? 700 : 400, borderBottom: `1px solid ${FAINT}`, lineHeight: 1.3 }}>
                        {r.stream}
                      </td>
                      {([
                        [r.y1c, r.y1b],
                        [r.y2c, r.y2b],
                        [r.y3c, r.y3b],
                      ] as [string, string][]).flatMap(([c, b], gi) =>
                        [c, b].map((v, vi) => (
                          <td
                            key={gi * 2 + vi}
                            style={{
                              textAlign: "right",
                              padding: "3px 4px",
                              fontSize: "0.6rem",
                              color: v === "TBD" || v === "—" ? MUTED : (vi === 0 ? BARK : INK),
                              fontStyle: v === "TBD" ? "italic" : "normal",
                              borderBottom: `1px solid ${FAINT}`,
                              borderLeft: vi === 0 ? `1px solid ${FAINT}` : "none",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {v}
                          </td>
                        ))
                      )}
                    </tr>
                  ))}
                  {/* Totals row */}
                  <tr style={{ background: DUSTY }}>
                    <td style={{ padding: "4px 4px 4px 0", fontSize: "0.61rem", fontWeight: 700, color: PINE, borderTop: `1.5px solid ${PINE}` }}>
                      Estimated Total
                    </td>
                    {([
                      [TOTALS.y1c, TOTALS.y1b],
                      [TOTALS.y2c, TOTALS.y2b],
                      [TOTALS.y3c, TOTALS.y3b],
                    ] as [string, string][]).flatMap(([c, b], gi) =>
                      [c, b].map((v, vi) => (
                        <td
                          key={gi * 2 + vi}
                          style={{
                            textAlign: "right",
                            padding: "4px 4px",
                            fontSize: "0.63rem",
                            fontWeight: 700,
                            color: vi === 0 ? BARK : PINE,
                            borderTop: `1.5px solid ${PINE}`,
                            borderLeft: vi === 0 ? `1px solid ${FAINT}` : "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {v}
                        </td>
                      ))
                    )}
                  </tr>
                </tbody>
              </table>

              {/* Methodology note */}
              <div
                style={{
                  marginTop: 10,
                  padding: "7px 10px",
                  background: PALE,
                  border: `1px solid ${FAINT}`,
                  borderLeft: `3px solid ${LICHEN}`,
                  borderRadius: 2,
                  fontSize: "0.6rem",
                  color: BARK,
                  lineHeight: 1.55,
                }}
              >
                <div style={{ fontSize: "0.54rem", color: CANOPY, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 3 }}>Methodology</div>
                Consulting anchored to verified pipeline: PJ Solutions Y1 3 clients × $35k, Y2 6 clients × $35k. Crate subscriptions assume 5–10 active subscriber households at launch, growing 2× year-over-year on base scenario. Kit and course volume assumes 2–5 sales/mo at launch, scaling with practitioner network growth. TBD lines (token minting, network listing) are deferred builds — revenue potential exists but is not modelled without a live price or mechanism.
              </div>

              {/* Closing note */}
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: 10,
                  borderTop: `1px solid ${FAINT}`,
                }}
              >
                <div
                  style={{
                    fontFamily: "Fraunces, serif",
                    fontSize: "0.72rem",
                    fontStyle: "italic",
                    color: PINE,
                    lineHeight: 1.65,
                    marginBottom: 6,
                  }}
                >
                  "The watershed cycles. The Aquifer keeps it moving."
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div style={{ fontSize: "0.56rem", color: MUTED }}>
                    All figures CAD unless noted. Projections are orientation, not targets — the machine runs one month at a time.
                  </div>
                  <div style={{ fontSize: "0.56rem", color: MUTED, textAlign: "right" }}>
                    Headwaters · Sheet 39 · ourheadwaters.ca
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
