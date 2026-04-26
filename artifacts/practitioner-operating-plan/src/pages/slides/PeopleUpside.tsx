type Replacement = {
  n: string;
  title: string;
  body: string;
  size: string;
};

const replacements: Replacement[] = [
  {
    n: "01",
    title: "Crew-wide tenure-weighted profit share",
    body:
      "A pool sized as 10–20% of net surplus over a defined threshold, distributed by tenure-weighted formula. Rewards the small crew for outperforming together; rewards staying.",
    size: "10–20% of net surplus over threshold · annual",
  },
  {
    n: "02",
    title: "Outcome milestone bonuses",
    body:
      "One-time payouts tied to named outcomes the contract actually exists to produce — procurement savings audit cleared, transparency stack adopted by council, second pilot signed.",
    size: "~1–2% of revenue · per named outcome",
  },
  {
    n: "03",
    title: "Origination credit (named, not paid as %)",
    body:
      "Whoever brought the relationship is publicly named in the engagement record and the close-of-engagement debrief. Credit travels; cash does not. Avoids turning every coffee into a chase.",
    size: "Public credit · $0",
  },
  {
    n: "04",
    title: "Discretionary judgment bonus",
    body:
      "Practitioner-decided once a year, $500–$2,000 per person, for the moments that don't show up in any spreadsheet — a quiet decision that saved the contract, a colleague carried for a week.",
    size: "$500–$2,000 / person / yr · practitioner discretion",
  },
  {
    n: "05",
    title: "Capped margin commission (with clawback) — rare",
    body:
      "For genuinely commercial roles only. Capped, clawed back if the deal doesn't deliver in year one, never the load-bearing line of someone's pay. Used sparingly or not at all.",
    size: "Capped · clawback · rare",
  },
];

export default function PeopleUpside() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              V · People &amp; Retention · 04 — The upside layer
            </div>
            <h2
              className="font-display text-[3.2vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Five instruments instead of one.
              <span className="italic font-normal text-accent"> Because individual sales commission is the wrong tool for this crew.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[0.95vw] text-muted leading-[1.4]">
            Capped at{" "}
            <span className="text-primary font-semibold">
              ~8–12% of any individual's annual comp
            </span>{" "}
            in a good year. Zero in a flat year. Variable pay never becomes
            survival pay.
          </div>
        </div>

        <div className="grid grid-cols-12 gap-[1.2vw] flex-1 min-h-0">
          <div
            className="col-span-4 rounded-[0.4vw] p-[1.4vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.85vw] font-semibold mb-[1vh]"
              style={{ color: "#e9c8a8" }}
            >
              Why not a commission
            </div>
            <div className="font-display text-[1.5vw] leading-tight font-medium mb-[1.2vh]">
              Four failure modes when you pay individual %.
            </div>
            <div className="space-y-[1vh] font-body text-[0.95vw] leading-[1.4] opacity-95">
              <div className="flex gap-[0.6vw]">
                <div style={{ color: "#e9c8a8" }} className="font-semibold w-[1vw] shrink-0">×</div>
                <div>
                  <span className="font-semibold" style={{ color: "#e9c8a8" }}>Selects for transactional people.</span>{" "}
                  The crew you build is the crew the comp design attracts.
                </div>
              </div>
              <div className="flex gap-[0.6vw]">
                <div style={{ color: "#e9c8a8" }} className="font-semibold w-[1vw] shrink-0">×</div>
                <div>
                  <span className="font-semibold" style={{ color: "#e9c8a8" }}>Variable becomes survival.</span>{" "}
                  Once a household leans on commission to make rent, every
                  decision tilts toward the close.
                </div>
              </div>
              <div className="flex gap-[0.6vw]">
                <div style={{ color: "#e9c8a8" }} className="font-semibold w-[1vw] shrink-0">×</div>
                <div>
                  <span className="font-semibold" style={{ color: "#e9c8a8" }}>Breaks small crews.</span>{" "}
                  Five people can't carry territory wars.
                </div>
              </div>
              <div className="flex gap-[0.6vw]">
                <div style={{ color: "#e9c8a8" }} className="font-semibold w-[1vw] shrink-0">×</div>
                <div>
                  <span className="font-semibold" style={{ color: "#e9c8a8" }}>Rewards the signature, not the outcome.</span>{" "}
                  We're paid for what gets delivered, not what gets sold.
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-8 grid grid-cols-2 gap-[1vw]">
            {replacements.map((r) => (
              <div
                key={r.n}
                className="rounded-[0.4vw] p-[1.1vw] flex flex-col"
                style={{ background: "var(--slide-paper)" }}
              >
                <div className="flex items-baseline gap-[0.6vw] mb-[0.5vh]">
                  <div className="font-mono text-[0.85vw] text-accent font-semibold">
                    {r.n}
                  </div>
                  <div className="font-display text-[1.2vw] leading-tight text-primary font-medium">
                    {r.title}
                  </div>
                </div>
                <div className="font-body text-[0.85vw] text-text leading-[1.4] mb-[0.7vh]">
                  {r.body}
                </div>
                <div
                  className="mt-auto pt-[0.5vh] border-t font-mono uppercase tracking-[0.18em] text-[0.7vw] text-muted"
                  style={{ borderColor: "var(--slide-rule)" }}
                >
                  {r.size}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
