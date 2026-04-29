import {
  TRIAL_ACCEPTANCE_CRITERIA,
  TRIAL_CONVERSION_TO_STEP_1,
  TRIAL_FEE_LINE,
  TRIAL_HEADLINE,
  TRIAL_NO_TEAM_LINE,
  TRIAL_REFUND_MECHANIC,
  TRIAL_WHAT_SURVIVES_REFUND,
} from "@workspace/headwaters-pricing";

import { useCostValue } from "../lib/costReview";
import { CostReviewButton } from "../components/CostReviewButton";

type RevenueLine = {
  label: string;
  detail: string;
};

const triggerBIncluded: RevenueLine[] = [
  {
    label: "Dog-treat sales",
    detail:
      "Net revenue (gross sales minus refunds, chargebacks, processing fees) from the platform-enabled dog-treat product line, across all channels the platform operates.",
  },
  {
    label: "Memberships",
    detail:
      "Net revenue from any 807 membership product launched on or after the date of this memorandum, including renewals of those memberships.",
  },
  {
    label: "Other new platform-enabled revenue lines",
    detail:
      "Any net revenue from a product, service, or revenue line that the platform — or the marketing-and-promotion stream Headwaters absorbed — directly enables, that 807 was not earning before this memorandum is signed. New lines are added to this list in writing by joint sign-off (see §6).",
  },
];

const triggerBExcluded: RevenueLine[] = [
  {
    label: "Existing wholesale revenue",
    detail:
      "807's wholesale program as it operates on the date of this memorandum. Growth in this line does not count toward Trigger B.",
  },
  {
    label: "Existing custom-label revenue",
    detail:
      "807's custom-label / private-label program as it operates on the date of this memorandum.",
  },
  {
    label: "Market revenue",
    detail:
      "Farmers' market, pop-up, and on-site sales the co-op was already running before this memorandum.",
  },
  {
    label: "Grant income",
    detail:
      "Any grant, contribution, or non-repayable funding received by 807 from any source. Grant dollars never count as Trigger B revenue, regardless of how the grant is described.",
  },
];

export default function PaybackMemo() {
  // Memo binds the same registry ids as the slide so a single approval
  // walk re-flows both the pitch and the paper trail.
  const principal = useCostValue("payback.principal");
  const originalScope = useCostValue("payback.originalScope");
  const replitHosting = useCostValue("payback.replitHosting");
  const monthlyMin = useCostValue("payback.monthlyMin");
  const monthlyMax = useCostValue("payback.monthlyMax");

  const fmtMoney = (n: number) => "$" + n.toLocaleString("en-US");
  const principalK = Math.round(principal / 1000);
  const originalScopeApprox = "~$" + Math.round(originalScope / 1000) + ",000";
  const replitText = "~$" + replitHosting.toLocaleString("en-US") + "+";
  const monthlyMinDollars = monthlyMin.toLocaleString("en-US");
  const monthlyMaxDollars = monthlyMax.toLocaleString("en-US");

  const onPrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="onepager-screen checklist">
      <div className="onepager-sheet">
        <div className="print-hide absolute right-4 top-4 z-20">
          <CostReviewButton variant="compact" />
        </div>
        <div className="flex items-baseline justify-between border-b border-[#c8bfa7] pb-[8pt] mb-[10pt] print:pb-[5pt] print:mb-[6pt]">
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[3pt] print:text-[7pt] print:mb-[2pt]">
              Memorandum of Understanding · Headwaters ↔ 807 Food Co-operative
            </div>
            <h1 className="font-display text-[19pt] leading-[1.05] tracking-tight text-[#1f3d2e] font-semibold print:text-[14pt]">
              Repayment of the {fmtMoney(principal)} owed to Headwaters under the 807 grant
              deliverable scope.
            </h1>
            <p className="mt-[4pt] font-body text-[9.5pt] text-[#2a2520] leading-[1.4] max-w-[44em] print:text-[8pt] print:leading-[1.25] print:mt-[2pt]">
              Operationalises the two-trigger structure presented to the 807
              board on Slide II · 22 (
              <span className="italic">
                The ${principalK}k already spent — how we get paid back
              </span>
              ). Once both boards have signed, this memorandum — not the slide
              — is the document either party relies on.
            </p>
          </div>
          <div className="text-right text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:text-[7pt]">
            <div>For signature</div>
            <div className="mt-[2pt] text-[#1f3d2e] font-semibold tracking-[0.16em]">
              Slide II · 22 reconciles to here
            </div>
          </div>
        </div>

        <div className="print-hide flex items-center justify-between gap-[8pt] mb-[10pt] text-[9pt]">
          <div className="text-[#6b7665] max-w-[60%]">
            Print, sign, and file with each party&rsquo;s board minutes. The
            slide is the pitch; this memo is the paper trail.
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

        <div className="grid grid-cols-2 gap-[8pt] mb-[10pt] text-[9pt] print:gap-[6pt] print:mb-[6pt]">
          <FieldBlock label="Creditor / service provider" hint="Holds the receivable">
            <div className="font-display text-[12pt] text-[#1f3d2e] font-semibold leading-tight print:text-[10.5pt]">
              Headwaters Inc.
            </div>
            <div className="text-[8.5pt] text-[#6b7665] mt-[1pt] leading-[1.35] print:text-[7.5pt]">
              Acting through its founder Bobbie Parr in respect of the
              CDP-contractor and marketing-contractor streams of the 807 grant
              scope, plus the Replit hosting line that runs the platform.
            </div>
          </FieldBlock>
          <FieldBlock label="Debtor / co-operative" hint="Owes the receivable">
            <div className="font-display text-[12pt] text-[#1f3d2e] font-semibold leading-tight print:text-[10.5pt]">
              807 Food Co-operative Inc.
            </div>
            <div className="text-[8.5pt] text-[#6b7665] mt-[1pt] leading-[1.35] print:text-[7.5pt]">
              Acting through its board of directors. The board has authority to
              bind the co-operative under the structure described below; no
              individual member is personally liable for any amount under this
              memorandum.
            </div>
          </FieldBlock>
        </div>

        <Section number="1" title="Principal owed">
          <p>
            Headwaters delivered the full grant deliverable scope under the
            807 grant — both the <span className="font-semibold">CDP /
            business-development</span> stream (~12 months of platform build,
            financial systems, business planning) and the{" "}
            <span className="font-semibold">marketing &amp; promotion</span>{" "}
            stream that the original creative contractor backed out of
            (marketing strategy, member-facing creative, outreach materials,
            storefront copy). Both streams together originally budgeted at
            {" "}{originalScopeApprox} across two contractors.
          </p>
          <p>
            <span className="font-semibold">
              The principal owed by 807 to Headwaters is{" "}
              <span className="font-mono">{fmtMoney(principal)} CAD</span>
            </span>{" "}
            for both delivered streams.{" "}
            <span className="italic text-[#6b7665]">
              Replit platform hosting ({replitText} project-to-date and continuing at
              roughly the same rate while the platform stays live) accrues as a
              separate ledger line under §4 below and is paid back on the same
              terms as the principal — it is not added to the {fmtMoney(principal)} figure
              for the purposes of triggering or pacing repayment.
            </span>
          </p>
        </Section>

        <Section number="2" title="Trigger A — Deficit clears">
          <Verbatim>
            807&rsquo;s operating deficit is gone — or substantially reduced
            with solid forward projections.
          </Verbatim>
          <p>
            On Trigger A, repayment runs as a{" "}
            <span className="font-semibold">flat monthly draw</span> on terms
            agreed in writing by the 807 board on the recommendation of its
            bookkeeper. The draw is sized so the line never threatens an
            operating month. Target range:{" "}
            <span className="font-mono font-semibold">~${monthlyMinDollars}–${monthlyMaxDollars} / mo</span>{" "}
            over <span className="font-mono">12–24 months</span> once the
            trigger is met. The exact amount and term are set when the trigger
            fires, not now.
          </p>
          <p>
            <span className="font-semibold">Bookkeeper sign-off cadence.</span>{" "}
            The 807 bookkeeper signs off each quarter — at the same close that
            produces the salt-line and shared-team rollups — that the
            then-current monthly draw is still safe given the most recent
            operating cash position and the next two quarters of forward
            projections. If at any quarterly review the draw is not safe, it
            pauses immediately, with no missed-payment penalty and no
            re-characterisation of the receivable. It resumes at the next
            quarterly review at which the bookkeeper signs off that it is safe
            again. Bookkeeper sign-off (or pause) is recorded in writing and
            shared with both parties within five business days of the close.
          </p>
        </Section>

        <Section number="3" title="Trigger B — New revenue comes online">
          <Verbatim>
            The platform&rsquo;s new revenue streams start producing — payback
            comes out of the new dollars, never base operations.
          </Verbatim>
          <p>
            On Trigger B, Headwaters receives{" "}
            <span className="font-semibold">
              10% of net new platform-enabled revenue
            </span>{" "}
            until the principal (and any accrued Replit hosting under §4) is
            cleared. &ldquo;Net&rdquo; means gross sales less refunds,
            chargebacks, and direct processing fees, computed from the same
            books the bookkeeper closes monthly.
          </p>
          <div>
            <div className="font-mono uppercase tracking-[0.2em] text-[8pt] text-[#b85a3e] font-semibold mb-[3pt] print:text-[7pt]">
              Revenue sources that count toward Trigger B
            </div>
            <ul className="list-none p-0 m-0 mb-[5pt] print:mb-[2pt]">
              {triggerBIncluded.map((r) => (
                <li
                  key={r.label}
                  className="border-l-[2.5pt] border-[#1f3d2e] pl-[8pt] mb-[4pt] print:mb-[2pt] print:pl-[6pt]"
                >
                  <div className="font-semibold text-[#1f3d2e] text-[9.5pt] print:text-[8.5pt]">
                    {r.label}
                  </div>
                  <div className="text-[8.5pt] text-[#2a2520] leading-[1.4] print:text-[7.5pt] print:leading-[1.25]">
                    {r.detail}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-mono uppercase tracking-[0.2em] text-[8pt] text-[#b85a3e] font-semibold mb-[3pt] print:text-[7pt]">
              Revenue sources explicitly excluded
            </div>
            <ul className="list-none p-0 m-0">
              {triggerBExcluded.map((r) => (
                <li
                  key={r.label}
                  className="border-l-[2.5pt] border-[#c8bfa7] pl-[8pt] mb-[4pt] print:mb-[2pt] print:pl-[6pt]"
                >
                  <div className="font-semibold text-[#1f3d2e] text-[9.5pt] print:text-[8.5pt]">
                    {r.label}
                  </div>
                  <div className="text-[8.5pt] text-[#2a2520] leading-[1.4] print:text-[7.5pt] print:leading-[1.25]">
                    {r.detail}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p>
            The Trigger B share is calculated and remitted at each monthly
            close, against the included revenue lines posted that month, and
            shown as a single line in the bookkeeper&rsquo;s remittance memo
            to both parties.
          </p>
        </Section>

        <Section number="4" title="Replit hosting line">
          <p>
            Headwaters carries the Replit hosting cost for the platform on its
            own books while the platform is live. Project-to-date hosting
            ({replitText}) and any future hosting that continues to bill while this
            memorandum is in force is added to a{" "}
            <span className="font-semibold">separate ledger line</span> —
            &ldquo;Replit hosting accrual&rdquo; — accompanying the {fmtMoney(principal)}
            {" "}principal. When repayment begins under Trigger A or Trigger B,
            principal is paid down first; the Replit accrual is paid down
            after principal on the same terms (flat monthly draw under
            Trigger A; 10% share under Trigger B).
          </p>
        </Section>

        <Section number="5" title="What 807 is not on the hook for">
          <Verbatim>
            No cash up front. No debt taken on by 807. No draw on existing
            operations until one trigger is met.
          </Verbatim>
          <p>
            Until either Trigger A or Trigger B is met, this receivable sits
            on Headwaters&rsquo; books, not on 807&rsquo;s. 807 is not
            required to recognise, collateralise, guarantee, or accrue
            interest against the principal or the Replit hosting accrual. 807
            is not required to draw on its existing operating cash, working
            capital, lines of credit, member equity, or any of the revenue
            lines explicitly excluded under §3 to make any payment under this
            memorandum.
          </p>
          <p>
            Whichever trigger lands first starts the clock and becomes the
            operative repayment mechanism. The other trigger becomes
            irrelevant for the purposes of this memorandum — repayment will
            not run under both at once, and there is no double-counting.
          </p>
        </Section>

        <Section number="6" title="Sign-off, amendment, term, and successors">
          <p>
            <span className="font-semibold">Quarterly sign-off.</span> While
            Trigger A is the operative mechanism, the 807 bookkeeper&rsquo;s
            quarterly safe / pause determination (§2) is treated as the
            governing fact and is shared with both parties in writing within
            five business days of each quarterly close.
          </p>
          <p>
            <span className="font-semibold">Adding a new Trigger B line.</span>{" "}
            A new revenue line may be added to the §3 included list only by
            written sign-off from a 807 board representative and a Headwaters
            representative, attached as an addendum and dated. Lines on the
            §3 excluded list cannot be moved to the included list by silent
            change in operations.
          </p>
          <p>
            <span className="font-semibold">Term.</span> This memorandum
            remains in force until the principal and the Replit hosting
            accrual under §4 have been paid in full, at which point both
            parties acknowledge in writing that the receivable is cleared and
            this memorandum is concluded.
          </p>
          <p>
            <span className="font-semibold">
              Bookkeepers and successors change over.
            </span>{" "}
            This memorandum is binding on the parties&rsquo; successors,
            bookkeepers, and assigns. A change of bookkeeper at either party,
            or a change of board composition at 807, does not alter the
            principal, the triggers, the included or excluded revenue lines,
            or the no-debt / no-cash-up-front posture of §5.
          </p>
        </Section>

        <Section
          number="7"
          title="Deer Lake eight-week paid trial — refund clause"
        >
          <Verbatim>{TRIAL_HEADLINE}</Verbatim>
          <p>
            <span className="font-semibold">Scope of this section.</span>{" "}
            This clause applies <span className="italic">only</span> to
            the Step 0 eight-week paid trial offered to the Deer Lake
            engagement contractor as the on-ramp to the $90,000-a-month
            full-stack agency engagement (Scenario B). It does not apply
            to the 807 receivable governed by §§1–6 above. The trial
            and the 807 receivable are independent obligations and the
            clauses do not cross-trigger.
          </p>
          <p>
            <span className="font-semibold">Fee and payment schedule.</span>{" "}
            {TRIAL_FEE_LINE} {TRIAL_NO_TEAM_LINE} No team payroll and no
            day-one tech CAPEX are required from the contractor or the
            band during the trial — the practitioner works solo. All
            amounts are stated in Canadian dollars; the governing
            jurisdiction provisions of §§1–6 apply to this clause as
            well.
          </p>
          <p>
            <span className="font-semibold">Acceptance criteria
            (judged at the week-eight review meeting).</span> By the end
            of week eight, the practitioner shall have delivered the
            following four items, each in writing:
          </p>
          <ol className="list-decimal pl-[16pt] space-y-[3pt] print:space-y-[1pt]">
            {TRIAL_ACCEPTANCE_CRITERIA.map((criterion) => {
              const [headline, ...rest] = criterion.split(" — ");
              const detail = rest.join(" — ");
              return (
                <li key={criterion}>
                  <span className="font-semibold">{headline}.</span>
                  {detail ? <> {detail}</> : null}
                </li>
              );
            })}
          </ol>
          <p>
            <span className="font-semibold">Refund mechanic.</span>{" "}
            {TRIAL_REFUND_MECHANIC}
          </p>
          <p>
            <span className="font-semibold">What survives the
            refund.</span> {TRIAL_WHAT_SURVIVES_REFUND}
          </p>
          <p>
            <span className="font-semibold">Conversion to Step 1.</span>{" "}
            {TRIAL_CONVERSION_TO_STEP_1}
          </p>
          <p>
            <span className="font-semibold">Plain-language anchor.</span>{" "}
            This clause is the contractual form of the trial offer
            stated identically on the Deer Lake Walkthrough (§ Ask),
            the Deer Lake Store Operational Plan (§ Risks &amp; Ask),
            and the Practitioner Operating Plan one-pager. The
            canonical strings (fee headline, fee line, acceptance
            criteria, refund mechanic, what-survives, and
            conversion-to-Step-1 paragraphs) live in
            <span className="font-mono"> @workspace/headwaters-pricing</span>{" "}
            and every surface above quotes them verbatim. If any of
            those surfaces and this clause appear to disagree on the
            fee, the duration, the acceptance criteria, the refund
            window, or the invocation deadline, this clause governs.
          </p>
        </Section>

        <div
          className="mt-[10pt] p-[10pt] rounded-[3pt] print:mt-[5pt] print:py-[6pt] print:px-[8pt]"
          style={{ background: "#1f3d2e", color: "#f4ede0" }}
        >
          <div
            className="font-mono uppercase tracking-[0.2em] text-[8pt] font-semibold mb-[5pt] print:text-[7pt] print:mb-[2pt]"
            style={{ color: "#e9c8a8" }}
          >
            Why this memo exists, plainly
          </div>
          <div className="font-display text-[10.5pt] leading-[1.45] print:text-[9pt] print:leading-[1.3]">
            The slide is the pitch. Without paperwork, &ldquo;we&rsquo;ll wait
            until you can pay us&rdquo; stays a handshake — and handshakes get
            fuzzy when bookkeepers and board members change over. This
            memorandum names the principal, names the triggers, names the
            revenue lines that count and the ones that don&rsquo;t, names the
            quarterly sign-off cadence, and names the promise that 807 is not
            taking on debt or drawing on existing operations to honour it.
            Both organisations can hold each other to it without anyone
            having to remember which slide it was on.
          </div>
        </div>

        <div className="mt-[12pt] print:mt-[8pt]">
          <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#b85a3e] font-semibold mb-[6pt] print:text-[7pt] print:mb-[3pt]">
            Signed
          </div>
          <div className="grid grid-cols-2 gap-[12pt] print:gap-[10pt]">
            <SignatureBlock
              party="For Headwaters Inc."
              nameLabel="Bobbie Parr, Founder"
            />
            <SignatureBlock
              party="For 807 Food Co-operative Inc."
              nameLabel="Authorised director, by board resolution"
            />
          </div>
        </div>

        <div className="border-t border-[#c8bfa7] mt-[10pt] pt-[5pt] flex items-center justify-between text-[7.5pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:mt-[6pt] print:pt-[3pt] print:text-[6.5pt]">
          <div>Source: Practitioner Operating Plan, slide II · 22</div>
          <div className="text-[#1f3d2e] font-semibold">
            Headwaters ↔ 807 · payback memorandum
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
        (verbatim from Slide II · 22)
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
