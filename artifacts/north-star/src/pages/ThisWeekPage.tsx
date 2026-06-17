import { useState, useEffect, useRef } from "react";
import { Plus, Check, Trash2, X, ChevronDown, ChevronRight, Undo2, Download } from "lucide-react";

interface WeekItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
}

type Archive = Record<string, WeekItem[]>;

const LS_KEY         = "north-star-this-week";
const LS_WEEK_KEY    = "north-star-this-week-iso";
const LS_ARCHIVE_KEY = "north-star-archive";

const BG     = "#0B0905";
const SURF   = "#141210";
const SURF2  = "#1A1714";
const BORDER = "rgba(237,232,213,0.08)";
const TEXT   = "#EDE8D5";
const TEXT2  = "rgba(237,232,213,0.55)";
const AMBER  = "#C8923A";
const GREEN  = "#4ADE80";
const RED    = "rgba(239,68,68,0.7)";

const API = import.meta.env.VITE_API_URL ?? "";

function getOwnerToken(): string | null {
  try {
    return (
      localStorage.getItem("library.ownerToken") ||
      localStorage.getItem("ownerToken") ||
      null
    );
  } catch {
    return null;
  }
}

function ownerHeaders(): HeadersInit {
  const token = getOwnerToken();
  return token
    ? { "x-library-owner-token": token, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

async function fetchArchiveFromServer(): Promise<Archive | null> {
  const token = getOwnerToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API}/api/north-star/archive`, {
      headers: ownerHeaders(),
    });
    if (!res.ok) return null;
    const data = await res.json() as { archive: Archive };
    return data.archive ?? null;
  } catch {
    return null;
  }
}

async function pushArchiveToServer(archive: Archive): Promise<void> {
  const token = getOwnerToken();
  if (!token) return;
  try {
    await fetch(`${API}/api/north-star/archive`, {
      method: "PUT",
      headers: ownerHeaders(),
      body: JSON.stringify({ archive }),
    });
  } catch {
    // fire-and-forget; localStorage is the fallback
  }
}

function isoWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const year = d.getUTCFullYear();
  const week = Math.ceil(
    ((d.getTime() - Date.UTC(year, 0, 1)) / 86400000 + 1) / 7
  );
  return `${year}-W${String(week).padStart(2, "0")}`;
}

function isoWeekLabel(key: string): string {
  const match = key.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return key;
  const year = parseInt(match[1], 10);
  const week = parseInt(match[2], 10);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7;
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - (dayOfWeek - 1) + (week - 1) * 7);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-CA", { month: "short", day: "numeric", timeZone: "UTC" });
  return `Week of ${fmt(monday)} – ${fmt(sunday)}`;
}

function loadItems(): WeekItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as WeekItem[]) : [];
  } catch {
    return [];
  }
}

function saveItems(items: WeekItem[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch { /* ignore */ }
}

function loadArchive(): Archive {
  try {
    const raw = localStorage.getItem(LS_ARCHIVE_KEY);
    return raw ? (JSON.parse(raw) as Archive) : {};
  } catch {
    return {};
  }
}

function saveArchive(archive: Archive) {
  try {
    localStorage.setItem(LS_ARCHIVE_KEY, JSON.stringify(archive));
  } catch { /* ignore */ }
  pushArchiveToServer(archive);
}

function mergeArchives(local: Archive, server: Archive): Archive {
  const merged: Archive = { ...local };
  for (const [week, serverItems] of Object.entries(server)) {
    if (!merged[week] || serverItems.length > merged[week].length) {
      merged[week] = serverItems;
    }
  }
  return merged;
}

function archiveItems(weekKey: string, doneItems: WeekItem[]) {
  if (doneItems.length === 0) return;
  const archive = loadArchive();
  archive[weekKey] = [...(archive[weekKey] ?? []), ...doneItems];
  saveArchive(archive);
}

function runWeeklyReset(): { items: WeekItem[]; cleared: number } {
  const items = loadItems();
  try {
    const currentWeek = isoWeek(new Date());
    const lastWeek    = localStorage.getItem(LS_WEEK_KEY) ?? "";

    if (lastWeek === currentWeek) {
      return { items, cleared: 0 };
    }

    const carried   = items.filter((it) => !it.done);
    const doneItems = items.filter((it) => it.done);

    if (doneItems.length > 0) {
      archiveItems(lastWeek || currentWeek, doneItems);
    }

    saveItems(carried);
    localStorage.setItem(LS_WEEK_KEY, currentWeek);

    return { items: carried, cleared: doneItems.length };
  } catch {
    return { items, cleared: 0 };
  }
}

interface UndoState {
  weekKey: string;
  weekItems: WeekItem[];
}

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ThisWeekPage() {
  const [items, setItems]           = useState<WeekItem[]>([]);
  const [cleared, setCleared]       = useState(0);
  const [draft, setDraft]           = useState("");
  const [archive, setArchive]       = useState<Archive>({});
  const [openWeeks, setOpenWeeks]   = useState<Set<string>>(new Set());
  const [undoState, setUndoState]   = useState<UndoState | null>(null);
  const [syncing, setSyncing]       = useState(false);
  const undoTimerRef                = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef                    = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { items: initial, cleared: n } = runWeeklyReset();
    setItems(initial);
    if (n > 0) setCleared(n);

    const localArchive = loadArchive();
    setArchive(localArchive);

    fetchArchiveFromServer().then((serverArchive) => {
      if (!serverArchive) return;
      const merged = mergeArchives(localArchive, serverArchive);
      const changed = JSON.stringify(merged) !== JSON.stringify(localArchive);
      if (changed) {
        saveArchive(merged);
        setArchive(merged);
      }
    });
  }, []);

  useEffect(() => {
    saveItems(items);
  }, [items]);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  function addItem() {
    const text = draft.trim();
    if (!text) return;
    const next: WeekItem[] = [
      ...items,
      { id: crypto.randomUUID(), text, done: false, createdAt: new Date().toISOString() },
    ];
    setItems(next);
    setDraft("");
    inputRef.current?.focus();
  }

  function toggle(id: string) {
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, done: !it.done } : it));
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function clearDone() {
    const currentWeek = isoWeek(new Date());
    const doneItems = items.filter((it) => it.done);
    archiveItems(currentWeek, doneItems);
    const next = items.filter((it) => !it.done);
    setItems(next);
    const updated = loadArchive();
    setArchive(updated);
  }

  function toggleWeek(key: string) {
    setOpenWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function deleteWeek(weekKey: string, e: React.MouseEvent) {
    e.stopPropagation();
    const weekItems = archive[weekKey] ?? [];

    const updated = { ...archive };
    delete updated[weekKey];
    setArchive(updated);
    saveArchive(updated);

    setOpenWeeks((prev) => {
      const next = new Set(prev);
      next.delete(weekKey);
      return next;
    });

    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoState({ weekKey, weekItems });
    undoTimerRef.current = setTimeout(() => {
      setUndoState(null);
    }, 5000);
  }

  function handleUndo() {
    if (!undoState) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);

    const restored = { ...loadArchive(), [undoState.weekKey]: undoState.weekItems };
    saveArchive(restored);
    setArchive(restored);
    setUndoState(null);
  }

  function dismissUndo() {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoState(null);
  }

  async function handleExport() {
    setSyncing(true);
    try {
      const token = getOwnerToken();
      if (token) {
        const res = await fetch(`${API}/api/north-star/archive/export`, {
          headers: ownerHeaders(),
        });
        if (res.ok) {
          const blob = await res.blob();
          const filename = `north-star-archive-${new Date().toISOString().slice(0, 10)}.json`;
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          return;
        }
      }
      const filename = `north-star-archive-${new Date().toISOString().slice(0, 10)}.json`;
      downloadJson(archive, filename);
    } catch {
      const filename = `north-star-archive-${new Date().toISOString().slice(0, 10)}.json`;
      downloadJson(archive, filename);
    } finally {
      setSyncing(false);
    }
  }

  const open = items.filter((it) => !it.done);
  const done = items.filter((it) => it.done);

  const archiveKeys = Object.keys(archive).sort().reverse();

  return (
    <div className="min-h-dvh pb-24" style={{ backgroundColor: BG }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-5 pt-8 pb-4"
        style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="max-w-xl mx-auto">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: TEXT, fontFamily: "Fraunces, serif" }}
          >
            This Week
          </h1>
          <p className="text-sm mt-0.5" style={{ color: TEXT2 }}>
            {open.length === 0
              ? done.length > 0 ? "Everything done" : "Nothing yet — add your first item"
              : `${open.length} remaining${done.length > 0 ? `, ${done.length} done` : ""}`}
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-5 space-y-4">

        {/* Weekly-reset notice */}
        {cleared > 0 && (
          <div
            className="flex items-center justify-between gap-3 rounded-xl px-4 py-3"
            style={{
              backgroundColor: "rgba(200,146,58,0.08)",
              border: `1px solid rgba(200,146,58,0.2)`,
            }}
          >
            <p className="text-sm" style={{ color: AMBER }}>
              {cleared} completed {cleared === 1 ? "item" : "items"} archived from last week
            </p>
            <button
              onClick={() => setCleared(0)}
              className="shrink-0 p-1 rounded-md"
              style={{ color: AMBER }}
              title="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Add input */}
        <div
          className="flex gap-2 items-center rounded-xl px-4 py-3"
          style={{ backgroundColor: SURF, border: `1px solid rgba(237,232,213,0.12)` }}
        >
          <Plus size={18} style={{ color: AMBER, flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addItem();
              if (e.key === "Escape") setDraft("");
            }}
            placeholder="Add an item for this week…"
            className="flex-1 bg-transparent text-base focus:outline-none placeholder:opacity-40"
            style={{ color: TEXT, fontSize: 15 }}
            autoComplete="off"
          />
          {draft && (
            <button
              onClick={addItem}
              className="shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: "rgba(200,146,58,0.15)", color: AMBER }}
            >
              Add
            </button>
          )}
        </div>

        {/* Open items */}
        {open.length > 0 && (
          <div
            className="rounded-xl overflow-hidden"
            style={{ backgroundColor: SURF, border: `1px solid ${BORDER}` }}
          >
            {open.map((item, i) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-4 group"
                style={{
                  borderBottom: i < open.length - 1 ? `1px solid ${BORDER}` : "none",
                }}
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors min-h-[36px] min-w-[36px]"
                  style={{
                    borderColor: "rgba(237,232,213,0.2)",
                    backgroundColor: "transparent",
                  }}
                  title="Mark done"
                />
                <span
                  className="flex-1 text-[15px] leading-snug"
                  style={{ color: TEXT }}
                >
                  {item.text}
                </span>
                <button
                  onClick={() => remove(item.id)}
                  className="shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity min-h-[36px] min-w-[36px] flex items-center justify-center"
                  style={{ color: TEXT2 }}
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Done items */}
        {done.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-xs uppercase tracking-widest" style={{ color: TEXT2 }}>
                Done ({done.length})
              </p>
              <button
                onClick={clearDone}
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{ color: TEXT2, backgroundColor: SURF2 }}
              >
                Clear all
              </button>
            </div>
            <div
              className="rounded-xl overflow-hidden"
              style={{ backgroundColor: SURF, border: `1px solid ${BORDER}`, opacity: 0.65 }}
            >
              {done.map((item, i) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-3 group"
                  style={{ borderBottom: i < done.length - 1 ? `1px solid ${BORDER}` : "none" }}
                >
                  <button
                    onClick={() => toggle(item.id)}
                    className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center min-h-[36px] min-w-[36px]"
                    style={{ backgroundColor: "rgba(74,222,128,0.15)", border: "1.5px solid rgba(74,222,128,0.3)" }}
                    title="Uncheck"
                  >
                    <Check size={13} style={{ color: GREEN }} />
                  </button>
                  <span
                    className="flex-1 text-[15px] line-through leading-snug"
                    style={{ color: TEXT2 }}
                  >
                    {item.text}
                  </span>
                  <button
                    onClick={() => remove(item.id)}
                    className="shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity min-h-[36px] min-w-[36px] flex items-center justify-center"
                    style={{ color: TEXT2 }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {items.length === 0 && (
          <div
            className="rounded-xl px-5 py-10 text-center"
            style={{ backgroundColor: SURF, border: `1px dashed ${BORDER}` }}
          >
            <p
              className="text-lg font-medium mb-1"
              style={{ color: TEXT, fontFamily: "Fraunces, serif" }}
            >
              This week is wide open
            </p>
            <p className="text-sm" style={{ color: TEXT2 }}>
              Add what you want to finish this week. Items stay here until you clear them.
            </p>
          </div>
        )}

        {/* Past weeks archive */}
        {archiveKeys.length > 0 && (
          <div className="pt-4">
            <div className="flex items-center justify-between px-1 mb-3">
              <p
                className="text-xs uppercase tracking-widest"
                style={{ color: TEXT2 }}
              >
                Archive
              </p>
              <button
                onClick={handleExport}
                disabled={syncing}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-opacity"
                style={{ color: TEXT2, backgroundColor: SURF2, opacity: syncing ? 0.5 : 1 }}
                title="Download archive as JSON"
              >
                <Download size={11} />
                Export
              </button>
            </div>
            <div className="space-y-2">
              {archiveKeys.map((weekKey) => {
                const weekItems = archive[weekKey];
                const isOpen = openWeeks.has(weekKey);
                return (
                  <div
                    key={weekKey}
                    className="rounded-xl overflow-hidden group/week"
                    style={{ backgroundColor: SURF, border: `1px solid ${BORDER}` }}
                  >
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleWeek(weekKey)}
                        className="flex-1 flex items-center justify-between gap-3 px-4 py-3"
                        style={{ color: TEXT2 }}
                      >
                        <span className="text-sm text-left">
                          {isoWeekLabel(weekKey)}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: "rgba(237,232,213,0.06)", color: TEXT2 }}
                          >
                            {weekItems.length} done
                          </span>
                          {isOpen
                            ? <ChevronDown size={14} />
                            : <ChevronRight size={14} />}
                        </div>
                      </button>
                      <button
                        onClick={(e) => deleteWeek(weekKey, e)}
                        className="shrink-0 px-3 py-3 opacity-0 group-hover/week:opacity-100 transition-opacity flex items-center justify-center min-h-[44px] min-w-[44px]"
                        style={{ color: RED }}
                        title="Delete this week"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {isOpen && (
                      <div style={{ borderTop: `1px solid ${BORDER}`, opacity: 0.6 }}>
                        {weekItems.map((item, i) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 px-4 py-3"
                            style={{
                              borderBottom: i < weekItems.length - 1 ? `1px solid ${BORDER}` : "none",
                            }}
                          >
                            <div
                              className="shrink-0 w-5 h-5 rounded-md flex items-center justify-center"
                              style={{ backgroundColor: "rgba(74,222,128,0.12)", border: "1.5px solid rgba(74,222,128,0.25)" }}
                            >
                              <Check size={11} style={{ color: GREEN }} />
                            </div>
                            <span
                              className="flex-1 text-[14px] line-through leading-snug"
                              style={{ color: TEXT2 }}
                            >
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Undo toast */}
      {undoState && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg z-50"
          style={{
            backgroundColor: "#272320",
            border: `1px solid rgba(237,232,213,0.14)`,
            maxWidth: "calc(100vw - 2rem)",
          }}
        >
          <p className="text-sm whitespace-nowrap" style={{ color: TEXT }}>
            {isoWeekLabel(undoState.weekKey)} deleted
          </p>
          <button
            onClick={handleUndo}
            className="flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-lg shrink-0"
            style={{ color: AMBER, backgroundColor: "rgba(200,146,58,0.12)" }}
          >
            <Undo2 size={13} />
            Undo
          </button>
          <button
            onClick={dismissUndo}
            className="shrink-0 p-1 rounded-md"
            style={{ color: TEXT2 }}
            title="Dismiss"
          >
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
