#!/usr/bin/env node
/**
 * generate-manuscript.mjs
 *
 * GENERATED OUTPUT — do not edit codetry-book/manuscript.md by hand.
 * Edit artifacts/api-server/src/data/handbook/chapters.json instead,
 * then re-run this script (or let the build pipeline do it).
 *
 * Reads: artifacts/api-server/src/data/handbook/chapters.json
 * Writes: codetry-book/manuscript.md
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "..", "..");
const SRC = path.join(ROOT, "artifacts", "api-server", "src", "data", "handbook", "chapters.json");
const OUT = path.join(ROOT, "codetry-book", "manuscript.md");

const data = JSON.parse(fs.readFileSync(SRC, "utf8"));

function renderBlocks(blocks, depth = 0) {
  const lines = [];
  for (const block of blocks) {
    switch (block.kind) {
      case "small":
        lines.push(`*${block.text}*\n`);
        break;

      case "para":
        lines.push(`${block.text}\n`);
        break;

      case "subhead":
        lines.push(`## ${block.text}\n`);
        break;

      case "callout":
        lines.push(`> ${block.text}\n`);
        break;

      case "pull":
        lines.push(`> **${block.text}**\n`);
        break;

      case "rule":
        lines.push(`---\n`);
        break;

      case "list": {
        const items = (block.items ?? []).map((item) => `- ${item}`).join("\n");
        lines.push(items + "\n");
        break;
      }

      case "ordered": {
        const items = (block.items ?? [])
          .map((item, i) => `${i + 1}. ${item}`)
          .join("\n");
        lines.push(items + "\n");
        break;
      }

      case "examples": {
        const items = (block.items ?? [])
          .map((ex) => `- **${ex.name}** — ${ex.rule}`)
          .join("\n");
        lines.push(items + "\n");
        break;
      }

      case "teachers": {
        const items = (block.items ?? [])
          .map((t) => `- [${t.name}](${t.url}) — ${t.role}`)
          .join("\n");
        lines.push(items + "\n");
        break;
      }

      case "tool":
        lines.push(`> **${block.label}** — ${block.hint}\n`);
        break;

      case "collapsible": {
        lines.push(`## ${block.label}\n`);
        if (block.blocks?.length) {
          lines.push(renderBlocks(block.blocks, depth + 1));
        }
        break;
      }

      default: {
        process.stderr.write(
          `generate-manuscript: unknown block kind "${block.kind}" — update renderBlocks() in scripts/generate-manuscript.mjs\n`
        );
        process.exitCode = 1;
        break;
      }
    }
  }
  return lines.join("\n");
}

const sections = [];

for (const part of data.PARTS) {
  for (const chapter of part.chapters) {
    const heading = `# ${chapter.number} · ${chapter.title}`;
    const body = renderBlocks(chapter.blocks);
    sections.push(`${heading}\n\n${body}`);
  }
}

const header = [
  "<!-- GENERATED FILE — do not edit by hand.",
  "     Source of truth: artifacts/api-server/src/data/handbook/chapters.json",
  "     Regenerate by running: node scripts/generate-manuscript.mjs",
  "     This file is overwritten automatically on every dev start and build. -->",
  "",
].join("\n");

const manuscript = header + "\n" + sections.join("\n\n---\n\n") + "\n";

fs.writeFileSync(OUT, manuscript, "utf8");

const chapterCount = sections.length;
const byteCount = Buffer.byteLength(manuscript, "utf8");
console.log(
  `Generated ${chapterCount} chapters → ${path.relative(ROOT, OUT)} (${byteCount.toLocaleString()} bytes)`
);
