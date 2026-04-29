// Grade-9 voice scanner.
//
// Walks the abstract syntax tree of the two body-copy source files
// (data/handbook.ts and data/foundingExamples.ts) and pulls out every
// hand-authored body-copy string, so a vitest check can flag two kinds
// of regression:
//
//   1. banned academic vocabulary that crept back into prose
//   2. sentences that grew past a hard word-count cap
//
// The AST scan covers the two hand-authored body-copy files literally.
// A separate runtime walk covers the bundled constellation manifest
// (data/constellation.ts), because the Part III founding-piece chapters
// pull reader-facing strings (summary, hostZoneRationale, vocabulary
// roles, etc.) out of that manifest at module load time. Both passes
// share the same banned-vocabulary and sentence-length rules, but the
// manifest pass carves out the fields that are *names of technical
// terms themselves* (vocabulary[].term, sub-shelf names, rejected-name
// names, primitive/zone names) — those fields are the canonical home
// of the discipline's vocabulary and are exempt by design.
//
// Object literals whose `kind` property is `"examples"` (i.e. WorkedExample
// blocks) are skipped wholesale by the AST pass. WorkedExample copy is
// the canonical place where the discipline's own technical vocabulary
// is allowed to appear in prose form. The runtime manifest pass treats
// zone[].workedExamples the same way (the field is not extracted).

import * as fs from "node:fs";
import * as path from "node:path";
import * as ts from "typescript";

import {
  constellation,
  type ConstellationWidePrimitive,
  type ConstellationZone,
} from "../../data/constellation";

export const HANDBOOK_SOURCE_FILES = [
  path.resolve(import.meta.dirname, "..", "..", "data", "handbook.ts"),
  path.resolve(import.meta.dirname, "..", "..", "data", "foundingExamples.ts"),
];

// Property names that hold body-copy strings on a Block-shaped object
// literal. `text` covers para/subhead/small/pull/callout. `pull` and
// `closingPara` are the FoundingExampleCommentary takeaway fields.
const STRING_PROPERTY_NAMES = new Set(["text", "pull", "closingPara"]);

// Property names that hold arrays of body-copy strings on a Block-shaped
// object literal. `items` covers list/ordered. `crossZoneReads` and
// `openQuestions` are the FoundingExampleCommentary string-array fields.
const STRING_ARRAY_PROPERTY_NAMES = new Set([
  "items",
  "crossZoneReads",
  "openQuestions",
]);

// Banned academic vocabulary. These are the terms task #504 retired from
// chapter prose. They remain valid inside the constellation manifest and
// inside `kind:"examples"` worked-example blocks (where the discipline's
// own technical vocabulary is allowed to appear), but must not creep
// back into hand-authored chapter or commentary prose.
export const BANNED_TERMS = [
  "substrate",
  "tokenize",
  "reify",
  "vernacular",
  "primitive",
  "membrane",
  "load-bearing",
  "cross-zone",
] as const;

// Hard cap on a single sentence. Task #508 lowered this from 110 to
// 50 by rewriting the longest sentences in handbook.ts. Task #511
// then rewrote the remaining 41-49-word sentences in handbook.ts and
// foundingExamples.ts so the cap could drop again — to 40, which is
// closer to a true short-sentence grade-9 ceiling. Current prose
// maxes out at 40 words.
export const MAX_SENTENCE_WORDS = 40;

export type BodyCopyString = {
  file: string;
  line: number;
  text: string;
};

export type BannedHit = {
  file: string;
  line: number;
  term: string;
  preview: string;
};

export type LongSentenceHit = {
  file: string;
  line: number;
  words: number;
  preview: string;
};

function getStringLiteralValue(node: ts.Node): string | null {
  if (
    ts.isStringLiteral(node) ||
    ts.isNoSubstitutionTemplateLiteral(node)
  ) {
    return node.text;
  }
  return null;
}

function isExamplesObjectLiteral(
  node: ts.ObjectLiteralExpression,
): boolean {
  for (const prop of node.properties) {
    if (
      ts.isPropertyAssignment(prop) &&
      ts.isIdentifier(prop.name) &&
      prop.name.text === "kind"
    ) {
      if (getStringLiteralValue(prop.initializer) === "examples") {
        return true;
      }
    }
  }
  return false;
}

export function extractBodyCopyStrings(file: string): BodyCopyString[] {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const out: BodyCopyString[] = [];
  const fileLabel = path.relative(
    path.resolve(import.meta.dirname, "..", ".."),
    file,
  );

  function visit(node: ts.Node): void {
    if (
      ts.isObjectLiteralExpression(node) &&
      isExamplesObjectLiteral(node)
    ) {
      // Skip the entire WorkedExample object subtree — its prose is
      // exempt from the grade-9 voice check by design.
      return;
    }

    if (
      ts.isPropertyAssignment(node) &&
      ts.isIdentifier(node.name)
    ) {
      const propName = node.name.text;
      if (STRING_PROPERTY_NAMES.has(propName)) {
        const value = getStringLiteralValue(node.initializer);
        if (value !== null) {
          const line =
            source.getLineAndCharacterOfPosition(node.getStart(source))
              .line + 1;
          out.push({ file: fileLabel, line, text: value });
        }
      } else if (
        STRING_ARRAY_PROPERTY_NAMES.has(propName) &&
        ts.isArrayLiteralExpression(node.initializer)
      ) {
        for (const el of node.initializer.elements) {
          const value = getStringLiteralValue(el);
          if (value !== null) {
            const line =
              source.getLineAndCharacterOfPosition(el.getStart(source))
                .line + 1;
            out.push({ file: fileLabel, line, text: value });
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(source);
  return out;
}

// Strips italic markers (single asterisks) so word counts and term
// matches don't count them as part of the prose.
function normalizeProse(text: string): string {
  return text.replace(/\*([^*]+)\*/g, "$1");
}

function bannedTermRegex(term: string): RegExp {
  // Word boundaries on each side, optional trailing -s for plurals.
  // Hyphens inside the term are escaped; \b on either edge of the
  // hyphenated form correctly anchors at the outer letter boundaries.
  const escaped = term.replace(/-/g, "\\-");
  return new RegExp(`\\b${escaped}s?\\b`, "i");
}

export function findBannedVocabularyHits(
  texts: BodyCopyString[],
): BannedHit[] {
  const hits: BannedHit[] = [];
  const regexes = BANNED_TERMS.map(
    (term) => [term, bannedTermRegex(term)] as const,
  );
  for (const { file, line, text } of texts) {
    const prose = normalizeProse(text);
    for (const [term, re] of regexes) {
      if (re.test(prose)) {
        hits.push({
          file,
          line,
          term,
          preview: prose.slice(0, 160),
        });
      }
    }
  }
  return hits;
}

// Splits a body-copy string into sentences for word-count analysis.
// Treats each ./!/? followed by whitespace as a sentence boundary —
// good enough for the prose style in handbook.ts (declarative chapters,
// no abbreviations like Mr./Dr./e.g. in the corpus we're scanning).
export function splitSentences(text: string): string[] {
  return normalizeProse(text)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function countWords(sentence: string): number {
  return sentence.split(/\s+/).filter(Boolean).length;
}

export function findLongSentences(
  texts: BodyCopyString[],
  maxWords: number = MAX_SENTENCE_WORDS,
): LongSentenceHit[] {
  const hits: LongSentenceHit[] = [];
  for (const { file, line, text } of texts) {
    for (const sentence of splitSentences(text)) {
      const words = countWords(sentence);
      if (words > maxWords) {
        hits.push({
          file,
          line,
          words,
          preview: sentence.slice(0, 200),
        });
      }
    }
  }
  return hits;
}

// ---------------------------------------------------------------------------
// Constellation-manifest pass
// ---------------------------------------------------------------------------
//
// The two AST-scanned files above are hand-authored. The Part III
// founding-piece chapters in handbook.ts pull additional reader-facing
// strings out of the bundled constellation manifest at module load time
// (data/constellation.ts, regenerated from
// artifacts/practitioner-operating-plan/public/constellation.json).
// Those manifest strings end up rendered into chapter prose, so they
// have to obey the same grade-9 voice rules.
//
// Carve-outs — fields NOT scanned, because the technical term itself is
// the point of the field:
//
//   Primitives:
//     - id, kind, hostZone, principle, scope: machine identifiers /
//       structural metadata, never rendered as prose
//     - name: the primitive's own name (e.g. "The Standby")
//     - vocabulary[].term, subShelves[].name, rejectedAlternatives[].name:
//       the registered names themselves
//
//   Zones (and pre-zone entries):
//     - zone, slot, status, url: machine identifiers / structural metadata
//     - name, formerNames[]: the zone's own current and historical names
//     - workedExamples: rendered as kind:"examples" blocks; exempt by the
//       same rule the AST scanner applies in handbook.ts
//     - standby, formerNamesNote: not currently rendered to readers by
//       handbook.ts (kept on the manifest as cross-zone metadata). Add
//       them to the extractor below if a future task surfaces them.
//
// Everything else flows through the handbook as reader-facing prose and
// is scanned.

const CONSTELLATION_FILE_LABEL = "data/constellation.ts";

function pushIfPresent(
  out: BodyCopyString[],
  fileLabel: string,
  value: string | undefined,
): void {
  if (typeof value === "string" && value.length > 0) {
    out.push({ file: fileLabel, line: 0, text: value });
  }
}

export function extractPrimitiveStrings(
  primitive: ConstellationWidePrimitive,
  index: number,
): BodyCopyString[] {
  const out: BodyCopyString[] = [];
  const base = `${CONSTELLATION_FILE_LABEL} (constellationWidePrimitives[${index}] · ${primitive.id})`;
  pushIfPresent(out, `${base}.summary`, primitive.summary);
  pushIfPresent(out, `${base}.hostZoneRationale`, primitive.hostZoneRationale);
  primitive.vocabulary?.forEach((v, i) => {
    pushIfPresent(out, `${base}.vocabulary[${i}].role`, v.role);
  });
  primitive.severityLadder?.forEach((r, i) => {
    pushIfPresent(out, `${base}.severityLadder[${i}].meaning`, r.meaning);
  });
  primitive.subShelves?.forEach((s, i) => {
    pushIfPresent(out, `${base}.subShelves[${i}].role`, s.role);
  });
  primitive.rejectedAlternatives?.forEach((r, i) => {
    pushIfPresent(out, `${base}.rejectedAlternatives[${i}].reason`, r.reason);
  });
  return out;
}

export function extractZoneStrings(
  zone: ConstellationZone,
  index: number,
  bucket: "zones" | "preZone",
): BodyCopyString[] {
  const out: BodyCopyString[] = [];
  const label =
    zone.zone < 0 ? `pre-zone ${zone.zone}` : `zone ${zone.zone}${zone.slot ? ` · ${zone.slot}` : ""}`;
  const base = `${CONSTELLATION_FILE_LABEL} (${bucket}[${index}] · ${label} · ${zone.name})`;
  pushIfPresent(out, `${base}.domain`, zone.domain);
  pushIfPresent(out, `${base}.tagline`, zone.tagline);
  pushIfPresent(out, `${base}.context`, zone.context);
  return out;
}

export function extractConstellationStrings(): BodyCopyString[] {
  const out: BodyCopyString[] = [];
  constellation.constellationWidePrimitives.forEach((p, i) => {
    out.push(...extractPrimitiveStrings(p, i));
  });
  constellation.zones.forEach((z, i) => {
    out.push(...extractZoneStrings(z, i, "zones"));
  });
  constellation.preZone.forEach((z, i) => {
    out.push(...extractZoneStrings(z, i, "preZone"));
  });
  return out;
}
