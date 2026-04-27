import { useMemo } from "react";
import { Link } from "wouter";
import {
  REVERSE_TESTS,
  FAILURE_MODES,
  type ReverseTest,
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
  ArrowLeftRight,
  ArrowRight,
  BookOpen,
  ExternalLink,
  FileText,
  Quote,
  Repeat,
} from "lucide-react";

interface ReverseTestPageProps {
  /** When true, suppress owner-only nav affordances. */
  readOnly?: boolean;
}

export default function ReverseTestPage({ readOnly = false }: ReverseTestPageProps) {
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

  const failureModeShortNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const mode of FAILURE_MODES) {
      map.set(mode.id, mode.shortName);
    }
    return map;
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-16">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
          <Repeat className="h-3.5 w-3.5" />
          Method · the codetry §4.2 rename test, run in reverse
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary leading-tight">
          Reverse test on the research itself
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          The codetry rename test, normally used on a developer's own model,
          run backwards on the academic and government sources we cite. Take
          the academic noun, substitute the community noun, and ask whether
          the paper's recommendation still makes sense. Where it doesn't, the
          academic frame had drifted off the phenomenon — and that drift is
          itself a finding back to the research community.
        </p>

        {!readOnly && (
          <div className="pt-1">
            <Link href="/why-stores-fail">
              <Button variant="outline" size="sm" className="gap-2">
                <BookOpen className="h-4 w-4" />
                See the failure-mode catalog these sources support
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </header>

      <section className="rounded-xl border border-border bg-muted/30 p-5 md:p-6 space-y-3">
        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-secondary font-semibold">
          <FileText className="h-4 w-4" />
          Findings at a glance
        </div>
        <p className="text-sm text-muted-foreground">
          One sentence per reverse test, so you can scan the drift without
          opening each one.
        </p>
        <ul className="space-y-3 pt-1">
          {REVERSE_TESTS.map((test) => (
            <li
              key={test.id}
              className="flex items-start gap-3"
              data-testid={`finding-summary-${test.id}`}
            >
              <ArrowLeftRight className="h-4 w-4 text-secondary mt-1 shrink-0" />
              <div>
                <a
                  href={`#${test.id}`}
                  className="font-medium text-foreground hover:text-secondary transition-colors"
                >
                  {test.title}
                </a>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {test.oneSentenceFinding}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="space-y-8">
        {REVERSE_TESTS.map((test) => (
          <ReverseTestCard
            key={test.id}
            test={test}
            filenameToId={filenameToId}
            failureModeShortNames={failureModeShortNames}
            isLoading={isLoading}
            readOnly={readOnly}
          />
        ))}
      </div>

      {!readOnly && (
        <div className="pt-4 flex flex-wrap gap-3">
          <Link href="/why-stores-fail">
            <Button variant="outline" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Back to Why Stores Fail
            </Button>
          </Link>
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

function ReverseTestCard({
  test,
  filenameToId,
  failureModeShortNames,
  isLoading,
  readOnly,
}: {
  test: ReverseTest;
  filenameToId: Map<string, string>;
  failureModeShortNames: Map<string, string>;
  isLoading: boolean;
  readOnly: boolean;
}) {
  const entryId = test.sourceRef.libraryFilename
    ? filenameToId.get(test.sourceRef.libraryFilename)
    : null;
  const linkable = !readOnly && !!entryId;
  const failureModeShort = failureModeShortNames.get(
    test.sourceRef.failureModeId,
  );

  return (
    <Card
      id={test.id}
      className="border-border bg-card shadow-sm overflow-hidden scroll-mt-12"
      data-testid={`reverse-test-${test.id}`}
    >
      <CardHeader className="pb-3 border-b border-border/50 bg-muted/40">
        <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold mb-1">
          Reverse test
        </div>
        <CardTitle className="text-xl md:text-2xl font-serif text-primary leading-tight">
          {test.title}
        </CardTitle>
        <div className="flex flex-wrap gap-2 pt-2">
          {failureModeShort && (
            <Badge variant="outline" className="font-normal bg-background/60">
              Catalog entry · {failureModeShort}
            </Badge>
          )}
          <Badge variant="outline" className="font-normal bg-background/60">
            {test.substitutions.length} substitution
            {test.substitutions.length === 1 ? "" : "s"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-background p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold">
              <Quote className="h-3.5 w-3.5" />
              Original — academic register
            </div>
            <p
              className="text-sm leading-relaxed text-foreground"
              data-testid={`original-passage-${test.id}`}
            >
              {test.originalPassage}
            </p>
          </div>
          <div className="rounded-lg border-2 border-secondary/40 bg-secondary/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-secondary font-semibold">
              <Repeat className="h-3.5 w-3.5" />
              Renamed — community nouns
            </div>
            <p
              className="text-sm leading-relaxed text-foreground"
              data-testid={`renamed-passage-${test.id}`}
            >
              {test.renamedPassage}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-accent/5 border-l-4 border-accent px-4 py-3 space-y-2">
          <div className="text-xs uppercase tracking-[0.14em] text-accent font-semibold">
            What changes when you rename
          </div>
          <p
            className="text-foreground leading-relaxed"
            data-testid={`finding-${test.id}`}
          >
            {test.finding}
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold">
            Substitutions
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="text-left font-semibold text-muted-foreground px-3 py-2 w-1/2">
                    Academic noun
                  </th>
                  <th className="text-left font-semibold text-muted-foreground px-3 py-2 w-1/2">
                    Community noun
                  </th>
                </tr>
              </thead>
              <tbody>
                {test.substitutions.map((sub, i) => (
                  <tr key={i} className="border-t border-border/60 align-top">
                    <td className="px-3 py-2 text-foreground italic">
                      {sub.academicNoun}
                    </td>
                    <td className="px-3 py-2 text-foreground">
                      {sub.communityNoun}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-3 border-t border-border/50 space-y-2">
          <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold">
            Source
          </div>
          {isLoading ? (
            <Skeleton className="h-5 w-3/4" />
          ) : (
            <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
              <span className="text-muted-foreground">→</span>
              {linkable ? (
                <Link href={`/entries/${entryId}`}>
                  <span
                    className="text-secondary font-medium hover:underline cursor-pointer inline-flex items-center gap-1"
                    data-testid={`source-link-${test.id}`}
                  >
                    {test.sourceRef.libraryTitle}
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </Link>
              ) : (
                <span className="text-foreground font-medium">
                  {test.sourceRef.libraryTitle}
                  {!readOnly &&
                    test.sourceRef.libraryFilename &&
                    !entryId && (
                      <span className="text-muted-foreground italic">
                        {" "}
                        (entry not yet in library)
                      </span>
                    )}
                </span>
              )}
              {test.sourceRef.upstream && (
                <span className="text-muted-foreground italic">
                  — citing {test.sourceRef.upstream}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
