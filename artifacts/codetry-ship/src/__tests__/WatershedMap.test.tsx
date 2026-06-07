/**
 * WatershedMap.test.tsx
 *
 * Automated tests for the WatershedMap interactive behaviours.
 *
 * Scenarios covered:
 *   Click to pin       — clicking a ring pins it and reveals the description panel
 *   Toggle unpin       — clicking the same ring again unpins it; panel hides
 *   URL param pre-pin  — ?zone=N mounts with the correct zone already pinned
 *   Compass pre-pin    — localStorage "compassResult" pre-pins on mount
 *   "You are here"     — badge appears only when pinned from Compass/URL; gone after manual re-pin
 *   Share button       — writes the expected URL to the clipboard
 *   Share feedback     — button label changes to "Link copied ✓" after write
 *   Close button       — clears the pinned zone and hides the panel
 *   Keyboard nav       — Enter/Space pin and unpin; Tab cycles focus between ring buttons
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WatershedMap from "@/components/WatershedMap";

/*
 * RINGS reference (for choosing stable panel-only text):
 *   Zone 0  plainDesc  "Where decisions are made before you need them…"
 *   Zone 1  plainDesc  "The people you'd call in a storm…"
 *   Zone 2  plainDesc  "Where you show up regularly…"
 *   Zone 3  plainDesc  "People ready when called…"
 *   Zone 4  plainDesc  "Where the community meets, decides together…"
 *   Zone 5  plainDesc  "The world outside — where resources come from…"
 *
 * plainLabel (e.g. "beyond the community") is also rendered INSIDE the SVG rings
 * as a <text> element, so assertions about plainLabel are unreliable — we use
 * plainDesc or other panel-exclusive elements instead.
 */

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/**
 * Return the SVG ring button for a given zone number.
 * Each ring is role="button" with aria-label beginning "Zone N: …"
 */
function getRingButton(zoneNumber: number) {
  return screen.getByRole("button", {
    name: new RegExp(`^Zone ${zoneNumber}:`),
  });
}

/**
 * Stub window.location.search so resolveInitialZone() reads ?zone=N.
 * Also sets origin/pathname so the share URL is predictable.
 */
function stubLocation(opts: { search?: string; origin?: string; pathname?: string } = {}) {
  Object.defineProperty(window, "location", {
    writable: true,
    configurable: true,
    value: {
      ...window.location,
      search: opts.search ?? "",
      origin: opts.origin ?? "https://example.com",
      pathname: opts.pathname ?? "/",
    },
  });
}

function resetLocation() {
  Object.defineProperty(window, "location", {
    writable: true,
    configurable: true,
    value: { ...window.location, search: "", origin: "https://example.com", pathname: "/" },
  });
}

/* ── Tests ───────────────────────────────────────────────────────────────── */

describe("WatershedMap — click to pin", () => {
  afterEach(() => {
    resetLocation();
    localStorage.clear();
  });

  it("shows the description panel (plainDesc) after clicking a ring", async () => {
    render(<WatershedMap />);
    const user = userEvent.setup();

    /* plainDesc for zone 5 is only rendered in the panel, not in the SVG labels */
    expect(
      screen.queryByText(/The world outside — where resources come from/i),
    ).not.toBeInTheDocument();

    await user.click(getRingButton(5));

    expect(
      screen.getByText(/The world outside — where resources come from/i),
    ).toBeInTheDocument();
  });

  it("sets aria-pressed to true on the clicked ring", async () => {
    render(<WatershedMap />);
    const user = userEvent.setup();

    const ring = getRingButton(2);
    expect(ring).toHaveAttribute("aria-pressed", "false");

    await user.click(ring);
    expect(ring).toHaveAttribute("aria-pressed", "true");
  });

  it("shows the Share and Close buttons when a ring is pinned", async () => {
    render(<WatershedMap />);
    const user = userEvent.setup();

    expect(screen.queryByText(/Share this zone/i)).not.toBeInTheDocument();

    await user.click(getRingButton(4));

    expect(screen.getByText(/Share this zone/i)).toBeInTheDocument();
    expect(screen.getByText(/^Close/i)).toBeInTheDocument();
  });

  it("unpins the ring (aria-pressed becomes false) when the same ring is clicked again", async () => {
    render(<WatershedMap />);
    const user = userEvent.setup();

    const ring = getRingButton(3);
    await user.click(ring);
    expect(ring).toHaveAttribute("aria-pressed", "true");

    await user.click(ring);

    /*
     * After the second click the pin is cleared.
     * Note: userEvent fires onMouseEnter during the click sequence, so the
     * hover state may keep the description visible — we assert the pin state
     * (aria-pressed) and that no "Share" button is shown (only appears when
     * pinned, not on hover).
     */
    expect(ring).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByText(/Share this zone/i)).not.toBeInTheDocument();
  });

  it("switches to a new zone when a different ring is clicked while one is already pinned", async () => {
    render(<WatershedMap />);
    const user = userEvent.setup();

    await user.click(getRingButton(1));
    expect(screen.getByText(/The people you'd call in a storm/i)).toBeInTheDocument();

    await user.click(getRingButton(4));

    expect(screen.queryByText(/The people you'd call in a storm/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Where the community meets, decides together/i)).toBeInTheDocument();
  });
});

describe("WatershedMap — URL param pre-pin (?zone=N)", () => {
  afterEach(() => {
    resetLocation();
    localStorage.clear();
  });

  it("pre-pins zone 2 when ?zone=2 is in the URL on mount", async () => {
    stubLocation({ search: "?zone=2" });
    render(<WatershedMap />);

    await waitFor(() => {
      expect(screen.getByText(/Where you show up regularly/i)).toBeInTheDocument();
    });

    expect(getRingButton(2)).toHaveAttribute("aria-pressed", "true");
  });

  it("pre-pins zone 5 when ?zone=5 is in the URL on mount", async () => {
    stubLocation({ search: "?zone=5" });
    render(<WatershedMap />);

    await waitFor(() => {
      expect(screen.getByText(/The world outside — where resources come from/i)).toBeInTheDocument();
    });

    expect(getRingButton(5)).toHaveAttribute("aria-pressed", "true");
  });

  it("pre-pins zone 0 (The Saltbox) when ?zone=0 is in the URL on mount", async () => {
    stubLocation({ search: "?zone=0" });
    render(<WatershedMap />);

    await waitFor(() => {
      expect(screen.getByText(/Where decisions are made before you need them/i)).toBeInTheDocument();
    });
  });

  it("does not pin any zone (no Share button) when no param is present", () => {
    render(<WatershedMap />);
    expect(screen.queryByText(/Share this zone/i)).not.toBeInTheDocument();
  });
});

describe("WatershedMap — Compass pre-pin (localStorage)", () => {
  afterEach(() => {
    resetLocation();
    localStorage.clear();
  });

  it("pre-pins the zone stored in localStorage compassResult", async () => {
    localStorage.setItem("compassResult", "3");
    render(<WatershedMap />);

    await waitFor(() => {
      /* Panel-only text — not rendered in the SVG ring label */
      expect(screen.getByText(/People ready when called/i)).toBeInTheDocument();
    });

    expect(getRingButton(3)).toHaveAttribute("aria-pressed", "true");
  });

  it("shows the 'You are here' badge when the zone comes from localStorage", async () => {
    localStorage.setItem("compassResult", "1");
    render(<WatershedMap />);

    await waitFor(() => {
      expect(screen.getByText(/you are here/i)).toBeInTheDocument();
    });
  });

  it("shows the 'You are here' badge when the zone comes from ?zone= URL param", async () => {
    stubLocation({ search: "?zone=4" });
    render(<WatershedMap />);

    await waitFor(() => {
      expect(screen.getByText(/you are here/i)).toBeInTheDocument();
    });
  });

  it("removes 'You are here' badge after user manually clicks a different ring", async () => {
    localStorage.setItem("compassResult", "2");
    render(<WatershedMap />);

    await waitFor(() => {
      expect(screen.getByText(/you are here/i)).toBeInTheDocument();
    });

    const user = userEvent.setup();
    /* Clicking a different ring clears the compass flag */
    await user.click(getRingButton(4));

    expect(screen.queryByText(/you are here/i)).not.toBeInTheDocument();
  });
});

describe("WatershedMap — Share this zone button", () => {
  /*
   * navigator.clipboard is installed as a plain stub by setup.ts.
   * We use vi.spyOn to wrap writeText with a proper mock per test.
   */
  let writeTextSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    writeTextSpy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    resetLocation();
    localStorage.clear();
  });

  it("calls clipboard.writeText with a URL containing ?zone=3 when zone 3 is shared", async () => {
    render(<WatershedMap />);
    const user = userEvent.setup();

    await user.click(getRingButton(3));
    // "Share this zone" opens the share panel; "Copy link" triggers the clipboard write.
    await user.click(screen.getByText(/Share this zone/i));
    await user.click(screen.getByRole("button", { name: /Copy link/i }));

    await waitFor(() => {
      expect(writeTextSpy).toHaveBeenCalledTimes(1);
      expect(writeTextSpy).toHaveBeenCalledWith(
        expect.stringContaining("?zone=3"),
      );
    });
  });

  it("calls clipboard.writeText with a URL containing ?zone=5 when zone 5 is shared", async () => {
    render(<WatershedMap />);
    const user = userEvent.setup();

    await user.click(getRingButton(5));
    await user.click(screen.getByText(/Share this zone/i));
    await user.click(screen.getByRole("button", { name: /Copy link/i }));

    await waitFor(() => {
      expect(writeTextSpy).toHaveBeenCalledTimes(1);
      expect(writeTextSpy).toHaveBeenCalledWith(
        expect.stringContaining("?zone=5"),
      );
    });
  });

  it("changes the button label to 'Link copied ✓' after a successful clipboard write", async () => {
    render(<WatershedMap />);
    const user = userEvent.setup();

    await user.click(getRingButton(1));
    await user.click(screen.getByText(/Share this zone/i));
    await user.click(screen.getByRole("button", { name: /Copy link/i }));

    await waitFor(() => {
      expect(screen.getByText(/Link copied/i)).toBeInTheDocument();
    });
  });

  it("does not render the Share button when no zone is pinned", () => {
    render(<WatershedMap />);
    expect(screen.queryByText(/Share this zone/i)).not.toBeInTheDocument();
  });
});

describe("WatershedMap — Close button", () => {
  afterEach(() => {
    resetLocation();
    localStorage.clear();
  });

  it("hides the description panel when Close is clicked", async () => {
    render(<WatershedMap />);
    const user = userEvent.setup();

    await user.click(getRingButton(4));
    expect(screen.getByText(/Where the community meets, decides together/i)).toBeInTheDocument();

    /* Use /^Close/ to avoid matching zone 1's aria-label which contains "close allies" */
    await user.click(screen.getByText(/^Close/));

    expect(
      screen.queryByText(/Where the community meets, decides together/i),
    ).not.toBeInTheDocument();
  });

  it("unpins the ring (aria-pressed=false) after Close is clicked", async () => {
    render(<WatershedMap />);
    const user = userEvent.setup();

    const ring = getRingButton(5);
    await user.click(ring);
    expect(ring).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByText(/^Close/));
    expect(ring).toHaveAttribute("aria-pressed", "false");
  });

  it("hides the Share and Close buttons after Close is clicked", async () => {
    render(<WatershedMap />);
    const user = userEvent.setup();

    await user.click(getRingButton(2));
    expect(screen.getByText(/Share this zone/i)).toBeInTheDocument();

    await user.click(screen.getByText(/^Close/));
    expect(screen.queryByText(/Share this zone/i)).not.toBeInTheDocument();
  });
});

describe("WatershedMap — keyboard navigation", () => {
  afterEach(() => {
    resetLocation();
    localStorage.clear();
  });

  it("pins a ring and shows the description panel when Enter is pressed", async () => {
    render(<WatershedMap />);
    const user = userEvent.setup();

    const ring = getRingButton(5);
    ring.focus();
    await user.keyboard("{Enter}");

    expect(ring).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByText(/The world outside — where resources come from/i),
    ).toBeInTheDocument();
  });

  it("pins a ring and shows the description panel when Space is pressed", async () => {
    render(<WatershedMap />);
    const user = userEvent.setup();

    const ring = getRingButton(3);
    ring.focus();
    await user.keyboard(" ");

    expect(ring).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByText(/People ready when called/i),
    ).toBeInTheDocument();
  });

  it("unpins an already-pinned ring when Enter is pressed a second time", async () => {
    render(<WatershedMap />);
    const user = userEvent.setup();

    const ring = getRingButton(2);
    ring.focus();
    await user.keyboard("{Enter}");
    expect(ring).toHaveAttribute("aria-pressed", "true");

    await user.keyboard("{Enter}");

    expect(ring).toHaveAttribute("aria-pressed", "false");
    /* Share button only appears when pinned — absence confirms the unpin */
    expect(screen.queryByText(/Share this zone/i)).not.toBeInTheDocument();
  });

  it("moves focus to the next ring button when Tab is pressed", async () => {
    render(<WatershedMap />);
    const user = userEvent.setup();

    /*
     * Rings are rendered in DOM order: zone 5 first, zone 0 last.
     * Tab from zone 5 should land on zone 4.
     */
    getRingButton(5).focus();
    await user.tab();

    expect(getRingButton(4)).toHaveFocus();
  });
});
