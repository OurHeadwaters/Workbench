import { useEffect, useMemo, useState } from "react";
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

interface Placed {
  /** Unique placement id (one word can be placed multiple times). */
  id: string;
  word: WordEntry;
  /** "frame" / "trim" / "untested" — only set after a successful placement. */
  zone: "frame" | "trim" | "untested";
}

interface Cracking {
  id: string;
  word: WordEntry;
  /** Pixel position relative to stage where crack appears. */
  x: number;
  y: number;
}

const FRAME_SLOTS = 5;
const TRIM_SLOTS = 6;

/** Maps a successful placement zone back to the bucket the kid likely meant. */
function suggestedBucketForZone(zone: "frame" | "trim"): "load" | "interior" {
  return zone === "frame" ? "load" : "interior";
}

/**
 * Prototype A — Stacker. A foundation slab is shown at the bottom; the
 * kid drags word-timbers from the side tray into a Frame zone (load-bearing)
 * or Trim zone (interior). Avoid words crack and slide off.
 */
export function StackerPrototype({
  words,
  resetKey,
  onStructuralCountChange,
  onUnsortedPlaced,
}: Props) {
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [cracking, setCracking] = useState<Cracking[]>([]);
  const [bumpId, setBumpId] = useState<string | null>(null);

  useEffect(() => {
    setPlaced([]);
    setCracking([]);
    setBumpId(null);
  }, [resetKey]);

  const frameItems = useMemo(
    () => placed.filter((p) => p.zone === "frame").slice(0, FRAME_SLOTS),
    [placed],
  );
  const trimItems = useMemo(
    () => placed.filter((p) => p.zone === "trim" || p.zone === "untested"),
    [placed],
  );

  useEffect(() => {
    onStructuralCountChange(frameItems.length);
  }, [frameItems.length, onStructuralCountChange]);

  function flashBump(id: string) {
    setBumpId(id);
    window.setTimeout(() => setBumpId((cur) => (cur === id ? null : cur)), 700);
  }

  function placeWord(word: WordEntry, target: Element | null, x: number, y: number) {
    const behavior = bucketBehavior(word.bucket);
    const drop = findDropTarget(target);
    const isStage = !!drop && drop.dataset.drop?.startsWith("stacker");

    // Cracks-and-fails: regardless of where it landed, render the crack
    // animation and don't keep the word.
    if (behavior === "fails") {
      const id = `crack-${word.id}-${Date.now()}`;
      // Position relative to viewport — we render the crack absolutely
      // positioned with `position: fixed`.
      setCracking((c) => [...c, { id, word, x, y }]);
      window.setTimeout(
        () => setCracking((c) => c.filter((x) => x.id !== id)),
        1100,
      );
      return;
    }

    // Anything else needs to land on the stage to count.
    if (!isStage) return;

    const newId = `place-${word.id}-${Date.now()}`;
    if (behavior === "solid") {
      if (frameItems.length >= FRAME_SLOTS) {
        flashBump("frame-full");
        return;
      }
      setPlaced((p) => [...p, { id: newId, word, zone: "frame" }]);
      flashBump(newId);
      return;
    }
    if (behavior === "decorative") {
      if (trimItems.length >= TRIM_SLOTS) {
        flashBump("trim-full");
        return;
      }
      setPlaced((p) => [...p, { id: newId, word, zone: "trim" }]);
      flashBump(newId);
      return;
    }
    // Untreated lumber — try the frame first (kid's "is this load?" test).
    // If frame is full, fall back to trim. The bucket suggestion in the
    // name-test prompt mirrors which zone the plank actually held in.
    if (behavior === "untested") {
      const targetZone: "frame" | "trim" =
        frameItems.length < FRAME_SLOTS ? "frame" : "trim";
      if (targetZone === "trim" && trimItems.length >= TRIM_SLOTS) {
        flashBump("trim-full");
        return;
      }
      setPlaced((p) => [...p, { id: newId, word, zone: "untested" }]);
      flashBump(newId);
      onUnsortedPlaced({
        wordId: word.id,
        word: word.word,
        suggested: suggestedBucketForZone(targetZone),
      });
    }
  }

  /**
   * Tap-to-place fallback — non-failing words drop into the most
   * sensible zone (frame for load words, trim for everything else)
   * without needing a successful drag-drop. Failing words still play
   * the crack animation right where the tap landed.
   */
  function tapPlace(word: WordEntry) {
    const behavior = bucketBehavior(word.bucket);
    if (behavior === "fails") {
      // Crack near the centre of the viewport — the tap path doesn't
      // give us a precise target.
      const x = window.innerWidth / 2;
      const y = window.innerHeight / 2;
      placeWord(word, null, x, y);
      return;
    }
    // Build a faux drop target so placeWord's stage-check passes.
    const fauxStage = document.createElement("div");
    fauxStage.dataset.drop = "stacker-stage";
    placeWord(word, fauxStage, 0, 0);
  }

  return (
    <div className="prototype-grid">
      <TimberTray words={words} onDrop={placeWord} onTap={tapPlace} />

      <div className="stacker-stage" data-drop="stacker-stage">
        <div className="stacker-instructions">
          <p className="eyebrow">Stage A · Stacker</p>
          <p className="text-sm" style={{ color: "var(--color-stone)" }}>
            Drag word-timbers from the tray onto the building. Load-bearing
            words snap into the frame; Interior trim sits on top; Avoid
            words crack and slide off.
          </p>
        </div>

        {/* Trim row — sits on top of the frame. */}
        <div className="stacker-trim" data-testid="stacker-trim">
          {trimItems.map((p) => (
            <div
              key={p.id}
              className={`stacker-trim-piece bucket-${p.word.bucket} ${
                bumpId === p.id ? "is-bump" : ""
              }`}
              data-testid={`stacker-trim-${p.word.id}`}
              title={p.zone === "untested" ? "Untreated lumber — file it after." : undefined}
            >
              <span className="timber">{planktext(p.word, 18)}</span>
              {p.zone === "untested" && (
                <span className="stacker-untested-badge">?</span>
              )}
            </div>
          ))}
        </div>

        {/* Frame row — load-bearing slots. */}
        <div className="stacker-frame" data-testid="stacker-frame">
          {Array.from({ length: FRAME_SLOTS }).map((_, i) => {
            const piece = frameItems[i];
            return (
              <div
                key={i}
                className={`stacker-frame-slot ${piece ? "is-filled" : ""} ${
                  piece && bumpId === piece.id ? "is-bump" : ""
                }`}
                data-testid={`stacker-frame-slot-${i}`}
              >
                {piece ? (
                  <span className="timber">{planktext(piece.word, 16)}</span>
                ) : (
                  <span
                    className="eyebrow"
                    style={{ color: "var(--color-sand)" }}
                  >
                    Slot {i + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Foundation slab. */}
        <div className="stacker-slab">
          <span className="eyebrow" style={{ color: "var(--color-paper)" }}>
            Foundation
          </span>
        </div>
      </div>

      {/* Cracks rendered fixed-positioned so they appear right where the
          pointer was released. */}
      {cracking.map((c) => (
        <div
          key={c.id}
          className="stacker-crack"
          style={{ left: c.x - 60, top: c.y - 18 }}
          data-testid={`stacker-crack-${c.word.id}`}
          aria-hidden="true"
        >
          <span className="timber">{planktext(c.word, 14)}</span>
          <div className="stacker-crack-line" />
          {c.word.saferAlternative && (
            <div className="stacker-crack-tip">
              try{" "}
              <span className="timber">{c.word.saferAlternative}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
