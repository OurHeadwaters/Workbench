import type { CSSProperties } from "react";
import { PrintNav } from "../components/PrintNav";

const base = import.meta.env.BASE_URL;

function buildPlainText(): string {
  return [
    "HEADWATERS · DEER LAKE FIRST NATION",
    "",
    "---",
    "",
    "PAGE 1 — THE PROBLEM",
    "",
    "One store. One point of failure.",
    "",
    "When one outside operator controls the only grocery option, the community has no leverage — on price, on product, on anything.",
    "",
    "Priced by someone who doesn't live here.",
    "No fallback if it closes.",
    "",
    "Money leaves. Nothing comes back.",
    "",
    "---",
    "",
    "PAGE 2 — THE VISION",
    "",
    "Not a competitor. A complement.",
    "",
    "A community-owned store doesn't replace what exists. It fills the gaps — staples at honest prices — and keeps spending inside Deer Lake.",
    "",
    "Fill the gaps — Frozen staples and pantry basics the community can actually afford.",
    "Support local shops — The goal is more businesses, not fewer — a real internal economy.",
    "Break the single dependency — No community should have its food security tied to one outside operator.",
    "",
    "---",
    "",
    "PAGE 3 — THE EASY BUTTON",
    "",
    "We handle the plan. You handle the community.",
    "",
    "What you walk away with in 6 weeks:",
    "→ Store concept and supply chain map",
    "→ Governance and ownership structure",
    "→ Operations plan — ordering, pricing, cash handling",
    "→ Staffing framework and hiring sequence",
    "→ Funder-ready financial package",
    "",
    "$25,000 · 6-week pilot · flat fee",
    "Stop at any point. You keep everything built.",
    "",
    "Headwaters Development Services",
    "bobbie@ourheadwaters.ca · ourheadwaters.ca",
  ].join("\n");
}

const PAGE: CSSProperties = {
  width: "8.5in",
  minHeight: "11in",
  background: "var(--cream)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  pageBreakAfter: "always",
  breakAfter: "page",
};

export default function NorthernPilotPitch() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-northern-pilot-pitch.pdf"
        onCopyPlainText={buildPlainText}
      />

      <div id="pdf-target" style={{ background: "#d8d2c8" }}>

        {/* ── PAGE 1 ── The problem */}
        <div style={PAGE}>

          {/* Header */}
          <div style={{ background: "var(--evergreen)", padding: "0.48in 0.7in 0.44in", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,237,224,0.5)", marginBottom: "0.22rem" }}>
              Headwaters · Deer Lake First Nation
            </p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "3.2rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.0, letterSpacing: "-0.02em", fontVariationSettings: '"WONK" 0' }}>
              One store.<br />One point<br />of failure.
            </h1>
          </div>

          {/* Boreal photo strip */}
          <div style={{ width: "100%", height: "3.1in", flexShrink: 0, overflow: "hidden", position: "relative" }}>
            <img
              src={`${base}hero-boreal.png`}
              alt="Northern boreal lake at golden hour"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", display: "block" }}
            />
            {/* Evergreen overlay fade at bottom */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(31,61,46,0.22) 100%)" }} />
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: "0.38in 0.7in 0.3in", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.32in" }}>

              <div>
                <div style={{ width: "0.6in", height: 3, background: "var(--rust)", marginBottom: "0.2in" }} />
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 700, color: "var(--evergreen)", lineHeight: 1.4, maxWidth: "5.5in" }}>
                  When one outside operator controls the only grocery option, the community has no leverage — on price, on product, on anything.
                </p>
              </div>

              {/* Honest statement cards — no invented stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3in" }}>
                {[
                  {
                    head: "Priced by someone who doesn't live here",
                    body: "What's on the shelf, what it costs, and when the store is open — all decided by an outside operator.",
                  },
                  {
                    head: "No fallback if it closes",
                    body: "One store, one supply chain. If it fails or pulls back, the community has nowhere else to turn.",
                  },
                ].map((card) => (
                  <div key={card.head} style={{ borderTop: "2px solid var(--rust)", paddingTop: "0.16in" }}>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontWeight: 700, color: "var(--evergreen)", lineHeight: 1.3, marginBottom: "0.1in" }}>
                      {card.head}
                    </p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.74rem", color: "var(--muted)", lineHeight: 1.55 }}>
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>

              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontStyle: "italic", color: "var(--muted)", lineHeight: 1.5 }}>
                Money leaves. Nothing comes back.
              </p>

            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(31,61,46,0.3)" }}>1 of 3</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(31,61,46,0.3)" }}>The problem</p>
            </div>
          </div>
        </div>

        {/* ── PAGE 2 ── The vision */}
        <div style={{ ...PAGE }}>

          {/* Harvest photo — full width top */}
          <div style={{ width: "100%", height: "3.4in", flexShrink: 0, overflow: "hidden", position: "relative" }}>
            <img
              src={`${base}hero-harvest.jpeg`}
              alt="Community harvest — people working together in the northern fall"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }}
            />
            {/* Dark gradient at bottom so text below reads clearly */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 55%, rgba(244,237,224,0.6) 100%)" }} />
            {/* Caption */}
            <p style={{ position: "absolute", bottom: "0.15in", left: "0.25in", fontFamily: "var(--font-sans)", fontSize: "0.52rem", color: "rgba(31,61,46,0.55)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Community harvest · Northwestern Ontario
            </p>
          </div>

          {/* Content */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "0.18in 1fr" }}>
            <div style={{ background: "var(--evergreen)" }} />
            <div style={{ padding: "0.42in 0.65in 0.3in", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.38in" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.16in" }}>
                    The vision
                  </p>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 900, color: "var(--evergreen)", lineHeight: 1.05, letterSpacing: "-0.02em", fontVariationSettings: '"WONK" 0' }}>
                    Not a<br />competitor.<br />A complement.
                  </h2>
                </div>

                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--ink)", lineHeight: 1.65, maxWidth: "5in" }}>
                  A community-owned store doesn't replace what exists. It fills the gaps — staples at honest prices — and keeps spending inside Deer Lake.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.24in" }}>
                  {[
                    { head: "Fill the gaps", body: "Frozen staples and pantry basics the community can actually afford." },
                    { head: "Support local shops", body: "The goal is more businesses, not fewer — a real internal economy." },
                    { head: "Break the single dependency", body: "No community should have its food security tied to one outside operator." },
                  ].map((item) => (
                    <div key={item.head} style={{ display: "flex", gap: "0.22in", alignItems: "flex-start" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--rust)", flexShrink: 0, marginTop: "0.2rem" }} />
                      <div>
                        <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.04rem" }}>{item.head}</p>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.74rem", color: "var(--muted)", lineHeight: 1.5 }}>{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(31,61,46,0.3)" }}>2 of 3</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(31,61,46,0.3)" }}>The vision</p>
              </div>

            </div>
          </div>
        </div>

        {/* ── PAGE 3 ── The easy button */}
        <div style={{ ...PAGE }}>

          {/* Rust header */}
          <div style={{ background: "var(--rust)", padding: "0.42in 0.7in 0.38in", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "0.15rem" }}>
              The easy button
            </p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 900, color: "white", lineHeight: 1.05, letterSpacing: "-0.02em", fontVariationSettings: '"WONK" 0' }}>
              We handle the plan.<br />You handle the community.
            </h2>
          </div>

          {/* Eagle — full-width photo strip */}
          <div style={{ width: "100%", height: "2.6in", flexShrink: 0, overflow: "hidden", background: "var(--evergreen)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
              src={`${base}eagle-circle.png`}
              alt="Eagle in flight within a sun ring"
              style={{ height: "100%", width: "auto", objectFit: "contain", display: "block" }}
            />
          </div>

          {/* Body — deliverables full width */}
          <div style={{ flex: 1, padding: "0.36in 0.7in 0.3in", display: "flex", flexDirection: "column", gap: "0.28in" }}>

            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.16in" }}>
                What you walk away with in 6 weeks
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.5in" }}>
                {[
                  "Store concept and supply chain map",
                  "Governance and ownership structure",
                  "Operations plan — ordering, pricing, cash handling",
                  "Staffing framework and hiring sequence",
                  "Funder-ready financial package",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", gap: "0.14in", alignItems: "flex-start", borderBottom: "1px solid rgba(31,61,46,0.1)", paddingBottom: "0.11in", marginBottom: "0.11in" }}>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", color: "var(--rust)", lineHeight: 1.2, flexShrink: 0, fontVariationSettings: '"WONK" 0' }}>→</span>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--ink)", lineHeight: 1.45 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fee block */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.22in" }}>
              <div style={{ background: "var(--evergreen)", borderRadius: 6, padding: "0.28in 0.38in", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,237,224,0.6)", marginBottom: "0.06rem" }}>
                    Engagement
                  </p>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1.3 }}>
                    Flat fee. 6 weeks. No hourly rate.
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "rgba(244,237,224,0.65)", marginTop: "0.04rem" }}>
                    Stop at any point. You keep everything built.
                  </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", fontWeight: 900, color: "white", lineHeight: 1 }}>$25k</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.55rem", color: "rgba(244,237,224,0.55)", letterSpacing: "0.1em", textTransform: "uppercase" }}>CAD · excl. HST</p>
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.04rem" }}>Headwaters Development Services</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--muted)" }}>bobbie@ourheadwaters.ca · ourheadwaters.ca</p>
                </div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(31,61,46,0.3)" }}>3 of 3</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
