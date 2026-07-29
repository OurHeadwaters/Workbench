/**
 * MillPage.test.tsx
 *
 * Regression tests for the Mill checklist go/no-go signal:
 *   - Ticking all five checkboxes reveals the "Clear to open a scope" banner
 *   - The "Open SOW →" link points to /sow
 *   - Ticking only four boxes leaves the banner in the "X / 5 cleared" state
 */

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MillPage } from "@/pages/MillPage";

/* ── Mocks ── */

vi.mock("@/components/AmbientBackground", () => ({
  AmbientBackground: () => <div data-testid="ambient-bg" />,
  GrainOverlay: () => <div data-testid="grain-overlay" />,
  ScrollReveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/ZoneTag", () => ({
  ZoneTag: ({ zone, label }: { zone: number; label: string }) => (
    <span data-testid="zone-tag">{label}</span>
  ),
}));

/* ── Helpers ── */

/** Returns all five filter-question toggle buttons in document order. */
function getCheckboxButtons() {
  return screen.getAllByRole("button").filter(
    (btn) => btn.getAttribute("aria-pressed") !== null
  );
}

/* ── Tests ── */

describe("MillPage — go/no-go banner with all five boxes ticked", () => {
  it("shows 'Clear to open a scope' after all five boxes are ticked", () => {
    render(<MillPage />);

    const buttons = getCheckboxButtons();
    expect(buttons).toHaveLength(5);

    buttons.forEach((btn) => fireEvent.click(btn));

    const banner = screen.getByTestId("mill-gonogo");
    expect(banner).toHaveTextContent(/clear to open a scope/i);
  });

  it("reveals the 'Open SOW →' link pointing to /sow after all five are ticked", () => {
    render(<MillPage />);

    const buttons = getCheckboxButtons();
    buttons.forEach((btn) => fireEvent.click(btn));

    const sowLink = screen.getByTestId("mill-gonogo-sow-link");
    expect(sowLink).toBeInTheDocument();
    expect(sowLink).toHaveAttribute("href", expect.stringMatching(/\/sow$/));
  });
});

describe("MillPage — go/no-go banner with only four boxes ticked", () => {
  it("shows '4 / 5 cleared' when exactly four checkboxes are ticked", () => {
    render(<MillPage />);

    const buttons = getCheckboxButtons();
    // Tick only the first four
    buttons.slice(0, 4).forEach((btn) => fireEvent.click(btn));

    const banner = screen.getByTestId("mill-gonogo");
    expect(banner).toHaveTextContent(/4\s*\/\s*5\s*cleared/i);
  });

  it("does not show the SOW link when only four boxes are ticked", () => {
    render(<MillPage />);

    const buttons = getCheckboxButtons();
    buttons.slice(0, 4).forEach((btn) => fireEvent.click(btn));

    expect(screen.queryByTestId("mill-gonogo-sow-link")).not.toBeInTheDocument();
  });
});
