import { Link } from "wouter";
import type { Footnote } from "@/data/footnotes";
import { Asterisk } from "lucide-react";

interface Props {
  title?: string;
  notes: Footnote[];
}

export function FootnoteList({ title = "Footnotes", notes }: Props) {
  if (notes.length === 0) return null;
  return (
    <section className="mt-8">
      <div className="flex items-center gap-2 mb-3">
        <Asterisk className="h-4 w-4 text-muted-foreground" />
        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h4>
      </div>
      <ol className="space-y-3 text-sm">
        {notes.map((n, i) => (
          <li
            key={n.id}
            data-testid={`footnote-${n.id}`}
            className="flex gap-3 rounded-lg border border-card-border bg-card/60 p-3"
          >
            <span className="font-mono text-xs text-muted-foreground pt-0.5 min-w-[1.5rem]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{n.title}</p>
              <p className="mt-1 text-muted-foreground leading-relaxed">{n.body}</p>
              {n.crossLink ? (
                <Link
                  href={n.crossLink.href}
                  className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                  data-testid={`footnote-link-${n.id}`}
                >
                  {n.crossLink.label} →
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
