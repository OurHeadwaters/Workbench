// ─── SessionStore ─────────────────────────────────────────────────────────────
// Thin localStorage wrapper for dated session entries.
// Key shape:  session-close-YYYY-MM-DD
// Entry shape: SessionEntry

export interface SessionEntry {
  date: string;
  achieved: string[];
  whatMoved: string;
  openThreads: string;
  firstMove: string;
  savedAt: string;
}

const PREFIX = "session-close-";

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function yesterdayIso(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function readEntry(date: string): SessionEntry | null {
  try {
    const raw = localStorage.getItem(PREFIX + date);
    if (!raw) return null;
    return JSON.parse(raw) as SessionEntry;
  } catch {
    return null;
  }
}

function writeEntry(entry: SessionEntry): void {
  try {
    localStorage.setItem(PREFIX + entry.date, JSON.stringify(entry));
  } catch { /* noop */ }
}

export const SessionStore = {
  todayIso,
  yesterdayIso,

  getToday(): SessionEntry | null {
    return readEntry(todayIso());
  },

  getYesterday(): SessionEntry | null {
    return readEntry(yesterdayIso());
  },

  saveClose(fields: Pick<SessionEntry, "whatMoved" | "openThreads" | "firstMove">): SessionEntry {
    const date = todayIso();
    const existing = readEntry(date);
    const entry: SessionEntry = {
      date,
      achieved: existing?.achieved ?? [],
      whatMoved: fields.whatMoved,
      openThreads: fields.openThreads,
      firstMove: fields.firstMove,
      savedAt: new Date().toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" }),
    };
    writeEntry(entry);
    return entry;
  },

  addAchieved(text: string): void {
    const date = todayIso();
    const existing = readEntry(date) ?? {
      date,
      achieved: [],
      whatMoved: "",
      openThreads: "",
      firstMove: "",
      savedAt: "",
    };
    existing.achieved = [...existing.achieved, text.trim()];
    writeEntry(existing);
  },

  removeAchieved(index: number): void {
    const date = todayIso();
    const existing = readEntry(date);
    if (!existing) return;
    existing.achieved = existing.achieved.filter((_, i) => i !== index);
    writeEntry(existing);
  },
};
