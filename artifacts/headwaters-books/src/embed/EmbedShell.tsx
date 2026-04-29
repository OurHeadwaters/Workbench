import type { ReactNode } from "react";
import { SAMPLE } from "./sampleData";

/**
 * Chrome-free shell for the public /embed/* routes.
 *
 * The embeds load inside the Deer Lake walkthrough as iframes. They
 * must look like the real product — same palette, same components —
 * but carry no top nav, no sidebar, no footer, and no Clerk gate. The
 * only persistent UI element a councillor sees on every embed is the
 * "Sample · Deer Lake demo" badge so the demo numbers can never be
 * confused for the band's real numbers.
 */
export function EmbedShell({
  eyebrow,
  title,
  caption,
  children,
}: {
  eyebrow: string;
  title: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-7">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <p className="text-[10.5px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1">
              {eyebrow}
            </p>
            <h1 className="font-serif text-xl sm:text-2xl font-bold leading-tight text-foreground">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-prose">
              {caption}
            </p>
          </div>
          <span
            data-testid="embed-sample-badge"
            className="shrink-0 inline-flex items-center rounded-md border border-amber-300 bg-amber-50 text-amber-900 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.16em]"
          >
            {SAMPLE.brand}
          </span>
        </div>
        <div className="space-y-5">{children}</div>
        <p className="mt-6 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
          Demo data · {SAMPLE.period} · no real bank or PII data
        </p>
      </div>
    </div>
  );
}
