import type { Scenario } from "./types";
import type { LedgerExport, LedgerSheet } from "./saltLedger";
import { tagSummary } from "./tags";

/**
 * Brightside RT-LTC ledger structured for CSV / xlsx export.
 * Mirrors the in-page tables on BrightsidePage so a board pack matches the screen.
 *
 * Each sheet carries the same confirmation summary the founder sees on-page via
 * ConfirmedTag. Only locked rows are exposed — Brightside's section data has no
 * row-level TBD lines today, but the sheet-level "asOf" still tells a board reader
 * exactly when each section was confirmed.
 */
export function buildBrightsideLedger(scenario: Scenario): LedgerExport {
  const bs = scenario.brightside;

  const product: LedgerSheet = {
    name: "Product framing",
    asOf: tagSummary(bs.product.tag),
    rows: [
      ["Field", "Value"],
      ["Description", bs.product.description],
      ["Customer scope", bs.product.customerScope],
      ["Home-care services", bs.product.homecareStatus],
    ],
  };

  const pricing: LedgerSheet = {
    name: "Pricing",
    asOf: tagSummary(bs.pricing.tag),
    rows: [
      ["Component", "$", "Unit", "Notes"],
      [
        `Tier 1 (${bs.pricing.tier1.threshold})`,
        bs.pricing.tier1.monthly,
        "/mo per facility",
        "Small / standard facility",
      ],
      [
        `Tier 2 (${bs.pricing.tier2.threshold})`,
        bs.pricing.tier2.monthly,
        "/mo per facility",
        "Larger facility",
      ],
      [
        "Per-resident overage",
        bs.pricing.perResidentOverage,
        "/resident/mo",
        "Above 60-resident threshold",
      ],
      ["Setup fee", bs.pricing.setupFee, "one-time", "Data migration + initial config"],
      [
        "Training engagement",
        bs.pricing.trainingPerFacility,
        "per facility",
        "Single-day workshop",
      ],
    ],
  };

  const buildModel: LedgerSheet = {
    name: "Build & sell model",
    asOf: tagSummary(bs.buildModel.tag),
    rows: [
      ["Field", "Value"],
      ["Description", bs.buildModel.description],
      ["Founder time cash cost", bs.buildModel.founderTimeCashCost],
      ["Pre-launch engineer cap", bs.buildModel.prelaunchEngineerCap],
      ["Pre-launch payment month", bs.buildModel.prelaunchPaymentMonth],
    ],
  };

  const revenueTarget: LedgerSheet = {
    name: "Revenue target",
    asOf: tagSummary(bs.revenueTarget.tag),
    rows: [
      ["Field", "Value"],
      ["Cumulative revenue target (18 mo)", bs.revenueTarget.cumulative18mo],
      ["Exit ARR", bs.revenueTarget.exitArr],
      ["Customer ramp", bs.revenueTarget.customerRamp],
      ["Mix assumption", bs.revenueTarget.mixAssumption],
      ["Revenue start window", bs.revenueTarget.revenueStartWindow],
    ],
  };

  const prelaunch: LedgerSheet = {
    name: "Cost — pre-launch one-time",
    asOf: tagSummary(bs.costBasis.tag),
    rows: [
      ["Line", "$", "Notes"],
      ...bs.costBasis.prelaunchOneTime.map((line) => [
        line.name,
        line.amount,
        line.notes,
      ]),
      ["Total pre-launch one-time", bs.costBasis.prelaunchTotal, ""],
    ],
  };

  const recurring: LedgerSheet = {
    name: "Cost — recurring monthly",
    asOf: tagSummary(bs.costBasis.tag),
    rows: [
      ["Line", "$/mo", "Notes"],
      ...bs.costBasis.recurringMonthly.map((line) => [
        line.name,
        line.amount,
        line.notes,
      ]),
      ["Subtotal recurring", bs.costBasis.recurringMonthlyTotal, ""],
      ["18-mo cost basis (one-time + 14 mo recurring)", bs.costBasis.total18mo, ""],
    ],
  };

  // Surplus deployment is tithe-first across all archetypes: 10% off the
  // top of revenue, then cost basis, then 50/50 split on what remains.
  // The exported sheet has to mirror the on-page math exactly so the
  // reconciliation reads the same way as the page.
  const surplus: LedgerSheet = {
    name: "Surplus deployment",
    asOf: tagSummary(bs.surplusDeployment.tag),
    rows: [
      ["Line", "$"],
      ["Revenue (target)", bs.surplusDeployment.revenue],
      [
        `Tithe — Giving (${bs.surplusDeployment.tithePct}% off the top, first claim)`,
        -bs.surplusDeployment.tithe,
      ],
      ["Revenue after tithe", bs.surplusDeployment.revenueAfterTithe],
      ["Cost basis", -bs.surplusDeployment.cost],
      ["Surplus (post-tithe)", bs.surplusDeployment.surplus],
      [],
      [
        `Retained in Brightside (${bs.surplusDeployment.retainedPct}%)`,
        bs.surplusDeployment.retained,
      ],
      [
        `Owner take (${bs.surplusDeployment.ownerTakePct}%)`,
        bs.surplusDeployment.ownerTake,
      ],
    ],
  };

  const downside: LedgerSheet = {
    name: "Downside coverage",
    asOf: tagSummary(bs.downsideCoverage.tag),
    rows: [
      ["Field", "Value"],
      ["Source bucket", bs.downsideCoverage.sourceBucket],
      ["Source bucket size", bs.downsideCoverage.sourceAmount],
      ["Maximum exposure", bs.downsideCoverage.maxExposure],
      ["Coverage % of source", bs.downsideCoverage.coveragePct],
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
    filenameBase: `brightside-ledger-${scenario.id}`,
    asOf: tagSummary(bs.surplusDeployment.tag),
    sheets: [
      product,
      pricing,
      buildModel,
      revenueTarget,
      prelaunch,
      recurring,
      surplus,
      downside,
      context,
    ],
  };
}
