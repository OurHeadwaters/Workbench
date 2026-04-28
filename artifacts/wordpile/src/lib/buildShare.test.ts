import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildClipboardItems,
  buildShareCaption,
  type ShareInput,
} from "./buildShare";

function makeInput(overrides: Partial<ShareInput> = {}): ShareInput {
  return {
    pileName: "Coalition pile",
    frame: [null, null, null, null, null],
    trim: [],
    standing: false,
    ...overrides,
  };
}

describe("buildShareCaption", () => {
  it("highlights load-bearing words when at least one is in the frame", () => {
    const caption = buildShareCaption(
      makeInput({
        pileName: "Pile X",
        frame: [
          { word: "ceremony", bucket: "load" },
          { word: "elders", bucket: "load" },
          { word: "land", bucket: "load" },
          null,
          null,
        ],
        trim: [{ word: "fire", bucket: "interior" }],
        standing: true,
      }),
    );
    expect(caption).toBe(
      "Built from Pile X — 3 load-bearing words holding it up: ceremony, elders, land.",
    );
  });

  it("uses singular wording for a lone load-bearing timber", () => {
    const caption = buildShareCaption(
      makeInput({
        pileName: "Tiny pile",
        frame: [
          { word: "kinship", bucket: "load" },
          null,
          null,
          null,
          null,
        ],
      }),
    );
    expect(caption).toBe(
      "Built from Tiny pile — 1 load-bearing word holding it up: kinship.",
    );
  });

  it("falls back to a working-build message when nothing is placed", () => {
    expect(buildShareCaption(makeInput({ pileName: "Pile Y" }))).toBe(
      "Working build from Pile Y.",
    );
  });

  it("counts pieces when only trim/interior is placed", () => {
    const caption = buildShareCaption(
      makeInput({
        pileName: "Mixed pile",
        trim: [
          { word: "fire", bucket: "interior" },
          { word: "song", bucket: "interior" },
        ],
      }),
    );
    expect(caption).toBe(
      "Working build from Mixed pile — 2 pieces placed so far.",
    );
  });

  it("ignores non-load entries and skips empty word strings", () => {
    const caption = buildShareCaption(
      makeInput({
        pileName: "  ",
        frame: [
          { word: "  ", bucket: "load" },
          { word: "stewardship", bucket: "load" },
          { word: "trauma", bucket: "avoid" },
          null,
          null,
        ],
        trim: [{ word: "song", bucket: "interior" }],
      }),
    );
    expect(caption).toBe(
      "Built from Wordpile — 1 load-bearing word holding it up: stewardship.",
    );
  });
});

describe("buildClipboardItems", () => {
  // Capture the constructor args so we can assert what gets handed to the
  // clipboard. The real ClipboardItem isn't available in node-vitest, so
  // we stub a minimal stand-in that records its parts.
  let recordedParts: Array<Record<string, Blob>> = [];

  beforeEach(() => {
    recordedParts = [];
    class FakeClipboardItem {
      types: string[];
      _parts: Record<string, Blob>;
      constructor(parts: Record<string, Blob>) {
        recordedParts.push(parts);
        this._parts = parts;
        this.types = Object.keys(parts);
      }
    }
    vi.stubGlobal("ClipboardItem", FakeClipboardItem);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a multi-MIME payload first, with image-only as the fallback", () => {
    const image = new Blob(["png-bytes"], { type: "image/png" });
    const items = buildClipboardItems(image, "Built from Pile X — 3 load-bearing words.");

    expect(items).toHaveLength(2);
    // 1) Multi-MIME: image + caption text/plain
    expect(Object.keys(recordedParts[0]).sort()).toEqual([
      "image/png",
      "text/plain",
    ]);
    expect(recordedParts[0]["image/png"]).toBe(image);
    const captionBlob = recordedParts[0]["text/plain"];
    expect(captionBlob.type).toBe("text/plain");
    // 2) Image-only fallback for browsers that reject multi-MIME
    expect(Object.keys(recordedParts[1])).toEqual(["image/png"]);
    expect(recordedParts[1]["image/png"]).toBe(image);
  });

  it("includes the caption text verbatim in the text/plain blob", async () => {
    const image = new Blob(["png-bytes"], { type: "image/png" });
    const caption = "Built from Pile X — 3 load-bearing words holding it up: ceremony, elders, land.";
    buildClipboardItems(image, caption);
    const textBlob = recordedParts[0]["text/plain"];
    await expect(textBlob.text()).resolves.toBe(caption);
  });

  it("skips the multi-MIME variant when the caption is empty", () => {
    const image = new Blob(["png-bytes"], { type: "image/png" });
    const items = buildClipboardItems(image, "   ");
    expect(items).toHaveLength(1);
    expect(Object.keys(recordedParts[0])).toEqual(["image/png"]);
  });
});
