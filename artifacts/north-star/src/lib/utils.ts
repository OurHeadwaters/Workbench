import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ZoneId } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ZONE_LABELS: Record<ZoneId, { short: string; long: string; desc: string }> = {
  Z1: { short: "Z1", long: "Household / Afloat", desc: "Income-generating work. The floor that keeps the lights on." },
  Z2: { short: "Z2", long: "Circle / Paid Contract", desc: "Paid contracted work with a deadline and a deliverable." },
  Z3: { short: "Z3", long: "Home Range / Build now", desc: "Active projects being built toward future value." },
  Z4: { short: "Z4", long: "Community / Passion", desc: "Volunteer or community work. No immediate return." },
};

export const ZONE_CLASSES: Record<ZoneId, { bg: string; text: string; border: string }> = {
  Z1: { bg: "bg-[#D1E7DB]", text: "text-[#4F6E5C]", border: "border-[#4F6E5C]" },
  Z2: { bg: "bg-[#DBEAFE]", text: "text-[#3B5998]", border: "border-[#3B5998]" },
  Z3: { bg: "bg-[#EDE9FE]", text: "text-[#7C4E8A]", border: "border-[#7C4E8A]" },
  Z4: { bg: "bg-[#FEF3C7]", text: "text-[#B45309]", border: "border-[#B45309]" },
};
