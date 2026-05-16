import { Link } from "wouter";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import {
  PRACTITIONER_RATES,
  ACTIVE_FEES,
  CODETRY_FILTER_QUESTIONS,
} from "@workspace/codetry-public";

const EVERGREEN = "#1f3d2e";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Door {
  label: string;
  job: string;
  detail: string;
  href: string;
  internal: boolean;
  accent: string;
}

interface DoorGroup {
  groupLabel: string;
  groupNote: string;
  doors: Door[];
}

// ─── Door definitions ─────────────────────────────────────────────────────────

const DOOR_GROUPS: DoorGroup[] = [
  {
    groupLabel: "Execution",
    groupNote: "Open every day",
    doors: [
      {
        label: "Daily Bench",
        job: "Practitioner's Operating Plan",
        detail: "Today's tasks. This week's plan. AI prompts ready to paste. Open this first every morning.",
        href: "/practitioner-operating-plan/",
        internal: false,
        accent: "#7A4E2D",
      },
      {
        label: "Financial Cockpit",
        job: "Practitioner's Guide",
        detail: "Money picture. Contracts. Debt attack. Scenarios. What's next. Open when you need to see the whole business.",
        href: "/dashboard",
        internal: true,
        accent: EVERGREEN,
      },
    ],
  },
  {
    groupLabel: "Facing Out",
    groupNote: "Open for clients and partners",
    doors: [
      {
        label: "The Window",
        job: "Codetry Ship",
        detail: "Shop front. Services, SOW, bio, operator view. What someone sees when you send them a link.",
        href: "/codetry-ship/",
        internal: false,
        accent: "#1A5FA8",
      },
      {
        label: "Print Marketing",
        job: "Headwaters Print Suite",
        detail: "Posters, flyers, one-pagers. Print-ready assets for the community.",
        href: "/print-marketing/",
        internal: false,
        accent: "#6B3A2A",
      },
    ],
  },
  {
    groupLabel: "Reference",
    groupNote: "Open to think, look up, or hand off",
    doors: [
      {
        label: "Handbook",
        job: "How a Community Runs Its Economy",
        detail: "The Codetry discipline. Zone model. Worked examples. The book behind the work.",
        href: "/codetry-handbook/",
        internal: false,
        accent: "#2D5F3F",
      },
      {
        label: "Research Library",
        job: "Northern Food Systems",
        detail: "Research library for northern food system evidence. Backs grants and supply chain arguments.",
        href: "/library/",
        internal: false,
        accent: "#3B5998",
      },
      {
        label: "Books",
        job: "Headwaters Books",
        detail: "Internal financial records and bookkeeping view.",
        href: "/headwaters-books/",
        internal: false,
        accent: "#4A4A4A",
      },
      {
        label: "Session Handoff",
        job: "AI Context Handoff",
        detail: "Paste this to a new AI session so it knows exactly where you are and what's been decided.",
        href: "/session-handoff",
        internal: true,
        accent: "#5B3E8C",
      },
    ],
  },
];

// ─── Number row ───────────────────────────────────────────────────────────────

const NUMBERS = [
  { label: "Lead rate", value: `$${PRACTITIONER_RATES.lead}/hr` },
  { label: "Support rate", value: `$${PRACTITIONER_RATES.support}/hr` },
  { label: "Portal fee (confirmed)", value: `$${ACTIVE_FEES.portalDevelopment.toLocaleString()}` },
  { label: "Monthly floor", value: "$48,200/mo" },
  { label: "Monthly recommended", value: "$69,700/mo" },
  { label: "XRPL / trust layer", value: "xbuckets — in progress" },
];

// ─── Component ────────────────────────────────────────────────────────────────

function DoorCard({ door }: { door: Door }) {
  const inner = (
    <div
      className="group rounded-xl border bg-card h-full flex flex-col transition-shadow hover:shadow-md cursor-pointer"
      style={{ borderTopColor: door.accent, borderTopWidth: "3px" }}
    >
      <div className="p-4 flex-1">
        <p
          className="text-[11px] font-black uppercase tracking-[0.18em] mb-0.5"
          style={{ color: door.accent }}
        >
          {door.label}
        </p>
        <p className="text-sm font-semibold leading-snug mb-2" style={{ fontFamily: "var(--app-font-serif)" }}>
          {door.job}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">{door.detail}</p>
      </div>
      <div className="px-4 pb-3 pt-0">
        <span
          className="inline-flex items-center gap-1 text-[11px] font-semibold"
          style={{ color: door.accent }}
        >
          Open <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );

  if (door.internal) {
    return <Link href={door.href} className="block h-full">{inner}</Link>;
  }
  return (
    <a href={door.href} target="_blank" rel="noopener noreferrer" className="block h-full">
      {inner}
    </a>
  );
}

export function WorkspacePage() {
  const today = new Date().toLocaleDateString("en-CA", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="space-y-7" data-testid="page-workspace">

      {/* Header */}
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-1">
            Headwaters Workspace
          </p>
          <h1
            className="text-3xl sm:text-4xl font-semibold leading-tight"
            style={{ fontFamily: "var(--app-font-serif)", color: EVERGREEN }}
          >
            One door.
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Everything you need is behind one of these. Bookmark this page.
          </p>
        </div>
        <p className="text-xs text-muted-foreground pt-1">{today}</p>
      </header>

      {/* Sources of truth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Names ledger */}
        <div className="rounded-xl border-2 p-4 space-y-3" style={{ borderColor: EVERGREEN, backgroundColor: "rgba(31,61,46,0.04)" }}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: EVERGREEN }}>
              Names Ledger — Codetry Principles
            </p>
            <a
              href="/codetry-handbook/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:opacity-70"
            >
              Edit source <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Every engagement must clear all five.
          </p>
          <ol className="space-y-1.5">
            {CODETRY_FILTER_QUESTIONS.map((q) => (
              <li key={q.n} className="flex gap-2.5 text-xs leading-snug">
                <span
                  className="flex-shrink-0 h-4 w-4 rounded-full grid place-items-center text-[10px] font-black text-white mt-0.5"
                  style={{ backgroundColor: EVERGREEN }}
                >
                  {q.n}
                </span>
                <span>
                  <span className="font-semibold text-foreground">{q.internal}</span>
                  <span className="text-muted-foreground"> — {q.internalNote.split(".")[0]}.</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Numbers ledger */}
        <div className="rounded-xl border-2 p-4 space-y-3" style={{ borderColor: "#1A5FA8", backgroundColor: "rgba(26,95,168,0.04)" }}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: "#1A5FA8" }}>
              Numbers Ledger — Rates & Costs
            </p>
            <Link
              href="/what-next"
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:opacity-70"
            >
              Edit source <ArrowUpRight className="h-2.5 w-2.5" />
            </Link>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Change a number in the shared ledger — both the cockpit and the daily bench update.
          </p>
          <div className="space-y-1.5">
            {NUMBERS.map((n) => (
              <div key={n.label} className="flex items-baseline justify-between gap-2 text-xs">
                <span className="text-muted-foreground">{n.label}</span>
                <span className="font-mono font-semibold text-foreground tabular-nums">{n.value}</span>
              </div>
            ))}
          </div>
          <div className="pt-1 border-t border-border/50">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              XRPL / internet of value = the trust layer that makes these numbers
              community-owned and auditable without an outside institution.
            </p>
          </div>
        </div>
      </div>

      {/* Tool doors */}
      {DOOR_GROUPS.map((group) => (
        <div key={group.groupLabel}>
          <div className="flex items-baseline gap-2 mb-3">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-foreground">
              {group.groupLabel}
            </p>
            <p className="text-[11px] text-muted-foreground">{group.groupNote}</p>
          </div>
          <div className={`grid gap-3 ${group.doors.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
            {group.doors.map((door) => (
              <DoorCard key={door.label} door={door} />
            ))}
          </div>
        </div>
      ))}

      {/* Footer rule */}
      <p className="text-[11px] text-muted-foreground border-t pt-4">
        Changed something? Update the source ledger — not the tool that displays it.
        The tools read from one place. One change, everywhere updated.
      </p>

    </div>
  );
}
