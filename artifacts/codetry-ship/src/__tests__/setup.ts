import "@testing-library/jest-dom";

/*
 * jsdom does not implement the Clipboard API.
 * Install a plain stub so navigator.clipboard.writeText is accessible.
 * Individual tests use vi.spyOn(navigator.clipboard, 'writeText') to assert on it.
 */
Object.defineProperty(navigator, "clipboard", {
  configurable: true,
  value: {
    writeText: () => Promise.resolve(undefined),
    readText: () => Promise.resolve(""),
  },
});

/*
 * jsdom does not implement window.matchMedia.
 * Install a stub that returns a minimal MediaQueryList object so components
 * that call matchMedia (e.g. responsive-layout hooks) don't throw.
 */
Object.defineProperty(window, "matchMedia", {
  configurable: true,
  writable: true,
  value: (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

/*
 * jsdom does not implement IntersectionObserver.
 * Install a no-op stub so components that use intersection-based scroll
 * animations or lazy-loading don't throw during tests.
 */
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, "IntersectionObserver", {
  configurable: true,
  writable: true,
  value: IntersectionObserverStub,
});
