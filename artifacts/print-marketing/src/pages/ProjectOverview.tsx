interface Tool {
  icon: string;
  name: string;
  subtitle: string;
  color: string;
  desc: string;
  layer: "core" | "support";
  href?: string;
}

export default function ProjectOverview() {
  const tools: Tool[] = [
    {
      icon: "📖",
      name: "The Handbook",
      subtitle: "Codetry Handbook",
      color: "var(--evergreen)",
      desc: "Where you start. A plain-language guide that teaches the Headwaters way of working — how to scope a job, how to hand it over, and how a community can run its own economy.",
      layer: "core",
    },
    {
      icon: "📋",
      name: "Practitioner's Guide",
      subtitle: "Practitioners Guide V2",
      color: "var(--evergreen-mid)",
      desc: "Where your work lives. A structured reference that tracks each engagement — the scope, the phases, the decisions, and the handover. Keeps every project honest.",
      layer: "core",
    },
    {
      icon: "📚",
      name: "The Accounts",
      subtitle: "Headwaters Books",
      color: "var(--evergreen-light)",
      desc: "Where the money is recorded. Tracks what came in, what went out, and what the work delivered — so the community always knows where it stands financially.",
      layer: "core",
    },
    {
      icon: "🔬",
      name: "Research Library",
      subtitle: "Northern Food Systems Library",
      color: "var(--rust)",
      desc: "The evidence base. A curated collection of research, reports, and links about northern food systems — so every decision is grounded in real data, not guesswork.",
      layer: "support",
    },
    {
      icon: "🖨️",
      name: "Print Marketing Suite",
      subtitle: "Headwaters Print Marketing",
      color: "var(--rust-dark)",
      desc: "The paper layer. Print-ready flyers, posters, rack cards, and forms for every public-facing moment — from the farmers market table to a band council pitch.",
      layer: "support",
    },
    {
      icon: "🚢",
      name: "Crew Manifest",
      subtitle: "Codetry Ship",
      color: "var(--ink)",
      desc: "The team board. Shows who is on which project, what role they fill, and how the crew fits together — so nothing falls through the cracks when things get busy.",
      layer: "support",
    },
    {
      icon: "🗄️",
      name: "Media Library",
      subtitle: "Headwaters API",
      color: "#3a5c6e",
      desc: "The file vault. Stores photos, documents, and media assets so every other tool can pull from one reliable source — no more hunting for the right version of a logo.",
      layer: "support",
    },
    {
      icon: "★",
      name: "North Star",
      subtitle: "Daily operating cockpit",
      color: "var(--evergreen)",
      desc: "The engine room. A live dashboard that shows what needs attention today, tracks every client engagement from scope to hand-off, and keeps money coming in and going out in plain view.",
      layer: "support",
    },
    {
      icon: "⬡",
      name: "The Stomping Grounds",
      subtitle: "thestompinggrounds.com",
      href: "https://thestompinggrounds.com",
      color: "#4a7c59",
      desc: "The public front door. Five stations where neighbours, visitors, and prospective partners can explore the discipline, find their footing, and decide how they want to engage — no login, no commitment required.",
      layer: "support",
    },
  ];

  const coreTools = tools.filter((t) => t.layer === "core");
  const supportTools = tools.filter((t) => t.layer === "support");

  const WORDS = ["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve"];
  const toWord = (n: number) => WORDS[n] ?? String(n);
  const totalCount = toWord(tools.length);
  const supportCount = toWord(supportTools.length).toLowerCase();

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "var(--font-sans)" }}>
      {/* ── Print stylesheet ── */}
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .overview-header { background: white !important; color: var(--ink) !important; border-bottom: 2px solid var(--evergreen) !important; }
          .overview-header h1 { color: var(--ink) !important; }
          .overview-header p { color: var(--muted) !important; }
          .tool-card { box-shadow: none !important; border: 1px solid #ccc !important; break-inside: avoid; }
          .flow-arrow { color: #555 !important; }
          .flow-section { break-inside: avoid; }
          .support-section { break-inside: avoid; }
          @page { margin: 0.75in; size: letter portrait; }
        }
      `}</style>

      {/* ── Header ── */}
      <div
        className="overview-header"
        style={{
          background: "var(--evergreen)",
          color: "white",
          padding: "2.5rem 1.5rem 2rem",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p
            className="no-print"
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: 0.65,
              marginBottom: "0.6rem",
            }}
          >
            Headwaters Development Services
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: "0.75rem",
            }}
          >
            {totalCount} simple tools.<br />One community economy.
          </h1>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.65,
              opacity: 0.85,
              maxWidth: 520,
            }}
          >
            Headwaters is a set of connected tools that help a northern community plan its work, track its money, build its skills, and own its future — without depending on outside systems.
          </p>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1.25rem 4rem" }}>

        {/* ── Core flow section ── */}
        <div className="flow-section">
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--evergreen)",
              marginBottom: "1rem",
            }}
          >
            The core flow — learn → track → account
          </p>

          {coreTools.map((tool, i) => (
            <div key={tool.name}>
              {/* Tool card */}
              <div
                className="tool-card"
                style={{
                  background: "white",
                  borderRadius: 10,
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                  boxShadow: "0 2px 12px rgba(31,61,46,0.09)",
                  borderLeft: `4px solid ${tool.color}`,
                }}
              >
                <span style={{ fontSize: "2rem", lineHeight: 1, flexShrink: 0, marginTop: 2 }}>
                  {tool.icon}
                </span>
                <div>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "0.4rem", marginBottom: "0.3rem" }}>
                    <h2
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: "var(--ink)",
                      }}
                    >
                      {tool.name}
                    </h2>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: tool.color,
                        opacity: 0.8,
                      }}
                    >
                      {tool.subtitle}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.6 }}>
                    {tool.desc}
                  </p>
                </div>
              </div>

              {/* Arrow connector between core tools */}
              {i < coreTools.length - 1 && (
                <div
                  className="flow-arrow"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "0.4rem 0",
                    color: "var(--evergreen-light)",
                  }}
                >
                  <div
                    style={{
                      width: 2,
                      height: 10,
                      background: "var(--evergreen-light)",
                      opacity: 0.5,
                    }}
                  />
                  <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>↓</span>
                  <p
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--evergreen-light)",
                      margin: "0.15rem 0 0",
                    }}
                  >
                    {i === 0 ? "then track your work in" : "and the money flows to"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div
          style={{
            margin: "2rem 0 1.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "rgba(31,61,46,0.18)" }} />
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              whiteSpace: "nowrap",
            }}
          >
            Supporting layers
          </p>
          <div style={{ flex: 1, height: 1, background: "rgba(31,61,46,0.18)" }} />
        </div>

        {/* ── Support tools ── */}
        <div
          className="support-section"
          style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
        >
          <p
            style={{
              fontSize: "0.82rem",
              color: "var(--muted)",
              lineHeight: 1.55,
              marginBottom: "0.25rem",
            }}
          >
            These {supportCount} tools back up the core flow — they hold the evidence, the materials, the team, the files, the daily operating view, and the public front door that everything else draws from.
          </p>

          {supportTools.map((tool) => (
            <div
              key={tool.name}
              className="tool-card"
              style={{
                background: "white",
                borderRadius: 10,
                padding: "1rem 1.25rem",
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
                boxShadow: "0 2px 10px rgba(31,61,46,0.07)",
                borderLeft: `4px solid ${tool.color}`,
              }}
            >
              <span style={{ fontSize: "1.6rem", lineHeight: 1, flexShrink: 0, marginTop: 2 }}>
                {tool.icon}
              </span>
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "0.4rem", marginBottom: "0.2rem" }}>
                  <h2
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "var(--ink)",
                    }}
                  >
                    {tool.name}
                  </h2>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: tool.color,
                      opacity: 0.75,
                    }}
                  >
                    {tool.subtitle}
                  </span>
                  {tool.href && (
                    <a
                      href={tool.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-print"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.2rem",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: tool.color,
                        textDecoration: "none",
                        border: `1px solid ${tool.color}`,
                        borderRadius: "3px",
                        padding: "0.12rem 0.4rem",
                        opacity: 0.75,
                        lineHeight: 1,
                      }}
                    >
                      Open ↗
                    </a>
                  )}
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.55 }}>
                  {tool.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── How it fits together callout ── */}
        <div
          style={{
            marginTop: "2.25rem",
            padding: "1.25rem 1.5rem",
            background: "rgba(31,61,46,0.07)",
            borderRadius: 10,
            borderLeft: "4px solid var(--evergreen)",
          }}
        >
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--evergreen)",
              marginBottom: "0.5rem",
            }}
          >
            How it all connects
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--ink)", lineHeight: 1.7 }}>
            <strong>The Handbook</strong> teaches you how Headwaters works.{" "}
            <strong>The Practitioner's Guide</strong> captures each job you do.{" "}
            <strong>The Accounts</strong> keep the money honest. Behind them:{" "}
            the <strong>Research Library</strong> grounds decisions in real evidence,
            the <strong>Print Suite</strong> puts everything on paper,
            the <strong>Crew Manifest</strong> shows who's doing what,
            the <strong>Media Library</strong> keeps the files in one place,
            <strong>North Star</strong> is the daily operating cockpit that keeps it all on track,
            and <a href="https://thestompinggrounds.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--evergreen)", textDecoration: "underline" }}>The Stomping Grounds</a> is the public front door where anyone can find their footing first.
            {totalCount} simple tools. One system. Yours.
          </p>
        </div>

        {/* ── Footer ── */}
        <div
          className="no-print"
          style={{
            marginTop: "2.5rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(31,61,46,0.12)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
            Headwaters Development Services · {new Date().getFullYear()}
          </span>
          <button
            onClick={() => window.print()}
            style={{
              background: "var(--evergreen)",
              color: "white",
              border: "none",
              borderRadius: 6,
              padding: "0.45rem 1rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              fontFamily: "var(--font-sans)",
              cursor: "pointer",
              letterSpacing: "0.03em",
            }}
          >
            Print this page
          </button>
        </div>
      </div>
    </div>
  );
}
