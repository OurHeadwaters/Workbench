import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM     = "#f4ede0";
const RUST      = "#b85a3e";
const GOLD      = "#c9930a";
const INK       = "#1a2820";
const MUTED     = "#5c6b5e";
const PALE      = "#f9f6f0";
const BARK      = "#2e1f0f";

function buildPlainText(): string {
  return [
    "HELPING HANDS — ONE-PAGER FOR PROGRAM OFFICERS",
    "CDP Grant Application · Headwaters Development Services · June 2026",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "THE PROBLEM (two sentences)",
    "",
    "Every day on northern reserves, community members do real work — coordinating labour, building skills, sustaining households — and none of it appears in any ledger institutions recognize.",
    "The informal economy of these communities is sophisticated and functional; it is simply invisible to the capital systems that formal development requires.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "THE ENGINE (three sentences)",
    "",
    "Helping Hands is a community labour coordination and credentialing platform: administrators post tasks, members claim and complete them, and a full lifecycle record is built — posted, claimed, completed, confirmed, paid.",
    "Every completion adds to a member's reliability score; every no-show records against it; milestone bonuses land automatically at ten completions and beyond — producing a machine-readable reputation record built on contribution, not consumption.",
    "Badge credentials move through four peer-validated stages (Watching → Learning → Practising → Teaching), with community knowledge as the source of formal credentialing — not institutions.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "THE PROOF POINTS",
    "",
    "→ Progressive wallet reveal: new members see no wallet on day one — the wallet reveals itself at the moment of first value received, reversing the empty-account onboarding problem that kills every community currency.",
    "",
    "→ Reliability scores: milestone bonuses trigger automatically; the record is longitudinal, consistent, and tamper-resistant — exactly the kind of track record lenders and program offices need but have never been able to see from northern reserve communities.",
    "",
    "→ Partnership Portal: anonymized reliability scores exposed to participating lenders and institutional partners, with data remaining in community custody and sharing controlled by the individual member.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "THE ASK",
    "",
    "This application requests funding for first-community deployment:",
    "",
    "→ Platform deployment and community configuration",
    "→ Coordinator training (band employee or community member)",
    "→ First-cohort task design and launch",
    "→ Partnership Portal pilot with one institutional lending partner",
    "→ Documentation for replication in a second community",
    "",
    "What the community receives: infrastructure they own, a credentialing system that recognizes work they already do, and a graduation path to self-custody economic sovereignty on the XRP Ledger.",
    "",
    "What funders receive: transparent ground-level economic data from northern reserve communities — the kind no other program is currently generating.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "Headwaters Development Services",
    "bobbie@ourheadwaters.ca · ourheadwaters.ca · 807 220 3654",
    "",
    "Full narrative: /cdp-grant-narrative",
  ].join("\n");
}

export function CdpGrantNarrativeOnePagerPage() {
  return (
    <div
      style={{
        width: "8.5in",
        minHeight: "11in",
        background: PALE,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          background: EVERGREEN,
          padding: "0.38in 0.6in 0.3in",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.48rem",
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "rgba(212,160,23,0.68)",
            margin: "0 0 0.08in",
          }}
        >
          Headwaters Development Services · CDP Grant Application · One-Pager · June 2026
        </p>
        <h1
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: "2.2rem",
            fontWeight: 600,
            color: CREAM,
            margin: "0 0 0.06in",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          Helping Hands
        </h1>
        <p
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            fontSize: "0.86rem",
            color: "rgba(244,237,224,0.55)",
            margin: 0,
            lineHeight: 1.35,
          }}
        >
          Community labour, credentialed reputation, and the path to economic sovereignty.
        </p>
      </div>

      {/* Gold bar */}
      <div style={{ height: "3px", background: GOLD, flexShrink: 0 }} />

      {/* ── BODY ── */}
      <div style={{ flex: 1, padding: "0.4in 0.6in 0.3in" }}>

        {/* Problem */}
        <section style={{ marginBottom: "0.35in" }}>
          <p
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "0.48rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: GOLD,
              margin: "0 0 0.14in",
            }}
          >
            The Problem
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.22in",
            }}
          >
            <p
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "0.84rem",
                color: INK,
                lineHeight: 1.68,
                margin: 0,
              }}
            >
              Every day on northern reserves, community members do real work — coordinating labour, building skills, sustaining households. None of it appears in any ledger institutions recognize.
            </p>
            <p
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "0.84rem",
                color: INK,
                lineHeight: 1.68,
                margin: 0,
              }}
            >
              The informal economy is sophisticated and functional. It is simply invisible to the capital systems that formal development requires — leaving communities with a double burden: the work, and no recognition for it.
            </p>
          </div>
        </section>

        {/* Rust rule */}
        <div style={{ height: "2px", background: RUST, opacity: 0.25, marginBottom: "0.32in" }} />

        {/* Engine */}
        <section style={{ marginBottom: "0.32in" }}>
          <p
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "0.48rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: GOLD,
              margin: "0 0 0.14in",
            }}
          >
            The Engine
          </p>
          <p
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: "1.08rem",
              fontWeight: 600,
              color: EVERGREEN,
              margin: "0 0 0.14in",
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
            }}
          >
            Helping Hands: a community labour coordination and credentialing platform.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.18in" }}>
            {[
              {
                label: "Task lifecycle",
                body: "Administrators post tasks with defined deliverables and pay in community tokens. Members claim, complete, and get confirmed. The full record is tracked: posted → claimed → completed → confirmed → paid.",
              },
              {
                label: "Reliability scores",
                body: "Every completion builds a reliability record. Milestone bonuses land automatically at ten completions and beyond — no one has to ask for them. The result is a machine-readable reputation built on contribution, not consumption.",
              },
              {
                label: "Badge credentials",
                body: "Skills move through four peer-validated stages: Watching, Learning, Practising, Teaching. A Teaching badge means you can credential others — community knowledge becomes the source of formal credentialing.",
              },
            ].map(({ label, body }) => (
              <div
                key={label}
                style={{
                  background: "white",
                  border: `1px solid rgba(31,61,46,0.1)`,
                  borderTop: `3px solid ${EVERGREEN}`,
                  borderRadius: "3px",
                  padding: "0.16in 0.18in",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.44rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: RUST,
                    margin: "0 0 0.08in",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "0.68rem",
                    color: "#374151",
                    lineHeight: 1.62,
                    margin: 0,
                  }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Proof points */}
        <section style={{ marginBottom: "0.32in" }}>
          <p
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "0.48rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: GOLD,
              margin: "0 0 0.14in",
            }}
          >
            Proof Points
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.15in" }}>
            {[
              {
                label: "Progressive wallet reveal",
                body: "New members see no wallet on day one — it reveals itself at the moment of first value received. First encounter is abundance, not an empty account. This reverses the onboarding failure that kills every community currency.",
              },
              {
                label: "Partnership Portal",
                body: "Anonymized reliability scores exposed to participating lenders and institutions. Data stays in community custody. Sharing is opt-in, member-controlled. What crosses the Portal is a credential — not a file.",
              },
              {
                label: "Sovereignty path",
                body: "The custodial layer is the on-ramp. When a member is ready, they migrate to self-custody on the XRP Ledger — their reliability record and credentials follow them. The graduation path runs custodial → self-custody, not the reverse.",
              },
            ].map(({ label, body }) => (
              <div
                key={label}
                style={{
                  background: "white",
                  border: `1px solid rgba(31,61,46,0.1)`,
                  borderLeft: `4px solid ${RUST}`,
                  borderRadius: "3px",
                  padding: "0.14in 0.16in",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.44rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: RUST,
                    margin: "0 0 0.08in",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "0.68rem",
                    color: "#374151",
                    lineHeight: 1.62,
                    margin: 0,
                  }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Rust rule */}
        <div style={{ height: "2px", background: RUST, opacity: 0.25, marginBottom: "0.32in" }} />

        {/* The ask — two column */}
        <section>
          <p
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "0.48rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: GOLD,
              margin: "0 0 0.14in",
            }}
          >
            The Ask — First-Community Deployment
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.22in", alignItems: "start" }}>
            <div>
              <p
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: EVERGREEN,
                  margin: "0 0 0.12in",
                  lineHeight: 1.3,
                }}
              >
                What the funding covers:
              </p>
              {[
                "Platform deployment and community configuration",
                "Coordinator training — band employee or community member",
                "First-cohort task design and launch",
                "Partnership Portal pilot with one institutional lending partner",
                "Documentation for replication in a second community",
              ].map((item) => (
                <div key={item} style={{ display: "flex", gap: "0.1in", alignItems: "flex-start", marginBottom: "0.07in" }}>
                  <span style={{ color: RUST, fontSize: "0.68rem", flexShrink: 0, lineHeight: 1.55 }}>→</span>
                  <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.7rem", color: INK, margin: 0, lineHeight: 1.55 }}>{item}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.14in" }}>
              <div
                style={{
                  background: EVERGREEN,
                  borderRadius: "3px",
                  padding: "0.16in 0.2in",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.44rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(212,160,23,0.72)",
                    margin: "0 0 0.06in",
                  }}
                >
                  What the community receives
                </p>
                <p
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "0.7rem",
                    color: "rgba(244,237,224,0.82)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  Infrastructure they own. A credentialing system that recognizes work they already do. A graduation path to self-custody economic sovereignty. No retainer required to keep it running after handover.
                </p>
              </div>
              <div
                style={{
                  background: RUST,
                  borderRadius: "3px",
                  padding: "0.16in 0.2in",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.44rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(244,237,224,0.7)",
                    margin: "0 0 0.06in",
                  }}
                >
                  What funders receive
                </p>
                <p
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "0.7rem",
                    color: "rgba(244,237,224,0.88)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  Transparent ground-level economic data from northern reserve communities — the kind no other program is currently generating. Every task, completion, badge, wallet reveal, and reliability milestone on record.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── FOOTER ── */}
      <div
        style={{
          background: BARK,
          padding: "0.14in 0.6in",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.44rem",
            color: "rgba(244,237,224,0.35)",
            margin: 0,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Headwaters Development Services · ourheadwaters.ca · 807 220 3654
        </p>
        <p
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            fontSize: "0.58rem",
            color: "rgba(244,237,224,0.28)",
            margin: 0,
          }}
        >
          Full narrative at /cdp-grant-narrative
        </p>
        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.44rem",
            color: "rgba(244,237,224,0.35)",
            margin: 0,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          June 2026
        </p>
      </div>
    </div>
  );
}

export default function CdpGrantNarrativeOnePager() {
  return (
    <>
      <PrintNav
        targetId="cdp-one-pager-standalone"
        filename="headwaters-cdp-grant-one-pager.pdf"
        format="letter"
        orientation="portrait"
        onCopyPlainText={buildPlainText}
      />
      <div
        style={{
          background: "#cdc8be",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0.4in 0 0.6in",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div id="cdp-one-pager-standalone">
          <CdpGrantNarrativeOnePagerPage />
        </div>
      </div>
    </>
  );
}
