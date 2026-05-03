/**
 * PortfolioPage — The full revenue map.
 *
 * Eight lines across three tiers. Not a wish list — a sequenced plan
 * with honest status and one specific next action per line.
 *
 * DESIGN RULE: This page follows the progressive disclosure convention.
 * Each card shows status + next action at a glance. Steps expand on demand.
 */

import { useState } from "react";
import { Link } from "wouter";
import {
  REVENUE_LINES,
  TIER_META,
  type RevenueLine,
  type Tier,
} from "@/data/portfolio";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  Link2,
  Package,
  Zap,
  ExternalLink,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<RevenueLine["status"], string> = {
  active: "Active",
  building: "Building",
  "warm-lead": "Warm lead",
  "not-started": "Not started",
  speculative: "Speculative",
};

const STATUS_STYLE: Record<RevenueLine["status"], string> = {
  active: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  building: "bg-blue-50 text-blue-800 border border-blue-200",
  "warm-lead": "bg-amber-50 text-amber-800 border border-amber-200",
  "not-started": "bg-slate-50 text-slate-700 border border-slate-200",
  speculative: "bg-purple-50 text-purple-700 border border-purple-200",
};

const CATEGORY_STYLE: Record<RevenueLine["category"], string> = {
  Consulting: "bg-blue-100 text-blue-700",
  Physical: "bg-green-100 text-green-700",
  Hardware: "bg-slate-100 text-slate-700",
  SaaS: "bg-violet-100 text-violet-700",
  Fintech: "bg-orange-100 text-orange-700",
  Product: "bg-indigo-100 text-indigo-700",
};

const ALERT_ICON = {
  bundle: Link2,
  risk: AlertTriangle,
  "forcing-function": Zap,
  insight: Lightbulb,
};

const ALERT_STYLE = {
  bundle:
    "bg-teal-50 border border-teal-200 text-teal-800",
  risk: "bg-red-50 border border-red-200 text-red-800",
  "forcing-function":
    "bg-amber-50 border border-amber-200 text-amber-800",
  insight:
    "bg-sky-50 border border-sky-200 text-sky-800",
};

// ── Line card ─────────────────────────────────────────────────────────────────

function LineCard({ line }: { line: RevenueLine }) {
  const [expanded, setExpanded] = useState(false);
  const AlertIcon = line.alert ? ALERT_ICON[line.alert.kind] : null;

  return (
    <div
      className="rounded-xl border bg-card overflow-hidden"
      style={{
        borderColor: line.accent + "44",
        borderLeftWidth: "4px",
        borderLeftColor: line.accent,
      }}
      data-testid={`portfolio-line-${line.id}`}
    >
      {/* Card header */}
      <div className="p-4 space-y-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-foreground leading-snug">
                {line.name}
              </p>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${CATEGORY_STYLE[line.category]}`}
              >
                {line.category}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {line.tagline}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[line.status]}`}
            >
              {STATUS_LABEL[line.status]}
            </span>
            {line.existingPage && (
              <Link
                href={line.existingPage}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
                title="Open guide page"
              >
                <ExternalLink className="h-3 w-3" />
                Guide
              </Link>
            )}
          </div>
        </div>

        {/* Who it's for */}
        <div className="rounded-md bg-muted/40 px-3 py-2">
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground mb-0.5">
            Who
          </p>
          <p className="text-xs text-foreground leading-relaxed">{line.who}</p>
        </div>

        {/* Next action */}
        <div
          className="rounded-md px-3 py-2 flex items-start gap-2"
          style={{ backgroundColor: line.accent + "10", borderLeft: `3px solid ${line.accent}` }}
        >
          <ArrowRight
            className="h-3.5 w-3.5 flex-shrink-0 mt-0.5"
            style={{ color: line.accent }}
          />
          <div>
            <p
              className="text-[10px] font-mono uppercase tracking-[0.16em] mb-0.5"
              style={{ color: line.accent }}
            >
              Next action
            </p>
            <p className="text-xs font-medium text-foreground leading-relaxed">
              {line.nextAction}
            </p>
          </div>
        </div>

        {/* Alert */}
        {line.alert && AlertIcon && (
          <div
            className={`rounded-md px-3 py-2 flex items-start gap-2 text-xs leading-relaxed ${ALERT_STYLE[line.alert.kind]}`}
          >
            <AlertIcon className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <p>{line.alert.text}</p>
          </div>
        )}
      </div>

      {/* Expand / collapse steps */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 border-t text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
        style={{ borderColor: line.accent + "22" }}
        aria-expanded={expanded}
        data-testid={`portfolio-expand-${line.id}`}
      >
        <span>
          {expanded ? "Hide" : "Show"} next steps ({line.steps.length})
        </span>
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" />
        )}
      </button>

      {expanded && (
        <div
          className="px-4 pb-4 space-y-3 border-t"
          style={{ borderColor: line.accent + "22", backgroundColor: line.accent + "04" }}
        >
          {line.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 pt-3">
              <span
                className="w-5 h-5 rounded-full flex-shrink-0 text-[10px] font-bold grid place-items-center mt-0.5"
                style={{
                  backgroundColor: line.accent + "20",
                  color: line.accent,
                }}
              >
                {i + 1}
              </span>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground leading-snug">
                  {step.action}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tier section ──────────────────────────────────────────────────────────────

function TierSection({
  tier,
  lines,
}: {
  tier: Tier;
  lines: RevenueLine[];
}) {
  const meta = TIER_META[tier];
  return (
    <section data-testid={`portfolio-tier-${tier}`}>
      <div
        className="rounded-lg px-4 py-3 mb-4"
        style={{
          backgroundColor: meta.bg,
          border: `1px solid ${meta.border}`,
        }}
      >
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: meta.color }}
          />
          <p
            className="text-sm font-semibold"
            style={{ color: meta.color }}
          >
            {meta.label}
          </p>
          <span className="text-xs text-muted-foreground ml-1">
            — {lines.length} {lines.length === 1 ? "line" : "lines"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed pl-4">
          {meta.description}
        </p>
      </div>
      <div className="space-y-4">
        {lines.map((line) => (
          <LineCard key={line.id} line={line} />
        ))}
      </div>
    </section>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function PortfolioPage() {
  const byTier = (tier: Tier) =>
    REVENUE_LINES.filter((l) => l.tier === tier);

  const activeCount = REVENUE_LINES.filter((l) => l.status === "active").length;
  const buildingCount = REVENUE_LINES.filter(
    (l) => l.status === "building" || l.status === "warm-lead"
  ).length;

  return (
    <div className="space-y-10" data-testid="page-portfolio">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        ← Dashboard
      </Link>

      {/* Header */}
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Revenue map
        </p>
        <h1
          className="text-3xl sm:text-4xl font-semibold leading-tight"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          The full portfolio.
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          Eight revenue lines. One practitioner. The order matters more than the
          ambition — every line is real, but they cannot all be pursued
          simultaneously.
        </p>

        {/* Capacity callout */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 space-y-2">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-amber-700 flex-shrink-0" />
            <p className="text-sm font-semibold text-amber-900">
              Single-practitioner capacity rule
            </p>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Every hour spent on a Tier 3 line before Tier 1 is solid is a tax on
            the thing that pays the bills right now. The tiers below are not a
            preference — they are a sequence. Tier 1 funds the time to build Tier
            2. Tier 2 funds the space to explore Tier 3. The XRPL app and a second
            Brightside pilot are real opportunities. They are not this quarter's work.
          </p>
          <div className="flex flex-wrap gap-3 pt-1 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-amber-900">
                {activeCount} active {activeCount === 1 ? "line" : "lines"}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-amber-900">
                {buildingCount} building or warm
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="text-amber-900">
                {REVENUE_LINES.length - activeCount - buildingCount} not yet started
                / speculative
              </span>
            </span>
          </div>
        </div>
      </header>

      {/* Tier 1 */}
      <TierSection tier="now" lines={byTier("now")} />

      {/* Tier 2 */}
      <TierSection tier="next" lines={byTier("next")} />

      {/* Tier 3 */}
      <TierSection tier="later" lines={byTier("later")} />

      {/* Strategic note */}
      <div className="rounded-xl border border-border bg-muted/30 px-5 py-5 space-y-3">
        <p className="text-sm font-semibold text-foreground">
          The bundle you're not using yet
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The Northern Store Plan and the 807 Benefits Platform go to the same
          buyer: band councils, co-op operators, and community organizations in
          the 807 area code. One sales call can sell both. The pitch is{" "}
          <em>
            "we build the store plan and the membership platform together — one
            team, one engagement, two tools your community owns."
          </em>{" "}
          That is a stronger offer than either product alone, and it is not on
          your pitch sheet yet.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The Start9 hardware sales are not just a revenue line — they are a
          client acquisition strategy. Every person who buys a privacy server
          from someone they trust locally becomes a consulting prospect. Price it
          to move, do the setup in person, and leave a follow-up conversation on
          the table.
        </p>
      </div>
    </div>
  );
}
