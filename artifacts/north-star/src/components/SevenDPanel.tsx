import { useState } from "react";
import { cn } from "@/lib/utils";
import { SEVEN_DIMENSIONS, type SevenDMode } from "@/pages/kitchenTable7D";

interface SevenGenPanelState {
  status: "loading" | "done" | "error";
  content: string;
  open: boolean;
}

interface SevenDPanelProps {
  mode: SevenDMode;
  onModeChange: (m: SevenDMode) => void;
  onClose: () => void;
  onFireSevenGen: (itemQ: string, question: string) => void;
  onGordTestPassed: (note: string) => void;
  sevenGenResult: SevenGenPanelState | undefined;
  sessionTitle?: string;
}

export function SevenDPanel({
  mode,
  onModeChange,
  onClose,
  onFireSevenGen,
  onGordTestPassed,
  sevenGenResult,
  sessionTitle = "Kitchen Table",
}: SevenDPanelProps) {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [gordStamped, setGordStamped] = useState(false);

  const toggle = (id: string) =>
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));

  const checkedCount = Object.values(checks).filter(Boolean).length;
  const isCompact = mode === "sounding";
  const isWorking = mode === "working";
  const isReview = mode === "review";

  const handleGordTest = () => {
    const today = new Date().toLocaleDateString("en-CA");
    const note = `[7D] Gord Test passed at the Kitchen Table — ${today}. ${checkedCount}/7 dimensions acknowledged.`;
    onGordTestPassed(note);
    setGordStamped(true);
    setTimeout(() => setGordStamped(false), 3000);
  };

  const futureQ = "7d-future";

  return (
    <>
      {/* Print CSS: visibility approach so nested elements still render */}
      <style>{`
        @media print {
          * { visibility: hidden !important; }
          #seven-d-print, #seven-d-print * { visibility: visible !important; }
          #seven-d-print {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: auto;
            background: white;
            color: black;
            padding: 32px;
            z-index: 9999;
          }
        }
      `}</style>

      <div
        id="seven-d-print"
        className="absolute inset-y-0 right-0 z-30 flex flex-col w-full sm:w-[400px] shadow-[-20px_0_60px_rgba(0,0,0,0.6)]"
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3 bg-[#0F1A13] border-b border-[#1E2A1A] border-l border-l-[#1E2A1A]">
          <span className="text-[14px]">🌳</span>
          <span className="text-[12px] uppercase tracking-[0.18em] text-[#7EB89A] font-bold flex-1">
            7D Filter
          </span>
          <span className="text-[10px] text-[#4A6B5A]">
            {checkedCount}/7
          </span>
          <button
            onClick={onClose}
            className="text-[#5C5046] hover:text-[#8C7B6D] text-xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Mode switcher */}
        <div className="flex-shrink-0 flex border-b border-[#1E2A1A] bg-[#0F1A13]">
          {(["sounding", "working", "review"] as const).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={cn(
                "flex-1 py-2.5 text-[10px] uppercase tracking-[0.12em] font-medium transition-colors border-b-2",
                mode === m
                  ? "text-[#A8CFBB] border-[#4A8A6A] bg-[#131F18]"
                  : "text-[#3D5A47] border-transparent hover:text-[#6B9A80] hover:bg-[#131F18]"
              )}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Print header */}
        <div className="hidden print:block px-6 pt-6 pb-2">
          <h1 className="text-xl font-bold">7D Filter Checklist</h1>
          <p className="text-sm text-gray-600 mt-1">
            {sessionTitle} · {new Date().toLocaleDateString("en-CA")} · Mode:{" "}
            {mode}
          </p>
          <hr className="mt-3 border-gray-300" />
        </div>

        {/* Dimension list */}
        <div className="flex-1 overflow-y-auto bg-[#0C1710] border-l border-[#1E2A1A]">
          <div className={cn("p-4", isCompact ? "space-y-2" : "space-y-3")}>
            {SEVEN_DIMENSIONS.map((dim) => {
              const isChecked = checks[dim.id] ?? false;
              const isFuture = dim.id === "future";

              return (
                <div
                  key={dim.id}
                  className={cn(
                    "rounded-sm border transition-colors",
                    isChecked
                      ? "border-[#2A4A35] bg-[#0F1E16]"
                      : "border-[#1A2B20] bg-[#0F1A13]",
                    isCompact ? "p-2.5" : "p-3.5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div
                      onClick={() => toggle(dim.id)}
                      className={cn(
                        "flex-shrink-0 mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center cursor-pointer transition-all",
                        isChecked
                          ? "bg-[#2D6A4F] border-[#2D6A4F]"
                          : "border-[#2A3D2F] hover:border-[#4A6B55]"
                      )}
                    >
                      {isChecked && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="#EAE4DB"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Dimension name row */}
                      <div className="flex items-center gap-2">
                        <span className={isCompact ? "text-[13px]" : "text-[14px]"}>
                          {dim.symbol}
                        </span>
                        <span
                          className={cn(
                            "font-medium",
                            isCompact
                              ? "text-[12px] text-[#8CB8A0]"
                              : "text-[13px] text-[#A8CFBB]",
                            isChecked && "line-through opacity-60"
                          )}
                        >
                          {dim.name}
                        </span>
                        {!isCompact && (
                          <span className="text-[9px] text-[#3D5A47] uppercase tracking-[0.1em]">
                            {dim.leadSeat}
                          </span>
                        )}
                      </div>

                      {/* Prompt — compact in sounding, full otherwise */}
                      <p
                        className={cn(
                          "leading-relaxed mt-1",
                          isCompact
                            ? "text-[11px] text-[#4A6B55] line-clamp-2"
                            : "text-[12px] text-[#6B9A80]"
                        )}
                      >
                        {dim.prompt}
                      </p>

                      {/* Check question */}
                      <p
                        className={cn(
                          "leading-relaxed mt-0.5",
                          isCompact
                            ? "text-[10px] text-[#3A5240]"
                            : "text-[11px] text-[#4A6B55]"
                        )}
                      >
                        ✓ {dim.check}
                      </p>

                      {/* Gord variant */}
                      {dim.gord && (
                        <p
                          className={cn(
                            "italic mt-0.5",
                            isCompact
                              ? "text-[10px] text-[#8A6A30]"
                              : "text-[11px] text-[#B5924A]"
                          )}
                        >
                          Gord: {dim.gord}
                        </p>
                      )}

                      {/* Notes textarea — working mode only */}
                      {isWorking && (
                        <textarea
                          value={notes[dim.id] ?? ""}
                          onChange={(e) =>
                            setNotes((prev) => ({
                              ...prev,
                              [dim.id]: e.target.value,
                            }))
                          }
                          placeholder="Notes…"
                          rows={2}
                          className="mt-2 w-full bg-[#0A1410] border border-[#1A2B20] rounded-sm px-2.5 py-2 text-[12px] text-[#A8CFBB] placeholder:text-[#2A3D2F] outline-none focus:border-[#2D6A4F] resize-none transition-colors"
                        />
                      )}

                      {/* Future dimension — seven-gen overlay in review mode */}
                      {isFuture && isReview && (
                        <div className="mt-3">
                          {sevenGenResult?.open ? (
                            <div className="rounded-sm border border-[#2A4A35] bg-[#0C1B14] overflow-hidden">
                              <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#1E3528]">
                                <span className="text-[9px] uppercase tracking-[0.15em] text-[#4A6B5A] font-medium">
                                  🐋 Ishmael — seven-generation lens
                                </span>
                              </div>
                              <div className="px-3 py-2.5 max-h-36 overflow-y-auto">
                                {sevenGenResult.status === "loading" &&
                                  sevenGenResult.content === "" ? (
                                  <p className="text-[11px] text-[#4A6B5A] animate-pulse">
                                    Ishmael is reading the question…
                                  </p>
                                ) : (
                                  <p className="text-[12px] text-[#A8BFB0] leading-relaxed whitespace-pre-wrap">
                                    {sevenGenResult.content}
                                  </p>
                                )}
                                {sevenGenResult.status === "loading" &&
                                  sevenGenResult.content !== "" && (
                                    <span className="inline-block w-1 h-3 bg-[#4A6B5A] ml-0.5 animate-pulse rounded-sm" />
                                  )}
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => onFireSevenGen(futureQ, dim.prompt)}
                              className={cn(
                                "text-[11px] border px-3 py-1.5 rounded-sm tracking-wide transition-all",
                                sevenGenResult?.status === "loading"
                                  ? "text-[#4A6B5A] border-[#2A3D30] cursor-wait"
                                  : "text-[#5A9A78] border-[#2A4A35] hover:bg-[#0F1E16] hover:border-[#3D6B50]"
                              )}
                              disabled={sevenGenResult?.status === "loading"}
                            >
                              🐋 Run Ishmael seven-gen test
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Print notes output */}
                  {notes[dim.id] && (
                    <p className="hidden print:block text-xs text-gray-700 mt-1 italic pl-7">
                      {notes[dim.id]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Gord Test footer */}
        <div className="flex-shrink-0 border-t border-[#1E2A1A] bg-[#0F1A13] px-4 py-3 border-l border-l-[#1E2A1A]">
          <div className="text-[10px] text-[#3D5A47] uppercase tracking-[0.12em] mb-2">
            Gord Test
          </div>
          <button
            onClick={handleGordTest}
            className={cn(
              "w-full py-3 rounded-sm text-[12px] font-medium tracking-wide transition-all border",
              gordStamped
                ? "bg-[#1A3A28] border-[#2D6A4F] text-[#7EB89A]"
                : "bg-[#1A2B1E] border-[#2A4035] text-[#B5924A] hover:bg-[#1F3523] hover:border-[#3A5A40] hover:text-[#D4A85A]"
            )}
          >
            {gordStamped
              ? "✓ Gord Test passed — stamped"
              : "Does this pass the Gord Test at this kitchen table?"}
          </button>

          {/* Print sign-off — visible only in print */}
          <div className="hidden print:block mt-2">
            <p className="text-sm font-medium">
              Does this pass the Gord Test at this kitchen table?
            </p>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-gray-400" />
                <span className="text-xs">Yes — passed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-gray-400" />
                <span className="text-xs">Not yet — needs more work</span>
              </div>
            </div>
            <div className="mt-4 border-t border-gray-300 pt-3">
              <p className="text-xs text-gray-500">
                Signed: ___________________________ Date: _______________
              </p>
            </div>
          </div>
        </div>

        {/* Print button */}
        <div className="flex-shrink-0 border-t border-[#1A2B1A] bg-[#0F1A13] px-4 py-2 border-l border-l-[#1E2A1A]">
          <button
            onClick={() => window.print()}
            className="w-full py-2 text-[10px] uppercase tracking-[0.15em] text-[#3D5A47] hover:text-[#6B9A80] transition-colors font-medium"
          >
            ↧ Print one-page checklist
          </button>
        </div>
      </div>
    </>
  );
}
