// Cross-reference validator.
//
// Walks every Block in the handbook chapter list, extracts every inline
// §X.Y reference, and checks each one against the live set of chapter
// ids. The runtime renderer in components/InlineText.tsx degrades a
// dead reference to plain text silently — that silence is what made
// the Part V renumbering risky (Hempcrete and Colophon shifted down
// one, and four §5.4 references had to be updated to §5.5 by hand).
//
// This scan turns that silent failure into a surfacable hit a vitest
// case can fail on, naming the chapter the dead reference lives in
// and the reference itself.

import { CHAPTERS, type Block, type Chapter } from "../../data/handbook";

// Mirrors the regex in components/InlineText.tsx so the validator
// catches exactly the references the renderer would try to resolve.
// Matches both numeric refs (§1.5, §3.2) and back-matter refs with an
// alphabetic prefix (§DD.1, §FL.10).
const REF_RE = /§([A-Za-z0-9]+)\.(\d+)/g;

export type DeadReference = {
  chapterId: string;
  chapterNumber: string;
  chapterTitle: string;
  reference: string;
  targetId: string;
};

function extractBlockStrings(block: Block): string[] {
  switch (block.kind) {
    case "para":
    case "subhead":
    case "small":
    case "pull":
    case "callout":
      return [block.text];
    case "list":
    case "ordered":
      return block.items;
    case "examples":
      // WorkedExample objects carry name + rule. Both are reader-facing
      // and could in principle hold a §X.Y pointer.
      return block.items.flatMap((item) => [item.name, item.rule]);
    case "collapsible":
      return block.blocks.flatMap(extractBlockStrings);
    case "rule":
      return [];
    case "tool":
      return [];
    case "teachers":
      return [];
  }
}

export function extractChapterStrings(chapter: Chapter): string[] {
  return chapter.blocks.flatMap(extractBlockStrings);
}

export function findDeadReferences(
  chapters: readonly Chapter[] = CHAPTERS,
): DeadReference[] {
  // Resolve §X.Y by chapter `number`, not by id. Chapter ids are
  // preserved for bookmark continuity across renumbers, so they may
  // diverge from the user-facing number (e.g., a Constellation
  // chapter with id "3-10" but number "2.10" after the spine
  // renumber). The renderer in InlineText.tsx looks up by number too,
  // so this validator must mirror that.
  const validNumbers = new Map(chapters.map((c) => [c.number, c.id]));
  const dead: DeadReference[] = [];
  for (const chapter of chapters) {
    for (const text of extractChapterStrings(chapter)) {
      REF_RE.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = REF_RE.exec(text))) {
        const targetNumber = `${match[1]}.${match[2]}`;
        if (!validNumbers.has(targetNumber)) {
          dead.push({
            chapterId: chapter.id,
            chapterNumber: chapter.number,
            chapterTitle: chapter.title,
            reference: match[0],
            targetId: targetNumber,
          });
        }
      }
    }
  }
  return dead;
}

export function formatDeadReferences(hits: readonly DeadReference[]): string {
  return hits
    .map(
      (h) =>
        `  - §${h.chapterNumber} (${h.chapterTitle}) [id ${h.chapterId}] points at ${h.reference} → no chapter with number ${h.targetId}`,
    )
    .join("\n");
}
