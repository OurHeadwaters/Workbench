import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import {
  format,
  parseISO,
  differenceInDays,
  startOfISOWeek,
  getDay,
} from "date-fns";
import {
  Star,
  Feather,
  ChevronRight,
  X,
  Pencil,
  Clock,
  Coffee,
  Briefcase,
  BarChart2,
  Globe,
  Database,
  CalendarDays,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { useStore, getTodayKey, getWeekKey, getSeasonKey } from "@/store";
import { ZONE_SOLID, ZONE_WASH, ZONE_GLOW } from "@/lib/zone";
import { ZONE_LABELS, cn } from "@/lib/utils";
import { KitchenTablePage } from "@/pages/KitchenTablePage";
import type { ZoneId, Constellation } from "@/types";
import { Link } from "wouter";

// ── Palette ───────────────────────────────────────────────────────────────────
const WOOD    = "#2E1E0F";
const WOOD_MID= "#3D2814";
const GRAIN   = "#4A3520";
const PAPER   = "#F5EDD8";
const PAPER2  = "#EDE3C8";
const INK     = "#1C1108";
const INK_MID = "#3D2B1A";
const AMBER   = "#C8923A";
const AMBER_LIGHT = "#F0B855";

// ── North Star statement pinned on the table surface ─────────────────────────
function PinnedStatement() {
  const statement = useStore((s) => s.statement);
  if (!statement?.who && !statement?.why) return null;

  return (
    <div
      className="relative rounded-xl px-4 py-3 shadow-sm"
      style={{
        background: `linear-gradient(135deg, ${PAPER} 0%, ${PAPER2} 100%)`,
        border: `1px solid rgba(200,146,58,0.3)`,
        boxShadow: `0 2px 8px rgba(0,0,0,0.35), 0 0 0 1px rgba(200,146,58,0.15)`,
      }}
    >
      <div className="flex items-start gap-2">
        <Star size={12} className="mt-0.5 shrink-0" style={{ color: AMBER, fill: AMBER }} />
        <div className="flex-1 min-w-0">
          {statement.who && (
            <p className="text-xs leading-snug" style={{ color: INK_MID, fontFamily: "Fraunces, serif" }}>
              {statement.who}
            </p>
          )}
          {statement.why && (
            <p className="text-xs leading-snug mt-0.5 opacity-80" style={{ color: INK_MID }}>
              {statement.why}
            </p>
          )}
        </div>
        <Link href="/settings" className="shrink-0 min-h-[28px] min-w-[28px] flex items-center justify-center opacity-40 hover:opacity-70">
          <Pencil size={11} style={{ color: INK_MID }} />
        </Link>
      </div>
    </div>
  );
}

// ── Morning/Evening slip ───────────────────────────────────────────────────────
function DaySlip() {
  const getTodayPick = useStore((s) => s.getTodayPick);
  const setTodayPick = useStore((s) => s.setTodayPick);
  const pick = getTodayPick();

  const hour = new Date().getHours();
  const isEvening = hour >= 17;
  const [flipped, setFlipped] = useState(isEvening);
  const [editingWin, setEditingWin] = useState(false);
  const [editingDebrief, setEditingDebrief] = useState(false);
  const [winDraft, setWinDraft] = useState(pick.reflection ?? "");
  const [debriefDraft, setDebriefDraft] = useState(pick.eveningNote ?? "");

  const today = format(new Date(), "EEE, MMM d");

  function saveWin() {
    setTodayPick({ reflection: winDraft.trim() });
    setEditingWin(false);
  }
  function saveDebrief() {
    setTodayPick({ eveningNote: debriefDraft.trim() });
    setEditingDebrief(false);
  }

  return (
    <div
      className="relative rounded-xl shadow-md"
      style={{
        background: `linear-gradient(160deg, ${PAPER} 0%, ${PAPER2} 100%)`,
        border: `1px solid rgba(200,146,58,0.25)`,
        boxShadow: `0 4px 16px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)`,
        minHeight: 96,
      }}
    >
      <div className="absolute top-2 right-2 flex gap-1">
        <button
          onClick={() => setFlipped(false)}
          className="text-[10px] px-2 py-0.5 rounded-full transition-colors min-h-[28px]"
          style={{
            background: !flipped ? AMBER : "rgba(200,146,58,0.15)",
            color: !flipped ? "#fff" : AMBER,
          }}
        >
          Morning
        </button>
        <button
          onClick={() => setFlipped(true)}
          className="text-[10px] px-2 py-0.5 rounded-full transition-colors min-h-[28px]"
          style={{
            background: flipped ? AMBER : "rgba(200,146,58,0.15)",
            color: flipped ? "#fff" : AMBER,
          }}
        >
          Evening
        </button>
      </div>

      <div className="px-4 pt-3 pb-3">
        <p className="text-[10px] uppercase tracking-[0.18em] mb-2" style={{ color: `${INK_MID}80` }}>
          {today}
        </p>
        {!flipped ? (
          editingWin ? (
            <input
              autoFocus
              value={winDraft}
              onChange={(e) => setWinDraft(e.target.value)}
              onBlur={saveWin}
              onKeyDown={(e) => { if (e.key === "Enter") saveWin(); if (e.key === "Escape") { setWinDraft(pick.reflection ?? ""); setEditingWin(false); } }}
              placeholder="Today, the win is…"
              className="w-full text-sm bg-transparent border-b focus:outline-none pr-12"
              style={{ borderColor: `${AMBER}60`, color: INK, fontFamily: "Fraunces, serif" }}
            />
          ) : (
            <button
              onClick={() => { setWinDraft(pick.reflection ?? ""); setEditingWin(true); }}
              className="w-full text-left flex items-start gap-2 min-h-[36px]"
            >
              <Feather size={13} className="mt-0.5 shrink-0" style={{ color: AMBER }} />
              <span
                className="text-sm flex-1"
                style={{
                  color: pick.reflection ? INK : `${INK_MID}60`,
                  fontFamily: "Fraunces, serif",
                  fontStyle: pick.reflection ? "normal" : "italic",
                }}
              >
                {pick.reflection || "Today, the win is…"}
              </span>
              <Pencil size={11} className="shrink-0 mt-0.5" style={{ color: `${INK_MID}50` }} />
            </button>
          )
        ) : (
          editingDebrief ? (
            <textarea
              autoFocus
              value={debriefDraft}
              onChange={(e) => setDebriefDraft(e.target.value)}
              onBlur={saveDebrief}
              rows={3}
              placeholder="Evening — what landed, what carries over…"
              className="w-full text-sm bg-transparent border-b focus:outline-none resize-none pr-12"
              style={{ borderColor: `${AMBER}60`, color: INK, fontFamily: "Fraunces, serif" }}
            />
          ) : (
            <button
              onClick={() => { setDebriefDraft(pick.eveningNote ?? ""); setEditingDebrief(true); }}
              className="w-full text-left flex items-start gap-2 min-h-[36px]"
            >
              <BookOpen size={13} className="mt-0.5 shrink-0" style={{ color: AMBER }} />
              <span
                className="text-sm flex-1"
                style={{
                  color: pick.eveningNote ? INK : `${INK_MID}60`,
                  fontFamily: "Fraunces, serif",
                  fontStyle: pick.eveningNote ? "normal" : "italic",
                }}
              >
                {pick.eveningNote || "Evening — what landed, what carries over…"}
              </span>
              <Pencil size={11} className="shrink-0 mt-0.5" style={{ color: `${INK_MID}50` }} />
            </button>
          )
        )}
      </div>
    </div>
  );
}

// ── Hours ledger ──────────────────────────────────────────────────────────────
function HoursLedger() {
  const getTodayPick = useStore((s) => s.getTodayPick);
  const setTodayPick = useStore((s) => s.setTodayPick);
  const constellations = useStore((s) => s.constellations);
  const pick = getTodayPick();
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState<Record<ZoneId, string>>(() => {
    const zones: ZoneId[] = ["Z1","Z2","Z3","Z4"];
    return Object.fromEntries(zones.map((z) => [z, pick.hoursByZone?.[z]?.toString() ?? ""])) as Record<ZoneId, string>;
  });

  const picked = constellations.filter((c) => pick.constellationIds.includes(c.id));
  const logged = Object.values(pick.hoursByZone ?? {}).reduce((a, b) => a + (b ?? 0), 0);
  const planned = picked.length * 2;
  const pct = planned > 0 ? Math.min(100, (logged / planned) * 100) : 0;

  function save(z: ZoneId, val: string) {
    const n = parseFloat(val) || 0;
    const next = { ...(pick.hoursByZone ?? {}), [z]: n } as Record<ZoneId, number>;
    setTodayPick({ hoursByZone: next });
  }

  return (
    <div
      className="rounded-xl overflow-hidden shadow-sm"
      style={{
        background: `${WOOD_MID}`,
        border: `1px solid rgba(255,255,255,0.08)`,
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 min-h-[44px]"
      >
        <div className="flex items-center gap-2.5">
          <Clock size={14} style={{ color: AMBER_LIGHT }} />
          <span className="text-sm font-medium" style={{ color: PAPER }}>
            {logged.toFixed(1)}h logged
            {planned > 0 ? ` / ${planned}h planned` : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {planned > 0 && (
            <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: AMBER_LIGHT }}
              />
            </div>
          )}
          <ChevronRight
            size={14}
            style={{ color: `${PAPER}60`, transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}
          />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-3 space-y-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] uppercase tracking-widest mt-2 mb-1" style={{ color: `${PAPER}50` }}>
            Log hours against zones
          </p>
          {(["Z1","Z2","Z3","Z4"] as ZoneId[]).map((z) => (
            <div key={z} className="flex items-center gap-3">
              <span
                className="w-2 h-6 rounded-full shrink-0"
                style={{ background: ZONE_SOLID[z] }}
              />
              <span className="text-xs flex-1" style={{ color: `${PAPER}80` }}>
                {z} — {ZONE_LABELS[z].long.split(" / ")[0]}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const next = Math.max(0, (parseFloat(hours[z] || "0") || 0) - 0.5);
                    const s = next.toString();
                    setHours((h) => ({ ...h, [z]: s }));
                    save(z, s);
                  }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-base font-bold"
                  style={{ background: "rgba(255,255,255,0.08)", color: PAPER }}
                >−</button>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={hours[z]}
                  onChange={(e) => setHours((h) => ({ ...h, [z]: e.target.value }))}
                  onBlur={(e) => save(z, e.target.value)}
                  className="w-12 text-center text-sm rounded-lg bg-transparent border focus:outline-none"
                  style={{ borderColor: "rgba(255,255,255,0.15)", color: PAPER }}
                />
                <button
                  onClick={() => {
                    const next = (parseFloat(hours[z] || "0") || 0) + 0.5;
                    const s = next.toString();
                    setHours((h) => ({ ...h, [z]: s }));
                    save(z, s);
                  }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-base font-bold"
                  style={{ background: "rgba(255,255,255,0.08)", color: PAPER }}
                >+</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Picked constellation cards on the surface ────────────────────────────────
function PickedCards() {
  const constellations = useStore((s) => s.constellations);
  const getTodayPick = useStore((s) => s.getTodayPick);
  const setTodayPick = useStore((s) => s.setTodayPick);
  const pick = getTodayPick();
  const picked = constellations.filter((c) => pick.constellationIds.includes(c.id));

  if (picked.length === 0) {
    return (
      <div
        className="rounded-xl px-4 py-4 text-center"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px dashed rgba(255,255,255,0.1)",
        }}
      >
        <p className="text-sm italic" style={{ color: `${PAPER}40` }}>
          Pull constellations from the drawers below to place them on the table
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {picked.map((c) => {
        const col = ZONE_SOLID[c.zone];
        return (
          <div
            key={c.id}
            className="rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${PAPER} 0%, ${PAPER2} 100%)`,
              border: `1px solid ${col}40`,
              boxShadow: `0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px ${col}20`,
              flex: "1 1 auto",
              minWidth: 0,
            }}
          >
            <span className="w-2 h-6 rounded-full shrink-0" style={{ background: col }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: INK, fontFamily: "Fraunces, serif" }}>
                {c.name}
              </p>
              <p className="text-[10px] truncate" style={{ color: `${INK_MID}80` }}>
                {c.zone} — {ZONE_LABELS[c.zone].short}
              </p>
            </div>
            <button
              onClick={() => setTodayPick({ constellationIds: pick.constellationIds.filter((id) => id !== c.id) })}
              className="shrink-0 min-h-[32px] min-w-[32px] flex items-center justify-center rounded-lg opacity-50 hover:opacity-100"
              style={{ color: INK_MID }}
              title="Remove from table"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ── Zone drawer row ───────────────────────────────────────────────────────────
const ZONES: ZoneId[] = ["Z0","Z1","Z2","Z3","Z4","Z5"];

function DrawerRow() {
  const constellations = useStore((s) => s.constellations);
  const contracts = useStore((s) => s.contracts);
  const getTodayPick = useStore((s) => s.getTodayPick);
  const setTodayPick = useStore((s) => s.setTodayPick);
  const zoneRanking = useStore((s) => s.zoneRanking);
  const dismissedNudges = useStore((s) => s.dismissedNudges);
  const dismissNudge = useStore((s) => s.dismissNudge);
  const dailyPicks = useStore((s) => s.dailyPicks);
  const pick = getTodayPick();
  const pickedIds = pick.constellationIds;
  const [openZone, setOpenZone] = useState<ZoneId | null>(null);
  const [confirmingGuardrail, setConfirmingGuardrail] = useState<string | null>(null);
  const todayKey = getTodayKey();
  const capBypassKey = `cap-bypass-${todayKey}`;

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

  function getZ2Guardrail(c: Constellation): string | null {
    if (c.zone !== "Z3" && c.zone !== "Z4") return null;
    const z2Contracts = contracts.filter(
      (ct) => ct.active && constellations.find((co) => co.id === ct.constellationId)?.zone === "Z2"
    );
    for (const ct of z2Contracts) {
      const remaining = ct.weeklyHourTarget - getWeekHoursLogged(ct.constellationId);
      if (remaining > 0.25)
        return `${remaining.toFixed(1)}h still owed on "${ct.name}" this week`;
    }
    return null;
  }

  function handlePick(c: Constellation) {
    const already = pickedIds.includes(c.id);
    if (already) {
      setTodayPick({ constellationIds: pickedIds.filter((id) => id !== c.id) });
      return;
    }
    if (pickedIds.length >= 3 && !dismissedNudges[capBypassKey]) return;
    setTodayPick({ constellationIds: [...pickedIds, c.id] });
  }

  const sortedZones = ZONES.slice().sort((a, b) => {
    const ia = zoneRanking.indexOf(a);
    const ib = zoneRanking.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  return (
    <div>
      {openZone && (
        <div
          className="rounded-t-xl overflow-hidden mb-0"
          style={{
            background: WOOD,
            border: `1px solid rgba(255,255,255,0.1)`,
            borderBottom: "none",
            animation: "drawerSlideUp 0.25s ease-out",
          }}
        >
          <div
            className="px-4 py-2 flex items-center justify-between"
            style={{ background: ZONE_SOLID[openZone] }}
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80" style={{ color: "#fff" }}>
                {openZone}
              </span>
              <span className="ml-2 text-xs font-medium" style={{ color: "#fff" }}>
                {ZONE_LABELS[openZone].long}
              </span>
            </div>
            <button
              onClick={() => setOpenZone(null)}
              className="min-h-[32px] min-w-[32px] flex items-center justify-center"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              <X size={14} />
            </button>
          </div>
          <div className="px-3 py-2 space-y-1.5 max-h-48 overflow-y-auto">
            {constellations.filter((c) => c.zone === openZone && c.active).length === 0 && (
              <p className="text-xs text-center py-3" style={{ color: `${PAPER}40` }}>
                Nothing filed here yet
              </p>
            )}
            {constellations
              .filter((c) => c.zone === openZone && c.active)
              .map((c) => {
                const isPicked = pickedIds.includes(c.id);
                const guardrail = getZ2Guardrail(c);
                const atCap = pickedIds.length >= 3 && !isPicked && !dismissedNudges[capBypassKey];
                const col = ZONE_SOLID[c.zone];
                const guarded = !!(guardrail && !isPicked);
                const confirmingThis = confirmingGuardrail === c.id;

                function handleClick() {
                  if (atCap) return;
                  if (guarded && !confirmingThis) {
                    setConfirmingGuardrail(c.id);
                    return;
                  }
                  setConfirmingGuardrail(null);
                  handlePick(c);
                }

                return (
                  <div key={c.id}>
                    <button
                      onClick={handleClick}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all min-h-[44px]",
                        guarded && !confirmingThis ? "opacity-75" : ""
                      )}
                      style={{
                        background: isPicked
                          ? `linear-gradient(135deg, ${PAPER} 0%, ${PAPER2} 100%)`
                          : confirmingThis
                          ? `rgba(200,146,58,0.12)`
                          : "rgba(255,255,255,0.06)",
                        border: isPicked
                          ? `1px solid ${col}50`
                          : confirmingThis
                          ? `1px solid ${AMBER}60`
                          : "1px solid rgba(255,255,255,0.08)",
                        boxShadow: isPicked ? `0 0 0 1.5px ${col}30` : "none",
                        cursor: atCap ? "default" : "pointer",
                      }}
                    >
                      <span
                        className="w-2 h-5 rounded-full shrink-0"
                        style={{ background: col }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: isPicked ? INK : PAPER, fontFamily: "Fraunces, serif" }}
                        >
                          {c.name}
                        </p>
                        {guarded && !confirmingThis && (
                          <p className="text-[10px] mt-0.5" style={{ color: AMBER_LIGHT }}>
                            {guardrail} — still in the drawer
                          </p>
                        )}
                        {confirmingThis && (
                          <p className="text-[10px] mt-0.5" style={{ color: AMBER_LIGHT }}>
                            {guardrail} — pull it out anyway?
                          </p>
                        )}
                      </div>
                      {isPicked && (
                        <span className="text-[10px] shrink-0" style={{ color: col }}>
                          On table
                        </span>
                      )}
                      {atCap && !isPicked && (
                        <span className="text-[10px] shrink-0" style={{ color: `${PAPER}40` }}>
                          Table full
                        </span>
                      )}
                    </button>
                    {confirmingThis && (
                      <div className="flex gap-2 px-3 pb-2 pt-1">
                        <button
                          onClick={() => { setConfirmingGuardrail(null); handlePick(c); }}
                          className="text-[11px] px-3 py-1.5 rounded-lg font-semibold min-h-[32px]"
                          style={{ background: AMBER, color: INK }}
                        >
                          Pull it out
                        </button>
                        <button
                          onClick={() => setConfirmingGuardrail(null)}
                          className="text-[11px] px-3 py-1.5 rounded-lg min-h-[32px]"
                          style={{ background: "rgba(255,255,255,0.08)", color: `${PAPER}80`, border: "1px solid rgba(255,255,255,0.1)" }}
                        >
                          Leave it in
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            {pickedIds.length >= 3 && !dismissedNudges[capBypassKey] && (
              <button
                onClick={() => dismissNudge(capBypassKey)}
                className="w-full text-center text-[10px] py-1 opacity-50 hover:opacity-80 min-h-[32px]"
                style={{ color: PAPER }}
              >
                Allow more than 3 today
              </button>
            )}
          </div>
        </div>
      )}

      <div
        className="flex rounded-xl overflow-hidden"
        style={{
          background: WOOD,
          border: `1px solid rgba(255,255,255,0.1)`,
          borderTop: openZone ? "none" : undefined,
          borderTopLeftRadius: openZone ? 0 : undefined,
          borderTopRightRadius: openZone ? 0 : undefined,
        }}
      >
        {sortedZones.map((z) => {
          const col = ZONE_SOLID[z];
          const active = z === openZone;
          const count = constellations.filter((c) => c.zone === z && c.active).length;
          const pickedHere = pickedIds.filter((id) =>
            constellations.find((c) => c.id === id && c.zone === z)
          ).length;

          return (
            <button
              key={z}
              onClick={() => setOpenZone(active ? null : z)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors min-h-[52px]"
              style={{
                background: active ? `${col}25` : "transparent",
                borderTop: active ? `2px solid ${col}` : "2px solid transparent",
              }}
            >
              <span
                className="text-[10px] font-black tracking-wide"
                style={{ color: active ? col : `${PAPER}60` }}
              >
                {z}
              </span>
              {pickedHere > 0 && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: col }}
                />
              )}
              {count === 0 && (
                <span className="text-[8px]" style={{ color: `${PAPER}30` }}>—</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── "Walk to" navigation — Cockpit / Model / Window / Archive ─────────────────
function WalkToBar({ onNavigate }: { onNavigate: (path: string) => void }) {
  const destinations = [
    { label: "Cockpit",  icon: Briefcase, path: "/cockpit",       color: "#b85a3e" },
    { label: "Model",    icon: BarChart2, path: "/model",         color: "#1f3d2e" },
    { label: "Window",   icon: Globe,     path: "/window",        color: "#4B6070" },
    { label: "Archive",  icon: Database,  path: "/archive-mining",color: "#5B3E8C" },
  ];

  return (
    <div className="flex gap-2">
      {destinations.map(({ label, icon: Icon, path, color }) => (
        <button
          key={path}
          onClick={() => onNavigate(path)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl transition-all min-h-[56px]"
          style={{
            background: `${color}18`,
            border: `1px solid ${color}30`,
          }}
        >
          <Icon size={16} style={{ color }} />
          <span className="text-[10px] font-medium" style={{ color: `${PAPER}80` }}>
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ── Review nudges (almanac corner) ────────────────────────────────────────────
function AlmanacNudges() {
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

  const items: { label: string; href: string; nudgeKey: string }[] = [];
  if (isSunOrMon && !hasWeekly && !dismissedNudges[weeklyNudgeKey])
    items.push({ label: "Weekly review ready", href: "/weekly", nudgeKey: weeklyNudgeKey });
  if (!hasSeasonal && !dismissedNudges[seasonalNudgeKey])
    items.push({ label: `Seasonal review — ${seasonKey.replace("-", " ")}`, href: "/seasonal", nudgeKey: seasonalNudgeKey });

  if (items.length === 0) return null;

  return (
    <div className="space-y-1.5">
      {items.map(({ label, href, nudgeKey }) => (
        <div
          key={nudgeKey}
          className="flex items-center justify-between px-3 py-2 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${PAPER} 0%, ${PAPER2} 100%)`,
            border: `1px solid rgba(200,146,58,0.25)`,
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          <div className="flex items-center gap-2">
            <CalendarDays size={12} style={{ color: AMBER }} />
            <p className="text-xs" style={{ color: INK_MID, fontFamily: "Fraunces, serif" }}>
              {label}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Link
              href={href}
              className="text-xs font-medium underline min-h-[32px] flex items-center"
              style={{ color: INK }}
            >
              Open
            </Link>
            <button
              onClick={() => dismissNudge(nudgeKey)}
              className="text-xs min-h-[32px] flex items-center opacity-50 hover:opacity-80"
              style={{ color: INK_MID }}
            >
              Later
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Backup nudge — "tidy the table" ─────────────────────────────────────────
function TidyNudge() {
  const lastBackedUpAt = useStore((s) => s.lastBackedUpAt);
  const dismissedNudges = useStore((s) => s.dismissedNudges);
  const dismissNudge = useStore((s) => s.dismissNudge);
  const todayKey = getTodayKey();
  const nudgeKey = `backup-${todayKey}`;
  if (dismissedNudges[nudgeKey]) return null;
  const daysSince = lastBackedUpAt
    ? differenceInDays(new Date(), parseISO(lastBackedUpAt))
    : 999;
  if (daysSince < 7) return null;

  return (
    <div
      className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl"
      style={{
        background: `linear-gradient(135deg, ${PAPER} 0%, ${PAPER2} 100%)`,
        border: `1px solid rgba(200,146,58,0.2)`,
        boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
      }}
    >
      <AlertTriangle size={12} className="mt-0.5 shrink-0" style={{ color: AMBER }} />
      <p className="text-xs flex-1 leading-snug" style={{ color: INK_MID, fontFamily: "Fraunces, serif" }}>
        Tidy the table — file a copy.{" "}
        <Link href="/settings" className="underline" style={{ color: INK }}>
          Back up in Settings
        </Link>
        {lastBackedUpAt ? ` · ${daysSince}d since last copy.` : " · No copy filed yet."}
      </p>
      <button
        onClick={() => dismissNudge(nudgeKey)}
        className="text-[10px] min-h-[28px] flex items-center shrink-0 opacity-60 hover:opacity-100"
        style={{ color: INK_MID }}
      >
        Done
      </button>
    </div>
  );
}

// ── Council overlay ────────────────────────────────────────────────────────────
function CouncilOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col"
      style={{ background: "#090503" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(237,232,213,0.08)" }}
      >
        <p
          className="text-base font-semibold"
          style={{ fontFamily: "Fraunces, serif", color: "#ede8d5" }}
        >
          Kitchen Table
        </p>
        <button
          onClick={onClose}
          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full"
          style={{ color: "rgba(237,232,213,0.5)" }}
          aria-label="Close council"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <KitchenTablePage />
      </div>
    </div>
  );
}

// ── Walk-to transition wrapper ────────────────────────────────────────────────
function useWalkTo() {
  const [, navigate] = useLocation();
  const [walking, setWalking] = useState(false);

  function walkTo(path: string) {
    setWalking(true);
    setTimeout(() => {
      navigate(path);
      setWalking(false);
    }, 220);
  }

  return { walking, walkTo };
}

// ── Main TablePage ────────────────────────────────────────────────────────────
export function TablePage() {
  const statement = useStore((s) => s.statement);
  const [councilOpen, setCouncilOpen] = useState(false);
  const { walking, walkTo } = useWalkTo();

  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <>
      <div
        className="min-h-dvh pb-28 transition-all duration-200"
        style={{
          background: `linear-gradient(180deg, #1A1006 0%, #241508 40%, #2E1A0C 100%)`,
          opacity: walking ? 0.3 : 1,
          transform: walking ? "scale(0.97)" : "scale(1)",
          transition: "opacity 0.22s ease, transform 0.22s ease",
        }}
      >
        <div className="max-w-lg mx-auto px-4 pt-5 pb-4 space-y-4">

          {/* ── Date + council access ── */}
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xs uppercase tracking-[0.18em]"
                style={{ color: `${PAPER}50` }}
              >
                {today}
              </p>
              <h1
                className="text-xl mt-0.5"
                style={{ fontFamily: "Fraunces, serif", fontWeight: 600, color: PAPER }}
              >
                Kitchen Table
              </h1>
            </div>
            <button
              onClick={() => setCouncilOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl min-h-[44px] transition-colors"
              style={{
                background: "rgba(200,146,58,0.12)",
                border: "1px solid rgba(200,146,58,0.25)",
                color: AMBER_LIGHT,
              }}
              title="Open council seats"
            >
              <Coffee size={15} />
              <span className="text-xs font-medium">Seats</span>
            </button>
          </div>

          {/* ── North Star statement ── */}
          {statement?.who || statement?.why ? (
            <PinnedStatement />
          ) : (
            <Link
              href="/settings"
              className="flex items-center gap-2 px-4 py-3 rounded-xl min-h-[44px]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px dashed rgba(200,146,58,0.3)",
              }}
            >
              <Star size={12} style={{ color: `${AMBER}70` }} />
              <span className="text-xs italic" style={{ color: `${PAPER}40` }}>
                Pin your north star statement here…
              </span>
            </Link>
          )}

          {/* ── Day slip ── */}
          <DaySlip />

          {/* ── Nudges (tidy, almanac) ── */}
          <TidyNudge />
          <AlmanacNudges />

          {/* ── Table surface — picked constellations ── */}
          <div className="space-y-2">
            <p
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: `${PAPER}40` }}
            >
              On the table today
            </p>
            <PickedCards />
          </div>

          {/* ── Hours ledger ── */}
          <HoursLedger />

          {/* ── Drawer row ── */}
          <div className="space-y-2">
            <p
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: `${PAPER}40` }}
            >
              Drawers — pull a file
            </p>
            <DrawerRow />
          </div>

          {/* ── Stand up / walk to ── */}
          <div className="space-y-2">
            <p
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: `${PAPER}40` }}
            >
              Stand up, walk to
            </p>
            <WalkToBar onNavigate={walkTo} />
          </div>

        </div>
      </div>

      {/* ── Council overlay ── */}
      {councilOpen && <CouncilOverlay onClose={() => setCouncilOpen(false)} />}

      <style>{`
        @keyframes drawerSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
