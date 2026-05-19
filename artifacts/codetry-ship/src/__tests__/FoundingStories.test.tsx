/**
 * FoundingStories.test.tsx
 *
 * Regression tests for the founding-stories entry flow:
 *   - OdysseyPage "New here?" link points to /founding-stories, not /story
 *   - FoundingStoriesPage renders all three story titles
 *   - FoundingStoriesPage bottom CTAs link to /story and /odyssey
 *   - OdysseyPage post-completion screen (Guild cohort / What's next block)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as api from "@/lib/api";
import { OdysseyPage } from "@/pages/OdysseyPage";
import { FoundingStoriesPage } from "@/pages/FoundingStoriesPage";

/* ── Mocks ── */

vi.mock("@/components/TrailMapHero", () => ({
  TrailMapHero: () => <div data-testid="trail-map-hero" />,
}));

vi.mock("@/lib/api", () => ({
  getStoredOwnerToken: () => null,
  apiRequest: vi.fn(),
  postIntake: vi.fn(),
  ApiError: class ApiError extends Error {},
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

/* ── OdysseyPage post-completion screen ── */

async function submitOdysseyForm() {
  render(<OdysseyPage />);

  fireEvent.change(screen.getByPlaceholderText(/first name is fine/i), {
    target: { value: "Alex" },
  });
  fireEvent.change(screen.getByPlaceholderText(/where i can reach you/i), {
    target: { value: "alex@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(/band council, co-op/i), {
    target: { value: "Test Community" },
  });
  fireEvent.change(screen.getByPlaceholderText(/a word people use/i), {
    target: { value: "growth" },
  });

  fireEvent.click(screen.getByTestId("odyssey-submit"));
}

describe("OdysseyPage — post-completion screen", () => {
  beforeEach(() => {
    vi.mocked(api.postIntake).mockResolvedValue({ name: "Alex" } as Awaited<ReturnType<typeof api.postIntake>>);
  });

  it("shows the odyssey-whats-next block after submission", async () => {
    await submitOdysseyForm();
    await waitFor(() =>
      expect(screen.getByTestId("odyssey-whats-next")).toBeInTheDocument()
    );
  });

  it("renders the 'Guild cohort + Signal group' heading", async () => {
    await submitOdysseyForm();
    await waitFor(() =>
      expect(screen.getByText(/guild cohort \+ signal group/i)).toBeInTheDocument()
    );
  });

  it("renders the '$1,200 – $1,500 / person' price", async () => {
    await submitOdysseyForm();
    await waitFor(() =>
      expect(screen.getByText(/\$1,200\s*–\s*\$1,500\s*\/\s*person/i)).toBeInTheDocument()
    );
  });

  it("'Express interest' link points to /sign-on", async () => {
    await submitOdysseyForm();
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /express interest/i });
      expect(link).toHaveAttribute("href", "/sign-on");
    });
  });
});
