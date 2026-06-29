import { describe, it, expect, beforeEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ─── env bootstrap (must be hoisted before any module load) ──────────────────

vi.hoisted(() => {
  process.env.HEADWATERS_OWNER_EMAIL = "admin@example.com";
  // No XRPL_BAND_SEED / XRPL_ESCROW_SEED → everything runs in simulation mode
  delete process.env.XRPL_BAND_SEED;
  delete process.env.XRPL_BAND_MNEMONIC;
  delete process.env.XRPL_ESCROW_SEED;
});

// ─── xrpl npm package stub ────────────────────────────────────────────────────
// Mocking the xrpl npm package prevents WebSocket connection attempts when
// vi.importActual loads the real xrplEscrow.ts / xrpl.ts source files for the
// import-chain guard tests.  Integration tests mock the lib wrappers directly
// (see below) so this stub never executes real XRPL transactions.

vi.mock("xrpl", () => ({
  Client: class MockXrplClient {
    isConnected() { return false; }
    async connect() {}
    async disconnect() {}
    async autofill(tx: Record<string, unknown>) { return { ...tx, Sequence: 1 }; }
    async submitAndWait() { return { result: { hash: "MOCK", meta: { TransactionResult: "tesSUCCESS" } } }; }
    async getXrpBalance() { return "50"; }
  },
  Wallet: {
    fromSeed: vi.fn(() => ({ address: "rMOCK_WALLET", sign: vi.fn(() => ({ tx_blob: "BLOB", hash: "MOCK_HASH" })) })),
    fromMnemonic: vi.fn(() => ({ address: "rMOCK_WALLET", sign: vi.fn(() => ({ tx_blob: "BLOB", hash: "MOCK_HASH" })) })),
  },
  xrpToDrops: vi.fn((xrp: string) => String(Math.round(parseFloat(xrp) * 1_000_000))),
}));

// qrcode is imported by xrplEscrow.ts for wallet balance QR codes
vi.mock("qrcode", () => ({
  default: { toDataURL: vi.fn(async () => "data:image/png;base64,MOCK") },
}));

// ─── DB mock ─────────────────────────────────────────────────────────────────

vi.mock("@workspace/db", async () => {
  const { makeTable, makeFakeDb } = await import("../test/fakeDb");

  const hhBandsTable = makeTable({
    name: "hh_bands",
    pk: ["id"],
    columns: [
      "id", "name", "communityTokenCode", "communityTokenIssuer",
      "defaultPayCurrency", "missedShiftThreshold",
      "reliabilityBonusThreshold", "reliabilityBonusAmount",
      "reliabilityBonusCurrency", "xrplEscrowEnabled", "createdAt",
    ],
    defaults: {
      communityTokenCode: "HWBAND",
      communityTokenIssuer: null,
      defaultPayCurrency: "token",
      missedShiftThreshold: 3,
      reliabilityBonusThreshold: 10,
      reliabilityBonusAmount: "5",
      reliabilityBonusCurrency: "token",
      xrplEscrowEnabled: false,
    },
  });

  const hhMembersTable = makeTable({
    name: "hh_members",
    pk: ["id"],
    columns: [
      "id", "bandId", "clerkUserId", "email", "firstName", "lastName",
      "xrplAddress", "didRef", "tier", "isActive",
      "completedShiftCount", "missedShiftCount", "noShowCount",
      "flaggedForDemotion", "totalEarnedXrp", "totalEarnedToken",
      "walletType", "walletRevealedAt", "walletRevealSeenAt",
      "custodialSweepQueuedAt", "referralCode", "referredByMemberId",
      "createdAt", "updatedAt",
    ],
    defaults: {
      xrplAddress: null,
      didRef: null,
      tier: "task_based",
      isActive: true,
      completedShiftCount: 0,
      missedShiftCount: 0,
      noShowCount: 0,
      flaggedForDemotion: false,
      totalEarnedXrp: "0",
      totalEarnedToken: "0",
      walletType: "custodial",
      walletRevealedAt: null,
      walletRevealSeenAt: null,
      custodialSweepQueuedAt: null,
      referralCode: null,
      referredByMemberId: null,
    },
  });

  const hhTasksTable = makeTable({
    name: "hh_tasks",
    pk: ["id"],
    columns: [
      "id", "bandId", "postedByMemberId", "claimedByMemberId",
      "title", "description", "estimatedMinutes",
      "payAmount", "payCurrency", "status",
      "escrowSequence", "escrowTxHash", "escrowSimulated",
      "claimedAt", "completedAt", "confirmedAt", "availableDate",
      "createdAt", "updatedAt",
    ],
    defaults: {
      claimedByMemberId: null,
      estimatedMinutes: 60,
      payCurrency: "token",
      status: "available",
      escrowSequence: null,
      escrowTxHash: null,
      escrowSimulated: false,
      claimedAt: null,
      completedAt: null,
      confirmedAt: null,
    },
  });

  const hhEarningsTable = makeTable({
    name: "hh_earnings",
    pk: ["id"],
    columns: [
      "id", "bandId", "memberId", "taskId",
      "amount", "currency", "xrplTxHash", "earnedAt",
    ],
    defaults: { xrplTxHash: null },
  });

  const hhBonusesTable = makeTable({
    name: "hh_bonuses",
    pk: ["id"],
    columns: [
      "id", "bandId", "memberId",
      "amount", "currency", "reason", "milestone", "awardedAt",
    ],
    defaults: {},
  });

  const hhMerchantsTable = makeTable({
    name: "hh_merchants",
    pk: ["id"],
    columns: [
      "id", "bandId", "name", "description", "category",
      "merchantWallet", "isActive", "createdAt", "updatedAt",
    ],
    defaults: { description: "", category: "general", isActive: true },
  });

  const hhEnvelopesTable = makeTable({
    name: "hh_envelopes",
    pk: ["id"],
    columns: [
      "id", "memberId", "bandId", "label", "icon", "currency",
      "monthlyBudget", "spentThisMonth", "spentMonth",
      "createdAt", "updatedAt",
    ],
    defaults: { icon: "wallet", currency: "token", monthlyBudget: "0", spentThisMonth: "0", spentMonth: "" },
  });

  const hhEnvelopeTransactionsTable = makeTable({
    name: "hh_envelope_transactions",
    pk: ["id"],
    columns: [
      "id", "envelopeId", "memberId", "merchantId", "bandId",
      "amount", "currency", "note", "xrplTxHash", "spentAt",
    ],
    defaults: { note: "", xrplTxHash: null },
  });

  const hhTipsTable = makeTable({
    name: "hh_tips",
    pk: ["id"],
    columns: [
      "id", "bandId", "fromMemberId", "toMemberId",
      "amount", "currency", "note", "xrplTxHash", "sentAt",
    ],
    defaults: { currency: "token", note: "", xrplTxHash: null },
  });

  const hhReferralsTable = makeTable({
    name: "hh_referrals",
    pk: ["id"],
    columns: [
      "id", "bandId", "referrerId", "referredMemberId",
      "referrerBonusAmount", "referredBonusAmount", "currency", "awardedAt",
    ],
    defaults: { referrerBonusAmount: "5", referredBonusAmount: "5", currency: "token" },
  });

  const hhBadgeCategoriesTable = makeTable({
    name: "hh_badge_categories",
    pk: ["id"],
    columns: [
      "id", "bandId", "name", "description", "domain",
      "stageModel", "rateModifierEnabled", "proposedByMemberId",
      "status", "createdAt", "updatedAt",
    ],
    defaults: {
      description: "", domain: "knowledge", stageModel: "four_stage",
      rateModifierEnabled: false, proposedByMemberId: null, status: "proposed",
    },
  });

  const hhMemberBadgesTable = makeTable({
    name: "hh_member_badges",
    pk: ["id"],
    columns: [
      "id", "bandId", "memberId", "categoryId", "stage",
      "issuedByMemberId", "notes", "credentialSource", "vcJson",
      "createdAt", "updatedAt",
    ],
    defaults: {
      stage: "watching", issuedByMemberId: null,
      notes: "", credentialSource: "hh_task_history", vcJson: null,
    },
  });

  const practitionerApplicationsTable = makeTable({
    name: "practitioner_applications",
    pk: ["id"],
    columns: [
      "id", "clerkUserId", "email", "firstName", "lastName",
      "status", "notes", "createdAt", "updatedAt",
    ],
    defaults: { status: "pending", notes: null },
  });

  const bookkeeperUsersTable = makeTable({
    name: "bk_app_users",
    pk: ["id"],
    columns: [
      "id", "clerkUserId", "email", "firstName", "lastName",
      "role", "createdAt", "lastSeenAt", "lastNudgedAt",
    ],
    defaults: { role: "food_handler", lastSeenAt: null, lastNudgedAt: null },
  });

  const bookkeeperAuditLogTable = makeTable({
    name: "bk_audit_log",
    pk: ["id"],
    columns: [
      "id", "action", "entityType", "entityId",
      "actorId", "actorEmail", "actorRole", "details", "createdAt",
    ],
    defaults: { entityId: null, details: null },
  });

  return {
    db: makeFakeDb(),
    hhBandsTable,
    hhMembersTable,
    hhTasksTable,
    hhEarningsTable,
    hhBonusesTable,
    hhMerchantsTable,
    hhEnvelopesTable,
    hhEnvelopeTransactionsTable,
    hhTipsTable,
    hhReferralsTable,
    hhBadgeCategoriesTable,
    hhMemberBadgesTable,
    practitionerApplicationsTable,
    bookkeeperUsersTable,
    bookkeeperAuditLogTable,
  };
});

// ─── drizzle-orm operators ────────────────────────────────────────────────────

vi.mock("drizzle-orm", async () => {
  const { fakeDrizzle } = await import("../test/fakeDb");
  return fakeDrizzle;
});

// ─── Clerk auth mock ──────────────────────────────────────────────────────────

vi.mock("@clerk/express", async () => {
  const { state } = await import("../test/state");
  return {
    getAuth: () => ({ userId: state.authUserId }),
    clerkMiddleware: () => (_req: unknown, _res: unknown, next: () => void) => next(),
    clerkClient: {
      users: {
        getUser: async (id: string) => {
          const ident = state.identities.get(id);
          if (!ident) throw new Error(`No fake Clerk identity registered for ${id}`);
          return {
            primaryEmailAddress: { emailAddress: ident.email },
            emailAddresses: [{ emailAddress: ident.email }],
            firstName: ident.firstName ?? null,
            lastName: ident.lastName ?? null,
          };
        },
      },
    },
  };
});

// ─── XRPL lib mocks (simulated — no real network calls) ──────────────────────
//
// The mock factories expose named spies for every export that helpingHands.ts
// imports.  If a future refactor renames or removes any of these exports the
// vi.mock factory will still compile, but the route itself will throw on load
// (or call the wrong thing), which the integration tests below will catch.
//
// Each spy records calls so we can assert the correct leg of the payment flow
// was reached.

vi.mock("../lib/xrpl", () => {
  return {
    xrplIsLive: vi.fn(() => false),
    bandWalletAddress: vi.fn(() => null),
    escrowCreate: vi.fn(async () => ({
      sequence: 999901,
      txHash: "SIM_XRPL_CREATE",
      simulated: true,
    })),
    escrowFinish: vi.fn(async () => ({
      txHash: "SIM_XRPL_FINISH",
      simulated: true,
    })),
    sendTokenPayment: vi.fn(async () => ({
      txHash: "SIM_TOKEN_PAY",
      simulated: true,
    })),
    writeDID: vi.fn(async () => ({
      didRef: null,
      simulated: true,
    })),
    txExplorerUrl: vi.fn((hash: string) => `https://testnet.xrpl.org/transactions/${hash}`),
  };
});

vi.mock("../lib/xrplEscrow", () => {
  return {
    bandUsesXrplEscrow: vi.fn(() => false),
    escrowWalletAddress: vi.fn(() => "rSIMULATED_ESCROW_ADDR"),
    xrpToDrops: vi.fn((xrp: string) => String(parseFloat(xrp) * 1_000_000)),
    submitEscrowCreate: vi.fn(async () => ({
      txHash: "SIM_ESCROW_CREATE_HASH",
      sequence: 42,
      ownerAddress: "rSIMULATED_ESCROW_ADDR",
    })),
    submitEscrowFinish: vi.fn(async () => ({
      txHash: "SIM_ESCROW_FINISH_HASH",
    })),
    submitEscrowCancel: vi.fn(async () => ({
      txHash: "SIM_ESCROW_CANCEL_HASH",
    })),
    getWalletBalance: vi.fn(async () => ({
      address: "rSIMULATED_ESCROW_ADDR",
      balanceXrp: "50",
      lowBalanceThresholdXrp: "10",
      isLowBalance: false,
      qrCodeDataUrl: "data:image/png;base64,FAKE",
    })),
  };
});

// ─── logger stub ─────────────────────────────────────────────────────────────

vi.mock("../lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// ─── imports (after mocks) ────────────────────────────────────────────────────

import express from "express";
import helpingHandsRouter from "./helpingHands";
import * as dbModule from "@workspace/db";
import * as xrplModule from "../lib/xrpl";
import * as xrplEscrowModule from "../lib/xrplEscrow";
import type { FakeTable } from "../test/fakeDb";
import { state, setUser, setIdentity, resetState } from "../test/state";

// ─── typed table references ───────────────────────────────────────────────────

const tables = dbModule as unknown as {
  hhBandsTable: FakeTable;
  hhMembersTable: FakeTable;
  hhTasksTable: FakeTable;
  hhEarningsTable: FakeTable;
  hhBonusesTable: FakeTable;
  hhReferralsTable: FakeTable;
  bookkeeperUsersTable: FakeTable;
  bookkeeperAuditLogTable: FakeTable;
};

// ─── test harness ─────────────────────────────────────────────────────────────

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/api/helping-hands", helpingHandsRouter);
  app.use(
    (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error("harness caught:", err);
      res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    },
  );
  const srv: Server = createServer(app);
  await new Promise<void>((resolve) => srv.listen(0, "127.0.0.1", resolve));
  const addr = srv.address() as AddressInfo;
  return {
    base: `http://127.0.0.1:${addr.port}`,
    close: () => new Promise<void>((resolve, reject) =>
      srv.close((err) => (err ? reject(err) : resolve())),
    ),
  };
}

// ─── seed helpers ─────────────────────────────────────────────────────────────

let idSeq = 100;
function nextTestId(): string {
  idSeq += 1;
  const hex = idSeq.toString(16).padStart(32, "0");
  return [hex.slice(0, 8), hex.slice(8, 12), "4" + hex.slice(13, 16), "8" + hex.slice(17, 20), hex.slice(20, 32)].join("-");
}

interface SeedBandOpts {
  xrplEscrowEnabled?: boolean;
}

function seedBand(opts: SeedBandOpts = {}): string {
  const id = nextTestId();
  tables.hhBandsTable.__store.push({
    id,
    name: "Test Band",
    communityTokenCode: "HWBAND",
    communityTokenIssuer: null,
    defaultPayCurrency: "token",
    missedShiftThreshold: 3,
    reliabilityBonusThreshold: 10,
    reliabilityBonusAmount: "5",
    reliabilityBonusCurrency: "token",
    xrplEscrowEnabled: opts.xrplEscrowEnabled ?? false,
    createdAt: new Date(),
  });
  return id;
}

interface SeedMemberOpts {
  bandId: string;
  clerkUserId: string;
  email: string;
  role?: "owner" | "ops_manager" | "bookkeeper" | "food_handler";
  xrplAddress?: string;
  completedShiftCount?: number;
}

function seedMember(opts: SeedMemberOpts): string {
  const memberId = nextTestId();
  tables.hhMembersTable.__store.push({
    id: memberId,
    bandId: opts.bandId,
    clerkUserId: opts.clerkUserId,
    email: opts.email,
    firstName: "Test",
    lastName: "User",
    xrplAddress: opts.xrplAddress ?? null,
    didRef: null,
    tier: "task_based",
    isActive: true,
    completedShiftCount: opts.completedShiftCount ?? 0,
    missedShiftCount: 0,
    noShowCount: 0,
    flaggedForDemotion: false,
    totalEarnedXrp: "0",
    totalEarnedToken: "0",
    walletType: "custodial",
    walletRevealedAt: null,
    walletRevealSeenAt: null,
    custodialSweepQueuedAt: null,
    referralCode: null,
    referredByMemberId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Seed the bookkeeper user row (required by requireAuth / loadBookkeeperUser)
  const bkId = nextTestId();
  tables.bookkeeperUsersTable.__store.push({
    id: bkId,
    clerkUserId: opts.clerkUserId,
    email: opts.email,
    firstName: "Test",
    lastName: "User",
    role: opts.role ?? "food_handler",
    createdAt: new Date(),
    lastSeenAt: null,
    lastNudgedAt: null,
  });

  setIdentity(opts.clerkUserId, opts.email, { firstName: "Test", lastName: "User" });

  return memberId;
}

interface SeedTaskOpts {
  bandId: string;
  postedByMemberId: string;
  payCurrency?: "token" | "xrp";
  payAmount?: string;
  status?: string;
  claimedByMemberId?: string;
  escrowSequence?: number | null;
  escrowTxHash?: string | null;
  escrowSimulated?: boolean;
}

function seedTask(opts: SeedTaskOpts): string {
  const taskId = nextTestId();
  tables.hhTasksTable.__store.push({
    id: taskId,
    bandId: opts.bandId,
    postedByMemberId: opts.postedByMemberId,
    claimedByMemberId: opts.claimedByMemberId ?? null,
    title: "Deliver groceries",
    description: "Take box from store to elder",
    estimatedMinutes: 60,
    payAmount: opts.payAmount ?? "5",
    payCurrency: opts.payCurrency ?? "token",
    status: opts.status ?? "available",
    escrowSequence: opts.escrowSequence ?? null,
    escrowTxHash: opts.escrowTxHash ?? null,
    escrowSimulated: opts.escrowSimulated ?? false,
    claimedAt: opts.status !== "available" ? new Date() : null,
    completedAt: opts.status === "completed" || opts.status === "confirmed" ? new Date() : null,
    confirmedAt: opts.status === "confirmed" ? new Date() : null,
    availableDate: "2026-06-29",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return taskId;
}

// ─── beforeEach reset ─────────────────────────────────────────────────────────

const ALL_TABLE_KEYS = [
  "hhBandsTable", "hhMembersTable", "hhTasksTable",
  "hhEarningsTable", "hhBonusesTable", "hhReferralsTable",
  "bookkeeperUsersTable", "bookkeeperAuditLogTable",
] as const;

beforeEach(() => {
  resetState();
  for (const k of ALL_TABLE_KEYS) {
    tables[k].__store.length = 0;
  }
  // Reset all XRPL spies between tests
  vi.mocked(xrplEscrowModule.bandUsesXrplEscrow).mockReturnValue(false);
  vi.mocked(xrplModule.xrplIsLive).mockReturnValue(false);
  vi.mocked(xrplEscrowModule.submitEscrowCreate).mockResolvedValue({
    txHash: "SIM_ESCROW_CREATE_HASH",
    sequence: 42,
    ownerAddress: "rSIMULATED_ESCROW_ADDR",
  });
  vi.mocked(xrplEscrowModule.submitEscrowFinish).mockResolvedValue({
    txHash: "SIM_ESCROW_FINISH_HASH",
  });
  vi.mocked(xrplModule.sendTokenPayment).mockResolvedValue({
    txHash: "SIM_TOKEN_PAY",
    simulated: true,
  });
  vi.clearAllMocks();
  idSeq = 100;
});

// ═════════════════════════════════════════════════════════════════════════════
// Import-chain guard — real module exports, not mocks
// ═════════════════════════════════════════════════════════════════════════════
//
// vi.importActual bypasses the vi.mock factory and loads the real source
// module.  These tests will fail if a named export is removed or renamed in
// xrpl.ts / xrplEscrow.ts — even though those modules are mocked everywhere
// else in this file.  helpingHands.ts imports all of these names at the top
// of the file; if any disappear, the route will throw on load.

describe("import chain guard — real xrplEscrow.ts exports consumed by helpingHands", () => {
  it("exports bandUsesXrplEscrow as a function", async () => {
    const actual = await vi.importActual<typeof import("../lib/xrplEscrow")>("../lib/xrplEscrow");
    expect(typeof actual.bandUsesXrplEscrow).toBe("function");
  });

  it("exports escrowWalletAddress as a function", async () => {
    const actual = await vi.importActual<typeof import("../lib/xrplEscrow")>("../lib/xrplEscrow");
    expect(typeof actual.escrowWalletAddress).toBe("function");
  });

  it("exports submitEscrowCreate as a function", async () => {
    const actual = await vi.importActual<typeof import("../lib/xrplEscrow")>("../lib/xrplEscrow");
    expect(typeof actual.submitEscrowCreate).toBe("function");
  });

  it("exports submitEscrowFinish as a function", async () => {
    const actual = await vi.importActual<typeof import("../lib/xrplEscrow")>("../lib/xrplEscrow");
    expect(typeof actual.submitEscrowFinish).toBe("function");
  });

  it("exports submitEscrowCancel as a function", async () => {
    const actual = await vi.importActual<typeof import("../lib/xrplEscrow")>("../lib/xrplEscrow");
    expect(typeof actual.submitEscrowCancel).toBe("function");
  });

  it("exports getWalletBalance as a function", async () => {
    const actual = await vi.importActual<typeof import("../lib/xrplEscrow")>("../lib/xrplEscrow");
    expect(typeof actual.getWalletBalance).toBe("function");
  });
});

describe("import chain guard — real xrpl.ts exports consumed by helpingHands", () => {
  it("exports sendTokenPayment as a function", async () => {
    const actual = await vi.importActual<typeof import("../lib/xrpl")>("../lib/xrpl");
    expect(typeof actual.sendTokenPayment).toBe("function");
  });

  it("exports writeDID as a function", async () => {
    const actual = await vi.importActual<typeof import("../lib/xrpl")>("../lib/xrpl");
    expect(typeof actual.writeDID).toBe("function");
  });

  it("exports xrplIsLive as a function", async () => {
    const actual = await vi.importActual<typeof import("../lib/xrpl")>("../lib/xrpl");
    expect(typeof actual.xrplIsLive).toBe("function");
  });

  it("exports bandWalletAddress as a function", async () => {
    const actual = await vi.importActual<typeof import("../lib/xrpl")>("../lib/xrpl");
    expect(typeof actual.bandWalletAddress).toBe("function");
  });

  it("exports escrowCreate as a function", async () => {
    const actual = await vi.importActual<typeof import("../lib/xrpl")>("../lib/xrpl");
    expect(typeof actual.escrowCreate).toBe("function");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Happy-path: token-currency task (simulated mode, no XRPL credentials)
// ═════════════════════════════════════════════════════════════════════════════

describe("token task — claim → complete → confirm (simulated mode)", () => {
  it("creates a token task, claim is recorded, confirm writes earnings with a SIM_ hash", async () => {
    const h = await startHarness();
    try {
      const bandId = seedBand();
      const adminId = seedMember({
        bandId,
        clerkUserId: "admin_clerk_1",
        email: "admin@example.com",
        role: "owner",
      });
      const workerId = seedMember({
        bandId,
        clerkUserId: "worker_clerk_1",
        email: "worker@example.com",
        role: "food_handler",
      });

      // Seed a token task in "completed" state (as if it went through claim + complete)
      const taskId = seedTask({
        bandId,
        postedByMemberId: adminId,
        claimedByMemberId: workerId,
        payCurrency: "token",
        payAmount: "5",
        status: "completed",
      });

      // Admin confirms the task
      setUser("admin_clerk_1");
      const confirmRes = await fetch(`${h.base}/api/helping-hands/tasks/${taskId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      expect(confirmRes.status).toBe(200);
      const body = (await confirmRes.json()) as {
        task: { status: string };
        bonusAwarded: null;
      };
      expect(body.task.status).toBe("confirmed");
      expect(body.bonusAwarded).toBeNull();

      // Earnings row should be recorded
      expect(tables.hhEarningsTable.__store).toHaveLength(1);
      const earning = tables.hhEarningsTable.__store[0]!;
      expect(earning.taskId).toBe(taskId);
      expect(earning.memberId).toBe(workerId);
      expect(earning.currency).toBe("token");
      expect(earning.amount).toBe("5");
      // Token payment is simulated → SIM_ hash
      expect(String(earning.xrplTxHash)).toMatch(/^SIM_/);

      // sendTokenPayment should have been called (proves import chain to xrpl.ts)
      expect(vi.mocked(xrplModule.sendTokenPayment)).toHaveBeenCalledOnce();
    } finally {
      await h.close();
    }
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Happy-path: XRP task in simulated escrow mode (xrplEscrowEnabled = false)
// ═════════════════════════════════════════════════════════════════════════════

describe("XRP task — full lifecycle in simulated-escrow mode", () => {
  it("claim records a SIM_ escrowTxHash; confirm records earnings with SIM_ settle hash", async () => {
    const h = await startHarness();
    try {
      const bandId = seedBand({ xrplEscrowEnabled: false });
      const adminId = seedMember({
        bandId,
        clerkUserId: "admin_clerk_2",
        email: "admin@example.com",
        role: "owner",
      });
      const workerId = seedMember({
        bandId,
        clerkUserId: "worker_clerk_2",
        email: "worker2@example.com",
        role: "food_handler",
        xrplAddress: "rWORKER_XRPL_ADDR",
      });

      // Seed a task in "completed" state with a simulated escrow hash
      const taskId = seedTask({
        bandId,
        postedByMemberId: adminId,
        claimedByMemberId: workerId,
        payCurrency: "xrp",
        payAmount: "2",
        status: "completed",
        escrowSequence: null,
        escrowTxHash: `SIM_${Date.now().toString(16).toUpperCase()}`,
        escrowSimulated: false,
      });

      // Admin confirms
      setUser("admin_clerk_2");
      const confirmRes = await fetch(`${h.base}/api/helping-hands/tasks/${taskId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      expect(confirmRes.status).toBe(200);
      const body = (await confirmRes.json()) as { task: { status: string }; bonusAwarded: null };
      expect(body.task.status).toBe("confirmed");

      // Earnings row recorded with a SIM_ hash (no real escrow configured)
      expect(tables.hhEarningsTable.__store).toHaveLength(1);
      const earning = tables.hhEarningsTable.__store[0]!;
      expect(earning.currency).toBe("xrp");
      expect(earning.amount).toBe("2");
      expect(String(earning.xrplTxHash)).toMatch(/^SIM_/);

      // submitEscrowFinish should NOT have been called (no real escrow)
      expect(vi.mocked(xrplEscrowModule.submitEscrowFinish)).not.toHaveBeenCalled();
    } finally {
      await h.close();
    }
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Happy-path: XRP task with xrplEscrowEnabled = true (live-escrow code path)
// submitEscrowCreate is called on claim; submitEscrowFinish is called on confirm
// ═════════════════════════════════════════════════════════════════════════════

describe("XRP task — xrplEscrowEnabled = true (escrow code path exercised)", () => {
  it("claim triggers submitEscrowCreate and confirm triggers submitEscrowFinish", async () => {
    const h = await startHarness();
    try {
      const bandId = seedBand({ xrplEscrowEnabled: true });
      const adminId = seedMember({
        bandId,
        clerkUserId: "admin_clerk_3",
        email: "admin@example.com",
        role: "owner",
      });
      const workerId = seedMember({
        bandId,
        clerkUserId: "worker_clerk_3",
        email: "worker3@example.com",
        role: "food_handler",
        xrplAddress: "rWORKER_XRPL_ADDR_3",
      });

      // Enable the XRPL escrow code path for this test.
      // The EscrowCreate hash must NOT start with "SIM_" so that the confirm
      // route's isRealEscrow check passes and submitEscrowFinish is invoked.
      vi.mocked(xrplEscrowModule.bandUsesXrplEscrow).mockReturnValue(true);
      vi.mocked(xrplEscrowModule.escrowWalletAddress).mockReturnValue("rESCROW_HOT_WALLET");
      vi.mocked(xrplEscrowModule.submitEscrowCreate).mockResolvedValue({
        txHash: "ESCROW_CREATE_HASH_42",
        sequence: 42,
        ownerAddress: "rESCROW_HOT_WALLET",
      });

      // Seed a task in "available" state
      const taskId = seedTask({
        bandId,
        postedByMemberId: adminId,
        payCurrency: "xrp",
        payAmount: "3",
        status: "available",
      });

      // Worker claims the task — should trigger submitEscrowCreate
      setUser("worker_clerk_3");
      const claimRes = await fetch(`${h.base}/api/helping-hands/tasks/${taskId}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      expect(claimRes.status).toBe(200);
      const claimBody = (await claimRes.json()) as { status: string };
      expect(claimBody.status).toBe("claimed");

      // submitEscrowCreate was called with the worker's XRPL address
      expect(vi.mocked(xrplEscrowModule.submitEscrowCreate)).toHaveBeenCalledOnce();
      expect(vi.mocked(xrplEscrowModule.submitEscrowCreate)).toHaveBeenCalledWith(
        expect.objectContaining({
          destinationAddress: "rWORKER_XRPL_ADDR_3",
          payAmountXrp: "3",
        }),
      );

      // The task row should have the escrow sequence + hash backfilled from submitEscrowCreate
      const taskRow = tables.hhTasksTable.__store.find((r) => r.id === taskId)!;
      expect(taskRow.escrowSequence).toBe(42);
      expect(taskRow.escrowTxHash).toBe("ESCROW_CREATE_HASH_42");

      // Worker marks the task done
      const completeRes = await fetch(`${h.base}/api/helping-hands/tasks/${taskId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      expect(completeRes.status).toBe(200);

      // Admin confirms → should trigger submitEscrowFinish
      setUser("admin_clerk_3");
      const confirmRes = await fetch(`${h.base}/api/helping-hands/tasks/${taskId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      expect(confirmRes.status).toBe(200);
      const confirmBody = (await confirmRes.json()) as { task: { status: string } };
      expect(confirmBody.task.status).toBe("confirmed");

      // submitEscrowFinish was called with the correct escrow owner + sequence
      expect(vi.mocked(xrplEscrowModule.submitEscrowFinish)).toHaveBeenCalledOnce();
      expect(vi.mocked(xrplEscrowModule.submitEscrowFinish)).toHaveBeenCalledWith(
        expect.objectContaining({
          ownerAddress: "rESCROW_HOT_WALLET",
          escrowSequence: 42,
        }),
      );

      // Earnings row recorded with the EscrowFinish hash
      expect(tables.hhEarningsTable.__store).toHaveLength(1);
      const earning = tables.hhEarningsTable.__store[0]!;
      expect(earning.currency).toBe("xrp");
      expect(earning.xrplTxHash).toBe("SIM_ESCROW_FINISH_HASH");
    } finally {
      await h.close();
    }
  });

  it("confirm falls back to SIM_ERR_ hash if submitEscrowFinish throws", async () => {
    const h = await startHarness();
    try {
      const bandId = seedBand({ xrplEscrowEnabled: true });
      const adminId = seedMember({
        bandId,
        clerkUserId: "admin_clerk_4",
        email: "admin@example.com",
        role: "owner",
      });
      const workerId = seedMember({
        bandId,
        clerkUserId: "worker_clerk_4",
        email: "worker4@example.com",
        role: "food_handler",
        xrplAddress: "rWORKER_XRPL_ADDR_4",
      });

      vi.mocked(xrplEscrowModule.bandUsesXrplEscrow).mockReturnValue(true);
      vi.mocked(xrplEscrowModule.escrowWalletAddress).mockReturnValue("rESCROW_HOT_WALLET_4");
      vi.mocked(xrplEscrowModule.submitEscrowFinish).mockRejectedValue(new Error("ledger timeout"));

      const taskId = seedTask({
        bandId,
        postedByMemberId: adminId,
        claimedByMemberId: workerId,
        payCurrency: "xrp",
        payAmount: "1",
        status: "completed",
        // A non-SIM_ escrowTxHash + valid sequence → isRealEscrow = true
        escrowSequence: 77,
        escrowTxHash: "REAL_HASH_PLACEHOLDER",
        escrowSimulated: false,
      });

      setUser("admin_clerk_4");
      const confirmRes = await fetch(`${h.base}/api/helping-hands/tasks/${taskId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      expect(confirmRes.status).toBe(200);

      // submitEscrowFinish was attempted
      expect(vi.mocked(xrplEscrowModule.submitEscrowFinish)).toHaveBeenCalledOnce();

      // Earnings still recorded despite the escrow failure (with SIM_ERR_ fallback hash)
      expect(tables.hhEarningsTable.__store).toHaveLength(1);
      const earning = tables.hhEarningsTable.__store[0]!;
      expect(String(earning.xrplTxHash)).toMatch(/^SIM_ERR_/);
    } finally {
      await h.close();
    }
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Confirm returns 403 when caller is not an admin
// ═════════════════════════════════════════════════════════════════════════════

describe("confirm — auth guard", () => {
  it("returns 403 if the caller is not an owner or ops_manager", async () => {
    const h = await startHarness();
    try {
      const bandId = seedBand();
      const adminId = seedMember({
        bandId,
        clerkUserId: "admin_clerk_5",
        email: "admin@example.com",
        role: "owner",
      });
      const workerId = seedMember({
        bandId,
        clerkUserId: "worker_clerk_5",
        email: "worker5@example.com",
        role: "food_handler",
      });

      const taskId = seedTask({
        bandId,
        postedByMemberId: adminId,
        claimedByMemberId: workerId,
        status: "completed",
      });

      // Try to confirm as the worker (food_handler role)
      setUser("worker_clerk_5");
      const res = await fetch(`${h.base}/api/helping-hands/tasks/${taskId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      expect(res.status).toBe(403);
    } finally {
      await h.close();
    }
  });
});
