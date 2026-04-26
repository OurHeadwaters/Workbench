import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  exportLedgerCsv,
  exportLedgerXlsx,
} from "@/lib/exportLedger";
import type { LedgerExport } from "@/data/saltLedger";

interface ExportLedgerButtonsProps {
  buildLedger: () => LedgerExport;
  testIdPrefix: string;
}

export function ExportLedgerButtons({
  buildLedger,
  testIdPrefix,
}: ExportLedgerButtonsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      data-testid={`${testIdPrefix}-export-ledger`}
    >
      <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground mr-1">
        Export ledger
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportLedgerCsv(buildLedger())}
        data-testid={`${testIdPrefix}-export-csv`}
      >
        <Download className="h-3.5 w-3.5" /> CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportLedgerXlsx(buildLedger())}
        data-testid={`${testIdPrefix}-export-xlsx`}
      >
        <FileSpreadsheet className="h-3.5 w-3.5" /> XLSX
      </Button>
    </div>
  );
}
