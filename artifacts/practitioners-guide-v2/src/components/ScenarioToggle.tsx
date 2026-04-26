import { useScenario } from "@/lib/scenario";
import type { ScenarioId } from "@/data/types";
import { SCENARIO_ORDER } from "@/data/scenarios";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

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
            <span className="font-semibold">{s.short}</span>
            <span className="ml-1.5 hidden sm:inline opacity-90">— {s.name.split("—")[1]?.trim() ?? s.name}</span>
          </button>
        );
      })}
    </div>
  );
}
