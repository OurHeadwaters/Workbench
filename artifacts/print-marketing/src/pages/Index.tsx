import { Link } from "wouter";

const pieces = [
  {
    href: "/business-card",
    title: "Business Card",
    label: "Headwaters",
    desc: "3.5×2 in two-sided card. Front: dark evergreen with wordmark. Back: cream with contact details — email, text-preferred number, web, location. Fill in your phone number before sending to print.",
    icon: "💳",
  },
  {
    href: "/letterhead",
    title: "Letterhead",
    label: "Headwaters",
    desc: "8.5×11 portrait letter template with Headwaters header band, contact block, date/recipient area, ruled body lines, and a signature footer. Print and write, or use as a PDF base.",
    icon: "📄",
  },
  {
    href: "/logo-formats",
    title: "Logo Formats",
    label: "Brand marks",
    desc: "Full wordmark, compact wordmark, and icon mark in light, dark, and rust colourways. Includes the brand palette, typography reference, and usage notes for Square, email, and print.",
    icon: "🏷️",
  },
  {
    href: "/square-setup",
    title: "Square — Update from Parr's Jars to Headwaters",
    label: "Square identity",
    desc: "Copy-paste-ready text for every Square business profile field, plus a step-by-step walkthrough for changing the account name without losing product categories or sales history.",
    icon: "🟦",
  },
  {
    href: "/price-list",
    title: "Price List",
    label: "Parr's Jars",
    desc: "8.5×11 portrait price sheet listing all salts and maple syrup with market and wholesale pricing. Hand this out at farmers markets or leave it with wholesale buyers.",
    icon: "📋",
  },
  {
    href: "/market-display",
    title: "Farmers Market Display Card",
    label: "Parr's Jars",
    desc: "Bold, large-type display card for salts and maple syrup — designed to be readable across a market table. Prints at 8.5×11.",
    icon: "🏪",
  },
  {
    href: "/poster-parrs-jars",
    title: "Poster — Parr's Jars Products",
    label: "Promotional",
    desc: "Full-bleed promotional poster showcasing the Parr's Jars salt and maple syrup line. Hand-crafted feel with the Rust & Evergreen palette.",
    icon: "🧂",
  },
  {
    href: "/poster-services",
    title: "Poster — Development Services",
    label: "Headwaters",
    desc: "Clean professional poster summarising the three Headwaters service lines, the $25k / 8-week trial offer, and a call to action — aimed at band councils and contractor audiences.",
    icon: "🏗️",
  },
  {
    href: "/poster-market",
    title: "Poster — Combined Market Presence",
    label: "Community",
    desc: '"Find us at the market" poster combining Parr\'s Jars and the Headwaters tagline. Directs people to the website and market schedule. Useful for community boards and hallways.',
    icon: "📌",
  },
  {
    href: "/vocabulary",
    title: "Core Vocabulary — Codetry Handbook",
    label: "Handbook",
    desc: "Print-ready one-pager defining the eleven core terms of the Headwaters vocabulary: constellation, primitive, zone, The Standby, resting/activated state, The Gate, bright side, massity, refused, both-states, both-sides. Forward it, pin it, hand it out.",
    icon: "📖",
  },
];

export default function Index() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <div style={{ background: "var(--evergreen)", color: "white", padding: "3rem 2rem 2.5rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7, marginBottom: "0.6rem" }}>
            Headwaters Development Services
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.6rem", fontWeight: 700, lineHeight: 1.15, marginBottom: "0.75rem" }}>
            Print Marketing Suite
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", opacity: 0.82, maxWidth: 520, lineHeight: 1.6 }}>
            Print-ready materials for Parr's Jars and Headwaters Development Services. Open any piece, then use your browser's Print function to produce a clean, press-ready page.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "2.5rem auto", padding: "0 1.5rem 3rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {pieces.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              style={{ display: "block", background: "white", border: "1px solid rgba(31,61,46,0.12)", borderRadius: 8, padding: "1.25rem 1.5rem", textDecoration: "none", color: "inherit", transition: "box-shadow 0.15s, border-color 0.15s", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <span style={{ fontSize: "1.8rem", lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{p.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)" }}>{p.title}</h2>
                    <span style={{ background: "var(--cream)", color: "var(--muted)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.15rem 0.5rem", borderRadius: 3 }}>{p.label}</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.55 }}>{p.desc}</p>
                </div>
                <span style={{ color: "var(--evergreen-light)", fontSize: "1.2rem", flexShrink: 0, marginTop: 2 }}>→</span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: "2rem", padding: "1rem 1.25rem", background: "rgba(31,61,46,0.06)", borderRadius: 6, fontFamily: "var(--font-sans)", fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--evergreen)" }}>Printing tip:</strong> Open any piece and click the <strong>Print</strong> button. In your browser print dialog, set paper to Letter, margins to Default or Minimum, and enable "Background graphics" for full-colour output.
        </div>
      </div>
    </div>
  );
}
