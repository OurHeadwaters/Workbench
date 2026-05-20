import { ZONE_CLASSES, ZONE_LABELS } from "@/lib/utils";
import type { ZoneId } from "@/types";
import { cn } from "@/lib/utils";

export function ZoneBadge({ zone, className }: { zone: ZoneId; className?: string }) {
  const cls = ZONE_CLASSES[zone];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        cls.bg,
        cls.text,
        className
      )}
    >
      {ZONE_LABELS[zone].short} — {ZONE_LABELS[zone].long}
    </span>
  );
}

export function ZoneDot({ zone, className }: { zone: ZoneId; className?: string }) {
  const cls = ZONE_CLASSES[zone];
  return (
    <span
      className={cn("inline-block w-2 h-2 rounded-full flex-shrink-0", cls.bg, className)}
      style={{ backgroundColor: `hsl(var(--color-${zone.toLowerCase().replace("z", "z")}))` }}
    />
  );
}
