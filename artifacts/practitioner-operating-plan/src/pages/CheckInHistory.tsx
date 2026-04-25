import { useMemo } from "react";
import { Link } from "wouter";
import { useAppState, useAppStateActions } from "../lib/storage";
import {
  formatTimestamp,
  formatUsd,
  formatXrpPrice,
  formatInteger,
} from "../lib/format";
import {
  getPlanForYear,
  paceFromRatio,
  paceLabel,
  type PaceColor,
} from "../lib/planCurve";

const PACE_BG: Record<PaceColor, string> = {
  green: "bg-emerald-100 text-emerald-900 border-emerald-300",
  yellow: "bg-amber-100 text-amber-900 border-amber-300",
  red: "bg-rose-100 text-rose-900 border-rose-300",
};

export default function CheckInHistory() {
  const state = useAppState();
  const { deleteSnapshot } = useAppStateActions();
  const sorted = useMemo(
    () =>
      [...state.snapshots].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      ),
    [state.snapshots],
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-stone-500">
            Year · Annual check-in
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
            Snapshot history
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            href="/year/check-in"
            className="rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100"
          >
            Dashboard
          </Link>
          <Link
            href="/year/check-in/new"
            className="rounded-md border border-stone-700 bg-stone-900 px-3 py-1.5 text-sm text-stone-50 hover:bg-stone-800"
          >
            New snapshot
          </Link>
        </div>
      </header>

      {sorted.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-600">
          No snapshots saved yet.
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((snap) => {
            const plan = getPlanForYear(snap.year);
            const ratio = plan
              ? snap.portfolioValue / plan.portfolioTarget
              : 1;
            const color: PaceColor = plan ? paceFromRatio(ratio) : "green";
            const xrpValue = snap.xrpBalance * snap.xrpPriceUsd;
            return (
              <article
                key={snap.id}
                className="rounded-lg border border-stone-200 bg-white p-5"
                data-testid={`row-history-${snap.year}`}
              >
                <header className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-stone-900">
                      {snap.year}
                    </h2>
                    <p className="text-xs text-stone-500">
                      Captured {formatTimestamp(snap.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${PACE_BG[color]}`}
                  >
                    {paceLabel(color)}
                  </span>
                </header>
                <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                  <Stat
                    label="Portfolio"
                    value={formatUsd(snap.portfolioValue)}
                  />
                  <Stat
                    label="Watershed ARR"
                    value={formatUsd(snap.watershedArr)}
                  />
                  <Stat
                    label="Owner take-home"
                    value={formatUsd(snap.ownerTakeHome)}
                  />
                  <Stat
                    label="Living expenses"
                    value={formatUsd(snap.annualLivingExpenses)}
                  />
                  <Stat
                    label="XRP value"
                    value={`${formatUsd(xrpValue)} (${formatInteger(
                      snap.xrpBalance,
                    )} × ${formatXrpPrice(snap.xrpPriceUsd)})`}
                  />
                </dl>
                {snap.notes && (
                  <p className="mt-4 whitespace-pre-line border-t border-stone-200 pt-4 text-sm text-stone-700">
                    {snap.notes}
                  </p>
                )}
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Delete this snapshot? This cannot be undone.",
                        )
                      ) {
                        deleteSnapshot(snap.id);
                      }
                    }}
                    className="text-xs text-stone-500 hover:text-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-stone-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-stone-900">{value}</dd>
    </div>
  );
}
