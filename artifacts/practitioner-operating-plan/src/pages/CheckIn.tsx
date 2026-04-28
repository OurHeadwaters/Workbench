import { useMemo } from "react";
import { Link } from "wouter";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ASSUMED_REAL_RETURN,
  PLAN_CURVE,
  TARGET_PORTFOLIO_USD,
  TARGET_RETIRE_AGE,
  TARGET_RETIRE_DATE,
  getPlanForYear,
  paceFromRatio,
  paceLabel,
  projectPortfolioAtFifty,
  yearsToRetirement,
  type PaceColor,
} from "../lib/planCurve";
import {
  formatDate,
  formatInteger,
  formatPercent,
  formatTimestamp,
  formatUsd,
  formatUsdCompact,
  formatXrpPrice,
} from "../lib/format";
import { useAppState, type Snapshot } from "../lib/storage";

const PACE_BG: Record<PaceColor, string> = {
  green: "bg-emerald-100 text-emerald-900 border-emerald-300",
  yellow: "bg-amber-100 text-amber-900 border-amber-300",
  red: "bg-rose-100 text-rose-900 border-rose-300",
};

const PACE_DOT: Record<PaceColor, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-rose-500",
};

export default function CheckIn() {
  const state = useAppState();
  const sortedDescending = useMemo(
    () =>
      [...state.snapshots].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      ),
    [state.snapshots],
  );
  const latest: Snapshot | null = sortedDescending[0] ?? null;
  const snapshots = sortedDescending;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-stone-500">
          Year · Annual check-in
        </p>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
              Where do I stand?
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Tracking pace toward {formatUsdCompact(TARGET_PORTFOLIO_USD)} by{" "}
              {TARGET_RETIRE_DATE}.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/year/check-in/new"
              className="rounded-md border border-stone-700 bg-stone-900 px-3 py-1.5 text-sm text-stone-50 hover:bg-stone-800"
              data-testid="button-new-snapshot"
            >
              New snapshot
            </Link>
            <Link
              href="/year/check-in/history"
              className="rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100"
            >
              History
            </Link>
          </div>
        </div>
      </header>

      {!latest && (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-600">
          <p className="text-base font-medium text-stone-800">
            No snapshots yet.
          </p>
          <p className="mt-2">
            Once a year, sit down and fill in this year's snapshot. The
            dashboard will start telling you whether you're on pace.
          </p>
          <Link
            href="/year/check-in/new"
            className="mt-4 inline-block rounded-md border border-stone-700 bg-stone-900 px-4 py-2 text-sm text-stone-50 hover:bg-stone-800"
          >
            Take your first snapshot
          </Link>
        </div>
      )}

      {latest && (
        <>
          <RetirementOutlookPanel snapshot={latest} />
          <LatestSnapshotPanel snapshot={latest} />
          <PlanCurveCard snapshots={snapshots} />
          {snapshots.length > 0 && <RecentHistoryCard snapshots={snapshots} />}
        </>
      )}
    </div>
  );
}

function RetirementOutlookPanel({ snapshot }: { snapshot: Snapshot }) {
  const yearsLeft = yearsToRetirement(snapshot.year);
  const annualContribution = Math.max(
    0,
    snapshot.ownerTakeHome - snapshot.annualLivingExpenses,
  );
  const projection = projectPortfolioAtFifty({
    currentPortfolio: snapshot.portfolioValue,
    annualContribution,
    yearsRemaining: yearsLeft,
  });
  const projectionRatio =
    projection !== null ? projection / TARGET_PORTFOLIO_USD : 0;
  const projectionColor: PaceColor = paceFromRatio(projectionRatio);

  return (
    <div
      className="grid gap-4 md:grid-cols-2"
      data-testid="panel-retirement-outlook"
    >
      <InfoTile
        label={`Years to age ${TARGET_RETIRE_AGE}`}
        value={
          yearsLeft === 0
            ? "Plan complete"
            : yearsLeft === 1
              ? "1 year"
              : `${yearsLeft} years`
        }
        sub={`From ${snapshot.year} to ${snapshot.year + yearsLeft}`}
      />
      <ProjectionTile
        projection={projection}
        ratio={projectionRatio}
        color={projectionColor}
        annualContribution={annualContribution}
      />
    </div>
  );
}

function ProjectionTile({
  projection,
  ratio,
  color,
  annualContribution,
}: {
  projection: number | null;
  ratio: number;
  color: PaceColor;
  annualContribution: number;
}) {
  return (
    <div
      className="space-y-1.5 rounded-lg border border-stone-200 bg-white p-4"
      data-testid="tile-projection-at-fifty"
    >
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-stone-500">
          Projected at age {TARGET_RETIRE_AGE}
        </div>
        <span
          className={`inline-block h-2 w-2 rounded-full ${PACE_DOT[color]}`}
        />
      </div>
      <div className="text-2xl font-semibold tracking-tight text-stone-900">
        {projection === null ? "—" : formatUsd(Math.round(projection))}
      </div>
      <div className="text-xs text-stone-500">
        Holding {formatUsd(annualContribution)}/yr above living costs at{" "}
        {formatPercent(ASSUMED_REAL_RETURN, 0)} real ·{" "}
        {formatPercent(ratio, 0)} of {formatUsdCompact(TARGET_PORTFOLIO_USD)}{" "}
        target
      </div>
    </div>
  );
}

function LatestSnapshotPanel({ snapshot }: { snapshot: Snapshot }) {
  const plan = getPlanForYear(snapshot.year);
  const portfolioRatio = plan
    ? snapshot.portfolioValue / plan.portfolioTarget
    : 1;
  const arrRatio = plan ? snapshot.watershedArr / plan.arrTarget : 1;
  const takeHomeRatio = plan
    ? snapshot.ownerTakeHome / plan.takeHomeTarget
    : 1;

  const overallColor: PaceColor = paceFromRatio(portfolioRatio);

  const investingRate =
    snapshot.ownerTakeHome > 0
      ? Math.max(
          0,
          (snapshot.ownerTakeHome - snapshot.annualLivingExpenses) /
            snapshot.ownerTakeHome,
        )
      : 0;

  const xrpValue = snapshot.xrpBalance * snapshot.xrpPriceUsd;
  const xrpShareOfPortfolio =
    snapshot.portfolioValue > 0 ? xrpValue / snapshot.portfolioValue : 0;

  return (
    <section className="space-y-6 rounded-lg border border-stone-200 bg-white p-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
            {snapshot.year} snapshot
          </h2>
          <p className="text-xs text-stone-500">
            Recorded {formatDate(snapshot.createdAt)}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium ${PACE_BG[overallColor]}`}
          data-testid="badge-pace"
        >
          <span
            className={`mr-2 inline-block h-2 w-2 rounded-full ${PACE_DOT[overallColor]}`}
          />
          {paceLabel(overallColor)}
        </span>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <PaceTile
          label="Portfolio"
          actual={snapshot.portfolioValue}
          target={plan?.portfolioTarget ?? null}
          ratio={portfolioRatio}
        />
        <PaceTile
          label="Watershed ARR"
          actual={snapshot.watershedArr}
          target={plan?.arrTarget ?? null}
          ratio={arrRatio}
        />
        <PaceTile
          label="Owner take-home"
          actual={snapshot.ownerTakeHome}
          target={plan?.takeHomeTarget ?? null}
          ratio={takeHomeRatio}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoTile
          label="Investing rate"
          value={formatPercent(investingRate)}
          sub={
            plan
              ? `Plan target ${formatPercent(plan.targetAnnualInvestingRate)} · ${formatUsd(
                  snapshot.ownerTakeHome - snapshot.annualLivingExpenses,
                )} above living costs`
              : `${formatUsd(
                  snapshot.ownerTakeHome - snapshot.annualLivingExpenses,
                )} above living costs`
          }
        />
        <InfoTile
          label="Living expenses"
          value={formatUsd(snapshot.annualLivingExpenses)}
          sub={
            plan
              ? `Plan assumed ${formatUsd(plan.livingExpensesAssumed)}`
              : undefined
          }
        />
        <InfoTile
          label="XRP wildcard — not counted toward retirement target"
          value={formatUsd(xrpValue)}
          sub={`${formatInteger(snapshot.xrpBalance)} XRP × ${formatXrpPrice(
            snapshot.xrpPriceUsd,
          )} · ${formatPercent(xrpShareOfPortfolio, 1)} of portfolio`}
        />
      </div>

      {snapshot.notes && (
        <div className="rounded-md border border-stone-200 bg-stone-50/60 p-4">
          <div className="mb-1.5 text-xs uppercase tracking-wider text-stone-500">
            Notes
          </div>
          <p className="whitespace-pre-wrap text-sm text-stone-800">
            {snapshot.notes}
          </p>
        </div>
      )}
    </section>
  );
}

function PaceTile({
  label,
  actual,
  target,
  ratio,
}: {
  label: string;
  actual: number;
  target: number | null;
  ratio: number;
}) {
  const color: PaceColor = target ? paceFromRatio(ratio) : "green";
  return (
    <div className="space-y-1.5 rounded-lg border border-stone-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-stone-500">
          {label}
        </div>
        {target ? (
          <span
            className={`inline-block h-2 w-2 rounded-full ${PACE_DOT[color]}`}
          />
        ) : null}
      </div>
      <div className="text-2xl font-semibold tracking-tight text-stone-900">
        {formatUsd(actual)}
      </div>
      {target ? (
        <div className="text-xs text-stone-500">
          Target {formatUsd(target)} · {formatPercent(ratio, 0)} of plan
        </div>
      ) : (
        <div className="text-xs text-stone-500">No plan target</div>
      )}
    </div>
  );
}

function InfoTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="space-y-1.5 rounded-lg border border-stone-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wider text-stone-500">
        {label}
      </div>
      <div className="text-2xl font-semibold tracking-tight text-stone-900">
        {value}
      </div>
      {sub ? <div className="text-xs text-stone-500">{sub}</div> : null}
    </div>
  );
}

function PlanCurveCard({ snapshots }: { snapshots: Snapshot[] }) {
  const byYear = new Map<number, Snapshot>();
  for (const s of snapshots) {
    // snapshots is sorted desc by createdAt — keep the most recent per year.
    if (!byYear.has(s.year)) byYear.set(s.year, s);
  }
  const data = PLAN_CURVE.map((p) => {
    const actual = byYear.get(p.year);
    return {
      year: p.year,
      target: p.portfolioTarget,
      actual: actual ? actual.portfolioValue : null,
    };
  });

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5">
      <header>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
          Portfolio vs. plan curve
        </h2>
        <p className="mt-1 text-xs text-stone-500">
          Each green dot is a year on file. The line is the target on the way
          to {formatUsdCompact(TARGET_PORTFOLIO_USD)}.
        </p>
      </header>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
          >
            <CartesianGrid stroke="#e7e5e4" strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: "#78716c" }}
            />
            <YAxis
              tickFormatter={(v: number) => formatUsdCompact(v)}
              tick={{ fontSize: 11, fill: "#78716c" }}
            />
            <Tooltip
              formatter={(v: unknown) =>
                typeof v === "number" ? formatUsd(v) : "—"
              }
              contentStyle={{
                fontSize: 12,
                border: "1px solid #d6d3d1",
                backgroundColor: "#fafaf9",
              }}
              labelStyle={{ color: "#1c1917" }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
            <Line
              type="monotone"
              dataKey="target"
              name="Plan target"
              stroke="#78716c"
              strokeWidth={2}
              dot={{ r: 3, fill: "#78716c" }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke="#3f6b3a"
              strokeWidth={2.5}
              dot={{ r: 5, fill: "#3f6b3a" }}
              connectNulls
              isAnimationActive={false}
            />
            <ReferenceDot
              x={2037}
              y={TARGET_PORTFOLIO_USD}
              r={6}
              fill="#1c1917"
              stroke="#fafaf9"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function RecentHistoryCard({ snapshots }: { snapshots: Snapshot[] }) {
  const recent = snapshots.slice(0, 5);
  return (
    <section className="space-y-3 rounded-lg border border-stone-200 bg-white p-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
            Past snapshots
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            The last few years at a glance.
          </p>
        </div>
        <Link
          href="/year/check-in/history"
          className="text-xs text-stone-600 hover:text-stone-900 hover:underline"
        >
          See all
        </Link>
      </header>
      <div className="space-y-2">
        {recent.map((s) => {
          const plan = getPlanForYear(s.year);
          const ratio = plan ? s.portfolioValue / plan.portfolioTarget : 1;
          const color: PaceColor = plan ? paceFromRatio(ratio) : "green";
          return (
            <div
              key={s.id}
              className="flex flex-col gap-2 rounded-md border border-stone-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${PACE_DOT[color]}`}
                />
                <span className="text-lg font-semibold tracking-tight text-stone-900">
                  {s.year}
                </span>
                <span className="text-xs text-stone-500">
                  {formatTimestamp(s.createdAt)}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
                <span>
                  Portfolio{" "}
                  <span className="font-medium text-stone-900">
                    {formatUsd(s.portfolioValue)}
                  </span>
                </span>
                <span>
                  ARR{" "}
                  <span className="font-medium text-stone-900">
                    {formatUsd(s.watershedArr)}
                  </span>
                </span>
                <span>
                  Take-home{" "}
                  <span className="font-medium text-stone-900">
                    {formatUsd(s.ownerTakeHome)}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
