import type { ScenarioMode } from "./dates";
import { SCENARIOS, SCENARIO_ORDER, type ScenarioId } from "./scenarios";

export function ScenarioPicker({
  current,
  onPick,
  onSave,
  savedAt,
  isDirty,
  mode,
}: {
  current: ScenarioId | null;
  onPick: (id: ScenarioId) => void;
  onSave: () => void;
  savedAt: string | null;
  isDirty: boolean;
  mode: ScenarioMode;
}) {
  const fallbackId: ScenarioId = mode === "self-fund" ? "selfFund" : "realistic";
  const captionId = current ?? fallbackId;
  const caption = SCENARIOS[captionId].caption;

  return (
    <section className="w-full" style={{ background: "var(--cs-bg)" }}>
      <div className="mx-auto max-w-[36rem] px-6 pb-6">
        <div className="mono text-[10px] uppercase tracking-[0.22em] mb-2" style={{ color: "var(--cs-muted)" }}>
          Scenario
        </div>
        <div className="flex flex-wrap gap-2" role="tablist">
          {SCENARIO_ORDER.map((id) => {
            const s = SCENARIOS[id];
            const active = current === id;
            return (
              <button key={id} type="button" role="tab" aria-selected={active} onClick={() => onPick(id)}
                data-testid={`scenario-${id}`}
                className="mono text-[11px] uppercase tracking-[0.16em] px-3 py-2 rounded-md border transition-colors"
                style={{
                  background: active ? "var(--cs-primary)" : "var(--cs-paper)",
                  color: active ? "var(--cs-bg)" : "var(--cs-primary)",
                  borderColor: active ? "var(--cs-primary)" : "var(--cs-rule)",
                }}
              >
                {s.label}
              </button>
            );
          })}
          <div className="flex-1" />
          <button type="button" onClick={onSave} data-testid="scenario-save"
            className="mono text-[11px] uppercase tracking-[0.16em] px-3 py-2 rounded-md border transition-colors"
            style={{ background: "var(--cs-bg)", color: "var(--cs-accent-warm)", borderColor: "var(--cs-accent-warm)" }}
          >
            {isDirty ? "Save *" : "Save"}
          </button>
        </div>
        <p className="serif italic text-[14px] mt-3" style={{ color: "var(--cs-text)" }}>{caption}</p>
        {savedAt ? (
          <p className="mono text-[10px] uppercase tracking-[0.18em] mt-2" style={{ color: "var(--cs-muted)" }}>
            Last saved {savedAt}
          </p>
        ) : null}
      </div>
    </section>
  );
}
