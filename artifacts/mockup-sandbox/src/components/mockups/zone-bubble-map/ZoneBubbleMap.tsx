import { useState } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
// Swap this entire object to use any zone set (e.g. full 6-zone TSP model)

const ZONE_CONFIG = {
  eave: {
    label: "Eave",
    note: "Shelters Z0 · Z1 · Z2 from Z3 rain",
    fill: "#1F3D2E",
    stroke: "#2D5C42",
  },
  zones: [
    {
      id: "z0",
      label: "Z0",
      name: "Saltbox",
      sub: "Dwelling · Household",
      cx: 135,
      cy: 270,
      r: 148,
      fill: "#EEE0C8",
      stroke: "#9A7040",
      textFill: "#4A2E0E",
      lightText: "#7A5030",
      note: "The household at rest",
    },
    {
      id: "z1",
      label: "Z1",
      name: "Circle",
      sub: "Private household identity",
      cx: 345,
      cy: 270,
      r: 178,
      fill: "#F9EDD8",
      stroke: "#C4956A",
      textFill: "#5C3317",
      lightText: "#8B5E3C",
      note: "Lodge — Z1 identity layer",
    },
    {
      id: "z2",
      label: "Z2",
      name: "Workbench",
      sub: "Liminal · Controlled crossings",
      cx: 575,
      cy: 270,
      r: 178,
      fill: "#DCE9E2",
      stroke: "#4F6E5C",
      textFill: "#1A3D2A",
      lightText: "#3A6050",
      note: "Reads both sides. Writes to neither.",
    },
    {
      id: "z3",
      label: "Z3",
      name: "Community",
      sub: "Public · Above-board",
      cx: 800,
      cy: 270,
      r: 173,
      fill: "#1F3D2E",
      stroke: "#1A3528",
      textFill: "#E8F4ED",
      lightText: "#A8D4B8",
      note: "XRPL wallet lives here",
    },
  ],
  adjacencies: [
    {
      id: "z0z1",
      from: "z0",
      to: "z1",
      type: "eave-flow" as const,
      label: "Eave Flow",
      pillCx: 240,
      pillCy: 295,
      color: "#4F6E5C",
      pillLabel: "OPEN THE FLOW",
    },
    {
      id: "z1z2",
      from: "z1",
      to: "z2",
      type: "gate" as const,
      label: "Z1 → Z2",
      pillCx: 460,
      pillCy: 295,
      color: "#8A6A1A",
      pillLabel: "GEAR UP",
      hats: [
        {
          id: "practitioner",
          label: "Practitioner",
          description: "Leaving household. Practice lens on. Showing up to work.",
        },
        {
          id: "steward",
          label: "Steward",
          description:
            "Carrying household context in to make a decision on its behalf.",
        },
        {
          id: "observer",
          label: "Observer",
          description:
            "Watching the workbench without bringing household identity into the view.",
        },
      ],
    },
    {
      id: "z2z3",
      from: "z2",
      to: "z3",
      type: "gate" as const,
      label: "Z2 → Z3",
      pillCx: 688,
      pillCy: 295,
      color: "#b85a3e",
      pillLabel: "GEAR UP",
      giraffeNote:
        "Contractor credential appears at the gate membrane only — not stored inside Z2 records. The giraffe can see over the fence from the road. It cannot enter unless you cross the trigger threshold. No reverse path to Z1.",
      hats: [
        {
          id: "representative",
          label: "Representative",
          description:
            "Speaking for the household or practice in community space. Visible.",
        },
        {
          id: "neighbour",
          label: "Neighbour",
          description:
            "Participating as myself — no practitioner hat, no business card.",
        },
        {
          id: "gatekeeper",
          label: "Gatekeeper",
          description: "Two valid variants — see tension note below.",
          tension: {
            variantA: {
              label: "Personal hat",
              note:
                "The practitioner wears the Gatekeeper hat. They are personally responsible for what crosses.",
            },
            variantB: {
              label: "Workbench-only function",
              note:
                "Gatekeeper belongs to the Workbench itself — not a personal identity. The practitioner doesn't wear it; the system holds it.",
            },
          },
        },
      ],
    },
    {
      id: "z1z3",
      from: "z1",
      to: "z3",
      type: "prohibition" as const,
      label: "Z1 → Z3",
      description:
        "Absolute prohibition. No direct path. No traversal via Z2.",
    },
  ],
};

// ─── TYPES ───────────────────────────────────────────────────────────────────

type AdjacencyType = "eave-flow" | "gate" | "prohibition";
type AdjacencyId = "z0z1" | "z1z2" | "z2z3" | "z1z3";

interface EaveFlowStep {
  id: string;
  label: string;
  description: string;
}

const EAVE_FLOW_STEPS: EaveFlowStep[] = [
  {
    id: "clear",
    label: "Clear the leaves",
    description:
      "Name any outstanding household matters that would clog the flow.",
  },
  {
    id: "open",
    label: "Open the valve",
    description:
      "The household is present in the circle. Flow is open.",
  },
  {
    id: "check",
    label: "Check the level",
    description:
      "Is the cistern full? Is there capacity for what's coming in?",
  },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export function ZoneBubbleMap() {
  const [activeId, setActiveId] = useState<AdjacencyId | null>(null);
  const [selectedHat, setSelectedHat] = useState<string | null>(null);
  const [gatekeeperVariant, setGatekeeperVariant] = useState<
    "a" | "b" | null
  >(null);
  const [eaveStep, setEaveStep] = useState(0); // 0=idle shown, 1-3 steps, 4=done
  const [crossedGates, setCrossedGates] = useState<AdjacencyId[]>([]);
  const [currentZone, setCurrentZone] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const adjacency = ZONE_CONFIG.adjacencies.find((a) => a.id === activeId);
  const adjacencyType: AdjacencyType | undefined = adjacency?.type;

  const openPanel = (id: AdjacencyId) => {
    if (id === "z1z3") return; // prohibition — no panel
    setActiveId(id);
    setSelectedHat(null);
    setGatekeeperVariant(null);
    setEaveStep(0);
    setConfirmed(false);
  };

  const closePanel = () => {
    setActiveId(null);
    setSelectedHat(null);
    setGatekeeperVariant(null);
    setEaveStep(0);
    setConfirmed(false);
  };

  const handleGateConfirm = () => {
    if (!activeId) return;
    const canConfirm =
      selectedHat &&
      (selectedHat !== "gatekeeper" || gatekeeperVariant !== null);
    if (!canConfirm) return;
    const adj = ZONE_CONFIG.adjacencies.find((a) => a.id === activeId);
    if (adj) {
      setCrossedGates((prev) =>
        prev.includes(activeId) ? prev : [...prev, activeId]
      );
      setCurrentZone(adj.to);
    }
    setConfirmed(true);
  };

  const handleEaveConfirm = () => {
    if (!activeId) return;
    setCrossedGates((prev) =>
      prev.includes(activeId) ? prev : [...prev, activeId]
    );
    setCurrentZone("z1");
    setConfirmed(true);
  };

  const zoneMap = Object.fromEntries(
    ZONE_CONFIG.zones.map((z) => [z.id, z])
  );

  const adj = adjacency as (typeof ZONE_CONFIG.adjacencies)[number] | undefined;
  const gateAdj =
    adj && adj.type === "gate"
      ? (adj as Extract<typeof adj, { type: "gate" }>)
      : null;

  const chosenHat = gateAdj?.hats?.find((h) => h.id === selectedHat);

  // ── SVG helpers ────────────────────────────────────────────────────────────

  const eaveMaxX = 765; // right edge of the eave overhang (stops before Z3)

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: "#F4EDE0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "28px 20px 40px",
      }}
    >
      <div style={{ maxWidth: 980, width: "100%" }}>
        {/* Header */}
        <div style={{ marginBottom: 18 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#4F6E5C",
            }}
          >
            Zone Bubble & Gate Map
          </span>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#1C1917",
              margin: "4px 0 3px",
            }}
          >
            Zones are not rooms. They are postures.
          </h2>
          <p style={{ fontSize: 12, color: "#78716C", margin: 0 }}>
            Tap a gate membrane to gear up. Eave Flow is not a hat ceremony.
          </p>
        </div>

        {/* Zone locator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 11, color: "#78716C" }}>
            You are here:
          </span>
          {[null, "z0", "z1", "z2", "z3"].map((zid) => {
            const z = zid ? zoneMap[zid] : null;
            return (
              <button
                key={zid ?? "none"}
                onClick={() => setCurrentZone(zid)}
                style={{
                  padding: "3px 10px",
                  borderRadius: 20,
                  border:
                    currentZone === zid
                      ? `2px solid ${z?.stroke ?? "#A8A29E"}`
                      : "1.5px solid #E7E5E4",
                  background:
                    currentZone === zid ? (z?.fill ?? "#F4EDE0") : "white",
                  fontSize: 11,
                  fontWeight: currentZone === zid ? 700 : 500,
                  color: z?.textFill ?? "#78716C",
                  cursor: "pointer",
                }}
              >
                {z ? `${z.label} ${z.name}` : "—"}
              </button>
            );
          })}
        </div>

        {/* ── SVG Map ── */}
        <svg
          viewBox="0 0 980 430"
          style={{ width: "100%", display: "block" }}
          aria-label="Zone Bubble and Gate Map"
        >
          <defs>
            {/* Gate overlap highlights via clipPath */}
            <clipPath id="clip-z1-by-z0">
              <circle
                cx={ZONE_CONFIG.zones[0].cx}
                cy={ZONE_CONFIG.zones[0].cy}
                r={ZONE_CONFIG.zones[0].r}
              />
            </clipPath>
            <clipPath id="clip-z2-by-z1">
              <circle
                cx={ZONE_CONFIG.zones[1].cx}
                cy={ZONE_CONFIG.zones[1].cy}
                r={ZONE_CONFIG.zones[1].r}
              />
            </clipPath>
            <clipPath id="clip-z3-by-z2">
              <circle
                cx={ZONE_CONFIG.zones[2].cx}
                cy={ZONE_CONFIG.zones[2].cy}
                r={ZONE_CONFIG.zones[2].r}
              />
            </clipPath>
            {/* Eave clip — covers Z0, Z1, Z2 */}
            <clipPath id="clip-eave">
              <rect x={0} y={0} width={eaveMaxX} height={180} />
            </clipPath>
          </defs>

          {/* Eave Overhang — shelters Z0, Z1, Z2 from Z3 rain */}
          <rect
            x={0}
            y={22}
            width={eaveMaxX}
            height={56}
            rx={4}
            fill="#1F3D2E"
            opacity={0.10}
          />
          <rect
            x={0}
            y={22}
            width={eaveMaxX}
            height={4}
            rx={2}
            fill="#2D5C42"
            opacity={0.55}
          />
          {/* Eave drip marks */}
          {[60, 160, 280, 400, 520, 640, 720].map((x) => (
            <line
              key={x}
              x1={x}
              y1={26}
              x2={x}
              y2={36}
              stroke="#2D5C42"
              strokeWidth={1.5}
              opacity={0.35}
            />
          ))}
          <text
            x={eaveMaxX / 2}
            y={58}
            textAnchor="middle"
            fill="#1F3D2E"
            fontSize={9}
            fontWeight={700}
            letterSpacing={1.8}
            opacity={0.7}
          >
            EAVE — SHELTERS Z0 · Z1 · Z2 FROM Z3 RAIN
          </text>

          {/* Zone fills */}
          {ZONE_CONFIG.zones.map((z) => (
            <circle
              key={z.id}
              cx={z.cx}
              cy={z.cy}
              r={z.r}
              fill={z.fill}
              stroke={z.stroke}
              strokeWidth={2}
              opacity={0.92}
            />
          ))}

          {/* Overlap highlight: Z0 ∩ Z1 (Eave Flow membrane) */}
          <circle
            cx={ZONE_CONFIG.zones[1].cx}
            cy={ZONE_CONFIG.zones[1].cy}
            r={ZONE_CONFIG.zones[1].r}
            fill="#6B8C5A"
            clipPath="url(#clip-z1-by-z0)"
            opacity={0.28}
          />

          {/* Overlap highlight: Z1 ∩ Z2 (Gate membrane) */}
          <circle
            cx={ZONE_CONFIG.zones[2].cx}
            cy={ZONE_CONFIG.zones[2].cy}
            r={ZONE_CONFIG.zones[2].r}
            fill="#C4A020"
            clipPath="url(#clip-z2-by-z1)"
            opacity={0.32}
          />

          {/* Overlap highlight: Z2 ∩ Z3 (Gate membrane) */}
          <circle
            cx={ZONE_CONFIG.zones[3].cx}
            cy={ZONE_CONFIG.zones[3].cy}
            r={ZONE_CONFIG.zones[3].r}
            fill="#b85a3e"
            clipPath="url(#clip-z3-by-z2)"
            opacity={0.38}
          />

          {/* "You are here" marker */}
          {currentZone &&
            (() => {
              const z = zoneMap[currentZone];
              if (!z) return null;
              return (
                <g>
                  <circle
                    cx={z.cx}
                    cy={z.cy + z.r - 28}
                    r={8}
                    fill={z.stroke}
                    opacity={0.9}
                  />
                  <text
                    x={z.cx}
                    y={z.cy + z.r - 24}
                    textAnchor="middle"
                    fill="white"
                    fontSize={9}
                    fontWeight={800}
                  >
                    ▲
                  </text>
                  <text
                    x={z.cx}
                    y={z.cy + z.r - 10}
                    textAnchor="middle"
                    fill={z.stroke}
                    fontSize={8}
                    fontWeight={700}
                    letterSpacing={0.5}
                    opacity={0.9}
                  >
                    YOU ARE HERE
                  </text>
                </g>
              );
            })()}

          {/* Zone labels */}
          {ZONE_CONFIG.zones.map((z) => (
            <g key={`label-${z.id}`}>
              <text
                x={z.id === "z3" ? z.cx + 18 : z.cx - (z.id === "z2" ? 12 : 18)}
                y={z.id === "z2" ? z.cy - z.r + 52 : z.cy - z.r + 44}
                textAnchor="middle"
                fill={z.textFill}
                fontSize={9.5}
                fontWeight={800}
                letterSpacing={1.4}
              >
                {z.label}
              </text>
              <text
                x={z.id === "z3" ? z.cx + 18 : z.cx - (z.id === "z2" ? 12 : 18)}
                y={z.id === "z2" ? z.cy - z.r + 70 : z.cy - z.r + 62}
                textAnchor="middle"
                fill={z.textFill}
                fontSize={17}
                fontWeight={700}
              >
                {z.name}
              </text>
              <text
                x={z.id === "z3" ? z.cx + 18 : z.cx - (z.id === "z2" ? 12 : 18)}
                y={z.id === "z2" ? z.cy - z.r + 86 : z.cy - z.r + 78}
                textAnchor="middle"
                fill={z.lightText}
                fontSize={10}
              >
                {z.sub}
              </text>
              <text
                x={z.id === "z3" ? z.cx + 18 : z.cx - (z.id === "z2" ? 12 : 18)}
                y={z.id === "z2" ? z.cy - z.r + 102 : z.cy - z.r + 94}
                textAnchor="middle"
                fill={z.lightText}
                fontSize={9}
                fontStyle="italic"
                opacity={0.8}
              >
                {z.note}
              </text>
            </g>
          ))}

          {/* Gate and Eave-Flow pills */}
          {ZONE_CONFIG.adjacencies
            .filter((a) => a.type !== "prohibition")
            .map((a) => {
              const isCrossed = crossedGates.includes(a.id as AdjacencyId);
              const isActive = activeId === a.id;
              return (
                <g
                  key={a.id}
                  onClick={() => openPanel(a.id as AdjacencyId)}
                  style={{ cursor: "pointer" }}
                  role="button"
                  aria-label={`${a.label} — tap to interact`}
                >
                  <rect
                    x={a.pillCx - 58}
                    y={a.pillCy - 20}
                    width={116}
                    height={42}
                    rx={21}
                    fill={isActive ? darken(a.color) : a.color}
                    opacity={isCrossed ? 0.6 : 0.95}
                  />
                  {isCrossed && (
                    <text
                      x={a.pillCx}
                      y={a.pillCy - 5}
                      textAnchor="middle"
                      fill="white"
                      fontSize={13}
                    >
                      ✓
                    </text>
                  )}
                  <text
                    x={a.pillCx}
                    y={isCrossed ? a.pillCy + 10 : a.pillCy - 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize={10}
                    fontWeight={800}
                    letterSpacing={0.7}
                  >
                    {a.label}
                  </text>
                  {!isCrossed && (
                    <text
                      x={a.pillCx}
                      y={a.pillCy + 11}
                      textAnchor="middle"
                      fill="white"
                      fontSize={8.5}
                      opacity={0.85}
                      letterSpacing={0.5}
                    >
                      {"pillLabel" in a ? a.pillLabel : ""}
                    </text>
                  )}
                </g>
              );
            })}

          {/* Z1 → Z3 Prohibition membrane */}
          {(() => {
            const z1 = zoneMap["z1"];
            const z3 = zoneMap["z3"];
            const y = z1.cy + z1.r + 18;
            return (
              <g>
                <line
                  x1={z1.cx - z1.r + 20}
                  y1={y}
                  x2={z3.cx + z3.r - 20}
                  y2={y}
                  stroke="#D4A0A0"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  opacity={0.7}
                />
                <text
                  x={(z1.cx + z3.cx) / 2}
                  y={y + 14}
                  textAnchor="middle"
                  fill="#B07070"
                  fontSize={9}
                  fontStyle="italic"
                  letterSpacing={0.3}
                >
                  Z1 → Z3 prohibited · no direct path · no traversal via Z2 ·
                  redacted membrane
                </text>
              </g>
            );
          })()}
        </svg>

        {/* ── Interaction Panel ── */}
        {adj && (
          <div
            style={{
              marginTop: 16,
              background: "white",
              borderRadius: 16,
              padding: "22px 24px",
              border: `2px solid ${"color" in adj ? adj.color : "#E7E5E4"}`,
              boxShadow: "0 8px 32px rgba(0,0,0,0.09)",
            }}
          >
            {/* ── EAVE FLOW ── */}
            {adjacencyType === "eave-flow" && !confirmed && (
              <EaveFlowPanel
                steps={EAVE_FLOW_STEPS}
                eaveStep={eaveStep}
                onStep={(n) => setEaveStep(n)}
                onConfirm={handleEaveConfirm}
                onClose={closePanel}
                color={adj.color}
              />
            )}

            {/* ── GATE GEAR-UP ── */}
            {adjacencyType === "gate" && gateAdj && !confirmed && (
              <GatePanel
                adj={gateAdj}
                selectedHat={selectedHat}
                gatekeeperVariant={gatekeeperVariant}
                onSelectHat={(id) => {
                  setSelectedHat(id);
                  setGatekeeperVariant(null);
                }}
                onSelectGkVariant={setGatekeeperVariant}
                onConfirm={handleGateConfirm}
                onClose={closePanel}
              />
            )}

            {/* ── CONFIRMED ── */}
            {confirmed && (
              <ConfirmedPanel
                type={adjacencyType!}
                hatLabel={chosenHat?.label}
                hatDesc={chosenHat?.description}
                eaveStep={eaveStep}
                onClose={closePanel}
                accentColor={"color" in adj ? adj.color : "#1F3D2E"}
              />
            )}
          </div>
        )}

        {/* Legend */}
        {!adj && (
          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              paddingTop: 14,
              borderTop: "1px solid #E7E5E4",
            }}
          >
            {[
              { color: "#6B8C5A", label: "Z0→Z1 Eave Flow (valve, not hat)" },
              { color: "#8A6A1A", label: "Z1→Z2 Gate (gear-up)" },
              { color: "#b85a3e", label: "Z2→Z3 Gate (credential at crossing)" },
              { color: "#D4A0A0", label: "Z1→Z3 Prohibited membrane" },
              { color: "#1F3D2E", label: "Eave overhang (shelters Z0–Z2)" },
            ].map((item) => (
              <div
                key={item.label}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: item.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 10.5, color: "#78716C" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SUB-PANELS ──────────────────────────────────────────────────────────────

function EaveFlowPanel({
  steps,
  eaveStep,
  onStep,
  onConfirm,
  onClose,
  color,
}: {
  steps: EaveFlowStep[];
  eaveStep: number;
  onStep: (n: number) => void;
  onConfirm: () => void;
  onClose: () => void;
  color: string;
}) {
  return (
    <>
      <PanelHeader
        accent={color}
        tag="Eave Flow — Z0 → Z1"
        title="Open the flow"
        subtitle="This is not a hat ceremony. Water moves from roof to cistern. You're not changing who you are — you're letting the household flow into the circle."
        onClose={onClose}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {steps.map((step, i) => {
          const done = eaveStep > i + 1;
          const active = eaveStep === i + 1 || (eaveStep === 0 && i === 0);
          return (
            <button
              key={step.id}
              onClick={() => onStep(i + 1)}
              style={{
                textAlign: "left",
                padding: "13px 16px",
                borderRadius: 10,
                border: done
                  ? `2px solid ${color}`
                  : eaveStep === i + 1
                  ? `2px solid ${color}`
                  : "1.5px solid #E7E5E4",
                background: done ? "#F0F7F3" : active ? "#FAFAF9" : "white",
                cursor: "pointer",
                opacity: eaveStep > i + 2 ? 0.6 : 1,
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 3 }}>
                <span style={{ fontSize: 13 }}>{done ? "✓" : `${i + 1}.`}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1C1917" }}>
                  {step.label}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#78716C", lineHeight: 1.5, paddingLeft: 26 }}>
                {step.description}
              </div>
            </button>
          );
        })}
      </div>
      <ConfirmButton
        label="Flow is open — enter Circle"
        disabled={eaveStep < 3}
        color={color}
        onClick={onConfirm}
      />
    </>
  );
}

function GatePanel({
  adj,
  selectedHat,
  gatekeeperVariant,
  onSelectHat,
  onSelectGkVariant,
  onConfirm,
  onClose,
}: {
  adj: (typeof ZONE_CONFIG.adjacencies)[number] & { type: "gate" };
  selectedHat: string | null;
  gatekeeperVariant: "a" | "b" | null;
  onSelectHat: (id: string) => void;
  onSelectGkVariant: (v: "a" | "b") => void;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const hats = "hats" in adj ? adj.hats : [];
  const giraffeNote = "giraffeNote" in adj ? (adj.giraffeNote as string) : null;
  const from = ZONE_CONFIG.zones.find((z) => z.id === adj.from)?.name ?? adj.from;
  const to = ZONE_CONFIG.zones.find((z) => z.id === adj.to)?.name ?? adj.to;

  const canConfirm =
    selectedHat !== null &&
    (selectedHat !== "gatekeeper" || gatekeeperVariant !== null);

  return (
    <>
      <PanelHeader
        accent={adj.color}
        tag={`Gear Up — ${adj.label}`}
        title={`${from} → ${to}`}
        subtitle={
          giraffeNote
            ? giraffeNote
            : "You're crossing a zone boundary. What hat are you putting on?"
        }
        onClose={onClose}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {hats.map((hat) => {
          const isGk = hat.id === "gatekeeper";
          const tension = "tension" in hat ? hat.tension : null;
          return (
            <div key={hat.id}>
              <button
                onClick={() => onSelectHat(hat.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "13px 16px",
                  borderRadius: 10,
                  border:
                    selectedHat === hat.id
                      ? `2px solid ${adj.color}`
                      : "1.5px solid #E7E5E4",
                  background: selectedHat === hat.id ? "#FAFAF9" : "white",
                  cursor: "pointer",
                  transition: "all 0.14s",
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
                  {selectedHat === hat.id && (
                    <span style={{ fontSize: 14 }}>🎩</span>
                  )}
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1C1917" }}>
                    {hat.label}
                  </span>
                  {isGk && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: "#b85a3e",
                        background: "#FEF3EE",
                        padding: "2px 6px",
                        borderRadius: 4,
                        textTransform: "uppercase",
                      }}
                    >
                      Tension
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#78716C", lineHeight: 1.5 }}>
                  {hat.description}
                </div>
              </button>

              {/* Gatekeeper tension variants */}
              {isGk && selectedHat === "gatekeeper" && tension && (
                <div
                  style={{
                    margin: "6px 0 0",
                    padding: "14px 16px",
                    background: "#FEF8F5",
                    borderRadius: 10,
                    border: "1.5px solid #F0C8B8",
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#b85a3e",
                      margin: "0 0 10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Both variants — choose the one that fits, or note the tension
                  </p>
                  {(
                    [
                      { key: "a" as const, v: tension.variantA },
                      { key: "b" as const, v: tension.variantB },
                    ] as const
                  ).map(({ key, v }) => (
                    <button
                      key={key}
                      onClick={() => onSelectGkVariant(key)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        marginBottom: 8,
                        padding: "10px 12px",
                        borderRadius: 8,
                        border:
                          gatekeeperVariant === key
                            ? "2px solid #b85a3e"
                            : "1.5px solid #F0C8B8",
                        background:
                          gatekeeperVariant === key ? "#FEF0EA" : "white",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#5C1A0A",
                          marginBottom: 3,
                        }}
                      >
                        {key === "a" ? "A —" : "B —"} {v.label}
                      </div>
                      <div style={{ fontSize: 11, color: "#78716C", lineHeight: 1.5 }}>
                        {v.note}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmButton
        label="Gear up and cross →"
        disabled={!canConfirm}
        color={adj.color}
        onClick={onConfirm}
      />
    </>
  );
}

function ConfirmedPanel({
  type,
  hatLabel,
  hatDesc,
  eaveStep,
  onClose,
  accentColor,
}: {
  type: AdjacencyType;
  hatLabel?: string;
  hatDesc?: string;
  eaveStep: number;
  onClose: () => void;
  accentColor: string;
}) {
  return (
    <div style={{ textAlign: "center", padding: "10px 0" }}>
      <div style={{ fontSize: 38, marginBottom: 12 }}>
        {type === "eave-flow" ? "💧" : "🎩"}
      </div>
      <h3
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#1F3D2E",
          margin: "0 0 8px",
        }}
      >
        {type === "eave-flow" ? "Flow is open." : "You're geared up."}
      </h3>
      {type === "gate" && hatLabel && (
        <>
          <p style={{ fontSize: 14, color: "#44403C", margin: "0 0 4px" }}>
            Hat on:{" "}
            <strong style={{ color: accentColor }}>{hatLabel}</strong>
          </p>
          {hatDesc && hatDesc !== "Two valid variants — see tension note below." && (
            <p
              style={{
                fontSize: 12,
                color: "#78716C",
                fontStyle: "italic",
                margin: "0 0 18px",
              }}
            >
              "{hatDesc}"
            </p>
          )}
        </>
      )}
      {type === "eave-flow" && (
        <p style={{ fontSize: 13, color: "#78716C", margin: "0 0 18px" }}>
          Household is present in the circle. {eaveStep >= 3 ? "Cistern level checked." : ""}
        </p>
      )}
      <p
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "#1C1917",
          margin: "0 0 20px",
        }}
      >
        {type === "eave-flow"
          ? "Proceed when ready. The household flows with you."
          : "Cross when ready."}
      </p>
      <button
        onClick={onClose}
        style={{
          padding: "10px 26px",
          borderRadius: 8,
          border: "1.5px solid #E7E5E4",
          background: "white",
          cursor: "pointer",
          fontSize: 13,
          color: "#44403C",
          fontWeight: 500,
        }}
      >
        ← Back to map
      </button>
    </div>
  );
}

// ─── SHARED PRIMITIVES ───────────────────────────────────────────────────────

function PanelHeader({
  accent,
  tag,
  title,
  subtitle,
  onClose,
}: {
  accent: string;
  tag: string;
  title: string;
  subtitle: string;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 18,
      }}
    >
      <div style={{ flex: 1, paddingRight: 16 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.14em",
            color: accent,
            textTransform: "uppercase",
          }}
        >
          {tag}
        </span>
        <h3
          style={{ margin: "4px 0 5px", fontSize: 19, fontWeight: 700, color: "#1C1917" }}
        >
          {title}
        </h3>
        <p style={{ fontSize: 12.5, color: "#78716C", margin: 0, lineHeight: 1.55 }}>
          {subtitle}
        </p>
      </div>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#A8A29E",
          fontSize: 20,
          padding: "2px 6px",
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}

function ConfirmButton({
  label,
  disabled,
  color,
  onClick,
}: {
  label: string;
  disabled: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "13px",
        borderRadius: 10,
        border: "none",
        background: disabled ? "#E7E5E4" : color,
        color: disabled ? "#A8A29E" : "white",
        fontWeight: 700,
        fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        letterSpacing: 0.3,
      }}
    >
      {label}
    </button>
  );
}

function darken(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (n >> 16) - 40);
  const g = Math.max(0, ((n >> 8) & 0xff) - 40);
  const b = Math.max(0, (n & 0xff) - 40);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
