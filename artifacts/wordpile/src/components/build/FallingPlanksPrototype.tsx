import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import type { WordEntry } from "@/data/types";
import {
  BUCKET_HEX,
  PAPER_HEX,
  SAND_HEX,
  RULE_HEX,
  bucketBehavior,
  planktext,
} from "@/lib/buildBehavior";
import type { UnsortedVerdict } from "@/pages/BuildPage";

interface Props {
  pileId: string;
  words: WordEntry[];
  resetKey: number;
  onStructuralCountChange: (n: number) => void;
  onUnsortedPlaced: (v: UnsortedVerdict) => void;
}

interface PlankState {
  body: Matter.Body;
  word: WordEntry;
  /** Pixel width/height of the plank as drawn on the canvas. */
  width: number;
  height: number;
  /** Set when this plank's "fails" behavior has shattered it. */
  shattered: boolean;
  /** Set the moment the plank touches anything (the floor or another plank). */
  landed: boolean;
}

const STAGE_W = 640;
const STAGE_H = 420;
const FLOOR_THICKNESS = 24;
const PLANK_W = 120;
const PLANK_H = 22;

/**
 * Prototype C — Falling planks. Lightweight 2D physics: word-planks drop
 * from the top, the kid steers them with arrow keys / left-right zones
 * before they land. Load planks are heavy and stay; Interior planks are
 * light; Avoid planks render with rot and shatter on impact.
 */
export function FallingPlanksPrototype({
  words,
  resetKey,
  onStructuralCountChange,
  onUnsortedPlaced,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const planksRef = useRef<PlankState[]>([]);
  const queueRef = useRef<WordEntry[]>([]);
  const dropXRef = useRef<number>(STAGE_W / 2);
  const animFrameRef = useRef<number | null>(null);

  const [queueCursor, setQueueCursor] = useState(0);
  const [structuralCount, setStructuralCount] = useState(0);
  const [pendingUnsorted, setPendingUnsorted] = useState<WordEntry | null>(
    null,
  );

  // Initialize / rebuild on words change or reset.
  useEffect(() => {
    // Build a queue from the available words. Cycle Load -> Interior
    // -> Unsorted -> Avoid so a kid sees variety quickly.
    const order = ["load", "interior", "unsorted", "avoid"] as const;
    const buckets: Record<string, WordEntry[]> = {
      load: [],
      interior: [],
      unsorted: [],
      avoid: [],
    };
    for (const w of words) {
      if (w.word.trim() === "") continue;
      buckets[w.bucket].push(w);
    }
    const queue: WordEntry[] = [];
    let added = true;
    while (added) {
      added = false;
      for (const b of order) {
        const next = buckets[b].shift();
        if (next) {
          queue.push(next);
          added = true;
        }
      }
    }
    queueRef.current = queue;
    setQueueCursor(0);
    planksRef.current = [];
    setStructuralCount(0);
    setPendingUnsorted(null);

    // Set up matter engine
    const Engine = Matter.Engine;
    const Bodies = Matter.Bodies;
    const Composite = Matter.Composite;
    const Events = Matter.Events;

    const engine = Engine.create();
    engine.gravity.y = 1;
    engineRef.current = engine;

    // Floor + walls
    const floor = Bodies.rectangle(
      STAGE_W / 2,
      STAGE_H - FLOOR_THICKNESS / 2,
      STAGE_W,
      FLOOR_THICKNESS,
      { isStatic: true, label: "floor" },
    );
    const leftWall = Bodies.rectangle(-10, STAGE_H / 2, 20, STAGE_H, {
      isStatic: true,
      label: "wall",
    });
    const rightWall = Bodies.rectangle(STAGE_W + 10, STAGE_H / 2, 20, STAGE_H, {
      isStatic: true,
      label: "wall",
    });
    Composite.add(engine.world, [floor, leftWall, rightWall]);

    // Track collisions: avoid planks shatter on the first contact; any
    // other plank that touches anything counts as "landed."
    Events.on(engine, "collisionStart", (event) => {
      for (const pair of event.pairs) {
        const a = pair.bodyA;
        const b = pair.bodyB;
        for (const body of [a, b]) {
          const plank = planksRef.current.find((p) => p.body === body);
          if (!plank) continue;
          plank.landed = true;
          if (
            !plank.shattered &&
            bucketBehavior(plank.word.bucket) === "fails"
          ) {
            plank.shattered = true;
            // Remove from world so it visually "shatters" (we draw the
            // crack overlay for one frame via the canvas loop).
            window.setTimeout(() => {
              Composite.remove(engine.world, plank.body);
              planksRef.current = planksRef.current.filter(
                (p) => p !== plank,
              );
            }, 100);
          }
        }
      }
    });

    // Render loop — manual canvas draw so we can letter-render words on
    // each plank face cleanly. Matter's built-in renderer doesn't help
    // us here.
    const ctx = canvasRef.current?.getContext("2d");
    function tick() {
      if (!engineRef.current || !ctx) return;
      Engine.update(engineRef.current, 1000 / 60);
      drawScene(ctx);
      // Update structural count based on resting load planks.
      let structural = 0;
      for (const p of planksRef.current) {
        if (p.shattered) continue;
        if (p.word.bucket !== "load") continue;
        if (Math.abs(p.body.velocity.y) < 0.5 && p.landed) structural += 1;
      }
      setStructuralCount(structural);
      animFrameRef.current = window.requestAnimationFrame(tick);
    }
    animFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current !== null) {
        window.cancelAnimationFrame(animFrameRef.current);
      }
      Events.off(engine, "collisionStart");
      Composite.clear(engine.world, false, true);
      Engine.clear(engine);
      engineRef.current = null;
      planksRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, resetKey]);

  useEffect(() => {
    onStructuralCountChange(structuralCount);
  }, [structuralCount, onStructuralCountChange]);

  // Surface the unsorted prompt outside the render loop.
  useEffect(() => {
    if (pendingUnsorted) {
      onUnsortedPlaced({
        wordId: pendingUnsorted.id,
        word: pendingUnsorted.word,
        suggested: "interior",
      });
      setPendingUnsorted(null);
    }
  }, [pendingUnsorted, onUnsortedPlaced]);

  function drawScene(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, STAGE_W, STAGE_H);
    // Background
    ctx.fillStyle = PAPER_HEX;
    ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    // Sky / floor markings
    ctx.fillStyle = SAND_HEX;
    ctx.fillRect(0, STAGE_H - FLOOR_THICKNESS, STAGE_W, FLOOR_THICKNESS);
    ctx.fillStyle = RULE_HEX;
    ctx.fillRect(0, STAGE_H - FLOOR_THICKNESS, STAGE_W, 2);

    // Drop indicator
    ctx.fillStyle = "rgba(31, 61, 46, 0.18)";
    ctx.fillRect(dropXRef.current - PLANK_W / 2, 0, PLANK_W, 6);
    ctx.fillStyle = "rgba(31, 61, 46, 0.55)";
    ctx.fillRect(dropXRef.current - 1, 0, 2, 14);

    // Planks
    ctx.font =
      '600 12px "JetBrains Mono", ui-monospace, Menlo, monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const p of planksRef.current) {
      const { x, y } = p.body.position;
      const angle = p.body.angle;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      const fill = BUCKET_HEX[p.word.bucket];
      ctx.fillStyle = fill;
      // Avoid planks render lighter and with a "rot" pattern.
      if (p.word.bucket === "avoid") {
        ctx.globalAlpha = 0.85;
      } else if (p.word.bucket === "interior") {
        ctx.globalAlpha = 0.85;
      } else {
        ctx.globalAlpha = 1;
      }
      const w = p.width;
      const h = p.height;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      // Wood-grain stroke
      ctx.strokeStyle = "rgba(0,0,0,0.18)";
      ctx.lineWidth = 1;
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      // Avoid: draw cracks
      if (p.word.bucket === "avoid") {
        ctx.strokeStyle = "rgba(244, 237, 224, 0.55)";
        ctx.beginPath();
        ctx.moveTo(-w / 2 + 8, -h / 2);
        ctx.lineTo(-w / 2 + 18, h / 2);
        ctx.moveTo(0, -h / 2);
        ctx.lineTo(8, h / 2);
        ctx.moveTo(w / 2 - 12, -h / 2);
        ctx.lineTo(w / 2 - 4, h / 2);
        ctx.stroke();
      }
      // Word
      ctx.fillStyle = PAPER_HEX;
      ctx.fillText(planktext(p.word, 14), 0, 0);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  function dropNext() {
    const queue = queueRef.current;
    if (queueCursor >= queue.length) return;
    const word = queue[queueCursor];
    const Bodies = Matter.Bodies;
    const Composite = Matter.Composite;
    const engine = engineRef.current;
    if (!engine) return;
    const behavior = bucketBehavior(word.bucket);
    // Width/density vary by behavior so the metaphor reads visually:
    // load is heavy and full-size; interior is lighter and a touch
    // narrower; avoid is rotten (lower density, will shatter on impact).
    const w =
      behavior === "decorative" ? PLANK_W - 20 : PLANK_W;
    const h =
      behavior === "decorative" ? PLANK_H - 4 : PLANK_H;
    const density =
      behavior === "solid"
        ? 0.005
        : behavior === "fails"
          ? 0.002
          : 0.003;
    const restitution = behavior === "fails" ? 0.05 : 0.02;
    const friction = behavior === "solid" ? 0.9 : 0.7;
    const body = Bodies.rectangle(dropXRef.current, 30, w, h, {
      density,
      restitution,
      friction,
      frictionStatic: 1,
      label: word.id,
    });
    Composite.add(engine.world, body);
    planksRef.current.push({
      body,
      word,
      width: w,
      height: h,
      shattered: false,
      landed: false,
    });
    setQueueCursor((c) => c + 1);
    if (behavior === "untested") {
      // Surface the name-test prompt after a short delay so the kid sees
      // what the plank does first.
      window.setTimeout(() => {
        setPendingUnsorted(word);
      }, 900);
    }
  }

  function moveDrop(dir: -1 | 1) {
    // Always nudge the drop indicator for the next plank.
    dropXRef.current = Math.max(
      PLANK_W / 2,
      Math.min(STAGE_W - PLANK_W / 2, dropXRef.current + dir * 28),
    );
    // If a plank is currently in flight (added but hasn't touched
    // anything yet), steer it laterally too — kid-friendly: you can
    // adjust until it lands.
    const inFlight = [...planksRef.current]
      .reverse()
      .find((p) => !p.landed && !p.shattered);
    if (inFlight) {
      const Body = Matter.Body;
      const nudge = dir * 0.7;
      const cur = inFlight.body.velocity;
      Body.setVelocity(inFlight.body, { x: nudge, y: cur.y });
    }
  }

  // Pointer-controlled drop position: clicking/tapping a position on the
  // top half of the canvas sets the drop x. Click on the bottom half
  // releases the next plank.
  function onPointerDownStage(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * STAGE_W;
    const y = ((e.clientY - rect.top) / rect.height) * STAGE_H;
    dropXRef.current = Math.max(
      PLANK_W / 2,
      Math.min(STAGE_W - PLANK_W / 2, x),
    );
    if (y > STAGE_H * 0.4) {
      dropNext();
    }
  }

  // Keyboard support: arrow keys to nudge, space/enter to drop.
  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === "ArrowLeft") moveDrop(-1);
      else if (ev.key === "ArrowRight") moveDrop(1);
      else if (ev.key === " " || ev.key === "Enter") {
        ev.preventDefault();
        dropNext();
      }
    }
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.addEventListener("keydown", onKey);
    return () => wrap.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueCursor]);

  const upcoming = queueRef.current.slice(queueCursor, queueCursor + 4);
  const exhausted = queueCursor >= queueRef.current.length;

  return (
    <div className="prototype-grid">
      <aside className="timber-tray" aria-label="Up next">
        <header className="timber-tray-header">
          <p className="eyebrow">Up next</p>
          <span className="eyebrow" style={{ color: "var(--color-stone)" }}>
            {queueCursor} / {queueRef.current.length}
          </span>
        </header>
        <div className="timber-tray-list">
          {upcoming.length === 0 ? (
            <p
              className="text-sm italic px-2"
              style={{ color: "var(--color-stone)" }}
            >
              Tray empty. Hit Reset to refill.
            </p>
          ) : (
            upcoming.map((w, i) => (
              <div
                key={`${w.id}-${i}`}
                className={`timber-tray-card bucket-${w.bucket}`}
                style={{ cursor: "default" }}
                data-testid={`planks-upnext-${i}`}
              >
                <span className="timber timber-tray-word">{w.word}</span>
                <span className="timber-tray-bucket">
                  {w.bucket === "unsorted" ? "Untreated" : w.bucket}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="planks-controls">
          <p className="eyebrow mb-2">Steer</p>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => moveDrop(-1)}
              data-testid="button-planks-left"
              aria-label="Steer left"
            >
              ◀
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={dropNext}
              disabled={exhausted}
              data-testid="button-planks-drop"
            >
              Drop
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => moveDrop(1)}
              data-testid="button-planks-right"
              aria-label="Steer right"
            >
              ▶
            </button>
          </div>
          <p
            className="text-xs mt-3"
            style={{ color: "var(--color-stone)" }}
          >
            Or click on the stage to set a drop spot, click again to drop.
            Arrow keys + space also work.
          </p>
        </div>
      </aside>

      <div
        className="planks-stage-wrap"
        ref={wrapRef}
        tabIndex={0}
        data-testid="planks-stage-wrap"
      >
        <div className="stacker-instructions">
          <p className="eyebrow">Stage C · Falling planks</p>
          <p className="text-sm" style={{ color: "var(--color-stone)" }}>
            Steer the next word-plank, then drop. Load is heavy and stays;
            Interior is light; Avoid is rotten and shatters on impact.
          </p>
        </div>
        <canvas
          ref={canvasRef}
          width={STAGE_W}
          height={STAGE_H}
          className="planks-canvas"
          onPointerDown={onPointerDownStage}
          data-testid="planks-canvas"
        />
      </div>
    </div>
  );
}
