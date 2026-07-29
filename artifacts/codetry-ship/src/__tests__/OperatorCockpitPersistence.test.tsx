/**
 * OperatorCockpitPersistence.test.tsx
 *
 * Verifies that the Operator Cockpit's org name and module toggles survive a
 * full page reload during a live demo.
 *
 * Strategy: jsdom's localStorage is real and persists within a test process.
 * Unmounting + remounting OperatorPage is equivalent to a hard page reload —
 * the component re-reads its initial state from localStorage on mount.
 *
 * localStorage keys under test:
 *   hw:cockpit:orgName
 *   hw:cockpit:zoneColor
 *   hw:cockpit:modules
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { OperatorPage } from "@/pages/OperatorPage";

/* ── Mocks ── */

// AmbientBackground uses canvas / animation APIs not available in jsdom.
vi.mock("@/components/AmbientBackground", () => ({
  AmbientBackground: () => null,
  GrainOverlay: () => null,
}));

// wouter's useLocation is fine in jsdom but navigate() would throw on real
// navigation — stub it so clicks on internal links don't error out.
vi.mock("wouter", async (importOriginal) => {
  const actual = await importOriginal<typeof import("wouter")>();
  return {
    ...actual,
    useLocation: () => ["/operator", vi.fn()],
  };
});

/* ── Helpers ── */

const LS_ORG_NAME = "hw:cockpit:orgName";
const LS_ZONE_COLOR = "hw:cockpit:zoneColor";
const LS_MODULES = "hw:cockpit:modules";

function mountCockpit() {
  return render(<OperatorPage />);
}

/* ── Tests ── */

describe("Operator Cockpit — localStorage persistence across reload", () => {
  beforeEach(() => {
    // Start each test with a clean slate so tests are independent.
    localStorage.clear();
    cleanup();
  });

  it("persists a custom org name after remount (simulated reload)", () => {
    // First mount — user types a new org name.
    mountCockpit();

    const input = screen.getByTestId("cockpit-org-name") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Deer Lake Cooperative" } });

    // localStorage should be updated immediately via the useEffect.
    expect(localStorage.getItem(LS_ORG_NAME)).toBe("Deer Lake Cooperative");

    // Simulate reload: unmount then remount.
    cleanup();
    mountCockpit();

    const inputAfterReload = screen.getByTestId(
      "cockpit-org-name"
    ) as HTMLInputElement;
    expect(inputAfterReload.value).toBe("Deer Lake Cooperative");
  });

  it("persists module toggle state after remount (simulated reload)", () => {
    // First mount — enable steward and moments (both are off by default).
    mountCockpit();

    const stewardToggle = screen.getByTestId("cockpit-toggle-steward");
    const momentsToggle = screen.getByTestId("cockpit-toggle-moments");

    // Both should start as off (aria-checked="false").
    expect(stewardToggle).toHaveAttribute("aria-checked", "false");
    expect(momentsToggle).toHaveAttribute("aria-checked", "false");

    fireEvent.click(stewardToggle);
    fireEvent.click(momentsToggle);

    // Verify localStorage was written.
    const stored = JSON.parse(localStorage.getItem(LS_MODULES) ?? "{}");
    expect(stored.steward).toBe(true);
    expect(stored.moments).toBe(true);
    // base was already on, beacon remains off.
    expect(stored.base).toBe(true);
    expect(stored.beacon).toBe(false);

    // Simulate reload.
    cleanup();
    mountCockpit();

    expect(screen.getByTestId("cockpit-toggle-steward")).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByTestId("cockpit-toggle-moments")).toHaveAttribute(
      "aria-checked",
      "true"
    );
    // Unchanged toggles should retain their values too.
    expect(screen.getByTestId("cockpit-toggle-base")).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByTestId("cockpit-toggle-beacon")).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("persists both org name and module toggles together after remount", () => {
    mountCockpit();

    // Set org name.
    fireEvent.change(screen.getByTestId("cockpit-org-name"), {
      target: { value: "Northern Roots Coop" },
    });

    // Toggle two modules.
    fireEvent.click(screen.getByTestId("cockpit-toggle-steward"));
    fireEvent.click(screen.getByTestId("cockpit-toggle-beacon"));

    // Simulate reload.
    cleanup();
    mountCockpit();

    expect(
      (screen.getByTestId("cockpit-org-name") as HTMLInputElement).value
    ).toBe("Northern Roots Coop");
    expect(screen.getByTestId("cockpit-toggle-steward")).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByTestId("cockpit-toggle-beacon")).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("uses the correct localStorage key names so future renames are caught", () => {
    mountCockpit();

    fireEvent.change(screen.getByTestId("cockpit-org-name"), {
      target: { value: "Key Check Org" },
    });
    fireEvent.click(screen.getByTestId("cockpit-toggle-steward"));

    // Assert exact key names — if the keys drift, this fails immediately.
    expect(localStorage.getItem("hw:cockpit:orgName")).toBe("Key Check Org");
    expect(
      JSON.parse(localStorage.getItem("hw:cockpit:modules") ?? "{}")
    ).toMatchObject({ steward: true });
  });

  it("persists a non-default zone-colour swatch after remount (simulated reload)", () => {
    // Zone 3 blue (#1A5FA8) is the default. We select Zone 1 green instead.
    const ZONE1_HEX = "2E6B45";
    const ZONE3_HEX = "1A5FA8";

    mountCockpit();

    // Default swatch should be Zone 3 (aria-checked="true").
    expect(screen.getByTestId(`cockpit-swatch-${ZONE3_HEX}`)).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByTestId(`cockpit-swatch-${ZONE1_HEX}`)).toHaveAttribute(
      "aria-checked",
      "false"
    );

    // Click the Zone 1 swatch.
    fireEvent.click(screen.getByTestId(`cockpit-swatch-${ZONE1_HEX}`));

    // localStorage should be updated immediately.
    expect(localStorage.getItem(LS_ZONE_COLOR)).toBe(`#${ZONE1_HEX}`);

    // Simulate reload: unmount then remount.
    cleanup();
    mountCockpit();

    // After remount, Zone 1 should be selected and Zone 3 should not.
    expect(screen.getByTestId(`cockpit-swatch-${ZONE1_HEX}`)).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByTestId(`cockpit-swatch-${ZONE3_HEX}`)).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("uses the exact key hw:cockpit:zoneColor so a rename is caught immediately", () => {
    mountCockpit();

    // Click a non-default swatch — Zone 2 amber.
    const ZONE2_HEX = "C97C2E";
    fireEvent.click(screen.getByTestId(`cockpit-swatch-${ZONE2_HEX}`));

    // The stored value must use this exact key name.
    expect(localStorage.getItem("hw:cockpit:zoneColor")).toBe(`#${ZONE2_HEX}`);
  });
});
