import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Star, Briefcase, BarChart2, BookOpen, Grid3x3, Calendar, Coffee, Settings, Globe, X, Trees } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActiveZone, ZONE_SOLID } from "@/lib/zone";

const PRIMARY = [
  { path: "/",        icon: Coffee,    label: "Table",   match: (p: string) => p === "/" },
  { path: "/cockpit", icon: Briefcase, label: "Cockpit", match: (p: string) => p.startsWith("/cockpit") || p.startsWith("/debrief") },
  { path: "/model",   icon: BarChart2, label: "Model",   match: (p: string) => p.startsWith("/model") },
  { path: "/zones",   icon: Grid3x3,   label: "Zones",   match: (p: string) => p.startsWith("/zones") },
];

const MORE_ITEMS = [
  { path: "/today",   icon: Star,      label: "Today" },
  { path: "/guide",   icon: BookOpen,  label: "Guide" },
  { path: "/weekly",  icon: Calendar,  label: "Review" },
  { path: "/land",    icon: Trees,     label: "Land" },
  { path: "/window",  icon: Globe,     label: "Window" },
  { path: "/settings",icon: Settings,  label: "Settings" },
];

const NAV_BG   = "#0D0A06";
const INACTIVE = "rgba(237,232,213,0.38)";
const HOVER    = "rgba(237,232,213,0.60)";

export function NavBar() {
  const [location] = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const activeZone = useActiveZone();
  const zoneColor = ZONE_SOLID[activeZone];

  const moreActive = MORE_ITEMS.some((m) => location.startsWith(m.path));

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
        style={{
          backgroundColor: NAV_BG,
          borderTop: "1px solid rgba(237,232,213,0.08)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex items-stretch max-w-lg mx-auto">
          {PRIMARY.map(({ path, icon: Icon, label, match }) => {
            const active = match(location);
            return (
              <Link
                key={path}
                href={path}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[60px] text-xs transition-all duration-200 relative"
                )}
                style={{ color: active ? zoneColor : INACTIVE }}
              >
                {active && (
                  <span
                    className="absolute inset-x-2 top-1.5 bottom-1.5 rounded-xl -z-10 transition-colors"
                    style={{ backgroundColor: `${zoneColor}18` }}
                    aria-hidden
                  />
                )}
                <Icon
                  size={active ? 22 : 20}
                  strokeWidth={active ? 2.2 : 1.6}
                />
                <span className={active ? "font-semibold" : ""}>{label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[60px] text-xs transition-all duration-200 relative"
            style={{ color: moreActive ? zoneColor : INACTIVE }}
          >
            {moreActive && (
              <span
                className="absolute inset-x-2 top-1.5 bottom-1.5 rounded-xl -z-10"
                style={{ backgroundColor: `${zoneColor}18` }}
                aria-hidden
              />
            )}
            <Grid3x3
              size={moreActive ? 22 : 20}
              strokeWidth={moreActive ? 2.2 : 1.6}
            />
            <span className={moreActive ? "font-semibold" : ""}>More</span>
          </button>
        </div>
      </nav>

      {moreOpen && (
        <MoreSheet onClose={() => setMoreOpen(false)} zoneColor={zoneColor} location={location} />
      )}
    </>
  );
}

function MoreSheet({ onClose, zoneColor, location }: { onClose: () => void; zoneColor: string; location: string }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col justify-end"
      style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="rounded-t-2xl max-w-lg mx-auto w-full shadow-2xl pb-8"
        style={{ backgroundColor: "#130F08", border: "1px solid rgba(237,232,213,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-2.5 pb-1">
          <span className="block h-1.5 w-12 rounded-full" style={{ backgroundColor: "rgba(237,232,213,0.15)" }} />
        </div>
        <div className="flex items-center justify-between px-5 py-2">
          <h3 className="text-base font-semibold" style={{ fontFamily: "Fraunces, serif", color: "#ede8d5" }}>More</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
            style={{ color: INACTIVE }}
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
                className="flex items-center gap-3 px-3 py-3 rounded-xl min-h-[56px] transition-colors"
                style={{
                  backgroundColor: active ? `${zoneColor}18` : "transparent",
                }}
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: active ? `${zoneColor}28` : "rgba(237,232,213,0.07)" }}
                >
                  <Icon size={18} style={{ color: active ? zoneColor : HOVER }} />
                </span>
                <span className="text-base" style={{ color: active ? zoneColor : "#ede8d5" }}>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
