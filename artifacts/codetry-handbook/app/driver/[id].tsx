// Driver detail screen.
//
// Four tabs in one screen — no nested routing needed:
//   TODAY     — current action card, log a bump, mark done
//   GOALS     — backwards-mapped milestone tree
//   SCENARIOS — alternative paths, scratch or activate
//   PIVOTAL   — sticky context cards that keep the driver on course
//
// Modals handle new scenarios and new/edit pivotal cards inline.

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Modal,
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
import { useDailyDriver } from "@/lib/dailyDriver/store";
import {
  GOAL_KIND_LABELS,
  HORIZON_LABELS,
  type DriverScenario,
  type PivotalCard,
} from "@/data/dailyDriver";

const SERIF = "Fraunces_400Regular";
const SERIF_ITALIC = "Fraunces_400Regular_Italic";
const SERIF_BOLD = "Fraunces_700Bold";
const MONO = "JetBrainsMono_500Medium";

type Tab = "today" | "goals" | "scenarios" | "pivotal";

const TABS: { id: Tab; label: string }[] = [
  { id: "today",     label: "Today" },
  { id: "goals",     label: "Goals" },
  { id: "scenarios", label: "Scenarios" },
  { id: "pivotal",   label: "Pivotal" },
];

function todayDateStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function DriverDetail() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : "";
  const c = useColors();
  const insets = useSafeAreaInsets();
  const {
    drivers,
    updateDriver,
    deleteDriver,
    setPrimary,
    addScenario,
    activateScenario,
    scratchScenario,
    addPivotalCard,
    updatePivotalCard,
    deletePivotalCard,
    logAction,
  } = useDailyDriver();

  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 34 : 0;
  const pt = Math.max(insets.top, webTop) + 16;
  const pb = Math.max(insets.bottom, webBottom) + 24;

  const driver = drivers.find((d) => d.id === id);

  const [activeTab, setActiveTab] = useState<Tab>("today");

  // Today tab
  const [bumpModalOpen, setBumpModalOpen] = useState(false);
  const [bumpDraft, setBumpDraft] = useState("");
  const [actionEditOpen, setActionEditOpen] = useState(false);
  const [actionDraft, setActionDraft] = useState("");

  // Scenario modal
  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState("");
  const [scenarioHypothesis, setScenarioHypothesis] = useState("");
  const [scenarioDailyAction, setScenarioDailyAction] = useState("");

  // Pivotal modal
  const [pivotalModalOpen, setPivotalModalOpen] = useState(false);
  const [pivotalLabel, setPivotalLabel] = useState("");
  const [pivotalValue, setPivotalValue] = useState("");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const openPivotalEdit = useCallback(
    (card: PivotalCard) => {
      setEditingCardId(card.id);
      setPivotalLabel(card.label);
      setPivotalValue(card.value);
      setPivotalModalOpen(true);
    },
    [],
  );

  const openPivotalNew = useCallback(() => {
    setEditingCardId(null);
    setPivotalLabel("");
    setPivotalValue("");
    setPivotalModalOpen(true);
  }, []);

  const savePivotal = useCallback(() => {
    if (!driver || !pivotalLabel.trim() || !pivotalValue.trim()) return;
    if (editingCardId) {
      updatePivotalCard(driver.id, editingCardId, pivotalValue.trim());
    } else {
      addPivotalCard(driver.id, {
        id: `pivot-${Date.now()}`,
        label: pivotalLabel.trim(),
        value: pivotalValue.trim(),
        updatedAt: Date.now(),
      });
    }
    setPivotalModalOpen(false);
  }, [driver, editingCardId, pivotalLabel, pivotalValue, updatePivotalCard, addPivotalCard]);

  const saveScenario = useCallback(() => {
    if (!driver || !scenarioName.trim() || !scenarioDailyAction.trim()) return;
    addScenario(driver.id, {
      id: `scenario-${Date.now()}`,
      name: scenarioName.trim(),
      hypothesis: scenarioHypothesis.trim(),
      dailyAction: scenarioDailyAction.trim(),
      status: "active",
      createdAt: Date.now(),
    });
    setScenarioModalOpen(false);
    setScenarioName("");
    setScenarioHypothesis("");
    setScenarioDailyAction("");
  }, [driver, scenarioName, scenarioHypothesis, scenarioDailyAction, addScenario]);

  const logBump = useCallback(() => {
    if (!driver || !bumpDraft.trim()) return;
    logAction(driver.id, {
      date: todayDateStr(),
      action: driver.todayAction,
      bump: bumpDraft.trim(),
    });
    setBumpModalOpen(false);
    setBumpDraft("");
  }, [driver, bumpDraft, logAction]);

  const markTodayDone = useCallback(() => {
    if (!driver) return;
    logAction(driver.id, {
      date: todayDateStr(),
      action: driver.todayAction,
    });
    Alert.alert("Logged", "Today's action is on the record. Keep going.");
  }, [driver, logAction]);

  const saveActionEdit = useCallback(() => {
    if (!driver || !actionDraft.trim()) return;
    updateDriver(driver.id, { todayAction: actionDraft.trim() });
    setActionEditOpen(false);
  }, [driver, actionDraft, updateDriver]);

  const handleDelete = useCallback(() => {
    if (!driver) return;
    Alert.alert(
      "Delete driver",
      `Remove "${driver.name}"? This can't be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteDriver(driver.id);
            router.replace("/driver");
          },
        },
      ],
    );
  }, [driver, deleteDriver]);

  if (!driver) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        <View style={[styles.errorPad, { paddingTop: pt + 40 }]}>
          <Text style={[styles.errorTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
            Driver not found.
          </Text>
          <Pressable onPress={() => router.replace("/driver")} style={{ marginTop: 16 }}>
            <Text style={[styles.backLink, { color: c.mutedForeground, fontFamily: MONO }]}>
              ← All drivers
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: pt, paddingHorizontal: 22, borderBottomColor: c.rule }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.replace("/driver")} hitSlop={8}>
            <Text style={[styles.backLink, { color: c.mutedForeground, fontFamily: MONO }]}>
              ← Drivers
            </Text>
          </Pressable>
          <View style={styles.headerActions}>
            {!driver.isPrimary && driver.status === "active" && (
              <Pressable
                onPress={() => setPrimary(driver.id)}
                style={({ pressed }) => [styles.headerBtn, { opacity: pressed ? 0.6 : 1 }]}
              >
                <Text style={[styles.headerBtnLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                  Set primary
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={() =>
                updateDriver(driver.id, {
                  status: driver.status === "active" ? "paused" : "active",
                })
              }
              style={({ pressed }) => [styles.headerBtn, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={[styles.headerBtnLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                {driver.status === "active" ? "Pause" : "Resume"}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [styles.headerBtn, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Ionicons name="trash-outline" size={14} color={c.mutedForeground} />
            </Pressable>
          </View>
        </View>

        <Text style={[styles.kindBadge, { color: c.mutedForeground, fontFamily: MONO }]}>
          {GOAL_KIND_LABELS[driver.kind].toUpperCase()}
          {driver.isPrimary ? "  ·  PRIMARY" : ""}
          {driver.status === "paused" ? "  ·  PAUSED" : ""}
        </Text>
        <Text style={[styles.driverName, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          {driver.name}
        </Text>

        {/* Tab bar */}
        <View style={[styles.tabBar, { borderBottomColor: "transparent" }]}>
          {TABS.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setActiveTab(t.id)}
              style={[
                styles.tabBtn,
                activeTab === t.id && { borderBottomColor: c.foreground, borderBottomWidth: 2 },
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: activeTab === t.id ? c.foreground : c.mutedForeground,
                    fontFamily: activeTab === t.id ? MONO : MONO,
                  },
                ]}
              >
                {t.label.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Tab content */}
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: pb + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "today" && (
          <TodayTab
            driver={driver}
            c={c}
            onEditAction={() => {
              setActionDraft(driver.todayAction);
              setActionEditOpen(true);
            }}
            onLogBump={() => setBumpModalOpen(true)}
            onMarkDone={markTodayDone}
          />
        )}
        {activeTab === "goals" && <GoalsTab driver={driver} c={c} />}
        {activeTab === "scenarios" && (
          <ScenariosTab
            driver={driver}
            c={c}
            onActivate={(sId) => activateScenario(driver.id, sId)}
            onScratch={(sId) => scratchScenario(driver.id, sId)}
            onNew={() => setScenarioModalOpen(true)}
          />
        )}
        {activeTab === "pivotal" && (
          <PivotalTab
            driver={driver}
            c={c}
            onEdit={openPivotalEdit}
            onDelete={(cId) => deletePivotalCard(driver.id, cId)}
            onNew={openPivotalNew}
          />
        )}
      </ScrollView>

      {/* Bump modal */}
      <Modal transparent visible={bumpModalOpen} animationType="slide" onRequestClose={() => setBumpModalOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setBumpModalOpen(false)}>
          <Pressable
            onPress={() => {}}
            style={[styles.modalCard, { backgroundColor: c.background, borderColor: c.foreground }]}
          >
            <Text style={[styles.modalTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
              Log a bump
            </Text>
            <Text style={[styles.modalHint, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
              What happened that the driver didn't expect? This goes in your pivotal record.
            </Text>
            <TextInput
              value={bumpDraft}
              onChangeText={setBumpDraft}
              placeholder="What hit the driver sideways today..."
              placeholderTextColor={c.mutedForeground}
              style={[styles.modalInput, { color: c.foreground, borderColor: c.rule, backgroundColor: c.card, fontFamily: SERIF }]}
              multiline
              numberOfLines={3}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable onPress={() => setBumpModalOpen(false)}>
                <Text style={[styles.modalCancel, { color: c.mutedForeground, fontFamily: MONO }]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={logBump}
                disabled={!bumpDraft.trim()}
                style={({ pressed }) => [
                  styles.modalConfirm,
                  { backgroundColor: bumpDraft.trim() ? c.foreground : c.rule, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={[styles.modalConfirmLabel, { color: bumpDraft.trim() ? c.background : c.mutedForeground, fontFamily: MONO }]}>
                  Log it
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Edit today action modal */}
      <Modal transparent visible={actionEditOpen} animationType="slide" onRequestClose={() => setActionEditOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setActionEditOpen(false)}>
          <Pressable
            onPress={() => {}}
            style={[styles.modalCard, { backgroundColor: c.background, borderColor: c.foreground }]}
          >
            <Text style={[styles.modalTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
              Today's action
            </Text>
            <TextInput
              value={actionDraft}
              onChangeText={setActionDraft}
              placeholder="What's the one thing today..."
              placeholderTextColor={c.mutedForeground}
              style={[styles.modalInput, { color: c.foreground, borderColor: c.rule, backgroundColor: c.card, fontFamily: SERIF }]}
              multiline
              numberOfLines={3}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable onPress={() => setActionEditOpen(false)}>
                <Text style={[styles.modalCancel, { color: c.mutedForeground, fontFamily: MONO }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={saveActionEdit}
                disabled={!actionDraft.trim()}
                style={({ pressed }) => [
                  styles.modalConfirm,
                  { backgroundColor: actionDraft.trim() ? c.foreground : c.rule, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={[styles.modalConfirmLabel, { color: actionDraft.trim() ? c.background : c.mutedForeground, fontFamily: MONO }]}>
                  Save
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* New scenario modal */}
      <Modal transparent visible={scenarioModalOpen} animationType="slide" onRequestClose={() => setScenarioModalOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setScenarioModalOpen(false)}>
          <Pressable
            onPress={() => {}}
            style={[styles.modalCard, { backgroundColor: c.background, borderColor: c.foreground }]}
          >
            <Text style={[styles.modalTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
              New scenario
            </Text>
            <Text style={[styles.modalHint, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
              A scenario is one possible path to the same goal. Play it out, then scratch it or make it active.
            </Text>
            <TextInput
              value={scenarioName}
              onChangeText={setScenarioName}
              placeholder="Name this path (e.g. 'Find a co-founder')"
              placeholderTextColor={c.mutedForeground}
              style={[styles.modalInputSm, { color: c.foreground, borderColor: c.rule, backgroundColor: c.card, fontFamily: SERIF }]}
            />
            <TextInput
              value={scenarioHypothesis}
              onChangeText={setScenarioHypothesis}
              placeholder="If I do X, then Y becomes possible..."
              placeholderTextColor={c.mutedForeground}
              style={[styles.modalInput, { color: c.foreground, borderColor: c.rule, backgroundColor: c.card, fontFamily: SERIF }]}
              multiline
              numberOfLines={2}
            />
            <TextInput
              value={scenarioDailyAction}
              onChangeText={setScenarioDailyAction}
              placeholder="Today's action in this scenario..."
              placeholderTextColor={c.mutedForeground}
              style={[styles.modalInputSm, { color: c.foreground, borderColor: c.rule, backgroundColor: c.card, fontFamily: SERIF }]}
            />
            <View style={styles.modalActions}>
              <Pressable onPress={() => setScenarioModalOpen(false)}>
                <Text style={[styles.modalCancel, { color: c.mutedForeground, fontFamily: MONO }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={saveScenario}
                disabled={!scenarioName.trim() || !scenarioDailyAction.trim()}
                style={({ pressed }) => [
                  styles.modalConfirm,
                  {
                    backgroundColor:
                      scenarioName.trim() && scenarioDailyAction.trim() ? c.foreground : c.rule,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.modalConfirmLabel,
                    {
                      color:
                        scenarioName.trim() && scenarioDailyAction.trim()
                          ? c.background
                          : c.mutedForeground,
                      fontFamily: MONO,
                    },
                  ]}
                >
                  Add scenario
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Pivotal card modal */}
      <Modal transparent visible={pivotalModalOpen} animationType="slide" onRequestClose={() => setPivotalModalOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setPivotalModalOpen(false)}>
          <Pressable
            onPress={() => {}}
            style={[styles.modalCard, { backgroundColor: c.background, borderColor: c.foreground }]}
          >
            <Text style={[styles.modalTitle, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
              {editingCardId ? "Update pivotal info" : "Add pivotal info"}
            </Text>
            <Text style={[styles.modalHint, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
              Pivotal info is context the driver holds even when things change — a runway, a deadline, a risk.
            </Text>
            {!editingCardId && (
              <TextInput
                value={pivotalLabel}
                onChangeText={setPivotalLabel}
                placeholder="Label (e.g. 'My runway', 'Hard deadline')"
                placeholderTextColor={c.mutedForeground}
                style={[styles.modalInputSm, { color: c.foreground, borderColor: c.rule, backgroundColor: c.card, fontFamily: SERIF }]}
              />
            )}
            <TextInput
              value={pivotalValue}
              onChangeText={setPivotalValue}
              placeholder="The actual information..."
              placeholderTextColor={c.mutedForeground}
              style={[styles.modalInput, { color: c.foreground, borderColor: c.rule, backgroundColor: c.card, fontFamily: SERIF }]}
              multiline
              numberOfLines={3}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable onPress={() => setPivotalModalOpen(false)}>
                <Text style={[styles.modalCancel, { color: c.mutedForeground, fontFamily: MONO }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={savePivotal}
                disabled={!pivotalValue.trim() || (!editingCardId && !pivotalLabel.trim())}
                style={({ pressed }) => {
                  const ok =
                    pivotalValue.trim().length > 0 &&
                    (editingCardId !== null || pivotalLabel.trim().length > 0);
                  return [
                    styles.modalConfirm,
                    { backgroundColor: ok ? c.foreground : c.rule, opacity: pressed ? 0.8 : 1 },
                  ];
                }}
              >
                <Text
                  style={[
                    styles.modalConfirmLabel,
                    {
                      color:
                        pivotalValue.trim() && (editingCardId || pivotalLabel.trim())
                          ? c.background
                          : c.mutedForeground,
                      fontFamily: MONO,
                    },
                  ]}
                >
                  Save
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// ── Tab components ─────────────────────────────────────────────────────────

function TodayTab({
  driver,
  c,
  onEditAction,
  onLogBump,
  onMarkDone,
}: {
  driver: ReturnType<typeof useDailyDriver>["drivers"][number];
  c: ReturnType<typeof useColors>;
  onEditAction: () => void;
  onLogBump: () => void;
  onMarkDone: () => void;
}) {
  const todayStr = todayDateStr();
  const todayLog = driver.logs.filter((l) => l.date === todayStr);
  const lastBump = driver.logs.slice().reverse().find((l) => l.bump);

  return (
    <View style={styles.tabContent}>
      <View style={[styles.todayCard, { backgroundColor: c.card, borderColor: c.foreground }]}>
        <Text style={[styles.todayEyebrow, { color: c.mutedForeground, fontFamily: MONO }]}>
          TODAY'S ACTION
        </Text>
        <Text style={[styles.todayAction, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          {driver.todayAction || "No action set yet."}
        </Text>
        <Pressable onPress={onEditAction} style={styles.editActionRow} hitSlop={8}>
          <Text style={[styles.editActionLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
            Edit ↗
          </Text>
        </Pressable>
      </View>

      <View style={styles.actionRow}>
        <Pressable
          onPress={onMarkDone}
          style={({ pressed }) => [
            styles.doneBtn,
            { backgroundColor: c.foreground, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Ionicons name="checkmark" size={14} color={c.background} />
          <Text style={[styles.doneBtnLabel, { color: c.background, fontFamily: MONO }]}>
            Mark done
          </Text>
        </Pressable>
        <Pressable
          onPress={onLogBump}
          style={({ pressed }) => [
            styles.bumpBtn,
            { borderColor: c.rule, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[styles.bumpBtnLabel, { color: c.foreground, fontFamily: MONO }]}>
            Log a bump
          </Text>
        </Pressable>
      </View>

      {todayLog.length > 0 && (
        <>
          <Text style={[styles.tabSection, { color: c.mutedForeground, fontFamily: MONO }]}>
            LOGGED TODAY
          </Text>
          {todayLog.map((l, i) => (
            <View
              key={i}
              style={[styles.logRow, { borderColor: c.rule }]}
            >
              <Text style={[styles.logAction, { color: c.foreground, fontFamily: SERIF }]}>
                {l.action}
              </Text>
              {l.bump && (
                <Text style={[styles.logBump, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
                  Bump: {l.bump}
                </Text>
              )}
            </View>
          ))}
        </>
      )}

      {lastBump && !todayLog.find((l) => l.bump) && (
        <>
          <Text style={[styles.tabSection, { color: c.mutedForeground, fontFamily: MONO }]}>
            LAST BUMP ON RECORD
          </Text>
          <View style={[styles.logRow, { borderColor: c.rule }]}>
            <Text style={[styles.logBump, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
              {lastBump.date} — {lastBump.bump}
            </Text>
          </View>
        </>
      )}

      <View style={{ height: 16 }} />
      <Text style={[styles.dreamLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
        THE DREAM
      </Text>
      <Text style={[styles.dreamText, { color: c.foreground, fontFamily: SERIF_ITALIC }]}>
        {driver.dream}
      </Text>
    </View>
  );
}

function GoalsTab({
  driver,
  c,
}: {
  driver: ReturnType<typeof useDailyDriver>["drivers"][number];
  c: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.tabContent}>
      <Text style={[styles.tabSection, { color: c.mutedForeground, fontFamily: MONO }]}>
        ROADMAP — BACKWARDS FROM DONE
      </Text>
      {driver.goalNodes.length === 0 ? (
        <Text style={[styles.emptyNote, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
          No milestones mapped yet.
        </Text>
      ) : (
        driver.goalNodes.map((node, i) => (
          <View
            key={node.horizon}
            style={[
              styles.nodeCard,
              {
                borderLeftColor: i === 0 ? c.foreground : c.rule,
                backgroundColor: c.card,
              },
            ]}
          >
            <Text style={[styles.nodeHorizon, { color: c.mutedForeground, fontFamily: MONO }]}>
              {HORIZON_LABELS[node.horizon].toUpperCase()}
            </Text>
            <Text style={[styles.nodeText, { color: c.foreground, fontFamily: SERIF }]}>
              {node.text}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

function ScenariosTab({
  driver,
  c,
  onActivate,
  onScratch,
  onNew,
}: {
  driver: ReturnType<typeof useDailyDriver>["drivers"][number];
  c: ReturnType<typeof useColors>;
  onActivate: (id: string) => void;
  onScratch: (id: string) => void;
  onNew: () => void;
}) {
  const active = driver.scenarios.filter((s) => s.status === "active");
  const scratched = driver.scenarios.filter((s) => s.status === "scratched");

  return (
    <View style={styles.tabContent}>
      <Text style={[styles.tabSection, { color: c.mutedForeground, fontFamily: MONO }]}>
        ACTIVE PATH
      </Text>
      {active.length === 0 ? (
        <Text style={[styles.emptyNote, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
          No active scenario. Add one below.
        </Text>
      ) : (
        active.map((s) => (
          <ScenarioCard key={s.id} scenario={s} c={c} onActivate={onActivate} onScratch={onScratch} />
        ))
      )}

      {scratched.length > 0 && (
        <>
          <Text style={[styles.tabSection, { color: c.mutedForeground, fontFamily: MONO, marginTop: 20 }]}>
            SCRATCHED — KEPT FOR REFERENCE
          </Text>
          {scratched.map((s) => (
            <ScenarioCard key={s.id} scenario={s} c={c} onActivate={onActivate} onScratch={onScratch} />
          ))}
        </>
      )}

      <Pressable
        onPress={onNew}
        style={({ pressed }) => [
          styles.addBtn,
          { borderColor: c.rule, opacity: pressed ? 0.7 : 1, marginTop: 16 },
        ]}
      >
        <Text style={[styles.addBtnLabel, { color: c.foreground, fontFamily: MONO }]}>
          + Play out another scenario
        </Text>
      </Pressable>
    </View>
  );
}

function ScenarioCard({
  scenario,
  c,
  onActivate,
  onScratch,
}: {
  scenario: DriverScenario;
  c: ReturnType<typeof useColors>;
  onActivate: (id: string) => void;
  onScratch: (id: string) => void;
}) {
  const isActive = scenario.status === "active";
  return (
    <View
      style={[
        styles.scenarioCard,
        {
          borderColor: isActive ? c.foreground : c.rule,
          backgroundColor: c.card,
          opacity: isActive ? 1 : 0.55,
        },
      ]}
    >
      <View style={styles.scenarioTop}>
        <Text style={[styles.scenarioName, { color: c.foreground, fontFamily: SERIF_BOLD }]}>
          {scenario.name}
        </Text>
        <Text
          style={[
            styles.scenarioStatus,
            { color: isActive ? c.foreground : c.mutedForeground, fontFamily: MONO },
          ]}
        >
          {isActive ? "ACTIVE" : "SCRATCHED"}
        </Text>
      </View>
      {scenario.hypothesis.trim().length > 0 && (
        <Text style={[styles.scenarioHyp, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
          {scenario.hypothesis}
        </Text>
      )}
      <Text style={[styles.scenarioAction, { color: c.foreground, fontFamily: SERIF }]}>
        Today: {scenario.dailyAction}
      </Text>
      <View style={styles.scenarioActions}>
        {!isActive && (
          <Pressable
            onPress={() => onActivate(scenario.id)}
            style={({ pressed }) => [styles.scenarioBtn, { borderColor: c.foreground, opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={[styles.scenarioBtnLabel, { color: c.foreground, fontFamily: MONO }]}>
              Make active
            </Text>
          </Pressable>
        )}
        {isActive && (
          <Pressable
            onPress={() => onScratch(scenario.id)}
            style={({ pressed }) => [styles.scenarioBtn, { borderColor: c.rule, opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={[styles.scenarioBtnLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
              Scratch this
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function PivotalTab({
  driver,
  c,
  onEdit,
  onDelete,
  onNew,
}: {
  driver: ReturnType<typeof useDailyDriver>["drivers"][number];
  c: ReturnType<typeof useColors>;
  onEdit: (card: PivotalCard) => void;
  onDelete: (cardId: string) => void;
  onNew: () => void;
}) {
  return (
    <View style={styles.tabContent}>
      <Text style={[styles.tabSection, { color: c.mutedForeground, fontFamily: MONO }]}>
        PIVOTAL INFO
      </Text>
      <Text style={[styles.pivotalIntro, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
        These cards stay visible even when plans change. When the road gets bumpy, update them — not the goal.
      </Text>

      {driver.pivotalCards.length === 0 ? (
        <Text style={[styles.emptyNote, { color: c.mutedForeground, fontFamily: SERIF_ITALIC }]}>
          No pivotal info yet.
        </Text>
      ) : (
        driver.pivotalCards.map((card) => (
          <View
            key={card.id}
            style={[styles.pivotCard, { backgroundColor: c.card, borderColor: c.rule }]}
          >
            <View style={styles.pivotTop}>
              <Text style={[styles.pivotLabel, { color: c.mutedForeground, fontFamily: MONO }]}>
                {card.label.toUpperCase()}
              </Text>
              <View style={styles.pivotCardActions}>
                <Pressable onPress={() => onEdit(card)} hitSlop={8}>
                  <Text style={[styles.pivotAction, { color: c.mutedForeground, fontFamily: MONO }]}>
                    Edit
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    Alert.alert("Remove card", "Remove this pivotal info card?", [
                      { text: "Cancel", style: "cancel" },
                      { text: "Remove", style: "destructive", onPress: () => onDelete(card.id) },
                    ])
                  }
                  hitSlop={8}
                >
                  <Ionicons name="close" size={14} color={c.mutedForeground} />
                </Pressable>
              </View>
            </View>
            <Text style={[styles.pivotValue, { color: c.foreground, fontFamily: SERIF }]}>
              {card.value}
            </Text>
            <Text style={[styles.pivotUpdated, { color: c.mutedForeground, fontFamily: MONO }]}>
              Updated {new Date(card.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        ))
      )}

      <Pressable
        onPress={onNew}
        style={({ pressed }) => [
          styles.addBtn,
          { borderColor: c.rule, opacity: pressed ? 0.7 : 1, marginTop: 12 },
        ]}
      >
        <Text style={[styles.addBtnLabel, { color: c.foreground, fontFamily: MONO }]}>
          + Add context card
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  errorPad: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },
  errorTitle: { fontSize: 24, lineHeight: 30 },
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 0,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    paddingHorizontal: 0,
  },
  backLink: { fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerBtn: { paddingVertical: 4, paddingHorizontal: 2 },
  headerBtnLabel: { fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase" },
  kindBadge: { fontSize: 9, letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 4 },
  driverName: { fontSize: 24, lineHeight: 30, letterSpacing: 0.2, marginBottom: 14 },
  tabBar: {
    flexDirection: "row",
    gap: 0,
  },
  tabBtn: {
    paddingVertical: 10,
    paddingRight: 18,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabLabel: { fontSize: 10, letterSpacing: 1.6, textTransform: "uppercase" },
  scroll: {
    paddingHorizontal: 22,
    paddingTop: 20,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },
  tabContent: { gap: 0 },
  tabSection: {
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 12,
    marginTop: 4,
  },
  todayCard: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  todayEyebrow: { fontSize: 9, letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 8 },
  todayAction: { fontSize: 22, lineHeight: 30, letterSpacing: 0.2 },
  editActionRow: { marginTop: 12 },
  editActionLabel: { fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase" },
  actionRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  doneBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 4,
  },
  doneBtnLabel: { fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase" },
  bumpBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: 4,
    borderWidth: 1,
  },
  bumpBtnLabel: { fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase" },
  logRow: {
    borderLeftWidth: 2,
    paddingLeft: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  logAction: { fontSize: 15, lineHeight: 22 },
  logBump: { fontSize: 13, lineHeight: 19, marginTop: 3 },
  dreamLabel: { fontSize: 9, letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 6, marginTop: 8 },
  dreamText: { fontSize: 16, lineHeight: 25 },
  nodeCard: {
    borderLeftWidth: 3,
    paddingLeft: 14,
    paddingVertical: 12,
    paddingRight: 12,
    borderRadius: 2,
    marginBottom: 8,
  },
  nodeHorizon: { fontSize: 9, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 4 },
  nodeText: { fontSize: 16, lineHeight: 23 },
  scenarioCard: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 14,
    marginBottom: 10,
  },
  scenarioTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  scenarioName: { fontSize: 17, lineHeight: 22, flex: 1 },
  scenarioStatus: { fontSize: 9, letterSpacing: 1.6, textTransform: "uppercase", marginLeft: 8, paddingTop: 2 },
  scenarioHyp: { fontSize: 13, lineHeight: 19, marginBottom: 6 },
  scenarioAction: { fontSize: 14, lineHeight: 20, marginBottom: 10 },
  scenarioActions: { flexDirection: "row", gap: 8 },
  scenarioBtn: { borderWidth: 1, borderRadius: 3, paddingVertical: 7, paddingHorizontal: 12 },
  scenarioBtnLabel: { fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase" },
  pivotalIntro: { fontSize: 14, lineHeight: 21, marginBottom: 14 },
  pivotCard: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 14,
    marginBottom: 10,
  },
  pivotTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  pivotLabel: { fontSize: 9, letterSpacing: 1.6, textTransform: "uppercase" },
  pivotCardActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  pivotAction: { fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase" },
  pivotValue: { fontSize: 15, lineHeight: 22 },
  pivotUpdated: { fontSize: 9, letterSpacing: 1.2, textTransform: "uppercase", marginTop: 6 },
  addBtn: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 13,
    alignItems: "center",
  },
  addBtnLabel: { fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase" },
  emptyNote: { fontSize: 15, lineHeight: 22, marginBottom: 12 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 8,
    paddingVertical: 24,
    paddingHorizontal: 22,
    marginHorizontal: 0,
  },
  modalTitle: { fontSize: 22, lineHeight: 28, marginBottom: 6 },
  modalHint: { fontSize: 14, lineHeight: 20, marginBottom: 14 },
  modalInput: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  modalInputSm: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  modalCancel: { fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase" },
  modalConfirm: {
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 4,
  },
  modalConfirmLabel: { fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase" },
});
