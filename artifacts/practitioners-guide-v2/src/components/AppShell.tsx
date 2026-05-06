import { Link, useLocation } from "wouter";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useScenario } from "@/lib/scenario";
import { BUCKETS } from "@/data/buckets";
import {
  BookOpen,
  Salad,
  Handshake,
  Cpu,
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
  Smartphone,
  Flame,
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
  { href: "/archetypes", label: "Archetypes", icon: Layers, accent: "#1F5B3F" },
  { href: "/compare", label: "Operating framework", icon: GitCompareArrows },
  { href: "/replication", label: "Replication", icon: Repeat },
  { href: "/pilot-two", label: "Pilot #2", icon: Target, accent: "#B45309" },
  { href: "/workbench", label: "Workbench", icon: ScrollText, accent: "#7A2E12" },
  { href: "/codetry-philosophy", label: "Codetry — the discipline", icon: Flame, accent: "#7A3E1A" },
  { href: "/codetry", label: "How this guide is named", icon: ScrollText, accent: "#3B2A6E" },
  { href: "/sarge", label: "Sarge HQ", icon: Smartphone, accent: "#0F766E" },
  { href: "/community-store", label: "Community Store Playbook", icon: Store, accent: "#b85a3e", dormant: true },
];

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
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
