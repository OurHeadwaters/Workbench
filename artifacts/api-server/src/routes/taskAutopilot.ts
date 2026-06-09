/**
 * Task Autopilot routes — task state machine + triage + audit log
 *
 * The task store is the source of truth. Tasks move through three states:
 *   PROPOSED → PENDING (approved by founder) → CLEARED (done)
 *
 * Endpoints:
 *
 *   GET  /api/tasks/proposed
 *     Returns all tasks with status "proposed" (used by this project AND as the
 *     standard constellation endpoint other projects expose).
 *
 *   POST /api/tasks/import
 *     Body: { tasks: [{ title, description? }] } | { lines: string }
 *     Bulk-imports tasks as PROPOSED. Idempotent on title — won't create duplicates.
 *     Returns: { ok: true, imported: number, skipped: number }
 *
 *   POST /api/tasks/triage
 *     Body: { tasks: [{ id, title, description? }] }
 *     Pure classification — does not change state. Returns tier labels + rationale.
 *
 *   POST /api/tasks/approve
 *     Body: { taskIds: string[], tier: "green" | "amber", dryRun?: boolean }
 *     Transitions tasks PROPOSED → PENDING. Idempotent.
 *     Returns: { ok: true, approved: number, alreadyPending: number }
 *
 *   POST /api/tasks/unapprove
 *     Body: { taskIds: string[] }
 *     Reverts tasks PENDING → PROPOSED.
 *     Returns: { ok: true, reverted: number }
 *
 *   GET  /api/tasks/pending
 *     Returns all tasks with status "pending".
 *
 *   GET  /api/tasks/audit-log
 *   POST /api/tasks/audit-log
 *     Read / append the audit log (overrides + state transitions).
 */

import { Router, type IRouter, type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { z } from "zod";
import { logger } from "../lib/logger";
import { isOwnerRequest, OWNER_TOKEN } from "../lib/ownerAuth";

function requireOwner(req: Request): boolean {
  return !!OWNER_TOKEN && isOwnerRequest(req);
}

const router: IRouter = Router();

const DATA_DIR = path.resolve(process.cwd(), "data");
const TASKS_FILE = path.join(DATA_DIR, "task-autopilot-tasks.jsonl");
const AUDIT_FILE = path.join(DATA_DIR, "task-autopilot-audit.jsonl");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ── Task store helpers ────────────────────────────────────────────────────────

type TaskStatus = "proposed" | "pending" | "cleared";

interface StoredTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  projectId?: string;
  importedAt: string;
  updatedAt: string;
}

function readTasks(): StoredTask[] {
  if (!fs.existsSync(TASKS_FILE)) return [];
  return fs
    .readFileSync(TASKS_FILE, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => { try { return JSON.parse(l) as StoredTask; } catch { return null; } })
    .filter((x): x is StoredTask => x !== null);
}

function writeTasks(tasks: StoredTask[]) {
  ensureDataDir();
  fs.writeFileSync(TASKS_FILE, tasks.map((t) => JSON.stringify(t)).join("\n") + (tasks.length ? "\n" : ""), "utf8");
}

// ── Audit log helpers ─────────────────────────────────────────────────────────

interface AuditEntry {
  taskId: string;
  taskTitle?: string;
  event: "imported" | "approved" | "unapproved" | "cleared" | "override" | "constellation-approved";
  fromStatus?: TaskStatus;
  toStatus?: TaskStatus;
  fromTier?: string;
  toTier?: string;
  tier?: string;
  reason?: string;
  projectId?: string;
  projectLabel?: string;
  at: string;
}

function appendAudit(entry: AuditEntry) {
  ensureDataDir();
  fs.appendFileSync(AUDIT_FILE, JSON.stringify(entry) + "\n", "utf8");
}

function readAudit(): AuditEntry[] {
  if (!fs.existsSync(AUDIT_FILE)) return [];
  return fs
    .readFileSync(AUDIT_FILE, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => { try { return JSON.parse(l) as AuditEntry; } catch { return null; } })
    .filter((x): x is AuditEntry => x !== null)
    .slice(-500);
}

// ── Classification engine ─────────────────────────────────────────────────────

type Tier = "GREEN" | "AMBER" | "RED";
type CouncilSeat = "saltbox" | "smith" | "systems" | "community" | "codetry" | "ishmael";

interface TaskClassification {
  id: string;
  title: string;
  description?: string;
  tier: Tier;
  rule: string;
  reasoning: string;
  councilSeat?: CouncilSeat;
  themeCluster?: string;
  hardGuardrail?: boolean;
}

// Hard-RED guardrail — always forces RED regardless of other signals.
// "A wrong GREEN auto-clearing to PENDING is the dangerous failure mode."
const HARD_RED_PATTERNS: { pattern: RegExp; rule: string }[] = [
  {
    pattern: /\b(pric(e|ing|ed)|revenue|income|monetiz|subscription|payment|billing|invoice|cost basis|bucket|money|dollar|cash|budget|financial|fee|contract|agreement|terms|license|licensing)\b/i,
    rule: "Compact Rule 4 (truth) · touches financial or contractual commitment",
  },
  {
    pattern: /\b(secret|token|key|credential|password|auth|oauth|api.key|env.var|\.env)\b/i,
    rule: "Compact Rule 2 (privacy) · touches secrets or credentials",
  },
  {
    pattern: /\b(dns|domain|cname|subdomain|routing|deploy(ment)?|publish|go.live|production)\b/i,
    rule: "Compact Rule 5 (own the machine) · touches deployment or domain infrastructure",
  },
  {
    pattern: /\b(delet(e|ing)|drop table|wipe|purge|destroy|remov(e|ing).*(database|db|table|record|user|account))\b/i,
    rule: "Compact Rule 1 (sovereignty) · irreversible data action",
  },
  {
    pattern: /\b(hir(e|ing)|partner(ship)?|integrat(e|ion).*(stripe|shopify|third.party|external)|vendor|outsourc)\b/i,
    rule: "Compact Rule 3 (no dependency) · creates new external dependency or hiring decision",
  },
  {
    pattern: /\b(lock|commit|decide|decision|strateg|architect(ure)?|redesign|replace.*(system|platform|engine)|migrate.*major)\b/i,
    rule: "Three Tests · strategic commitment or foundational architecture choice",
  },
];

const THEME_CLUSTERS: { label: string; patterns: RegExp[] }[] = [
  { label: "print/export", patterns: [/\bpdf\b/i, /\bprint\b/i, /\bexport\b/i, /\bdownload\b/i] },
  { label: "content/copy", patterns: [/\bcopy\b/i, /\bcontent\b/i, /\btext\b/i, /\bwording\b/i, /\bvoice\b/i, /\blanguage\b/i, /\bheadline\b/i, /\bdescription\b/i] },
  { label: "UI/visual", patterns: [/\bstyle\b/i, /\bdesign\b/i, /\blayout\b/i, /\bcolor\b/i, /\bfont\b/i, /\bresponsiv\b/i, /\bmobile\b/i, /\bview\b/i, /\banimation\b/i] },
  { label: "data/sync", patterns: [/\bsync\b/i, /\bdata\b/i, /\bfetch\b/i, /\bload\b/i, /\brefresh\b/i, /\bimport\b/i, /\bfeed\b/i] },
  { label: "navigation/links", patterns: [/\blink\b/i, /\bnavigation\b/i, /\broute\b/i, /\bredirect\b/i, /\bslide\b/i] },
  { label: "testing/quality", patterns: [/\btest\b/i, /\bspec\b/i, /\bcoverage\b/i, /\blint\b/i, /\btype.check\b/i] },
  { label: "framing/deck", patterns: [/\bdeck\b/i, /\bpresentation\b/i, /\bscenario\b/i, /\bcompar(e|ison)\b/i] },
];

const GREEN_SIGNALS = [
  /\bfix\b/i, /\bbug\b/i, /\bcrash\b/i, /\berror\b/i, /\brefactor\b/i,
  /\bclean.?up\b/i, /\bformat\b/i, /\brename\b/i, /\bresize\b/i,
  /\bupdate.*(lib|package|dependency|version)\b/i,
  /\bcatch.*stale\b/i, /\bcover.*flow\b/i, /\bautomat(e|ic).*(test)\b/i,
  /\bvisually.?(re.?check|inspect)\b/i, /\bcross.?link\b/i,
  /\becho.*ethos\b/i, /\bmatch.*timeline\b/i, /\bsame.*export\b/i,
];

function classifyTask(task: { id: string; title: string; description?: string }): TaskClassification {
  const text = `${task.title} ${task.description ?? ""}`;

  for (const { pattern, rule } of HARD_RED_PATTERNS) {
    if (pattern.test(text)) {
      return {
        ...task,
        tier: "RED",
        rule,
        reasoning: `Hard guardrail triggered on "${task.title}". ${rule}. Requires founder voice.`,
        councilSeat: pickRedSeat(text),
        hardGuardrail: true,
      };
    }
  }

  if (GREEN_SIGNALS.some((p) => p.test(text))) {
    return {
      ...task,
      tier: "GREEN",
      rule: "Passes all 5 Compact rules · clearly technical/infrastructure · no founder input needed",
      reasoning: `"${task.title}" is infrastructure or maintenance work. Compact Rule 3 (increases self-reliance), Rule 5 (owns the machine). All Three Tests pass by construction.`,
    };
  }

  const cluster = detectThemeCluster(text);
  return {
    ...task,
    tier: "AMBER",
    rule: "Directionally correct · grouped by theme for batch review",
    reasoning: `"${task.title}" doesn't trigger hard-RED guardrails but isn't clearly mechanical. Review with the theme group — Compact Rule 4 applies.`,
    councilSeat: pickAmberSeat(text),
    themeCluster: cluster,
  };
}

function pickRedSeat(text: string): CouncilSeat {
  if (/\b(pric|revenue|money|financial|billing|cost|budget)\b/i.test(text)) return "saltbox";
  if (/\b(architect|system|platform|engine|infrastructure|deploy)\b/i.test(text)) return "smith";
  if (/\b(sync|data|flow|dependency|integrat)\b/i.test(text)) return "systems";
  if (/\b(community|client|user|member|partner)\b/i.test(text)) return "community";
  if (/\b(name|brand|copy|language|framing)\b/i.test(text)) return "codetry";
  return "saltbox";
}

function pickAmberSeat(text: string): CouncilSeat {
  if (/\b(test|spec|coverage|quality)\b/i.test(text)) return "smith";
  if (/\b(sync|data|feed|import)\b/i.test(text)) return "systems";
  if (/\b(copy|content|voice|language|headline)\b/i.test(text)) return "codetry";
  if (/\b(community|client|member|public)\b/i.test(text)) return "community";
  return "smith";
}

function detectThemeCluster(text: string): string {
  for (const { label, patterns } of THEME_CLUSTERS) {
    if (patterns.some((p) => p.test(text))) return label;
  }
  return "general";
}

// ── Schemas ───────────────────────────────────────────────────────────────────

const ImportTaskSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(2000).optional(),
  projectId: z.string().optional(),
});

const ImportBodySchema = z.object({
  tasks: z.array(ImportTaskSchema).max(500).optional(),
  lines: z.string().max(50000).optional(),
  projectId: z.string().optional(),
});

const TriageSchema = z.object({
  tasks: z.array(z.object({
    id: z.string(),
    title: z.string().min(1).max(500),
    description: z.string().max(2000).optional(),
  })).max(200),
});

const ApproveSchema = z.object({
  taskIds: z.array(z.string()).min(1).max(200),
  tier: z.enum(["green", "amber"]),
  dryRun: z.boolean().default(false),
});

const UnapproveSchema = z.object({
  taskIds: z.array(z.string()).min(1).max(200),
});

const AuditOverrideSchema = z.object({
  taskId: z.string(),
  taskTitle: z.string().optional(),
  fromTier: z.enum(["GREEN", "AMBER", "RED"]),
  toTier: z.enum(["GREEN", "AMBER", "RED"]),
  reason: z.string().optional(),
});

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /tasks/proposed — the standard "what needs triage" endpoint
// (also exposed by constellation projects so they can be pulled from here)
router.get("/proposed", (_req: Request, res: Response) => {
  const tasks = readTasks().filter((t) => t.status === "proposed");
  res.json({ tasks });
});

// GET /tasks/pending — what has been approved
router.get("/pending", (_req: Request, res: Response) => {
  const tasks = readTasks().filter((t) => t.status === "pending");
  res.json({ tasks });
});

// POST /tasks/import — seed tasks into the PROPOSED queue
// Idempotent: existing titles are skipped (case-insensitive)
router.post("/import", (req: Request, res: Response) => {
  if (!requireOwner(req)) { res.status(401).json({ error: "Owner token required" }); return; }
  const parsed = ImportBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { tasks: taskArray, lines, projectId } = parsed.data;

  // Build raw list of {title, description} from either source
  let incoming: { title: string; description?: string }[] = [];
  if (taskArray?.length) {
    incoming = taskArray;
  } else if (lines) {
    incoming = lines
      .split("\n")
      .map((l) => l.replace(/^[-•·*#\d.]+\s*/, "").trim())
      .filter((l) => l.length > 2 && l.length < 500)
      .map((title) => ({ title }));
  }

  if (!incoming.length) {
    res.status(400).json({ error: "No tasks found in import body." });
    return;
  }

  const all = readTasks();
  const existingTitles = new Set(all.map((t) => t.title.toLowerCase().trim()));

  const now = new Date().toISOString();
  let imported = 0;
  let skipped = 0;

  for (const item of incoming) {
    const titleKey = item.title.toLowerCase().trim();
    if (existingTitles.has(titleKey)) {
      skipped++;
      continue;
    }
    const task: StoredTask = {
      id: crypto.randomUUID(),
      title: item.title.trim(),
      description: item.description,
      status: "proposed",
      projectId,
      importedAt: now,
      updatedAt: now,
    };
    all.push(task);
    existingTitles.add(titleKey);
    appendAudit({ taskId: task.id, taskTitle: task.title, event: "imported", toStatus: "proposed", at: now });
    imported++;
  }

  writeTasks(all);
  logger.info({ imported, skipped }, "task-autopilot: tasks imported");
  res.json({ ok: true, imported, skipped });
});

// POST /tasks/triage — pure classification, does not change state
router.post("/triage", (req: Request, res: Response) => {
  const parsed = TriageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const results = parsed.data.tasks.map(classifyTask);

  const amberGroups = new Map<string, TaskClassification[]>();
  for (const t of results) {
    if (t.tier === "AMBER") {
      const cluster = t.themeCluster ?? "general";
      const arr = amberGroups.get(cluster);
      if (arr) arr.push(t);
      else amberGroups.set(cluster, [t]);
    }
  }

  res.json({
    tasks: results,
    summary: {
      green: results.filter((t) => t.tier === "GREEN").length,
      amber: results.filter((t) => t.tier === "AMBER").length,
      red: results.filter((t) => t.tier === "RED").length,
      total: results.length,
    },
    amberGroups: Object.fromEntries(
      Array.from(amberGroups.entries()).map(([cluster, tasks]) => [
        cluster,
        { tasks, count: tasks.length },
      ])
    ),
  });
});

// POST /tasks/approve — transition PROPOSED → PENDING (idempotent)
router.post("/approve", (req: Request, res: Response) => {
  if (!requireOwner(req)) { res.status(401).json({ error: "Owner token required" }); return; }
  const parsed = ApproveSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { taskIds, tier, dryRun } = parsed.data;
  const idSet = new Set(taskIds);

  if (dryRun) {
    const proposed = readTasks().filter((t) => idSet.has(t.id) && t.status === "proposed");
    res.json({ ok: true, dryRun: true, wouldApprove: proposed.length, taskIds: proposed.map((t) => t.id) });
    return;
  }

  const all = readTasks();
  const now = new Date().toISOString();
  let approved = 0;
  let alreadyPending = 0;

  for (const task of all) {
    if (!idSet.has(task.id)) continue;
    if (task.status === "pending") { alreadyPending++; continue; }
    if (task.status === "proposed") {
      task.status = "pending";
      task.updatedAt = now;
      appendAudit({
        taskId: task.id,
        taskTitle: task.title,
        event: "approved",
        fromStatus: "proposed",
        toStatus: "pending",
        tier: tier.toUpperCase(),
        at: now,
      });
      approved++;
    }
  }

  writeTasks(all);
  logger.info({ approved, alreadyPending, tier }, "task-autopilot: batch approved → PENDING");
  res.json({ ok: true, approved, alreadyPending });
});

// POST /tasks/unapprove — revert PENDING → PROPOSED
router.post("/unapprove", (req: Request, res: Response) => {
  if (!requireOwner(req)) { res.status(401).json({ error: "Owner token required" }); return; }
  const parsed = UnapproveSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { taskIds } = parsed.data;
  const idSet = new Set(taskIds);
  const all = readTasks();
  const now = new Date().toISOString();
  let reverted = 0;

  for (const task of all) {
    if (!idSet.has(task.id)) continue;
    if (task.status === "pending") {
      task.status = "proposed";
      task.updatedAt = now;
      appendAudit({ taskId: task.id, taskTitle: task.title, event: "unapproved", fromStatus: "pending", toStatus: "proposed", at: now });
      reverted++;
    }
  }

  writeTasks(all);
  logger.info({ reverted }, "task-autopilot: batch reverted → PROPOSED");
  res.json({ ok: true, reverted });
});

// GET /tasks/audit-log
router.get("/audit-log", (_req: Request, res: Response) => {
  res.json({ entries: readAudit() });
});

// POST /tasks/audit-log — record a manual override
router.post("/audit-log", (req: Request, res: Response) => {
  if (!requireOwner(req)) { res.status(401).json({ error: "Owner token required" }); return; }
  const parsed = AuditOverrideSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }
  appendAudit({ ...parsed.data, event: "override", at: new Date().toISOString() });
  res.json({ ok: true });
});

// POST /tasks/audit-log/constellation — record approvals that happened on an external constellation project
const ConstellationAuditSchema = z.object({
  tasks: z.array(z.object({
    id: z.string(),
    title: z.string().optional(),
  })).min(1).max(200),
  projectId: z.string().min(1),
  projectLabel: z.string().optional(),
  tier: z.string().optional(),
});

router.post("/audit-log/constellation", (req: Request, res: Response) => {
  const parsed = ConstellationAuditSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }
  const { tasks, projectId, projectLabel, tier } = parsed.data;
  const now = new Date().toISOString();
  for (const task of tasks) {
    appendAudit({
      taskId: task.id,
      taskTitle: task.title,
      event: "constellation-approved",
      toStatus: "pending",
      tier,
      projectId,
      projectLabel,
      at: now,
    });
  }
  logger.info({ count: tasks.length, projectId, projectLabel }, "task-autopilot: constellation tasks recorded in audit log");
  res.json({ ok: true, recorded: tasks.length });
});

export default router;
