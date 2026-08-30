import { PrintNav } from "../components/PrintNav";
import QRCodeStamp from "../components/QRCodeStamp";

const EVERGREEN = "#0f1c18";
const EVERGREEN_MID = "#1b2621";
const EVERGREEN_LIGHT = "#2f3e35";
const CREAM = "#f7f7f5";
const GOLD = "#d4a017";
const RUST = "#c47a3a";
const MIST = "#9cb3a8";
const MUTED = "#6d8176";
const QUOTE_URL = "https://ourheadwaters.ca/quote?utm_source=business-card";
const BASE = import.meta.env.BASE_URL;

function Card({ variant }: { variant: "front" | "back" }) {
  const W = "3.5in";
  const H = "2in";

  if (variant === "front") {
    return (
      <div
        style={{
          width: W,
          height: H,
          background: `linear-gradient(135deg, ${EVERGREEN} 0%, ${EVERGREEN_MID} 100%)`,
          borderRadius: 2,
          padding: "0.18in 0.24in",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
          boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.37rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: MIST,
              marginBottom: "0.08in",
            }}
          >
            Development Services
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.65rem",
              fontWeight: 400,
              color: CREAM,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Headwaters
          </h1>
          <div
            style={{
              width: "0.42in",
              height: 2,
              background: GOLD,
              margin: "0.1in 0 0.09in",
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.6rem",
              fontStyle: "italic",
              color: "rgba(247,247,245,0.7)",
              lineHeight: 1.4,
            }}
          >
            Capacity to carry important work through.
          </p>
          </div>
          <img
            src={`${BASE}eagle-mark.svg`}
            alt=""
            aria-hidden="true"
            style={{ width: "0.62in", height: "0.5in", objectFit: "contain", opacity: 0.95 }}
          />
        </div>

        <div>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.72rem",
              fontWeight: 400,
              color: CREAM,
              marginBottom: "0.04in",
            }}
          >
            Bobbie Parr
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.5rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: MIST,
            }}
          >
            Development services · Northwestern Ontario
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: W,
        height: H,
        background: EVERGREEN,
        borderRadius: 2,
        padding: "0.18in 0.24in",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: "0.16in",
        boxSizing: "border-box",
        boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
        border: `0.5px solid ${EVERGREEN_LIGHT}`,
        flexShrink: 0,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.4rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: MIST,
            marginBottom: "0.08in",
          }}
        >
          Headwaters
        </p>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.08rem",
            fontWeight: 400,
            color: CREAM,
            lineHeight: 1.02,
            marginBottom: "0.08in",
          }}
        >
          How Can<br />We Help?
        </p>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "0.51rem",
            fontStyle: "italic",
            color: "rgba(247,247,245,0.66)",
            lineHeight: 1.35,
          }}
        >
          Start with the work in front of you.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.04in" }}>
        <QRCodeStamp url={QUOTE_URL} label="Scan to start" size={72} light />
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.39rem",
            color: GOLD,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 600,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          Request a quote
        </span>
      </div>
    </div>
  );
}

export default function BusinessCard() {
  return (
    <>
      <PrintNav targetId="pdf-target" filename="headwaters-business-card.pdf" />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{
            background: "#dfe5e0",
          padding: "2.5rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            fontFamily: "var(--font-sans)",
          }}
        >
          <p
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: MUTED,
              marginBottom: "0.3rem",
            }}
          >
            Headwaters · Business Card
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.8rem",
              fontWeight: 700,
              color: EVERGREEN,
              marginBottom: "0.2rem",
            }}
          >
            Standard business card · 3.5 × 2 in
          </h1>
          <p
            style={{
              fontSize: "0.85rem",
              color: MUTED,
              marginBottom: "2rem",
              lineHeight: 1.55,
            }}
          >
            Front (dark) and back (light). The back invites a conversation and
            sends people directly to the budgetary quote intake.
          </p>

          <div
            className="no-print"
            style={{
              background: "rgba(15,28,24,0.07)",
              borderRadius: 6,
              padding: "0.9rem 1.1rem",
              marginBottom: "2rem",
              fontSize: "0.8rem",
              color: MUTED,
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: EVERGREEN }}>To print:</strong> Use a
            professional print service (Vistaprint, Canva Print, or a local
            shop) and export this page as PDF at 300 dpi. Set bleed to 0.125 in
            if your printer requires it. Standard card stock: 16 pt, matte or
            soft-touch finish.
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.5rem",
              alignItems: "flex-start",
              marginBottom: "2.5rem",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: MUTED,
                  marginBottom: "0.6rem",
                }}
              >
                Front
              </p>
              <Card variant="front" />
            </div>
            <div>
              <p
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: MUTED,
                  marginBottom: "0.6rem",
                }}
              >
                Back
              </p>
              <Card variant="back" />
            </div>
          </div>

          <div
            className="no-print"
            style={{
              background: "white",
              borderRadius: 8,
              border: "1px solid rgba(15,28,24,0.12)",
              padding: "1.1rem 1.3rem",
              fontSize: "0.82rem",
              color: MUTED,
              lineHeight: 1.7,
            }}
          >
              <strong style={{ color: EVERGREEN, display: "block", marginBottom: "0.3rem" }}>
                The back is the handoff
            </strong>
              “How Can We Help?” is the invitation. The QR code opens the
              Headwaters quote funnel at the first useful question, with the
              business-card source tagged for campaign tracking.
          </div>
        </div>
      </div>
    </>
  );
}
