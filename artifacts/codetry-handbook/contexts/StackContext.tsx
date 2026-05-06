import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { STACK_CARDS } from "@/data/stackCards";

const NS = "codetry-handbook:stack:v1";
const KEY_ORDER = `${NS}:order`;
const KEY_ANSWERS = `${NS}:answers`;
const KEY_DONE = `${NS}:done`;

export type CardStatus = "active" | "done";

export interface StepAnswer {
  stepId: string;
  text: string;
}

export interface CardState {
  cardId: string;
  status: CardStatus;
  stepAnswers: Record<string, string>;
}

interface StackContextValue {
  ready: boolean;
  order: string[];
  cardStates: Record<string, CardState>;
  skipCard: (cardId: string) => void;
  completeCard: (cardId: string) => void;
  setStepAnswer: (cardId: string, stepId: string, text: string) => void;
  getStepAnswer: (cardId: string, stepId: string) => string;
  resetAll: () => void;
  activeCards: string[];
  doneCards: string[];
  topCardId: string | null;
}

const StackContext = createContext<StackContextValue | null>(null);

// ─── Pure hydration logic — exported for unit testing ─────────────────────────
//
// Reconstructs order and card states from the three raw AsyncStorage strings.
// This is extracted so the session-persistence behaviour can be tested without
// mounting a React tree or mocking AsyncStorage.

export function hydrateStackState(
  rawOrder: string | null,
  rawAnswers: string | null,
  rawDone: string | null,
  allIds: string[],
): { order: string[]; cardStates: Record<string, CardState> } {
  let loadedOrder: string[] = allIds;

  if (rawOrder) {
    try {
      const parsed: string[] = JSON.parse(rawOrder);
      const validParsed = parsed.filter((id) => allIds.includes(id));
      const missing = allIds.filter((id) => !validParsed.includes(id));
      loadedOrder = [...validParsed, ...missing];
    } catch {}
  }

  const loadedAnswers: Record<string, Record<string, string>> = {};
  if (rawAnswers) {
    try {
      const parsed = JSON.parse(rawAnswers);
      if (parsed && typeof parsed === "object") {
        Object.assign(loadedAnswers, parsed);
      }
    } catch {}
  }

  const doneSet = new Set<string>();
  if (rawDone) {
    try {
      const parsed: string[] = JSON.parse(rawDone);
      if (Array.isArray(parsed)) parsed.forEach((id) => doneSet.add(id));
    } catch {}
  }

  const cardStates: Record<string, CardState> = {};
  for (const id of allIds) {
    cardStates[id] = {
      cardId: id,
      status: doneSet.has(id) ? "done" : "active",
      stepAnswers: loadedAnswers[id] ?? {},
    };
  }

  return { order: loadedOrder, cardStates };
}

export function StackProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [order, setOrder] = useState<string[]>(() =>
    STACK_CARDS.map((c) => c.id),
  );
  const [cardStates, setCardStates] = useState<Record<string, CardState>>(() => {
    const s: Record<string, CardState> = {};
    for (const c of STACK_CARDS) {
      s[c.id] = { cardId: c.id, status: "active", stepAnswers: {} };
    }
    return s;
  });

  const orderRef = useRef(order);
  const cardStatesRef = useRef(cardStates);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [rawOrder, rawAnswers, rawDone] = await Promise.all([
          AsyncStorage.getItem(KEY_ORDER),
          AsyncStorage.getItem(KEY_ANSWERS),
          AsyncStorage.getItem(KEY_DONE),
        ]);
        if (cancelled) return;

        const allIds = STACK_CARDS.map((c) => c.id);
        const { order: loadedOrder, cardStates: states } = hydrateStackState(
          rawOrder,
          rawAnswers,
          rawDone,
          allIds,
        );

        setOrder(loadedOrder);
        orderRef.current = loadedOrder;
        setCardStates(states);
        cardStatesRef.current = states;
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistOrder = useCallback((o: string[]) => {
    AsyncStorage.setItem(KEY_ORDER, JSON.stringify(o)).catch(() => {});
  }, []);

  const persistAnswers = useCallback((states: Record<string, CardState>) => {
    const answers: Record<string, Record<string, string>> = {};
    for (const [id, state] of Object.entries(states)) {
      answers[id] = state.stepAnswers;
    }
    AsyncStorage.setItem(KEY_ANSWERS, JSON.stringify(answers)).catch(() => {});
  }, []);

  const persistDone = useCallback((states: Record<string, CardState>) => {
    const done = Object.values(states)
      .filter((s) => s.status === "done")
      .map((s) => s.cardId);
    AsyncStorage.setItem(KEY_DONE, JSON.stringify(done)).catch(() => {});
  }, []);

  const skipCard = useCallback(
    (cardId: string) => {
      setOrder((prev) => {
        const without = prev.filter((id) => id !== cardId);
        const next = [...without, cardId];
        orderRef.current = next;
        persistOrder(next);
        return next;
      });
    },
    [persistOrder],
  );

  const completeCard = useCallback(
    (cardId: string) => {
      setCardStates((prev) => {
        const next = {
          ...prev,
          [cardId]: { ...prev[cardId], status: "done" as CardStatus },
        };
        cardStatesRef.current = next;
        persistDone(next);
        return next;
      });
    },
    [persistDone],
  );

  const setStepAnswer = useCallback(
    (cardId: string, stepId: string, text: string) => {
      setCardStates((prev) => {
        const card = prev[cardId] ?? {
          cardId,
          status: "active" as CardStatus,
          stepAnswers: {},
        };
        const next = {
          ...prev,
          [cardId]: {
            ...card,
            stepAnswers: { ...card.stepAnswers, [stepId]: text },
          },
        };
        cardStatesRef.current = next;
        persistAnswers(next);
        return next;
      });
    },
    [persistAnswers],
  );

  const getStepAnswer = useCallback(
    (cardId: string, stepId: string) => {
      return cardStatesRef.current[cardId]?.stepAnswers[stepId] ?? "";
    },
    [],
  );

  const resetAll = useCallback(() => {
    const allIds = STACK_CARDS.map((c) => c.id);
    const freshStates: Record<string, CardState> = {};
    for (const id of allIds) {
      freshStates[id] = { cardId: id, status: "active", stepAnswers: {} };
    }
    setOrder(allIds);
    orderRef.current = allIds;
    setCardStates(freshStates);
    cardStatesRef.current = freshStates;
    Promise.all([
      AsyncStorage.removeItem(KEY_ORDER),
      AsyncStorage.removeItem(KEY_ANSWERS),
      AsyncStorage.removeItem(KEY_DONE),
    ]).catch(() => {});
  }, []);

  const activeCards = useMemo(
    () => order.filter((id) => cardStates[id]?.status !== "done"),
    [order, cardStates],
  );

  const doneCards = useMemo(
    () => order.filter((id) => cardStates[id]?.status === "done"),
    [order, cardStates],
  );

  const topCardId = activeCards[0] ?? null;

  const value = useMemo<StackContextValue>(
    () => ({
      ready,
      order,
      cardStates,
      skipCard,
      completeCard,
      setStepAnswer,
      getStepAnswer,
      resetAll,
      activeCards,
      doneCards,
      topCardId,
    }),
    [
      ready,
      order,
      cardStates,
      skipCard,
      completeCard,
      setStepAnswer,
      getStepAnswer,
      resetAll,
      activeCards,
      doneCards,
      topCardId,
    ],
  );

  return (
    <StackContext.Provider value={value}>{children}</StackContext.Provider>
  );
}

export function useStack(): StackContextValue {
  const ctx = useContext(StackContext);
  if (!ctx) throw new Error("useStack must be used inside StackProvider");
  return ctx;
}
