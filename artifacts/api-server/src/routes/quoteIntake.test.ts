import { beforeEach, describe, expect, it, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

const mocks = vi.hoisted(() => ({
  sendQuoteEmail: vi.fn(),
  launch: vi.fn(),
  setContent: vi.fn(),
  pdf: vi.fn(),
  close: vi.fn(),
  loggerError: vi.fn(),
}));

vi.mock("@workspace/db", async () => {
  const { makeTable, makeFakeDb } = await import("../test/fakeDb");
  const quoteRequestsTable = makeTable({
    name: "quote_requests",
    pk: ["id"],
    columns: [
      "id",
      "quoteNumber",
      "contactName",
      "email",
      "role",
      "legalOrganizationName",
      "organizationType",
      "organizationAddress",
      "projectTitle",
      "fundingProgram",
      "desiredTiming",
      "selectedOffer",
      "projectDescription",
      "desiredOutcome",
      "intendedUsers",
      "approximateScale",
      "currentSystems",
      "accessibilityConnectivityNeeds",
      "integrationNeeded",
      "sensitiveDataInvolved",
      "specialRequirements",
      "mode",
      "subtotalCents",
      "taxCents",
      "totalCents",
      "validUntil",
      "customerDeliveryStatus",
      "customerDeliveryError",
      "operatorDeliveryStatus",
      "operatorDeliveryError",
      "sourceIp",
      "userAgent",
      "createdAt",
    ],
    defaults: {
      customerDeliveryStatus: null,
      customerDeliveryError: null,
      operatorDeliveryStatus: null,
      operatorDeliveryError: null,
    },
  });
  return { db: makeFakeDb(), quoteRequestsTable };
});

vi.mock("drizzle-orm", async () => {
  const { fakeDrizzle } = await import("../test/fakeDb");
  return fakeDrizzle;
});

vi.mock("../lib/quoteMailer", () => ({
  sendQuoteEmail: mocks.sendQuoteEmail,
}));

vi.mock("../lib/logger", () => ({
  logger: { error: mocks.loggerError, warn: vi.fn(), info: vi.fn() },
}));

vi.mock("child_process", () => ({
  execFileSync: vi.fn().mockReturnValue("/usr/bin/chromium\n"),
}));

vi.mock("puppeteer-core", () => ({
  default: { launch: mocks.launch },
}));

import express from "express";
import { db, quoteRequestsTable } from "@workspace/db";
import quoteIntakeRouter from "./quoteIntake";
import { signQuoteId } from "../lib/headwatersQuote";
import { __resetRateLimitForTests } from "../lib/rateLimit";

type StoredRow = Record<string, unknown>;
type TestTable = typeof quoteRequestsTable & { __store: StoredRow[] };

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/", quoteIntakeRouter);
  const server: Server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address() as AddressInfo;
  return {
    base: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      ),
  };
}

function payload(overrides: Record<string, unknown> = {}) {
  return {
    contactName: "Funding Lead",
    email: "funding@example.test",
    role: "Director",
    legalOrganizationName: "North Shore Co-op",
    organizationType: "co-op/not-for-profit",
    organizationAddress: "1 Main Street, Wabigoon, ON",
    projectTitle: "Community operations system",
    fundingProgram: "Community fund",
    desiredTiming: "Fall 2026",
    selectedOffer: "year 1 codetry engagement",
    projectDescription: "Make operations easier to carry locally.",
    desiredOutcome: "A working system with trained local operators.",
    intendedUsers: "Staff and board",
    approximateScale: "12 operators",
    currentSystems: "Spreadsheets",
    accessibilityConnectivityNeeds: "Low bandwidth",
    integrationNeeded: "no",
    sensitiveDataInvolved: "no",
    specialRequirements: "",
    website: "",
    ...overrides,
  };
}

let ipSequence = 1;
async function post(
  base: string,
  body: Record<string, unknown>,
  ip = `10.90.0.${ipSequence++}`,
): Promise<Response> {
  return fetch(`${base}/quote-intake`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

beforeEach(async () => {
  process.env.SESSION_SECRET = "quote-route-test-secret";
  (quoteRequestsTable as TestTable).__store.length = 0;
  await __resetRateLimitForTests();
  mocks.sendQuoteEmail.mockReset();
  mocks.sendQuoteEmail.mockResolvedValue({ status: "sent", messageId: "test-message" });
  mocks.setContent.mockReset();
  mocks.pdf.mockReset();
  mocks.pdf.mockResolvedValue(Buffer.from("%PDF-1.4 test"));
  mocks.close.mockReset();
  mocks.launch.mockReset();
  mocks.launch.mockResolvedValue({
    newPage: async () => ({
      setContent: mocks.setContent,
      pdf: mocks.pdf,
    }),
    close: mocks.close,
  });
  mocks.loggerError.mockReset();
});

describe("POST /quote-intake", () => {
  it.each([
    ["co-op/not-for-profit", 2_000_000],
    ["community organization", 2_000_000],
    ["commercial/institutional", 2_000_000],
  ])("creates the correct standard quote for %s", async (organizationType, subtotalCents) => {
    const harness = await startHarness();
    try {
      const response = await post(harness.base, payload({ organizationType }));
      const body = (await response.json()) as Record<string, unknown>;
      expect(response.status).toBe(201);
      expect(body).toMatchObject({
        ok: true,
        mode: "standard",
        deliveryStatus: "sent",
      });
      expect(body.pdfUrl).toMatch(/^\/api\/quote-intake\/.+\/quote\.pdf\?sig=/);
      expect((quoteRequestsTable as TestTable).__store[0]).toMatchObject({
        organizationType,
        mode: "standard",
        subtotalCents,
      });
      expect(mocks.sendQuoteEmail).toHaveBeenCalledTimes(2);
    } finally {
      await harness.close();
    }
  });

  it.each([
    ["integration", { integrationNeeded: "yes" }],
    ["sensitive data", { sensitiveDataInvolved: "yes" }],
    ["special requirements", { specialRequirements: "Must work offline in winter." }],
    ["an explicit custom request", { selectedOffer: "needs custom review" }],
  ])("forces human review for %s", async (_reason, overrides) => {
    const harness = await startHarness();
    try {
      const response = await post(harness.base, payload(overrides));
      const body = (await response.json()) as Record<string, unknown>;
      expect(response.status).toBe(201);
      expect(body.mode).toBe("custom");
      expect(body).not.toHaveProperty("pdfUrl");
      expect((quoteRequestsTable as TestTable).__store[0]).toMatchObject({
        mode: "custom",
        subtotalCents: null,
      });
    } finally {
      await harness.close();
    }
  });

  it("rejects invalid required details before saving or sending mail", async () => {
    const harness = await startHarness();
    try {
      const response = await post(harness.base, payload({ email: "not-an-email" }));
      expect(response.status).toBe(422);
      expect((quoteRequestsTable as TestTable).__store).toHaveLength(0);
      expect(mocks.sendQuoteEmail).not.toHaveBeenCalled();
    } finally {
      await harness.close();
    }
  });

  it("quietly accepts the honeypot without saving or sending mail", async () => {
    const harness = await startHarness();
    try {
      const response = await post(harness.base, payload({ website: "x" }));
      expect(response.status).toBe(201);
      expect((quoteRequestsTable as TestTable).__store).toHaveLength(0);
      expect(mocks.sendQuoteEmail).not.toHaveBeenCalled();
    } finally {
      await harness.close();
    }
  });

  it("rate-limits the fifth request from one address", async () => {
    const harness = await startHarness();
    try {
      const ip = "10.90.1.1";
      for (let attempt = 0; attempt < 4; attempt += 1) {
        expect((await post(harness.base, payload(), ip)).status).toBe(201);
      }
      const response = await post(harness.base, payload(), ip);
      const body = (await response.json()) as { error?: string; retryAfterSec?: number };
      expect(response.status).toBe(429);
      expect(body.error).toMatch(/too many quote requests/i);
      expect(body.retryAfterSec).toBeGreaterThan(0);
    } finally {
      await harness.close();
    }
  });

  it("keeps the saved request and reports recoverable partial email delivery", async () => {
    mocks.sendQuoteEmail
      .mockResolvedValueOnce({ status: "failed", error: "gmail unavailable" })
      .mockResolvedValueOnce({ status: "sent", messageId: "operator-copy" });
    const harness = await startHarness();
    try {
      const response = await post(harness.base, payload());
      const body = (await response.json()) as Record<string, unknown>;
      expect(response.status).toBe(201);
      expect(body.deliveryStatus).toBe("partial");
      expect((quoteRequestsTable as TestTable).__store[0]).toMatchObject({
        customerDeliveryStatus: "failed",
        operatorDeliveryStatus: "sent",
      });
    } finally {
      await harness.close();
    }
  });

  it("returns a retryable error when the request cannot be saved", async () => {
    const insertSpy = vi.spyOn(db, "insert").mockImplementationOnce(() => {
      throw new Error("database unavailable");
    });
    const harness = await startHarness();
    try {
      const response = await post(harness.base, payload());
      const body = (await response.json()) as { error?: string };
      expect(response.status).toBe(503);
      expect(body.error).toMatch(/nothing was lost in this form/i);
      expect(mocks.sendQuoteEmail).not.toHaveBeenCalled();
    } finally {
      insertSpy.mockRestore();
      await harness.close();
    }
  });
});

describe("GET /quote-intake/:id/quote.pdf", () => {
  async function createQuote(harness: Harness): Promise<string> {
    const response = await post(harness.base, payload());
    const body = (await response.json()) as { pdfUrl: string };
    return body.pdfUrl.replace(/^\/api/, "");
  }

  it("rejects unsigned and tampered quote links", async () => {
    const harness = await startHarness();
    try {
      const pdfUrl = await createQuote(harness);
      const id = pdfUrl.split("/")[2]!;
      expect((await fetch(`${harness.base}/quote-intake/${id}/quote.pdf`)).status).toBe(403);
      expect(
        (await fetch(`${harness.base}/quote-intake/${id}/quote.pdf?sig=tampered`)).status,
      ).toBe(403);
    } finally {
      await harness.close();
    }
  });

  it("returns 410 after a signed quote expires", async () => {
    const harness = await startHarness();
    try {
      const pdfUrl = await createQuote(harness);
      const row = (quoteRequestsTable as TestTable).__store[0]!;
      row.validUntil = new Date(Date.now() - 1_000);
      const response = await fetch(`${harness.base}${pdfUrl}`);
      const body = (await response.json()) as { error?: string };
      expect(response.status).toBe(410);
      expect(body.error).toMatch(/expired/i);
      expect(mocks.launch).not.toHaveBeenCalled();
    } finally {
      await harness.close();
    }
  });

  it("renders a print-ready PDF as a private attachment", async () => {
    const harness = await startHarness();
    try {
      const pdfUrl = await createQuote(harness);
      const response = await fetch(`${harness.base}${pdfUrl}`);
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("application/pdf");
      expect(response.headers.get("content-disposition")).toMatch(
        /attachment; filename="HW-\d{8}-[A-F0-9]{6}\.pdf"/,
      );
      expect(response.headers.get("cache-control")).toBe("private, no-store");
      expect(mocks.setContent).toHaveBeenCalledWith(
        expect.stringContaining("Grant-ready"),
        expect.objectContaining({ waitUntil: "networkidle0" }),
      );
      expect(mocks.pdf).toHaveBeenCalledWith(
        expect.objectContaining({ format: "Letter", printBackground: true }),
      );
      expect(mocks.close).toHaveBeenCalledOnce();
    } finally {
      await harness.close();
    }
  });

  it("returns a clear retryable response when PDF generation fails", async () => {
    mocks.launch.mockRejectedValueOnce(new Error("chromium unavailable"));
    const harness = await startHarness();
    try {
      const pdfUrl = await createQuote(harness);
      const response = await fetch(`${harness.base}${pdfUrl}`);
      const body = (await response.json()) as { error?: string };
      expect(response.status).toBe(503);
      expect(body.error).toMatch(/request is saved/i);
    } finally {
      await harness.close();
    }
  });

  it("does not make custom-review requests downloadable", async () => {
    const harness = await startHarness();
    try {
      const response = await post(
        harness.base,
        payload({ selectedOffer: "needs custom review" }),
      );
      expect(response.status).toBe(201);
      const row = (quoteRequestsTable as TestTable).__store[0]!;
      const signature = signQuoteId(String(row.id));
      const pdfResponse = await fetch(
        `${harness.base}/quote-intake/${row.id}/quote.pdf?sig=${signature}`,
      );
      expect(pdfResponse.status).toBe(404);
    } finally {
      await harness.close();
    }
  });
});