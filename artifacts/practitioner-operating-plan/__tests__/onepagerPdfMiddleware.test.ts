// Integration test for the dev-time auto-regenerate trigger.
//
// Drives the full button → POST → render → download flow without
// booting Chromium: a fake Connect-style req/res pair carries the
// JSON AppState that the OnePager button would post, the middleware
// handler invokes the renderer with a stubbed implementation that
// captures what state it was asked to seed, and we assert the
// response stream is the PDF buffer the renderer returned. The
// renderer stub also walks the localStorage seed script through a
// fake window — exactly what puppeteer's evaluateOnNewDocument would
// do — so the test proves the practitioner's edits arrive at the
// page render with no manual JSON-export / CLI step in between.

import { describe, expect, it } from "vitest";
import { Readable } from "stream";

import {
  handleOnePagerPdfRequest,
  joinBaseAndPath,
  onePagerPdfPlugin,
} from "../vite-plugin-onepager-pdf";
import {
  buildLocalStorageSeedScript,
  STORAGE_KEY,
} from "../scripts/seedAppState";
import { DEFAULT_STATE, type AppState } from "../src/lib/storage";
import { getLiveCostValue, resolveCost } from "../src/lib/budgetMath";

function withCostReviewEdit(
  state: AppState,
  id: string,
  editedValue: number,
): AppState {
  return {
    ...state,
    costReview: {
      ...state.costReview,
      [id]: {
        status: "edited",
        editedValue,
        note: "",
        reviewedAt: "2026-04-26T00:00:00.000Z",
      },
    },
  };
}

function makeRequest(method: string, body: string | null) {
  // Connect/Node serves the request body as Buffer chunks; mirror that
  // here so `Buffer.concat(chunks)` in the middleware behaves the same
  // way it would behind a real Vite dev server.
  const stream =
    body == null ? Readable.from([]) : Readable.from([Buffer.from(body)]);
  return Object.assign(stream, { method });
}

function makeResponse() {
  const headers: Record<string, string> = {};
  let body: Buffer | string | undefined;
  let ended = false;
  const res = {
    statusCode: 0,
    setHeader(name: string, value: string) {
      headers[name.toLowerCase()] = value;
    },
    end(payload?: string | Buffer) {
      body = payload;
      ended = true;
    },
    get headers() {
      return headers;
    },
    get body() {
      return body;
    },
    get ended() {
      return ended;
    },
  };
  return res;
}

describe("POST /api/onepager.pdf — auto-regenerate trigger", () => {
  it("renders a fresh PDF that reflects the practitioner's cost-review edits, no CLI handoff", async () => {
    // (1) The practitioner edits day rate, flight cost, and retainer
    // in the cost-review modal — same shape the modal writes to
    // localStorage when the Edit verdict fires.
    let edited = withCostReviewEdit(
      DEFAULT_STATE,
      "crossReserve.dayRate.onsite",
      4000,
    );
    edited = withCostReviewEdit(
      edited,
      "crossReserve.travel.flightPerWeek",
      1200,
    );
    edited = withCostReviewEdit(
      edited,
      "crossReserve.retainer.annual",
      35000,
    );

    // (2) The OnePager "Download PDF with my edits" button POSTs the
    // current AppState as JSON. We construct the equivalent fake
    // request directly.
    const req = makeRequest("POST", JSON.stringify(edited));
    const res = makeResponse();

    // (3) Stand in for puppeteer with a renderer that walks the seed
    // script through a fake window (the same dance puppeteer's
    // evaluateOnNewDocument would do) and returns a recognizable PDF
    // buffer. Capturing the seeded state lets us assert the page
    // would have read the practitioner's edits, not DEFAULT_STATE.
    const fakePdf = Buffer.from("%PDF-1.4 fake-rendered-onepager");
    let renderInvocations = 0;
    let seenByPage: AppState | null = null;
    let seenPageUrl: string | null = null;
    const render = async (
      options: import("../scripts/renderOnePagerPdf").RenderOnePagerOptions,
    ): Promise<Buffer> => {
      renderInvocations += 1;
      seenPageUrl = options.pageUrl;
      if (options.appState) {
        const seed = buildLocalStorageSeedScript(options.appState);
        const store: Record<string, string> = {};
        const fakeWindow = {
          localStorage: {
            setItem(k: string, v: string) {
              store[k] = v;
            },
            getItem(k: string) {
              return store[k] ?? null;
            },
          },
        };
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        new Function("window", seed)({ ...fakeWindow });
        seenByPage = JSON.parse(store[STORAGE_KEY]!);
      }
      return fakePdf;
    };

    // (4) Run the middleware handler — this is exactly what the Vite
    // dev server invokes when the browser POSTs to /api/onepager.pdf.
    await handleOnePagerPdfRequest(req, res, {
      pageUrl: "http://127.0.0.1:5173/onepager",
      render,
    });

    // (5) The response stream IS the PDF — no JSON-download step, no
    // "now run pnpm export-onepager-pdf" hint, no manual handoff.
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toBe("application/pdf");
    expect(res.headers["content-disposition"]).toBe(
      'attachment; filename="practitioner-operating-plan-onepager.pdf"',
    );
    expect(res.headers["cache-control"]).toBe("no-store");
    expect(res.body).toEqual(fakePdf);

    // (6) The renderer was invoked exactly once with the dev-server's
    // /onepager URL.
    expect(renderInvocations).toBe(1);
    expect(seenPageUrl).toBe("http://127.0.0.1:5173/onepager");

    // (7) And — the heart of the task — the page would have rendered
    // against the practitioner's edited dollar values, not the
    // DEFAULT_STATE the printable PDF used to bake in. install /
    // travel / retainer / Y1 sticker all move:
    //   install:  30 × 4_000 + 24 × 1_800 = 163_200
    //   travel:   12 × 1_200 + 30 × 250 + 30 × 100 = 24_900
    //   retainer: 35_000
    //   sticker:  163_200 + 24_900 + 35_000 = 223_100
    expect(seenByPage).not.toBeNull();
    expect(
      getLiveCostValue(seenByPage!, "crossReserve.installRevenue.perReserve"),
    ).toBe(163200);
    expect(
      getLiveCostValue(seenByPage!, "crossReserve.travelPassthrough.example"),
    ).toBe(24900);
    expect(resolveCost(seenByPage!, "crossReserve.retainer.annual")).toBe(
      35000,
    );
    expect(
      getLiveCostValue(seenByPage!, "crossReserve.year1.stickerPrice"),
    ).toBe(223100);

    // Sanity floor: defaults would have produced 148_200 / 22_500 /
    // 30_000 / 200_700. If the seeding pipeline ever regresses to
    // dropping the override, the four assertions above slide back to
    // these and the test fails loudly.
    expect(
      getLiveCostValue(
        DEFAULT_STATE,
        "crossReserve.installRevenue.perReserve",
      ),
    ).toBe(148200);
  });

  it("rejects non-POST requests with 405", async () => {
    const req = makeRequest("GET", null);
    const res = makeResponse();
    let renderCalled = false;
    await handleOnePagerPdfRequest(req, res, {
      pageUrl: "http://127.0.0.1:5173/onepager",
      render: async () => {
        renderCalled = true;
        return Buffer.from("");
      },
    });
    expect(res.statusCode).toBe(405);
    expect(res.headers["allow"]).toBe("POST");
    expect(renderCalled).toBe(false);
  });

  it("returns 400 when the body is not valid JSON", async () => {
    const req = makeRequest("POST", "{not json");
    const res = makeResponse();
    await handleOnePagerPdfRequest(req, res, {
      pageUrl: "http://127.0.0.1:5173/onepager",
      render: async () => Buffer.from(""),
    });
    expect(res.statusCode).toBe(400);
    expect(String(res.body)).toMatch(/Bad request/);
  });

  it("returns 400 when the body is JSON but not an AppState shape", async () => {
    const req = makeRequest("POST", JSON.stringify({ noVersion: true }));
    const res = makeResponse();
    await handleOnePagerPdfRequest(req, res, {
      pageUrl: "http://127.0.0.1:5173/onepager",
      render: async () => Buffer.from(""),
    });
    expect(res.statusCode).toBe(400);
    expect(String(res.body)).toMatch(/AppState/);
  });

  it("falls through cleanly when the body is null (renders against DEFAULT_STATE)", async () => {
    const req = makeRequest("POST", null);
    const res = makeResponse();
    let receivedState: AppState | null | "unset" = "unset";
    await handleOnePagerPdfRequest(req, res, {
      pageUrl: "http://127.0.0.1:5173/onepager",
      render: async (options) => {
        receivedState = options.appState;
        return Buffer.from("%PDF-1.4 default");
      },
    });
    expect(res.statusCode).toBe(200);
    expect(receivedState).toBeNull();
  });

  it("mounts the endpoint under a non-root BASE_PATH so deployed-style routing matches the OnePager button's POST URL", () => {
    // The OnePager button posts to `${import.meta.env.BASE_URL}api/onepager.pdf`.
    // BASE_URL is whatever Vite was configured with — root in this dev
    // workspace today, but a path prefix like
    // "/practitioner-operating-plan/" in the path-routed deploy. The
    // middleware must mount at the same URL the browser posts to,
    // otherwise the request lands on Vite's SPA fallback and the user
    // sees the OnePager HTML in their PDF download.

    // Root base — current dev workspace behaviour:
    expect(joinBaseAndPath("/", "api/onepager.pdf")).toBe(
      "/api/onepager.pdf",
    );
    // Non-root base — typical multi-artifact deploy / preview pane:
    expect(
      joinBaseAndPath("/practitioner-operating-plan/", "api/onepager.pdf"),
    ).toBe("/practitioner-operating-plan/api/onepager.pdf");
    // Tolerates the relative path being given with a leading slash too:
    expect(
      joinBaseAndPath("/practitioner-operating-plan/", "/api/onepager.pdf"),
    ).toBe("/practitioner-operating-plan/api/onepager.pdf");

    // configureServer wires the middleware at exactly that joined path.
    // Drive it with a fake ViteDevServer to confirm the registered
    // mount path and the puppeteer page URL both honour the base.
    const plugin = onePagerPdfPlugin();
    let registeredPath: string | undefined;
    const fakeServer = {
      config: {
        base: "/practitioner-operating-plan/",
        server: { port: 5173 },
      },
      httpServer: null,
      middlewares: {
        use(pathOrHandler: unknown, _handler?: unknown) {
          if (typeof pathOrHandler === "string") {
            registeredPath = pathOrHandler;
          }
        },
      },
    } as unknown as Parameters<
      NonNullable<ReturnType<typeof onePagerPdfPlugin>["configureServer"]>
    >[0];
    const cfg = plugin.configureServer;
    if (typeof cfg === "function") {
      cfg(fakeServer);
    }
    expect(registeredPath).toBe(
      "/practitioner-operating-plan/api/onepager.pdf",
    );
  });

  it("returns 500 with the renderer's error message when puppeteer fails", async () => {
    const req = makeRequest("POST", JSON.stringify(DEFAULT_STATE));
    const res = makeResponse();
    await handleOnePagerPdfRequest(req, res, {
      pageUrl: "http://127.0.0.1:5173/onepager",
      render: async () => {
        throw new Error("Chromium crashed mid-render");
      },
    });
    expect(res.statusCode).toBe(500);
    expect(String(res.body)).toMatch(/Chromium crashed mid-render/);
  });
});
