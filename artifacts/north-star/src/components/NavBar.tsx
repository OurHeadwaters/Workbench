import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Star, Grid3x3, Calendar, MoreHorizontal, BookOpen, ClipboardList, Coffee, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActiveZone, ZONE_SOLID } from "@/lib/zone";

const PRIMARY = [
  { path: "/", icon: Star, label: "Today", match: (p: string) => p === "/" },
  { path: "/zones", icon: Grid3x3, label: "Zones", match: (p: string) => p.startsWith("/zones") },
  { path: "/weekly", icon: Calendar, label: "Review", match: (p: string) => p.startsWith("/weekly") || p.startsWith("/seasonal") },
];

const MORE_ITEMS = [
  { path: "/guide", icon: BookOpen, label: "Guide" },
  { path: "/meeting-kit", icon: ClipboardList, label: "Kit" },
  { path: "/council", icon: Coffee, label: "Table" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function NavBar() {
  const [location] = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const activeZone = useActiveZone();
  const zoneColor = ZONE_SOLID[activeZone];

  const moreActive = MORE_ITEMS.some((m) => location.startsWith(m.path));

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom border-t border-[#E7E5E4] shadow-[0_-2px_12px_rgba(28,25,23,0.08)]"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="flex items-stretch max-w-lg mx-auto">
          {PRIMARY.map(({ path, icon: Icon, label, match }) => {
            const active = match(location);
            return (
              <Link
                key={path}
                href={path}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[60px] text-xs transition-all duration-200 relative",
                  active ? "font-semibold" : "text-[#78716C] hover:text-[#44403C]"
                )}
              >
                {active && (
                  <span
                    className="absolute inset-x-2 top-1.5 bottom-1.5 rounded-xl -z-10 transition-colors"
                    style={{ backgroundColor: `${zoneColor}1A` }}
                    aria-hidden
                  />
                )}
                <Icon
                  size={active ? 22 : 20}
                  strokeWidth={active ? 2.2 : 1.6}
                  style={active ? { color: zoneColor } : undefined}
                />
                <span style={active ? { color: zoneColor } : undefined}>{label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[60px] text-xs transition-all duration-200 relative",
              moreActive ? "font-semibold" : "text-[#78716C] hover:text-[#44403C]"
            )}
          >
            {moreActive && (
              <span
                className="absolute inset-x-2 top-1.5 bottom-1.5 rounded-xl -z-10"
                style={{ backgroundColor: `${zoneColor}1A` }}
                aria-hidden
              />
            )}
            <MoreHorizontal
              size={moreActive ? 22 : 20}
              strokeWidth={moreActive ? 2.2 : 1.6}
              style={moreActive ? { color: zoneColor } : undefined}
            />
            <span style={moreActive ? { color: zoneColor } : undefined}>More</span>
          </button>
        </div>
      </nav>

      {moreOpen && (
        <MoreSheet
          onClose={() => setMoreOpen(false)}
          zoneColor={zoneColor}
          location={location}
        />
      )}
    </>
  );
}

function MoreSheet({
  onClose,
  zoneColor,
  location,
}: {
  onClose: () => void;
  zoneColor: string;
  location: string;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/40"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="bg-white rounded-t-2xl max-w-lg mx-auto w-full shadow-xl pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-2.5 pb-1">
          <span className="block h-1.5 w-12 rounded-full bg-[#E7E5E4]" />
        </div>
        <div className="flex items-center justify-between px-5 py-2">
          <h3 className="text-base font-medium" style={{ fontFamily: "Fraunces, serif" }}>
            More
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F5F5F0] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-3 pb-2">
          {MORE_ITEMS.map(({ path, icon: Icon, label }) => {
            const active = location.startsWith(path);
            return (
              <Link
                key={path}
                href={path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl min-h-[56px] transition-colors",
                  active ? "bg-[#F5F0E8]" : "hover:bg-[#FAFAF9]"
                )}
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: active ? `${zoneColor}1A` : "#F5F5F0" }}
                >
                  <Icon size={18} style={{ color: active ? zoneColor : "#44403C" }} />
                </span>
                <span className="text-base text-[#1C1917]">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
