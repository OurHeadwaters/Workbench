import type { Scenario } from "./types";
import { isLocked, tagSummary } from "./tags";

export interface LedgerSheet {
  name: string;
  /**
   * Confirmation summary for this sheet (e.g. "Confirmed Apr 26, 2026") —
   * surfaced as a metadata row in CSV / XLSX so a board pack carries the
   * same provenance the founder sees on-screen via ConfirmedTag.
   */
  asOf?: string;
  rows: (string | number)[][];
}

export interface LedgerExport {
  filenameBase: string;
  /** Scenario-level confirmation summary (matches the pill at the top of the page). */
  asOf?: string;
  sheets: LedgerSheet[];
}

/**
 * Salt unit-cost ledger structured for CSV / xlsx export.
 * Mirrors the in-page tables exactly so the founder can update prices and re-import mentally.
 *
 * Only locked (founder-confirmed) lines are emitted — non-locked rows are filtered out so
 * the spreadsheet matches the "every dollar locked line by line" promise.
 *
 * Salts is identical V2/V3 in this build, but the export accepts a scenario for forward-compat.
 */
export function buildSaltLedger(scenario: Scenario): LedgerExport {
  const s = scenario.salts;

  const perJar: LedgerSheet = {
    name: "Per-jar COGS",
    asOf: tagSummary(s.perJarCogs.tag),
    rows: [
      ["Component", "Cost per jar (USD)", "Notes"],
      ["Raw salt input (avg across 4 blends)", s.perJarCogs.rawSalt, ""],
      ["Jar (lid included)", s.perJarCogs.jar, ""],
      ["Label + sticker + packaging", s.perJarCogs.label, ""],
      ["TOTAL per-jar COGS", s.perJarCogs.total, ""],
    ],
  };

  const channels: LedgerSheet = {
    name: "Channels",
    asOf: tagSummary(s.channelTotals.tag),
    rows: [
      ["Channel", "Jars/yr", "Price per jar", "Revenue", "COGS @ $5.50", "Gross margin", "Notes"],
      ...s.channels.map((c) => [
        c.name,
        c.jars,
        c.pricePerJar,
        c.revenue,
        c.cogs,
        c.grossMargin,
        c.notes ?? "",
      ]),
      [
        "TOTAL salt",
        s.channelTotals.jars,
        "",
        s.channelTotals.revenue,
        s.channelTotals.cogs,
        s.channelTotals.grossMargin,
        "",
      ],
    ],
  };

  const opCosts: LedgerSheet = {
    name: "Operating costs",
    asOf: tagSummary(s.operating.tag),
    rows: [
      ["Line", "$/yr", "Notes"],
      ["Markets — craft (4 events × $150)", s.operating.marketsCraftAnnual, "table, fuel, meal, giveaway"],
      ["Markets — farmers (15 wks × $30)", s.operating.marketsFarmersAnnual, "table fee"],
      ["Markets overhead — TOTAL", s.operating.marketsOverheadTotal, ""],
      [
        `Insurance + website + business subscriptions ($500/mo × ${s.operating.subscriptionsAllocationPct}% allocation)`,
        s.operating.subscriptionsAnnual,
        "founder gut allocation",
      ],
      ["Batch labour", 0, s.operating.batchLabour],
      ["Freight (wholesale & corporate)", 0, s.operating.freight],
    ],
  };

  const pAndL: LedgerSheet = {
    name: "Salts P&L",
    asOf: tagSummary(s.pAndL.tag),
    rows: [
      ["Line", "$/yr"],
      ["Revenue", s.pAndL.revenue],
      ["COGS", -s.pAndL.cogs],
      ["Markets overhead", -s.pAndL.marketsOverhead],
      ["Subscriptions (30% allocation)", -s.pAndL.subscriptions],
      ["NET CASH", s.pAndL.netCash],
      [],
      ["Shadow labour adjustment (~29 hrs × $30)", -s.shadowLabour.annualCost],
      ["NET ECONOMIC (after shadow labour)", s.shadowLabour.adjustedNet],
    ],
  };

  const mapleSyrupRow = isLocked(s.mapleSyrup.tag)
    ? [
        "Maple syrup at markets (separate line)",
        `${s.mapleSyrup.cases} cases × ${s.mapleSyrup.bottlesPerCase} bottles × $${s.mapleSyrup.marginPerBottle} margin = $${s.mapleSyrup.annualMargin}/yr`,
      ]
    : null;

  const context: LedgerSheet = {
    name: "Context",
    rows: [
      ["Field", "Value"],
      ["Scenario", scenario.name],
      ["Status", scenario.status],
      ["Generated", new Date().toISOString().slice(0, 10)],
      ["Salt batch cadence", s.operating.batchCadence],
      ...(mapleSyrupRow ? [mapleSyrupRow] : []),
    ],
  };

  return {
    filenameBase: `parrs-jars-salt-ledger-${scenario.id}`,
    asOf: tagSummary(s.pAndL.tag),
    sheets: [perJar, channels, opCosts, pAndL, context],
  };
}
