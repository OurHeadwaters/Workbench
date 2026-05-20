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
  gold:   "#8B6914",
};

interface Point { label: string; body: string }
interface Block { title: string; badge: string; color: string; points: Point[] }

const BLOCKS: Block[] = [
  {
    title: "Who Gilles is",
    badge: "THE CLIENT",
    color: T.teal,
    points: [
      {
        label: "G.M. Pepin Holdings — Gilles Pepin",
        body: "Gilles Pepin is the founder and principal of G.M. Pepin Holdings. He is an established operator with a business portfolio that has been running without dedicated operational support infrastructure. The engagement is not about fixing a broken business — it's about building the layer of professional support that a business at this scale has earned but doesn't yet have.",
      },
      {
        label: "The engagement framing",
        body: "This is a stepping-back engagement. Gilles wants to move from working in the business to working above it — with a practitioner alongside him who can hold the operational thread, surface what needs attention, and keep decisions organized. The value is not execution; it's the trusted presence that allows him to step back without things falling apart.",
      },
      {
        label: "The two-of-you framing",
        body: "From the May 2026 brief: this engagement works best when it's framed as two people who trust each other figuring out a transition together — not a consultant delivering a report. Gilles is the domain expert. Bobbie is the organizational practitioner. The output of the engagement is a business that Gilles understands more clearly and holds more lightly.",
      },
      {
        label: "Voice-note-first workflow",
        body: "Gilles communicates by voice note — this is the primary working channel. The workflow is: Gilles sends a voice note (question, update, or decision to make), Bobbie listens and responds with a short written synthesis, a clarifying question, or a structured option set. This isn't a workaround — it's the design. It keeps the engagement low-friction for Gilles and ensures nothing gets lost.",
      },
    ],
  },
  {
    title: "The $72k pre-paid structure",
    badge: "FINANCIAL TERMS",
    color: T.gold,
    points: [
      {
        label: "Total pre-paid: $72,000",
        body: "The engagement is pre-paid in full at $72,000. This structure eliminates the invoice-and-chase cycle, establishes serious mutual commitment, and allows Bobbie to plan delivery without cash flow uncertainty. For Gilles, it signals seriousness about the transition — this isn't exploratory; it's a funded engagement with a clear scope.",
      },
      {
        label: "Phase 1: Discovery — $28,000",
        body: "Phase 1 is an 8-week discovery engagement. The deliverable is a clear picture of the business: what Gilles actually owns and operates, where the load is concentrated, what he wants to hand off versus what he must keep, and what the organizational gaps are. At the end of Phase 1, Gilles has a document he can read and act on — not a slide deck.",
      },
      {
        label: "Phase 2: Run — funded from the $72k balance",
        body: "Phase 2 is active operational support — Bobbie running the coordination layer while Gilles steps into a less reactive role. Duration and scope are determined by the Phase 1 findings. The $44,000 balance funds this phase. It may be used as a retained monthly arrangement or as project-based deliverables depending on what Phase 1 surfaces.",
      },
      {
        label: "Phase 3: Step Back — outcome, not a date",
        body: "Phase 3 is the condition, not a calendar event: the moment when Gilles can go a week without needing to touch operational decisions, and nothing falls apart. That's the measure of success. Phase 3 isn't billed separately — it's the proof that Phase 2 worked.",
      },
    ],
  },
  {
    title: "The three-phase stepping-back plan",
    badge: "ENGAGEMENT ROADMAP",
    color: T.slate,
    points: [
      {
        label: "Discover — understand what Gilles actually holds",
        body: "Week 1–8. Map everything Gilles is currently responsible for — decisions, relationships, commitments, operational touchpoints. Interview him via voice notes. Synthesize into a written document. Identify: what he can let go of immediately, what needs a transition plan, and what must stay with him permanently. No decisions yet — just clarity.",
      },
      {
        label: "Run — build the layer that holds things while he steps back",
        body: "Month 3–6 (estimated). Based on Phase 1 findings: create the coordination structures, decision frameworks, and communication rhythms that allow Gilles to step out of the day-to-day without creating gaps. This might mean hiring, process design, a simple dashboard, or a regular briefing cadence — whatever Phase 1 identifies as the actual need.",
      },
      {
        label: "Step Back — the goal state",
        body: "The engagement is complete when Gilles has real freedom. Not 'mostly done' or 'almost there' — the actual ability to step back from operational decisions without consequence. This is tested, not declared. Bobbie and Gilles do a structured review at the end of Phase 2 to assess whether the conditions are met.",
      },
      {
        label: "What this is not",
        body: "This is not a management consulting engagement. There are no PowerPoint decks, no frameworks delivered for Gilles to implement himself, and no recommendations that require Gilles to do most of the work. The practitioner holds the thread. Gilles holds the decisions that only he can make.",
      },
    ],
  },
  {
    title: "How to work together — operating agreements",
    badge: "WORKING METHOD",
    color: T.teal,
    points: [
      {
        label: "Voice notes are the primary channel",
        body: "Gilles sends voice notes. Bobbie converts them into action. There is no expectation that Gilles will write structured messages, fill out forms, or prepare briefs. The voice note is the input; the synthesis is the output. This asymmetry is intentional — the practitioner absorbs the friction.",
      },
      {
        label: "Weekly rhythm: one structured touchpoint",
        body: "Once per week, Bobbie sends Gilles a short written brief: what moved this week, what's waiting on him, one decision he needs to make. Gilles responds by voice note. That's the full loop. Everything else is handled by Bobbie without escalating to Gilles.",
      },
      {
        label: "Response time expectation",
        body: "Gilles should expect responses within 24 hours on weekdays for routine synthesis. Urgent matters (a decision that's time-sensitive) get a same-day response flag. Bobbie doesn't go quiet — if something is taking longer, Gilles gets a one-line heads-up.",
      },
      {
        label: "What Gilles doesn't need to manage",
        body: "Gilles doesn't track deliverables, manage the engagement timeline, or remember what was decided in previous sessions. That's Bobbie's job. Gilles's job is to be available for the decisions that only he can make and to respond to voice note follow-ups when needed.",
      },
    ],
  },
  {
    title: "To start — the opening move",
    badge: "CALL TO ACTION",
    color: T.accent,
    points: [
      {
        label: "The first conversation",
        body: "The engagement opens with one unstructured 45-minute conversation — not an intake form, not an agenda. Bobbie asks three questions: What are you most tired of dealing with? What would a good week look like if nothing went wrong? What would change if you trusted someone to hold the things you currently hold alone? Everything else comes from those three answers.",
      },
      {
        label: "What Gilles needs to do to start",
        body: "Send one voice note. Anything — a question, a concern, a thing that's been nagging at him. It doesn't need to be organized or complete. It just needs to arrive. Bobbie takes it from there.",
      },
      {
        label: "What Bobbie does with the first voice note",
        body: "Transcribes it. Synthesizes it into three bullet points. Responds with one question that gets to the heart of what he's actually asking. That pattern — voice in, synthesis and question out — is the whole working method in miniature.",
      },
      {
        label: "Payment logistics",
        body: "The $28,000 Phase 1 fee is due before the first session begins. Payment details are in the engagement agreement. Gilles has the agreement. If there are questions about the structure, Bobbie is the right contact — not an admin or billing queue.",
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

export default function GMPHPage() {
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
            background: "rgba(31,84,70,0.15)", color: T.teal,
          }}>
            Active
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
            Client
          </span>
        </div>
        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: T.slate, margin: "0 0 8px" }}>
          G.M. Pepin Holdings · Development Services Engagement
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, color: T.paper, fontFamily: "var(--font-display, Georgia, serif)", margin: "0 0 10px" }}>
          GMPH — Stepping-Back Engagement
        </h1>
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
          A $72k pre-paid, three-phase engagement supporting Gilles Pepin to step back from operational decisions
          without losing hold of what matters. Voice-note-first workflow. Discovery starts at $28k.
        </p>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Total pre-paid", value: "$72k", note: "Full engagement, three phases" },
          { label: "Phase 1 fee", value: "$28k", note: "8-week Discovery" },
          { label: "Phases", value: "3", note: "Discover · Run · Step Back" },
        ].map((k) => (
          <div key={k.label} style={{ backgroundColor: "rgba(244,237,224,0.07)", border: `1px solid ${T.rule}`, borderRadius: 8, padding: "12px 14px" }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: T.paper, margin: "0 0 2px", lineHeight: 1 }}>{k.value}</p>
            <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: T.slate, margin: "0 0 3px" }}>{k.label}</p>
            <p style={{ fontSize: 10, color: T.muted, margin: 0, lineHeight: 1.4 }}>{k.note}</p>
          </div>
        ))}
      </div>

      {BLOCKS.map((b) => <Block key={b.badge} b={b} />)}

      <div style={{ marginTop: 28, padding: "14px 16px", borderRadius: 8, backgroundColor: "rgba(61,74,92,0.1)", border: `1px solid rgba(61,74,92,0.22)` }}>
        <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: T.slate }}>Engagement status — May 2026.</strong>{" "}
          $72k pre-paid. Phase 1 (Discovery) terms set. Voice-note workflow active.
          Phase 1 deliverable is a written clarity document — what Gilles holds, what can be handed off, and what the Phase 2 scope is.
        </p>
      </div>

    </div>
  );
}
