import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BOTTLES_KEY = "gordUniverseBottles";
const HISTORY_KEY = "gordConversationHistory";
const HISTORY_LIMIT = 20;
const OPENING_QUIP =
  "Well, look who wandered in. Gord's on board — what's rattling around in that head of yours?";

const _apiOrigin = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
  : process.env.EXPO_PUBLIC_API_DOMAIN
    ? `https://${process.env.EXPO_PUBLIC_API_DOMAIN}`
    : "";
const GORD_API = `${_apiOrigin}/api-server/api/gord/chat`;

interface ChatMessage {
  role: "user" | "gord";
  content: string;
}

interface Bottle {
  date: string;
  message: string;
}

async function loadHistory(): Promise<ChatMessage[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

async function saveHistory(messages: ChatMessage[]): Promise<void> {
  await AsyncStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(messages.slice(-HISTORY_LIMIT)),
  );
}

async function loadBottles(): Promise<Bottle[]> {
  try {
    const raw = await AsyncStorage.getItem(BOTTLES_KEY);
    return raw ? (JSON.parse(raw) as Bottle[]) : [];
  } catch {
    return [];
  }
}

async function saveBottle(message: string): Promise<void> {
  const bottles = await loadBottles();
  bottles.unshift({ date: new Date().toLocaleString(), message });
  await AsyncStorage.setItem(BOTTLES_KEY, JSON.stringify(bottles));
}

export function GordWidget() {
  const [open, setOpen] = useState(false);
  const [showBottles, setShowBottles] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "gord", content: OPENING_QUIP },
  ]);
  const [input, setInput] = useState("");
  const [isBottle, setIsBottle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const birdAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    void loadHistory().then((saved) => {
      if (saved.length > 0) setMessages(saved);
    });
  }, []);

  useEffect(() => {
    void saveHistory(messages);
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, open]);

  function handlePressButton() {
    Animated.sequence([
      Animated.timing(birdAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(birdAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setOpen(true);
    setShowBottles(false);
  }

  async function handleClearHistory() {
    await AsyncStorage.removeItem(HISTORY_KEY);
    setMessages([{ role: "gord", content: OPENING_QUIP }]);
  }

  async function handleViewBottles() {
    const loaded = await loadBottles();
    setBottles(loaded);
    setShowBottles((v) => !v);
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: ChatMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);

    if (isBottle) {
      await saveBottle(text);
      setIsBottle(false);
      setMessages([
        ...nextMessages,
        {
          role: "gord",
          content:
            "🌊 Message cast into the current. Gord will carry it to the Universe Map.",
        },
      ]);
      return;
    }

    setLoading(true);
    try {
      const history = nextMessages
        .slice(0, -1)
        .map((m) => ({
          role: m.role === "gord" ? "assistant" : "user",
          content: m.content,
        }));

      const res = await fetch(GORD_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      const reply = data.reply ?? data.error ?? "Gord lost his train of thought.";
      setMessages([...nextMessages, { role: "gord", content: reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        { role: "gord", content: "Gord's radio went dark. Check your connection." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const birdRotate = birdAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "20deg"],
  });

  return (
    <>
      <TouchableOpacity
        onPress={handlePressButton}
        style={styles.fab}
        activeOpacity={0.85}
      >
        <Text style={styles.fabLeaf}>🌿</Text>
        <Animated.Text
          style={[styles.fabBird, { transform: [{ rotate: birdRotate }] }]}
        >
          🐦
        </Animated.Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOuter}
        >
          <SafeAreaView edges={["bottom"]} style={styles.chatWindow}>
            <View style={styles.header}>
              <Text style={styles.headerBird}>🐦</Text>
              <View>
                <Text style={styles.headerName}>Gord</Text>
                <Text style={styles.headerTag}>"Gord's on board"</Text>
              </View>
              <TouchableOpacity
                onPress={() => setOpen(false)}
                style={styles.headerClose}
              >
                <Text style={styles.headerCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {showBottles ? (
              <View style={{ flex: 1 }}>
                <View style={styles.bottlesBar}>
                  <Text style={styles.bottlesTitle}>🌊 Messages in Bottles</Text>
                  <TouchableOpacity onPress={() => setShowBottles(false)}>
                    <Text style={styles.backText}>← Back</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.bottlesList} contentContainerStyle={{ padding: 12 }}>
                  {bottles.length === 0 ? (
                    <Text style={styles.emptyBottles}>
                      No bottles yet. Toggle "Cast as Bottle" before sending.
                    </Text>
                  ) : (
                    bottles.map((b, i) => (
                      <View key={i} style={styles.bottleCard}>
                        <Text style={styles.bottleDate}>{b.date}</Text>
                        <Text style={styles.bottleMessage}>{b.message}</Text>
                      </View>
                    ))
                  )}
                </ScrollView>
              </View>
            ) : (
              <ScrollView
                ref={scrollRef}
                style={styles.messageList}
                contentContainerStyle={{ padding: 12, gap: 8 }}
                onContentSizeChange={() =>
                  scrollRef.current?.scrollToEnd({ animated: true })
                }
              >
                {messages.map((m, i) =>
                  m.role === "user" ? (
                    <Text key={i} style={styles.userMsg}>
                      {m.content}
                    </Text>
                  ) : (
                    <View key={i} style={styles.gordMsgBubble}>
                      <Text style={styles.gordMsgText}>{m.content}</Text>
                    </View>
                  ),
                )}
                {loading && (
                  <View style={styles.gordMsgBubble}>
                    <Text style={styles.loadingText}>Gord's thinking…</Text>
                  </View>
                )}
              </ScrollView>
            )}

            <View style={styles.inputArea}>
              <TouchableOpacity
                onPress={() => setIsBottle((v) => !v)}
                style={styles.bottleToggle}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    isBottle && styles.checkboxChecked,
                  ]}
                >
                  {isBottle && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.bottleLabel}>🌊 Cast as Message in a Bottle</Text>
              </TouchableOpacity>

              <View style={styles.inputRow}>
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder="Talk to Gord..."
                  placeholderTextColor="#78716c"
                  style={styles.textInput}
                  onSubmitEditing={() => void handleSend()}
                  returnKeyType="send"
                  multiline={false}
                />
                <TouchableOpacity
                  onPress={() => void handleSend()}
                  style={styles.sendBtn}
                  disabled={loading}
                >
                  <Text style={styles.sendBtnText}>→</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() => {
                  setMessages((prev) => [
                    ...prev,
                    {
                      role: "gord",
                      content: "A tip? Respect. Keeps this old bird flying.",
                    },
                  ]);
                }}
              >
                <Text style={styles.footerTip}>⚡ Tip Gord</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => void handleViewBottles()}>
                <Text style={styles.footerBottles}>📜 View Bottles</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => void handleClearHistory()}>
                <Text style={styles.footerFresh}>🔄 Start fresh</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Text style={styles.footerClose}>Close</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#1c4a2e",
    borderWidth: 3,
    borderColor: "#78350f",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 999,
  },
  fabLeaf: {
    fontSize: 26,
  },
  fabBird: {
    position: "absolute",
    top: -10,
    right: -10,
    fontSize: 22,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalOuter: {
    justifyContent: "flex-end",
  },
  chatWindow: {
    backgroundColor: "#0c0a09",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "#78350f",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    backgroundColor: "#1a0a00",
    borderBottomWidth: 1,
    borderBottomColor: "#44403c",
  },
  headerBird: {
    fontSize: 28,
  },
  headerName: {
    color: "#fef3c7",
    fontWeight: "700",
    fontSize: 15,
  },
  headerTag: {
    color: "#fcd34d",
    fontSize: 11,
  },
  headerClose: {
    marginLeft: "auto",
    padding: 6,
  },
  headerCloseText: {
    color: "#9ca3af",
    fontSize: 16,
  },
  messageList: {
    maxHeight: 280,
  },
  userMsg: {
    color: "#7dd3fc",
    textAlign: "right",
    fontSize: 14,
    marginBottom: 4,
  },
  gordMsgBubble: {
    backgroundColor: "#451a03",
    borderWidth: 1,
    borderColor: "#92400e",
    borderRadius: 14,
    padding: 10,
    marginBottom: 4,
  },
  gordMsgText: {
    color: "#fef3c7",
    fontSize: 14,
    lineHeight: 20,
  },
  loadingText: {
    color: "#fcd34d",
    fontSize: 13,
  },
  inputArea: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#44403c",
    backgroundColor: "#0c0a09",
  },
  bottleToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#f59e0b",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#f59e0b",
  },
  checkmark: {
    color: "#000",
    fontSize: 12,
    fontWeight: "700",
  },
  bottleLabel: {
    color: "#fcd34d",
    fontSize: 13,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#1c1917",
    borderWidth: 1,
    borderColor: "#78350f",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#e7e5e4",
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#78350f",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnText: {
    color: "#fef3c7",
    fontSize: 20,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#44403c",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  footerTip: {
    color: "#fbbf24",
    fontSize: 13,
  },
  footerBottles: {
    color: "#34d399",
    fontSize: 13,
  },
  footerFresh: {
    color: "#f87171",
    fontSize: 13,
  },
  footerClose: {
    color: "#9ca3af",
    fontSize: 13,
  },
  bottlesBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#44403c",
  },
  bottlesTitle: {
    color: "#fcd34d",
    fontWeight: "600",
    fontSize: 13,
  },
  backText: {
    color: "#9ca3af",
    fontSize: 12,
  },
  bottlesList: {
    flex: 1,
  },
  emptyBottles: {
    color: "#6b7280",
    fontSize: 13,
  },
  bottleCard: {
    backgroundColor: "#1c1917",
    borderWidth: 1,
    borderColor: "#44403c",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  bottleDate: {
    color: "#78716c",
    fontSize: 11,
    marginBottom: 4,
  },
  bottleMessage: {
    color: "#d6d3d1",
    fontSize: 13,
  },
});
