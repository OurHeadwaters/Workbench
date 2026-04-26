import {
  comparisonRows,
  literate,
  codetry,
  thesis,
  ethos,
  lineageAttribution,
  canonicalLinks,
} from "@/data/codetryVsLiterate";
import type { Discipline, ComparisonRow } from "@/data/codetryVsLiterate";

// Standalone square sheet — no app shell, no nav, no sidebar. Lives at
// /codetry-vs-literate inside the practitioner-operating-plan artifact
// because the project is at the platform's 7-artifact ceiling; same
// chrome-free pattern used by /codetry, /onepager, /payback-memo.
//
// Audience: enthusiasts — the remnant. Not pitched at funders or
// clients. Designed as a zine page worth pinning to a wall: header
// strip + 1:1 square holding the comparison + footer strip.
export default function CodetryVsLiterate() {
  const onPrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="square-screen">
      <div className="square-page">
        <div className="square-header">
          <div className="flex items-baseline justify-between gap-[12pt]">
            <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665]">
              Sheet · Companion to /codetry
            </div>
            <button
              type="button"
              onClick={onPrint}
              className="print-hide font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded bg-[#1f3d2e] text-[#f4ede0] hover:opacity-90"
            >
              Print
            </button>
          </div>
          <h1 className="mt-[6pt] font-display text-[20pt] leading-[1.05] tracking-tight text-[#1f3d2e] font-semibold">
            Codetry <span className="text-[#6b7665] font-normal">vs.</span>{" "}
            Literate Programming
          </h1>
          <p className="mt-[5pt] font-body text-[10.5pt] italic text-[#2a2520] leading-[1.4]">
            {thesis}
          </p>
        </div>

        <div className="square-frame">
          <div className="square-col square-col-left">
            <ColumnHeader
              discipline={literate}
              attribution="Donald Knuth, 1984"
            />
            {comparisonRows.map((row) => (
              <Row key={`literate-${row.label}`} row={row} side="literate" />
            ))}
            <WorkedExampleBlock
              label="Worked example, named"
              example={literate.workedExample}
            />
          </div>

          <div className="square-spine" aria-hidden="true" />

          <div className="square-col square-col-right">
            <ColumnHeader
              discipline={codetry}
              attribution="Coined in this constellation"
            />
            {comparisonRows.map((row) => (
              <Row key={`codetry-${row.label}`} row={row} side="codetry" />
            ))}
            <WorkedExampleBlock
              label="Worked example, named"
              example={codetry.workedExample}
            />
          </div>
        </div>

        <div className="square-footer">
          <div className="border-t border-[#c8bfa7] pt-[6pt] mt-[2pt]">
            <p className="font-body text-[9pt] italic text-[#1f3d2e] leading-[1.4]">
              {ethos}
            </p>
            <p className="mt-[4pt] font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665] leading-[1.45]">
              {lineageAttribution}
            </p>
            <p className="mt-[4pt] font-mono text-[7.5pt] text-[#6b7665] leading-[1.45]">
              <span className="uppercase tracking-[0.18em] text-[#1f3d2e] mr-[4pt]">
                Canonical
              </span>
              <span>{canonicalLinks.codetryDoc}</span>
              <span className="mx-[4pt] text-[#c8bfa7]">·</span>
              <span>{canonicalLinks.manifest}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColumnHeader({
  discipline,
  attribution,
}: {
  discipline: Discipline;
  attribution: string;
}) {
  return (
    <div className="pb-[6pt] border-b border-[#c8bfa7]">
      <div className="font-mono uppercase tracking-[0.22em] text-[7.5pt] text-[#6b7665]">
        {attribution}
      </div>
      <div className="mt-[2pt] font-display text-[14pt] leading-[1.05] tracking-tight text-[#1f3d2e] font-semibold">
        {discipline.name}
      </div>
    </div>
  );
}

function Row({
  row,
  side,
}: {
  row: ComparisonRow;
  side: "literate" | "codetry";
}) {
  const body = side === "literate" ? row.literate : row.codetry;
  return (
    <div className="square-row">
      <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#1f3d2e]">
        {row.label}
      </div>
      <p className="mt-[2pt] font-body text-[9.25pt] text-[#2a2520] leading-[1.4]">
        {body}
      </p>
    </div>
  );
}

function WorkedExampleBlock({
  label,
  example,
}: {
  label: string;
  example: { name: string; body: string };
}) {
  return (
    <div className="square-row pt-[4pt] border-t border-[#e3dac4]">
      <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#1f3d2e]">
        {label}
      </div>
      <div className="mt-[2pt] font-display text-[11pt] text-[#1f3d2e] font-semibold leading-tight">
        {example.name}
      </div>
      <p className="mt-[2pt] font-body text-[9.25pt] text-[#2a2520] leading-[1.4] italic">
        {example.body}
      </p>
    </div>
  );
}
