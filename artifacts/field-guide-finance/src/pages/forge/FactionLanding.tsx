import { useLocation } from "wouter";
import { ELEMENTS } from "@/data/forgeData";
import { setFaction, getFaction } from "@/lib/forgeStorage";
import type { ElementId } from "@/data/forgeData";

export function FactionLanding() {
  const [, navigate] = useLocation();
  const current = getFaction();

  function chooseFaction(id: ElementId) {
    setFaction(id);
    navigate("/forge/modules");
  }

  return (
    <div className="forge-bg" style={{ minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "48px 24px 64px",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: "var(--forge-muted)",
            fontSize: "0.8rem",
            cursor: "pointer",
            marginBottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: 0,
            fontFamily: "var(--font-sans)",
          }}
        >
          ← Back to Hub
        </button>

        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--forge-orange)",
            marginBottom: 12,
          }}
        >
          Crypto Castle — The Forge
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 700,
            color: "var(--forge-light)",
            lineHeight: 1.15,
            marginBottom: 12,
          }}
        >
          Choose Your Faction
        </h1>
        <p
          style={{
            color: "var(--forge-muted)",
            fontSize: "0.95rem",
            lineHeight: 1.7,
            maxWidth: 520,
            marginBottom: 40,
          }}
        >
          Each element maps to a preparedness pillar and a real blockchain structural claim. Your faction shapes how you approach the build — but The Reckoning doesn't care about faction. It speaks in structure.
        </p>

        {current && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 8,
              backgroundColor: "rgba(255,107,43,0.12)",
              border: "1px solid rgba(255,107,43,0.3)",
              marginBottom: 24,
              fontSize: "0.8rem",
              color: "var(--forge-orange)",
              fontWeight: 600,
            }}
          >
            Current faction: {ELEMENTS.find((e) => e.id === current)?.emoji}{" "}
            {ELEMENTS.find((e) => e.id === current)?.factionName}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {ELEMENTS.map((el) => (
            <button
              key={el.id}
              onClick={() => chooseFaction(el.id)}
              style={{
                textAlign: "left",
                background: current === el.id ? `rgba(${hexToRgb(el.color)},0.15)` : "rgba(255,255,255,0.04)",
                border: `1px solid ${current === el.id ? el.color : "rgba(255,255,255,0.1)"}`,
                borderRadius: 14,
                padding: "22px 20px",
                cursor: "pointer",
                transition: "transform 0.18s, box-shadow 0.18s, border-color 0.18s",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontFamily: "var(--font-sans)",
                minHeight: 44,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 32px ${el.glowColor}`;
                (e.currentTarget as HTMLButtonElement).style.borderColor = el.color;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                (e.currentTarget as HTMLButtonElement).style.borderColor = current === el.id ? el.color : "rgba(255,255,255,0.1)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 26 }}>{el.emoji}</span>
                <div>
                  <div style={{ color: el.color, fontWeight: 700, fontSize: "1rem" }}>
                    {el.name}
                  </div>
                  <div style={{ color: "var(--forge-muted)", fontSize: "0.72rem", marginTop: 1 }}>
                    {el.pillar}
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "var(--forge-light)",
                  letterSpacing: "0.02em",
                }}
              >
                {el.factionName}
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--forge-muted)", lineHeight: 1.55, margin: 0 }}>
                {el.factionDesc}
              </p>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--forge-muted)",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  paddingTop: 8,
                  fontStyle: "italic",
                }}
              >
                {el.ecosystems.join(" · ")}
              </div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <button
            onClick={() => navigate("/forge/modules")}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "var(--forge-muted)",
              borderRadius: 10,
              padding: "10px 20px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontFamily: "var(--font-sans)",
              minHeight: 44,
            }}
          >
            Skip — enter without a faction →
          </button>
        </div>
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
