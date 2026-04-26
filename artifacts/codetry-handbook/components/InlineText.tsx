import React, { useMemo } from "react";
import { StyleProp, Text, TextStyle } from "react-native";

type Run = { text: string; italic: boolean };

function parse(text: string): Run[] {
  const out: Run[] = [];
  const re = /\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) {
      out.push({ text: text.slice(last, m.index), italic: false });
    }
    out.push({ text: m[1], italic: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    out.push({ text: text.slice(last), italic: false });
  }
  return out;
}

export function InlineText({
  text,
  style,
  italicStyle,
}: {
  text: string;
  style?: StyleProp<TextStyle>;
  italicStyle?: StyleProp<TextStyle>;
}) {
  const runs = useMemo(() => parse(text), [text]);
  return (
    <Text style={style}>
      {runs.map((r, i) =>
        r.italic ? (
          <Text key={i} style={italicStyle}>
            {r.text}
          </Text>
        ) : (
          <Text key={i}>{r.text}</Text>
        ),
      )}
    </Text>
  );
}
