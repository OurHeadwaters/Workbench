import { PrintNav } from "../components/PrintNav";

const base = import.meta.env.BASE_URL;

const CREAM     = "#f4ede0";
const DARK      = "#2D1B0E";
const AMBER     = "#C97228";
const EVERGREEN = "#1f3d2e";
const INK       = "#1a1a1a";
const MUTED     = "#7a6f64";
const WHITE     = "#ffffff";

export default function GillesPitch() {
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
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Full-bleed photo */}
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

          {/* Gradient: dark at top and bottom, clear in the middle */}
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
            <p
              style={{
                fontSize: "0.58rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(244,237,224,0.65)",
                margin: 0,
                fontWeight: 500,
              }}
            >
              Private · Headwaters Development Services
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.1in" }}>
              <img
                src={`${base}eagle-circle.png`}
                alt="Headwaters"
                style={{
                  width: "0.3in",
                  height: "0.3in",
                  objectFit: "contain",
                  opacity: 0.75,
                }}
              />
              <div>
                <p
                  style={{
                    fontSize: "0.56rem",
                    fontWeight: 700,
                    color: CREAM,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Headwaters
                </p>
                <p
                  style={{
                    fontSize: "0.42rem",
                    color: "rgba(244,237,224,0.45)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  Development Services
                </p>
              </div>
            </div>
          </div>

          {/* Bottom headline block */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 2,
              padding: "0 0.65in 0.62in",
            }}
          >
            <p
              style={{
                fontSize: "0.62rem",
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: AMBER,
                margin: "0 0 0.18in",
              }}
            >
              G.M. Pepin Holdings Inc.
            </p>

            <h1
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: "2.8rem",
                fontWeight: 700,
                color: WHITE,
                lineHeight: 1.08,
                margin: "0 0 0.22in",
                maxWidth: "6.2in",
              }}
            >
              Six weeks.
              <br />
              A plan you can both
              <br />
              step back from.
            </h1>

            <p
              style={{
                fontSize: "0.7rem",
                color: "rgba(244,237,224,0.55)",
                margin: 0,
                letterSpacing: "0.06em",
              }}
            >
              A private proposal · May 2026
            </p>
          </div>
        </div>

        {/* ── PAGE 2: CONTENT ───────────────────────────────────── */}
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

          {/* Lead paragraph */}
          <div style={{ padding: "0.52in 0.7in 0.42in" }}>
            <p
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: "1.08rem",
                lineHeight: 1.62,
                color: DARK,
                margin: 0,
                maxWidth: "6.8in",
              }}
            >
              You built something real in Deer Lake. The band wants it. The hotel runs.
              The food moves. Everything that keeps it working is still inside your head —
              and when you slow down, it goes with you. There's a version of this where
              you and your wife get to design what the next chapter looks like, together,
              on your terms. That version needs a system under it first.
            </p>
          </div>

          {/* What's actually going on */}
          <div style={{ padding: "0 0.7in 0.4in" }}>
            <p
              style={{
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: AMBER,
                margin: "0 0 0.18in",
              }}
            >
              What's actually going on
            </p>
            {[
              "The couple running the kitchen is burning out. 4am to 8pm, six months and they're gone. You've been through this cycle before.",
              "The band likes what you've built — but they're starting to think you're expensive. That gap gets bigger if there's no plan.",
              "You and your wife haven't sat down with the same picture yet. What does stepping back actually look like — for both of you? That conversation is easier when there's something real to hand it to.",
            ].map((text, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "0.2in",
                  marginBottom: "0.15in",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "0.22in",
                    height: "1.5px",
                    background: AMBER,
                    flexShrink: 0,
                    marginTop: "0.14in",
                  }}
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.79rem",
                    lineHeight: 1.65,
                    color: INK,
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>

          {/* What six weeks builds */}
          <div style={{ padding: "0 0.7in 0.4in" }}>
            <p
              style={{
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: MUTED,
                margin: "0 0 0.22in",
              }}
            >
              What six weeks builds
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.28in 0.45in",
              }}
            >
              {[
                {
                  head: "A generation becomes a legacy",
                  body: "The common sense in your guys' heads — where things are, how things work, what to do when things go sideways — gets captured in the work they're already doing. Not a manual nobody reads. A system that carries it forward.",
                },
                {
                  head: "A voice tool built around how you think",
                  body: "You send a voice note — in French, in English, mid-drive, mid-shift. I turn what you said into the next move for whoever's on shift. The difference between a voice note on your time and a phone call on her time is everything.",
                },
                {
                  head: "The hidden cost, made visible",
                  body: "A tool walks off — acceptable loss. But the real cost is the hour spent searching, the job done wrong, the new person who quit because nobody showed them anything. A simple asset layer stops it from compounding.",
                },
                {
                  head: "A Deer Lake connection",
                  body: "If the community store contract comes through in 2027, the same operational layer runs both. Volume purchasing improves. Two operations, one system — better prices, less overhead for both.",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  style={{ borderTop: `2px solid ${AMBER}`, paddingTop: "0.15in" }}
                >
                  <h3
                    style={{
                      fontFamily: "Fraunces, Georgia, serif",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      color: DARK,
                      margin: "0 0 0.08in",
                      lineHeight: 1.25,
                    }}
                  >
                    {card.head}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.74rem",
                      lineHeight: 1.65,
                      color: INK,
                    }}
                  >
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div style={{ padding: "0 0.7in 0.42in" }}>
            <div
              style={{
                background: "rgba(45,27,14,0.05)",
                border: "1px solid rgba(45,27,14,0.14)",
                borderRadius: "0.05in",
                padding: "0.28in 0.35in",
              }}
            >
              <p
                style={{
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: MUTED,
                  margin: "0 0 0.1in",
                }}
              >
                How it works
              </p>
              <p
                style={{
                  margin: "0 0 0.1in",
                  fontSize: "0.8rem",
                  lineHeight: 1.65,
                }}
              >
                You don't sit in a planning room. You send a voice note — in the truck,
                between calls, whenever something comes up. French, English, whatever comes
                out. I take what you said and build it into something usable.{" "}
                <strong>
                  You keep running the hotel. I handle the thinking that keeps getting pushed
                  off.
                </strong>
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.73rem",
                  lineHeight: 1.6,
                  color: MUTED,
                  fontStyle: "italic",
                }}
              >
                Two years ago I couldn't have built this. The voice tools, the knowledge
                architecture, the data — I've been building toward this the whole time. What
                I'm offering now is something I genuinely couldn't have delivered then. The
                timing is right.
              </p>
            </div>
          </div>

          {/* Fee + CTA */}
          <div
            style={{
              padding: "0 0.7in 0",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.45in",
              marginTop: "auto",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: MUTED,
                  margin: "0 0 0.12in",
                }}
              >
                How this gets paid for
              </p>
              <h3
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: "1.12rem",
                  fontWeight: 700,
                  color: DARK,
                  lineHeight: 1.2,
                  margin: "0 0 0.12in",
                }}
              >
                No new cheque.
                <br />
                The $72,000 is already there.
              </h3>
              <p
                style={{
                  margin: "0 0 0.1in",
                  fontSize: "0.74rem",
                  lineHeight: 1.65,
                }}
              >
                Your company pre-paid $72,000 in business development services — held as
                agreed, set aside until the timing was right. Six weeks at $175/hr draws
                $28,000 against that balance. The remaining credit is available for
                objectives you and your wife define together.
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.7rem",
                  color: MUTED,
                  lineHeight: 1.5,
                  fontStyle: "italic",
                }}
              >
                No contract ceremony. No new risk. Work starts when you're ready.
              </p>
            </div>

            <div>
              <p
                style={{
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: MUTED,
                  margin: "0 0 0.12in",
                }}
              >
                To start
              </p>
              <h3
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: DARK,
                  lineHeight: 1.3,
                  margin: "0 0 0.12in",
                }}
              >
                One conversation —<br />with both of you if you'd like.
              </h3>
              <p
                style={{
                  margin: "0 0 0.12in",
                  fontSize: "0.74rem",
                  lineHeight: 1.65,
                }}
              >
                What does the next chapter look like, and what needs to be true before you
                can live it? Your wife is welcome on the call — she'll have the context and
                the questions that matter most.
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: EVERGREEN,
                }}
              >
                A reply is enough to reactivate.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "auto",
              borderTop: "1px solid rgba(45,27,14,0.1)",
              padding: "0.18in 0.7in",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.1in" }}>
              <img
                src={`${base}eagle-circle.png`}
                alt="Headwaters"
                style={{
                  width: "0.2in",
                  height: "0.2in",
                  objectFit: "contain",
                  opacity: 0.5,
                }}
              />
              <span
                style={{
                  fontSize: "0.55rem",
                  color: MUTED,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
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
