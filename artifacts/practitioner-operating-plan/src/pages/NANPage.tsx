import { useLocation } from "wouter";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const T = {
  bg:     "#1f3d2e",
  paper:  "#f4ede0",
  text:   "#2a2520",
  muted:  "#7a7a6e",
  rule:   "rgba(200,191,167,0.35)",
  accent: "#b85a3e",
  teal:   "#1F5446",
  slate:  "#3D4A5C",
  purple: "#5B3E8C",
};

interface Point { label: string; body: string }
interface Block { title: string; badge: string; color: string; points: Point[] }

const BLOCKS: Block[] = [
  {
    title: "Who NAN is",
    badge: "THE ORGANIZATION",
    color: T.teal,
    points: [
      {
        label: "Nishnawbe Aski Nation",
        body: "Nishnawbe Aski Nation (NAN) is a political territorial organization representing 49 First Nation communities across Treaty 9 and Treaty 5 territories in northern Ontario — roughly two-thirds of the province by land area. NAN advocates for its member communities on governance, economic development, land rights, health, and social issues. It is not a service delivery organization itself; it is a political representative body that creates the conditions for community-level programs.",
      },
      {
        label: "Why NAN is in the pipeline",
        body: "NAN communities face the exact economic conditions the Headwaters model is designed for: remote geography, limited supply chain access, high food costs, youth economic displacement, and under-resourced local governance infrastructure. A NAN-level relationship doesn't mean one community engagement — it means a pathway to 49 communities, a policy relationship, and potential program-level funding for community store development across the territory.",
      },
      {
        label: "The strategic case",
        body: "Deer Lake is a NAN community. If the Deer Lake engagement succeeds and produces a documented model — Phase 1 deliverable in hand, Phase 2 underway — NAN becomes the natural next conversation. The question isn't 'why would NAN be interested?' It's 'what does NAN need to see before it's interested?' The answer is Deer Lake working.",
      },
      {
        label: "NAN vs. individual band councils",
        body: "NAN sets the political context; band councils make the operational decisions. An outreach to NAN leadership is not the same as an engagement with a specific community. The value of a NAN relationship is legitimacy and warm introduction — not direct contract. The engagement model still flows through each community's own governance process.",
      },
    ],
  },
  {
    title: "Why this is a pipeline item, not an active engagement",
    badge: "STATUS",
    color: T.purple,
    points: [
      {
        label: "First outreach not yet sent",
        body: "As of May 2026, no outreach to NAN has been sent. This is not an oversight — it's sequencing. The right NAN conversation happens after Deer Lake is in motion. Approaching NAN before the Deer Lake model has any evidence is an unsolicited cold pitch. Approaching NAN with Deer Lake underway is a practitioner sharing results with the political body that represents the community involved.",
      },
      {
        label: "The correct timing",
        body: "Send first NAN outreach when: (1) Deer Lake Phase 1 is contracted and underway, OR (2) the Deer Lake model has produced a written deliverable that can be referenced. Whichever comes first. The conversation doesn't need Deer Lake to be complete — it needs Deer Lake to be real.",
      },
      {
        label: "What the first outreach looks like",
        body: "One paragraph. Who Headwaters is. What the store-in-a-box model does. That it's currently engaged with a NAN community (Deer Lake). Ask for a 30-minute call with whoever at NAN handles community economic development or food sovereignty files. No deck. No proposal. Just the door.",
      },
      {
        label: "Who to reach",
        body: "NAN has technical advisory staff and program-level leads who handle economic development and community infrastructure. The right contact is not the Grand Chief — it's the director or coordinator who advises communities on store development, food security, or local economic programs. That person knows which communities have capacity and appetite for this kind of engagement.",
      },
    ],
  },
  {
    title: "What the conversation is about when it happens",
    badge: "THE PITCH",
    color: T.teal,
    points: [
      {
        label: "The store-in-a-box model",
        body: "Headwaters builds the operational infrastructure for community-owned stores in remote northern communities: hiring plans, operations guides, supply chain connections (through 807), grant roadmaps, and a plain-language management framework designed for community staff — not outside consultants. The first engagement is an 8-week discovery, not a permanent management contract.",
      },
      {
        label: "Why this isn't another southern consultant",
        body: "Headwaters is based in Wabigoon, Ontario. The 807 co-op supply chain connection runs through northwestern Ontario. The model is designed with winter road access, remote logistics, and small-community governance in mind. This isn't a big-city firm adapting a generic framework to a northern context. It's a northern practitioner building for the specific reality NAN communities face.",
      },
      {
        label: "What NAN can do",
        body: "NAN can validate, introduce, and amplify — but it doesn't decide for communities. The most useful thing NAN can do is: identify two or three communities that have been asking about store infrastructure, offer a warm introduction, and provide a letter of support for the grant applications that accompany the engagement. Each of those things is valuable.",
      },
      {
        label: "The grant landscape angle",
        body: "Community food infrastructure funding — through INAC, FedNor, provincial programs, and national Indigenous food sovereignty initiatives — is often accessed more effectively through an established political organization like NAN. A NAN letter of support or a program-level endorsement can be the difference between a $50k grant and a $250k grant for a community store development project.",
      },
    ],
  },
  {
    title: "First action — what to do this week",
    badge: "NEXT MOVE",
    color: T.accent,
    points: [
      {
        label: "If Deer Lake is contracted: draft the outreach note",
        body: "Write one paragraph: who Headwaters is, that you're working with Deer Lake (a NAN community) on a community store model, and that you'd like to share what you're building with whoever at NAN handles community economic development. Ask for 30 minutes. That's the whole note.",
      },
      {
        label: "If Deer Lake is not yet contracted: hold",
        body: "Don't approach NAN before the Deer Lake engagement is real. Use the waiting period to research the right NAN contact, understand the organization's current priorities (check their website and any recent press), and draft the outreach note so it's ready to send the day Deer Lake is signed.",
      },
      {
        label: "Research task: find the right contact",
        body: "Before sending anything, identify the specific person at NAN who handles community store development, food security, or economic infrastructure. NAN's organizational structure is public. The right contact is likely a technical director or program coordinator, not an executive. Get a name before sending anything generic.",
      },
    ],
  },
];

function Block({ b }: { b: Block }) {
  return (
    <div style={{ borderRadius: 10, border: `1px solid ${T.rule}`, overflow: "hidden", marginBottom: 14 }}>
      <div style={{ padding: "10px 16px", backgroundColor: b.color, display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#fff" }}>
          {b.badge}
        </span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 600, fontFamily: "var(--font-display, Georgia, serif)" }}>
          {b.title}
        </span>
      </div>
      <div style={{ backgroundColor: T.paper }}>
        {b.points.map((p, i) => (
          <div
            key={p.label}
            style={{ padding: "14px 16px", borderBottom: i < b.points.length - 1 ? `1px solid ${T.rule}` : "none", display: "flex", gap: 12 }}
          >
            <div style={{ width: 3, borderRadius: 2, backgroundColor: b.color, flexShrink: 0, alignSelf: "stretch", minHeight: 16 }} />
            <div>
              <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: b.color, margin: "0 0 5px" }}>
                {p.label}
              </p>
              <p style={{ fontSize: 13, color: T.text, lineHeight: 1.65, margin: 0 }}>
                {p.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NANPage() {
  const [, navigate] = useLocation();

  return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: "28px 16px 64px", fontFamily: "var(--font-body, Inter, sans-serif)" }}>

      <button
        onClick={() => navigate(`${BASE}/clients`)}
        style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: T.muted, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 20 }}
      >
        ← Clients
      </button>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{
            fontSize: 9, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" as const,
            padding: "3px 8px", borderRadius: 4,
            background: "rgba(91,62,140,0.12)", color: T.purple,
          }}>
            Pipeline
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
            First outreach not yet sent
          </span>
        </div>
        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: T.slate, margin: "0 0 8px" }}>
          Nishnawbe Aski Nation · Northern Ontario
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, color: T.paper, fontFamily: "var(--font-display, Georgia, serif)", margin: "0 0 10px" }}>
          NAN — Prospective Relationship
        </h1>
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
          NAN represents 49 First Nation communities across Treaty 9 and 5 territory. The right conversation
          happens after Deer Lake is underway. First outreach not yet sent — hold until the Deer Lake engagement is contracted.
        </p>
      </div>

      {/* Status callout */}
      <div style={{ padding: "14px 16px", borderRadius: 8, background: "rgba(91,62,140,0.08)", border: `1px solid rgba(91,62,140,0.22)`, marginBottom: 24 }}>
        <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: T.purple, margin: "0 0 6px" }}>
          Sequencing note
        </p>
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.65, margin: 0 }}>
          Do not approach NAN before Deer Lake is contracted. Approaching NAN with Deer Lake underway is a practitioner sharing results
          with the political body that represents the community involved. Approaching NAN before is an unsolicited cold pitch. The difference matters.
        </p>
      </div>

      {BLOCKS.map((b) => <Block key={b.badge} b={b} />)}

      <div style={{ marginTop: 28, padding: "14px 16px", borderRadius: 8, backgroundColor: "rgba(61,74,92,0.1)", border: `1px solid rgba(61,74,92,0.22)` }}>
        <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: T.slate }}>Pipeline status — May 2026.</strong>{" "}
          First outreach not sent. Waiting on Deer Lake contract. Outreach note is drafted and ready.
          Research task: identify the correct NAN contact for community economic development before sending anything.
        </p>
      </div>

    </div>
  );
}
