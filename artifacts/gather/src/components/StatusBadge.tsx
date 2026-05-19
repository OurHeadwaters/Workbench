import type { StandbyStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<StandbyStatus, { label: string; classes: string; dot: string }> = {
  everyday: {
    label: "Everyday",
    classes: "bg-[#E4D9CC] text-[#4A3F38]",
    dot: "bg-[#7A6B60]",
  },
  headsup: {
    label: "Heads Up",
    classes: "bg-[#FFF0D6] text-[#7A4A00]",
    dot: "bg-[#C7913B]",
  },
  standby: {
    label: "Standby",
    classes: "bg-[#FFF0D6] text-[#7A4A00] border border-[#C7913B]",
    dot: "bg-[#C7613B] animate-pulse",
  },
};

export function StatusBadge({ status }: { status: StandbyStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium", config.classes)}>
      <span className={cn("w-2 h-2 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
