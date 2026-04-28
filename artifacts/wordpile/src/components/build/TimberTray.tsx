import { useState } from "react";
import type { WordEntry } from "@/data/types";
import { BUCKET_LABELS } from "@/data/types";
import { bucketBehavior, behaviorBlurb } from "@/lib/buildBehavior";
import { usePointerDrag, findDropTarget } from "./usePointerDrag";

export interface TrayWord extends WordEntry {
  /** Override label when displayed in the tray (untreated lumber, etc). */
  trayLabel?: string;
}

interface TrayCardProps {
  word: WordEntry;
  /** Called once per drop with the element under the pointer. */
  onDropAt?: (word: WordEntry, target: Element | null, x: number, y: number) => void;
  /** Tap/click fallback — allows a kid to tap-to-place. */
  onTap?: (word: WordEntry) => void;
  /** Optional badge label shown next to the bucket pill (e.g. "untreated"). */
  badge?: string;
  testId?: string;
}

export function TrayCard({ word, onDropAt, onTap, badge, testId }: TrayCardProps) {
  const { handlers, dragging } = usePointerDrag<WordEntry>({
    payload: word,
    onDrop: (payload, target, x, y) => {
      if (onDropAt) onDropAt(payload, target, x, y);
    },
    onTap: (payload) => {
      if (onTap) onTap(payload);
    },
  });
  const behavior = bucketBehavior(word.bucket);
  // Keyboard "pick up + drop" — Enter or Space routes the word through
  // the same tap-to-place path mouse/touch users get. The Stacker decides
  // which slot it lands in based on its bucket, so a single keystroke is
  // a complete pickup-and-drop for keyboard-only practitioners.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      if (onTap) onTap(word);
    }
  };
  const bucketLabel = badge ?? BUCKET_LABELS[word.bucket];
  const ariaLabel = `${word.word}. ${bucketLabel}. ${behaviorBlurb(behavior)} Press Enter or Space to place it on the build.`;
  return (
    <>
      <div
        className={`timber-tray-card bucket-${word.bucket} ${
          dragging ? "is-dragging" : ""
        }`}
        {...handlers}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        title={behaviorBlurb(behavior)}
        data-testid={testId ?? `tray-word-${word.id}`}
      >
        <span className="timber timber-tray-word">{word.word}</span>
        <span className="timber-tray-bucket" aria-hidden="true">
          {bucketLabel}
        </span>
      </div>
      {dragging && (
        <DragGhost word={word} dragging={dragging} />
      )}
    </>
  );
}

function DragGhost({
  word,
  dragging,
}: {
  word: WordEntry;
  dragging: { x: number; y: number; width: number; height: number };
}) {
  return (
    <div
      className={`timber-drag-ghost bucket-${word.bucket}`}
      style={{
        left: dragging.x,
        top: dragging.y,
        width: dragging.width,
        height: dragging.height,
      }}
      aria-hidden="true"
    >
      <span className="timber">{word.word}</span>
    </div>
  );
}

interface TimberTrayProps {
  words: WordEntry[];
  onDrop: (word: WordEntry, target: Element | null, x: number, y: number) => void;
  /** Optional click-to-place fallback. */
  onTap?: (word: WordEntry) => void;
  /** Words removed from the tray (already placed) — keyed by id. */
  hiddenIds?: Set<string>;
  /** Title shown above the tray. */
  title?: string;
}

/**
 * Side tray of word-timbers shared by all three Build prototypes. Each
 * card is draggable; the drop logic is owned by the parent prototype.
 */
export function TimberTray({
  words,
  onDrop,
  onTap,
  hiddenIds,
  title = "Timber tray",
}: TimberTrayProps) {
  const [filter, setFilter] = useState<"all" | "load" | "interior" | "avoid" | "unsorted">("all");
  const visible = words.filter((w) => {
    if (hiddenIds?.has(w.id)) return false;
    if (filter === "all") return true;
    return w.bucket === filter;
  });
  return (
    <aside className="timber-tray" aria-label={title}>
      <header className="timber-tray-header">
        <p className="eyebrow">{title}</p>
        <span className="eyebrow" style={{ color: "var(--color-stone)" }}>
          {visible.length} of {words.length}
        </span>
      </header>
      <div className="timber-tray-filters" role="tablist">
        {(
          [
            ["all", "All"],
            ["load", "Load"],
            ["interior", "Interior"],
            ["avoid", "Avoid"],
            ["unsorted", "Untreated"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            className={`timber-tray-filter ${filter === key ? "is-active" : ""}`}
            onClick={() => setFilter(key)}
            data-testid={`tray-filter-${key}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="timber-tray-list" data-testid="timber-tray-list">
        {visible.length === 0 ? (
          <p
            className="text-sm italic px-2"
            style={{ color: "var(--color-stone)" }}
          >
            No timbers here.
          </p>
        ) : (
          visible.map((w) => (
            <TrayCard
              key={w.id}
              word={w}
              onDropAt={onDrop}
              onTap={onTap}
              badge={w.bucket === "unsorted" ? "Untreated" : undefined}
            />
          ))
        )}
      </div>
    </aside>
  );
}

export { findDropTarget };
