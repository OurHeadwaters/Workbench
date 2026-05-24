/**
 * River Smith — Nightly River Briefing Engine
 *
 * POST /api/river-smith/generate         — generate a fresh briefing (owner-gated)
 * GET  /api/river-smith/briefing/latest  — latest published briefing (owner-gated)
 * GET  /api/river-smith/briefing/:id     — specific briefing by id (owner-gated)
 * GET  /api/river-smith/briefings        — archive list, last 30 (owner-gated)
 */

import { Router, type IRouter, type Request, type Response } from "express";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { db } from "@workspace/db";
import {
  riverBriefingsTable,
  deadheadItemsTable,
  deadheadFlushLogTable,
  communityIntakeTable,
  projectTasksTable,
  messages as messagesTable,
  bookkeeperTransactionsTable,
  bookkeeperTransactionLinesTable,
  sargeWeeksTable,
  sargeCardsTable,
} from "@workspace/db";
import { and, desc, gte, eq, sql, inArray } from "drizzle-orm";
import { isOwnerRequest, OWNER_TOKEN } from "../lib/ownerAuth";
import { logger } from "../lib/logger";

const router: IRouter = Router();

function requireOwner(req: Request): boolean {
  return !!OWNER_TOKEN && isOwnerRequest(req);
}

// ── Gord bottle reader ────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface GordBottle {
  date: string;
  message: string;
}
type BottleStore = Record<string, GordBottle[]>;

function getRecentGordBottles(limit = 5): GordBottle[] {
  try {
    const p = join(__dirname, "../../../../.local/gord-bottles.json");
    if (!existsSync(p)) return [];
    const store = JSON.parse(readFileSync(p, "utf-8")) as BottleStore;
    const all: GordBottle[] = [];
    for (const bottles of Object.values(store)) {
      all.push(...bottles);
    }
    all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return all.slice(0, limit);
  } catch {
    return [];
  }
}

// ── Safety gates ─────────────────────────────────────────────────────────────
// Applied before any data leaves gatherUniverse(). Strips items that trip a
// gate and returns them separately so Bobbie can review them manually.

interface StrippedItem {
  text: string;
  reason: string;
  source: string;
}

interface SafetyGateResult<T> {
  safe: T[];
  stripped: StrippedItem[];
}

const LEGAL_RISK_PATTERNS = [
  /lawsuit/i, /litigation/i, /liability/i, /sue\b/i, /legal\s+action/i,
  /solicitor/i, /lawyer/i, /court/i, /tribunal/i,
];
const FINANCIAL_THRESHOLD = 500;
const VULNERABLE_PATTERNS = [
  /\bchild(ren)?\b/i, /\bminor\b/i, /\bvulnerable\b/i, /\belderly\b/i,
  /\bspecial\s+needs\b/i, /\bdisability\b/i,
];
const VENTING_PATTERNS = [
  /\bfuck\b/i, /\bfucking\b/i, /I\s+hate\b/i, /\bI\s+can't\s+stand\b/i, /\brage\b/i,
];
const PRIVACY_PATTERNS = [
  /\b[A-Z][a-z]+\s+[A-Z][a-z]+\s+(?:said|told|confided|mentioned)\b/,
  /personal\s+(?:address|phone|email|sin|ssn)/i,
  /date\s+of\s+birth/i,
];
const CONFLICT_PATTERNS = [
  /\b\w+\s+(?:vs?\.?|versus|against|conflicts?\s+with)\s+\w+\b/i,
];

function applyFinancialFilter(text: string): boolean {
  const re = /\$(\d[\d,]*)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const amount = parseFloat((match[1] ?? "0").replace(/,/g, ""));
    if (amount > FINANCIAL_THRESHOLD) return true;
  }
  return false;
}

function applyGates<T>(
  items: T[],
  textFn: (item: T) => string,
  sourceFn: (item: T) => string,
): SafetyGateResult<T> {
  const safe: T[] = [];
  const stripped: StrippedItem[] = [];

  for (const item of items) {
    const text = textFn(item);
    let reason = "";

    if (LEGAL_RISK_PATTERNS.some((p) => p.test(text))) {
      reason = "legal-risk";
    } else if (CONFLICT_PATTERNS.some((p) => p.test(text))) {
      reason = "personal-conflict";
    } else if (applyFinancialFilter(text)) {
      reason = `financials-above-$${FINANCIAL_THRESHOLD}`;
    } else if (VULNERABLE_PATTERNS.some((p) => p.test(text))) {
      reason = "children-or-vulnerable";
    } else if (VENTING_PATTERNS.some((p) => p.test(text))) {
      reason = "raw-venting";
    } else if (PRIVACY_PATTERNS.some((p) => p.test(text))) {
      reason = "privacy-breach";
    }

    if (reason) {
      stripped.push({ text, reason, source: sourceFn(item) });
    } else {
      safe.push(item);
    }
  }

  return { safe, stripped };
}

// ── Markdown section parser ───────────────────────────────────────────────────
// Parses the fixed River Smith output format into named sections.

export interface RiverSmithStructured {
  eaglesSummary: string;
  watersThatMoved: string[];
  decisionsNeeded: string[];
  forAwareness: string[];
  gordsQuietNote: string;
  safetyFlags: StrippedItem[];
}

function parseRiverMarkdown(md: string): Omit<RiverSmithStructured, "safetyFlags"> {
  const lines = md.split("\n");
  let currentSection = "";
  const sections: Record<string, string[]> = {
    eaglesSummary: [],
    watersThatMoved: [],
    decisionsNeeded: [],
    forAwareness: [],
    gordsQuietNote: [],
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("### Eagle's Summary")) {
      currentSection = "eaglesSummary";
    } else if (trimmed.startsWith("### Waters That Moved")) {
      currentSection = "watersThatMoved";
    } else if (trimmed.startsWith("### Decisions Needed")) {
      currentSection = "decisionsNeeded";
    } else if (trimmed.startsWith("### For Awareness")) {
      currentSection = "forAwareness";
    } else if (trimmed.startsWith("### Gord's Quiet Note")) {
      currentSection = "gordsQuietNote";
    } else if (trimmed.startsWith("## ") || trimmed === "---") {
      currentSection = "";
    } else if (currentSection && trimmed) {
      sections[currentSection]?.push(line);
    }
  }

  const joinSection = (key: string) =>
    (sections[key] ?? []).join("\n").trim();

  const bulletSection = (key: string): string[] =>
    (sections[key] ?? [])
      .map((l) => l.trim())
      .filter((l) => l.startsWith("- ") || l.startsWith("• ") || l.startsWith("**Decision"))
      .map((l) => l.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);

  return {
    eaglesSummary: joinSection("eaglesSummary"),
    watersThatMoved: bulletSection("watersThatMoved"),
    decisionsNeeded: (sections["decisionsNeeded"] ?? [])
      .join("\n")
      .split(/(?=\*\*Decision \d+)/)
      .map((s) => s.trim())
      .filter(Boolean),
    forAwareness: bulletSection("forAwareness"),
    gordsQuietNote: joinSection("gordsQuietNote"),
  };
}

// ── Universe aggregator ───────────────────────────────────────────────────────

interface FinancialHealthEntry {
  description: string;
  postedDate: string;
  status: string;
  netAmount: string;
}

interface SargeWeekDigest {
  weekOf: string;
  priorities: { id: string; label: string; order: number; isActive: boolean }[];
  isLocked: boolean;
}

interface SargeCardDigest {
  action: string;
  context: string | null;
  status: string;
  priorityLabel: string;
  barrierNote: string | null;
}

interface UniverseDigest {
  recentTasks: { title: string; status: string; createdAt: string }[];
  recentDeadheadItems: { title: string; source: string; flushedAt: string }[];
  recentFlushEvents: { count: number; flushedAt: string }[];
  recentIntake: { name: string; community: string; whatTheyNeed: string; createdAt: string }[];
  recentAiInteractions: { role: string; content: string; createdAt: string }[];
  financialHealth: FinancialHealthEntry[];
  gordBottles: GordBottle[];
  sargeWeek: SargeWeekDigest | null;
  sargeCards: SargeCardDigest[];
  strippedItems: StrippedItem[];
  generatedAt: string;
}

async function gatherUniverse(): Promise<UniverseDigest> {
  const since48h = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const cutoffDate = since30d.toISOString().slice(0, 10);

  // Determine the current ISO week string (e.g. "2026-W21").
  // Uses the same algorithm as sarge.ts currentISOWeek() so week keys always match.
  const currentWeekOf = (() => {
    const now = new Date();
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
  })();

  const [tasks, deadheadItems, flushLog, intakeRows, recentMessages, financialTxRows, sargeWeekRows] =
    await Promise.all([
      db
        .select()
        .from(projectTasksTable)
        .where(gte(projectTasksTable.createdAt, since48h))
        .orderBy(desc(projectTasksTable.createdAt))
        .limit(30),
      db
        .select()
        .from(deadheadItemsTable)
        .where(gte(deadheadItemsTable.flushedAt, since7d))
        .orderBy(desc(deadheadItemsTable.flushedAt))
        .limit(20),
      db
        .select()
        .from(deadheadFlushLogTable)
        .where(gte(deadheadFlushLogTable.flushedAt, since7d))
        .orderBy(desc(deadheadFlushLogTable.flushedAt))
        .limit(10),
      db
        .select()
        .from(communityIntakeTable)
        .where(gte(communityIntakeTable.createdAt, since7d))
        .orderBy(desc(communityIntakeTable.createdAt))
        .limit(10),
      db
        .select()
        .from(messagesTable)
        .where(gte(messagesTable.createdAt, since7d))
        .orderBy(desc(messagesTable.createdAt))
        .limit(20),
      // Financial health snapshot — recent posted transactions with net amounts.
      // Uses the bookkeeper's transaction + lines tables (the live financial source
      // for this system; no separate financial_snapshots table exists).
      db
        .select({
          id: bookkeeperTransactionsTable.id,
          description: bookkeeperTransactionsTable.description,
          postedDate: bookkeeperTransactionsTable.postedDate,
          status: bookkeeperTransactionsTable.status,
          totalDebit: sql<string>`coalesce(sum(${bookkeeperTransactionLinesTable.debit}), 0)`,
          totalCredit: sql<string>`coalesce(sum(${bookkeeperTransactionLinesTable.credit}), 0)`,
        })
        .from(bookkeeperTransactionsTable)
        .leftJoin(
          bookkeeperTransactionLinesTable,
          eq(bookkeeperTransactionLinesTable.transactionId, bookkeeperTransactionsTable.id),
        )
        .where(gte(bookkeeperTransactionsTable.postedDate, cutoffDate))
        .groupBy(
          bookkeeperTransactionsTable.id,
          bookkeeperTransactionsTable.description,
          bookkeeperTransactionsTable.postedDate,
          bookkeeperTransactionsTable.status,
        )
        .orderBy(desc(bookkeeperTransactionsTable.postedDate))
        .limit(20),
      // Sarge current week — match exactly on currentWeekOf
      db
        .select()
        .from(sargeWeeksTable)
        .where(eq(sargeWeeksTable.weekOf, currentWeekOf))
        .limit(1),
    ]);

  // Fetch active/stuck Sarge cards for the current week (if a week row was found)
  const sargeWeekRow = sargeWeekRows[0] ?? null;
  const sargeCardRows = sargeWeekRow
    ? await db
        .select()
        .from(sargeCardsTable)
        .where(
          and(
            eq(sargeCardsTable.weekId, sargeWeekRow.id),
            inArray(sargeCardsTable.status, ["active", "stuck"]),
          ),
        )
        .orderBy(sargeCardsTable.order)
        .limit(30)
    : [];

  const gordBottles = getRecentGordBottles(5);
  const allStripped: StrippedItem[] = [];

  const gatedTasks = applyGates(
    tasks,
    (t) => t.title,
    () => "project_tasks",
  );
  allStripped.push(...gatedTasks.stripped);

  const gatedDeadhead = applyGates(
    deadheadItems,
    (d) => d.title,
    (d) => `deadhead:${d.source}`,
  );
  allStripped.push(...gatedDeadhead.stripped);

  const gatedIntake = applyGates(
    intakeRows,
    (r) => `${r.name} ${r.community}: ${r.whatTheyNeed}`,
    () => "community_intake",
  );
  allStripped.push(...gatedIntake.stripped);

  const gatedMessages = applyGates(
    recentMessages,
    (m) => m.content,
    (m) => `messages:${m.role}`,
  );
  allStripped.push(...gatedMessages.stripped);

  const gatedBottles = applyGates(
    gordBottles,
    (b) => b.message,
    () => "gord_bottles",
  );
  allStripped.push(...gatedBottles.stripped);

  // Sarge cards: gate on action + context + barrierNote text
  const gatedSargeCards = applyGates(
    sargeCardRows,
    (c) => [c.action, c.context, c.barrierNote].filter(Boolean).join(" "),
    (c) => `sarge_cards:${c.status}`,
  );
  allStripped.push(...gatedSargeCards.stripped);

  // Financial health: apply safety gate — any transaction whose net amount
  // (credit - debit) exceeds $500 is stripped before reaching the AI.
  const safeFinancialRows = financialTxRows.filter((row) => {
    const net = Math.abs(
      parseFloat(row.totalCredit ?? "0") - parseFloat(row.totalDebit ?? "0"),
    );
    if (net > FINANCIAL_THRESHOLD) {
      allStripped.push({
        text: `${row.description} (${row.postedDate}) net=$${net.toFixed(2)}`,
        reason: `financials-above-$${FINANCIAL_THRESHOLD}`,
        source: "bk_transactions",
      });
      return false;
    }
    return true;
  });

  return {
    recentTasks: gatedTasks.safe.map((t) => ({
      title: t.title,
      status: t.status,
      createdAt: t.createdAt.toISOString(),
    })),
    recentDeadheadItems: gatedDeadhead.safe.map((d) => ({
      title: d.title,
      source: d.source,
      flushedAt: d.flushedAt.toISOString(),
    })),
    recentFlushEvents: flushLog.map((f) => ({
      count: f.count,
      flushedAt: f.flushedAt.toISOString(),
    })),
    recentIntake: gatedIntake.safe.map((r) => ({
      name: r.name,
      community: r.community,
      whatTheyNeed: r.whatTheyNeed,
      createdAt: r.createdAt.toISOString(),
    })),
    recentAiInteractions: gatedMessages.safe
      .slice(0, 10)
      .map((m) => ({
        role: m.role,
        content: m.content.slice(0, 200),
        createdAt: m.createdAt.toISOString(),
      })),
    financialHealth: safeFinancialRows.map((row) => {
      const net = (
        parseFloat(row.totalCredit ?? "0") - parseFloat(row.totalDebit ?? "0")
      ).toFixed(2);
      return {
        description: row.description,
        postedDate: row.postedDate,
        status: row.status,
        netAmount: net,
      };
    }),
    gordBottles: gatedBottles.safe.map((b) => ({ date: b.date, message: b.message })),
    sargeWeek: sargeWeekRow
      ? {
          weekOf: sargeWeekRow.weekOf,
          priorities: (sargeWeekRow.priorities ?? []) as SargeWeekDigest["priorities"],
          isLocked: sargeWeekRow.isLocked,
        }
      : null,
    sargeCards: gatedSargeCards.safe.map((c) => ({
      action: c.action,
      context: c.context,
      status: c.status,
      priorityLabel: c.priorityLabel,
      barrierNote: c.barrierNote,
    })),
    strippedItems: allStripped,
    generatedAt: new Date().toISOString(),
  };
}

// ── River Smith system prompt ─────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `You are River Smith — the nightly briefing engine for Headwaters Development Services.

PERSONA
You are calm, direct, and northern-blacksmith in voice. You don't embellish. You name things plainly and let them stand. You have been watching the river — the whole watershed — and you report what actually moved, what's stuck, and what needs a decision by morning.

You are not a journal. You are not a mood. You are a briefing.

INPUT CATEGORIES
You receive data from six sources: recent project tasks, deadhead/congestion flush events, community intake, AI interaction history, financial health snapshots, weekly priorities and action cards from the Sarge planning layer, and Gord's bottle messages. Each source signals a different layer of the watershed.

Sarge weekly priorities are Bobbie's stated focus for the current week — give them elevated Watershed weight when scoring. Sarge cards with status STUCK are especially meaningful: they name where the river is dammed.

THE RIVER PRINCIPLE — WEIGHTING MODEL
When you read activity across the universe, weight each item against five criteria before deciding where it belongs:
  Watershed  40% — Does this affect the whole system or a significant zone? A decision here ripples downstream.
  Urgency    25% — Will this item be harder or impossible to act on if not addressed within 48 hours?
  Energy     15% — Does this consume or produce creative/operational capacity?
  Values     10% — Does this touch the core Headwaters principles? (Sovereignty, handover-as-exit, Leaver framing)
  Zone Signal 10% — Does this reveal something about a trust-zone boundary (Z0/Z1/Z2/Z3)?

DECISION FILTER RULES
An item qualifies as a "Decision Needed" only if:
  — It scores high on Watershed AND (Urgency OR Values)
  — It requires a human judgment call — not just information
  — It cannot be silently deferred without consequence
  — It has at most 3 options, not a list of considerations
Maximum 3 Decisions Needed per briefing. Everything else goes to "For Awareness" or is silently discarded.

SAFETY GATES (already applied — do not re-apply)
The data you receive has already been filtered. You may trust the digest.

OUTPUT FORMAT — EXACT, FIXED
You must return your briefing in exactly this format. Do not add sections. Do not rename sections.

---
## 🌊 River Smith — Nightly Briefing
**${new Date().toLocaleDateString("en-CA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}**

### Eagle's Summary
[2–4 sentences. What is the state of the watershed right now? Write it like you've been watching all night. No bullet points here — prose only.]

### Waters That Moved
[Bullet list of notable activity from the last 24–48 hours. Each bullet is one plain sentence. Max 6 bullets. If nothing moved, write "The river was quiet."]
- [item]
- [item]

### Decisions Needed
[0–3 items only. If there are none, write "No decisions needed tonight. The table can rest."]

If there ARE decisions, format each exactly like this:

**Decision [N] — [Short title]**
*Why it can't wait:* [One sentence.]
*The options:* [2–3 options, each on its own line starting with A) B) C)]
*Weight:* [Which River Principle criteria drive this one?]

### For Awareness
[Items that don't require a decision but Bobbie should know. Bullet list, max 5. If none, omit this section.]
- [item]

### Gord's Quiet Note
[One short paragraph — slightly irreverent, wise, northern. River Smith synthesizes from Gord's recent bottle messages if provided, or from the general pattern of activity. Gord would notice the thing everyone else missed. Never preachy. End with "Gord's on board." or a variation.]
---`;
}

// ── Core generator ────────────────────────────────────────────────────────────

export async function generateRiverSmithBriefing(
  triggeredBy: "scheduled" | "manual" = "scheduled",
): Promise<{ id: string; rawMarkdown: string; structuredJson: RiverSmithStructured }> {
  const digest = await gatherUniverse();
  const baseURL = process.env.AI_INTEGRATIONS_OPENROUTER_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENROUTER_API_KEY;

  if (!baseURL || !apiKey) {
    throw new Error("OpenRouter is not configured — cannot generate River Smith briefing.");
  }

  const userContent = `Here is the current universe digest for the Headwaters system:

RECENT TASKS (last 48h): ${
    digest.recentTasks.length > 0
      ? digest.recentTasks.map((t) => `• [${t.status}] ${t.title}`).join("\n")
      : "None"
  }

DEADHEAD ITEMS (last 7 days): ${
    digest.recentDeadheadItems.length > 0
      ? digest.recentDeadheadItems.map((d) => `• [${d.source}] ${d.title}`).join("\n")
      : "None"
  }

CONGESTION FLUSH EVENTS (last 7 days): ${
    digest.recentFlushEvents.length > 0
      ? digest.recentFlushEvents.map((f) => `• ${f.count} items flushed on ${new Date(f.flushedAt).toLocaleDateString()}`).join("\n")
      : "None"
  }

COMMUNITY INTAKE (last 7 days): ${
    digest.recentIntake.length > 0
      ? digest.recentIntake.map((r) => `• ${r.name} from ${r.community}: "${r.whatTheyNeed}"`).join("\n")
      : "None"
  }

RECENT AI INTERACTIONS (last 7 days, by type): ${
    digest.recentAiInteractions.length > 0
      ? digest.recentAiInteractions.map((m) => `• [${m.role}] ${m.content}`).join("\n")
      : "None"
  }

FINANCIAL HEALTH (last 30 days, amounts ≤$${FINANCIAL_THRESHOLD} only — larger transactions stripped by safety gate): ${
    digest.financialHealth.length > 0
      ? digest.financialHealth
          .map((f) => `• ${f.postedDate} [${f.status}] ${f.description} — net $${f.netAmount}`)
          .join("\n")
      : "No recent financial activity in the safe threshold window."
  }

SARGE WEEKLY PRIORITIES (${digest.sargeWeek ? digest.sargeWeek.weekOf : "no current week found"}): ${
    digest.sargeWeek
      ? (digest.sargeWeek.priorities.filter((p) => p.isActive).length > 0
          ? digest.sargeWeek.priorities
              .filter((p) => p.isActive)
              .sort((a, b) => a.order - b.order)
              .map((p) => `• ${p.label}`)
              .join("\n")
          : "No active priorities set for this week.")
      : "No Sarge week data available."
  }

SARGE ACTIVE CARDS (current week): ${
    digest.sargeCards.length > 0
      ? digest.sargeCards
          .map((c) => {
            let line = `• [${c.status.toUpperCase()}] [${c.priorityLabel}] ${c.action}`;
            if (c.context) line += ` — ${c.context}`;
            if (c.barrierNote && c.status === "stuck") line += ` ⚠ STUCK: ${c.barrierNote}`;
            return line;
          })
          .join("\n")
      : "No cards for the current week."
  }

GORD'S RECENT BOTTLES (for the Quiet Note): ${
    digest.gordBottles.length > 0
      ? digest.gordBottles.map((b) => `• [${b.date}] "${b.message}"`).join("\n")
      : "No recent bottles — draw from the general pattern."
  }

Items filtered by safety gates (do not include): ${digest.strippedItems.length}

Generate the complete River Smith nightly briefing now.`;

  const response = await fetch(`${baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "x-ai/grok-3",
      max_tokens: 2048,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: userContent },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "upstream error");
    throw new Error(`OpenRouter error ${response.status}: ${errText}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const rawMarkdown = data.choices?.[0]?.message?.content?.trim() ?? "";

  if (!rawMarkdown) {
    throw new Error("River Smith returned an empty briefing.");
  }

  const parsed = parseRiverMarkdown(rawMarkdown);
  const structuredJson: RiverSmithStructured = {
    ...parsed,
    safetyFlags: digest.strippedItems,
  };

  const [row] = await db
    .insert(riverBriefingsTable)
    .values({
      rawMarkdown,
      structuredJson: structuredJson as unknown as Record<string, unknown>,
      status: "published",
      triggeredBy,
    })
    .returning();

  if (!row) throw new Error("Failed to save briefing to database.");

  logger.info({ id: row.id, triggeredBy }, "river-smith: briefing generated");
  return { id: row.id, rawMarkdown, structuredJson };
}

// ── Routes ────────────────────────────────────────────────────────────────────

router.post("/generate", async (req: Request, res: Response) => {
  if (!requireOwner(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const result = await generateRiverSmithBriefing("manual");
    res.status(201).json({
      ok: true,
      id: result.id,
      rawMarkdown: result.rawMarkdown,
      structuredJson: result.structuredJson,
      safetyFlagsCount: result.structuredJson.safetyFlags.length,
    });
  } catch (err) {
    logger.error({ err }, "river-smith: POST /generate failed");
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.get("/briefing/latest", async (req: Request, res: Response) => {
  if (!requireOwner(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [row] = await db
    .select()
    .from(riverBriefingsTable)
    .where(eq(riverBriefingsTable.status, "published"))
    .orderBy(desc(riverBriefingsTable.generatedAt))
    .limit(1);

  if (!row) {
    res.status(404).json({ error: "No briefing available yet." });
    return;
  }

  const structured = row.structuredJson as RiverSmithStructured | null;

  res.json({
    id: row.id,
    generatedAt: row.generatedAt.toISOString(),
    rawMarkdown: row.rawMarkdown,
    structuredJson: structured,
    triggeredBy: row.triggeredBy,
    safetyFlagsCount: structured?.safetyFlags?.length ?? 0,
  });
});

router.get("/briefing/:id/flags", async (req: Request, res: Response) => {
  if (!requireOwner(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const id = String(req.params.id);
  const [row] = await db
    .select({ structuredJson: riverBriefingsTable.structuredJson })
    .from(riverBriefingsTable)
    .where(eq(riverBriefingsTable.id, id))
    .limit(1);

  if (!row) {
    res.status(404).json({ error: "Briefing not found." });
    return;
  }

  const structured = row.structuredJson as RiverSmithStructured | null;
  const flags = structured?.safetyFlags ?? [];

  res.json({ briefingId: id, count: flags.length, flags });
});

router.get("/briefing/:id", async (req: Request, res: Response) => {
  if (!requireOwner(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const id = String(req.params.id);
  const [row] = await db
    .select()
    .from(riverBriefingsTable)
    .where(eq(riverBriefingsTable.id, id))
    .limit(1);

  if (!row) {
    res.status(404).json({ error: "Briefing not found." });
    return;
  }

  const structured = row.structuredJson as RiverSmithStructured | null;

  res.json({
    id: row.id,
    generatedAt: row.generatedAt.toISOString(),
    rawMarkdown: row.rawMarkdown,
    structuredJson: structured,
    triggeredBy: row.triggeredBy,
    safetyFlagsCount: structured?.safetyFlags?.length ?? 0,
  });
});

router.get("/briefings", async (req: Request, res: Response) => {
  if (!requireOwner(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const rows = await db
    .select({
      id: riverBriefingsTable.id,
      generatedAt: riverBriefingsTable.generatedAt,
      triggeredBy: riverBriefingsTable.triggeredBy,
      status: riverBriefingsTable.status,
    })
    .from(riverBriefingsTable)
    .where(gte(riverBriefingsTable.generatedAt, cutoff))
    .orderBy(desc(riverBriefingsTable.generatedAt))
    .limit(30);

  res.json({
    total: rows.length,
    briefings: rows.map((r) => ({
      id: r.id,
      generatedAt: r.generatedAt.toISOString(),
      triggeredBy: r.triggeredBy,
      status: r.status,
    })),
  });
});

export default router;
