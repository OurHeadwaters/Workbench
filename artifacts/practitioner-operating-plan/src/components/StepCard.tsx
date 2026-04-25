import { useState } from "react";
import type { Step, StepAction } from "../data/plan2026";
import { useAppState, useAppStateActions } from "../lib/storage";
import { copyToClipboard } from "../lib/clipboard";
import { useToast } from "./Toast";

type Props = {
  step: Step;
  contextLabel?: string;
  carriedFromWeek?: number;
  onDismissCarried?: () => void;
};

export function StepCard({ step, contextLabel, carriedFromWeek, onDismissCarried }: Props) {
  const state = useAppState();
  const { toggleStepDone } = useAppStateActions();
  const { show } = useToast();
  const [expanded, setExpanded] = useState(false);

  const done = !!state.doneSteps[step.id];

  const handleCopy = async (action: StepAction) => {
    const ok = await copyToClipboard(action.content);
    show(
      ok
        ? action.kind === "ai-prompt"
          ? "AI prompt copied"
          : "Sent to Replit (copied)"
        : "Copy failed — try selecting the text manually",
    );
  };

  const hasActions = step.actions && step.actions.length > 0;

  return (
    <div
      className={
        "rounded-lg border bg-white p-5 transition-colors " +
        (done
          ? "border-stone-200 bg-stone-100/60"
          : "border-stone-200 hover:border-stone-300")
      }
    >
      <div className="flex items-start gap-4">
        <label className="mt-1 flex shrink-0 cursor-pointer items-center justify-center">
          <input
            type="checkbox"
            checked={done}
            onChange={(e) => toggleStepDone(step.id, e.target.checked)}
            className="h-5 w-5 cursor-pointer rounded border-stone-400 text-stone-900 focus:ring-stone-700"
            aria-label={`Mark step done: ${step.title}`}
          />
        </label>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {contextLabel && (
              <span className="text-xs uppercase tracking-wider text-stone-500">
                {contextLabel}
              </span>
            )}
            {carriedFromWeek !== undefined && (
              <span className="rounded-sm bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-900">
                Carried from week {carriedFromWeek}
              </span>
            )}
          </div>
          <p
            className={
              "mt-1 text-base font-medium " +
              (done ? "text-stone-500 line-through" : "text-stone-900")
            }
          >
            {step.title}
          </p>
          {step.details && (
            <p className="mt-2 text-sm text-stone-700">{step.details}</p>
          )}
          {(expanded || done) && (
            <div className="mt-3 space-y-2 text-sm text-stone-700">
              <p>
                <span className="font-medium text-stone-800">Done looks like: </span>
                {step.doneLooksLike}
              </p>
              {step.source && (
                <p className="text-xs text-stone-500">Source: {step.source}</p>
              )}
            </div>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {!done && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="text-xs text-stone-600 underline-offset-2 hover:text-stone-900 hover:underline"
              >
                {expanded ? "Hide details" : "Show details"}
              </button>
            )}
            {hasActions &&
              step.actions!.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => handleCopy(action)}
                  className={
                    "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors " +
                    (action.kind === "ai-prompt"
                      ? "border-stone-300 bg-stone-100 text-stone-800 hover:bg-stone-200"
                      : "border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100")
                  }
                  aria-label={`Copy: ${action.label}`}
                >
                  {action.kind === "ai-prompt"
                    ? "Copy AI prompt"
                    : "Send to Replit"}
                </button>
              ))}
            {carriedFromWeek !== undefined && onDismissCarried && (
              <button
                type="button"
                onClick={onDismissCarried}
                className="text-xs text-stone-500 hover:text-stone-800"
              >
                Drop this carry-over
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
