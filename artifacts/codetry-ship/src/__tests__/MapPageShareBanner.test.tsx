/**
 * MapPageShareBanner.test.tsx
 *
 * Regression tests for the share-link landing banner:
 *   - Banner appears when the page loads with ?zone=3
 *   - Banner text includes "Zone 3 — {zone name from zones.ts}"
 *   - Zone card with id="zone-3" scrolls into view on mount
 *   - Clicking "Got it ✕" dismisses the banner (opacity → 0)
 *   - Banner auto-dismisses after 5 seconds
 *   - Banner is absent when no ?zone param is present
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MapPage } from "@/pages/MapPage";
import { ZONES } from "@/data/zones";

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function setSearch(search: string) {
  Object.defineProperty(window, "location", {
    value: {
      ...window.location,
      search,
      hash: "",
      href: `http://localhost/${search}`,
    },
    writable: true,
    configurable: true,
  });
}

/* ── Mocks ────────────────────────────────────────────────────────────────── */

vi.mock("@/components/WatershedMap", () => ({
  default: () => null,
}));

/* scrollIntoView is not implemented in jsdom — replace with a spy */
const scrollIntoViewMock = vi.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

/* ── Tests ────────────────────────────────────────────────────────────────── */

describe("MapPage — share-link banner (?zone=3)", () => {
  beforeEach(() => {
    setSearch("?zone=3");
    vi.useFakeTimers();
    scrollIntoViewMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    setSearch("");
  });

  it("renders the banner with correct zone text", () => {
    const zone3 = ZONES.find((z) => z.number === 3);
    if (!zone3) throw new Error("Zone 3 not found in zones.ts");
    const escapedName = zone3.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    render(<MapPage />);
    expect(
      screen.getByText(new RegExp(`Zone 3\\s*[—–]\\s*${escapedName}`, "i"))
    ).toBeInTheDocument();
  });

  it("banner is initially visible (opacity 1)", () => {
    render(<MapPage />);
    const banner = screen.getByRole("status");
    expect(banner).toHaveStyle({ opacity: "1" });
  });

  it("zone-3 card is present in the DOM", () => {
    render(<MapPage />);
    expect(document.getElementById("zone-3")).toBeInTheDocument();
  });

  it("scrolls zone-3 card into view after 450 ms", () => {
    render(<MapPage />);

    act(() => {
      vi.advanceTimersByTime(460);
    });

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });

    const callTargets = scrollIntoViewMock.mock.instances as HTMLElement[];
    const zone3Card = document.getElementById("zone-3");
    expect(callTargets.some((el) => el === zone3Card)).toBe(true);
  });

  it("dismisses the banner when 'Got it ✕' is clicked", () => {
    render(<MapPage />);

    const dismissBtn = screen.getByRole("button", { name: /dismiss banner/i });
    fireEvent.click(dismissBtn);

    const banner = screen.getByRole("status");
    expect(banner).toHaveStyle({ opacity: "0" });
  });

  it("banner auto-dismisses after 5 seconds", () => {
    render(<MapPage />);

    const bannerBefore = screen.getByRole("status");
    expect(bannerBefore).toHaveStyle({ opacity: "1" });

    act(() => {
      vi.advanceTimersByTime(5001);
    });

    const bannerAfter = screen.getByRole("status");
    expect(bannerAfter).toHaveStyle({ opacity: "0" });
  });
});

describe("MapPage — no share param", () => {
  beforeEach(() => {
    setSearch("");
    scrollIntoViewMock.mockClear();
  });

  it("does not render the share-link banner when ?zone is absent", () => {
    render(<MapPage />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
