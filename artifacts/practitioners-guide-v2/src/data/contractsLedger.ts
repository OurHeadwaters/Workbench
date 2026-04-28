import type { Scenario } from "./types";
import type { LedgerExport, LedgerSheet } from "./saltLedger";
import { isLocked, tagSummary } from "./tags";

/**
 * Community Contracts ledger (agency engagement) structured for CSV / xlsx export.
 * Mirrors the in-page tables on ContractsPage so a board pack matches the screen.
 *
 * Only locked (founder-confirmed) lines are emitted — TBD overhead rows and any other
 * non-locked lines are filtered out so the spreadsheet matches the on-page "locked" promise.
 *
 * Historical note: this ledger used to carry three 807 CDP sheets (scope, P&L,
 * structured option). The 807 grant was retired from the guide on 2026-04-28
 * for planning purposes; this exporter now ships agency sheets only.
 */
export function buildContractsLedger(scenario: Scenario): LedgerExport {
  const a = scenario.contracts.agency;

  const agencyHeader: LedgerSheet = {
    name: "Agency — terms",
    asOf: tagSummary(a.feeTag),
    rows: [
      ["Field", "Value"],
      ["Monthly fee", a.fee],
      ["Term (months)", a.termMonths],
      ["Renegotiate at month", a.renegotiateMonth],
      ["Start date", a.startDate],
      ["Buyer", a.buyerStatus],
    ],
  };

  const roster: LedgerSheet = {
    name: "Agency — roster",
    asOf: tagSummary(a.rosterTag),
    rows: [
      ["Role", "$/mo loaded", "Notes"],
      ...a.roster.map((r) => [r.role, r.monthlyLoaded, r.notes ?? ""]),
      ["Payroll subtotal", a.payrollTotal, ""],
    ],
  };

  // Locked-rows filter: drop overhead lines whose monthly $ is null (TBD).
  // The on-page table renders these with a "TBD" badge; they are NOT locked numbers
  // and therefore must not appear in a board-pack export.
  const lockedOverheadRows = (
    rows: { name: string; monthly: number | null; notes?: string }[],
  ) =>
    rows
      .filter((r) => r.monthly !== null)
      .map((r) => [r.name, r.monthly as number, r.notes ?? ""]);

  const overheadsJunAug: LedgerSheet = {
    name: "Agency — overheads Jun–Aug",
    asOf: tagSummary(a.overheadsTag),
    rows: [
      ["Line", "$/mo", "Notes"],
      ...lockedOverheadRows(a.overheadsJunAug),
      ["Subtotal", a.overheadsJunAugTotal, ""],
    ],
  };

  const overheadsSepOnward: LedgerSheet = {
    name: "Agency — overheads Sep+",
    asOf: tagSummary(a.overheadsTag),
    rows: [
      ["Line", "$/mo", "Notes"],
      ...lockedOverheadRows(a.overheadsSepOnward),
      ["Subtotal", a.overheadsSepOnwardTotal, ""],
    ],
  };

  const monthly: LedgerSheet = {
    name: "Agency — monthly basis",
    asOf: tagSummary(a.costBasisTag),
    rows: [
      ["Line", "Jun–Aug $/mo", "Sep+ $/mo"],
      ["Cost basis", a.costBasisJunAug, a.costBasisSepOnward],
      ["Monthly surplus", a.monthlySurplusJunAug, a.monthlySurplusSepOnward],
    ],
  };

  // Phase 3 has its own tag; capital recovery, brightside launch, and the
  // top-of-waterfall tithe each have theirs. Use the most-restrictive
  // (totals18mo) tag as the sheet header so a single line captures the
  // provenance of the whole 18-month picture.
  const phasesRows: (string | number)[][] = [
    ["Phase", "Window", "Amount", "Notes", "Confirmed"],
  ];
  // Tithe — top of waterfall, first claim on revenue. Always emit when the
  // fee tag is locked (the tithe is a function of fee × tithe %).
  if (isLocked(a.feeTag)) {
    phasesRows.push([
      `Tithe — Giving (${a.tithePct}% off the top)`,
      `${a.termMonths} months @ ${a.titheMonthly}/mo`,
      a.titheTotal,
      "First claim on revenue — paid before cost basis or any capital allocation.",
      tagSummary(a.feeTag),
    ]);
  }
  if (isLocked(a.capitalRecoveryTag)) {
    phasesRows.push([
      "Phase 1 — Capital Recovery",
      `${a.capitalRecoveryStartLabel} → ${a.capitalRecoveryEndLabel}`,
      a.capitalRecoveryAmount,
      a.capitalRecoveryDescription,
      tagSummary(a.capitalRecoveryTag),
    ]);
  }
  if (isLocked(a.brightsideLaunchTag)) {
    phasesRows.push([
      "Phase 2 — Brightside launch",
      a.brightsideLaunchMonthLabel,
      a.brightsidePrelaunchSpend,
      `Surplus available ${a.brightsideLaunchSurplus}; remainder ${a.brightsideLaunchRemainder}`,
      tagSummary(a.brightsideLaunchTag),
    ]);
  }
  if (isLocked(a.phase3Tag)) {
    phasesRows.push([
      "Phase 3 — Reserve / Innovation",
      `${a.phase3Months} months @ ${a.phase3MonthlySurplus}/mo`,
      a.phase3MonthlySurplus * a.phase3Months,
      `${a.reservePct}/${a.innovationPct} split (renormalised when Giving moved to tithe-first)`,
      tagSummary(a.phase3Tag),
    ]);
    phasesRows.push([]);
    phasesRows.push(["Bucket", "%", "$/mo", "Total over Phase 3", ""]);
    phasesRows.push(["Reserve", a.reservePct, a.reserveMonthly, a.reserveTotal, ""]);
    phasesRows.push([
      "Innovation / R&D",
      a.innovationPct,
      a.innovationMonthly,
      a.innovationTotal,
      "",
    ]);
  }
  const phases: LedgerSheet = {
    name: "Agency — surplus phases",
    asOf: tagSummary(a.phase3Tag),
    rows: phasesRows,
  };

  const totals18mo: LedgerSheet = {
    name: "Agency — 18-mo totals",
    asOf: tagSummary(a.totals18mo.tag),
    rows: [
      ["Line", "$"],
      [`Revenue (${a.fee} × ${a.termMonths})`, a.totals18mo.revenue],
      [`Tithe — Giving (${a.tithePct}% off the top, first claim)`, -a.totals18mo.tithe],
      [`Payroll (${a.payrollTotal} × ${a.termMonths})`, -a.totals18mo.payroll],
      ["Overheads (3 mo Jun–Aug + 15 mo Sep+)", -a.totals18mo.overheads],
      ["Total surplus deployed (post-tithe)", a.totals18mo.surplusDeployed],
      [],
      ["↳ Capital Recovery (Phase 1)", a.totals18mo.capitalRecovery],
      ["↳ Brightside one-time pre-launch (Phase 2)", a.totals18mo.brightsidePrelaunch],
      ["↳ Reserve (Phase 3)", a.totals18mo.reserve],
      ["↳ Innovation / R&D (Phase 3)", a.totals18mo.innovation],
    ],
  };

  const compensation: LedgerSheet = {
    name: "Agency — practitioner pay",
    asOf: tagSummary(a.practitionerSalaryTag),
    rows: [
      ["Field", "Value"],
      [`Practitioner salary across ${a.termMonths} months`, a.practitionerSalary18mo],
      ["Implied $/yr", a.practitionerSalary18mo / 1.5],
    ],
  };

  const context: LedgerSheet = {
    name: "Context",
    rows: [
      ["Field", "Value"],
      ["Scenario", scenario.name],
      ["Status", scenario.status],
      ["Generated", new Date().toISOString().slice(0, 10)],
      ["Locked rows only", "Yes — non-locked (TBD/Provisional) rows are excluded."],
    ],
  };

  return {
    filenameBase: `headwaters-contracts-ledger-${scenario.id}`,
    asOf: tagSummary(a.totals18mo.tag),
    sheets: [
      agencyHeader,
      roster,
      overheadsJunAug,
      overheadsSepOnward,
      monthly,
      phases,
      totals18mo,
      compensation,
      context,
    ],
  };
}
