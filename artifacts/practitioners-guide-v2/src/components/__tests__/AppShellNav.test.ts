import { describe, it, expect } from "vitest";
import { NAV } from "../AppShell";

describe("AppShell NAV", () => {
  it("includes the codetry chapter as a top-level nav item", () => {
    const codetry = NAV.find((item) => item.href === "/codetry");
    expect(codetry).toBeDefined();
    expect(codetry!.label).toBe("How this guide is named");
    expect(codetry!.accent).toBe("#3B2A6E");
  });

  it("places the codetry chapter after Replication", () => {
    const replicationIdx = NAV.findIndex((item) => item.href === "/replication");
    const codetryIdx = NAV.findIndex((item) => item.href === "/codetry");
    expect(replicationIdx).toBeGreaterThanOrEqual(0);
    expect(codetryIdx).toBeGreaterThan(replicationIdx);
  });

  it("includes the Community Store Playbook nav item as the last entry", () => {
    const csIdx = NAV.findIndex((item) => item.href === "/community-store");
    expect(csIdx).toBeGreaterThanOrEqual(0);
    expect(csIdx).toBe(NAV.length - 1);
    expect(NAV[csIdx].label).toBe("Community Store Playbook");
    expect(NAV[csIdx].accent).toBe("#b85a3e");
  });
});
