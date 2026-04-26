type Layer = {
  label: string;
  headline: string;
  detail: string;
};

type StaysItem = {
  label: string;
  amount: string;
  detail: string;
};

type ReinvestBucket = {
  label: string;
  amount: string;
  detail: string;
};

type AccountabilityMeasure = {
  label: string;
  detail: string;
};

const reinvestBuckets: ReinvestBucket[] = [
  { label: "Tech CAPEX", amount: "~$60k Y1", detail: "self-hosted servers, privacy phones, work computers, networking" },
  { label: "Tooling subs", amount: "~$24k Y1", detail: "transparency dashboard hosting, GIS, secure comms, payroll" },
  { label: "Training & R&D", amount: "~$36k Y1", detail: "Indigenous-services certifications, conferences, playbook hours" },
  { label: "Pilot reserve", amount: "~$172k Y1", detail: "held in a separate account; seeds the next reserve so they don't wait for grants" },
];

const accountabilityMeasures: AccountabilityMeasure[] = [
  { label: "Procurement savings delivered", detail: "vs. the baseline the current store charges" },
  { label: "Time returned to band staff", detail: "hours back from manual reorder, manual close, manual reporting" },
  { label: "Transparency tools shipped & adopted", detail: "public dashboard + household lookup live and in use" },
  { label: "Capacity built locally", detail: "named band staff trained to run each module without us" },
  { label: "Year-end value-delivered audit", detail: "third-party · forward-credit clause in writing" },
];

const productLayers: Layer[] = [
  {
    label: "Software",
    headline: "Built by the practitioner. Owned by the band. Reused on the next reserve.",
    detail:
      "The till, the price dashboard, the household lookup, the offline-first stack, the bookkeeping pipeline — Deer Lake owns the source code and the data. The next reserve doesn't pay to rebuild the software; they pay the practitioner — at a premium day rate — to install the discipline that makes it work.",
  },
  {
    label: "Tech stack at markup",
    headline: "POS, accounting, comms, logistics — integrated, tested up north, resold.",
    detail:
      "We don't pretend to invent what already exists. We resell the underlying tools the practitioner has tested in northern conditions, integrated into a working system. The markup sits there transparently — no hidden margin in the operating fee.",
  },
  {
    label: "Training programs",
    headline: "Teach band staff to run the system on their own rhythm.",
    detail:
      "Practitioner-led modules with an Indigenous education partner. The curriculum belongs to the people who took it. No imported labour. No flown-in embed. The store works after we leave because the people running it know how it works.",
  },
];

const staysItems: StaysItem[] = [
  {
    label: "Public price dashboard",
    amount: "Live by month 3 · adopted by month 6",
    detail:
      "Anyone in Deer Lake can see what the store paid, what it's selling at, and what the margin is — line by line. The transparency the council has been asking for.",
  },
  {
    label: "Household price lookup",
    amount: "Live by month 9",
    detail:
      "Family-by-family monthly grocery costs vs. baseline, with subsidy pass-through visible. The council can defend pricing to anyone who asks.",
  },
  {
    label: "The operating playbook",
    amount: "Documented as we go",
    detail:
      "Operating plan, hiring runbook, financial model, transparency stack, tech infrastructure, accountability framework. Written down as we build it so the band runs the store after we hand off — not from memory.",
  },
  {
    label: "Year-end value-delivered audit",
    amount: "Independent · annual · forward-credit clause",
    detail:
      "Third-party review against what we charged. If the value delivered to Deer Lake doesn't beat the operating fee, we credit the difference forward against next year's contract. In writing.",
  },
];

export default function ServicePartner() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[3.5vh] flex flex-col">
        <div className="mb-[1.4vh]">
          <div className="font-mono uppercase tracking-[0.28em] text-[0.95vw] text-muted mb-[0.6vh]">
            What Headwaters delivers · cost basis × 1.35 reinvestment markup
          </div>
          <h2 className="font-display text-[3vw] leading-[1] tracking-tight text-primary font-medium">
            Three things the band buys.
            <span className="italic font-normal text-accent"> One of them stays.</span>
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-[1.4vw] mb-[1.4vh]" style={{ height: "44vh" }}>
          <div className="col-span-5 rounded-[0.4vw] p-[1.4vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[0.92vw] text-accent font-semibold mb-[0.5vh]">THE THREE LAYERS</div>
            <div className="font-mono uppercase tracking-[0.18em] text-[0.78vw] text-muted mb-[1vh]">
              What the operating fee covers
            </div>

            <div className="space-y-[1vh] flex-1 min-h-0">
              {productLayers.map((l) => (
                <div key={l.label}>
                  <div className="font-mono uppercase tracking-[0.18em] text-[0.82vw] text-accent mb-[0.2vh]">
                    {l.label}
                  </div>
                  <div className="font-display text-[1.05vw] text-primary font-semibold leading-tight mb-[0.3vh]">
                    {l.headline}
                  </div>
                  <div className="font-body text-[0.78vw] text-text leading-[1.4]">
                    {l.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-7 rounded-[0.4vw] p-[1.4vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[0.92vw] text-accent font-semibold mb-[0.5vh]">WHAT STAYS WITH DEER LAKE</div>
            <div className="font-mono uppercase tracking-[0.18em] text-[0.78vw] text-muted mb-[1vh]">
              Owned by the band · transferable on handoff · paper trail in writing
            </div>

            <div className="grid grid-cols-2 gap-[0.9vw] flex-1 min-h-0">
              {staysItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[0.3vw] p-[0.9vw] flex flex-col"
                  style={{ background: "rgba(31,61,46,0.05)" }}
                >
                  <div className="font-display text-[1.05vw] text-primary font-semibold leading-tight mb-[0.3vh]">
                    {item.label}
                  </div>
                  <div className="font-mono uppercase tracking-[0.12em] text-[0.7vw] text-accent mb-[0.4vh]">
                    {item.amount}
                  </div>
                  <div className="font-body text-[0.8vw] text-text leading-[1.4]">
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[0.4vw] p-[1.4vw] grid grid-cols-12 gap-[1.4vw]" style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}>
          <div className="col-span-5">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.78vw] mb-[0.4vh]" style={{ color: "#e9c8a8" }}>
              Headwaters pricing spine · full-stack agency engagement · what the 35% reinvestment buys
            </div>
            <div className="font-body text-[0.85vw] leading-[1.4] mb-[0.6vh] opacity-95">
              <span className="font-semibold">$69.7k/mo cost basis</span> + <span className="font-semibold">$24.3k/mo (35%) reinvestment</span> = <span className="font-semibold">~$94k/mo cost-of-delivery</span>. <span className="opacity-85">Total bill to Deer Lake TBD pending council pick (floor $60k → recommended $90k → scale $125k). Replaces today's $35k/mo Layer-1 software-only contract — same client, same software, full-stack team and accountability around it.</span>
            </div>
            <div className="grid grid-cols-2 gap-x-[0.8vw] gap-y-[0.3vh] font-body text-[0.72vw] leading-[1.35] opacity-90" style={{ fontVariantNumeric: "tabular-nums" }}>
              {reinvestBuckets.map((b) => (
                <div key={b.label}>
                  <span className="font-semibold">{b.label} {b.amount}</span> — {b.detail}
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-7">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.78vw] mb-[0.4vh]" style={{ color: "#e9c8a8" }}>
              Five net-positive accountability measures · forward-credit clause
            </div>
            <div className="grid grid-cols-5 gap-[0.6vw] mb-[0.5vh]">
              {accountabilityMeasures.map((m, i) => (
                <div key={m.label} className="rounded-[0.2vw] px-[0.5vw] py-[0.4vh]" style={{ background: "rgba(244,237,224,0.08)" }}>
                  <div className="font-mono text-[0.65vw] opacity-70 mb-[0.15vh]" style={{ color: "#e9c8a8" }}>0{i + 1}</div>
                  <div className="font-body text-[0.72vw] leading-[1.3] font-semibold">{m.label}</div>
                  <div className="font-body text-[0.68vw] leading-[1.3] opacity-80 mt-[0.1vh]">{m.detail}</div>
                </div>
              ))}
            </div>
            <div className="font-body text-[0.78vw] leading-[1.4] opacity-90">
              Year-end audit by an independent third party against the operating fee. <span className="font-semibold">If the value delivered to Deer Lake doesn't beat what we charged, we credit the difference forward against next year's contract. In writing.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
