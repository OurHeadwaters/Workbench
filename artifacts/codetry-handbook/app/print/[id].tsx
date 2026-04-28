import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { InlineText } from "@/components/InlineText";
import { getChapter, type Block } from "@/data/handbook";

type WebGlobals = { document?: Document; window?: Window };

function webGlobals(): WebGlobals {
  if (typeof globalThis === "undefined") return {};
  return globalThis as unknown as WebGlobals;
}

const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

const PAPER = "#ffffff";
const INK = "#101010";
const MUTED = "#5a5a5a";
const RULE = "#cfcfcf";

const PRINT_CSS = `
@page { size: letter; margin: 0.75in; }
html, body { background: #e8e6e0; }
@media print {
  html, body { background: #ffffff !important; }
  .codetry-print-shell { background: #ffffff !important; padding: 0 !important; box-shadow: none !important; }
  .codetry-print-paper { box-shadow: none !important; margin: 0 !important; padding: 0 !important; max-width: none !important; }
  .codetry-no-print { display: none !important; }
  a { color: inherit !important; text-decoration: none !important; }
}
`;

export default function PrintScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : "";
  const chapter = getChapter(id);

  // On web, inject @page / @media print styles, set the document title
  // (so the print dialog pre-fills a sensible filename), and trigger the
  // browser print dialog automatically once content is on screen.
  useEffect(() => {
    if (Platform.OS !== "web" || !chapter) return;
    const { document: doc, window: win } = webGlobals();
    if (!doc) return;
    const styleEl = doc.createElement("style");
    styleEl.setAttribute("data-codetry-print", "1");
    styleEl.textContent = PRINT_CSS;
    doc.head.appendChild(styleEl);
    const prevTitle = doc.title;
    doc.title = `${chapter.number} ${chapter.title} — Headwaters`;
    let cancelled = false;
    // Suppress auto-print when debugging via ?noprint=1.
    const search =
      typeof win?.location?.search === "string" ? win.location.search : "";
    const skipAuto = /[?&]noprint=1/.test(search);
    const t = window.setTimeout(() => {
      if (cancelled || skipAuto) return;
      try {
        win?.print();
      } catch {}
    }, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      doc.title = prevTitle;
      if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    };
  }, [chapter]);

  const onClose = () => {
    if (Platform.OS === "web") {
      const { window: win } = webGlobals();
      // If we were opened in a new tab we can close ourselves.
      try {
        if (win && win.opener) {
          win.close();
          return;
        }
      } catch {}
    }
    if (router.canGoBack()) router.back();
    else router.replace("/contents");
  };

  const onPrintAgain = () => {
    if (Platform.OS !== "web") return;
    const { window: win } = webGlobals();
    try {
      win?.print();
    } catch {}
  };

  if (!chapter) {
    return (
      <View style={[styles.shell, { backgroundColor: "#e8e6e0" }]}>
        <View style={styles.paper}>
          <Text style={{ fontFamily: SERIF_ITALIC, color: INK, fontSize: 16 }}>
            Chapter not found.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      className="codetry-print-shell"
      style={[styles.shell, { backgroundColor: "#e8e6e0" }]}
    >
      {Platform.OS === "web" ? (
        <View
          className="codetry-no-print"
          style={styles.toolbar}
        >
          <Pressable onPress={onClose} style={styles.toolbarBtn}>
            <Text style={styles.toolbarBtnText}>Close</Text>
          </Pressable>
          <Text style={styles.toolbarLabel}>Print preview</Text>
          <Pressable onPress={onPrintAgain} style={styles.toolbarBtn}>
            <Text style={styles.toolbarBtnText}>Print</Text>
          </Pressable>
        </View>
      ) : null}

      <View
        className="codetry-print-paper"
        style={styles.paper}
      >
        <Text style={[styles.eyebrow, { fontFamily: MONO }]}>
          {chapter.partLabel} · {chapter.number}
        </Text>
        <Text style={[styles.title, { fontFamily: SERIF_BOLD }]}>
          {chapter.title}
        </Text>
        <View style={styles.titleRule} />

        {chapter.blocks.map((b, i) => (
          <PrintBlock key={i} block={b} />
        ))}

        <View style={styles.endRule} />
        <Text style={[styles.colophon, { fontFamily: MONO }]}>
          Headwaters: How a Community Runs Its Own Economy · {chapter.partLabel} · {chapter.number}
        </Text>
      </View>
    </View>
  );
}

function PrintBlock({ block }: { block: Block }) {
  switch (block.kind) {
    case "para":
      return (
        <InlineText
          text={block.text}
          style={[styles.body, { fontFamily: SERIF }]}
          italicStyle={{ fontFamily: SERIF_ITALIC }}
        />
      );
    case "subhead":
      return (
        <InlineText
          text={block.text}
          style={[styles.subhead, { fontFamily: SERIF_BOLD }]}
        />
      );
    case "small":
      return (
        <InlineText
          text={block.text}
          style={[styles.small, { fontFamily: MONO }]}
        />
      );
    case "pull":
      return (
        <View style={styles.pull}>
          <InlineText
            text={block.text}
            style={[styles.pullText, { fontFamily: SERIF_ITALIC }]}
            italicStyle={{ fontFamily: SERIF_ITALIC }}
          />
        </View>
      );
    case "callout":
      return (
        <View style={styles.callout}>
          <InlineText
            text={block.text}
            style={[styles.body, { fontFamily: SERIF }]}
            italicStyle={{ fontFamily: SERIF_ITALIC }}
          />
        </View>
      );
    case "examples":
      return (
        <View style={{ marginVertical: 8 }}>
          {block.items.map((ex, i) => (
            <View key={i} style={styles.exampleItem}>
              <Text style={[styles.exampleName, { fontFamily: MONO }]}>
                {ex.name}
              </Text>
              <InlineText
                text={ex.rule}
                style={[styles.body, { fontFamily: SERIF }]}
                italicStyle={{ fontFamily: SERIF_ITALIC }}
              />
            </View>
          ))}
        </View>
      );
    case "list":
      return (
        <View style={styles.list}>
          {block.items.map((it, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={[styles.bullet, { fontFamily: SERIF }]}>•</Text>
              <InlineText
                text={it}
                style={[styles.body, styles.listText, { fontFamily: SERIF }]}
                italicStyle={{ fontFamily: SERIF_ITALIC }}
              />
            </View>
          ))}
        </View>
      );
    case "ordered":
      return (
        <View style={styles.list}>
          {block.items.map((it, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={[styles.orderedNum, { fontFamily: MONO }]}>
                {i + 1}.
              </Text>
              <InlineText
                text={it}
                style={[styles.body, styles.listText, { fontFamily: SERIF }]}
                italicStyle={{ fontFamily: SERIF_ITALIC }}
              />
            </View>
          ))}
        </View>
      );
    case "rule":
      return <View style={styles.midRule} />;
  }
  return null;
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    minHeight: "100%",
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  toolbar: {
    width: "100%",
    maxWidth: 612,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  toolbarLabel: {
    fontFamily: MONO,
    fontSize: 11,
    letterSpacing: 1.4,
    color: MUTED,
    textTransform: "uppercase",
  },
  toolbarBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: RULE,
    borderRadius: 2,
    backgroundColor: PAPER,
  },
  toolbarBtnText: {
    fontFamily: MONO,
    fontSize: 11,
    letterSpacing: 1.4,
    color: INK,
    textTransform: "uppercase",
  },
  paper: {
    width: "100%",
    maxWidth: 612,
    backgroundColor: PAPER,
    paddingVertical: 56,
    paddingHorizontal: 64,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: MUTED,
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    color: INK,
    letterSpacing: -0.3,
  },
  titleRule: {
    height: 1,
    width: 56,
    backgroundColor: INK,
    opacity: 0.55,
    marginTop: 14,
    marginBottom: 18,
  },
  body: {
    fontSize: 13.5,
    lineHeight: 21,
    color: INK,
    marginVertical: 6,
  },
  subhead: {
    fontSize: 14,
    lineHeight: 20,
    color: INK,
    marginTop: 14,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  small: {
    fontSize: 10.5,
    lineHeight: 16,
    color: MUTED,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginVertical: 6,
  },
  pull: {
    borderLeftWidth: 2,
    borderLeftColor: INK,
    paddingLeft: 14,
    paddingVertical: 8,
    marginVertical: 10,
  },
  pullText: {
    fontSize: 14,
    lineHeight: 22,
    color: INK,
  },
  callout: {
    borderWidth: 1,
    borderColor: RULE,
    padding: 14,
    marginVertical: 10,
  },
  list: { marginVertical: 6 },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 3,
  },
  bullet: {
    width: 16,
    fontSize: 13.5,
    lineHeight: 21,
    color: MUTED,
  },
  orderedNum: {
    width: 22,
    fontSize: 11,
    lineHeight: 21,
    color: MUTED,
  },
  listText: { flex: 1, marginVertical: 0 },
  exampleItem: {
    borderTopWidth: 1,
    borderTopColor: RULE,
    paddingVertical: 10,
  },
  exampleName: {
    fontSize: 10.5,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: INK,
    marginBottom: 3,
  },
  midRule: {
    height: 1,
    backgroundColor: RULE,
    marginVertical: 16,
  },
  endRule: {
    height: 1,
    width: 56,
    backgroundColor: INK,
    opacity: 0.55,
    marginTop: 28,
    marginBottom: 12,
  },
  colophon: {
    fontSize: 9.5,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: MUTED,
  },
});
