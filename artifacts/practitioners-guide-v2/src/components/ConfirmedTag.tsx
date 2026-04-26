import { CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import { formatTagDate, type SourceTag } from "@/data/tags";
import { cn } from "@/lib/utils";

interface Props {
  tag: SourceTag;
  className?: string;
  size?: "sm" | "md";
}

export function ConfirmedTag({ tag, className, size = "sm" }: Props) {
  const sizeClass = size === "md" ? "text-xs px-2 py-1" : "text-[10px] px-1.5 py-0.5";

  if (tag.kind === "confirmed") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-md border font-medium uppercase tracking-wider whitespace-nowrap",
          "bg-[hsl(167_38%_94%)] text-[hsl(167_60%_18%)] border-[hsl(167_30%_82%)]",
          sizeClass,
          className,
        )}
        title={tag.note ?? `Confirmed ${formatTagDate(tag.date)}`}
        data-testid="tag-confirmed"
      >
        <CheckCircle2 className={size === "md" ? "h-3 w-3" : "h-2.5 w-2.5"} />
        confirmed {formatTagDate(tag.date)}
      </span>
    );
  }

  if (tag.kind === "provisional") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-md border font-medium uppercase tracking-wider whitespace-nowrap",
          "bg-[hsl(32_82%_94%)] text-[hsl(28_70%_28%)] border-[hsl(32_70%_82%)]",
          sizeClass,
          className,
        )}
        title={tag.reason}
        data-testid="tag-provisional"
      >
        <AlertTriangle className={size === "md" ? "h-3 w-3" : "h-2.5 w-2.5"} />
        provisional
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border font-medium uppercase tracking-wider whitespace-nowrap",
        "bg-muted text-muted-foreground border-border",
        sizeClass,
        className,
      )}
      title={tag.reason}
      data-testid="tag-tbd"
    >
      <HelpCircle className={size === "md" ? "h-3 w-3" : "h-2.5 w-2.5"} />
      TBD
    </span>
  );
}
