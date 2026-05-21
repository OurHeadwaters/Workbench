/**
 * FieldNotesPanel — collapsible journal sidebar for mobile.
 *
 * Extracts callout blocks from the current chapter and surfaces them
 * as a "Field Notes" accordion panel.
 *
 * - Narrow screens (< 600px): collapsible accordion at the bottom of scroll
 * - Wide screens (≥ 600px): floats as an inline right panel beside the body
 */
import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  useWindowDimensions,
  View,
} from "react-native";

import type { Block } from "@/data/handbook";
import { J } from "@/theme/journal";

const SERIF_ITALIC = J.font.serifItalic;
const MONO         = J.font.mono;

const SIDEBAR_BREAKPOINT = 600;

interface FieldNote {
  text: string;
}

function extractFieldNotes(blocks: Block[]): FieldNote[] {
  return blocks
    .filter((b) => b.kind === "callout" || b.kind === "pull")
    .map((b) => ({ text: (b as any).text as string }))
    .slice(0, 4);
}

// ── Shared notes list ─────────────────────────────────────────────────────────

function NotesList({ notes, fontScale }: { notes: FieldNote[]; fontScale: number }) {
  return (
    <View style={styles.body}>
      {notes.map((note, i) => (
        <View
          key={i}
          style={[styles.noteRow, i < notes.length - 1 && styles.noteRowBorder]}
        >
          <View style={styles.noteIconWrap}>
            <Ionicons name="leaf-outline" size={12} color={`${J.color.amber}80`} />
          </View>
          <Text
            style={[
              styles.noteText,
              {
                fontFamily: SERIF_ITALIC,
                fontSize: 14 * fontScale,
                lineHeight: 14 * fontScale * 1.7,
              },
            ]}
          >
            {note.text}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ── Panel header ─────────────────────────────────────────────────────────────

function PanelHeader({
  count,
  open,
  onToggle,
  showToggle,
}: {
  count: number;
  open: boolean;
  onToggle: () => void;
  showToggle: boolean;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.headerDot} />
        <Text style={[styles.headerLabel, { fontFamily: MONO }]}>
          FIELD NOTES
        </Text>
        <Text style={[styles.headerCount, { fontFamily: MONO }]}>
          {count}
        </Text>
      </View>
      {showToggle && (
        <Pressable
          onPress={onToggle}
          hitSlop={12}
          accessibilityLabel={open ? "Close Field Notes" : "Open Field Notes"}
        >
          <Animated.View>
            <Ionicons
              name={open ? "chevron-up" : "chevron-down"}
              size={14}
              color={J.color.amber}
            />
          </Animated.View>
        </Pressable>
      )}
    </View>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function FieldNotesPanel({
  blocks,
  fontScale = 1,
}: {
  blocks: Block[];
  fontScale?: number;
}) {
  const notes = extractFieldNotes(blocks);
  const { width } = useWindowDimensions();
  const isSidebar = width >= SIDEBAR_BREAKPOINT;
  const [open, setOpen] = React.useState(false);

  if (notes.length === 0) return null;

  const toggle = () => {
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
    LayoutAnimation.configureNext({
      duration: 240,
      create: { type: "easeInEaseOut", property: "opacity" },
      update: { type: "easeInEaseOut" },
      delete: { type: "easeInEaseOut", property: "opacity" },
    });
    setOpen((v) => !v);
  };

  // ── Sidebar mode (tablet / wide web) ──
  if (isSidebar) {
    return (
      <View style={[styles.container, styles.sidebarContainer]}>
        <PanelHeader count={notes.length} open showToggle={false} onToggle={() => {}} />
        <NotesList notes={notes} fontScale={fontScale} />
      </View>
    );
  }

  // ── Accordion mode (narrow / phone) ──
  return (
    <View style={[styles.container, styles.accordionContainer]}>
      <Pressable
        onPress={toggle}
        style={({ pressed }) => [styles.headerPressable, pressed && { opacity: 0.75 }]}
      >
        <PanelHeader count={notes.length} open={open} showToggle onToggle={toggle} />
      </Pressable>
      {open && <NotesList notes={notes} fontScale={fontScale} />}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: `${J.color.amber}30`,
    borderRadius: J.radius.md,
    overflow: "hidden",
    backgroundColor: `${J.color.amber}06`,
  },
  accordionContainer: {
    marginTop: 32,
    marginBottom: 8,
  },
  sidebarContainer: {
    marginTop: 24,
    marginBottom: 8,
    alignSelf: "flex-end",
    width: "46%",
  },
  headerPressable: {},
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: `${J.color.amber}20`,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: J.color.amber,
  },
  headerLabel: {
    fontSize: 9,
    letterSpacing: 2.2,
    color: J.color.amber,
    textTransform: "uppercase",
  },
  headerCount: {
    fontSize: 9,
    letterSpacing: 1,
    color: `${J.color.amber}60`,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${J.color.amber}30`,
  },
  body: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 6,
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 10,
  },
  noteRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: `${J.color.amber}18`,
  },
  noteIconWrap: {
    marginTop: 3,
    flexShrink: 0,
  },
  noteText: {
    flex: 1,
    color: J.color.evergreen,
  },
});
