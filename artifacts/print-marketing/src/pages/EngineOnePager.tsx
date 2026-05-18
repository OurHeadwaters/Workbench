import { PrintNav } from "../components/PrintNav";

const EVERGREEN  = "#1f3d2e";
const CREAM      = "#f4ede0";
const RUST       = "#b85a3e";
const GOLD       = "#c9930a";
const INK        = "#1a2820";
const MUTED      = "#6b7665";
const PALE       = "#f9f6f0";

/* ── 8 problem / engine pairs ─────────────────────────────────────────── */
const PAIRS: {
  tag:     string;
  problem: string;
  system:  string;
  engine:  string;
}[] = [
  {
    tag:     "01",
    problem: "The consultant leaves with everything.",
    system:  "Codetry Handover",
    engine:  "Handover is the exit condition. Every scope has a defined deliverable and a hand-off date built in from day one. The community runs it without you — that is what done means.",
  },
  {
    tag:     "02",
    problem: "Youth have no on-ramp into the community economy.",
    system:  "The Youth Odyssey",
    engine:  "Four phases. Eight stations. Each one anchored in a real tale from the community. Participants don't receive economic literacy — they write their own story and carry it forward.",
  },
  {
    tag:     "03",
    problem: "A crisis hits and there is no plan anyone can follow.",
    system:  "The Standby",
    engine:  "Always-on preparedness that holds both states: the quiet side (common pantry, stock, the watch) and the fast side (active call, evacuation, grid failure). One name. Two tempos. Ready either way.",
  },
  {
    tag:     "04",
    problem: "Funders and regulators require language that erodes sovereignty.",
    system:  "The Gate",
    engine:  "A calm passage between the community's language and the institutional world. Substitutions are logged, both vocabularies stay on file, and every translation is auditable — the community's nouns survive every crossing.",
  },
  {
    tag:     "05",
    problem: "Band resources are consumed without a visible record.",
    system:  "The Accounts",
    engine:  "The cost stack is visible at the kitchen table, not just the cap table. What came in, what went out, what the work delivered — readable by the band manager and the household on the same page.",
  },
  {
    tag:     "06",
    problem: "The wrong person gets hired and no one finds out until it's expensive.",
    system:  "Helping Hands + Trial-First",
    engine:  "Every new role begins with a bounded, paid two-week trial. Clear deliverable. Named check-in. The community and the worker both see what works. No cold hires on a grant budget.",
  },
  {
    tag:     "07",
    problem: "Members can't see their equity and don't trust the books.",
    system:  "Co-op Platform",
    engine:  "Member portals that show shares, equity, governance participation, and distributions. Built for remote northern communities. No third-party licensing. No ongoing dependency. Yours outright.",
  },
  {
    tag:     "08",
    problem: "Knowledge lives in one person's head and leaves when they do.",
    system:  "Knowledge Architecture",
    engine:  "Every training session ends with: who holds this now, who is being trained, what is written down. Institutional knowledge becomes community infrastructure — not a person's resume.",
  },
];

function buildPlainText(): string {
  const lines: string[] = [
    "WHAT ONE ENGINE ELIMINATES",
    "Headwaters Development Services — Community Economic Engine",
    "",
    "Eight persistent problems. One community-owned platform.",
    "Flat fee. No licensing. No retainer. Yours forever.",
    "",
    "─────────────────────────────────────────────────",
    "",
  ];

  PAIRS.forEach(({ tag, problem, system, engine }) => {
    lines.push(`${tag}  THE PROBLEM: ${problem}`);
    lines.push(`   THE ENGINE:  ${system}`);
    lines.push(`   ${engine}`);
    lines.push("");
  });

  lines.push(
    "─────────────────────────────────────────────────",
    "",
    "WHAT WOULD AN ENGINE LIKE THIS BE WORTH TO YOUR COMMUNITY?",
    "",
    "Phase 1 deploys the first systems in 6 weeks. Fixed fee.",
    "Everything built stays with your community. No retainer to keep it running.",
    "",
    "ourheadwaters.ca",
    "bobbie@ourheadwaters.ca",
    "807 220 3654 · text preferred",
  );

  return lines.join("\n");
}

export function EngineOnePagerPage() {
  return (
    <div
      className="page-letter"
          style={{
            width: "8.5in",
            minHeight: "11in",
            background: PALE,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* ── HEADER ──────────────────────────────────────────────────── */}
          <div
            style={{
              background: EVERGREEN,
              padding: "0.32in 0.45in 0.28in",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.52rem",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "rgba(212,160,23,0.75)",
                  margin: "0 0 0.08in",
                }}
              >
                Headwaters Development Services
              </p>
              <h1
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: "1.72rem",
                  fontWeight: 500,
                  color: CREAM,
                  margin: 0,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                What one engine eliminates.
              </h1>
              <p
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "0.78rem",
                  color: "rgba(244,237,224,0.55)",
                  margin: "0.06in 0 0",
                  lineHeight: 1.45,
                }}
              >
                Eight persistent problems. One community-owned platform.
                Flat fee. No licensing. No retainer. Yours forever.
              </p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "0.3in" }}>
              <p
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.46rem",
                  color: "rgba(244,237,224,0.35)",
                  margin: 0,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  lineHeight: 1.8,
                }}
              >
                ourheadwaters.ca<br />
                bobbie@ourheadwaters.ca<br />
                807 220 3654
              </p>
            </div>
          </div>

          {/* ── GOLD RULE ───────────────────────────────────────────────── */}
          <div style={{ height: "3px", background: GOLD }} />

          {/* ── COLUMN HEADERS ──────────────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "0.24in 2.65in 3px 1fr",
              gap: 0,
              background: INK,
              padding: "0.1in 0.45in",
              alignItems: "center",
            }}
          >
            <span />
            <p
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.46rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(212,160,23,0.65)",
                margin: 0,
              }}
            >
              The Problem
            </p>
            <div style={{ background: "rgba(212,160,23,0.18)", height: "100%" }} />
            <p
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.46rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(212,160,23,0.65)",
                margin: 0,
                paddingLeft: "0.2in",
              }}
            >
              The Engine
            </p>
          </div>

          {/* ── PAIRS ───────────────────────────────────────────────────── */}
          <div style={{ flex: 1 }}>
            {PAIRS.map(({ tag, problem, system, engine }, i) => (
              <div
                key={tag}
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.24in 2.65in 3px 1fr",
                  gap: 0,
                  background: i % 2 === 0 ? PALE : "#f1ece3",
                  borderBottom: `1px solid rgba(31,61,46,0.07)`,
                  alignItems: "stretch",
                  minHeight: "0.95in",
                }}
              >
                {/* Row number */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRight: `1px solid rgba(31,61,46,0.08)`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.42rem",
                      color: "rgba(31,61,46,0.22)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {tag}
                  </span>
                </div>

                {/* Problem column */}
                <div
                  style={{
                    padding: "0.14in 0.18in 0.14in 0.14in",
                    borderRight: `1px solid rgba(31,61,46,0.08)`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Fraunces, Georgia, serif",
                      fontSize: "0.76rem",
                      fontWeight: 500,
                      color: INK,
                      margin: 0,
                      lineHeight: 1.35,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {problem}
                  </p>
                </div>

                {/* Divider */}
                <div style={{ background: GOLD, opacity: 0.22 }} />

                {/* Engine column */}
                <div
                  style={{
                    padding: "0.14in 0.2in 0.14in 0.2in",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.44rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: RUST,
                      margin: "0 0 0.05in",
                    }}
                  >
                    {system}
                  </p>
                  <p
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: "0.65rem",
                      color: MUTED,
                      margin: 0,
                      lineHeight: 1.58,
                    }}
                  >
                    {engine}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── OWNERSHIP BAR ───────────────────────────────────────────── */}
          <div
            style={{
              background: RUST,
              padding: "0.14in 0.45in",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.3in",
            }}
          >
            {[
              "No licensing fees",
              "No retainer",
              "No vendor lock-in",
              "Community owns it outright",
              "Handover is the exit",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.07in" }}>
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: CREAM,
                    opacity: 0.7,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.44rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: CREAM,
                    opacity: 0.88,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* ── CLOSING QUESTION ────────────────────────────────────────── */}
          <div
            style={{
              background: EVERGREEN,
              padding: "0.32in 0.45in 0.3in",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "0.4in",
            }}
          >
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: "1.18rem",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: CREAM,
                  margin: "0 0 0.1in",
                  lineHeight: 1.3,
                  letterSpacing: "-0.01em",
                }}
              >
                What would an engine like this be worth to your community?
              </h2>
              <p
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: "0.62rem",
                  color: "rgba(244,237,224,0.5)",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Phase 1 deploys the first systems in 6 weeks. Fixed fee.
                Everything built stays with your community — no retainer required to keep it running.
              </p>
            </div>

            {/* Pricing callout */}
            <div
              style={{
                flexShrink: 0,
                background: "rgba(244,237,224,0.07)",
                border: "1px solid rgba(244,237,224,0.14)",
                borderRadius: "4px",
                padding: "0.14in 0.2in",
                textAlign: "center",
                minWidth: "1.4in",
              }}
            >
              <p
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.42rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(212,160,23,0.65)",
                  margin: "0 0 0.04in",
                }}
              >
                Phase 1
              </p>
              <p
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  color: CREAM,
                  margin: "0 0 0.04in",
                  letterSpacing: "-0.01em",
                }}
              >
                $28,000
              </p>
              <p
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.4rem",
                  color: "rgba(244,237,224,0.38)",
                  margin: 0,
                  letterSpacing: "0.1em",
                  lineHeight: 1.7,
                  textTransform: "uppercase",
                }}
              >
                6 weeks · flat fee<br />
                defined scope<br />
                real deliverable
              </p>
            </div>
          </div>
        </div>
  );
}

export default function EngineOnePager() {
  return (
    <>
      <PrintNav
        targetId="engine-one-pager-standalone"
        filename="headwaters-economic-engine.pdf"
        format="letter"
        orientation="portrait"
        onCopyPlainText={buildPlainText}
      />
      <div
        style={{
          background: "#d0c9bc",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0.4in 0 0.6in",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div id="engine-one-pager-standalone">
          <EngineOnePagerPage />
        </div>
      </div>
    </>
  );
}
