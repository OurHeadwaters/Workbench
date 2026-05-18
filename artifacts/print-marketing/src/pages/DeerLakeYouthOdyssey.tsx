import type { CSSProperties } from "react";
import { QRCodeSVG } from "qrcode.react";
import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const GOLD = "#c9930a";
const MUTED = "#6b7665";
const INK = "#1a2820";

const base = import.meta.env.BASE_URL;

const PAGE: CSSProperties = {
  width: "8.5in",
  minHeight: "11in",
  background: CREAM,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  fontFamily: "Inter, system-ui, sans-serif",
  color: INK,
};

const stations = [
  {
    phase: 1,
    phaseLabel: "Your Kitchen",
    phaseSub: "Where what you already know lives",
    items: [
      {
        n: "01",
        name: "The Watcher",
        sub: "Someone in your life who teaches without a word",
        excerpt: "She had just shown them how to stay. You look until you stop looking. And then you see.",
      },
      {
        n: "02",
        name: "The Rings",
        sub: "Something handed to you before you understood its weight",
        excerpt: "I didn't know. But you did it anyway.",
      },
    ],
  },
  {
    phase: 2,
    phaseLabel: "Your People",
    phaseSub: "The ones who shaped you without trying",
    items: [
      {
        n: "03",
        name: "The Button",
        sub: "A small move that connected you to something real",
        excerpt: "She pressed it. Nothing happened. The screen didn't change. Four days later, Margaret Swain called her.",
      },
      {
        n: "04",
        name: "The Word",
        sub: "A name from home that the outside world doesn't have",
        excerpt: "How her people said trade in a way that also meant you are now inside my story.",
      },
    ],
  },
  {
    phase: 3,
    phaseLabel: "The Hard Thing",
    phaseSub: "What was called a weakness",
    items: [
      {
        n: "05",
        name: "The Readiness",
        sub: "What was called a weakness is a kind of equipment",
        excerpt: "A heart worn on the outside is not a weakness. It is a kind of readiness.",
      },
      {
        n: "06",
        name: "The Current",
        sub: "The thing you were built for vs. the tree you were told to climb",
        excerpt: "She swum down, not up. In the going down, she found the whole river. Not a view from above. A knowledge from within.",
      },
    ],
  },
  {
    phase: 4,
    phaseLabel: "The Crossing",
    phaseSub: "What doesn't need permission to begin",
    items: [
      {
        n: "07",
        name: "The Green",
        sub: "The aliveness that doesn't wait for permission",
        excerpt: "It did not ask if it was time. It did not look at the ice on the lake. And yet.",
      },
      {
        n: "08",
        name: "The Return",
        sub: "What empty hands make possible that full ones can't",
        excerpt: "The freedom he had been looking for was not a location. It was a permission. And he had always had it.",
        isReturn: true,
      },
    ],
  },
];

export function DeerLakeYouthOdysseyPage() {
  return (
    <div className="page-letter" style={PAGE}>

      {/* Header */}
      <div style={{
        background: EVERGREEN,
        padding: "0.32in 0.65in 0.26in",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.14in", marginBottom: "0.14in" }}>
            <img
              src={`${base}eagle-mark.svg`}
              alt="Headwaters"
              style={{ width: "0.44in", height: "0.36in", objectFit: "contain", opacity: 0.9, flexShrink: 0 }}
            />
            <div>
              <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.8rem", fontWeight: 700, color: CREAM, margin: 0, lineHeight: 1.15 }}>Headwaters</p>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.42rem", color: "rgba(244,237,224,0.5)", margin: 0, letterSpacing: "0.12em", textTransform: "uppercase" }}>Development Services</p>
            </div>
          </div>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.5rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(244,237,224,0.45)", margin: "0 0 0.06in" }}>
            For Deer Lake First Nation — May 2026
          </p>
          <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: CREAM, margin: 0, lineHeight: 1.12, letterSpacing: "-0.01em" }}>
            The Youth Odyssey
          </h1>
        </div>
        <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.8rem", fontStyle: "italic", fontWeight: 400, color: "rgba(244,237,224,0.52)", margin: 0, textAlign: "right", maxWidth: "2.2in", lineHeight: 1.45 }}>
          Four phases.<br />Eight stations.<br />One story — theirs.
        </p>
      </div>

      {/* Rust rule */}
      <div style={{ height: "0.05in", background: RUST, flexShrink: 0 }} />

      {/* Body */}
      <div style={{ flex: 1, padding: "0.22in 0.65in 0.18in", display: "flex", flexDirection: "column", gap: "0.16in" }}>

        {/* Opening — written for Deer Lake */}
        <div style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: "0.18in", marginBottom: "0.06in" }}>
          <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.86rem", lineHeight: 1.62, color: INK, margin: "0 0 0.1in", fontWeight: 500 }}>
            Every station in this programme was written from a story that could have come from a northern Ontario community. The Watcher sitting at the creek. The Rings handed over before the child understood their weight. The Button pressed without knowing why — and Margaret Swain calling four days later. The Word that holds a river and a season and a grandmother's name in a single syllable.
          </p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.76rem", lineHeight: 1.65, color: MUTED, margin: 0 }}>
            These are not hypothetical young people. They are the young people you already know. The Youth Odyssey gives them eight stations to walk — and at the end of each one, they write their own story, in their own voice, anchored in what they already carry.
          </p>
        </div>

        {/* Thin divider */}
        <div style={{ height: 1, background: "rgba(31,61,46,0.1)", flexShrink: 0 }} />

        {/* Station grid — two columns, 4 phases */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.12in 0.32in" }}>
          {stations.map((phase) => (
            <div key={phase.phase} style={{ display: "flex", flexDirection: "column", gap: "0.08in" }}>
              {/* Phase header */}
              <div style={{
                background: "rgba(31,61,46,0.06)",
                borderTop: `2px solid ${EVERGREEN}`,
                padding: "0.08in 0.12in 0.06in",
                marginBottom: "0.04in",
              }}>
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.42rem", letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, margin: "0 0 0.02in" }}>
                  Phase {phase.phase}
                </p>
                <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.76rem", fontWeight: 700, color: EVERGREEN, margin: "0 0 0.02in", lineHeight: 1.15 }}>
                  {phase.phaseLabel}
                </p>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: MUTED, margin: 0, fontStyle: "italic" }}>
                  {phase.phaseSub}
                </p>
              </div>

              {/* Stations in this phase */}
              {phase.items.map((s) => (
                <div
                  key={s.n}
                  style={{
                    background: s.isReturn ? EVERGREEN : "white",
                    border: s.isReturn ? "none" : "1px solid rgba(31,61,46,0.1)",
                    borderLeft: s.isReturn ? `3px solid ${RUST}` : `3px solid ${GOLD}`,
                    borderRadius: 3,
                    padding: "0.1in 0.12in",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.08in", marginBottom: "0.03in" }}>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.42rem", color: s.isReturn ? "rgba(244,237,224,0.45)" : GOLD, letterSpacing: "0.1em" }}>
                      {s.n}
                    </span>
                    <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.82rem", fontWeight: 700, color: s.isReturn ? CREAM : EVERGREEN, margin: 0, lineHeight: 1.1 }}>
                      {s.name}
                    </p>
                  </div>
                  <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: s.isReturn ? "rgba(244,237,224,0.6)" : MUTED, margin: "0 0 0.06in", lineHeight: 1.4, fontStyle: "italic" }}>
                    {s.sub}
                  </p>
                  <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.66rem", fontStyle: "italic", color: s.isReturn ? "rgba(244,237,224,0.75)" : "#4a5d48", margin: 0, lineHeight: 1.48 }}>
                    "{s.excerpt}"
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* The Return connection */}
        <div style={{ background: "rgba(184,90,62,0.07)", border: `1px solid rgba(184,90,62,0.22)`, borderLeft: `3px solid ${RUST}`, borderRadius: 3, padding: "0.14in 0.2in" }}>
          <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.84rem", fontWeight: 600, color: RUST, margin: "0 0 0.06in", lineHeight: 1.3 }}>
            The Return is what the engine makes possible.
          </p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.72rem", color: INK, margin: 0, lineHeight: 1.62 }}>
            When a young person walks the Odyssey, they end up with something that belongs to them — a story written in their own voice, grounded in their own community. What they need after that is somewhere to bring it. The Deer Lake Community Store is where Station 08 lands. Not a job posting. A place that was built for people who already know the Rings, the Word, the Current. A community economy that was waiting for them to come back to it.
          </p>
        </div>

        {/* Discovery section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "0.24in",
          alignItems: "start",
          background: "rgba(31,61,46,0.05)",
          border: "1px solid rgba(31,61,46,0.12)",
          borderRadius: 4,
          padding: "0.16in 0.22in",
        }}>
          {/* QR code */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.05in", flexShrink: 0 }}>
            <QRCodeSVG
              value="https://ourheadwaters.ca"
              size={72}
              fgColor={EVERGREEN}
              bgColor="transparent"
            />
            <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.38rem", color: MUTED, margin: 0, letterSpacing: "0.06em", textAlign: "center" }}>
              ourheadwaters.ca
            </p>
          </div>

          {/* Discovery text */}
          <div>
            <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.8rem", fontWeight: 700, color: EVERGREEN, margin: "0 0 0.07in", lineHeight: 1.2 }}>
              See the full programme before we meet.
            </p>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.68rem", color: INK, margin: "0 0 0.1in", lineHeight: 1.6 }}>
              Scan the code or visit <span style={{ fontFamily: "'Courier New', monospace", color: EVERGREEN, fontSize: "0.66rem" }}>ourheadwaters.ca</span> to walk through The Youth Odyssey, read the tales behind each station, and see the community development story that has been building toward this moment.
            </p>
            <p style={{ fontFamily: "'Courier New', monospace", fontSize: "0.52rem", color: MUTED, margin: 0, letterSpacing: "0.06em" }}>
              Search: <span style={{ color: EVERGREEN }}>Bobbie Parr</span> · <span style={{ color: EVERGREEN }}>Headwaters Youth Odyssey</span> · <span style={{ color: EVERGREEN }}>ourheadwaters.ca</span>
            </p>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div style={{
        background: EVERGREEN,
        padding: "0.16in 0.65in",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
      }}>
        <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.68rem", fontWeight: 600, color: CREAM, margin: 0 }}>
          Headwaters Development Services · Wabigoon, Ontario — Treaty 3 Territory
        </p>
        <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.58rem", color: "rgba(244,237,224,0.55)", margin: 0, letterSpacing: "0.04em" }}>
          ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654
        </p>
      </div>

    </div>
  );
}

export default function DeerLakeYouthOdyssey() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-deer-lake-youth-odyssey.pdf"
      />
      <div id="pdf-target" style={{ background: "#d8d2c8", padding: "2rem 0", display: "flex", justifyContent: "center" }}>
        <DeerLakeYouthOdysseyPage />
      </div>
    </>
  );
}
