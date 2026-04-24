import { useState } from "react";
import { Link } from "wouter";
import { useListSubjects } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tag, ArrowRight } from "lucide-react";

export default function Subjects() {
  const { data: subjects, isLoading } = useListSubjects();
  const [search, setSearch] = useState("");

  const filteredSubjects = subjects?.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    (s.description && s.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Subjects</h1>
          <p className="text-muted-foreground">Taxonomy and topics used across the research library.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
        <Input 
          placeholder="Search subjects..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      ) : filteredSubjects?.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-border rounded-xl bg-card">
          <Tag className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
          <p className="text-muted-foreground">No subjects found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects?.map((subject) => (
            <Link key={subject.slug} href={`/entries?subjectSlug=${subject.slug}`}>
              <Card className="h-full hover-elevate cursor-pointer transition-all border-border bg-card hover:border-secondary/50 group">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: subject.color || 'hsl(var(--muted))' }} 
                      />
                      <CardTitle className="font-serif text-lg group-hover:text-primary transition-colors">
                        {subject.name}
                      </CardTitle>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardHeader>
                <CardContent>
                  {subject.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {subject.description}
                    </p>
                  )}
                  <Badge variant="secondary" className="bg-accent/10 text-accent-foreground border-none">
                    {subject.entryCount} entries
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
