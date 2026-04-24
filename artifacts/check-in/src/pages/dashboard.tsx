import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlusCircle, Sparkles } from "lucide-react";
import { listSnapshots, getLatestSnapshot } from "@/lib/api";
import {
  PLAN_CURVE,
  TARGET_PORTFOLIO_USD,
  TARGET_RETIRE_DATE,
  TARGET_RETIRE_AGE,
  ASSUMED_REAL_RETURN,
  getPlanForYear,
  paceFromRatio,
  paceLabel,
  yearsToRetirement,
  projectPortfolioAtFifty,
  type PaceColor,
} from "@/lib/planCurve";
import {
  formatUsd,
  formatUsdCompact,
  formatPercent,
  formatXrpPrice,
  formatInteger,
  formatDate,
} from "@/lib/format";
import type { Snapshot } from "@/lib/types";

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

export default function Dashboard() {
  // The full list backs the chart and the small history strip; the
  // dedicated "latest" endpoint backs the top panel so the most-watched
  // section of the page renders from a tiny payload independent of how
  // long the history grows.
  const latestQuery = useQuery({
    queryKey: ["check-in", "snapshots", "latest"],
    queryFn: getLatestSnapshot,
  });
  const snapshotsQuery = useQuery({
    queryKey: ["check-in", "snapshots"],
    queryFn: listSnapshots,
  });

  if (latestQuery.isLoading || snapshotsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (latestQuery.isError || snapshotsQuery.isError) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-destructive">
          Could not load snapshots. Try refreshing the page.
        </CardContent>
      </Card>
    );
  }

  const snapshots = snapshotsQuery.data ?? [];
  const latest: Snapshot | null = latestQuery.data ?? null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Where do I stand?
          </h1>
          <p className="text-muted-foreground mt-2">
            Tracking pace toward {formatUsdCompact(TARGET_PORTFOLIO_USD)} by{" "}
            {TARGET_RETIRE_DATE}.
          </p>
        </div>
        <Link href="/new">
          <Button size="lg" data-testid="button-new-snapshot">
            <PlusCircle className="h-4 w-4 mr-2" />
            Record this year's snapshot
          </Button>
        </Link>
      </div>

      {latest ? (
        <>
          <RetirementOutlookPanel snapshot={latest} />
          <LatestSnapshotPanel snapshot={latest} />
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold">
                No snapshots yet
              </h3>
              <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
                Once a year, sit down and fill in this year's snapshot. The
                dashboard will start telling you whether you're on pace.
              </p>
            </div>
            <Link href="/new">
              <Button data-testid="button-new-snapshot-empty">
                <PlusCircle className="h-4 w-4 mr-2" />
                Record first snapshot
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <PlanCurveCard snapshots={snapshots} />

      {snapshots.length > 0 ? (
        <RecentHistoryCard snapshots={snapshots} />
      ) : null}
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
    <div className="grid gap-4 md:grid-cols-2" data-testid="panel-retirement-outlook">
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
        testId="tile-years-remaining"
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
      className="rounded-md border border-border bg-card p-4 space-y-1.5"
      data-testid="tile-projection-at-fifty"
    >
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          Projected at age {TARGET_RETIRE_AGE}
        </div>
        <span
          className={`inline-block h-2 w-2 rounded-full ${PACE_DOT[color]}`}
        />
      </div>
      <div className="font-serif text-2xl font-bold tracking-tight">
        {projection === null ? "—" : formatUsd(Math.round(projection))}
      </div>
      <div className="text-xs text-muted-foreground">
        Holding {formatUsd(annualContribution)}/yr above living costs at{" "}
        {formatPercent(ASSUMED_REAL_RETURN, 0)} real ·{" "}
        {formatPercent(ratio, 0)} of {formatUsdCompact(TARGET_PORTFOLIO_USD)}{" "}
        target
      </div>
    </div>
  );
}

function RecentHistoryCard({ snapshots }: { snapshots: Snapshot[] }) {
  // Spec asks for a small history list on the dashboard itself, newest
  // first.  Cap to the most recent five so it doesn't crowd the page —
  // the full History page handles the long view.
  const recent = snapshots.slice(0, 5);
  return (
    <Card className="shadow-sm" data-testid="card-recent-history">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="font-serif text-xl">
              Past snapshots
            </CardTitle>
            <CardDescription>
              The last few years at a glance — newest first.
            </CardDescription>
          </div>
          <Link href="/history">
            <Button
              variant="ghost"
              size="sm"
              data-testid="link-dashboard-history"
            >
              See all
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {recent.map((s) => {
          const plan = getPlanForYear(s.year);
          const ratio = plan ? s.portfolioValue / plan.portfolioTarget : 1;
          const color: PaceColor = plan ? paceFromRatio(ratio) : "green";
          return (
            <div
              key={s.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-md border border-border bg-card p-3"
              data-testid={`row-history-${s.year}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${PACE_DOT[color]}`}
                />
                <span className="font-serif text-lg font-semibold tracking-tight">
                  {s.year}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(s.takenAt)}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>
                  Portfolio{" "}
                  <span className="font-medium text-foreground">
                    {formatUsd(s.portfolioValue)}
                  </span>
                </span>
                <span>
                  ARR{" "}
                  <span className="font-medium text-foreground">
                    {formatUsd(s.watershedArr)}
                  </span>
                </span>
                <span>
                  Take-home{" "}
                  <span className="font-medium text-foreground">
                    {formatUsd(s.ownerTakeHome)}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
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
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <CardTitle className="font-serif text-2xl">
              {snapshot.year} snapshot
            </CardTitle>
            <CardDescription>
              Recorded {formatDate(snapshot.takenAt)}
            </CardDescription>
          </div>
          <Badge
            className={`${PACE_BG[overallColor]} text-sm font-medium px-3 py-1.5 border`}
            data-testid="badge-pace"
          >
            <span
              className={`inline-block h-2 w-2 rounded-full mr-2 ${PACE_DOT[overallColor]}`}
            />
            {paceLabel(overallColor)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <PaceTile
            label="Portfolio"
            actual={snapshot.portfolioValue}
            target={plan?.portfolioTarget ?? null}
            ratio={portfolioRatio}
            testId="tile-portfolio"
          />
          <PaceTile
            label="Watershed ARR"
            actual={snapshot.watershedArr}
            target={plan?.arrTarget ?? null}
            ratio={arrRatio}
            testId="tile-arr"
          />
          <PaceTile
            label="Owner take-home"
            actual={snapshot.ownerTakeHome}
            target={plan?.takeHomeTarget ?? null}
            ratio={takeHomeRatio}
            testId="tile-take-home"
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
            testId="tile-investing-rate"
          />
          <InfoTile
            label="Living expenses"
            value={formatUsd(snapshot.annualLivingExpenses)}
            sub={
              plan
                ? `Plan assumed ${formatUsd(plan.livingExpensesAssumed)}`
                : undefined
            }
            testId="tile-living-expenses"
          />
          <InfoTile
            label="XRP wildcard — not counted toward retirement target"
            value={formatUsd(xrpValue)}
            sub={`${formatInteger(snapshot.xrpBalance)} XRP × ${formatXrpPrice(
              snapshot.xrpPriceUsd,
            )} · ${formatPercent(xrpShareOfPortfolio, 1)} of portfolio`}
            testId="tile-xrp"
          />
        </div>

        {snapshot.notes ? (
          <div className="rounded-md border border-border bg-muted/30 p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5">
              Notes
            </div>
            <p className="text-sm whitespace-pre-wrap text-foreground/90">
              {snapshot.notes}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function PaceTile({
  label,
  actual,
  target,
  ratio,
  testId,
}: {
  label: string;
  actual: number;
  target: number | null;
  ratio: number;
  testId: string;
}) {
  const color: PaceColor = target ? paceFromRatio(ratio) : "green";
  return (
    <div
      className="rounded-md border border-border bg-card p-4 space-y-1.5"
      data-testid={testId}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        {target ? (
          <span
            className={`inline-block h-2 w-2 rounded-full ${PACE_DOT[color]}`}
          />
        ) : null}
      </div>
      <div className="font-serif text-2xl font-bold tracking-tight">
        {formatUsd(actual)}
      </div>
      {target ? (
        <div className="text-xs text-muted-foreground">
          Target {formatUsd(target)} · {formatPercent(ratio, 0)} of plan
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">No plan target</div>
      )}
    </div>
  );
}

function InfoTile({
  label,
  value,
  sub,
  testId,
}: {
  label: string;
  value: string;
  sub?: string;
  testId: string;
}) {
  return (
    <div
      className="rounded-md border border-border bg-card p-4 space-y-1.5"
      data-testid={testId}
    >
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="font-serif text-2xl font-bold tracking-tight">
        {value}
      </div>
      {sub ? (
        <div className="text-xs text-muted-foreground">{sub}</div>
      ) : null}
    </div>
  );
}

function PlanCurveCard({ snapshots }: { snapshots: Snapshot[] }) {
  // Build the chart series.  The plan target line is always present; actual
  // points only appear for years Bobbie has snapshotted.
  const byYear = new Map<number, Snapshot>();
  for (const s of snapshots) {
    // If she snapshotted a year more than once, keep the most recent (which
    // is also the first item because the API orders by takenAt desc).
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
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-serif text-xl">
          Portfolio vs. plan curve
        </CardTitle>
        <CardDescription>
          Each green dot is a year you've recorded. The line is the target on
          the way to {formatUsdCompact(TARGET_PORTFOLIO_USD)}.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
          >
            <CartesianGrid
              stroke="hsl(var(--border))"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="year"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              tickFormatter={(v: number) => formatUsdCompact(v)}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              formatter={(v: unknown) =>
                typeof v === "number" ? formatUsd(v) : "—"
              }
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 6,
                fontSize: 12,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Plan target"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3, fill: "hsl(var(--primary))" }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke="hsl(var(--accent))"
              strokeWidth={2.5}
              dot={{ r: 5, fill: "hsl(var(--accent))" }}
              connectNulls
            />
            <ReferenceDot
              x={2037}
              y={TARGET_PORTFOLIO_USD}
              r={6}
              fill="hsl(var(--primary))"
              stroke="hsl(var(--background))"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
