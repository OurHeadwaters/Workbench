export default function NamingTheAgency() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
    >
      <div
        className="absolute right-[-14vw] top-[-10vh] w-[52vw] h-[52vw] rounded-full"
        style={{ background: "rgba(184,90,62,0.16)" }}
      />
      <div
        className="absolute left-[6vw] bottom-[6vh] w-[16vw] h-[16vw] rounded-full"
        style={{ background: "rgba(244,237,224,0.05)" }}
      />

      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div className="flex items-center gap-[1.2vw]">
            <div
              className="w-[1.4vw] h-[1.4vw] rounded-full"
              style={{ background: "#e9c8a8" }}
            />
            <div className="font-mono uppercase tracking-[0.32em] text-[1.05vw] opacity-80">
              III · 02 — Naming the agency
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-60">
            Before the rate is pitched, the agency has a name
          </div>
        </div>

        <div className="grid grid-cols-12 gap-[2vw] mb-[2vh] items-start">
          <div className="col-span-5">
            <h1
              className="font-display text-[7.5vw] leading-[0.9] tracking-tight font-medium"
              style={{ color: "#f4ede0" }}
            >
              Headwaters.
            </h1>
          </div>
          <div className="col-span-7">
            <div
              className="border-l-[0.3vw] pl-[1.6vw]"
              style={{ borderColor: "#e9c8a8" }}
            >
              <div
                className="font-display italic font-light text-[1.85vw] leading-[1.3]"
                style={{ color: "#f4ede0", textWrap: "balance" }}
              >
                "This is the inflection point of my agency. The point the dam
                breaks because the headwaters became too much to bear."
              </div>
              <div className="mt-[1vh] font-mono uppercase tracking-[0.22em] text-[0.78vw] opacity-65">
                Founder, on naming the moment
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-[1.4vw] min-h-0">
          <div
            className="col-span-7 rounded-[0.4vw] p-[1.4vw] flex flex-col"
            style={{ background: "rgba(244,237,224,0.08)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.85vw] font-semibold mb-[1.2vh]"
              style={{ color: "#e9c8a8" }}
            >
              The structure — parent · product · clients
            </div>

            <div className="flex-1 relative">
              <BrandStructureDiagram />
            </div>
          </div>

          <div className="col-span-5 grid grid-rows-2 gap-[1vw] min-h-0">
            <div
              className="rounded-[0.4vw] p-[1.3vw] flex flex-col"
              style={{ background: "rgba(244,237,224,0.08)" }}
            >
              <div
                className="font-mono uppercase tracking-[0.22em] text-[0.78vw] font-semibold mb-[0.6vh]"
                style={{ color: "#e9c8a8" }}
              >
                Why now
              </div>
              <div
                className="font-display text-[1.15vw] leading-tight font-medium mb-[0.6vh]"
                style={{ color: "#f4ede0" }}
              >
                The entity that owns it all.
              </div>
              <div
                className="font-body text-[0.85vw] leading-[1.4] flex-1"
                style={{ color: "#f4ede0", opacity: 0.9 }}
              >
                The contract is signed in spirit. The team is costed. The
                reinvestment is named. What's missing is the entity that owns
                it. This slide names it.
              </div>
            </div>

            <div
              className="rounded-[0.4vw] p-[1.3vw] flex flex-col"
              style={{ background: "#f4ede0", color: "var(--slide-primary)" }}
            >
              <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-accent font-semibold mb-[0.6vh]">
                Why this name, not Watershed
              </div>
              <div className="font-display text-[1.15vw] leading-tight font-medium text-primary mb-[0.6vh]">
                Headwaters has the open lanes.
              </div>
              <div className="font-body text-[0.85vw] leading-[1.4] flex-1 text-text">
                Open trademark lanes for the agency in Class 36 (financial
                services) and Class 9 (consumer software). Watershed is
                contested in both. We keep Watershed inside Headwaters, where
                the contest is narrower.
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-[1.5vh] pt-[1.2vh] border-t font-display italic text-[1.05vw] leading-[1.4] max-w-[80vw]"
          style={{ borderColor: "rgba(244,237,224,0.2)", color: "#e9c8a8" }}
        >
          One sentence:{" "}
          <span className="not-italic font-mono uppercase tracking-[0.18em] text-[0.85vw]">
            Headwaters has the open lanes; Watershed has the contested ones.
          </span>
        </div>
      </div>
    </div>
  );
}

function BrandStructureDiagram() {
  return (
    <svg
      viewBox="0 0 600 220"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
      role="img"
      aria-label="Brand structure: Headwaters parent agency, with Watershed product, Deer Lake pilot, and future engagements as children"
    >
      <defs>
        <marker
          id="arrowhead"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#e9c8a8" />
        </marker>
      </defs>

      {/* Connector lines from parent to each child */}
      <path
        d="M 300 60 L 300 100 L 100 100 L 100 140"
        stroke="#e9c8a8"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4 4"
        opacity="0.7"
        markerEnd="url(#arrowhead)"
      />
      <path
        d="M 300 60 L 300 140"
        stroke="#e9c8a8"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4 4"
        opacity="0.7"
        markerEnd="url(#arrowhead)"
      />
      <path
        d="M 300 60 L 300 100 L 500 100 L 500 140"
        stroke="#e9c8a8"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4 4"
        opacity="0.7"
        markerEnd="url(#arrowhead)"
      />

      {/* Parent node — Headwaters */}
      <g>
        <rect
          x="220"
          y="20"
          width="160"
          height="44"
          rx="4"
          fill="#e9c8a8"
        />
        <text
          x="300"
          y="40"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="9"
          letterSpacing="2"
          fill="#1f3d2e"
          opacity="0.7"
        >
          PARENT AGENCY
        </text>
        <text
          x="300"
          y="56"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="18"
          fontWeight="500"
          fill="#1f3d2e"
        >
          Headwaters
        </text>
      </g>

      {/* Child node — Watershed (product) */}
      <g>
        <rect
          x="30"
          y="140"
          width="140"
          height="60"
          rx="4"
          fill="rgba(244,237,224,0.12)"
          stroke="#f4ede0"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        <text
          x="100"
          y="158"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="8"
          letterSpacing="2"
          fill="#e9c8a8"
        >
          PRODUCT
        </text>
        <text
          x="100"
          y="178"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="16"
          fontWeight="500"
          fill="#f4ede0"
        >
          Watershed
        </text>
        <text
          x="100"
          y="192"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="9"
          fontStyle="italic"
          fill="#f4ede0"
          opacity="0.75"
        >
          household finance
        </text>
      </g>

      {/* Child node — Deer Lake (pilot) */}
      <g>
        <rect
          x="230"
          y="140"
          width="140"
          height="60"
          rx="4"
          fill="rgba(244,237,224,0.12)"
          stroke="#f4ede0"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        <text
          x="300"
          y="158"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="8"
          letterSpacing="2"
          fill="#e9c8a8"
        >
          PILOT — FIRST CLIENT
        </text>
        <text
          x="300"
          y="178"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="16"
          fontWeight="500"
          fill="#f4ede0"
        >
          Deer Lake
        </text>
        <text
          x="300"
          y="192"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="9"
          fontStyle="italic"
          fill="#f4ede0"
          opacity="0.75"
        >
          inaugural engagement
        </text>
      </g>

      {/* Child node — Future engagements */}
      <g>
        <rect
          x="430"
          y="140"
          width="140"
          height="60"
          rx="4"
          fill="rgba(244,237,224,0.06)"
          stroke="#f4ede0"
          strokeWidth="1"
          strokeOpacity="0.25"
          strokeDasharray="3 3"
        />
        <text
          x="500"
          y="158"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="8"
          letterSpacing="2"
          fill="#e9c8a8"
          opacity="0.85"
        >
          NEXT CLIENTS
        </text>
        <text
          x="500"
          y="178"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="16"
          fontWeight="500"
          fill="#f4ede0"
          opacity="0.9"
        >
          Future reserves
        </text>
        <text
          x="500"
          y="192"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="9"
          fontStyle="italic"
          fill="#f4ede0"
          opacity="0.65"
        >
          pilot #2 onward
        </text>
      </g>
    </svg>
  );
}
