/**
 * StrategicLedgerPage — the true north document.
 *
 * This is the page you open at the start of any new project.
 * It answers three questions:
 *   1. Where is Codetry actually going? (the destination)
 *   2. Does this piece of work belong on the trajectory? (the 5-question filter)
 *   3. What has been proven so far, and what still needs proof? (the ledger)
 *
 * Nothing on this page is decorative. Every element is load-bearing.
 */

import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Circle, AlertCircle } from "lucide-react";

const ACCENT = "#1f3d2e";
const ACCENT_SOFT = "#e8f0ec";
const ACCENT_INK = "#1a2e22";
const RUST = "#b85a3e";
const RUST_SOFT = "#fdf0ec";

// ─── Filter question card ─────────────────────────────────────────────────────

function FilterQuestion({
  n,
  question,
  note,
}: {
  n: string;
  question: string;
  note: string;
}) {
  return (
    <div
      className="flex items-start gap-4 rounded-xl border p-4"
      style={{ borderColor: ACCENT + "30", backgroundColor: ACCENT_SOFT }}
    >
      <span
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold flex-shrink-0 mt-0.5"
        style={{ backgroundColor: ACCENT, color: "#f4ede0" }}
      >
        {n}
      </span>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold leading-snug"
          style={{ color: ACCENT_INK }}
        >
          {question}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {note}
        </p>
      </div>
    </div>
  );
}

// ─── Engagement log row ───────────────────────────────────────────────────────

type ProofStatus = "proven" | "in-progress" | "needs-proof";

interface EngagementRow {
  name: string;
  type: "paid" | "unpaid" | "in-development";
  objectives: string[];
  status: ProofStatus;
  statusNote: string;
  codetryValue: string;
}

function StatusBadge({ status }: { status: ProofStatus }) {
  if (status === "proven") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md" style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}>
        <CheckCircle2 className="h-3 w-3" />
        Proven
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md" style={{ backgroundColor: RUST_SOFT, color: RUST }}>
        <Circle className="h-3 w-3" />
        Building proof
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
      <AlertCircle className="h-3 w-3" />
      Needs proof
    </span>
  );
}

function TypeTag({ type }: { type: EngagementRow["type"] }) {
  if (type === "paid") {
    return (
      <span className="text-[10px] uppercase tracking-[0.15em] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: ACCENT_SOFT, color: ACCENT }}>
        Paid
      </span>
    );
  }
  if (type === "unpaid") {
    return (
      <span className="text-[10px] uppercase tracking-[0.15em] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
        Unpaid
      </span>
    );
  }
  return (
    <span className="text-[10px] uppercase tracking-[0.15em] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: RUST_SOFT, color: RUST }}>
      In development
    </span>
  );
}

function EngagementCard({ row }: { row: EngagementRow }) {
  const objLabels: Record<string, string> = {
    "1": "Proves model",
    "2": "Builds practitioner",
    "3": "Improves tools",
    "4": "Builds record",
    "5": "Trust layer",
  };

  return (
    <div
      className="rounded-xl border bg-card p-4 space-y-3"
      style={{ borderLeftWidth: "3px", borderLeftColor: ACCENT }}
    >
      <div className="flex items-start gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-foreground">{row.name}</p>
            <TypeTag type={row.type} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {row.codetryValue}
          </p>
        </div>
        <StatusBadge status={row.status} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {row.objectives.map((n) => (
          <span
            key={n}
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
          >
            {objLabels[n] ?? `Q${n}`}
          </span>
        ))}
      </div>

      <p className="text-xs text-muted-foreground border-t pt-2" style={{ borderColor: "hsl(var(--card-border))" }}>
        <span className="font-medium text-foreground">Honest status: </span>
        {row.statusNote}
      </p>
    </div>
  );
}

// ─── Engagement data ──────────────────────────────────────────────────────────

const ENGAGEMENTS: EngagementRow[] = [
  {
    name: "Northern Band — Agency Contract (V4–V7)",
    type: "paid",
    objectives: ["1", "3", "4"],
    status: "proven",
    statusNote:
      "Proved the community store model produces a legible operating system. Naming discipline reduced handover friction. Financial records are community-held. This is the first brick.",
    codetryValue:
      "The founding engagement. Proved the model works — a community can own and operate a food system built with Codetry tools and hand it over without losing institutional memory.",
  },
  {
    name: "Deer Lake First Nation — Phase 1",
    type: "paid",
    objectives: ["1", "4"],
    status: "in-progress",
    statusNote:
      "Proving the model replicates in a new community context. Phase 2 data (demand, financial) is what backs the 807 supply chain grant applications. The proof point is the January 2027 winter road.",
    codetryValue:
      "The replication test. Can Codetry run in a second community without rebuilding from scratch? Deer Lake Phase 2 data becomes the first piece of auditable supply chain evidence.",
  },
  {
    name: "807 Food Co-operative — Supply Chain",
    type: "paid",
    objectives: ["1", "4", "5"],
    status: "in-progress",
    statusNote:
      "The supply chain connection between NWO producers and First Nations communities. The aggregation layer — pricing, cold chain, bulk delivery — is the infrastructure that makes Deer Lake work. Grant applications June 2026.",
    codetryValue:
      "Builds the record that outlasts any individual engagement. NWO producer → 807 → community store is a documented supply chain. That documentation is the first piece of the trust layer.",
  },
  {
    name: "Codetry Handbook — How a Community Runs Its Own Economy",
    type: "in-development",
    objectives: ["2", "3"],
    status: "in-progress",
    statusNote:
      "The practitioner manual. Not proven yet — needs a second practitioner to run an engagement from the handbook alone before this column changes. That test is the milestone.",
    codetryValue:
      "Codifies the discipline so another practitioner can run it without the founder in the room. The handbook is what turns Codetry from a practice into a replicable methodology.",
  },
  {
    name: "Brightside RT-LTC — SaaS Tool",
    type: "in-development",
    objectives: ["3", "4"],
    status: "needs-proof",
    statusNote:
      "The tool that pays for itself. Improves the practitioner toolkit and builds a revenue stream that funds future unpaid field work. Proof comes when a second buyer signs on without the engagement relationship as the reason.",
    codetryValue:
      "Proves Codetry can produce tools that outlast any individual contract — software that communities or service providers can own and run independently.",
  },
  {
    name: "Headwaters Print Marketing Suite",
    type: "unpaid",
    objectives: ["2", "3"],
    status: "proven",
    statusNote:
      "Practice and tooling. Built the PDF generation discipline, the Deer Lake print packet format, and the community outreach design language. All of this feeds back into future paid engagements as a faster, better starting point.",
    codetryValue:
      "Test of the principle: unpaid work with clear objective value improves the tools and trains the practitioner. The Deer Lake packet took a fraction of the time because this ground had been walked.",
  },
  {
    name: "Practitioners Guide V2 — this document",
    type: "unpaid",
    objectives: ["2", "3", "4"],
    status: "in-progress",
    statusNote:
      "The operating ledger for the practice itself. Proves the principle that a practitioner can maintain strategic coherence across 20-30 years of work if the framework is legible and updated in real time.",
    codetryValue:
      "This is the field manual and the record simultaneously. Every page is evidence of the discipline running on itself — Codetry applied to Codetry.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export function StrategicLedgerPage() {
  const paidCount = ENGAGEMENTS.filter((e) => e.type === "paid").length;
  const unpaidCount = ENGAGEMENTS.filter(
    (e) => e.type === "unpaid" || e.type === "in-development"
  ).length;
  const provenCount = ENGAGEMENTS.filter((e) => e.status === "proven").length;

  return (
    <div className="space-y-8" data-testid="page-strategic-ledger">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="back-to-dashboard"
      >
        <ArrowLeft className="h-3 w-3" />
        Dashboard
      </Link>

      {/* ── Page header ── */}
      <header className="space-y-4">
        <div className="flex items-start gap-3">
          <div
            className="h-10 w-10 rounded-md grid place-items-center flex-shrink-0"
            style={{ backgroundColor: ACCENT, color: "#f4ede0" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Codetry — strategic ledger
            </p>
            <h1
              className="mt-1 text-3xl font-semibold"
              style={{ fontFamily: "var(--app-font-serif)" }}
            >
              The long game.
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Open this page at the start of any new project. It names where Codetry is going,
              gives you a filter to evaluate any piece of work against that destination,
              and keeps an honest log of what's been proven and what still needs proof.
            </p>
          </div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Paid engagements", value: paidCount },
            { label: "Practice / development", value: unpaidCount },
            { label: "Proven on the ledger", value: provenCount },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border bg-card px-4 py-3"
              style={{ borderTopWidth: "3px", borderTopColor: ACCENT }}
            >
              <p
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}
              >
                {value}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </header>

      {/* ── Section 1: The destination ── */}
      <section className="space-y-4">
        <h2
          className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
        >
          The destination
        </h2>
        <div
          className="rounded-xl border p-6 space-y-4"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT, backgroundColor: ACCENT_SOFT }}
        >
          <p
            className="text-lg leading-relaxed"
            style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}
          >
            Codetry is building toward communities that own their economic
            infrastructure — the records, the tools, the methodology — in a form
            that cannot be extracted by consultants, captured by funders, or lost
            in a personnel change.
          </p>
          <p
            className="text-base leading-relaxed"
            style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK, opacity: 0.85 }}
          >
            The long-game is a trust layer: a ledger of real community economic
            activity — provable, auditable, portable — that backs grants, supply
            chain partnerships, and eventually inter-community trade without
            requiring an outside institution to validate it. Blockchain is not the
            product. It is the architecture that makes the ledger community-owned
            instead of consultant-held.
          </p>
          <p
            className="text-base leading-relaxed"
            style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK, opacity: 0.85 }}
          >
            Every engagement is a proof point. Every tool built is a brick.
            The 20-year window opened when the first community store ran its
            first day on a legible system with a named ledger. We are in the
            early innings of something most people will not understand for
            another decade.
          </p>
          <div
            className="border-t pt-4"
            style={{ borderColor: ACCENT + "40" }}
          >
            <p className="text-xs text-muted-foreground italic">
              This is not a mission statement. It is the navigational fixed point.
              When the day's work feels unmoored, read this paragraph first.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2: The 5-question filter ── */}
      <section className="space-y-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            The decision filter
          </h2>
          <p className="text-xs text-muted-foreground">
            Any piece of work — paid or unpaid — that answers yes to at least one of these belongs on the ledger.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FilterQuestion
            n="1"
            question="Does it prove the model in a new context?"
            note="New community, new sector, new region. Replication with evidence is how the model gains credibility it can't buy."
          />
          <FilterQuestion
            n="2"
            question="Does it build or train a practitioner?"
            note="Grows the network of people who can run the Codetry discipline independently — without the founder in the room."
          />
          <FilterQuestion
            n="3"
            question="Does it improve the tools or discipline itself?"
            note="Handbook refinement, new Codetry tools, better constellation models, improved gate logs. Practice that makes the next engagement faster and sharper."
          />
          <FilterQuestion
            n="4"
            question="Does it build a record that backs future work?"
            note="Financial proof, demand data, grant applications, supply chain evidence. The ledger grows with every piece of documented economic activity."
          />
          <FilterQuestion
            n="5"
            question="Does it advance the trust layer?"
            note="Portable records, auditable economic history, community-owned data infrastructure. The long infrastructure play — each step toward a ledger no outside institution controls."
          />
        </div>

        <div
          className="rounded-lg border px-4 py-3 text-sm leading-relaxed"
          style={{ borderColor: RUST + "40", backgroundColor: RUST_SOFT, color: RUST }}
        >
          <span className="font-semibold">The unpaid work doctrine: </span>
          If a piece of work has no contract but answers yes to at least one question above,
          it belongs on the ledger as practice and testing with a practical application.
          Name which question it answers. That naming is what separates purposeful unpaid
          work from drift.
          Work that answers none of the five questions may still be worth doing — call it
          cash flow, not trajectory, and budget for it accordingly.
        </div>
      </section>

      {/* ── Section 3: The engagement log ── */}
      <section className="space-y-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Engagement log
          </h2>
          <p className="text-xs text-muted-foreground">
            Every piece of work, mapped to the five objectives. Honest status — no smoothing.
          </p>
        </div>

        <div className="space-y-3">
          {ENGAGEMENTS.map((row) => (
            <EngagementCard key={row.name} row={row} />
          ))}
        </div>
      </section>

      {/* ── Section 4: Proven vs. needs proof ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          The honest accounting
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Proven */}
          <div
            className="rounded-xl border bg-card p-5 space-y-3"
            style={{ borderTopWidth: "3px", borderTopColor: ACCENT }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" style={{ color: ACCENT }} />
              <p className="text-sm font-semibold" style={{ color: ACCENT_INK }}>What's been proven</p>
            </div>
            <ul className="space-y-2">
              {[
                "The community store model produces a legible operating system a community can own.",
                "The naming discipline reduces handover friction — the next person can read what was built.",
                "Kitchen table methodology produces systems the operator recognises as theirs.",
                "One practitioner can hold the system the way ten used to, with the right tools.",
                "Unpaid practice work feeds directly back into paid engagement quality.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: ACCENT }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Needs proof */}
          <div
            className="rounded-xl border bg-card p-5 space-y-3"
            style={{ borderTopWidth: "3px", borderTopColor: RUST }}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" style={{ color: RUST }} />
              <p className="text-sm font-semibold" style={{ color: RUST }}>What still needs proof</p>
            </div>
            <ul className="space-y-2">
              {[
                "The model replicates in a second community without the founder managing both — Deer Lake is the test.",
                "A second practitioner can run an engagement from the handbook alone, without the founder in the room.",
                "The trust layer (the ledger) has standalone value beyond the engagement that produced it.",
                "Codetry tools produce revenue independent of any single client relationship.",
                "The supply chain documentation (807 + Deer Lake) constitutes evidence that backs a grant without additional narrative from the practitioner.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: RUST }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Footer note ── */}
      <div
        className="rounded-lg border px-4 py-3 text-xs text-muted-foreground leading-relaxed"
        style={{ borderColor: "hsl(var(--card-border))" }}
      >
        <span className="font-medium text-foreground">How to use this page: </span>
        When starting a new project, open this page first and ask whether the work
        answers at least one of the five filter questions. If yes — name which one,
        log the engagement, and proceed. If no — name it as cash flow and budget the
        time accordingly. Update the engagement log as proof accumulates. The honest
        accounting section should make you slightly uncomfortable. That discomfort
        is the discipline working.
      </div>
    </div>
  );
}
