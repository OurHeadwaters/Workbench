/**
 * Budget.tsx — "The six people" slide
 *
 * All dollar figures are imported from @/data/budgetScenarios.
 * Do NOT hardcode any cost-basis, reinvestment, ask, or bridge
 * numbers in this file.
 */

import {
  B_LINES, C_ADDITIONAL_LINES,
  COST_BASIS, ASK, REINVEST, BRIDGE,
  fmt, fmtK, SCENARIO_ROWS,
} from "@/data/budgetScenarios";

// The store runs on a shared software stack — used on every surface that
// carries the operator-couple framing (drift-guard phrase):
// prettier-ignore
const STORE_STACK_PHRASE = "Square at the till, QuickBooks on the books, Local Line for producers, the Headwaters cockpit tying them together";

interface RoleRow {
  label: string;
  description: string;
  monthly: number;
  scenario: "A" | "B" | "C";
}

const ROLE_ROWS: RoleRow[] = [
  {
    label: "Practitioner / Lead",
    description: "Engagement owner — your loaded monthly take in the recommended scenario.",
    monthly: B_LINES.practitioner,
    scenario: "A",
  },
  {
    label: "Operations Manager",
    description: "Dryden, on-site. ~40 hrs/wk @ $40/hr loaded. The phone-holder.",
    monthly: B_LINES.opsManager,
    scenario: "A",
  },
  {
    label: "IT / Tech",
    description: "Servers, privacy phones, transparency stack, store IT.",
    monthly: B_LINES.itTech,
    scenario: "A",
  },
  {
    label: "Bookkeeper / Admin",
    description: "Remote, ~10 hrs/wk @ $40/hr loaded. CRA, invoicing, monthly close.",
    monthly: B_LINES.bookkeeper,
    scenario: "A",
  },
  {
    label: "Food Handler (embedded at Deer Lake)",
    description: "Headwaters-owned, on the store floor Day 1. Salt batches, 807 piecework, kitchen + shop tidy.",
    monthly: B_LINES.foodHandler,
    scenario: "A",
  },
  {
    label: "Community Dev. Associate",
    description: "Engagement #2 readiness — the seat that makes Pilot #2 real.",
    monthly: B_LINES.cdAssociate,
    scenario: "B",
  },
  {
    label: "Junior Analyst / Field",
    description: "Data, household lookups, fieldwork — keeps senior roles out of spreadsheet weeds.",
    monthly: B_LINES.juniorAnalyst,
    scenario: "B",
  },
  {
    label: "Sr Engineer #2 + Outreach + Trainer",
    description: "Server resilience, Pilot #2 sourcing, council training.",
    monthly: C_ADDITIONAL_LINES.srEngineer2 + C_ADDITIONAL_LINES.regionalOutreach + C_ADDITIONAL_LINES.trainer,
    scenario: "C",
  },
  {
    label: "Life supports + overhead",
    description: "Cleaner, tutor, handyman — loaded household supports that make the non-negotiables hold.",
    monthly: B_LINES.lifeSupports,
    scenario: "A",
  },
  {
    label: "Aggregation hub (Dad-warehouse)",
    description: "$2,200 rent + utilities, all-in. Related-party lease documented at /lease-tooling.",
    monthly: B_LINES.aggregationHub,
    scenario: "A",
  },
  {
    label: "Tooling, SaaS, insurance",
    description: `${STORE_STACK_PHRASE} — plus agency licenses, drone, and insurance.`,
    monthly: B_LINES.tooling,
    scenario: "A",
  },
  {
    label: "Recurring tech ops",
    description: "Cloud, phone plans, monitoring — what the 9-server fleet costs to run monthly.",
    monthly: B_LINES.recurringTech,
    scenario: "A",
  },
  {
    label: "Buffer (statutory + variance)",
    description: "The variance line that lets the cost basis hold even when payroll taxes or insurance jump.",
    monthly: B_LINES.buffer,
    scenario: "B",
  },
];

export default function Budget() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-[2vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              Budget — the six people
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            Scenario B · {fmt(COST_BASIS.b)}/mo · {fmt(ASK.recommended)}/mo ask
          </div>
        </div>

        <h1 className="font-display font-medium text-[4vw] leading-[1] tracking-tight text-paper mb-[1.5vh]">
          The six people.
        </h1>
        <div className="font-display italic text-[1.4vw] text-muted mb-[3vh] max-w-[65vw]">
          Same work as V2, but no double-payment. Food Handler and Ops Manager fold into the
          Hub Operator headline on the closing slide — broken out here so the CFO can audit every line.
        </div>

        {/* Role table */}
        <div className="flex-1 overflow-hidden">
          <table className="w-full text-[0.95vw] border-collapse">
            <thead>
              <tr className="border-b border-rule text-muted font-mono uppercase tracking-[0.15em] text-[0.75vw]">
                <th className="py-[0.6vh] pr-[1vw] text-left w-[28%]">Role</th>
                <th className="py-[0.6vh] pr-[1vw] text-left w-[44%]">What it covers</th>
                <th className="py-[0.6vh] pr-[1vw] text-right w-[16%]">Monthly</th>
                <th className="py-[0.6vh] text-right w-[12%]">Scenario</th>
              </tr>
            </thead>
            <tbody className="text-paper">
              {ROLE_ROWS.map((row, i) => (
                <tr key={row.label} className={i < ROLE_ROWS.length - 1 ? "border-b border-rule" : ""}>
                  <td className="py-[0.55vh] pr-[1vw] font-semibold font-body text-[0.9vw]">{row.label}</td>
                  <td className="py-[0.55vh] pr-[1vw] font-body text-[0.85vw] text-muted leading-[1.35]">{row.description}</td>
                  <td className="py-[0.55vh] pr-[1vw] text-right font-mono tabular-nums font-semibold">{fmt(row.monthly)}</td>
                  <td className="py-[0.55vh] text-right font-mono text-muted text-[0.8vw]">{row.scenario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cost-basis summary + scenario comparison */}
        <div className="mt-[2vh] pt-[2vh] border-t border-rule grid grid-cols-3 gap-[2vw]">
          {SCENARIO_ROWS.map((s) => (
            <div key={s.id} className={`rounded-[4px] px-[1.5vw] py-[1.5vh] ${s.id === "b" ? "border border-accent" : "border border-rule"}`}>
              <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-muted mb-[0.5vh]">{s.label}</div>
              <div className="font-display text-[2.2vw] font-semibold text-paper tabular-nums">{fmt(s.costBasis)}<span className="text-[0.8vw] text-muted font-normal font-body">/mo</span></div>
              <div className="font-body text-[0.8vw] text-muted mt-[0.4vh]">
                {fmt(s.reinvest)} reinvestment ({s.reinvestPct}%) · ask {fmt(s.ask)}/mo · bridge {fmtK(s.bridge)}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
