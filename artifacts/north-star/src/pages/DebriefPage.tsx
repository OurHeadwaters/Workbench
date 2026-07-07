// ── DebriefPage — morning debrief + evening brain dump ───────────────────────
// Absorbed from practitioner-operating-plan.
// Two modes: /debrief (morning) and /debrief/evening (evening dump).
// Saves by date key in localStorage — same pattern as captures.

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useLocation, Link } from "wouter";
import { ChevronLeft, Moon, Sun } from "lucide-react";
import { BG, SURFACE, SURFACE_2, BORDER, BORDER_STRONG, TEXT, TEXT_2, TEXT_3, AMBER, FONT_DISPLAY } from "@/lib/theme";

function todayKey() {
  return format(new Date(), "yyyy-MM-dd");
}

const STORAGE_KEY = "ns-debrief";

interface DebriefEntry {
  morning?: string;
  evening?: string;
  updatedAt: string;
}

function load(): Record<string, DebriefEntry> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function save(data: Record<string, DebriefEntry>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const MORNING_PROMPTS = [
  "What's the one thing that, if done today, makes everything else easier?",
  "What's unfinished from yesterday that needs to move first?",
  "Who needs a response from you before noon?",
  "What are you avoiding — and is avoidance the right call today?",
];

const EVENING_PROMPTS = [
  "What happened today that you didn't expect?",
  "What stayed stuck — and is it worth unsticking?",
  "What's going to be sitting on your chest tomorrow morning if you don't write it down now?",
];

export function DebriefPage() {
  const [location] = useLocation();
  const isEvening = location.includes("evening");
  const key = todayKey();

  const [text, setText] = useState(() => {
    const data = load();
    return isEvening ? (data[key]?.evening ?? "") : (data[key]?.morning ?? "");
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = load();
    setText(isEvening ? (data[key]?.evening ?? "") : (data[key]?.morning ?? ""));
    setSaved(false);
  }, [isEvening, key]);

  function handleChange(val: string) {
    setText(val);
    setSaved(false);
    const data = load();
    data[key] = {
      ...(data[key] ?? { updatedAt: new Date().toISOString() }),
      [isEvening ? "evening" : "morning"]: val,
      updatedAt: new Date().toISOString(),
    };
    save(data);
    setSaved(true);
  }

  const prompts = isEvening ? EVENING_PROMPTS : MORNING_PROMPTS;
  const promptIdx = Math.floor((Date.now() / 86400000)) % prompts.length;
  const todayPrompt = prompts[promptIdx];

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: BG }}>
      {/* Header */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: `${SURFACE}e6`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 text-sm min-h-[44px]" style={{ color: TEXT_2 }}>
            <ChevronLeft size={18} /> Today
          </Link>
          <div className="flex items-center gap-2">
            {isEvening
              ? <Moon size={16} style={{ color: TEXT_2 }} />
              : <Sun size={16} style={{ color: TEXT_2 }} />}
            <h2 className="text-base font-medium" style={{ fontFamily: FONT_DISPLAY, color: TEXT }}>
              {isEvening ? "Evening Dump" : "Morning Debrief"}
            </h2>
          </div>
          <span className="text-xs min-h-[44px] flex items-center" style={{ color: TEXT_3 }}>
            {saved ? "Saved" : ""}
          </span>
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <p className="text-sm italic leading-relaxed" style={{ color: TEXT_2 }}>
          "{todayPrompt}"
        </p>

        <textarea
          autoFocus
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={isEvening
            ? "Write whatever's on your mind. No structure. No right way to do this."
            : "Start anywhere. What happened yesterday? What matters today?"
          }
          className="w-full rounded-2xl p-4 text-base leading-relaxed resize-none focus:outline-none focus:ring-2"
          style={{
            backgroundColor: SURFACE,
            border: `1px solid ${BORDER}`,
            color: TEXT,
            caretColor: TEXT,
            minHeight: isEvening ? 320 : 240,
          }}
        />

        {/* Mode toggle */}
        <div className="flex gap-2">
          <Link
            href="/debrief"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium min-h-[48px] transition-colors"
            style={{
              borderColor: !isEvening ? AMBER : BORDER,
              backgroundColor: !isEvening ? AMBER : "transparent",
              color: !isEvening ? BG : TEXT_2,
            }}
          >
            <Sun size={15} /> Morning
          </Link>
          <Link
            href="/debrief/evening"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium min-h-[48px] transition-colors"
            style={{
              borderColor: isEvening ? AMBER : BORDER,
              backgroundColor: isEvening ? AMBER : "transparent",
              color: isEvening ? BG : TEXT_2,
            }}
          >
            <Moon size={15} /> Evening
          </Link>
        </div>

        {/* Previous days */}
        <PreviousDays isEvening={isEvening} />
      </div>
    </div>
  );
}

function PreviousDays({ isEvening }: { isEvening: boolean }) {
  const data = load();
  const entries = Object.entries(data)
    .filter(([k]) => k !== todayKey())
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 5);

  if (entries.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: TEXT_2 }}>Previous</p>
      {entries.map(([dateKey, entry]) => {
        const text = isEvening ? entry.evening : entry.morning;
        if (!text) return null;
        return (
          <div key={dateKey} className="rounded-xl p-3 space-y-1" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
            <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: TEXT_3 }}>{dateKey}</p>
            <p className="text-sm line-clamp-3 leading-relaxed" style={{ color: TEXT_2 }}>{text}</p>
          </div>
        );
      })}
    </div>
  );
}
