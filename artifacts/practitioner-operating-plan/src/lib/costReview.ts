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
 * One record per key (last edit wins — no changelog).  The Edits tab
 * shows the current override vs the planning default, not a history of
 * every intermediate value.
 */

import { getCostItem } from "@/data/costRegistry";

// ── Types ─────────────────────────────────────────────────────────────

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
}

// ── Storage key ────────────────────────────────────────────────────────

const STORAGE_KEY = "hwop_cost_edits_v1";

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

  const edit: CostEdit = {
    key,
    defaultValue,
    newValue,
    delta: newValue - defaultValue,
    note: note?.trim() || undefined,
    editedAt: new Date().toISOString(),
    skipped: existing?.skipped ?? false,
  };

  store[key] = edit;
  persist(store);
  return edit;
}

/**
 * Mark a cost item as skipped (deliberately deferred).
 * If no edit exists yet, creates one with newValue = defaultValue.
 */
export function markSkipped(key: string, note?: string): void {
  const item = getCostItem(key);
  const defaultValue = item?.defaultValue ?? 0;
  const store = load();
  const existing = store[key];

  store[key] = {
    key,
    defaultValue,
    newValue: existing?.newValue ?? defaultValue,
    delta: (existing?.newValue ?? defaultValue) - defaultValue,
    note: note?.trim() || existing?.note,
    editedAt: new Date().toISOString(),
    skipped: true,
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
