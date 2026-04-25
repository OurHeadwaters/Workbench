import { useEffect, useRef, useState } from "react";

import {
  MILESTONES,
  PHASES,
  PHASE_LABELS,
  deriveSuggestedPhase,
  shouldShowPhaseSuggestion,
} from "@/lib/phases";
import { useAppState, useAppStateActions } from "@/lib/storage";

type PhaseIndicatorProps = {
  // `light` flips the trigger button styling for use on dark/full-bleed
  // backgrounds (the slide deck routes). The dropdown panel itself
  // stays light either way.
  variant?: "default" | "light";
};

// Visible from every page in the app. Surfaces the active phase, lets
// the practitioner change it in one click, and exposes the milestone
// checklist that drives the soft-nudge suggestion. Milestones never
// move the active phase on their own — only an explicit click does.
export function PhaseIndicator({ variant = "default" }: PhaseIndicatorProps) {
  const state = useAppState();
  const { setCurrentPhase, setMilestone, dismissPhaseSuggestion } =
    useAppStateActions();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const active = state.currentPhase;
  const suggested = deriveSuggestedPhase(state.milestones);
  const showNudge = shouldShowPhaseSuggestion(
    active,
    state.milestones,
    state.dismissedPhaseSuggestion,
  );

  // Click-outside to close.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const triggerClass =
    variant === "light"
      ? "inline-flex items-center gap-2 rounded-md border border-white/30 bg-black/40 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur hover:bg-black/60"
      : "inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-sm hover:bg-stone-100";
  const triggerLabelClass =
    variant === "light"
      ? "uppercase tracking-widest text-[10px] text-white/70"
      : "uppercase tracking-widest text-[10px] text-stone-500";
  const triggerValueClass =
    variant === "light" ? "text-white" : "text-stone-900";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={triggerClass}
        data-testid="button-phase-indicator"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
        <span className={triggerLabelClass}>Phase</span>
        <span className={triggerValueClass}>{PHASE_LABELS[active]}</span>
        {showNudge && (
          <span
            className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-400"
            aria-label="Phase suggestion available"
          />
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-stone-200 bg-white p-4 shadow-lg"
          role="menu"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                Current phase
              </h3>
              <div className="mt-2 grid grid-cols-5 gap-1">
                {PHASES.map((p) => {
                  const isActive = p === active;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setCurrentPhase(p);
                      }}
                      className={
                        "rounded px-2 py-1.5 text-[11px] font-medium transition-colors " +
                        (isActive
                          ? "bg-stone-900 text-stone-50"
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200")
                      }
                      data-testid={`button-phase-set-${p}`}
                      aria-pressed={isActive}
                    >
                      {PHASE_LABELS[p]}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] text-stone-500">
                Click a phase to switch. Milestones below only suggest;
                they never move the phase on their own.
              </p>
            </div>

            {showNudge && (
              <div
                className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900"
                data-testid="banner-phase-suggestion"
              >
                <div>
                  Looks like you're in{" "}
                  <span className="font-semibold">{PHASE_LABELS[suggested]}</span>{" "}
                  now — switch?
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPhase(suggested)}
                    className="rounded bg-amber-900 px-2 py-1 text-[11px] font-medium text-amber-50 hover:bg-amber-800"
                    data-testid="button-phase-accept-suggestion"
                  >
                    Switch to {PHASE_LABELS[suggested]}
                  </button>
                  <button
                    type="button"
                    onClick={() => dismissPhaseSuggestion(suggested)}
                    className="rounded border border-amber-300 px-2 py-1 text-[11px] font-medium text-amber-900 hover:bg-amber-100"
                    data-testid="button-phase-dismiss-suggestion"
                  >
                    Stay here
                  </button>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                Deal milestones
              </h3>
              <ul className="mt-2 space-y-1.5">
                {MILESTONES.map((m) => {
                  const checked = !!state.milestones[m.id];
                  return (
                    <li key={m.id}>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-800">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            setMilestone(m.id, e.target.checked)
                          }
                          className="h-4 w-4 rounded border-stone-300"
                          data-testid={`checkbox-milestone-${m.id}`}
                        />
                        <span className="flex-1">{m.label}</span>
                        <span className="text-[10px] uppercase tracking-widest text-stone-400">
                          → {PHASE_LABELS[m.implies]}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 text-[11px] text-stone-500">
                Checking a milestone offers a soft nudge to switch phase
                — you stay in control.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
