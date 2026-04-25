type Role = {
  num: string;
  title: string;
  body: string;
  tag: string;
};

const roles: Role[] = [
  {
    num: "01",
    title: "Proof of the model",
    body:
      "Parr's Jars is the small, public version of the same Headwaters thesis: a Northern producer making a Northern good with the supply chain, the labels, and the price math all visible. It's the storefront proof that the transparency stack we ship to Deer Lake works on a real product the public can actually buy.",
    tag: "Public-facing receipt",
  },
  {
    num: "02",
    title: "Live load-test for the Dryden depot",
    body:
      "The same warehouse, the same ops manager, the same freight lanes that move groceries north for Deer Lake also move salt south to wholesale and to fulfillment partners. Salt batches stress-test the depot on weeks the contract doesn't — receiving, picking, shipping, returns — so the muscle is built before pilot #2 arrives.",
    tag: "Same depot, different cargo",
  },
  {
    num: "03",
    title: "Shared-labor revenue line",
    body:
      "Salt margin lands in the same agency that pays the same team Deer Lake needs. It diversifies the revenue base off a single contract, and it does it without adding a second org chart, a second bookkeeper, or a second set of insurance.",
    tag: "Funds the team, not a side hustle",
  },
];

export default function SaltUnderHeadwaters() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              VI · 01 — Where salt fits
            </div>
            <h2
              className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Salt stays.
              <span className="italic font-normal text-accent"> A revenue line on the same depot, not a jar-packing business.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1vw] text-muted leading-[1.4]">
            Parr's Jars keeps running — but its job under Headwaters is
            different from what it was as a standalone brand.{" "}
            <span className="text-primary font-semibold">
              Three roles, all of them earned by sharing the Dryden
              infrastructure the contract already pays for.
            </span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.4vw] min-h-0">
          {roles.map((r) => (
            <div
              key={r.num}
              className="rounded-[0.4vw] p-[1.6vw] flex flex-col"
              style={{ background: "var(--slide-paper)" }}
            >
              <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] text-accent font-semibold mb-[1vh]">
                {r.num} · {r.tag}
              </div>
              <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[1vh]">
                {r.title}
              </div>
              <div className="font-body text-[1.05vw] text-text leading-[1.5] flex-1">
                {r.body}
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-[2vh] pt-[1.5vh] border-t grid grid-cols-2 gap-[2vw]"
          style={{ borderColor: "var(--slide-rule)" }}
        >
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-accent font-semibold mb-[0.6vh]">
              What changes
            </div>
            <div className="font-body text-[1.05vw] text-text leading-[1.45]">
              <span className="font-semibold text-primary">DTC jar-shipping is batch-only.</span>{" "}
              No standing storefront expectation, no "ships in 2 days"
              promise. Orders accumulate, the depot runs a batch on a
              scheduled cadence, the wholesale and label channels carry the
              steady volume.{" "}
              <span className="font-semibold text-primary">Farmers markets are sunset.</span>{" "}
              Up to 2–3 flagship appearances per year as PR, never as a
              sales channel — they are the most expensive dollar of revenue
              this business has ever earned.
            </div>
          </div>
          <div>
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.85vw] font-semibold mb-[0.6vh]"
              style={{ color: "var(--slide-accent)" }}
            >
              What stays the same
            </div>
            <div className="font-body text-[1.05vw] text-text leading-[1.45]">
              The product is unchanged. The labels are unchanged. The
              storefront, the wholesale page, and the custom-labels page
              keep running.{" "}
              <span className="font-semibold text-primary">
                What changes is who does the work and where it happens —
                the depot does, in Dryden, on the same week the ops
                manager is already on shift.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
