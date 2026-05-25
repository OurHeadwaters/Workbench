import React from "react";

const ZONES = [
  {
    id: "z0", name: "THE HEARTH", color: "#c4783a", zone: "Zone 0",
    headline: "This is your kitchen table.",
    body: "Everything radiates from here. If the Hearth is broken, nothing in the outer zones holds. The Salt Box is the system that protects and tends this room.",
    maps: ["Salt Box — the core system", "Fracture Kit — board by board rebuild", "Rebuild Kit — new life on a stable floor", "Shattered Kit — for when Z0 never existed", "Key Custody — who holds the door", "Magic — Board 1, the ground rod of identity"],
  },
  {
    id: "z1", name: "THE YARD", color: "#1f7a4a", zone: "Zone 1",
    headline: "What you reach for every morning.",
    body: "The Yard is the daily rhythm. You tend this without thinking about it. This is the household economy in motion — the bucket system, the food co-op, the homeschool rhythm.",
    maps: ["Bucket System — self-custody, Xaman, RLUSD", "Family Kit", "Homeschool Kit + Gather Round integration", "xBuckets — Watershed App", "807 Food Co-op — local food loop"],
  },
  {
    id: "z2", name: "THE TRAIL", color: "#2a5f8a", zone: "Zone 2",
    headline: "The paid contracts. The known ground.",
    body: "The Trail is where you earn. You've walked it enough times that your feet know the path. This is the consulting layer — bounded scope, relationship-driven, $175/hr.",
    maps: ["Deer Lake Phase 1 — ⚡ June 15", "Helping Hands On-Ramp", "Field Guide Finance — M1–6 ✅", "Sole Prop Bench — invoicing, closeouts", "Codetry Ship /sow — printable SOW"],
  },
  {
    id: "z3", name: "THE CLEARING", color: "#5a3d8a", zone: "Zone 3",
    headline: "The active construction site.",
    body: "The Clearing is where the work is happening today. Not planned, not finished — live. If you hear hammering, it's coming from here.",
    maps: ["North Star — the unified practitioner front door", "Codetry Handbook", "HH Frontend + Full API ✅", "P2P Engine — lateral value flow ✅", "Practitioner Operating Plan", "Codetry Ship — crew manifest"],
  },
  {
    id: "z4", name: "THE MARKET", color: "#8a6800", zone: "Zone 4",
    headline: "This is where the community comes together.",
    body: "The Market is the zone where individual households connect into something collective. Not charity. Not extraction. Exchange — with memory.",
    maps: ["Economy Kit", "Community Economy Kit", "Research Library", "807 Benefits — 20% passive stream", "Co-op Partnerships", "Community Hall (zone name for the building)"],
  },
  {
    id: "z5", name: "THE RIDGE", color: "#4a5c44", zone: "Zone 5",
    headline: "You can see it. You're not there yet.",
    body: "The Ridge is what you're building toward — the long game, the open territory. Not wild because it's dangerous. Wild because it hasn't been shaped yet.",
    maps: ["The Arc — steward registration, sovereign", "Lightning / V4V — ambient value stream", "Aquifer — the concept beneath all of it", "Regen Revolution — far horizon framing"],
  },
];

const KITS = [
  {
    name: "FRACTURE KIT",
    sub: "The Deck",
    color: "#8a6800",
    body: "Zone 0 broke. Board by board rebuild. Board 1: Magic — culture, tradition, the ground rod of identity. Dad as primary Magic-holder. Divorce as severance (not absence — still there, unreachable). Dual loss: adult loses role, children lose anchor at the same moment.",
  },
  {
    name: "REBUILD KIT",
    sub: "The Patio Furniture",
    color: "#1f7a4a",
    body: "What goes on a stable deck. The new lifestyle. Patio furniture only makes sense when there is a floor under it. For: when the Fracture Kit deck is solid and the household has culture and tradition and a ground rod again.",
  },
  {
    name: "SHATTERED KIT",
    sub: "For Danika",
    color: "#8B2020",
    body: "Never had a Salt Box. Zone 0 is a deep hole with no floor and no walls. The helpers reached in as far as human arms can reach. They tied ropes of paper — the right intention in the wrong material. For: Community Living PTI stream. The entry before Fracture or Rebuild is possible.",
  },
];

const LINES = 5;

function RuledLines() {
  return (
    <div style={{ marginTop: 10 }}>
      {Array.from({ length: LINES }).map((_, i) => (
        <div key={i} style={{
          borderBottom: "1px solid #ccc",
          height: 22,
          marginBottom: 2,
        }} />
      ))}
    </div>
  );
}

export default function HomeBlueprintPrint() {
  return (
    <div style={{
      fontFamily: "Georgia, serif",
      color: "#1a1a1a",
      background: "#fff",
      padding: "0.4in 0.45in",
      maxWidth: "10.5in",
      margin: "0 auto",
    }}>

      {/* ── PRINT BUTTON (screen only) ────────────────────────────────────── */}
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "flex-end" }}
        className="no-print">
        <button
          onClick={() => window.print()}
          style={{
            background: "#1f3d2e", color: "#fff",
            border: "none", borderRadius: 4,
            padding: "8px 20px", fontSize: 13,
            fontFamily: "Inter, sans-serif",
            fontWeight: 700, cursor: "pointer",
            letterSpacing: "0.08em",
          }}
        >
          PRINT / SAVE PDF
        </button>
      </div>

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div style={{
        borderBottom: "3px solid #1f3d2e",
        paddingBottom: 10, marginBottom: 24,
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
      }}>
        <div>
          <div style={{
            fontSize: 9, fontFamily: "Inter, sans-serif",
            fontWeight: 700, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#666",
            marginBottom: 4,
          }}>
            Headwaters Development Services · Wabigoon, Ontario
          </div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#1f3d2e", lineHeight: 1 }}>
            The Home Blueprint
          </h1>
          <div style={{ fontSize: 12, color: "#666", marginTop: 4, fontStyle: "italic" }}>
            Permaculture zone map — content placed by how often it's tended
          </div>
        </div>
        <div style={{
          textAlign: "right", fontSize: 11,
          fontFamily: "Inter, sans-serif", color: "#999",
        }}>
          <div>Name: ___________________________</div>
          <div style={{ marginTop: 6 }}>Date: ____________________________</div>
        </div>
      </div>

      {/* ── ZONE GRID ────────────────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "18px 24px",
        marginBottom: 28,
      }}>
        {ZONES.map(z => (
          <div key={z.id} style={{
            borderLeft: `4px solid ${z.color}`,
            paddingLeft: 14,
            pageBreakInside: "avoid",
            breakInside: "avoid",
          }}>
            <div style={{
              display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4,
            }}>
              <span style={{
                fontSize: 8, fontFamily: "Inter, sans-serif",
                fontWeight: 700, letterSpacing: "0.16em",
                textTransform: "uppercase", color: z.color,
                opacity: 0.7,
              }}>{z.zone}</span>
              <span style={{
                fontSize: 17, fontWeight: 700,
                fontFamily: "Inter, sans-serif",
                color: z.color, letterSpacing: "0.04em",
              }}>{z.name}</span>
            </div>

            <div style={{
              fontSize: 13, fontWeight: 700, color: "#1a1a1a",
              lineHeight: 1.3, marginBottom: 5, fontStyle: "italic",
            }}>
              {z.headline}
            </div>

            <div style={{
              fontSize: 11, color: "#444", lineHeight: 1.55, marginBottom: 8,
            }}>
              {z.body}
            </div>

            <div style={{
              fontSize: 8, fontFamily: "Inter, sans-serif",
              fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase", color: z.color, marginBottom: 5,
            }}>
              WHAT MAPS HERE
            </div>
            <ul style={{ margin: 0, paddingLeft: 14, marginBottom: 8 }}>
              {z.maps.map((m, i) => (
                <li key={i} style={{ fontSize: 10, color: "#555", lineHeight: 1.6 }}>{m}</li>
              ))}
            </ul>

            <div style={{
              fontSize: 8, fontFamily: "Inter, sans-serif",
              fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "#999", marginBottom: 2,
            }}>
              MY NOTES
            </div>
            <RuledLines />
          </div>
        ))}
      </div>

      {/* ── THREE KITS ───────────────────────────────────────────────────── */}
      <div style={{
        borderTop: "2px solid #ddd", paddingTop: 18, marginBottom: 28,
      }}>
        <div style={{
          fontSize: 9, fontFamily: "Inter, sans-serif",
          fontWeight: 700, letterSpacing: "0.18em",
          textTransform: "uppercase", color: "#666",
          marginBottom: 14,
        }}>
          THE THREE KITS — Zone 0 Repair Framework
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px 20px",
        }}>
          {KITS.map(k => (
            <div key={k.name} style={{
              borderTop: `3px solid ${k.color}`,
              paddingTop: 10,
              pageBreakInside: "avoid",
              breakInside: "avoid",
            }}>
              <div style={{
                fontSize: 12, fontWeight: 700,
                fontFamily: "Inter, sans-serif",
                color: k.color, letterSpacing: "0.06em", marginBottom: 2,
              }}>{k.name}</div>
              <div style={{
                fontSize: 9, fontFamily: "Inter, sans-serif",
                color: "#888", marginBottom: 6, fontStyle: "italic",
              }}>{k.sub}</div>
              <div style={{
                fontSize: 10.5, color: "#444", lineHeight: 1.6, marginBottom: 8,
              }}>{k.body}</div>
              <div style={{
                fontSize: 8, fontFamily: "Inter, sans-serif",
                fontWeight: 700, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "#999", marginBottom: 2,
              }}>MY NOTES</div>
              <RuledLines />
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <div style={{
        borderTop: "1px solid #ddd", paddingTop: 8,
        display: "flex", justifyContent: "space-between",
        fontSize: 9, fontFamily: "Inter, sans-serif", color: "#bbb",
      }}>
        <span>Headwaters Development Services · Kitchen table document · not for distribution</span>
        <span>Channel every drop.</span>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          @page { size: landscape; margin: 0.35in; }
        }
      `}</style>
    </div>
  );
}
