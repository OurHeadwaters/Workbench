import type { CSSProperties } from "react";
import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";
const INK = "#1a1a1a";
const FOREST = "#2e5a3f";

const PAGE: CSSProperties = {
  width: "8.5in",
  minHeight: "11in",
  background: CREAM,
  margin: "0 auto",
  padding: "0.85in 0.9in 0.75in",
  boxSizing: "border-box",
  fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
  color: INK,
  position: "relative",
};

const HEADER_BAND: CSSProperties = {
  background: EVERGREEN,
  margin: "-0.85in -0.9in 0",
  padding: "0.55in 0.9in 0.45in",
  marginBottom: "0.55in",
};

const LABEL: CSSProperties = {
  fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
  fontSize: "0.62rem",
  letterSpacing: "0.22em",
  textTransform: "uppercase" as const,
  color: "rgba(212,160,23,0.85)",
  margin: "0 0 0.3rem",
};

const H1: CSSProperties = {
  fontFamily: "var(--font-serif, Fraunces, Georgia, serif)",
  fontSize: "1.85rem",
  fontWeight: 700,
  color: CREAM,
  margin: "0 0 0.25rem",
  lineHeight: 1.1,
};

const SUBHEAD: CSSProperties = {
  fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
  fontSize: "0.82rem",
  color: "rgba(244,237,224,0.65)",
  margin: 0,
};

const SECTION_TITLE: CSSProperties = {
  fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
  fontSize: "0.62rem",
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: FOREST,
  margin: "0 0 0.4rem",
  borderBottom: `1px solid rgba(46,90,63,0.22)`,
  paddingBottom: "0.2rem",
};

const BODY: CSSProperties = {
  fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
  fontSize: "0.84rem",
  lineHeight: 1.7,
  color: INK,
  margin: "0 0 0.75rem",
};

const CALLOUT: CSSProperties = {
  background: "rgba(31,61,46,0.06)",
  borderLeft: `3px solid ${FOREST}`,
  padding: "0.6rem 0.85rem",
  margin: "0.75rem 0",
  borderRadius: "0 4px 4px 0",
};

const CALLOUT_TEXT: CSSProperties = {
  fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
  fontSize: "0.82rem",
  lineHeight: 1.65,
  color: EVERGREEN,
  margin: 0,
  fontStyle: "italic",
};

const TWO_COL: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1.1rem",
  margin: "0.5rem 0 0.85rem",
};

const COL_BOX: CSSProperties = {
  background: "white",
  borderRadius: 5,
  border: "1px solid rgba(31,61,46,0.12)",
  padding: "0.65rem 0.8rem",
};

const COL_LABEL: CSSProperties = {
  fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
  fontSize: "0.59rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  color: RUST,
  margin: "0 0 0.35rem",
};

const COL_BODY: CSSProperties = {
  fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
  fontSize: "0.78rem",
  lineHeight: 1.6,
  color: INK,
  margin: 0,
};

const BULLET_ROW: CSSProperties = {
  display: "flex",
  gap: "0.5rem",
  alignItems: "flex-start",
  marginBottom: "0.45rem",
};

const BULLET_MARK: CSSProperties = {
  color: RUST,
  fontWeight: 700,
  fontSize: "0.8rem",
  flexShrink: 0,
  lineHeight: 1.65,
};

const BULLET_TEXT: CSSProperties = {
  fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
  fontSize: "0.82rem",
  lineHeight: 1.65,
  color: INK,
};

const FOOTER: CSSProperties = {
  position: "absolute",
  bottom: "0.6in",
  left: "0.9in",
  right: "0.9in",
  borderTop: `1px solid rgba(31,61,46,0.2)`,
  paddingTop: "0.3rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const FOOTER_TEXT: CSSProperties = {
  fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
  fontSize: "0.65rem",
  color: MUTED,
};

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <div style={BULLET_ROW}>
      <span style={BULLET_MARK}>→</span>
      <span style={BULLET_TEXT}>{children}</span>
    </div>
  );
}

export function NANTreaty9ContextBriefPage() {
  return (
    <div style={PAGE}>
      {/* Header band */}
      <div style={HEADER_BAND}>
        <p style={LABEL}>Codetry Aboriginal Outreach — Context Brief</p>
        <h1 style={H1}>Treaty 9 Territory &amp; Nishnawbe Aski Nation</h1>
        <p style={SUBHEAD}>
          Understanding the geography, the communities, and the Standby supply model — June 2026
        </p>
      </div>

      {/* Opening */}
      <p style={BODY}>
        This brief orients the Codetry outreach team to the Treaty 9 context before approaching communities
        that NAN has not yet reached. It covers the territory, the logistics realities, and how the Standby
        supply model positions a community-owned store pilot as a viable first step.
      </p>

      {/* Section 1 — Territory */}
      <p style={SECTION_TITLE}>1. Treaty 9 Territory — The Land</p>
      <p style={BODY}>
        Treaty 9 (the James Bay Treaty, 1905–1906) covers the vast boreal interior of Northern Ontario —
        roughly 330,000 square kilometres of the Hudson Bay and James Bay watersheds. The territory
        extends from the height of land north of Lake Superior all the way to the shores of James Bay,
        taking in the Moose River, Albany River, and Attawapiskat River drainages.
      </p>
      <div style={TWO_COL}>
        <div style={COL_BOX}>
          <p style={COL_LABEL}>Geography</p>
          <p style={COL_BODY}>
            Boreal shield and James Bay Lowlands. Vast distances between communities.
            Most accessible only by fly-in year-round or winter road (January–March).
            No permanent road corridor to the majority of NAN communities.
          </p>
        </div>
        <div style={COL_BOX}>
          <p style={COL_LABEL}>Communities</p>
          <p style={COL_BODY}>
            NAN represents 49 First Nations in the Treaty 9 and Treaty 5 area of Northern Ontario.
            Total membership exceeds 45,000 people. Communities range from 200 to 2,500 residents.
            Many have no locally owned grocery or general store.
          </p>
        </div>
      </div>

      {/* Section 2 — NAN as introduction pathway */}
      <p style={SECTION_TITLE}>2. NAN as the Introduction Pathway</p>
      <p style={BODY}>
        Nishnawbe Aski Nation (NAN) is the political and social advocacy organization representing
        49 First Nations in Northern Ontario. NAN is the appropriate first door — not individual band
        councils — because:
      </p>
      <BulletItem>NAN carries existing trust relationships with member communities built over decades of advocacy.</BulletItem>
      <BulletItem>A NAN introduction signals regional legitimacy; arriving directly at a band office without it is slower and more fragile.</BulletItem>
      <BulletItem>NAN's economic development portfolio is actively looking for infrastructure models that keep ownership local — Codetry aligns directly with that mandate.</BulletItem>
      <BulletItem>If NAN endorses a pilot in one community, adjacent communities can reference that endorsement. A regional rollout becomes possible without separate cold-approach cycles.</BulletItem>

      <div style={CALLOUT}>
        <p style={CALLOUT_TEXT}>
          "The ask to NAN leadership is not a sales pitch — it is a request for a warm introduction to one
          community ready to run a six-week planning engagement. The community stays in control at every step."
        </p>
      </div>

      {/* Section 3 — Food Infrastructure Reality */}
      <p style={SECTION_TITLE}>3. Remote Food Infrastructure — The Problem on the Ground</p>
      <p style={BODY}>
        Food access in Treaty 9 communities is among the most constrained in Canada. Northern stores operated
        under southern ownership models charge prices three to five times higher than urban Ontario. Community
        freezers and dry-good storage are often inadequate or nonexistent. Nutrition North subsidies flow to
        retailer accounts, not to communities.
      </p>
      <div style={TWO_COL}>
        <div style={COL_BOX}>
          <p style={COL_LABEL}>The structural gap</p>
          <p style={COL_BODY}>
            Communities have no leverage over the stores that serve them. When a private operator exits,
            there is no local capacity to take over — no trained coordinator, no inventory system, no
            supplier relationships in community hands.
          </p>
        </div>
        <div style={COL_BOX}>
          <p style={COL_LABEL}>What Codetry addresses</p>
          <p style={COL_BODY}>
            A Codetry engagement builds the internal capacity — coordinator trained, software owned,
            supplier accounts established — so that if the external operator leaves, the community can
            run the store themselves. Ownership stays north.
          </p>
        </div>
      </div>

      {/* Section 4 — Standby Supply Model */}
      <p style={SECTION_TITLE}>4. The Standby Supply Model</p>
      <p style={BODY}>
        The Standby model is the 807 Food Co-operative's infrastructure approach to serving remote Treaty 9
        communities. Rather than one-off shipments, it establishes a predictable supply pipeline:
      </p>
      <BulletItem>
        <strong>Scheduled consolidation:</strong> Orders from multiple communities are consolidated at the 807 hub in Thunder Bay before each winter-road or charter flight window.
      </BulletItem>
      <BulletItem>
        <strong>Standby inventory:</strong> Core staples — dry goods, shelf-stable proteins, canning supplies — are held at the hub on a rolling basis so communities can draw down without a full purchasing cycle each time.
      </BulletItem>
      <BulletItem>
        <strong>Community coordinator as the link:</strong> The Codetry-trained community coordinator manages the local receiving, storage, and reorder cycle. The coordinator is a local hire — the knowledge and the job stay in community.
      </BulletItem>
      <BulletItem>
        <strong>Nutrition North integration:</strong> Where applicable, Nutrition North subsidy flows are aligned with the Standby order schedule so communities capture the full benefit without additional administrative load.
      </BulletItem>

      <div style={CALLOUT}>
        <p style={CALLOUT_TEXT}>
          "The Standby model is not a charity delivery program. It is a predictable, community-managed
          supply relationship. The community coordinator decides what comes in and when. No southern operator
          in the loop after handoff."
        </p>
      </div>

      {/* Section 5 — Outreach approach */}
      <p style={SECTION_TITLE}>5. Outreach Approach for Treaty 9 Communities</p>
      <BulletItem>
        <strong>Start with NAN Grand Council:</strong> Request a 20-minute introduction call with the Economic Development portfolio. Present the generic NAN intro letter and this context brief.
      </BulletItem>
      <BulletItem>
        <strong>Ask for one community referral:</strong> The ask is a single warm introduction to a band council that has expressed interest in local food infrastructure or community store development.
      </BulletItem>
      <BulletItem>
        <strong>Present the Pilot Proposal early:</strong> The four-phase pilot proposal makes the scope concrete — communities can see exactly what six weeks looks like and what they will own at the end.
      </BulletItem>
      <BulletItem>
        <strong>Name the Standby connection:</strong> Every Treaty 9 conversation should reference the 807 Standby supply model by name — it demonstrates that the supply chain problem is already partially solved.
      </BulletItem>
      <BulletItem>
        <strong>No pressure on timeline:</strong> Treaty 9 communities operate on their own decision cycles. The packet is designed to leave something behind and let leadership consult internally before responding.
      </BulletItem>

      {/* Footer */}
      <div style={FOOTER}>
        <span style={FOOTER_TEXT}>
          Headwaters Development Services · Wabigoon, Ontario — Treaty 3 Territory
        </span>
        <span style={FOOTER_TEXT}>
          ourheadwaters.ca · bobbie@ourheadwaters.ca · 807 220 3654
        </span>
      </div>
    </div>
  );
}

export default function NANTreaty9ContextBrief() {
  return (
    <>
      <PrintNav
        targetId="nan-treaty9-context-brief-target"
        filename="headwaters-nan-treaty9-context-brief.pdf"
      />
      <div id="nan-treaty9-context-brief-target">
        <NANTreaty9ContextBriefPage />
      </div>
    </>
  );
}
