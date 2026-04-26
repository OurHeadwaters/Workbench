import { useMemo } from "react";
import { Link } from "wouter";
import {
  FAILURE_MODES,
  FAILURE_MODE_THEMES,
  COUNTER_EXAMPLES,
  failureModesByTheme,
  type FailureMode,
} from "@workspace/why-stores-fail";
import {
  useListLibraryEntries,
  getListLibraryEntriesQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Quote,
} from "lucide-react";

interface WhyStoresFailPageProps {
  /** When true, suppress the owner-only nav and "back to library" affordances. */
  readOnly?: boolean;
}

export default function WhyStoresFailPage({ readOnly = false }: WhyStoresFailPageProps) {
  const { data, isLoading } = useListLibraryEntries(
    { limit: 200 },
    {
      query: {
        enabled: !readOnly,
        queryKey: getListLibraryEntriesQueryKey({ limit: 200 }),
      },
    },
  );

  const filenameToId = useMemo(() => {
    const map = new Map<string, string>();
    if (data?.entries) {
      for (const entry of data.entries) {
        if (entry.originalFilename) {
          map.set(entry.originalFilename, entry.id);
        }
      }
    }
    return map;
  }, [data?.entries]);

  const grouped = useMemo(() => failureModesByTheme(), []);

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-16">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
          <AlertTriangle className="h-3.5 w-3.5" />
          Synthesis · drawn from the research library
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary leading-tight">
          Why Northern Stores Fail
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          A named catalog of every failure mode in the current northern-store
          model — with the evidence and the source it came from. The dataset
          backing this page is the same one the Deer Lake Store deck reads from,
          so the deck and the library can never drift.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {FAILURE_MODE_THEMES.map((theme) => (
            <a key={theme.id} href={`#${theme.id}`}>
              <Badge
                variant="outline"
                className="bg-background/50 hover:bg-muted transition-colors cursor-pointer font-normal"
              >
                {theme.label}
                <span className="ml-2 text-muted-foreground">
                  {grouped[theme.id].length}
                </span>
              </Badge>
            </a>
          ))}
        </div>
      </header>

      {FAILURE_MODE_THEMES.filter(
        (theme, idx, arr) =>
          arr.findIndex((t) => t.id === theme.id) === idx,
      ).map((theme) => {
        const modes = grouped[theme.id];
        if (modes.length === 0) return null;
        return (
          <section key={theme.id} id={theme.id} className="space-y-6 scroll-mt-12">
            <div className="border-l-4 border-secondary pl-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-primary">
                {theme.label}
              </h2>
              <p className="text-muted-foreground mt-1 max-w-3xl">
                {theme.description}
              </p>
            </div>

            <div className="space-y-5">
              {modes.map((mode) => (
                <FailureModeCard
                  key={mode.id}
                  mode={mode}
                  filenameToId={filenameToId}
                  isLoading={isLoading}
                  readOnly={readOnly}
                />
              ))}
            </div>
          </section>
        );
      })}

      <section className="rounded-xl border-2 border-dashed border-secondary/40 bg-secondary/5 p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-secondary font-semibold">
          <Lightbulb className="h-4 w-4" />
          Counter-examples — it doesn't have to fail
        </div>
        <p className="text-foreground leading-relaxed">
          The synthesis above is "why it fails." The point of the synthesis is
          that none of these failure modes are laws of physics — they are the
          product of an ownership and supply-chain structure that has working
          alternatives operating today:
        </p>
        <ul className="space-y-3">
          {COUNTER_EXAMPLES.map((ex) => (
            <li key={ex.name} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-foreground">{ex.name}.</span>{" "}
                <span className="text-muted-foreground">{ex.detail}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {!readOnly && (
        <div className="pt-4">
          <Link href="/entries">
            <Button variant="outline" className="gap-2">
              Browse the underlying library entries
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function FailureModeCard({
  mode,
  filenameToId,
  isLoading,
  readOnly,
}: {
  mode: FailureMode;
  filenameToId: Map<string, string>;
  isLoading: boolean;
  readOnly: boolean;
}) {
  return (
    <Card className="border-border bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/50 bg-muted/40">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold mb-1">
              Failure mode · {mode.shortName}
            </div>
            <CardTitle className="text-xl md:text-2xl font-serif text-primary leading-tight">
              {mode.title}
            </CardTitle>
          </div>
          {mode.figures.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-end">
              {mode.figures.slice(0, 2).map((fig) => (
                <div
                  key={fig.label}
                  className="text-right border-l-2 border-accent pl-3"
                >
                  <div className="font-serif text-2xl font-bold text-accent leading-none">
                    {fig.value}
                  </div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1 max-w-[180px]">
                    {fig.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-5 space-y-4">
        <p className="text-base text-foreground italic flex gap-2 items-start">
          <Quote className="h-4 w-4 text-secondary shrink-0 mt-1" />
          <span>{mode.summary}</span>
        </p>
        <p className="text-foreground leading-relaxed">{mode.evidence}</p>

        {mode.figures.length > 2 && (
          <div className="flex flex-wrap gap-3 pt-1">
            {mode.figures.slice(2).map((fig) => (
              <div
                key={fig.label}
                className="rounded-md bg-muted/60 border border-border px-3 py-2"
              >
                <div className="font-serif text-base font-bold text-accent leading-tight">
                  {fig.value}
                </div>
                <div className="text-[11px] text-muted-foreground">{fig.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-border/50 space-y-2">
          <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold">
            Sources
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          ) : (
            <ul className="space-y-1.5">
              {mode.sources.map((src, i) => {
                const id = src.libraryFilename
                  ? filenameToId.get(src.libraryFilename)
                  : null;
                const linkable = !readOnly && id;
                return (
                  <li key={i} className="flex flex-wrap items-baseline gap-x-2 text-sm">
                    <span className="text-muted-foreground">→</span>
                    {linkable ? (
                      <Link href={`/entries/${id}`}>
                        <span className="text-secondary font-medium hover:underline cursor-pointer">
                          {src.libraryTitle}
                        </span>
                      </Link>
                    ) : (
                      <span className="text-foreground font-medium">
                        {src.libraryTitle}
                        {!readOnly && src.libraryFilename && !id && (
                          <span className="text-muted-foreground italic">
                            {" "}
                            (entry not yet in library)
                          </span>
                        )}
                      </span>
                    )}
                    {src.upstream && (
                      <span className="text-muted-foreground italic">
                        — citing {src.upstream}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
