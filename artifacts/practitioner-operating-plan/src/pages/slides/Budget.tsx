type Row = {
  label: string;
  sub?: string;
  a: number | null;
  b: number | null;
  c: number | null;
  isAdd?: boolean;
};

const rows: Row[] = [
  { label: "Practitioner / Lead", sub: "Engagement owner", a: 14000, b: 18000, c: 20000 },
  { label: "Operations Manager", sub: "Dryden, on-site", a: 8500, b: 8500, c: 9000 },
  { label: "Tech Lead / SRE", sub: "Servers, privacy phones, transparency stack", a: 9500, b: 9500, c: 10000 },
  { label: "Bookkeeper / Admin", sub: "Remote", a: 2500, b: 2500, c: 3000 },
  { label: "Community Dev. Associate", sub: "Engagement #2 readiness", a: null, b: 7500, c: 8500, isAdd: true },
  { label: "Junior Analyst / Field", sub: "Data, household lookups, fieldwork", a: null, b: 6500, c: 6500, isAdd: true },
  { label: "Senior Engineer #2", sub: "Resilience for the server fleet", a: null, b: null, c: 10000, isAdd: true },
  { label: "Regional Outreach Lead", sub: "Pilot #2 sourcing", a: null, b: null, c: 9000, isAdd: true },
  { label: "Trainer / Adoption Lead", sub: "Council + community training", a: null, b: null, c: 7500, isAdd: true },
  { label: "Life supports", sub: "Cleaner · tutor · handyman (loaded)", a: 2100, b: 2100, c: 2100 },
  { label: "Tooling, SaaS, insurance", sub: "Operating overhead", a: 1800, b: 2500, c: 3000 },
  { label: "Recurring tech ops", sub: "Cloud, phone plans, monitoring", a: 1800, b: 2200, c: 2500 },
  { label: "Buffer", sub: "Statutory + variance", a: 4200, b: 7400, c: 1500 },
];

const sumCol = (key: "a" | "b" | "c") =>
  rows.reduce((acc, r) => acc + (r[key] ?? 0), 0);

const costA = sumCol("a"); // 44,400
const costB = sumCol("b"); // 66,700
const costC = sumCol("c"); // 92,600

const fmt = (n: number) => "$" + n.toLocaleString("en-US");
const fmtK = (n: number) => "$" + Math.round(n / 1000) + "k";

type Scenario = {
  key: "A" | "B" | "C";
  label: string;
  contract: number;
  cost: number;
  recommended?: boolean;
  note: string;
};

const scenarios: Scenario[] = [
  {
    key: "A",
    label: "Floor",
    contract: 60000,
    cost: costA,
    note: "Practitioner-side core (4 roles) + life + overhead. Honest, but no second engagement on the horizon.",
  },
  {
    key: "B",
    label: "Recommended ask",
    contract: 90000,
    cost: costB,
    recommended: true,
    note: "Adds CD Associate + Junior Analyst. Pilot #2 is real by month 9.",
  },
  {
    key: "C",
    label: "Scale",
    contract: 125000,
    cost: costC,
    note: "Adds Sr. Engineer + Regional Outreach + Trainer. Three concurrent reserves by year two.",
  },
];

export default function Budget() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              II · Budget — three contract sizes
            </div>
            <h2
              className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Cost basis × 1.35.
              <span className="italic font-normal text-accent"> The 35% is the lever that scales the model.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-muted mb-[0.5vh]">
              Reading the math
            </div>
            <div className="font-body text-[0.95vw] text-text leading-[1.4]">
              Bill = cost × 1.35.{" "}
              <span className="font-mono">35%</span> is a dedicated{" "}
              <span className="font-semibold text-primary">reinvestment</span>{" "}
              line — tech, training, and seed for pilot&nbsp;#2. Justified by
              measurable savings delivered (next slide).
            </div>
          </div>
        </div>

        <div
          className="rounded-[0.4vw] p-[1.2vw] mb-[1.5vh] overflow-hidden"
          style={{ background: "var(--slide-paper)" }}
        >
          <div className="flex items-baseline justify-between mb-[0.6vh]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-accent font-semibold">
              Cost composition · loaded monthly
            </div>
            <div className="font-mono text-[0.78vw] text-muted">
              ▼ rows shaded grey appear only at that scenario and above
            </div>
          </div>
          <table className="w-full text-[0.88vw] font-body" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr className="text-left text-muted font-mono uppercase tracking-[0.16em] text-[0.72vw]">
                <th className="py-[0.4vh] pr-[0.6vw] w-[34%]">Role / line</th>
                <th className="py-[0.4vh] pr-[0.6vw] text-right w-[14%]">A · $60k</th>
                <th className="py-[0.4vh] pr-[0.6vw] text-right w-[14%]">B · $90k</th>
                <th className="py-[0.4vh] pr-[0.6vw] text-right w-[14%]">C · $125k</th>
                <th className="py-[0.4vh] text-muted text-[0.72vw] w-[24%]">Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.label}
                  className="border-t"
                  style={{
                    borderColor: "var(--slide-rule)",
                    background: r.isAdd && r.a === null ? "rgba(31,61,46,0.04)" : "transparent",
                  }}
                >
                  <td className="py-[0.35vh] pr-[0.6vw] text-text">
                    <div className="font-semibold">{r.label}</div>
                  </td>
                  <td className="py-[0.35vh] pr-[0.6vw] text-right font-mono">
                    {r.a !== null ? fmt(r.a) : <span className="text-muted">—</span>}
                  </td>
                  <td className="py-[0.35vh] pr-[0.6vw] text-right font-mono">
                    {r.b !== null ? fmt(r.b) : <span className="text-muted">—</span>}
                  </td>
                  <td className="py-[0.35vh] pr-[0.6vw] text-right font-mono">
                    {r.c !== null ? fmt(r.c) : <span className="text-muted">—</span>}
                  </td>
                  <td className="py-[0.35vh] text-muted text-[0.78vw] leading-[1.25]">{r.sub}</td>
                </tr>
              ))}
              <tr className="border-t-2" style={{ borderColor: "var(--slide-primary)" }}>
                <td className="py-[0.55vh] pr-[0.6vw] font-display text-primary font-semibold text-[1vw]">
                  Cost basis
                </td>
                <td className="py-[0.55vh] pr-[0.6vw] text-right font-display text-primary font-semibold text-[1vw]">
                  {fmt(costA)}
                </td>
                <td className="py-[0.55vh] pr-[0.6vw] text-right font-display text-primary font-semibold text-[1vw]">
                  {fmt(costB)}
                </td>
                <td className="py-[0.55vh] pr-[0.6vw] text-right font-display text-primary font-semibold text-[1vw]">
                  {fmt(costC)}
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.2vw] min-h-0">
          {scenarios.map((s) => {
            const reinvest = s.contract - s.cost;
            const reinvestPct = (reinvest / s.cost) * 100;
            const isReco = !!s.recommended;
            return (
              <div
                key={s.key}
                className="rounded-[0.4vw] p-[1.4vw] flex flex-col relative"
                style={
                  isReco
                    ? { background: "var(--slide-primary)", color: "var(--slide-bg)" }
                    : { background: "var(--slide-paper)" }
                }
              >
                {isReco && (
                  <div
                    className="absolute top-[-1.2vh] right-[1vw] font-mono uppercase tracking-[0.22em] text-[0.78vw] px-[0.7vw] py-[0.3vh] rounded-[0.2vw]"
                    style={{ background: "var(--slide-accent)", color: "var(--slide-bg)" }}
                  >
                    Recommended ask
                  </div>
                )}
                <div
                  className="font-mono uppercase tracking-[0.22em] text-[0.78vw] mb-[0.2vh]"
                  style={isReco ? { color: "#e9c8a8" } : { color: "var(--slide-muted)" }}
                >
                  Scenario {s.key} · {s.label}
                </div>
                <div
                  className="font-display text-[2.6vw] font-semibold leading-none mb-[1.2vh]"
                  style={isReco ? { color: "#e9c8a8" } : { color: "var(--slide-primary)" }}
                >
                  {fmtK(s.contract)} <span className="text-[1.2vw] font-mono opacity-70">/ mo</span>
                </div>

                <div
                  className="space-y-[0.6vh] font-body text-[0.95vw] leading-[1.3] flex-1 pt-[0.6vh] border-t"
                  style={
                    isReco
                      ? { borderColor: "rgba(244,237,224,0.3)" }
                      : { borderColor: "var(--slide-rule)" }
                  }
                >
                  <div className="flex justify-between">
                    <span>Cost basis</span>
                    <span className="font-mono font-semibold">{fmt(s.cost)}</span>
                  </div>
                  <div
                    className="flex justify-between font-semibold"
                    style={isReco ? { color: "#e9c8a8" } : { color: "var(--slide-accent)" }}
                  >
                    <span>+ Reinvestment ({reinvestPct.toFixed(1)}%)</span>
                    <span className="font-mono">{fmt(reinvest)}</span>
                  </div>
                  <div
                    className="flex justify-between pt-[0.5vh] border-t font-display text-[1.1vw] font-semibold"
                    style={
                      isReco
                        ? { borderColor: "rgba(244,237,224,0.3)" }
                        : { borderColor: "var(--slide-rule)", color: "var(--slide-primary)" }
                    }
                  >
                    <span>Bill to client</span>
                    <span className="font-mono">{fmt(s.contract)}</span>
                  </div>
                </div>

                <div
                  className="mt-[1vh] pt-[0.7vh] border-t font-mono text-[0.8vw] leading-[1.35]"
                  style={
                    isReco
                      ? { borderColor: "rgba(244,237,224,0.3)", color: "#e9c8a8" }
                      : { borderColor: "var(--slide-rule)", color: "var(--slide-muted)" }
                  }
                >
                  {s.note}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-[1vh] font-body text-[0.82vw] text-muted leading-[1.35]">
          The 35% isn't margin in disguise — it has a budget, an owner, and an
          annual receipts audit. Every dollar of it must be matched by{" "}
          <span className="text-primary font-semibold">measurable savings delivered to Deer Lake</span>{" "}
          (procurement, freight, labour returned). If we don't beat the markup,
          we credit forward. That's the deal.
        </div>
      </div>
    </div>
  );
}
