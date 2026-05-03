import { Link, useLocation } from "wouter";
import type { ReactNode } from "react";
import { useScenario } from "@/lib/scenario";
import { BUCKETS } from "@/data/buckets";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Salad,
  Handshake,
  Cpu,
  Wallet,
  GitCompareArrows,
  Repeat,
  ScrollText,
  Layers,
  ArrowRight,
  TrendingDown,
  Target,
  Megaphone,
  Compass,
  LayoutGrid,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: typeof BookOpen;
  accent?: string;
}

export const NAV: NavItem[] = [
  { href: "/", label: "Index", icon: BookOpen },
  { href: "/what-next", label: "What's Next", icon: Compass, accent: "#0F766E" },
  { href: "/portfolio", label: "Portfolio Map", icon: LayoutGrid, accent: "#1A5FA8" },
  { href: "/workflow", label: "Workflow", icon: ArrowRight, accent: "#c2410c" },
  { href: "/debt-attack", label: "Debt attack", icon: TrendingDown, accent: "#6d28d9" },
  { href: "/salts", label: BUCKETS.salts.name, icon: Salad, accent: BUCKETS.salts.accent },
  { href: "/promo-plan", label: "Promotional Plan", icon: Megaphone, accent: "#7A4E2D" },
  {
    href: "/contracts",
    label: BUCKETS.contracts.name,
    icon: Handshake,
    accent: BUCKETS.contracts.accent,
  },
  {
    href: "/brightside",
    label: BUCKETS.brightside.name,
    icon: Cpu,
    accent: BUCKETS.brightside.accent,
  },
  { href: "/personal-cash", label: "Personal cash", icon: Wallet },
  { href: "/archetypes", label: "Archetypes", icon: Layers, accent: "#1F5B3F" },
  { href: "/compare", label: "Operating framework", icon: GitCompareArrows },
  { href: "/replication", label: "Replication", icon: Repeat },
  { href: "/pilot-two", label: "Pilot #2", icon: Target, accent: "#B45309" },
  { href: "/workbench", label: "Workbench", icon: ScrollText, accent: "#7A2E12" },
  { href: "/codetry", label: "How this guide is named", icon: ScrollText, accent: "#3B2A6E" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { scenario } = useScenario();

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40"
        style={{
          borderColor: "hsl(var(--card-border))",
          borderTopWidth: "4px",
          borderTopStyle: "solid",
          borderTopColor: scenario.accent,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 group"
            data-testid="header-home-link"
          >
            <div
              className="h-8 w-8 rounded-md grid place-items-center text-white font-bold text-xs"
              style={{ backgroundColor: "hsl(var(--primary))" }}
            >
              H
            </div>
            <div className="leading-tight">
              <p
                className="text-sm font-semibold text-foreground"
                style={{ fontFamily: "var(--app-font-serif)" }}
              >
                Practitioner's Guide
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Headwaters · Source of truth
              </p>
            </div>
          </Link>
          <div className="flex-1" />
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-8">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1" data-testid="sidebar-nav">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? location === "/"
                  : location.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                  )}
                  data-testid={`nav-${item.href.replace("/", "") || "index"}`}
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: item.accent ?? "transparent",
                      border: item.accent ? "none" : "1px dashed currentColor",
                    }}
                  />
                  <Icon className="h-4 w-4 flex-shrink-0 opacity-70" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>

      <footer className="border-t mt-12 py-6 text-center text-xs text-muted-foreground">
        Headwaters · Practitioner's Guide ·{" "}
        <span className="font-mono">{scenario.name}</span> ·{" "}
        Numbers tagged with the date the founder locked them.
      </footer>
    </div>
  );
}
