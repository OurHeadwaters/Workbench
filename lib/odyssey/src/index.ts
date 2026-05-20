export type { TrailSign, ZoneId, CostTier, SponsorIntakePayload } from "./types";
export { SEED_TRAIL_SIGNS } from "./seeds";

import type { TrailSign, ZoneId } from "./types";
import { SEED_TRAIL_SIGNS } from "./seeds";

/**
 * filterTrailSigns — synchronous filter over a known array of TrailSign objects.
 *
 * Matching rules (OR logic — any overlap qualifies):
 *   1. The trail sign's zoneTags includes "any" OR includes the given zone.
 *   2. At least one of the given tags appears in the trail sign's topicTags
 *      (or no tags are provided, in which case zone match alone is enough).
 *
 * @param zone    - The user's current zone ("Z1" | "Z2" | "Z3" | "Z4")
 * @param tags    - Optional topic tags from the current context
 * @param source  - Array of TrailSign objects to filter
 */
export function filterTrailSigns(
  zone: ZoneId,
  tags: string[] = [],
  source: TrailSign[],
): TrailSign[] {
  return source.filter((sign) => {
    const zoneMatch =
      sign.zoneTags.includes("any") || sign.zoneTags.includes(zone);
    if (!zoneMatch) return false;

    if (tags.length === 0) return true;

    const lowerTags = tags.map((t) => t.toLowerCase());
    const signTags = sign.topicTags.map((t) => t.toLowerCase());
    return lowerTags.some((t) => signTags.includes(t));
  });
}

/**
 * getTrailSigns — synchronous filter over the in-memory seed trail signs.
 * Use this for development, server-side rendering, or as a fallback.
 *
 * @param zone    - The user's current zone ("Z1" | "Z2" | "Z3" | "Z4")
 * @param tags    - Optional topic tags from the current context
 */
export function getTrailSigns(
  zone: ZoneId,
  tags: string[] = [],
): TrailSign[] {
  return filterTrailSigns(zone, tags, SEED_TRAIL_SIGNS);
}

/**
 * fetchTrailSigns — async function that fetches approved trail signs from the
 * Odyssey API and falls back to in-memory seeds if the request fails.
 *
 * @param apiBase - Base URL for the API (e.g. "/api" or "https://example.com/api")
 * @param zone    - The user's current zone ("Z1" | "Z2" | "Z3" | "Z4")
 * @param tags    - Optional topic tags from the current context
 */
export async function fetchTrailSigns(
  apiBase: string,
  zone: ZoneId,
  tags: string[] = [],
): Promise<TrailSign[]> {
  try {
    const params = new URLSearchParams({ zone });
    if (tags.length > 0) params.set("tags", tags.join(","));
    const res = await fetch(`${apiBase}/odyssey/trail-signs?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { signs: TrailSign[] };
    if (Array.isArray(data.signs) && data.signs.length > 0) {
      return data.signs;
    }
    return filterTrailSigns(zone, tags, SEED_TRAIL_SIGNS);
  } catch {
    return filterTrailSigns(zone, tags, SEED_TRAIL_SIGNS);
  }
}

/**
 * parseZoneTags — converts the DB column string "Z1,Z2" into a typed array.
 */
export function parseZoneTags(raw: string): ("any" | ZoneId)[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean) as ("any" | ZoneId)[];
}

/**
 * parseTopicTags — converts the DB column string "planning,triage" into an array.
 */
export function parseTopicTags(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
