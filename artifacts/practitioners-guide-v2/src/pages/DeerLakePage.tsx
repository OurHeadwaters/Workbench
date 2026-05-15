/**
 * DeerLakePage — Deer Lake Food Security Distribution Network
 *
 * Headwaters role: Northern Coordinator
 * Discovery & planning: May–December 2026 (funded by Deer Lake First Nation)
 * Project launch: January 2027 (first winter road run)
 *
 * Lead applicant: 807 Food Co-operative & Hub (Dryden, ON)
 * Funding: NOHFC Enhance Your Community (50%) + FedNor CEDD (50%) = 100% human capacity
 * Truck: LFIF (arriving summer/fall 2026)
 * Applications due: June 15, 2026 | Decisions: ~90 days from submission (Sep–Oct 2026)
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
  HelpCircle,
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

interface OpenQuestion {
  id: string;
  question: string;
  why: string;
  blocksWhat: string;
  decideBy?: string;
}

function decideByLabel(isoDate: string): string {
  const d = new Date(isoDate);
  const q = Math.ceil((d.getUTCMonth() + 1) / 3);
  return `Q${q} ${d.getUTCFullYear()}`;
}

function isOverdue(isoDate: string): boolean {
  return new Date(isoDate) < new Date();
}

function DecideByBadge({ decideBy }: { decideBy: string }) {
  const overdue = isOverdue(decideBy);
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border flex-shrink-0"
      style={
        overdue
          ? { backgroundColor: "#fee2e2", color: "#991b1b", borderColor: "#fca5a5" }
          : { backgroundColor: "#fefce8", color: "#854d0e", borderColor: "#fde047" }
      }
      title={`Decide by ${decideBy}`}
    >
      {overdue ? "Overdue" : `Due ${decideByLabel(decideBy)}`}
    </span>
  );
}

/* ─── Milestone data ─────────────────────────────────────── */

const MILESTONES: Milestone[] = [
  // ── Phase 1: Grant applications (due June 15) ─────────────
  {
    id: "letter-of-support",
    group: "Phase 1 · Grant applications (due June 15)",
    title: "Letter of support from Deer Lake First Nation",
    owner: "Headwaters → Deer Lake Chief & Council",
    deadline: "Before June 15, 2026",
    deadlineFlag: "critical",
    detail:
      "The single most important document for the grant applications. Without it, neither NOHFC nor FedNor will score the application favourably. Headwaters' role: draft the language, walk council through what they're signing, and confirm the letter is in 807's hands before submission.",
  },
  {
    id: "scope-defined",
    group: "Phase 1 · Grant applications (due June 15)",
    title: "Headwaters' northern coordination scope documented",
    owner: "Headwaters",
    deadline: "Before June 15, 2026",
    deadlineFlag: "critical",
    detail:
      "Clear, grant-defensible deliverables for Headwaters' coordination contract: Deer Lake relationship management, community store development support, pilot governance, progress reporting. Must be framed as project-based (not operational) so the NOHFC/FedNor budget line holds up under review. This scope also defines Headwaters' 2026 billing basis to Deer Lake First Nation.",
  },
  {
    id: "grant-submission",
    group: "Phase 1 · Grant applications (due June 15)",
    title: "NOHFC EYC + FedNor CEDD application submitted",
    owner: "Headwaters (writing) + 807 Food Co-op (lead applicant)",
    deadline: "June 15, 2026",
    deadlineFlag: "critical",
    detail:
      "Headwaters writes the application. 807 Food Co-operative & Hub is the named lead applicant. NOHFC Enhance Your Community (50%) + FedNor CEDD (50%) = human bodies and logistics planning. All contractor costs — Headwaters, Kevin, Tyler, and the community coordinator — are written into the grant budget so the numbers work for every party. LFIF is a separate application covering the truck and food infrastructure equipment. Decisions come back within 90 days of submission — faster if letters of support and a few well-placed calls are in early.",
  },
  // ── Phase 2: Community discovery (June–September) ─────────
  {
    id: "community-visits",
    group: "Phase 2 · Community discovery (June–September)",
    title: "On-the-ground visits to Deer Lake — needs assessment",
    owner: "Headwaters",
    deadline: "By September 2026",
    detail:
      "Headwaters needs at least one in-person visit to Deer Lake before the pilot launches. Goals: understand how the community currently accesses food, who the trusted people are, what the store setup looks like, and what intake coordination will actually require. This visit is what makes the coordinator recruitment real — you can't write a job description for a role you haven't seen operate in context.",
  },
  {
    id: "hotel-anchor",
    group: "Phase 2 · Community discovery (June–September)",
    title: "Hotel anchor agreement in place — Gilles' operation anchors initial supply",
    owner: "Headwaters + Gilles",
    deadline: "By July 2026",
    detail:
      "The existing hotel Gilles built at Deer Lake's request is the anchor customer — the kitchen restocks weekly, the band likes what he's built, and his weekly food needs will define the initial product list. The store doesn't open to the public in summer 2026. It's a staging area and receiving depot for the hotel operation. Gilles' guys get the physical infrastructure in place (freezers, shelving, electrical) during the summer. Air supply continues through Gilles — his plane is usually full, but a second flight is available if the band wants more food and arranges it. Headwaters' job: document the weekly demand from the hotel so the 2027 winter road supply runs have real numbers behind them. Note: the couple running the hotel is showing burnout signs (4am–8pm days, 6-month turnover cycle). This is a separate but important problem — better scheduling and economic models could stabilize that operation. Flag for future engagement scope with Gilles, not part of the current grant work.",
  },
  {
    id: "store-plan",
    group: "Phase 2 · Community discovery (June–September)",
    title: "Store infrastructure in place — staging area ready for January grand opening",
    owner: "Headwaters + Gilles' team + Deer Lake community store",
    deadline: "By November 2026",
    detail:
      "Gilles' team installs the physical infrastructure during summer 2026: freezers, shelving, electrical, receiving setup. The 807 cold room already on site gets confirmed operational and correctly sized. The store isn't open to the public yet — it's a hotel staging area through the end of 2026. The goal is a grand opening at the end of January 2027, timed to coincide with the first 807 winter road delivery. Headwaters documents the receiving process end-to-end so the coordinator hire knows exactly what they're walking into on day one.",
  },
  {
    id: "lfif-cashflow",
    group: "Phase 2 · Community discovery (June–September)",
    title: "LFIF cashflow strategy confirmed — can we purchase before the grant pays out?",
    owner: "Headwaters + 807 Food Co-op",
    deadline: "By August 2026",
    detail:
      "The LFIF cashflow mechanism is confirmed. Eligibility opens at the deemed-complete date — the date AAFC acknowledges receipt of a complete application — not the approval date. Equipment and infrastructure purchases made after that date fall within the eligible reimbursement window. The sequence is: Apply → AAFC deems application complete → contractor purchases infrastructure → AAFC approves → contribution agreement is signed → receipts from the deemed-complete date onward are submitted → reimbursement flows. The contractor and Deer Lake carry the cash risk from the point of purchase until the contribution agreement is signed. AAFC explicitly warns that pre-approval spending 'may not be reimbursed' — this is real risk, not a technicality. The plan is for the equipment cost to be reimbursed: the program is exactly what LFIF funds, and prior success with LFIF makes approval likely. But 'likely' is not 'guaranteed' until the contribution agreement is executed. Anyone purchasing equipment ahead of that sign-off needs to understand this clearly and have it documented in writing before any purchases are made.",
  },
  {
    id: "truck-received",
    group: "Phase 2 · Community discovery (June–September)",
    title: "LFIF truck and food infrastructure equipment in place",
    owner: "807 Food Co-op / LFIF",
    deadline: "By November 2026",
    detail:
      "If the cashflow strategy above is confirmed, infrastructure — truck, cold storage, handling gear — should be purchased and in place by November so the January pilot isn't waiting on equipment. If backdating isn't confirmed, this milestone shifts to post-grant-approval and the January start is at risk. Either way, Tyler needs the truck operational before he can plan the first run.",
  },
  // ── Phase 3: Build readiness (October–December) ───────────
  {
    id: "grant-decisions",
    group: "Phase 3 · Build readiness (October–December)",
    title: "Grant decisions received — contracts activated",
    owner: "807 Food Co-op (lead) + all partners",
    deadline: "September–October 2026 (~90 days from submission)",
    detail:
      "NOHFC and FedNor decisions land roughly 90 days after submission. That's September–October if we're in by June 15. Can be pushed faster with proactive calls to program officers and strong letters of support landing early. If approved: 807 activates the contracted team, all contractor costs flow as written in the budget, and the January 2027 clock is running. If rejected: fallback options need to be ready before the decision arrives.",
  },
  {
    id: "coordinator-recruited",
    group: "Phase 3 · Build readiness (October–December)",
    title: "Deer Lake community intake coordinator recruited",
    owner: "Headwaters (recruitment lead)",
    deadline: "Ready to contract by November 2026",
    detail:
      "This hire needs two months of runway before January to onboard properly. A Deer Lake First Nation community member is strongly preferred — it strengthens the grant narrative and long-term sustainability. Backup: working holiday arrangement (outside couple, room and board). Recruitment should start before grant decisions arrive — don't wait for the cheque to find the person.",
  },
  {
    id: "winter-roads",
    group: "Phase 3 · Build readiness (October–December)",
    title: "Winter road route confirmed and scheduled",
    owner: "Tyler Bernier / Rockfront (routes) + Headwaters (community access)",
    deadline: "By November 2026",
    detail:
      "Winter roads to Deer Lake are typically open January through April. Tyler locks: road access dates, weight limits, scheduling window, carrier requirements, and the first run date. Headwaters confirms the community side — someone is there to receive the first delivery and the coordinator is ready. The January start date is only real when both sides are confirmed.",
  },
  {
    id: "producer-contracts",
    group: "Phase 3 · Build readiness (October–December)",
    title: "Anchor producer contracts in place",
    owner: "Kevin Belluz / Superior Seasons (Thunder Bay)",
    deadline: "By December 2026",
    detail:
      "Kevin handles supply coordination and producer aggregation from Thunder Bay. At least the anchor producers need signed commitments before January 2027 so the pilot launches with real, confirmed product — not letters of intent. The pilot only proves what it claims to prove if the supply side is solid from day one.",
  },
  // ── Phase 4: Bridge funding decision (Q3 2027) ────────────
  {
    id: "bridge-funding-decision",
    group: "Phase 4 · Bridge funding decision (Q3 2027)",
    title: "Confirm bridge funding source and file application",
    owner: "Headwaters + 807 Food Co-op + Deer Lake First Nation",
    deadline: "Q3 2027",
    deadlineFlag: "critical",
    detail:
      "NOHFC and FedNor grants end December 2027. The bridge from grant-funded (Dec 2027) to independent (Mid 2028) must be decided and filed no later than Q3 2027 — application windows for OTF Seed or Grow and ROD close well before the grants expire. Options on the table: Gilles (anchor customer / infrastructure partner), OTF Seed or Grow, ROD, FCDF, or Deer Lake band reserves. Waiting until December 2027 puts the coordinator role, the store's continuity, and the entire 2027 pilot investment at risk. Decide the lead funding source, confirm who applies, and file by end of Q3 2027. If Gilles is the answer, structure that agreement before year-end 2027.",
  },
];

/* ─── Project timeline stages ───────────────────────────── */

type StageStatus = "past" | "active" | "upcoming";

type FundingType = "band" | "grant" | "bridge";

interface Stage {
  id: string;
  label: string;
  period: string;
  description: string;
  status: StageStatus;
  fundingType: FundingType;
  funding: string;
  fundingNote: string;
}

const FUNDING_CONFIG: Record<FundingType, { color: string; bg: string; border: string }> = {
  grant:  { color: "#065f46", bg: "#d1fae5", border: "#6ee7b7" },
  band:   { color: "#92400e", bg: "#fef3c7", border: "#fcd34d" },
  bridge: { color: "#7c3aed", bg: "#ede9fe", border: "#c4b5fd" },
};

const STAGES: Stage[] = [
  {
    id: "stage-1",
    label: "Stage 1",
    period: "2026",
    description: "Planning & Development",
    status: "active",
    fundingType: "band",
    funding: "Band-funded",
    fundingNote: "Headwaters billed directly to Deer Lake First Nation. LFIF truck application pending — approval not guaranteed until contribution agreement is signed.",
  },
  {
    id: "stage-2",
    label: "Stage 2",
    period: "Jan – Dec 2027",
    description: "Partnership Pilot with 807 Food Co-op (winter road runs + summer route)",
    status: "upcoming",
    fundingType: "grant",
    funding: "Grant-funded",
    fundingNote: "NOHFC Enhance Your Community (50%) + FedNor CEDD (50%) cover all human capacity costs. Decision expected Sep–Oct 2026 (~90 days from June 15 submission).",
  },
  {
    id: "stage-3",
    label: "Stage 3",
    period: "Early 2028",
    description: "Transition to independence",
    status: "upcoming",
    fundingType: "bridge",
    funding: "Bridge needed",
    fundingNote: "NOHFC/FedNor grants end Dec 2027. Early 2028 transition likely requires bridge funding — Gilles, OTF Seed or Grow, ROD, FCDF, or band reserves. Plan before year-end 2027.",
  },
  {
    id: "stage-4",
    label: "Stage 4",
    period: "Mid 2028",
    description: "Project Handoff",
    status: "upcoming",
    fundingType: "band",
    funding: "Band / self-sustaining",
    fundingNote: "Community store and coordinator operating independently. Gilles' supply and any remaining community grants are the backstop. No external grant funding assumed at this stage.",
  },
];

/* ─── FundingPill sub-component ──────────────────────────── */

function FundingPill({
  type,
  label,
  note,
}: {
  type: FundingType;
  label: string;
  note: string;
}) {
  const cfg = FUNDING_CONFIG[type];
  return (
    <span
      className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded border"
      style={{ color: cfg.color, backgroundColor: cfg.bg, borderColor: cfg.border }}
      title={note}
    >
      {label}
    </span>
  );
}

/* ─── ProjectTimeline component ──────────────────────────── */

function ProjectTimeline() {
  return (
    <section>
      <p
        className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold mb-3"
        style={{ color: ACCENT }}
      >
        Project timeline — 2026 → 2028
      </p>

      {/* Desktop: horizontal */}
      <div
        className="hidden sm:block rounded-xl border p-5"
        style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
      >
        <div className="relative flex items-start">
          {STAGES.map((stage, idx) => {
            const isActive = stage.status === "active";
            const isPast = stage.status === "past";
            const isLast = idx === STAGES.length - 1;

            const dotBg = isActive ? ACCENT : isPast ? ACCENT : "hsl(var(--muted))";
            const dotBorder = isActive ? ACCENT : isPast ? ACCENT : "hsl(var(--border))";
            const labelColor = isActive ? ACCENT : isPast ? ACCENT : "hsl(var(--muted-foreground))";
            const textOpacity = stage.status === "upcoming" ? "opacity-60" : "";

            return (
              <div key={stage.id} className="flex-1 flex flex-col items-center relative">
                {/* Connector line (skip for last item) */}
                {!isLast && (
                  <div
                    className="absolute top-[10px] left-1/2 w-full h-px"
                    style={{
                      backgroundColor:
                        isPast || isActive ? ACCENT : "hsl(var(--border))",
                      opacity: stage.status === "upcoming" ? 0.35 : 0.6,
                    }}
                  />
                )}

                {/* Dot */}
                <div
                  className="relative z-10 h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: dotBg, borderColor: dotBorder }}
                >
                  {isActive && (
                    <span className="block h-2 w-2 rounded-full bg-white" />
                  )}
                </div>

                {/* Content below dot */}
                <div className={`mt-3 px-2 text-center ${textOpacity}`}>
                  <div
                    className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded mb-1"
                    style={{
                      backgroundColor: isActive ? ACCENT_SOFT : "transparent",
                      color: labelColor,
                      border: isActive ? `1px solid ${ACCENT}` : "1px solid transparent",
                    }}
                  >
                    {stage.label}
                  </div>
                  <p
                    className="text-[11px] font-semibold leading-tight mb-1"
                    style={{ color: isActive ? ACCENT_INK : "hsl(var(--foreground))" }}
                  >
                    {stage.period}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-snug mb-2">
                    {stage.description}
                  </p>
                  <FundingPill type={stage.fundingType} label={stage.funding} note={stage.fundingNote} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical */}
      <div
        className="sm:hidden rounded-xl border divide-y"
        style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
      >
        {STAGES.map((stage) => {
          const isActive = stage.status === "active";
          const isPast = stage.status === "past";
          return (
            <div
              key={stage.id}
              className="flex items-start gap-3 p-4"
              style={{
                background: isActive ? ACCENT_SOFT : "transparent",
              }}
            >
              <div
                className="mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: isActive || isPast ? ACCENT : "hsl(var(--muted))",
                  borderColor: isActive || isPast ? ACCENT : "hsl(var(--border))",
                }}
              >
                {isActive && <span className="block h-1.5 w-1.5 rounded-full bg-white" />}
              </div>
              <div className={stage.status === "upcoming" ? "opacity-60" : ""}>
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: isActive ? ACCENT : "hsl(var(--muted-foreground))" }}
                  >
                    {stage.label}
                  </span>
                  <span className="text-[11px] font-semibold" style={{ color: isActive ? ACCENT_INK : "hsl(var(--foreground))" }}>
                    {stage.period}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-snug mb-1.5">{stage.description}</p>
                <FundingPill type={stage.fundingType} label={stage.funding} note={stage.fundingNote} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Open questions ─────────────────────────────────────── */

const OPEN_QUESTIONS: OpenQuestion[] = [
  {
    id: "billing-model",
    question: "What does Headwaters bill Deer Lake First Nation for in 2026, and how?",
    why: "You're doing real work this year — community visits, scope documentation, relationship management, grant support. That needs a billing structure. Is it hourly at $175/hr, a fixed monthly retainer, or a project-based contract? The scope document you write for the grant application should also define your 2026 billing basis.",
    blocksWhat: "Your own cash flow clarity for 2026, and the grant budget line needs to match what you actually charge.",
  },
  {
    id: "contingency",
    question: "What's the plan if NOHFC and FedNor both say no?",
    why: "Decisions land roughly 90 days from June 15 — call it September–October. You will have spent most of the year on discovery and relationship-building by then. If both funders decline, do you self-fund a smaller proof-of-concept run? Defer to 2028? Find an alternative funder (e.g. FCDF, OTF Seed or Grow, ROD)? The answer needs to exist before the decision arrives so you're not making it under pressure. Worth noting: a strong phone call campaign to program officers before submission can move the timeline and signal intent.",
    blocksWhat: "Your fallback position. 807's AGM strategic plan already has ROD and OTF as backstops — know where you fit in that contingency.",
  },
  {
    id: "community-contact",
    question: "Who is the named Deer Lake contact Headwaters works through?",
    why: "The northern coordination role only works if there's a trusted named person in the community — chief, economic development officer, health director, store manager, or someone else with credibility and continuity. Without a named contact, the relationship exists on paper but not in practice.",
    blocksWhat: "Community visits, the needs assessment, coordinator recruitment, and the receiving process documentation all require this person.",
  },
  {
    id: "scope-boundary",
    question: "Where does Headwaters' coordination end and 807's operations begin?",
    why: "The grant application needs a clean line between what 807 does (lead applicant, truck, supply chain management, financials) and what Headwaters does (northern relationship, community development, governance). If this line is blurry, NOHFC reviewers will question whether Headwaters is a coordinator or a subcontractor, which affects how the budget is scored.",
    blocksWhat: "The grant scope document (due June 15) and your long-term positioning in the project.",
  },
  {
    id: "coordinator-backup",
    question: "If no local coordinator is available by November, what's the backup?",
    why: "The working holiday model (outside couple, room and board) is a real backup, but it needs to be scoped now — what's the offer, what's the cost, who recruits, how does it work logistically in Deer Lake? Waiting until November to answer this is too late for a January start.",
    blocksWhat: "The January 2027 pilot. If no coordinator is in place, the pilot doesn't happen.",
  },
  {
    id: "gilles-prepaid",
    question: "Gilles pre-paid services agreement — $72k sitting, ready to reactivate",
    why: "His company paid Headwaters $72,000 as a sole proprietor, held as business debt toward future business development services. The agreement was paused when his family went through an extended difficult period — his wife's mother was ill and then dying for roughly 18 months. Things have now settled. On Headwaters' side, those same 18 months were spent building the skills, tools, and data architecture that make this proposal real. Two years ago the mandate was vague and the tools weren't ready. Now the brief is sharp and the tooling exists — Whisper handles French Canadian accent, the knowledge capture patterns are proven, the data has been accumulating. The delay produced a better offer than early delivery would have. Proposed structure: spring tooling (voice tool, knowledge capture, legacy architecture — 2 weeks) is the first draw against that credit. Hourly work toward specific objectives they define beyond that scope clears the remainder at $175/hr. No new cheque from Gilles required — the money is already paid. The value case is concrete: a multi-million dollar operation that currently isn't sellable becomes genuinely sellable within 2 years, or he keeps running it from Dryden indefinitely with a system that doesn't depend on him being there. Either outcome returns multiples on the $72k.",
    blocksWhat: "Your own cashflow clarity. The $72k is a real asset sitting idle. Frame the reactivation to Gilles as exactly what it is: the work you both agreed on, at the moment it can finally be done right.",
  },
  {
    id: "lfif-backdating",
    question: "Document the LFIF risk framing in writing with the contractor and Deer Lake before any purchases are made.",
    why: "The LFIF cashflow mechanism is now confirmed: eligibility opens at the deemed-complete date (when AAFC acknowledges receipt of a complete application), and purchases after that date fall within the eligible reimbursement window. The contractor and Deer Lake carry the cash from purchase until the contribution agreement is signed — there is no reimbursement without a signed agreement. AAFC explicitly warns that pre-approval spending 'may not be reimbursed.' Prior success with LFIF and the clear fit of this project make approval likely, but 'likely' is not 'guaranteed.' That distinction needs to be understood and accepted by both parties — in writing — before a single purchase is made.",
    blocksWhat: "Any infrastructure purchase ahead of the signed contribution agreement. The policy question is resolved; what remains is ensuring the contractor and Deer Lake have a documented, mutual understanding of who carries the risk and what 'may not be reimbursed' actually means in practice.",
  },
  {
    id: "bridge-funding-2028",
    question: "How does the project bridge from grant-funded (Dec 2027) to independent (Mid 2028) — and who decides by Q3 2027?",
    decideBy: "2027-09-30",
    why: "NOHFC and FedNor grants end December 2027. Stage 3 (Early 2028) is marked 'Bridge needed' on the timeline, but that label doesn't force a decision. The options are already on the table — Gilles (as anchor customer and infrastructure partner), OTF Seed or Grow, ROD, FCDF, or Deer Lake band reserves — but none of them activate themselves. The window to apply for OTF Seed or Grow or ROD closes well before December 2027, which means the bridge decision needs to be made and the application filed no later than Q3 2027. Waiting until the grants expire to figure this out puts the coordinator job, the store's continuity, and the entire 2027 pilot investment at risk.",
    blocksWhat: "Stage 3 launch (Early 2028) and the coordinator role continuing past December 2027. Decide by Q3 2027 — identify the lead funding source, confirm who applies, and file. If Gilles is the answer, structure that agreement before year-end 2027.",
  },
];

/* ─── Status config ──────────────────────────────────────── */

const STATUS_CONFIG: Record<
  MilestoneStatus,
  { label: string; icon: typeof CheckCircle2; color: string; bg: string }
> = {
  done: { label: "Done", icon: CheckCircle2, color: "#065f46", bg: "#d1fae5" },
  "in-progress": { label: "In Progress", icon: Clock, color: "#92400e", bg: "#fef3c7" },
  "at-risk": { label: "At Risk", icon: AlertTriangle, color: "#991b1b", bg: "#fee2e2" },
  tbd: { label: "TBD", icon: Circle, color: "hsl(var(--muted-foreground))", bg: "hsl(var(--muted))" },
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
    <div className="space-y-5">
      {/* Progress bar */}
      <div
        className="rounded-xl border p-4"
        style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            2026 readiness progress
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
            style={{ width: `${(doneCount / MILESTONES.length) * 100}%`, backgroundColor: "#065f46" }}
          />
        </div>
        <div className="flex gap-4 mt-2 text-[11px] text-muted-foreground">
          <span className="text-emerald-700 font-medium">{doneCount} done</span>
          <span className="text-amber-700 font-medium">{inProgCount} in progress</span>
          {atRiskCount > 0 && <span className="text-red-700 font-semibold">{atRiskCount} at risk</span>}
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
                            <p className={`text-sm font-semibold leading-snug ${isDone ? "line-through text-muted-foreground" : ""}`}>
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
                      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{m.detail}</p>
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
          {person && <p className="text-xs text-muted-foreground">{person}</p>}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: isHeadwaters ? ACCENT : "hsl(var(--muted))",
                color: isHeadwaters ? "#fff" : "hsl(var(--foreground))",
              }}
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
          <p className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground">{period}</p>
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
        <p className="text-xs font-medium uppercase tracking-[0.2em] mb-2" style={{ color: ACCENT }}>
          Deer Lake First Nation · Food Security Distribution Network
        </p>
        <h1
          className="text-3xl font-semibold leading-tight mb-3"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          Discovery & Planning — 2026
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Headwaters' 2026 mandate is discovery and planning — no paid food team, no air freight,
          just the work that makes January 2027 real. Existing supply to the community continues
          through Gilles while the partnership is being built. The grant goes in June 15. Decisions
          back within 90 days. 807 joins when the funding lands and takes the edge off everyone.
          The goal: infrastructure in place, coordinator recruited, and route confirmed before
          the first winter road opens.
        </p>
      </header>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Grant applications due", value: "June 15, 2026", sub: "NOHFC EYC + FedNor CEDD", urgent: true },
          { label: "Headwaters planning scope", value: "Full year", sub: "May → December 2026" },
          { label: "First winter road run", value: "Jan 2027", sub: "Target launch with 807" },
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
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">{kpi.label}</p>
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

      {/* Project timeline */}
      <ProjectTimeline />

      {/* Alignment with 807 */}
      <section>
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: ACCENT, borderWidth: "1.5px", background: ACCENT_SOFT }}
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: ACCENT }}>
            How this aligns with 807's strategic plan
          </p>
          <h2 className="text-base font-semibold mb-3" style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}>
            Same destination, two roles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground mb-1">807's role</p>
              <ul className="space-y-1">
                {[
                  "Lead grant applicant — NOHFC EYC + FedNor CEDD",
                  "LFIF truck + food infrastructure equipment (separate application)",
                  "Supply chain management via Kevin Belluz / Superior Seasons",
                  "Distribution route via Tyler Bernier / Rockfront",
                  "Financial management and reporting to funders",
                  "CDP grant backstop for co-op development support",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1 w-1 rounded-full flex-shrink-0 bg-muted-foreground" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1" style={{ color: ACCENT_INK }}>Headwaters' role</p>
              <ul className="space-y-1">
                {[
                  "Northern relationship — Deer Lake First Nation",
                  "Community needs assessment and on-the-ground discovery",
                  "Community store receiving plan development",
                  "Coordinator recruitment and onboarding support",
                  "Pilot governance — bridge between 807 and the community",
                  "Progress reporting and replication documentation",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1 w-1 rounded-full flex-shrink-0" style={{ backgroundColor: ACCENT }} />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground border-t pt-3" style={{ borderColor: "#c5dcee" }}>
            807's AGM strategic plan names this as Pillar 02 (Deer Lake partnership). The CDP grant
            in their pipeline covers co-op development support — tooling adaptation, community development
            engagement, and the white-label playbook. That's adjacent to what Headwaters does but
            not the same budget line. Headwaters is the relationship and coordination layer;
            807 is the logistics and capital layer. Headwaters writes the grant — all contractor
            costs are built in so the numbers work for every party. The two roles need a clean
            written boundary before June 15 so the grant budget reflects it accurately.
          </p>
        </div>
      </section>

      {/* Funding structure */}
      <section>
        <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--app-font-serif)" }}>
          Funding structure
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              icon: FileText,
              label: "NOHFC Enhance Your Community",
              value: "50%",
              detail: "Human capacity costs — practitioners, coordinators, contracted staff",
            },
            {
              icon: FileText,
              label: "FedNor CEDD",
              value: "50%",
              detail: "Human capacity costs — same envelope, different federal stream",
            },
            {
              icon: Truck,
              label: "LFIF — Truck + Food Infrastructure",
              value: "Separate",
              detail: "Separate LFIF application. Covers the distribution truck and food infrastructure equipment. Arriving summer/fall 2026. Operated by Tyler / Rockfront.",
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
                <p className="text-2xl font-semibold mb-1" style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}>
                  {f.value}
                </p>
                <p className="text-xs text-muted-foreground">{f.detail}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Headwaters' 2026 discovery and planning work is billed directly to Deer Lake First Nation —
          separate from the grant-funded team contracts that activate on approval.
          Grant decisions expected within 90 days of submission — September–October 2026 if in by June 15.
          Can be pushed faster with early letters of support and proactive calls to program officers.
        </p>
      </section>

      {/* 2026 Milestones */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--app-font-serif)" }}>
            2026 readiness milestones
          </h2>
          <p className="text-xs text-muted-foreground">Click a badge to update · saved locally</p>
        </div>
        <MilestoneTracker />
      </section>

      {/* Open questions — what Headwaters needs to work out */}
      <section>
        <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: "var(--app-font-serif)" }}>
          What Headwaters needs to work out
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          These are open questions on your side — things 807 can't answer for you, and that need
          answers before the plan is fully solid.
        </p>
        <div className="space-y-3">
          {OPEN_QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="rounded-xl border p-4"
              style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
              data-testid={`open-question-${q.id}`}
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap mb-2">
                    <p className="text-sm font-semibold leading-snug">{q.question}</p>
                    {q.decideBy && <DecideByBadge decideBy={q.decideBy} />}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{q.why}</p>
                  <p className="text-[11px] font-semibold" style={{ color: ACCENT }}>
                    Blocks: <span className="font-normal text-muted-foreground">{q.blocksWhat}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section>
        <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: "var(--app-font-serif)" }}>
          Contracted team at launch (January 2027)
        </h2>
        <p className="text-sm text-muted-foreground mb-3">
          These are the four roles the grant application funds. Headwaters is one budget line in this team.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TeamCard
            org="Headwaters"
            person="you"
            role="Northern Coordinator"
            location="Dryden / Deer Lake corridor"
            scope="Deer Lake relationship management, community store development, pilot governance, progress reporting. Project-based deliverables — not day-to-day operations. Discovery and planning work starts now; formal contract activates on grant approval."
            isHeadwaters
          />
          <TeamCard
            org="Superior Seasons"
            person="Kevin Belluz"
            role="Supply Coordinator"
            location="Thunder Bay"
            scope="Producer aggregation from Thunder Bay and NWO suppliers. Secures and manages the product that goes in the truck. Kevin's existing supplier relationships are what makes the supply side viable from day one."
          />
          <TeamCard
            org="Rockfront Family Farm"
            person="Tyler Bernier"
            role="Distribution Coordinator"
            location="Sioux Lookout"
            scope="Routes and logistics — planning the winter road runs, scheduling deliveries, operating the LFIF truck. Tyler confirms road access, weight limits, and the January 2027 first-run schedule."
          />
          <TeamCard
            org="Deer Lake First Nation"
            person="TBD — recruit by November 2026"
            role="Community Intake Coordinator"
            location="Deer Lake"
            scope="Store-side receiving, local distribution, and reporting. Strongly preferred: a Deer Lake First Nation community member. Backup: working holiday arrangement. Recruitment starts before grant decisions arrive — don't wait for the cheque."
          />
        </div>
      </section>


      {/* 2027 Phases */}
      <section>
        <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--app-font-serif)" }}>
          Project phases — 2027
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <PhaseCard
            icon={Snowflake}
            period="January – May 2027"
            title="Winter road distribution pilot"
            items={[
              "First deliveries on winter roads",
              "Tyler plans and runs the routes from Dryden",
              "Kevin's producers supply the load",
              "Deer Lake coordinator handles receiving",
              "Headwaters governs the pilot and holds the community relationship",
              "Weekly check-ins across the four-person team",
            ]}
          />
          <PhaseCard
            icon={Sun}
            period="May – November 2027"
            title="Summer route — Gilles + 807 combined supply"
            items={[
              "Transition from winter road to summer access route",
              "Gilles continues air supply; 807 layering in as grant funding flows",
              "2026 hotel demand data drives the product list and delivery frequency",
              "807 takes the edge off — shared load, lower pressure on both suppliers",
              "Store fully open to the public; coordinator autonomous by end of summer",
              "Producer contracts expand if pilot volume warrants",
            ]}
          />
          <PhaseCard
            icon={Flag}
            period="December 2027"
            title="Wrap-up and replication blueprint"
            items={[
              "Final reporting to NOHFC and FedNor",
              "Replication guide for other remote First Nations",
              "Producer contracts reviewed for year 2",
              "Coordinator retained and trained to run independently",
              "Winter road 2028 routes pre-planned before freeze-up",
            ]}
          />
        </div>
      </section>

      {/* Success definition */}
      <section>
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
        >
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: "var(--app-font-serif)" }}>
            What success looks like at end of 2027
          </h2>
          <ul className="space-y-3">
            {[
              "A functioning, documented supply chain from NWO producers to Deer Lake First Nation — proven across two seasons.",
              "A trained, local community coordinator in place, contracted and retained for year two.",
              "Signed producer contracts with at least the anchor NWO suppliers, reviewed and renewed.",
              "Proven winter road routes (Jan–Apr) and summer routes (May–Nov) with Tyler's schedule as the operating baseline.",
              "A replication guide that can be adapted for other remote First Nations without rebuilding from scratch — this is the asset 807 can take to the next community.",
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
