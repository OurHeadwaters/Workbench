type Scenario = {
  key: "A" | "B" | "C";
  label: string;
  contract: number;
  team: number;
  takeHome: number;
  reinvest: number;
  outflow: number;
  bridge: number;
  ar: number;
  cum: number[];
  stroke: string;
  recommended?: boolean;
};

function buildScenario(args: {
  key: Scenario["key"];
  label: string;
  contract: number;
  team: number;
  takeHome: number;
  reinvest: number;
  stroke: string;
  recommended?: boolean;
}): Scenario {
  const outflow = args.team + args.takeHome;
  const cum: number[] = [];
  let running = 0;
  for (let m = 1; m <= 12; m++) {
    const inflow = m >= 3 ? args.contract : 0;
    running += inflow - outflow;
    cum.push(running);
  }
  const bridge = -Math.min(...cum);
  const ar = args.contract * 2;
  return { ...args, outflow, cum, bridge, ar };
}

const scenarios: Scenario[] = [
  buildScenario({
    key: "A",
    label: "$20k contract",
    contract: 20000,
    team: 11000,
    takeHome: 7000,
    reinvest: 2000,
    stroke: "#6b7665",
  }),
  buildScenario({
    key: "B",
    label: "$25k contract",
    contract: 25000,
    team: 11000,
    takeHome: 9000,
    reinvest: 5000,
    stroke: "#b85a3e",
    recommended: true,
  }),
  buildScenario({
    key: "C",
    label: "$30k contract",
    contract: 30000,
    team: 11000,
    takeHome: 11000,
    reinvest: 8000,
    stroke: "#1f3d2e",
  }),
];

const fmt = (n: number) =>
  (n < 0 ? "−" : "") + "$" + Math.abs(Math.round(n / 1000)) + "k";

export default function CashFlow() {
  // Chart geometry — viewBox units, scaled by SVG container
  const W = 1000;
  const H = 360;
  const padL = 56;
  const padR = 16;
  const padT = 16;
  const padB = 36;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const yMin = -50000;
  const yMax = 40000;
  const xFor = (m: number) => padL + ((m - 0) / 12) * innerW; // m goes 0..12
  const yFor = (v: number) =>
    padT + (1 - (v - yMin) / (yMax - yMin)) * innerH;

  const yTicks = [40000, 20000, 0, -20000, -40000];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              II · Cash flow on a 60-day pay cycle
            </div>
            <h2
              className="font-display text-[3.6vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              The budget works.
              <span className="italic font-normal text-accent"> The bridge is what we have to name.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[30vw] font-body text-[1.05vw] text-muted leading-[1.4]">
            Indigenous-services contracts often pay net-60.
            Payroll for the team starts month one;
            the first invoice doesn't clear until month three.
            Below is what that gap actually looks like.
          </div>
        </div>

        <div
          className="rounded-[0.4vw] px-[1.6vw] pt-[1vw] pb-[0.8vw] mb-[1.4vh]"
          style={{ background: "var(--slide-paper)" }}
        >
          <div className="flex items-baseline justify-between mb-[0.6vh]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-accent font-semibold">
              Cumulative cash position · months 1–12
            </div>
            <div className="flex gap-[1.4vw] font-mono text-[0.85vw] text-muted">
              <div className="flex items-center gap-[0.4vw]">
                <span style={{ background: "#6b7665" }} className="inline-block w-[1.4vw] h-[2px]" />
                $20k
              </div>
              <div className="flex items-center gap-[0.4vw]">
                <span style={{ background: "#b85a3e" }} className="inline-block w-[1.4vw] h-[3px]" />
                $25k <span className="opacity-70">· recommended</span>
              </div>
              <div className="flex items-center gap-[0.4vw]">
                <span style={{ background: "#1f3d2e" }} className="inline-block w-[1.4vw] h-[2px]" />
                $30k
              </div>
            </div>
          </div>

          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: "24vh", display: "block" }}
          >
            {/* Y gridlines + labels */}
            {yTicks.map((v) => (
              <g key={v}>
                <line
                  x1={padL}
                  x2={W - padR}
                  y1={yFor(v)}
                  y2={yFor(v)}
                  stroke={v === 0 ? "#1f3d2e" : "#c8bfa7"}
                  strokeWidth={v === 0 ? 1.4 : 0.8}
                  strokeDasharray={v === 0 ? "none" : "3 4"}
                />
                <text
                  x={padL - 8}
                  y={yFor(v) + 4}
                  textAnchor="end"
                  fontSize="12"
                  fontFamily="IBM Plex Mono, monospace"
                  fill="#6b7665"
                >
                  {fmt(v)}
                </text>
              </g>
            ))}

            {/* X labels */}
            {months.map((m) => (
              <text
                key={m}
                x={xFor(m)}
                y={H - 12}
                textAnchor="middle"
                fontSize="11"
                fontFamily="IBM Plex Mono, monospace"
                fill="#6b7665"
              >
                M{m}
              </text>
            ))}

            {/* Shaded "below zero" band for the bridge region — subtle */}
            <rect
              x={padL}
              y={yFor(0)}
              width={innerW}
              height={yFor(yMin) - yFor(0)}
              fill="#b85a3e"
              opacity="0.05"
            />

            {/* Lines */}
            {scenarios.map((s) => {
              const points = [
                `${xFor(0)},${yFor(0)}`,
                ...s.cum.map((v, i) => `${xFor(i + 1)},${yFor(v)}`),
              ].join(" ");
              return (
                <g key={s.key}>
                  <polyline
                    points={points}
                    fill="none"
                    stroke={s.stroke}
                    strokeWidth={s.recommended ? 3 : 2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  {/* Dot at the trough (end of M2) */}
                  <circle
                    cx={xFor(2)}
                    cy={yFor(s.cum[1])}
                    r={s.recommended ? 5 : 4}
                    fill={s.stroke}
                  />
                </g>
              );
            })}

            {/* Trough annotation */}
            <line
              x1={xFor(2)}
              x2={xFor(2)}
              y1={yFor(0)}
              y2={yFor(scenarios[2].cum[1])}
              stroke="#b85a3e"
              strokeWidth="1"
              strokeDasharray="2 3"
              opacity="0.7"
            />
            <text
              x={xFor(2) + 8}
              y={yFor(scenarios[2].cum[1]) - 6}
              fontSize="11"
              fontFamily="IBM Plex Mono, monospace"
              fill="#b85a3e"
              fontWeight="600"
            >
              deepest dip · end of month 2
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-[1.4vw] flex-1 min-h-0">
          {scenarios.map((s) => {
            const isReco = !!s.recommended;
            return (
              <div
                key={s.key}
                className="rounded-[0.4vw] p-[1.4vw] flex flex-col relative"
                style={
                  isReco
                    ? { background: "var(--slide-primary)", color: "var(--slide-bg)" }
                    : { background: "var(--slide-paper)" }
                }
              >
                {isReco && (
                  <div
                    className="absolute top-[-1.2vh] right-[1vw] font-mono uppercase tracking-[0.22em] text-[0.85vw] px-[0.7vw] py-[0.3vh] rounded-[0.2vw]"
                    style={{ background: "var(--slide-accent)", color: "var(--slide-bg)" }}
                  >
                    Recommended ask
                  </div>
                )}
                <div
                  className="font-mono uppercase tracking-[0.22em] text-[0.9vw] mb-[0.3vh]"
                  style={isReco ? { color: "#e9c8a8" } : { color: "var(--slide-muted)" }}
                >
                  Scenario {s.key} · {s.label}
                </div>
                <div className="flex items-baseline justify-between mt-[0.4vh] mb-[0.8vh]">
                  <div
                    className="font-mono uppercase tracking-[0.18em] text-[0.85vw]"
                    style={isReco ? { color: "#e9c8a8" } : { color: "var(--slide-muted)" }}
                  >
                    Bridge needed
                  </div>
                  <div
                    className="font-display text-[2.6vw] font-semibold leading-none"
                    style={isReco ? { color: "#e9c8a8" } : { color: "var(--slide-primary)" }}
                  >
                    ${(s.bridge / 1000).toFixed(0)}k
                  </div>
                </div>
                <div
                  className="space-y-[0.5vh] font-body text-[0.92vw] leading-[1.3] pt-[0.7vh] border-t"
                  style={
                    isReco
                      ? { borderColor: "rgba(244,237,224,0.3)", opacity: 0.95 }
                      : { borderColor: "var(--slide-rule)" }
                  }
                >
                  <div className="flex justify-between">
                    <span>Contract revenue / mo (lands M3+)</span>
                    <span className="font-mono font-semibold">+${(s.contract / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Team payroll / mo</span>
                    <span className="font-mono font-semibold">−${(s.team / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Practitioner take-home / mo</span>
                    <span className="font-mono font-semibold">−${(s.takeHome / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cash position end of M12</span>
                    <span className="font-mono font-semibold">{fmt(s.cum[11])}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>A/R outstanding at M12</span>
                    <span className="font-mono font-semibold">${(s.ar / 1000).toFixed(0)}k</span>
                  </div>
                </div>
                <div
                  className="mt-[0.8vh] pt-[0.7vh] border-t font-mono text-[0.82vw] leading-[1.35]"
                  style={
                    isReco
                      ? { borderColor: "rgba(244,237,224,0.3)", color: "#e9c8a8" }
                      : { borderColor: "var(--slide-rule)", color: "var(--slide-muted)" }
                  }
                >
                  {s.key === "A" &&
                    "Bridge isn't fully recovered in year one. The $20k ask is feasible but tight."}
                  {s.key === "B" &&
                    "Bridge clears around month ten. Steady-state working capital ≈ two months of revenue."}
                  {s.key === "C" &&
                    "Bridge clears by month eight. Buffer accumulates fast enough to fund the next pitch."}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-[1vh] font-body text-[0.92vw] text-muted leading-[1.35]">
          Bridge needed = the month-2 trough — two months of team payroll
          plus take-home spent before any net-60 invoice clears. It's not a
          loss; it's working capital tied up in receivables, recovered when
          the engagement ends and the last two invoices clear.
          <span className="text-primary font-semibold">
            {" "}Day-one ask: ~$40k of bridge capital
          </span>
          {" "}so the team can be paid before the first cheque lands.
        </div>
      </div>
    </div>
  );
}
