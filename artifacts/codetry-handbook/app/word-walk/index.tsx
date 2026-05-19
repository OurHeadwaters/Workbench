// Word Walk — hub screen.
//
// Shows today's progress and an overall breakdown (approved / rejected /
// deferred / remaining). Lets the founder start today's word session or,
// once all rows have a decision, shows the completion view.

import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useWordWalk } from "@/hooks/useWordWalk";

const SERIF = "Fraunces_400Regular";
const SERIF_ITALIC = "Fraunces_400Regular_Italic";
const SERIF_BOLD = "Fraunces_700Bold";
const MONO = "JetBrainsMono_500Medium";

export default function WordWalkHub() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const {
    ready,
    rows,
    todayQueue,
    todayDecided,
    allDone,
    counts,
    error,
    retry,
  } = useWordWalk();

  const totalRows = rows.length;
  const totalDecided = counts.approved + counts.rejected + counts.deferred + counts.applied;
  const todayDoneCount = todayDecided.length;
  const todayTarget = Math.min(5, todayQueue.length + todayDecided.length);

  const approvedTerms = rows
    .filter((r) => r.status === "approved")
    .map((r) => r.term.replace(/\*\*/g, "").replace(/`/g, ""));

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: Math.max(insets.top, webTop) + 24,
            paddingBottom: Math.max(insets.bottom, webBottom) + 48,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.replace("/")}
          accessibilityLabel="Home"
          style={styles.backRow}
        >
          <Text style={[styles.backLink, { color: c.mutedForeground, fontFamily: MONO }]}>
            ← Home
          </Text>
        </Pressable>

        <Text style={[styles.eyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
          COMPANION TOOL
        </Text>
        <Text style={[styles.title, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          Word Walk
        </Text>
        <Text style={[styles.subtitle, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
          Five codetry words a day, one choice at a time.
        </Text>

        <View style={[styles.rule, { backgroundColor: c.rule }]} />

        {!ready ? (
          <Text style={[styles.loading, { color: c.mutedForeground, fontFamily: MONO }]}>
            Loading…
          </Text>
        ) : error ? (
          <View style={[styles.errorBox, { borderColor: c.rule }]}>
            <Text style={[styles.errorText, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
              {error}
            </Text>
            <Pressable
              onPress={retry}
              style={({ pressed }) => [
                styles.retryBtn,
                { borderColor: c.foreground, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.retryBtnText, { color: c.foreground, fontFamily: MONO }]}>
                Try again →
              </Text>
            </Pressable>
          </View>
        ) : allDone ? (
          <CompletionView
            c={c}
            counts={counts}
            approvedTerms={approvedTerms}
            totalRows={totalRows}
          />
        ) : (
          <>
            {/* Progress strip */}
            <View style={[styles.progressCard, { backgroundColor: c.card, borderColor: c.rule }]}>
              <View style={styles.progressRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.progressLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                    TODAY
                  </Text>
                  <Text style={[styles.progressNum, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
                    {todayDoneCount} of {todayTarget}
                  </Text>
                </View>
                <View style={[styles.divider, { backgroundColor: c.rule }]} />
                <View style={{ flex: 1, paddingLeft: 16 }}>
                  <Text style={[styles.progressLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                    TOTAL
                  </Text>
                  <Text style={[styles.progressNum, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
                    {totalDecided} of {totalRows}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ height: 20 }} />

            {/* Breakdown */}
            <Text style={[styles.sectionLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
              BREAKDOWN
            </Text>
            <View style={[styles.breakdownCard, { borderColor: c.rule }]}>
              {[
                { label: "Approved", count: counts.approved, color: "#166534" },
                { label: "Rejected", count: counts.rejected, color: "#7f1d1d" },
                { label: "Deferred", count: counts.deferred, color: "#1e3a5f" },
                { label: "Remaining", count: counts.proposed, color: c.mutedForeground },
              ].map((item, i, arr) => (
                <View
                  key={item.label}
                  style={[
                    styles.breakdownRow,
                    i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: c.rule },
                  ]}
                >
                  <Text style={[styles.breakdownLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.breakdownCount, { color: item.color, fontFamily: SERIF_BOLD }]}>
                    {item.count}
                  </Text>
                </View>
              ))}
            </View>

            <View style={{ height: 28 }} />

            {todayQueue.length > 0 ? (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/word-walk/card",
                    params: { rowId: String(todayQueue[0].id) },
                  })
                }
                style={({ pressed }) => [
                  styles.startBtn,
                  { backgroundColor: c.primary, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Text style={[styles.startBtnText, { color: c.primaryForeground, fontFamily: MONO }]}>
                  {todayDoneCount === 0 ? "Start today's words →" : "Continue today's words →"}
                </Text>
              </Pressable>
            ) : (
              <View style={[styles.doneForDay, { borderColor: c.rule }]}>
                <Text style={[styles.doneForDayText, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
                  Today's words are done. Come back tomorrow for the next five — or keep going if you're on a roll.
                </Text>
                {counts.proposed > 0 && (
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/word-walk/card",
                        params: { rowId: String(rows.find((r) => r.status === "proposed")?.id ?? "") },
                      })
                    }
                    style={({ pressed }) => [
                      styles.keepGoingBtn,
                      { borderColor: c.foreground, opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <Text style={[styles.keepGoingBtnText, { color: c.foreground, fontFamily: MONO }]}>
                      Keep going →
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function CompletionView({
  c,
  counts,
  approvedTerms,
  totalRows,
}: {
  c: ReturnType<typeof useColors>;
  counts: { approved: number; rejected: number; deferred: number; applied: number; proposed: number };
  approvedTerms: string[];
  totalRows: number;
}) {
  return (
    <View>
      <Text style={[styles.completionTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
        All {totalRows} words walked.
      </Text>
      <Text style={[styles.completionBody, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
        Every row has a decision. Hand the approved list to the implementation pass.
      </Text>

      <View style={[styles.breakdownCard, { borderColor: c.rule, marginTop: 20 }]}>
        {[
          { label: "Approved", count: counts.approved, color: "#166534" },
          { label: "Rejected", count: counts.rejected, color: "#7f1d1d" },
          { label: "Deferred", count: counts.deferred, color: "#1e3a5f" },
          { label: "Applied", count: counts.applied, color: c.mutedForeground },
        ].map((item, i, arr) => (
          <View
            key={item.label}
            style={[
              styles.breakdownRow,
              i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: c.rule },
            ]}
          >
            <Text style={[styles.breakdownLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
              {item.label}
            </Text>
            <Text style={[styles.breakdownCount, { color: item.color, fontFamily: SERIF_BOLD }]}>
              {item.count}
            </Text>
          </View>
        ))}
      </View>

      {approvedTerms.length > 0 && (
        <>
          <View style={{ height: 24 }} />
          <Text style={[styles.sectionLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
            APPROVED TERMS
          </Text>
          <View style={[styles.approvedBlock, { backgroundColor: c.card, borderColor: c.rule }]}>
            <Text
              selectable
              style={[styles.approvedText, { color: c.foreground, fontFamily: MONO }]}
            >
              {approvedTerms.join("\n")}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    paddingHorizontal: 24,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },
  backRow: { marginBottom: 20 },
  backLink: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: { fontSize: 42, lineHeight: 48, letterSpacing: -0.5 },
  subtitle: { fontSize: 17, lineHeight: 26, marginTop: 6 },
  rule: { height: 1, marginVertical: 24, opacity: 0.7 },
  loading: { fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase" },
  errorBox: { borderWidth: 1, borderRadius: 4, padding: 16 },
  errorText: { fontSize: 15, lineHeight: 22, marginBottom: 16 },
  retryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  retryBtnText: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  progressCard: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  progressRow: { flexDirection: "row", alignItems: "center" },
  progressLabel: {
    fontSize: 9,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  progressNum: { fontSize: 28, lineHeight: 32 },
  divider: { width: 1, height: 40 },
  sectionLabel: {
    fontSize: 9,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  breakdownCard: { borderWidth: 1, borderRadius: 4, overflow: "hidden" },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  breakdownLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  breakdownCount: { fontSize: 20, lineHeight: 24 },
  startBtn: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: "center",
  },
  startBtnText: {
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  doneForDay: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 20,
  },
  doneForDayText: { fontSize: 16, lineHeight: 24 },
  keepGoingBtn: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
  },
  keepGoingBtnText: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  completionTitle: { fontSize: 30, lineHeight: 36 },
  completionBody: { fontSize: 16, lineHeight: 24, marginTop: 10 },
  approvedBlock: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
  },
  approvedText: { fontSize: 12, lineHeight: 20 },
});
