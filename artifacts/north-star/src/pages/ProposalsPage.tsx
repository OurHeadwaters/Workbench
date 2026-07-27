/**
 * ProposalsPage — list of agent improvement proposals grouped by status.
 *
 * - Pending proposals show Accept / Reject buttons (owner-only)
 * - Accepted/rejected proposals are shown in a collapsed history section
 * - Accepting requires owner-token confirmation (the token must be present in
 *   localStorage — the same gate used everywhere in North Star)
 *
 * PERMISSION MODEL: agents may propose; only the human operator (owner token)
 * may accept. This page enforces that at the UI layer.
 */

import { useState } from "react";
import { useStore } from "@/store";
import { BG, SURFACE, BORDER, BORDER_STRONG, TEXT, TEXT_2, AMBER, FONT_DISPLAY } from "@/lib/theme";

function getOwnerToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem("library.ownerToken") ||
    window.localStorage.getItem("ownerToken") ||
    null
  );
}

const ROLE_LABELS: Record<string, string> = {
  "river-smith": "River Smith",
  "critical-challenger": "Critical Challenger",
  "r-and-d": "R&D Lead",
  ops: "Stability & Ops",
};

const ROLE_ICONS: Record<string, string> = {
  "river-smith": "🌊",
  "critical-challenger": "⚡",
  "r-and-d": "🔬",
  ops: "⚙️",
};

const STATUS_STYLES = {
  proposed: { label: "Pending", color: "#C5A96A", bg: "rgba(197,169,106,0.08)", border: "rgba(197,169,106,0.25)" },
  accepted: { label: "Accepted", color: "#4A8A7C", bg: "rgba(74,138,124,0.08)", border: "rgba(74,138,124,0.25)" },
  rejected: { label: "Rejected", color: "#7A4A3A", bg: "rgba(122,74,58,0.08)", border: "rgba(122,74,58,0.25)" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ProposalsPage() {
  const proposals = useStore((s) => s.improvementProposals);
  const acceptProposal = useStore((s) => s.acceptProposal);
  const rejectProposal = useStore((s) => s.rejectProposal);

  const token = getOwnerToken();
  const isOwner = !!token;

  const [historyOpen, setHistoryOpen] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<"accept" | "reject" | null>(null);

  const pending = proposals.filter((p) => p.status === "proposed");
  const resolved = proposals.filter((p) => p.status !== "proposed");

  const startConfirm = (id: string, action: "accept" | "reject") => {
    setConfirmingId(id);
    setConfirmAction(action);
  };

  const cancelConfirm = () => {
    setConfirmingId(null);
    setConfirmAction(null);
  };

  const executeConfirm = () => {
    if (!confirmingId || !confirmAction) return;
    if (confirmAction === "accept") acceptProposal(confirmingId);
    else rejectProposal(confirmingId);
    setConfirmingId(null);
    setConfirmAction(null);
  };

  return (
    <div
      className="min-h-dvh pb-28"
      style={{ backgroundColor: BG }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-5 pt-safe-top pb-4 pt-12"
        style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}
      >
        <h1
          className="text-2xl font-semibold mb-1"
          style={{ color: TEXT, fontFamily: FONT_DISPLAY }}
        >
          Improvement Proposals
        </h1>
        <p className="text-sm" style={{ color: TEXT_2 }}>
          Agents propose · only you accept
        </p>
      </div>

      <div className="px-4 py-5 max-w-2xl mx-auto space-y-4">
        {/* Empty state */}
        {proposals.length === 0 && (
          <div
            className="rounded-xl px-5 py-10 text-center"
            style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <p className="text-2xl mb-3">💡</p>
            <p className="text-sm font-medium mb-1" style={{ color: TEXT }}>
              No proposals yet
            </p>
            <p className="text-sm leading-relaxed" style={{ color: TEXT_2 }}>
              River Smith can propose improvements from the briefing panel.
              They'll appear here for your review.
            </p>
          </div>
        )}

        {/* Pending proposals */}
        {pending.length > 0 && (
          <section>
            <h2
              className="text-xs uppercase tracking-widest font-bold mb-3 px-1"
              style={{ color: TEXT_2 }}
            >
              Pending Review · {pending.length}
            </h2>
            <div className="space-y-3">
              {pending.map((p) => {
                const isConfirming = confirmingId === p.id;
                return (
                  <div
                    key={p.id}
                    className="rounded-xl overflow-hidden"
                    style={{
                      backgroundColor: SURFACE,
                      border: `1px solid ${BORDER_STRONG}`,
                    }}
                  >
                    {/* Proposal header */}
                    <div className="px-5 pt-4 pb-3">
                      <div className="flex items-start gap-3">
                        <span className="text-xl flex-shrink-0 mt-0.5">
                          {ROLE_ICONS[p.agent_role] ?? "🤖"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span
                              className="text-[11px] uppercase tracking-[0.12em] font-bold"
                              style={{ color: AMBER }}
                            >
                              {ROLE_LABELS[p.agent_role] ?? p.agent_role}
                            </span>
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded"
                              style={{
                                color: STATUS_STYLES.proposed.color,
                                backgroundColor: STATUS_STYLES.proposed.bg,
                                border: `1px solid ${STATUS_STYLES.proposed.border}`,
                              }}
                            >
                              {STATUS_STYLES.proposed.label}
                            </span>
                          </div>
                          <h3
                            className="text-base font-semibold leading-snug mb-1"
                            style={{ color: TEXT }}
                          >
                            {p.title}
                          </h3>
                          <p
                            className="text-[11px] mb-2"
                            style={{ color: TEXT_2 }}
                          >
                            Affects: <span style={{ color: TEXT }}>{p.affected_surface}</span>
                          </p>
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: TEXT_2 }}
                          >
                            {p.description}
                          </p>
                          <p
                            className="text-[10px] mt-2"
                            style={{ color: "rgba(237,232,213,0.25)" }}
                          >
                            {formatDate(p.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action row */}
                    {isOwner && (
                      <div
                        className="px-5 py-3 flex items-center gap-2"
                        style={{ borderTop: `1px solid ${BORDER}` }}
                      >
                        {!isConfirming ? (
                          <>
                            <button
                              onClick={() => startConfirm(p.id, "accept")}
                              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              style={{
                                backgroundColor: "rgba(74,138,124,0.15)",
                                color: "#4A8A7C",
                                border: "1px solid rgba(74,138,124,0.3)",
                              }}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => startConfirm(p.id, "reject")}
                              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              style={{
                                backgroundColor: "rgba(122,74,58,0.10)",
                                color: "#8C4A3A",
                                border: "1px solid rgba(122,74,58,0.25)",
                              }}
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-3 w-full">
                            <p className="text-sm flex-1" style={{ color: TEXT_2 }}>
                              {confirmAction === "accept"
                                ? "Accept this proposal?"
                                : "Reject this proposal?"}
                            </p>
                            <button
                              onClick={executeConfirm}
                              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                              style={{
                                backgroundColor:
                                  confirmAction === "accept"
                                    ? "rgba(74,138,124,0.25)"
                                    : "rgba(122,74,58,0.25)",
                                color:
                                  confirmAction === "accept" ? "#4A8A7C" : "#8C4A3A",
                                border: `1px solid ${confirmAction === "accept" ? "rgba(74,138,124,0.4)" : "rgba(122,74,58,0.4)"}`,
                              }}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={cancelConfirm}
                              className="px-3 py-2 rounded-lg text-sm transition-colors"
                              style={{ color: TEXT_2 }}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Non-owner notice */}
                    {!isOwner && (
                      <div
                        className="px-5 py-2.5 text-xs"
                        style={{
                          color: TEXT_2,
                          borderTop: `1px solid ${BORDER}`,
                          backgroundColor: "rgba(0,0,0,0.15)",
                        }}
                      >
                        🔒 Owner token required to accept or reject
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Resolved history */}
        {resolved.length > 0 && (
          <section>
            <button
              onClick={() => setHistoryOpen((o) => !o)}
              className="w-full flex items-center justify-between px-1 py-2 mb-2"
            >
              <h2
                className="text-xs uppercase tracking-widest font-bold"
                style={{ color: TEXT_2 }}
              >
                History · {resolved.length}
              </h2>
              <span className="text-xs" style={{ color: TEXT_2 }}>
                {historyOpen ? "▲" : "▼"}
              </span>
            </button>

            {historyOpen && (
              <div className="space-y-2">
                {resolved
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.resolved_at ?? b.created_at).getTime() -
                      new Date(a.resolved_at ?? a.created_at).getTime(),
                  )
                  .map((p) => {
                    const st = STATUS_STYLES[p.status] ?? STATUS_STYLES.rejected;
                    return (
                      <div
                        key={p.id}
                        className="rounded-xl px-4 py-3"
                        style={{
                          backgroundColor: SURFACE,
                          border: `1px solid ${BORDER}`,
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-base flex-shrink-0 opacity-60 mt-0.5">
                            {ROLE_ICONS[p.agent_role] ?? "🤖"}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span
                                className="text-[11px] px-1.5 py-0.5 rounded"
                                style={{
                                  color: st.color,
                                  backgroundColor: st.bg,
                                  border: `1px solid ${st.border}`,
                                }}
                              >
                                {st.label}
                              </span>
                              <span
                                className="text-[10px] uppercase tracking-[0.10em]"
                                style={{ color: TEXT_2 }}
                              >
                                {ROLE_LABELS[p.agent_role] ?? p.agent_role}
                              </span>
                            </div>
                            <p
                              className="text-sm font-medium leading-snug"
                              style={{ color: TEXT }}
                            >
                              {p.title}
                            </p>
                            <p
                              className="text-[10px] mt-1"
                              style={{ color: "rgba(237,232,213,0.25)" }}
                            >
                              {p.resolved_at
                                ? formatDate(p.resolved_at)
                                : formatDate(p.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
