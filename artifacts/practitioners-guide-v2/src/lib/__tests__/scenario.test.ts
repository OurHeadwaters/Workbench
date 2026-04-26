import { describe, it, expect } from "vitest";
import {
  migrateStoredScenario,
  shouldOpenWithV4OnFirstVisit,
} from "../scenario";

/**
 * Storage migration + page-default contracts for ScenarioProvider.
 *
 * These tests pin down two things that the code review for task #174
 * called out:
 *  1) Storage migration must keep working for existing V2/V3 users
 *     (no bouncing them out of their saved choice when V4 is added).
 *  2) ReplicationPage must open with V4 as the worked example for
 *     brand-new visitors, without overwriting an explicit V2/V3 choice.
 */

describe("migrateStoredScenario — storage migration after task #174 added v4", () => {
  it("returns the stored scenario verbatim for the three known ids", () => {
    expect(migrateStoredScenario("v2")).toBe("v2");
    expect(migrateStoredScenario("v3")).toBe("v3");
    expect(migrateStoredScenario("v4")).toBe("v4");
  });

  it("returns null for null/missing storage (brand-new visitor)", () => {
    expect(migrateStoredScenario(null)).toBeNull();
  });

  it("returns null for legacy/unknown values (forward-compat with future ids)", () => {
    expect(migrateStoredScenario("v1")).toBeNull();
    expect(migrateStoredScenario("v5")).toBeNull();
    expect(migrateStoredScenario("V2")).toBeNull(); // case-sensitive on purpose
    expect(migrateStoredScenario("")).toBeNull();
    expect(migrateStoredScenario("garbage")).toBeNull();
  });
});

describe("shouldOpenWithV4OnFirstVisit — Replication page worked-example default", () => {
  it("opens with V4 only when both flags say 'fresh visitor on the global fallback'", () => {
    // Brand-new visitor: storage was empty, provider fell back to v2.
    expect(
      shouldOpenWithV4OnFirstVisit({
        scenarioWasExplicit: false,
        scenarioId: "v2",
      }),
    ).toBe(true);
  });

  it("respects an explicit v2 choice (never overwrites a persisted preference)", () => {
    // Reader previously selected v2 in another page → keep v2.
    expect(
      shouldOpenWithV4OnFirstVisit({
        scenarioWasExplicit: true,
        scenarioId: "v2",
      }),
    ).toBe(false);
  });

  it("respects an explicit v3 choice (never overwrites a persisted preference)", () => {
    expect(
      shouldOpenWithV4OnFirstVisit({
        scenarioWasExplicit: true,
        scenarioId: "v3",
      }),
    ).toBe(false);
  });

  it("does not double-fire once V4 has already been set this session", () => {
    expect(
      shouldOpenWithV4OnFirstVisit({
        scenarioWasExplicit: true,
        scenarioId: "v4",
      }),
    ).toBe(false);
    expect(
      shouldOpenWithV4OnFirstVisit({
        scenarioWasExplicit: false,
        scenarioId: "v4",
      }),
    ).toBe(false);
  });

  it("does not auto-promote a fresh visitor whose current scenario is v3 (defensive: only the v2 fallback is the trigger)", () => {
    // Theoretically unreachable today, but guards against a future change
    // where the global fallback shifts. The promotion is intentionally
    // narrow: only swap from the v2 fallback, never from a real v3.
    expect(
      shouldOpenWithV4OnFirstVisit({
        scenarioWasExplicit: false,
        scenarioId: "v3",
      }),
    ).toBe(false);
  });
});
