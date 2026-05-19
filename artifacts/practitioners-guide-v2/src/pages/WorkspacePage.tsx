import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import {
  PRACTITIONER_RATES,
  ACTIVE_FEES,
  CODETRY_FILTER_QUESTIONS,
} from "@workspace/codetry-public";

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  evergreen:    "#1f3d2e",
  evergreenSoft:"rgba(31,61,46,0.08)",
  blue:         "#1A5FA8",
  blueSoft:     "rgba(26,95,168,0.08)",
  brown:        "#7A4E2D",
  brownSoft:    "rgba(122,78,45,0.08)",
  indigo:       "#5B3E8C",
  indigoSoft:   "rgba(91,62,140,0.08)",
  slate:        "#3D4A5C",
  slateSoft:    "rgba(61,74,92,0.08)",
  teal:         "#0F766E",
  tealSoft:     "rgba(15,118,110,0.08)",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Door {
  label: string;
  job: string;
  detail: string;
  href: string;
  internal: boolean;
  accent: string;
  accentSoft: string;
}

interface DoorGroup {
  groupLabel: string;
  groupNote: string;
  groupColor: string;
  doors: Door[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NUMBERS = [
  { label: "Lead rate",              value: `$${PRACTITIONER_RATES.lead}/hr` },
  { label: "Support rate",           value: `$${PRACTITIONER_RATES.support}/hr` },
  { label: "Portal fee (confirmed)", value: `$${ACTIVE_FEES.portalDevelopment.toLocaleString()}` },
  { label: "Monthly floor",          value: "$48,200/mo" },
  { label: "Monthly recommended",    value: "$69,700/mo" },
  { label: "XRPL / trust layer",     value: "xbuckets — in progress" },
];

const DOOR_GROUPS: DoorGroup[] = [
  {
    groupLabel: "Execution",
    groupNote:  "Open every day",
    groupColor: C.brown,
    doors: [
      {
        label:      "Daily Bench",
        job:        "Practitioner's Operating Plan",
        detail:     "Today's tasks. This week's plan. AI prompts ready to paste. Open this first every morning.",
        href:       "/practitioner-operating-plan/",
        internal:   false,
        accent:     C.brown,
        accentSoft: C.brownSoft,
      },
      {
        label:      "Financial Cockpit",
        job:        "Practitioner's Guide",
        detail:     "Money picture. Contracts. Debt attack. Scenarios. What's next.",
        href:       "/dashboard",
        internal:   true,
        accent:     C.evergreen,
        accentSoft: C.evergreenSoft,
      },
    ],
  },
  {
    groupLabel: "Facing Out",
    groupNote:  "Open for clients and partners",
    groupColor: C.blue,
    doors: [
      {
        label:      "The Window",
        job:        "Codetry Ship",
        detail:     "Shop front. Services, SOW, bio, operator view. What a client sees when you send them a link.",
        href:       "/codetry-ship/",
        internal:   false,
        accent:     C.blue,
        accentSoft: C.blueSoft,
      },
      {
        label:      "Print Marketing",
        job:        "Headwaters Print Suite",
        detail:     "Posters, flyers, one-pagers. Print-ready assets for the community.",
        href:       "/print-marketing/",
        internal:   false,
        accent:     C.teal,
        accentSoft: C.tealSoft,
      },
    ],
  },
  {
    groupLabel: "Reference",
    groupNote:  "Open to think, look up, or hand off",
    groupColor: C.slate,
    doors: [
      {
        label:      "Handbook",
        job:        "How a Community Runs Its Economy",
        detail:     "The Codetry discipline. Zone model. Worked examples.",
        href:       "/codetry-handbook/",
        internal:   false,
        accent:     C.evergreen,
        accentSoft: C.evergreenSoft,
      },
      {
        label:      "Research Library",
        job:        "Northern Food Systems",
        detail:     "Research evidence for northern food systems. Backs grants and supply chain arguments.",
        href:       "/library/",
        internal:   false,
        accent:     C.blue,
        accentSoft: C.blueSoft,
      },
      {
        label:      "Books",
        job:        "Headwaters Books",
        detail:     "Internal financial records and bookkeeping view.",
        href:       "/headwaters-books/",
        internal:   false,
        accent:     C.slate,
        accentSoft: C.slateSoft,
      },
      {
        label:      "Session Handoff",
        job:        "AI Context Handoff",
        detail:     "Paste this to a new AI session so it knows exactly where you are.",
        href:       "/session-handoff",
        internal:   true,
        accent:     C.indigo,
        accentSoft: C.indigoSoft,
      },
    ],
  },
];

// ─── Source-of-truth block ────────────────────────────────────────────────────

function SourceBlock({
  color,
  label,
  sub,
  children,
}: {
  color: string;
  label: string;
  sub: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden border-0 shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
        style={{ backgroundColor: color }}
      >
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white mb-0.5">
            {label}
          </p>
          {!open && (
            <p className="text-xs font-medium leading-snug" style={{ color: "rgba(255,255,255,0.75)" }}>
              {sub}
            </p>
          )}
        </div>
        <ChevronDown
          className="h-4 w-4 flex-shrink-0 text-white/70 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div
          className="px-5 py-4 text-xs text-muted-foreground leading-relaxed border-t-0"
          style={{ backgroundColor: color + "12" }}
        >
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
    <div
      className="border-b last:border-0 transition-colors"
      style={{ borderColor: "rgba(0,0,0,0.06)" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 py-3.5 px-4 text-left hover:bg-black/[0.02] transition-colors"
      >
        {/* Color bar */}
        <div
          className="w-1 self-stretch rounded-full flex-shrink-0"
          style={{ backgroundColor: door.accent, minHeight: "1.1rem" }}
        />
        <div className="flex-1 flex items-baseline gap-2 min-w-0">
          <span
            className="text-[11px] font-black uppercase tracking-[0.18em] flex-shrink-0"
            style={{ color: door.accent }}
          >
            {door.label}
          </span>
          {!open && (
            <span className="text-xs text-muted-foreground truncate">{door.job}</span>
          )}
        </div>
        <ChevronDown
          className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/50 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div
          className="px-4 pb-4 ml-7 space-y-2"
        >
          <p
            className="text-sm font-semibold leading-snug"
            style={{ fontFamily: "var(--app-font-serif)", color: door.accent }}
          >
            {door.job}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">{door.detail}</p>
          {door.internal ? (
            <Link
              href={door.href}
              className="inline-flex items-center gap-1 text-xs font-bold"
              style={{ color: door.accent }}
            >
              Open <ArrowUpRight className="h-3 w-3" />
            </Link>
          ) : (
            <a
              href={door.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold"
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

// ─── Door group ───────────────────────────────────────────────────────────────

function DoorGroup({ group }: { group: DoorGroup }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-border/40">
      {/* Full-color group header */}
      <div
        className="px-5 py-3 flex items-baseline gap-2"
        style={{ backgroundColor: group.groupColor }}
      >
        <span className="text-xs font-black uppercase tracking-[0.22em] text-white">
          {group.groupLabel}
        </span>
        <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
          {group.groupNote}
        </span>
      </div>
      {/* Door rows */}
      <div className="bg-card">
        {group.doors.map((door) => (
          <DoorRow key={door.label} door={door} />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function WorkspacePage() {
  return (
    <div className="max-w-2xl space-y-4" data-testid="page-workspace">

      {/* Header */}
      <div className="pb-2 relative">
        <div aria-hidden className="pointer-events-none absolute -inset-4 od-topo" style={{ opacity: 0.08 }} />
        <div className="hw-label mb-2">Headwaters Workspace</div>
        <h1
          className="text-3xl font-semibold leading-tight"
          style={{ fontFamily: "var(--app-font-serif)", color: C.evergreen }}
        >
          One door.
        </h1>
      </div>

      {/* Sources of truth — two color blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SourceBlock
          color={C.evergreen}
          label="Names Ledger"
          sub="Codetry principles — 5 questions, every engagement"
        >
          <p className="font-semibold text-foreground mb-2">Every engagement must clear all five.</p>
          <ol className="space-y-2.5">
            {CODETRY_FILTER_QUESTIONS.map((q) => (
              <li key={q.n} className="flex gap-2">
                <span
                  className="flex-shrink-0 h-4 w-4 rounded-full grid place-items-center text-[10px] font-black text-white mt-0.5"
                  style={{ backgroundColor: C.evergreen }}
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
        </SourceBlock>

        <SourceBlock
          color={C.blue}
          label="Numbers Ledger"
          sub={`$${PRACTITIONER_RATES.lead}/hr lead · $${PRACTITIONER_RATES.support}/hr support · $${ACTIVE_FEES.portalDevelopment.toLocaleString()} portal`}
        >
          <div className="space-y-2">
            {NUMBERS.map((n) => (
              <div key={n.label} className="flex justify-between gap-4">
                <span>{n.label}</span>
                <span className="font-mono font-semibold text-foreground tabular-nums">{n.value}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] border-t border-border/30 pt-2 leading-relaxed">
            XRPL = the trust layer that makes these numbers community-owned and
            auditable without an outside institution.
          </p>
        </SourceBlock>
      </div>

      {/* Tool groups */}
      {DOOR_GROUPS.map((group) => (
        <DoorGroup key={group.groupLabel} group={group} />
      ))}

      <p className="text-[10px] text-muted-foreground pt-1">
        Changed something? Update the source ledger — not the tool that displays it.
      </p>

    </div>
  );
}
