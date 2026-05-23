import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getLibrary, deleteFromLibrary, type BlueprintEntry } from "@/lib/forgeStorage";
import { ELEMENT_MAP } from "@/data/forgeData";
import { ForgeNav } from "@/components/forge/ForgeNav";

export function BlueprintLibrary() {
  const [library, setLibrary] = useState<BlueprintEntry[]>([]);
  const [, navigate] = useLocation();

  useEffect(() => {
    setLibrary(getLibrary());
  }, []);

  function handleDelete(id: string) {
    deleteFromLibrary(id);
    setLibrary(getLibrary());
  }

  return (
    <div className="forge-bg" style={{ minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <ForgeNav active="library" />

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 64px" }}>
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--forge-orange)",
            marginBottom: 8,
          }}
        >
          Codetry
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight: 700,
            color: "var(--forge-light)",
            marginBottom: 8,
          }}
        >
          Blueprint Library
        </h1>
        <p style={{ color: "var(--forge-muted)", fontSize: "0.9rem", lineHeight: 1.65, marginBottom: 36 }}>
          Patterns you've built, survived The Reckoning with, and named. Each name is a word you built yourself.
        </p>

        {library.length === 0 ? (
          <div
            style={{
              padding: "48px 32px",
              textAlign: "center",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.08)",
              backgroundColor: "rgba(255,255,255,0.02)",
            }}
          >
            <p style={{ fontSize: 32, marginBottom: 16 }}>📜</p>
            <p style={{ color: "var(--forge-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
              No blueprints yet. Build a stable pattern in The Forge, survive The Reckoning, and name it with Codetry.
            </p>
            <button
              onClick={() => navigate("/forge/modules")}
              style={{
                marginTop: 20,
                padding: "10px 20px",
                borderRadius: 9,
                border: "none",
                backgroundColor: "var(--forge-orange)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.88rem",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                minHeight: 44,
              }}
            >
              Start a module →
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 18,
            }}
          >
            {library.map((entry) => (
              <BlueprintCard key={entry.id} entry={entry} onDelete={() => handleDelete(entry.id)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function BlueprintCard({ entry, onDelete }: { entry: BlueprintEntry; onDelete: () => void }) {
  const elements = Object.entries(entry.elementCounts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div
      style={{
        borderRadius: 12,
        border: "1px solid rgba(201,168,76,0.25)",
        backgroundColor: "rgba(201,168,76,0.04)",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div>
        <p
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#C9A84C",
            marginBottom: 4,
          }}
        >
          Named Pattern
        </p>
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "var(--forge-light)",
            lineHeight: 1.3,
          }}
        >
          {entry.name}
        </h3>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {elements.map(([elId, count]) => {
          const el = ELEMENT_MAP[elId as keyof typeof ELEMENT_MAP];
          if (!el) return null;
          return (
            <span
              key={elId}
              style={{
                fontSize: "0.72rem",
                padding: "2px 8px",
                borderRadius: 5,
                backgroundColor: `${el.color}20`,
                color: el.color,
                fontWeight: 600,
                border: `1px solid ${el.color}40`,
              }}
            >
              {el.emoji} {count}× {el.name}
            </span>
          );
        })}
        <span
          style={{
            fontSize: "0.72rem",
            padding: "2px 8px",
            borderRadius: 5,
            backgroundColor: "rgba(255,255,255,0.06)",
            color: "var(--forge-muted)",
            fontWeight: 600,
          }}
        >
          {entry.connectionCount} connection{entry.connectionCount !== 1 ? "s" : ""}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 8,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span style={{ fontSize: "0.72rem", color: "var(--forge-muted)" }}>
          {new Date(entry.timestamp).toLocaleDateString("en-CA")}
        </span>
        <button
          onClick={onDelete}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.25)",
            fontSize: "0.75rem",
            padding: "2px 6px",
            fontFamily: "var(--font-sans)",
            minHeight: 36,
          }}
          title="Remove from library"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
