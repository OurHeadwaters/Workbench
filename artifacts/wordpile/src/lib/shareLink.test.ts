import { describe, expect, it } from "vitest";
import type { PileExport } from "@/data/types";
import {
  decodePileShare,
  encodePileShare,
  readShareFragment,
  SHARE_FRAGMENT_KEY,
} from "./shareLink";

function samplePile(overrides: Partial<PileExport["pile"]> = {}): PileExport {
  return {
    format: "wordpile-export",
    formatVersion: 1,
    exportedAt: 1700000000000,
    pile: {
      name: "Deer Lake",
      words: [
        {
          word: "stewardship",
          bucket: "load",
          note: "carries the meaning",
          saferAlternative: "",
        },
        {
          word: "synergy",
          bucket: "avoid",
          note: "",
          saferAlternative: "working together",
        },
      ],
      ...overrides,
    },
  };
}

describe("shareLink — round-trip", () => {
  it("encodes and decodes a pile export back to the same payload", async () => {
    const payload = samplePile();
    const enc = await encodePileShare(payload);
    expect(enc.ok).toBe(true);
    if (!enc.ok) return;
    expect(enc.encoded.length).toBeGreaterThan(0);
    // base64url alphabet only — no `+`, `/`, `=`, `#`, or whitespace.
    expect(enc.encoded).toMatch(/^[A-Za-z0-9_-]+$/);

    const dec = await decodePileShare(enc.encoded);
    expect(dec.ok).toBe(true);
    if (!dec.ok) return;
    expect(dec.payload.pile.name).toBe(payload.pile.name);
    expect(dec.payload.pile.words).toEqual(payload.pile.words);
  });

  it("preserves a saved draft when present", async () => {
    const payload = samplePile({
      draft: "Some practitioner notes that should survive.",
    });
    const enc = await encodePileShare(payload);
    expect(enc.ok).toBe(true);
    if (!enc.ok) return;
    const dec = await decodePileShare(enc.encoded);
    expect(dec.ok).toBe(true);
    if (!dec.ok) return;
    expect(dec.payload.pile.draft).toBe(payload.pile.draft);
  });

  it("refuses to encode a payload that exceeds the size budget", async () => {
    // Build a pile big enough that even gzip can't squash it under the cap.
    const words = Array.from({ length: 5000 }, (_, i) => ({
      word: `word-${i}-${Math.random().toString(36).slice(2)}`,
      bucket: "unsorted" as const,
      note: `note ${i} ${Math.random().toString(36).slice(2)}`,
      saferAlternative: "",
    }));
    const enc = await encodePileShare(samplePile({ words }));
    expect(enc.ok).toBe(false);
    if (enc.ok) return;
    expect(enc.reason).toBe("too-large");
  });

  it("refuses garbled input on decode", async () => {
    const dec = await decodePileShare("not-a-real-encoded-payload");
    expect(dec.ok).toBe(false);
    if (dec.ok) return;
    expect(dec.reason).toBe("invalid");
  });

  it("rejects an oversized encoded string up front on decode", async () => {
    const oversized = "a".repeat(40 * 1024);
    const dec = await decodePileShare(oversized);
    expect(dec.ok).toBe(false);
    if (dec.ok) return;
    expect(dec.reason).toBe("too-large");
  });
});

describe("shareLink — fragment parsing", () => {
  it("reads the encoded payload out of a `#data=...` fragment", () => {
    expect(readShareFragment(`#${SHARE_FRAGMENT_KEY}=abc123`)).toBe("abc123");
    expect(readShareFragment(`${SHARE_FRAGMENT_KEY}=abc123`)).toBe("abc123");
  });

  it("returns null for missing or empty fragments", () => {
    expect(readShareFragment("")).toBeNull();
    expect(readShareFragment("#")).toBeNull();
    expect(readShareFragment("#other=value")).toBeNull();
  });

  it("ignores other fragment params", () => {
    const hash = `#foo=bar&${SHARE_FRAGMENT_KEY}=payload-here`;
    expect(readShareFragment(hash)).toBe("payload-here");
  });
});
