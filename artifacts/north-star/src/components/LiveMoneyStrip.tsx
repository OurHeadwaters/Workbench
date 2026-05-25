// ── LiveMoneyStrip — the missing piece ───────────────────────────────────────
// Shows: Deer Lake runway countdown, Phase indicator, draw progress bar.
// Z2/Z3 business layer only — no Z1 household data.

import { differenceInCalendarDays, parseISO } from "date-fns";
import {
  DEER_LAKE_SOFT_DEADLINE,
  PHASE1_FEE,
  PHASE2_BOBBIE_DRAW_MONTHLY,
} from "@/data/northStarNumbers";
import { useStore } from "@/store";
import { Link } from "wouter";

function daysTo(isoDate: string): number {
  return differenceInCalendarDays(parseISO(isoDate), new Date());
}

function fmt(n: number) {
  return "$" + n.toLocaleString("en-CA", { maximumFractionDigits: 0 });
}

function Pill({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {children}
    </span>
  );
}

export function LiveMoneyStrip() {
  const saltCloses = useStore((s) => (s as any).saltCloses as Record<string, { revenue: number; expenses: number }> | undefined);

  const deerLakeDays = daysTo(DEER_LAKE_SOFT_DEADLINE);
  const deerLakeUrgent = deerLakeDays <= 7;
  const deerLakeColor = deerLakeDays <= 7 ? "#b85a3e" : deerLakeDays <= 21 ? "#C8923A" : "#1F3D2E";

  // Pull most recent monthly revenue from salt closes if present
  const latestClose = saltCloses
    ? Object.entries(saltCloses).sort(([a], [b]) => b.localeCompare(a))[0]
    : null;
  const latestRevenue = latestClose ? latestClose[1].revenue : 0;
  const drawProgress = latestRevenue > 0 ? Math.min(1, latestRevenue / PHASE2_BOBBIE_DRAW_MONTHLY) : 0;

  // Phase derived from date
  const now = new Date();
  const june15 = parseISO("2026-06-15");
  const july31 = parseISO("2026-07-31");
  let phase = "Pursuit";
  let phaseColor = "#b85a3e";
  if (now >= july31) { phase = "Operating"; phaseColor = "#1F3D2E"; }
  else if (now >= june15) { phase = "Pivot"; phaseColor = "#1A5FA8"; }

  return (
    <Link href="/model">
      <div
        className="mx-4 mb-3 rounded-2xl border p-4 space-y-3 cursor-pointer hover:shadow-sm transition-shadow"
        style={{
          backgroundColor: "#fff",
          borderColor: deerLakeUrgent ? "#C8923A50" : "#E7E5E4",
        }}
      >
        {/* Row 1: phase badge + Deer Lake countdown */}
        <div className="flex items-center justify-between gap-3">
          <Pill color={phaseColor}>{phase}</Pill>
          <div className="flex items-center gap-1.5">
            <span
              className="text-xs font-semibold tabular-nums"
              style={{ color: deerLakeColor }}
            >
              {deerLakeDays > 0 ? `${deerLakeDays}d` : "Past"}
            </span>
            <span className="text-xs text-[#78716C]">to June 15</span>
            {deerLakeUrgent && (
              <span className="text-[10px] font-black tracking-widest uppercase text-[#b85a3e]">
                urgent
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Phase 1 fee + draw target */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C] mb-0.5">
              Phase 1 fee
            </p>
            <p className="text-base font-bold text-[#1C1917] tabular-nums">
              {fmt(PHASE1_FEE)}
            </p>
            <p className="text-[10px] text-[#78716C]">6–8 wk trial · Deer Lake</p>
          </div>
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C] mb-0.5">
              Draw target
            </p>
            <p className="text-base font-bold text-[#1C1917] tabular-nums">
              {fmt(PHASE2_BOBBIE_DRAW_MONTHLY)}<span className="text-xs font-normal text-[#78716C]">/mo</span>
            </p>
            <p className="text-[10px] text-[#78716C]">Phase 2 · when live</p>
          </div>
        </div>

        {/* Row 3: draw progress bar (from salt closes) */}
        {latestRevenue > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-[#78716C]">
              <span>Last month revenue toward draw</span>
              <span className="tabular-nums">{fmt(latestRevenue)} / {fmt(PHASE2_BOBBIE_DRAW_MONTHLY)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#F5F0E8] overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${drawProgress * 100}%`, backgroundColor: "#1F3D2E" }}
              />
            </div>
          </div>
        )}

        {latestRevenue === 0 && (
          <p className="text-[10px] text-[#B5AFA9]">
            File a Salt close in Cockpit → Money to see draw progress here
          </p>
        )}

        <p className="text-[10px] text-[#B5AFA9] text-right">Tap for full model →</p>
      </div>
    </Link>
  );
}
