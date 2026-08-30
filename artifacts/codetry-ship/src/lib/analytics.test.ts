import { afterEach, describe, expect, it, vi } from "vitest";
import { trackEvent } from "./analytics";

describe("trackEvent", () => {
  afterEach(() => {
    delete window.umami;
    vi.restoreAllMocks();
  });

  it("forwards safe event data when the optional tracker is available", () => {
    const track = vi.fn();
    window.umami = { track };

    trackEvent("consulting_offer_selected", {
      offer: "initial implementation",
      location: "offers_grid",
    });

    expect(track).toHaveBeenCalledWith("consulting_offer_selected", {
      offer: "initial implementation",
      location: "offers_grid",
    });
  });

  it("does not throw when the tracker is unavailable or fails", () => {
    expect(() => trackEvent("quote_request_submitted")).not.toThrow();

    window.umami = {
      track: () => {
        throw new Error("tracker unavailable");
      },
    };

    expect(() =>
      trackEvent("quote_request_submitted", { offer: "needs custom review", mode: "custom" }),
    ).not.toThrow();
  });
});