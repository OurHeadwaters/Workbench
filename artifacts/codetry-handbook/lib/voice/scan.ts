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
// Why an AST scan instead of importing the data structures and walking
// them at runtime: the Part III founding-piece chapters in handbook.ts
// pull text from the constellation manifest (p.summary, p.hostZoneRationale,
// p.vocabulary, etc.) at module load time. The constellation manifest is
// out-of-scope for this check — it is the canonical home of the
// vocabulary terms we are flagging in handbook prose. Scanning the
// source files literally lets us audit only the strings actually written
// in handbook.ts and foundingExamples.ts.
//
// Object literals whose `kind` property is `"examples"` (i.e. WorkedExample
// blocks) are skipped wholesale. WorkedExample copy is the canonical
// place where the discipline's own technical vocabulary is allowed to
// appear in prose form.

import * as fs from "node:fs";
import * as path from "node:path";
import * as ts from "typescript";

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

// Hard cap on a single sentence. Current prose maxes out around 103
// words (a handful of explicit (1)/(2)/(3) enumerated structures), so
// 110 leaves a few words of headroom while still catching obviously
// over-long sentences that would drag the reading level back up.
export const MAX_SENTENCE_WORDS = 110;

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
