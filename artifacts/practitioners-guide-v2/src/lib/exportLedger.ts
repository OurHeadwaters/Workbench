import * as XLSX from "xlsx";
import type { LedgerExport, LedgerSheet } from "@/data/saltLedger";

function csvEscape(v: string | number | undefined): string {
  if (v === undefined || v === null || v === "") return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function sheetToCsv(sheet: LedgerSheet): string {
  const header = sheet.asOf ? `# ${sheet.name} — ${sheet.asOf}` : `# ${sheet.name}`;
  const body = sheet.rows.map((r) => r.map(csvEscape).join(",")).join("\n");
  return `${header}\n${body}`;
}

export function exportLedgerCsv(ledger: LedgerExport): void {
  const banner = ledger.asOf
    ? `# Ledger as of: ${ledger.asOf}\n# Locked rows only — non-locked lines are excluded.\n\n`
    : "";
  const text = banner + ledger.sheets.map(sheetToCsv).join("\n\n");
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, `${ledger.filenameBase}.csv`);
}

export function exportLedgerXlsx(ledger: LedgerExport): void {
  const wb = XLSX.utils.book_new();
  for (const sheet of ledger.sheets) {
    const sheetRows: (string | number)[][] = [];
    if (sheet.asOf) {
      sheetRows.push(["As of:", sheet.asOf]);
      sheetRows.push([]);
    }
    sheetRows.push(...sheet.rows);
    const ws = XLSX.utils.aoa_to_sheet(sheetRows);
    const safeName = sheet.name.replace(/[\\/?*[\]:]/g, " ").slice(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, safeName);
  }
  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([out], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  triggerDownload(blob, `${ledger.filenameBase}.xlsx`);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
