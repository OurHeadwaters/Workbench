/**
 * OperatorCockpitMRR.test.tsx
 *
 * Verifies that the MRR projection in the Operator Cockpit renders the correct
 * value for every meaningful module combination at 1,500 members.
 *
 * Pricing at time of writing (catch regressions if these drift):
 *   Base    — $1.25 / member / mo  → 1,500 members = $1,875 / mo
 *   Steward — $2.00 / member / mo  → 1,500 members = $3,000 / mo
 *   Full    — $2.50 / member / mo  → 1,500 members = $3,750 / mo
 *
 * The cockpit reads its initial state from localStorage, so seeding localStorage
 * before mounting gives us full control over which modules are active.
 *
 * Element under test: data-testid="cockpit-mrr-value"
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { OperatorPage } from "@/pages/OperatorPage";

/* ── Mocks ─────────────────────────────────────────────────────────────────── */

vi.mock("@/components/AmbientBackground", () => ({
  AmbientBackground: () => null,
  GrainOverlay: () => null,
}));

vi.mock("wouter", async (importOriginal) => {
  const actual = await importOriginal<typeof import("wouter")>();
  return {
    ...actual,
    useLocation: () => ["/operator", vi.fn()],
  };
});

/* ── Helpers ────────────────────────────────────────────────────────────────── */

const LS_MODULES = "hw:cockpit:modules";
const LS_MEMBER_COUNT = "hw:cockpit:memberCount";

/** Seed localStorage and mount a fresh OperatorPage. */
function mountWith(modules: Record<string, boolean>, memberCount = 1500) {
  localStorage.setItem(LS_MODULES, JSON.stringify(modules));
  localStorage.setItem(LS_MEMBER_COUNT, String(memberCount));
  return render(<OperatorPage />);
}

function mrrValue() {
  return screen.getByTestId("cockpit-mrr-value").textContent ?? "";
}

/* ── Test suite ─────────────────────────────────────────────────────────────── */

describe("Operator Cockpit — MRR projection at 1,500 members", () => {
  beforeEach(() => {
    localStorage.clear();
    cleanup();
  });

  // ── No modules ────────────────────────────────────────────────────────────

  it("shows '—' when no modules are active", () => {
    mountWith({ base: false, steward: false, moments: false, beacon: false });
    expect(mrrValue()).toBe("—");
  });

  // ── Single-module cases ───────────────────────────────────────────────────

  it("shows $1,875 / mo for Base only (1,500 × $1.25)", () => {
    mountWith({ base: true, steward: false, moments: false, beacon: false });
    expect(mrrValue()).toContain("$1,875");
    expect(mrrValue()).toContain("/ mo");
  });

  it("shows $3,000 / mo for Steward only (1,500 × $2.00)", () => {
    mountWith({ base: false, steward: true, moments: false, beacon: false });
    expect(mrrValue()).toContain("$3,000");
    expect(mrrValue()).toContain("/ mo");
  });

  it("shows $3,750 / mo for Full tier — Moments only (1,500 × $2.50)", () => {
    mountWith({ base: false, steward: false, moments: true, beacon: false });
    expect(mrrValue()).toContain("$3,750");
    expect(mrrValue()).toContain("/ mo");
  });

  it("shows $3,750 / mo for Full tier — Beacon only (1,500 × $2.50)", () => {
    mountWith({ base: false, steward: false, moments: false, beacon: true });
    expect(mrrValue()).toContain("$3,750");
    expect(mrrValue()).toContain("/ mo");
  });

  it("shows $3,750 / mo for Full tier — both Moments + Beacon (single $2.50 rate, no range)", () => {
    mountWith({ base: false, steward: false, moments: true, beacon: true });
    const text = mrrValue();
    expect(text).toContain("$3,750");
    expect(text).toContain("/ mo");
    // Both Full-tier modules share the same price — must NOT show a range
    expect(text).not.toContain("–");
  });

  // ── Mixed combinations ────────────────────────────────────────────────────

  it("shows $1,875–$3,000 / mo range for Base + Steward", () => {
    mountWith({ base: true, steward: true, moments: false, beacon: false });
    const text = mrrValue();
    expect(text).toContain("$1,875");
    expect(text).toContain("$3,000");
    expect(text).toContain("–");
    expect(text).toContain("/ mo");
  });

  it("shows $1,875–$3,750 / mo range for Base + Full tier (Moments)", () => {
    mountWith({ base: true, steward: false, moments: true, beacon: false });
    const text = mrrValue();
    expect(text).toContain("$1,875");
    expect(text).toContain("$3,750");
    expect(text).toContain("–");
  });

  it("shows $3,000–$3,750 / mo range for Steward + Full tier", () => {
    mountWith({ base: false, steward: true, moments: true, beacon: false });
    const text = mrrValue();
    expect(text).toContain("$3,000");
    expect(text).toContain("$3,750");
    expect(text).toContain("–");
  });

  it("shows the correct range when all four modules are active", () => {
    mountWith({ base: true, steward: true, moments: true, beacon: true });
    const text = mrrValue();
    // lowest = Base $1.25 → $1,875; highest = Full $2.50 → $3,750
    expect(text).toContain("$1,875");
    expect(text).toContain("$3,750");
    expect(text).toContain("–");
    expect(text).toContain("/ mo");
  });

  // ── Toggle interaction ────────────────────────────────────────────────────

  it("updates the MRR live when a module is toggled on", () => {
    // Start with Base only
    mountWith({ base: true, steward: false, moments: false, beacon: false });
    expect(mrrValue()).toContain("$1,875");

    // Enable Steward → should show a range
    fireEvent.click(screen.getByTestId("cockpit-toggle-steward"));
    const text = mrrValue();
    expect(text).toContain("$1,875");
    expect(text).toContain("$3,000");
    expect(text).toContain("–");
  });

  it("reverts to '—' when the last active module is toggled off", () => {
    // Start with Base only
    mountWith({ base: true, steward: false, moments: false, beacon: false });
    expect(mrrValue()).toContain("$1,875");

    // Disable Base → nothing active
    fireEvent.click(screen.getByTestId("cockpit-toggle-base"));
    expect(mrrValue()).toBe("—");
  });

  // ── Member count sensitivity ──────────────────────────────────────────────

  it("recalculates correctly for a custom member count (500 × Base $1.25 = $625)", () => {
    mountWith({ base: true, steward: false, moments: false, beacon: false }, 500);
    expect(mrrValue()).toContain("$625");
  });

  it("recalculates correctly for a custom member count (2000 × Full $2.50 = $5,000)", () => {
    mountWith({ base: false, steward: false, moments: true, beacon: false }, 2000);
    expect(mrrValue()).toContain("$5,000");
  });
});
