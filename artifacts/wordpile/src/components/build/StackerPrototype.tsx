import { useEffect, useImperativeHandle, useMemo, useRef, useState, forwardRef } from "react";
import type { WordEntry } from "@/data/types";
import { bucketBehavior, planktext } from "@/lib/buildBehavior";
import { TimberTray, findDropTarget } from "./TimberTray";
import type { UnsortedVerdict } from "@/pages/BuildPage";
import {
  playFrameSnap,
  playTrimTap,
  playUntestedTap,
  playCrack,
  playBump,
  playStandingChime,
} from "@/lib/buildAudio";
import type { SharePiece } from "@/lib/buildShare";

interface Props {
  pileId: string;
  words: WordEntry[];
  resetKey: number;
  onStructuralCountChange: (n: number) => void;
  onUnsortedPlaced: (v: UnsortedVerdict) => void;
  /** Reports run-level totals for the parent's stats panel. */
  onRunUpdate: (run: RunState) => void;
  /** Fires once each time the building flips from "not yet" -> "standing." */
  onJustStood: () => void;
}

export interface RunState {
  framePlaced: number;
  trimPlaced: number;
  cracks: number;
  standing: boolean;
}

export interface StackerSnapshotHandle {
  getSnapshot: () => { frame: (SharePiece | null)[]; trim: SharePiece[] };
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
  /** Pixel position relative to viewport where crack appears. */
  x: number;
  y: number;
}

interface DustParticle {
  id: string;
  /** Position in viewport pixels. */
  x: number;
  y: number;
  dx: number;
  dy: number;
  rotate: number;
}

const FRAME_SLOTS = 5;
const TRIM_SLOTS = 6;
export const STANDING_THRESHOLD_LOCAL = 3;

/** Maps a successful placement zone back to the bucket the kid likely meant. */
function suggestedBucketForZone(zone: "frame" | "trim"): "load" | "interior" {
  return zone === "frame" ? "load" : "interior";
}

/**
 * The canonical Build experience. A foundation slab sits at the bottom; the
 * kid drags word-timbers from the side tray into a Frame zone (load-bearing)
 * or a Trim zone (interior). Avoid words crack and slide off, dropping a
 * little dust where they land. Untreated words land loose and trigger the
 * one-tap "name test" prompt up at the page level.
 */
export const StackerPrototype = forwardRef<StackerSnapshotHandle, Props>(
  function StackerPrototype(
    {
      words,
      resetKey,
      onStructuralCountChange,
      onUnsortedPlaced,
      onRunUpdate,
      onJustStood,
    },
    ref,
  ) {
    const [placed, setPlaced] = useState<Placed[]>([]);
    const [cracking, setCracking] = useState<Cracking[]>([]);
    const [dust, setDust] = useState<DustParticle[]>([]);
    const [bumpId, setBumpId] = useState<string | null>(null);
    const [stoodOnce, setStoodOnce] = useState(false);
    const [crackCount, setCrackCount] = useState(0);

    useEffect(() => {
      setPlaced([]);
      setCracking([]);
      setDust([]);
      setBumpId(null);
      setStoodOnce(false);
      setCrackCount(0);
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

    const standing = frameItems.length >= STANDING_THRESHOLD_LOCAL;
    useEffect(() => {
      if (standing && !stoodOnce) {
        setStoodOnce(true);
        playStandingChime();
        onJustStood();
      }
    }, [standing, stoodOnce, onJustStood]);

    useEffect(() => {
      onRunUpdate({
        framePlaced: frameItems.length,
        trimPlaced: trimItems.length,
        cracks: crackCount,
        standing,
      });
    }, [frameItems.length, trimItems.length, crackCount, standing, onRunUpdate]);

    useImperativeHandle(
      ref,
      () => ({
        getSnapshot: () => {
          const frame: (SharePiece | null)[] = Array.from({ length: FRAME_SLOTS }).map(
            (_, i) => {
              const piece = frameItems[i];
              if (!piece) return null;
              return {
                word: piece.word.word,
                bucket: piece.word.bucket,
                untested: piece.zone === "untested",
              };
            },
          );
          const trim: SharePiece[] = trimItems.map((p) => ({
            word: p.word.word,
            bucket: p.word.bucket,
            untested: p.zone === "untested",
          }));
          return { frame, trim };
        },
      }),
      [frameItems, trimItems],
    );

    function flashBump(id: string) {
      setBumpId(id);
      window.setTimeout(
        () => setBumpId((cur) => (cur === id ? null : cur)),
        700,
      );
    }

    function spawnDust(x: number, y: number) {
      // 6 little flecks scattered around the impact point.
      const seeds: DustParticle[] = [];
      for (let i = 0; i < 6; i += 1) {
        const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.4;
        const distance = 18 + Math.random() * 22;
        seeds.push({
          id: `dust-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          x,
          y,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance + 12,
          rotate: Math.random() * 60 - 30,
        });
      }
      setDust((d) => [...d, ...seeds]);
      window.setTimeout(() => {
        setDust((d) => d.filter((p) => !seeds.some((s) => s.id === p.id)));
      }, 900);
    }

    function placeWord(
      word: WordEntry,
      target: Element | null,
      x: number,
      y: number,
    ) {
      const behavior = bucketBehavior(word.bucket);
      const drop = findDropTarget(target);
      const isStage = !!drop && drop.dataset.drop?.startsWith("stacker");

      // Cracks-and-fails: regardless of where it landed, render the crack
      // animation, kick out a dust puff, and don't keep the word.
      if (behavior === "fails") {
        const id = `crack-${word.id}-${Date.now()}`;
        setCracking((c) => [...c, { id, word, x, y }]);
        spawnDust(x, y + 6);
        playCrack();
        setCrackCount((n) => n + 1);
        window.setTimeout(
          () => setCracking((c) => c.filter((cur) => cur.id !== id)),
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
          playBump();
          return;
        }
        setPlaced((p) => [...p, { id: newId, word, zone: "frame" }]);
        flashBump(newId);
        playFrameSnap();
        return;
      }
      if (behavior === "decorative") {
        if (trimItems.length >= TRIM_SLOTS) {
          flashBump("trim-full");
          playBump();
          return;
        }
        setPlaced((p) => [...p, { id: newId, word, zone: "trim" }]);
        flashBump(newId);
        playTrimTap();
        return;
      }
      // Untreated lumber — try the frame first (kid's "is this load?" test).
      if (behavior === "untested") {
        const targetZone: "frame" | "trim" =
          frameItems.length < FRAME_SLOTS ? "frame" : "trim";
        if (targetZone === "trim" && trimItems.length >= TRIM_SLOTS) {
          flashBump("trim-full");
          playBump();
          return;
        }
        setPlaced((p) => [...p, { id: newId, word, zone: "untested" }]);
        flashBump(newId);
        playUntestedTap();
        onUnsortedPlaced({
          wordId: word.id,
          word: word.word,
          suggested: suggestedBucketForZone(targetZone),
        });
      }
    }

    /**
     * Tap-to-place fallback — non-failing words drop into the most sensible
     * zone (frame for load words, trim for everything else) without needing
     * a successful drag-drop. Failing words still play the crack animation,
     * roughly in the centre of the stage.
     */
    function tapPlace(word: WordEntry) {
      const behavior = bucketBehavior(word.bucket);
      if (behavior === "fails") {
        const stage = document.querySelector("[data-drop='stacker-stage']");
        const rect = stage?.getBoundingClientRect();
        const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
        const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
        placeWord(word, null, cx, cy);
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

        <div
          className={`stacker-stage ${standing ? "is-standing" : ""}`}
          data-drop="stacker-stage"
          data-testid="stacker-stage"
        >
          {standing && <div className="stacker-rays" aria-hidden="true" />}

          {/* Trim row — sits on top of the frame. */}
          <div className="stacker-trim" data-testid="stacker-trim">
            {trimItems.map((p) => (
              <div
                key={p.id}
                className={`stacker-trim-piece bucket-${p.word.bucket} ${
                  bumpId === p.id ? "is-bump" : ""
                }`}
                data-testid={`stacker-trim-${p.word.id}`}
                title={
                  p.zone === "untested"
                    ? "Untreated lumber — file it after."
                    : undefined
                }
              >
                <span className="timber">{planktext(p.word, 18)}</span>
                <span className="stacker-trim-grain" aria-hidden="true" />
                {p.zone === "untested" && (
                  <span className="stacker-untested-badge">?</span>
                )}
              </div>
            ))}
            {trimItems.length === 0 && (
              <span className="stacker-trim-hint">trim sits here</span>
            )}
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
                    <>
                      <span className="timber stacker-frame-word">
                        {planktext(piece.word, 16)}
                      </span>
                      <span
                        className="stacker-frame-grain"
                        aria-hidden="true"
                      />
                    </>
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
            <span className="stacker-slab-label">Foundation</span>
            <span className="stacker-slab-grain" aria-hidden="true" />
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

        {/* Dust particles — slow scatter of paper-flecks at the impact site. */}
        {dust.map((p) => (
          <span
            key={p.id}
            className="stacker-dust"
            style={
              {
                left: p.x,
                top: p.y,
                "--dx": `${p.dx}px`,
                "--dy": `${p.dy}px`,
                "--rotate": `${p.rotate}deg`,
              } as React.CSSProperties
            }
            aria-hidden="true"
          />
        ))}
      </div>
    );
  },
);
