/**
 * EthosPage.tsx — standalone shareable page for the Headwaters ethos
 *
 * Reachable at /ethos. Self-contained chrome, no app shell.
 * Print-friendly — can be handed over on paper.
 *
 * Copy is sourced from @/data/ethosContent so it can't drift
 * out of sync with the deck slide (EthosSlide.tsx).
 */

import { useEffect } from "react";
import {
  ETHOS_HEADLINE,
  ETHOS_BODY,
  ETHOS_INSTRUMENTS,
  ETHOS_CLOSING,
} from "@/data/ethosContent";

const T = {
  bg:    "#1f3d2e",
  paper: "#f4ede0",
  text:  "#2a2520",
  muted: "#6b7665",
  rule:  "rgba(42,37,32,0.14)",
  rust:  "#b85a3e",
  green: "#1f3d2e",
};

function PrintButton() {
  function handlePrint() {
    window.print();
  }
  return (
    <button
      className="no-print"
      onClick={handlePrint}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 14px",
        borderRadius: 7,
        border: `1px solid rgba(42,37,32,0.2)`,
        backgroundColor: "transparent",
        color: T.muted,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.07em",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"/>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
        <rect x="6" y="14" width="12" height="8"/>
      </svg>
      Print / PDF
    </button>
  );
}

export default function EthosPage() {
  useEffect(() => {
    document.title = "Don't trust; verify — Headwaters";
  }, []);

  return (
    <div style={{ background: "#e8e2d8", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* ── Print styles ── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #f4ede0 !important; }
          .page-shell { background: #f4ede0 !important; box-shadow: none !important; }
        }
        @page {
          size: letter portrait;
          margin: 0.65in 0.7in;
        }
      `}</style>

      <div
        className="page-shell"
        style={{
          maxWidth: "8.5in",
          margin: "0 auto",
          background: T.paper,
          minHeight: "100vh",
          padding: "2.5rem 3rem",
        }}
      >

        {/* ── Top bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: T.rust,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase" as const,
                color: T.rust,
              }}
            >
              Headwaters Development Services
            </span>
          </div>
          <PrintButton />
        </div>

        {/* ── Amber rule ── */}
        <div style={{ height: 3, background: T.rust, marginBottom: "2.2rem" }} />

        {/* ── Headline ── */}
        <h1
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: "3.4rem",
            fontWeight: 700,
            lineHeight: 1.0,
            color: T.green,
            margin: "0 0 2rem",
            letterSpacing: "-0.01em",
          }}
        >
          {ETHOS_HEADLINE}
        </h1>

        {/* ── Body ── */}
        <div style={{ maxWidth: "38rem", marginBottom: "2.8rem" }}>
          {ETHOS_BODY.map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: i === 0 ? "1.05rem" : "0.925rem",
                lineHeight: 1.65,
                color: i === 0 ? T.text : T.muted,
                margin: "0 0 1.1rem",
                fontWeight: i === 0 ? 400 : 400,
              }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: T.rule, marginBottom: "2.2rem" }} />

        {/* ── Instruments ── */}
        <div style={{ marginBottom: "2.8rem" }}>
          <p
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase" as const,
              color: T.rust,
              marginBottom: "1.2rem",
            }}
          >
            The instruments — what verification looks like in practice
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem 2rem",
            }}
          >
            {ETHOS_INSTRUMENTS.map((inst) => (
              <div
                key={inst.name}
                style={{
                  borderLeft: `3px solid ${T.green}`,
                  paddingLeft: "0.9rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    color: T.text,
                    margin: "0 0 0.2rem",
                    lineHeight: 1.3,
                  }}
                >
                  {inst.name}
                </p>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: T.muted,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {inst.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Closing statement ── */}
        <div
          style={{
            background: T.green,
            borderRadius: 8,
            padding: "1.4rem 1.8rem",
            marginBottom: "2.5rem",
          }}
        >
          <p
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: "1.15rem",
              fontWeight: 600,
              color: T.paper,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {ETHOS_CLOSING}
          </p>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: T.rule, marginBottom: "1.5rem" }} />

        {/* ── Footer ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.72rem",
            color: T.muted,
          }}
        >
          <div>Headwaters Development Services · Wabigoon, Ontario · Treaty 3 Territory</div>
          <div>bobbie@ourheadwaters.ca · 807 220 3654 · ourheadwaters.ca</div>
        </div>

      </div>
    </div>
  );
}
