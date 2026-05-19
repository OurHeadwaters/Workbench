/**
 * FoundingStories.test.tsx
 *
 * Regression tests for the founding-stories entry flow:
 *   - OdysseyPage "New here?" link points to /founding-stories, not /story
 *   - FoundingStoriesPage renders all three story titles
 *   - FoundingStoriesPage bottom CTAs link to /story and /odyssey
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { OdysseyPage } from "@/pages/OdysseyPage";
import { FoundingStoriesPage } from "@/pages/FoundingStoriesPage";

/* ── Mocks ── */

vi.mock("@/components/TrailMapHero", () => ({
  TrailMapHero: () => <div data-testid="trail-map-hero" />,
}));

vi.mock("@/lib/api", () => ({
  getStoredOwnerToken: () => null,
  apiRequest: vi.fn(),
}));

/* ── OdysseyPage entry link ── */

describe("OdysseyPage — founding-stories entry link", () => {
  it("'Read the origin →' links to /founding-stories", () => {
    render(<OdysseyPage />);
    const link = screen.getByRole("link", { name: /read the origin/i });
    expect(link).toHaveAttribute("href", "/founding-stories");
  });

  it("does not link to the old /story path", () => {
    render(<OdysseyPage />);
    const link = screen.getByRole("link", { name: /read the origin/i });
    expect(link).not.toHaveAttribute("href", "/story");
  });
});

/* ── FoundingStoriesPage structure ── */

describe("FoundingStoriesPage — content", () => {
  it("renders all three founding story titles", () => {
    render(<FoundingStoriesPage />);
    expect(screen.getByText("The Girl Who Waited for the Eagle")).toBeInTheDocument();
    expect(screen.getByText("The Girl Who Never Knew")).toBeInTheDocument();
    expect(screen.getByText("The Girl Who Stopped Waiting for Spring")).toBeInTheDocument();
  });

  it("renders story 01 of 03 ordinal labels", () => {
    render(<FoundingStoriesPage />);
    expect(screen.getByText(/story 01 of 03/i)).toBeInTheDocument();
    expect(screen.getByText(/story 02 of 03/i)).toBeInTheDocument();
    expect(screen.getByText(/story 03 of 03/i)).toBeInTheDocument();
  });

  it("bottom CTA 'I'm a young reader →' links to /story", () => {
    render(<FoundingStoriesPage />);
    const link = screen.getByRole("link", { name: /young reader/i });
    expect(link).toHaveAttribute("href", "/story");
  });

  it("bottom CTA 'I'm a practitioner →' links to /odyssey", () => {
    render(<FoundingStoriesPage />);
    const link = screen.getByRole("link", { name: /practitioner/i });
    expect(link).toHaveAttribute("href", "/odyssey");
  });
});
