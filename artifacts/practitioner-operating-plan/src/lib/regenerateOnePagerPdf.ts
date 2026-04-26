// Client-side helper for the OnePager "Download PDF with my edits"
// button. Posts the practitioner's live AppState to the dev server's
// /api/onepager.pdf endpoint and returns the rendered PDF as a Blob,
// or throws a typed error the UI can surface as a fallback notice.
//
// Lives in src/lib so the no-jsdom vitest sandbox can exercise it
// directly with a stubbed `fetch` — without that, the SPA-fallback
// guard would only ever be checked by hand in a browser.
//
// SPA-fallback guard: a static deploy without the Vite dev plugin
// will silently rewrite an unknown POST to index.html with a 200 OK,
// and a naive "if (response.ok) download as blob" would hand the
// practitioner an HTML page renamed .pdf. Treating anything other
// than `application/pdf` as a missing endpoint surfaces the static
// fallback link instead.

import type { AppState } from "./storage";

export type RegeneratePdfDeps = {
  fetch?: typeof fetch;
  baseUrl: string;
};

export async function regenerateOnePagerPdf(
  state: AppState,
  deps: RegeneratePdfDeps,
): Promise<Blob> {
  const fetchImpl = deps.fetch ?? fetch;
  const response = await fetchImpl(`${deps.baseUrl}api/onepager.pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      detail ||
        `Server responded ${response.status} ${response.statusText}`,
    );
  }

  const contentType = response.headers.get("Content-Type") ?? "";
  if (!contentType.toLowerCase().includes("application/pdf")) {
    throw new Error(
      `Auto-regenerate endpoint not available (got ${contentType || "no Content-Type"}). ` +
        `Use the "Last-built PDF" link as a fallback.`,
    );
  }

  return await response.blob();
}
