import { useEffect, useState } from "react";

import {
  namingActionTotals,
  namingActions,
  type NamingAction,
} from "@/data/namingActions";

const STORAGE_KEY = "headwaters-checklist-v1";

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

export default function Checklist() {
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

  const completed = namingActions.filter((a) => checks[a.num]).length;

  const onPrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const pdfHref = `${import.meta.env.BASE_URL}headwaters-checklist.pdf`;

  return (
    <div className="onepager-screen checklist">
      <div className="onepager-sheet">
        <div className="flex items-baseline justify-between border-b border-[#c8bfa7] pb-[8pt] mb-[10pt]">
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[3pt]">
              Headwaters · This-Week Action Checklist
            </div>
            <h1 className="font-display text-[19pt] leading-[1.05] tracking-tight text-[#1f3d2e] font-semibold">
              Six items, in order. Domains today, agent before any filing.
            </h1>
          </div>
          <div className="text-right text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665]">
            <div>Carry / print version</div>
            <div className="mt-[2pt] text-[#1f3d2e] font-semibold tracking-[0.16em]">
              {completed} of {namingActions.length} done
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
              download="headwaters-checklist.pdf"
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
          {namingActions.map((a) => (
            <ChecklistRow
              key={a.num}
              action={a}
              checked={Boolean(checks[a.num])}
              onToggle={() => toggle(a.num)}
            />
          ))}
        </ol>

        <div className="mt-[10pt] mb-[8pt] grid grid-cols-1 sm:grid-cols-2 gap-[10pt]">
          <div className="border border-[#c8bfa7] rounded-[3pt] p-[8pt]">
            <div className="font-mono uppercase tracking-[0.2em] text-[7.5pt] text-[#b85a3e] font-semibold mb-[3pt]">
              Cash out this week
            </div>
            <div className="font-display text-[14pt] text-[#1f3d2e] font-semibold leading-tight">
              {fmtCadRange(
                namingActionTotals.oneTimeMin,
                namingActionTotals.oneTimeMax,
              )}
            </div>
            <div className="text-[8pt] text-[#6b7665] mt-[2pt] leading-[1.35]">
              One-time: domains, defensive registrations, trademark agent
              opinion, NUANS search.
            </div>
          </div>
          <div className="border border-[#c8bfa7] rounded-[3pt] p-[8pt]">
            <div className="font-mono uppercase tracking-[0.2em] text-[7.5pt] text-[#b85a3e] font-semibold mb-[3pt]">
              Recurring after that
            </div>
            <div className="font-display text-[14pt] text-[#1f3d2e] font-semibold leading-tight">
              {fmtCadRange(
                namingActionTotals.monthlyMin,
                namingActionTotals.monthlyMax,
              )}
              <span className="text-[10pt] font-normal text-[#6b7665]">
                {" "}/ month
              </span>
            </div>
            <div className="text-[8pt] text-[#6b7665] mt-[2pt] leading-[1.35]">
              Google Workspace for you@headwaters.ca. Domains renew yearly at
              cost.
            </div>
          </div>
        </div>

        <div
          className="mt-[6pt] p-[8pt] rounded-[3pt] flex items-baseline justify-between gap-[10pt]"
          style={{ background: "#1f3d2e", color: "#f4ede0" }}
        >
          <div
            className="font-mono uppercase tracking-[0.2em] text-[8pt] font-semibold shrink-0"
            style={{ color: "#e9c8a8" }}
          >
            Rule of sequence
          </div>
          <div className="font-display italic text-[10pt] leading-[1.35] text-right">
            Buying domains doesn't lock you in. Filing a trademark does. Don't
            sequence those backwards.
          </div>
        </div>

        <div className="border-t border-[#c8bfa7] mt-[8pt] pt-[5pt] flex items-center justify-between text-[7.5pt] font-mono uppercase tracking-[0.18em] text-[#6b7665]">
          <div>
            Source: Practitioner Operating Plan, slide III · 04
          </div>
          <div className="text-[#1f3d2e] font-semibold">
            Headwaters · Action Checklist
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistRow({
  action,
  checked,
  onToggle,
}: {
  action: NamingAction;
  checked: boolean;
  onToggle: () => void;
}) {
  // Whole-row tap toggles done state, except when the user is actually
  // clicking a link inside the row (which should open the registrar).
  const onRowClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest("a")) return;
    onToggle();
  };

  return (
    <li
      onClick={onRowClick}
      className="border border-[#c8bfa7] rounded-[3pt] mb-[6pt] p-[8pt] flex gap-[8pt] items-start cursor-pointer hover:bg-[#f1e8d4] print:cursor-auto print:hover:bg-transparent"
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
        className="hidden print:inline-flex shrink-0 w-[18pt] h-[18pt] rounded-[2pt] border-[1.5px] border-[#1f3d2e] items-center justify-center"
      >
        {checked && (
          <span className="font-mono text-[12pt] text-[#1f3d2e] leading-none">
            ✓
          </span>
        )}
      </span>

      <div className="shrink-0 font-mono text-[9pt] text-[#b85a3e] font-semibold pt-[1pt]">
        {action.num}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-[8pt] mb-[2pt]">
          <div className="font-mono uppercase tracking-[0.2em] text-[7.5pt] text-[#b85a3e] font-semibold">
            {action.when}
          </div>
          <div className="font-mono text-[7.5pt] text-[#6b7665] shrink-0">
            {action.cost}
          </div>
        </div>
        <div
          className="font-display text-[11pt] text-[#1f3d2e] font-semibold leading-tight mb-[2pt]"
          style={{
            textDecoration: checked ? "line-through" : "none",
            opacity: checked ? 0.65 : 1,
          }}
        >
          {action.title}
        </div>
        <div className="font-body text-[9pt] text-[#2a2520] leading-[1.4]">
          {action.detail}
        </div>
        {action.link && (
          <div className="mt-[3pt]">
            <a
              href={action.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[8pt] text-[#1f3d2e] underline decoration-[#b85a3e] decoration-1 underline-offset-2 hover:opacity-80 break-all"
            >
              {action.linkLabel ?? action.link}
            </a>
          </div>
        )}
      </div>
    </li>
  );
}
