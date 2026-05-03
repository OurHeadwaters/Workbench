import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

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
        background: isInk ? "var(--cs-primary)" : "var(--cs-paper)",
        borderColor: isInk ? "rgba(244,237,224,0.18)" : "var(--cs-rule)",
        color: isInk ? "var(--cs-bg)" : "var(--cs-text)",
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{ background: "transparent", color: "inherit" }}
      >
        <span
          className="mono text-[12px] uppercase tracking-[0.18em] leading-tight"
          style={{ color: isInk ? "#e9c8a8" : "var(--cs-accent-warm)" }}
        >
          {label}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
          style={{ opacity: 0.85 }}
        />
      </button>
      <div
        id={id}
        className="grid"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
          transition: "grid-template-rows 0.25s ease, opacity 0.2s ease",
        }}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <div
            className="px-5 pb-5 pt-1 serif text-[16px] leading-[1.55] space-y-3"
            style={{ color: isInk ? "var(--cs-bg)" : "var(--cs-text)" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
