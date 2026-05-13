import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Flag, ChevronLeft, X } from "lucide-react";
import { readAllFlags, type FlagEntry, FLAG_PREFIX } from "@/hooks/useSectionFlag";

function timeSince(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function FlaggedPage() {
  const [flags, setFlags] = useState<FlagEntry[]>([]);

  function refresh() {
    setFlags(readAllFlags());
  }

  useEffect(() => {
    refresh();

    function onStorage(e: StorageEvent) {
      if (e.key?.startsWith(FLAG_PREFIX)) refresh();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function clearFlag(entry: FlagEntry) {
    try {
      localStorage.removeItem(FLAG_PREFIX + entry.sectionId);
      window.dispatchEvent(
        new StorageEvent("storage", { key: FLAG_PREFIX + entry.sectionId }),
      );
    } catch {
      // ignore
    }
    refresh();
  }

  function clearAll() {
    flags.forEach((f) => {
      try {
        localStorage.removeItem(FLAG_PREFIX + f.sectionId);
      } catch {
        // ignore
      }
    });
    window.dispatchEvent(new StorageEvent("storage", { key: FLAG_PREFIX }));
    refresh();
  }

  return (
    <div className="space-y-6" data-testid="page-flagged">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Dashboard
        </Link>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-md grid place-items-center flex-shrink-0"
            style={{ backgroundColor: "#fef3c7", color: "#d97706" }}
          >
            <Flag className="h-4 w-4" fill="#d97706" />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight">Flagged sections</h1>
            <p className="text-xs text-muted-foreground">
              {flags.length === 0
                ? "Nothing flagged — all clear."
                : `${flags.length} section${flags.length !== 1 ? "s" : ""} marked as outdated`}
            </p>
          </div>
        </div>
        {flags.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors border rounded-md px-3 py-1.5"
          >
            Clear all
          </button>
        )}
      </div>

      {flags.length === 0 ? (
        <div
          className="rounded-xl border p-8 text-center"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <Flag className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">No sections flagged yet.</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Hover over any editable section and click the flag icon to mark it for revisiting.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {flags.map((entry) => (
            <li
              key={entry.sectionId}
              className="flex items-start justify-between gap-3 rounded-xl border px-4 py-3"
              style={{ borderColor: "#fde68a", backgroundColor: "#fffbeb" }}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <Flag className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-amber-500" fill="#f59e0b" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-amber-900 truncate">{entry.label}</p>
                  <p className="text-xs text-amber-700/70 mt-0.5">
                    <span className="font-mono">{entry.sectionId}</span>
                    {" · "}
                    flagged {timeSince(entry.flaggedAt)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => clearFlag(entry)}
                title="Remove flag"
                className="flex-shrink-0 p-1 rounded text-amber-600/60 hover:text-amber-700 hover:bg-amber-100 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">
        Flags are stored locally in your browser. To update a section, navigate to the relevant
        page, hover the section, and click{" "}
        <span className="font-medium">Edit</span>.
      </p>
    </div>
  );
}
