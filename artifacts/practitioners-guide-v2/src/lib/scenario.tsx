import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SCENARIOS, getScenario } from "@/data/scenarios";
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
   * False when it is the global fallback default (`v2`) for a brand-new
   * visitor with no prior selection. Pages that want to override the default
   * for first-time visitors (e.g. ReplicationPage opens with V4 as the
   * worked example) should read this flag — never overwrite an explicit
   * persisted choice.
   */
  scenarioWasExplicit: boolean;
}

const ScenarioContext = createContext<ScenarioContextValue | null>(null);

/**
 * Pure migration: accept only the three known scenarios. Anything else
 * (null, missing, legacy, garbage) is treated as "no explicit choice".
 * Exported for direct testing — exercising the migration matrix without
 * standing up a DOM.
 */
export function migrateStoredScenario(stored: string | null): ScenarioId | null {
  if (stored === "v2" || stored === "v3" || stored === "v4") return stored;
  return null;
}

function readStoredScenario(): ScenarioId | null {
  if (typeof window === "undefined") return null;
  return migrateStoredScenario(window.localStorage.getItem(STORAGE_KEY));
}

/**
 * Decision rule for pages that want to override the global default for
 * brand-new visitors. ReplicationPage uses this to open with V4 as the
 * worked example on first visit, while preserving any explicit V2/V3
 * choice the reader has made.
 *
 * Returns true only when:
 *  - the reader has no persisted explicit choice, AND
 *  - the current scenario is the global fallback `v2`.
 *
 * Exported so the contract can be unit-tested in a node environment.
 */
export function shouldOpenWithV4OnFirstVisit(args: {
  scenarioWasExplicit: boolean;
  scenarioId: ScenarioId;
}): boolean {
  return !args.scenarioWasExplicit && args.scenarioId === "v2";
}

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [scenarioId, setScenarioIdState] = useState<ScenarioId>(() => {
    return readStoredScenario() ?? "v2";
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
