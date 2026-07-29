/**
 * WorkbenchDoctrine.test.tsx
 *
 * Verifies that the Doctrine shelf on the Workbench renders both cards and
 * that each card carries the correct href.  A future rename of a testId or
 * a broken href will fail here before it ships.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { WorkbenchPage } from "@/pages/WorkbenchPage";

/* ── Mocks ── */

// AmbientBackground uses canvas / animation APIs not available in jsdom.
vi.mock("@/components/AmbientBackground", () => ({
  AmbientBackground: () => null,
  GrainOverlay: () => null,
  ScrollReveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ZoneTag is a simple display component; render it as-is via a lightweight stub
// so tests don't have to pull in its full dependency tree.
vi.mock("@/components/ZoneTag", () => ({
  ZoneTag: ({ label }: { label: string }) => <span>{label}</span>,
}));

// wouter — stub useLocation so the auth redirect doesn't fire and navigate()
// calls don't throw in jsdom.
vi.mock("wouter", async (importOriginal) => {
  const actual = await importOriginal<typeof import("wouter")>();
  return {
    ...actual,
    useLocation: () => ["/workbench", vi.fn()],
  };
});

// api helpers — return a truthy token so the page renders instead of
// redirecting to /sign-on.
vi.mock("@/lib/api", () => ({
  getStoredOwnerToken: () => "test-token",
  setStoredOwnerToken: vi.fn(),
}));

/* ── Tests ── */

describe("WorkbenchPage — Doctrine shelf", () => {
  beforeEach(() => {
    cleanup();
  });

  it("renders the doctrine section", () => {
    render(<WorkbenchPage />);
    expect(screen.getByTestId("workbench-doctrine")).toBeInTheDocument();
  });

  it("renders the RealityCore card with the correct href", () => {
    render(<WorkbenchPage />);
    const card = screen.getByTestId("wb-realitycore");
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute(
      "href",
      "https://stomping-path-documentation.replit.app/logic/#reality-core"
    );
  });

  it("renders the Fallacy Map card with the correct href", () => {
    render(<WorkbenchPage />);
    const card = screen.getByTestId("wb-fallacy-map");
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute(
      "href",
      "https://stomping-path-documentation.replit.app/logic/#fallacy-map"
    );
  });

  it("both doctrine cards open in a new tab", () => {
    render(<WorkbenchPage />);
    expect(screen.getByTestId("wb-realitycore")).toHaveAttribute(
      "target",
      "_blank"
    );
    expect(screen.getByTestId("wb-fallacy-map")).toHaveAttribute(
      "target",
      "_blank"
    );
  });
});
