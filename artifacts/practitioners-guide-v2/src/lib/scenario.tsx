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
 * empty / unknown.
 *
 *   - Retired-on-2026-04-26 V2 → migrated to the locked default (V7).
 *   - V3 (Lean team) → migrated to the locked default (V7). V3 was
 *     pulled from the user-facing toggle on 2026-04-29; V3 still exists
 *     in SCENARIOS for workspace-level reads (Compare anchor, alt-realities
 *     seed) but is no longer a toggle target.
 *   - V4 (Right-priced) → preserved as-is (still a valid toggle id).
 *   - V5 (Codetry archetype) → preserved as-is (historical baseline, still
 *     surfaced in the toggle as "Prior").
 *   - V6 (Hourly subcontract) → preserved as-is (historical baseline).
 *   - V7 (Updated rates) → preserved as-is (locked default).
 *
 * Anything not in this matrix (legacy, garbage, casing) is treated as "no
 * explicit choice".
 *
 * Exported for direct testing — exercise the migration matrix without
 * standing up a DOM.
 */
export function migrateStoredScenario(stored: string | null): ScenarioId | null {
  if (stored === "v2") return DEFAULT_SCENARIO_ID;
  if (stored === "v3") return DEFAULT_SCENARIO_ID;
  if (stored === "v4" || stored === "v5" || stored === "v6" || stored === "v7") return stored;
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
