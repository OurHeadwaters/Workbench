import { Link } from "wouter";
import QRCodeStamp from "../components/QRCodeStamp";

function PrintNav() {
  return (
    <div className="no-print screen-nav">
      <Link href="/">← Back to suite</Link>
      <button className="btn-print" onClick={() => window.print()}>
        🖨 Print this page
      </button>
    </div>
  );
}

const offerings = [
  {
    name: "Preservation",
    tagline: "Jar by jar, season by season",
    desc: "The complete Jarista practice — water bath and pressure canning, fermentation, freeze-drying, dehydrating, and root cellaring. How to build a Seasonal Shelf that carries your household through supply-chain gaps and hard winters.",
  },
  {
    name: "Preparedness",
    tagline: "Resting state to activated state",
    desc: "Household and community emergency preparedness as a living system, not a checklist. The Standby discipline: stocked, current, practised, and ready to activate — without the paranoia, without the bunker.",
  },
  {
    name: "Permaculture",
    tagline: "Design with the land",
    desc: "Growing food in the north: kratky hydroponics, microgreens, indoor systems for year-round production, outdoor beds suited to the Territory's short seasons. Designing with what the land offers rather than against it.",
  },
  {
    name: "Seasonal Living",
    tagline: "The calendar the grocery store ignores",
    desc: "Eating and living by the season: what to grow, preserve, and plan for each quarter of the northern Ontario year. Sourcing locally, buying from farmers markets, and changing what you eat to match what the territory actually produces.",
  },
  {
    name: "Decentralization",
    tagline: "Grassroots community and productive local economies",
    desc: "The philosophy and the practice: voluntary exchange, mutual aid, peer-to-peer community organization, local food systems, and the codetry disciplines that hold community institutions together when the external systems fail.",
  },
];

export default function GoingDigital() {
  return (
    <>
      <PrintNav />
      <div
        className="print-page"
        style={{
          padding: 0,
          overflow: "hidden",
          background: "var(--cream)",
          minHeight: "11in",
        }}
      >
        <div
          style={{
            position: "relative",
            minHeight: "11in",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Decorative background */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: "0.8in",
                right: "-1.5in",
                width: "5in",
                height: "5in",
                borderRadius: "50%",
                background: "rgba(31,61,46,0.04)",
              }}
            />
          </div>

          {/* Header band */}
          <div
            style={{
              background: "var(--evergreen)",
              padding: "0.45in 0.6in 0.4in",
              flexShrink: 0,
              position: "relative",
              zIndex: 1,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.58rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(244,237,224,0.5)",
                marginBottom: "0.15rem",
              }}
            >
              Headwaters · Online Learning
            </p>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.8rem",
                fontWeight: 900,
                color: "var(--cream)",
                lineHeight: 1.0,
                letterSpacing: "-0.025em",
                marginBottom: "0.2rem",
              }}
            >
              The knowledge is online now.
            </h1>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1rem",
                fontStyle: "italic",
                color: "var(--rust-light)",
                lineHeight: 1.4,
                maxWidth: "5in",
              }}
            >
              A decade of homestead practice, community building, and seasonal living — organized into five courses you can take at your own pace, from wherever you are.
            </p>
          </div>

          {/* Body */}
          <div
            style={{
              flex: 1,
              padding: "0.35in 0.6in 0.3in",
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Intro */}
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.78rem",
                color: "#3a3a3a",
                lineHeight: 1.65,
                maxWidth: "5.5in",
                marginBottom: "0.28in",
              }}
            >
              For years this content lived in farmers market conversations, community workshops, and a lot of personal messages. It is now housed at <strong style={{ color: "var(--evergreen)" }}>ourheadwaters.ca</strong> — five interlocking courses built around the same system the homestead runs on. You don't have to live in Dryden. The practice travels.
            </p>

            {/* Offerings */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.18in",
                marginBottom: "0.3in",
              }}
            >
              {offerings.map((o, i) => (
                <div
                  key={o.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "0.08in 1.4in 1fr",
                    gap: "0 0.22in",
                    alignItems: "start",
                  }}
                >
                  <div
                    style={{
                      width: "0.08in",
                      marginTop: "0.1rem",
                      height: "100%",
                      background: i % 2 === 0 ? "var(--rust)" : "var(--evergreen)",
                      borderRadius: 2,
                      minHeight: "0.5in",
                    }}
                  />
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "var(--evergreen)",
                        lineHeight: 1.2,
                        marginBottom: "0.05rem",
                      }}
                    >
                      {o.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.58rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--rust)",
                      }}
                    >
                      {o.tagline}
                    </p>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.72rem",
                      color: "#3a3a3a",
                      lineHeight: 1.55,
                    }}
                  >
                    {o.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                marginBottom: "0.22in",
              }}
            >
              <div style={{ height: 1, background: "rgba(31,61,46,0.18)", flex: 1 }} />
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--rust)",
                }}
              />
              <div style={{ height: 1, background: "rgba(31,61,46,0.18)", flex: 1 }} />
            </div>

            {/* Pull quote */}
            <div
              style={{
                borderLeft: "3px solid var(--rust)",
                paddingLeft: "0.22in",
                marginBottom: "0.28in",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "0.88rem",
                  fontStyle: "italic",
                  color: "var(--evergreen)",
                  lineHeight: 1.55,
                }}
              >
                "Grassroots community and productive local economies are the only fighting chance. A depression may be around the corner but being depressed never has to be a reality we face — not when you build your life around the simple things that matter."
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.62rem",
                  color: "var(--muted)",
                  marginTop: "0.08rem",
                }}
              >
                — Bobbie Parr, Headwaters
              </p>
            </div>

            {/* What's included note */}
            <div
              style={{
                background: "rgba(31,61,46,0.06)",
                borderRadius: 8,
                padding: "0.16in 0.22in",
                marginBottom: "0.22in",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "0.1rem",
                }}
              >
                What you get at ourheadwaters.ca
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.08in 0.3in",
                }}
              >
                {[
                  "The five courses — self-paced, in your own time",
                  "The Codetry Handbook — the vocabulary and practice of community economics",
                  "Community connection — Dryden-based and expanding across the territory",
                  "Seasonal prompts — what to do now, each quarter of the year",
                  "The Jarista framework — household food systems, built to last",
                  "The Headwaters newsletter — when there's something worth saying",
                ].map((item) => (
                  <div
                    key={item}
                    style={{ display: "flex", alignItems: "flex-start", gap: "0.12rem" }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "0.7rem",
                        color: "var(--rust)",
                        lineHeight: 1.4,
                        flexShrink: 0,
                        marginRight: "0.1rem",
                      }}
                    >
                      ·
                    </span>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.7rem",
                        color: "#3a3a3a",
                        lineHeight: 1.45,
                      }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                background: "var(--evergreen)",
                borderRadius: 8,
                padding: "0.2in 0.35in",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "auto",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--cream)",
                    marginBottom: "0.05rem",
                  }}
                >
                  ourheadwaters.ca
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.7rem",
                    color: "rgba(244,237,224,0.75)",
                    lineHeight: 1.55,
                  }}
                >
                  bobbie@ourheadwaters.ca · 807 220 3654
                  <br />
                  <span style={{ fontSize: "0.62rem", opacity: 0.75 }}>
                    Dryden, Ontario · Treaty 3 Territory
                  </span>
                </p>
              </div>
              <QRCodeStamp light />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
