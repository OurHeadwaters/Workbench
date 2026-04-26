import { CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import { formatTagDate, type SourceTag, confirmed } from "@/data/tags";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  tag?: SourceTag;
  className?: string;
}

export function Num({ children, tag, className }: Props) {
  const t = tag ?? confirmed();

  let dot: React.ReactNode = null;
  let title = "";

  if (t.kind === "confirmed") {
    dot = (
      <CheckCircle2
        className="inline-block h-2.5 w-2.5 ml-1 align-baseline"
        style={{ color: "hsl(167 60% 32%)" }}
      />
    );
    title = t.note ?? `confirmed ${formatTagDate(t.date)}`;
  } else if (t.kind === "provisional") {
    dot = (
      <AlertTriangle
        className="inline-block h-2.5 w-2.5 ml-1 align-baseline"
        style={{ color: "hsl(28 70% 42%)" }}
      />
    );
    title = `provisional${t.reason ? ` — ${t.reason}` : ""}`;
  } else {
    dot = (
      <HelpCircle
        className="inline-block h-2.5 w-2.5 ml-1 align-baseline text-muted-foreground"
      />
    );
    title = `TBD${t.reason ? ` — ${t.reason}` : ""}`;
  }

  return (
    <span
      className={cn("inline-flex items-baseline whitespace-nowrap num", className)}
      title={title}
      data-tag={t.kind}
    >
      {children}
      {dot}
    </span>
  );
}
