/**
 * WatershedCompactPage — Public-facing page for the Watershed Compact.
 *
 * Renders:
 *   1. Concentric-ring SVG diagram of permaculture Zones 0–6
 *   2. Zone 6 deviation callout (visually distinct — Headwaters addition)
 *   3. 12 Principles table with Headwaters Application column
 *
 * This page is intentionally PUBLIC (no passphrase gate).
 * Route: /watershed-compact   (registered in PublicRouter in App.tsx)
 *
 * Source of truth: shared/watershed-compact.md § Permaculture Design Framework
 */

import { useState } from "react";

// ── Zone data ─────────────────────────────────────────────────────────────────

interface ZoneData {
  number: number;
  name: string;
  what: string;
  color: string;
  textColor: string;
  deviation?: boolean;
}

const ZONES: ZoneData[] = [
  {
    number: 0,
    name: "The Kitchen Table",
    what:
      "The family, the household, the founding circle. Highest authority. Every system we build starts here and answers here.",
    color: "#1f3d2e",
    textColor: "#ffffff",
  },
  {
    number: 1,
    name: "The Practitioner's Field",
    what:
      "The practitioners, operators, and builders doing daily work inside the system. Where the tools live and get tested.",
    color: "#2d5a3d",
    textColor: "#ffffff",
  },
  {
    number: 2,
    name: "The Community",
    what:
      "The broader community the practitioners serve — the people the wealth is staying for. Their reality is the test of everything Zone 1 builds.",
    color: "#4a7c5e",
    textColor: "#ffffff",
  },
  {
    number: 3,
    name: "The Market",
    what:
      "Where Headwaters tools and institutions connect with economic reality: stores, co-ops, vendors, buyers. Productive but not intimate.",
    color: "#b87333",
    textColor: "#ffffff",
  },
  {
    number: 4,
    name: "The Corridor",
    what:
      "Partnerships, networks, and allied organizations. Less managed, more collaborative. The place of replication and cross-pollination.",
    color: "#7a6e5a",
    textColor: "#ffffff",
  },
  {
    number: 5,
    name: "The Wild",
    what:
      "The external world — funders, governments, outside platforms, the broader economy. We observe it. We do not let it govern us.",
    color: "#5c7a8a",
    textColor: "#ffffff",
  },
  {
    number: 6,
    name: "The River",
    what:
      "Our addition. The outward flow layer — what Headwaters sends downstream: knowledge, replicable models, tools that can be picked up by other communities and run independently.",
    color: "#3b6e9e",
    textColor: "#ffffff",
    deviation: true,
  },
];

// ── 12 Principles ─────────────────────────────────────────────────────────────

const PRINCIPLES = [
  {
    n: 1,
    principle: "Observe and interact",
    application:
      "Dollar-honest diagnosis before any tool gets built. We look at the actual numbers before we design anything.",
  },
  {
    n: 2,
    principle: "Catch and store energy",
    application:
      "Keep wealth inside the community. Every dollar that doesn't leak is energy stored.",
  },
  {
    n: 3,
    principle: "Obtain a yield",
    application:
      "The work must produce real, measurable results for the community — not just activity. Shipped, not proposed.",
  },
  {
    n: 4,
    principle: "Apply self-regulation and accept feedback",
    application:
      "The Decision Filter runs on every proposal. The Gord test is a form of system feedback. We adjust.",
  },
  {
    n: 5,
    principle: "Use and value renewable resources",
    application:
      "Build on what the community already has: relationships, land, knowledge, labour, trust.",
  },
  {
    n: 6,
    principle: "Produce no waste",
    application:
      "Every process that leaks wealth, duplicates effort, or creates dependency is waste. Eliminate it.",
  },
  {
    n: 7,
    principle: "Design from patterns to details",
    application:
      "The watershed metaphor first. The zone map second. The specific tool or product third. Sequence matters.",
  },
  {
    n: 8,
    principle: "Integrate rather than segregate",
    application:
      "The tools, the financial models, the training, the institutions — they connect. No isolated products.",
  },
  {
    n: 9,
    principle: "Use small and slow solutions",
    application:
      "Pilot at Zone 1. Prove at Zone 2. Replicate at Zone 4. Don't scale what hasn't worked at the kitchen table.",
  },
  {
    n: 10,
    principle: "Use and value diversity",
    application:
      "Multiple income streams, multiple institutions, multiple community partners. Monocultures fail.",
  },
  {
    n: 11,
    principle: "Use edges and value the marginal",
    application:
      "Rural, remote, and Indigenous communities are the edge. That is where the most resilient design work happens. We go there first.",
  },
  {
    n: 12,
    principle: "Creatively use and respond to change",
    application:
      "When the system shifts — markets, policy, community needs — we redesign from the ethics, not from sunk cost.",
  },
];

// ── SVG Zone Diagram ──────────────────────────────────────────────────────────

const CX = 250;
const CY = 250;
const RING_STEP = 32;
const ZONE_RADII = [28, 60, 92, 124, 156, 188, 226]; // Zone 0 → Zone 6

function ZoneDiagram({
  active,
  onSelect,
}: {
  active: number | null;
  onSelect: (n: number | null) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const focused = hover ?? active;

  return (
    <svg
      viewBox="0 0 500 500"
      width="100%"
      aria-label="Headwaters Permaculture Zone Map — Zones 0 through 6"
      role="img"
      style={{ display: "block", maxWidth: 480, margin: "0 auto" }}
    >
      {/* Outer glow for active zone */}
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Dashed-stroke zone 6 ring pattern */}
        <pattern
          id="river-hatch"
          patternUnits="userSpaceOnUse"
          width="10"
          height="10"
          patternTransform="rotate(35)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="10"
            stroke="#3b6e9e"
            strokeWidth="1.5"
            strokeOpacity="0.18"
          />
        </pattern>
      </defs>

      {/* ── Render zones from outside in so inner rings sit on top ── */}
      {[...ZONES].reverse().map((zone) => {
        const r = ZONE_RADII[zone.number];
        const isActive = focused === zone.number;
        const isZ6 = zone.number === 6;

        return (
          <g
            key={zone.number}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHover(zone.number)}
            onMouseLeave={() => setHover(null)}
            onClick={() =>
              onSelect(active === zone.number ? null : zone.number)
            }
            role="button"
            aria-label={`Zone ${zone.number} — ${zone.name}`}
          >
            {/* Fill circle */}
            <circle
              cx={CX}
              cy={CY}
              r={r}
              fill={zone.color}
              fillOpacity={isActive ? 1 : 0.82}
              stroke={isZ6 ? "#3b6e9e" : "rgba(255,255,255,0.22)"}
              strokeWidth={isZ6 ? (isActive ? 2.5 : 1.5) : isActive ? 2 : 1}
              strokeDasharray={isZ6 ? "6 4" : undefined}
              filter={isActive ? "url(#glow)" : undefined}
              style={{ transition: "fill-opacity 0.15s" }}
            />
            {/* Zone 6 gets a subtle hatch overlay to mark it as an addition */}
            {isZ6 && (
              <circle
                cx={CX}
                cy={CY}
                r={r}
                fill="url(#river-hatch)"
                style={{ pointerEvents: "none" }}
              />
            )}
          </g>
        );
      })}

      {/* ── Zone labels (rendered on top of all rings) ── */}
      {ZONES.map((zone) => {
        const r = ZONE_RADII[zone.number];
        const prevR = zone.number === 0 ? 0 : ZONE_RADII[zone.number - 1];
        const midR = (r + prevR) / 2;
        const isActive = focused === zone.number;

        return (
          <g
            key={`label-${zone.number}`}
            style={{ pointerEvents: "none" }}
          >
            <text
              x={CX}
              y={CY - midR + 5}
              textAnchor="middle"
              fontSize={zone.number === 0 ? 9 : 10}
              fontWeight="700"
              fill="rgba(255,255,255,0.95)"
              fontFamily="monospace"
              letterSpacing="0.08em"
              opacity={isActive ? 1 : 0.75}
              style={{ transition: "opacity 0.15s" }}
            >
              Z{zone.number}
            </text>
            {zone.number > 0 && (
              <text
                x={CX}
                y={CY - midR + 17}
                textAnchor="middle"
                fontSize={8.5}
                fill="rgba(255,255,255,0.7)"
                fontFamily="system-ui, sans-serif"
                opacity={isActive ? 1 : 0.6}
                style={{ transition: "opacity 0.15s" }}
              >
                {zone.name}
              </text>
            )}
            {zone.number === 0 && (
              <text
                x={CX}
                y={CY + 5}
                textAnchor="middle"
                fontSize={8}
                fill="rgba(255,255,255,0.8)"
                fontFamily="system-ui, sans-serif"
                opacity={isActive ? 1 : 0.7}
              >
                {zone.name}
              </text>
            )}
          </g>
        );
      })}

      {/* ── Zone 6 "Our addition" badge ── */}
      <g style={{ pointerEvents: "none" }}>
        <rect
          x={338}
          y={40}
          width={110}
          height={22}
          rx={11}
          fill="#3b6e9e"
          fillOpacity={0.9}
        />
        <text
          x={393}
          y={55}
          textAnchor="middle"
          fontSize={9}
          fontWeight="700"
          fill="white"
          fontFamily="monospace"
          letterSpacing="0.12em"
        >
          OUR ADDITION
        </text>
        {/* Arrow pointing inward toward Zone 6 ring */}
        <line
          x1={393}
          y1={62}
          x2={393}
          y2={72}
          stroke="#3b6e9e"
          strokeWidth={1.5}
          strokeDasharray="3 2"
          opacity={0.8}
        />
      </g>

      {/* ── Outward flow arrow ── */}
      <g style={{ pointerEvents: "none" }}>
        <text
          x={CX}
          y={486}
          textAnchor="middle"
          fontSize={9}
          fill="#5c7a8a"
          fontFamily="monospace"
          letterSpacing="0.14em"
          opacity={0.65}
        >
          ← CENTRE · AUTHORITY · INTIMACY →
        </text>
      </g>
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const CREAM = "#faf7f2";
const INK = "#1c1917";
const MUTED = "#78716c";
const RULE = "rgba(200,191,167,0.35)";
const FOREST = "#1f3d2e";

export function WatershedCompactPage() {
  const [activeZone, setActiveZone] = useState<number | null>(null);

  const zone = activeZone !== null ? ZONES[activeZone] : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${CREAM} 0%, #ede8df 100%)`,
        color: INK,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <header style={{ marginBottom: 40 }}>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: FOREST,
              marginBottom: 8,
              opacity: 0.7,
            }}
          >
            Headwaters Universe · Foundational Ethos
          </p>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 700,
              lineHeight: 1.15,
              margin: "0 0 12px",
              color: INK,
            }}
          >
            The Watershed Compact
          </h1>
          <p
            style={{
              fontSize: 16,
              color: MUTED,
              lineHeight: 1.6,
              maxWidth: 580,
              margin: 0,
            }}
          >
            Headwaters is built on permaculture principles — not as metaphor,
            but as working design logic. The framework below maps how decisions
            get made, how authority flows, and how the system behaves over time.
          </p>
        </header>

        {/* ── Design Ethic ─────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: FOREST,
              marginBottom: 16,
            }}
          >
            Design Ethic
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            {[
              {
                title: "Care for Earth",
                body: "The land sustains the people. The people are responsible for the land. Extraction without restoration is theft from future generations.",
                color: FOREST,
              },
              {
                title: "Care for People",
                body: "Serve the needs of people fairly, starting with those most systematically excluded from ownership and self-determination.",
                color: "#4a7c5e",
              },
              {
                title: "Return of Surplus",
                body: "Wealth generated in the watershed stays in the watershed. Surplus is reinvested into the system, not siphoned outward.",
                color: "#b87333",
              },
            ].map(({ title, body, color }) => (
              <div
                key={title}
                style={{
                  borderRadius: 10,
                  border: `1px solid ${color}33`,
                  background: `${color}0c`,
                  padding: "16px 18px",
                }}
              >
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color,
                    marginBottom: 6,
                  }}
                >
                  {title}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: MUTED,
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
          <p
            style={{
              fontSize: 12,
              color: MUTED,
              marginTop: 10,
              fontStyle: "italic",
            }}
          >
            These three ethics are not values statements. They are operating
            constraints. When a decision violates one, it doesn't get made.
          </p>
        </section>

        {/* ── Seven Zones ──────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: FOREST,
              marginBottom: 6,
            }}
          >
            Seven Zones
          </h2>
          <p
            style={{
              fontSize: 13,
              color: MUTED,
              lineHeight: 1.55,
              marginBottom: 24,
            }}
          >
            Permaculture zones describe intensity of use and attention — the
            closer to the centre, the more frequent the care. Tap any ring to
            read its description.
          </p>

          {/* Diagram */}
          <div
            style={{
              background: "white",
              borderRadius: 16,
              border: `1px solid ${RULE}`,
              padding: "16px 8px 8px",
              marginBottom: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <ZoneDiagram active={activeZone} onSelect={setActiveZone} />
          </div>

          {/* Active zone detail panel */}
          {zone ? (
            <div
              style={{
                borderRadius: 12,
                border: `1.5px solid ${zone.color}55`,
                background: `${zone.color}0d`,
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: zone.color,
                      marginBottom: 3,
                    }}
                  >
                    Zone {zone.number}
                    {zone.deviation && " — Headwaters Addition"}
                  </p>
                  <p
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: 18,
                      fontWeight: 700,
                      color: INK,
                      margin: 0,
                    }}
                  >
                    {zone.name}
                  </p>
                </div>
                <button
                  onClick={() => setActiveZone(null)}
                  style={{
                    flexShrink: 0,
                    background: "white",
                    border: `1px solid ${RULE}`,
                    borderRadius: 8,
                    padding: "4px 10px",
                    fontSize: 11,
                    color: MUTED,
                    cursor: "pointer",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Close
                </button>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#3a332a",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {zone.what}
              </p>
            </div>
          ) : (
            <div
              style={{
                borderRadius: 12,
                border: `1px dashed ${RULE}`,
                padding: "14px 18px",
                textAlign: "center",
                fontSize: 13,
                color: "#b5afa9",
              }}
            >
              Tap a ring to read its description.
            </div>
          )}

          {/* Zone 6 deviation callout */}
          <div
            style={{
              marginTop: 16,
              borderRadius: 12,
              border: "1.5px solid #3b6e9e55",
              background: "#3b6e9e0d",
              padding: "14px 18px",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#3b6e9e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "monospace",
                fontSize: 11,
                fontWeight: 900,
                color: "white",
                marginTop: 1,
              }}
            >
              6
            </div>
            <div>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#3b6e9e",
                  marginBottom: 4,
                }}
              >
                On Zone 6 — Our Deviation
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#3a4a5a",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                The original permaculture model ends at Zone 5. We add a sixth
                zone because our system has an outward flow layer the original
                model doesn't account for. We are not just designing a place —
                we are designing replication. Zone 6 is where finished work
                leaves the watershed and becomes infrastructure for another
                watershed to start.{" "}
                <strong style={{ color: "#3b6e9e" }}>
                  We own that deviation.
                </strong>
              </p>
            </div>
          </div>

          {/* Zone quick-reference list */}
          <div
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 8,
            }}
          >
            {ZONES.map((z) => (
              <button
                key={z.number}
                onClick={() =>
                  setActiveZone(activeZone === z.number ? null : z.number)
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  border:
                    activeZone === z.number
                      ? `1.5px solid ${z.color}`
                      : `1px solid ${RULE}`,
                  background:
                    activeZone === z.number
                      ? `${z.color}12`
                      : "rgba(255,253,248,0.8)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border 0.15s, background 0.15s",
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: z.color,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "monospace",
                    fontSize: 10,
                    fontWeight: 900,
                    color: "white",
                  }}
                >
                  {z.number}
                </span>
                <div>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: 9.5,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: z.color,
                      margin: 0,
                      textTransform: "uppercase",
                    }}
                  >
                    {z.name}
                  </p>
                </div>
                {z.deviation && (
                  <span
                    style={{
                      marginLeft: "auto",
                      flexShrink: 0,
                      fontFamily: "monospace",
                      fontSize: 7.5,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#3b6e9e",
                      background: "#3b6e9e18",
                      borderRadius: 4,
                      padding: "2px 5px",
                    }}
                  >
                    +ours
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* ── 12 Principles ─────────────────────────────────────────────────── */}
        <section>
          <h2
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: FOREST,
              marginBottom: 6,
            }}
          >
            12 Principles — Mapped to Headwaters System Behaviours
          </h2>
          <p
            style={{
              fontSize: 13,
              color: MUTED,
              lineHeight: 1.55,
              marginBottom: 20,
            }}
          >
            David Holmgren's twelve permaculture principles, translated into how
            the Headwaters system actually behaves.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {PRINCIPLES.map((p, idx) => (
              <div
                key={p.n}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 1fr 1fr",
                  gap: "10px 14px",
                  padding: "14px 16px",
                  borderRadius: 8,
                  background:
                    idx % 2 === 0
                      ? "rgba(255,253,248,0.85)"
                      : "transparent",
                  border: `1px solid ${idx % 2 === 0 ? RULE : "transparent"}`,
                  alignItems: "start",
                }}
              >
                {/* Number */}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: FOREST,
                    fontFamily: "monospace",
                    fontSize: 10,
                    fontWeight: 900,
                    color: "white",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {p.n}
                </span>

                {/* Principle */}
                <div>
                  <p
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: INK,
                      margin: "0 0 2px",
                      lineHeight: 1.35,
                    }}
                  >
                    {p.principle}
                  </p>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: 8.5,
                      color: MUTED,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    Permaculture
                  </p>
                </div>

                {/* Application */}
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#3a332a",
                      lineHeight: 1.55,
                      margin: "0 0 2px",
                    }}
                  >
                    {p.application}
                  </p>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: 8.5,
                      color: FOREST,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      margin: 0,
                      opacity: 0.7,
                    }}
                  >
                    Headwaters Application
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Design Philosophy footer ──────────────────────────────────────── */}
        <footer
          style={{
            marginTop: 56,
            paddingTop: 28,
            borderTop: `1px solid ${RULE}`,
          }}
        >
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 15,
              fontStyle: "italic",
              color: FOREST,
              lineHeight: 1.7,
              maxWidth: 560,
            }}
          >
            "We build from the inside out, not the outside in. The watershed
            metaphor and the zone map are two ways of describing the same thing:
            a system designed to keep wealth and sovereignty at the centre, and
            to let the excess flow outward — not to extraction, but to
            replication."
          </p>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              color: MUTED,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginTop: 12,
            }}
          >
            Watershed Compact · Version 1 · Anchored May 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
