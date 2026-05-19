import { useLocation } from "wouter";
import { Home, Users, Shield, Package, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGatherStore } from "@/lib/store";

const NAV_ITEMS = [
  { path: "/", label: "Today", icon: Home },
  { path: "/family", label: "Family", icon: Users },
  { path: "/roles", label: "Roles", icon: Shield },
  { path: "/kit", label: "Kit", icon: Package },
  { path: "/activities", label: "Mall", icon: Map },
];

export function NavBar() {
  const [location, navigate] = useLocation();
  const status = useGatherStore((s) => s.readiness.status);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#FAF6F0] border-t border-[#E4D9CC] safe-area-bottom">
      <div className="max-w-md mx-auto flex">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const isActive = path === "/" ? location === "/" : location.startsWith(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex-1 flex flex-col items-center gap-0.5 py-2 px-1 min-h-[56px] transition-colors",
                isActive ? "text-[#C7613B]" : "text-[#7A6B60] hover:text-[#4A3F38]"
              )}
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                {path === "/" && status !== "everyday" && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C7613B]" />
                )}
              </div>
              <span className={cn("text-[10px] font-medium leading-none", isActive ? "text-[#C7613B]" : "text-[#7A6B60]")}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
