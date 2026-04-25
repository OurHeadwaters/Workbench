import { useMemo, useState } from "react";

import {
  triageGates,
  routeDescriptors,
  decideRoute,
  replyTemplate,
  declineTemplate,
  parkTemplate,
  junkSignals,
  type GateKey,
  type TriageRoute,
} from "@/data/inquiryTriage";

type Answer = "yes" | "no" | undefined;

const TEMPLATE_FOR_ROUTE: Record<TriageRoute, string | null> = {
  reply: replyTemplate,
  park: parkTemplate,
  decline: declineTemplate,
  unknown: null,
};

const TEMPLATE_LABEL_FOR_ROUTE: Record<TriageRoute, string | null> = {
  reply: "Reply template — Carve-out A scoping invite",
  park: "Holding-note template — candidate-reserve",
  decline: "Polite-decline template",
  unknown: null,
};

export default function InquiryTriage() {
  const [answers, setAnswers] = useState<Partial<Record<GateKey, Answer>>>({});
  const [junkChecks, setJunkChecks] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const route = useMemo(() => decideRoute(answers), [answers]);
  const descriptor = routeDescriptors[route];

  const junkCount = Object.values(junkChecks).filter(Boolean).length;
  const junkOverride = junkCount >= 2;

  // If the founder ticks 2+ junk signals, the rubric short-circuits to
  // "decline" without forcing them to walk every gate. The displayed
  // descriptor follows the override.
  const effectiveRoute: TriageRoute = junkOverride ? "decline" : route;
  const effectiveDescriptor = junkOverride
    ? routeDescriptors.decline
    : descriptor;

  const setAnswer = (key: GateKey, value: Answer) => {
    setAnswers((prev) => {
      const next = { ...prev };
      if (prev[key] === value) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const toggleJunk = (num: string) => {
    setJunkChecks((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const reset = () => {
    setAnswers({});
    setJunkChecks({});
  };

  const onPrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const copyText = async (text: string, key: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600);
    } catch {
      // ignore — user can still select & copy manually
    }
  };

  const answeredCount = Object.values(answers).filter(Boolean).length;

  const activeTemplate = TEMPLATE_FOR_ROUTE[effectiveRoute];
  const activeTemplateLabel = TEMPLATE_LABEL_FOR_ROUTE[effectiveRoute];

  return (
    <div className="onepager-screen checklist">
      <div className="onepager-sheet">
        <div className="flex items-baseline justify-between border-b border-[#c8bfa7] pb-[8pt] mb-[10pt] print:pb-[4pt] print:mb-[4pt]">
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[3pt] print:text-[7pt] print:mb-[2pt]">
              Headwaters · Inquiry triage
            </div>
            <h1 className="font-display text-[19pt] leading-[1.05] tracking-tight text-[#1f3d2e] font-semibold print:text-[12pt]">
              Tell, in five minutes, whether a Headwaters inquiry is a real
              Carve-out A lead.
            </h1>
            <p className="mt-[4pt] font-body text-[9.5pt] text-[#2a2520] leading-[1.4] max-w-[44em] print:text-[7.5pt] print:leading-[1.2] print:mt-[2pt]">
              Triage rubric for everything that lands at{" "}
              <span className="font-mono">inquiries@headwaters.example</span>.
              Five yes/no gates against the Carve-out A criteria from Part VI ·
              Slide 02. The bottom of the sheet routes the note: reply through
              the agency, polite no, or park for the Pilot #2 candidate-reserve.
            </p>
          </div>
          <div className="text-right text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:text-[7pt]">
            <div>Working doc / print version</div>
            <div className="mt-[2pt] text-[#1f3d2e] font-semibold tracking-[0.16em]">
              {answeredCount} of {triageGates.length} answered
            </div>
          </div>
        </div>

        <div className="print-hide flex items-center justify-between gap-[8pt] mb-[10pt] text-[9pt]">
          <div className="text-[#6b7665]">
            One sheet per inquiry. State stays on this device for the current
            session and clears on reset.
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

        {/* Sender details — handwritten on print, free-text on screen */}
        <section className="mb-[10pt] print:mb-[4pt]">
          <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#b85a3e] font-semibold mb-[4pt] print:text-[6.5pt] print:mb-[1pt]">
            The inquiry — fill in before triaging
          </div>
          <div className="border border-[#c8bfa7] rounded-[3pt] p-[10pt] grid grid-cols-2 gap-x-[12pt] gap-y-[6pt] print:p-[4pt] print:gap-x-[6pt] print:gap-y-[3pt]">
            <SenderField label="Date received" />
            <SenderField label="Sender (name + role)" />
            <SenderField label="Organization" />
            <SenderField label="Headwaters address it came in on" />
            <SenderField label="The ask, in one sentence" wide />
            <SenderField label="What they want made public / legible" wide />
          </div>
        </section>

        {/* Junk-signal short-circuit */}
        <section className="mb-[10pt] print:mb-[4pt]">
          <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#b85a3e] font-semibold mb-[4pt] print:text-[6.5pt] print:mb-[1pt]">
            First — quick junk-RFP check (any 2+ → polite no, skip the gates)
          </div>
          <ol className="list-none p-0 m-0 grid grid-cols-1 gap-[4pt] print:gap-[1pt]">
            {junkSignals.map((signal) => {
              const checked = Boolean(junkChecks[signal.num]);
              return (
                <li
                  key={signal.num}
                  onClick={(e) => {
                    const target = e.target as HTMLElement | null;
                    if (target?.closest("a,button")) return;
                    toggleJunk(signal.num);
                  }}
                  className="border border-[#c8bfa7] rounded-[3pt] p-[6pt] flex gap-[8pt] items-start cursor-pointer hover:bg-[#f1e8d4] print:cursor-auto print:hover:bg-transparent print:p-[2pt] print:gap-[4pt]"
                  style={{ background: checked ? "#ebe2d0" : "transparent" }}
                >
                  <span
                    role="checkbox"
                    aria-checked={checked}
                    aria-label={`Junk signal ${signal.num}`}
                    className="print-hide shrink-0 w-[16pt] h-[16pt] rounded-[2pt] border-[1.5px] border-[#1f3d2e] flex items-center justify-center bg-white"
                  >
                    {checked && (
                      <span className="font-mono text-[11pt] text-[#1f3d2e] leading-none">
                        ✓
                      </span>
                    )}
                  </span>
                  <span
                    aria-hidden
                    className="hidden print:inline-flex shrink-0 w-[12pt] h-[12pt] rounded-[2pt] border-[1.5px] border-[#1f3d2e] items-center justify-center"
                  >
                    {checked && (
                      <span className="font-mono text-[9pt] text-[#1f3d2e] leading-none">
                        ✓
                      </span>
                    )}
                  </span>
                  <div className="shrink-0 font-mono text-[8pt] text-[#b85a3e] font-semibold pt-[1pt] print:text-[6.5pt] print:pt-0">
                    {signal.num}
                  </div>
                  <div className="font-body text-[9pt] text-[#2a2520] leading-[1.4] print:text-[6.8pt] print:leading-[1.2]">
                    {signal.text}
                  </div>
                </li>
              );
            })}
          </ol>
          {junkOverride && (
            <div className="print-hide mt-[5pt] font-mono uppercase tracking-[0.18em] text-[8pt] text-[#b85a3e] font-semibold">
              {junkCount} junk signals — short-circuited to polite no. The five
              gates below are skippable.
            </div>
          )}
        </section>

        {/* Five gates */}
        <section className="mb-[10pt] print:mb-[4pt]">
          <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#b85a3e] font-semibold mb-[4pt] print:text-[6.5pt] print:mb-[1pt]">
            Five gates — Carve-out A criteria
          </div>
          <ol className="list-none p-0 m-0 space-y-[6pt] print:space-y-[2pt]">
            {triageGates.map((gate) => (
              <GateRow
                key={gate.key}
                gate={gate}
                answer={answers[gate.key]}
                onAnswer={(value) => setAnswer(gate.key, value)}
              />
            ))}
          </ol>
        </section>

        {/* Routing decision */}
        <section className="mb-[10pt] print:mb-[4pt]">
          <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#b85a3e] font-semibold mb-[4pt] print:text-[6.5pt] print:mb-[1pt]">
            Routing decision
          </div>
          <div
            className="border-[1.5px] rounded-[3pt] p-[12pt] print:p-[5pt]"
            style={{
              borderColor: effectiveDescriptor.accent,
              background:
                effectiveRoute === "unknown" ? "transparent" : "#f4ede0",
            }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[8.5pt] font-semibold mb-[3pt] print:text-[7pt] print:mb-[1pt]"
              style={{ color: effectiveDescriptor.accent }}
            >
              Route → {effectiveDescriptor.label}
            </div>
            <div className="font-display text-[12pt] text-[#1f3d2e] leading-tight font-semibold mb-[4pt] print:text-[9pt] print:mb-[1pt]">
              {effectiveDescriptor.oneLine}
            </div>
            <div className="font-body text-[9.5pt] text-[#2a2520] leading-[1.45] print:text-[7pt] print:leading-[1.2]">
              {effectiveDescriptor.detail}
            </div>

            {effectiveRoute === "park" && (
              <div className="mt-[6pt] pt-[6pt] border-t border-[#c8bfa7] print:mt-[2pt] print:pt-[2pt]">
                <div className="font-mono uppercase tracking-[0.2em] text-[7.5pt] text-[#7a5c1f] font-semibold mb-[2pt] print:text-[6pt]">
                  Forward to → Pilot #2 candidate-reserve scoring sheet
                </div>
                <div className="font-body italic text-[8.5pt] text-[#6b7665] leading-[1.4] print:text-[6.5pt] print:leading-[1.2]">
                  The candidate-reserve scoring sheet is pending — once it
                  exists it lives alongside this triage doc and gets the org,
                  contact, ask, and a score per the Pilot #2 criteria. Until
                  then, write the org and contact on the back of this sheet
                  and clip it to the candidate-reserve folder.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Templates */}
        {activeTemplate && activeTemplateLabel && (
          <section className="mb-[10pt] print:mb-[4pt]">
            <div className="flex items-baseline justify-between gap-[8pt] mb-[4pt]">
              <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#b85a3e] font-semibold print:text-[6.5pt]">
                {activeTemplateLabel}
              </div>
              <button
                type="button"
                onClick={() => copyText(activeTemplate, effectiveRoute)}
                className="print-hide font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#1f3d2e] text-[#1f3d2e] hover:bg-[#ebe2d0]"
              >
                {copied === effectiveRoute ? "Copied" : "Copy template"}
              </button>
            </div>
            <pre className="font-mono text-[8.5pt] leading-[1.5] text-[#2a2520] bg-[#ebe2d0] border border-[#c8bfa7] rounded-[3pt] p-[10pt] whitespace-pre-wrap print:text-[6.5pt] print:leading-[1.2] print:p-[4pt]">
              {activeTemplate}
            </pre>
            <div className="mt-[3pt] font-body italic text-[8.5pt] text-[#6b7665] leading-[1.4] print:text-[6.5pt] print:leading-[1.2]">
              Replace the bracketed placeholders per inquiry. Don't batch-send.
              Don't soften the polite no into a soft yes.
            </div>
          </section>
        )}

        {/* All three templates on print */}
        <section className="hidden print:block mb-[4pt]">
          <div className="font-mono uppercase tracking-[0.22em] text-[6.5pt] text-[#b85a3e] font-semibold mb-[1pt]">
            All three templates — for the printed pad
          </div>
          <PrintTemplate label="Reply" body={replyTemplate} />
          <PrintTemplate label="Park" body={parkTemplate} />
          <PrintTemplate label="Polite no" body={declineTemplate} />
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
            The studio wind-down sets up{" "}
            <span className="font-mono">inquiries@headwaters.example</span> as
            the address everything from the redirected studio funnel lands in.
            Some of those will be junk RFPs the closure was meant to deflect;
            some will be the real thing — a First Nation, co-op, or Northern
            community organization that fits Carve-out A and could plausibly
            become Pilot #2.
          </p>
          <p className="font-display text-[9.5pt] leading-[1.45] mt-[4pt] print:text-[6.8pt] print:leading-[1.2] print:mt-[1pt]">
            Without a rubric, the founder reads every note from scratch and
            keeps the judgment in their head. With this, every inquiry gets
            five minutes, three buckets, and a paper trail.
          </p>
        </div>

        <div className="border-t border-[#c8bfa7] mt-[8pt] pt-[5pt] flex items-center justify-between text-[7.5pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:mt-[3pt] print:pt-[2pt] print:text-[6pt]">
          <div>
            Source: Part VI · Slide 02 — Design under Headwaters · Carve-out A
          </div>
          <div className="text-[#1f3d2e] font-semibold">
            Headwaters · Inquiry triage
          </div>
        </div>
      </div>
    </div>
  );
}

function SenderField({ label, wide = false }: { label: string; wide?: boolean }) {
  return (
    <label
      className={
        (wide ? "col-span-2" : "") +
        " flex flex-col gap-[2pt] font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665] print:text-[6pt]"
      }
    >
      <span>{label}</span>
      <input
        type="text"
        className="font-body normal-case tracking-normal text-[10pt] text-[#1f3d2e] bg-transparent border-b border-[#c8bfa7] py-[3pt] focus:outline-none focus:border-[#1f3d2e] print:text-[8pt] print:py-[1pt]"
        style={{ minHeight: "18pt" }}
      />
    </label>
  );
}

function GateRow({
  gate,
  answer,
  onAnswer,
}: {
  gate: (typeof triageGates)[number];
  answer: Answer;
  onAnswer: (value: "yes" | "no") => void;
}) {
  return (
    <li
      className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] print:p-[3pt]"
      style={{
        background: answer ? "#ebe2d0" : "transparent",
      }}
    >
      <div className="flex items-baseline justify-between gap-[8pt] mb-[3pt] print:mb-[1pt]">
        <div className="flex items-baseline gap-[6pt]">
          <div className="font-mono text-[9pt] text-[#b85a3e] font-semibold print:text-[7pt]">
            {gate.num}
          </div>
          <div className="font-mono uppercase tracking-[0.2em] text-[7.5pt] text-[#b85a3e] font-semibold print:text-[5.5pt]">
            {gate.short}
          </div>
        </div>
        <div className="print-hide flex gap-[4pt]">
          <YesNoButton
            value="yes"
            active={answer === "yes"}
            onClick={() => onAnswer("yes")}
          />
          <YesNoButton
            value="no"
            active={answer === "no"}
            onClick={() => onAnswer("no")}
          />
        </div>
        <div className="hidden print:flex gap-[4pt] font-mono text-[6.5pt] text-[#1f3d2e]">
          <span className="border border-[#1f3d2e] px-[3pt] py-[1pt] rounded-sm">
            ☐ YES
          </span>
          <span className="border border-[#1f3d2e] px-[3pt] py-[1pt] rounded-sm">
            ☐ NO
          </span>
        </div>
      </div>
      <div className="font-display text-[11pt] text-[#1f3d2e] font-semibold leading-tight mb-[3pt] print:text-[8.5pt] print:mb-[1pt]">
        {gate.question}
      </div>
      <div className="grid grid-cols-2 gap-[8pt] text-[8.5pt] leading-[1.4] print:text-[6.5pt] print:leading-[1.2] print:gap-[4pt]">
        <div>
          <span className="font-mono uppercase tracking-[0.18em] text-[7pt] text-[#1f3d2e] font-semibold print:text-[5.5pt]">
            Yes if
          </span>
          <div className="text-[#2a2520]">{gate.yesMeans}</div>
        </div>
        <div>
          <span className="font-mono uppercase tracking-[0.18em] text-[7pt] text-[#b85a3e] font-semibold print:text-[5.5pt]">
            No if
          </span>
          <div className="text-[#2a2520]">{gate.noMeans}</div>
        </div>
      </div>
      <div className="mt-[3pt] font-mono uppercase tracking-[0.18em] text-[7pt] text-[#6b7665] print:text-[5.5pt] print:mt-[1pt]">
        Source: {gate.source}
      </div>
    </li>
  );
}

function YesNoButton({
  value,
  active,
  onClick,
}: {
  value: "yes" | "no";
  active: boolean;
  onClick: () => void;
}) {
  const accent = value === "yes" ? "#1f3d2e" : "#b85a3e";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="font-mono uppercase tracking-[0.18em] text-[8pt] px-[10pt] py-[4pt] rounded border-[1.5px] transition-colors"
      style={{
        borderColor: accent,
        background: active ? accent : "transparent",
        color: active ? "#f4ede0" : accent,
      }}
    >
      {value === "yes" ? "Yes" : "No"}
    </button>
  );
}

function PrintTemplate({ label, body }: { label: string; body: string }) {
  return (
    <div className="mt-[2pt]">
      <div className="font-mono uppercase tracking-[0.2em] text-[6pt] text-[#b85a3e] font-semibold">
        {label}
      </div>
      <pre className="font-mono text-[6pt] leading-[1.2] text-[#2a2520] bg-[#ebe2d0] border border-[#c8bfa7] rounded-[2pt] p-[3pt] whitespace-pre-wrap">
        {body}
      </pre>
    </div>
  );
}
