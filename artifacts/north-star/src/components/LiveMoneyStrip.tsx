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
      className="inline-flex items-center gap-1 text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full"
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}40` }}
    >
      {children}
    </span>
  );
}

export function LiveMoneyStrip() {
  const saltCloses = useStore((s) => (s as any).saltCloses as Record<string, { revenue: number; expenses: number }> | undefined);

  const deerLakeDays = daysTo(DEER_LAKE_SOFT_DEADLINE);
  const deerLakeUrgent = deerLakeDays <= 7;
  const deerLakeColor = deerLakeDays <= 7 ? "#D96C3A" : deerLakeDays <= 21 ? "hsl(38 85% 52%)" : "#5E8F72";

  const latestClose = saltCloses
    ? Object.entries(saltCloses).sort(([a], [b]) => b.localeCompare(a))[0]
    : null;
  const latestRevenue = latestClose ? latestClose[1].revenue : 0;
  const drawProgress = latestRevenue > 0 ? Math.min(1, latestRevenue / PHASE2_BOBBIE_DRAW_MONTHLY) : 0;

  const now = new Date();
  const june15 = parseISO("2026-06-15");
  const july31 = parseISO("2026-07-31");
  let phase = "Pursuit";
  let phaseColor = "#D96C3A";
  if (now >= july31) { phase = "Operating"; phaseColor = "#5E8F72"; }
  else if (now >= june15) { phase = "Pivot"; phaseColor = "#5B8FD0"; }

  return (
    <Link href="/model">
      <div
        className="mx-4 mb-3 rounded-2xl p-4 space-y-3 cursor-pointer transition-all"
        style={{
          backgroundColor: "rgba(255,255,255,0.05)",
          border: deerLakeUrgent
            ? "1px solid rgba(217,108,58,0.45)"
            : "1px solid rgba(237,232,213,0.10)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Row 1: phase badge + Deer Lake countdown */}
        <div className="flex items-center justify-between gap-3">
          <Pill color={phaseColor}>{phase}</Pill>
          <div className="flex items-center gap-1.5">
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: deerLakeColor }}
            >
              {deerLakeDays > 0 ? `${deerLakeDays}d` : "Past"}
            </span>
            <span className="text-xs" style={{ color: "rgba(237,232,213,0.40)" }}>to June 15</span>
            {deerLakeUrgent && (
              <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: "#D96C3A" }}>
                urgent
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Phase 1 fee + draw target */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase mb-0.5" style={{ color: "rgba(237,232,213,0.40)" }}>
              Phase 1 fee
            </p>
            <p className="text-base font-bold tabular-nums" style={{ color: "hsl(38 85% 52%)" }}>
              {fmt(PHASE1_FEE)}
            </p>
            <p className="text-[10px]" style={{ color: "rgba(237,232,213,0.35)" }}>6–8 wk trial · Deer Lake</p>
          </div>
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase mb-0.5" style={{ color: "rgba(237,232,213,0.40)" }}>
              Draw target
            </p>
            <p className="text-base font-bold tabular-nums" style={{ color: "#5E8F72" }}>
              {fmt(PHASE2_BOBBIE_DRAW_MONTHLY)}<span className="text-xs font-normal" style={{ color: "rgba(237,232,213,0.35)" }}>/mo</span>
            </p>
            <p className="text-[10px]" style={{ color: "rgba(237,232,213,0.35)" }}>Phase 2 · when live</p>
          </div>
        </div>

        {/* Row 3: draw progress bar */}
        {latestRevenue > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]" style={{ color: "rgba(237,232,213,0.38)" }}>
              <span>Last month revenue toward draw</span>
              <span className="tabular-nums">{fmt(latestRevenue)} / {fmt(PHASE2_BOBBIE_DRAW_MONTHLY)}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(237,232,213,0.08)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${drawProgress * 100}%`, backgroundColor: "#5E8F72" }}
              />
            </div>
          </div>
        )}

        {latestRevenue === 0 && (
          <p className="text-[10px]" style={{ color: "rgba(237,232,213,0.25)" }}>
            File a Salt close in Cockpit → Money to see draw progress here
          </p>
        )}

        <p className="text-[10px] text-right" style={{ color: "rgba(237,232,213,0.25)" }}>
          Tap for full model →
        </p>
      </div>
    </Link>
  );
}
