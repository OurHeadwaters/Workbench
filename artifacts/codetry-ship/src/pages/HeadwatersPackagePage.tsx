const EVERGREEN = "#1f3d2e";
const RUST = "#b85a3e";
const CREAM = "#f4ede0";
const MUTED = "#6b7c6e";
const GOLD = "#d4a017";
const INK = "#2a2a2a";

const base = import.meta.env.BASE_URL;

const START_URL = `${base}headwaters/start`;
const PRODUCTS_URL = `${base}headwaters/products`;
const PANTRY_URL   = `${base}suite/northern-pantry`;

type PackageItem = {
  name: string;
  format: string;
  price: string;
  color: string;
  what: string[];
};

const DIGITAL_ITEMS: PackageItem[] = [
  {
    name: "Zone 0 Starter Kit",
    format: "PDF · digital download",
    price: "$17",
    color: EVERGREEN,
    what: [
      "72-hour family supply checklist calibrated for NWO winters",
      "Water storage calculator (litres, not gallons)",
      "Power outage protocol for rural freeze-risk households",
      "First two weeks of pantry rotation to build on",
    ],
  },
  {
    name: "Preparedness Pack",
    format: "PDF · digital download",
    price: "$17",
    color: "#2e5a3f",
    what: [
      "Full seasonal extension beyond the Zone 0 72-hour window",
      "NWO-specific supply list — what actually ships here, what doesn't",
      "Bulk buying guide by category",
      "Budget tracker template for building out over 3–6 months",
    ],
  },
  {
    name: "Zone 0 + Preparedness Bundle",
    format: "Both kits together",
    price: "$27 (save $7)",
    color: "#1B5E8A",
    what: [
      "Everything from Zone 0 Starter Kit",
      "Everything from the Preparedness Pack",
      "One payment, two kits, immediate download",
    ],
  },
  {
    name: "Jars & Scars — Founding Edition",
    format: "Book · 8 chapters",
    price: "$27",
    color: RUST,
    what: [
      "How Parr's Jars became what it is — the real story",
      "Chapter 3: The Jar Kitchen Economics model",
      "Chapter 5: Pricing what you make — honest cost, honest margin",
      "Chapter 7: What the co-op changed and what it didn't",
      "Founding-edition price: goes up when the revision is done. Founding buyers get the update free.",
    ],
  },
  {
    name: "Course 1: Build Your Jar Kitchen Economy",
    format: "10-session online course",
    price: "$97 founding price",
    color: "#7c3d2e",
    what: [
      "Session 1: The four-bucket model — where every dollar goes",
      "Session 2: Reading your real cost of production",
      "Session 3: Pricing for market, wholesale, and CSA",
      "Sessions 4–6: Seasonal cash maps for NWO",
      "Sessions 7–10: The co-op layer — joining, starting, operating",
      "Founding cohort runs live; recordings become the permanent course",
    ],
  },
];

const FREE_ITEMS: PackageItem[] = [
  {
    name: "The Northern Pantry — 3 Layers of Food Security",
    format: "Printable worksheet · 8.5×11",
    price: "Free",
    color: MUTED,
    what: [
      "Layer 1: The fridge / freezer / pantry cycle (this week's food)",
      "Layer 2: The short-term store (2–12 week buffer)",
      "Layer 3: The long store — Pack A and Pack B, side by side",
      "NWO-specific item lists, write-in lines, check boxes",
      "The rule about when to open the packs",
    ],
  },
];

const EMAIL_SEQUENCE: { day: string; subject: string; what: string }[] = [
  { day: "Day 0",  subject: "You're in. Here's what happens next.",
    what: "Northern Pantry download link + what to do this week" },
  { day: "Day 2",  subject: "The mistake most people make in week one",
    what: "The bulk-buy trap and why buying boring is the real discipline" },
  { day: "Day 5",  subject: "The thing in your freezer that will fail you",
    what: "Power outage protocol and the test Bobbie runs every fall" },
  { day: "Day 8",  subject: "What a jar of pickled beets actually costs",
    what: "Real cost-of-production math on a common NWO preserve" },
  { day: "Day 11", subject: "The 807 model — what happens when neighbours do this together",
    what: "How a co-op changes individual food security in a northern town" },
  { day: "Day 14", subject: "The gap between 72 hours and a real winter",
    what: "Bridge to the Preparedness Pack — what comes after Zone 0" },
  { day: "Day 18", subject: "The moment I knew this was bigger than the jars",
    what: "Bobbie's story — the Wabigoon decision and what it cost" },
  { day: "Day 21", subject: "One more thing before I let you go",
    what: "Founding-edition course offer and what it means to be in the first cohort" },
];

const SUGGESTIONS: { heading: string; items: string[] }[] = [
  {
    heading: "From your own kitchen",
    items: [
      "A one-page 'seasonal harvest window' for Wabigoon — what comes in and when, so people know what to put up and when",
      "Your top 5 jars (with honest notes — what worked, what you'd change, what sells)",
      "A handwritten recipe card (or photo of one) — salts, maple, pickles, whatever is the thing you'd give a friend",
      "Your canning failure story — the one where you learned something real. It matters more than a success story here.",
    ],
  },
  {
    heading: "Place and land",
    items: [
      "A photo of Wabigoon Lake or the jar kitchen or the market table — one real image that puts someone in the place",
      "A short Treaty 3 land acknowledgment written in your own voice, not a template",
      "A local foraging note: two or three things that grow on Treaty 3 land that belong in this kind of pantry",
      "The water note — Lake of the Woods water, freeze-up dates, how you store water through a Wabigoon winter",
    ],
  },
  {
    heading: "For people who want more access",
    items: [
      "A discount code for a physical jar — something they can order and have mailed if they're not in NWO",
      "A short 'ask me anything' slot — one email, a real answer, for anyone who buys the full kit",
      "A 'local pick-up' note for people within driving distance of Wabigoon",
      "A referral to a nearby grower or market if you know someone in their region doing similar work",
    ],
  },
  {
    heading: "Community and co-op layer",
    items: [
      "A two-paragraph plain-language explainer of how the 807 Food Co-op works and how someone joins",
      "A 'founding member' note — what it meant to be one of the first 142, and what that number represents now",
      "A short note about what the Deer Lake connection is — why this work extends to remote northern communities",
    ],
  },
  {
    heading: "For PACE and referral contexts",
    items: [
      "A single paragraph in your own words: 'this is who this is for and who it isn't for'",
      "A two-sentence PACE bridge note — something like 'if cost is a barrier, ask your PACE advisor about bridge financing for small engagements'",
      "A follow-up contact option: a real email address, not a form, for people who want to talk before they buy",
    ],
  },
];

export default function HeadwatersPackagePage() {
  return (
    <div style={{ background: CREAM, minHeight: "100vh", fontFamily: "Georgia, serif" }}>

      {/* ── Header ── */}
      <div style={{ background: EVERGREEN, padding: "2.5rem 1.5rem 2rem" }}>
        <div style={{ maxWidth: "44rem", margin: "0 auto" }}>
          <p style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(244,237,224,0.5)",
            marginBottom: "0.6rem",
          }}>
            Headwaters Development Services · Package Overview
          </p>
          <h1 style={{
            fontSize: "clamp(1.75rem, 5vw, 2.6rem)",
            fontWeight: 800,
            color: CREAM,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
          }}>
            Everything in the full package
          </h1>
          <p style={{
            fontSize: "1.05rem",
            color: "rgba(244,237,224,0.75)",
            lineHeight: 1.65,
            fontStyle: "italic",
            maxWidth: "36rem",
            marginBottom: "1.25rem",
          }}>
            Five digital products, an eight-email course, and one printable worksheet — plus a list of personal additions you can fold in to make it yours.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <a href={START_URL} style={linkChipStyle("#b85a3e")}>Self-serve page →</a>
            <a href={PRODUCTS_URL} style={linkChipStyle("rgba(244,237,224,0.18)")}>Full product detail →</a>
            <a href={PANTRY_URL} style={linkChipStyle("rgba(244,237,224,0.18)")}>Northern Pantry printable →</a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "44rem", margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>

        {/* ── Digital products ── */}
        <SectionLabel color={EVERGREEN}>Paid digital products</SectionLabel>

        {DIGITAL_ITEMS.map((item) => (
          <ProductCard key={item.name} item={item} />
        ))}

        {/* ── Free ── */}
        <SectionLabel color={MUTED}>Free — included with the email list</SectionLabel>

        {FREE_ITEMS.map((item) => (
          <ProductCard key={item.name} item={item} />
        ))}

        {/* ── Email sequence ── */}
        <SectionLabel color={EVERGREEN}>The 8-email course (auto-sent after signup)</SectionLabel>

        <div style={{
          border: `1px solid rgba(31,61,46,0.14)`,
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: "2.5rem",
        }}>
          {EMAIL_SEQUENCE.map((email, i) => (
            <div
              key={email.day}
              style={{
                display: "grid",
                gridTemplateColumns: "4rem 1fr",
                gap: "0 1rem",
                padding: "0.75rem 1.1rem",
                borderBottom: i < EMAIL_SEQUENCE.length - 1 ? "1px solid rgba(31,61,46,0.08)" : "none",
                background: i % 2 === 0 ? "white" : CREAM,
                alignItems: "start",
              }}
            >
              <span style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: MUTED,
                paddingTop: "0.15rem",
              }}>
                {email.day}
              </span>
              <div>
                <p style={{ fontSize: "0.9rem", fontWeight: 700, color: INK, marginBottom: "0.2rem" }}>
                  "{email.subject}"
                </p>
                <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.78rem", color: MUTED, lineHeight: 1.5 }}>
                  {email.what}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Physical products ── */}
        <SectionLabel color={MUTED}>Physical products (order by email)</SectionLabel>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}>
          {[
            { name: "Green Salt", desc: "Herbs from Walls Farm, Winnipeg. Bold, versatile. Order by email.", price: "~$12" },
            { name: "The Salty Onion", desc: "Same herb base — designed for savoury cooking and gifting. Order by email.", price: "~$12" },
          ].map((p) => (
            <div key={p.name} style={{
              background: "white",
              border: `1px solid rgba(31,61,46,0.12)`,
              borderRadius: 6,
              padding: "1rem 1.1rem",
            }}>
              <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED, marginBottom: "0.4rem" }}>
                Physical · Parr's Jars
              </p>
              <p style={{ fontSize: "1rem", fontWeight: 700, color: EVERGREEN, marginBottom: "0.4rem" }}>{p.name}</p>
              <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.8rem", color: MUTED, lineHeight: 1.55, marginBottom: "0.5rem" }}>{p.desc}</p>
              <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.85rem", fontWeight: 700, color: INK }}>{p.price} CAD</p>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 2, background: `linear-gradient(to right, ${RUST}, transparent)`, margin: "0.5rem 0 2.5rem" }} />

        {/* ── Personal additions ── */}
        <div style={{ marginBottom: "0.5rem" }}>
          <p style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: RUST,
            marginBottom: "0.5rem",
          }}>
            Personal additions — things you can add to make it yours
          </p>
          <h2 style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            color: EVERGREEN,
            lineHeight: 1.15,
            letterSpacing: "-0.015em",
            marginBottom: "0.6rem",
          }}>
            What's not in the package yet
          </h2>
          <p style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "0.92rem",
            color: MUTED,
            lineHeight: 1.65,
            maxWidth: "36rem",
            marginBottom: "2rem",
          }}>
            The package works as-is. These are the things that would make it unmistakably Wabigoon — the additions that no one else can add because they're specific to you, your land, and your people.
          </p>
        </div>

        {SUGGESTIONS.map((group) => (
          <div key={group.heading} style={{ marginBottom: "2rem" }}>
            <p style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.68rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: GOLD,
              marginBottom: "0.65rem",
              borderBottom: `1px solid rgba(212,160,23,0.2)`,
              paddingBottom: "0.4rem",
            }}>
              {group.heading}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {group.items.map((item) => (
                <li key={item} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <span style={{ color: RUST, fontSize: "0.85rem", lineHeight: 1.6, flexShrink: 0 }}>→</span>
                  <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.88rem", color: INK, lineHeight: 1.65, margin: 0 }}>
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* ── Footer ── */}
        <div style={{
          marginTop: "3rem",
          padding: "1.25rem 1.5rem",
          background: EVERGREEN,
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
        }}>
          <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,237,224,0.5)" }}>
            Start here
          </p>
          <p style={{ fontSize: "1.1rem", fontWeight: 700, color: CREAM, lineHeight: 1.3 }}>
            Everything on this page is available at ourheadwaters.ca/start
          </p>
          <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", color: "rgba(244,237,224,0.65)", lineHeight: 1.55 }}>
            No contract. No account. Scan the QR code on the PACE leave-behind, pay once, and the tools are yours.
          </p>
          <a href={START_URL} style={{
            display: "inline-block",
            marginTop: "0.25rem",
            padding: "0.55rem 1.25rem",
            background: RUST,
            color: "white",
            fontFamily: "system-ui, sans-serif",
            fontSize: "0.82rem",
            fontWeight: 700,
            borderRadius: 5,
            textDecoration: "none",
            letterSpacing: "0.04em",
            alignSelf: "flex-start",
          }}>
            Go to the self-serve page →
          </a>
        </div>

      </div>
    </div>
  );
}

function SectionLabel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <p style={{
      fontFamily: "system-ui, sans-serif",
      fontSize: "0.65rem",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color,
      marginBottom: "0.85rem",
      marginTop: "0.25rem",
      borderBottom: `1px solid ${color}22`,
      paddingBottom: "0.4rem",
    }}>
      {children}
    </p>
  );
}

function ProductCard({ item }: { item: PackageItem }) {
  return (
    <div style={{
      border: `1px solid rgba(31,61,46,0.13)`,
      borderLeft: `4px solid ${item.color}`,
      borderRadius: "0 6px 6px 0",
      background: "white",
      padding: "1rem 1.1rem",
      marginBottom: "0.85rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.55rem" }}>
        <p style={{ fontSize: "1rem", fontWeight: 800, color: item.color, lineHeight: 1.2 }}>
          {item.name}
        </p>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.98rem", fontWeight: 800, color: INK }}>
            {item.price}
          </span>
          <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", color: MUTED, marginLeft: "0.4rem" }}>
            {item.format}
          </span>
        </div>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        {item.what.map((line) => (
          <li key={line} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
            <span style={{ color: item.color, fontSize: "0.75rem", lineHeight: 1.7, flexShrink: 0 }}>·</span>
            <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", color: MUTED, lineHeight: 1.6 }}>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function linkChipStyle(bg: string): React.CSSProperties {
  return {
    display: "inline-block",
    padding: "0.35rem 0.85rem",
    background: bg,
    color: "white",
    fontFamily: "system-ui, sans-serif",
    fontSize: "0.75rem",
    fontWeight: 600,
    borderRadius: 4,
    textDecoration: "none",
    letterSpacing: "0.03em",
  };
}
