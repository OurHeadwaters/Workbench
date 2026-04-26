// Tests for the OnePager "Download PDF with my edits" client helper.
// Especially important: the SPA-fallback guard. In a static deploy
// where the dev plugin isn't there, an unknown POST gets rewritten to
// index.html with a 200 OK, and a naive "if (response.ok) downloadAsBlob"
// would hand the practitioner an HTML file renamed .pdf. The guard
// rejects any 200 that isn't application/pdf so the UI surfaces the
// static fallback notice instead.

import { describe, expect, it } from "vitest";

import { regenerateOnePagerPdf } from "../regenerateOnePagerPdf";
import { DEFAULT_STATE } from "../storage";

function makeFetchResponse(init: {
  ok: boolean;
  status?: number;
  statusText?: string;
  contentType?: string;
  body?: string;
  blob?: Blob;
}): Response {
  // Minimal Response-like fixture sufficient for the helper's surface:
  // .ok, .status, .statusText, .headers.get(name), .text(), .blob().
  const headers = new Map<string, string>();
  if (init.contentType) headers.set("content-type", init.contentType);
  return {
    ok: init.ok,
    status: init.status ?? (init.ok ? 200 : 500),
    statusText: init.statusText ?? "",
    headers: {
      get(name: string) {
        return headers.get(name.toLowerCase()) ?? null;
      },
    },
    async text() {
      return init.body ?? "";
    },
    async blob() {
      return init.blob ?? new Blob([init.body ?? ""]);
    },
  } as unknown as Response;
}

describe("regenerateOnePagerPdf", () => {
  it("posts the AppState as JSON to ${baseUrl}api/onepager.pdf and returns the response blob", async () => {
    const expectedBlob = new Blob([new Uint8Array([0x25, 0x50, 0x44, 0x46])], {
      type: "application/pdf",
    });
    let capturedUrl: string | undefined;
    let capturedInit: RequestInit | undefined;
    const fakeFetch: typeof fetch = async (url, init) => {
      capturedUrl = String(url);
      capturedInit = init;
      return makeFetchResponse({
        ok: true,
        contentType: "application/pdf",
        blob: expectedBlob,
      });
    };
    const result = await regenerateOnePagerPdf(DEFAULT_STATE, {
      fetch: fakeFetch,
      baseUrl: "/practitioner-operating-plan/",
    });
    expect(capturedUrl).toBe(
      "/practitioner-operating-plan/api/onepager.pdf",
    );
    expect(capturedInit?.method).toBe("POST");
    const sent = JSON.parse(String(capturedInit?.body ?? ""));
    expect(sent.version).toBe(DEFAULT_STATE.version);
    expect(result).toBe(expectedBlob);
  });

  it("respects a root baseUrl", async () => {
    let capturedUrl: string | undefined;
    const fakeFetch: typeof fetch = async (url) => {
      capturedUrl = String(url);
      return makeFetchResponse({
        ok: true,
        contentType: "application/pdf",
      });
    };
    await regenerateOnePagerPdf(DEFAULT_STATE, {
      fetch: fakeFetch,
      baseUrl: "/",
    });
    expect(capturedUrl).toBe("/api/onepager.pdf");
  });

  it("throws with the server's body text when the response is not ok", async () => {
    const fakeFetch: typeof fetch = async () =>
      makeFetchResponse({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        body: "Chromium crashed",
      });
    await expect(
      regenerateOnePagerPdf(DEFAULT_STATE, {
        fetch: fakeFetch,
        baseUrl: "/",
      }),
    ).rejects.toThrow(/Chromium crashed/);
  });

  it("rejects a 200 OK that isn't application/pdf — the SPA-fallback case", async () => {
    // Static deploys without the dev plugin will rewrite an unknown
    // POST to index.html with a 200 OK and Content-Type: text/html.
    // Without this guard, the practitioner would download an HTML file
    // renamed practitioner-operating-plan-onepager.pdf.
    const fakeFetch: typeof fetch = async () =>
      makeFetchResponse({
        ok: true,
        contentType: "text/html; charset=utf-8",
        body: "<!doctype html><html>...</html>",
      });
    await expect(
      regenerateOnePagerPdf(DEFAULT_STATE, {
        fetch: fakeFetch,
        baseUrl: "/",
      }),
    ).rejects.toThrow(/Auto-regenerate endpoint not available/);
  });

  it("rejects a 200 OK with no Content-Type header at all", async () => {
    const fakeFetch: typeof fetch = async () =>
      makeFetchResponse({ ok: true, body: "<html>" });
    await expect(
      regenerateOnePagerPdf(DEFAULT_STATE, {
        fetch: fakeFetch,
        baseUrl: "/",
      }),
    ).rejects.toThrow(/no Content-Type/);
  });

  it("accepts application/pdf with a charset suffix", async () => {
    const fakeFetch: typeof fetch = async () =>
      makeFetchResponse({
        ok: true,
        contentType: "application/pdf; charset=binary",
      });
    await expect(
      regenerateOnePagerPdf(DEFAULT_STATE, {
        fetch: fakeFetch,
        baseUrl: "/",
      }),
    ).resolves.toBeInstanceOf(Blob);
  });
});
