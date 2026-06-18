/**
 * export-book-snapshot.ts
 *
 * Generates two portable export files at <monorepo-root>/exports/:
 *
 *   exports/codetry-book-data.json   — fully resolved structured data
 *   exports/codetry-book-full.md     — human/agent readable prose in reading order
 *
 * Run with:
 *   pnpm --filter @workspace/codetry-handbook run export-book
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { PARTS, CHAPTERS, type Block, type Part, type Chapter } from "../data/handbook";
import { GLOSSARY_ENTRIES, SECTION_LABELS, SECTION_ORDER } from "../data/glossary";
import { TALES } from "../data/tales";
import { STACK_CARDS } from "../data/stackCards";
import { PIONEER_STATIONS, PIONEER_PHASES } from "../data/pioneerPath";
import { constellation } from "../data/constellation";
import { RUNGS, SUB_SHELVES, VOCAB, ITEMS, STANDBY_PRIMITIVE } from "../data/standby";
import { FOUNDING_EXAMPLE_COMMENTARY } from "../data/foundingExamples";
import { YOUTH_STATIONS, YOUTH_PHASES } from "../data/youthPath";
import { ZONE_AUTHOR_ENTRIES } from "../data/authorPrompts";
import {
  GOAL_KIND_LABELS,
  GOAL_KIND_DESCRIPTIONS,
  HORIZON_LABELS,
  UNIVERSAL_STEPS_BEFORE,
  UNIVERSAL_STEPS_AFTER,
  KIND_STEPS,
} from "../data/dailyDriver";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MONOREPO_ROOT = join(__dirname, "../../..");
const EXPORTS_DIR = join(MONOREPO_ROOT, "exports");
const NARRATION_DIR = join(__dirname, "../public/narration");

const NARRATION_SLUGS = [
  "the-saltbox",
  "both-states",
  "both-sides",
  "the-standby",
  "the-gate",
];

// ── Narration reader ────────────────────────────────────────────────────────

function readNarration(slug: string): string {
  try {
    return readFileSync(join(NARRATION_DIR, `${slug}.md`), "utf-8");
  } catch {
    return `(narration script not found: ${slug}.md)`;
  }
}

// ── Block → Markdown renderer ───────────────────────────────────────────────

function renderBlock(block: Block): string {
  switch (block.kind) {
    case "para":
      return block.text + "\n";
    case "subhead":
      return `### ${block.text}\n`;
    case "pull":
      return `> ${block.text}\n`;
    case "callout":
      return `> **${block.text}**\n`;
    case "list":
      return block.items.map((item) => `- ${item}`).join("\n") + "\n";
    case "ordered":
      return block.items.map((item, i) => `${i + 1}. ${item}`).join("\n") + "\n";
    case "rule":
      return "---\n";
    case "small":
      return `*${block.text}*\n`;
    case "tool":
      return `**Tool: [${block.label}](${block.route})** — ${block.hint}\n`;
    case "collapsible":
      return (
        `<details>\n<summary>${block.label}</summary>\n\n` +
        block.blocks.map(renderBlock).join("\n") +
        `\n</details>\n`
      );
    case "examples":
      return (
        block.items
          .map((ex) => `${ex.name}\n:   ${ex.rule}`)
          .join("\n\n") + "\n"
      );
    case "teachers":
      return (
        block.items
          .map((t) => {
            const link = t.url ? `[${t.name}](${t.url})` : t.name;
            return `- ${link} · *${t.role}*`;
          })
          .join("\n") + "\n"
      );
    default: {
      const _exhaustive: never = block;
      return "";
    }
  }
}

function renderChapter(chapter: Chapter): string {
  const lines: string[] = [];
  lines.push(`## ${chapter.number} · ${chapter.title}\n`);
  for (const block of chapter.blocks) {
    const rendered = renderBlock(block);
    if (rendered.trim()) {
      lines.push(rendered);
      lines.push("");
    }
  }
  return lines.join("\n");
}

function renderPart(part: Part): string {
  const lines: string[] = [];
  lines.push(`# Part ${part.roman} · ${part.title}\n`);
  if (part.blurb) {
    lines.push(`*${part.blurb}*\n`);
  }
  lines.push("");
  for (const chapter of part.chapters) {
    lines.push(renderChapter(chapter));
    lines.push("");
  }
  return lines.join("\n");
}

// ── Markdown document builder ───────────────────────────────────────────────

function buildMarkdown(narrations: Record<string, string>): string {
  const sections: string[] = [];

  sections.push(`# Headwaters: How a Community Runs Its Own Economy\n`);
  sections.push(`*Full content snapshot — exported ${new Date().toISOString().split("T")[0]}*\n`);
  sections.push(`*Constellation version: ${constellation.version} (last updated ${constellation.lastUpdated})*\n`);
  sections.push("\n---\n");

  // ── Main chapters ─────────────────────────────────────────────────────────
  sections.push("# BOOK CONTENT\n\n");
  for (const part of PARTS) {
    sections.push(renderPart(part));
    sections.push("\n---\n\n");
  }

  // ── Formal Vocabulary ─────────────────────────────────────────────────────
  sections.push("# FORMAL VOCABULARY (GLOSSARY)\n\n");
  for (const sectionId of SECTION_ORDER) {
    const entries = GLOSSARY_ENTRIES.filter((e) => e.section === sectionId);
    if (entries.length === 0) continue;
    sections.push(`## ${SECTION_LABELS[sectionId]}\n\n`);
    for (const entry of entries) {
      const group = entry.group ? ` · *${entry.group}*` : "";
      sections.push(`### ${entry.term}\n`);
      sections.push(`*Chapter reference: ${entry.chapter}${group}*\n\n`);
      sections.push(`${entry.definition}\n\n`);
    }
  }
  sections.push("\n---\n\n");

  // ── Tales ─────────────────────────────────────────────────────────────────
  sections.push("# TALES\n\n");
  for (const tale of TALES) {
    sections.push(`## ${tale.title}\n`);
    sections.push(`*${tale.subtitle}*\n\n`);
    sections.push(`> ${tale.excerpt}\n\n`);
    for (const block of tale.body) {
      if (block.kind === "para") {
        sections.push(`${block.text}\n\n`);
      } else if (block.kind === "italic") {
        sections.push(`*${block.text}*\n\n`);
      } else if (block.kind === "break") {
        sections.push(`---\n\n`);
      }
    }
    sections.push(`**Author note:** ${tale.authorNote}\n\n`);
  }
  sections.push("\n---\n\n");

  // ── Practice Cards ────────────────────────────────────────────────────────
  sections.push("# PRACTICE CARDS\n\n");
  const cardsByCategory = new Map<string, typeof STACK_CARDS>();
  for (const card of STACK_CARDS) {
    if (!cardsByCategory.has(card.category)) {
      cardsByCategory.set(card.category, []);
    }
    cardsByCategory.get(card.category)!.push(card);
  }
  for (const [category, cards] of cardsByCategory) {
    sections.push(`## ${category}\n\n`);
    for (const card of cards) {
      sections.push(`### ${card.question}\n\n`);
      sections.push(`${card.context}\n\n`);
      sections.push("**Reflection prompts:**\n\n");
      for (const step of card.steps) {
        sections.push(`- ${step.prompt}\n`);
      }
      sections.push("\n");
    }
  }
  sections.push("\n---\n\n");

  // ── Pioneer Path ──────────────────────────────────────────────────────────
  sections.push("# PIONEER PATH\n\n");
  sections.push(
    `*The handbook walked, not read. ${PIONEER_STATIONS.length} stations across ${PIONEER_PHASES.length} phases.*\n\n`
  );
  for (const phase of PIONEER_PHASES) {
    const stations = PIONEER_STATIONS.filter((s) => s.phase === phase.number);
    sections.push(`## Phase ${phase.number} · ${phase.label}\n`);
    sections.push(`*${phase.description}*\n\n`);
    for (const station of stations) {
      sections.push(`### Station ${station.ordinal} · ${station.name}\n`);
      sections.push(`*${station.subtitle}*\n\n`);
      sections.push(`**Do:** ${station.doPrompt}\n\n`);
    }
  }
  sections.push("\n---\n\n");

  // ── Constellation Snapshot ────────────────────────────────────────────────
  sections.push("# CONSTELLATION SNAPSHOT\n\n");
  sections.push(`*Version ${constellation.version} · ${constellation.lastUpdated}*\n\n`);

  sections.push("## Grammar\n\n");
  sections.push(`- **Practice:** ${constellation.grammar.practice}\n`);
  sections.push(`- **Zone system:** ${constellation.grammar.zoneSystem}\n`);
  sections.push(`- **Thunder:** ${constellation.grammar.thunder}\n\n`);

  sections.push("## Principles\n\n");
  for (const principle of constellation.principles) {
    sections.push(`### ${principle.name}\n\n`);
    sections.push(`${principle.statement}\n\n`);
    if (principle.workedExample) {
      sections.push(`**Worked example:** ${principle.workedExample}\n\n`);
    }
  }

  sections.push("## Constellation-Wide Primitives\n\n");
  for (const primitive of constellation.constellationWidePrimitives) {
    sections.push(`### ${primitive.name}\n\n`);
    sections.push(`${primitive.summary}\n\n`);
    if (primitive.vocabulary && primitive.vocabulary.length > 0) {
      sections.push("**Vocabulary:**\n\n");
      for (const v of primitive.vocabulary) {
        sections.push(`- **${v.term}** — ${v.role}\n`);
      }
      sections.push("\n");
    }
    if (primitive.severityLadder && primitive.severityLadder.length > 0) {
      sections.push("**Severity ladder:**\n\n");
      for (const r of primitive.severityLadder) {
        sections.push(`- **${r.rung}** — ${r.meaning}\n`);
      }
      sections.push("\n");
    }
    if (primitive.rejectedAlternatives && primitive.rejectedAlternatives.length > 0) {
      sections.push("**Rejected alternatives:**\n\n");
      for (const alt of primitive.rejectedAlternatives) {
        sections.push(`- **${alt.name}** — ${alt.reason}\n`);
      }
      sections.push("\n");
    }
  }

  sections.push("## Zones\n\n");
  const allZones = [...(constellation.preZone ?? []), ...constellation.zones];
  for (const zone of allZones) {
    sections.push(`### Zone ${zone.zone} · ${zone.name}\n\n`);
    sections.push(`**Domain:** ${zone.domain}\n\n`);
    sections.push(`**Status:** ${zone.status}\n\n`);
    if (zone.tagline) sections.push(`**Tagline:** ${zone.tagline}\n\n`);
    if (zone.opening) sections.push(`**Opening:** ${zone.opening}\n\n`);
    if (zone.standby) sections.push(`**Standby:** ${zone.standby}\n\n`);
    if (zone.reflections && zone.reflections.length > 0) {
      sections.push("**Reflections:**\n\n");
      for (const r of zone.reflections) {
        sections.push(`- ${r}\n`);
      }
      sections.push("\n");
    }
    if (zone.workedExamples && zone.workedExamples.length > 0) {
      sections.push("**Worked examples:**\n\n");
      for (const ex of zone.workedExamples) {
        sections.push(`- **${ex.name}** — ${ex.rule}\n`);
      }
      sections.push("\n");
    }
  }

  sections.push("## Teachers\n\n");
  for (const teacher of constellation.teachers) {
    const channel = teacher.channel ? ` · ${teacher.channel}` : "";
    const url = teacher.url ? ` — [link](${teacher.url})` : "";
    sections.push(`- **${teacher.name}**${channel}${url} · *${teacher.tagline}*\n`);
  }
  sections.push("\n---\n\n");

  // ── Standby Checklist ─────────────────────────────────────────────────────
  sections.push("# STANDBY CHECKLIST (ZONE 0 HOUSEHOLD)\n\n");
  sections.push(`*${STANDBY_PRIMITIVE.summary}*\n\n`);
  for (const rung of RUNGS) {
    sections.push(`## Rung: ${rung.name}\n\n`);
    sections.push(`*${rung.meaning}*\n\n`);
    for (const shelf of SUB_SHELVES) {
      const items = ITEMS.filter(
        (it) => it.rung === rung.id && it.subShelf === shelf.id
      );
      if (items.length === 0) continue;
      sections.push(`### ${shelf.name}\n\n`);
      for (const item of items) {
        sections.push(`- **${item.text}**`);
        if (item.detail) sections.push(` — ${item.detail}`);
        sections.push("\n");
      }
      sections.push("\n");
    }
  }
  sections.push("\n---\n\n");

  // ── Narration Scripts ─────────────────────────────────────────────────────
  sections.push("# NARRATION SCRIPTS\n\n");
  for (const slug of NARRATION_SLUGS) {
    const content = narrations[slug] ?? "(not found)";
    sections.push(`## ${slug}\n\n`);
    sections.push(content);
    sections.push("\n\n---\n\n");
  }

  return sections.join("");
}

// ── JSON data builder ───────────────────────────────────────────────────────

function buildJsonData(narrations: Record<string, string>): object {
  return {
    _meta: {
      exportedAt: new Date().toISOString(),
      constellationVersion: constellation.version,
      constellationLastUpdated: constellation.lastUpdated,
      partCount: PARTS.length,
      chapterCount: CHAPTERS.length,
      glossaryEntryCount: GLOSSARY_ENTRIES.length,
      taleCount: TALES.length,
      stackCardCount: STACK_CARDS.length,
      pioneerStationCount: PIONEER_STATIONS.length,
      standbyItemCount: ITEMS.length,
      narrationCount: NARRATION_SLUGS.length,
    },
    PARTS,
    CHAPTERS,
    GLOSSARY_ENTRIES,
    TALES,
    STACK_CARDS,
    PIONEER_PHASES,
    PIONEER_STATIONS,
    FOUNDING_EXAMPLE_COMMENTARY,
    YOUTH_PHASES,
    YOUTH_STATIONS,
    ZONE_AUTHOR_ENTRIES,
    DAILY_DRIVER_SCHEMA: {
      GOAL_KIND_LABELS,
      GOAL_KIND_DESCRIPTIONS,
      HORIZON_LABELS,
      UNIVERSAL_STEPS_BEFORE,
      UNIVERSAL_STEPS_AFTER,
      KIND_STEPS,
    },
    CONSTELLATION: constellation,
    STANDBY: {
      PRIMITIVE: STANDBY_PRIMITIVE,
      RUNGS,
      SUB_SHELVES,
      VOCAB,
      ITEMS,
    },
    NARRATION_SCRIPTS: narrations,
  };
}

// ── Main ────────────────────────────────────────────────────────────────────

function run() {
  mkdirSync(EXPORTS_DIR, { recursive: true });

  const narrations: Record<string, string> = {};
  for (const slug of NARRATION_SLUGS) {
    narrations[slug] = readNarration(slug);
    console.log(`  ✓ narration/${slug}.md read`);
  }

  const markdownContent = buildMarkdown(narrations);
  const mdPath = join(EXPORTS_DIR, "codetry-book-full.md");
  writeFileSync(mdPath, markdownContent, "utf-8");
  const mdKb = Math.round(markdownContent.length / 1024);
  console.log(`✓ exports/codetry-book-full.md written (${mdKb} KB)`);

  const jsonData = buildJsonData(narrations);
  const jsonContent = JSON.stringify(jsonData, null, 2);
  const jsonPath = join(EXPORTS_DIR, "codetry-book-data.json");
  writeFileSync(jsonPath, jsonContent, "utf-8");
  const jsonKb = Math.round(jsonContent.length / 1024);
  console.log(`✓ exports/codetry-book-data.json written (${jsonKb} KB)`);

  console.log(`\nBoth files are at ${EXPORTS_DIR}`);
  console.log("No build step needed — readable and parseable as-is.");
}

run();
