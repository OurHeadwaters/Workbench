import { describe, expect, it } from "vitest";
import {
  allowedOutboundUrl,
  deliveryFailure,
  isGlobalOutboundAddress,
  resolvePublicOutboundHost,
} from "./engagementOutbound";

describe("engagement outbound security", () => {
  it("accepts exclusively public DNS answers", async () => {
    const resolver = async () => [{ address: "8.8.8.8", family: 4 }, { address: "2606:4700:4700::1111", family: 6 }];
    expect(await resolvePublicOutboundHost("example.com", resolver as never)).toBe(true);
  });

  it.each(["127.0.0.1", "10.0.0.1", "169.254.1.1", "100.64.0.1", "192.0.2.1"])(
    "rejects reserved IPv4 %s",
    (address) => expect(isGlobalOutboundAddress(address)).toBe(false),
  );

  it.each(["::1", "::", "fc00::1", "fe80::1", "ff02::1", "2001:db8::1", "::ffff:127.0.0.1"])(
    "rejects reserved IPv6 %s",
    (address) => expect(isGlobalOutboundAddress(address)).toBe(false),
  );

  it("fails DNS if any answer is private", async () => {
    const resolver = async () => [{ address: "8.8.8.8", family: 4 }, { address: "10.0.0.1", family: 4 }];
    expect(await resolvePublicOutboundHost("example.com", resolver as never)).toBe(false);
  });

  it("requires exact HTTPS allowlisted hosts without userinfo or IP literals", () => {
    expect(allowedOutboundUrl("https://hooks.example.com/path", "hooks.example.com")).toBe("https://hooks.example.com/path");
    expect(allowedOutboundUrl("https://evil.example/path", "hooks.example.com")).toBeNull();
    expect(allowedOutboundUrl("https://user@hooks.example.com/path", "hooks.example.com")).toBeNull();
    expect(allowedOutboundUrl("https://127.0.0.1/path", "127.0.0.1")).toBeNull();
  });

  it("dead-letters every failure at the attempt limit and always clears leases", () => {
    expect(deliveryFailure(8, "timeout")).toMatchObject({
      status: "dead_letter", claimedAt: null, leaseExpiresAt: null, nextAttemptAt: null,
    });
    expect(deliveryFailure(7, "network")).toMatchObject({
      status: "failed", claimedAt: null, leaseExpiresAt: null,
    });
    expect(deliveryFailure(7, "network").nextAttemptAt).toBeInstanceOf(Date);
  });
});