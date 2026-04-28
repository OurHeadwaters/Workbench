import { useEffect, useMemo, useRef, useState } from "react";
import type { WordEntry } from "@/data/types";
import { bucketBehavior, planktext } from "@/lib/buildBehavior";
import { TimberTray, findDropTarget } from "./TimberTray";
import type { UnsortedVerdict } from "@/pages/BuildPage";

interface Props {
  pileId: string;
  words: WordEntry[];
  resetKey: number;
  onStructuralCountChange: (n: number) => void;
  onUnsortedPlaced: (v: UnsortedVerdict) => void;
}

const COLS = 6;
const ROWS = 4;

interface BlockCell {
  /** Grid index in row-major order (row * COLS + col). */
  index: number;
  word: WordEntry;
}

interface RejectFlash {
  index: number;
  word: WordEntry;
  expiresAt: number;
}

/**
 * Prototype B — Block builder. A small Lego-style baseplate of cells.
 * The kid drags word-blocks onto cells. Load locks (counts as
 * structural). Interior places loosely (doesn't count). Avoid flashes
 * red, refuses, and shows the safer alternative as a tooltip.
 */
export function BlockBuilderPrototype({
  words,
  resetKey,
  onStructuralCountChange,
  onUnsortedPlaced,
}: Props) {
  const [cells, setCells] = useState<Map<number, BlockCell>>(new Map());
  const [rejects, setRejects] = useState<RejectFlash[]>([]);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCells(new Map());
    setRejects([]);
  }, [resetKey]);

  // Garbage-collect expired reject flashes.
  useEffect(() => {
    if (rejects.length === 0) return;
    const t = window.setTimeout(() => {
      setRejects((rs) => rs.filter((r) => r.expiresAt > Date.now()));
    }, 500);
    return () => window.clearTimeout(t);
  }, [rejects]);

  const structuralCount = useMemo(() => {
    let count = 0;
    for (const c of cells.values()) {
      if (c.word.bucket === "load") count += 1;
    }
    return count;
  }, [cells]);

  useEffect(() => {
    onStructuralCountChange(structuralCount);
  }, [structuralCount, onStructuralCountChange]);

  function cellAtPoint(x: number, y: number): number | null {
    const stage = stageRef.current;
    if (!stage) return null;
    const rect = stage.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;
    if (relX < 0 || relY < 0 || relX > rect.width || relY > rect.height) {
      return null;
    }
    const col = Math.floor((relX / rect.width) * COLS);
    const row = Math.floor((relY / rect.height) * ROWS);
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null;
    return row * COLS + col;
  }

  function placeWord(
    word: WordEntry,
    target: Element | null,
    x: number,
    y: number,
  ) {
    const drop = findDropTarget(target);
    const onStage = drop?.dataset.drop === "blocks-stage";
    if (!onStage) return;
    const idx = cellAtPoint(x, y);
    if (idx === null) return;

    // Cell already occupied — small bump, ignore.
    if (cells.has(idx)) return;

    const behavior = bucketBehavior(word.bucket);

    if (behavior === "fails") {
      // Refuse with a red flash and a tooltip showing the safer alt.
      setRejects((rs) => [
        ...rs,
        { index: idx, word, expiresAt: Date.now() + 1400 },
      ]);
      return;
    }

    setCells((prev) => {
      const next = new Map(prev);
      next.set(idx, { index: idx, word });
      return next;
    });

    if (behavior === "untested") {
      onUnsortedPlaced({
        wordId: word.id,
        word: word.word,
        suggested: "interior",
      });
    }
  }

  function placeIntoFirstEmpty(word: WordEntry) {
    const behavior = bucketBehavior(word.bucket);
    if (behavior === "fails") {
      // Find the first empty cell to flash for the rejection animation.
      for (let i = 0; i < COLS * ROWS; i += 1) {
        if (!cells.has(i)) {
          setRejects((rs) => [
            ...rs,
            { index: i, word, expiresAt: Date.now() + 1400 },
          ]);
          return;
        }
      }
      return;
    }
    for (let i = 0; i < COLS * ROWS; i += 1) {
      if (!cells.has(i)) {
        setCells((prev) => {
          const next = new Map(prev);
          next.set(i, { index: i, word });
          return next;
        });
        if (behavior === "untested") {
          onUnsortedPlaced({
            wordId: word.id,
            word: word.word,
            suggested: "interior",
          });
        }
        return;
      }
    }
  }

  return (
    <div className="prototype-grid">
      <TimberTray
        words={words}
        onDrop={placeWord}
        onTap={placeIntoFirstEmpty}
      />

      <div className="blocks-stage-wrap">
        <div className="stacker-instructions">
          <p className="eyebrow">Stage B · Block builder</p>
          <p className="text-sm" style={{ color: "var(--color-stone)" }}>
            Drag word-blocks onto the baseplate. Load-bearing locks in green;
            Interior places loose; Avoid flashes red and refuses, with a
            safer-word tip.
          </p>
        </div>
        <div
          className="blocks-stage"
          ref={stageRef}
          data-drop="blocks-stage"
          data-testid="blocks-stage"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          }}
        >
          {Array.from({ length: COLS * ROWS }).map((_, i) => {
            const piece = cells.get(i);
            const reject = rejects.find((r) => r.index === i);
            const isBottomRow = i >= COLS * (ROWS - 1);
            return (
              <div
                key={i}
                className={`blocks-cell ${piece ? `is-filled bucket-${piece.word.bucket}` : ""} ${
                  reject ? "is-reject" : ""
                } ${isBottomRow ? "is-baseplate" : ""}`}
                data-testid={`blocks-cell-${i}`}
              >
                {piece && (
                  <span
                    className="timber blocks-cell-label"
                    data-testid={`blocks-cell-word-${piece.word.id}`}
                  >
                    {planktext(piece.word, 12)}
                  </span>
                )}
                {reject && (
                  <div className="blocks-reject-tip" role="tooltip">
                    <span className="timber">{reject.word.word}</span>
                    {reject.word.saferAlternative ? (
                      <div>
                        try{" "}
                        <span className="timber">
                          {reject.word.saferAlternative}
                        </span>
                      </div>
                    ) : (
                      <div style={{ opacity: 0.85 }}>this one cracks here</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="blocks-baseplate-line" />
      </div>
    </div>
  );
}
