import { useLatestSaltClose } from "../../lib/saltClose";
import { useCostValue } from "../../lib/costReview";
import { useAppState } from "../../lib/storage";
import { COST_REGISTRY_BY_ID } from "../../data/costRegistry";
import { CostReviewButton } from "../../components/CostReviewButton";
import { useBudgetTotals } from "../../lib/budgetMath";

// Resolve a cost id without calling a hook — for use inside loops where
// the count of ids depends on the row data. The single `useAppState`
// call at the top of the component is what makes this reactive.
function resolveCost(
  state: ReturnType<typeof useAppState>,
  id: string,
): number {
  const review = state.costReview?.[id];
  if (review?.status === "edited" && typeof review.editedValue === "number") {
    return review.editedValue;
  }
  return COST_REGISTRY_BY_ID[id]?.defaultValue ?? 0;
}

// Each row maps the three scenarios onto cost-registry ids. When any of
// those ids has an edited value (from the Cost Review walkthrough), the
// table re-renders with the founder's number — and the scenario card
// totals update because they sum directly off these same ids.
type Row = {
  label: string;
  sub?: string;
  aId: string | null;
  bId: string | null;
  cId: string | null;
  isAdd?: boolean;
};

const rows: Row[] = [
  {
    label: "Practitioner / Lead",
    sub: "Engagement owner",
    aId: "budget.a.practitioner",
    bId: "budget.b.practitioner",
    cId: "budget.c.practitioner",
  },
  {
    label: "Operations Manager",
    sub: "Dryden, on-site",
    aId: "budget.a.opsManager",
    bId: "budget.b.opsManager",
    cId: "budget.c.opsManager",
  },
  {
    label: "IT/Tech",
    sub: "Servers, privacy phones, transparency stack, store IT",
    aId: "budget.a.itTech",
    bId: "budget.b.itTech",
    cId: "budget.c.itTech",
  },
  {
    label: "Bookkeeper / Admin",
    sub: "Remote",
    aId: "budget.a.bookkeeper",
    bId: "budget.b.bookkeeper",
    cId: "budget.c.bookkeeper",
  },
  {
    label: "Food Handler",
    sub: "Headwaters-owned · embedded at Deer Lake store Day 1 · salt batches + 807 piecework + kitchen/shop tidy + supplies inventory",
    aId: "budget.a.foodHandler",
    bId: "budget.b.foodHandler",
    cId: "budget.c.foodHandler",
  },
  {
    label: "Community Dev. Associate",
    sub: "Engagement #2 readiness",
    aId: null,
    bId: "budget.b.cdAssociate",
    cId: "budget.c.cdAssociate",
    isAdd: true,
  },
  {
    label: "Junior Analyst / Field",
    sub: "Data, household lookups, fieldwork",
    aId: null,
    bId: "budget.b.juniorAnalyst",
    cId: "budget.c.juniorAnalyst",
    isAdd: true,
  },
  {
    label: "Senior Engineer #2",
    sub: "Resilience for the server fleet",
    aId: null,
    bId: null,
    cId: "budget.c.seniorEngineer",
    isAdd: true,
  },
  {
    label: "Regional Outreach Lead",
    sub: "Pilot #2 sourcing",
    aId: null,
    bId: null,
    cId: "budget.c.regionalOutreach",
    isAdd: true,
  },
  {
    label: "Trainer / Adoption Lead",
    sub: "Council + community training",
    aId: null,
    bId: null,
    cId: "budget.c.trainer",
    isAdd: true,
  },
  {
    label: "Life supports",
    sub: "Cleaner · tutor · handyman (loaded)",
    aId: "budget.a.lifeSupports",
    bId: "budget.b.lifeSupports",
    cId: "budget.c.lifeSupports",
  },
  {
    label: "Facilities — aggregation hub",
    sub: "Dad-warehouse · $2,200 rent + utilities, all-in (garage + house-next-door priced as expansion options, not yet activated)",
    aId: "budget.a.aggregationHub",
    bId: "budget.b.aggregationHub",
    cId: "budget.c.aggregationHub",
  },
  {
    label: "Tooling, SaaS, insurance",
    sub: "Operating overhead",
    aId: "budget.a.tooling",
    bId: "budget.b.tooling",
    cId: "budget.c.tooling",
  },
  {
    label: "Recurring tech ops",
    sub: "Cloud, phone plans, monitoring",
    aId: "budget.a.recurringTech",
    bId: "budget.b.recurringTech",
    cId: "budget.c.recurringTech",
  },
];

const fmt = (n: number) => "$" + n.toLocaleString("en-US");
const fmtK = (n: number) => "$" + Math.round(n / 1000) + "k";

export default function Budget() {
  const latestSaltClose = useLatestSaltClose();
  const state = useAppState();
  const resolved = rows.map((r) => ({
    ...r,
    a: r.aId ? resolveCost(state, r.aId) : null,
    b: r.bId ? resolveCost(state, r.bId) : null,
    c: r.cId ? resolveCost(state, r.cId) : null,
  }));

  const buffer = useCostValue("budget.b.buffer");
  const sumA = resolved.reduce((acc, r) => acc + (r.a ?? 0), 0);
  const sumB = resolved.reduce((acc, r) => acc + (r.b ?? 0), 0) + buffer;
  const sumC = resolved.reduce((acc, r) => acc + (r.c ?? 0), 0);

  const totals = useBudgetTotals();
  const peopleA = totals.peopleBucketsA;
  const peopleB = totals.peopleBucketsB;
  const peopleC = totals.peopleBucketsC;
  // Loaded cost = role lines + buckets. Use the helper so this stays
  // in sync with anything else (cash flow, path to scale) that picks
  // the same total off `BudgetTotals` later.
  const loadedA = totals.loadedCostA;
  const loadedB = totals.loadedCostB;
  const loadedC = totals.loadedCostC;
  // % is reported against base payroll (the loaded salary lines the
  // buckets sit on top of), matching PeopleSizing's "~15% of base
  // payroll" framing — not the full cost basis, which would include
  // overhead/facilities/buffer and read misleadingly low.
  const peoplePctA =
    totals.basePayrollA > 0 ? (peopleA / totals.basePayrollA) * 100 : 0;
  const peoplePctB =
    totals.basePayrollB > 0 ? (peopleB / totals.basePayrollB) * 100 : 0;
  const peoplePctC =
    totals.basePayrollC > 0 ? (peopleC / totals.basePayrollC) * 100 : 0;

  const askFloor = useCostValue("ask.floor");
  const askReco = useCostValue("ask.recommended");
  const askScale = useCostValue("ask.scale");
  const markupPct = useCostValue("markup.target");
  const markupX = (1 + markupPct / 100).toFixed(2);

  const scenarios = [
    {
      key: "A" as const,
      label: "Floor",
      contract: askFloor,
      cost: sumA,
      loaded: loadedA,
      note: "Practitioner-side core (4 agency hires + Food Handler embedded at the store) + life + overhead. Buffer absorbed by the Food Handler line at the floor; no second engagement on the horizon.",
    },
    {
      key: "B" as const,
      label: "Recommended ask",
      contract: askReco,
      cost: sumB,
      loaded: loadedB,
      recommended: true,
      note: "Adds CD Associate + Junior Analyst. Pilot #2 is real by month 9.",
    },
    {
      key: "C" as const,
      label: "Scale",
      contract: askScale,
      cost: sumC,
      loaded: loadedC,
      note: "Adds Sr. Engineer + Regional Outreach + Trainer. Buffer absorbed by Food Handler at scale too; three concurrent reserves by year two.",
    },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute top-[1vh] right-[1.4vw] z-20">
        <CostReviewButton variant="slide-corner" />
      </div>
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              V · Budget — three contract sizes
            </div>
            <h2
              className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Cost basis × {markupX} <span className="text-muted text-[1.6vw] align-middle">(target)</span>.
              <span className="italic font-normal text-accent"> The {markupPct}% is the lever — actual % drifts as the cost basis grows.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-muted mb-[0.5vh]">
              Reading the math
            </div>
            <div className="font-body text-[0.95vw] text-text leading-[1.4]">
              Bill = cost × {markupX}.{" "}
              <span className="font-mono">{markupPct}%</span> is a dedicated{" "}
              <span className="font-semibold text-primary">reinvestment</span>{" "}
              line — tech, training, and seed for pilot&nbsp;#2. Justified by
              measurable savings delivered (V · Net-positive accountability).
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
                <th className="py-[0.4vh] pr-[0.6vw] text-right w-[14%]">A · {fmtK(askFloor)}</th>
                <th className="py-[0.4vh] pr-[0.6vw] text-right w-[14%]">B · {fmtK(askReco)}</th>
                <th className="py-[0.4vh] pr-[0.6vw] text-right w-[14%]">C · {fmtK(askScale)}</th>
                <th className="py-[0.4vh] text-muted text-[0.72vw] w-[24%]">Notes</th>
              </tr>
            </thead>
            <tbody>
              {resolved.map((r) => (
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
              <tr className="border-t" style={{ borderColor: "var(--slide-rule)" }}>
                <td className="py-[0.35vh] pr-[0.6vw] text-text">
                  <div className="font-semibold">Buffer</div>
                </td>
                <td className="py-[0.35vh] pr-[0.6vw] text-right font-mono text-muted">—</td>
                <td className="py-[0.35vh] pr-[0.6vw] text-right font-mono">{fmt(buffer)}</td>
                <td className="py-[0.35vh] pr-[0.6vw] text-right font-mono text-muted">—</td>
                <td className="py-[0.35vh] text-muted text-[0.78vw] leading-[1.25]">
                  Statutory + variance · Food Handler absorbs the floor &amp; scale slack
                </td>
              </tr>
              <tr className="border-t-2" style={{ borderColor: "var(--slide-primary)" }}>
                <td className="py-[0.55vh] pr-[0.6vw] font-display text-primary font-semibold text-[1vw]">
                  Cost basis
                </td>
                <td className="py-[0.55vh] pr-[0.6vw] text-right font-display text-primary font-semibold text-[1vw]">
                  {fmt(sumA)}
                </td>
                <td className="py-[0.55vh] pr-[0.6vw] text-right font-display text-primary font-semibold text-[1vw]">
                  {fmt(sumB)}
                </td>
                <td className="py-[0.55vh] pr-[0.6vw] text-right font-display text-primary font-semibold text-[1vw]">
                  {fmt(sumC)}
                </td>
                <td />
              </tr>
              <tr className="border-t" style={{ borderColor: "var(--slide-rule)" }}>
                <td className="py-[0.4vh] pr-[0.6vw] text-text">
                  <div className="font-semibold">+ People &amp; Retention buckets / mo</div>
                </td>
                <td className="py-[0.4vh] pr-[0.6vw] text-right font-mono text-accent font-semibold">
                  {fmt(peopleA)}{" "}
                  <span className="text-muted text-[0.72vw] font-normal">
                    ({peoplePctA.toFixed(1)}%)
                  </span>
                </td>
                <td className="py-[0.4vh] pr-[0.6vw] text-right font-mono text-accent font-semibold">
                  {fmt(peopleB)}{" "}
                  <span className="text-muted text-[0.72vw] font-normal">
                    ({peoplePctB.toFixed(1)}%)
                  </span>
                </td>
                <td className="py-[0.4vh] pr-[0.6vw] text-right font-mono text-accent font-semibold">
                  {fmt(peopleC)}{" "}
                  <span className="text-muted text-[0.72vw] font-normal">
                    ({peoplePctC.toFixed(1)}%)
                  </span>
                </td>
                <td className="py-[0.4vh] text-muted text-[0.78vw] leading-[1.25]">
                  % of base payroll · target ~15% · sits on top of role lines (
                  <a
                    href="/slide38"
                    className="underline decoration-dotted underline-offset-2 text-primary"
                  >
                    Part&nbsp;V·c
                  </a>
                  )
                </td>
              </tr>
              <tr className="border-t-2" style={{ borderColor: "var(--slide-primary)" }}>
                <td className="py-[0.5vh] pr-[0.6vw] font-display text-primary font-semibold text-[0.95vw]">
                  Loaded cost (basis + buckets)
                </td>
                <td className="py-[0.5vh] pr-[0.6vw] text-right font-display text-primary font-semibold text-[0.95vw]">
                  {fmt(loadedA)}
                </td>
                <td className="py-[0.5vh] pr-[0.6vw] text-right font-display text-primary font-semibold text-[0.95vw]">
                  {fmt(loadedB)}
                </td>
                <td className="py-[0.5vh] pr-[0.6vw] text-right font-display text-primary font-semibold text-[0.95vw]">
                  {fmt(loadedC)}
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.2vw] min-h-0">
          {scenarios.map((s) => {
            const reinvest = s.contract - s.cost;
            const reinvestPct = s.cost > 0 ? (reinvest / s.cost) * 100 : 0;
            const netReinvest = s.contract - s.loaded;
            const netReinvestPct = s.loaded > 0 ? (netReinvest / s.loaded) * 100 : 0;
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
                    className="flex justify-between"
                    style={
                      isReco
                        ? { color: "rgba(233,200,168,0.75)" }
                        : { color: "var(--slide-muted)" }
                    }
                  >
                    <span>+ Reinvestment vs. cost basis ({reinvestPct.toFixed(1)}%)</span>
                    <span className="font-mono">{fmt(reinvest)}</span>
                  </div>
                  <div
                    className="flex justify-between font-semibold"
                    style={isReco ? { color: "#e9c8a8" } : { color: "var(--slide-accent)" }}
                  >
                    <span>
                      + Net reinvestment after People &amp; Retention (
                      {netReinvestPct.toFixed(1)}%)
                    </span>
                    <span className="font-mono">{fmt(netReinvest)}</span>
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
          The {markupPct}% isn't margin in disguise — it has a budget, an owner, and an
          annual receipts audit. Every dollar of it must be matched by{" "}
          <span className="text-primary font-semibold">measurable savings delivered to Deer Lake</span>{" "}
          (procurement, freight, labour returned). If we don't beat the markup,
          we credit forward. That's the deal.{" "}
          <span className="block mt-[0.5vh] text-text">
            <span className="font-mono uppercase tracking-[0.18em] text-[0.7vw] text-accent font-semibold mr-[0.5vw]">
              + Parity ·
            </span>
            Ops Manager and IT/Tech are paid at parity in every scenario
            ($9.5k @ A · $9.5k @ B · $10k @ C). Both roles carry the agency's
            day-to-day continuity and the felt-cost of losing either is the
            same.{" "}
            <span className="text-primary font-semibold">
              In Scenario A the parity is funded inside the practitioner's own
              line (-$1k);
            </span>{" "}
            in B and C the +$1k is absorbed by existing reinvestment margin —
            no contract-size change required. People &amp; Retention design is
            in{" "}
            <a
              href="/slide38"
              className="underline decoration-dotted underline-offset-2 text-primary"
            >
              Part&nbsp;V·c
            </a>
            .
          </span>{" "}
          <span className="text-text">
            Aggregation hub line is the Dad-warehouse base ($2,200 rent + utilities, all-in);
            related-party documentation, comparables, and the priced expansion options
            (3-door garage, house-next-door) live in the{" "}
            <a
              href="/lease-tooling"
              className="underline decoration-dotted underline-offset-2 text-primary"
            >
              /lease-tooling working doc
            </a>
            .
          </span>
          <span className="block mt-[0.5vh] text-text">
            <span className="font-mono uppercase tracking-[0.18em] text-[0.7vw] text-accent font-semibold mr-[0.5vw]">
              + Salt line ·
            </span>
            Sits alongside as a separate cost-centre (
            <a
              href="/salt-coa"
              className="font-mono underline decoration-dotted underline-offset-2 text-primary"
            >
              SALT-01
            </a>
            ):{" "}
            {latestSaltClose ? (
              <>
                latest filed close{" "}
                <span className="font-semibold text-primary">
                  {fmt(Math.round(latestSaltClose.net))} net
                </span>{" "}
                for {latestSaltClose.month || "this month"} · wholesale CM{" "}
                {latestSaltClose.wholesaleCmPct !== null
                  ? `${latestSaltClose.wholesaleCmPct.toFixed(0)}%`
                  : "—"}
                {latestSaltClose.status !== "ok" && (
                  <span className="text-accent font-semibold">
                    {" "}
                    · {latestSaltClose.status === "reprice" ? "REPRICE" : "WATCH"}
                  </span>
                )}
                {" · planning baseline ~$108k rev · ~$61k net/yr"}
              </>
            ) : (
              <>~$108k revenue · ~$61k net annual contribution</>
            )}{" "}
            · ~12 OM hrs/mo capped, plus a named depot bench —{" "}
            <span className="font-semibold text-primary">
              4 casual / contracted (T4A)
            </span>{" "}
            · ~150 hrs/seat/yr · ~600 hrs/yr total · $30/hr · A→B→C→D rotation,
            costed{" "}
            <span className="font-mono font-semibold text-primary">$15k/yr</span>{" "}
            in the salt P&amp;L (
            <span className="font-mono">SALT-01-LBR</span>:{" "}
            <span className="font-mono">$10.5k channel-allocated</span> direct
            picking + Q4 overflow ·{" "}
            <span className="font-mono">$4.5k overhead</span> standby /
            training / screening / mileage + WSIB). The mechanism that keeps
            Rule 01 enforceable; reconciles to the same $15k line on{" "}
            <a
              href="/salt-bench"
              className="underline decoration-dotted underline-offset-2 text-primary"
            >
              SaltBench
            </a>{" "}
            and the salt P&amp;L. Channel-by-channel margin (wholesale 63%,
            custom labels 66%, DTC batch 36%, markets PR-only) is on the
            Part&nbsp;VIII salt P&amp;L slide; the bookkeeper&rsquo;s{" "}
            <a
              href="/salt-monthly-close"
              className="underline decoration-dotted underline-offset-2 text-primary"
            >
              monthly close template
            </a>{" "}
            reconciles actuals into those buckets.
          </span>
        </div>
      </div>
    </div>
  );
}
