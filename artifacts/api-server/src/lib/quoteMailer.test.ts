import { describe, expect, it } from "vitest";
import { buildResendEmailPayload } from "./quoteMailer";

describe("quote email Resend payload", () => {
  it("uses the Headwaters identity and preserves Unicode HTML and plain text", () => {
    expect(
      buildResendEmailPayload({
        to: "recipient@example.com",
        subject: "HW-20260831-ODDE87 — Headwaters budgetary quote",
        body: "Your request is in — we’ll review it.",
        bodyHtml: "<p>Your request is in — we’ll review it.</p>",
        replyTo: "bobbie@ourheadwaters.ca",
      }),
    ).toEqual({
      from: "Headwaters <bobbie@ourheadwaters.ca>",
      to: ["recipient@example.com"],
      subject: "HW-20260831-ODDE87 — Headwaters budgetary quote",
      text: "Your request is in — we’ll review it.",
      html: "<p>Your request is in — we’ll review it.</p>",
      reply_to: "bobbie@ourheadwaters.ca",
    });
  });

  it("defaults replies to the Headwaters address", () => {
    expect(
      buildResendEmailPayload({
        to: "recipient@example.com",
        subject: "Quote",
        body: "Plain text",
      }).reply_to,
    ).toBe("bobbie@ourheadwaters.ca");
  });

  it("rejects header line breaks instead of allowing header injection", () => {
    expect(() =>
      buildResendEmailPayload({
        to: "recipient@example.com",
        subject: "Subject\r\nBcc: unwanted@example.com",
        body: "Body",
      }),
    ).toThrow("Subject contains an invalid line break");

    expect(() =>
      buildResendEmailPayload({
        to: "recipient@example.com",
        subject: "Subject",
        body: "Body",
        replyTo: "bobbie@ourheadwaters.ca\r\nBcc: unwanted@example.com",
      }),
    ).toThrow("Reply-To contains an invalid line break");
  });
});