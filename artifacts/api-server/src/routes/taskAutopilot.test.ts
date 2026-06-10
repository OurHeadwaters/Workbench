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

// Import the pure function after mocks are hoisted
const { classifyTask } = await import("./taskAutopilot.js");

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
    // The "fix" GREEN signal should be represented
    expect(result.greenSignalsIgnored!.some((s) => s.includes("fix") || s.includes("\\bfix\\b"))).toBe(true);
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
