import {
  SALT_PLANNING_BASELINE,
  WHOLESALE_CM_FLOOR,
  useLatestSaltClose,
} from "../lib/saltClose";

const fmtMoney = (n: number) => {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;
};

export default function OnePager() {
  const latestSaltClose = useLatestSaltClose();
  return (
    <div className="onepager-screen">
      <div className="onepager-sheet">
        <div className="flex items-baseline justify-between border-b border-[#c8bfa7] pb-[8pt] mb-[12pt]">
          <div>
            <div
              className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[3pt]"
            >
              Practitioner Operating Plan · One Page Summary
            </div>
            <h1
              className="font-display text-[20pt] leading-[1.05] tracking-tight text-[#1f3d2e] font-semibold"
            >
              The team that makes the yes sustainable — and the template the next reserve inherits.
            </h1>
          </div>
          <div className="text-right text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665]">
            Prepared for the contractor
            <div className="mt-[2pt] text-[#1f3d2e] font-semibold tracking-[0.16em]">
              v2 · Spring 2026
            </div>
          </div>
        </div>

        <div className="text-[9.5pt] leading-[1.4] text-[#2a2520] mb-[10pt]">
          A community development contract at $60k+/month is a real inflection
          point. It only stays a yes if the practitioner's days with the kids
          stay sacred, the on-the-ground execution doesn't depend on one tired
          person, and the band gets infrastructure that outlasts the
          engagement. Below: the operating structure, the financial model with
          a 35% reinvestment markup, and the path from one pilot to a
          repeatable template.
        </div>

        <div className="mb-[10pt]">
          <div
            className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[5pt]"
          >
            The Cost Basis · Loaded Monthly · Scenario A floor
          </div>
          <table
            className="w-full text-[9pt] border-collapse"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr className="border-b border-[#c8bfa7] text-left text-[#6b7665] font-semibold">
                <th className="py-[3pt] pr-[4pt] w-[28%]">Role</th>
                <th className="py-[3pt] pr-[4pt] w-[44%]">What it absorbs</th>
                <th className="py-[3pt] pr-[4pt] w-[14%] text-right">Monthly</th>
                <th className="py-[3pt] w-[14%] text-right">Adds at</th>
              </tr>
            </thead>
            <tbody className="text-[#2a2520]">
              <tr className="border-b border-[#e3dac4] align-top">
                <td className="py-[3pt] pr-[4pt] font-semibold">Practitioner / Lead</td>
                <td className="py-[3pt] pr-[4pt]">Engagement owner; strategic + field work</td>
                <td className="py-[3pt] pr-[4pt] text-right font-semibold">$14,000</td>
                <td className="py-[3pt] text-right text-[#6b7665]">A</td>
              </tr>
              <tr className="border-b border-[#e3dac4] align-top">
                <td className="py-[3pt] pr-[4pt] font-semibold">Operations Manager</td>
                <td className="py-[3pt] pr-[4pt]">Phone, depot, day-of fires; 807 ops + Deer Lake distribution</td>
                <td className="py-[3pt] pr-[4pt] text-right font-semibold">$8,500</td>
                <td className="py-[3pt] text-right text-[#6b7665]">A</td>
              </tr>
              <tr className="border-b border-[#e3dac4] align-top">
                <td className="py-[3pt] pr-[4pt] font-semibold">Tech Lead / SRE</td>
                <td className="py-[3pt] pr-[4pt]">Server fleet, privacy phones, transparency stack</td>
                <td className="py-[3pt] pr-[4pt] text-right font-semibold">$9,500</td>
                <td className="py-[3pt] text-right text-[#6b7665]">A</td>
              </tr>
              <tr className="border-b border-[#e3dac4] align-top">
                <td className="py-[3pt] pr-[4pt] font-semibold">Bookkeeper / Admin</td>
                <td className="py-[3pt] pr-[4pt]">Invoicing, contracts, CRA, agency back office</td>
                <td className="py-[3pt] pr-[4pt] text-right font-semibold">$2,500</td>
                <td className="py-[3pt] text-right text-[#6b7665]">A</td>
              </tr>
              <tr className="border-b border-[#e3dac4] align-top">
                <td className="py-[3pt] pr-[4pt] font-semibold">CD Associate</td>
                <td className="py-[3pt] pr-[4pt]">Pilot #2 readiness; community-facing engagement</td>
                <td className="py-[3pt] pr-[4pt] text-right font-semibold">$7,500</td>
                <td className="py-[3pt] text-right text-[#6b7665]">B</td>
              </tr>
              <tr className="border-b border-[#e3dac4] align-top">
                <td className="py-[3pt] pr-[4pt] font-semibold">Junior Analyst / Field</td>
                <td className="py-[3pt] pr-[4pt]">Data, household price lookups, fieldwork</td>
                <td className="py-[3pt] pr-[4pt] text-right font-semibold">$6,500</td>
                <td className="py-[3pt] text-right text-[#6b7665]">B</td>
              </tr>
              <tr className="border-b border-[#e3dac4] align-top">
                <td className="py-[3pt] pr-[4pt] font-semibold">Senior Engineer #2 + Outreach + Trainer</td>
                <td className="py-[3pt] pr-[4pt]">Server resilience, pilot #2 sourcing, council training</td>
                <td className="py-[3pt] pr-[4pt] text-right font-semibold">$26,500</td>
                <td className="py-[3pt] text-right text-[#6b7665]">C</td>
              </tr>
              <tr className="border-b border-[#e3dac4] align-top">
                <td className="py-[3pt] pr-[4pt] font-semibold">
                  Life supports + overhead + buffer
                </td>
                <td className="py-[3pt] pr-[4pt]">
                  Cleaner, tutor, handyman, tooling/SaaS, recurring tech ops, statutory buffer
                </td>
                <td className="py-[3pt] pr-[4pt] text-right font-semibold">$9,900</td>
                <td className="py-[3pt] text-right text-[#6b7665]">A</td>
              </tr>
              <tr className="border-b border-[#c8bfa7] align-top">
                <td className="py-[3pt] pr-[4pt] font-semibold">Facilities — aggregation hub</td>
                <td className="py-[3pt] pr-[4pt]">
                  Dad-warehouse · $2,200 rent + utilities, all-in (garage + house-next-door priced as expansion options; see /lease-tooling)
                </td>
                <td className="py-[3pt] pr-[4pt] text-right font-semibold">$3,000</td>
                <td className="py-[3pt] text-right text-[#6b7665]">A</td>
              </tr>
              <tr className="font-semibold text-[#1f3d2e]">
                <td className="py-[5pt] pr-[4pt]">Cost basis</td>
                <td className="py-[5pt] pr-[4pt] font-normal text-[#6b7665] text-[8.5pt]">
                  A · floor → B · recommended → C · scale
                </td>
                <td className="py-[5pt] pr-[4pt] text-right" colSpan={2}>
                  $47,400 / $69,700 / $95,600
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-[10pt]">
          <div
            className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[5pt]"
          >
            Bill scenarios — cost basis + reinvestment markup (35% target)
          </div>
          <table
            className="w-full text-[9pt] border-collapse"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr className="border-b border-[#c8bfa7] text-left text-[#6b7665] font-semibold">
                <th className="py-[3pt] pr-[4pt] w-[22%]">Scenario</th>
                <th className="py-[3pt] pr-[4pt] w-[20%] text-right">Cost basis</th>
                <th className="py-[3pt] pr-[4pt] w-[20%] text-right">Reinvestment</th>
                <th className="py-[3pt] pr-[4pt] w-[20%] text-right">Bill / month</th>
                <th className="py-[3pt] w-[18%] text-right">Bridge needed</th>
              </tr>
            </thead>
            <tbody className="text-[#2a2520]">
              <tr className="border-b border-[#e3dac4]">
                <td className="py-[3pt] pr-[4pt] font-semibold">A · floor</td>
                <td className="py-[3pt] pr-[4pt] text-right">$47,400</td>
                <td className="py-[3pt] pr-[4pt] text-right">$12,600 (27%)</td>
                <td className="py-[3pt] pr-[4pt] text-right font-semibold">$60,000</td>
                <td className="py-[3pt] text-right">~$95k</td>
              </tr>
              <tr className="border-b border-[#e3dac4] bg-[#f0e6d2]">
                <td className="py-[3pt] pr-[4pt] font-semibold">B · recommended</td>
                <td className="py-[3pt] pr-[4pt] text-right">$69,700</td>
                <td className="py-[3pt] pr-[4pt] text-right">$20,300 (29%)</td>
                <td className="py-[3pt] pr-[4pt] text-right font-semibold">$90,000</td>
                <td className="py-[3pt] text-right">~$181k</td>
              </tr>
              <tr>
                <td className="py-[3pt] pr-[4pt] font-semibold">C · scale</td>
                <td className="py-[3pt] pr-[4pt] text-right">$95,600</td>
                <td className="py-[3pt] pr-[4pt] text-right">$29,400 (31%)</td>
                <td className="py-[3pt] pr-[4pt] text-right font-semibold">$125,000</td>
                <td className="py-[3pt] text-right">~$251k</td>
              </tr>
            </tbody>
          </table>
          <div className="text-[8pt] text-[#6b7665] mt-[3pt] leading-[1.35]">
            Cost basis includes the Dad-warehouse aggregation hub
            ($3k/mo all-in; see /lease-tooling for the related-party
            documentation). Bridge = M2 trough on a net-60 cycle (two months
            of cost basis + day-one tech CAPEX of $0 / $42k / $60k).
            Recovered when the last two invoices clear. 35% reinvestment is
            the target; the actual % drifts as the cost basis grows.
          </div>
        </div>

        <div className="mb-[10pt]">
          <div
            className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[5pt]"
          >
            What the 35% reinvestment buys (recommended ask)
          </div>
          <table
            className="w-full text-[9pt] border-collapse"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr className="border-b border-[#c8bfa7] text-left text-[#6b7665] font-semibold">
                <th className="py-[3pt] pr-[4pt] w-[26%]">Destination</th>
                <th className="py-[3pt] pr-[4pt] w-[18%] text-right">Year 1</th>
                <th className="py-[3pt] w-[56%]">What it ships</th>
              </tr>
            </thead>
            <tbody className="text-[#2a2520]">
              <tr className="border-b border-[#e3dac4]">
                <td className="py-[3pt] pr-[4pt] font-semibold">Tech CAPEX</td>
                <td className="py-[3pt] pr-[4pt] text-right">~$60k</td>
                <td className="py-[3pt]">9 self-hosted servers, 6 privacy phones, 8 work computers, networking</td>
              </tr>
              <tr className="border-b border-[#e3dac4]">
                <td className="py-[3pt] pr-[4pt] font-semibold">Tooling subscriptions</td>
                <td className="py-[3pt] pr-[4pt] text-right">~$24k</td>
                <td className="py-[3pt]">Transparency dashboard hosting, GIS, secure comms, project ops, payroll</td>
              </tr>
              <tr className="border-b border-[#e3dac4]">
                <td className="py-[3pt] pr-[4pt] font-semibold">Training & R&D</td>
                <td className="py-[3pt] pr-[4pt] text-right">~$36k</td>
                <td className="py-[3pt]">Indigenous-services certifications, conferences, documented playbook hours</td>
              </tr>
              <tr>
                <td className="py-[3pt] pr-[4pt] font-semibold">Pilot #2 reserve</td>
                <td className="py-[3pt] pr-[4pt] text-right">~$160k</td>
                <td className="py-[3pt]">Held in a separate account; seeds the next reserve so they don't wait for grants</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-[10pt]">
          <div
            className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[5pt]"
          >
            Salt cost-centre · SALT-01 net contribution to the agency P&amp;L
          </div>
          <div
            className="border border-[#c8bfa7] rounded-[3pt] p-[8pt]"
            style={{
              background: latestSaltClose
                ? latestSaltClose.status === "reprice"
                  ? "#f7d7c9"
                  : latestSaltClose.status === "watch"
                  ? "#fbeed1"
                  : "#ebe2d0"
                : "transparent",
            }}
          >
            <div className="grid grid-cols-3 gap-[8pt] items-end">
              <div>
                <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665]">
                  {latestSaltClose
                    ? `Latest filed close · ${latestSaltClose.month || "month not labelled"}`
                    : "Planning baseline · pre-filing"}
                </div>
                <div className="font-display text-[16pt] leading-tight text-[#1f3d2e] font-semibold">
                  {latestSaltClose
                    ? fmtMoney(latestSaltClose.net)
                    : fmtMoney(SALT_PLANNING_BASELINE.monthlyNet)}
                  <span className="text-[8pt] font-normal text-[#6b7665] ml-[3pt]">
                    {latestSaltClose ? "this month → 8400" : "/ mo (~$61k/yr)"}
                  </span>
                </div>
              </div>
              <div>
                <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665]">
                  Wholesale CM% · floor {WHOLESALE_CM_FLOOR}%
                </div>
                <div
                  className="font-display text-[16pt] leading-tight font-semibold"
                  style={{
                    color:
                      latestSaltClose && latestSaltClose.status !== "ok"
                        ? "#b85a3e"
                        : "#1f3d2e",
                  }}
                >
                  {latestSaltClose && latestSaltClose.wholesaleCmPct !== null
                    ? `${latestSaltClose.wholesaleCmPct.toFixed(0)}%`
                    : `${SALT_PLANNING_BASELINE.wholesaleCmPct}%`}
                  <span className="text-[8pt] font-normal text-[#6b7665] ml-[3pt]">
                    {latestSaltClose && latestSaltClose.wholesaleQtdCmPct !== null
                      ? `· QTD ${latestSaltClose.wholesaleQtdCmPct.toFixed(0)}%`
                      : "· planning"}
                  </span>
                </div>
              </div>
              <div>
                <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665]">
                  Status
                </div>
                <div
                  className="font-display text-[14pt] leading-tight font-semibold uppercase tracking-[0.04em]"
                  style={{
                    color: !latestSaltClose
                      ? "#6b7665"
                      : latestSaltClose.status === "reprice"
                      ? "#b85a3e"
                      : latestSaltClose.status === "watch"
                      ? "#a07a18"
                      : "#1f3d2e",
                  }}
                >
                  {!latestSaltClose
                    ? "Pre-filing"
                    : latestSaltClose.status === "reprice"
                    ? "Reprice"
                    : latestSaltClose.status === "watch"
                    ? "Watch"
                    : "OK"}
                </div>
              </div>
            </div>
            <div className="text-[8pt] text-[#6b7665] mt-[4pt] leading-[1.35]">
              {latestSaltClose ? (
                <>
                  {latestSaltClose.statusReason} Posts as a single line (8400)
                  to the agency P&amp;L; planning baseline is ~$61k/yr net.
                  Source: <span className="font-mono">/salt-monthly-close</span>
                  {latestSaltClose.preparedBy
                    ? ` · filed by ${latestSaltClose.preparedBy}${
                        latestSaltClose.preparedOn ? ` (${latestSaltClose.preparedOn})` : ""
                      }`
                    : ""}
                  .
                </>
              ) : (
                <>
                  Planning baseline ~$61k/yr net (~$5.1k/mo) at wholesale
                  CM 63%. Once the bookkeeper files a monthly close at{" "}
                  <span className="font-mono">/salt-monthly-close</span>, the
                  live figure replaces the baseline here.
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[12pt] mb-[8pt]">
          <div>
            <div
              className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[4pt]"
            >
              The Ask
            </div>
            <div className="text-[9pt] leading-[1.4] text-[#2a2520]">
              A monthly retainer of <span className="font-semibold">$90,000</span>{" "}
              against a 12-month engagement, reviewed at month 6, plus
              acknowledgement that{" "}
              <span className="font-semibold">~$181,000 of bridge capital</span>{" "}
              is required on day one to cover team payroll plus tech CAPEX
              (cost basis includes the Dad-warehouse aggregation hub at
              $3k/mo all-in; see /lease-tooling) before the first net-60
              invoice clears. 35% is the target reinvestment line — audited
              annually; the actual % drifts as the cost basis grows.
            </div>
          </div>
          <div>
            <div
              className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[4pt]"
            >
              Net-positive accountability
            </div>
            <div className="text-[9pt] leading-[1.4] text-[#2a2520]">
              The markup is upfront. The receipts are public:{" "}
              <span className="font-semibold">procurement savings delivered</span>,{" "}
              time returned to band staff, transparency tools shipped &
              adopted, capacity built locally,{" "}
              <span className="font-semibold">year-end value-delivered audit</span>.
              If the value delivered doesn't beat the markup, we credit forward.
            </div>
          </div>
        </div>

        <div className="border-t border-[#c8bfa7] pt-[6pt] flex items-center justify-between text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665]">
          <div>No free lunches · capital deployed properly · Deer Lake earns it · then so does every reserve.</div>
          <div className="text-[#1f3d2e] font-semibold">
            Practitioner Operating Plan · v2
          </div>
        </div>
      </div>
    </div>
  );
}
