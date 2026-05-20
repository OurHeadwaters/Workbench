import { useState, useRef } from "react";
import { Plus, Pencil, Trash2, Archive, ArchiveRestore, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { useStore, ZONE_COLORS } from "@/store";
import { ZoneBadge } from "@/components/ZoneBadge";
import { ZONE_LABELS, cn } from "@/lib/utils";
import type { ZoneId, Constellation, Contract } from "@/types";

const ZONES: ZoneId[] = ["Z1", "Z2", "Z3", "Z4"];

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
  const [url, setUrl] = useState(initial?.url ?? "");

  function handleSave() {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      zone,
      notes: notes.trim(),
      url: url.trim() || undefined,
      deepLinks: initial?.deepLinks ?? [],
      active: initial?.active ?? true,
    });
  }

  return (
    <div className="bg-[#F5F5F0] rounded-xl p-4 space-y-3">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project name"
        className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
      />
      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="One-line description (optional)"
        className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL (optional, e.g. /gather/)"
        className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
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
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 border border-[#E7E5E4] rounded-lg py-2 text-sm min-h-[44px]">Cancel</button>
        <button onClick={handleSave} className="flex-1 bg-[#1C1917] text-white rounded-lg py-2 text-sm min-h-[44px]">Save</button>
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
    <div className="bg-[#F5F5F0] rounded-xl p-4 space-y-3">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Contract name"
        className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
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
        <button onClick={onCancel} className="flex-1 border border-[#E7E5E4] rounded-lg py-2 text-sm min-h-[44px]">Cancel</button>
        <button onClick={handleSave} className="flex-1 bg-[#1C1917] text-white rounded-lg py-2 text-sm min-h-[44px]">Save</button>
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
    <div className="min-h-dvh bg-[#FAFAF9] pb-24">
      <div className="px-5 py-6 max-w-lg mx-auto space-y-6">
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
          return (
            <div
              key={zone}
              ref={(el) => { zoneRowRefs.current[zIdx] = el; }}
              className={cn(
                "space-y-2 rounded-xl transition-colors",
                isDragging && "opacity-40",
                isOver && "ring-2 ring-[#1C1917] bg-[#F5F5F0]"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center min-h-[44px] min-w-[44px] cursor-grab active:cursor-grabbing touch-none text-[#78716C] select-none"
                    aria-label="Drag to reorder zone"
                    onPointerDown={(e) => handleGripPointerDown(e, zIdx)}
                    onPointerMove={handleGripPointerMove}
                    onPointerUp={handleGripPointerUp}
                    onPointerCancel={handleGripPointerCancel}
                  >
                    <GripVertical size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveZone(zone, -1)} disabled={zIdx === 0} className="text-[#78716C] disabled:opacity-30 min-h-[22px] min-w-[22px] flex items-center justify-center" aria-label="Move up">
                      <ChevronUp size={14} />
                    </button>
                    <button onClick={() => moveZone(zone, 1)} disabled={zIdx === ranked.length - 1} className="text-[#78716C] disabled:opacity-30 min-h-[22px] min-w-[22px] flex items-center justify-center" aria-label="Move down">
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-base font-medium">{zone} — {ZONE_LABELS[zone].long}</h2>
                    <p className="text-xs text-[#78716C]">{ZONE_LABELS[zone].desc}</p>
                  </div>
                </div>
                <span className="text-xs text-[#78716C]">#{zIdx + 1}</span>
              </div>

              <div className="space-y-2 pl-6">
                {zoneConstellations.map((c) => (
                  <div key={c.id}>
                    {editingConst === c.id ? (
                      <ConstellationForm
                        initial={c}
                        onSave={(data) => { updateConstellation(c.id, data); setEditingConst(null); }}
                        onCancel={() => setEditingConst(null)}
                      />
                    ) : (
                      <div className="flex items-center gap-2 bg-white rounded-xl border border-[#E7E5E4] px-3 py-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{c.name}</p>
                          {c.notes && <p className="text-xs text-[#78716C]">{c.notes}</p>}
                          {c.url && <p className="text-xs text-[#78716C]">{c.url}</p>}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => updateConstellation(c.id, { active: false })} className="p-1.5 text-[#78716C] hover:text-[#B45309] min-h-[44px] min-w-[44px] flex items-center justify-center" title="Park">
                            <Archive size={14} />
                          </button>
                          <button onClick={() => setEditingConst(c.id)} className="p-1.5 text-[#78716C] hover:text-[#1C1917] min-h-[44px] min-w-[44px] flex items-center justify-center">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => removeConstellation(c.id)} className="p-1.5 text-[#78716C] hover:text-[#B45309] min-h-[44px] min-w-[44px] flex items-center justify-center">
                            <Trash2 size={14} />
                          </button>
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
                      <div className="flex items-center gap-2 bg-[#DBEAFE] rounded-xl border border-[#3B5998]/20 px-3 py-2 ml-2">
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
                      className="flex items-center gap-1 text-xs text-[#78716C] border border-dashed border-[#E7E5E4] rounded-lg px-3 py-1.5 min-h-[44px] hover:bg-white"
                    >
                      <Plus size={12} /> Constellation
                    </button>
                    <button
                      onClick={() => setAddingContract(zone)}
                      className="flex items-center gap-1 text-xs text-[#3B5998] border border-dashed border-[#3B5998]/30 rounded-lg px-3 py-1.5 min-h-[44px] hover:bg-[#DBEAFE]"
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
              className="flex items-center gap-2 text-sm text-[#78716C] min-h-[44px]"
            >
              <Archive size={14} /> Parked ({parked.length}) {showParked ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showParked && (
              <div className="space-y-2 mt-2">
                {parked.map((c) => (
                  <div key={c.id} className="flex items-center gap-2 bg-white rounded-xl border border-[#E7E5E4] px-3 py-2 opacity-60">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{c.name}</p>
                      <ZoneBadge zone={c.zone} />
                    </div>
                    <button onClick={() => updateConstellation(c.id, { active: true })} className="p-2 text-[#4F6E5C] min-h-[44px] min-w-[44px] flex items-center justify-center" title="Unpark">
                      <ArchiveRestore size={14} />
                    </button>
                    <button onClick={() => removeConstellation(c.id)} className="p-2 text-[#78716C] hover:text-[#B45309] min-h-[44px] min-w-[44px] flex items-center justify-center">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
