import { describe, expect, it } from "vitest";
import { encodeRfc2822 } from "./quoteMailer";

function decodeGmailRaw(raw: string): string {
  return Buffer.from(raw.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

function decodeBody(message: string): string {
  const body = message.split("\r\n\r\n", 2)[1] ?? "";
  return Buffer.from(body.replace(/\r\n/g, ""), "base64").toString("utf8");
}

describe("quote email MIME encoding", () => {
  it("encodes a Unicode subject as an RFC 2047 UTF-8 header", () => {
    const raw = encodeRfc2822(
      "recipient@example.com",
      "HW-20260831-ODDE87 — Headwaters received your custom request",
      "Hi Bobbie,\n\nYour request is in — we’ll review it.",
      "bobbie@ourheadwaters.ca",
    );
    const message = decodeGmailRaw(raw);

    expect(message).toContain(
      "Subject: =?UTF-8?B?SFctMjAyNjA4MzEtT0RERTg3IOKAlCBIZWFkd2F0ZXJzIHJlY2VpdmVkIHlvdXIgY3VzdG9tIHJlcXVlc3Q=?=",
    );
    expect(message).toContain("MIME-Version: 1.0");
    expect(message).toContain("Content-Type: text/plain; charset=UTF-8");
    expect(message).toContain("Content-Transfer-Encoding: base64");
    expect(message).not.toContain("Ã");
    expect(decodeBody(message)).toBe("Hi Bobbie,\n\nYour request is in — we’ll review it.");
  });

  it("rejects header line breaks instead of allowing header injection", () => {
    expect(() =>
      encodeRfc2822(
        "recipient@example.com",
        "Subject\r\nBcc: unwanted@example.com",
        "Body",
      ),
    ).toThrow("Subject contains an invalid line break");
  });

  it("encodes multipart/alternative when html is provided", () => {
    const raw = encodeRfc2822(
      "recipient@example.com",
      "Test HTML",
      "Plain text body",
      undefined,
      "<p>HTML body</p>"
    );
    const message = decodeGmailRaw(raw);

    expect(message).toContain("Content-Type: multipart/alternative; boundary=");
    expect(message).toContain("Content-Type: text/plain; charset=UTF-8");
    expect(message).toContain("Content-Type: text/html; charset=UTF-8");
  });
});