import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const GOLD = "#d4a017";
const CREAM = "#f4ede0";
const INK = "#1a1a1a";
const MUTED = "#5a6272";
const RUST = "#b04a2a";
const LAKE = "#2a6496";

const LETTER_W = "8.5in";
const LETTER_H = "11in";

const BASE_PAGE: React.CSSProperties = {
  width: LETTER_W,
  minHeight: LETTER_H,
  background: "#fff",
  boxSizing: "border-box",
  position: "relative",
  overflow: "hidden",
  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
};

const tools = [
  {
    id: "north-star",
    icon: "★",
    name: "North Star",
    subtitle: "Daily operating cockpit",
    color: EVERGREEN,
    what: "North Star is where the work gets done each day. It's the founder's home base — a dashboard that shows what needs attention right now, tracks every client engagement from start to hand-off, and keeps a live view of money coming in and going out. Everything that happens in the business runs through here first.",
    bullets: [
      "See today's priorities, open tasks, and active client files in one place.",
      "Run financial scenarios to plan for the months ahead.",
      "Track every engagement — what's scoped, what's been delivered, and what's next.",
      "Manage the five operational zones that make up the Headwaters constellation.",
      "Access a public-facing portal that shares select information with community partners.",
    ],
    why: "This is the engine room. Without it, nothing else in the ecosystem would stay on track.",
  },
  {
    id: "learning",
    icon: "◈",
    name: "Headwaters Learning",
    subtitle: "Financial field guide for food entrepreneurs",
    color: "#2e7d32",
    what: "Headwaters Learning is an online course built for food entrepreneurs in Northwestern Ontario — people selling at markets, running cottage preserves, or supplying small stores. It teaches the Headwaters money model in plain language, using a real business (Parr's Jars) as the worked example throughout.",
    bullets: [
      "Walk through a financial model built for northern, seasonal, small-batch producers.",
      "Learn how to price products so they actually cover your costs and build savings.",
      "Understand how cash flow shifts with the seasons — and how to plan for the gaps.",
      "See co-op economics explained simply: what you put in, what you get back.",
      "Track your progress through modules and return to any lesson at any time.",
    ],
    why: "Northern food businesses fail most often because of pricing and cash flow, not product quality. This course gives producers the knowledge to survive and grow.",
  },
  {
    id: "books",
    icon: "⊞",
    name: "Headwaters Books",
    subtitle: "Daily working ledger",
    color: LAKE,
    what: "Headwaters Books is the internal financial record for the agency. Every dollar that comes in or goes out gets logged here. Community members who contribute labour earn credits that flow into their personal envelopes. At month-end, the books get packaged and handed to the accountant.",
    bullets: [
      "Record every receipt, payment, and submission from food handlers.",
      "Track labour contributions from community members and assign earnings to their envelopes.",
      "Run a live profit-and-loss view so the business always knows where it stands.",
      "Complete month-end sign-offs and prepare clean packages for the accountant.",
      "Monitor pilot status and operational dashboards across active engagements.",
    ],
    why: "Transparent, accurate books are the foundation of a business the community can trust. This tool makes that possible without a full-time bookkeeper.",
  },
  {
    id: "library",
    icon: "⊖",
    name: "Research Library",
    subtitle: "Northern food systems evidence base",
    color: "#5c3317",
    what: "The Research Library is a curated collection of reports, research, and links about northern food systems, supply chain challenges, and community economic development. Anyone on the team can add a source; curators review what comes in. Nothing stays unsupported — every recommendation can be traced back to real evidence.",
    bullets: [
      "Browse and search hundreds of curated sources on northern food systems.",
      "Submit a URL or upload a file; it gets deduplicated and filed automatically.",
      "Read synthesis documents that summarize findings on specific problems.",
      "Review early-stage ideas and new sources before they enter the main collection.",
      "Trace any strategic decision back to the research that grounded it.",
    ],
    why: "Decisions made without evidence are guesses. This library ensures every recommendation Headwaters makes has real research behind it.",
  },
  {
    id: "print",
    icon: "◷",
    name: "Print Marketing Suite",
    subtitle: "The paper layer",
    color: RUST,
    what: "The Print Marketing Suite is the document toolkit for Headwaters — over forty print-ready materials organized into five zones. Flyers, posters, intro letters, pitch packets, governance cards, and internal forms. When a document needs to leave a screen and land on a table in a band office or at a farmers market, it comes from here.",
    bullets: [
      "Download a print-ready PDF of any document with one click.",
      "Choose from over 40 materials across identity, outreach, strategy, and operations.",
      "Personalize community-specific letters and proposals for individual band councils.",
      "Generate full outreach packets (intro + funding brief + proposal) as a single PDF.",
      "Preview exactly how a document will look in print before downloading.",
    ],
    why: "Paper still matters. A well-designed leave-behind in a chief's hands carries weight that a link in an email cannot.",
  },
  {
    id: "ship",
    icon: "◎",
    name: "Codetry Ship",
    subtitle: "Crew manifest and public outreach portal",
    color: "#3a5c6e",
    what: "Codetry Ship is the public face of the Headwaters crew. It shows who is on the team, what role each person fills, and what the agency offers. It also hosts the Odyssey — a self-paced journey for adults and youth who want to learn the Codetry discipline and understand how a community economy works from the inside out.",
    bullets: [
      "See the full crew — who is active, what they work on, and how they connect.",
      "Explore service descriptions and rate cards for community and organizational clients.",
      "Start the adult Odyssey: a guided path through the five Codetry disciplines.",
      "Walk youth through a simplified four-phase story explaining community economics.",
      "Access outreach tools built for care facilities and residential staff.",
    ],
    why: "Before any community signs an agreement, they need to understand who they are dealing with. This is where that trust starts.",
  },
  {
    id: "handbook",
    icon: "📖",
    name: "The Handbook",
    subtitle: "How a community runs its own economy",
    color: "#5a3e28",
    what: "The Handbook is the written record of the Codetry discipline — a practical guide to the Headwaters method, written in plain language so any community member can understand it. It lives as a mobile-friendly app so it can be read in the field, off-grid, without a data connection. The Pioneer Path walks readers through each of the five core stations with audio narration.",
    bullets: [
      "Read the full draft manuscript of the Headwaters economic discipline.",
      "Walk the Pioneer Path — a narrated, station-by-station journey through the method.",
      "Look up any term in the Glossary to understand exactly how it is used.",
      "Use the Word Walk tool to review and decide on vocabulary changes.",
      "Install the app on a phone and use it anywhere — no internet required.",
    ],
    why: "The whole point of Headwaters is that the community ends up owning the method, not just the results. The Handbook is how that knowledge gets transferred.",
  },
  {
    id: "api",
    icon: "⌀",
    name: "Village Board",
    subtitle: "Shared data layer",
    color: "#37474f",
    what: "The Village Board is the shared backend service that all other Headwaters tools draw from. It stores content, manages files, handles authentication, and delivers the handbook text, pioneer path data, and vocabulary definitions to whatever tool needs them. It is not a tool the founder opens and uses directly — it runs quietly in the background, keeping everything connected.",
    bullets: [
      "Stores photos, documents, and media assets for the whole ecosystem.",
      "Delivers handbook content, pioneer path audio, and vocabulary definitions on demand.",
      "Handles the creation and delivery of meeting kits and tester kits by email.",
      "Manages the library's file intake and deduplication pipeline.",
      "Keeps all tools synchronized so changes in one place reflect everywhere.",
    ],
    why: "Every other tool in this ecosystem works because this one runs reliably behind it. It is the shared infrastructure that makes the whole constellation possible.",
  },
];

function CoverPage() {
  return (
    <div
      id="ecosystem-guide-cover"
      style={{
        ...BASE_PAGE,
        background: EVERGREEN,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5in 1.25in",
        textAlign: "center",
      }}
    >
      {/* Gold top rule */}
      <div style={{ width: "3rem", height: "2px", background: GOLD, marginBottom: "2rem", opacity: 0.7 }} />

      {/* Eagle mark */}
      <svg width="100" height="82" viewBox="0 18 192 156" fill="none" style={{ marginBottom: "2rem" }}>
        <circle cx="95" cy="63" r="52" fill="rgba(212,160,23,0.45)" />
        <path d="M 95,62 C 80,56 60,48 38,40 C 24,35 10,32 4,34 C 14,41 34,47 58,57 C 73,63 87,67 95,69 Z" fill={CREAM} />
        <path d="M 95,62 C 110,56 130,48 152,40 C 166,35 180,32 186,34 C 176,41 156,47 132,57 C 117,63 103,67 95,69 Z" fill={CREAM} />
        <ellipse cx="95" cy="68" rx="9" ry="8" fill={CREAM} />
        <ellipse cx="95" cy="53" rx="7" ry="8" fill={CREAM} />
        <ellipse cx="96" cy="51" rx="5" ry="5.5" fill="#F5F2EC" />
        <path d="M 101,52 L 110,55 L 101,58 Z" fill={GOLD} />
        <path d="M 89,75 L 86,88 M 95,76 L 95,89 M 101,75 L 104,88" stroke={CREAM} strokeWidth="2" strokeLinecap="round" />
        <path d="M 7,35 L 1,27 M 15,32 L 10,23 M 24,30 L 20,21" stroke={CREAM} strokeWidth="2" strokeLinecap="round" />
        <path d="M 183,35 L 189,27 M 175,32 L 180,23 M 166,30 L 170,21" stroke={CREAM} strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* Eyebrow */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.62rem",
        letterSpacing: "0.38em",
        textTransform: "uppercase",
        color: `rgba(212,160,23,0.8)`,
        margin: "0 0 1.25rem",
      }}>
        Headwaters Development Services
      </p>

      {/* Title */}
      <h1 style={{
        fontFamily: "Fraunces, Georgia, serif",
        fontSize: "2.5rem",
        fontWeight: 700,
        color: CREAM,
        lineHeight: 1.1,
        margin: "0 0 0.75rem",
        letterSpacing: "-0.015em",
      }}>
        A Plain-Language Guide<br />to Every Tool We Run
      </h1>

      {/* Subtitle */}
      <p style={{
        fontFamily: "Fraunces, Georgia, serif",
        fontSize: "1.1rem",
        fontStyle: "italic",
        color: "rgba(244,237,224,0.65)",
        margin: "0 0 2.5rem",
      }}>
        Eight tools. One connected ecosystem.
      </p>

      {/* Gold rule */}
      <div style={{ width: "4rem", height: "1px", background: `rgba(212,160,23,0.45)`, marginBottom: "2.5rem" }} />

      {/* Intro */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.95rem",
        color: "rgba(244,237,224,0.82)",
        lineHeight: 1.75,
        maxWidth: "5.5in",
        margin: "0 0 2.5rem",
      }}>
        Headwaters runs eight connected tools that handle everything from daily operations
        to community outreach to financial record-keeping. This guide explains each one
        in plain language — what it does, what you can do with it, and why it matters.
        No technical knowledge required.
      </p>

      {/* Tool index chips */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        justifyContent: "center",
        maxWidth: "5.5in",
        marginBottom: "2.5rem",
      }}>
        {tools.map((t) => (
          <span key={t.id} style={{
            background: "rgba(244,237,224,0.1)",
            border: "1px solid rgba(244,237,224,0.2)",
            borderRadius: "3px",
            padding: "0.25rem 0.75rem",
            fontSize: "0.72rem",
            color: "rgba(244,237,224,0.75)",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.04em",
          }}>
            {t.name}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        position: "absolute",
        bottom: "0.5in",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: "1.5rem",
        alignItems: "center",
      }}>
        <span style={{ fontSize: "0.65rem", color: "rgba(244,237,224,0.35)", fontFamily: "'Inter', sans-serif", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          ourheadwaters.ca
        </span>
        <span style={{ color: "rgba(212,160,23,0.3)", fontSize: "0.5rem" }}>◆</span>
        <span style={{ fontSize: "0.65rem", color: "rgba(244,237,224,0.35)", fontFamily: "'Inter', sans-serif", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {new Date().getFullYear()}
        </span>
      </div>
    </div>
  );
}

function ToolSection({ tool, even }: { tool: typeof tools[0]; even: boolean }) {
  return (
    <div style={{
      padding: "0.5in 0",
      borderBottom: `1px solid rgba(31,61,46,0.1)`,
    }}>
      {/* Tool header row */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
        marginBottom: "0.85rem",
      }}>
        {/* Icon badge */}
        <div style={{
          width: "2.6rem",
          height: "2.6rem",
          borderRadius: "6px",
          background: tool.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.1rem",
          color: "#fff",
          flexShrink: 0,
          marginTop: "0.15rem",
        }}>
          {tool.icon}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "0.5rem" }}>
            <h2 style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: "1.35rem",
              fontWeight: 700,
              color: INK,
              margin: 0,
              lineHeight: 1.1,
            }}>
              {tool.name}
            </h2>
            <span style={{
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: tool.color,
              opacity: 0.85,
            }}>
              {tool.subtitle}
            </span>
          </div>
        </div>
      </div>

      {/* What it is */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.88rem",
        color: INK,
        lineHeight: 1.7,
        margin: "0 0 0.75rem",
      }}>
        {tool.what}
      </p>

      {/* Bullets */}
      <ul style={{
        margin: "0 0 0.75rem",
        paddingLeft: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.3rem",
      }}>
        {tool.bullets.map((b, i) => (
          <li key={i} style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.83rem",
            color: MUTED,
            lineHeight: 1.6,
            paddingLeft: "0.25rem",
          }}>
            {b}
          </li>
        ))}
      </ul>

      {/* Why it matters */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.6rem",
        padding: "0.55rem 0.75rem",
        background: even ? "rgba(31,61,46,0.05)" : "rgba(212,160,23,0.07)",
        borderLeft: `3px solid ${tool.color}`,
        borderRadius: "2px",
      }}>
        <span style={{
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: tool.color,
          flexShrink: 0,
          paddingTop: "0.15rem",
          fontFamily: "'Inter', sans-serif",
        }}>
          Why it matters
        </span>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.83rem",
          color: INK,
          lineHeight: 1.6,
          margin: 0,
          fontStyle: "italic",
        }}>
          {tool.why}
        </p>
      </div>
    </div>
  );
}

function ContentPage({ pageTools, pageNum }: { pageTools: typeof tools; pageNum: number }) {
  return (
    <div style={{
      ...BASE_PAGE,
      padding: "0.65in 0.85in 0.75in",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Page header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: "0.3rem",
        marginBottom: "0.15in",
        borderBottom: `2px solid ${EVERGREEN}`,
      }}>
        <span style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: "0.72rem",
          fontWeight: 600,
          color: EVERGREEN,
          letterSpacing: "0.04em",
        }}>
          Headwaters — Tool Guide
        </span>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.65rem",
          color: MUTED,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          {pageNum} / 4
        </span>
      </div>

      {/* Tool sections */}
      <div style={{ flex: 1 }}>
        {pageTools.map((t, i) => (
          <ToolSection key={t.id} tool={t} even={(i % 2) === 0} />
        ))}
      </div>

      {/* Page footer */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "0.3rem",
        marginTop: "0.2in",
        borderTop: `1px solid rgba(31,61,46,0.12)`,
      }}>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.6rem",
          color: "rgba(90,98,114,0.65)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          ourheadwaters.ca · Headwaters Development Services
        </span>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.6rem",
          color: GOLD,
          opacity: 0.7,
          letterSpacing: "0.08em",
        }}>
          {new Date().getFullYear()}
        </span>
      </div>
    </div>
  );
}

function ClosingPage() {
  return (
    <div style={{
      ...BASE_PAGE,
      padding: "0.65in 0.85in 0.75in",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Page header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: "0.3rem",
        marginBottom: "0.35in",
        borderBottom: `2px solid ${EVERGREEN}`,
      }}>
        <span style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: "0.72rem",
          fontWeight: 600,
          color: EVERGREEN,
          letterSpacing: "0.04em",
        }}>
          Headwaters — Tool Guide
        </span>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.65rem",
          color: MUTED,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          How it all connects
        </span>
      </div>

      {/* Headline */}
      <h2 style={{
        fontFamily: "Fraunces, Georgia, serif",
        fontSize: "1.75rem",
        fontWeight: 700,
        color: EVERGREEN,
        margin: "0 0 0.35in",
        lineHeight: 1.15,
      }}>
        Eight tools.<br />One system.<br />Yours.
      </h2>

      {/* Narrative */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.93rem",
        color: INK,
        lineHeight: 1.8,
        margin: "0 0 0.3in",
        maxWidth: "5.5in",
      }}>
        <strong>North Star</strong> is where the work gets managed day to day.{" "}
        <strong>Headwaters Learning</strong> gives food entrepreneurs the knowledge they need to stay in business.{" "}
        <strong>Headwaters Books</strong> keeps the money honest and the accountant happy.{" "}
        Behind those three:{" "}
        the <strong>Research Library</strong> ensures every decision has evidence behind it,{" "}
        the <strong>Print Marketing Suite</strong> translates strategy into physical materials,{" "}
        <strong>Codetry Ship</strong> shows who is on the team and what the agency offers,{" "}
        the <strong>Handbook</strong> captures the method so communities can run it themselves,{" "}
        and the <strong>Village Board</strong> runs quietly behind everything, keeping it all connected.
      </p>

      {/* Visual flow */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        margin: "0 0 0.35in",
      }}>
        {[
          { label: "Core flow", items: ["North Star", "Headwaters Learning", "Headwaters Books"], color: EVERGREEN },
          { label: "Supporting layer", items: ["Research Library", "Print Marketing Suite", "Codetry Ship"], color: RUST },
          { label: "Foundation", items: ["The Handbook", "Village Board"], color: LAKE },
        ].map((row) => (
          <div key={row.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{
              width: "1.1in",
              fontSize: "0.63rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: row.color,
              flexShrink: 0,
              fontFamily: "'Inter', sans-serif",
            }}>
              {row.label}
            </span>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {row.items.map((item, i) => (
                <span key={item} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span style={{
                    background: row.color,
                    color: "#fff",
                    borderRadius: "3px",
                    padding: "0.2rem 0.6rem",
                    fontSize: "0.78rem",
                    fontFamily: "'Inter', sans-serif",
                    whiteSpace: "nowrap",
                  }}>
                    {item}
                  </span>
                  {i < row.items.length - 1 && (
                    <span style={{ color: `${row.color}`, opacity: 0.5, fontSize: "0.75rem" }}>→</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Closing statement */}
      <div style={{
        padding: "0.6rem 0.9rem",
        background: "rgba(31,61,46,0.06)",
        borderLeft: `3px solid ${EVERGREEN}`,
        borderRadius: "2px",
        marginBottom: "0.4in",
      }}>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.88rem",
          color: INK,
          lineHeight: 1.7,
          margin: 0,
        }}>
          The goal of Headwaters has always been to build something that the community
          owns and runs — not something that keeps a consultant in the room forever.
          These eight tools are built to that standard. When the work is done,
          the system stays.
        </p>
      </div>

      {/* Contact block */}
      <div style={{
        display: "flex",
        gap: "2.5rem",
        padding: "0.5rem 0",
        borderTop: `1px solid rgba(31,61,46,0.15)`,
        borderBottom: `1px solid rgba(31,61,46,0.15)`,
        marginBottom: "auto",
      }}>
        {[
          { label: "Website", value: "ourheadwaters.ca" },
          { label: "Email", value: "bobbie@ourheadwaters.ca" },
          { label: "Phone", value: "807 220 3654" },
          { label: "Territory", value: "Treaty 3 · Wabigoon, ON" },
        ].map((item) => (
          <div key={item.label}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, margin: "0 0 0.15rem" }}>
              {item.label}
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: INK, margin: 0 }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Page footer */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "0.3rem",
        marginTop: "0.2in",
        borderTop: `1px solid rgba(31,61,46,0.12)`,
      }}>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.6rem",
          color: "rgba(90,98,114,0.65)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          ourheadwaters.ca · Headwaters Development Services
        </span>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.6rem",
          color: GOLD,
          opacity: 0.7,
          letterSpacing: "0.08em",
        }}>
          {new Date().getFullYear()}
        </span>
      </div>
    </div>
  );
}

export function EcosystemGuidePage() {
  const pages = [
    tools.slice(0, 2),
    tools.slice(2, 4),
    tools.slice(4, 6),
    tools.slice(6, 8),
  ];

  return (
    <div id="ecosystem-guide-doc">
      <CoverPage />
      {pages.map((pageTools, i) => (
        <ContentPage key={i} pageTools={pageTools} pageNum={i + 1} />
      ))}
      <ClosingPage />
    </div>
  );
}

export default function EcosystemGuide() {
  return (
    <div style={{ background: "#e8e4dc", minHeight: "100vh", padding: "1rem 0" }}>
      <PrintNav
        targetId="ecosystem-guide-doc"
        filename="headwaters-tool-guide.pdf"
        format="letter"
        orientation="portrait"
        paginate={true}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", paddingTop: "1rem" }}>
        <EcosystemGuidePage />
      </div>
    </div>
  );
}
