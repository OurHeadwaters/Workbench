/**
 * TheWindowPage — a public view into the Codetry operating reality.
 *
 * Reads from @workspace/codetry-public — the same source of truth as
 * the Practitioners Guide's Strategic Ledger. When the practitioner
 * updates the shared data, this page updates automatically.
 *
 * This is not a separate document. It is a window.
 */

import {
  CODETRY_DESTINATION_PUBLIC,
  CODETRY_FILTER_QUESTIONS,
  CODETRY_ENGAGEMENTS,
  OBJECTIVE_LABELS_PUBLIC,
} from "@workspace/codetry-public";

const EVERGREEN = "hsl(145 36% 18%)";
const EVERGREEN_DARK = "hsl(145 36% 14%)";
const CREAM = "hsl(38 36% 96%)";
const CREAM_MUTED = "rgba(235,225,210,0.65)";
const RUST = "hsl(14 64% 36%)";

const publicEngagements = CODETRY_ENGAGEMENTS.filter((e) => e.isPublic);

// ─── Shared label ─────────────────────────────────────────────────────────────

function BlockLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono text-[10px] uppercase tracking-[0.26em] mb-3 opacity-60"
      style={{ color: "hsl(var(--foreground))" }}
    >
      {children}
    </p>
  );
}

// ─── Commitment card (public filter question) ─────────────────────────────────

function CommitmentCard({ n, question, note }: { n: string; question: string; note: string }) {
  return (
    <div
      className="rounded-md border p-4 space-y-1.5"
      style={{ borderColor: "hsl(var(--card-border))" }}
    >
      <div className="flex items-start gap-3">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.18em] mt-0.5 shrink-0 opacity-50"
          style={{ color: "hsl(var(--foreground))" }}
        >
          {String(n).padStart(2, "0")}
        </span>
        <p className="font-serif text-[15px] leading-snug" style={{ color: "hsl(var(--foreground))" }}>
          {question}
        </p>
      </div>
      <p
        className="font-serif text-[13px] leading-relaxed pl-7"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {note}
      </p>
    </div>
  );
}

// ─── Engagement entry ─────────────────────────────────────────────────────────

function EngagementEntry({
  name,
  type,
  objectives,
  publicSummary,
  status,
}: {
  name: string;
  type: string;
  objectives: string[];
  publicSummary: string;
  status: string;
}) {
  const statusColor =
    status === "proven"
      ? "hsl(145 36% 26%)"
      : status === "in-progress"
      ? RUST
      : "hsl(var(--muted-foreground))";

  const statusLabel =
    status === "proven" ? "Complete" : status === "in-progress" ? "Active" : "Planned";

  const typeLabel =
    type === "paid" ? "Paid" : type === "in-development" ? "In development" : "Practice";

  return (
    <article
      className="border-b py-6 space-y-3 last:border-b-0"
      style={{ borderColor: "hsl(var(--card-border))" }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-1.5">
            <span
              className="font-mono text-[9px] uppercase tracking-[0.22em] opacity-60"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {typeLabel}
            </span>
            <span
              className="font-mono text-[9px] uppercase tracking-[0.22em] font-semibold"
              style={{ color: statusColor }}
            >
              {statusLabel}
            </span>
          </div>
          <h3 className="font-serif text-lg leading-snug" style={{ color: "hsl(var(--foreground))" }}>
            {name}
          </h3>
        </div>
      </div>

      <p className="font-serif text-[14px] leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
        {publicSummary}
      </p>

      <div className="flex items-center gap-2 flex-wrap pt-1">
        {objectives.map((n) => (
          <span
            key={n}
            className="font-mono text-[9px] uppercase tracking-[0.16em] px-2 py-1 rounded-sm"
            style={{
              background: "hsl(var(--muted))",
              color: "hsl(var(--muted-foreground))",
            }}
          >
            {OBJECTIVE_LABELS_PUBLIC[n] ?? `Q${n}`}
          </span>
        ))}
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function TheWindowPage() {
  const activeCount = CODETRY_ENGAGEMENTS.filter(
    (e) => e.isPublic && e.status === "in-progress"
  ).length;
  const provenCount = CODETRY_ENGAGEMENTS.filter(
    (e) => e.isPublic && e.status === "proven"
  ).length;

  return (
    <main className="min-h-screen w-full bg-background text-foreground" data-testid="page-the-window">

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden px-6 sm:px-10 pt-16 pb-14"
        style={{ background: EVERGREEN, color: CREAM }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 rounded-full opacity-10"
          style={{ background: CREAM }}
        />
        <div className="relative mx-auto max-w-[52rem]">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] mb-5 opacity-60">
            Headwaters · a window into the work
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight mb-5">
            A window into the work.
          </h1>
          <p className="font-serif text-lg leading-relaxed mb-8" style={{ color: CREAM_MUTED, maxWidth: "42rem" }}>
            Most organizations separate their business plan from their operations.
            This page doesn't. When the work changes, this changes.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8 flex-wrap">
            <div>
              <p className="font-serif text-3xl font-semibold" style={{ color: CREAM }}>
                {activeCount}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] mt-0.5" style={{ color: CREAM_MUTED }}>
                Active engagements
              </p>
            </div>
            <div
              className="w-px h-10 self-center opacity-20"
              style={{ background: CREAM }}
              aria-hidden
            />
            <div>
              <p className="font-serif text-3xl font-semibold" style={{ color: CREAM }}>
                {provenCount}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] mt-0.5" style={{ color: CREAM_MUTED }}>
                Proven on the ledger
              </p>
            </div>
            <div
              className="w-px h-10 self-center opacity-20"
              style={{ background: CREAM }}
              aria-hidden
            />
            <div>
              <p className="font-serif text-3xl font-semibold" style={{ color: CREAM }}>
                20 yr
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] mt-0.5" style={{ color: CREAM_MUTED }}>
                Trajectory
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[52rem] px-6 sm:px-8 py-14 space-y-16">

        {/* ── The destination ── */}
        <section data-testid="window-destination">
          <BlockLabel>Where this is going</BlockLabel>
          <div className="space-y-5">
            <p
              className="font-serif text-xl sm:text-2xl leading-[1.45] tracking-tight"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {CODETRY_DESTINATION_PUBLIC.p1}
            </p>
            <p
              className="font-serif text-[16px] leading-relaxed"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {CODETRY_DESTINATION_PUBLIC.p2}
            </p>
            <p
              className="font-serif text-[15px] leading-relaxed"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {CODETRY_DESTINATION_PUBLIC.p3}
            </p>
          </div>
        </section>

        {/* ── Divider ── */}
        <hr style={{ borderColor: "hsl(var(--card-border))" }} />

        {/* ── How we decide ── */}
        <section data-testid="window-commitments">
          <BlockLabel>How we decide what work to take on</BlockLabel>
          <p
            className="font-serif text-[15px] leading-relaxed mb-8"
            style={{ color: "hsl(var(--muted-foreground))", maxWidth: "42rem" }}
          >
            Any piece of work — paid or not — is measured against these five questions.
            If the answer to at least one is yes, the work belongs on the ledger.
            This is what keeps the practice pointed at something real over a 20-year horizon.
          </p>

          <div className="space-y-3" data-testid="window-commitments-list">
            {CODETRY_FILTER_QUESTIONS.map((q) => (
              <CommitmentCard
                key={q.n}
                n={q.n}
                question={q.public}
                note={q.publicNote}
              />
            ))}
          </div>
        </section>

        {/* ── Divider ── */}
        <hr style={{ borderColor: "hsl(var(--card-border))" }} />

        {/* ── The work ── */}
        <section data-testid="window-engagements">
          <BlockLabel>The work</BlockLabel>
          <p
            className="font-serif text-[15px] leading-relaxed mb-8"
            style={{ color: "hsl(var(--muted-foreground))", maxWidth: "42rem" }}
          >
            Every engagement on this list was evaluated against the five commitments above.
            Each one is a proof point — or an active test of whether the model holds in a new context.
          </p>

          <div data-testid="window-engagements-list">
            {publicEngagements.map((e) => (
              <EngagementEntry key={e.name} {...e} />
            ))}
          </div>
        </section>

        {/* ── Footer note ── */}
        <section
          className="rounded-md border px-5 py-4"
          style={{
            borderColor: "hsl(var(--card-border))",
            background: "hsl(var(--muted))",
          }}
          data-testid="window-footer"
        >
          <p
            className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2 opacity-60"
          >
            About this page
          </p>
          <p
            className="font-serif text-[13px] leading-relaxed"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            This page is connected to the same source as Headwaters' internal operating manual.
            It updates when the work changes — not on a publishing schedule, not when someone
            remembers to update the website. What you see here is what is actually happening.
          </p>
          <p
            className="font-serif text-[13px] leading-relaxed mt-3"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            This is what we mean by a window: not a presentation, not a pitch.
            The room exists. This is the glass.
          </p>
        </section>

      </div>
    </main>
  );
}
