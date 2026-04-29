import { useMemo } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowLeftRight,
  BookOpen,
  ChevronRight,
  ExternalLink,
  FileText,
  FolderTree,
  Layers,
  ScrollText,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { constellation } from "@/data/constellation";

// AUDIT NOTE — Standby-leaks-into-Gate bug class (Task #473, #475, #489)
// =====================================================================
// This page is *intentionally* Gate-only. Every UI affordance below is
// built around The Gate's specific vocabulary: the severity ladder
// (draft / under-review / cleared / refused — where "refused" is a
// first-class outcome, not the Standby's standdown), the bright-side ↔
// massity directionality, the three sub-shelves (Mappings as the
// dictionary side, Substitutions as the applied-instance ledger,
// Categories as the domain shelves — not the Standby's Common
// Pantry/Watch), the four rejected alternatives (Translator, Filter,
// Censor, Glossary — none of which appear on The Standby's rejected
// list), and the calm-membrane posture. None of that survives unchanged
// on The Standby (which has advisory/standby/active/standdown as its
// rungs, calls and watch as its core nouns, drawdowns from its standby
// shelf as its inventory move, and a debrief shape that asks whether
// that shelf was replenished).
//
// The constellation manifest registers two primitives under
// `constellationWidePrimitives` — `the-standby` and `the-gate`. This
// page picks `the-gate` by id explicitly, mirroring the discipline
// documented at the top of `pages/Standby.tsx`. DO NOT genericize this
// template into a primitive-loop renderer that takes the id from the
// route or from props — that is the bug class the codetry-handbook
// chapter generator was already fixed for, and the reason Standby and
// Gate live as two separate files. If a third sibling primitive earns
// a surface in this app, build it as its own file (e.g. `pages/X.tsx`)
// on its own route, with its own UI shaped to that primitive's
// vocabulary, ladder, and sub-shelves.
//
// The manifest's `scope` field for The Gate states that the runnable
// surface lives externally at legacy-gatekeeper.replit.app and that
// this in-repo page is a *shell*: it reads the manifest verbatim and
// links out to the live Gate. The translations log, mappings ledger,
// and substitutions history below are presented as empty-state
// surfaces for that reason — they describe the shape the in-repo
// surface would take if/when the Gate is brought in-repo. The decision
// whether to bring the runnable surface in-repo (as artifacts/the-gate)
// is left for a later task once this shell has had some traffic.

type GateRungId = "draft" | "under-review" | "cleared" | "refused";

const RUNG_TONE: Record<
  GateRungId,
  { dot: string; ring: string; text: string; bg: string }
> = {
  draft: {
    dot: "bg-slate-400",
    ring: "ring-slate-400/30",
    text: "text-slate-700",
    bg: "bg-slate-50",
  },
  "under-review": {
    dot: "bg-amber-400",
    ring: "ring-amber-400/30",
    text: "text-amber-700",
    bg: "bg-amber-50",
  },
  cleared: {
    dot: "bg-emerald-600",
    ring: "ring-emerald-500/30",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  refused: {
    dot: "bg-rose-600",
    ring: "ring-rose-500/30",
    text: "text-rose-700",
    bg: "bg-rose-50",
  },
};

const SHELF_ICON: Record<string, typeof Layers> = {
  Mappings: BookOpen,
  Substitutions: ArrowLeftRight,
  Categories: FolderTree,
};

// The Gate's runnable surface lives externally per the manifest's
// `scope` field. Read the host out of that prose (the manifest writes
// it bare, e.g. "legacy-gatekeeper.replit.app") so this page stays in
// sync with the manifest if the runnable surface ever moves; only fall
// back to the known address if the scope text is rewritten in a way
// that drops the host.
const EXTERNAL_GATE_FALLBACK_HOST = "legacy-gatekeeper.replit.app";
function externalGateHostFromScope(scope: string | undefined): string {
  if (!scope) return EXTERNAL_GATE_FALLBACK_HOST;
  // Match either a full URL or a bare *.replit.app / *.replit.dev host.
  const urlMatch = scope.match(/https?:\/\/[^\s)]+/);
  if (urlMatch) {
    try {
      return new URL(urlMatch[0]).host;
    } catch {
      // fall through to bare-host match
    }
  }
  const hostMatch = scope.match(
    /[a-z0-9-]+(?:\.[a-z0-9-]+)*\.replit\.(?:app|dev)/i,
  );
  return hostMatch ? hostMatch[0] : EXTERNAL_GATE_FALLBACK_HOST;
}

export default function Gate() {
  const gatePrimitive = useMemo(
    () =>
      constellation.constellationWidePrimitives.find(
        (p) => p.id === "the-gate",
      ) ?? null,
    [],
  );

  if (!gatePrimitive) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center text-muted-foreground">
        Constellation manifest is missing the Gate primitive. Refresh the
        snapshot with{" "}
        <code className="ml-1 px-2 py-0.5 rounded bg-muted text-foreground text-sm">
          pnpm --filter @workspace/headwaters-books run sync-constellation
        </code>
        .
      </div>
    );
  }

  const ladder = gatePrimitive.severityLadder ?? [];
  const subShelves = gatePrimitive.subShelves ?? [];
  const vocabulary = gatePrimitive.vocabulary ?? [];
  const rejected = gatePrimitive.rejectedAlternatives ?? [];
  const externalGateHost = externalGateHostFromScope(gatePrimitive.scope);
  const externalGateUrl = `https://${externalGateHost}`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Headwaters</span>
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <div className="text-xs text-muted-foreground tracking-wide uppercase">
                Z3 · {constellation.z3?.memberFacingBrand ?? "807 Benefits"} ·
                sibling to The Standby
              </div>
              <h1 className="font-serif text-2xl text-foreground leading-tight">
                The Gate
              </h1>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <div>manifest v{constellation.version}</div>
            <div>updated {constellation.lastUpdated}</div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Primitive header — vocabulary verbatim from constellation */}
        <section className="mb-10">
          <p className="text-base text-foreground/80 max-w-3xl leading-relaxed">
            {gatePrimitive.summary}
          </p>
          {gatePrimitive.hostZoneRationale && (
            <p className="mt-3 text-sm text-muted-foreground max-w-3xl leading-relaxed">
              {gatePrimitive.hostZoneRationale}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            {vocabulary.map((v) => (
              <Badge
                key={v.term}
                variant="outline"
                title={v.role}
                className="font-normal"
              >
                {v.term}
              </Badge>
            ))}
          </div>
        </section>

        {/* The bright side ↔ massity diagram — Gate-specific framing */}
        <section className="mb-10">
          <h2 className="font-serif text-lg text-foreground mb-3">
            What the Gate sits between
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
            <Card className="border-border bg-amber-50/40">
              <CardHeader className="pb-2">
                <CardTitle className="font-serif text-base">
                  The bright side
                </CardTitle>
                <CardDescription>
                  the codetry-vocabulary side; the constellation's own
                  dialect
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-foreground/70 leading-relaxed">
                neighbour · send · fee · money · the shelf · the books ·
                the channel
              </CardContent>
            </Card>
            <div className="hidden md:flex items-center justify-center px-2">
              <ArrowLeftRight className="w-6 h-6 text-muted-foreground" />
            </div>
            <Card className="border-border bg-slate-50">
              <CardHeader className="pb-2">
                <CardTitle className="font-serif text-base">
                  Massity
                </CardTitle>
                <CardDescription>
                  the legacy-world side; mass-society dialect — regulator,
                  banker, funder, lawyer, generic SaaS English
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-foreground/70 leading-relaxed">
                resident · remit · service charge · funds · the database ·
                financial statements · compliance officer
              </CardContent>
            </Card>
          </div>
        </section>

        {/* The severity ladder, verbatim — draft/under-review/cleared/refused */}
        <section className="mb-10">
          <h2 className="font-serif text-lg text-foreground mb-3">
            The severity ladder
          </h2>
          <p className="text-sm text-muted-foreground mb-3 max-w-3xl leading-relaxed">
            The <span className="italic">refused</span> rung is first-class —
            for source-side language with no honest target-side equivalent the
            founder is unwilling to lose. The Gate doesn&rsquo;t force a
            substitution; it records the refusal so the noun stays on file.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {ladder.map((rung) => {
              const tone = RUNG_TONE[rung.rung as GateRungId];
              return (
                <div
                  key={rung.rung}
                  data-testid={`rung-${rung.rung}`}
                  className={`rounded-lg border border-border ${tone?.bg ?? "bg-muted"} p-4`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${tone?.dot ?? "bg-muted-foreground"}`}
                    />
                    <span
                      className={`text-sm font-semibold uppercase tracking-wide ${tone?.text ?? "text-foreground"}`}
                    >
                      {rung.rung}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/70 leading-snug">
                    {rung.meaning}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* The three sub-shelves, verbatim — Mappings/Substitutions/Categories */}
        <section className="mb-10">
          <h2 className="font-serif text-lg text-foreground mb-3">
            The three sub-shelves
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subShelves.map((shelf) => {
              const Icon = SHELF_ICON[shelf.name] ?? Layers;
              return (
                <Card
                  key={shelf.name}
                  className="border-border"
                  data-testid={`subshelf-${shelf.name.toLowerCase()}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="font-serif text-lg flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary" />
                      {shelf.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {shelf.role}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <Separator className="mb-8" />

        {/* The runnable surface — manifest scope says it lives externally */}
        <section className="mb-10">
          <Card className="border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-primary" />
                The runnable Gate
              </CardTitle>
              <CardDescription className="text-foreground/70 max-w-3xl leading-relaxed">
                The manifest's{" "}
                <code className="px-1 py-0.5 rounded bg-muted text-foreground">
                  scope
                </code>{" "}
                field for The Gate states that the live, runnable surface —
                where mappings are entered, substitutions are applied to
                crossing language, and categories are managed — continues to
                operate externally while the in-repo vocabulary settles. This
                page is the in-repo shell; it reads the manifest verbatim and
                links out so the practitioner has one door, not two.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={externalGateUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-external-gate"
              >
                <Button className="gap-2">
                  Open the runnable Gate
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
              <p className="mt-3 text-xs text-muted-foreground font-mono">
                {externalGateUrl}
              </p>

              <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/40 p-4 text-sm text-foreground/80 leading-relaxed">
                <div className="flex items-center gap-2 mb-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                  <ChevronRight className="w-3.5 h-3.5" />
                  Scope of this page
                </div>
                {gatePrimitive.scope}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Translations log — empty-state surface, Gate vocabulary */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="font-serif text-2xl text-foreground flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-primary" />
              Translations log
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
              Every piece of language that has crossed the Gate in either
              direction — bright side out to massity, or massity in to the
              bright side. The auditable record of what crossed and what
              changed.
            </p>
          </div>
          <Card className="border-dashed">
            <CardContent className="py-10 text-center text-muted-foreground">
              <FileText className="w-6 h-6 mx-auto mb-2 opacity-60" />
              No translation has been logged in this shell yet. The
              practitioner-facing translation work continues on the
              runnable Gate above; this log will mirror it when the Gate
              is brought in-repo.
            </CardContent>
          </Card>
        </section>

        {/* Mappings ledger — empty-state surface, Gate vocabulary */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="font-serif text-2xl text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Mappings ledger
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
              The registered correspondences the Gate carries — a
              bright-side noun on one side, its honest massity equivalent
              on the other, filed under a category. The dictionary side of
              the Gate.
            </p>
          </div>
          <Card className="border-dashed">
            <CardContent className="py-10 text-center text-muted-foreground">
              <BookOpen className="w-6 h-6 mx-auto mb-2 opacity-60" />
              No mapping has been registered in this shell yet. The
              practitioner registers mappings on the runnable Gate; the
              ledger here will read from that source when the surface is
              in-repo.
            </CardContent>
          </Card>
        </section>

        {/* Substitutions history — empty-state surface, Gate vocabulary */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="font-serif text-2xl text-foreground flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-primary" />
              Substitutions history
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
              Each time a mapping has actually been applied — who applied
              it, on which document, in which direction. The applied-instance
              ledger; the Gate's history of work done.
            </p>
          </div>
          <Card className="border-dashed">
            <CardContent className="py-10 text-center text-muted-foreground">
              <ArrowLeftRight className="w-6 h-6 mx-auto mb-2 opacity-60" />
              No substitution has been recorded in this shell yet. The
              applied-substitution record lives on the runnable Gate; this
              history will mirror it once the Gate moves in-repo.
            </CardContent>
          </Card>
        </section>

        {/* Names rejected on paper — verbatim, four single-side or single-direction names */}
        {rejected.length > 0 && (
          <section className="mb-4">
            <h2 className="font-serif text-lg text-foreground mb-3">
              Names rejected on paper
            </h2>
            <p className="text-sm text-muted-foreground mb-3 max-w-3xl leading-relaxed">
              Four single-side or single-direction names that were trialed as
              the umbrella and turned down — none could hold both the bright
              side and massity at once. Kept on file so the next person to
              reach for one of these words finds the prior thinking.
            </p>
            <ul className="space-y-3">
              {rejected.map((alt) => (
                <li
                  key={alt.name}
                  className="rounded-lg border border-border bg-card p-4"
                  data-testid={`rejected-${alt.name.toLowerCase()}`}
                >
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 mt-0.5 text-stone-500 flex-shrink-0" />
                    <div>
                      <div className="font-serif text-base text-foreground">
                        Not &ldquo;{alt.name}&rdquo;
                      </div>
                      <p className="mt-1 text-sm text-foreground/75 leading-relaxed">
                        {alt.reason}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <footer className="border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <span>
            In-constellation home for The Gate — vocabulary verbatim from the
            manifest; the runnable surface lives at{" "}
            <a
              href={externalGateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              {externalGateHost}
            </a>
            .
          </span>
          <span>
            Read from{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted text-foreground">
              constellation.constellationWidePrimitives.the-gate
            </code>
          </span>
        </div>
      </footer>
    </div>
  );
}
