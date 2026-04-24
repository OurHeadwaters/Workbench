import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { listSnapshots } from "@/lib/api";
import {
  getPlanForYear,
  paceFromRatio,
  paceLabel,
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

const PACE_BG: Record<PaceColor, string> = {
  green: "bg-emerald-100 text-emerald-900 border-emerald-300",
  yellow: "bg-amber-100 text-amber-900 border-amber-300",
  red: "bg-rose-100 text-rose-900 border-rose-300",
};

export default function History() {
  const snapshotsQuery = useQuery({
    queryKey: ["check-in", "snapshots"],
    queryFn: listSnapshots,
  });

  if (snapshotsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (snapshotsQuery.isError) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-destructive">
          Could not load snapshots. Try refreshing the page.
        </CardContent>
      </Card>
    );
  }

  const snapshots = snapshotsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
          History
        </h1>
        <p className="text-muted-foreground mt-2">
          Every annual check-in, newest first. Past entries can't be edited —
          they're a record, not a draft.
        </p>
      </div>

      {snapshots.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No snapshots yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {snapshots.map((s) => {
            const plan = getPlanForYear(s.year);
            const portfolioRatio = plan
              ? s.portfolioValue / plan.portfolioTarget
              : 1;
            const color: PaceColor = plan
              ? paceFromRatio(portfolioRatio)
              : "green";
            const xrpValue = s.xrpBalance * s.xrpPriceUsd;
            return (
              <Card
                key={s.id}
                className="shadow-sm"
                data-testid={`card-snapshot-${s.year}`}
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <CardTitle className="font-serif text-2xl">
                        {s.year}
                      </CardTitle>
                      <CardDescription>
                        Recorded {formatDate(s.takenAt)}
                      </CardDescription>
                    </div>
                    {plan ? (
                      <Badge
                        className={`${PACE_BG[color]} text-xs font-medium px-3 py-1 border`}
                      >
                        {paceLabel(color)} ·{" "}
                        {formatPercent(portfolioRatio, 0)} of plan
                      </Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <Stat
                      label="Portfolio"
                      value={formatUsdCompact(s.portfolioValue)}
                      detail={
                        plan
                          ? `Target ${formatUsdCompact(plan.portfolioTarget)}`
                          : undefined
                      }
                    />
                    <Stat
                      label="Watershed ARR"
                      value={formatUsdCompact(s.watershedArr)}
                      detail={
                        plan
                          ? `Target ${formatUsdCompact(plan.arrTarget)}`
                          : undefined
                      }
                    />
                    <Stat
                      label="Take-home"
                      value={formatUsd(s.ownerTakeHome)}
                      detail={
                        plan
                          ? `Target ${formatUsd(plan.takeHomeTarget)}`
                          : undefined
                      }
                    />
                    <Stat
                      label="Living expenses"
                      value={formatUsd(s.annualLivingExpenses)}
                    />
                    <Stat
                      label="XRP balance"
                      value={formatInteger(s.xrpBalance)}
                    />
                    <Stat
                      label="XRP price"
                      value={formatXrpPrice(s.xrpPriceUsd)}
                    />
                    <Stat
                      label="XRP value"
                      value={formatUsd(xrpValue)}
                      detail={
                        s.portfolioValue > 0
                          ? `${formatPercent(
                              xrpValue / s.portfolioValue,
                              1,
                            )} of portfolio`
                          : undefined
                      }
                    />
                  </dl>
                  {s.notes ? (
                    <div className="mt-4 rounded-md border border-border bg-muted/30 p-3">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                        Notes
                      </div>
                      <p className="text-sm whitespace-pre-wrap text-foreground/90">
                        {s.notes}
                      </p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="font-serif text-lg font-semibold mt-0.5">{value}</dd>
      {detail ? (
        <div className="text-xs text-muted-foreground mt-0.5">{detail}</div>
      ) : null}
    </div>
  );
}
