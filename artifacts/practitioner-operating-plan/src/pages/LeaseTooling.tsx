import { useEffect, useState } from "react";

import {
  leaseToolingActions,
  leaseToolingTotals,
  type LeaseToolingAction,
} from "@/data/leaseToolingActions";

const STORAGE_KEY = "dad-lease-checklist-v1";

function loadChecks(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, boolean>;
    }
    return {};
  } catch {
    return {};
  }
}

function fmtRange(lo: number, hi: number): string {
  if (lo === hi) return `$${lo}`;
  return `$${lo}–$${hi}`;
}

function fmtCadRange(lo: number, hi: number): string {
  return `${fmtRange(lo, hi)} CAD`;
}

export default function LeaseTooling() {
  const [checks, setChecks] = useState<Record<string, boolean>>(() =>
    loadChecks(),
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
    } catch {
      // ignore quota / privacy-mode failures
    }
  }, [checks]);

  const toggle = (num: string) => {
    setChecks((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const reset = () => {
    setChecks({});
  };

  const completed = leaseToolingActions.filter((a) => checks[a.num]).length;

  const onPrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const pdfHref = `${import.meta.env.BASE_URL}dad-lease-checklist.pdf`;

  return (
    <div className="onepager-screen checklist">
      <div className="onepager-sheet">
        <div className="flex items-baseline justify-between border-b border-[#c8bfa7] pb-[8pt] mb-[10pt] print:pb-[4pt] print:mb-[4pt]">
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[1pt] print:text-[7pt] print:mb-[1pt]">
              Headwaters · Dad-lease CRA tooling
            </div>
            <div className="font-display italic text-[8.5pt] text-[#1f3d2e] mb-[3pt] leading-[1.25] print:text-[7pt] print:mb-[2pt]">
              We've always known how to fix it, now we can.
            </div>
            <h1 className="font-display text-[19pt] leading-[1.05] tracking-tight text-[#1f3d2e] font-semibold print:text-[12pt]">
              Ten items to set the related-party rent up clean.
            </h1>
          </div>
          <div className="text-right text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:text-[7pt]">
            <div>Working doc / print version</div>
            <div className="mt-[2pt] text-[#1f3d2e] font-semibold tracking-[0.16em]">
              {completed} of {leaseToolingActions.length} done
            </div>
          </div>
        </div>

        <div className="print-hide flex items-center justify-between gap-[8pt] mb-[10pt] text-[9pt]">
          <div className="text-[#6b7665]">
            Tap anywhere on a row to mark it done. Your checks are saved on
            this device.
          </div>
          <div className="flex gap-[6pt]">
            <button
              type="button"
              onClick={reset}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#c8bfa7] text-[#6b7665] hover:bg-[#ebe2d0]"
            >
              Reset
            </button>
            <a
              href={pdfHref}
              download="dad-lease-checklist.pdf"
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#1f3d2e] text-[#1f3d2e] hover:bg-[#ebe2d0]"
            >
              Download PDF
            </a>
            <button
              type="button"
              onClick={onPrint}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded bg-[#1f3d2e] text-[#f4ede0] hover:opacity-90"
            >
              Print
            </button>
          </div>
        </div>

        <ol className="list-none p-0 m-0">
          {leaseToolingActions.map((a) => (
            <LeaseToolingRow
              key={a.num}
              action={a}
              checked={Boolean(checks[a.num])}
              onToggle={() => toggle(a.num)}
            />
          ))}
        </ol>

        <div className="mt-[10pt] mb-[8pt] grid grid-cols-1 sm:grid-cols-2 gap-[10pt] print:mt-[4pt] print:mb-[3pt] print:gap-[5pt]">
          <div className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] print:p-[3pt]">
            <div className="font-mono uppercase tracking-[0.2em] text-[7.5pt] text-[#b85a3e] font-semibold mb-[3pt] print:text-[5.5pt] print:mb-[0.5pt]">
              Cash out before signing
            </div>
            <div className="font-display text-[14pt] text-[#1f3d2e] font-semibold leading-tight print:text-[10pt]">
              {fmtCadRange(
                leaseToolingTotals.oneTimeMin,
                leaseToolingTotals.oneTimeMax,
              )}
            </div>
            <div className="text-[8pt] text-[#6b7665] mt-[2pt] leading-[1.35] print:text-[6.5pt] print:leading-[1.15] print:mt-[0.5pt]">
              One-time: optional commercial-lease review by a local Dryden or
              Sioux Lookout lawyer.
            </div>
          </div>
          <div className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] print:p-[3pt]">
            <div className="font-mono uppercase tracking-[0.2em] text-[7.5pt] text-[#b85a3e] font-semibold mb-[3pt] print:text-[5.5pt] print:mb-[0.5pt]">
              Recurring after that
            </div>
            <div className="font-display text-[14pt] text-[#1f3d2e] font-semibold leading-tight print:text-[10pt]">
              {fmtCadRange(
                leaseToolingTotals.monthlyMin,
                leaseToolingTotals.monthlyMax,
              )}
              <span className="text-[10pt] font-normal text-[#6b7665] print:text-[7pt]">
                {" "}/ month
              </span>
            </div>
            <div className="text-[8pt] text-[#6b7665] mt-[2pt] leading-[1.35] print:text-[6.5pt] print:leading-[1.15] print:mt-[0.5pt]">
              Tenant insurance (contents + commercial general liability with
              Dad named as additional insured). Rent itself is $2,200 + utilities,
              tracked on the budget line.
            </div>
          </div>
        </div>

        <div
          className="mt-[6pt] p-[8pt] rounded-[3pt] print:mt-[2pt] print:py-[3pt] print:px-[6pt]"
          style={{ background: "#1f3d2e", color: "#f4ede0" }}
        >
          <div
            className="font-mono uppercase tracking-[0.2em] text-[8pt] font-semibold mb-[5pt] print:text-[6pt] print:mb-[1pt]"
            style={{ color: "#e9c8a8" }}
          >
            Why the paperwork matters — related-party CRA notes
          </div>
          <ul className="list-none p-0 m-0 space-y-[4pt] print:space-y-[0.5pt]">
            <li className="font-display text-[9.5pt] leading-[1.35] print:text-[6.5pt] print:leading-[1.15]">
              <span className="font-semibold">Related party.</span> Landlord is
              Bobbie's father. Same arm's-length documentation rules apply as
              any other commercial lease — paperwork protects the deduction
              and the relationship.
            </li>
            <li className="font-display text-[9.5pt] leading-[1.35] print:text-[6.5pt] print:leading-[1.15]">
              <span className="font-semibold">Fair-market rent.</span> $2,200/mo
              predates Headwaters; document that history plus two or three
              current comparables. Below-market is fine — Headwaters only
              deducts what it actually pays.
            </li>
            <li className="font-display text-[9.5pt] leading-[1.35] print:text-[6.5pt] print:leading-[1.15]">
              <span className="font-semibold">HST.</span> Commercial rent is
              HST-taxable in Ontario. If Dad is registered (or registers
              voluntarily), Headwaters claims it back as an input tax credit —
              wash in cash, clean on paper. Confirm his status before the first
              invoice.
            </li>
            <li className="font-display text-[9.5pt] leading-[1.35] print:text-[6.5pt] print:leading-[1.15]">
              <span className="font-semibold">Written before the cheque.</span>{" "}
              Get the lease signed and the working folder filed before the
              first rent payment moves. Easier to set up clean than to clean
              up later.
            </li>
          </ul>
        </div>

        <div className="border-t border-[#c8bfa7] mt-[8pt] pt-[5pt] flex items-center justify-between text-[7.5pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:mt-[3pt] print:pt-[2pt] print:text-[6pt]">
          <div>
            Source: Dad-warehouse aggregation hub working doc
          </div>
          <div className="text-[#1f3d2e] font-semibold">
            Headwaters · Dad-lease tooling
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaseToolingRow({
  action,
  checked,
  onToggle,
}: {
  action: LeaseToolingAction;
  checked: boolean;
  onToggle: () => void;
}) {
  // Whole-row tap toggles done state, except when the user is actually
  // clicking a link inside the row (which should open it).
  const onRowClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest("a")) return;
    onToggle();
  };

  return (
    <li
      onClick={onRowClick}
      className="border border-[#c8bfa7] rounded-[3pt] mb-[6pt] p-[8pt] flex gap-[8pt] items-start cursor-pointer hover:bg-[#f1e8d4] print:cursor-auto print:hover:bg-transparent print:mb-[1.5pt] print:p-[3pt] print:gap-[4pt]"
      style={{
        background: checked ? "#ebe2d0" : "transparent",
      }}
    >
      <span
        role="checkbox"
        aria-checked={checked}
        aria-label={`Mark "${action.title}" as ${checked ? "not done" : "done"}`}
        className="print-hide shrink-0 w-[18pt] h-[18pt] rounded-[2pt] border-[1.5px] border-[#1f3d2e] flex items-center justify-center bg-white"
      >
        {checked && (
          <span className="font-mono text-[12pt] text-[#1f3d2e] leading-none">
            ✓
          </span>
        )}
      </span>
      <span
        aria-hidden
        className="hidden print:inline-flex shrink-0 w-[14pt] h-[14pt] rounded-[2pt] border-[1.5px] border-[#1f3d2e] items-center justify-center"
      >
        {checked && (
          <span className="font-mono text-[10pt] text-[#1f3d2e] leading-none">
            ✓
          </span>
        )}
      </span>

      <div className="shrink-0 font-mono text-[9pt] text-[#b85a3e] font-semibold pt-[1pt] print:text-[7pt] print:pt-0">
        {action.num}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-[8pt] mb-[2pt] print:mb-[0.5pt]">
          <div className="font-mono uppercase tracking-[0.2em] text-[7.5pt] text-[#b85a3e] font-semibold print:text-[5.5pt]">
            {action.when}
          </div>
          <div className="font-mono text-[7.5pt] text-[#6b7665] shrink-0 print:text-[5.5pt]">
            {action.cost}
          </div>
        </div>
        <div
          className="font-display text-[11pt] text-[#1f3d2e] font-semibold leading-tight mb-[2pt] print:text-[8.5pt] print:mb-[0.5pt]"
          style={{
            textDecoration: checked ? "line-through" : "none",
            opacity: checked ? 0.65 : 1,
          }}
        >
          {action.title}
        </div>
        <div className="font-body text-[9pt] text-[#2a2520] leading-[1.4] print:text-[6.5pt] print:leading-[1.2]">
          {action.detail}
        </div>
        {action.link && (
          <div className="mt-[3pt] print:mt-[1pt]">
            <a
              href={action.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[8pt] text-[#1f3d2e] underline decoration-[#b85a3e] decoration-1 underline-offset-2 hover:opacity-80 break-all print:text-[7pt] print:no-underline"
            >
              {action.linkLabel ?? action.link}
            </a>
          </div>
        )}
      </div>
    </li>
  );
}
