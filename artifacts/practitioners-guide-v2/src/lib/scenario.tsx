import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_SCENARIO_ID, SCENARIOS, getScenario } from "@/data/scenarios";
import type { Scenario, ScenarioId } from "@/data/types";

const STORAGE_KEY = "pgv2.scenario";

interface ScenarioContextValue {
  scenarioId: ScenarioId;
  scenario: Scenario;
  setScenarioId: (id: ScenarioId) => void;
  scenarios: Record<ScenarioId, Scenario>;
  /**
   * True when the current scenarioId was loaded from a persisted explicit
   * user choice (or set explicitly via setScenarioId during this session).
   * False when the provider fell back to the locked default for a brand-new
   * visitor with no prior selection.
   */
  scenarioWasExplicit: boolean;
}

const ScenarioContext = createContext<ScenarioContextValue | null>(null);

/**
 * Pure migration: returns the persisted ScenarioId, or null if storage is
 * empty / unknown. The retired V2 scenario is migrated to the locked default
 * (V3) so existing readers don't bounce out of the app on first load after
 * the V2 retirement.
 *
 * Anything not in this matrix (legacy, garbage, casing) is treated as "no
 * explicit choice".
 *
 * Exported for direct testing — exercise the migration matrix without
 * standing up a DOM.
 */
export function migrateStoredScenario(stored: string | null): ScenarioId | null {
  // Retired-on-2026-04-26 scenario is migrated to the locked default so any
  // reader with a persisted V2 choice lands on V3 instead of getting an
  // unknown-id reset.
  if (stored === "v2") return DEFAULT_SCENARIO_ID;
  if (stored === "v3" || stored === "v4") return stored;
  return null;
}

function readStoredScenario(): ScenarioId | null {
  if (typeof window === "undefined") return null;
  return migrateStoredScenario(window.localStorage.getItem(STORAGE_KEY));
}

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [scenarioId, setScenarioIdState] = useState<ScenarioId>(() => {
    return readStoredScenario() ?? DEFAULT_SCENARIO_ID;
  });
  const [scenarioWasExplicit, setScenarioWasExplicit] = useState<boolean>(
    () => readStoredScenario() !== null,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, scenarioId);
  }, [scenarioId]);

  const setScenarioId = useCallback((id: ScenarioId) => {
    setScenarioIdState(id);
    setScenarioWasExplicit(true);
  }, []);

  const value = useMemo<ScenarioContextValue>(
    () => ({
      scenarioId,
      scenario: getScenario(scenarioId),
      setScenarioId,
      scenarios: SCENARIOS,
      scenarioWasExplicit,
    }),
    [scenarioId, setScenarioId, scenarioWasExplicit],
  );

  return (
    <ScenarioContext.Provider value={value}>{children}</ScenarioContext.Provider>
  );
}

export function useScenario(): ScenarioContextValue {
  const ctx = useContext(ScenarioContext);
  if (!ctx) throw new Error("useScenario must be used inside ScenarioProvider");
  return ctx;
}
