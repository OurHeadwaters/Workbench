import { useState, useMemo } from "react";
import {
  useGetBookkeeperPnl,
  useGetBookkeeperMe,
  useGetReportsByCategory,
  useGetPnlByMonth,
  getGetBookkeeperPnlQueryKey,
  getGetReportsByCategoryQueryKey,
  getGetPnlByMonthQueryKey,
} from "@workspace/api-client-react";
import type { CategoryReportRow } from "@workspace/api-client-react";
import {
  Loader2,
  Printer,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  ShieldCheck,
  Table2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

type TabId = "by-cc" | "by-month" | "by-category";

const TABS: { id: TabId; label: string }[] = [
  { id: "by-cc", label: "By Cost Centre" },
  { id: "by-month", label: "P&L by Month" },
  { id: "by-category", label: "By Category" },
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

// ── P&L by Cost Centre (existing) ──────────────────────────────────────────────

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
        <div key={l.accountCode} className="grid grid-cols-[auto_1fr_auto] gap-2 items-baseline pl-4">
          <span className="text-[10px] font-mono text-muted-foreground w-16 shrink-0">{l.accountCode}</span>
          <span className="text-xs text-muted-foreground truncate">{l.accountName}</span>
          <span className={`text-xs font-mono tabular-nums ${color}`}>{fmt(l.total)}</span>
        </div>
      ))}
    </div>
  );
}

function CostCentreCard({ cc }: {
  cc: {
    code: string; name: string; revenue: number; costs: number; net: number;
    revenueLines: { accountCode: string; accountName: string; total: number }[];
    costLines: { accountCode: string; accountName: string; total: number }[];
  };
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
              <AccountLines lines={cc.revenueLines} kind="revenue" />
            </div>
          )}
          {cc.costLines.length > 0 && (
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-red-700 mb-1">Cost lines</p>
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

function TabByCc({ from, to }: { from: string; to: string }) {
  const { data, isLoading, isError } = useGetBookkeeperPnl(
    { from, to },
    { query: { queryKey: getGetBookkeeperPnlQueryKey({ from, to }) } },
  );

  const agencyTotals = data?.agencyTotals ?? { revenue: 0, costs: 0, net: 0 };
  const activeCostCentres = (data?.costCentres ?? []).filter(
    (cc) => cc.revenue !== 0 || cc.costs !== 0,
  );

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  if (isError) return <Alert variant="destructive"><AlertDescription>Failed to load P&amp;L data.</AlertDescription></Alert>;
  if (!data) return null;

  return (
    <>
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
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">By cost centre — click any row to expand account detail</p>
          {activeCostCentres.map((cc) => <CostCentreCard key={cc.code} cc={cc} />)}
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

// ── P&L by Month bar chart ──────────────────────────────────────────────────────

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

  return (
    <div className="space-y-6">
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

      <div className="rounded-xl border border-border bg-card p-4 pt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">Revenue vs Costs — monthly</p>
        <ResponsiveContainer width="100%" height={320}>
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
        </table>
      </div>
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
          Click column headers to sort · {data.rows.length} accounts
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
              <tr key={row.accountCode} className={`border-b border-border/50 ${i % 2 === 1 ? "bg-muted/20" : ""}`}>
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

export default function Pnl() {
  const { data: me, isLoading: meLoading } = useGetBookkeeperMe();

  const [tab, setTab] = useState<TabId>("by-cc");
  const [preset, setPreset] = useState<string>("This year");
  const [from, setFrom] = useState(thisYear().from);
  const [to, setTo] = useState(thisYear().to);

  const isAllowed = me?.role === "owner" || me?.role === "bookkeeper";

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
        <Button variant="outline" size="sm" onClick={() => window.print()} className="flex items-center gap-2 shrink-0 self-start print:hidden">
          <Printer className="w-4 h-4" />
          Print / PDF
        </Button>
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
    </div>
  );
}
