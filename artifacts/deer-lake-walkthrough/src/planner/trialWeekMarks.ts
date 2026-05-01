import { useState, useCallback, useEffect } from "react";

/**
 * localStorage-backed hook for the 8-week trial worksheet marks.
 *
 * Key: `dlwt:v1:weekmarks`
 * Value: JSON array of week numbers (1–8) that have been marked done.
 *
 * Follows the same quiet-tolerance posture as `storage.ts` — any bad or
 * missing data silently resets to empty rather than throwing. Reads once
 * on mount; writes on every toggle.
 */
const KEY = "dlwt:v1:weekmarks";

function loadMarks(): Set<number> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((v) => typeof v === "number"));
  } catch {
    return new Set();
  }
}

function writeMarks(marks: Set<number>): void {
  try {
    localStorage.setItem(KEY, JSON.stringify([...marks]));
  } catch {
    // localStorage unavailable — silently no-op.
  }
}

export function useTrialWeekMarks(): {
  isMarked: (week: number) => boolean;
  toggleMark: (week: number) => void;
  clearAll: () => void;
} {
  const [marks, setMarks] = useState<Set<number>>(() => loadMarks());

  useEffect(() => {
    writeMarks(marks);
  }, [marks]);

  const isMarked = useCallback(
    (week: number) => marks.has(week),
    [marks],
  );

  const toggleMark = useCallback((week: number) => {
    setMarks((prev) => {
      const next = new Set(prev);
      if (next.has(week)) {
        next.delete(week);
      } else {
        next.add(week);
      }
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setMarks(new Set());
  }, []);

  return { isMarked, toggleMark, clearAll };
}
