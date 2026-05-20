import { useState } from "react";
import { format, startOfISOWeek, subWeeks } from "date-fns";
import { useStore, getWeekKey, getTodayKey } from "@/store";
import { ZONE_LABELS, cn } from "@/lib/utils";
import type { ZoneId } from "@/types";

const ZONES: ZoneId[] = ["Z1", "Z2", "Z3", "Z4"];

export function WeeklyPage() {
  const weeklyReviews = useStore((s) => s.weeklyReviews);
  const dailyPicks = useStore((s) => s.dailyPicks);
  const contracts = useStore((s) => s.contracts);
  const constellations = useStore((s) => s.constellations);
  const saveWeeklyReview = useStore((s) => s.saveWeeklyReview);

  const weekKey = getWeekKey();
  const existing = weeklyReviews.find((r) => r.weekKey === weekKey);

  const [shipped, setShipped] = useState(existing?.shipped ?? "");
  const [stalled, setStalled] = useState(existing?.stalled ?? "");
  const [nextIntention, setNextIntention] = useState(existing?.nextIntention ?? "");
  const [saved, setSaved] = useState(false);

  const weekStart = startOfISOWeek(new Date());
  const weekLabel = format(weekStart, "MMM d, yyyy");

  function getWeekHours() {
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      days.push(format(d, "yyyy-MM-dd"));
    }
    const totals: Record<ZoneId, number> = { Z1: 0, Z2: 0, Z3: 0, Z4: 0 };
    days.forEach((day) => {
      const pick = dailyPicks[day];
      if (pick?.hoursByZone) {
        ZONES.forEach((z) => {
          totals[z] += pick.hoursByZone?.[z] ?? 0;
        });
      }
    });
    return totals;
  }

  const weekHours = getWeekHours();
  const totalHours = ZONES.reduce((sum, z) => sum + weekHours[z], 0);

  function handleSave() {
    saveWeeklyReview({ weekKey, shipped, stalled, nextIntention });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-dvh bg-[#FAFAF9] pb-24">
      <div className="px-5 py-6 max-w-lg mx-auto space-y-5">
        <div>
          <p className="text-xs text-[#78716C] uppercase tracking-wider">Week of {weekLabel}</p>
          <h1 className="text-2xl mt-1">Weekly review</h1>
        </div>

        <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-3">
          <h2 className="text-base">Zone hours this week</h2>
          {totalHours === 0 ? (
            <p className="text-sm text-[#78716C]">No hours logged yet. Log hours on the Today screen at end of day.</p>
          ) : (
            <div className="space-y-2">
              {ZONES.map((z) => {
                const h = weekHours[z];
                const pct = totalHours > 0 ? (h / totalHours) * 100 : 0;
                return (
                  <div key={z} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#44403C]">{z} — {ZONE_LABELS[z].long}</span>
                      <span className="text-[#78716C]">{h}h</span>
                    </div>
                    <div className="h-2 bg-[#E7E5E4] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: z === "Z1" ? "#4F6E5C" : z === "Z2" ? "#3B5998" : z === "Z3" ? "#7C4E8A" : "#B45309",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              <p className="text-xs text-[#78716C] text-right">Total: {totalHours}h</p>
            </div>
          )}
        </div>

        {contracts.filter((c) => c.active).length > 0 && (
          <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-2">
            <h2 className="text-base">Contract report</h2>
            {contracts.filter((c) => c.active).map((ct) => {
              const constellation = constellations.find((co) => co.id === ct.constellationId);
              const logged = weekHours[constellation?.zone ?? "Z1"] ?? 0;
              const pct = Math.min(100, ct.weeklyHourTarget > 0 ? (logged / ct.weeklyHourTarget) * 100 : 100);
              return (
                <div key={ct.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#44403C]">{ct.name}</span>
                    <span className={cn("font-medium", pct >= 100 ? "text-[#4F6E5C]" : "text-[#B45309]")}>
                      {logged}h / {ct.weeklyHourTarget}h target
                    </span>
                  </div>
                  <div className="h-2 bg-[#E7E5E4] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? "#4F6E5C" : "#B45309" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium block">What shipped this week?</label>
          <textarea
            value={shipped}
            onChange={(e) => setShipped(e.target.value)}
            placeholder="What got materially further or completed?"
            rows={3}
            className="w-full border border-[#E7E5E4] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C1917] resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium block">What stalled?</label>
          <textarea
            value={stalled}
            onChange={(e) => setStalled(e.target.value)}
            placeholder="Where did you hit friction?"
            rows={3}
            className="w-full border border-[#E7E5E4] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C1917] resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium block">Intention for next week</label>
          <textarea
            value={nextIntention}
            onChange={(e) => setNextIntention(e.target.value)}
            placeholder="What's the one thing next week needs to move?"
            rows={2}
            className="w-full border border-[#E7E5E4] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C1917] resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-[#1C1917] text-white rounded-xl py-3 text-sm font-medium min-h-[44px]"
        >
          {saved ? "Saved ✓" : "Save review"}
        </button>

        {weeklyReviews.length > 1 && (
          <div className="space-y-2">
            <h2 className="text-base">Previous reviews</h2>
            {weeklyReviews.filter((r) => r.weekKey !== weekKey).slice(0, 4).map((r) => (
              <div key={r.weekKey} className="bg-white rounded-xl border border-[#E7E5E4] p-3">
                <p className="text-xs text-[#78716C] mb-1">{r.weekKey}</p>
                {r.shipped && <p className="text-sm text-[#44403C]">✓ {r.shipped.slice(0, 80)}{r.shipped.length > 80 ? "…" : ""}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
