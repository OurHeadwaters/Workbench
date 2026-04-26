import { AlertTriangle } from "lucide-react";
import { useScenario } from "@/lib/scenario";

export function ProvisionalBanner() {
  const { scenario } = useScenario();
  if (scenario.status !== "provisional") return null;
  return (
    <div
      className="flex items-start gap-3 rounded-lg border px-4 py-3 mb-6"
      style={{
        borderColor: scenario.accent,
        backgroundColor: scenario.accentSoft,
        color: scenario.accentInk,
      }}
      data-testid="provisional-banner"
    >
      <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1 text-sm">
        <p className="font-semibold">
          {scenario.name} numbers are provisional, not yet locked by the founder.
        </p>
        {scenario.statusNote ? (
          <p className="mt-1 opacity-90 leading-relaxed">{scenario.statusNote}</p>
        ) : null}
      </div>
    </div>
  );
}
