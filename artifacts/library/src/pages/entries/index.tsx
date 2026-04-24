import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import {
  useListLibraryEntries,
  useListSubjects,
  useListProducers,
  useListProjectBuckets,
  type ListLibraryEntriesParams,
  ListLibraryEntriesStatus,
  ListLibraryEntriesKind,
  ListLibraryEntriesSort,
} from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EntryCard } from "@/components/EntryCard";
import { Search, Filter, UploadCloud, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function Entries() {
  const searchStr = useSearch();
  const searchParams = new URLSearchParams(searchStr);
  const [location, setLocation] = useLocation();

  const statusValues = Object.values(ListLibraryEntriesStatus) as string[];
  const kindValues = Object.values(ListLibraryEntriesKind) as string[];
  const sortValues = Object.values(ListLibraryEntriesSort) as string[];

  const rawStatus = searchParams.get("status");
  const rawKind = searchParams.get("kind");
  const rawSort = searchParams.get("sort");

  const query: ListLibraryEntriesParams = {
    search: searchParams.get("search") || undefined,
    subjectSlug: searchParams.get("subjectSlug") || undefined,
    producerSlug: searchParams.get("producerSlug") || undefined,
    bucketSlug: searchParams.get("bucketSlug") || undefined,
    status: rawStatus && statusValues.includes(rawStatus)
      ? (rawStatus as ListLibraryEntriesParams["status"])
      : undefined,
    kind: rawKind && kindValues.includes(rawKind)
      ? (rawKind as ListLibraryEntriesParams["kind"])
      : undefined,
    fileType: searchParams.get("fileType") || undefined,
    sort: rawSort && sortValues.includes(rawSort)
      ? (rawSort as ListLibraryEntriesParams["sort"])
      : ListLibraryEntriesSort.recent,
  };

  const { data, isLoading } = useListLibraryEntries(query);
  const { data: subjects } = useListSubjects();
  const { data: producers } = useListProducers();
  const { data: buckets } = useListProjectBuckets();

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchStr);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setLocation(`/entries?${params.toString()}`);
  };

  const clearFilters = () => {
    setLocation("/entries");
  };

  const hasFilters = Array.from(searchParams.keys()).some(k => k !== 'sort');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Library Entries</h1>
          <p className="text-muted-foreground">Browse all research documents, sources, and files.</p>
        </div>
        <Link href="/entries/new">
          <Button className="gap-2">
            <UploadCloud className="h-4 w-4" />
            Add Entry
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 space-y-4 shadow-sm">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search title, summary, or notes..." 
              className="pl-9"
              defaultValue={query.search || ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateFilter("search", e.currentTarget.value);
                }
              }}
              onBlur={(e) => updateFilter("search", e.target.value)}
            />
          </div>
          
          <Select value={query.kind || "all"} onValueChange={(v) => updateFilter("kind", v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All kinds" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All kinds</SelectItem>
              <SelectItem value="file">Files Only</SelectItem>
              <SelectItem value="web_source">Web Sources</SelectItem>
            </SelectContent>
          </Select>

          <Select value={query.subjectSlug || "all"} onValueChange={(v) => updateFilter("subjectSlug", v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {subjects?.map(s => (
                <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={query.producerSlug || "all"} onValueChange={(v) => updateFilter("producerSlug", v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All producers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All producers</SelectItem>
              {producers?.map(p => (
                <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={query.sort || "recent"} onValueChange={(v) => updateFilter("sort", v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="producer">Producer</SelectItem>
            </SelectContent>
          </Select>
          
          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4 mr-2" /> Clear
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-[300px]">
              <Skeleton className="w-full h-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : data?.entries.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-border rounded-xl bg-card">
          <Filter className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
          <h3 className="text-lg font-serif font-medium text-foreground mb-1">No entries found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters or search query.</p>
          {hasFilters && (
            <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
          )}
        </div>
      ) : (
        <>
          <div className="text-sm text-muted-foreground mb-4 font-medium">
            Found {data?.total || 0} entries
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
