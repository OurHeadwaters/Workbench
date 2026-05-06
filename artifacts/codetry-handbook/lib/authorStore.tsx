import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "handbook:author:v1";

type AnswerMap = Record<string, string>;

type AuthorCtx = {
  answers: AnswerMap;
  setAnswer: (zoneId: string, promptId: string, text: string) => void;
  getAnswer: (zoneId: string, promptId: string) => string;
  countAnswers: (zoneId: string, total: number) => number;
  totalAnswered: number;
};

const Ctx = createContext<AuthorCtx | null>(null);

export function AuthorProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<AnswerMap>({});

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setAnswers(JSON.parse(raw));
        } catch {}
      }
    });
  }, []);

  const setAnswer = useCallback(
    (zoneId: string, promptId: string, text: string) => {
      setAnswers((prev) => {
        const next = { ...prev, [`${zoneId}:${promptId}`]: text };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const getAnswer = useCallback(
    (zoneId: string, promptId: string) => {
      return answers[`${zoneId}:${promptId}`] ?? "";
    },
    [answers],
  );

  const countAnswers = useCallback(
    (zoneId: string, _total: number) => {
      return Object.keys(answers).filter(
        (k) =>
          k.startsWith(`${zoneId}:`) && (answers[k] ?? "").trim().length > 0,
      ).length;
    },
    [answers],
  );

  const totalAnswered = Object.values(answers).filter(
    (v) => v.trim().length > 0,
  ).length;

  return (
    <Ctx.Provider
      value={{ answers, setAnswer, getAnswer, countAnswers, totalAnswered }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuthor(): AuthorCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuthor must be used within AuthorProvider");
  return ctx;
}
