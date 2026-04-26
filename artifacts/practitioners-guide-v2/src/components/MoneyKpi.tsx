import type { ReactNode } from "react";
import { ConfirmedTag } from "./ConfirmedTag";
import type { SourceTag } from "@/data/tags";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: number;
  unit?: string;
  tag?: SourceTag;
  tone?: "default" | "positive" | "negative" | "muted";
  accent?: string;
  className?: string;
  hint?: ReactNode;
  testId?: string;
}

export function MoneyKpi({
  label,
  value,
  unit,
  tag,
  tone = "default",
  accent,
  className,
  hint,
  testId,
}: Props) {
  const toneClass =
    tone === "positive"
      ? "text-[hsl(167_60%_22%)]"
      : tone === "negative"
        ? "text-destructive"
        : tone === "muted"
          ? "text-muted-foreground"
          : "text-foreground";
  return (
    <div
      className={cn(
        "rounded-lg border border-card-border bg-card p-4",
        className,
      )}
      style={accent ? { borderTopColor: accent, borderTopWidth: "3px" } : undefined}
      data-testid={testId}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {tag ? <ConfirmedTag tag={tag} /> : null}
      </div>
      <p
        className={cn(
          "mt-2 text-2xl font-semibold num leading-tight",
          toneClass,
        )}
        style={{ fontFamily: "var(--app-font-serif)" }}
      >
        {money(value)}
        {unit ? <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span> : null}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
