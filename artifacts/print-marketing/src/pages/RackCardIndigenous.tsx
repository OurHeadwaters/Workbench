import QRCodeStamp from "../components/QRCodeStamp";
import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";

const services = [
  {
    title: "Community Stores",
    desc: "From feasibility to opening day — governance, inventory, ownership models, and band-council alignment.",
  },
  {
    title: "Co-op Platforms",
    desc: "Member portals that track shares, equity, and governance — built for remote and northern communities.",
  },
  {
    title: "Food System Infrastructure",
    desc: "Market coordination, bulk buying, preservation programs, and Standby supply planning.",
  },
  {
    title: "Custom Software",
    desc: "Tools that speak the community's language. Built to last, not to impress a funder.",
  },
];

function buildPlainText(): string {
  const serviceLines = services.map(
    (s) => `${s.title}\n${s.desc}`
  ).join("\n\n");

  return [
    "HEADWATERS DEVELOPMENT SERVICES",
    "Development Services · Treaty 3 Territory",
    "Building community capacity and economic infrastructure in northern Ontario.",
    "",
    "---",
    "",
    "WHO WE WORK WITH",
    "",
    "Band councils, Indigenous businesses, First Nations organizations, Métis communities, and northern co-ops — anyone building something real for their people.",
    "",
    "---",
    "",
    "WHAT WE BUILD",
    "",
    serviceLines,
    "",
    "---",
    "",
    "\"We don't parachute in. We sit at your table, learn your words, and build something that belongs to your community — not to the funder.\"",
    "— Bobbie Parr, Wabigoon ON",
    "",
    "---",
    "",
    "ourheadwaters.ca",
    "bobbie@ourheadwaters.ca",
    "807 220 3654 · text preferred",
  ].join("\n");
}

export default function RackCardIndigenous() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-community-rack-card.pdf"
        format={[4, 9]}
        orientation="portrait"
        onCopyPlainText={buildPlainText}
      />

      <div
        className="page-letter"
        style={{
          background: "#d8d2c8",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "2.5rem 1.5rem",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            className="no-print"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: MUTED,
              marginBottom: "0.5rem",
            }}
          >
            Rack card · 4 × 9 in · for band offices, friendship centres &amp;
            cork boards
          </p>

          <div
            id="pdf-target"
            style={{
              width: "4in",
              height: "9in",
              background: CREAM,
              boxShadow: "0 4px 40px rgba(0,0,0,0.18)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Top evergreen band */}
            <div
              style={{
                background: EVERGREEN,
                padding: "0.35in 0.3in 0.3in",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-0.5in",
                  right: "-0.4in",
                  width: "2in",
                  height: "2in",
                  borderRadius: "50%",
                  background: "rgba(184,90,62,0.12)",
                  pointerEvents: "none",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.38rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(244,237,224,0.55)",
                  marginBottom: "0.12in",
                }}
              >
                Development Services · Treaty 3 Territory
              </p>
              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: CREAM,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  marginBottom: "0.12in",
                }}
              >
                Headwaters
              </h1>
              <div
                style={{
                  width: "0.6in",
                  height: 2,
                  background: RUST,
                  marginBottom: "0.14in",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "0.62rem",
                  fontStyle: "italic",
                  color: "rgba(244,237,224,0.82)",
                  lineHeight: 1.45,
                }}
              >
                Building community economic infrastructure in northern Ontario.
              </p>
            </div>

            {/* Body */}
            <div
              style={{
                flex: 1,
                padding: "0.28in 0.3in",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Who we work with */}
              <div style={{ marginBottom: "0.22in" }}>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.38rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: RUST,
                    marginBottom: "0.1in",
                  }}
                >
                  Who we work with
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.72rem",
                    lineHeight: 1.55,
                    color: EVERGREEN,
                  }}
                >
                  Band councils, Indigenous businesses, First Nations
                  organizations, Métis communities, and northern co-ops —
                  anyone building something real for their people.
                </p>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: "rgba(31,61,46,0.15)",
                  marginBottom: "0.22in",
                }}
              />

              {/* Services */}
              <div style={{ marginBottom: "0.22in" }}>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.38rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: RUST,
                    marginBottom: "0.12in",
                  }}
                >
                  What we build
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.13in",
                  }}
                >
                  {services.map((s) => (
                    <div key={s.title}>
                      <p
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: EVERGREEN,
                          marginBottom: "0.03in",
                        }}
                      >
                        {s.title}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.52rem",
                          color: MUTED,
                          lineHeight: 1.5,
                        }}
                      >
                        {s.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: "rgba(31,61,46,0.15)",
                  marginBottom: "0.18in",
                }}
              />

              {/* How we work */}
              <div style={{ marginBottom: "0.18in" }}>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.68rem",
                    fontStyle: "italic",
                    color: EVERGREEN,
                    lineHeight: 1.5,
                  }}
                >
                  "We don't parachute in. We sit at your table, learn your
                  words, and build something that belongs to your community
                  — not to the funder."
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.45rem",
                    color: MUTED,
                    marginTop: "0.07in",
                    letterSpacing: "0.05em",
                  }}
                >
                  — Bobbie Parr, Wabigoon ON
                </p>
              </div>

              <div style={{ flex: 1 }} />

              {/* Footer */}
              <div
                style={{
                  background: EVERGREEN,
                  borderRadius: 5,
                  padding: "0.2in 0.22in",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: CREAM,
                      marginBottom: "0.04in",
                    }}
                  >
                    ourheadwaters.ca
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.42rem",
                      color: "rgba(244,237,224,0.7)",
                      lineHeight: 1.6,
                    }}
                  >
                    bobbie@ourheadwaters.ca
                    <br />
                    807 220 3654 · text preferred
                  </p>
                </div>
                <QRCodeStamp light size={44} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
