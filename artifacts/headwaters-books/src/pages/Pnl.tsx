import { useState } from "react";
import { useGetBookkeeperPnl, useGetBookkeeperMe, getGetBookkeeperPnlQueryKey } from "@workspace/api-client-react";
import { Loader2, Printer, TrendingUp, TrendingDown, Minus, BarChart3, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ── Formatters ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

function netColor(net: number) {
  if (net > 0) return "text-emerald-700";
  if (net < 0) return "text-red-700";
  return "text-muted-foreground";
}

// ── Date helpers ───────────────────────────────────────────────────────────────

function thisYear() {
  const now = new Date();
  return {
    from: `${now.getFullYear()}-01-01`,
    to: `${now.getFullYear()}-12-31`,
  };
}

function lastYear() {
  const y = new Date().getFullYear() - 1;
  return { from: `${y}-01-01`, to: `${y}-12-31` };
}

function thisQuarter() {
  const now = new Date();
  const q = Math.floor(now.getMonth() / 3);
  const from = new Date(now.getFullYear(), q * 3, 1);
  const to = new Date(now.getFullYear(), q * 3 + 3, 0);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

const PRESETS = [
  { label: "This year", range: thisYear() },
  { label: "Last year", range: lastYear() },
  { label: "This quarter", range: thisQuarter() },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function AccountLines({
  lines,
  kind,
}: {
  lines: { accountCode: string; accountName: string; total: number }[];
  kind: "revenue" | "cost";
}) {
  if (lines.length === 0) return null;
  const color = kind === "revenue" ? "text-emerald-700" : "text-red-700";
  return (
    <div className="mt-1 space-y-0.5">
      {lines.map((l) => (
        <div
          key={l.accountCode}
          className="grid grid-cols-[auto_1fr_auto] gap-2 items-baseline pl-4"
        >
          <span className="text-[10px] font-mono text-muted-foreground w-16 shrink-0">
            {l.accountCode}
          </span>
          <span className="text-xs text-muted-foreground truncate">{l.accountName}</span>
          <span className={`text-xs font-mono tabular-nums ${color}`}>{fmt(l.total)}</span>
        </div>
      ))}
    </div>
  );
}

function CostCentreCard({
  cc,
}: {
  cc: {
    code: string;
    name: string;
    revenue: number;
    costs: number;
    net: number;
    revenueLines: { accountCode: string; accountName: string; total: number }[];
    costLines: { accountCode: string; accountName: string; total: number }[];
  };
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header row */}
      <button
        className="w-full grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4 text-left hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
            {cc.code}
          </span>
          <p className="text-sm font-semibold">{cc.name}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground mb-0.5">Revenue</p>
          <p className="text-sm font-mono tabular-nums text-emerald-700">{fmt(cc.revenue)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground mb-0.5">Costs</p>
          <p className="text-sm font-mono tabular-nums text-red-700">{fmt(cc.costs)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground mb-0.5">Net</p>
          <p className={`text-sm font-mono font-bold tabular-nums ${netColor(cc.net)}`}>
            {fmt(cc.net)}
          </p>
        </div>
      </button>

      {/* Expanded line detail */}
      {expanded && (
        <div className="border-t border-border px-5 py-3 bg-muted/20 space-y-3">
          {cc.revenueLines.length > 0 && (
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-emerald-700 mb-1">
                Revenue lines
              </p>
              <AccountLines lines={cc.revenueLines} kind="revenue" />
            </div>
          )}
          {cc.costLines.length > 0 && (
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-red-700 mb-1">
                Cost lines
              </p>
              <AccountLines lines={cc.costLines} kind="cost" />
            </div>
          )}
          {cc.revenueLines.length === 0 && cc.costLines.length === 0 && (
            <p className="text-xs text-muted-foreground">No posted lines in this period.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function Pnl() {
  const { data: me, isLoading: meLoading } = useGetBookkeeperMe();

  const [preset, setPreset] = useState<string>("This year");
  const [from, setFrom] = useState(thisYear().from);
  const [to, setTo] = useState(thisYear().to);

  const isAllowed = me?.role === "owner" || me?.role === "bookkeeper";
  const { data, isLoading, isError } = useGetBookkeeperPnl(
    { from, to },
    {
      query: {
        queryKey: getGetBookkeeperPnlQueryKey({ from, to }),
        enabled: !meLoading && isAllowed,
      },
    },
  );

  // Role guard — only owner and bookkeeper
  if (meLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (me && me.role !== "owner" && me.role !== "bookkeeper") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <ShieldCheck className="w-10 h-10 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          P&amp;L reports are restricted to owners and bookkeepers.
        </p>
      </div>
    );
  }

  function applyPreset(label: string, range: { from: string; to: string }) {
    setPreset(label);
    setFrom(range.from);
    setTo(range.to);
  }

  const agencyTotals = data?.agencyTotals ?? { revenue: 0, costs: 0, net: 0 };
  const costCentres = data?.costCentres ?? [];
  const activeCostCentres = costCentres.filter(
    (cc) => cc.revenue !== 0 || cc.costs !== 0,
  );

  return (
    <div className="space-y-6 pb-16 print:pb-4 max-w-4xl">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 print:hidden">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Financial Report
          </p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif, serif)" }}>
            Profit &amp; Loss
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Revenue vs. expenses grouped by cost centre.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="flex items-center gap-2 shrink-0 self-start"
        >
          <Printer className="w-4 h-4" />
          Print / PDF
        </Button>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif, serif)" }}>
          Profit &amp; Loss Statement — Headwaters Books
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Period: {from} to {to}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Printed {new Date().toLocaleDateString("en-CA")}
        </p>
      </div>

      {/* Date range controls */}
      <div className="flex flex-wrap gap-2 items-center print:hidden">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => applyPreset(p.label, p.range)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              preset === p.label
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
        <div className="flex items-center gap-2 ml-2">
          <label className="text-xs text-muted-foreground">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => { setPreset("Custom"); setFrom(e.target.value); }}
            className="text-xs border border-border rounded px-2 py-1 bg-background"
          />
          <label className="text-xs text-muted-foreground">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => { setPreset("Custom"); setTo(e.target.value); }}
            className="text-xs border border-border rounded px-2 py-1 bg-background"
          />
        </div>
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load P&amp;L data. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {data && !isLoading && (
        <>
          {/* Agency totals banner */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-700">
                  Total Revenue
                </p>
              </div>
              <p className="text-2xl font-bold font-mono tabular-nums text-emerald-800">
                {fmt(agencyTotals.revenue)}
              </p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-red-700">
                  Total Costs
                </p>
              </div>
              <p className="text-2xl font-bold font-mono tabular-nums text-red-800">
                {fmt(agencyTotals.costs)}
              </p>
            </div>
            <div
              className={`rounded-xl border p-4 ${
                agencyTotals.net >= 0
                  ? "border-primary/30 bg-primary/5"
                  : "border-destructive/30 bg-destructive/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {agencyTotals.net >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-primary" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                  Net Income
                </p>
              </div>
              <p
                className={`text-2xl font-bold font-mono tabular-nums ${
                  agencyTotals.net >= 0 ? "text-primary" : "text-destructive"
                }`}
              >
                {fmt(agencyTotals.net)}
              </p>
              <Badge
                variant="outline"
                className={`mt-2 text-[10px] ${
                  agencyTotals.net >= 0
                    ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                    : "border-red-300 text-red-700 bg-red-50"
                }`}
              >
                {agencyTotals.revenue > 0
                  ? `${Math.round((agencyTotals.net / agencyTotals.revenue) * 100)}% margin`
                  : "No revenue"}
              </Badge>
            </div>
          </div>

          {/* Period label */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              <span className="font-mono">{from}</span>
              {" "}to{" "}
              <span className="font-mono">{to}</span>
              {" — posted transactions only"}
            </p>
            {activeCostCentres.length > 0 && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                {activeCostCentres.length} cost centre{activeCostCentres.length !== 1 ? "s" : ""} with activity
              </p>
            )}
          </div>

          {/* Cost centre breakdown */}
          {activeCostCentres.length === 0 ? (
            <div className="rounded-xl border border-border bg-muted/20 p-10 text-center">
              <Minus className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No posted transactions in this period.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try a different date range or post some transactions first.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                By cost centre — click any row to expand account detail
              </p>
              {activeCostCentres.map((cc) => (
                <CostCentreCard key={cc.code} cc={cc} />
              ))}

              {/* Summary table */}
              <div className="rounded-xl border border-border bg-muted/30 overflow-hidden mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/60">
                      <th className="text-left px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">
                        Cost Centre
                      </th>
                      <th className="text-right px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">
                        Revenue
                      </th>
                      <th className="text-right px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">
                        Costs
                      </th>
                      <th className="text-right px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">
                        Net
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCostCentres.map((cc, i) => (
                      <tr
                        key={cc.code}
                        className={`border-b border-border/50 ${
                          i % 2 === 1 ? "bg-muted/20" : ""
                        }`}
                      >
                        <td className="px-4 py-2">
                          <span className="text-xs font-mono text-muted-foreground mr-2">
                            {cc.code}
                          </span>
                          {cc.name}
                        </td>
                        <td className="px-4 py-2 text-right font-mono tabular-nums text-emerald-700 text-xs">
                          {fmt(cc.revenue)}
                        </td>
                        <td className="px-4 py-2 text-right font-mono tabular-nums text-red-700 text-xs">
                          {fmt(cc.costs)}
                        </td>
                        <td className={`px-4 py-2 text-right font-mono tabular-nums font-semibold text-xs ${netColor(cc.net)}`}>
                          {fmt(cc.net)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-border bg-muted/50">
                      <td className="px-4 py-2 font-semibold text-xs">Agency Total</td>
                      <td className="px-4 py-2 text-right font-mono tabular-nums font-bold text-emerald-700 text-sm">
                        {fmt(agencyTotals.revenue)}
                      </td>
                      <td className="px-4 py-2 text-right font-mono tabular-nums font-bold text-red-700 text-sm">
                        {fmt(agencyTotals.costs)}
                      </td>
                      <td className={`px-4 py-2 text-right font-mono tabular-nums font-bold text-sm ${netColor(agencyTotals.net)}`}>
                        {fmt(agencyTotals.net)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
