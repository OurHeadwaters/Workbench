import { useState } from "react";
import { Plus } from "lucide-react";
import { CaptureSheet } from "@/components/CaptureSheet";
import { useActiveZone, ZONE_SOLID } from "@/lib/zone";

export function CaptureFab() {
  const [open, setOpen] = useState(false);
  const active = useActiveZone();
  const color = ZONE_SOLID[active];
  return (
    <>
      <button
        type="button"
        aria-label="Quick capture"
        onClick={() => setOpen(true)}
        className="fixed right-4 z-40 w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center transition-transform active:scale-95"
        style={{
          backgroundColor: color,
          bottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
          boxShadow: `0 6px 20px ${color}55`,
        }}
      >
        <Plus size={26} strokeWidth={2.2} />
      </button>
      {open && <CaptureSheet onClose={() => setOpen(false)} />}
    </>
  );
}
