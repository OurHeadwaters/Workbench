import { Link, useLocation } from "wouter";
import { Star, Grid3x3, BookOpen, Settings, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { NeighbourhoodBadge } from "@/components/NeighbourhoodBadge";

const NAV = [
  { path: "/", icon: Star, label: "Today" },
  { path: "/zones", icon: Grid3x3, label: "Zones" },
  { path: "/guide", icon: BookOpen, label: "Guide" },
  { path: "/weekly", icon: Calendar, label: "Review" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function NavBar() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E7E5E4] z-50 safe-area-bottom">
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
                "flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[56px] text-xs transition-colors",
                active
                  ? "text-[#1C1917] font-medium"
                  : "text-[#78716C]"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2 : 1.5} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
