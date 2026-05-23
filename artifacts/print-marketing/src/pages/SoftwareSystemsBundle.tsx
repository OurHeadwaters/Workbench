import { PrintNav } from "../components/PrintNav";

function buildPlainText(): string {
  return [
    "HEADWATERS SOFTWARE SYSTEMS BUNDLE",
    "Unified Ecosystem Overview — May 2026",
    "ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654",
    "",
    "---",
    "",
    "WHAT HEADWATERS IS",
    "",
    "Headwaters is a solo practitioner firm led by Bobbie Parr, based in Wabigoon, Ontario",
    "(Treaty 3 Territory). The discipline is Codetry — a methodology for building community-owned",
    "economic infrastructure and handing it off so communities run it without a consultant",
    "in the room. Primary clients: First Nations band councils, northern co-ops, and community",
    "organizations in Northwestern Ontario.",
    "",
    "Every tool in this ecosystem is modular, white-labelable, and built on shared infrastructure.",
    "No vendor lock-in. No extraction model. Sovereign by design.",
    "",
    "---",
    "",
    "THE ZONE MODEL",
    "",
    "Z0 — Saltbox / Household: Identity, voice, the mark before anything moves.",
    "Z1 — Eave / Circle: Mutual aid, internal coordination, the people closest in.",
    "Z2 — Workbench / Deck: Where the practitioner works, sells, and accounts for the work.",
    "Z3+ — Open Market / Picnic Table: Public-facing, third-party, broader world.",
    "",
    "Hard architectural seams prevent data from leaking between zones.",
    "Every tool knows which zone it lives in.",
    "",
    "---",
    "",
    "THE PLATFORM (shared across all tools)",
    "",
    "Monorepo: pnpm workspace. All artifacts share one backend, one database, one deployment.",
    "Backend: Express API server, PostgreSQL + Drizzle ORM.",
    "Frontend: React/Vite (web), Expo/React Native (mobile), local-first where possible.",
    "AI: OpenRouter / Grok integration for council, coaching, and document generation.",
    "Finance: XRPL integration for transparent settlement where applicable.",
    "Design: Warm palette (cream, evergreen, terracotta, amber). Inter + Fraunces. No emojis, no guilt.",
    "",
    "---",
    "",
    "BUNDLE A — WELLNESS & CARE TRACKING",
    "For: TOPS groups, senior living, LTC facilities, clinics, corporate wellness.",
    "",
    "Tools: Keto Companion (personalized macro tracker, local-first, mobile PWA) +",
    "Bright Side (PHI-free staff care coordination for LTC — joy feed, credits, director dashboard).",
    "",
    "Key benefits: Low-friction adoption. No privacy headaches. Makes relational care visible.",
    "Recurring: Hosting + support. Add-ons: medication tracker, custom infographics.",
    "",
    "---",
    "",
    "BUNDLE B — FAMILY & HOMESCHOOL OPERATING SYSTEM",
    "For: Homeschool co-ops, families, faith communities, youth programs.",
    "",
    "Tools: Kitchen (household hub launcher) + Saltbox/Gather (local-first learning companion) +",
    "Hearth + Life Badges + Campfire (kids quest platform, peer toy trading, badges) +",
    "Family Buckets/xBuckets (chore/savings tracking with XRPL settlement) +",
    "Memory Lane (family legacy archive).",
    "",
    "Key benefits: Sovereign household core + safe community scaling.",
    "Pulls kids into real-world activity. No app store required (PWA).",
    "",
    "---",
    "",
    "BUNDLE C — COMMUNITY COORDINATION & MUTUAL AID",
    "For: Rural co-ops, villages, band councils, support networks.",
    "",
    "Tools: Sandbox (pull-based village bulletin) + The Eave (rotating mutual aid coordination) +",
    "North Star (practitioner OS + AI council/Kitchen Table) +",
    "Stomping Path ecosystem elements.",
    "",
    "Key benefits: Trust-layered communication. No vendor lock-in.",
    "Preparedness built in (Standby Supplies). Scales from one household to a whole community.",
    "",
    "---",
    "",
    "BUNDLE D — BUSINESS & PRODUCER OPERATIONS",
    "For: Restaurants, retail, food co-ops, farmers markets, small northern operators.",
    "",
    "Tools: Dryden Web Suite (restaurant OS, retail/wellness site, producer marketplace) +",
    "807 Benefits (co-op member platform) + Market Mosaic (market coordination) +",
    "Rootwork (asset studio and management).",
    "",
    "Key benefits: Frictionless front door to institutional money.",
    "Local producer support. Operational efficiency without enterprise complexity.",
    "",
    "---",
    "",
    "BUNDLE E — FULL SOVEREIGN STACK",
    "For: Larger co-ops, family offices, communities, grant-funded organizations.",
    "",
    "Includes: All zones (Z0–Z3+) + Codetry practitioner tools + Kitchen Table AI council +",
    "XRPL finance layer + full print marketing suite + practitioner licensing.",
    "",
    "Key benefits: Complete digital infrastructure owned and operated by the community.",
    "Practitioner intake/placement. Audit retention. PDF generators. Training included.",
    "",
    "---",
    "",
    "807 PROJECT PACKAGE (active engagement)",
    "Grant-funded component: Field Guide Finance",
    "Headwaters tools: Deadhead · Market Mosaic · Rootwork",
    "",
    "Field Guide Finance: Financial literacy course for NWO food entrepreneurs.",
    "Module-based, video-anchored (807 Grows / Parrs Jars as anchor story).",
    "Covers: proof before pitch, co-op structure, NWO funding pathways.",
    "Built with grant funding for 807 regional rollout.",
    "",
    "Deadhead, Market Mosaic, Rootwork: Definitions in progress.",
    "See practitioner notes for current scope.",
    "",
    "---",
    "",
    "PRICING MODEL",
    "",
    "Bundles are sold as configurable, white-label systems — not generic SaaS subscriptions.",
    "Every engagement includes: shared infrastructure + branding seams + handover support.",
    "",
    "Standard engagement: $28,000 flat fee, six phases, plain-language deliverables.",
    "Trial-first: No full hire or contract without a bounded, paid trial period.",
    "Recurring: Hosting + support retainer. Add-ons priced separately.",
    "Practitioner licensing available for Codetry-trained operators.",
    "",
    "---",
    "",
    "Headwaters Development Services · ourheadwaters.ca · Wabigoon, ON · Treaty 3 Territory",
    "Bobbie Parr · bobbie@ourheadwaters.ca · 807 220 3654",
    "This document is a working reference. Not for public distribution without review.",
  ].join("\n");
}

const doc: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.82rem",
  color: "var(--ink)",
  lineHeight: 1.65,
  maxWidth: "7.5in",
  margin: "0 auto",
  padding: "0.4in 0.5in",
};

const pageHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  borderBottom: "2px solid var(--evergreen)",
  paddingBottom: "0.18in",
  marginBottom: "0.28in",
};

const eyebrow: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.6rem",
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: "var(--rust)",
  marginBottom: "0.1in",
};

const h1: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "1.7rem",
  fontWeight: 700,
  color: "var(--evergreen)",
  margin: 0,
  lineHeight: 1.1,
};

const contact: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.68rem",
  color: "rgba(31,61,46,0.6)",
  textAlign: "right",
  lineHeight: 1.7,
  marginTop: "0.1in",
};

const sectionChip = (color: string): React.CSSProperties => ({
  display: "inline-block",
  background: color,
  color: "#f4ede0",
  fontFamily: "var(--font-sans)",
  fontSize: "0.58rem",
  fontWeight: 800,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  padding: "0.04in 0.13in",
  borderRadius: 3,
  marginBottom: "0.1in",
});

const bundleCard: React.CSSProperties = {
  border: "1px solid rgba(31,61,46,0.14)",
  borderRadius: 5,
  padding: "0.16in 0.2in",
  marginBottom: "0.14in",
  background: "rgba(31,61,46,0.025)",
};

const bundleTitle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "1rem",
  fontWeight: 700,
  color: "var(--evergreen)",
  margin: "0 0 0.04in 0",
};

const bundleFor: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.68rem",
  letterSpacing: "0.06em",
  color: "var(--rust)",
  textTransform: "uppercase",
  marginBottom: "0.1in",
};

const bundleBody: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.77rem",
  color: "rgba(31,61,46,0.82)",
  lineHeight: 1.6,
  margin: 0,
};

const benefit: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.75rem",
  color: "var(--evergreen)",
  fontStyle: "italic",
  marginTop: "0.07in",
};

const sectionHead: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.62rem",
  fontWeight: 800,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "var(--evergreen)",
  borderBottom: "1px solid rgba(31,61,46,0.18)",
  paddingBottom: "0.05in",
  marginBottom: "0.14in",
  marginTop: "0.28in",
};

const zoneRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "0.6in 1fr",
  gap: "0.08in 0.14in",
  alignItems: "baseline",
  marginBottom: "0.06in",
};

const zoneNum: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.68rem",
  fontWeight: 700,
  color: "var(--rust)",
  letterSpacing: "0.08em",
};

const zoneDesc: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.77rem",
  color: "var(--ink)",
  lineHeight: 1.55,
};

const platformRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.1in 1fr",
  gap: "0.05in 0.14in",
  alignItems: "baseline",
  marginBottom: "0.04in",
};

const platformKey: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.68rem",
  fontWeight: 700,
  color: "rgba(31,61,46,0.7)",
  letterSpacing: "0.04em",
};

const platformVal: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.77rem",
  color: "var(--ink)",
  lineHeight: 1.55,
};

const packageCard: React.CSSProperties = {
  border: "2px solid var(--rust)",
  borderRadius: 5,
  padding: "0.16in 0.2in",
  marginBottom: "0.14in",
  background: "rgba(176,57,30,0.04)",
};

const pageFooter: React.CSSProperties = {
  borderTop: "1px solid rgba(31,61,46,0.2)",
  paddingTop: "0.12in",
  marginTop: "0.3in",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
};

const footerText: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.62rem",
  color: "rgba(31,61,46,0.5)",
  letterSpacing: "0.06em",
};

const BUNDLES = [
  {
    letter: "A",
    title: "Wellness & Care Tracking",
    color: "#2e5a3f",
    for: "TOPS groups · senior living · LTC facilities · clinics · corporate wellness",
    tools: "Keto Companion — personalized macro tracker, local-first, mobile PWA. Bright Side — PHI-free staff care coordination for LTC: joy feed, credits, director dashboard.",
    benefits: "Low-friction adoption. No privacy headaches. Makes relational care visible and measurable.",
    recurring: "Hosting + support. Add-ons: medication tracker, custom infographics.",
  },
  {
    letter: "B",
    title: "Family & Homeschool Operating System",
    color: "#1B5E8A",
    for: "Homeschool co-ops · families · faith communities · youth programs",
    tools: "Kitchen (household hub launcher) · Saltbox/Gather (local-first learning companion) · Hearth + Life Badges + Campfire (kids quest platform, peer toy trading) · Family Buckets/xBuckets (chore/savings with XRPL settlement) · Memory Lane (family legacy archive).",
    benefits: "Sovereign household core with safe community scaling. Pulls kids into real-world activity. No app store required.",
    recurring: "Hosting + support. Add-ons: custom badge sets, community modules.",
  },
  {
    letter: "C",
    title: "Community Coordination & Mutual Aid",
    color: "#4a6741",
    for: "Rural co-ops · villages · band councils · support networks",
    tools: "Sandbox (pull-based village bulletin) · The Eave (rotating mutual aid coordination) · North Star (practitioner OS + AI council/Kitchen Table) · Stomping Path ecosystem elements.",
    benefits: "Trust-layered communication. No vendor lock-in. Preparedness built in. Scales from one household to a whole community.",
    recurring: "Hosting + support. Add-ons: custom AI council seats, preparedness modules.",
  },
  {
    letter: "D",
    title: "Business & Producer Operations",
    color: "#b85a3e",
    for: "Restaurants · retail · food co-ops · farmers markets · small northern operators",
    tools: "Dryden Web Suite (restaurant OS, retail/wellness site, producer marketplace) · 807 Benefits (co-op member platform) · Market Mosaic (market coordination) · Rootwork (asset studio and management).",
    benefits: "Frictionless front door to institutional money. Local producer support. Operational efficiency without enterprise complexity.",
    recurring: "Hosting + support. Add-ons: custom ordering flows, grant documentation tools.",
  },
  {
    letter: "E",
    title: "Full Sovereign Stack",
    color: "#1f3d2e",
    for: "Larger co-ops · family offices · communities · grant-funded organizations",
    tools: "All zones (Z0–Z3+) · Codetry practitioner tools · Kitchen Table AI council · XRPL finance layer · full print marketing suite · practitioner licensing and intake.",
    benefits: "Complete digital infrastructure owned and operated by the community. Practitioner training included. Audit retention. PDF generators. Knowledge doesn't leave when the consultant does.",
    recurring: "Hosting + support + practitioner retainer. White-label available.",
  },
];

export default function SoftwareSystemsBundlePage() {
  return (
    <>
      <PrintNav
        targetId="bundle-doc"
        filename="headwaters-software-systems-bundle.pdf"
        format="letter"
        orientation="portrait"
        paginate
        onCopyPlainText={buildPlainText}
      />

      <div id="bundle-doc" style={doc}>

        {/* Page header */}
        <div style={pageHeader}>
          <div>
            <p style={eyebrow}>Headwaters Development Services</p>
            <h1 style={h1}>Software Systems Bundle</h1>
            <p style={{ ...zoneDesc, marginTop: "0.07in", fontStyle: "italic", color: "rgba(31,61,46,0.65)" }}>
              Modular, white-labelable digital infrastructure — built for communities that intend to own what they build.
            </p>
          </div>
          <div style={contact}>
            ourheadwaters.ca<br />
            bobbie@ourheadwaters.ca<br />
            807 220 3654<br />
            May 2026
          </div>
        </div>

        {/* Two-column intro + zone model */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.24in", marginBottom: "0.1in" }}>

          {/* Left — What Headwaters is */}
          <div>
            <p style={sectionHead}>The Practice</p>
            <p style={{ ...bundleBody, marginBottom: "0.1in" }}>
              Headwaters designs and deploys purpose-built digital tools for real people and communities — especially in Northwestern Ontario (807 area code). Led by Bobbie Parr, practitioner, based in Wabigoon (Treaty 3 Territory).
            </p>
            <p style={bundleBody}>
              The discipline is <strong>Codetry</strong> — a methodology for building community-owned economic infrastructure and handing it off so it runs without a consultant in the room. Focus: warm, accessible design. Dollar-honest. Local-first where possible.
            </p>
            <p style={{ ...bundleBody, marginTop: "0.1in" }}>
              <strong>Value proposition:</strong> Sell reusable, modular software bundles — not generic SaaS. Every bundle is white-labelable, deployable on Replit or client infrastructure. Sovereignty, auditability, and human relationships over extraction.
            </p>
          </div>

          {/* Right — Zone model + platform */}
          <div>
            <p style={sectionHead}>The Zone Model</p>
            <div style={{ marginBottom: "0.14in" }}>
              {[
                ["Z0 — Saltbox", "Household / Identity. The mark before anything moves."],
                ["Z1 — Eave", "Circle / Mutual Aid. The people closest in."],
                ["Z2 — Workbench", "The Deck. Where practitioners work, sell, and account."],
                ["Z3+ — Open Market", "Public-facing, third-party, the broader world."],
              ].map(([num, desc]) => (
                <div key={num} style={zoneRow}>
                  <span style={zoneNum}>{num}</span>
                  <span style={zoneDesc}>{desc}</span>
                </div>
              ))}
            </div>

            <p style={sectionHead}>Shared Platform</p>
            {[
              ["Monorepo", "pnpm workspace — one backend, one DB, one deployment."],
              ["Backend", "Express API, PostgreSQL + Drizzle ORM."],
              ["Frontend", "React/Vite (web) · Expo/React Native (mobile)."],
              ["AI", "OpenRouter / Grok — council, coaching, doc generation."],
              ["Finance", "XRPL integration for transparent settlement."],
              ["Design", "Cream · Evergreen · Terracotta · Amber. Inter + Fraunces."],
            ].map(([k, v]) => (
              <div key={k} style={platformRow}>
                <span style={platformKey}>{k}</span>
                <span style={platformVal}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bundles */}
        <p style={sectionHead}>Sellable Bundles</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.14in", marginBottom: "0.14in" }}>
          {BUNDLES.slice(0, 4).map((b) => (
            <div key={b.letter} style={bundleCard}>
              <span style={sectionChip(b.color)}>Bundle {b.letter}</span>
              <p style={bundleTitle}>{b.title}</p>
              <p style={bundleFor}>{b.for}</p>
              <p style={bundleBody}><strong>Tools: </strong>{b.tools}</p>
              <p style={benefit}>{b.benefits}</p>
              <p style={{ ...bundleBody, marginTop: "0.06in", color: "rgba(31,61,46,0.55)", fontSize: "0.7rem" }}>
                {b.recurring}
              </p>
            </div>
          ))}
        </div>

        {/* Bundle E — full width */}
        {BUNDLES.slice(4).map((b) => (
          <div key={b.letter} style={{ ...bundleCard, border: "1.5px solid var(--evergreen)", background: "rgba(31,61,46,0.04)", marginBottom: "0.2in" }}>
            <span style={sectionChip(b.color)}>Bundle {b.letter} — Full Sovereign Stack</span>
            <p style={bundleTitle}>{b.title}</p>
            <p style={bundleFor}>{b.for}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.14in" }}>
              <p style={bundleBody}><strong>Includes: </strong>{b.tools}</p>
              <div>
                <p style={benefit}>{b.benefits}</p>
                <p style={{ ...bundleBody, marginTop: "0.06in", color: "rgba(31,61,46,0.55)", fontSize: "0.7rem" }}>
                  {b.recurring}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* 807 Package */}
        <p style={sectionHead}>807 Project Package — Active Engagement</p>
        <div style={packageCard}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.18in" }}>
            <div>
              <span style={sectionChip("#b85a3e")}>Grant-funded component</span>
              <p style={bundleTitle}>Field Guide Finance</p>
              <p style={bundleBody}>
                Financial literacy course for NWO food entrepreneurs. Module-based, video-anchored — 807 Grows / Parrs Jars as the anchor story. Covers: proof before pitch, co-op structure, NWO funding pathways, how funders and buyers actually evaluate food businesses in the north.
              </p>
              <p style={{ ...benefit, marginTop: "0.08in" }}>
                Built with grant funding for 807 regional rollout.
              </p>
            </div>
            <div>
              <span style={sectionChip("#2e5a3f")}>Headwaters tools in this package</span>
              <div style={{ marginTop: "0.04in" }}>
                {[
                  { name: "Deadhead", desc: "Idea vetting and backlog management for community projects. Keeps the desk from overflowing — structured intake, review, and smash process." },
                  { name: "Market Mosaic", desc: "Market coordination and producer network tool. Definition in progress — scope to be confirmed with practitioner." },
                  { name: "Rootwork", desc: "Asset studio and foundational infrastructure work. Definition in progress — scope to be confirmed with practitioner." },
                ].map(({ name, desc }) => (
                  <div key={name} style={{ marginBottom: "0.1in" }}>
                    <p style={{ ...bundleTitle, fontSize: "0.88rem", marginBottom: "0.03in" }}>{name}</p>
                    <p style={{ ...bundleBody, color: "rgba(31,61,46,0.75)" }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing model */}
        <p style={sectionHead}>Pricing Model</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.12in", marginBottom: "0.22in" }}>
          {[
            { label: "Standard engagement", val: "$28,000 flat fee. Six phases. Plain-language deliverables." },
            { label: "Trial-first", val: "No full hire or contract without a bounded, paid trial period." },
            { label: "Recurring", val: "Hosting + support retainer. Add-ons priced separately per bundle." },
            { label: "Practitioner licensing", val: "Available for Codetry-trained operators. Intake and placement included." },
          ].map(({ label, val }) => (
            <div key={label} style={{ border: "1px solid rgba(31,61,46,0.14)", borderRadius: 4, padding: "0.1in 0.13in" }}>
              <p style={{ ...bundleFor, marginBottom: "0.06in" }}>{label}</p>
              <p style={bundleBody}>{val}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={pageFooter}>
          <p style={footerText}>
            Headwaters Development Services · Wabigoon, Ontario · Treaty 3 Territory
          </p>
          <p style={{ ...footerText, textAlign: "right" }}>
            Not for public distribution without review · May 2026
          </p>
        </div>

      </div>
    </>
  );
}
