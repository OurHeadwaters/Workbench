import { useState } from "react";
import { Plus, Trash2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ZONE_LABELS } from "@/lib/utils";
import { ZONE_SOLID } from "@/lib/zone";
import type { Constellation, ZoneId } from "@/types";

const ZONES: ZoneId[] = ["Z0", "Z1", "Z2", "Z3", "Z4", "Z5"];

interface Props {
  initial?: Partial<Constellation>;
  onSave: (data: Omit<Constellation, "id" | "slug" | "colorVar">) => void;
  onCancel: () => void;
}

export function ConstellationForm({ initial, onSave, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(initial?.name ?? "");
  const [zone, setZone] = useState<ZoneId>(initial?.zone ?? "Z3");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [urls, setUrls] = useState<{ label: string; url: string }[]>(
    initial?.urls?.length ? initial.urls : []
  );
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const zoneColor = ZONE_SOLID[zone];

  function addUrl() {
    if (!newUrl.trim()) return;
    setUrls((p) => [...p, { label: newLabel.trim() || "Open", url: newUrl.trim() }]);
    setNewLabel("");
    setNewUrl("");
  }

  function handleSave() {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      zone,
      notes: notes.trim(),
      urls,
      deepLinks: [],
      active: initial?.active ?? true,
    });
  }

  const canNext = step === 0 ? name.trim().length > 0 : true;

  return (
    <div className="bg-white rounded-2xl border border-[#D6D0C7] overflow-hidden shadow-sm">
      <div className="h-1 w-full" style={{ backgroundColor: zoneColor }} />
      <div className="px-4 pt-4 pb-2 flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === step ? 24 : 8,
              backgroundColor: i <= step ? zoneColor : "#E7E5E4",
            }}
          />
        ))}
      </div>

      <div className="px-4 py-3 space-y-3 min-h-[220px]">
        {step === 0 && (
          <>
            <label className="text-sm font-medium">Name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              className="w-full border border-[#E7E5E4] rounded-xl px-3 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{ ["--tw-ring-color" as string]: `${zoneColor}55` }}
            />
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="One-line description (optional)"
              className="w-full border border-[#E7E5E4] rounded-xl px-3 py-3 text-base bg-white focus:outline-none"
            />
            <p className="text-sm font-medium mt-3">Zone</p>
            <div className="flex flex-wrap gap-2">
              {ZONES.map((z) => {
                const selected = zone === z;
                const c = ZONE_SOLID[z];
                return (
                  <button
                    key={z}
                    type="button"
                    onClick={() => setZone(z)}
                    className="px-3 py-2 rounded-xl text-sm border min-h-[44px] transition-all"
                    style={{
                      borderColor: selected ? c : "#E7E5E4",
                      backgroundColor: selected ? `${c}1A` : "white",
                      color: selected ? c : "#44403C",
                      fontWeight: selected ? 600 : 400,
                    }}
                  >
                    {z} — {ZONE_LABELS[z].short === z ? ZONE_LABELS[z].long.split(" / ")[0] : ZONE_LABELS[z].long.split(" / ")[0]}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <label className="text-sm font-medium">Cadence (optional notes)</label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Tue/Thu mornings · ~3h/week"
              className="w-full border border-[#E7E5E4] rounded-xl px-3 py-3 text-base bg-white focus:outline-none"
            />
            <p className="text-xs text-[#78716C]">
              You'll set actual weekly hour targets later as a Contract.
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <label className="text-sm font-medium">Links</label>
            <div className="space-y-2">
              {urls.map((u, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-3 py-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.label}</p>
                    <p className="text-xs text-[#78716C] truncate">{u.url}</p>
                  </div>
                  <button
                    onClick={() => setUrls((p) => p.filter((_, idx) => idx !== i))}
                    className="text-[#B5AFA9] hover:text-[#B45309] min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <div className="flex flex-col gap-2 bg-[#FAFAF9] border border-dashed border-[#D6D0C7] rounded-xl p-2">
                <input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Label (e.g. Open)"
                  className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https:// or /path/"
                    className="flex-1 border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
                  />
                  <button
                    onClick={addUrl}
                    className="px-3 rounded-lg text-white text-sm min-h-[44px] flex items-center gap-1"
                    style={{ backgroundColor: zoneColor }}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-2 p-3 border-t border-[#E7E5E4] bg-[#FAFAF9]">
        {step === 0 ? (
          <button
            onClick={onCancel}
            className="flex-1 border border-[#D6D0C7] rounded-xl py-3 text-sm min-h-[48px] hover:bg-white transition-colors"
          >
            Cancel
          </button>
        ) : (
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="flex-1 border border-[#D6D0C7] rounded-xl py-3 text-sm min-h-[48px] hover:bg-white transition-colors flex items-center justify-center gap-1"
          >
            <ChevronLeft size={16} /> Back
          </button>
        )}
        {step < 2 ? (
          <button
            onClick={() => canNext && setStep((s) => Math.min(2, s + 1))}
            disabled={!canNext}
            className={cn(
              "flex-1 rounded-xl py-3 text-sm min-h-[48px] flex items-center justify-center gap-1 text-white transition-colors",
              !canNext && "opacity-50 cursor-not-allowed"
            )}
            style={{ backgroundColor: zoneColor }}
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className={cn(
              "flex-1 rounded-xl py-3 text-sm min-h-[48px] flex items-center justify-center gap-1 text-white transition-colors",
              !name.trim() && "opacity-50 cursor-not-allowed"
            )}
            style={{ backgroundColor: zoneColor }}
          >
            <Check size={16} /> Save
          </button>
        )}
      </div>
    </div>
  );
}
