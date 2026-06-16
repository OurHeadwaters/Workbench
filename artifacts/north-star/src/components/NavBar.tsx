import { Link, useLocation } from "wouter";
import { Inbox, CheckSquare, Zap } from "lucide-react";

const TABS = [
  {
    path: "/",
    icon: Inbox,
    label: "Inbox",
    match: (p: string) => p === "/" || p === "",
  },
  {
    path: "/this-week",
    icon: CheckSquare,
    label: "This Week",
    match: (p: string) => p.startsWith("/this-week"),
  },
  {
    path: "/table",
    icon: Zap,
    label: "Table",
    match: (p: string) => p.startsWith("/table"),
  },
];

const NAV_BG   = "#0B0905";
const ACTIVE   = "#EDE8D5";
const INACTIVE = "rgba(237,232,213,0.38)";

export function NavBar() {
  const [location] = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        backgroundColor: NAV_BG,
        borderTop: "1px solid rgba(237,232,213,0.10)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.7)",
      }}
    >
      <div className="flex items-stretch max-w-xl mx-auto">
        {TABS.map(({ path, icon: Icon, label, match }) => {
          const active = match(location);
          return (
            <Link
              key={path}
              href={path}
              className="flex-1 flex flex-col items-center justify-center gap-1 min-h-[64px] text-xs transition-all duration-150 relative"
              style={{ color: active ? ACTIVE : INACTIVE }}
            >
              {active && (
                <span
                  className="absolute left-3 right-3 top-2 bottom-2 rounded-xl -z-10"
                  style={{ backgroundColor: "rgba(237,232,213,0.07)" }}
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
      </div>
    </nav>
  );
}
