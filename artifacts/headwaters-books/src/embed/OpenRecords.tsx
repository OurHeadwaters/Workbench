import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmbedShell } from "./EmbedShell";
import {
  SAMPLE,
  formatCAD,
  netByCostCentre,
  sumAmounts,
  type SampleTransaction,
} from "./sampleData";

/**
 * /embed/open-records
 *
 * What the band and the public can see at any time. Running totals
 * by cost centre + a recent-postings list. Built so a councillor
 * scrolling the walkthrough sees, in one screen, that the books are
 * actually open.
 */
export default function OpenRecords() {
  const txns = SAMPLE.transactions;
  const recent = [...txns]
    .filter((t) => t.source !== "bank")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  const revenue = sumAmounts(txns.filter((t) => t.amount > 0 && t.source !== "bank"));
  const costs = sumAmounts(txns.filter((t) => t.amount < 0 && t.source !== "bank"));
  const surplus = revenue + costs;

  const byCC = netByCostCentre(txns);
  const ccByCode = new Map(SAMPLE.costCentres.map((c) => [c.code, c]));

  return (
    <EmbedShell
      eyebrow="Open-records ledger"
      title="The books, open to the band"
      caption="Anyone can see this screen — the chief, council, the band membership, the public. No login. Running totals and recent postings, refreshed on every entry."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <TotalCard label="Revenue this period" value={formatCAD(revenue)} tone="ok" />
        <TotalCard label="Costs this period" value={formatCAD(costs)} tone="cost" />
        <TotalCard label="Net surplus" value={formatCAD(surplus)} tone={surplus >= 0 ? "ok" : "cost"} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-serif">By cost centre</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {byCC.map((row) => {
              const cc = ccByCode.get(row.costCentreCode);
              return (
                <div
                  key={row.costCentreCode}
                  className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                  data-testid={`cc-row-${row.costCentreCode}`}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground">{cc?.name ?? row.costCentreCode}</div>
                    <div className="text-xs text-muted-foreground font-mono">{row.costCentreCode}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-sm font-medium ${row.net >= 0 ? "text-primary" : "text-destructive"}`}>
                      {formatCAD(row.net)}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Rev {formatCAD(row.revenue)} · Cost {formatCAD(row.costs)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-serif">Recent postings</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[88px]">Date</TableHead>
                <TableHead>What</TableHead>
                <TableHead className="hidden sm:table-cell">Cost centre</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((t, i) => (
                <PostingRow key={`${t.date}-${i}`} t={t} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </EmbedShell>
  );
}

function TotalCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ok" | "cost";
}) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground mb-1.5">
          {label}
        </div>
        <div className={`text-xl font-semibold ${tone === "ok" ? "text-primary" : "text-destructive"}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

function PostingRow({ t }: { t: SampleTransaction }) {
  const positive = t.amount >= 0;
  return (
    <TableRow>
      <TableCell className="font-mono text-xs text-muted-foreground">{t.date.slice(5)}</TableCell>
      <TableCell>
        <div className="text-sm">{t.description}</div>
        <div className="sm:hidden text-[11px] text-muted-foreground font-mono mt-0.5">{t.costCentreCode}</div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Badge variant="outline" className="font-mono text-[10px]">{t.costCentreCode}</Badge>
      </TableCell>
      <TableCell className={`text-right text-sm font-medium ${positive ? "text-primary" : "text-destructive"}`}>
        {formatCAD(t.amount)}
      </TableCell>
    </TableRow>
  );
}
