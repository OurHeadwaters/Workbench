import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// ── Store mock ────────────────────────────────────────────────────────────────
// MorningTriage reads four slices from the zustand store via useStore(selector).
// We mock @/store so the selector is applied to a controlled state object,
// letting each test shape the store without touching the real zustand instance.

type MockState = {
  inbox: {
    enabled: boolean;
    keywords: string[];
    senders: string[];
    hatLabels: { address: string; label: string }[];
    lastSavedAt: string | undefined;
  };
  gmailAccounts: Array<{
    id: string;
    address: string;
    label: string;
    fullName: string;
    enabled: boolean;
    isAlias?: boolean;
  }>;
  pendingReplies: Record<string, { deferredCount: number; lastDeferred?: string; doneAt?: string }>;
  setPendingReply: (key: string, patch: Record<string, unknown>) => void;
};

const mockState: MockState = {
  inbox: {
    enabled: true,
    keywords: ["invoice"],
    senders: [],
    hatLabels: [],
    lastSavedAt: undefined,
  },
  gmailAccounts: [
    {
      id: "acc-pj-main",
      address: "pj@example.com",
      label: "PJ Main",
      fullName: "PJ",
      enabled: true,
      isAlias: false,
    },
  ],
  pendingReplies: {},
  setPendingReply: vi.fn(),
};

vi.mock("@/store", () => ({
  useStore: (selector: (state: MockState) => unknown) => selector(mockState),
}));

// ── Subject under test ────────────────────────────────────────────────────────

import { MorningTriage } from "./MorningTriage";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

function stubFetch(handler: (url: string, init?: RequestInit) => Response) {
  vi.stubGlobal("fetch", vi.fn((url: string, init?: RequestInit) => Promise.resolve(handler(url, init))));
}

function capturedFetchCalls(): Array<[string, RequestInit | undefined]> {
  const mock = vi.mocked(globalThis.fetch as ReturnType<typeof vi.fn>);
  return mock.mock.calls as Array<[string, RequestInit | undefined]>;
}

// ── Setup / teardown ─────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  mockState.inbox.enabled = true;
  mockState.pendingReplies = {};
  mockState.gmailAccounts = [
    {
      id: "acc-pj-main",
      address: "pj@example.com",
      label: "PJ Main",
      fullName: "PJ",
      enabled: true,
      isAlias: false,
    },
  ];
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ── Tests: authorized (token present) ────────────────────────────────────────

describe("MorningTriage — authorized (ownerToken set in localStorage)", () => {
  it("sends x-library-owner-token header when ownerToken is in localStorage", async () => {
    localStorage.setItem("ownerToken", "my-secret-token");

    stubFetch(() =>
      makeResponse(200, {
        threads: [
          {
            id: "t1",
            subject: "Invoice from Acme",
            from: "billing@acme.com",
            snippet: "Please find attached...",
            date: new Date().toISOString(),
            accountId: "acc-pj-main",
            accountLabel: "PJ Main",
          },
        ],
        accountStatuses: { "acc-pj-main": "ok" },
      }),
    );

    render(<MorningTriage alwaysExpanded />);

    await waitFor(() => {
      const calls = capturedFetchCalls();
      expect(calls.length).toBeGreaterThan(0);
    });

    const calls = capturedFetchCalls();
    const [_url, init] = calls[0]!;
    const headers = (init?.headers ?? {}) as Record<string, string>;
    expect(headers["x-library-owner-token"]).toBe("my-secret-token");
  });

  it("also accepts the library.ownerToken key in localStorage", async () => {
    localStorage.setItem("library.ownerToken", "library-scoped-token");

    stubFetch(() =>
      makeResponse(200, {
        threads: [],
        accountStatuses: { "acc-pj-main": "ok" },
      }),
    );

    render(<MorningTriage />);

    await waitFor(() => {
      expect(capturedFetchCalls().length).toBeGreaterThan(0);
    });

    const [_url, init] = capturedFetchCalls()[0]!;
    const headers = (init?.headers ?? {}) as Record<string, string>;
    expect(headers["x-library-owner-token"]).toBe("library-scoped-token");
  });

  it("renders thread subjects when the server returns a 200 with threads", async () => {
    localStorage.setItem("ownerToken", "my-secret-token");

    stubFetch(() =>
      makeResponse(200, {
        threads: [
          {
            id: "t1",
            subject: "Quarterly invoice from Brightside",
            from: "accounts@brightside.co",
            snippet: "Q2 invoice attached.",
            date: new Date().toISOString(),
            accountId: "acc-pj-main",
            accountLabel: "PJ Main",
          },
          {
            id: "t2",
            subject: "CRA notice — action required",
            from: "noreply@cra.gc.ca",
            snippet: "Please review your filing.",
            date: new Date().toISOString(),
            accountId: "acc-pj-main",
            accountLabel: "PJ Main",
          },
        ],
        accountStatuses: { "acc-pj-main": "ok" },
      }),
    );

    render(<MorningTriage alwaysExpanded />);

    await waitFor(() => {
      expect(screen.getByText("Quarterly invoice from Brightside")).toBeInTheDocument();
    });
    expect(screen.getByText("CRA notice — action required")).toBeInTheDocument();
  });

  it("hits the /api/inbox/threads/all endpoint with the correct accountIds param", async () => {
    localStorage.setItem("ownerToken", "tok");

    stubFetch(() =>
      makeResponse(200, { threads: [], accountStatuses: { "acc-pj-main": "ok" } }),
    );

    render(<MorningTriage />);

    await waitFor(() => {
      expect(capturedFetchCalls().length).toBeGreaterThan(0);
    });

    const [[url]] = capturedFetchCalls();
    expect(url).toMatch(/\/api\/inbox\/threads\/all/);
    expect(url).toMatch(/accountIds=acc-pj-main/);
  });
});

// ── Tests: unauthorized (no token) ───────────────────────────────────────────

describe("MorningTriage — unauthorized (no ownerToken in localStorage)", () => {
  it("calls fetch without the x-library-owner-token header when no token is stored", async () => {
    stubFetch(() => makeResponse(401, { error: "Unauthorized" }));

    render(<MorningTriage />);

    await waitFor(() => {
      expect(capturedFetchCalls().length).toBeGreaterThan(0);
    });

    const [_url, init] = capturedFetchCalls()[0]!;
    const headers = (init?.headers ?? {}) as Record<string, string>;
    expect(headers["x-library-owner-token"]).toBeUndefined();
  });

  it("does not crash or throw when the server returns 401", async () => {
    stubFetch(() => makeResponse(401, { error: "Unauthorized" }));

    expect(() => render(<MorningTriage />)).not.toThrow();

    await waitFor(() => {
      expect(capturedFetchCalls().length).toBeGreaterThan(0);
    });
  });

  it("shows a visible 'Not authorised' error instead of a blank panel when 401 is received", async () => {
    stubFetch(() => makeResponse(401, { error: "Unauthorized" }));

    render(<MorningTriage />);

    await waitFor(() => {
      expect(screen.getByText(/Not authorised/i)).toBeInTheDocument();
    });
  });
});

// ── Tests: Gmail scope error (403) ───────────────────────────────────────────

describe("MorningTriage — Gmail scope error (403 from backend)", () => {
  it("shows a human-readable scope-error message instead of crashing", async () => {
    localStorage.setItem("ownerToken", "valid-token");
    stubFetch(() => makeResponse(403, { error: "insufficient_scope" }));

    render(<MorningTriage />);

    await waitFor(() => {
      expect(screen.getByText(/Gmail read access needed/i)).toBeInTheDocument();
    });
  });
});
