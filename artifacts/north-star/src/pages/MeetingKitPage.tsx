import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Archive, Edit2, Check, X, Printer, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

type OrgRecord = {
  id: string;
  name: string;
  cadence: string;
  attendeeRoles: string;
  statedPurpose: string;
  painPoints: string;
  createdAt: string;
  updatedAt: string;
};

type ChecklistAnswer = {
  promptId: string;
  answer: string;
  priority: "high" | "medium" | "low" | "";
};

type LeverageEntry = {
  id: string;
  orgId: string;
  category: "wage" | "role" | "dependency" | "quiet-solution" | "other";
  note: string;
  archived: boolean;
  createdAt: string;
};

type BriefOverrides = {
  orgId: string;
  customPainPoints: string;
  customLeverage: string;
  customNext: string;
  editorNote: string;
};

type AgendaItem = {
  id: string;
  text: string;
  guestSeatIndex: 0 | 1 | 2 | null;
};

type GuestSeat = {
  index: 0 | 1 | 2;
  name: string;
  role: string;
  expertise: string;
  confirmed: boolean;
};

type GateProfessional = {
  name: string;
  role: string;
  industry: string;
  regulatoryBody: string;
  holds: string;
};

type TableConfig = {
  orgId: string;
  agendaItems: AgendaItem[];
  agendaSynthesis: string;
  gateProfessional: GateProfessional;
  guestSeats: GuestSeat[];
  agendaFinalized: boolean;
};

const EMPTY_TABLE_CONFIG = (orgId: string): TableConfig => ({
  orgId,
  agendaItems: [],
  agendaSynthesis: "",
  gateProfessional: { name: "", role: "", industry: "", regulatoryBody: "", holds: "" },
  guestSeats: [
    { index: 0, name: "", role: "", expertise: "", confirmed: false },
    { index: 1, name: "", role: "", expertise: "", confirmed: false },
    { index: 2, name: "", role: "", expertise: "", confirmed: false },
  ],
  agendaFinalized: false,
});

// ── Storage keys ───────────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  orgs: "meeting-kit-orgs",
  checklist: "meeting-kit-checklist",
  leverage: "meeting-kit-leverage",
  activeOrg: "meeting-kit-active-org",
  briefOverrides: "meeting-kit-brief-overrides",
  tableConfig: "meeting-kit-table-config",
};

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ── Checklist prompts ──────────────────────────────────────────────────────────

const CHECKLIST_PROMPTS = [
  {
    id: "time-1",
    category: "Time Leaks",
    prompt: "Where does the meeting consistently run long or stall? What topic or person causes it?",
    hint: "Note the pattern in the org's own words — don't diagnose yet.",
  },
  {
    id: "time-2",
    category: "Time Leaks",
    prompt: "Which agenda items get deferred week after week without resolution?",
    hint: "These are often where the real blockage lives.",
  },
  {
    id: "capacity-1",
    category: "Capacity Gaps",
    prompt: "Who in the room is visibly carrying more than their role should require? What are they covering for?",
    hint: "Watch for the person who does the prep, the follow-up, and the minutes.",
  },
  {
    id: "capacity-2",
    category: "Capacity Gaps",
    prompt: "What decisions keep getting sent back for more information? Who has that information and why isn't it in the room?",
    hint: "This gap is often a system problem, not a people problem.",
  },
  {
    id: "economic-1",
    category: "Economic Pressure",
    prompt: "Are wages or compensation for staff/members keeping up with the cost of living in this community? By how much are they falling behind?",
    hint: "Even if not said directly, this shapes everything else on the table.",
  },
  {
    id: "economic-2",
    category: "Economic Pressure",
    prompt: "Which roles have turned over in the last 12–18 months? What was the stated reason vs. the real reason?",
    hint: "Attrition is the clearest signal of economic stress in a system.",
  },
  {
    id: "vulnerable-1",
    category: "Vulnerable Dependencies",
    prompt: "Who in this community depends on this organization's services or decisions in ways they can't easily replace?",
    hint: "Elders, children's programs, single-income households, remote members.",
  },
  {
    id: "vulnerable-2",
    category: "Vulnerable Dependencies",
    prompt: "If this organization reduced service by 20% tomorrow, who feels it first? How fast?",
    hint: "This frames the stakes — and the pace at which change must happen.",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Time Leaks": "bg-amber-50 border-amber-200 text-amber-800",
  "Capacity Gaps": "bg-blue-50 border-blue-200 text-blue-800",
  "Economic Pressure": "bg-red-50 border-red-200 text-red-800",
  "Vulnerable Dependencies": "bg-emerald-50 border-emerald-200 text-emerald-800",
};

const LEVERAGE_CATEGORIES = [
  { id: "wage", label: "Wage Pressure", color: "text-red-700 bg-red-50" },
  { id: "role", label: "Role Attrition", color: "text-orange-700 bg-orange-50" },
  { id: "dependency", label: "Vulnerable Dependency", color: "text-emerald-700 bg-emerald-50" },
  { id: "quiet-solution", label: "Quiet Solution", color: "text-blue-700 bg-blue-50" },
  { id: "other", label: "Other", color: "text-stone-600 bg-stone-50" },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function OrgSelector({
  orgs,
  activeId,
  onSelect,
  onNew,
}: {
  orgs: OrgRecord[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {orgs.map((org) => (
        <button
          key={org.id}
          onClick={() => onSelect(org.id)}
          className={cn(
            "shrink-0 px-3 py-1.5 rounded-full text-sm border transition-all",
            activeId === org.id
              ? "bg-[#1C1917] text-white border-[#1C1917]"
              : "bg-white text-[#44403C] border-[#E7E5E4] hover:border-[#A8A29E]"
          )}
        >
          {org.name || "Untitled"}
        </button>
      ))}
      <button
        onClick={onNew}
        className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border border-dashed border-[#A8A29E] text-[#78716C] hover:border-[#1C1917] hover:text-[#1C1917] transition-all"
      >
        <Plus size={13} />
        New org
      </button>
    </div>
  );
}

// ── Canvas Tab ─────────────────────────────────────────────────────────────────

function CanvasTab({
  org,
  onChange,
  onDelete,
}: {
  org: OrgRecord;
  onChange: (updated: OrgRecord) => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  function field(
    label: string,
    key: keyof OrgRecord,
    placeholder: string,
    multiline?: boolean
  ) {
    const value = org[key] as string;
    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-[#44403C] uppercase tracking-wide">
          {label}
        </label>
        {multiline ? (
          <textarea
            rows={3}
            value={value}
            onChange={(e) => onChange({ ...org, [key]: e.target.value, updatedAt: new Date().toISOString() })}
            placeholder={placeholder}
            className="w-full border border-[#E7E5E4] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#A8A29E] resize-none bg-white"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange({ ...org, [key]: e.target.value, updatedAt: new Date().toISOString() })}
            placeholder={placeholder}
            className="w-full border border-[#E7E5E4] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#A8A29E] bg-white"
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-[#1C1917]">Pre-Meeting Canvas</h2>
        <p className="text-sm text-[#78716C] mt-0.5">
          Map the host org's existing meeting rhythm before you walk in the door. Use their language, not yours.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-4">
        {field("Organization Name", "name", "e.g. Lac Seul Band Council, Dryden Co-op")}
        {field(
          "Meeting Cadence",
          "cadence",
          "e.g. Monthly board meeting, every second Tuesday at 6pm"
        )}
        {field(
          "Attendee Roles",
          "attendeeRoles",
          "e.g. Chief, 4 councillors, band manager, finance director",
          true
        )}
        {field(
          "Stated Purpose",
          "statedPurpose",
          "In their words — what do they say this meeting is for?",
          true
        )}
        {field(
          "Current Pain Points (Their Words)",
          "painPoints",
          "What do they say is hard right now? Quote them if you can.",
          true
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-[#A8A29E]">
          {org.updatedAt
            ? `Last saved ${new Date(org.updatedAt).toLocaleDateString()}`
            : "Not yet saved"}
        </p>
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#78716C]">Remove this org?</span>
            <button
              onClick={onDelete}
              className="text-xs text-red-600 hover:underline"
            >
              Yes, remove
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-[#78716C] hover:underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-1 text-xs text-[#A8A29E] hover:text-red-500 transition-colors"
          >
            <Trash2 size={12} />
            Remove org
          </button>
        )}
      </div>
    </div>
  );
}

// ── Checklist Tab ──────────────────────────────────────────────────────────────

function ChecklistTab({
  orgId,
  answers,
  onChange,
}: {
  orgId: string;
  answers: Record<string, ChecklistAnswer>;
  onChange: (updated: Record<string, ChecklistAnswer>) => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const categories = Array.from(new Set(CHECKLIST_PROMPTS.map((p) => p.category)));

  function setAnswer(promptId: string, field: keyof ChecklistAnswer, value: string) {
    const current = answers[promptId] ?? { promptId, answer: "", priority: "" };
    onChange({
      ...answers,
      [promptId]: { ...current, [field]: value },
    });
  }

  const highCount = Object.values(answers).filter((a) => a.priority === "high").length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-[#1C1917]">Efficiency Discovery</h2>
        <p className="text-sm text-[#78716C] mt-0.5">
          Work through these prompts before or during observation. Stay in listening mode — no Codetry language in the room.
        </p>
        {highCount > 0 && (
          <div className="mt-2 inline-flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-red-700 font-medium">{highCount} high-priority finding{highCount > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {categories.map((cat) => {
        const prompts = CHECKLIST_PROMPTS.filter((p) => p.category === cat);
        const isOpen = expanded[cat] !== false;
        const catAnswered = prompts.filter((p) => answers[p.id]?.answer?.trim()).length;

        return (
          <div key={cat} className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden">
            <button
              onClick={() => setExpanded((e) => ({ ...e, [cat]: !isOpen }))}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#FAFAF9] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full border",
                    CATEGORY_COLORS[cat]
                  )}
                >
                  {cat}
                </span>
                {catAnswered > 0 && (
                  <span className="text-xs text-[#78716C]">
                    {catAnswered}/{prompts.length} answered
                  </span>
                )}
              </div>
              {isOpen ? <ChevronUp size={15} className="text-[#A8A29E]" /> : <ChevronDown size={15} className="text-[#A8A29E]" />}
            </button>

            {isOpen && (
              <div className="border-t border-[#E7E5E4] divide-y divide-[#F5F5F0]">
                {prompts.map((p) => {
                  const ans = answers[p.id] ?? { promptId: p.id, answer: "", priority: "" };
                  return (
                    <div key={p.id} className="px-4 py-4 space-y-2.5">
                      <p className="text-sm font-medium text-[#1C1917] leading-snug">{p.prompt}</p>
                      <p className="text-xs text-[#A8A29E] italic">{p.hint}</p>
                      <textarea
                        rows={2}
                        value={ans.answer}
                        onChange={(e) => setAnswer(p.id, "answer", e.target.value)}
                        placeholder="What did you observe or hear?"
                        className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#A8A29E] resize-none bg-[#FAFAF9]"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#78716C]">Priority:</span>
                        {(["high", "medium", "low"] as const).map((p_level) => (
                          <button
                            key={p_level}
                            onClick={() => setAnswer(p.id, "priority", ans.priority === p_level ? "" : p_level)}
                            className={cn(
                              "text-xs px-2.5 py-1 rounded-full border transition-all",
                              ans.priority === p_level
                                ? p_level === "high"
                                  ? "bg-red-500 text-white border-red-500"
                                  : p_level === "medium"
                                  ? "bg-amber-400 text-white border-amber-400"
                                  : "bg-stone-400 text-white border-stone-400"
                                : "bg-white text-[#78716C] border-[#E7E5E4] hover:border-[#A8A29E]"
                            )}
                          >
                            {p_level}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Leverage Tab ───────────────────────────────────────────────────────────────

function LeverageTab({
  orgId,
  entries,
  onChange,
}: {
  orgId: string;
  entries: LeverageEntry[];
  onChange: (updated: LeverageEntry[]) => void;
}) {
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<LeverageEntry["category"]>("wage");
  const [editId, setEditId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const active = entries.filter((e) => !e.archived);
  const archived = entries.filter((e) => e.archived);

  function addEntry() {
    if (!note.trim()) return;
    const entry: LeverageEntry = {
      id: genId(),
      orgId,
      category,
      note: note.trim(),
      archived: false,
      createdAt: new Date().toISOString(),
    };
    onChange([...entries, entry]);
    setNote("");
  }

  function archiveEntry(id: string) {
    onChange(entries.map((e) => (e.id === id ? { ...e, archived: true } : e)));
  }

  function restoreEntry(id: string) {
    onChange(entries.map((e) => (e.id === id ? { ...e, archived: false } : e)));
  }

  function saveEdit(id: string) {
    onChange(entries.map((e) => (e.id === id ? { ...e, note: editNote } : e)));
    setEditId(null);
    setEditNote("");
  }

  function getCatLabel(id: string) {
    return LEVERAGE_CATEGORIES.find((c) => c.id === id)?.label ?? id;
  }

  function getCatColor(id: string) {
    return LEVERAGE_CATEGORIES.find((c) => c.id === id)?.color ?? "text-stone-600 bg-stone-50";
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-[#1C1917]">Leverage Tracker</h2>
        <p className="text-sm text-[#78716C] mt-0.5">
          Log the economic pressure points you're noticing. This feeds the rationale for what gets solved behind the scenes.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {LEVERAGE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id as LeverageEntry["category"])}
              className={cn(
                "text-xs px-2.5 py-1 rounded-full border transition-all",
                category === cat.id
                  ? "bg-[#1C1917] text-white border-[#1C1917]"
                  : "bg-white text-[#78716C] border-[#E7E5E4] hover:border-[#A8A29E]"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.metaKey) addEntry();
            }}
            placeholder="What did you observe? Be specific — exact numbers, quotes, or patterns."
            className="flex-1 border border-[#E7E5E4] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#A8A29E] resize-none bg-[#FAFAF9]"
          />
          <button
            onClick={addEntry}
            className="self-end px-3 py-2 bg-[#1C1917] text-white rounded-xl text-sm min-h-[44px] hover:bg-[#292524] transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {active.length === 0 && (
        <p className="text-sm text-[#A8A29E] text-center py-4">
          No entries yet. Start logging what you observe.
        </p>
      )}

      <div className="space-y-2">
        {active.map((entry) => (
          <div
            key={entry.id}
            className="bg-white rounded-xl border border-[#E7E5E4] px-4 py-3 space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium shrink-0", getCatColor(entry.category))}>
                {getCatLabel(entry.category)}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { setEditId(entry.id); setEditNote(entry.note); }}
                  className="p-1 text-[#A8A29E] hover:text-[#44403C] transition-colors"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => archiveEntry(entry.id)}
                  className="p-1 text-[#A8A29E] hover:text-[#44403C] transition-colors"
                >
                  <Archive size={13} />
                </button>
              </div>
            </div>

            {editId === entry.id ? (
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#A8A29E] resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(entry.id)}
                    className="flex items-center gap-1 text-xs text-emerald-700 border border-emerald-200 rounded-lg px-2.5 py-1 hover:bg-emerald-50"
                  >
                    <Check size={12} /> Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="flex items-center gap-1 text-xs text-[#78716C] border border-[#E7E5E4] rounded-lg px-2.5 py-1 hover:bg-[#FAFAF9]"
                  >
                    <X size={12} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#1C1917] leading-snug">{entry.note}</p>
            )}

            <p className="text-xs text-[#A8A29E]">
              {new Date(entry.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {archived.length > 0 && (
        <div>
          <button
            onClick={() => setShowArchived((s) => !s)}
            className="flex items-center gap-1.5 text-xs text-[#A8A29E] hover:text-[#78716C] transition-colors"
          >
            <Archive size={12} />
            {showArchived ? "Hide" : "Show"} {archived.length} archived
          </button>
          {showArchived && (
            <div className="mt-2 space-y-2">
              {archived.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-[#FAFAF9] rounded-xl border border-[#E7E5E4] px-4 py-3 opacity-60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs text-[#A8A29E]">{getCatLabel(entry.category)}</span>
                    <button
                      onClick={() => restoreEntry(entry.id)}
                      className="text-xs text-[#78716C] hover:text-[#44403C]"
                    >
                      Restore
                    </button>
                  </div>
                  <p className="text-sm text-[#78716C] mt-1 leading-snug">{entry.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Table Setup Tab ───────────────────────────────────────────────────────────

const FIXED_SEATS = [
  {
    zone: "Z0",
    name: "Saltbox",
    icon: "⊡",
    color: "bg-yellow-50 border-yellow-200",
    labelColor: "text-yellow-800",
    role: "Internal boundary",
    desc: "Sits with the founder throughout. Asks the one question that tests whether something is ready. Does this hold?",
  },
  {
    zone: "Z0 + Z2",
    name: "Standby",
    icon: "⧖",
    color: "bg-stone-50 border-stone-300",
    labelColor: "text-stone-700",
    role: "Both sides",
    desc: "Holds the internal boundary (Z0) and sets the table (Z2) simultaneously. Runs the quick-set draft — agenda, synthesis, gate, and guest seats — before anyone sits down.",
  },
  {
    zone: "Z2",
    name: "Table Setter",
    icon: "⬡",
    color: "bg-blue-50 border-blue-200",
    labelColor: "text-blue-800",
    role: "Sets the table",
    desc: "Drafts the agenda skeleton from the canvas data before the meeting. The structure that gives Grok something to synthesize.",
  },
  {
    zone: "Grok",
    name: "Whiteboard",
    icon: "◈",
    color: "bg-indigo-50 border-indigo-200",
    labelColor: "text-indigo-800",
    role: "Agenda synthesis",
    desc: "Works between Z2 and the founder to synthesize and finalize the agenda. Assigns guest seats to line items with the founder before the agenda is locked.",
  },
];

const STANDBY_SYSTEM_PROMPT = `You are the Standby agent. You hold both sides of the table simultaneously.

Z0 side — internal boundary: You sit with the founder. Before anything goes out the door, you ask the one question: does this hold? You preserve, slow down, and cure. You are not a validator — you are a curing process.

Z2 side — table setter: You draft the structure that makes the meeting possible. You read the org's canvas data and decide what needs to be on the table before anyone sits down. You write in the org's own language, not yours. No system jargon unless it's already in their vocabulary.

When given a canvas, you produce a structured table draft. You are precise and plain. No hedging.`;

function parseStandbyDraft(text: string, orgId: string): Partial<TableConfig> {
  const result: Partial<TableConfig> = {};

  // Parse AGENDA block
  const agendaMatch = text.match(/AGENDA[:\s]*\n([\s\S]*?)(?=\nSYNTHESIS|\nGATE|\nGUESTS|$)/i);
  if (agendaMatch) {
    const lines = agendaMatch[1]
      .split("\n")
      .map((l) => l.replace(/^\d+[\.\)]\s*/, "").trim())
      .filter(Boolean);
    result.agendaItems = lines.map((text) => ({ id: genId(), text, guestSeatIndex: null }));
  }

  // Parse SYNTHESIS block
  const synthMatch = text.match(/SYNTHESIS[:\s]*\n([\s\S]*?)(?=\nGATE|\nGUESTS|$)/i);
  if (synthMatch) {
    result.agendaSynthesis = synthMatch[1].trim();
  }

  // Parse GATE block
  const gateMatch = text.match(/GATE[:\s]*\n([\s\S]*?)(?=\nGUESTS|$)/i);
  if (gateMatch) {
    const block = gateMatch[1];
    const get = (field: string) => {
      const m = block.match(new RegExp(`${field}[:\\s]*(.+)`, "i"));
      return m?.[1]?.trim() ?? "";
    };
    result.gateProfessional = {
      name: get("Name"),
      role: get("Role"),
      industry: get("Industry"),
      regulatoryBody: get("Regulatory Body"),
      holds: get("Holds"),
    };
  }

  // Parse GUESTS block
  const guestsMatch = text.match(/GUESTS[:\s]*\n([\s\S]*?)$/i);
  if (guestsMatch) {
    const block = guestsMatch[1];
    const guestBlocks = block.split(/\n(?=\d+[\.\)])/);
    const seats: GuestSeat[] = [0, 1, 2].map((i) => ({
      index: i as 0 | 1 | 2,
      name: "",
      role: "",
      expertise: "",
      confirmed: false,
    }));
    guestBlocks.slice(0, 3).forEach((gb, i) => {
      const get = (field: string) => {
        const m = gb.match(new RegExp(`${field}[:\\s]*(.+)`, "i"));
        return m?.[1]?.trim() ?? "";
      };
      seats[i] = {
        index: i as 0 | 1 | 2,
        name: get("Name"),
        role: get("Role"),
        expertise: get("Expertise"),
        confirmed: false,
      };
    });
    result.guestSeats = seats;
  }

  return result;
}

const GUEST_LABELS = ["Guest 1", "Guest 2", "Guest 3"];

function TableSetupTab({
  config,
  onChange,
  org,
}: {
  config: TableConfig;
  onChange: (updated: TableConfig) => void;
  org: OrgRecord;
}) {
  const [newItem, setNewItem] = useState("");
  const [openGate, setOpenGate] = useState(false);
  const [openGuest, setOpenGuest] = useState<number | null>(null);
  const [quickSetting, setQuickSetting] = useState(false);
  const [quickStatus, setQuickStatus] = useState("");

  const runQuickSet = useCallback(async () => {
    if (quickSetting) return;
    setQuickSetting(true);
    setQuickStatus("Standby reading the canvas…");

    const canvasContext = [
      org.name && `Organization: ${org.name}`,
      org.cadence && `Meeting cadence: ${org.cadence}`,
      org.attendeeRoles && `Attendees: ${org.attendeeRoles}`,
      org.statedPurpose && `Stated purpose: ${org.statedPurpose}`,
      org.painPoints && `Current pain points (their words): ${org.painPoints}`,
    ]
      .filter(Boolean)
      .join("\n");

    if (!canvasContext.trim()) {
      setQuickStatus("Fill in the Canvas first — Standby needs something to read.");
      setQuickSetting(false);
      return;
    }

    const message = `Here is the org canvas for this engagement:\n\n${canvasContext}\n\nSet the table. Produce a draft using exactly this format — no extra commentary before or after:\n\nAGENDA:\n1. [line item]\n2. [line item]\n... (5–7 items)\n\nSYNTHESIS:\n[one paragraph: what this meeting is actually for, what the real pressure is, what a controlled-pace approach looks like here]\n\nGATE:\nName: [if a professional type is implied by the sector/pain points, suggest a role type; otherwise leave blank]\nRole: [their title]\nIndustry: [sector or field]\nRegulatory Body: [the body that governs this profession in Ontario, or relevant jurisdiction]\nHolds: [the gate they hold — the boundary between what the community needs and what the system allows]\n\nGUESTS:\n1. Name: [suggested expert type for item 1–2], Role: [role], Expertise: [what they bring]\n2. Name: [suggested expert type for item 3–4], Role: [role], Expertise: [what they bring]\n3. Name: [suggested expert type for item 5–6], Role: [role], Expertise: [what they bring]`;

    try {
      setQuickStatus("Standby drafting…");
      const res = await fetch("/api/council/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: [],
          systemPrompt: STANDBY_SYSTEM_PROMPT,
          model: "x-ai/grok-4.20",
        }),
      });

      if (!res.ok || !res.body) {
        setQuickStatus("⚠ Could not reach Standby — check the API server.");
        setQuickSetting(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          try {
            const chunk = JSON.parse(raw) as { content?: string; done?: boolean };
            if (chunk.content) fullText += chunk.content;
          } catch { /* skip */ }
        }
      }

      const parsed = parseStandbyDraft(fullText, config.orgId);
      onChange({
        ...config,
        ...(parsed.agendaItems && parsed.agendaItems.length > 0
          ? { agendaItems: parsed.agendaItems }
          : {}),
        ...(parsed.agendaSynthesis ? { agendaSynthesis: parsed.agendaSynthesis } : {}),
        ...(parsed.gateProfessional ? { gateProfessional: parsed.gateProfessional } : {}),
        ...(parsed.guestSeats ? { guestSeats: parsed.guestSeats } : {}),
        agendaFinalized: false,
      });
      setOpenGate(!!parsed.gateProfessional?.name);
      setQuickStatus("Table set — review and adjust before finalizing.");
    } catch {
      setQuickStatus("⚠ Network error. Try again.");
    }

    setQuickSetting(false);
  }, [quickSetting, org, config, onChange]);

  function addItem() {
    if (!newItem.trim()) return;
    const item: AgendaItem = { id: genId(), text: newItem.trim(), guestSeatIndex: null };
    onChange({ ...config, agendaItems: [...config.agendaItems, item], agendaFinalized: false });
    setNewItem("");
  }

  function removeItem(id: string) {
    onChange({ ...config, agendaItems: config.agendaItems.filter((i) => i.id !== id), agendaFinalized: false });
  }

  function assignGuest(itemId: string, seatIndex: 0 | 1 | 2 | null) {
    onChange({
      ...config,
      agendaItems: config.agendaItems.map((i) =>
        i.id === itemId ? { ...i, guestSeatIndex: seatIndex } : i
      ),
      agendaFinalized: false,
    });
  }

  function updateGate(field: keyof GateProfessional, value: string) {
    onChange({ ...config, gateProfessional: { ...config.gateProfessional, [field]: value }, agendaFinalized: false });
  }

  function updateGuest(index: number, field: keyof GuestSeat, value: string | boolean) {
    onChange({
      ...config,
      guestSeats: config.guestSeats.map((s) =>
        s.index === index ? { ...s, [field]: value } : s
      ),
      agendaFinalized: false,
    });
  }

  const canFinalize =
    config.agendaItems.length > 0 &&
    config.gateProfessional.name.trim() !== "" &&
    config.guestSeats.some((s) => s.name.trim() !== "");

  const assignedCount = config.agendaItems.filter((i) => i.guestSeatIndex !== null).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#1C1917]">Table Setup</h2>
          <p className="text-sm text-[#78716C] mt-0.5 leading-snug">
            Z2 sets the table. Grok synthesizes the agenda. The founder and Grok assign guest experts to line items before the agenda is finalized.
          </p>
        </div>
        <button
          onClick={runQuickSet}
          disabled={quickSetting}
          className={cn(
            "shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all",
            quickSetting
              ? "bg-stone-100 text-[#A8A29E] border-stone-200 cursor-wait"
              : "bg-[#1C1917] text-white border-[#1C1917] hover:bg-[#292524]"
          )}
        >
          <span className="text-base leading-none">⧖</span>
          {quickSetting ? "Setting…" : "Quick Set"}
        </button>
      </div>

      {/* Quick set status */}
      {quickStatus && (
        <div className={cn(
          "text-xs px-3 py-2 rounded-lg border",
          quickStatus.startsWith("⚠") || quickStatus.startsWith("Fill")
            ? "bg-amber-50 border-amber-200 text-amber-800"
            : quickStatus.startsWith("Table set")
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : "bg-stone-50 border-stone-200 text-stone-600"
        )}>
          {quickStatus}
          {!quickSetting && (
            <button onClick={() => setQuickStatus("")} className="ml-2 opacity-60 hover:opacity-100">×</button>
          )}
        </div>
      )}

      {/* Finalized banner */}
      {config.agendaFinalized && (
        <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <Check size={15} className="text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-800 font-medium">Agenda finalized — table is set.</p>
          <button
            onClick={() => onChange({ ...config, agendaFinalized: false })}
            className="ml-auto text-xs text-emerald-600 hover:underline"
          >
            Reopen
          </button>
        </div>
      )}

      {/* Fixed seats */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#44403C] uppercase tracking-wide">Fixed Seats</p>
        {FIXED_SEATS.map((seat) => (
          <div
            key={seat.name}
            className={cn("rounded-xl border px-4 py-3 flex items-start gap-3", seat.color)}
          >
            <span className="text-lg leading-none mt-0.5 shrink-0">{seat.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn("text-xs font-semibold uppercase tracking-wide", seat.labelColor)}>
                  {seat.zone}
                </span>
                <span className="text-sm font-medium text-[#1C1917]">{seat.name}</span>
                <span className="text-xs text-[#78716C]">— {seat.role}</span>
              </div>
              <p className="text-xs text-[#78716C] mt-1 leading-snug">{seat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Agenda line items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[#44403C] uppercase tracking-wide">Agenda Line Items</p>
          {assignedCount > 0 && (
            <span className="text-xs text-[#78716C]">{assignedCount}/{config.agendaItems.length} assigned</span>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#E7E5E4] divide-y divide-[#F5F5F0] overflow-hidden">
          {config.agendaItems.length === 0 && (
            <p className="text-sm text-[#A8A29E] px-4 py-3">No items yet. Add the agenda line by line.</p>
          )}
          {config.agendaItems.map((item, idx) => (
            <div key={item.id} className="px-3 py-3 flex items-start gap-2">
              <span className="text-xs text-[#A8A29E] mt-1 w-5 shrink-0 text-right">{idx + 1}.</span>
              <p className="flex-1 text-sm text-[#1C1917] leading-snug">{item.text}</p>
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Guest assignment */}
                <select
                  value={item.guestSeatIndex ?? ""}
                  onChange={(e) =>
                    assignGuest(
                      item.id,
                      e.target.value === "" ? null : (Number(e.target.value) as 0 | 1 | 2)
                    )
                  }
                  className="text-xs border border-[#E7E5E4] rounded-lg px-2 py-1 bg-white text-[#44403C] focus:outline-none"
                >
                  <option value="">No guest</option>
                  {GUEST_LABELS.map((label, i) => (
                    <option key={i} value={i}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1 text-[#A8A29E] hover:text-red-400 transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="Add a line item (Z2 drafts, Grok refines)"
            className="flex-1 border border-[#E7E5E4] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#A8A29E] bg-white"
          />
          <button
            onClick={addItem}
            className="px-3 py-2 bg-[#1C1917] text-white rounded-xl text-sm hover:bg-[#292524] transition-colors"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Grok synthesis */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#44403C] uppercase tracking-wide">Grok's Synthesis</p>
        <p className="text-xs text-[#A8A29E]">
          Where Z2's draft and Grok's read of the situation converge. What is this meeting actually for?
        </p>
        <textarea
          rows={3}
          value={config.agendaSynthesis}
          onChange={(e) => onChange({ ...config, agendaSynthesis: e.target.value, agendaFinalized: false })}
          placeholder="e.g. Three of the five items are symptoms of the same budget freeze. If that's not named, the meeting will produce four follow-ups and no decisions."
          className="w-full border border-[#E7E5E4] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#A8A29E] resize-none bg-white"
        />
      </div>

      {/* Gate professional */}
      <div className="space-y-3">
        <button
          onClick={() => setOpenGate((o) => !o)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-start gap-2">
            <p className="text-xs font-semibold text-[#44403C] uppercase tracking-wide">Gate Professional</p>
            {config.gateProfessional.name && (
              <span className="text-xs text-[#78716C]">— {config.gateProfessional.name}</span>
            )}
          </div>
          {openGate ? <ChevronUp size={14} className="text-[#A8A29E]" /> : <ChevronDown size={14} className="text-[#A8A29E]" />}
        </button>

        {!openGate && (
          <p className="text-xs text-[#A8A29E] leading-snug">
            Every engagement has a licensed professional who holds the gate between what people need and what the regulatory system allows. Name them before the meeting.
          </p>
        )}

        {openGate && (
          <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-3">
            <p className="text-xs text-[#78716C] leading-snug">
              This person sits at the boundary between Maslow's hierarchy of needs and the regulatory body of this industry. They don't replace the community's voice — they hold the gate that determines what's possible inside the system.
            </p>
            {(
              [
                ["name", "Name", "e.g. Dr. Sarah Otter"],
                ["role", "Role / Title", "e.g. Community Health Director"],
                ["industry", "Industry / Sector", "e.g. Primary health care, Treaty 3 region"],
                ["regulatoryBody", "Regulatory Body", "e.g. College of Physicians and Surgeons of Ontario"],
                ["holds", "What they hold", "e.g. The gate between basic health access and CPSO licensing requirements"],
              ] as [keyof GateProfessional, string, string][]
            ).map(([field, label, placeholder]) => (
              <div key={field} className="space-y-1">
                <label className="text-xs text-[#44403C]">{label}</label>
                <input
                  type="text"
                  value={config.gateProfessional[field]}
                  onChange={(e) => updateGate(field, e.target.value)}
                  placeholder={placeholder}
                  className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#A8A29E]"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guest expert seats */}
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-[#44403C] uppercase tracking-wide">Guest Expert Seats</p>
          <p className="text-xs text-[#A8A29E] mt-1">
            Three seats. Grok and the founder decide who fills each one before the agenda is finalized. Each guest speaks to their assigned line item — nothing more.
          </p>
        </div>

        {([0, 1, 2] as const).map((idx) => {
          const seat = config.guestSeats.find((s) => s.index === idx) ?? {
            index: idx, name: "", role: "", expertise: "", confirmed: false,
          };
          const assignedItems = config.agendaItems.filter((i) => i.guestSeatIndex === idx);
          const isOpen = openGuest === idx;

          return (
            <div key={idx} className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden">
              <button
                onClick={() => setOpenGuest(isOpen ? null : idx)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#FAFAF9] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#F5F0E8] text-[#44403C] text-xs font-semibold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="text-left">
                    <span className="text-sm font-medium text-[#1C1917]">
                      {seat.name || GUEST_LABELS[idx]}
                    </span>
                    {seat.role && (
                      <span className="text-xs text-[#78716C] ml-1.5">— {seat.role}</span>
                    )}
                    {assignedItems.length > 0 && (
                      <span className="ml-1.5 text-xs text-[#A8A29E]">
                        · item{assignedItems.length > 1 ? "s" : ""} {assignedItems.map((_, i) => config.agendaItems.indexOf(assignedItems[i]!) + 1).join(", ")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {seat.confirmed && (
                    <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                      <Check size={10} /> Confirmed
                    </span>
                  )}
                  {isOpen ? <ChevronUp size={14} className="text-[#A8A29E]" /> : <ChevronDown size={14} className="text-[#A8A29E]" />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-[#E7E5E4] px-4 py-4 space-y-3">
                  {(
                    [
                      ["name", "Name", "Who is this person?"],
                      ["role", "Role", "Their title or function"],
                      ["expertise", "What they bring", "The specific expertise relevant to their assigned item"],
                    ] as [keyof GuestSeat, string, string][]
                  ).map(([field, label, placeholder]) => (
                    <div key={field} className="space-y-1">
                      <label className="text-xs text-[#44403C]">{label}</label>
                      <input
                        type="text"
                        value={seat[field] as string}
                        onChange={(e) => updateGuest(idx, field, e.target.value)}
                        placeholder={placeholder}
                        className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#A8A29E]"
                      />
                    </div>
                  ))}

                  {assignedItems.length > 0 ? (
                    <div className="bg-[#FAFAF9] rounded-lg px-3 py-2">
                      <p className="text-xs text-[#78716C] font-medium mb-1">Assigned item{assignedItems.length > 1 ? "s" : ""}:</p>
                      {assignedItems.map((item) => (
                        <p key={item.id} className="text-xs text-[#44403C]">· {item.text}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#A8A29E] italic">No agenda items assigned to this seat yet — use the dropdown on each item above.</p>
                  )}

                  <button
                    onClick={() => updateGuest(idx, "confirmed", !seat.confirmed)}
                    className={cn(
                      "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all",
                      seat.confirmed
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-white text-[#78716C] border-[#E7E5E4] hover:border-[#A8A29E]"
                    )}
                  >
                    <Check size={12} />
                    {seat.confirmed ? "Confirmed" : "Mark as confirmed"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Finalize */}
      {!config.agendaFinalized && (
        <div className="pt-1 pb-2">
          <button
            onClick={() => canFinalize && onChange({ ...config, agendaFinalized: true })}
            disabled={!canFinalize}
            className={cn(
              "w-full py-3 rounded-xl text-sm font-medium border transition-all",
              canFinalize
                ? "bg-[#1C1917] text-white border-[#1C1917] hover:bg-[#292524]"
                : "bg-[#F5F5F0] text-[#A8A29E] border-[#E7E5E4] cursor-not-allowed"
            )}
          >
            {canFinalize ? "Finalize agenda — table is set" : "Add items + gate professional to finalize"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Brief Tab ──────────────────────────────────────────────────────────────────

function BriefTab({
  org,
  checklistAnswers,
  leverageEntries,
  overrides,
  onOverridesChange,
}: {
  org: OrgRecord;
  checklistAnswers: Record<string, ChecklistAnswer>;
  leverageEntries: LeverageEntry[];
  overrides: BriefOverrides;
  onOverridesChange: (updated: BriefOverrides) => void;
}) {
  const [editing, setEditing] = useState(false);
  const briefRef = useRef<HTMLDivElement>(null);

  const highFindings = Object.values(checklistAnswers)
    .filter((a) => a.priority === "high" && a.answer.trim())
    .map((a) => {
      const prompt = CHECKLIST_PROMPTS.find((p) => p.id === a.promptId);
      return { category: prompt?.category ?? "", answer: a.answer };
    });

  const activeLeverage = leverageEntries.filter((e) => !e.archived);

  const painPointsText = overrides.customPainPoints || org.painPoints || "";
  const leverageText =
    overrides.customLeverage ||
    activeLeverage.map((e) => `• ${e.note}`).join("\n") ||
    "";

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#1C1917]">Strategic Meeting Brief</h2>
          <p className="text-sm text-[#78716C] mt-0.5">
            A one-page discussion piece. Table it at the right moment — not as a pitch.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing((e) => !e)}
            className={cn(
              "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all",
              editing
                ? "bg-[#1C1917] text-white border-[#1C1917]"
                : "bg-white text-[#44403C] border-[#E7E5E4] hover:border-[#A8A29E]"
            )}
          >
            <Edit2 size={12} />
            {editing ? "Done" : "Edit"}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#E7E5E4] bg-white text-[#44403C] hover:border-[#A8A29E] transition-all"
          >
            <Printer size={12} />
            Print
          </button>
        </div>
      </div>

      {editing && (
        <div className="bg-[#FEF9EE] border border-amber-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-medium text-amber-800 uppercase tracking-wide">Edit before sharing</p>
          <div className="space-y-1.5">
            <label className="text-xs text-[#44403C]">Pain points (override auto-populated)</label>
            <textarea
              rows={3}
              value={overrides.customPainPoints}
              onChange={(e) => onOverridesChange({ ...overrides, customPainPoints: e.target.value })}
              placeholder={painPointsText || "Leave blank to use canvas data"}
              className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm focus:outline-none resize-none bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[#44403C]">Leverage notes (override auto-populated)</label>
            <textarea
              rows={3}
              value={overrides.customLeverage}
              onChange={(e) => onOverridesChange({ ...overrides, customLeverage: e.target.value })}
              placeholder={leverageText || "Leave blank to use leverage tracker"}
              className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm focus:outline-none resize-none bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[#44403C]">Proposed next step</label>
            <input
              type="text"
              value={overrides.customNext}
              onChange={(e) => onOverridesChange({ ...overrides, customNext: e.target.value })}
              placeholder="e.g. One 90-min working session with the band manager"
              className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm focus:outline-none bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[#44403C]">Confidential practitioner note (not printed)</label>
            <textarea
              rows={2}
              value={overrides.editorNote}
              onChange={(e) => onOverridesChange({ ...overrides, editorNote: e.target.value })}
              placeholder="Your private context — this stays off the page."
              className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm focus:outline-none resize-none bg-white"
            />
          </div>
        </div>
      )}

      {/* The printable brief */}
      <div
        ref={briefRef}
        id="meeting-brief-print"
        className="bg-white border border-[#E7E5E4] rounded-xl p-6 space-y-6 print:border-0 print:shadow-none print:p-0"
      >
        {/* Header */}
        <div className="space-y-1 border-b border-[#E7E5E4] pb-4">
          <p className="text-xs text-[#A8A29E] uppercase tracking-widest">Strategic Meeting Brief</p>
          <h3 className="text-xl font-semibold text-[#1C1917]">
            {org.name || "Organization Name"}
          </h3>
          <p className="text-sm text-[#78716C]">
            {org.cadence || "Meeting cadence not specified"}
            {org.attendeeRoles ? ` · ${org.attendeeRoles}` : ""}
          </p>
        </div>

        {/* Core position */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide">The Position</h4>
          <p className="text-sm text-[#44403C] leading-relaxed">
            Every organization has a meeting rhythm that already works — partially. The goal here is not to replace what you have. It is to understand what it costs you, what it's missing, and what can be quietly improved without disrupting the people inside it.
          </p>
          <p className="text-sm text-[#44403C] leading-relaxed">
            Systems are under pressure. People are leaving. The people who depend most on this organization's services are often the least visible in the room. The pace of change must be controlled — not because change isn't needed, but because a free fall helps no one.
          </p>
        </div>

        {/* The approach */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide">The Approach</h4>
          <div className="grid grid-cols-1 gap-2">
            {[
              { step: "1", label: "Meet where you are", desc: "Work inside your existing meeting structure. No new formats, no new jargon." },
              { step: "2", label: "Find the efficiencies", desc: "Identify where time, capacity, and money are quietly leaking — in the org's own language." },
              { step: "3", label: "Solve behind the scenes", desc: "Fix the system without making the fix visible. Change the outcome, not the meeting." },
              { step: "4", label: "Protect the vulnerable", desc: "Any change that reduces service to the most dependent members moves last, not first." },
              { step: "5", label: "Controlled pace, not free fall", desc: "You cannot demolish while a thousand people are living inside. Change at the speed the system can absorb." },
            ].map(({ step, label, desc }) => (
              <div key={step} className="flex gap-3 items-start">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#F5F0E8] text-[#44403C] text-xs font-semibold flex items-center justify-center mt-0.5">
                  {step}
                </span>
                <div>
                  <span className="text-sm font-medium text-[#1C1917]">{label} — </span>
                  <span className="text-sm text-[#78716C]">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What we're seeing */}
        {(painPointsText || highFindings.length > 0) && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide">What We're Seeing</h4>
            {painPointsText && (
              <p className="text-sm text-[#44403C] leading-relaxed whitespace-pre-line">{painPointsText}</p>
            )}
            {highFindings.length > 0 && (
              <ul className="space-y-1">
                {highFindings.map((f, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[#44403C]">
                    <span className="shrink-0 text-red-500 mt-0.5">▲</span>
                    <span>{f.answer}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Economic context */}
        {leverageText && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide">Economic Context</h4>
            <p className="text-sm text-[#44403C] leading-relaxed whitespace-pre-line">{leverageText}</p>
          </div>
        )}

        {/* Proposed next step */}
        <div className="space-y-2 border-t border-[#E7E5E4] pt-4">
          <h4 className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide">Proposed Next Step</h4>
          <p className="text-sm text-[#44403C] leading-relaxed">
            {overrides.customNext ||
              "One bounded, paid working session to map the current system and identify the first quiet improvement."}
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E7E5E4] pt-4">
          <p className="text-xs text-[#A8A29E] text-center">
            This document is a discussion piece, not a proposal. It does not represent a commitment or a contract.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

type Tab = "canvas" | "table" | "checklist" | "leverage" | "brief";

const TABS: { id: Tab; label: string }[] = [
  { id: "canvas", label: "Canvas" },
  { id: "table", label: "Table" },
  { id: "checklist", label: "Discovery" },
  { id: "leverage", label: "Leverage" },
  { id: "brief", label: "Brief" },
];

export function MeetingKitPage() {
  const [orgs, setOrgs] = useState<OrgRecord[]>(() =>
    loadJSON<OrgRecord[]>(STORAGE_KEYS.orgs, [])
  );
  const [activeOrgId, setActiveOrgId] = useState<string | null>(() =>
    loadJSON<string | null>(STORAGE_KEYS.activeOrg, null)
  );
  const [tab, setTab] = useState<Tab>("canvas");

  const [checklistData, setChecklistData] = useState<Record<string, Record<string, ChecklistAnswer>>>(
    () => loadJSON(STORAGE_KEYS.checklist, {})
  );
  const [leverageData, setLeverageData] = useState<Record<string, LeverageEntry[]>>(
    () => loadJSON(STORAGE_KEYS.leverage, {})
  );
  const [briefOverrides, setBriefOverrides] = useState<Record<string, BriefOverrides>>(
    () => loadJSON(STORAGE_KEYS.briefOverrides, {})
  );
  const [tableConfigData, setTableConfigData] = useState<Record<string, TableConfig>>(
    () => loadJSON(STORAGE_KEYS.tableConfig, {})
  );

  // Persist everything on change
  useEffect(() => { saveJSON(STORAGE_KEYS.orgs, orgs); }, [orgs]);
  useEffect(() => { saveJSON(STORAGE_KEYS.activeOrg, activeOrgId); }, [activeOrgId]);
  useEffect(() => { saveJSON(STORAGE_KEYS.checklist, checklistData); }, [checklistData]);
  useEffect(() => { saveJSON(STORAGE_KEYS.leverage, leverageData); }, [leverageData]);
  useEffect(() => { saveJSON(STORAGE_KEYS.briefOverrides, briefOverrides); }, [briefOverrides]);
  useEffect(() => { saveJSON(STORAGE_KEYS.tableConfig, tableConfigData); }, [tableConfigData]);

  const activeOrg = orgs.find((o) => o.id === activeOrgId) ?? null;

  function createOrg() {
    const org: OrgRecord = {
      id: genId(),
      name: "",
      cadence: "",
      attendeeRoles: "",
      statedPurpose: "",
      painPoints: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrgs((prev) => [...prev, org]);
    setActiveOrgId(org.id);
    setTab("canvas");
  }

  function updateOrg(updated: OrgRecord) {
    setOrgs((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  }

  function deleteOrg(id: string) {
    setOrgs((prev) => prev.filter((o) => o.id !== id));
    setActiveOrgId((prev) => {
      const remaining = orgs.filter((o) => o.id !== id);
      return remaining.length > 0 ? remaining[0]!.id : null;
    });
  }

  function updateChecklist(orgId: string, answers: Record<string, ChecklistAnswer>) {
    setChecklistData((prev) => ({ ...prev, [orgId]: answers }));
  }

  function updateLeverage(orgId: string, entries: LeverageEntry[]) {
    setLeverageData((prev) => ({ ...prev, [orgId]: entries }));
  }

  function updateBriefOverrides(orgId: string, overrides: BriefOverrides) {
    setBriefOverrides((prev) => ({ ...prev, [orgId]: overrides }));
  }

  function updateTableConfig(orgId: string, config: TableConfig) {
    setTableConfigData((prev) => ({ ...prev, [orgId]: config }));
  }

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #meeting-brief-print,
          #meeting-brief-print * { visibility: visible; }
          #meeting-brief-print {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            font-size: 12pt;
            padding: 1.5cm 2cm;
            background: white;
          }
        }
      `}</style>

      <div className="min-h-dvh bg-gradient-to-b from-[#FAFAF9] to-[#F5F0E8] pb-28">
        <div className="px-4 pt-5 pb-2 max-w-lg mx-auto">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-[#1C1917]">Meeting Kit</h1>
              <p className="text-sm text-[#78716C] mt-0.5 leading-snug">
                Enter organizations mid-stream. Map the rhythm before you change it.
              </p>
            </div>
          </div>

          {/* Org selector */}
          <div className="mt-4">
            <OrgSelector
              orgs={orgs}
              activeId={activeOrgId}
              onSelect={(id) => { setActiveOrgId(id); setTab("canvas"); }}
              onNew={createOrg}
            />
          </div>
        </div>

        {!activeOrg ? (
          <div className="max-w-lg mx-auto px-4 mt-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#F5F0E8] flex items-center justify-center mx-auto">
              <Plus size={22} className="text-[#A8A29E]" />
            </div>
            <div>
              <p className="text-base font-medium text-[#1C1917]">No organization yet</p>
              <p className="text-sm text-[#78716C] mt-1">
                Add an org to start mapping their meeting rhythm.
              </p>
            </div>
            <button
              onClick={createOrg}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1C1917] text-white rounded-xl text-sm hover:bg-[#292524] transition-colors"
            >
              <Plus size={15} />
              Add first organization
            </button>
          </div>
        ) : (
          <>
            {/* Tab bar */}
            <div className="sticky top-0 z-20 bg-[#FAFAF9]/95 backdrop-blur-sm border-b border-[#E7E5E4]">
              <div className="max-w-lg mx-auto px-4 flex items-center gap-0 overflow-x-auto">
                {TABS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={cn(
                      "shrink-0 px-4 py-3 text-sm border-b-2 transition-all",
                      tab === id
                        ? "border-[#1C1917] text-[#1C1917] font-semibold"
                        : "border-transparent text-[#78716C] hover:text-[#44403C]"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="max-w-lg mx-auto px-4 pt-5">
              {tab === "canvas" && (
                <CanvasTab
                  org={activeOrg}
                  onChange={updateOrg}
                  onDelete={() => deleteOrg(activeOrg.id)}
                />
              )}
              {tab === "table" && (
                <TableSetupTab
                  config={tableConfigData[activeOrg.id] ?? EMPTY_TABLE_CONFIG(activeOrg.id)}
                  onChange={(c) => updateTableConfig(activeOrg.id, c)}
                  org={activeOrg}
                />
              )}
              {tab === "checklist" && (
                <ChecklistTab
                  orgId={activeOrg.id}
                  answers={checklistData[activeOrg.id] ?? {}}
                  onChange={(a) => updateChecklist(activeOrg.id, a)}
                />
              )}
              {tab === "leverage" && (
                <LeverageTab
                  orgId={activeOrg.id}
                  entries={leverageData[activeOrg.id] ?? []}
                  onChange={(e) => updateLeverage(activeOrg.id, e)}
                />
              )}
              {tab === "brief" && (
                <BriefTab
                  org={activeOrg}
                  checklistAnswers={checklistData[activeOrg.id] ?? {}}
                  leverageEntries={leverageData[activeOrg.id] ?? []}
                  overrides={
                    briefOverrides[activeOrg.id] ?? {
                      orgId: activeOrg.id,
                      customPainPoints: "",
                      customLeverage: "",
                      customNext: "",
                      editorNote: "",
                    }
                  }
                  onOverridesChange={(o) => updateBriefOverrides(activeOrg.id, o)}
                />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
