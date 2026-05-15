import { Link } from "wouter";
import { useState } from "react";
import { downloadAsPdf } from "@/lib/pdf";
import { CodetryIntroLetterPage } from "./CodetryIntroLetter";
import { CodetryFundingBriefPage } from "./CodetryFundingBrief";
import { CodetryOnePagerPage } from "./CodetryOnePager";
import { CodetryPilotProposalPage } from "./CodetryPilotProposal";

const mainPieces = [
  {
    href: "/overview",
    title: "Project Overview — All 7 Headwaters Tools",
    label: "Start here",
    desc: "A plain-language visual guide showing what every Headwaters tool does and how they all connect. Open on your phone or print as a one-pager.",
    icon: "🗺️",
    highlight: true,
  },
  {
    href: "/brand",
    title: "Brand Kit",
    label: "Reference",
    desc: "The single source of truth for Headwaters marks, colours, type, and section labels. Marks in three colourways, full palette including Lake Blue, Fraunces + Inter specimens, the filled-bar label system, and voice guidelines. Use this before producing any materials.",
    icon: "🎨",
  },
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
  {
    href: "/salt-of-the-earth-club",
    title: "Salt of the Earth Club",
    label: "Jarista",
    desc: "Product sheet for the Jarista salt line — the Green Salt, the Salty Onion, and seasonal releases. Covers the circular economy origin, the three jar properties, and how to join the club. Leave at the market table or mail with orders.",
    icon: "🧂",
  },
  {
    href: "/going-digital",
    title: "Going Digital — Online Courses",
    label: "Headwaters",
    desc: "A5/letter flyer announcing the five Headwaters online courses: Preservation, Preparedness, Permaculture, Seasonal Living, and Decentralization. Hand out at in-person events, pin on community boards, or include with jar orders.",
    icon: "🌐",
  },
  {
    href: "/rack-card-indigenous",
    title: "Rack Card — Indigenous & Community Orgs",
    label: "Headwaters",
    desc: "4×9 in rack card for band offices, friendship centres, First Nations businesses, and cork boards. Summarises Headwaters community services: co-op platforms, community stores, band council software, and food systems.",
    icon: "📌",
  },
  {
    href: "/capability-statement",
    title: "Capability Statement",
    label: "Headwaters",
    desc: "Print-ready one-pager for procurement packages and first introductions. Covers who Headwaters is, the three service types, the $175/hr trial model, two case studies in brief, and contact details. Letter size (8.5×11).",
    icon: "📋",
  },
  {
    href: "/scope-rate-sheet",
    title: "Scope & Rate Sheet — Community Store Engagement",
    label: "Headwaters",
    desc: "One-page scope document and rate sheet for the northern community store engagement. Six phases, $25,000 fixed or $175/hr, plain-language deliverables. Hand this to a band council to make it easy to say yes. Letter size (8.5×11).",
    icon: "📐",
  },
  {
    href: "/tsp-guest-form",
    title: "TSP Guest Application — Bobbie Parr, Fall 2026",
    label: "Media",
    desc: "Updated Survival Podcast guest submission form for Bobbie's second appearance. Covers the arc from Parr's Jars and the co-op through the Deer Lake store build and the Codetry discipline — with ten suggested questions for Jack. Letter size (8.5×11).",
    icon: "🎙️",
  },
  {
    href: "/cold-trailer-upgrade",
    title: "Cold Trailer Upgrade — 807 Food Co-op",
    label: "807 / Subcontract",
    desc: "Work order and budget document for the 807 Food Co-op cold trailer upgrade. Eight scope items including CoolBot-compatible ACs, heater install, exterior covers, 807 decals, paint touch-ups, and hitch/lights — plus a flooring decision note. $9,995 budget. Letter size (8.5×11).",
    icon: "🚛",
  },
  {
    href: "/deer-lake-partnership",
    title: "Deer Lake — 2027 Partnership Pitch",
    label: "807 × Deer Lake",
    desc: "One-page leave-behind for the Deer Lake First Nation pitch. Covers the 807 Food Co-op partnership, what grants cover (4 positions + truck), the Thunder Bay → Deer Lake route, what 2027 looks like for the community, and the one ask: a letter of support before May 31. Letter size (8.5×11).",
    icon: "🤝",
  },
  {
    href: "/northern-pilot",
    title: "Northern Pilot Pitch",
    label: "Deer Lake Pilot",
    desc: "One-page contractor pitch for the Deer Lake First Nation community store pilot. Three headline pillars (Economic Leakage, A Rising Tide, Grassroots Design), Chief's vision, plain-language food supply note, 7 bullet deliverables, and a flat $25,000 · 6-week engagement. Letter size (8.5×11).",
    icon: "🏔️",
  },
  {
    href: "/gilles-pitch",
    title: "Gilles Pitch — Two Weeks",
    label: "Private",
    desc: "Private one-pager crafted for Gilles: two-week engagement to capture institutional knowledge, document systems, and build a legacy at Deer Lake. May 2026. Letter size (8.5×11).",
    icon: "🤝",
  },
  {
    href: "/pace-referral",
    title: "PACE Referral — NWO Food Businesses",
    label: "Business Development",
    desc: "One-pager designed for PACE to forward to their NWO clients. Frames Headwaters as a practitioner referral — who it's for, the Phase 1 offer ($28,000 · 6–8 weeks · fixed fee), four deliverables, Bobbie's credibility, and a clear CTA. Letter size (8.5×11).",
    icon: "🤝",
  },
  {
    href: "/northern-economic-tools",
    title: "Tools & Training for Northern Economic Systems",
    label: "Working document",
    desc: "A thinking tool — not a final deliverable. Explores how the Codetry workflow discipline (trial-first, bounded scope, transparent pricing, handover as exit) maps onto reserve labour pools, helping hands arrangements, and community work-share. Includes a worked example, five tools it points toward, and open questions.",
    icon: "🛠️",
  },
  {
    href: "/coop-compliance-notice",
    title: "807 Co-op — Financial Statement Compliance Notice (2025)",
    label: "807 Co-op · Compliance",
    desc: "Formal compliance notice addressed to the 807 Food Co-operative Inc. board, dated May 23, 2026. Covers two required actions before the AGM: CPA engagement letter for the 2025 compilation, and confirming the members' waiver extraordinary resolution. Print-ready letter (8.5×11).",
    icon: "📑",
  },
];

const outreachPieces = [
  {
    href: "/nan-outreach-packet",
    title: "NAN Outreach Packet — Download all four documents",
    label: "Aboriginal Outreach",
    desc: "One click produces a single four-page PDF: intro letter → partnership & funding brief → economic development one-pager → pilot proposal outline. Ready to attach to an email. Letter size (8.5×11).",
    icon: "📦",
  },
  {
    href: "/codetry-intro-letter",
    title: "Codetry Intro Letter — NAN",
    label: "Aboriginal Outreach",
    desc: "Warm introduction letter from Bobbie Parr to NAN leadership. Covers Headwaters' background, the Recreation Management / Indigenous Studies foundation, and a direct ask for a meeting. Encloses the three companion documents. Letter size (8.5×11).",
    icon: "✉️",
  },
  {
    href: "/codetry-funding-brief",
    title: "Codetry Partnership & Funding Brief",
    label: "Aboriginal Outreach",
    desc: "Two-column brief explaining what Codetry is, the Working Constellation model, and the ask: a NAN member community or facilitated introduction for a $28,000 six-week pilot. Letter size (8.5×11).",
    icon: "📎",
  },
  {
    href: "/codetry-one-pager",
    title: "Codetry Economic Development One-Pager",
    label: "Aboriginal Outreach",
    desc: "Compact single-page summary of Headwaters' four service lines, the trial-first engagement model, and who Headwaters works with. Designed for first-contact leave-behinds. Letter size (8.5×11).",
    icon: "📊",
  },
  {
    href: "/codetry-pilot-proposal",
    title: "Codetry Pilot Proposal Outline",
    label: "Aboriginal Outreach",
    desc: "Formal four-phase proposal outline for a community store pilot — The Plan, The Build, The Payoff, and The Handoff. Addressed generically to 'your community' for first-contact use. Letter size (8.5×11).",
    icon: "📋",
  },
  {
    href: "/codetry-intro-letter-sandy-lake",
    title: "Codetry Intro Letter — Sandy Lake First Nation",
    label: "Aboriginal Outreach",
    desc: "Personalized introduction letter from Bobbie Parr addressed directly to the Chief and Council of Sandy Lake First Nation. Community-specific language throughout. Letter size (8.5×11).",
    icon: "✉️",
  },
  {
    href: "/codetry-pilot-proposal-sandy-lake",
    title: "Codetry Pilot Proposal — Sandy Lake First Nation",
    label: "Aboriginal Outreach",
    desc: "Personalized four-phase pilot proposal for Sandy Lake First Nation. All 'your community' references replaced with Sandy Lake-specific language across every phase. Letter size (8.5×11).",
    icon: "📋",
  },
];

export default function Index() {
  const [packetLoading, setPacketLoading] = useState(false);

  async function handlePacketDownload() {
    setPacketLoading(true);
    try {
      await downloadAsPdf("nan-packet", "headwaters-nan-outreach-packet.pdf", { paginate: true });
    } finally {
      setPacketLoading(false);
    }
  }

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
            Print-ready materials for Parr's Jars and Headwaters Development Services. Open any piece, click Download PDF, and send straight to your printer or a print shop.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "2.5rem auto", padding: "0 1.5rem 3rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {mainPieces.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              style={{
                display: "block",
                background: (p as any).highlight ? "var(--evergreen)" : "white",
                border: (p as any).highlight ? "none" : "1px solid rgba(31,61,46,0.12)",
                borderRadius: 8,
                padding: "1.25rem 1.5rem",
                textDecoration: "none",
                color: "inherit",
                transition: "box-shadow 0.15s, border-color 0.15s",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <span style={{ fontSize: "1.8rem", lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{p.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 600, color: (p as any).highlight ? "white" : "var(--ink)" }}>{p.title}</h2>
                    <span style={{ background: (p as any).highlight ? "rgba(255,255,255,0.15)" : "var(--cream)", color: (p as any).highlight ? "rgba(255,255,255,0.85)" : "var(--muted)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.15rem 0.5rem", borderRadius: 3 }}>{p.label}</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: (p as any).highlight ? "rgba(255,255,255,0.78)" : "var(--muted)", lineHeight: 1.55 }}>{p.desc}</p>
                </div>
                <span style={{ color: (p as any).highlight ? "rgba(255,255,255,0.7)" : "var(--evergreen-light)", fontSize: "1.2rem", flexShrink: 0, marginTop: 2 }}>→</span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: "2.5rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(31,61,46,0.18)" }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: "var(--evergreen)", whiteSpace: "nowrap" }}>
              Aboriginal Outreach — NAN
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(31,61,46,0.18)" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.55, margin: 0 }}>
              Four-piece packet for NAN leadership — share as a set or hand each one out individually.
            </p>
            <button
              onClick={handlePacketDownload}
              disabled={packetLoading}
              style={{
                background: packetLoading ? "rgba(31,61,46,0.5)" : "var(--evergreen)",
                color: "white",
                border: "none",
                borderRadius: 5,
                padding: "0.45rem 1rem",
                fontFamily: "var(--font-sans)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: packetLoading ? "default" : "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "background 0.15s",
              }}
            >
              {packetLoading ? "⏳ Generating PDF…" : "⬇ Download packet (4 pages)"}
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", borderLeft: "3px solid var(--evergreen)", paddingLeft: "1.25rem" }}>
            {outreachPieces.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                style={{
                  display: "block",
                  background: "white",
                  border: "1px solid rgba(31,61,46,0.12)",
                  borderRadius: 8,
                  padding: "1.25rem 1.5rem",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "box-shadow 0.15s, border-color 0.15s",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <span style={{ fontSize: "1.8rem", lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)" }}>{p.title}</h2>
                      <span style={{ background: "var(--evergreen)", color: "white", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.15rem 0.5rem", borderRadius: 3 }}>{p.label}</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.55 }}>{p.desc}</p>
                  </div>
                  <span style={{ color: "var(--evergreen-light)", fontSize: "1.2rem", flexShrink: 0, marginTop: 2 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "2rem", padding: "1rem 1.25rem", background: "rgba(31,61,46,0.06)", borderRadius: 6, fontFamily: "var(--font-sans)", fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--evergreen)" }}>How to print:</strong> Open any piece and click <strong>Download PDF</strong>. The PDF is sized correctly for the piece — letter (8.5×11) for posters and price lists, 3.5×2 for business cards, 4×9 for the rack card. Send straight to your printer or a print shop.
        </div>

        <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(31,61,46,0.12)", fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)" }}>
          <a href="/print-marketing/privacy" style={{ color: "var(--muted)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
            Privacy policy
          </a>
          {" · "}
          Headwaters Development Services · {new Date().getFullYear()}
        </div>
      </div>

      <div
        id="nan-packet"
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: "8.5in",
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <CodetryIntroLetterPage />
        <CodetryFundingBriefPage />
        <CodetryOnePagerPage />
        <CodetryPilotProposalPage />
      </div>
    </div>
  );
}
