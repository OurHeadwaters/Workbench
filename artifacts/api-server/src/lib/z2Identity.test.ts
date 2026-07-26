/**
 * z2Identity — unit tests
 *
 * Verifies that initZ2Identity() correctly populates (or leaves null) the
 * cached Z2 npub depending on whether Z2_HOUSEHOLD_SEED is present.
 *
 * Each test resets the module registry so the module-level _cachedNpub
 * starts fresh rather than leaking state between scenarios.
 *
 * @workspace/zone-identity is mocked with a deterministic fake that honours
 * the same error semantics (zero-length / all-zero seed → throw) so the
 * initZ2Identity() degraded-mode branches are exercised correctly.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ─── mocks (hoisted — reapplied after every vi.resetModules()) ─────────────

vi.mock("./logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

const BECH32_CHARS = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

vi.mock("@workspace/zone-identity", () => ({
  deriveZ2Npub(seed: Uint8Array): string {
    if (seed.length === 0) {
      throw new Error("zero-length seed");
    }
    if (seed.every((b: number) => b === 0)) {
      throw new Error("all zeros");
    }
    const suffix = Array.from(seed.slice(0, 10))
      .map((b) => BECH32_CHARS[b % 32])
      .join("");
    const padded = suffix + "q".repeat(52 - suffix.length);
    return `npub1${padded}`;
  },
}));

// ─── tests ────────────────────────────────────────────────────────────────────

const VALID_SEED_HEX = "aa".repeat(32);

describe("z2Identity", () => {
  let originalSeed: string | undefined;

  beforeEach(() => {
    originalSeed = process.env.Z2_HOUSEHOLD_SEED;
    vi.resetModules();
  });

  afterEach(() => {
    if (originalSeed === undefined) {
      delete process.env.Z2_HOUSEHOLD_SEED;
    } else {
      process.env.Z2_HOUSEHOLD_SEED = originalSeed;
    }
  });

  it("getZ2Npub returns a valid npub1… string after initZ2Identity when seed is set", async () => {
    process.env.Z2_HOUSEHOLD_SEED = VALID_SEED_HEX;
    const { initZ2Identity, getZ2Npub } = await import("./z2Identity.js");

    initZ2Identity();

    const npub = getZ2Npub();
    expect(npub).not.toBeNull();
    expect(npub).toMatch(/^npub1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]+$/);
  });

  it("getZ2Npub is deterministic — same seed always yields the same npub", async () => {
    process.env.Z2_HOUSEHOLD_SEED = VALID_SEED_HEX;
    const { initZ2Identity, getZ2Npub } = await import("./z2Identity.js");
    initZ2Identity();
    const npub1 = getZ2Npub();

    vi.resetModules();
    process.env.Z2_HOUSEHOLD_SEED = VALID_SEED_HEX;
    const { initZ2Identity: init2, getZ2Npub: get2 } = await import("./z2Identity.js");
    init2();
    const npub2 = get2();

    expect(npub1).toBe(npub2);
  });

  it("getZ2Npub returns null when Z2_HOUSEHOLD_SEED is absent", async () => {
    delete process.env.Z2_HOUSEHOLD_SEED;
    const { initZ2Identity, getZ2Npub } = await import("./z2Identity.js");

    initZ2Identity();

    expect(getZ2Npub()).toBeNull();
  });

  it("getZ2Npub returns null when Z2_HOUSEHOLD_SEED is too short (< 16 decoded bytes)", async () => {
    process.env.Z2_HOUSEHOLD_SEED = "aabb";
    const { initZ2Identity, getZ2Npub } = await import("./z2Identity.js");

    initZ2Identity();

    expect(getZ2Npub()).toBeNull();
  });

  it("getZ2Npub returns null before initZ2Identity is ever called", async () => {
    process.env.Z2_HOUSEHOLD_SEED = VALID_SEED_HEX;
    const { getZ2Npub } = await import("./z2Identity.js");

    expect(getZ2Npub()).toBeNull();
  });

  it("different seeds produce different npubs", async () => {
    process.env.Z2_HOUSEHOLD_SEED = VALID_SEED_HEX;
    const { initZ2Identity, getZ2Npub } = await import("./z2Identity.js");
    initZ2Identity();
    const npubA = getZ2Npub();

    vi.resetModules();
    process.env.Z2_HOUSEHOLD_SEED = "bb".repeat(32);
    const { initZ2Identity: init2, getZ2Npub: get2 } = await import("./z2Identity.js");
    init2();
    const npubB = get2();

    expect(npubA).not.toBe(npubB);
  });
});
