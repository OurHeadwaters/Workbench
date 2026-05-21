import { useState, useRef } from "react";
import { Plus, Pencil, Trash2, Archive, ArchiveRestore, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { useStore, ZONE_COLORS } from "@/store";
import { ZoneBadge } from "@/components/ZoneBadge";
import { ZONE_LABELS, ZONE_CLASSES, cn } from "@/lib/utils";
import type { ZoneId, Constellation, Contract } from "@/types";

const ZONES: ZoneId[] = ["Z0", "Z1", "Z2", "Z3", "Z4", "Z5"];

const ZONE_SOLID: Record<ZoneId, string> = {
  Z0: "#8A6A1A",
  Z1: "#4F6E5C",
  Z2: "#3B5998",
  Z3: "#7C4E8A",
  Z4: "#B45309",
  Z5: "#4A6272",
};

function ConstellationForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Constellation>;
  onSave: (data: Omit<Constellation, "id" | "slug" | "colorVar">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [zone, setZone] = useState<ZoneId>(initial?.zone ?? "Z3");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [urls, setUrls] = useState<{ label: string; url: string }[]>(
    initial?.urls?.length ? initial.urls : [{ label: "", url: "" }]
  );

  function setUrlEntry(i: number, field: "label" | "url", value: string) {
    setUrls((prev) => prev.map((u, idx) => idx === i ? { ...u, [field]: value } : u));
  }

  function handleSave() {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      zone,
      notes: notes.trim(),
      urls: urls.filter((u) => u.url.trim()),
      deepLinks: [],
      active: initial?.active ?? true,
    });
  }

  return (
    <div className="bg-[#F5F0E8] rounded-xl p-4 space-y-3 border border-[#D6D0C7]">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project name"
        className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30 focus:border-[#8A6A1A]/50"
      />
      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="One-line description (optional)"
        className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30 focus:border-[#8A6A1A]/50"
      />
      <select
        value={zone}
        onChange={(e) => setZone(e.target.value as ZoneId)}
        className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none min-h-[44px]"
      >
        {ZONES.map((z) => (
          <option key={z} value={z}>{z} — {ZONE_LABELS[z].long}</option>
        ))}
      </select>
      <div className="space-y-2">
        <p className="text-xs font-medium text-[#78716C]">URLs / Links</p>
        {urls.map((u, i) => (
          <div key={i} className="flex gap-1.5 items-center">
            <input
              value={u.label}
              onChange={(e) => setUrlEntry(i, "label", e.target.value)}
              placeholder="Label"
              className="w-24 shrink-0 border border-[#E7E5E4] rounded-lg px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30"
            />
            <input
              value={u.url}
              onChange={(e) => setUrlEntry(i, "url", e.target.value)}
              placeholder="https:// or /path/"
              className="flex-1 min-w-0 border border-[#E7E5E4] rounded-lg px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30"
            />
            <button
              onClick={() => setUrls((prev) => prev.length === 1 ? [{ label: "", url: "" }] : prev.filter((_, idx) => idx !== i))}
              className="shrink-0 text-[#78716C] hover:text-[#1C1917] p-1"
              title="Remove"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={() => setUrls((prev) => [...prev, { label: "", url: "" }])}
          className="flex items-center gap-1 text-xs text-[#8A6A1A] hover:text-[#6A4E10] font-medium py-1"
        >
          <Plus size={12} /> Add URL
        </button>
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 border border-[#D6D0C7] rounded-lg py-2 text-sm min-h-[44px] hover:bg-white transition-colors">Cancel</button>
        <button onClick={handleSave} className="flex-1 bg-[#1C1917] text-white rounded-lg py-2 text-sm min-h-[44px] hover:bg-[#2C2420] transition-colors">Save</button>
      </div>
    </div>
  );
}

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
        className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3B5998]/30"
      />
      <select
        value={cId}
        onChange={(e) => setCId(e.target.value)}
        className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none min-h-[44px]"
      >
        {constellations.map((c) => (
          <option key={c.id} value={c.id}>{c.name} ({c.zone})</option>
        ))}
      </select>
      <div className="flex items-center gap-2">
        <input
          type="number" min="0.25" step="0.25" value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="w-24 border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
        />
        <span className="text-sm text-[#78716C]">hours / week target</span>
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 border border-[#D6D0C7] rounded-lg py-2 text-sm min-h-[44px] hover:bg-white transition-colors">Cancel</button>
        <button onClick={handleSave} className="flex-1 bg-[#1C1917] text-white rounded-lg py-2 text-sm min-h-[44px] hover:bg-[#2C2420] transition-colors">Save</button>
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
  const setZoneRanking = useStore((s) => s.setZoneRanking);

  const [addingTo, setAddingTo] = useState<ZoneId | null>(null);
  const [editingConst, setEditingConst] = useState<string | null>(null);
  const [addingContract, setAddingContract] = useState<ZoneId | null>(null);
  const [editingContract, setEditingContract] = useState<string | null>(null);
  const [showParked, setShowParked] = useState(false);

  const ranked = [...zoneRanking];
  function moveZone(z: ZoneId, dir: -1 | 1) {
    const idx = ranked.indexOf(z);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= ranked.length) return;
    const next = [...ranked];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    setZoneRanking(next);
  }

  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const zoneRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragStartY = useRef<number>(0);
  const dragActive = useRef(false);

  function commitDrop(from: number, to: number) {
    if (from === to) return;
    const next = [...ranked];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setZoneRanking(next);
  }

  function findRowAt(clientY: number): number | null {
    for (let i = 0; i < zoneRowRefs.current.length; i++) {
      const el = zoneRowRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom) return i;
    }
    return null;
  }

  function handleGripPointerDown(e: React.PointerEvent, idx: number) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStartY.current = e.clientY;
    dragActive.current = false;
    setDragIdx(idx);
    setOverIdx(idx);
  }

  function handleGripPointerMove(e: React.PointerEvent) {
    if (dragIdx === null) return;
    if (!dragActive.current) {
      if (Math.abs(e.clientY - dragStartY.current) < 8) return;
      dragActive.current = true;
    }
    e.preventDefault();
    const hit = findRowAt(e.clientY);
    if (hit !== null) setOverIdx(hit);
  }

  function handleGripPointerUp() {
    if (dragIdx !== null && overIdx !== null && dragActive.current) {
      commitDrop(dragIdx, overIdx);
    }
    setDragIdx(null);
    setOverIdx(null);
    dragActive.current = false;
  }

  function handleGripPointerCancel() {
    setDragIdx(null);
    setOverIdx(null);
    dragActive.current = false;
  }

  const parked = constellations.filter((c) => !c.active);

  return (
    <div className="min-h-dvh pb-24" style={{ background: "linear-gradient(180deg, #FAFAF9 0%, #F5F0E8 100%)" }}>
      <div className="px-5 py-7 max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-2xl mb-1">Zones</h1>
          <p className="text-sm text-[#78716C]">Your constellations by zone — drag to reorder zone priority.</p>
        </div>

        {ranked.map((zone, zIdx) => {
          const zoneConstellations = constellations.filter((c) => c.zone === zone && c.active);
          const zoneContracts = contracts.filter((c) =>
            zoneConstellations.some((co) => co.id === c.constellationId) && c.active
          );
          const isDragging = dragIdx === zIdx;
          const isOver = overIdx === zIdx && dragIdx !== null && dragIdx !== zIdx;
          const zoneColor = ZONE_SOLID[zone] ?? "#78716C";
          return (
            <div
              key={zone}
              ref={(el) => { zoneRowRefs.current[zIdx] = el; }}
              className={cn(
                "space-y-2 rounded-xl transition-all duration-150",
                isDragging && "opacity-40 scale-[0.98]",
                isOver && "ring-2 ring-offset-1 bg-[#F5F0E8]"
              )}
              style={isOver ? { ringColor: zoneColor } : undefined}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center min-h-[44px] min-w-[44px] cursor-grab active:cursor-grabbing touch-none select-none text-[#B5AFA9] hover:text-[#78716C] transition-colors"
                    aria-label="Drag to reorder zone"
                    onPointerDown={(e) => handleGripPointerDown(e, zIdx)}
                    onPointerMove={handleGripPointerMove}
                    onPointerUp={handleGripPointerUp}
                    onPointerCancel={handleGripPointerCancel}
                  >
                    <GripVertical size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveZone(zone, -1)} disabled={zIdx === 0} className="text-[#B5AFA9] disabled:opacity-30 min-h-[22px] min-w-[22px] flex items-center justify-center hover:text-[#78716C] transition-colors" aria-label="Move up">
                      <ChevronUp size={14} />
                    </button>
                    <button onClick={() => moveZone(zone, 1)} disabled={zIdx === ranked.length - 1} className="text-[#B5AFA9] disabled:opacity-30 min-h-[22px] min-w-[22px] flex items-center justify-center hover:text-[#78716C] transition-colors" aria-label="Move down">
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-8 rounded-full flex-shrink-0"
                      style={{ backgroundColor: zoneColor, opacity: 0.7 }}
                    />
                    <div>
                      <h2 className="text-base font-medium">{zone} — {ZONE_LABELS[zone].long}</h2>
                      <p className="text-xs text-[#78716C]">{ZONE_LABELS[zone].desc}</p>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-[#B5AFA9] tabular-nums">#{zIdx + 1}</span>
              </div>

              <div className="space-y-2 pl-12">
                {zoneConstellations.map((c) => (
                  <div key={c.id}>
                    {editingConst === c.id ? (
                      <ConstellationForm
                        initial={c}
                        onSave={(data) => { updateConstellation(c.id, data); setEditingConst(null); }}
                        onCancel={() => setEditingConst(null)}
                      />
                    ) : (
                      <div
                        className="flex items-center gap-0 bg-white rounded-xl border border-[#E7E5E4] overflow-hidden hover:shadow-sm transition-shadow"
                      >
                        <div
                          className="w-1 self-stretch flex-shrink-0"
                          style={{ backgroundColor: zoneColor }}
                        />
                        <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-2.5">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{c.name}</p>
                            {c.notes && <p className="text-xs text-[#78716C]">{c.notes}</p>}
                            {c.urls?.length > 0 && <p className="text-xs text-[#B5AFA9]">{c.urls[0].url}{c.urls.length > 1 ? ` +${c.urls.length - 1} more` : ""}</p>}
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => updateConstellation(c.id, { active: false })} className="p-1.5 text-[#B5AFA9] hover:text-[#B45309] min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors" title="Park">
                              <Archive size={14} />
                            </button>
                            <button onClick={() => setEditingConst(c.id)} className="p-1.5 text-[#B5AFA9] hover:text-[#1C1917] min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => removeConstellation(c.id)} className="p-1.5 text-[#B5AFA9] hover:text-[#B45309] min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors">
                              <Trash2 size={14} />
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
                      <div className="flex items-center gap-0 rounded-xl border border-[#3B5998]/20 overflow-hidden hover:shadow-sm transition-shadow" style={{ background: "#DBEAFE" }}>
                        <div className="w-1 self-stretch flex-shrink-0 bg-[#3B5998]" />
                        <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-2.5 ml-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#3B5998]">📋 {ct.name}</p>
                            <p className="text-xs text-[#3B5998]/70">{ct.weeklyHourTarget}h/week</p>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => setEditingContract(ct.id)} className="min-h-[44px] min-w-[44px] flex items-center justify-center">
                              <Pencil size={12} className="text-[#3B5998]" />
                            </button>
                            <button onClick={() => removeContract(ct.id)} className="min-h-[44px] min-w-[44px] flex items-center justify-center">
                              <Trash2 size={12} className="text-[#3B5998]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {addingTo === zone ? (
                  <ConstellationForm
                    initial={{ zone }}
                    onSave={(data) => { addConstellation(data); setAddingTo(null); }}
                    onCancel={() => setAddingTo(null)}
                  />
                ) : addingContract === zone ? (
                  <ContractForm
                    constellations={zoneConstellations}
                    onSave={(data) => { addContract(data); setAddingContract(null); }}
                    onCancel={() => setAddingContract(null)}
                  />
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAddingTo(zone)}
                      className="flex items-center gap-1 text-xs text-[#78716C] border border-dashed border-[#D6D0C7] rounded-lg px-3 py-1.5 min-h-[44px] hover:bg-white hover:border-[#B5AFA9] transition-all"
                    >
                      <Plus size={12} /> Constellation
                    </button>
                    <button
                      onClick={() => setAddingContract(zone)}
                      className="flex items-center gap-1 text-xs text-[#3B5998] border border-dashed border-[#3B5998]/30 rounded-lg px-3 py-1.5 min-h-[44px] hover:bg-[#DBEAFE] transition-colors"
                    >
                      <Plus size={12} /> Contract
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {parked.length > 0 && (
          <div>
            <button
              onClick={() => setShowParked(!showParked)}
              className="flex items-center gap-2 text-sm text-[#78716C] min-h-[44px] hover:text-[#44403C] transition-colors"
            >
              <Archive size={14} /> Parked ({parked.length}) {showParked ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showParked && (
              <div className="space-y-2 mt-2">
                {parked.map((c) => {
                  const zoneColor = ZONE_SOLID[c.zone] ?? "#78716C";
                  return (
                    <div key={c.id} className="flex items-center gap-0 bg-white rounded-xl border border-[#E7E5E4] overflow-hidden opacity-50 hover:opacity-70 transition-opacity">
                      <div className="w-1 self-stretch flex-shrink-0" style={{ backgroundColor: zoneColor }} />
                      <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-2.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{c.name}</p>
                          <ZoneBadge zone={c.zone} />
                        </div>
                        <button onClick={() => updateConstellation(c.id, { active: true })} className="p-2 text-[#4F6E5C] min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-[#2D4D3A] transition-colors" title="Unpark">
                          <ArchiveRestore size={14} />
                        </button>
                        <button onClick={() => removeConstellation(c.id)} className="p-2 text-[#B5AFA9] hover:text-[#B45309] min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors">
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
      </div>
    </div>
  );
}
