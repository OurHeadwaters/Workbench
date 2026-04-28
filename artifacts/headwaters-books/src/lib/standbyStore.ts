import { useEffect, useState, useCallback } from "react";

export type RungId = "advisory" | "standby" | "active" | "standdown";

export type WatchEntry = {
  id: string;
  name: string;
  role: string;
  loggedAt: string;
};

export type DrawdownEntry = {
  id: string;
  item: string;
  quantity: string;
  shelf: "The Common Pantry" | "The Watch";
  drawnAt: string;
  note?: string;
};

export type CallEntry = {
  id: string;
  title: string;
  centralizedDisruption: string;
  rung: RungId;
  rungHistory: { rung: RungId; at: string; by?: string }[];
  openedAt: string;
  openedBy?: string;
  watch: WatchEntry[];
  drawdowns: DrawdownEntry[];
  closed: boolean;
  closedAt?: string;
  debrief?: {
    whatHappened: string;
    whatHeld: string;
    whatStrained: string;
    standbyStockReplenished: boolean;
    writtenAt: string;
  };
};

export type StandbyState = {
  schema: "z3.standby.v1";
  calls: CallEntry[];
};

const STORAGE_KEY = "z3.standby.v1";

const empty: StandbyState = { schema: "z3.standby.v1", calls: [] };

function read(): StandbyState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as StandbyState;
    if (parsed?.schema !== "z3.standby.v1" || !Array.isArray(parsed.calls)) {
      return empty;
    }
    return parsed;
  } catch {
    return empty;
  }
}

function write(state: StandbyState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function useStandbyStore() {
  const [state, setState] = useState<StandbyState>(empty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(read());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: StandbyState) => {
    setState(next);
    write(next);
  }, []);

  const openCall = useCallback(
    (input: {
      title: string;
      centralizedDisruption: string;
      rung: RungId;
      openedBy?: string;
    }) => {
      const now = new Date().toISOString();
      const call: CallEntry = {
        id: uid(),
        title: input.title.trim(),
        centralizedDisruption: input.centralizedDisruption.trim(),
        rung: input.rung,
        rungHistory: [{ rung: input.rung, at: now, by: input.openedBy }],
        openedAt: now,
        openedBy: input.openedBy?.trim() || undefined,
        watch: [],
        drawdowns: [],
        closed: false,
      };
      persist({ ...state, calls: [call, ...state.calls] });
      return call.id;
    },
    [state, persist],
  );

  const setRung = useCallback(
    (callId: string, rung: RungId, by?: string) => {
      const now = new Date().toISOString();
      persist({
        ...state,
        calls: state.calls.map((c) =>
          c.id === callId
            ? {
                ...c,
                rung,
                rungHistory: [...c.rungHistory, { rung, at: now, by }],
              }
            : c,
        ),
      });
    },
    [state, persist],
  );

  const addWatch = useCallback(
    (callId: string, name: string, role: string) => {
      if (!name.trim()) return;
      const entry: WatchEntry = {
        id: uid(),
        name: name.trim(),
        role: role.trim() || "on the watch",
        loggedAt: new Date().toISOString(),
      };
      persist({
        ...state,
        calls: state.calls.map((c) =>
          c.id === callId ? { ...c, watch: [...c.watch, entry] } : c,
        ),
      });
    },
    [state, persist],
  );

  const removeWatch = useCallback(
    (callId: string, entryId: string) => {
      persist({
        ...state,
        calls: state.calls.map((c) =>
          c.id === callId
            ? { ...c, watch: c.watch.filter((w) => w.id !== entryId) }
            : c,
        ),
      });
    },
    [state, persist],
  );

  const drawDown = useCallback(
    (
      callId: string,
      input: { item: string; quantity: string; shelf: DrawdownEntry["shelf"]; note?: string },
    ) => {
      if (!input.item.trim()) return;
      const entry: DrawdownEntry = {
        id: uid(),
        item: input.item.trim(),
        quantity: input.quantity.trim() || "—",
        shelf: input.shelf,
        drawnAt: new Date().toISOString(),
        note: input.note?.trim() || undefined,
      };
      persist({
        ...state,
        calls: state.calls.map((c) =>
          c.id === callId
            ? { ...c, drawdowns: [...c.drawdowns, entry] }
            : c,
        ),
      });
    },
    [state, persist],
  );

  const undoDrawdown = useCallback(
    (callId: string, entryId: string) => {
      persist({
        ...state,
        calls: state.calls.map((c) =>
          c.id === callId
            ? { ...c, drawdowns: c.drawdowns.filter((d) => d.id !== entryId) }
            : c,
        ),
      });
    },
    [state, persist],
  );

  const closeCall = useCallback(
    (
      callId: string,
      debrief: {
        whatHappened: string;
        whatHeld: string;
        whatStrained: string;
        standbyStockReplenished: boolean;
      },
    ) => {
      const now = new Date().toISOString();
      persist({
        ...state,
        calls: state.calls.map((c) =>
          c.id === callId
            ? {
                ...c,
                rung: "standdown" as RungId,
                rungHistory:
                  c.rung === "standdown"
                    ? c.rungHistory
                    : [...c.rungHistory, { rung: "standdown" as RungId, at: now }],
                closed: true,
                closedAt: now,
                debrief: { ...debrief, writtenAt: now },
              }
            : c,
        ),
      });
    },
    [state, persist],
  );

  const reopenCall = useCallback(
    (callId: string) => {
      persist({
        ...state,
        calls: state.calls.map((c) =>
          c.id === callId
            ? { ...c, closed: false, closedAt: undefined }
            : c,
        ),
      });
    },
    [state, persist],
  );

  const deleteCall = useCallback(
    (callId: string) => {
      persist({ ...state, calls: state.calls.filter((c) => c.id !== callId) });
    },
    [state, persist],
  );

  return {
    hydrated,
    calls: state.calls,
    openCall,
    setRung,
    addWatch,
    removeWatch,
    drawDown,
    undoDrawdown,
    closeCall,
    reopenCall,
    deleteCall,
  };
}
