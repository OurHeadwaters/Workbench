type Module = {
  num: string;
  title: string;
  source: string;
  contents: string;
};

const modules: Module[] = [
  {
    num: "01",
    title: "Operating plan",
    source: "Parts I–II of this deck",
    contents:
      "Practitioner runbook (non-negotiables, daily rhythm, weekly check-ins) and the costed team baseline. The how-to-actually-live-while-running-this.",
  },
  {
    num: "02",
    title: "Hiring runbook",
    source: "Part III · five role pages",
    contents:
      "Sourcing channels, screening questions, paid trial structures, and explicit child-safety vetting protocols for every role. Reusable in any small Northern town with a regional college and a bulletin board.",
  },
  {
    num: "03",
    title: "Financial model",
    source: "Budget + Cash Flow + Reinvestment",
    contents:
      "Cost-basis composition with three contract sizes, the 35% reinvestment markup, the bridge-capital math against net-60 payment cycles, and the receipts framework (next module).",
  },
  {
    num: "04",
    title: "Transparency stack",
    source: "Reinvestment line · 9-server build",
    contents:
      "Self-hosted public price dashboard, household-level price lookup, monthly band council pack, secure council comms (privacy phones), and a dataroom the band's own bookkeeper can audit. Owned by the agency, transferable to the band.",
  },
  {
    num: "05",
    title: "Tech infrastructure",
    source: "Reinvestment CAPEX · year-1 spend",
    contents:
      "9 servers, 6 privacy phones, 8 work computers, networking, the POS configuration (Deer Lake Square mockup → live store), and a deployment checklist any IT/Tech can run on a new reserve in two weeks.",
  },
  {
    num: "06",
    title: "Net-positive accountability",
    source: "Accountability slide · audit clause",
    contents:
      "The five measures (procurement savings, time returned, tooling adopted, capacity built, year-end audit) and the forward-credit clause that triggers if the value delivered doesn't beat the markup. The receipt the markup justifies.",
  },
];

export default function Template() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              V · 02 — The template
            </div>
            <h2
              className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Six modules.
              <span className="italic font-normal text-accent"> Repeatable for any reserve in Canada.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1vw] text-muted leading-[1.4]">
            Each module has its own one-pager and its own line in the budget.
            Together: a playbook the next practitioner reads on a Sunday and
            starts on Monday — on or off our agency.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-[1.2vw] min-h-0">
          {modules.map((m, i) => {
            const dark = i === 5;
            return (
              <div
                key={m.num}
                className="rounded-[0.4vw] p-[1.3vw] flex flex-col"
                style={
                  dark
                    ? { background: "var(--slide-primary)", color: "var(--slide-bg)" }
                    : { background: "var(--slide-paper)" }
                }
              >
                <div className="flex items-baseline justify-between mb-[0.5vh]">
                  <div
                    className="font-mono uppercase tracking-[0.22em] text-[0.78vw] font-semibold"
                    style={dark ? { color: "#e9c8a8" } : { color: "var(--slide-accent)" }}
                  >
                    Module {m.num}
                  </div>
                  <div
                    className="font-mono text-[0.7vw]"
                    style={dark ? { color: "#e9c8a8", opacity: 0.85 } : { color: "var(--slide-muted)" }}
                  >
                    {m.source}
                  </div>
                </div>
                <div
                  className="font-display text-[1.4vw] leading-tight font-medium mb-[0.7vh]"
                  style={dark ? { color: "#f4ede0" } : { color: "var(--slide-primary)" }}
                >
                  {m.title}
                </div>
                <div
                  className="font-body text-[0.92vw] leading-[1.45] flex-1"
                  style={dark ? { opacity: 0.95 } : {}}
                >
                  {m.contents}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-[1.2vh] font-body text-[0.85vw] text-muted leading-[1.35]">
          Pilot #1 ships all six. Pilot #2 inherits modules 02, 03, 04, 05, 06
          mostly built — the marginal cost of the second contract is the
          practitioner's time and pilot-specific module 01 work.{" "}
          <span className="text-primary font-semibold">
            That's how the template scales without burning out the practitioner
            or shortchanging the next community.
          </span>
        </div>
      </div>
    </div>
  );
}
