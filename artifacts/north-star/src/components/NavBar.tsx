import { Link, useLocation } from "wouter";
import { Star, Grid3x3, BookOpen, Settings, Calendar, Coffee, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { NeighbourhoodBadge } from "@workspace/zone-store";

const NAV = [
  { path: "/", icon: Star, label: "Today" },
  { path: "/zones", icon: Grid3x3, label: "Zones" },
  { path: "/guide", icon: BookOpen, label: "Guide" },
  { path: "/meeting-kit", icon: ClipboardList, label: "Kit" },
  { path: "/council", icon: Coffee, label: "Table" },
  { path: "/weekly", icon: Calendar, label: "Review" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function NavBar() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[#E7E5E4] z-50 safe-area-bottom shadow-[0_-1px_8px_rgba(28,25,23,0.06)]">
      <div className="flex items-center justify-center py-1 border-b border-[#E7E5E4]/60">
        <NeighbourhoodBadge zoneId={2} />
      </div>
      <div className="flex items-stretch max-w-lg mx-auto">
        {NAV.map(({ path, icon: Icon, label }) => {
          const active = path === "/" ? location === "/" : location.startsWith(path);
          return (
            <Link
              key={path}
              href={path}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[56px] text-xs transition-all duration-200 relative",
                active
                  ? "text-[#1C1917] font-semibold"
                  : "text-[#78716C] hover:text-[#44403C]"
              )}
            >
              {active && (
                <span
                  className="absolute inset-x-2 top-1.5 bottom-1.5 rounded-xl bg-[#F5F0E8] -z-10"
                  aria-hidden
                />
              )}
              <span className={cn(
                "flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200",
                active && "drop-shadow-[0_1px_3px_rgba(180,83,9,0.18)]"
              )}>
                <Icon
                  size={active ? 21 : 20}
                  strokeWidth={active ? 2.2 : 1.5}
                  className={active ? "text-[#1C1917]" : ""}
                />
              </span>
              <span className={cn("leading-none", active ? "text-[#1C1917]" : "")}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
