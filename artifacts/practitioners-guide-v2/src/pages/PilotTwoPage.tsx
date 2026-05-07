/**
 * PilotTwoPage — Pilot #2 pitch package.
 *
 * Four interactive tools for targeting, adapting, and delivering the Pilot #2
 * pitch without rebuilding anything from scratch:
 *
 *   1. Community Targeting Scorecard — rank 3–5 candidates across five criteria
 *   2. Template Adaptation Checklist — every Northern Band variable + status toggles
 *   3. Financial Model Adapter — community-size toggle re-scales the headline numbers
 *   4. Pitch Sequence Card — four-step card stack, designed to be read on a phone
 *
 * Checklist state persists in localStorage so it survives a refresh.
 */

import { useState, useEffect } from "react";
import {
  Target,
  CheckSquare,
  Calculator,
  MessageSquare,
  ChevronUp,
  ChevronDown,
  Check,
  Clock,
  Circle,
  Phone,
  Users,
  Crown,
  Briefcase,
} from "lucide-react";
import { money } from "@/lib/format";

const ACCENT = "#B45309";
const ACCENT_SOFT = "#FEF3C7";
const ACCENT_INK = "#78350F";

function SectionHeader({
  icon: Icon,
  number,
  title,
  subtitle,
}: {
  icon: typeof Target;
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div
        className="h-10 w-10 rounded-md grid place-items-center flex-shrink-0"
        style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold mb-0.5"
          style={{ color: ACCENT }}
        >
          {number}
        </p>
        <h2
          className="text-xl font-semibold leading-tight"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          {title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   1. COMMUNITY TARGETING SCORECARD
   ───────────────────────────────────────────────────────────── */

interface Community {
  id: string;
  name: string;
  description: string;
}

interface Criterion {
  id: string;
  label: string;
  description: string;
  weight: number;
}

const CRITERIA: Criterion[] = [
  {
    id: "warm-contact",
    label: "Warm-contact strength",
    description: "Do you have a named person who can make the intro? How strong is the relationship?",
    weight: 2,
  },
  {
    id: "geo-fit",
    label: "Geography / distribution fit",
    description: "How well does this community's freight lane align with the Dryden hub? Drive-access vs fly-in matters.",
    weight: 1.5,
  },
  {
    id: "council-readiness",
    label: "Band-council readiness signal",
    description: "Is there an active chief / council that is open to outside contractors right now? Any recent signals?",
    weight: 1.5,
  },
  {
    id: "nutrition-north",
    label: "Nutrition North eligibility",
    description: "Does the community qualify for NN subsidy? Isolated or semi-isolated? This affects the economic baseline.",
    weight: 1,
  },
  {
    id: "grant-timing",
    label: "Grant-cycle timing",
    description: "Are NOHFC, FCDF, or other northern food grants currently open or opening soon for this region?",
    weight: 1,
  },
];

const DEFAULT_COMMUNITIES: Community[] = [
  {
    id: "sioux-lookout",
    name: "Sioux Lookout corridor",
    description: "Hub community; serves several fly-in reserves; strong freight precedent via SL airport.",
  },
  {
    id: "red-lake",
    name: "Red Lake area",
    description: "Mining economy; community-owned infrastructure precedent; drive-access most of year.",
  },
  {
    id: "fly-in-reserve",
    name: "Unnamed fly-in reserve (TBD)",
    description: "Strong Nutrition North eligibility; no named contact yet — requires warm intro first.",
  },
];

type Scores = Record<string, Record<string, number>>;

const SCORE_LABELS: Record<number, string> = {
  1: "Weak",
  2: "Below avg",
  3: "Average",
  4: "Strong",
  5: "Exceptional",
};

function ScoreButton({
  value,
  selected,
  onClick,
}: {
  value: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="h-7 w-7 rounded text-xs font-semibold border transition-all"
      style={{
        backgroundColor: selected ? ACCENT : "hsl(var(--card))",
        color: selected ? "#fff" : "hsl(var(--foreground))",
        borderColor: selected ? ACCENT : "hsl(var(--card-border))",
      }}
      title={SCORE_LABELS[value]}
    >
      {value}
    </button>
  );
}

function CommunityTargetingScorecard() {
  const [scores, setScores] = useState<Scores>(() => {
    try {
      const saved = localStorage.getItem("pilot2-scorecard");
      if (saved) return JSON.parse(saved);
    } catch {}
    const initial: Scores = {};
    DEFAULT_COMMUNITIES.forEach((c) => {
      initial[c.id] = {};
      CRITERIA.forEach((cr) => {
        initial[c.id][cr.id] = 3;
      });
    });
    return initial;
  });

  useEffect(() => {
    localStorage.setItem("pilot2-scorecard", JSON.stringify(scores));
  }, [scores]);

  function setScore(communityId: string, criterionId: string, value: number) {
    setScores((prev) => ({
      ...prev,
      [communityId]: { ...prev[communityId], [criterionId]: value },
    }));
  }

  function weightedTotal(communityId: string): number {
    return CRITERIA.reduce((sum, cr) => {
      const raw = scores[communityId]?.[cr.id] ?? 3;
      return sum + raw * cr.weight;
    }, 0);
  }

  const maxPossible = CRITERIA.reduce((sum, cr) => sum + 5 * cr.weight, 0);

  const ranked = [...DEFAULT_COMMUNITIES].sort(
    (a, b) => weightedTotal(b.id) - weightedTotal(a.id)
  );

  const top = ranked[0];
  const topScore = weightedTotal(top.id);

  function rationale(community: Community): string {
    const s = scores[community.id] ?? {};
    const warmScore = s["warm-contact"] ?? 3;
    const geoScore = s["geo-fit"] ?? 3;
    const councilScore = s["council-readiness"] ?? 3;
    if (warmScore >= 4 && councilScore >= 4) {
      return "Strong warm contact + council signal makes this the lowest-friction door. Start here.";
    }
    if (geoScore >= 4) {
      return "Freight lane advantage. Lower logistics cost is a structural edge in the proposal.";
    }
    if (warmScore <= 2) {
      return "Warm contact is the gap. Get an intro before outbound — no cold-call on a band council.";
    }
    return "Balanced score across criteria. Worth the first conversation once Northern Band Day-90 audit lands.";
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
      data-testid="scorecard"
    >
      <div className="h-1" style={{ backgroundColor: ACCENT }} />
      <div className="p-5">
        <SectionHeader
          icon={Target}
          number="01"
          title="Community Targeting Scorecard"
          subtitle="Score 1–5 on each criterion. Weighted totals rank the candidates automatically."
        />

        {/* Top pick banner */}
        <div
          className="rounded-lg p-4 mb-5"
          style={{ backgroundColor: ACCENT_SOFT, borderLeft: `4px solid ${ACCENT}` }}
          data-testid="top-pick-banner"
        >
          <p
            className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold mb-1"
            style={{ color: ACCENT }}
          >
            Top pick
          </p>
          <p className="font-semibold text-sm" style={{ color: ACCENT_INK }}>
            {top.name}
          </p>
          <p className="text-xs mt-1" style={{ color: ACCENT_INK }}>
            Score: {topScore.toFixed(1)} / {maxPossible.toFixed(1)} · {rationale(top)}
          </p>
        </div>

        {/* Criteria × Community grid */}
        <div className="space-y-6">
          {CRITERIA.map((cr) => (
            <div key={cr.id}>
              <div className="flex items-start gap-2 mb-2">
                <div>
                  <p className="text-sm font-semibold">{cr.label}</p>
                  <p className="text-xs text-muted-foreground">{cr.description}</p>
                  <span
                    className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
                  >
                    weight ×{cr.weight}
                  </span>
                </div>
              </div>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                {DEFAULT_COMMUNITIES.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-lg border p-3"
                    style={{ borderColor: "hsl(var(--card-border))" }}
                  >
                    <p className="text-xs font-medium mb-2 leading-tight">{c.name}</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <ScoreButton
                          key={v}
                          value={v}
                          selected={(scores[c.id]?.[cr.id] ?? 3) === v}
                          onClick={() => setScore(c.id, cr.id, v)}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      {SCORE_LABELS[scores[c.id]?.[cr.id] ?? 3]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Ranked summary */}
        <div className="mt-6 border-t pt-4" style={{ borderColor: "hsl(var(--card-border))" }}>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Ranked order
          </p>
          <div className="space-y-2">
            {ranked.map((c, i) => {
              const score = weightedTotal(c.id);
              const pct = (score / maxPossible) * 100;
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <span
                    className="text-xs font-mono font-bold w-5 text-right flex-shrink-0"
                    style={{ color: i === 0 ? ACCENT : "hsl(var(--muted-foreground))" }}
                  >
                    #{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium truncate">{c.name}</p>
                      <span className="text-xs font-mono text-muted-foreground ml-2">
                        {score.toFixed(1)}
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ backgroundColor: "hsl(var(--muted))" }}
                    >
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: i === 0 ? ACCENT : "hsl(var(--muted-foreground))",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. TEMPLATE ADAPTATION CHECKLIST
   ───────────────────────────────────────────────────────────── */

type CheckStatus = "tbd" | "in-progress" | "done";

interface ChecklistItem {
  id: string;
  category: string;
  variable: string;
  northernBandValue: string;
  replaceWith: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "economic-baseline",
    category: "Economics",
    variable: "Community economic spend baseline",
    northernBandValue: "$1.6–2.0M leaves the community annually in grocery spend",
    replaceWith: "Run the same leakage calculation for the new community using Stats Canada and NN spend data.",
  },
  {
    id: "cents-on-dollar",
    category: "Economics",
    variable: "Nutrition North efficiency stat",
    northernBandValue: "Only 58¢ of every federal grocery help dollar reaches the shelf",
    replaceWith: "Pull the NN annual report for the specific community code. Stat varies by store and subsidy class.",
  },
  {
    id: "distribution-route",
    category: "Logistics",
    variable: "Distribution route",
    northernBandValue: "Dryden aggregation hub → Northern Band (fly-in or winter road)",
    replaceWith: "Map the new community's freight lane: drive-access, fly-in frequency, hub city, carrier options.",
  },
  {
    id: "staffing-precedent",
    category: "Staffing",
    variable: "Staffing precedent and loaded rates",
    northernBandValue: "4-role Day-1 team: Lead $18k, Ops & Food $13.5k, Code Reviewer $9.5k, Bookkeeper $2.5k",
    replaceWith: "Re-cost roles against the new community's labour market. The shape (4 roles) travels; the rates flex.",
  },
  {
    id: "language",
    category: "Community context",
    variable: "Language / dialect note",
    northernBandValue: "Oji-Cree community; materials flagged for translation (Task #11)",
    replaceWith: "Identify the community language(s). Flag any materials that need translation before the pitch.",
  },
  {
    id: "grant-refs",
    category: "Funding",
    variable: "Grant program references",
    northernBandValue: "NOHFC Northern Economic Development Fund, Nutrition North subsidy stack",
    replaceWith: "Pull the active grant programs for the new community's geography and timing. FCDF, NWRF, etc.",
  },
  {
    id: "population",
    category: "Economics",
    variable: "Community population size",
    northernBandValue: "Northern Band: approximately 800–1,000 members (on-reserve ~500)",
    replaceWith: "Determine on-reserve population. This drives the Financial Model Adapter size toggle (Section 3 below).",
  },
  {
    id: "buyer",
    category: "Deal structure",
    variable: "Buyer — band council vs contractor",
    northernBandValue: "TBD (band council vs father — affects political weight, not the math)",
    replaceWith: "Identify who signs the contract. Band council = higher political weight; contractor = faster close.",
  },
  {
    id: "travel-cadence",
    category: "Logistics",
    variable: "Travel cadence + per diem",
    northernBandValue: "Practitioner visits ~3 days/mo; flight + lodging still TBD",
    replaceWith: "Lock: fly or drive, hotel or billet, day-trips or week-sprints. Price into the overhead line.",
  },
  {
    id: "capital-recovery",
    category: "Deal structure",
    variable: "Capital recovery amount + leg structure",
    northernBandValue: "$40k family-infusion leg (m1) + $72k business-loan leg (Aug → Oct) = $112k total",
    replaceWith: "Recompute for the new debt stack. If no family infusion, the two-leg split collapses to one line.",
  },
  {
    id: "tool-pays-itself",
    category: "Phase 2",
    variable: "The one tool that pays for itself",
    northernBandValue: "Brightside RT-LTC SaaS — $28k pre-launch, $120k 18-mo revenue target",
    replaceWith: "Identify the Phase 2 product for this community × founder pair. The shape travels; the product is bespoke.",
  },
  {
    id: "audit-baseline",
    category: "Year-end",
    variable: "Value-delivered audit baseline numbers",
    northernBandValue: "Month-12 renegotiation triggers locked at V5 ($90k → $105k, draw $18k → $22k)",
    replaceWith: "Set the renegotiation triggers and the value-delivered audit benchmark at signing — not at month 12.",
  },
];

const STATUS_CONFIG: Record<
  CheckStatus,
  { label: string; icon: typeof Check; color: string; bg: string }
> = {
  done: { label: "Done", icon: Check, color: "#065f46", bg: "#d1fae5" },
  "in-progress": { label: "In Progress", icon: Clock, color: "#92400e", bg: "#fef3c7" },
  tbd: { label: "TBD", icon: Circle, color: "hsl(var(--muted-foreground))", bg: "hsl(var(--muted))" },
};

const STATUS_CYCLE: CheckStatus[] = ["tbd", "in-progress", "done"];

function TemplateAdaptationChecklist() {
  const [statuses, setStatuses] = useState<Record<string, CheckStatus>>(() => {
    try {
      const saved = localStorage.getItem("pilot2-checklist");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  useEffect(() => {
    localStorage.setItem("pilot2-checklist", JSON.stringify(statuses));
  }, [statuses]);

  function toggleStatus(id: string) {
    setStatuses((prev) => {
      const current: CheckStatus = prev[id] ?? "tbd";
      const idx = STATUS_CYCLE.indexOf(current);
      const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
      return { ...prev, [id]: next };
    });
  }

  const categories = Array.from(new Set(CHECKLIST_ITEMS.map((i) => i.category)));
  const doneCount = CHECKLIST_ITEMS.filter(
    (i) => (statuses[i.id] ?? "tbd") === "done"
  ).length;
  const inProgCount = CHECKLIST_ITEMS.filter(
    (i) => (statuses[i.id] ?? "tbd") === "in-progress"
  ).length;

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
      data-testid="checklist"
    >
      <div className="h-1" style={{ backgroundColor: ACCENT }} />
      <div className="p-5">
        <SectionHeader
          icon={CheckSquare}
          number="02"
          title="Template Adaptation Checklist"
          subtitle="Every Northern Band-specific variable. Tap a status badge to cycle: TBD → In Progress → Done. Survives a refresh."
        />

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-2 rounded-full" style={{ background: "hsl(var(--muted))" }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${(doneCount / CHECKLIST_ITEMS.length) * 100}%`,
                backgroundColor: "#065f46",
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {doneCount} done · {inProgCount} in progress · {CHECKLIST_ITEMS.length - doneCount - inProgCount} TBD
          </span>
        </div>

        {/* Items grouped by category */}
        <div className="space-y-6">
          {categories.map((cat) => {
            const items = CHECKLIST_ITEMS.filter((i) => i.category === cat);
            return (
              <div key={cat}>
                <p
                  className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold mb-3"
                  style={{ color: ACCENT }}
                >
                  {cat}
                </p>
                <div className="space-y-3">
                  {items.map((item) => {
                    const status: CheckStatus = statuses[item.id] ?? "tbd";
                    const cfg = STATUS_CONFIG[status];
                    const StatusIcon = cfg.icon;
                    return (
                      <div
                        key={item.id}
                        className="rounded-lg border p-4"
                        style={{ borderColor: "hsl(var(--card-border))" }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-semibold flex-1 min-w-0">{item.variable}</p>
                          <button
                            onClick={() => toggleStatus(item.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold flex-shrink-0 border-0 transition-all hover:opacity-80"
                            style={{ backgroundColor: cfg.bg, color: cfg.color }}
                            data-testid={`status-${item.id}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {cfg.label}
                          </button>
                        </div>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-1">
                              Northern Band value
                            </p>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                              {item.northernBandValue}
                            </p>
                          </div>
                          <div>
                            <p
                              className="text-[10px] font-mono uppercase tracking-[0.15em] mb-1"
                              style={{ color: ACCENT_INK }}
                            >
                              Replace with
                            </p>
                            <p className="text-xs leading-relaxed" style={{ color: ACCENT_INK }}>
                              {item.replaceWith}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. FINANCIAL MODEL ADAPTER
   ───────────────────────────────────────────────────────────── */

type CommunitySize = "small" | "medium" | "large";

interface SizePreset {
  label: string;
  range: string;
  trialFee: number;
  monthlyRate: number;
  teamSize: number;
  surplusRatePct: number;
  notes: string;
}

const SIZE_PRESETS: Record<CommunitySize, SizePreset> = {
  small: {
    label: "Small",
    range: "< 500 on-reserve",
    trialFee: 25000,
    monthlyRate: 65000,
    teamSize: 3,
    surplusRatePct: 24,
    notes:
      "Lean 3-role team. Likely fly-in or remote. Lower fee reflects smaller economic base; ~24% Year 1 surplus rate after tithe and cost basis.",
  },
  medium: {
    label: "Medium",
    range: "500 – 2,000 on-reserve",
    trialFee: 40000,
    monthlyRate: 90000,
    teamSize: 4,
    surplusRatePct: 28,
    notes:
      "Northern Band archetype. 4-role Day-1 team. $90k/mo fee. ~28% Year 1 surplus rate (V5 baseline: $306k surplus on $1.08M revenue).",
  },
  large: {
    label: "Large",
    range: "> 2,000 on-reserve",
    trialFee: 60000,
    monthlyRate: 115000,
    teamSize: 5,
    surplusRatePct: 33,
    notes:
      "Five-role team; additional Community Development seat from the V4 roster reactivates. Higher fee and larger cost base yields ~33% Year 1 surplus rate.",
  },
};

function FinancialModelAdapter() {
  const [size, setSize] = useState<CommunitySize>("medium");
  const [overrides, setOverrides] = useState<Partial<SizePreset>>({});

  const preset = SIZE_PRESETS[size];

  function val<K extends keyof SizePreset>(key: K): SizePreset[K] {
    return (overrides[key] as SizePreset[K] | undefined) ?? preset[key];
  }

  function setOverride(key: keyof SizePreset, raw: string) {
    const n = parseFloat(raw);
    if (!isNaN(n)) setOverrides((prev) => ({ ...prev, [key]: n }));
    if (raw === "") setOverrides((prev) => { const next = { ...prev }; delete next[key]; return next; });
  }

  function resetOverrides() {
    setOverrides({});
  }

  const trialFee = val("trialFee") as number;
  const monthlyRate = val("monthlyRate") as number;
  const surplusRatePct = val("surplusRatePct") as number;
  const year1ValueDelivered = Math.round(monthlyRate * (surplusRatePct / 100) * 12);

  const hasOverrides = Object.keys(overrides).length > 0;

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
      data-testid="financial-adapter"
    >
      <div className="h-1" style={{ backgroundColor: ACCENT }} />
      <div className="p-5">
        <SectionHeader
          icon={Calculator}
          number="03"
          title="Financial Model Adapter"
          subtitle="Toggle community size to re-scale the headline numbers. Override any field directly."
        />

        {/* Size toggle */}
        <div className="flex gap-2 mb-6" data-testid="size-toggle">
          {(["small", "medium", "large"] as CommunitySize[]).map((s) => {
            const p = SIZE_PRESETS[s];
            return (
              <button
                key={s}
                onClick={() => { setSize(s); setOverrides({}); }}
                className="flex-1 rounded-lg border p-3 text-left transition-all"
                style={{
                  borderColor: size === s ? ACCENT : "hsl(var(--card-border))",
                  backgroundColor: size === s ? ACCENT_SOFT : "hsl(var(--card))",
                  borderWidth: size === s ? "2px" : "1px",
                }}
                data-testid={`size-${s}`}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: size === s ? ACCENT_INK : "hsl(var(--foreground))" }}
                >
                  {p.label}
                </p>
                <p
                  className="text-[11px] mt-0.5"
                  style={{ color: size === s ? ACCENT_INK : "hsl(var(--muted-foreground))" }}
                >
                  {p.range}
                </p>
              </button>
            );
          })}
        </div>

        {/* Preset note */}
        <p className="text-xs text-muted-foreground mb-5 leading-relaxed">{preset.notes}</p>

        {/* Input fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {(
            [
              { key: "trialFee", label: "Trial fee (one-time)", prefix: "$", hint: "Paid to open the engagement" },
              { key: "monthlyRate", label: "Monthly rate", prefix: "$", hint: "12-month engagement baseline" },
              { key: "teamSize", label: "Team size (roles)", prefix: "", hint: "Day-1 headcount" },
              { key: "surplusRatePct", label: "Year 1 surplus rate %", prefix: "", hint: "% of annual fee retained as surplus" },
            ] as { key: keyof SizePreset; label: string; prefix: string; hint: string }[]
          ).map(({ key, label, prefix, hint }) => {
            const isOverridden = key in overrides;
            return (
              <div key={key}>
                <label className="block text-xs font-medium mb-1">
                  {label}
                  {isOverridden && (
                    <span
                      className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded font-semibold"
                      style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
                    >
                      overridden
                    </span>
                  )}
                </label>
                <div className="flex items-center gap-1.5">
                  {prefix && (
                    <span className="text-sm text-muted-foreground">{prefix}</span>
                  )}
                  <input
                    type="number"
                    className="flex-1 rounded-md border px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-1"
                    style={{
                      borderColor: isOverridden ? ACCENT : "hsl(var(--card-border))",
                    }}
                    value={(val(key) as number).toString()}
                    onChange={(e) => setOverride(key, e.target.value)}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>
              </div>
            );
          })}
        </div>

        {/* Summary card */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: ACCENT_SOFT }}
          data-testid="summary-card"
        >
          <p
            className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold mb-4"
            style={{ color: ACCENT }}
          >
            Three-line summary
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                Trial Ask
              </p>
              <p
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}
              >
                {money(trialFee)}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">One-time, at signing</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                Monthly Rate
              </p>
              <p
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}
              >
                {money(monthlyRate)}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">12-month engagement</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                Year 1 Value Delivered
              </p>
              <p
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}
              >
                {money(year1ValueDelivered)}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Surplus deployed · {surplusRatePct}% of fee
              </p>
            </div>
          </div>
        </div>

        {hasOverrides && (
          <button
            onClick={resetOverrides}
            className="mt-3 text-xs text-muted-foreground hover:underline"
          >
            Reset to {SIZE_PRESETS[size].label} preset defaults
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. PITCH SEQUENCE CARD
   ───────────────────────────────────────────────────────────── */

interface PitchStep {
  id: string;
  step: string;
  role: string;
  icon: typeof Phone;
  color: string;
  colorSoft: string;
  colorInk: string;
  who: string;
  whatToSay: string;
  leaveBehind: string;
  leaveBehindLabel: string;
}

const PITCH_STEPS: PitchStep[] = [
  {
    id: "warm-contact",
    step: "Step 1",
    role: "Warm Contact",
    icon: Phone,
    color: "#1d4ed8",
    colorSoft: "#dbeafe",
    colorInk: "#1e3a8a",
    who: "The person who can make the intro. Could be a band member, a regional development officer, a shared peer contact, or anyone who already has trust in the room.",
    whatToSay:
      '"I\'m working with Northern Band on their community store — early results are strong. There\'s a similar setup that could work in [community]. Could you make an intro to the right person at band office?"',
    leaveBehind: "The Northern Band one-pager (once Day-90 audit is signed). One URL, printable.",
    leaveBehindLabel: "One-pager link",
  },
  {
    id: "band-manager",
    step: "Step 2",
    role: "Band Manager",
    icon: Users,
    color: "#065f46",
    colorSoft: "#d1fae5",
    colorInk: "#064e3b",
    who: "The band manager or economic development officer — the person who prepares the agenda before council, not the one who votes on it.",
    whatToSay:
      '"We\'re not selling a system — we\'re running the store with you. Northern Band is 90 days in. Here\'s what the numbers look like. Would this be worth 30 minutes in front of Chief and Council?"',
    leaveBehind: "The cash-flow summary: one page, three numbers — Trial Ask, Monthly Rate, Year 1 Value Delivered.",
    leaveBehindLabel: "Cash-flow summary (Financial Model Adapter output)",
  },
  {
    id: "chief-council",
    step: "Step 3",
    role: "Chief / Council",
    icon: Crown,
    color: "#7c3aed",
    colorSoft: "#ede9fe",
    colorInk: "#5b21b6",
    who: "Chief and council, or whoever holds the political authority to commit the band. This is the meeting that counts.",
    whatToSay:
      '"Northern Band\'s store was losing $2M a year out of the community. In 90 days we\'ve changed that. The same engagement — same team shape, same transparency stack — is available here. We\'re asking for [Trial Ask]. Here\'s exactly how it works."',
    leaveBehind: "The Northern Band Walkthrough link (the full pitch scroll). Designed to be read on a phone in the room.",
    leaveBehindLabel: "Northern Band Walkthrough",
  },
  {
    id: "cfo",
    step: "Step 4",
    role: "Contractor CFO",
    icon: Briefcase,
    color: "#b45309",
    colorSoft: "#fef3c7",
    colorInk: "#78350f",
    who: "The contractor's CFO or financial officer — the one who checks whether the numbers work before the contract goes to legal.",
    whatToSay:
      '"The monthly rate is [Monthly Rate]. Trial fee is [Trial Ask]. No equity, no royalties, no licensing tail. You pay for outcomes — the value-delivered audit at month 12 defends every dollar. Here are the renegotiation triggers we\'d sign at the start."',
    leaveBehind: "The phase-lock sign-off sheet and the locked renegotiation trigger language. Two pages, flat.",
    leaveBehindLabel: "Phase-lock sign-off sheet",
  },
];

function PitchSequenceCard() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("pilot2-pitch-sequence");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "warm-contact": true,
  });

  useEffect(() => {
    localStorage.setItem("pilot2-pitch-sequence", JSON.stringify(checked));
  }, [checked]);

  function toggleCheck(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleExpanded(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
      data-testid="pitch-sequence"
    >
      <div className="h-1" style={{ backgroundColor: ACCENT }} />
      <div className="p-5">
        <SectionHeader
          icon={MessageSquare}
          number="04"
          title="Pitch Sequence Card"
          subtitle="Who you talk to, in what order, what you say, and what you leave behind. Pull this up on your phone before walking in."
        />

        <div className="space-y-3">
          {PITCH_STEPS.map((step, i) => {
            const isExpanded = expanded[step.id] ?? false;
            const isDone = checked[step.id] ?? false;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="rounded-xl border overflow-hidden transition-all"
                style={{
                  borderColor: isDone ? step.color + "66" : "hsl(var(--card-border))",
                  opacity: isDone ? 0.75 : 1,
                }}
                data-testid={`pitch-step-${step.id}`}
              >
                {/* Header row */}
                <button
                  className="w-full flex items-center gap-3 p-4 text-left hover:opacity-90 transition-opacity"
                  onClick={() => toggleExpanded(step.id)}
                  style={{ background: isDone ? step.colorSoft : "hsl(var(--card))" }}
                >
                  <div
                    className="h-9 w-9 rounded-lg grid place-items-center flex-shrink-0"
                    style={{ backgroundColor: step.colorSoft, color: step.colorInk }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-mono uppercase tracking-[0.18em] font-semibold"
                        style={{ color: step.color }}
                      >
                        {step.step}
                      </span>
                      {isDone && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: step.color, color: "#fff" }}
                        >
                          Done
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-sm">{step.role}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 space-y-4" style={{ background: "hsl(var(--card))" }}>
                    <div>
                      <p
                        className="text-[10px] font-mono uppercase tracking-[0.15em] mb-1.5"
                        style={{ color: step.color }}
                      >
                        Who
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.who}</p>
                    </div>

                    <div>
                      <p
                        className="text-[10px] font-mono uppercase tracking-[0.15em] mb-1.5"
                        style={{ color: step.color }}
                      >
                        What to say
                      </p>
                      <p
                        className="text-sm leading-relaxed rounded-lg p-3"
                        style={{
                          fontFamily: "var(--app-font-serif)",
                          fontStyle: "italic",
                          backgroundColor: step.colorSoft,
                          color: step.colorInk,
                        }}
                      >
                        {step.whatToSay}
                      </p>
                    </div>

                    <div>
                      <p
                        className="text-[10px] font-mono uppercase tracking-[0.15em] mb-1.5"
                        style={{ color: step.color }}
                      >
                        Leave behind
                      </p>
                      <div
                        className="rounded-lg border p-3 flex items-start gap-2"
                        style={{ borderColor: step.color + "44" }}
                      >
                        <div
                          className="h-5 w-5 rounded flex-shrink-0 grid place-items-center mt-0.5"
                          style={{ backgroundColor: step.colorSoft, color: step.colorInk }}
                        >
                          <span className="text-[10px] font-bold">→</span>
                        </div>
                        <div>
                          <p
                            className="text-xs font-semibold mb-0.5"
                            style={{ color: step.colorInk }}
                          >
                            {step.leaveBehindLabel}
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {step.leaveBehind}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Mark done */}
                    <button
                      onClick={() => toggleCheck(step.id)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:opacity-80"
                      style={{
                        backgroundColor: isDone ? step.color : "transparent",
                        color: isDone ? "#fff" : step.color,
                        borderColor: step.color,
                      }}
                      data-testid={`mark-done-${step.id}`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      {isDone ? "Mark undone" : "Mark done"}
                    </button>
                  </div>
                )}

                {/* Connector */}
                {i < PITCH_STEPS.length - 1 && (
                  <div
                    className="flex justify-center py-1"
                    style={{ background: "hsl(var(--card))" }}
                  >
                    <div
                      className="w-px h-4"
                      style={{ backgroundColor: "hsl(var(--card-border))" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Progress persists in your browser. Check off each step as you move through the sequence.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE SHELL
   ───────────────────────────────────────────────────────────── */

export function PilotTwoPage() {
  return (
    <div className="space-y-8" data-testid="page-pilot-two">
      {/* Page header */}
      <header className="flex items-start gap-3">
        <div
          className="h-10 w-10 rounded-md grid place-items-center flex-shrink-0"
          style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
        >
          <Target className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Pilot #2
          </p>
          <h1
            className="mt-1 text-3xl font-semibold"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            The second engagement, ready to pitch.
          </h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            The Northern Band toolkit is replicable. This chapter is the practitioner-facing
            companion that walks Bobbie through targeting, adapting, and delivering the
            Pilot #2 pitch without rebuilding anything from scratch. Four tools — score,
            adapt, price, pitch.
          </p>
          <div
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium"
            style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
          >
            Trigger: Day-90 audited proof point from Northern Band → open outbound
          </div>
        </div>
      </header>

      <CommunityTargetingScorecard />
      <TemplateAdaptationChecklist />
      <FinancialModelAdapter />
      <PitchSequenceCard />
    </div>
  );
}
