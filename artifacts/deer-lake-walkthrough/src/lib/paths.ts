/**
 * Route paths for the walkthrough artifact. Both the read-only walkthrough
 * (the council-facing scroll) and the planner (the contractor-facing
 * decision tool) live in the same artifact at different sub-paths so they
 * share runtime, palette, and brand. BASE_URL is `/deer-lake-walkthrough/`
 * in both dev and prod (Vite injects it from artifact.toml's previewPath).
 */
const BASE = import.meta.env.BASE_URL;

function joinBase(suffix: string): string {
  if (BASE.endsWith("/") && suffix.startsWith("/")) {
    return BASE + suffix.slice(1);
  }
  if (!BASE.endsWith("/") && !suffix.startsWith("/")) {
    return BASE + "/" + suffix;
  }
  return BASE + suffix;
}

export const ROUTES = {
  walkthrough: BASE,
  planner: joinBase("planner"),
  cockpit: joinBase("cockpit"),
  cockpitFloor: joinBase("cockpit/floor"),
  cockpitHome: joinBase("cockpit/home"),
  cockpitTill: joinBase("cockpit/till"),
  cockpitLocks: joinBase("cockpit/locks"),
} as const;

export type CockpitScreen = "pitch" | "floor" | "home" | "till" | "locks";

/** Strip trailing slash so /planner and /planner/ both match. */
function normalize(p: string): string {
  if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
  return p;
}

export function isPlannerPath(pathname: string): boolean {
  return normalize(pathname) === normalize(ROUTES.planner);
}

/**
 * Cockpit lives at /cockpit and four sub-paths. Anything under /cockpit
 * (with or without trailing slash) renders the cockpit shell; the
 * remaining segment picks which of the four screens to show.
 */
export function isCockpitPath(pathname: string): boolean {
  const norm = normalize(pathname);
  const base = normalize(ROUTES.cockpit);
  return norm === base || norm.startsWith(base + "/");
}

export function getCockpitScreen(pathname: string): CockpitScreen {
  const norm = normalize(pathname);
  if (norm === normalize(ROUTES.cockpitHome)) return "home";
  if (norm === normalize(ROUTES.cockpitTill)) return "till";
  if (norm === normalize(ROUTES.cockpitLocks)) return "locks";
  if (norm === normalize(ROUTES.cockpitFloor)) return "floor";
  return "pitch";
}
