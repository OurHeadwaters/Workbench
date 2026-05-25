// ── DebriefPage — morning debrief + evening brain dump ───────────────────────
// Absorbed from practitioner-operating-plan.
// Two modes: /debrief (morning) and /debrief/evening (evening dump).
// Saves by date key in localStorage — same pattern as captures.

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useLocation, Link } from "wouter";
import { ChevronLeft, Moon, Sun } from "lucide-react";

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
    // Re-load when mode switches
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
    <div className="min-h-dvh flex flex-col bg-gradient-to-b from-[#FAFAF9] to-[#F5F0E8]">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-white/85 border-b border-[#E7E5E4]">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 text-sm text-[#44403C] min-h-[44px]">
            <ChevronLeft size={18} /> Today
          </Link>
          <div className="flex items-center gap-2">
            {isEvening ? <Moon size={16} className="text-[#78716C]" /> : <Sun size={16} className="text-[#78716C]" />}
            <h2 className="text-base font-medium" style={{ fontFamily: "Fraunces, serif" }}>
              {isEvening ? "Evening Dump" : "Morning Debrief"}
            </h2>
          </div>
          <span className="text-xs text-[#B5AFA9] min-h-[44px] flex items-center">
            {saved ? "Saved" : ""}
          </span>
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <p className="text-sm text-[#6B5744] italic leading-relaxed">
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
          className="w-full rounded-2xl border border-[#E7E5E4] bg-white p-4 text-base text-[#1C1917] leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#1F3D2E]/20"
          style={{ minHeight: isEvening ? 320 : 240 }}
        />

        {/* Mode toggle */}
        <div className="flex gap-2">
          <Link
            href="/debrief"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium min-h-[48px] transition-colors"
            style={{
              borderColor: !isEvening ? "#1F3D2E" : "#E7E5E4",
              backgroundColor: !isEvening ? "#1F3D2E" : "transparent",
              color: !isEvening ? "#fff" : "#78716C",
            }}
          >
            <Sun size={15} /> Morning
          </Link>
          <Link
            href="/debrief/evening"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium min-h-[48px] transition-colors"
            style={{
              borderColor: isEvening ? "#1F3D2E" : "#E7E5E4",
              backgroundColor: isEvening ? "#1F3D2E" : "transparent",
              color: isEvening ? "#fff" : "#78716C",
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
      <p className="text-[10px] font-black tracking-widest uppercase text-[#78716C]">Previous</p>
      {entries.map(([dateKey, entry]) => {
        const text = isEvening ? entry.evening : entry.morning;
        if (!text) return null;
        return (
          <div key={dateKey} className="rounded-xl border border-[#E7E5E4] bg-white p-3 space-y-1">
            <p className="text-[10px] font-black tracking-widest uppercase text-[#B5AFA9]">{dateKey}</p>
            <p className="text-sm text-[#78716C] line-clamp-3 leading-relaxed">{text}</p>
          </div>
        );
      })}
    </div>
  );
}
