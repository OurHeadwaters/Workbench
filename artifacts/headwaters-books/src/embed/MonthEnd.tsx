import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmbedShell } from "./EmbedShell";
import { SAMPLE, formatCAD, netByCostCentre } from "./sampleData";

/**
 * /embed/month-end
 *
 * What the bookkeeper hands the band council each month. Cost-centre
 * P&L, the top variances, and a sign-off line. The screen is built
 * to BE the printable single-page summary the council reads at the
 * monthly meeting.
 */
export default function MonthEnd() {
  const byCC = netByCostCentre(SAMPLE.transactions);
  const ccByCode = new Map(SAMPLE.costCentres.map((c) => [c.code, c]));
  const totalRevenue = byCC.reduce((s, r) => s + r.revenue, 0);
  const totalCosts = byCC.reduce((s, r) => s + r.costs, 0);
  const totalNet = totalRevenue + totalCosts;

  return (
    <EmbedShell
      eyebrow="Month-end pack"
      title={`Council pack · ${SAMPLE.period}`}
      caption={`Prepared by the bookkeeper, presented to ${SAMPLE.signOff.presentedTo}. Cost-centre P&L on top, top variances below, sign-off at the foot.`}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-serif">Cost-centre P&amp;L</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cost centre</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Costs</TableHead>
                <TableHead className="text-right">Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byCC.map((row) => {
                const cc = ccByCode.get(row.costCentreCode);
                return (
                  <TableRow key={row.costCentreCode} data-testid={`pnl-row-${row.costCentreCode}`}>
                    <TableCell>
                      <div className="text-sm font-medium">{cc?.name ?? row.costCentreCode}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{row.costCentreCode}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-primary">
                      {formatCAD(row.revenue)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-destructive">
                      {formatCAD(row.costs)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono text-sm font-semibold ${
                        row.net >= 0 ? "text-primary" : "text-destructive"
                      }`}
                    >
                      {formatCAD(row.net)}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="border-t-2 border-border">
                <TableCell className="font-semibold">Total</TableCell>
                <TableCell className="text-right font-mono font-semibold">{formatCAD(totalRevenue)}</TableCell>
                <TableCell className="text-right font-mono font-semibold">{formatCAD(totalCosts)}</TableCell>
                <TableCell
                  className={`text-right font-mono font-semibold ${
                    totalNet >= 0 ? "text-primary" : "text-destructive"
                  }`}
                >
                  {formatCAD(totalNet)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-serif">Top variances · what to talk about</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-3">
            {SAMPLE.variances.map((v, i) => {
              const delta = v.actual - v.budgeted;
              const overBudget = delta < 0;
              return (
                <li
                  key={i}
                  className="border-b border-border pb-3 last:border-0 last:pb-0"
                  data-testid={`variance-row-${i}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground">{v.line}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{v.costCentreCode}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-sm font-medium ${overBudget ? "text-destructive" : "text-primary"}`}>
                        {formatCAD(delta)}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        Budget {formatCAD(v.budgeted)} · Actual {formatCAD(v.actual)}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">{v.note}</p>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-serif">Sign-off</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-sm">
          <p className="text-muted-foreground">{SAMPLE.signOff.line}</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <SignLine label="Prepared by" name={SAMPLE.signOff.preparedBy} />
            <SignLine label="Presented to" name={SAMPLE.signOff.presentedTo} />
          </div>
        </CardContent>
      </Card>
    </EmbedShell>
  );
}

function SignLine({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <div className="font-mono uppercase tracking-[0.16em] text-[10px] text-muted-foreground mb-2">{label}</div>
      <div className="border-b border-foreground/40 h-6" />
      <div className="text-[11px] text-muted-foreground mt-1">{name}</div>
    </div>
  );
}
