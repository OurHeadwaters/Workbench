// @vitest-environment jsdom
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";
import { flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import { createElement, type ComponentType } from "react";

/**
 * Deck blanking-bug guard — stripped cost-registry pass.
 *
 * Companion to `slidesDefaultRender.test.ts`. Mocks
 * `@/lib/budgetMath.getLiveCostValue` so it returns null for every id,
 * simulating the historic failure shape that took two sibling decks
 * blank: a slide bound a derived cost id that the registry no longer
 * derives. Then mounts every slide into a real JSDOM container and
 * asserts:
 *
 *   1. No slide throws during mount — every slide that depends on a
 *      live derivation must use the null-tolerant `liveDerived`
 *      pattern (return NaN / null and let the formatter render "TBD"),
 *      not the throwing helper that previously blanked the iframe.
 *   2. At least one slide actually surfaces "TBD" in the rendered
 *      output — proves the mock took effect end-to-end and that the
 *      degradation path is wired up, not just compiled away.
 *
 * If a future slide reintroduces the throwing pattern, test #1 fails
 * loudly with the slide title in the assertion message.
 */

vi.mock("@/lib/budgetMath", async () => {
  const actual = await vi.importActual<typeof import("@/lib/budgetMath")>(
    "@/lib/budgetMath",
  );
  return {
    ...actual,
    getLiveCostValue: () => null,
    useLiveCostValue: () => null,
  };
});

const MIN_VISIBLE_TEXT_CHARS = 80;

let container: HTMLDivElement;
let root: Root;
let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  // The null-tolerant `liveDerived` helpers in PathToScale /
  // ThreeRevenueLayers / FirstReserveThenTheNext deliberately log to
  // console.error in DEV when a derivation is missing. That noise is
  // the *expected* behaviour under this stripped pass — silence it so
  // the test output stays readable.
  consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => undefined);
});

afterEach(() => {
  flushSync(() => {
    root.unmount();
  });
  container.remove();
  consoleErrorSpy.mockRestore();
});

function mountSlide(Component: ComponentType): string {
  flushSync(() => {
    root.render(createElement(Component));
  });
  return (container.textContent ?? "").replace(/\s+/g, " ").trim();
}

describe("Practitioner Operating Plan — stripped registry degrades to TBD, never throws", () => {
  it("manifest loads with the registry mock applied", async () => {
    const { slides } = await import("@/slideLoader");
    expect(slides.length).toBeGreaterThan(0);
  });

  it("every slide mounts without throwing when getLiveCostValue returns null", async () => {
    const { slides } = await import("@/slideLoader");
    for (const slide of slides) {
      let text = "";
      expect(
        () => {
          text = mountSlide(slide.Component);
        },
        `slide ${slide.position} ("${slide.title}") threw when its cost-registry ` +
          `derivations were stripped — this is exactly the blank-deck failure ` +
          `mode task #338 exists to catch. Use the null-tolerant liveDerived ` +
          `pattern instead of the throwing helper.`,
      ).not.toThrow();

      expect(
        text.length,
        `slide ${slide.position} ("${slide.title}") rendered empty under the ` +
          `stripped registry — even degraded, every slide must show some text.`,
      ).toBeGreaterThanOrEqual(MIN_VISIBLE_TEXT_CHARS);

      // Tear down between slides so the next iteration mounts into a
      // clean container.
      flushSync(() => {
        root.unmount();
      });
      container.remove();
      container = document.createElement("div");
      document.body.appendChild(container);
      root = createRoot(container);
    }
  });

  it("at least one derivation-bound slide surfaces 'TBD' as the fallback", async () => {
    const { slides } = await import("@/slideLoader");
    const slidesShowingTbd: string[] = [];
    for (const slide of slides) {
      const text = mountSlide(slide.Component);
      if (text.includes("TBD")) {
        slidesShowingTbd.push(`${slide.position} (${slide.title})`);
      }
      flushSync(() => {
        root.unmount();
      });
      container.remove();
      container = document.createElement("div");
      document.body.appendChild(container);
      root = createRoot(container);
    }

    expect(
      slidesShowingTbd.length,
      `No slide rendered "TBD" under the stripped registry. Either the mock ` +
        `did not take effect, or no slide is wired to surface a degraded ` +
        `placeholder when getLiveCostValue returns null. PathToScale and ` +
        `ThreeRevenueLayers should both render "TBD" cells in this state.`,
    ).toBeGreaterThan(0);
  });
});
