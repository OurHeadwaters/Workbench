import { useScenario } from "@/lib/scenario";
import { SCENARIOS } from "@/data/scenarios";
import { SectionCard } from "@/components/SectionCard";
import { ConfirmedTag } from "@/components/ConfirmedTag";
import { money, moneyDelta } from "@/lib/format";
import type { Scenario } from "@/data/types";
import { GitCompareArrows, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface CompareRow {
  bucket: string;
  metric: string;
  v2: number;
  v3: number;
  unit?: string;
  hint?: string;
  positiveIsGood?: boolean; // delta favors V3 if true and V3 > V2
  identical?: boolean;
}

function buildRows(): CompareRow[] {
  const v2 = SCENARIOS.v2;
  const v3 = SCENARIOS.v3;
  return [
    {
      bucket: "Salts",
      metric: "Net cash / yr",
      v2: v2.salts.pAndL.netCash,
      v3: v3.salts.pAndL.netCash,
      identical: true,
    },
    {
      bucket: "Salts",
      metric: "Net economic (after shadow labour)",
      v2: v2.salts.shadowLabour.adjustedNet,
      v3: v3.salts.shadowLabour.adjustedNet,
      identical: true,
    },
    {
      bucket: "807 CDP",
      metric: "Net cash to Headwaters",
      v2: v2.contracts.cdp807.pAndL.netCash,
      v3: v3.contracts.cdp807.pAndL.netCash,
      identical: true,
    },
    {
      bucket: "Agency",
      metric: "Monthly fee",
      v2: v2.contracts.agency.fee,
      v3: v3.contracts.agency.fee,
      unit: "/mo",
    },
    {
      bucket: "Agency",
      metric: "Monthly payroll",
      v2: v2.contracts.agency.payrollTotal,
      v3: v3.contracts.agency.payrollTotal,
      unit: "/mo",
    },
    {
      bucket: "Agency",
      metric: "Monthly cost basis (Sep+)",
      v2: v2.contracts.agency.costBasisSepOnward,
      v3: v3.contracts.agency.costBasisSepOnward,
      unit: "/mo",
    },
    {
      bucket: "Agency",
      metric: "Monthly surplus (Sep+)",
      v2: v2.contracts.agency.monthlySurplusSepOnward,
      v3: v3.contracts.agency.monthlySurplusSepOnward,
      unit: "/mo",
    },
    {
      bucket: "Agency",
      metric: "Capital recovery duration",
      v2: v2.contracts.agency.capitalRecoveryMonths,
      v3: v3.contracts.agency.capitalRecoveryMonths,
      unit: " mo",
    },
    {
      bucket: "Agency",
      metric: "18-mo total surplus deployed",
      v2: v2.contracts.agency.totals18mo.surplusDeployed,
      v3: v3.contracts.agency.totals18mo.surplusDeployed,
    },
    {
      bucket: "Agency",
      metric: "↳ Reserve (Phase 3 total)",
      v2: v2.contracts.agency.totals18mo.reserve,
      v3: v3.contracts.agency.totals18mo.reserve,
    },
    {
      bucket: "Agency",
      metric: "↳ Innovation (Phase 3 total)",
      v2: v2.contracts.agency.totals18mo.innovation,
      v3: v3.contracts.agency.totals18mo.innovation,
    },
    {
      bucket: "Agency",
      metric: "↳ Giving (Phase 3 total)",
      v2: v2.contracts.agency.totals18mo.giving,
      v3: v3.contracts.agency.totals18mo.giving,
    },
    {
      bucket: "Brightside",
      metric: "18-mo revenue target",
      v2: v2.brightside.revenueTarget.cumulative18mo,
      v3: v3.brightside.revenueTarget.cumulative18mo,
      identical: true,
    },
    {
      bucket: "Brightside",
      metric: "Surplus over 18 mo",
      v2: v2.brightside.surplusDeployment.surplus,
      v3: v3.brightside.surplusDeployment.surplus,
      identical: true,
    },
    {
      bucket: "Brightside",
      metric: "Owner take (50%)",
      v2: v2.brightside.surplusDeployment.ownerTake,
      v3: v3.brightside.surplusDeployment.ownerTake,
      identical: true,
    },
    {
      bucket: "Personal",
      metric: "Total personal cash, 18 mo",
      v2: v2.personal.total18mo,
      v3: v3.personal.total18mo,
    },
    {
      bucket: "Personal",
      metric: "Per-year average",
      v2: v2.personal.perYear,
      v3: v3.personal.perYear,
    },
  ];
}

export function ComparePage() {
  const { scenarioId, setScenarioId } = useScenario();
  const v2 = SCENARIOS.v2;
  const v3 = SCENARIOS.v3;
  const rows = buildRows();

  const groups: Record<string, CompareRow[]> = {};
  for (const r of rows) {
    if (!groups[r.bucket]) groups[r.bucket] = [];
    groups[r.bucket].push(r);
  }

  return (
    <div className="space-y-6" data-testid="page-compare">
      <header className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-md bg-muted grid place-items-center flex-shrink-0">
          <GitCompareArrows className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Compare V2 ↔ V3
          </p>
          <h1
            className="mt-1 text-3xl font-semibold"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            Two realities. Same numbers. Side by side.
          </h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            Salts and Brightside are identical between the two — only Community Contracts
            (and therefore personal cash) move when the team changes.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScenarioCard
          scenario={v2}
          active={scenarioId === "v2"}
          onActivate={() => setScenarioId("v2")}
        />
        <ScenarioCard
          scenario={v3}
          active={scenarioId === "v3"}
          onActivate={() => setScenarioId("v3")}
        />
      </div>

      {Object.entries(groups).map(([bucket, items]) => (
        <SectionCard key={bucket} title={bucket}>
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="text-left text-muted-foreground">
                <tr className="border-b border-card-border">
                  <th className="py-2 pr-4 font-medium">Metric</th>
                  <th className="py-2 pr-4 font-medium text-right num">
                    <span style={{ color: v2.accent }}>V2</span> · Full team
                  </th>
                  <th className="py-2 pr-4 font-medium text-right num">
                    <span style={{ color: v3.accent }}>V3</span> · Lean team
                  </th>
                  <th className="py-2 pr-4 font-medium text-right num">Δ V3 − V2</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => {
                  const delta = r.v3 - r.v2;
                  const sameSign = r.identical;
                  return (
                    <tr
                      key={r.metric}
                      className="border-b border-card-border align-top"
                      data-testid={`compare-row-${r.metric.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                    >
                      <td className="py-2 pr-4">
                        <div className="font-medium">{r.metric}</div>
                        {r.hint ? (
                          <div className="text-xs text-muted-foreground">{r.hint}</div>
                        ) : null}
                      </td>
                      <td className="py-2 pr-4 text-right num">
                        {fmt(r.v2, r.unit)}
                      </td>
                      <td className="py-2 pr-4 text-right num">
                        {fmt(r.v3, r.unit)}
                      </td>
                      <td
                        className={`py-2 pr-4 text-right num font-medium ${
                          sameSign
                            ? "text-muted-foreground"
                            : delta === 0
                              ? "text-muted-foreground"
                              : delta > 0
                                ? "text-[hsl(167_60%_22%)]"
                                : "text-destructive"
                        }`}
                      >
                        {sameSign ? "—" : moneyDelta(delta)}
                        {!sameSign && r.unit ? <span className="text-xs font-normal text-muted-foreground"> {r.unit}</span> : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ))}

      <SectionCard title="What this is asking you to weigh" accent={v3.accent}>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li>
            <strong className="text-foreground">Service capability vs surplus tightness.</strong>{" "}
            V2 keeps the Transparency Stack Engineer + Junior Analyst — bigger team, slightly
            higher monthly burn, but full dashboard / public-reporting output and dedicated field
            analysis. V3 cuts both, lower burn, less external transparency surface.
          </li>
          <li>
            <strong className="text-foreground">Capital recovery speed.</strong> V2 retires the
            $112k debt stack in a clean 3 months. V3 takes ~4+ months at the provisional fee, which
            also pushes Brightside Launch Month from September into October.
          </li>
          <li>
            <strong className="text-foreground">War chest size.</strong> V2 builds Reserve / Innovation
            / Giving from a $35.5k/mo Phase 3 surplus over 14 months. V3's smaller surplus over 13
            months produces a notably smaller war chest — particularly visible in Reserve and Giving.
          </li>
          <li>
            <strong className="text-foreground">Personal cash unchanged in the default V3.</strong>{" "}
            Practitioner salary held at $18k/mo. If you also lower the Practitioner pay under leaner
            team, personal cash drops — flag that explicitly when locking V3.
          </li>
        </ul>
      </SectionCard>
    </div>
  );
}

function fmt(n: number, unit?: string): string {
  if (unit && unit.trim().startsWith("mo")) {
    return `${n}${unit}`;
  }
  return `${money(n)}${unit ?? ""}`;
}

function ScenarioCard({
  scenario,
  active,
  onActivate,
}: {
  scenario: Scenario;
  active: boolean;
  onActivate: () => void;
}) {
  return (
    <div
      className="rounded-xl border border-card-border bg-card p-5"
      style={{ borderTopColor: scenario.accent, borderTopWidth: "4px" }}
      data-testid={`compare-scenario-${scenario.id}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: scenario.accentInk }}
          >
            {scenario.name}
          </p>
          <p className="text-xs text-muted-foreground">{scenario.tagline}</p>
        </div>
        <ConfirmedTag
          tag={
            scenario.status === "locked"
              ? { kind: "confirmed", date: "2026-04-26" }
              : { kind: "provisional", reason: scenario.statusNote }
          }
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        {scenario.description}
      </p>
      <button
        type="button"
        onClick={onActivate}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
        style={{ color: scenario.accentInk }}
        data-testid={`compare-activate-${scenario.id}`}
      >
        {active ? "Currently reading" : "Switch to this scenario"} <ArrowRight className="h-3.5 w-3.5" />
      </button>
      <Link
        href="/contracts"
        className="block mt-1 text-xs text-muted-foreground hover:text-foreground"
        data-testid={`compare-open-contracts-${scenario.id}`}
      >
        Open Community Contracts in this scenario →
      </Link>
    </div>
  );
}
