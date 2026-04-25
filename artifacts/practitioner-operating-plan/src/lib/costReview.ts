// Cost review state — per-entry verdict for each line in the registry.
// Persisted in AppState; consumed by useCostValue(id) on the slides.

import { useCallback, useMemo } from "react";

import {
  COST_REGISTRY,
  COST_REGISTRY_BY_ID,
  type CostEntry,
} from "../data/costRegistry";
import { useAppState, _setStateForCostReview } from "./storage";

export type CostReviewStatus = "approved" | "edited" | "skipped";

export type CostReviewRecord = {
  // undefined = note-only (still unreviewed); set by Approve/Edit/Skip.
  status?: CostReviewStatus;
  editedValue?: number;
  note: string;
  reviewedAt?: string;
};

export type CostReviewMap = Record<string, CostReviewRecord>;

// Edited override if present, otherwise the registry default.
export function useCostValue(id: string): number {
  const state = useAppState();
  const entry = COST_REGISTRY_BY_ID[id];
  const review = state.costReview?.[id];
  if (review?.status === "edited" && typeof review.editedValue === "number") {
    return review.editedValue;
  }
  return entry?.defaultValue ?? 0;
}

export function useCostReview(id: string): CostReviewRecord | undefined {
  const state = useAppState();
  return state.costReview?.[id];
}

export function useCostReviewMap(): CostReviewMap {
  const state = useAppState();
  return state.costReview ?? {};
}

export type CostReviewSummary = {
  total: number;
  approved: number;
  edited: number;
  skipped: number;
  unreviewed: number;
};

export function useCostReviewSummary(): CostReviewSummary {
  const map = useCostReviewMap();
  return useMemo(() => {
    const total = COST_REGISTRY.length;
    let approved = 0;
    let edited = 0;
    let skipped = 0;
    for (const entry of COST_REGISTRY) {
      const r = map[entry.id];
      if (!r) continue;
      if (r.status === "approved") approved += 1;
      else if (r.status === "edited") edited += 1;
      else if (r.status === "skipped") skipped += 1;
    }
    return {
      total,
      approved,
      edited,
      skipped,
      unreviewed: total - approved - edited - skipped,
    };
  }, [map]);
}

// First entry without a verdict (note-only counts as unreviewed). -1 if all done.
export function findNextUnreviewedIndex(map: CostReviewMap): number {
  return COST_REGISTRY.findIndex((e) => !map[e.id]?.status);
}

export function useCostReviewActions() {
  const approve = useCallback((entry: CostEntry) => {
    _setStateForCostReview((s) => {
      const next: CostReviewMap = { ...(s.costReview ?? {}) };
      const prior = next[entry.id];
      next[entry.id] = {
        status: "approved",
        editedValue: undefined,
        note: prior?.note ?? "",
        reviewedAt: new Date().toISOString(),
      };
      return { ...s, costReview: next };
    });
  }, []);

  const edit = useCallback((entry: CostEntry, newValue: number) => {
    _setStateForCostReview((s) => {
      const next: CostReviewMap = { ...(s.costReview ?? {}) };
      const prior = next[entry.id];
      next[entry.id] = {
        status: "edited",
        editedValue: newValue,
        note: prior?.note ?? "",
        reviewedAt: new Date().toISOString(),
      };
      return { ...s, costReview: next };
    });
  }, []);

  const skip = useCallback((entry: CostEntry) => {
    _setStateForCostReview((s) => {
      const next: CostReviewMap = { ...(s.costReview ?? {}) };
      const prior = next[entry.id];
      next[entry.id] = {
        status: "skipped",
        editedValue: undefined,
        note: prior?.note ?? "",
        reviewedAt: new Date().toISOString(),
      };
      return { ...s, costReview: next };
    });
  }, []);

  const setNote = useCallback((entry: CostEntry, note: string) => {
    _setStateForCostReview((s) => {
      const next: CostReviewMap = { ...(s.costReview ?? {}) };
      const prior = next[entry.id];
      // Note-only autosave must NOT change the verdict status. Empty note
      // with no verdict drops the record so empties don't accumulate.
      if (!prior?.status && note.trim() === "") {
        if (prior) delete next[entry.id];
        return { ...s, costReview: next };
      }
      next[entry.id] = {
        status: prior?.status,
        editedValue: prior?.editedValue,
        note,
        reviewedAt: prior?.reviewedAt,
      };
      return { ...s, costReview: next };
    });
  }, []);

  const reset = useCallback((entry: CostEntry) => {
    _setStateForCostReview((s) => {
      const next: CostReviewMap = { ...(s.costReview ?? {}) };
      delete next[entry.id];
      return { ...s, costReview: next };
    });
  }, []);

  const resetAll = useCallback(() => {
    _setStateForCostReview((s) => ({ ...s, costReview: {} }));
  }, []);

  return { approve, edit, skip, setNote, reset, resetAll };
}
