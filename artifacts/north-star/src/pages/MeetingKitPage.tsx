import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Archive, Edit2, Check, X, Printer, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BG, SURFACE, SURFACE_2, BORDER, BORDER_STRONG, TEXT, TEXT_2, TEXT_3, AMBER, AMBER_LIGHT, AMBER_WASH, GREEN, RED, FONT_DISPLAY } from "@/lib/theme";

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
  "Time Leaks": "bg-[rgba(200,146,58,0.12)] border-[rgba(237,232,213,0.15)] text-[#C8923A]",
  "Capacity Gaps": "bg-blue-900/20 border-blue-800/30 text-blue-300",
  "Economic Pressure": "bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)] text-[rgba(239,68,68,0.9)]",
  "Vulnerable Dependencies": "bg-emerald-900/20 border-emerald-800/30 text-emerald-300",
};

const LEVERAGE_CATEGORIES = [
  { id: "wage", label: "Wage Pressure", color: "text-[rgba(239,68,68,0.9)] bg-[rgba(239,68,68,0.1)]" },
  { id: "role", label: "Role Attrition", color: "text-orange-300 bg-orange-900/20" },
  { id: "dependency", label: "Vulnerable Dependency", color: "text-emerald-300 bg-emerald-900/20" },
  { id: "quiet-solution", label: "Quiet Solution", color: "text-blue-300 bg-blue-900/20" },
  { id: "other", label: "Other", color: "text-[rgba(237,232,213,0.55)] bg-[rgba(237,232,213,0.08)]" },
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
              ? "bg-[#C8923A] text-[#0B0905] border-[#C8923A]"
              : "bg-[#141210] text-[#EDE8D5] border-[rgba(237,232,213,0.08)] hover:border-[rgba(237,232,213,0.15)]"
          )}
        >
          {org.name || "Untitled"}
        </button>
      ))}
      <button
        onClick={onNew}
        className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border border-dashed border-[rgba(237,232,213,0.35)] text-[rgba(237,232,213,0.35)] hover:border-[#C8923A] hover:text-[#C8923A] transition-all"
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
        <label className="block text-xs font-medium text-[rgba(237,232,213,0.55)] uppercase tracking-wide">
          {label}
        </label>
        {multiline ? (
          <textarea
            rows={3}
            value={value}
            onChange={(e) => onChange({ ...org, [key]: e.target.value, updatedAt: new Date().toISOString() })}
            placeholder={placeholder}
            className="w-full border border-[rgba(237,232,213,0.08)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[rgba(237,232,213,0.15)] resize-none bg-[#1A1714] text-[#EDE8D5] placeholder-[rgba(237,232,213,0.35)]"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange({ ...org, [key]: e.target.value, updatedAt: new Date().toISOString() })}
            placeholder={placeholder}
            className="w-full border border-[rgba(237,232,213,0.08)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[rgba(237,232,213,0.15)] bg-[#1A1714] text-[#EDE8D5] placeholder-[rgba(237,232,213,0.35)]"
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-[#EDE8D5]" style={{ fontFamily: FONT_DISPLAY }}>Pre-Meeting Canvas</h2>
        <p className="text-sm text-[rgba(237,232,213,0.55)] mt-0.5">
          Map the host org's existing meeting rhythm before you walk in the door. Use their language, not yours.
        </p>
      </div>

      <div className="bg-[#141210] rounded-xl border border-[rgba(237,232,213,0.08)] p-4 space-y-4">
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
        <p className="text-xs text-[rgba(237,232,213,0.35)]">
          {org.updatedAt
            ? `Last saved ${new Date(org.updatedAt).toLocaleDateString()}`
            : "Not yet saved"}
        </p>
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[rgba(237,232,213,0.55)]">Remove this org?</span>
            <button
              onClick={onDelete}
              className="text-xs text-[rgba(239,68,68,0.7)] hover:underline"
            >
              Yes, remove
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-[rgba(237,232,213,0.55)] hover:underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-1 text-xs text-[rgba(237,232,213,0.35)] hover:text-[rgba(239,68,68,0.7)] transition-colors"
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
        <h2 className="text-base font-semibold text-[#EDE8D5]" style={{ fontFamily: FONT_DISPLAY }}>Efficiency Discovery</h2>
        <p className="text-sm text-[rgba(237,232,213,0.55)] mt-0.5">
          Work through these prompts before or during observation. Stay in listening mode — no Codetry language in the room.
        </p>
        {highCount > 0 && (
          <div className="mt-2 inline-flex items-center gap-1.5 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-[rgba(239,68,68,0.7)]" />
            <span className="text-xs text-[rgba(239,68,68,0.9)] font-medium">{highCount} high-priority finding{highCount > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {categories.map((cat) => {
        const prompts = CHECKLIST_PROMPTS.filter((p) => p.category === cat);
        const isOpen = expanded[cat] !== false;
        const catAnswered = prompts.filter((p) => answers[p.id]?.answer?.trim()).length;

        return (
          <div key={cat} className="bg-[#141210] rounded-xl border border-[rgba(237,232,213,0.08)] overflow-hidden">
            <button
              onClick={() => setExpanded((e) => ({ ...e, [cat]: !isOpen }))}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#1A1714] transition-colors"
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
                  <span className="text-xs text-[rgba(237,232,213,0.55)]">
                    {catAnswered}/{prompts.length} answered
                  </span>
                )}
              </div>
              {isOpen ? <ChevronUp size={15} className="text-[rgba(237,232,213,0.35)]" /> : <ChevronDown size={15} className="text-[rgba(237,232,213,0.35)]" />}
            </button>

            {isOpen && (
              <div className="border-t border-[rgba(237,232,213,0.08)] divide-y divide-[rgba(237,232,213,0.05)]">
                {prompts.map((p) => {
                  const ans = answers[p.id] ?? { promptId: p.id, answer: "", priority: "" };
                  return (
                    <div key={p.id} className="px-4 py-4 space-y-2.5">
                      <p className="text-sm font-medium text-[#EDE8D5] leading-snug">{p.prompt}</p>
                      <p className="text-xs text-[rgba(237,232,213,0.35)] italic">{p.hint}</p>
                      <textarea
                        rows={2}
                        value={ans.answer}
                        onChange={(e) => setAnswer(p.id, "answer", e.target.value)}
                        placeholder="What did you observe or hear?"
                        className="w-full border border-[rgba(237,232,213,0.08)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[rgba(237,232,213,0.15)] resize-none bg-[#1A1714] text-[#EDE8D5] placeholder-[rgba(237,232,213,0.35)]"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[rgba(237,232,213,0.55)]">Priority:</span>
                        {(["high", "medium", "low"] as const).map((p_level) => (
                          <button
                            key={p_level}
                            onClick={() => setAnswer(p.id, "priority", ans.priority === p_level ? "" : p_level)}
                            className={cn(
                              "text-xs px-2.5 py-1 rounded-full border transition-all",
                              ans.priority === p_level
                                ? p_level === "high"
                                  ? "bg-[rgba(239,68,68,0.7)] text-white border-[rgba(239,68,68,0.7)]"
                                  : p_level === "medium"
                                  ? "bg-[#C8923A] text-[#0B0905] border-[#C8923A]"
                                  : "bg-[rgba(237,232,213,0.35)] text-[#0B0905] border-[rgba(237,232,213,0.35)]"
                                : "bg-[#141210] text-[rgba(237,232,213,0.55)] border-[rgba(237,232,213,0.08)] hover:border-[rgba(237,232,213,0.15)]"
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
    return LEVERAGE_CATEGORIES.find((c) => c.id === id)?.color ?? "text-[rgba(237,232,213,0.55)] bg-[#141210]";
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-[#EDE8D5]" style={{ fontFamily: FONT_DISPLAY }}>Leverage Tracker</h2>
        <p className="text-sm text-[rgba(237,232,213,0.55)] mt-0.5">
          Log the economic pressure points you're noticing. This feeds the rationale for what gets solved behind the scenes.
        </p>
      </div>

      <div className="bg-[#141210] rounded-xl border border-[rgba(237,232,213,0.08)] p-4 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {LEVERAGE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id as LeverageEntry["category"])}
              className={cn(
                "text-xs px-2.5 py-1 rounded-full border transition-all",
                category === cat.id
                  ? "bg-[#C8923A] text-[#0B0905] border-[#C8923A]"
                  : "bg-[#141210] text-[rgba(237,232,213,0.55)] border-[rgba(237,232,213,0.08)] hover:border-[rgba(237,232,213,0.15)]"
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
            className="flex-1 border border-[rgba(237,232,213,0.08)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[rgba(237,232,213,0.15)] resize-none bg-[#1A1714] text-[#EDE8D5] placeholder-[rgba(237,232,213,0.35)]"
          />
          <button
            onClick={addEntry}
            className="self-end px-3 py-2 bg-[#C8923A] text-[#0B0905] rounded-xl text-sm min-h-[44px] hover:bg-[#F0B855] transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {active.length === 0 && (
        <p className="text-sm text-[rgba(237,232,213,0.35)] text-center py-4">
          No entries yet. Start logging what you observe.
        </p>
      )}

      <div className="space-y-2">
        {active.map((entry) => (
          <div
            key={entry.id}
            className="bg-[#141210] rounded-xl border border-[rgba(237,232,213,0.08)] px-4 py-3 space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium shrink-0", getCatColor(entry.category))}>
                {getCatLabel(entry.category)}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { setEditId(entry.id); setEditNote(entry.note); }}
                  className="p-1 text-[rgba(237,232,213,0.35)] hover:text-[rgba(237,232,213,0.55)] transition-colors"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => archiveEntry(entry.id)}
                  className="p-1 text-[rgba(237,232,213,0.35)] hover:text-[rgba(237,232,213,0.55)] transition-colors"
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
                  className="w-full border border-[rgba(237,232,213,0.08)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[rgba(237,232,213,0.15)] resize-none bg-[#1A1714] text-[#EDE8D5]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(entry.id)}
                    className="flex items-center gap-1 text-xs text-emerald-400 border border-emerald-900/30 rounded-lg px-2.5 py-1 hover:bg-emerald-900/20"
                  >
                    <Check size={12} /> Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="flex items-center gap-1 text-xs text-[rgba(237,232,213,0.55)] border border-[rgba(237,232,213,0.08)] rounded-lg px-2.5 py-1 hover:bg-[#1A1714]"
                  >
                    <X size={12} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#EDE8D5] leading-snug">{entry.note}</p>
            )}

            <p className="text-xs text-[rgba(237,232,213,0.35)]">
              {new Date(entry.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {archived.length > 0 && (
        <div>
          <button
            onClick={() => setShowArchived((s) => !s)}
            className="flex items-center gap-1.5 text-xs text-[rgba(237,232,213,0.45)] hover:text-[rgba(237,232,213,0.7)] transition-colors"
          >
            <Archive size={12} />
            {showArchived ? "Hide" : "Show"} {archived.length} archived
          </button>
          {showArchived && (
            <div className="mt-2 space-y-2">
              {archived.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-[#141210] rounded-xl border border-[rgba(237,232,213,0.08)] px-4 py-3 opacity-60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs text-[rgba(237,232,213,0.45)]">{getCatLabel(entry.category)}</span>
                    <button
                      onClick={() => restoreEntry(entry.id)}
                      className="text-xs text-[rgba(237,232,213,0.45)] hover:text-[rgba(237,232,213,0.7)]"
                    >
                      Restore
                    </button>
                  </div>
                  <p className="text-sm text-[rgba(237,232,213,0.45)] mt-1 leading-snug">{entry.note}</p>
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
    color: "bg-[rgba(200,146,58,0.08)] border-[rgba(200,146,58,0.25)]",
    labelColor: "text-[#F0B855]",
    role: "Internal boundary",
    desc: "Sits with the founder throughout. Asks the one question that tests whether something is ready. Does this hold?",
  },
  {
    zone: "Z0 + Z2",
    name: "Standby",
    icon: "⧖",
    color: "bg-[#141210] border-[rgba(237,232,213,0.15)]",
    labelColor: "text-[rgba(237,232,213,0.55)]",
    role: "Both sides",
    desc: "Holds the internal boundary (Z0) and sets the table (Z2) simultaneously. Runs the quick-set draft — agenda, synthesis, gate, and guest seats — before anyone sits down.",
  },
  {
    zone: "Z2",
    name: "Table Setter",
    icon: "⬡",
    color: "bg-[rgba(91,143,208,0.10)] border-[rgba(91,143,208,0.25)]",
    labelColor: "text-[#7CA9DE]",
    role: "Sets the table",
    desc: "Drafts the agenda skeleton from the canvas data before the meeting. The structure that gives Grok something to synthesize.",
  },
  {
    zone: "Grok",
    name: "Whiteboard",
    icon: "◈",
    color: "bg-[rgba(124,78,138,0.10)] border-[rgba(124,78,138,0.25)]",
    labelColor: "text-[#B98FCB]",
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
          <h2 className="text-base font-semibold text-[#EDE8D5]">Table Setup</h2>
          <p className="text-sm text-[rgba(237,232,213,0.55)] mt-0.5 leading-snug">
            Z2 sets the table. Grok synthesizes the agenda. The founder and Grok assign guest experts to line items before the agenda is finalized.
          </p>
        </div>
        <button
          onClick={runQuickSet}
          disabled={quickSetting}
          className={cn(
            "shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all",
            quickSetting
              ? "bg-[#1A1714] text-[rgba(237,232,213,0.35)] border-[rgba(237,232,213,0.08)] cursor-wait"
              : "bg-[#C8923A] text-[#0B0905] border-[#C8923A] hover:bg-[#F0B855]"
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
            ? "bg-[rgba(200,146,58,0.10)] border-[rgba(200,146,58,0.25)] text-[#F0B855]"
            : quickStatus.startsWith("Table set")
            ? "bg-[rgba(74,222,128,0.10)] border-[rgba(74,222,128,0.25)] text-[#4ADE80]"
            : "bg-[#141210] border-[rgba(237,232,213,0.08)] text-[rgba(237,232,213,0.55)]"
        )}>
          {quickStatus}
          {!quickSetting && (
            <button onClick={() => setQuickStatus("")} className="ml-2 opacity-60 hover:opacity-100">×</button>
          )}
        </div>
      )}

      {/* Finalized banner */}
      {config.agendaFinalized && (
        <div className="flex items-center gap-2.5 bg-[rgba(74,222,128,0.10)] border border-[rgba(74,222,128,0.25)] rounded-xl px-4 py-3">
          <Check size={15} className="text-[#4ADE80] shrink-0" />
          <p className="text-sm text-[#4ADE80] font-medium">Agenda finalized — table is set.</p>
          <button
            onClick={() => onChange({ ...config, agendaFinalized: false })}
            className="ml-auto text-xs text-[#4ADE80] hover:underline"
          >
            Reopen
          </button>
        </div>
      )}

      {/* Fixed seats */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[rgba(237,232,213,0.35)] uppercase tracking-wide">Fixed Seats</p>
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
                <span className="text-sm font-medium text-[#EDE8D5]">{seat.name}</span>
                <span className="text-xs text-[rgba(237,232,213,0.55)]">— {seat.role}</span>
              </div>
              <p className="text-xs text-[rgba(237,232,213,0.55)] mt-1 leading-snug">{seat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Agenda line items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[rgba(237,232,213,0.55)] uppercase tracking-wide">Agenda Line Items</p>
          {assignedCount > 0 && (
            <span className="text-xs text-[rgba(237,232,213,0.35)]">{assignedCount}/{config.agendaItems.length} assigned</span>
          )}
        </div>

        <div className="bg-[#141210] rounded-xl border border-[rgba(237,232,213,0.08)] divide-y divide-[rgba(237,232,213,0.05)] overflow-hidden">
          {config.agendaItems.length === 0 && (
            <p className="text-sm text-[rgba(237,232,213,0.35)] px-4 py-3">No items yet. Add the agenda line by line.</p>
          )}
          {config.agendaItems.map((item, idx) => (
            <div key={item.id} className="px-3 py-3 flex items-start gap-2">
              <span className="text-xs text-[rgba(237,232,213,0.35)] mt-1 w-5 shrink-0 text-right">{idx + 1}.</span>
              <p className="flex-1 text-sm text-[#EDE8D5] leading-snug">{item.text}</p>
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
                  className="text-xs border border-[rgba(237,232,213,0.08)] rounded-lg px-2 py-1 bg-[#1A1714] text-[rgba(237,232,213,0.55)] focus:outline-none"
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
                  className="p-1 text-[rgba(237,232,213,0.35)] hover:text-[rgba(239,68,68,0.7)] transition-colors"
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
            className="flex-1 border border-[rgba(237,232,213,0.08)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[rgba(237,232,213,0.15)] bg-[#1A1714] text-[#EDE8D5] placeholder-[rgba(237,232,213,0.35)]"
          />
          <button
            onClick={addItem}
            className="px-3 py-2 bg-[#C8923A] text-[#0B0905] rounded-xl text-sm hover:bg-[#F0B855] transition-colors"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Grok synthesis */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[rgba(237,232,213,0.55)] uppercase tracking-wide">Grok's Synthesis</p>
        <p className="text-xs text-[rgba(237,232,213,0.35)]">
          Where Z2's draft and Grok's read of the situation converge. What is this meeting actually for?
        </p>
        <textarea
          rows={3}
          value={config.agendaSynthesis}
          onChange={(e) => onChange({ ...config, agendaSynthesis: e.target.value, agendaFinalized: false })}
          placeholder="e.g. Three of the five items are symptoms of the same budget freeze. If that's not named, the meeting will produce four follow-ups and no decisions."
          className="w-full border border-[rgba(237,232,213,0.08)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[rgba(237,232,213,0.15)] resize-none bg-[#1A1714] text-[#EDE8D5] placeholder-[rgba(237,232,213,0.35)]"
        />
      </div>

      {/* Gate professional */}
      <div className="space-y-3">
        <button
          onClick={() => setOpenGate((o) => !o)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-start gap-2">
            <p className="text-xs font-semibold text-[rgba(237,232,213,0.55)] uppercase tracking-wide">Gate Professional</p>
            {config.gateProfessional.name && (
              <span className="text-xs text-[rgba(237,232,213,0.35)]">— {config.gateProfessional.name}</span>
            )}
          </div>
          {openGate ? <ChevronUp size={14} className="text-[rgba(237,232,213,0.35)]" /> : <ChevronDown size={14} className="text-[rgba(237,232,213,0.35)]" />}
        </button>

        {!openGate && (
          <p className="text-xs text-[rgba(237,232,213,0.35)] leading-snug">
            Every engagement has a licensed professional who holds the gate between what people need and what the regulatory system allows. Name them before the meeting.
          </p>
        )}

        {openGate && (
          <div className="bg-[#141210] rounded-xl border border-[rgba(237,232,213,0.08)] p-4 space-y-3">
            <p className="text-xs text-[rgba(237,232,213,0.35)] leading-snug">
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
                <label className="text-xs text-[rgba(237,232,213,0.55)]">{label}</label>
                <input
                  type="text"
                  value={config.gateProfessional[field]}
                  onChange={(e) => updateGate(field, e.target.value)}
                  placeholder={placeholder}
                  className="w-full border border-[rgba(237,232,213,0.08)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[rgba(237,232,213,0.15)] bg-[#1A1714] text-[#EDE8D5] placeholder-[rgba(237,232,213,0.35)]"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guest expert seats */}
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-[rgba(237,232,213,0.55)] uppercase tracking-wide">Guest Expert Seats</p>
          <p className="text-xs text-[rgba(237,232,213,0.35)] mt-1">
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
            <div key={idx} className="bg-[#141210] rounded-xl border border-[rgba(237,232,213,0.08)] overflow-hidden">
              <button
                onClick={() => setOpenGuest(isOpen ? null : idx)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#1A1714] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#1A1714] text-[#EDE8D5] text-xs font-semibold flex items-center justify-center shrink-0 border border-[rgba(237,232,213,0.08)]">
                    {idx + 1}
                  </span>
                  <div className="text-left">
                    <span className="text-sm font-medium text-[#EDE8D5]">
                      {seat.name || GUEST_LABELS[idx]}
                    </span>
                    {seat.role && (
                      <span className="text-xs text-[rgba(237,232,213,0.55)] ml-1.5">— {seat.role}</span>
                    )}
                    {assignedItems.length > 0 && (
                      <span className="ml-1.5 text-xs text-[rgba(237,232,213,0.35)]">
                        · item{assignedItems.length > 1 ? "s" : ""} {assignedItems.map((_, i) => config.agendaItems.indexOf(assignedItems[i]!) + 1).join(", ")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {seat.confirmed && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-800/30 rounded-full px-2 py-0.5">
                      <Check size={10} /> Confirmed
                    </span>
                  )}
                  {isOpen ? <ChevronUp size={14} className="text-[rgba(237,232,213,0.35)]" /> : <ChevronDown size={14} className="text-[rgba(237,232,213,0.35)]" />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-[rgba(237,232,213,0.08)] px-4 py-4 space-y-3">
                  {(
                    [
                      ["name", "Name", "Who is this person?"],
                      ["role", "Role", "Their title or function"],
                      ["expertise", "What they bring", "The specific expertise relevant to their assigned item"],
                    ] as [keyof GuestSeat, string, string][]
                  ).map(([field, label, placeholder]) => (
                    <div key={field} className="space-y-1">
                      <label className="text-xs text-[rgba(237,232,213,0.55)]">{label}</label>
                      <input
                        type="text"
                        value={seat[field] as string}
                        onChange={(e) => updateGuest(idx, field, e.target.value)}
                        placeholder={placeholder}
                        className="w-full border border-[rgba(237,232,213,0.08)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[rgba(237,232,213,0.15)] bg-[#1A1714] text-[#EDE8D5] placeholder-[rgba(237,232,213,0.35)]"
                      />
                    </div>
                  ))}

                  {assignedItems.length > 0 ? (
                    <div className="bg-[#1A1714] rounded-lg px-3 py-2">
                      <p className="text-xs text-[rgba(237,232,213,0.55)] font-medium mb-1">Assigned item{assignedItems.length > 1 ? "s" : ""}:</p>
                      {assignedItems.map((item) => (
                        <p key={item.id} className="text-xs text-[rgba(237,232,213,0.55)]">· {item.text}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[rgba(237,232,213,0.35)] italic">No agenda items assigned to this seat yet — use the dropdown on each item above.</p>
                  )}

                  <button
                    onClick={() => updateGuest(idx, "confirmed", !seat.confirmed)}
                    className={cn(
                      "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all",
                      seat.confirmed
                        ? "bg-emerald-900/20 text-emerald-400 border-emerald-800/30"
                        : "bg-[#141210] text-[rgba(237,232,213,0.55)] border-[rgba(237,232,213,0.08)] hover:border-[rgba(237,232,213,0.15)]"
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
                ? "bg-[#C8923A] text-[#0B0905] border-[#C8923A] hover:bg-[#F0B855]"
                : "bg-[rgba(237,232,213,0.05)] text-[rgba(237,232,213,0.35)] border-[rgba(237,232,213,0.08)] cursor-not-allowed"
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
          <h2 className="text-base font-semibold text-[#EDE8D5]" style={{ fontFamily: FONT_DISPLAY }}>Strategic Meeting Brief</h2>
          <p className="text-sm text-[rgba(237,232,213,0.55)] mt-0.5">
            A one-page discussion piece. Table it at the right moment — not as a pitch.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing((e) => !e)}
            className={cn(
              "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all",
              editing
                ? "bg-[#C8923A] text-[#0B0905] border-[#C8923A]"
                : "bg-[#141210] text-[#EDE8D5] border-[rgba(237,232,213,0.08)] hover:border-[rgba(237,232,213,0.15)]"
            )}
          >
            <Edit2 size={12} />
            {editing ? "Done" : "Edit"}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[rgba(237,232,213,0.08)] bg-[#141210] text-[#EDE8D5] hover:border-[rgba(237,232,213,0.15)] transition-all"
          >
            <Printer size={12} />
            Print
          </button>
        </div>
      </div>

      {editing && (
        <div className="bg-[rgba(200,146,58,0.12)] border border-[rgba(237,232,213,0.15)] rounded-xl p-4 space-y-3">
          <p className="text-xs font-medium text-[#C8923A] uppercase tracking-wide">Edit before sharing</p>
          <div className="space-y-1.5">
            <label className="text-xs text-[rgba(237,232,213,0.55)]">Pain points (override auto-populated)</label>
            <textarea
              rows={3}
              value={overrides.customPainPoints}
              onChange={(e) => onOverridesChange({ ...overrides, customPainPoints: e.target.value })}
              placeholder={painPointsText || "Leave blank to use canvas data"}
              className="w-full border border-[rgba(237,232,213,0.08)] rounded-lg px-3 py-2 text-sm focus:outline-none resize-none bg-[#1A1714] text-[#EDE8D5]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[rgba(237,232,213,0.55)]">Leverage notes (override auto-populated)</label>
            <textarea
              rows={3}
              value={overrides.customLeverage}
              onChange={(e) => onOverridesChange({ ...overrides, customLeverage: e.target.value })}
              placeholder={leverageText || "Leave blank to use leverage tracker"}
              className="w-full border border-[rgba(237,232,213,0.08)] rounded-lg px-3 py-2 text-sm focus:outline-none resize-none bg-[#1A1714] text-[#EDE8D5]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[rgba(237,232,213,0.55)]">Proposed next step</label>
            <input
              type="text"
              value={overrides.customNext}
              onChange={(e) => onOverridesChange({ ...overrides, customNext: e.target.value })}
              placeholder="e.g. One 90-min working session with the band manager"
              className="w-full border border-[rgba(237,232,213,0.08)] rounded-lg px-3 py-2 text-sm focus:outline-none bg-[#1A1714] text-[#EDE8D5]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[rgba(237,232,213,0.55)]">Confidential practitioner note (not printed)</label>
            <textarea
              rows={2}
              value={overrides.editorNote}
              onChange={(e) => onOverridesChange({ ...overrides, editorNote: e.target.value })}
              placeholder="Your private context — this stays off the page."
              className="w-full border border-[rgba(237,232,213,0.08)] rounded-lg px-3 py-2 text-sm focus:outline-none resize-none bg-[#1A1714] text-[#EDE8D5]"
            />
          </div>
        </div>
      )}

      {/* The printable brief */}
      <div
        ref={briefRef}
        id="meeting-brief-print"
        className="bg-[#141210] border border-[rgba(237,232,213,0.08)] rounded-xl p-6 space-y-6 print:border-0 print:shadow-none print:p-0 print:bg-white print:text-black"
      >
        {/* Header */}
        <div className="space-y-1 border-b border-[rgba(237,232,213,0.08)] pb-4 print:border-stone-200">
          <p className="text-xs text-[rgba(237,232,213,0.35)] uppercase tracking-widest print:text-stone-500">Strategic Meeting Brief</p>
          <h3 className="text-xl font-semibold text-[#EDE8D5] print:text-black">
            {org.name || "Organization Name"}
          </h3>
          <p className="text-sm text-[rgba(237,232,213,0.55)] print:text-stone-600">
            {org.cadence || "Meeting cadence not specified"}
            {org.attendeeRoles ? ` · ${org.attendeeRoles}` : ""}
          </p>
        </div>

        {/* Core position */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-[#EDE8D5] uppercase tracking-wide print:text-black">The Position</h4>
          <p className="text-sm text-[rgba(237,232,213,0.55)] leading-relaxed print:text-stone-800">
            Every organization has a meeting rhythm that already works — partially. The goal here is not to replace what you have. It is to understand what it costs you, what it's missing, and what can be quietly improved without disrupting the people inside it.
          </p>
          <p className="text-sm text-[rgba(237,232,213,0.55)] leading-relaxed print:text-stone-800">
            Systems are under pressure. People are leaving. The people who depend most on this organization's services are often the least visible in the room. The pace of change must be controlled — not because change isn't needed, but because a free fall helps no one.
          </p>
        </div>

        {/* The approach */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-[#EDE8D5] uppercase tracking-wide print:text-black">The Approach</h4>
          <div className="grid grid-cols-1 gap-2">
            {[
              { step: "1", label: "Meet where you are", desc: "Work inside your existing meeting structure. No new formats, no new jargon." },
              { step: "2", label: "Find the efficiencies", desc: "Identify where time, capacity, and money are quietly leaking — in the org's own language." },
              { step: "3", label: "Solve behind the scenes", desc: "Fix the system without making the fix visible. Change the outcome, not the meeting." },
              { step: "4", label: "Protect the vulnerable", desc: "Any change that reduces service to the most dependent members moves last, not first." },
              { step: "5", label: "Controlled pace, not free fall", desc: "You cannot demolish while a thousand people are living inside. Change at the speed the system can absorb." },
            ].map(({ step, label, desc }) => (
              <div key={step} className="flex gap-3 items-start">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#1A1714] text-[#EDE8D5] text-xs font-semibold flex items-center justify-center mt-0.5 border border-[rgba(237,232,213,0.08)] print:bg-stone-100 print:text-stone-800 print:border-stone-200">
                  {step}
                </span>
                <div>
                  <span className="text-sm font-medium text-[#EDE8D5] print:text-black">{label} — </span>
                  <span className="text-sm text-[rgba(237,232,213,0.55)] print:text-stone-600">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What we're seeing */}
        {(painPointsText || highFindings.length > 0) && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[#EDE8D5] uppercase tracking-wide print:text-black">What We're Seeing</h4>
            {painPointsText && (
              <p className="text-sm text-[rgba(237,232,213,0.55)] leading-relaxed whitespace-pre-line print:text-stone-800">{painPointsText}</p>
            )}
            {highFindings.length > 0 && (
              <ul className="space-y-1">
                {highFindings.map((f, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[rgba(237,232,213,0.55)] print:text-stone-800">
                    <span className="shrink-0 text-[rgba(239,68,68,0.7)] mt-0.5">▲</span>
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
            <h4 className="text-xs font-semibold text-[#EDE8D5] uppercase tracking-wide print:text-black">Economic Context</h4>
            <p className="text-sm text-[rgba(237,232,213,0.55)] leading-relaxed whitespace-pre-line print:text-stone-800">{leverageText}</p>
          </div>
        )}

        {/* Proposed next step */}
        <div className="space-y-2 border-t border-[rgba(237,232,213,0.08)] pt-4 print:border-stone-200">
          <h4 className="text-xs font-semibold text-[#EDE8D5] uppercase tracking-wide print:text-black">Proposed Next Step</h4>
          <p className="text-sm text-[rgba(237,232,213,0.55)] leading-relaxed print:text-stone-800">
            {overrides.customNext ||
              "One bounded, paid working session to map the current system and identify the first quiet improvement."}
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-[rgba(237,232,213,0.08)] pt-4 print:border-stone-200">
          <p className="text-xs text-[rgba(237,232,213,0.35)] text-center print:text-stone-500">
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

      <div className="min-h-dvh bg-[#0B0905] pb-28">
        <div className="px-4 pt-5 pb-2 max-w-lg mx-auto">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-[#EDE8D5]">Meeting Kit</h1>
              <p className="text-sm text-[rgba(237,232,213,0.55)] mt-0.5 leading-snug">
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
            <div className="w-12 h-12 rounded-full bg-[#1A1714] flex items-center justify-center mx-auto">
              <Plus size={22} className="text-[rgba(237,232,213,0.35)]" />
            </div>
            <div>
              <p className="text-base font-medium text-[#EDE8D5]">No organization yet</p>
              <p className="text-sm text-[rgba(237,232,213,0.55)] mt-1">
                Add an org to start mapping their meeting rhythm.
              </p>
            </div>
            <button
              onClick={createOrg}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C8923A] text-[#0B0905] rounded-xl text-sm hover:bg-[#F0B855] transition-colors font-medium"
            >
              <Plus size={15} />
              Add first organization
            </button>
          </div>
        ) : (
          <>
            {/* Tab bar */}
            <div className="sticky top-0 z-20 bg-[#0B0905]/95 backdrop-blur-sm border-b border-[rgba(237,232,213,0.08)]">
              <div className="max-w-lg mx-auto px-4 flex items-center gap-0 overflow-x-auto">
                {TABS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={cn(
                      "shrink-0 px-4 py-3 text-sm border-b-2 transition-all",
                      tab === id
                        ? "border-[#C8923A] text-[#EDE8D5] font-semibold"
                        : "border-transparent text-[rgba(237,232,213,0.45)] hover:text-[rgba(237,232,213,0.7)]"
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
