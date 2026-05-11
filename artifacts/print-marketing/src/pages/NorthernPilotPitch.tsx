import type { CSSProperties } from "react";
import { PrintNav } from "../components/PrintNav";

const base = import.meta.env.BASE_URL;

// ─── Pitch config ─────────────────────────────────────────────────────────────
// Edit any value here to update the full pitch (rendered pages + plain-text copy).
//
// PITCH — to reuse this pitch for a new community or month, update the values below.
//   communityName  — the full legal name used in headers and formal copy
//   communityShort — the short form used in body sentences (typically everything before "First Nation")
//   proposalDate   — long-form date shown in document metadata / plain-text header  e.g. "May 2026"
//   proposalMonth  — short date shown on the cover page  e.g. "May 2026"
const PITCH = {
  communityName:  "Deer Lake First Nation",
  communityShort: "Deer Lake",
  proposalDate:   "May 2026",
  proposalMonth:  "May 2026",
};

// Convenience aliases so nothing below needs to change when reading config.
const CLIENT_NAME  = PITCH.communityName;
const CLIENT_SHORT = PITCH.communityShort;

// FEES — set phase2Fee / phase3Fee to a display string (e.g. "$42k") once the
// fee is agreed. Leave as null to keep the "Pricing TBC" placeholder.
const FEES: { phase2Fee: string | null; phase3Fee: string | null; phase4Fee: string | null } = {
  phase2Fee: null,
  phase3Fee: null,
  phase4Fee: null,
};

// PHASES — dates and durations shown in headers, subheads, and plain-text copy.
//   phase1Duration  e.g. "6 weeks"
//   phase2Duration  e.g. "4 months"
//   phase2Dates     e.g. "Aug–Dec"
//   phase3Label     shown in the page header  e.g. "Winter season onward"
//   phase3Season    shown in the pricing box  e.g. "Winter season"
const PHASES = {
  phase1Duration: "6 weeks",
  phase2Duration: "4 months",
  phase2Dates: "Aug–Dec",
  phase3Label: "Winter season onward",
  phase3Season: "Winter season",
};

function buildPlainText(): string {
  return [
    `HEADWATERS · ${CLIENT_NAME.toUpperCase()}`,
    "Community Store Pilot — Proposal",
    PITCH.proposalDate,
    "",
    "Headwaters Development Services",
    "bobbie@ourheadwaters.ca · ourheadwaters.ca",
    "",
    "---",
    "",
    "PAGE 1 — THE PROBLEM",
    "",
    "One store. One point of failure.",
    "",
    "Right now, one outside business decides what your community eats — and what it costs. Your community has no say.",
    "",
    "Can we build something better here?",
    "Prices you can't control, budgets that won't work. Band-sourced food, transparent prices, more food security.",
    "If it closes, there is no backup.",
    "",
    `Every dollar spent there leaves ${CLIENT_SHORT} and doesn't come back.`,
    "",
    "---",
    "",
    "PAGE 2 — THE OPPORTUNITY",
    "",
    "A store your community owns.",
    "",
    `A community store doesn't compete with what's already there. It fills the gaps — affordable food, local ownership, money that stays in ${CLIENT_SHORT}.`,
    "",
    "Affordable basics — Everyday staples at prices that make sense for your community.",
    "Locally owned — Community members decide what's stocked, what it costs, and who works there.",
    "Less dependence — Your food supply doesn't depend on one outside operator staying open.",
    "",
    "---",
    "",
    "PAGE 3 — HOW IT WORKS (Phase 1 · The Plan)",
    "",
    "We listen. We plan. Leadership sees the plan and decides what happens next.",
    "",
    `What ${CLIENT_SHORT} walks away with after ${PHASES.phase1Duration}:`,
    "→ A clear plan for what to sell and where it comes from",
    "→ A clear picture of who does what and how decisions get made",
    "→ A day-to-day operations guide — orders, pricing, cash",
    "→ A hiring plan: Headwaters finds candidates, writes job descriptions, and maps training needs — the contractor and band decide who gets hired",
    "→ A financial plan for year one — what it costs to run and where the money comes from",
    "",
    `$28,000 · ${PHASES.phase1Duration} engagement · flat fee`,
    `You can stop at any point. Everything built stays with ${CLIENT_SHORT}.`,
    "",
    "Headwaters Development Services",
    "bobbie@ourheadwaters.ca · ourheadwaters.ca",
    "",
    "---",
    "",
    `PAGE 4 — THE BUILD (Phase 2 · ${PHASES.phase2Duration} · ${PHASES.phase2Dates})`,
    "",
    "The store opens. We make sure it works.",
    "",
    "The operator couple is hired and in place. Food starts moving. Headwaters is on the ground once a month — 3 days each visit — checking that the supply chain is running clean, the software is bug-free, inventory is rotating, and delivery is reliable. Problems get caught early.",
    "",
    "The honest note on timing: Summer freight runs by air — costs are high and margins will be tight. That's expected and planned for. The numbers get better when winter roads open.",
    "",
    `Staffing support: Headwaters helps find and vet the operator couple (the most critical hire), supports building the casual pod job descriptions for ${CLIENT_SHORT} community members, and helps develop training for both. Final hiring decisions stay with the contractor and band.`,
    "",
    "What this phase ends with: A store that has been running for a full season, a team that knows what they're doing, and a financial picture showing what summer costs and what winter should deliver.",
    "",
    FEES.phase2Fee
      ? `${FEES.phase2Fee} · flat fee — confirmed at the end of Phase 1 once scope and staffing needs are clear.`
      : "Pricing TBC — Phase 2 fees are confirmed at the end of Phase 1, once scope and staffing needs are clear.",
    "",
    "---",
    "",
    `PAGE 5 — THE PAYOFF (Phase 3 · ${PHASES.phase3Label})`,
    "",
    "Winter roads open. The economics flip.",
    "",
    "Bulk truck delivery replaces frequent air freight. Cost per item drops significantly. The same store, same team, same prices — but the margin picture improves substantially.",
    "",
    "What this phase does: Lock in the lower-cost supply chain, document what the store actually earns in its first winter, and produce a clean financial record the band can use with funders and for planning the next year.",
    "",
    FEES.phase3Fee
      ? `${FEES.phase3Fee} · flat fee — scope confirmed after Phase 2 reveals the store's operating rhythm.`
      : "Pricing TBC — Phase 3 fees are discussed separately; scope depends on what Phase 2 reveals about the store's operating rhythm.",
    "",
    "Phase 1 built the plan. Phase 2 proved it could run. Phase 3 shows it can pay for itself.",
    "",
    "---",
    "",
    "PAGE 6 — THE HANDOFF (Phase 4 · The Handoff Year)",
    "",
    "Headwaters steps back. The community steps forward.",
    "",
    `By Phase 4, Headwaters is operating at roughly 50% capacity — intentionally. The store team is running the day-to-day. The operator couple knows the supply chain. ${CLIENT_SHORT} community members are filling the casual pod roles. What's left is the knowledge transfer that makes independence real.`,
    "",
    "What this phase does:",
    `→ A local person from the community is trained in the Codetry tools — the software that runs ordering, pricing, and inventory — so ${CLIENT_SHORT} owns that knowledge, not just the store`,
    "→ Community engagement deepens: feedback sessions, local sourcing conversations, and the band's longer-term food vision starts to take shape",
    "→ A formal handoff moment — a feast or celebration — marks the transition from Headwaters-supported to community-run",
    "→ Headwaters documents everything: what worked, what the store costs to run, what it earns, and what comes next",
    "→ A clean record for funders and a clear path to Pilot #2 — the second community that can learn from what Deer Lake built",
    "",
    FEES.phase4Fee
      ? `${FEES.phase4Fee} · flat fee — scope confirmed after Phase 3.`
      : "Pricing TBC — Phase 4 fees are discussed at the end of Phase 3, once the store's operating rhythm and training needs are clear.",
    "",
    "Phase 1 built the plan. Phase 2 proved it could run. Phase 3 showed it pays for itself. Phase 4 makes it theirs.",
  ].join("\n");
}

const PAGE: CSSProperties = {
  width: "8.5in",
  minHeight: "11in",
  background: "var(--cream)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  pageBreakAfter: "always",
  breakAfter: "page",
};

const WONK0: CSSProperties = { fontVariationSettings: '"WONK" 0' };

export default function NorthernPilotPitch() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-northern-pilot-pitch.pdf"
        onCopyPlainText={buildPlainText}
      />

      <div id="pdf-target" style={{ background: "#d8d2c8" }}>

        {/* ── COVER ── */}
        <div style={{ ...PAGE, background: "var(--evergreen)", position: "relative" }}>

          {/* Boreal hero — top 58% */}
          <div style={{ width: "100%", height: "6.38in", flexShrink: 0, overflow: "hidden", position: "relative" }}>
            <img
              src={`${base}hero-boreal.png`}
              alt="Northern boreal lake at golden hour"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%", display: "block" }}
            />
            {/* Gradient fades photo into the evergreen band below */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(31,61,46,0.18) 0%, transparent 35%, rgba(31,61,46,0.72) 100%)" }} />

            {/* Logo + wordmark in top-left corner over photo */}
            <div style={{ position: "absolute", top: "0.52in", left: "0.62in", display: "flex", alignItems: "center", gap: "0.2in" }}>
              <img
                src={`${base}eagle-circle.png`}
                alt="Headwaters logo"
                style={{ width: "0.72in", height: "0.72in", objectFit: "contain", opacity: 0.92 }}
              />
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", fontWeight: 700, color: "var(--cream)", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.2 }}>
                  Headwaters
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.52rem", color: "rgba(244,237,224,0.65)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Development Services
                </p>
              </div>
            </div>

            {/* Document label bottom-left over photo */}
            <p style={{ position: "absolute", bottom: "0.28in", left: "0.62in", fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,237,224,0.65)" }}>
              Community Store Pilot · Proposal
            </p>
          </div>

          {/* Evergreen band — bottom 42% */}
          <div style={{ flex: 1, background: "var(--evergreen)", padding: "0.46in 0.62in 0.54in", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

            <div>
              {/* Rust accent rule */}
              <div style={{ width: "0.55in", height: 3, background: "var(--rust)", marginBottom: "0.22in" }} />

              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "3.4rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: "0.22in", ...WONK0 }}>
                {CLIENT_SHORT}<br />First Nation
              </h1>

              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.88rem", color: "rgba(244,237,224,0.72)", lineHeight: 1.6, maxWidth: "4.8in" }}>
                {`A plan for a community-owned store — affordable food, local jobs, and money that stays in ${CLIENT_SHORT}.`}
              </p>
            </div>

            {/* Bottom row: contact left, date right */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(244,237,224,0.15)", paddingTop: "0.2in" }}>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "rgba(244,237,224,0.55)", marginBottom: "0.04rem" }}>
                  bobbie@ourheadwaters.ca
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "rgba(244,237,224,0.55)" }}>
                  ourheadwaters.ca
                </p>
              </div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "rgba(244,237,224,0.45)", letterSpacing: "0.1em" }}>
                {PITCH.proposalMonth}
              </p>
            </div>

          </div>

          {/* Rust bar at very bottom */}
          <div style={{ width: "100%", height: "0.12in", flexShrink: 0, background: "var(--rust)" }} />
        </div>

        {/* ── PAGE 1 ── The problem */}
        <div style={PAGE}>

          {/* Header */}
          <div style={{ background: "var(--evergreen)", padding: "0.48in 0.7in 0.44in", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,237,224,0.5)", marginBottom: "0.22rem" }}>
              {`Headwaters · ${CLIENT_NAME}`}
            </p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "3.2rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.0, letterSpacing: "-0.02em", ...WONK0 }}>
              One store.<br />One point<br />of failure.
            </h1>
          </div>

          {/* Boreal photo strip */}
          <div style={{ width: "100%", height: "3.0in", flexShrink: 0, overflow: "hidden", position: "relative" }}>
            <img
              src={`${base}hero-boreal.png`}
              alt="Northern boreal lake at golden hour"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", display: "block" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(31,61,46,0.18) 100%)" }} />
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: "0.38in 0.7in 0.3in", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3in" }}>

              <div>
                <div style={{ width: "0.5in", height: 3, background: "var(--rust)", marginBottom: "0.18in" }} />
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.18rem", fontWeight: 700, color: "var(--evergreen)", lineHeight: 1.45, maxWidth: "5.5in" }}>
                  Right now, one outside business decides what your community eats — and what it costs. Your community has no say.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.28in" }}>
                {[
                  {
                    head: "Can we build something better here?",
                    body: "Prices you can't control, budgets that won't work. Band-sourced food, transparent prices, more food security.",
                  },
                  {
                    head: "If it closes, there is no backup",
                    body: `One store, one supply line. If it shuts down or pulls back, ${CLIENT_SHORT} has nowhere else to turn.`,
                  },
                ].map((card) => (
                  <div key={card.head} style={{ borderTop: "2px solid var(--rust)", paddingTop: "0.15in" }}>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.87rem", fontWeight: 700, color: "var(--evergreen)", lineHeight: 1.35, marginBottom: "0.09in" }}>
                      {card.head}
                    </p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.74rem", color: "var(--muted)", lineHeight: 1.6 }}>
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>

              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontStyle: "italic", color: "var(--muted)", lineHeight: 1.5 }}>
                {`Every dollar spent there leaves ${CLIENT_SHORT} and doesn't come back.`}
              </p>

            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(31,61,46,0.3)" }}>1 of 6</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(31,61,46,0.3)" }}>The problem</p>
            </div>
          </div>
        </div>

        {/* ── PAGE 2 ── The opportunity */}
        <div style={{ ...PAGE }}>

          {/* Harvest photo — full width top */}
          <div style={{ width: "100%", height: "3.4in", flexShrink: 0, overflow: "hidden", position: "relative" }}>
            <img
              src={`${base}hero-harvest.jpeg`}
              alt="Community members working together during harvest in northern Ontario"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 55%, rgba(244,237,224,0.55) 100%)" }} />
            <p style={{ position: "absolute", bottom: "0.15in", left: "0.25in", fontFamily: "var(--font-sans)", fontSize: "0.52rem", color: "rgba(31,61,46,0.5)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Northwestern Ontario
            </p>
          </div>

          {/* Content */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "0.18in 1fr" }}>
            <div style={{ background: "var(--evergreen)" }} />
            <div style={{ padding: "0.42in 0.65in 0.3in", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.34in" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.14in" }}>
                    The opportunity
                  </p>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 900, color: "var(--evergreen)", lineHeight: 1.05, letterSpacing: "-0.02em", ...WONK0 }}>
                    A store your<br />community owns.
                  </h2>
                </div>

                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--ink)", lineHeight: 1.68, maxWidth: "5in" }}>
                  {`A community store doesn't compete with what's already there. It fills the gaps — affordable food, local ownership, money that stays in ${CLIENT_SHORT}.`}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.22in" }}>
                  {[
                    {
                      head: "Affordable basics",
                      body: "Everyday staples at prices that make sense for your community — not for a business trying to maximize profit from outside.",
                    },
                    {
                      head: "Owned by your community",
                      body: `Community members decide what's stocked, what it costs, and who works there. The store answers to ${CLIENT_SHORT}.`,
                    },
                    {
                      head: "Less dependence on one operator",
                      body: "Your food supply shouldn't depend on one outside business staying open. This changes that.",
                    },
                  ].map((item) => (
                    <div key={item.head} style={{ display: "flex", gap: "0.2in", alignItems: "flex-start" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--rust)", flexShrink: 0, marginTop: "0.22rem" }} />
                      <div>
                        <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.87rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.05rem" }}>{item.head}</p>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.74rem", color: "var(--muted)", lineHeight: 1.55 }}>{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(31,61,46,0.3)" }}>2 of 6</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(31,61,46,0.3)" }}>The opportunity</p>
              </div>

            </div>
          </div>
        </div>

        {/* ── PAGE 3 ── How it works (Phase 1) */}
        <div style={{ ...PAGE }}>

          {/* Rust header */}
          <div style={{ background: "var(--rust)", padding: "0.44in 0.7in 0.4in", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "0.15rem" }}>
              {`Phase 1 · The Plan · ${PHASES.phase1Duration}`}
            </p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 900, color: "white", lineHeight: 1.05, letterSpacing: "-0.02em", ...WONK0 }}>
              We listen. We plan.<br />Leadership sees the plan<br />and decides what's next.
            </h2>
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: "0.42in 0.7in 0.32in", display: "flex", flexDirection: "column", gap: "0.34in" }}>

            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.18in" }}>
                {`What ${CLIENT_SHORT} walks away with after ${PHASES.phase1Duration}`}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.5in" }}>
                {[
                  "A clear plan for what to sell and where it comes from",
                  "A clear picture of who does what and how decisions get made",
                  "A day-to-day operations guide — orders, pricing, cash",
                  "A hiring plan: Headwaters finds candidates, writes job descriptions, and maps training needs — the contractor and band decide who gets hired",
                  "A financial plan for year one — what it costs to run and where the money comes from",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", gap: "0.14in", alignItems: "flex-start", borderBottom: "1px solid rgba(31,61,46,0.1)", paddingBottom: "0.12in", marginBottom: "0.12in" }}>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", color: "var(--rust)", lineHeight: 1.2, flexShrink: 0, ...WONK0 }}>→</span>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.79rem", color: "var(--ink)", lineHeight: 1.48 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fee block */}
            <div style={{ background: "var(--evergreen)", borderRadius: 6, padding: "0.28in 0.38in", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,237,224,0.6)", marginBottom: "0.06rem" }}>
                  What it costs
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1.3 }}>
                  {`One flat fee. ${PHASES.phase1Duration}. No hourly billing.`}
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "rgba(244,237,224,0.65)", marginTop: "0.05rem" }}>
                  {`You can stop at any point. Everything built stays with ${CLIENT_SHORT}.`}
                </p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", fontWeight: 900, color: "white", lineHeight: 1 }}>$28k</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.55rem", color: "rgba(244,237,224,0.55)", letterSpacing: "0.1em", textTransform: "uppercase" }}>CAD · excl. HST</p>
              </div>
            </div>

            {/* Contact + closing */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(31,61,46,0.12)", paddingTop: "0.2in" }}>
              <div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.04rem" }}>Headwaters Development Services</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--muted)" }}>bobbie@ourheadwaters.ca · ourheadwaters.ca</p>
              </div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(31,61,46,0.3)" }}>3 of 6</p>
            </div>

          </div>

          {/* Closing bar */}
          <div style={{ width: "100%", height: "0.12in", flexShrink: 0, background: "var(--rust)" }} />

        </div>

        {/* ── PAGE 4 ── The Build (Phase 2) */}
        <div style={{ ...PAGE }}>

          {/* Evergreen header */}
          <div style={{ background: "var(--evergreen)", padding: "0.44in 0.7in 0.4in", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,237,224,0.5)", marginBottom: "0.15rem" }}>
              {`Phase 2 · The Build · ${PHASES.phase2Duration} · ${PHASES.phase2Dates}`}
            </p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.05, letterSpacing: "-0.02em", ...WONK0 }}>
              The store opens.<br />We make sure<br />it works.
            </h2>
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: "0.42in 0.7in 0.32in", display: "flex", flexDirection: "column", gap: "0.32in" }}>

            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--ink)", lineHeight: 1.68, maxWidth: "5.5in" }}>
              The operator couple is hired and in place. Food starts moving. Headwaters is on the ground once a month — three days each visit — checking that the supply chain is running clean, the software is bug-free, inventory is rotating, and delivery is reliable. Problems get caught early.
            </p>

            {/* Honest note callout */}
            <div style={{ borderLeft: "3px solid var(--rust)", paddingLeft: "0.22in", display: "flex", flexDirection: "column", gap: "0.06in" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rust)" }}>
                The honest note on timing
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--ink)", lineHeight: 1.62 }}>
                Summer freight runs by air — costs are high and margins will be tight. That's expected and planned for. The numbers get better when winter roads open.
              </p>
            </div>

            {/* Staffing support */}
            <div style={{ borderTop: "1px solid rgba(31,61,46,0.12)", paddingTop: "0.24in" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.14in" }}>
                Staffing support
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--ink)", lineHeight: 1.62 }}>
                {`Headwaters helps find and vet the operator couple — the most critical hire — supports building the casual pod job descriptions for ${CLIENT_SHORT} community members, and helps develop training for both. Final hiring decisions stay with the contractor and band.`}
              </p>
            </div>

            {/* What this phase ends with */}
            <div style={{ background: "rgba(31,61,46,0.06)", borderRadius: 6, padding: "0.22in 0.3in" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--evergreen)", marginBottom: "0.1in" }}>
                What this phase ends with
              </p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", fontWeight: 700, color: "var(--evergreen)", lineHeight: 1.45 }}>
                A store that has been running for a full season, a team that knows what they're doing, and a financial picture showing what summer costs and what winter should deliver.
              </p>
            </div>

            {/* Pricing — Phase 2 */}
            {FEES.phase2Fee ? (
              <div style={{ background: "var(--evergreen)", borderRadius: 6, padding: "0.28in 0.38in", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,237,224,0.6)", marginBottom: "0.06rem" }}>
                    What it costs
                  </p>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1.3 }}>
                    {`One flat fee. ${PHASES.phase2Duration}. No hourly billing.`}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "rgba(244,237,224,0.65)", marginTop: "0.05rem" }}>
                    Confirmed at the end of Phase 1 once scope and staffing needs are clear.
                  </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", fontWeight: 900, color: "white", lineHeight: 1 }}>{FEES.phase2Fee}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.55rem", color: "rgba(244,237,224,0.55)", letterSpacing: "0.1em", textTransform: "uppercase" }}>CAD · excl. HST</p>
                </div>
              </div>
            ) : (
              <div style={{ border: "1px solid rgba(31,61,46,0.15)", borderRadius: 4, padding: "0.16in 0.22in", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.74rem", color: "var(--muted)", lineHeight: 1.5 }}>
                  Phase 2 fees are confirmed at the end of Phase 1, once scope and staffing needs are clear.
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.8rem", fontWeight: 700, color: "var(--evergreen)", whiteSpace: "nowrap", marginLeft: "0.3in", flexShrink: 0 }}>
                  Pricing TBC
                </p>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(31,61,46,0.12)", paddingTop: "0.2in", marginTop: "auto" }}>
              <div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.04rem" }}>Headwaters Development Services</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--muted)" }}>bobbie@ourheadwaters.ca · ourheadwaters.ca</p>
              </div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(31,61,46,0.3)" }}>4 of 6</p>
            </div>

          </div>

          <div style={{ width: "100%", height: "0.12in", flexShrink: 0, background: "var(--rust)" }} />

        </div>

        {/* ── PAGE 5 ── The Payoff (Phase 3) */}
        <div style={{ ...PAGE }}>

          {/* Cream/rust header */}
          <div style={{ background: "var(--rust)", padding: "0.44in 0.7in 0.4in", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "0.15rem" }}>
              {`Phase 3 · The Payoff · ${PHASES.phase3Label}`}
            </p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 900, color: "white", lineHeight: 1.05, letterSpacing: "-0.02em", ...WONK0 }}>
              Winter roads open.<br />The economics flip.
            </h2>
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: "0.42in 0.7in 0.32in", display: "flex", flexDirection: "column", gap: "0.36in" }}>

            {/* What changes */}
            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.14in" }}>
                What changes
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--ink)", lineHeight: 1.68, maxWidth: "5.5in" }}>
                Bulk truck delivery replaces frequent air freight. Cost per item drops significantly. The same store, same team, same prices — but the margin picture improves substantially.
              </p>
            </div>

            {/* What this phase does */}
            <div style={{ borderTop: "1px solid rgba(31,61,46,0.12)", paddingTop: "0.28in" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.14in" }}>
                What this phase does
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.18in" }}>
                {[
                  "Lock in the lower-cost supply chain.",
                  "Document what the store actually earns in its first winter.",
                  "Produce a clean financial record the band can use with funders and for planning the next year.",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", gap: "0.14in", alignItems: "flex-start" }}>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", color: "var(--rust)", lineHeight: 1.2, flexShrink: 0, ...WONK0 }}>→</span>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.82rem", color: "var(--ink)", lineHeight: 1.55 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing — Phase 3 */}
            {FEES.phase3Fee ? (
              <div style={{ background: "var(--evergreen)", borderRadius: 6, padding: "0.28in 0.38in", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,237,224,0.6)", marginBottom: "0.06rem" }}>
                    What it costs
                  </p>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1.3 }}>
                    {`One flat fee. ${PHASES.phase3Season}. No hourly billing.`}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "rgba(244,237,224,0.65)", marginTop: "0.05rem" }}>
                    Scope confirmed after Phase 2 reveals the store's operating rhythm.
                  </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", fontWeight: 900, color: "white", lineHeight: 1 }}>{FEES.phase3Fee}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.55rem", color: "rgba(244,237,224,0.55)", letterSpacing: "0.1em", textTransform: "uppercase" }}>CAD · excl. HST</p>
                </div>
              </div>
            ) : (
              <div style={{ border: "1px solid rgba(31,61,46,0.15)", borderRadius: 4, padding: "0.16in 0.22in", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.74rem", color: "var(--muted)", lineHeight: 1.5 }}>
                  Phase 3 fees are discussed separately — scope depends on what Phase 2 reveals about the store's operating rhythm.
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.8rem", fontWeight: 700, color: "var(--evergreen)", whiteSpace: "nowrap", marginLeft: "0.3in", flexShrink: 0 }}>
                  Pricing TBC
                </p>
              </div>
            )}

            {/* The arc */}
            <div style={{ background: "var(--evergreen)", borderRadius: 6, padding: "0.28in 0.38in", marginTop: "auto" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,237,224,0.55)", marginBottom: "0.12in" }}>
                The arc
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.2in" }}>
                {[
                  { phase: "Phase 1", label: "Built the plan." },
                  { phase: "Phase 2", label: "Proved it could run." },
                  { phase: "Phase 3", label: "Shows it can pay for itself." },
                  { phase: "Phase 4", label: "Makes it theirs." },
                ].map((item) => (
                  <div key={item.phase} style={{ borderTop: "2px solid var(--rust)", paddingTop: "0.1in" }}>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,237,224,0.5)", marginBottom: "0.06rem" }}>{item.phase}</p>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1.35 }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(31,61,46,0.12)", paddingTop: "0.2in" }}>
              <div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.04rem" }}>Headwaters Development Services</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--muted)" }}>bobbie@ourheadwaters.ca · ourheadwaters.ca</p>
              </div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(31,61,46,0.3)" }}>5 of 6</p>
            </div>

          </div>

          <div style={{ width: "100%", height: "0.12in", flexShrink: 0, background: "var(--rust)" }} />

        </div>

        {/* ── PAGE 6 ── The Handoff (Phase 4) */}
        <div style={{ ...PAGE }}>

          {/* Evergreen header */}
          <div style={{ background: "var(--evergreen)", padding: "0.44in 0.7in 0.4in", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,237,224,0.5)", marginBottom: "0.15rem" }}>
              Phase 4 · The Handoff Year
            </p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.05, letterSpacing: "-0.02em", ...WONK0 }}>
              Headwaters steps back.<br />The community<br />steps forward.
            </h2>
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: "0.42in 0.7in 0.32in", display: "flex", flexDirection: "column", gap: "0.32in" }}>

            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--ink)", lineHeight: 1.68, maxWidth: "5.5in" }}>
              {`By Phase 4, Headwaters is operating at roughly 50% capacity — intentionally. The store team is running the day-to-day. The operator couple knows the supply chain. ${CLIENT_SHORT} community members are filling the casual pod roles. What's left is the knowledge transfer that makes independence real.`}
            </p>

            {/* What this phase does */}
            <div style={{ borderTop: "1px solid rgba(31,61,46,0.12)", paddingTop: "0.24in" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.18in" }}>
                What this phase does
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.16in" }}>
                {[
                  {
                    head: "Codetry knowledge transfer",
                    body: `A local person from ${CLIENT_SHORT} is trained in the Codetry tools — the software that runs ordering, pricing, and inventory — so the community owns that knowledge, not just the store.`,
                  },
                  {
                    head: "Community engagement",
                    body: "Feedback sessions, local sourcing conversations, and the band's longer-term food vision starts to take shape. The store becomes a community institution, not just a project.",
                  },
                  {
                    head: "The feast and handoff moment",
                    body: "A formal celebration marks the transition from Headwaters-supported to community-run. The store is yours.",
                  },
                  {
                    head: "A record for funders and a path to Pilot #2",
                    body: "Headwaters documents everything: what worked, what the store costs to run, what it earns. A clean record for grant applications and a clear path for the next community.",
                  },
                ].map((item) => (
                  <div key={item.head} style={{ display: "flex", gap: "0.14in", alignItems: "flex-start" }}>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", color: "var(--rust)", lineHeight: 1.2, flexShrink: 0, ...WONK0 }}>→</span>
                    <div>
                      <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.84rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.03rem" }}>{item.head}</p>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.76rem", color: "var(--muted)", lineHeight: 1.55 }}>{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing — Phase 4 */}
            {FEES.phase4Fee ? (
              <div style={{ background: "var(--evergreen)", borderRadius: 6, padding: "0.28in 0.38in", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(244,237,224,0.6)", marginBottom: "0.06rem" }}>
                    What it costs
                  </p>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1.3 }}>
                    One flat fee. No hourly billing.
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "rgba(244,237,224,0.65)", marginTop: "0.05rem" }}>
                    Scope confirmed at the end of Phase 3.
                  </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", fontWeight: 900, color: "white", lineHeight: 1 }}>{FEES.phase4Fee}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.55rem", color: "rgba(244,237,224,0.55)", letterSpacing: "0.1em", textTransform: "uppercase" }}>CAD · excl. HST</p>
                </div>
              </div>
            ) : (
              <div style={{ border: "1px solid rgba(31,61,46,0.15)", borderRadius: 4, padding: "0.16in 0.22in", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.74rem", color: "var(--muted)", lineHeight: 1.5 }}>
                  Phase 4 fees are discussed at the end of Phase 3, once the store's operating rhythm and training needs are clear.
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.8rem", fontWeight: 700, color: "var(--evergreen)", whiteSpace: "nowrap", marginLeft: "0.3in", flexShrink: 0 }}>
                  Pricing TBC
                </p>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(31,61,46,0.12)", paddingTop: "0.2in", marginTop: "auto" }}>
              <div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.04rem" }}>Headwaters Development Services</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--muted)" }}>bobbie@ourheadwaters.ca · ourheadwaters.ca</p>
              </div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(31,61,46,0.3)" }}>6 of 6</p>
            </div>

          </div>

          <div style={{ width: "100%", height: "0.12in", flexShrink: 0, background: "var(--rust)" }} />

        </div>

      </div>
    </>
  );
}
