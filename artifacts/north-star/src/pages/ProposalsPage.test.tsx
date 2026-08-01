/**
 * ProposalsPage.test.tsx
 *
 * Verifies the owner-token permission gate on the Proposals page:
 * - No token → "Owner token required" notice is shown, Accept/Reject buttons absent
 * - Valid token → Accept and Reject buttons are rendered for pending proposals
 *
 * Also verifies the two-click confirm guard:
 * - Clicking Accept opens the confirm dialog but does NOT call acceptProposal
 * - Clicking Confirm after Accept calls acceptProposal exactly once
 * - Clicking Cancel after Accept leaves the proposal untouched
 *
 * Also verifies error-notice dismissal on retry:
 * - After a failed accept (401) the error notice appears
 * - Clicking Confirm a second time clears the stale error notice before the new request
 * - After the successful retry the proposal is marked accepted and the notice is gone
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// ---------------------------------------------------------------------------
// Store mock — provide a minimal set of state fields the component reads
// ---------------------------------------------------------------------------

const mockAcceptProposal = vi.fn().mockResolvedValue({ ok: true });
const mockRejectProposal = vi.fn().mockResolvedValue({ ok: true });

const PENDING_PROPOSAL = {
  id: "prop-test-1",
  agent_role: "river-smith",
  title: "Improve the morning manifest",
  description: "Add a sunrise photo to the manifest to set the tone.",
  affected_surface: "Morning Manifest",
  status: "proposed" as const,
  created_at: new Date().toISOString(),
};

const mockStoreState = {
  improvementProposals: [PENDING_PROPOSAL],
  acceptProposal: mockAcceptProposal,
  rejectProposal: mockRejectProposal,
};

vi.mock("@/store", () => ({
  useStore: (selector: (s: typeof mockStoreState) => unknown) =>
    selector(mockStoreState),
}));

import { ProposalsPage } from "./ProposalsPage";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

beforeEach(() => {
  localStorage.clear();
  mockAcceptProposal.mockClear();
  mockRejectProposal.mockClear();
});

afterEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// No token — non-owner view
// ---------------------------------------------------------------------------

describe("ProposalsPage — no owner token", () => {
  it("shows the 'Owner token required' notice for each pending proposal", () => {
    // localStorage is empty — no token
    render(<ProposalsPage />);

    // The notice appears once per pending proposal card
    const notices = screen.getAllByText(/owner token required/i);
    expect(notices.length).toBeGreaterThanOrEqual(1);
  });

  it("does NOT render an Accept button when no token is present", () => {
    render(<ProposalsPage />);

    expect(screen.queryByRole("button", { name: /accept/i })).not.toBeInTheDocument();
  });

  it("does NOT render a Reject button when no token is present", () => {
    render(<ProposalsPage />);

    expect(screen.queryByRole("button", { name: /reject/i })).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Valid token — owner view
// ---------------------------------------------------------------------------

describe("ProposalsPage — valid owner token present", () => {
  beforeEach(() => {
    localStorage.setItem("ownerToken", "test-owner-token-abc");
  });

  it("renders an Accept button for the pending proposal", () => {
    render(<ProposalsPage />);

    expect(screen.getByRole("button", { name: /accept/i })).toBeInTheDocument();
  });

  it("renders a Reject button for the pending proposal", () => {
    render(<ProposalsPage />);

    expect(screen.getByRole("button", { name: /reject/i })).toBeInTheDocument();
  });

  it("does NOT show the 'Owner token required' notice when a token is present", () => {
    render(<ProposalsPage />);

    expect(screen.queryByText(/owner token required/i)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Alternative token key — library.ownerToken
// ---------------------------------------------------------------------------

describe("ProposalsPage — library.ownerToken key", () => {
  beforeEach(() => {
    localStorage.setItem("library.ownerToken", "lib-owner-token-xyz");
  });

  it("also grants owner access via the library.ownerToken key", () => {
    render(<ProposalsPage />);

    expect(screen.getByRole("button", { name: /accept/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reject/i })).toBeInTheDocument();
    expect(screen.queryByText(/owner token required/i)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Two-click confirm guard
// ---------------------------------------------------------------------------

describe("ProposalsPage — two-click confirm guard for Accept", () => {
  beforeEach(() => {
    localStorage.setItem("ownerToken", "test-owner-token-abc");
  });

  it("clicking Accept does NOT call acceptProposal (opens confirm dialog instead)", async () => {
    const user = userEvent.setup();
    render(<ProposalsPage />);

    await user.click(screen.getByRole("button", { name: /^accept$/i }));

    // acceptProposal must not have been called
    expect(mockAcceptProposal).not.toHaveBeenCalled();

    // The confirm dialog should now be visible
    expect(screen.getByRole("button", { name: /confirm/i })).toBeInTheDocument();
  });

  it("clicking Confirm after Accept calls acceptProposal exactly once", async () => {
    const user = userEvent.setup();
    render(<ProposalsPage />);

    await user.click(screen.getByRole("button", { name: /^accept$/i }));
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    expect(mockAcceptProposal).toHaveBeenCalledTimes(1);
    expect(mockAcceptProposal).toHaveBeenCalledWith(PENDING_PROPOSAL.id);
  });

  it("clicking Cancel after Accept leaves the proposal in 'proposed' state (acceptProposal not called)", async () => {
    const user = userEvent.setup();
    render(<ProposalsPage />);

    await user.click(screen.getByRole("button", { name: /^accept$/i }));
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    // acceptProposal must still not have been called
    expect(mockAcceptProposal).not.toHaveBeenCalled();

    // Confirm dialog should be dismissed; Accept button should be back
    expect(screen.getByRole("button", { name: /^accept$/i })).toBeInTheDocument();
  });

  it("clears the error notice when the owner retries after a failed accept", async () => {
    // First call returns 401-style failure; second call succeeds
    mockAcceptProposal
      .mockResolvedValueOnce({ ok: false, error: "Unauthorized (401)" })
      .mockResolvedValueOnce({ ok: true });

    const user = userEvent.setup();
    render(<ProposalsPage />);

    // Open the confirm dialog and attempt the first (failing) accept
    await user.click(screen.getByRole("button", { name: /^accept$/i }));
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    // The error alert must appear after the 401 response
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/unauthorized/i)).toBeInTheDocument();

    // Retry — the Confirm button remains visible after a failure
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    // Error notice must be gone after the successful retry
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    // acceptProposal was called twice in total (one failure + one success)
    expect(mockAcceptProposal).toHaveBeenCalledTimes(2);
    expect(mockAcceptProposal).toHaveBeenCalledWith(PENDING_PROPOSAL.id);
  });
});

// ---------------------------------------------------------------------------
// Already-resolved guard — real store logic
// ---------------------------------------------------------------------------

describe("acceptProposal — already-resolved guard", () => {
  const REJECTED_ID = "prop-already-rejected";

  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("returns { ok: false } without a network call when the proposal is already rejected", async () => {
    // Import the real store module, bypassing the vi.mock at the top of this file.
    const { useStore } = await vi.importActual<typeof import("@/store")>("@/store");

    // Seed a rejected proposal directly into the store.
    useStore.setState((s) => ({
      improvementProposals: [
        {
          id: REJECTED_ID,
          agent_role: "river-smith",
          title: "Already rejected proposal",
          description: "This was rejected before.",
          affected_surface: "Morning Manifest",
          status: "rejected" as const,
          created_at: new Date().toISOString(),
          resolved_at: new Date().toISOString(),
        },
        ...s.improvementProposals,
      ],
    }));

    // Call acceptProposal on the already-rejected proposal.
    const result = await useStore.getState().acceptProposal(REJECTED_ID);

    // The guard must return { ok: false } — no server round-trip.
    expect(result.ok).toBe(false);
    expect((result as { ok: false; error: string }).error).toMatch(/already resolved/i);
    expect(fetchSpy).not.toHaveBeenCalled();

    // The proposal status must still be 'rejected', not 'accepted'.
    const proposal = useStore
      .getState()
      .improvementProposals.find((p) => p.id === REJECTED_ID);
    expect(proposal?.status).toBe("rejected");

    // Cleanup — remove the seeded proposal so it doesn't bleed into other tests.
    useStore.setState((s) => ({
      improvementProposals: s.improvementProposals.filter((p) => p.id !== REJECTED_ID),
    }));
  });
});
