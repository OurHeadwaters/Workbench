import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import {
  GLOSSARY_ENTRIES,
  SECTION_LABELS,
  SECTION_ORDER,
  type GlossaryEntry,
  type GlossarySection,
} from "@/data/glossary";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useReader } from "@/contexts/ReaderState";

const SERIF = "Lora_400Regular";
const SERIF_ITALIC = "Lora_400Regular_Italic";
const SERIF_BOLD = "Lora_700Bold";
const MONO = "JetBrainsMono_500Medium";

function normalize(s: string) {
  return s.toLowerCase().replace(/['']/g, "'");
}

function EntryCard({
  entry,
  bookmarked,
  onToggleBookmark,
}: {
  entry: GlossaryEntry;
  bookmarked: boolean;
  onToggleBookmark: (term: string) => void;
}) {
  const c = useColors();

  const badgeColor =
    entry.section === "formal"
      ? c.primary
      : entry.section === "appendix"
        ? c.mutedForeground
        : "#c2410c";

  const badgeBg =
    entry.section === "formal"
      ? `${c.primary}18`
      : entry.section === "appendix"
        ? `${c.mutedForeground}18`
        : "rgba(194,65,12,0.10)";

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: c.chromeBorder,
          backgroundColor: c.card,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text
          style={[styles.cardTerm, { color: c.foreground, fontFamily: SERIF_BOLD }]}
        >
          {entry.term}
        </Text>
        <View style={styles.cardHeaderRight}>
          <View style={[styles.badge, { backgroundColor: badgeBg }]}>
            <Text
              style={[styles.badgeText, { color: badgeColor, fontFamily: MONO }]}
            >
              {entry.chapter}
            </Text>
          </View>
          <Pressable
            onPress={() => onToggleBookmark(entry.term)}
            hitSlop={10}
            style={styles.cardBookmarkBtn}
            accessibilityLabel={bookmarked ? "Remove from My Terms" : "Save to My Terms"}
          >
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={16}
              color={bookmarked ? c.primary : c.mutedForeground}
            />
          </Pressable>
        </View>
      </View>
      {entry.group ? (
        <Text
          style={[
            styles.cardGroup,
            { color: c.mutedForeground, fontFamily: MONO },
          ]}
        >
          {entry.group} sub-term
        </Text>
      ) : null}
      {entry.section === "flagged" ? (
        <View style={[styles.flagBanner, { backgroundColor: "rgba(194,65,12,0.07)" }]}>
          <Text
            style={[
              styles.flagLabel,
              { color: "#c2410c", fontFamily: MONO },
            ]}
          >
            Pending definition — founder decision required
          </Text>
        </View>
      ) : null}
      <Text
        style={[
          styles.cardDef,
          { color: c.foreground, fontFamily: SERIF_ITALIC },
        ]}
      >
        {entry.definition}
      </Text>
    </View>
  );
}

function SectionHeader({
  section,
  count,
}: {
  section: GlossarySection;
  count: number;
}) {
  const c = useColors();
  return (
    <View style={styles.sectionHeader}>
      <Text
        style={[
          styles.sectionLabel,
          { color: c.mutedForeground, fontFamily: MONO },
        ]}
      >
        {SECTION_LABELS[section]}
      </Text>
      <Text
        style={[
          styles.sectionCount,
          { color: c.mutedForeground, fontFamily: MONO },
        ]}
      >
        {count}
      </Text>
    </View>
  );
}

type FilterTab = "all" | "mine";

export default function Glossary() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ q?: string }>();
  const paramQ = typeof params.q === "string" ? params.q : "";
  const [query, setQuery] = useState(paramQ);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const { glossaryTerms, toggleGlossaryTerm, isGlossaryTermBookmarked } = useReader();

  useEffect(() => {
    setQuery(paramQ);
  }, [paramQ]);

  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const baseEntries = useMemo(() => {
    if (activeTab === "mine") {
      return GLOSSARY_ENTRIES.filter((e) =>
        glossaryTerms.includes(normalize(e.term)),
      );
    }
    return GLOSSARY_ENTRIES;
  }, [activeTab, glossaryTerms]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return baseEntries;
    return baseEntries.filter(
      (e) =>
        normalize(e.term).includes(q) ||
        normalize(e.definition).includes(q) ||
        normalize(e.chapter).includes(q) ||
        (e.group ? normalize(e.group).includes(q) : false),
    );
  }, [query, baseEntries]);

  const grouped = useMemo(() => {
    const map = new Map<GlossarySection, GlossaryEntry[]>();
    for (const sec of SECTION_ORDER) {
      const entries = filtered
        .filter((e) => e.section === sec)
        .sort((a, b) => a.term.localeCompare(b.term));
      if (entries.length > 0) map.set(sec, entries);
    }
    return map;
  }, [filtered]);

  const totalShown = filtered.length;
  const myTermsCount = glossaryTerms.length;

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, webTop) + 8,
            borderBottomColor: c.chromeBorder,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.iconBtn}
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={22} color={c.foreground} />
        </Pressable>
        <Text
          style={{
            color: c.mutedForeground,
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            flex: 1,
            textAlign: "center",
          }}
        >
          Glossary
        </Text>
        <Pressable
          onPress={() => router.replace("/")}
          hitSlop={12}
          style={styles.iconBtn}
          accessibilityLabel="Home"
        >
          <Ionicons name="home-outline" size={20} color={c.foreground} />
        </Pressable>
      </View>

      <View style={[styles.tabRow, { borderBottomColor: c.chromeBorder }]}>
        <Pressable
          onPress={() => setActiveTab("all")}
          style={[
            styles.tab,
            activeTab === "all" && { borderBottomColor: c.primary, borderBottomWidth: 2 },
          ]}
          accessibilityLabel="All terms"
        >
          <Text
            style={[
              styles.tabText,
              {
                fontFamily: MONO,
                color: activeTab === "all" ? c.primary : c.mutedForeground,
              },
            ]}
          >
            All
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("mine")}
          style={[
            styles.tab,
            activeTab === "mine" && { borderBottomColor: c.primary, borderBottomWidth: 2 },
          ]}
          accessibilityLabel="My bookmarked terms"
        >
          <View style={styles.tabInner}>
            <Ionicons
              name="bookmark"
              size={12}
              color={activeTab === "mine" ? c.primary : c.mutedForeground}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.tabText,
                {
                  fontFamily: MONO,
                  color: activeTab === "mine" ? c.primary : c.mutedForeground,
                },
              ]}
            >
              My terms
            </Text>
            {myTermsCount > 0 ? (
              <View
                style={[
                  styles.tabBadge,
                  {
                    backgroundColor:
                      activeTab === "mine" ? c.primary : c.mutedForeground,
                  },
                ]}
              >
                <Text style={[styles.tabBadgeText, { fontFamily: MONO }]}>
                  {myTermsCount}
                </Text>
              </View>
            ) : null}
          </View>
        </Pressable>
      </View>

      <View
        style={[
          styles.searchRow,
          { borderBottomColor: c.chromeBorder },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={16}
          color={c.mutedForeground}
          style={{ marginRight: 8 }}
        />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search terms or definitions…"
          placeholderTextColor={c.mutedForeground}
          style={[
            styles.searchInput,
            { color: c.foreground, fontFamily: SERIF },
          ]}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          returnKeyType="search"
        />
        {query.length > 0 ? (
          <Pressable
            onPress={() => setQuery("")}
            hitSlop={10}
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={16} color={c.mutedForeground} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingBottom: Math.max(insets.bottom, webBottom) + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === "mine" && myTermsCount === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="bookmark-outline" size={36} color={c.mutedForeground} style={{ marginBottom: 12 }} />
            <Text
              style={[
                styles.emptyTitle,
                { color: c.foreground, fontFamily: SERIF_BOLD },
              ]}
            >
              No saved terms yet.
            </Text>
            <Text
              style={[
                styles.emptyText,
                { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
              ]}
            >
              Tap the bookmark icon on any term — in the glossary or when reading — to save it here for review.
            </Text>
          </View>
        ) : totalShown === 0 ? (
          <View style={styles.empty}>
            <Text
              style={[
                styles.emptyTitle,
                { color: c.foreground, fontFamily: SERIF_BOLD },
              ]}
            >
              No terms found.
            </Text>
            <Text
              style={[
                styles.emptyText,
                { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
              ]}
            >
              Try a different word or clear the search.
            </Text>
          </View>
        ) : (
          <>
            {query.trim() === "" && activeTab === "all" && (
              <Text
                style={[
                  styles.introText,
                  { color: c.mutedForeground, fontFamily: SERIF_ITALIC },
                ]}
              >
                {`${GLOSSARY_ENTRIES.length} entries · Ch1–Ch5 and Appendix · Formally defined terms are drawn from Ch4. Flagged terms appear in the text but await a founder decision on whether to formalize them.`}
              </Text>
            )}
            {query.trim() !== "" && (
              <Text
                style={[
                  styles.resultCount,
                  { color: c.mutedForeground, fontFamily: MONO },
                ]}
              >
                {totalShown} result{totalShown !== 1 ? "s" : ""}
              </Text>
            )}

            {Array.from(grouped.entries()).map(([section, entries]) => (
              <View key={section}>
                <SectionHeader section={section} count={entries.length} />
                {entries.map((entry) => (
                  <EntryCard
                    key={entry.term}
                    entry={entry}
                    bookmarked={isGlossaryTermBookmarked(entry.term)}
                    onToggleBookmark={toggleGlossaryTerm}
                  />
                ))}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: {
    minWidth: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 10,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabText: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  tabBadge: {
    marginLeft: 5,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    color: "#fff",
    fontSize: 9,
    letterSpacing: 0.5,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  introText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  resultCount: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  sectionCount: {
    fontSize: 10,
    letterSpacing: 1,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 6,
  },
  cardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
    marginTop: 2,
  },
  cardTerm: {
    fontSize: 17,
    lineHeight: 22,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 10,
    letterSpacing: 0.8,
  },
  cardGroup: {
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  flagBanner: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    marginBottom: 8,
  },
  flagLabel: {
    fontSize: 10,
    letterSpacing: 0.8,
  },
  cardDef: {
    fontSize: 15,
    lineHeight: 24,
  },
  cardBookmarkBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    paddingTop: 60,
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 20,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});
