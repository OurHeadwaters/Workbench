import QRCodeStamp from "../components/QRCodeStamp";
import { PrintNav } from "../components/PrintNav";

const products = [
  {
    name: "The Green Salt",
    tagline: "Smoked · Blended · Local",
    desc: "Smoked Himalayan salt blended with freeze-dried microgreens and homegrown tomato powder. Born from the circular economy of the Jar Kitchen — excess hydroponics and greens, preserved at peak nutrition, folded into a salt that tastes like the season it came from.",
    size: "100 g jar",
  },
  {
    name: "The Salty Onion",
    tagline: "Farm-sourced · Freeze-dried · Rich",
    desc: "Freeze-dried onion and garden greens from Walls Farm and the homestead garden, ground into a deep, savoury blend. No fillers. You can taste where it came from — because it still carries it.",
    size: "80 g jar",
  },
  {
    name: "Seasonal Release",
    tagline: "Whatever the season gives us",
    desc: "A rotating jar — smoked, fermented, dried, or blended — produced when the garden or a farm partner generates abundance worth preserving. Club members are first to know and first in line.",
    size: "Varies by batch",
  },
];

const howItWorks = [
  { step: "01", text: "Reach out by email or text to join the list." },
  { step: "02", text: "Receive a message when a new batch is ready — typically once per season." },
  { step: "03", text: "Reply to confirm your order. Pick up in Dryden or arrange local delivery." },
  { step: "04", text: "Gift memberships available. One jar or a full season — your call." },
];

export default function SaltOfTheEarthClub() {
  return (
    <>
      <PrintNav targetId="pdf-target" filename="salt-of-the-earth-club.pdf" />
      <div
        id="pdf-target"
        className="print-page"
        style={{
          padding: 0,
          overflow: "hidden",
          background: "var(--cream)",
          minHeight: "11in",
        }}
      >
        <div
          style={{
            position: "relative",
            minHeight: "11in",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Decorative background circle */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-1.5in",
                right: "-2in",
                width: "6in",
                height: "6in",
                borderRadius: "50%",
                background: "rgba(184,90,62,0.06)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "0.5in",
                left: "-1.5in",
                width: "4in",
                height: "4in",
                borderRadius: "50%",
                background: "rgba(31,61,46,0.04)",
              }}
            />
          </div>

          {/* Header band */}
          <div
            style={{
              background: "var(--evergreen)",
              padding: "0.45in 0.6in 0.4in",
              flexShrink: 0,
              position: "relative",
              zIndex: 1,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.58rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(244,237,224,0.5)",
                marginBottom: "0.15rem",
              }}
            >
              Headwaters · Jarista Line
            </p>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.8rem",
                fontWeight: 900,
                color: "var(--cream)",
                lineHeight: 1.0,
                letterSpacing: "-0.025em",
                marginBottom: "0.2rem",
              }}
            >
              Salt of the Earth Club
            </h1>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1rem",
                fontStyle: "italic",
                color: "var(--rust-light)",
                lineHeight: 1.4,
                maxWidth: "4.5in",
              }}
            >
              Seasonal salts from a Dryden kitchen — freeze-dried, blended, and jarred from local farms and the homestead garden.
            </p>
          </div>

          {/* Body */}
          <div
            style={{
              flex: 1,
              padding: "0.35in 0.6in 0.3in",
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Intro paragraph */}
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.78rem",
                color: "#3a3a3a",
                lineHeight: 1.65,
                maxWidth: "5.5in",
                marginBottom: "0.3in",
              }}
            >
              The Jar Kitchen runs on a simple principle: if the season gives abundance, preserve it. These salts are what happens when that principle meets a freeze-dryer, a smoked salt supplier, and a community of farms that grow more than the grocery store will buy. Every jar carries the specific farm, field, or garden it came from. You can taste the sourcing.
            </p>

            {/* Product cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "0.25in",
                marginBottom: "0.3in",
              }}
            >
              {products.map((p) => (
                <div
                  key={p.name}
                  style={{
                    background: "white",
                    border: "1px solid rgba(31,61,46,0.12)",
                    borderRadius: 8,
                    padding: "0.2in 0.22in",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 4,
                      background: "var(--rust)",
                      borderRadius: 2,
                      marginBottom: "0.18rem",
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.0rem",
                      fontWeight: 700,
                      color: "var(--evergreen)",
                      lineHeight: 1.2,
                      marginBottom: "0.1rem",
                    }}
                  >
                    {p.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--rust)",
                      marginBottom: "0.15rem",
                    }}
                  >
                    {p.tagline}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.7rem",
                      color: "#3a3a3a",
                      lineHeight: 1.55,
                      flex: 1,
                    }}
                  >
                    {p.desc}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.62rem",
                      color: "var(--muted)",
                      fontStyle: "italic",
                      marginTop: "0.18rem",
                    }}
                  >
                    {p.size}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                marginBottom: "0.25in",
              }}
            >
              <div style={{ height: 1, background: "rgba(31,61,46,0.18)", flex: 1 }} />
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--rust)",
                }}
              />
              <div style={{ height: 1, background: "rgba(31,61,46,0.18)", flex: 1 }} />
            </div>

            {/* How it works */}
            <div style={{ marginBottom: "0.3in" }}>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "0.18rem",
                }}
              >
                How it works
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: "0.2in",
                }}
              >
                {howItWorks.map((h) => (
                  <div key={h.step} style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.1rem",
                        fontWeight: 900,
                        color: "rgba(31,61,46,0.2)",
                        lineHeight: 1,
                        marginBottom: "0.08rem",
                      }}
                    >
                      {h.step}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.72rem",
                        color: "#3a3a3a",
                        lineHeight: 1.5,
                      }}
                    >
                      {h.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ethos pull quote */}
            <div
              style={{
                borderLeft: "3px solid var(--rust)",
                paddingLeft: "0.22in",
                marginBottom: "0.3in",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "0.9rem",
                  fontStyle: "italic",
                  color: "var(--evergreen)",
                  lineHeight: 1.5,
                }}
              >
                "Working with what you have and sticking things in jars — that's got 1930 written all over it. We wear that with pride."
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.62rem",
                  color: "var(--muted)",
                  marginTop: "0.08rem",
                }}
              >
                — Bobbie Parr, Headwaters
              </p>
            </div>

            {/* Footer CTA */}
            <div
              style={{
                background: "var(--evergreen)",
                borderRadius: 8,
                padding: "0.2in 0.35in",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "auto",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.0rem",
                    fontWeight: 700,
                    color: "var(--cream)",
                    marginBottom: "0.05rem",
                  }}
                >
                  Join the club
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.7rem",
                    color: "rgba(244,237,224,0.75)",
                    lineHeight: 1.55,
                  }}
                >
                  bobbie@ourheadwaters.ca
                  <br />
                  Text preferred: 807 220 3654
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "var(--cream)",
                    }}
                  >
                    ourheadwaters.ca
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.6rem",
                      color: "rgba(244,237,224,0.55)",
                    }}
                  >
                    Dryden, Ontario · Treaty 3 Territory
                  </p>
                </div>
                <QRCodeStamp light />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
