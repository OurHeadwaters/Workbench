import { PrintNav } from "../components/PrintNav";

const base = import.meta.env.BASE_URL;

const CREAM     = "#f4ede0";
const DARK      = "#2D1B0E";
const AMBER     = "#C97228";
const EVERGREEN = "#1f3d2e";
const INK       = "#1a1a1a";
const MUTED     = "#7a6f64";
const WHITE     = "#ffffff";
const WARM_MID  = "#e8ddd0";

export default function GillesPitch() {
  const phases = [
    {
      phase: "Phase 1",
      year: "Now · 2026",
      label: "Discover",
      tag: "Six weeks",
      bullets: [
        "What's in your head becomes a system",
        "Voice notes replace phone calls",
        "Costs and assets go on paper",
        "Your wife sees the full picture",
      ],
      style: "light" as const,
    },
    {
      phase: "Phase 2",
      year: "2027",
      label: "Run",
      tag: "Operate from a distance",
      bullets: [
        "The hotel runs shift to shift without you",
        "Deer Lake store shares the same layer",
        "Volume purchasing kicks in for both",
        "The band has a plan to show the band",
      ],
      style: "mid" as const,
    },
    {
      phase: "Phase 3",
      year: "2028",
      label: "Step Back",
      tag: "The river flows without you",
      bullets: [
        "You're no longer in every call",
        "The Deer Lake contract is running",
        "What you built keeps moving",
        "The next chapter is yours to design",
      ],
      style: "dark" as const,
    },
  ];

  function phaseColors(style: "light" | "mid" | "dark") {
    if (style === "dark") return { bg: DARK, border: DARK, label: WHITE, tag: AMBER, text: "rgba(244,237,224,0.75)", bullet: AMBER, phase: "rgba(244,237,224,0.35)" };
    if (style === "mid") return { bg: WARM_MID, border: "#cfc5b6", label: DARK, tag: AMBER, text: MUTED, bullet: AMBER, phase: MUTED };
    return { bg: CREAM, border: "#d6cfc3", label: DARK, tag: AMBER, text: MUTED, bullet: AMBER, phase: MUTED };
  }

  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="gilles-pepin-proposal.pdf"
        paginate={true}
      />

      <div id="pdf-target" style={{ background: "#d8d2c8" }}>

        {/* ── PAGE 1: COVER ─────────────────────────────────────── */}
        <div
          className="page-letter"
          style={{
            width: "8.5in",
            minHeight: "11in",
            position: "relative",
            overflow: "hidden",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          <img
            src={`${base}gilles-lake.jpeg`}
            alt="Deer Lake at sunrise"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 25%",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(18,8,2,0.62) 0%, rgba(18,8,2,0.05) 38%, rgba(18,8,2,0.12) 62%, rgba(18,8,2,0.82) 100%)",
            }}
          />

          {/* Top bar */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              padding: "0.48in 0.65in 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,237,224,0.65)", margin: 0, fontWeight: 500 }}>
              Private · Headwaters Development Services
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.1in" }}>
              <img src={`${base}eagle-circle.png`} alt="Headwaters" style={{ width: "0.3in", height: "0.3in", objectFit: "contain", opacity: 0.75 }} />
              <div>
                <p style={{ fontSize: "0.56rem", fontWeight: 700, color: CREAM, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0, lineHeight: 1.2 }}>Headwaters</p>
                <p style={{ fontSize: "0.42rem", color: "rgba(244,237,224,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Development Services</p>
              </div>
            </div>
          </div>

          {/* Bottom headline */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2, padding: "0 0.65in 0.62in" }}>
            <p style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, margin: "0 0 0.18in" }}>
              G.M. Pepin Holdings Inc.
            </p>
            <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "2.8rem", fontWeight: 700, color: WHITE, lineHeight: 1.08, margin: "0 0 0.22in", maxWidth: "6.2in" }}>
              Six weeks.<br />
              A plan you can both<br />
              step back from.
            </h1>
            <p style={{ fontSize: "0.7rem", color: "rgba(244,237,224,0.55)", margin: 0, letterSpacing: "0.06em" }}>
              A private proposal · May 2026
            </p>
          </div>
        </div>

        {/* ── PAGE 2: JOURNEY ───────────────────────────────────── */}
        <div
          className="page-letter"
          style={{
            width: "8.5in",
            minHeight: "11in",
            background: CREAM,
            fontFamily: "Inter, system-ui, sans-serif",
            color: INK,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Amber top rule */}
          <div style={{ height: "0.055in", background: AMBER }} />

          {/* Lead */}
          <div style={{ padding: "0.5in 0.65in 0.42in" }}>
            <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.12rem", lineHeight: 1.58, color: DARK, margin: 0, maxWidth: "6.5in" }}>
              There's a version of this where you step back on your terms —
              and everything you built keeps moving.
            </p>
          </div>

          {/* Phase section label */}
          <div style={{ padding: "0 0.65in 0.18in" }}>
            <p style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, margin: 0 }}>
              The plan
            </p>
          </div>

          {/* Three phases */}
          <div style={{ padding: "0 0.65in", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.18in" }}>
            {phases.map((p) => {
              const c = phaseColors(p.style);
              return (
                <div
                  key={p.phase}
                  style={{
                    background: c.bg,
                    border: `1.5px solid ${c.border}`,
                    borderRadius: "5px",
                    padding: "0.28in 0.28in 0.3in",
                  }}
                >
                  <p style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: c.phase, margin: "0 0 0.06in" }}>
                    {p.phase}
                  </p>
                  <p style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: c.tag, margin: "0 0 0.1in" }}>
                    {p.year}
                  </p>
                  <h3 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.15rem", fontWeight: 700, color: c.label, margin: "0 0 0.18in", lineHeight: 1.1 }}>
                    {p.label}
                  </h3>
                  <div style={{ borderTop: `1px solid ${p.style === "dark" ? "rgba(244,237,224,0.15)" : "#d6cfc3"}`, paddingTop: "0.16in" }}>
                    {p.bullets.map((b, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.1in", marginBottom: "0.1in" }}>
                        <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: c.bullet, flexShrink: 0, marginTop: "0.07in" }} />
                        <p style={{ margin: 0, fontSize: "0.69rem", lineHeight: 1.5, color: c.text }}>{b}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* How it starts */}
          <div style={{ padding: "0.35in 0.65in 0" }}>
            <p style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, margin: "0 0 0.16in" }}>
              How Phase 1 works
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.18in 0.45in" }}>
              <div style={{ borderTop: `2px solid ${AMBER}`, paddingTop: "0.14in" }}>
                <h4 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.85rem", fontWeight: 600, color: DARK, margin: "0 0 0.08in" }}>
                  A voice note on your time
                </h4>
                <p style={{ margin: 0, fontSize: "0.72rem", lineHeight: 1.6, color: INK }}>
                  In the truck, between calls, in French or English — you talk, I build it into something usable.
                  The difference between a voice note on your time and a phone call on her time is everything.
                </p>
              </div>
              <div style={{ borderTop: `2px solid ${AMBER}`, paddingTop: "0.14in" }}>
                <h4 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.85rem", fontWeight: 600, color: DARK, margin: "0 0 0.08in" }}>
                  You keep running the hotel
                </h4>
                <p style={{ margin: 0, fontSize: "0.72rem", lineHeight: 1.6, color: INK }}>
                  No planning room. No new systems to learn.
                  I handle the thinking that keeps getting pushed off.
                  Six weeks — then you have something real to hand to.
                </p>
              </div>
            </div>
          </div>

          {/* Fee + CTA */}
          <div style={{ padding: "0.35in 0.65in 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.18in 0.45in" }}>
            <div style={{ background: DARK, borderRadius: "5px", padding: "0.24in 0.28in" }}>
              <p style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,237,224,0.4)", margin: "0 0 0.1in" }}>
                How it gets paid for
              </p>
              <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.0rem", fontWeight: 700, color: WHITE, margin: "0 0 0.1in", lineHeight: 1.2 }}>
                No new cheque.<br />The $72,000 is already there.
              </p>
              <p style={{ fontSize: "0.68rem", color: "rgba(244,237,224,0.65)", margin: 0, lineHeight: 1.55 }}>
                Phase 1 draws $28,000 at $175/hr.<br />
                The remaining balance funds what you both decide comes next.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0.1in 0" }}>
              <p style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, margin: "0 0 0.1in" }}>
                To start
              </p>
              <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.0rem", fontWeight: 700, color: DARK, margin: "0 0 0.1in", lineHeight: 1.3 }}>
                One conversation —<br />both of you if you'd like.
              </p>
              <p style={{ fontSize: "0.72rem", color: INK, margin: "0 0 0.12in", lineHeight: 1.55 }}>
                What does stepping back actually look like — for both of you?
                Your wife is welcome on the call.
              </p>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: EVERGREEN, margin: 0 }}>
                A reply is enough to reactivate.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "auto", borderTop: "1px solid rgba(45,27,14,0.1)", padding: "0.18in 0.65in", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.1in" }}>
              <img src={`${base}eagle-circle.png`} alt="Headwaters" style={{ width: "0.2in", height: "0.2in", objectFit: "contain", opacity: 0.5 }} />
              <span style={{ fontSize: "0.55rem", color: MUTED, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Headwaters Development Services · Private
              </span>
            </div>
            <p style={{ fontSize: "0.55rem", color: MUTED, margin: 0 }}>May 2026</p>
          </div>
        </div>
      </div>
    </>
  );
}
