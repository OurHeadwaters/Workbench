import { useState, useEffect, useRef } from "react";
import { format, parseISO, differenceInDays, startOfISOWeek, getDay } from "date-fns";
import { AlertTriangle, ExternalLink, Star, Feather, Inbox, ListChecks, Clock, X, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { useStore, getTodayKey, getWeekKey, getSeasonKey } from "@/store";
import { MorningTriage } from "@/components/MorningTriage";
import { ZoneBadge } from "@/components/ZoneBadge";
import { cn } from "@/lib/utils";
import { ZONE_LABELS } from "@/lib/utils";
import { ZONE_SOLID, ZONE_WASH, ZONE_GLOW, useActiveZone } from "@/lib/zone";
import type { ZoneId, Constellation } from "@/types";
import { fetchTrailSigns, getTrailSigns } from "@workspace/odyssey";
import { OdysseyTrail } from "@/components/TrailSign";
import { Link, useLocation } from "wouter";

type Room = "triage" | "pick" | "log";

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
        <AlertTriangle size={14} className="text-[#B45309] mt-1 shrink-0" />
        <p className="text-sm text-[#78400A]">
          Back up in Settings — North Star lives only on this device.
          {lastBackedUpAt ? ` Last backup: ${daysSince}d ago.` : " No backup yet."}
        </p>
      </div>
      <button
        onClick={() => dismissNudge(nudgeKey)}
        className="text-xs text-[#B45309]/70 underline shrink-0 min-h-[44px] flex items-center"
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
  const hasWeekly = weeklyReviews.some((r) => r.weekKey === weekKey);
  const hasSeasonal = seasonalReviews.some((r) => r.seasonKey === seasonKey);

  return (
    <>
      {isSunOrMon && !hasWeekly && !dismissedNudges[weeklyNudgeKey] && (
        <div className="rounded-xl border border-[#D6D0C7] bg-[#F5F0E8] px-4 py-3 flex items-center justify-between gap-2">
          <p className="text-sm text-[#44403C]">📋 Weekly review ready</p>
          <div className="flex gap-2 shrink-0">
            <Link href="/weekly" className="text-sm text-[#1C1917] font-medium underline min-h-[44px] flex items-center">Review</Link>
            <button onClick={() => dismissNudge(weeklyNudgeKey)} className="text-sm text-[#78716C] min-h-[44px] flex items-center">Later</button>
          </div>
        </div>
      )}
      {!hasSeasonal && !dismissedNudges[seasonalNudgeKey] && (
        <div className="rounded-xl border border-[#D6D0C7] bg-[#F5F0E8] px-4 py-3 flex items-center justify-between gap-2">
          <p className="text-sm text-[#44403C]">🌿 Seasonal review — {seasonKey.replace("-", " ")}</p>
          <div className="flex gap-2 shrink-0">
            <Link href="/seasonal" className="text-sm text-[#1C1917] font-medium underline min-h-[44px] flex items-center">Review</Link>
            <button onClick={() => dismissNudge(seasonalNudgeKey)} className="text-sm text-[#78716C] min-h-[44px] flex items-center">Later</button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Persistent header strip ────────────────────────────────────────────
function HeaderStrip() {
  const constellations = useStore((s) => s.constellations);
  const getTodayPick = useStore((s) => s.getTodayPick);
  const setTodayPick = useStore((s) => s.setTodayPick);
  const pick = getTodayPick();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(pick.reflection ?? "");

  const today = format(new Date(), "EEE, MMM d");
  const picked = constellations.filter((c) => pick.constellationIds.includes(c.id));

  const logged = Object.values(pick.hoursByZone ?? {}).reduce((a, b) => a + (b ?? 0), 0);
  const planned = picked.length * 2; // rough proxy: 2h per picked
  const pct = planned > 0 ? Math.min(100, (logged / planned) * 100) : 0;

  function save() {
    setTodayPick({ reflection: draft.trim() });
    setEditing(false);
  }

  return (
    <div className="sticky top-0 z-20 backdrop-blur-md bg-white/85 border-b border-[#E7E5E4]">
      <div className="px-4 py-2.5 max-w-lg mx-auto space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#78716C] uppercase tracking-widest">{today}</p>
          <p className="text-xs text-[#78716C] tabular-nums">
            {logged.toFixed(1)}h logged{planned > 0 ? ` / ${planned}h planned` : ""}
          </p>
        </div>
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setDraft(pick.reflection ?? ""); setEditing(false); } }}
            placeholder="Today, the win is…"
            className="w-full text-base border border-[#E7E5E4] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30"
          />
        ) : (
          <button
            onClick={() => { setDraft(pick.reflection ?? ""); setEditing(true); }}
            className="w-full text-left flex items-center gap-2 min-h-[28px]"
          >
            <Feather size={13} className="text-[#78716C] shrink-0" />
            <span className={cn("text-base truncate", pick.reflection ? "text-[#1C1917]" : "text-[#B5AFA9] italic")}>
              {pick.reflection || "Today, the win is…"}
            </span>
            <Pencil size={12} className="text-[#B5AFA9] shrink-0 ml-auto" />
          </button>
        )}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
          {picked.length === 0 ? (
            <span className="text-xs text-[#B5AFA9]">No constellations picked yet</span>
          ) : (
            picked.map((c) => {
              const col = ZONE_SOLID[c.zone];
              return (
                <span
                  key={c.id}
                  className="text-xs px-2 py-1 rounded-full border whitespace-nowrap shrink-0"
                  style={{ borderColor: `${col}55`, backgroundColor: `${col}1A`, color: col, fontWeight: 500 }}
                >
                  {c.name}
                </span>
              );
            })
          )}
        </div>
        {planned > 0 && (
          <div className="h-1 rounded-full bg-[#F5F0E8] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "#8A6A1A" }} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Triage room (collapsed → opens full-screen sheet) ──────────────────
function TriageRoom() {
  const inbox = useStore((s) => s.inbox);
  const pendingReplies = useStore((s) => s.pendingReplies);
  const [openSheet, setOpenSheet] = useState(false);

  const pendingCount = Object.values(pendingReplies).filter((r) => !r?.doneAt).length;

  if (!inbox.enabled) {
    return (
      <div className="rounded-2xl border border-[#E7E5E4] bg-white p-5 text-sm text-[#78716C] flex items-start gap-3">
        <Inbox size={18} className="text-[#B5AFA9] shrink-0 mt-0.5" />
        <div>
          <p className="text-[#44403C] font-medium mb-1">Morning triage is off</p>
          <p>Enable in <Link href="/inbox-setup" className="underline">Inbox setup</Link> to pull threads here.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpenSheet(true)}
        className="w-full rounded-2xl border border-[#E7E5E4] bg-white p-5 flex items-center justify-between hover:shadow-sm transition-shadow min-h-[88px]"
      >
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-[#F5F0E8] flex items-center justify-center">
            <Inbox size={20} className="text-[#8A6A1A]" />
          </span>
          <div className="text-left">
            <p className="text-base font-medium text-[#1C1917]">Triage</p>
            <p className="text-sm text-[#78716C]">{pendingCount > 0 ? `${pendingCount} to triage` : "All clear"}</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-[#B5AFA9]" />
      </button>

      {openSheet && (
        <div
          className="fixed inset-0 z-[55] bg-white flex flex-col"
          onKeyDown={(e) => e.key === "Escape" && setOpenSheet(false)}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E7E5E4]">
            <button
              onClick={() => setOpenSheet(false)}
              className="flex items-center gap-1 text-sm text-[#44403C] min-h-[44px]"
            >
              <ChevronLeft size={18} /> Back
            </button>
            <h2 className="text-base font-medium" style={{ fontFamily: "Fraunces, serif" }}>Triage</h2>
            <button
              onClick={() => setOpenSheet(false)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg w-full mx-auto pb-24">
            <MorningTriage />
          </div>
        </div>
      )}
    </>
  );
}

// ─── Pick room — horizontal zone carousel ───────────────────────────────
function PickRoom() {
  const [, navigate] = useLocation();
  const constellations = useStore((s) => s.constellations);
  const contracts = useStore((s) => s.contracts);
  const zoneRanking = useStore((s) => s.zoneRanking);
  const getTodayPick = useStore((s) => s.getTodayPick);
  const setTodayPick = useStore((s) => s.setTodayPick);
  const dismissedNudges = useStore((s) => s.dismissedNudges);
  const dismissNudge = useStore((s) => s.dismissNudge);
  const dailyPicks = useStore((s) => s.dailyPicks);

  const pick = getTodayPick();
  const pickedIds = pick.constellationIds;
  const todayKey = getTodayKey();

  const [guardrailPrompt, setGuardrailPrompt] = useState<string | null>(null);
  const [parkPrompt, setParkPrompt] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const active = constellations.filter((c) => c.active);
  const zonesWithItems = zoneRanking.filter((z) => active.some((c) => c.zone === z));
  const capBypassKey = `cap-bypass-${todayKey}`;

  // Track currently centered zone via scroll snap
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [zoneIdx, setZoneIdx] = useState(0);
  function onScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== zoneIdx) setZoneIdx(idx);
  }

  function getWeekHoursLogged(constellationId: string): number {
    const c = constellations.find((co) => co.id === constellationId);
    if (!c) return 0;
    const weekStart = startOfISOWeek(new Date());
    let total = 0;
    for (const [dateKey, p] of Object.entries(dailyPicks)) {
      const d = parseISO(dateKey);
      if (d >= weekStart && p.hoursByZone) total += p.hoursByZone[c.zone] ?? 0;
    }
    return total;
  }

  function getContractGuardrail(c: Constellation): string | null {
    if (c.zone !== "Z3" && c.zone !== "Z4") return null;
    const z2Contracts = contracts.filter(
      (ct) => ct.active && constellations.find((co) => co.id === ct.constellationId)?.zone === "Z2"
    );
    for (const ct of z2Contracts) {
      const remaining = ct.weeklyHourTarget - getWeekHoursLogged(ct.constellationId);
      if (remaining > 0.25) return `${remaining.toFixed(1)}h left on "${ct.name}" this week. Still pick ${c.name}?`;
    }
    return null;
  }

  function handleToggle(c: Constellation) {
    const already = pickedIds.includes(c.id);
    if (already) {
      setTodayPick({ constellationIds: pickedIds.filter((id) => id !== c.id) });
      return;
    }
    if (pickedIds.length >= 3 && !dismissedNudges[capBypassKey]) {
      setPendingId(c.id);
      setParkPrompt(c.id);
      return;
    }
    const guardrail = getContractGuardrail(c);
    const ack = `guardrail-${todayKey}-${c.id}`;
    if (guardrail && !pick.acknowledgedGuardrails?.includes(ack)) {
      setPendingId(c.id);
      setGuardrailPrompt(guardrail);
      return;
    }
    setTodayPick({ constellationIds: [...pickedIds, c.id] });
  }

  function handlePark(parkId: string) {
    const remaining = pickedIds.filter((id) => id !== parkId);
    setTodayPick({ constellationIds: [...remaining, pendingId!] });
    setParkPrompt(null); setPendingId(null);
  }

  function handleBypassCap() {
    dismissNudge(capBypassKey);
    setParkPrompt(null);
    if (pendingId) setTodayPick({ constellationIds: [...pickedIds, pendingId] });
    setPendingId(null);
  }

  function handleGuardrailAck() {
    const ack = `guardrail-${todayKey}-${pendingId}`;
    setTodayPick({
      constellationIds: [...pickedIds, pendingId!],
      acknowledgedGuardrails: [...(pick.acknowledgedGuardrails ?? []), ack],
    });
    setGuardrailPrompt(null); setPendingId(null);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-[#78716C]">Swipe between zones · pick up to 3</p>
        <span className="text-sm text-[#78716C] tabular-nums">{pickedIds.length} / 3</span>
      </div>

      {guardrailPrompt && (
        <div className="rounded-xl border border-[#C8923A]/50 bg-[#FEF9EE] p-4 space-y-3">
          <p className="text-sm text-[#78400A]">{guardrailPrompt}</p>
          <div className="flex gap-2">
            <button
              onClick={() => { setGuardrailPrompt(null); setPendingId(null); navigate("/zones"); }}
              className="flex-1 border border-[#C8923A]/50 rounded-lg py-2 text-sm text-[#B45309] min-h-[44px]"
            >
              Go to Zones
            </button>
            <button
              onClick={handleGuardrailAck}
              className="flex-1 bg-[#1C1917] text-white rounded-lg py-2 text-sm min-h-[44px]"
            >
              Still pick it
            </button>
          </div>
        </div>
      )}

      {parkPrompt && !guardrailPrompt && (
        <div className="rounded-xl border border-[#D6D0C7] bg-[#F5F0E8] p-4 space-y-2">
          <p className="text-sm font-medium">Park one to make room?</p>
          <div className="space-y-1.5">
            {pickedIds.map((id) => {
              const c = constellations.find((co) => co.id === id);
              if (!c) return null;
              return (
                <button
                  key={id}
                  onClick={() => handlePark(id)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-white text-sm min-h-[44px] border border-[#E7E5E4]"
                >
                  Park {c.name}
                </button>
              );
            })}
          </div>
          <button onClick={handleBypassCap} className="text-sm text-[#78716C] underline min-h-[44px] flex items-center">
            Don't ask again today
          </button>
        </div>
      )}

      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="-mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: "none", scrollPaddingLeft: 16 }}
      >
        {zonesWithItems.map((z) => {
          const items = active.filter((c) => c.zone === z);
          const col = ZONE_SOLID[z];
          return (
            <div
              key={z}
              className="snap-start shrink-0 rounded-2xl overflow-hidden border border-[#E7E5E4] bg-white"
              style={{ width: "calc(100vw - 56px)", maxWidth: 460 }}
            >
              <div className="px-4 py-3" style={{ backgroundColor: col }}>
                <p className="text-white text-xs uppercase tracking-widest opacity-90">{z}</p>
                <h3 className="text-white text-lg font-medium" style={{ fontFamily: "Fraunces, serif", fontWeight: 500 }}>
                  {ZONE_LABELS[z].long}
                </h3>
              </div>
              <div className="p-3 space-y-2" style={{ backgroundColor: ZONE_WASH[z] }}>
                {items.length === 0 && (
                  <p className="text-sm text-[#78716C] px-2 py-4 text-center">No constellations yet</p>
                )}
                {items.map((c) => {
                  const picked = pickedIds.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleToggle(c)}
                      className={cn(
                        "w-full flex items-start gap-3 px-3 py-3 rounded-xl border min-h-[64px] text-left transition-all",
                        picked ? "bg-white shadow-sm" : "bg-white/80 border-[#E7E5E4]"
                      )}
                      style={picked ? { borderColor: col, boxShadow: `0 0 0 1.5px ${col}, 0 2px 12px ${ZONE_GLOW[c.zone]}` } : undefined}
                    >
                      <span
                        className="mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={{ borderColor: picked ? col : "#D6D0C7", backgroundColor: picked ? col : "transparent" }}
                      >
                        {picked && (
                          <svg width="10" height="8" viewBox="0 0 9 7" fill="none">
                            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-[#1C1917]">{c.name}</p>
                        {c.notes && <p className="text-sm text-[#78716C] mt-0.5">{c.notes}</p>}
                        {picked && (c.urls?.length > 0 || c.deepLinks?.length > 0) && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {(c.urls?.length ? c.urls.map((u) => ({ label: u.label, path: u.url })) : c.deepLinks ?? []).map((dl, i) => (
                              <a
                                key={i}
                                href={dl.path}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-xs rounded-lg px-2.5 py-1 min-h-[32px]"
                                style={{ color: col, border: `1px solid ${col}33`, background: `${col}0F` }}
                              >
                                {dl.label} <ExternalLink size={10} />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-1.5 pt-1">
        {zonesWithItems.map((z, i) => (
          <span
            key={z}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === zoneIdx ? 18 : 6,
              backgroundColor: i === zoneIdx ? ZONE_SOLID[z] : "#E7E5E4",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Log room — number-pad per active constellation ─────────────────────
function LogRoom() {
  const constellations = useStore((s) => s.constellations);
  const getTodayPick = useStore((s) => s.getTodayPick);
  const setTodayPick = useStore((s) => s.setTodayPick);
  const pick = getTodayPick();
  const picked = constellations.filter((c) => pick.constellationIds.includes(c.id));

  const ZONES_ALL: ZoneId[] = ["Z1", "Z2", "Z3", "Z4"];
  const initialHours: Partial<Record<ZoneId, string>> = {};
  for (const z of ZONES_ALL) initialHours[z] = pick.hoursByZone?.[z]?.toString() ?? "";
  const [hours, setHours] = useState<Partial<Record<ZoneId, string>>>(initialHours);

  function save() {
    const hoursByZone = Object.fromEntries(
      ZONES_ALL.map((z) => [z, parseFloat(hours[z] ?? "") || 0])
    ) as Record<ZoneId, number>;
    setTodayPick({ hoursByZone });
  }

  function bump(z: ZoneId, delta: number) {
    const next = Math.max(0, (parseFloat(hours[z] ?? "0") || 0) + delta);
    setHours((p) => ({ ...p, [z]: next.toString() }));
  }

  // Group picked by zone
  const grouped: Partial<Record<ZoneId, Constellation[]>> = {};
  for (const c of picked) {
    (grouped[c.zone] ??= []).push(c);
  }

  const total = ZONES_ALL.reduce((sum, z) => sum + (parseFloat(hours[z] ?? "0") || 0), 0);

  return (
    <div className="space-y-3" onBlur={save}>
      <p className="text-sm text-[#78716C] px-1">Tap +/− to log hours per zone. Total: <span className="text-[#1C1917] font-medium tabular-nums">{total.toFixed(1)}h</span></p>
      {ZONES_ALL.map((z) => {
        const col = ZONE_SOLID[z];
        const items = grouped[z] ?? [];
        return (
          <div
            key={z}
            className="rounded-2xl border border-[#E7E5E4] bg-white overflow-hidden"
          >
            <div className="px-4 py-2.5 flex items-center justify-between" style={{ backgroundColor: ZONE_WASH[z] }}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col }} />
                <span className="text-sm font-medium" style={{ color: col }}>{z} — {ZONE_LABELS[z].long.split(" / ")[0]}</span>
              </div>
              {items.length > 0 && (
                <span className="text-xs text-[#78716C]">{items.map((i) => i.name).join(", ")}</span>
              )}
            </div>
            <div className="flex items-center justify-between px-4 py-3 gap-3">
              <button
                onClick={() => bump(z, -0.25)}
                className="w-11 h-11 rounded-full border border-[#E7E5E4] flex items-center justify-center text-xl text-[#44403C] active:scale-95 transition-transform"
                aria-label={`Subtract from ${z}`}
              >
                −
              </button>
              <input
                type="number"
                min="0"
                step="0.25"
                value={hours[z]}
                onChange={(e) => setHours((p) => ({ ...p, [z]: e.target.value }))}
                onBlur={save}
                className="flex-1 text-2xl text-center tabular-nums border-0 focus:outline-none bg-transparent font-medium"
                placeholder="0"
                style={{ color: col }}
              />
              <span className="text-sm text-[#78716C]">h</span>
              <button
                onClick={() => bump(z, 0.25)}
                className="w-11 h-11 rounded-full border border-[#E7E5E4] flex items-center justify-center text-xl text-[#44403C] active:scale-95 transition-transform"
                aria-label={`Add to ${z}`}
              >
                +
              </button>
            </div>
          </div>
        );
      })}
      <button
        onClick={save}
        className="w-full bg-[#1C1917] text-white rounded-xl py-3 text-sm min-h-[48px] hover:bg-[#2C2420] transition-colors"
      >
        Save log
      </button>
    </div>
  );
}

// ─── North-star statement (kept as bottom anchor) ───────────────────────
function NorthStarStatement() {
  const statement = useStore((s) => s.statement);
  if (!statement) return null;
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#D6D0C7]" style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #EDE8DC 100%)" }}>
      <div className="px-5 py-5 space-y-3">
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

const BASE_API = import.meta.env.VITE_API_URL ?? "/api";

function OdysseySection() {
  const activeZone = useActiveZone();
  const dismissedNudges = useStore((s) => s.dismissedNudges);
  const dismissNudge = useStore((s) => s.dismissNudge);
  const todayKey = getTodayKey();
  const [signs, setSigns] = useState(() => getTrailSigns(activeZone));

  useEffect(() => {
    let cancelled = false;
    fetchTrailSigns(BASE_API, activeZone).then((live) => { if (!cancelled) setSigns(live); });
    return () => { cancelled = true; };
  }, [activeZone]);

  const odysseyDismissKey = `odyssey-trail-${todayKey}`;
  if (dismissedNudges[odysseyDismissKey] || signs.length === 0) return null;
  return <OdysseyTrail signs={signs} onAllDismissed={() => dismissNudge(odysseyDismissKey)} />;
}

export function TodayPage() {
  const [room, setRoom] = useState<Room>(() => {
    return new Date().getHours() >= 16 ? "log" : "pick";
  });

  const activeZone = useActiveZone();
  const tabs: { id: Room; label: string; icon: typeof Inbox }[] = [
    { id: "triage", label: "Triage", icon: Inbox },
    { id: "pick", label: "Pick", icon: ListChecks },
    { id: "log", label: "Log", icon: Clock },
  ];

  return (
    <div
      className="min-h-dvh pb-28"
      style={{ background: `linear-gradient(180deg, #FAFAF9 0%, ${ZONE_WASH[activeZone]} 100%)` }}
    >
      <HeaderStrip />

      <div className="sticky top-[120px] z-10 backdrop-blur-md bg-white/85 border-b border-[#E7E5E4]">
        <div className="max-w-lg mx-auto px-4 py-2">
          <div role="tablist" className="flex gap-1 bg-[#F5F0E8] rounded-xl p-1">
            {tabs.map((t) => {
              const active = room === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setRoom(t.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm min-h-[44px] transition-all",
                    active ? "bg-white shadow-sm font-medium" : "text-[#78716C]"
                  )}
                  style={active ? { color: ZONE_SOLID[activeZone] } : undefined}
                >
                  <t.icon size={15} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <BackupNudge />
        <ReviewNudges />

        {room === "triage" && <TriageRoom />}
        {room === "pick" && <PickRoom />}
        {room === "log" && <LogRoom />}

        <OdysseySection />
        <NorthStarStatement />
      </div>
    </div>
  );
}
