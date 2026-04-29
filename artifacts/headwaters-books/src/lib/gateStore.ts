import { useEffect, useState, useCallback } from "react";

// Substitution ledger for The Gate.
//
// Browser-local persistence (window.localStorage). State survives reload
// without any backend the way the Standby store does. This is the runnable
// surface the constellation manifest's `scope` field on `the-gate` was
// holding open — the tool that used to live at legacy-gatekeeper.replit.app
// is now in-repo, reading the manifest as its source of truth and writing
// to this store as its history.
//
// AUDIT NOTE — Standby-leaks-into-Gate bug class (Task #473).
// =========================================================
// This store is *intentionally* Gate-only. The vocabulary mirrors the
// Gate primitive in the constellation manifest exactly:
//   - rungs: draft / under-review / cleared / refused
//   - directions: bright-to-massity / massity-to-bright
//   - sub-shelves used as the category dropdown: Mappings / Substitutions / Categories
// Do NOT genericize this into a shared "primitive ledger" with the Standby
// store. Each primitive opts in per surface; nothing is shared by default.

export type GateDirection = "bright-to-massity" | "massity-to-bright";
export type GateRung = "draft" | "under-review" | "cleared" | "refused";

export type SubstitutionEntry = {
  id: string;
  direction: GateDirection;
  rung: GateRung;
  brightSide: string;
  massity: string;
  category: string;
  document?: string;
  note?: string;
  loggedAt: string;
  loggedBy?: string;
};

export type GateState = {
  schema: "z3.gate.v1";
  substitutions: SubstitutionEntry[];
};

export const STORAGE_KEY = "z3.gate.v1";

export const emptyGateState: GateState = {
  schema: "z3.gate.v1",
  substitutions: [],
};

// Reads a candidate JSON blob and returns either a valid GateState or the
// empty state. Exported so tests can verify the schema guard.
export function parseGateState(raw: string | null | undefined): GateState {
  if (!raw) return emptyGateState;
  try {
    const parsed = JSON.parse(raw) as GateState;
    if (
      parsed?.schema !== "z3.gate.v1" ||
      !Array.isArray(parsed.substitutions)
    ) {
      return emptyGateState;
    }
    return parsed;
  } catch {
    return emptyGateState;
  }
}

function readState(): GateState {
  if (typeof window === "undefined") return emptyGateState;
  return parseGateState(window.localStorage.getItem(STORAGE_KEY));
}

function writeState(state: GateState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid(): string {
  return (
    Math.random().toString(36).slice(2, 10) +
    Date.now().toString(36).slice(-4)
  );
}

export type SubstitutionInput = {
  direction: GateDirection;
  rung: GateRung;
  brightSide: string;
  massity: string;
  category: string;
  document?: string;
  note?: string;
  loggedBy?: string;
};

// Pure helpers — no React, no localStorage. The hook composes these.
// Exported so the ledger behavior (create / set rung / delete) can be
// tested directly without spinning up a renderer.

export function buildEntry(input: SubstitutionInput, id: string, loggedAt: string): SubstitutionEntry {
  return {
    id,
    direction: input.direction,
    rung: input.rung,
    brightSide: input.brightSide.trim(),
    massity: input.massity.trim(),
    category: input.category.trim(),
    document: input.document?.trim() || undefined,
    note: input.note?.trim() || undefined,
    loggedAt,
    loggedBy: input.loggedBy?.trim() || undefined,
  };
}

export function addSubstitution(state: GateState, entry: SubstitutionEntry): GateState {
  return { ...state, substitutions: [entry, ...state.substitutions] };
}

export function applyRung(state: GateState, id: string, rung: GateRung): GateState {
  return {
    ...state,
    substitutions: state.substitutions.map((s) => (s.id === id ? { ...s, rung } : s)),
  };
}

export function removeSubstitution(state: GateState, id: string): GateState {
  return {
    ...state,
    substitutions: state.substitutions.filter((s) => s.id !== id),
  };
}

export function useGateStore() {
  const [state, setState] = useState<GateState>(emptyGateState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: GateState) => {
    setState(next);
    writeState(next);
  }, []);

  const logSubstitution = useCallback(
    (input: SubstitutionInput) => {
      const entry = buildEntry(input, uid(), new Date().toISOString());
      persist(addSubstitution(state, entry));
      return entry.id;
    },
    [state, persist],
  );

  const setRung = useCallback(
    (id: string, rung: GateRung) => {
      persist(applyRung(state, id, rung));
    },
    [state, persist],
  );

  const deleteSubstitution = useCallback(
    (id: string) => {
      persist(removeSubstitution(state, id));
    },
    [state, persist],
  );

  return {
    hydrated,
    substitutions: state.substitutions,
    logSubstitution,
    setRung,
    deleteSubstitution,
  };
}
