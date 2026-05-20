import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  useGetBookkeeperPnl,
  useGetBookkeeperMe,
  useGetReportsByCategory,
  useGetPnlByMonth,
  useGetTaxSummary,
  useListTransactions,
  getGetBookkeeperPnlQueryKey,
  getGetReportsByCategoryQueryKey,
  getGetPnlByMonthQueryKey,
  getGetTaxSummaryQueryKey,
  getListTransactionsQueryKey,
} from "@workspace/api-client-react";
import type { CategoryReportRow, TaxSummaryLineItem, PnlBreakdownCostCentre, CostCentrePnlReport, Transaction } from "@workspace/api-client-react";
import {
  Loader2,
  Printer,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  ShieldCheck,
  Table2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ── Formatters ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

const fmtK = (n: number) => {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return fmt(n);
};

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
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}

const PRESETS = [
  { label: "This year", range: thisYear() },
  { label: "Last year", range: lastYear() },
  { label: "This quarter", range: thisQuarter() },
];

// ── Tab definitions ─────────────────────────────────────────────────────────────

type TabId = "by-cc" | "by-month" | "by-category" | "tax-summary";

const TABS: { id: TabId; label: string }[] = [
  { id: "by-cc", label: "By Cost Centre" },
  { id: "by-month", label: "P&L by Month" },
  { id: "by-category", label: "By Category" },
  { id: "tax-summary", label: "Tax Summary" },
];

// ── Date range controls (shared) ───────────────────────────────────────────────

function DateRangeBar({
  preset,
  from,
  to,
  onPreset,
  onFrom,
  onTo,
}: {
  preset: string;
  from: string;
  to: string;
  onPreset: (label: string, range: { from: string; to: string }) => void;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 items-center print:hidden">
      {PRESETS.map((p) => (
        <button
          key={p.label}
          onClick={() => onPreset(p.label, p.range)}
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
          onChange={(e) => { onPreset("Custom", { from: e.target.value, to }); onFrom(e.target.value); }}
          className="text-xs border border-border rounded px-2 py-1 bg-background"
        />
        <label className="text-xs text-muted-foreground">To</label>
        <input
          type="date"
          value={to}
          onChange={(e) => { onPreset("Custom", { from, to: e.target.value }); onTo(e.target.value); }}
          className="text-xs border border-border rounded px-2 py-1 bg-background"
        />
      </div>
    </div>
  );
}

// ── Drill-down slide-over ───────────────────────────────────────────────────────

interface DrillTarget {
  accountCode: string;
  accountName: string;
}

function DrillDownSheet({
  target,
  from,
  to,
  onClose,
}: {
  target: DrillTarget | null;
  from: string;
  to: string;
  onClose: () => void;
}) {
  const { data, isLoading, isError } = useListTransactions(
    target
      ? { accountCode: target.accountCode, from, to, status: "posted", limit: 200 }
      : undefined,
    {
      query: {
        enabled: !!target,
        queryKey: getListTransactionsQueryKey(
          target
            ? { accountCode: target.accountCode, from, to, status: "posted", limit: 200 }
            : undefined,
        ),
      },
    },
  );

  return (
    <Sheet open={!!target} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl sm:w-[720px] overflow-y-auto">
        <SheetHeader className="mt-4 mb-4">
          <SheetTitle className="font-serif text-xl">
            {target?.accountName ?? ""}
          </SheetTitle>
          <SheetDescription className="font-mono text-xs">
            {target?.accountCode} · {from} to {to}
          </SheetDescription>
        </SheetHeader>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {isError && (
          <Alert variant="destructive">
            <AlertDescription>Failed to load transactions.</AlertDescription>
          </Alert>
        )}

        {data && data.items.length === 0 && (
          <div className="rounded-xl border border-border bg-muted/20 p-10 text-center">
            <Minus className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No posted transactions for this account in the period.</p>
          </div>
        )}

        {data && data.items.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              {data.total} transaction{data.total !== 1 ? "s" : ""} · click any row to view detail
            </p>
            <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/60">
                    <th className="text-left px-3 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">Date</th>
                    <th className="text-left px-3 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">Description</th>
                    <th className="text-left px-3 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal hidden sm:table-cell">Ref</th>
                    <th className="text-right px-3 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">Debit</th>
                    <th className="text-right px-3 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">Credit</th>
                    <th className="px-2 py-2 w-6" />
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((txn: Transaction, i) => {
                    const relevantLines = txn.lines.filter(
                      (l) => l.accountCode === target?.accountCode,
                    );
                    return relevantLines.map((line, li) => (
                      <tr
                        key={`${txn.id}-${li}`}
                        className={`border-b border-border/50 hover:bg-muted/40 transition-colors ${i % 2 === 1 ? "bg-muted/10" : ""}`}
                      >
                        <td className="px-3 py-2 font-mono text-xs text-muted-foreground whitespace-nowrap">
                          {txn.postedDate}
                        </td>
                        <td className="px-3 py-2 text-xs max-w-[200px]">
                          <div className="truncate font-medium">{txn.description}</div>
                          {line.memo && line.memo !== txn.description && (
                            <div className="truncate text-muted-foreground text-[10px]">{line.memo}</div>
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs text-muted-foreground font-mono hidden sm:table-cell">
                          {txn.reference ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right font-mono tabular-nums text-xs">
                          {line.debit > 0 ? fmt(line.debit) : "—"}
                        </td>
                        <td className="px-3 py-2 text-right font-mono tabular-nums text-xs">
                          {line.credit > 0 ? fmt(line.credit) : "—"}
                        </td>
                        <td className="px-2 py-2 text-right">
                          <Link href={`/transactions/${txn.id}`}>
                            <button
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              title="View full transaction"
                              onClick={onClose}
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
            </div>
            {data.total > 200 && (
              <p className="text-[10px] text-muted-foreground text-right font-mono">
                Showing first 200 of {data.total} — use the Transactions ledger for a full export.
              </p>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ── P&L by Cost Centre (existing) ──────────────────────────────────────────────

function AccountLines({
  lines,
  kind,
  onAccountClick,
}: {
  lines: { accountCode: string; accountName: string; total: number }[];
  kind: "revenue" | "cost";
  onAccountClick?: (accountCode: string, accountName: string) => void;
}) {
  if (lines.length === 0) return null;
  const color = kind === "revenue" ? "text-emerald-700" : "text-red-700";
  return (
    <div className="mt-1 space-y-0.5">
      {lines.map((l) => (
        <div
          key={l.accountCode}
          className={`grid grid-cols-[auto_1fr_auto_auto] gap-2 items-baseline pl-4 pr-1 rounded ${onAccountClick ? "cursor-pointer hover:bg-muted/50 group" : ""}`}
          onClick={() => onAccountClick?.(l.accountCode, l.accountName)}
          title={onAccountClick ? "Click to see transactions" : undefined}
        >
          <span className="text-[10px] font-mono text-muted-foreground w-16 shrink-0">{l.accountCode}</span>
          <span className="text-xs text-muted-foreground truncate">{l.accountName}</span>
          <span className={`text-xs font-mono tabular-nums ${color}`}>{fmt(l.total)}</span>
          {onAccountClick && (
            <ExternalLink className="w-3 h-3 text-muted-foreground/40 group-hover:text-muted-foreground shrink-0 transition-colors" />
          )}
        </div>
      ))}
    </div>
  );
}

function CostCentreCard({ cc, onAccountClick }: {
  cc: {
    code: string; name: string; revenue: number; costs: number; net: number;
    revenueLines: { accountCode: string; accountName: string; total: number }[];
    costLines: { accountCode: string; accountName: string; total: number }[];
  };
  onAccountClick: (accountCode: string, accountName: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        className="w-full grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4 text-left hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">{cc.code}</span>
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
          <p className={`text-sm font-mono font-bold tabular-nums ${netColor(cc.net)}`}>{fmt(cc.net)}</p>
        </div>
      </button>
      {expanded && (
        <div className="border-t border-border px-5 py-3 bg-muted/20 space-y-3">
          {cc.revenueLines.length > 0 && (
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-emerald-700 mb-1">Revenue lines</p>
              <AccountLines lines={cc.revenueLines} kind="revenue" onAccountClick={onAccountClick} />
            </div>
          )}
          {cc.costLines.length > 0 && (
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-red-700 mb-1">Cost lines</p>
              <AccountLines lines={cc.costLines} kind="cost" onAccountClick={onAccountClick} />
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

function TabByCc({ from, to }: { from: string; to: string }) {
  const { data, isLoading, isError } = useGetBookkeeperPnl(
    { from, to },
    { query: { queryKey: getGetBookkeeperPnlQueryKey({ from, to }) } },
  );

  const [drillTarget, setDrillTarget] = useState<DrillTarget | null>(null);

  const agencyTotals = data?.agencyTotals ?? { revenue: 0, costs: 0, net: 0 };
  const activeCostCentres = (data?.costCentres ?? []).filter(
    (cc) => cc.revenue !== 0 || cc.costs !== 0,
  );

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  if (isError) return <Alert variant="destructive"><AlertDescription>Failed to load P&amp;L data.</AlertDescription></Alert>;
  if (!data) return null;

  return (
    <>
      <DrillDownSheet
        target={drillTarget}
        from={from}
        to={to}
        onClose={() => setDrillTarget(null)}
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-emerald-600" /><p className="text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-700">Total Revenue</p></div>
          <p className="text-2xl font-bold font-mono tabular-nums text-emerald-800">{fmt(agencyTotals.revenue)}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-red-600" /><p className="text-[10px] font-mono uppercase tracking-[0.18em] text-red-700">Total Costs</p></div>
          <p className="text-2xl font-bold font-mono tabular-nums text-red-800">{fmt(agencyTotals.costs)}</p>
        </div>
        <div className={`rounded-xl border p-4 ${agencyTotals.net >= 0 ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"}`}>
          <div className="flex items-center gap-2 mb-2">
            {agencyTotals.net >= 0 ? <TrendingUp className="w-4 h-4 text-primary" /> : <TrendingDown className="w-4 h-4 text-destructive" />}
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Net Income</p>
          </div>
          <p className={`text-2xl font-bold font-mono tabular-nums ${agencyTotals.net >= 0 ? "text-primary" : "text-destructive"}`}>{fmt(agencyTotals.net)}</p>
          <Badge variant="outline" className={`mt-2 text-[10px] ${agencyTotals.net >= 0 ? "border-emerald-300 text-emerald-700 bg-emerald-50" : "border-red-300 text-red-700 bg-red-50"}`}>
            {agencyTotals.revenue > 0 ? `${Math.round((agencyTotals.net / agencyTotals.revenue) * 100)}% margin` : "No revenue"}
          </Badge>
        </div>
      </div>

      {activeCostCentres.length === 0 ? (
        <div className="rounded-xl border border-border bg-muted/20 p-10 text-center">
          <Minus className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No posted transactions in this period.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">By cost centre — expand a row, then click an account line to drill into its transactions</p>
          {activeCostCentres.map((cc) => (
            <CostCentreCard
              key={cc.code}
              cc={cc}
              onAccountClick={(accountCode, accountName) =>
                setDrillTarget({ accountCode, accountName })
              }
            />
          ))}
          <div className="rounded-xl border border-border bg-muted/30 overflow-hidden mt-4">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/60">
                <th className="text-left px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">Cost Centre</th>
                <th className="text-right px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">Revenue</th>
                <th className="text-right px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">Costs</th>
                <th className="text-right px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">Net</th>
              </tr></thead>
              <tbody>
                {activeCostCentres.map((cc, i) => (
                  <tr key={cc.code} className={`border-b border-border/50 ${i % 2 === 1 ? "bg-muted/20" : ""}`}>
                    <td className="px-4 py-2"><span className="text-xs font-mono text-muted-foreground mr-2">{cc.code}</span>{cc.name}</td>
                    <td className="px-4 py-2 text-right font-mono tabular-nums text-emerald-700 text-xs">{fmt(cc.revenue)}</td>
                    <td className="px-4 py-2 text-right font-mono tabular-nums text-red-700 text-xs">{fmt(cc.costs)}</td>
                    <td className={`px-4 py-2 text-right font-mono tabular-nums font-semibold text-xs ${netColor(cc.net)}`}>{fmt(cc.net)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr className="border-t-2 border-border bg-muted/50">
                <td className="px-4 py-2 font-semibold text-xs">Agency Total</td>
                <td className="px-4 py-2 text-right font-mono tabular-nums font-bold text-emerald-700 text-sm">{fmt(agencyTotals.revenue)}</td>
                <td className="px-4 py-2 text-right font-mono tabular-nums font-bold text-red-700 text-sm">{fmt(agencyTotals.costs)}</td>
                <td className={`px-4 py-2 text-right font-mono tabular-nums font-bold text-sm ${netColor(agencyTotals.net)}`}>{fmt(agencyTotals.net)}</td>
              </tr></tfoot>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

// ── P&L by Month ────────────────────────────────────────────────────────────────

function monthLabel(key: string) {
  const [y, m] = key.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-CA", { month: "short", year: "2-digit" });
}

function PivotTable({
  monthRows,
  breakdown,
  totalRevenue,
  totalCosts,
  totalNet,
}: {
  monthRows: { month: string; revenue: number; costs: number; net: number }[];
  breakdown: PnlBreakdownCostCentre[];
  totalRevenue: number;
  totalCosts: number;
  totalNet: number;
}) {
  const months = monthRows.map((m) => m.month);
  // Build a lookup from the authoritative agency-level month totals
  const agencyByMonth = new Map(monthRows.map((m) => [m.month, m]));

  const revenueRows = breakdown.filter((cc) => cc.totalRevenue !== 0);
  const costRows = breakdown.filter((cc) => cc.totalCosts !== 0);

  const thCls = "text-right px-3 py-2 text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground font-normal whitespace-nowrap";
  const tdRev = "px-3 py-1.5 text-right font-mono tabular-nums text-xs text-emerald-700";
  const tdCost = "px-3 py-1.5 text-right font-mono tabular-nums text-xs text-red-700";
  const tdZero = "px-3 py-1.5 text-right font-mono tabular-nums text-xs text-muted-foreground/40";

  return (
    <div className="rounded-xl border border-border bg-muted/30 overflow-x-auto">
      <p className="px-4 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
        Month-by-month breakdown — one column per month
      </p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/60">
            <th className="text-left px-4 py-2 text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground font-normal sticky left-0 bg-muted/60 min-w-[160px]">
              Cost Centre
            </th>
            {months.map((m) => (
              <th key={m} className={thCls}>{monthLabel(m)}</th>
            ))}
            <th className={`${thCls} border-l border-border`}>Total</th>
          </tr>
        </thead>
        <tbody>
          {/* Revenue section */}
          <tr className="bg-emerald-50/60 border-b border-emerald-100">
            <td colSpan={months.length + 2} className="px-4 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-700 font-semibold">
              Revenue
            </td>
          </tr>
          {revenueRows.length === 0 && (
            <tr className="border-b border-border/40">
              <td colSpan={months.length + 2} className="px-4 py-2 text-xs text-muted-foreground italic">No revenue lines</td>
            </tr>
          )}
          {revenueRows.map((cc, i) => (
            <tr key={`rev-${cc.code}`} className={`border-b border-border/40 ${i % 2 === 1 ? "bg-muted/10" : ""}`}>
              <td className="px-4 py-1.5 sticky left-0 bg-inherit">
                <span className="text-[10px] font-mono text-muted-foreground mr-2">{cc.code === "__UNASSIGNED__" ? "—" : cc.code}</span>
                <span className="text-xs">{cc.name}</span>
              </td>
              {months.map((m) => {
                const v = cc.monthlyRevenue[m] ?? 0;
                return (
                  <td key={m} className={v !== 0 ? tdRev : tdZero}>{v !== 0 ? fmt(v) : "—"}</td>
                );
              })}
              <td className={`${tdRev} border-l border-border font-semibold`}>{fmt(cc.totalRevenue)}</td>
            </tr>
          ))}
          {/* Revenue totals row — use authoritative agency month totals */}
          <tr className="border-b-2 border-emerald-200 bg-emerald-50/80">
            <td className="px-4 py-2 text-xs font-semibold text-emerald-800 sticky left-0 bg-emerald-50/80">Total Revenue</td>
            {months.map((m) => {
              const v = agencyByMonth.get(m)?.revenue ?? 0;
              return <td key={m} className="px-3 py-2 text-right font-mono tabular-nums text-xs font-semibold text-emerald-800">{v !== 0 ? fmt(v) : "—"}</td>;
            })}
            <td className="px-3 py-2 text-right font-mono tabular-nums text-sm font-bold text-emerald-800 border-l border-border">{fmt(totalRevenue)}</td>
          </tr>

          {/* Costs section */}
          <tr className="bg-red-50/60 border-b border-red-100">
            <td colSpan={months.length + 2} className="px-4 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-red-700 font-semibold">
              Costs
            </td>
          </tr>
          {costRows.length === 0 && (
            <tr className="border-b border-border/40">
              <td colSpan={months.length + 2} className="px-4 py-2 text-xs text-muted-foreground italic">No cost lines</td>
            </tr>
          )}
          {costRows.map((cc, i) => (
            <tr key={`cost-${cc.code}`} className={`border-b border-border/40 ${i % 2 === 1 ? "bg-muted/10" : ""}`}>
              <td className="px-4 py-1.5 sticky left-0 bg-inherit">
                <span className="text-[10px] font-mono text-muted-foreground mr-2">{cc.code === "__UNASSIGNED__" ? "—" : cc.code}</span>
                <span className="text-xs">{cc.name}</span>
              </td>
              {months.map((m) => {
                const v = cc.monthlyCosts[m] ?? 0;
                return (
                  <td key={m} className={v !== 0 ? tdCost : tdZero}>{v !== 0 ? fmt(v) : "—"}</td>
                );
              })}
              <td className={`${tdCost} border-l border-border font-semibold`}>{fmt(cc.totalCosts)}</td>
            </tr>
          ))}
          {/* Costs totals row — use authoritative agency month totals */}
          <tr className="border-b-2 border-red-200 bg-red-50/80">
            <td className="px-4 py-2 text-xs font-semibold text-red-800 sticky left-0 bg-red-50/80">Total Costs</td>
            {months.map((m) => {
              const v = agencyByMonth.get(m)?.costs ?? 0;
              return <td key={m} className="px-3 py-2 text-right font-mono tabular-nums text-xs font-semibold text-red-800">{v !== 0 ? fmt(v) : "—"}</td>;
            })}
            <td className="px-3 py-2 text-right font-mono tabular-nums text-sm font-bold text-red-800 border-l border-border">{fmt(totalCosts)}</td>
          </tr>

          {/* Net income row — use authoritative agency month net */}
          <tr className={`border-t-2 border-border ${totalNet >= 0 ? "bg-primary/5" : "bg-destructive/5"}`}>
            <td className={`px-4 py-3 text-xs font-bold sticky left-0 ${totalNet >= 0 ? "bg-primary/5 text-primary" : "bg-destructive/5 text-destructive"}`}>Net Income</td>
            {months.map((m) => {
              const entry = agencyByMonth.get(m);
              const net = entry?.net ?? 0;
              const isEmpty = !entry || (entry.revenue === 0 && entry.costs === 0);
              return (
                <td key={m} className={`px-3 py-3 text-right font-mono tabular-nums text-xs font-bold ${netColor(net)}`}>
                  {isEmpty ? "—" : fmt(net)}
                </td>
              );
            })}
            <td className={`px-3 py-3 text-right font-mono tabular-nums text-sm font-bold border-l border-border ${netColor(totalNet)}`}>{fmt(totalNet)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TabByMonth({ from, to }: { from: string; to: string }) {
  const { data, isLoading, isError } = useGetPnlByMonth(
    { from, to },
    { query: { queryKey: getGetPnlByMonthQueryKey({ from, to }) } },
  );

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  if (isError) return <Alert variant="destructive"><AlertDescription>Failed to load monthly P&amp;L data.</AlertDescription></Alert>;
  if (!data || data.months.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-10 text-center">
        <BarChart3 className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No monthly data in this period.</p>
      </div>
    );
  }

  const chartData = data.months.map((m) => ({
    month: m.month,
    Revenue: m.revenue,
    Costs: m.costs,
    Net: m.net,
  }));

  const totalRevenue = data.months.reduce((s, m) => s + m.revenue, 0);
  const totalCosts = data.months.reduce((s, m) => s + m.costs, 0);
  const totalNet = totalRevenue - totalCosts;
  const breakdown = data.breakdown ?? [];

  return (
    <div className="space-y-6">
      {/* Summary banner */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-700 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold font-mono tabular-nums text-emerald-800">{fmt(totalRevenue)}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-red-700 mb-1">Total Costs</p>
          <p className="text-2xl font-bold font-mono tabular-nums text-red-800">{fmt(totalCosts)}</p>
        </div>
        <div className={`rounded-xl border p-4 ${totalNet >= 0 ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"}`}>
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-1">Net Income</p>
          <p className={`text-2xl font-bold font-mono tabular-nums ${totalNet >= 0 ? "text-primary" : "text-destructive"}`}>{fmt(totalNet)}</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="rounded-xl border border-border bg-card p-4 pt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">Revenue vs Costs — monthly</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={fmtK} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={64} />
            <Tooltip
              formatter={(value: number) => fmt(value)}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Revenue" fill="hsl(142 76% 36%)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Costs" fill="hsl(0 72% 51%)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Net" fill="hsl(217 91% 60%)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pivot breakdown table */}
      {breakdown.length > 0 ? (
        <PivotTable
          monthRows={data.months}
          breakdown={breakdown}
          totalRevenue={totalRevenue}
          totalCosts={totalCosts}
          totalNet={totalNet}
        />
      ) : (
        /* Fallback simple table when no cost-centre data */
        <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/60">
              <th className="text-left px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">Month</th>
              <th className="text-right px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">Revenue</th>
              <th className="text-right px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">Costs</th>
              <th className="text-right px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">Net</th>
            </tr></thead>
            <tbody>
              {data.months.map((m, i) => (
                <tr key={m.month} className={`border-b border-border/50 ${i % 2 === 1 ? "bg-muted/20" : ""}`}>
                  <td className="px-4 py-2 font-mono text-sm">{m.month}</td>
                  <td className="px-4 py-2 text-right font-mono tabular-nums text-emerald-700 text-xs">{fmt(m.revenue)}</td>
                  <td className="px-4 py-2 text-right font-mono tabular-nums text-red-700 text-xs">{fmt(m.costs)}</td>
                  <td className={`px-4 py-2 text-right font-mono tabular-nums font-semibold text-xs ${netColor(m.net)}`}>{fmt(m.net)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/50">
                <td className="px-4 py-2 font-semibold text-xs">Total</td>
                <td className="px-4 py-2 text-right font-mono tabular-nums font-bold text-emerald-700 text-sm">{fmt(totalRevenue)}</td>
                <td className="px-4 py-2 text-right font-mono tabular-nums font-bold text-red-700 text-sm">{fmt(totalCosts)}</td>
                <td className={`px-4 py-2 text-right font-mono tabular-nums font-bold text-sm ${netColor(totalNet)}`}>{fmt(totalNet)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Tax Summary tab ─────────────────────────────────────────────────────────────

function TabTaxSummary({ from, to }: { from: string; to: string }) {
  const { data, isLoading, isError } = useGetTaxSummary(
    { from, to },
    { query: { queryKey: getGetTaxSummaryQueryKey({ from, to }) } },
  );

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  if (isError) return <Alert variant="destructive"><AlertDescription>Failed to load tax summary data.</AlertDescription></Alert>;
  if (!data) return null;

  const hasData = data.collected !== 0 || data.paid !== 0;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-700">GST/HST Collected</p>
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-emerald-800">{fmt(data.collected)}</p>
          <p className="text-[10px] text-emerald-600 mt-1">From revenue-side transactions</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-blue-600" />
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-blue-700">GST/HST Paid (ITCs)</p>
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-blue-800">{fmt(data.paid)}</p>
          <p className="text-[10px] text-blue-600 mt-1">Input tax credits on purchases</p>
        </div>
        <div className={`rounded-xl border p-4 ${
          data.netOwing > 0
            ? "border-amber-200 bg-amber-50"
            : data.netOwing < 0
              ? "border-emerald-200 bg-emerald-50"
              : "border-border bg-muted/20"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {data.netOwing > 0
              ? <TrendingUp className="w-4 h-4 text-amber-600" />
              : data.netOwing < 0
                ? <TrendingDown className="w-4 h-4 text-emerald-600" />
                : <Minus className="w-4 h-4 text-muted-foreground" />}
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Net Owing / Refund</p>
          </div>
          <p className={`text-2xl font-bold font-mono tabular-nums ${
            data.netOwing > 0 ? "text-amber-800" : data.netOwing < 0 ? "text-emerald-800" : "text-muted-foreground"
          }`}>
            {fmt(Math.abs(data.netOwing))}
          </p>
          <Badge
            variant="outline"
            className={`mt-2 text-[10px] ${
              data.netOwing > 0
                ? "border-amber-300 text-amber-700 bg-amber-50"
                : data.netOwing < 0
                  ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                  : "border-border text-muted-foreground"
            }`}
          >
            {data.netOwing > 0 ? "Amount to remit" : data.netOwing < 0 ? "Refund owing" : "Nil"}
          </Badge>
        </div>
      </div>

      {/* Explanation */}
      <div className="rounded-xl border border-border bg-muted/20 px-5 py-3 text-xs text-muted-foreground">
        Net owing = GST/HST collected − input tax credits (ITCs). A positive amount means tax to remit to CRA; a negative amount means a refund is owing.
      </div>

      {/* Detail table */}
      {!hasData ? (
        <div className="rounded-xl border border-border bg-muted/20 p-10 text-center">
          <Minus className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No GST/HST-coded transactions in this period.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
          <p className="px-4 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
            Account detail · {data.lines.length} account{data.lines.length !== 1 ? "s" : ""}
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/60">
                <th className="text-left px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">Account</th>
                <th className="text-left px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">Tax Code</th>
                <th className="text-right px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">Txns</th>
                <th className="text-right px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.lines.map((row: TaxSummaryLineItem, i) => (
                <tr key={row.accountCode} className={`border-b border-border/50 ${i % 2 === 1 ? "bg-muted/20" : ""}`}>
                  <td className="px-4 py-2">
                    <span className="font-mono text-xs text-muted-foreground mr-2">{row.accountCode}</span>
                    <span className="text-sm">{row.accountName}</span>
                  </td>
                  <td className="px-4 py-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono ${
                        row.taxCode === "gst-collected"
                          ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                          : "border-blue-300 text-blue-700 bg-blue-50"
                      }`}
                    >
                      {row.taxCode === "gst-collected" ? "GST Collected" : "GST Paid"}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-right font-mono tabular-nums text-xs text-muted-foreground">
                    {row.transactionCount}
                  </td>
                  <td className={`px-4 py-2 text-right font-mono tabular-nums font-semibold text-xs ${
                    row.taxCode === "gst-collected" ? "text-emerald-700" : "text-blue-700"
                  }`}>
                    {fmt(row.total)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/50">
                <td colSpan={3} className="px-4 py-2 font-semibold text-xs">Net owing to CRA</td>
                <td className={`px-4 py-2 text-right font-mono tabular-nums font-bold text-sm ${
                  data.netOwing > 0 ? "text-amber-700" : data.netOwing < 0 ? "text-emerald-700" : "text-muted-foreground"
                }`}>
                  {fmt(data.netOwing)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

// ── By Category sortable table ──────────────────────────────────────────────────

type SortCol = "accountCode" | "type" | "taxCode" | "total" | "transactionCount";
type SortDir = "asc" | "desc";

const TAX_CODE_LABELS: Record<string, string> = {
  "gst-collected": "GST Collected",
  "gst-paid": "GST Paid",
  "exempt": "Exempt",
  "zero-rated": "Zero-Rated",
  "personal": "Personal",
  "none": "None",
};

function SortHeader({
  col,
  label,
  current,
  dir,
  onClick,
}: {
  col: SortCol;
  label: string;
  current: SortCol;
  dir: SortDir;
  onClick: (c: SortCol) => void;
}) {
  const active = current === col;
  return (
    <th
      className="px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal cursor-pointer select-none hover:text-foreground"
      onClick={() => onClick(col)}
    >
      <span className="flex items-center gap-1 justify-end">
        {label}
        {active ? (
          dir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3 opacity-30" />
        )}
      </span>
    </th>
  );
}

function TabByCategory({ from, to }: { from: string; to: string }) {
  const { data, isLoading, isError } = useGetReportsByCategory(
    { from, to },
    { query: { queryKey: getGetReportsByCategoryQueryKey({ from, to }) } },
  );

  const [drillTarget, setDrillTarget] = useState<DrillTarget | null>(null);
  const [sortCol, setSortCol] = useState<SortCol>("type");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  };

  const sorted = useMemo(() => {
    if (!data) return [];
    return [...data.rows].sort((a, b) => {
      let av: string | number = a[sortCol];
      let bv: string | number = b[sortCol];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [data, sortCol, sortDir]);

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  if (isError) return <Alert variant="destructive"><AlertDescription>Failed to load category data.</AlertDescription></Alert>;
  if (!data || data.rows.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-10 text-center">
        <Table2 className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No category data in this period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DrillDownSheet
        target={drillTarget}
        from={from}
        to={to}
        onClose={() => setDrillTarget(null)}
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-700 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold font-mono tabular-nums text-emerald-800">{fmt(data.totalRevenue)}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-red-700 mb-1">Total Costs</p>
          <p className="text-2xl font-bold font-mono tabular-nums text-red-800">{fmt(data.totalCosts)}</p>
        </div>
        <div className={`rounded-xl border p-4 ${data.net >= 0 ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"}`}>
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-1">Net Income</p>
          <p className={`text-2xl font-bold font-mono tabular-nums ${data.net >= 0 ? "text-primary" : "text-destructive"}`}>{fmt(data.net)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
        <p className="px-4 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
          Click column headers to sort · click a row to drill into its transactions · {data.rows.length} accounts
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60">
              <th className="text-left px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("accountCode")}>
                <span className="flex items-center gap-1">
                  Account
                  {sortCol === "accountCode" ? (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ChevronDown className="w-3 h-3 opacity-30" />}
                </span>
              </th>
              <th className="text-left px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("type")}>
                <span className="flex items-center gap-1">
                  Type
                  {sortCol === "type" ? (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ChevronDown className="w-3 h-3 opacity-30" />}
                </span>
              </th>
              <th className="text-left px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground font-normal cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("taxCode")}>
                <span className="flex items-center gap-1">
                  Tax Code
                  {sortCol === "taxCode" ? (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ChevronDown className="w-3 h-3 opacity-30" />}
                </span>
              </th>
              <SortHeader col="transactionCount" label="Txns" current={sortCol} dir={sortDir} onClick={handleSort} />
              <SortHeader col="total" label="Total" current={sortCol} dir={sortDir} onClick={handleSort} />
            </tr>
          </thead>
          <tbody>
            {sorted.map((row: CategoryReportRow, i) => (
              <tr
                key={row.accountCode}
                className={`border-b border-border/50 cursor-pointer hover:bg-muted/40 transition-colors ${i % 2 === 1 ? "bg-muted/20" : ""}`}
                onClick={() => setDrillTarget({ accountCode: row.accountCode, accountName: row.accountName })}
                title="Click to see transactions"
              >
                <td className="px-4 py-2">
                  <span className="font-mono text-xs text-muted-foreground mr-2">{row.accountCode}</span>
                  <span className="text-sm">{row.accountName}</span>
                </td>
                <td className="px-4 py-2">
                  <Badge variant="secondary" className="text-[10px] capitalize">{row.type.replace("_", " ")}</Badge>
                </td>
                <td className="px-4 py-2">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {TAX_CODE_LABELS[row.taxCode] ?? row.taxCode}
                  </Badge>
                </td>
                <td className="px-4 py-2 text-right font-mono tabular-nums text-xs text-muted-foreground">
                  {row.transactionCount}
                </td>
                <td className={`px-4 py-2 text-right font-mono tabular-nums font-semibold text-xs ${
                  row.type === "revenue" ? "text-emerald-700" : "text-red-700"
                }`}>
                  {fmt(row.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────────

function buildPnlCsv(
  data: CostCentrePnlReport,
  from: string,
  to: string,
): string {
  const escape = (v: string | number) => {
    const s = String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const row = (...cols: (string | number)[]) => cols.map(escape).join(",");

  const lines: string[] = [
    `# Headwaters Books — P&L by Cost Centre`,
    `# Period: ${from} to ${to}`,
    `# Exported: ${new Date().toLocaleDateString("en-CA")}`,
    ``,
    row("Cost Centre Code", "Cost Centre Name", "Account Code", "Account Name", "Revenue", "Costs", "Net"),
  ];

  for (const cc of data.costCentres) {
    for (const rev of cc.revenueLines) {
      lines.push(row(cc.code, cc.name, rev.accountCode, rev.accountName, rev.total, 0, rev.total));
    }
    for (const cost of cc.costLines) {
      lines.push(row(cc.code, cc.name, cost.accountCode, cost.accountName, 0, cost.total, -cost.total));
    }
    if (cc.revenueLines.length === 0 && cc.costLines.length === 0) {
      lines.push(row(cc.code, cc.name, "", "", 0, 0, 0));
    }
  }

  const t = data.agencyTotals;
  lines.push(row("TOTAL", "Agency Total", "", "", t.revenue, t.costs, t.net));

  return lines.join("\n");
}

export default function Pnl() {
  const { data: me, isLoading: meLoading } = useGetBookkeeperMe();

  const [tab, setTab] = useState<TabId>("by-cc");
  const [preset, setPreset] = useState<string>("This year");
  const [from, setFrom] = useState(thisYear().from);
  const [to, setTo] = useState(thisYear().to);

  const { data: pnlData } = useGetBookkeeperPnl(
    { from, to },
    { query: { queryKey: getGetBookkeeperPnlQueryKey({ from, to }) } },
  );

  const isAllowed = me?.role === "owner" || me?.role === "bookkeeper";

  function downloadCsv() {
    if (!pnlData) return;
    const csv = buildPnlCsv(pnlData, from, to);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pnl-${from}-to-${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (meLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (me && !isAllowed) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <ShieldCheck className="w-10 h-10 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">Reports are restricted to owners and bookkeepers.</p>
      </div>
    );
  }

  function applyPreset(label: string, range: { from: string; to: string }) {
    setPreset(label);
    setFrom(range.from);
    setTo(range.to);
  }

  return (
    <div className="space-y-6 pb-16 print:pb-4 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 print:hidden">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1">Financial Reports</p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif, serif)" }}>Reports</h1>
          <p className="text-muted-foreground mt-1 text-sm">P&amp;L, monthly trends, and category breakdown.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start print:hidden">
          <Button variant="outline" size="sm" onClick={downloadCsv} disabled={!pnlData} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print / PDF
          </Button>
        </div>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif, serif)" }}>
          {TABS.find((t) => t.id === tab)?.label} — Headwaters Books
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Period: {from} to {to}</p>
        <p className="text-xs text-muted-foreground mt-0.5">Printed {new Date().toLocaleDateString("en-CA")}</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border border-border rounded-lg p-1 w-fit bg-muted/30 print:hidden">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Date range bar */}
      <DateRangeBar
        preset={preset}
        from={from}
        to={to}
        onPreset={applyPreset}
        onFrom={setFrom}
        onTo={setTo}
      />

      <p className="text-xs text-muted-foreground">
        <span className="font-mono">{from}</span>
        {" "}to{" "}
        <span className="font-mono">{to}</span>
        {" — posted transactions only"}
      </p>

      {/* Tab content */}
      {tab === "by-cc" && <TabByCc from={from} to={to} />}
      {tab === "by-month" && <TabByMonth from={from} to={to} />}
      {tab === "by-category" && <TabByCategory from={from} to={to} />}
      {tab === "tax-summary" && <TabTaxSummary from={from} to={to} />}
    </div>
  );
}
