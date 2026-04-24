import { useState } from "react";
import { Link } from "wouter";
import { useListProjectBuckets } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, ArrowRight } from "lucide-react";

export default function Buckets() {
  const { data: buckets, isLoading } = useListProjectBuckets();
  const [search, setSearch] = useState("");

  const filteredBuckets = buckets?.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    (b.description && b.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Project Buckets</h1>
          <p className="text-muted-foreground">High-level projects and initiatives organizing the research.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
        <Input 
          placeholder="Search buckets..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      ) : filteredBuckets?.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-border rounded-xl bg-card">
          <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
          <p className="text-muted-foreground">No project buckets found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuckets?.map((bucket) => (
            <Link key={bucket.slug} href={`/entries?bucketSlug=${bucket.slug}`}>
              <Card className="h-full hover-elevate cursor-pointer transition-all border-border bg-card hover:border-secondary/50 group">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <FolderOpen className="h-5 w-5 text-muted-foreground group-hover:text-secondary transition-colors" />
                      <CardTitle className="font-serif text-lg group-hover:text-primary transition-colors">
                        {bucket.name}
                      </CardTitle>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardHeader>
                <CardContent>
                  {bucket.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {bucket.description}
                    </p>
                  )}
                  <Badge variant="secondary" className="bg-accent/10 text-accent-foreground border-none">
                    {bucket.entryCount} entries
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
