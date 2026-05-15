/**
 * storage.ts — localStorage helpers for the Practitioner Operating Plan
 *
 * Follows the same pattern used elsewhere in this app: typed wrappers around
 * localStorage.getItem / setItem with a single versioned key per data domain.
 *
 * Quarter-history schema:
 *   Each "snapshot" represents one completed quarter that the bookkeeper has
 *   locked.  The draft is the in-progress quarter that has not yet been locked.
 *
 *   Hard Rule 02 (two-quarter pause trigger) is derived purely from the saved
 *   snapshot series — no manual checkbox, no memory required.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RoleEntry {
  roleId: string;
  label: string;
  /** Contracted minimum hours for the quarter */
  baselineHrs: number;
  /** Actual hours delivered this quarter (bookkeeper fills in) */
  actualHrs: number;
}

/**
 * A completed, locked quarter.  Once saved it should never be mutated — the
 * bookkeeper starts a new draft instead.
 */
export interface QuarterSnapshot {
  /** e.g. "2026-Q1" — used as storage key and display label seed */
  id: string;
  /** Human label, e.g. "Q1 2026" */
  label: string;
  /** ISO timestamp of when the bookkeeper hit "Lock this quarter" */
  lockedAt: string;
  roles: RoleEntry[];
}

/**
 * The in-progress quarter being edited.  Seeded from the previous snapshot
 * when "Start new quarter" is clicked.
 */
export interface QuarterDraft {
  id: string;
  label: string;
  roles: RoleEntry[];
}

// ── Storage keys ──────────────────────────────────────────────────────────────

const KEY_SNAPSHOTS = "hwop_quarter_snapshots_v1";
const KEY_DRAFT     = "hwop_quarter_draft_v1";

// ── Snapshot helpers ──────────────────────────────────────────────────────────

export function loadSnapshots(): QuarterSnapshot[] {
  try {
    const raw = localStorage.getItem(KEY_SNAPSHOTS);
    if (!raw) return [];
    return JSON.parse(raw) as QuarterSnapshot[];
  } catch {
    return [];
  }
}

export function saveSnapshots(snapshots: QuarterSnapshot[]): void {
  localStorage.setItem(KEY_SNAPSHOTS, JSON.stringify(snapshots));
}

export function appendSnapshot(snapshot: QuarterSnapshot): void {
  const existing = loadSnapshots();
  // Replace if same id (re-lock edge case), otherwise append
  const idx = existing.findIndex((s) => s.id === snapshot.id);
  if (idx >= 0) {
    existing[idx] = snapshot;
  } else {
    existing.push(snapshot);
  }
  saveSnapshots(existing);
}

export function deleteSnapshot(id: string): void {
  const existing = loadSnapshots().filter((s) => s.id !== id);
  saveSnapshots(existing);
}

// ── Draft helpers ─────────────────────────────────────────────────────────────

export function loadDraft(): QuarterDraft | null {
  try {
    const raw = localStorage.getItem(KEY_DRAFT);
    if (!raw) return null;
    return JSON.parse(raw) as QuarterDraft;
  } catch {
    return null;
  }
}

export function saveDraft(draft: QuarterDraft): void {
  localStorage.setItem(KEY_DRAFT, JSON.stringify(draft));
}

export function clearDraft(): void {
  localStorage.removeItem(KEY_DRAFT);
}

// ── Hard Rule 02 logic ────────────────────────────────────────────────────────

/**
 * Returns true if the most recent TWO consecutive snapshots both have total
 * actual hours below total baseline hours.  This is the automatic two-quarter
 * pause trigger — no manual checkbox required.
 *
 * Snapshots are evaluated in chronological order (by their lockedAt timestamp).
 */
export function isTwoQuarterTriggerFired(snapshots: QuarterSnapshot[]): boolean {
  if (snapshots.length < 2) return false;
  const sorted = [...snapshots].sort(
    (a, b) => new Date(a.lockedAt).getTime() - new Date(b.lockedAt).getTime()
  );
  const last2 = sorted.slice(-2);
  return last2.every((s) => {
    const totalActual   = s.roles.reduce((sum, r) => sum + r.actualHrs,   0);
    const totalBaseline = s.roles.reduce((sum, r) => sum + r.baselineHrs, 0);
    return totalActual < totalBaseline;
  });
}

/**
 * Returns true if a single snapshot's total actuals are below baseline.
 */
export function isUnderBaseline(snapshot: QuarterSnapshot): boolean {
  const totalActual   = snapshot.roles.reduce((sum, r) => sum + r.actualHrs,   0);
  const totalBaseline = snapshot.roles.reduce((sum, r) => sum + r.baselineHrs, 0);
  return totalActual < totalBaseline;
}

// ── Quarter-label utilities ───────────────────────────────────────────────────

/** Returns the next quarter label after the given one, e.g. "2026-Q4" → "2027-Q1" */
export function nextQuarterId(currentId: string): string {
  const m = currentId.match(/^(\d{4})-Q([1-4])$/);
  if (!m) {
    const now = new Date();
    return `${now.getFullYear()}-Q1`;
  }
  const year = parseInt(m[1], 10);
  const q    = parseInt(m[2], 10);
  if (q < 4) return `${year}-Q${q + 1}`;
  return `${year + 1}-Q1`;
}

/** "2026-Q2" → "Q2 2026" */
export function formatQuarterLabel(id: string): string {
  const m = id.match(/^(\d{4})-Q([1-4])$/);
  if (!m) return id;
  return `Q${m[2]} ${m[1]}`;
}

/** Returns an id string for the current calendar quarter */
export function currentQuarterId(): string {
  const now = new Date();
  const q = Math.ceil((now.getMonth() + 1) / 3);
  return `${now.getFullYear()}-Q${q}`;
}
