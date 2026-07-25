import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Inbox, CheckSquare, Zap, Lock, MoreHorizontal, X, Sunrise, Map, Sprout, Star, Package, BookOpen, Settings, Target } from "lucide-react";
import { lockKitchenTable, isKitchenTableUnlocked } from "@/lib/lock";
import { BG, SURFACE, BORDER, BORDER_STRONG, TEXT, TEXT_2, AMBER, FONT_DISPLAY } from "@/lib/theme";

const TABS = [
  {
    path: "/sprint",
    icon: Target,
    label: "Sprint",
    match: (p: string) => p.startsWith("/sprint"),
    amber: true,
  },
  {
    path: "/",
    icon: Inbox,
    label: "Inbox",
    match: (p: string) => p === "/" || p === "",
    amber: false,
  },
  {
    path: "/this-week",
    icon: CheckSquare,
    label: "This Week",
    match: (p: string) => p.startsWith("/this-week"),
    amber: false,
  },
  {
    path: "/table",
    icon: Zap,
    label: "Table",
    match: (p: string) => p.startsWith("/table") || p.startsWith("/kitchen-table") || p.startsWith("/old-table"),
    amber: false,
  },
];

const MORE_LINKS = [
  { path: "/today", icon: Sunrise, label: "Today", desc: "Morning triage, pick, log hours" },
  { path: "/zones", icon: Map, label: "Zones", desc: "Constellations & contracts by zone" },
  { path: "/money-machine", icon: Sprout, label: "Money Machine", desc: "The four-bucket flow" },
  { path: "/vision-board", icon: Star, label: "Vision Board", desc: "18-month success picture" },
  { path: "/kits", icon: Package, label: "Kits", desc: "The five sellable kits" },
  { path: "/guide", icon: BookOpen, label: "Guide", desc: "How North Star works" },
  { path: "/settings", icon: Settings, label: "Settings", desc: "Statement, backup, inbox setup" },
];

const NAV_BG   = BG;
const ACTIVE   = TEXT;
const INACTIVE = TEXT_2;

function MoreSheet({ onClose }: { onClose: () => void }) {
  const [location] = useLocation();
  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="rounded-t-2xl pb-safe-bottom max-h-[80dvh] overflow-y-auto"
        style={{ backgroundColor: SURFACE, borderTop: `1px solid ${BORDER_STRONG}` }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-lg" style={{ color: TEXT, fontFamily: FONT_DISPLAY, fontWeight: 600 }}>
            More
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full"
            style={{ color: INACTIVE }}
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-3 pb-4 space-y-1">
          {MORE_LINKS.map(({ path, icon: Icon, label, desc }) => {
            const active = location.startsWith(path);
            return (
              <Link
                key={path}
                href={path}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-3 py-3 min-h-[56px] transition-colors"
                style={{ backgroundColor: active ? "rgba(200,146,58,0.10)" : "transparent" }}
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: active ? "rgba(200,146,58,0.18)" : "rgba(237,232,213,0.06)" }}
                >
                  <Icon size={17} style={{ color: active ? AMBER : TEXT }} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium" style={{ color: TEXT }}>{label}</p>
                  <p className="text-xs truncate" style={{ color: INACTIVE }}>{desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function NavBar() {
  const [location] = useLocation();
  const unlocked = isKitchenTableUnlocked();
  const [moreOpen, setMoreOpen] = useState(false);

  const inMore = MORE_LINKS.some((l) => location.startsWith(l.path));

  return (
    <>
      {moreOpen && <MoreSheet onClose={() => setMoreOpen(false)} />}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          backgroundColor: NAV_BG,
          borderTop: `1px solid ${BORDER}`,
          boxShadow: "0 -4px 24px rgba(0,0,0,0.7)",
        }}
      >
        <div className="flex items-stretch max-w-xl mx-auto">
          {TABS.map(({ path, icon: Icon, label, match, amber: isAmber }) => {
            const active = match(location);
            const color = active
              ? (isAmber ? AMBER : ACTIVE)
              : (isAmber ? "rgba(200,146,58,0.55)" : INACTIVE);
            return (
              <Link
                key={path}
                href={path}
                className="flex-1 flex flex-col items-center justify-center gap-1 min-h-[64px] text-xs transition-all duration-150 relative"
                style={{ color }}
              >
                {active && (
                  <span
                    className="absolute left-3 right-3 top-2 bottom-2 rounded-xl -z-10"
                    style={{ backgroundColor: isAmber ? "rgba(200,146,58,0.10)" : "rgba(237,232,213,0.07)" }}
                    aria-hidden
                  />
                )}
                <Icon
                  size={active ? 22 : 20}
                  strokeWidth={active ? 2.2 : 1.5}
                />
                <span
                  className="text-[11px] tracking-wide"
                  style={{ fontWeight: active ? 600 : 400 }}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setMoreOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-1 min-h-[64px] text-xs transition-all duration-150 relative"
            style={{ color: inMore ? ACTIVE : INACTIVE }}
          >
            {inMore && (
              <span
                className="absolute left-3 right-3 top-2 bottom-2 rounded-xl -z-10"
                style={{ backgroundColor: "rgba(237,232,213,0.07)" }}
                aria-hidden
              />
            )}
            <MoreHorizontal size={inMore ? 22 : 20} strokeWidth={inMore ? 2.2 : 1.5} />
            <span className="text-[11px] tracking-wide" style={{ fontWeight: inMore ? 600 : 400 }}>
              More
            </span>
          </button>

          {unlocked && (
            <button
              onClick={lockKitchenTable}
              aria-label="Lock"
              className="flex flex-col items-center justify-center gap-1 min-h-[64px] px-4 text-xs transition-all duration-150"
              style={{ color: INACTIVE }}
            >
              <Lock size={18} strokeWidth={1.5} />
              <span className="text-[11px] tracking-wide">Lock</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
