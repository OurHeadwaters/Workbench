import { describe, it, expect } from "vitest";
import { SCENARIO_V3 } from "../v3";
import { SCENARIO_V4 } from "../v4";
import { SCENARIOS, SCENARIO_ORDER, DEFAULT_SCENARIO_ID } from "../scenarios";
import {
  SHARED_BRIGHTSIDE,
  SHARED_CDP807,
  SHARED_GIVING_DIRECTION,
  SHARED_OVERHEADS_JUN_AUG_TOTAL,
  SHARED_OVERHEADS_SEP_ONWARD_TOTAL,
  SHARED_RESERVE_PURPOSES,
  SHARED_SALTS,
} from "../shared";

/**
 * Locked-number guard tests.
 *
 * Source of truth: .local/tasks/practitioners-guide-v2.md (the founder's
 * canonical handbook spec). After V2 was retired on 2026-04-26 (full team,
 * $115k/mo), the live scenario set is V3 (locked default, lean team) and V4
 * (right-priced). The shared `SHARED_*` constants in `data/shared.ts` are
 * the single source of truth for everything Salts / 807 / Brightside / overheads /
 * reserve / giving — V3 and V4 import them by reference.
 *
 * If a number drifts from that founder-confirmed spec, these tests must fail
 * before the founder ever opens the page.
 */

describe("Salts bucket — locked headline numbers (sourced from SHARED_SALTS)", () => {
  const salts = SHARED_SALTS;

  it("per-jar COGS is $5.50 ($3.50 raw + $1.00 jar + $1.00 label)", () => {
    expect(salts.perJarCogs.rawSalt).toBe(3.5);
    expect(salts.perJarCogs.jar).toBe(1.0);
    expect(salts.perJarCogs.label).toBe(1.0);
    expect(salts.perJarCogs.total).toBe(5.5);
    expect(
      salts.perJarCogs.rawSalt + salts.perJarCogs.jar + salts.perJarCogs.label,
    ).toBeCloseTo(salts.perJarCogs.total, 2);
  });

  it("channel totals: 1,190 jars / $10,693 revenue / $6,545 COGS / $4,148 gross margin", () => {
    expect(salts.channelTotals.jars).toBe(1190);
    expect(salts.channelTotals.revenue).toBe(10693);
    expect(salts.channelTotals.cogs).toBe(6545);
    expect(salts.channelTotals.grossMargin).toBe(4148);
  });

  it("channel rows sum to channel totals (jars exact, revenue/cogs within rounding)", () => {
    const sum = salts.channels.reduce(
      (acc, c) => ({
        jars: acc.jars + c.jars,
        revenue: acc.revenue + c.revenue,
        cogs: acc.cogs + c.cogs,
        grossMargin: acc.grossMargin + c.grossMargin,
      }),
      { jars: 0, revenue: 0, cogs: 0, grossMargin: 0 },
    );
    expect(sum.jars).toBe(salts.channelTotals.jars);
    expect(Math.abs(sum.revenue - salts.channelTotals.revenue)).toBeLessThanOrEqual(5);
    expect(Math.abs(sum.cogs - salts.channelTotals.cogs)).toBeLessThanOrEqual(5);
    expect(Math.abs(sum.grossMargin - salts.channelTotals.grossMargin)).toBeLessThanOrEqual(5);
  });

  it("channel pricing matches spec ($8.50 wholesale/corporate, $12 markets)", () => {
    const byName = Object.fromEntries(salts.channels.map((c) => [c.name, c]));
    expect(byName["Wholesale"].pricePerJar).toBe(8.5);
    expect(byName["Corporate"].pricePerJar).toBe(8.5);
    expect(byName["Markets — craft fairs"].pricePerJar).toBe(12);
    expect(byName["Markets — farmers market"].pricePerJar).toBe(12);
    expect(byName["Wholesale"].jars).toBe(525);
    expect(byName["Corporate"].jars).toBe(500);
    expect(byName["Markets — craft fairs"].jars).toBe(120);
    expect(byName["Markets — farmers market"].jars).toBe(45);
  });

  it("operating overhead: $1,050/yr markets + $1,800/yr subscriptions (30% allocation)", () => {
    expect(salts.operating.marketsCraftAnnual).toBe(600);
    expect(salts.operating.marketsFarmersAnnual).toBe(450);
    expect(salts.operating.marketsOverheadTotal).toBe(1050);
    expect(salts.operating.subscriptionsAnnual).toBe(1800);
    expect(salts.operating.subscriptionsAllocationPct).toBe(30);
  });

  it("Salts P&L: net cash = $1,298/yr (revenue − COGS − markets − subs)", () => {
    expect(salts.pAndL.revenue).toBe(10693);
    expect(salts.pAndL.cogs).toBe(6545);
    expect(salts.pAndL.marketsOverhead).toBe(1050);
    expect(salts.pAndL.subscriptions).toBe(1800);
    expect(salts.pAndL.netCash).toBe(1298);
    expect(
      salts.pAndL.revenue -
        salts.pAndL.cogs -
        salts.pAndL.marketsOverhead -
        salts.pAndL.subscriptions,
    ).toBe(salts.pAndL.netCash);
  });

  it("shadow labour: ~$858/yr unpaid, adjusted economic net ~$440/yr", () => {
    expect(salts.shadowLabour.annualCost).toBe(858);
    expect(salts.shadowLabour.adjustedNet).toBe(440);
    expect(salts.shadowLabour.benchHourly).toBe(30);
  });

  it("maple syrup context line: $576/yr margin (12 cases × 12 bottles × $4)", () => {
    expect(salts.mapleSyrup.cases).toBe(12);
    expect(salts.mapleSyrup.bottlesPerCase).toBe(12);
    expect(salts.mapleSyrup.marginPerBottle).toBe(4);
    expect(salts.mapleSyrup.annualMargin).toBe(576);
    expect(
      salts.mapleSyrup.cases *
        salts.mapleSyrup.bottlesPerCase *
        salts.mapleSyrup.marginPerBottle,
    ).toBe(salts.mapleSyrup.annualMargin);
  });
});

describe("807 CDP grant bucket — locked headline numbers (sourced from SHARED_CDP807)", () => {
  const cdp = SHARED_CDP807;

  it("scoping: $24k − $2k discount = $22k bill ($12k confirmed + $10k board-voted)", () => {
    expect(cdp.scoping.originalScope).toBe(24000);
    expect(cdp.scoping.localDiscount).toBe(-2000);
    expect(cdp.scoping.billTo807).toBe(22000);
    expect(cdp.scoping.confirmedGrant).toBe(12000);
    expect(cdp.scoping.boardVoted).toBe(10000);
    expect(cdp.scoping.cashReceivedToDate).toBe(0);
    expect(cdp.scoping.originalScope + cdp.scoping.localDiscount).toBe(
      cdp.scoping.billTo807,
    );
    expect(cdp.scoping.confirmedGrant + cdp.scoping.boardVoted).toBe(
      cdp.scoping.billTo807,
    );
  });

  it("cost to deliver: $1,500 Replit hosting, no other cash out", () => {
    expect(cdp.costToDeliver.replitHosting).toBe(1500);
    expect(cdp.costToDeliver.other).toBe(0);
  });

  it("P&L: $22k revenue − $1.5k hosting = $20.5k net cash", () => {
    expect(cdp.pAndL.revenue).toBe(22000);
    expect(cdp.pAndL.replitHosting).toBe(1500);
    expect(cdp.pAndL.netCash).toBe(20500);
    expect(cdp.pAndL.revenue - cdp.pAndL.replitHosting).toBe(cdp.pAndL.netCash);
  });

  it("structured option: $1,500 upfront, $22k cap until receivable retired", () => {
    expect(cdp.structuredOption.upfront807).toBe(1500);
    expect(cdp.structuredOption.cap).toBe(22000);
    expect(cdp.structuredOption.dogTreatUnitCostLow).toBe(1);
    expect(cdp.structuredOption.dogTreatUnitCostHigh).toBe(2);
  });
});

describe("V3 lean-team agency line — locked headline numbers", () => {
  // Source of truth: .local/tasks/practitioners-guide-v3.md
  // V3 was promoted to the default operating framework on 2026-04-26 when V2
  // (full team, $115k/mo) was retired from the live scenario set.
  const agency = SCENARIO_V3.contracts.agency;

  it("engagement structure: $90k/mo fee, 18-month term, renegotiated at month 12", () => {
    expect(agency.fee).toBe(90000);
    expect(agency.termMonths).toBe(18);
    expect(agency.renegotiateMonth).toBe(12);
    expect(agency.startDate).toBe("June 1, 2026");
  });

  it("payroll: 6 roles totalling $52,000/mo (lean roster, drops Transparency Stack + Junior Analyst from the retired V2 baseline)", () => {
    expect(agency.roster).toHaveLength(6);
    expect(agency.payrollTotal).toBe(52000);
    expect(agency.roster.reduce((s, r) => s + r.monthlyLoaded, 0)).toBe(52000);
  });

  it("roster role names match the locked 6-role lean roster", () => {
    const roles = agency.roster.map((r) => r.role);
    expect(roles).toEqual([
      "Practitioner / Lead",
      "IT / Tech",
      "Operations Manager (Dryden)",
      "Community Development Associate",
      "Food Handler (Dryden depot)",
      "Bookkeeper / Admin",
    ]);
    // Roles dropped vs retired V2 must NOT appear in V3.
    expect(roles).not.toContain("Transparency Stack Engineer");
    expect(roles).not.toContain("Junior Analyst / Field");
  });

  it("overheads: $10,392 Jun–Aug, $12,492 Sep onward (sourced from SHARED_OVERHEADS_*)", () => {
    expect(agency.overheadsJunAugTotal).toBe(SHARED_OVERHEADS_JUN_AUG_TOTAL);
    expect(agency.overheadsSepOnwardTotal).toBe(SHARED_OVERHEADS_SEP_ONWARD_TOTAL);
    expect(agency.overheadsJunAugTotal).toBe(10392);
    expect(agency.overheadsSepOnwardTotal).toBe(12492);
  });

  it("cost basis: $62,392 Jun–Aug, $64,492 Sep onward; surplus $27,608 / $25,508", () => {
    expect(agency.costBasisJunAug).toBe(62392);
    expect(agency.costBasisSepOnward).toBe(64492);
    expect(agency.monthlySurplusJunAug).toBe(27608);
    expect(agency.monthlySurplusSepOnward).toBe(25508);
    expect(agency.fee - agency.costBasisJunAug).toBe(agency.monthlySurplusJunAug);
    expect(agency.fee - agency.costBasisSepOnward).toBe(agency.monthlySurplusSepOnward);
  });

  it("capital recovery: $112k retired in ~4 months at the underpriced $90k/mo fee", () => {
    expect(agency.capitalRecoveryAmount).toBe(112000);
    expect(agency.capitalRecoveryMonths).toBe(4);
    expect(agency.capitalRecoveryStartLabel).toBe("Jun 2026");
    expect(agency.capitalRecoveryEndLabel).toContain("Oct 2026");
  });

  it("Brightside Launch Month: October 2026, $28k pre-launch, $2,492 short", () => {
    expect(agency.brightsideLaunchMonthLabel).toContain("October 2026");
    expect(agency.brightsidePrelaunchSpend).toBe(28000);
    expect(agency.brightsideLaunchSurplus).toBe(25508);
    expect(agency.brightsideLaunchRemainder).toBe(-2492);
    expect(
      agency.brightsideLaunchSurplus - agency.brightsidePrelaunchSpend,
    ).toBe(agency.brightsideLaunchRemainder);
  });

  it("Phase 3 split is 50/25/25 across 13 months", () => {
    expect(agency.reservePct).toBe(50);
    expect(agency.innovationPct).toBe(25);
    expect(agency.givingPct).toBe(25);
    expect(agency.reservePct + agency.innovationPct + agency.givingPct).toBe(100);
    expect(agency.phase3Months).toBe(13);
    expect(agency.phase3MonthlySurplus).toBe(25508);
    expect(agency.reserveMonthly).toBe(12754);
    expect(agency.innovationMonthly).toBe(6377);
    expect(agency.givingMonthly).toBe(6377);
    expect(agency.reserveMonthly + agency.innovationMonthly + agency.givingMonthly).toBe(
      agency.phase3MonthlySurplus,
    );
  });

  it("Phase 3 totals: ~$165,802 Reserve / ~$82,901 Innovation / ~$82,901 Giving", () => {
    expect(agency.reserveTotal).toBe(165802);
    expect(agency.innovationTotal).toBe(82901);
    expect(agency.givingTotal).toBe(82901);
  });

  it("practitioner salary: $324,000 across 18 months ($18k/mo × 18)", () => {
    expect(agency.practitionerSalary18mo).toBe(324000);
    expect(agency.roster[0].role).toBe("Practitioner / Lead");
    expect(agency.roster[0].monthlyLoaded).toBe(18000);
    expect(agency.roster[0].monthlyLoaded * agency.termMonths).toBe(
      agency.practitionerSalary18mo,
    );
  });

  it("reserve has all four declared purposes, giving is NW Ontario / Dryden–Deer Lake", () => {
    expect(agency.reservePurposes).toBe(SHARED_RESERVE_PURPOSES);
    expect(agency.reservePurposes).toHaveLength(4);
    expect(agency.givingDirection).toBe(SHARED_GIVING_DIRECTION);
    expect(agency.givingDirection).toContain("NW Ontario");
    expect(agency.givingDirection).toContain("Dryden–Deer Lake");
  });
});

describe("V3 18-month surplus deployment math — adds up to $465,444", () => {
  const agency = SCENARIO_V3.contracts.agency;
  const totals = agency.totals18mo;

  it("revenue: $90k × 18 = $1,620,000", () => {
    expect(totals.revenue).toBe(1620000);
    expect(agency.fee * agency.termMonths).toBe(totals.revenue);
  });

  it("payroll: $52k × 18 = $936,000", () => {
    expect(totals.payroll).toBe(936000);
    expect(agency.payrollTotal * agency.termMonths).toBe(totals.payroll);
  });

  it("overheads: 3 × $10,392 + 15 × $12,492 = $218,556", () => {
    expect(totals.overheads).toBe(218556);
    expect(
      3 * agency.overheadsJunAugTotal + 15 * agency.overheadsSepOnwardTotal,
    ).toBe(totals.overheads);
  });

  it("surplus deployed: $1,620,000 − $936,000 − $218,556 = $465,444", () => {
    expect(totals.surplusDeployed).toBe(465444);
    expect(totals.revenue - totals.payroll - totals.overheads).toBe(465444);
  });

  it("deployment components reconcile to surplus within ~$7k (Nov-splits absorb $2,492 Oct overflow + Phase-3 month-boundary rounding)", () => {
    const componentsSum =
      totals.capitalRecovery +
      totals.brightsidePrelaunch +
      totals.reserve +
      totals.innovation +
      totals.giving;
    expect(Math.abs(componentsSum - totals.surplusDeployed)).toBeLessThanOrEqual(7000);
  });
});

describe("Brightside RT-LTC SaaS bucket — locked headline numbers (sourced from SHARED_BRIGHTSIDE)", () => {
  const bs = SHARED_BRIGHTSIDE;

  it("pricing: Tier 1 $199, Tier 2 $349, $3 per-resident overage, $500 setup, $1,500 training", () => {
    expect(bs.pricing.tier1.monthly).toBe(199);
    expect(bs.pricing.tier2.monthly).toBe(349);
    expect(bs.pricing.perResidentOverage).toBe(3);
    expect(bs.pricing.setupFee).toBe(500);
    expect(bs.pricing.trainingPerFacility).toBe(1500);
  });

  it("build model: founder time = $0 cash, $20k pre-launch engineer cap", () => {
    expect(bs.buildModel.founderTimeCashCost).toBe(0);
    expect(bs.buildModel.prelaunchEngineerCap).toBe(20000);
    expect(bs.buildModel.prelaunchPaymentMonth).toContain("September 2026");
  });

  it("revenue target: $120k cumulative, ~$80k exit ARR", () => {
    expect(bs.revenueTarget.cumulative18mo).toBe(120000);
    expect(bs.revenueTarget.exitArr).toBe(80000);
  });

  it("cost basis: $28k pre-launch ($20k + $5k + $3k), $1,375/mo recurring, ~$46k total over 18 mo", () => {
    expect(bs.costBasis.prelaunchTotal).toBe(28000);
    expect(bs.costBasis.recurringMonthlyTotal).toBe(1375);
    expect(bs.costBasis.total18mo).toBe(46000);
    const prelaunchSum = bs.costBasis.prelaunchOneTime.reduce((s, l) => s + l.amount, 0);
    expect(prelaunchSum).toBe(28000);
    const recurringSum = bs.costBasis.recurringMonthly.reduce((s, l) => s + l.amount, 0);
    expect(recurringSum).toBe(1375);
  });

  it("surplus deployment: $120k − $46k = $74k, 50/50 split = $37k retained / $37k owner take", () => {
    expect(bs.surplusDeployment.revenue).toBe(120000);
    expect(bs.surplusDeployment.cost).toBe(46000);
    expect(bs.surplusDeployment.surplus).toBe(74000);
    expect(bs.surplusDeployment.revenue - bs.surplusDeployment.cost).toBe(
      bs.surplusDeployment.surplus,
    );
    expect(bs.surplusDeployment.retainedPct).toBe(50);
    expect(bs.surplusDeployment.ownerTakePct).toBe(50);
    expect(bs.surplusDeployment.retained).toBe(37000);
    expect(bs.surplusDeployment.ownerTake).toBe(37000);
  });

  it("downside coverage: max exposure $46k ≈ 36% of $126,155 Innovation bucket (V2-era number kept as a reference frame)", () => {
    expect(bs.downsideCoverage.sourceAmount).toBe(126155);
    expect(bs.downsideCoverage.maxExposure).toBe(46000);
    expect(bs.downsideCoverage.coveragePct).toBe(36);
  });
});

describe("V3 personal compensation — locked headline numbers", () => {
  const personal = SCENARIO_V3.personal;

  it("$324k agency salary + $37k Brightside owner take = $361k total over 18 months", () => {
    expect(personal.agencySalary18mo).toBe(324000);
    expect(personal.brightsideOwnerTake).toBe(37000);
    expect(personal.total18mo).toBe(361000);
    expect(personal.agencySalary18mo + personal.brightsideOwnerTake).toBe(
      personal.total18mo,
    );
    expect(personal.perYear).toBe(240667);
  });

  it("$112k Capital Recovery is flagged as debt repayment, NOT income", () => {
    expect(personal.capitalRecovery).toBe(112000);
    // Capital Recovery must NOT be folded into the personal-cash total.
    expect(personal.total18mo).not.toBe(
      personal.agencySalary18mo +
        personal.brightsideOwnerTake +
        personal.capitalRecovery,
    );
  });
});

describe("V4 right-priced agency line — locked headline numbers", () => {
  // Source of truth: .local/tasks/task-174.md
  const agency = SCENARIO_V4.contracts.agency;

  it("engagement structure: $105k/mo fee, 18-month term, renegotiated at month 12", () => {
    expect(agency.fee).toBe(105000);
    expect(agency.termMonths).toBe(18);
    expect(agency.renegotiateMonth).toBe(12);
    expect(agency.startDate).toBe("June 1, 2026");
  });

  it("payroll: 6 lean roles totalling $52,000/mo (same roster as V3)", () => {
    expect(agency.roster).toHaveLength(6);
    expect(agency.payrollTotal).toBe(52000);
    expect(agency.roster.reduce((s, r) => s + r.monthlyLoaded, 0)).toBe(52000);
    expect(agency.payrollTotal).toBe(SCENARIO_V3.contracts.agency.payrollTotal);
  });

  it("roster role names match the locked 6-role lean roster (same as V3)", () => {
    const roles = agency.roster.map((r) => r.role);
    expect(roles).toEqual([
      "Practitioner / Lead",
      "IT / Tech",
      "Operations Manager (Dryden)",
      "Community Development Associate",
      "Food Handler (Dryden depot)",
      "Bookkeeper / Admin",
    ]);
  });

  it("overheads: held identical to V3 ($10,392 Jun–Aug, $12,492 Sep+)", () => {
    expect(agency.overheadsJunAugTotal).toBe(SHARED_OVERHEADS_JUN_AUG_TOTAL);
    expect(agency.overheadsSepOnwardTotal).toBe(SHARED_OVERHEADS_SEP_ONWARD_TOTAL);
  });

  it("cost basis: $62,392 / $64,492; surplus $42,608 / $40,508", () => {
    expect(agency.costBasisJunAug).toBe(62392);
    expect(agency.costBasisSepOnward).toBe(64492);
    expect(agency.monthlySurplusJunAug).toBe(42608);
    expect(agency.monthlySurplusSepOnward).toBe(40508);
    expect(agency.fee - agency.costBasisJunAug).toBe(agency.monthlySurplusJunAug);
    expect(agency.fee - agency.costBasisSepOnward).toBe(agency.monthlySurplusSepOnward);
  });

  it("Sep-onward gross margin lands in the 35–40% target band (38.6%)", () => {
    const marginPct = (agency.monthlySurplusSepOnward / agency.fee) * 100;
    expect(marginPct).toBeGreaterThanOrEqual(35);
    expect(marginPct).toBeLessThanOrEqual(45);
    expect(Math.round(marginPct * 10) / 10).toBe(38.6);
  });

  it("capital recovery: $112k retired in 3 months (Jun–Aug 2026)", () => {
    expect(agency.capitalRecoveryAmount).toBe(112000);
    expect(agency.capitalRecoveryMonths).toBe(3);
    expect(agency.capitalRecoveryStartLabel).toBe("Jun 2026");
    expect(agency.capitalRecoveryEndLabel).toContain("Aug 2026");
  });

  it("Brightside Launch Month: September 2026 (right-priced surplus retires capital before Sep), $28k spend, $12,508 remainder", () => {
    expect(agency.brightsideLaunchMonthLabel).toBe("September 2026");
    expect(agency.brightsidePrelaunchSpend).toBe(28000);
    expect(agency.brightsideLaunchSurplus).toBe(40508);
    expect(agency.brightsideLaunchRemainder).toBe(12508);
    expect(
      agency.brightsideLaunchSurplus - agency.brightsidePrelaunchSpend,
    ).toBe(agency.brightsideLaunchRemainder);
  });

  it("Phase 3 split is 50/25/25 across 14 months", () => {
    expect(agency.reservePct).toBe(50);
    expect(agency.innovationPct).toBe(25);
    expect(agency.givingPct).toBe(25);
    expect(agency.reservePct + agency.innovationPct + agency.givingPct).toBe(100);
    expect(agency.phase3Months).toBe(14);
    expect(agency.phase3MonthlySurplus).toBe(40508);
    expect(agency.reserveMonthly).toBe(20254);
    expect(agency.innovationMonthly).toBe(10127);
    expect(agency.givingMonthly).toBe(10127);
    expect(agency.reserveMonthly + agency.innovationMonthly + agency.givingMonthly).toBe(
      agency.phase3MonthlySurplus,
    );
  });

  it("Phase 3 totals: $283,556 Reserve / $141,778 Innovation / $141,778 Giving", () => {
    expect(agency.reserveTotal).toBe(283556);
    expect(agency.innovationTotal).toBe(141778);
    expect(agency.givingTotal).toBe(141778);
  });

  it("practitioner salary unchanged: $324,000 across 18 months ($18k/mo × 18)", () => {
    expect(agency.practitionerSalary18mo).toBe(324000);
    expect(agency.roster[0].role).toBe("Practitioner / Lead");
    expect(agency.roster[0].monthlyLoaded).toBe(18000);
    expect(agency.roster[0].monthlyLoaded * agency.termMonths).toBe(
      agency.practitionerSalary18mo,
    );
  });

  it("reserve purposes and giving direction sourced from SHARED constants", () => {
    expect(agency.reservePurposes).toBe(SHARED_RESERVE_PURPOSES);
    expect(agency.givingDirection).toBe(SHARED_GIVING_DIRECTION);
  });
});

describe("V4 18-month surplus deployment math — adds up to $735,444", () => {
  const agency = SCENARIO_V4.contracts.agency;
  const totals = agency.totals18mo;

  it("revenue: $105k × 18 = $1,890,000", () => {
    expect(totals.revenue).toBe(1890000);
    expect(agency.fee * agency.termMonths).toBe(totals.revenue);
  });

  it("payroll: $52k × 18 = $936,000 (same as V3)", () => {
    expect(totals.payroll).toBe(936000);
    expect(agency.payrollTotal * agency.termMonths).toBe(totals.payroll);
    expect(totals.payroll).toBe(SCENARIO_V3.contracts.agency.totals18mo.payroll);
  });

  it("overheads: 3 × $10,392 + 15 × $12,492 = $218,556 (same as V3)", () => {
    expect(totals.overheads).toBe(218556);
    expect(
      3 * agency.overheadsJunAugTotal + 15 * agency.overheadsSepOnwardTotal,
    ).toBe(totals.overheads);
    expect(totals.overheads).toBe(SCENARIO_V3.contracts.agency.totals18mo.overheads);
  });

  it("surplus deployed: $1,890,000 − $936,000 − $218,556 = $735,444", () => {
    expect(totals.surplusDeployed).toBe(735444);
    expect(totals.revenue - totals.payroll - totals.overheads).toBe(735444);
  });

  it("V4 surplus exceeds V3 by $270,000 (the price-discipline delta on the same roster)", () => {
    // 18 × $15,000 fee delta = $270,000 more surplus deployed at the same payroll.
    expect(totals.surplusDeployed - SCENARIO_V3.contracts.agency.totals18mo.surplusDeployed).toBe(270000);
  });

  it("deployment components reconcile to surplus within ~$30k (Aug trickle + Sep launch remainder)", () => {
    const componentsSum =
      totals.capitalRecovery +
      totals.brightsidePrelaunch +
      totals.reserve +
      totals.innovation +
      totals.giving;
    expect(Math.abs(totals.surplusDeployed - componentsSum)).toBeLessThanOrEqual(30000);
  });
});

describe("V4 personal compensation — unchanged from V3 baseline", () => {
  const personal = SCENARIO_V4.personal;

  it("$324k agency salary + $37k Brightside owner take = $361k total (same as V3)", () => {
    expect(personal.agencySalary18mo).toBe(324000);
    expect(personal.brightsideOwnerTake).toBe(37000);
    expect(personal.total18mo).toBe(361000);
    expect(personal.agencySalary18mo + personal.brightsideOwnerTake).toBe(
      personal.total18mo,
    );
    expect(personal.perYear).toBe(240667);
    expect(personal.total18mo).toBe(SCENARIO_V3.personal.total18mo);
  });

  it("$112k Capital Recovery flagged as debt repayment, NOT income", () => {
    expect(personal.capitalRecovery).toBe(112000);
    expect(personal.total18mo).not.toBe(
      personal.agencySalary18mo +
        personal.brightsideOwnerTake +
        personal.capitalRecovery,
    );
  });
});

describe("V4 renegotiation triggers — structured field, not prose", () => {
  const triggers = SCENARIO_V4.contracts.agency.renegotiationTriggers;

  it("V4 publishes at least one renegotiation trigger (V3 publishes none)", () => {
    expect(triggers.length).toBeGreaterThanOrEqual(1);
    expect(SCENARIO_V3.contracts.agency.renegotiationTriggers).toEqual([]);
  });

  it("V4 publishes exactly 2 triggers (month-12 renegotiation + month-18 renewal)", () => {
    expect(triggers.length).toBe(2);
  });

  it("each trigger has the structured shape: step, condition, feeStepTo, drawStepTo, evidenceRequired", () => {
    for (const t of triggers) {
      expect(typeof t.step).toBe("string");
      expect(t.step.length).toBeGreaterThan(0);
      expect(typeof t.condition).toBe("string");
      expect(t.condition.length).toBeGreaterThan(0);
      expect(typeof t.feeStepTo).toBe("number");
      expect(t.feeStepTo).toBeGreaterThan(SCENARIO_V4.contracts.agency.fee);
      expect(typeof t.drawStepTo).toBe("number");
      expect(t.drawStepTo).toBeGreaterThanOrEqual(SCENARIO_V4.contracts.agency.roster[0].monthlyLoaded);
      expect(typeof t.evidenceRequired).toBe("string");
      expect(t.evidenceRequired.length).toBeGreaterThan(0);
    }
  });

  it("triggers escalate monotonically (later trigger steps to a higher fee + draw)", () => {
    for (let i = 1; i < triggers.length; i++) {
      expect(triggers[i].feeStepTo).toBeGreaterThanOrEqual(triggers[i - 1].feeStepTo);
      expect(triggers[i].drawStepTo).toBeGreaterThanOrEqual(triggers[i - 1].drawStepTo);
    }
  });

  it("month-18 renewal lifts lead draw into the $20–22k band the founder asked for", () => {
    const renewal = triggers[triggers.length - 1];
    expect(renewal.drawStepTo).toBeGreaterThanOrEqual(20000);
    expect(renewal.drawStepTo).toBeLessThanOrEqual(22000);
  });
});

describe("V3 ↔ V4 invariants — Salts, Brightside, 807 are the SAME object (cannot drift)", () => {
  it("Salts bucket is the SHARED_SALTS object across V3 and V4", () => {
    expect(SCENARIO_V3.salts).toBe(SHARED_SALTS);
    expect(SCENARIO_V4.salts).toBe(SHARED_SALTS);
    expect(SCENARIO_V4.salts).toBe(SCENARIO_V3.salts);
  });

  it("Brightside bucket is the SHARED_BRIGHTSIDE object across V3 and V4", () => {
    expect(SCENARIO_V3.brightside).toBe(SHARED_BRIGHTSIDE);
    expect(SCENARIO_V4.brightside).toBe(SHARED_BRIGHTSIDE);
    expect(SCENARIO_V4.brightside).toBe(SCENARIO_V3.brightside);
  });

  it("807 CDP bucket is the SHARED_CDP807 object across V3 and V4", () => {
    expect(SCENARIO_V3.contracts.cdp807).toBe(SHARED_CDP807);
    expect(SCENARIO_V4.contracts.cdp807).toBe(SHARED_CDP807);
    expect(SCENARIO_V4.contracts.cdp807).toBe(SCENARIO_V3.contracts.cdp807);
  });

  it("reserve purposes and giving direction are the SHARED constants on both V3 and V4", () => {
    expect(SCENARIO_V3.contracts.agency.reservePurposes).toBe(SHARED_RESERVE_PURPOSES);
    expect(SCENARIO_V4.contracts.agency.reservePurposes).toBe(SHARED_RESERVE_PURPOSES);
    expect(SCENARIO_V3.contracts.agency.givingDirection).toBe(SHARED_GIVING_DIRECTION);
    expect(SCENARIO_V4.contracts.agency.givingDirection).toBe(SHARED_GIVING_DIRECTION);
  });

  it("V4 Agency line legitimately differs from V3 (sanity: tests would catch a copy-paste)", () => {
    expect(SCENARIO_V4.contracts.agency.fee).not.toBe(SCENARIO_V3.contracts.agency.fee);
    expect(SCENARIO_V3.status).toBe("locked");
    expect(SCENARIO_V4.status).toBe("locked");
  });
});

describe("Scenario registry — V3 is the locked default; V4 is the alt-reality option", () => {
  it("SCENARIOS contains exactly v3 and v4 (V2 has been retired)", () => {
    expect(Object.keys(SCENARIOS).sort()).toEqual(["v3", "v4"]);
    expect(SCENARIOS.v3).toBe(SCENARIO_V3);
    expect(SCENARIOS.v4).toBe(SCENARIO_V4);
  });

  it("SCENARIO_ORDER lists v3 first, v4 second (toggle reads left-to-right)", () => {
    expect(SCENARIO_ORDER).toEqual(["v3", "v4"]);
  });

  it("DEFAULT_SCENARIO_ID is v3 (the locked operating framework)", () => {
    expect(DEFAULT_SCENARIO_ID).toBe("v3");
  });
});
