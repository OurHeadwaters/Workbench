import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Reveal — the walkthrough's tap-to-expand block.
 *
 * The handbook leans on `ChapterBlock` callouts to tuck the dense bits
 * behind a quiet invitation. This is the web equivalent: closed state is
 * a one-line invitation in the mono eyebrow voice; open state slides the
 * supporting detail in below it without leaving the section.
 *
 * Numbers, schedules, and supporting data live inside `<Reveal>` so the
 * vision-led top of each section can stay short and image-first.
 *
 * ────────────────────────────────────────────────────────────────────
 * EDITORIAL LOCK — section bullet contract
 * ────────────────────────────────────────────────────────────────────
 * Every section under `src/sections/` follows this shape:
 *
 *   eyebrow + headline (+ optional one-sentence hook)
 *   ↓
 *   AT MOST THREE top-level bullet/card items visible above the fold
 *   ↓
 *   one or more <Reveal> blocks holding everything longer than a
 *   single short sentence (numbers, dates, citations, supporting
 *   prose, ranked lists)
 *
 * If a section needs a fourth visible item, the fourth becomes a
 * <Reveal>. The rule is non-negotiable: the contractor must be able to
 * scan a section in under five seconds and screenshot it for the chief.
 * Reveals are the only collapsible pattern allowed — do not introduce a
 * second.
 *
 * Documented exception: `sections/Recap.tsx` is a single-screen summary
 * table built to BE the screenshot the contractor sends to the chief.
 * It carries seven label/value rows on purpose, with no Reveals,
 * because compressing it would destroy the surface it exists to be.
 * Recap is the only section allowed to break the three-bullet ceiling,
 * and it does so by intentional design.
 * ────────────────────────────────────────────────────────────────────
 */
export function Reveal({
  label,
  children,
  variant = "paper",
  startOpen = false,
}: {
  label: string;
  children: ReactNode;
  variant?: "paper" | "ink";
  startOpen?: boolean;
}) {
  const [open, setOpen] = useState(startOpen);
  const id = useId();

  const isInk = variant === "ink";

  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{
        background: isInk ? "var(--color-primary)" : "var(--color-paper)",
        borderColor: isInk ? "rgba(244,237,224,0.18)" : "var(--color-rule)",
        color: isInk ? "var(--color-bg)" : "var(--color-text)",
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          background: "transparent",
          color: "inherit",
        }}
      >
        <span
          className="mono text-[12px] uppercase tracking-[0.18em] leading-tight"
          style={{
            color: isInk ? "#e9c8a8" : "var(--color-accent-warm)",
          }}
        >
          {label}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
          style={{ opacity: 0.85 }}
        />
      </button>

      <div
        id={id}
        className="grid details-anim"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
        }}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <div
            className="px-5 pb-5 pt-1 serif text-[16px] leading-[1.55] space-y-3"
            style={{
              color: isInk ? "var(--color-bg)" : "var(--color-text)",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
