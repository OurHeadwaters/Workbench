const EVERGREEN = "#1f3d2e";
const RUST = "#b85a3e";
const CREAM = "#f4ede0";
const INK = "#2c2c2c";
const MUTED = "#6b6b5e";
const GOLD = "#c89a2e";
const FOREST = "#4a6741";

const START_URL = "/headwaters/start";

const STRIPE_ZONE0       = "https://buy.stripe.com/cNi3cxe8R6llgoA6fNbwk04";
const STRIPE_PREP_PACK   = "https://buy.stripe.com/bJe28t1m56llfkwaw3bwk05";
const STRIPE_JARS_SCARS  = "https://buy.stripe.com/REPLACE_JARS_SCARS_LINK";
const STRIPE_BUNDLE      = "https://buy.stripe.com/3cI6oJc0J9xx8W88nVbwk06";
const STRIPE_COURSE1     = "https://buy.stripe.com/aFacN7aWFdNNfkwfQnbwk07";

const STRIPE_MISSING = [
  { key: "REPLACE_ZONE0_LINK",      label: "Zone 0 Starter Kit",  url: STRIPE_ZONE0 },
  { key: "REPLACE_PREP_PACK_LINK",  label: "Preparedness Pack",   url: STRIPE_PREP_PACK },
  { key: "REPLACE_JARS_SCARS_LINK", label: "Jars & Scars",        url: STRIPE_JARS_SCARS },
  { key: "REPLACE_BUNDLE_LINK",     label: "Zone 0 + Prep Bundle", url: STRIPE_BUNDLE },
  { key: "REPLACE_COURSE1_LINK",    label: "Course 1",            url: STRIPE_COURSE1 },
].filter((p) => p.url.includes("REPLACE"));

const STRIPE_LINKS_LIVE = STRIPE_MISSING.length === 0;

const COURSE1_SESSIONS = [
  { n: "01", title: "Why Canning Works", sub: "Pressure vs. water-bath, acidity, the real reason botulism matters — and when it doesn't." },
  { n: "02", title: "Equipment Without the Fluff", sub: "What you actually need to start. What you can skip. How to source a canner in a northern town." },
  { n: "03", title: "Your First Water-Bath Batch", sub: "Jam, pickles, or tomatoes — step by step, start to finish, with nothing assumed." },
  { n: "04", title: "Pressure Canning Basics", sub: "Meat, beans, broth. The process, the rules, the common mistakes, and how to read a dial gauge." },
  { n: "05", title: "Rotation Discipline", sub: "FIFO, label systems, the shelf map. How to run a pantry that's actually a food system instead of a storage problem." },
  { n: "06", title: "Fermentation as Preservation", sub: "Lacto-fermentation from scratch — kraut, kvass, fermented hot sauce. No special equipment. No risk if you follow the pH." },
  { n: "07", title: "Dehydrating and Freeze-Drying", sub: "What dehydrating is good for. What it isn't. How Bobbie uses both in the jar kitchen, and what came out of the freeze-dryer to become Green Salt." },
  { n: "08", title: "Building the 72-Hour Layer", sub: "The exit pack as preservation practice. What belongs in a northern Ontario 72-hour kit that doesn't belong in a southern one." },
  { n: "09", title: "Selling from the Kitchen", sub: "Cottage food rules in Ontario. Labelling. Pricing your product honestly. How Parr's Jars went from surplus to a business without a commercial kitchen." },
  { n: "10", title: "Running the Jar Kitchen Year-Round", sub: "Seasonal planning, what to preserve when, and how to think about the whole system — not just the next batch." },
];

const DIGITAL_PRODUCTS = [
  {
    id: "northern-pantry",
    label: "Free Download",
    name: "The 3-Layer Northern Pantry",
    price: "Free",
    origin: "The first thing people asked Bobbie to write down when they heard how she organized her pantry. It's the system she runs, not a system she designed for a workbook.",
    href: "/print-marketing/suite/northern-pantry",
    cta: "Download free",
    accent: FOREST,
    bullets: [
      "Layer 1: The Jar Kitchen (Zone 0) — active pantry, rotation discipline, root cellar basics",
      "Layer 2: The Standby Room (Zone 1) — dry storage, home preservation, freezer system",
      "Layer 3: The 72-Hour Exit Layer (Zone 2) — two packs, contents, the rule about when to open them",
      "\"This week's action\" prompt at the bottom of each layer",
      "Spirko Redundancy Rule callout and a northern-Ontario-specific 72-hour checklist",
    ],
  },
  {
    id: "zone0",
    label: "Digital Kit · $17 CAD",
    name: "Zone 0 Starter Kit",
    price: "$17",
    origin: "Bobbie built this after watching people download the Northern Pantry printable and then ask: \"okay, but what do I actually do first?\" Zone 0 is the answer — start with your own kitchen, start this week.",
    href: STRIPE_ZONE0,
    cta: "Get the Zone 0 Kit",
    accent: RUST,
    bullets: [
      "The Zone 0 method in plain language — what it means to treat your kitchen as a system",
      "Printable pantry inventory worksheet — audit what you have before you buy anything",
      "Rotation tracker — a simple FIFO log you can stick to the inside of a cabinet door",
      "30-day jar kitchen starter plan — one action per week, no overwhelm",
      "The 'what to preserve when' seasonal guide for Northwestern Ontario",
      /* BOBBIE: add any additional items that are actually in the kit */
    ],
  },
  {
    id: "prep-pack",
    label: "Digital Kit · $17 CAD",
    name: "Preparedness Pack",
    price: "$17",
    origin: "The second layer — once Zone 0 is running, you build out. Dry storage that doesn't go stale, a freezer system that doesn't fail you, and a plan for when the road closes.",
    href: STRIPE_PREP_PACK,
    cta: "Get the Preparedness Pack",
    accent: RUST,
    bullets: [
      "Dry storage guide — what stores well for 12+ months, what doesn't, and why",
      "Freezer inventory system — know what's in there without digging",
      "The 72-hour exit layer worksheet — build both packs, check both packs, know when to open them",
      "Power-outage protocol — what to cook first, in what order, to minimize loss",
      "Northern Ontario road-closure checklist — specific to being hours from the nearest distribution centre",
      /* BOBBIE: add any additional items that are actually in the pack */
    ],
  },
  {
    id: "jars-scars",
    label: "Book · $27 CAD",
    name: "Jars & Scars — Founding Edition",
    price: "$27",
    origin: "The book Bobbie wished existed when she started. Not a canning manual — there are plenty of those. A book about what it actually takes to build a food life in a northern place, over years, when no one is watching.",
    href: STRIPE_JARS_SCARS,
    cta: "Get Jars & Scars",
    accent: FOREST,
    bullets: [
      /* BOBBIE: fill in — these are placeholder chapter names. Replace with the actual 8 chapters. */
      "Chapter 1: The Jar as Infrastructure — why a mason jar is a political statement",
      "Chapter 2: Zone 0 Before Anything Else — the kitchen is the homestead's heart",
      "Chapter 3: What the Garden Teaches About Failure",
      "Chapter 4: Sourcing in the North — suppliers, farm networks, the buying club that became a co-op",
      "Chapter 5: Pricing What You Make — honest cost, honest margin, honest price",
      "Chapter 6: The 72-Hour Test — two packs, one rule, no regret",
      "Chapter 7: Scars — what didn't work and what that taught me",
      "Chapter 8: The Long Game — building a food life that outlasts the emergency",
    ],
    note: "Founding edition: the price is $27 now. It goes up when the revision is done. Founding edition buyers get the update free.",
  },
];

function ProductCard({
  product,
}: {
  product: typeof DIGITAL_PRODUCTS[number];
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(31,61,46,0.08)",
        borderTop: `4px solid ${product.accent}`,
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
            marginBottom: "0.6rem",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: product.accent,
                fontWeight: 700,
                marginBottom: "0.2rem",
              }}
            >
              {product.label}
            </p>
            <h2
              style={{
                fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
                fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
                fontWeight: 800,
                color: EVERGREEN,
                lineHeight: 1.15,
              }}
            >
              {product.name}
            </h2>
          </div>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.2rem, 3.5vw, 1.55rem)",
              fontWeight: 900,
              color: product.price === "Free" ? FOREST : product.accent,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            {product.price}
          </span>
        </div>

        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "0.82rem",
            color: MUTED,
            lineHeight: 1.6,
            fontStyle: "italic",
            marginBottom: "0.85rem",
            borderLeft: `2px solid ${product.accent}`,
            paddingLeft: "0.75rem",
          }}
        >
          {product.origin}
        </p>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 1.1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
          }}
        >
          {product.bullets.map((b) => (
            <li
              key={b}
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "flex-start",
                fontSize: "0.81rem",
                color: INK,
                lineHeight: 1.55,
              }}
            >
              <span style={{ color: product.accent, flexShrink: 0, fontFamily: "var(--font-serif)" }}>→</span>
              {b}
            </li>
          ))}
        </ul>

        {"note" in product && product.note && (
          <p
            style={{
              fontSize: "0.75rem",
              color: MUTED,
              fontStyle: "italic",
              lineHeight: 1.5,
              marginBottom: "1rem",
              background: `${product.accent}0d`,
              borderRadius: 4,
              padding: "0.5rem 0.75rem",
            }}
          >
            {product.note}
          </p>
        )}

        <a
          href={product.href}
          target={product.href.startsWith("http") ? "_blank" : undefined}
          rel={product.href.startsWith("http") ? "noreferrer" : undefined}
          style={{
            display: "inline-block",
            background: product.accent,
            color: "white",
            fontFamily: "var(--font-sans)",
            fontSize: "0.88rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            padding: "0.65rem 1.25rem",
            borderRadius: 6,
            textDecoration: "none",
          }}
        >
          {product.cta}
        </a>
      </div>
    </div>
  );
}

export function HeadwatersProductsPage() {
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
            lineHeight: 1.6,
          }}
        >
          <strong>Stripe links not yet live.</strong> Replace the following constants in{" "}
          <code>HeadwatersProductsPage.tsx</code> with real Stripe Payment Link URLs from{" "}
          <a
            href="https://dashboard.stripe.com/payment-links"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#92400e", textDecoration: "underline" }}
          >
            dashboard.stripe.com/payment-links
          </a>
          :{" "}
          {STRIPE_MISSING.map((p, i) => (
            <span key={p.key}>
              <code>{p.key}</code> ({p.label}){i < STRIPE_MISSING.length - 1 ? ", " : "."}
            </span>
          ))}{" "}
          This banner disappears automatically once all links are replaced.
        </div>
      )}

      {/* ── Header ── */}
      <header style={{ background: EVERGREEN, padding: "2.5rem 1.5rem 2rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(244,237,224,0.5)",
              marginBottom: "0.5rem",
            }}
          >
            Parr's Jars · Headwaters
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
              fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
              fontWeight: 900,
              color: CREAM,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "0.6rem",
            }}
          >
            Start where you are.
            <br />
            Use what you have.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(0.88rem, 2.4vw, 1rem)",
              color: "rgba(244,237,224,0.7)",
              lineHeight: 1.65,
              maxWidth: 520,
            }}
          >
            Everything here was built in a jar kitchen in Wabigoon, Ontario. No fluff. Pay once and
            what you get is yours.{" "}
            <a href={START_URL} style={{ color: "rgba(244,237,224,0.5)", textDecoration: "underline" }}>
              New here? Start at /headwaters/start →
            </a>
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2.5rem 1.25rem" }}>

        {/* ── PJ Solutions Kit — Featured ── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.62rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: EVERGREEN,
              fontWeight: 700,
              marginBottom: "1.1rem",
            }}
          >
            Flagship Kit
          </p>
          <a
            href="/parrsjars/kit"
            style={{ textDecoration: "none", display: "block" }}
          >
            <div
              style={{
                background: "#141414",
                borderRadius: 8,
                overflow: "hidden",
                borderTop: `4px solid ${RUST}`,
                padding: "1.75rem 1.5rem",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div>
                  <p style={{ fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, fontWeight: 700, marginBottom: "0.25rem" }}>
                    Digital Kit · Parr's Jars
                  </p>
                  <h2
                    style={{
                      fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
                      fontSize: "clamp(1.2rem, 3.5vw, 1.55rem)",
                      fontWeight: 900,
                      color: "white",
                      lineHeight: 1.15,
                    }}
                  >
                    PJ Solutions Kit
                  </h2>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.3rem, 4vw, 1.75rem)",
                    fontWeight: 900,
                    color: RUST,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  $97
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "0.85rem",
                  color: "#aaa",
                  lineHeight: 1.65,
                  fontStyle: "italic",
                  marginBottom: "1rem",
                  borderLeft: `2px solid ${RUST}`,
                  paddingLeft: "0.75rem",
                }}
              >
                Everything Bobbie learned from 2012–2023 — 5 modules, 20+ handouts, covering water-bath canning, pressure canning, blanching & freezing, and cooking from your pantry year-round.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.25rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {[
                  "Water-bath canning — pickles, salsa, tomatoes, jams",
                  "Pressure canning — meat, broth, potatoes, fish, vegetables",
                  "Blanching, freezing & dehydrating cheat sheets",
                  "Cooking with preserves — local recipes & pantry meal planning",
                  "The system — food audit, rotation, seasonal planning",
                ].map((b) => (
                  <li key={b} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", fontSize: "0.8rem", color: "#ccc", lineHeight: 1.5 }}>
                    <span style={{ color: RUST, flexShrink: 0 }}>→</span>
                    {b}
                  </li>
                ))}
              </ul>
              <span
                style={{
                  display: "inline-block",
                  background: RUST,
                  color: "white",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  padding: "0.65rem 1.25rem",
                  borderRadius: 6,
                  textDecoration: "none",
                }}
              >
                See the full kit →
              </span>
            </div>
          </a>
        </section>

        {/* ── Digital products ── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.62rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: RUST,
              fontWeight: 700,
              marginBottom: "1.1rem",
            }}
          >
            Free &amp; Digital
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {DIGITAL_PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* ── Bundle ── */}
        <section
          style={{
            background: RUST,
            borderRadius: 8,
            padding: "1.4rem 1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
              fontWeight: 700,
              marginBottom: "0.4rem",
            }}
          >
            Bundle
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.2,
              marginBottom: "0.4rem",
            }}
          >
            Zone 0 Kit + Preparedness Pack
          </h2>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.88rem",
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.55,
              marginBottom: "1rem",
            }}
          >
            Both layers together — Zone 0 active pantry and the preparedness layer — for{" "}
            <strong style={{ color: "white" }}>$27 CAD</strong> (save $7 vs. buying separately).
            The complete two-layer starting point.
          </p>
          <a
            href={STRIPE_BUNDLE}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              background: "white",
              color: RUST,
              fontFamily: "var(--font-sans)",
              fontSize: "0.88rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              padding: "0.65rem 1.25rem",
              borderRadius: 6,
              textDecoration: "none",
            }}
          >
            Get the bundle — $27
          </a>
        </section>

        {/* ── Course 1 ── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.62rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: RUST,
              fontWeight: 700,
              marginBottom: "1.1rem",
            }}
          >
            Course
          </p>
          <div
            style={{
              background: "white",
              borderRadius: 8,
              borderTop: `4px solid ${EVERGREEN}`,
              boxShadow: "0 1px 4px rgba(31,61,46,0.08)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "1.4rem 1.5rem 0.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  marginBottom: "0.6rem",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: EVERGREEN,
                      fontWeight: 700,
                      marginBottom: "0.2rem",
                    }}
                  >
                    10-session course · Founding edition
                  </p>
                  <h2
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
                      fontWeight: 800,
                      color: EVERGREEN,
                      lineHeight: 1.15,
                    }}
                  >
                    Course 1 — Food Preservation &amp; Canning
                  </h2>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(1.2rem, 3.5vw, 1.55rem)",
                      fontWeight: 900,
                      color: EVERGREEN,
                    }}
                  >
                    $97
                  </span>
                  <p style={{ fontSize: "0.65rem", color: MUTED, marginTop: "0.1rem" }}>
                    CAD · one-time · founding price
                  </p>
                </div>
              </div>

              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "0.88rem",
                  color: MUTED,
                  lineHeight: 1.65,
                  fontStyle: "italic",
                  borderLeft: `2px solid ${EVERGREEN}`,
                  paddingLeft: "0.75rem",
                  marginBottom: "1.1rem",
                }}
              >
                {/* BOBBIE: fill in — why is it $97 now? What's the founding-edition story? Why will it be more later? */}
                The founding-edition price is $97. This is what it costs while the course is in its first run —
                before the full library of recorded sessions is finished and packaged. Founding students get
                access as sessions release, and they get the complete course free when it's done.
              </p>
            </div>

            {/* Session list */}
            <div style={{ padding: "0 1.5rem 1.5rem" }}>
              <p
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: MUTED,
                  fontWeight: 700,
                  marginBottom: "0.75rem",
                }}
              >
                Session outline
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {COURSE1_SESSIONS.map((s) => (
                  <div
                    key={s.n}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2rem 1fr",
                      gap: "0.75rem",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.62rem",
                        color: MUTED,
                        fontWeight: 700,
                      }}
                    >
                      {s.n}
                    </span>
                    <div>
                      <span
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: EVERGREEN,
                        }}
                      >
                        {s.title}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "0.8rem",
                          color: MUTED,
                          marginLeft: "0.4rem",
                          lineHeight: 1.5,
                        }}
                      >
                        — {s.sub}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: "1.25rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(31,61,46,0.1)",
                }}
              >
                <a
                  href={STRIPE_COURSE1}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    background: EVERGREEN,
                    color: "white",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    padding: "0.7rem 1.4rem",
                    borderRadius: 6,
                    textDecoration: "none",
                  }}
                >
                  Join Course 1 — $97 founding price
                </a>
              </div>
            </div>
          </div>

          {/* Courses 2 & 3 tease */}
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.9rem 1.1rem",
              background: "rgba(31,61,46,0.06)",
              borderRadius: 6,
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { name: "Course 2 — Community Food Systems", status: "Coming 2026" },
              { name: "Course 3 — Running a Buying Club or Co-op", status: "Coming 2027" },
            ].map((c) => (
              <div key={c.name} style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", fontWeight: 700, color: EVERGREEN }}>
                  {c.name}
                </p>
                <p style={{ fontSize: "0.72rem", color: MUTED, fontStyle: "italic" }}>{c.status}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Physical products ── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.62rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: RUST,
              fontWeight: 700,
              marginBottom: "1.1rem",
            }}
          >
            Physical — Salts &amp; Seasonings
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Green Salt */}
            <div
              style={{
                background: "white",
                borderRadius: 8,
                borderTop: `4px solid ${FOREST}`,
                boxShadow: "0 1px 4px rgba(31,61,46,0.08)",
                padding: "1.4rem 1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "0.6rem",
                }}
              >
                <div>
                  <p style={{ fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: FOREST, fontWeight: 700, marginBottom: "0.2rem" }}>
                    Physical · 100 g jar
                  </p>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.1rem, 3vw, 1.35rem)", fontWeight: 800, color: EVERGREEN, lineHeight: 1.15 }}>
                    The Green Salt
                  </h2>
                </div>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.1rem, 3vw, 1.35rem)", fontWeight: 900, color: FOREST }}>
                  {/* BOBBIE: confirm price */}$12
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "0.88rem",
                  color: MUTED,
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  borderLeft: `2px solid ${FOREST}`,
                  paddingLeft: "0.75rem",
                  marginBottom: "0.85rem",
                }}
              >
                The jar kitchen runs on a principle: if the season gives abundance, preserve it. The
                freeze-dryer in the back of the kitchen handles the excess — microgreens that grew
                faster than we could eat them, tomatoes that split in the heat, greens that peaked
                on a Tuesday when there was no market. The Green Salt is what happens when you fold
                that preserved abundance into smoked Himalayan salt. Smoked, blended, and jarred.
                It tastes like the season it came from because it still carries it.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {[
                  "Smoked Himalayan salt + freeze-dried microgreens + homegrown tomato powder",
                  "No fillers, no anti-caking agents — what you see in the jar is what's in the jar",
                  "Works anywhere you'd use smoked paprika — eggs, roasted vegetables, finished meat",
                  /* BOBBIE: add any other specifics about the Green Salt sourcing or blend */
                ].map((b) => (
                  <li key={b} style={{ display: "flex", gap: "0.5rem", fontSize: "0.81rem", color: INK, lineHeight: 1.55 }}>
                    <span style={{ color: FOREST, fontFamily: "var(--font-serif)", flexShrink: 0 }}>→</span>
                    {b}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:bobbie@ourheadwaters.ca?subject=Order%20—%20The%20Green%20Salt"
                style={{
                  display: "inline-block",
                  background: FOREST,
                  color: "white",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  padding: "0.65rem 1.25rem",
                  borderRadius: 6,
                  textDecoration: "none",
                }}
              >
                Order by email
              </a>
            </div>

            {/* The Salty Onion */}
            <div
              style={{
                background: "white",
                borderRadius: 8,
                borderTop: `4px solid ${GOLD}`,
                boxShadow: "0 1px 4px rgba(31,61,46,0.08)",
                padding: "1.4rem 1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "0.6rem",
                }}
              >
                <div>
                  <p style={{ fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, fontWeight: 700, marginBottom: "0.2rem" }}>
                    Physical · 80 g jar
                  </p>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.1rem, 3vw, 1.35rem)", fontWeight: 800, color: EVERGREEN, lineHeight: 1.15 }}>
                    The Salty Onion
                  </h2>
                </div>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.1rem, 3vw, 1.35rem)", fontWeight: 900, color: GOLD }}>
                  {/* BOBBIE: confirm price */}$12
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "0.88rem",
                  color: MUTED,
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  borderLeft: `2px solid ${GOLD}`,
                  paddingLeft: "0.75rem",
                  marginBottom: "0.85rem",
                }}
              >
                Walls Farm grows onions the way onions are supposed to be grown — in ground, in
                season, harvested when they're ready. The problem was that the grocery store wouldn't
                buy more than a fraction of the yield. The rest was going to waste. Freeze-drying
                locks what's in the onion at the moment of harvest — the sweetness, the depth, the
                thing that supermarket onion powder lost somewhere in the processing chain. The Salty
                Onion is Walls Farm onions, garden greens from the homestead, ground into a blend
                that tastes like it came from somewhere specific. Because it did.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {[
                  "Freeze-dried onion from Walls Farm + homestead garden greens",
                  "No fillers — 80 g is all product, no flow agents",
                  "Works wherever you'd use onion powder — soups, rubs, dressings, eggs",
                  "Best seller at the Dryden Farmers Market",
                ].map((b) => (
                  <li key={b} style={{ display: "flex", gap: "0.5rem", fontSize: "0.81rem", color: INK, lineHeight: 1.55 }}>
                    <span style={{ color: GOLD, fontFamily: "var(--font-serif)", flexShrink: 0 }}>→</span>
                    {b}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:bobbie@ourheadwaters.ca?subject=Order%20—%20The%20Salty%20Onion"
                style={{
                  display: "inline-block",
                  background: GOLD,
                  color: "white",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  padding: "0.65rem 1.25rem",
                  borderRadius: 6,
                  textDecoration: "none",
                }}
              >
                Order by email
              </a>
            </div>
          </div>
        </section>

        {/* ── PJ Solutions Consulting ── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.62rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: RUST,
              fontWeight: 700,
              marginBottom: "1.1rem",
            }}
          >
            Consulting
          </p>
          <div
            style={{
              background: "white",
              borderRadius: 8,
              borderTop: `4px solid ${EVERGREEN}`,
              boxShadow: "0 1px 4px rgba(31,61,46,0.08)",
              padding: "1.4rem 1.5rem",
            }}
          >
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: EVERGREEN, fontWeight: 700, marginBottom: "0.25rem" }}>
              PJ Solutions — Parr's Jars Consulting
            </p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.1rem, 3vw, 1.35rem)", fontWeight: 800, color: EVERGREEN, lineHeight: 1.15, marginBottom: "0.85rem" }}>
              For producers who've outgrown the kitchen table.
            </h2>

            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "0.88rem",
                color: INK,
                lineHeight: 1.7,
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <p>
                <strong>Who it's for:</strong> Northern Ontario food producers, buying clubs, and
                early co-ops who are hitting the limits of what they can figure out alone. You're
                growing more than you can sell, or selling more than you can grow, or trying to
                structure a buying group that keeps ending in a spreadsheet nobody updates.
              </p>
              <p>
                <strong>What an engagement looks like:</strong> A short engagement (1–2 weeks) starts
                with a scope call — Bobbie needs to understand the specific problem before quoting
                anything. From there: a fixed-fee agreement, a defined deliverable (a pricing model,
                a buying club structure, a preservation plan, a product line audit), and delivery.
                No retainer, no ongoing billing, no consultant in the room after the work is done.
              </p>
              <p>
                <strong>What the outcome is:</strong> A document, a plan, or a system you can run
                without help. The goal of every PJ Solutions engagement is for Bobbie to not be
                needed anymore. If the work is done right, you can explain it to someone else, and
                they can run it.
              </p>
              {/* BOBBIE: add any specific examples of past engagements if you're comfortable — anonymized is fine */}
            </div>

            <a
              href="mailto:bobbie@ourheadwaters.ca?subject=PJ%20Solutions%20inquiry"
              style={{
                display: "inline-block",
                background: EVERGREEN,
                color: "white",
                fontFamily: "var(--font-sans)",
                fontSize: "0.88rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                padding: "0.65rem 1.25rem",
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              Start with an email
            </a>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: `3px solid ${EVERGREEN}`,
          background: CREAM,
          padding: "1.75rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", color: MUTED, lineHeight: 1.65, marginBottom: "0.4rem" }}>
            Bobbie Parr · Parr's Jars · Wabigoon, Ontario ·{" "}
            <a href="https://parrsjars.ca" style={{ color: RUST, textDecoration: "none" }}>parrsjars.ca</a>
          </p>
          <a href="mailto:bobbie@ourheadwaters.ca" style={{ fontSize: "0.82rem", color: RUST, textDecoration: "none", fontWeight: 600 }}>
            bobbie@ourheadwaters.ca
          </a>
          <p style={{ fontSize: "0.68rem", color: MUTED, marginTop: "0.6rem", fontStyle: "italic" }}>
            All prices CAD · digital products delivered by email · physical products available at the Dryden Farmers Market or by arrangement
          </p>
        </div>
      </footer>
    </div>
  );
}
