import QRCodeStamp from "../components/QRCodeStamp";
import { PrintNav } from "../components/PrintNav";

const terms: { term: string; sub?: string; def: string; note?: string }[] = [
  {
    term: "Constellation",
    def: "The full set of economic systems a community runs together. Not a network (which implies optional connection) and not an organization (which implies a single structure). A constellation: distinct systems, gravitationally related, each doing its own job.",
  },
  {
    term: "Primitive",
    def: "A named system inside the constellation that does a specific, irreducible job. Each primitive has a name chosen to hold across every context in which it appears — zones, seasons, personnel, tempo.",
  },
  {
    term: "Zone",
    def: "A domain of practice inside the constellation: household, finance, knowledge, emergency preparedness, land, and public. Primitives are hosted in zones but read by all zones.",
  },
  {
    term: "The Standby",
    def: "The primitive that holds emergency preparedness and emergency response as one system. In its resting state: always-on practice, stocked shelves, current contact trees, regular test-starts. In its activated state: open call, deployed stock, live rosters. One infrastructure, two states, one name.",
  },
  {
    term: "Resting state",
    sub: "Activated state",
    def: "The two operational states of The Standby. The infrastructure is the same in either state; only the valve position changes. The name holds in both. Resting: preparation. Activated: response.",
  },
  {
    term: "The Gate",
    def: "The primitive that holds the community's own language (bright side) and institutional language (massity) as two simultaneous sides of one membrane. It decides what crosses, logs every substitution, and refuses to translate what has no honest equivalent.",
  },
  {
    term: "Bright side",
    def: "The community's own dialect — the words a community uses with itself in its own kitchens, meetings, and ledgers. Neighbour. Channel. The books. Standby stock. The watch. Neither informal nor incorrect. Simply a different room.",
  },
  {
    term: "Massity",
    def: "Mass-society dialect — the language a regulator, banker, funder, or lawyer will accept. Resident. Bank account. Financial statements. Inventory reserves. Compliance officer. Neither dialect is wrong inside its own context. Each is unfit currency in the other's.",
  },
  {
    term: "Refused",
    def: "A Gate outcome for source-side language that has no honest equivalent in the target dialect. The word does not cross. The document notes the gap. Protecting the word is more important than completing the translation.",
    note: "Refused is a first-class outcome — not a failure, not a footnote.",
  },
  {
    term: "Both-states",
    sub: "principle",
    def: "A test for naming a primitive that moves between tempos: does the name hold in the resting state and the activated state? If the name bends to fit only one tempo, the system will eventually fork into two systems with two cultures.",
  },
  {
    term: "Both-sides",
    sub: "principle",
    def: "A test for naming a primitive that faces two contexts simultaneously: does the name hold from the bright side and from the massity side? If the name privileges one context, the membrane becomes a wall.",
  },
];

function buildPlainText(): string {
  const termLines = terms.map((t) => {
    const heading = t.sub ? `${t.term} / ${t.sub}` : t.term;
    const note = t.note ? `\n  Note: ${t.note}` : "";
    return `${heading}\n  ${t.def}${note}`;
  }).join("\n\n");

  return [
    "HEADWATERS · CODETRY HANDBOOK",
    "Core Vocabulary",
    "The words a community needs to run its own economy — precisely.",
    "",
    "---",
    "",
    termLines,
    "",
    "---",
    "",
    "ourheadwaters.ca",
    "bobbie@ourheadwaters.ca · 807 220 3654",
    "Dryden, Ontario · Treaty 3 Territory",
  ].join("\n");
}

export default function VocabularySheet() {
  return (
    <>
      <PrintNav targetId="pdf-target" filename="headwaters-vocabulary.pdf" onCopyPlainText={buildPlainText} />
      <div
        id="pdf-target"
        className="print-page page-letter"
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
                bottom: "1in",
                right: "-2in",
                width: "7in",
                height: "7in",
                borderRadius: "50%",
                background: "rgba(31,61,46,0.04)",
              }}
            />
          </div>

          {/* Header band */}
          <div
            style={{
              background: "var(--evergreen)",
              padding: "0.4in 0.6in 0.35in",
              flexShrink: 0,
              position: "relative",
              zIndex: 1,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(244,237,224,0.55)",
                marginBottom: "0.2rem",
              }}
            >
              Headwaters · Codetry Handbook
            </p>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.6rem",
                fontWeight: 900,
                color: "var(--cream)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: "0.15rem",
              }}
            >
              Core Vocabulary
            </h1>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "0.95rem",
                fontStyle: "italic",
                color: "var(--rust-light)",
              }}
            >
              The words a community needs to run its own economy — precisely.
            </p>
          </div>

          {/* Terms body */}
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.22in 0.35in",
                flex: 1,
              }}
            >
              {terms.map((t) => (
                <div
                  key={t.term}
                  style={{
                    borderLeft: "2.5px solid var(--rust)",
                    paddingLeft: "0.18in",
                    paddingTop: "0.04in",
                    paddingBottom: "0.04in",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "0.3rem",
                      marginBottom: "0.06rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "var(--evergreen)",
                        lineHeight: 1.2,
                      }}
                    >
                      {t.term}
                    </p>
                    {t.sub && (
                      <p
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "0.75rem",
                          fontStyle: "italic",
                          color: "var(--muted)",
                          lineHeight: 1.2,
                        }}
                      >
                        / {t.sub}
                      </p>
                    )}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.72rem",
                      color: "#3a3a3a",
                      lineHeight: 1.55,
                    }}
                  >
                    {t.def}
                  </p>
                  {t.note && (
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.65rem",
                        color: "var(--rust)",
                        fontStyle: "italic",
                        marginTop: "0.08rem",
                        lineHeight: 1.4,
                      }}
                    >
                      {t.note}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                margin: "0.3in 0 0.25in",
              }}
            >
              <div
                style={{
                  height: 1,
                  background: "rgba(31,61,46,0.2)",
                  flex: 1,
                }}
              />
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--rust)",
                }}
              />
              <div
                style={{
                  height: 1,
                  background: "rgba(31,61,46,0.2)",
                  flex: 1,
                }}
              />
            </div>

            {/* Footer */}
            <div
              style={{
                background: "var(--evergreen)",
                borderRadius: 8,
                padding: "0.22in 0.35in",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "var(--cream)",
                    marginBottom: "0.08rem",
                  }}
                >
                  ourheadwaters.ca
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.7rem",
                    color: "rgba(244,237,224,0.7)",
                  }}
                >
                  bobbie@ourheadwaters.ca · 807 220 3654
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.65rem",
                    color: "rgba(244,237,224,0.6)",
                    textAlign: "right",
                    lineHeight: 1.6,
                  }}
                >
                  Dryden, Ontario
                  <br />
                  <span style={{ fontSize: "0.6rem", opacity: 0.7 }}>
                    Treaty 3 Territory
                  </span>
                </p>
                <QRCodeStamp light />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
