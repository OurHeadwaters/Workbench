import React, { useMemo } from "react";
import { StyleProp, Text, TextStyle } from "react-native";

import { CHAPTERS } from "@/data/handbook";

type Run =
  | { kind: "text"; text: string; italic: boolean }
  | { kind: "ref"; text: string; chapterId: string };

const NUMBER_TO_CHAPTER_ID: ReadonlyMap<string, string> = new Map(
  CHAPTERS.map((c) => [c.number, c.id]),
);

// Matches §X.Y where X is one or more letters or digits and Y is one or
// more digits. Covers numeric refs like §1.5 and §3.2 as well as
// back-matter refs like §DD.1, §FL.10. Bare part refs like §5 or §IV
// are intentionally excluded — those are prose, not navigable targets.
const REF_RE = /§([A-Za-z0-9]+)\.(\d+)/g;
const ITALIC_RE = /\*([^*]+)\*/g;

function pushTextWithRefs(out: Run[], plain: string, withRefs: boolean) {
  if (!withRefs) {
    if (plain.length > 0) out.push({ kind: "text", text: plain, italic: false });
    return;
  }
  let last = 0;
  let m: RegExpExecArray | null;
  REF_RE.lastIndex = 0;
  while ((m = REF_RE.exec(plain))) {
    if (m.index > last) {
      out.push({
        kind: "text",
        text: plain.slice(last, m.index),
        italic: false,
      });
    }
    const number = `${m[1]}.${m[2]}`;
    const id = NUMBER_TO_CHAPTER_ID.get(number);
    if (id) {
      out.push({ kind: "ref", text: m[0], chapterId: id });
    } else {
      out.push({ kind: "text", text: m[0], italic: false });
    }
    last = m.index + m[0].length;
  }
  if (last < plain.length) {
    out.push({ kind: "text", text: plain.slice(last), italic: false });
  }
}

function parse(text: string, withRefs: boolean): Run[] {
  const out: Run[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  ITALIC_RE.lastIndex = 0;
  while ((m = ITALIC_RE.exec(text))) {
    if (m.index > last) {
      pushTextWithRefs(out, text.slice(last, m.index), withRefs);
    }
    out.push({ kind: "text", text: m[1], italic: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    pushTextWithRefs(out, text.slice(last), withRefs);
  }
  return out;
}

export function InlineText({
  text,
  style,
  italicStyle,
  onPressRef,
  refStyle,
}: {
  text: string;
  style?: StyleProp<TextStyle>;
  italicStyle?: StyleProp<TextStyle>;
  onPressRef?: (chapterId: string) => void;
  refStyle?: StyleProp<TextStyle>;
}) {
  const withRefs = !!onPressRef;
  const runs = useMemo(() => parse(text, withRefs), [text, withRefs]);
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
