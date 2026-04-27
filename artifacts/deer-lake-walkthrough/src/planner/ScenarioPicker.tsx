import { SCENARIOS, SCENARIO_ORDER, type ScenarioId } from "./scenarios";

/**
 * Three pills + caption + save button. Tapping a pill snaps the anchors
 * to that scenario's preset. The save button writes whatever the user
 * has currently dialed in to localStorage as "their version."
 */
export function ScenarioPicker({
  current,
  onPick,
  onSave,
  savedAt,
  isDirty,
}: {
  current: ScenarioId | null;
  onPick: (id: ScenarioId) => void;
  onSave: () => void;
  savedAt: string | null;
  isDirty: boolean;
}) {
  const captionId =
    current ?? (SCENARIO_ORDER[1] satisfies ScenarioId);
  const caption = SCENARIOS[captionId].caption;

  return (
    <section
      className="w-full"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-[36rem] px-6 pb-6">
        <div
          className="mono text-[10px] uppercase tracking-[0.22em] mb-2"
          style={{ color: "var(--color-muted)" }}
        >
          Scenario
        </div>
        <div className="flex flex-wrap gap-2" role="tablist">
          {SCENARIO_ORDER.map((id) => {
            const s = SCENARIOS[id];
            const active = current === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onPick(id)}
                data-testid={`scenario-${id}`}
                className="mono text-[11px] uppercase tracking-[0.16em] px-3 py-2 rounded-md border transition-colors"
                style={{
                  background: active
                    ? "var(--color-primary)"
                    : "var(--color-paper)",
                  color: active
                    ? "var(--color-bg)"
                    : "var(--color-primary)",
                  borderColor: active
                    ? "var(--color-primary)"
                    : "var(--color-rule)",
                }}
              >
                {s.label}
              </button>
            );
          })}
          <div className="flex-1" />
          <button
            type="button"
            onClick={onSave}
            data-testid="scenario-save"
            className="mono text-[11px] uppercase tracking-[0.16em] px-3 py-2 rounded-md border transition-colors"
            style={{
              background: "var(--color-bg)",
              color: "var(--color-accent-warm)",
              borderColor: "var(--color-accent-warm)",
            }}
          >
            {isDirty ? "Save *" : "Save"}
          </button>
        </div>
        <p
          className="serif italic text-[14px] mt-3"
          style={{ color: "var(--color-text)" }}
        >
          {caption}
        </p>
        {savedAt ? (
          <p
            className="mono text-[10px] uppercase tracking-[0.18em] mt-2"
            style={{ color: "var(--color-muted) " }}
          >
            Last saved {savedAt}
          </p>
        ) : null}
      </div>
    </section>
  );
}
