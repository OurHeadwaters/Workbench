import { describe, it, expect } from "vitest";
import {
  buildLiveFunderSlots,
  deriveFunderStatus,
  planBFunders,
  planBFundersSource,
  type FunderSlot,
} from "../planBFunders";
import {
  liveFunderPrograms,
  type FunderProgram,
} from "../planBFundersFeed";

describe("deriveFunderStatus", () => {
  const now = new Date("2026-04-29T12:00:00Z");

  it("returns Open for rolling/continuous intake", () => {
    expect(deriveFunderStatus({ rolling: true }, now)).toEqual({
      kind: "open",
    });
  });

  it("returns Open with closesOn when today sits inside a dated window", () => {
    const status = deriveFunderStatus(
      {
        windows: [{ opensOn: "2026-04-01", closesOn: "2026-05-31" }],
      },
      now,
    );
    expect(status).toEqual({ kind: "open", closesOn: "05/2026" });
  });

  it("returns Opens MM/YYYY when the next window is in the future", () => {
    const status = deriveFunderStatus(
      {
        windows: [
          { opensOn: "2026-05-15", closesOn: "2026-07-30" },
          { opensOn: "2027-04-15", closesOn: "2027-07-15" },
        ],
      },
      now,
    );
    expect(status).toEqual({ kind: "opens", on: "05/2026" });
  });

  it("picks the earliest future window when multiple are announced", () => {
    const status = deriveFunderStatus(
      {
        windows: [
          { opensOn: "2027-04-15", closesOn: "2027-07-15" },
          { opensOn: "2026-09-01", closesOn: "2026-10-31" },
        ],
      },
      now,
    );
    expect(status).toEqual({ kind: "opens", on: "09/2026" });
  });

  it("returns Closed when every known window is in the past", () => {
    const status = deriveFunderStatus(
      {
        windows: [
          { opensOn: "2024-01-01", closesOn: "2024-03-31" },
          { opensOn: "2025-01-01", closesOn: "2025-03-31" },
        ],
      },
      now,
    );
    expect(status).toEqual({ kind: "closed" });
  });

  it("treats an open-ended (no closesOn) window as Open with no close date", () => {
    const status = deriveFunderStatus(
      { windows: [{ opensOn: "2026-01-01" }] },
      now,
    );
    expect(status).toEqual({ kind: "open" });
  });

  it("auto-flips a window from Opens → Open as the open date passes", () => {
    const program = {
      windows: [{ opensOn: "2026-05-15", closesOn: "2026-07-30" }],
    };
    expect(deriveFunderStatus(program, new Date("2026-05-14T00:00:00Z"))).toEqual({
      kind: "opens",
      on: "05/2026",
    });
    expect(deriveFunderStatus(program, new Date("2026-05-16T00:00:00Z"))).toEqual({
      kind: "open",
      closesOn: "07/2026",
    });
    expect(deriveFunderStatus(program, new Date("2026-08-01T00:00:00Z"))).toEqual({
      kind: "closed",
    });
  });
});

describe("buildLiveFunderSlots", () => {
  const now = new Date("2026-04-29T12:00:00Z");

  const sample: FunderProgram[] = [
    {
      programName: "P3",
      funder: "F",
      fitRationale: "r",
      applicationWindow: "w",
      rolling: true,
      priority: 30,
      confidence: { kind: "seed", needs: "test fixture" },
    },
    {
      programName: "P1",
      funder: "F",
      fitRationale: "r",
      applicationWindow: "w",
      rolling: true,
      priority: 10,
      confidence: { kind: "seed", needs: "test fixture" },
    },
    {
      programName: "P2",
      funder: "F",
      fitRationale: "r",
      applicationWindow: "w",
      rolling: true,
      priority: 20,
      confidence: { kind: "seed", needs: "test fixture" },
    },
  ];

  it("returns null for an empty feed (caller falls back)", () => {
    expect(buildLiveFunderSlots([], now)).toBeNull();
  });

  it("orders by priority ascending and caps at 5 slots", () => {
    const many: FunderProgram[] = Array.from({ length: 8 }, (_, i) => ({
      programName: `Program ${i}`,
      funder: "F",
      fitRationale: "r",
      applicationWindow: "w",
      rolling: true,
      priority: 100 - i, // priority descends, so reverse-ordered
      confidence: { kind: "seed", needs: "test fixture" },
    }));
    const slots = buildLiveFunderSlots(many, now);
    expect(slots).not.toBeNull();
    expect(slots!.length).toBe(5);
    // The 5 highest-priority (lowest number) should be Program 7..3
    expect(slots!.map((s) => s.programName)).toEqual([
      "Program 7",
      "Program 6",
      "Program 5",
      "Program 4",
      "Program 3",
    ]);
  });

  it("preserves rationale, link, confidence, and derives status from windows", () => {
    const slots = buildLiveFunderSlots(sample, now);
    expect(slots!.map((s) => s.programName)).toEqual(["P1", "P2", "P3"]);
    for (const slot of slots!) {
      expect(slot.confidence.kind).toBe("seed");
      expect(slot.status.kind).toBe("open");
    }
  });
});

describe("planBFunders module export", () => {
  it("exposes exactly five top slots", () => {
    expect(planBFunders.length).toBe(5);
  });

  it("is sourced from the live feed (not the seed fallback)", () => {
    expect(planBFundersSource.kind).toBe("live");
    if (planBFundersSource.kind === "live") {
      expect(planBFundersSource.count).toBe(5);
      expect(planBFundersSource.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("every slot satisfies the FunderSlot shape", () => {
    for (const slot of planBFunders) {
      expectFunderSlotShape(slot);
    }
  });

  it("matches the live feed program count cap", () => {
    expect(planBFunders.length).toBeLessThanOrEqual(liveFunderPrograms.length);
  });
});

function expectFunderSlotShape(slot: FunderSlot): void {
  expect(typeof slot.programName).toBe("string");
  expect(slot.programName.length).toBeGreaterThan(0);
  expect(typeof slot.funder).toBe("string");
  expect(typeof slot.fitRationale).toBe("string");
  expect(typeof slot.applicationWindow).toBe("string");
  expect(["seed", "confirmed"]).toContain(slot.confidence.kind);
  if (slot.confidence.kind === "seed") {
    expect(typeof slot.confidence.needs).toBe("string");
    expect(slot.confidence.needs.length).toBeGreaterThan(0);
  } else {
    expect(typeof slot.confidence.source).toBe("string");
    expect(slot.confidence.source.length).toBeGreaterThan(0);
  }
  expect(["open", "opens", "closed"]).toContain(slot.status.kind);
  if (slot.status.kind === "opens") {
    expect(slot.status.on).toMatch(/^\d{2}\/\d{4}$/);
  }
  if (slot.status.kind === "open" && slot.status.closesOn) {
    expect(slot.status.closesOn).toMatch(/^\d{2}\/\d{4}$/);
  }
}
