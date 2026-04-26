import * as React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Router } from "wouter";

import Today from "../Today";

void React;

// Static SSR-friendly location hook for wouter. Wouter's built-in
// memoryLocation uses `useSyncExternalStore` without a server snapshot
// and breaks in `renderToStaticMarkup`; a tuple-returning constant
// hook satisfies the BaseLocationHook contract for static rendering.
const staticHook = (): [string, (to: string) => void] => ["/today", () => {}];

function render() {
  return renderToStaticMarkup(
    <Router hook={staticHook as never}>
      <Today />
    </Router>,
  );
}

describe("/today layout switch", () => {
  it("mounts both mobile (Now view) and desktop wrappers in the same render", () => {
    // Both must mount on first paint; visibility is gated purely by
    // Tailwind responsive classes so first paint never flashes the
    // wrong layout regardless of JS readiness.
    const html = render();
    expect(html).toContain('data-testid="today-mobile"');
    expect(html).toContain('data-testid="today-desktop"');
  });

  it("hides the mobile wrapper at >=md (md:hidden) and the desktop wrapper at <md (hidden md:block)", () => {
    const html = render();
    expect(html).toMatch(
      /class="md:hidden"[^>]*data-testid="today-mobile"/,
    );
    expect(html).toMatch(
      /class="hidden[^"]*md:block"[^>]*data-testid="today-desktop"/,
    );
  });

  it("renders the Now view inside the mobile wrapper", () => {
    const html = render();
    // Slice between the mobile wrapper opening tag and the desktop
    // wrapper opening tag to assert NowView lives in the mobile half.
    const mobileStart = html.indexOf('data-testid="today-mobile"');
    const desktopStart = html.indexOf('data-testid="today-desktop"');
    expect(mobileStart).toBeGreaterThan(-1);
    expect(desktopStart).toBeGreaterThan(mobileStart);
    const mobileSlice = html.slice(mobileStart, desktopStart);
    expect(mobileSlice).toContain('data-testid="now-view"');
    expect(mobileSlice).toContain('data-testid="focal-card"');
    expect(mobileSlice).toContain('data-testid="now-chrome-toggle"');
  });

  it("renders the existing desktop chrome inside the desktop wrapper", () => {
    const html = render();
    const desktopStart = html.indexOf('data-testid="today-desktop"');
    const desktopSlice = html.slice(desktopStart);
    // The original desktop layout's heading anchors are stable: the
    // long-form date header and the carry-over/Three Things sections.
    expect(desktopSlice).toContain("Cost review");
    expect(desktopSlice).toMatch(/Week \d+ of 52/);
  });

  it("renders the chrome chevron closed by default on mobile", () => {
    // Closed chevron means the panel is not in the DOM.
    const html = render();
    expect(html).toContain('data-testid="now-chrome-toggle"');
    expect(html).not.toContain('data-testid="now-chrome-panel"');
  });
});
