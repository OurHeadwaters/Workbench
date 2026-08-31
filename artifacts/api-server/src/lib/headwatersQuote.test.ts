import { describe, expect, it } from "vitest";
import {
  CODETRY_ENGAGEMENT_POLICY_STATUS,
  CODETRY_OPERATING_FEE_CAD,
  CODETRY_OPERATING_FEE_POLICY,
  CODETRY_QUALIFYING_OPERATING_FEE_CAD,
  CODETRY_YEAR_1_FEE_CAD,
  CODETRY_YEAR_1_SCOPE,
  CODETRY_YEAR_2_FEE_CAD,
  CODETRY_YEAR_2_SCOPE,
} from "@workspace/headwaters-pricing";
import { calculateTaxCents, classifyQuote, money } from "./headwatersQuote";

describe("Headwaters quote rules", () => {
  it("prices a standard Year 1 engagement at $20,000", () => {
    expect(
      classifyQuote({
        organizationType: "co-op/not-for-profit",
        selectedOffer: "year 1 codetry engagement",
        specialRequirements: null,
      }),
    ).toEqual({ mode: "standard", subtotalCents: 2_000_000 });
  });

  it("prices a standard commercial Year 1 engagement at $20,000", () => {
    expect(
      classifyQuote({
        organizationType: "commercial/institutional",
        selectedOffer: "year 1 codetry engagement",
        specialRequirements: "",
      }),
    ).toEqual({ mode: "standard", subtotalCents: 2_000_000 });
  });

  it("prices a standard Year 2 engagement at $20,000", () => {
    expect(
      classifyQuote({
        organizationType: "community organization",
        selectedOffer: "year 2 codetry engagement",
        specialRequirements: "",
      }),
    ).toEqual({ mode: "standard", subtotalCents: 2_000_000 });
  });

  it("routes ranged or special work to custom review", () => {
    expect(
      classifyQuote({
        organizationType: "co-op/not-for-profit",
        selectedOffer: "annual support",
        specialRequirements: null,
      }).mode,
    ).toBe("custom");
    expect(
      classifyQuote({
        organizationType: "commercial/institutional",
        selectedOffer: "year 1 codetry engagement",
        specialRequirements: null,
        integrationNeeded: "yes",
      }).mode,
    ).toBe("custom");
    expect(
      classifyQuote({
        organizationType: "co-op/not-for-profit",
        selectedOffer: "year 1 codetry engagement",
        specialRequirements: null,
        sensitiveDataInvolved: "yes",
      }).mode,
    ).toBe("custom");
    expect(
      classifyQuote({
        organizationType: "co-op/not-for-profit",
        selectedOffer: "year 1 codetry engagement",
        specialRequirements: "Must integrate with our existing CRM",
      }).mode,
    ).toBe("custom");
  });

  it("formats CAD values", () => {
    expect(money(2_000_000)).toContain("20,000.00");
    expect(calculateTaxCents(2_000_000)).toBe(0);
  });

  it("locks the working two-year policy without stacking the operating fee", () => {
    expect(CODETRY_YEAR_1_FEE_CAD).toBe(20_000);
    expect(CODETRY_YEAR_2_FEE_CAD).toBe(20_000);
    expect(CODETRY_YEAR_1_SCOPE).toContain("current strategic plan");
    expect(CODETRY_YEAR_2_SCOPE).toContain("new annual strategic plan");
    expect(CODETRY_YEAR_2_SCOPE).toContain("board and training implementation");
    expect(CODETRY_OPERATING_FEE_CAD).toBe(6_000);
    expect(CODETRY_QUALIFYING_OPERATING_FEE_CAD).toBe(0);
    expect(CODETRY_OPERATING_FEE_POLICY).toContain("not added on top");
    expect(CODETRY_ENGAGEMENT_POLICY_STATUS).toContain("pending formal approval");
  });
});