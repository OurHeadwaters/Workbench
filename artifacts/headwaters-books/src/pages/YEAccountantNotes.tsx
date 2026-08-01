/**
 * YEAccountantNotes — Year-End Notes to Accountant
 *
 * Owner-authored notes the accountant receives at year-end filing.
 * Append-only log: new notes are added to yeAccountantNotes.ts.
 * Print-clean: nav chrome hidden on print.
 */

import { Printer, ExternalLink, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { YE_NOTES, type YENote } from "@/data/yeAccountantNotes";

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: YENote["status"] }) {
  if (status === "needs-review") {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold font-mono border border-amber-300 bg-amber-50 text-amber-800">
        Needs accountant review
      </span>
    );
  }
  if (status === "actioned") {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold font-mono border border-emerald-300 bg-emerald-50 text-emerald-800">
        Actioned
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold font-mono border border-blue-200 bg-blue-50 text-blue-800">
      Monitoring
    </span>
  );
}

// ── Note card ─────────────────────────────────────────────────────────────────

function NoteCard({ note, index }: { note: YENote; index: number }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Card header */}
      <div className="px-5 py-4 border-b border-border bg-muted/30 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono font-bold border border-border bg-background text-muted-foreground mt-0.5"
          >
            {index + 1}
          </span>
          <div>
            <h2
              className="text-lg font-semibold leading-tight"
              style={{ fontFamily: "var(--font-serif, serif)" }}
            >
              {note.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-[0.15em] border border-blue-200 bg-blue-50 text-blue-800">
                {note.entity}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {note.taxContext}
              </span>
            </div>
          </div>
        </div>
        <StatusBadge status={note.status} />
      </div>

      {/* Card body */}
      <div className="px-5 py-4 space-y-3">
        {note.body.map((para, i) => (
          <p key={i} className="text-sm text-muted-foreground leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {/* Reference link */}
      <div className="px-5 pb-4">
        <a
          href={note.referenceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline underline-offset-2"
          aria-label={`${note.referenceLabel} (opens in a new tab)`}
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          {note.referenceLabel}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function YEAccountantNotes() {
  return (
    <div className="space-y-8 pb-16 print:pb-4 max-w-4xl">

      {/* Screen header */}
      <div className="flex justify-between items-start print:hidden">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Accountant &amp; Bookkeeper
          </p>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-serif, serif)" }}
          >
            Year-End Notes to Accountant
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
            Owner-authored instructions for the accountant at year-end filing.
            Each note is a standing flag or action item that requires accountant
            judgment — not handled inline by the bookkeeper.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="flex items-center gap-2 shrink-0"
        >
          <Printer className="w-4 h-4" aria-hidden="true" />
          Print / PDF
        </Button>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-serif, serif)" }}
        >
          Year-End Notes to Accountant — Headwaters Books
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Owner instructions for year-end filing · Headwaters Ontario Corp
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Printed {new Date().toLocaleDateString("en-CA")}
        </p>
      </div>

      {/* Introductory alert */}
      <Alert className="border-amber-200 bg-amber-50 print:border print:border-amber-300">
        <StickyNote className="h-4 w-4 text-amber-700" aria-hidden="true" />
        <AlertDescription className="text-xs text-amber-900 leading-relaxed">
          <strong>Owner-to-accountant instruction log.</strong> These notes are
          written by the owner and addressed to the accountant. Each note
          identifies a potential credit, risk, or filing action that requires
          professional judgment. The bookkeeper prepares the books; the
          accountant acts on these notes at year-end filing.
        </AlertDescription>
      </Alert>

      {/* Notes list */}
      <section className="space-y-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Standing notes · {YE_NOTES.length} item{YE_NOTES.length !== 1 ? "s" : ""}
        </p>
        {YE_NOTES.map((note, i) => (
          <NoteCard key={note.id} note={note} index={i} />
        ))}
      </section>

      {/* Print styles */}
      <style>{`
        @media print {
          aside, header, footer, .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          body { background: white; }
          a[href]::after { content: none; }
        }
      `}</style>
    </div>
  );
}
