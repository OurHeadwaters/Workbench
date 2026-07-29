/**
 * SiteNavMillLink.test.tsx
 *
 * Guards the "The Mill" entry in the Tools dropdown:
 *   - The link renders when the dropdown is opened
 *   - Its href is exactly /mill
 *   - Its data-testid is nav-tool-the-mill
 *
 * Regression guard: if the href drifts or the entry is accidentally removed
 * from PRODUCTION_TOOLS in SiteNav.tsx, these tests fail before it ships.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SiteNav } from "@/components/SiteNav";

/* ── Module mocks ── */

vi.mock("wouter", () => ({
  useLocation: () => ["/", vi.fn()],
}));

vi.mock("@/lib/api", () => ({
  getStoredOwnerToken: () => null,
  setStoredOwnerToken: vi.fn(),
}));

vi.mock("@/components/ZoneChip", () => ({
  ZoneChip: () => <span data-testid="zone-chip" />,
}));

/* ── Helpers ── */

function openToolsDropdown() {
  const toggle = screen.getByTestId("nav-tools-toggle");
  fireEvent.click(toggle);
}

/* ── Tests ── */

describe("SiteNav — The Mill nav entry", () => {
  it("renders The Mill link inside the Tools dropdown", () => {
    render(<SiteNav />);
    openToolsDropdown();

    const millLink = screen.getByTestId("nav-tool-the-mill");
    expect(millLink).toBeInTheDocument();
  });

  it("The Mill link href points to /mill", () => {
    render(<SiteNav />);
    openToolsDropdown();

    const millLink = screen.getByTestId("nav-tool-the-mill");
    expect(millLink).toHaveAttribute("href", "/mill");
  });

  it("The Mill link label reads 'The Mill'", () => {
    render(<SiteNav />);
    openToolsDropdown();

    const millLink = screen.getByTestId("nav-tool-the-mill");
    expect(millLink).toHaveTextContent(/the mill/i);
  });
});
