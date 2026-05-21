import { useState } from "react";
import { Star, ArrowRight, Plus, Trash2, ChevronDown } from "lucide-react";
import { useStore } from "@/store";
import { ZoneBadge } from "@/components/ZoneBadge";
import { cn } from "@/lib/utils";
import type { ZoneId, Constellation } from "@/types";

const STEPS = ["Welcome", "Constellations", "Contracts", "Who", "Why & No-fly"];

function StepDots({ current }: { current: number }) {
  return (
    <div className="flex gap-2 justify-center mb-8">
      {STEPS.map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-full transition-all",
            i === current ? "w-6 h-2 bg-[#1C1917]" : "w-2 h-2 bg-[#E7E5E4]"
          )}
        />
      ))}
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-6 py-8">
      <div className="w-16 h-16 rounded-full bg-[#8A6A1A] flex items-center justify-center shadow-md">
        <Star size={28} className="text-[#FEF3C7]" fill="#FEF3C7" />
      </div>
      <div>
        <h1 className="text-3xl mb-3">North Star</h1>
        <p className="text-[#44403C] text-base leading-relaxed max-w-xs">
          A personal operating system for multi-project work — built around the Codetry zone model.
        </p>
      </div>
      <div className="text-left bg-[#F5F0E8] rounded-xl p-4 w-full max-w-sm space-y-2">
        <p className="text-sm font-medium">Start with what you're already building.</p>
        <p className="text-sm text-[#44403C]">
          Your projects are pre-loaded. We'll walk through them together, then set your north star statement.
        </p>
      </div>
      <button
        onClick={onNext}
        className="flex items-center gap-2 bg-[#1C1917] text-white px-6 py-3 rounded-xl text-sm font-medium min-h-[44px]"
      >
        Let's go <ArrowRight size={16} />
      </button>
    </div>
  );
}

const ALL_ZONES: { id: ZoneId; label: string }[] = [
  { id: "Z0", label: "Z0 — Center / The Practitioner" },
  { id: "Z1", label: "Z1 — Household / Afloat (income-generating)" },
  { id: "Z2", label: "Z2 — Circle / Paid contract" },
  { id: "Z3", label: "Z3 — Home Range / Build now" },
  { id: "Z4", label: "Z4 — Community / Passion" },
  { id: "Z5", label: "Z5 — Wild / Long Horizon" },
];

function ConstellationInlineForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Constellation>;
  onSave: (data: { name: string; zone: ZoneId; notes: string; url: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [zone, setZone] = useState<ZoneId>(initial?.zone ?? "Z3");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");

  return (
    <div className="bg-[#F5F0E8] rounded-xl p-4 space-y-3">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project name"
        className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30"
      />
      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="One-line description (optional)"
        className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30"
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL (optional, e.g. /codetry or https://...)"
        className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30"
      />
      <select
        value={zone}
        onChange={(e) => setZone(e.target.value as ZoneId)}
        className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30 min-h-[44px]"
      >
        {ALL_ZONES.map((z) => (
          <option key={z.id} value={z.id}>{z.label}</option>
        ))}
      </select>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 border border-[#E7E5E4] rounded-lg py-2 text-sm min-h-[44px]">Cancel</button>
        <button
          onClick={() => { if (name.trim()) onSave({ name: name.trim(), zone, notes: notes.trim(), url: url.trim() }); }}
          className="flex-1 bg-[#1C1917] text-white rounded-lg py-2 text-sm min-h-[44px]"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function ConstellationsStep({ onNext }: { onNext: () => void }) {
  const constellations = useStore((s) => s.constellations);
  const addConstellation = useStore((s) => s.addConstellation);
  const removeConstellation = useStore((s) => s.removeConstellation);
  const updateConstellation = useStore((s) => s.updateConstellation);

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl mb-1">Your constellations</h2>
        <p className="text-sm text-[#78716C]">These are your active projects — each tagged to a zone. Edit any to set its zone, URL, or description.</p>
      </div>

      <div className="space-y-2">
        {constellations.map((c) =>
          editingId === c.id ? (
            <ConstellationInlineForm
              key={c.id}
              initial={c}
              onSave={({ name, zone, notes, url }) => {
                updateConstellation(c.id, { name, zone, notes, url: url || undefined });
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div key={c.id} className="flex items-center gap-3 bg-white rounded-xl border border-[#E7E5E4] p-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.name}</p>
                {c.notes && <p className="text-xs text-[#78716C] truncate">{c.notes}</p>}
                {c.url && <p className="text-xs text-[#78716C] truncate">{c.url}</p>}
                <ZoneBadge zone={c.zone} className="mt-1" />
              </div>
              <button
                onClick={() => setEditingId(c.id)}
                className="p-2 text-[#78716C] hover:text-[#1C1917] min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Edit"
              >
                <ChevronDown size={14} className="rotate-[-90deg]" />
              </button>
              <button
                onClick={() => removeConstellation(c.id)}
                className="p-2 text-[#78716C] hover:text-[#B45309] min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )
        )}
      </div>

      {adding ? (
        <ConstellationInlineForm
          onSave={({ name, zone, notes, url }) => {
            addConstellation({ name, zone, notes, url: url || undefined, deepLinks: [], active: true });
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 text-sm text-[#44403C] border border-dashed border-[#E7E5E4] rounded-xl px-4 py-3 min-h-[44px] hover:bg-[#F5F0E8]"
        >
          <Plus size={16} /> Add a constellation
        </button>
      )}

      <button
        onClick={onNext}
        className="flex items-center justify-center gap-2 bg-[#1C1917] text-white px-6 py-3 rounded-xl text-sm font-medium min-h-[44px] mt-2"
      >
        Continue <ArrowRight size={16} />
      </button>
    </div>
  );
}

function ContractsStep({ onNext }: { onNext: () => void }) {
  const constellations = useStore((s) => s.constellations);
  const contracts = useStore((s) => s.contracts);
  const addContract = useStore((s) => s.addContract);
  const removeContract = useStore((s) => s.removeContract);

  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [constellationId, setConstellationId] = useState(constellations[0]?.id ?? "");
  const [weeklyHours, setWeeklyHours] = useState("10");

  function handleAdd() {
    if (!name.trim() || !constellationId) return;
    addContract({ name: name.trim(), constellationId, weeklyHourTarget: parseFloat(weeklyHours) || 0, active: true });
    setName("");
    setAdding(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl mb-1">Paid contracts</h2>
        <p className="text-sm text-[#78716C]">
          Optional. Add any paid work with a weekly hour target. North Star will remind you when passion projects crowd out contract hours.
        </p>
      </div>

      {contracts.length > 0 && (
        <div className="space-y-2">
          {contracts.map((c) => {
            const constellation = constellations.find((co) => co.id === c.constellationId);
            return (
              <div key={c.id} className="flex items-center gap-3 bg-white rounded-xl border border-[#E7E5E4] p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-[#78716C]">{constellation?.name} · {c.weeklyHourTarget}h/week target</p>
                </div>
                <button onClick={() => removeContract(c.id)} className="p-2 text-[#78716C] hover:text-[#B45309] min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {adding ? (
        <div className="bg-[#F5F0E8] rounded-xl p-4 space-y-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contract name"
            className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30"
          />
          <select
            value={constellationId}
            onChange={(e) => setConstellationId(e.target.value)}
            className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30 min-h-[44px]"
          >
            {constellations.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0.25"
              step="0.25"
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(e.target.value)}
              className="w-24 border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30"
            />
            <span className="text-sm text-[#78716C]">hours / week target</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setAdding(false)} className="flex-1 border border-[#E7E5E4] rounded-lg py-2 text-sm min-h-[44px]">Cancel</button>
            <button onClick={handleAdd} className="flex-1 bg-[#1C1917] text-white rounded-lg py-2 text-sm min-h-[44px]">Add</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 text-sm text-[#44403C] border border-dashed border-[#E7E5E4] rounded-xl px-4 py-3 min-h-[44px] hover:bg-[#F5F0E8]"
        >
          <Plus size={16} /> Add a contract
        </button>
      )}

      <div className="flex gap-3 mt-2">
        <button onClick={onNext} className="text-sm text-[#78716C] min-h-[44px] px-3">Skip</button>
        <button onClick={onNext} className="flex-1 flex items-center justify-center gap-2 bg-[#1C1917] text-white px-6 py-3 rounded-xl text-sm font-medium min-h-[44px]">
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function WhoStep({ onNext }: { onNext: () => void }) {
  const statement = useStore((s) => s.statement);
  const setStatement = useStore((s) => s.setStatement);
  const [who, setWho] = useState(statement?.who ?? "");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl mb-1">Who is this work for?</h2>
        <p className="text-sm text-[#78716C]">
          Describe a specific kind of person — the one your work most serves. This becomes part of your north star statement.
        </p>
      </div>
      <div>
        <label className="text-sm font-medium block mb-2">I do this work for…</label>
        <textarea
          autoFocus
          value={who}
          onChange={(e) => setWho(e.target.value)}
          placeholder="e.g. Rural entrepreneurs building cooperatives in northern communities"
          rows={3}
          className="w-full border border-[#E7E5E4] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30 resize-none"
        />
      </div>
      <div className="flex gap-3 mt-2">
        <button
          onClick={() => { onNext(); }}
          className="text-sm text-[#78716C] min-h-[44px] px-3"
        >
          Skip
        </button>
        <button
          onClick={() => {
            if (who.trim()) {
              setStatement({ who: who.trim(), why: statement?.why ?? "", noFly: statement?.noFly ?? "" });
            }
            onNext();
          }}
          className="flex-1 flex items-center justify-center gap-2 bg-[#1C1917] text-white px-6 py-3 rounded-xl text-sm font-medium min-h-[44px]"
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function WhyStep({ onFinish }: { onFinish: () => void }) {
  const statement = useStore((s) => s.statement);
  const setStatement = useStore((s) => s.setStatement);
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [why, setWhy] = useState(statement?.why ?? "");
  const [noFly, setNoFly] = useState(statement?.noFly ?? "");

  function handleFinish() {
    if (why.trim() || noFly.trim()) {
      setStatement({ who: statement?.who ?? "", why: why.trim(), noFly: noFly.trim() });
    }
    completeOnboarding();
    onFinish();
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl mb-1">Why & no-fly</h2>
        <p className="text-sm text-[#78716C]">
          Complete your north star statement. These anchor you when deciding what to say yes or no to.
        </p>
      </div>
      <div>
        <label className="text-sm font-medium block mb-2">So that…</label>
        <textarea
          autoFocus
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          placeholder="e.g. they can build locally-owned economic infrastructure without outside dependency"
          rows={3}
          className="w-full border border-[#E7E5E4] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30 resize-none"
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-2">I will politely decline…</label>
        <textarea
          value={noFly}
          onChange={(e) => setNoFly(e.target.value)}
          placeholder="e.g. work that requires long-term presence outside my home territory"
          rows={2}
          className="w-full border border-[#E7E5E4] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30 resize-none"
        />
      </div>
      <div className="flex gap-3 mt-2">
        <button onClick={handleFinish} className="text-sm text-[#78716C] min-h-[44px] px-3">Skip</button>
        <button
          onClick={handleFinish}
          className="flex-1 flex items-center justify-center gap-2 bg-[#1C1917] text-white px-6 py-3 rounded-xl text-sm font-medium min-h-[44px]"
        >
          Start using North Star <Star size={16} />
        </button>
      </div>
    </div>
  );
}

export function OnboardingPage() {
  const [step, setStep] = useState(0);
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

  function finish() {
    completeOnboarding();
    window.location.replace(`${BASE}/`);
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#FAFAF9] to-[#F5F0E8] flex flex-col">
      <div className="flex-1 px-5 py-8 max-w-lg mx-auto w-full">
        <StepDots current={step} />

        {step === 0 && <WelcomeStep onNext={() => setStep(1)} />}
        {step === 1 && <ConstellationsStep onNext={() => setStep(2)} />}
        {step === 2 && <ContractsStep onNext={() => setStep(3)} />}
        {step === 3 && <WhoStep onNext={() => setStep(4)} />}
        {step === 4 && <WhyStep onFinish={finish} />}
      </div>
    </div>
  );
}
