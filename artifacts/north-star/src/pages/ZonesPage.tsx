import { useRef, useState } from "react";
import { Link } from "wouter";
import { Plus, Pencil, Trash2, Archive, ArchiveRestore, ChevronUp, ChevronDown, GripVertical, Map, ListOrdered, Check, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/store";
import { ZoneBadge } from "@/components/ZoneBadge";
import { ConstellationForm } from "@/components/ConstellationForm";
import { ZONE_LABELS, cn } from "@/lib/utils";
import { ZONE_SOLID, ZONE_WASH } from "@/lib/zone";
import type { ZoneId, Contract, Constellation } from "@/types";

const ZONES: ZoneId[] = ["Z0", "Z1", "Z2", "Z3", "Z4", "Z5"];

function ContractForm({
  initial,
  constellationId,
  constellations,
  onSave,
  onCancel,
}: {
  initial?: Partial<Contract>;
  constellationId?: string;
  constellations: Constellation[];
  onSave: (data: Omit<Contract, "id" | "createdAt">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [cId, setCId] = useState(initial?.constellationId ?? constellationId ?? constellations[0]?.id ?? "");
  const [hours, setHours] = useState(initial?.weeklyHourTarget?.toString() ?? "10");

  function handleSave() {
    if (!name.trim()) return;
    onSave({ name: name.trim(), constellationId: cId, weeklyHourTarget: parseFloat(hours) || 0, active: true });
  }

  return (
    <div className="bg-[#F5F0E8] rounded-xl p-4 space-y-3 border border-[#D6D0C7]">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Contract name"
        className="w-full border border-[#E7E5E4] rounded-lg px-3 py-3 text-base bg-white focus:outline-none"
      />
      <select
        value={cId}
        onChange={(e) => setCId(e.target.value)}
        className="w-full border border-[#E7E5E4] rounded-lg px-3 py-3 text-base bg-white focus:outline-none min-h-[48px]"
      >
        {constellations.map((c) => (
          <option key={c.id} value={c.id}>{c.name} ({c.zone})</option>
        ))}
      </select>
      <div className="flex items-center gap-2">
        <input
          type="number" min="0.25" step="0.25" value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="w-24 border border-[#E7E5E4] rounded-lg px-3 py-2 text-base bg-white focus:outline-none min-h-[44px]"
        />
        <span className="text-sm text-[#78716C]">hours / week target</span>
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 border border-[#D6D0C7] rounded-lg py-3 text-sm min-h-[48px] hover:bg-white">Cancel</button>
        <button onClick={handleSave} className="flex-1 bg-[#1C1917] text-white rounded-lg py-3 text-sm min-h-[48px] hover:bg-[#2C2420]">Save</button>
      </div>
    </div>
  );
}

function ArrangeMode({ onExit }: { onExit: () => void }) {
  const zoneRanking = useStore((s) => s.zoneRanking);
  const setZoneRanking = useStore((s) => s.setZoneRanking);

  const ranked = [...zoneRanking];
  function moveZone(z: ZoneId, dir: -1 | 1) {
    const idx = ranked.indexOf(z);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= ranked.length) return;
    const next = [...ranked];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    setZoneRanking(next);
  }

  return (
    <div className="min-h-dvh pb-28" style={{ background: "linear-gradient(180deg, #FAFAF9 0%, #F5F0E8 100%)" }}>
      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl" style={{ fontFamily: "Fraunces, serif", fontWeight: 500 }}>Arrange zones</h1>
            <p className="text-sm text-[#78716C]">Order them by priority.</p>
          </div>
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 text-sm bg-[#1C1917] text-white rounded-xl px-3 py-2 min-h-[44px]"
          >
            <Check size={16} /> Done
          </button>
        </div>

        <div className="space-y-2">
          {ranked.map((z, i) => {
            const col = ZONE_SOLID[z];
            return (
              <div
                key={z}
                className="flex items-center gap-3 bg-white rounded-xl border border-[#E7E5E4] p-3"
              >
                <GripVertical size={18} className="text-[#B5AFA9]" />
                <span className="w-2 h-10 rounded-full" style={{ backgroundColor: col }} />
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium">{z} — {ZONE_LABELS[z].long}</p>
                  <p className="text-sm text-[#78716C]">{ZONE_LABELS[z].desc}</p>
                </div>
                <span className="text-sm text-[#B5AFA9] tabular-nums mr-1">#{i + 1}</span>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveZone(z, -1)}
                    disabled={i === 0}
                    className="w-9 h-9 rounded-lg border border-[#E7E5E4] flex items-center justify-center disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => moveZone(z, 1)}
                    disabled={i === ranked.length - 1}
                    className="w-9 h-9 rounded-lg border border-[#E7E5E4] flex items-center justify-center disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ZonesPage() {
  const constellations = useStore((s) => s.constellations);
  const contracts = useStore((s) => s.contracts);
  const zoneRanking = useStore((s) => s.zoneRanking);
  const addConstellation = useStore((s) => s.addConstellation);
  const updateConstellation = useStore((s) => s.updateConstellation);
  const removeConstellation = useStore((s) => s.removeConstellation);
  const addContract = useStore((s) => s.addContract);
  const updateContract = useStore((s) => s.updateContract);
  const removeContract = useStore((s) => s.removeContract);

  const [arranging, setArranging] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [addingConst, setAddingConst] = useState(false);
  const [editingConst, setEditingConst] = useState<string | null>(null);
  const [addingContract, setAddingContract] = useState(false);
  const [editingContract, setEditingContract] = useState<string | null>(null);
  const [showParked, setShowParked] = useState(false);

  const scrollerRef = useRef<HTMLDivElement>(null);
  function onScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== activeIdx) setActiveIdx(idx);
  }

  function goToZone(idx: number) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
  }

  if (arranging) return <ArrangeMode onExit={() => setArranging(false)} />;

  const parked = constellations.filter((c) => !c.active);
  const currentZone = zoneRanking[activeIdx];
  const currentZoneColor = ZONE_SOLID[currentZone];

  return (
    <div
      className="min-h-dvh pb-28 transition-colors duration-300"
      style={{ background: `linear-gradient(180deg, #FAFAF9 0%, ${ZONE_WASH[currentZone]} 100%)` }}
    >
      {/* Header band — full-bleed in zone color */}
      <div
        className="w-full transition-colors duration-300"
        style={{ backgroundColor: currentZoneColor }}
      >
        <div className="px-4 pt-6 pb-5 max-w-lg mx-auto">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-80">{currentZone}</p>
              <h1 className="text-2xl mt-0.5" style={{ fontFamily: "Fraunces, serif", fontWeight: 500 }}>
                {ZONE_LABELS[currentZone].long}
              </h1>
            </div>
            <div className="flex flex-col gap-1.5 items-end">
              <button
                onClick={() => setArranging(true)}
                className="flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 backdrop-blur rounded-xl px-3 py-2 min-h-[44px]"
              >
                <ListOrdered size={14} /> Arrange
              </button>
              <Link
                href="/zone-diagram"
                className="flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 backdrop-blur rounded-xl px-3 py-2 min-h-[44px]"
              >
                <Map size={14} /> Diagram
              </Link>
            </div>
          </div>
          <p className="text-white/90 text-sm mt-2 leading-relaxed">{ZONE_LABELS[currentZone].desc}</p>
        </div>
      </div>

      {/* Zone tabs */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-white/85 border-b border-[#E7E5E4]">
        <div className="max-w-lg mx-auto px-4 py-2 flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {zoneRanking.map((z, i) => {
            const col = ZONE_SOLID[z];
            const active = i === activeIdx;
            return (
              <button
                key={z}
                onClick={() => goToZone(i)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm min-h-[44px] transition-all whitespace-nowrap",
                  active ? "font-semibold" : "text-[#78716C]"
                )}
                style={active ? { color: col, backgroundColor: `${col}1A` } : undefined}
              >
                {z}
              </button>
            );
          })}
        </div>
      </div>

      {/* Swipeable zone deck */}
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex overflow-x-auto snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {zoneRanking.map((zone) => {
          const zoneConsts = constellations.filter((c) => c.zone === zone && c.active);
          const zoneContracts = contracts.filter(
            (ct) => ct.active && zoneConsts.some((co) => co.id === ct.constellationId)
          );
          const col = ZONE_SOLID[zone];

          return (
            <section
              key={zone}
              className="snap-start shrink-0 w-full"
            >
              <div className="px-4 py-4 max-w-lg mx-auto space-y-3 pb-24">
                {zoneConsts.length === 0 && !addingConst && !editingConst && (
                  <div className="text-center text-sm text-[#78716C] py-8 border border-dashed border-[#D6D0C7] rounded-2xl">
                    No constellations in {zone} yet.
                  </div>
                )}

                {zoneConsts.map((c) => (
                  <div key={c.id}>
                    {editingConst === c.id ? (
                      <ConstellationForm
                        initial={c}
                        onSave={(data) => { updateConstellation(c.id, data); setEditingConst(null); }}
                        onCancel={() => setEditingConst(null)}
                      />
                    ) : (
                      <div className="flex bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden">
                        <div className="w-1.5 self-stretch shrink-0" style={{ backgroundColor: col }} />
                        <div className="flex-1 min-w-0 p-4 flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-medium">{c.name}</p>
                            {c.notes && <p className="text-sm text-[#78716C] mt-0.5">{c.notes}</p>}
                            {c.urls?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {c.urls.map((u, i) => (
                                  <a
                                    key={i}
                                    href={u.url}
                                    className="inline-flex items-center gap-1 text-xs rounded-lg px-2.5 py-1 min-h-[32px]"
                                    style={{ color: col, border: `1px solid ${col}33`, background: `${col}0F` }}
                                  >
                                    {u.label} <ExternalLink size={10} />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => updateConstellation(c.id, { active: false })}
                              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#B5AFA9] hover:text-[#B45309]"
                              title="Park"
                            >
                              <Archive size={16} />
                            </button>
                            <button
                              onClick={() => setEditingConst(c.id)}
                              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#B5AFA9] hover:text-[#1C1917]"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => removeConstellation(c.id)}
                              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#B5AFA9] hover:text-[#B45309]"
                              title="Remove"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {zoneContracts.map((ct) => (
                  <div key={ct.id}>
                    {editingContract === ct.id ? (
                      <ContractForm
                        initial={ct}
                        constellations={constellations}
                        onSave={(data) => { updateContract(ct.id, data); setEditingContract(null); }}
                        onCancel={() => setEditingContract(null)}
                      />
                    ) : (
                      <div className="flex rounded-2xl border border-[#3B5998]/20 overflow-hidden" style={{ background: "#DBEAFE" }}>
                        <div className="w-1.5 self-stretch shrink-0 bg-[#3B5998]" />
                        <div className="flex-1 min-w-0 p-3 flex items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#3B5998]">📋 {ct.name}</p>
                            <p className="text-xs text-[#3B5998]/70">{ct.weeklyHourTarget}h/week</p>
                          </div>
                          <button onClick={() => setEditingContract(ct.id)} className="min-h-[44px] min-w-[44px] flex items-center justify-center">
                            <Pencil size={14} className="text-[#3B5998]" />
                          </button>
                          <button onClick={() => removeContract(ct.id)} className="min-h-[44px] min-w-[44px] flex items-center justify-center">
                            <Trash2 size={14} className="text-[#3B5998]" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Inline add forms (only render under the active zone) */}
                {zone === currentZone && addingConst && (
                  <ConstellationForm
                    initial={{ zone }}
                    onSave={(data) => { addConstellation(data); setAddingConst(false); }}
                    onCancel={() => setAddingConst(false)}
                  />
                )}
                {zone === currentZone && addingContract && (
                  <ContractForm
                    constellations={zoneConsts}
                    onSave={(data) => { addContract(data); setAddingContract(false); }}
                    onCancel={() => setAddingContract(false)}
                  />
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Parked section */}
      {parked.length > 0 && (
        <div className="max-w-lg mx-auto px-4 mt-2 mb-4">
          <button
            onClick={() => setShowParked(!showParked)}
            className="flex items-center gap-2 text-sm text-[#78716C] min-h-[44px]"
          >
            <Archive size={14} /> Parked ({parked.length}) {showParked ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showParked && (
            <div className="space-y-2 mt-2">
              {parked.map((c) => {
                const col = ZONE_SOLID[c.zone];
                return (
                  <div key={c.id} className="flex bg-white rounded-xl border border-[#E7E5E4] overflow-hidden opacity-70">
                    <div className="w-1 self-stretch shrink-0" style={{ backgroundColor: col }} />
                    <div className="flex-1 min-w-0 p-3 flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{c.name}</p>
                        <ZoneBadge zone={c.zone} />
                      </div>
                      <button
                        onClick={() => updateConstellation(c.id, { active: true })}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#4F6E5C]"
                        title="Unpark"
                      >
                        <ArchiveRestore size={14} />
                      </button>
                      <button
                        onClick={() => removeConstellation(c.id)}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#B5AFA9]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Bottom action bar — add constellation pinned to thumb height */}
      {!addingConst && !addingContract && !editingConst && !editingContract && (
        <div className="fixed left-0 right-0 z-30" style={{ bottom: "calc(72px + env(safe-area-inset-bottom, 0px))" }}>
          <div className="max-w-lg mx-auto px-4 pb-3 flex gap-2 justify-end">
            <button
              onClick={() => setAddingContract(true)}
              className="flex items-center gap-1.5 text-sm bg-white border border-[#3B5998]/30 text-[#3B5998] rounded-xl px-3 py-2.5 min-h-[44px] shadow-sm hover:bg-[#DBEAFE]"
            >
              <Plus size={14} /> Contract
            </button>
            <button
              onClick={() => setAddingConst(true)}
              className="flex items-center gap-1.5 text-sm text-white rounded-xl px-4 py-2.5 min-h-[44px] shadow-md"
              style={{ backgroundColor: currentZoneColor }}
            >
              <Plus size={16} /> Constellation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
