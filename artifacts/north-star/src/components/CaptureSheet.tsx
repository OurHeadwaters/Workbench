import { useEffect, useRef, useState } from "react";
import { X, Mic, HandHelping } from "lucide-react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import { useActiveZone, ZONE_SOLID } from "@/lib/zone";
import type { ZoneId } from "@/types";

interface CaptureSheetProps {
  onClose: () => void;
}

const ZONES: ZoneId[] = ["Z0", "Z1", "Z2", "Z3", "Z4", "Z5"];

type Destination = "zone" | "helping-hands";

export function CaptureSheet({ onClose }: CaptureSheetProps) {
  const addCapture = useStore((s) => s.addCapture);
  const addHelpingHandsTask = useStore((s) => s.addHelpingHandsTask);
  const active = useActiveZone();
  const [text, setText] = useState("");
  const [tag, setTag] = useState<ZoneId>(active);
  const [destination, setDestination] = useState<Destination>("zone");
  const [saved, setSaved] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSave() {
    if (!text.trim()) return;
    if (destination === "helping-hands") {
      addHelpingHandsTask({ title: text.trim() });
    } else {
      addCapture({ text: text.trim() });
    }
    setSaved(true);
    setTimeout(onClose, 500);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave();
  }

  function onTouchStart(e: React.TouchEvent) {
    dragStart.current = e.touches[0].clientY;
  }
  function onTouchMove(e: React.TouchEvent) {
    if (dragStart.current === null) return;
    const dy = e.touches[0].clientY - dragStart.current;
    if (dy > 0) setDragY(dy);
  }
  function onTouchEnd() {
    if (dragY > 80) onClose();
    setDragY(0);
    dragStart.current = null;
  }

  const zoneColor = ZONE_SOLID[tag];
  const isHH = destination === "helping-hands";
  const accentColor = isHH ? "#C8923A" : zoneColor;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/40"
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        className="bg-[#141210] rounded-t-2xl pb-8 max-w-lg mx-auto w-full shadow-xl"
        style={{ transform: `translateY(${dragY}px)`, transition: dragY === 0 ? "transform .2s" : "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex justify-center pt-2.5 pb-1 cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <span className="block h-1.5 w-12 rounded-full bg-[rgba(237,232,213,0.15)]" />
        </div>
        <div className="flex items-center justify-between px-4 pb-3">
          <h3 className="text-base font-medium" style={{ fontFamily: "Fraunces, serif" }}>
            Quick capture
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[rgba(237,232,213,0.08)] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Destination toggle */}
        <div className="px-4 mb-3">
          <div
            className="flex rounded-xl overflow-hidden border"
            style={{ borderColor: "rgba(237,232,213,0.12)" }}
          >
            <button
              onClick={() => setDestination("zone")}
              className={cn(
                "flex-1 py-2 text-xs font-medium transition-colors",
                !isHH
                  ? "text-[#EDE8D5]"
                  : "text-[rgba(237,232,213,0.45)] hover:text-[rgba(237,232,213,0.7)]"
              )}
              style={{
                backgroundColor: !isHH ? "rgba(237,232,213,0.08)" : "transparent",
              }}
            >
              My zones
            </button>
            <button
              onClick={() => setDestination("helping-hands")}
              className={cn(
                "flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors",
                isHH
                  ? "text-[#C8923A]"
                  : "text-[rgba(237,232,213,0.45)] hover:text-[rgba(237,232,213,0.7)]"
              )}
              style={{
                backgroundColor: isHH ? "rgba(200,146,58,0.10)" : "transparent",
              }}
            >
              <HandHelping size={12} />
              Helping Hands
            </button>
          </div>
        </div>

        <div className="px-4">
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isHH ? "What needs doing in the community?" : "What's on your mind?"}
            rows={4}
            className="w-full border border-[rgba(237,232,213,0.1)] rounded-xl p-3 text-base resize-none focus:outline-none focus:ring-2 bg-[#1A1714] leading-relaxed"
            style={{ ["--tw-ring-color" as string]: `${accentColor}55` }}
          />

          {!isHH && (
            <div className="mt-3">
              <p className="text-xs text-[rgba(237,232,213,0.55)] mb-2">Tag to zone</p>
              <div className="flex flex-wrap gap-1.5">
                {ZONES.map((z) => {
                  const selected = tag === z;
                  const c = ZONE_SOLID[z];
                  return (
                    <button
                      key={z}
                      onClick={() => setTag(z)}
                      className="px-3 py-1.5 rounded-full text-xs border min-h-[36px] transition-all"
                      style={{
                        borderColor: selected ? c : "rgba(237,232,213,0.15)",
                        backgroundColor: selected ? `${c}1A` : "white",
                        color: selected ? c : "rgba(237,232,213,0.55)",
                        fontWeight: selected ? 600 : 400,
                      }}
                    >
                      {z}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isHH && (
            <p className="mt-2 text-xs" style={{ color: "rgba(237,232,213,0.45)" }}>
              This will be posted to the Helping Hands board as an open task.
            </p>
          )}

          <div className="flex items-center justify-between mt-4 gap-2">
            <div className="flex items-center gap-1 text-xs text-[rgba(237,232,213,0.55)]">
              <Mic size={14} />
              <span>Voice — soon</span>
            </div>
            <button
              onClick={handleSave}
              disabled={!text.trim() || saved}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-medium min-h-[44px] transition-colors text-white",
                !text.trim() || saved ? "opacity-50 cursor-not-allowed" : ""
              )}
              style={{ backgroundColor: text.trim() && !saved ? accentColor : "#B5AFA9" }}
            >
              {saved
                ? isHH ? "Posted ✓" : "Saved ✓"
                : isHH ? "Post task" : "Save"}
            </button>
          </div>
          <p className="text-xs text-[#B5AFA9] mt-2">⌘↵ save · swipe down · Esc to close</p>
        </div>
      </div>
    </div>
  );
}
