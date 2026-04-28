import { describe, expect, it } from "vitest";

import { constellation } from "@/data/constellation";
import {
  ITEMS,
  RUNGS,
  SUB_SHELVES,
  itemsForRung,
  itemsForRungBySubShelf,
  STANDBY_PRIMITIVE_NAME,
  type RungId,
  type SubShelfId,
} from "@/data/standby";

describe("Z0 household standby — manifest sourcing", () => {
  it("names the primitive exactly as the constellation does", () => {
    const primitive = constellation.constellationWidePrimitives.find(
      (p) => p.id === "the-standby",
    );
    expect(primitive).toBeDefined();
    expect(STANDBY_PRIMITIVE_NAME).toBe(primitive!.name);
  });

  it("orders the four rungs as advisory → standby → active → standdown", () => {
    expect(RUNGS.map((r) => r.id)).toEqual([
      "advisory",
      "standby",
      "active",
      "standdown",
    ]);
  });

  it("uses the manifest's rung names and meanings verbatim", () => {
    const ladder =
      constellation.constellationWidePrimitives.find(
        (p) => p.id === "the-standby",
      )?.severityLadder ?? [];
    for (const r of RUNGS) {
      const fromManifest = ladder.find(
        (m) => m.rung.toLowerCase() === r.id,
      );
      expect(fromManifest, `manifest entry for ${r.id}`).toBeDefined();
      expect(r.name).toBe(fromManifest!.rung);
      expect(r.meaning).toBe(fromManifest!.meaning);
    }
  });

  it("exposes both sub-shelves with manifest names + roles", () => {
    const shelves =
      constellation.constellationWidePrimitives.find(
        (p) => p.id === "the-standby",
      )?.subShelves ?? [];
    const ids = SUB_SHELVES.map((s) => s.id);
    expect(ids).toContain("common-pantry");
    expect(ids).toContain("watch");
    for (const shelf of SUB_SHELVES) {
      const match = shelves.find((m) =>
        shelf.id === "common-pantry"
          ? m.name.toLowerCase().includes("pantry")
          : m.name.toLowerCase().includes("watch"),
      );
      expect(match).toBeDefined();
      expect(shelf.name).toBe(match!.name);
      expect(shelf.role).toBe(match!.role);
    }
  });
});

describe("Z0 household standby — checklist content", () => {
  it("has at least one item on every rung × sub-shelf cell", () => {
    const rungs: RungId[] = ["advisory", "standby", "active", "standdown"];
    const subShelves: SubShelfId[] = ["common-pantry", "watch"];
    for (const r of rungs) {
      for (const s of subShelves) {
        const items = itemsForRungBySubShelf(r, s);
        expect(
          items.length,
          `expected items at ${r} × ${s}`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("covers the five anchors called out in the saltbox manifest entry", () => {
    const standbyText = itemsForRung("standby")
      .map((it) => `${it.text} ${it.detail ?? ""}`.toLowerCase())
      .join("\n");
    expect(standbyText).toContain("water on hand");
    expect(standbyText).toMatch(/fuel/);
    expect(standbyText).toMatch(/meds/);
    expect(standbyText).toMatch(/kid-care plan/);
    expect(standbyText).toMatch(/contact tree/);
  });

  it("uses unique ids", () => {
    const ids = ITEMS.map((it) => it.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("lands every item in a known rung and sub-shelf", () => {
    const rungIds = new Set<RungId>([
      "advisory",
      "standby",
      "active",
      "standdown",
    ]);
    const shelfIds = new Set<SubShelfId>(SUB_SHELVES.map((s) => s.id));
    for (const it of ITEMS) {
      expect(rungIds.has(it.rung), `rung for ${it.id}`).toBe(true);
      expect(shelfIds.has(it.subShelf), `sub-shelf for ${it.id}`).toBe(true);
    }
  });
});
