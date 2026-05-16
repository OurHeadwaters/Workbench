import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import {
  PRACTITIONER_RATES,
  ACTIVE_FEES,
  CODETRY_FILTER_QUESTIONS,
} from "@workspace/codetry-public";

const EVERGREEN = "#1f3d2e";
const BLUE = "#1A5FA8";

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

// ─── Data ─────────────────────────────────────────────────────────────────────

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
        detail: "Money picture. Contracts. Debt attack. Scenarios. What's next.",
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
        detail: "Shop front. Services, SOW, bio, operator view. What a client sees when you send them a link.",
        href: "/codetry-ship/",
        internal: false,
        accent: BLUE,
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
        detail: "The Codetry discipline. Zone model. Worked examples.",
        href: "/codetry-handbook/",
        internal: false,
        accent: "#2D5F3F",
      },
      {
        label: "Research Library",
        job: "Northern Food Systems",
        detail: "Research evidence for northern food systems. Backs grants and supply chain arguments.",
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
        detail: "Paste this to a new AI session so it knows exactly where you are.",
        href: "/session-handoff",
        internal: true,
        accent: "#5B3E8C",
      },
    ],
  },
];

const NUMBERS = [
  { label: "Lead rate", value: `$${PRACTITIONER_RATES.lead}/hr` },
  { label: "Support rate", value: `$${PRACTITIONER_RATES.support}/hr` },
  { label: "Portal fee (confirmed)", value: `$${ACTIVE_FEES.portalDevelopment.toLocaleString()}` },
  { label: "Monthly floor", value: "$48,200/mo" },
  { label: "Monthly recommended", value: "$69,700/mo" },
  { label: "XRPL / trust layer", value: "xbuckets — in progress" },
];

// ─── Accordion row ────────────────────────────────────────────────────────────

function AccordionRow({
  label,
  sub,
  accent,
  children,
  defaultOpen = false,
}: {
  label: string;
  sub: string;
  accent: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 py-3 text-left group"
      >
        <div className="flex items-baseline gap-2 min-w-0">
          <span
            className="text-[11px] font-black uppercase tracking-[0.18em] flex-shrink-0"
            style={{ color: accent }}
          >
            {label}
          </span>
          {!open && (
            <span className="text-xs text-muted-foreground truncate">{sub}</span>
          )}
        </div>
        <ChevronDown
          className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div className="pb-3 text-xs text-muted-foreground leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Door row ─────────────────────────────────────────────────────────────────

function DoorRow({ door }: { door: Door }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border/40 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 py-3 text-left"
      >
        <div className="flex items-baseline gap-2 min-w-0">
          <span
            className="text-[11px] font-black uppercase tracking-[0.15em] flex-shrink-0"
            style={{ color: door.accent }}
          >
            {door.label}
          </span>
          {!open && (
            <span className="text-xs text-muted-foreground truncate">{door.job}</span>
          )}
        </div>
        <ChevronDown
          className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div className="pb-3 space-y-2">
          <p className="text-sm font-medium" style={{ fontFamily: "var(--app-font-serif)" }}>
            {door.job}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">{door.detail}</p>
          {door.internal ? (
            <Link
              href={door.href}
              className="inline-flex items-center gap-1 text-xs font-semibold mt-1"
              style={{ color: door.accent }}
            >
              Open <ArrowUpRight className="h-3 w-3" />
            </Link>
          ) : (
            <a
              href={door.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold mt-1"
              style={{ color: door.accent }}
            >
              Open <ArrowUpRight className="h-3 w-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function WorkspacePage() {
  return (
    <div className="max-w-2xl space-y-6" data-testid="page-workspace">

      {/* Header */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-1">
          Headwaters Workspace
        </p>
        <h1
          className="text-3xl font-semibold leading-tight"
          style={{ fontFamily: "var(--app-font-serif)", color: EVERGREEN }}
        >
          One door.
        </h1>
      </div>

      {/* Sources of truth */}
      <div className="rounded-xl border overflow-hidden">

        {/* Names ledger */}
        <AccordionRow
          label="Names Ledger"
          sub="Codetry principles — 5 questions, every engagement"
          accent={EVERGREEN}
        >
          <p className="mb-2 font-medium text-foreground">Every engagement must clear all five.</p>
          <ol className="space-y-2">
            {CODETRY_FILTER_QUESTIONS.map((q) => (
              <li key={q.n} className="flex gap-2">
                <span
                  className="flex-shrink-0 h-4 w-4 rounded-full grid place-items-center text-[10px] font-black text-white mt-0.5"
                  style={{ backgroundColor: EVERGREEN }}
                >
                  {q.n}
                </span>
                <span>
                  <span className="font-semibold text-foreground">{q.internal}</span>
                  {" — "}{q.internalNote.split(".")[0]}.
                </span>
              </li>
            ))}
          </ol>
        </AccordionRow>

        {/* Numbers ledger */}
        <AccordionRow
          label="Numbers Ledger"
          sub={`$${PRACTITIONER_RATES.lead}/hr lead · $${PRACTITIONER_RATES.support}/hr support · $${ACTIVE_FEES.portalDevelopment.toLocaleString()} portal`}
          accent={BLUE}
        >
          <div className="space-y-1.5">
            {NUMBERS.map((n) => (
              <div key={n.label} className="flex justify-between gap-4">
                <span>{n.label}</span>
                <span className="font-mono font-semibold text-foreground tabular-nums">{n.value}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] border-t border-border/40 pt-2">
            XRPL / internet of value — the trust layer that makes these numbers
            community-owned and auditable without an outside institution.
          </p>
          <p className="mt-1 text-[11px]">
            Change a rate in the shared ledger → both cockpit and daily bench update automatically.
          </p>
        </AccordionRow>

      </div>

      {/* Tool doors */}
      {DOOR_GROUPS.map((group) => (
        <div key={group.groupLabel} className="rounded-xl border overflow-hidden">
          <div className="px-4 py-2 border-b border-border/40 flex items-baseline gap-2"
            style={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-foreground">
              {group.groupLabel}
            </span>
            <span className="text-[10px] text-muted-foreground">{group.groupNote}</span>
          </div>
          <div className="px-4">
            {group.doors.map((door) => (
              <DoorRow key={door.label} door={door} />
            ))}
          </div>
        </div>
      ))}

      <p className="text-[10px] text-muted-foreground border-t pt-3">
        Changed something? Update the source ledger — not the tool that displays it.
      </p>

    </div>
  );
}
