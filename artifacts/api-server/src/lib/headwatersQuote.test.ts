import { describe, expect, it } from "vitest";
import { calculateTaxCents, classifyQuote, money } from "./headwatersQuote";

describe("Headwaters quote rules", () => {
  it("prices a standard co-op implementation at $20,000", () => {
    expect(
      classifyQuote({
        organizationType: "co-op/not-for-profit",
        selectedOffer: "initial implementation",
        specialRequirements: null,
      }),
    ).toEqual({ mode: "standard", subtotalCents: 2_000_000 });
  });

  it("prices a standard commercial implementation at $28,000", () => {
    expect(
      classifyQuote({
        organizationType: "commercial/institutional",
        selectedOffer: "initial implementation",
        specialRequirements: "",
      }),
    ).toEqual({ mode: "standard", subtotalCents: 2_800_000 });
  });

  it("prices a self-attested community implementation at $20,000", () => {
    expect(
      classifyQuote({
        organizationType: "community organization",
        selectedOffer: "initial implementation",
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
        selectedOffer: "initial implementation",
        specialRequirements: null,
        integrationNeeded: "yes",
      }).mode,
    ).toBe("custom");
    expect(
      classifyQuote({
        organizationType: "co-op/not-for-profit",
        selectedOffer: "initial implementation",
        specialRequirements: null,
        sensitiveDataInvolved: "yes",
      }).mode,
    ).toBe("custom");
    expect(
      classifyQuote({
        organizationType: "co-op/not-for-profit",
        selectedOffer: "initial implementation",
        specialRequirements: "Must integrate with our existing CRM",
      }).mode,
    ).toBe("custom");
  });

  it("formats CAD values", () => {
    expect(money(2_000_000)).toContain("20,000.00");
    expect(calculateTaxCents(2_000_000)).toBe(0);
  });
});