import type { CSSProperties } from "react";
import { QRCodeSVG } from "qrcode.react";
import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const GOLD = "#c9930a";
const MUTED = "#6b7665";

const base = import.meta.env.BASE_URL;

const PAGE: CSSProperties = {
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

const foundingConditions = [
  {
    label: "A real anchor customer",
    body: "The hotel kitchen runs every week. That is a live demand signal most communities spend years trying to create. Deer Lake already has it.",
  },
  {
    label: "The 807 supply connection",
    body: "The supply chain from Northwestern Ontario producers into remote First Nations communities is being built specifically for communities like Deer Lake. Being first means being first in line.",
  },
  {
    label: "The winter road window",
    body: "January 2027. Bulk delivery, not air freight. That is the moment the economics of a community store become unambiguous. Everything being built now is preparation for that single unlock.",
  },
  {
    label: "Governance already in place",
    body: "Chief and Council. Economic development infrastructure. The capacity to hire and manage a Community Coordinator. The governance is not a gap — it is a foundation.",
  },
];

export function DeerLakeFirstEnginePage() {
  return (
    <div className="page-letter" style={PAGE}>

      {/* Top rust bar */}
      <div style={{ height: "0.08in", background: RUST, flexShrink: 0 }} />

      {/* Ghost watermark number */}
      <div style={{
        position: "absolute",
        right: "0.45in",
        top: "0.9in",
        fontFamily: "Fraunces, Georgia, serif",
        fontSize: "8rem",
        fontWeight: 900,
        color: "rgba(244,237,224,0.04)",
        lineHeight: 1,
        pointerEvents: "none",
        userSelect: "none",
        letterSpacing: "-0.04em",
      }}>
        001
      </div>

      {/* Header */}
      <div style={{
        padding: "0.42in 0.72in 0.32in",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(244,237,224,0.1)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.16in" }}>
          <img
            src={`${base}eagle-mark.svg`}
            alt="Headwaters"
            style={{ width: "0.52in", height: "0.43in", objectFit: "contain", opacity: 0.88, flexShrink: 0 }}
          />
          <div>
            <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.95rem", fontWeight: 700, color: CREAM, margin: 0, lineHeight: 1.15 }}>Headwaters</p>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.44rem", color: "rgba(244,237,224,0.45)", margin: 0, letterSpacing: "0.14em", textTransform: "uppercase" }}>Development Services</p>
          </div>
        </div>
        <div style={{
          border: `1px solid ${GOLD}`,
          borderRadius: 3,
          padding: "0.06in 0.14in",
        }}>
          <p style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.46rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: GOLD,
            margin: 0,
          }}>
            Founding Community · No. 001
          </p>
        </div>
      </div>

      {/* Main declaration */}
      <div style={{ flex: 1, padding: "0.55in 0.72in 0.4in", display: "flex", flexDirection: "column" }}>

        {/* Pre-title label */}
        <p style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "0.52rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(244,237,224,0.38)",
          marginBottom: "0.18in",
        }}>
          An invitation to
        </p>

        {/* Community name */}
        <h1 style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: "2.4rem",
          fontWeight: 700,
          color: CREAM,
          margin: "0 0 0.06in",
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
        }}>
          Deer Lake First Nation
        </h1>

        {/* Title */}
        <p style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: "1.3rem",
          fontWeight: 400,
          fontStyle: "italic",
          color: "rgba(244,237,224,0.58)",
          margin: "0 0 0.38in",
          lineHeight: 1.35,
        }}>
          to be the first community<br />to run the Headwaters Economic Engine.
        </p>

        {/* RUST rule */}
        <div style={{ width: "0.55in", height: "0.045in", background: RUST, marginBottom: "0.38in", flexShrink: 0 }} />

        {/* Declaration paragraph */}
        <p style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "0.82rem",
          lineHeight: 1.72,
          color: "rgba(244,237,224,0.82)",
          marginBottom: "0.16in",
          maxWidth: "6.4in",
        }}>
          Every engine has a first community. The first community does not just benefit from it — they prove it. They become the reference point, the case study, the name that other communities point to when they ask: does this actually work?
        </p>
        <p style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "0.82rem",
          lineHeight: 1.72,
          color: "rgba(244,237,224,0.82)",
          marginBottom: "0.38in",
          maxWidth: "6.4in",
        }}>
          Deer Lake is not being offered a pilot program. It is not being asked to be a test case. It is being recognized as the community that already has what this engine needs to run. We don't show up with a finished car and hand you the keys. We build this together — your people in the room for every piece of it. And when the engine turns over for the first time, it is your community's hands that start it. Your people drive it. Headwaters steps back. And because Deer Lake is first, you are not just building a community store. You are paving the road every community behind you will use.
        </p>

        {/* Thin divider */}
        <div style={{ height: 1, background: "rgba(244,237,224,0.1)", marginBottom: "0.32in", flexShrink: 0 }} />

        {/* Founding conditions label */}
        <p style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "0.5rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(201,147,10,0.7)",
          marginBottom: "0.2in",
        }}>
          Why Deer Lake is the founding community
        </p>

        {/* Founding conditions grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.2in", marginBottom: "0.38in" }}>
          {foundingConditions.map((c) => (
            <div
              key={c.label}
              style={{
                borderTop: `2px solid ${RUST}`,
                paddingTop: "0.14in",
              }}
            >
              <p style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: "0.88rem",
                fontWeight: 700,
                color: CREAM,
                margin: "0 0 0.07in",
                lineHeight: 1.25,
              }}>
                {c.label}
              </p>
              <p style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "0.68rem",
                color: "rgba(244,237,224,0.58)",
                margin: 0,
                lineHeight: 1.58,
              }}>
                {c.body}
              </p>
            </div>
          ))}
        </div>

        {/* Closing declaration box */}
        <div style={{
          border: `1px solid rgba(201,147,10,0.35)`,
          borderLeft: `3px solid ${GOLD}`,
          background: "rgba(201,147,10,0.06)",
          borderRadius: "0 4px 4px 0",
          padding: "0.2in 0.28in",
          marginBottom: "0.3in",
        }}>
          <p style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: "0.96rem",
            fontWeight: 600,
            fontStyle: "italic",
            color: CREAM,
            margin: 0,
            lineHeight: 1.55,
          }}>
            "When the first winter road delivery arrives in January 2027 and Deer Lake's community store opens its doors — that is the moment the engine is proven. Deer Lake's name will be at the start of that story."
          </p>
        </div>

        <div style={{ flex: 1 }} />

        {/* Signature area */}
        <div style={{
          borderTop: "1px solid rgba(244,237,224,0.1)",
          paddingTop: "0.24in",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}>
          <div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.54rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,237,224,0.35)", marginBottom: "0.06in" }}>
              Extended by
            </p>
            <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1rem", fontWeight: 700, color: CREAM, margin: "0 0 0.04in" }}>
              Bobbie Parr
            </p>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.66rem", color: "rgba(244,237,224,0.48)", margin: 0, lineHeight: 1.6 }}>
              Headwaters Development Services<br />
              Wabigoon, Ontario — Treaty 3 Territory
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.06in" }}>
            <QRCodeSVG
              value="https://ourheadwaters.ca"
              size={58}
              fgColor={CREAM}
              bgColor="transparent"
            />
            <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.38rem", color: "rgba(244,237,224,0.38)", margin: 0, letterSpacing: "0.08em", textAlign: "right", lineHeight: 1.5 }}>
              ourheadwaters.ca<br />
              <span style={{ color: "rgba(201,147,10,0.65)" }}>Scan → The Youth Odyssey</span>
            </p>
          </div>
        </div>

      </div>

      {/* Bottom rust bar */}
      <div style={{ height: "0.08in", background: RUST, flexShrink: 0 }} />
    </div>
  );
}

export default function DeerLakeFirstEngine() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-deer-lake-founding-community.pdf"
      />
      <div id="pdf-target" style={{ background: "#1a2820", padding: "2rem 0", display: "flex", justifyContent: "center" }}>
        <DeerLakeFirstEnginePage />
      </div>
    </>
  );
}
