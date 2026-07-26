/**
 * z2Identity — Zone 2 Workbench identity for the North Star system.
 *
 * Derives and caches the Z2 npub from the household seed stored in the
 * Z2_HOUSEHOLD_SEED environment variable (hex-encoded, 32+ bytes).
 *
 * ## Eave Rule compliance
 *
 * - The seed is read once at startup and held in a module-level variable.
 * - The npub is derived via HKDF-SHA256 with domain separator
 *   "headwaters:zone:Z2:npub" — a one-way operation; the seed cannot be
 *   recovered from the npub.
 * - The npub is NEVER persisted alongside any Z1 field. It may appear in
 *   Z2-scoped records (e.g., river_briefings.structured_json) and may be
 *   returned to Z2-scoped agent contexts only.
 * - This module intentionally exports no function that exposes the raw seed.
 */

import { deriveZ2Npub } from "@workspace/zone-identity";
import { logger } from "./logger";

let _cachedNpub: string | null = null;

/**
 * Must be called once during server startup, before any route handler runs.
 * Reads Z2_HOUSEHOLD_SEED, derives the Z2 npub, and caches it in memory.
 *
 * If Z2_HOUSEHOLD_SEED is absent or invalid the function logs a warning and
 * leaves the cache empty — the system runs in degraded mode (River Smith
 * briefings are generated but not annotated with a Z2 npub).
 */
export function initZ2Identity(): void {
  const raw = process.env.Z2_HOUSEHOLD_SEED;

  if (!raw) {
    logger.warn(
      "Z2_HOUSEHOLD_SEED is not set — Z2 npub will be unavailable. " +
        "River Smith briefings will not carry a Z2 identity. " +
        "Set Z2_HOUSEHOLD_SEED to a hex-encoded 32-byte secret to enable Z2 identity.",
    );
    return;
  }

  try {
    const seed = Buffer.from(raw.trim(), "hex");
    if (seed.length < 16) {
      throw new Error(
        `Z2_HOUSEHOLD_SEED decoded to only ${seed.length} bytes — minimum 16 bytes required (32+ recommended).`,
      );
    }
    _cachedNpub = deriveZ2Npub(new Uint8Array(seed));
    logger.info(
      { npubPrefix: _cachedNpub.slice(0, 12) + "…" },
      "z2-identity: Z2 npub derived and cached",
    );
  } catch (err) {
    logger.error(
      { err },
      "z2-identity: failed to derive Z2 npub — check Z2_HOUSEHOLD_SEED is valid hex",
    );
  }
}

/**
 * Returns the cached Z2 npub, or null if Z2_HOUSEHOLD_SEED was not set or
 * derivation failed at startup.
 *
 * This is the only way for Z2-scoped code to read the npub.  Never expose
 * this value in contexts that may reach Z1 records.
 */
export function getZ2Npub(): string | null {
  return _cachedNpub;
}
