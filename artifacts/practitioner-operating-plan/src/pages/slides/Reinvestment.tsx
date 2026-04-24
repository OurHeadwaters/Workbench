export default function Reinvestment() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              II · Reinvestment — what the 35% builds
            </div>
            <h2
              className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              The markup is the lever.
              <span className="italic font-normal text-accent"> Here's the lift.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1vw] text-muted leading-[1.4]">
            On the $90k recommended ask:{" "}
            <span className="font-mono font-semibold text-primary">$23,300/mo</span>{" "}
            flows into a dedicated reinvestment account. Four destinations, all
            of them outlast the contract.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1.4vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="flex items-baseline justify-between mb-[1vh]">
              <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] text-accent font-semibold">
                01 · Tech CAPEX
              </div>
              <div className="font-display text-[1.5vw] text-primary font-semibold leading-none">
                ~$60k / yr
              </div>
            </div>
            <div className="font-display text-[1.5vw] text-primary font-medium leading-tight mb-[1vh]">
              The infrastructure that ships with the contract.
            </div>
            <div className="font-body text-[1vw] text-text leading-[1.5] flex-1">
              <span className="font-semibold">9 self-hosted servers</span> for
              the transparency stack and band data sovereignty (no third-party
              custodian of household-level numbers).{" "}
              <span className="font-semibold">6 privacy phones</span>{" "}
              (GrapheneOS) for council and team — encrypted by default,
              auditable, no surveillance capitalism in the band's pocket.{" "}
              <span className="font-semibold">8 work computers</span>,
              networking, UPS, switches.
            </div>
            <div
              className="mt-[1vh] pt-[0.8vh] border-t font-mono text-[0.82vw] text-muted leading-[1.35]"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              Owned by the agency, deployed in service of Deer Lake, transferable
              to the band if and when they want it.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="flex items-baseline justify-between mb-[1vh]">
              <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] text-accent font-semibold">
                02 · Tooling subscriptions
              </div>
              <div className="font-display text-[1.5vw] text-primary font-semibold leading-none">
                ~$2k / mo
              </div>
            </div>
            <div className="font-display text-[1.5vw] text-primary font-medium leading-tight mb-[1vh]">
              The software the work runs on.
            </div>
            <div className="font-body text-[1vw] text-text leading-[1.5] flex-1">
              Transparency dashboard hosting (the public household-price
              lookup). GIS for delivery and freight modeling. Secure comms
              (Signal Business, Proton). Project ops (Linear, Notion).
              Bookkeeping (QBO + payroll). Engineering licenses for the
              template work the next reserve will inherit.
            </div>
            <div
              className="mt-[1vh] pt-[0.8vh] border-t font-mono text-[0.82vw] text-muted leading-[1.35]"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              All on annual contracts the agency owns, not personal accounts.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="flex items-baseline justify-between mb-[1vh]">
              <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] text-accent font-semibold">
                03 · Training & R&D
              </div>
              <div className="font-display text-[1.5vw] text-primary font-semibold leading-none">
                ~$3k / mo
              </div>
            </div>
            <div className="font-display text-[1.5vw] text-primary font-medium leading-tight mb-[1vh]">
              The hours that turn a contract into a template.
            </div>
            <div className="font-body text-[1vw] text-text leading-[1.5] flex-1">
              Indigenous-services certifications and conference attendance
              (CANDO, AFOA, ANTCO). Documented playbook hours — every system
              we build for Deer Lake gets written up so pilot #2 doesn't
              start from zero. Training budget for community members hired
              into the engagement.
            </div>
            <div
              className="mt-[1vh] pt-[0.8vh] border-t font-mono text-[0.82vw] text-muted leading-[1.35]"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              Documentation is a deliverable, not a side effect.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div className="flex items-baseline justify-between mb-[1vh]">
              <div
                className="font-mono uppercase tracking-[0.22em] text-[0.9vw] font-semibold"
                style={{ color: "#e9c8a8" }}
              >
                04 · Pilot scale reserve
              </div>
              <div
                className="font-display text-[1.5vw] font-semibold leading-none"
                style={{ color: "#e9c8a8" }}
              >
                ~$13k / mo accruing
              </div>
            </div>
            <div className="font-display text-[1.5vw] font-medium leading-tight mb-[1vh]">
              Pilot #2 doesn't wait for grants.
            </div>
            <div className="font-body text-[1vw] leading-[1.5] opacity-95 flex-1">
              The biggest line. The whole point of the markup. Accumulated
              monthly so that when the second reserve says yes, the agency
              can say yes back without a 9-month bridge ask. Year-1 reserve:
              ~$160k — enough to seed pilot #2 ahead of contract close, with
              no community ever waiting on a fundraising cycle.
            </div>
            <div
              className="mt-[1vh] pt-[0.8vh] border-t font-mono text-[0.82vw] leading-[1.35]"
              style={{ borderColor: "rgba(244,237,224,0.3)", color: "#e9c8a8" }}
            >
              Held in a separate account. Audited annually. Spent only on the
              next reserve, never on operating shortfall.
            </div>
          </div>
        </div>

        <div className="mt-[1vh] font-body text-[0.85vw] text-muted leading-[1.35]">
          The four buys outlast the contract.{" "}
          <span className="text-primary font-semibold">
            Deer Lake's $90k isn't just paying for delivery — it's funding the
            next yes for the next reserve.
          </span>{" "}
          That's why the markup is justified. That's why we measure it
          (next slide).
        </div>
      </div>
    </div>
  );
}
