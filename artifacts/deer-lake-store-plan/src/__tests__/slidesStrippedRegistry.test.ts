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
 * Companion to `slidesDefaultRender.test.ts`. The only Deer Lake slide
 * bound to live cost-registry derivations is `FirstReserveThenTheNext`,
 * which reads `getLiveCostValue` from the cross-package
 * `@workspace/practitioner-operating-plan/budgetMath` export. We mock
 * that export so `getLiveCostValue` returns null for every id,
 * reproducing the historic failure shape (a slide bound to an id the
 * registry no longer derives), and assert:
 *
 *   1. No slide throws during mount — `FirstReserveThenTheNext` must
 *      use the null-tolerant `liveDerived` pattern, not the throwing
 *      helper that previously blanked the deck.
 *   2. At least one slide actually surfaces "TBD" in the rendered
 *      output — proves the mock reached the slide module and the
 *      degradation path is wired up end-to-end.
 *
 * If a future slide reintroduces the throwing pattern, test #1 fails
 * loudly with the slide title in the assertion message.
 */

vi.mock("@workspace/practitioner-operating-plan/budgetMath", async () => {
  const actual = await vi.importActual<
    typeof import("@workspace/practitioner-operating-plan/budgetMath")
  >("@workspace/practitioner-operating-plan/budgetMath");
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

  // FirstReserveThenTheNext's null-tolerant `liveDerived` helper
  // deliberately logs to console.error in DEV when a derivation is
  // missing. That noise is the *expected* behaviour under this
  // stripped pass — silence it so the test output stays readable.
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

describe("Deer Lake Store Plan — stripped registry degrades to TBD, never throws", () => {
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
        `placeholder when getLiveCostValue returns null. ` +
        `FirstReserveThenTheNext should render "TBD" in this state.`,
    ).toBeGreaterThan(0);
  });
});
