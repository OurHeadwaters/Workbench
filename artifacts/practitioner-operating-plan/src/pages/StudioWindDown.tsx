import { useEffect, useMemo, useState } from "react";

import {
  windDownActions,
  redirectCopy,
  redirectHtml,
  siteCopyReframes,
  retainerExits,
  clientNoteTemplate,
  type WindDownAction,
} from "@/data/studioWindDown";

const STORAGE_KEY = "studio-wind-down-checks-v1";

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

const CATEGORY_ORDER: WindDownAction["category"][] = [
  "Take the form down",
  "Site copy",
  "Inquiries routing",
  "Active retainer",
];

export default function StudioWindDown() {
  const [checks, setChecks] = useState<Record<string, boolean>>(() =>
    loadChecks(),
  );
  const [copied, setCopied] = useState<"copy" | "html" | "note" | null>(null);

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

  const reset = () => setChecks({});

  const grouped = useMemo(() => {
    const map = new Map<WindDownAction["category"], WindDownAction[]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const a of windDownActions) {
      const list = map.get(a.category);
      if (list) list.push(a);
    }
    return CATEGORY_ORDER.map((cat) => ({
      category: cat,
      items: map.get(cat) ?? [],
    })).filter((g) => g.items.length > 0);
  }, []);

  const completed = windDownActions.filter((a) => checks[a.num]).length;

  const onPrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const copyText = async (text: string, key: "copy" | "html" | "note") => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600);
    } catch {
      // ignore — user can still select & copy manually
    }
  };

  const redirectCopyAsText = useMemo(() => {
    return [redirectCopy.heading, "", ...redirectCopy.body, "", redirectCopy.closing].join(
      "\n\n",
    );
  }, []);

  return (
    <div className="onepager-screen checklist">
      <div className="onepager-sheet">
        <div className="flex items-baseline justify-between border-b border-[#c8bfa7] pb-[8pt] mb-[10pt] print:pb-[4pt] print:mb-[4pt]">
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[3pt] print:text-[7pt] print:mb-[2pt]">
              Headwaters · Studio wind-down
            </div>
            <h1 className="font-display text-[19pt] leading-[1.05] tracking-tight text-[#1f3d2e] font-semibold print:text-[12pt]">
              Close bobbieparr.studio to new outside work — without burning the
              portfolio.
            </h1>
            <p className="mt-[4pt] font-body text-[9.5pt] text-[#2a2520] leading-[1.4] max-w-[44em] print:text-[7.5pt] print:leading-[1.2] print:mt-[2pt]">
              Operational follow-through for the strategic posture in Part VI ·
              Slide 02 (<span className="italic">Design under Headwaters</span>).
              The studio site stays live as portfolio. The funnel — contact
              form, "available for new work" copy, hire-me directories — comes
              down. Existing retainers get a defined exit, in writing.
            </p>
          </div>
          <div className="text-right text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:text-[7pt]">
            <div>Working doc / print version</div>
            <div className="mt-[2pt] text-[#1f3d2e] font-semibold tracking-[0.16em]">
              {completed} of {windDownActions.length} done
            </div>
          </div>
        </div>

        <div className="print-hide flex items-center justify-between gap-[8pt] mb-[10pt] text-[9pt]">
          <div className="text-[#6b7665]">
            Tap any row to mark it done. Your checks are saved on this device.
          </div>
          <div className="flex gap-[6pt]">
            <button
              type="button"
              onClick={reset}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#c8bfa7] text-[#6b7665] hover:bg-[#ebe2d0]"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded bg-[#1f3d2e] text-[#f4ede0] hover:opacity-90"
            >
              Print
            </button>
          </div>
        </div>

        {grouped.map((group) => (
          <section key={group.category} className="mb-[10pt] print:mb-[4pt]">
            <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#b85a3e] font-semibold mb-[4pt] print:text-[6.5pt] print:mb-[1pt]">
              {group.category}
            </div>
            <ol className="list-none p-0 m-0">
              {group.items.map((a) => (
                <ActionRow
                  key={a.num}
                  action={a}
                  checked={Boolean(checks[a.num])}
                  onToggle={() => toggle(a.num)}
                />
              ))}
            </ol>
          </section>
        ))}

        {/* Drop-in redirect copy */}
        <section className="mt-[10pt] mb-[10pt] print:mt-[4pt] print:mb-[4pt]">
          <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#b85a3e] font-semibold mb-[4pt] print:text-[6.5pt] print:mb-[1pt]">
            Drop-in copy — replaces the contact form
          </div>
          <div
            className="border border-[#c8bfa7] rounded-[3pt] p-[10pt] print:p-[4pt]"
            style={{ background: "#f4ede0" }}
          >
            <div className="flex items-baseline justify-between gap-[8pt] mb-[6pt] print:mb-[2pt]">
              <div className="font-display text-[13pt] text-[#1f3d2e] font-semibold leading-tight print:text-[10pt]">
                {redirectCopy.heading}
              </div>
              <button
                type="button"
                onClick={() => copyText(redirectCopyAsText, "copy")}
                className="print-hide font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#1f3d2e] text-[#1f3d2e] hover:bg-[#ebe2d0] shrink-0"
              >
                {copied === "copy" ? "Copied" : "Copy text"}
              </button>
            </div>
            {redirectCopy.body.map((p, i) => (
              <p
                key={i}
                className="font-body text-[10pt] text-[#2a2520] leading-[1.5] mb-[5pt] print:text-[7.5pt] print:leading-[1.25] print:mb-[2pt]"
              >
                {p}
              </p>
            ))}
            <p className="font-body italic text-[9pt] text-[#6b7665] leading-[1.5] print:text-[7pt] print:leading-[1.25]">
              {redirectCopy.closing}
            </p>
          </div>

          <div className="mt-[6pt] print:mt-[2pt]">
            <div className="flex items-baseline justify-between gap-[8pt] mb-[3pt]">
              <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665] print:text-[6pt]">
                Same copy, ready to paste as HTML
              </div>
              <button
                type="button"
                onClick={() => copyText(redirectHtml, "html")}
                className="print-hide font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#c8bfa7] text-[#1f3d2e] hover:bg-[#ebe2d0]"
              >
                {copied === "html" ? "Copied" : "Copy HTML"}
              </button>
            </div>
            <pre className="font-mono text-[8pt] leading-[1.45] text-[#2a2520] bg-[#ebe2d0] border border-[#c8bfa7] rounded-[3pt] p-[8pt] overflow-x-auto whitespace-pre-wrap print:text-[6pt] print:leading-[1.2] print:p-[3pt]">
              {redirectHtml}
            </pre>
            <div className="mt-[3pt] font-body italic text-[8.5pt] text-[#6b7665] leading-[1.4] print:text-[6.5pt] print:leading-[1.2]">
              Swap <span className="font-mono">inquiries@headwaters.example</span> for the real
              forwarding address from action 03 before pasting.
            </div>
          </div>
        </section>

        {/* Site copy reframes */}
        <section className="mb-[10pt] print:mb-[4pt]">
          <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#b85a3e] font-semibold mb-[4pt] print:text-[6.5pt] print:mb-[1pt]">
            Site copy — what to remove and what to put in its place
          </div>
          <div className="border border-[#c8bfa7] rounded-[3pt] overflow-hidden">
            <div
              className="grid grid-cols-[14ch_1fr_1fr] gap-[8pt] px-[8pt] py-[5pt] font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665] border-b border-[#c8bfa7] print:text-[6pt] print:py-[2pt]"
              style={{ background: "#ebe2d0" }}
            >
              <div>Where on the site</div>
              <div>Remove</div>
              <div>Replace with</div>
            </div>
            {siteCopyReframes.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-[14ch_1fr_1fr] gap-[8pt] px-[8pt] py-[6pt] border-b border-[#e3d8bf] last:border-b-0 text-[9pt] leading-[1.4] print:text-[6.8pt] print:leading-[1.2] print:py-[2pt]"
              >
                <div className="font-mono text-[#b85a3e] font-semibold">
                  {row.where}
                </div>
                <div className="text-[#6b7665] line-through decoration-[#b85a3e]/60">
                  {row.remove}
                </div>
                <div className="text-[#1f3d2e]">{row.replaceWith}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Retainer wind-down table */}
        <section className="mb-[10pt] print:mb-[4pt]">
          <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#b85a3e] font-semibold mb-[4pt] print:text-[6.5pt] print:mb-[1pt]">
            Active retainers — pick one exit per client
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[6pt] mb-[8pt] print:mb-[3pt] print:gap-[3pt]">
            {retainerExits.map((exit) => (
              <div
                key={exit.key}
                className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] print:p-[3pt]"
              >
                <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#b85a3e] font-semibold mb-[2pt] print:text-[6pt]">
                  {exit.label}
                </div>
                <div className="font-body text-[8.5pt] text-[#2a2520] leading-[1.4] print:text-[6.5pt] print:leading-[1.2]">
                  {exit.description}
                </div>
              </div>
            ))}
          </div>

          <div className="border border-[#c8bfa7] rounded-[3pt] overflow-hidden">
            <div
              className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr_1fr] gap-[6pt] px-[8pt] py-[5pt] font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665] border-b border-[#c8bfa7] print:text-[6pt] print:py-[2pt]"
              style={{ background: "#ebe2d0" }}
            >
              <div>Client</div>
              <div>Contract end</div>
              <div>Monthly / fee</div>
              <div>Exit path</div>
              <div>Note sent</div>
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr_1fr] gap-[6pt] px-[8pt] py-[7pt] border-b border-[#e3d8bf] last:border-b-0 text-[9pt] text-[#2a2520] print:py-[5pt] print:text-[7pt]"
                style={{
                  minHeight: "26pt",
                  background: i % 2 === 0 ? "transparent" : "#faf6ec",
                }}
              >
                <div className="text-[#6b7665]">&nbsp;</div>
                <div className="text-[#6b7665]">&nbsp;</div>
                <div className="text-[#6b7665]">&nbsp;</div>
                <div className="text-[#6b7665]">&nbsp;</div>
                <div className="text-[#6b7665]">&nbsp;</div>
              </div>
            ))}
          </div>
          <div className="mt-[4pt] font-body italic text-[8.5pt] text-[#6b7665] leading-[1.4] print:text-[6.5pt] print:leading-[1.2]">
            Six rows is plenty — if there are more than six active studio
            retainers, the wind-down isn't a doc, it's a project. Add more
            sheets and put a date on the project.
          </div>
        </section>

        {/* Client note template */}
        <section className="mb-[8pt] print:mb-[3pt]">
          <div className="flex items-baseline justify-between gap-[8pt] mb-[4pt]">
            <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#b85a3e] font-semibold print:text-[6.5pt]">
              Client note template — phone first, then send this
            </div>
            <button
              type="button"
              onClick={() => copyText(clientNoteTemplate, "note")}
              className="print-hide font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#1f3d2e] text-[#1f3d2e] hover:bg-[#ebe2d0]"
            >
              {copied === "note" ? "Copied" : "Copy template"}
            </button>
          </div>
          <pre className="font-mono text-[8.5pt] leading-[1.5] text-[#2a2520] bg-[#ebe2d0] border border-[#c8bfa7] rounded-[3pt] p-[10pt] whitespace-pre-wrap print:text-[6.5pt] print:leading-[1.2] print:p-[4pt]">
            {clientNoteTemplate}
          </pre>
          <div className="mt-[3pt] font-body italic text-[8.5pt] text-[#6b7665] leading-[1.4] print:text-[6.5pt] print:leading-[1.2]">
            Replace <span className="font-mono">{`{NAME}`}</span>,{" "}
            <span className="font-mono">{`{EXIT_PATH_SENTENCE}`}</span>, and{" "}
            <span className="font-mono">{`{DATE_OR_NEXT_STEP_SENTENCE}`}</span>{" "}
            per client. Don't batch-send. Don't apologise for the change — name
            it, name the exit, and name the next concrete step.
          </div>
        </section>

        <div
          className="mt-[6pt] p-[8pt] rounded-[3pt] print:mt-[2pt] print:py-[3pt] print:px-[6pt]"
          style={{ background: "#1f3d2e", color: "#f4ede0" }}
        >
          <div
            className="font-mono uppercase tracking-[0.2em] text-[8pt] font-semibold mb-[5pt] print:text-[6pt] print:mb-[1pt]"
            style={{ color: "#e9c8a8" }}
          >
            Why this exists
          </div>
          <p className="font-display text-[9.5pt] leading-[1.45] print:text-[6.8pt] print:leading-[1.2]">
            Part VI commits to closing outside studio intake while keeping
            bobbieparr.studio live as portfolio. That's a strategic posture,
            not an operational change yet. Until the contact form is rerouted,
            the "available for new work" copy is gone, and every active
            retainer has a defined exit, the closure is on paper only — and
            the founder will keep getting pinged with new RFPs.
          </p>
          <p className="font-display text-[9.5pt] leading-[1.45] mt-[4pt] print:text-[6.8pt] print:leading-[1.2] print:mt-[1pt]">
            This sheet is the one-time list that turns the slide into the
            world. Once it's done, it doesn't get done again.
          </p>
        </div>

        <div className="border-t border-[#c8bfa7] mt-[8pt] pt-[5pt] flex items-center justify-between text-[7.5pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:mt-[3pt] print:pt-[2pt] print:text-[6pt]">
          <div>
            Source: Part VI · Slide 02 — Design under Headwaters
          </div>
          <div className="text-[#1f3d2e] font-semibold">
            Headwaters · Studio wind-down
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionRow({
  action,
  checked,
  onToggle,
}: {
  action: WindDownAction;
  checked: boolean;
  onToggle: () => void;
}) {
  const onRowClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest("a,button")) return;
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
      </div>
    </li>
  );
}
