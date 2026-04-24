export default function OnePager() {
  return (
    <div className="onepager-screen">
      <div className="onepager-sheet">
        <div className="flex items-baseline justify-between border-b border-[#c8bfa7] pb-[8pt] mb-[14pt]">
          <div>
            <div
              className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[3pt]"
            >
              Practitioner Operating Plan · One Page Summary
            </div>
            <h1
              className="font-display text-[22pt] leading-[1.05] tracking-tight text-[#1f3d2e] font-semibold"
            >
              The team that makes the yes sustainable.
            </h1>
          </div>
          <div className="text-right text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665]">
            Prepared for the contractor
            <div className="mt-[2pt] text-[#1f3d2e] font-semibold tracking-[0.16em]">
              Spring 2026
            </div>
          </div>
        </div>

        <div className="text-[10pt] leading-[1.45] text-[#2a2520] mb-[12pt]">
          A community development contract at $20k+/month is a real inflection
          point. It only stays a yes if the practitioner's days with the kids
          stay sacred and the on-the-ground execution doesn't depend on one
          phone, one inbox, one tired person. Below is the operating structure
          that makes both true — and the budget that proves it fits.
        </div>

        <div className="mb-[14pt]">
          <div
            className="font-mono uppercase tracking-[0.2em] text-[9pt] text-[#b85a3e] font-semibold mb-[6pt]"
          >
            The Team · Monthly
          </div>
          <table
            className="w-full text-[10pt] border-collapse"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr className="border-b border-[#c8bfa7] text-left text-[#6b7665] font-semibold">
                <th className="py-[4pt] pr-[4pt] w-[34%]">Role</th>
                <th className="py-[4pt] pr-[4pt] w-[34%]">What it absorbs</th>
                <th className="py-[4pt] pr-[4pt] w-[10%] text-right">Hrs/wk</th>
                <th className="py-[4pt] pr-[4pt] w-[10%] text-right">Rate</th>
                <th className="py-[4pt] w-[12%] text-right">Monthly</th>
              </tr>
            </thead>
            <tbody className="text-[#2a2520]">
              <tr className="border-b border-[#e3dac4] align-top">
                <td className="py-[5pt] pr-[4pt] font-semibold">
                  Operations Manager
                  <div className="font-normal text-[8.5pt] text-[#6b7665]">
                    Dryden, on-site
                  </div>
                </td>
                <td className="py-[5pt] pr-[4pt]">
                  Phone, inbox, day-of fires; 807 ops + Deer Lake aggregation
                  &amp; distribution.
                </td>
                <td className="py-[5pt] pr-[4pt] text-right">40</td>
                <td className="py-[5pt] pr-[4pt] text-right">$40</td>
                <td className="py-[5pt] text-right font-semibold">$7,000</td>
              </tr>
              <tr className="border-b border-[#e3dac4] align-top">
                <td className="py-[5pt] pr-[4pt] font-semibold">
                  Bookkeeper / Admin
                  <div className="font-normal text-[8.5pt] text-[#6b7665]">
                    Remote
                  </div>
                </td>
                <td className="py-[5pt] pr-[4pt]">
                  Invoicing, contracts, CRA, the back office of the agency.
                </td>
                <td className="py-[5pt] pr-[4pt] text-right">10</td>
                <td className="py-[5pt] pr-[4pt] text-right">$40</td>
                <td className="py-[5pt] text-right font-semibold">$1,700</td>
              </tr>
              <tr className="border-b border-[#e3dac4] align-top">
                <td className="py-[5pt] pr-[4pt] font-semibold">Housecleaner</td>
                <td className="py-[5pt] pr-[4pt]">
                  Recurring weekly clean so the house is not the bottleneck.
                </td>
                <td className="py-[5pt] pr-[4pt] text-right">4</td>
                <td className="py-[5pt] pr-[4pt] text-right">$30</td>
                <td className="py-[5pt] text-right font-semibold">$500</td>
              </tr>
              <tr className="border-b border-[#e3dac4] align-top">
                <td className="py-[5pt] pr-[4pt] font-semibold">
                  Tutor
                  <div className="font-normal text-[8.5pt] text-[#6b7665]">
                    Winter-weighted
                  </div>
                </td>
                <td className="py-[5pt] pr-[4pt]">
                  Math, reading, structure. ~10 hrs/wk Nov–Apr; ~2 hrs/wk in
                  summer.
                </td>
                <td className="py-[5pt] pr-[4pt] text-right">~6</td>
                <td className="py-[5pt] pr-[4pt] text-right">$35</td>
                <td className="py-[5pt] text-right font-semibold">$900</td>
              </tr>
              <tr className="border-b border-[#c8bfa7] align-top">
                <td className="py-[5pt] pr-[4pt] font-semibold">
                  Handyman-Housekeeper
                  <div className="font-normal text-[8.5pt] text-[#6b7665]">
                    Consider · don't commit
                  </div>
                </td>
                <td className="py-[5pt] pr-[4pt]">
                  Small jobs that pile up; positive male presence around the
                  boys. References &amp; paid trial weeks required.
                </td>
                <td className="py-[5pt] pr-[4pt] text-right">5</td>
                <td className="py-[5pt] pr-[4pt] text-right">$30</td>
                <td className="py-[5pt] text-right font-semibold">$700</td>
              </tr>
              <tr className="font-semibold text-[#1f3d2e]">
                <td className="py-[6pt] pr-[4pt]">Team total</td>
                <td className="py-[6pt] pr-[4pt] font-normal text-[#6b7665] text-[9pt]">
                  Five roles, fully loaded
                </td>
                <td className="py-[6pt] pr-[4pt] text-right">~65</td>
                <td className="py-[6pt] pr-[4pt] text-right">—</td>
                <td className="py-[6pt] text-right">$10,800</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-[14pt]">
          <div
            className="font-mono uppercase tracking-[0.2em] text-[9pt] text-[#b85a3e] font-semibold mb-[6pt]"
          >
            How it fits inside the contract
          </div>
          <table
            className="w-full text-[10pt] border-collapse"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr className="border-b border-[#c8bfa7] text-left text-[#6b7665] font-semibold">
                <th className="py-[4pt] pr-[4pt] w-[28%]">Contract size</th>
                <th className="py-[4pt] pr-[4pt] w-[24%] text-right">
                  Team (rounded)
                </th>
                <th className="py-[4pt] pr-[4pt] w-[24%] text-right">
                  Practitioner take-home
                </th>
                <th className="py-[4pt] w-[24%] text-right">Agency reinvest</th>
              </tr>
            </thead>
            <tbody className="text-[#2a2520]">
              <tr className="border-b border-[#e3dac4]">
                <td className="py-[5pt] pr-[4pt] font-semibold">$20,000 / mo</td>
                <td className="py-[5pt] pr-[4pt] text-right">$11,000</td>
                <td className="py-[5pt] pr-[4pt] text-right">$7,000</td>
                <td className="py-[5pt] text-right">$2,000</td>
              </tr>
              <tr className="border-b border-[#e3dac4]">
                <td className="py-[5pt] pr-[4pt] font-semibold">$25,000 / mo</td>
                <td className="py-[5pt] pr-[4pt] text-right">$11,000</td>
                <td className="py-[5pt] pr-[4pt] text-right">$9,000</td>
                <td className="py-[5pt] text-right">$5,000</td>
              </tr>
              <tr>
                <td className="py-[5pt] pr-[4pt] font-semibold">$30,000 / mo</td>
                <td className="py-[5pt] pr-[4pt] text-right">$11,000</td>
                <td className="py-[5pt] pr-[4pt] text-right">$11,000</td>
                <td className="py-[5pt] text-right">$8,000</td>
              </tr>
            </tbody>
          </table>
          <div className="text-[8.5pt] text-[#6b7665] mt-[4pt]">
            Team line is rounded up from $10,800 to absorb statutory costs and
            small variances. Each row reconciles to the contract size on the
            left.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[14pt] mb-[10pt]">
          <div>
            <div
              className="font-mono uppercase tracking-[0.2em] text-[9pt] text-[#b85a3e] font-semibold mb-[5pt]"
            >
              The Ask
            </div>
            <div className="text-[10pt] leading-[1.45] text-[#2a2520]">
              A monthly retainer of <span className="font-semibold">$25,000</span>{" "}
              against a 12-month engagement, reviewed at month 6. This funds the
              team that delivers the work, keeps the practitioner in the field
              long enough to actually do the job, and seeds the agency the next
              contract will live inside.
            </div>
          </div>
          <div>
            <div
              className="font-mono uppercase tracking-[0.2em] text-[9pt] text-[#b85a3e] font-semibold mb-[5pt]"
            >
              What you get for it
            </div>
            <div className="text-[10pt] leading-[1.45] text-[#2a2520]">
              An optimised food-price model, delivery execution that holds in
              winter, a coordinator infrastructure that scales to more
              communities, and a partner who is rested enough to do this work
              for years — not a tired person trying to be a team of one.
            </div>
          </div>
        </div>

        <div className="border-t border-[#c8bfa7] pt-[8pt] flex items-center justify-between text-[8.5pt] font-mono uppercase tracking-[0.18em] text-[#6b7665]">
          <div>No free lunches · capital deployed properly · value out the other end.</div>
          <div className="text-[#1f3d2e] font-semibold">
            Practitioner Operating Plan · v1
          </div>
        </div>
      </div>
    </div>
  );
}
