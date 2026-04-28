import { useCallback, useEffect, useRef, useState } from "react";

export interface PointerDragHandlers {
  onPointerDown: (e: React.PointerEvent) => void;
}

export interface PointerDragState<T> {
  payload: T;
  x: number;
  y: number;
  width: number;
  height: number;
  startedAt: number;
}

interface Options<T> {
  payload: T;
  /**
   * Called when the pointer is released. The element under the pointer
   * (if any) is provided so the caller can inspect `data-drop` etc. The
   * payload is returned by the hook user via the same payload they passed
   * in. Returning anything is ignored.
   */
  onDrop: (payload: T, target: Element | null, x: number, y: number) => void;
  /** Optional click-to-throw fallback (no drag, just a tap). */
  onTap?: (payload: T) => void;
}

/**
 * Lightweight pointer-based drag-and-drop hook. Works on mouse + touch
 * because pointer events normalise both. We deliberately don't use the
 * HTML5 drag-and-drop API because touch support for it is patchy.
 *
 * The hook returns:
 *   - handlers to spread on the draggable source
 *   - a `dragging` state used to render a "ghost" follower on top of the
 *     page while the pointer is moving
 */
export function usePointerDrag<T>({ payload, onDrop, onTap }: Options<T>) {
  const [dragging, setDragging] = useState<PointerDragState<T> | null>(null);
  const draggingRef = useRef<PointerDragState<T> | null>(null);
  const sourceRectRef = useRef<DOMRect | null>(null);
  const offsetRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Ignore secondary buttons.
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      sourceRectRef.current = rect;
      offsetRef.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
      startPosRef.current = { x: e.clientX, y: e.clientY };
      pointerIdRef.current = e.pointerId;
      movedRef.current = false;
      const initial: PointerDragState<T> = {
        payload,
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        startedAt: Date.now(),
      };
      draggingRef.current = initial;
      setDragging(initial);
      try {
        target.setPointerCapture(e.pointerId);
      } catch {
        // Some browsers refuse pointer capture on certain elements; we
        // fall back to global listeners which we attach below in an
        // effect that watches `dragging`.
      }
      e.preventDefault();
    },
    [payload],
  );

  // Global pointer move/up handlers — attached only while a drag is in
  // flight so we don't leak listeners between gestures.
  useEffect(() => {
    if (!dragging) return;
    const start = startPosRef.current;
    const handleMove = (ev: PointerEvent) => {
      if (
        pointerIdRef.current !== null &&
        ev.pointerId !== pointerIdRef.current
      ) {
        return;
      }
      const dx = ev.clientX - (offsetRef.current.dx ?? 0);
      const dy = ev.clientY - (offsetRef.current.dy ?? 0);
      // Mark moved if the pointer drifts more than a small threshold.
      if (start) {
        const totalDx = Math.abs(ev.clientX - start.x);
        const totalDy = Math.abs(ev.clientY - start.y);
        if (totalDx > 4 || totalDy > 4) movedRef.current = true;
      }
      const next: PointerDragState<T> = {
        ...dragging,
        x: dx,
        y: dy,
      };
      draggingRef.current = next;
      setDragging(next);
      ev.preventDefault();
    };
    const handleUp = (ev: PointerEvent) => {
      if (
        pointerIdRef.current !== null &&
        ev.pointerId !== pointerIdRef.current
      ) {
        return;
      }
      const cur = draggingRef.current;
      // Find the element under the pointer (excluding the ghost).
      const targetEl = document.elementFromPoint(ev.clientX, ev.clientY);
      if (movedRef.current && cur) {
        onDrop(cur.payload, targetEl, ev.clientX, ev.clientY);
      } else if (!movedRef.current && onTap && cur) {
        onTap(cur.payload);
      }
      pointerIdRef.current = null;
      draggingRef.current = null;
      setDragging(null);
    };
    const handleCancel = () => {
      pointerIdRef.current = null;
      draggingRef.current = null;
      setDragging(null);
    };
    window.addEventListener("pointermove", handleMove, { passive: false });
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleCancel);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleCancel);
    };
  }, [dragging, onDrop, onTap]);

  return { handlers: { onPointerDown }, dragging };
}

/**
 * Walk up from `el` looking for the nearest ancestor that has the given
 * `data-drop` attribute. Returns the matching element or null.
 */
export function findDropTarget(
  el: Element | null,
  attr = "data-drop",
): HTMLElement | null {
  let cur: Element | null = el;
  while (cur) {
    if (cur instanceof HTMLElement && cur.hasAttribute(attr)) return cur;
    cur = cur.parentElement;
  }
  return null;
}
