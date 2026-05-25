import React from "react";

const T = {
  bg: "#f4ede0",
  paper: "#faf7f2",
  dark: "#1f3d2e",
  text: "#2a2520",
  muted: "#7a7a6e",
  rule: "rgba(42,37,32,0.12)",

  z0: { bg: "#c4783a", border: "#8B4513", text: "#fff" },
  z1: { border: "#1f5c3a", label: "#1f5c3a" },
  z2: { border: "#2a5f8a", label: "#2a5f8a" },
  z3: { border: "#5a3d8a", label: "#5a3d8a" },
  z4: { border: "#8a6800", label: "#8a6800" },
  z5: { border: "#6b7665", label: "#6b7665" },

  eave: { bg: "rgba(107,118,101,0.25)", border: "#6b7665" },
  fracture: { bg: "rgba(180,140,20,0.18)", border: "#a07800", text: "#6b4800" },
  rebuild:  { bg: "rgba(30,100,60,0.15)",  border: "#1f5c3a", text: "#1f3d2e" },
  shatter:  { bg: "rgba(160,40,40,0.18)",  border: "#8B0000", text: "#6b0000" },
};

const INSET = 48;

function ZoneRing({ depth, color, label, children }: {
  depth: number; color: string; label: string; children?: React.ReactNode;
}) {
  const inset = depth * INSET;
  return (
    <div style={{
      position: "absolute",
      inset,
      border: `2px solid ${color}`,
      borderRadius: 4,
    }}>
      <span style={{
        position: "absolute",
        top: 6, left: 10,
        fontSize: 10, fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase" as const,
        color,
        background: T.paper,
        padding: "0 4px",
      }}>
        {label}
      </span>
      {children}
    </div>
  );
}

function Note({ text, x, y, w = 130, color = T.dark, bg = "rgba(255,255,255,0.85)", border = T.rule }: {
  text: string; x: number | string; y: number | string; w?: number;
  color?: string; bg?: string; border?: string;
}) {
  return (
    <div style={{
      position: "absolute",
      left: x, top: y,
      width: w,
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: 4,
      padding: "5px 8px",
      fontSize: 10,
      lineHeight: 1.45,
      color,
      fontWeight: 500,
      whiteSpace: "pre-line" as const,
      zIndex: 10,
    }}>{text}</div>
  );
}

function KitBox({ label, color, border, bg, children }: {
  label: string; color: string; border: string; bg: string; children: string;
}) {
  return (
    <div style={{
      background: bg, border: `2px solid ${border}`,
      borderRadius: 4, padding: "8px 10px", marginBottom: 10,
    }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em",
        textTransform: "uppercase" as const, color, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 11, color: T.text, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

export default function HomeBlueprint() {
  return (
    <div style={{
      background: T.bg, minHeight: "100vh",
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "2rem",
    }}>

      <div style={{ maxWidth: 1400, margin: "0 auto" }}>

        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em",
            textTransform: "uppercase" as const, color: T.muted, marginBottom: 6 }}>
            Headwaters · May 2026
          </div>
          <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "2.2rem",
            fontWeight: 700, color: T.dark, margin: 0, lineHeight: 1.1 }}>
            The Home Blueprint
          </h1>
          <p style={{ fontSize: 13, color: T.muted, margin: "6px 0 0",
            fontStyle: "italic" }}>
            Permaculture zone map · Zone 0 at centre · content placed by how often it's tended
          </p>
        </div>

        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>

          {/* ── ZONE MAP ── */}
          <div style={{ flex: "0 0 780px" }}>
            <div style={{
              position: "relative",
              height: 620,
              background: T.paper,
              borderRadius: 8,
              border: `1px solid ${T.rule}`,
            }}>

              {/* Zone rings — outermost to innermost */}
              <ZoneRing depth={0} color={T.z5.border} label="Z5 · The Ridge · Long Horizon / Wild">
                <Note text="The Arc\n(unscoped)" x={16} y={40} w={110} color={T.z5.label} />
                <Note text="Lightning\n/ V4V" x="calc(100% - 126px)" y={40} w={110} color={T.z5.label} />
                <Note text="Aquifer\n(concept)" x={16} y="calc(100% - 70px)" w={110} color={T.z5.label} />
              </ZoneRing>

              <ZoneRing depth={1} color={T.z4.border} label="Z4 · Market Square · Community">
                <Note text="Research\nLibrary" x={16} y={38} w={110} color={T.z4.label} />
                <Note text="Co-op\nPartnerships" x="calc(100% - 126px)" y={38} w={110} color={T.z4.label} />
              </ZoneRing>

              <ZoneRing depth={2} color={T.z3.border} label="Z3 · The Clearing · Build Now">
                <Note text="North Star\nMethodology" x={12} y={38} w={120} color={T.z3.label} />
                <Note text="Codetry\nHandbook" x="calc(100% - 132px)" y={38} w={120} color={T.z3.label} />
                <Note text="HH Frontend\n+ Full API ✅" x={12} y="calc(100% - 78px)" w={120} color={T.z3.label} />
                <Note text="P2P Engine\nEconomyPage ✅" x="calc(100% - 132px)" y="calc(100% - 78px)" w={120} color={T.z3.label} />
              </ZoneRing>

              <ZoneRing depth={3} color={T.z2.border} label="Z2 · The Worn Path · Paid Contracts">
                <Note text="Deer Lake\nPhase 1 ⚡\nJune 15" x={12} y={38} w={110} color={T.z2.label} />
                <Note text="HH\nOn-Ramp" x="calc(100% - 122px)" y={38} w={110} color={T.z2.label} />
              </ZoneRing>

              <ZoneRing depth={4} color={T.z1.border} label="Z1 · The Spring / Eave · Income">
                <Note text="xBuckets\nWatershed App" x={10} y={36} w={120} color={T.z1.label} />
                <Note text="Field Guide\nFinance M1–6 ✅" x="calc(100% - 132px)" y={36} w={120} color={T.z1.label} />
                <Note text="807 Food\nCo-op" x={10} y="calc(100% - 72px)" w={110} color={T.z1.label} />
                <Note text="Gather Round\nSandbox ✅" x="calc(100% - 132px)" y="calc(100% - 72px)" w={120} color={T.z1.label} />
              </ZoneRing>

              {/* Eave band — top of Z0 */}
              <div style={{
                position: "absolute",
                top: INSET * 5,
                left: INSET * 5,
                right: INSET * 5,
                height: 30,
                background: T.eave.bg,
                border: `1px dashed ${T.eave.border}`,
                borderRadius: "3px 3px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase" as const,
                color: T.muted,
                zIndex: 20,
              }}>
                THE EAVE · Protected · Private · Z1 membrane
              </div>

              {/* Fracture Kit — left deck */}
              <div style={{
                position: "absolute",
                top: INSET * 5 + 30,
                left: INSET * 5,
                width: 68,
                bottom: INSET * 5 + 52,
                background: T.fracture.bg,
                border: `2px solid ${T.fracture.border}`,
                borderRadius: "3px 0 0 3px",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "6px 4px",
                zIndex: 20,
              }}>
                <div style={{ writingMode: "vertical-rl" as const, transform: "rotate(180deg)",
                  fontSize: 9, fontWeight: 800, letterSpacing: "0.12em",
                  textTransform: "uppercase" as const, color: T.fracture.text, textAlign: "center" }}>
                  FRACTURE KIT · The Deck · Board 1: Magic · Board 2+: TBD
                </div>
              </div>

              {/* Rebuild Kit — right deck */}
              <div style={{
                position: "absolute",
                top: INSET * 5 + 30,
                right: INSET * 5,
                width: 68,
                bottom: INSET * 5 + 52,
                background: T.rebuild.bg,
                border: `2px solid ${T.rebuild.border}`,
                borderRadius: "0 3px 3px 0",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "6px 4px",
                zIndex: 20,
              }}>
                <div style={{ writingMode: "vertical-rl" as const,
                  fontSize: 9, fontWeight: 800, letterSpacing: "0.12em",
                  textTransform: "uppercase" as const, color: T.rebuild.text, textAlign: "center" }}>
                  REBUILD KIT · The Patio Furniture · New Lifestyle on Stable Deck
                </div>
              </div>

              {/* Shattered Kit — bottom deck */}
              <div style={{
                position: "absolute",
                bottom: INSET * 5,
                left: INSET * 5 + 68,
                right: INSET * 5 + 68,
                height: 52,
                background: T.shatter.bg,
                border: `2px solid ${T.shatter.border}`,
                borderRadius: "0 0 3px 3px",
                display: "flex",
                alignItems: "center", justifyContent: "center",
                padding: "0 8px",
                zIndex: 20,
              }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em",
                  textTransform: "uppercase" as const, color: T.shatter.text,
                  textAlign: "center", lineHeight: 1.5 }}>
                  SHATTERED KIT · For Danika<br />
                  Never had a Salt Box · Zone 0 is a deep hole · Ropes made of paper
                </div>
              </div>

              {/* Saltbox — Z0 centre */}
              <div style={{
                position: "absolute",
                top: INSET * 5 + 30,
                left: INSET * 5 + 68,
                right: INSET * 5 + 68,
                bottom: INSET * 5 + 52,
                background: T.z0.bg,
                borderRadius: 2,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "12px",
                zIndex: 15,
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em",
                  textTransform: "uppercase" as const, color: "#fff",
                  marginBottom: 6 }}>SALTBOX</div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
                  textTransform: "uppercase" as const, color: "rgba(255,255,255,0.75)",
                  marginBottom: 10 }}>Z0 · The Hearth</div>
                <div style={{ height: 1, background: "rgba(255,255,255,0.3)",
                  width: "80%", marginBottom: 10 }} />
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.9)",
                  lineHeight: 1.8, textAlign: "center" as const }}>
                  🔑 Key Custody Primitive<br />
                  ✨ Magic — Board 1<br />
                  📖 Homeschool Companion<br />
                  <span style={{ fontSize: 9, opacity: 0.7 }}>(Gather Round integration)</span>
                </div>
              </div>

            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Graduation Stack */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
                textTransform: "uppercase" as const, color: T.muted, marginBottom: 8 }}>
                Graduation Stack — Entry → Depth
              </div>
              {[
                { e: "⚡", t: "Lightning / V4V", d: "ambient value stream", c: T.z5.label },
                { e: "↕",  t: "P2P Engine (Tips)", d: "lateral value flow", c: T.z3.label },
                { e: "🤝", t: "Helping Hands", d: "structured work + credentials", c: T.z2.label },
                { e: "✉",  t: "Envelopes", d: "custodial, named buckets", c: "#8a6800" },
                { e: "💧", t: "Bucket System", d: "self-custody, Xaman, RLUSD", c: T.z1.label },
                { e: "💰", t: "Drip Harvester", d: "savings in AMM pools", c: T.z2.label },
                { e: "🙏", t: "Giving Well", d: "gains return to commons", c: T.dark },
              ].map(({ e, t, d, c }) => (
                <div key={t} style={{ display: "flex", alignItems: "center",
                  gap: 8, marginBottom: 6, fontSize: 11 }}>
                  <span style={{ fontSize: 14, width: 20, textAlign: "center" as const }}>{e}</span>
                  <span style={{ fontWeight: 700, color: c }}>{t}</span>
                  <span style={{ color: T.muted, fontSize: 10 }}>— {d}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: T.rule, marginBottom: "1.5rem" }} />

            {/* Kit Tiers */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
                textTransform: "uppercase" as const, color: T.muted, marginBottom: 8 }}>
                Kit Tiers — 5 Categories × 3 Tiers
              </div>
              {[
                { e: "🏠", cat: "Home Economics", tiers: ["Envelopes", "Salt Box system", "Gather Round kit"], done: [] },
                { e: "🌾", cat: "Food Business", tiers: ["Pricing / story", "Seasonal ops", "Bench + XRPL"], done: [0,1,2] },
                { e: "🤝", cat: "Community Economics", tiers: ["How HH works", "Community Hall", "P2P facilitator"], done: [] },
                { e: "👶", cat: "Youth & Helper", tiers: ["First bucket", "First tokens", "First Xaman"], done: [] },
                { e: "🎓", cat: "Practitioner", tiers: ["Watershed model", "The Cockpit", "Practitioner kit"], done: [] },
              ].map(({ e, cat, tiers, done }) => (
                <div key={cat} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginBottom: 3 }}>
                    {e} {cat}
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {tiers.map((t, i) => (
                      <div key={t} style={{
                        flex: 1, fontSize: 9, padding: "3px 5px",
                        borderRadius: 3, lineHeight: 1.4,
                        background: done.includes(i) ? "#d4edda" : "rgba(42,37,32,0.05)",
                        border: `1px solid ${done.includes(i) ? "#1f5c3a" : T.rule}`,
                        color: done.includes(i) ? T.z1.label : T.muted,
                        fontWeight: done.includes(i) ? 700 : 400,
                      }}>
                        T{i+1}: {t}{done.includes(i) ? " ✅" : ""}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── THREE KITS STRIP ── */}
        <div style={{ marginTop: "1.5rem", display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          <KitBox label="Fracture Kit · The Deck"
            color={T.fracture.text} border={T.fracture.border}
            bg="rgba(180,140,20,0.08)">
            {"Zone 0 broke. Board by board rebuild.\n\nBoard 1: Magic — culture, tradition, the ground rod of identity. Dad as primary Magic-holder. Divorce as severance (not absence — it's there, unreachable).\n\nDual loss: adult loses role, children lose anchor at the same moment.\n\nBoard 2+: to be named."}
          </KitBox>
          <KitBox label="Rebuild Kit · The Patio Furniture"
            color={T.rebuild.text} border={T.rebuild.border}
            bg="rgba(30,100,60,0.08)">
            {"What goes on a stable deck.\n\nThe new lifestyle. Patio furniture only makes sense when there is a floor under it.\n\nFor: when the Fracture Kit deck is solid. When the household has culture and tradition and a ground rod again.\n\nThis is the forward arc. Not repair — new construction on a healed foundation."}
          </KitBox>
          <KitBox label="Shattered Kit · For Danika"
            color={T.shatter.text} border={T.shatter.border}
            bg="rgba(160,40,40,0.06)">
            {"Never had a Salt Box. Never held a building block.\n\nZone 0 is a deep hole with no floor and no walls. The helpers reached in as far as human arms can reach. They tied ropes of paper. The right intention in the wrong material.\n\nFor: Community Living PTI stream. Acute Zone 0 absence. The entry before Fracture or Rebuild is possible.\n\nThe tools need to be made of materials that bear weight."}
          </KitBox>
        </div>

        <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem",
          borderTop: `1px solid ${T.rule}`, display: "flex",
          justifyContent: "space-between", alignItems: "center",
          fontSize: 10, color: T.muted }}>
          <div>Headwaters Development Services · Wabigoon, Ontario · Treaty 3 Territory</div>
          <div>Kitchen table document · not for distribution</div>
        </div>

      </div>
    </div>
  );
}
