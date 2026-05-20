import { useState, useRef } from "react";
import { X, Mic, Type } from "lucide-react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

interface CaptureSheetProps {
  onClose: () => void;
}

export function CaptureSheet({ onClose }: CaptureSheetProps) {
  const addCapture = useStore((s) => s.addCapture);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSave() {
    if (!text.trim()) return;
    addCapture({ text: text.trim() });
    setSaved(true);
    setTimeout(onClose, 600);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave();
    if (e.key === "Escape") onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl p-4 pb-8 max-w-lg mx-auto w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium" style={{ fontFamily: "Fraunces, serif" }}>
            Quick capture
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#F5F5F0] min-h-[44px] min-w-[44px] flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind?"
          rows={4}
          className="w-full border border-[#E7E5E4] rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1C1917] bg-[#FAFAF9]"
        />

        <div className="flex items-center justify-between mt-3 gap-2">
          <div className="flex items-center gap-1 text-xs text-[#78716C]">
            <Mic size={14} />
            <span>Voice recording — coming soon</span>
          </div>
          <button
            onClick={handleSave}
            disabled={!text.trim() || saved}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] transition-colors",
              text.trim() && !saved
                ? "bg-[#1C1917] text-white"
                : "bg-[#E7E5E4] text-[#78716C] cursor-not-allowed"
            )}
          >
            {saved ? "Saved ✓" : "Save"}
          </button>
        </div>
        <p className="text-xs text-[#78716C] mt-2">⌘↵ to save · Esc to close</p>
      </div>
    </div>
  );
}
