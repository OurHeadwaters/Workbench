import { useEffect } from "react";
import { useLocation } from "wouter";
import { getStoredOwnerToken } from "@/lib/api";

const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

interface ToolEntry {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  accent: string;
  accentFg: string;
  external?: boolean;
  testId: string;
}

const INTERNAL_TOOLS: ToolEntry[] = [
  {
    eyebrow: "Knowledge commons",
    title: "Research Library",
    description: "Curated food systems research, producer contacts, and policy documents for northern communities.",
    href: "/library/",
    accent: "hsl(145 36% 22%)",
    accentFg: "hsl(38 36% 96%)",
    testId: "wb-library",
  },
  {
    eyebrow: "Open financial records",
    title: "Headwaters Books",
    description: "Open records the band can read, the daily close operators run, and the month-end pack for council.",
    href: "/headwaters-books/",
    accent: "hsl(145 28% 30%)",
    accentFg: "hsl(38 36% 96%)",
    testId: "wb-books",
  },
  {
    eyebrow: "Practitioner's guide",
    title: "Practitioner's Guide",
    description: "Step-by-step operational guide for building a community-owned store.",
    href: "/practitioners-guide-v2/",
    accent: "hsl(14 64% 36%)",
    accentFg: "hsl(38 36% 96%)",
    testId: "wb-guide",
  },
  {
    eyebrow: "Plain-language handbook",
    title: "Codetry Handbook",
    description: "How a community runs its own economy — written for band members, not consultants.",
    href: "/codetry-handbook/",
    accent: "hsl(30 40% 50%)",
    accentFg: "hsl(38 36% 96%)",
    testId: "wb-handbook",
  },
];

const EXTERNAL_TOOLS: ToolEntry[] = [
  {
    eyebrow: "Operations",
    title: "Rootwork",
    description: "A calm command center for builders who can't sit still.",
    href: "https://community-knowledge-hub.replit.app/studio/",
    accent: "hsl(145 18% 45%)",
    accentFg: "hsl(38 36% 96%)",
    external: true,
    testId: "wb-rootwork",
  },
  {
    eyebrow: "Personal finance",
    title: "X Buckets Vision",
    description: "Maps where money goes for people who move faster than any folder system.",
    href: "https://x-buckets-vision.replit.app/",
    accent: "hsl(30 40% 50%)",
    accentFg: "hsl(38 36% 96%)",
    external: true,
    testId: "wb-xbuckets",
  },
  {
    eyebrow: "Grants",
    title: "Grants Finder",
    description: "Every funding source for northern and Indigenous communities in one searchable index.",
    href: "https://community-knowledge-hub.replit.app/infographics/grants-finder.html",
    accent: "hsl(145 36% 22%)",
    accentFg: "hsl(38 36% 96%)",
    external: true,
    testId: "wb-grants",
  },
  {
    eyebrow: "Market intelligence",
    title: "Market Mosaic",
    description: "Market analysis and intelligence for northern food systems planning.",
    href: "https://community-knowledge-hub.replit.app/infographics/market-mosaic.html",
    accent: "hsl(14 64% 36%)",
    accentFg: "hsl(38 36% 96%)",
    external: true,
    testId: "wb-market",
  },
  {
    eyebrow: "Supply chain",
    title: "Standby Supplies",
    description: "Northern supply chain reference and emergency sourcing guide.",
    href: "https://community-knowledge-hub.replit.app/infographics/standby-supplies.html",
    accent: "hsl(145 28% 30%)",
    accentFg: "hsl(38 36% 96%)",
    external: true,
    testId: "wb-standby",
  },
];

function ToolCard({ tool }: { tool: ToolEntry }) {
  return (
    <a
      href={tool.href}
      target={tool.external ? "_blank" : undefined}
      rel={tool.external ? "noopener noreferrer" : undefined}
      className="group block rounded-md border overflow-hidden transition-opacity hover:opacity-90"
      style={{ borderColor: "hsl(var(--card-border))" }}
      data-testid={tool.testId}
    >
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ background: tool.accent, color: tool.accentFg }}
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] opacity-75 mb-0.5">
            {tool.eyebrow}
          </p>
          <p className="font-serif text-lg leading-tight font-medium">{tool.title}</p>
        </div>
        <span
          className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-70 shrink-0 ml-6 hidden sm:block"
          aria-hidden
        >
          {tool.external ? "Open ↗" : "Open →"}
        </span>
      </div>
      <div
        className="px-5 py-4"
        style={{ background: "hsl(var(--card))" }}
      >
        <p
          className="font-serif text-[14px] leading-[1.55]"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {tool.description}
        </p>
      </div>
    </a>
  );
}

export function WorkbenchPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!getStoredOwnerToken()) {
      navigate("/sign-on");
    }
  }, [navigate]);

  if (!getStoredOwnerToken()) {
    return null;
  }

  return (
    <main
      className="min-h-screen w-full bg-background text-foreground"
      data-testid="workbench-page"
    >
      <div className="mx-auto max-w-[52rem] px-6 sm:px-8 py-12 sm:py-16">

        <header className="mb-12">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-3"
            style={{ color: "hsl(var(--accent))" }}
          >
            headwaters · operator
          </p>
          <h1
            className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight mb-3"
            data-testid="workbench-title"
          >
            Workbench
          </h1>
          <p
            className="font-serif text-lg italic"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            All tools and resources in one place.
          </p>
        </header>

        <section className="mb-12" data-testid="workbench-internal">
          <div
            className="rounded-md px-5 py-4 mb-6"
            style={{ background: "hsl(145 36% 22%)", color: "hsl(38 36% 96%)" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] mb-0.5 opacity-70">
              in this workspace
            </p>
            <h2 className="font-serif text-xl tracking-tight">
              Workspace tools
            </h2>
          </div>
          <div className="space-y-3">
            {INTERNAL_TOOLS.map((tool) => (
              <ToolCard key={tool.testId} tool={tool} />
            ))}
          </div>
        </section>

        <hr
          className="my-10"
          style={{ borderColor: "hsl(var(--card-border))" }}
        />

        <section data-testid="workbench-external">
          <div
            className="rounded-md px-5 py-4 mb-6"
            style={{ background: "hsl(14 64% 36%)", color: "hsl(38 36% 96%)" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] mb-0.5 opacity-70">
              external tools
            </p>
            <h2 className="font-serif text-xl tracking-tight">
              External tools
            </h2>
          </div>
          <div className="space-y-3">
            {EXTERNAL_TOOLS.map((tool) => (
              <ToolCard key={tool.testId} tool={tool} />
            ))}
          </div>
        </section>

        <footer
          className="mt-16 pt-8 border-t flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <a
            href={`${BASE}/`}
            className="font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            ← headwaters home
          </a>
          <p
            className="font-mono text-[9px] uppercase tracking-[0.22em]"
            style={{ color: "hsl(var(--muted-foreground))", opacity: 0.6 }}
          >
            headwaters · dryden, ontario
          </p>
        </footer>

      </div>
    </main>
  );
}
