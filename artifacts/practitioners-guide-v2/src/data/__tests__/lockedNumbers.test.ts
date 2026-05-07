import { describe, it, expect } from "vitest";
import { SCENARIO_V3 } from "../v3";
import { SCENARIO_V4 } from "../v4";
import { SCENARIO_V5 } from "../v5";
import { SCENARIO_V6 } from "../v6";
import { SCENARIOS, SCENARIO_ORDER, DEFAULT_SCENARIO_ID } from "../scenarios";
import { buildContractsLedger } from "../contractsLedger";
import { buildBrightsideLedger } from "../brightsideLedger";
import {
  SHARED_BRIGHTSIDE,
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
 * $115k/mo) and the 807 CDP grant line was removed entirely on 2026-04-28
 * (Northern Band docs are now the canonical source of practitioner team
 * structure), the live scenario set is V3 (locked default, 7-role Northern Band
 * roster) and V4 (right-priced, same roster). The shared `SHARED_*` constants
 * in `data/shared.ts` are the single source of truth for everything Salts /
 * Brightside / overheads / reserve / giving — V3 and V4 import them by
 * reference.
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

describe("807 CDP line — fully retired (no contracts.cdp807 on either scenario)", () => {
  it("V3 contracts has no cdp807 sub-line (the 807 CDP grant has been removed entirely)", () => {
    expect(SCENARIO_V3.contracts).not.toHaveProperty("cdp807");
  });

  it("V4 contracts has no cdp807 sub-line (the 807 CDP grant has been removed entirely)", () => {
    expect(SCENARIO_V4.contracts).not.toHaveProperty("cdp807");
  });
});

describe("V3 Northern Band-canonical agency line — locked headline numbers", () => {
  // Source of truth: .local/tasks/practitioners-guide-v3.md, plus the Deer
  // Lake walkthrough docs (which now own the practitioner team structure).
  // V3 was promoted to default on 2026-04-26 and re-rostered to the 7-role
  // Northern Band team on 2026-04-28 (added Hub Coordinator + Junior Analyst,
  // re-graded Practitioner to $14k/mo).
  const agency = SCENARIO_V3.contracts.agency;

  it("engagement structure: $90k/mo fee, 18-month term, renegotiated at month 12", () => {
    expect(agency.fee).toBe(90000);
    expect(agency.termMonths).toBe(18);
    expect(agency.renegotiateMonth).toBe(12);
    expect(agency.startDate).toBe("June 1, 2026");
  });

  it("payroll: 7 roles totalling $53,500/mo (Northern Band-canonical roster)", () => {
    expect(agency.roster).toHaveLength(7);
    expect(agency.payrollTotal).toBe(53500);
    expect(agency.roster.reduce((s, r) => s + r.monthlyLoaded, 0)).toBe(53500);
  });

  it("roster role names match the locked 7-role Northern Band roster (Dryden depot serving Northern Band distribution)", () => {
    const roles = agency.roster.map((r) => r.role);
    expect(roles).toEqual([
      "Practitioner / Lead",
      "Hub Coordinator (Dryden)",
      "IT / Tech",
      "Community Development Associate",
      "Food Handler (Dryden depot)",
      "Junior Analyst / Field",
      "Bookkeeper / Admin",
    ]);
    // Roles dropped vs retired V2 must NOT appear in V3.
    expect(roles).not.toContain("Transparency Stack Engineer");
    expect(roles).not.toContain("Operations Manager (Dryden)");
    // Hub Coordinator + Junior Analyst are the two seats added when the
    // Northern Band docs became the canonical source for team structure.
    expect(roles.some((r) => r.startsWith("Hub Coordinator"))).toBe(true);
    expect(roles.some((r) => r.startsWith("Junior Analyst"))).toBe(true);
  });

  it("overheads: $10,392 Jun–Aug, $12,492 Sep onward (sourced from SHARED_OVERHEADS_*)", () => {
    expect(agency.overheadsJunAugTotal).toBe(SHARED_OVERHEADS_JUN_AUG_TOTAL);
    expect(agency.overheadsSepOnwardTotal).toBe(SHARED_OVERHEADS_SEP_ONWARD_TOTAL);
    expect(agency.overheadsJunAugTotal).toBe(10392);
    expect(agency.overheadsSepOnwardTotal).toBe(12492);
  });

  it("tithe is 10% of revenue, top of waterfall: $9,000/mo, $162,000 over 18 months", () => {
    expect(agency.tithePct).toBe(10);
    expect(agency.titheMonthly).toBe(9000);
    expect(agency.titheTotal).toBe(162000);
    expect(agency.fee * 0.10).toBe(agency.titheMonthly);
    expect(agency.titheMonthly * agency.termMonths).toBe(agency.titheTotal);
  });

  it("cost basis: $63,892 Jun–Aug, $65,992 Sep onward; post-tithe surplus $17,108 / $15,008", () => {
    expect(agency.costBasisJunAug).toBe(63892);
    expect(agency.costBasisSepOnward).toBe(65992);
    expect(agency.monthlySurplusJunAug).toBe(17108);
    expect(agency.monthlySurplusSepOnward).toBe(15008);
    // Surplus is post-tithe: fee − tithe − cost basis.
    expect(agency.fee - agency.titheMonthly - agency.costBasisJunAug).toBe(agency.monthlySurplusJunAug);
    expect(agency.fee - agency.titheMonthly - agency.costBasisSepOnward).toBe(agency.monthlySurplusSepOnward);
  });

  it("capital recovery: $112k retired in ~8 months at the post-tithe $90k/mo fee (Northern Band roster adds one month)", () => {
    expect(agency.capitalRecoveryAmount).toBe(112000);
    expect(agency.capitalRecoveryMonths).toBe(8);
    expect(agency.capitalRecoveryStartLabel).toBe("Jun 2026");
    expect(agency.capitalRecoveryEndLabel).toContain("Jan 2027");
  });

  it("Brightside Launch Month: February 2027 (slipped one month by the Northern Band roster), $28k spend, $12,992 short", () => {
    expect(agency.brightsideLaunchMonthLabel).toContain("February 2027");
    expect(agency.brightsidePrelaunchSpend).toBe(28000);
    expect(agency.brightsideLaunchSurplus).toBe(15008);
    expect(agency.brightsideLaunchRemainder).toBe(-12992);
    expect(
      agency.brightsideLaunchSurplus - agency.brightsidePrelaunchSpend,
    ).toBe(agency.brightsideLaunchRemainder);
  });

  it("Phase 3 split renormalises 50/25/25 → 75/25 (Reserve / Innovation only) across 9 months", () => {
    expect(agency.reservePct).toBe(75);
    expect(agency.innovationPct).toBe(25);
    expect(agency.reservePct + agency.innovationPct).toBe(100);
    expect(agency.phase3Months).toBe(9);
    expect(agency.phase3MonthlySurplus).toBe(15008);
    expect(agency.reserveMonthly).toBe(11256);
    expect(agency.innovationMonthly).toBe(3752);
    expect(agency.reserveMonthly + agency.innovationMonthly).toBe(
      agency.phase3MonthlySurplus,
    );
    // Giving is no longer a Phase 3 split share — it's a tithe-first claim.
    expect(agency).not.toHaveProperty("givingPct");
    expect(agency).not.toHaveProperty("givingMonthly");
    expect(agency).not.toHaveProperty("givingTotal");
  });

  it("Phase 3 totals: $101,304 Reserve / $33,768 Innovation (Giving is taken at the top, not at Phase 3)", () => {
    expect(agency.reserveTotal).toBe(101304);
    expect(agency.innovationTotal).toBe(33768);
  });

  it("Phase 3 invariants: totals derive from monthly × months exactly; phase3MonthlySurplus matches Sep-onward post-tithe surplus", () => {
    expect(agency.reserveTotal).toBe(agency.reserveMonthly * agency.phase3Months);
    expect(agency.innovationTotal).toBe(agency.innovationMonthly * agency.phase3Months);
    expect(agency.phase3MonthlySurplus).toBe(agency.monthlySurplusSepOnward);
  });

  it("practitioner salary: $252,000 across 18 months ($14k/mo × 18, Northern Band re-grade)", () => {
    expect(agency.practitionerSalary18mo).toBe(252000);
    expect(agency.roster[0].role).toBe("Practitioner / Lead");
    expect(agency.roster[0].monthlyLoaded).toBe(14000);
    expect(agency.roster[0].monthlyLoaded * agency.termMonths).toBe(
      agency.practitionerSalary18mo,
    );
  });

  it("reserve has all four declared purposes; tithe (Giving) direction is NW Ontario / Dryden–Northern Band", () => {
    expect(agency.reservePurposes).toBe(SHARED_RESERVE_PURPOSES);
    expect(agency.reservePurposes).toHaveLength(4);
    expect(agency.givingDirection).toBe(SHARED_GIVING_DIRECTION);
    expect(agency.givingDirection).toContain("NW Ontario");
    expect(agency.givingDirection).toContain("Dryden–Northern Band");
  });
});

describe("V3 18-month surplus deployment math — tithe-first, adds up to $276,444", () => {
  const agency = SCENARIO_V3.contracts.agency;
  const totals = agency.totals18mo;

  it("revenue: $90k × 18 = $1,620,000", () => {
    expect(totals.revenue).toBe(1620000);
    expect(agency.fee * agency.termMonths).toBe(totals.revenue);
  });

  it("tithe: 10% of revenue × 18 mo = $162,000 (top of the waterfall)", () => {
    expect(totals.tithe).toBe(162000);
    expect(totals.revenue * 0.10).toBe(totals.tithe);
    expect(totals.tithe).toBe(agency.titheTotal);
  });

  it("payroll: $53,500 × 18 = $963,000", () => {
    expect(totals.payroll).toBe(963000);
    expect(agency.payrollTotal * agency.termMonths).toBe(totals.payroll);
  });

  it("overheads: 3 × $10,392 + 15 × $12,492 = $218,556", () => {
    expect(totals.overheads).toBe(218556);
    expect(
      3 * agency.overheadsJunAugTotal + 15 * agency.overheadsSepOnwardTotal,
    ).toBe(totals.overheads);
  });

  it("surplus deployed (post-tithe): $1,620,000 − $162,000 − $963,000 − $218,556 = $276,444", () => {
    expect(totals.surplusDeployed).toBe(276444);
    expect(totals.revenue - totals.tithe - totals.payroll - totals.overheads).toBe(276444);
  });

  it("deployment components reconcile to post-tithe surplus within ~$10k (Brightside-launch overrun absorbed by Feb–Oct splits + month-boundary rounding)", () => {
    const componentsSum =
      totals.capitalRecovery +
      totals.brightsidePrelaunch +
      totals.reserve +
      totals.innovation;
    expect(Math.abs(componentsSum - totals.surplusDeployed)).toBeLessThanOrEqual(10000);
  });

  it("Giving is no longer a Phase 3 deployment slice (totals18mo.giving is removed in favour of totals18mo.tithe)", () => {
    expect(totals).not.toHaveProperty("giving");
    expect(totals).toHaveProperty("tithe");
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

  it("surplus deployment is tithe-first: 10% off the top of $120k revenue = $12k tithe, then $46k cost, then 50/50 split on the $62k that remains", () => {
    expect(bs.surplusDeployment.revenue).toBe(120000);
    expect(bs.surplusDeployment.tithePct).toBe(10);
    expect(bs.surplusDeployment.tithe).toBe(12000);
    expect(bs.surplusDeployment.revenueAfterTithe).toBe(108000);
    expect(bs.surplusDeployment.cost).toBe(46000);
    expect(bs.surplusDeployment.surplus).toBe(62000);
    // Math: revenue − tithe − cost = surplus.
    expect(
      bs.surplusDeployment.revenue -
        bs.surplusDeployment.tithe -
        bs.surplusDeployment.cost,
    ).toBe(bs.surplusDeployment.surplus);
    // 50/50 split on what's left.
    expect(bs.surplusDeployment.retainedPct).toBe(50);
    expect(bs.surplusDeployment.ownerTakePct).toBe(50);
    expect(bs.surplusDeployment.retained).toBe(31000);
    expect(bs.surplusDeployment.ownerTake).toBe(31000);
    expect(bs.surplusDeployment.retained + bs.surplusDeployment.ownerTake).toBe(
      bs.surplusDeployment.surplus,
    );
  });

  it("downside coverage: max exposure $46k ≈ 36% of $126,155 Innovation bucket (V2-era number kept as a reference frame)", () => {
    expect(bs.downsideCoverage.sourceAmount).toBe(126155);
    expect(bs.downsideCoverage.maxExposure).toBe(46000);
    expect(bs.downsideCoverage.coveragePct).toBe(36);
  });
});

describe("V3 personal compensation — locked headline numbers (post-tithe-first revision)", () => {
  const personal = SCENARIO_V3.personal;

  it("$252k agency salary + $31k Brightside owner take = $283k total over 18 months (Brightside dropped from $37k → $31k under tithe-first)", () => {
    expect(personal.agencySalary18mo).toBe(252000);
    expect(personal.brightsideOwnerTake).toBe(31000);
    expect(personal.total18mo).toBe(283000);
    expect(personal.agencySalary18mo + personal.brightsideOwnerTake).toBe(
      personal.total18mo,
    );
    expect(personal.perYear).toBe(188667);
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
  // Source of truth: .local/tasks/task-174.md plus the Northern Band roster sync
  // on 2026-04-28 (same 7-role roster as V3, only the fee differs).
  const agency = SCENARIO_V4.contracts.agency;

  it("engagement structure: $105k/mo fee, 18-month term, renegotiated at month 12", () => {
    expect(agency.fee).toBe(105000);
    expect(agency.termMonths).toBe(18);
    expect(agency.renegotiateMonth).toBe(12);
    expect(agency.startDate).toBe("June 1, 2026");
  });

  it("payroll: 7 Northern Band roles totalling $53,500/mo (same roster as V3)", () => {
    expect(agency.roster).toHaveLength(7);
    expect(agency.payrollTotal).toBe(53500);
    expect(agency.roster.reduce((s, r) => s + r.monthlyLoaded, 0)).toBe(53500);
    expect(agency.payrollTotal).toBe(SCENARIO_V3.contracts.agency.payrollTotal);
  });

  it("roster role names match the locked 7-role Northern Band roster (same as V3)", () => {
    const roles = agency.roster.map((r) => r.role);
    expect(roles).toEqual([
      "Practitioner / Lead",
      "Hub Coordinator (Dryden)",
      "IT / Tech",
      "Community Development Associate",
      "Food Handler (Dryden depot)",
      "Junior Analyst / Field",
      "Bookkeeper / Admin",
    ]);
    expect(roles).toEqual(SCENARIO_V3.contracts.agency.roster.map((r) => r.role));
  });

  it("overheads: held identical to V3 ($10,392 Jun–Aug, $12,492 Sep+)", () => {
    expect(agency.overheadsJunAugTotal).toBe(SHARED_OVERHEADS_JUN_AUG_TOTAL);
    expect(agency.overheadsSepOnwardTotal).toBe(SHARED_OVERHEADS_SEP_ONWARD_TOTAL);
  });

  it("tithe is 10% of revenue, top of waterfall: $10,500/mo, $189,000 over 18 months", () => {
    expect(agency.tithePct).toBe(10);
    expect(agency.titheMonthly).toBe(10500);
    expect(agency.titheTotal).toBe(189000);
    expect(agency.fee * 0.10).toBe(agency.titheMonthly);
    expect(agency.titheMonthly * agency.termMonths).toBe(agency.titheTotal);
  });

  it("cost basis: $63,892 / $65,992; post-tithe surplus $30,608 / $28,508", () => {
    expect(agency.costBasisJunAug).toBe(63892);
    expect(agency.costBasisSepOnward).toBe(65992);
    expect(agency.monthlySurplusJunAug).toBe(30608);
    expect(agency.monthlySurplusSepOnward).toBe(28508);
    // Surplus is post-tithe.
    expect(agency.fee - agency.titheMonthly - agency.costBasisJunAug).toBe(agency.monthlySurplusJunAug);
    expect(agency.fee - agency.titheMonthly - agency.costBasisSepOnward).toBe(agency.monthlySurplusSepOnward);
  });

  it("Sep-onward operating margin (pre-tithe) lands in the 35–40% target band (37.2%) — that's the structural right-priced metric", () => {
    // Operating margin = fee minus operating cost basis only. The tithe is a
    // policy decision sitting above the surplus waterfall and does not count
    // against the engagement's "right-priced" margin.
    const marginPct = ((agency.fee - agency.costBasisSepOnward) / agency.fee) * 100;
    expect(marginPct).toBeGreaterThanOrEqual(35);
    expect(marginPct).toBeLessThanOrEqual(45);
    expect(Math.round(marginPct * 10) / 10).toBe(37.2);
  });

  it("post-tithe surplus margin is ~27.2% (the headline for what's actually deployable after Giving)", () => {
    const postTithePct = (agency.monthlySurplusSepOnward / agency.fee) * 100;
    expect(Math.round(postTithePct * 10) / 10).toBe(27.2);
  });

  it("capital recovery: $112k retired in 4 months (Jun–Sep 2026) at the post-tithe surplus", () => {
    expect(agency.capitalRecoveryAmount).toBe(112000);
    expect(agency.capitalRecoveryMonths).toBe(4);
    expect(agency.capitalRecoveryStartLabel).toBe("Jun 2026");
    expect(agency.capitalRecoveryEndLabel).toContain("Sep 2026");
  });

  it("Brightside Launch Month: October 2026 (unchanged from V4 baseline), $28k spend, $508 remainder", () => {
    expect(agency.brightsideLaunchMonthLabel).toContain("October 2026");
    expect(agency.brightsidePrelaunchSpend).toBe(28000);
    expect(agency.brightsideLaunchSurplus).toBe(28508);
    expect(agency.brightsideLaunchRemainder).toBe(508);
    expect(
      agency.brightsideLaunchSurplus - agency.brightsidePrelaunchSpend,
    ).toBe(agency.brightsideLaunchRemainder);
  });

  it("Phase 3 split renormalises 50/25/25 → 75/25 (Reserve / Innovation only) across 13 months", () => {
    expect(agency.reservePct).toBe(75);
    expect(agency.innovationPct).toBe(25);
    expect(agency.reservePct + agency.innovationPct).toBe(100);
    expect(agency.phase3Months).toBe(13);
    expect(agency.phase3MonthlySurplus).toBe(28508);
    expect(agency.reserveMonthly).toBe(21381);
    expect(agency.innovationMonthly).toBe(7127);
    expect(agency.reserveMonthly + agency.innovationMonthly).toBe(
      agency.phase3MonthlySurplus,
    );
    expect(agency).not.toHaveProperty("givingPct");
    expect(agency).not.toHaveProperty("givingMonthly");
    expect(agency).not.toHaveProperty("givingTotal");
  });

  it("Phase 3 totals: $277,953 Reserve / $92,651 Innovation (Giving taken at the top as tithe)", () => {
    expect(agency.reserveTotal).toBe(277953);
    expect(agency.innovationTotal).toBe(92651);
  });

  it("Phase 3 invariants: totals derive from monthly × months exactly; phase3MonthlySurplus matches Sep-onward post-tithe surplus", () => {
    expect(agency.reserveTotal).toBe(agency.reserveMonthly * agency.phase3Months);
    expect(agency.innovationTotal).toBe(agency.innovationMonthly * agency.phase3Months);
    expect(agency.phase3MonthlySurplus).toBe(agency.monthlySurplusSepOnward);
  });

  it("practitioner salary unchanged from the Northern Band re-grade: $252,000 across 18 months ($14k/mo × 18)", () => {
    expect(agency.practitionerSalary18mo).toBe(252000);
    expect(agency.roster[0].role).toBe("Practitioner / Lead");
    expect(agency.roster[0].monthlyLoaded).toBe(14000);
    expect(agency.roster[0].monthlyLoaded * agency.termMonths).toBe(
      agency.practitionerSalary18mo,
    );
  });

  it("reserve purposes and giving direction sourced from SHARED constants", () => {
    expect(agency.reservePurposes).toBe(SHARED_RESERVE_PURPOSES);
    expect(agency.givingDirection).toBe(SHARED_GIVING_DIRECTION);
  });
});

describe("V4 18-month surplus deployment math — tithe-first, adds up to $519,444", () => {
  const agency = SCENARIO_V4.contracts.agency;
  const totals = agency.totals18mo;

  it("revenue: $105k × 18 = $1,890,000", () => {
    expect(totals.revenue).toBe(1890000);
    expect(agency.fee * agency.termMonths).toBe(totals.revenue);
  });

  it("tithe: 10% of revenue × 18 mo = $189,000 (top of the waterfall)", () => {
    expect(totals.tithe).toBe(189000);
    expect(totals.revenue * 0.10).toBe(totals.tithe);
    expect(totals.tithe).toBe(agency.titheTotal);
  });

  it("payroll: $53,500 × 18 = $963,000 (same as V3)", () => {
    expect(totals.payroll).toBe(963000);
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

  it("surplus deployed (post-tithe): $1,890,000 − $189,000 − $963,000 − $218,556 = $519,444", () => {
    expect(totals.surplusDeployed).toBe(519444);
    expect(totals.revenue - totals.tithe - totals.payroll - totals.overheads).toBe(519444);
  });

  it("V4 post-tithe surplus exceeds V3 by $243,000 (price-discipline delta on the same roster, after the larger tithe)", () => {
    // 18 × $15,000 fee delta = $270,000 more revenue.
    // 18 × $1,500 tithe delta = $27,000 more giving.
    // Net surplus delta = $270,000 − $27,000 = $243,000.
    expect(totals.surplusDeployed - SCENARIO_V3.contracts.agency.totals18mo.surplusDeployed).toBe(243000);
  });

  it("V4 tithe exceeds V3 tithe by $27,000 (10% of the $270k revenue delta)", () => {
    expect(totals.tithe - SCENARIO_V3.contracts.agency.totals18mo.tithe).toBe(27000);
  });

  it("deployment components reconcile to post-tithe surplus within ~$30k (Sep cap-recovery trickle + Oct launch remainder)", () => {
    const componentsSum =
      totals.capitalRecovery +
      totals.brightsidePrelaunch +
      totals.reserve +
      totals.innovation;
    expect(Math.abs(totals.surplusDeployed - componentsSum)).toBeLessThanOrEqual(30000);
  });

  it("Giving is no longer a Phase 3 deployment slice (totals18mo.giving is removed in favour of totals18mo.tithe)", () => {
    expect(totals).not.toHaveProperty("giving");
    expect(totals).toHaveProperty("tithe");
  });
});

describe("V4 personal compensation — unchanged from V3 baseline (post-tithe-first revision)", () => {
  const personal = SCENARIO_V4.personal;

  it("$252k agency salary + $31k Brightside owner take = $283k total (same as V3 under tithe-first)", () => {
    expect(personal.agencySalary18mo).toBe(252000);
    expect(personal.brightsideOwnerTake).toBe(31000);
    expect(personal.total18mo).toBe(283000);
    expect(personal.agencySalary18mo + personal.brightsideOwnerTake).toBe(
      personal.total18mo,
    );
    expect(personal.perYear).toBe(188667);
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

describe("V3 ↔ V4 invariants — Salts and Brightside are the SAME object (cannot drift)", () => {
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

describe("Scenario registry — V7 is the locked default; V6 and V5 are historical baselines; V3 retained for migration / Compare anchor only", () => {
  it("SCENARIOS contains v3, v4, v5, v6, and v7 (V2 retired; V3 retained as workspace anchor; V5/V6 retained as historical baselines)", () => {
    expect(Object.keys(SCENARIOS).sort()).toEqual(["v3", "v4", "v5", "v6", "v7"]);
    expect(SCENARIOS.v3).toBe(SCENARIO_V3);
    expect(SCENARIOS.v4).toBe(SCENARIO_V4);
    expect(SCENARIOS.v5).toBe(SCENARIO_V5);
    expect(SCENARIOS.v6).toBe(SCENARIO_V6);
  });

  it("SCENARIO_ORDER contains only v7 (single source of truth — Prior tabs removed)", () => {
    expect(SCENARIO_ORDER).toEqual(["v7"]);
    expect(SCENARIO_ORDER).not.toContain("v3");
    expect(SCENARIO_ORDER).not.toContain("v4");
    expect(SCENARIO_ORDER).not.toContain("v5");
    expect(SCENARIO_ORDER).not.toContain("v6");
  });

  it("DEFAULT_SCENARIO_ID is v7 (updated rates applied to Northern Band)", () => {
    expect(DEFAULT_SCENARIO_ID).toBe("v7");
  });
});

describe("V5 — Codetry archetype (Northern Band) — locked headline numbers", () => {
  // Source of truth: .local/tasks/practitioners-guide-v5.md plus the
  // 2026-04-29 spec note in v5.ts. V5 is the new default operating
  // framework; the rest of the guide reads from V5.
  const agency = SCENARIO_V5.contracts.agency;

  it("engagement structure: $90k/mo fee, 12-month term, renegotiated at month 12", () => {
    expect(agency.fee).toBe(90000);
    expect(agency.termMonths).toBe(12);
    expect(agency.renegotiateMonth).toBe(12);
    expect(agency.startDate).toBe("June 1, 2026");
  });

  it("payroll: 4-role Day-1 team totalling $43,500/mo (leaner than the V3/V4 7-role roster)", () => {
    expect(agency.roster).toHaveLength(4);
    expect(agency.payrollTotal).toBe(43500);
    expect(agency.roster.reduce((s, r) => s + r.monthlyLoaded, 0)).toBe(43500);
  });

  it("roster: lead $18k, ops & food (Dryden) $13.5k, code reviewer $9.5k, bookkeeper $2.5k on the Day-1 cost basis", () => {
    const roles = agency.roster.map((r) => r.role);
    expect(roles).toEqual([
      "Practitioner / Lead",
      "Operations & Food (Dryden)",
      "Code Reviewer",
      "Bookkeeper / Admin",
    ]);
    // V3/V4 roles that are NOT on the Day-1 cost basis under V5. They are
    // not removed from the planning surface — they're deferred and gated
    // against the month-12 renegotiation triggers (and may reappear or get
    // reassigned to the Software/Sales archetype once a trigger fires).
    // Asserting they're absent from the Day-1 roster (only) is what locks
    // the leaner Day-1 cost basis in place.
    expect(roles).not.toContain("IT / Tech");
    expect(roles).not.toContain("Community Development Associate");
    expect(roles).not.toContain("Junior Analyst / Field");
    // The deferred roles must be named explicitly in the rosterTag prose so
    // the planning surface keeps them visible (gated, not deleted).
    expect(agency.rosterTag.kind).toBe("confirmed");
    expect(agency.rosterTag.note).toContain("deferred");
    expect(agency.rosterTag.note).toContain("renegotiation");
    expect(agency.rosterTag.note).toContain("IT/Tech");
    expect(agency.rosterTag.note).toContain("Community Development");
    expect(agency.rosterTag.note).toContain("Junior Analyst");
    // Lead draw is the V5 lift from $14k to $18k.
    expect(agency.roster[0].monthlyLoaded).toBe(18000);
  });

  it("tithe is 10% of revenue, top of waterfall: $9,000/mo, $108,000 over 12 months", () => {
    expect(agency.tithePct).toBe(10);
    expect(agency.titheMonthly).toBe(9000);
    expect(agency.titheTotal).toBe(108000);
    expect(agency.fee * 0.10).toBe(agency.titheMonthly);
    expect(agency.titheMonthly * agency.termMonths).toBe(agency.titheTotal);
  });

  it("cost basis: $53,892 Jun–Aug, $55,992 Sep+; post-tithe surplus $27,108 / $25,008", () => {
    expect(agency.costBasisJunAug).toBe(53892);
    expect(agency.costBasisSepOnward).toBe(55992);
    expect(agency.monthlySurplusJunAug).toBe(27108);
    expect(agency.monthlySurplusSepOnward).toBe(25008);
    expect(agency.fee - agency.titheMonthly - agency.costBasisJunAug).toBe(
      agency.monthlySurplusJunAug,
    );
    expect(agency.fee - agency.titheMonthly - agency.costBasisSepOnward).toBe(
      agency.monthlySurplusSepOnward,
    );
  });

  it("family-infusion recovery: $40,000 leg of Capital Recovery paid in month 1; tax-free debt repayment, NOT a signing bonus / NOT compensation", () => {
    expect(agency.familyInfusionRecovery).toBe(40000);
    expect(agency.familyInfusionRecoveryTag.kind).toBe("confirmed");
    expect(agency.familyInfusionRecoveryDescription).toContain("$40,000");
    expect(agency.familyInfusionRecoveryDescription.toLowerCase()).toContain("month 1");
    // Tax-character invariants — these phrases must appear in the description
    // so the substance is locked at the data layer (not just the page copy).
    // If a future relabel back to "signing bonus" / "compensation" is
    // attempted, this guard fires.
    const desc = agency.familyInfusionRecoveryDescription.toLowerCase();
    expect(desc).toContain("tax-free");
    expect(desc).toContain("not compensation");
    expect(desc).toContain("not income");
    expect(desc).toContain("not a deductible");
  });

  it("capital recovery (business-loan leg): $72k bank-loan leg only (V3/V4 carried the same $112k stack as one undivided line)", () => {
    expect(agency.capitalRecoveryAmount).toBe(72000);
    expect(agency.capitalRecoveryDescription.toLowerCase()).toContain("bank-loan");
    expect(agency.capitalRecoveryStartLabel.toLowerCase()).toContain("aug");
    expect(agency.capitalRecoveryEndLabel.toLowerCase()).toContain("oct");
    // Family-infusion + bank-loan legs together retire the same $112k stack
    // V3/V4 carried as one undivided Capital Recovery line — substance is
    // identical, only the visual presentation differs.
    expect(agency.familyInfusionRecovery + agency.capitalRecoveryAmount).toBe(112000);
  });

  it("Brightside Launch Month phase is dropped from the agency waterfall (zeroed); Brightside pre-launch is funded out of Innovation in Phase 3", () => {
    expect(agency.brightsidePrelaunchSpend).toBe(0);
    expect(agency.brightsideLaunchSurplus).toBe(0);
    expect(agency.brightsideLaunchRemainder).toBe(0);
    expect(agency.brightsideLaunchMonthLabel.toLowerCase()).toContain("none");
  });

  it("team incentives: visible-but-TBD line surfaces the Christmas-bonus / perks bucket without pinning the dollar amount yet", () => {
    expect(agency.teamIncentivesName).toContain("Team incentives");
    expect(agency.teamIncentivesAmount).toBeNull();
    expect(agency.teamIncentivesTag.kind).toBe("confirmed");
  });

  it("Phase 3 split stays 75/25 across 7 months (Nov 2026 → May 2027) at the post-tithe Sep-onward surplus", () => {
    expect(agency.reservePct).toBe(75);
    expect(agency.innovationPct).toBe(25);
    expect(agency.phase3Months).toBe(7);
    expect(agency.phase3MonthlySurplus).toBe(25008);
    expect(agency.phase3MonthlySurplus).toBe(agency.monthlySurplusSepOnward);
  });

  it("Phase 3 totals reconcile to the Phase 3 budget (post-tithe surplus minus both Capital Recovery legs)", () => {
    const phase3Budget =
      agency.totals18mo.surplusDeployed -
      agency.totals18mo.familyInfusionRecovery -
      agency.totals18mo.capitalRecovery;
    expect(phase3Budget).toBe(194396);
    expect(agency.reserveTotal + agency.innovationTotal).toBe(phase3Budget);
    expect(agency.reserveTotal).toBe(145797);
    expect(agency.innovationTotal).toBe(48599);
  });

  it("renegotiation triggers reset to the $90k baseline (step UP to V4 right-priced and beyond)", () => {
    const triggers = agency.renegotiationTriggers;
    expect(triggers.length).toBe(2);
    // First trigger lifts to V4 right-priced ($105k / $22k draw).
    expect(triggers[0].feeStepTo).toBe(105000);
    expect(triggers[0].drawStepTo).toBe(22000);
    // Each step monotonically escalates from the V5 baseline.
    expect(triggers[0].feeStepTo).toBeGreaterThan(agency.fee);
    expect(triggers[1].feeStepTo).toBeGreaterThanOrEqual(triggers[0].feeStepTo);
    expect(triggers[1].drawStepTo).toBeGreaterThanOrEqual(triggers[0].drawStepTo);
  });

  it("practitioner salary: $216,000 across 12 months ($18k/mo × 12, V5 lead-draw lift)", () => {
    expect(agency.practitionerSalary18mo).toBe(216000);
    expect(agency.roster[0].monthlyLoaded * agency.termMonths).toBe(
      agency.practitionerSalary18mo,
    );
  });
});

describe("V5 12-month surplus deployment math — tithe-first, family-infusion-second, adds up to $306,396", () => {
  const agency = SCENARIO_V5.contracts.agency;
  const totals = agency.totals18mo;

  it("revenue: $90k × 12 = $1,080,000", () => {
    expect(totals.revenue).toBe(1080000);
    expect(agency.fee * agency.termMonths).toBe(totals.revenue);
  });

  it("tithe: 10% of revenue × 12 mo = $108,000 (top of the waterfall)", () => {
    expect(totals.tithe).toBe(108000);
    expect(totals.revenue * 0.10).toBe(totals.tithe);
    expect(totals.tithe).toBe(agency.titheTotal);
  });

  it("payroll: $43,500 × 12 = $522,000", () => {
    expect(totals.payroll).toBe(522000);
    expect(agency.payrollTotal * agency.termMonths).toBe(totals.payroll);
  });

  it("overheads: 3 × $10,392 + 9 × $12,492 = $143,604 (12-month window, not 18)", () => {
    expect(totals.overheads).toBe(143604);
    expect(
      3 * agency.overheadsJunAugTotal + 9 * agency.overheadsSepOnwardTotal,
    ).toBe(totals.overheads);
  });

  it("surplus deployed (post-tithe): $1,080,000 − $108,000 − $522,000 − $143,604 = $306,396", () => {
    expect(totals.surplusDeployed).toBe(306396);
    expect(totals.revenue - totals.tithe - totals.payroll - totals.overheads).toBe(306396);
  });

  it("totals18mo carries the family-infusion-recovery leg ($40k) and the V5 bank-loan capital-recovery leg ($72k); brightsidePrelaunch is 0 under V5", () => {
    expect(totals.familyInfusionRecovery).toBe(40000);
    expect(totals.capitalRecovery).toBe(72000);
    expect(totals.brightsidePrelaunch).toBe(0);
    // The two Capital Recovery legs together retire the same $112k stack
    // V3/V4 carried as one undivided line — a hard-locked invariant on the
    // substance of the relabel.
    expect(totals.familyInfusionRecovery + totals.capitalRecovery).toBe(112000);
  });

  it("deployment components (family-infusion + cap recovery + brightside + reserve + innovation) reconcile exactly to surplus deployed", () => {
    const componentsSum =
      totals.familyInfusionRecovery +
      totals.capitalRecovery +
      totals.brightsidePrelaunch +
      totals.reserve +
      totals.innovation;
    expect(componentsSum).toBe(totals.surplusDeployed);
  });

  it("Giving is taken at the top as tithe (totals18mo.giving is removed in favour of totals18mo.tithe)", () => {
    expect(totals).not.toHaveProperty("giving");
    expect(totals).toHaveProperty("tithe");
  });
});

describe("V5 personal compensation — locked headline numbers", () => {
  const personal = SCENARIO_V5.personal;
  const agency = SCENARIO_V5.contracts.agency;

  it("$216k agency salary + $31k Brightside owner take = $247k total over 12 months", () => {
    expect(personal.agencySalary18mo).toBe(216000);
    expect(personal.brightsideOwnerTake).toBe(31000);
    expect(personal.total18mo).toBe(247000);
    expect(personal.agencySalary18mo + personal.brightsideOwnerTake).toBe(
      personal.total18mo,
    );
    // Per-year equals total because the engagement window is 12 months exactly.
    expect(personal.perYear).toBe(247000);
  });

  it("$72k Capital Recovery (loan only) is flagged as debt repayment, NOT income", () => {
    expect(personal.capitalRecovery).toBe(72000);
    expect(personal.capitalRecovery).toBe(agency.capitalRecoveryAmount);
    // Capital Recovery must NOT be folded into the personal-cash total.
    expect(personal.total18mo).not.toBe(
      personal.agencySalary18mo +
        personal.brightsideOwnerTake +
        personal.capitalRecovery,
    );
  });

  it("Family-infusion recovery ($40k) is carried on the agency line as tax-free debt repayment to the husband — NOT in personal.total18mo (money never lands in Bobbie's accounts)", () => {
    expect(agency.familyInfusionRecovery).toBe(40000);
    expect(personal.total18mo).not.toBe(
      personal.agencySalary18mo + personal.brightsideOwnerTake + agency.familyInfusionRecovery,
    );
  });
});

describe("V3 ↔ V4 ↔ V5 ↔ V6 invariants — Salts and Brightside are the SAME object across all four (cannot drift)", () => {
  it("Salts bucket is the SHARED_SALTS object across V3, V4, V5, and V6", () => {
    expect(SCENARIO_V3.salts).toBe(SHARED_SALTS);
    expect(SCENARIO_V4.salts).toBe(SHARED_SALTS);
    expect(SCENARIO_V5.salts).toBe(SHARED_SALTS);
    expect(SCENARIO_V6.salts).toBe(SHARED_SALTS);
  });

  it("Brightside bucket is the SHARED_BRIGHTSIDE object across V3, V4, V5, and V6", () => {
    expect(SCENARIO_V3.brightside).toBe(SHARED_BRIGHTSIDE);
    expect(SCENARIO_V4.brightside).toBe(SHARED_BRIGHTSIDE);
    expect(SCENARIO_V5.brightside).toBe(SHARED_BRIGHTSIDE);
    expect(SCENARIO_V6.brightside).toBe(SHARED_BRIGHTSIDE);
  });

  it("V5 lead draw lifts to $18k/mo (above V3/V4 $14k/mo); brightside owner take stays identical across all scenarios", () => {
    expect(SCENARIO_V5.contracts.agency.roster[0].monthlyLoaded).toBeGreaterThan(
      SCENARIO_V3.contracts.agency.roster[0].monthlyLoaded,
    );
    expect(SCENARIO_V5.contracts.agency.roster[0].monthlyLoaded).toBe(18000);
    expect(SCENARIO_V3.contracts.agency.roster[0].monthlyLoaded).toBe(14000);
    expect(SCENARIO_V5.personal.brightsideOwnerTake).toBe(
      SCENARIO_V3.personal.brightsideOwnerTake,
    );
    expect(SCENARIO_V5.personal.brightsideOwnerTake).toBe(
      SHARED_BRIGHTSIDE.surplusDeployment.ownerTake,
    );
    expect(SCENARIO_V6.personal.brightsideOwnerTake).toBe(
      SHARED_BRIGHTSIDE.surplusDeployment.ownerTake,
    );
  });
});

describe("V6 — Hourly subcontract (Northern Band) — locked headline numbers", () => {
  // Source of truth: v6.ts spec note + 2026-05-02 confirmed numbers.
  // Bobbie $150/hr × 160 hr/mo = $24,000 billed; nets $80/hr = $12,800 draw.
  // Tyler $70/hr × 160 hr/mo = $11,200 billed/paid (pass-through subcontract).
  // Total monthly billed: $35,200. Tithe 10% = $3,520. Lean overheads $1,292.
  // Monthly surplus: $35,200 - $3,520 - $12,800 - $11,200 - $1,292 = $6,388.
  const agency = SCENARIO_V6.contracts.agency;

  it("engagement structure: $35,200/mo total billed, 12-month term, starting June 1 2026", () => {
    expect(agency.fee).toBe(35200);
    expect(agency.termMonths).toBe(12);
    expect(agency.renegotiateMonth).toBe(12);
    expect(agency.startDate).toBe("June 1, 2026");
  });

  it("rates: Bobbie 160 hr × $150 = $24,000 billed; Tyler 160 hr × $70 = $11,200; total $35,200", () => {
    const bobbieBilled = 160 * 150; // 24,000
    const tylerBilled  = 160 * 70;  // 11,200
    expect(bobbieBilled + tylerBilled).toBe(agency.fee);
    expect(bobbieBilled + tylerBilled).toBe(35200);
  });

  it("roster: 2-person lean team (Bobbie $12,800 net draw + Tyler $11,200 sub pass-through)", () => {
    expect(agency.roster).toHaveLength(2);
    expect(agency.roster[0].role).toBe("Practitioner / Lead (Bobbie)");
    expect(agency.roster[1].role).toBe("Distribution (Tyler — RFF subcontract)");
    expect(agency.roster[0].monthlyLoaded).toBe(12800); // Bobbie net draw
    expect(agency.roster[1].monthlyLoaded).toBe(11200); // Tyler sub
  });

  it("payrollTotal is combined draws: Bobbie $12,800 + Tyler $11,200 = $24,000", () => {
    expect(agency.payrollTotal).toBe(24000);
    expect(agency.roster[0].monthlyLoaded + agency.roster[1].monthlyLoaded).toBe(
      agency.payrollTotal,
    );
  });

  it("tithe: 10% of $35,200 = $3,520/mo; $42,240 over 12 months", () => {
    expect(agency.tithePct).toBe(10);
    expect(agency.titheMonthly).toBe(3520);
    expect(agency.titheTotal).toBe(42240);
    expect(agency.fee * 0.10).toBe(agency.titheMonthly);
    expect(agency.titheMonthly * agency.termMonths).toBe(agency.titheTotal);
  });

  it("lean overheads: $1,292/mo (space $500 + insurance/petty $500 + accountant $125 + legal $167)", () => {
    expect(agency.overheadsJunAugTotal).toBe(1292);
    expect(agency.overheadsSepOnwardTotal).toBe(1292); // same — lean OH does not step up
    const items = agency.overheadsJunAug;
    expect(items.find((o) => o.name.includes("Space"))?.monthly).toBe(500);
    expect(items.find((o) => o.name.includes("Insurance"))?.monthly).toBe(500);
    expect(items.find((o) => o.name.includes("Accountant"))?.monthly).toBe(125);
    expect(items.find((o) => o.name.includes("Legal"))?.monthly).toBe(167);
    expect(items.reduce((s, o) => s + o.monthly, 0)).toBe(1292);
  });

  it("monthly surplus: $35,200 - $3,520 tithe - $12,800 Bobbie - $11,200 Tyler - $1,292 OH = $6,388", () => {
    expect(agency.monthlySurplusJunAug).toBe(6388);
    expect(agency.monthlySurplusSepOnward).toBe(6388);
    expect(
      agency.fee - agency.titheMonthly - agency.roster[0].monthlyLoaded -
      agency.roster[1].monthlyLoaded - agency.overheadsJunAugTotal,
    ).toBe(6388);
  });

  it("V6 carries no family-infusion or capital-recovery leg inside the engagement waterfall", () => {
    expect(agency.familyInfusionRecovery).toBe(0);
    expect(agency.capitalRecoveryAmount).toBe(0);
    expect(agency.capitalRecoveryMonths).toBe(0);
    expect(agency.brightsidePrelaunchSpend).toBe(0);
    expect(agency.phase3Months).toBe(0);
  });

  it("V6 scenario status is locked; id is 'v6'", () => {
    expect(SCENARIO_V6.id).toBe("v6");
    expect(SCENARIO_V6.status).toBe("locked");
  });
});

describe("V6 12-month surplus deployment math — $422,400 revenue, $76,656 surplus", () => {
  const agency = SCENARIO_V6.contracts.agency;
  const totals = agency.totals18mo;

  it("revenue: $35,200 × 12 = $422,400", () => {
    expect(totals.revenue).toBe(422400);
    expect(agency.fee * agency.termMonths).toBe(totals.revenue);
  });

  it("tithe: 10% × 12 mo = $42,240", () => {
    expect(totals.tithe).toBe(42240);
    expect(totals.revenue * 0.10).toBe(totals.tithe);
  });

  it("payroll (Bobbie draw): $12,800 × 12 = $153,600", () => {
    expect(totals.payroll).toBe(153600);
    expect(agency.roster[0].monthlyLoaded * agency.termMonths).toBe(totals.payroll);
  });

  it("surplus deployed: $35,200 − $3,520 − $12,800 − $11,200 − $1,292) × 12 = $76,656", () => {
    expect(totals.surplusDeployed).toBe(76656);
    expect(agency.monthlySurplusJunAug * agency.termMonths).toBe(totals.surplusDeployed);
  });

  it("waterfall allocations are zero / TBD — not locked yet (capital recovery, reserve, innovation)", () => {
    expect(totals.familyInfusionRecovery).toBe(0);
    expect(totals.capitalRecovery).toBe(0);
    expect(totals.brightsidePrelaunch).toBe(0);
    expect(totals.reserve).toBe(0);
    expect(totals.innovation).toBe(0);
    expect(totals.tag.kind).toBe("tbd");
  });
});

describe("V6 personal compensation — locked headline numbers", () => {
  const personal = SCENARIO_V6.personal;

  it("Bobbie draw $153,600 (Phase 2 × 12 mo) + Brightside owner take $31,000 = $184,600 total", () => {
    expect(personal.agencySalary18mo).toBe(153600);
    expect(personal.brightsideOwnerTake).toBe(31000);
    expect(personal.total18mo).toBe(184600);
    expect(personal.agencySalary18mo + personal.brightsideOwnerTake).toBe(
      personal.total18mo,
    );
  });

  it("capital recovery is 0 — not carried inside the V6 engagement waterfall", () => {
    expect(personal.capitalRecovery).toBe(0);
  });

  it("Brightside owner take is sourced from SHARED_BRIGHTSIDE (cannot drift)", () => {
    expect(personal.brightsideOwnerTake).toBe(
      SHARED_BRIGHTSIDE.surplusDeployment.ownerTake,
    );
  });
});

describe("Contracts ledger export — term-aware (12 mo on V5; 18 mo on V3/V4)", () => {
  // Board-pack export must reconcile to the on-page numbers. The previous
  // exporter hardcoded 18-month framing (sheet name, overhead month-count
  // label, /1.5 annualization), which produced materially wrong board-pack
  // output under V5 (12-month term). These guards lock the term-aware
  // labels and arithmetic in place across all three scenarios.
  for (const sc of [SCENARIO_V3, SCENARIO_V4, SCENARIO_V5]) {
    const ledger = buildContractsLedger(sc);
    const a = sc.contracts.agency;
    const totalsSheet = ledger.sheets.find((s) =>
      s.name.startsWith("Agency — ") && s.name.endsWith("-mo totals"),
    );
    const compSheet = ledger.sheets.find(
      (s) => s.name === "Agency — practitioner pay",
    );

    it(`${sc.id}: totals sheet name reflects the engagement window (${a.termMonths}-mo)`, () => {
      expect(totalsSheet).toBeDefined();
      expect(totalsSheet!.name).toBe(`Agency — ${a.termMonths}-mo totals`);
    });

    it(`${sc.id}: overheads label reads "3 mo Jun–Aug + ${a.termMonths - 3} mo Sep+"`, () => {
      const overheadRow = totalsSheet!.rows.find(
        (r) => typeof r[0] === "string" && (r[0] as string).startsWith("Overheads"),
      );
      expect(overheadRow).toBeDefined();
      expect(overheadRow![0]).toBe(
        `Overheads (3 mo Jun–Aug + ${a.termMonths - 3} mo Sep+)`,
      );
    });

    it(`${sc.id}: implied $/yr is normalised by termMonths/12 (not hardcoded /1.5)`, () => {
      const impliedRow = compSheet!.rows.find((r) => r[0] === "Implied $/yr");
      expect(impliedRow).toBeDefined();
      const expected = Math.round(a.practitionerSalary18mo / (a.termMonths / 12));
      expect(impliedRow![1]).toBe(expected);
      // Spot-check V5 specifically: $216k / 1.0 yr = $216k (NOT $216k/1.5 = $144k).
      if (sc.id === "v5") expect(impliedRow![1]).toBe(216000);
    });

    // The Phase 3 row in the surplus-phases sheet must reconcile to the
    // Reserve + Innovation bucket totals shown immediately below it on the
    // same sheet. Previously this row reported phase3MonthlySurplus ×
    // phase3Months, which on V5 omitted the ~$19,340 Oct spillover and
    // produced a board-pack sheet that internally contradicted its own
    // Reserve + Innovation subtotals.
    it(`${sc.id}: Phase 3 ledger row amount equals Reserve + Innovation bucket totals on the same sheet (no internal contradiction)`, () => {
      const phasesSheet = ledger.sheets.find(
        (s) => s.name === "Agency — surplus phases",
      );
      expect(phasesSheet).toBeDefined();
      const phase3Row = phasesSheet!.rows.find(
        (r) => typeof r[0] === "string" && (r[0] as string).startsWith("Phase 3"),
      );
      const reserveRow = phasesSheet!.rows.find((r) => r[0] === "Reserve");
      const innovationRow = phasesSheet!.rows.find(
        (r) => r[0] === "Innovation / R&D",
      );
      expect(phase3Row).toBeDefined();
      expect(reserveRow).toBeDefined();
      expect(innovationRow).toBeDefined();
      expect(phase3Row![2]).toBe(
        (reserveRow![3] as number) + (innovationRow![3] as number),
      );
      expect(phase3Row![2]).toBe(a.reserveTotal + a.innovationTotal);
      // Spot-check V5 (the relabel target): 306,396 − 40,000 (family) − 72,000
      // (loan) − 0 (no Brightside launch on V5) = 194,396 deployed to Phase 3.
      if (sc.id === "v5") expect(phase3Row![2]).toBe(194396);
    });
  }
});

describe("Brightside ledger export — Surplus deployment sheet is tithe-first (matches the on-page math)", () => {
  // The on-page Brightside surplus is now: Revenue → Tithe (10%) → Cost
  // basis → Surplus → 50/50. The export must mirror that or board-pack
  // readers can't reconcile $120k → $46k → $62k without seeing the $12k
  // tithe step.
  for (const sc of [SCENARIO_V3, SCENARIO_V4, SCENARIO_V5]) {
    const ledger = buildBrightsideLedger(sc);
    const surplusSheet = ledger.sheets.find((s) => s.name === "Surplus deployment");

    it(`${sc.id}: surplus sheet shows tithe + revenue-after-tithe rows`, () => {
      expect(surplusSheet).toBeDefined();
      const rowLabels = surplusSheet!.rows.map((r) => String(r[0] ?? ""));
      expect(rowLabels.some((l) => l.startsWith("Tithe — Giving"))).toBe(true);
      expect(rowLabels).toContain("Revenue after tithe");
      expect(rowLabels).toContain("Surplus (post-tithe)");
    });

    it(`${sc.id}: tithe row is signed negative (subtraction) and equals SHARED_BRIGHTSIDE.tithe ($12,000)`, () => {
      const titheRow = surplusSheet!.rows.find(
        (r) => typeof r[0] === "string" && (r[0] as string).startsWith("Tithe — Giving"),
      );
      expect(titheRow).toBeDefined();
      expect(titheRow![1]).toBe(-SHARED_BRIGHTSIDE.surplusDeployment.tithe);
      expect(titheRow![1]).toBe(-12000);
    });

    it(`${sc.id}: revenue + tithe + cost reconciles to surplus (post-tithe) on the sheet`, () => {
      const numAt = (label: string) => {
        const row = surplusSheet!.rows.find((r) => r[0] === label);
        return row && typeof row[1] === "number" ? row[1] : 0;
      };
      const rev = numAt("Revenue (target)");
      const titheRow = surplusSheet!.rows.find(
        (r) => typeof r[0] === "string" && (r[0] as string).startsWith("Tithe — Giving"),
      );
      const tithe = (titheRow![1] as number); // signed negative
      const cost = numAt("Cost basis"); // signed negative
      const surplus = numAt("Surplus (post-tithe)");
      expect(rev + tithe + cost).toBe(surplus);
    });
  }
});
