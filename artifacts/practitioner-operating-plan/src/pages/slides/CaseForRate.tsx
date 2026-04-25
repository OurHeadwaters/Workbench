export default function CaseForRate() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[3vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              IV · 01 — The case for the rate
            </div>
            <h2
              className="font-display text-[3.6vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              You're not buying a person.
              <span className="italic font-normal text-accent"> You're buying an operating system — and the next pilot it pays for.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1.1vw] text-muted leading-[1.4]">
            $90k/mo pays for the structure that delivers the work and the
            reinvestment that builds the next reserve's pilot. 35% is the
            target lever; with the new aggregation hub line in cost basis,
            the recommended ask currently sits at ~29%.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-[1.4vw] min-h-0">
          <div
            className="col-span-7 rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[1vw] text-accent font-semibold mb-[1.5vh]">
              What $90k / month actually buys
            </div>
            <div className="space-y-[1.1vh] font-body text-[1.05vw] leading-[1.4] text-text">
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent font-semibold w-[2vw] shrink-0">A.</div>
                <div>
                  <span className="font-semibold text-primary">An operations manager in Dryden</span>{" "}
                  who holds the phone and runs the depot. The contract has hands, not just a name on a contract.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent font-semibold w-[2vw] shrink-0">B.</div>
                <div>
                  <span className="font-semibold text-primary">A real back office</span> —
                  bookkeeping, invoicing, CRA, contract admin. The agency is legally and financially clean.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent font-semibold w-[2vw] shrink-0">C.</div>
                <div>
                  <span className="font-semibold text-primary">A delivery apparatus that holds in winter</span> —
                  the ice road and the air freight, with backup, not heroics.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent font-semibold w-[2vw] shrink-0">D.</div>
                <div>
                  <span className="font-semibold text-primary">A tech lead and a 9-server stack</span> —
                  band-owned data sovereignty, public price dashboard, household lookup,
                  privacy phones for council. The transparency the reserve has been asking for.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent font-semibold w-[2vw] shrink-0">E.</div>
                <div>
                  <span className="font-semibold text-primary">A practitioner who is rested enough to do the work for years</span> —
                  not a flame-out at month nine when the project is just starting to matter.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent font-semibold w-[2vw] shrink-0">F.</div>
                <div>
                  <span className="font-semibold text-primary">The next pilot, pre-funded</span> —
                  35% reinvestment compounded into a reserve so the second community
                  doesn't wait nine months for a grant.
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-5 flex flex-col gap-[1.4vw]">
            <div
              className="rounded-[0.4vw] p-[1.6vw] flex-1 flex flex-col"
              style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
            >
              <div
                className="font-mono uppercase tracking-[0.22em] text-[0.95vw] mb-[1vh]"
                style={{ color: "#e9c8a8" }}
              >
                What anything less buys
              </div>
              <div className="font-display text-[1.6vw] font-medium leading-tight mb-[1vh]">
                A talented person trying to be a team of one — and zero infrastructure for the next reserve.
              </div>
              <div className="font-body text-[1.05vw] leading-[1.45] opacity-95">
                Which is exactly the failure mode of every northern contract
                that quietly didn't deliver. The savings are short-term; the
                cost is the contract itself — and the next reserve waiting in
                line.
              </div>
            </div>

            <div
              className="rounded-[0.4vw] p-[1.4vw]"
              style={{ background: "var(--slide-paper)" }}
            >
              <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] text-accent font-semibold mb-[0.8vh]">
                The math, plainly
              </div>
              <div className="font-body text-[0.95vw] text-text leading-[1.45]">
                Of $90k:{" "}
                <span className="font-semibold text-primary">~$69.7k</span> is
                cost basis — the team that delivers, plus the{" "}
                <a
                  href="/lease-tooling"
                  className="underline decoration-dotted underline-offset-2 text-primary"
                >
                  Dad-warehouse aggregation hub
                </a>{" "}
                ($3k/mo, all-in). The other{" "}
                <span className="font-semibold text-primary">~$20.3k</span>{" "}
                (~29% markup) is the reinvestment line — tech CAPEX, training,
                pilot reserve. Audited annually against measurable savings
                delivered to Deer Lake. Nothing disappears. The 35% target
                comes back into reach when the contract steps to the next
                phase or a second engagement lands.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
