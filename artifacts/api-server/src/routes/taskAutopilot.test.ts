/**
 * Tests for the triage classification engine in taskAutopilot.ts
 *
 * Covers:
 *   - Hard-RED guardrails always fire regardless of GREEN signals
 *   - GREEN tasks (bug fixes, visual updates, test coverage) classify correctly
 *   - AMBER fallback when no guardrail or GREEN signal matches
 *   - Idempotent approval: approving the same task ID twice produces no duplicate
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import path from "path";

// ── Stateful in-memory fs mock ────────────────────────────────────────────────
//
// The router calls readFileSync / writeFileSync / appendFileSync on two files.
// We intercept all three so the HTTP tests see a live in-memory store that
// persists across calls within the same test (but resets between tests via
// beforeEach). existsSync returns true once a file has been written.

const { fsStore, fsMock } = vi.hoisted(() => {
  const fsStore: Record<string, string> = {};
  const fsMock = {
    existsSync: vi.fn((p: unknown) => Object.prototype.hasOwnProperty.call(fsStore, String(p))),
    readFileSync: vi.fn((p: unknown, _enc?: unknown) => fsStore[String(p)] ?? ""),
    writeFileSync: vi.fn((p: unknown, data: unknown) => { fsStore[String(p)] = String(data); }),
    appendFileSync: vi.fn((p: unknown, data: unknown) => {
      fsStore[String(p)] = (fsStore[String(p)] ?? "") + String(data);
    }),
    mkdirSync: vi.fn(),
  };
  return { fsStore, fsMock };
});

// The router uses only these five fs methods. We return `fsMock` as the
// module default so that `import fs from "fs"` in the router gets the
// stateful spies. Named exports are also spread so any `import { existsSync }`
// style usage would also get the mock.
vi.mock("fs", () => ({ default: fsMock, ...fsMock }));

vi.mock("../lib/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}));

vi.mock("../lib/ownerAuth", () => ({
  isOwnerRequest: vi.fn(() => true),
  OWNER_TOKEN: "test-owner-token",
}));

// Import the pure functions after mocks are hoisted
const { classifyTask, archiveClearedTasks } = await import("./taskAutopilot.js");

// ── helpers ───────────────────────────────────────────────────────────────────

function task(title: string, description?: string) {
  return { id: "t-" + Math.random().toString(36).slice(2), title, description };
}

function resetStore() {
  for (const key of Object.keys(fsStore)) delete fsStore[key];
}

// ── Hard-RED guardrail tests ──────────────────────────────────────────────────

describe("classifyTask — hard-RED guardrails", () => {
  describe("financial / contractual (Rule 4)", () => {
    const financialTitles = [
      "Update pricing for the fall season",
      "Review revenue projections with the team",
      "Set up subscription billing for members",
      "Adjust cost basis in the ledger",
      "Fix the payment flow on checkout",
      "Add invoice generation endpoint",
      "Review the budget allocation for Q3",
      "Update fee schedule in the handbook",
      "Sign the contract with the vendor",
      "Renew the license agreement",
    ];

    for (const title of financialTitles) {
      it(`classifies "${title}" as RED`, () => {
        const result = classifyTask(task(title));
        expect(result.tier).toBe("RED");
        expect(result.hardGuardrail).toBe(true);
      });
    }

    it("stays RED even when title also contains fix + payment", () => {
      // GREEN signal "fix" + RED signal "payment" → RED wins
      const result = classifyTask(task("Fix the payment confirmation screen"));
      expect(result.tier).toBe("RED");
      expect(result.hardGuardrail).toBe(true);
    });

    it("stays RED even when title also contains bug + pricing", () => {
      const result = classifyTask(task("Fix pricing crash after discount applied"));
      expect(result.tier).toBe("RED");
      expect(result.hardGuardrail).toBe(true);
    });

    it("stays RED even when title also contains refactor + billing", () => {
      const result = classifyTask(task("Refactor billing module for clarity"));
      expect(result.tier).toBe("RED");
      expect(result.hardGuardrail).toBe(true);
    });
  });

  describe("secrets / credentials (Rule 2)", () => {
    const secretTitles = [
      "Rotate the API key for Anthropic",
      "Update env var for database connection",
      "Add OAuth token refresh endpoint",
      "Store the user password securely",
      "Audit credential storage across services",
    ];

    for (const title of secretTitles) {
      it(`classifies "${title}" as RED`, () => {
        const result = classifyTask(task(title));
        expect(result.tier).toBe("RED");
        expect(result.hardGuardrail).toBe(true);
      });
    }

    it("stays RED even with fix + token", () => {
      // "fix" is a GREEN signal but "token" triggers Rule 2
      const result = classifyTask(task("Fix the token refresh bug"));
      expect(result.tier).toBe("RED");
      expect(result.hardGuardrail).toBe(true);
    });
  });

  describe("deployment / DNS (Rule 5)", () => {
    const deployTitles = [
      "Deploy the new API server to production",
      "Update the CNAME record for headwaters.ca",
      "Configure subdomain routing for the library",
      "Publish the handbook to the live domain",
      "Go live with the new booking system",
    ];

    for (const title of deployTitles) {
      it(`classifies "${title}" as RED`, () => {
        const result = classifyTask(task(title));
        expect(result.tier).toBe("RED");
        expect(result.hardGuardrail).toBe(true);
      });
    }

    it("stays RED even with fix + deployment in description", () => {
      const result = classifyTask(task(
        "Fix the onboarding redirect",
        "This requires a deployment to production to take effect"
      ));
      expect(result.tier).toBe("RED");
      expect(result.hardGuardrail).toBe(true);
    });
  });

  describe("irreversible data actions (Rule 1)", () => {
    const dataTitles = [
      "Delete old user records from the database",
      "Drop table sessions after migration",
      "Wipe all pending task entries",
      "Purge expired tokens from the db",
    ];

    for (const title of dataTitles) {
      it(`classifies "${title}" as RED`, () => {
        const result = classifyTask(task(title));
        expect(result.tier).toBe("RED");
        expect(result.hardGuardrail).toBe(true);
      });
    }
  });

  describe("external dependencies / hiring (Rule 3)", () => {
    const depTitles = [
      "Hire a contractor for the new module",
      "Integrate Stripe for payment collection",
      "Set up partnership with external vendor",
      "Integrate Shopify storefront into the app",
    ];

    for (const title of depTitles) {
      it(`classifies "${title}" as RED`, () => {
        const result = classifyTask(task(title));
        expect(result.tier).toBe("RED");
        expect(result.hardGuardrail).toBe(true);
      });
    }
  });

  describe("strategic / architectural commitments (Three Tests)", () => {
    const strategicTitles = [
      "Lock the architecture for the new data layer",
      "Decide on the system platform before launch",
      "Commit to migrating major infrastructure to cloud",
      "Redesign the booking system from scratch",
    ];

    for (const title of strategicTitles) {
      it(`classifies "${title}" as RED`, () => {
        const result = classifyTask(task(title));
        expect(result.tier).toBe("RED");
        expect(result.hardGuardrail).toBe(true);
      });
    }
  });

  describe("guardrail triggers via description even with a neutral title", () => {
    it("RED description overrides a neutral title", () => {
      const result = classifyTask(task(
        "Update the onboarding flow",
        "This requires updating the pricing tiers for new members"
      ));
      expect(result.tier).toBe("RED");
      expect(result.hardGuardrail).toBe(true);
    });
  });
});

// ── GREEN classification tests ────────────────────────────────────────────────

describe("classifyTask — GREEN tasks", () => {
  const greenCases: [string, string?][] = [
    // fix / bug
    ["Fix the broken navigation link on the library page"],
    ["Fix bug in date formatting on the booking summary"],
    ["Fix crash on the mobile layout view"],
    // catch stale / cover flow
    ["Catch stale slide-position links scattered through the deck"],
    ["Cover the cost review flow with automated tests so it doesn't break silently"],
    // visually re-check
    ["Visually re-check the research library after the corridor co-op rename"],
    // cross-link
    ["Cross-link the Replication chapter from Compare and Contracts pages"],
    // echo ethos / match timeline
    ["Echo the Headwaters ethos into the Deer Lake deck"],
    ["Match the Brightside timeline to the active scenario"],
    // refactor / rename / clean up / resize
    ["Refactor the intake form validation logic"],
    ["Rename the sidebar labels to match the new terminology"],
    ["Clean up unused imports in the handbook build"],
    ["Resize the hero image on the landing page"],
    // same export
    ["Add the same export panel to the Personal overview page"],
  ];

  for (const [title, description] of greenCases) {
    it(`classifies "${title}" as GREEN`, () => {
      const result = classifyTask(task(title, description));
      expect(result.tier).toBe("GREEN");
      expect(result.hardGuardrail).toBeUndefined();
    });
  }

  it("GREEN result has no hardGuardrail flag", () => {
    const result = classifyTask(task("Fix the sidebar crash"));
    expect(result.tier).toBe("GREEN");
    expect(result.hardGuardrail).toBeUndefined();
  });

  it("GREEN result echoes back the task id and title", () => {
    const t = task("Fix the sidebar crash");
    const result = classifyTask(t);
    expect(result.id).toBe(t.id);
    expect(result.title).toBe(t.title);
  });
});

// ── AMBER fallback ────────────────────────────────────────────────────────────

describe("classifyTask — AMBER fallback", () => {
  it("classifies a generic content task as AMBER", () => {
    const result = classifyTask(task("Update the welcome copy on the homepage"));
    expect(result.tier).toBe("AMBER");
    expect(result.hardGuardrail).toBeUndefined();
  });

  it("classifies a deck-order task as AMBER when no strong GREEN signal", () => {
    const result = classifyTask(task("Review the slide order in the presentation"));
    expect(result.tier).toBe("AMBER");
  });

  it("AMBER result includes a themeCluster", () => {
    const result = classifyTask(task("Improve the layout of the print view"));
    expect(result.tier).toBe("AMBER");
    expect(typeof result.themeCluster).toBe("string");
  });

  it("AMBER result has no hardGuardrail flag", () => {
    const result = classifyTask(task("Improve the layout of the print view"));
    expect(result.hardGuardrail).toBeUndefined();
  });
});

// ── greenSignalsIgnored field ─────────────────────────────────────────────────

describe("classifyTask — greenSignalsIgnored", () => {
  it("populates greenSignalsIgnored when fix + payment overlap", () => {
    const result = classifyTask(task("Fix the payment confirmation screen"));
    expect(result.tier).toBe("RED");
    expect(result.hardGuardrail).toBe(true);
    expect(Array.isArray(result.greenSignalsIgnored)).toBe(true);
    expect(result.greenSignalsIgnored!.length).toBeGreaterThan(0);
    // The "fix" GREEN signal should be represented as a plain label
    expect(result.greenSignalsIgnored!.some((s) => s.includes("fix"))).toBe(true);
  });

  it("populates greenSignalsIgnored when bug + pricing overlap", () => {
    const result = classifyTask(task("Fix pricing crash after discount applied"));
    expect(result.tier).toBe("RED");
    expect(Array.isArray(result.greenSignalsIgnored)).toBe(true);
    expect(result.greenSignalsIgnored!.length).toBeGreaterThan(0);
  });

  it("populates greenSignalsIgnored when refactor + billing overlap", () => {
    const result = classifyTask(task("Refactor billing module for clarity"));
    expect(result.tier).toBe("RED");
    expect(result.greenSignalsIgnored).toBeDefined();
    expect(result.greenSignalsIgnored!.some((s) => s.includes("refactor"))).toBe(true);
  });

  it("populates greenSignalsIgnored when fix + token overlap (Rule 2)", () => {
    const result = classifyTask(task("Fix the token refresh bug"));
    expect(result.tier).toBe("RED");
    expect(result.greenSignalsIgnored).toBeDefined();
    expect(result.greenSignalsIgnored!.length).toBeGreaterThan(0);
  });

  it("greenSignalsIgnored is absent (or empty) when RED fires with no GREEN overlap", () => {
    // "Delete old user records" — no GREEN signal words
    const result = classifyTask(task("Delete old user records from the database"));
    expect(result.tier).toBe("RED");
    // Either undefined or an empty array — no false positives
    const ignored = result.greenSignalsIgnored;
    expect(!ignored || ignored.length === 0).toBe(true);
  });

  it("pure GREEN task has no greenSignalsIgnored field", () => {
    const result = classifyTask(task("Fix the broken navigation link on the library page"));
    expect(result.tier).toBe("GREEN");
    expect(result.greenSignalsIgnored).toBeUndefined();
  });

  it("pure AMBER task has no greenSignalsIgnored field", () => {
    const result = classifyTask(task("Update the welcome copy on the homepage"));
    expect(result.tier).toBe("AMBER");
    expect(result.greenSignalsIgnored).toBeUndefined();
  });

  it("cover + billing (financial) overlap populates greenSignalsIgnored", () => {
    // "cover.*flow" is a GREEN signal; "billing" triggers financial RED guardrail
    const result = classifyTask(task("Cover the billing flow with automated tests"));
    expect(result.tier).toBe("RED");
    expect(result.greenSignalsIgnored).toBeDefined();
    expect(result.greenSignalsIgnored!.length).toBeGreaterThan(0);
  });
});

// ── Idempotent approval tests (via HTTP) ──────────────────────────────────────
//
// These tests spin up the real Express router with the stateful in-memory
// fs mock so writes are visible to subsequent reads within the same test.

describe("POST /approve — idempotent approval", () => {
  let server: Server;
  let baseUrl: string;

  beforeEach(async () => {
    resetStore();

    const express = (await import("express")).default;
    const { default: router } = await import("./taskAutopilot.js");

    const app = express();
    app.use(express.json());
    app.use("/", router);

    await new Promise<void>((resolve) => {
      server = createServer(app);
      server.listen(0, "127.0.0.1", resolve);
    });

    const { port } = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  afterEach(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  async function post(path: string, body: unknown) {
    const res = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer test-owner-token",
      },
      body: JSON.stringify(body),
    });
    return { status: res.status, body: (await res.json()) as Record<string, unknown> };
  }

  async function get(path: string) {
    const res = await fetch(`${baseUrl}${path}`, {
      headers: { authorization: "Bearer test-owner-token" },
    });
    return { status: res.status, body: (await res.json()) as Record<string, unknown> };
  }

  it("importing the same title twice creates only one task (skipped on second)", async () => {
    const title = "Fix the broken search bar";

    const r1 = await post("/import", { tasks: [{ title }] });
    expect(r1.status).toBe(200);
    expect(r1.body.imported).toBe(1);
    expect(r1.body.skipped).toBe(0);

    const r2 = await post("/import", { tasks: [{ title }] });
    expect(r2.status).toBe(200);
    expect(r2.body.imported).toBe(0);
    expect(r2.body.skipped).toBe(1);
  });

  it("approving the same task ID twice is idempotent — alreadyPending on second call", async () => {
    // Import a task first
    await post("/import", { tasks: [{ title: "Fix the sidebar crash on mobile" }] });

    const proposedRes = await get("/proposed");
    expect(proposedRes.status).toBe(200);
    const tasks = (proposedRes.body as { tasks: Array<{ id: string }> }).tasks;
    expect(tasks.length).toBeGreaterThan(0);
    const taskId = tasks[0]!.id;

    // Approve once
    const a1 = await post("/approve", { taskIds: [taskId], tier: "green" });
    expect(a1.status).toBe(200);
    expect(a1.body.approved).toBe(1);
    expect(a1.body.alreadyPending).toBe(0);

    // Approve again — must not double-count
    const a2 = await post("/approve", { taskIds: [taskId], tier: "green" });
    expect(a2.status).toBe(200);
    expect(a2.body.approved).toBe(0);
    expect(a2.body.alreadyPending).toBe(1);
  });

  it("pending list contains exactly one entry after double-approval", async () => {
    await post("/import", { tasks: [{ title: "Fix the header layout" }] });

    const proposedRes = await get("/proposed");
    const taskId = (proposedRes.body as { tasks: Array<{ id: string }> }).tasks[0]!.id;

    // Approve twice
    await post("/approve", { taskIds: [taskId], tier: "green" });
    await post("/approve", { taskIds: [taskId], tier: "green" });

    const pendingRes = await get("/pending");
    const pending = (pendingRes.body as { tasks: Array<{ id: string }> }).tasks;
    const matching = pending.filter((t) => t.id === taskId);
    expect(matching.length).toBe(1);
  });

  it("approving a non-existent task ID is a no-op (approved=0, alreadyPending=0)", async () => {
    const res = await post("/approve", {
      taskIds: ["does-not-exist-000"],
      tier: "green",
    });
    expect(res.status).toBe(200);
    expect(res.body.approved).toBe(0);
    expect(res.body.alreadyPending).toBe(0);
  });
});

// ── Shared file-path constants (mirror the module's DATA_DIR layout) ──────────

const DATA_DIR = path.resolve(process.cwd(), "data");
const TASKS_FILE_PATH = path.join(DATA_DIR, "task-autopilot-tasks.jsonl");
const ARCHIVE_FILE_PATH = path.join(DATA_DIR, "task-autopilot-archive.jsonl");

// ── Store seed / read helpers ─────────────────────────────────────────────────

type StoredTask = {
  id: string;
  title: string;
  status: "proposed" | "pending" | "cleared";
  importedAt: string;
  updatedAt: string;
  description?: string;
};

/** ISO timestamp for N days before "now" */
function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

/** Build a minimal cleared task with a predictable updatedAt */
function clearedTask(id: string, updatedAtDaysAgo: number): StoredTask {
  const ts = daysAgo(updatedAtDaysAgo);
  return { id, title: `Cleared task ${id}`, status: "cleared", importedAt: ts, updatedAt: ts };
}

function proposedTask(id: string): StoredTask {
  const ts = daysAgo(0);
  return { id, title: `Proposed task ${id}`, status: "proposed", importedAt: ts, updatedAt: ts };
}

function pendingTask(id: string): StoredTask {
  const ts = daysAgo(0);
  return { id, title: `Pending task ${id}`, status: "pending", importedAt: ts, updatedAt: ts };
}

function seedTasks(tasks: StoredTask[]) {
  fsStore[TASKS_FILE_PATH] = tasks.map((t) => JSON.stringify(t)).join("\n") + (tasks.length ? "\n" : "");
}

function readArchivedTasks(): StoredTask[] {
  const raw = fsStore[ARCHIVE_FILE_PATH] ?? "";
  return raw.split("\n").filter(Boolean).map((l) => JSON.parse(l) as StoredTask);
}

function readLiveTasks(): StoredTask[] {
  const raw = fsStore[TASKS_FILE_PATH] ?? "";
  return raw.split("\n").filter(Boolean).map((l) => JSON.parse(l) as StoredTask);
}

// ── writeTasks auto-prune tests (exercised via POST /import) ──────────────────
//
// writeTasks() is not exported so we drive it through the import HTTP endpoint,
// which always calls writeTasks(all) after processing incoming tasks.

describe("writeTasks — auto-prune of CLEARED tasks", () => {
  let server: Server;
  let baseUrl: string;

  beforeEach(async () => {
    resetStore();

    const express = (await import("express")).default;
    const { default: router } = await import("./taskAutopilot.js");

    const app = express();
    app.use(express.json());
    app.use("/", router);

    await new Promise<void>((resolve) => {
      server = createServer(app);
      server.listen(0, "127.0.0.1", resolve);
    });

    const { port } = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  afterEach(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  async function triggerWrite(uniqueTitle: string) {
    await fetch(`${baseUrl}/import`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer test-owner-token",
      },
      body: JSON.stringify({ tasks: [{ title: uniqueTitle }] }),
    });
  }

  it("does NOT evict when cleared count equals MAX_CLEARED_RETAINED (200)", async () => {
    const tasks = Array.from({ length: 200 }, (_, i) =>
      clearedTask(`c${i}`, 200 - i)
    );
    seedTasks(tasks);

    await triggerWrite("New unique proposed task A");

    expect(fsStore[ARCHIVE_FILE_PATH]).toBeUndefined();
    const live = readLiveTasks().filter((t) => t.status === "cleared");
    expect(live).toHaveLength(200);
  });

  it("evicts the single oldest when cleared count reaches 201", async () => {
    const tasks = Array.from({ length: 201 }, (_, i) =>
      clearedTask(`c${i}`, 201 - i)
    );
    seedTasks(tasks);

    await triggerWrite("New unique proposed task B");

    const archived = readArchivedTasks();
    expect(archived).toHaveLength(1);
    // The oldest task had updatedAt = daysAgo(201) — it has id "c0"
    expect(archived[0]!.id).toBe("c0");

    const live = readLiveTasks().filter((t) => t.status === "cleared");
    expect(live).toHaveLength(200);
  });

  it("evicts exactly (total - 200) oldest when many surplus cleared tasks exist", async () => {
    const tasks = Array.from({ length: 210 }, (_, i) =>
      clearedTask(`c${i}`, 210 - i)
    );
    seedTasks(tasks);

    await triggerWrite("New unique proposed task C");

    const archived = readArchivedTasks();
    expect(archived).toHaveLength(10);

    // The 10 evicted tasks should be the oldest (ids c0…c9)
    const archivedIds = archived.map((t) => t.id).sort();
    expect(archivedIds).toEqual(["c0","c1","c2","c3","c4","c5","c6","c7","c8","c9"]);

    const live = readLiveTasks().filter((t) => t.status === "cleared");
    expect(live).toHaveLength(200);
  });

  it("newest 200 CLEARED tasks are kept (not the oldest)", async () => {
    // 202 cleared tasks: c0 is oldest (daysAgo(202)), c201 is newest (daysAgo(1))
    const tasks = Array.from({ length: 202 }, (_, i) =>
      clearedTask(`c${i}`, 202 - i)
    );
    seedTasks(tasks);

    await triggerWrite("New unique proposed task D");

    const archived = readArchivedTasks();
    expect(archived).toHaveLength(2);

    const archivedIds = new Set(archived.map((t) => t.id));
    expect(archivedIds.has("c0")).toBe(true);
    expect(archivedIds.has("c1")).toBe(true);

    // The newest tasks must still be in the live store
    const liveCleared = readLiveTasks().filter((t) => t.status === "cleared");
    const liveIds = new Set(liveCleared.map((t) => t.id));
    expect(liveIds.has("c201")).toBe(true);
    expect(liveIds.has("c200")).toBe(true);
  });

  it("PROPOSED and PENDING tasks are never evicted regardless of cleared count", async () => {
    // 201 cleared + 5 proposed + 3 pending
    const cleared = Array.from({ length: 201 }, (_, i) => clearedTask(`c${i}`, 201 - i));
    const proposed = Array.from({ length: 5 }, (_, i) => proposedTask(`p${i}`));
    const pending = Array.from({ length: 3 }, (_, i) => pendingTask(`q${i}`));
    seedTasks([...cleared, ...proposed, ...pending]);

    await triggerWrite("New unique proposed task E");

    // Eviction fires for surplus CLEARED only
    const archived = readArchivedTasks();
    expect(archived.every((t) => t.status === "cleared")).toBe(true);

    const live = readLiveTasks();
    const liveProposed = live.filter((t) => t.status === "proposed");
    const livePending = live.filter((t) => t.status === "pending");

    // All 5 original proposed + 1 newly imported = 6 proposed
    expect(liveProposed.length).toBeGreaterThanOrEqual(5);
    expect(livePending).toHaveLength(3);
  });
});

// ── archiveClearedTasks — direct unit tests ───────────────────────────────────

describe("archiveClearedTasks — direct", () => {
  beforeEach(() => {
    resetStore();
  });

  it("returns archived=0 when there are no tasks at all", () => {
    const result = archiveClearedTasks(30);
    expect(result.archived).toBe(0);
    expect(result.cutoff).toBeTruthy();
  });

  it("returns archived=0 when no tasks are CLEARED", () => {
    seedTasks([proposedTask("p1"), pendingTask("q1")]);
    const result = archiveClearedTasks(30);
    expect(result.archived).toBe(0);
    expect(fsStore[ARCHIVE_FILE_PATH]).toBeUndefined();
  });

  it("returns archived=0 when CLEARED tasks are newer than the cutoff", () => {
    // 5-day-old cleared task, cutoff is 30 days → should NOT be archived
    seedTasks([clearedTask("c1", 5)]);
    const result = archiveClearedTasks(30);
    expect(result.archived).toBe(0);
    expect(fsStore[ARCHIVE_FILE_PATH]).toBeUndefined();
  });

  it("archives CLEARED tasks older than the cutoff", () => {
    // 60-day-old cleared task, cutoff is 30 days → should be archived
    seedTasks([clearedTask("old", 60)]);
    const result = archiveClearedTasks(30);
    expect(result.archived).toBe(1);

    const archived = readArchivedTasks();
    expect(archived).toHaveLength(1);
    expect(archived[0]!.id).toBe("old");

    // Removed from the live store
    const live = readLiveTasks();
    expect(live.every((t) => t.id !== "old")).toBe(true);
  });

  it("keeps CLEARED tasks newer than the cutoff in the live store", () => {
    seedTasks([clearedTask("recent", 10), clearedTask("old", 60)]);
    const result = archiveClearedTasks(30);
    expect(result.archived).toBe(1);

    const live = readLiveTasks();
    expect(live.some((t) => t.id === "recent")).toBe(true);
    expect(live.every((t) => t.id !== "old")).toBe(true);
  });

  it("olderThanDays=0 archives ALL cleared tasks (cutoff is ~now)", () => {
    // Even a 0-second-old task would have updatedAt < cutoff only if it's strictly before now.
    // Use tasks from 1 second ago effectively via daysAgo(0) — they will be < Date.now()
    // Use 1-day-old cleared tasks to be unambiguous
    seedTasks([clearedTask("c1", 1), clearedTask("c2", 2), proposedTask("p1")]);
    const result = archiveClearedTasks(0);
    expect(result.archived).toBe(2);

    const live = readLiveTasks();
    expect(live.filter((t) => t.status === "cleared")).toHaveLength(0);
    expect(live.filter((t) => t.status === "proposed")).toHaveLength(1);
  });

  it("PROPOSED and PENDING tasks are never archived regardless of age", () => {
    const old = { ...proposedTask("p-old"), updatedAt: daysAgo(365) };
    const oldPending = { ...pendingTask("q-old"), updatedAt: daysAgo(365) };
    seedTasks([old, oldPending, clearedTask("c-old", 60)]);

    const result = archiveClearedTasks(30);
    expect(result.archived).toBe(1);

    const live = readLiveTasks();
    expect(live.some((t) => t.id === "p-old")).toBe(true);
    expect(live.some((t) => t.id === "q-old")).toBe(true);
  });

  it("returns the correct cutoff ISO string for olderThanDays=30", () => {
    const before = Date.now();
    const result = archiveClearedTasks(30);
    const after = Date.now();

    const cutoffMs = new Date(result.cutoff).getTime();
    const expectedMs = 30 * 24 * 60 * 60 * 1000;

    expect(cutoffMs).toBeGreaterThanOrEqual(before - expectedMs - 1000);
    expect(cutoffMs).toBeLessThanOrEqual(after - expectedMs + 1000);
  });

  it("archives multiple tasks in a single call and appends all to archive file", () => {
    seedTasks([
      clearedTask("old1", 90),
      clearedTask("old2", 60),
      clearedTask("old3", 45),
      clearedTask("recent", 10),
    ]);
    const result = archiveClearedTasks(30);
    expect(result.archived).toBe(3);

    const archived = readArchivedTasks();
    expect(archived).toHaveLength(3);

    const archivedIds = new Set(archived.map((t) => t.id));
    expect(archivedIds.has("old1")).toBe(true);
    expect(archivedIds.has("old2")).toBe(true);
    expect(archivedIds.has("old3")).toBe(true);
    expect(archivedIds.has("recent")).toBe(false);
  });
});

// ── POST /archive — HTTP tests ────────────────────────────────────────────────

describe("POST /archive — HTTP", () => {
  let server: Server;
  let baseUrl: string;

  beforeEach(async () => {
    resetStore();

    const express = (await import("express")).default;
    const { default: router } = await import("./taskAutopilot.js");

    const app = express();
    app.use(express.json());
    app.use("/", router);

    await new Promise<void>((resolve) => {
      server = createServer(app);
      server.listen(0, "127.0.0.1", resolve);
    });

    const { port } = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  afterEach(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  async function archivePost(body: unknown, withToken = true) {
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (withToken) headers["authorization"] = "Bearer test-owner-token";
    const res = await fetch(`${baseUrl}/archive`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    return { status: res.status, body: (await res.json()) as Record<string, unknown> };
  }

  it("returns 401 when no owner token is provided", async () => {
    // The global ownerAuth mock always returns true; temporarily override it
    // so this test can exercise the actual 401 branch.
    const ownerAuth = await import("../lib/ownerAuth.js");
    vi.mocked(ownerAuth.isOwnerRequest).mockReturnValueOnce(false);

    const res = await archivePost({}, false);
    expect(res.status).toBe(401);
    expect(res.body.error).toBeTruthy();
  });

  it("returns ok=true and archived=0 when there are no tasks", async () => {
    const res = await archivePost({ olderThanDays: 30 });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.archived).toBe(0);
  });

  it("uses olderThanDays=30 by default when body is empty", async () => {
    const res = await archivePost({});
    expect(res.status).toBe(200);
    expect(res.body.olderThanDays).toBe(30);
  });

  it("returns archived=0 when no tasks are CLEARED", async () => {
    seedTasks([proposedTask("p1"), pendingTask("q1")]);
    const res = await archivePost({ olderThanDays: 30 });
    expect(res.status).toBe(200);
    expect(res.body.archived).toBe(0);
  });

  it("archives CLEARED tasks older than olderThanDays and returns correct count", async () => {
    seedTasks([clearedTask("old", 60), clearedTask("recent", 5)]);
    const res = await archivePost({ olderThanDays: 30 });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.archived).toBe(1);

    const archived = readArchivedTasks();
    expect(archived).toHaveLength(1);
    expect(archived[0]!.id).toBe("old");
  });

  it("olderThanDays=0 archives all cleared tasks", async () => {
    seedTasks([clearedTask("c1", 1), clearedTask("c2", 2), proposedTask("p1")]);
    const res = await archivePost({ olderThanDays: 0 });
    expect(res.status).toBe(200);
    expect(res.body.archived).toBe(2);
  });

  it("PROPOSED and PENDING tasks are never archived", async () => {
    const oldProposed = { ...proposedTask("p-old"), updatedAt: daysAgo(365) };
    const oldPending = { ...pendingTask("q-old"), updatedAt: daysAgo(365) };
    seedTasks([oldProposed, oldPending]);

    const res = await archivePost({ olderThanDays: 30 });
    expect(res.status).toBe(200);
    expect(res.body.archived).toBe(0);
  });

  it("response includes a cutoff ISO timestamp", async () => {
    const res = await archivePost({ olderThanDays: 30 });
    expect(res.status).toBe(200);
    const cutoff = res.body.cutoff as string;
    expect(typeof cutoff).toBe("string");
    expect(new Date(cutoff).getTime()).not.toBeNaN();
  });

  it("response echoes back the olderThanDays value sent", async () => {
    const res = await archivePost({ olderThanDays: 14 });
    expect(res.status).toBe(200);
    expect(res.body.olderThanDays).toBe(14);
  });

  it("rejects olderThanDays=-1 with 400", async () => {
    const res = await archivePost({ olderThanDays: -1 });
    expect(res.status).toBe(400);
  });

  it("rejects olderThanDays=9999 (> max 3650) with 400", async () => {
    const res = await archivePost({ olderThanDays: 9999 });
    expect(res.status).toBe(400);
  });
});
