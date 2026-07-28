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
});
