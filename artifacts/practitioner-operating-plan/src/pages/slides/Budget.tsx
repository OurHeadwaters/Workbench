/**
 * Budget.tsx — "The six people" slide
 *
 * All dollar figures are imported from @/data/budgetScenarios.
 * Do NOT hardcode any cost-basis, reinvestment, ask, or bridge
 * numbers in this file.
 *
 * Interaction: clicking a scenario card in the footer highlights only the
 * rows active under that scenario (A rows always show; B rows show for B+C;
 * C rows show only for C). Non-active rows are dimmed but remain visible so
 * the CFO can audit the full structure at a glance.
 */

import { useState } from "react";
import {
  B_LINES, C_ADDITIONAL_LINES,
  COST_BASIS, ASK, REINVEST, BRIDGE,
  fmt, fmtK, SCENARIO_ROWS,
} from "@/data/budgetScenarios";

// The store runs on a shared software stack — used on every surface that
// carries the operator-couple framing (drift-guard phrase):
// prettier-ignore
const STORE_STACK_PHRASE = "Square at the till, QuickBooks on the books, Local Line for producers, the Headwaters cockpit tying them together";

type ScenarioId = "A" | "B" | "C";

interface RoleRow {
  label: string;
  description: string;
  monthly: number;
  /** Minimum scenario required for this row to be active */
  scenario: ScenarioId;
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
    label: "Buffer (statutory + variance)",
    description: "The variance line that lets the cost basis hold even when payroll taxes or insurance jump.",
    monthly: B_LINES.buffer,
    scenario: "B",
  },
  {
    label: "Sr Engineer #2",
    description: "Server resilience at scale — second senior engineer for the 9-server fleet.",
    monthly: C_ADDITIONAL_LINES.srEngineer2,
    scenario: "C",
  },
  {
    label: "Regional Outreach",
    description: "Pilot #2 community sourcing — the seat that makes the second engagement ready.",
    monthly: C_ADDITIONAL_LINES.regionalOutreach,
    scenario: "C",
  },
  {
    label: "Council Trainer",
    description: "Training cohorts at receiving bands — knowledge transfer at scale.",
    monthly: C_ADDITIONAL_LINES.trainer,
    scenario: "C",
  },
  {
    label: "Life supports (scale delta)",
    description: "Expanded household supports at scale — C uses $5,000/mo vs B's $2,100/mo (+$2,900).",
    monthly: C_ADDITIONAL_LINES.lifeSupportsDelta,
    scenario: "C",
  },
];

const SCENARIO_ORDER: ScenarioId[] = ["A", "B", "C"];

/** Returns true if a row is active (included) under the given selected scenario */
function isActive(rowScenario: ScenarioId, selected: ScenarioId): boolean {
  return SCENARIO_ORDER.indexOf(rowScenario) <= SCENARIO_ORDER.indexOf(selected);
}

const SCENARIO_COST: Record<ScenarioId, number> = {
  A: COST_BASIS.a,
  B: COST_BASIS.b,
  C: COST_BASIS.c,
};
const SCENARIO_ASK: Record<ScenarioId, number> = {
  A: ASK.floor,
  B: ASK.recommended,
  C: ASK.scale,
};

export default function Budget() {
  const [selected, setSelected] = useState<ScenarioId>("B");

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
            Scenario {selected} · {fmt(SCENARIO_COST[selected])}/mo · {fmt(SCENARIO_ASK[selected])}/mo ask
          </div>
        </div>

        <h1 className="font-display font-medium text-[4vw] leading-[1] tracking-tight text-paper mb-[1.5vh]">
          The six people.
        </h1>
        <div className="font-display italic text-[1.4vw] text-muted mb-[3vh] max-w-[65vw]">
          Same work as V2, but no double-payment. Food Handler and Ops Manager fold into the
          Hub Operator headline on the closing slide — broken out here so the CFO can audit every line.
          {selected === "C" && (
            <span className="ml-[0.5vw] not-italic text-accent text-[1.1vw]">
              ↳ Scenario C adds Sr Engineer #2, Regional Outreach, Council Trainer, and expanded life supports (+{fmt(COST_BASIS.c - COST_BASIS.b)}/mo).
            </span>
          )}
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
              {ROLE_ROWS.map((row, i) => {
                const active = isActive(row.scenario, selected);
                return (
                  <tr
                    key={row.label}
                    className={[
                      i < ROLE_ROWS.length - 1 ? "border-b border-rule" : "",
                      "transition-opacity duration-200",
                      active ? "opacity-100" : "opacity-30",
                    ].join(" ")}
                  >
                    <td className="py-[0.55vh] pr-[1vw] font-semibold font-body text-[0.9vw]">{row.label}</td>
                    <td className="py-[0.55vh] pr-[1vw] font-body text-[0.85vw] text-muted leading-[1.35]">{row.description}</td>
                    <td className="py-[0.55vh] pr-[1vw] text-right font-mono tabular-nums font-semibold">{fmt(row.monthly)}</td>
                    <td className="py-[0.55vh] text-right font-mono text-muted text-[0.8vw]">{row.scenario}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Cost-basis summary + scenario comparison — click to select */}
        <div className="mt-[1.5vh] pt-[1.5vh] border-t border-rule flex gap-[2vw]">

          {/* Scenario cards column */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-[0.8vh]">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.72vw] text-muted opacity-60">
                Scenario comparison
              </div>
              <a
                href={`${import.meta.env.BASE_URL}hiring-templates`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono uppercase tracking-[0.18em] text-[0.72vw] text-accent opacity-70 hover:opacity-100 transition-opacity duration-150 underline-offset-2 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Hiring templates →
              </a>
            </div>
            <div className="grid grid-cols-3 gap-[1.5vw]">
              {SCENARIO_ROWS.map((s) => {
                const isSelected = s.id.toUpperCase() === selected;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s.id.toUpperCase() as ScenarioId)}
                    className={[
                      "rounded-[4px] px-[1.2vw] py-[1.2vh] text-left w-full transition-all duration-150",
                      isSelected
                        ? "border border-accent ring-1 ring-accent/40"
                        : "border border-rule hover:border-accent/50",
                    ].join(" ")}
                  >
                    <div className="font-mono uppercase tracking-[0.18em] text-[0.72vw] text-muted mb-[0.4vh]">{s.label}</div>
                    <div className="font-display text-[2vw] font-semibold text-paper tabular-nums">
                      {fmt(s.costBasis)}<span className="text-[0.75vw] text-muted font-normal font-body">/mo</span>
                    </div>
                    <div className="font-body text-[0.75vw] text-muted mt-[0.3vh]">
                      {fmt(s.reinvest)} reinvestment ({s.reinvestPct}%) · ask {fmt(s.ask)}/mo · bridge {fmtK(s.bridge)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Salt-line + depot-bench reconciliation callout */}
          <div className="w-[24vw] shrink-0 rounded-[4px] border border-rule px-[1.2vw] py-[1.1vh] flex flex-col justify-between">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.68vw] text-accent mb-[0.6vh]">
              SALT-01-LBR · Depot-bench reconciliation
            </div>
            <div className="flex flex-col gap-[0.35vh] flex-1">
              {[
                ["Workers",    "4 casual / contracted T4A"],
                ["Volume",     "~600 hrs/yr"],
                ["Rate",       "$30/hr loaded"],
                ["Annual",     "$15k/yr total cost"],
                ["Channel",    "$10.5k channel-allocated"],
                ["Overhead",   "$4.5k overhead"],
              ].map(([key, val]) => (
                <div key={key} className="flex items-baseline justify-between gap-[0.5vw]">
                  <span className="font-mono text-[0.68vw] text-muted uppercase tracking-[0.12em] shrink-0">{key}</span>
                  <span className="font-body text-[0.78vw] text-paper text-right">{val}</span>
                </div>
              ))}
            </div>
            <div className="mt-[0.6vh] pt-[0.6vh] border-t border-rule font-body text-[0.68vw] text-muted leading-[1.4]">
              Bench labour sits outside the Scenario B headcount table above — allocated 70% to channel, 30% to overhead. The Food Handler line covers store-floor work; salt batches and depot-bench hours are a separate T4A pool reconciled here.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
