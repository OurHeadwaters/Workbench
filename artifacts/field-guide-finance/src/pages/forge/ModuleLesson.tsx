import { useRoute, useLocation } from "wouter";
import { FORGE_MODULES } from "@/data/forgeData";
import { ForgeNav } from "@/components/forge/ForgeNav";
import { getSaladinAnecdote } from "@/lib/forgeCastleTips";

export function ModuleLesson() {
  const [, params] = useRoute("/forge/module/:moduleId");
  const [, navigate] = useLocation();
  const moduleId = params?.moduleId;
  const mod = FORGE_MODULES.find((m) => m.id === moduleId);

  if (!mod) {
    return (
      <div className="forge-bg" style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--forge-light)", textAlign: "center" }}>
          <p>Module not found.</p>
          <button onClick={() => navigate("/forge/modules")} style={{ color: "var(--forge-orange)", background: "none", border: "none", cursor: "pointer", marginTop: 12, fontFamily: "var(--font-sans)" }}>
            ← Back to Modules
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="forge-bg" style={{ minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <ForgeNav active="modules" />

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px 80px" }}>
        <button
          onClick={() => navigate("/forge/modules")}
          style={{
            background: "none",
            border: "none",
            color: "var(--forge-muted)",
            fontSize: "0.8rem",
            cursor: "pointer",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: 0,
            fontFamily: "var(--font-sans)",
          }}
        >
          ← All Modules
        </button>

        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--forge-orange)",
            marginBottom: 8,
          }}
        >
          {mod.pillar}
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 700,
            color: "var(--forge-light)",
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          {mod.conceptName}
        </h1>
        <p
          style={{
            fontStyle: "italic",
            color: "var(--forge-muted)",
            fontSize: "0.9rem",
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          "{mod.principle}"
        </p>

        <div
          className="forge-prose"
          style={{ marginBottom: 40 }}
          dangerouslySetInnerHTML={{ __html: markdownToHtml(mod.lessonBody) }}
        />

        <div
          style={{
            padding: "20px 24px",
            borderRadius: 12,
            border: "1px solid rgba(255,107,43,0.3)",
            backgroundColor: "rgba(255,107,43,0.07)",
            marginBottom: 32,
          }}
        >
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--forge-orange)",
              marginBottom: 6,
            }}
          >
            Your starting canvas
          </p>
          <p style={{ fontSize: "0.88rem", color: "var(--forge-muted)", lineHeight: 1.6 }}>
            {mod.startingNodes.length > 0
              ? `${mod.startingNodes.length} node${mod.startingNodes.length > 1 ? "s" : ""} pre-placed. ${mod.startingConnections.length > 0 ? `${mod.startingConnections.length} connection${mod.startingConnections.length > 1 ? "s" : ""} established.` : "No connections — build them yourself."}`
              : "Blank canvas — place your own nodes."}
            {" "}Your goal: reach a stable Reckoning, then name what you built.
          </p>
        </div>

        <SaladinBlock pillar={mod.pillar} />

        <button
          onClick={() => navigate(`/forge/build?module=${mod.id}`)}
          style={{
            padding: "12px 28px",
            borderRadius: 10,
            border: "none",
            backgroundColor: "var(--forge-orange)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            minHeight: 44,
          }}
        >
          Enter The Forge →
        </button>
      </main>
    </div>
  );
}

function SaladinBlock({ pillar }: { pillar: string }) {
  const pillarKey = pillar.split(" / ")[0].toLowerCase();
  const anecdote = getSaladinAnecdote(pillarKey);
  if (!anecdote) return null;
  return (
    <div
      style={{
        margin: "32px 0",
        padding: "20px 22px",
        borderRadius: 12,
        border: "1px solid rgba(201,168,76,0.25)",
        backgroundColor: "rgba(201,168,76,0.05)",
        position: "relative",
      }}
    >
      <p
        style={{
          fontSize: "0.62rem",
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#C9A84C",
          marginBottom: 6,
        }}
      >
        Wisdom from the Field — Saladin
      </p>
      <h3
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1rem",
          fontWeight: 700,
          color: "#f0e8d0",
          marginBottom: 10,
        }}
      >
        {anecdote.heading}
      </h3>
      <p
        style={{
          fontSize: "0.85rem",
          color: "rgba(240,232,208,0.65)",
          lineHeight: 1.7,
          fontStyle: "italic",
          marginBottom: 12,
        }}
      >
        {anecdote.body}
      </p>
      <p
        style={{
          fontSize: "0.8rem",
          color: "#C9A84C",
          lineHeight: 1.6,
          borderTop: "1px solid rgba(201,168,76,0.15)",
          paddingTop: 10,
          margin: 0,
        }}
      >
        {anecdote.lesson}
      </p>
    </div>
  );
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^---$/gm, '<hr>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|b|p|u|o|l|s])(.+)$/gm, '$1')
    .replace(/(<\/p>)?$/, '</p>')
    .replace(/^(<p>)?/, '<p>');
}
