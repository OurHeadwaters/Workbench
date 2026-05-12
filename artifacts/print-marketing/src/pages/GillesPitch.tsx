import type { CSSProperties } from "react";
import { PrintNav } from "../components/PrintNav";

const base = import.meta.env.BASE_URL;

const CREAM    = "#f4ede0";
const EVERGREEN = "#1f3d2e";
const RUST     = "#b85a3e";
const INK      = "#1a1a1a";
const MUTED    = "#6b7560";

const PAGE: CSSProperties = {
  width: "8.5in",
  minHeight: "11in",
  background: CREAM,
  display: "flex",
  flexDirection: "column",
  fontFamily: "Inter, system-ui, sans-serif",
  color: INK,
  position: "relative",
  overflow: "hidden",
};

export default function GillesPitch() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-gilles-proposal.pdf"
        paginate={false}
      />

      <div id="pdf-target" style={{ background: "#d8d2c8" }}>
        <div className="page-letter" style={PAGE}>

          {/* ── TOP BAND ── */}
          <div style={{
            background: EVERGREEN,
            padding: "0.45in 0.65in 0.38in",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}>
            <div>
              <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.62rem", color: "rgba(244,237,224,0.55)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.1in" }}>
                Private · Headwaters Development Services
              </p>
              <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.65rem", color: CREAM, lineHeight: 1.2, fontWeight: 600, margin: 0 }}>
                Six weeks.<br />A plan you can both step back from.
              </h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.12in", marginBottom: "0.08in" }}>
                <img
                  src={`${base}eagle-circle.png`}
                  alt="Headwaters"
                  style={{ width: "0.38in", height: "0.38in", objectFit: "contain", opacity: 0.88 }}
                />
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: "0.62rem", fontWeight: 700, color: CREAM, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0, lineHeight: 1.2 }}>Headwaters</p>
                  <p style={{ fontSize: "0.48rem", color: "rgba(244,237,224,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Development Services</p>
                </div>
              </div>
              <p style={{ fontSize: "0.6rem", color: "rgba(244,237,224,0.55)", margin: 0, textAlign: "right" }}>
                May 2026
              </p>
            </div>
          </div>

          {/* ── BODY ── */}
          <div style={{ flex: 1, padding: "0.45in 0.65in 0.4in", display: "flex", flexDirection: "column", gap: "0.28in" }}>

            {/* Direct opener */}
            <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.05rem", lineHeight: 1.55, color: EVERGREEN, maxWidth: "6.8in", margin: 0 }}>
              You built something real in Deer Lake. The band wants it. The hotel runs. The food moves. The problem isn't the couple burning out or the tools that walk off — it's that everything that keeps it working is still inside your head. When you slow down, it goes with you. There's a version of this where you and your wife get to design what the next chapter looks like — together, on your terms. That version needs a system under it first.
            </p>

            {/* Three honest problems */}
            <div style={{ borderLeft: `3px solid ${RUST}`, paddingLeft: "0.22in" }}>
              <p style={{ fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST, marginBottom: "0.12in", fontWeight: 600 }}>
                What's actually going on
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.1in" }}>
                {[
                  "The couple running the kitchen is burning out. 4am to 8pm, six months and they're gone. You've been through this cycle before.",
                  "The band likes what you've built — but they're starting to think you're expensive. That gap gets bigger if there's no plan.",
                  "You and your wife haven't sat down with the same picture yet. What does stepping back actually look like — for both of you? That conversation is easier when there's something real to hand it to.",
                ].map((line, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.12in", alignItems: "flex-start" }}>
                    <span style={{ color: RUST, fontWeight: 700, flexShrink: 0, marginTop: "0.01in" }}>—</span>
                    <p style={{ fontSize: "0.78rem", color: INK, lineHeight: 1.55, margin: 0 }}>{line}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What two weeks does */}
            <div>
              <p style={{ fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: EVERGREEN, marginBottom: "0.14in", fontWeight: 600 }}>
                What six weeks builds
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.18in 0.4in" }}>
                {[
                  {
                    head: "A generation becomes a legacy",
                    body: "The common sense in your guys' heads — where things are, how things work, what to do when things go sideways — gets captured in the work they're already doing. Not a manual nobody reads. A system that carries it forward. When the old guys slow down, the business doesn't.",
                  },
                  {
                    head: "A voice tool built around how you think",
                    body: "You send a voice note — in French, in English, mid-drive, mid-shift. It hears your accent. I turn what you said into the next move for whoever's on shift. No typing, no system to manage. You talk, it listens, things get done. The difference between a voice note on your time and a phone call on her time is everything.",
                  },
                  {
                    head: "The hidden cost, made visible",
                    body: "A tool walks off — acceptable loss. But the real cost is the hour spent searching, the job done wrong because nobody knew the right way, the new person who quit because nobody showed them anything. That cost compounds. A simple asset and resource layer stops it.",
                  },
                  {
                    head: "A Deer Lake connection",
                    body: "If the community store contract comes through in 2027, the same operational layer runs both. The hotel's supply rhythm feeds the store's inventory. Volume purchasing improves. Two operations, one system — better prices, less overhead for both.",
                  },
                ].map((card) => (
                  <div key={card.head} style={{ borderTop: `2px solid ${RUST}`, paddingTop: "0.12in" }}>
                    <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.87rem", fontWeight: 700, color: EVERGREEN, lineHeight: 1.3, marginBottom: "0.07in" }}>
                      {card.head}
                    </p>
                    <p style={{ fontSize: "0.73rem", color: MUTED, lineHeight: 1.58 }}>
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div style={{ background: `rgba(31,61,46,0.06)`, borderRadius: 6, padding: "0.2in 0.28in" }}>
              <p style={{ fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: EVERGREEN, marginBottom: "0.1in", fontWeight: 600 }}>
                How it works
              </p>
              <p style={{ fontSize: "0.78rem", color: INK, lineHeight: 1.6, margin: 0 }}>
                You don't sit in a planning room. You send a voice note — in the truck, between calls, whenever something comes up. French, English, whatever comes out. I take what you said and build it into something usable. You keep running the hotel. I handle the thinking that keeps getting pushed off.
              </p>
              <p style={{ fontSize: "0.73rem", color: MUTED, lineHeight: 1.55, marginTop: "0.12in", marginBottom: 0, fontStyle: "italic" }}>
                Two years ago I couldn't have built this. The voice tools, the knowledge architecture, the data — I've been building toward this the whole time. What I'm offering now is something I genuinely couldn't have delivered then. The timing is right.
              </p>
            </div>

            {/* Fee + next step */}
            <div style={{ display: "flex", gap: "0.4in", alignItems: "flex-start", borderTop: `1px solid rgba(31,61,46,0.12)`, paddingTop: "0.22in" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED, marginBottom: "0.06in" }}>
                  How this gets paid for
                </p>
                <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: EVERGREEN, lineHeight: 1.2, marginBottom: "0.08in" }}>
                  No new cheque. The $72,000 is already there.
                </p>
                <p style={{ fontSize: "0.72rem", color: MUTED, lineHeight: 1.55 }}>
                  Your company pre-paid $72,000 in business development services — held as agreed, set aside when the timing wasn't right. Six weeks at $175/hr draws $28,000 against that balance. The remaining credit is available for objectives you and your wife define together. Everything built stays yours.
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED, marginBottom: "0.06in" }}>
                  To start
                </p>
                <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.95rem", fontWeight: 600, color: EVERGREEN, lineHeight: 1.4, marginBottom: "0.06in" }}>
                  One conversation — with both of you if you'd like. What does the next chapter look like, and what needs to be true before you can live it?
                </p>
                <p style={{ fontSize: "0.72rem", color: MUTED, lineHeight: 1.5 }}>
                  A reply is enough to reactivate. No contract ceremony. Your wife is welcome on the call — she'll have the context and she should be part of the vision.
                </p>
                <p style={{ fontSize: "0.72rem", color: EVERGREEN, fontWeight: 600, marginTop: "0.1in" }}>
                  bobbie@ourheadwaters.ca · ourheadwaters.ca
                </p>
              </div>
            </div>

          </div>

          {/* ── RUST FOOTER BAR ── */}
          <div style={{ width: "100%", height: "0.12in", background: RUST, flexShrink: 0 }} />

        </div>
      </div>
    </>
  );
}
