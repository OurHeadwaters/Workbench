import type { ElementId } from "@/data/forgeData";

const FACTION_KEY = "hl_faction_affinity";
const LIBRARY_KEY = "hl_blueprint_library";
const PROGRESS_KEY = "hl_forge_progress";

export function getFaction(): ElementId | null {
  return (localStorage.getItem(FACTION_KEY) as ElementId) || null;
}
export function setFaction(id: ElementId) {
  localStorage.setItem(FACTION_KEY, id);
}

export interface BlueprintEntry {
  id: string;
  name: string;
  elementCounts: Record<string, number>;
  connectionCount: number;
  timestamp: number;
  moduleId?: string;
}

export function getLibrary(): BlueprintEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LIBRARY_KEY) || "[]") as BlueprintEntry[];
  } catch {
    return [];
  }
}

export function saveToLibrary(entry: Omit<BlueprintEntry, "id" | "timestamp">) {
  const lib = getLibrary();
  const full: BlueprintEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  lib.unshift(full);
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(lib));
  return full;
}

export function deleteFromLibrary(id: string) {
  const lib = getLibrary().filter((e) => e.id !== id);
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(lib));
}

export interface ForgeProgress {
  completedModules: string[];
  patternsNamed: number;
}

export function getForgeProgress(): ForgeProgress {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{"completedModules":[],"patternsNamed":0}') as ForgeProgress;
  } catch {
    return { completedModules: [], patternsNamed: 0 };
  }
}

export function markModuleComplete(moduleId: string) {
  const p = getForgeProgress();
  if (!p.completedModules.includes(moduleId)) {
    p.completedModules.push(moduleId);
  }
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

export function incrementPatternsNamed() {
  const p = getForgeProgress();
  p.patternsNamed += 1;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}
