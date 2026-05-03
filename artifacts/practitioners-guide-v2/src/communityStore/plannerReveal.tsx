import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Reveal — editorial lock for the Community Store Playbook sections.
 * Uses --cs-* CSS vars from the .cs-theme wrapper.
 *
 * variant="light"  (default) – warm oat paper background
 * variant="ink"             – dark evergreen background (white text)
 */
export function Reveal({
  label,
  children,
  variant = "light",
}: {
  label: string;
  children: ReactNode;
  variant?: "light" | "ink";
}) {
  const [open, setOpen] = useState(false);

  const isInk = variant === "ink";
  const bg = isInk ? "var(--cs-primary)" : "var(--cs-paper)";
  const border = isInk ? "var(--cs-primary)" : "var(--cs-rule)";
  const labelColor = isInk ? "var(--cs-accent)" : "var(--cs-accent-warm)";
  const textColor = isInk ? "rgba(244,237,224,0.88)" : "var(--cs-text)";

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: bg, borderColor: border }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none focus-visible:ring-2"
        aria-expanded={open}
        style={{ color: labelColor, outlineColor: "var(--cs-accent-warm)" }}
      >
        <span
          className="text-[11px] uppercase tracking-[0.20em]"
          style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
        >
          {label}
        </span>
        <ChevronDown
          className="h-4 w-4 shrink-0 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden
        />
      </button>
      {open && (
        <div
          className="px-4 pb-4 space-y-3 text-[15px] leading-[1.6]"
          style={{
            color: textColor,
            fontFamily: "'Fraunces', Georgia, serif",
            borderTop: `1px solid ${border}`,
            paddingTop: "0.75rem",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
