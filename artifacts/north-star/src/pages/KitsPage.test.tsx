import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { KitsPage } from "./KitsPage";

function makeResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

type FetchHandler = (url: string, init?: RequestInit) => Response;

function stubFetch(handler: FetchHandler) {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string, init?: RequestInit) => Promise.resolve(handler(url, init))),
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("KitsPage — owner fetch 401 shows auth error (not silent fallback)", () => {
  it("shows 'Not authorised' banner when the drafts endpoint returns 401", async () => {
    localStorage.setItem("ownerToken", "valid-token");

    stubFetch((url) => {
      if (url.includes("/api/kits/list")) return makeResponse(200, { kits: [] });
      if (url.includes("/api/kits/drafts")) return makeResponse(401, { error: "Unauthorized" });
      if (url.includes("/api/kits/tokens")) return makeResponse(200, { tokens: [] });
      if (url.includes("/api/kits/failures")) return makeResponse(200, { failures: [] });
      return makeResponse(404, {});
    });

    render(<KitsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Not authorised/i)).toBeInTheDocument();
    });
  });

  it("shows 'Not authorised' banner when the tokens endpoint returns 401", async () => {
    localStorage.setItem("ownerToken", "valid-token");

    stubFetch((url) => {
      if (url.includes("/api/kits/list")) return makeResponse(200, { kits: [] });
      if (url.includes("/api/kits/drafts")) return makeResponse(200, { kits: [] });
      if (url.includes("/api/kits/tokens")) return makeResponse(401, { error: "Unauthorized" });
      if (url.includes("/api/kits/failures")) return makeResponse(200, { failures: [] });
      return makeResponse(404, {});
    });

    render(<KitsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Not authorised/i)).toBeInTheDocument();
    });
  });

  it("shows 'Not authorised' banner when the failures endpoint returns 401", async () => {
    localStorage.setItem("ownerToken", "valid-token");

    stubFetch((url) => {
      if (url.includes("/api/kits/list")) return makeResponse(200, { kits: [] });
      if (url.includes("/api/kits/drafts")) return makeResponse(200, { kits: [] });
      if (url.includes("/api/kits/tokens")) return makeResponse(200, { tokens: [] });
      if (url.includes("/api/kits/failures")) return makeResponse(401, { error: "Unauthorized" });
      return makeResponse(404, {});
    });

    render(<KitsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Not authorised/i)).toBeInTheDocument();
    });
  });

  it("does NOT show 'Not authorised' banner when all owner endpoints succeed", async () => {
    localStorage.setItem("ownerToken", "valid-token");

    stubFetch((url) => {
      if (url.includes("/api/kits/list")) return makeResponse(200, { kits: [] });
      if (url.includes("/api/kits/drafts")) return makeResponse(200, { kits: [] });
      if (url.includes("/api/kits/tokens")) return makeResponse(200, { tokens: [] });
      if (url.includes("/api/kits/failures")) return makeResponse(200, { failures: [] });
      return makeResponse(404, {});
    });

    render(<KitsPage />);

    await waitFor(() => {
      expect(screen.queryByText(/Not authorised/i)).not.toBeInTheDocument();
    });
  });

  it("does not call owner-only endpoints when no owner token is stored", async () => {
    const fetchMock = vi.fn((url: string) => {
      if (url.includes("/api/kits/list"))
        return Promise.resolve(makeResponse(200, { kits: [] }));
      return Promise.resolve(makeResponse(401, {}));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<KitsPage />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    const ownerCalls = (fetchMock.mock.calls as [string, RequestInit?][]).filter(
      ([url]) =>
        url.includes("/drafts") || url.includes("/tokens") || url.includes("/failures"),
    );
    expect(ownerCalls).toHaveLength(0);
  });
});
