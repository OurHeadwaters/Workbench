// Cost Review walkthrough — one entry at a time, plus a filterable summary.

import { useEffect, useMemo, useState } from "react";

import {
  COST_REGISTRY,
  type CostEntry,
  formatCostValue,
} from "../data/costRegistry";
import {
  findNextUnreviewedIndex,
  useCostReview,
  useCostReviewActions,
  useCostReviewMap,
  useCostReviewSummary,
  type CostReviewStatus,
} from "../lib/costReview";
import { getLiveCostValue, useLiveCostValue } from "../lib/budgetMath";
import { useAppState } from "../lib/storage";

type Props = {
  open: boolean;
  onClose: () => void;
  startInSummary?: boolean;
};

type Mode = "walkthrough" | "summary";
type SummaryFilter = "all" | "unreviewed" | "approved" | "edited" | "skipped";

const STATUS_COLORS: Record<CostReviewStatus, string> = {
  approved: "bg-emerald-100 text-emerald-900 border-emerald-300",
  edited: "bg-amber-100 text-amber-900 border-amber-300",
  skipped: "bg-stone-100 text-stone-700 border-stone-300",
};

const STATUS_LABELS: Record<CostReviewStatus, string> = {
  approved: "Approved",
  edited: "Edited",
  skipped: "Skipped",
};

export function CostReviewModal({ open, onClose, startInSummary }: Props) {
  const map = useCostReviewMap();
  const summary = useCostReviewSummary();
  const { approve, edit, skip, setNote, reset, resetAll } =
    useCostReviewActions();

  const [mode, setMode] = useState<Mode>(
    startInSummary ? "summary" : "walkthrough",
  );
  const [index, setIndex] = useState<number>(() => {
    const next = findNextUnreviewedIndex(map);
    return next === -1 ? 0 : next;
  });
  const [editingValue, setEditingValue] = useState<string>("");
  const [editingNote, setEditingNote] = useState<string>("");
  const [filter, setFilter] = useState<SummaryFilter>("all");

  // On open: anchor on the first unreviewed entry.
  useEffect(() => {
    if (!open) return;
    setMode(startInSummary ? "summary" : "walkthrough");
    const next = findNextUnreviewedIndex(map);
    setIndex(next === -1 ? 0 : next);
    // map is intentionally only consulted on open, not on every change —
    // that's what makes Approve advance the cursor predictably.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, startInSummary]);

  // Sync editable buffers when cursor changes.
  const current: CostEntry | undefined = COST_REGISTRY[index];
  const liveValue = useLiveCostValue(current?.id ?? "");
  useEffect(() => {
    if (!current) return;
    const review = map[current.id];
    setEditingValue(
      review?.status === "edited" && typeof review.editedValue === "number"
        ? String(review.editedValue)
        : String(current.defaultValue),
    );
    setEditingNote(review?.note ?? "");
    // intentionally only re-sync when the cursor moves
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const advance = () => {
    if (index < COST_REGISTRY.length - 1) {
      setIndex(index + 1);
    } else {
      setMode("summary");
    }
  };

  const handleApprove = () => {
    if (!current) return;
    if (editingNote !== (map[current.id]?.note ?? "")) {
      setNote(current, editingNote);
    }
    approve(current);
    advance();
  };

  const handleEdit = () => {
    if (!current) return;
    const parsed = Number(editingValue);
    if (!Number.isFinite(parsed)) return;
    if (editingNote !== (map[current.id]?.note ?? "")) {
      setNote(current, editingNote);
    }
    edit(current, parsed);
    advance();
  };

  const handleSkip = () => {
    if (!current) return;
    if (editingNote !== (map[current.id]?.note ?? "")) {
      setNote(current, editingNote);
    }
    skip(current);
    advance();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-stone-50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Cost review walkthrough"
      >
        <header className="flex items-center justify-between border-b border-stone-200 bg-white px-5 py-3">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display text-lg font-semibold text-stone-900">
              Cost review
            </h2>
            <p className="text-xs uppercase tracking-widest text-stone-500">
              {summary.approved + summary.edited + summary.skipped} of{" "}
              {summary.total} reviewed
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setMode(mode === "summary" ? "walkthrough" : "summary")
              }
              className="rounded-md border border-stone-300 px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-100"
            >
              {mode === "summary" ? "Back to walkthrough" : "Summary"}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-md p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {mode === "walkthrough" && current && (
            <WalkthroughBody
              entry={current}
              indexOneBased={index + 1}
              total={COST_REGISTRY.length}
              status={map[current.id]?.status}
              editingValue={editingValue}
              setEditingValue={setEditingValue}
              editingNote={editingNote}
              setEditingNote={setEditingNote}
              onPrev={() => setIndex(Math.max(0, index - 1))}
              onNext={() => setIndex(Math.min(COST_REGISTRY.length - 1, index + 1))}
              hasPrev={index > 0}
              hasNext={index < COST_REGISTRY.length - 1}
              isEdited={(() => {
                const r = map[current.id];
                if (r?.status !== "edited") return false;
                const parsed = Number(editingValue);
                return Number.isFinite(parsed) && parsed !== current.defaultValue;
              })()}
              isDirtyValue={Number(editingValue) !== current.defaultValue}
              onReset={() => reset(current)}
              derived={current.derived === true}
              liveValue={liveValue}
              onNoteBlur={() => {
                // Autosave the note when focus leaves the textarea so a
                // thought captured mid-walkthrough is never lost — even if
                // the founder closes the modal or jumps away with Prev/Next
                // instead of clicking Approve / Save edit / Skip.
                if (editingNote !== (map[current.id]?.note ?? "")) {
                  setNote(current, editingNote);
                }
              }}
            />
          )}
          {mode === "summary" && (
            <SummaryBody
              filter={filter}
              setFilter={setFilter}
              onJumpTo={(idx) => {
                setIndex(idx);
                setMode("walkthrough");
              }}
              onResetAll={() => {
                if (
                  typeof window !== "undefined" &&
                  window.confirm(
                    "Reset every cost-review verdict? Edits will revert to defaults on the slides.",
                  )
                ) {
                  resetAll();
                }
              }}
            />
          )}
        </div>

        {mode === "walkthrough" && current && (
          <footer className="border-t border-stone-200 bg-white px-5 py-3">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleSkip}
                className="rounded-md border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-100"
              >
                Skip
              </button>
              {!current.derived && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="rounded-md border border-amber-400 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-100"
                >
                  Save edit
                </button>
              )}
              <button
                type="button"
                onClick={handleApprove}
                className="rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
              >
                Approve
              </button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

function WalkthroughBody({
  entry,
  indexOneBased,
  total,
  status,
  editingValue,
  setEditingValue,
  editingNote,
  setEditingNote,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  isEdited,
  isDirtyValue,
  onReset,
  onNoteBlur,
  derived,
  liveValue,
}: {
  entry: CostEntry;
  indexOneBased: number;
  total: number;
  status?: CostReviewStatus;
  editingValue: string;
  setEditingValue: (s: string) => void;
  editingNote: string;
  setEditingNote: (s: string) => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  isEdited: boolean;
  isDirtyValue: boolean;
  onReset: () => void;
  onNoteBlur: () => void;
  derived: boolean;
  liveValue: number | null;
}) {
  // Derived: live roll-up. Edited: founder's override. Else: registry default.
  const review = useCostReview(entry.id);
  const effectiveValue =
    review?.status === "edited" && typeof review.editedValue === "number"
      ? review.editedValue
      : entry.defaultValue;
  const displayValue =
    derived && liveValue !== null ? liveValue : effectiveValue;
  return (
    <div className="space-y-4 px-5 py-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-stone-500">
            {entry.category}
          </p>
          <p className="mt-0.5 text-xs text-stone-500">
            {indexOneBased} of {total} · ordered by importance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={!hasPrev}
            className="rounded-md border border-stone-300 px-2 py-1 text-xs text-stone-700 hover:bg-stone-100 disabled:opacity-40"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            className="rounded-md border border-stone-300 px-2 py-1 text-xs text-stone-700 hover:bg-stone-100 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-display text-2xl font-semibold leading-tight text-stone-900">
          {entry.label}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-700">
          {entry.context}
        </p>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-stone-500">
              {derived ? "Live computed total" : "Current value"}
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold text-stone-900">
              {formatCostValue(displayValue, entry.unit)}
            </p>
          </div>
          {status && (
            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider ${STATUS_COLORS[status]}`}
            >
              {STATUS_LABELS[status]}
              {isEdited && status === "edited" && (
                <>
                  {" · now "}
                  <span className="font-mono">
                    {formatCostValue(Number(editingValue) || 0, entry.unit)}
                  </span>
                </>
              )}
            </span>
          )}
        </div>

        {derived ? (
          <div className="mt-4 rounded-md border border-dashed border-stone-300 bg-stone-50 px-3 py-2 text-xs leading-relaxed text-stone-600">
            This is a roll-up — it tracks the line items it sums. Approve if
            the total looks right; if not, jump to a line item from the
            summary view (or the slide list below) and edit it there.
            {status && (
              <button
                type="button"
                onClick={onReset}
                className="ml-2 rounded-md border border-stone-300 bg-white px-2 py-0.5 text-[11px] text-stone-700 hover:bg-stone-100"
                title="Clear this verdict — back to unreviewed."
              >
                Clear verdict
              </button>
            )}
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            <label className="block text-xs font-medium uppercase tracking-widest text-stone-500">
              Edit value ({entry.unit})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                className="flex-1 rounded-md border border-stone-300 bg-white px-3 py-2 font-mono text-base text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                step="any"
              />
              {isDirtyValue && (
                <button
                  type="button"
                  onClick={() => setEditingValue(String(entry.defaultValue))}
                  className="rounded-md border border-stone-300 px-2 py-1.5 text-xs text-stone-700 hover:bg-stone-100"
                >
                  Revert input
                </button>
              )}
              {status && (
                <button
                  type="button"
                  onClick={onReset}
                  className="rounded-md border border-stone-300 px-2 py-1.5 text-xs text-stone-700 hover:bg-stone-100"
                  title="Clear this verdict — back to unreviewed."
                >
                  Clear verdict
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 space-y-2">
          <label className="block text-xs font-medium uppercase tracking-widest text-stone-500">
            Private notes
          </label>
          <textarea
            value={editingNote}
            onChange={(e) => setEditingNote(e.target.value)}
            onBlur={onNoteBlur}
            rows={3}
            placeholder="Anything you want to remember about this number — never shown on a slide."
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>
      </div>

      {entry.slides.length > 0 && (
        <div className="rounded-lg border border-stone-200 bg-stone-100/60 p-3">
          <p className="text-[11px] font-medium uppercase tracking-widest text-stone-500">
            Appears on
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-2">
            {entry.slides.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-stone-300 bg-white px-2 py-1 text-xs text-stone-700 hover:bg-stone-50"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SummaryBody({
  filter,
  setFilter,
  onJumpTo,
  onResetAll,
}: {
  filter: SummaryFilter;
  setFilter: (f: SummaryFilter) => void;
  onJumpTo: (idx: number) => void;
  onResetAll: () => void;
}) {
  const map = useCostReviewMap();
  const summary = useCostReviewSummary();
  const appState = useAppState();

  const rows = useMemo(() => {
    return COST_REGISTRY.map((entry, idx) => {
      const review = map[entry.id];
      const status: SummaryFilter =
        review?.status === "approved"
          ? "approved"
          : review?.status === "edited"
            ? "edited"
            : review?.status === "skipped"
              ? "skipped"
              : "unreviewed";
      return { entry, idx, review, status };
    }).filter((r) => filter === "all" || r.status === filter);
  }, [map, filter]);

  const filterChips: Array<{ key: SummaryFilter; label: string; count: number }> = [
    { key: "all", label: "All", count: summary.total },
    { key: "unreviewed", label: "Untouched", count: summary.unreviewed },
    { key: "approved", label: "Approved", count: summary.approved },
    { key: "edited", label: "Edited", count: summary.edited },
    { key: "skipped", label: "Skipped", count: summary.skipped },
  ];

  return (
    <div className="space-y-3 px-5 py-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {filterChips.map((chip) => {
            const active = filter === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => setFilter(chip.key)}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                  active
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
                }`}
              >
                {chip.label}
                <span
                  className={`ml-1.5 font-mono text-[11px] ${
                    active ? "text-stone-300" : "text-stone-500"
                  }`}
                >
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onResetAll}
          className="rounded-md border border-stone-300 px-2 py-1 text-[11px] uppercase tracking-wider text-stone-600 hover:bg-stone-100"
        >
          Reset all
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-md border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">
          Nothing matches that filter.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-stone-200">
          <table className="w-full text-sm">
            <thead className="bg-stone-100 text-[11px] uppercase tracking-widest text-stone-500">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Cost line</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Current</th>
                <th className="px-3 py-2 text-right font-medium">Original</th>
                <th className="px-3 py-2 text-left font-medium">Note</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {rows.map(({ entry, idx, review, status }) => {
                const isEdited = review?.status === "edited";
                const liveDerived = entry.derived
                  ? getLiveCostValue(appState, entry.id)
                  : null;
                const currentValue =
                  liveDerived !== null
                    ? liveDerived
                    : isEdited && typeof review?.editedValue === "number"
                      ? review.editedValue
                      : entry.defaultValue;
                return (
                  <tr key={entry.id}>
                    <td className="px-3 py-2 align-top">
                      <div className="font-medium text-stone-900">
                        {entry.label}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {entry.category}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      {status === "unreviewed" ? (
                        <span className="text-xs text-stone-500">
                          Untouched
                        </span>
                      ) : (
                        <span
                          className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_COLORS[status as CostReviewStatus]}`}
                        >
                          {STATUS_LABELS[status as CostReviewStatus]}
                        </span>
                      )}
                    </td>
                    <td
                      className={`px-3 py-2 text-right align-top font-mono ${
                        isEdited ? "text-stone-900 font-semibold" : "text-stone-700"
                      }`}
                    >
                      {formatCostValue(currentValue, entry.unit)}
                    </td>
                    <td className="px-3 py-2 text-right align-top font-mono text-stone-400">
                      {isEdited ? (
                        <span
                          className="line-through"
                          title="Registry default — overridden by your edit"
                        >
                          {formatCostValue(entry.defaultValue, entry.unit)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="max-w-[18ch] px-3 py-2 align-top text-xs text-stone-600">
                      {review?.note ? (
                        <span title={review.note}>
                          {review.note.length > 60
                            ? review.note.slice(0, 60) + "…"
                            : review.note}
                        </span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right align-top">
                      <button
                        type="button"
                        onClick={() => onJumpTo(idx)}
                        className="rounded-md border border-stone-300 px-2 py-1 text-[11px] text-stone-700 hover:bg-stone-100"
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
