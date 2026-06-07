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
