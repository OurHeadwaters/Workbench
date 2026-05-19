/**
 * stonemason.test.ts
 *
 * Structural-invariant tests for the Stonemason (Zone 3) data constants.
 * Guards against silent regressions in pricing tiers, runway quarters,
 * grant programs, pilot avatars, and out-of-scope declarations.
 *
 * Slides covered: positions 11–15 of the Practitioner's Operating Plan deck.
 */

import { describe, it, expect } from "vitest";
import {
  LAYERS,
  PRACTITIONER_TIERS,
  GUILD_COHORT_MIN,
  GUILD_COHORT_MAX,
  GUILD_TITHE_PCT,
  DEADHEAD_MONTHLY,
  DEADHEAD_ANNUAL,
  DEADHEAD_TRIAL_DAYS,
  INCOME_YEARS,
  RUNWAY_QUARTERS,
  GRANT_PROGRAMS,
  ROOTWORK_AVATARS,
  ROOTWORK_OPEN_DECISIONS,
  CASHFLOW_PRIORITIES,
  OUT_OF_SCOPE,
} from "@/data/stonemason";

// ── LAYERS ────────────────────────────────────────────────────────────────────

describe("LAYERS", () => {
  it("contains exactly three layers", () => {
    expect(LAYERS).toHaveLength(3);
  });

  it("has the expected ids in order: commons → practitioner → guild", () => {
    expect(LAYERS.map((l) => l.id)).toEqual(["commons", "practitioner", "guild"]);
  });

  it("every layer has a non-empty label, tagline, and description", () => {
    for (const layer of LAYERS) {
      expect(layer.label.trim()).toBeTruthy();
      expect(layer.tagline.trim()).toBeTruthy();
      expect(layer.description.trim()).toBeTruthy();
    }
  });
});

// ── PRACTITIONER_TIERS ────────────────────────────────────────────────────────

describe("PRACTITIONER_TIERS", () => {
  it("contains at least one tier", () => {
    expect(PRACTITIONER_TIERS.length).toBeGreaterThan(0);
  });

  it("includes a full-launch tier", () => {
    const fullLaunch = PRACTITIONER_TIERS.find((t) => t.id === "full-launch");
    expect(fullLaunch).toBeDefined();
  });

  it("includes a discovery tier", () => {
    expect(PRACTITIONER_TIERS.find((t) => t.id === "discovery")).toBeDefined();
  });

  it("includes a stewardship (recurring) tier", () => {
    expect(PRACTITIONER_TIERS.find((t) => t.id === "stewardship")).toBeDefined();
  });

  it("every tier has a non-empty id, label, price, and note", () => {
    for (const tier of PRACTITIONER_TIERS) {
      expect(tier.id.trim()).toBeTruthy();
      expect(tier.label.trim()).toBeTruthy();
      expect(tier.price.trim()).toBeTruthy();
      expect(tier.note.trim()).toBeTruthy();
    }
  });

  it("all tier ids are unique", () => {
    const ids = PRACTITIONER_TIERS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("full-launch price starts with '$'", () => {
    const fullLaunch = PRACTITIONER_TIERS.find((t) => t.id === "full-launch")!;
    expect(fullLaunch.price).toMatch(/^\$/);
  });
});

// ── GUILD constants ───────────────────────────────────────────────────────────

describe("Guild pricing constants", () => {
  it("cohort min is less than cohort max", () => {
    expect(GUILD_COHORT_MIN).toBeLessThan(GUILD_COHORT_MAX);
  });

  it("cohort min is a positive dollar amount", () => {
    expect(GUILD_COHORT_MIN).toBeGreaterThan(0);
  });

  it("tithe percentage is 8", () => {
    expect(GUILD_TITHE_PCT).toBe(8);
  });
});

// ── DEADHEAD constants ────────────────────────────────────────────────────────

describe("Deadhead SaaS constants", () => {
  it("annual price is less than 12× monthly (discount implied)", () => {
    expect(DEADHEAD_ANNUAL).toBeLessThan(DEADHEAD_MONTHLY * 12);
  });

  it("trial period is a positive number of days", () => {
    expect(DEADHEAD_TRIAL_DAYS).toBeGreaterThan(0);
  });
});

// ── INCOME_YEARS ──────────────────────────────────────────────────────────────

describe("INCOME_YEARS", () => {
  it("contains exactly three projection periods", () => {
    expect(INCOME_YEARS).toHaveLength(3);
  });

  it("low is less than high for every year", () => {
    for (const year of INCOME_YEARS) {
      expect(year.low).toBeLessThan(year.high);
    }
  });

  it("every year has at least one source", () => {
    for (const year of INCOME_YEARS) {
      expect(year.sources.length).toBeGreaterThan(0);
    }
  });

  it("projections are increasing (each low exceeds the previous low)", () => {
    for (let i = 1; i < INCOME_YEARS.length; i++) {
      expect(INCOME_YEARS[i].low).toBeGreaterThan(INCOME_YEARS[i - 1].low);
    }
  });

  it("every income source has a non-empty label and amount", () => {
    for (const year of INCOME_YEARS) {
      for (const source of year.sources) {
        expect(source.label.trim()).toBeTruthy();
        expect(source.amount.trim()).toBeTruthy();
      }
    }
  });
});

// ── RUNWAY_QUARTERS ───────────────────────────────────────────────────────────

describe("RUNWAY_QUARTERS", () => {
  it("spans exactly 6 quarters", () => {
    expect(RUNWAY_QUARTERS).toHaveLength(6);
  });

  it("starts at Q1 2026", () => {
    expect(RUNWAY_QUARTERS[0].id).toBe("q1-2026");
  });

  it("ends at Q2 2027", () => {
    expect(RUNWAY_QUARTERS[RUNWAY_QUARTERS.length - 1].id).toBe("q2-2027");
  });

  it("all quarter ids are unique", () => {
    const ids = RUNWAY_QUARTERS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("revenueMin is less than revenueMax for every quarter", () => {
    for (const q of RUNWAY_QUARTERS) {
      expect(q.revenueMin).toBeLessThan(q.revenueMax);
    }
  });

  it("revenue projections grow across the 6 quarters (each min >= previous min)", () => {
    for (let i = 1; i < RUNWAY_QUARTERS.length; i++) {
      expect(RUNWAY_QUARTERS[i].revenueMin).toBeGreaterThanOrEqual(
        RUNWAY_QUARTERS[i - 1].revenueMin,
      );
    }
  });

  it("every quarter has non-empty focus and target strings", () => {
    for (const q of RUNWAY_QUARTERS) {
      expect(q.focus.trim()).toBeTruthy();
      expect(q.target.trim()).toBeTruthy();
    }
  });
});

// ── GRANT_PROGRAMS ────────────────────────────────────────────────────────────

describe("GRANT_PROGRAMS", () => {
  it("contains at least four grant programs", () => {
    expect(GRANT_PROGRAMS.length).toBeGreaterThanOrEqual(4);
  });

  it("includes NOHFC", () => {
    expect(GRANT_PROGRAMS.find((g) => g.id === "nohfc")).toBeDefined();
  });

  it("includes OTF", () => {
    expect(GRANT_PROGRAMS.find((g) => g.id === "otf")).toBeDefined();
  });

  it("includes CDAP", () => {
    expect(GRANT_PROGRAMS.find((g) => g.id === "cdap")).toBeDefined();
  });

  it("every program has a non-empty name, acronym, eligibility, and fit", () => {
    for (const g of GRANT_PROGRAMS) {
      expect(g.name.trim()).toBeTruthy();
      expect(g.acronym.trim()).toBeTruthy();
      expect(g.eligibility.trim()).toBeTruthy();
      expect(g.fit.trim()).toBeTruthy();
    }
  });

  it("all program ids are unique", () => {
    const ids = GRANT_PROGRAMS.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ── ROOTWORK_AVATARS ──────────────────────────────────────────────────────────

describe("ROOTWORK_AVATARS", () => {
  it("contains exactly 6 pilot avatars", () => {
    expect(ROOTWORK_AVATARS).toHaveLength(6);
  });

  it("all avatar ids are unique", () => {
    const ids = ROOTWORK_AVATARS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every avatar has a non-empty label and note", () => {
    for (const avatar of ROOTWORK_AVATARS) {
      expect(avatar.label.trim()).toBeTruthy();
      expect(avatar.note.trim()).toBeTruthy();
    }
  });
});

// ── ROOTWORK_OPEN_DECISIONS ───────────────────────────────────────────────────

describe("ROOTWORK_OPEN_DECISIONS", () => {
  it("contains at least one open decision", () => {
    expect(ROOTWORK_OPEN_DECISIONS.length).toBeGreaterThan(0);
  });

  it("every decision is a non-empty string", () => {
    for (const d of ROOTWORK_OPEN_DECISIONS) {
      expect(d.trim()).toBeTruthy();
    }
  });
});

// ── CASHFLOW_PRIORITIES ───────────────────────────────────────────────────────

describe("CASHFLOW_PRIORITIES", () => {
  it("contains at least one priority", () => {
    expect(CASHFLOW_PRIORITIES.length).toBeGreaterThan(0);
  });

  it("order values are contiguous from 1", () => {
    const orders = CASHFLOW_PRIORITIES.map((p) => p.order).sort((a, b) => a - b);
    orders.forEach((v, i) => expect(v).toBe(i + 1));
  });

  it("every priority has a non-empty label and detail", () => {
    for (const p of CASHFLOW_PRIORITIES) {
      expect(p.label.trim()).toBeTruthy();
      expect(p.detail.trim()).toBeTruthy();
    }
  });
});

// ── OUT_OF_SCOPE ──────────────────────────────────────────────────────────────

describe("OUT_OF_SCOPE", () => {
  it("contains exactly three items", () => {
    expect(OUT_OF_SCOPE).toHaveLength(3);
  });

  it("declares no SaaS fees from communities", () => {
    expect(OUT_OF_SCOPE.some((s) => /SaaS/i.test(s))).toBe(true);
  });

  it("declares no equity taken", () => {
    expect(OUT_OF_SCOPE.some((s) => /equity/i.test(s))).toBe(true);
  });

  it("declares that 807's revenue stays with 807", () => {
    expect(OUT_OF_SCOPE.some((s) => /807/i.test(s))).toBe(true);
  });

  it("every item is a non-empty string", () => {
    for (const item of OUT_OF_SCOPE) {
      expect(item.trim()).toBeTruthy();
    }
  });
});
