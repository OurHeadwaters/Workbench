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
    "Right now, one outside business decides what your community eats — and what it costs. Your community has no say.",
    "",
    "Prices set by someone who doesn't live here.",
    "If it closes, there is no backup.",
    "",
    "Every dollar spent there leaves Deer Lake and doesn't come back.",
    "",
    "---",
    "",
    "PAGE 2 — THE OPPORTUNITY",
    "",
    "A store your community owns.",
    "",
    "A community store doesn't compete with what's already there. It fills the gaps — affordable food, local ownership, money that stays in Deer Lake.",
    "",
    "Affordable basics — Everyday staples at prices that make sense for your community.",
    "Locally owned — Community members decide what's stocked, what it costs, and who works there.",
    "Less dependence — Your food supply doesn't depend on one outside operator staying open.",
    "",
    "---",
    "",
    "PAGE 3 — HOW IT WORKS",
    "",
    "We build the plan. You decide what happens next.",
    "",
    "What Deer Lake walks away with after 6 weeks:",
    "→ A clear plan for what to sell and where it comes from",
    "→ A structure for community ownership and governance",
    "→ A day-to-day operations guide — orders, pricing, cash",
    "→ A hiring plan: who to bring on first and how to train them",
    "→ A funding package ready to submit to government programs",
    "",
    "$25,000 · 6-week engagement · flat fee",
    "You can stop at any point. Everything built stays with Deer Lake.",
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

const WONK0: CSSProperties = { fontVariationSettings: '"WONK" 0' };

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
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "3.2rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.0, letterSpacing: "-0.02em", ...WONK0 }}>
              One store.<br />One point<br />of failure.
            </h1>
          </div>

          {/* Boreal photo strip */}
          <div style={{ width: "100%", height: "3.0in", flexShrink: 0, overflow: "hidden", position: "relative" }}>
            <img
              src={`${base}hero-boreal.png`}
              alt="Northern boreal lake at golden hour"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", display: "block" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(31,61,46,0.18) 100%)" }} />
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: "0.38in 0.7in 0.3in", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3in" }}>

              <div>
                <div style={{ width: "0.5in", height: 3, background: "var(--rust)", marginBottom: "0.18in" }} />
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.18rem", fontWeight: 700, color: "var(--evergreen)", lineHeight: 1.45, maxWidth: "5.5in" }}>
                  Right now, one outside business decides what your community eats — and what it costs. Your community has no say.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.28in" }}>
                {[
                  {
                    head: "Prices set by someone who doesn't live here",
                    body: "What's on the shelf, what it costs, and when the store is open — none of that is up to your community.",
                  },
                  {
                    head: "If it closes, there is no backup",
                    body: "One store, one supply line. If it shuts down or pulls back, Deer Lake has nowhere else to turn.",
                  },
                ].map((card) => (
                  <div key={card.head} style={{ borderTop: "2px solid var(--rust)", paddingTop: "0.15in" }}>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.87rem", fontWeight: 700, color: "var(--evergreen)", lineHeight: 1.35, marginBottom: "0.09in" }}>
                      {card.head}
                    </p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.74rem", color: "var(--muted)", lineHeight: 1.6 }}>
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>

              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontStyle: "italic", color: "var(--muted)", lineHeight: 1.5 }}>
                Every dollar spent there leaves Deer Lake and doesn't come back.
              </p>

            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(31,61,46,0.3)" }}>1 of 3</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(31,61,46,0.3)" }}>The problem</p>
            </div>
          </div>
        </div>

        {/* ── PAGE 2 ── The opportunity */}
        <div style={{ ...PAGE }}>

          {/* Harvest photo — full width top */}
          <div style={{ width: "100%", height: "3.4in", flexShrink: 0, overflow: "hidden", position: "relative" }}>
            <img
              src={`${base}hero-harvest.jpeg`}
              alt="Community members working together during harvest in northern Ontario"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 55%, rgba(244,237,224,0.55) 100%)" }} />
            <p style={{ position: "absolute", bottom: "0.15in", left: "0.25in", fontFamily: "var(--font-sans)", fontSize: "0.52rem", color: "rgba(31,61,46,0.5)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Northwestern Ontario
            </p>
          </div>

          {/* Content */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "0.18in 1fr" }}>
            <div style={{ background: "var(--evergreen)" }} />
            <div style={{ padding: "0.42in 0.65in 0.3in", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.34in" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.14in" }}>
                    The opportunity
                  </p>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 900, color: "var(--evergreen)", lineHeight: 1.05, letterSpacing: "-0.02em", ...WONK0 }}>
                    A store your<br />community owns.
                  </h2>
                </div>

                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--ink)", lineHeight: 1.68, maxWidth: "5in" }}>
                  A community store doesn't compete with what's already there. It fills the gaps — affordable food, local ownership, money that stays in Deer Lake.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.22in" }}>
                  {[
                    {
                      head: "Affordable basics",
                      body: "Everyday staples at prices that make sense for your community — not for a business trying to maximize profit from outside.",
                    },
                    {
                      head: "Owned by your community",
                      body: "Community members decide what's stocked, what it costs, and who works there. The store answers to Deer Lake.",
                    },
                    {
                      head: "Less dependence on one operator",
                      body: "Your food supply shouldn't depend on one outside business staying open. This changes that.",
                    },
                  ].map((item) => (
                    <div key={item.head} style={{ display: "flex", gap: "0.2in", alignItems: "flex-start" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--rust)", flexShrink: 0, marginTop: "0.22rem" }} />
                      <div>
                        <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.87rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.05rem" }}>{item.head}</p>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.74rem", color: "var(--muted)", lineHeight: 1.55 }}>{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(31,61,46,0.3)" }}>2 of 3</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(31,61,46,0.3)" }}>The opportunity</p>
              </div>

            </div>
          </div>
        </div>

        {/* ── PAGE 3 ── How it works */}
        <div style={{ ...PAGE }}>

          {/* Rust header */}
          <div style={{ background: "var(--rust)", padding: "0.44in 0.7in 0.4in", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "0.15rem" }}>
              How it works
            </p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 900, color: "white", lineHeight: 1.05, letterSpacing: "-0.02em", ...WONK0 }}>
              We build the plan.<br />You decide what<br />happens next.
            </h2>
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: "0.42in 0.7in 0.32in", display: "flex", flexDirection: "column", gap: "0.34in" }}>

            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.18in" }}>
                What Deer Lake walks away with after 6 weeks
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.5in" }}>
                {[
                  "A clear plan for what to sell and where it comes from",
                  "A structure for community ownership and governance",
                  "A day-to-day operations guide — orders, pricing, cash",
                  "A hiring plan: who to bring on first and how to train them",
                  "A funding package ready to submit to government programs",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", gap: "0.14in", alignItems: "flex-start", borderBottom: "1px solid rgba(31,61,46,0.1)", paddingBottom: "0.12in", marginBottom: "0.12in" }}>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", color: "var(--rust)", lineHeight: 1.2, flexShrink: 0, ...WONK0 }}>→</span>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.79rem", color: "var(--ink)", lineHeight: 1.48 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fee block */}
            <div style={{ background: "var(--evergreen)", borderRadius: 6, padding: "0.28in 0.38in", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,237,224,0.6)", marginBottom: "0.06rem" }}>
                  What it costs
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1.3 }}>
                  One flat fee. Six weeks. No hourly billing.
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "rgba(244,237,224,0.65)", marginTop: "0.05rem" }}>
                  You can stop at any point. Everything built stays with Deer Lake.
                </p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", fontWeight: 900, color: "white", lineHeight: 1 }}>$25k</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.55rem", color: "rgba(244,237,224,0.55)", letterSpacing: "0.1em", textTransform: "uppercase" }}>CAD · excl. HST</p>
              </div>
            </div>

            {/* Contact + closing */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(31,61,46,0.12)", paddingTop: "0.2in" }}>
              <div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.04rem" }}>Headwaters Development Services</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--muted)" }}>bobbie@ourheadwaters.ca · ourheadwaters.ca</p>
              </div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(31,61,46,0.3)" }}>3 of 3</p>
            </div>

          </div>

          {/* Closing bar */}
          <div style={{ width: "100%", height: "0.12in", flexShrink: 0, background: "var(--rust)" }} />

        </div>

      </div>
    </>
  );
}
