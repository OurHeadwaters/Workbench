// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import { createElement, type ComponentType } from "react";

import { slides } from "@/slideLoader";

/**
 * Deck blanking-bug guard — default app state pass.
 *
 * Mirror of `artifacts/practitioner-operating-plan/src/__tests__/
 * slidesDefaultRender.test.ts`. Walks every slide registered in this
 * deck's `slides-manifest.json`, mounts the matching component into a
 * real JSDOM container with default app state, and asserts:
 *   1. The mount does not throw — the historic failure mode that
 *      blanked the entire iframe (task #338).
 *   2. The resulting DOM carries non-trivial visible text — so a
 *      regression that silently renders an empty fragment is also
 *      caught.
 *
 * `createRoot` + `flushSync` is used so each slide actually mounts
 * into a JSDOM container and effects fire — closer to the live render
 * lifecycle than an SSR-only render. Slides that read
 * `window.location` (notably `FirstReserveThenTheNext.tsx`) get a real
 * `window` from JSDOM, and parse the empty querystring to fall back
 * to registry defaults — which is exactly the "default app state" the
 * task docstring calls for.
 *
 * The companion file `slidesStrippedRegistry.test.ts` runs the same
 * walk with the cross-package `getLiveCostValue` mocked to return null
 * for every id, confirming slides degrade to "TBD" placeholders
 * instead of throwing when registry derivations drift away from the
 * slides that read them.
 */

const MIN_VISIBLE_TEXT_CHARS = 80;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  flushSync(() => {
    root.unmount();
  });
  container.remove();
});

function mountSlide(Component: ComponentType): string {
  flushSync(() => {
    root.render(createElement(Component));
  });
  return (container.textContent ?? "").replace(/\s+/g, " ").trim();
}

describe("Deer Lake Store Plan — every slide mounts under JSDOM with default app state", () => {
  it("loads at least one slide from the manifest", () => {
    expect(slides.length).toBeGreaterThan(0);
  });

  for (const slide of slides) {
    it(`slide ${slide.position} — "${slide.title}" mounts and renders non-empty text`, () => {
      let text = "";
      expect(
        () => {
          text = mountSlide(slide.Component);
        },
        `slide ${slide.position} ("${slide.title}") threw during mount — ` +
          `this is the blank-iframe failure mode task #338 exists to catch.`,
      ).not.toThrow();

      expect(
        text.length,
        `slide ${slide.position} ("${slide.title}") rendered no visible text ` +
          `(textContent length: ${text.length}). The whole deck would look ` +
          `blank to a reader on this slide.`,
      ).toBeGreaterThanOrEqual(MIN_VISIBLE_TEXT_CHARS);
    });
  }
});
