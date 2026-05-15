/**
 * saltClose.ts
 *
 * Manages the SALT-01 monthly close history stored in localStorage.
 *
 * Each filed month is stored as an immutable record keyed by its month
 * string (YYYY-MM). Filing the same month twice updates that month's
 * record (the bookkeeper can correct a mistake), but does NOT touch any
 * other month's record.
 *
 * Planning baseline: the net the salt operation is expected to return
 * after the food-handler cost and direct material expenses are covered.
 * This is intentionally separate from the B_LINES.foodHandler cost so
 * that the one-pager can compare actual filed nets against the plan.
 */

export const SALT_BASELINE_NET = 1_800; // planning-assumption net $/month

const STORAGE_KEY = "salt-monthly-close-v1";

export interface SaltCloseRecord {
  month: string;    // "YYYY-MM"
  revenue: number;  // gross salt revenue for the month
  expenses: number; // direct expenses (materials, packaging, labour outside food handler)
  net: number;      // revenue − expenses  (computed on save, stored for quick reads)
  note?: string;    // optional bookkeeper note
  filedAt: string;  // ISO timestamp of last save
}

type HistoryStore = Record<string, SaltCloseRecord>;

function load(): HistoryStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as HistoryStore;
  } catch {
    return {};
  }
}

function persist(store: HistoryStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

/** Save (or overwrite) the close record for a specific month. */
export function saveMonthClose(
  month: string,
  revenue: number,
  expenses: number,
  note?: string,
): SaltCloseRecord {
  const store = load();
  const record: SaltCloseRecord = {
    month,
    revenue,
    expenses,
    net: revenue - expenses,
    note: note?.trim() || undefined,
    filedAt: new Date().toISOString(),
  };
  store[month] = record;
  persist(store);
  return record;
}

/** Returns all filed months sorted oldest-first. */
export function getMonthHistory(): SaltCloseRecord[] {
  const store = load();
  return Object.values(store).sort((a, b) => a.month.localeCompare(b.month));
}

/** Returns the most recently filed close, or null if none. */
export function getLatestClose(): SaltCloseRecord | null {
  const history = getMonthHistory();
  return history.length > 0 ? history[history.length - 1] : null;
}

/** Returns the last N months of history (most recent N, oldest-first). */
export function getRecentHistory(n = 6): SaltCloseRecord[] {
  const history = getMonthHistory();
  return history.slice(-n);
}

/** Clears ALL filed closes. Used by the reset action. */
export function resetAllCloses(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Health status based on net vs baseline. */
export type SaltStatus = "healthy" | "watch" | "below";

export function getStatus(net: number): SaltStatus {
  if (net >= SALT_BASELINE_NET) return "healthy";
  if (net >= SALT_BASELINE_NET * 0.7) return "watch";
  return "below";
}
