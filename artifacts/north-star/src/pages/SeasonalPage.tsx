import { useState } from "react";
import { useStore, getSeasonKey } from "@/store";
import { Star } from "lucide-react";
import { BG, SURFACE, SURFACE_2, BORDER, BORDER_STRONG, TEXT, TEXT_2, TEXT_3, AMBER, AMBER_WASH, FONT_DISPLAY } from "@/lib/theme";

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
    <div className="min-h-dvh pb-24" style={{ backgroundColor: BG }}>
      <div className="px-5 py-7 max-w-lg mx-auto space-y-5">
        <div>
          <p className="text-xs uppercase tracking-widest capitalize" style={{ color: TEXT_2 }}>{seasonLabel}</p>
          <h1 className="text-2xl mt-1" style={{ color: TEXT }}>Seasonal review</h1>
          <p className="text-sm mt-1" style={{ color: TEXT_2 }}>Bigger picture — what changed this season?</p>
        </div>

        {statement && (
          <div className="relative rounded-2xl overflow-hidden" style={{ backgroundColor: SURFACE_2, border: `1px solid ${BORDER_STRONG}` }}>
            <div className="relative px-5 py-5 space-y-3">
              <div className="flex items-center gap-2">
                <Star size={13} style={{ color: AMBER }} fill={AMBER} />
                <p className="text-xs uppercase tracking-widest font-medium" style={{ color: AMBER }}>Current North Star</p>
              </div>
              {statement.who && (
                <p className="text-sm" style={{ color: TEXT }}>
                  <span className="font-medium" style={{ color: TEXT }}>For</span> {statement.who}
                </p>
              )}
              {statement.why && (
                <p className="text-sm" style={{ color: TEXT }}>
                  <span className="font-medium" style={{ color: TEXT }}>So that</span> {statement.why}
                </p>
              )}
              {statement.noFly && (
                <p className="text-sm italic pt-3" style={{ color: TEXT_2, borderTop: `1px solid ${BORDER}` }}>
                  No-fly: {statement.noFly}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium block" style={{ color: TEXT }}>What changed this season?</label>
          <textarea
            value={whatChanged}
            onChange={(e) => setWhatChanged(e.target.value)}
            placeholder="Projects started, ended, pivoted. Relationships, places, pace."
            rows={4}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none leading-relaxed transition-all"
            style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT, caretColor: TEXT }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium block" style={{ color: TEXT }}>How did your zones shift?</label>
          <textarea
            value={zonesShifted}
            onChange={(e) => setZonesShifted(e.target.value)}
            placeholder="Which zones got more or less attention than intended? Why?"
            rows={3}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none leading-relaxed transition-all"
            style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT, caretColor: TEXT }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium block" style={{ color: TEXT }}>Does your north star statement still fit?</label>
          <textarea
            value={statementReflection}
            onChange={(e) => setStatementReflection(e.target.value)}
            placeholder="What holds, what's shifted, what needs updating? (Update the statement itself in Settings)"
            rows={3}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none leading-relaxed transition-all"
            style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT, caretColor: TEXT }}
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full rounded-xl py-3 text-sm font-medium min-h-[44px] transition-colors"
          style={{ backgroundColor: AMBER, color: BG }}
        >
          {saved ? "Saved ✓" : "Save seasonal review"}
        </button>

        {seasonalReviews.length > 1 && (
          <div className="space-y-2">
            <h2 className="text-base" style={{ color: TEXT }}>Previous seasons</h2>
            {seasonalReviews.filter((r) => r.seasonKey !== seasonKey).slice(0, 6).map((r) => (
              <div key={r.seasonKey} className="rounded-xl p-4" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
                <p className="text-xs capitalize mb-1" style={{ color: TEXT_2 }}>{r.seasonKey.replace("-", " ")}</p>
                {r.whatChanged && <p className="text-sm leading-relaxed" style={{ color: TEXT }}>{r.whatChanged.slice(0, 100)}{r.whatChanged.length > 100 ? "…" : ""}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
