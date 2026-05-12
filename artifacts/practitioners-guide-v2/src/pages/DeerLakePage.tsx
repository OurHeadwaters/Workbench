/**
 * DeerLakePage — Deer Lake Food Security Distribution Network
 *
 * Headwaters role: Northern Coordinator
 * Planning year: 2026 (funded by Deer Lake First Nation)
 * Project launch: January 2027
 *
 * Lead applicant: 807 Food Co-operative & Hub (Dryden, ON)
 * Funding: NOHFC Enhance Your Community (50%) + FedNor CEDD (50%) = 100% human capacity
 * Truck: LFIF (arriving summer/fall 2026)
 * Applications due: May 31, 2026 | Decisions: Sep–Nov 2026
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Truck,
  Users,
  CalendarClock,
  CheckCircle2,
  Clock,
  Circle,
  AlertTriangle,
  MapPin,
  FileText,
  Star,
  Snowflake,
  Sun,
  Flag,
} from "lucide-react";

const ACCENT = "#1B5E8A";
const ACCENT_SOFT = "#E8F4FD";
const ACCENT_INK = "#0F3A5C";

const LS_KEY = "pgv2.deer-lake.milestones";

/* ─── Types ──────────────────────────────────────────────── */

type MilestoneStatus = "tbd" | "in-progress" | "done" | "at-risk";

interface Milestone {
  id: string;
  group: string;
  title: string;
  owner: string;
  deadline: string;
  deadlineFlag?: "critical";
  detail: string;
}

/* ─── Data ──────────────────────────────────────────────── */

const MILESTONES: Milestone[] = [
  {
    id: "letter-of-support",
    group: "Grant applications",
    title: "Letter of support from Deer Lake First Nation",
    owner: "Headwaters → Deer Lake Chief & Council",
    deadline: "Before May 31, 2026",
    deadlineFlag: "critical",
    detail:
      "The single most important document for the grant applications. Without it, neither NOHFC nor FedNor will score the application favourably. Must be in hand before submission. Headwaters' role: provide the draft language and walk council through what they're signing.",
  },
  {
    id: "grant-submission",
    group: "Grant applications",
    title: "NOHFC + FedNor CEDD applications submitted",
    owner: "807 Food Co-op (lead applicant)",
    deadline: "May 31, 2026",
    deadlineFlag: "critical",
    detail:
      "807 Food Co-operative & Hub is the lead applicant. NOHFC Enhance Your Community (50%) + FedNor CEDD (50%) = 100% of human capacity costs. Decisions expected September–November 2026.",
  },
  {
    id: "scope-defined",
    group: "Grant applications",
    title: "Headwaters' northern coordination scope documented",
    owner: "Headwaters",
    deadline: "Before May 31, 2026",
    detail:
      "Clear deliverables for the northern coordination contract that are project-based (not operational), so the grant budget line is defensible to NOHFC and FedNor reviewers. Scope must name: Deer Lake relationship management, community store development, pilot governance, reporting. NOT day-to-day operations.",
  },
  {
    id: "store-plan",
    group: "Community infrastructure",
    title: "Community store plan confirmed",
    owner: "Headwaters + Deer Lake community store",
    deadline: "By December 2026",
    detail:
      "Receiving infrastructure, storage arrangements, and community distribution process documented. The donated 807 cold room is already on site — confirm it's operational, sized correctly, and that the receiving process is mapped. This is the physical foundation for the January 2027 pilot.",
  },
  {
    id: "coordinator-recruited",
    group: "Staffing",
    title: "Deer Lake community intake coordinator identified",
    owner: "Headwaters (recruitment lead)",
    deadline: "Ready to contract by December 2026",
    detail:
      "This person handles store-side receiving, local distribution, and reporting. A Deer Lake First Nation community member is strongly preferred — it strengthens the grant narrative and long-term sustainability. Backup model: working holiday arrangement (outside couple, room and board). Must be identified with enough runway to onboard before January 2027.",
  },
  {
    id: "winter-roads",
    group: "Logistics",
    title: "Winter road logistics confirmed",
    owner: "Tyler Bernier / Rockfront (routes) + Headwaters (community access)",
    deadline: "By November 2026",
    detail:
      "Winter roads to Deer Lake are typically open January through April. Confirm: access dates, weight limits, scheduling constraints, carrier requirements. Tyler needs this to plan the January 2027 pilot routes. Headwaters confirms the community side; Tyler confirms the route side.",
  },
  {
    id: "truck-received",
    group: "Logistics",
    title: "LFIF distribution truck received and operational",
    owner: "807 Food Co-op / LFIF",
    deadline: "Summer/Fall 2026",
    detail:
      "Funded separately through LFIF. Arriving summer/fall 2026. Confirm delivery timeline, insurance, and operational readiness before November so Tyler can plan the January pilot runs.",
  },
  {
    id: "producer-contracts",
    group: "Supply chain",
    title: "Initial producer contracts in place",
    owner: "Kevin Belluz / Superior Seasons (Thunder Bay)",
    deadline: "By December 2026",
    detail:
      "Kevin handles supply coordination and producer aggregation from Thunder Bay. At least the anchor producers need signed commitments before January 2027 so the pilot launches with real product, not letters of intent.",
  },
];

const STATUS_CONFIG: Record<
  MilestoneStatus,
  { label: string; icon: typeof CheckCircle2; color: string; bg: string }
> = {
  done: {
    label: "Done",
    icon: CheckCircle2,
    color: "#065f46",
    bg: "#d1fae5",
  },
  "in-progress": {
    label: "In Progress",
    icon: Clock,
    color: "#92400e",
    bg: "#fef3c7",
  },
  "at-risk": {
    label: "At Risk",
    icon: AlertTriangle,
    color: "#991b1b",
    bg: "#fee2e2",
  },
  tbd: {
    label: "TBD",
    icon: Circle,
    color: "hsl(var(--muted-foreground))",
    bg: "hsl(var(--muted))",
  },
};

const STATUS_CYCLE: MilestoneStatus[] = ["tbd", "in-progress", "at-risk", "done"];

/* ─── Sub-components ────────────────────────────────────── */

function StatusBadge({
  status,
  onClick,
  testId,
}: {
  status: MilestoneStatus;
  onClick: () => void;
  testId: string;
}) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold flex-shrink-0 transition-all hover:opacity-80 border-0"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
      title="Click to cycle status: TBD → In Progress → At Risk → Done"
      data-testid={testId}
    >
      <Icon className="h-3 w-3" />
      {cfg.label}
    </button>
  );
}

function MilestoneTracker() {
  const [statuses, setStatuses] = useState<Record<string, MilestoneStatus>>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(statuses));
  }, [statuses]);

  function toggleStatus(id: string) {
    setStatuses((prev) => {
      const current: MilestoneStatus = prev[id] ?? "tbd";
      const idx = STATUS_CYCLE.indexOf(current);
      const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
      return { ...prev, [id]: next };
    });
  }

  const groups = Array.from(new Set(MILESTONES.map((m) => m.group)));
  const doneCount = MILESTONES.filter((m) => (statuses[m.id] ?? "tbd") === "done").length;
  const atRiskCount = MILESTONES.filter((m) => (statuses[m.id] ?? "tbd") === "at-risk").length;
  const inProgCount = MILESTONES.filter((m) => (statuses[m.id] ?? "tbd") === "in-progress").length;
  const tbdCount = MILESTONES.length - doneCount - atRiskCount - inProgCount;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div
        className="rounded-xl border p-4"
        style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            2026 planning progress
          </p>
          <span className="text-xs text-muted-foreground">
            {doneCount}/{MILESTONES.length} done
            {atRiskCount > 0 && (
              <span className="ml-2 text-red-600 font-semibold">· {atRiskCount} at risk</span>
            )}
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${(doneCount / MILESTONES.length) * 100}%`,
              backgroundColor: "#065f46",
            }}
          />
        </div>
        <div className="flex gap-4 mt-2 text-[11px] text-muted-foreground">
          <span className="text-emerald-700 font-medium">{doneCount} done</span>
          <span className="text-amber-700 font-medium">{inProgCount} in progress</span>
          {atRiskCount > 0 && (
            <span className="text-red-700 font-semibold">{atRiskCount} at risk</span>
          )}
          <span>{tbdCount} TBD</span>
        </div>
      </div>

      {/* Milestone groups */}
      {groups.map((group) => {
        const items = MILESTONES.filter((m) => m.group === group);
        return (
          <div key={group}>
            <p
              className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold mb-2 px-1"
              style={{ color: ACCENT }}
            >
              {group}
            </p>
            <div className="space-y-3">
              {items.map((m) => {
                const status: MilestoneStatus = statuses[m.id] ?? "tbd";
                const isDone = status === "done";
                return (
                  <div
                    key={m.id}
                    className="rounded-xl border overflow-hidden"
                    style={{
                      borderColor: "hsl(var(--card-border))",
                      background: "hsl(var(--card))",
                      borderLeftColor: m.deadlineFlag === "critical" ? "#991b1b" : ACCENT,
                      borderLeftWidth: "3px",
                    }}
                    data-testid={`milestone-${m.id}`}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p
                              className={`text-sm font-semibold leading-snug ${isDone ? "line-through text-muted-foreground" : ""}`}
                            >
                              {m.title}
                            </p>
                            {m.deadlineFlag === "critical" && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                                <Star className="h-2.5 w-2.5" />
                                Critical
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <CalendarClock className="h-3 w-3" />
                              {m.deadline}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {m.owner}
                            </span>
                          </div>
                        </div>
                        <StatusBadge
                          status={status}
                          onClick={() => toggleStatus(m.id)}
                          testId={`status-${m.id}`}
                        />
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                        {m.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TeamCard({
  org,
  person,
  role,
  location,
  scope,
  isHeadwaters,
}: {
  org: string;
  person: string;
  role: string;
  location: string;
  scope: string;
  isHeadwaters?: boolean;
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        borderColor: isHeadwaters ? ACCENT : "hsl(var(--card-border))",
        borderWidth: isHeadwaters ? "2px" : "1px",
        background: isHeadwaters ? ACCENT_SOFT : "hsl(var(--card))",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="h-9 w-9 rounded-lg grid place-items-center flex-shrink-0 text-white text-sm font-bold"
          style={{ backgroundColor: isHeadwaters ? ACCENT : "hsl(var(--muted))" }}
        >
          {org.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight">{org}</p>
          {person && (
            <p className="text-xs text-muted-foreground">{person}</p>
          )}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded"
              style={{ backgroundColor: isHeadwaters ? ACCENT : "hsl(var(--muted))", color: isHeadwaters ? "#fff" : "hsl(var(--foreground))" }}
            >
              {role}
            </span>
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <MapPin className="h-2.5 w-2.5" />
              {location}
            </span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{scope}</p>
    </div>
  );
}

function PhaseCard({
  icon: Icon,
  period,
  title,
  items,
}: {
  icon: typeof Snowflake;
  period: string;
  title: string;
  items: string[];
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 flex-shrink-0" style={{ color: ACCENT }} />
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground">
            {period}
          </p>
          <p className="text-sm font-semibold leading-tight">{title}</p>
        </div>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className="mt-1 h-1 w-1 rounded-full flex-shrink-0" style={{ backgroundColor: ACCENT }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────── */

export function DeerLakePage() {
  return (
    <div className="space-y-8" data-testid="page-deer-lake">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="back-to-dashboard"
      >
        <ArrowLeft className="h-3 w-3" />
        Dashboard
      </Link>

      {/* Header */}
      <header>
        <p
          className="text-xs font-medium uppercase tracking-[0.2em] mb-2"
          style={{ color: ACCENT }}
        >
          Deer Lake First Nation · Food Security Distribution Network
        </p>
        <h1
          className="text-3xl font-semibold leading-tight mb-3"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          Northern Coordination — 2026 Planning Year
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Headwaters' 2026 mandate is the planning year that makes January 2027 possible.
          By the time grant funds arrive and contracts are signed, the community coordinator
          must be recruited, the store plan confirmed, and the winter road route locked.
          807 Food Co-op leads the grant application. Headwaters holds the northern relationship.
        </p>
      </header>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Grant applications due", value: "May 31, 2026", sub: "NOHFC + FedNor CEDD", urgent: true },
          { label: "Funding structure", value: "100% covered", sub: "Human capacity costs only" },
          { label: "Project launch", value: "Jan 2027", sub: "Winter road pilot" },
          { label: "Pilot wrap-up", value: "Dec 2027", sub: "Replication blueprint" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border p-4"
            style={{
              borderColor: kpi.urgent ? "#fca5a5" : "hsl(var(--card-border))",
              background: kpi.urgent ? "#fff5f5" : "hsl(var(--card))",
            }}
          >
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
              {kpi.label}
            </p>
            <p
              className="text-xl font-semibold"
              style={{ fontFamily: "var(--app-font-serif)", color: kpi.urgent ? "#991b1b" : ACCENT_INK }}
            >
              {kpi.value}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Funding structure */}
      <section>
        <h2
          className="text-lg font-semibold mb-3"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          Funding structure
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              icon: FileText,
              label: "NOHFC Enhance Your Community",
              value: "50%",
              detail: "Human capacity costs — practitioners, coordinators, staff",
            },
            {
              icon: FileText,
              label: "FedNor CEDD",
              value: "50%",
              detail: "Human capacity costs — same envelope, different federal stream",
            },
            {
              icon: Truck,
              label: "LFIF — Distribution Truck",
              value: "Separate",
              detail: "Capital asset only. Arriving summer/fall 2026. Operated by Rockfront.",
            },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="rounded-xl border p-4"
                style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 flex-shrink-0" style={{ color: ACCENT }} />
                  <p className="text-xs font-semibold">{f.label}</p>
                </div>
                <p
                  className="text-2xl font-semibold mb-1"
                  style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}
                >
                  {f.value}
                </p>
                <p className="text-xs text-muted-foreground">{f.detail}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Headwaters' 2026 planning year engagement is funded directly by Deer Lake First Nation —
          this is separate from the grant-funded team contracts that start January 2027.
          Grant decisions expected September–November 2026.
        </p>
      </section>

      {/* 2026 Milestones — the main tracker */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            2026 planning milestones
          </h2>
          <p className="text-xs text-muted-foreground">Click a status badge to update it · saved locally</p>
        </div>
        <MilestoneTracker />
      </section>

      {/* Team */}
      <section>
        <h2
          className="text-lg font-semibold mb-3"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          Contracted team at launch (January 2027)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TeamCard
            org="Headwaters"
            person="you"
            role="Northern Coordinator"
            location="Dryden / Deer Lake corridor"
            scope="Deer Lake relationship management, community store development, pilot governance. Project-based deliverables — not day-to-day operations. This is the grant budget line Headwaters holds."
            isHeadwaters
          />
          <TeamCard
            org="Superior Seasons"
            person="Kevin Belluz"
            role="Supply Coordinator"
            location="Thunder Bay"
            scope="Producer aggregation from Thunder Bay and NWO suppliers. Secures the product that goes in the truck. Kevin's existing supplier relationships are what makes the supply side of this viable."
          />
          <TeamCard
            org="Rockfront Family Farm"
            person="Tyler Bernier"
            role="Distribution Coordinator"
            location="Sioux Lookout"
            scope="Routes and logistics — planning the winter road runs, scheduling deliveries, operating the LFIF truck. Tyler confirms road access, weight limits, and the January 2027 pilot schedule."
          />
          <TeamCard
            org="Deer Lake First Nation"
            person="TBD — recruit by Dec 2026"
            role="Community Intake Coordinator"
            location="Deer Lake"
            scope="Store-side receiving, local distribution, and reporting. Strongly preferred: a Deer Lake First Nation community member. Backup: working holiday arrangement (outside couple, room and board). This person makes or breaks the January pilot."
          />
        </div>
      </section>

      {/* 2027 Phases */}
      <section>
        <h2
          className="text-lg font-semibold mb-3"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          Project phases — 2027
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <PhaseCard
            icon={Snowflake}
            period="January – May 2027"
            title="Winter road distribution pilot"
            items={[
              "First deliveries on winter roads",
              "Tyler plans and runs the routes",
              "Kevin's producers supply the load",
              "Deer Lake coordinator handles receiving",
              "Headwaters governs the pilot and manages the community relationship",
            ]}
          />
          <PhaseCard
            icon={Sun}
            period="May – November 2027"
            title="Summer distribution — continuous route"
            items={[
              "Transition from winter road to summer access",
              "Continuous weekly or bi-weekly route",
              "Producer contracts expand if pilot volume warrants",
              "Community distribution process validated and documented",
            ]}
          />
          <PhaseCard
            icon={Flag}
            period="December 2027"
            title="Wrap-up and replication blueprint"
            items={[
              "Final reporting to NOHFC and FedNor",
              "Replication guide finalized for other remote First Nations",
              "Producer contracts reviewed for year 2",
              "Community coordinator retained and trained",
              "Winter road 2028 routes pre-planned",
            ]}
          />
        </div>
      </section>

      {/* What success looks like */}
      <section>
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
        >
          <h2
            className="text-base font-semibold mb-4"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            What success looks like at end of 2027
          </h2>
          <ul className="space-y-3">
            {[
              "A functioning, documented supply chain from NWO producers to Deer Lake First Nation.",
              "A trained, local community coordinator in place — ideally a Deer Lake community member, contracted and retained.",
              "Signed producer contracts with at least the anchor NWO suppliers.",
              "Proven winter road routes (January–April) and summer routes (May–November).",
              "A replication guide that can be adapted for other remote First Nations communities without rebuilding from scratch.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
