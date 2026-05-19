import type { CSSProperties } from "react";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const MUTED = "#7a7a6e";
const INK = "#2a2520";
const TEAL = "#1F5446";
const RUST = "#b85a3e";
const RULE = "rgba(42,37,32,0.15)";

const PAGE: CSSProperties = {
  width: "8.5in",
  minHeight: "11in",
  background: CREAM,
  display: "flex",
  flexDirection: "column",
  fontFamily: "Inter, system-ui, sans-serif",
  color: INK,
  overflow: "hidden",
};

function Rule() {
  return <div style={{ height: 1, backgroundColor: RULE, margin: "24px 0" }} />;
}

function Section({ eyebrow, heading, children }: {
  eyebrow?: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      {eyebrow && (
        <p style={{
          margin: "0 0 6px",
          fontSize: "0.56rem",
          fontWeight: 900,
          letterSpacing: "0.25em",
          textTransform: "uppercase" as const,
          color: TEAL,
        }}>
          {eyebrow}
        </p>
      )}
      <h2 style={{
        fontFamily: "Fraunces, Georgia, serif",
        fontSize: "1.1rem",
        fontWeight: 600,
        color: INK,
        margin: "0 0 10px",
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
      fontSize: "0.72rem",
      color: INK,
      lineHeight: 1.75,
      margin: "0 0 8px",
    }}>
      {children}
    </p>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul style={{
      margin: "0 0 8px",
      paddingLeft: 20,
      listStyleType: "disc",
    }}>
      {items.map((item, i) => (
        <li key={i} style={{
          display: "list-item",
          listStyleType: "disc",
          fontSize: "0.72rem",
          color: INK,
          lineHeight: 1.75,
          marginBottom: 4,
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
      borderLeft: `3px solid ${TEAL}`,
      paddingLeft: 14,
      margin: "14px 0",
    }}>
      <p style={{
        fontSize: "0.78rem",
        fontFamily: "Fraunces, Georgia, serif",
        color: TEAL,
        lineHeight: 1.6,
        margin: 0,
        fontStyle: "italic",
      }}>
        {children}
      </p>
    </div>
  );
}

export function DeerLakeChiefBriefPage() {
  return (
    <div id="chief-brief-page" style={PAGE}>

      {/* Header band */}
      <div style={{
        background: EVERGREEN,
        padding: "0.38in 0.65in 0.32in",
        flexShrink: 0,
      }}>
        <p style={{
          fontSize: "0.52rem",
          fontWeight: 900,
          letterSpacing: "0.28em",
          textTransform: "uppercase" as const,
          color: "rgba(244,237,224,0.6)",
          margin: "0 0 10px",
        }}>
          Deer Lake First Nation · Community Store Proposal
        </p>
        <h1 style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: "1.9rem",
          fontWeight: 600,
          lineHeight: 1.2,
          color: CREAM,
          margin: "0 0 10px",
        }}>
          A Place for Everyone
        </h1>
        <p style={{ fontSize: "0.7rem", color: "rgba(244,237,224,0.65)", lineHeight: 1.7, margin: 0 }}>
          For the Chief — plain language, one read. May 2026.
        </p>
      </div>

      {/* Rust rule */}
      <div style={{ height: "0.055in", background: RUST, flexShrink: 0 }} />

      {/* Main body */}
      <div style={{ flex: 1, padding: "0.32in 0.65in 0.28in" }}>

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
            In Dryden, the 807 Food Co-op &amp; Hub began as a question: what if the community owned
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

        {/* Section 4 — 8-week trial */}
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

        {/* Section 5 — urgency */}
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
          padding: "18px 22px",
          borderRadius: 8,
          border: `1px solid ${RULE}`,
          backgroundColor: "rgba(31,84,70,0.06)",
        }}>
          <p style={{
            fontSize: "0.52rem",
            fontWeight: 900,
            letterSpacing: "0.22em",
            textTransform: "uppercase" as const,
            color: TEAL,
            margin: "0 0 8px",
          }}>
            The ask
          </p>
          <p style={{
            fontSize: "0.88rem",
            fontFamily: "Fraunces, Georgia, serif",
            color: INK,
            lineHeight: 1.6,
            margin: "0 0 8px",
            fontWeight: 600,
          }}>
            One conversation. No commitment beyond that.
          </p>
          <p style={{ fontSize: "0.68rem", color: MUTED, lineHeight: 1.7, margin: 0 }}>
            Bobbie Parr · Headwaters Inc · Wabigoon, ON · ourheadwaters.ca
          </p>
        </div>

      </div>

      {/* Footer band */}
      <div style={{
        background: EVERGREEN,
        padding: "0.18in 0.65in",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
      }}>
        <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.7rem", fontWeight: 600, color: CREAM, margin: 0 }}>
          Headwaters Development Services · Wabigoon, Ontario — Treaty 3 Territory
        </p>
        <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.6rem", color: "rgba(244,237,224,0.65)", margin: 0, letterSpacing: "0.04em" }}>
          ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654
        </p>
      </div>

    </div>
  );
}

