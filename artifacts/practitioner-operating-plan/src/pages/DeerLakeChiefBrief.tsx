import { useEffect } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const T = {
  bg:     "#1f3d2e",
  paper:  "#f4ede0",
  text:   "#2a2520",
  muted:  "#7a7a6e",
  rule:   "rgba(42,37,32,0.15)",
  teal:   "#1F5446",
  rust:   "#b85a3e",
  gold:   "#8B6914",
};

function PrintButton() {
  function handlePrint() {
    const url = window.location.href.split("?")[0] + "?print";
    window.open(url, "_blank");
  }
  return (
    <button
      className="no-print"
      onClick={handlePrint}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 14px",
        borderRadius: 7,
        border: `1px solid rgba(42,37,32,0.2)`,
        backgroundColor: "transparent",
        color: T.muted,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.07em",
        cursor: "pointer",
        fontFamily: "var(--font-body)",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"/>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
        <rect x="6" y="14" width="12" height="8"/>
      </svg>
      Print / PDF
    </button>
  );
}

function Rule() {
  return <div style={{ height: 1, backgroundColor: T.rule, margin: "28px 0" }} />;
}

function Section({ eyebrow, heading, children }: {
  eyebrow?: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      {eyebrow && (
        <p style={{
          margin: "0 0 6px",
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: "0.25em",
          textTransform: "uppercase" as const,
          color: T.teal,
        }}>
          {eyebrow}
        </p>
      )}
      <h2 style={{
        fontFamily: "var(--font-display, Georgia, serif)",
        fontSize: 20,
        fontWeight: 600,
        color: T.text,
        margin: "0 0 12px",
        lineHeight: 1.25,
      }}>
        {heading}
      </h2>
      {children}
    </div>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 14,
      color: T.text,
      lineHeight: 1.75,
      margin: "0 0 10px",
    }}>
      {children}
    </p>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul style={{
      margin: "0 0 10px",
      paddingLeft: 22,
      listStyleType: "disc",
    }}>
      {items.map((item, i) => (
        <li key={i} style={{
          display: "list-item",
          listStyleType: "disc",
          fontSize: 14,
          color: T.text,
          lineHeight: 1.75,
          marginBottom: 5,
        }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      borderLeft: `3px solid ${T.teal}`,
      paddingLeft: 16,
      margin: "16px 0",
    }}>
      <p style={{
        fontSize: 15,
        fontFamily: "var(--font-display, Georgia, serif)",
        color: T.teal,
        lineHeight: 1.6,
        margin: 0,
        fontStyle: "italic",
      }}>
        {children}
      </p>
    </div>
  );
}

export default function DeerLakeChiefBrief() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("print")) {
      setTimeout(() => window.print(), 300);
    }
  }, []);

  return (
    <div
      className="print-root"
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: "36px 24px 80px",
        fontFamily: "var(--font-body, Inter, sans-serif)",
        backgroundColor: T.paper,
        color: T.text,
        minHeight: "100vh",
      }}
    >
      {/* Nav */}
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
        <a
          href={BASE + "/"}
          style={{ fontSize: 11, fontWeight: 700, color: T.muted, textDecoration: "none", letterSpacing: "0.08em" }}
        >
          ← Operating Plan
        </a>
        <PrintButton />
      </div>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: "0.28em",
          textTransform: "uppercase" as const,
          color: T.muted,
          margin: "0 0 10px",
        }}>
          Deer Lake First Nation · Community Store Proposal
        </p>
        <h1 style={{
          fontFamily: "var(--font-display, Georgia, serif)",
          fontSize: 32,
          fontWeight: 600,
          lineHeight: 1.2,
          color: T.text,
          margin: "0 0 14px",
        }}>
          A Place for Everyone
        </h1>
        <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, margin: 0, maxWidth: 480 }}>
          For the Chief — plain language, one read. May 2026.
        </p>
      </div>

      <Rule />

      {/* Section 1 */}
      <Section eyebrow="What this is" heading="Not a business pitch. A community tool.">
        <Body>
          A community store built right doesn't compete with what's already there.
          It lifts everything — the hunters who need gas, the families who drive to Sioux Lookout for groceries,
          the elders who need basics without the trip.
          The goal isn't to take market share. It's to keep money in the community that's leaving it every week.
        </Body>
        <Callout>
          A rising tide floats all boats. A well-run community store makes everyone stronger — including the people already in business.
        </Callout>
      </Section>

      <Rule />

      {/* Section 2 — 807 proof */}
      <Section eyebrow="We've done this before" heading="The 807 Food Co-op started the same way.">
        <Body>
          In Dryden, the 807 Food Co-op & Hub began as a question: what if the community owned
          the supply chain instead of depending on it? It didn't put anyone out of business.
          It created a platform that independent producers, local sellers, and northern communities
          could plug into — and it grew because it was designed to include, not compete.
        </Body>
        <Body>
          That's the model here. Deer Lake's store would connect to that same supply network —
          which means better prices, more reliable stock, and a direct line to regional producers
          that no individual store can get on its own.
        </Body>
      </Section>

      <Rule />

      {/* Section 3 — youth */}
      <Section eyebrow="The longer game" heading="A place for young people to learn what an economy actually is.">
        <Body>
          Right now, when a young person from Deer Lake wants to understand business,
          they have to leave to find it. The store changes that.
          It becomes a place where youth can work real inventory, watch real decisions get made,
          and learn what it means to run something their community depends on.
          Not a classroom. Not a simulation. The real thing — with guidance.
        </Body>
        <Bullets items={[
          "Stocking decisions made by local staff, not a distant head office",
          "Revenue stays in the community and gets reinvested",
          "Young people see a future here that didn't exist before",
          "The store becomes part of the story Deer Lake tells about itself",
        ]} />
      </Section>

      <Rule />

      {/* Section 4 — what we're asking */}
      <Section eyebrow="The 8-week trial" heading="Here's what happens if you say yes.">
        <Body>
          The first eight weeks are a scoped trial — not a full commitment.
          Here's what gets built in that time:
        </Body>
        <Bullets items={[
          "A community discovery audit — what's needed, what's already there, what the gaps are",
          "A hiring plan built from people already in Deer Lake",
          "A grant roadmap matched to what's actually fundable in the north right now",
          "A plain-language operations guide written for your staff, not consultants",
        ]} />
        <Body>
          At the end of eight weeks you have a real document, a real plan,
          and a real decision in front of you — not a promise.
          If it doesn't feel right, it stops there. No obligation to Phase 2.
        </Body>
        <Callout>
          Deer Lake goes first. That means Deer Lake shapes what this becomes — for every community that follows.
        </Callout>
      </Section>

      <Rule />

      {/* Section 5 — the urgency */}
      <Section eyebrow="Why now" heading="The window is open. It won't stay that way.">
        <Body>
          Winter road season is the critical supply window for northern stores.
          Planning needs to start in the fall to hit that window with inventory in place.
          The grant landscape for food infrastructure and community economic development
          is active right now — and that funding moves in cycles.
        </Body>
        <Body>
          This isn't pressure. It's timing. The communities that move in the next few months
          will be the ones positioned for the next funding cycle and the next winter road.
          The ones that wait will be planning again in a year.
        </Body>
      </Section>

      <Rule />

      {/* Footer / ask */}
      <div style={{
        padding: "20px 24px",
        borderRadius: 10,
        border: `1px solid ${T.rule}`,
        backgroundColor: "rgba(31,84,70,0.06)",
      }}>
        <p style={{
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: "0.22em",
          textTransform: "uppercase" as const,
          color: T.teal,
          margin: "0 0 8px",
        }}>
          The ask
        </p>
        <p style={{
          fontSize: 16,
          fontFamily: "var(--font-display, Georgia, serif)",
          color: T.text,
          lineHeight: 1.6,
          margin: "0 0 10px",
          fontWeight: 600,
        }}>
          One conversation. No commitment beyond that.
        </p>
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, margin: 0 }}>
          Bobbie Parr · Headwaters Inc · Wabigoon, ON · ourheadwaters.ca
        </p>
      </div>

      {/* Internal nav — no-print */}
      <div className="no-print" style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" as const }}>
        <a href={`${BASE}/deer-lake-talking-points`} style={{ fontSize: 12, fontWeight: 700, color: T.teal, textDecoration: "none" }}>
          Exclusivity talking points →
        </a>
        <a href={`${BASE}/deer-lake-roadmap`} style={{ fontSize: 12, fontWeight: 700, color: T.teal, textDecoration: "none" }}>
          How the model spreads →
        </a>
      </div>

    </div>
  );
}
