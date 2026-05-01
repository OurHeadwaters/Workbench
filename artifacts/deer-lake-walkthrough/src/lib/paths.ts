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
  sustainability: joinBase("sustainability"),
  sustainabilityModel: joinBase("sustainability/model"),
  sustainabilityRoles: joinBase("sustainability/roles"),
  sustainabilityHandover: joinBase("sustainability/handover"),
  sustainabilityBurnout: joinBase("sustainability/burnout"),
  sustainabilityRenewal: joinBase("sustainability/renewal"),
  sustainabilityTooling: joinBase("sustainability/tooling"),
  sustainabilityIndicators: joinBase("sustainability/indicators"),
  checkinSheets: joinBase("checkin-sheets"),
  phaseLockSignoff: joinBase("phase-locks-signoff"),
} as const;

export type CockpitScreen = "pitch" | "floor" | "home" | "till" | "locks";

export type SustainabilityPage =
  | "index"
  | "model"
  | "roles"
  | "handover"
  | "burnout"
  | "renewal"
  | "tooling"
  | "indicators";

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

/**
 * Sustainability playbook lives at /sustainability and seven sub-paths.
 * Anything under /sustainability renders the playbook shell; the
 * remaining segment picks which page to show.
 */
export function isSustainabilityPath(pathname: string): boolean {
  const norm = normalize(pathname);
  const base = normalize(ROUTES.sustainability);
  return norm === base || norm.startsWith(base + "/");
}

export function getSustainabilityPage(pathname: string): SustainabilityPage {
  const norm = normalize(pathname);
  if (norm === normalize(ROUTES.sustainabilityModel)) return "model";
  if (norm === normalize(ROUTES.sustainabilityRoles)) return "roles";
  if (norm === normalize(ROUTES.sustainabilityHandover)) return "handover";
  if (norm === normalize(ROUTES.sustainabilityBurnout)) return "burnout";
  if (norm === normalize(ROUTES.sustainabilityRenewal)) return "renewal";
  if (norm === normalize(ROUTES.sustainabilityTooling)) return "tooling";
  if (norm === normalize(ROUTES.sustainabilityIndicators)) return "indicators";
  return "index";
}

/** Check-in sheets printable page lives at /checkin-sheets. */
export function isCheckinSheetsPath(pathname: string): boolean {
  return normalize(pathname) === normalize(ROUTES.checkinSheets);
}

/** Phase-lock sign-off sheet lives at /phase-locks-signoff. */
export function isPhaseLockSignoffPath(pathname: string): boolean {
  return normalize(pathname) === normalize(ROUTES.phaseLockSignoff);
}
