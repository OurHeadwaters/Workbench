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
  Z1: "Z1 — Income",
  Z2: "Z2 — Contract",
  Z3: "Z3 — Future",
  Z4: "Z4 — Community",
};

const ZONE_COLORS: Record<ZoneId, string> = {
  Z1: "bg-[#D1E7DB] text-[#1D4430]",
  Z2: "bg-[#DBEAFE] text-[#1E3A5F]",
  Z3: "bg-[#EDE9FE] text-[#3B1F6E]",
  Z4: "bg-[#FEF3C7] text-[#78350F]",
};

const CONTENT_TYPE_LABELS: Record<ArchiveContentType, string> = {
  "course-material": "Course material",
  "email-sequence": "Email sequence",
  "case-study": "Case study",
  "voice-sample": "Voice sample",
  discard: "Discard",
};

const CONTENT_TYPE_COLORS: Record<ArchiveContentType, string> = {
  "course-material": "bg-emerald-100 text-emerald-800",
  "email-sequence": "bg-blue-100 text-blue-800",
  "case-study": "bg-purple-100 text-purple-800",
  "voice-sample": "bg-amber-100 text-amber-800",
  discard: "bg-stone-100 text-stone-500",
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E7E5E4] flex items-center justify-between">
          <p className="text-sm font-medium truncate pr-4">{thread.subject}</p>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-[#F5F5F0]"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-4 py-4 space-y-4">
          <div>
            <p className="text-xs font-medium text-[#78716C] mb-2">Zone</p>
            <div className="grid grid-cols-2 gap-2">
              {(["Z1", "Z2", "Z3", "Z4"] as ZoneId[]).map((z) => (
                <button
                  key={z}
                  onClick={() => setZone(z)}
                  className={cn(
                    "py-2 px-3 rounded-lg text-xs font-medium border transition-colors",
                    zone === z
                      ? "border-[#1C1917] bg-[#1C1917] text-white"
                      : "border-[#E7E5E4] hover:bg-[#F5F5F0]",
                  )}
                >
                  {ZONE_LABELS[z]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-[#78716C] mb-2">Content type</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CONTENT_TYPE_LABELS) as ArchiveContentType[]).map((ct) => (
                <button
                  key={ct}
                  onClick={() => setContentType(ct)}
                  className={cn(
                    "py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors",
                    contentType === ct
                      ? "border-[#1C1917] bg-[#1C1917] text-white"
                      : "border-[#E7E5E4] hover:bg-[#F5F5F0]",
                  )}
                >
                  {CONTENT_TYPE_LABELS[ct]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-[#78716C] mb-2">Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why this thread matters, what to pull from it…"
              rows={3}
              className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9] focus:outline-none focus:ring-2 focus:ring-[#1C1917] resize-none"
            />
          </div>

          <button
            onClick={() => onTag(zone, contentType, notes)}
            className="w-full bg-[#1C1917] text-white rounded-xl py-3 text-sm font-medium min-h-[44px]"
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
      <div className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full flex items-center justify-between px-4 py-3 min-h-[44px]"
        >
          <div className="flex items-center gap-2">
            <Search size={15} className="text-[#78716C]" />
            <span className="text-sm font-medium">Search filters</span>
          </div>
          {filtersOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {filtersOpen && (
          <div className="border-t border-[#E7E5E4] px-4 py-4 space-y-4">
            <div>
              <p className="text-xs font-medium text-[#78716C] mb-2">Quick preset</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_OPTIONS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPreset(preset === p.value ? "" : p.value)}
                    className={cn(
                      "py-1.5 px-3 rounded-lg text-xs border transition-colors",
                      preset === p.value
                        ? "border-[#1C1917] bg-[#1C1917] text-white"
                        : "border-[#E7E5E4] hover:bg-[#F5F5F0] text-[#44403C]",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-[#78716C] mb-2">Custom Gmail query</p>
              <input
                value={customQ}
                onChange={(e) => setCustomQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSearch()}
                placeholder='e.g. subject:"food hub" OR from:partner@'
                className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9] focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-[#78716C] mb-1">From date</p>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9] focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-[#78716C] mb-1">To date</p>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9] focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
                />
              </div>
            </div>

            <button
              onClick={runSearch}
              disabled={loading || (!preset && !customQ.trim())}
              className="w-full bg-[#1C1917] text-white rounded-xl py-3 text-sm font-medium min-h-[44px] disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? "Searching…" : "Search archive"}
            </button>
          </div>
        )}
      </div>

      {error === "scope" && (
        <div className="rounded-xl border border-[#FCD34D] bg-[#FFFBEB] px-4 py-3 flex items-start gap-3">
          <AlertTriangle size={15} className="text-[#92400E] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-[#92400E]">Gmail read access needed</p>
            <p className="text-xs text-[#78350F] mt-0.5">
              The Gmail connection needs the <strong>gmail.readonly</strong> scope. Reconnect it in the Replit integrations panel.
            </p>
          </div>
        </div>
      )}

      {error === "unavailable" && (
        <div className="rounded-xl border border-[#FCD34D] bg-[#FFFBEB] px-4 py-3 flex items-start gap-3">
          <AlertTriangle size={15} className="text-[#92400E] mt-0.5 shrink-0" />
          <p className="text-sm text-[#92400E]">Gmail connector unavailable. Check your connection settings.</p>
        </div>
      )}

      {!loading && threads.length === 0 && !error && (
        <div className="text-center py-10 text-sm text-[#78716C]">
          Choose a preset or enter a query, then tap Search.
        </div>
      )}

      {threads.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E7E5E4] flex items-center justify-between">
            <p className="text-sm font-medium">{threads.length} threads found</p>
            <p className="text-xs text-[#78716C]">Tap a row to read · tag icon to tag</p>
          </div>
          <div className="divide-y divide-[#E7E5E4]">
            {threads.map((t) => {
              const inBank = bankIds.has(t.id);
              const isExpanded = expandedId === t.id;
              const isLoadingBody = loadingBodyId === t.id;
              const body = bodyCache[t.id];

              return (
                <div key={t.id} className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleExpand(t)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium truncate">{t.subject}</p>
                        {inBank && (
                          <span className="text-xs bg-[#D1E7DB] text-[#1D4430] rounded-full px-2 py-0.5 shrink-0">
                            ✓ Tagged
                          </span>
                        )}
                        {isExpanded
                          ? <ChevronUp size={13} className="text-[#A8A29E] shrink-0" />
                          : <ChevronDown size={13} className="text-[#A8A29E] shrink-0" />
                        }
                      </div>
                      <p className="text-xs text-[#78716C] truncate">{t.from}</p>
                      {!isExpanded && (
                        <p className="text-xs text-[#78716C] line-clamp-2 mt-0.5">{t.snippet}</p>
                      )}
                      <p className="text-xs text-[#A8A29E] mt-1">{t.date}</p>
                    </button>
                    <button
                      onClick={() => setTaggingThread(t)}
                      className="shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-[#F5F5F0]"
                      title="Tag this thread"
                    >
                      <Tag size={16} className={inBank ? "text-[#4F6E5C]" : "text-[#78716C]"} />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-2 rounded-lg bg-[#FAFAF9] border border-[#E7E5E4] px-3 py-3">
                      {isLoadingBody ? (
                        <div className="flex items-center gap-2 text-xs text-[#78716C]">
                          <Loader2 size={12} className="animate-spin" />
                          Loading preview…
                        </div>
                      ) : body ? (
                        <p className="text-xs text-[#44403C] whitespace-pre-wrap leading-relaxed font-mono">
                          {body}
                        </p>
                      ) : (
                        <p className="text-xs text-[#A8A29E] italic">
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E7E5E4] flex items-center justify-between">
          <p className="text-sm font-medium truncate pr-4">{item.subject}</p>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-[#F5F5F0]"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-4 py-4 space-y-4">
          <div>
            <p className="text-xs font-medium text-[#78716C] mb-2">Zone</p>
            <div className="grid grid-cols-2 gap-2">
              {(["Z1", "Z2", "Z3", "Z4"] as ZoneId[]).map((z) => (
                <button
                  key={z}
                  onClick={() => setZone(z)}
                  className={cn(
                    "py-2 px-3 rounded-lg text-xs font-medium border transition-colors",
                    zone === z
                      ? "border-[#1C1917] bg-[#1C1917] text-white"
                      : "border-[#E7E5E4] hover:bg-[#F5F5F0]",
                  )}
                >
                  {ZONE_LABELS[z]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-[#78716C] mb-2">Content type</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CONTENT_TYPE_LABELS) as ArchiveContentType[]).map((ct) => (
                <button
                  key={ct}
                  onClick={() => setContentType(ct)}
                  className={cn(
                    "py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors",
                    contentType === ct
                      ? "border-[#1C1917] bg-[#1C1917] text-white"
                      : "border-[#E7E5E4] hover:bg-[#F5F5F0]",
                  )}
                >
                  {CONTENT_TYPE_LABELS[ct]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-[#78716C] mb-2">Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm bg-[#FAFAF9] focus:outline-none focus:ring-2 focus:ring-[#1C1917] resize-none"
            />
          </div>
          <button
            onClick={() => { onSave({ zone, contentType, notes }); onClose(); }}
            className="w-full bg-[#1C1917] text-white rounded-xl py-3 text-sm font-medium min-h-[44px]"
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
    { Z1: [], Z2: [], Z3: [], Z4: [] },
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
        <Database size={32} className="mx-auto text-[#D6D3D1]" />
        <p className="text-sm text-[#78716C]">No items in the Content Bank yet.</p>
        <p className="text-xs text-[#A8A29E]">Search the archive and tag threads to add them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 flex items-center gap-3">
        <div className="flex rounded-lg border border-[#E7E5E4] overflow-hidden text-xs">
          <button
            onClick={() => setExportFormat("markdown")}
            className={cn(
              "px-3 py-2 min-h-[36px]",
              exportFormat === "markdown" ? "bg-[#1C1917] text-white" : "hover:bg-[#F5F5F0] text-[#44403C]",
            )}
          >
            Markdown
          </button>
          <button
            onClick={() => setExportFormat("csv")}
            className={cn(
              "px-3 py-2 min-h-[36px] border-l border-[#E7E5E4]",
              exportFormat === "csv" ? "bg-[#1C1917] text-white" : "hover:bg-[#F5F5F0] text-[#44403C]",
            )}
          >
            CSV
          </button>
        </div>
        <button
          onClick={() => exportFormat === "markdown" ? exportMarkdown() : exportCSV()}
          className="flex items-center gap-1.5 bg-[#1C1917] text-white rounded-lg px-3 py-2 text-xs font-medium min-h-[36px]"
        >
          <Download size={13} />
          Export {contentBank.length} item{contentBank.length !== 1 ? "s" : ""}
        </button>
      </div>

      {zones.map((z) => {
        const items = contentBank.filter((x) => x.zone === z);
        if (items.length === 0) return null;
        return (
          <div key={z} className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden">
            <div className={cn("px-4 py-2.5 flex items-center gap-2 border-b border-[#E7E5E4]")}>
              <span className={cn("text-xs font-medium rounded-full px-2 py-0.5", ZONE_COLORS[z])}>
                {ZONE_LABELS[z]}
              </span>
              <span className="text-xs text-[#78716C]">{items.length} item{items.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="divide-y divide-[#E7E5E4]">
              {items.map((item) => (
                <div key={item.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm font-medium truncate">{item.subject}</p>
                        <span
                          className={cn(
                            "text-xs rounded-full px-2 py-0.5 shrink-0",
                            CONTENT_TYPE_COLORS[item.contentType],
                          )}
                        >
                          {CONTENT_TYPE_LABELS[item.contentType]}
                        </span>
                      </div>
                      <p className="text-xs text-[#78716C] truncate">{item.from}</p>
                      <p className="text-xs text-[#78716C] line-clamp-2 mt-0.5">{item.snippet}</p>
                      {item.notes && (
                        <p className="text-xs text-[#44403C] mt-1.5 italic">"{item.notes}"</p>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-[#F5F5F0]"
                        title="Edit"
                      >
                        <Edit3 size={14} className="text-[#78716C]" />
                      </button>
                      <button
                        onClick={() => removeFromContentBank(item.id)}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-red-50"
                        title="Remove"
                      >
                        <Trash2 size={14} className="text-[#A8A29E] hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

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
  const contentBank = useStore((s) => s.contentBank);
  const [tab, setTab] = useState<Tab>("search");

  return (
    <div className="min-h-dvh bg-[#FAFAF9] pb-28">
      <div className="px-5 py-6 max-w-lg mx-auto">
        <div className="mb-5">
          <h1 className="text-2xl mb-1">Archive Mining</h1>
          <p className="text-sm text-[#78716C]">
            Surface emails by zone, tag what matters, build a content bank for courses and sequences.
          </p>
        </div>

        <div className="flex rounded-xl border border-[#E7E5E4] overflow-hidden mb-5 bg-white">
          <button
            onClick={() => setTab("search")}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors",
              tab === "search" ? "bg-[#1C1917] text-white" : "hover:bg-[#F5F5F0] text-[#44403C]",
            )}
          >
            <Search size={14} />
            Search
          </button>
          <button
            onClick={() => setTab("bank")}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 border-l border-[#E7E5E4] transition-colors",
              tab === "bank" ? "bg-[#1C1917] text-white" : "hover:bg-[#F5F5F0] text-[#44403C]",
            )}
          >
            <Database size={14} />
            Content Bank
            {contentBank.length > 0 && (
              <span
                className={cn(
                  "text-xs rounded-full px-1.5 py-0.5",
                  tab === "bank" ? "bg-white/20" : "bg-[#F5F5F0] text-[#44403C]",
                )}
              >
                {contentBank.length}
              </span>
            )}
          </button>
        </div>

        {tab === "search" ? <SearchTab /> : <ContentBankTab />}
      </div>
    </div>
  );
}
