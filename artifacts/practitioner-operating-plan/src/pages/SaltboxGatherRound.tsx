const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const T = {
  bg:     "#1f3d2e",
  paper:  "#f4ede0",
  text:   "#2a2520",
  muted:  "#7a7a6e",
  rule:   "rgba(200,191,167,0.35)",
  accent: "#b85a3e",
  teal:   "#1F5446",
  slate:  "#4B6070",
  gold:   "#8B6914",
};

interface Point { label: string; body: string }
interface Block { title: string; badge: string; color: string; points: Point[] }

const BLOCKS: Block[] = [
  {
    title: "What this is",
    badge: "THE OPPORTUNITY",
    color: T.teal,
    points: [
      {
        label: "Gather Round Legacy Pass",
        body: "Gather Round is a homeschool curriculum company. Their Legacy Pass gives families lifetime access to the full curriculum library — but delivery is entirely download-based. Families manage folders, PDFs, and content files manually across devices. That's friction every single week.",
      },
      {
        label: "Saltbox is the easy button",
        body: "Saltbox (built on the Codetry/Saily framework) is a local-first app that hosts content on-device, syncs offline, and organises materials so families don't have to. For a Legacy Pass holder, Saltbox would mean: log in once, your curriculum is there, works without internet, always current.",
      },
      {
        label: "The identity layer — XRPL NFT",
        body: "A Legacy Pass holder's ownership is verified via an XRPL NFT credential. Saltbox reads that credential without calling back to Gather Round's server. The pass travels with the family — not with a download link. This is the technical core that makes the partnership real rather than just a referral arrangement.",
      },
      {
        label: "Why this matters to Headwaters",
        body: "Saltbox already needs to exist for the Codetry model to reach homeschooling communities in the north. If Gather Round families become early users, Saltbox gains a proven customer base, a credibility story, and a revenue path — before a single NAN community is formally onboarded.",
      },
    ],
  },
  {
    title: "Three revenue paths",
    badge: "ROI OPTIONS",
    color: T.slate,
    points: [
      {
        label: "Option A — Freemium + licensing",
        body: "Saltbox is free for verified Gather Round Legacy Pass holders. Headwaters earns a per-verified-user licensing fee from Gather Round — paid quarterly. Low friction for families. Gather Round retains the billing relationship. Headwaters scales revenue with adoption without charging families directly.",
      },
      {
        label: "Option B — Bundle",
        body: "Gather Round bundles Saltbox access as a premium add-on at Legacy Pass renewal or as a standalone upgrade. Families pay Gather Round a higher price; Headwaters receives a revenue share. This positions Saltbox as an official Gather Round product — not a third-party integration.",
      },
      {
        label: "Option C — Concierge",
        body: "Headwaters charges families directly for a one-time setup + ongoing support subscription. $97–$197 setup, $12–$19/month. This path requires no Gather Round partnership at all — it works with any content the family already owns. Slower to scale but highest margin and full independence.",
      },
      {
        label: "Recommended starting posture",
        body: "Begin with Option A framing when you contact Gather Round — it asks least of them and removes the 'charging families more' objection. Keep Option C in your back pocket as the fallback that proves the model doesn't depend on their cooperation.",
      },
    ],
  },
  {
    title: "Three-track roadmap",
    badge: "WHAT TO BUILD AND WHEN",
    color: T.gold,
    points: [
      {
        label: "Track 1 — Core product polish (Weeks 1–2)",
        body: "Offline content delivery, device sync, folder-free organisation. This is what makes Saltbox worth pitching. A demo that shows a family loading curriculum content on an iPad without internet — no folder management — is the whole argument. Build this first regardless of whether Gather Round says yes.",
      },
      {
        label: "Track 2 — Proof of concept (Weeks 2–4)",
        body: "XRPL NFT credential for Legacy Pass simulation. Build a test pass, verify it in Saltbox, demonstrate the offline sync flow. Run with 3–5 test families who already own the Legacy Pass. Capture their friction-reduction story in one paragraph each. This is the evidence package you bring to Gather Round.",
      },
      {
        label: "Track 3 — Make contact (Weeks 3–4, parallel)",
        body: "Research Gather Round's leadership — likely a small family-owned operation, founder-led. Find the right contact (not a support inbox). Prepare a one-page pitch: the problem you solve for their customers, the credential architecture, one revenue option to react to. The goal of the first contact is a 20-minute call, not a signed agreement.",
      },
      {
        label: "What a successful 4-week sprint looks like",
        body: "You have a working demo. You have 3 user stories from real families. You have sent one warm, specific outreach message to one real person at Gather Round. You are in conversation — not waiting on a decision. Everything else is optional.",
      },
    ],
  },
  {
    title: "Risks and honest limits",
    badge: "WHAT COULD GO WRONG",
    color: T.accent,
    points: [
      {
        label: "Gather Round may not be interested",
        body: "They may see a third-party app as a distraction, a liability, or a brand dilution risk. Their customer relationship is valuable to them. If they say no, Option C still works — and the XRPL credential architecture makes Saltbox interoperable with any other content provider who wants it.",
      },
      {
        label: "NFT language is a red flag for many families",
        body: "Call it a 'digital credential' or 'verified access pass' in any family-facing communication. The XRPL infrastructure is a back-end detail. Families don't need to know what blockchain it sits on — they need to know it's private, secure, and not connected to a speculative asset.",
      },
      {
        label: "Saltbox requires real technical investment",
        body: "Offline sync, credential verification, and content delivery across platforms is not a weekend project. The 4-week sprint above assumes focused part-time development — probably Tyler's time. Scope against the Codetry Phase 2 timeline before committing.",
      },
      {
        label: "Don't let this crowd out Phase 1",
        body: "The Deer Lake Phase 1 engagement is the ground truth. Saltbox and Gather Round are a parallel track — a legitimate one — but not a replacement for the work that funds the operation. Timebox the exploration so it doesn't bleed into your core deliverables.",
      },
    ],
  },
  {
    title: "First action",
    badge: "YOUR NEXT MOVE",
    color: T.teal,
    points: [
      {
        label: "The one thing to do this week",
        body: "Write one paragraph that describes the Legacy Pass download problem in plain language — from the family's perspective, not from a product pitch. Read it to someone who homeschools. If they say 'yes, exactly' — you have your opening line for the Gather Round email.",
      },
      {
        label: "The email is not a pitch",
        body: "It is a problem statement followed by a question. Something like: 'I've been building a local-first app for homeschooling families and noticed Legacy Pass holders spend a lot of time managing files. Would it make sense to show you what I've built and see if it's useful to your customers?' That's it. Two sentences. One ask.",
      },
      {
        label: "Do not pitch the NFT in the first email",
        body: "Lead with the problem. Lead with the family experience. If you get a call, bring the credential architecture as the answer to 'how does that work?' — not as the opening hook.",
      },
    ],
  },
  {
    title: "She's building the team — we build the tools",
    badge: "LIVE INTELLIGENCE · MAY 2026",
    color: T.teal,
    points: [
      {
        label: "What the hiring post tells us",
        body: "Gather Round is actively hiring a 'Data Entry and Software Implementation Clerk' to handle course, subscription, membership, and enrollment data migrations. The role description — 80 wpm typing, file import/export, copy/paste between systems — is a manual workaround for a missing tech stack. They are paying a person to do what software should do automatically. This confirms they are mid-migration, the problem is live, and the timing is real.",
      },
      {
        label: "Do not lead with job replacement",
        body: "Pitching 'I could save you from hiring 2–3 people' creates anxiety in a founder who's already mid-process. She has momentum. Stalling a hire she's already committed to feels like a threat, not an opportunity — even if you're right. The people-first, community-driven nature of Gather Round's brand makes this doubly risky. Do not open with subtraction.",
      },
      {
        label: "The right pitch — compound the human value",
        body: "What to actually say: 'You're building a team to run your new offerings. I can build the platform before your new hires start — so they walk in on day one with working infrastructure instead of a data migration project. Your clerk becomes a Platform Administrator. Your team's time goes to relationships and growth rather than spreadsheets and file imports. The system compounds: each person you hire becomes more effective, not more dependent on manual process.' This is the Codetry model stated plainly. It's also true.",
      },
      {
        label: "Blockchain membership — hold for the second conversation",
        body: "The flexibility angle is real and compelling: a blockchain-anchored membership platform means she can add NFT-based tiers, transferable passes, alumni credentials, or resale-protected content — without rebuilding from scratch when her offerings evolve. But surface this after she says yes to the base build. Lead with the problem her clerk will solve. Offer the blockchain architecture as 'why this doesn't hit a ceiling the way a Kajabi or Teachable build does.' It's the answer to a question she'll ask once she's already bought in, not the hook that gets her there.",
      },
      {
        label: "The full hiring picture — 11 open positions",
        body: "Gather Round is not making one or two hires. They have 11 open roles: Video Editor, Customer Experience Specialist, Education Sales Coordinator, Media Buyer, Administrative Assistant, Designer (Promotional), Illustrator, Online Academy Teacher, Warehouse Labourer, Writer, and Data Entry & Software Implementation Clerk. This is a company in full-scale build mode — standing up new revenue streams, content delivery, and operations all at once. The timing is not incidental.",
      },
      {
        label: "Roles the platform directly reduces",
        body: "Data Entry & Software Implementation Clerk — this role exists entirely because they lack the right tooling. A working membership + content sync platform eliminates 80–90% of its stated scope. Administrative Assistant — automated enrollment, membership status management, and communications routing cuts admin overhead significantly. One person can carry what they're currently sizing for two or three. These two alone represent the core ROI argument.",
      },
      {
        label: "Roles the platform amplifies",
        body: "Customer Experience Specialist — a self-service member portal, automated order status, and a knowledge base let one CX person carry 3x the ticket volume without burning out. Education Sales Coordinator — automated enrollment funnels and a sales tracking dashboard mean the coordinator spends time on relationships, not manual follow-up. Online Academy Teacher — the course delivery platform is the infrastructure the teacher needs; better tooling means more students per teacher without adding more teachers.",
      },
      {
        label: "Roles with no honest tech angle",
        body: "Warehouse Labourer — physical fulfilment, no tech play. Illustrator and Designer (Promotional) — creative work, not reduceable by platform. Video Editor — same. Writer — content management tools help marginally but don't replace the creative function. Media Buyer — analytics tooling can sharpen their work but a platform build doesn't change the headcount equation here. Be honest about which roles you touch and which you don't.",
      },
      {
        label: "What this adds up to — internal framing only",
        body: "A well-built membership and content platform plausibly touches 5 of the 11 roles — directly reducing 2, meaningfully amplifying 3. That is a strong ROI case for you to hold internally. It is not the opening line. The pitch to her remains: your team arrives to working infrastructure instead of a backlog. She will do the math on headcount herself, in her own time, with her own numbers.",
      },
    ],
  },
];

function Block({ b }: { b: Block }) {
  return (
    <div style={{
      borderRadius: 10,
      border: `1px solid ${T.rule}`,
      overflow: "hidden",
      marginBottom: 14,
    }}>
      <div style={{
        padding: "10px 16px",
        backgroundColor: b.color,
        display: "flex",
        alignItems: "baseline",
        gap: 10,
      }}>
        <span style={{
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: "0.22em",
          textTransform: "uppercase" as const,
          color: "#fff",
        }}>
          {b.badge}
        </span>
        <span style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.75)",
          fontWeight: 600,
          fontFamily: "var(--font-display, Georgia, serif)",
        }}>
          {b.title}
        </span>
      </div>
      <div style={{ backgroundColor: T.paper }}>
        {b.points.map((p, i) => (
          <div
            key={p.label}
            style={{
              padding: "14px 16px",
              borderBottom: i < b.points.length - 1 ? `1px solid ${T.rule}` : "none",
              display: "flex",
              gap: 12,
            }}
          >
            <div style={{
              width: 3,
              borderRadius: 2,
              backgroundColor: b.color,
              flexShrink: 0,
              alignSelf: "stretch",
              minHeight: 16,
            }} />
            <div>
              <p style={{
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                color: b.color,
                margin: "0 0 5px",
              }}>
                {p.label}
              </p>
              <p style={{
                fontSize: 13,
                color: T.text,
                lineHeight: 1.65,
                margin: 0,
              }}>
                {p.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SaltboxGatherRound() {
  return (
    <div style={{
      maxWidth: 660,
      margin: "0 auto",
      padding: "28px 16px 64px",
      fontFamily: "var(--font-body, Inter, sans-serif)",
    }}>

      {/* Back */}
      <a
        href={`${BASE}/`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 11,
          color: T.muted,
          textDecoration: "none",
          marginBottom: 20,
        }}
      >
        ← Lobby
      </a>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: T.slate,
          margin: "0 0 8px",
        }}>
          Saltbox × Gather Round · Partnership & ROI Strategy
        </p>
        <h1 style={{
          fontSize: 28,
          fontWeight: 600,
          lineHeight: 1.2,
          color: T.paper,
          fontFamily: "var(--font-display, Georgia, serif)",
          margin: "0 0 10px",
        }}>
          The Offline Curriculum Easy Button
        </h1>
        <p style={{
          fontSize: 13,
          color: T.muted,
          lineHeight: 1.6,
          margin: 0,
          maxWidth: 520,
        }}>
          Saltbox solves the download management problem for Gather Round Legacy Pass families.
          This brief covers the partnership case, three revenue paths, a four-week roadmap,
          and what honest risk looks like.
        </p>
      </div>

      {/* KPI strip */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 10,
        marginBottom: 24,
      }}>
        {[
          { label: "Revenue options", value: "3", note: "Freemium · Bundle · Concierge" },
          { label: "Roadmap tracks", value: "3", note: "Polish · Proof · Contact" },
          { label: "Sprint target", value: "4 wk", note: "Demo + user stories + outreach" },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              backgroundColor: "rgba(244,237,224,0.07)",
              border: `1px solid ${T.rule}`,
              borderRadius: 8,
              padding: "12px 14px",
            }}
          >
            <p style={{ fontSize: 22, fontWeight: 700, color: T.paper, margin: "0 0 2px", lineHeight: 1 }}>
              {k.value}
            </p>
            <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase", color: T.slate, margin: "0 0 3px" }}>
              {k.label}
            </p>
            <p style={{ fontSize: 10, color: T.muted, margin: 0, lineHeight: 1.4 }}>
              {k.note}
            </p>
          </div>
        ))}
      </div>

      {/* Content blocks */}
      {BLOCKS.map((b) => <Block key={b.badge} b={b} />)}

      {/* Footer note */}
      <div style={{
        marginTop: 28,
        padding: "14px 16px",
        borderRadius: 8,
        backgroundColor: "rgba(75,96,112,0.12)",
        border: `1px solid rgba(75,96,112,0.25)`,
      }}>
        <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: T.slate }}>Prepared for Saily / Saltbox Operating Plan.</strong>{" "}
          This brief is a strategic planning document — not a pitch deck. Use it to think through the
          opportunity before committing development time. Cross-reference with the{" "}
          <a href="/practitioners-guide-v2/sarge" style={{ color: T.slate }}>Sarge HQ</a> operational view
          and the{" "}
          <a href={`${BASE}/deer-lake-roadmap`} style={{ color: T.slate }}>Deer Lake Roadmap</a>{" "}
          to ensure the sprint timeline fits within Phase 1 capacity.
        </p>
      </div>

    </div>
  );
}
