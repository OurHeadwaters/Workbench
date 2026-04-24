export default function OnePager() {
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
              <tr className="border-b border-[#c8bfa7] align-top">
                <td className="py-[3pt] pr-[4pt] font-semibold">
                  Life supports + overhead + buffer
                </td>
                <td className="py-[3pt] pr-[4pt]">
                  Cleaner, tutor, handyman, tooling/SaaS, recurring tech ops, statutory buffer
                </td>
                <td className="py-[3pt] pr-[4pt] text-right font-semibold">$9,900</td>
                <td className="py-[3pt] text-right text-[#6b7665]">A</td>
              </tr>
              <tr className="font-semibold text-[#1f3d2e]">
                <td className="py-[5pt] pr-[4pt]">Cost basis</td>
                <td className="py-[5pt] pr-[4pt] font-normal text-[#6b7665] text-[8.5pt]">
                  A · floor → B · recommended → C · scale
                </td>
                <td className="py-[5pt] pr-[4pt] text-right" colSpan={2}>
                  $44,400 / $66,700 / $92,600
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-[10pt]">
          <div
            className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[5pt]"
          >
            Bill = Cost × 1.35 — the 35% reinvestment markup
          </div>
          <table
            className="w-full text-[9pt] border-collapse"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr className="border-b border-[#c8bfa7] text-left text-[#6b7665] font-semibold">
                <th className="py-[3pt] pr-[4pt] w-[22%]">Scenario</th>
                <th className="py-[3pt] pr-[4pt] w-[20%] text-right">Cost basis</th>
                <th className="py-[3pt] pr-[4pt] w-[20%] text-right">Reinvestment (35%)</th>
                <th className="py-[3pt] pr-[4pt] w-[20%] text-right">Bill / month</th>
                <th className="py-[3pt] w-[18%] text-right">Bridge needed</th>
              </tr>
            </thead>
            <tbody className="text-[#2a2520]">
              <tr className="border-b border-[#e3dac4]">
                <td className="py-[3pt] pr-[4pt] font-semibold">A · floor</td>
                <td className="py-[3pt] pr-[4pt] text-right">$44,400</td>
                <td className="py-[3pt] pr-[4pt] text-right">$15,600</td>
                <td className="py-[3pt] pr-[4pt] text-right font-semibold">$60,000</td>
                <td className="py-[3pt] text-right">~$89k</td>
              </tr>
              <tr className="border-b border-[#e3dac4] bg-[#f0e6d2]">
                <td className="py-[3pt] pr-[4pt] font-semibold">B · recommended</td>
                <td className="py-[3pt] pr-[4pt] text-right">$66,700</td>
                <td className="py-[3pt] pr-[4pt] text-right">$23,300</td>
                <td className="py-[3pt] pr-[4pt] text-right font-semibold">$90,000</td>
                <td className="py-[3pt] text-right">~$175k</td>
              </tr>
              <tr>
                <td className="py-[3pt] pr-[4pt] font-semibold">C · scale</td>
                <td className="py-[3pt] pr-[4pt] text-right">$92,600</td>
                <td className="py-[3pt] pr-[4pt] text-right">$32,400</td>
                <td className="py-[3pt] pr-[4pt] text-right font-semibold">$125,000</td>
                <td className="py-[3pt] text-right">~$245k</td>
              </tr>
            </tbody>
          </table>
          <div className="text-[8pt] text-[#6b7665] mt-[3pt] leading-[1.35]">
            Bridge = M2 trough on a net-60 cycle (two months of cost basis +
            day-one tech CAPEX of $0 / $40k / $60k). Recovered when the last
            two invoices clear.
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
              <span className="font-semibold">~$175,000 of bridge capital</span>{" "}
              is required on day one to cover team payroll plus tech CAPEX
              before the first net-60 invoice clears. Bill = cost × 1.35; the
              35% is a dedicated, audited reinvestment line.
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
