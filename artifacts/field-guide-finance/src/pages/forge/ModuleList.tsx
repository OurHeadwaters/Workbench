import { useLocation } from "wouter";
import { FORGE_MODULES } from "@/data/forgeData";
import { getForgeProgress } from "@/lib/forgeStorage";
import { ForgeNav } from "@/components/forge/ForgeNav";

export function ModuleList() {
  const [, navigate] = useLocation();
  const progress = getForgeProgress();

  return (
    <div className="forge-bg" style={{ minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <ForgeNav active="modules" />

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 64px" }}>
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
          Learning Path
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
          Modules
        </h1>
        <p style={{ color: "var(--forge-muted)", fontSize: "0.9rem", lineHeight: 1.65, marginBottom: 36 }}>
          Each module introduces one structural concept. Read the lesson, then build it in The Forge, survive The Reckoning, and name what you made.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {FORGE_MODULES.map((mod, i) => {
            const done = progress.completedModules.includes(mod.id);
            return (
              <div
                key={mod.id}
                style={{
                  borderRadius: 14,
                  border: `1px solid ${done ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.08)"}`,
                  backgroundColor: done ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.03)",
                  padding: "22px 24px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: done ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.06)",
                    border: `2px solid ${done ? "#C9A84C" : "rgba(255,255,255,0.15)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: done ? "#C9A84C" : "var(--forge-muted)",
                  }}
                >
                  {done ? "✓" : i + 1}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--forge-orange)",
                      marginBottom: 4,
                    }}
                  >
                    {mod.pillar}
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "var(--forge-light)",
                      marginBottom: 6,
                    }}
                  >
                    {mod.conceptName}
                  </h2>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--forge-muted)",
                      fontStyle: "italic",
                      lineHeight: 1.55,
                    }}
                  >
                    "{mod.principle}"
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/forge/module/${mod.id}`)}
                  style={{
                    flexShrink: 0,
                    padding: "8px 16px",
                    borderRadius: 9,
                    border: "none",
                    backgroundColor: done ? "rgba(201,168,76,0.15)" : "var(--forge-orange)",
                    color: done ? "#C9A84C" : "#fff",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    minHeight: 44,
                    alignSelf: "center",
                  }}
                >
                  {done ? "Review" : "Start →"}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 36, textAlign: "center" }}>
          <button
            onClick={() => navigate("/forge/build")}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.15)",
              backgroundColor: "transparent",
              color: "var(--forge-muted)",
              fontWeight: 600,
              fontSize: "0.88rem",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              minHeight: 44,
            }}
          >
            Or open The Forge freely →
          </button>
        </div>
      </main>
    </div>
  );
}
