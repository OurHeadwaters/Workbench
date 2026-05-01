import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  TRIAL_FEE_USD,
  TRIAL_REFUND_INVOCATION_DAYS,
  TRIAL_REFUND_PAYMENT_DAYS,
  TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA,
  TRIAL_ACCEPTANCE_CRITERIA,
  TRIAL_REFUND_MECHANIC,
  TRIAL_WHAT_SURVIVES_REFUND,
} from "@workspace/headwaters-pricing";

const fmtMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const fmtLongDate = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

function todayIsoLocal(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function isoToDate(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatLong(date: Date | null): string {
  return date ? fmtLongDate.format(date) : "—";
}

type Election = "refund" | "credit";

export function RefundInvocationLetter() {
  const initialIso = useMemo(() => todayIsoLocal(), []);
  const [meetingIso, setMeetingIso] = useState<string>(initialIso);
  const [letterIso, setLetterIso] = useState<string>(initialIso);
  const [contractorName, setContractorName] = useState<string>("");
  const [contractorTitle, setContractorTitle] = useState<string>("");
  const [contractorOrg, setContractorOrg] = useState<string>("");
  const [election, setElection] = useState<Election>("refund");
  const [notMet, setNotMet] = useState<readonly boolean[]>(
    TRIAL_ACCEPTANCE_CRITERIA.map(() => false),
  );

  const meetingDate = isoToDate(meetingIso);
  const letterDate = isoToDate(letterIso);
  const invocationDeadline = meetingDate
    ? addDays(meetingDate, TRIAL_REFUND_INVOCATION_DAYS)
    : null;
  const refundPaymentDeadline = meetingDate
    ? addDays(meetingDate, TRIAL_REFUND_PAYMENT_DAYS)
    : null;

  const notMetCount = notMet.filter(Boolean).length;
  const electionLabel =
    election === "refund"
      ? `cash refund of ${fmtMoney.format(TRIAL_FEE_USD)}`
      : `service credit of ${fmtMoney.format(TRIAL_FEE_USD)} applied against the first invoice of Step 1`;

  const onPrint = () => window.print();

  const toggleNotMet = (idx: number) => {
    setNotMet((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <style>{`
        @media print {
          html, body { background: white !important; }
          /* Hide everything in the document; the letter and its
             ancestors get re-shown below. The visibility-toggle
             pattern works regardless of where the letter sits in the
             React tree (it is mounted under #root, not directly under
             body, so a "body > *" hide selector would also hide the
             letter). */
          body * { visibility: hidden !important; }
          .print-letter, .print-letter * { visibility: visible !important; }
          .print-letter {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            right: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            max-width: none !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
            font-size: 11pt;
            line-height: 1.5;
          }
          .print-letter h1 { font-size: 16pt; }
          .print-letter h2 { font-size: 12pt; }
          .print-letter input, .print-letter textarea {
            border: none !important;
            background: transparent !important;
            color: black !important;
            padding: 0 !important;
          }
          @page { size: letter; margin: 0.75in; }
        }
        .print-letter-host { display: contents; }
      `}</style>

      <div className="print-letter-host">
        {/* ------------------ Controls (screen only) ------------------ */}
        <header
          className="space-y-3 border-b pb-6 print:hidden"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Field tools · printable
          </p>
          <h1
            className="text-3xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            Refund-invocation letter
          </h1>
          <p className="text-sm text-muted-foreground max-w-3xl">
            Section 7 of the Headwaters paid-trial agreement says the
            contractor must invoke a refund <em>in writing</em> within{" "}
            {TRIAL_REFUND_INVOCATION_DAYS} calendar days of the week-eight
            review meeting. The week-eight worksheet (
            <Link
              href="/workbench"
              className="underline text-foreground"
              data-testid="link-back-to-archive"
            >
              archived in the Workbench
            </Link>
            ) records the decision in the room; this page is the companion
            letter the contractor sends to Headwaters inside the 14-day
            window so the §7 "in writing" requirement is satisfied.
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl">
            Fill the four fields below, then print to PDF (or paper) and
            send. The on-screen controls are hidden on the printed copy.
          </p>
        </header>

        <section
          className="rounded-md border p-5 space-y-4 print:hidden"
          style={{ borderColor: "hsl(var(--card-border))" }}
          data-testid="controls"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block text-sm space-y-1">
              <span className="font-medium">Week-eight review meeting date</span>
              <input
                type="date"
                value={meetingIso}
                onChange={(e) => setMeetingIso(e.target.value)}
                className="w-full rounded-md border px-3 py-2 bg-background"
                style={{ borderColor: "hsl(var(--card-border))" }}
                data-testid="input-meeting-date"
              />
              <span className="block text-xs text-muted-foreground">
                14-day invocation deadline (auto):{" "}
                <span className="font-medium text-foreground">
                  {formatLong(invocationDeadline)}
                </span>
              </span>
            </label>
            <label className="block text-sm space-y-1">
              <span className="font-medium">Date this letter is sent</span>
              <input
                type="date"
                value={letterIso}
                onChange={(e) => setLetterIso(e.target.value)}
                className="w-full rounded-md border px-3 py-2 bg-background"
                style={{ borderColor: "hsl(var(--card-border))" }}
                data-testid="input-letter-date"
              />
              <span
                className="block text-xs text-muted-foreground"
                data-testid="letter-date-window-status"
              >
                {!meetingDate || !letterDate || !invocationDeadline
                  ? "Set both dates to confirm the 14-day window."
                  : letterDate > invocationDeadline
                    ? "Outside the 14-day window — see §7 (an invocation made later than that is out of time)."
                    : letterDate < meetingDate
                      ? "Letter date is before the review meeting — pick a date on or after the meeting."
                      : "Inside the 14-day window."}
              </span>
            </label>
            <label className="block text-sm space-y-1 md:col-span-2">
              <span className="font-medium">Contractor (signer) name</span>
              <input
                type="text"
                value={contractorName}
                onChange={(e) => setContractorName(e.target.value)}
                placeholder="e.g. Jane Smith"
                className="w-full rounded-md border px-3 py-2 bg-background"
                style={{ borderColor: "hsl(var(--card-border))" }}
                data-testid="input-contractor-name"
              />
            </label>
            <label className="block text-sm space-y-1">
              <span className="font-medium">Contractor title</span>
              <input
                type="text"
                value={contractorTitle}
                onChange={(e) => setContractorTitle(e.target.value)}
                placeholder="e.g. Chief Operating Officer"
                className="w-full rounded-md border px-3 py-2 bg-background"
                style={{ borderColor: "hsl(var(--card-border))" }}
                data-testid="input-contractor-title"
              />
            </label>
            <label className="block text-sm space-y-1">
              <span className="font-medium">Contractor organization</span>
              <input
                type="text"
                value={contractorOrg}
                onChange={(e) => setContractorOrg(e.target.value)}
                placeholder="e.g. Deer Lake First Nation Development Corp."
                className="w-full rounded-md border px-3 py-2 bg-background"
                style={{ borderColor: "hsl(var(--card-border))" }}
                data-testid="input-contractor-org"
              />
            </label>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">
              Election under §7 (contractor's option)
            </legend>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="radio"
                name="election"
                value="refund"
                checked={election === "refund"}
                onChange={() => setElection("refund")}
                className="mt-1"
                data-testid="radio-election-refund"
              />
              <span>
                <span className="font-medium">Cash refund</span> — return
                the full {fmtMoney.format(TRIAL_FEE_USD)} within{" "}
                {TRIAL_REFUND_PAYMENT_DAYS} calendar days of the review.
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="radio"
                name="election"
                value="credit"
                checked={election === "credit"}
                onChange={() => setElection("credit")}
                className="mt-1"
                data-testid="radio-election-credit"
              />
              <span>
                <span className="font-medium">Service credit</span> —
                convert the {fmtMoney.format(TRIAL_FEE_USD)} into a credit
                of equal value applied against the first invoice of Step 1.
              </span>
            </label>
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">
              §7 acceptance criteria — mark the ones that were{" "}
              <em>not met</em> at the week-eight review
            </legend>
            <p className="text-xs text-muted-foreground">
              §7 triggers the refund when{" "}
              {TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA} or more of the four
              criteria are not met. You currently have{" "}
              <span
                className={
                  notMetCount >= TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA
                    ? "font-medium text-foreground"
                    : "font-medium text-warning"
                }
                data-testid="not-met-count"
              >
                {notMetCount} marked not met
              </span>
              .
            </p>
            <ol className="space-y-2">
              {TRIAL_ACCEPTANCE_CRITERIA.map((criterion, idx) => (
                <li key={idx} className="text-sm">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={notMet[idx]}
                      onChange={() => toggleNotMet(idx)}
                      className="mt-1"
                      data-testid={`checkbox-not-met-${idx}`}
                    />
                    <span>
                      <span className="font-medium">
                        Criterion {idx + 1}.
                      </span>{" "}
                      {criterion}
                    </span>
                  </label>
                </li>
              ))}
            </ol>
          </fieldset>

          <div className="pt-2">
            <button
              type="button"
              onClick={onPrint}
              className="rounded-md border px-4 py-2 text-sm font-medium hover-elevate"
              style={{
                borderColor: "hsl(var(--card-border))",
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              }}
              data-testid="button-print"
            >
              Print / save as PDF
            </button>
          </div>
        </section>

        {/* ------------------ The printable letter ------------------ */}
        <article
          className="print-letter rounded-md border bg-card p-8 sm:p-10 max-w-3xl shadow-sm space-y-5 text-[15px] leading-7"
          style={{
            borderColor: "hsl(var(--card-border))",
            fontFamily: "var(--app-font-serif)",
          }}
          data-testid="letter"
        >
          <header className="space-y-1 border-b pb-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground print:text-black">
              Headwaters · Paid-trial agreement · §7 invocation
            </p>
            <h1
              className="text-2xl font-semibold tracking-tight"
              data-testid="letter-headline"
            >
              Refund-invocation letter
            </h1>
          </header>

          <p data-testid="letter-date">
            <span className="font-medium">Date:&nbsp;</span>
            {formatLong(letterDate)}
          </p>

          <div className="space-y-1">
            <p className="font-medium">To:</p>
            <p>Headwaters</p>
            <p className="text-muted-foreground print:text-black">
              c/o the practitioner of record on the §0 paid-trial
              agreement signed{" "}
              <span className="italic">[signing date on the trial paper]</span>
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-medium">From:</p>
            <p data-testid="letter-from-name">
              {contractorName || (
                <span className="italic text-muted-foreground print:text-black">
                  [Contractor name]
                </span>
              )}
              {contractorTitle ? `, ${contractorTitle}` : null}
            </p>
            {contractorOrg ? (
              <p data-testid="letter-from-org">{contractorOrg}</p>
            ) : (
              <p className="italic text-muted-foreground print:text-black">
                [Contractor organization]
              </p>
            )}
          </div>

          <p>
            <span className="font-medium">Re:&nbsp;</span>
            Invocation of the refund clause (§7) of the Headwaters
            eight-week paid-trial agreement.
          </p>

          <p>
            On{" "}
            <span className="font-medium" data-testid="letter-meeting-date">
              {formatLong(meetingDate)}
            </span>{" "}
            we held the week-eight review meeting required by the trial
            agreement. At that meeting we worked through the four §7
            acceptance criteria. After review, we determined that the
            following criteria{" "}
            <span className="font-medium">were not met</span> by Headwaters
            during the eight-week window:
          </p>

          <ol
            className="list-decimal pl-6 space-y-2"
            data-testid="letter-not-met-list"
          >
            {TRIAL_ACCEPTANCE_CRITERIA.map((criterion, idx) =>
              notMet[idx] ? (
                <li key={idx} data-testid={`letter-not-met-item-${idx}`}>
                  <span className="font-medium">
                    Criterion {idx + 1} (not met).
                  </span>{" "}
                  {criterion}
                </li>
              ) : null,
            )}
            {notMetCount === 0 ? (
              <li className="italic text-muted-foreground print:text-black list-none -ml-6">
                [No criteria marked not met above. Mark at least{" "}
                {TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA} on the controls
                panel before sending — §7 only triggers when{" "}
                {TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA} or more are
                unmet.]
              </li>
            ) : null}
          </ol>

          {notMetCount >= TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA ? (
            <p>
              That is{" "}
              <span
                className="font-medium"
                data-testid="letter-not-met-count"
              >
                {notMetCount} of the four
              </span>{" "}
              criteria — at or above the §7 threshold of{" "}
              {TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA} unmet criteria.
              Acting within the {TRIAL_REFUND_INVOCATION_DAYS}-calendar-day
              window §7 affords the contractor (the deadline being{" "}
              <span
                className="font-medium"
                data-testid="letter-invocation-deadline"
              >
                {formatLong(invocationDeadline)}
              </span>
              ), the contractor hereby{" "}
              <span className="font-medium">
                invokes the refund clause
              </span>{" "}
              and elects the following remedy:
            </p>
          ) : (
            <p
              className="rounded-md border border-warning p-3 print:border-black"
              data-testid="letter-threshold-warning"
            >
              <span className="font-medium">Notice — §7 not yet triggered.</span>{" "}
              That is{" "}
              <span
                className="font-medium"
                data-testid="letter-not-met-count"
              >
                {notMetCount} of the four
              </span>{" "}
              criteria — below the §7 threshold of{" "}
              {TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA} unmet criteria. §7
              only entitles the contractor to a refund when{" "}
              {TRIAL_REFUND_THRESHOLD_FAILED_CRITERIA} or more criteria
              are not met. <span className="font-medium">Do not send
              this draft as written.</span> Mark the additional unmet
              criteria above (or, if the trial in fact met the threshold,
              accept the trial in writing instead). The 14-day in-writing
              deadline from the review meeting is{" "}
              <span
                className="font-medium"
                data-testid="letter-invocation-deadline"
              >
                {formatLong(invocationDeadline)}
              </span>
              .
            </p>
          )}

          <p
            className="rounded-md border p-3 print:border-black"
            style={{ borderColor: "hsl(var(--card-border))" }}
            data-testid="letter-election"
          >
            <span className="font-medium">Election:&nbsp;</span>
            {electionLabel}.
            {election === "refund" ? (
              <>
                {" "}
                Per §7, payment is due no later than{" "}
                <span className="font-medium">
                  {formatLong(refundPaymentDeadline)}
                </span>{" "}
                ({TRIAL_REFUND_PAYMENT_DAYS} calendar days from the
                review meeting).
              </>
            ) : (
              <>
                {" "}
                Per §7, the credit applies dollar-for-dollar against the
                first invoice of Step 1 when Step 1 opens.
              </>
            )}
          </p>

          <p>
            For the avoidance of doubt, this letter quotes §7 verbatim
            so the record is complete:
          </p>

          <blockquote
            className="border-l-4 pl-4 italic text-muted-foreground print:text-black print:border-black"
            style={{ borderColor: "hsl(var(--card-border))" }}
            data-testid="letter-refund-mechanic"
          >
            {TRIAL_REFUND_MECHANIC}
          </blockquote>

          <p data-testid="letter-what-survives">
            <span className="font-medium">What survives the refund.</span>{" "}
            {TRIAL_WHAT_SURVIVES_REFUND}
          </p>

          <div className="pt-8 space-y-1">
            <p className="font-medium">Signed,</p>
            <div className="h-12 border-b w-72 print:border-black" />
            <p data-testid="letter-signature-name">
              {contractorName || (
                <span className="italic text-muted-foreground print:text-black">
                  [Contractor name]
                </span>
              )}
              {contractorTitle ? `, ${contractorTitle}` : null}
            </p>
            {contractorOrg ? (
              <p data-testid="letter-signature-org">{contractorOrg}</p>
            ) : null}
            <p className="text-sm text-muted-foreground print:text-black">
              Date:{" "}
              <span className="font-medium">{formatLong(letterDate)}</span>
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
