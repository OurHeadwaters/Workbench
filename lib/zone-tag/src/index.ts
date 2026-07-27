/**
 * @workspace/zone-tag
 *
 * Shared zone-pill components for the Headwaters constellation.
 *
 * ZoneTag  — a rectangular pill showing "Zone N · Label"
 * ZoneDot  — a small filled circle carrying the zone colour
 *
 * Canonical pill colours (bg / fg) live here. Update once and every artifact
 * that imports from this package picks up the change automatically.
 */

export { ZoneTag } from "./ZoneTag";
export type { ZoneTagProps } from "./ZoneTag";

export { ZoneDot } from "./ZoneDot";
export type { ZoneDotProps } from "./ZoneDot";

export { ZONE_COLORS } from "./colors";
export type { ZoneColorEntry } from "./colors";
