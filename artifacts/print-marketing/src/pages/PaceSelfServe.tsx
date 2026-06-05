import QRCodeStamp from "../components/QRCodeStamp";
import { PrintNav } from "../components/PrintNav";

const base = import.meta.env.BASE_URL;

const START_URL = "https://ourheadwaters.ca/start";

const offerings = [
  {
    name: "Field Guide Finance",
    price: "$147 CAD",
    note: "one-time · yours to keep",
    desc: "The practitioner's finance course for NWO food businesses — four buckets, real numbers, and a model that runs without a consultant in the room. Six modules, worked examples, cost sheets, and seasonal cash maps built for Northwestern Ontario realities.",
    accent: "#1f3d2e",
  },
  {
    name: "The Handbook",
    price: "$39 CAD",
    note: "one-time · offline-first",
    desc: "Headwaters in your pocket — how a community runs its own economy, written plainly. Installable as an app on your phone. No subscription, no login after purchase. Works offline.",
    accent: "#b85a3e",
  },
  {
    name: "One Thing Done",
    price: "Fixed fee",
    note: "1–2 weeks · quoted to scope",
    desc: "A grant application written, a business plan roughed out, a funding argument put on paper. Fixed fee, priced to scope before work begins. Paid on delivery — not contingent on grant approval.",
    accent: "#2e5a3f",
  },
];

function buildPlainText(): string {
  return [
    "HEADWATERS DEVELOPMENT SERVICES",
    "Start here — tools you can use today",
    "",
    "No contract required. Scan the code, pay once, and the tool is yours.",
    "",
    "---",
    "",
    ...offerings.flatMap((o) => [
      `${o.name}  ·  ${o.price}  ·  ${o.note}`,
      o.desc,
      "",
    ]),
    "---",
    "",
    "Bobbie Parr — NWO practitioner, founder of Parr's Jars,",
    "founding board member of the 807 Food Co-op.",
    "Based in Wabigoon, Ontario. Working across Northwestern Ontario.",
    "",
    "bobbie@ourheadwaters.ca",
    "ourheadwaters.ca/start",
    "",
    "All fees CAD · excludes HST",
  ].join("\n");
}

export default function PaceSelfServe() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-pace-self-serve.pdf"
        onCopyPlainText={buildPlainText}
      />

      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ padding: 0, overflow: "hidden", background: "var(--cream)", height: "11in", maxHeight: "11in" }}
      >
        <div style={{ position: "relative", height: "11in", maxHeight: "11in", overflow: "hidden", display: "flex", flexDirection: "column" }}>

          {/* Header */}
          <div style={{ background: "var(--evergreen)", padding: "0.28in 0.65in 0.22in", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.15in", marginBottom: "0.1in" }}>
              <img src={`${base}eagle-mark.svg`} alt="Headwaters logo" style={{ width: "0.45in", height: "0.38in", objectFit: "contain", flexShrink: 0 }} />
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,237,224,0.55)", lineHeight: 1.3 }}>
                Headwaters Development Services
              </p>
            </div>
            <div style={{ width: "0.5in", height: 3, background: "var(--rust)", marginBottom: "0.12in" }} />
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.1rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: "0.1in" }}>
              Start here —<br />tools you can use today
            </h1>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontStyle: "italic", color: "rgba(244,237,224,0.78)", lineHeight: 1.5, maxWidth: "5.2in" }}>
              No contract required. Scan the code, pay once, and the tool is yours.
            </p>
          </div>

          {/* Offerings */}
          <div style={{ flex: 1, padding: "0.22in 0.65in 0.16in", display: "flex", flexDirection: "column", gap: "0.15in", minHeight: 0 }}>
            {offerings.map((o) => (
              <section
                key={o.name}
                style={{
                  display: "flex",
                  gap: "0.18in",
                  alignItems: "flex-start",
                  borderLeft: `3px solid ${o.accent}`,
                  paddingLeft: "0.18in",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.05in", flexWrap: "wrap", gap: "0.1in" }}>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.02rem", fontWeight: 800, color: o.accent, lineHeight: 1.2 }}>
                      {o.name}
                    </p>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", fontWeight: 900, color: "var(--ink)", lineHeight: 1 }}>
                        {o.price}
                      </span>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.66rem", color: "var(--muted)", marginLeft: "0.08in", letterSpacing: "0.03em" }}>
                        {o.note}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "var(--ink)", lineHeight: 1.62 }}>
                    {o.desc}
                  </p>
                </div>
              </section>
            ))}

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(31,61,46,0.12)", margin: "0.05in 0" }} />

            {/* QR + call to action — centred */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: "0.12in", paddingTop: "0.06in" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", textAlign: "center" }}>
                Scan to buy — no account or contract required
              </p>
              <QRCodeStamp size={112} url={START_URL} />
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.85rem", fontStyle: "italic", color: "var(--muted)", textAlign: "center" }}>
                Pay once at <strong style={{ fontStyle: "normal", color: "var(--evergreen)" }}>ourheadwaters.ca/start</strong> — you'll get an email with your download link or course access.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ background: "var(--rust)", padding: "0.12in 0.65in", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: "0.03rem" }}>
                Questions? Send a message
              </p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", fontWeight: 700, color: "white", lineHeight: 1.2 }}>
                bobbie@ourheadwaters.ca
              </p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.7rem", fontStyle: "italic", color: "rgba(255,255,255,0.6)", lineHeight: 1.4, marginTop: "0.04rem" }}>
                Bobbie Parr — NWO practitioner, founder of Parr's Jars, founding board member of the 807 Food Co-op. Based in Wabigoon.
              </p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "0.3in" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.05rem" }}>
                Full engagement available too — ask PACE.
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>
                All fees CAD · excludes HST
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
