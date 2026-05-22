import { useState } from "react";

type GateKey = "z1z2" | "z2z3";

interface Hat {
  id: string;
  label: string;
  description: string;
}

interface Gate {
  id: GateKey;
  label: string;
  from: string;
  to: string;
  cx: number;
  cy: number;
  accentColor: string;
  hats: Hat[];
}

const GATES: Gate[] = [
  {
    id: "z1z2",
    label: "Z1 → Z2",
    from: "Circle",
    to: "Workbench",
    cx: 340,
    cy: 280,
    accentColor: "#8A6A1A",
    hats: [
      {
        id: "practitioner",
        label: "Practitioner",
        description:
          "Leaving household. Practice lens on. I'm showing up to work.",
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
    label: "Z2 → Z3",
    from: "Workbench",
    to: "Community",
    cx: 560,
    cy: 280,
    accentColor: "#b85a3e",
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
        description:
          "At the threshold deciding what crosses from the workbench into public space.",
      },
    ],
  },
];

export function ZoneBubbleMap() {
  const [activeGate, setActiveGate] = useState<GateKey | null>(null);
  const [selectedHat, setSelectedHat] = useState<string | null>(null);
  const [geared, setGeared] = useState(false);

  const gate = GATES.find((g) => g.id === activeGate) ?? null;

  const handleGateClick = (id: GateKey) => {
    setActiveGate(id);
    setSelectedHat(null);
    setGeared(false);
  };

  const handleConfirm = () => {
    if (selectedHat) setGeared(true);
  };

  const handleClose = () => {
    setActiveGate(null);
    setSelectedHat(null);
    setGeared(false);
  };

  const chosenHat = gate?.hats.find((h) => h.id === selectedHat);

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: "#F4EDE0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
      }}
    >
      <div style={{ maxWidth: 860, width: "100%" }}>
        <div style={{ marginBottom: 20 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#4F6E5C",
            }}
          >
            Zone Bubble Map
          </span>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#1C1917",
              margin: "4px 0 4px",
            }}
          >
            Zones are not rooms. They are postures.
          </h2>
          <p style={{ fontSize: 13, color: "#78716C", margin: 0 }}>
            Tap a gate to gear up before crossing.
          </p>
        </div>

        {/* SVG Zone Map */}
        <svg
          viewBox="0 0 860 420"
          style={{ width: "100%", display: "block" }}
          aria-label="Zone bubble map with three overlapping zones"
        >
          <defs>
            {/* Intersection clip paths for gate highlight */}
            <clipPath id="clip-z2-over-z1">
              <circle cx={430} cy={210} r={205} />
            </clipPath>
            <clipPath id="clip-z3-over-z2">
              <circle cx={660} cy={210} r={205} />
            </clipPath>
          </defs>

          {/* Z1 — Circle (household) */}
          <circle
            cx={200}
            cy={210}
            r={205}
            fill="#F9EDD8"
            stroke="#C4956A"
            strokeWidth={2}
          />

          {/* Z2 — Workbench (liminal) */}
          <circle
            cx={430}
            cy={210}
            r={205}
            fill="#DCE9E2"
            stroke="#4F6E5C"
            strokeWidth={2}
            opacity={0.92}
          />

          {/* Z3 — Community (public) */}
          <circle
            cx={660}
            cy={210}
            r={205}
            fill="#1F3D2E"
            stroke="#1F3D2E"
            strokeWidth={2}
            opacity={0.88}
          />

          {/* Gate Z1→Z2 overlap highlight */}
          <circle
            cx={200}
            cy={210}
            r={205}
            fill="#D4A24A"
            clipPath="url(#clip-z2-over-z1)"
            opacity={0.38}
          />

          {/* Gate Z2→Z3 overlap highlight */}
          <circle
            cx={430}
            cy={210}
            r={205}
            fill="#5A8A6A"
            clipPath="url(#clip-z3-over-z2)"
            opacity={0.42}
          />

          {/* Z1 label block */}
          <text
            x={118}
            y={168}
            textAnchor="middle"
            fill="#7A4A2A"
            fontSize={10}
            fontWeight={800}
            letterSpacing={1.2}
          >
            Z1
          </text>
          <text
            x={118}
            y={190}
            textAnchor="middle"
            fill="#5C3317"
            fontSize={19}
            fontWeight={700}
          >
            Circle
          </text>
          <text
            x={118}
            y={210}
            textAnchor="middle"
            fill="#8B5E3C"
            fontSize={11}
          >
            Private household
          </text>
          <text
            x={118}
            y={226}
            textAnchor="middle"
            fill="#8B5E3C"
            fontSize={11}
          >
            identity
          </text>
          <text
            x={118}
            y={252}
            textAnchor="middle"
            fill="#A07850"
            fontSize={10}
            fontStyle="italic"
          >
            Lodge — Z1 identity layer
          </text>

          {/* Z2 label block */}
          <text
            x={430}
            y={130}
            textAnchor="middle"
            fill="#2D5C42"
            fontSize={10}
            fontWeight={800}
            letterSpacing={1.2}
          >
            Z2
          </text>
          <text
            x={430}
            y={152}
            textAnchor="middle"
            fill="#1A3D2A"
            fontSize={19}
            fontWeight={700}
          >
            Workbench
          </text>
          <text
            x={430}
            y={172}
            textAnchor="middle"
            fill="#3A6050"
            fontSize={11}
          >
            Liminal layer
          </text>
          <text
            x={430}
            y={188}
            textAnchor="middle"
            fill="#3A6050"
            fontSize={11}
          >
            Controlled crossings
          </text>
          <text
            x={430}
            y={210}
            textAnchor="middle"
            fill="#4F7060"
            fontSize={10}
            fontStyle="italic"
          >
            Reads both sides. Writes to neither.
          </text>

          {/* Z3 label block */}
          <text
            x={742}
            y={168}
            textAnchor="middle"
            fill="#A8D4B8"
            fontSize={10}
            fontWeight={800}
            letterSpacing={1.2}
          >
            Z3
          </text>
          <text
            x={742}
            y={190}
            textAnchor="middle"
            fill="#E8F4ED"
            fontSize={19}
            fontWeight={700}
          >
            Community
          </text>
          <text
            x={742}
            y={210}
            textAnchor="middle"
            fill="#A8D4B8"
            fontSize={11}
          >
            Public &amp; above-board
          </text>
          <text
            x={742}
            y={226}
            textAnchor="middle"
            fill="#A8D4B8"
            fontSize={11}
          >
            organisational identity
          </text>
          <text
            x={742}
            y={252}
            textAnchor="middle"
            fill="#7ABAAB"
            fontSize={10}
            fontStyle="italic"
          >
            XRPL wallet lives here
          </text>

          {/* Z1→Z2 Gate pill */}
          <g
            onClick={() => handleGateClick("z1z2")}
            style={{ cursor: "pointer" }}
            role="button"
            aria-label="Z1 to Z2 gate — tap to gear up"
          >
            <rect
              x={278}
              y={320}
              width={124}
              height={46}
              rx={23}
              fill={activeGate === "z1z2" ? "#5C4510" : "#8A6A1A"}
              opacity={0.95}
            />
            <text
              x={340}
              y={338}
              textAnchor="middle"
              fill="white"
              fontSize={11}
              fontWeight={800}
              letterSpacing={0.8}
            >
              Z1 → Z2
            </text>
            <text
              x={340}
              y={354}
              textAnchor="middle"
              fill="white"
              fontSize={9}
              opacity={0.85}
              letterSpacing={0.6}
            >
              TAP TO GEAR UP
            </text>
          </g>

          {/* Z2→Z3 Gate pill */}
          <g
            onClick={() => handleGateClick("z2z3")}
            style={{ cursor: "pointer" }}
            role="button"
            aria-label="Z2 to Z3 gate — tap to gear up"
          >
            <rect
              x={508}
              y={320}
              width={124}
              height={46}
              rx={23}
              fill={activeGate === "z2z3" ? "#7A2C1A" : "#b85a3e"}
              opacity={0.95}
            />
            <text
              x={570}
              y={338}
              textAnchor="middle"
              fill="white"
              fontSize={11}
              fontWeight={800}
              letterSpacing={0.8}
            >
              Z2 → Z3
            </text>
            <text
              x={570}
              y={354}
              textAnchor="middle"
              fill="white"
              fontSize={9}
              opacity={0.85}
              letterSpacing={0.6}
            >
              TAP TO GEAR UP
            </text>
          </g>

          {/* Z1→Z3 prohibition note */}
          <line
            x1={220}
            y1={395}
            x2={640}
            y2={395}
            stroke="#E7E5E4"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          <text
            x={430}
            y={410}
            textAnchor="middle"
            fill="#A8A29E"
            fontSize={10}
            fontStyle="italic"
          >
            Z1 → Z3 direct crossing: prohibited. No door. No traversal via Z2.
          </text>
        </svg>

        {/* Gear-Up Panel */}
        {gate && (
          <div
            style={{
              marginTop: 16,
              background: "white",
              borderRadius: 16,
              padding: "24px",
              border: `2px solid ${gate.accentColor}`,
              boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            }}
          >
            {!geared ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                        color: gate.accentColor,
                        textTransform: "uppercase",
                      }}
                    >
                      Gear Up — {gate.label}
                    </span>
                    <h3
                      style={{
                        margin: "4px 0 4px",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#1C1917",
                      }}
                    >
                      {gate.from} → {gate.to}
                    </h3>
                    <p style={{ fontSize: 13, color: "#78716C", margin: 0 }}>
                      You're crossing a zone boundary. What hat are you putting
                      on?
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#A8A29E",
                      fontSize: 20,
                      padding: "4px 8px",
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  {gate.hats.map((hat) => (
                    <button
                      key={hat.id}
                      onClick={() => setSelectedHat(hat.id)}
                      style={{
                        textAlign: "left",
                        padding: "14px 16px",
                        borderRadius: 12,
                        border:
                          selectedHat === hat.id
                            ? `2px solid ${gate.accentColor}`
                            : "1.5px solid #E7E5E4",
                        background:
                          selectedHat === hat.id ? "#FAFAF9" : "white",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 4,
                        }}
                      >
                        {selectedHat === hat.id && (
                          <span style={{ fontSize: 16 }}>🎩</span>
                        )}
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#1C1917",
                          }}
                        >
                          {hat.label}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#78716C",
                          lineHeight: 1.5,
                        }}
                      >
                        {hat.description}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={!selectedHat}
                  style={{
                    width: "100%",
                    padding: "13px",
                    borderRadius: 10,
                    border: "none",
                    background: selectedHat ? gate.accentColor : "#E7E5E4",
                    color: selectedHat ? "white" : "#A8A29E",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: selectedHat ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                    letterSpacing: 0.3,
                  }}
                >
                  Gear up and cross →
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>🎩</div>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#1F3D2E",
                    marginBottom: 8,
                    margin: "0 0 8px",
                  }}
                >
                  You're geared up.
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "#44403C",
                    marginBottom: 4,
                    margin: "0 0 4px",
                  }}
                >
                  Hat on:{" "}
                  <strong
                    style={{ color: gate.accentColor }}
                  >
                    {chosenHat?.label}
                  </strong>
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "#78716C",
                    marginBottom: 24,
                    fontStyle: "italic",
                    margin: "0 0 24px",
                  }}
                >
                  "{chosenHat?.description}"
                </p>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#1C1917",
                    marginBottom: 20,
                    margin: "0 0 20px",
                  }}
                >
                  Cross when ready.
                </p>
                <button
                  onClick={handleClose}
                  style={{
                    padding: "10px 28px",
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
            )}
          </div>
        )}

        {/* Legend — only when no gate panel open */}
        {!gate && (
          <div
            style={{
              marginTop: 20,
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              justifyContent: "center",
              paddingTop: 16,
              borderTop: "1px solid #E7E5E4",
            }}
          >
            {[
              { color: "#C4956A", label: "Z1 — Circle (private household)" },
              { color: "#4F6E5C", label: "Z2 — Workbench (liminal)" },
              { color: "#1F3D2E", label: "Z3 — Community (public)" },
              { color: "#8A6A1A", label: "Z1→Z2 Gate" },
              { color: "#b85a3e", label: "Z2→Z3 Gate" },
            ].map((item) => (
              <div
                key={item.label}
                style={{ display: "flex", alignItems: "center", gap: 7 }}
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
                <span style={{ fontSize: 11, color: "#78716C" }}>
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
