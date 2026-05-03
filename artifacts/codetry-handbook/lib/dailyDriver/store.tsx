// Persistent local store for Daily Drivers.
// Same pattern as lib/pioneerPath/store.tsx — AsyncStorage-backed
// context, local-only, nothing syncs anywhere.

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { storage } from "@/lib/storage";
import type {
  DailyDriver,
  DailyLog,
  DriverScenario,
  PivotalCard,
} from "@/data/dailyDriver";

const KEY = "codetry-handbook:v1:daily-drivers";

type DriversState = { drivers: DailyDriver[] };
const DEFAULT: DriversState = { drivers: [] };

type StoreCtx = {
  ready: boolean;
  drivers: DailyDriver[];
  primaryDriver: DailyDriver | undefined;
  addDriver: (driver: DailyDriver) => void;
  updateDriver: (id: string, patch: Partial<DailyDriver>) => void;
  deleteDriver: (id: string) => void;
  setPrimary: (id: string) => void;
  addScenario: (driverId: string, scenario: DriverScenario) => void;
  activateScenario: (driverId: string, scenarioId: string) => void;
  scratchScenario: (driverId: string, scenarioId: string) => void;
  addPivotalCard: (driverId: string, card: PivotalCard) => void;
  updatePivotalCard: (driverId: string, cardId: string, value: string) => void;
  deletePivotalCard: (driverId: string, cardId: string) => void;
  logAction: (driverId: string, log: DailyLog) => void;
};

const Ctx = createContext<StoreCtx | null>(null);

function parse(raw: string | null): DriversState {
  if (!raw) return DEFAULT;
  try {
    const p = JSON.parse(raw) as Partial<DriversState>;
    return { drivers: Array.isArray(p.drivers) ? p.drivers : [] };
  } catch {
    return DEFAULT;
  }
}

export function DailyDriverProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<DriversState>(DEFAULT);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!cancelled) setState(parse(raw));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(
    (next: DriversState) => {
      setState(next);
      storage.setItem(KEY, JSON.stringify(next)).catch(() => {});
    },
    [],
  );

  const touch = useCallback(
    (drivers: DailyDriver[], id: string, patch: Partial<DailyDriver>) =>
      drivers.map((d) =>
        d.id === id ? { ...d, ...patch, lastTouchedAt: Date.now() } : d,
      ),
    [],
  );

  const addDriver = useCallback(
    (driver: DailyDriver) => {
      // First driver is automatically primary.
      const isFirst = state.drivers.filter((d) => d.status === "active").length === 0;
      persist({ drivers: [...state.drivers, { ...driver, isPrimary: isFirst }] });
    },
    [persist, state.drivers],
  );

  const updateDriver = useCallback(
    (id: string, patch: Partial<DailyDriver>) => {
      persist({ drivers: touch(state.drivers, id, patch) });
    },
    [persist, state.drivers, touch],
  );

  const deleteDriver = useCallback(
    (id: string) => {
      persist({ drivers: state.drivers.filter((d) => d.id !== id) });
    },
    [persist, state.drivers],
  );

  const setPrimary = useCallback(
    (id: string) => {
      persist({
        drivers: state.drivers.map((d) => ({
          ...d,
          isPrimary: d.id === id,
          lastTouchedAt: d.id === id ? Date.now() : d.lastTouchedAt,
        })),
      });
    },
    [persist, state.drivers],
  );

  const addScenario = useCallback(
    (driverId: string, scenario: DriverScenario) => {
      persist({
        drivers: touch(state.drivers, driverId, {
          scenarios: [
            ...(state.drivers.find((d) => d.id === driverId)?.scenarios ?? []),
            scenario,
          ],
        }),
      });
    },
    [persist, state.drivers, touch],
  );

  const activateScenario = useCallback(
    (driverId: string, scenarioId: string) => {
      persist({
        drivers: state.drivers.map((d) => {
          if (d.id !== driverId) return d;
          const scenarios = d.scenarios.map((s) => ({
            ...s,
            status: (s.id === scenarioId ? "active" : "scratched") as
              | "active"
              | "scratched",
          }));
          const active = scenarios.find((s) => s.id === scenarioId);
          return {
            ...d,
            scenarios,
            activeScenarioId: scenarioId,
            todayAction: active?.dailyAction ?? d.todayAction,
            lastTouchedAt: Date.now(),
          };
        }),
      });
    },
    [persist, state.drivers],
  );

  const scratchScenario = useCallback(
    (driverId: string, scenarioId: string) => {
      persist({
        drivers: state.drivers.map((d) => {
          if (d.id !== driverId) return d;
          return {
            ...d,
            scenarios: d.scenarios.map((s) =>
              s.id === scenarioId ? { ...s, status: "scratched" as const } : s,
            ),
            lastTouchedAt: Date.now(),
          };
        }),
      });
    },
    [persist, state.drivers],
  );

  const addPivotalCard = useCallback(
    (driverId: string, card: PivotalCard) => {
      persist({
        drivers: touch(state.drivers, driverId, {
          pivotalCards: [
            ...(state.drivers.find((d) => d.id === driverId)?.pivotalCards ?? []),
            card,
          ],
        }),
      });
    },
    [persist, state.drivers, touch],
  );

  const updatePivotalCard = useCallback(
    (driverId: string, cardId: string, value: string) => {
      persist({
        drivers: state.drivers.map((d) => {
          if (d.id !== driverId) return d;
          return {
            ...d,
            pivotalCards: d.pivotalCards.map((c) =>
              c.id === cardId ? { ...c, value, updatedAt: Date.now() } : c,
            ),
            lastTouchedAt: Date.now(),
          };
        }),
      });
    },
    [persist, state.drivers],
  );

  const deletePivotalCard = useCallback(
    (driverId: string, cardId: string) => {
      persist({
        drivers: touch(state.drivers, driverId, {
          pivotalCards: state.drivers
            .find((d) => d.id === driverId)
            ?.pivotalCards.filter((c) => c.id !== cardId) ?? [],
        }),
      });
    },
    [persist, state.drivers, touch],
  );

  const logAction = useCallback(
    (driverId: string, log: DailyLog) => {
      persist({
        drivers: touch(state.drivers, driverId, {
          logs: [
            ...(state.drivers.find((d) => d.id === driverId)?.logs ?? []),
            log,
          ],
        }),
      });
    },
    [persist, state.drivers, touch],
  );

  const primaryDriver = useMemo(
    () =>
      state.drivers.find((d) => d.isPrimary && d.status === "active") ??
      state.drivers.find((d) => d.status === "active"),
    [state.drivers],
  );

  const value = useMemo<StoreCtx>(
    () => ({
      ready,
      drivers: state.drivers,
      primaryDriver,
      addDriver,
      updateDriver,
      deleteDriver,
      setPrimary,
      addScenario,
      activateScenario,
      scratchScenario,
      addPivotalCard,
      updatePivotalCard,
      deletePivotalCard,
      logAction,
    }),
    [
      ready,
      state.drivers,
      primaryDriver,
      addDriver,
      updateDriver,
      deleteDriver,
      setPrimary,
      addScenario,
      activateScenario,
      scratchScenario,
      addPivotalCard,
      updatePivotalCard,
      deletePivotalCard,
      logAction,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDailyDriver(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useDailyDriver must be used inside DailyDriverProvider");
  return ctx;
}
