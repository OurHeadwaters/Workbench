import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmbedShell } from "./EmbedShell";
import { SAMPLE, formatCAD } from "./sampleData";

/**
 * /embed/daily-close
 *
 * What the operator couple does at end-of-day. Cash drawer count,
 * deposit slip line, and items kicked to the bookkeeper for next-
 * morning review. The whole screen reads in one sitting because
 * that's the discipline of the close.
 */
export default function DailyClose() {
  const c = SAMPLE.dailyClose;
  const variance = c.countedDrawer - c.expectedDrawer;

  return (
    <EmbedShell
      eyebrow="Daily close"
      title="End of day · ready in five minutes"
      caption={`The operator couple closes the till every night. ${SAMPLE.closingDay}. Cash to the float line, deposit prepared, anything tricky kicked to the bookkeeper.`}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-serif">Cash drawer</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <dl className="space-y-2.5 text-sm">
            <Row label="Opening float" value={formatCAD(c.openingFloat)} />
            <Row label="Cash sales" value={formatCAD(c.cashSales)} tone="ok" />
            <Row label="Cash refunds" value={formatCAD(c.cashRefunds)} tone="cost" />
            <Row label="Expected drawer" value={formatCAD(c.expectedDrawer)} bold />
            <Row label="Counted drawer" value={formatCAD(c.countedDrawer)} bold />
            <Row
              label="Over / short"
              value={formatCAD(variance)}
              tone={variance < 0 ? "cost" : variance > 0 ? "ok" : "neutral"}
              bold
            />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-serif">Deposit slip</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2.5 text-sm">
          <Row label="To the bank" value={formatCAD(c.depositToBank)} bold tone="ok" />
          <Row label="Held back as float" value={formatCAD(c.floatRetained)} />
          <p className="text-xs text-muted-foreground pt-1">
            Bank bag sealed, signed by both operators, dropped in the night box on the way home.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-serif">Kicked to the bookkeeper</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {c.kickedToBookkeeper.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing kicked tonight.</p>
          ) : (
            <ul className="space-y-3">
              {c.kickedToBookkeeper.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                  data-testid={`kicked-row-${i}`}
                >
                  <span className="text-sm text-foreground">{item.note}</span>
                  <span className="text-sm font-medium text-destructive shrink-0">
                    {formatCAD(item.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
            Anything the operators are unsure about goes here, untouched, for the bookkeeper to clean up the next morning.
          </p>
        </CardContent>
      </Card>
    </EmbedShell>
  );
}

function Row({
  label,
  value,
  tone = "neutral",
  bold = false,
}: {
  label: string;
  value: string;
  tone?: "ok" | "cost" | "neutral";
  bold?: boolean;
}) {
  const valColor =
    tone === "ok" ? "text-primary" : tone === "cost" ? "text-destructive" : "text-foreground";
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className={`text-muted-foreground ${bold ? "font-medium text-foreground" : ""}`}>{label}</dt>
      <dd className={`font-mono ${bold ? "font-semibold" : ""} ${valColor}`}>{value}</dd>
    </div>
  );
}
