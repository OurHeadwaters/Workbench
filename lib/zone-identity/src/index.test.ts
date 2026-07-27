import { describe, it, expect } from "vitest";
import { createHouseholdSeed, deriveZ2Npub, MIN_NONZERO_BYTES, DeriveZ2NpubOptions } from "./index.js";

// Ensure the options type is exported (compile-time check only)
type _OptionsCheck = DeriveZ2NpubOptions;

describe("createHouseholdSeed", () => {
  it("returns a Uint8Array of exactly 32 bytes", () => {
    const seed = createHouseholdSeed();
    expect(seed).toBeInstanceOf(Uint8Array);
    expect(seed.length).toBe(32);
  });

  it("produces a seed that deriveZ2Npub accepts without throwing", () => {
    const seed = createHouseholdSeed();
    expect(() => deriveZ2Npub(seed)).not.toThrow();
  });

  it("produces a valid bech32 npub when passed to deriveZ2Npub", () => {
    const npub = deriveZ2Npub(createHouseholdSeed());
    expect(npub).toMatch(/^npub1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]+$/);
  });

  it("returns different seeds on successive calls (randomness)", () => {
    const a = createHouseholdSeed();
    const b = createHouseholdSeed();
    // Two independent 256-bit random draws colliding is astronomically unlikely
    expect(Buffer.from(a).toString("hex")).not.toBe(
      Buffer.from(b).toString("hex")
    );
  });
});

describe("deriveZ2Npub", () => {
  const seedA = new Uint8Array(32).fill(0xaa);
  const seedB = new Uint8Array(32).fill(0xbb);

  it("returns the same npub for the same seed (deterministic)", () => {
    const first = deriveZ2Npub(seedA);
    const second = deriveZ2Npub(seedA);
    expect(first).toBe(second);
  });

  it("returns different npubs for different seeds", () => {
    const npubA = deriveZ2Npub(seedA);
    const npubB = deriveZ2Npub(seedB);
    expect(npubA).not.toBe(npubB);
  });

  it("throws for a zero-length seed", () => {
    expect(() => deriveZ2Npub(new Uint8Array(0))).toThrow(
      /zero-length seed/
    );
  });

  it("throws for an all-zeros seed (zero entropy)", () => {
    expect(() => deriveZ2Npub(new Uint8Array(32))).toThrow(
      /all zeros/
    );
  });

  it("throws for a single-byte all-zeros seed", () => {
    expect(() => deriveZ2Npub(new Uint8Array(1))).toThrow(
      /all zeros/
    );
  });

  it("output is a valid bech32 npub string", () => {
    const npub = deriveZ2Npub(seedA);
    expect(npub).toMatch(/^npub1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]+$/);
  });

  it("single-byte seeds are accepted and produce distinct outputs", () => {
    const seed1 = new Uint8Array([0x01]);
    const seed2 = new Uint8Array([0x02]);
    expect(() => deriveZ2Npub(seed1)).not.toThrow();
    expect(deriveZ2Npub(seed1)).not.toBe(deriveZ2Npub(seed2));
  });

  describe("low Hamming-weight seed rejection", () => {
    it("throws for a 32-byte seed with only 1 non-zero byte (1-bit spread)", () => {
      const sparse = new Uint8Array(32);
      sparse[0] = 0x01;
      expect(() => deriveZ2Npub(sparse)).toThrow(/too few non-zero bytes/);
    });

    it("throws for a 32-byte seed with 2 non-zero bytes", () => {
      const sparse = new Uint8Array(32);
      sparse[0] = 0x01;
      sparse[15] = 0x02;
      expect(() => deriveZ2Npub(sparse)).toThrow(/too few non-zero bytes/);
    });

    it("throws for a 32-byte seed with 3 non-zero bytes (one below MIN_NONZERO_BYTES)", () => {
      const sparse = new Uint8Array(32);
      sparse[0] = 0x01;
      sparse[10] = 0x02;
      sparse[20] = 0x03;
      expect(() => deriveZ2Npub(sparse)).toThrow(/too few non-zero bytes/);
    });

    it("accepts a 32-byte seed with exactly MIN_NONZERO_BYTES non-zero bytes", () => {
      const seed = new Uint8Array(32);
      for (let i = 0; i < MIN_NONZERO_BYTES; i++) seed[i * 4] = 0xab;
      expect(() => deriveZ2Npub(seed)).not.toThrow();
    });

    it("short seeds below MIN_NONZERO_BYTES length are exempt from the Hamming-weight check", () => {
      const short = new Uint8Array([0x01, 0x00, 0x00]);
      expect(() => deriveZ2Npub(short)).not.toThrow();
    });

    it("error message includes actual vs required non-zero byte counts", () => {
      const sparse = new Uint8Array(32);
      sparse[7] = 0xff;
      expect(() => deriveZ2Npub(sparse)).toThrow(/1 of 32/);
    });
  });

  describe("custom minNonZeroBytes threshold", () => {
    it("accepts a seed that would fail the default check when a lower threshold is supplied", () => {
      // 32-byte seed with 2 non-zero bytes — rejected by default (needs 4),
      // but accepted when caller passes minNonZeroBytes: 2.
      const sparse = new Uint8Array(32);
      sparse[0] = 0x01;
      sparse[15] = 0x02;
      expect(() =>
        deriveZ2Npub(sparse, { minNonZeroBytes: 2 })
      ).not.toThrow();
    });

    it("rejects a seed that would pass the default check when a higher threshold is supplied", () => {
      // 32-byte seed with exactly MIN_NONZERO_BYTES (4) non-zero bytes —
      // accepted by default, but rejected when caller requires 8.
      const seed = new Uint8Array(32);
      for (let i = 0; i < MIN_NONZERO_BYTES; i++) seed[i * 4] = 0xab;
      expect(() =>
        deriveZ2Npub(seed, { minNonZeroBytes: 8 })
      ).toThrow(/too few non-zero bytes/);
    });

    it("error message reflects the custom threshold, not MIN_NONZERO_BYTES", () => {
      const sparse = new Uint8Array(32);
      sparse[0] = 0x01;
      // Only 1 non-zero byte; require 10 via options.
      expect(() =>
        deriveZ2Npub(sparse, { minNonZeroBytes: 10 })
      ).toThrow(/10 non-zero bytes/);
    });

    it("produces the same npub regardless of threshold (threshold only gates entry)", () => {
      const seed = new Uint8Array(32).fill(0xcc);
      const npubDefault = deriveZ2Npub(seed);
      const npubCustom = deriveZ2Npub(seed, { minNonZeroBytes: 8 });
      expect(npubDefault).toBe(npubCustom);
    });

    it("omitting options is identical to passing an empty options object", () => {
      const npubNoOptions = deriveZ2Npub(seedA);
      const npubEmptyOptions = deriveZ2Npub(seedA, {});
      expect(npubNoOptions).toBe(npubEmptyOptions);
    });

    it("short seeds remain exempt from the check even when a high threshold is set", () => {
      // seed length (3) < custom threshold (10), so Hamming-weight check is skipped.
      const short = new Uint8Array([0x01, 0x00, 0x00]);
      expect(() =>
        deriveZ2Npub(short, { minNonZeroBytes: 10 })
      ).not.toThrow();
    });
  });
});
