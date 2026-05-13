import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";
const INK = "#2b2116";

export default function CoopComplianceNotice() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="807-coop-compliance-notice-2025.pdf"
      />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ padding: 0, overflow: "hidden", background: CREAM, minHeight: "11in" }}
      >
        <div style={{ position: "relative", minHeight: "11in", display: "flex", flexDirection: "column" }}>

          {/* Header band */}
          <div
            style={{
              background: EVERGREEN,
              padding: "0.35in 0.65in 0.3in",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "0.5in",
              flexShrink: 0,
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

          {/* Document body */}
          <div style={{ flex: 1, padding: "0.45in 0.65in 0.3in", display: "flex", flexDirection: "column" }}>

            {/* Memo header block */}
            <div
              style={{
                borderLeft: `3px solid ${RUST}`,
                paddingLeft: "0.18in",
                marginBottom: "0.38in",
              }}
            >
              {[
                { label: "To", value: "Board of Directors, 807 Food Co-operative Inc." },
                { label: "From", value: "Headwaters Development Services, on behalf of 807 Food Co-operative Inc." },
                { label: "Date", value: "May 23, 2026" },
                { label: "Re", value: "Financial Statement Compliance Notice — 2025 Fiscal Year" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "0.6in 1fr",
                    gap: "0.1in",
                    marginBottom: "0.07in",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.68rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: MUTED,
                      paddingTop: "0.01in",
                    }}
                  >
                    {label}:
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.82rem",
                      color: INK,
                      lineHeight: 1.5,
                      fontWeight: label === "Re" ? 600 : 400,
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: `rgba(31,61,46,0.15)`, marginBottom: "0.38in" }} />

            {/* Section 1 */}
            <section style={{ marginBottom: "0.38in" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.14in", marginBottom: "0.14in" }}>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: RUST,
                    flexShrink: 0,
                  }}
                >
                  1.
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: EVERGREEN,
                    lineHeight: 1.3,
                  }}
                >
                  CPA Engagement Letter Required
                </h2>
              </div>
              <div style={{ paddingLeft: "0.3in" }}>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.82rem",
                    color: INK,
                    lineHeight: 1.7,
                    marginBottom: "0.14in",
                  }}
                >
                  The 2025 financial statements were prepared as a compilation engagement. Under CPA Canada Section 4200
                  (effective for periods ending after December 14, 2021), any compilation intended for use by an external
                  party — including funders or financial institutions — must be accompanied by a signed practitioner's
                  engagement letter.
                </p>
                <div
                  style={{
                    background: "white",
                    border: `1px solid rgba(31,61,46,0.14)`,
                    borderLeft: `3px solid ${EVERGREEN}`,
                    borderRadius: 4,
                    padding: "0.14in 0.2in",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.62rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: EVERGREEN,
                      marginBottom: "0.06rem",
                    }}
                  >
                    Action Required
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.82rem",
                      color: INK,
                      lineHeight: 1.65,
                    }}
                  >
                    The co-op's accountant, Joshua Butler CPA, must issue and sign an engagement letter covering the
                    2025 compilation before the statements are distributed externally.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section style={{ marginBottom: "0.45in" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.14in", marginBottom: "0.14in" }}>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: RUST,
                    flexShrink: 0,
                  }}
                >
                  2.
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: EVERGREEN,
                    lineHeight: 1.3,
                  }}
                >
                  Members' Waiver — Resolution Validity
                </h2>
              </div>
              <div style={{ paddingLeft: "0.3in" }}>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.82rem",
                    color: INK,
                    lineHeight: 1.7,
                    marginBottom: "0.14in",
                  }}
                >
                  807's 2025 gross revenue was $233,650. At this revenue level under the Ontario Co-operative
                  Corporations Act, waiving the external accountant requirement requires an extraordinary resolution
                  passed by at least 80% of voting members. The co-op must confirm this resolution was formally
                  recorded in meeting minutes.
                </p>
                <div
                  style={{
                    background: "white",
                    border: `1px solid rgba(31,61,46,0.14)`,
                    borderLeft: `3px solid ${EVERGREEN}`,
                    borderRadius: 4,
                    padding: "0.14in 0.2in",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.62rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: EVERGREEN,
                      marginBottom: "0.06rem",
                    }}
                  >
                    Action Required
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.82rem",
                      color: INK,
                      lineHeight: 1.65,
                    }}
                  >
                    If the resolution was not formally recorded in meeting minutes, the board should pass and record
                    the resolution at the May 23, 2026 Annual General Meeting to ratify the waiver retroactively.
                  </p>
                </div>
              </div>
            </section>

            {/* Prepared by */}
            <div style={{ marginTop: "auto" }}>
              <div style={{ height: 1, background: `rgba(31,61,46,0.15)`, marginBottom: "0.22in" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.62rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: MUTED,
                      marginBottom: "0.05rem",
                    }}
                  >
                    Prepared by
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      color: EVERGREEN,
                      marginBottom: "0.02rem",
                    }}
                  >
                    Bobbie Parr
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.62rem",
                      letterSpacing: "0.06em",
                      color: MUTED,
                    }}
                  >
                    Practitioner · Headwaters Development Services
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.62rem",
                      color: MUTED,
                      marginTop: "0.02rem",
                    }}
                  >
                    On behalf of 807 Food Co-operative Inc.
                  </p>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.62rem",
                    fontStyle: "italic",
                    color: MUTED,
                  }}
                >
                  ourheadwaters.ca
                </p>
              </div>
            </div>
          </div>

          {/* Footer rule */}
          <div
            style={{
              height: "0.12in",
              background: EVERGREEN,
              flexShrink: 0,
            }}
          />
        </div>
      </div>
    </>
  );
}
