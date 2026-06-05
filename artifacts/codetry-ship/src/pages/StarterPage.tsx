import { QRCodeSVG } from "qrcode.react";

const EVERGREEN = "#1f3d2e";
const RUST = "#b85a3e";
const CREAM = "#f4ede0";
const INK = "#2c2c2c";
const MUTED = "#6b6b5e";

const STRIPE_FIELD_GUIDE = "https://buy.stripe.com/REPLACE_FIELD_GUIDE_LINK";
const STRIPE_HANDBOOK = "https://buy.stripe.com/REPLACE_HANDBOOK_LINK";
const START_URL = "https://ourheadwaters.ca/start";

const offerings = [
  {
    id: "field-guide",
    label: "Practitioner Finance Course",
    name: "Field Guide Finance",
    price: "$147",
    priceNote: "CAD · one-time · yours to keep",
    description:
      "The practitioner's finance course for NWO food businesses — four buckets, real numbers, and a model that runs without a consultant in the room.",
    what: [
      "Six modules: story, pricing, seasonal cash, co-op ROI, grants, and the Headwaters Bucket System",
      "Worked examples built for Northwestern Ontario costs and market realities",
      "Pricing cost sheets, seasonal cash maps, and co-op ROI calculators you can copy and use",
    ],
    cta: "Get Field Guide Finance",
    href: STRIPE_FIELD_GUIDE,
    accent: EVERGREEN,
  },
  {
    id: "handbook",
    label: "Practitioner Handbook",
    name: "The Handbook",
    price: "$39",
    priceNote: "CAD · one-time · offline-first",
    description:
      "Headwaters in your pocket — how a community runs its own economy, written plainly and structured for real use. Installable as an app. No subscription.",
    what: [
      "Complete Headwaters model: zones, gates, watershed compact, and the generosity-with-boundaries doctrine",
      "Works offline — install on your phone or download the PDF",
      "No login required after purchase",
    ],
    cta: "Get The Handbook",
    href: STRIPE_HANDBOOK,
    accent: RUST,
  },
  {
    id: "short-engagement",
    label: "Short Engagement",
    name: "One Thing Done",
    price: "Fixed fee",
    priceNote: "quoted to scope · 1–2 weeks",
    description:
      "A grant application written, a business plan roughed out, a funding argument put on paper. Paid on delivery — not contingent on grant approval.",
    what: [
      "Grant applications, business plans, funding arguments, operational documents",
      "Fixed fee priced to the scope before work begins",
      "No retainer, no contract beyond the scope agreement",
    ],
    cta: "Get a quote",
    href: "mailto:bobbie@ourheadwaters.ca?subject=Short%20engagement%20inquiry",
    accent: "#4a6741",
    isEmail: true,
  },
];

const STRIPE_LINKS_LIVE =
  !STRIPE_FIELD_GUIDE.includes("REPLACE") &&
  !STRIPE_HANDBOOK.includes("REPLACE");

export function StarterPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: CREAM,
        fontFamily: "var(--font-sans, Inter, sans-serif)",
      }}
    >
      {!STRIPE_LINKS_LIVE && (
        <div
          className="print:hidden"
          style={{
            background: "#fef08a",
            borderBottom: "2px solid #ca8a04",
            padding: "0.6rem 1.2rem",
            fontSize: "0.78rem",
            fontFamily: "monospace",
            color: "#713f12",
            lineHeight: 1.5,
          }}
        >
          <strong>Stripe links not yet live.</strong> Replace{" "}
          <code>REPLACE_FIELD_GUIDE_LINK</code> and{" "}
          <code>REPLACE_HANDBOOK_LINK</code> in{" "}
          <code>StarterPage.tsx</code> with your real Stripe Payment Link URLs.
          Create them at{" "}
          <a
            href="https://dashboard.stripe.com/payment-links"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#92400e", textDecoration: "underline" }}
          >
            dashboard.stripe.com/payment-links
          </a>
          . This banner disappears automatically once the links are replaced.
        </div>
      )}

      {/* Header */}
      <header
        style={{
          background: EVERGREEN,
          padding: "2rem 1.5rem 1.75rem",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-sans, Inter, sans-serif)",
              fontSize: "0.65rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(244,237,224,0.5)",
              marginBottom: "0.5rem",
            }}
          >
            Headwaters Development Services
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
              fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
              fontWeight: 900,
              color: CREAM,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "0.75rem",
            }}
          >
            Start here.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
              fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
              fontStyle: "italic",
              color: "rgba(244,237,224,0.78)",
              lineHeight: 1.6,
              maxWidth: 540,
            }}
          >
            Three tools you can use today — no contract required. Pay once, and
            what you get is yours.
          </p>
        </div>
      </header>

      {/* Offerings */}
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.25rem" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {offerings.map((o) => (
            <div
              key={o.id}
              style={{
                background: "white",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(31,61,46,0.08)",
                borderTop: `4px solid ${o.accent}`,
              }}
            >
              <div style={{ padding: "1.4rem 1.5rem 1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                    flexWrap: "wrap",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "0.62rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: o.accent,
                        marginBottom: "0.2rem",
                        fontWeight: 600,
                      }}
                    >
                      {o.label}
                    </p>
                    <h2
                      style={{
                        fontFamily:
                          "var(--font-serif, 'Playfair Display', Georgia, serif)",
                        fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
                        fontWeight: 800,
                        color: EVERGREEN,
                        lineHeight: 1.15,
                      }}
                    >
                      {o.name}
                    </h2>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p
                      style={{
                        fontFamily:
                          "var(--font-serif, 'Playfair Display', Georgia, serif)",
                        fontSize: "clamp(1.3rem, 4vw, 1.7rem)",
                        fontWeight: 900,
                        color: o.isEmail ? MUTED : EVERGREEN,
                        lineHeight: 1,
                      }}
                    >
                      {o.price}
                    </p>
                    <p
                      style={{
                        fontSize: "0.67rem",
                        color: MUTED,
                        marginTop: "0.2rem",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {o.priceNote}
                    </p>
                  </div>
                </div>

                <p
                  style={{
                    fontFamily:
                      "var(--font-serif, 'Playfair Display', Georgia, serif)",
                    fontSize: "0.92rem",
                    color: INK,
                    lineHeight: 1.65,
                    marginBottom: "1rem",
                  }}
                >
                  {o.description}
                </p>

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem",
                  }}
                >
                  {o.what.map((item) => (
                    <li
                      key={item}
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "flex-start",
                        fontSize: "0.82rem",
                        color: MUTED,
                        lineHeight: 1.55,
                      }}
                    >
                      <span
                        style={{
                          color: o.accent,
                          flexShrink: 0,
                          fontFamily:
                            "var(--font-serif, 'Playfair Display', Georgia, serif)",
                          marginTop: "0.05rem",
                        }}
                      >
                        →
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href={o.href}
                  target={o.isEmail ? undefined : "_blank"}
                  rel={o.isEmail ? undefined : "noreferrer"}
                  style={{
                    display: "inline-block",
                    background: o.accent,
                    color: "white",
                    fontFamily: "var(--font-sans, Inter, sans-serif)",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    padding: "0.7rem 1.4rem",
                    borderRadius: 6,
                    textDecoration: "none",
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")
                  }
                >
                  {o.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: `3px solid ${EVERGREEN}`,
          background: CREAM,
          padding: "2rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <p
              style={{
                fontFamily:
                  "var(--font-serif, 'Playfair Display', Georgia, serif)",
                fontSize: "0.95rem",
                fontWeight: 700,
                color: EVERGREEN,
                marginBottom: "0.35rem",
              }}
            >
              Headwaters Development Services
            </p>
            <p
              style={{
                fontSize: "0.78rem",
                color: MUTED,
                lineHeight: 1.65,
                marginBottom: "0.5rem",
              }}
            >
              Bobbie Parr — NWO practitioner, founder of Parr's Jars,
              founding board member of the 807 Food Co-op.
              <br />
              Based in Wabigoon, Ontario.
            </p>
            <a
              href="mailto:bobbie@ourheadwaters.ca"
              style={{
                fontSize: "0.82rem",
                color: RUST,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              bobbie@ourheadwaters.ca
            </a>
            <p
              style={{
                fontSize: "0.72rem",
                color: MUTED,
                marginTop: "0.75rem",
                fontStyle: "italic",
              }}
            >
              All fees CAD · excludes HST
            </p>
          </div>

          {/* QR stamp */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.4rem",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                background: "white",
                padding: 6,
                borderRadius: 6,
                boxShadow: "0 1px 3px rgba(31,61,46,0.12)",
                lineHeight: 0,
              }}
            >
              <QRCodeSVG
                value={START_URL}
                size={96}
                level="M"
                fgColor={EVERGREEN}
                bgColor="white"
              />
            </div>
            <span
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: MUTED,
                textAlign: "center",
              }}
            >
              ourheadwaters.ca/start
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
