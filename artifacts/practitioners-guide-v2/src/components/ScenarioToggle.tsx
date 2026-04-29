import { useScenario } from "@/lib/scenario";
import type { ScenarioId } from "@/data/types";
import { DEFAULT_SCENARIO_ID, SCENARIO_ORDER } from "@/data/scenarios";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

/**
 * Scenario toggle — exposes the live scenario set in the user-facing
 * "Current" / "Prior" framing. The internal scenario IDs (v4, v5, …)
 * stay stable so persisted reader state and test selectors don't need
 * to change every time the locked default moves; the toggle just
 * relabels the default-scenario button as "Current" and the others as
 * "Prior".
 */
export function ScenarioToggle({ className }: Props) {
  const { scenarioId, setScenarioId, scenarios } = useScenario();
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-card-border bg-card p-1 shadow-sm",
        className,
      )}
      role="tablist"
      aria-label="Scenario"
      data-testid="scenario-toggle"
    >
      {SCENARIO_ORDER.map((id: ScenarioId) => {
        const s = scenarios[id];
        const active = scenarioId === id;
        const positionLabel = id === DEFAULT_SCENARIO_ID ? "Current" : "Prior";
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setScenarioId(id)}
            data-testid={`scenario-toggle-${id}`}
            className={cn(
              "relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
              active
                ? "text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            style={active ? { backgroundColor: s.accent } : undefined}
          >
            <span className="font-semibold">{positionLabel}</span>
            <span className="ml-1.5 hidden sm:inline opacity-90">
              — {s.name.split("—")[1]?.trim() ?? s.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
