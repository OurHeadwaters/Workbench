import { Link, useLocation } from "wouter";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
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
  Receipt,
  Compass,
  LayoutGrid,
  Store,
  Smartphone,
  Flame,
  DollarSign,
  Home,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Library,
  Truck,
  CalendarCheck,
  BookMarked,
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
  { href: "/engagement-pricing", label: "Engagement Pricing", icon: DollarSign, accent: "#1F5B3F" },
  { href: "/compare", label: "Operating framework", icon: GitCompareArrows },
  { href: "/replication", label: "Replication", icon: Repeat },
  { href: "/pilot-two", label: "Pilot #2", icon: Target, accent: "#B45309" },
  { href: "/workbench", label: "Workbench", icon: ScrollText, accent: "#7A2E12" },
  { href: "/strategic-ledger", label: "Strategic Ledger", icon: BookMarked, accent: "#1f3d2e" },
  { href: "/codetry-philosophy", label: "Codetry — the discipline", icon: Flame, accent: "#7A3E1A" },
  { href: "/codetry", label: "How this guide is named", icon: ScrollText, accent: "#3B2A6E" },
  { href: "/sarge", label: "Sarge HQ", icon: Smartphone, accent: "#0F766E" },
  { href: "/community-store", label: "Community Store Playbook", icon: Store, accent: "#b85a3e", dormant: true },
];

interface NavGroup {
  id: string;
  label: string;
  icon: typeof Home;
  items: NavItem[];
  matchPaths: string[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: "now",
    label: "Now",
    icon: Home,
    matchPaths: ["/", "/what-next", "/portfolio"],
    items: [
      { href: "/", label: "Dashboard", icon: Home },
      { href: "/what-next", label: "What's Next", icon: Compass, accent: "#0F766E" },
      { href: "/portfolio", label: "Portfolio Map", icon: LayoutGrid, accent: "#1A5FA8" },
    ],
  },
  {
    id: "pipeline",
    label: "Pipeline",
    icon: Handshake,
    matchPaths: ["/contracts", "/salts", "/brightside"],
    items: [
      {
        href: "/contracts",
        label: BUCKETS.contracts.name,
        icon: Handshake,
        accent: BUCKETS.contracts.accent,
      },
      { href: "/salts", label: BUCKETS.salts.name, icon: Salad, accent: BUCKETS.salts.accent },
      {
        href: "/brightside",
        label: BUCKETS.brightside.name,
        icon: Cpu,
        accent: BUCKETS.brightside.accent,
      },
    ],
  },
  {
    id: "money",
    label: "Money",
    icon: TrendingDown,
    matchPaths: ["/debt-attack", "/startup-expenses", "/engagement-pricing", "/promo-plan", "/year/check-in"],
    items: [
      { href: "/debt-attack", label: "Debt Attack", icon: TrendingDown, accent: "#6d28d9" },
      { href: "/startup-expenses", label: "Startup Expenses", icon: Receipt, accent: "#1A5FA8" },
      { href: "/engagement-pricing", label: "Engagement Pricing", icon: DollarSign, accent: "#1F5B3F" },
      { href: "/promo-plan", label: "Promotional Plan", icon: Megaphone, accent: "#7A4E2D" },
      { href: "/year/check-in", label: "Annual Check-in", icon: CalendarCheck, accent: "#065f46" },
    ],
  },
  {
    id: "reference",
    label: "Reference",
    icon: Library,
    matchPaths: [
      "/archetypes",
      "/compare",
      "/replication",
      "/pilot-two",
      "/workbench",
      "/codetry-philosophy",
      "/codetry",
      "/sarge",
      "/community-store",
      "/workflow",
      "/deer-lake",
    ],
    items: [
      { href: "/deer-lake", label: "Deer Lake Network", icon: Truck, accent: "#1B5E8A" },
      { href: "/archetypes", label: "Archetypes", icon: Layers, accent: "#1F5B3F" },
      { href: "/compare", label: "Operating Framework", icon: GitCompareArrows },
      { href: "/replication", label: "Replication", icon: Repeat },
      { href: "/pilot-two", label: "Pilot #2", icon: Target, accent: "#B45309" },
      { href: "/workbench", label: "Workbench", icon: ScrollText, accent: "#7A2E12" },
      { href: "/codetry-philosophy", label: "Codetry — the discipline", icon: Flame, accent: "#7A3E1A" },
      { href: "/codetry", label: "How this guide is named", icon: ScrollText, accent: "#3B2A6E" },
      { href: "/sarge", label: "Sarge HQ", icon: Smartphone, accent: "#0F766E" },
      { href: "/community-store", label: "Community Store Playbook", icon: Store, accent: "#b85a3e", dormant: true },
      { href: "/workflow", label: "Workflow", icon: ArrowRight, accent: "#c2410c" },
    ],
  },
];

const REFERENCE_PATHS = NAV_GROUPS.find((g) => g.id === "reference")?.matchPaths ?? [];

function ReferenceBreadcrumb() {
  const [location] = useLocation();
  const isReference = REFERENCE_PATHS.some((p) =>
    p === "/" ? false : location === p || location.startsWith(p + "/"),
  );
  if (!isReference) return null;
  return (
    <div className="mb-4 flex items-center gap-1.5">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="reference-breadcrumb"
      >
        <ChevronLeft className="h-3 w-3" />
        <Library className="h-3 w-3" />
        <span className="font-medium tracking-wide uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em" }}>
          Reference
        </span>
      </Link>
    </div>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function SideNav({ scenario }: { scenario: { accent: string } }) {
  const [location] = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const activeGroup = NAV_GROUPS.find((g) =>
    g.matchPaths.some((p) => {
      if (p === "/") return location === "/";
      return location === p || location.startsWith(p + "/");
    })
  );

  const effectiveOpen = openGroup ?? activeGroup?.id ?? null;

  function toggleGroup(id: string) {
    setOpenGroup((prev) => (prev === id ? null : id));
  }

  return (
    <nav
      className="hidden md:flex flex-col gap-1 w-44 flex-shrink-0 pt-1 pr-4 border-r"
      style={{ borderColor: "hsl(var(--card-border))" }}
      aria-label="Main navigation"
    >
      {NAV_GROUPS.map((group) => {
        const Icon = group.icon;
        const isActive = activeGroup?.id === group.id;
        const isOpen = effectiveOpen === group.id;

        return (
          <div key={group.id}>
            <button
              type="button"
              onClick={() => toggleGroup(group.id)}
              className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={
                isActive
                  ? {
                      backgroundColor: scenario.accent + "18",
                      color: scenario.accent,
                    }
                  : undefined
              }
              aria-expanded={isOpen}
              data-testid={`nav-group-${group.id}`}
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4 flex-shrink-0" />
                {group.label}
              </span>
              {isOpen ? (
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 opacity-40" />
              )}
            </button>

            {isOpen && (
              <div className="ml-3 pl-2.5 border-l border-card-border mt-0.5 mb-1 space-y-0.5">
                {group.items.map((item) => {
                  const ItemIcon = item.icon;
                  const itemActive =
                    item.href === "/"
                      ? location === "/"
                      : location === item.href || location.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition-colors"
                      style={
                        itemActive
                          ? {
                              backgroundColor: (item.accent ?? scenario.accent) + "18",
                              color: item.accent ?? scenario.accent,
                              fontWeight: 600,
                            }
                          : { color: "hsl(var(--muted-foreground))" }
                      }
                      data-testid={`nav-item-${item.href.replace(/\//g, "-")}`}
                    >
                      <ItemIcon className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
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

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex gap-6">
        <SideNav scenario={scenario} />
        <main className="min-w-0 flex-1">
          <ReferenceBreadcrumb />
          {children}
        </main>
      </div>

      <footer className="border-t mt-12 py-6 text-center text-xs text-muted-foreground space-y-1">
        <div>
          Headwaters · Practitioner's Guide ·{" "}
          <span className="font-mono">{scenario.name}</span> ·{" "}
          Numbers tagged with the date the founder locked them.
        </div>
        <div>
          <a
            href="/practitioners-guide-v2/privacy"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Privacy policy
          </a>
        </div>
      </footer>
    </div>
  );
}
