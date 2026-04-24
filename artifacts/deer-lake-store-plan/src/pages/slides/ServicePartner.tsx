type Line = {
  label: string;
  amount: string;
  detail: string;
};

const costLines: Line[] = [
  {
    label: "Cost basis (the team)",
    amount: "$66,700 / mo",
    detail:
      "Practitioner, ops manager in Dryden, tech lead, bookkeeper, CD associate, junior analyst, life supports, tooling, recurring tech ops.",
  },
  {
    label: "Reinvestment (35% markup)",
    amount: "$23,300 / mo",
    detail:
      "Tech CAPEX (~$60k yr-1), tooling subscriptions, training and R&D, and a pilot reserve so the model scales beyond Deer Lake.",
  },
];

const includedItems: Line[] = [
  {
    label: "9 self-hosted servers",
    amount: "Owned by the agency · transferable to the band",
    detail:
      "Band data sovereignty: household-level grocery prices, freight logs, procurement records — all hosted on infrastructure the band can take possession of when ready.",
  },
  {
    label: "6 privacy phones (GrapheneOS)",
    amount: "For council and key staff",
    detail:
      "Encrypted by default, no surveillance capitalism in council pockets. Auditable, replaceable, councillor-friendly.",
  },
  {
    label: "Public price dashboard",
    amount: "Live by month 3 · adopted by month 6",
    detail:
      "Anyone in Deer Lake can see what the store paid, what it's selling at, and what the margin is — line by line. The transparency the council has been asking for.",
  },
  {
    label: "Household price lookup tool",
    amount: "Live by month 9",
    detail:
      "Family-by-family monthly grocery costs vs. baseline, with subsidy pass-through visible. Council can defend pricing to anyone.",
  },
  {
    label: "Six-module playbook",
    amount: "Documented as we go",
    detail:
      "Operating plan, hiring runbook, financial model, transparency stack, tech infra, accountability framework — fully documented so the band runs it after we hand off.",
  },
  {
    label: "Year-end value-delivered audit",
    amount: "Independent · annual",
    detail:
      "Third-party review against the 35% markup. If the value delivered to Deer Lake doesn't beat the reinvestment we charged for, we credit forward. In writing.",
  },
];

export default function ServicePartner() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4.5vh] flex flex-col">
        <div className="mb-[2vh]">
          <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
            06 · Operations & technology partner
          </div>
          <h2 className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium">
            What the band pays.
            <span className="italic font-normal"> What stays in the community when we leave.</span>
          </h2>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-[1.4vw] min-h-0">
          <div className="col-span-5 rounded-[0.4vw] p-[1.6vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[1vw] text-accent font-semibold mb-[0.8vh]">THE NUMBERS</div>
            <div className="font-mono uppercase tracking-[0.18em] text-[0.9vw] text-muted mb-[1.5vh]">
              Recommended engagement size · 12-month review at M6
            </div>

            <div className="space-y-[1.2vh] mb-[1.5vh]">
              {costLines.map((l) => (
                <div key={l.label}>
                  <div className="flex items-baseline justify-between">
                    <div className="font-mono uppercase tracking-[0.16em] text-[0.85vw] text-muted">
                      {l.label}
                    </div>
                    <div className="font-display text-[1.4vw] text-primary font-semibold leading-none">
                      {l.amount}
                    </div>
                  </div>
                  <div className="font-body text-[0.92vw] text-text leading-[1.4] mt-[0.3vh]">
                    {l.detail}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="rounded-[0.3vw] p-[1vw] mt-auto"
              style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
            >
              <div className="flex items-baseline justify-between">
                <div
                  className="font-mono uppercase tracking-[0.18em] text-[0.85vw]"
                  style={{ color: "#e9c8a8" }}
                >
                  Total bill to Deer Lake
                </div>
                <div className="font-display text-[2vw] font-semibold leading-none">
                  $90,000 / mo
                </div>
              </div>
              <div className="font-body text-[0.85vw] leading-[1.4] mt-[0.6vh] opacity-95">
                Bill = cost × 1.35. The 35% is a separate audited line — not
                margin in disguise. Where it goes, what it ships, and how it's
                measured is on the right.
              </div>
            </div>
          </div>

          <div className="col-span-7 rounded-[0.4vw] p-[1.6vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[1vw] text-accent font-semibold mb-[0.8vh]">WHAT STAYS WITH DEER LAKE</div>
            <div className="font-mono uppercase tracking-[0.18em] text-[0.9vw] text-muted mb-[1.5vh]">
              Funded by the 35% reinvestment line · transferable on handoff
            </div>

            <div className="grid grid-cols-2 gap-[1vw] flex-1 min-h-0">
              {includedItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[0.3vw] p-[0.9vw]"
                  style={{ background: "rgba(31,61,46,0.05)" }}
                >
                  <div className="font-display text-[1.05vw] text-primary font-semibold leading-tight mb-[0.3vh]">
                    {item.label}
                  </div>
                  <div className="font-mono uppercase tracking-[0.12em] text-[0.7vw] text-accent mb-[0.4vh]">
                    {item.amount}
                  </div>
                  <div className="font-body text-[0.82vw] text-text leading-[1.4]">
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-[1.5vh] font-body text-[0.85vw] text-muted leading-[1.4]">
          Deer Lake is{" "}
          <span className="text-primary font-semibold">pilot #1</span> for a
          model designed to be replicable across reserves. That means the band
          gets the tools first, the documentation as we build it, and the
          option to take ownership of the entire stack at any handover point.
          The 35% pays for what stays — not for what disappears with the
          contractor.
        </div>
      </div>
    </div>
  );
}
