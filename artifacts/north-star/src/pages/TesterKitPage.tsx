import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useStore, getTodayKey, getWeekKey, getSeasonKey } from "@/store";
import { ZoneBadge } from "@/components/ZoneBadge";
import { ZONE_LABELS } from "@/lib/utils";
import type { ZoneId } from "@/types";

const BRIEF_PROMPT = `Read [BRIEF_PATH].

The brief is self-contained — all context, constraints, current code, and acceptance criteria are inside it. Work only within the scope it defines. Do not touch anything outside it. When every acceptance criterion is checked, stop and report only what changed.`;

function CopyPromptCard() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(BRIEF_PROMPT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base">Agent brief prompt</h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium min-h-[36px] transition-colors"
          style={{
            backgroundColor: copied ? "#F0FDF4" : "#F5F5F0",
            color: copied ? "#166534" : "#44403C",
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="text-xs text-[#44403C] leading-relaxed whitespace-pre-wrap font-mono bg-[#FAFAF9] rounded-lg p-3 border border-[#E7E5E4]">
        {BRIEF_PROMPT}
      </pre>
      <p className="text-xs text-[#78716C]">Replace <span className="font-mono">[BRIEF_PATH]</span> with the actual file path before sending.</p>
    </div>
  );
}

const ZONES: ZoneId[] = ["Z1", "Z2", "Z3", "Z4"];

export function TesterKitPage() {
  const state = useStore((s) => s);
  const addCapture = useStore((s) => s.addCapture);
  const setTodayPick = useStore((s) => s.setTodayPick);
  const getTodayPick = useStore((s) => s.getTodayPick);

  const [captureText, setCaptureText] = useState("");

  const todayPick = getTodayPick();

  function seedCapture() {
    if (!captureText.trim()) return;
    addCapture({ text: captureText.trim() });
    setCaptureText("");
  }

  function seedHours() {
    setTodayPick({
      hoursByZone: { Z1: 2.5, Z2: 4, Z3: 1.25, Z4: 0.5 },
    });
  }

  return (
    <div className="min-h-dvh bg-[#FAFAF9] pb-24">
      <div className="px-5 py-6 max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-2xl mb-1">Tester Kit</h1>
          <p className="text-sm text-[#78716C]">Scratch space for testing features and demo flows.</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-3">
          <h2 className="text-base">State snapshot</h2>
          <div className="space-y-1 text-xs text-[#44403C] font-mono">
            <p>Today: {getTodayKey()}</p>
            <p>Week: {getWeekKey()}</p>
            <p>Season: {getSeasonKey()}</p>
            <p>Constellations: {state.constellations.length} total, {state.constellations.filter(c => c.active).length} active</p>
            <p>Contracts: {state.contracts.filter(c => c.active).length} active</p>
            <p>Captures: {state.captures.length}</p>
            <p>Weekly reviews: {state.weeklyReviews.length}</p>
            <p>Seasonal reviews: {state.seasonalReviews.length}</p>
            <p>Onboarding: {state.onboarding.completed ? "complete" : "pending"}</p>
            <p>Last backup: {state.lastBackedUpAt ?? "never"}</p>
            <p>Schema version: {state.schemaVersion}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-3">
          <h2 className="text-base">Today's pick</h2>
          {todayPick.constellationIds.length === 0 ? (
            <p className="text-sm text-[#78716C]">Nothing picked yet.</p>
          ) : (
            <div className="space-y-1">
              {todayPick.constellationIds.map((id) => {
                const c = state.constellations.find((co) => co.id === id);
                return c ? (
                  <div key={id} className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{c.name}</span>
                    <ZoneBadge zone={c.zone} />
                  </div>
                ) : null;
              })}
            </div>
          )}
          {todayPick.hoursByZone && (
            <div className="text-xs text-[#44403C]">
              Hours: {ZONES.map(z => `${z}:${todayPick.hoursByZone?.[z] ?? 0}h`).join(", ")}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-3">
          <h2 className="text-base">Seed actions</h2>

          <div className="flex gap-2">
            <input
              value={captureText}
              onChange={(e) => setCaptureText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && seedCapture()}
              placeholder="Quick capture text"
              className="flex-1 border border-[#E7E5E4] rounded-lg px-3 py-2 text-sm focus:outline-none"
            />
            <button onClick={seedCapture} className="px-3 py-2 bg-[#1C1917] text-white rounded-lg text-sm min-h-[44px]">
              Add
            </button>
          </div>

          <button
            onClick={seedHours}
            className="w-full border border-[#E7E5E4] rounded-lg py-2 text-sm min-h-[44px] hover:bg-[#F5F5F0]"
          >
            Seed sample zone hours (Z1:2.5h Z2:4h Z3:1.25h Z4:0.5h)
          </button>
        </div>

        <CopyPromptCard />

        <div className="bg-white rounded-xl border border-[#E7E5E4] p-4 space-y-2">
          <h2 className="text-base">Zone reference</h2>
          {ZONES.map((z) => (
            <div key={z} className="flex items-start gap-3 py-2">
              <ZoneBadge zone={z} />
              <p className="text-xs text-[#78716C]">{ZONE_LABELS[z].desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
