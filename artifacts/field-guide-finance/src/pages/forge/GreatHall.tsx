import { useLocation } from "wouter";
import { FACTION_RIVALRIES, ELEMENT_MAP } from "@/data/forgeData";
import { ForgeNav } from "@/components/forge/ForgeNav";

export function GreatHall() {
  const [, navigate] = useLocation();

  return (
    <div className="forge-bg" style={{ minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <ForgeNav active="great-hall" />

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
          The Great Hall
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
          Faction Rivalries
        </h1>
        <p style={{ color: "var(--forge-muted)", fontSize: "0.9rem", marginBottom: 8, lineHeight: 1.6 }}>
          These are structural tensions between elements — each one maps to a real design trade-off in blockchain architecture.
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 12px",
            borderRadius: 6,
            border: "1px solid rgba(255,107,43,0.3)",
            backgroundColor: "rgba(255,107,43,0.08)",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--forge-orange)",
            marginBottom: 32,
          }}
        >
          Faction Voice — not structural
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {FACTION_RIVALRIES.map((r, i) => {
            const [e1id, e2id] = r.elements;
            const e1 = ELEMENT_MAP[e1id];
            const e2 = ELEMENT_MAP[e2id];
            return (
              <div
                key={i}
                style={{
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  padding: "22px 24px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{e1.emoji}</span>
                    <span style={{ color: e1.color, fontWeight: 700, fontSize: "0.9rem" }}>
                      {e1.name}
                    </span>
                  </div>
                  <span style={{ color: "var(--forge-muted)", fontSize: "0.8rem" }}>vs</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{e2.emoji}</span>
                    <span style={{ color: e2.color, fontWeight: 700, fontSize: "0.9rem" }}>
                      {e2.name}
                    </span>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--forge-muted)",
                    marginBottom: 8,
                  }}
                >
                  Structural tension
                </p>
                <p style={{ fontSize: "0.88rem", color: "var(--forge-light)", marginBottom: 14, lineHeight: 1.6 }}>
                  {r.tension}
                </p>

                <div
                  style={{
                    borderRadius: 8,
                    backgroundColor: "rgba(255,107,43,0.07)",
                    border: "1px solid rgba(255,107,43,0.18)",
                    padding: "12px 16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--forge-orange)",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Faction Voice
                  </span>
                  <p
                    style={{
                      fontSize: "0.87rem",
                      color: "var(--forge-muted)",
                      lineHeight: 1.65,
                      margin: 0,
                      fontStyle: "italic",
                    }}
                  >
                    {r.factionVoice}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
