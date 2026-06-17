import { describe, it, expect } from "vitest";
import {
  ZONES,
  AQUIFER_ZONE,
  TOOL_HIGHLIGHT_MAP,
  getMismatchedHighlightAddresses,
  getPlannedHighlightAddresses,
} from "@/data/zones";

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
