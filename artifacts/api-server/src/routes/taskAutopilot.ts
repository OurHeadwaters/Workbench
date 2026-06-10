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
 *
 *   POST /api/tasks/archive  [owner-only]
 *     Body: { olderThanDays?: number }  (default: 30)
 *     Moves CLEARED tasks whose updatedAt is older than olderThanDays days out
 *     of the live store and appends them to task-autopilot-archive.jsonl.
 *     Returns: { ok: true, archived: number }
 *
 * ── Retention policy ──────────────────────────────────────────────────────────
 *   Live store  (task-autopilot-tasks.jsonl)
 *     • PROPOSED / PENDING tasks are never auto-removed; they must be explicitly
 *       transitioned or archived by the owner.
 *     • CLEARED tasks are auto-pruned on every write if their count exceeds
 *       MAX_CLEARED_RETAINED (200). The oldest entries (by updatedAt) are moved
 *       to the archive file silently, keeping the live store bounded.
 *     • Call POST /api/tasks/archive periodically (e.g. weekly cron) to move
 *       older CLEARED tasks explicitly and keep the live file small.
 *
 *   Archive file  (task-autopilot-archive.jsonl)
 *     • Append-only. Never read at runtime — exists only for audit/recovery.
 *     • Grows without a hard bound; prune or rotate manually if disk space
 *       becomes a concern (safe to delete lines older than desired retention).
 *
 *   Audit log  (task-autopilot-audit.jsonl)
 *     • Already sliced to the last 500 entries on every read.
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
const ARCHIVE_FILE = path.join(DATA_DIR, "task-autopilot-archive.jsonl");

// Maximum number of CLEARED tasks kept in the live store.
// On every writeTasks() call, surplus CLEARED entries (oldest first) are
// silently appended to ARCHIVE_FILE so the live file stays bounded.
const MAX_CLEARED_RETAINED = 200;

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

/**
 * Append tasks to the archive file (append-only, never read at runtime).
 * Creates the file if it doesn't exist.
 */
function appendToArchive(tasks: StoredTask[]) {
  if (!tasks.length) return;
  ensureDataDir();
  fs.appendFileSync(ARCHIVE_FILE, tasks.map((t) => JSON.stringify(t)).join("\n") + "\n", "utf8");
}

/**
 * Write the task list to disk.
 *
 * Auto-pruning: if the number of CLEARED tasks exceeds MAX_CLEARED_RETAINED,
 * the oldest CLEARED entries (sorted by updatedAt ascending) are moved to the
 * archive file before writing, keeping the live store bounded without any
 * manual intervention.
 */
function writeTasks(tasks: StoredTask[]) {
  ensureDataDir();

  const cleared = tasks.filter((t) => t.status === "cleared");
  const nonCleared = tasks.filter((t) => t.status !== "cleared");

  let keptCleared = cleared;
  if (cleared.length > MAX_CLEARED_RETAINED) {
    // Sort oldest-first so we evict the stale entries
    const sorted = cleared.slice().sort(
      (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    );
    const evict = sorted.slice(0, cleared.length - MAX_CLEARED_RETAINED);
    keptCleared = sorted.slice(cleared.length - MAX_CLEARED_RETAINED);
    appendToArchive(evict);
    logger.info({ evicted: evict.length }, "task-autopilot: auto-pruned oldest CLEARED tasks to archive");
  }

  const final = [...nonCleared, ...keptCleared];
  fs.writeFileSync(TASKS_FILE, final.map((t) => JSON.stringify(t)).join("\n") + (final.length ? "\n" : ""), "utf8");
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

// ── Override learning index ───────────────────────────────────────────────────

/**
 * Normalise a task title to a stable lookup key:
 *   - lowercase
 *   - collapse whitespace / punctuation to single space
 *   - trim
 */
function normaliseTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

type TierVotes = { GREEN: number; AMBER: number; RED: number };

/**
 * Scan the audit log for "override" events and tally per-title votes.
 * Returns a Map<normalisedTitle → TierVotes>.
 *
 * A minimum of OVERRIDE_THRESHOLD votes in one direction is required before
 * the learned tier is applied (see classifyTask).
 */
const OVERRIDE_THRESHOLD = 3;

function buildOverrideIndex(): Map<string, TierVotes> {
  const index = new Map<string, TierVotes>();
  const entries = readAudit();
  for (const e of entries) {
    if (e.event !== "override" || !e.taskTitle || !e.toTier) continue;
    const key = normaliseTitle(e.taskTitle);
    const tier = e.toTier as Tier;
    if (!["GREEN", "AMBER", "RED"].includes(tier)) continue;
    if (!index.has(key)) index.set(key, { GREEN: 0, AMBER: 0, RED: 0 });
    index.get(key)![tier]++;
  }
  return index;
}

/**
 * Given an override vote tally, return the dominant learned tier only when
 * there is clear directional consensus:
 *   1. The top tier has >= OVERRIDE_THRESHOLD votes.
 *   2. The top tier's count is strictly greater than twice the second-highest
 *      tier's count (supermajority).  This rejects ties (GREEN=3, AMBER=3)
 *      and rejects conflicting signal (GREEN=3, RED=2) while still allowing
 *      the system to learn when a small number of noise overrides exist
 *      (GREEN=5, RED=1 → 5 > 2×1 passes).
 *
 * Returns null if no tier meets both criteria.
 */
function learnedTier(votes: TierVotes): { tier: Tier; count: number } | null {
  const tiers: Tier[] = ["GREEN", "AMBER", "RED"];
  const sorted = tiers.slice().sort((a, b) => votes[b] - votes[a]);
  const top = sorted[0];
  const second = sorted[1];
  const topCount = votes[top];
  const secondCount = votes[second];

  // Require threshold AND supermajority over second-highest
  if (topCount < OVERRIDE_THRESHOLD) return null;
  if (topCount <= secondCount * 2) return null;

  return { tier: top, count: topCount };
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
  greenSignalsIgnored?: string[];
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

export function classifyTask(
  task: { id: string; title: string; description?: string },
  overrideIndex?: Map<string, TierVotes>,
): TaskClassification {
  const text = `${task.title} ${task.description ?? ""}`;
  const key = normaliseTitle(task.title);

  // ── Step 1: check learned overrides ──────────────────────────────────────
  // If the founder has overridden this title pattern 3+ times consistently,
  // trust the learned tier and skip the default rules entirely.
  if (overrideIndex) {
    const votes = overrideIndex.get(key);
    if (votes) {
      const learned = learnedTier(votes);
      if (learned) {
        const total = votes.GREEN + votes.AMBER + votes.RED;
        const learnedRule = `Learned from ${learned.count} of ${total} override(s) → ${learned.tier}`;
        const learnedReasoning =
          `"${task.title}" has been manually overridden to ${learned.tier} ${learned.count} time(s) ` +
          `(out of ${total} total override(s) recorded). The classifier is applying the founder's ` +
          `established preference rather than the default keyword rules.`;
        return {
          ...task,
          tier: learned.tier,
          rule: learnedRule,
          reasoning: learnedReasoning,
          councilSeat: learned.tier === "RED" ? pickRedSeat(text) : learned.tier === "AMBER" ? pickAmberSeat(text) : undefined,
          themeCluster: learned.tier === "AMBER" ? detectThemeCluster(text) : undefined,
          hardGuardrail: learned.tier === "RED",
        };
      }
    }
  }

  // ── Step 2: hard-RED guardrails ───────────────────────────────────────────
  for (const { pattern, rule } of HARD_RED_PATTERNS) {
    if (pattern.test(text)) {
      // Collect any GREEN signal patterns that also matched — these are the
      // phrases a human might read as "safe" but that the guardrail overrides.
      const greenSignalsIgnored = GREEN_SIGNALS
        .filter((p) => p.test(text))
        .map((p) => p.source);

      return {
        ...task,
        tier: "RED",
        rule,
        reasoning: `Hard guardrail triggered on "${task.title}". ${rule}. Requires founder voice.`,
        councilSeat: pickRedSeat(text),
        hardGuardrail: true,
        ...(greenSignalsIgnored.length > 0 ? { greenSignalsIgnored } : {}),
      };
    }
  }

  // ── Step 3: GREEN signals ─────────────────────────────────────────────────
  if (GREEN_SIGNALS.some((p) => p.test(text))) {
    return {
      ...task,
      tier: "GREEN",
      rule: "Passes all 5 Compact rules · clearly technical/infrastructure · no founder input needed",
      reasoning: `"${task.title}" is infrastructure or maintenance work. Compact Rule 3 (increases self-reliance), Rule 5 (owns the machine). All Three Tests pass by construction.`,
    };
  }

  // ── Step 4: AMBER default ─────────────────────────────────────────────────
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

  // Build the override learning index once per request so every task in this
  // batch benefits from the same up-to-date history.
  const overrideIndex = buildOverrideIndex();

  const results = parsed.data.tasks.map((t) => classifyTask(t, overrideIndex));

  const amberGroups = new Map<string, TaskClassification[]>();
  for (const t of results) {
    if (t.tier === "AMBER") {
      const cluster = t.themeCluster ?? "general";
      const arr = amberGroups.get(cluster);
      if (arr) arr.push(t);
      else amberGroups.set(cluster, [t]);
    }
  }

  const learnedResults = results.filter((t) => t.rule.startsWith("Learned from"));

  res.json({
    tasks: results,
    summary: {
      green: results.filter((t) => t.tier === "GREEN").length,
      amber: results.filter((t) => t.tier === "AMBER").length,
      red: results.filter((t) => t.tier === "RED").length,
      learned: learnedResults.length,
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

// GET /tasks/learned-patterns
// Returns the current set of title patterns that have reached the override
// threshold, along with their vote tallies. Useful for transparency / debugging.
router.get("/learned-patterns", (_req: Request, res: Response) => {
  const index = buildOverrideIndex();
  const patterns: Array<{ title: string; votes: TierVotes; learnedTier: Tier | null; threshold: number }> = [];
  for (const [title, votes] of index.entries()) {
    const lt = learnedTier(votes);
    patterns.push({ title, votes, learnedTier: lt?.tier ?? null, threshold: OVERRIDE_THRESHOLD });
  }
  const active = patterns.filter((p) => p.learnedTier !== null);
  const pending = patterns.filter((p) => p.learnedTier === null);
  res.json({ threshold: OVERRIDE_THRESHOLD, active, pending, total: patterns.length });
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

// POST /tasks/archive  [owner-only]
//
// Retention policy: moves CLEARED tasks whose updatedAt is older than
// `olderThanDays` days (default 30) out of the live store and into the
// append-only archive file (task-autopilot-archive.jsonl).
//
// The live store is also protected by the auto-prune logic inside writeTasks()
// (MAX_CLEARED_RETAINED = 200), so calling this endpoint is optional but
// recommended for routine housekeeping (e.g. a weekly cron job:
//   POST /api/tasks/archive  { "olderThanDays": 30 }).
//
// PROPOSED / PENDING tasks are never touched by this endpoint.
const ArchiveSchema = z.object({
  olderThanDays: z.number().int().min(0).max(3650).default(30),
});

/**
 * Core archive logic — extracted so the weekly scheduler can call it directly
 * without going through the HTTP layer.
 *
 * Moves CLEARED tasks whose updatedAt is older than `olderThanDays` days out
 * of the live store and appends them to the archive file.
 *
 * Returns the number of tasks archived and the cutoff timestamp used.
 */
export function archiveClearedTasks(olderThanDays: number): { archived: number; cutoff: string } {
  const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);

  const all = readTasks();
  const toArchive: StoredTask[] = [];
  const keep: StoredTask[] = [];

  for (const task of all) {
    if (task.status === "cleared" && new Date(task.updatedAt) < cutoff) {
      toArchive.push(task);
    } else {
      keep.push(task);
    }
  }

  if (toArchive.length > 0) {
    appendToArchive(toArchive);
    ensureDataDir();
    fs.writeFileSync(TASKS_FILE, keep.map((t) => JSON.stringify(t)).join("\n") + (keep.length ? "\n" : ""), "utf8");
  }

  return { archived: toArchive.length, cutoff: cutoff.toISOString() };
}

router.post("/archive", (req: Request, res: Response) => {
  if (!requireOwner(req)) { res.status(401).json({ error: "Owner token required" }); return; }

  const parsed = ArchiveSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { olderThanDays } = parsed.data;
  const result = archiveClearedTasks(olderThanDays);

  if (result.archived > 0) {
    logger.info({ archived: result.archived, olderThanDays }, "task-autopilot: manual archive run complete");
  }

  res.json({ ok: true, archived: result.archived, olderThanDays, cutoff: result.cutoff });
});

export default router;
