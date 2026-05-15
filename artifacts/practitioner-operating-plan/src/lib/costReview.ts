/**
 * costReview.ts
 *
 * localStorage helpers for the founder's cost override layer.
 *
 * The founder may edit any line from the planning defaults (scenario B).
 * Each edit stores: the key, new value, an optional private note, and a
 * timestamp.  Skipped items are stored with skipped:true and no newValue
 * change — they appear in the Edits audit view so the board can see what
 * was deliberately deferred.
 *
 * Every save appends the previous state to a `history` array (oldest first)
 * so the full revision timeline is preserved and traceable.
 */

import { getCostItem } from "@/data/costRegistry";

// ── Types ─────────────────────────────────────────────────────────────

/** One entry in the per-key revision history (a snapshot before it was changed). */
export interface HistoryEntry {
  /** The value that was stored before this revision replaced it */
  newValue: number;
  /** delta at that point: newValue − defaultValue */
  delta: number;
  /** Note attached at that revision (if any) */
  note?: string;
  /** Whether the item was skipped at that revision */
  skipped?: boolean;
  /** ISO timestamp of that revision */
  editedAt: string;
}

export interface CostEdit {
  /** Stable key matching COST_REGISTRY / B_LINES */
  key: string;
  /** Planning-default value at the time of the edit */
  defaultValue: number;
  /** Founder's override value */
  newValue: number;
  /** Computed: newValue − defaultValue */
  delta: number;
  /** Optional private note the founder attached */
  note?: string;
  /** ISO timestamp of the most recent save */
  editedAt: string;
  /** True if the founder explicitly marked this item as "skip for now" */
  skipped?: boolean;
  /** True when this line was added by the founder and doesn't exist in the planning defaults */
  custom?: boolean;
  /**
   * Full revision history for this key, oldest first.
   * Each entry is a snapshot of the record *before* it was overwritten.
   * The current state is in the top-level fields above; prior states live here.
   */
  history?: HistoryEntry[];
}

/**
 * A cost line invented by the founder — not in any planning scenario.
 * Stored separately under hwop_cost_custom_v1.
 */
export interface CustomLine {
  /** Unique key, e.g. "custom_1716000000000" */
  key: string;
  label: string;
  description: string;
  /** Monthly amount */
  amount: number;
  note?: string;
  /** ISO timestamp of creation / last edit */
  editedAt: string;
}

// ── Storage keys ───────────────────────────────────────────────────────

const STORAGE_KEY        = "hwop_cost_edits_v1";
const CUSTOM_STORAGE_KEY = "hwop_cost_custom_v1";

// ── Persistence helpers ────────────────────────────────────────────────

type EditStore = Record<string, CostEdit>;

function load(): EditStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as EditStore;
  } catch {
    return {};
  }
}

function persist(store: EditStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// ── Public API ─────────────────────────────────────────────────────────

/** Return all saved edits, most-recently-edited first. */
export function loadEdits(): CostEdit[] {
  const store = load();
  return Object.values(store).sort(
    (a, b) => new Date(b.editedAt).getTime() - new Date(a.editedAt).getTime()
  );
}

/** Return the saved edit for a single key, or null if none. */
export function loadEdit(key: string): CostEdit | null {
  const store = load();
  return store[key] ?? null;
}

/**
 * Save (or overwrite) an override for a given cost key.
 * The defaultValue is looked up from the registry at call time so it's
 * always accurate even if the planning numbers change later.
 *
 * If there is an existing record for this key, its current state is
 * appended to the `history` array before being overwritten, so every
 * revision is preserved.
 */
export function saveEdit(
  key: string,
  newValue: number,
  note?: string
): CostEdit {
  const item = getCostItem(key);
  const defaultValue = item?.defaultValue ?? newValue;
  const store = load();
  const existing = store[key];

  // Snapshot the previous state into history before overwriting
  const prevHistory: HistoryEntry[] = existing?.history ?? [];
  if (existing) {
    prevHistory.push({
      newValue: existing.newValue,
      delta: existing.delta,
      note: existing.note,
      skipped: existing.skipped,
      editedAt: existing.editedAt,
    });
  }

  const edit: CostEdit = {
    key,
    defaultValue,
    newValue,
    delta: newValue - defaultValue,
    note: note?.trim() || undefined,
    editedAt: new Date().toISOString(),
    skipped: false,
    history: prevHistory.length > 0 ? prevHistory : undefined,
  };

  store[key] = edit;
  persist(store);
  return edit;
}

/**
 * Mark a cost item as skipped (deliberately deferred).
 * If no edit exists yet, creates one with newValue = defaultValue.
 * Appends the previous state to history so the timeline is preserved.
 */
export function markSkipped(key: string, note?: string): void {
  const item = getCostItem(key);
  const defaultValue = item?.defaultValue ?? 0;
  const store = load();
  const existing = store[key];

  const prevHistory: HistoryEntry[] = existing?.history ?? [];
  if (existing) {
    prevHistory.push({
      newValue: existing.newValue,
      delta: existing.delta,
      note: existing.note,
      skipped: existing.skipped,
      editedAt: existing.editedAt,
    });
  }

  store[key] = {
    key,
    defaultValue,
    newValue: existing?.newValue ?? defaultValue,
    delta: (existing?.newValue ?? defaultValue) - defaultValue,
    note: note?.trim() || existing?.note,
    editedAt: new Date().toISOString(),
    skipped: true,
    history: prevHistory.length > 0 ? prevHistory : undefined,
  };
  persist(store);
}

/** Remove a single override, returning the item to its planning default. */
export function clearEdit(key: string): void {
  const store = load();
  delete store[key];
  persist(store);
}

/** Remove all stored overrides. */
export function clearAllEdits(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ── Custom lines ────────────────────────────────────────────────────────

type CustomStore = Record<string, CustomLine>;

function loadCustomStore(): CustomStore {
  try {
    const raw = localStorage.getItem(CUSTOM_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as CustomStore;
  } catch {
    return {};
  }
}

function persistCustomStore(store: CustomStore): void {
  localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(store));
}

/** Return all custom lines, oldest first. */
export function loadCustomLines(): CustomLine[] {
  const store = loadCustomStore();
  return Object.values(store).sort(
    (a, b) => new Date(a.editedAt).getTime() - new Date(b.editedAt).getTime()
  );
}

/**
 * Save a new custom line or update an existing one.
 * Pass key=undefined to create a new line (key is auto-generated).
 */
export function saveCustomLine(
  line: Omit<CustomLine, "key" | "editedAt"> & { key?: string }
): CustomLine {
  const store = loadCustomStore();
  const key = line.key ?? `custom_${Date.now()}`;
  const saved: CustomLine = {
    key,
    label: line.label.trim(),
    description: line.description.trim(),
    amount: line.amount,
    note: line.note?.trim() || undefined,
    editedAt: new Date().toISOString(),
  };
  store[key] = saved;
  persistCustomStore(store);
  return saved;
}

/** Remove a single custom line by key. */
export function deleteCustomLine(key: string): void {
  const store = loadCustomStore();
  delete store[key];
  persistCustomStore(store);
}

/** Remove all custom lines. */
export function clearAllCustomLines(): void {
  localStorage.removeItem(CUSTOM_STORAGE_KEY);
}

/**
 * Convert custom lines into CostEdit shape for the Edits audit view.
 * defaultValue is always 0 (these lines don't exist in the plan).
 */
export function customLinesToEdits(lines: CustomLine[]): CostEdit[] {
  return lines.map((l) => ({
    key: l.key,
    defaultValue: 0,
    newValue: l.amount,
    delta: l.amount,
    note: l.note,
    editedAt: l.editedAt,
    custom: true,
  }));
}

/** Returns only edits where newValue !== defaultValue (excluding skipped-only). */
export function loadValueEdits(): CostEdit[] {
  return loadEdits().filter((e) => !e.skipped && e.delta !== 0);
}

/** Returns only items the founder marked as skipped. */
export function loadSkippedEdits(): CostEdit[] {
  return loadEdits().filter((e) => e.skipped);
}

/** True if any edits (value changes or skipped items) are stored. */
export function hasAnyEdits(): boolean {
  return Object.keys(load()).length > 0;
}
