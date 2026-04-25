type RevenueAccount = {
  code: string;
  name: string;
  source: string;
  channelCmTarget: string;
};

type CostAccount = {
  code: string;
  name: string;
  basis: string;
  contra: string;
};

type AllocationRule = {
  title: string;
  rule: string;
  why: string;
};

const revenueAccounts: RevenueAccount[] = [
  {
    code: "4400.10",
    name: "SALT-01 · Wholesale revenue",
    source: "Square invoices to the 12 retail accounts; deposit to operating chequing tagged with SALT-01.WHL.",
    channelCmTarget: "≥ 50% (Rule 02 trigger if two quarters under)",
  },
  {
    code: "4400.20",
    name: "SALT-01 · Custom labels revenue",
    source: "Stripe / Square deposits for event runs; deposit must clear before the run starts.",
    channelCmTarget: "≥ 60%",
  },
  {
    code: "4400.30",
    name: "SALT-01 · DTC batch revenue",
    source: "Shopify payouts for the monthly batch; matched to the manifest the OM files Thursday.",
    channelCmTarget: "≥ 30% (the batch-only model exists to keep this above zero)",
  },
  {
    code: "4400.40",
    name: "SALT-01 · Markets revenue (PR / cost-recovery)",
    source: "Cash + Square Reader receipts from the 2–3 PR markets / yr.",
    channelCmTarget: "Cost-recovery only — counted as marketing spend, not contribution.",
  },
];

const costAccounts: CostAccount[] = [
  {
    code: "5100",
    name: "SALT-01 · COGS",
    basis: "Raw salt, jars, lids, ingredients. Booked at receipt of supplier invoice; split per channel from the Shippo/Square SKU export.",
    contra: "—",
  },
  {
    code: "5200",
    name: "SALT-01 · Freight & shipping",
    basis: "Manitoulin freight + Canada Post pickup, posted from the monthly Shippo + Manitoulin statements.",
    contra: "—",
  },
  {
    code: "5300",
    name: "SALT-01 · Packaging & labels",
    basis: "Custom labels, mailers, void-fill, dunnage; posted from supplier invoices.",
    contra: "—",
  },
  {
    code: "5400",
    name: "SALT-01 · Allocated labour",
    basis: "(OM hours × loaded rate) + (casual hours × loaded rate) from the monthly close timesheet. See allocation rule 1.",
    contra: "Mirror credit to 6020 — Wages (Operations) so agency wages are not double-counted.",
  },
  {
    code: "5500",
    name: "SALT-01 · Depot rent allocation",
    basis: "$300 / mo flat ($3,600 / yr — 10% of the $3,000 / mo facility line). See allocation rule 2.",
    contra: "Mirror credit to 6010 — Facilities so agency facilities are not double-counted.",
  },
];

const allocationRules: AllocationRule[] = [
  {
    title: "1 · Labour",
    rule: "Each month the OM logs salt hours by day on the close timesheet (target ≤ 12 hrs / mo per Rule 01). Casual-bench hours are pulled from the depot timesheet, filtered by the SALT cost code. The bookkeeper journals (OM hrs × OM loaded rate $53/hr) + (casual hrs × casual loaded rate $25/hr) to 5400, with the mirror credit to 6020.",
    why: "Loaded rates derive from the budget: OM $8,500 / mo ÷ 160 hrs ≈ $53/hr; casual rate $25/hr includes burden. Recalculated at the start of each fiscal year from that year's budget (Part II).",
  },
  {
    title: "2 · Depot rent",
    rule: "$300 / mo posted as a recurring journal to 5500 with the mirror credit to 6010 — Facilities. Reviewed once at fiscal year-end against the quarterly hours-by-pillar reports: if salt's share of depot floor-time exceeded 10% in two of four quarters, the allocation steps up to the actual share for the next fiscal year.",
    why: "The 10% baseline matches the planning model in the Part VI · 03 P&L slide. The annual review keeps the allocation honest without month-to-month recalibration noise.",
  },
  {
    title: "3 · Channel split of variable costs",
    rule: "5100 / 5200 / 5300 totals are split into the four sub-channels (W / CL / DTC / MK) by the bookkeeper using the SKU mix coded into the Shippo and Square exports. The split lives on the monthly close template and is what produces the channel-level CM% the P&L slide claims.",
    why: "Channel CM% is the metric that triggers Rule 02 repricing. It can only be computed if 5100–5300 are pre-split per channel, every month, before close.",
  },
];

const reportingFlow = [
  {
    cadence: "Monthly",
    template: "Salt monthly close",
    href: "/salt-monthly-close",
    produces:
      "Channel-level CM%, salt-line net contribution, the OM-hours-cap flag (Rule 01, monthly), and the QTD rollup that arms the wholesale reprice / drop trigger. Filed by the bookkeeper on the Thursday of batch week.",
  },
  {
    cadence: "Quarterly",
    template: "Salt monthly close · month 3 + Hours-by-pillar report",
    href: "/hours",
    produces:
      "At month 3, the close evaluates QTD CM% against the channel floor. The wholesale reprice / drop trigger (Rule 02) fires only when this quarter's QTD is under floor and the prior quarter was under too. The hours-by-pillar report runs the parallel two-quarters-under check on Deer Lake share for every shared role.",
  },
  {
    cadence: "Annual",
    template: "Reinvestment receipts audit",
    href: "/onepager",
    produces:
      "Joins the salt net contribution into the agency reinvestment receipts audit (Part II). Confirms loaded rates and depot allocation for the next fiscal year.",
  },
];

export default function SaltCoA() {
  const onPrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="onepager-screen checklist">
      <div className="onepager-sheet">
        <div className="flex items-baseline justify-between border-b border-[#c8bfa7] pb-[8pt] mb-[10pt] print:pb-[5pt] print:mb-[6pt]">
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[3pt] print:text-[7pt] print:mb-[2pt]">
              Headwaters · Cost-centre SALT-01 · chart of accounts
            </div>
            <h1 className="font-display text-[19pt] leading-[1.05] tracking-tight text-[#1f3d2e] font-semibold print:text-[15pt]">
              The bookkeeper-side scaffolding the salt P&amp;L slide assumes.
            </h1>
          </div>
          <div className="text-right text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:text-[7pt]">
            <div>Working doc / print version</div>
            <div className="mt-[2pt] text-[#1f3d2e] font-semibold tracking-[0.16em]">
              Slide VI · 03 reconciles to here
            </div>
          </div>
        </div>

        <div className="print-hide flex items-center justify-between gap-[8pt] mb-[10pt] text-[9pt]">
          <div className="text-[#6b7665] max-w-[60%]">
            Documented chart-of-accounts entry for cost-centre{" "}
            <span className="font-mono text-[#1f3d2e] font-semibold">SALT-01</span>.
            Use this as the canonical source when setting up the agency books or
            handing the file to a new bookkeeper. The monthly and quarterly
            templates that read from these accounts are linked at the bottom.
          </div>
          <div className="flex gap-[6pt]">
            <a
              href={`${import.meta.env.BASE_URL}salt-monthly-close`}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#1f3d2e] text-[#1f3d2e] hover:bg-[#ebe2d0]"
            >
              Open monthly close
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

        <div className="grid grid-cols-3 gap-[8pt] mb-[10pt] text-[9pt] print:gap-[6pt] print:mb-[6pt]">
          <FieldBlock label="Cost-centre code" hint="Tag every salt line with this code">
            <div className="font-display text-[16pt] text-[#1f3d2e] font-semibold leading-tight print:text-[13pt]">
              SALT-01
            </div>
          </FieldBlock>
          <FieldBlock label="Parent entity" hint="Where the net rolls up">
            <div className="font-display text-[13pt] text-[#1f3d2e] font-semibold leading-tight print:text-[11pt]">
              Headwaters (agency P&amp;L)
            </div>
          </FieldBlock>
          <FieldBlock label="Owner" hint="Files the close">
            <div className="font-display text-[13pt] text-[#1f3d2e] font-semibold leading-tight print:text-[11pt]">
              Bookkeeper
            </div>
          </FieldBlock>
        </div>

        <div className="mb-[12pt] print:mb-[7pt]">
          <div className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[4pt] print:text-[7.5pt]">
            Revenue sub-accounts (channels)
          </div>
          <table
            className="w-full text-[9pt] border-collapse print:text-[8.5pt]"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr className="border-b border-[#c8bfa7] text-left text-[#6b7665] font-semibold align-bottom">
                <th className="py-[4pt] pr-[4pt] w-[12%]">Code</th>
                <th className="py-[4pt] px-[2pt] w-[26%]">Account name</th>
                <th className="py-[4pt] px-[2pt] w-[36%]">Source / posting rule</th>
                <th className="py-[4pt] pl-[2pt] w-[26%]">CM% target</th>
              </tr>
            </thead>
            <tbody className="text-[#2a2520] align-top">
              {revenueAccounts.map((a) => (
                <tr key={a.code} className="border-b border-[#e3dac4]">
                  <td className="py-[4pt] pr-[4pt] font-mono text-[#1f3d2e] font-semibold">
                    {a.code}
                  </td>
                  <td className="py-[4pt] px-[2pt] font-semibold text-[#1f3d2e]">
                    {a.name}
                  </td>
                  <td className="py-[4pt] px-[2pt] leading-[1.4]">{a.source}</td>
                  <td className="py-[4pt] pl-[2pt] leading-[1.4]">{a.channelCmTarget}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-[12pt] print:mb-[7pt]">
          <div className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[4pt] print:text-[7.5pt]">
            Direct cost lines (debited to SALT-01)
          </div>
          <table
            className="w-full text-[9pt] border-collapse print:text-[8.5pt]"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr className="border-b border-[#c8bfa7] text-left text-[#6b7665] font-semibold align-bottom">
                <th className="py-[4pt] pr-[4pt] w-[10%]">Code</th>
                <th className="py-[4pt] px-[2pt] w-[24%]">Account name</th>
                <th className="py-[4pt] px-[2pt] w-[38%]">Basis / posting rule</th>
                <th className="py-[4pt] pl-[2pt] w-[28%]">Mirror / contra</th>
              </tr>
            </thead>
            <tbody className="text-[#2a2520] align-top">
              {costAccounts.map((a) => (
                <tr key={a.code} className="border-b border-[#e3dac4]">
                  <td className="py-[4pt] pr-[4pt] font-mono text-[#1f3d2e] font-semibold">
                    {a.code}
                  </td>
                  <td className="py-[4pt] px-[2pt] font-semibold text-[#1f3d2e]">
                    {a.name}
                  </td>
                  <td className="py-[4pt] px-[2pt] leading-[1.4]">{a.basis}</td>
                  <td className="py-[4pt] pl-[2pt] leading-[1.4]">{a.contra}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-[4pt] text-[8pt] text-[#6b7665] leading-[1.4] print:text-[7.5pt]">
            Net contribution = sum(4400.x) − sum(5100, 5200, 5300, 5400, 5500). It
            posts to the agency P&amp;L on a single line —{" "}
            <span className="font-mono text-[#1f3d2e]">8400 — Salt line net contribution</span>{" "}
            — so the agency P&amp;L stays one page.
          </div>
        </div>

        <div className="mb-[12pt] print:mb-[7pt]">
          <div className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[4pt] print:text-[7.5pt]">
            Allocation rules (the thing that makes 5400 / 5500 honest)
          </div>
          <div className="space-y-[6pt] print:space-y-[3pt]">
            {allocationRules.map((r) => (
              <div
                key={r.title}
                className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] print:p-[5pt]"
              >
                <div className="font-display text-[11pt] text-[#1f3d2e] font-semibold mb-[2pt] print:text-[10pt]">
                  {r.title}
                </div>
                <div className="text-[9pt] text-[#2a2520] leading-[1.4] mb-[3pt] print:text-[8.5pt]">
                  {r.rule}
                </div>
                <div className="text-[8pt] text-[#6b7665] leading-[1.4] italic print:text-[7.5pt]">
                  Why: {r.why}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-[10pt] print:mb-[6pt]">
          <div className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[4pt] print:text-[7.5pt]">
            Reporting cadence
          </div>
          <table
            className="w-full text-[9pt] border-collapse print:text-[8.5pt]"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr className="border-b border-[#c8bfa7] text-left text-[#6b7665] font-semibold">
                <th className="py-[4pt] pr-[4pt] w-[14%]">Cadence</th>
                <th className="py-[4pt] px-[2pt] w-[24%]">Template</th>
                <th className="py-[4pt] pl-[2pt] w-[62%]">What it produces</th>
              </tr>
            </thead>
            <tbody className="text-[#2a2520] align-top">
              {reportingFlow.map((f) => (
                <tr key={f.cadence} className="border-b border-[#e3dac4]">
                  <td className="py-[4pt] pr-[4pt] font-semibold text-[#1f3d2e]">
                    {f.cadence}
                  </td>
                  <td className="py-[4pt] px-[2pt]">
                    <a
                      href={`${import.meta.env.BASE_URL.replace(/\/$/, "")}${f.href}`}
                      className="font-mono text-[#1f3d2e] underline decoration-[#b85a3e] decoration-1 underline-offset-2 hover:opacity-80 print:no-underline"
                    >
                      {f.template}
                    </a>
                  </td>
                  <td className="py-[4pt] pl-[2pt] leading-[1.4]">{f.produces}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="mt-[6pt] p-[8pt] rounded-[3pt] print:mt-[3pt] print:py-[5pt] print:px-[8pt]"
          style={{ background: "#1f3d2e", color: "#f4ede0" }}
        >
          <div
            className="font-mono uppercase tracking-[0.2em] text-[8pt] font-semibold mb-[4pt] print:text-[7pt] print:mb-[2pt]"
            style={{ color: "#e9c8a8" }}
          >
            Why these accounts and not just one salt line in the agency P&amp;L
          </div>
          <div className="font-display text-[10pt] leading-[1.45] print:text-[9pt] print:leading-[1.3]">
            One salt line would hide the channel mix that Rule 02 acts on.
            Splitting revenue four ways and pulling labour + depot out as
            allocations is what makes the slide&rsquo;s wholesale-CM-drops-below-50%
            and OM-hours-past-12-cap triggers actually computable from the
            books. Without these accounts the runbook&rsquo;s rules are
            aspirational; with them, the bookkeeper&rsquo;s monthly close is
            the enforcement mechanism.
          </div>
        </div>

        <div className="border-t border-[#c8bfa7] mt-[8pt] pt-[5pt] flex items-center justify-between text-[7.5pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:mt-[5pt] print:pt-[3pt] print:text-[6.5pt]">
          <div>Source: Practitioner Operating Plan, slide VI · 02 + VI · 03</div>
          <div className="text-[#1f3d2e] font-semibold">
            Headwaters · SALT-01 chart of accounts
          </div>
        </div>
      </div>
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
    <div>
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
