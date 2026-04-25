import { Link, useLocation } from "wouter";
import { type ReactNode } from "react";

import { PhaseIndicator } from "./PhaseIndicator";
import { TodayThreeBar } from "./TodayThreeBar";

const NAV_ITEMS: Array<{
  label: string;
  href: string;
  matches: (path: string) => boolean;
}> = [
  { label: "Today", href: "/today", matches: (p) => p === "/" || p.startsWith("/today") },
  { label: "Week", href: "/week", matches: (p) => p.startsWith("/week") },
  { label: "Year", href: "/year", matches: (p) => p.startsWith("/year") },
  {
    label: "Plan",
    href: "/plan",
    matches: (p) =>
      p === "/plan" ||
      p.startsWith("/plan/operating") ||
      p.startsWith("/operating/") ||
      p === "/allslides" ||
      // Bare /slide{N} now belongs to the operating plan, since that's the
      // default front door for the deck. Lifestyle has its own /lifestyle/* tree.
      /^\/slide\d+$/.test(p),
  },
  {
    label: "Lifestyle",
    href: "/lifestyle",
    matches: (p) => p === "/lifestyle" || p.startsWith("/lifestyle/"),
  },
  { label: "One-Pager", href: "/onepager", matches: (p) => p.startsWith("/onepager") },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  // Avoid double-rendering the editable bar on /today, where the full
  // ThreeThings card already owns that surface.
  const onToday = location === "/today" || location.startsWith("/today/");

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 antialiased">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-50/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/today"
              className="text-sm font-semibold tracking-wide text-stone-900"
            >
              Practitioner Operating Plan
            </Link>
            <span className="hidden text-xs uppercase tracking-widest text-stone-500 sm:inline">
              2026
            </span>
          </div>
          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const active = item.matches(location);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      "rounded-md px-3 py-1.5 text-sm transition-colors " +
                      (active
                        ? "bg-stone-900 text-stone-50"
                        : "text-stone-700 hover:bg-stone-200")
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <PhaseIndicator />
          </div>
        </div>
      </header>
      {!onToday && <TodayThreeBar />}
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      <footer className="mx-auto mt-16 max-w-5xl px-6 pb-12 pt-8 text-xs text-stone-500">
        State stored locally in this browser. No accounts, no servers.
      </footer>
    </div>
  );
}
