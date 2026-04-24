type Scenario = {
  key: "A" | "B" | "C";
  label: string;
  contract: number;
  cost: number;
  capex: number;
  cum: number[];
  bridge: number;
  ar: number;
  stroke: string;
  recommended?: boolean;
};

function buildScenario(args: {
  key: Scenario["key"];
  label: string;
  contract: number;
  cost: number;
  capex: number;
  stroke: string;
  recommended?: boolean;
}): Scenario {
  const cum: number[] = [];
  let running = 0;
  for (let m = 1; m <= 12; m++) {
    const inflow = m >= 3 ? args.contract : 0;
    const outflow = args.cost + (m === 1 ? args.capex : 0);
    running += inflow - outflow;
    cum.push(running);
  }
  const bridge = -Math.min(...cum);
  const ar = args.contract * 2;
  return { ...args, cum, bridge, ar };
}

const scenarios: Scenario[] = [
  buildScenario({
    key: "A",
    label: "$60k contract",
    contract: 60000,
    cost: 44400,
    capex: 0,
    stroke: "#6b7665",
  }),
  buildScenario({
    key: "B",
    label: "$90k contract",
    contract: 90000,
    cost: 66700,
    capex: 42000,
    stroke: "#b85a3e",
    recommended: true,
  }),
  buildScenario({
    key: "C",
    label: "$125k contract",
    contract: 125000,
    cost: 92600,
    capex: 60000,
    stroke: "#1f3d2e",
  }),
];

const fmt = (n: number) =>
  (n < 0 ? "−" : "") + "$" + Math.abs(Math.round(n / 1000)) + "k";

export default function CashFlow() {
  const W = 1000;
  const H = 360;
  const padL = 60;
  const padR = 16;
  const padT = 16;
  const padB = 36;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const yMin = -260000;
  const yMax = 100000;
  const xFor = (m: number) => padL + (m / 12) * innerW;
  const yFor = (v: number) =>
    padT + (1 - (v - yMin) / (yMax - yMin)) * innerH;

  const yTicks = [100000, 0, -100000, -200000];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[1.5vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              II · Cash flow on a 60-day pay cycle
            </div>
            <h2
              className="font-display text-[3.2vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Bigger contract, bigger bridge.
              <span className="italic font-normal text-accent"> Same shape, scaled up.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[0.92vw] text-muted leading-[1.4]">
            Indigenous-services contracts pay net-60. Payroll runs month one;
            the first cheque clears month three. Scenarios B and C also need
            day-one tech CAPEX (servers, privacy phones, computers) so the
            infrastructure is in the field before staff need it.
          </div>
        </div>

        <div
          className="rounded-[0.4vw] px-[1.4vw] pt-[0.9vw] pb-[0.6vw] mb-[1vh]"
          style={{ background: "var(--slide-paper)" }}
        >
          <div className="flex items-baseline justify-between mb-[0.5vh]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-accent font-semibold">
              Cumulative cash position · months 1–12
            </div>
            <div className="flex gap-[1.2vw] font-mono text-[0.78vw] text-muted">
              <div className="flex items-center gap-[0.4vw]">
                <span style={{ background: "#6b7665" }} className="inline-block w-[1.4vw] h-[2px]" />
                $60k · floor
              </div>
              <div className="flex items-center gap-[0.4vw]">
                <span style={{ background: "#b85a3e" }} className="inline-block w-[1.4vw] h-[3px]" />
                $90k · recommended
              </div>
              <div className="flex items-center gap-[0.4vw]">
                <span style={{ background: "#1f3d2e" }} className="inline-block w-[1.4vw] h-[2px]" />
                $125k · scale
              </div>
            </div>
          </div>

          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: "23vh", display: "block" }}
          >
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

            <rect
              x={padL}
              y={yFor(0)}
              width={innerW}
              height={yFor(yMin) - yFor(0)}
              fill="#b85a3e"
              opacity="0.05"
            />

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
                  <circle
                    cx={xFor(2)}
                    cy={yFor(s.cum[1])}
                    r={s.recommended ? 5 : 4}
                    fill={s.stroke}
                  />
                </g>
              );
            })}

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
              deepest dip · end of M2
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-[1.2vw] flex-1 min-h-0">
          {scenarios.map((s) => {
            const isReco = !!s.recommended;
            return (
              <div
                key={s.key}
                className="rounded-[0.4vw] p-[1.2vw] flex flex-col relative"
                style={
                  isReco
                    ? { background: "var(--slide-primary)", color: "var(--slide-bg)" }
                    : { background: "var(--slide-paper)" }
                }
              >
                {isReco && (
                  <div
                    className="absolute top-[-1.2vh] right-[1vw] font-mono uppercase tracking-[0.22em] text-[0.78vw] px-[0.7vw] py-[0.3vh] rounded-[0.2vw]"
                    style={{ background: "var(--slide-accent)", color: "var(--slide-bg)" }}
                  >
                    Recommended ask
                  </div>
                )}
                <div
                  className="font-mono uppercase tracking-[0.22em] text-[0.78vw] mb-[0.2vh]"
                  style={isReco ? { color: "#e9c8a8" } : { color: "var(--slide-muted)" }}
                >
                  Scenario {s.key} · {s.label}
                </div>
                <div className="flex items-baseline justify-between mt-[0.3vh] mb-[0.7vh]">
                  <div
                    className="font-mono uppercase tracking-[0.18em] text-[0.78vw]"
                    style={isReco ? { color: "#e9c8a8" } : { color: "var(--slide-muted)" }}
                  >
                    Bridge needed
                  </div>
                  <div
                    className="font-display text-[2.4vw] font-semibold leading-none"
                    style={isReco ? { color: "#e9c8a8" } : { color: "var(--slide-primary)" }}
                  >
                    ${(s.bridge / 1000).toFixed(0)}k
                  </div>
                </div>
                <div
                  className="space-y-[0.4vh] font-body text-[0.85vw] leading-[1.3] pt-[0.6vh] border-t flex-1"
                  style={
                    isReco
                      ? { borderColor: "rgba(244,237,224,0.3)", opacity: 0.95 }
                      : { borderColor: "var(--slide-rule)" }
                  }
                >
                  <div className="flex justify-between">
                    <span>Contract / mo (lands M3+)</span>
                    <span className="font-mono font-semibold">+${(s.contract / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost basis / mo</span>
                    <span className="font-mono font-semibold">−${(s.cost / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Day-one tech CAPEX</span>
                    <span className="font-mono font-semibold">
                      {s.capex > 0 ? `−$${(s.capex / 1000).toFixed(0)}k` : "—"}
                    </span>
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
                  className="mt-[0.7vh] pt-[0.6vh] border-t font-mono text-[0.75vw] leading-[1.35]"
                  style={
                    isReco
                      ? { borderColor: "rgba(244,237,224,0.3)", color: "#e9c8a8" }
                      : { borderColor: "var(--slide-rule)", color: "var(--slide-muted)" }
                  }
                >
                  {s.key === "A" &&
                    "No tech CAPEX — runs on existing kit. Bridge clears around M11."}
                  {s.key === "B" &&
                    "$42k buys the day-one slice — 3 servers, 3 privacy phones, 5 computers, networking. Remaining year-1 stack (the rest of the 9-server / 6-phone build) funded from monthly reinvestment. Bridge clears around M9."}
                  {s.key === "C" &&
                    "$60k buys the day-one slice — 6 servers, 6 phones, 8 computers, full rack. Remaining year-1 hardware funded from the (larger) monthly reinvestment. Bridge clears around M8."}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-[0.8vh] font-body text-[0.82vw] text-muted leading-[1.35]">
          Bridge needed = the M2 trough — two months of cost basis plus any
          day-one tech CAPEX, all spent before any net-60 invoice clears. Not
          lost — working capital tied up in receivables, recovered when the
          last two invoices clear.{" "}
          <span className="text-primary font-semibold">
            Recommended day-one ask: ~$175k of bridge capital
          </span>{" "}
          for the $90k scenario, so the team is paid and the infrastructure is
          shipped before the first cheque lands.
        </div>
      </div>
    </div>
  );
}
