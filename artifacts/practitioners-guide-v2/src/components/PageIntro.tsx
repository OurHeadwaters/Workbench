import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface PageIntroProps {
  children: React.ReactNode;
}

export function PageIntro({ children }: PageIntroProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 max-w-3xl">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors select-none"
        aria-expanded={open}
      >
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
        {open ? "Hide" : "About this page"}
      </button>
      {open && (
        <p className="mt-2 text-muted-foreground leading-relaxed text-sm">
          {children}
        </p>
      )}
    </div>
  );
}
