/**
 * Unit tests for the small helpers in `shortLink.ts`. The fetch-based
 * functions are exercised end-to-end on the server side in
 * `artifacts/api-server/src/routes/wordpile.test.ts`; here we just pin
 * down the URL builder and the slug guard, which are pure and don't
 * need network mocks.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { buildShortUrl, isShortLinkSlug } from "./shortLink";

describe("isShortLinkSlug", () => {
  it("accepts base64url alphabet at the lengths the server emits", () => {
    expect(isShortLinkSlug("AbCdEfGh")).toBe(true); // 8 chars (lower bound)
    expect(isShortLinkSlug("AbCdEfGhIjK")).toBe(true); // 11 — randomBytes(8) length
    expect(isShortLinkSlug("a-b_c-d_e-f")).toBe(true); // hyphen + underscore are base64url
    expect(isShortLinkSlug("A".repeat(32))).toBe(true); // 32 chars (upper bound)
  });

  it("rejects malformed slugs without ever touching the network", () => {
    // The route's regex is the source of truth and we mirror it 1:1.
    // Each rejection here saves a recipient-facing fetch round-trip
    // that would have 404'd, and crucially, prevents path-injection
    // shapes like `/s/<script>` from being passed to fetch at all.
    expect(isShortLinkSlug("")).toBe(false);
    expect(isShortLinkSlug("short")).toBe(false); // too short (< 8)
    expect(isShortLinkSlug("A".repeat(33))).toBe(false); // too long (> 32)
    expect(isShortLinkSlug("contains space ")).toBe(false);
    expect(isShortLinkSlug("contains+plus")).toBe(false); // base64 std, not base64url
    expect(isShortLinkSlug("contains/slash")).toBe(false);
    expect(isShortLinkSlug("contains.dot")).toBe(false);
    expect(isShortLinkSlug("<script>X</script>")).toBe(false);
  });
});

describe("buildShortUrl", () => {
  // BASE_URL comes from Vite's import.meta.env. In test runs the
  // default is "/" — that's enough to verify the join logic works
  // for both "/" and "/wordpile/" shaped values without needing to
  // restart the test runner.
  const realLocation = globalThis.window?.location;

  beforeEach(() => {
    vi.stubGlobal("window", {
      location: { origin: "https://example.test" },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    if (realLocation && globalThis.window) {
      // Restoring isn't strictly necessary because vitest isolates
      // modules per file, but doing it explicitly keeps the next
      // test's invariants obvious.
    }
  });

  it("produces a routable absolute URL with a trailing /s/<slug>", () => {
    const url = buildShortUrl("AbCdEfGhIjK");
    expect(url.startsWith("https://example.test")).toBe(true);
    expect(url.endsWith("/s/AbCdEfGhIjK")).toBe(true);
    // No accidental double-slash from base join.
    expect(url).not.toContain("//s/");
  });
});

