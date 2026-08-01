/**
 * trackerStore — persists execution-tracker step overrides to localStorage.
 *
 * Shape stored:
 *   Record<stepId, { status: ExecStatus; date?: string }>
 *
 * The data file (interEntityReimb2026.ts) remains the canonical baseline.
 * Any override written here takes precedence when the tracker renders.
 */

import type { ExecStatus } from "@/data/interEntityReimb2026";

const STORAGE_KEY = "hw-tracker-overrides-2026";

export interface StepOverride {
  status: ExecStatus;
  date?: string; // ISO date, e.g. "2026-07-31"
}

export type TrackerOverrides = Record<string, StepOverride>;

export function loadOverrides(): TrackerOverrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as TrackerOverrides;
  } catch {
    return {};
  }
}

export function saveOverride(stepId: string, override: StepOverride): TrackerOverrides {
  const current = loadOverrides();
  const next = { ...current, [stepId]: override };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or unavailable — proceed in-memory only
  }
  return next;
}

export function clearOverride(stepId: string): TrackerOverrides {
  const current = loadOverrides();
  const next = { ...current };
  delete next[stepId];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  return next;
}
