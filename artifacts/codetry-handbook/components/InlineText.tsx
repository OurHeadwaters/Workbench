import React, { useMemo } from "react";
import { StyleProp, Text, TextStyle } from "react-native";

import { CHAPTERS } from "@/data/handbook";

type Run =
  | { kind: "text"; text: string; italic: boolean; bold: boolean }
  | { kind: "ref"; text: string; chapterId: string }
  | { kind: "glossary"; text: string; term: string };

const NUMBER_TO_CHAPTER_ID: ReadonlyMap<string, string> = new Map(
  CHAPTERS.map((c) => [c.number, c.id]),
);

// Matches §X.Y where X is one or more letters or digits and Y is one or
// more digits. Covers numeric refs like §1.5 and §3.2 as well as
// back-matter refs like §DD.1, §FL.10. Bare part refs like §5 or §IV
// are intentionally excluded — those are prose, not navigable targets.
const REF_RE = /§([A-Za-z0-9]+)\.(\d+)/g;

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildGlossaryRe(terms: string[]): RegExp | null {
  if (terms.length === 0) return null;
  // Sort longest-first so multi-word terms match before shorter sub-terms.
  const sorted = [...terms].sort((a, b) => b.length - a.length);
  // Use word boundaries (\b) so partial-word matches are excluded.
  // Terms starting/ending with "The " or punctuation handle the boundary naturally.
  const pattern = sorted.map((t) => `\\b${escapeRegex(t)}\\b`).join("|");
  return new RegExp(`(${pattern})`, "gi");
}

function splitByGlossary(
  text: string,
  re: RegExp,
  termNorm: Map<string, string>,
): Run[] {
  const out: Run[] = [];
  re.lastIndex = 0;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) {
      out.push({ kind: "text", text: text.slice(last, m.index), italic: false, bold: false });
    }
    const matched = m[0];
    const canonical = termNorm.get(matched.toLowerCase()) ?? matched;
    out.push({ kind: "glossary", text: matched, term: canonical });
    last = m.index + matched.length;
  }
  if (last < text.length) {
    out.push({ kind: "text", text: text.slice(last), italic: false, bold: false });
  }
  return out;
}

function pushTextWithRefs(
  out: Run[],
  plain: string,
  withRefs: boolean,
  glossaryRe: RegExp | null,
  termNorm: Map<string, string>,
  bold: boolean,
) {
  if (!withRefs && !glossaryRe) {
    if (plain.length > 0) out.push({ kind: "text", text: plain, italic: false, bold });
    return;
  }

  // Collect ref segments first, then apply glossary to plain segments.
  const intermediate: Run[] = [];

  if (withRefs) {
    let last = 0;
    let m: RegExpExecArray | null;
    REF_RE.lastIndex = 0;
    while ((m = REF_RE.exec(plain))) {
      if (m.index > last) {
        intermediate.push({
          kind: "text",
          text: plain.slice(last, m.index),
          italic: false,
          bold,
        });
      }
      const number = `${m[1]}.${m[2]}`;
      const id = NUMBER_TO_CHAPTER_ID.get(number);
      if (id) {
        intermediate.push({ kind: "ref", text: m[0], chapterId: id });
      } else {
        intermediate.push({ kind: "text", text: m[0], italic: false, bold });
      }
      last = m.index + m[0].length;
    }
    if (last < plain.length) {
      intermediate.push({ kind: "text", text: plain.slice(last), italic: false, bold });
    }
  } else {
    if (plain.length > 0)
      intermediate.push({ kind: "text", text: plain, italic: false, bold });
  }

  // Now apply glossary splitting to plain text runs only.
  for (const run of intermediate) {
    if (run.kind === "text" && !run.italic && !run.bold && glossaryRe) {
      const sub = splitByGlossary(run.text, glossaryRe, termNorm);
      for (const s of sub) out.push(s);
    } else {
      out.push(run);
    }
  }
}

function parse(
  text: string,
  withRefs: boolean,
  glossaryRe: RegExp | null,
  termNorm: Map<string, string>,
): Run[] {
  // Build a combined regex that matches **bold** before *italic* so that
  // double-asterisk markers are never consumed as two single-asterisk italics.
  const COMBINED_RE = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  const out: Run[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  COMBINED_RE.lastIndex = 0;
  while ((m = COMBINED_RE.exec(text))) {
    if (m.index > last) {
      pushTextWithRefs(out, text.slice(last, m.index), withRefs, glossaryRe, termNorm, false);
    }
    if (m[1] !== undefined) {
      // **bold** match
      out.push({ kind: "text", text: m[1], italic: false, bold: true });
    } else {
      // *italic* match
      out.push({ kind: "text", text: m[2], italic: true, bold: false });
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    pushTextWithRefs(out, text.slice(last), withRefs, glossaryRe, termNorm, false);
  }
  return out;
}

export function InlineText({
  text,
  style,
  italicStyle,
  boldStyle,
  onPressRef,
  refStyle,
  glossaryTerms,
  onPressGlossaryTerm,
  glossaryTermStyle,
}: {
  text: string;
  style?: StyleProp<TextStyle>;
  italicStyle?: StyleProp<TextStyle>;
  boldStyle?: StyleProp<TextStyle>;
  onPressRef?: (chapterId: string) => void;
  refStyle?: StyleProp<TextStyle>;
  glossaryTerms?: string[];
  onPressGlossaryTerm?: (term: string) => void;
  glossaryTermStyle?: StyleProp<TextStyle>;
}) {
  const withRefs = !!onPressRef;

  const { glossaryRe, termNorm } = useMemo(() => {
    if (!glossaryTerms || glossaryTerms.length === 0 || !onPressGlossaryTerm) {
      return { glossaryRe: null, termNorm: new Map<string, string>() };
    }
    const re = buildGlossaryRe(glossaryTerms);
    const norm = new Map<string, string>();
    for (const t of glossaryTerms) norm.set(t.toLowerCase(), t);
    return { glossaryRe: re, termNorm: norm };
  }, [glossaryTerms, onPressGlossaryTerm]);

  const runs = useMemo(
    () => parse(text, withRefs, glossaryRe, termNorm),
    [text, withRefs, glossaryRe, termNorm],
  );

  return (
    <Text style={style}>
      {runs.map((r, i) => {
        if (r.kind === "ref") {
          return (
            <Text
              key={i}
              style={refStyle}
              onPress={() => onPressRef?.(r.chapterId)}
              accessibilityRole="link"
              accessibilityLabel={`Section ${r.text.slice(1)}`}
              suppressHighlighting
            >
              {r.text}
            </Text>
          );
        }
        if (r.kind === "glossary") {
          return (
            <Text
              key={i}
              style={glossaryTermStyle}
              onPress={() => onPressGlossaryTerm?.(r.term)}
              accessibilityRole="link"
              accessibilityLabel={`Glossary: ${r.term}`}
              suppressHighlighting
            >
              {r.text}
            </Text>
          );
        }
        if (r.bold) {
          return (
            <Text key={i} style={[{ fontWeight: "600" }, boldStyle]}>
              {r.text}
            </Text>
          );
        }
        if (r.italic) {
          return (
            <Text key={i} style={italicStyle}>
              {r.text}
            </Text>
          );
        }
        return <Text key={i}>{r.text}</Text>;
      })}
    </Text>
  );
}
