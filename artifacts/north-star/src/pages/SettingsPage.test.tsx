import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/lib/lock", () => ({
  lockKitchenTable: vi.fn(),
  isKitchenTableUnlocked: vi.fn(() => false),
}));

vi.mock("@/components/PasswordGate", () => ({
  getEffectivePassword: vi.fn(() => null),
}));

const mockStoreState = {
  statement: { who: "", why: "", noFly: "" },
  setStatement: vi.fn(),
  workbenchPlan: null,
  setWorkbenchPlan: vi.fn(),
  exportBackup: vi.fn(() => "{}"),
  importBackup: vi.fn(),
  resetAll: vi.fn(),
};

vi.mock("@/store", () => ({
  useStore: (selector: (s: typeof mockStoreState) => unknown) => selector(mockStoreState),
}));

import { SettingsPage } from "./SettingsPage";

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

describe("SettingsPage — notify-email GET auth-error handling", () => {
  it("shows 'Not authorised — owner token required' when the notify-email GET returns 401", async () => {
    localStorage.setItem("ownerToken", "my-secret-token");

    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/api/settings/notify-email")) {
          return Promise.resolve(makeResponse(401, {}));
        }
        return Promise.resolve(makeResponse(404, {}));
      }),
    );

    render(<SettingsPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/Not authorised.*owner token required/i),
      ).toBeInTheDocument();
    });
  });

  it("does NOT show an auth error when notify-email GET returns 200", async () => {
    localStorage.setItem("ownerToken", "my-secret-token");

    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/api/settings/notify-email")) {
          return Promise.resolve(
            makeResponse(200, { email: "founder@example.com", source: "db" }),
          );
        }
        return Promise.resolve(makeResponse(404, {}));
      }),
    );

    render(<SettingsPage />);

    await new Promise((r) => setTimeout(r, 100));

    expect(
      screen.queryByText(/Not authorised.*owner token required/i),
    ).not.toBeInTheDocument();
  });

  it("does NOT fetch notify-email when no owner token is present", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<SettingsPage />);

    await new Promise((r) => setTimeout(r, 100));

    const notifyEmailCalls = (fetchMock.mock.calls as [string, RequestInit?][]).filter(([url]) =>
      url?.includes?.("/api/settings/notify-email"),
    );
    expect(notifyEmailCalls).toHaveLength(0);
  });

  it("sends the x-library-owner-token header on the notify-email GET request", async () => {
    localStorage.setItem("ownerToken", "my-secret-token");

    const fetchMock = vi.fn((url: string) => {
      if (url.includes("/api/settings/notify-email")) {
        return Promise.resolve(makeResponse(200, { email: null, source: "unset" }));
      }
      return Promise.resolve(makeResponse(404, {}));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<SettingsPage />);

    await waitFor(() => {
      const calls = (fetchMock.mock.calls as [string, RequestInit?][]).filter(([url]) =>
        url.includes("/api/settings/notify-email"),
      );
      expect(calls.length).toBeGreaterThan(0);
      const headers = (calls[0]?.[1]?.headers ?? {}) as Record<string, string>;
      expect(headers["x-library-owner-token"]).toBe("my-secret-token");
    });
  });
});
