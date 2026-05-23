import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export const QUIZ_STORAGE_KEY = "headwaters_zone_quiz";

type WhoAnswer = "household" | "practitioner" | "community" | null;
type SituationAnswer = "normal" | "standby" | null;

interface QuizState {
  who: WhoAnswer;
  situation: SituationAnswer;
  skipped: boolean;
}

const WHO_ZONE: Record<NonNullable<WhoAnswer>, number> = {
  household: 0,
  practitioner: 2,
  community: 4,
};

const WHO_LABEL: Record<NonNullable<WhoAnswer>, string> = {
  household: "Household",
  practitioner: "Practitioner",
  community: "Community",
};

function readQuiz(): QuizState | null {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as QuizState;
    if (!parsed.skipped && (parsed.who === null || parsed.situation === null)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function ZoneChip({ dark }: { dark?: boolean }) {
  const [location] = useLocation();
  const [quiz, setQuiz] = useState<QuizState | null>(null);

  useEffect(() => {
    setQuiz(readQuiz());
    function sync() {
      setQuiz(readQuiz());
    }
    window.addEventListener("storage", sync);
    window.addEventListener("headwaters:zone-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("headwaters:zone-change", sync);
    };
  }, []);

  if (location === "/map") return null;
  if (!quiz) return null;

  let zoneNum: number | null = null;
  let zoneLabel: string;

  if (quiz.skipped) {
    zoneLabel = "All Zones";
  } else if (quiz.who) {
    zoneNum = WHO_ZONE[quiz.who];
    zoneLabel = `Z${zoneNum} · ${WHO_LABEL[quiz.who]}`;
  } else {
    return null;
  }

  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

  return (
    <a
      href={`${base}/map?change=1`}
      aria-label={`${zoneLabel} — click to change your zone`}
      data-testid="zone-chip"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 8px 2px 5px",
        borderRadius: 999,
        border: dark
          ? "1px solid rgba(212,160,23,0.30)"
          : "1px solid rgba(200,191,167,0.60)",
        background: dark ? "rgba(212,160,23,0.08)" : "rgba(244,237,224,0.88)",
        textDecoration: "none",
        flexShrink: 0,
        lineHeight: 1,
        cursor: "pointer",
        transition: "opacity 0.15s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.75"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
    >
      {zoneNum !== null && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: dark ? "rgba(212,160,23,0.55)" : "#1f3d2e",
            fontFamily: "monospace",
            fontSize: 7,
            fontWeight: 900,
            color: "#f4ede0",
            flexShrink: 0,
          }}
        >
          {zoneNum}
        </span>
      )}
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: dark ? "rgba(244,237,224,0.78)" : "#4a4035",
          whiteSpace: "nowrap",
        }}
      >
        {zoneLabel}
      </span>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 7,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: dark ? "#d4a017" : "#9a8c70",
          whiteSpace: "nowrap",
        }}
      >
        · Change
      </span>
    </a>
  );
}
