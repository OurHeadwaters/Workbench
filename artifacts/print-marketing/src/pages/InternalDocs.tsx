import { Link } from "wouter";
import { useState, useRef } from "react";
import { downloadAsPdf } from "@/lib/pdf";
import { CodetryIntroLetterPage } from "./CodetryIntroLetter";
import { CodetryFundingBriefPage } from "./CodetryFundingBrief";
import { CodetryOnePagerPage } from "./CodetryOnePager";
import { CodetryPilotProposalPage } from "./CodetryPilotProposal";

const base = import.meta.env.BASE_URL;

function buildPersonalizedUrl(slug: string, community: string): string {
  return `${window.location.origin}${base}${slug}?community=${encodeURIComponent(community)}`;
}

const personalizedDocs = [
  { label: "Intro Letter", slug: "codetry-intro-letter" },
  { label: "Pilot Proposal", slug: "codetry-pilot-proposal" },
];


/* ── Eagle Mark SVG (inlined from public/eagle-mark.svg) ─────────────────── */
function EagleMark({ size = 160 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.81)} viewBox="0 18 192 156" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="95" cy="63" r="52" fill="rgba(212,160,23,0.55)" />
      <path d="M 95,62 C 80,56 60,48 38,40 C 24,35 10,32 4,34 C 14,41 34,47 58,57 C 73,63 87,67 95,69 Z" fill="#EDE9E0"/>
      <path d="M 95,62 C 110,56 130,48 152,40 C 166,35 180,32 186,34 C 176,41 156,47 132,57 C 117,63 103,67 95,69 Z" fill="#EDE9E0"/>
      <ellipse cx="95" cy="68" rx="9" ry="8" fill="#EDE9E0"/>
      <ellipse cx="95" cy="53" rx="7" ry="8" fill="#EDE9E0"/>
      <ellipse cx="96" cy="51" rx="5" ry="5.5" fill="#F5F2EC"/>
      <path d="M 101,52 L 110,55 L 101,58 Z" fill="#d4a017"/>
      <path d="M 89,75 L 86,88 M 95,76 L 95,89 M 101,75 L 104,88" stroke="#EDE9E0" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M 7,35 L 1,27 M 15,32 L 10,23 M 24,30 L 20,21" stroke="#EDE9E0" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M 183,35 L 189,27 M 175,32 L 180,23 M 166,30 L 170,21" stroke="#EDE9E0" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M 28,176 L 32,163 L 37,173 L 43,158 L 49,167 L 55,153 L 62,165 L 69,150 L 76,162 L 84,147 L 91,159 L 95,144 L 99,159 L 106,147 L 114,162 L 121,150 L 128,165 L 134,153 L 140,167 L 146,158 L 152,173 L 157,163 L 162,176 Z" fill="#EDE9E0" opacity="0.22"/>
      {/* Arc below eagle */}
      <path d="M 20,130 Q 95,110 170,130" stroke="rgba(212,160,23,0.6)" strokeWidth="1.5" fill="none" strokeDasharray="4 3"/>
    </svg>
  );
}

/* ── Woodcut-style zone icon SVGs ────────────────────────────────────────── */
function ZoneIcon({ zone, className }: { zone: number; className?: string }) {
  const style: React.CSSProperties = { width: "1.25rem", height: "1.25rem", display: "block", ...(className ? {} : {}) };
  if (zone === 0) return (
    <svg viewBox="0 0 24 24" fill="none" style={style}>
      <rect x="4" y="10" width="16" height="11" rx="1" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="15.5" r="1.8" fill="currentColor" opacity="0.8"/>
      <line x1="12" y1="17.3" x2="12" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  if (zone === 1) return (
    <svg viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M3 17 L6 8 L12 5 L18 8 L21 17 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <line x1="3" y1="17" x2="21" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="12" y1="5" x2="12" y2="17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      <line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
  if (zone === 2) return (
    <svg viewBox="0 0 24 24" fill="none" style={style}>
      <circle cx="9" cy="11" r="5" stroke="currentColor" strokeWidth="1.8" opacity="0.85"/>
      <circle cx="15" cy="11" r="5" stroke="currentColor" strokeWidth="1.8" opacity="0.85"/>
      <path d="M9 20 Q12 17 15 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
  if (zone === 3) return (
    <svg viewBox="0 0 24 24" fill="none" style={style}>
      <line x1="3" y1="3" x2="3" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="21" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="7" x2="21" y2="7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="3" y1="13" x2="10" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="14" y1="13" x2="21" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="3" y1="21" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  if (zone === 4) return (
    <svg viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M9 7.5h6l2 11H7L9 7.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <line x1="12" y1="3" x2="12" y2="7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="9" y1="18.5" x2="8.5" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15" y1="18.5" x2="15.5" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="13" r="2" fill="currentColor" opacity="0.65" stroke="none"/>
    </svg>
  );
  return null;
}

/* ── Zone & document data ────────────────────────────────────────────────── */
const ZONES = [
  {
    n: 0,
    name: "Saltbox",
    subtitle: "Identity & Voice",
    season: "The mark before anything moves.",
    accent: "#b85a3e",
    docs: [
      { href: "/brand", title: "Brand Kit", label: "Reference", desc: "The single source of truth for marks, colours, type, and section labels." },
      { href: "/logo-formats", title: "Logo Formats", label: "Brand marks", desc: "Full wordmark, compact wordmark, and icon mark in three colourways." },
      { href: "/business-card", title: "Business Card", label: "Headwaters", desc: "3.5×2 in two-sided card — dark evergreen front, cream back." },
      { href: "/letterhead", title: "Letterhead", label: "Headwaters", desc: "8.5×11 portrait template with header band and signature footer." },
      { href: "/vocabulary", title: "Core Vocabulary Sheet", label: "Handbook", desc: "The eleven core terms of the Headwaters vocabulary, print-ready." },
    ],
  },
  {
    n: 1,
    name: "The Eave",
    subtitle: "Product & Market",
    season: "What's on the table at the market.",
    accent: "#d4a017",
    docs: [
      { href: "/price-list", title: "Price List", label: "Parr's Jars", desc: "8.5×11 price sheet — salts and maple syrup, market and wholesale." },
      { href: "/market-display", title: "Farmers Market Display Card", label: "Parr's Jars", desc: "Bold, large-type display card readable across a market table." },
      { href: "/poster-parrs-jars", title: "Poster — Parr's Jars Products", label: "Promotional", desc: "Full-bleed promotional poster for the salt and maple syrup line." },
      { href: "/poster-services", title: "Poster — Development Services", label: "Headwaters", desc: "Three service lines, $25k trial offer — aimed at band councils." },
      { href: "/poster-market", title: "Poster — Combined Market Presence", label: "Community", desc: '"Find us at the market" poster combining Parr\'s Jars and Headwaters.' },
      { href: "/salt-of-the-earth-club", title: "Salt of the Earth Club", label: "Jarista", desc: "Product sheet for the Jarista salt line and circular economy origin." },
    ],
  },
  {
    n: 2,
    name: "Both-States",
    subtitle: "Community Outreach",
    season: "Two weathers in one letter.",
    accent: "#2e5a3f",
    docs: [
      { href: "/codetry-intro-letter", title: "Intro Letter — Generic NAN", label: "Aboriginal Outreach", desc: "Warm introduction to NAN leadership with a direct ask for a meeting." },
      { href: "/codetry-intro-letter-sandy-lake", title: "Intro Letter — Sandy Lake", label: "Aboriginal Outreach", desc: "Personalized letter addressed directly to Chief and Council of Sandy Lake." },
      { href: "/codetry-intro-letter-deer-lake", title: "Intro Letter — Deer Lake", label: "Deer Lake", desc: "Highlights the hotel as an asset, 807 supply line, 2027 grants." },
      { href: "/rack-card-indigenous", title: "Rack Card — Indigenous & Community Orgs", label: "Headwaters", desc: "4×9 rack card for band offices, friendship centres, and cork boards." },
      { href: "/going-digital", title: "Going Digital — Online Courses", label: "Headwaters", desc: "A5/letter flyer for the five Headwaters online courses." },
      { href: "/nan-outreach-packet", title: "NAN Outreach Packet (4-page PDF)", label: "Aboriginal Outreach", desc: "One click — full four-page packet: intro → funding brief → one-pager → proposal." },
    ],
  },
  {
    n: 3,
    name: "The Gate",
    subtitle: "Engine & Strategy",
    season: "Write the method down. Hand it off.",
    accent: "#1B5E8A",
    docs: [
      { href: "/engine-one-pager", title: "Economic Engine One-Pager", label: "Lead piece", desc: "Eight problems. Eight engine components. The $28k Phase 1 close." },
      { href: "/capability-statement", title: "Capability Statement", label: "Headwaters", desc: "One-pager for procurement packages — services, engagement model, case studies." },
      { href: "/scope-rate-sheet", title: "Scope & Rate Sheet", label: "Headwaters", desc: "$28,000 flat engagement, six phases, plain-language deliverables." },
      { href: "/codetry-pilot-proposal", title: "Pilot Proposal — Generic", label: "Aboriginal Outreach", desc: "Four-phase proposal outline for a community store pilot." },
      { href: "/codetry-pilot-proposal-sandy-lake", title: "Pilot Proposal — Sandy Lake", label: "Aboriginal Outreach", desc: "Sandy Lake-specific four-phase pilot proposal." },
      { href: "/codetry-pilot-proposal-deer-lake", title: "Pilot Proposal — Deer Lake", label: "Deer Lake", desc: "Deer Lake-specific proposal — hotel audit, 807 grants, 2027 activation." },
      { href: "/codetry-funding-brief", title: "Partnership & Funding Brief — Generic", label: "Aboriginal Outreach", desc: "Two-column brief: what Codetry is, the ask, the model." },
      { href: "/codetry-funding-brief-deer-lake", title: "Partnership & Funding Brief — Deer Lake", label: "Deer Lake", desc: "807 supply chain connection, coordinator as a Deer Lake hire." },
      { href: "/deer-lake-why-now", title: "Why Deer Lake. Why Now.", label: "Deer Lake", desc: "What Deer Lake already has, the 807 flow, and the January 2027 urgency." },
      { href: "/deer-lake-partnership", title: "Deer Lake — 2027 Partnership Pitch", label: "807 × Deer Lake", desc: "Leave-behind: grants, truck route, letter of support by May 31." },
      { href: "/northern-pilot", title: "Northern Pilot Pitch", label: "Deer Lake Pilot", desc: "Three pillars, Chief's vision, $25,000 · 6-week engagement." },
      { href: "/community-finance-brief", title: "Gamified Community Finance Brief", label: "Product brief · 2027", desc: "HWBAND + xbuckets circuit, five gamification mechanics, four partner angles." },
      { href: "/governance-card", title: "Governance Quick-Reference Card", label: "Community governance", desc: "Print-and-post card: decision authority matrix, quorum rules, voting thresholds, and the full Reserve Raid 5-step protocol." },
      { href: "/pace-referral", title: "PACE Referral — NWO Food Businesses", label: "Business Dev", desc: "For PACE to forward to NWO clients — Phase 1 offer, four deliverables." },
      { href: "/gilles-pitch", title: "Gilles Pitch — Two Weeks", label: "Private", desc: "Two-week engagement: capture knowledge, document systems, legacy at Deer Lake." },
    ],
  },
  {
    n: 4,
    name: "The Standby",
    subtitle: "Internal & Ops",
    season: "Provisions laid in before the flood.",
    accent: "#9c4a2f",
    docs: [
      { href: "/overview", title: "Project Overview — All 7 Headwaters Tools", label: "Start here", desc: "Plain-language visual guide showing what every tool does and how they connect." },
      { href: "/internal-scope-plan", title: "Internal Scope Plan", label: "Internal", desc: "Internal reference for active engagement scope and milestones." },
      { href: "/codetry-packet-sandy-lake", title: "Codetry Print Packet — Sandy Lake", label: "Aboriginal Outreach", desc: "Full Sandy Lake packet: cover + intro + one-pager + brief + proposal." },
      { href: "/codetry-packet-deer-lake", title: "Codetry Print Packet — Deer Lake", label: "Deer Lake", desc: "Eight pages in one PDF — declaration through Chief Brief." },
      { href: "/codetry-one-pager", title: "Codetry Economic Development One-Pager", label: "Aboriginal Outreach", desc: "Compact single-page: four service lines, trial-first model." },
      { href: "/coop-compliance-notice", title: "807 Co-op — Compliance Notice (2025)", label: "807 Co-op", desc: "CPA engagement letter and members' waiver resolution before the AGM." },
      { href: "/constellation-session-may16", title: "Constellation Session — May 16, 2026", label: "Internal reference", desc: "Full personal constellation map + four new ledger entries + open decisions." },
      { href: "/northern-economic-tools", title: "Tools & Training for Northern Economic Systems", label: "Working document", desc: "Codetry discipline mapped onto reserve labour pools and work-share." },
      { href: "/square-setup", title: "Square — Parr's Jars to Headwaters", label: "Square identity", desc: "Step-by-step walkthrough for changing the Square account name." },
      { href: "/tsp-guest-form", title: "TSP Guest Application — Bobbie Parr, Fall 2026", label: "Media", desc: "Survival Podcast guest form for Bobbie's second appearance, ten questions." },
      { href: "/cold-trailer-upgrade", title: "Cold Trailer Upgrade — 807 Food Co-op", label: "807 / Subcontract", desc: "$9,995 budget — CoolBot ACs, heater, decals, hitch, lights." },
      { href: "/deer-lake-first-engine", title: "Deer Lake First Engine", label: "Deer Lake", desc: "Economic engine framing specific to Deer Lake First Nation." },
      { href: "/deer-lake-youth-odyssey", title: "Deer Lake Youth Odyssey", label: "Deer Lake", desc: "Youth-focused Odyssey framing for the Deer Lake community." },
      { href: "/deer-lake-chief-brief", title: "Deer Lake Chief Brief", label: "Deer Lake", desc: "One-page brief prepared for the Chief of Deer Lake First Nation." },
      { href: "/xrpl-tip", title: "The Shallows — XRPL Tipping PoC", label: "Zone 5 · Dam Days", desc: "Peer-to-peer XRP tipping on XRPL Testnet — interactive, not printable." },
    ],
  },
];

const MECHANIC_TAGS = [
  { glyph: "⊖", text: "Print-ready" },
  { glyph: "⊞", text: "PDF export" },
  { glyph: "◎", text: "Community-specific" },
  { glyph: "◷", text: "Leave-behind format" },
  { glyph: "⌀", text: "Letter size (8.5×11)" },
];

/* ── Main component ──────────────────────────────────────────────────────── */
export default function InternalDocs() {
  const [packetLoading, setPacketLoading] = useState(false);
  const [community, setCommunity] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [activeZone, setActiveZone] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const zoneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const filteredZones = ZONES.map((z) => ({
    ...z,
    docs: isSearching
      ? z.docs.filter(
          (doc) =>
            doc.title.toLowerCase().includes(normalizedQuery) ||
            doc.label.toLowerCase().includes(normalizedQuery) ||
            doc.desc.toLowerCase().includes(normalizedQuery)
        )
      : z.docs,
  }));

  const totalMatches = filteredZones.reduce((sum, z) => sum + z.docs.length, 0);

  async function handlePacketDownload() {
    setPacketLoading(true);
    try {
      await downloadAsPdf("nan-packet", "headwaters-nan-outreach-packet.pdf", { paginate: true });
    } finally {
      setPacketLoading(false);
    }
  }

  function handleCopy(slug: string) {
    const url = buildPersonalizedUrl(slug, community.trim());
    navigator.clipboard.writeText(url).then(() => {
      setCopied(slug);
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {
      setCopied(`error:${slug}`);
      setTimeout(() => setCopied(null), 2500);
    });
  }

  function handleZoneClick(n: number) {
    setActiveZone(n);
    const el = zoneRefs.current[n];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  const trimmed = community.trim();

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>

      {/* ══════════════════════════════════════════════════════ HERO ══ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "#1f3d2e",
          backgroundImage: `url("${base}hero-images/eagle-sky-2-2400x900.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          paddingTop: "4rem",
          paddingBottom: "3.5rem",
        }}
      >
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(20,44,30,0.72) 0%, rgba(20,44,30,0.88) 60%, rgba(15,35,24,0.97) 100%)",
        }} />
        {/* Topographic texture */}
        <div aria-hidden className="od-topo-light pointer-events-none absolute inset-0" style={{ opacity: 0.18 }} />

        <div style={{ position: "relative", maxWidth: "52rem", margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
          {/* Eagle mark */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <EagleMark size={148} />
          </div>

          {/* Eyebrow — mono uppercase + gold hairline */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{ height: "1px", width: "2rem", background: "#d4a017", opacity: 0.6 }} />
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.72rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(212,160,23,0.85)",
              margin: 0,
            }}>
              Headwaters Print Suite
            </p>
            <div style={{ height: "1px", width: "2rem", background: "#d4a017", opacity: 0.6 }} />
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.2rem, 6vw, 3.4rem)",
            fontWeight: 700,
            lineHeight: 1.05,
            color: "#f4ede0",
            marginBottom: "0.75rem",
            letterSpacing: "-0.01em",
          }}>
            The Paper Layer
          </h1>

          {/* Italic boreal subhead */}
          <p style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.1rem",
            fontStyle: "italic",
            color: "rgba(244,237,224,0.65)",
            marginBottom: "1.25rem",
            textDecoration: "underline",
            textDecorationStyle: "wavy",
            textDecorationColor: "rgba(212,160,23,0.3)",
            textUnderlineOffset: "3px",
          }}>
            Print-ready materials that carry the constellation into every room.
          </p>

          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.95rem",
            color: "rgba(244,237,224,0.72)",
            maxWidth: "36rem",
            margin: "0 auto 2rem",
            lineHeight: 1.65,
          }}>
            Forty-plus documents organized into five constellation zones — from identity marks to community pitch packets. Open any piece, click Download PDF, and send it to your printer or email.
          </p>

          {/* Mechanic tags */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem" }}>
            {MECHANIC_TAGS.map(({ glyph, text }) => (
              <span
                key={text}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(244,237,224,0.6)",
                  borderBottom: "1.5px solid rgba(244,237,224,0.18)",
                  paddingBottom: "0.25rem",
                  paddingLeft: "0.1rem",
                  paddingRight: "0.1rem",
                }}
              >
                <span style={{ color: "#d4a017", fontSize: "0.65rem" }}>{glyph}</span>
                {text}
              </span>
            ))}
          </div>

          {/* Codetry constellation crosslink strip */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem 1.25rem",
            background: "rgba(244,237,224,0.06)",
            border: "1px solid rgba(212,160,23,0.22)",
            borderRadius: "6px",
            marginBottom: "2rem",
          }}>
            <span style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.65rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(212,160,23,0.65)",
            }}>
              Codetry Constellation
            </span>
            <div style={{ width: "1px", height: "1rem", background: "rgba(212,160,23,0.25)" }} />
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontFamily: "var(--font-sans)",
                fontSize: "0.72rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(244,237,224,0.72)",
                textDecoration: "none",
                padding: "0.3rem 0.7rem",
                border: "1px solid rgba(244,237,224,0.18)",
                borderRadius: "3px",
                transition: "border-color 0.15s, color 0.15s",
              }}
            >
              <span style={{ color: "#d4a017", fontSize: "0.65rem" }}>◎</span>
              The Odyssey
            </a>
            <a
              href="/codetry-handbook/path"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontFamily: "var(--font-sans)",
                fontSize: "0.72rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(244,237,224,0.72)",
                textDecoration: "none",
                padding: "0.3rem 0.7rem",
                border: "1px solid rgba(244,237,224,0.18)",
                borderRadius: "3px",
              }}
            >
              <span style={{ color: "#d4a017", fontSize: "0.65rem" }}>⊕</span>
              Pioneer Path
            </a>
          </div>

          {/* Scroll cue */}
          <a
            href="#zones"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-sans)",
              fontSize: "0.72rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(212,160,23,0.8)",
              textDecoration: "none",
            }}
          >
            Enter the zones ↓
          </a>
        </div>
      </section>

      {/* ═════════════════════════════════ ZONE NAVIGATION STRIP ══ */}
      <section
        id="zones"
        style={{
          background: "#16301f",
          borderBottom: "1px solid rgba(244,237,224,0.08)",
          padding: "1.25rem 1rem",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div style={{
          maxWidth: "52rem",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          justifyContent: "center",
        }}>
          {ZONES.map((z) => {
            const isActive = activeZone === z.n;
            return (
              <button
                key={z.n}
                onClick={() => handleZoneClick(z.n)}
                title={z.subtitle}
                style={{
                  display: "inline-flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  gap: "0.15rem",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: isActive ? "#0d1d15" : "rgba(244,237,224,0.72)",
                  background: isActive ? z.accent : "rgba(244,237,224,0.07)",
                  border: `1px solid ${isActive ? z.accent : "rgba(244,237,224,0.15)"}`,
                  borderRadius: "4px",
                  padding: "0.4rem 0.85rem",
                  cursor: "pointer",
                  transition: "background 0.15s, color 0.15s, border-color 0.15s",
                  fontWeight: isActive ? 600 : 400,
                  textAlign: "left",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ color: isActive ? "rgba(255,255,255,0.8)" : z.accent, lineHeight: 1 }}>
                    <ZoneIcon zone={z.n} />
                  </span>
                  <span>
                    <span style={{ opacity: 0.55, marginRight: "0.2rem" }}>Z{z.n}</span>
                    {z.name}
                  </span>
                </span>
                <span style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.06em",
                  textTransform: "none",
                  opacity: isActive ? 0.75 : 0.45,
                  fontWeight: 400,
                  paddingLeft: "1.5rem",
                }}>
                  {z.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════ SEARCH BAR ══ */}
      <div style={{ maxWidth: "52rem", margin: "0 auto", padding: "1.5rem 1.25rem 0" }}>
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}>
          <span style={{
            position: "absolute",
            left: "0.9rem",
            color: "rgba(31,61,46,0.45)",
            fontSize: "1rem",
            lineHeight: 1,
            pointerEvents: "none",
          }}>
            ⌕
          </span>
          <input
            ref={searchRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={'Search documents \u2014 try \u201cdeer lake\u201d, \u201cprice\u201d, \u201cNAN\u201d \u2026'}
            aria-label="Search documents"
            style={{
              width: "100%",
              background: "#f4ede0",
              border: "1.5px solid rgba(31,61,46,0.22)",
              borderRadius: "6px",
              padding: "0.65rem 2.5rem 0.65rem 2.25rem",
              fontFamily: "var(--font-sans)",
              fontSize: "0.92rem",
              color: "var(--ink)",
              outline: "none",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#1f3d2e";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(31,61,46,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(31,61,46,0.22)";
              e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
            }}
          />
          {isSearching && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              style={{
                position: "absolute",
                right: "0.75rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(31,61,46,0.5)",
                fontSize: "1rem",
                lineHeight: 1,
                padding: "0.2rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              ✕
            </button>
          )}
        </div>
        {isSearching && (
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            color: "rgba(31,61,46,0.5)",
            marginTop: "0.5rem",
            marginBottom: 0,
          }}>
            {totalMatches === 0
              ? "No documents match that search."
              : `${totalMatches} document${totalMatches !== 1 ? "s" : ""} match${totalMatches === 1 ? "es" : ""} "${searchQuery.trim()}"`}
          </p>
        )}
      </div>

      {/* ══════════════════════════════════════ ZONE JOURNAL CARDS ══ */}
      <div style={{ maxWidth: "52rem", margin: "0 auto", padding: "1.25rem 1.25rem 0.5rem" }}>
        {filteredZones.map((z, zi) => {
          const isActive = activeZone === z.n;
          return (
            <div
              key={z.n}
              ref={(el) => { zoneRefs.current[z.n] = el; }}
              style={{ marginBottom: "1.75rem" }}
            >
              {/* Zone journal card */}
              <div style={{
                background: isActive ? "#fffdf8" : "#f9f3e9",
                border: `1.5px solid ${isActive ? z.accent : "rgba(184,90,62,0.18)"}`,
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: isActive
                  ? `0 4px 24px rgba(0,0,0,0.10), 0 0 0 1px ${z.accent}22`
                  : "0 2px 8px rgba(0,0,0,0.06)",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}>
                {/* Card header */}
                <div style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1.25rem 1.5rem",
                  borderLeft: `4px solid ${z.accent}`,
                }}>
                  {/* Icon circle */}
                  <div style={{
                    flexShrink: 0,
                    width: "2.75rem",
                    height: "2.75rem",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${z.accent}22`,
                    border: `1.5px solid ${z.accent}55`,
                    color: z.accent,
                    marginTop: "0.15rem",
                  }}>
                    <ZoneIcon zone={z.n} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.25rem" }}>
                      <h2 style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: "#1f3d2e",
                        letterSpacing: "-0.01em",
                        margin: 0,
                      }}>
                        {z.name}
                        <span style={{ fontWeight: 400, color: "rgba(31,61,46,0.5)", marginLeft: "0.4rem" }}>—</span>
                        <span style={{ fontWeight: 400, color: "rgba(31,61,46,0.7)", marginLeft: "0.3rem" }}>{z.subtitle}</span>
                      </h2>
                      <span className="hw-label" style={{ background: z.accent, flexShrink: 0 }}>
                        Zone {z.n}
                      </span>
                    </div>
                    <p style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.85rem",
                      fontStyle: "italic",
                      color: z.accent,
                      opacity: 0.85,
                      margin: 0,
                    }}>
                      {z.season}
                    </p>
                  </div>
                </div>

                {/* Pencil-line separator */}
                <div style={{
                  height: "1px",
                  background: "none",
                  borderTop: "1px dashed rgba(184,90,62,0.18)",
                  margin: "0 1.5rem",
                }} />

                {/* Document list */}
                <div style={{ padding: "0.75rem 1.25rem 1.25rem" }}>
                  {isSearching && z.docs.length === 0 ? (
                    <p style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.78rem",
                      color: "rgba(31,61,46,0.38)",
                      fontStyle: "italic",
                      margin: "0.25rem 0 0.5rem",
                      padding: "0.5rem 0.25rem",
                    }}>
                      No documents in this zone match your search.
                    </p>
                  ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {z.docs.map((doc) => (
                      <Link
                        key={doc.href}
                        href={doc.href}
                        className="hover-elevate"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          background: "rgba(244,237,224,0.85)",
                          border: "1px solid rgba(31,61,46,0.09)",
                          borderRadius: "5px",
                          padding: "0.7rem 1rem",
                          textDecoration: "none",
                          color: "inherit",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.2rem" }}>
                            <span style={{
                              fontFamily: "var(--font-serif)",
                              fontSize: "0.95rem",
                              fontWeight: 600,
                              color: "var(--ink)",
                              lineHeight: 1.3,
                            }}>
                              {doc.title}
                            </span>
                            <span style={{
                              background: `${z.accent}18`,
                              color: z.accent,
                              fontSize: "0.62rem",
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              padding: "0.1rem 0.4rem",
                              borderRadius: "3px",
                              flexShrink: 0,
                              fontFamily: "var(--font-sans)",
                            }}>
                              {doc.label}
                            </span>
                          </div>
                          <p style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.78rem",
                            color: "var(--muted)",
                            lineHeight: 1.5,
                            margin: 0,
                          }}>
                            {doc.desc}
                          </p>
                        </div>
                        <span style={{
                          color: z.accent,
                          opacity: 0.7,
                          fontSize: "1rem",
                          flexShrink: 0,
                        }}>
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                  )}
                </div>

                {/* Card footer */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.6rem 1.5rem",
                  borderTop: "1px dashed rgba(184,90,62,0.14)",
                  background: "rgba(31,61,46,0.025)",
                }}>
                  <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(31,61,46,0.32)",
                  }}>
                    {z.docs.length} document{z.docs.length !== 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={() => handleZoneClick(z.n)}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: z.accent,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      opacity: 0.8,
                    }}
                  >
                    {isActive ? "↑ on map" : "filter ↑"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ════════════════════════ PERSONALIZED LINK GENERATOR + NAN ══ */}
      <div style={{ maxWidth: "52rem", margin: "0 auto", padding: "0 1.25rem 0.5rem" }}>

        {/* Trail divider */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          margin: "2rem 0 1.5rem",
          color: "rgba(31,61,46,0.35)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(31,61,46,0.22), transparent)" }} />
          <span>Personalize &amp; Package</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(31,61,46,0.22), transparent)" }} />
        </div>

        {/* NAN packet download */}
        <div style={{
          background: "#f0e8d8",
          border: "1.5px dashed rgba(31,61,46,0.22)",
          borderRadius: "7px",
          padding: "1.1rem 1.4rem",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#2e5a3f",
              marginBottom: "0.3rem",
            }}>
              Zone 2 · NAN Outreach Packet
            </p>
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.82rem",
              color: "var(--muted)",
              lineHeight: 1.5,
              margin: 0,
            }}>
              One click — four pages bundled as a single PDF ready to attach to an email.
            </p>
          </div>
          <button
            onClick={handlePacketDownload}
            disabled={packetLoading}
            style={{
              background: packetLoading ? "rgba(31,61,46,0.5)" : "#1f3d2e",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "0.5rem 1.1rem",
              fontFamily: "var(--font-sans)",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: packetLoading ? "default" : "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "background 0.15s",
            }}
          >
            {packetLoading ? "⏳ Generating…" : "⬇ Download packet (4 pages)"}
          </button>
        </div>

        {/* Personalized link generator */}
        <div style={{
          background: "#f4ede0",
          border: "1.5px solid rgba(31,61,46,0.18)",
          borderRadius: "7px",
          padding: "1.2rem 1.4rem",
          marginBottom: "1.75rem",
        }}>
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#1f3d2e",
            marginBottom: "0.7rem",
          }}>
            ◎ Generate a personalized link
          </p>
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.8rem",
            color: "var(--muted)",
            lineHeight: 1.55,
            marginBottom: "0.85rem",
          }}>
            Type a community name — the intro letter and pilot proposal will auto-fill with it when the recipient opens the link.
          </p>
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
            <input
              type="text"
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              placeholder="e.g. Moose Cree First Nation"
              style={{
                flex: 1,
                minWidth: "14rem",
                background: "#f4ede0",
                border: "1.5px solid rgba(31,61,46,0.22)",
                borderRadius: "4px",
                padding: "0.5rem 0.75rem",
                fontFamily: "var(--font-sans)",
                fontSize: "0.88rem",
                color: "var(--ink)",
                outline: "none",
              }}
            />
            <span style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.72rem",
              color: "var(--muted)",
              flexShrink: 0,
            }}>
              {trimmed ? `"${trimmed}"` : "Enter community name above"}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {personalizedDocs.map((d) => {
              const url = trimmed ? buildPersonalizedUrl(d.slug, trimmed) : null;
              const isCopied = copied === d.slug;
              return (
                <div
                  key={d.slug}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    background: "#f4ede0",
                    border: "1px solid rgba(31,61,46,0.12)",
                    borderRadius: "4px",
                    padding: "0.5rem 0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.76rem",
                    fontWeight: 600,
                    color: "var(--evergreen)",
                    flexShrink: 0,
                    minWidth: "6rem",
                  }}>
                    {d.label}
                  </span>
                  <span style={{
                    flex: 1,
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.72rem",
                    color: url ? "#1a6b3c" : "var(--muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontStyle: url ? "normal" : "italic",
                  }}>
                    {url ?? "—"}
                  </span>
                  <button
                    onClick={() => trimmed && handleCopy(d.slug)}
                    disabled={!trimmed}
                    style={{
                      flexShrink: 0,
                      background: isCopied ? "var(--evergreen)" : (trimmed ? "#b85a3e" : "rgba(31,61,46,0.15)"),
                      color: trimmed ? "var(--cream)" : "var(--muted)",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.28rem 0.65rem",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      cursor: trimmed ? "pointer" : "default",
                      transition: "background 0.15s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isCopied ? "✓ Copied" : copied === `error:${d.slug}` ? "Copy failed" : "Copy link"}
                  </button>
                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flexShrink: 0,
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.72rem",
                        color: "var(--evergreen)",
                        textDecoration: "underline",
                        textUnderlineOffset: "2px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Preview →
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* How to print note */}
        <div style={{
          padding: "0.9rem 1.1rem",
          background: "rgba(31,61,46,0.05)",
          borderRadius: "6px",
          fontFamily: "var(--font-sans)",
          fontSize: "0.82rem",
          color: "var(--muted)",
          lineHeight: 1.6,
          marginBottom: "2rem",
        }}>
          <strong style={{ color: "var(--evergreen)" }}>How to print:</strong> Open any piece and click <strong>Download PDF</strong>. The PDF is sized for its format — letter (8.5×11) for most pieces, 3.5×2 for business cards, 4×9 for the rack card. Send straight to your printer or a print shop.
        </div>

        {/* Footer */}
        <div style={{
          paddingTop: "1.5rem",
          borderTop: "1px solid rgba(31,61,46,0.12)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.75rem",
          color: "var(--muted)",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}>
          <a href="/print-marketing/privacy" style={{ color: "var(--muted)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
            Privacy policy
          </a>
          <span>·</span>
          <span>Headwaters Development Services · {new Date().getFullYear()}</span>
          <span>·</span>
          <span style={{ fontStyle: "italic", opacity: 0.7 }}>The paper layer of the constellation.</span>
        </div>
      </div>

      {/* Hidden NAN packet render target for PDF generation */}
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
