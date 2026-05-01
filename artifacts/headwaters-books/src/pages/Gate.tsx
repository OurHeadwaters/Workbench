import { useMemo, useState, useEffect, type ReactNode } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  Trash2,
  Plus,
  ExternalLink,
  Layers,
  BookMarked,
  Tag,
  XCircle,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// SOURCE OF TRUTH (Task #562): the constellation manifest lives in the
// codetry-handbook artifact at artifacts/codetry-handbook/data/. We
// import the bundled snapshot directly via the workspace package
// export — there is no local copy or sync script in this artifact
// anymore. Edits made in the canonical file propagate to this page on
// the next build with no manual step.
import { constellation } from "@workspace/codetry-handbook/data/constellation";
import {
  useGateStore,
  type GateDirection,
  type GateRung,
  type SubstitutionEntry,
} from "@/lib/gateStore";

// AUDIT NOTE — Standby-leaks-into-Gate bug class
// (Task #473, Task #475, Task #478, Task #489)
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
// History of this page:
// - Task #489 first landed the in-constellation home for The Gate at
//   /gate as a *shell* page that read this manifest entry verbatim
//   (vocabulary chips, severity ladder with refused-is-first-class
//   paragraph, three sub-shelves, four rejected alternatives, footer
//   link out to legacy-gatekeeper.replit.app).
// - Task #478 then brought the runnable substitution surface in-repo
//   on the same /gate route — the bright-side ↔ massity composer plus
//   the persisted substitution ledger below — so the manifest entry
//   and the runnable surface live at the same address. The legacy host
//   stayed as a footer reference link only, and is parsed back out of
//   the manifest scope text below (rather than hardcoded) so this page
//   tracks the manifest if the reference link ever moves.

const RUNG_TONE: Record<GateRung, { dot: string; ring: string; text: string; bg: string }> = {
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
    dot: "bg-red-600",
    ring: "ring-red-500/40",
    text: "text-red-700",
    bg: "bg-red-50",
  },
};

const SUB_SHELF_ICONS: Record<string, ReactNode> = {
  Mappings: <BookMarked className="w-5 h-5 text-primary" />,
  Substitutions: <Layers className="w-5 h-5 text-primary" />,
  Categories: <Tag className="w-5 h-5 text-primary" />,
};

// Default category seeds in case the practitioner wants to file a
// substitution before a custom category exists.
//
// SOURCE OF TRUTH: this list is *transcribed verbatim* from the Gate
// primitive in the canonical manifest at
//   artifacts/codetry-handbook/data/constellation.json
// — specifically the vocabulary entry for "a category", which reads:
//   "the domain a mapping belongs to (Pragmatism, Politics, Regulations,
//    Privacy, Banking, …); each category is a sub-shelf inside the Gate"
// The trailing "…" in the manifest is an explicit invitation to add more,
// which is why the composer also accepts a custom category. If a category
// is added/removed in the manifest, update this seed list to match.
//
// (We don't derive this list at runtime from the vocabulary string because
// the manifest field is human prose, not a structured array — parsing it
// would couple the surface to a phrasing convention rather than to a data
// shape.)
const DEFAULT_CATEGORIES = [
  "Pragmatism",
  "Politics",
  "Regulations",
  "Privacy",
  "Banking",
];

// The legacy Gate runnable surface address. After Task #478 it is no
// longer the source of truth (the runnable surface lives at /gate inside
// this app), but the manifest's `scope` field still names it as a
// historical reference link. Parse the host out of that prose so this
// page tracks the manifest if the reference link ever moves; only fall
// back to the known address if the scope text is rewritten in a way that
// drops the host.
const LEGACY_GATE_FALLBACK_HOST = "legacy-gatekeeper.replit.app";
function legacyGateHostFromScope(scope: string | undefined): string {
  if (!scope) return LEGACY_GATE_FALLBACK_HOST;
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
  return hostMatch ? hostMatch[0] : LEGACY_GATE_FALLBACK_HOST;
}

function formatStamp(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${date}, ${time}`;
}

function directionLabel(d: GateDirection): string {
  return d === "bright-to-massity"
    ? "bright side → massity"
    : "massity → bright side";
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
        Constellation manifest is missing the Gate primitive. Edit the
        canonical file at{" "}
        <code className="ml-1 px-2 py-0.5 rounded bg-muted text-foreground text-sm">
          artifacts/codetry-handbook/data/constellation.json
        </code>{" "}
        and rerun{" "}
        <code className="ml-1 px-2 py-0.5 rounded bg-muted text-foreground text-sm">
          pnpm --filter @workspace/codetry-handbook run sync-constellation
        </code>
        .
      </div>
    );
  }

  const ladder = gatePrimitive.severityLadder ?? [];
  const subShelves = gatePrimitive.subShelves ?? [];
  const vocabulary = gatePrimitive.vocabulary ?? [];
  const rejected = gatePrimitive.rejectedAlternatives ?? [];
  const legacyGateHost = legacyGateHostFromScope(gatePrimitive.scope);
  const legacyGateUrl = `https://${legacyGateHost}`;

  const store = useGateStore();
  const [openComposer, setOpenComposer] = useState(false);
  const [confidentialCount, setConfidentialCount] = useState(0);

  useEffect(() => {
    const token = (() => {
      try { return window.localStorage.getItem("library:owner-token"); } catch { return null; }
    })();
    if (!token) return;
    fetch("/api/library/confidential/count", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data != null) setConfidentialCount(data.count ?? 0); })
      .catch(() => {});
  }, []);

  if (!store.hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading the gate…
      </div>
    );
  }

  // Categories the practitioner has actually used, plus the defaults.
  // The picker's role is to encourage filing under a known category
  // without forcing one — the manifest treats categories as an
  // open-ended sub-shelf, not a fixed enum.
  const usedCategories = Array.from(
    new Set(store.substitutions.map((s) => s.category).filter(Boolean)),
  );
  const allCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...usedCategories]),
  ).sort();

  const cleared = store.substitutions.filter((s) => s.rung === "cleared");
  const refused = store.substitutions.filter((s) => s.rung === "refused");
  const inFlight = store.substitutions.filter(
    (s) => s.rung === "draft" || s.rung === "under-review",
  );

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
                Z3 · {constellation.z3?.memberFacingBrand ?? "807 Benefits"} · sibling to The Standby
              </div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl text-foreground leading-tight">
                  The Gate
                </h1>
                {confidentialCount > 0 && (
                  <span
                    title={`${confidentialCount} unreviewed confidential file${confidentialCount !== 1 ? "s" : ""} in the Library queue`}
                    className="inline-flex items-center gap-1 bg-rose-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full"
                  >
                    <ShieldAlert className="w-3 h-3" />
                    {confidentialCount}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <div>manifest v{constellation.version}</div>
            <div>updated {constellation.lastUpdated}</div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Primitive header — vocabulary verbatim from the constellation manifest */}
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

        {/* The bright side ↔ massity diagram — Gate-specific framing.
            Using only the canonical pairs the manifest names verbatim
            (neighbour↔resident, send↔remit, fee↔service-charge,
            money↔funds) so no other primitive's vocabulary leaks here. */}
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
                neighbour · send · fee · money
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
                resident · remit · service charge · funds
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
              const tone = RUNG_TONE[rung.rung as GateRung];
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
            {subShelves.map((shelf) => (
              <Card
                key={shelf.name}
                className="border-border"
                data-testid={`subshelf-${shelf.name.toLowerCase()}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    {SUB_SHELF_ICONS[shelf.name] ?? (
                      <Layers className="w-5 h-5 text-primary" />
                    )}
                    {shelf.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {shelf.role}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Names rejected on paper — verbatim, four single-side or single-direction names */}
        {rejected.length > 0 && (
          <section className="mb-10">
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

        <Separator className="mb-8" />

        {/* Substitutions — the runnable ledger that used to live at the legacy host */}
        <section>
          <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
            <div>
              <h2 className="font-serif text-2xl text-foreground">
                Substitutions on the ledger
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                A substitution is a single instance of a mapping being applied
                to a piece of crossing language. Pass it through the Gate; the
                ledger keeps both names on file.
              </p>
            </div>
            <Button
              data-testid="button-log-substitution"
              onClick={() => setOpenComposer(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" /> Log a substitution
            </Button>
          </div>

          {openComposer && (
            <SubstitutionComposer
              ladder={ladder.map((l) => l.rung as GateRung)}
              categories={allCategories}
              onCancel={() => setOpenComposer(false)}
              onSubmit={(input) => {
                store.logSubstitution(input);
                setOpenComposer(false);
              }}
            />
          )}

          {store.substitutions.length === 0 && !openComposer && (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center text-muted-foreground">
                <ArrowLeftRight className="w-6 h-6 mx-auto mb-2 opacity-60" />
                The ledger is empty. The Gate is closed and calm.
              </CardContent>
            </Card>
          )}

          {inFlight.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                In flight
              </h3>
              <div className="space-y-2">
                {inFlight.map((s) => (
                  <SubstitutionRow
                    key={s.id}
                    substitution={s}
                    onSetRung={(rung) => store.setRung(s.id, rung)}
                    onDelete={() => store.deleteSubstitution(s.id)}
                    ladder={ladder.map((l) => l.rung as GateRung)}
                  />
                ))}
              </div>
            </div>
          )}

          {cleared.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Cleared
              </h3>
              <div className="space-y-2">
                {cleared.map((s) => (
                  <SubstitutionRow
                    key={s.id}
                    substitution={s}
                    onSetRung={(rung) => store.setRung(s.id, rung)}
                    onDelete={() => store.deleteSubstitution(s.id)}
                    ladder={ladder.map((l) => l.rung as GateRung)}
                  />
                ))}
              </div>
            </div>
          )}

          {refused.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Refused
              </h3>
              <div className="space-y-2">
                {refused.map((s) => (
                  <SubstitutionRow
                    key={s.id}
                    substitution={s}
                    onSetRung={(rung) => store.setRung(s.id, rung)}
                    onDelete={() => store.deleteSubstitution(s.id)}
                    ladder={ladder.map((l) => l.rung as GateRung)}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <span>
            In-repo runnable surface for The Gate — replaces the previously
            external tool. State lives in this browser only.
          </span>
          <span className="flex items-center gap-3">
            <a
              href={legacyGateUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-external-gate"
              className="inline-flex items-center gap-1 text-foreground/70 hover:text-foreground underline-offset-4 hover:underline"
            >
              {legacyGateHost} <ExternalLink className="w-3 h-3" />
            </a>
            <span>
              read from{" "}
              <code className="px-1.5 py-0.5 rounded bg-muted text-foreground">
                constellation.constellationWidePrimitives.the-gate
              </code>
            </span>
          </span>
        </div>
      </footer>
    </div>
  );
}

function SubstitutionRow({
  substitution: s,
  onSetRung,
  onDelete,
  ladder,
}: {
  substitution: SubstitutionEntry;
  onSetRung: (rung: GateRung) => void;
  onDelete: () => void;
  ladder: GateRung[];
}) {
  const tone = RUNG_TONE[s.rung];
  const arrow =
    s.direction === "bright-to-massity" ? (
      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    ) : (
      <ArrowLeft className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    );
  const left =
    s.direction === "bright-to-massity" ? s.brightSide : s.massity;
  const right =
    s.direction === "bright-to-massity" ? s.massity : s.brightSide;

  return (
    <div
      data-testid={`row-substitution-${s.id}`}
      className={`rounded-lg border border-border bg-card px-4 py-3 ring-1 ${tone.ring}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`inline-block w-2.5 h-2.5 rounded-full ${tone.dot} mt-1.5 flex-shrink-0`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap text-foreground">
            <span className="font-medium">{left}</span>
            {arrow}
            <span className="font-medium">{right}</span>
            <Badge variant="outline" className="font-normal text-xs">
              {s.category}
            </Badge>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            <span className={`uppercase tracking-wide font-semibold ${tone.text}`}>
              {s.rung}
            </span>
            <span> · {directionLabel(s.direction)} · logged {formatStamp(s.loggedAt)}</span>
            {s.loggedBy ? <span> · by {s.loggedBy}</span> : null}
            {s.document ? <span> · doc: {s.document}</span> : null}
          </div>
          {s.note && (
            <p className="mt-2 text-sm text-foreground/80 leading-snug">
              {s.note}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Select
            value={s.rung}
            onValueChange={(v) => onSetRung(v as GateRung)}
          >
            <SelectTrigger
              className="h-8 text-xs w-32"
              data-testid={`select-rung-${s.id}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ladder.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-muted-foreground hover:text-destructive"
            title="Remove this substitution"
            data-testid={`button-delete-${s.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SubstitutionComposer({
  ladder,
  categories,
  onSubmit,
  onCancel,
}: {
  ladder: GateRung[];
  categories: string[];
  onSubmit: (input: {
    direction: GateDirection;
    rung: GateRung;
    brightSide: string;
    massity: string;
    category: string;
    document?: string;
    note?: string;
    loggedBy?: string;
  }) => void;
  onCancel: () => void;
}) {
  const [direction, setDirection] = useState<GateDirection>("bright-to-massity");
  const [rung, setRung] = useState<GateRung>(ladder[0] ?? "draft");
  const [brightSide, setBrightSide] = useState("");
  const [massity, setMassity] = useState("");
  const [category, setCategory] = useState(
    categories.includes("Pragmatism") ? "Pragmatism" : (categories[0] ?? "Pragmatism"),
  );
  const [customCategory, setCustomCategory] = useState("");
  const [document, setDocument] = useState("");
  const [note, setNote] = useState("");
  const [loggedBy, setLoggedBy] = useState("");

  const finalCategory = customCategory.trim() || category;
  const canSubmit =
    brightSide.trim().length > 0 &&
    massity.trim().length > 0 &&
    finalCategory.trim().length > 0;

  return (
    <Card className="border-primary/40 mb-4">
      <CardHeader>
        <CardTitle className="font-serif text-lg">Log a substitution</CardTitle>
        <CardDescription>
          Both names stay on file. The Gate keeps the bright-side noun
          alongside its massity equivalent so the translation stays
          auditable.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="gate-direction">Direction</Label>
            <Select
              value={direction}
              onValueChange={(v) => setDirection(v as GateDirection)}
            >
              <SelectTrigger
                id="gate-direction"
                data-testid="select-direction"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bright-to-massity">
                  bright side → massity (going out)
                </SelectItem>
                <SelectItem value="massity-to-bright">
                  massity → bright side (coming in)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gate-rung">Open at rung</Label>
            <Select value={rung} onValueChange={(v) => setRung(v as GateRung)}>
              <SelectTrigger id="gate-rung" data-testid="select-composer-rung">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ladder.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="gate-bright">Bright-side noun</Label>
            <Input
              id="gate-bright"
              data-testid="input-bright"
              placeholder="neighbour · send · fee · money"
              value={brightSide}
              onChange={(e) => setBrightSide(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gate-massity">Massity equivalent</Label>
            <Input
              id="gate-massity"
              data-testid="input-massity"
              placeholder="resident · remit · service charge · funds"
              value={massity}
              onChange={(e) => setMassity(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="gate-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                id="gate-category"
                data-testid="select-category"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gate-custom-category">…or new category</Label>
            <Input
              id="gate-custom-category"
              data-testid="input-custom-category"
              placeholder="leave blank to use selected"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="gate-doc">Document (optional)</Label>
            <Input
              id="gate-doc"
              data-testid="input-document"
              placeholder="bank-letter-2026-04-29.docx"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gate-by">Logged by (optional)</Label>
            <Input
              id="gate-by"
              data-testid="input-logged-by"
              placeholder="founder · steward · bookkeeper"
              value={loggedBy}
              onChange={(e) => setLoggedBy(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="gate-note">Notes (optional)</Label>
          <Textarea
            id="gate-note"
            data-testid="input-note"
            placeholder="Why this substitution; what was at stake; what the Gate wants on the record."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            data-testid="button-submit-substitution"
            disabled={!canSubmit}
            onClick={() =>
              onSubmit({
                direction,
                rung,
                brightSide,
                massity,
                category: finalCategory,
                document: document || undefined,
                note: note || undefined,
                loggedBy: loggedBy || undefined,
              })
            }
          >
            Log it
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
