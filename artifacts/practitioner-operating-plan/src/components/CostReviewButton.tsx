// Cost Review trigger button + modal. Self-contained.

import { useState } from "react";

import { useCostReviewSummary } from "../lib/costReview";
import { CostReviewModal } from "./CostReviewModal";

type Variant = "primary" | "slide-corner" | "compact";

type Props = {
  variant?: Variant;
  startInSummary?: boolean;
  label?: string;
};

export function CostReviewButton({
  variant = "primary",
  startInSummary = false,
  label,
}: Props) {
  const [open, setOpen] = useState(false);
  const summary = useCostReviewSummary();
  const reviewed = summary.approved + summary.edited + summary.skipped;
  const remaining = summary.total - reviewed;

  const triggerLabel =
    label ??
    (variant === "compact"
      ? "Cost review"
      : remaining > 0
        ? `Cost review · ${remaining} left`
        : `Cost review · all ${summary.total} done`);

  let className: string;
  if (variant === "slide-corner") {
    // Sits in the corner of a full-bleed slide. Designed to be readable
    // against any slide background and to fit the slide's vw-sized type.
    className =
      "inline-flex items-center gap-[0.4vw] rounded-[0.3vw] border border-stone-700/40 bg-white/95 px-[0.7vw] py-[0.4vh] font-mono text-[0.78vw] uppercase tracking-[0.18em] text-stone-900 shadow-sm hover:bg-white";
  } else if (variant === "compact") {
    className =
      "inline-flex items-center gap-1.5 rounded-md border border-stone-300 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-50";
  } else {
    className =
      "inline-flex items-center gap-2 rounded-md border border-emerald-700 bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-800";
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        <span aria-hidden>$</span>
        {triggerLabel}
        {variant !== "slide-corner" && summary.edited > 0 && (
          <span
            className={`ml-1 rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
              variant === "primary"
                ? "bg-amber-300 text-amber-950"
                : "bg-amber-100 text-amber-900"
            }`}
            title={`${summary.edited} edited values are flowing to the slides`}
          >
            {summary.edited} edit{summary.edited === 1 ? "" : "s"}
          </span>
        )}
      </button>
      <CostReviewModal
        open={open}
        onClose={() => setOpen(false)}
        startInSummary={startInSummary}
      />
    </>
  );
}
