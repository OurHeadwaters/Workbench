import { Link } from "wouter";
import {
  ScrollText,
  TestTube2,
  AlertTriangle,
  Anchor,
  ListChecks,
  Hammer,
  ExternalLink,
  ArrowLeft,
  Home,
} from "lucide-react";
import { SectionCard } from "@/components/SectionCard";
import { confirmed } from "@/data/tags";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  RENAME_MAP,
  DRIFT_SYMBOL_MEANINGS,
  STATUS_MEANINGS,
  parseInline,
  type DriftSymbol,
  type RenameRow,
  type RenameStatus,
  type InlineSegment,
} from "@/lib/renameMap";

/**
 * CodetryDisciplinePage — closing chapter that documents the naming
 * discipline behind the rest of the guide: the codetry test, what drift
 * looks like here, what's load-bearing, three worked examples drawn from
 * `RENAME_MAP`, and the full audit table rendered inline from
 * `docs/rename-map.md` so the page stays in sync with the source of truth.
 */

const ACCENT = "#3B2A6E";
const ACCENT_SOFT = "#E6E1F2";
const ACCENT_INK = "#1F1640";

interface WorkedExampleSpec {
  letter: "A" | "B" | "C";
  row: number;
  expectedDriftSymbol: DriftSymbol;
  symptom: string;
  term: string;
  drift: string;
  replacement: string;
  landsAt: string;
}

export const WORKED_EXAMPLES: WorkedExampleSpec[] = [
  {
    letter: "A",
    row: 11,
    expectedDriftSymbol: "D",
    symptom: "D — one noun doing two jobs",
    term: '"Bucket"',
    drift:
      "The word *bucket* was carrying both the three top-level streams (Salts, Community Contracts, Brightside) and the four reinvestment sub-allocations on the contracts page. Two jobs, one noun — the kind of duplication that passes every type-check and quietly fragments the model.",
    replacement:
      "*Bucket* narrows to where the rule actually holds: the four reinvestment sub-allocations on the contracts page (where the codetry-handbook's *every drop into a bucket; never summon water from nothing* is enforced by the auto-balancing reserve). The three top-level streams become *Streams* — already how the index calls them in prose.",
    landsAt:
      "The bucket carousel on the contracts page (sub-allocations) and the three header tiles on the index page (streams).",
  },
  {
    letter: "B",
    row: 12,
    expectedDriftSymbol: "D",
    symptom: "D — descriptor and metaphor swapped",
    term: '"Software, Hardware & Training" vs "Brightside"',
    drift:
      "The metaphor word — *Brightside* — was sitting in the tagline. The descriptor — *Software, Hardware & Training* — was sitting on the bucket name. Salts and Community Contracts already work the other way around (metaphor word as the name, descriptor in the tagline), so one of the three streams was reading inconsistently with its siblings.",
    replacement:
      "Swap them. Bucket name becomes *Brightside*; the tagline becomes *Software, hardware & training — the long-term-care product*. The three streams now read as a single triplet — Salts, Community Contracts, Brightside — and the metaphor word is what the nav says.",
    landsAt:
      "The brightside header tile on the index page, the AppShell nav label, and the brightside page eyebrow.",
  },
  {
    letter: "C",
    row: 5,
    expectedDriftSymbol: "U",
    symptom: "U — UI-framework leak",
    term: '"MoneyKpi"',
    drift:
      "Every page already calls these *headline numbers* in surrounding prose. The component name was the only place the SaaS dashboard word *KPI* still lived in the guide. A small, clean leak — the kind that only the audit catches because the component is invisible to a reader.",
    replacement:
      "Component renames to *HeadlineNumber*. No user-visible string changes; ~6 import sites move. The codetry weight is in stopping the SaaS word from being the file name future contributors see when they open the component.",
    landsAt:
      "One file rename plus the imports on every page that shows a headline number — Salts, Contracts, Brightside, Personal cash, Index, and the Operating framework.",
  },
];

export function checkWorkedExampleAlignment(
  ex: WorkedExampleSpec,
): string | null {
  const row = RENAME_MAP.find((r) => r.num === ex.row);
  if (!row) {
    return `Row #${ex.row} is no longer in the rename map; this example may be out of date.`;
  }
  if (!row.drift.includes(ex.expectedDriftSymbol)) {
    return `Row #${ex.row} no longer carries the "${ex.expectedDriftSymbol}" drift symbol (now [${row.drift.join(",") || "—"}]); this example may be out of date.`;
  }
  return null;
}

const PROTECTED_LIST: { name: string; carries: string }[] = [
  {
    name: "Salts / Parr's Jars",
    carries:
      "the bucket and the product. Renaming would erase the family-hands story.",
  },
  {
    name: "Community Contracts",
    carries:
      "the shape of the agency engagement (a contract with a community, not a client).",
  },
  {
    name: "Brightside",
    carries:
      "the founder's product name — the long-term-care software the agency surplus funds.",
  },
  {
    name: "Eagle prologue",
    carries:
      "the naming-of-the-eagle opening that seals the guide's stance. Not décor; it's the frame.",
  },
  {
    name: "Confirmed tag",
    carries:
      "the dot-and-tooltip provenance system. A number without one is provisional or TBD by definition.",
  },
  {
    name: "Footnote",
    carries:
      "the founder's word for mid-page provenance notes. The notes tail of every page reads as a single discipline.",
  },
  {
    name: "Ledger",
    carries:
      "the founder's word for the line-by-line backing data. The export buttons say what they do.",
  },
  {
    name: "Shadow labour",
    carries:
      "labour the books don't see. The codetry-aligned name is in the table already.",
  },
  {
    name: "Hub Coordinator (Dryden)",
    carries:
      "a load-bearing named role from the Deer Lake roster sync. Listed so the audit shows it walked past intentionally.",
  },
];

export function CodetryDisciplinePage() {
  const driftRows = RENAME_MAP.filter((r) => r.drift.length > 0);
  const reviewedAndKept = RENAME_MAP.filter((r) => r.drift.length === 0);

  return (
    <div className="space-y-6" data-testid="page-codetry">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="back-to-dashboard"
      >
        <ArrowLeft className="h-3 w-3" />
        Dashboard
      </Link>
      {/* ── Page header — always visible ── */}
      <header className="flex items-start gap-3">
        <div
          className="h-10 w-10 rounded-md grid place-items-center flex-shrink-0"
          style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
        >
          <ScrollText className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            How this guide is named
          </p>
          <h1
            className="mt-1 text-3xl font-semibold"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            The names are the architecture.
          </h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            If you change a name, you change the spec.
          </p>
          <div
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium"
            style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
          >
            Reading: the discipline behind the rest of the guide
          </div>
        </div>
      </header>

      {/* ── Bucket sections — headings always visible, detail collapsed ── */}
      <Accordion type="multiple" className="space-y-3">

        {/* 1. The codetry test */}
        <AccordionItem
          value="codetry-test"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT }}
          data-testid="section-codetry-test"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 text-left flex-wrap min-w-0">
              <TestTube2 className="h-4 w-4 flex-shrink-0 opacity-60" style={{ color: ACCENT_INK }} />
              <span className="font-semibold text-sm">The codetry test</span>
              <span
                className="text-xs px-2 py-0.5 rounded-md font-medium"
                style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
              >
                If you change a name, you change the spec.
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 border-t border-card-border">
            <div className="pt-4 flex items-start gap-3">
              <div className="flex-1 min-w-0 space-y-4">
                <div
                  className="rounded-md border-l-4 px-4 py-3 text-base leading-relaxed"
                  style={{
                    borderLeftColor: ACCENT,
                    backgroundColor: ACCENT_SOFT,
                    color: ACCENT_INK,
                    fontFamily: "var(--app-font-serif)",
                  }}
                >
                  If you change a name, you change the spec.
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  That is the whole rule. A rename is a refactor of the model, not
                  a copy edit. Pages, tests, ledgers, and the conversation the
                  founder has with the buyer all move together — or the guide stops
                  meaning what it says.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Consequence: any time a contributor wants to rename a noun in
                  this guide, they walk the rename through the audit table below.
                  The map is read-only on this page; it lives at{" "}
                  <code className="text-xs px-1 py-0.5 rounded bg-muted">
                    artifacts/practitioners-guide-v2/docs/rename-map.md
                  </code>
                  .
                </p>
                <p className="text-xs text-muted-foreground border-t pt-3 border-card-border">
                  Codetry test as stated in the codetry-handbook, §1.4 — naming IS architecture.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 2. What drift looks like here */}
        <AccordionItem
          value="drift-symptoms"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT }}
          data-testid="section-drift-symptoms"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 text-left flex-wrap min-w-0">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 opacity-60" style={{ color: ACCENT_INK }} />
              <span className="font-semibold text-sm">What drift looks like here</span>
              <span className="text-xs text-muted-foreground">4 symptoms · G U D A</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 border-t border-card-border">
            <div className="pt-4">
              <ul className="space-y-3 text-sm">
                {(["G", "U", "D", "A"] as DriftSymbol[]).map((sym) => (
                  <li
                    key={sym}
                    className="flex items-start gap-3"
                    data-testid={`drift-symptom-${sym}`}
                  >
                    <span
                      className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold flex-shrink-0"
                      style={{
                        backgroundColor: ACCENT_SOFT,
                        color: ACCENT_INK,
                      }}
                      aria-hidden
                    >
                      {sym}
                    </span>
                    <p className="text-[0.95rem] text-muted-foreground leading-relaxed">
                      {DRIFT_SYMBOL_MEANINGS[sym]}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground border-t pt-3 border-card-border">
                Some rows in the map carry no drift symbol — those are nouns the
                audit walked past intentionally and recorded as load-bearing.
                They live in the table so future maintainers can see what was
                <em> considered</em>, not just what was renamed.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 3. What's load-bearing */}
        <AccordionItem
          value="load-bearing"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT }}
          data-testid="section-load-bearing"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 text-left flex-wrap min-w-0">
              <Anchor className="h-4 w-4 flex-shrink-0 opacity-60" style={{ color: ACCENT_INK }} />
              <span className="font-semibold text-sm">What's load-bearing in this guide</span>
              <span className="text-xs text-muted-foreground">{PROTECTED_LIST.length} protected names</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 border-t border-card-border">
            <div className="pt-4">
              <p className="text-xs text-muted-foreground mb-3">
                The names below are protected — renaming any of them is a re-spec, not a refactor.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {PROTECTED_LIST.map((p) => (
                  <li
                    key={p.name}
                    className="rounded-md border border-card-border bg-card/60 p-3"
                    data-testid={`protected-${slug(p.name)}`}
                  >
                    <p
                      className="text-base font-semibold text-foreground"
                      style={{ fontFamily: "var(--app-font-serif)" }}
                    >
                      {p.name}
                    </p>
                    <p className="mt-1 text-[0.9rem] text-muted-foreground leading-relaxed">
                      {p.carries}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 4. Three worked examples */}
        <AccordionItem
          value="worked-examples"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT }}
          data-testid="section-worked-examples"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 text-left flex-wrap min-w-0">
              <ListChecks className="h-4 w-4 flex-shrink-0 opacity-60" style={{ color: ACCENT_INK }} />
              <span className="font-semibold text-sm">Three examples from the audit</span>
              <span className="text-xs text-muted-foreground">
                Rows #{WORKED_EXAMPLES.map((e) => e.row).join(", #")} · proposed status
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 border-t border-card-border">
            <div className="pt-4 space-y-6">
              <p className="text-xs text-muted-foreground">
                Each row is still in <code className="bg-muted px-1 py-0.5 rounded">proposed</code> status.
                Covers duplicate metaphor (G), descriptor/metaphor swap (D), and UI-framework leak (U).
              </p>
              {WORKED_EXAMPLES.map((ex) => (
                <WorkedExample key={ex.letter} example={ex} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 5. The drift map */}
        <AccordionItem
          value="drift-map"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT }}
          data-testid="section-drift-map"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 text-left flex-wrap min-w-0">
              <span className="font-semibold text-sm">The drift map</span>
              <span className="text-xs text-muted-foreground">
                {RENAME_MAP.length} rows · {driftRows.length} flagged · {reviewedAndKept.length} kept
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 border-t border-card-border">
            <div className="pt-4 space-y-4">
              <StatusLegend />
              <DriftMapTable rows={RENAME_MAP} />
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">A note on status.</strong> The
                audit produced this map; the founder walks it row-by-row. A row's
                status reads as the audit left it the last time the markdown was
                saved. The implementation pass moves only{" "}
                <code className="text-xs px-1 py-0.5 rounded bg-muted">
                  approved
                </code>{" "}
                rows to{" "}
                <code className="text-xs px-1 py-0.5 rounded bg-muted">
                  applied
                </code>{" "}
                — nothing else transitions on its own.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 6. Keeping it from drifting again */}
        <AccordionItem
          value="maintenance"
          className="rounded-xl border border-card-border bg-card overflow-hidden border-b-0"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT }}
          data-testid="section-maintenance"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3 text-left flex-wrap min-w-0">
              <Hammer className="h-4 w-4 flex-shrink-0 opacity-60" style={{ color: ACCENT_INK }} />
              <span className="font-semibold text-sm">Keeping it from drifting again</span>
              <span className="text-xs text-muted-foreground">Edit the markdown · walk the table</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 border-t border-card-border">
            <div className="pt-4 space-y-4">
              <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-3 leading-relaxed">
                <li>
                  <strong className="text-foreground">
                    Edit the markdown, not the page.
                  </strong>{" "}
                  When a new rename is considered — by the founder, a contractor,
                  a reader who notices a drift — add a row to{" "}
                  <code className="text-xs px-1 py-0.5 rounded bg-muted">
                    docs/rename-map.md
                  </code>{" "}
                  with status{" "}
                  <code className="text-xs px-1 py-0.5 rounded bg-muted">
                    proposed
                  </code>
                  . This page picks it up the next build.
                </li>
                <li>
                  <strong className="text-foreground">
                    Walk the table top to bottom.
                  </strong>{" "}
                  Set each row to{" "}
                  <code className="text-xs px-1 py-0.5 rounded bg-muted">
                    approved
                  </code>
                  ,{" "}
                  <code className="text-xs px-1 py-0.5 rounded bg-muted">
                    rejected
                  </code>
                  , or{" "}
                  <code className="text-xs px-1 py-0.5 rounded bg-muted">
                    deferred
                  </code>
                  . Rejected and deferred rows stay in the document as the record
                  of what was considered and walked past. Only{" "}
                  <code className="text-xs px-1 py-0.5 rounded bg-muted">
                    approved
                  </code>{" "}
                  rows are ever applied; the implementation pass updates them to{" "}
                  <code className="text-xs px-1 py-0.5 rounded bg-muted">
                    applied
                  </code>{" "}
                  after the rename actually lands.
                </li>
              </ol>

              <div
                className="rounded-md border px-4 py-3 text-sm space-y-3"
                style={{
                  borderColor: ACCENT,
                  backgroundColor: ACCENT_SOFT,
                  color: ACCENT_INK,
                }}
              >
                <p className="font-semibold">Where to read more</p>
                <ul className="space-y-2 text-[0.9rem]">
                  <li>
                    The deeper philosophy — what codetry is, who it serves, the
                    saltbox principle, the both-states principle — lives in the{" "}
                    <a
                      href="/codetry-handbook/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-baseline gap-1 font-semibold underline decoration-dotted underline-offset-2 hover:no-underline"
                      style={{ color: ACCENT_INK }}
                      data-testid="codetry-handbook-link"
                    >
                      codetry-handbook
                      <ExternalLink className="inline h-3 w-3" aria-hidden />
                    </a>{" "}
                    (the mobile artifact titled{" "}
                    <em>Headwaters: How a Community Runs Its Own Economy</em>).
                    Open it in a new tab and read it alongside this page.
                  </li>
                  <li>
                    The cross-artifact rename sweep — taking the discipline from
                    this guide out across every other artifact in the project —
                    is queued as its own task and will produce a single
                    cross-project rename map. This page only governs renames{" "}
                    <em>inside</em> the practitioner's guide.
                  </li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      <nav
        className="flex items-center justify-between gap-4 pt-4 border-t border-card-border"
        aria-label="Page navigation"
      >
        <Link
          href="/replication"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          data-testid="codetry-nav-prev"
        >
          <ArrowLeft className="h-4 w-4" />
          Replication
        </Link>
        <span
          className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
          data-testid="codetry-nav-final"
        >
          Final chapter
        </span>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          data-testid="codetry-nav-home"
        >
          <Home className="h-4 w-4" />
          Back to the index
        </Link>
      </nav>
    </div>
  );
}

function WorkedExample({ example }: { example: WorkedExampleSpec }) {
  const { letter, row, symptom, term, drift, replacement, landsAt } = example;
  const warning = checkWorkedExampleAlignment(example);
  return (
    <article
      className="rounded-md border border-card-border bg-card/60 p-4"
      data-testid={`worked-example-${letter.toLowerCase()}`}
    >
      <div className="flex items-baseline gap-3 flex-wrap">
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-semibold flex-shrink-0"
          style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
          aria-hidden
        >
          {letter}
        </span>
        <h4
          className="text-base font-semibold text-foreground"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          {term}
        </h4>
        <span className="text-xs text-muted-foreground">
          row #{row} · {symptom}
        </span>
      </div>
      {warning && (
        <p
          className="mt-2 text-xs rounded-md border border-amber-300 bg-amber-50 text-amber-900 px-2 py-1.5"
          data-testid={`worked-example-${letter.toLowerCase()}-warning`}
          role="status"
        >
          {warning}
        </p>
      )}
      <dl className="mt-3 space-y-3 text-[0.9rem] leading-relaxed">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            What drifted
          </dt>
          <dd className="mt-1 text-foreground/90">
            <Inline text={drift} />
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            The replacement
          </dt>
          <dd className="mt-1 text-foreground/90">
            <Inline text={replacement} />
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Where it now appears in the guide
          </dt>
          <dd className="mt-1 text-muted-foreground">
            <Inline text={landsAt} />
          </dd>
        </div>
      </dl>
    </article>
  );
}

function StatusLegend() {
  const allStatuses: RenameStatus[] = [
    "proposed",
    "approved",
    "applied",
    "rejected",
    "deferred",
  ];
  return (
    <div className="rounded-md border border-card-border bg-muted/30 p-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        Status legend
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        {allStatuses.map((s) => (
          <li
            key={s}
            className="flex items-baseline gap-2"
            data-testid={`status-legend-${s}`}
          >
            <StatusPill status={s} />
            <span className="text-muted-foreground">{STATUS_MEANINGS[s]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DriftMapTable({ rows }: { rows: RenameRow[] }) {
  return (
    <div
      className="overflow-x-auto rounded-md border border-card-border"
      data-testid="drift-map-table"
    >
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th scope="col" className="px-3 py-2 text-left font-semibold w-10">
              #
            </th>
            <th scope="col" className="px-3 py-2 text-left font-semibold">
              Term
            </th>
            <th scope="col" className="px-3 py-2 text-left font-semibold w-20">
              Drift
            </th>
            <th scope="col" className="px-3 py-2 text-left font-semibold">
              Proposed replacement
            </th>
            <th scope="col" className="px-3 py-2 text-left font-semibold w-24">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.num}
              className="border-t border-card-border align-top"
              data-testid={`drift-row-${r.num}`}
            >
              <td className="px-3 py-3 text-xs text-muted-foreground font-mono">
                {r.num}
              </td>
              <td className="px-3 py-3">
                <div className="text-foreground/90 leading-relaxed">
                  <Inline text={r.term} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  <Inline text={r.whereItAppears} />
                </div>
              </td>
              <td className="px-3 py-3">
                {r.drift.length === 0 ? (
                  <span
                    className="text-muted-foreground text-xs"
                    aria-label="No drift symbol — listed for reference"
                  >
                    —
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {r.drift.map((d) => (
                      <span
                        key={d}
                        className="inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold"
                        style={{
                          backgroundColor: ACCENT_SOFT,
                          color: ACCENT_INK,
                        }}
                        title={DRIFT_SYMBOL_MEANINGS[d]}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-3 py-3 text-foreground/90 leading-relaxed">
                <Inline text={r.proposedReplacement} />
                {r.secondOrderEffects && r.secondOrderEffects !== "None." ? (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground select-none">
                      Second-order effects
                    </summary>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      <Inline text={r.secondOrderEffects} />
                    </p>
                  </details>
                ) : null}
              </td>
              <td className="px-3 py-3">
                <StatusPill status={r.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const STATUS_STYLE: Record<
  RenameStatus,
  { bg: string; fg: string; border: string }
> = {
  proposed: {
    bg: "hsl(220 14% 96%)",
    fg: "hsl(220 14% 30%)",
    border: "hsl(220 14% 86%)",
  },
  approved: {
    bg: "hsl(142 38% 94%)",
    fg: "hsl(142 60% 22%)",
    border: "hsl(142 30% 80%)",
  },
  rejected: {
    bg: "hsl(0 38% 94%)",
    fg: "hsl(0 50% 32%)",
    border: "hsl(0 30% 82%)",
  },
  deferred: {
    bg: "hsl(32 70% 94%)",
    fg: "hsl(28 60% 28%)",
    border: "hsl(32 60% 82%)",
  },
  applied: {
    bg: "hsl(167 38% 94%)",
    fg: "hsl(167 60% 18%)",
    border: "hsl(167 30% 82%)",
  },
};

function StatusPill({ status }: { status: RenameStatus }) {
  const style = STATUS_STYLE[status];
  return (
    <span
      className="inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap"
      style={{
        backgroundColor: style.bg,
        color: style.fg,
        borderColor: style.border,
      }}
      data-testid={`status-pill-${status}`}
    >
      {status}
    </span>
  );
}

function Inline({ text }: { text: string }) {
  const segments: InlineSegment[] = parseInline(text);
  return (
    <>
      {segments.map((s, i) => {
        if (s.kind === "bold") return <strong key={i}>{s.text}</strong>;
        if (s.kind === "italic") return <em key={i}>{s.text}</em>;
        if (s.kind === "code")
          return (
            <code
              key={i}
              className="text-[0.85em] px-1 py-0.5 rounded bg-muted font-mono"
            >
              {s.text}
            </code>
          );
        return <span key={i}>{s.text}</span>;
      })}
    </>
  );
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
