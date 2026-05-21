import { useState, useEffect } from "react";
import { format, parseISO, differenceInDays, startOfISOWeek, getDay } from "date-fns";
import { Mic, AlertTriangle, Archive, ExternalLink, Star, Feather } from "lucide-react";
import { useStore, getTodayKey, getWeekKey, getSeasonKey } from "@/store";
import { MorningTriage } from "@/components/MorningTriage";
import { CaptureSheet } from "@/components/CaptureSheet";
import { ZoneBadge } from "@/components/ZoneBadge";
import { OdysseyTrail } from "@/components/TrailSign";
import { cn } from "@/lib/utils";
import { ZONE_CLASSES } from "@/lib/utils";
import type { ZoneId, Constellation } from "@/types";
import { fetchTrailSigns, getTrailSigns } from "@workspace/odyssey";
import { Link, useLocation } from "wouter";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const ZONE_SOLID: Record<ZoneId, string> = {
  Z0: "#8A6A1A",
  Z1: "#4F6E5C",
  Z2: "#3B5998",
  Z3: "#7C4E8A",
  Z4: "#B45309",
  Z5: "#4A6272",
};

const ZONE_GLOW: Record<ZoneId, string> = {
  Z0: "rgba(138,106,26,0.18)",
  Z1: "rgba(79,110,92,0.18)",
  Z2: "rgba(59,89,152,0.18)",
  Z3: "rgba(124,78,138,0.18)",
  Z4: "rgba(180,83,9,0.18)",
  Z5: "rgba(74,98,114,0.18)",
};

function BackupNudge() {
  const lastBackedUpAt = useStore((s) => s.lastBackedUpAt);
  const dismissedNudges = useStore((s) => s.dismissedNudges);
  const dismissNudge = useStore((s) => s.dismissNudge);

  const todayKey = getTodayKey();
  const nudgeKey = `backup-${todayKey}`;
  if (dismissedNudges[nudgeKey]) return null;

  const daysSince = lastBackedUpAt ? differenceInDays(new Date(), parseISO(lastBackedUpAt)) : 999;
  if (daysSince < 7) return null;

  return (
    <div className="rounded-xl border border-[#C8923A]/40 bg-[#FEF9EE] px-4 py-3 flex items-start justify-between gap-3">
      <div className="flex items-start gap-2.5">
        <div className="w-5 h-5 rounded-full bg-[#B45309]/10 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle size={11} className="text-[#B45309]" />
        </div>
        <p className="text-sm text-[#78400A]">
          Back up in Settings — North Star lives only on this device.
          {lastBackedUpAt ? ` Last backup: ${daysSince}d ago.` : " No backup yet."}
        </p>
      </div>
      <button
        onClick={() => dismissNudge(nudgeKey)}
        className="text-xs text-[#B45309]/70 underline shrink-0 min-h-[44px] flex items-center hover:text-[#B45309] transition-colors"
      >
        Dismiss
      </button>
    </div>
  );
}

function ReviewNudges() {
  const weeklyReviews = useStore((s) => s.weeklyReviews);
  const seasonalReviews = useStore((s) => s.seasonalReviews);
  const dismissedNudges = useStore((s) => s.dismissedNudges);
  const dismissNudge = useStore((s) => s.dismissNudge);

  const todayKey = getTodayKey();
  const weekKey = getWeekKey();
  const seasonKey = getSeasonKey();
  const day = getDay(new Date());
  const isSunOrMon = day === 0 || day === 1;

  const weeklyNudgeKey = `weekly-${todayKey}`;
  const seasonalNudgeKey = `seasonal-${todayKey}`;

  const hasWeeklyReview = weeklyReviews.some((r) => r.weekKey === weekKey);
  const hasSeasonalReview = seasonalReviews.some((r) => r.seasonKey === seasonKey);

  return (
    <>
      {isSunOrMon && !hasWeeklyReview && !dismissedNudges[weeklyNudgeKey] && (
        <div className="rounded-xl border border-[#D6D0C7] bg-[#F5F0E8] px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">📋</span>
            <p className="text-sm text-[#44403C]">Weekly review ready — how did the week go?</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/weekly" className="text-xs text-[#1C1917] font-medium underline min-h-[44px] flex items-center">Review</Link>
            <button onClick={() => dismissNudge(weeklyNudgeKey)} className="text-xs text-[#78716C] min-h-[44px] flex items-center">Later</button>
          </div>
        </div>
      )}
      {!hasSeasonalReview && !dismissedNudges[seasonalNudgeKey] && (
        <div className="rounded-xl border border-[#D6D0C7] bg-[#F5F0E8] px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🌿</span>
            <p className="text-sm text-[#44403C]">No seasonal review yet for {seasonKey.replace("-", " ")}.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/seasonal" className="text-xs text-[#1C1917] font-medium underline min-h-[44px] flex items-center">Review</Link>
            <button onClick={() => dismissNudge(seasonalNudgeKey)} className="text-xs text-[#78716C] min-h-[44px] flex items-center">Later</button>
          </div>
        </div>
      )}
    </>
  );
}

function ConstellationPicker() {
  const [, navigate] = useLocation();
  const constellations = useStore((s) => s.constellations);
  const contracts = useStore((s) => s.contracts);
  const getTodayPick = useStore((s) => s.getTodayPick);
  const setTodayPick = useStore((s) => s.setTodayPick);
  const dismissedNudges = useStore((s) => s.dismissedNudges);
  const dismissNudge = useStore((s) => s.dismissNudge);

  const todayPick = getTodayPick();
  const pickedIds = todayPick.constellationIds;
  const todayKey = getTodayKey();

  const [guardrailPrompt, setGuardrailPrompt] = useState<string | null>(null);
  const [parkPrompt, setParkPrompt] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const dailyPicks = useStore((s) => s.dailyPicks);
  const active = constellations.filter((c) => c.active);
  const capBypassKey = `cap-bypass-${todayKey}`;

  function getWeekHoursLogged(constellationId: string): number {
    const constellation = constellations.find((c) => c.id === constellationId);
    if (!constellation) return 0;
    const zone = constellation.zone;
    const weekStart = startOfISOWeek(new Date());
    let total = 0;
    for (const [dateKey, pick] of Object.entries(dailyPicks)) {
      const d = parseISO(dateKey);
      if (d >= weekStart && pick.hoursByZone) {
        total += pick.hoursByZone[zone] ?? 0;
      }
    }
    return total;
  }

  function getContractGuardrail(constellation: Constellation): string | null {
    if (constellation.zone !== "Z3" && constellation.zone !== "Z4") return null;
    const z2ConstellationContracts = contracts.filter(
      (c) => c.active && constellations.find((co) => co.id === c.constellationId)?.zone === "Z2"
    );
    for (const contract of z2ConstellationContracts) {
      const logged = getWeekHoursLogged(contract.constellationId);
      const remaining = contract.weeklyHourTarget - logged;
      if (remaining > 0.25) {
        return `${remaining.toFixed(1)}h left on "${contract.name}" this week. Still spend today on ${constellation.name}?`;
      }
    }
    return null;
  }

  function handleToggle(c: Constellation) {
    const already = pickedIds.includes(c.id);
    if (already) {
      setTodayPick({ constellationIds: pickedIds.filter((id) => id !== c.id) });
      return;
    }

    if (pickedIds.length >= 3) {
      if (!dismissedNudges[capBypassKey]) {
        setPendingId(c.id);
        setParkPrompt(c.id);
        return;
      }
    }

    const guardrail = getContractGuardrail(c);
    const acknowledgedKey = `guardrail-${todayKey}-${c.id}`;
    if (guardrail && !todayPick.acknowledgedGuardrails?.includes(acknowledgedKey)) {
      setPendingId(c.id);
      setGuardrailPrompt(guardrail);
      return;
    }

    setTodayPick({ constellationIds: [...pickedIds, c.id] });
  }

  function handlePark(parkId: string) {
    const remaining = pickedIds.filter((id) => id !== parkId);
    const newIds = [...remaining, pendingId!];
    setTodayPick({ constellationIds: newIds });
    setParkPrompt(null);
    setPendingId(null);
  }

  function handleBypassCap() {
    dismissNudge(capBypassKey);
    setParkPrompt(null);
    if (pendingId) {
      setTodayPick({ constellationIds: [...pickedIds, pendingId] });
    }
    setPendingId(null);
  }

  function handleGuardrailAck() {
    const acknowledgedKey = `guardrail-${todayKey}-${pendingId}`;
    setTodayPick({
      constellationIds: [...pickedIds, pendingId!],
      acknowledgedGuardrails: [...(todayPick.acknowledgedGuardrails ?? []), acknowledgedKey],
    });
    setGuardrailPrompt(null);
    setPendingId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl">Today's constellations</h2>
        <span className="text-sm text-[#78716C] tabular-nums">{pickedIds.length} / 3</span>
      </div>

      {guardrailPrompt && (
        <div className="rounded-xl border border-[#C8923A]/50 bg-[#FEF9EE] p-4 space-y-3 shadow-sm">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-[#B45309]/10 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle size={11} className="text-[#B45309]" />
            </div>
            <p className="text-sm text-[#78400A]">{guardrailPrompt}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setGuardrailPrompt(null); setPendingId(null); navigate("/zones"); }}
              className="flex-1 border border-[#C8923A]/50 rounded-lg py-2 text-sm text-[#B45309] min-h-[44px] hover:bg-[#FEF3C7] transition-colors"
            >
              Go to Zones
            </button>
            <button
              onClick={handleGuardrailAck}
              className="flex-1 bg-[#1C1917] text-white rounded-lg py-2 text-sm min-h-[44px] hover:bg-[#2C2420] transition-colors"
            >
              Still pick it
            </button>
          </div>
        </div>
      )}

      {parkPrompt && !guardrailPrompt && (
        <div className="rounded-xl border border-[#D6D0C7] bg-[#F5F0E8] p-4 space-y-2 shadow-sm">
          <p className="text-sm font-medium">Park one to make room?</p>
          <p className="text-xs text-[#78716C]">You already have 3. Which one steps out today?</p>
          <div className="space-y-1.5">
            {pickedIds.map((id) => {
              const c = constellations.find((co) => co.id === id);
              if (!c) return null;
              return (
                <button
                  key={id}
                  onClick={() => handlePark(id)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white text-sm min-h-[44px] border border-[#E7E5E4] bg-white/60 transition-colors"
                >
                  Park {c.name}
                </button>
              );
            })}
          </div>
          <button onClick={handleBypassCap} className="text-xs text-[#78716C] underline min-h-[44px] flex items-center">
            Don't ask again today
          </button>
        </div>
      )}

      <div className="space-y-2.5">
        {active.map((c, i) => {
          const picked = pickedIds.includes(c.id);
          const zoneColor = ZONE_SOLID[c.zone] ?? "#1C1917";
          const zoneGlow = ZONE_GLOW[c.zone] ?? "transparent";
          return (
            <div
              key={c.id}
              className={cn(
                "constellation-card rounded-xl border bg-white transition-all duration-200",
                picked
                  ? "border-transparent shadow-md"
                  : "border-[#E7E5E4] hover:border-[#D6D0C7] hover:shadow-sm"
              )}
              style={{
                animationDelay: `${i * 40}ms`,
                ...(picked ? {
                  borderColor: zoneColor,
                  boxShadow: `0 2px 12px ${zoneGlow}, 0 0 0 1.5px ${zoneColor}`,
                } : {}),
              }}
            >
              <button
                onClick={() => handleToggle(c)}
                className="w-full flex items-center gap-3 px-4 py-4 min-h-[64px] text-left"
              >
                <div
                  className="w-4 w-full flex-shrink-0 self-stretch rounded-full mr-1 transition-colors duration-200"
                  style={{
                    width: 3,
                    minWidth: 3,
                    maxWidth: 3,
                    borderRadius: 99,
                    backgroundColor: picked ? zoneColor : "#E7E5E4",
                  }}
                />
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200",
                    picked ? "scale-110" : ""
                  )}
                  style={{
                    backgroundColor: picked ? zoneColor : "transparent",
                    borderColor: picked ? zoneColor : "#D6D0C7",
                  }}
                >
                  {picked && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium transition-colors", picked ? "text-[#1C1917]" : "text-[#44403C]")}>{c.name}</p>
                  {c.notes && <p className="text-xs text-[#78716C] mt-0.5">{c.notes}</p>}
                  <ZoneBadge zone={c.zone} className="mt-1.5" />
                </div>
              </button>

              {picked && c.deepLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 px-4 pb-3.5">
                  {c.deepLinks.map((dl, i) => (
                    <a
                      key={i}
                      href={dl.path}
                      className="flex items-center gap-1 text-xs rounded-lg px-3 py-1.5 min-h-[36px] transition-colors"
                      style={{
                        backgroundColor: ZONE_CLASSES[c.zone]?.bg ? undefined : "#F5F0E8",
                        color: zoneColor,
                        border: `1px solid ${zoneColor}22`,
                        background: `${zoneColor}0F`,
                      }}
                    >
                      {dl.label} <ExternalLink size={10} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NorthStarStatement() {
  const statement = useStore((s) => s.statement);
  if (!statement) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #F5F0E8 0%, #EDE8DC 100%)",
          border: "1px solid #D6D0C7",
        }}
      />
      <div className="relative px-5 py-5 space-y-3">
        <div className="flex items-center gap-2">
          <Star size={13} className="text-[#8A6A1A]" fill="#8A6A1A" />
          <p className="text-xs text-[#8A6A1A] uppercase tracking-widest font-medium">North Star</p>
        </div>
        {statement.who && (
          <p className="text-base text-[#1C1917] leading-relaxed">
            <span className="text-[#78716C] text-sm">For </span>
            <span className="font-medium">{statement.who}</span>
          </p>
        )}
        {statement.why && (
          <p className="text-base text-[#1C1917] leading-relaxed">
            <span className="text-[#78716C] text-sm">So that </span>
            {statement.why}
          </p>
        )}
        {statement.noFly && (
          <p className="text-sm text-[#78716C] italic border-t border-[#D6D0C7] pt-3">
            No-fly: {statement.noFly}
          </p>
        )}
      </div>
    </div>
  );
}

function IntentionAndHours() {
  const getTodayPick = useStore((s) => s.getTodayPick);
  const setTodayPick = useStore((s) => s.setTodayPick);
  const todayPick = getTodayPick();
  const [reflection, setReflection] = useState(todayPick.reflection ?? "");
  const [hours, setHours] = useState<Partial<Record<ZoneId, string>>>({
    Z1: todayPick.hoursByZone?.Z1?.toString() ?? "",
    Z2: todayPick.hoursByZone?.Z2?.toString() ?? "",
    Z3: todayPick.hoursByZone?.Z3?.toString() ?? "",
    Z4: todayPick.hoursByZone?.Z4?.toString() ?? "",
  });

  const ZONES: ZoneId[] = ["Z1", "Z2", "Z3", "Z4"];
  const ZONE_SHORT: Record<ZoneId, string> = {
    Z0: "Z0 — Center",
    Z1: "Z1 — Afloat",
    Z2: "Z2 — Contract",
    Z3: "Z3 — Build",
    Z4: "Z4 — Passion",
    Z5: "Z5 — Wild",
  };

  function saveReflection() {
    setTodayPick({ reflection });
  }

  function saveHours() {
    const hoursByZone = Object.fromEntries(
      ZONES.map((z) => [z, parseFloat(hours[z] ?? "") || 0])
    ) as Record<ZoneId, number>;
    setTodayPick({ hoursByZone });
  }

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Feather size={13} className="text-[#78716C]" />
          <label className="text-sm font-medium">Today, the win is…</label>
        </div>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          onBlur={saveReflection}
          placeholder="One thing that would make today feel complete"
          rows={3}
          className="w-full border border-[#E7E5E4] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30 focus:border-[#8A6A1A]/50 resize-none placeholder:text-[#B5AFA9] leading-relaxed transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium block">Hours by zone (end of day)</label>
        <div className="grid grid-cols-2 gap-2">
          {ZONES.map((z) => {
            const zoneColor = ZONE_SOLID[z] ?? "#78716C";
            return (
              <div key={z} className="flex items-center gap-2 bg-white border border-[#E7E5E4] rounded-xl px-3 py-2.5 hover:border-[#D6D0C7] transition-colors">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: zoneColor }}
                />
                <span className="text-xs text-[#78716C] flex-1">{ZONE_SHORT[z]}</span>
                <input
                  type="number"
                  min="0"
                  step="0.25"
                  value={hours[z]}
                  onChange={(e) => setHours((prev) => ({ ...prev, [z]: e.target.value }))}
                  onBlur={saveHours}
                  className="w-12 text-sm text-right border-0 focus:outline-none bg-transparent tabular-nums"
                  placeholder="0"
                />
                <span className="text-xs text-[#B5AFA9]">h</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

const BASE_API = import.meta.env.VITE_API_URL ?? "/api";

function OdysseySection() {
  const getTodayPick = useStore((s) => s.getTodayPick);
  const constellations = useStore((s) => s.constellations);
  const dismissedNudges = useStore((s) => s.dismissedNudges);
  const dismissNudge = useStore((s) => s.dismissNudge);
  const todayKey = getTodayKey();

  const todayPick = getTodayPick();
  const pickedIds = todayPick.constellationIds;

  const activeZone: ZoneId = (() => {
    if (pickedIds.length === 0) return "Z1";
    const picked = constellations.filter((c) => pickedIds.includes(c.id));
    const counts: Partial<Record<ZoneId, number>> = {};
    for (const c of picked) counts[c.zone] = (counts[c.zone] ?? 0) + 1;
    return (Object.entries(counts).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] ?? "Z1") as ZoneId;
  })();

  const [signs, setSigns] = useState(() => getTrailSigns(activeZone));

  useEffect(() => {
    let cancelled = false;
    fetchTrailSigns(BASE_API, activeZone).then((live) => {
      if (!cancelled) setSigns(live);
    });
    return () => { cancelled = true; };
  }, [activeZone]);

  const odysseyDismissKey = `odyssey-trail-${todayKey}`;
  if (dismissedNudges[odysseyDismissKey] || signs.length === 0) return null;

  return (
    <OdysseyTrail
      signs={signs}
      onAllDismissed={() => dismissNudge(odysseyDismissKey)}
    />
  );
}

export function TodayPage() {
  const captures = useStore((s) => s.captures);
  const [showCapture, setShowCapture] = useState(false);

  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <div className="min-h-dvh pb-24" style={{ background: "linear-gradient(180deg, #FAFAF9 0%, #F5F0E8 100%)" }}>
      <div className="px-5 py-7 max-w-lg mx-auto space-y-6">

        <div className="space-y-1">
          <p className="text-xs text-[#78716C] uppercase tracking-widest">{today}</p>
          <div className="flex items-center justify-between mt-1">
            <h1 className="text-2xl text-[#1C1917]">What does today get?</h1>
            <button
              onClick={() => setShowCapture(true)}
              className="flex items-center gap-1.5 bg-[#1C1917] text-white rounded-xl px-3 py-2 text-xs min-h-[44px] hover:bg-[#2C2420] transition-colors shadow-sm"
            >
              <Mic size={14} /> Capture
            </button>
          </div>
        </div>

        <MorningTriage />

        {captures.slice(0, 3).length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs text-[#78716C] uppercase tracking-widest">Recent captures</p>
            {captures.slice(0, 3).map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-[#E7E5E4] px-4 py-3 text-sm text-[#44403C] leading-relaxed shadow-sm">
                {c.text}
              </div>
            ))}
          </div>
        )}

        <BackupNudge />
        <ReviewNudges />

        <div className="border-t border-[#E7E5E4]/60 pt-2" />

        <ConstellationPicker />

        <OdysseySection />

        <NorthStarStatement />

        <div className="border-t border-[#E7E5E4]/60 pt-2" />

        <IntentionAndHours />
      </div>

      {showCapture && <CaptureSheet onClose={() => setShowCapture(false)} />}
    </div>
  );
}
