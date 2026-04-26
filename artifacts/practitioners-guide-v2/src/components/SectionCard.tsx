import type { ReactNode } from "react";
import { ConfirmedTag } from "./ConfirmedTag";
import type { SourceTag } from "@/data/tags";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  subtitle?: string;
  tag?: SourceTag;
  accent?: string;
  className?: string;
  children: ReactNode;
  rightSlot?: ReactNode;
}

export function SectionCard({
  title,
  subtitle,
  tag,
  accent,
  className,
  children,
  rightSlot,
}: Props) {
  return (
    <section
      className={cn(
        "rounded-xl border border-card-border bg-card shadow-sm overflow-hidden",
        className,
      )}
    >
      <header
        className="flex items-start justify-between gap-4 px-5 py-4 border-b"
        style={{
          borderColor: "hsl(var(--card-border))",
          borderLeftWidth: "4px",
          borderLeftStyle: "solid",
          borderLeftColor: accent ?? "hsl(var(--primary))",
        }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: "var(--app-font-serif)" }}>
              {title}
            </h3>
            {tag ? <ConfirmedTag tag={tag} /> : null}
          </div>
          {subtitle ? (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {rightSlot}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
