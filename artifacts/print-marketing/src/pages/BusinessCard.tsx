import { Link } from "wouter";

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

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";

function Card({ variant }: { variant: "front" | "back" }) {
  const W = "3.5in";
  const H = "2in";

  if (variant === "front") {
    return (
      <div
        style={{
          width: W,
          height: H,
          background: EVERGREEN,
          borderRadius: 4,
          padding: "0.22in 0.28in",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
          boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
          flexShrink: 0,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.45rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(244,237,224,0.55)",
              marginBottom: "0.12in",
            }}
          >
            Development Services
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.55rem",
              fontWeight: 700,
              color: CREAM,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}
          >
            Headwaters
          </h1>
          <div
            style={{
              width: "0.55in",
              height: 1.5,
              background: RUST,
              margin: "0.09in 0 0.11in",
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.6rem",
              fontStyle: "italic",
              color: "rgba(244,237,224,0.72)",
              lineHeight: 1.4,
            }}
          >
            Community tools, food systems, operational software
          </p>
        </div>

        <div>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.72rem",
              fontWeight: 600,
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
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(244,237,224,0.55)",
            }}
          >
            Practitioner · Dryden, Ontario
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
        background: CREAM,
        borderRadius: 4,
        padding: "0.22in 0.28in",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
        border: "0.5px solid rgba(31,61,46,0.15)",
        flexShrink: 0,
      }}
    >
      <div>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.45rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: MUTED,
            marginBottom: "0.12in",
          }}
        >
          Headwaters Development Services
        </p>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: EVERGREEN,
            marginBottom: "0.03in",
          }}
        >
          Bobbie Parr
        </p>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "0.58rem",
            fontStyle: "italic",
            color: MUTED,
          }}
        >
          Practitioner
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.07in" }}>
        {[
          { label: "email", value: "bobbie@ourheadwaters.ca" },
          { label: "text", value: "(___) ___-____ · text preferred" },
          { label: "web", value: "ourheadwaters.ca" },
          { label: "base", value: "Dryden, Ontario" },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "baseline", gap: "0.12in" }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.4rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: RUST,
                width: "0.28in",
                flexShrink: 0,
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.55rem",
                color: EVERGREEN,
                letterSpacing: "0.01em",
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BusinessCard() {
  return (
    <>
      <PrintNav />
      <div
        style={{
          minHeight: "100vh",
          background: "#e8e2d8",
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
            Front (dark) and back (light). Add your phone number to the back
            before sending to print. Fill the blank on the <em>text</em> line.
          </p>

          <div
            className="no-print"
            style={{
              background: "rgba(31,61,46,0.07)",
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
                Back — fill in your number before printing
              </p>
              <Card variant="back" />
            </div>
          </div>

          <div
            className="no-print"
            style={{
              background: "white",
              borderRadius: 8,
              border: "1px solid rgba(31,61,46,0.12)",
              padding: "1.1rem 1.3rem",
              fontSize: "0.82rem",
              color: MUTED,
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: EVERGREEN, display: "block", marginBottom: "0.3rem" }}>
              On "text preferred"
            </strong>
            It signals availability without implying open phone hours. People
            who need you will text; people who are browsing will leave a message
            by email. You can always call back on your own schedule.
          </div>
        </div>
      </div>
    </>
  );
}
