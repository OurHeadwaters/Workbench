import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Top + bottom chrome for the walkthrough. Mirrors the codetry handbook's
 * minimal reading frame: an eyebrow at the top, dot-pager + arrows at the
 * bottom. Both fade out on tap so the page becomes the page.
 */

export function TopChrome({
  visible,
  eyebrow,
  position,
  total,
}: {
  visible: boolean;
  eyebrow: string;
  position: number;
  total: number;
}) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-30 px-5 pt-3 pb-2 flex items-center justify-between transition-opacity duration-300 pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
        background:
          "linear-gradient(180deg, rgba(244,237,224,0.92) 0%, rgba(244,237,224,0.78) 60%, rgba(244,237,224,0) 100%)",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)",
      }}
      aria-hidden={!visible}
    >
      <div
        className="flex items-center gap-2 mono text-[10.5px] uppercase tracking-[0.22em]"
        style={{ color: "var(--color-primary)" }}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--color-accent-warm)" }}
        />
        <span className="opacity-80">Deer Lake walkthrough</span>
      </div>
      <div
        className="mono text-[10.5px] uppercase tracking-[0.22em] tabular-nums"
        style={{ color: "var(--color-muted)" }}
      >
        {String(position).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}

export function BottomChrome({
  visible,
  position,
  total,
  onPrev,
  onNext,
  onJump,
  eyebrow,
}: {
  visible: boolean;
  position: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onJump: (i: number) => void;
  eyebrow: string;
}) {
  const hasPrev = position > 1;
  const hasNext = position < total;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 px-4 pt-3 transition-opacity duration-300"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        background:
          "linear-gradient(0deg, rgba(244,237,224,0.96) 0%, rgba(244,237,224,0.84) 60%, rgba(244,237,224,0) 100%)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 14px)",
      }}
      aria-hidden={!visible}
    >
      <div
        className="text-center mono text-[10.5px] uppercase tracking-[0.22em] mb-2"
        style={{ color: "var(--color-muted)" }}
      >
        {eyebrow}
      </div>
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          aria-label="Previous section"
          className="h-11 w-11 rounded-full flex items-center justify-center disabled:opacity-30 transition-opacity"
          style={{
            background: "rgba(31,61,46,0.08)",
            color: "var(--color-primary)",
          }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-1.5 flex-1 justify-center flex-wrap">
          {Array.from({ length: total }).map((_, i) => {
            const isActive = i === position - 1;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onJump(i)}
                aria-label={`Jump to section ${i + 1}`}
                aria-current={isActive ? "true" : undefined}
                className="h-2 rounded-full transition-all"
                style={{
                  width: isActive ? 22 : 8,
                  background: isActive
                    ? "var(--color-primary)"
                    : "rgba(31,61,46,0.22)",
                }}
              />
            );
          })}
        </div>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          aria-label="Next section"
          className="h-11 w-11 rounded-full flex items-center justify-center disabled:opacity-30 transition-opacity"
          style={{
            background: "var(--color-primary)",
            color: "var(--color-bg)",
          }}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
