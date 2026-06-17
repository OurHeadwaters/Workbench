import { describe, it, expect } from "vitest";
import {
  ZONES,
  AQUIFER_ZONE,
  TOOL_HIGHLIGHT_MAP,
  getMismatchedHighlightAddresses,
  getPlannedHighlightAddresses,
} from "@/data/zones";

function toolNameByAddress(address: string): string | undefined {
  return [...ZONES, AQUIFER_ZONE]
    .flatMap((z) => z.tools)
    .find((t) => t.zoneAddress === address)?.name;
}

describe("TOOL_HIGHLIGHT_MAP address integrity", () => {
  it("every address in TOOL_HIGHLIGHT_MAP matches a zoneAddress in ZONES or AQUIFER_ZONE", () => {
    const mismatches = getMismatchedHighlightAddresses();

    if (mismatches.length > 0) {
      const lines = mismatches.map(
        ({ key, address }) =>
          `  TOOL_HIGHLIGHT_MAP["${key}"] → "${address}" — no matching zoneAddress found`
      );
      throw new Error(
        `TOOL_HIGHLIGHT_MAP references ${mismatches.length} unknown zone address(es):\n${lines.join("\n")}\n\n` +
          `Fix: update TOOL_HIGHLIGHT_MAP in zones.ts to match the current zoneAddress values, ` +
          `or restore the renamed/removed tool's zoneAddress.`
      );
    }

    expect(mismatches).toHaveLength(0);
  });

  it("every TOOL_HIGHLIGHT_MAP key follows the 'who:situation' format", () => {
    const validWho = ["household", "practitioner", "community"];
    const validSituation = ["normal", "standby"];
    const badKeys: string[] = [];

    for (const key of Object.keys(TOOL_HIGHLIGHT_MAP)) {
      const [who, situation, ...rest] = key.split(":");
      if (
        !validWho.includes(who) ||
        !validSituation.includes(situation) ||
        rest.length > 0
      ) {
        badKeys.push(key);
      }
    }

    expect(badKeys).toHaveLength(0);
  });

  it("all zones and Aquifer tools have a zoneAddress (no silent gaps)", () => {
    const missingAddress = [...ZONES, AQUIFER_ZONE]
      .flatMap((z) => z.tools)
      .filter((t) => !t.zoneAddress)
      .map((t) => t.name);

    expect(missingAddress).toHaveLength(0);
  });

  it("every address in TOOL_HIGHLIGHT_MAP resolves to a 'live' tool, not a planned one", () => {
    const planned = getPlannedHighlightAddresses();

    if (planned.length > 0) {
      const lines = planned.map(
        ({ key, address, toolName }) =>
          `  TOOL_HIGHLIGHT_MAP["${key}"] → "${address}" ("${toolName}") has status "planned"`
      );
      throw new Error(
        `TOOL_HIGHLIGHT_MAP references ${planned.length} planned tool(s) — visitors would see a broken link:\n` +
          lines.join("\n") +
          `\n\nFix: remove the address from TOOL_HIGHLIGHT_MAP, or mark the tool as "live" in zones.ts once it ships.`
      );
    }

    expect(planned).toHaveLength(0);
  });
});

describe("household quiz results highlight the right tools", () => {
  it("household:normal highlights Saltbox/Homeschool (Z0–A)", () => {
    const highlights = TOOL_HIGHLIGHT_MAP["household:normal"] ?? [];
    expect(highlights).toContain("Z0–A");
    expect(toolNameByAddress("Z0–A")).toBe("Saltbox / Homeschool");
  });

  it("household:normal highlights Headwaters Books (Z1–B)", () => {
    const highlights = TOOL_HIGHLIGHT_MAP["household:normal"] ?? [];
    expect(highlights).toContain("Z1–B");
    expect(toolNameByAddress("Z1–B")).toBe("Headwaters Books");
  });

  it("household:normal highlights North Star (Z1–C)", () => {
    const highlights = TOOL_HIGHLIGHT_MAP["household:normal"] ?? [];
    expect(highlights).toContain("Z1–C");
    expect(toolNameByAddress("Z1–C")).toBe("North Star");
  });

  it("household:standby highlights The Eave (Z1–D)", () => {
    const highlights = TOOL_HIGHLIGHT_MAP["household:standby"] ?? [];
    expect(highlights).toContain("Z1–D");
    expect(toolNameByAddress("Z1–D")).toBe("The Eave");
  });

  it("household:standby highlights 807 Community Benefits (Z3–A)", () => {
    const highlights = TOOL_HIGHLIGHT_MAP["household:standby"] ?? [];
    expect(highlights).toContain("Z3–A");
    expect(toolNameByAddress("Z3–A")).toBe("807 Community Benefits");
  });

  it("household:standby highlights Standby Supplies (Z3–D)", () => {
    const highlights = TOOL_HIGHLIGHT_MAP["household:standby"] ?? [];
    expect(highlights).toContain("Z3–D");
    expect(toolNameByAddress("Z3–D")).toBe("Standby Supplies");
  });
});

describe("community quiz results highlight the right tools", () => {
  it("community:normal highlights Research Library (Z2/Z4)", () => {
    const highlights = TOOL_HIGHLIGHT_MAP["community:normal"] ?? [];
    expect(highlights).toContain("Z2/Z4");
    expect(toolNameByAddress("Z2/Z4")).toBe("Research Library");
  });

  it("community:normal highlights Grants Finder (Z3–B)", () => {
    const highlights = TOOL_HIGHLIGHT_MAP["community:normal"] ?? [];
    expect(highlights).toContain("Z3–B");
    expect(toolNameByAddress("Z3–B")).toBe("Grants Finder");
  });

  it("community:normal highlights Market Mosaic (Z3–C)", () => {
    const highlights = TOOL_HIGHLIGHT_MAP["community:normal"] ?? [];
    expect(highlights).toContain("Z3–C");
    expect(toolNameByAddress("Z3–C")).toBe("Market Mosaic");
  });

  it("community:standby adds 807 Community Benefits (Z3–A)", () => {
    const highlights = TOOL_HIGHLIGHT_MAP["community:standby"] ?? [];
    expect(highlights).toContain("Z3–A");
    expect(toolNameByAddress("Z3–A")).toBe("807 Community Benefits");
  });

  it("community:standby adds Standby Supplies (Z3–D)", () => {
    const highlights = TOOL_HIGHLIGHT_MAP["community:standby"] ?? [];
    expect(highlights).toContain("Z3–D");
    expect(toolNameByAddress("Z3–D")).toBe("Standby Supplies");
  });
});

describe("practitioner quiz results include Z1 money tools", () => {
  it("practitioner:normal highlights Headwaters Books (Z1–B)", () => {
    const highlights = TOOL_HIGHLIGHT_MAP["practitioner:normal"] ?? [];
    expect(highlights).toContain("Z1–B");
    expect(toolNameByAddress("Z1–B")).toBe("Headwaters Books");
  });

  it("practitioner:normal highlights North Star (Z1–C)", () => {
    const highlights = TOOL_HIGHLIGHT_MAP["practitioner:normal"] ?? [];
    expect(highlights).toContain("Z1–C");
    expect(toolNameByAddress("Z1–C")).toBe("North Star");
  });

  it("practitioner:standby highlights Headwaters Books (Z1–B)", () => {
    const highlights = TOOL_HIGHLIGHT_MAP["practitioner:standby"] ?? [];
    expect(highlights).toContain("Z1–B");
  });

  it("practitioner:standby highlights North Star (Z1–C)", () => {
    const highlights = TOOL_HIGHLIGHT_MAP["practitioner:standby"] ?? [];
    expect(highlights).toContain("Z1–C");
  });

  it("practitioner:standby also highlights The Eave (Z1–D)", () => {
    const highlights = TOOL_HIGHLIGHT_MAP["practitioner:standby"] ?? [];
    expect(highlights).toContain("Z1–D");
    expect(toolNameByAddress("Z1–D")).toBe("The Eave");
  });
});
