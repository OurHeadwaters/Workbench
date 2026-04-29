import { useMemo, useState } from "react";

import {
  TRIAL_ACCEPTANCE_CRITERIA,
  TRIAL_FEE_LINE,
  TRIAL_FEE_USD,
  TRIAL_HEADLINE,
  TRIAL_INSTALLMENT_USD,
  TRIAL_REFUND_INVOCATION_DAYS,
  TRIAL_REFUND_MECHANIC,
  TRIAL_REFUND_PAYMENT_DAYS,
  TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA,
  TRIAL_WHAT_SURVIVES_REFUND,
} from "@workspace/headwaters-pricing";

type CriterionScore = "met" | "partial" | "notMet" | "";

type Election = "accept" | "refund" | "credit" | "";

const SCORE_OPTIONS: { value: Exclude<CriterionScore, "">; label: string }[] = [
  { value: "met", label: "Met" },
  { value: "partial", label: "Partially met" },
  { value: "notMet", label: "Not met" },
];

const ELECTION_OPTIONS: {
  value: Exclude<Election, "">;
  headline: string;
  body: string;
}[] = [
  {
    value: "accept",
    headline: "Trial accepted — proceed to Step 1.",
    body: "Step 1 of the Deer Lake engagement opens on the same paper — the $90,000-a-month full-stack agency engagement. The $40,000 trial fee is not credited against the Step 1 monthly fee.",
  },
  {
    value: "refund",
    headline: "Refund elected — Headwaters returns the $40,000 in cash.",
    body: "Headwaters refunds the full $40,000 within thirty (30) calendar days of this meeting. The contractor must invoke the refund in writing on or before the deadline above; an invocation made later than that is out of time and the trial is deemed accepted.",
  },
  {
    value: "credit",
    headline: "Service credit elected — convert the $40,000 to a Step 1 credit.",
    body: "The $40,000 is converted to a service credit of equal value applied against the first invoice of Step 1 instead of refunded in cash. Same fourteen-day invocation window as the refund election.",
  },
];

function todayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addCalendarDays(iso: string, days: number): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-").map((s) => parseInt(s, 10));
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (Number.isNaN(dt.getTime())) return null;
  dt.setUTCDate(dt.getUTCDate() + days);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function formatLong(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map((s) => parseInt(s, 10));
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString("en-CA", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const fmtMoney = (n: number) => "$" + n.toLocaleString("en-US");

export default function TrialAcceptanceSheet() {
  const [meetingDate, setMeetingDate] = useState<string>(todayIso());
  const [scores, setScores] = useState<CriterionScore[]>(
    TRIAL_ACCEPTANCE_CRITERIA.map(() => ""),
  );
  const [notes, setNotes] = useState<string[]>(
    TRIAL_ACCEPTANCE_CRITERIA.map(() => ""),
  );
  const [election, setElection] = useState<Election>("");

  const deadlineIso = useMemo(
    () => addCalendarDays(meetingDate, TRIAL_REFUND_INVOCATION_DAYS),
    [meetingDate],
  );

  const notMetCount = scores.filter((s) => s === "notMet").length;
  const partialCount = scores.filter((s) => s === "partial").length;
  const refundEligible = notMetCount >= TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA;

  const setScore = (index: number, value: Exclude<CriterionScore, "">) => {
    setScores((prev) => {
      const next = [...prev];
      next[index] = prev[index] === value ? "" : value;
      return next;
    });
  };

  const setNote = (index: number, value: string) => {
    setNotes((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const onPrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="onepager-screen checklist">
      <div className="onepager-sheet">
        <div className="flex items-baseline justify-between border-b border-[#c8bfa7] pb-[8pt] mb-[10pt] print:pb-[5pt] print:mb-[6pt]">
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[3pt] print:text-[7pt] print:mb-[2pt]">
              Worksheet · Step 0 paid trial · Week-eight review meeting
            </div>
            <h1 className="font-display text-[19pt] leading-[1.05] tracking-tight text-[#1f3d2e] font-semibold print:text-[14pt]">
              Trial acceptance &amp; refund-election worksheet
            </h1>
            <p className="mt-[4pt] font-body text-[9.5pt] text-[#2a2520] leading-[1.4] max-w-[44em] print:text-[8pt] print:leading-[1.25] print:mt-[2pt]">
              Filled in by the Deer Lake engagement contractor at the
              week-eight review meeting. Reconciles to §7 of the Headwaters
              ↔ 807 payback memorandum (
              <a
                href="/payback-memo"
                className="underline text-[#1f3d2e] hover:opacity-80"
              >
                /payback-memo
              </a>
              ); if this sheet and §7 disagree on the fee, the duration, the
              acceptance criteria, the refund window, or the invocation
              deadline, §7 governs.
            </p>
          </div>
          <div className="text-right text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:text-[7pt]">
            <div>For signature</div>
            <div className="mt-[2pt] text-[#1f3d2e] font-semibold tracking-[0.16em]">
              §7 reconciles to here
            </div>
          </div>
        </div>

        <div className="print-hide flex items-center justify-between gap-[8pt] mb-[10pt] text-[9pt]">
          <div className="text-[#6b7665] max-w-[60%]">
            Print, fill in at the meeting, sign, and file with the payback
            memo. The election box at the bottom is what triggers the refund
            (or service credit, or acceptance) — without it, &ldquo;judged at
            the week-eight review meeting&rdquo; stays a handshake.
          </div>
          <div className="flex gap-[6pt]">
            <button
              type="button"
              onClick={onPrint}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded bg-[#1f3d2e] text-[#f4ede0] hover:opacity-90"
            >
              Print
            </button>
          </div>
        </div>

        <div className="mb-[8pt] print:mb-[5pt]">
          <Verbatim>{TRIAL_HEADLINE}</Verbatim>
        </div>

        <div className="grid grid-cols-2 gap-[8pt] mb-[10pt] text-[9pt] print:gap-[6pt] print:mb-[6pt]">
          <FieldBlock label="Trial fee (CAD)" hint="From §7 fee &amp; payment schedule">
            <div className="font-display text-[12pt] text-[#1f3d2e] font-semibold leading-tight print:text-[10.5pt]">
              {fmtMoney(TRIAL_FEE_USD)} flat
            </div>
            <div className="text-[8.5pt] text-[#6b7665] mt-[1pt] leading-[1.35] print:text-[7.5pt]">
              {TRIAL_FEE_LINE} Two installments of{" "}
              {fmtMoney(TRIAL_INSTALLMENT_USD)}.
            </div>
          </FieldBlock>
          <FieldBlock
            label="Refund-eligibility threshold"
            hint="Per §7 refund mechanic"
          >
            <div className="font-display text-[12pt] text-[#1f3d2e] font-semibold leading-tight print:text-[10.5pt]">
              {TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA} or more &ldquo;Not
              met&rdquo;
            </div>
            <div className="text-[8.5pt] text-[#6b7665] mt-[1pt] leading-[1.35] print:text-[7.5pt]">
              If two or more of the four criteria below are scored
              &ldquo;Not met&rdquo;, the contractor may elect a refund or a
              service credit. Otherwise the trial is deemed accepted on
              signature below.
            </div>
          </FieldBlock>
        </div>

        <div className="grid grid-cols-2 gap-[8pt] mb-[10pt] text-[9pt] print:gap-[6pt] print:mb-[6pt]">
          <FieldBlock
            label="Week-eight review meeting date"
            hint="Set the meeting date to compute the invocation deadline"
          >
            <input
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="font-mono text-[12pt] text-[#1f3d2e] font-semibold bg-transparent border-b border-[#1f3d2e] outline-none w-full print:text-[10.5pt]"
            />
            <div className="text-[8.5pt] text-[#6b7665] mt-[2pt] leading-[1.35] print:text-[7.5pt]">
              {formatLong(meetingDate || null)}
            </div>
          </FieldBlock>
          <FieldBlock
            label={`Refund-invocation deadline (+${TRIAL_REFUND_INVOCATION_DAYS} days)`}
            hint="A written election after this date is out of time per §7"
          >
            <div className="font-mono text-[12pt] text-[#b85a3e] font-semibold leading-tight print:text-[10.5pt]">
              {deadlineIso ?? "—"}
            </div>
            <div className="text-[8.5pt] text-[#6b7665] mt-[2pt] leading-[1.35] print:text-[7.5pt]">
              {formatLong(deadlineIso)} — fourteen (14) calendar days after
              the meeting date.
            </div>
          </FieldBlock>
        </div>

        <Section number="A" title="Score the four acceptance criteria">
          <p className="text-[8.5pt] text-[#6b7665] leading-[1.4] print:text-[7.5pt]">
            One row per criterion. Tick exactly one of <em>Met</em>,{" "}
            <em>Partially met</em>, or <em>Not met</em>; use the notes column
            for the evidence reviewed (committee minutes, signed pilot scope,
            written budget hand-off). The four criteria below are quoted
            verbatim from §7 and the canonical pricing module — do not
            paraphrase.
          </p>

          <div className="border border-[#c8bfa7] rounded-[3pt] overflow-hidden print:rounded-none">
            <div className="grid grid-cols-[24pt_1fr_180pt_1fr] bg-[#1f3d2e] text-[#f4ede0] text-[8pt] font-mono uppercase tracking-[0.18em] print:text-[7pt]">
              <div className="px-[6pt] py-[4pt]">#</div>
              <div className="px-[6pt] py-[4pt]">Criterion</div>
              <div className="px-[6pt] py-[4pt]">Score</div>
              <div className="px-[6pt] py-[4pt]">Notes / evidence</div>
            </div>
            {TRIAL_ACCEPTANCE_CRITERIA.map((criterion, index) => {
              const [headline, ...rest] = criterion.split(" — ");
              const detail = rest.join(" — ");
              return (
                <div
                  key={criterion}
                  className="grid grid-cols-[24pt_1fr_180pt_1fr] border-t border-[#c8bfa7] text-[8.5pt] leading-[1.35] print:text-[7.5pt]"
                >
                  <div className="px-[6pt] py-[5pt] font-mono text-[#b85a3e] font-semibold">
                    {index + 1}
                  </div>
                  <div className="px-[6pt] py-[5pt]">
                    <div className="font-semibold text-[#1f3d2e]">
                      {headline}.
                    </div>
                    {detail && (
                      <div className="text-[#2a2520] mt-[1pt]">
                        {detail}
                      </div>
                    )}
                  </div>
                  <div className="px-[6pt] py-[5pt] flex flex-col gap-[3pt]">
                    {SCORE_OPTIONS.map((opt) => {
                      const checked = scores[index] === opt.value;
                      return (
                        <label
                          key={opt.value}
                          className="flex items-center gap-[5pt] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => setScore(index, opt.value)}
                            className="h-[10pt] w-[10pt] accent-[#1f3d2e]"
                            aria-label={`Criterion ${index + 1}: ${opt.label}`}
                          />
                          <span
                            className={
                              opt.value === "notMet"
                                ? "text-[#b85a3e]"
                                : "text-[#1f3d2e]"
                            }
                          >
                            {opt.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="px-[6pt] py-[5pt]">
                    <textarea
                      value={notes[index]}
                      onChange={(e) => setNote(index, e.target.value)}
                      rows={3}
                      className="w-full bg-transparent border border-[#c8bfa7] rounded-[2pt] p-[4pt] text-[8.5pt] leading-[1.3] outline-none focus:border-[#1f3d2e] print:text-[7.5pt] print:rounded-none print:h-[28pt] print:resize-none"
                      placeholder="Evidence reviewed (e.g. committee minutes dated…)"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-[6pt] mt-[6pt] text-[8pt] font-mono uppercase tracking-[0.16em] print:text-[7pt]">
            <Tally
              label="Met"
              value={scores.filter((s) => s === "met").length}
              of={scores.length}
            />
            <Tally
              label="Partially met"
              value={partialCount}
              of={scores.length}
            />
            <Tally
              label="Not met"
              value={notMetCount}
              of={scores.length}
              accent={refundEligible}
            />
          </div>
        </Section>

        <Section number="B" title="Refund mechanic — verbatim from §7">
          <Verbatim>{TRIAL_REFUND_MECHANIC}</Verbatim>
          <p className="text-[8.5pt] text-[#6b7665] leading-[1.35] print:text-[7.5pt]">
            <span className="font-semibold text-[#1f3d2e]">
              What survives a refund.
            </span>{" "}
            {TRIAL_WHAT_SURVIVES_REFUND}
          </p>
        </Section>

        <Section number="C" title="Election (tick one)">
          <div
            className={
              "rounded-[3pt] p-[8pt] mb-[6pt] text-[8.5pt] leading-[1.35] print:text-[7.5pt] print:p-[5pt] " +
              (refundEligible
                ? "border-[2pt] border-[#b85a3e] bg-[rgba(184,90,62,0.06)]"
                : "border border-[#c8bfa7] bg-[rgba(31,61,46,0.03)]")
            }
          >
            <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#b85a3e] font-semibold mb-[2pt] print:text-[6.5pt]">
              Refund eligibility
            </div>
            {refundEligible ? (
              <div className="text-[#1f3d2e]">
                <span className="font-semibold">Eligible.</span> {notMetCount}{" "}
                of {scores.length} criteria scored &ldquo;Not met&rdquo; —
                meets the §7 threshold of{" "}
                {TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA} or more. The
                contractor may elect a refund or a service credit below; the
                written election must reach Headwaters on or before{" "}
                <span className="font-mono font-semibold">
                  {deadlineIso ?? "—"}
                </span>
                .
              </div>
            ) : (
              <div className="text-[#1f3d2e]">
                <span className="font-semibold">Not yet eligible.</span> Fewer
                than {TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA} criteria are
                currently scored &ldquo;Not met&rdquo;. The election remains
                the contractor&rsquo;s — refund/credit can only be invoked on
                or before{" "}
                <span className="font-mono font-semibold">
                  {deadlineIso ?? "—"}
                </span>{" "}
                if the §7 threshold is met at the meeting.
              </div>
            )}
          </div>

          <div className="space-y-[5pt] print:space-y-[3pt]">
            {ELECTION_OPTIONS.map((opt) => {
              const checked = election === opt.value;
              return (
                <label
                  key={opt.value}
                  className={
                    "flex items-start gap-[8pt] border rounded-[3pt] p-[8pt] cursor-pointer print:p-[5pt] print:rounded-none " +
                    (checked
                      ? "border-[#1f3d2e] bg-[rgba(31,61,46,0.05)]"
                      : "border-[#c8bfa7]")
                  }
                >
                  <input
                    type="radio"
                    name="election"
                    value={opt.value}
                    checked={checked}
                    onChange={() => setElection(opt.value)}
                    className="mt-[3pt] h-[12pt] w-[12pt] accent-[#1f3d2e]"
                    aria-label={opt.headline}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-[#1f3d2e] text-[9.5pt] print:text-[8.5pt]">
                      {opt.headline}
                    </div>
                    <div className="text-[8.5pt] text-[#2a2520] leading-[1.35] mt-[1pt] print:text-[7.5pt]">
                      {opt.body}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </Section>

        <div className="mt-[12pt] print:mt-[8pt]">
          <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#b85a3e] font-semibold mb-[6pt] print:text-[7pt] print:mb-[3pt]">
            Signed at the week-eight review meeting
          </div>
          <div className="grid grid-cols-2 gap-[12pt] print:gap-[10pt]">
            <SignatureBlock
              party="For the contractor (judging party)"
              nameLabel="Deer Lake engagement contractor — invokes refund or accepts trial"
            />
            <SignatureBlock
              party="For Headwaters Inc."
              nameLabel="Bobbie Parr, Founder — counter-signs the election"
            />
          </div>
        </div>

        {/* Editorial framing for the on-screen reader; print-hidden so the
            printed sheet stays a single page of meeting artifact (legal
            content + signatures only). */}
        <div
          className="print-hide mt-[10pt] p-[10pt] rounded-[3pt]"
          style={{ background: "#1f3d2e", color: "#f4ede0" }}
        >
          <div
            className="font-mono uppercase tracking-[0.2em] text-[8pt] font-semibold mb-[5pt]"
            style={{ color: "#e9c8a8" }}
          >
            Why this worksheet exists, plainly
          </div>
          <div className="font-display text-[10.5pt] leading-[1.45]">
            §7 says the contractor &ldquo;judges at the week-eight review
            meeting&rdquo; whether to accept the trial, invoke a refund of{" "}
            {fmtMoney(TRIAL_FEE_USD)}, or convert to a service credit against
            Step 1 — within {TRIAL_REFUND_INVOCATION_DAYS} calendar days, with
            payment in {TRIAL_REFUND_PAYMENT_DAYS} calendar days of an
            invocation. Without a sheet to actually fill in, that&rsquo;s the
            same handshake the payback memo was written to replace. This page
            is the meeting artifact — one row per criterion, one election box,
            two signatures, and a deadline that&rsquo;s been computed for the
            room rather than reconstructed afterwards.
          </div>
        </div>

        <div className="border-t border-[#c8bfa7] mt-[10pt] pt-[5pt] flex items-center justify-between text-[7.5pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:mt-[6pt] print:pt-[3pt] print:text-[6.5pt]">
          <div>
            Source: Practitioner Operating Plan ·{" "}
            <span className="font-mono">/payback-memo §7</span>
          </div>
          <div className="text-[#1f3d2e] font-semibold">
            Headwaters ↔ Deer Lake · trial acceptance worksheet
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-[10pt] print:mb-[6pt]">
      <div className="flex items-baseline gap-[6pt] mb-[3pt] print:mb-[1pt]">
        <div className="font-mono text-[9pt] text-[#b85a3e] font-semibold print:text-[8pt]">
          §{number}
        </div>
        <div className="font-display text-[12pt] text-[#1f3d2e] font-semibold leading-tight print:text-[10.5pt]">
          {title}
        </div>
      </div>
      <div className="font-body text-[9.5pt] text-[#2a2520] leading-[1.45] space-y-[5pt] print:text-[8pt] print:leading-[1.3] print:space-y-[3pt]">
        {children}
      </div>
    </section>
  );
}

function Verbatim({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="border-l-[3pt] border-[#1f3d2e] pl-[8pt] py-[3pt] italic text-[#1f3d2e] print:pl-[6pt] print:py-[1pt]"
      style={{ background: "rgba(31,61,46,0.04)" }}
    >
      &ldquo;{children}&rdquo;{" "}
      <span className="not-italic font-mono text-[7.5pt] text-[#6b7665] print:text-[6.5pt]">
        (verbatim from @workspace/headwaters-pricing — same source §7 quotes)
      </span>
    </div>
  );
}

function FieldBlock({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] print:p-[5pt]">
      <div className="font-mono uppercase tracking-[0.2em] text-[7.5pt] text-[#b85a3e] font-semibold print:text-[6.5pt]">
        {label}
      </div>
      {children}
      {hint && (
        <div className="text-[7.5pt] text-[#6b7665] mt-[1pt] print:text-[7pt]">
          {hint}
        </div>
      )}
    </div>
  );
}

function SignatureBlock({
  party,
  nameLabel,
}: {
  party: string;
  nameLabel: string;
}) {
  return (
    <div className="border border-[#c8bfa7] rounded-[3pt] p-[10pt] print:p-[7pt]">
      <div className="font-mono uppercase tracking-[0.2em] text-[7.5pt] text-[#b85a3e] font-semibold mb-[8pt] print:text-[6.5pt] print:mb-[5pt]">
        {party}
      </div>
      <div className="border-b border-[#1f3d2e] h-[22pt] mb-[3pt] print:h-[18pt]" />
      <div className="font-mono text-[7.5pt] text-[#6b7665] uppercase tracking-[0.16em] mb-[8pt] print:text-[6.5pt] print:mb-[5pt]">
        Signature
      </div>
      <div className="grid grid-cols-2 gap-[8pt]">
        <div>
          <div className="border-b border-[#1f3d2e] h-[18pt] mb-[3pt] print:h-[14pt]" />
          <div className="font-mono text-[7.5pt] text-[#6b7665] uppercase tracking-[0.16em] print:text-[6.5pt]">
            Printed name
          </div>
          <div className="text-[8pt] text-[#2a2520] mt-[1pt] leading-[1.3] print:text-[7pt]">
            {nameLabel}
          </div>
        </div>
        <div>
          <div className="border-b border-[#1f3d2e] h-[18pt] mb-[3pt] print:h-[14pt]" />
          <div className="font-mono text-[7.5pt] text-[#6b7665] uppercase tracking-[0.16em] print:text-[6.5pt]">
            Date (YYYY-MM-DD)
          </div>
        </div>
      </div>
    </div>
  );
}

function Tally({
  label,
  value,
  of,
  accent = false,
}: {
  label: string;
  value: number;
  of: number;
  accent?: boolean;
}) {
  return (
    <div
      className={
        "border rounded-[3pt] px-[6pt] py-[4pt] flex items-baseline justify-between " +
        (accent
          ? "border-[#b85a3e] bg-[rgba(184,90,62,0.06)] text-[#b85a3e]"
          : "border-[#c8bfa7] text-[#1f3d2e]")
      }
    >
      <span>{label}</span>
      <span className="font-mono font-semibold">
        {value} / {of}
      </span>
    </div>
  );
}
