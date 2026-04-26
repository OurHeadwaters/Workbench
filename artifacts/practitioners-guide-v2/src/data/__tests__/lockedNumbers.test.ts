import { describe, it, expect } from "vitest";
import { SCENARIO_V2 } from "../v2";
import { SCENARIO_V3 } from "../v3";

/**
 * Locked-number guard tests.
 *
 * Source of truth: .local/tasks/practitioners-guide-v2.md
 * (this is the file referenced as "task-145.md" in task-149's framing —
 * the canonical spec that locks every dollar in the founder's handbook).
 *
 * If a number in v2.ts or v3.ts drifts from that founder-confirmed
 * spec, these tests must fail before the founder ever opens the page.
 */

describe("Salts bucket — locked headline numbers", () => {
  const salts = SCENARIO_V2.salts;

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
    // Channel totals are rounded; allow ≤ $5 of rounding drift.
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

describe("807 CDP grant bucket — locked headline numbers", () => {
  const cdp = SCENARIO_V2.contracts.cdp807;

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

describe("Agency aspiration ($115k/mo) — locked headline numbers (V2)", () => {
  const agency = SCENARIO_V2.contracts.agency;

  it("engagement structure: $115k/mo fee, 18-month term, renegotiated at month 12", () => {
    expect(agency.fee).toBe(115000);
    expect(agency.termMonths).toBe(18);
    expect(agency.renegotiateMonth).toBe(12);
    expect(agency.startDate).toBe("June 1, 2026");
  });

  it("payroll: 8 roles totalling $67,000/mo; row sum equals declared total", () => {
    expect(agency.roster).toHaveLength(8);
    expect(agency.payrollTotal).toBe(67000);
    expect(agency.roster.reduce((s, r) => s + r.monthlyLoaded, 0)).toBe(67000);
  });

  it("overheads: $10,392/mo Jun–Aug, $12,492/mo Sep onward (Sep adds $2,100 life supports)", () => {
    expect(agency.overheadsJunAugTotal).toBe(10392);
    expect(agency.overheadsSepOnwardTotal).toBe(12492);
    expect(agency.overheadsSepOnwardTotal - agency.overheadsJunAugTotal).toBe(2100);
  });

  it("cost basis: $77,392 Jun–Aug, $79,492 Sep onward; surplus $37,608 / $35,508", () => {
    expect(agency.costBasisJunAug).toBe(77392);
    expect(agency.costBasisSepOnward).toBe(79492);
    expect(agency.monthlySurplusJunAug).toBe(37608);
    expect(agency.monthlySurplusSepOnward).toBe(35508);
    expect(agency.fee - agency.costBasisJunAug).toBe(agency.monthlySurplusJunAug);
    expect(agency.fee - agency.costBasisSepOnward).toBe(agency.monthlySurplusSepOnward);
  });

  it("capital recovery: $112k retired in 3 months (Jun–Aug 2026)", () => {
    expect(agency.capitalRecoveryAmount).toBe(112000);
    expect(agency.capitalRecoveryMonths).toBe(3);
  });

  it("Brightside Launch Month: September 2026, $28k pre-launch spend", () => {
    expect(agency.brightsideLaunchMonthLabel).toBe("September 2026");
    expect(agency.brightsidePrelaunchSpend).toBe(28000);
    expect(agency.brightsideLaunchSurplus).toBe(35508);
    expect(
      agency.brightsideLaunchSurplus - agency.brightsidePrelaunchSpend,
    ).toBe(agency.brightsideLaunchRemainder);
  });

  it("Phase 3 split is 50/25/25 (Reserve / Innovation / Giving)", () => {
    expect(agency.reservePct).toBe(50);
    expect(agency.innovationPct).toBe(25);
    expect(agency.givingPct).toBe(25);
    expect(agency.reservePct + agency.innovationPct + agency.givingPct).toBe(100);
    expect(agency.reserveMonthly).toBe(17754);
    expect(agency.innovationMonthly).toBe(8877);
    expect(agency.givingMonthly).toBe(8877);
    expect(agency.phase3Months).toBe(14);
  });

  it("Phase 3 totals: ~$252,310 Reserve / ~$126,155 Innovation / ~$126,155 Giving", () => {
    expect(agency.reserveTotal).toBe(252310);
    expect(agency.innovationTotal).toBe(126155);
    expect(agency.givingTotal).toBe(126155);
  });

  it("practitioner salary: $324,000 across 18 months ($18k/mo × 18)", () => {
    expect(agency.practitionerSalary18mo).toBe(324000);
    expect(agency.roster[0].role).toBe("Practitioner / Lead");
    expect(agency.roster[0].monthlyLoaded * agency.termMonths).toBe(
      agency.practitionerSalary18mo,
    );
  });

  it("reserve has all four declared purposes, giving is NW Ontario / Dryden–Deer Lake", () => {
    expect(agency.reservePurposes).toHaveLength(4);
    expect(agency.givingDirection).toContain("NW Ontario");
    expect(agency.givingDirection).toContain("Dryden–Deer Lake");
  });
});

describe("18-month surplus deployment math — adds up to $645,444", () => {
  const agency = SCENARIO_V2.contracts.agency;
  const totals = agency.totals18mo;

  it("revenue: $115k × 18 = $2,070,000", () => {
    expect(totals.revenue).toBe(2070000);
    expect(agency.fee * agency.termMonths).toBe(totals.revenue);
  });

  it("payroll: $67k × 18 = $1,206,000", () => {
    expect(totals.payroll).toBe(1206000);
    expect(agency.payrollTotal * agency.termMonths).toBe(totals.payroll);
  });

  it("overheads: 3 × $10,392 + 15 × $12,492 = $218,556", () => {
    expect(totals.overheads).toBe(218556);
    expect(
      3 * agency.overheadsJunAugTotal + 15 * agency.overheadsSepOnwardTotal,
    ).toBe(totals.overheads);
  });

  it("surplus deployed: $2,070,000 − $1,206,000 − $218,556 = $645,444", () => {
    expect(totals.surplusDeployed).toBe(645444);
    expect(totals.revenue - totals.payroll - totals.overheads).toBe(645444);
  });

  it("deployment components reconcile to surplus (capital recovery + Brightside pre-launch + 50/25/25 ≈ $645,444 within ~$1k trickle)", () => {
    const componentsSum =
      totals.capitalRecovery +
      totals.brightsidePrelaunch +
      totals.reserve +
      totals.innovation +
      totals.giving;
    // ~$824 immaterial late-August trickle is acknowledged in capitalRecoveryTag.
    expect(Math.abs(totals.surplusDeployed - componentsSum)).toBeLessThanOrEqual(1000);
  });

  it("phase 3 component math: 50/25/25 of $35,508/mo across 14 months", () => {
    expect(agency.reserveMonthly + agency.innovationMonthly + agency.givingMonthly).toBe(
      agency.phase3MonthlySurplus,
    );
    expect(agency.reserveMonthly).toBe(agency.phase3MonthlySurplus * 0.5);
    expect(agency.innovationMonthly * 2).toBeCloseTo(agency.reserveMonthly, 0);
  });
});

describe("Brightside RT-LTC SaaS bucket — locked headline numbers", () => {
  const bs = SCENARIO_V2.brightside;

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

  it("downside coverage: max exposure $46k ≈ 36% of $126,155 Innovation bucket", () => {
    expect(bs.downsideCoverage.sourceAmount).toBe(126155);
    expect(bs.downsideCoverage.maxExposure).toBe(46000);
    expect(bs.downsideCoverage.coveragePct).toBe(36);
  });
});

describe("Personal compensation transparency — locked headline numbers", () => {
  const personal = SCENARIO_V2.personal;

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

describe("V3 lean-team agency line — locked headline numbers", () => {
  // Source of truth: .local/tasks/practitioners-guide-v3.md
  const agency = SCENARIO_V3.contracts.agency;

  it("engagement structure: $90k/mo fee, 18-month term, renegotiated at month 12", () => {
    expect(agency.fee).toBe(90000);
    expect(agency.termMonths).toBe(18);
    expect(agency.renegotiateMonth).toBe(12);
    expect(agency.startDate).toBe("June 1, 2026");
  });

  it("payroll: 6 roles totalling $52,000/mo (drops Transparency Stack + Junior Analyst from V2)", () => {
    expect(agency.roster).toHaveLength(6);
    expect(agency.payrollTotal).toBe(52000);
    expect(agency.roster.reduce((s, r) => s + r.monthlyLoaded, 0)).toBe(52000);
  });

  it("roster delta vs V2: −$15,000/mo payroll (V2 $67k → V3 $52k)", () => {
    expect(SCENARIO_V2.contracts.agency.payrollTotal - agency.payrollTotal).toBe(15000);
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
    // Roles dropped vs V2 must NOT appear in V3.
    expect(roles).not.toContain("Transparency Stack Engineer");
    expect(roles).not.toContain("Junior Analyst / Field");
  });

  it("overheads: held identical to V2 ($10,392 Jun–Aug, $12,492 Sep onward)", () => {
    expect(agency.overheadsJunAugTotal).toBe(10392);
    expect(agency.overheadsSepOnwardTotal).toBe(12492);
    expect(agency.overheadsJunAugTotal).toBe(SCENARIO_V2.contracts.agency.overheadsJunAugTotal);
    expect(agency.overheadsSepOnwardTotal).toBe(SCENARIO_V2.contracts.agency.overheadsSepOnwardTotal);
  });

  it("cost basis: $62,392 Jun–Aug, $64,492 Sep onward; surplus $27,608 / $25,508", () => {
    expect(agency.costBasisJunAug).toBe(62392);
    expect(agency.costBasisSepOnward).toBe(64492);
    expect(agency.monthlySurplusJunAug).toBe(27608);
    expect(agency.monthlySurplusSepOnward).toBe(25508);
    expect(agency.fee - agency.costBasisJunAug).toBe(agency.monthlySurplusJunAug);
    expect(agency.fee - agency.costBasisSepOnward).toBe(agency.monthlySurplusSepOnward);
  });

  it("capital recovery: $112k retired in ~4 months (slips from 3 mo in V2)", () => {
    expect(agency.capitalRecoveryAmount).toBe(112000);
    expect(agency.capitalRecoveryMonths).toBe(4);
    expect(agency.capitalRecoveryStartLabel).toBe("Jun 2026");
    expect(agency.capitalRecoveryEndLabel).toContain("Oct 2026");
  });

  it("Brightside Launch Month: shifts to October 2026, $28k pre-launch, $2,492 short", () => {
    expect(agency.brightsideLaunchMonthLabel).toContain("October 2026");
    expect(agency.brightsidePrelaunchSpend).toBe(28000);
    expect(agency.brightsideLaunchSurplus).toBe(25508);
    expect(agency.brightsideLaunchRemainder).toBe(-2492);
    expect(
      agency.brightsideLaunchSurplus - agency.brightsidePrelaunchSpend,
    ).toBe(agency.brightsideLaunchRemainder);
  });

  it("Phase 3 split is 50/25/25 across 13 months (one less than V2's 14)", () => {
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

  it("practitioner salary unchanged: $324,000 across 18 months ($18k/mo × 18)", () => {
    expect(agency.practitionerSalary18mo).toBe(324000);
    expect(agency.practitionerSalary18mo).toBe(SCENARIO_V2.contracts.agency.practitionerSalary18mo);
    expect(agency.roster[0].role).toBe("Practitioner / Lead");
    expect(agency.roster[0].monthlyLoaded).toBe(18000);
    expect(agency.roster[0].monthlyLoaded * agency.termMonths).toBe(
      agency.practitionerSalary18mo,
    );
  });

  it("reserve purposes and giving direction are inherited from V2 unchanged", () => {
    expect(agency.reservePurposes).toBe(SCENARIO_V2.contracts.agency.reservePurposes);
    expect(agency.givingDirection).toBe(SCENARIO_V2.contracts.agency.givingDirection);
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

  it("overheads: 3 × $10,392 + 15 × $12,492 = $218,556 (same as V2)", () => {
    expect(totals.overheads).toBe(218556);
    expect(
      3 * agency.overheadsJunAugTotal + 15 * agency.overheadsSepOnwardTotal,
    ).toBe(totals.overheads);
    expect(totals.overheads).toBe(SCENARIO_V2.contracts.agency.totals18mo.overheads);
  });

  it("surplus deployed: $1,620,000 − $936,000 − $218,556 = $465,444", () => {
    expect(totals.surplusDeployed).toBe(465444);
    expect(totals.revenue - totals.payroll - totals.overheads).toBe(465444);
  });

  it("V3 surplus is exactly $180,000 less than V2 ($90k vs $115k × 18 = $450k revenue gap, partially offset by $15k/mo × 18 = $270k payroll savings → net $180k)", () => {
    // 18 × $25,000 fee delta = $450,000 less revenue
    // 18 × $15,000 payroll savings = $270,000 less payroll cost
    // Net: $180,000 less surplus deployed
    expect(SCENARIO_V2.contracts.agency.totals18mo.surplusDeployed - totals.surplusDeployed).toBe(180000);
  });

  it("deployment components reconcile to surplus within ~$7k (Nov-splits absorb $2,492 Oct overflow + Phase-3 month-boundary rounding)", () => {
    const componentsSum =
      totals.capitalRecovery +
      totals.brightsidePrelaunch +
      totals.reserve +
      totals.innovation +
      totals.giving;
    // V3 components ($471,604) overstate the $465,444 surplus by ~$6,160 because
    // Phase 3 is approximated as 13 full months at the post-Sep surplus.
    // The November Reserve / Innovation / Giving splits absorb the $2,492 October
    // Brightside overflow plus rounding across the 13-month Phase-3 window.
    expect(Math.abs(componentsSum - totals.surplusDeployed)).toBeLessThanOrEqual(7000);
  });
});

describe("V3 personal compensation — unchanged from V2", () => {
  const personal = SCENARIO_V3.personal;

  it("$324k agency salary + $37k Brightside owner take = $361k total (same as V2)", () => {
    expect(personal.agencySalary18mo).toBe(324000);
    expect(personal.brightsideOwnerTake).toBe(37000);
    expect(personal.total18mo).toBe(361000);
    expect(personal.agencySalary18mo + personal.brightsideOwnerTake).toBe(
      personal.total18mo,
    );
    expect(personal.perYear).toBe(240667);
    expect(personal.total18mo).toBe(SCENARIO_V2.personal.total18mo);
    expect(personal.perYear).toBe(SCENARIO_V2.personal.perYear);
  });

  it("$112k Capital Recovery is debt repayment, NOT income (same framing as V2)", () => {
    expect(personal.capitalRecovery).toBe(112000);
    expect(personal.total18mo).not.toBe(
      personal.agencySalary18mo +
        personal.brightsideOwnerTake +
        personal.capitalRecovery,
    );
  });
});

describe("V2 ↔ V3 invariants — Salts and Brightside are identical", () => {
  it("Salts bucket is the exact same object across V2 and V3", () => {
    // V3 imports SCENARIO_V2.salts directly — referential equality is the
    // strongest guarantee that the buckets cannot drift.
    expect(SCENARIO_V3.salts).toBe(SCENARIO_V2.salts);
  });

  it("Brightside bucket is the exact same object across V2 and V3", () => {
    expect(SCENARIO_V3.brightside).toBe(SCENARIO_V2.brightside);
  });

  it("807 CDP grant bucket is the exact same object across V2 and V3", () => {
    // 807 CDP is also locked, real and in-flight — should never drift between scenarios.
    expect(SCENARIO_V3.contracts.cdp807).toBe(SCENARIO_V2.contracts.cdp807);
  });

  it("Salts headline numbers are byte-identical (defensive deep-value check)", () => {
    expect(SCENARIO_V3.salts.pAndL.netCash).toBe(SCENARIO_V2.salts.pAndL.netCash);
    expect(SCENARIO_V3.salts.channelTotals.revenue).toBe(
      SCENARIO_V2.salts.channelTotals.revenue,
    );
    expect(SCENARIO_V3.salts.perJarCogs.total).toBe(SCENARIO_V2.salts.perJarCogs.total);
  });

  it("Brightside headline numbers are byte-identical (defensive deep-value check)", () => {
    expect(SCENARIO_V3.brightside.surplusDeployment.surplus).toBe(
      SCENARIO_V2.brightside.surplusDeployment.surplus,
    );
    expect(SCENARIO_V3.brightside.revenueTarget.cumulative18mo).toBe(
      SCENARIO_V2.brightside.revenueTarget.cumulative18mo,
    );
    expect(SCENARIO_V3.brightside.costBasis.total18mo).toBe(
      SCENARIO_V2.brightside.costBasis.total18mo,
    );
  });

  it("V3 Agency line legitimately differs from V2 (sanity: tests would catch a copy-paste)", () => {
    // V3 is the lean-team scenario — the agency fee must be different.
    // If someone accidentally aliases v3Agency to v2Agency, this test fails.
    expect(SCENARIO_V3.contracts.agency.fee).not.toBe(
      SCENARIO_V2.contracts.agency.fee,
    );
    expect(SCENARIO_V3.contracts.agency.payrollTotal).not.toBe(
      SCENARIO_V2.contracts.agency.payrollTotal,
    );
    // Both scenarios are locked — V3 was promoted from provisional once the founder
    // confirmed the lean roster + fee in task #162. The ProvisionalBanner therefore
    // renders on neither page. Re-pinning to the literal so any future demotion or
    // relabel still trips the assertion.
    expect(SCENARIO_V3.status).toBe("locked");
    expect(SCENARIO_V2.status).toBe("locked");
  });
});
