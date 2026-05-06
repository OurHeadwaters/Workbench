import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";

export default function Letterhead() {
  return (
    <>
      <PrintNav targetId="pdf-target" filename="headwaters-letterhead.pdf" />
      <div id="pdf-target" className="print-page page-letter" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "11in" }}>

          {/* Header band */}
          <div
            style={{
              background: EVERGREEN,
              padding: "0.35in 0.65in 0.3in",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "0.5in",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.5rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(244,237,224,0.5)",
                  marginBottom: "0.08in",
                }}
              >
                Development Services
              </p>
              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: CREAM,
                  lineHeight: 1,
                  letterSpacing: "-0.015em",
                }}
              >
                Headwaters
              </h1>
              <div
                style={{
                  width: "0.7in",
                  height: 2,
                  background: RUST,
                  margin: "0.1in 0 0.07in",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "0.58rem",
                  fontStyle: "italic",
                  color: "rgba(244,237,224,0.65)",
                }}
              >
                Community tools · food systems · operational software
              </p>
            </div>

            <div style={{ textAlign: "right", flexShrink: 0 }}>
              {[
                "bobbie@ourheadwaters.ca",
                "807 220 3654 · text preferred",
                "ourheadwaters.ca",
                "Dryden, Ontario",
              ].map((line) => (
                <p
                  key={line}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.55rem",
                    color: "rgba(244,237,224,0.65)",
                    lineHeight: 1.7,
                    letterSpacing: "0.01em",
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Date / recipient area */}
          <div style={{ padding: "0.45in 0.65in 0" }}>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.72rem",
                color: MUTED,
                marginBottom: "0.25in",
              }}
            >
              {new Date().toLocaleDateString("en-CA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <div style={{ marginBottom: "0.35in" }}>
              {["[Recipient name]", "[Organisation]", "[Address line 1]", "[City, Province]"].map(
                (line) => (
                  <p
                    key={line}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.78rem",
                      color: "#bbb",
                      lineHeight: 1.6,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {line}
                  </p>
                )
              )}
            </div>

            {/* Body placeholder lines */}
            <div style={{ marginBottom: "0.2in" }}>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "0.82rem",
                  color: "#2b2116",
                  marginBottom: "0.18in",
                  lineHeight: 1.6,
                }}
              >
                Dear [Name],
              </p>
              {[
                { h: "2.5in" },
                { h: "2.5in" },
                { h: "1.4in" },
              ].map(({ h }, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: "0.18in",
                    lineHeight: 1.75,
                  }}
                >
                  {Array.from({ length: Math.round(parseFloat(h) / 0.175) }).map((_, j) => (
                    <div
                      key={j}
                      style={{
                        height: "0.5px",
                        background: "rgba(31,61,46,0.08)",
                        marginBottom: "0.175in",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>

            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "0.82rem",
                color: "#2b2116",
                marginBottom: "0.35in",
              }}
            >
              Sincerely,
            </p>
          </div>

          {/* Signature area */}
          <div style={{ padding: "0 0.65in", marginTop: "auto" }}>
            <div
              style={{
                borderTop: `1.5px solid ${RUST}`,
                paddingTop: "0.15in",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: EVERGREEN,
                    marginBottom: "0.02in",
                  }}
                >
                  Bobbie Parr
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: MUTED,
                  }}
                >
                  Practitioner · Headwaters Development Services
                </p>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "0.55rem",
                  fontStyle: "italic",
                  color: MUTED,
                }}
              >
                ourheadwaters.ca
              </p>
            </div>
          </div>

          {/* Footer rule */}
          <div
            style={{
              height: "0.12in",
              background: EVERGREEN,
              marginTop: "0.25in",
            }}
          />
        </div>
      </div>
    </>
  );
}
