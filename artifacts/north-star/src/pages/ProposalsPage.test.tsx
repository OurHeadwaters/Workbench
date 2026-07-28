/**
 * ProposalsPage.test.tsx
 *
 * Verifies the owner-token permission gate on the Proposals page:
 * - No token → "Owner token required" notice is shown, Accept/Reject buttons absent
 * - Valid token → Accept and Reject buttons are rendered for pending proposals
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// ---------------------------------------------------------------------------
// Store mock — provide a minimal set of state fields the component reads
// ---------------------------------------------------------------------------

const mockAcceptProposal = vi.fn();
const mockRejectProposal = vi.fn();

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
