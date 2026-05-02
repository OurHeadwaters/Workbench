import { useState } from "react";
import { Link } from "wouter";
import OpenRecords from "@/embed/OpenRecords";
import DailyClose from "@/embed/DailyClose";
import MonthEnd from "@/embed/MonthEnd";

type Tab = "open-records" | "daily-close" | "month-end";

const TABS: { id: Tab; label: string }[] = [
  { id: "open-records", label: "Open records" },
  { id: "daily-close", label: "Daily close" },
  { id: "month-end", label: "Month-end pack" },
];

export default function Demo() {
  const [active, setActive] = useState<Tab>("open-records");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Headwaters" className="w-6 h-6" />
            <span className="font-serif font-semibold text-foreground">
              Headwaters Books
            </span>
            <span className="inline-flex items-center rounded-md border border-amber-300 bg-amber-50 text-amber-900 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.16em]">
              Demo · sample data
            </span>
          </div>
          <Link href="/sign-in">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 text-muted-foreground hover:text-foreground cursor-pointer">
              Sign in for the real thing →
            </span>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 border-t border-border">
          <nav className="flex gap-1 -mb-px" aria-label="Demo views">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={`px-4 py-2.5 font-sans text-sm border-b-2 transition-colors whitespace-nowrap ${
                  active === tab.id
                    ? "border-primary text-foreground font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                aria-current={active === tab.id ? "page" : undefined}
                data-testid={`demo-tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main data-testid="demo-content">
        {active === "open-records" && <OpenRecords />}
        {active === "daily-close" && <DailyClose />}
        {active === "month-end" && <MonthEnd />}
      </main>

      <footer className="border-t border-border mt-8 py-6 text-center">
        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
          All numbers are sample data · no real transactions · no PII
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Want to run this for your community?{" "}
          <a
            href="mailto:bobbie@ourheadwaters.ca"
            className="underline underline-offset-4 hover:text-foreground"
          >
            bobbie@ourheadwaters.ca
          </a>
        </p>
      </footer>
    </div>
  );
}
