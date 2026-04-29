import { describe, it, expect } from "vitest";
import { NAV } from "../AppShell";

describe("AppShell NAV", () => {
  it("includes the codetry chapter as a top-level nav item", () => {
    const codetry = NAV.find((item) => item.href === "/codetry");
    expect(codetry).toBeDefined();
    expect(codetry!.label).toBe("How this guide is named");
    expect(codetry!.accent).toBe("#3B2A6E");
  });

  it("places the codetry chapter last, after Replication", () => {
    const replicationIdx = NAV.findIndex((item) => item.href === "/replication");
    const codetryIdx = NAV.findIndex((item) => item.href === "/codetry");
    expect(replicationIdx).toBeGreaterThanOrEqual(0);
    expect(codetryIdx).toBe(NAV.length - 1);
    expect(codetryIdx).toBeGreaterThan(replicationIdx);
  });
});
