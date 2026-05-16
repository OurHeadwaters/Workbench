/**
 * PageAnchor — ADHD page entry guide.
 *
 * Sits at the top of any page. Answers two questions immediately:
 *   1. "Am I in the right place?" → whenToBeHere
 *   2. "What do I do first?"     → theOneThing
 *
 * Collapses after first read (localStorage per-page key).
 * A small "Page guide" pill stays visible to bring it back.
 *
 * Rules:
 *  - whenToBeHere: a short trigger sentence. When X happens, come here.
 *  - theOneThing: a single concrete action. Not a goal. Not a list.
 *  - accentColor: matches the page's bucket color so the strip blends in.
 */

import { useState, useEffect } from "react";
import { X, MapPin } from "lucide-react";

interface PageAnchorProps {
  storageKey: string;
  whenToBeHere: string;
  theOneThing: string;
  accentColor?: string;
}

export function PageAnchor({
  storageKey,
  whenToBeHere,
  theOneThing,
  accentColor = "#1A5FA8",
}: PageAnchorProps) {
  const lsKey = `pgv2.anchor-dismissed.${storageKey}`;
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (window.localStorage.getItem(lsKey) === "1") setDismissed(true);
    } catch {
      // ignore
    }
  }, [lsKey]);

  function dismiss() {
    try {
      window.localStorage.setItem(lsKey, "1");
    } catch {
      // ignore
    }
    setDismissed(true);
  }

  function restore() {
    try {
      window.localStorage.removeItem(lsKey);
    } catch {
      // ignore
    }
    setDismissed(false);
  }

  if (!mounted) return null;

  if (dismissed) {
    return (
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={restore}
          className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-md hover:bg-muted/40 transition-colors"
          title="Show page guide"
          data-testid={`page-anchor-restore-${storageKey}`}
        >
          <MapPin className="h-3 w-3" />
          Page guide
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border p-4 mb-4"
      style={{
        borderColor: accentColor + "28",
        backgroundColor: accentColor + "07",
      }}
      data-testid={`page-anchor-${storageKey}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 grid sm:grid-cols-2 gap-3">
          <div>
            <p
              className="text-[10px] font-mono uppercase tracking-[0.15em] mb-1"
              style={{ color: accentColor, opacity: 0.65 }}
            >
              You're here when
            </p>
            <p className="text-sm text-muted-foreground leading-snug">
              {whenToBeHere}
            </p>
          </div>
          <div>
            <p
              className="text-[10px] font-mono uppercase tracking-[0.15em] mb-1"
              style={{ color: accentColor }}
            >
              The one thing right now
            </p>
            <p
              className="text-sm font-semibold leading-snug"
              style={{ color: accentColor }}
            >
              {theOneThing}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="flex-shrink-0 h-6 w-6 rounded-md grid place-items-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors mt-0.5"
          title="Got it — hide this"
          data-testid={`page-anchor-dismiss-${storageKey}`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
