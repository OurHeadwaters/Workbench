import { useState } from "react";
import { X, ExternalLink, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrailSign } from "@workspace/odyssey";

const COST_LABEL: Record<string, string> = {
  free: "Free",
  "$": "Low cost",
  "$$": "Mid-range",
  "$$$": "Premium",
};

interface TrailSignCardProps {
  sign: TrailSign;
  onDismiss: (id: string) => void;
}

export function TrailSignCard({ sign, onDismiss }: TrailSignCardProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  function handleDismiss() {
    setDismissed(true);
    onDismiss(sign.id);
  }

  return (
    <div className="rounded-xl border border-[#D6CFC3] bg-[#F9F6F0] px-4 py-3 space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin size={12} className="text-[#92785A] shrink-0 mt-0.5" />
          <span className="text-[10px] uppercase tracking-widest text-[#92785A] font-medium">
            Trail sign
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-[#B8A89A] hover:text-[#78716C] transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center -mr-1 -mt-1"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>

      <div>
        <p className="text-xs text-[#78716C] leading-relaxed">{sign.problemStatement}</p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#1C1917] truncate">{sign.toolName}</p>
          <p className="text-xs text-[#A8998A]">{COST_LABEL[sign.costTier] ?? sign.costTier}</p>
        </div>
        <a
          href={sign.actionUrl}
          className={cn(
            "shrink-0 flex items-center gap-1 bg-[#1C1917] text-white",
            "rounded-lg px-3 py-1.5 text-xs font-medium min-h-[36px]",
            "hover:bg-[#292524] transition-colors",
          )}
        >
          {sign.actionLabel}
          <ExternalLink size={10} />
        </a>
      </div>

      {sign.communityProof && (
        <p className="text-[10px] text-[#A8998A] border-t border-[#E8DED2] pt-2 leading-relaxed">
          {sign.communityProof}
        </p>
      )}
    </div>
  );
}

interface OdysseyTrailProps {
  signs: TrailSign[];
  onAllDismissed?: () => void;
}

export function OdysseyTrail({ signs, onAllDismissed }: OdysseyTrailProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = signs.filter((s) => !dismissed.has(s.id));
  if (visible.length === 0) return null;

  function handleDismiss(id: string) {
    const next = new Set([...dismissed, id]);
    setDismissed(next);
    const remaining = signs.filter((s) => !next.has(s.id));
    if (remaining.length === 0) {
      onAllDismissed?.();
    }
  }

  const [shown] = visible;

  return (
    <TrailSignCard
      sign={shown}
      onDismiss={handleDismiss}
    />
  );
}
