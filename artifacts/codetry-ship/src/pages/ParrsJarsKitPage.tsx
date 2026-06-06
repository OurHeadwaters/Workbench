import cheatSheetsImg from "@assets/IMG_1198_1780775510410.PNG";
import pressureCanningImg from "@assets/IMG_2161_1780775510408.PNG";
import waterbathImg from "@assets/IMG-1948_1780775540402.PNG";
import cookingImg from "@assets/IMG_3081_1780775510405.PNG";
import localGotosImg from "@assets/IMG_3104_1780775510407.PNG";
import getStartedImg from "@assets/IMG_1184_1780775510410.PNG";

const INK = "#2c2c2c";
const CREAM = "#f4ede0";
const MUTED = "#6b6b5e";
const FOREST = "#1f3d2e";
const RUST = "#b85a3e";
const GOLD = "#c89a2e";
const BLACK = "#141414";

const STRIPE_PJ_KIT = "https://buy.stripe.com/REPLACE_PJ_KIT_LINK";

const KIT_MODULES = [
  {
    title: "Water-Bath Canning",
    desc: "Pickles, salsa, jams, tomato sauce — the high-acid world. Equipment, process diagram, approved recipe guidance, and a canning cheat sheet (waterbath vs pressure).",
    items: ["Process diagram", "Introduction & safe practices", "Waterbath recipes (pickles, salsa, tomatoes)", "Stages & stations worksheet", "Canning cheat sheet (PH guide)"],
    img: waterbathImg,
    color: FOREST,
  },
  {
    title: "Pressure Canning",
    desc: "Meat, broth, beans, potatoes — the low-acid world. Times table for common items, deeper dive on liquid loss and safety, and the 'can I eat it?' decision guide.",
    items: ["Process diagram", "Introduction & safe practices", "Times for common items (pints & quarts)", "Pressure canning deeper dive", "Process the Process — benefits, tips, remember"],
    img: pressureCanningImg,
    color: RUST,
  },
  {
    title: "Blanching, Freezing & Dehydrating",
    desc: "Everything before the jar — prep methods that protect nutrition and texture. Cheat sheets for each method plus the freezing vs dehydrating decision guide.",
    items: ["Blanching cheat sheet (vegetable timing)", "Freezing vs dehydrating cheat sheet", "Process the Process — enzymic activity, humidity, oxygen", "Dehydrating process diagram", "Freezer prep ideas"],
    img: cheatSheetsImg,
    color: GOLD,
  },
  {
    title: "Cooking With What You Store",
    desc: "The part most kits skip. How to actually use your pantry — canned meat, frozen veg, potatoes, local ingredients — through all four seasons.",
    items: ["Cooking with preserves (canned meat, tomatoes, potatoes, beans)", "Local go-to's (8 signature meals)", "Just add H2O — shelf-stable meal planning", "Value-added meals overview", "Fall harvest salad recipe"],
    img: cookingImg,
    color: FOREST,
  },
  {
    title: "The System",
    desc: "How to build a pantry that's actually a food system. Get started, track what you eat, audit your store, and know your method.",
    items: ["Get started — start where you are", "Eat what you store & store what you eat (food audit)", "In-person checklist", "Ratios cheat sheet", "Best methods + fermenting cheat sheet overview"],
    img: getStartedImg,
    color: RUST,
  },
];

const TESTIMONIAL = {
  quote: "I finally understand why my preserves keep failing — and what to actually do about it.",
  name: "Workshop participant, Dryden ON",
};

export function ParrsJarsKitPage() {
  return (
    <div style={{ minHeight: "100vh", background: BLACK, fontFamily: "var(--font-sans, Inter, sans-serif)", color: "white" }}>

      {/* Hero */}
      <div
        style={{
          background: `linear-gradient(to bottom, ${BLACK}, #1a1a1a)`,
          padding: "4rem 1.5rem 3rem",
          textAlign: "center",
          borderBottom: `1px solid #2a2a2a`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            border: "2px solid #444",
            borderRadius: "50%",
            width: 96,
            height: 96,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
            flexDirection: "column",
          }}
        >
          <span style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "1rem", fontWeight: 700, color: "white", lineHeight: 1.1, letterSpacing: "0.02em" }}>parr's</span>
          <span style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "1rem", fontWeight: 700, color: "white", lineHeight: 1.1, letterSpacing: "0.02em" }}>jars</span>
        </div>
        <p
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: GOLD,
            fontWeight: 700,
            marginBottom: "0.75rem",
          }}
        >
          Parr's Jars · Wabigoon, Ontario
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
            fontSize: "clamp(2rem, 6vw, 3.2rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            color: "white",
            marginBottom: "1rem",
            maxWidth: 700,
            margin: "0 auto 1rem",
          }}
        >
          The PJ Solutions Kit
        </h1>
        <p
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            color: "#aaa",
            maxWidth: 540,
            margin: "0 auto 0.75rem",
            lineHeight: 1.65,
          }}
        >
          Everything Bobbie Parr learned about food preservation from 2012 to 2023 — distilled into one digital kit for northern households starting their preparedness journey.
        </p>
        <p
          style={{
            fontSize: "0.8rem",
            color: GOLD,
            fontStyle: "italic",
            marginBottom: "2.5rem",
          }}
        >
          One kit. No guesswork. No overwhelm.
        </p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <a
            href={STRIPE_PJ_KIT}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              background: RUST,
              color: "white",
              fontWeight: 800,
              fontSize: "1.05rem",
              letterSpacing: "0.04em",
              padding: "0.9rem 2.5rem",
              borderRadius: 6,
              textDecoration: "none",
            }}
          >
            Get the Kit — $97 CAD →
          </a>
          <p style={{ fontSize: "0.72rem", color: "#666", margin: 0 }}>
            Digital download · Instant access · Yours to keep
          </p>
        </div>
      </div>

      {/* What is this */}
      <div
        style={{
          background: "#1a1a1a",
          padding: "3rem 1.5rem",
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.3rem, 3.5vw, 1.75rem)",
            fontWeight: 800,
            color: "white",
            marginBottom: "1rem",
          }}
        >
          What's in it
        </h2>
        <p style={{ color: "#aaa", lineHeight: 1.75, fontSize: "0.92rem", marginBottom: "0.75rem" }}>
          Most preservation guides teach you one method and leave you to figure out the rest. The PJ Solutions Kit covers the whole first year — from your first jar of pickles to a working pantry system that feeds your household through the winter.
        </p>
        <p style={{ color: "#aaa", lineHeight: 1.75, fontSize: "0.92rem", marginBottom: "0" }}>
          This is the material from Bobbie's Principles to Preservation workshop series — the same cheat sheets, process diagrams, and worksheets she's refined through 11 years of running a northern food business and teaching preservation in small-town Ontario.
        </p>
      </div>

      {/* Modules */}
      <div style={{ padding: "0 1.5rem 3rem", maxWidth: 800, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
            fontWeight: 800,
            color: GOLD,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontSize: "0.7rem",
            marginBottom: "1.5rem",
          }}
        >
          5 Modules · 20+ Handouts
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {KIT_MODULES.map((mod, i) => (
            <div
              key={mod.title}
              style={{
                background: "#1e1e1e",
                borderRadius: 8,
                overflow: "hidden",
                border: `1px solid #2a2a2a`,
                borderLeft: `4px solid ${mod.color}`,
                display: "flex",
                gap: 0,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: "1 1 300px", padding: "1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: mod.color,
                    fontWeight: 700,
                    marginBottom: "0.35rem",
                  }}
                >
                  Module {i + 1}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                    fontWeight: 800,
                    color: "white",
                    marginBottom: "0.6rem",
                  }}
                >
                  {mod.title}
                </h3>
                <p style={{ color: "#999", fontSize: "0.82rem", lineHeight: 1.65, marginBottom: "0.85rem" }}>
                  {mod.desc}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  {mod.items.map((item) => (
                    <li key={item} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", fontSize: "0.78rem", color: "#bbb" }}>
                      <span style={{ color: mod.color, flexShrink: 0 }}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                style={{
                  flex: "0 0 140px",
                  minHeight: 140,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#111",
                }}
              >
                <img
                  src={mod.img}
                  alt={mod.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Also includes */}
      <div style={{ background: "#111", padding: "2.5rem 1.5rem", borderTop: "1px solid #222", borderBottom: "1px solid #222" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
              fontWeight: 800,
              color: "white",
              marginBottom: "1rem",
            }}
          >
            Also included
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {[
              "Waterbath vs pressure cheat sheet",
              "Ratios cheat sheet (pickles, ferments, canning pot water)",
              "Local go-to recipes (8 dishes)",
              "Just add H2O shelf-stable meals",
              "Freezer prep ideas",
              "In-person checklist",
              "Food audit worksheet",
              "Tips & FAQ",
              "Feedback & reflection worksheet",
              "Seasonal recipe collection (when populated)",
            ].map((item) => (
              <div
                key={item}
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: 6,
                  padding: "0.65rem 0.9rem",
                  fontSize: "0.78rem",
                  color: "#bbb",
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: GOLD, flexShrink: 0 }}>✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div style={{ padding: "3rem 1.5rem", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
            fontStyle: "italic",
            color: "white",
            lineHeight: 1.6,
            marginBottom: "1rem",
          }}
        >
          "{TESTIMONIAL.quote}"
        </p>
        <p style={{ fontSize: "0.75rem", color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          — {TESTIMONIAL.name}
        </p>
      </div>

      {/* About Bobbie */}
      <div style={{ background: "#111", borderTop: "1px solid #222", padding: "2.5rem 1.5rem" }}>
        <div style={{ maxWidth: 660, margin: "0 auto" }}>
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              fontWeight: 800,
              color: GOLD,
              marginBottom: "0.75rem",
            }}
          >
            About Bobbie
          </h3>
          <p style={{ color: "#aaa", lineHeight: 1.75, fontSize: "0.88rem", marginBottom: "0.75rem" }}>
            Bobbie Parr has been running Parr's Jars from Wabigoon, Ontario since 2012 — selling at markets, teaching workshops, and building a food business rooted in Treaty 3 territory without a commercial kitchen.
          </p>
          <p style={{ color: "#aaa", lineHeight: 1.75, fontSize: "0.88rem" }}>
            The PJ Solutions Kit is the system she built over 11 years: what to preserve, how to preserve it safely, and how to cook from a pantry you actually built yourself. It's practical, northern-specific, and designed for households starting from scratch.
          </p>
        </div>
      </div>

      {/* CTA Footer */}
      <div
        style={{
          background: FOREST,
          padding: "3rem 1.5rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
            fontWeight: 900,
            color: "white",
            marginBottom: "0.5rem",
          }}
        >
          One kit. Everything you need to start.
        </h2>
        <p style={{ color: "#c4d9c8", fontSize: "0.88rem", marginBottom: "2rem" }}>
          Digital download · $97 CAD · Instant access
        </p>
        <a
          href={STRIPE_PJ_KIT}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-block",
            background: RUST,
            color: "white",
            fontWeight: 800,
            fontSize: "1.05rem",
            letterSpacing: "0.04em",
            padding: "0.9rem 2.5rem",
            borderRadius: 6,
            textDecoration: "none",
          }}
        >
          Get the PJ Solutions Kit →
        </a>
        <p style={{ color: "#c4d9c8", fontSize: "0.72rem", marginTop: "1rem" }}>
          Questions? Reply to any Parr's Jars email or find Bobbie at{" "}
          <a href="https://parrsjars.ca" style={{ color: GOLD, textDecoration: "none" }}>parrsjars.ca</a>
        </p>
      </div>
    </div>
  );
}
