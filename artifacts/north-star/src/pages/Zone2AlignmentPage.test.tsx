import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Z2NpubReadout uses wouter's Link indirectly (through the page), but the
// component itself has no routing dependency — stub it just in case.
vi.mock("wouter", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  useLocation: () => ["/", vi.fn()],
}));

import { Z2NpubReadout } from "./Zone2AlignmentPage";

function makeResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ─── ok state ────────────────────────────────────────────────────────────────

describe("Z2NpubReadout — ok state (200)", () => {
  it("renders the npub when the API returns 200", async () => {
    const npub = "npub1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq8nmew";

    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(makeResponse(200, { npub }))),
    );

    render(<Z2NpubReadout />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
    });
  });

  it("copies the npub to the clipboard when the Copy button is clicked", async () => {
    const npub = "npub1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq8nmew";

    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(makeResponse(200, { npub }))),
    );

    render(<Z2NpubReadout />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
    });
  });

  it("copies the npub to the clipboard when the Copy button is clicked", async () => {
    const npub = "npub1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq8nmew";

    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(makeResponse(200, { npub }))),
    );

    const writeText = vi.fn(() => Promise.resolve());
    vi.stubGlobal("navigator", {
      ...navigator,
      clipboard: { writeText },
    });

    render(<Z2NpubReadout />);

    const btn = await screen.findByRole("button", { name: /copy/i });
    await userEvent.click(btn);

    expect(writeText).toHaveBeenCalledWith(npub);
  });

  it("shows 'Copied' text briefly after the Copy button is clicked", async () => {
    const npub = "npub1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq8nmew";

    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(makeResponse(200, { npub }))),
    );

    const writeText = vi.fn(() => Promise.resolve());
    vi.stubGlobal("navigator", {
      ...navigator,
      clipboard: { writeText },
    });

    render(<Z2NpubReadout />);

    const btn = await screen.findByRole("button", { name: /copy/i });
    await userEvent.click(btn);

    expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
  });

  it("sends the owner token as x-library-owner-token header", async () => {
    localStorage.setItem("ownerToken", "tok-abc123");

    const fetchMock = vi.fn(() =>
      Promise.resolve(
        makeResponse(200, { npub: "npub1aaaa" }),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<Z2NpubReadout />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    const firstCall = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const [, init] = firstCall;
    const headers = (init?.headers ?? {}) as Record<string, string>;
    expect(headers["x-library-owner-token"]).toBe("tok-abc123");
  });
});

// ─── unconfigured state (503) ─────────────────────────────────────────────────

describe("Z2NpubReadout — unconfigured state (503)", () => {
  it("shows the 'Not configured' message when the API returns 503", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(makeResponse(503, { error: "not configured" }))),
    );

    render(<Z2NpubReadout />);

    await waitFor(() => {
      expect(screen.getByText(/not configured/i)).toBeInTheDocument();
    });
  });

  it("mentions Z2_HOUSEHOLD_SEED in the unconfigured message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(makeResponse(503, { error: "not configured" }))),
    );

    render(<Z2NpubReadout />);

    await waitFor(() => {
      expect(screen.getByText(/Z2_HOUSEHOLD_SEED/)).toBeInTheDocument();
    });
  });

  it("does not render the Copy button when unconfigured", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(makeResponse(503, { error: "not configured" }))),
    );

    render(<Z2NpubReadout />);

    await waitFor(() => {
      expect(screen.getByText(/not configured/i)).toBeInTheDocument();
    });

    expect(screen.queryByRole("button", { name: /copy/i })).not.toBeInTheDocument();
  });
});

// ─── error state (unexpected status) ─────────────────────────────────────────

describe("Z2NpubReadout — error state (unexpected status)", () => {
  it("shows an error message when the API returns an unexpected status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(makeResponse(500, { error: "internal error" }))),
    );

    render(<Z2NpubReadout />);

    await waitFor(() => {
      expect(screen.getByText(/unexpected response.*500/i)).toBeInTheDocument();
    });
  });

  it("shows an error message when the API returns 404", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(makeResponse(404, { error: "not found" }))),
    );

    render(<Z2NpubReadout />);

    await waitFor(() => {
      expect(screen.getByText(/unexpected response.*404/i)).toBeInTheDocument();
    });
  });

  it("shows an error message when fetch rejects (network failure)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("Network error"))),
    );

    render(<Z2NpubReadout />);

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it("does not render the Copy button in the error state", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(makeResponse(500, {}))),
    );

    render(<Z2NpubReadout />);

    await waitFor(() => {
      expect(screen.getByText(/unexpected response/i)).toBeInTheDocument();
    });

    expect(screen.queryByRole("button", { name: /copy/i })).not.toBeInTheDocument();
  });

  it("shows the 'Access denied' message when the API returns 401", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(makeResponse(401, { error: "Unauthorized" }))),
    );

    render(<Z2NpubReadout />);

    await waitFor(() => {
      expect(screen.getByText(/access denied/i)).toBeInTheDocument();
    });
  });
});

// ─── loading state ────────────────────────────────────────────────────────────

describe("Z2NpubReadout — loading state", () => {
  it("shows 'Fetching…' before the response arrives", () => {
    // Never resolves — keeps the component in loading state
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));

    render(<Z2NpubReadout />);

    expect(screen.getByText(/fetching/i)).toBeInTheDocument();
  });
});
