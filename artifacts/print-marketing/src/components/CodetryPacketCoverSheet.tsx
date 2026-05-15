import type { CSSProperties } from "react";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";

const base = import.meta.env.BASE_URL;

export interface CoverSheetDocument {
  num: string;
  title: string;
  desc: string;
}

export interface CodetryPacketCoverSheetProps {
  community: string;
  date: string;
  documents?: CoverSheetDocument[];
}

const COVER_PAGE: CSSProperties = {
  width: "8.5in",
  minHeight: "11in",
  background: EVERGREEN,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  fontFamily: "Inter, system-ui, sans-serif",
  color: CREAM,
  position: "relative",
};

export function CodetryPacketCoverSheet({
  community,
  date,
  documents = [],
}: CodetryPacketCoverSheetProps) {
  return (
    <div className="page-letter" style={COVER_PAGE}>

      {/* Top accent bar */}
      <div style={{ height: "0.08in", background: RUST, flexShrink: 0 }} />

      {/* Header */}
      <div style={{
        padding: "0.55in 0.75in 0.4in",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        borderBottom: "1px solid rgba(244,237,224,0.12)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.18in" }}>
          <img
            src={`${base}eagle-mark.svg`}
            alt="Headwaters"
            style={{ width: "0.7in", height: "0.58in", objectFit: "contain", opacity: 0.92, flexShrink: 0 }}
          />
          <div>
            <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.2rem", fontWeight: 700, color: CREAM, margin: 0, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
              Headwaters
            </p>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.52rem", color: "rgba(244,237,224,0.5)", margin: 0, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Development Services
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.65rem", color: "rgba(244,237,224,0.5)", margin: 0, lineHeight: 1.6 }}>
            {date}
          </p>
        </div>
      </div>

      {/* Main body */}
      <div style={{ flex: 1, padding: "0.65in 0.75in 0.5in", display: "flex", flexDirection: "column" }}>

        {/* Prepared for label */}
        <p style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "0.6rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "rgba(244,237,224,0.45)",
          marginBottom: "0.18in",
        }}>
          Prepared for
        </p>

        {/* Community name */}
        <h1 style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: "2.6rem",
          fontWeight: 700,
          color: CREAM,
          margin: "0 0 0.1in",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
        }}>
          {community}
        </h1>

        {/* Packet title */}
        <p style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: "1.1rem",
          fontWeight: 400,
          fontStyle: "italic",
          color: "rgba(244,237,224,0.6)",
          margin: "0 0 0.55in",
          lineHeight: 1.4,
        }}>
          Codetry Community Store — Outreach Packet
        </p>

        {/* Rust rule */}
        <div style={{ width: "0.5in", height: "0.045in", background: RUST, marginBottom: "0.45in", flexShrink: 0 }} />

        {documents.length > 0 && (
          <>
            {/* Document list label */}
            <p style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "0.58rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(244,237,224,0.45)",
              marginBottom: "0.22in",
            }}>
              This packet contains
            </p>

            {/* Documents */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.22in" }}>
              {documents.map((doc) => (
                <div key={doc.num} style={{ display: "flex", gap: "0.22in", alignItems: "flex-start" }}>
                  <div style={{
                    width: "0.32in",
                    height: "0.32in",
                    background: RUST,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "0.03in",
                  }}>
                    <span style={{
                      fontFamily: "Fraunces, Georgia, serif",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: CREAM,
                      lineHeight: 1,
                    }}>
                      {doc.num}
                    </span>
                  </div>
                  <div>
                    <p style={{
                      fontFamily: "Fraunces, Georgia, serif",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: CREAM,
                      margin: "0 0 0.04in",
                      lineHeight: 1.2,
                    }}>
                      {doc.title}
                    </p>
                    <p style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: "0.72rem",
                      color: "rgba(244,237,224,0.58)",
                      margin: 0,
                      lineHeight: 1.55,
                    }}>
                      {doc.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ flex: 1 }} />

        {/* Closing note */}
        <div style={{
          borderTop: "1px solid rgba(244,237,224,0.12)",
          paddingTop: "0.3in",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.4in",
        }}>
          <div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.62rem", color: "rgba(244,237,224,0.38)", marginBottom: "0.06in", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Submitted by
            </p>
            <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.88rem", fontWeight: 700, color: CREAM, margin: "0 0 0.04in" }}>
              Bobbie Parr
            </p>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.68rem", color: "rgba(244,237,224,0.5)", margin: 0, lineHeight: 1.6 }}>
              Headwaters Development Services<br />
              Wabigoon, Ontario — Treaty 3 Territory
            </p>
          </div>
          <div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.62rem", color: "rgba(244,237,224,0.38)", marginBottom: "0.06in", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Contact
            </p>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.72rem", color: "rgba(244,237,224,0.65)", margin: 0, lineHeight: 1.7 }}>
              ourheadwaters.ca<br />
              bobbie@ourheadwaters.ca<br />
              807 220 3654
            </p>
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div style={{ height: "0.08in", background: RUST, flexShrink: 0 }} />
    </div>
  );
}
