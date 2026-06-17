/**
 * MapPagePractitionerQuiz.test.tsx
 *
 * Verifies that selecting "practitioner" + "Normal period" or "Active standby"
 * in the MapPage quiz causes the correct Z1 money-tool pills to render as
 * highlighted (prefixed with "→ " in the ToolPill component).
 *
 * Regression guard: a silent drop of Z1–B / Z1–C / Z1–D from TOOL_HIGHLIGHT_MAP
 * — or a wiring break between quiz state and ToolPill rendering — will fail here.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MapPage } from "@/pages/MapPage";

vi.mock("@/components/WatershedMap", () => ({
  default: () => null,
}));

window.HTMLElement.prototype.scrollIntoView = vi.fn();

function clickQuizLabel(labelText: string) {
  const el = screen.getByText(labelText);
  const btn = el.closest("button");
  if (!btn) throw new Error(`No <button> ancestor found for text: "${labelText}"`);
  fireEvent.click(btn);
}

function highlightedPillNames(): string[] {
  return Array.from(document.querySelectorAll("a span"))
    .filter((span) => span.textContent?.startsWith("→ "))
    .map((span) => span.textContent!.replace(/^→\s*/, "").trim());
}

function renderFreshMap() {
  Object.defineProperty(window, "location", {
    value: { search: "", hash: "", href: "http://localhost/" },
    writable: true,
    configurable: true,
  });
  render(<MapPage />);
}

describe("MapPage — practitioner:normal quiz highlights Z1 money tools", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("highlights Headwaters Books (Z1–B) after selecting practitioner + normal", () => {
    renderFreshMap();

    act(() => {
      clickQuizLabel("A practitioner");
    });
    act(() => {
      clickQuizLabel("Normal period");
    });

    const highlighted = highlightedPillNames();
    expect(highlighted).toContain("Headwaters Books");
  });

  it("highlights North Star (Z1–C) after selecting practitioner + normal", () => {
    renderFreshMap();

    act(() => {
      clickQuizLabel("A practitioner");
    });
    act(() => {
      clickQuizLabel("Normal period");
    });

    const highlighted = highlightedPillNames();
    expect(highlighted).toContain("North Star");
  });

  it("does NOT highlight The Eave for practitioner + normal (standby only)", () => {
    renderFreshMap();

    act(() => {
      clickQuizLabel("A practitioner");
    });
    act(() => {
      clickQuizLabel("Normal period");
    });

    const highlighted = highlightedPillNames();
    expect(highlighted).not.toContain("The Eave");
  });
});

describe("MapPage — practitioner:standby quiz highlights Z1 money tools + The Eave", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("highlights Headwaters Books (Z1–B) after selecting practitioner + standby", () => {
    renderFreshMap();

    act(() => {
      clickQuizLabel("A practitioner");
    });
    act(() => {
      clickQuizLabel("Active standby");
    });

    const highlighted = highlightedPillNames();
    expect(highlighted).toContain("Headwaters Books");
  });

  it("highlights North Star (Z1–C) after selecting practitioner + standby", () => {
    renderFreshMap();

    act(() => {
      clickQuizLabel("A practitioner");
    });
    act(() => {
      clickQuizLabel("Active standby");
    });

    const highlighted = highlightedPillNames();
    expect(highlighted).toContain("North Star");
  });

  it("highlights The Eave (Z1–D) after selecting practitioner + standby", () => {
    renderFreshMap();

    act(() => {
      clickQuizLabel("A practitioner");
    });
    act(() => {
      clickQuizLabel("Active standby");
    });

    const highlighted = highlightedPillNames();
    expect(highlighted).toContain("The Eave");
  });
});
