import { useEffect } from "react";
import { useLocation } from "wouter";
import { getStoredOwnerToken, setStoredOwnerToken } from "@/lib/api";
import { AmbientBackground, GrainOverlay, ScrollReveal } from "@/components/AmbientBackground";

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
  icon?: string;
}

const INTERNAL_TOOLS: ToolEntry[] = [
  {
    eyebrow: "Knowledge commons",
    title: "Research Library",
    description: "Curated food systems research, producer contacts, and policy documents for northern communities.",
    href: "/library/",
    accent: "#1f3d2e",
    accentFg: "#f4ede0",
    testId: "wb-library",
    icon: "🔬",
  },
  {
    eyebrow: "Open financial records",
    title: "Headwaters Books",
    description: "Open records the band can read, the daily close operators run, and the month-end pack for council.",
    href: "/headwaters-books/",
    accent: "#2a4d36",
    accentFg: "#f4ede0",
    testId: "wb-books",
    icon: "📚",
  },
  {
    eyebrow: "Practitioner's guide",
    title: "Practitioner's Guide",
    description: "Step-by-step operational guide for building a community-owned store.",
    href: "/practitioners-guide-v2/",
    accent: "#b85a3e",
    accentFg: "#f4ede0",
    testId: "wb-guide",
    icon: "📋",
  },
  {
    eyebrow: "Plain-language handbook",
    title: "Codetry Handbook",
    description: "How a community runs its own economy — written for band members, not consultants.",
    href: "/codetry-handbook/",
    accent: "#c97c2e",
    accentFg: "#f4ede0",
    testId: "wb-handbook",
    icon: "📖",
  },
];

const EXTERNAL_TOOLS: ToolEntry[] = [
  {
    eyebrow: "Operations",
    title: "Rootwork",
    description: "A calm command center for builders who can't sit still.",
    href: "https://community-knowledge-hub.replit.app/studio/",
    accent: "#345c45",
    accentFg: "#f4ede0",
    external: true,
    testId: "wb-rootwork",
    icon: "🌿",
  },
  {
    eyebrow: "Personal finance",
    title: "X Buckets Vision",
    description: "Maps where money goes for people who move faster than any folder system.",
    href: "https://x-buckets-vision.replit.app/",
    accent: "#c97c2e",
    accentFg: "#f4ede0",
    external: true,
    testId: "wb-xbuckets",
    icon: "💰",
  },
  {
    eyebrow: "Grants",
    title: "Grants Finder",
    description: "Every funding source for northern and Indigenous communities in one searchable index.",
    href: "https://community-knowledge-hub.replit.app/infographics/grants-finder.html",
    accent: "#1f3d2e",
    accentFg: "#f4ede0",
    external: true,
    testId: "wb-grants",
    icon: "🏛️",
  },
  {
    eyebrow: "Market intelligence",
    title: "Market Mosaic",
    description: "Market analysis and intelligence for northern food systems planning.",
    href: "https://community-knowledge-hub.replit.app/infographics/market-mosaic.html",
    accent: "#b85a3e",
    accentFg: "#f4ede0",
    external: true,
    testId: "wb-market",
    icon: "🗺️",
  },
  {
    eyebrow: "Supply chain",
    title: "Standby Supplies",
    description: "Northern supply chain reference and emergency sourcing guide.",
    href: "https://community-knowledge-hub.replit.app/infographics/standby-supplies.html",
    accent: "#2a4d36",
    accentFg: "#f4ede0",
    external: true,
    testId: "wb-standby",
    icon: "📦",
  },
];

function ShelfItem({ tool, delay = 0 }: { tool: ToolEntry; delay?: number }) {
  return (
    <ScrollReveal delay={delay}>
      <a
        href={tool.href}
        target={tool.external ? "_blank" : undefined}
        rel={tool.external ? "noopener noreferrer" : undefined}
        className="group lodge-shelf block rounded-md overflow-hidden"
        style={{
          background: "rgba(15,28,24,0.75)",
          border: `1px solid rgba(244,237,224,0.09)`,
          boxShadow: "0 3px 16px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(212,160,23,0.05)",
          transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(-3px)";
          el.style.boxShadow = `0 8px 28px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(212,160,23,0.18), 0 0 20px rgba(212,160,23,0.06)`;
          el.style.borderColor = "rgba(212,160,23,0.20)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "";
          el.style.boxShadow = "0 3px 16px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(212,160,23,0.05)";
          el.style.borderColor = "rgba(244,237,224,0.09)";
        }}
        data-testid={tool.testId}
      >
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${tool.accent} 0%, ${tool.accent}cc 100%)`,
            color: tool.accentFg,
            borderBottom: "1px solid rgba(0,0,0,0.2)",
          }}
        >
          <div className="flex items-center gap-3">
            {tool.icon && (
              <span className="text-xl leading-none opacity-90">{tool.icon}</span>
            )}
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] opacity-70 mb-0.5">
                {tool.eyebrow}
              </p>
              <p className="font-serif text-[17px] leading-tight" style={{ fontStyle: "italic" }}>
                {tool.title}
              </p>
            </div>
          </div>
          <span
            className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60 shrink-0 ml-4 hidden sm:block group-hover:opacity-90 transition-opacity"
            aria-hidden
          >
            {tool.external ? "Open ↗" : "Open →"}
          </span>
        </div>
        <div className="px-5 py-4">
          <p
            className="font-serif text-[14.5px] leading-[1.65]"
            style={{ color: "rgba(244,237,224,0.72)" }}
          >
            {tool.description}
          </p>
        </div>
      </a>
    </ScrollReveal>
  );
}

export function WorkbenchPage() {
  const [, navigate] = useLocation();

  function handleSignOut() {
    setStoredOwnerToken(null);
    navigate("/sign-on");
  }

  useEffect(() => {
    if (!getStoredOwnerToken()) {
      navigate("/sign-on");
      return;
    }
    function onAuthChange() {
      if (!getStoredOwnerToken()) navigate("/sign-on");
    }
    window.addEventListener("headwaters:auth-change", onAuthChange);
    return () => window.removeEventListener("headwaters:auth-change", onAuthChange);
  }, [navigate]);

  if (!getStoredOwnerToken()) {
    return null;
  }

  return (
    <main
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{ background: "#0F1C18" }}
      data-testid="workbench-page"
    >
      <AmbientBackground variant="aurora" />
      <GrainOverlay opacity={0.03} />

      <div className="relative z-10 mx-auto max-w-[52rem] px-6 sm:px-8 py-12 sm:py-16">

        <header className="mb-14">
          <ScrollReveal>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.32em] mb-4"
              style={{ color: "rgba(212,160,23,0.75)" }}
            >
              headwaters · operator
            </p>
            <h1
              className="font-serif leading-[1.05] tracking-tight mb-3"
              style={{
                fontSize: "clamp(2.5rem, 7vw, 4rem)",
                color: "#f4ede0",
                fontStyle: "italic",
              }}
              data-testid="workbench-title"
            >
              The Lodge
            </h1>
            <p
              className="font-serif text-lg"
              style={{ color: "rgba(244,237,224,0.55)", fontStyle: "italic" }}
            >
              All tools and resources gathered in one place.
            </p>
          </ScrollReveal>
        </header>

        {/* Workspace tools — internal shelf */}
        <section className="mb-14" data-testid="workbench-internal">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1" style={{ background: "rgba(212,160,23,0.22)" }} />
              <p className="font-mono text-[9px] uppercase tracking-[0.28em]" style={{ color: "rgba(212,160,23,0.65)" }}>
                in this workspace
              </p>
              <div className="h-px flex-1" style={{ background: "rgba(212,160,23,0.22)" }} />
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {INTERNAL_TOOLS.map((tool, i) => (
              <ShelfItem key={tool.testId} tool={tool} delay={i * 60} />
            ))}
          </div>
        </section>

        <div
          className="my-10 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(244,237,224,0.12), transparent)" }}
        />

        {/* External tools shelf */}
        <section data-testid="workbench-external">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1" style={{ background: "rgba(184,90,62,0.22)" }} />
              <p className="font-mono text-[9px] uppercase tracking-[0.28em]" style={{ color: "rgba(184,90,62,0.65)" }}>
                external tools
              </p>
              <div className="h-px flex-1" style={{ background: "rgba(184,90,62,0.22)" }} />
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {EXTERNAL_TOOLS.map((tool, i) => (
              <ShelfItem key={tool.testId} tool={tool} delay={i * 60} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer
          className="mt-16 pt-8 flex flex-wrap items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(244,237,224,0.08)" }}
        >
          <a
            href={`${BASE}/`}
            className="font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 transition-opacity hover:opacity-80"
            style={{ color: "rgba(244,237,224,0.4)" }}
          >
            ← headwaters home
          </a>
          <p
            className="font-mono text-[9px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(244,237,224,0.22)" }}
          >
            headwaters · dryden, ontario
          </p>
          <button
            onClick={handleSignOut}
            data-testid="workbench-sign-out"
            className="btn-plaque"
          >
            Sign out →
          </button>
        </footer>
      </div>
    </main>
  );
}
