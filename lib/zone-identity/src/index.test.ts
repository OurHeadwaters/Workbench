import { describe, it, expect } from "vitest";
import { deriveZ2Npub } from "./index.js";

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
});
