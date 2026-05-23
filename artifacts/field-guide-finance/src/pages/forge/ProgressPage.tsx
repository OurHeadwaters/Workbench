import { useLocation } from "wouter";
import { FORGE_MODULES, ELEMENT_MAP } from "@/data/forgeData";
import { getForgeProgress, getFaction, getLibrary } from "@/lib/forgeStorage";
import { ForgeNav } from "@/components/forge/ForgeNav";

export function ProgressPage() {
  const [, navigate] = useLocation();
  const progress = getForgeProgress();
  const faction = getFaction();
  const library = getLibrary();
  const factionEl = faction ? ELEMENT_MAP[faction] : null;

  const pct = FORGE_MODULES.length > 0
    ? Math.round((progress.completedModules.length / FORGE_MODULES.length) * 100)
    : 0;

  return (
    <div className="forge-bg" style={{ minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <ForgeNav active="progress" />

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px 64px" }}>
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
          Your Record
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight: 700,
            color: "var(--forge-light)",
            marginBottom: 36,
          }}
        >
          Architectural Mastery
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 18,
            marginBottom: 36,
          }}
        >
          <StatCard
            value={`${pct}%`}
            label="Modules complete"
            sub={`${progress.completedModules.length} of ${FORGE_MODULES.length}`}
            accent="var(--forge-orange)"
          />
          <StatCard
            value={String(library.length)}
            label="Patterns named"
            sub="in Blueprint Library"
            accent="#C9A84C"
          />
          <StatCard
            value={factionEl ? factionEl.emoji + " " + factionEl.name : "None"}
            label="Faction affinity"
            sub={factionEl ? factionEl.pillar : "Choose on landing"}
            accent={factionEl?.color ?? "var(--forge-muted)"}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--forge-light)" }}>
              Module progress
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--forge-muted)" }}>{pct}%</span>
          </div>
          <div
            style={{
              height: 8,
              borderRadius: 6,
              backgroundColor: "rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                borderRadius: 6,
                background: "linear-gradient(90deg, var(--forge-orange), #C9A84C)",
                transition: "width 0.6s ease",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
          {FORGE_MODULES.map((mod) => {
            const done = progress.completedModules.includes(mod.id);
            return (
              <div
                key={mod.id}
                style={{
                  padding: "14px 18px",
                  borderRadius: 10,
                  border: `1px solid ${done ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.06)"}`,
                  backgroundColor: done ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.02)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--forge-light)", marginBottom: 2 }}>
                    {mod.conceptName}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "var(--forge-muted)" }}>
                    {mod.pillar}
                  </p>
                </div>
                {done ? (
                  <span style={{ color: "#C9A84C", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
                    ✓ Complete
                  </span>
                ) : (
                  <button
                    onClick={() => navigate(`/forge/module/${mod.id}`)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 7,
                      border: "none",
                      backgroundColor: "var(--forge-orange)",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "0.78rem",
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                      flexShrink: 0,
                      minHeight: 36,
                    }}
                  >
                    Start
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {library.length > 0 && (
          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--forge-light)", marginBottom: 14 }}>
              Recent blueprints
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {library.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "var(--forge-light)", fontWeight: 600 }}>
                    {entry.name}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "var(--forge-muted)" }}>
                    {new Date(entry.timestamp).toLocaleDateString("en-CA")}
                  </span>
                </div>
              ))}
            </div>
            {library.length > 5 && (
              <button
                onClick={() => navigate("/forge/library")}
                style={{
                  marginTop: 10,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--forge-orange)",
                  fontSize: "0.82rem",
                  fontFamily: "var(--font-sans)",
                  padding: 0,
                }}
              >
                View all {library.length} blueprints →
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ value, label, sub, accent }: { value: string; label: string; sub: string; accent: string }) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)",
        backgroundColor: "rgba(255,255,255,0.03)",
      }}
    >
      <p style={{ fontSize: "1.6rem", fontWeight: 700, color: accent, lineHeight: 1, marginBottom: 6 }}>
        {value}
      </p>
      <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--forge-light)", marginBottom: 2 }}>
        {label}
      </p>
      <p style={{ fontSize: "0.72rem", color: "var(--forge-muted)" }}>{sub}</p>
    </div>
  );
}
