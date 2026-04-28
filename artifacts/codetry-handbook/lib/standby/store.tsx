// Persistent store for the household Standby checklist.
//
// Mirrors the SharedVision store pattern: writes go through the
// instrumented `storage` wrapper so the SyncStatusPill reflects them
// and a stalled write surfaces on the failure / ambient-failure rails.
//
// Persisted shape:
//   {
//     // current rung the household is reading the checklist at
//     currentRung: RungId,
//     // checked-state per item id, scoped per rung so the same item id
//     // doesn't bleed across rungs (every rung's items have unique ids
//     // today, but scoping per rung keeps the door open for shared
//     // items later without a migration).
//     checks: { [rungId]: { [itemId]: number } }, // value = checkedAt epoch ms
//     // when the last call was opened / stood down — surfaced in the
//     // header so the household can see how long a call has been open.
//     callOpenedAt?: number,
//     callClosedAt?: number,
//   }

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  clearAmbientFailure,
  clearFailure,
  recordAmbientFailure,
  recordFailure,
} from "@/lib/saveStatus";
import { storage } from "@/lib/storage";
import type { RungId } from "@/data/standby";

const KEY = "codetry-handbook:v1:standby:household";
const OP_ID = "standby:household";

export type StandbyChecks = Partial<Record<RungId, Record<string, number>>>;

export type StandbyState = {
  currentRung: RungId;
  checks: StandbyChecks;
  callOpenedAt?: number;
  callClosedAt?: number;
};

const DEFAULT_STATE: StandbyState = {
  currentRung: "advisory",
  checks: {},
};

type StoreCtx = {
  ready: boolean;
  state: StandbyState;
  setCurrentRung: (rung: RungId) => void;
  toggleItem: (rung: RungId, itemId: string) => void;
  isChecked: (rung: RungId, itemId: string) => boolean;
  resetRung: (rung: RungId) => void;
  openCall: () => void;
  closeCall: () => void;
};

const StandbyContext = createContext<StoreCtx | null>(null);

function isRungId(v: unknown): v is RungId {
  return v === "advisory" || v === "standby" || v === "active" || v === "standdown";
}

function parseState(raw: string | null): StandbyState {
  if (!raw) return DEFAULT_STATE;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_STATE;
    const obj = parsed as Record<string, unknown>;
    const currentRung = isRungId(obj.currentRung)
      ? obj.currentRung
      : DEFAULT_STATE.currentRung;
    const checks: StandbyChecks = {};
    if (obj.checks && typeof obj.checks === "object") {
      for (const [rung, map] of Object.entries(
        obj.checks as Record<string, unknown>,
      )) {
        if (!isRungId(rung)) continue;
        if (!map || typeof map !== "object") continue;
        const cleaned: Record<string, number> = {};
        for (const [itemId, ts] of Object.entries(
          map as Record<string, unknown>,
        )) {
          if (typeof itemId !== "string") continue;
          if (typeof ts === "number" && Number.isFinite(ts)) {
            cleaned[itemId] = ts;
          }
        }
        checks[rung] = cleaned;
      }
    }
    const callOpenedAt =
      typeof obj.callOpenedAt === "number" && Number.isFinite(obj.callOpenedAt)
        ? obj.callOpenedAt
        : undefined;
    const callClosedAt =
      typeof obj.callClosedAt === "number" && Number.isFinite(obj.callClosedAt)
        ? obj.callClosedAt
        : undefined;
    return { currentRung, checks, callOpenedAt, callClosedAt };
  } catch {
    return DEFAULT_STATE;
  }
}

export function StandbyProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<StandbyState>(DEFAULT_STATE);
  const stateRef = useRef<StandbyState>(DEFAULT_STATE);
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (cancelled) return;
        const next = parseState(raw);
        setState(next);
        stateRef.current = next;
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
      if (writeTimer.current) clearTimeout(writeTimer.current);
    };
  }, []);

  const flush = useCallback(async () => {
    const snapshot = stateRef.current;
    try {
      await storage.setItem(KEY, JSON.stringify(snapshot));
      clearFailure(OP_ID);
      clearAmbientFailure(OP_ID);
    } catch {
      recordAmbientFailure({
        id: OP_ID,
        message: "Your standby checklist isn't saving right now.",
      });
      recordFailure({
        id: OP_ID,
        label: "your standby checklist",
        retry: () => flush(),
      });
    }
  }, []);

  const scheduleWrite = useCallback(() => {
    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => {
      writeTimer.current = null;
      void flush();
    }, 250);
  }, [flush]);

  const commit = useCallback(
    (next: StandbyState) => {
      stateRef.current = next;
      setState(next);
      scheduleWrite();
    },
    [scheduleWrite],
  );

  const setCurrentRung = useCallback(
    (rung: RungId) => {
      commit({ ...stateRef.current, currentRung: rung });
    },
    [commit],
  );

  const toggleItem = useCallback(
    (rung: RungId, itemId: string) => {
      const prev = stateRef.current;
      const rungChecks = { ...(prev.checks[rung] ?? {}) };
      if (rungChecks[itemId]) {
        delete rungChecks[itemId];
      } else {
        rungChecks[itemId] = Date.now();
      }
      commit({
        ...prev,
        checks: { ...prev.checks, [rung]: rungChecks },
      });
    },
    [commit],
  );

  const isChecked = useCallback(
    (rung: RungId, itemId: string) =>
      Boolean(state.checks[rung]?.[itemId]),
    [state.checks],
  );

  const resetRung = useCallback(
    (rung: RungId) => {
      const prev = stateRef.current;
      const nextChecks = { ...prev.checks };
      delete nextChecks[rung];
      commit({ ...prev, checks: nextChecks });
    },
    [commit],
  );

  const openCall = useCallback(() => {
    commit({
      ...stateRef.current,
      currentRung: "active",
      callOpenedAt: Date.now(),
      callClosedAt: undefined,
    });
  }, [commit]);

  const closeCall = useCallback(() => {
    commit({
      ...stateRef.current,
      currentRung: "standdown",
      callClosedAt: Date.now(),
    });
  }, [commit]);

  const value = useMemo<StoreCtx>(
    () => ({
      ready,
      state,
      setCurrentRung,
      toggleItem,
      isChecked,
      resetRung,
      openCall,
      closeCall,
    }),
    [
      ready,
      state,
      setCurrentRung,
      toggleItem,
      isChecked,
      resetRung,
      openCall,
      closeCall,
    ],
  );

  return (
    <StandbyContext.Provider value={value}>{children}</StandbyContext.Provider>
  );
}

export function useStandby(): StoreCtx {
  const ctx = useContext(StandbyContext);
  if (!ctx) throw new Error("useStandby must be used inside StandbyProvider");
  return ctx;
}
