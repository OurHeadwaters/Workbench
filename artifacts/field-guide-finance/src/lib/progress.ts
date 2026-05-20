const STORAGE_KEY = "fgf_visited_lessons";

function getVisited(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveVisited(visited: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(visited)));
  } catch {
    // ignore
  }
}

export function markVisited(lessonId: string): void {
  const visited = getVisited();
  visited.add(lessonId);
  saveVisited(visited);
}

export function isVisited(lessonId: string): boolean {
  return getVisited().has(lessonId);
}

export function getProgress(totalLessons: number): number {
  if (totalLessons === 0) return 0;
  const visited = getVisited();
  return Math.round((visited.size / totalLessons) * 100);
}

export function getVisitedIds(): Set<string> {
  return getVisited();
}
