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
}

const ScenarioContext = createContext<ScenarioContextValue | null>(null);

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [scenarioId, setScenarioIdState] = useState<ScenarioId>(() => {
    if (typeof window === "undefined") return "v2";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "v2" || stored === "v3") return stored;
    return "v2";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, scenarioId);
  }, [scenarioId]);

  const setScenarioId = useCallback((id: ScenarioId) => {
    setScenarioIdState(id);
  }, []);

  const value = useMemo<ScenarioContextValue>(
    () => ({
      scenarioId,
      scenario: getScenario(scenarioId),
      setScenarioId,
      scenarios: SCENARIOS,
    }),
    [scenarioId, setScenarioId],
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
