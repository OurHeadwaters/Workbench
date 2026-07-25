import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { TaskAutopilot } from "./TaskAutopilot";

function makeResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

const MOCK_PROPOSED_TASK = {
  id: "t1",
  title: "Fix invoice email template",
  status: "proposed" as const,
};

const MOCK_TRIAGE_GREEN: unknown = {
  tasks: [
    {
      ...MOCK_PROPOSED_TASK,
      tier: "GREEN",
      rule: "\\bfix\\b",
      reasoning: "Routine code fix — safe to clear.",
    },
  ],
  summary: { green: 1, amber: 0, red: 0, total: 1 },
  amberGroups: {},
};

const MOCK_TRIAGE_GREEN_PENDING: unknown = {
  tasks: [
    {
      ...MOCK_PROPOSED_TASK,
      tier: "GREEN",
      rule: "\\bfix\\b",
      reasoning: "Routine code fix — safe to clear.",
    },
  ],
  summary: { green: 1, amber: 0, red: 0, total: 1 },
  amberGroups: {},
};

type RouteMap = Record<string, unknown>;

function stubFetchWithRoutes(routes: RouteMap, defaultStatus = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string, init?: RequestInit) => {
      for (const [pattern, body] of Object.entries(routes)) {
        if (url.includes(pattern)) {
          const status = body === null ? 401 : defaultStatus;
          return Promise.resolve(makeResponse(body === null ? 401 : 200, body ?? {}));
        }
      }
      return Promise.resolve(makeResponse(defaultStatus, {}));
    }),
  );
}

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("ownerToken", "test-owner-token");
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("TaskAutopilot — approve endpoint 401 sets authBlocked (not silent)", () => {
  it("shows 'Not authorised' banner when the approve endpoint returns 401 (tableMode auto-approve)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/tasks/proposed"))
          return Promise.resolve(makeResponse(200, { tasks: [MOCK_PROPOSED_TASK] }));
        if (url.includes("/tasks/pending"))
          return Promise.resolve(makeResponse(200, { tasks: [] }));
        if (url.includes("/tasks/triage"))
          return Promise.resolve(makeResponse(200, MOCK_TRIAGE_GREEN));
        if (url.includes("/tasks/approve"))
          return Promise.resolve(makeResponse(401, { error: "Unauthorized" }));
        return Promise.resolve(makeResponse(200, {}));
      }),
    );

    render(<TaskAutopilot defaultOpen tableMode />);

    await waitFor(
      () => {
        expect(screen.getByText(/Not authorised/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it("shows 'Not authorised' banner when the approve endpoint returns 403 (tableMode auto-approve)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/tasks/proposed"))
          return Promise.resolve(makeResponse(200, { tasks: [MOCK_PROPOSED_TASK] }));
        if (url.includes("/tasks/pending"))
          return Promise.resolve(makeResponse(200, { tasks: [] }));
        if (url.includes("/tasks/triage"))
          return Promise.resolve(makeResponse(200, MOCK_TRIAGE_GREEN));
        if (url.includes("/tasks/approve"))
          return Promise.resolve(makeResponse(403, { error: "Forbidden" }));
        return Promise.resolve(makeResponse(200, {}));
      }),
    );

    render(<TaskAutopilot defaultOpen tableMode />);

    await waitFor(
      () => {
        expect(screen.getByText(/Not authorised/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it("does NOT show 'Not authorised' when approve returns 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/tasks/proposed"))
          return Promise.resolve(makeResponse(200, { tasks: [MOCK_PROPOSED_TASK] }));
        if (url.includes("/tasks/pending"))
          return Promise.resolve(makeResponse(200, { tasks: [] }));
        if (url.includes("/tasks/triage"))
          return Promise.resolve(makeResponse(200, MOCK_TRIAGE_GREEN));
        if (url.includes("/tasks/approve"))
          return Promise.resolve(makeResponse(200, { ok: true }));
        return Promise.resolve(makeResponse(200, {}));
      }),
    );

    render(<TaskAutopilot defaultOpen tableMode />);

    await new Promise((r) => setTimeout(r, 300));

    expect(screen.queryByText(/Not authorised/i)).not.toBeInTheDocument();
  });
});

describe("TaskAutopilot — unapprove endpoint 401 sets authBlocked (not silent)", () => {
  it("shows 'Not authorised' banner when the Undo (unapprove) button is clicked and endpoint returns 401", async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/tasks/proposed"))
          return Promise.resolve(makeResponse(200, { tasks: [MOCK_PROPOSED_TASK] }));
        if (url.includes("/tasks/pending"))
          return Promise.resolve(makeResponse(200, { tasks: [MOCK_PROPOSED_TASK] }));
        if (url.includes("/tasks/triage"))
          return Promise.resolve(makeResponse(200, MOCK_TRIAGE_GREEN_PENDING));
        if (url.includes("/tasks/unapprove"))
          return Promise.resolve(makeResponse(401, { error: "Unauthorized" }));
        if (url.includes("/tasks/approve"))
          return Promise.resolve(makeResponse(200, { ok: true }));
        return Promise.resolve(makeResponse(200, {}));
      }),
    );

    // Use non-tableMode: tableMode hides the TierSection (shows "council auto-approved" summary
    // instead), so the Undo/Preview/Run buttons only appear in the standard TierSection.
    render(<TaskAutopilot defaultOpen />);

    // Click the specific "Triage N tasks" toolbar button (not the secondary "Triage now" button).
    const triageBtn = await screen.findByRole("button", { name: /triage \d/i }, { timeout: 5000 });
    await user.click(triageBtn);

    // After triage, t1 is GREEN and already in pendingIds → allGreenPending=true → "Undo" shows.
    const undoButton = await screen.findByRole("button", { name: /undo/i }, { timeout: 5000 });
    await user.click(undoButton);

    await waitFor(
      () => {
        expect(screen.getByText(/Not authorised/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });
});

describe("TaskAutopilot — dryRun endpoint 401 sets authBlocked (not silent)", () => {
  it("shows 'Not authorised' banner when the Preview (dryRun) button is clicked and approve returns 401", async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/tasks/proposed"))
          return Promise.resolve(makeResponse(200, { tasks: [MOCK_PROPOSED_TASK] }));
        if (url.includes("/tasks/pending"))
          return Promise.resolve(makeResponse(200, { tasks: [] }));
        if (url.includes("/tasks/triage"))
          return Promise.resolve(makeResponse(200, MOCK_TRIAGE_GREEN));
        if (url.includes("/tasks/approve"))
          return Promise.resolve(makeResponse(401, { error: "Unauthorized" }));
        return Promise.resolve(makeResponse(200, {}));
      }),
    );

    render(<TaskAutopilot defaultOpen tableMode />);

    await waitFor(
      () => {
        expect(screen.getByText(/Not authorised/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it("shows 'Not authorised' when Preview is clicked and dryRun approve returns 401 (non-tableMode)", async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/tasks/proposed"))
          return Promise.resolve(makeResponse(200, { tasks: [MOCK_PROPOSED_TASK] }));
        if (url.includes("/tasks/pending"))
          return Promise.resolve(makeResponse(200, { tasks: [] }));
        if (url.includes("/tasks/triage"))
          return Promise.resolve(makeResponse(200, MOCK_TRIAGE_GREEN));
        if (url.includes("/tasks/approve"))
          return Promise.resolve(makeResponse(401, { error: "Unauthorized" }));
        return Promise.resolve(makeResponse(200, {}));
      }),
    );

    // Use non-tableMode so the full TierSection (with Preview/Run/Undo buttons) renders.
    render(<TaskAutopilot defaultOpen />);

    // "Triage N tasks" is the specific toolbar button — not the secondary "Triage now" link.
    const triageButton = await screen.findByRole("button", { name: /triage \d/i }, { timeout: 3000 });
    await user.click(triageButton);

    const previewButton = await screen.findByRole("button", { name: /preview/i }, { timeout: 3000 });
    await user.click(previewButton);

    await waitFor(
      () => {
        expect(screen.getByText(/Not authorised/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });
});
