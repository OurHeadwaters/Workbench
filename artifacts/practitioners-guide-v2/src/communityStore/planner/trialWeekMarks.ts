import { useState, useCallback, useEffect } from "react";

const KEY = "cswt:v1:weekmarks";

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
  } catch { /* no-op */ }
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

  const isMarked = useCallback((week: number) => marks.has(week), [marks]);

  const toggleMark = useCallback((week: number) => {
    setMarks((prev) => {
      const next = new Set(prev);
      if (next.has(week)) next.delete(week);
      else next.add(week);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => setMarks(new Set()), []);

  return { isMarked, toggleMark, clearAll };
}
