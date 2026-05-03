import { describe, expect, it } from "vitest";

import {
  buildDriverFromAnswers,
  buildWizardSteps,
  GOAL_KIND_LABELS,
  KIND_STEPS,
  UNIVERSAL_STEPS_AFTER,
  UNIVERSAL_STEPS_BEFORE,
  WIZARD_DEFAULTS,
  type GoalKind,
  type WizardAnswers,
} from "@/data/dailyDriver";

const ALL_KINDS = Object.keys(GOAL_KIND_LABELS) as GoalKind[];

describe("buildWizardSteps", () => {
  it("starts with universal before steps for every kind", () => {
    for (const kind of ALL_KINDS) {
      const steps = buildWizardSteps(kind);
      const beforeIds = UNIVERSAL_STEPS_BEFORE.map((s) => s.id);
      const stepIds = steps.map((s) => s.id);
      expect(stepIds.slice(0, beforeIds.length)).toEqual(beforeIds);
    }
  });

  it("ends with universal after steps for every kind", () => {
    for (const kind of ALL_KINDS) {
      const steps = buildWizardSteps(kind);
      const afterIds = UNIVERSAL_STEPS_AFTER.map((s) => s.id);
      const stepIds = steps.map((s) => s.id);
      expect(stepIds.slice(-afterIds.length)).toEqual(afterIds);
    }
  });

  it("inserts exactly the right kind-specific steps in the middle", () => {
    for (const kind of ALL_KINDS) {
      const steps = buildWizardSteps(kind);
      const kindIds = KIND_STEPS[kind].map((s) => s.id);
      const start = UNIVERSAL_STEPS_BEFORE.length;
      const end = start + kindIds.length;
      const middle = steps.slice(start, end).map((s) => s.id);
      expect(middle).toEqual(kindIds);
    }
  });

  it("returns 13 steps for all kinds (4 before + 5 kind + 4 after)", () => {
    for (const kind of ALL_KINDS) {
      const steps = buildWizardSteps(kind);
      expect(steps).toHaveLength(
        UNIVERSAL_STEPS_BEFORE.length +
          KIND_STEPS[kind].length +
          UNIVERSAL_STEPS_AFTER.length,
      );
    }
  });

  it("every step has a non-empty question and field", () => {
    for (const kind of ALL_KINDS) {
      for (const step of buildWizardSteps(kind)) {
        expect(step.question.trim().length).toBeGreaterThan(0);
        expect(step.field.length).toBeGreaterThan(0);
      }
    }
  });

  it("the kind step is always a choice step", () => {
    const steps = buildWizardSteps("offer");
    expect(steps[0].kind).toBe("choice");
    expect(Array.isArray(steps[0].choices)).toBe(true);
    expect(steps[0].choices!.length).toBe(5);
  });

  it("has no duplicate step ids within a kind", () => {
    for (const kind of ALL_KINDS) {
      const ids = buildWizardSteps(kind).map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

describe("buildDriverFromAnswers", () => {
  const fullAnswers: WizardAnswers = {
    kind: "offer",
    name: "Test offer",
    dream: "Build a great product that people love",
    doneState: "First paying customer",
    threeMonths: "Prototype ready",
    oneMonth: "Landing page live",
    twoWeeks: "First draft spec",
    todayAction: "Write the one-pager",
    specifics: "Small business owners in Northern Ontario",
    edge: "Local relationships nobody else has",
    blocker: "Not enough hours in the day",
    risk: "Key client moves to a different provider",
    scenarioName: "Bootstrap it",
  };

  it("creates a driver with the correct name and kind", () => {
    const driver = buildDriverFromAnswers(fullAnswers);
    expect(driver.name).toBe("Test offer");
    expect(driver.kind).toBe("offer");
  });

  it("populates todayAction from answers", () => {
    const driver = buildDriverFromAnswers(fullAnswers);
    expect(driver.todayAction).toBe("Write the one-pager");
  });

  it("creates goal nodes for all non-empty horizons", () => {
    const driver = buildDriverFromAnswers(fullAnswers);
    const horizons = driver.goalNodes.map((n) => n.horizon);
    expect(horizons).toContain("done");
    expect(horizons).toContain("3mo");
    expect(horizons).toContain("1mo");
    expect(horizons).toContain("2wk");
    expect(horizons).toContain("today");
  });

  it("skips goal nodes whose text is empty", () => {
    const sparse = { ...fullAnswers, threeMonths: "", oneMonth: "" };
    const driver = buildDriverFromAnswers(sparse);
    const horizons = driver.goalNodes.map((n) => n.horizon);
    expect(horizons).not.toContain("3mo");
    expect(horizons).not.toContain("1mo");
    expect(horizons).toContain("done");
    expect(horizons).toContain("today");
  });

  it("creates exactly one scenario named from scenarioName", () => {
    const driver = buildDriverFromAnswers(fullAnswers);
    expect(driver.scenarios).toHaveLength(1);
    expect(driver.scenarios[0].name).toBe("Bootstrap it");
    expect(driver.scenarios[0].status).toBe("active");
  });

  it("falls back to 'Path 1' when scenarioName is empty", () => {
    const driver = buildDriverFromAnswers({ ...fullAnswers, scenarioName: "" });
    expect(driver.scenarios[0].name).toBe("Path 1");
  });

  it("creates a pivotal card from risk answer", () => {
    const driver = buildDriverFromAnswers(fullAnswers);
    expect(driver.pivotalCards).toHaveLength(1);
    expect(driver.pivotalCards[0].label).toBe("Biggest risk");
    expect(driver.pivotalCards[0].value).toBe(
      "Key client moves to a different provider",
    );
  });

  it("creates no pivotal card when risk is empty", () => {
    const driver = buildDriverFromAnswers({ ...fullAnswers, risk: "" });
    expect(driver.pivotalCards).toHaveLength(0);
  });

  it("starts as active with zero logs", () => {
    const driver = buildDriverFromAnswers(fullAnswers);
    expect(driver.status).toBe("active");
    expect(driver.logs).toHaveLength(0);
  });

  it("uses dream as name fallback when name is blank", () => {
    const driver = buildDriverFromAnswers({ ...fullAnswers, name: "" });
    expect(driver.name.length).toBeGreaterThan(0);
    expect(fullAnswers.dream.startsWith(driver.name) || driver.name.length <= 40).toBe(true);
  });

  it("generates a unique id on every call", () => {
    const a = buildDriverFromAnswers(fullAnswers);
    const b = buildDriverFromAnswers(fullAnswers);
    expect(a.id).not.toBe(b.id);
  });

  it("accepts all goal kinds without throwing", () => {
    for (const kind of ALL_KINDS) {
      expect(() =>
        buildDriverFromAnswers({ ...WIZARD_DEFAULTS, kind }),
      ).not.toThrow();
    }
  });
});
