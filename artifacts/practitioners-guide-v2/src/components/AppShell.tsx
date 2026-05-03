import { Link, useLocation } from "wouter";
import type { ReactNode } from "react";
import { useEffect } from "react";
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
  Store,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: typeof BookOpen;
  accent?: string;
  dormant?: boolean;
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
  { href: "/community-store", label: "Community Store Playbook", icon: Store, accent: "#b85a3e", dormant: true },
  { href: "/codetry", label: "How this guide is named", icon: ScrollText, accent: "#3B2A6E" },
];

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function ArrowNav() {
  const [location, setLocation] = useLocation();

  const currentIndex = NAV.findIndex((item) =>
    item.href === "/" ? location === "/" : location.startsWith(item.href),
  );

  const activeIndex = currentIndex === -1 ? 0 : currentIndex;
  const prevItem = activeIndex > 0 ? NAV[activeIndex - 1] : null;
  const nextItem = activeIndex < NAV.length - 1 ? NAV[activeIndex + 1] : null;
  const currentItem = NAV[activeIndex];

  return (
    <div
      className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3"
      data-testid="arrow-nav"
    >
      <button
        onClick={() => prevItem && setLocation(prevItem.href)}
        disabled={!prevItem}
        aria-label={prevItem ? `Go to ${prevItem.label}` : "No previous section"}
        data-testid="arrow-nav-up"
        className={cn(
          "h-14 w-14 rounded-xl flex items-center justify-center transition-all shadow-lg",
          "bg-primary text-primary-foreground hover:opacity-90 active:scale-95",
          !prevItem && "opacity-0 pointer-events-none",
        )}
      >
        <ChevronUp className="h-8 w-8" strokeWidth={2.5} />
      </button>

      <div className="flex flex-col items-center gap-1 max-w-[56px]">
        <span
          className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold text-center leading-tight"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", maxHeight: "96px" }}
          title={currentItem?.label}
        >
          {currentItem?.label}
        </span>
      </div>

      <button
        onClick={() => nextItem && setLocation(nextItem.href)}
        disabled={!nextItem}
        aria-label={nextItem ? `Go to ${nextItem.label}` : "No next section"}
        data-testid="arrow-nav-down"
        className={cn(
          "h-14 w-14 rounded-xl flex items-center justify-center transition-all shadow-lg",
          "bg-primary text-primary-foreground hover:opacity-90 active:scale-95",
          !nextItem && "opacity-0 pointer-events-none",
        )}
      >
        <ChevronDown className="h-8 w-8" strokeWidth={2.5} />
      </button>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { scenario } = useScenario();

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />

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

      <ArrowNav />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
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
