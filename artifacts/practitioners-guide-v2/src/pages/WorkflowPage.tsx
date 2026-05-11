/**
 * WorkflowPage — Headwaters operational pipeline.
 *
 * Six stages: BASE → COMPLIANCE → LEADS → WORK → PITCH → GROW.
 * Every stage card carries live, clickable links to the corresponding
 * Replit artifact or external domain so Bobbie can open any tool
 * directly from this single reference page.
 */

import { Link } from "wouter";
import {
  Globe,
  BookOpenCheck,
  Megaphone,
  Layers,
  Presentation,
  FlaskConical,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Wrench,
  Clock,
} from "lucide-react";

type TimeEstimate = "15 min" | "1 hr" | "half day";

function TimeBadge({ estimate }: { estimate: TimeEstimate }) {
  const styles: Record<TimeEstimate, string> = {
    "15 min": "bg-emerald-50 text-emerald-700 border border-emerald-200",
    "1 hr": "bg-blue-50 text-blue-700 border border-blue-200",
    "half day": "bg-amber-50 text-amber-700 border border-amber-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[estimate]}`}
    >
      <Clock className="h-3 w-3" />
      {estimate}
    </span>
  );
}

const DEV = "https://77c2ef5e-9483-45bc-b920-da6fc3c7936e-00-j3d38osmvr3g.picard.replit.dev";

interface StageLink {
  label: string;
  url: string;
  external?: boolean;
  note?: string;
}

interface Stage {
  number: string;
  role: string;
  title: string;
  description: string;
  icon: typeof Globe;
  color: string;
  colorSoft: string;
  colorInk: string;
  timeEstimate: TimeEstimate;
  timeNote: string;
  links: StageLink[];
  supporting?: StageLink[];
}

const STAGES: Stage[] = [
  {
    number: "01",
    role: "BASE",
    title: "Local Landing Page",
    description:
      "The public face of the brand. Where Dryden-area customers and community members land first. Parr's Jars is the storefront identity — jar deposits, local food, trusted name.",
    icon: Globe,
    color: "#92400e",
    colorSoft: "#fef3c7",
    colorInk: "#78350f",
    timeEstimate: "15 min",
    timeNote: "Quick check — verify domain is live, nothing broken",
    links: [
      { label: "parrsjars.ca", url: "https://parrsjars.ca", external: true, note: "Primary domain" },
      { label: "parrsjars.com", url: "https://parrsjars.com", external: true, note: "Mirror domain" },
    ],
    supporting: [
      { label: "Codetry Ship — SOW", url: `${DEV}/codetry-ship/`, note: "Rate card & statement of work" },
    ],
  },
  {
    number: "02",
    role: "COMPLIANCE",
    title: "Books",
    description:
      "The open-records bookkeeping surface. Public price page, household lookup, daily-close data, and the community store financial record. Compliance and transparency in one place.",
    icon: BookOpenCheck,
    color: "#065f46",
    colorSoft: "#d1fae5",
    colorInk: "#064e3b",
    timeEstimate: "15 min",
    timeNote: "Daily close entry or quick records check",
    links: [
      { label: "Headwaters Books", url: `${DEV}/headwaters-books/`, note: "Open-records financial surface" },
      { label: "Open-records embed", url: `${DEV}/headwaters-books/embed/open-records`, note: "Standalone panel" },
    ],
  },
  {
    number: "03",
    role: "LEADS",
    title: "Sales Funnel",
    description:
      "The outward-facing community development hub. Where interested bands, councils, and community partners enter the funnel. Top of the pipeline before the walkthrough pitch.",
    icon: Megaphone,
    color: "#c2410c",
    colorSoft: "#ffedd5",
    colorInk: "#9a3412",
    timeEstimate: "1 hr",
    timeNote: "Outreach, follow-up email, or council date prep",
    links: [
      { label: "ourheadwaters.ca", url: "https://ourheadwaters.ca", external: true, note: "Community development hub" },
    ],
    supporting: [
      { label: "Codetry Ship — Bio", url: `${DEV}/codetry-ship/bio`, note: "Public practitioner profile" },
      { label: "Codetry Ship — Services", url: `${DEV}/codetry-ship/services`, note: "Service offerings" },
    ],
  },
  {
    number: "04",
    role: "WORK",
    title: "Practitioner's Guide",
    description:
      "Internal source of truth. Operating plan, scenario math, contracts, salts, archetypes, and replication framework. The practitioner's daily dashboard — what gets tracked and decided here.",
    icon: Layers,
    color: "#1e40af",
    colorSoft: "#dbeafe",
    colorInk: "#1e3a8a",
    timeEstimate: "half day",
    timeNote: "Deep work block — contracts, scenario review, or planning",
    links: [
      { label: "Dashboard (Index)", url: `${DEV}/practitioners-guide-v2/`, note: "Main operating dashboard" },
      { label: "Operating framework", url: `${DEV}/practitioners-guide-v2/compare`, note: "V6 scenario (current)" },
      { label: "Archetypes", url: `${DEV}/practitioners-guide-v2/archetypes`, note: "V6 lineage & locked numbers" },
      { label: "Replication", url: `${DEV}/practitioners-guide-v2/replication`, note: "Next-community model" },
      { label: "Workbench", url: `${DEV}/practitioners-guide-v2/workbench`, note: "Archive & proof artifacts" },
      { label: "Contracts", url: `${DEV}/practitioners-guide-v2/contracts`, note: "Agency & distribution terms" },
    ],
    supporting: [
      { label: "Codetry Handbook (mobile)", url: `${DEV}/codetry-handbook/`, note: "How a community runs its own economy" },
    ],
  },
  {
    number: "05",
    role: "PITCH",
    title: "Client Walkthrough",
    description:
      "The community store pitch playbook. Walks a band council and construction contractor through the proposal — rework risk, phase locks, the ask, and the full toolkit. Designed to be read on a phone.",
    icon: Presentation,
    color: "#6d28d9",
    colorSoft: "#ede9fe",
    colorInk: "#5b21b6",
    timeEstimate: "1 hr",
    timeNote: "Walk a council or contractor through the pitch",
    links: [
      { label: "Community Store Playbook", url: `${DEV}/practitioners-guide-v2/community-store`, note: "Full pitch walkthrough" },
      { label: "Build calendar", url: `${DEV}/practitioners-guide-v2/community-store`, note: "Phase gate date planner (open planner from playbook)" },
      { label: "Operator cockpit", url: `${DEV}/practitioners-guide-v2/community-store`, note: "Operator tablet surface (open cockpit from playbook)" },
    ],
  },
  {
    number: "06",
    role: "GROW",
    title: "Research",
    description:
      "The Northern Food Systems Research Library. Evidence base for replication proposals, grant applications, and policy arguments. Everything behind the numbers that the pitch deck cites.",
    icon: FlaskConical,
    color: "#0e7490",
    colorSoft: "#cffafe",
    colorInk: "#164e63",
    timeEstimate: "1 hr",
    timeNote: "Evidence review for grant application or replication proposal",
    links: [
      { label: "Research Library", url: `${DEV}/library/`, note: "Northern food systems evidence base" },
    ],
    supporting: [
      { label: "Codetry Ship — Brightside", url: `${DEV}/codetry-ship/brightside`, note: "Brightside context" },
    ],
  },
];

function LinkButton({ link }: { link: StageLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all hover:opacity-80 active:scale-95"
      style={{
        borderColor: "hsl(var(--card-border))",
        background: "hsl(var(--card))",
        color: "hsl(var(--foreground))",
      }}
    >
      <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-60" />
      {link.label}
      {link.note && (
        <span className="opacity-50 font-normal hidden sm:inline">· {link.note}</span>
      )}
    </a>
  );
}

function StageCard({ stage, isLast }: { stage: Stage; isLast: boolean }) {
  const Icon = stage.icon;
  return (
    <div className="relative">
      <div
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
      >
        {/* Color bar top */}
        <div className="h-1" style={{ backgroundColor: stage.color }} />

        <div className="p-5">
          {/* Header row */}
          <div className="flex items-start gap-4">
            <div
              className="h-10 w-10 rounded-lg grid place-items-center flex-shrink-0"
              style={{ backgroundColor: stage.colorSoft, color: stage.colorInk }}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span
                  className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold"
                  style={{ color: stage.color }}
                >
                  {stage.number}
                </span>
                <span
                  className="text-[10px] font-mono uppercase tracking-[0.18em] px-2 py-0.5 rounded-full font-bold"
                  style={{
                    backgroundColor: stage.colorSoft,
                    color: stage.colorInk,
                  }}
                >
                  {stage.role}
                </span>
              </div>
              <h3
                className="text-lg font-semibold leading-tight"
                style={{ fontFamily: "var(--app-font-serif)" }}
              >
                {stage.title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {stage.description}
          </p>

          {/* Time estimate */}
          <div className="mt-3 flex items-center gap-2">
            <TimeBadge estimate={stage.timeEstimate} />
            <span className="text-xs text-muted-foreground">{stage.timeNote}</span>
          </div>

          {/* Primary links */}
          <div className="mt-4 flex flex-wrap gap-2">
            {stage.links.map((link) => (
              <LinkButton key={`${link.label}-${link.url}`} link={link} />
            ))}
          </div>

          {/* Supporting links */}
          {stage.supporting && stage.supporting.length > 0 && (
            <div className="mt-3 pt-3 border-t flex flex-wrap gap-2 items-center"
              style={{ borderColor: "hsl(var(--card-border))" }}>
              <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground flex items-center gap-1">
                <Wrench className="h-3 w-3" /> supporting
              </span>
              {stage.supporting.map((link) => (
                <LinkButton key={link.url} link={link} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Connector arrow */}
      {!isLast && (
        <div className="flex justify-center my-2">
          <ArrowRight
            className="h-4 w-4 rotate-90 text-muted-foreground opacity-40"
          />
        </div>
      )}
    </div>
  );
}

export function WorkflowPage() {
  return (
    <div className="space-y-6" data-testid="page-workflow">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="back-to-dashboard"
      >
        <ArrowLeft className="h-3 w-3" />
        Dashboard
      </Link>
      {/* Page header */}
      <header className="flex items-start gap-3">
        <div
          className="h-10 w-10 rounded-md grid place-items-center flex-shrink-0"
          style={{ background: "hsl(var(--sidebar-accent))", color: "hsl(var(--primary))" }}
        >
          <ArrowRight className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Workflow
          </p>
          <h1
            className="mt-1 text-3xl font-semibold"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            Operational pipeline
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Six stages · every link live · click to open any tool directly
          </p>
        </div>
      </header>

      {/* Quick-access strip */}
      <div
        className="rounded-xl border p-4"
        style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--muted)/0.4)" }}
      >
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">
          Quick access — all six stages
        </p>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.number}
                href={s.links[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-80"
                style={{
                  backgroundColor: s.colorSoft,
                  color: s.colorInk,
                  borderColor: s.color + "44",
                }}
              >
                <Icon className="h-3.5 w-3.5" />
                {s.role}
              </a>
            );
          })}
        </div>
      </div>

      {/* Stage cards */}
      <div>
        {STAGES.map((stage, i) => (
          <StageCard key={stage.number} stage={stage} isLast={i === STAGES.length - 1} />
        ))}
      </div>

      {/* Footer note */}
      <div
        className="rounded-xl border p-4 text-sm text-muted-foreground"
        style={{ borderColor: "hsl(var(--card-border))" }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] block mb-1">
          Note on Replit URLs
        </span>
        Links to Books, Walkthrough, Library, and this Guide resolve through the shared Replit
        dev domain. The parrsjars and ourheadwaters domains are separate Replit projects deployed
        to their own custom domains. All links open in a new tab.
      </div>
    </div>
  );
}
