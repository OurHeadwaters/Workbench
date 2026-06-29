/**
 * kitDeliveryRecovery.test.ts
 *
 * Tests for runKitDeliveryRecovery and stampEmailSent.
 *
 * Strategy: mock @workspace/db with the standard fakeDb, mock kitsMailer and
 * kitsRegistry, then call runKitDeliveryRecovery() directly and assert that it
 * re-sends emails for tokens with emailSentAt IS NULL and stamps them on
 * success.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── DB mock ───────────────────────────────────────────────────────────────────

vi.mock("@workspace/db", async () => {
  const { makeTable, makeFakeDb } = await import("../test/fakeDb");

  const kitTokensTable = makeTable({
    name: "kit_tokens",
    pk: ["token"],
    columns: [
      "token",
      "kitId",
      "buyerEmail",
      "buyerName",
      "purchaseId",
      "createdAt",
      "expiresAt",
      "emailSentAt",
    ],
  });

  const kitDeliveryFailuresTable = makeTable({
    name: "kit_delivery_failures",
    pk: ["id"],
    columns: ["id", "buyerEmail", "kitId", "purchaseId", "error", "resolvedAt", "createdAt"],
  });

  return { db: makeFakeDb(), kitTokensTable, kitDeliveryFailuresTable };
});

vi.mock("drizzle-orm", async () => {
  const { fakeDrizzle } = await import("../test/fakeDb");
  return fakeDrizzle;
});

vi.mock("./logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock("./kitsRegistry", () => ({
  getKit: vi.fn(),
}));

vi.mock("./kitsMailer", () => ({
  sendKitDeliveryEmail: vi.fn().mockResolvedValue({ status: "sent" }),
  sendKitDeliveryFailureAlert: vi.fn().mockResolvedValue(undefined),
}));

// ── imports (after mocks) ─────────────────────────────────────────────────────

import * as dbModule from "@workspace/db";
import type { FakeDb, FakeTable } from "../test/fakeDb";
import * as kitsRegistryModule from "./kitsRegistry";
import * as kitsMailerModule from "./kitsMailer";
import { runKitDeliveryRecovery, stampEmailSent } from "./kitDeliveryRecovery";

const tables = dbModule as unknown as {
  db: FakeDb;
  kitTokensTable: FakeTable;
  kitDeliveryFailuresTable: FakeTable;
};

const getKitMock = kitsRegistryModule.getKit as ReturnType<typeof vi.fn>;
const sendKitDeliveryEmailMock = kitsMailerModule.sendKitDeliveryEmail as ReturnType<typeof vi.fn>;
const sendKitDeliveryFailureAlertMock =
  kitsMailerModule.sendKitDeliveryFailureAlert as ReturnType<typeof vi.fn>;

const FAKE_KIT = {
  id: "economy-kit",
  name: "Economy Kit",
  tagline: "A test kit",
  arcNote: null,
  contentNote: "Test content.",
};

function futureDate(daysFromNow = 90): Date {
  return new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
}

function pastDate(daysAgo = 1): Date {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
}

beforeEach(() => {
  tables.kitTokensTable.__store.length = 0;
  tables.kitDeliveryFailuresTable.__store.length = 0;
  getKitMock.mockClear();
  getKitMock.mockReturnValue(null);
  sendKitDeliveryEmailMock.mockClear();
  sendKitDeliveryEmailMock.mockResolvedValue({ status: "sent" });
  sendKitDeliveryFailureAlertMock.mockClear();
});

// ── stampEmailSent ────────────────────────────────────────────────────────────

describe("stampEmailSent", () => {
  it("sets emailSentAt on the matching token row", async () => {
    tables.kitTokensTable.__store.push({
      token: "tok_stamp_test",
      kitId: "economy-kit",
      buyerEmail: "buyer@example.com",
      buyerName: "Buyer",
      purchaseId: "pi_stamp_test",
      createdAt: new Date(),
      expiresAt: futureDate(),
      emailSentAt: null,
    });

    await stampEmailSent("tok_stamp_test");

    const row = tables.kitTokensTable.__store[0];
    expect(row.emailSentAt).toBeInstanceOf(Date);
  });

  it("does not throw when the token does not exist", async () => {
    await expect(stampEmailSent("tok_nonexistent")).resolves.toBeUndefined();
  });
});

// ── runKitDeliveryRecovery ────────────────────────────────────────────────────

describe("runKitDeliveryRecovery", () => {
  it("does nothing when there are no tokens with emailSentAt IS NULL", async () => {
    tables.kitTokensTable.__store.push({
      token: "tok_already_sent",
      kitId: "economy-kit",
      buyerEmail: "buyer@example.com",
      buyerName: "Buyer",
      purchaseId: "pi_already_sent",
      createdAt: new Date(),
      expiresAt: futureDate(),
      emailSentAt: new Date(),
    });

    await runKitDeliveryRecovery();

    expect(sendKitDeliveryEmailMock).not.toHaveBeenCalled();
  });

  it("re-sends email and stamps emailSentAt for a token with emailSentAt IS NULL", async () => {
    getKitMock.mockReturnValue(FAKE_KIT);
    tables.kitTokensTable.__store.push({
      token: "tok_unsent",
      kitId: "economy-kit",
      buyerEmail: "buyer@example.com",
      buyerName: "Buyer",
      purchaseId: "pi_unsent",
      createdAt: new Date(),
      expiresAt: futureDate(),
      emailSentAt: null,
    });

    await runKitDeliveryRecovery();

    expect(sendKitDeliveryEmailMock).toHaveBeenCalledTimes(1);
    expect(sendKitDeliveryEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "buyer@example.com",
        buyerName: "Buyer",
        kit: FAKE_KIT,
      }),
    );

    const row = tables.kitTokensTable.__store[0];
    expect(row.emailSentAt).toBeInstanceOf(Date);
  });

  it("does not re-send for expired tokens (expiresAt in the past)", async () => {
    getKitMock.mockReturnValue(FAKE_KIT);
    tables.kitTokensTable.__store.push({
      token: "tok_expired",
      kitId: "economy-kit",
      buyerEmail: "buyer@example.com",
      buyerName: "Buyer",
      purchaseId: "pi_expired",
      createdAt: new Date(),
      expiresAt: pastDate(5),
      emailSentAt: null,
    });

    await runKitDeliveryRecovery();

    expect(sendKitDeliveryEmailMock).not.toHaveBeenCalled();
  });

  it("skips tokens with unknown kitId and logs a warning", async () => {
    getKitMock.mockReturnValue(null);
    tables.kitTokensTable.__store.push({
      token: "tok_badkit",
      kitId: "kit-does-not-exist",
      buyerEmail: "buyer@example.com",
      buyerName: "Buyer",
      purchaseId: "pi_badkit",
      createdAt: new Date(),
      expiresAt: futureDate(),
      emailSentAt: null,
    });

    await runKitDeliveryRecovery();

    expect(sendKitDeliveryEmailMock).not.toHaveBeenCalled();
    const row = tables.kitTokensTable.__store[0];
    expect(row.emailSentAt).toBeFalsy();
  });

  it("writes a kitDeliveryFailure record and sends an alert when resend fails", async () => {
    getKitMock.mockReturnValue(FAKE_KIT);
    sendKitDeliveryEmailMock.mockResolvedValue({
      status: "failed",
      error: "gmail 503: upstream",
    });
    tables.kitTokensTable.__store.push({
      token: "tok_failresend",
      kitId: "economy-kit",
      buyerEmail: "buyer@example.com",
      buyerName: "Buyer",
      purchaseId: "pi_failresend",
      createdAt: new Date(),
      expiresAt: futureDate(),
      emailSentAt: null,
    });

    await runKitDeliveryRecovery();

    expect(tables.kitDeliveryFailuresTable.__store).toHaveLength(1);
    expect(tables.kitDeliveryFailuresTable.__store[0].buyerEmail).toBe("buyer@example.com");
    expect(tables.kitDeliveryFailuresTable.__store[0].error).toBe("gmail 503: upstream");

    expect(sendKitDeliveryFailureAlertMock).toHaveBeenCalledTimes(1);
    expect(sendKitDeliveryFailureAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        buyerEmail: "buyer@example.com",
        kitId: "economy-kit",
        purchaseId: "pi_failresend",
      }),
    );

    const row = tables.kitTokensTable.__store[0];
    expect(row.emailSentAt).toBeFalsy();
  });

  it("processes multiple pending tokens independently", async () => {
    getKitMock.mockReturnValue(FAKE_KIT);
    tables.kitTokensTable.__store.push(
      {
        token: "tok_multi_a",
        kitId: "economy-kit",
        buyerEmail: "a@example.com",
        buyerName: "A",
        purchaseId: "pi_multi_a",
        createdAt: new Date(),
        expiresAt: futureDate(),
        emailSentAt: null,
      },
      {
        token: "tok_multi_b",
        kitId: "economy-kit",
        buyerEmail: "b@example.com",
        buyerName: "B",
        purchaseId: "pi_multi_b",
        createdAt: new Date(),
        expiresAt: futureDate(),
        emailSentAt: null,
      },
      {
        token: "tok_multi_c_sent",
        kitId: "economy-kit",
        buyerEmail: "c@example.com",
        buyerName: "C",
        purchaseId: "pi_multi_c",
        createdAt: new Date(),
        expiresAt: futureDate(),
        emailSentAt: new Date(),
      },
    );

    await runKitDeliveryRecovery();

    expect(sendKitDeliveryEmailMock).toHaveBeenCalledTimes(2);

    const rows = tables.kitTokensTable.__store;
    const a = rows.find((r) => r.token === "tok_multi_a");
    const b = rows.find((r) => r.token === "tok_multi_b");
    const c = rows.find((r) => r.token === "tok_multi_c_sent");
    expect(a?.emailSentAt).toBeInstanceOf(Date);
    expect(b?.emailSentAt).toBeInstanceOf(Date);
    expect(c?.emailSentAt).toBeInstanceOf(Date);
  });
});
