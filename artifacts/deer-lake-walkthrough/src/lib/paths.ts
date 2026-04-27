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
} as const;

/** Strip trailing slash so /planner and /planner/ both match. */
function normalize(p: string): string {
  if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
  return p;
}

export function isPlannerPath(pathname: string): boolean {
  return normalize(pathname) === normalize(ROUTES.planner);
}
