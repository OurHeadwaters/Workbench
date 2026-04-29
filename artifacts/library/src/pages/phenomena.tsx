import { useMemo } from "react";
import { Link, useRoute } from "wouter";
import {
  PHENOMENA,
  FAILURE_MODES,
  FAILURE_MODE_VOICES,
  resolvePhenomenonSource,
  failureModesForPhenomenon,
  type Phenomenon,
  type PhenomenonDataPoint,
  type FailureModeVoice,
} from "@workspace/why-stores-fail";
import {
  useListLibraryEntries,
  getListLibraryEntriesQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Languages,
  Network,
  Quote,
} from "lucide-react";

interface PhenomenaPageProps {
  /** When true, suppress the owner-only nav and "back to library" affordances. */
  readOnly?: boolean;
}

export default function PhenomenaIndexPage({ readOnly = false }: PhenomenaPageProps) {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-16">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
          <EyeOff className="h-3.5 w-3.5" />
          Cross-industry · phenomena nobody owns
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary leading-tight">
          Phenomena nobody owns
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          Several headline numbers in the library are actually one phenomenon
          described by industries that don't talk to each other. Each
          phenomenon below groups data points from Transport Canada, federal
          program audits, academic researchers, distributors, retailers, and
          the community itself — and shows them side-by-side as readings of
          one structural object. The link is the finding.
        </p>
        <p className="text-sm text-muted-foreground/90 italic max-w-3xl leading-relaxed border-l-2 border-border pl-4">
          A <em>phenomenon</em>, once it has a load-bearing name and rungs and
          a principle, becomes a <em>primitive</em> in the codetry-handbook's
          constellation. The library is upstream; the constellation is
          downstream. <em>The Standby</em> began as a phenomenon here (food
          insecurity organising itself into call/watch/standby stock/debrief
          across kitchens that don't talk) before it was registered as a
          constellation-wide primitive in the handbook. New phenomena that
          earn that promotion will appear there too.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline" className="bg-background/50 font-normal">
            <Network className="h-3 w-3 mr-1.5" />
            {PHENOMENA.length}{" "}
            {PHENOMENA.length === 1 ? "phenomenon" : "phenomena"} seeded
          </Badge>
          <Badge variant="outline" className="bg-background/50 font-normal">
            {PHENOMENA.reduce((sum, p) => sum + p.dataPoints.length, 0)}{" "}
            cross-industry data points linked
          </Badge>
        </div>
      </header>

      <ul className="space-y-5" data-testid="phenomena-list">
        {PHENOMENA.map((phen) => (
          <li key={phen.id}>
            <PhenomenonSummaryCard phenomenon={phen} readOnly={readOnly} />
          </li>
        ))}
      </ul>

      {!readOnly && (
        <div className="pt-4 flex flex-wrap gap-3">
          <Link href="/why-stores-fail">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
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

/**
 * Detail page for one phenomenon — the side-by-side industry table.
 * Resolves library filenames to entry ids when not in read-only / share mode.
 */
export function PhenomenonDetailPage({ readOnly = false }: PhenomenaPageProps) {
  const [, params] = useRoute("/phenomena/:id");
  const id = params?.id;
  const phenomenon = useMemo(
    () => PHENOMENA.find((p) => p.id === id),
    [id],
  );

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

  if (!phenomenon) {
    return (
      <div className="space-y-4 py-12 text-center">
        <h1 className="text-2xl font-serif font-bold text-primary">
          Phenomenon not found
        </h1>
        <p className="text-muted-foreground">
          That phenomenon isn't in the catalog.
        </p>
        {!readOnly && (
          <Link href="/phenomena">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to all phenomena
            </Button>
          </Link>
        )}
      </div>
    );
  }

  const linkedFailureModes = failureModesForPhenomenon(phenomenon);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-16">
      {!readOnly && (
        <div>
          <Link href="/phenomena">
            <Button variant="ghost" size="sm" className="gap-2 -ml-3">
              <ArrowLeft className="h-4 w-4" />
              All phenomena
            </Button>
          </Link>
        </div>
      )}

      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
          <Eye className="h-3.5 w-3.5" />
          Phenomenon · the community noun
        </div>
        <h1
          className="text-3xl md:text-4xl font-serif font-bold text-primary leading-tight"
          data-testid="phenomenon-community-name"
        >
          "{phenomenon.communityName}"
        </h1>
        <p className="text-lg text-foreground max-w-3xl leading-relaxed flex gap-2 items-start">
          <Quote className="h-4 w-4 text-secondary shrink-0 mt-1.5" />
          <span>{phenomenon.summary}</span>
        </p>
        <div className="rounded-lg border border-dashed border-secondary/40 bg-secondary/5 px-4 py-3 max-w-3xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold mb-1.5">
            <EyeOff className="h-3.5 w-3.5" />
            Why nobody owns this
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {phenomenon.unownedBecause}
          </p>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-secondary font-semibold">
          <Languages className="h-4 w-4" />
          Same object, six industries
        </div>
        <p className="text-muted-foreground max-w-3xl">
          Each row below is one industry's published data point. The columns
          line them up so you can read across and see they are all describing
          the same thing.
        </p>
        <PhenomenonDataPointsTable
          phenomenon={phenomenon}
          filenameToId={filenameToId}
          isLoading={isLoading}
          readOnly={readOnly}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-secondary font-semibold">
          <Network className="h-4 w-4" />
          Failure modes this cuts across
        </div>
        <p className="text-muted-foreground max-w-3xl">
          The same phenomenon produces several of the named failure modes in
          the catalog. Each card below links back to its full evidence and
          drift-map row.
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3" data-testid="phenomenon-failure-modes">
          {linkedFailureModes.map((mode) => (
            <li key={mode.id}>
              <Link href={readOnly ? "#" : `/why-stores-fail#${mode.theme}`}>
                <Card className={readOnly ? "border-border" : "hover-elevate cursor-pointer border-border"}>
                  <CardContent className="p-4">
                    <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold mb-1">
                      Failure mode · {mode.shortName}
                    </div>
                    <div className="font-serif text-base text-primary leading-snug">
                      {mode.title}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function PhenomenonSummaryCard({
  phenomenon,
  readOnly,
}: {
  phenomenon: Phenomenon;
  readOnly: boolean;
}) {
  const linkedModes = failureModesForPhenomenon(phenomenon);
  const inner = (
    <Card
      className={
        readOnly
          ? "border-border bg-card shadow-sm"
          : "border-border bg-card shadow-sm hover-elevate cursor-pointer"
      }
      data-testid={`phenomenon-card-${phenomenon.id}`}
    >
      <CardHeader className="pb-3 border-b border-border/50 bg-muted/30">
        <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold mb-1">
          Phenomenon · the community noun
        </div>
        <CardTitle className="text-xl md:text-2xl font-serif text-primary leading-tight">
          "{phenomenon.communityName}"
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-4">
        <p className="text-foreground leading-relaxed">{phenomenon.summary}</p>

        <div className="flex flex-wrap gap-2">
          {phenomenon.dataPoints.map((dp, i) => {
            const voice = FAILURE_MODE_VOICES.find((v) => v.id === dp.voice);
            return (
              <Badge
                key={i}
                variant="outline"
                className="bg-background/50 font-normal border-border"
              >
                <span className="text-muted-foreground mr-1.5">
                  {voice?.label ?? dp.voice}:
                </span>
                <span className="font-serif font-semibold text-accent mr-1.5">
                  {dp.figure.value}
                </span>
                <span className="text-foreground italic">"{dp.industryName}"</span>
              </Badge>
            );
          })}
        </div>

        <div className="pt-2 border-t border-border/50 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            Cuts across {linkedModes.length} failure mode
            {linkedModes.length === 1 ? "" : "s"}:
          </span>{" "}
          {linkedModes.map((m, i) => (
            <span key={m.id}>
              {i > 0 && " · "}
              {m.shortName}
            </span>
          ))}
        </div>

        {!readOnly && (
          <div className="flex justify-end">
            <span className="text-secondary text-sm font-medium inline-flex items-center gap-1">
              See the side-by-side <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
  return readOnly ? inner : <Link href={`/phenomena/${phenomenon.id}`}>{inner}</Link>;
}

function PhenomenonDataPointsTable({
  phenomenon,
  filenameToId,
  isLoading,
  readOnly,
}: {
  phenomenon: Phenomenon;
  filenameToId: Map<string, string>;
  isLoading: boolean;
  readOnly: boolean;
}) {
  const byVoice = new Map<FailureModeVoice, PhenomenonDataPoint[]>();
  for (const dp of phenomenon.dataPoints) {
    const list = byVoice.get(dp.voice) ?? [];
    list.push(dp);
    byVoice.set(dp.voice, list);
  }

  return (
    <div
      className="rounded-md border border-border overflow-hidden bg-card"
      data-testid={`phenomenon-table-${phenomenon.id}`}
    >
      <table className="w-full text-sm">
        <thead className="bg-muted/40 border-b border-border">
          <tr>
            <th className="text-left py-2 px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold w-[160px]">
              Industry voice
            </th>
            <th className="text-left py-2 px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              What they call it
            </th>
            <th className="text-left py-2 px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold w-[180px]">
              Figure / finding
            </th>
            <th className="text-left py-2 px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Source
            </th>
          </tr>
        </thead>
        <tbody>
          {FAILURE_MODE_VOICES.map((voice) => {
            const dps = byVoice.get(voice.id) ?? [];
            if (dps.length === 0) {
              return (
                <tr
                  key={voice.id}
                  className="border-b last:border-b-0 border-border/40 bg-muted/10"
                  data-testid={`phenomenon-row-${phenomenon.id}-${voice.id}`}
                  data-empty="true"
                >
                  <td
                    className="py-2 px-3 text-xs uppercase tracking-wider text-muted-foreground font-semibold align-top"
                    title={voice.description}
                  >
                    {voice.label}
                  </td>
                  <td colSpan={3} className="py-2 px-3 text-muted-foreground italic opacity-60">
                    no published data point linked yet
                  </td>
                </tr>
              );
            }
            return dps.map((dp, idx) => {
              const resolved = resolvePhenomenonSource(dp);
              const filename = resolved?.source.libraryFilename ?? null;
              const entryId = filename ? filenameToId.get(filename) : undefined;
              const linkable = !readOnly && !!entryId;
              const sourceLabel =
                resolved?.source.upstream || resolved?.source.libraryTitle || "—";
              return (
                <tr
                  key={`${voice.id}-${idx}`}
                  className="border-b last:border-b-0 border-border/40 align-top"
                  data-testid={`phenomenon-row-${phenomenon.id}-${voice.id}`}
                >
                  {idx === 0 ? (
                    <td
                      className="py-3 px-3 text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                      title={voice.description}
                      rowSpan={dps.length}
                    >
                      {voice.label}
                    </td>
                  ) : null}
                  <td className="py-3 px-3 text-foreground italic">
                    "{dp.industryName}"
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-serif text-base font-bold text-accent leading-tight">
                      {dp.figure.value}
                    </div>
                    <div className="text-[11px] text-muted-foreground leading-snug">
                      {dp.figure.label}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-sm">
                    {isLoading && filename ? (
                      <Skeleton className="h-4 w-3/4" />
                    ) : linkable ? (
                      <Link href={`/entries/${entryId}`}>
                        <span className="text-secondary font-medium hover:underline cursor-pointer">
                          {sourceLabel}
                        </span>
                      </Link>
                    ) : (
                      <span className="text-foreground">
                        {sourceLabel}
                        {!readOnly && filename && !entryId && (
                          <span className="text-muted-foreground italic">
                            {" "}
                            (entry not yet in library)
                          </span>
                        )}
                      </span>
                    )}
                    {resolved && (
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        via failure mode:{" "}
                        <span className="italic">{resolved.mode.shortName}</span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
}
