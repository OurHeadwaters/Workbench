import { useLocation } from "wouter";
import { Home, AlertTriangle, Shield, Users, Sprout } from "lucide-react";
import { clsx } from "clsx";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface NavBarProps {
  isOrganizer: boolean;
}

const links = [
  { href: "/", label: "Board", Icon: Home },
  { href: "/heads-up", label: "Heads Up", Icon: AlertTriangle },
  { href: "/standby", label: "Standby", Icon: Shield },
  { href: "/gather-round", label: "Gather", Icon: Sprout },
];

export function NavBar({ isOrganizer }: NavBarProps) {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#FFFDF9] border-t border-[#E4D9CC] safe-area-bottom z-50">
      <div className="flex items-stretch">
        {links.map(({ href, label, Icon }) => {
          const active = href === "/" ? location === "/" : location.startsWith(href);
          return (
            <a
              key={href}
              href={`${BASE}${href}`}
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, "", `${BASE}${href}`);
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className={clsx(
                "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] transition-colors",
                active ? "text-[#C7613B]" : "text-[#7A6B60]",
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2 : 1.5} />
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </a>
          );
        })}
        {isOrganizer && (
          <a
            href={`${BASE}/organizer`}
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, "", `${BASE}/organizer`);
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            className={clsx(
              "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] transition-colors",
              location === "/organizer" ? "text-[#4A6741]" : "text-[#7A6B60]",
            )}
          >
            <Users className="w-5 h-5" strokeWidth={location === "/organizer" ? 2 : 1.5} />
            <span className="text-[10px] font-medium tracking-wide">Organizer</span>
          </a>
        )}
      </div>
    </nav>
  );
}
