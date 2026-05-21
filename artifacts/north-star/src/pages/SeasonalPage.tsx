import { useState } from "react";
import { useStore, getSeasonKey } from "@/store";
import { Star } from "lucide-react";

export function SeasonalPage() {
  const seasonalReviews = useStore((s) => s.seasonalReviews);
  const statement = useStore((s) => s.statement);
  const saveSeasonalReview = useStore((s) => s.saveSeasonalReview);

  const seasonKey = getSeasonKey();
  const existing = seasonalReviews.find((r) => r.seasonKey === seasonKey);
  const seasonLabel = seasonKey.replace("-", " ");

  const [whatChanged, setWhatChanged] = useState(existing?.whatChanged ?? "");
  const [zonesShifted, setZonesShifted] = useState(existing?.zonesShifted ?? "");
  const [statementReflection, setStatementReflection] = useState(existing?.statementReflection ?? "");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    saveSeasonalReview({ seasonKey, whatChanged, zonesShifted, statementReflection });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-dvh pb-24" style={{ background: "linear-gradient(180deg, #FAFAF9 0%, #F5F0E8 100%)" }}>
      <div className="px-5 py-7 max-w-lg mx-auto space-y-5">
        <div>
          <p className="text-xs text-[#78716C] uppercase tracking-widest capitalize">{seasonLabel}</p>
          <h1 className="text-2xl mt-1">Seasonal review</h1>
          <p className="text-sm text-[#78716C] mt-1">Bigger picture — what changed this season?</p>
        </div>

        {statement && (
          <div className="relative rounded-2xl overflow-hidden">
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #F5F0E8 0%, #EDE8DC 100%)",
                border: "1px solid #D6D0C7",
              }}
            />
            <div className="relative px-5 py-5 space-y-3">
              <div className="flex items-center gap-2">
                <Star size={13} className="text-[#8A6A1A]" fill="#8A6A1A" />
                <p className="text-xs text-[#8A6A1A] uppercase tracking-widest font-medium">Current North Star</p>
              </div>
              {statement.who && (
                <p className="text-sm text-[#44403C]">
                  <span className="font-medium text-[#1C1917]">For</span> {statement.who}
                </p>
              )}
              {statement.why && (
                <p className="text-sm text-[#44403C]">
                  <span className="font-medium text-[#1C1917]">So that</span> {statement.why}
                </p>
              )}
              {statement.noFly && (
                <p className="text-sm text-[#78716C] italic border-t border-[#D6D0C7] pt-3">
                  No-fly: {statement.noFly}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium block">What changed this season?</label>
          <textarea
            value={whatChanged}
            onChange={(e) => setWhatChanged(e.target.value)}
            placeholder="Projects started, ended, pivoted. Relationships, places, pace."
            rows={4}
            className="w-full border border-[#E7E5E4] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30 focus:border-[#8A6A1A]/50 resize-none placeholder:text-[#B5AFA9] leading-relaxed transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium block">How did your zones shift?</label>
          <textarea
            value={zonesShifted}
            onChange={(e) => setZonesShifted(e.target.value)}
            placeholder="Which zones got more or less attention than intended? Why?"
            rows={3}
            className="w-full border border-[#E7E5E4] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30 focus:border-[#8A6A1A]/50 resize-none placeholder:text-[#B5AFA9] leading-relaxed transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium block">Does your north star statement still fit?</label>
          <textarea
            value={statementReflection}
            onChange={(e) => setStatementReflection(e.target.value)}
            placeholder="What holds, what's shifted, what needs updating? (Update the statement itself in Settings)"
            rows={3}
            className="w-full border border-[#E7E5E4] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8A6A1A]/30 focus:border-[#8A6A1A]/50 resize-none placeholder:text-[#B5AFA9] leading-relaxed transition-all"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-[#1C1917] text-white rounded-xl py-3 text-sm font-medium min-h-[44px] hover:bg-[#2C2420] transition-colors shadow-sm"
        >
          {saved ? "Saved ✓" : "Save seasonal review"}
        </button>

        {seasonalReviews.length > 1 && (
          <div className="space-y-2">
            <h2 className="text-base">Previous seasons</h2>
            {seasonalReviews.filter((r) => r.seasonKey !== seasonKey).slice(0, 6).map((r) => (
              <div key={r.seasonKey} className="bg-white rounded-xl border border-[#E7E5E4] p-4 shadow-sm">
                <p className="text-xs text-[#78716C] capitalize mb-1">{r.seasonKey.replace("-", " ")}</p>
                {r.whatChanged && <p className="text-sm text-[#44403C] leading-relaxed">{r.whatChanged.slice(0, 100)}{r.whatChanged.length > 100 ? "…" : ""}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
