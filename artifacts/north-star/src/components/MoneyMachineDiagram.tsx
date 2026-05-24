import { useState, useEffect, useRef, useCallback } from "react";

// ── Layout ────────────────────────────────────────────────────────────────────
const SVG_W = 400;
const SVG_H = 840;
const BW = 148;
const CX = 168;
const BX = CX - BW / 2; // ≈ 94

const B1Y = 62;
const B2Y = 258;
const B3Y = 452;
const B4Y = 646;

const BH1 = 110;
const BH2 = 110;
const BH3 = 105;
const BH4 = 112;

// ── Palette ───────────────────────────────────────────────────────────────────
const WALL      = "#2D4A3E";
const BKT_BG    = "#F4EFE6";
const EVERGREEN = "#1F3D2E";
const RUST      = "#8B3A1A";
const LBL_MED   = "#6B5744";
const LBL_LGT   = "#9B8B7A";
const WATER_MID = "#C4802A";

// ── Helpers ───────────────────────────────────────────────────────────────────
function WaterFill({
  x, y, w, h, level, clipId,
}: {
  x: number; y: number; w: number; h: number; level: number; clipId: string;
}) {
  const wh = Math.max(0, Math.min(h, (level / 100) * h));
  return (
    <rect
      x={x} y={y + h - wh}
      width={w} height={wh}
      fill="url(#mm-wg)"
      clipPath={`url(#${clipId})`}
    />
  );
}

function Pipe({
  x1, y1, x2, y2, flowing,
}: {
  x1: number; y1: number; x2: number; y2: number; flowing: boolean;
}) {
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={WALL} strokeWidth={6} strokeLinecap="round" />
      {flowing && (
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#mm-wg)" strokeWidth={4} strokeLinecap="round" />
      )}
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function MoneyMachineDiagram() {
  const [lvl, setLvl]     = useState({ b1: 0, b2: 0, b3: 0, b4: 0 });
  const [flow, setFlow]   = useState({ inlet: true, p12: false, p23: false, shower: false, well: false });
  const [bypassed, setBypassed] = useState(false);
  const [draining, setDraining] = useState(false);
  const [key, setKey]     = useState(0);

  const targRef = useRef({ b1: 0, b2: 0, b3: 0, b4: 0 });
  const curRef  = useRef({ b1: 0.0, b2: 0.0, b3: 0.0, b4: 0.0 });
  const rafRef  = useRef<number>(0);
  const timRef  = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    timRef.current.forEach(clearTimeout);
    timRef.current = [];
  }, []);

  useEffect(() => {
    clear();
    setLvl({ b1: 0, b2: 0, b3: 0, b4: 0 });
    setFlow({ inlet: true, p12: false, p23: false, shower: false, well: false });
    setBypassed(false);
    setDraining(false);
    targRef.current = { b1: 0, b2: 0, b3: 0, b4: 0 };
    curRef.current  = { b1: 0, b2: 0, b3: 0, b4: 0 };

    const tick = () => {
      const t = targRef.current;
      const c = curRef.current;
      let changed = false;
      for (const k of ["b1", "b2", "b3", "b4"] as const) {
        const diff = t[k] - c[k];
        if (Math.abs(diff) > 0.04) { c[k] += diff * 0.026; changed = true; }
        else c[k] = t[k];
      }
      if (changed) setLvl({ ...c });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const sched: [number, () => void][] = [
      [350,   () => { targRef.current.b1 = 97; }],
      [3300,  () => { setFlow(f => ({ ...f, inlet: false, p12: true })); }],
      [3600,  () => { targRef.current.b2 = 97; }],
      [6200,  () => { setFlow(f => ({ ...f, p23: true })); }],
      [6500,  () => { targRef.current.b3 = 97; }],
      [9100,  () => { setFlow(f => ({ ...f, shower: true })); }],
      [9400,  () => { targRef.current.b4 = 90; }],
      [12200, () => { setFlow(f => ({ ...f, well: true })); }],
    ];
    timRef.current = sched.map(([d, fn]) => setTimeout(fn, d));
    return clear;
  }, [key, clear]);

  const openBypass = () => {
    if (lvl.b2 < 5) return;
    setBypassed(true);
    setDraining(true);
    targRef.current.b2 = 0;
    setTimeout(() => setDraining(false), 2600);
  };

  // Float ball in Bucket 1
  const floatDrop = 76;
  const floatY    = B1Y + 10 + (1 - Math.min(lvl.b1, 97) / 97) * floatDrop;
  const floatTop  = lvl.b1 > 90;

  // Shower streams
  const STREAMS = 7;
  const sStep   = (BW - 28) / (STREAMS + 1);

  // Overflow label opacity
  const ovf12op = flow.p12 ? 1 : 0;
  const ovf23op = flow.p23 ? 1 : 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full max-w-[420px]"
        aria-label="Money Machine plumbing diagram — four buckets filling in order"
      >
        <defs>
          {/* Water gradient — amber top, dark amber bottom */}
          <linearGradient id="mm-wg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#E8A84C" />
            <stop offset="100%" stopColor="#B06818" />
          </linearGradient>

          {/* Bucket clip paths */}
          <clipPath id="mm-c1">
            <rect x={BX + 3} y={B1Y + 3} width={BW - 6} height={BH1 - 6} />
          </clipPath>
          <clipPath id="mm-c2">
            <rect x={BX + 3} y={B2Y + 3} width={BW - 6} height={BH2 - 6} />
          </clipPath>
          <clipPath id="mm-c3">
            <rect x={BX + 3} y={B3Y + 3} width={BW - 6} height={BH3 - 6} />
          </clipPath>
          <clipPath id="mm-c4">
            <rect x={BX - 12 + 3} y={B4Y + 3} width={BW + 24 - 6} height={BH4 - 6} />
          </clipPath>
        </defs>

        {/* ─── INLET PIPE ────────────────────────────────────────── */}
        <Pipe x1={CX} y1={0} x2={CX} y2={B1Y + 2} flowing={flow.inlet && !floatTop} />
        <text x={CX + 9} y={16} fontSize={10} fill={EVERGREEN} fontFamily="Inter,system-ui">↓ inlet</text>

        {/* ─── BUCKET 1 — Bills Bucket ───────────────────────────── */}
        <rect x={BX} y={B1Y} width={BW} height={BH1} rx={5} fill={BKT_BG} stroke={WALL} strokeWidth={3} />
        <WaterFill x={BX + 3} y={B1Y + 3} w={BW - 6} h={BH1 - 6} level={lvl.b1} clipId="mm-c1" />

        {/* Float arm + ball */}
        <line x1={CX} y1={B1Y + 4} x2={CX} y2={floatY - 8} stroke={WALL} strokeWidth={1.5} />
        <circle
          cx={CX} cy={floatY}
          r={9}
          fill={floatTop ? RUST : "#D49030"}
          stroke={WALL} strokeWidth={1.5}
        />
        {floatTop && (
          <text x={CX + 13} y={floatY + 4} fontSize={9} fill={RUST} fontFamily="Inter,system-ui">inlet closed</text>
        )}

        {/* Level % */}
        <text x={BX + 6} y={B1Y + BH1 - 6} fontSize={10} fill={EVERGREEN} fontWeight="700" fontFamily="Inter,system-ui">
          {Math.round(lvl.b1)}%
        </text>

        {/* Labels — right */}
        <text x={BX + BW + 10} y={B1Y + 20} fontSize={14} fontWeight="700" fill={EVERGREEN} fontFamily="'Fraunces',Georgia,serif">Bills Bucket</text>
        <text x={BX + BW + 10} y={B1Y + 36} fontSize={10} fill={LBL_MED} fontFamily="Inter,system-ui">Cost Basis</text>
        <text x={BX + BW + 10} y={B1Y + 52} fontSize={9} fill={LBL_LGT} fontFamily="Inter,system-ui" fontStyle="italic">pays what it costs to run</text>
        <text x={BX + BW + 10} y={B1Y + 65} fontSize={9} fill={LBL_LGT} fontFamily="Inter,system-ui" fontStyle="italic">float closes when full</text>

        {/* ─── PIPE 1 → 2 ────────────────────────────────────────── */}
        <Pipe x1={CX} y1={B1Y + BH1} x2={CX} y2={B2Y} flowing={flow.p12} />
        <text
          x={CX + 8} y={B1Y + BH1 + (B2Y - B1Y - BH1) / 2 + 4}
          fontSize={9} fill={LBL_LGT} fontFamily="Inter,system-ui" fontStyle="italic"
          opacity={ovf12op}
        >overflow ↓</text>

        {/* ─── BUCKET 2 — Oh No Bucket ───────────────────────────── */}
        <rect x={BX} y={B2Y} width={BW} height={BH2} rx={5} fill={BKT_BG} stroke={WALL} strokeWidth={3} />
        <WaterFill x={BX + 3} y={B2Y + 3} w={BW - 6} h={BH2 - 6} level={lvl.b2} clipId="mm-c2" />

        {/* Bypass pipe stub — left side */}
        <line x1={BX - 46} y1={B2Y + BH2 / 2} x2={BX} y2={B2Y + BH2 / 2} stroke={WALL} strokeWidth={5} strokeLinecap="round" />
        {draining && (
          <line x1={BX - 46} y1={B2Y + BH2 / 2} x2={BX} y2={B2Y + BH2 / 2} stroke="url(#mm-wg)" strokeWidth={3} strokeLinecap="round" />
        )}

        {/* Valve circle — clickable */}
        <circle
          cx={BX - 46} cy={B2Y + BH2 / 2} r={15}
          fill={bypassed ? "#FEF2F2" : "#F0FDF4"}
          stroke={bypassed ? RUST : "#16A34A"}
          strokeWidth={2.5}
          style={{ cursor: lvl.b2 > 5 ? "pointer" : "default" }}
          onClick={openBypass}
        />
        <text
          x={BX - 46} y={B2Y + BH2 / 2 + 5}
          textAnchor="middle" fontSize={15}
          fill={bypassed ? RUST : "#16A34A"}
          fontFamily="Inter,system-ui"
          style={{ cursor: lvl.b2 > 5 ? "pointer" : "default", userSelect: "none" }}
          onClick={openBypass}
        >{bypassed ? "✕" : "⊙"}</text>

        {/* Bypass label */}
        <text x={BX - 46} y={B2Y + BH2 / 2 - 24} textAnchor="middle" fontSize={8} fill={LBL_LGT} fontFamily="Inter,system-ui">bypass</text>
        <text x={BX - 46} y={B2Y + BH2 / 2 - 14} textAnchor="middle" fontSize={8} fill={LBL_LGT} fontFamily="Inter,system-ui">valve</text>
        {bypassed && (
          <text x={BX - 46} y={B2Y + BH2 / 2 + 26} textAnchor="middle" fontSize={8} fill={RUST} fontWeight="700" fontFamily="Inter,system-ui">OPEN</text>
        )}

        {/* Level % */}
        <text x={BX + 6} y={B2Y + BH2 - 6} fontSize={10} fill={EVERGREEN} fontWeight="700" fontFamily="Inter,system-ui">
          {Math.round(lvl.b2)}%
        </text>

        {/* Labels — right */}
        <text x={BX + BW + 10} y={B2Y + 20} fontSize={14} fontWeight="700" fill={EVERGREEN} fontFamily="'Fraunces',Georgia,serif">Oh No Bucket</text>
        <text x={BX + BW + 10} y={B2Y + 36} fontSize={10} fill={LBL_MED} fontFamily="Inter,system-ui">Reserve</text>
        <text x={BX + BW + 10} y={B2Y + 52} fontSize={9} fill={LBL_LGT} fontFamily="Inter,system-ui" fontStyle="italic">don't open until</text>
        <text x={BX + BW + 10} y={B2Y + 65} fontSize={9} fill={LBL_LGT} fontFamily="Inter,system-ui" fontStyle="italic">something actually breaks</text>

        {/* ─── PIPE 2 → 3 ────────────────────────────────────────── */}
        <Pipe x1={CX} y1={B2Y + BH2} x2={CX} y2={B3Y} flowing={flow.p23} />
        <text
          x={CX + 8} y={B2Y + BH2 + (B3Y - B2Y - BH2) / 2 + 4}
          fontSize={9} fill={LBL_LGT} fontFamily="Inter,system-ui" fontStyle="italic"
          opacity={ovf23op}
        >overflow ↓</text>

        {/* ─── BUCKET 3 — Rain Shower Bucket ─────────────────────── */}
        <rect x={BX} y={B3Y} width={BW} height={BH3} rx={5} fill={BKT_BG} stroke={WALL} strokeWidth={3} />
        <WaterFill x={BX + 3} y={B3Y + 3} w={BW - 6} h={BH3 - 6} level={lvl.b3} clipId="mm-c3" />

        {/* Shower head bar */}
        <rect x={BX + 10} y={B3Y + BH3 - 3} width={BW - 20} height={9} rx={4.5} fill={WALL} />
        {/* Shower holes */}
        {Array.from({ length: STREAMS }, (_, i) => (
          <circle
            key={i}
            cx={BX + 14 + sStep * (i + 1)}
            cy={B3Y + BH3 + 1}
            r={2.5}
            fill={flow.shower ? WATER_MID : BKT_BG}
          />
        ))}

        {/* Level % */}
        <text x={BX + 6} y={B3Y + BH3 - 18} fontSize={10} fill={EVERGREEN} fontWeight="700" fontFamily="Inter,system-ui">
          {Math.round(lvl.b3)}%
        </text>

        {/* Labels — right */}
        <text x={BX + BW + 10} y={B3Y + 20} fontSize={14} fontWeight="700" fill={EVERGREEN} fontFamily="'Fraunces',Georgia,serif">Rain Shower</text>
        <text x={BX + BW + 10} y={B3Y + 36} fontSize={10} fill={LBL_MED} fontFamily="Inter,system-ui">Reinvestment</text>
        <text x={BX + BW + 10} y={B3Y + 52} fontSize={9} fill={LBL_LGT} fontFamily="Inter,system-ui" fontStyle="italic">builds what's next —</text>
        <text x={BX + BW + 10} y={B3Y + 65} fontSize={9} fill={LBL_LGT} fontFamily="Inter,system-ui" fontStyle="italic">every drop spreads out</text>

        {/* ─── SHOWER STREAMS ─────────────────────────────────────── */}
        {flow.shower && Array.from({ length: STREAMS }, (_, i) => {
          const sx = BX + 14 + sStep * (i + 1);
          const wobble = (i % 2 === 0 ? -3 : 3);
          return (
            <line
              key={i}
              x1={sx} y1={B3Y + BH3 + 6}
              x2={sx + wobble} y2={B4Y - 2}
              stroke="url(#mm-wg)"
              strokeWidth={2}
              strokeDasharray="6 5"
              opacity={0.82}
            />
          );
        })}

        {/* ─── BUCKET 4 — Giving Well ─────────────────────────────── */}
        {/* Well walls — wider + rounded */}
        <rect x={BX - 14} y={B4Y} width={BW + 28} height={BH4} rx={20} fill={BKT_BG} stroke={WALL} strokeWidth={3} />
        {/* Stone-ring hint */}
        <rect x={BX - 7} y={B4Y + 7} width={BW + 14} height={BH4 - 14} rx={14} fill="none" stroke="#C5B8A5" strokeWidth={1} strokeDasharray="5 5" />

        <WaterFill x={BX - 10} y={B4Y + 3} w={BW + 20} h={BH4 - 6} level={lvl.b4} clipId="mm-c4" />

        {/* Overflow ripples when well is full */}
        {flow.well && (
          <>
            <ellipse cx={CX} cy={B4Y + 5} rx={32} ry={5} fill="none" stroke="url(#mm-wg)" strokeWidth={2} opacity={0.85} />
            <ellipse cx={CX} cy={B4Y + 5} rx={55} ry={8} fill="none" stroke="url(#mm-wg)" strokeWidth={1.5} opacity={0.55} />
            <ellipse cx={CX} cy={B4Y + 5} rx={80} ry={11} fill="none" stroke="url(#mm-wg)" strokeWidth={1} opacity={0.3} />
            {/* Outflow markers */}
            <text x={CX - 88} y={B4Y + BH4 / 2 + 5} textAnchor="middle" fontSize={18} fill={EVERGREEN} opacity={0.7}>←</text>
            <text x={CX - 88} y={B4Y + BH4 / 2 + 20} textAnchor="middle" fontSize={9} fill={LBL_MED} fontFamily="Inter,system-ui">community</text>
            <text x={CX + 88} y={B4Y + BH4 / 2 + 5} textAnchor="middle" fontSize={18} fill={EVERGREEN} opacity={0.7}>→</text>
            <text x={CX + 88} y={B4Y + BH4 / 2 + 20} textAnchor="middle" fontSize={9} fill={LBL_MED} fontFamily="Inter,system-ui">allies</text>
          </>
        )}

        {/* Level % */}
        <text x={BX - 8} y={B4Y + BH4 - 8} fontSize={10} fill={EVERGREEN} fontWeight="700" fontFamily="Inter,system-ui">
          {Math.round(lvl.b4)}%
        </text>

        {/* Labels — right */}
        <text x={BX + BW + 10} y={B4Y + 20} fontSize={14} fontWeight="700" fill={EVERGREEN} fontFamily="'Fraunces',Georgia,serif">Giving Well</text>
        <text x={BX + BW + 10} y={B4Y + 36} fontSize={10} fill={LBL_MED} fontFamily="Inter,system-ui">Eave Flow</text>
        <text x={BX + BW + 10} y={B4Y + 52} fontSize={9} fill={LBL_LGT} fontFamily="Inter,system-ui" fontStyle="italic">overflows only when the</text>
        <text x={BX + BW + 10} y={B4Y + 65} fontSize={9} fill={LBL_LGT} fontFamily="Inter,system-ui" fontStyle="italic">other three are full</text>

        {/* ─── BOTTOM RULE ────────────────────────────────────────── */}
        <text
          x={CX} y={SVG_H - 22}
          textAnchor="middle" fontSize={11}
          fill={LBL_MED} fontFamily="'Fraunces',Georgia,serif" fontStyle="italic"
        >
          Stop the leak. Fill the buckets. Let the overflow reach the next watershed.
        </text>
      </svg>

      {/* ─── Controls ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 justify-center pb-2">
        <button
          onClick={() => setKey(k => k + 1)}
          className="px-5 py-2 text-sm font-medium rounded-lg border-2 border-[#1F3D2E] text-[#1F3D2E] bg-white hover:bg-[#1F3D2E] hover:text-white transition-colors"
        >
          ↺ Replay
        </button>

        {lvl.b2 > 10 && !bypassed && (
          <button
            onClick={openBypass}
            className="px-5 py-2 text-sm font-medium rounded-lg border-2 border-[#8B3A1A] text-[#8B3A1A] bg-white hover:bg-[#8B3A1A] hover:text-white transition-colors"
          >
            Open bypass valve →
          </button>
        )}

        {bypassed && (
          <span className="px-4 py-2 text-sm italic text-[#8B3A1A] border-2 border-[#8B3A1A] rounded-lg bg-[#FEF2F2]">
            Reserve drained — fill before you can give
          </span>
        )}
      </div>
    </div>
  );
}
