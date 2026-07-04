import { useState, useCallback } from "react";
import {
  Search,
  Tag,
  Database,
  Download,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertTriangle,
  FileText,
  X,
  Edit3,
  Check,
} from "lucide-react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import type { ZoneId, ArchiveContentType, ContentBankItem } from "@/types";
import { BG, SURFACE, SURFACE_2, BORDER, BORDER_STRONG, TEXT, TEXT_2, TEXT_3, AMBER, AMBER_LIGHT, AMBER_WASH, RED, GREEN } from "@/lib/theme";

const BASE_API = "/api";

interface ArchiveThread {
  id: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
  body?: string;
}

type Tab = "search" | "bank";

const ZONE_LABELS: Record<ZoneId, string> = {
  Z0: "Z0 — Center",
  Z1: "Z1 — Income",
  Z2: "Z2 — Contract",
  Z3: "Z3 — Future",
  Z4: "Z4 — Community",
  Z5: "Z5 — Wild",
};

const ZONE_COLORS: Record<ZoneId, string> = {
  Z0: "bg-[#FDF6E3] text-[#8A6A1A]",
  Z1: "bg-[#D1E7DB] text-[#1D4430]",
  Z2: "bg-[#DBEAFE] text-[#1E3A5F]",
  Z3: "bg-[#EDE9FE] text-[#3B1F6E]",
  Z4: "bg-[#FEF3C7] text-[#78350F]",
  Z5: "bg-[#E8EDF0] text-[#4A6272]",
};

const CONTENT_TYPE_LABELS: Record<ArchiveContentType, string> = {
  "course-material": "Course material",
  "email-sequence": "Email sequence",
  "case-study": "Case study",
  "voice-sample": "Voice sample",
  discard: "Discard",
};

const CONTENT_TYPE_COLORS: Record<ArchiveContentType, string> = {
  "course-material": "bg-emerald-900/30 text-emerald-400 border border-emerald-800",
  "email-sequence": "bg-blue-900/30 text-blue-400 border border-blue-800",
  "case-study": "bg-purple-900/30 text-purple-400 border border-purple-800",
  "voice-sample": "bg-amber-900/30 text-amber-400 border border-amber-800",
  discard: "bg-stone-800/50 text-stone-500 border border-stone-700",
};

const PRESET_OPTIONS = [
  { value: "mailchimp", label: "Mailchimp campaigns", zone: "Z3" as ZoneId },
  { value: "z1-income", label: "CRA / accounting (Z1)", zone: "Z1" as ZoneId },
  { value: "z2-contract", label: "Contract threads (Z2)", zone: "Z2" as ZoneId },
  { value: "z3-future", label: "Course / training (Z3)", zone: "Z3" as ZoneId },
  { value: "z4-community", label: "Community correspondence (Z4)", zone: "Z4" as ZoneId },
];

function TaggingPanel({
  thread,
  existingItem,
  onTag,
  onClose,
}: {
  thread: ArchiveThread;
  existingItem?: ContentBankItem;
  onTag: (zone: ZoneId, contentType: ArchiveContentType, notes: string) => void;
  onClose: () => void;
}) {
  const [zone, setZone] = useState<ZoneId>(existingItem?.zone ?? "Z1");
  const [contentType, setContentType] = useState<ArchiveContentType>(
    existingItem?.contentType ?? "course-material",
  );
  const [notes, setNotes] = useState(existingItem?.notes ?? "");

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div 
        className="w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border"
        style={{ backgroundColor: SURFACE, borderColor: BORDER_STRONG }}
      >
        <div 
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{ borderColor: BORDER }}
        >
          <p className="text-sm font-medium truncate pr-4" style={{ color: TEXT }}>{thread.subject}</p>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/5"
            style={{ color: TEXT_2 }}
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-4 py-4 space-y-4">
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: TEXT_3 }}>Zone</p>
            <div className="grid grid-cols-2 gap-2">
              {(["Z1", "Z2", "Z3", "Z4"] as ZoneId[]).map((z) => (
                <button
                  key={z}
                  onClick={() => setZone(z)}
                  className={cn(
                    "py-2 px-3 rounded-lg text-xs font-medium border transition-colors",
                  )}
                  style={{ 
                    backgroundColor: zone === z ? AMBER : SURFACE_2,
                    borderColor: zone === z ? AMBER : BORDER,
                    color: zone === z ? BG : TEXT
                  }}
                >
                  {ZONE_LABELS[z]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium mb-2" style={{ color: TEXT_3 }}>Content type</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CONTENT_TYPE_LABELS) as ArchiveContentType[]).map((ct) => (
                <button
                  key={ct}
                  onClick={() => setContentType(ct)}
                  className={cn(
                    "py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors",
                  )}
                  style={{ 
                    backgroundColor: contentType === ct ? AMBER : SURFACE_2,
                    borderColor: contentType === ct ? AMBER : BORDER,
                    color: contentType === ct ? BG : TEXT
                  }}
                >
                  {CONTENT_TYPE_LABELS[ct]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium mb-2" style={{ color: TEXT_3 }}>Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why this thread matters, what to pull from it…"
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none"
              style={{ backgroundColor: BG, borderColor: BORDER, color: TEXT }}
            />
          </div>

          <button
            onClick={() => onTag(zone, contentType, notes)}
            className="w-full rounded-xl py-3 text-sm font-medium min-h-[44px]"
            style={{ backgroundColor: AMBER, color: BG }}
          >
            {existingItem ? "Update tag" : "Add to Content Bank"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchTab() {
  const contentBank = useStore((s) => s.contentBank);
  const addToContentBank = useStore((s) => s.addToContentBank);
  const updateContentBankItem = useStore((s) => s.updateContentBankItem);

  const [preset, setPreset] = useState("");
  const [customQ, setCustomQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [threads, setThreads] = useState<ArchiveThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<"scope" | "unavailable" | null>(null);
  const [taggingThread, setTaggingThread] = useState<ArchiveThread | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bodyCache, setBodyCache] = useState<Record<string, string>>({});
  const [loadingBodyId, setLoadingBodyId] = useState<string | null>(null);

  const toggleExpand = useCallback(async (t: ArchiveThread) => {
    if (expandedId === t.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(t.id);
    if (bodyCache[t.id] !== undefined) return;
    setLoadingBodyId(t.id);
    try {
      const r = await fetch(`${BASE_API}/inbox/thread/${t.id}/body`);
      if (r.ok) {
        const data: { body: string } = await r.json();
        setBodyCache((prev) => ({ ...prev, [t.id]: data.body }));
      } else {
        setBodyCache((prev) => ({ ...prev, [t.id]: "" }));
      }
    } catch {
      setBodyCache((prev) => ({ ...prev, [t.id]: "" }));
    } finally {
      setLoadingBodyId(null);
    }
  }, [expandedId, bodyCache]);

  const runSearch = useCallback(async () => {
    if (!preset && !customQ.trim()) return;
    setLoading(true);
    setError(null);
    setThreads([]);
    setExpandedId(null);

    const params = new URLSearchParams();
    if (preset) params.set("preset", preset);
    if (customQ.trim()) params.set("q", customQ.trim());
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    params.set("maxResults", "30");

    try {
      const r = await fetch(`${BASE_API}/inbox/archive?${params.toString()}`);
      if (r.status === 403) {
        setError("scope");
        setLoading(false);
        return;
      }
      if (!r.ok) throw new Error("unavailable");
      const data: ArchiveThread[] = await r.json();
      setThreads(data);
    } catch {
      setError("unavailable");
    } finally {
      setLoading(false);
    }
  }, [preset, customQ, dateFrom, dateTo]);

  function handleTag(thread: ArchiveThread, zone: ZoneId, contentType: ArchiveContentType, notes: string) {
    const existing = contentBank.find((x) => x.threadId === thread.id);
    if (existing) {
      updateContentBankItem(existing.id, { zone, contentType, notes });
    } else {
      addToContentBank({
        threadId: thread.id,
        subject: thread.subject,
        from: thread.from,
        snippet: thread.snippet,
        date: thread.date,
        zone,
        contentType,
        notes,
      });
    }
    setTaggingThread(null);
  }

  const bankIds = new Set(contentBank.map((x) => x.threadId));

  return (
    <div className="space-y-4">
      <div 
        className="rounded-xl border overflow-hidden"
        style={{ backgroundColor: SURFACE, borderColor: BORDER }}
      >
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full flex items-center justify-between px-4 py-3 min-h-[44px]"
          style={{ color: TEXT }}
        >
          <div className="flex items-center gap-2">
            <Search size={15} style={{ color: TEXT_3 }} />
            <span className="text-sm font-medium">Search filters</span>
          </div>
          {filtersOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {filtersOpen && (
          <div 
            className="border-t px-4 py-4 space-y-4"
            style={{ borderColor: BORDER }}
          >
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: TEXT_3 }}>Quick preset</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_OPTIONS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPreset(preset === p.value ? "" : p.value)}
                    className={cn(
                      "py-1.5 px-3 rounded-lg text-xs border transition-colors",
                    )}
                    style={{ 
                      backgroundColor: preset === p.value ? AMBER : SURFACE_2,
                      borderColor: preset === p.value ? AMBER : BORDER,
                      color: preset === p.value ? BG : TEXT_2
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium mb-2" style={{ color: TEXT_3 }}>Custom Gmail query</p>
              <input
                value={customQ}
                onChange={(e) => setCustomQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSearch()}
                placeholder='e.g. subject:"food hub" OR from:partner@'
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                style={{ backgroundColor: BG, borderColor: BORDER, color: TEXT }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: TEXT_3 }}>From date</p>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  style={{ backgroundColor: BG, borderColor: BORDER, color: TEXT }}
                />
              </div>
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: TEXT_3 }}>To date</p>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  style={{ backgroundColor: BG, borderColor: BORDER, color: TEXT }}
                />
              </div>
            </div>

            <button
              onClick={runSearch}
              disabled={loading || (!preset && !customQ.trim())}
              className="w-full rounded-xl py-3 text-sm font-medium min-h-[44px] disabled:opacity-40 flex items-center justify-center gap-2"
              style={{ backgroundColor: AMBER, color: BG }}
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? "Searching…" : "Search archive"}
            </button>
          </div>
        )}
      </div>

      {error === "scope" && (
        <div 
          className="rounded-xl border px-4 py-3 flex items-start gap-3"
          style={{ backgroundColor: AMBER_WASH, borderColor: AMBER }}
        >
          <AlertTriangle size={15} style={{ color: AMBER }} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium" style={{ color: AMBER_LIGHT }}>Gmail read access needed</p>
            <p className="text-xs mt-0.5" style={{ color: TEXT_2 }}>
              The Gmail connection needs the <strong>gmail.readonly</strong> scope. Reconnect it in the Replit integrations panel.
            </p>
          </div>
        </div>
      )}

      {error === "unavailable" && (
        <div 
          className="rounded-xl border px-4 py-3 flex items-start gap-3"
          style={{ backgroundColor: RED, borderColor: "rgba(239,68,68,0.3)" }}
        >
          <AlertTriangle size={15} className="mt-0.5 shrink-0" style={{ color: TEXT }} />
          <p className="text-sm" style={{ color: TEXT }}>Gmail connector unavailable. Check your connection settings.</p>
        </div>
      )}

      {!loading && threads.length === 0 && !error && (
        <div className="text-center py-10 text-sm" style={{ color: TEXT_3 }}>
          Choose a preset or enter a query, then tap Search.
        </div>
      )}

      {threads.length > 0 && (
        <div 
          className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: SURFACE, borderColor: BORDER }}
        >
          <div 
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{ borderColor: BORDER }}
          >
            <p className="text-sm font-medium" style={{ color: TEXT }}>{threads.length} threads found</p>
            <p className="text-xs" style={{ color: TEXT_3 }}>Tap a row to read · tag icon to tag</p>
          </div>
          <div className="divide-y">
            {threads.map((t) => {
              const inBank = bankIds.has(t.id);
              const isExpanded = expandedId === t.id;
              const isLoadingBody = loadingBodyId === t.id;
              const body = bodyCache[t.id];

              return (
                <div key={t.id} className="px-4 py-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleExpand(t)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium truncate" style={{ color: TEXT }}>{t.subject}</p>
                        {inBank && (
                          <span className="text-xs rounded-full px-2 py-0.5 shrink-0" style={{ backgroundColor: AMBER_WASH, color: AMBER_LIGHT }}>
                            ✓ Tagged
                          </span>
                        )}
                        {isExpanded
                          ? <ChevronUp size={13} style={{ color: TEXT_3 }} className="shrink-0" />
                          : <ChevronDown size={13} style={{ color: TEXT_3 }} className="shrink-0" />
                        }
                      </div>
                      <p className="text-xs truncate" style={{ color: TEXT_2 }}>{t.from}</p>
                      {!isExpanded && (
                        <p className="text-xs line-clamp-2 mt-0.5" style={{ color: TEXT_2 }}>{t.snippet}</p>
                      )}
                      <p className="text-xs mt-1" style={{ color: TEXT_3 }}>{t.date}</p>
                    </button>
                    <button
                      onClick={() => setTaggingThread(t)}
                      className="shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/5"
                      title="Tag this thread"
                    >
                      <Tag size={16} className={inBank ? "text-emerald-400" : ""} style={{ color: inBank ? undefined : TEXT_3 }} />
                    </button>
                  </div>

                  {isExpanded && (
                    <div 
                      className="mt-2 rounded-lg border px-3 py-3"
                      style={{ backgroundColor: BG, borderColor: BORDER }}
                    >
                      {isLoadingBody ? (
                        <div className="flex items-center gap-2 text-xs" style={{ color: TEXT_3 }}>
                          <Loader2 size={12} className="animate-spin" />
                          Loading preview…
                        </div>
                      ) : body ? (
                        <p className="text-xs whitespace-pre-wrap leading-relaxed font-mono" style={{ color: TEXT_2 }}>
                          {body}
                        </p>
                      ) : (
                        <p className="text-xs italic" style={{ color: TEXT_3 }}>
                          No plain-text body found for this message.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {taggingThread && (
        <TaggingPanel
          thread={taggingThread}
          existingItem={contentBank.find((x) => x.threadId === taggingThread.id)}
          onTag={(zone, contentType, notes) => handleTag(taggingThread, zone, contentType, notes)}
          onClose={() => setTaggingThread(null)}
        />
      )}
    </div>
  );
}

function EditNoteModal({
  item,
  onSave,
  onClose,
}: {
  item: ContentBankItem;
  onSave: (patch: Partial<ContentBankItem>) => void;
  onClose: () => void;
}) {
  const [zone, setZone] = useState<ZoneId>(item.zone);
  const [contentType, setContentType] = useState<ArchiveContentType>(item.contentType);
  const [notes, setNotes] = useState(item.notes);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div 
        className="w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border"
        style={{ backgroundColor: SURFACE, borderColor: BORDER_STRONG }}
      >
        <div 
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{ borderColor: BORDER }}
        >
          <p className="text-sm font-medium truncate pr-4" style={{ color: TEXT }}>{item.subject}</p>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/5"
            style={{ color: TEXT_2 }}
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-4 py-4 space-y-4">
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: TEXT_3 }}>Zone</p>
            <div className="grid grid-cols-2 gap-2">
              {(["Z1", "Z2", "Z3", "Z4"] as ZoneId[]).map((z) => (
                <button
                  key={z}
                  onClick={() => setZone(z)}
                  className={cn(
                    "py-2 px-3 rounded-lg text-xs font-medium border transition-colors",
                  )}
                  style={{ 
                    backgroundColor: zone === z ? AMBER : SURFACE_2,
                    borderColor: zone === z ? AMBER : BORDER,
                    color: zone === z ? BG : TEXT
                  }}
                >
                  {ZONE_LABELS[z]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: TEXT_3 }}>Content type</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CONTENT_TYPE_LABELS) as ArchiveContentType[]).map((ct) => (
                <button
                  key={ct}
                  onClick={() => setContentType(ct)}
                  className={cn(
                    "py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors",
                  )}
                  style={{ 
                    backgroundColor: contentType === ct ? AMBER : SURFACE_2,
                    borderColor: contentType === ct ? AMBER : BORDER,
                    color: contentType === ct ? BG : TEXT
                  }}
                >
                  {CONTENT_TYPE_LABELS[ct]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: TEXT_3 }}>Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none"
              style={{ backgroundColor: BG, borderColor: BORDER, color: TEXT }}
            />
          </div>
          <button
            onClick={() => { onSave({ zone, contentType, notes }); onClose(); }}
            className="w-full rounded-xl py-3 text-sm font-medium min-h-[44px]"
            style={{ backgroundColor: AMBER, color: BG }}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function ContentBankTab() {
  const contentBank = useStore((s) => s.contentBank);
  const updateContentBankItem = useStore((s) => s.updateContentBankItem);
  const removeFromContentBank = useStore((s) => s.removeFromContentBank);
  const [editingItem, setEditingItem] = useState<ContentBankItem | null>(null);
  const [exportFormat, setExportFormat] = useState<"markdown" | "csv">("markdown");

  const zones: ZoneId[] = ["Z1", "Z2", "Z3", "Z4"];
  const byZone = zones.reduce<Record<ZoneId, ContentBankItem[]>>(
    (acc, z) => {
      acc[z] = contentBank.filter((x) => x.zone === z && x.contentType !== "discard");
      return acc;
    },
    { Z0: [], Z1: [], Z2: [], Z3: [], Z4: [], Z5: [] },
  );

  function exportMarkdown() {
    const lines: string[] = ["# Content Bank Export\n"];
    for (const z of zones) {
      const items = contentBank.filter((x) => x.zone === z);
      if (items.length === 0) continue;
      lines.push(`## ${ZONE_LABELS[z]}\n`);
      for (const item of items) {
        lines.push(`### ${item.subject}`);
        lines.push(`- **From:** ${item.from}`);
        lines.push(`- **Date:** ${item.date}`);
        lines.push(`- **Type:** ${CONTENT_TYPE_LABELS[item.contentType]}`);
        lines.push(`- **Snippet:** ${item.snippet}`);
        if (item.notes) lines.push(`- **Notes:** ${item.notes}`);
        lines.push("");
      }
    }
    download("content-bank.md", lines.join("\n"), "text/markdown");
  }

  function exportCSV() {
    const header = "Zone,Content Type,Subject,From,Date,Snippet,Notes";
    const rows = contentBank.map((item) =>
      [
        item.zone,
        CONTENT_TYPE_LABELS[item.contentType],
        `"${item.subject.replace(/"/g, '""')}"`,
        `"${item.from.replace(/"/g, '""')}"`,
        item.date,
        `"${item.snippet.replace(/"/g, '""')}"`,
        `"${(item.notes ?? "").replace(/"/g, '""')}"`,
      ].join(","),
    );
    download("content-bank.csv", [header, ...rows].join("\n"), "text/csv");
  }

  function download(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (contentBank.length === 0) {
    return (
      <div className="text-center py-16 space-y-2">
        <Database size={32} className="mx-auto" style={{ color: BORDER_STRONG }} />
        <p className="text-sm" style={{ color: TEXT_3 }}>No items in the Content Bank yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div 
        className="rounded-xl border px-4 py-4 space-y-4"
        style={{ backgroundColor: SURFACE, borderColor: BORDER }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium" style={{ color: TEXT }}>Export items</h3>
          <div className="flex p-1 rounded-lg" style={{ backgroundColor: SURFACE_2 }}>
            {(["markdown", "csv"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setExportFormat(f)}
                className={cn(
                  "px-3 py-1 text-xs rounded-md transition-all capitalize",
                  exportFormat === f ? "shadow-sm" : ""
                )}
                style={{ 
                  backgroundColor: exportFormat === f ? AMBER : "transparent",
                  color: exportFormat === f ? BG : TEXT_2
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={exportFormat === "markdown" ? exportMarkdown : exportCSV}
          className="w-full rounded-xl py-3 text-sm font-medium min-h-[44px] flex items-center justify-center gap-2"
          style={{ backgroundColor: AMBER, color: BG }}
        >
          <Download size={14} /> Download Content Bank ({contentBank.length})
        </button>
      </div>

      <div className="space-y-8">
        {zones.map((z) => {
          const items = byZone[z];
          if (items.length === 0) return null;
          return (
            <div key={z} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: AMBER }} />
                <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: TEXT_2 }}>
                  {ZONE_LABELS[z]}
                </h2>
                <span className="text-xs tabular-nums" style={{ color: TEXT_3 }}>({items.length})</span>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border px-4 py-4 space-y-3"
                    style={{ backgroundColor: SURFACE, borderColor: BORDER }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full", CONTENT_TYPE_COLORS[item.contentType])}>
                            {CONTENT_TYPE_LABELS[item.contentType]}
                          </span>
                          <span className="text-xs" style={{ color: TEXT_3 }}>{item.date}</span>
                        </div>
                        <h4 className="text-sm font-medium" style={{ color: TEXT }}>{item.subject}</h4>
                        <p className="text-xs mt-0.5" style={{ color: TEXT_2 }}>{item.from}</p>
                      </div>
                      <div className="flex shrink-0">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/5"
                          style={{ color: TEXT_3 }}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => removeFromContentBank(item.id)}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-red-500/10 hover:text-red-400"
                          style={{ color: TEXT_3 }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <div 
                      className="text-xs border-l-2 pl-3 py-1"
                      style={{ color: TEXT_2, borderColor: BORDER_STRONG }}
                    >
                      {item.snippet}
                    </div>
                    {item.notes && (
                      <div 
                        className="rounded-lg px-3 py-2 text-xs"
                        style={{ backgroundColor: SURFACE_2, color: TEXT }}
                      >
                        <span className="font-semibold" style={{ color: AMBER }}>Note:</span> {item.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {editingItem && (
        <EditNoteModal
          item={editingItem}
          onSave={(patch) => updateContentBankItem(editingItem.id, patch)}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}

export function ArchiveMiningPage() {
  const [activeTab, setActiveTab] = useState<Tab>("search");

  return (
    <div className="min-h-dvh" style={{ backgroundColor: BG }}>
      <div className="px-4 pt-6 pb-20 max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-medium" style={{ fontFamily: "Fraunces, serif", color: TEXT }}>Archive Mining</h1>
          <p className="text-sm" style={{ color: TEXT_2 }}>Sift through your history for course material and case studies.</p>
        </div>

        <div className="flex p-1 rounded-2xl" style={{ backgroundColor: SURFACE_2 }}>
          <button
            onClick={() => setActiveTab("search")}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium rounded-xl transition-all min-h-[44px] flex items-center justify-center gap-2",
              activeTab === "search" ? "shadow-sm" : ""
            )}
            style={{ 
              backgroundColor: activeTab === "search" ? AMBER : "transparent",
              color: activeTab === "search" ? BG : TEXT_2 
            }}
          >
            <Search size={16} /> Search
          </button>
          <button
            onClick={() => setActiveTab("bank")}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium rounded-xl transition-all min-h-[44px] flex items-center justify-center gap-2",
              activeTab === "bank" ? "shadow-sm" : ""
            )}
            style={{ 
              backgroundColor: activeTab === "bank" ? AMBER : "transparent",
              color: activeTab === "bank" ? BG : TEXT_2 
            }}
          >
            <Database size={16} /> Content Bank
          </button>
        </div>

        {activeTab === "search" ? <SearchTab /> : <ContentBankTab />}
      </div>
    </div>
  );
}
